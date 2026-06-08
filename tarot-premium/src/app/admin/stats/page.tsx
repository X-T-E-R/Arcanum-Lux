"use client";

import { motion } from "framer-motion";
import { ChartLine, Users, MagicWand, Lightning } from "@phosphor-icons/react";

const DAILY = [
  { date: "06-02", users: 34,  readings: 89,  revenue: 0    },
  { date: "06-03", users: 41,  readings: 112, revenue: 59.8 },
  { date: "06-04", users: 38,  readings: 97,  revenue: 29.9 },
  { date: "06-05", users: 52,  readings: 134, revenue: 89.7 },
  { date: "06-06", users: 48,  readings: 121, revenue: 59.8 },
  { date: "06-07", users: 61,  readings: 158, revenue: 119.6},
  { date: "06-08", users: 29,  readings: 74,  revenue: 59.8 },
];

const max = (key: keyof typeof DAILY[0]) => Math.max(...DAILY.map(d => d[key] as number));

function Bar({ value, maxVal, color }: { value: number; maxVal: number; color: string }) {
  const pct = maxVal ? (value / maxVal) * 100 : 0;
  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      <div className="w-full h-24 flex items-end">
        <motion.div
          className={`w-full rounded-t ${color}`}
          initial={{ height: 0 }} animate={{ height: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
        />
      </div>
    </div>
  );
}

export default function StatsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="font-heading text-xl font-semibold text-gold-100">数据统计</h1>

      {/* 近7日趋势图 */}
      {[
        { label: "每日新增用户", key: "users"    as const, color: "bg-arcane-glow/50" },
        { label: "每日占卜次数", key: "readings" as const, color: "bg-gold-400/40"    },
        { label: "每日收入（元）",key: "revenue"  as const, color: "bg-emerald-400/40" },
      ].map(({ label, key, color }) => (
        <div key={key}>
          <p className="text-xs text-gold-200/40 font-ui mb-3">{label}</p>
          <div className="rounded-xl border border-gold-400/[0.08] bg-midnight/20 p-4">
            <div className="flex gap-1 items-end h-24">
              {DAILY.map(d => (
                <Bar key={d.date} value={d[key] as number} maxVal={max(key)} color={color} />
              ))}
            </div>
            <div className="flex gap-1 mt-2">
              {DAILY.map(d => (
                <div key={d.date} className="flex-1 text-center text-[9px] font-mono text-gold-200/25">{d.date}</div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* API 费用明细 */}
      <div>
        <p className="text-xs text-gold-200/40 font-ui mb-3">API 费用明细（本月）</p>
        <div className="rounded-xl border border-gold-400/[0.08] bg-midnight/20 divide-y divide-gold-400/[0.04]">
          {[
            { model: "claude-opus-4-8",    tokens: "1.2M",  cost: "¥36.0" },
            { model: "claude-sonnet-4-6",  tokens: "840K",  cost: "¥8.4"  },
          ].map(r => (
            <div key={r.model} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-xs font-mono text-gold-200/70">{r.model}</p>
                <p className="text-[10px] text-gold-200/30">{r.tokens} tokens</p>
              </div>
              <p className="font-mono text-sm text-gold-300">{r.cost}</p>
            </div>
          ))}
          <div className="flex items-center justify-between px-5 py-3 bg-midnight/30">
            <p className="text-xs font-ui text-gold-200/50">本月合计</p>
            <p className="font-mono text-sm font-semibold text-gold-200">¥44.4</p>
          </div>
        </div>
      </div>
    </div>
  );
}
