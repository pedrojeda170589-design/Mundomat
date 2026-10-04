import {
  AVATAR_OPTIONS,
  AccessorySlot,
  AvatarAccessories,
  AvatarTweaks,
  TWEAK_LIMITES,
  MAX_NICKNAME_LENGTH,
  Student,
  StudentProgress,
  StudentType,
  WEEKEND_REWARD_IDS,
  WeekendRecord,
  WorldsConfig,
  ACCESSORY_CATALOG_TIENDA,
  canUseAvatar,
  getAccessoryById,
  getShopAvatar,
  getEquippableAccessoryIds,
  getValidAccessoryIdsForAvatar,
  isBackgroundSelectable,
} from "@/types";
import { getJSON, getJSONMany, setJSON } from "@/lib/store";
import { generateUniqueCode } from "@/lib/codes";
import { WORLDS } from "@/lib/worlds";
import { getClassroomWorlds, isPlatformEnabled, lookupStudent } from "@/lib/platform/server";
import { OPEN_CLASSROOM_ID, isOpenClassroomStudent } from "@/lib/openClassroomShared";
import { DEFAULT_GRADE, getGrade, gradeOf } from "@/lib/grades";
import { grade1HasContent } from "@/lib/grade1/content";
import { claveSemanaDictado } from "@/lib/dictado/banco";
import { resumenVueltas } from "@/lib/vuelta";
import { enVenta } from "@/lib/tiempo-limitado";
import { getDrop, puedeComprarDrop } from "@/lib/coleccion/drops";
import {
  computeNextStreak,
  computeSpecialChallengeReward,
  weekendKey,
} from "@/lib/specialChallenge";
import {
  ACTIVITIES_PER_DAY,
  FINAL_BONUS,
  buildWeekendPlan,
  getWeekendDay,
  scoreActivity,
} from "@/lib/weekend/plan";
import { getArgentinaDate } from "@/lib/seasons";
import { displayName } from "@/lib/news";
import {
  calcularMedalla,
  MONEDAS_MEDALLA,
  premioGrupoParaTabla,
  type MedallaTorneo,
  type PremioGrupoItem,
} from "@/lib/torneo/tiempos";

const STUDENTS_KEY = "students";
const WORLDS_CONFIG_KEY = "worldsConfig";
const PROGRESS_KEY_PREFIX = "progress:";

// Lista de alumnos de aula pasada por el docente. Se usa para poblar la
// base la primera vez que corre la app (o al pedir "restaurar aula").
export const ROSTER_ALUMNOS_DE_AULA: string[] = [
  "Giovanni Alexander",
  "De Urquiza Iñaki",
  "Lorenzo Daniel Perez Veron",
  "Santiago Benjamin Solorza Gomez",
  "Felipe Samuel Vidal",
  "Branco Leonel Villarreal Sanhueza",
  "Valentina Jazmin Alfaro Arca",
  "Bryhanna Solange Alfonso Vargas",
  "Agustina Amaya Paredes",
  "Dara Leonela Caceres Castro",
  "Jazmin Paula Delgado Gonzalez",
  "Garcia Maite",
  "Inalen Herber",
  "Alma Selena Morales Moreyra",
  "Luna Agostina Ojeda Vargas",
  "Vesna Pacheco Leal",
  "Agustina Assai Rodriguez Infante",
  "Siena Rueda",
  "Ain Valentina Sandoval Molina",
];

export async function getStudents(): Promise<Student[]> {
  const students = await getJSON<Student[]>(STUDENTS_KEY, []);
  if (students.length === 0) {
    // Primera vez: poblamos con el aula que pasó el docente.
    const seeded = seedRoster();
    await setJSON(STUDENTS_KEY, seeded);
    return seeded;
  }
  return students;
}

function seedRoster(): Student[] {
  const codes = new Set<string>();
  return ROSTER_ALUMNOS_DE_AULA.map((name) => {
    const code = generateUniqueCode(codes);
    codes.add(code);
    return {
      code,
      name,
      type: "aula" as StudentType,
      createdAt: new Date().toISOString(),
    };
  });
}

export async function addStudent(
  name: string,
  type: StudentType = "agregado",
  grade?: number,
  displayName?: string
): Promise<Student> {
  const students = await getStudents();
  const existingCodes = new Set(students.map((s) => s.code));
  const code = generateUniqueCode(existingCodes);
  const student: Student = {
    code,
    name,
    type,
    createdAt: new Date().toISOString(),
    ...(displayName?.trim() ? { displayName: displayName.trim() } : {}),
    ...(grade && grade !== DEFAULT_GRADE ? { grade } : {}),
  };
  const updated = [...students, student];
  await setJSON(STUDENTS_KEY, updated);
  classSnapshotCache = null;
  return student;
}

