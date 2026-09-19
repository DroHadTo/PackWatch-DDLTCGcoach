"use client";

import { defOf } from "@/lib/ddl/cards";
import { useBrain } from "@/lib/ddl/store";

export function CoachPanels() {
  const b = useBrain();
  const { game } = b;
  const oppBodies = game.bot.lanes.filter(Boolean).length;
  const youBodies = game.you.lanes.filter(Boolean).length;
  const taunt = game.bot.lanes.some((c) => c && defOf(c.defId).keywords.includes("Taunt"));

  return (
    <div className="flex flex-col gap-3">
      <section className="pw-panel rounded-xl border border-border bg-surface p-4">
        <p className="text-xs font-medium tracking-wide text-muted">Advice</p>
        <p className="mt-1 font-display text-xl leading-snug">{b.watching ? b.lastScan || b.coachLine.now : b.coachLine.now}</p>
        {b.notice && <p className="mt-2 text-sm">{b.notice}</p>}
        {b.coachLine.legal[0] && <p className="mt-3 text-sm text-ok">{b.coachLine.legal[0]}</p>}
        {b.coachLine.dont[0] && <p className="mt-2 text-sm text-danger">{b.coachLine.dont[0]}</p>}
      </section>
      <section className="pw-panel rounded-xl border border-border bg-surface p-4">
        <p className="text-xs font-medium tracking-wide text-muted">Deck tracker</p>
        <p className="mt-1 text-sm">
          You {game.you.hp}/40 · mana {game.you.mana}/{game.you.manaCap} · hand {game.you.hand.length} · deck {game.you.deck.length} · grave {game.you.grave.length}
        </p>
        <p className="mt-1 text-sm text-muted">Bodies {youBodies}/5 · back {game.you.back.filter(Boolean).length}/5</p>
      </section>
      <section className="pw-panel rounded-xl border border-border bg-surface p-4">
        <p className="text-xs font-medium tracking-wide text-muted">Opponent</p>
        <p className="mt-1 text-sm">
          {game.bot.hp}/40 · bodies {oppBodies}/5 · {taunt ? "Taunt up" : "face open"}
        </p>
      </section>
      <section className="pw-panel rounded-xl border border-border bg-surface p-4">
        <p className="text-xs font-medium tracking-wide text-muted">Lessons</p>
        {b.lessons[0] ? (
          <ul className="mt-2 space-y-2 text-sm">
            {b.lessons.slice(0, 4).map((l) => (
              <li key={l.id}>
                <span className="text-danger">{l.title}</span>
                <span className="block text-muted">{l.detail}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-muted">Illegal taps get remembered and replayed on matching boards.</p>
        )}
      </section>
      <section className="pw-panel rounded-xl border border-border bg-surface p-4">
        <p className="text-xs font-medium tracking-wide text-muted">Stats</p>
        <p className="mt-1 text-sm">
          Turn {game.turnNo} · {game.events.filter((e) => e.kind === "illegal").length} illegal · {b.lessons.length} lessons
        </p>
      </section>
    </div>
  );
}
