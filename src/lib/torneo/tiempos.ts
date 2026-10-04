// Configuración de tiempos, metas y premios para el Torneo de las tablas (fin de semana).
// Pedro puede ajustar los valores de referencia directamente desde estas constantes.

export const META_ORO_BASE = 35; // segundos para la tabla del 2
export const META_ORO_INCREMENTO = 3; // +3s por cada tabla adicional (35s, 38s, 41s... hasta 59s en la del 10)
export const META_PLATA_DELTA = 15; // +15s sobre la meta de oro para clasificar a medalla de plata
export const PENALIDAD_ERROR_MS = 3000; // 3 segundos de penalidad por intento fallido

export const MONEDAS_MEDALLA = {
  oro: 15,
  plata: 8,
  bronce: 3,
} as const;

export type MedallaTorneo = "oro" | "plata" | "bronce";

export interface MetaTabla {
  tabla: number;
  oroSegundos: number;
  plataSegundos: number;
  oroMs: number;
  plataMs: number;
}

/**
 * Tiempo máximo en segundos para medalla de oro en la tabla dada (2..10).
 * metaOro(n) = 35 + 3 * (n - 2)
 */
export function metaOro(tabla: number): number {
  return META_ORO_BASE + META_ORO_INCREMENTO * (tabla - 2);
}

/**
 * Tiempo máximo en segundos para medalla de plata en la tabla dada (2..10).
 * metaPlata(n) = metaOro(n) + 15
 */
export function metaPlata(tabla: number): number {
  return metaOro(tabla) + META_PLATA_DELTA;
}

export function getMetaTabla(tabla: number): MetaTabla {
  const o = metaOro(tabla);
  const p = metaPlata(tabla);
  return {
    tabla,
    oroSegundos: o,
    plataSegundos: p,
    oroMs: o * 1000,
    plataMs: p * 1000,
  };
}

/**
 * Determina la medalla lograda según el tiempo total en milisegundos.
 * Bordes: 35.0s (35000 ms) es oro; 35.1s (35100 ms) es plata en la del 2.
 */
export function calcularMedalla(tabla: number, ms: number): MedallaTorneo {
  const { oroMs, plataMs } = getMetaTabla(tabla);
  if (ms <= oroMs) return "oro";
  if (ms <= plataMs) return "plata";
  return "bronce";
}

/**
 * Grupos de tablas y sus objetos especiales desbloqueables la primera vez que se logra oro.
 * Grupo 1 (tablas 2 a 4) -> «Vincha relámpago» ⚡ (cabeza, molde cuernitos-dragon)
 * Grupo 2 (tablas 5 a 7) -> «Lentes turbo» 🕶️ (ojos, molde lentes-aviador)
 * Grupo 3 (tablas 8 a 10) -> «Medalla del rayo» 🏅 (colgante, molde sol-de-mayo)
 */
export interface PremioGrupoItem {
  id: string;
  tablas: number[];
  label: string;
  emoji: string;
  slot: "headwear" | "eyewear" | "pendant";
  molde: string;
  grupoNombre: string;
}

export const PREMIOS_TORNEO_ITEMS: PremioGrupoItem[] = [
  {
    id: "vincha-relampago",
    tablas: [2, 3, 4],
    label: "Vincha relámpago",
    emoji: "⚡",
    slot: "headwear",
    molde: "cuernitos-dragon",
    grupoNombre: "Tablas 2, 3 y 4",
  },
  {
    id: "lentes-turbo",
    tablas: [5, 6, 7],
    label: "Lentes turbo",
    emoji: "🕶️",
    slot: "eyewear",
    molde: "lentes-aviador",
    grupoNombre: "Tablas 5, 6 y 7",
  },
  {
    id: "medalla-rayo",
    tablas: [8, 9, 10],
    label: "Medalla del rayo",
    emoji: "🏅",
    slot: "pendant",
    molde: "sol-de-mayo",
    grupoNombre: "Tablas 8, 9 y 10",
  },
];

export function premioGrupoParaTabla(tabla: number): PremioGrupoItem | undefined {
  return PREMIOS_TORNEO_ITEMS.find((p) => p.tablas.includes(tabla));
}

/**
 * Pedido de Pedro: el torneo de las tablas aparece desde 3.º grado y recién
 * después de junio (de julio a diciembre), cuando ya se trabajaron las tablas.
 */
export const TORNEO_GRADO_MINIMO = 3;
export const TORNEO_DESDE_MES = 7; // julio
export function torneoHabilitado(grade: number, now: Date = new Date()): boolean {
  const mesAR = new Date(now.getTime() - 3 * 3600 * 1000).getUTCMonth() + 1;
  return grade >= TORNEO_GRADO_MINIMO && mesAR >= TORNEO_DESDE_MES;
}
