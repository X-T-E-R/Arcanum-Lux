"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  MagicWand,
  Sparkle,
  ImageSquare,
  Question,
  Cards,
  BookOpenText,
  ArrowDown,
  Check,
  X as XIcon,
} from "@phosphor-icons/react";
import StarfieldBG from "@/components/effects/StarfieldBG";
import MagicCircle from "@/components/effects/MagicCircle";
import FloatingCards from "@/components/sections/FloatingCards";
import WitchOracle from "@/components/effects/WitchOracle";
import GoldButton from "@/components/ui/GoldButton";
import GlassCard from "@/components/ui/GlassCard";
import { majorCardImagePath, minorCardImagePath, witchImagePath } from "@/lib/assets";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/animations";
import { ROUTES } from "@/lib/constants";

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.95]);

  return (
    <div className="relative overflow-hidden">
      <StarfieldBG starCount={280} />

      {/* Aurora ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 aurora-glow opacity-20" />
        <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] bg-arcane-deep/20 rounded-full blur-[180px] animate-breathe" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gold-400/[0.04] rounded-full blur-[150px] animate-breathe" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-ritual-purple/[0.04] rounded-full blur-[120px] animate-breathe" style={{ animationDelay: "4s" }} />
      </div>

      {/* ===== HERO ===== */}
      <motion.section
        ref={heroRef}
        className="relative z-10 min-h-[100dvh] flex items-center"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        {/* Floating orbit cards behind content */}
        <div className="hidden lg:block">
          <FloatingCards />
        </div>

        {/* Magic circle - right side decoration */}
        <div className="absolute right-[-120px] top-1/2 -translate-y-1/2 opacity-[0.1] hidden lg:block">
          <MagicCircle size={650} interactive />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text content with character reveal */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.p
                variants={staggerItem}
                className="font-mono text-xs tracking-[0.5em] text-gold-400/40 uppercase mb-8"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 1 }}
                >
                  {"AI Tarot Reading".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.04, duration: 0.3 }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </motion.span>
              </motion.p>

              <motion.h1
                className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-6"
                variants={staggerItem}
              >
                <motion.span
                  className="text-gold-gradient-animated inline-block"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  探寻命运的
                </motion.span>
                <br />
                <motion.span
                  className="text-gold-100 inline-block"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  低语
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gold-200/50 font-body leading-relaxed max-w-[50ch] mb-10 mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
              >
                沉浸式 AI 塔罗占卜，在星辰与牌阵之间，找到属于你的答案。
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.6 }}
              >
                <Link href={ROUTES.reading}>
                  <GoldButton size="lg">开始占卜</GoldButton>
                </Link>
                <Link href="#features">
                  <GoldButton variant="secondary" size="lg">
                    了解更多
                  </GoldButton>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Witch character + levitating cards */}
            <motion.div
              className="hidden lg:flex items-center justify-center relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1.2 }}
            >
              {/* witch — 正方形容器，1:1，screen混合消背景，无边框无裁切 */}
              <div className="relative w-[460px] h-[460px]">
                {/* 呼吸光晕 — 跟随图片中心 */}
                <motion.div
                  className="absolute inset-[-15%] rounded-full pointer-events-none"
                  animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background: "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.18) 0%, rgba(201,168,76,0.08) 50%, transparent 75%)",
                    filter: "blur(20px)",
                  }}
                />

                {/* witch 裸图：无容器边框，screen 混合，底部渐隐融入星空 */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={witchImagePath()}
                    alt="占卜师"
                    className="w-full h-full object-cover"
                    style={{
                      mixBlendMode: "screen",
                      filter: "brightness(0.75) contrast(1.08) saturate(1.15)",
                      // 底部 30% 渐隐，顶部完整显示
                      maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
                    }}
                    draggable={false}
                  />
                </motion.div>

                {/* 点缀粒子 */}
                <motion.div className="absolute top-6 right-10 w-2 h-2 rounded-full bg-gold-400/25"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.25, 0.55, 0.25] }}
                  transition={{ duration: 2.8, repeat: Infinity }} />
                <motion.div className="absolute bottom-24 left-6 w-1.5 h-1.5 rounded-full bg-arcane-glow/30"
                  animate={{ scale: [1, 2, 1], opacity: [0.15, 0.4, 0.15] }}
                  transition={{ duration: 3.8, repeat: Infinity, delay: 1.2 }} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator with trail */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] font-mono text-gold-400/30 tracking-widest uppercase">
            Scroll
          </span>
          <ArrowDown size={20} className="text-gold-400/30" />
        </motion.div>
      </motion.section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="relative z-10 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <p className="font-mono text-xs tracking-[0.3em] text-gold-400/40 uppercase mb-4">
              Features
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold text-gold-100">
              沉浸式占卜体验
            </h2>
          </motion.div>

          <div className="space-y-24 md:space-y-32">
            <FeatureRow
              icon={<MagicWand size={28} weight="duotone" />}
              title="沉浸式占卜仪式"
              description="从提出问题到翻开每一张牌，完整的仪式化体验让占卜不再只是结果，而是一段与内心对话的旅程。精致的 3D 翻牌动画、金色粒子特效和魔法阵，让每一次占卜都充满仪式感。"
              reverse={false}
              previewCards={[majorCardImagePath("the_star"), majorCardImagePath("the_moon"), majorCardImagePath("the_sun")]}
            />
            <FeatureRow
              icon={<BookOpenText size={28} weight="duotone" />}
              title="AI 深度解读"
              description="融合传统塔罗学识与现代心理学视角，AI 塔罗师为你提供连贯、深入且充满神秘感的解读。没有冰冷的免责声明，只有真正的塔罗智慧。"
              reverse={true}
              previewCards={[majorCardImagePath("the_high_priestess"), majorCardImagePath("the_magician"), majorCardImagePath("the_empress")]}
            />
            <FeatureRow
              icon={<ImageSquare size={28} weight="duotone" />}
              title="卡牌收藏画廊"
              description="78 张精致二次元绘制的塔罗牌，每一次占卜都是收集与发现的过程。完整的画廊系统，解锁每一张牌的秘密含义。"
              reverse={false}
              previewCards={[majorCardImagePath("the_fool"), minorCardImagePath("cups", "ace"), majorCardImagePath("the_world")]}
            />
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <p className="font-mono text-xs tracking-[0.3em] text-gold-400/40 uppercase mb-4">
              How It Works
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-gold-100">
              三步开启你的塔罗之旅
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { icon: <Question size={32} weight="duotone" />, step: "01", title: "提出问题", desc: "将你的困惑化作一个真诚的问题" },
              { icon: <Cards size={32} weight="duotone" />, step: "02", title: "仪式抽牌", desc: "在动画与氛围中感受牌阵的引导" },
              { icon: <Sparkle size={32} weight="duotone" />, step: "03", title: "获取解读", desc: "AI 塔罗师为你展开深入的神秘解读" },
            ].map((item, i) => (
              <motion.div key={i} variants={staggerItem}>
                <motion.div whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}>
                  <GlassCard goldBorder="top" className="text-center py-10 h-full relative overflow-hidden group">
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gold-400/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <motion.div
                        className="text-gold-400/50 mb-4 flex justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {item.icon}
                      </motion.div>
                      <p className="font-mono text-xs text-gold-400/30 tracking-widest mb-3">
                        {item.step}
                      </p>
                      <h3 className="font-heading text-lg font-semibold text-gold-100 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gold-200/40">{item.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== PRICING TEASER ===== */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="max-w-[900px] mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <p className="font-mono text-xs tracking-[0.3em] text-gold-400/40 uppercase mb-4">
              Pricing
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-gold-100 mb-4">
              选择你的路径
            </h2>
            <p className="text-gold-200/40">BYOK 免费运行；托管方案以后再接</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={staggerItem}>
              <GlassCard className="h-full p-8">
                <p className="font-heading text-sm text-gold-200/50 mb-1">BYOK</p>
                <p className="font-display text-3xl text-gold-100 mb-6">免费</p>
                <ul className="space-y-3 mb-8">
                  {[
                    { text: "用户自带 API Key", ok: true },
                    { text: "纯前端静态部署", ok: true },
                    { text: "本地抽牌与本地历史", ok: true },
                    { text: "三牌 AI 解读", ok: true },
                    { text: "项目方托管 Key", ok: false },
                    { text: "云端同步", ok: false },
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      {f.ok ? <Check size={16} className="text-gold-400" /> : <XIcon size={16} className="text-gold-200/20" />}
                      <span className={f.ok ? "text-gold-200/60" : "text-gold-200/20"}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Link href={ROUTES.settings}>
                  <GoldButton variant="secondary" className="w-full">配置 Key</GoldButton>
                </Link>
              </GlassCard>
            </motion.div>

            <motion.div variants={staggerItem}>
              <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <GlassCard goldBorder="full" className="h-full p-8 relative">
                  <div className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full text-[10px] font-ui font-semibold text-void">
                    预留
                  </div>
                  <p className="font-heading text-sm text-gold-400 mb-1">Hosted</p>
                  <p className="font-display text-3xl text-gold-100 mb-1">
                    未开放<span className="text-base font-body text-gold-200/40">/未来</span>
                  </p>
                  <p className="text-xs text-gold-200/30 mb-6">第一版不接支付系统</p>
                  <ul className="space-y-3 mb-8">
                    {["项目方托管 Key", "人机验证", "serverless 代理", "云端历史同步", "速率限制", "未来付费入口"].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <Check size={16} className="text-gold-400" />
                        <span className="text-gold-200/60">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={ROUTES.pricing}>
                    <GoldButton className="w-full">查看路线</GoldButton>
                  </Link>
                </GlassCard>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 py-12 border-t border-gold-400/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display text-sm tracking-[0.2em] text-gold-400/30">ARCANUM</p>
          <div className="flex items-center gap-6 text-xs text-gold-200/30 font-ui">
            <span className="text-gold-200/15">法律声明</span>
            <span className="text-gold-200/15">隐私政策</span>
            <a href="mailto:hello@arcanum.app" className="hover:text-gold-300 transition-colors">联系我们</a>
          </div>
          <p className="text-xs text-gold-200/20">Arcanum. 塔罗仅供娱乐与自我反思。</p>
        </div>
      </footer>

      {/* 羊皮纸颗粒纹理 — soft-light 混合，opacity 提升到可感知 */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          opacity: 0.055,
          mixBlendMode: "soft-light",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  );
}

function FeatureRow({
  icon, title, description, reverse, previewCards,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  reverse: boolean;
  previewCards: string[]; // image paths
}) {
  return (
    <motion.div
      className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${reverse ? "direction-rtl lg:[direction:rtl]" : ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
    >
      <motion.div
        variants={staggerItem}
        className={`lg:col-span-5 ${reverse ? "lg:order-2" : ""}`}
      >
        <GlassCard className="aspect-[4/3] flex items-center justify-center relative overflow-hidden group" padding="none">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-400/[0.04] via-transparent to-arcane-glow/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          {/* 真实牌面展示：3张叠扇 */}
          <div className="relative flex items-center justify-center h-full w-full">
            {previewCards.map((src, i) => {
              // 非对称叠扇：避免镜像感，每张有独立位移和旋转
              const offsets = [-32, 4, 26];
              const rotations = [-12, 3, -6];
              const yDelays = [0, 0.8, 1.6];
              return (
                <motion.div key={i}
                  className="absolute rounded overflow-hidden shadow-2xl"
                  style={{
                    width: 88, height: 146,
                    zIndex: i,
                    transform: `translateX(${offsets[i]}px) rotate(${rotations[i]}deg)`,
                    // 牌面自带白边，不加额外 border
                  }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3.5 + i * 0.9, repeat: Infinity, ease: "easeInOut", delay: yDelays[i] }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-contain bg-[#0e0c1f]" draggable={false} />
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        variants={staggerItem}
        className={`lg:col-span-7 ${reverse ? "lg:order-1 lg:text-right" : ""}`}
        style={{ direction: "ltr" }}
      >
        <div className={`flex items-center gap-3 mb-4 ${reverse ? "lg:justify-end" : ""}`}>
          <div className="text-gold-400/60">{icon}</div>
          <h3 className="font-heading text-2xl md:text-3xl font-semibold text-gold-100">
            {title}
          </h3>
        </div>
        <p className="text-gold-200/40 text-base md:text-lg leading-relaxed max-w-[55ch]">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}
