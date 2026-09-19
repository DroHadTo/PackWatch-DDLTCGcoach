import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { assertSameSiteRequest } from "@/lib/auth/isolation.server";
import { authConfigured, getSessionUser } from "@/lib/auth/verify.server";
import { CONSENT_POLICY_VERSION, type ConsentSource } from "@/lib/learning/policy";
import { enforceRateLimit, rateLimitHeaders, RateLimitError } from "@/lib/rate-limit.server";

const jsonHeaders = { "Content-Type": "application/json; charset=utf-8", "X-Content-Type-Options": "nosniff" };

function errorResponse(message: string, status: number, headers?: Headers): Response {
  const merged = new Headers(jsonHeaders);
  headers?.forEach((value, key) => merged.set(key, value));
  return Response.json({ error: message }, { status, headers: merged });
}

async function userIdOrNull(): Promise<string | null> {
  return (await getSessionUser())?.id ?? null;
}

export const Route = createFileRoute("/api/consent")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const decision = await enforceRateLimit({ bucket: "public-read" });
          const userId = await userIdOrNull();
          if (!userId) {
            return Response.json(
              { status: "unset", updatedAt: null, policyVersion: CONSENT_POLICY_VERSION, source: null, persisted: false },
              { headers: new Headers([...Object.entries(jsonHeaders), ...rateLimitHeaders(decision).entries()]) },
            );
          }
          const sql = await getSql();
          const rows = await sql.query<{
            status: "granted" | "denied";
            updated_at: string;
            policy_version: string;
            source: ConsentSource;
          }>(
            "select status, updated_at, policy_version, source from packwatch_learning_consent where user_id = $1",
            [userId],
          );
          const row = rows[0];
          return Response.json(
            row
              ? { status: row.status, updatedAt: row.updated_at, policyVersion: row.policy_version, source: row.source, persisted: true }
              : { status: "unset", updatedAt: null, policyVersion: CONSENT_POLICY_VERSION, source: null, persisted: true },
            { headers: new Headers([...Object.entries(jsonHeaders), ...rateLimitHeaders(decision).entries()]) },
          );
        } catch (error) {
          if (error instanceof RateLimitError) {
            return errorResponse("Too many consent requests. Try again later.", 429, rateLimitHeaders(error.decision));
          }
          console.error("[packwatch] consent read failed", error);
          return errorResponse("Consent status is temporarily unavailable.", 503);
        }
      },
      PUT: async ({ request }) => {
        try {
          assertSameSiteRequest();
          const decision = await enforceRateLimit({ bucket: "shared-learning", request, failClosed: true });
          let body: Record<string, unknown>;
          try {
            body = (await request.json()) as Record<string, unknown>;
          } catch {
            return errorResponse("Invalid consent update.", 400, rateLimitHeaders(decision));
          }
          const status = body.status;
          const source = body.source;
          if (
            (status !== "granted" && status !== "denied") ||
            (source !== "prompt" && source !== "settings") ||
            body.policyVersion !== CONSENT_POLICY_VERSION
          ) {
            return errorResponse("Invalid consent update.", 400, rateLimitHeaders(decision));
          }
          if (!authConfigured) return Response.json({ persisted: false }, { headers: rateLimitHeaders(decision) });
          const userId = await userIdOrNull();
          if (!userId) return errorResponse("Sign in is required to persist account consent.", 401, rateLimitHeaders(decision));
          const sql = await getSql();
          await sql.query(
            `insert into packwatch_learning_consent (user_id, status, policy_version, source, updated_at)
             values ($1, $2, $3, $4, now())
             on conflict (user_id) do update set status = excluded.status, policy_version = excluded.policy_version,
             source = excluded.source, updated_at = now()`,
            [userId, status, CONSENT_POLICY_VERSION, source],
          );
          await sql.query(
            "insert into packwatch_consent_events (user_id, status, policy_version, source) values ($1, $2, $3, $4)",
            [userId, status, CONSENT_POLICY_VERSION, source],
          );
          return Response.json({ status, policyVersion: CONSENT_POLICY_VERSION, persisted: true }, { headers: rateLimitHeaders(decision) });
        } catch (error) {
          if (error instanceof RateLimitError) {
            return errorResponse("Too many consent updates. Try again later.", 429, rateLimitHeaders(error.decision));
          }
          console.error("[packwatch] consent update failed", error);
          return errorResponse("Consent could not be updated.", 503);
        }
      },
      DELETE: async ({ request }) => {
        try {
          assertSameSiteRequest();
          const decision = await enforceRateLimit({ bucket: "shared-learning", request, failClosed: true });
          if (!authConfigured) return Response.json({ status: "denied", persisted: false }, { headers: rateLimitHeaders(decision) });
          const userId = await userIdOrNull();
          if (!userId) return errorResponse("Sign in is required to withdraw account consent.", 401, rateLimitHeaders(decision));
          const sql = await getSql();
          await sql.query("delete from packwatch_learning_contributions where user_id = $1", [userId]);
          await sql.query("delete from packwatch_learning_consent where user_id = $1", [userId]);
          await sql.query(
            "insert into packwatch_consent_events (user_id, status, policy_version, source) values ($1, 'denied', $2, 'settings')",
            [userId, CONSENT_POLICY_VERSION],
          );
          return Response.json({ status: "denied", persisted: true }, { headers: rateLimitHeaders(decision) });
        } catch (error) {
          if (error instanceof RateLimitError) {
            return errorResponse("Too many consent updates. Try again later.", 429, rateLimitHeaders(error.decision));
          }
          console.error("[packwatch] consent withdrawal failed", error);
          return errorResponse("Consent could not be withdrawn.", 503);
        }
      },
    },
  },
});
