import { fetchDomainFeeds } from "@/lib/rss";
import { Rss, BookOpen, ExternalLink, FlaskConical } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 1800;

const DOMAINS = [
  { id: "fullstack", label: "Full Stack", color: "#3b82f6" },
  { id: "devops",    label: "DevOps",     color: "#10b981" },
  { id: "ai",        label: "AI",         color: "#8b5cf6" },
  { id: "web3",      label: "Web3",       color: "#f59e0b" },
];

export default async function FeedPage() {
  const allFeeds = await Promise.all(
    DOMAINS.map(async d => ({ ...d, items: await fetchDomainFeeds(d.id) }))
  );

  return (
    <div className="space-y-14">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Rss size={22} className="text-white/50" />
            <h1 className="text-5xl font-mono font-black text-white tracking-tight leading-none">
              Trend Feed
            </h1>
          </div>
          <p className="text-base font-mono text-white/35">
            Live RSS — articles &amp; research papers, refreshed every 30 min
          </p>
        </div>
        <div className="text-xs font-mono text-white/20 border border-white/[0.06] px-4 py-2 rounded-xl">
          {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} last fetch
        </div>
      </div>

      {/* Domain sections */}
      {allFeeds.map(({ id, label, color, items }) => {
        const news     = items.filter(i => !i.isResearch);
        const research = items.filter(i => i.isResearch);
        const combined = [...news, ...research];

        return (
          <section key={id}>
            {/* Section header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-3.5 h-3.5 rounded-full shrink-0"
                style={{ backgroundColor: color, boxShadow: `0 0 14px ${color}` }}
              />
              <h2 className="text-2xl font-mono font-black text-white">{label}</h2>
              <div className="flex items-center gap-3 ml-2">
                {news.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs font-mono text-white/30">
                    <BookOpen size={11} /> {news.length} articles
                  </span>
                )}
                {research.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs font-mono text-white/30">
                    <FlaskConical size={11} /> {research.length} papers
                  </span>
                )}
              </div>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            {combined.length === 0 ? (
              <p className="text-sm font-mono text-white/25 py-4">Feed unavailable — check back shortly.</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {combined.map((item, idx) => (
                  <FeedCard key={idx} item={item} color={color} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function FeedCard({
  item,
  color,
}: {
  item: { title: string; link: string; pubDate: string; description: string; source: string; isResearch: boolean };
  color: string;
}) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-[#111111] border border-white/[0.07] hover:border-white/[0.18] rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1"
      style={{ boxShadow: `0 0 0 1px ${color}10` }}
    >
      {/* Badges */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full"
          style={{ color, backgroundColor: color + "18", border: `1px solid ${color}35` }}
        >
          {item.source}
        </span>
        {item.isResearch && (
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-purple-400/30 bg-purple-400/10 text-purple-300">
            paper
          </span>
        )}
        <ExternalLink
          size={13}
          className="ml-auto text-white/15 group-hover:text-white/50 transition-colors shrink-0"
        />
      </div>

      {/* Title */}
      <h3 className="text-base font-mono font-bold text-white/85 group-hover:text-white leading-snug mb-3 transition-colors line-clamp-3 flex-1">
        {item.title}
      </h3>

      {/* Description */}
      {item.description && (
        <p className="text-sm font-mono text-white/35 leading-relaxed line-clamp-2 mb-4">
          {item.description}
        </p>
      )}

      {/* Date */}
      {item.pubDate && (
        <p className="text-xs font-mono text-white/20 mt-auto pt-3 border-t border-white/[0.05]">
          {new Date(item.pubDate).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        </p>
      )}
    </a>
  );
}
