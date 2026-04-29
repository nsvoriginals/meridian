"use client";

import { useState, useTransition } from "react";
import { toggleHabitDay } from "@/actions/habits";
import { HabitType } from "@prisma/client";
import { Flame, Trophy, TrendingUp, Calendar } from "lucide-react";

interface HabitCalendarProps {
  habitType: HabitType;
  label: string;
  color: string;
  logs: { date: string; done: boolean }[];
  currentStreak: number;
  longestStreak: number;
  totalDone: number;
}

const TOTAL_DAYS = 112; // 16 weeks — fits comfortably in half-width
const CELL = 16;
const GAP = 2;
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DOW_LABELS = ["S","M","T","W","T","F","S"];

function getDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

export default function HabitCalendar({
  habitType,
  label,
  color,
  logs,
  currentStreak,
  longestStreak,
  totalDone,
}: HabitCalendarProps) {
  const allDays = getDays(TOTAL_DAYS);
  const logMap = new Map(logs.map((l) => [l.date, l.done]));
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<Map<string, boolean>>(new Map());

  const today = new Date().toISOString().split("T")[0];

  function isDone(date: string) {
    if (optimistic.has(date)) return optimistic.get(date)!;
    return logMap.get(date) ?? false;
  }

  function handleClick(date: string) {
    if (date > today) return;
    const cur = isDone(date);
    setOptimistic((prev) => new Map(prev).set(date, !cur));
    startTransition(() => toggleHabitDay(habitType, date));
  }

  // Stats
  const last30 = allDays.slice(-30);
  const done30 = last30.filter((d) => isDone(d)).length;
  const rate30 = Math.round((done30 / 30) * 100);
  const thisWeekDays = allDays.slice(-7);
  const thisWeekDone = thisWeekDays.filter((d) => isDone(d)).length;

  // Weeks grid
  const weeks: string[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  // Month labels
  const monthLabels: { label: string; col: number }[] = [];
  weeks.forEach((week, wi) => {
    const d = new Date(week[0]);
    if (wi === 0 || d.getDate() <= 7) {
      const lbl = MONTHS[d.getMonth()];
      if (!monthLabels.find((m) => m.label === lbl)) {
        monthLabels.push({ label: lbl, col: wi });
      }
    }
  });

  // Day-of-week pattern
  const dowDone = [0, 0, 0, 0, 0, 0, 0];
  const dowTotal = [0, 0, 0, 0, 0, 0, 0];
  allDays.forEach((d) => {
    if (d > today) return;
    const dow = new Date(d).getDay();
    dowTotal[dow]++;
    if (isDone(d)) dowDone[dow]++;
  });

  return (
    <div className="bg-[#111111] border border-white/8 rounded-2xl p-7 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-lg font-bold text-white tracking-tight">{label}</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-sm text-white/50">
            <Flame size={15} style={{ color }} />
            <span>
              <span className="text-white font-bold text-base">{currentStreak}</span>
              <span className="text-white/40 ml-1">day streak</span>
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-sm text-white/50">
            <Trophy size={15} className="text-yellow-400/70" />
            <span>
              Best <span className="text-white font-bold text-base">{longestStreak}</span>
              <span className="text-white/40 ml-1">days</span>
            </span>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Calendar,    label: "Total done",   value: totalDone, suffix: "days" },
          { icon: TrendingUp,  label: "30-day rate",  value: rate30,    suffix: "%"    },
          { icon: Flame,       label: "This week",    value: thisWeekDone, suffix: "/ 7" },
          { icon: Trophy,      label: "Longest",      value: longestStreak, suffix: "days" },
        ].map(({ icon: Icon, label: lbl, value, suffix }) => (
          <div
            key={lbl}
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 space-y-1"
          >
            <div className="flex items-center gap-1.5">
              <Icon size={11} className="text-white/25" />
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{lbl}</p>
            </div>
            <p className="font-mono font-bold text-2xl text-white leading-none">
              {value}
              <span className="text-xs font-normal text-white/30 ml-1">{suffix}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Month labels */}
          <div className="flex mb-2" style={{ gap: GAP }}>
            {weeks.map((_, wi) => {
              const ml = monthLabels.find((m) => m.col === wi);
              return (
                <div key={wi} style={{ width: CELL }} className="text-center shrink-0">
                  {ml && (
                    <span className="text-[10px] font-mono text-white/30">{ml.label}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cell grid */}
          <div className="flex" style={{ gap: GAP }}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col shrink-0" style={{ gap: GAP }}>
                {week.map((date) => {
                  const done = isDone(date);
                  const isToday = date === today;
                  const isFuture = date > today;
                  return (
                    <button
                      key={date}
                      onClick={() => handleClick(date)}
                      disabled={pending || isFuture}
                      title={`${date}${done ? " ✓" : ""}`}
                      style={{
                        width: CELL,
                        height: CELL,
                        backgroundColor: done ? color : "rgba(255,255,255,0.05)",
                        opacity: isFuture ? 0.15 : 1,
                        boxShadow: done && !isFuture ? `0 0 8px ${color}55` : "none",
                      }}
                      className={`rounded-[3px] transition-all duration-100 ${
                        isFuture
                          ? "cursor-default"
                          : "hover:scale-125 hover:brightness-125 cursor-pointer"
                      } ${isToday ? "ring-2 ring-white/50 ring-offset-1 ring-offset-[#111111]" : ""}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day-of-week pattern */}
      <div>
        <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">
          Day pattern — which days you show up most
        </p>
        <div className="flex gap-2 items-end">
          {DOW_LABELS.map((day, i) => {
            const pct = dowTotal[i] > 0 ? dowDone[i] / dowTotal[i] : 0;
            const barH = Math.max(3, Math.round(pct * 48));
            return (
              <div key={`${day}-${i}`} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end justify-center" style={{ height: 48 }}>
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: barH,
                      backgroundColor: color,
                      opacity: pct > 0 ? 0.25 + pct * 0.75 : 0.08,
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono text-white/30">{day}</span>
                <span className="text-[10px] font-mono" style={{ color: pct > 0.6 ? color : "rgba(255,255,255,0.25)" }}>
                  {Math.round(pct * 100)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2.5 text-[10px] font-mono text-white/25 pt-1 border-t border-white/[0.04]">
        <span>Less</span>
        {[0.12, 0.3, 0.55, 0.8, 1].map((o) => (
          <div
            key={o}
            className="w-3.5 h-3.5 rounded-[3px]"
            style={{
              backgroundColor: color,
              opacity: o,
              boxShadow: o > 0.7 ? `0 0 6px ${color}55` : "none",
            }}
          />
        ))}
        <span>More</span>
        <span className="ml-auto text-white/15">Click any past cell to toggle</span>
      </div>
    </div>
  );
}
