import { createFileRoute } from "@tanstack/react-router";

const CARDS_URL = "https://ddltcg.com/data/cards.json";
const MAX_RESPONSE_BYTES = 2_000_000;
const SOURCE_CACHE_CONTROL = "public, max-age=300, stale-while-revalidate=1800";

export const Route = createFileRoute("/api/ddl-cards")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const response = await fetch(CARDS_URL, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(10_000),
          });
          if (!response.ok) {
            return Response.json({ error: `Official card source returned ${response.status}.` }, { status: 502 });
          }
          const body = await response.text();
          if (new TextEncoder().encode(body).byteLength > MAX_RESPONSE_BYTES) {
            return Response.json({ error: "Official card source exceeded the response limit." }, { status: 502 });
          }
          const payload: unknown = JSON.parse(body);
          if (!Array.isArray(payload) || payload.length === 0 || payload.length > 500) {
            return Response.json({ error: "Official card source returned an invalid card collection." }, { status: 502 });
          }
          return new Response(body, {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": SOURCE_CACHE_CONTROL,
              "X-Content-Type-Options": "nosniff",
              "X-Packwatch-Source": CARDS_URL,
            },
          });
        } catch (error) {
          console.error("[packwatch] official card refresh failed", error);
          return Response.json({ error: "Official card source is temporarily unavailable." }, { status: 503 });
        }
      },
    },
  },
});
