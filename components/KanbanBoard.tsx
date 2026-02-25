"use client";
import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { Task } from "@/lib/types";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import TaskDetailPanel from "./TaskDetailPanel";

const columns = [
  { id: "backlog", label: "Backlog" },
  { id: "planning", label: "Planning" },
  { id: "building", label: "Building" },
  { id: "testing", label: "Testing" },
  { id: "live", label: "Live" },
] as const;

function mapStatus(status: string): string {
  if (status === "deployed" || status === "completed") return "live";
  return status;
}

export default function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const tasksByColumn = useCallback(
    (columnId: string) => tasks.filter((t) => mapStatus(t.status) === columnId),
    [tasks]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    let newStatus: string | null = null;

    // Check if dropped over a column
    const col = columns.find((c) => c.id === over.id);
    if (col) {
      newStatus = col.id;
    } else {
      // Dropped over another card — find which column that card is in
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) {
        newStatus = mapStatus(overTask.status);
      }
    }

    if (!newStatus) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || mapStatus(task.status) === newStatus) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus!, updated_at: new Date().toISOString() } : t))
    );

    // Persist to Supabase
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        // Revert on failure
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: task.status, updated_at: task.updated_at } : t))
        );
      }
    } catch {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: task.status, updated_at: task.updated_at } : t))
      );
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 px-4 py-4 overflow-x-auto md:overflow-visible">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              label={col.label}
              tasks={tasksByColumn(col.id)}
              onCardClick={setSelectedTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} onClick={() => {}} /> : null}
        </DragOverlay>
      </DndContext>

      {selectedTask && (
        <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
}
