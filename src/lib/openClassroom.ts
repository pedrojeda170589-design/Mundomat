import { delKey, getJSON, setJSON } from "@/lib/store";
import { generateUniqueCode } from "@/lib/codes";
import { SUBJECT_INFO, Student, StudentProgress, WorldSubject } from "@/types";
import { getProgress, getStudents } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import {
  DEFAULT_OPEN_CLASSROOM_CONFIG,
  OPEN_CLASSROOM_ID,
  OpenClassroomConfig,
  OpenClassroomRating,
  TRIAL_WORLDS_PER_SUBJECT,
  TrialReport,
  isTrialExpired,
  trialSubjectCounts,
} from "@/lib/openClassroomShared";

export const OPEN_CLASSROOM_CONFIG_KEY = "openClassroomConfig";
export const OPEN_CLASSROOM_RATINGS_KEY = "openClassroomRatings";
const OPEN_CLASSROOM_IP_PREFIX = "openClassroomIp:";
const STUDENTS_KEY = "students";

export async function getOpenClassroomConfig(): Promise<OpenClassroomConfig> {
  return getJSON<OpenClassroomConfig>(
    OPEN_CLASSROOM_CONFIG_KEY,
    DEFAULT_OPEN_CLASSROOM_CONFIG
  );
}

export async function saveOpenClassroomConfig(
  config: OpenClassroomConfig
): Promise<void> {
  await setJSON(OPEN_CLASSROOM_CONFIG_KEY, config);
}

export async function getOpenClassroomRatings(): Promise<OpenClassroomRating[]> {
  return getJSON<OpenClassroomRating[]>(OPEN_CLASSROOM_RATINGS_KEY, []);
}

export async function addOpenClassroomRating(
  rating: OpenClassroomRating
): Promise<void> {
  const current = await getOpenClassroomRatings();
  const exists = current.some(
    (r) => r.code.toUpperCase() === rating.code.toUpperCase()
  );
  if (exists) return;
  await setJSON(OPEN_CLASSROOM_RATINGS_KEY, [rating, ...current]);
}

export async function hasStudentRated(code: string): Promise<boolean> {
  const ratings = await getOpenClassroomRatings();
  return ratings.some((r) => r.code.toUpperCase() === code.toUpperCase());
}

export interface OpenClassroomStats {
  totalEnrolled: number;
  active: number;
  expired: number;
  capacity: number;
  open: boolean;
  trialDays: number;
}

export async function getOpenClassroomStats(): Promise<OpenClassroomStats> {
  const [config, allStudents] = await Promise.all([
    getOpenClassroomConfig(),
    getStudents(),
  ]);

  const trialStudents = allStudents.filter(
    (s) => s.classroomId === OPEN_CLASSROOM_ID
  );
  const now = Date.now();
  let expired = 0;
  for (const s of trialStudents) {
    if (isTrialExpired(s, now)) {
      expired++;
    }
  }
  const totalEnrolled = trialStudents.length;
  const active = Math.max(0, totalEnrolled - expired);

  return {
    totalEnrolled,
    active,
    expired,
    capacity: config.capacity,
    open: config.open,
    trialDays: config.trialDays,
  };
}

// Límite anti-abuso: como máximo 5 inscripciones por IP por hora.
export async function checkAndIncrementRateLimit(ip: string): Promise<boolean> {
  const cleanIp = ip.replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 64) || "anon";
  const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));
  const key = `${OPEN_CLASSROOM_IP_PREFIX}${cleanIp}`;
  const record = await getJSON<{ count: number; hour: number } | null>(key, null);

  if (record && record.hour === currentHour) {
    if (record.count >= 5) {
      return false;
    }
    await setJSON(key, { count: record.count + 1, hour: currentHour });
    return true;
  }

  await setJSON(key, { count: 1, hour: currentHour });
  return true;
}

export type RegistrationResult =
  | { ok: true; student: Student }
  | { ok: false; error: string; status: number };

