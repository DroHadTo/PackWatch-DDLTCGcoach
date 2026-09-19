"use client";

import { OFFICIAL_CARDS, OFFICIAL_COUNT } from "@/lib/ddl/official-cards";
import { OFFICIAL_RULES } from "@/lib/ddl/official-rules";
import { OFFICIAL_CARDS_URL, OFFICIAL_RULES_URL, OFFICIAL_SNAPSHOT } from "@/lib/packwatch-config";
import { useMemo, useState } from "react";

export function KnowledgePage() {
  const [q, setQ] = useState("");
  const cards = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return OFFICIAL_CARDS.slice(0, 18);
    return OFFICIAL_CARDS.filter(
      (c) =>
        c.name.toLowerCase().includes(n) ||
        c.id.toLowerCase().includes(n) ||
        c.class.toLowerCase().includes(n),
    ).slice(0, 24);
  }, [q]);

  return (
    <div className="pw-stagger flex flex-col gap-4">
      <p className="font-mono text-xs tracking-wide text-muted">/ knowledge / rules base</p>
      <h2 className="font-display text-3xl tracking-tight">Facts first. Hypotheses stay marked.</h2>
      <p className="max-w-prose text-sm leading-relaxed text-muted">
        {OFFICIAL_COUNT} official cards from {OFFICIAL_CARDS_URL}. Rules from {OFFICIAL_RULES_URL}. Snapshot{" "}
        {OFFICIAL_SNAPSHOT}. Printed card text wins. Wayne V029 is excluded online.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <p className="pw-panel rounded-lg border border-border bg-surface px-3 py-2 text-sm">{OFFICIAL_COUNT} cards</p>
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
          <ul className="mt-3 space-y-2">
            {cards.map((c) => (
              <li key={c.id} className="rounded-lg border border-border px-3 py-2 text-sm">
                <p>
                  {c.name}{" "}
                  <span className="font-mono text-xs text-muted">
                    {c.id} · {c.class} · {c.type}
                  </span>
                </p>
                <p className="text-muted">
                  {c.mana ?? "—"} mana
                  {c.type === "Creature" ? ` · ${c.attack}/${c.hp}` : ""}
                  {c.keywords.length ? ` · ${c.keywords.join(", ")}` : ""}
                  {c.banned ? " · excluded online" : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
