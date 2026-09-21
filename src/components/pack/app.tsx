"use client";

import { CARDS, RULES_TEXT, defOf } from "@/lib/ddl/cards";
import { BoardCall } from "@/components/pack/board-call";
import { KnowledgePage } from "@/components/pack/knowledge";
import { LandingPage } from "@/components/pack/landing";
import { PackwatchLiveBridge } from "@/components/pack/live-bridge";
import { CoachPanels } from "@/components/pack/panels";
import { ProgressPage } from "@/components/pack/progress";
import { StreamerPage } from "@/components/pack/streamer";
import { CommentatorPage } from "@/components/pack/commentator";
import { ConsentPanel } from "@/components/pack/consent-panel";
import { ScreenWatch, openCompanion } from "@/components/pack/screen-watch";
import { answerQuestion, answerWatch } from "@/lib/ddl/coach";
import { DECK_CLASSES, groupDeck } from "@/lib/ddl/deck";
import { canAttackCreature, effectiveAtk, effectiveKeywords } from "@/lib/ddl/engine";
import { GUEST_KEY, NAV_ITEMS } from "@/lib/packwatch-config";
import { usePackwatchBridge } from "@/hooks/use-packwatch-bridge";
import { useBrain } from "@/lib/ddl/store";
import type { CardInst, PlayerState } from "@/lib/ddl/types";
import { RotateCcw } from "lucide-react";
import { Component, type ReactNode, useEffect, useMemo, useState } from "react";

function hpTone(hp: number) {
  if (hp <= 10) return "text-danger";
  if (hp <= 20) return "text-fg";
  return "text-ok";
}

function Mini({
  inst,
  secret,
  active,
  dim,
  onClick,
}: {
  inst: CardInst;
  secret?: boolean;
  active?: boolean;
  dim?: boolean;
  onClick?: () => void;
}) {
  const d = defOf(inst.defId);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-16 w-full flex-col rounded-md border px-2 py-1.5 text-left transition-colors ${
        active ? "border-accent bg-elevated" : "border-border bg-surface hover:border-muted"
      } ${dim ? "opacity-40" : ""}`}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="truncate font-display text-sm tracking-tight">
          {secret ? "Set trap" : d.name}
        </span>
        <span className="font-mono text-xs text-muted">{d.cost}</span>
      </span>
      {!secret && (
        <span className="mt-1 flex items-center justify-between text-[11px] text-muted">
          <span>{d.kind === "Creature" ? `${inst.atk}/${inst.hp}` : d.kind}</span>
          <span>{d.cls}</span>
        </span>
      )}
    </button>
  );
}

function Lane({
  inst,
  owner,
  index,
  onClick,
  glow,
}: {
  inst: CardInst | null;
  owner: PlayerState;
  index: number;
  onClick: () => void;
  glow?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[88px] flex-col justify-between rounded-lg border p-2 text-left ${
        glow ? "border-accent bg-elevated" : "border-border bg-surface"
      }`}
    >
      <span className="font-mono text-[10px] tracking-widest text-faint">L{index + 1}</span>
      {inst ? (
        <>
          <span className="font-display text-sm leading-tight">{defOf(inst.defId).name}</span>
          <span className="flex justify-between font-mono text-xs text-muted">
            <span>
              {effectiveAtk(owner, index)}/{inst.hp}
            </span>
            <span>{effectiveKeywords(owner, index).join(" ") || "—"}</span>
          </span>
        </>
      ) : (
        <span className="text-xs text-faint">Empty</span>
      )}
    </button>
  );
}

function Back({ inst }: { inst: CardInst | null }) {
  if (!inst) {
    return <div className="h-10 rounded-md border border-dashed border-border" />;
  }
  const d = defOf(inst.defId);
  return (
    <div className="flex h-10 items-center justify-center rounded-md border border-border bg-elevated px-1 font-mono text-[10px] text-muted">
      {inst.faceDown ? "Trap" : d.name}
    </div>
  );
}

