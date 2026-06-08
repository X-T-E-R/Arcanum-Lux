import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ReadingHistoryItem } from "@/types/card";
import type { OracleReading } from "@/lib/oracle/tarotToolkit";

type OracleHistorySnapshot = Pick<
  ReadingHistoryItem,
  | "status"
  | "messages"
  | "chatHistory"
  | "stage"
  | "revealedCardCount"
  | "currentCardIndex"
>;

interface HistoryState {
  items: ReadingHistoryItem[];
  activeSessionId: string | null;
  addOracleReading: (
    reading: OracleReading,
    interpretation: string,
    snapshot?: OracleHistorySnapshot,
  ) => string;
  setActiveSession: (id: string) => void;
  clearActiveSession: () => void;
  clearHistory: () => void;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function readingId(reading: OracleReading): string {
  return `${reading.timestamp}-${reading.spread_id}`;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      activeSessionId: null,
      addOracleReading: (reading, interpretation, snapshot) => {
        const id = readingId(reading);
        set((state) => {
          const item: ReadingHistoryItem = {
            id,
            question: reading.question,
            spreadType: reading.spread_id,
            cards: reading.cards.map((card) => ({
              id: card.card_name || card.card_id,
              orientation: card.orientation,
              position: card.position,
            })),
            interpretation,
            createdAt: formatDate(reading.timestamp),
            status: snapshot?.status ?? "complete",
            oracleReading: reading,
            messages: snapshot?.messages,
            chatHistory: snapshot?.chatHistory,
            stage: snapshot?.stage,
            revealedCardCount: snapshot?.revealedCardCount,
            currentCardIndex: snapshot?.currentCardIndex,
            updatedAt: new Date().toISOString(),
          };
          return {
            items: [item, ...state.items.filter((existing) => existing.id !== id)].slice(0, 100),
          };
        });
        return id;
      },
      setActiveSession: (id) => set({ activeSessionId: id }),
      clearActiveSession: () => set({ activeSessionId: null }),
      clearHistory: () => set({ items: [], activeSessionId: null }),
    }),
    { name: "arcanum-history" },
  ),
);
