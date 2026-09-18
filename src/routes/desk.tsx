import { createFileRoute } from "@tanstack/react-router";
import { ScreenWatch } from "@/components/pack/screen-watch";
import { answerWatch } from "@/lib/ddl/coach";
import { useBrain } from "@/lib/ddl/store";

export const Route = createFileRoute("/desk")({ component: Desk });

function Desk() {
  const b = useBrain();
  return (
    <main className="min-h-dvh bg-bg px-4 py-4 text-fg">
      <p className="font-mono text-[10px] tracking-[0.22em] text-muted">SIDECAR</p>
      <h1 className="font-display text-2xl tracking-tight">Pack Watch</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        This window sits next to Chrome. It watches a tab you share. It does not touch the game.
      </p>
      <p className="mt-3 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted">
        Advice-only: this companion never injects into DDL, clicks, types, reads cookies, or stores credentials.
      </p>
      <div className="mt-4">
        <ScreenWatch compact />
      </div>
      <div className="mt-4 rounded-xl border border-border bg-surface p-4">
        <p className="text-sm">Ask this match</p>
        <textarea
          value={b.ask}
          onChange={(e) => b.setAsk(e.target.value)}
          rows={3}
          placeholder="Can I hit face?"
          className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none"
        />
        <button
          type="button"
          onClick={() => b.setAskReply(answerWatch(b.ask.trim() || "what should I do", b.lastScan))}
          className="mt-2 min-h-11 w-full rounded-md bg-accent text-sm font-medium text-accent-fg"
        >
          Tell me
        </button>
        {b.askReply && <p className="mt-3 text-sm leading-relaxed">{b.askReply}</p>}
        {b.lastScan && <p className="mt-3 text-sm text-muted">{b.lastScan}</p>}
      </div>
    </main>
  );
}
