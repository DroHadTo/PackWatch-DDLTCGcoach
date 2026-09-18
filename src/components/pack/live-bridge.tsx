"use client";

import type { PackwatchBridgeState } from "@/hooks/use-packwatch-bridge";

export function PackwatchLiveBridge({ bridge }: { bridge: PackwatchBridgeState }) {
  const connected = bridge.status === "connected";
  const busy = bridge.status === "connecting";
  const statusLabel =
    connected ? "live" : busy ? "connecting" : bridge.status === "idle" ? "standby" : "offline";
  const last = bridge.lastSeen
    ? new Date(bridge.lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "Not yet received";

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
          1.5 sec
        </p>
        <p className="rounded-lg border border-border bg-elevated px-3 py-2">
          <span className="block font-mono text-[10px] tracking-wide text-muted">Control</span>
          none
        </p>
      </div>
      {bridge.error && (
        <p className="mt-3 rounded-lg border border-danger px-3 py-2 text-sm text-danger">{bridge.error}</p>
      )}
      <p className="mt-3 text-sm text-muted">
        The bridge may read board state and advice only. It must not expose credentials or implement clicks, typing,
        or move submission.
      </p>
    </section>
  );
}
