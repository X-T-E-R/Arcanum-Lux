"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TestTube,
  ArrowRight,
  Cards,
  Sparkle,
  Crown,
  Circle,
} from "@phosphor-icons/react";
import GlassCard from "@/components/ui/GlassCard";
import GoldButton from "@/components/ui/GoldButton";
import TarotCard from "@/components/card/TarotCard";
import CardDeck from "@/components/card/CardDeck";
import Typewriter from "@/components/ui/Typewriter";
import MagicCircle from "@/components/effects/MagicCircle";
import GoldParticles from "@/components/effects/GoldParticles";
import { ROUTES } from "@/lib/constants";
import type { DrawnCard, Orientation } from "@/types/card";

const DEMO_CARD: DrawnCard = {
  card: {
    id: "the_star", name: "星星", nameEn: "The Star", number: 17,
    arcana: "major", suit: null, archetype: "hope",
    coreMeanings: {
      upright: { essence: "希望与灵感的指引", keywords: ["希望", "灵感"], psychological: "", spiritual: "", practical: "", shadow: "" },
      reversed: { essence: "失去方向", keywords: ["迷茫"], psychological: "", spiritual: "", practical: "", shadow: "" },
    },
  },
  orientation: "upright" as Orientation,
  position: "启示",
  positionIndex: 0,
  revealed: false,
};

const DEMO_CARDS_3: DrawnCard[] = [
  { ...DEMO_CARD, position: "过去", positionIndex: 0 },
  {
    ...DEMO_CARD,
    card: { ...DEMO_CARD.card, id: "the_moon", name: "月亮", nameEn: "The Moon", number: 18 },
    orientation: "reversed" as Orientation,
    position: "现在",
    positionIndex: 1,
  },
  {
    ...DEMO_CARD,
    card: { ...DEMO_CARD.card, id: "the_sun", name: "太阳", nameEn: "The Sun", number: 19 },
    position: "未来",
    positionIndex: 2,
  },
];

