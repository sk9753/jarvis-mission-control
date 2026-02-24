"use client";
import { Failure } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function FailuresPanel({ failures }: { failures: Failure[] }) {
  const items = failures ?? [];
  if (items.length === 0) return null;
  return (
    <section className="px-4 py-4">
      <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">⚠ Failures &amp; Incidents</h2>
      <div className="space-y-2">
        {items.slice(0, 10).map(f => (
          <div key={f.id} className="bg-[#1a1a1a] border border-red-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{f.failure_type}</span>
              <StatusBadge status="incident" />
            </div>
            {f.error_message && <p className="text-[11px] text-[#888] mt-1 line-clamp-2">{f.error_message}</p>}
            {f.root_cause && <p className="text-[10px] text-[#666] mt-1">Root cause: {f.root_cause}</p>}
            {f.next_action && <p className="text-[10px] text-green-400/70 mt-1">→ {f.next_action}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
