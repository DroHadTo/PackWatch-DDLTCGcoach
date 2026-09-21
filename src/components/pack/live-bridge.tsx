"use client";

import { askCoach } from "@/lib/ddl/ask";
import { useAiConsent } from "@/lib/learning/use-ai-consent";
import type { PackwatchBridgeState } from "@/hooks/use-packwatch-bridge";
import { useState } from "react";

export function PackwatchLiveBridge({ bridge }: { bridge: PackwatchBridgeState }) {
  const ai = useAiConsent();
  const [question, setQuestion] = useState("What is the safest winning line?");
  const [explanation, setExplanation] = useState("");
  const [aiError, setAiError] = useState("");
  const [asking, setAsking] = useState(false);
  const connected = bridge.status === "connected";
  const busy = bridge.status === "connecting";
  const statusLabel =
    connected ? "live" : busy ? "connecting" : bridge.status === "idle" ? "standby" : "offline";
  const last = bridge.lastSeen
    ? new Date(bridge.lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "Not yet received";

  async function askExternalCoach() {
    if (ai.consent !== "granted" || asking) return;
    setAsking(true);
    setAiError("");
    try {
      const result = await askCoach({
        data: {
          aiConsent: true,
          question: question.trim().slice(0, 400) || "What should I do right now?",
          board: `${bridge.board}\n\nCurrent local advice: ${bridge.advice?.recommendation ?? "none"}`,
        },
      });
      if (result.ok) setExplanation(result.text);
      else setAiError(result.error);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "External AI is unavailable.");
    } finally {
      setAsking(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">Local live bridge</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Read-only. Chrome, Firefox, Edge, Safari, or a native client can feed the same JSON. Packwatch never
            clicks or types.
          </p>
        </div>
        <p className="font-mono text-xs tracking-wide text-muted">{statusLabel}</p>
      </div>
      <label className="mt-4 block text-sm text-muted">
        Local bridge address
        <input
          value={bridge.endpoint}
          onChange={(e) => bridge.setEndpoint(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-xs text-fg"
          placeholder="http://127.0.0.1:8765"
          autoComplete="url"
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        {bridge.active ? (
          <button
            type="button"
            onClick={bridge.disconnect}
            className="inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm"
          >
            Disconnect
          </button>
        ) : (
          <button
            type="button"
            onClick={bridge.connect}
            className="inline-flex min-h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg"
          >
            Connect watcher
          </button>
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
        <p className="rounded-lg border border-border bg-elevated px-3 py-2">
          <span className="block font-mono text-[10px] tracking-wide text-muted">Status</span>
          {statusLabel}
        </p>
        <p className="rounded-lg border border-border bg-elevated px-3 py-2">
          <span className="block font-mono text-[10px] tracking-wide text-muted">Last board</span>
          {last}
        </p>
        <p className="rounded-lg border border-border bg-elevated px-3 py-2">
          <span className="block font-mono text-[10px] tracking-wide text-muted">Refresh</span>
          ~1 sec
        </p>
        <p className="rounded-lg border border-border bg-elevated px-3 py-2">
          <span className="block font-mono text-[10px] tracking-wide text-muted">Control</span>
          none
        </p>
      </div>
      {bridge.latencyMs !== null && (
        <p className="mt-3 text-xs text-muted">
          Last response {bridge.latencyMs} ms · advice updates only when the board changes
        </p>
      )}
      {bridge.error && (
        <p className="mt-3 rounded-lg border border-danger px-3 py-2 text-sm text-danger">{bridge.error}</p>
      )}
      <p className="mt-3 text-sm text-muted">
        The bridge may read board state and advice only. It must not expose credentials or implement clicks, typing,
        or move submission.
      </p>
      <section className="mt-5 rounded-xl border border-border bg-bg p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-muted">OPTIONAL AI EXPLANATION</p>
            <h3 className="mt-1 font-display text-xl">Keep the local coach fast. Ask AI when you want depth.</h3>
          </div>
          <span className="rounded-full border border-border px-2 py-1 text-xs text-muted">
            {ai.consent === "granted" ? "allowed" : "local only"}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The local rules coach is free and always available. If you opt in, a manual request sends only this board
          text and your question to the configured AI provider. No screenshots, credentials, identity, or training
          history is sent, and Packwatch does not train a shared model from this request.
        </p>
        {ai.consent !== "granted" ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => ai.update("granted")} className="min-h-10 rounded-md bg-accent px-3 text-sm font-medium text-accent-fg">
              Allow AI explanations
            </button>
            <button type="button" onClick={() => ai.update("denied")} className="min-h-10 rounded-md border border-border px-3 text-sm text-muted">
              Keep AI local
            </button>
          </div>
        ) : (
          <>
            <label className="mt-3 block text-sm text-muted">
              Ask one question
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                maxLength={400}
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" disabled={asking} onClick={() => void askExternalCoach()} className="min-h-10 rounded-md bg-accent px-3 text-sm font-medium text-accent-fg disabled:opacity-50">
                {asking ? "Thinking…" : "Ask optional AI"}
              </button>
              <button type="button" onClick={() => { ai.update("denied"); setExplanation(""); }} className="min-h-10 rounded-md border border-border px-3 text-sm text-muted">
                Turn off
              </button>
            </div>
          </>
        )}
        {aiError && <p className="mt-3 rounded-md border border-danger/50 px-3 py-2 text-sm text-danger">{aiError}</p>}
        {explanation && <p className="mt-3 rounded-lg border border-accent/40 bg-surface px-3 py-3 text-sm leading-relaxed">{explanation}</p>}
      </section>
    </section>
  );
}
