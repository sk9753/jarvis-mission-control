"use client";
import { useEffect, useState, useCallback } from "react";
import { DashboardData } from "@/lib/types";
import Header from "@/components/Header";
import PipelineStatus from "@/components/PipelineStatus";
import MetricsBar from "@/components/MetricsBar";
import ActivityTimeline from "@/components/ActivityTimeline";
import DecisionsLog from "@/components/DecisionsLog";
import FailuresPanel from "@/components/FailuresPanel";
import TruthObjects from "@/components/TruthObjects";

const empty: DashboardData = { decisions: [], tasks: [], runs: [], artifacts: [], failures: [], truth_objects: [], fetched_at: "" };

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>(empty);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) { setData(await res.json()); setError(false); }
      else setError(true);
    } catch { setError(true); }
  }, []);

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 30000); return () => clearInterval(i); }, [fetchData]);

  return (
    <main className="max-w-3xl mx-auto pb-8">
      <Header failures={data.failures} fetchedAt={data.fetched_at} />
      {error && (
        <div className="mx-4 mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-400">
          ⚠ Unable to fetch data. Check Supabase configuration.
        </div>
      )}
      <MetricsBar tasks={data.tasks} runs={data.runs} failures={data.failures} decisions={data.decisions} />
      <PipelineStatus tasks={data.tasks} />
      <ActivityTimeline decisions={data.decisions} tasks={data.tasks} runs={data.runs} />
      <DecisionsLog decisions={data.decisions} />
      <FailuresPanel failures={data.failures} />
      <TruthObjects truths={data.truth_objects} />
    </main>
  );
}
