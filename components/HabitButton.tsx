"use client";

import { useTransition, useState } from "react";
import { logHabit } from "@/actions/habits";
import { HabitType } from "@prisma/client";
import { Dumbbell, Music, CheckCircle2, Circle, Loader2 } from "lucide-react";

interface HabitButtonProps {
  type: HabitType;
  initialDone: boolean;
  today: string;
}

const CONFIG = {
  BOXING: { label: "Boxing",  icon: Dumbbell, color: "#ef4444", bg: "#ef444410", activeBg: "#ef444425" },
  GUITAR: { label: "Guitar",  icon: Music,    color: "#f59e0b", bg: "#f59e0b10", activeBg: "#f59e0b25" },
};

export default function HabitButton({ type, initialDone, today }: HabitButtonProps) {
  const [done, setDone]               = useState(initialDone);
  const [isPending, startTransition]  = useTransition();
  const cfg  = CONFIG[type];
  const Icon = cfg.icon;

  function handleClick() {
    const next = !done;
    setDone(next);
    startTransition(() => logHabit(type, today, next));
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center gap-4 px-5 py-4.5 rounded-2xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] w-full"
      style={{
        borderColor:     done ? cfg.color + "55" : "rgba(255,255,255,0.07)",
        backgroundColor: done ? cfg.activeBg      : cfg.bg,
        boxShadow:       done ? `0 0 20px ${cfg.color}20` : "none",
      }}
    >
      <div
        className="p-2.5 rounded-xl"
        style={{ backgroundColor: cfg.color + "20" }}
      >
        <Icon size={22} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 text-left">
        <p className="text-base font-mono font-bold text-white/85">{cfg.label}</p>
        <p className="text-sm font-mono text-white/35 mt-0.5">
          {done ? "Done today ✓" : "Not logged yet"}
        </p>
      </div>
      {isPending ? (
        <Loader2 size={20} className="text-white/30 animate-spin" />
      ) : done ? (
        <CheckCircle2 size={22} style={{ color: cfg.color }} />
      ) : (
        <Circle size={22} className="text-white/15" />
      )}
    </button>
  );
}
