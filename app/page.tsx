import { prisma } from "@/lib/prisma";
import DomainCard from "@/components/DomainCard";
import HabitButton from "@/components/HabitButton";
import { HabitType } from "@prisma/client";
import {
  CalendarDays, Activity, CheckCircle2,
  TrendingUp, BookOpen, Target, Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

function getToday() {
  return new Date().toISOString().split("T")[0];
}
function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

export default async function DashboardPage() {
  const today = getToday();

  const [domains, boxingLog, guitarLog, recentTopics] = await Promise.all([
    prisma.learningDomain.findMany({
      include: { topics: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.habitLog.findUnique({
      where: { habitType_date: { habitType: HabitType.BOXING, date: today } },
    }),
    prisma.habitLog.findUnique({
      where: { habitType_date: { habitType: HabitType.GUITAR, date: today } },
    }),
    prisma.topic.findMany({
      where: { completed: true },
      orderBy: { updatedAt: "desc" },
      take: 8,
      include: { domain: true },
    }),
  ]);

  const totalTopics = domains.reduce((s, d) => s + d.topics.length, 0);
  const totalDone   = domains.reduce((s, d) => s + d.topics.filter(t => t.completed).length, 0);
  const overallPct  = totalTopics > 0 ? Math.round((totalDone / totalTopics) * 100) : 0;
  const habitsDone  = [boxingLog, guitarLog].filter(l => l?.done).length;

  return (
    <div className="space-y-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-mono font-black text-white tracking-tight leading-none mb-3">
            Life OS
          </h1>
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-white/30" />
            <p className="text-base font-mono text-white/40">{formatDate(new Date())}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-sm text-white/50 bg-white/[0.04] border border-white/[0.08] px-5 py-3 rounded-xl">
          <Activity size={14} className="text-emerald-400" />
          <span>System online</span>
        </div>
      </div>

      {/* ── Stats — full width 4-col ── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: BookOpen,   label: "Topics done",     value: totalDone,            sub: `of ${totalTopics} total`,  color: "#3b82f6" },
          { icon: Target,     label: "Overall progress", value: `${overallPct}%`,     sub: "across all domains",       color: "#8b5cf6" },
          { icon: TrendingUp, label: "Domains active",   value: domains.length,       sub: "learning paths",           color: "#10b981" },
          { icon: Zap,        label: "Habits today",     value: `${habitsDone} / 2`,  sub: "boxing · guitar",          color: "#f59e0b" },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div
            key={label}
            className="bg-[#111111] border border-white/[0.07] rounded-2xl px-6 py-6"
            style={{ boxShadow: `0 0 0 1px ${color}20, inset 0 1px 0 ${color}15` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: color + "20" }}>
                <Icon size={16} style={{ color }} />
              </div>
              <p className="text-xs font-mono text-white/40 uppercase tracking-widest">{label}</p>
            </div>
            <p className="text-4xl font-mono font-black text-white leading-none mb-1">{value}</p>
            <p className="text-sm font-mono text-white/30 mt-2">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Domain cards — full width 4-col ── */}
      <div>
        <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-white/30 mb-5">
          Learning Paths
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {domains.map(domain => {
            const completed = domain.topics.filter(t => t.completed).length;
            return (
              <DomainCard
                key={domain.id}
                id={domain.id}
                title={domain.title}
                description={domain.description}
                coverKeyword={domain.coverKeyword}
                color={domain.color}
                completedTopics={completed}
                totalTopics={domain.topics.length}
              />
            );
          })}
        </div>
      </div>

      {/* ── Bottom: habits (narrow) + recent completions (wide) ── */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 2fr" }}>

        {/* Habits */}
        <div>
          <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-white/30 mb-5">
            Daily Habits
          </h2>
          <div className="space-y-3">
            <HabitButton type={HabitType.BOXING} initialDone={boxingLog?.done ?? false} today={today} />
            <HabitButton type={HabitType.GUITAR} initialDone={guitarLog?.done ?? false} today={today} />
          </div>
        </div>

        {/* Recent completions */}
        <div>
          <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-white/30 mb-5">
            Recent Completions
          </h2>
          <div className="bg-[#111111] border border-white/[0.07] rounded-2xl overflow-hidden">
            {recentTopics.length === 0 ? (
              <p className="px-6 py-10 text-base font-mono text-white/25 text-center">
                No completed topics yet
              </p>
            ) : (
              <div className="grid grid-cols-2">
                {recentTopics.map(topic => (
                  <div
                    key={topic.id}
                    className="flex items-start gap-3.5 px-5 py-4 border-b border-r border-white/[0.05] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0"
                      style={{ color: topic.domain.color }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-mono font-semibold text-white/80 truncate">{topic.title}</p>
                      <p className="text-xs font-mono text-white/30 mt-1">{topic.domain.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
