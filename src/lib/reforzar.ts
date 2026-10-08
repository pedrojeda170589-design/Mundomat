// Agrupamiento y normalización de contenidos curriculares a reforzar por materia y eje.
import { Student, StudentProgress, WorldDef } from "@/types";
import {
  CurriculoId,
  getCurriculoActivo,
  getCurriculumEntry,
} from "@/lib/curriculo";
import { getWorld } from "@/lib/worlds";
import { getStudentWorldSummary } from "@/lib/courseSummary";
import { SkillLevel, subjectLabel } from "@/lib/platform/shared";

export interface ContenidoRefuerzoItem {
  worldId: number;
  contenido: string; // WorldDef.description o habilidad
  contenidoDetallado?: string; // CurriculumEntry.contenido completo
  fuente?: string; // CurriculumEntry.fuente
  validado?: boolean;
  mundo: string; // WorldDef.name
  nivel: SkillLevel;
  precision?: number;
}

export interface GrupoRefuerzoPorEje {
  materia: string;
  materiaId: string;
  eje: string;
  items: ContenidoRefuerzoItem[];
}

export type WorldReinforcementInput =
  | number
  | {
      worldId: number;
      nivel?: SkillLevel;
      precision?: number;
      bestScore?: number;
      contenido?: string;
    };

export interface ContenidosAReforzarOptions {
  curriculoId?: CurriculoId;
  validatedIds?: Set<number> | number[];
  worlds?: WorldDef[];
  useSkills?: boolean;
}

// Jerarquía de severidad: valores más bajos representan peor nivel pedagógico
export const LEVEL_SEVERITY: Record<SkillLevel, number> = {
  "practica-guiada": 0, // 🔴 más urgente
  "necesita-practica": 1, // 🟠
  "en-desarrollo": 2, // 🟡
  "sin-datos": 3, // ⚪
  consolidado: 4, // 🟢
};

// Orden oficial de materias en el mapa
const MATERIA_ORDER: Record<string, number> = {
  matematica: 0,
  "Matemática": 0,
  lengua: 1,
  "Lengua": 1,
  naturales: 2,
  "Ciencias Naturales": 2,
  sociales: 3,
  "Ciencias Sociales": 3,
};

function normalizeMateria(rawSubject: string | undefined, areaFromCurriculo: string | undefined): { materia: string; materiaId: string } {
  if (areaFromCurriculo) {
    const a = areaFromCurriculo.trim();
    if (/matem[aá]tica/i.test(a)) return { materia: "Matemática", materiaId: "matematica" };
    if (/lengua/i.test(a)) return { materia: "Lengua", materiaId: "lengua" };
    if (/naturales/i.test(a)) return { materia: "Ciencias Naturales", materiaId: "naturales" };
    if (/sociales/i.test(a)) return { materia: "Ciencias Sociales", materiaId: "sociales" };
    return { materia: a, materiaId: a.toLowerCase().replace(/\s+/g, "-") };
  }
  if (rawSubject) {
    const s = rawSubject.toLowerCase();
    if (s === "matematica") return { materia: "Matemática", materiaId: "matematica" };
    if (s === "lengua") return { materia: "Lengua", materiaId: "lengua" };
    if (s === "naturales") return { materia: "Ciencias Naturales", materiaId: "naturales" };
    if (s === "sociales") return { materia: "Ciencias Sociales", materiaId: "sociales" };
    return { materia: subjectLabel(rawSubject), materiaId: s };
  }
  return { materia: "Otros", materiaId: "otros" };
}

function resolveWorld(worldId: number, customWorlds?: WorldDef[]): WorldDef | undefined {
  if (customWorlds) {
    const found = customWorlds.find((w) => w.id === worldId);
    if (found) return found;
  }
  return getWorld(worldId);
}

/**
 * Obtiene los mundos a reforzar para un alumno a partir de su progreso,
 * aplicando los mismos umbrales de dominio que computeStudentsNeedingHelp.
 */
export function getMundosAReforzarStudent(
  student: Student,
  progress: StudentProgress | undefined,
  enabledWorldIds: number[]
): { worldId: number; nivel: SkillLevel; precision?: number }[] {
  const items: { worldId: number; nivel: SkillLevel; precision?: number }[] = [];

  for (const wId of enabledWorldIds) {
    const summary = getStudentWorldSummary(student, progress, wId);
    if (summary.played) {
      if (summary.status === "needs_help") {
        items.push({
          worldId: wId,
          nivel: "practica-guiada",
          precision: summary.bestScore,
        });
      } else if (summary.status === "in_progress") {
        items.push({
          worldId: wId,
          nivel: "necesita-practica",
          precision: summary.bestScore,
        });
      }
    } else if (progress?.worldsNeedingTeacherReview?.includes(wId)) {
      items.push({
        worldId: wId,
        nivel: "practica-guiada",
        precision: progress.lastWorldAttemptScore?.[wId],
      });
    } else if (progress?.worldsPendingReinforcementRetry?.includes(wId)) {
      items.push({
        worldId: wId,
        nivel: "necesita-practica",
        precision: progress.lastWorldAttemptScore?.[wId],
      });
    }
  }

  return items;
}

/**
 * Función pura principal: agrupa los mundos/contenidos a reforzar por materia y eje.
 */
