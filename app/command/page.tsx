"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { Task } from "@/lib/types";
import HUD from "@/components/jarvis/HUD";
import CommandInput from "@/components/jarvis/CommandInput";
import TaskDetailPanel from "@/components/TaskDetailPanel";

// Dynamic import for Three.js scene (no SSR)
const Scene = dynamic(() => import("@/components/jarvis/Scene"), { ssr: false });

interface Message {
  role: "user" | "jarvis";
  text: string;
  timestamp: Date;
}

// Simple command processor — responds to basic queries about tasks/status
function processCommand(command: string, tasks: Task[]): string {
  const lower = command.toLowerCase().trim();

  // Status queries
  if (lower.includes("status") || lower.includes("report") || lower === "sitrep") {
    const backlog = tasks.filter((t) => t.status === "backlog").length;
    const active = tasks.filter((t) => ["planning", "building", "testing"].includes(t.status)).length;
    const live = tasks.filter((t) => ["live", "deployed", "completed"].includes(t.status)).length;
    return `Operational status: ${tasks.length} total projects. ${active} active, ${live} live, ${backlog} in backlog. All systems nominal.`;
  }

  // Backlog queries
  if (lower.includes("backlog") || lower.includes("pipeline") || lower.includes("queue")) {
    const backlog = tasks.filter((t) => t.status === "backlog");
    if (backlog.length === 0) return "Backlog is clear. No pending projects.";
    return `${backlog.length} items in backlog:\n${backlog.map((t) => `• ${t.title} [${t.priority}]`).join("\n")}`;
  }

  // Active work
  if (lower.includes("active") || lower.includes("building") || lower.includes("current") || lower.includes("working on")) {
    const active = tasks.filter((t) => ["planning", "building", "testing"].includes(t.status));
    if (active.length === 0) return "No active builds. Standing by for orders.";
    return `${active.length} active projects:\n${active.map((t) => `• ${t.title} [${t.status}]`).join("\n")}`;
  }

  // Live/deployed
  if (lower.includes("live") || lower.includes("deployed") || lower.includes("shipped")) {
    const live = tasks.filter((t) => ["live", "deployed", "completed"].includes(t.status));
    if (live.length === 0) return "Nothing deployed yet. First build pending.";
    return `${live.length} projects live:\n${live.map((t) => `• ${t.title}`).join("\n")}`;
  }

  // Help
  if (lower === "help" || lower === "commands") {
    return 'Available commands: "status", "backlog", "active", "live", "agents", or ask about any project by name.';
  }

  // Agents
  if (lower.includes("agent")) {
    return "Agent roster: Jarvis (COO, active), Builder (delegation, standby). Future: Sales DM Agent, Research Agent, Finance Agent. Orchestration layer in backlog.";
  }

  // Search by project name
  const match = tasks.find(
    (t) => t.title.toLowerCase().includes(lower) || lower.includes(t.title.toLowerCase().slice(0, 15))
  );
  if (match) {
    return `${match.title}\nStatus: ${match.status} | Priority: ${match.priority}\n${match.description?.slice(0, 150) ?? "No description"}${(match.description?.length ?? 0) > 150 ? "…" : ""}`;
  }

  // Default
  const responses = [
    "Standing by. Try 'status' for a system overview or 'backlog' to see the pipeline.",
    "I'm here. Ask about 'active' builds, 'backlog' items, or say 'status' for the full picture.",
    "Ready for orders. Use 'help' to see what I can report on.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export default function CommandPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [statusText, setStatusText] = useState("Initializing systems...");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks ?? []);
        setStatusText(`${data.tasks?.length ?? 0} projects tracked. All systems operational.`);
      }
    } catch {
      setStatusText("Connection to Supabase interrupted.");
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  // Boot sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setSpeaking(true);
      setMessages([
        {
          role: "jarvis",
          text: "Systems online. All agents standing by. How can I help, Sunny?",
          timestamp: new Date(),
        },
      ]);
      setTimeout(() => setSpeaking(false), 2000);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCommand = (command: string) => {
    const userMsg: Message = { role: "user", text: command, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setSpeaking(true);

    // Simulate processing delay
    setTimeout(() => {
      const response = processCommand(command, tasks);
      const jarvisMsg: Message = { role: "jarvis", text: response, timestamp: new Date() };
      setMessages((prev) => [...prev, jarvisMsg]);
      setStatusText(response.split("\n")[0]);
      setIsProcessing(false);
      setTimeout(() => setSpeaking(false), 1500);
    }, 800 + Math.random() * 700);
  };

  return (
    <div className="fixed inset-0 bg-[#030308] overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <p
                className="text-xs tracking-[3px] uppercase animate-pulse"
                style={{ color: "#00d4ff" }}
              >
                Initializing...
              </p>
            </div>
          }
        >
          <Scene tasks={tasks} speaking={speaking} onTaskClick={setSelectedTask} />
        </Suspense>
      </div>

      {/* HUD Overlay */}
      <HUD tasks={tasks} statusText={statusText} speaking={speaking} />

      {/* Command Input */}
      <CommandInput onCommand={handleCommand} messages={messages} isProcessing={isProcessing} />

      {/* Task Detail Panel */}
      {selectedTask && (
        <div className="pointer-events-auto">
          <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
        </div>
      )}
    </div>
  );
}
