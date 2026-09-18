import { WAYNE_ID } from "@/lib/packwatch-config";
import raw from "./official-cards.json";

export interface OfficialCard {
  id: string;
  name: string;
  class: string;
  type: string;
  mana: number | null;
  attack: number | null;
  hp: number | null;
  keywords: string[];
  text: string;
  rarity: string;
  tier: string;
  imageUrl: string;
  banned: boolean;
}

type Raw = {
  id: string;
  name: string;
  class: string;
  type: string;
  mana: number | null;
  attack: number | null;
  hp: number | null;
  keywords?: string[];
  keyword?: string | null;
  description?: string;
  rarity?: string;
  tier?: string;
  art?: string;
};

export const OFFICIAL_CARDS: OfficialCard[] = (raw as Raw[]).map((c) => ({
  id: c.id,
  name: c.name,
  class: c.class,
  type: c.type,
  mana: c.mana,
  attack: c.attack,
  hp: c.hp,
  keywords: c.keywords?.length ? c.keywords : c.keyword ? [c.keyword] : [],
  text: c.description ?? "",
  rarity: c.rarity ?? "",
  tier: c.tier ?? "",
  imageUrl: c.art ?? "",
  banned: c.id === WAYNE_ID,
}));

export const OFFICIAL_COUNT = OFFICIAL_CARDS.length;
