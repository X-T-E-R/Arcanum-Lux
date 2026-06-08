"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChartBar, Users, Gear, Megaphone, CreditCard,
  SignOut, ShieldCheck, List, X,
} from "@phosphor-icons/react";

const NAV = [
  { href: "/admin",               label: "统计看板",  icon: ChartBar },
  { href: "/admin/stats",         label: "数据统计",  icon: ChartBar },
  { href: "/admin/users",         label: "用户管理",  icon: Users },
  { href: "/admin/config",        label: "系统配置",  icon: Gear },
  { href: "/admin/content",       label: "内容管理",  icon: Megaphone },
  { href: "/admin/subscriptions", label: "方案管理",  icon: CreditCard },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Sidebar = () => (
    <aside className="w-56 shrink-0 min-h-screen bg-abyss/80 border-r border-gold-400/[0.06] flex flex-col py-6 px-3">
      <div className="flex items-center gap-2 px-3 mb-8">
        <ShieldCheck size={18} className="text-gold-400/60" />
        <span className="font-display text-sm tracking-[0.2em] text-gold-400/60">ADMIN</span>
      </div>
      <nav className="flex-1 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-ui transition-all duration-200 ${
                active
                  ? "bg-gold-400/10 text-gold-200 border border-gold-400/20"
                  : "text-gold-200/40 hover:text-gold-200/70 hover:bg-gold-400/[0.04]"
              }`}>
              <Icon size={16} weight={active ? "fill" : "regular"} />
              {label}
            </Link>
          );
        })}
      </nav>
      <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-ui text-gold-200/30 hover:text-gold-200/60 transition-colors">
        <SignOut size={16} />退出管理
      </Link>
    </aside>
  );

  return (
    <div className="min-h-screen bg-void flex">
      {/* 桌面侧边栏 */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* 移动侧边栏 */}
      {sidebarOpen && (
        <motion.div className="fixed inset-0 z-50 flex md:hidden"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-void/80" onClick={() => setSidebarOpen(false)} />
          <motion.div className="relative z-10 flex"
            initial={{ x: -224 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <Sidebar />
          </motion.div>
        </motion.div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* 移动顶栏 */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-gold-400/[0.06]">
          <button onClick={() => setSidebarOpen(true)} className="text-gold-400/40">
            <List size={20} />
          </button>
          <span className="font-display text-xs tracking-[0.2em] text-gold-400/40">ADMIN</span>
        </div>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