export async function registerOpenClassroomStudent(
  rawName: string,
  clientIp: string
): Promise<RegistrationResult> {
  const name = rawName.trim().replace(/\s+/g, " ");

  // Validación de nombre: 2 a 30 caracteres, letras, espacios, puntos, guiones
  if (name.length < 2 || name.length > 30) {
    return {
      ok: false,
      error: "El nombre debe tener entre 2 y 30 caracteres.",
      status: 400,
    };
  }

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s.'-]+$/;
  if (!nameRegex.test(name)) {
    return {
      ok: false,
      error: "El nombre solo puede contener letras y espacios.",
      status: 400,
    };
  }

  const config = await getOpenClassroomConfig();
  if (!config.open) {
    return {
      ok: false,
      error: "La inscripción al aula de prueba está cerrada en este momento.",
      status: 403,
    };
  }

  const students = await getStudents();
  const trialStudents = students.filter(
    (s) => s.classroomId === OPEN_CLASSROOM_ID
  );
  if (trialStudents.length >= config.capacity) {
    return {
      ok: false,
      error: "El aula de prueba está completa por ahora.",
      status: 409,
    };
  }

  const allowed = await checkAndIncrementRateLimit(clientIp);
  if (!allowed) {
    return {
      ok: false,
      error: "Se alcanzó el límite de inscripciones por hora desde tu conexión. Por favor intentá más tarde.",
      status: 429,
    };
  }

  const existingCodes = new Set(students.map((s) => s.code));
  const code = generateUniqueCode(existingCodes);

  const now = new Date();
  const trialEnds = new Date(
    now.getTime() + (config.trialDays || 30) * 24 * 60 * 60 * 1000
  );

  const student: Student = {
    code,
    name,
    type: "prueba",
    classroomId: OPEN_CLASSROOM_ID,
    createdAt: now.toISOString(),
    trialStartedAt: now.toISOString(),
    trialEndsAt: trialEnds.toISOString(),
  };

  const updated = [...students, student];
  await setJSON(STUDENTS_KEY, updated);

  return { ok: true, student };
}

// ---------------------------------------------------------------------------
// Límite de mundos por materia e informe final
// ---------------------------------------------------------------------------

const TRIAL_REPORT_PREFIX = "trialReport:";

const subjectOf = (id: number) => getWorld(id)?.subject;

// Mundos que el alumno de prueba puede jugar: en cada materia, mientras no
// haya superado 5, todos los habilitados; al llegar a 5, solo los que ya
// superó (para repasarlos).
export function filterTrialWorlds(enabledIds: number[], progress: StudentProgress): number[] {
  const counts = trialSubjectCounts(progress.completedWorlds, subjectOf);
  const done = new Set(progress.completedWorlds);
  return enabledIds.filter((id) => {
    const subj = subjectOf(id);
    if (!subj) return false;
    return done.has(id) || (counts[subj] ?? 0) < TRIAL_WORLDS_PER_SUBJECT;
  });
}

// ¿Este mundo está fuera del límite de la prueba?
export function isTrialWorldBlocked(progress: StudentProgress, worldId: number): boolean {
  if (progress.completedWorlds.includes(worldId)) return false;
  const subj = subjectOf(worldId);
  if (!subj) return true;
  return (trialSubjectCounts(progress.completedWorlds, subjectOf)[subj] ?? 0) >= TRIAL_WORLDS_PER_SUBJECT;
}

// ¿Ya superó el máximo en todas las materias? (si una materia tiene menos
// mundos habilitados que el máximo, alcanza con superar todos los de ella).
export function trialAllSubjectsDone(progress: StudentProgress, enabledIds: number[]): boolean {
  const counts = trialSubjectCounts(progress.completedWorlds, subjectOf);
  return (Object.keys(SUBJECT_INFO) as WorldSubject[]).every((subj) => {
    const available = enabledIds.filter((id) => subjectOf(id) === subj).length;
    return (counts[subj] ?? 0) >= Math.min(TRIAL_WORLDS_PER_SUBJECT, available);
  });
}

async function updateStudent(code: string, patch: Partial<Student>): Promise<Student | undefined> {
  const students = await getStudents();
  const idx = students.findIndex((s) => s.code === code);
  if (idx < 0) return undefined;
  const updated = { ...students[idx], ...patch };
  const next = [...students];
  next[idx] = updated;
  await setJSON(STUDENTS_KEY, next);
  return updated;
}

// Termina la prueba ahora (se completaron los mundos de todas las materias).
export async function endTrialNow(student: Student): Promise<void> {
  await updateStudent(student.code, { trialEndsAt: new Date().toISOString(), trialEndedBy: "mundos" });
}

const TIPS: Record<string, string> = {
  matematica: "Jugar a contar, sumar y restar con objetos de la casa, dados o cartas.",
  lengua: "Leer juntos un cuento corto cada día y conversar sobre lo que pasó.",
  naturales: "Observar plantas, animales y el cielo, y contar lo que se descubre.",
  sociales: "Conversar sobre la familia, el barrio y cómo se vivía antes.",
};

