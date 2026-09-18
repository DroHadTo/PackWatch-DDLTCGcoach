import { defOf } from "./cards";
import { canAttackCreature, canAttackHero, effectiveKeywords, hasClass } from "./engine";
import type { GameState } from "./types";

export type MistakeKind = "taunt" | "mana" | "trap" | "lane" | "trade" | "rush" | "killgate";

export interface CoachLine {
  now: string;
  why: string;
  dont: string[];
  legal: string[];
}

export interface Lesson {
  id: string;
  t: number;
  kind: MistakeKind;
  title: string;
  detail: string;
}

const FIVE = [
  "Do not swing into Taunt.",
  "Spend the mana — it does not bank.",
  "Do not spring a trap the turn you set it.",
  "Empty lanes stay empty. Place on purpose.",
  "Only take kill-gate fights (or Poison / a stack).",
];

export function followSkill(g: GameState, lessons: Lesson[]): CoachLine {
  if (g.winner === "you") return { now: "You won. Log what they did that died.", why: "Hero 0.", dont: [], legal: [] };
  if (g.winner === "bot") return { now: "Defeat. The lesson is on the board you left open.", why: "Your Hero 0.", dont: FIVE, legal: [] };
  if (g.winner === "draw") return { now: "Draw. Both Heroes hit 0 together.", why: "", dont: [], legal: [] };
  if (g.turn !== "you") {
    return {
      now: "Their turn. Plan the crack. Do not click.",
      why: "Wait.",
      dont: FIVE,
      legal: [],
    };
  }

  const taunt = g.bot.lanes.some((c, i) => c && effectiveKeywords(g.bot, i).includes("Taunt"));
  const playable = g.you.hand.filter((c) => defOf(c.defId).cost <= g.you.mana);
  const empty = g.you.lanes.filter((x) => !x).length;
  const legal: string[] = [];
  const dont = [...FIVE];

  g.you.lanes.forEach((c, i) => {
    if (!c) return;
    if (c.enteredThisTurn) dont.unshift(`${defOf(c.defId).name} just entered — Rush hits bodies, never the Hero.`);
    const face = canAttackHero(g, i);
    if (face.ok) legal.push(`L${i + 1} ${defOf(c.defId).name} can chip face for ${c.atk}.`);
    g.bot.lanes.forEach((d, j) => {
      if (!d) return;
      const r = canAttackCreature(g, i, j);
      if (r.ok) legal.push(`L${i + 1} kill-gates ${defOf(d.defId).name}.`);
    });
  });
  if (empty && playable.some((c) => defOf(c.defId).kind === "Creature")) {
    legal.push("Drop a creature on an empty lane.");
  }

  const hits = lessons.filter((l) => {
    if (l.kind === "taunt" && taunt) return true;
    if (l.kind === "mana" && playable.length) return true;
    if (l.kind === "trap" && playable.some((c) => defOf(c.defId).kind === "Trap")) return true;
    if (l.kind === "lane" && empty === 0) return true;
    if (l.kind === "trade" || l.kind === "killgate") return true;
    if (l.kind === "rush" && g.you.lanes.some((c) => c?.enteredThisTurn)) return true;
    return false;
  });

  let now = "Spend the mana. Develop, then only legal fights.";
  if (taunt) now = "Crack Taunt first. You cannot win through a wall.";
  else if (g.bot.hp <= 10 && legal.some((l) => l.includes("chip face"))) now = "Close it. Chip the Hero if the math finishes the game.";
  else if (!playable.length && !legal.length) now = "Nothing left that wins this turn. End turn.";

  if (hits[0]) now = `${hits[0].title} — ${now}`;

  let why = "Win the Hero race. Every tap should raise that chance.";
  if (hasClass(g.you, "Pirate")) why = "Pirate: bodies now, Haunt later, close fast.";
  if (hasClass(g.you, "Crown")) why = "Crown: walls first, then they fold.";
  if (hasClass(g.you, "Wizard")) why = "Wizard: hold the answer, then end-step them.";
  if (hasClass(g.you, "Bow")) why = "Bow: play-effect chains. Keep the board yours.";
  if (hasClass(g.you, "Zombie")) why = "Zombie: graves are fuel. Trade now, Haunt later.";

  return { now, why, dont: dont.slice(0, 5), legal: legal.slice(0, 6) };
}

export function lessonFromIllegal(detail: string): Lesson | null {
  const d = detail.toLowerCase();
  const kind: MistakeKind = /taunt/.test(d)
    ? "taunt"
    : /mana/.test(d)
      ? "mana"
      : /trap|spring/.test(d)
        ? "trap"
        : /lane/.test(d)
          ? "lane"
          : /rush|hero/.test(d)
            ? "rush"
            : /kill|gate|chip/.test(d)
              ? "killgate"
              : "trade";
  const title =
    kind === "taunt"
      ? "You swung into Taunt before"
      : kind === "mana"
        ? "You banked mana before"
        : kind === "trap"
          ? "You mistimed a trap before"
          : kind === "lane"
            ? "Lanes were clogged before"
            : kind === "rush"
              ? "Rush hit face too early before"
              : "A bad trade cost you before";
  return {
    id: `ls-${Date.now()}`,
    t: Date.now(),
    kind,
    title,
    detail,
  };
}
