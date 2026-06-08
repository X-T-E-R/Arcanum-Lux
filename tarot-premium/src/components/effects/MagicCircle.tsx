"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, useAnimationFrame } from "framer-motion";

export default function MagicCircle({
  size = 400,
  className = "",
  opacity = 0.15,
  interactive = false,
}: {
  size?: number;
  className?: string;
  opacity?: number;
  interactive?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseAngle = useMotionValue(0);
  const smoothAngle = useSpring(mouseAngle, { stiffness: 50, damping: 30 });
  const autoAngle = useMotionValue(0);
  // 速率乘数：鼠标靠近时 → 2.5，远离时 → 1
  const speedMult = useRef(1);
  const targetSpeed = useRef(1);

  useAnimationFrame((_, delta) => {
    // 平滑趋近目标速率
    speedMult.current += (targetSpeed.current - speedMult.current) * 0.04;
    autoAngle.set(autoAngle.get() + delta * 0.01 * speedMult.current);
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // 鼠标距离中心越近，速率越高
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    const maxDist = size * 0.8;
    targetSpeed.current = 1 + (1 - Math.min(dist / maxDist, 1)) * 2.5;
    if (interactive) {
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
      mouseAngle.set(angle);
    }
  };

  const handleMouseLeave = () => { targetSpeed.current = 1; };

  const outerRotation = useTransform(
    [autoAngle, interactive ? smoothAngle : autoAngle],
    ([auto, mouse]) => (interactive ? (auto as number) * 20 + (mouse as number) : (auto as number) * 20)
  );

  const innerRotation = useTransform(
    autoAngle,
    (v) => -(v as number) * 30
  );

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width: size, height: size, opacity }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer breathing glow */}
      <div className="absolute inset-[-20%] rounded-full magic-glow" />

      {/* Outer ring - slow rotation */}
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
        style={{ rotate: outerRotation }}
      >
        <defs>
          <linearGradient id="mc-grad-outer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#E8D5B5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.8" />
          </linearGradient>
          <filter id="mc-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer circles */}
        <circle cx="200" cy="200" r="195" fill="none" stroke="url(#mc-grad-outer)" strokeWidth="0.3" />
        <circle cx="200" cy="200" r="188" fill="none" stroke="url(#mc-grad-outer)" strokeWidth="0.5" filter="url(#mc-glow)" />
        <circle cx="200" cy="200" r="180" fill="none" stroke="url(#mc-grad-outer)" strokeWidth="0.3" />

        {/* Rune markers - 12 zodiac positions */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = 200 + 184 * Math.cos(angle);
          const y = 200 + 184 * Math.sin(angle);
          const tx = 200 + 174 * Math.cos(angle);
          const ty = 200 + 174 * Math.sin(angle);
          return (
            <g key={`rune-${i}`}>
              <circle cx={x} cy={y} r="3" fill="#C9A84C" fillOpacity="0.4" />
              <line
                x1={200 + 179 * Math.cos(angle)} y1={200 + 179 * Math.sin(angle)}
                x2={200 + 189 * Math.cos(angle)} y2={200 + 189 * Math.sin(angle)}
                stroke="#C9A84C" strokeOpacity="0.3" strokeWidth="0.5"
              />
            </g>
          );
        })}

        {/* Decorative arcs */}
        {Array.from({ length: 4 }).map((_, i) => {
          const startAngle = i * 90;
          const endAngle = startAngle + 60;
          const r = 170;
          const x1 = 200 + r * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 200 + r * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 200 + r * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 200 + r * Math.sin((endAngle * Math.PI) / 180);
          return (
            <path
              key={`arc-${i}`}
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
              fill="none" stroke="#C9A84C" strokeOpacity="0.2" strokeWidth="0.8"
              strokeDasharray="4 2"
            />
          );
        })}
      </motion.svg>

      {/* Inner ring - counter rotation */}
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
        style={{ rotate: innerRotation }}
      >
        <defs>
          <linearGradient id="mc-grad-inner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#C9A84C" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Inner circles */}
        <circle cx="200" cy="200" r="140" fill="none" stroke="url(#mc-grad-inner)" strokeWidth="0.4" />
        <circle cx="200" cy="200" r="130" fill="none" stroke="url(#mc-grad-inner)" strokeWidth="0.2" strokeDasharray="2 4" />

        {/* Pentagram */}
        <polygon
          points="200,60 244,172 360,172 268,240 300,360 200,290 100,360 132,240 40,172 156,172"
          fill="none" stroke="url(#mc-grad-inner)" strokeWidth="0.4"
          filter="url(#mc-glow)"
        />

        {/* Hexagram */}
        <polygon
          points="200,80 290,140 290,260 200,320 110,260 110,140"
          fill="none" stroke="#C9A84C" strokeOpacity="0.15" strokeWidth="0.3"
        />

        {/* Inner cross lines */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = i * 45;
          return (
            <line
              key={`cross-${i}`}
              x1="200" y1="200"
              x2={200 + 130 * Math.cos((angle * Math.PI) / 180)}
              y2={200 + 130 * Math.sin((angle * Math.PI) / 180)}
              stroke="#C9A84C" strokeOpacity="0.08" strokeWidth="0.3"
            />
          );
        })}
      </motion.svg>

      {/* Center glow dot */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-3 h-3 rounded-full bg-gold-400/30 blur-sm"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
