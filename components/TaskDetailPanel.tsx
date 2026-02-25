"use client";
import { Task } from "@/lib/types";
import PriorityBadge from "./PriorityBadge";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    backlog: "Backlog", planning: "Planning", building: "Building",
    testing: "Testing", live: "Live", deployed: "Live", completed: "Live",
  };
  return map[s] ?? s;
}

export default function TaskDetailPanel({ task, onClose }: { task: Task; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#111] border-l border-[#222] z-50 overflow-y-auto shadow-2xl">
        <div className="p-5">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#666] hover:text-[#e8e8e8] transition-colors text-lg"
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-lg font-semibold text-[#e8e8e8] pr-8 mb-4">{task.title}</h2>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-[#1a1a1a] rounded-lg p-3">
              <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Status</p>
              <p className="text-sm text-[#e8e8e8]">{statusLabel(task.status)}</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-3">
              <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Priority</p>
              <PriorityBadge priority={task.priority} />
            </div>
            {task.assigned_to && (
              <div className="bg-[#1a1a1a] rounded-lg p-3">
                <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Assigned To</p>
                <p className="text-sm text-[#e8e8e8]">{task.assigned_to}</p>
              </div>
            )}
            {task.repo && (
              <div className="bg-[#1a1a1a] rounded-lg p-3">
                <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Project</p>
                <p className="text-sm text-[#e8e8e8] truncate">{task.repo}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div className="mb-5">
              <p className="text-[10px] text-[#666] uppercase tracking-wider mb-2">Description</p>
              <div className="bg-[#1a1a1a] rounded-lg p-4 text-sm text-[#ccc] leading-relaxed whitespace-pre-wrap">
                {task.description}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t border-[#222] pt-4 space-y-2">
            <p className="text-[11px] text-[#555]">Created: {formatDate(task.created_at)}</p>
            <p className="text-[11px] text-[#555]">Updated: {formatDate(task.updated_at)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
