"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import clsx from "clsx";
import type { DrawnCard } from "@/types/card";
import { cardBackImagePath, tarotCardImagePath } from "@/lib/assets";

interface TarotCardProps {
  drawnCard: DrawnCard;
  onClick?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  delay?: number;
  disableFlip?: boolean; // 外部控制翻牌时设为 true，阻止内部自翻
}

const SIZE_MAP = {
  sm: { w: "w-20",  h: "h-[112px]", nameText: "text-[8px]",  glow: "w-8 h-8"   },
  md: { w: "w-32",  h: "h-[179px]", nameText: "text-[10px]", glow: "w-12 h-12" },
  lg: { w: "w-48",  h: "h-[269px]", nameText: "text-xs",     glow: "w-16 h-16" },
  xl: { w: "w-60",  h: "h-[336px]", nameText: "text-sm",     glow: "w-20 h-20" },
};

export default function TarotCard({
  drawnCard,
  onClick,
  size = "md",
  delay = 0,
  disableFlip = false,
}: TarotCardProps) {
  const [isFlipped, setIsFlipped] = useState(drawnCard.revealed);
  const cardRef = useRef<HTMLDivElement>(null);
  const s = SIZE_MAP[size];

  useEffect(() => {
    setIsFlipped(drawnCard.revealed);
  }, [drawnCard.card.id, drawnCard.revealed]);

  // 3D tilt only on md/lg
  const enableTilt = size !== "sm";
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 25 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [enableTilt, mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleClick = () => {
    if (!isFlipped && !disableFlip) {
      setIsFlipped(true);
      onClick?.();
      return;
    }
    if (isFlipped) onClick?.();
  };

  const isReversed = drawnCard.orientation === "reversed";

  return (
    <motion.div
      className={clsx(
        "perspective-container",
        isFlipped && onClick ? "cursor-zoom-in" : !isFlipped && !disableFlip ? "cursor-pointer" : "cursor-default",
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
      style={enableTilt ? { rotateX, rotateY } : undefined}
    >
      <motion.div
        className={clsx("relative", s.w, s.h)}
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* ===== BACK FACE ===== */}
        <div
          className={clsx(
            "card-face absolute inset-0 rounded-lg overflow-hidden",
            "bg-gradient-to-br from-[#1A1040] via-[#120E30] to-[#0B0B2A]",
            "border border-gold-400/20",
            "flex items-center justify-center",
            !isFlipped && "hover:border-gold-400/40 transition-colors duration-300"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cardBackImagePath()}
            alt="card back"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          {/* hover glow border */}
          <div className="absolute inset-0 rounded-lg ring-1 ring-gold-400/0 group-hover:ring-gold-400/30 transition-all duration-300" />
        </div>

        {/* ===== FRONT FACE ===== */}
        <div
          className={clsx(
            "card-face card-face-back absolute inset-0 rounded-lg overflow-hidden",
            "border",
            isReversed ? "border-ritual-purple/40" : "border-gold-400/30",
            "bg-[#0B0B1A]",
          )}
        >
          {/* 牌面图片 — contain 不裁切，完整显示 */}
          <motion.div
            className="absolute inset-0"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={isFlipped ? { clipPath: "inset(0% 0% 0% 0%)" } : { clipPath: "inset(100% 0% 0% 0%)" }}
            transition={{ duration: 0.65, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tarotCardImagePath(drawnCard.card)}
              alt={drawnCard.card.nameEn}
              className={clsx(
                "absolute inset-0 w-full h-full object-contain",
                isReversed && "rotate-180"
              )}
              draggable={false}
            />
          </motion.div>

          {/* Reversed tint */}
          {isReversed && (
            <div className="absolute inset-0 bg-ritual-purple/[0.06] pointer-events-none" />
          )}

          {/* 光线爆发 */}
          {isFlipped && (
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                className={clsx("absolute inset-0 flex items-center justify-center")}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0, 0.6, 0], scale: [0.4, 2, 3] }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className={clsx("rounded-full blur-xl", s.glow,
                  isReversed ? "bg-ritual-purple/50" : "bg-gold-300/50")} />
              </motion.div>
            </motion.div>
          )}

          {/* 牌名 — 半透明叠在底部 */}
          <div className={clsx(
            "absolute bottom-0 left-0 right-0 px-1 py-0.5 text-center",
            "bg-gradient-to-t from-black/60 to-transparent"
          )}>
            <p className={clsx(s.nameText, "font-heading font-semibold",
              isReversed ? "text-ritual-purple/90" : "text-gold-300/90")}>
              {drawnCard.card.name}
            </p>
            {isReversed && <p className={clsx(s.nameText, "text-ritual-purple/60 italic")}>逆位</p>}
          </div>
        </div>
      </motion.div>

      {/* Position label below card */}
      {drawnCard.revealed && (
        <motion.p
          className={clsx("text-center mt-2 font-mono tracking-wider text-gold-200/30", s.nameText)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {drawnCard.position}
        </motion.p>
      )}
    </motion.div>
  );
}
