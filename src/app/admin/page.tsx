"use client";

import { motion } from "framer-motion";
import { Users, MagicWand, CurrencyDollar, Lightning, ArrowUp, ArrowDown } from "@phosphor-icons/react";

const STATS = [
  { label: "总用户数",    value: "1,284",  delta: "+23",  up: true,  icon: Users },
  { label: "今日占卜",    value: "342",    delta: "+18%", up: true,  icon: MagicWand },
  { label: "付费用户",    value: "89",     delta: "+5",   up: true,  icon: CurrencyDollar },
  { label: "API 用量",   value: "¥12.4",  delta: "+¥2.1",up: false, icon: Lightning },
];

const RECENT_USERS = [
  { name: "旅人_2847", email: "u2847@x.com", plan: "free",    joined: "2026-06-07", readings: 3  },
  { name: "月相观察者", email: "moon@x.com",  plan: "premium", joined: "2026-06-06", readings: 41 },
  { name: "星途寻迹",  email: "star@x.com",  plan: "free",    joined: "2026-06-05", readings: 7  },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-xl font-semibold text-gold-100 mb-1">统计看板</h1>
        <p className="text-xs text-gold-200/30 font-mono">2026-06-08 · 实时数据</p>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(({ label, value, delta, up, icon: Icon }) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-gold-400/[0.08] bg-midnight/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <Icon size={16} className="text-gold-400/50" />
              <span className={`flex items-center gap-0.5 text-[10px] font-mono ${up ? "text-emerald-400/70" : "text-red-400/70"}`}>
                {up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}{delta}
              </span>
            </div>
            <p className="font-mono text-xl font-semibold text-gold-100">{value}</p>
            <p className="text-xs text-gold-200/30 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* 最近注册用户 */}
      <div>
        <h2 className="font-heading text-sm text-gold-200/60 mb-3">最近注册</h2>
        <div className="rounded-xl border border-gold-400/[0.08] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-400/[0.06] bg-midnight/30">
                {["用户名","邮箱","方案","加入日期","占卜次数"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-ui text-gold-200/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_USERS.map((u, i) => (
                <tr key={i} className="border-b border-gold-400/[0.04] hover:bg-gold-400/[0.02] transition-colors">
                  <td className="px-4 py-3 text-gold-100 font-ui text-xs">{u.name}</td>
                  <td className="px-4 py-3 text-gold-200/40 font-mono text-xs">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-ui ${
                      u.plan === "premium" ? "bg-gold-400/10 text-gold-300 border border-gold-400/20" : "bg-midnight/60 text-gold-200/30"
                    }`}>{u.plan}</span>
                  </td>
                  <td className="px-4 py-3 text-gold-200/30 font-mono text-xs">{u.joined}</td>
                  <td className="px-4 py-3 text-gold-200/50 font-mono text-xs text-center">{u.readings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
