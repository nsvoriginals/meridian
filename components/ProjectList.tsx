"use client";

import { useState, useTransition } from "react";
import { updateProjectStatus, addProject } from "@/actions/projects";
import { ProjectStatus } from "@prisma/client";
import { Plus, Loader2, Circle, Timer, CheckCircle2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
}

interface ProjectListProps {
  projects: Project[];
  domainId: string;
  color: string;
}

const STATUS_CONFIG = {
  TODO:        { label: "Todo",        icon: Circle,      className: "text-white/40 border-white/15 bg-white/[0.04]" },
  IN_PROGRESS: { label: "In Progress", icon: Timer,       className: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
  DONE:        { label: "Done",        icon: CheckCircle2, className: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
};

const STATUS_CYCLE: ProjectStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

function ProjectRow({ project }: { project: Project }) {
  const [isPending, startTransition] = useTransition();
  const cfg  = STATUS_CONFIG[project.status];
  const Icon = cfg.icon;

  function handleCycle() {
    const idx  = STATUS_CYCLE.indexOf(project.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    startTransition(() => updateProjectStatus(project.id, next));
  }

  return (
    <div className="flex items-start gap-3.5 px-5 py-4 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-mono font-semibold text-white/80 leading-snug">
          {project.title}
        </p>
        {project.description && (
          <p className="text-xs font-mono text-white/35 mt-1 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}
      </div>
      <button
        onClick={handleCycle}
        disabled={isPending}
        className={`shrink-0 flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-lg border transition-all hover:opacity-80 ${cfg.className}`}
      >
        {isPending ? <Loader2 size={11} className="animate-spin" /> : <Icon size={11} />}
        {cfg.label}
      </button>
    </div>
  );
}

export default function ProjectList({ projects, domainId }: ProjectListProps) {
  const [title,    setTitle]    = useState("");
  const [desc,     setDesc]     = useState("");
  const [isAdding, startAdding] = useTransition();
  const [showForm, setShowForm] = useState(false);

  async function handleAdd() {
    if (!title.trim()) return;
    const t = title.trim();
    const d = desc.trim();
    setTitle("");
    setDesc("");
    setShowForm(false);
    startAdding(() => addProject(domainId, t, d));
  }

  const doneCount = projects.filter((p) => p.status === "DONE").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-white/35">
          Projects
        </h2>
        <span className="text-sm font-mono text-white/35">
          {doneCount} / {projects.length} done
        </span>
      </div>

      <div className="bg-[#111111] border border-white/[0.07] rounded-2xl overflow-hidden">
        {projects.map((p) => (
          <ProjectRow key={p.id} project={p} />
        ))}

        {showForm ? (
          <div className="px-5 py-4 border-t border-white/[0.05] space-y-2.5">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm font-mono text-white/75 placeholder:text-white/20 focus:outline-none focus:border-white/20"
            />
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description (optional)"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-xs font-mono text-white/55 placeholder:text-white/20 focus:outline-none focus:border-white/20"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={isAdding || !title.trim()}
                className="px-4 py-2 text-xs font-mono rounded-lg bg-white/10 hover:bg-white/15 text-white/65 hover:text-white/90 transition-all disabled:opacity-30"
              >
                Add
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs font-mono rounded-lg text-white/30 hover:text-white/55 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center gap-2.5 px-5 py-4 border-t border-white/[0.05] text-sm font-mono text-white/25 hover:text-white/55 hover:bg-white/[0.02] transition-all"
          >
            <Plus size={14} />
            Add project
          </button>
        )}
      </div>
    </div>
  );
}
