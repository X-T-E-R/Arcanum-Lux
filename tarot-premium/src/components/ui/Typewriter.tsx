"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  cursor?: boolean;
}

export default function Typewriter({
  text,
  speed = 35,
  className = "",
  onComplete,
  cursor = true,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let index = 0;

    const interval = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {cursor && !done && (
        <motion.span
          className="inline-block w-0.5 h-[1em] bg-gold-400/60 ml-0.5 align-text-bottom"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </span>
  );
}
