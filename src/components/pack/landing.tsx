"use client";

export function LandingPage({ onGuest }: { onGuest: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <p className="font-mono text-[10px] tracking-[0.22em] text-muted">PACKWATCH</p>
      <p className="mt-2 text-sm text-muted">DDL coaching system</p>
      <p className="mt-3 inline-flex min-h-8 items-center rounded-full border border-border px-3 text-xs tracking-wide">
        Advice only
      </p>
      <p className="mt-8 font-mono text-xs tracking-wide text-muted">/ read the board / learn the why</p>
      <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight md:text-5xl">
        Make the next choice more explainable.
      </h1>
      <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
        Packwatch observes a DDL match through a local read-only watcher, checks official rules and card text, and
        turns the position into a calm coaching note. You keep control of every move.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onGuest}
          className="inline-flex min-h-12 items-center rounded-md bg-accent px-5 text-sm font-medium text-accent-fg"
        >
          Continue as guest
        </button>
        <p className="self-center text-sm text-muted">Saves stay on this device. No game login. Wayne stays banned.</p>
      </div>
      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {[
          ["See the position", "Connect any browser or play surface through the local watcher, or paste the board."],
          ["Understand the line", "Official DDLTCG rules and the 111-card snapshot are the ground truth."],
          ["Keep agency", "Packwatch explains. You decide, click, type, and submit."],
        ].map(([t, d]) => (
          <article key={t} className="rounded-xl border border-border bg-surface p-4">
            <h2 className="font-display text-xl">{t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
          </article>
        ))}
      </div>
      <article className="mt-6 rounded-xl border border-border bg-surface p-5">
        <p className="font-mono text-[10px] tracking-wide text-muted">first signal</p>
        <p className="mt-2 font-display text-2xl">Taunt in lane 2</p>
        <p className="mt-3 text-sm">Observed: 3 mana, open face, one Taunt body.</p>
        <p className="mt-1 text-sm">Consider: Clear the kill-gate before pushing face.</p>
        <p className="mt-1 text-sm text-muted">Boundary: No clicks. No typing. No guessed outcomes.</p>
      </article>
    </main>
  );
}
