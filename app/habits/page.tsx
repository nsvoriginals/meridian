import { prisma } from "@/lib/prisma";
import HabitCalendar from "@/components/HabitCalendar";
import HabitButton from "@/components/HabitButton";
import { HabitType } from "@prisma/client";
import { Activity } from "lucide-react";

export const dynamic = "force-dynamic";

function computeStreaks(logs: { date: string; done: boolean }[]) {
  const doneDates = new Set(logs.filter(l => l.done).map(l => l.date));
  const today = new Date();
  let currentStreak = 0;
  let tempStreak = 0;
  let longestStreak = 0;

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (doneDates.has(key)) {
      if (i === 0 || currentStreak > 0) currentStreak++;
    } else break;
  }

  const sorted = [...doneDates].sort();
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) { tempStreak = 1; }
    else {
      const diff = (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) / 86400000;
      tempStreak = diff === 1 ? tempStreak + 1 : 1;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }
  return { currentStreak, longestStreak };
}

export default async function HabitsPage() {
  const today = new Date().toISOString().split("T")[0];

  const [boxingLogs, guitarLogs, boxingToday, guitarToday] = await Promise.all([
    prisma.habitLog.findMany({ where: { habitType: HabitType.BOXING }, select: { date: true, done: true } }),
    prisma.habitLog.findMany({ where: { habitType: HabitType.GUITAR }, select: { date: true, done: true } }),
    prisma.habitLog.findUnique({ where: { habitType_date: { habitType: HabitType.BOXING, date: today } } }),
    prisma.habitLog.findUnique({ where: { habitType_date: { habitType: HabitType.GUITAR, date: today } } }),
  ]);

  const boxing = computeStreaks(boxingLogs);
  const guitar = computeStreaks(guitarLogs);

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity size={22} className="text-white/50" />
            <h1 className="text-5xl font-mono font-black text-white tracking-tight leading-none">
              Habits
            </h1>
          </div>
          <p className="text-base font-mono text-white/35 ml-1">
            26 weeks of history — click any past cell to toggle
          </p>
        </div>

        {/* Today quick-log buttons */}
        <div className="flex gap-3">
          <HabitButton type={HabitType.BOXING} initialDone={boxingToday?.done ?? false} today={today} />
          <HabitButton type={HabitType.GUITAR} initialDone={guitarToday?.done ?? false} today={today} />
        </div>
      </div>

      {/* Two calendars side-by-side, each filling half the width */}
      <div className="grid grid-cols-2 gap-6">
        <HabitCalendar
          habitType={HabitType.BOXING}
          label="Boxing"
          color="#ef4444"
          logs={boxingLogs}
          currentStreak={boxing.currentStreak}
          longestStreak={boxing.longestStreak}
          totalDone={boxingLogs.filter(l => l.done).length}
        />
        <HabitCalendar
          habitType={HabitType.GUITAR}
          label="Guitar"
          color="#f59e0b"
          logs={guitarLogs}
          currentStreak={guitar.currentStreak}
          longestStreak={guitar.longestStreak}
          totalDone={guitarLogs.filter(l => l.done).length}
        />
      </div>
    </div>
  );
}
