// Tablas para repasar hoy (pedido de Pedro, 10/10/2026): para llegar a la
// medalla de las tablas, cada día se proponen primero las tablas que más le
// cuestan al alumno: las que tienen más errores o las que más tiempo le
// llevan (comparado con la meta de oro de esa tabla). Si todavía no hay
// datos, las que le faltan en la vuelta en curso.
//
// Solo reglas puras: las usan el servidor, la pantalla y el informe docente.
import type { StudentProgress } from "@/types";
import { getMetaTabla, PENALIDAD_ERROR_MS } from "./tiempos";
import { TABLAS_DE_LA_VUELTA } from "./vueltas";

export interface PartidaTabla {
  ms: number; // tiempo final (con la penalidad por errores)
  errores: number;
  dia: string; // AAAA-MM-DD (hora argentina)
}

export interface EstadisticaTabla {
  partidas: number;
  errores: number;
  ultimas: PartidaTabla[]; // las más recientes al final
}

export const ULTIMAS_GUARDADAS = 6;
export const MAX_PRIORIDADES = 3;

// Suma una partida a las estadísticas de la tabla.
export function sumarPartida(
  stats: StudentProgress["tablasStats"],
  tabla: number,
  partida: PartidaTabla
): NonNullable<StudentProgress["tablasStats"]> {
  const cur = stats?.[tabla] ?? { partidas: 0, errores: 0, ultimas: [] };
  return {
    ...(stats ?? {}),
    [tabla]: {
      partidas: cur.partidas + 1,
      errores: cur.errores + partida.errores,
      ultimas: [...cur.ultimas, partida].slice(-ULTIMAS_GUARDADAS),
    },
  };
}

export type MotivoPrioridad = "errores" | "tiempo" | "falta-en-la-vuelta" | "sin-jugar";

export interface PrioridadTabla {
  tabla: number;
  motivo: MotivoPrioridad;
  texto: string; // explicación corta para el alumno
  erroresPorPartida?: number;
  segundos?: number; // tiempo promedio sin la penalidad
  metaOro: number;
  hechaHoy: boolean;
  puntaje: number;
}

interface Medida {
  partidas: number;
  errores: number; // por partida
  segundos?: number; // sin penalidad
  relTiempo?: number; // segundos / meta de oro
}

// Lo que se sabe de cada tabla: las últimas partidas; si es un alumno que
// jugó antes de guardar las partidas, los mejores de cada semana.
function medir(p: StudentProgress, tabla: number): Medida | null {
  const oro = getMetaTabla(tabla).oroSegundos;
  const ult = p.tablasStats?.[tabla]?.ultimas ?? [];
  let lista: { ms: number; errores: number }[] = ult;
  if (!lista.length) {
    lista = Object.values(p.tablasTorneo ?? {})
      .map((sem) => sem?.[tabla])
      .filter((r): r is NonNullable<typeof r> => !!r)
      .map((r) => ({ ms: r.mejorMs, errores: r.errores ?? 0 }));
  }
  if (!lista.length) return null;
  const errores = lista.reduce((n, x) => n + x.errores, 0) / lista.length;
  const segundos = lista.reduce((n, x) => n + Math.max(0, x.ms - x.errores * PENALIDAD_ERROR_MS), 0) / lista.length / 1000;
  return { partidas: lista.length, errores, segundos, relTiempo: segundos / oro };
}

const uno = (n: number) => (Math.round(n * 10) / 10).toLocaleString("es-AR");

export function prioridadesTablas(p: StudentProgress, hoy: string, max = MAX_PRIORIDADES): PrioridadTabla[] {
  const hechaHoy = (t: number) => (p.tablasStats?.[t]?.ultimas ?? []).some((x) => x.dia === hoy);
  const enVuelta = new Set(Object.keys(p.vueltaTablas?.tablas ?? {}).map(Number));
  const cuestan: PrioridadTabla[] = [];
  const resto: PrioridadTabla[] = [];

  for (const t of TABLAS_DE_LA_VUELTA) {
    const metaOro = getMetaTabla(t).oroSegundos;
    const m = medir(p, t);
    if (!m) {
      resto.push({
        tabla: t,
        motivo: "sin-jugar",
        texto: "Todavía no la jugaste",
        metaOro,
        hechaHoy: false,
        puntaje: enVuelta.has(t) ? 0 : 0.5,
      });
      continue;
    }
    // Un error por partida pesa como tardar un 50 % más que la meta de oro.
    const extraTiempo = Math.max(0, (m.relTiempo ?? 1) - 1);
    const puntaje = m.errores + extraTiempo * 2;
    const porErrores = m.errores >= 0.5 && m.errores >= extraTiempo * 2;
    const base = { tabla: t, erroresPorPartida: m.errores, segundos: m.segundos, metaOro, hechaHoy: hechaHoy(t), puntaje };
    if (m.errores >= 0.5 || extraTiempo > 0) {
      cuestan.push({
        ...base,
        motivo: porErrores ? "errores" : "tiempo",
        texto: porErrores
          ? `${uno(m.errores)} ${m.errores === 1 ? "error" : "errores"} por partida`
          : `Tardás ${Math.round(m.segundos ?? 0)} s (la meta de oro es ${metaOro} s)`,
      });
    } else if (!enVuelta.has(t) && p.vueltaTablas) {
      resto.push({ ...base, motivo: "falta-en-la-vuelta", texto: "Te falta en esta vuelta", puntaje: 0.4 });
    }
  }
  cuestan.sort((a, b) => b.puntaje - a.puntaje);
  // Si no hay tablas que cuesten, siguen las que faltan en la vuelta y las que no jugó.
  resto.sort((a, b) => b.puntaje - a.puntaje || a.tabla - b.tabla);
  return [...cuestan, ...resto].slice(0, max);
}