export function contenidosAReforzar(
  input:
    | WorldReinforcementInput[]
    | { student: Student; progress?: StudentProgress; enabledWorldIds: number[] },
  options?: ContenidosAReforzarOptions
): GrupoRefuerzoPorEje[] {
  const curriculoId = options?.curriculoId ?? getCurriculoActivo();
  const validatedIds = options?.validatedIds;
  const customWorlds = options?.worlds;

  let rawList: { worldId: number; nivel: SkillLevel; precision?: number; contenido?: string }[] = [];

  if (Array.isArray(input)) {
    rawList = input.map((item) => {
      if (typeof item === "number") {
        return { worldId: item, nivel: "practica-guiada" as SkillLevel };
      }
      return {
        worldId: item.worldId,
        nivel: item.nivel ?? "practica-guiada",
        precision: item.precision ?? item.bestScore,
        contenido: item.contenido,
      };
    });
  } else if (input && typeof input === "object" && "student" in input) {
    rawList = getMundosAReforzarStudent(
      input.student,
      input.progress,
      input.enabledWorldIds
    );
  }

  // Agrupamiento intermedio: mapKey = `${materiaId}::${eje}`
  interface GroupAcc {
    materia: string;
    materiaId: string;
    eje: string;
    firstWorldOrder: number;
    itemsMap: Map<string, ContenidoRefuerzoItem>;
  }

  const groupsMap = new Map<string, GroupAcc>();

  for (let idx = 0; idx < rawList.length; idx++) {
    const raw = rawList[idx];
    const w = resolveWorld(raw.worldId, customWorlds);
    const curr = getCurriculumEntry(raw.worldId, curriculoId, validatedIds);

    const { materia, materiaId } = normalizeMateria(w?.subject, curr?.area);
    const eje = curr?.eje ? curr.eje.trim() : "Otros";

    // Contenido resumido: WorldDef.description si existe, o raw.contenido, o curr.contenido
    const contenidoPrincipal = (
      raw.contenido ||
      w?.description ||
      curr?.contenido ||
      w?.name ||
      `Mundo ${raw.worldId}`
    ).trim();

    const groupKey = `${materiaId}::${eje}`;
    let group = groupsMap.get(groupKey);
    if (!group) {
      group = {
        materia,
        materiaId,
        eje,
        firstWorldOrder: idx,
        itemsMap: new Map(),
      };
      groupsMap.set(groupKey, group);
    }

    // Clave de contenido normalizada para deduplicar dentro del mismo eje
    const contentKey = contenidoPrincipal
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");

    const newItem: ContenidoRefuerzoItem = {
      worldId: raw.worldId,
      contenido: contenidoPrincipal,
      contenidoDetallado: curr?.contenido,
      fuente: curr?.fuente,
      validado: curr?.validado,
      mundo: w?.name ?? `Mundo ${raw.worldId}`,
      nivel: raw.nivel,
      precision: raw.precision,
    };

    if (group.itemsMap.has(contentKey)) {
      // Si dos mundos del mismo eje tienen el mismo contenido: conservar el peor nivel
      const existing = group.itemsMap.get(contentKey)!;
      const existingSev = LEVEL_SEVERITY[existing.nivel] ?? 99;
      const newSev = LEVEL_SEVERITY[newItem.nivel] ?? 99;

      if (newSev < existingSev) {
        // El nuevo es peor: actualizar nivel y mundo
        existing.nivel = newItem.nivel;
        existing.worldId = newItem.worldId;
        existing.mundo = newItem.mundo;
      }
      // Mantener la peor precisión (mínima)
      if (newItem.precision !== undefined) {
        if (existing.precision === undefined) {
          existing.precision = newItem.precision;
        } else {
          existing.precision = Math.min(existing.precision, newItem.precision);
        }
      }
    } else {
      group.itemsMap.set(contentKey, newItem);
    }
  }

  // Convertir a array y ordenar:
  // 1. Por materias en el orden oficial del mapa
  // 2. Por ejes según el orden de aparición de los mundos
  // 3. Dentro de cada eje, según el orden de los mundos
  const groups = Array.from(groupsMap.values()).map((g) => ({
    materia: g.materia,
    materiaId: g.materiaId,
    eje: g.eje,
    items: Array.from(g.itemsMap.values()),
    order: g.firstWorldOrder,
  }));

  groups.sort((a, b) => {
    const ordA = MATERIA_ORDER[a.materiaId] ?? 99;
    const ordB = MATERIA_ORDER[b.materiaId] ?? 99;
    if (ordA !== ordB) return ordA - ordB;
    return a.order - b.order;
  });

  return groups.map((g) => ({
    materia: g.materia,
    materiaId: g.materiaId,
    eje: g.eje,
    items: g.items,
  }));
}

/**
 * Resumen corto por ejes para listas compactas («A quién ayudar primero»).
 * Devuelve ej. ["Matemática · Número y Operaciones (2)", "Lengua · Escritura (1)"]
 */
export function resumirEjes(grupos: GrupoRefuerzoPorEje[]): string[] {
  return grupos.map((g) => `${g.materia} · ${g.eje} (${g.items.length})`);
}

/**
 * Formato CSV por mundo: «eje: contenido»
 */
export function formatWorldRefuerzoCSV(
  worldId: number,
  curriculoId: CurriculoId = getCurriculoActivo(),
  worlds?: WorldDef[]
): string {
  const w = resolveWorld(worldId, worlds);
  const curr = getCurriculumEntry(worldId, curriculoId);
  const eje = curr?.eje ? curr.eje.trim() : "Otros";
  const contenido = (w?.description || curr?.contenido || w?.name || `Mundo ${worldId}`).trim();
  return `${eje}: ${contenido}`;
}

export function formatWorldsRefuerzoCSV(
  worldIds: number[],
  curriculoId: CurriculoId = getCurriculoActivo(),
  worlds?: WorldDef[]
): string {
  return worldIds.map((id) => formatWorldRefuerzoCSV(id, curriculoId, worlds)).join("; ");
}
