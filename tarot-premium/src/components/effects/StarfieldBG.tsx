"use client";

import { useRef, useEffect } from "react";

interface Star {
  x: number; y: number;
  size: number; opacity: number;
  speed: number; phase: number;
  // 视差层：0=远景 1=中景 2=近景
  layer: 0 | 1 | 2;
  // 缓慢横向漂移
  vx: number;
}

interface Meteor {
  x: number; y: number;
  vx: number; vy: number;
  length: number;
  alpha: number;
  life: number; // 0→1
  active: boolean;
}

function spawnMeteor(w: number, h: number): Meteor {
  const angle = (Math.random() * 20 + 20) * (Math.PI / 180); // 20~40°斜角
  const speed = Math.random() * 8 + 10;
  return {
    x: Math.random() * w * 0.7,
    y: Math.random() * h * 0.3,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    length: Math.random() * 120 + 80,
    alpha: 1,
    life: 0,
    active: true,
  };
}

export default function StarfieldBG({
  starCount = 280,
  className = "",
}: {
  starCount?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMouseMove);

    // 三层星星：远(60%) 中(30%) 近(10%)
    starsRef.current = Array.from({ length: starCount }, (_, i) => {
      const roll = i / starCount;
      const layer: 0 | 1 | 2 = roll < 0.6 ? 0 : roll < 0.9 ? 1 : 2;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: layer === 0 ? Math.random() * 0.8 + 0.2
            : layer === 1 ? Math.random() * 1.2 + 0.6
            :               Math.random() * 2.0 + 1.0,
        opacity: layer === 0 ? Math.random() * 0.4 + 0.1
               : layer === 1 ? Math.random() * 0.5 + 0.2
               :               Math.random() * 0.6 + 0.3,
        speed: Math.random() * 0.2 + 0.05,
        phase: Math.random() * Math.PI * 2,
        layer,
        vx: (Math.random() - 0.5) * (layer === 0 ? 0.03 : layer === 1 ? 0.08 : 0.15),
      };
    });

    // 初始化3条流星槽（轮流复用）
    meteorsRef.current = [false, false, false].map(() => ({ ...spawnMeteor(canvas.width, canvas.height), active: false }));

    // 流星触发计时
    let nextMeteorIn = 3 + Math.random() * 4; // 秒
    let lastT = 0;

    let time = 0;
    const animate = (ts: number) => {
      const dt = lastT ? Math.min((ts - lastT) / 1000, 0.05) : 0;
      lastT = ts;
      time += dt;

      // 触发新流星
      nextMeteorIn -= dt;
      if (nextMeteorIn <= 0) {
        const slot = meteorsRef.current.findIndex(m => !m.active);
        if (slot !== -1) {
          meteorsRef.current[slot] = spawnMeteor(canvas.width, canvas.height);
        }
        nextMeteorIn = 4 + Math.random() * 6;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x - 0.5; // -0.5~0.5
      const my = mouseRef.current.y - 0.5;

      // 绘制三层星星
      for (const star of starsRef.current) {
        const parallaxStrength = star.layer === 0 ? 6 : star.layer === 1 ? 16 : 30;
        const px = star.x + mx * parallaxStrength;
        const py = star.y + my * parallaxStrength;

        // 缓慢漂移
        star.x += star.vx;
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;

        const flicker = Math.sin(time * star.speed * 8 + star.phase) * 0.3 + 0.7;
        const alpha = star.opacity * flicker;

        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${alpha})`;
        ctx.fill();

        // 近景大星加晕圈
        if (star.layer === 2) {
          ctx.beginPath();
          ctx.arc(px, py, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 168, 76, ${alpha * 0.08})`;
          ctx.fill();
        }
      }

      // 绘制流星
      for (const m of meteorsRef.current) {
        if (!m.active) continue;
        m.life += dt / 1.2; // 1.2s 生命周期
        m.x += m.vx;
        m.y += m.vy;
        m.alpha = m.life < 0.2 ? m.life / 0.2 : 1 - (m.life - 0.2) / 0.8;
        if (m.life >= 1) { m.active = false; continue; }

        const tailX = m.x - m.vx * (m.length / Math.hypot(m.vx, m.vy));
        const tailY = m.y - m.vy * (m.length / Math.hypot(m.vx, m.vy));
        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, `rgba(201,168,76,0)`);
        grad.addColorStop(1, `rgba(240,220,160,${m.alpha * 0.9})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
}