export async function deleteStudent(code: string): Promise<void> {
  const students = await getStudents();
  const updated = students.filter((s) => s.code !== code);
  await setJSON(STUDENTS_KEY, updated);
  classSnapshotCache = null;
}

export async function setStudentBirthday(
  code: string,
  birthday: string | undefined
): Promise<boolean> {
  const students = await getStudents();
  const idx = students.findIndex((s) => s.code.toUpperCase() === code.toUpperCase());
  if (idx === -1) return false;
  const updated = [...students];
  updated[idx] = { ...updated[idx], birthday };
  if (!birthday) delete updated[idx].birthday;
  await setJSON(STUDENTS_KEY, updated);
  classSnapshotCache = null;
  return true;
}

export async function setStudentDisplayName(
  code: string,
  displayName: string | undefined
): Promise<boolean> {
  const students = await getStudents();
  const idx = students.findIndex((s) => s.code.toUpperCase() === code.toUpperCase());
  if (idx === -1) return false;
  const updated = [...students];
  const trimmed = displayName?.trim();
  if (trimmed) {
    updated[idx] = { ...updated[idx], displayName: trimmed };
  } else {
    const copy = { ...updated[idx] };
    delete copy.displayName;
    updated[idx] = copy;
  }
  await setJSON(STUDENTS_KEY, updated);
  classSnapshotCache = null;
  return true;
}

export async function setMultipleStudentDisplayNames(
  entries: Array<{ code: string; displayName?: string }>
): Promise<number> {
  const students = await getStudents();
  const map = new Map(entries.map((e) => [e.code.toUpperCase(), e.displayName?.trim()]));
  let changed = 0;
  const updated = students.map((s) => {
    const code = s.code.toUpperCase();
    if (map.has(code)) {
      changed++;
      const val = map.get(code);
      const copy = { ...s };
      if (val) copy.displayName = val;
      else delete copy.displayName;
      return copy;
    }
    return s;
  });
  if (changed > 0) {
    await setJSON(STUDENTS_KEY, updated);
    classSnapshotCache = null;
  }
  return changed;
}

export async function findStudentByCode(
  code: string
): Promise<Student | undefined> {
  const students = await getStudents();
  const found = students.find((s) => s.code.toUpperCase() === code.toUpperCase());
  if (found || !isPlatformEnabled()) return found;
  // Alumno inscripto desde el panel de la plataforma que todavía no entró
  // nunca al juego: se lo incorpora con su mismo código.
  return syncStudentWithPlatform(code);
}

// Mantiene al alumno del juego al día con la plataforma: lo crea si hace
// falta y actualiza su aula actual (tras una promoción, un cambio de aula
// o un traslado) y su fecha de nacimiento. No toca su progreso.
export async function syncStudentWithPlatform(code: string): Promise<Student | undefined> {
  const students = await getStudents();
  const idx = students.findIndex((s) => s.code.toUpperCase() === code.toUpperCase());
  const current = idx >= 0 ? students[idx] : undefined;
  if (!isPlatformEnabled()) return current;
  const entry = await lookupStudent(code);
  if (!entry) return current;
  const classroomId = entry.isLegacyPilot ? undefined : entry.classroomId ?? undefined;
  // El grado lo da el aula de la plataforma (1.º, 3.º…); el aula piloto es 3.º.
  const grade = !entry.isLegacyPilot && entry.grade && entry.grade !== 3 ? entry.grade : undefined;
  const birthday = entry.birthDate ?? entry.birthdayMmdd ?? current?.birthday;
  // Nombre visible confirmado por el docente en /docente (si lo cargó).
  const displayName = entry.nickname?.trim() || current?.displayName;
  if (!current) {
    const student: Student = {
      code: entry.accessCode,
      name: entry.fullName,
      type: "aula",
      createdAt: new Date().toISOString(),
      ...(birthday ? { birthday } : {}),
      ...(classroomId ? { classroomId } : {}),
      ...(grade ? { grade } : {}),
      ...(displayName ? { displayName } : {}),
    };
    await setJSON(STUDENTS_KEY, [...students, student]);
    classSnapshotCache = null;
    return student;
  }
  if (current.classroomId === classroomId && current.birthday === birthday && current.grade === grade && current.displayName === displayName) return current;
  const updated: Student = { ...current, classroomId, birthday, grade, ...(displayName ? { displayName } : {}) };
  if (!classroomId) delete updated.classroomId;
  if (!birthday) delete updated.birthday;
  if (!grade) delete updated.grade;
  const list = [...students];
  list[idx] = updated;
  await setJSON(STUDENTS_KEY, list);
  classSnapshotCache = null;
  return updated;
}

