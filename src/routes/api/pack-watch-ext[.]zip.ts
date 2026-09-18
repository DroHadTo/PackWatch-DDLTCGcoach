import { createFileRoute } from "@tanstack/react-router";
import { PACK_WATCH_ZIP_B64 } from "@/lib/ddl/pack-watch-zip";

function zipBytes() {
  const bin = Buffer.from(PACK_WATCH_ZIP_B64, "base64");
  return new Uint8Array(bin);
}

export const Route = createFileRoute("/api/pack-watch-ext.zip" as never)({
  server: {
    handlers: {
      GET: async () => {
        return new Response(zipBytes(), {
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": 'attachment; filename="pack-watch-ext.zip"',
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
