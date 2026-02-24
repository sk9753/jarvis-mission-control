"use client";
import { useState } from "react";
import { Decision } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function DecisionsLog({ decisions }: { decisions: Decision[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <section className="px-4 py-4">
      <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-3">Decisions</h2>
      <div className="space-y-2">
        {decisions.slice(0, 10).map(d => (
          <div key={d.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 cursor-pointer" onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium flex-1 truncate">{d.title}</span>
              <StatusBadge status={d.status} />
            </div>
            {expanded === d.id && (
              <div className="mt-2 text-[11px] text-[#888] space-y-1">
                {d.context && <p><span className="text-[#666]">Context:</span> {d.context}</p>}
                {d.outcome && <p><span className="text-[#666]">Outcome:</span> {d.outcome}</p>}
              </div>
            )}
          </div>
        ))}
        {decisions.length === 0 && <p className="text-xs text-[#555]">No decisions yet</p>}
      </div>
    </section>
  );
}