// Compañeros de aula: los alumnos con la misma aula actual (los del aula
// piloto no tienen aula asignada y siguen juntos como siempre). Los del aula
// abierta de prueba pública no son compañeros entre sí (familias independientes).
export function sameClassroom(a: Student, b: Student): boolean {
  if (isOpenClassroomStudent(a) || isOpenClassroomStudent(b)) {
    return false;
  }
  return (a.classroomId ?? null) === (b.classroomId ?? null);
}

export function classmatesOf(me: Student, students: Student[]): Student[] {
  return students.filter((s) => sameClassroom(s, me));
}

function emptyProgress(code: string): StudentProgress {
  return { code, completedWorlds: [], activityLog: [], coins: 0 };
}

export async function getProgress(code: string): Promise<StudentProgress> {
  return getJSON<StudentProgress>(`${PROGRESS_KEY_PREFIX}${code}`, emptyProgress(code));
}

// Progreso sin el registro detallado (para responder a las pantallas del
// alumno, que no lo usan).
export function liteProgress(p: StudentProgress): StudentProgress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { activityLog, activitySummary, roundsInProgress, ...rest } = p;
  const roundsResume = roundsInProgress ? resumenVueltas(p) : undefined;
  return { ...rest, activityLog: [], ...(roundsResume && Object.keys(roundsResume).length ? { roundsResume } : {}) };
}

// Progreso de varios alumnos en una sola consulta.
export async function getProgressMany(codes: string[]): Promise<StudentProgress[]> {
  return getJSONMany<StudentProgress>(
    codes.map((c) => `${PROGRESS_KEY_PREFIX}${c}`),
    (key) => emptyProgress(key.slice(PROGRESS_KEY_PREFIX.length))
  );
}

export async function saveProgress(progress: StudentProgress): Promise<void> {
  await setJSON(`${PROGRESS_KEY_PREFIX}${progress.code}`, progress);
  classSnapshotCache = null;
}

// "Foto" de la clase (alumnos + progreso de cada uno) para las pantallas que
// muestran a los compañeros (buzón, pizarrón, competencia, mapa). Se guarda
// unos segundos en memoria: así varias consultas seguidas no vuelven a leer
// todo. Para esas pantallas no importa si un dato tiene unos segundos.
const CLASS_SNAPSHOT_TTL_MS = 15_000;
let classSnapshotCache: { at: number; value: Promise<ClassSnapshot> } | null = null;

export interface ClassSnapshot {
  students: Student[];
  progress: Map<string, StudentProgress>;
}

export function getClassSnapshot(): Promise<ClassSnapshot> {
  const now = Date.now();
  if (classSnapshotCache && now - classSnapshotCache.at < CLASS_SNAPSHOT_TTL_MS) {
    return classSnapshotCache.value;
  }
  const value = (async () => {
    const students = await getStudents();
    const list = await getProgressMany(students.map((s) => s.code));
    // En memoria no hace falta el registro detallado de actividades.
    return {
      students,
      progress: new Map(list.map((p, i) => [students[i].code, { ...p, activityLog: [] }])),
    };
  })();
  classSnapshotCache = { at: now, value };
  value.catch(() => {
    classSnapshotCache = null;
  });
  return value;
}

// Sanea el apodo que elige el alumno: recorta espacios, saca caracteres de
// control y lo limita en longitud. Nunca toca Student.name (el nombre real
// que ve el docente).
function sanitizeNickname(raw: string): string {
  const noControlChars = raw.replace(/[\u0000-\u001f\u007f]/g, "");
  return noControlChars.trim().slice(0, MAX_NICKNAME_LENGTH);
}

const ALL_SLOTS_VALIDOS: AccessorySlot[] = ["headwear", "eyewear", "face", "torso", "backpack", "pendant", "pet", "prop"];

export interface ProfileUpdate {
  avatar?: string;
  nickname?: string;
  // Un valor por casillero: string para equipar ese accesorio, null para
  // sacárselo. Casilleros ausentes del objeto no se tocan.
  accessories?: Partial<Record<AccessorySlot, string | null>>;
  // Fondo del avatar: AUTO_BACKGROUND, uno de siempre o uno de temporada ya
  // ganado.
  background?: string;
  // Corrimiento y tamaño de cada objeto puesto (se valida y se acota).
  tweaks?: Partial<Record<AccessorySlot, { x?: unknown; y?: unknown; s?: unknown } | null>>;
}

