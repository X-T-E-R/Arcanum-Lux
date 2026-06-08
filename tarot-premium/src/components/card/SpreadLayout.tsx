"use client";

import { motion } from "framer-motion";
import TarotCard from "./TarotCard";
import type { DrawnCard, SpreadPosition } from "@/types/card";

interface SpreadLayoutProps {
  drawnCards: DrawnCard[];
  positions: SpreadPosition[];
  onCardClick?: (index: number) => void;
  cardSize?: "sm" | "md" | "lg";
}

export default function SpreadLayout({
  drawnCards,
  positions,
  onCardClick,
  cardSize = "md",
}: SpreadLayoutProps) {
  return (
    <div className="relative w-full flex items-center justify-center min-h-[400px]">
      {drawnCards.map((card, i) => {
        const pos = positions[i];
        if (!pos) return null;
        return (
          <motion.div
            key={card.positionIndex}
            className="absolute"
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px)`,
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: i * 0.2,
              type: "spring",
              stiffness: 80,
              damping: 20,
            }}
          >
            <div
              style={{
                transform: pos.rotation
                  ? `rotate(${pos.rotation}deg)`
                  : undefined,
              }}
            >
              <TarotCard
                drawnCard={card}
                size={cardSize}
                delay={i * 0.1}
                onClick={() => onCardClick?.(i)}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
