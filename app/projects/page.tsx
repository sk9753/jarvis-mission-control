"use client";
import { useEffect, useState } from "react";
import { Task } from "@/lib/types";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import KanbanBoard from "@/components/KanbanBoard";

export default function ProjectsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setTasks(data.tasks ?? []);
          setError(false);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  return (
    <main className="max-w-7xl mx-auto pb-8">
      <Header failures={[]} fetchedAt="" />
      <TabNav />
      {error && (
        <div className="mx-4 mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-400">
          ⚠ Unable to fetch tasks. Check Supabase configuration.
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-[#555]">Loading projects…</p>
        </div>
      ) : (
        <KanbanBoard initialTasks={tasks} />
      )}
    </main>
  );
}