// Actualiza el avatar, accesorios y/o apodo del alumno dentro de su
// progreso. Devuelve null si algo propuesto no es válido (avatar
// desconocido, accesorio que no existe, que no corresponde a ese casillero,
// o que todavía no desbloqueó según sus mundos completados) para que el
// endpoint responda con un error claro. No requiere clave de docente: es
// autoservicio del alumno con su propio código de acceso. La validación de
// accesorios desbloqueados se hace acá, contra progress.completedWorlds del
// servidor, para que no se puedan "trampear" accesorios bloqueados desde el
// cliente.
export async function updateStudentProfile(
  code: string,
  update: ProfileUpdate
): Promise<StudentProgress | null> {
  if (update.avatar !== undefined && !AVATAR_OPTIONS.includes(update.avatar)) {
    return null;
  }
  const progress = await getProgress(code);
  // Los avatares de la tienda solo si los compró.
  if (update.avatar !== undefined && !canUseAvatar(update.avatar, progress.shopCollection, progress.achievementCollection)) {
    return null;
  }
  // El personaje "efectivo" contra el que se validan los accesorios: el
  // nuevo, si se está cambiando en esta misma actualización, o si no el que
  // ya tenía. Cada personaje tiene su propio catálogo (ver
  // getAccessoryCatalogForAvatar): los estándar tienen guardarropa amplio,
  // el resto los accesorios simples de siempre.
  const effectiveAvatar = update.avatar !== undefined ? update.avatar : progress.avatar;

  let nextAccessories: AvatarAccessories | undefined = progress.avatarAccessories;
  if (update.accessories !== undefined) {
    const unlocked = getEquippableAccessoryIds(
      progress.completedWorlds.length,
      effectiveAvatar,
      progress.seasonalCollection,
      progress.shopCollection
    );
    const merged: AvatarAccessories = { ...(progress.avatarAccessories ?? {}) };
    for (const key of Object.keys(update.accessories) as AccessorySlot[]) {
      const value = update.accessories[key];
      if (value === null || value === undefined) {
        delete merged[key];
        continue;
      }
      const def = getAccessoryById(value);
      if (!def || def.slot !== key || !unlocked.has(value)) {
        return null;
      }
      merged[key] = value;
    }
    nextAccessories = merged;
  }
  // Si el personaje cambió de guardarropa (de "estándar" a uno de siempre, o
  // viceversa), cualquier accesorio que haya quedado equipado del guardarropa
  // anterior ya no es válido acá (otras rutas de imagen, otro catálogo): se
  // saca en vez de dejar un ícono roto.
  if (update.avatar !== undefined && nextAccessories) {
    const validIds = getValidAccessoryIdsForAvatar(effectiveAvatar);
    const cleaned: AvatarAccessories = {};
    for (const key of Object.keys(nextAccessories) as AccessorySlot[]) {
      const value = nextAccessories[key];
      if (value && validIds.has(value)) {
        cleaned[key] = value;
      }
    }
    nextAccessories = cleaned;
  }

  if (
    update.background !== undefined &&
    !isBackgroundSelectable(update.background, progress.seasonalCollection)
  ) {
    return null;
  }

  const next: StudentProgress = { ...progress };
  if (update.background !== undefined) {
    next.avatarBackground = update.background;
  }
  if (update.avatar !== undefined) {
    next.avatar = update.avatar;
  }
  if (update.accessories !== undefined || update.avatar !== undefined) {
    next.avatarAccessories = nextAccessories;
  }
  if (update.nickname !== undefined) {
    const clean = sanitizeNickname(update.nickname);
    next.nickname = clean.length > 0 ? clean : undefined;
  }
  if (update.tweaks !== undefined && update.tweaks && typeof update.tweaks === "object") {
    const num = (v: unknown, min: number, max: number, def: number) =>
      typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v * 10) / 10)) : def;
    const L = TWEAK_LIMITES;
    const out: AvatarTweaks = { ...(progress.avatarTweaks ?? {}) };
    for (const [slot, t] of Object.entries(update.tweaks) as [AccessorySlot, { x?: unknown; y?: unknown; s?: unknown } | null][]) {
      if (!ALL_SLOTS_VALIDOS.includes(slot)) continue;
      if (!t) {
        delete out[slot];
        continue;
      }
      const v = { x: num(t.x, -L.pos, L.pos, 0), y: num(t.y, -L.pos, L.pos, 0), s: num(t.s, L.sMin, L.sMax, 1) };
      if (v.x === 0 && v.y === 0 && v.s === 1) delete out[slot];
      else out[slot] = v;
    }
    next.avatarTweaks = Object.keys(out).length ? out : undefined;
  }
  await saveProgress(next);
  return next;
}

// --- Aventura de fin de semana (Memoria Numérica) ---

// Registro del día de hoy (si el guardado es de otro día, arranca de cero).
export function getTodayWeekendRecord(
  progress: StudentProgress,
  dayKey: string
): WeekendRecord {
  const r = progress.weekend;
  if (r && r.dayKey === dayKey) return r;
  return { dayKey, completed: 0, points: 0, finished: false };
}

export interface WeekendActivityResult {
  progress: StudentProgress;
  record: WeekendRecord;
  pointsEarned: number;
  perfectBonus: number;
  finalBonus: number;
  streak?: number;
}

