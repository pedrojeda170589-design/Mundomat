// Racha de estudio y «Camino de premios» (estilo Candy Crush), pedido de
// Pedro: motivar a entrar seguido a los mundos y a hacerlo bien.
//
// DÍA DE ESTUDIO: un día (hora argentina) con 5 actividades o más y 60 % o
// más de respuestas correctas. No alcanza con entrar: hay que aprovecharlo.
//
// RACHA: días de estudio seguidos. Para que sea justa con los chicos:
// - Sábados, domingos y vacaciones no cortan la racha (si estudian, suman).
// - Escudos 🛡️: cada 5 días de racha se gana un escudo (máximo 2). Si un día
//   de escuela no estudia, se usa un escudo y la racha sigue.
// - Hoy todavía no cuenta en contra (tiene hasta la medianoche).
//
// CAMINO: una fila de premios que se desbloquean para siempre al llegar a
// cierta racha (🔥, se usa la MEJOR racha) o a cierta cantidad de mundos
// superados con 90 % o más (🏆). Se entregan solos, en el servidor.
//
// Solo lógica pura y datos (sin imports de la app salvo tipos).
import type { StudentProgress } from "@/types";

export const MIN_ACTIVIDADES_DIA = 5;
export const MIN_ACIERTO_DIA = 0.6;
export const DIAS_POR_ESCUDO = 5;
export const MAX_ESCUDOS = 2;
const GUARDAR_DIAS = 150;

// Vacaciones escolares de Santa Cruz (mes-día, aproximadas; ajustables).
export const VACACIONES: [string, string][] = [
  ["12-19", "02-24"], // verano
  ["07-13", "07-24"], // invierno
];

const DAY = 86_400_000;
// "AAAA-MM-DD" en hora argentina (UTC−3).
export function diaAR(ms: number = Date.now()): string {
  return new Date(ms - 3 * 3600 * 1000).toISOString().slice(0, 10);
}
function sumarDias(dia: string, n: number): string {
  return new Date(Date.parse(`${dia}T12:00:00Z`) + n * DAY).toISOString().slice(0, 10);
}
function esFinde(dia: string): boolean {
  const d = new Date(`${dia}T12:00:00Z`).getUTCDay();
  return d === 0 || d === 6;
}
function enVacaciones(dia: string): boolean {
  const md = dia.slice(5);
  return VACACIONES.some(([a, b]) => (a <= b ? md >= a && md <= b : md >= a || md <= b));
}

export function esDiaDeEstudio(r?: { c: number; i: number }): boolean {
  if (!r) return false;
  const n = r.c + r.i;
  return n >= MIN_ACTIVIDADES_DIA && r.c / n >= MIN_ACIERTO_DIA;
}

// Suma una respuesta al día de hoy (se llama en /api/progress).
export function registrarRespuesta(p: StudentProgress, correcta: boolean, now: Date = new Date()): StudentProgress {
  const hoy = diaAR(now.getTime());
  const prev = p.diasEstudio?.[hoy] ?? { c: 0, i: 0 };
  const dias = { ...(p.diasEstudio ?? {}), [hoy]: { c: prev.c + (correcta ? 1 : 0), i: prev.i + (correcta ? 0 : 1) } };
  const corte = sumarDias(hoy, -GUARDAR_DIAS);
  for (const d of Object.keys(dias)) if (d < corte) delete dias[d];
  return { ...p, diasEstudio: dias };
}

export interface EstadoRacha {
  racha: number; // días de estudio seguidos (ahora)
  mejor: number; // la racha más larga
  escudos: number;
  hoyCuenta: boolean; // hoy ya es día de estudio
  hoy: { c: number; i: number }; // lo de hoy (para «te faltan 3 actividades»)
}

export function estadoRacha(p: StudentProgress, now: Date = new Date()): EstadoRacha {
  const hoy = diaAR(now.getTime());
  const dias = p.diasEstudio ?? {};
  const fechas = Object.keys(dias).sort();
  let racha = 0, mejor = p.mejorRacha ?? 0, escudos = 0;
  if (fechas.length) {
    for (let d = fechas[0]; d <= hoy; d = sumarDias(d, 1)) {
      if (esDiaDeEstudio(dias[d])) {
        racha++;
        if (racha % DIAS_POR_ESCUDO === 0) escudos = Math.min(MAX_ESCUDOS, escudos + 1);
        mejor = Math.max(mejor, racha);
      } else if (d === hoy || esFinde(d) || enVacaciones(d)) {
        // no corta
      } else if (racha > 0 && escudos > 0) {
        escudos--;
      } else {
        racha = 0;
      }
    }
  }
  return { racha, mejor, escudos, hoyCuenta: esDiaDeEstudio(dias[hoy]), hoy: dias[hoy] ?? { c: 0, i: 0 } };
}

// ─────────── Camino de premios ───────────

export type Premio =
  | { tipo: "monedas"; cantidad: number }
  | { tipo: "objeto"; id: string; label: string; slot: "headwear" | "eyewear"; molde: string; blurb: string };