export default function DebugPage() {
  const [activeTab, setActiveTab] = useState("cards");
  const [cardKey, setCardKey] = useState(0);
  const [deckKey, setDeckKey] = useState(0);
  const [deckPhase, setDeckPhase] = useState<"idle" | "shuffling" | "fanned">("idle");
  const [typewriterKey, setTypewriterKey] = useState(0);

  const tabs = [
    { id: "cards", label: "卡牌", icon: Cards },
    { id: "shuffle", label: "洗牌", icon: Circle },
    { id: "typewriter", label: "打字机", icon: Sparkle },
    { id: "effects", label: "特效", icon: Crown },
    { id: "nav", label: "导航", icon: ArrowRight },
  ];

  const resetCards = useCallback(() => setCardKey((k) => k + 1), []);
  const resetDeck = useCallback(() => {
    setDeckPhase("idle");
    setDeckKey((k) => k + 1);
  }, []);
  const resetTypewriter = useCallback(() => setTypewriterKey((k) => k + 1), []);

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <TestTube size={24} className="text-gold-400" />
        <h1 className="font-heading text-2xl font-semibold text-gold-100">
          Debug Panel
        </h1>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-arcane-glow/10 text-arcane-glow border border-arcane-glow/20">
          DEV
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-8 p-1 rounded-xl bg-midnight/40 border border-gold-400/[0.06] w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-ui transition-all ${
                activeTab === tab.id
                  ? "bg-gold-400/[0.1] text-gold-300"
                  : "text-gold-200/40 hover:text-gold-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* === CARDS TAB === */}
      {activeTab === "cards" && (
        <div className="space-y-8">
          <GlassCard goldBorder="top">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold text-gold-100">
                单卡翻牌 (3 种尺寸)
              </h2>
              <GoldButton size="sm" variant="secondary" onClick={resetCards}>
                重置
              </GoldButton>
            </div>
            <div className="flex items-end gap-8 justify-center py-6">
              {(["sm", "md", "lg"] as const).map((size) => (
                <div key={`${size}-${cardKey}`} className="text-center">
                  <TarotCard
                    drawnCard={{ ...DEMO_CARD, revealed: false }}
                    size={size}
                  />
                  <p className="mt-3 text-xs font-mono text-gold-400/30">
                    {size}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard goldBorder="top">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold text-gold-100">
                三牌展开 (含逆位)
              </h2>
              <GoldButton size="sm" variant="secondary" onClick={resetCards}>
                重置
              </GoldButton>
            </div>
            <div className="flex justify-center gap-6 py-6" key={`row-${cardKey}`}>
              {DEMO_CARDS_3.map((card, i) => (
                <TarotCard
                  key={i}
                  drawnCard={{ ...card, revealed: false }}
                  size="md"
                  delay={i * 0.2}
                />
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* === SHUFFLE TAB === */}
      {activeTab === "shuffle" && (
        <GlassCard goldBorder="top">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-gold-100">
              洗牌动画
            </h2>
            <div className="flex gap-2">
              <GoldButton
                size="sm"
                variant="secondary"
                onClick={() => {
                  resetDeck();
                  setTimeout(() => setDeckPhase("shuffling"), 100);
                }}
              >
                洗牌
              </GoldButton>
              <GoldButton
                size="sm"
                variant="secondary"
                onClick={() => setDeckPhase("fanned")}
              >
                扇形展开
              </GoldButton>
              <GoldButton size="sm" variant="ghost" onClick={resetDeck}>
                重置
              </GoldButton>
            </div>
          </div>
          <div className="flex justify-center py-12 min-h-[300px]">
            <CardDeck key={deckKey} phase={deckPhase} cardCount={10} />
          </div>
        </GlassCard>
      )}

      {/* === TYPEWRITER TAB === */}
      {activeTab === "typewriter" && (
        <GlassCard goldBorder="top">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-gold-100">
              打字机效果
            </h2>
            <GoldButton size="sm" variant="secondary" onClick={resetTypewriter}>
              重播
            </GoldButton>
          </div>
          <div className="max-w-xl mx-auto py-6" key={`tw-${typewriterKey}`}>
            <Typewriter
              text="这次牌阵揭示了一个深刻的主题——你正处于一段疗愈之旅中。星星牌带来了希望的光芒，月亮邀请你信任直觉，而太阳则预示着成功的到来。"
              speed={40}
            />
          </div>
        </GlassCard>
      )}

      {/* === EFFECTS TAB === */}
      {activeTab === "effects" && (
        <div className="space-y-8">
          <GlassCard goldBorder="top">
            <h2 className="font-heading text-lg font-semibold text-gold-100 mb-4">
              魔法阵 (静态 + 旋转 + 交互)
            </h2>
            <div className="flex items-center justify-center gap-12 py-8">
              <div className="text-center">
                <MagicCircle size={150} opacity={0.3} />
                <p className="mt-3 text-xs font-mono text-gold-400/30">auto</p>
              </div>
              <div className="text-center">
                <MagicCircle size={200} opacity={0.4} interactive />
                <p className="mt-3 text-xs font-mono text-gold-400/30">interactive</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard goldBorder="top">
            <h2 className="font-heading text-lg font-semibold text-gold-100 mb-4">
              金色粒子
            </h2>
            <div className="relative h-48 rounded-xl bg-abyss/50 overflow-hidden">
              <GoldParticles count={50} />
            </div>
          </GlassCard>
        </div>
      )}

      {/* === NAV TAB === */}
      {activeTab === "nav" && (
        <GlassCard goldBorder="top">
          <h2 className="font-heading text-lg font-semibold text-gold-100 mb-6">
            页面快速导航
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Landing", href: "/" },
              { label: "Reading", href: "/reading" },
              { label: "Gallery", href: "/gallery" },
              { label: "Daily", href: "/daily" },
              { label: "History", href: "/history" },
              { label: "Profile", href: "/profile" },
              { label: "Pricing", href: "/pricing" },
              { label: "Settings", href: "/settings" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-gold-400/[0.06] bg-midnight/30 hover:border-gold-400/20 hover:bg-midnight/50 transition-all group"
              >
                <span className="text-sm font-ui text-gold-200/60 group-hover:text-gold-100 transition-colors">
                  {item.label}
                </span>
                <span className="text-xs font-mono text-gold-400/20">
                  {item.href}
                </span>
              </Link>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
