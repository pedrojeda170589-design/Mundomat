// Registro de grados. Cada grado tiene su propio catálogo de mundos (ids en
// rangos separados), su criterio de dominio y su rango de ids. Para sumar
// 2.º, 4.º… se agrega un registro acá y su catálogo: el mapa, el progreso y
// el panel docente lo toman solos.
import { Student, StudentProgress, WorldDef } from "@/types";
import { WORLDS } from "@/lib/worlds";
import { GRADE1_WORLDS } from "@/lib/grade1/worlds";

export interface GradeDef {
  grade: number;
  label: string;
  worlds: WorldDef[];
  masteryPct: number; // % para quedar "a un repaso de completar"
  unlockPct: number; // % de una vuelta que abre los mundos que siguen
}

export const GRADES: GradeDef[] = [
  { grade: 1, label: "1.º grado", worlds: GRADE1_WORLDS, masteryPct: 80, unlockPct: 60 },
  { grade: 3, label: "3.º grado", worlds: WORLDS, masteryPct: 90, unlockPct: 0 },
];

export const DEFAULT_GRADE = 3;

export function gradeOf(student: Pick<Student, "grade"> | null | undefined): number {
  return student?.grade ?? DEFAULT_GRADE;
}

export function getGrade(grade: number): GradeDef {
  return GRADES.find((g) => g.grade === grade) ?? GRADES.find((g) => g.grade === DEFAULT_GRADE)!;
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
