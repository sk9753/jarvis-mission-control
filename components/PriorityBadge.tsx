"use client";

function normalizePriority(p: string | null | undefined): { label: string; color: string; dot: string } {
  const v = (p ?? "").toLowerCase();
  if (v === "high" || v === "p1") return { label: "High", color: "text-red-400", dot: "bg-red-500" };
  if (v === "medium" || v === "p2") return { label: "Medium", color: "text-amber-400", dot: "bg-amber-500" };
  if (v === "low" || v === "p3") return { label: "Low", color: "text-green-400", dot: "bg-green-500" };
  return { label: "—", color: "text-[#555]", dot: "bg-[#555]" };
}

export default function PriorityBadge({ priority }: { priority?: string | null }) {
  const { label, color, dot } = normalizePriority(priority);
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
