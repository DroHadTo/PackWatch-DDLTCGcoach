import { PackwatchLiveBridge } from "@/components/pack/live-bridge";
import { usePackwatchBridge } from "@/hooks/use-packwatch-bridge";
import { useEffect, useRef, useState } from "react";

type Commentary = { time: string; kind: "observed" | "advice"; text: string };

export function CommentatorPage() {
  const bridge = usePackwatchBridge();
  const [events, setEvents] = useState<Commentary[]>([]);
  const lastBoardRef = useRef("");
  const lastAdviceRef = useRef("");

  useEffect(() => {
    const board = bridge.board.trim();
    if (board && board !== lastBoardRef.current) {
      lastBoardRef.current = board;
      const event: Commentary = { time: new Date().toLocaleTimeString(), kind: "observed", text: board };
      setEvents((current) => [event, ...current].slice(0, 12));
    }
    const advice = bridge.advice?.recommendation?.trim();
    if (advice && advice !== lastAdviceRef.current) {
      lastAdviceRef.current = advice;
      const event: Commentary = { time: new Date().toLocaleTimeString(), kind: "advice", text: advice };
      setEvents((current) => [event, ...current].slice(0, 12));
    }
  }, [bridge.board, bridge.advice]);

  return (
    <div className="pw-stagger flex flex-col gap-4">
      <p className="font-mono text-xs tracking-wide text-muted">/ commentator / live call</p>
      <h2 className="font-display text-3xl tracking-tight">Explain the match as it unfolds.</h2>
      <p className="max-w-prose text-sm leading-relaxed text-muted">
        Connect the read-only bridge to turn verified board updates and coach advice into a running commentary feed.
        The commentator never invents actions that were not observed.
      </p>
      <PackwatchLiveBridge bridge={bridge} />
      <section className="pw-panel rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl">Running call</h3>
          <span className="font-mono text-xs text-muted">{events.length} events</span>
        </div>
        {events.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Connect the bridge to begin. Commentary starts only when a board or advice payload changes.</p>
        ) : (
          <ol className="mt-4 space-y-3">
            {events.map((event, index) => (
              <li key={`${event.time}-${index}`} className="border-l-2 border-accent/60 pl-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-accent">{event.kind} · {event.time}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{event.text}</p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
