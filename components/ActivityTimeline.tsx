"use client";
import { Decision, Task, Run } from "@/lib/types";
import StatusBadge from "./StatusBadge";

type Event = { type: string; title: string; status: string; time: string };

function timeAgo(d: string) {
  const s = Math.round((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s ago`; if (s < 3600) return `${Math.round(s / 60)}m ago`; if (s < 86400) return `${Math.round(s / 3600)}h ago`; return `${Math.round(s / 86400)}d ago`;
}

const icons: Record<string, string> = { decision: "🎯", task: "📋", run: "🔄" };

export default function ActivityTimeline({ decisions, tasks, runs }: { decisions: Decision[]; tasks: Task[]; runs: Run[] }) {
  const events: Event[] = [
    ...(decisions ?? []).map(d => ({ type: "decision", title: d.title, status: d.status, time: d.created_at })),
    ...(tasks ?? []).map(t => ({ type: "task", title: t.title, status: t.status, time: t.updated_at || t.created_at })),
    ...(runs ?? []).map(r => ({ type: "run", title: `Run ${r.id.slice(0, 8)}`, status: r.status, time: r.started_at || r.created_at })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 20);

  return (
    <section className="px-4 py-4">
      <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-3">Recent Activity</h2>
      <div className="space-y-1">
        {events.map((e, i) => (
          <div key={i} className="flex items-center gap-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2">
            <span className="text-sm">{icons[e.type] ?? "•"}</span>
            <span className="text-xs font-medium flex-1 truncate">{e.title}</span>
            <StatusBadge status={e.status} />
            <span className="text-[10px] text-[#888] whitespace-nowrap" suppressHydrationWarning>{timeAgo(e.time)}</span>
          </div>
        ))}
        {events.length === 0 && <p className="text-xs text-[#555]">No activity yet</p>}
      </div>
    </section>
  );
}
