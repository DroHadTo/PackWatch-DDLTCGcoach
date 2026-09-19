import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { assertSameSiteRequest } from "@/lib/auth/isolation.server";
import { authConfigured, getSessionUser } from "@/lib/auth/verify.server";
import { CONSENT_POLICY_VERSION } from "@/lib/learning/policy";
import { enforceRateLimit, rateLimitHeaders, RateLimitError } from "@/lib/rate-limit.server";

const ALLOWED_KEYS = new Set(["packOutcome", "cardLabels", "modelUpdateApproved"]);

function responseBody(body: Record<string, unknown>, status = 200, headers?: Headers): Response {
  const merged = new Headers({ "Content-Type": "application/json; charset=utf-8", "X-Content-Type-Options": "nosniff" });
  headers?.forEach((value, key) => merged.set(key, value));
  return Response.json(body, { status, headers: merged });
}

function sanitizeSignal(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(input)) {
    if (!ALLOWED_KEYS.has(key)) return null;
    if (typeof item === "string") {
      if (item.length > 200) return null;
      output[key] = item;
    } else if (typeof item === "boolean") {
      output[key] = item;
    } else if (Array.isArray(item) && item.every((entry) => typeof entry === "string" && entry.length <= 80) && item.length <= 20) {
      output[key] = item;
    } else {
      return null;
    }
  }
  return Object.keys(output).length > 0 ? output : null;
}

export const Route = createFileRoute("/api/learning/share")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          assertSameSiteRequest();
          const user = await getSessionUser();
          const decision = await enforceRateLimit({
            bucket: "shared-learning",
            request,
            userId: user?.id,
            failClosed: true,
          });
          if (!authConfigured) return responseBody({ error: "CONSENT_REQUIRED" }, 403, rateLimitHeaders(decision));
          if (!user) return responseBody({ error: "CONSENT_REQUIRED" }, 403, rateLimitHeaders(decision));
          let body: { policyVersion?: unknown; signal?: unknown };
          try {
            body = (await request.json()) as { policyVersion?: unknown; signal?: unknown };
          } catch {
            return responseBody({ error: "Invalid learning contribution." }, 400, rateLimitHeaders(decision));
          }
          const signal = sanitizeSignal(body.signal);
          if (body.policyVersion !== CONSENT_POLICY_VERSION || !signal) {
            return responseBody({ error: "Invalid learning contribution." }, 400, rateLimitHeaders(decision));
          }
          const sql = await getSql();
          const consent = await sql.query<{ status: string; policy_version: string }>(
            "select status, policy_version from packwatch_learning_consent where user_id = $1",
            [user.id],
          );
          if (consent[0]?.status !== "granted" || consent[0]?.policy_version !== CONSENT_POLICY_VERSION) {
            return responseBody({ error: consent[0]?.status === "denied" ? "CONSENT_DENIED" : "CONSENT_REQUIRED" }, 403, rateLimitHeaders(decision));
          }
          await sql.query(
            "insert into packwatch_learning_contributions (user_id, signal) values ($1, $2::jsonb)",
            [user.id, JSON.stringify(signal)],
          );
          return responseBody({ accepted: true }, 202, rateLimitHeaders(decision));
        } catch (error) {
          if (error instanceof RateLimitError) return responseBody({ error: "RATE_LIMITED" }, 429, rateLimitHeaders(error.decision));
          console.error("[packwatch] learning contribution failed", error);
          return responseBody({ error: "Contribution unavailable." }, 503);
        }
      },
    },
  },
});