// Registra una actividad resuelta del día. Los puntos se calculan acá (no
// los manda el cliente) y se acreditan como monedas. Al completar la
// décima se abre el cofre: bonus final, monedas extra según la racha de
// fines de semana y el próximo accesorio de la colección de fin de semana.
// Devuelve null si hoy no es fin de semana o si la actividad no es la que
// sigue (evita sumar dos veces la misma).
export async function completeWeekendActivity(
  code: string,
  activityIndex: number,
  errors: number,
  now: Date = new Date()
): Promise<WeekendActivityResult | null> {
  const today = getWeekendDay(now);
  if (!today) return null;
  const progress = await getProgress(code);
  const record = getTodayWeekendRecord(progress, today.dayKey);
  if (record.finished || activityIndex !== record.completed) return null;
  const plan = buildWeekendPlan(today.dayKey, today.day);
  const activity = plan.activities[activityIndex];
  if (!activity) return null;

  const { points, perfectBonus } = scoreActivity(activity, Math.max(0, errors));
  const next: WeekendRecord = {
    ...record,
    completed: record.completed + 1,
    points: record.points + points,
  };
  let coins = progress.coins + points;
  let finalBonus = 0;
  let streak: number | undefined;
  const updated: StudentProgress = { ...progress };

  if (next.completed >= ACTIVITIES_PER_DAY) {
    finalBonus = FINAL_BONUS;
    next.points += FINAL_BONUS;
    next.finished = true;
    // La racha de fines de semana usa la fecha de calendario argentina.
    const argDay = new Date(`${today.dayKey}T12:00:00`);
    streak = computeNextStreak(progress, argDay);
    const chestCoins = FINAL_BONUS + computeSpecialChallengeReward(streak);
    coins += chestCoins;
    const owned = new Set(progress.seasonalCollection ?? []);
    const accessoryId = WEEKEND_REWARD_IDS.find((id) => !owned.has(id));
    if (accessoryId) owned.add(accessoryId);
    next.reward = { coins: chestCoins, accessoryId };
    updated.seasonalCollection = [...owned];
    updated.specialChallengeStreak = streak;
    updated.lastSpecialChallengeWeekendKey = weekendKey(argDay);
    updated.lastSpecialChallengeAt = today.dayKey;
    updated.weekendDaysCompleted = (progress.weekendDaysCompleted ?? 0) + 1;
  }
  updated.coins = coins;
  updated.weekend = next;
  await saveProgress(updated);
  return { progress: updated, record: next, pointsEarned: points, perfectBonus, finalBonus, streak };
}

// Para el Mapa de Mundos: cuántos compañeros de clase están "actualmente" en
// cada mundo de una materia. El mundo "actual" de un alumno es el primero,
// en el orden de la materia, que todavía no completó (si ya los completó
// todos, no cuenta en ningún mundo). No distingue quién es quién: es solo un
// contador anónimo por mundo, para que los chicos vean por dónde andan sus
// compañeros sin exponer nombres ni apodos de nadie.
export async function getClassmateWorldCounts(
  subjectWorldIdsInOrder: number[],
  me: Student
): Promise<Record<number, number>> {
  const { students, progress: all } = await getClassSnapshot();
  const counts: Record<number, number> = {};
  for (const s of classmatesOf(me, students)) {
    if (s.code.toUpperCase() === me.code.toUpperCase()) continue;
    const progress = all.get(s.code) ?? emptyProgress(s.code);
    const currentWorldId = subjectWorldIdsInOrder.find((id) => !progress.completedWorlds.includes(id));
    if (currentWorldId !== undefined) counts[currentWorldId] = (counts[currentWorldId] ?? 0) + 1;
  }
  return counts;
}

export async function getWorldsConfig(): Promise<WorldsConfig> {
  return getJSON<WorldsConfig>(WORLDS_CONFIG_KEY, {
    enabledWorldIds: [WORLDS[0].id], // por defecto solo el primer mundo habilitado
  });
}

// Mundos habilitados para un alumno: los de su aula en la plataforma, o
// los del aula abierta de prueba, o los del aula piloto (configuración de siempre).
export async function getEnabledWorldIdsFor(student: Student | undefined): Promise<number[]> {
  const grade = gradeOf(student);
  if (grade !== DEFAULT_GRADE) {
    // Otros grados (1.º…): sus propios mundos. Por defecto, todos los que
    // tienen contenido (se abren de a poco por prerrequisitos).
    const all = gradeWorldIds(grade);
    if (student?.classroomId) {
      const ids = await getClassroomWorlds(student.classroomId);
      const own = ids?.filter((id) => all.includes(id));
      if (own && own.length) return own;
    }
    return (await getGradeWorldsConfig(grade)).enabledWorldIds;
  }
  if (student?.classroomId === OPEN_CLASSROOM_ID) {
    const openWorlds = await getJSON<WorldsConfig | null>(`worldsConfig:${OPEN_CLASSROOM_ID}`, null);
    if (openWorlds?.enabledWorldIds && openWorlds.enabledWorldIds.length > 0) {
      return openWorlds.enabledWorldIds;
    }
    return (await getWorldsConfig()).enabledWorldIds;
  }
  if (student?.classroomId) {
    const ids = await getClassroomWorlds(student.classroomId);
    if (ids) return ids;
    return [WORLDS[0].id];
  }
  return (await getWorldsConfig()).enabledWorldIds;
}

