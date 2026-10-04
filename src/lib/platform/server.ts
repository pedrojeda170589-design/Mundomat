// Conexión del juego con la plataforma (Supabase), SOLO en el servidor.
//
// El juego sigue funcionando exactamente igual que antes con su almacén
// (Upstash). Si la plataforma está configurada (variables de entorno),
// además:
//   - cada respuesta y cada vuelta de mundo se guardan en el historial
//     académico de Supabase, con el contexto del aula/ciclo del alumno;
//   - un alumno inscripto desde el panel docente puede entrar con su
//     código aunque no exista todavía en el juego;
//   - cada alumno queda asociado a su aula actual (para separar aulas).
// Si Supabase no responde, el juego NO se interrumpe: se registra el error.
//
// Usa la clave de servicio (nunca llega al navegador).

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getWorld } from "@/lib/worlds";

const URL_ = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isPlatformEnabled(): boolean {
  return Boolean(URL_ && SERVICE_KEY);
}

let client: SupabaseClient | null = null;
function db(): SupabaseClient {
  if (!client) {
    client = createClient(URL_!, SERVICE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export interface DirectoryEntry {
  studentId: string;
  accessCode: string;
  fullName: string;
  nickname: string | null; // nombre visible confirmado por el docente
  birthDate: string | null;
  birthdayMmdd: string | null;
  classroomId: string | null;
  isLegacyPilot: boolean;
  grade: number | null; // grado del aula actual
}

// Cache corto en memoria: el código → datos del alumno y su aula actual.
const DIRECTORY_TTL_MS = 2 * 60_000;
const directoryCache = new Map<string, { at: number; value: DirectoryEntry | null }>();

export async function lookupStudent(code: string): Promise<DirectoryEntry | null> {
  if (!isPlatformEnabled()) return null;
  const key = code.toUpperCase();
  const hit = directoryCache.get(key);
  if (hit && Date.now() - hit.at < DIRECTORY_TTL_MS) return hit.value;
  try {
    const { data: s, error } = await db()
      .from("students")
      .select("id, access_code, full_name, nickname, birth_date, birthday_mmdd, active")
      .eq("access_code", key)
      .maybeSingle();
    if (error) throw error;
    let value: DirectoryEntry | null = null;
    if (s && s.active) {
      const { data: e } = await db()
        .from("student_enrollments")
        .select("classroom_id, classrooms(is_legacy_pilot, grade)")
        .eq("student_id", s.id)
        .eq("status", "active")
        .maybeSingle();
      const classroom = (e?.classrooms ?? null) as { is_legacy_pilot?: boolean; grade?: number } | null;
      value = {
        studentId: s.id,
        accessCode: s.access_code,
        fullName: s.full_name,
        nickname: s.nickname ?? null,
        birthDate: s.birth_date,
        birthdayMmdd: s.birthday_mmdd,
        classroomId: e?.classroom_id ?? null,
        isLegacyPilot: !!classroom?.is_legacy_pilot,
        grade: typeof classroom?.grade === "number" ? classroom.grade : null,
      };
    }
    directoryCache.set(key, { at: Date.now(), value });
    return value;
  } catch (err) {
    console.error("[plataforma] no se pudo consultar el alumno", err);
    return hit?.value ?? null;
  }
}

// Mundos habilitados de un aula (el docente los elige en su panel).
const worldsCache = new Map<string, { at: number; value: number[] | null }>();
export async function getClassroomWorlds(classroomId: string): Promise<number[] | null> {
  if (!isPlatformEnabled()) return null;
  const hit = worldsCache.get(classroomId);
  if (hit && Date.now() - hit.at < 30_000) return hit.value;
  try {
    const { data, error } = await db()
      .from("classrooms")
      .select("enabled_world_ids")
      .eq("id", classroomId)
      .maybeSingle();
    if (error) throw error;
    const value = (data?.enabled_world_ids as number[] | undefined) ?? null;
    worldsCache.set(classroomId, { at: Date.now(), value });
    return value;
  } catch (err) {
    console.error("[plataforma] no se pudieron leer los mundos del aula", err);
    return hit?.value ?? null;
  }
}

export function forgetClassroomWorlds(classroomId: string) {
  worldsCache.delete(classroomId);
}

function subjectOf(worldId: number): { subject: string; category: string | null } {
  const w = getWorld(worldId);
  // 1.º grado: la "categoría" es grado y número de mundo (p. ej. "1.º-L13").
  const category = w?.grade === 1 ? `1.º-${w.subject[0].toUpperCase()}${w.worldNumber}` : w?.category ?? null;
  return { subject: w?.subject ?? "otra", category };
}

// Guarda una respuesta en el historial. `clientId` evita duplicados si la
// misma respuesta llega dos veces (reintentos / sincronización).
export async function recordActivityResult(input: {
  code: string;
  clientId: string;
  worldId: number;
  activityIndex: number;
  correct: number;
  incorrect: number;
  timeSpentSeconds: number;
  occurredAt?: string;
}): Promise<void> {
  if (!isPlatformEnabled()) return;
  try {
    const s = await lookupStudent(input.code);
    if (!s) return; // alumno solo del juego (todavía no está en la plataforma)
    const { subject, category } = subjectOf(input.worldId);
    const { error } = await db()
      .from("activity_results")
      .upsert(
        {
          client_id: input.clientId,
          student_id: s.studentId,
          world_id: input.worldId,
          subject,
          category,
          activity_index: input.activityIndex,
          correct: input.correct,
          incorrect: input.incorrect,
          time_spent_seconds: Math.max(0, Math.min(input.timeSpentSeconds, 3600)),
          occurred_at: input.occurredAt ?? new Date().toISOString(),
        },
        { onConflict: "client_id", ignoreDuplicates: true }
      );
    if (error) throw error;
  } catch (err) {
    console.error("[plataforma] no se pudo guardar la respuesta", err);
  }
}

export async function recordWorldAttempt(input: {
  code: string;
  clientId: string;
  worldId: number;
  correctCount: number;
  total: number;
  scorePct: number;
  outcome: string;
  worldStatus: "available" | "pending_retry" | "needs_review" | "completed";
  newlyCompleted: boolean;
}): Promise<void> {
  if (!isPlatformEnabled()) return;
  try {
    const s = await lookupStudent(input.code);
    if (!s) return;
    const { subject } = subjectOf(input.worldId);
    const { error } = await db()
      .from("world_attempts")
      .upsert(
        {
          client_id: input.clientId,
          student_id: s.studentId,
          world_id: input.worldId,
          subject,
          correct_count: input.correctCount,
          total: input.total,
          score_pct: input.scorePct,
          outcome: input.outcome,
        },
        { onConflict: "client_id", ignoreDuplicates: true }
      );
    if (error) throw error;
    // Estado actual del mundo (lo único que cambia).
    const row: Record<string, unknown> = {
      student_id: s.studentId,
      world_id: input.worldId,
      status: input.worldStatus,
      updated_at: new Date().toISOString(),
    };
    if (input.newlyCompleted) {
      row.completed_at = new Date().toISOString();
      row.completed_classroom_id = s.classroomId;
    }
    const { error: e2 } = await db().from("student_world_progress").upsert(row, { onConflict: "student_id,world_id" });
    if (e2) throw e2;
  } catch (err) {
    console.error("[plataforma] no se pudo guardar la vuelta del mundo", err);
  }
}

export async function recordAchievement(code: string, kind: string, achievementCode: string): Promise<void> {
  if (!isPlatformEnabled()) return;
  try {
    const s = await lookupStudent(code);
    if (!s) return;
    const { error } = await db()
      .from("achievements")
      .upsert(
        { student_id: s.studentId, kind, code: achievementCode, classroom_id: s.classroomId },
        { onConflict: "student_id,kind,code", ignoreDuplicates: true }
      );
    if (error) throw error;
  } catch (err) {
    console.error("[plataforma] no se pudo guardar el logro", err);
  }
}
