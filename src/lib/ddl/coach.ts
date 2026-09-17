import { KEYWORDS, RULES_TEXT } from "./cards";
import { canAttackHero, cardName, effectiveKeywords } from "./engine";
import { followSkill, type CoachLine, type Lesson } from "./skill";
import type { GameState } from "./types";

export type { CoachLine, Lesson } from "./skill";

export function coach(g: GameState, lessons: Lesson[] = []): CoachLine {
  return followSkill(g, lessons);
}

export function answerQuestion(g: GameState, raw: string): string {
  const q = raw.toLowerCase();
  const line = coach(g);
  if (q.includes("face") || q.includes("hero")) {
    const ready = g.you.lanes
      .map((c, i) => ({ c, i, r: canAttackHero(g, i) }))
      .filter((x) => x.c && x.r.ok);
    if (g.bot.lanes.some((c, i) => c && effectiveKeywords(g.bot, i).includes("Taunt"))) {
      return "No. Taunt is up — face is closed until every Taunt is gone.";
    }
    if (ready.length) {
      return `Yes. ${ready.map((x) => cardName(x.c)).join(", ")} can chip the Hero. Rush bodies that entered this turn still cannot.`;
    }
    return "Not with the current board. A creature cannot hit the Hero the turn it is played, even with Rush.";
  }
  if (q.includes("poison")) {
    return KEYWORDS.find((k) => k.name === "Poison")!.text;
  }
  if (q.includes("taunt")) {
    return KEYWORDS.find((k) => k.name === "Taunt")!.text;
  }
  if (q.includes("rush")) {
    return KEYWORDS.find((k) => k.name === "Rush")!.text;
  }
  if (q.includes("trap")) {
    return "Set a trap face-down. It cannot spring the turn you set it. Next turn, Spring or Hold when the trigger fires.";
  }
  if (q.includes("mana") || q.includes("coin")) {
    return RULES_TEXT.find((r) => r.title === "Mana")!.body;
  }
  if (q.includes("kill") || q.includes("attack") || q.includes("gate")) {
    return RULES_TEXT.find((r) => r.title === "Kill-gate")!.body;
  }
  if (q.includes("wayne") || q.includes("banned") || q.includes("ban")) {
    return "Wayne is removed from online competitive play. A 2-mana 4/1 Rush was too strong. Pack Watch will not put Wayne in a constructed deck. Use legal cards only if you want the competitive edge.";
  }
  if (q.includes("deck") || q.includes("build")) {
    return "Open Cards and tap a class. Pack Watch builds a 40-card online-legal list (max 3 copies, no Wayne) from the current pool. Then play it — the coach’s job is to turn that list into wins.";
  }
  if (q.includes("win") || q.includes("advantage") || q.includes("edge")) {
    return "We play to win. Spend mana, crack Taunt, only take kill-gate fights, close the Hero when the path is open. That is the competitive edge — fewer illegal taps than they make.";
  }
  return `${line.now} ${line.why}${line.legal.length ? " Legal: " + line.legal.join(" ") : ""}`;
}

export function answerWatch(raw: string, scan: string): string {
  const q = raw.toLowerCase();
  const text = (scan || "").toLowerCase();
  if (/wayne|banned|ban/.test(q)) {
    return "Wayne is banned from online play. Do not register it.";
  }
  if (/face|hero/.test(q)) {
    if (/taunt/.test(text)) return "No. Taunt is up — face is closed until every Taunt is gone.";
    return "A creature cannot hit the Hero the turn it is played, even with Rush. Chip face only with a ready body and no Taunt.";
  }
  if (/poison/.test(q)) return "Poison destroys the creature it fights even if ATK is lower. It does not ignore Hero HP.";
  if (/taunt/.test(q)) return "Attacks must hit Taunt first. Face and non-Taunt are closed.";
  if (/rush/.test(q)) return "Rush may hit creatures the turn it enters. Never the Hero that turn.";
  if (/trap/.test(q)) return "Set face-down. Cannot spring the turn you set it.";
  if (/mana|coin/.test(q)) return "Cap +1 each turn, refill to cap. Unspent mana does not bank. Coin pays +1 once.";
  if (/win|advantage|edge/.test(q)) {
    return "Play to win. Spend mana, crack Taunt, only take fights that kill, close the Hero when the math is there.";
  }
  if (scan.trim()) return scan;
  return "Share the play tab so I can see this match. I never touch the game page.";
}
