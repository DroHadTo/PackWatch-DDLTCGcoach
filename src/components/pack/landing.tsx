"use client";

export function LandingPage({ onGuest }: { onGuest: () => void }) {
  return (
    <main className="pw-shell mx-auto min-h-dvh max-w-6xl px-5 py-6 md:px-10 md:py-10">
      <header className="pw-reveal flex items-center justify-between gap-4">
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
          <span className="pw-signal size-2 rounded-full bg-accent shadow-[0_0_10px_currentColor]" />
          Advice only
        </span>
      </header>

      <section className="pw-stagger grid gap-10 py-16 md:grid-cols-[1fr_0.9fr] md:items-center md:py-24">
        <div>
          <p className="font-mono text-xs font-bold tracking-[0.28em] text-accent">/ DDLTCG COACH / EARLY ACCESS</p>
          <h1 className="pw-shimmer mt-5 max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-fg md:text-7xl">
            Play with a
            <span className="block text-accent">clearer line.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-muted md:text-lg">
            Packwatch is an advice-only DDLTCG coach. It reads the visible position, checks rules and card text, then explains what matters next — without ever taking the move for you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onGuest} className="min-h-14 rounded-lg bg-accent px-7 text-sm font-black text-accent-fg shadow-[0_8px_30px_rgba(230,165,47,0.18)] transition-transform hover:-translate-y-0.5">
              Enter the coach
            </button>
            <p className="self-center text-sm text-muted">Try the coach instantly. No game login.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            <span>Read-only watcher</span>
            <span>Rules grounded</span>
            <span>Human decides</span>
          </div>
        </div>

        <article className="pw-panel relative overflow-hidden rounded-2xl border border-border bg-surface/80 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur">
          <div className="pw-hero-art relative overflow-hidden rounded-xl border border-accent/30">
            <img src="/packwatch-coach.png" alt="Packwatch DDLTCG Coach logo" className="block aspect-[1.35] w-full object-contain object-center" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[#120c08]/85 px-4 py-3 backdrop-blur">
              <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-accent">PACKWATCH / COACH</span>
              <span className="text-xs text-fg">Coach online</span>
            </div>
          </div>
          <div className="px-2 pb-2 pt-5">
          <div className="flex items-start justify-between border-b border-border pb-4">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[0.24em] text-accent">WHAT YOU GET</p>
              <p className="mt-2 text-2xl font-black text-fg">A second set of eyes.</p>
            </div>
            <span className="rounded-full border border-ok/50 px-2.5 py-1 text-xs text-ok">LIVE</span>
          </div>
          <div className="space-y-5 py-5 text-sm">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">See it</p>
              <p className="mt-1 leading-6 text-fg">Turn, health, mana, lanes, threats and visible cards.</p>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Understand it</p>
              <p className="mt-1 leading-6 text-fg">A short recommendation with the rule and risk behind it.</p>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Improve</p>
              <p className="mt-1 leading-6 text-muted">Practice positions, build legal decks, and keep lessons visible.</p>
            </div>
          </div>
          <p className="border-t border-border pt-4 text-xs leading-5 text-muted">Evidence stays separate from advice, so you can check the coach instead of blindly trusting it.</p>
          </div>
        </article>
      </section>

      <section className="border-t border-border pt-8">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold tracking-[0.24em] text-accent">THE COACHING LOOP</p>
            <h2 className="mt-2 text-2xl font-black text-fg">From board state to better decisions.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">One calm workflow for live coaching, practice, deck building and learning.</p>
        </div>
      <div className="pw-stagger grid gap-3 md:grid-cols-3">
        {[
          ["01", "Observe", "Connect the local watcher or paste a position. Packwatch only works from visible, structured facts."],
          ["02", "Coach", "Get the highest-value consideration, the relevant rule, the risk and the confidence."],
          ["03", "Learn", "Practice the line, review your lessons and build a legal deck for the next match."],
        ].map(([n, t, d]) => (
          <article key={t} className="pw-panel rounded-xl border border-border bg-surface/55 p-5">
            <p className="font-mono text-xs font-bold text-accent">{n}</p>
            <h2 className="mt-4 text-xl font-black text-fg">{t}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{d}</p>
          </article>
        ))}
      </div>
      </section>
      <section className="mt-12 grid gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-[0.24em] text-accent">READY WHEN YOU ARE</p>
          <p className="mt-2 text-lg font-bold text-fg">Start with a practice board. Learn the why before the next turn.</p>
        </div>
        <button type="button" onClick={onGuest} className="min-h-12 rounded-lg border border-accent bg-accent px-5 text-sm font-black text-accent-fg transition-transform hover:-translate-y-0.5">
          Launch Packwatch
        </button>
      </section>
      <footer className="pt-12 text-center text-xs text-muted">Human decides every move. Packwatch observes. Packwatch explains.</footer>
    </main>
  );
}
