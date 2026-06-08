"use client";

import { motion, AnimatePresence } from "framer-motion";
import { witchImagePath } from "@/lib/assets";

/**
 * WitchOracle — 占卜师形象
 * 原始女巫图背景是深蓝色(#06060F 附近), 用 mix-blend-mode: lighten 融入星空
 * screen 模式去掉暗部,只保留亮部发色/肤色/金饰
 */
export default function WitchOracle({
  visible = true,
  size = "md",
}: {
  visible?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dims = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  }[size];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`relative ${dims} shrink-0`}
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* 外层光晕 — 金紫双色呼吸 */}
          <motion.div
            className="absolute inset-[-12%] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, rgba(201,168,76,0.06) 50%, transparent 75%)",
            }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* witch 图片 — lighten 混合去掉深蓝背景 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={witchImagePath()}
            alt="占卜师"
            className={`relative z-10 w-full h-full object-cover object-top rounded-full`}
            style={{
              mixBlendMode: "screen",
              // 微调：让她在星空背景上看起来更自然
              filter: "brightness(0.70) contrast(1.05) saturate(1.1)",
            }}
            draggable={false}
          />

          {/* 底部柔化渐变，让圆形裁切更自然 */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none z-20"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 55%, rgba(6,6,15,0.5) 85%, rgba(6,6,15,0.85) 100%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
