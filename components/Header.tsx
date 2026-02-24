"use client";
import { useEffect, useState } from "react";
import { Failure } from "@/lib/types";

export default function Header({ failures, fetchedAt }: { failures: Failure[]; fetchedAt: string }) {
  const [time, setTime] = useState<string | null>(null);
  const [ago, setAgo] = useState<number | null>(null);

  useEffect(() => {
    function tick() {
      setTime(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: true }));
      if (fetchedAt) {
        setAgo(Math.round((Date.now() - new Date(fetchedAt).getTime()) / 1000));
      }
    }
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [fetchedAt]);

  const recentFails = (failures ?? []).filter(f => !f.resolved && new Date(f.created_at) > new Date(Date.now() - 86400000));
  const health = recentFails.length === 0 ? "bg-green-500" : recentFails.length < 3 ? "bg-amber-500" : "bg-red-500";

  return (
    <header className="px-4 py-4 flex items-center justify-between border-b border-[#2a2a2a]">
      <div>
        <h1 className="text-xl font-bold tracking-tight">⚡ Jarvis Mission Control</h1>
        <p className="text-xs text-[#888]" suppressHydrationWarning>
          {time ? `${time} IST` : "Loading..."} {ago !== null && ago >= 0 && `· Synced ${ago}s ago`}
        </p>
      </div>
      <div className={`w-3 h-3 rounded-full ${health}`} style={{ boxShadow: `0 0 8px currentColor` }} title="System health" />
    </header>
  );
}
