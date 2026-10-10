// Reglas de la Reserva y expedición patagónica (actividad especial de 3.º y 4.º).
// - Cada vuelta tiene 8 actividades; la etapa se supera con 6 o más bien.
// - Las etapas se abren en orden: la 1 (Río Chico) está abierta y cada una
//   abre la siguiente al superarla.
// - La primera vez que se supera una etapa se ganan su animal, su planta, su
//   objeto tradicional y su escudo o bandera. Con los siete departamentos de
//   Santa Cruz se ganan, además, la bandera y el escudo de la provincia.
import type { StudentProgress } from "@/types";
import { DESAFIOS, desafioActivo } from "@/lib/eventos/config";
import { mezclarActividad } from "@/lib/monteLeon/contenido";
import { ETAPAS, ETAPAS_SANTA_CRUZ, PREMIO_SANTA_CRUZ, etapa as etapaDe, premiosDeEtapa } from "./etapas";
import { BANCOS, type ActividadReserva } from "./preguntas";

export const ACTIVIDADES_POR_VUELTA = 8;
export const MINIMO_PARA_SUPERAR = 6;
export const TOTAL_ETAPAS = ETAPAS.length;

export function debeMostrarReserva(student: { grade?: number } | null | undefined, now: Date = new Date()): boolean {
  if (!student) return false;
  return desafioActivo(DESAFIOS.reserva, student.grade ?? 3, now, () => true);
}

type ConReserva = Pick<StudentProgress, "reserva">;

export function etapaSuperada(p: ConReserva | null | undefined, n: number): boolean {
  return (p?.reserva?.etapas?.[n]?.mejor ?? 0) >= MINIMO_PARA_SUPERAR;
}

export function etapaAbierta(p: ConReserva | null | undefined, n: number): boolean {
  if (!etapaDe(n)) return false;
  return n === 1 || etapaSuperada(p, n - 1);
}

export function etapasSuperadas(p: ConReserva | null | undefined): number {
  return ETAPAS.filter((e) => etapaSuperada(p, e.n)).length;
}

// La próxima etapa para jugar (la primera abierta sin superar), o null si terminó.
export function proximaEtapa(p: ConReserva | null | undefined): number | null {
  const e = ETAPAS.find((x) => etapaAbierta(p, x.n) && !etapaSuperada(p, x.n));
  return e ? e.n : null;
}

function mezclar<T>(xs: readonly T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Una vuelta de 8: siempre la del mapa, a lo sumo una de clasificar y el resto
// al azar. Las opciones se mezclan (en el banco la correcta va primera).
export function armarVuelta(n: number): ActividadReserva[] {
  const banco = BANCOS[n] ?? [];
  const delMapa = banco.filter((a) => a.type === "mapa");
  const clasif = mezclar(banco.filter((a) => a.type === "classify")).slice(0, 1);
  const resto = mezclar(banco.filter((a) => a.type !== "mapa" && a.type !== "classify"));
  const elegidas = [...delMapa.slice(0, 1), ...clasif, ...resto].slice(0, ACTIVIDADES_POR_VUELTA);
  return [delMapa[0], ...mezclar(elegidas.slice(1))]
    .filter(Boolean)
    .map((a) => (a.type === "mapa" ? a : mezclarActividad(a)));
}

export interface ResultadoReserva {
  nextProgress: StudentProgress;
  superada: boolean;
  primeraVez: boolean;
  premios: string[]; // ids ganados en esta vuelta (vacío si ya los tenía)
}

export function registrarVuelta(progress: StudentProgress, n: number, correctas: number, now: Date = new Date()): ResultadoReserva {
  const e = etapaDe(n);
  if (!e) throw new Error("Etapa inválida");
  const bien = Math.max(0, Math.min(ACTIVIDADES_POR_VUELTA, Math.floor(correctas)));
  const antes = progress.reserva ?? { etapas: {}, coleccion: [] };
  const yaSuperada = etapaSuperada(progress, n);
  const etapas = { ...antes.etapas };
  const prev = etapas[n];
  etapas[n] = { mejor: Math.max(prev?.mejor ?? 0, bien), fecha: now.toISOString() };
  const coleccion = new Set(antes.coleccion ?? []);
  const premios: string[] = [];
  const superada = bien >= MINIMO_PARA_SUPERAR;
  if (superada) {
    for (const id of premiosDeEtapa(e)) {
      if (!coleccion.has(id)) {
        coleccion.add(id);
        premios.push(id);
      }
    }
    const reserva = { etapas, coleccion: [...coleccion] };
    const santaCruz = ETAPAS.filter((x) => x.nivel === "departamento").every((x) => etapaSuperada({ reserva }, x.n));
    if (santaCruz && ETAPAS_SANTA_CRUZ > 0) {
      for (const id of PREMIO_SANTA_CRUZ) {
        if (!coleccion.has(id)) {
          coleccion.add(id);
          premios.push(id);
        }
      }
    }
  }
  return {
    nextProgress: { ...progress, reserva: { etapas, coleccion: [...coleccion] } },
    superada,
    primeraVez: superada && !yaSuperada,
    premios,
  };
}
