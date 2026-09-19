"use client";

import { OFFICIAL_CARDS } from "@/lib/ddl/official-cards";
import { OFFICIAL_RULES } from "@/lib/ddl/official-rules";
import { OFFICIAL_CARDS_URL, OFFICIAL_RULES_URL, OFFICIAL_SNAPSHOT } from "@/lib/packwatch-config";
import { useEffect, useMemo, useState } from "react";

function cardBenefit(card: (typeof OFFICIAL_CARDS)[number]) {
  if (card.banned) return "Competitive note: excluded from online recommendations.";
  if (card.keywords.includes("Taunt")) return "Defensive benefit: protects adjacent priorities and buys time.";
  if (card.keywords.includes("Rush")) return "Tempo benefit: can influence the board immediately, but not the enemy Hero on entry.";
  if (card.keywords.includes("Poison")) return "Trade benefit: threatens to destroy a creature it fights.";
  if (card.keywords.includes("Fury")) return "Pressure benefit: can attack twice when ready.";
  if (card.keywords.includes("Frozen")) return "Control benefit: restricts an opposing creature's attacks.";
  if (card.text) return "Text-led benefit: use the printed effect as the primary value signal.";
  if (card.type === "Creature") return "Board benefit: adds a body to a lane with the listed attack and health.";
  return "Utility benefit: evaluate its printed effect against the current board and mana.";
}

export function KnowledgePage() {
  const [q, setQ] = useState("");
  const [cards, setCards] = useState(OFFICIAL_CARDS);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncState, setSyncState] = useState<"snapshot" | "refreshing" | "live" | "error">("snapshot");
  const filteredCards = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return cards;
    return cards.filter(
      (c) =>
        c.name.toLowerCase().includes(n) ||
        c.id.toLowerCase().includes(n) ||
        c.class.toLowerCase().includes(n),
    );
  }, [q, cards]);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      if (active) setSyncState("refreshing");
      try {
        const response = await fetch("/api/ddl-cards", { cache: "no-store" });
        if (!response.ok) throw new Error(`refresh failed: ${response.status}`);
        const remote = (await response.json()) as Array<Record<string, unknown>>;
        const normalized = remote
          .filter((card) => typeof card.id === "string" && typeof card.name === "string")
          .map((card) => ({
            id: String(card.id),
            name: String(card.name),
            class: String(card.class ?? ""),
            type: String(card.type ?? ""),
            mana: typeof card.mana === "number" ? card.mana : null,
            attack: typeof card.attack === "number" ? card.attack : null,
            hp: typeof card.hp === "number" ? card.hp : null,
            keywords: Array.isArray(card.keywords) ? card.keywords.map(String) : typeof card.keyword === "string" && card.keyword ? [card.keyword] : [],
            text: String(card.description ?? ""),
            rarity: String(card.rarity ?? ""),
            tier: String(card.tier ?? ""),
            imageUrl: String(card.art ?? ""),
            banned: String(card.id) === "V029",
          }));
        if (active && normalized.length > 0) {
          setCards(normalized);
          setLastSync(new Date());
          setSyncState("live");
        }
      } catch (error) {
        console.error("[packwatch] knowledge refresh failed", error);
        if (active) setSyncState("error");
      }
    };
    void refresh();
    const timer = window.setInterval(refresh, 30 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="pw-stagger flex flex-col gap-4">
      <p className="font-mono text-xs tracking-wide text-muted">/ knowledge / rules base</p>
      <h2 className="font-display text-3xl tracking-tight">Facts first. Hypotheses stay marked.</h2>
      <p className="max-w-prose text-sm leading-relaxed text-muted">
        {cards.length} official cards from {OFFICIAL_CARDS_URL}. Rules from {OFFICIAL_RULES_URL}. Snapshot{" "}
        {OFFICIAL_SNAPSHOT}. Printed card text wins. Wayne V029 is excluded online.{" "}
        <span className="text-accent">
          {syncState === "refreshing" ? "Refreshing source…" : syncState === "error" ? "Using the last verified snapshot." : lastSync ? `Synced ${lastSync.toLocaleTimeString()}.` : "Using the verified snapshot."}
        </span>
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <p className="pw-panel rounded-lg border border-border bg-surface px-3 py-2 text-sm">{cards.length} cards</p>
        <p className="pw-panel rounded-lg border border-border bg-surface px-3 py-2 text-sm">{OFFICIAL_RULES.length} rule sections</p>
        <p className="pw-panel rounded-lg border border-border bg-surface px-3 py-2 text-sm">Wayne banned</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="pw-panel rounded-xl border border-border bg-surface p-4">
          <h3 className="font-display text-xl">Official rules</h3>
          <ul className="mt-3 space-y-3">
            {OFFICIAL_RULES.map((r) => (
              <li key={r.section}>
                <p className="text-sm font-medium">{r.section}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{r.text}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="pw-panel rounded-xl border border-border bg-surface p-4">
          <h3 className="font-display text-xl">Official cards</h3>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Dash, V029, Pirate…"
            className="mt-3 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg"
          />
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {filteredCards.map((c) => (
              <li key={c.id} className="pw-panel rounded-lg border border-border px-3 py-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{c.name}{" "}
                  <span className="font-mono text-xs text-muted">
                    {c.id} · {c.class} · {c.type}
                  </span>
                  </p>
                  <span className="shrink-0 rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[10px] text-accent">{c.mana ?? "—"} mana</span>
                </div>
                <p className="mt-2 text-muted">
                  {c.mana ?? "—"} mana
                  {c.type === "Creature" ? ` · ${c.attack}/${c.hp}` : ""}
                  {c.keywords.length ? ` · ${c.keywords.join(", ")}` : ""}
                  {c.banned ? " · excluded online" : ""}
                </p>
                <p className="mt-2 text-fg">{c.text || "No additional printed effect."}</p>
                <p className="mt-2 border-t border-border pt-2 text-xs leading-5 text-ok"><span className="font-mono uppercase tracking-wider">Coach read · derived</span> — {cardBenefit(c)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
