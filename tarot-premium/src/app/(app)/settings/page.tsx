"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CaretRight,
  Database,
  Globe,
  Info,
  Key,
  Palette,
} from "@phosphor-icons/react";
import GlassCard from "@/components/ui/GlassCard";
import Modal from "@/components/ui/Modal";
import GoldButton from "@/components/ui/GoldButton";
import InputField from "@/components/ui/InputField";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { listModels } from "@/lib/oracle/openaiCompatible";
import { useByokStore } from "@/stores/byokStore";

function errorText(error: unknown): string {
  const message = (error as Error)?.message;
  if (!message) return "ERR";
  const normalized = message.replace(/\s+/g, " ").trim();
  if (normalized.includes("Failed to fetch")) return "NETWORK: Failed to fetch";
  if (normalized.includes("Load failed")) return "NETWORK: Load failed";
  return normalized.slice(0, 160);
}

export default function SettingsPage() {
  const apiKey = useByokStore((state) => state.apiKey);
  const baseUrl = useByokStore((state) => state.baseUrl);
  const model = useByokStore((state) => state.model);
  const setConfig = useByokStore((state) => state.setConfig);
  const clearApiKey = useByokStore((state) => state.clearApiKey);

  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localBaseUrl, setLocalBaseUrl] = useState(baseUrl);
  const [localModel, setLocalModel] = useState(model);
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clearModal, setClearModal] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    setLocalApiKey(apiKey);
    setLocalBaseUrl(baseUrl);
    setLocalModel(model);
  }, [apiKey, baseUrl, model]);

  const handleSaveByok = () => {
    setConfig({
      apiKey: localApiKey.trim(),
      baseUrl: localBaseUrl.trim(),
      model: localModel.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const handleClearCache = () => {
    localStorage.clear();
    setCleared(true);
    setTimeout(() => {
      setClearModal(false);
      setCleared(false);
      window.location.reload();
    }, 900);
  };

  const handleListModels = async () => {
    if (!localApiKey.trim()) {
      window.alert("NO_KEY");
      return;
    }
    setModelsLoading(true);
    try {
      const models = await listModels({
        apiKey: localApiKey.trim(),
        baseUrl: localBaseUrl.trim(),
        model: localModel.trim(),
      });
      if (!models.length) {
        window.alert("NO_MODELS");
        return;
      }
      setModelOptions(models);
      if (!models.includes(localModel.trim())) setLocalModel(models[0]);
    } catch (e) {
      console.error("[oracle] list models error", {
        baseUrl: localBaseUrl.trim(),
        model: localModel.trim(),
        error: e,
      });
      window.alert(errorText(e));
    } finally {
      setModelsLoading(false);
    }
  };

  const sections = [
    {
      title: "通用",
      items: [
        {
          icon: Globe,
          label: "语言",
          desc: lang === "zh" ? "中文" : "English",
          action: () => setLang((l) => (l === "zh" ? "en" : "zh")),
        },
        { icon: Palette, label: "主题", desc: "深色模式（暂不支持切换）", action: null },
        {
          icon: Bell,
          label: "通知",
          desc: "每日塔罗提醒（需浏览器权限）",
          action: () => Notification.requestPermission(),
        },
      ],
    },
    {
      title: "本地数据",
      items: [
        {
          icon: Database,
          label: "清除本地数据",
          desc: "清除浏览器里的 Key、历史和设置",
          action: () => setClearModal(true),
        },
      ],
    },
    {
      title: "关于",
      items: [{ icon: Info, label: "版本", desc: "v0.2.0 BYOK", action: null }],
    },
  ];

  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-8">
      <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div variants={staggerItem} className="mb-8">
          <h1 className="font-heading text-3xl font-semibold text-gold-100 mb-2">设置</h1>
          <p className="text-sm text-gold-200/35">
            第一版是 BYOK/free：不接支付，不接自管后端，Key 和记录都留在浏览器里。
          </p>
        </motion.div>

        <motion.div variants={staggerItem} className="mb-8">
          <p className="text-xs font-ui text-gold-400/40 uppercase tracking-wider mb-3 px-1">
            BYOK 模型配置
          </p>
          <GlassCard goldBorder="top" className="space-y-5">
            <div className="flex items-start gap-3">
              <Key size={22} className="text-gold-400/45 mt-0.5" weight="duotone" />
              <div>
                <h2 className="font-heading text-lg text-gold-100">自带 API Key</h2>
                <p className="text-sm text-gold-200/35 leading-relaxed mt-1">
                  Key 只保存在当前浏览器的 localStorage。直连模式要求你的模型服务允许浏览器
                  CORS；如果供应商拦截浏览器请求，就需要换成支持 CORS 的 OpenAI-compatible
                  网关。
                </p>
              </div>
            </div>

            <InputField
              label="API Key"
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
              hint="开源静态版不会内置项目方 Key。"
            />
            <InputField
              label="Base URL"
              value={localBaseUrl}
              onChange={(e) => setLocalBaseUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
              hint="填写 OpenAI-compatible 根地址，系统会自动追加 /chat/completions。"
            />
            <InputField
              label="Model"
              value={localModel}
              onChange={(e) => setLocalModel(e.target.value)}
              placeholder="gpt-4.1-mini"
            />
            <div className="flex flex-wrap gap-3">
              <GoldButton variant="secondary" size="sm" onClick={handleListModels} loading={modelsLoading}>
                获取模型
              </GoldButton>
              {modelOptions.length > 0 && (
                <select
                  className="min-w-56 rounded-xl bg-abyss/80 border border-gold-400/10 px-3 py-2 text-sm text-gold-100 font-body focus:outline-none focus:ring-2 focus:ring-gold-400/30"
                  value={localModel}
                  onChange={(e) => setLocalModel(e.target.value)}
                >
                  {modelOptions.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <GoldButton size="sm" onClick={handleSaveByok} loading={saved}>
                {saved ? "已保存" : "保存 BYOK 配置"}
              </GoldButton>
              <GoldButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  clearApiKey();
                  setLocalApiKey("");
                }}
              >
                清除 Key
              </GoldButton>
            </div>
          </GlassCard>
        </motion.div>

        {sections.map((section) => (
          <motion.div key={section.title} variants={staggerItem} className="mb-8">
            <p className="text-xs font-ui text-gold-400/40 uppercase tracking-wider mb-3 px-1">
              {section.title}
            </p>
            <GlassCard padding="none" className="divide-y divide-gold-400/[0.04]">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between p-4 hover:bg-gold-400/[0.02] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={item.action ?? undefined}
                    disabled={!item.action}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-gold-400/40" />
                      <div className="text-left">
                        <p className="text-sm font-ui text-gold-100">{item.label}</p>
                        {item.desc && <p className="text-xs text-gold-200/30">{item.desc}</p>}
                      </div>
                    </div>
                    {item.action && <CaretRight size={14} className="text-gold-200/15" />}
                  </button>
                );
              })}
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      <Modal open={clearModal} onClose={() => setClearModal(false)} title="清除本地数据">
        <p className="text-sm text-gold-200/40 mb-6">
          这会清除当前浏览器里的 API Key、占卜历史和设置。确定继续？
        </p>
        <div className="flex gap-3">
          <GoldButton size="sm" onClick={handleClearCache} loading={cleared}>
            {cleared ? "已清除" : "确认清除"}
          </GoldButton>
          <GoldButton variant="ghost" size="sm" onClick={() => setClearModal(false)}>
            取消
          </GoldButton>
        </div>
      </Modal>
    </div>
  );
}
