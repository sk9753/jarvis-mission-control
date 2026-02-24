"use client";
import { Task, Run, Failure, Decision } from "@/lib/types";

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-[#888] mt-1">{label}</p>
    </div>
  );
}

export default function MetricsBar({ tasks, runs, failures, decisions }: { tasks: Task[]; runs: Run[]; failures: Failure[]; decisions: Decision[] }) {
  return (
    <section className="px-4 py-2">
      <div className="grid grid-cols-4 gap-2">
        <Metric label="Shipped" value={(tasks ?? []).filter(t => t.status === "completed").length} color="text-green-400" />
        <Metric label="Active Runs" value={(runs ?? []).filter(r => r.status === "running").length} color="text-amber-400" />
        <Metric label="Open Fails" value={(failures ?? []).filter(f => !f.resolved).length} color="text-red-400" />
        <Metric label="Decisions" value={(decisions ?? []).length} color="text-purple-400" />
      </div>
    </section>
  );
}
