import {
  AVATAR_OPTIONS,
  MAX_NICKNAME_LENGTH,
  Student,
  StudentProgress,
  StudentType,
  WorldsConfig,
} from "@/types";
import { getJSON, setJSON } from "@/lib/store";
import { generateUniqueCode } from "@/lib/codes";
import { WORLDS } from "@/lib/worlds";

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
}

// Actualiza el avatar y/o apodo del alumno dentro de su progreso. Devuelve
// null si el avatar propuesto no es válido (para que el endpoint responda
// con un error claro). No requiere clave de docente: es autoservicio del
// alumno con su propio código de acceso.
export async function updateStudentProfile(
  code: string,
  update: ProfileUpdate
): Promise<StudentProgress | null> {
  if (update.avatar !== undefined && !AVATAR_OPTIONS.includes(update.avatar)) {
    return null;
  }
  const progress = await getProgress(code);
  const next: StudentProgress = { ...progress };
  if (update.avatar !== undefined) {
    next.avatar = update.avatar;
  }
  if (update.nickname !== undefined) {
    const clean = sanitizeNickname(update.nickname);
    next.nickname = clean.length > 0 ? clean : undefined;
  }
  await saveProgress(next);
  return next;
}

export async function getWorldsConfig(): Promise<WorldsConfig> {
  return getJSON<WorldsConfig>(WORLDS_CONFIG_KEY, {
    enabledWorldIds: [WORLDS[0].id], // por defecto solo el primer mundo habilitado
  });
}

export async function saveWorldsConfig(config: WorldsConfig): Promise<void> {
  await setJSON(WORLDS_CONFIG_KEY, config);
}
