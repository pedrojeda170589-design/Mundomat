// Actividades de los mundos de 2.º grado, por materia.
import type { ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import { buildLenguaActivities } from "./lengua";
import { buildMatematicaActivities } from "./matematica";
import { SOCIALES_BANK, EXTRA_SOCIALES } from "./sociales";
import { NATURALES_BANK, EXTRA_NATURALES } from "./naturales";
import { fromBank, numbered, sample, shuffle } from "./util";
import { GRADE2_WORLDS } from "../worlds";

// Zona de práctica: actividades de una habilidad, de los mundos que ya jugó.
function buildPractice(world: WorldDef): ActivitySpec[] {
  const skill = world.skills?.[0];
  if (!skill) return [];
  const pool: ActivitySpec[] = [];
  for (const id of world.prerequisites ?? []) {
    const src = GRADE2_WORLDS.find((w) => w.id === id);
    if (!src) continue;
    pool.push(...buildGrade2Activities(src).filter((a) => a.skills?.includes(skill)));
  }
  return numbered(shuffle(pool).slice(0, world.activityCount ?? 8));
}

export function buildGrade2Activities(world: WorldDef): ActivitySpec[] {
  if (world.kind === "refuerzo") return buildPractice(world);
  const n = world.worldNumber ?? 0;
  const count = world.activityCount ?? 8;
  switch (world.subject) {
    case "lengua":
      return buildLenguaActivities(world);
    case "matematica":
      return buildMatematicaActivities(world);
    case "sociales": {
      const qCount = Math.max(0, count - 2);
      const qActs = fromBank(SOCIALES_BANK[n] ?? [], qCount, `s${n}`, world.skills ?? []);
      const extraPool = EXTRA_SOCIALES[n] ?? [];
      const extraActs = sample(extraPool, Math.min(count - qActs.length, extraPool.length)).map((a, i) => ({
        ...a,
        id: `${a.id || `s${n}-ex-${i}`}`,
        skills: a.skills ?? world.skills ?? [],
      }));
      return numbered(shuffle([...qActs, ...extraActs]));
    }
    case "naturales": {
      const qCount = Math.max(0, count - 2);
      const qActs = fromBank(NATURALES_BANK[n] ?? [], qCount, `n${n}`, world.skills ?? []);
      const extraPool = EXTRA_NATURALES[n] ?? [];
      const extraActs = sample(extraPool, Math.min(count - qActs.length, extraPool.length)).map((a, i) => ({
        ...a,
        id: `${a.id || `n${n}-ex-${i}`}`,
        skills: a.skills ?? world.skills ?? [],
      }));
      return numbered(shuffle([...qActs, ...extraActs]));
    }
  }
}

// ¿El mundo ya tiene contenido? En 2.º grado, todos los mundos del catálogo tienen contenido completo.
export function grade2HasContent(world: WorldDef): boolean {
  return world.grade === 2;
}
