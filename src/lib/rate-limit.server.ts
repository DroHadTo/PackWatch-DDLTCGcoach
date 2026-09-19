import { getRequest } from "@tanstack/react-start/server";

export type RateLimitBucket = "auth" | "public-read" | "search" | "shared-learning" | "expensive";

type Limit = { limit: number; windowSeconds: number };
type Decision = Limit & { remaining: number; resetAt: number; allowed: boolean };

const DEFAULT_LIMITS: Record<RateLimitBucket, Limit> = {
  auth: { limit: 8, windowSeconds: 60 },
  "public-read": { limit: 90, windowSeconds: 60 },
  search: { limit: 30, windowSeconds: 60 },
  "shared-learning": { limit: 10, windowSeconds: 60 },
  expensive: { limit: 20, windowSeconds: 60 },
};

const globalState = globalThis as typeof globalThis & {
  __packwatchRateLimits__?: Map<string, { count: number; resetAt: number }>;
};
const localWindows =
  globalState.__packwatchRateLimits__ ?? (globalState.__packwatchRateLimits__ = new Map());

// Configure Upstash in production for a durable, multi-instance window. The
// in-memory fallback keeps local development usable, but is process-local and
// must not be treated as a distributed production limiter.

function envNumber(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

export function rateLimitConfig(bucket: RateLimitBucket): Limit {
  const key = bucket.toUpperCase().replace("-", "_");
  return {
    limit: envNumber(`PACKWATCH_RATE_LIMIT_${key}`, DEFAULT_LIMITS[bucket].limit),
    windowSeconds: envNumber(
      `PACKWATCH_RATE_WINDOW_${key}_SECONDS`,
      DEFAULT_LIMITS[bucket].windowSeconds,
    ),
  };
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function keyFor(request: Request, bucket: RateLimitBucket, userId?: string): string {
  return `packwatch:${bucket}:${clientIp(request)}:${userId ? `user:${userId}` : "guest"}`;
}

async function upstashDecision(key: string, limit: Limit): Promise<Decision | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["INCR", key]),
    signal: AbortSignal.timeout(1500),
  });
  if (!response.ok) throw new Error(`Upstash returned ${response.status}.`);
  const result = (await response.json()) as { result?: number };
  const count = Number(result.result);
  if (!Number.isInteger(count) || count < 1) throw new Error("Upstash returned an invalid counter.");
  if (count === 1) {
    const expiry = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EXPIRE", key, limit.windowSeconds]),
      signal: AbortSignal.timeout(1500),
    });
    if (!expiry.ok) throw new Error(`Upstash expiry returned ${expiry.status}.`);
  }
  const resetAt = Date.now() + limit.windowSeconds * 1000;
  return { ...limit, remaining: Math.max(0, limit.limit - count), resetAt, allowed: count <= limit.limit };
}

function localDecision(key: string, limit: Limit): Decision {
  const now = Date.now();
  const current = localWindows.get(key);
  const resetAt = current && current.resetAt > now ? current.resetAt : now + limit.windowSeconds * 1000;
  const count = current && current.resetAt > now ? current.count + 1 : 1;
  localWindows.set(key, { count, resetAt });
  if (localWindows.size > 10_000) {
    for (const [entryKey, entry] of localWindows) {
      if (entry.resetAt <= now) localWindows.delete(entryKey);
    }
  }
  return { ...limit, remaining: Math.max(0, limit.limit - count), resetAt, allowed: count <= limit.limit };
}

export class RateLimitError extends Error {
  readonly status = 429;
  readonly decision: Decision;

  constructor(decision: Decision) {
    super("Too many requests. Please try again later.");
    this.name = "RateLimitError";
    this.decision = decision;
  }
}

export function rateLimitHeaders(decision: Decision): Headers {
  const headers = new Headers();
  headers.set("X-RateLimit-Limit", String(decision.limit));
  headers.set("X-RateLimit-Remaining", String(decision.remaining));
  headers.set("X-RateLimit-Reset", String(Math.ceil(decision.resetAt / 1000)));
  if (!decision.allowed) {
    headers.set("Retry-After", String(Math.max(1, Math.ceil((decision.resetAt - Date.now()) / 1000))));
  }
  return headers;
}

export async function enforceRateLimit(options: {
  bucket: RateLimitBucket;
  request?: Request;
  userId?: string;
  failClosed?: boolean;
}): Promise<Decision> {
  const request = options.request ?? getRequest();
  if (!request) throw new Error("Rate limiting requires a request context.");
  const limit = rateLimitConfig(options.bucket);
  const key = keyFor(request, options.bucket, options.userId);
  try {
    const decision = (await upstashDecision(key, limit)) ?? localDecision(key, limit);
    if (!decision.allowed) throw new RateLimitError(decision);
    return decision;
  } catch (error) {
    if (error instanceof RateLimitError) throw error;
    if (options.failClosed) throw error;
    console.error("[packwatch] read rate limiter unavailable; using local fallback", error);
    return localDecision(key, limit);
  }
}
