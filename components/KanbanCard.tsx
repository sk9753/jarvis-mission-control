"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/lib/types";
import PriorityBadge from "./PriorityBadge";

function timeAgo(d: string) {
  const s = Math.round((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m`;
  if (s < 86400) return `${Math.round(s / 3600)}h`;
  return `${Math.round(s / 86400)}d`;
}

function truncate(text: string, max: number) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export default function KanbanCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-[#1a1a1a] rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-[#222] transition-colors border border-transparent hover:border-[#333]"
    >
      <p className="text-sm font-medium text-[#e8e8e8] mb-1 leading-snug">{task.title}</p>
      {task.description && (
        <p className="text-xs text-[#666] mb-2 leading-relaxed">{truncate(task.description, 80)}</p>
      )}
      <div className="flex items-center justify-between">
        <PriorityBadge priority={task.priority} />
        <span className="text-[10px] text-[#555]" suppressHydrationWarning>{timeAgo(task.updated_at)}</span>
      </div>
    </div>
  );
}
