"use client";
import { Task } from "@/lib/types";
import StatusBadge from "./StatusBadge";

function timeAgo(d: string) {
  const s = Math.round((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s`; if (s < 3600) return `${Math.round(s / 60)}m`; if (s < 86400) return `${Math.round(s / 3600)}h`; return `${Math.round(s / 86400)}d`;
}

const lanes = [
  { key: "queued", label: "Queued", border: "border-blue-500/50" },
  { key: "in_progress", label: "In Progress", border: "border-amber-500/50" },
  { key: "completed", label: "Completed", border: "border-green-500/50" },
  { key: "failed", label: "Failed", border: "border-red-500/50" },
];

export default function PipelineStatus({ tasks }: { tasks: Task[] }) {
  const safeTasks = tasks ?? [];
  return (
    <section className="px-4 py-4">
      <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-3">Pipeline</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {lanes.map(lane => {
          const items = safeTasks.filter(t => t.status === lane.key);
          return (
            <div key={lane.key} className={`bg-[#1a1a1a] border ${lane.border} rounded-xl p-3`}>
              <div className="text-xs text-[#888] mb-2">{lane.label} <span className="text-[#e8e8e8] font-semibold">{items.length}</span></div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.slice(0, 5).map(t => (
                  <div key={t.id} className="bg-[#141414] rounded-lg p-2">
                    <p className="text-xs font-medium truncate">{t.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {t.priority && <StatusBadge status={t.priority} />}
                      <span className="text-[10px] text-[#888]" suppressHydrationWarning>{timeAgo(t.created_at)}</span>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <p className="text-[10px] text-[#555]">None</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
