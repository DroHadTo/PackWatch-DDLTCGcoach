"use client";

export function LandingPage({ onGuest }: { onGuest: () => void }) {
  return (
    <main className="mx-auto min-h-dvh max-w-5xl px-5 py-6 md:px-10 md:py-10">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl border border-accent/60 bg-accent/10 text-accent shadow-[0_0_26px_rgba(230,165,47,0.14)]">
            <span className="text-2xl">✦</span>
          </div>
          <div>
            <p className="font-mono text-[11px] font-bold tracking-[0.28em] text-accent">PACKWATCH</p>
            <p className="text-sm text-muted">DDL coaching system</p>
          </div>
        </div>
        <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-accent/60 bg-accent/10 px-3 text-xs font-bold text-accent">
          <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_currentColor]" />
          Advice only
        </span>
      </header>

      <section className="grid gap-10 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-24">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.28em] text-accent">/ READ THE BOARD / LEARN THE WHY</p>
          <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-fg md:text-7xl">
            Make the next choice
            <span className="block text-accent">more explainable.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-muted md:text-lg">
            Packwatch observes a DDL match through a local read-only watcher, checks official rules and card text, and turns the position into a calm coaching note. You keep control of every move.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onGuest} className="min-h-14 rounded-lg bg-accent px-7 text-sm font-black text-accent-fg shadow-[0_8px_30px_rgba(230,165,47,0.18)] transition-transform hover:-translate-y-0.5">
              Continue as guest
            </button>
            <p className="self-center text-sm text-muted">Explore the watcher and practice surfaces. No game login.</p>
          </div>
        </div>

        <article className="rounded-2xl border border-border bg-surface/80 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur">
          <div className="flex items-start justify-between border-b border-border pb-4">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[0.24em] text-accent">FIRST SIGNAL</p>
              <p className="mt-2 text-2xl font-black text-fg">Taunt in lane 2</p>
            </div>
            <span className="rounded-full border border-ok/50 px-2.5 py-1 text-xs text-ok">observed</span>
          </div>
          <div className="space-y-5 py-5 text-sm">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Observed</p>
              <p className="mt-1 leading-6 text-fg">3 mana, open face, one Taunt body.</p>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Consider</p>
              <p className="mt-1 leading-6 text-fg">Clear the kill-gate before pushing face.</p>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Boundary</p>
              <p className="mt-1 leading-6 text-muted">No clicks. No typing. No guessed outcomes.</p>
            </div>
          </div>
          <p className="border-t border-border pt-4 text-xs leading-5 text-muted">Evidence is separated from recommendation, so every lesson can be checked later.</p>
        </article>
      </section>

      <section className="grid gap-3 border-t border-border pt-6 md:grid-cols-3">
        {[
          ["01", "See the position", "Connect any browser or play surface through the local watcher, or paste the board."],
          ["02", "Understand the line", "Official DDLTCG rules and the 111-card snapshot are the ground truth."],
          ["03", "Keep agency", "Packwatch explains. You decide, click, type, and submit."],
        ].map(([n, t, d]) => (
          <article key={t} className="rounded-xl border border-border bg-surface/55 p-5">
            <p className="font-mono text-xs font-bold text-accent">{n}</p>
            <h2 className="mt-4 text-xl font-black text-fg">{t}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{d}</p>
          </article>
        ))}
      </section>
      <footer className="pt-12 text-center text-xs text-muted">Human decides every move. Packwatch observes. Packwatch explains.</footer>
    </main>
  );
}