export async function saveWorldsConfig(config: WorldsConfig): Promise<void> {
  await setJSON(WORLDS_CONFIG_KEY, config);
}

const CURRICULUM_VALIDATED_KEY = "curriculum_validated_worlds";

export async function getValidatedCurriculumWorldIds(): Promise<number[]> {
  return getJSON<number[]>(CURRICULUM_VALIDATED_KEY, []);
}

export async function validateCurriculumWorld(worldId: number, validated = true): Promise<number[]> {
  const current = await getValidatedCurriculumWorldIds();
  const set = new Set(current);
  if (validated) {
    set.add(worldId);
  } else {
    set.delete(worldId);
  }
  const next = Array.from(set).sort((a, b) => a - b);
  await setJSON(CURRICULUM_VALIDATED_KEY, next);
  return next;
}

// Mundos con contenido de un grado (no 3.º).
export function gradeWorldIds(grade: number): number[] {
  return getGrade(grade)
    .worlds.filter((w) => grade !== 1 || grade1HasContent(w))
    .map((w) => w.id);
}

// Mundos habilitados del aula piloto para otro grado (clave
// worldsConfig:g<grado>). Por defecto, todos.
export async function getGradeWorldsConfig(grade: number): Promise<WorldsConfig> {
  const all = gradeWorldIds(grade);
  const cfg = await getJSON<WorldsConfig | null>(`${WORLDS_CONFIG_KEY}:g${grade}`, null);
  const ids = cfg?.enabledWorldIds?.filter((id) => all.includes(id));
  return { enabledWorldIds: cfg ? ids ?? [] : all };
}

export async function saveGradeWorldsConfig(grade: number, config: WorldsConfig): Promise<void> {
  await setJSON(`${WORLDS_CONFIG_KEY}:g${grade}`, config);
}

// El docente cambia el grado de un alumno del aula piloto.
export async function setStudentGrade(code: string, grade: number): Promise<void> {
  const students = await getStudents();
  const updated = students.map((s) => {
    if (s.code !== code) return s;
    const next: Student = { ...s, grade };
    if (grade === DEFAULT_GRADE) delete next.grade;
    return next;
  });
  await setJSON(STUDENTS_KEY, updated);
  classSnapshotCache = null;
}

// ---------- Tienda ----------
export type PurchaseResult =
  | { ok: true; progress: StudentProgress }
  | { ok: false; error: string };

// Compra un avatar u objeto de la tienda con monedas. Se valida todo en el
// servidor (precio, monedas y que no lo tenga ya).
export async function buyShopItem(code: string, itemId: string): Promise<PurchaseResult> {
  const avatar = getShopAvatar(itemId);
  const accessory = ACCESSORY_CATALOG_TIENDA.find((a) => a.id === itemId);
  const price = avatar?.price ?? accessory?.price;
  if (!price) return { ok: false, error: "Ese objeto no está en la tienda." };
  const progress = await getProgress(code);
  const owned = progress.shopCollection ?? [];
  if (owned.includes(itemId)) return { ok: false, error: "¡Ya lo tenés!" };
  if (avatar?.season && !enVenta(avatar.season, avatar.unicaVez)) {
    return { ok: false, error: "Este avatar solo se consigue durante su temporada." };
  }
  if (accessory?.drop) {
    const d = getDrop(accessory.drop);
    const ok = d ? puedeComprarDrop(progress, d, !!accessory.superEspecial) : { ok: false as const, motivo: "Ese lanzamiento no existe." };
    if (!ok.ok) return { ok: false, error: ok.motivo };
  }
  if (accessory?.season && !enVenta(accessory.season, accessory.unicaVez)) {
    return { ok: false, error: "Este objeto es por tiempo limitado y ahora no está a la venta." };
  }
  if (progress.coins < price) {
    return { ok: false, error: `Te faltan ${price - progress.coins} monedas.` };
  }
  const next: StudentProgress = {
    ...progress,
    coins: progress.coins - price,
    shopCollection: [...owned, itemId],
  };
  await saveProgress(next);
  return { ok: true, progress: next };
}

export function isDictationWorld(worldId: number): boolean {
  return worldId === 28001 || worldId === 38001;
}

