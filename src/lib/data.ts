import {
  AVATAR_OPTIONS,
  AccessorySlot,
  AvatarAccessories,
  MAX_NICKNAME_LENGTH,
  Student,
  StudentProgress,
  StudentType,
  WEEKEND_REWARD_IDS,
  WeekendRecord,
  WorldsConfig,
  getAccessoryById,
  getEquippableAccessoryIds,
  getValidAccessoryIdsForAvatar,
  isBackgroundSelectable,
} from "@/types";
import { getJSON, setJSON } from "@/lib/store";
import { generateUniqueCode } from "@/lib/codes";
import { WORLDS } from "@/lib/worlds";
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
  type: StudentType = "agregado"
): Promise<Student> {
  const students = await getStudents();
  const existingCodes = new Set(students.map((s) => s.code));
  const code = generateUniqueCode(existingCodes);
  const student: Student = {
    code,
    name,
    type,
    createdAt: new Date().toISOString(),
  };
  const updated = [...students, student];
  await setJSON(STUDENTS_KEY, updated);
  return student;
}

export async function deleteStudent(code: string): Promise<void> {
  const students = await getStudents();
  const updated = students.filter((s) => s.code !== code);
  await setJSON(STUDENTS_KEY, updated);
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
  return true;
}

export async function findStudentByCode(
  code: string
): Promise<Student | undefined> {
  const students = await getStudents();
  return students.find((s) => s.code.toUpperCase() === code.toUpperCase());
}

export async function getProgress(code: string): Promise<StudentProgress> {
  return getJSON<StudentProgress>(`${PROGRESS_KEY_PREFIX}${code}`, {
    code,
    completedWorlds: [],
    activityLog: [],
    coins: 0,
  });
}

export async function saveProgress(progress: StudentProgress): Promise<void> {
  await setJSON(`${PROGRESS_KEY_PREFIX}${progress.code}`, progress);
}

// Sanea el apodo que elige el alumno: recorta espacios, saca caracteres de
// control y lo limita en longitud. Nunca toca Student.name (el nombre real
// que ve el docente).
function sanitizeNickname(raw: string): string {
  const noControlChars = raw.replace(/[\u0000-\u001f\u007f]/g, "");
  return noControlChars.trim().slice(0, MAX_NICKNAME_LENGTH);
}

export interface ProfileUpdate {
  avatar?: string;
  nickname?: string;
  // Un valor por casillero: string para equipar ese accesorio, null para
  // sacárselo. Casilleros ausentes del objeto no se tocan.
  accessories?: Partial<Record<AccessorySlot, string | null>>;
  // Fondo del avatar: AUTO_BACKGROUND, uno de siempre o uno de temporada ya
  // ganado.
  background?: string;
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
      progress.seasonalCollection
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
  excludeCode: string
): Promise<Record<number, number>> {
  const students = await getStudents();
  const counts: Record<number, number> = {};
  await Promise.all(
    students
      .filter((s) => s.code.toUpperCase() !== excludeCode.toUpperCase())
      .map(async (s) => {
        const progress = await getProgress(s.code);
        const currentWorldId = subjectWorldIdsInOrder.find(
          (id) => !progress.completedWorlds.includes(id)
        );
        if (currentWorldId !== undefined) {
          counts[currentWorldId] = (counts[currentWorldId] ?? 0) + 1;
        }
      })
  );
  return counts;
}

export async function getWorldsConfig(): Promise<WorldsConfig> {
  return getJSON<WorldsConfig>(WORLDS_CONFIG_KEY, {
    enabledWorldIds: [WORLDS[0].id], // por defecto solo el primer mundo habilitado
  });
}

export async function saveWorldsConfig(config: WorldsConfig): Promise<void> {
  await setJSON(WORLDS_CONFIG_KEY, config);
}
