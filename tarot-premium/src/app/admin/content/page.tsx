"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FloppyDisk, Check } from "@phosphor-icons/react";

const INITIAL = {
  site_name: "ARCANUM",
  hero_title: "探寻命运的低语",
  hero_subtitle: "沉浸式 AI 塔罗占卜，在星辰与牌阵之间，找到属于你的答案。",
  announcement: "",
  footer_note: "Arcanum. 塔罗仅供娱乐与自我反思。",
};

export default function ContentPage() {
  const [fields, setFields] = useState(INITIAL);
  const [saved, setSaved] = useState(false);

  const update = (k: keyof typeof INITIAL, v: string) =>
    setFields(f => ({ ...f, [k]: v }));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const rows: { key: keyof typeof INITIAL; label: string; multiline?: boolean }[] = [
    { key: "site_name",   label: "站点名称" },
    { key: "hero_title",  label: "首页主标题" },
    { key: "hero_subtitle", label: "首页副标题", multiline: true },
    { key: "announcement", label: "公告横幅（留空不显示）", multiline: true },
    { key: "footer_note", label: "底部免责声明" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-heading text-xl font-semibold text-gold-100">内容管理</h1>

      <div className="rounded-xl border border-gold-400/[0.08] bg-midnight/20 divide-y divide-gold-400/[0.06]">
        {rows.map(({ key, label, multiline }) => (
          <div key={key} className="px-5 py-4">
            <p className="text-xs font-ui text-gold-200/50 mb-2">{label}</p>
            {multiline ? (
              <textarea
                rows={3}
                value={fields[key]}
                onChange={e => update(key, e.target.value)}
                className="w-full bg-abyss/60 border border-gold-400/[0.08] rounded-lg px-3 py-2 text-sm text-gold-100 font-body resize-none focus:outline-none focus:border-gold-400/30"
              />
            ) : (
              <input
                value={fields[key]}
                onChange={e => update(key, e.target.value)}
                className="w-full bg-abyss/60 border border-gold-400/[0.08] rounded-lg px-3 py-2 text-sm text-gold-100 font-ui focus:outline-none focus:border-gold-400/30"
              />
            )}
          </div>
        ))}
      </div>

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
