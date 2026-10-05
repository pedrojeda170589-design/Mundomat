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

export function mesAR(now: Date = new Date()): number {
  return new Date(now.getTime() - 3 * 3600 * 1000).getUTCMonth() + 1;
}

/**
 * Pedido de Pedro: el torneo de las tablas aparece desde 3.º grado y recién
 * después de junio (de julio a diciembre), cuando ya se trabajaron las tablas.
 */
export const TORNEO_GRADO_MINIMO = 3;
export const TORNEO_DESDE_MES = 7; // julio
export function torneoHabilitado(grade: number, now: Date = new Date()): boolean {
  return grade >= TORNEO_GRADO_MINIMO && mesAR(now) >= TORNEO_DESDE_MES;
}