class Guard extends Component<{ children: ReactNode }, { err: string | null }> {
  state = { err: null as string | null };
  static getDerivedStateFromError(error: Error) {
    return { err: error.message || "Preview glitch" };
  }
  render() {
    if (this.state.err) {
      return (
        <main className="min-h-dvh bg-bg p-6 text-fg">
          <p className="font-display text-3xl">Pack Watch</p>
          <p className="mt-3 max-w-md text-muted">The coach hit a snag. Start a fresh session — your practice match will reset.</p>
          <button
            type="button"
            className="mt-6 min-h-12 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg"
            onClick={() => {
              try {
                localStorage.removeItem("pack-watch-brain");
                localStorage.removeItem("pack-watch-brain-v3");
                localStorage.removeItem("pack-watch-brain-v4");
              } catch {
                /* ignore */
              }
              window.location.reload();
            }}
          >
            Start over
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}

export function PackApp() {
  return (
    <Guard>
      <PackAppInner />
    </Guard>
  );
}

function PackAppInner() {
  const b = useBrain();
  const { game, selected } = b;
  const [q, setQ] = useState("");
  const [popupBlock, setPopupBlock] = useState("");
  const [guest, setGuest] = useState(false);
  const bridge = usePackwatchBridge();

  useEffect(() => {
    setGuest(window.sessionStorage.getItem(GUEST_KEY) === "true");
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return CARDS;
    return CARDS.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.id.toLowerCase().includes(s) ||
        c.text.toLowerCase().includes(s) ||
        c.cls.toLowerCase().includes(s),
    );
  }, [q]);

  function sendAsk() {
    const question = b.ask.trim() || "What should I do right now?";
    if (b.asking) return;
    if (b.watching) {
      b.setAskReply(answerWatch(question, b.lastScan));
      return;
    }
    b.setAskReply(answerQuestion(game, question));
  }

  function onHand(c: CardInst) {
    if (game.turn !== "you" || game.winner) {
      b.setNotice("Wait for your turn.");
      return;
    }
    const d = defOf(c.defId);
    const canPay = game.you.mana >= d.cost || (game.you.coin && game.you.mana + 1 >= d.cost);
    if (!canPay) {
      b.setNotice(`This costs ${d.cost}. You only have ${game.you.mana} mana. Tap End turn to get more.`);
      return;
    }
    b.play(c.uid);
  }

  function onYourLane(i: number) {
    if (selected?.kind === "hand") {
      b.play(selected.id, i);
      return;
    }
    if (game.you.lanes[i]) b.pick({ kind: "lane", id: String(i) });
  }

  function onOppLane(i: number) {
    if (selected?.kind === "lane") b.hit(Number(selected.id), i);
  }

  function onOppHero() {
    if (selected?.kind === "lane") b.hit(Number(selected.id), "hero");
  }

  if (!guest) {
    return (
      <div className="pw-shell min-h-dvh bg-bg text-fg">
        <LandingPage
          onGuest={() => {
            window.sessionStorage.setItem(GUEST_KEY, "true");
            setGuest(true);
            b.setTab("watch");
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="pw-reveal sticky top-0 z-20 border-b border-border/80 bg-bg/90 px-4 py-3 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button type="button" onClick={() => b.setTab("watch")} className="group text-left">
            <p className="pw-caret font-mono text-[10px] tracking-[0.22em] text-muted transition-colors group-hover:text-accent">DDL COACH / ADVICE ONLY</p>
            <h1 className="font-display text-2xl tracking-tight transition-transform group-hover:translate-x-1">Packwatch</h1>
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <nav className="flex min-w-0 gap-1 overflow-x-auto rounded-lg border border-border bg-surface p-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => b.setTab(item.id)}
                  className={`relative min-h-11 shrink-0 rounded-md px-3 text-sm transition-all duration-200 ${
                    b.tab === item.id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {b.tab === item.id && <span className="pw-signal absolute inset-1 rounded-md border border-accent-fg/20" />}
                  <span className="relative">{item.label}</span>
                </button>
              ))}
            </nav>
            <ConsentPanel />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-4 md:px-8">
        {b.tab === "home" && (
          <section className="mx-auto max-w-xl py-8">
            <h2 className="font-display text-3xl tracking-tight">How to use this</h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Live coach for DDL. You play. Pack Watch never sits inside the game, never clicks, never stores a
              login. Wayne stays banned. Practice here, or call the live board each turn.
            </p>
            <div className="mt-8 grid gap-3">
              <button
                type="button"
                onClick={() => b.setTab("arena")}
                className="rounded-xl border border-border bg-surface p-5 text-left"
              >
                <p className="font-display text-xl">Practice a match</p>
                <p className="mt-1 text-sm text-muted">
                  Works right now. Tap a bright card, End turn, read Do this now. Hunt the win.
                </p>
              </button>
              <button
                type="button"
                onClick={() => b.setTab("watch")}
                className="rounded-xl border border-border bg-surface p-5 text-left"
              >
                <p className="font-display text-xl">Coach my live game</p>
                <p className="mt-1 text-sm text-muted">
                  Play DDL in Chrome. Here, mark whose turn, HP, Taunt, paste card names. Pack Watch answers.
                </p>
              </button>
              <button
                type="button"
                onClick={() => b.setTab("brain")}
                className="rounded-xl border border-border bg-surface p-5 text-left"
              >
                <p className="font-display text-xl">Build a legal deck</p>
                <p className="mt-1 text-sm text-muted">
                  40 cards, max 3 copies, from the current online pool. Wayne stays out.
                </p>
              </button>
            </div>
            <p className="mt-6 text-sm text-faint">You can always tap the Pack Watch title to come back here.</p>
          </section>
        )}

        {b.tab !== "home" && (
          <div key={b.tab} className="pw-reveal grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
            <section className="min-w-0">
              {b.tab === "arena" && (
                <div className="flex flex-col gap-3">
                  <p className="rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-relaxed">
                    Bright cards you can play now. Faded cards cost too much. Tap one bright card. When you are
                    stuck, tap End turn.
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted">
                      Turn {game.turnNo} · {game.turn === "you" ? "Your turn" : "Bot turn"}
                      {game.winner ? ` · ${game.winner === "you" ? "You won" : game.winner === "bot" ? "You lost" : "Draw"}` : ""}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={b.newMatch}
                        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-3 text-sm"
                      >
                        <RotateCcw className="size-4" />
                        New match
                      </button>
                      <button
                        type="button"
                        onClick={b.pass}
                        disabled={game.turn !== "you" || !!game.winner}
                        className="inline-flex min-h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg disabled:opacity-40"
                      >
                        End turn
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOppHero}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
                  >
                    <span className="text-sm text-muted">Opponent</span>
                    <span className={`font-mono text-xl tabular-nums ${hpTone(game.bot.hp)}`}>
                      {game.bot.hp}/40
                    </span>
                  </button>
                  <div className="grid grid-cols-5 gap-2">
                    {game.bot.back.map((c, i) => (
                      <Back key={`ob${i}`} inst={c} />
                    ))}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {game.bot.lanes.map((c, i) => (
                      <Lane
                        key={`ol${i}`}
                        inst={c}
                        owner={game.bot}
                        index={i}
                        glow={selected?.kind === "lane" && !!c && canAttackCreature(game, Number(selected.id), i).ok}
                        onClick={() => onOppLane(i)}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {game.you.lanes.map((c, i) => (
                      <Lane
                        key={`yl${i}`}
                        inst={c}
                        owner={game.you}
                        index={i}
                        glow={selected?.kind === "lane" && selected.id === String(i)}
                        onClick={() => onYourLane(i)}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {game.you.back.map((c, i) => (
                      <Back key={`yb${i}`} inst={c} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
                    <div>
                      <p className="text-sm text-muted">You</p>
                      <p className="font-mono text-xs text-faint">
                        Mana {game.you.mana}/{game.you.manaCap}
                        {game.you.coin ? " · Coin" : ""}
                      </p>
                    </div>
                    <span className={`font-mono text-xl tabular-nums ${hpTone(game.you.hp)}`}>
                      {game.you.hp}/40
                    </span>
                  </div>
                  <div>
                    <p className="mb-2 text-sm text-muted">Your hand — tap a bright card</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {game.you.hand.map((c) => {
                        const d = defOf(c.defId);
                        const dim = d.cost > game.you.mana && !(game.you.coin && d.cost === game.you.mana + 1);
                        return (
                          <Mini
                            key={c.uid}
                            inst={c}
                            dim={dim}
                            active={selected?.kind === "hand" && selected.id === c.uid}
                            onClick={() => onHand(c)}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {b.tab === "watch" && (
                <div className="flex flex-col gap-4">
                  <PackwatchLiveBridge bridge={bridge} />
                  {bridge.advice && (
                    <div className="rounded-xl border border-border bg-surface p-5">
                      <p className="font-mono text-[10px] tracking-wide text-muted">live advice</p>
                      <p className="mt-2 text-sm"><span className="text-muted">Observed. </span>{bridge.advice.observed}</p>
                      <p className="mt-1 font-display text-xl leading-snug">{bridge.advice.recommendation}</p>
                      {bridge.advice.boardState && (
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                          {bridge.advice.boardState.turn && <span className="rounded-full border border-border px-2 py-1">Turn: {bridge.advice.boardState.turn}</span>}
                          {bridge.advice.boardState.round != null && <span className="rounded-full border border-border px-2 py-1">Round: {bridge.advice.boardState.round}</span>}
                          {bridge.advice.boardState.you_hp != null && <span className="rounded-full border border-border px-2 py-1">You {bridge.advice.boardState.you_hp} HP</span>}
                          {bridge.advice.boardState.opp_hp != null && <span className="rounded-full border border-border px-2 py-1">Opp {bridge.advice.boardState.opp_hp} HP</span>}
                          {bridge.advice.boardState.mana != null && <span className="rounded-full border border-border px-2 py-1">Mana {bridge.advice.boardState.mana}/{bridge.advice.boardState.mana_cap ?? "?"}</span>}
                          {bridge.advice.boardState.threats?.map((threat) => <span key={threat} className="rounded-full border border-accent/50 px-2 py-1 text-accent">{threat}</span>)}
                        </div>
                      )}
                      {bridge.advice.confidence && (
                        <p className="mt-2 text-sm text-muted">Confidence. {bridge.advice.confidence}</p>
                      )}
                    </div>
                  )}
                  {bridge.board && (
                    <pre className="overflow-auto rounded-xl border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-muted">{bridge.board}</pre>
                  )}
                  <div className="rounded-xl border border-border bg-surface p-5">
                    <h2 className="font-display text-2xl">Call the live board</h2>
                    <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
                      Works in this preview. Play DDL in normal Chrome. Mark turn, HP, Taunt, paste names. Same
                      SKILL as the desktop HUD. No second login.
                    </p>
                    <div className="mt-4">
                      <BoardCall />
                    </div>
                  </div>
                  <details className="rounded-xl border border-border bg-surface p-5">
                    <summary className="cursor-pointer font-display text-xl">Desktop HUD (your PC)</summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Attaches to the Chrome you already play in. Does not open the site. Does not click. If CDP
                      is flagged, use screen OCR instead.
                    </p>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                      <li>Download the zip. Unzip. That folder is Pack Watch.</li>
                      <li>
                        Start Chrome with a dedicated profile and debug port (see README). Log into
                        ddltcg.com/play yourself.
                      </li>
                      <li>
                        <code className="text-xs">python python/watcher.py --mode attach</code>
                      </li>
                      <li>
                        <code className="text-xs">python python/brain.py --loop</code>
                      </li>
                      <li>
                        <code className="text-xs">python python/bridge.py</code>
                        {" "}
                        then Connect watcher
                      </li>
                      <li>
                        <code className="text-xs">cd overlay && npm start</code>
                      </li>
                    </ol>
                    <a
                      href="/packwatch-desktop.zip"
                      download="packwatch-desktop.zip"
                      className="mt-4 inline-flex min-h-12 items-center rounded-md bg-accent px-5 text-sm font-medium text-accent-fg"
                    >
                      Download desktop HUD
                    </a>
                  </details>
                  <details className="rounded-xl border border-border bg-surface p-5">
                    <summary className="cursor-pointer font-display text-xl">Share a window (optional)</summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Only works if Pack Watch is open as its own Chrome window, not inside this preview. If
                      Chrome does not ask you to pick a tab, use Call the live board above.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!openCompanion()) setPopupBlock("This preview blocks extra windows. Use Call the live board.");
                      }}
                      className="mt-3 min-h-11 rounded-md border border-border px-4 text-sm"
                    >
                      Try sidecar window
                    </button>
                    {popupBlock && <p className="mt-2 text-sm text-danger">{popupBlock}</p>}
                    <div className="mt-4">
                      <ScreenWatch />
                    </div>
                  </details>
                </div>
              )}

              {b.tab === "brain" && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl border border-border bg-surface p-4">
                    <h2 className="font-display text-xl">Build for online play</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Legal pool only. Wayne is removed from competition — too strong as a 2-mana Rush. Tap a
                      class. Pack Watch writes a 40-card list you can take to ddltcg.com.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {DECK_CLASSES.map((cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => b.buildDeck(cls)}
                          className="min-h-11 rounded-md border border-border px-4 text-sm"
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                    {b.lastDeck && (
                      <div className="mt-4">
                        <p className="text-sm">{b.lastDeck.notes}</p>
                        <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                          {groupDeck(b.lastDeck.list).map(({ def, n }) => (
                            <li key={def.id} className="flex justify-between gap-2 text-sm">
                              <span>
                                {def.name}{" "}
                                <span className="text-muted">
                                  {def.cost} · {def.kind}
                                </span>
                              </span>
                              <span className="font-mono text-muted">×{n}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="rounded-xl border border-border bg-surface p-4">
                    <h2 className="font-display text-xl">Simple rules</h2>
                    <ul className="mt-3 space-y-2">
                      {RULES_TEXT.map((r) => (
                        <li key={r.title}>
                          <p className="text-sm font-medium">{r.title}</p>
                          <p className="text-sm text-muted">{r.body}</p>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm text-danger">Wayne — banned online. Do not register it.</p>
                  </div>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Find a card"
                    className="min-h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none"
                  />
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {filtered.slice(0, 24).map((c) => (
                      <li key={c.id} className="rounded-lg border border-border bg-surface p-3">
                        <p className="font-display">
                          {c.name}{" "}
                          <span className="font-mono text-xs text-muted">
                            {c.cost} mana{c.banned ? " · banned" : ""}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-muted">{c.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {b.tab === "progress" && <ProgressPage />}
              {b.tab === "knowledge" && <KnowledgePage />}
              {b.tab === "streamer" && <StreamerPage />}
              {b.tab === "commentator" && <CommentatorPage />}
            </section>

            <aside className="flex flex-col gap-3">
              <CoachPanels />
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-sm">Ask anything</p>
                <textarea
                  value={b.ask}
                  onChange={(e) => b.setAsk(e.target.value)}
                  rows={3}
                  placeholder="What should I do?"
                  className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={sendAsk}
                  className="mt-2 min-h-11 w-full rounded-md bg-accent text-sm font-medium text-accent-fg"
                >
                  Tell me
                </button>
                {b.askReply && <p className="mt-3 text-sm leading-relaxed">{b.askReply}</p>}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
