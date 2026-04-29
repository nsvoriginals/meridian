import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { ArrowUpRight } from "lucide-react";

interface DomainCardProps {
  id: string;
  title: string;
  description: string;
  coverKeyword: string;
  color: string;
  completedTopics: number;
  totalTopics: number;
}

export default function DomainCard({
  id, title, description, coverKeyword, color, completedTopics, totalTopics,
}: DomainCardProps) {
  const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <Link href={`/domain/${id}`} className="group block h-full">
      <div
        className="relative flex flex-col h-full rounded-2xl overflow-hidden bg-[#111111] border border-white/[0.07] hover:border-white/[0.18] transition-all duration-300 hover:-translate-y-1.5"
        style={{ boxShadow: `0 0 0 1px ${color}18, 0 8px 32px rgba(0,0,0,0.4)` }}
      >
        {/* Cover image */}
        <div className="relative h-52 shrink-0 overflow-hidden">
          <img
            src={`https://picsum.photos/seed/${encodeURIComponent(coverKeyword)}/600/400`}
            alt={title}
            className="w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, ${color}55 0%, #111111 90%)` }}
          />
          {/* Top row inside image */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
            />
            <div
              className="text-sm font-mono font-black px-3 py-1 rounded-full"
              style={{ color, backgroundColor: color + "25", border: `1px solid ${color}45` }}
            >
              {pct}%
            </div>
          </div>
          {/* Title inside image at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-8"
            style={{ background: "linear-gradient(to top, #111111 60%, transparent)" }}
          >
            <h3 className="font-mono text-xl font-black text-white tracking-tight leading-none">
              {title}
            </h3>
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-5 space-y-4">
          <p className="text-sm font-mono text-white/45 leading-relaxed line-clamp-3 flex-1">
            {description}
          </p>

          <div className="space-y-3">
            <ProgressBar value={completedTopics} max={totalTopics} color={color} showLabel />

            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-mono text-white/35">
                {completedTopics} / {totalTopics} topics
              </span>
              <div
                className="flex items-center gap-1.5 text-sm font-mono font-semibold px-3 py-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                style={{ color, backgroundColor: color + "18" }}
              >
                Open
                <ArrowUpRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
