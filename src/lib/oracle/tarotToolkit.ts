import cardsEn from "@/data/tarot/cards/cards.json";
import cardsZh from "@/data/tarot/cards/cards_zh.json";
import spreadsEn from "@/data/tarot/spreads/spreads.json";
import spreadsZh from "@/data/tarot/spreads/spreads_zh.json";

export type OracleLanguage = "zh" | "en";
export type TarotSpreadId =
  | "single_card"
  | "three_card"
  | "celtic_cross"
  | "relationship_cross";
export type CardOrientation = "upright" | "reversed";

type JsonRecord = Record<string, unknown>;

interface SpreadPosition {
  name: string;
  meaning: string;
}

interface SpreadDefinition {
  id: TarotSpreadId;
  name: string;
  description: string;
  card_count: number;
  positions: SpreadPosition[];
}

interface TarotCardData extends JsonRecord {
  id: string;
  name?: string;
  number?: number;
  arcana?: "major" | "minor" | string;
  suit?: "cups" | "swords" | "wands" | "pentacles" | string | null;
  archetype?: string;
  element?: string;
  astrology?: string;
  numerology?: string;
  symbolism?: unknown[];
  keywords?: Partial<Record<CardOrientation, string[]>>;
  core_meanings?: Partial<Record<CardOrientation, JsonRecord & { essence?: string }>>;
  position_interpretations?: Record<string, Record<string, unknown>>;
}

export interface DrawCardsArgs {
  spread: TarotSpreadId;
  question: string;
  lang?: OracleLanguage;
  zodiac?: string | null;
  no_reversed?: boolean;
}

export interface ListSpreadsArgs {
  lang?: OracleLanguage;
}

export interface GetCardDetailArgs {
  card_id: string;
  lang?: OracleLanguage;
}

export interface OracleDrawnCard {
  position: string;
  position_meaning: string;
  card_id: string;
  card_name: string;
  card_number: number;
  arcana: string;
  suit?: string;
  orientation: string;
  keywords: string[];
  essence: string;
  core_meaning: JsonRecord;
  position_interpretation: string;
  symbolism: unknown[];
  element?: string;
  astrology?: string;
  numerology: string;
  archetype?: string;
}

export interface OracleReading {
  question: string;
  spread: string;
  spread_id: TarotSpreadId;
  spread_description: string;
  card_count: number;
  allow_reversed: boolean;
  lang: OracleLanguage;
  timestamp: string;
  context: JsonRecord;
  cards: OracleDrawnCard[];
  analysis: JsonRecord;
}

const DECKS: Record<OracleLanguage, Record<string, TarotCardData>> = {
  en: cardsEn as Record<string, TarotCardData>,
  zh: cardsZh as Record<string, TarotCardData>,
};

const SPREADS: Record<OracleLanguage, Record<string, SpreadDefinition>> = {
  en: spreadsEn as Record<string, SpreadDefinition>,
  zh: spreadsZh as Record<string, SpreadDefinition>,
};

const ZH_ENUMS = {
  arcana: { major: "大阿卡纳", minor: "小阿卡纳" },
  orientation: { upright: "正位", reversed: "逆位" },
  suit: { cups: "圣杯", swords: "宝剑", wands: "权杖", pentacles: "星币" },
  element: { fire: "火", water: "水", air: "风", earth: "土" },
} as const;

const ZODIAC_ZH: Record<string, string> = {
  Aries: "白羊座",
  Taurus: "金牛座",
  Gemini: "双子座",
  Cancer: "巨蟹座",
  Leo: "狮子座",
  Virgo: "处女座",
  Libra: "天秤座",
  Scorpio: "天蝎座",
  Sagittarius: "射手座",
  Capricorn: "摩羯座",
  Aquarius: "水瓶座",
  Pisces: "双鱼座",
};

const ZODIAC_ELEMENT: Record<string, "fire" | "earth" | "air" | "water"> = {
  Aries: "fire",
  Leo: "fire",
  Sagittarius: "fire",
  Taurus: "earth",
  Virgo: "earth",
  Capricorn: "earth",
  Gemini: "air",
  Libra: "air",
  Aquarius: "air",
  Cancer: "water",
  Scorpio: "water",
  Pisces: "water",
};

const SEASONS: Record<number, string> = {
  1: "winter",
  2: "winter",
  3: "spring",
  4: "spring",
  5: "spring",
  6: "summer",
  7: "summer",
  8: "summer",
  9: "autumn",
  10: "autumn",
  11: "autumn",
  12: "winter",
};

const SEASON_ZH: Record<string, string> = {
  spring: "春",
  summer: "夏",
  autumn: "秋",
  winter: "冬",
};

const COURT_RANKS = new Set(["page", "knight", "queen", "king"]);

function normalizeLanguage(lang?: string): OracleLanguage {
  return lang === "en" ? "en" : "zh";
}

