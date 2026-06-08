"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MagnifyingGlass, Clock, Cards } from "@phosphor-icons/react";
import GlassCard from "@/components/ui/GlassCard";
import MarkdownText from "@/components/ui/MarkdownText";
import { staggerContainer, staggerItem, fadeUp } from "@/lib/animations";
import { useHistoryStore } from "@/stores/historyStore";
import { ROUTES } from "@/lib/constants";
import type { ReadingHistoryItem } from "@/types/card";

const SPREAD_LABELS: Record<string, string> = {
  single_card: "单牌", three_card: "三牌", celtic_cross: "凯尔特", relationship_cross: "关系",
};

const FILTERS = [
  { id:"all", label:"全部" },
  { id:"single_card", label:"单牌" },
  { id:"three_card", label:"三牌" },
  { id:"celtic_cross", label:"凯尔特" },
  { id:"relationship_cross", label:"关系" },
];

export default function HistoryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const history: ReadingHistoryItem[] = useHistoryStore((state) => state.items);
  const setActiveSession = useHistoryStore((state) => state.setActiveSession);

  const filtered = useMemo(() => {
    return history
      .filter(h => filter === "all" || h.spreadType === filter)
      .filter(h => !search || h.question.includes(search) || h.interpretation.includes(search));
  }, [history, filter, search]);

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-8">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div variants={staggerItem} className="mb-8">
          <h1 className="font-heading text-3xl font-semibold text-gold-100 mb-2">占卜历史</h1>
          <p className="text-gold-200/40">回顾你的每一次塔罗之旅</p>
        </motion.div>

        <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 max-w-xs relative">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400/30" />
            <input
              className="w-full pl-8 pr-4 py-2 bg-midnight/40 border border-gold-400/[0.08] rounded-lg text-sm text-gold-100 placeholder:text-gold-200/20 focus:outline-none focus:border-gold-400/30 font-ui"
              placeholder="搜索历史记录…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button key={f.id}
                className={`px-3 py-2 rounded-lg text-xs font-ui transition-all ${
                  filter === f.id
                    ? "bg-gold-400/[0.1] text-gold-300 border border-gold-400/20"
                    : "text-gold-200/30 hover:text-gold-300 border border-transparent"
                }`}
                onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div className="space-y-3" variants={staggerContainer}>
          {filtered.map(item => (
            <motion.div key={item.id} variants={staggerItem}>
              <GlassCard goldBorder="top"
                className="cursor-pointer hover:border-gold-400/20 transition-all group"
                onClick={() => {
                  if (item.status !== "complete" && item.oracleReading) {
                    setActiveSession(item.id);
                    router.push(ROUTES.reading);
                    return;
                  }
                  setExpanded(expanded === item.id ? null : item.id);
                }}>
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex flex-col items-center gap-1 pt-1 shrink-0">
                    <Clock size={16} className="text-gold-400/30" />
                    <span className="text-[10px] font-mono text-gold-200/20">
                      {item.createdAt.slice(5, 10)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] font-mono text-gold-400/30 sm:hidden">{item.createdAt}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-ui bg-gold-400/[0.06] text-gold-300/60">
                        {SPREAD_LABELS[item.spreadType] ?? item.spreadType}
                      </span>
                    </div>
                    <p className="font-body text-gold-100 mb-2 group-hover:text-gold-50 transition-colors">
                      {item.question}
                    </p>
                    <MarkdownText
                      text={item.interpretation}
                      className={`text-sm text-gold-200/30 mb-3 ${expanded === item.id ? "" : "line-clamp-2"}`}
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {item.cards.map((c, i) => (
                        <span key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-midnight/60 text-gold-200/30 border border-gold-400/[0.04]">
                          {c.id.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                    {expanded === item.id && (
                      <p className="text-[10px] text-gold-400/30 font-ui mt-3">点击收起</p>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div className="text-center py-20" variants={fadeUp} initial="hidden" animate="visible">
            <Cards size={48} className="text-gold-400/15 mx-auto mb-4" />
            <p className="font-body text-lg text-gold-200/20 mb-2">
              {search || filter !== "all" ? "没有符合条件的记录" : "还没有占卜记录"}
            </p>
            <p className="text-sm text-gold-200/10">
              {search || filter !== "all" ? "尝试清除筛选条件" : "开始你的第一次占卜，记录将被保存在这里"}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
