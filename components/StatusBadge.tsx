"use client";

const colors: Record<string, string> = {
  completed: "bg-green-500/20 text-green-400", shipped: "bg-green-500/20 text-green-400", decided: "bg-purple-500/20 text-purple-400", resolved: "bg-green-500/20 text-green-400",
  in_progress: "bg-amber-500/20 text-amber-400", running: "bg-amber-500/20 text-amber-400", pending: "bg-amber-500/20 text-amber-400",
  queued: "bg-blue-500/20 text-blue-400", todo: "bg-blue-500/20 text-blue-400",
  failed: "bg-red-500/20 text-red-400", incident: "bg-red-500/20 text-red-400", blocked: "bg-gray-500/20 text-gray-400", cancelled: "bg-gray-500/20 text-gray-400", rejected: "bg-red-500/20 text-red-400",
  P0: "bg-red-500/20 text-red-400", P1: "bg-amber-500/20 text-amber-400", P2: "bg-blue-500/20 text-blue-400", P3: "bg-gray-500/20 text-gray-400",
};

export default function StatusBadge({ status }: { status: string }) {
  if (!status) return null;
  const cls = colors[status] ?? "bg-gray-500/20 text-gray-400";
  return <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}>{status}</span>;
}
