export interface Decision {
  id: string; title: string; context: string; outcome: string; status: string; created_at: string; updated_at: string;
}
export interface Task {
  id: string; title: string; description: string; status: string; priority: string; project_id: string; lane_id: string; assigned_to: string; created_at: string; updated_at: string;
}
export interface Run {
  id: string; task_id: string; status: string; started_at: string; completed_at: string; evidence: Record<string, unknown>; cost_usd: number; model: string; created_at: string;
}
export interface Artifact {
  id: string; run_id: string; task_id: string; type: string; url: string; metadata: Record<string, unknown>; created_at: string;
}
export interface Failure {
  id: string; run_id: string; task_id: string; failure_type: string; error_message: string; raw_error: string; resolved: boolean; created_at: string;
}
export interface TruthObject {
  id: string; category: string; key: string; value: unknown; source: string | null; valid_from: string; valid_until: string | null; created_at: string; updated_at: string;
}
export interface DashboardData {
  decisions: Decision[]; tasks: Task[]; runs: Run[]; artifacts: Artifact[]; failures: Failure[]; truth_objects: TruthObject[]; fetched_at: string;
}
