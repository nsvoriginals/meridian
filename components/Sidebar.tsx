"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Code2,
  Server,
  Brain,
  Coins,
  Activity,
  Terminal,
  Rss,
} from "lucide-react";

const navItems = [
  { href: "/",               label: "Dashboard", icon: LayoutDashboard, color: "" },
  { href: "/domain/fullstack", label: "Full Stack", icon: Code2,  color: "#3b82f6" },
  { href: "/domain/devops",    label: "DevOps",     icon: Server, color: "#10b981" },
  { href: "/domain/ai",        label: "AI",         icon: Brain,  color: "#8b5cf6" },
  { href: "/domain/web3",      label: "Web3",       icon: Coins,  color: "#f59e0b" },
  { href: "/habits",           label: "Habits",     icon: Activity, color: "" },
  { href: "/feed",             label: "Trend Feed", icon: Rss,    color: "#ec4899" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0e0e0e] border-r border-white/[0.06] flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center">
            <Terminal size={16} className="text-white/60" />
          </div>
          <div>
            <span className="font-mono text-sm font-bold tracking-widest text-white uppercase">
              Life OS
            </span>
            <p className="text-[10px] font-mono text-white/25 tracking-wider">
              learning system
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, color }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-mono transition-all duration-150 group relative ${
                active
                  ? "text-white"
                  : "text-white/35 hover:text-white/75 hover:bg-white/[0.04]"
              }`}
              style={
                active
                  ? {
                      backgroundColor: color ? color + "18" : "rgba(255,255,255,0.07)",
                      boxShadow: color
                        ? `inset 0 0 0 1px ${color}30`
                        : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                    }
                  : {}
              }
            >
              <Icon
                size={17}
                style={{ color: active ? (color || "rgba(255,255,255,0.85)") : undefined }}
              />
              <span className="tracking-wide font-medium">{label}</span>
              {active && color && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/[0.06]">
        <p className="text-[11px] font-mono text-white/20">v1.0.0</p>
      </div>
    </aside>
  );
}