export interface Nodo {
  id: string;
  racha?: number; // mejor racha ≥
  mundos?: number; // mundos superados con 90 %+ ≥
  premio: Premio;
}

const vincha = (id: string, label: string, blurb: string): Premio => ({ tipo: "objeto", id, label, slot: "headwear", molde: "cuernitos-dragon", blurb });
const lentes = (id: string, label: string, blurb: string): Premio => ({ tipo: "objeto", id, label, slot: "eyewear", molde: "lentes-corazon", blurb });

// Opciones de las láminas C (vinchas) y D (anteojos) de ChatGPT, 4/10/2026.
export const CAMINO: Nodo[] = [
  { id: "r2", racha: 2, premio: { tipo: "monedas", cantidad: 10 } },
  { id: "r3", racha: 3, premio: vincha("vincha-estrellas", "Vincha de estrellas", "Dos estrellas sonrientes con resortes.") },
  { id: "m3", mundos: 3, premio: lentes("anteojos-soles", "Anteojos de soles", "Dos soles sonrientes.") },
  { id: "r5", racha: 5, premio: { tipo: "monedas", cantidad: 25 } },
  { id: "r7", racha: 7, premio: vincha("vincha-corazones", "Vincha de corazones", "Dos corazones inflados.") },
  { id: "m8", mundos: 8, premio: lentes("anteojos-arcoiris", "Anteojos arcoíris", "Con un arcoíris arriba.") },
  { id: "r10", racha: 10, premio: vincha("vincha-nubes", "Vincha de nubes", "Dos nubes con arcoíris.") },
  { id: "r12", racha: 12, premio: { tipo: "monedas", cantidad: 40 } },
  { id: "m15", mundos: 15, premio: lentes("anteojos-rana", "Anteojos de rana", "Verdes, con ojitos de rana.") },
  { id: "r15", racha: 15, premio: vincha("vincha-rana", "Vincha de ojos de rana", "Dos ojos de rana con resortes.") },
  { id: "r18", racha: 18, premio: lentes("anteojos-estrellas", "Anteojos de estrella", "Estrellas con brillitos.") },
  { id: "r20", racha: 20, premio: lentes("anteojos-nube", "Anteojos de nube", "Nubes esponjosas.") },
  { id: "m25", mundos: 25, premio: vincha("vincha-notas", "Vincha musical", "Dos notas musicales.") },
  { id: "r25", racha: 25, premio: lentes("anteojos-margaritas", "Anteojos de margaritas", "Margaritas con carita.") },
  { id: "r30", racha: 30, premio: vincha("vincha-carpincho", "Vincha de carpincho", "Dos carpinchos con resortes.") },
  { id: "m35", mundos: 35, premio: lentes("anteojos-carpincho", "Anteojos de carpincho", "Cara de carpincho con orejitas.") },
  { id: "r40", racha: 40, premio: vincha("vincha-manteca", "Vincha de manteca", "Dos cubitos de manteca felices.") },
  { id: "m45", mundos: 45, premio: lentes("anteojos-palta", "Anteojos de palta", "Dos medias paltas.") },
  { id: "r50", racha: 50, premio: lentes("anteojos-manteca", "Anteojos de manteca", "Amarillos con cubitos de manteca.") },
  { id: "r60", racha: 60, premio: vincha("vincha-paltas", "Vincha de paltas", "Dos paltas sonrientes.") },
  { id: "final", racha: 75, mundos: 60, premio: vincha("vincha-mate", "Vincha de mate y termo", "Un mate y un termo con carita: el premio mayor.") },
];

export function mundosSuperados(p: StudentProgress): number {
  const set = new Set(p.completedWorlds);
  for (const [w, pct] of Object.entries(p.bestWorldScore ?? {})) if (pct >= 90) set.add(Number(w));
  return set.size;
}

export function nodoCumplido(n: Nodo, mejor: number, mundos: number): boolean {
  return (n.racha === undefined || mejor >= n.racha) && (n.mundos === undefined || mundos >= n.mundos);
}

// Entrega los premios del camino que ya se ganaron y todavía no se dieron.
export function reclamarCamino(p: StudentProgress, now: Date = new Date()): { progress: StudentProgress; nuevos: Nodo[] } {
  const est = estadoRacha(p, now);
  const mundos = mundosSuperados(p);
  const dados = new Set(p.caminoReclamados ?? []);
  const nuevos = CAMINO.filter((n) => !dados.has(n.id) && nodoCumplido(n, est.mejor, mundos));
  if (!nuevos.length && est.mejor === (p.mejorRacha ?? 0)) return { progress: p, nuevos };
  let coins = p.coins;
  const coleccion = new Set(p.seasonalCollection ?? []);
  for (const n of nuevos) {
    if (n.premio.tipo === "monedas") coins += n.premio.cantidad;
    else coleccion.add(n.premio.id);
  }
  return {
    progress: {
      ...p,
      coins,
      seasonalCollection: [...coleccion],
      caminoReclamados: [...dados, ...nuevos.map((n) => n.id)],
      mejorRacha: est.mejor,
    },
    nuevos,
  };
}
