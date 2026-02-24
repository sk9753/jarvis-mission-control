"use client";
import { useEffect, useState } from "react";
import { Failure } from "@/lib/types";

function useIST() {
  const [t, setT] = useState("");
  useEffect(() => { const i = setInterval(() => setT(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: true })), 1000); return () => clearInterval(i); }, []);
  return t;
}

export default function Header({ failures, fetchedAt }: { failures: Failure[]; fetchedAt: string }) {
  const time = useIST();
  const recentFails = failures.filter(f => !f.resolved && new Date(f.created_at) > new Date(Date.now() - 86400000));
  const health = recentFails.length === 0 ? "bg-green-500" : recentFails.length < 3 ? "bg-amber-500" : "bg-red-500";
  const ago = fetchedAt ? Math.round((Date.now() - new Date(fetchedAt).getTime()) / 1000) : null;

  return (
    <header className="px-4 py-4 flex items-center justify-between border-b border-[#2a2a2a]">
      <div>
        <h1 className="text-xl font-bold tracking-tight">⚡ Jarvis Mission Control</h1>
        <p className="text-xs text-[#888]">{time} IST {ago !== null && `· Synced ${ago}s ago`}</p>
      </div>
      <div className={`w-3 h-3 rounded-full ${health} shadow-[0_0_8px] shadow-current`} title="System health" />
    </header>
  );
}
