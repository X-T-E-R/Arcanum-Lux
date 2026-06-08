"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface GoldButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export default function GoldButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  ...props
}: GoldButtonProps) {
  return (
    <motion.button
      className={clsx(
        "relative font-ui font-medium rounded-xl transition-all duration-300 overflow-hidden",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        size === "sm" && "px-4 py-2 text-xs tracking-[0.12em]",
        size === "md" && "px-6 py-3 text-sm tracking-[0.1em]",
        size === "lg" && "px-8 py-4 text-sm tracking-[0.15em]",
        variant === "primary" && [
          // 深色底 + 金色描边 + 内发光，比纯黄渐变高级得多
          "bg-[rgba(201,168,76,0.06)] text-gold-300",
          "border border-gold-400/40",
          "hover:bg-[rgba(201,168,76,0.10)] hover:border-gold-400/70 hover:text-gold-200",
          "hover:shadow-[0_0_24px_rgba(201,168,76,0.15),inset_0_0_20px_rgba(201,168,76,0.04)]",
          "active:shadow-[0_0_8px_rgba(201,168,76,0.1)]",
        ],
        variant === "secondary" && [
          "bg-transparent text-gold-400/60",
          "border border-gold-400/15 hover:border-gold-400/35",
          "hover:text-gold-300 hover:bg-gold-400/[0.04]",
        ],
        variant === "ghost" && [
          "bg-transparent text-gold-200/40 border-0",
          "hover:text-gold-300 hover:bg-gold-400/[0.03]",
        ],
        className
      )}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      disabled={disabled || loading}
      {...(props as Record<string, unknown>)}
    >
      {/* primary: 扫光线 */}
      {variant === "primary" && !disabled && (
        <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          <span className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-gold-200/10 to-transparent animate-[gold-sweep_5s_ease-in-out_infinite]" />
        </span>
      )}

      <span className="relative flex items-center justify-center gap-2">
        {loading && (
          <motion.span
            className="w-3.5 h-3.5 border border-current/40 border-t-current rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        )}
        {children}
      </span>
    </motion.button>
  );
}
