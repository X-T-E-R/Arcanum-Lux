"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlass, ProhibitInset, Crown, CardsThree, Trash,
} from "@phosphor-icons/react";

const MOCK_USERS = [
  { id: "u001", name: "月相观察者", email: "moon@example.com", plan: "premium", status: "active",  joined: "2026-05-10", readings: 41 },
  { id: "u002", name: "旅人_2847",  email: "u2847@example.com", plan: "free",    status: "active",  joined: "2026-06-07", readings: 3  },
  { id: "u003", name: "星途寻迹",   email: "star@example.com",  plan: "free",    status: "banned",  joined: "2026-06-05", readings: 7  },
  { id: "u004", name: "命盘探索者", email: "chart@example.com", plan: "premium", status: "active",  joined: "2026-04-20", readings: 128},
  { id: "u005", name: "暗夜旅者",   email: "night@example.com", plan: "free",    status: "active",  joined: "2026-06-01", readings: 12 },
];

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(MOCK_USERS);

  const filtered = users.filter(u =>
    u.name.includes(query) || u.email.includes(query)
  );

  const toggleBan = (id: string) =>
    setUsers(u => u.map(x => x.id === id
      ? { ...x, status: x.status === "banned" ? "active" : "banned" }
      : x
    ));

  const upgradePlan = (id: string) =>
    setUsers(u => u.map(x => x.id === id
      ? { ...x, plan: x.plan === "premium" ? "free" : "premium" }
      : x
    ));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-semibold text-gold-100">用户管理</h1>
        <span className="text-xs text-gold-200/30 font-mono">{users.length} 位用户</span>
      </div>

      {/* 搜索 */}
      <div className="relative">
        <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400/30" />
        <input
          className="w-full max-w-sm pl-8 pr-4 py-2 bg-midnight/40 border border-gold-400/[0.08] rounded-lg text-sm text-gold-100 placeholder:text-gold-200/20 focus:outline-none focus:border-gold-400/30 font-ui"
          placeholder="搜索用户名或邮箱…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* 表格 */}
      <div className="rounded-xl border border-gold-400/[0.08] overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-gold-400/[0.06] bg-midnight/30">
              {["用户", "方案", "状态", "加入日期", "占卜数", "操作"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-ui text-gold-200/30">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <motion.tr key={u.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="border-b border-gold-400/[0.04] hover:bg-gold-400/[0.02]">
                <td className="px-4 py-3">
                  <p className="text-gold-100 font-ui text-xs">{u.name}</p>
                  <p className="text-gold-200/30 font-mono text-[10px]">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-ui ${
                    u.plan === "premium"
                      ? "bg-gold-400/10 text-gold-300 border border-gold-400/20"
                      : "bg-midnight/60 text-gold-200/30"
                  }`}>{u.plan}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    u.status === "active" ? "text-emerald-400/70" : "text-red-400/70"
                  }`}>{u.status}</span>
                </td>
                <td className="px-4 py-3 text-gold-200/30 font-mono text-xs">{u.joined}</td>
                <td className="px-4 py-3 text-gold-200/50 font-mono text-xs text-center">{u.readings}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      title={u.plan === "premium" ? "降为 Free" : "升级 Premium"}
                      onClick={() => upgradePlan(u.id)}
                      className="text-gold-400/40 hover:text-gold-300 transition-colors">
                      <Crown size={14} />
                    </button>
                    <button
                      title={u.status === "banned" ? "解封" : "封禁"}
                      onClick={() => toggleBan(u.id)}
                      className={`transition-colors ${u.status === "banned" ? "text-red-400/60 hover:text-red-300" : "text-gold-400/30 hover:text-red-400/60"}`}>
                      <ProhibitInset size={14} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
