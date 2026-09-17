"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { coach, type CoachLine } from "./coach";
import {
  attackCreature,
  attackHero,
  endTurn,
  playFromHand,
  newGame,
} from "./engine";
import { defOf } from "./cards";
import { buildCompetitiveDeck, type BuiltDeck } from "./deck";
import { SEED_CONTROLS } from "./seed-controls";
import { lessonFromIllegal, type Lesson } from "./skill";
import type { ControlRecord, GameState, HeroClass, LearnEvent } from "./types";

interface Brain {
  game: GameState;
  controls: ControlRecord[];
  watching: boolean;
  lastScan: string;
  lastDeck: BuiltDeck | null;
  lessons: Lesson[];
  tab: "home" | "watch" | "arena" | "brain";
  coachLine: CoachLine;
  ask: string;
  askReply: string;
  asking: boolean;
  notice: string;
  selected: { kind: "hand" | "lane"; id: string } | null;
  newMatch: () => void;
  play: (uid: string, lane?: number) => void;
  hit: (from: number, to: number | "hero") => void;
  pass: () => void;
  pick: (sel: Brain["selected"]) => void;
  mergeControls: (labels: string[], where: string) => void;
  setWatching: (v: boolean) => void;
  setTab: (t: Brain["tab"]) => void;
  setAsk: (v: string) => void;
  setAskReply: (v: string) => void;
  setAsking: (v: boolean) => void;
  setNotice: (v: string) => void;
  noteScan: (summary: string) => void;
  buildDeck: (cls: HeroClass) => void;
}

function bump(g: GameState, lessons: Lesson[]): CoachLine {
  return coach(g, lessons);
}

export const useBrain = create<Brain>()(
  persist(
    (set, get) => {
      const game = newGame();
      return {
        game,
        controls: SEED_CONTROLS.map((c) => ({ ...c, lastSeen: Date.now() })),
        watching: false,
        lastScan: "Learning from every match, scan, and overlay. Wayne is banned online.",
        lastDeck: null,
        lessons: [],
        tab: "home",
        coachLine: bump(game, []),
        ask: "",
        askReply: "",
        asking: false,
        notice: "Tap a card you can afford. One tap plays it.",
        selected: null,
        newMatch: () => {
          const g = newGame();
          set({ game: g, coachLine: bump(g, get().lessons), selected: null, notice: "New match. Tap a card that you can afford." });
        },
        play: (uid, lane) => {
          const g = get().game;
          playFromHand(g, uid, lane);
          const lessons = [...get().lessons];
          const line = g.log[0] ?? "";
          if (/illegal/i.test(line)) {
            const L = lessonFromIllegal(line);
            if (L) lessons.unshift(L);
          }
          set({
            game: { ...g, events: [...g.events], log: [...g.log] },
            coachLine: bump(g, lessons),
            selected: null,
            notice: line,
            lessons: lessons.slice(0, 40),
          });
        },
        hit: (from, to) => {
          const g = get().game;
          if (to === "hero") attackHero(g, from);
          else attackCreature(g, from, to);
          const lessons = [...get().lessons];
          const line = g.log[0] ?? "";
          if (/illegal/i.test(line)) {
            const L = lessonFromIllegal(line);
            if (L) lessons.unshift(L);
          }
          set({
            game: { ...g, events: [...g.events], log: [...g.log] },
            coachLine: bump(g, lessons),
            selected: null,
            notice: line,
            lessons: lessons.slice(0, 40),
          });
        },
        pass: () => {
          const g = get().game;
          const leftover = g.you.hand.some((c) => defOf(c.defId).cost <= g.you.mana);
          const lessons = [...get().lessons];
          if (leftover && g.turn === "you") {
            const L = lessonFromIllegal("Illegal: mana left unspent.");
            if (L) lessons.unshift(L);
          }
          endTurn(g);
          set({
            game: { ...g, events: [...g.events], log: [...g.log] },
            coachLine: bump(g, lessons),
            selected: null,
            notice: g.log[0] ?? "",
            lessons: lessons.slice(0, 40),
          });
        },
        pick: (sel) => set({ selected: sel }),
        mergeControls: (labels, where) => {
          const next = [...get().controls];
          const now = Date.now();
          for (const label of labels) {
            const hit = next.find((c) => c.label.toLowerCase() === label.toLowerCase());
            if (hit) {
              hit.seen += 1;
              hit.lastSeen = now;
            } else {
              next.unshift({
                id: `l-${label.toLowerCase().replace(/\s+/g, "-")}`,
                label,
                where,
                function: "Observed on official client scan. Function still being classified.",
                seen: 1,
                lastSeen: now,
              });
            }
          }
          set({ controls: next.slice(0, 80) });
        },
        setWatching: (v) => set({ watching: v }),
        setTab: (t) => set({ tab: t }),
        setAsk: (v) => set({ ask: v }),
        setAskReply: (v) => set({ askReply: v }),
        setAsking: (v) => set({ asking: v }),
        setNotice: (v: string) => set({ notice: v }),
        noteScan: (summary) => {
          const g = get().game;
          const ev: LearnEvent = {
            t: Date.now(),
            kind: "scan",
            label: "Learn",
            detail: summary,
          };
          g.events.unshift(ev);
          set({ lastScan: summary, game: { ...g } });
        },
        buildDeck: (cls) => {
          const deck = buildCompetitiveDeck(cls);
          set({
            lastDeck: deck,
            notice: deck.notes,
            lastScan: `Built a ${cls} list. Wayne excluded. 40 legal cards.`,
          });
        },
      };
    },
    {
      name: "pack-watch-brain-v5",
      skipHydration: true,
      partialize: (s) => ({ controls: s.controls, lastDeck: s.lastDeck, lessons: s.lessons }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Brain>;
        return {
          ...current,
          controls: Array.isArray(p.controls) && p.controls.length ? p.controls : current.controls,
          lastDeck: p.lastDeck ?? current.lastDeck,
          lessons: Array.isArray(p.lessons) ? p.lessons : current.lessons,
        };
      },
    },
  ),
);

if (typeof window !== "undefined") {
  void useBrain.persist.rehydrate();
}
