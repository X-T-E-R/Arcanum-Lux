"use client";

import { useCallback, useRef, useState } from "react";
import { TAROT_READER_SYSTEM_PROMPT } from "@/lib/oracle/instructions";
import { completeChat, type ChatMessage } from "@/lib/oracle/openaiCompatible";
import { drawCards, type OracleLanguage, type OracleReading } from "@/lib/oracle/tarotToolkit";
import { useByokStore } from "@/stores/byokStore";
import { useHistoryStore } from "@/stores/historyStore";
import type { ReadingHistoryItem } from "@/types/card";

export interface OracleUiMessage {
  id: string;
  role: "oracle" | "user";
  text: string;
}

export type OracleStage =
  | "collecting"
  | "awaiting_card_response"
  | "awaiting_next_card"
  | "complete";

interface SendOptions {
  language?: OracleLanguage;
}

const READY_PATTERN = /(好了|准备好了|可以了|开始|开牌|抽牌|洗好了|ready|okay|ok\b)/i;

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function runtimeMessages(language: OracleLanguage): ChatMessage[] {
  return [
    { role: "system", content: TAROT_READER_SYSTEM_PROMPT },
    {
      role: "system",
      content: `session_state: ${JSON.stringify({ preferred_language: language })}`,
    },
  ];
}

function readingSummary(reading: OracleReading): string {
  return JSON.stringify(
    {
      question: reading.question,
      spread: reading.spread,
      spread_id: reading.spread_id,
      spread_description: reading.spread_description,
      card_count: reading.card_count,
      allow_reversed: reading.allow_reversed,
      lang: reading.lang,
      timestamp: reading.timestamp,
      context: reading.context,
      analysis: reading.analysis,
    },
    null,
    2,
  );
}

function baitContext(reading: OracleReading, cardIndex: number): ChatMessage {
  const card = reading.cards[cardIndex];
  return {
    role: "system",
    content: [
      "RUNTIME DRAW CONTEXT:",
      "The browser-side tarot draw engine already produced the reading context for this session. Treat this as the draw_cards result. Do not invent cards.",
      `Only card ${cardIndex + 1} of ${reading.cards.length} is revealed right now. Do not name, hint at, or summarize unrevealed cards.`,
      `Reading metadata:\n${readingSummary(reading)}`,
      `Current revealed card JSON:\n${JSON.stringify(card, null, 2)}`,
      "Follow STEP 6 Phase 1 (投饵/Bait) for this card only. Reveal the card name, describe one vivid art/detail image, ask the user for a co-interpretation response, then stop.",
    ].join("\n\n"),
  };
}

function deepenContext(reading: OracleReading, cardIndex: number): ChatMessage {
  const isLast = cardIndex >= reading.cards.length - 1;
  const revealedCards = reading.cards.slice(0, cardIndex + 1);
  return {
    role: "system",
    content: [
      "RUNTIME REVEAL CONTEXT:",
      `The user's previous message is their response to card ${cardIndex + 1}.`,
      `Revealed cards so far:\n${JSON.stringify(revealedCards, null, 2)}`,
      isLast
        ? "Follow STEP 6 Phase 3 for the last card, then deliver the full narrative synthesis and CLOSING using the complete reading. Do not ask the user to continue."
        : "Follow STEP 6 Phase 3 for the current card only. Do not reveal the next card. End by inviting the user to share their feelings, associations, and thoughts. Do not ask them to say 「继续」.",
    ].join("\n\n"),
  };
}

function shouldRevealFirstCard(message: string, stage: OracleStage): boolean {
  return stage === "collecting" && READY_PATTERN.test(message);
}

function shouldRevealNextCard(message: string, stage: OracleStage): boolean {
  return stage === "awaiting_next_card" && Boolean(message.trim());
}

function toErrorText(error: unknown): string {
  const message = (error as Error)?.message;
  if (!message) return "ERR";
  const normalized = message.replace(/\s+/g, " ").trim();
  if (normalized.includes("Failed to fetch")) return "NETWORK: Failed to fetch";
  if (normalized.includes("Load failed")) return "NETWORK: Load failed";
  return normalized.slice(0, 160);
}

