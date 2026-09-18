export const PACKWATCH_TITLE = "Packwatch | DDL Coach";
export const DEFAULT_BRIDGE = "http://127.0.0.1:8765";
export const BRIDGE_POLL_MS = 1500;
export const GUEST_KEY = "packwatch:guest";
export const OFFICIAL_SNAPSHOT = "2026-09-18";
export const OFFICIAL_CARDS_URL = "https://ddltcg.com/data/cards.json";
export const OFFICIAL_RULES_URL = "https://ddltcg.com/rules";
export const WAYNE_ID = "V029";

export const NAV_ITEMS = [
  { id: "watch" as const, label: "Watch", short: "Live coach" },
  { id: "arena" as const, label: "Practice", short: "Replay lab" },
  { id: "brain" as const, label: "Deck Lab", short: "Build legal" },
  { id: "progress" as const, label: "Progress", short: "Learning" },
  { id: "knowledge" as const, label: "Knowledge", short: "Rules base" },
];
