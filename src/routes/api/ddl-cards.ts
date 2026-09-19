import { createFileRoute } from "@tanstack/react-router";
import { enforceRateLimit, rateLimitHeaders, RateLimitError } from "@/lib/rate-limit.server";

const CARDS_URL = "https://ddltcg.com/data/cards.json";
const MAX_RESPONSE_BYTES = 2_000_000;
const SOURCE_CACHE_CONTROL = "public, max-age=300, stale-while-revalidate=1800";

export const Route = createFileRoute("/api/ddl-cards")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const decision = await enforceRateLimit({ bucket: "public-read", failClosed: false });
          const response = await fetch(CARDS_URL, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(10_000),
          });
          if (!response.ok) {
            return Response.json({ error: `Official card source returned ${response.status}.` }, { status: 502, headers: rateLimitHeaders(decision) });
          }
          const body = await response.text();
          if (new TextEncoder().encode(body).byteLength > MAX_RESPONSE_BYTES) {
            return Response.json({ error: "Official card source exceeded the response limit." }, { status: 502, headers: rateLimitHeaders(decision) });
          }
          const payload: unknown = JSON.parse(body);
          if (!Array.isArray(payload) || payload.length === 0 || payload.length > 500) {
            return Response.json({ error: "Official card source returned an invalid card collection." }, { status: 502, headers: rateLimitHeaders(decision) });
          }
          return new Response(body, {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": SOURCE_CACHE_CONTROL,
              "X-Content-Type-Options": "nosniff",
              "X-Packwatch-Source": CARDS_URL,
              ...Object.fromEntries(rateLimitHeaders(decision).entries()),
            },
          });
        } catch (error) {
          if (error instanceof RateLimitError) {
            return Response.json(
              { error: "Too many card requests. Please try again later." },
              { status: 429, headers: rateLimitHeaders(error.decision) },
            );
          }
          console.error("[packwatch] official card refresh failed", error);
          return Response.json({ error: "Official card source is temporarily unavailable." }, { status: 503 });
        }
      },
    },
  },
});
