"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CaretDown, CaretUp, Check, Cloud, Crown, Key } from "@phosphor-icons/react";
import GlassCard from "@/components/ui/GlassCard";
import GoldButton from "@/components/ui/GoldButton";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/animations";
import { ROUTES } from "@/lib/constants";

const FEATURES = [
  { key: "runtime", label: "运行方式", byok: "纯前端静态", hosted: "托管 Key / 服务端代理" },
  { key: "key", label: "API Key", byok: "用户自己提供", hosted: "项目方托管" },
  { key: "cards", label: "抽牌引擎", byok: "浏览器本地", hosted: "浏览器本地" },
  { key: "spreads", label: "三牌解读", byok: true, hosted: true },
  { key: "history", label: "历史记录", byok: "浏览器本地", hosted: "可扩展云端同步" },
  { key: "payments", label: "支付系统", byok: "不需要", hosted: "未来再接" },
];

const FAQ_ITEMS = [
  {
    q: "第一版要注册或付费吗？",
    a: "不需要。第一版按 BYOK/free 跑：用户自己填 OpenAI-compatible API Key，项目不收款，也不托管用户数据。",
  },
  {
    q: "为什么还保留方案页？",
    a: "方案页保留产品结构：当前可用的是 BYOK，托管 Key、云端同步和人机验证可以作为未来 Hosted 方案。",
  },
  {
    q: "Key 会上传到项目服务器吗？",
    a: "不会。静态版没有项目后端，Key 只保存在当前浏览器 localStorage，用来直连用户配置的模型服务。",
  },
  {
    q: "如果浏览器直连模型 API 被 CORS 拦住怎么办？",
    a: "需要换成允许浏览器请求的 OpenAI-compatible 网关；否则就必须引入一个 serverless 代理，那就不再是纯静态 BYOK。",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-8">
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <div className="text-center mb-12">
          <Crown size={40} className="text-gold-400/40 mx-auto mb-4" weight="duotone" />
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-gold-100 mb-3">
            BYOK / Free 第一版
          </h1>
          <p className="text-gold-200/40">
            开源静态部署，不接支付系统；用户自己提供 Key，记录留在浏览器本地。
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <GlassCard goldBorder="full" className="h-full p-8 relative">
              <div className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full text-[10px] font-ui font-semibold text-void">
                当前可用
              </div>
              <Key size={28} className="text-gold-400/50 mb-4" weight="duotone" />
              <p className="font-heading text-sm text-gold-400 mb-1">BYOK</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display text-4xl text-gold-100">免费</span>
                <span className="text-sm text-gold-200/35">自带 Key</span>
              </div>
              <ul className="space-y-3 mb-8">
                {FEATURES.map((f) => (
                  <li key={f.key} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gold-200/60">{f.label}</span>
                      {typeof f.byok === "string" && (
                        <span className="ml-2 text-gold-200/30 font-mono text-xs">{f.byok}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <GoldButton className="w-full" onClick={() => router.push(ROUTES.settings)}>
                配置 BYOK Key
              </GoldButton>
            </GlassCard>
          </motion.div>

          <motion.div variants={staggerItem}>
            <GlassCard className="h-full p-8 opacity-70">
              <Cloud size={28} className="text-gold-400/35 mb-4" weight="duotone" />
              <p className="font-heading text-sm text-gold-200/45 mb-1">Hosted</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display text-4xl text-gold-100">预留</span>
                <span className="text-sm text-gold-200/35">以后再接</span>
              </div>
              <ul className="space-y-3 mb-8">
                {FEATURES.map((f) => (
                  <li key={f.key} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-gold-400/40 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gold-200/45">{f.label}</span>
                      {typeof f.hosted === "string" && (
                        <span className="ml-2 text-gold-200/25 font-mono text-xs">{f.hosted}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <GoldButton className="w-full" variant="secondary" disabled>
                暂不开放
              </GoldButton>
            </GlassCard>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.h2
            variants={staggerItem}
            className="font-heading text-xl font-semibold text-gold-100 mb-6 text-center"
          >
            常见问题
          </motion.h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div key={item.q} variants={staggerItem}>
                <GlassCard padding="none" className="overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-sm font-ui text-gold-100 pr-4">{item.q}</span>
                    {openFaq === i ? (
                      <CaretUp size={16} className="text-gold-400/40 flex-shrink-0" />
                    ) : (
                      <CaretDown size={16} className="text-gold-400/40 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <motion.div
                      className="px-5 pb-5"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <p className="text-sm text-gold-200/40 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
