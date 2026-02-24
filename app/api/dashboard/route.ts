import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(url, key);

  const [decisions, tasks, runs, artifacts, failures, truth_objects] = await Promise.all([
    supabase.from("decisions").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("tasks").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("runs").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("artifacts").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("failures").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("truth_objects").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  return NextResponse.json({
    decisions: decisions.data ?? [],
    tasks: tasks.data ?? [],
    runs: runs.data ?? [],
    artifacts: artifacts.data ?? [],
    failures: failures.data ?? [],
    truth_objects: truth_objects.data ?? [],
    fetched_at: new Date().toISOString(),
  });
}
