"use client";
import { motion } from "framer-motion";
import { Task } from "@/lib/types";

interface HUDProps {
  tasks: Task[];
  statusText: string;
  speaking: boolean;
}

function countByStatus(tasks: Task[], statuses: string[]) {
  return tasks.filter((t) => statuses.includes(t.status)).length;
}

export default function HUD({ tasks, statusText, speaking }: HUDProps) {
  const backlog = countByStatus(tasks, ["backlog"]);
  const active = countByStatus(tasks, ["planning", "building", "testing"]);
  const live = countByStatus(tasks, ["live", "deployed", "completed"]);
  const total = tasks.length;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top left - JARVIS branding */}
      <motion.div
        className="absolute top-6 left-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className={`w-2 h-2 rounded-full ${speaking ? "bg-cyan-400 animate-pulse" : "bg-cyan-500"}`}
            style={{ boxShadow: "0 0 8px #00d4ff" }}
          />
          <span
            className="text-xs font-bold tracking-[4px] uppercase"
            style={{ color: "#00d4ff", textShadow: "0 0 10px rgba(0,212,255,0.5)" }}
          >
            J.A.R.V.I.S
          </span>
        </div>
        <p className="text-[10px] tracking-[2px] uppercase text-cyan-700">
          Autonomous Operations
        </p>
      </motion.div>

      {/* Top right - System metrics */}
      <motion.div
        className="absolute top-6 right-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="space-y-1.5">
          {[
            { label: "TOTAL", value: total, color: "#00d4ff" },
            { label: "ACTIVE", value: active, color: "#ffaa00" },
            { label: "LIVE", value: live, color: "#00ff88" },
            { label: "BACKLOG", value: backlog, color: "#666" },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-3 justify-end">
              <span className="text-[9px] tracking-[2px] text-[#555]">{m.label}</span>
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: m.color, textShadow: `0 0 8px ${m.color}40` }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom left - Status text */}
      <motion.div
        className="absolute bottom-24 left-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            style={{
              boxShadow: speaking ? "0 0 12px #00d4ff" : "0 0 4px #00d4ff",
              animation: speaking ? "pulse 1s infinite" : undefined,
            }}
          />
          <span className="text-[10px] tracking-[1px] uppercase text-cyan-600">
            {speaking ? "speaking" : "standing by"}
          </span>
        </div>
        {statusText && (
          <motion.p
            key={statusText}
            className="text-xs text-[#888] mt-1 max-w-sm"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {statusText}
          </motion.p>
        )}
      </motion.div>

      {/* Bottom right - Momentz branding */}
      <motion.div
        className="absolute bottom-6 right-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <p className="text-[9px] tracking-[3px] uppercase text-[#333]">Momentz AI</p>
      </motion.div>

      {/* Corner accents */}
      <svg className="absolute top-0 left-0 w-16 h-16 text-cyan-900 opacity-30">
        <line x1="0" y1="20" x2="20" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="30" x2="30" y2="0" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <svg className="absolute top-0 right-0 w-16 h-16 text-cyan-900 opacity-30 scale-x-[-1]">
        <line x1="0" y1="20" x2="20" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="30" x2="30" y2="0" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
