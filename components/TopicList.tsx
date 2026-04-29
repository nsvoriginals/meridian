"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Plus, Loader2 } from "lucide-react";
import { toggleTopic, updateTopicNotes, addTopic } from "@/actions/topics";

interface Topic {
  id: string;
  title: string;
  completed: boolean;
  notes: string;
  order: number;
}

interface TopicListProps {
  topics: Topic[];
  domainId: string;
  color: string;
}

function TopicRow({ topic, color }: { topic: Topic; color: string }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(topic.notes);
  const [isPending, startTransition] = useTransition();
  const [isSavingNotes, startSavingNotes] = useTransition();

  return (
    <div className="border-b border-white/[0.05] last:border-0">
      <div className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-white/[0.02] transition-colors group">
        <button
          onClick={() => startTransition(() => toggleTopic(topic.id))}
          disabled={isPending}
          className="shrink-0 text-white/25 hover:text-white/60 transition-colors"
        >
          {isPending ? (
            <Loader2 size={17} className="animate-spin" />
          ) : topic.completed ? (
            <CheckCircle2 size={17} style={{ color }} />
          ) : (
            <Circle size={17} />
          )}
        </button>

        <span
          className={`flex-1 text-sm font-mono leading-relaxed transition-colors ${
            topic.completed ? "text-white/30 line-through" : "text-white/80"
          }`}
        >
          {topic.title}
        </span>

        <button
          onClick={() => setExpanded((e) => !e)}
          className="shrink-0 text-white/15 hover:text-white/45 opacity-0 group-hover:opacity-100 transition-all"
        >
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {expanded && (
        <div className="px-12 pb-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes..."
            rows={3}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-sm font-mono text-white/60 placeholder:text-white/20 resize-none focus:outline-none focus:border-white/20"
          />
          <button
            onClick={() => startSavingNotes(() => updateTopicNotes(topic.id, notes))}
            disabled={isSavingNotes}
            className="mt-2 px-3.5 py-1.5 text-xs font-mono rounded-lg bg-white/[0.07] hover:bg-white/[0.12] text-white/50 hover:text-white/80 transition-all disabled:opacity-40"
          >
            {isSavingNotes ? "Saving…" : "Save notes"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function TopicList({ topics, domainId, color }: TopicListProps) {
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, startAdding] = useTransition();

  const sorted    = [...topics].sort((a, b) => a.order - b.order);
  const completed = topics.filter((t) => t.completed).length;

  async function handleAdd() {
    if (!newTitle.trim()) return;
    const title = newTitle.trim();
    setNewTitle("");
    startAdding(() => addTopic(domainId, title));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-white/35">
          Topics
        </h2>
        <span className="text-sm font-mono font-semibold" style={{ color }}>
          {completed} / {topics.length}
        </span>
      </div>

      <div className="bg-[#111111] border border-white/[0.07] rounded-2xl overflow-hidden">
        {sorted.map((topic) => (
          <TopicRow key={topic.id} topic={topic} color={color} />
        ))}

        {/* Add row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-t border-white/[0.05]">
          <Plus size={15} className="text-white/20 shrink-0" />
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add topic…"
            className="flex-1 bg-transparent text-sm font-mono text-white/65 placeholder:text-white/20 focus:outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={isAdding || !newTitle.trim()}
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.14] text-white/45 hover:text-white/75 transition-all disabled:opacity-30"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
