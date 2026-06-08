"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, MagicWand, Flame, ImageSquare, Star, CardsThree, Trophy, Calendar } from "@phosphor-icons/react";
import GlassCard from "@/components/ui/GlassCard";
import GoldButton from "@/components/ui/GoldButton";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { ROUTES } from "@/lib/constants";
import { useHistoryStore } from "@/stores/historyStore";
import type { ReadingHistoryItem } from "@/types/card";

const SPREAD_LABELS: Record<string, string> = {
  single_card: "单牌",
  three_card: "三牌",
  celtic_cross: "凯尔特",
  relationship_cross: "关系",
};

function mode<T extends string>(items: T[]): T | null {
  const counts = new Map<T, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function dayKey(value: string): string {
  return value.slice(0, 10);
}

function streakDays(items: ReadingHistoryItem[]): number {
  const days = new Set(items.map((item) => dayKey(item.createdAt)));
  let cursor = new Date();
  let count = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export default function ProfilePage() {
  const router = useRouter();
  const history = useHistoryStore((state) => state.items);
  const user: { name: string; email: string; plan: "free" | "premium" } = {
    name: "BYOK",
    email: "local",
    plan: "free",
  };

  const initials = user.name[0].toUpperCase();
  const planLabel = user.plan === "premium" ? "Hosted 预留" : "BYOK";
  const allCardIds = history.flatMap((item) => item.cards.map((card) => card.id));
  const favoriteSpread = mode(history.map((item) => item.spreadType));
  const favoriteCard = mode(allCardIds);

  const STATS = [
    { icon: MagicWand,  label: "总占卜",   value: String(history.length) },
    { icon: Flame,      label: "连续签到", value: String(streakDays(history)) },
    { icon: ImageSquare,label: "已收集",   value: `${new Set(allCardIds).size} / 78` },
    { icon: CardsThree, label: "常用牌阵", value: favoriteSpread ? SPREAD_LABELS[favoriteSpread] ?? favoriteSpread : "—" },
    { icon: Star,       label: "幸运牌",   value: favoriteCard ?? "—" },
  ];

  const ACHIEVEMENTS = [
    { name: "初探命运",      desc: "完成第一次占卜",       unlocked: history.length > 0 },
    { name: "凯尔特大师",    desc: "完成 5 次凯尔特十字",   unlocked: history.filter((item) => item.spreadType === "celtic_cross").length >= 5 },
    { name: "每日坚持",      desc: "连续签到 7 天",         unlocked: streakDays(history) >= 7 },
    { name: "大阿卡纳收集者",desc: "收集全部 22 张大阿卡纳", unlocked: false },
    { name: "全知之眼",      desc: "收集全部 78 张牌",       unlocked: new Set(allCardIds).size >= 78 },
  ];

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-8">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer}>

        {/* 用户头部 */}
        <motion.div variants={staggerItem} className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-400/20 flex items-center justify-center">
            <span className="font-display text-2xl text-gold-400/60">{initials}</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading text-2xl font-semibold text-gold-100">{user.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-ui bg-arcane-deep/40 text-arcane-glow border border-arcane-glow/20">
                {planLabel}
              </span>
            </div>
            <p className="text-sm text-gold-200/30">{user.email}</p>
          </div>
        </motion.div>

        {/* 统计：第一版仅展示本地占位 */}
        <motion.div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10" variants={staggerContainer}>
          {STATS.map(stat => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={staggerItem}>
                <GlassCard padding="sm" className="text-center">
                  <Icon size={20} className="text-gold-400 mx-auto mb-2" weight="duotone" />
                  <p className="font-mono text-lg font-semibold text-gold-100">{stat.value}</p>
                  <p className="text-[10px] text-gold-200/30 font-ui">{stat.label}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 成就 */}
        <motion.div variants={staggerItem} className="mb-10">
          <h2 className="font-heading text-lg font-semibold text-gold-100 mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-gold-400" />成就
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACHIEVEMENTS.map(a => (
              <GlassCard key={a.name} padding="sm" className={`flex items-center gap-3 ${!a.unlocked && "opacity-35"}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.unlocked ? "bg-gold-400/10 border border-gold-400/20" : "bg-midnight/40 border border-gold-400/[0.04]"}`}>
                  <Trophy size={18} className={a.unlocked ? "text-gold-400" : "text-gold-200/10"} />
                </div>
                <div>
                  <p className="text-sm font-heading font-semibold text-gold-100">{a.name}</p>
                  <p className="text-xs text-gold-200/30">{a.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* 最近解读 — 跳转历史页 */}
        <motion.div variants={staggerItem} className="mb-10">
          <h2 className="font-heading text-lg font-semibold text-gold-100 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-gold-400" />最近解读
          </h2>
          <GlassCard padding="sm" className="text-center py-8">
            <p className="text-sm text-gold-200/25 mb-4">历史记录保存在当前浏览器本地</p>
            <GoldButton variant="secondary" size="sm" onClick={() => router.push(ROUTES.history)}>
              查看全部历史
            </GoldButton>
          </GlassCard>
        </motion.div>

        {/* BYOK CTA — 仅 free 用户显示 */}
        {user.plan !== "premium" && (
          <motion.div variants={staggerItem}>
            <GlassCard goldBorder="full" className="text-center py-8">
              <Crown size={32} className="text-gold-400 mx-auto mb-3" weight="duotone" />
              <h3 className="font-heading text-lg font-semibold text-gold-100 mb-2">配置 BYOK</h3>
              <p className="text-sm text-gold-200/40 mb-5">填入自己的模型 Key 后，静态版即可完整运行</p>
              <GoldButton size="sm" onClick={() => router.push(ROUTES.settings)}>去设置 Key</GoldButton>
            </GlassCard>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}
