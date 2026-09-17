"use client";

import { answerWatch } from "@/lib/ddl/coach";
import { parseSight } from "@/lib/ddl/parse-sight";
import { useBrain } from "@/lib/ddl/store";
import { useMemo, useState } from "react";

export function inLockedFrame() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function BoardCall() {
  const b = useBrain();
  const [turn, setTurn] = useState<"you" | "opp">("you");
  const [youHP, setYouHP] = useState("40");
  const [oppHP, setOppHP] = useState("40");
  const [taunt, setTaunt] = useState(false);
  const [paste, setPaste] = useState("");
  const [now, setNow] = useState("");

  const preview = useMemo(() => inLockedFrame(), []);

  function run() {
    const blob = [
      turn === "you" ? "YOUR TURN" : "OPPONENT TURN",
      `${youHP} / 40`,
      `${oppHP} / 40`,
      taunt ? "Taunt" : "",
      paste,
    ].join(" ");
    const sight = parseSight(blob);
    const advice = answerWatch(paste || "what should I do", blob);
    const line =
      turn === "opp"
        ? "Their turn. Plan. Do not click."
        : taunt
          ? "Crack Taunt first — you cannot win through a wall."
          : sight.advice;
    const full = `${line} ${advice}`;
    setNow(full);
    b.noteScan(full);
    b.setNotice(full);
    b.setWatching(true);
    if (paste) b.mergeControls(sight.labels.concat(sight.cards), "Board call");
  }

  return (
    <div className="flex flex-col gap-4">
      {preview && (
        <p className="rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-muted">
          This preview cannot see your other Chrome tab. Call the board here — that always works.
        </p>
      )}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTurn("you")}
          className={`min-h-11 rounded-md border px-3 text-sm ${
            turn === "you" ? "border-accent bg-elevated" : "border-border bg-surface"
          }`}
        >
          My turn
        </button>
        <button
          type="button"
          onClick={() => setTurn("opp")}
          className={`min-h-11 rounded-md border px-3 text-sm ${
            turn === "opp" ? "border-accent bg-elevated" : "border-border bg-surface"
          }`}
        >
          Their turn
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-muted">
          Your HP
          <input
            value={youHP}
            onChange={(e) => setYouHP(e.target.value)}
            inputMode="numeric"
            className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-fg"
          />
        </label>
        <label className="text-sm text-muted">
          Their HP
          <input
            value={oppHP}
            onChange={(e) => setOppHP(e.target.value)}
            inputMode="numeric"
            className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-fg"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={() => setTaunt((v) => !v)}
        className={`min-h-11 rounded-md border px-3 text-sm ${
          taunt ? "border-danger bg-elevated text-danger" : "border-border bg-surface"
        }`}
      >
        {taunt ? "Taunt is up" : "No Taunt"}
      </button>
      <label className="text-sm text-muted">
        Cards you can see (paste names)
        <textarea
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          rows={4}
          placeholder="Stump, Dash, End Turn, YOUR TURN…"
          className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none"
        />
      </label>
      <button
        type="button"
        onClick={run}
        className="min-h-12 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg"
      >
        Coach this board
      </button>
      {now && <p className="rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed">{now}</p>}
    </div>
  );
}
