"use client";

import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  delay: number;
}

export default function GoldParticles({
  count = 30,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resize();

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      size: Math.random() * 2 + 0.5,
      life: Math.random() * 200,
      maxLife: Math.random() * 200 + 100,
      delay: Math.random() * 100,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.life++;
        if (p.life < p.delay) continue;

        const progress = (p.life - p.delay) / p.maxLife;
        if (progress > 1) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.life = 0;
          p.delay = Math.random() * 60;
          continue;
        }

        p.x += p.vx + Math.sin(p.life * 0.02) * 0.2;
        p.y += p.vy;

        const alpha = progress < 0.2
          ? progress / 0.2
          : progress > 0.8
            ? (1 - progress) / 0.2
            : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${alpha * 0.6})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${alpha * 0.08})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
}
