"use client";

import { motion } from "framer-motion";
import { cardBackImagePath } from "@/lib/assets";

interface CardDeckProps {
  phase: "idle" | "shuffling" | "fanned";
  cardCount?: number;
}

export default function CardDeck({ phase, cardCount = 10 }: CardDeckProps) {
  const cards = Array.from({ length: cardCount }, (_, i) => i);
  // 单张牌尺寸：w-24 h-36 (96x144px)
  const W = 96, H = 144;

  return (
    <div className="relative w-[480px] h-[360px] flex items-center justify-center">
      {cards.map((i) => {
        const idleX = (i - cardCount / 2) * 1.2;
        const idleY = -i * 2;
        const idleRotate = (i - cardCount / 2) * 0.4;

        const isLeft = i < cardCount / 2;
        const shuffleX = isLeft ? -50 - Math.random() * 30 : 50 + Math.random() * 30;
        const shuffleY = -i * 3 - Math.random() * 12;
        const shuffleRotate = isLeft ? -10 - Math.random() * 6 : 10 + Math.random() * 6;

        const fanAngle = ((i / (cardCount - 1)) - 0.5) * 80;
        const fanRad = (fanAngle * Math.PI) / 180;
        const fanX = Math.sin(fanRad) * 200;
        const fanY = -Math.cos(fanRad) * 200 + 200;

        let tX: number, tY: number, tR: number;
        if (phase === "idle")         { tX = idleX;    tY = idleY;    tR = idleRotate;    }
        else if (phase === "shuffling"){ tX = shuffleX; tY = shuffleY; tR = shuffleRotate; }
        else                          { tX = fanX;     tY = fanY;     tR = fanAngle;      }

        return (
          <motion.div
            key={i}
            className="absolute overflow-hidden rounded-md border border-gold-400/20 shadow-lg"
            style={{ width: W, height: H, zIndex: i }}
            animate={{ x: tX, y: tY, rotate: tR }}
            transition={{
              type: "spring",
              stiffness: phase === "shuffling" ? 200 : 120,
              damping: phase === "shuffling" ? 15 : 20,
              delay: phase === "fanned" ? i * 0.04 : Math.random() * 0.15,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cardBackImagePath()}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
