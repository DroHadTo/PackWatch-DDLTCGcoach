"use client";

import { useBrain } from "@/lib/ddl/store";

export function ProgressPage() {
  const b = useBrain();
  const n = b.lessons.length;
  return (
    <div className="pw-stagger flex flex-col gap-4">
      <p className="font-mono text-xs tracking-wide text-muted">/ progress / evidence</p>
      <h2 className="font-display text-3xl tracking-tight">Learning you can inspect.</h2>
      <p className="max-w-prose text-sm leading-relaxed text-muted">
        Packwatch never silently rewrites history. Misplays from practice and live calls stay visible so you can
        challenge them.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <p className="pw-panel rounded-lg border border-border bg-surface px-3 py-2 text-sm">{n} records</p>
        <p className="pw-panel rounded-lg border border-border bg-surface px-3 py-2 text-sm">{b.controls.length} labels seen</p>
        <p className="pw-panel rounded-lg border border-border bg-surface px-3 py-2 text-sm">Guest · this device</p>
      </div>
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
