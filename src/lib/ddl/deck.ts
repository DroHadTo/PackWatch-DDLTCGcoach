import { LEGAL_POOL } from "./cards";
import type { CardDef, HeroClass } from "./types";

export const DECK_CLASSES: HeroClass[] = ["Pirate", "Crown", "Wizard", "Bow", "Zombie"];

export interface BuiltDeck {
  cls: HeroClass;
  list: CardDef[];
  notes: string;
}

function score(c: CardDef, cls: HeroClass) {
  let s = 12 - c.cost;
  if (c.cls === cls) s += 6;
  if (c.keywords.includes("Taunt") || c.keywords.includes("Rush") || c.keywords.includes("Poison")) s += 3;
  if (c.kind === "Spell" || c.kind === "Trap") s += 1;
  if (c.play || c.haunt || c.end || c.start) s += 2;
  if (c.cost <= 2 && c.kind === "Creature") s += 3;
  if (c.cost >= 7) s -= 2;
  return s;
}

export function buildCompetitiveDeck(cls: HeroClass): BuiltDeck {
  const pool = LEGAL_POOL.filter((c) => c.cls === cls || c.cls === "Neutral" || c.cls === "All");
  const ranked = [...pool].sort((a, b) => score(b, cls) - score(a, cls) || a.cost - b.cost);
  const list: CardDef[] = [];
  const count: Record<string, number> = {};

  for (const c of ranked) {
    if (list.length >= 40) break;
    const copies = c.cost <= 3 ? 3 : c.cost <= 5 ? 2 : 1;
    for (let i = 0; i < copies && list.length < 40; i++) {
      if ((count[c.id] ?? 0) >= 3) break;
      list.push(c);
      count[c.id] = (count[c.id] ?? 0) + 1;
    }
  }

  const curve = [0, 0, 0, 0, 0, 0, 0];
  for (const c of list) curve[Math.min(6, c.cost)] += 1;

  const notes =
    `${cls} constructed. 40 cards, max 3 copies. Wayne is banned from online play and is not in this list. ` +
    `Curve 0–1:${curve[0] + curve[1]} · 2:${curve[2]} · 3:${curve[3]} · 4+:${curve[4] + curve[5] + curve[6]}. ` +
    `Play this list on ddltcg.com — Pack Watch’s job is to turn it into wins.`;

  return { cls, list, notes };
}

export function groupDeck(list: CardDef[]) {
  const map = new Map<string, { def: CardDef; n: number }>();
  for (const c of list) {
    const hit = map.get(c.id);
    if (hit) hit.n += 1;
    else map.set(c.id, { def: c, n: 1 });
  }
  return [...map.values()].sort((a, b) => a.def.cost - b.def.cost || a.def.name.localeCompare(b.def.name));
}