function isOracleStage(value: unknown): value is OracleStage {
  return (
    value === "collecting" ||
    value === "awaiting_card_response" ||
    value === "awaiting_next_card" ||
    value === "complete"
  );
}

export function useOracleChat() {
  const apiKey = useByokStore((state) => state.apiKey);
  const baseUrl = useByokStore((state) => state.baseUrl);
  const model = useByokStore((state) => state.model);
  const addOracleReading = useHistoryStore((state) => state.addOracleReading);

  const [messages, setMessages] = useState<OracleUiMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<OracleStage>("collecting");
  const [currentReading, setCurrentReading] = useState<OracleReading | null>(null);
  const [revealedCardCount, setRevealedCardCount] = useState(0);

  const chatHistoryRef = useRef<ChatMessage[]>([]);
  const messagesRef = useRef<OracleUiMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const stageRef = useRef<OracleStage>("collecting");
  const currentReadingRef = useRef<OracleReading | null>(null);
  const currentCardIndexRef = useRef(0);
  const revealedCardCountRef = useRef(0);

  const hasConfig = Boolean(apiKey.trim() && baseUrl.trim() && model.trim());

  const setStageBoth = useCallback((next: OracleStage) => {
    stageRef.current = next;
    setStage(next);
  }, []);

  const setRevealedCardCountBoth = useCallback((next: number) => {
    revealedCardCountRef.current = next;
    setRevealedCardCount(next);
  }, []);

  const setMessagesBoth = useCallback((next: OracleUiMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
  }, []);

  const appendMessage = useCallback(
    (message: OracleUiMessage) => {
      const next = [...messagesRef.current, message];
      setMessagesBoth(next);
      return next;
    },
    [setMessagesBoth],
  );

  const ensureReading = useCallback((question: string, language: OracleLanguage) => {
    if (currentReadingRef.current) return currentReadingRef.current;
    const reading = drawCards({
      spread: "three_card",
      question: question.trim() || "未命名的问题",
      lang: language,
    });
    currentReadingRef.current = reading;
    setCurrentReading(reading);
    return reading;
  }, []);

  const persistReading = useCallback(
    (reading: OracleReading, interpretation: string) => {
      addOracleReading(reading, interpretation, {
        status: stageRef.current === "complete" ? "complete" : "in_progress",
        messages: messagesRef.current,
        chatHistory: chatHistoryRef.current,
        stage: stageRef.current,
        revealedCardCount: revealedCardCountRef.current,
        currentCardIndex: currentCardIndexRef.current,
      });
    },
    [addOracleReading],
  );

  const prepareReading = useCallback(
    (question: string, language: OracleLanguage = "zh") => {
      const trimmed = question.trim();
      if (!trimmed) return null;
      abortRef.current?.abort();
      chatHistoryRef.current = [];
      currentReadingRef.current = null;
      currentCardIndexRef.current = 0;
      setMessagesBoth([]);
      setText("");
      setError(null);
      setRevealedCardCountBoth(0);
      setStageBoth("collecting");
      const reading = ensureReading(trimmed, language);
      persistReading(reading, "");
      return reading;
    },
    [ensureReading, persistReading, setMessagesBoth, setRevealedCardCountBoth, setStageBoth],
  );

  const restoreSession = useCallback(
    (item: ReadingHistoryItem) => {
      if (!item.oracleReading) return false;
      const restoredStage = isOracleStage(item.stage) ? item.stage : "collecting";
      const restoredMessages = item.messages ?? [];
      const restoredChatHistory = item.chatHistory ?? [];
      const restoredRevealedCardCount = item.revealedCardCount ?? item.oracleReading.cards.length;
      const restoredCardIndex = item.currentCardIndex ?? Math.max(0, restoredRevealedCardCount - 1);

      abortRef.current?.abort();
      chatHistoryRef.current = restoredChatHistory;
      currentReadingRef.current = item.oracleReading;
      currentCardIndexRef.current = restoredCardIndex;
      setMessagesBoth(restoredMessages);
      setCurrentReading(item.oracleReading);
      setRevealedCardCountBoth(restoredRevealedCardCount);
      setStageBoth(restoredStage);
      setText([...restoredMessages].reverse().find((message) => message.role === "oracle")?.text ?? "");
      setError(null);
      return true;
    },
    [setMessagesBoth, setRevealedCardCountBoth, setStageBoth],
  );

  const send = useCallback(
    async (message: string, opts: SendOptions = {}) => {
      const trimmed = message.trim();
      if (!trimmed) {
        console.warn("[oracle] send ignored", { reason: "empty_message", stage: stageRef.current });
        return false;
      }
      if (streaming) {
        console.warn("[oracle] send ignored", { reason: "streaming", stage: stageRef.current });
        return false;
      }
      if (!hasConfig) {
        console.error("[oracle] missing BYOK config", {
          hasApiKey: Boolean(apiKey.trim()),
          hasBaseUrl: Boolean(baseUrl.trim()),
          hasModel: Boolean(model.trim()),
        });
        setError("NO_KEY");
        return false;
      }

      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const language = opts.language ?? "zh";
      const userMessage: ChatMessage = { role: "user", content: trimmed };
      chatHistoryRef.current.push(userMessage);
      appendMessage({ id: createId("user"), role: "user", text: trimmed });
      setStreaming(true);
      setError(null);
      setText("");

      try {
        const reading = ensureReading(trimmed, language);

        if (shouldRevealFirstCard(trimmed, stageRef.current)) {
          currentCardIndexRef.current = 0;
          chatHistoryRef.current.push(baitContext(reading, 0));
          setRevealedCardCountBoth(1);
          setStageBoth("awaiting_card_response");
        } else if (shouldRevealNextCard(trimmed, stageRef.current)) {
          const nextIndex = Math.min(currentCardIndexRef.current + 1, reading.cards.length - 1);
          currentCardIndexRef.current = nextIndex;
          chatHistoryRef.current.push(baitContext(reading, nextIndex));
          setRevealedCardCountBoth(nextIndex + 1);
          setStageBoth("awaiting_card_response");
        } else if (stageRef.current === "awaiting_card_response") {
          const cardIndex = currentCardIndexRef.current;
          chatHistoryRef.current.push(deepenContext(reading, cardIndex));
          if (cardIndex >= reading.cards.length - 1) {
            setRevealedCardCountBoth(reading.cards.length);
            setStageBoth("complete");
          } else {
            setStageBoth("awaiting_next_card");
          }
        }

        const assistantText = await completeChat(
          { apiKey, baseUrl, model },
          [...runtimeMessages(language), ...chatHistoryRef.current],
          ctrl.signal,
        );

        chatHistoryRef.current.push({ role: "assistant", content: assistantText });
        setText(assistantText);
        appendMessage({ id: createId("oracle"), role: "oracle", text: assistantText });

        if (currentReadingRef.current) {
          persistReading(currentReadingRef.current, assistantText);
        }
        return true;
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          console.error("[oracle] chat send error", {
            stage: stageRef.current,
            baseUrl,
            model,
            error: e,
          });
          setError(toErrorText(e));
        }
        return false;
      } finally {
        setStreaming(false);
      }
    },
    [
      addOracleReading,
      appendMessage,
      apiKey,
      baseUrl,
      ensureReading,
      hasConfig,
      model,
      persistReading,
      setRevealedCardCountBoth,
      setStageBoth,
      streaming,
    ],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
  }, []);

  const resetSession = useCallback(() => {
    abortRef.current?.abort();
    chatHistoryRef.current = [];
    messagesRef.current = [];
    currentReadingRef.current = null;
    currentCardIndexRef.current = 0;
    revealedCardCountRef.current = 0;
    setMessages([]);
    setText("");
    setError(null);
    setCurrentReading(null);
    setRevealedCardCount(0);
    setStageBoth("collecting");
  }, [setStageBoth]);

  return {
    prepareReading,
    restoreSession,
    send,
    abort,
    resetSession,
    streaming,
    text,
    error,
    messages,
    stage,
    currentReading,
    revealedCardCount,
    hasConfig,
  };
}
