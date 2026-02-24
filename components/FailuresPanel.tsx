import { Failure } from "@/lib/types";
import StatusBadge from "./StatusBadge";

export default function FailuresPanel({ failures }: { failures: Failure[] }) {
  const unresolved = failures.filter(f => !f.resolved);
  if (unresolved.length === 0) return null;
  return (
    <section className="px-4 py-4">
      <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">⚠ Failures & Blockers</h2>
      <div className="space-y-2">
        {unresolved.slice(0, 10).map(f => (
          <div key={f.id} className="bg-[#1a1a1a] border border-red-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{f.failure_type}</span>
              <StatusBadge status={f.resolved ? "resolved" : "failed"} />
            </div>
            <p className="text-[11px] text-[#888] mt-1 line-clamp-2">{f.error_message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
