"use client";

import { motion } from "framer-motion";
import { cardBackImagePath } from "@/lib/assets";

const ORBIT_CARDS = [
  { delay: 0,   duration: 32, radius: 240, w: 72,  h: 108, rotation: -15, label: "I"    },
  { delay: -5,  duration: 40, radius: 290, w: 60,  h: 90,  rotation:  10, label: "XVII" },
  { delay: -10, duration: 48, radius: 210, w: 52,  h: 78,  rotation:  -8, label: "XXI"  },
  { delay: -15, duration: 36, radius: 270, w: 60,  h: 90,  rotation:  20, label: "VIII" },
  { delay: -20, duration: 44, radius: 310, w: 56,  h: 84,  rotation:  -5, label: "XIII" },
];

export default function FloatingCards() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
        {ORBIT_CARDS.map((card, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{ marginLeft: -card.w / 2, marginTop: -card.h / 2 }}
            animate={{ rotate: 360 }}
            transition={{ duration: card.duration, repeat: Infinity, ease: "linear", delay: card.delay }}
          >
            {/* 反向旋转抵消自转，保持卡牌朝向不变 */}
            <motion.div
              style={{ transform: `translateX(${card.radius}px)` }}
              animate={{ rotate: -360 }}
              transition={{ duration: card.duration, repeat: Infinity, ease: "linear", delay: card.delay }}
            >
              {/* 轻微随机摆动 */}
              <motion.div
                animate={{ rotate: [card.rotation - 3, card.rotation + 3, card.rotation - 3] }}
                transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: "easeInOut" }}
              >
                <div
                  className="rounded-md overflow-hidden border border-gold-400/20 backdrop-blur-sm relative"
                  style={{ width: card.w, height: card.h }}
                >
                  {/* 真实牌背图 */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cardBackImagePath()}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                    draggable={false}
                  />
                  {/* 罗马数字叠加 */}
                  <div className="absolute inset-0 flex items-end justify-center pb-1">
                    <span className="text-gold-400/50 font-display" style={{ fontSize: 8 }}>
                      {card.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
