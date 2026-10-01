// Actividades de los mundos de 1.º grado, por materia.
import type { ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import { buildLenguaActivities } from "./lengua";
import { buildMatematicaActivities } from "./matematica";
import { SOCIALES_BANK } from "./sociales";
import { NATURALES_BANK } from "./naturales";
import { fromBank, numbered, shuffle } from "./util";
import { GRADE1_WORLDS } from "../worlds";

// Zona de práctica: actividades de una habilidad, de los mundos que ya jugó.
function buildPractice(world: WorldDef): ActivitySpec[] {
  const skill = world.skills?.[0];
  if (!skill) return [];
  const pool: ActivitySpec[] = [];
  for (const id of world.prerequisites ?? []) {
    const src = GRADE1_WORLDS.find((w) => w.id === id);
    if (!src) continue;
    pool.push(...buildGrade1Activities(src).filter((a) => a.skills?.includes(skill)));
  }
  return numbered(shuffle(pool).slice(0, world.activityCount ?? 8));
}

export function buildGrade1Activities(world: WorldDef): ActivitySpec[] {
  if (world.kind === "refuerzo") return buildPractice(world);
  const n = world.worldNumber ?? 0;
  const count = world.activityCount ?? 8;
  switch (world.subject) {
    case "lengua":
      return buildLenguaActivities(world);
    case "matematica":
      return buildMatematicaActivities(world);
    case "sociales":
      return numbered(fromBank(SOCIALES_BANK[n] ?? [], count, `s${n}`, world.skills ?? []));
    case "naturales":
      return numbered(fromBank(NATURALES_BANK[n] ?? [], count, `n${n}`, world.skills ?? []));
  }
}

// ¿El mundo ya tiene contenido? (los que no, no se muestran).
export function grade1HasContent(world: WorldDef): boolean {
  const n = world.worldNumber ?? 0;
  if (world.subject === "sociales") return (SOCIALES_BANK[n]?.length ?? 0) > 0;
  if (world.subject === "naturales") return (NATURALES_BANK[n]?.length ?? 0) > 0;
  return true;
}
