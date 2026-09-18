import { createServerFn } from "@tanstack/react-start";

function extractLabels(html: string) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const keys = [
    "Hot Pack",
    "Log",
    "New Game",
    "End Turn",
    "Resume",
    "Cancel",
    "Confirm",
    "Play Again",
    "Change decks",
    "Sign in",
    "Create account",
    "Vs Pack",
    "Vs Bot",
    "Boost",
    "Tutorial",
    "How to Play",
    "Leaderboard",
    "YOUR TURN",
    "Graveyard",
    "Taunt",
    "Watching",
  ];
  const found = keys.filter((k) => text.toLowerCase().includes(k.toLowerCase()));
  const extra = Array.from(text.matchAll(/\b([A-Z][A-Za-z][A-Za-z]+(?: [A-Z][A-Za-z]+)?)\b/g))
    .map((m) => m[1])
    .filter((w) => w.length > 3 && w.length < 24);
  return { textSlice: text.slice(0, 1200), found, extra: [...new Set(extra)].slice(0, 40) };
}

export const scanOfficial = createServerFn({ method: "POST" }).handler(async () => {
  const urls = ["https://ddltcg.com/play", "https://ddltcg.com/rules", "https://ddltcg.com/gallery"];
  const pages: { url: string; ok: boolean; found: string[]; extra: string[]; textSlice: string }[] = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(8000) });
      const html = await res.text();
      const ex = extractLabels(html);
      pages.push({ url, ok: res.ok, ...ex });
    } catch (err) {
      pages.push({
        url,
        ok: false,
        found: [],
        extra: [],
        textSlice: err instanceof Error ? err.message : "fetch failed",
      });
    }
  }
  return { at: Date.now(), pages };
});
