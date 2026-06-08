"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowCounterClockwise, Bookmark, ShareNetwork } from "@phosphor-icons/react";
import GoldButton from "@/components/ui/GoldButton";
import TarotCard from "@/components/card/TarotCard";
import CardDeck from "@/components/card/CardDeck";
import Typewriter from "@/components/ui/Typewriter";
import MarkdownText from "@/components/ui/MarkdownText";
import OracleInput from "@/components/ui/OracleInput";
import { useOracleChat } from "@/hooks/useOracleChat";
import { tarotCardImagePath, witchImagePath } from "@/lib/assets";
import { useHistoryStore } from "@/stores/historyStore";
import type { DrawnCard, Orientation, ReadingHistoryItem } from "@/types/card";

// 开场白与洗牌引导 — UI 过渡文字，不是 AI 对话内容
const ORACLE_GREET = "来，坐下。先缓缓……\n今天是什么风，把你吹到我这儿来的？";
const ORACLE_READY = "好……让我先感受一下这副牌。\n在心里默念你的问题，不需要说出来。\n准备好了，点一下牌组。";

type Phase =
  | "greeting" | "question" | "shuffle_wait" | "shuffling" | "fanned" | "dealing"
  | "bait" | "waiting_flip" | "waiting_input" | "deepen"
  | "interpreting" | "complete";

