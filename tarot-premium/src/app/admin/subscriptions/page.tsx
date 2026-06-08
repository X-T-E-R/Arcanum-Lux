"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash, FloppyDisk, Check } from "@phosphor-icons/react";

interface Plan { id: string; name: string; price_monthly: string; price_yearly: string; readings_per_day: string; features: string }
interface Coupon { code: string; discount: string; expires: string; uses: number }

const INIT_PLANS: Plan[] = [
  { id: "free",    name: "BYOK",       price_monthly: "0", price_yearly: "0", readings_per_day: "∞", features: "自带Key,本地抽牌,本地历史" },
  { id: "hosted",  name: "Hosted预留", price_monthly: "0", price_yearly: "0", readings_per_day: "∞", features: "托管Key,人机验证,云端同步" },
];

const INIT_COUPONS: Coupon[] = [
  { code: "LAUNCH50", discount: "50%", expires: "2026-07-01", uses: 12 },
];

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState(INIT_PLANS);
  const [coupons, setCoupons] = useState(INIT_COUPONS);
  const [newCode, setNewCode] = useState(""); const [newDiscount, setNewDiscount] = useState("");
  const [newExpires, setNewExpires] = useState(""); const [saved, setSaved] = useState(false);

  const updatePlan = (id: string, key: keyof Plan, val: string) =>
    setPlans(ps => ps.map(p => p.id === id ? { ...p, [key]: val } : p));

  const addCoupon = () => {
    if (!newCode.trim()) return;
    setCoupons(c => [...c, { code: newCode.toUpperCase(), discount: newDiscount || "10%", expires: newExpires || "2026-12-31", uses: 0 }]);
    setNewCode(""); setNewDiscount(""); setNewExpires("");
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const inputCls = "bg-abyss/60 border border-gold-400/[0.08] rounded-lg px-3 py-2 text-sm text-gold-100 font-mono focus:outline-none focus:border-gold-400/30 w-full";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="font-heading text-xl font-semibold text-gold-100">方案管理</h1>

      {/* 套餐配置 */}
      <section className="space-y-3">
        <h2 className="text-sm font-ui text-gold-200/50">套餐价格</h2>
        {plans.map(p => (
          <div key={p.id} className="rounded-xl border border-gold-400/[0.08] bg-midnight/20 px-5 py-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] text-gold-200/30 mb-1">套餐名</p>
              <input value={p.name} onChange={e => updatePlan(p.id,"name",e.target.value)} className={inputCls} />
            </div>
            <div>
              <p className="text-[10px] text-gold-200/30 mb-1">月付（元）</p>
              <input value={p.price_monthly} onChange={e => updatePlan(p.id,"price_monthly",e.target.value)} className={inputCls} />
            </div>
            <div>
              <p className="text-[10px] text-gold-200/30 mb-1">年付（元）</p>
              <input value={p.price_yearly} onChange={e => updatePlan(p.id,"price_yearly",e.target.value)} className={inputCls} />
            </div>
            <div>
              <p className="text-[10px] text-gold-200/30 mb-1">每日限额</p>
              <input value={p.readings_per_day} onChange={e => updatePlan(p.id,"readings_per_day",e.target.value)} className={inputCls} />
            </div>
            <div className="col-span-2">
              <p className="text-[10px] text-gold-200/30 mb-1">功能（逗号分隔）</p>
              <input value={p.features} onChange={e => updatePlan(p.id,"features",e.target.value)} className={inputCls} />
            </div>
          </div>
        ))}
      </section>

      {/* 优惠码 */}
      <section className="space-y-3">
        <h2 className="text-sm font-ui text-gold-200/50">优惠码</h2>
        <div className="rounded-xl border border-gold-400/[0.08] overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-400/[0.06] bg-midnight/30">
                {["码","折扣","过期时间","已使用",""].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-ui text-gold-200/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map((c, i) => (
                <tr key={i} className="border-b border-gold-400/[0.04]">
                  <td className="px-4 py-3 font-mono text-gold-300">{c.code}</td>
                  <td className="px-4 py-3 text-gold-200/60">{c.discount}</td>
                  <td className="px-4 py-3 text-gold-200/40">{c.expires}</td>
                  <td className="px-4 py-3 text-gold-200/40 text-center">{c.uses}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setCoupons(cs => cs.filter((_, j) => j !== i))}
                      className="text-gold-200/20 hover:text-red-400/60 transition-colors">
                      <Trash size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 新增优惠码 */}
        <div className="flex gap-3 flex-wrap">
          <input placeholder="优惠码" value={newCode} onChange={e => setNewCode(e.target.value)}
            className="flex-1 min-w-[120px] bg-abyss/60 border border-gold-400/[0.08] rounded-lg px-3 py-2 text-sm text-gold-100 font-mono focus:outline-none focus:border-gold-400/30" />
          <input placeholder="折扣 e.g. 20%" value={newDiscount} onChange={e => setNewDiscount(e.target.value)}
            className="w-28 bg-abyss/60 border border-gold-400/[0.08] rounded-lg px-3 py-2 text-sm text-gold-100 font-mono focus:outline-none focus:border-gold-400/30" />
          <input type="date" value={newExpires} onChange={e => setNewExpires(e.target.value)}
            className="w-36 bg-abyss/60 border border-gold-400/[0.08] rounded-lg px-3 py-2 text-sm text-gold-100 font-mono focus:outline-none focus:border-gold-400/30" />
          <button onClick={addCoupon}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gold-400/20 text-gold-300 text-sm font-ui hover:border-gold-400/40 transition-colors">
            <Plus size={13} />添加
          </button>
        </div>
      </section>

      <div className="flex justify-end">
        <motion.button onClick={save} whileTap={{ scale: 0.97 }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-ui border transition-all duration-300 ${
            saved ? "border-emerald-400/30 text-emerald-400/80 bg-emerald-400/5"
                  : "border-gold-400/30 text-gold-300 hover:border-gold-400/60 hover:bg-gold-400/[0.06]"
          }`}>
          {saved ? <><Check size={14} />已保存</> : <><FloppyDisk size={14} />保存</>}
        </motion.button>
      </div>
    </div>
  );
}