function titleCaseZodiac(zodiac: string): string {
  return zodiac.trim().toLowerCase().replace(/^\w/, (ch) => ch.toUpperCase());
}

function randomBelow(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;
  const cryptoRef = globalThis.crypto;
  if (cryptoRef?.getRandomValues) {
    const maxUint = 0x100000000;
    const limit = maxUint - (maxUint % maxExclusive);
    const buf = new Uint32Array(1);
    do {
      cryptoRef.getRandomValues(buf);
    } while (buf[0] >= limit);
    return buf[0] % maxExclusive;
  }
  return Math.floor(Math.random() * maxExclusive);
}

function shuffleDeck(cardIds: string[]): string[] {
  const deck = [...cardIds];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = randomBelow(i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function getKeywords(card: TarotCardData, orientation: CardOrientation): string[] {
  const keywords = card.keywords;
  if (keywords && typeof keywords === "object") {
    return keywords[orientation] ?? [];
  }
  return [];
}

function getEssence(card: TarotCardData, orientation: CardOrientation): string {
  return String(card.core_meanings?.[orientation]?.essence ?? "");
}

function getCoreMeaning(card: TarotCardData, orientation: CardOrientation): JsonRecord {
  return card.core_meanings?.[orientation] ?? {};
}

function getPositionInterpretation(
  card: TarotCardData,
  positionName: string,
  orientation: CardOrientation,
): string {
  const groups = card.position_interpretations ?? {};
  const posLower = positionName.toLowerCase().replaceAll("/", "_").replaceAll(" ", "_");

  for (const group of Object.values(groups)) {
    if (!group || typeof group !== "object") continue;
    for (const [key, value] of Object.entries(group)) {
      if (!key.toLowerCase().replaceAll(" ", "_").includes(posLower)) continue;
      if (value && typeof value === "object") {
        const oriented = (value as Record<string, unknown>)[orientation];
        return typeof oriented === "string" ? oriented : "";
      }
      return "";
    }
  }
  return "";
}

function drawCardsFromDeck(
  deck: Record<string, TarotCardData>,
  spread: SpreadDefinition,
  allowReversed: boolean,
): OracleDrawnCard[] {
  const shuffled = shuffleDeck(Object.keys(deck));
  return spread.positions.slice(0, spread.card_count).map((position, index) => {
    const cardId = shuffled[index];
    const card = deck[cardId];
    const orientation: CardOrientation =
      allowReversed && randomBelow(2) !== 0 ? "reversed" : "upright";

    return {
      position: position.name,
      position_meaning: position.meaning,
      card_id: cardId,
      card_name: card.name ?? "",
      card_number: card.number ?? 0,
      arcana: card.arcana ?? "minor",
      suit: card.suit ?? undefined,
      orientation,
      keywords: getKeywords(card, orientation),
      essence: getEssence(card, orientation),
      core_meaning: getCoreMeaning(card, orientation),
      position_interpretation: getPositionInterpretation(card, position.name, orientation),
      symbolism: card.symbolism ?? [],
      element: card.element,
      astrology: card.astrology,
      numerology: String(card.numerology ?? ""),
      archetype: card.archetype,
    };
  });
}

function analyzeReading(drawn: OracleDrawnCard[]): JsonRecord {
  const elements: Record<string, number> = { fire: 0, water: 0, air: 0, earth: 0 };
  let major = 0;
  let minor = 0;
  let upright = 0;
  let reversed = 0;
  const courtCards: JsonRecord[] = [];

  for (const card of drawn) {
    if (card.element && card.element in elements) elements[card.element] += 1;
    if (card.arcana === "major") major += 1;
    else minor += 1;
    if (card.orientation === "upright") upright += 1;
    else reversed += 1;

    const rank = card.card_id.split("_")[0];
    if (COURT_RANKS.has(rank)) {
      courtCards.push({ card_id: card.card_id, rank, position: card.position });
    }
  }

  const missingElements = Object.entries(elements)
    .filter(([, count]) => count === 0)
    .map(([element]) => element);
  const dominantElement = Object.values(elements).some(Boolean)
    ? Object.entries(elements).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  return {
    elemental_balance: elements,
    dominant_element: dominantElement,
    missing_elements: missingElements,
    major_arcana_count: major,
    minor_arcana_count: minor,
    upright_count: upright,
    reversed_count: reversed,
    court_cards: courtCards,
  };
}

function translateReading(reading: OracleReading, drawn: OracleDrawnCard[]) {
  for (const card of drawn) {
    card.arcana = ZH_ENUMS.arcana[card.arcana as keyof typeof ZH_ENUMS.arcana] ?? card.arcana;
    card.orientation =
      ZH_ENUMS.orientation[card.orientation as keyof typeof ZH_ENUMS.orientation] ??
      card.orientation;
    if (card.suit) {
      card.suit = ZH_ENUMS.suit[card.suit as keyof typeof ZH_ENUMS.suit] ?? card.suit;
    }
    if (card.element) {
      card.element =
        ZH_ENUMS.element[card.element as keyof typeof ZH_ENUMS.element] ?? card.element;
    }
  }

  const analysis = reading.analysis;
  if (typeof analysis.dominant_element === "string") {
    analysis.dominant_element =
      ZH_ENUMS.element[analysis.dominant_element as keyof typeof ZH_ENUMS.element] ??
      analysis.dominant_element;
  }
  if (analysis.elemental_balance && typeof analysis.elemental_balance === "object") {
    const translated: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(analysis.elemental_balance as JsonRecord)) {
      translated[ZH_ENUMS.element[key as keyof typeof ZH_ENUMS.element] ?? key] = value;
    }
    analysis.elemental_balance = translated;
  }
  if (Array.isArray(analysis.missing_elements)) {
    analysis.missing_elements = analysis.missing_elements.map((element) =>
      typeof element === "string"
        ? ZH_ENUMS.element[element as keyof typeof ZH_ENUMS.element] ?? element
        : element,
    );
  }

  const context = reading.context;
  if (typeof context.season === "string") {
    context.season = SEASON_ZH[context.season] ?? context.season;
  }
  if (typeof context.user_zodiac === "string") {
    context.user_zodiac = ZODIAC_ZH[context.user_zodiac] ?? context.user_zodiac;
  }
  if (typeof context.user_zodiac_element === "string") {
    context.user_zodiac_element =
      ZH_ENUMS.element[context.user_zodiac_element as keyof typeof ZH_ENUMS.element] ??
      context.user_zodiac_element;
  }

  if (Array.isArray(analysis.court_cards)) {
    const rankZh: Record<string, string> = {
      page: "侍从",
      knight: "骑士",
      queen: "皇后",
      king: "国王",
    };
    for (const court of analysis.court_cards) {
      if (court && typeof court === "object") {
        const entry = court as JsonRecord;
        if (typeof entry.rank === "string") entry.rank = rankZh[entry.rank] ?? entry.rank;
      }
    }
  }
}

export function drawCards(args: DrawCardsArgs): OracleReading {
  const lang = normalizeLanguage(args.lang);
  const deck = DECKS[lang];
  const spreads = SPREADS[lang];
  const spread = spreads[args.spread];

  if (!spread) {
    throw new Error(`Error: unknown spread '${args.spread}'`);
  }

  const allowReversed = !args.no_reversed;
  const drawn = drawCardsFromDeck(deck, spread, allowReversed);
  const analysis = analyzeReading(drawn);
  const now = new Date();
  const context: JsonRecord = {
    season: SEASONS[now.getUTCMonth() + 1] ?? "unknown",
    date: now.toISOString().slice(0, 10),
  };

  if (args.zodiac?.trim()) {
    const userZodiac = titleCaseZodiac(args.zodiac);
    context.user_zodiac = userZodiac;
    const userElement = ZODIAC_ELEMENT[userZodiac];
    if (userElement) context.user_zodiac_element = userElement;

    const matchingCards: JsonRecord[] = [];
    for (const card of drawn) {
      const cardAstro = (card.astrology ?? "").toLowerCase();
      if (cardAstro.includes(userZodiac.toLowerCase())) {
        matchingCards.push({ card: card.card_name, match: "zodiac" });
      } else if (userElement && cardAstro.includes(userElement)) {
        matchingCards.push({ card: card.card_name, match: "element" });
      }
    }
    if (matchingCards.length) context.zodiac_card_matches = matchingCards;
  }

  const reading: OracleReading = {
    question: args.question,
    spread: spread.name ?? args.spread,
    spread_id: args.spread,
    spread_description: spread.description ?? "",
    card_count: spread.card_count,
    allow_reversed: allowReversed,
    lang,
    timestamp: now.toISOString(),
    context,
    cards: drawn,
    analysis,
  };

  if (lang === "zh") translateReading(reading, drawn);
  return reading;
}

export function drawCardsTool(args: DrawCardsArgs): string {
  return JSON.stringify(drawCards(args), null, 2);
}

export function listSpreadsTool(args: ListSpreadsArgs = {}): string {
  const lang = normalizeLanguage(args.lang);
  return Object.entries(SPREADS[lang])
    .map(([, spread]) => {
      const id = spread.id.padEnd(25, " ");
      const count = String(spread.card_count).padStart(2, " ");
      return `  ${id} ${count} cards  — ${spread.description}`;
    })
    .join("\n");
}

export function getCardDetailTool(args: GetCardDetailArgs): string {
  const lang = normalizeLanguage(args.lang);
  const card = DECKS[lang][args.card_id];
  if (!card) return `Error: unknown card '${args.card_id}'`;
  return JSON.stringify(card, null, 2);
}

export function parseReadingToolResult(result: string): OracleReading | null {
  try {
    const parsed = JSON.parse(result) as OracleReading;
    if (parsed?.cards && parsed?.spread_id) return parsed;
  } catch {
    return null;
  }
  return null;
}
