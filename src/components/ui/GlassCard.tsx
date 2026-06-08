import { forwardRef } from "react";
import clsx from "clsx";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "subtle";
  goldBorder?: "top" | "full" | "none";
  padding?: "none" | "sm" | "md" | "lg";
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      variant = "default",
      goldBorder = "none",
      padding = "md",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "rounded-2xl relative overflow-hidden",
          variant === "default" && "glass-card",
          variant === "elevated" &&
            "glass-card shadow-[0_16px_48px_rgba(0,0,0,0.4)]",
          variant === "subtle" &&
            "bg-midnight/30 border border-gold-400/[0.05]",
          goldBorder === "top" &&
            "before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-gold-400/40 before:to-transparent",
          goldBorder === "full" && "border border-gold-400/20",
          padding === "sm" && "p-4",
          padding === "md" && "p-6",
          padding === "lg" && "p-8",
          padding === "none" && "p-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
export default GlassCard;
