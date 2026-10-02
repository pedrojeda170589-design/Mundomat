// Zonas de práctica automáticas (1.º grado): cuando una habilidad queda en
// "aprendiendo" después de varios intentos, aparece en el mapa una zona con
// actividades de esa habilidad, tomadas de los mundos que ya jugó. No cuenta
// como mundo: es práctica extra, sin bloqueos.
import { StudentProgress, WorldDef, WorldSubject } from "@/types";
import { skillLevel } from "@/lib/progressLogic";
import { getGrade } from "@/lib/grades";
import { GRADE1_SKILLS } from "./skills";

export const PRACTICE_BASE_ID = 19000;
export const GRADE2_PRACTICE_BASE_ID = 29000;
const MIN_ANSWERS = 6;

export function isPracticeWorldId(id: number): boolean {
  return (id >= PRACTICE_BASE_ID && id < PRACTICE_BASE_ID + 1000) || (id >= GRADE2_PRACTICE_BASE_ID && id < GRADE2_PRACTICE_BASE_ID + 1000);
}

export function practiceZonesFor(progress: StudentProgress, subject: WorldSubject, grade: number = 1): WorldDef[] {
  const g = getGrade(grade);
  const skills = g.skills ?? (grade === 1 ? GRADE1_SKILLS : []);
  const worlds = g.worlds;
  const baseId = grade === 2 ? GRADE2_PRACTICE_BASE_ID : PRACTICE_BASE_ID;

  // Mundos ya jugados (con al menos una vuelta terminada).
  const played = new Set<number>(progress.completedWorlds);
  for (const id of Object.keys(progress.lastWorldAttemptScore ?? {})) played.add(Number(id));
  const zones: WorldDef[] = [];
  skills.forEach((skill, idx) => {
    if (skill.subject !== subject) return;
    const st = progress.skillStats?.[skill.id];
    if (!st || st.c + st.i < MIN_ANSWERS || skillLevel(st) !== "aprendiendo") return;
    const sources = worlds.filter((w) => played.has(w.id) && w.skills?.includes(skill.id)).map((w) => w.id);
    if (!sources.length) return;
    zones.push({
      id: baseId + idx,
      grade,
      name: `Zona de práctica: ${skill.label}`,
      emoji: "🎯",
      subject,
      category: "oralidad-inicial",
      description: "Practicá un poco más esta habilidad.",
      skills: [skill.id],
      prerequisites: sources,
      kind: "refuerzo",
      activityCount: 8,
      colorFrom: "#fef9c3",
      colorTo: "#f59e0b",
      difficulty: "basico",
    });
  });
  return zones.slice(0, 2);
}
