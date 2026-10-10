// Metas especiales: cuenta el avance del alumno y entrega los premios (ver
// metasDatos.ts). Se llama en el servidor al guardar respuestas y vueltas.
import type { StudentProgress, WorldDef } from "@/types";
import { MODULOS } from "@/lib/mapa/modulos";
import { GRADE1_WORLDS } from "@/lib/grade1/worlds";
import { GRADE2_WORLDS } from "@/lib/grade2/worlds";
import { ACIERTO_DIA_SUPER, ACTIVIDADES_DIA_SUPER, METAS, type Meta } from "./metasDatos";
import { estadoRacha } from "./racha";

export { METAS, ACTIVIDADES_DIA_SUPER } from "./metasDatos";
export type { Meta } from "./metasDatos";

export const MUNDOS_POR_ETAPA = 4;

// Etapas superadas: en 3.º y 4.º, cada módulo del mapa con todos sus mundos
// completos; en 1.º y 2.º (sin módulos), cada grupo de 4 mundos seguidos de
// una materia completos.
export function etapasSuperadas(p: Pick<StudentProgress, "completedWorlds">): number {
  const hechos = new Set(p.completedWorlds);
  let n = 0;
  for (const porMateria of Object.values(MODULOS)) {
    for (const mods of Object.values(porMateria)) {
      for (const m of mods ?? []) if (m.mundos.length && m.mundos.every((id) => hechos.has(id))) n++;
    }
  }
  const grupos = (worlds: WorldDef[]) => {
    const porMateria = new Map<string, WorldDef[]>();
    for (const w of worlds) {
      if (w.kind === "dictado" || w.kind === "refuerzo") continue;
      porMateria.set(w.subject, [...(porMateria.get(w.subject) ?? []), w]);
    }
    for (const lista of porMateria.values()) {
      for (let i = 0; i + MUNDOS_POR_ETAPA <= lista.length; i += MUNDOS_POR_ETAPA) {
        if (lista.slice(i, i + MUNDOS_POR_ETAPA).every((w) => hechos.has(w.id))) n++;
      }
    }
  };
  grupos(GRADE1_WORLDS);
  grupos(GRADE2_WORLDS);
  return n;
}

// Días súper: días con 20 actividades o más y 60 % o más de aciertos.
export function esDiaSuper(r?: { c: number; i: number }): boolean {
  if (!r) return false;
  const n = r.c + r.i;
  return n >= ACTIVIDADES_DIA_SUPER && r.c / n >= ACIERTO_DIA_SUPER;
}

export function diasSuper(p: Pick<StudentProgress, "diasEstudio" | "diasSuperContados">): number {
  // Los días viejos se borran de diasEstudio: se guarda cuántos hubo antes.
  const ahora = Object.values(p.diasEstudio ?? {}).filter(esDiaSuper).length;
  return Math.max(ahora, p.diasSuperContados ?? 0);
}

export interface AvanceMetas {
  racha: number; // mejor racha
  etapas: number;
  diasSuper: number;
}

export function avanceMetas(p: StudentProgress, now: Date = new Date()): AvanceMetas {
  return { racha: estadoRacha(p, now).mejor, etapas: etapasSuperadas(p), diasSuper: diasSuper(p) };
}

export function metaCumplida(m: Meta, a: AvanceMetas): boolean {
  return (
    (m.racha === undefined || a.racha >= m.racha) &&
    (m.etapas === undefined || a.etapas >= m.etapas) &&
    (m.diasSuper === undefined || a.diasSuper >= m.diasSuper)
  );
}

// Entrega las metas cumplidas que todavía no se dieron. Los avatares van a
// la colección de logros, los objetos a la colección y la ropa al vestidor.
export function reclamarMetas(p: StudentProgress, now: Date = new Date()): { progress: StudentProgress; nuevas: Meta[] } {
  const a = avanceMetas(p, now);
  const dadas = new Set(p.metasReclamadas ?? []);
  const nuevas = METAS.filter((m) => !dadas.has(m.id) && metaCumplida(m, a));
  const contados = Math.max(p.diasSuperContados ?? 0, a.diasSuper);
  if (!nuevas.length) {
    return { progress: contados !== (p.diasSuperContados ?? 0) ? { ...p, diasSuperContados: contados } : p, nuevas };
  }
  const logros = new Set(p.achievementCollection ?? []);
  const coleccion = new Set(p.seasonalCollection ?? []);
  const prendas = new Set(p.prendas ?? []);
  for (const m of nuevas) {
    if (m.premio.tipo === "avatar") logros.add(m.premio.id);
    else if (m.premio.tipo === "objeto") coleccion.add(m.premio.id);
    else prendas.add(m.premio.id);
  }
  return {
    progress: {
      ...p,
      achievementCollection: [...logros],
      seasonalCollection: [...coleccion],
      prendas: [...prendas],
      metasReclamadas: [...dadas, ...nuevas.map((m) => m.id)],
      diasSuperContados: contados,
    },
    nuevas,
  };
}
