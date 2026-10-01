import { getJSON, setJSON } from "@/lib/store";
import { generateUniqueCode } from "@/lib/codes";
import { Student } from "@/types";
import { getStudents } from "@/lib/data";
import {
  DEFAULT_OPEN_CLASSROOM_CONFIG,
  OPEN_CLASSROOM_ID,
  OpenClassroomConfig,
  OpenClassroomRating,
  isTrialExpired,
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
