"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeSlash, FloppyDisk, Check } from "@phosphor-icons/react";

interface ConfigField {
  key: string; label: string; value: string; type: "text" | "password" | "select" | "number";
  options?: string[]; hint?: string;
}

const INITIAL: ConfigField[] = [
  { key: "ai_provider",    label: "AI 提供商",          value: "anthropic",          type: "select",   options: ["anthropic","openai","custom"] },
  { key: "api_key",        label: "API Key",            value: "sk-ant-••••••••",    type: "password",  hint: "留空表示不修改" },
  { key: "model",          label: "模型",                value: "claude-opus-4-8",    type: "select",   options: ["claude-opus-4-8","claude-sonnet-4-6","gpt-4o","gpt-4o-mini"] },
  { key: "max_tokens",     label: "单次最大 Tokens",     value: "2048",               type: "number",    hint: "建议 1024–4096" },
  { key: "custom_endpoint",label: "自定义 API 端点",     value: "",                   type: "text",      hint: "仅自定义提供商时填写" },
  { key: "daily_free_limit",label: "免费用户每日限额",   value: "1",                  type: "number" },
  { key: "daily_prem_limit",label: "付费用户每日限额",   value: "999",                type: "number",    hint: "999 = 不限" },
];

export default function ConfigPage() {
  const [fields, setFields] = useState(INITIAL);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const update = (key: string, value: string) =>
    setFields(f => f.map(x => x.key === key ? { ...x, value } : x));

  const save = () => {
    // TODO: POST /api/admin/config
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-heading text-xl font-semibold text-gold-100">系统配置</h1>

      <div className="rounded-xl border border-gold-400/[0.08] bg-midnight/20 divide-y divide-gold-400/[0.06]">
        {fields.map(f => (
          <div key={f.key} className="px-5 py-4 flex items-center gap-4">
            <div className="w-40 shrink-0">
              <p className="text-xs font-ui text-gold-200/60">{f.label}</p>
              {f.hint && <p className="text-[10px] font-mono text-gold-200/25 mt-0.5">{f.hint}</p>}
            </div>
            <div className="flex-1 relative">
              {f.type === "select" ? (
                <select
                  value={f.value}
                  onChange={e => update(f.key, e.target.value)}
                  className="w-full bg-abyss/60 border border-gold-400/[0.08] rounded-lg px-3 py-2 text-sm text-gold-100 font-mono focus:outline-none focus:border-gold-400/30">
                  {f.options!.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type === "password" && !showKeys[f.key] ? "password" : "text"}
                  value={f.value}
                  onChange={e => update(f.key, e.target.value)}
                  className="w-full bg-abyss/60 border border-gold-400/[0.08] rounded-lg px-3 py-2 text-sm text-gold-100 font-mono focus:outline-none focus:border-gold-400/30"
                />
              )}
              {f.type === "password" && (
                <button
                  onClick={() => setShowKeys(s => ({ ...s, [f.key]: !s[f.key] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-200/30 hover:text-gold-400">
                  {showKeys[f.key] ? <EyeSlash size={14} /> : <Eye size={14} />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <motion.button
          onClick={save}
          whileTap={{ scale: 0.97 }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-ui border transition-all duration-300 ${
            saved
              ? "border-emerald-400/30 text-emerald-400/80 bg-emerald-400/5"
              : "border-gold-400/30 text-gold-300 hover:border-gold-400/60 hover:bg-gold-400/[0.06]"
          }`}>
          {saved ? <><Check size={14} />已保存</> : <><FloppyDisk size={14} />保存配置</>}
        </motion.button>
      </div>
    </div>
  );
}
