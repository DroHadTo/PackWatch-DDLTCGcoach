"use client";

import { CARDS } from "@/lib/ddl/cards";
import { parseSight } from "@/lib/ddl/parse-sight";
import { coachFromCall } from "@/lib/ddl/skill";
import { useBrain } from "@/lib/ddl/store";
import { useMemo, useState } from "react";

export function inLockedFrame() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

const NAMES = CARDS.filter((c) => !c.banned).map((c) => c.name);

export function BoardCall() {
  const b = useBrain();
  const [turn, setTurn] = useState<"you" | "opp">("you");
  const [youHP, setYouHP] = useState("40");
  const [oppHP, setOppHP] = useState("40");
  const [mana, setMana] = useState("1");
  const [taunt, setTaunt] = useState(false);
  const [rush, setRush] = useState(false);
  const [trap, setTrap] = useState(false);
  const [query, setQuery] = useState("");
  const [seen, setSeen] = useState<string[]>([]);
  const [now, setNow] = useState("");

  const preview = useMemo(() => inLockedFrame(), []);
  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];
    return NAMES.filter((n) => n.toLowerCase().includes(q) && !seen.includes(n)).slice(0, 6);
  }, [query, seen]);

  function addCard(name: string) {
    setSeen((s) => (s.includes(name) ? s : [...s, name].slice(0, 16)));
    setQuery("");
  }

  function run() {
    const yh = Math.max(0, Math.min(40, Number(youHP) || 0));
    const oh = Math.max(0, Math.min(40, Number(oppHP) || 0));
    const m = Math.max(0, Math.min(10, Number(mana) || 0));
    const fromPaste = parseSight(query).cards;
    const cards = [...new Set([...seen, ...fromPaste])];
    const line = coachFromCall(
      {
        turn,
        youHP: yh,
        oppHP: oh,
        mana: m,
        taunt,
        rushEntered: rush,
        trapThisTurn: trap,
        cards,
      },
      b.lessons,
    );
    const full = `${line.now} ${line.why}`;
    setNow(full);
    b.noteScan(full);
    b.setNotice(line.now);
    b.setWatching(true);
    if (cards.length) b.mergeControls(cards, "Board call");
  }

  return (
    <div className="flex flex-col gap-4">
      {preview && (
        <p className="rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-muted">
          Keep DDL in Chrome. Call the board here each turn — Pack Watch never sits on the game.
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
      <div className="grid grid-cols-3 gap-3">
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
        <label className="text-sm text-muted">
          Your mana
          <input
            value={mana}
            onChange={(e) => setMana(e.target.value)}
            inputMode="numeric"
            className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-fg"
          />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setTaunt((v) => !v)}
          className={`min-h-11 rounded-md border px-2 text-sm ${
            taunt ? "border-danger bg-elevated text-danger" : "border-border bg-surface"
          }`}
        >
          {taunt ? "Taunt up" : "No Taunt"}
        </button>
        <button
          type="button"
          onClick={() => setRush((v) => !v)}
          className={`min-h-11 rounded-md border px-2 text-sm ${
            rush ? "border-accent bg-elevated" : "border-border bg-surface"
          }`}
        >
          {rush ? "Rush entered" : "No new Rush"}
        </button>
        <button
          type="button"
          onClick={() => setTrap((v) => !v)}
          className={`min-h-11 rounded-md border px-2 text-sm ${
            trap ? "border-accent bg-elevated" : "border-border bg-surface"
          }`}
        >
          {trap ? "Trap set now" : "No new trap"}
        </button>
      </div>
      <label className="text-sm text-muted">
        Cards on the table
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (hits[0]) addCard(hits[0]);
            }
          }}
          placeholder="Type Dash, Stump, Wayne…"
          className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none"
        />
      </label>
      {hits.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hits.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => addCard(n)}
              className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm"
            >
              {n}
            </button>
          ))}
        </div>
      )}
      {seen.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {seen.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSeen((s) => s.filter((x) => x !== n))}
              className="min-h-11 rounded-md border border-border bg-elevated px-3 text-sm"
            >
              {n}
            </button>
          ))}
        </div>
      )}
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
