import type { Suit, TarotCard } from "@/types/card";

const IMAGE_ROOT = "/images";

const SUIT_FILE_PREFIX: Record<Suit, string> = {
  cups: "cups",
  swords: "swords",
  wands: "wands",
  pentacles: "pents",
};

const MINOR_NUMBER_RANKS: Record<string, string> = {
  two: "02",
  three: "03",
  four: "04",
  five: "05",
  six: "06",
  seven: "07",
  eight: "08",
  nine: "09",
  ten: "10",
};

function normalizeMinorRank(cardId: string): string {
  const raw = cardId.split("_of_")[0];
  if (raw === "ace" || raw === "page" || raw === "knight" || raw === "queen" || raw === "king") {
    return raw;
  }
  if (raw in MINOR_NUMBER_RANKS) return MINOR_NUMBER_RANKS[raw];
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? String(numeric).padStart(2, "0") : raw;
}

export function assetImagePath(relativePathWithoutExtension: string): string {
  return `${IMAGE_ROOT}/${relativePathWithoutExtension}.webp`;
}

export function witchImagePath(): string {
  return assetImagePath("witch");
}

export function cardBackImagePath(): string {
  return assetImagePath("cards/backs/card_back_main");
}

export function majorCardImagePath(cardId: string): string {
  return assetImagePath(`cards/major/${cardId}`);
}

export function minorCardImagePath(suit: Suit, rank: string): string {
  const prefix = SUIT_FILE_PREFIX[suit];
  return assetImagePath(`cards/minor/${suit}/${prefix}_${rank}`);
}

export function tarotCardImagePath(card: Pick<TarotCard, "id" | "arcana" | "suit">): string {
  if (card.arcana === "major") return majorCardImagePath(card.id);
  if (!card.suit) return cardBackImagePath();
  return minorCardImagePath(card.suit, normalizeMinorRank(card.id));
}