// ── 「写下你的感受」逐字母出现 ────────────────────────────────────
function InputReveal({ onReady }: { onReady: () => void }) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const text = "写下你的感受……";
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 1100);
    const t3 = setTimeout(onReady, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onReady]);
  return (
    <div className="w-full max-w-sm">
      <motion.div className="h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent mb-3"
        initial={{ scaleX: 0 }} animate={{ scaleX: step >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} style={{ transformOrigin: "center" }} />
      <div className="min-h-[20px]">
        {step >= 2 && (
          <span className="text-gold-200/30 font-body text-sm">
            {text.split("").map((ch, i) => (
              <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05, duration: 0.15 }}>{ch}</motion.span>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

function MarkdownTypewriter({
  text,
  speed = 18,
  className = "",
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [speed, text]);

  return (
    <div className="relative">
      <MarkdownText text={displayed} className={className} />
      {!done && (
        <motion.span className="inline-block w-0.5 h-[1em] bg-gold-400/60 ml-0.5 align-text-bottom"
          animate={{ opacity: [1, 0] }} transition={{ duration: 1.05, repeat: Infinity }} />
      )}
    </div>
  );
}

function OracleThinkingCursor() {
  return (
    <motion.span
      className="inline-block w-0.5 h-[1em] bg-gold-400/70 ml-0.5 align-text-bottom"
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 1.05, repeat: Infinity }}
    />
  );
}

// ── 已翻牌叠扇 ───────────────────────────────────────────────────
function RevealedStack({
  cards,
  onCardClick,
}: {
  cards: DrawnCard[];
  onCardClick?: (card: DrawnCard) => void;
}) {
  if (cards.length === 0) return null;
  const W = 56, H = 88, SPREAD = 18;
  return (
    <div className="relative shrink-0" style={{ width: W + SPREAD * (cards.length - 1) + 8, height: H }}>
      {cards.map((c, i) => (
        <div key={i} className="absolute rounded overflow-hidden border border-gold-400/15 shadow-md cursor-zoom-in"
          onClick={() => onCardClick?.(c)}
          style={{ width: W, height: H, left: i * SPREAD, zIndex: i,
            transform: `rotate(${(i - (cards.length - 1) / 2) * 3}deg)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tarotCardImagePath(c.card)} alt={c.card.name}
            className={`w-full h-full object-contain bg-[#0A0A1A] ${c.orientation === "reversed" ? "rotate-180" : ""}`}
            draggable={false} />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-center py-0.5">
            <span className="text-[7px] font-heading text-gold-300/80">{c.card.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// OracleReading 里的 card → DrawnCard（用于 TarotCard 组件）
function oracleCardToDrawn(card: { card_id: string; card_name: string; orientation: string; position: string }, idx: number): DrawnCard {
  return {
    card: {
      id: card.card_id,
      name: card.card_name,
      nameEn: card.card_name,
      number: idx,
      arcana: card.card_id.includes("_of_") ? "minor" : "major",
      suit: card.card_id.includes("_of_") ? (card.card_id.split("_of_")[1] as DrawnCard["card"]["suit"]) : null,
      archetype: "",
      coreMeanings: {
        upright: { essence: "", keywords: [], psychological: "", spiritual: "", practical: "", shadow: "" },
        reversed: { essence: "", keywords: [], psychological: "", spiritual: "", practical: "", shadow: "" },
      },
    },
    orientation: (card.orientation === "reversed" || card.orientation === "逆位" ? "reversed" : "upright") as Orientation,
    position: card.position,
    positionIndex: idx,
    revealed: false,
  };
}

function phaseFromHistory(item: ReadingHistoryItem): Phase {
  if (item.status === "complete" || item.stage === "complete") return "complete";
  if (item.stage === "awaiting_card_response") return "waiting_input";
  if (item.stage === "awaiting_next_card") return "waiting_input";
  return "shuffle_wait";
}

export default function ReadingPage() {
  const {
    prepareReading,
    restoreSession,
    send,
    resetSession,
    streaming,
    messages,
    stage,
    currentReading,
    revealedCardCount,
    hasConfig,
    error,
  } = useOracleChat();
  const history = useHistoryStore((state) => state.items);
  const activeSessionId = useHistoryStore((state) => state.activeSessionId);
  const clearActiveSession = useHistoryStore((state) => state.clearActiveSession);

  const [phase, setPhase] = useState<Phase>("greeting");
  const [userReply, setUserReply] = useState("");
  const [question, setQuestion] = useState("");
  const [deckPhase, setDeckPhase] = useState<"idle" | "shuffling" | "fanned">("idle");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [inputVisible, setInputVisible] = useState(false);
  const [zoomedCard, setZoomedCard] = useState<DrawnCard | null>(null);
  const restoredRef = useRef<string | null>(null);

  // oracle 最新一条消息的文字（占卜师说的话）
  const lastOracleMessage = [...messages].reverse().find(m => m.role === "oracle");
  const lastOracleText = lastOracleMessage?.text ?? "";
  const isStreaming = streaming;

  useEffect(() => {
    if (!error) return;
    console.error("[oracle] reading page error", { phase, stage, error });
    window.alert(error);
    if (phase === "dealing") setPhase("fanned");
    if (phase === "deepen" || phase === "interpreting") {
      setPhase(stage === "complete" ? "complete" : "waiting_input");
    }
  }, [error, phase, stage]);

  useEffect(() => {
    if (!activeSessionId || restoredRef.current === activeSessionId) return;
    const item = history.find((entry) => entry.id === activeSessionId);
    if (!item) {
      clearActiveSession();
      return;
    }
    restoredRef.current = activeSessionId;
    if (restoreSession(item)) {
      setQuestion(item.question);
      setDeckPhase("fanned");
      setCurrentCardIndex(item.currentCardIndex ?? Math.max(0, (item.revealedCardCount ?? 1) - 1));
      setInputVisible(false);
      setPhase(phaseFromHistory(item));
    }
    clearActiveSession();
  }, [activeSessionId, clearActiveSession, history, restoreSession]);

  // stage 变化时推进 UI phase
  useEffect(() => {
    if (stage === "awaiting_card_response" && phase !== "bait") {
      const idx = revealedCardCount - 1;
      setCurrentCardIndex(idx);
      setPhase("bait");
    }
    if (stage === "complete" && phase === "deepen") {
      setPhase("interpreting");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, revealedCardCount]);

  // 流结束时推进 phase
  useEffect(() => {
    if (isStreaming) return;
    if (phase === "bait") {
      setPhase("waiting_input");
      return;
    }
    if (phase === "deepen") {
      setPhase(stage === "complete" ? "interpreting" : "waiting_input");
      return;
    }
    if (phase === "interpreting") setPhase("complete");
  }, [isStreaming, phase, stage]);

  const isCardFaceUp = useCallback(
    (index: number) => {
      if (phase === "interpreting" || phase === "complete") return true;
      if (index < currentCardIndex) return true;
      if (index !== currentCardIndex) return false;
      return phase === "waiting_input" || phase === "deepen";
    },
    [currentCardIndex, phase],
  );

  // 从 currentReading 构建 drawnCards；revealed 只表示用户已经看见正面，不等同于 AI 已拿到牌
  const drawnCards: DrawnCard[] = currentReading
    ? currentReading.cards.map((c, i) => ({ ...oracleCardToDrawn(c, i), revealed: isCardFaceUp(i) }))
    : [];
  const revealedCards = drawnCards.slice(0, currentCardIndex).filter(c => c.revealed);

  const handleDeckClick = useCallback(() => {
    if (phase !== "shuffle_wait") return;
    if (!hasConfig) {
      void send("好了", { language: "zh" });
      return;
    }
    setPhase("shuffling"); setDeckPhase("shuffling");
    setTimeout(() => { setDeckPhase("fanned"); setPhase("fanned"); }, 1400);
    // 发出"好了"触发 AI 抽牌
    setTimeout(() => {
      setPhase("dealing");
      void send("好了", { language: "zh" }).then((sent) => {
        if (!sent) setPhase("fanned");
      });
    }, 2800);
  }, [hasConfig, phase, send]);

  const handleUserReply = useCallback(() => {
    if (!userReply.trim()) return;
    const reply = userReply.trim();
    setUserReply(""); setInputVisible(false);
    setPhase("deepen");
    void send(reply, { language: "zh" }).then((sent) => {
      if (!sent) setPhase("waiting_input");
    });
  }, [userReply, send]);

  const handleReset = useCallback(() => {
    resetSession(); setQuestion(""); setPhase("greeting");
    setCurrentCardIndex(0); setDeckPhase("idle"); setUserReply(""); setInputVisible(false); setZoomedCard(null);
  }, [resetSession]);

  const isEarlyPhase = ["greeting", "question", "shuffle_wait", "shuffling", "fanned", "dealing"].includes(phase);
  const isDialoguePhase = ["bait", "waiting_flip", "waiting_input", "deepen", "interpreting", "complete"].includes(phase);

  return (
    <div className="min-h-[calc(100dvh-4rem)] relative">
      <AnimatePresence mode="wait">

        {/* ── 早期阶段：全屏居中 ── */}
        {isEarlyPhase && (
          <motion.div key="early"
            className="min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center px-4 py-12"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* 开场白 + 问题输入 — 同一容器，文字保留，输入框打字完成后淡入 */}
            {(phase === "greeting" || phase === "question") && (
              <div className="flex flex-col items-center gap-6 max-w-md w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={witchImagePath()} alt="占卜师" className="w-48 h-48 object-contain"
                  style={{ mixBlendMode: "screen", filter: "brightness(0.72) contrast(1.05)" }} draggable={false} />

                {/* 打字完成后保留显示 */}
                {phase === "greeting" ? (
                  <Typewriter text={ORACLE_GREET} speed={65}
                    className="text-gold-100 font-body text-xl leading-loose whitespace-pre-line text-center"
                    onComplete={() => setPhase("question")} />
                ) : (
                  <p className="text-gold-100 font-body text-xl leading-loose whitespace-pre-line text-center">
                    {ORACLE_GREET}
                  </p>
                )}

                {phase === "question" && (
                  <motion.div className="w-full flex flex-col items-center gap-4"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                    <OracleInput value={question} onChange={setQuestion}
                      onSubmit={() => {
                        if (!question.trim()) return;
                        prepareReading(question.trim(), "zh");
                        setPhase("shuffle_wait");
                      }}
                      placeholder="写下你想问的……" multiline autoFocus />
                    {question.trim() && (
                      <motion.button className="text-gold-400/60 font-ui text-sm tracking-widest hover:text-gold-300 transition-colors"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onClick={() => {
                          if (!question.trim()) return;
                          prepareReading(question.trim(), "zh");
                          setPhase("shuffle_wait");
                        }}>↵ 继续</motion.button>
                    )}
                    {!hasConfig && (
                      <p className="text-amber-300/60 text-xs font-ui text-center">
                        NO_KEY
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {(phase === "shuffle_wait") && (
              <div className="flex flex-col items-center gap-8 max-w-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={witchImagePath()} alt="占卜师" className="w-36 h-36 object-contain"
                  style={{ mixBlendMode: "screen", filter: "brightness(0.72) contrast(1.05)" }} draggable={false} />
                <Typewriter
                  text={ORACLE_READY}
                  speed={55}
                  className="text-gold-100 font-body text-lg leading-loose whitespace-pre-line text-center"
                />
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="cursor-pointer" onClick={handleDeckClick}>
                  <CardDeck phase="idle" cardCount={10} />
                  <p className="mt-4 text-gold-400/40 font-ui text-xs tracking-[0.3em] uppercase text-center">点击牌组</p>
                </motion.div>
              </div>
            )}

            {(phase === "shuffling" || phase === "fanned" || phase === "dealing") && (
              <div className="flex flex-col items-center">
                <CardDeck phase={deckPhase} cardCount={10} />
                <motion.p className="mt-6 text-gold-200/40 font-body text-sm tracking-widest"
                  animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
                  {phase === "shuffling" ? "洗牌中……" : phase === "fanned" ? "感受你的问题……" : "发牌中……"}
                </motion.p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── 对话阶段：左右分屏 ── */}
        {isDialoguePhase && (
          <motion.div key="dialogue"
            className="min-h-[calc(100dvh-4rem)] flex flex-col md:flex-row max-w-4xl mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}>

            {/* 左侧：witch + 占卜师文字（来自 AI） */}
            <div className="md:w-[380px] lg:w-[420px] shrink-0 flex flex-col items-center justify-center px-4 py-6
                            border-b md:border-b-0 md:border-r border-gold-400/[0.06] relative">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.07) 0%, transparent 70%)" }} />
              <div className="relative z-10 flex flex-col items-center gap-4 w-full">
                <div className="w-44 h-44">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={witchImagePath()} alt="占卜师" className="w-full h-full object-contain"
                    style={{ mixBlendMode: "screen", filter: "brightness(0.70) contrast(1.05) saturate(1.1)" }}
                    draggable={false} />
                </div>

                {/* AI 流式文字 */}
                <div className="w-full min-h-[60px] max-h-[min(48vh,420px)] overflow-y-auto pr-2">
                  <AnimatePresence mode="wait">
                    {(isStreaming && !lastOracleText) && (
                      <motion.div key="oracle-thinking"
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-gold-100 font-body text-xs leading-loose">
                        <OracleThinkingCursor />
                      </motion.div>
                    )}
                    {(lastOracleText && (phase === "bait" || phase === "waiting_flip" || phase === "waiting_input" || phase === "deepen" || phase === "interpreting" || phase === "complete")) && (
                      <motion.div key={`oracle-${lastOracleMessage?.id ?? phase}-${isStreaming ? "stream" : "typed"}`}
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        {isStreaming ? (
                          <div className="text-gold-100 font-body text-xs leading-loose">
                            <MarkdownText text={lastOracleText} />
                            <OracleThinkingCursor />
                          </div>
                        ) : (
                          <MarkdownTypewriter
                            text={lastOracleText}
                            speed={18}
                            className="text-gold-100 font-body text-xs leading-loose"
                          />
                        )}
                      </motion.div>
                    )}
                    {phase === "waiting_input" && !lastOracleText && (
                      <motion.p key="ellipsis" className="text-gold-200/25 font-body text-xs italic"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>……</motion.p>
                    )}
                    {phase === "complete" && !lastOracleText && (
                      <motion.p key="done" className="text-gold-200/30 font-body text-xs italic"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>牌已落定</motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* 右侧：牌面 + 交互 */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-5">

              {revealedCards.length > 0 && (phase === "bait" || phase === "waiting_flip" || phase === "waiting_input" || phase === "deepen") && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <RevealedStack cards={revealedCards} onCardClick={setZoomedCard} />
                </motion.div>
              )}

              {(phase === "bait" || phase === "waiting_flip" || phase === "waiting_input" || phase === "deepen") && drawnCards[currentCardIndex] && (
                <div className="relative">
                  <div>
                    <TarotCard key={`current-${currentCardIndex}-${drawnCards[currentCardIndex].card.id}`}
                      drawnCard={drawnCards[currentCardIndex]} size="xl" delay={0}
                      onClick={() => setZoomedCard(drawnCards[currentCardIndex])}
                      disableFlip />
                  </div>
                </div>
              )}

              {(phase === "interpreting" || phase === "complete") && (
                <motion.div className="flex gap-4 justify-center flex-wrap"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}>
                  {drawnCards.map((c, i) => (
                    <TarotCard key={i} drawnCard={c} size="lg" onClick={() => setZoomedCard(c)} disableFlip />
                  ))}
                </motion.div>
              )}

              {phase === "waiting_input" && (
                <div className="w-full max-w-xs">
                  {!inputVisible
                    ? <InputReveal onReady={() => setInputVisible(true)} />
                    : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                        <OracleInput value={userReply} onChange={setUserReply}
                          onSubmit={handleUserReply} placeholder="写下你的感受……" autoFocus />
                      </motion.div>
                    )
                  }
                </div>
              )}

              {phase === "complete" && (
                <motion.div className="flex gap-3 flex-wrap justify-center"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                  <GoldButton variant="secondary" size="sm" onClick={() => {
                    navigator.clipboard.writeText(lastOracleText).catch((clipboardError) => {
                      console.error("[oracle] clipboard save failed", { error: clipboardError });
                    });
                  }}>
                    <span className="flex items-center gap-2"><Bookmark size={14} />保存</span>
                  </GoldButton>
                  <GoldButton variant="secondary" size="sm" onClick={() => {
                    const text = lastOracleText.slice(0, 80) + "…";
                    if (navigator.share) {
                      navigator.share({ title: "我的塔罗解读", text }).catch((shareError) => {
                        console.error("[oracle] native share failed", { error: shareError });
                      });
                    } else {
                      navigator.clipboard.writeText(text).catch((clipboardError) => {
                        console.error("[oracle] clipboard share fallback failed", { error: clipboardError });
                      });
                    }
                  }}>
                    <span className="flex items-center gap-2"><ShareNetwork size={14} />分享</span>
                  </GoldButton>
                  <GoldButton variant="ghost" size="sm" onClick={handleReset}>
                    <span className="flex items-center gap-2"><ArrowCounterClockwise size={14} />再占一次</span>
                  </GoldButton>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <AnimatePresence>
        {zoomedCard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedCard(null)}
          >
            <motion.div
              className="relative w-[min(82vw,420px)] aspect-[5/7] rounded-2xl border border-gold-400/20 bg-[#090916] shadow-2xl overflow-hidden"
              initial={{ scale: 0.92, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tarotCardImagePath(zoomedCard.card)}
                alt={zoomedCard.card.name}
                className={`absolute inset-0 w-full h-full object-contain ${zoomedCard.orientation === "reversed" ? "rotate-180" : ""}`}
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
