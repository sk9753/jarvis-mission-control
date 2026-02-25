"use client";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/lib/types";
import KanbanCard from "./KanbanCard";

const columnColors: Record<string, string> = {
  backlog: "border-[#444]",
  planning: "border-blue-500/40",
  building: "border-amber-500/40",
  testing: "border-purple-500/40",
  live: "border-green-500/40",
};

const headerAccents: Record<string, string> = {
  backlog: "text-[#888]",
  planning: "text-blue-400",
  building: "text-amber-400",
  testing: "text-purple-400",
  live: "text-green-400",
};

export default function KanbanColumn({
  id,
  label,
  tasks,
  onCardClick,
}: {
  id: string;
  label: string;
  tasks: Task[];
  onCardClick: (task: Task) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-64 md:w-auto md:flex-1 bg-[#111] rounded-xl border ${
        columnColors[id] ?? "border-[#333]"
      } ${isOver ? "ring-1 ring-blue-500/30" : ""} flex flex-col`}
    >
      {/* Header */}
      <div className="px-3 py-3 border-b border-[#1a1a1a]">
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-semibold uppercase tracking-wider ${headerAccents[id] ?? "text-[#888]"}`}>
            {label}
          </h3>
          <span className="text-[10px] text-[#555] font-medium bg-[#1a1a1a] px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[calc(100vh-220px)] min-h-[100px]">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onClick={() => onCardClick(task)} />
          ))}
          {tasks.length === 0 && (
            <p className="text-[11px] text-[#444] text-center py-8">No tasks</p>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
