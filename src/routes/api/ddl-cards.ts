import { createFileRoute } from "@tanstack/react-router";

const CARDS_URL = "https://ddltcg.com/data/cards.json";

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
          return new Response(body, {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": "public, max-age=300, stale-while-revalidate=1800",
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
