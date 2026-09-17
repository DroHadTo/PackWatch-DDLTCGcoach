export type HeroClass =
  | "Crown"
  | "Bow"
  | "Wizard"
  | "Zombie"
  | "Pirate"
  | "Neutral"
  | "All";

export type CardKind = "Creature" | "Spell" | "Trap";

export type Keyword = "Taunt" | "Rush" | "Poison" | "Fury" | "Frozen";

export type TrapTrigger =
  | "enemyAttack"
  | "enemySummon"
  | "enemySpell"
  | "heroDamage"
  | "fatalHero"
  | "friendlyDestroy"
  | "enemySummonAtk4"
  | "afterFaceAttack";

export type Effect =
  | { op: "draw"; n: number }
  | { op: "damage"; n: number; who: "any" | "enemyHero" | "selfHero" }
  | { op: "heal"; n: number }
  | { op: "destroyTarget" }
  | { op: "destroyAtkLte"; n: number }
  | { op: "destroyAtkGte"; n: number }
  | { op: "destroyTaunt" }
  | { op: "destroyAllCreatures" }
  | { op: "destroyAllOther" }
  | { op: "bounce" }
  | { op: "destroyBackrow" }
  | { op: "poisonPirate" }
  | { op: "lookHand" }
  | { op: "millCreature" }
  | { op: "shuffleHandRedraw" }
  | { op: "banishGrave" }
  | { op: "addFromDeck"; kind: CardKind | "any"; cls?: HeroClass; n: number }
  | { op: "addFromGrave"; kind: CardKind | "any"; cls?: HeroClass; n: number }
  | { op: "summonGrave"; maxCost: number; n: number; cls?: HeroClass }
  | { op: "summonDeck"; maxCost: number; n: number; cls?: HeroClass }
  | { op: "summonCopies" }
  | { op: "hauntAllOthers" }
  | { op: "hauntSelf" }
  | { op: "negateAttackDestroy" }
  | { op: "reflectHeroDamage" }
  | { op: "negateSpell" }
  | { op: "saveCreature" }
  | { op: "negateFatalImmune" }
  | { op: "boardWipeOnSummon" }
  | { op: "bounceSummon" }
  | { op: "destroyHighSummon" }
  | { op: "wipeAfterFace" }
  | { op: "swapAttack" }
  | { op: "shuffleTargetDeck" }
  | { op: "destroyCombatKillers" };

export interface CardDef {
  id: string;
  name: string;
  cls: HeroClass;
  kind: CardKind;
  cost: number;
  atk: number;
  hp: number;
  keywords: Keyword[];
  text: string;
  play?: Effect[];
  start?: Effect[];
  end?: Effect[];
  haunt?: Effect[];
  trap?: { trigger: TrapTrigger; fx: Effect[] };
  flags?: string[];
  /** Banned from online / competitive constructed. Still in the card bible. */
  banned?: boolean;
}

export interface CardInst {
  uid: string;
  defId: string;
  atk: number;
  hp: number;
  maxHp: number;
  exhausted: boolean;
  attacksLeft: number;
  enteredThisTurn: boolean;
  frozenTurns: number;
  poisonUntilEnd: boolean;
  faceDown: boolean;
  setThisTurn: boolean;
}

export interface PlayerState {
  id: "you" | "bot";
  hp: number;
  mana: number;
  manaCap: number;
  coin: boolean;
  deck: CardInst[];
  hand: CardInst[];
  grave: CardInst[];
  lanes: (CardInst | null)[];
  back: (CardInst | null)[];
  immuneHero: boolean;
  fatigue: number;
}

export type Phase = "idle" | "main" | "targeting" | "attacking" | "gameover";

export interface GameState {
  you: PlayerState;
  bot: PlayerState;
  turn: "you" | "bot";
  turnNo: number;
  phase: Phase;
  winner: "you" | "bot" | "draw" | null;
  selectedUid: string | null;
  pending: { uid: string; needs: "creature" | "any" | "lane" } | null;
  log: string[];
  events: LearnEvent[];
}

export interface LearnEvent {
  t: number;
  kind: "control" | "card" | "effect" | "illegal" | "scan" | "rule";
  label: string;
  detail: string;
}

export interface ControlRecord {
  id: string;
  label: string;
  where: string;
  function: string;
  seen: number;
  lastSeen: number;
}
