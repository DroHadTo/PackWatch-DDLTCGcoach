"use client";

import { useBrain } from "@/lib/ddl/store";

export function ProgressPage() {
  const b = useBrain();
  const n = b.lessons.length;
  const events = b.game.events;
  const illegal = events.filter((event) => event.kind === "illegal").length;
  const scans = events.filter((event) => event.kind === "scan").length;
  const cardsSeen = b.controls.reduce((total, control) => total + control.seen, 0);
  const focus = b.lessons[0]?.kind;
  const wins = b.matchHistory.filter((match) => match.result === "win").length;
  const losses = b.matchHistory.filter((match) => match.result === "loss").length;
  const draws = b.matchHistory.filter((match) => match.result === "draw").length;
  return (
    <div className="pw-stagger flex flex-col gap-4">
      <p className="font-mono text-xs tracking-wide text-muted">/ progress / evidence</p>
      <h2 className="font-display text-3xl tracking-tight">Learning you can inspect.</h2>
      <p className="max-w-prose text-sm leading-relaxed text-muted">
        Packwatch never silently rewrites history. Misplays from practice and live calls stay visible so you can
        challenge them.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <p className="pw-panel rounded-lg border border-border bg-surface px-3 py-2 text-sm">{n} records</p>
        <p className="pw-panel rounded-lg border border-border bg-surface px-3 py-2 text-sm">{b.controls.length} labels seen</p>
        <p className="pw-panel rounded-lg border border-border bg-surface px-3 py-2 text-sm">{illegal} illegal actions</p>
        <p className="pw-panel rounded-lg border border-border bg-surface px-3 py-2 text-sm">{scans} board reads</p>
        <p className="pw-panel rounded-lg border border-border bg-surface px-3 py-2 text-sm">Local · this device</p>
      </div>
      <section className="pw-panel rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl">Practice record</h3>
          <span className="font-mono text-xs text-muted">{b.matchHistory.length} finished</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <p className="rounded-lg border border-ok/40 px-3 py-2"><span className="block text-xs text-muted">Wins</span>{wins}</p>
          <p className="rounded-lg border border-danger/40 px-3 py-2"><span className="block text-xs text-muted">Losses</span>{losses}</p>
          <p className="rounded-lg border border-border px-3 py-2"><span className="block text-xs text-muted">Draws</span>{draws}</p>
        </div>
        {b.matchHistory[0] && (
          <p className="mt-3 text-sm text-muted">
            Last {b.matchHistory[0].result} after {b.matchHistory[0].turnCount} turns · {b.matchHistory[0].lessons} lessons recorded.
          </p>
        )}
      </section>
      <section className="pw-panel rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted">COACH FOCUS</p>
            <h3 className="mt-1 font-display text-xl">{focus ?? "Build your first lesson"}</h3>
          </div>
          <span className="rounded-full border border-ok/50 px-2 py-1 text-xs text-ok">{cardsSeen} observations</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          These metrics are calculated from this device's practice and board-call state. They are not analytics and are
          never uploaded unless you separately opt into shared learning.
        </p>
      </section>
      <section className="pw-panel rounded-xl border border-border bg-surface p-4">
        <h3 className="font-display text-xl">Timeline</h3>
        {n === 0 ? (
          <p className="mt-2 text-sm text-muted">No lessons yet. Practice a match or call a live board.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {b.lessons.map((l) => (
              <li key={l.id}>
                <p className="text-sm font-medium">{l.title}</p>
                <p className="text-sm text-muted">{l.detail}</p>
                <p className="font-mono text-[10px] tracking-wide text-faint">{l.kind}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