export function buildTrialReport(student: Student, progress: StudentProgress, endedReason: TrialReport["endedReason"]): TrialReport {
  // Aciertos por mundo: registro reciente + resumen de lo más viejo.
  const perWorld = new Map<number, { c: number; i: number }>();
  const add = (id: number, c: number, i: number) => {
    const cur = perWorld.get(id) ?? { c: 0, i: 0 };
    perWorld.set(id, { c: cur.c + c, i: cur.i + i });
  };
  for (const [id, t] of Object.entries(progress.activitySummary ?? {})) add(Number(id), t.correct, t.incorrect);
  const days = new Set<string>();
  for (const r of progress.activityLog) {
    add(r.worldId, r.correct, r.incorrect);
    days.add(r.finishedAt.slice(0, 10));
  }
  const pct = (c: number, i: number) => (c + i > 0 ? Math.round((c / (c + i)) * 100) : null);

  const subjects = Object.keys(SUBJECT_INFO) as WorldSubject[];
  const bySubject = subjects.map((subject) => {
    let c = 0;
    let i = 0;
    for (const [id, t] of perWorld) {
      if (subjectOf(id) === subject) {
        c += t.c;
        i += t.i;
      }
    }
    return {
      subject,
      label: SUBJECT_INFO[subject].label,
      emoji: SUBJECT_INFO[subject].emoji,
      completedWorlds: progress.completedWorlds
        .filter((id) => subjectOf(id) === subject)
        .map((id) => getWorld(id)?.name ?? `Mundo ${id}`),
      answered: c + i,
      correct: c,
      pct: pct(c, i),
    };
  });

  const worldRows = [...perWorld.entries()]
    .map(([id, t]) => ({ id, w: getWorld(id), answered: t.c + t.i, pct: pct(t.c, t.i) ?? 0 }))
    .filter((r) => r.w && r.answered >= 5);
  const strengths = worldRows
    .filter((r) => r.pct >= 80)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 4)
    .map((r) => r.w!.name);
  const toReinforce = worldRows
    .filter((r) => r.pct < 70)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 4)
    .map((r) => ({
      world: r.w!.name,
      subject: SUBJECT_INFO[r.w!.subject].label,
      pct: r.pct,
      tip: TIPS[r.w!.subject] ?? "Practicar un poquito cada día.",
    }));
  const totalCorrect = bySubject.reduce((a, s) => a + s.correct, 0);
  const totalAnswered = bySubject.reduce((a, s) => a + s.answered, 0);

  return {
    code: student.code,
    name: student.name,
    createdAt: new Date().toISOString(),
    startedAt: student.trialStartedAt,
    endedReason,
    daysPlayed: days.size,
    totalCompleted: progress.completedWorlds.length,
    totalAnswered,
    totalCorrect,
    bySubject,
    strengths,
    toReinforce,
    notExplored: bySubject.filter((s) => s.answered === 0).map((s) => s.label),
  };
}

export async function getTrialReport(code: string): Promise<TrialReport | null> {
  return getJSON<TrialReport | null>(`${TRIAL_REPORT_PREFIX}${code}`, null);
}

// Al vencer la prueba: se guarda el informe final y se borra el historial
// de juego (progreso, monedas, avatar). Se hace una sola vez.
export async function closeTrialIfExpired(student: Student): Promise<TrialReport | null> {
  if (student.classroomId !== OPEN_CLASSROOM_ID || !isTrialExpired(student)) return null;
  if (student.trialClosedAt) return getTrialReport(student.code);
  const progress = await getProgress(student.code);
  const report = buildTrialReport(student, progress, student.trialEndedBy === "mundos" ? "mundos" : "dias");
  await setJSON(`${TRIAL_REPORT_PREFIX}${student.code}`, report);
  await delKey(`progress:${student.code}`);
  await updateStudent(student.code, { trialClosedAt: new Date().toISOString() });
  return report;
}

// Cierra las pruebas vencidas que todavía no se cerraron (lo llama el panel
// docente, para que el historial no quede guardado si el chico no vuelve).
export async function closeExpiredTrials(): Promise<number> {
  const students = await getStudents();
  const pending = students.filter(
    (s) => s.classroomId === OPEN_CLASSROOM_ID && !s.trialClosedAt && isTrialExpired(s)
  );
  for (const s of pending) await closeTrialIfExpired(s);
  return pending.length;
}
