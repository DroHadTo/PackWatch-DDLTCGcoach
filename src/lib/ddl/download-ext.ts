import { PACK_WATCH_ZIP_B64 } from "./pack-watch-zip";

function bytesFromB64(b64: string) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function downloadPackWatch(): Promise<"saved" | "opened"> {
  const blob = new Blob([bytesFromB64(PACK_WATCH_ZIP_B64)], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pack-watch-ext.zip";
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  try {
    window.open("/api/pack-watch-ext.zip", "_blank", "noopener,noreferrer");
  } catch {
    /* ignore */
  }
  return "saved";
}
