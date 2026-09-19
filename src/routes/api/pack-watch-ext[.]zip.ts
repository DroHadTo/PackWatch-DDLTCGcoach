import { createFileRoute } from "@tanstack/react-router";
import { PACK_WATCH_ZIP_B64 } from "@/lib/ddl/pack-watch-zip";
import { enforceRateLimit, rateLimitHeaders, RateLimitError } from "@/lib/rate-limit.server";

function zipBytes() {
  const bin = Buffer.from(PACK_WATCH_ZIP_B64, "base64");
  return new Uint8Array(bin);
}

export const Route = createFileRoute("/api/pack-watch-ext.zip")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const decision = await enforceRateLimit({ bucket: "public-read", failClosed: false });
          return new Response(zipBytes(), {
            headers: {
              "Content-Type": "application/zip",
              "Content-Disposition": 'attachment; filename="pack-watch-ext.zip"',
              "Cache-Control": "no-store",
              ...Object.fromEntries(rateLimitHeaders(decision).entries()),
            },
          });
        } catch (error) {
          if (error instanceof RateLimitError) {
            return Response.json({ error: "Too many download requests. Please try again later." }, {
              status: 429,
              headers: rateLimitHeaders(error.decision),
            });
          }
          console.error("[packwatch] extension download limiter failed", error);
          return Response.json({ error: "Download protection is temporarily unavailable." }, { status: 503 });
        }
      },
    },
  },
});
