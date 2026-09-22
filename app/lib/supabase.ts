import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ── Singleton browser client ───────────────────────────────────────────────
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!_client) _client = createClient(url, key);
  return _client;
}

/** Async version — same singleton, kept for backward compat */
export async function getBrowserSupabase(): Promise<SupabaseClient | null> {
  return getSupabase();
}

export const DEMO_USER = "demo-user";
export const DEMO_DOCTOR = "demo-doctor";

// ── Database types ─────────────────────────────────────────────────────────
export type DbSession = {
  id: number;
  user_id: string;
  exercise_name: string;
  exercise_key: string;
  achieved_angle: number;
  target_angle: number;
  rep_count: number;
  correct_reps: number;
  pain_before: number;
  pain_after: number;
  duration_seconds: number;
  status: "COMPLETED" | "ABANDONED";
  week_number: number;
  angle_log: { t: number; a: number }[];
  feedback_log: { text: string; type: string; t: number }[];
  started_at: string;
  ended_at: string;
};

export type DbCheckin = {
  id: number;
  user_id: string;
  pain_score: number;
  swelling: string;
  mood: string;
  slept_well: boolean;
  notes: string;
  insight: string;
  created_at: string;
};

export type DbPatientProfile = {
  user_id: string;
  full_name: string;
  email: string;
  age: number;
  gender: string;
  phone: string;
  surgery_type: string;
  surgery_date: string;
  current_week: number;
  total_weeks: number;
  target_rom: number;
  doctor_id: string;
};

export type DbMedicalReport = {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  is_processed: boolean;
  is_active: boolean;
  extracted_data: Record<string, unknown>;
  created_at: string;
};

export type DbMessage = {
  id: string;
  from_user: string;
  to_user: string;
  from_role: "doctor" | "patient";
  text: string;
  read: boolean;
  created_at: string;
};

export type DbClinicalNote = {
  id: string;
  doctor_id: string;
  patient_id: string;
  note: string;
  type: "progress" | "concern" | "milestone";
  created_at: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────
export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function fmtDateShort(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return fmtTime(iso);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)  return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getGeminiApiKey(): string {
  if (typeof window !== "undefined") {
    const customKey = localStorage.getItem("recoverx_gemini_api_key");
    if (customKey && customKey.trim()) return customKey.trim();
  }
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
}

export function getLocalSessions(): DbSession[] {
  if (typeof window === "undefined") return [];
  const sessions: DbSession[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith("recoverx-session-") || key.startsWith("antigravity-session-")) &&
        !key.endsWith("-completed")
      ) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
              sessions.push({
                id: parsed.id || Number(key.replace(/\D/g, "")) || Date.now(),
                user_id: parsed.user_id || DEMO_USER,
                exercise_name: parsed.exercise_name || "Exercise",
                exercise_key: parsed.exercise_key || "knee-flexion",
                achieved_angle: parsed.achieved_angle || 0,
                target_angle: parsed.target_angle || 90,
                rep_count: parsed.rep_count || 0,
                correct_reps: parsed.correct_reps || 0,
                pain_before: parsed.pain_before ?? 2,
                pain_after: parsed.pain_after ?? 2,
                duration_seconds: parsed.duration_seconds || 0,
                status: parsed.status || "COMPLETED",
                week_number: parsed.week_number || 3,
                angle_log: parsed.angle_log || [],
                feedback_log: parsed.feedback_log || [],
                started_at: parsed.started_at || parsed.ended_at || new Date().toISOString(),
                ended_at: parsed.ended_at || new Date().toISOString(),
              });
            }
          } catch {
            // Ignore malformed individual session item
          }
        }
      }
    }
  } catch (err) {
    console.warn("Error reading local sessions:", err);
  }
  return sessions.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
}

export function saveLocalSession(session: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const key = `recoverx-session-${Date.now()}`;
  localStorage.setItem(key, JSON.stringify(session));
  localStorage.setItem(`antigravity-session-${Date.now()}`, JSON.stringify(session));
  localStorage.setItem("recoverx-session-completed", String(Date.now()));
  localStorage.setItem("antigravity-session-completed", String(Date.now()));
  window.dispatchEvent(new CustomEvent("session-completed"));
}

