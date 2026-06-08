import { create } from "zustand";
import type { ReadingSession, ReadingPhase, DrawnCard, SpreadType } from "@/types/card";

interface ReadingState {
  session: ReadingSession | null;
  setPhase: (phase: ReadingPhase) => void;
  startSession: (question: string, spreadType: SpreadType) => void;
  setDrawnCards: (cards: DrawnCard[]) => void;
  revealCard: (index: number) => void;
  revealAll: () => void;
  setInterpretation: (text: string) => void;
  appendInterpretation: (chunk: string) => void;
  reset: () => void;
}

export const useReadingStore = create<ReadingState>((set) => ({
  session: null,

  setPhase: (phase) =>
    set((s) => ({
      session: s.session ? { ...s.session, phase } : null,
    })),

  startSession: (question, spreadType) =>
    set({
      session: {
        id: crypto.randomUUID(),
        question,
        spreadType,
        drawnCards: [],
        phase: "consultation",
        interpretation: null,
        createdAt: new Date(),
      },
    }),

  setDrawnCards: (cards) =>
    set((s) => ({
      session: s.session ? { ...s.session, drawnCards: cards } : null,
    })),

  revealCard: (index) =>
    set((s) => {
      if (!s.session) return s;
      const cards = s.session.drawnCards.map((c, i) =>
        i === index ? { ...c, revealed: true } : c
      );
      return { session: { ...s.session, drawnCards: cards } };
    }),

  revealAll: () =>
    set((s) => {
      if (!s.session) return s;
      const cards = s.session.drawnCards.map((c) => ({ ...c, revealed: true }));
      return { session: { ...s.session, drawnCards: cards } };
    }),

  setInterpretation: (text) =>
    set((s) => ({
      session: s.session ? { ...s.session, interpretation: text } : null,
    })),

  appendInterpretation: (chunk) =>
    set((s) => ({
      session: s.session
        ? { ...s.session, interpretation: (s.session.interpretation ?? "") + chunk }
        : null,
    })),

  reset: () => set({ session: null }),
}));
