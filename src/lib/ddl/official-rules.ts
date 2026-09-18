export interface RuleSection {
  section: string;
  text: string;
}

/** Snapshot of https://ddltcg.com/rules — 2026-09-18. Printed card text overrides this. */
export const OFFICIAL_RULES: RuleSection[] = [
  {
    section: "Deck construction",
    text: "A deck contains exactly 40 cards. No more than 3 copies of a single card. Classes may be mixed. Neutral cards may be included in any deck. Wayne (V029) is excluded from online competitive play.",
  },
  {
    section: "Starting setup",
    text: "Each Hero starts at 40 HP. Each player has 5 creature lanes and 5 spell/trap spaces. A lane holds one creature. Empty lanes remain empty — creatures never slide to close a gap. Left and right lanes are adjacent. Diagonal lanes are not.",
  },
  {
    section: "Opening hand",
    text: "Draw 4. Return opening cards costing 5 or more, then draw replacements. Cards costing 4 or less remain.",
  },
  {
    section: "Mana",
    text: "Mana increases by 1 each turn, cap 10, refills to the current cap. Unspent mana does not carry over.",
  },
  {
    section: "The Coin",
    text: "Second player gets the Coin. It allows one card costing 1 more than current mana. It does not raise the permanent cap.",
  },
  {
    section: "Hand and fatigue",
    text: "Maximum hand size is 10. Overflow goes to the graveyard. Empty deck: fatigue 1, then 2, then 3, and upward.",
  },
  {
    section: "Turn order",
    text: "Gain → Draw → Start → Main → End.",
  },
  {
    section: "Creature readiness",
    text: "Creatures cannot attack the turn they are played unless they have Rush. Rush may attack another creature that turn. Rush cannot attack the enemy Hero that turn.",
  },
  {
    section: "Traps",
    text: "Set face-down on the spell row. Cannot spring the turn they are set. Eligible from the next turn. Multiple traps resolve left to right. A stopping trap ends that wave.",
  },
  {
    section: "Combat and kill-gate",
    text: "Creature fights must kill at least one body (ATK ≥ HP, Poison, or a stack). Suicide trades are legal. No chip when nobody would die. Multiple attackers may stack; the defender strikes each. Heroes take real face damage. Taunt must be attacked before face or non-Taunt bodies.",
  },
  {
    section: "Keywords",
    text: "Taunt: must be attacked first. Rush: creatures this turn, never the Hero this turn. Poison: destroys the creature it fights. Fury: attack twice when ready. Frozen: cannot attack; lasts through the controller's next turn.",
  },
  {
    section: "Effect timing",
    text: "Play: from hand. Summoned copies do not get Play unless text says so. Start during Start. End during End. Haunt on death or printed trigger. Passive while the source is in play. Resolve left to right. No shared response stack. Printed card text overrides summaries.",
  },
  {
    section: "Classes",
    text: "Crown: walls, Taunt, healing, long game. Bow: play-effect chains. Wizard: spells, answers, end-step value. Zombie: Haunt, sacrifice, grave recursion. Pirate: tempo and death payouts. Neutral: shared tools.",
  },
  {
    section: "Safety",
    text: "Packwatch is advice only. The player clicks every card. Never invent a board. Never recommend Wayne V029 for online play. Separate observed facts from recommendation and confidence.",
  },
];
