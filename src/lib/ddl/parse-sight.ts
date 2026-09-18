import { CARDS } from "./cards";

const NAMES = CARDS.map((c) => c.name).sort((a, b) => b.length - a.length);

const BUTTONS = [
  "End Turn",
  "YOUR TURN",
  "New Game",
  "Resume",
  "Confirm",
  "Cancel",
  "Play Again",
  "Change decks",
  "Vs Bot",
  "Vs Pack",
  "Tutorial",
  "Hot Pack",
  "Graveyard",
  "How to Play",
  "Leaderboard",
  "Sign in",
];

export interface Sight {
  turn: "you" | "opp" | "unknown";
  youHP: number | null;
  oppHP: number | null;
  labels: string[];
  cards: string[];
  keywords: string[];
  raw: string;
  advice: string;
}

export function parseSight(raw: string): Sight {
  const text = raw.replace(/\s+/g, " ").trim();
  const upper = text.toUpperCase();
  const turn: Sight["turn"] = /YOUR TURN/.test(upper)
    ? "you"
    : /OPPONENT|ENEMY TURN/.test(upper)
      ? "opp"
      : "unknown";
  const hps = [...text.matchAll(/(\d{1,2})\s*\/\s*40/g)].map((m) => parseInt(m[1], 10));
  const youHP = hps[0] ?? null;
  const oppHP = hps[1] ?? null;
  const labels = BUTTONS.filter((b) => upper.includes(b.toUpperCase()));
  const cards = NAMES.filter((n) => new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text));
  const keywords = ["Taunt", "Rush", "Poison", "Fury", "Frozen"].filter((k) =>
    new RegExp(`\\b${k}\\b`, "i").test(text),
  );
  const bits: string[] = [];
  if (turn === "you") bits.push("It is your turn.");
  if (turn === "opp") bits.push("Opponent is acting — plan, do not click.");
  if (keywords.includes("Taunt")) bits.push("Taunt is visible — do not hit face.");
  if (keywords.includes("Rush")) bits.push("Rush cannot hit the Hero the turn it enters.");
  if (!bits.length) bits.push("Keep sharing the play tab. Pack Watch is reading labels and card names.");
  return { turn, youHP, oppHP, labels, cards: [...new Set(cards)].slice(0, 24), keywords, raw: text.slice(0, 2000), advice: bits.join(" ") };
}
