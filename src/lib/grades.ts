// Registro de grados. Cada grado tiene su propio catálogo de mundos (ids en
// rangos separados), su criterio de dominio y su rango de ids. Para sumar
// 2.º, 4.º… se agrega un registro acá y su catálogo: el mapa, el progreso y
// el panel docente lo toman solos.
import { Student, StudentProgress, WorldDef } from "@/types";
import { WORLDS } from "@/lib/worlds";
import { GRADE1_WORLDS } from "@/lib/grade1/worlds";
import { GRADE1_SKILLS, SkillDef } from "@/lib/grade1/skills";
import { GRADE2_WORLDS } from "@/lib/grade2/worlds";
import { GRADE2_SKILLS } from "@/lib/grade2/skills";

// Ambiente visual de cada grado: el recorrido de 1.º a 7.º pasa por
// distintos paisajes de Santa Cruz (1.º costa, 2.º bosque de lengas, 3.º
// meseta y montaña, 4.º glaciares…), con la misma interfaz: islas en un
// sendero y 4 etapas de paisaje que crecen con el avance.
export interface GradeTheme {
  id: string;
  label: string;
  island: (worldId: number) => string; // imagen de la isla de cada mundo
  map: (stage: number) => string; // fondo del mapa (etapas 1–4)
  scenery: "mountains" | "seashore" | "forest"; // silueta de fondo (SVG)
  dayBg: string; // clase CSS del fondo de día (mapa)
  nightBg: string; // clase CSS del fondo de noche (actividades)
}

export const THEMES: Record<string, GradeTheme> = {
  meseta: {
    id: "meseta",
    label: "Meseta y montaña",
    // TEMPORAL: las lecturas (31101+) usan la isla de la Biblioteca hasta tener las suyas.
    island: (id) => (id > 31100 && id < 31200 ? "/theme/islands/mundo-16.png" : `/theme/islands/mundo-${id}.png`),
    map: (stage) => `/theme/map/etapa-${stage}.jpg`,
    scenery: "mountains",
    dayBg: "bg-explorer-day",
    nightBg: "bg-explorer-night",
  },
  costa: {
    id: "costa",
    label: "Costa patagónica",
    // Las zonas de práctica (ids 19000+) comparten una isla propia.
    island: (id) => ((id >= 19000 && id < 20000) || (id > 11100 && id < 11200) ? "/theme/grados/1/islas/practica.png" : `/theme/grados/1/islas/mundo-${id}.png`),
    map: (stage) => `/theme/grados/1/mapa/etapa-${stage}.jpg`,
    scenery: "seashore",
    dayBg: "bg-costa-day",
    nightBg: "bg-costa-night",
  },
  bosque: {
    id: "bosque",
    label: "Bosque de lengas",
    // Las zonas de práctica de 2.º (ids 29000+) comparten su propia isla.
    island: (id) => ((id >= 29000 && id < 30000) || (id > 21100 && id < 21200) ? "/theme/grados/2/islas/practica.png" : `/theme/grados/2/islas/mundo-${id}.png`),
    map: (stage) => `/theme/grados/2/mapa/etapa-${stage}.jpg`,
    scenery: "forest",
    dayBg: "bg-bosque-day",
    nightBg: "bg-bosque-night",
  },
};

export interface GradeDef {
  grade: number;
  label: string;
  theme: GradeTheme;
  worlds: WorldDef[];
  skills?: SkillDef[];
  masteryPct: number; // % para quedar "a un repaso de completar"
  unlockPct: number; // % de una vuelta que abre los mundos que siguen
}

export const GRADES: GradeDef[] = [
  { grade: 1, label: "1.º grado", theme: THEMES.costa, worlds: GRADE1_WORLDS, skills: GRADE1_SKILLS, masteryPct: 80, unlockPct: 60 },
  { grade: 2, label: "2.º grado", theme: THEMES.bosque, worlds: GRADE2_WORLDS, skills: GRADE2_SKILLS, masteryPct: 85, unlockPct: 60 },
  { grade: 3, label: "3.º grado", theme: THEMES.meseta, worlds: WORLDS, masteryPct: 90, unlockPct: 0 },
];

export const DEFAULT_GRADE = 3;

export function gradeOf(student: Pick<Student, "grade"> | null | undefined): number {
  return student?.grade ?? DEFAULT_GRADE;
}

export function getGrade(grade: number): GradeDef {
  return GRADES.find((g) => g.grade === grade) ?? GRADES.find((g) => g.grade === DEFAULT_GRADE)!;
}

export function themeForGrade(grade: number): GradeTheme {
  return getGrade(grade).theme;
}

export function themeForWorld(world: Pick<WorldDef, "grade">): GradeTheme {
  return getGrade(world.grade ?? DEFAULT_GRADE).theme;
}

export function gradeOfWorld(worldId: number): number {
  return GRADES.find((g) => g.worlds.some((w) => w.id === worldId))?.grade ?? DEFAULT_GRADE;
}

export function masteryPctForWorld(worldId: number): number {
  return getGrade(gradeOfWorld(worldId)).masteryPct;
}

// ¿Qué mundo previo falta? En 1.º, un mundo se abre cuando sus
// prerrequisitos están logrados o tuvieron una vuelta con 60% o más (un
// error no bloquea para siempre). Devuelve el nombre del que falta.
export function missingPrerequisite(world: WorldDef, progress: StudentProgress, enabledIds: number[]): string | null {
  const g = getGrade(world.grade ?? DEFAULT_GRADE);
  if (!g.unlockPct || !world.prerequisites?.length || world.kind === "refuerzo") return null;
  const done = new Set(progress.completedWorlds);
  const pending = new Set(progress.worldsPendingReinforcementRetry ?? []);
  for (const pid of world.prerequisites) {
    // Si el docente no habilitó el mundo previo, no se exige.
    if (!enabledIds.includes(pid)) continue;
    if (done.has(pid) || pending.has(pid)) continue;
    if ((progress.lastWorldAttemptScore?.[pid] ?? 0) >= g.unlockPct) continue;
    return g.worlds.find((w) => w.id === pid)?.name ?? "el mundo anterior";
  }
  return null;
}
