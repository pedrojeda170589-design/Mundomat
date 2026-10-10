// Configuración de tiempos, metas y premios para el Torneo de las tablas (todos los días desde el 5/10/2026; antes, solo el fin de semana).
// Pedro puede ajustar los valores de referencia directamente desde estas constantes.
import { DESAFIOS, desafioActivo } from "@/lib/eventos/config";

// Pedido de Pedro (10/10/2026): tabla del 2 → oro 25 s, plata 35 s; cada
// tabla siguiente, 2 s más (del 3: 27/37; del 4: 29/39 … del 10: 41/51).
export const META_ORO_BASE = 25; // segundos para la tabla del 2
export const META_ORO_INCREMENTO = 2; // +2s por cada tabla (25s, 27s, 29s... hasta 41s en la del 10)
export const META_PLATA_DELTA = 10; // +10s sobre la meta de oro para la medalla de plata
export const PENALIDAD_ERROR_MS = 2000; // 2 segundos más por cada error en la tabla (pedido de Pedro, 10/10/2026)

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
 * metaOro(n) = 25 + 2 * (n - 2)
 */
export function metaOro(tabla: number): number {
  return META_ORO_BASE + META_ORO_INCREMENTO * (tabla - 2);
}

/**
 * Tiempo máximo en segundos para medalla de plata en la tabla dada (2..10).
 * metaPlata(n) = metaOro(n) + 10
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
 * Bordes: 25.0s (25000 ms) es oro; 25.1s (25100 ms) es plata en la del 2.
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
  // Configurable desde el panel (Desafíos y eventos): fechas, días y grados.
  return desafioActivo(DESAFIOS.repasoTablas, grade, now, () => grade >= TORNEO_GRADO_MINIMO && mesAR(now) >= TORNEO_DESDE_MES);
}
