"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ShareNetwork, Timer } from "@phosphor-icons/react";
import GlassCard from "@/components/ui/GlassCard";
import GoldButton from "@/components/ui/GoldButton";
import TarotCard from "@/components/card/TarotCard";
import GoldParticles from "@/components/effects/GoldParticles";
import { fadeUp } from "@/lib/animations";
import type { DrawnCard, Orientation } from "@/types/card";

const MOCK_DAILY: DrawnCard = {
  card: {
    id: "the_star", name: "星星", nameEn: "The Star", number: 17,
    arcana: "major", suit: null, archetype: "hope",
    coreMeanings: {
      upright: { essence: "希望与灵感的指引", keywords: ["希望", "灵感", "宁静", "信念"], psychological: "内心的平静与对未来的信心", spiritual: "宇宙正在疗愈你的灵魂", practical: "保持信念，好的变化正在到来", shadow: "过度理想化或脱离现实" },
      reversed: { essence: "失去方向与信念", keywords: ["迷茫", "失望"], psychological: "感到与内心指引断联", spiritual: "需要重新连接你的精神世界", practical: "暂时放下，给自己时间恢复", shadow: "过度悲观" },
    },
  },
  orientation: "upright" as Orientation,
  position: "今日牌",
  positionIndex: 0,
  revealed: false,
};

function useCountdown() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const next = new Date(now);
      next.setDate(next.getDate() + 1);
      next.setHours(0, 0, 0, 0);
      setSecs(Math.floor((next.getTime() - now.getTime()) / 1000));
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function DailyPage() {
  // card 初始 revealed: false → TarotCard 显示牌背，用户点击翻开
  const [card, setCard] = useState<DrawnCard>({ ...MOCK_DAILY });
  const revealed = card.revealed;
  const streak = 7;
  const today = new Date().toISOString().slice(0, 10);
  const countdown = useCountdown();

  const handleFlip = () => {
    if (!revealed) setCard(c => ({ ...c, revealed: true }));
  };

  const handleShare = () => {
    const text = `今日塔罗【${card.card.name}】— ${card.card.coreMeanings.upright.essence}`;
    if (navigator.share) navigator.share({ title: "今日塔罗", text });
    else navigator.clipboard.writeText(text).then(() => alert("已复制到剪贴板"));
  };

  return (
    <div className="max-w-xl mx-auto px-4 md:px-6 py-8">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center">

        {/* 日期 + 连续天数 */}
        <div className="flex items-center justify-center gap-6 mb-10 text-sm">
          <span className="font-mono text-gold-200/30">{today}</span>
          <div className="flex items-center gap-1.5 text-gold-400/50">
            <Flame size={14} weight="fill" />
            <span className="font-mono font-semibold">{streak}</span>
            <span className="text-gold-200/25 text-xs">天连续</span>
          </div>
        </div>

        {/* 牌区 — 直接显示牌背，点击翻牌 */}
        <div className="relative mb-6">
          <GoldParticles count={revealed ? 20 : 0} />

          {/* 未翻开时的呼吸提示 */}
          {!revealed && (
            <motion.p
              className="text-gold-400/35 font-ui text-xs tracking-[0.3em] uppercase mb-4"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              触碰牌面，揭开今日
            </motion.p>
          )}

          <div
            className={!revealed ? "cursor-pointer" : ""}
            onClick={handleFlip}
          >
            <div className="flex justify-center">
              {/* 未翻开时用呼吸光晕强化可点击感 */}
              <div className="relative">
                {!revealed && (
                  <motion.div
                    className="absolute -inset-4 rounded-2xl pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)" }}
                    animate={{ opacity: [0.4, 1, 0.4], scale: [0.96, 1.02, 0.96] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <TarotCard drawnCard={card} size="lg" onClick={handleFlip} />
              </div>
            </div>
          </div>
        </div>

        {/* 翻开后：解读 + 倒计时 + 分享 */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <GlassCard goldBorder="top" className="text-left">
                <p className="font-heading text-sm text-gold-400 mb-2">今日运势</p>
                <p className="text-gold-100 font-body leading-relaxed">
                  {card.card.coreMeanings.upright.spiritual}
                  <br />
                  {card.card.coreMeanings.upright.practical}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {card.card.coreMeanings.upright.keywords.map(kw => (
                    <span key={kw}
                      className="px-3 py-1 rounded-full text-xs bg-gold-400/[0.08] text-gold-300 border border-gold-400/10">
                      {kw}
                    </span>
                  ))}
                </div>
              </GlassCard>

              <div className="flex items-center justify-center gap-2 text-xs text-gold-200/25">
                <Timer size={12} />
                <span>距离明日 {countdown}</span>
              </div>

              <GoldButton variant="secondary" size="sm" onClick={handleShare}>
                <span className="flex items-center gap-2">
                  <ShareNetwork size={15} />分享日签
                </span>
              </GoldButton>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
