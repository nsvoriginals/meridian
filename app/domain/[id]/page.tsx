import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TopicList from "@/components/TopicList";
import ProjectList from "@/components/ProjectList";
import ProgressBar from "@/components/ProgressBar";
import { BookOpen, FolderKanban, CheckCircle2, Circle } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DomainPage({ params }: PageProps) {
  const { id } = await params;

  const domain = await prisma.learningDomain.findUnique({
    where: { id },
    include: {
      topics:   { orderBy: { order: "asc" } },
      projects: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!domain) notFound();

  const completedCount = domain.topics.filter(t => t.completed).length;
  const totalCount     = domain.topics.length;
  const pct            = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const doneProjects   = domain.projects.filter(p => p.status === "DONE").length;

  return (
    <div className="space-y-10">

      {/* ── Full-width banner ── */}
      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{ boxShadow: `0 0 0 1px ${domain.color}30, 0 16px 64px rgba(0,0,0,0.5)` }}
      >
        <div className="h-72 relative">
          <img
            src={`https://picsum.photos/seed/${encodeURIComponent(domain.coverKeyword)}/1600/500`}
            alt={domain.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${domain.color}70 0%, rgba(10,10,10,0.95) 60%)`,
            }}
          />
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          {/* Top: stat pills */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: domain.color, boxShadow: `0 0 16px ${domain.color}` }}
              />
              <span className="font-mono text-sm text-white/50 uppercase tracking-widest">
                Domain
              </span>
            </div>
            <div className="flex items-center gap-3">
              {[
                { label: "Topics",    value: `${completedCount}/${totalCount}` },
                { label: "Projects",  value: `${doneProjects}/${domain.projects.length}` },
                { label: "Progress",  value: `${pct}%` },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="px-4 py-2 rounded-xl font-mono text-sm border"
                  style={{ borderColor: domain.color + "40", backgroundColor: domain.color + "15", color: domain.color }}
                >
                  <span className="text-white/40 text-xs mr-1.5">{label}</span>
                  <span className="font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: title + description + progress bar */}
          <div>
            <h1 className="text-6xl font-mono font-black text-white tracking-tight leading-none mb-4">
              {domain.title}
            </h1>
            <p className="text-base font-mono text-white/50 leading-relaxed mb-6 max-w-3xl">
              {domain.description}
            </p>
            <ProgressBar value={completedCount} max={totalCount} color={domain.color} showLabel />
          </div>
        </div>
      </div>

      {/* ── Content: topics (wider) + projects (narrower) ── */}
      <div className="grid gap-8" style={{ gridTemplateColumns: "3fr 2fr" }}>

        {/* Topics */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={18} style={{ color: domain.color }} />
            <span className="text-base font-mono font-bold text-white uppercase tracking-widest">
              Curriculum
            </span>
            <div className="flex-1 h-px bg-white/[0.05] ml-2" />
            <span className="text-sm font-mono" style={{ color: domain.color }}>
              {completedCount} / {totalCount}
            </span>
          </div>
          <TopicList topics={domain.topics} domainId={domain.id} color={domain.color} />
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <FolderKanban size={18} style={{ color: domain.color }} />
            <span className="text-base font-mono font-bold text-white uppercase tracking-widest">
              Projects
            </span>
            <div className="flex-1 h-px bg-white/[0.05] ml-2" />
            <span className="text-sm font-mono text-white/35">
              {doneProjects} / {domain.projects.length}
            </span>
          </div>
          <ProjectList projects={domain.projects} domainId={domain.id} color={domain.color} />
        </div>
      </div>
    </div>
  );
}