// Acredita el resultado del Mundo del Dictado semanal en el servidor:
// - +20 monedas y accesorio «Lápiz dorado» si hace la primera vuelta de la semana al 100%
// - Registra errores cometidos para el informe docente
export function applyDictationWorldAttempt(
  progress: StudentProgress,
  worldId: number,
  correctCount: number,
  totalActivities: number,
  mistakes: string[] = [],
  fecha: Date = new Date()
): {
  progress: StudentProgress;
  rewardEarned: boolean;
  bonusCoins: number;
  lapizUnlocked: boolean;
} {
  const weekKey = claveSemanaDictado(fecha);
  const total = Math.max(1, totalActivities);
  const scorePct = Math.round((correctCount / total) * 100);
  const is100 = correctCount === total;

  const dictationWeeks = { ...(progress.dictationWeeks ?? {}) };
  const existingWeek = dictationWeeks[weekKey];

  let rewardEarned = false;
  let bonusCoins = 0;
  let lapizUnlocked = false;
  const seasonal = new Set(progress.seasonalCollection ?? []);

  if (!existingWeek) {
    // Primera vuelta de la semana
    if (is100) {
      rewardEarned = true;
      bonusCoins = 20;
      if (!seasonal.has("lapiz-dorado")) {
        seasonal.add("lapiz-dorado");
        lapizUnlocked = true;
      }
    }
    dictationWeeks[weekKey] = {
      firstScore: scorePct,
      rewarded: rewardEarned,
      mistakes: mistakes.length ? mistakes : undefined,
      completedAt: fecha.toISOString(),
    };
  } else {
    // Ya jugó en esta semana: no se duplica el premio de primera vuelta, pero se acumulan errores para el docente
    if (mistakes.length) {
      const existingMistakes = new Set(existingWeek.mistakes ?? []);
      mistakes.forEach((m) => existingMistakes.add(m));
      dictationWeeks[weekKey] = {
        ...existingWeek,
        mistakes: Array.from(existingMistakes),
      };
    }
  }

  const updated: StudentProgress = {
    ...progress,
    coins: progress.coins + bonusCoins,
    seasonalCollection: Array.from(seasonal),
    dictationWeeks,
    lastPlayedAt: fecha.toISOString(),
  };

  return {
    progress: updated,
    rewardEarned,
    bonusCoins,
    lapizUnlocked,
  };
}

const ALERT_CONFIG_KEY = "admin_alert_config";

export interface AlertConfigData {
  inactiveDaysThreshold: number;
}

export async function getTeacherAlertConfig(): Promise<AlertConfigData> {
  const config = await getJSON<AlertConfigData>(ALERT_CONFIG_KEY, {
    inactiveDaysThreshold: 7,
  });
  return {
    inactiveDaysThreshold:
      typeof config?.inactiveDaysThreshold === "number" && config.inactiveDaysThreshold > 0
        ? config.inactiveDaysThreshold
        : 7,
  };
}

export async function setTeacherAlertConfig(config: AlertConfigData): Promise<void> {
  const sanitized: AlertConfigData = {
    inactiveDaysThreshold: Math.max(1, Math.min(60, config.inactiveDaysThreshold ?? 7)),
  };
  await setJSON(ALERT_CONFIG_KEY, sanitized);
}

// --- Torneo de velocidad con las tablas (Fin de semana) ---

/**
 * Devuelve la clave del sábado correspondiente al fin de semana de la fecha dada (hora argentina).
 * Sirve para agrupar las participaciones del sábado y domingo bajo el mismo torneo semanal.
 */
