"use client";
import { Decision, Task, Failure } from "@/lib/types";

interface Props {
  decisions: Decision[];
  tasks: Task[];
  failures: Failure[];
}

function getLatest(dates: string[]): Date | null {
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates.map(d => new Date(d).getTime())));
}

function hoursAgo(d: Date): number {
  return (Date.now() - d.getTime()) / (1000 * 60 * 60);
}

function freshnessColor(d: Date | null): { text: string; bg: string; dot: string } {
  if (!d) return { text: "text-gray-400", bg: "bg-gray-500/20", dot: "bg-gray-500" };
  const h = hoursAgo(d);
  if (h < 24) return { text: "text-green-400", bg: "bg-green-500/20", dot: "bg-green-500" };
  if (h < 48) return { text: "text-amber-400", bg: "bg-amber-500/20", dot: "bg-amber-500" };
  return { text: "text-red-400", bg: "bg-red-500/20", dot: "bg-red-500" };
}

function relativeTime(d: Date | null): string {
  if (!d) return "No data";
  const s = Math.round((Date.now() - d.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

function formatIST(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true, hour: "numeric", minute: "2-digit", day: "numeric", month: "short" });
}

function HealthCard({ label, date }: { label: string; date: Date | null }) {
  const c = freshnessColor(date);
  return (
    <div className={`${c.bg} border border-[#2a2a2a] rounded-xl p-3`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${c.dot}`} />
        <span className="text-[10px] text-[#888] uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-sm font-semibold ${c.text}`} suppressHydrationWarning>{relativeTime(date)}</p>
      <p className="text-[10px] text-[#666] mt-0.5" suppressHydrationWarning>{formatIST(date)}</p>
    </div>
  );
}

export default function SystemHealth({ decisions, tasks, failures }: Props) {
  const lastDecision = getLatest((decisions ?? []).map(d => d.created_at));
  const lastCompleted = getLatest((tasks ?? []).filter(t => t.status === "completed").map(t => t.updated_at || t.created_at));
  const lastFailure = getLatest((failures ?? []).map(f => f.created_at));

  return (
    <section className="px-4 py-4">
      <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-3">System Health</h2>
      <div className="grid grid-cols-3 gap-2">
        <HealthCard label="Last Decision" date={lastDecision} />
        <HealthCard label="Last Shipped" date={lastCompleted} />
        <HealthCard label="Last Failure" date={lastFailure} />
      </div>
    </section>
  );
}
