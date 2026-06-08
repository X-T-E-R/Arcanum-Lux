"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import {
  MagicWand,
  ImageSquare,
  Sun,
  Clock,
  UserCircle,
  GearSix,
} from "@phosphor-icons/react";
import { ROUTES } from "@/lib/constants";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: ROUTES.reading, label: "占卜", icon: MagicWand },
  { href: ROUTES.gallery, label: "画廊", icon: ImageSquare },
  { href: ROUTES.daily, label: "每日", icon: Sun },
  { href: ROUTES.history, label: "历史", icon: Clock },
  { href: ROUTES.profile, label: "我的", icon: UserCircle },
];

const MOBILE_NAV_ITEMS = [
  ...NAV_ITEMS,
  { href: ROUTES.settings, label: "设置", icon: GearSix },
];

export default function TopNav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Skip nav on landing page
  if (pathname === "/") return null;

  return (
    <>
      {/* Desktop top nav with scroll-hide */}
      <motion.header
        className="hidden md:flex fixed top-0 left-0 right-0 z-40 h-16 items-center justify-between px-6 border-b border-gold-400/[0.06] glass"
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Link
          href="/"
          className="font-display text-lg tracking-[0.3em] text-gold-400/60 hover:text-gold-400 transition-colors"
        >
          ARCANUM
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-ui transition-all duration-200",
                  active
                    ? "text-gold-300 bg-gold-400/[0.08]"
                    : "text-gold-200/40 hover:text-gold-300 hover:bg-gold-400/[0.04]"
                )}
              >
                <Icon size={18} weight={active ? "fill" : "regular"} />
                <span>{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gold-400/40 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

          <Link
            href={ROUTES.settings}
            className="px-3 py-1.5 rounded-lg text-xs font-ui text-gold-400/50 hover:text-gold-400 border border-gold-400/10 hover:border-gold-400/30 transition-all"
          >
            设置
          </Link>
      </motion.header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-gold-400/[0.06]">
        <div className="flex items-center justify-around h-16 px-2">
          {MOBILE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all",
                  active ? "text-gold-300" : "text-gold-200/30"
                )}
              >
                <Icon
                  size={22}
                  weight={active ? "fill" : "regular"}
                  className={active ? "text-gold-400" : ""}
                />
                <span className="text-[10px] font-ui">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