export function weekendSaturdayKey(now: Date = new Date()): string {
  const d = getArgentinaDate(now);
  const dt = new Date(Date.UTC(d.year, d.month - 1, d.day));
  const dow = dt.getUTCDay(); // 0 domingo ... 6 sábado
  const daysSinceSaturday = (dow + 1) % 7;
  dt.setUTCDate(dt.getUTCDate() - daysSinceSaturday);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export interface TorneoResultado {
  tabla: number;
  ms: number;
  errores: number;
  medalla: MedallaTorneo;
  monedasGanadas: number;
  coins: number;
  mejorMs: number;
  esMejorTiempo: boolean;
  nuevoObjeto?: PremioGrupoItem;
  satKey: string;
}

/**
 * Registra una partida completada en el Torneo de tablas:
 * - Valida disponibilidad de fin de semana (hora argentina).
 * - Calcula la medalla según metas de tiempos.ts.
 * - Acredita monedas (oro: 15, plata: 8, bronce: 3), máximo una vez por tabla y por día.
 * - Desbloquea objeto especial la primera vez que se logra oro en su grupo.
 * - Actualiza el mejor tiempo histórico del fin de semana.
 */
export async function completeTorneoTable(
  code: string,
  tabla: number,
  ms: number,
  errores: number,
  now: Date = new Date()
): Promise<TorneoResultado | { error: string }> {
  const today = getWeekendDay(now);
  if (!today) {
    return { error: "El torneo de las tablas solo está disponible el fin de semana (sábados y domingos)." };
  }

  if (!Number.isInteger(tabla) || tabla < 2 || tabla > 10) {
    return { error: "Tabla inválida (debe ser del 2 al 10)." };
  }
  if (typeof ms !== "number" || ms < 5000 || ms > 600000) {
    return { error: "Tiempo fuera de rango (5s a 600s)." };
  }
  if (typeof errores !== "number" || errores < 0 || errores > 50) {
    return { error: "Cantidad de errores fuera de rango (0 a 50)." };
  }

  const student = await findStudentByCode(code);
  if (!student) {
    return { error: "Alumno no encontrado." };
  }

  const progress = await getProgress(student.code);
  const satKey = weekendSaturdayKey(now);
  const todayKey = today.dayKey;

  const medalla = calcularMedalla(tabla, ms);

  // Monedas: una vez por tabla y por día
  const weekendRecords = progress.tablasTorneo?.[satKey] ?? {};
  const tablaRecord = weekendRecords[tabla];
  const diasCobrados = tablaRecord?.monedasDia ?? [];
  const yaCobroHoy = diasCobrados.includes(todayKey);
  let monedasGanadas = 0;
  const monedasDia = [...diasCobrados];

  if (!yaCobroHoy) {
    monedasGanadas = MONEDAS_MEDALLA[medalla];
    monedasDia.push(todayKey);
  }

  // Objeto especial por primera vez logrando oro en el grupo de la tabla
  let nuevoObjeto: PremioGrupoItem | undefined;
  const ownedAccessories = new Set(progress.seasonalCollection ?? []);
  if (medalla === "oro") {
    const premio = premioGrupoParaTabla(tabla);
    if (premio && !ownedAccessories.has(premio.id)) {
      ownedAccessories.add(premio.id);
      nuevoObjeto = premio;
    }
  }

  // Mejor tiempo del fin de semana
  const prevMejorMs = tablaRecord?.mejorMs;
  const esMejorTiempo = prevMejorMs === undefined || ms < prevMejorMs;
  const mejorMs = esMejorTiempo ? ms : prevMejorMs;
  const mejorMedalla = esMejorTiempo ? medalla : tablaRecord.medalla;
  const finalErrores = esMejorTiempo ? errores : tablaRecord?.errores ?? errores;

  const updated: StudentProgress = {
    ...progress,
    coins: progress.coins + monedasGanadas,
    seasonalCollection: [...ownedAccessories],
    tablasTorneo: {
      ...(progress.tablasTorneo ?? {}),
      [satKey]: {
        ...weekendRecords,
        [tabla]: {
          mejorMs,
          medalla: mejorMedalla,
          errores: finalErrores,
          monedasDia,
        },
      },
    },
    lastPlayedAt: now.toISOString(),
  };

  await saveProgress(updated);

  return {
    tabla,
    ms,
    errores,
    medalla,
    monedasGanadas,
    coins: updated.coins,
    mejorMs,
    esMejorTiempo,
    nuevoObjeto,
    satKey,
  };
}

export interface TorneoRankingEntry {
  displayName: string;
  mejorMs: number;
  medalla: MedallaTorneo;
}

/**
 * Obtiene el ranking de los 5 mejores tiempos del aula para una tabla en el fin de semana actual.
 * Respeta estrictamente la privacidad (AG-07): muestra solo el nombre visible / apodo.
 */
export async function getClassroomTorneoRanking(
  code: string,
  tabla: number,
  now: Date = new Date()
): Promise<TorneoRankingEntry[]> {
  const me = await findStudentByCode(code);
  if (!me) return [];

  const satKey = weekendSaturdayKey(now);
  const allStudents = await getStudents();
  const classmates = classmatesOf(me, allStudents);

  const progresses = await getProgressMany(classmates.map((c) => c.code));
  const progressMap = new Map<string, StudentProgress>(progresses.map((p) => [p.code, p]));

  const entries: TorneoRankingEntry[] = [];

  for (const classmate of classmates) {
    const p = progressMap.get(classmate.code);
    const rec = p?.tablasTorneo?.[satKey]?.[tabla];
    if (rec && typeof rec.mejorMs === "number") {
      entries.push({
        displayName: displayName(classmate, p),
        mejorMs: rec.mejorMs,
        medalla: rec.medalla,
      });
    }
  }

  // Ordenar de menor a mayor tiempo (el más rápido primero)
  entries.sort((a, b) => a.mejorMs - b.mejorMs);

  // Máximo los 5 primeros puestos
  return entries.slice(0, 5);
}


