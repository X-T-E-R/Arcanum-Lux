import type { OracleReading } from "@/lib/oracle/tarotToolkit";

export type Arcana = "major" | "minor";
export type Suit = "cups" | "swords" | "wands" | "pentacles";
export type Orientation = "upright" | "reversed";

export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  number: number;
  arcana: Arcana;
  suit: Suit | null;
  archetype: string;
  coreMeanings: {
    upright: CardMeaning;
    reversed: CardMeaning;
  };
  correspondences?: {
    element?: string;
    zodiac?: string;
    planet?: string;
  };
}

export interface CardMeaning {
  essence: string;
  keywords: string[];
  psychological: string;
  spiritual: string;
  practical: string;
  shadow: string;
}

export interface DrawnCard {
  card: TarotCard;
  orientation: Orientation;
  position: string;
  positionIndex: number;
  revealed: boolean;
}

export type SpreadType =
  | "single_card"
  | "three_card"
  | "celtic_cross"
  | "relationship_cross";

export interface Spread {
  id: SpreadType;
  name: string;
  nameEn: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}

export interface SpreadPosition {
  index: number;
  name: string;
  nameEn: string;
  description: string;
  x: number;
  y: number;
  rotation?: number;
}

export type ReadingPhase =
  | "idle"
  | "consultation"
  | "shuffling"
  | "dealing"
  | "revealing"
  | "interpreting"
  | "complete"
  | "error";

export interface ReadingSession {
  id: string;
  question: string;
  spreadType: SpreadType;
  drawnCards: DrawnCard[];
  phase: ReadingPhase;
  interpretation: string | null;
  createdAt: Date;
  saved?: boolean;
}

export interface ReadingHistoryItem {
  id: string;
  question: string;
  spreadType: SpreadType;
  cards: { id: string; orientation: Orientation | string; position: string }[];
  interpretation: string;
  createdAt: string;
  note?: string;
  status?: "in_progress" | "complete";
  oracleReading?: OracleReading;
  messages?: { id: string; role: "oracle" | "user"; text: string }[];
  chatHistory?: { role: "system" | "user" | "assistant"; content: string }[];
  stage?: "collecting" | "awaiting_card_response" | "awaiting_next_card" | "complete";
  revealedCardCount?: number;
  currentCardIndex?: number;
  updatedAt?: string;
}
