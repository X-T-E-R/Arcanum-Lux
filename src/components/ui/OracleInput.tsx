"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface OracleInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  multiline?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export default function OracleInput({
  value, onChange, onSubmit,
  placeholder = "写下来……",
  multiline = false,
  autoFocus = false,
  className,
}: OracleInputProps) {
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSubmit();
    }
  };

  const sharedClass = clsx(
    "w-full bg-transparent border-0 border-b border-gold-400/30 focus:border-gold-400/60",
    "text-gold-100 font-body text-lg leading-relaxed",
    "placeholder:text-gold-200/20 focus:outline-none",
    "transition-colors duration-300 pb-2",
    "resize-none",
    className
  );

  return (
    <motion.div
      className="relative w-full max-w-[480px] mx-auto"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {multiline ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={3}
          className={sharedClass}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKey}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type="text"
          className={sharedClass}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKey}
        />
      )}
      {/* 聚焦时底线光晕 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gold-400/60 origin-center"
        initial={{ scaleX: 0 }}
        whileFocus={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
