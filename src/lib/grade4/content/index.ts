// Actividades de los mundos de 4.º grado, por materia.
import type { ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import { buildLenguaActivities } from "./lengua";
import { buildMatematicaActivities } from "./matematica";
import { buildSocialesActivities } from "./sociales";
import { buildNaturalesActivities } from "./naturales";
import { numbered, shuffle } from "./util";
import { GRADE4_WORLDS } from "../worlds";

// Zona de práctica: actividades de una habilidad, de los mundos que ya jugó.
function buildPractice(world: WorldDef): ActivitySpec[] {
  const skill = world.skills?.[0];
  if (!skill) return [];
  const pool: ActivitySpec[] = [];
  for (const id of world.prerequisites ?? []) {
    const src = GRADE4_WORLDS.find((w) => w.id === id);
    if (!src) continue;
    pool.push(...buildGrade4Activities(src).filter((a) => a.skills?.includes(skill)));
  }
  return numbered(shuffle(pool).slice(0, world.activityCount ?? 8));
}

export function buildGrade4Activities(world: WorldDef): ActivitySpec[] {
  if (world.kind === "refuerzo") return buildPractice(world);
  switch (world.subject) {
    case "lengua":
      return buildLenguaActivities(world);
    case "matematica":
      return buildMatematicaActivities(world);
    case "sociales":
      return buildSocialesActivities(world);
    case "naturales":
      return buildNaturalesActivities(world);
    default:
      return [];
  }
}

// ¿El mundo ya tiene contenido? En 4.º grado, todos los mundos del catálogo tienen contenido completo.
export function grade4HasContent(world: WorldDef): boolean {
  return world.grade === 4;
}
