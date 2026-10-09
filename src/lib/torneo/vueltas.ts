// Vueltas del Torneo de las tablas (pedido de Pedro, 5/10/2026).
//
// - Una VUELTA es completar las 9 tablas (del 2 al 10). Puede hacerse en
//   varios días; de cada tabla cuenta la mejor partida de la vuelta (menos
//   errores y, si empata, menos tiempo).
// - Al terminar la vuelta se gana el OBJETO ESPECIAL DEL MES en uno de tres
//   metales, según aciertos y tiempo:
//     · dorado: más de 90 % de aciertos y las 9 tablas dentro del tiempo de
//       plata (sumado);
//     · plateado: 70 % de aciertos o más;
//     · de bronce: menos de 70 %.
//   Si en el mes gana un metal mejor, se suma; nunca baja.
// - Los objetos ganados son PRESTADOS hasta completar 10 vueltas (20, 30…
//   en los niveles siguientes): ahí se los queda para siempre. Si el 31/12
//   no llegó, se devuelven.
// - Insignia del perfil (registro de las veces que repasó las tablas):
//   1 vuelta → ×2, 2 → ×3 … 9 → ×10; 10 vueltas → A1 (11 → A2 … 19 → A10);
//   20 → B1; 30 → C1… Desde A1 los objetos son SUPERESPECIALES (otro
//   juego de objetos, misma lógica).
//
// Solo reglas puras: las usan el servidor y las pantallas.
import type { StudentProgress } from "@/types";
import { getMetaTabla, mesAR } from "./tiempos";

export const TABLAS_DE_LA_VUELTA = [2, 3, 4, 5, 6, 7, 8, 9, 10];
export const PASOS_POR_TABLA = 11; // N×0 … N×10
export const VUELTAS_POR_NIVEL = 10;
export const PORCENTAJE_ORO = 90; // más de
export const PORCENTAJE_PLATA = 70; // o más

export type Metal = "oro" | "plata" | "bronce";
export const METALES: Metal[] = ["oro", "plata", "bronce"];
export const NOMBRE_METAL: Record<Metal, string> = { oro: "dorado", plata: "plateado", bronce: "de bronce" };
const RANGO: Record<Metal, number> = { oro: 3, plata: 2, bronce: 1 };

export type SlotPremio = "headwear" | "eyewear" | "pendant" | "prop";

export interface ObjetoTorneo {
  mes: number; // 7 = julio … 12 = diciembre
  base: string; // el id de cada metal es `${base}-${metal}`
  label: string;
  emoji: string;
  slot: SlotPremio;
  molde?: string;
}

// Objetos del mes (nivel ×).
export const OBJETOS_MES: ObjetoTorneo[] = [
  { mes: 7, base: "cronometro-tablas", label: "Cronómetro de las tablas", emoji: "⏱️", slot: "prop" },
  { mes: 8, base: "gorra-tablas", label: "Gorra de las tablas", emoji: "🧢", slot: "headwear", molde: "casco-bombero" },
  { mes: 9, base: "banderin-tablas", label: "Banderín de las tablas", emoji: "🚩", slot: "prop" },
  { mes: 10, base: "vincha-relampago", label: "Vincha relámpago", emoji: "⚡", slot: "headwear", molde: "cuernitos-dragon" },
  { mes: 11, base: "lentes-turbo", label: "Lentes turbo", emoji: "🕶️", slot: "eyewear", molde: "lentes-aviador" },
  { mes: 12, base: "medalla-rayo", label: "Medalla del rayo", emoji: "🏅", slot: "pendant", molde: "sol-de-mayo" },
];

// Objetos SUPERESPECIALES (desde A1).
export const OBJETOS_MES_SUPER: ObjetoTorneo[] = [
  { mes: 7, base: "trofeo-tablas", label: "Trofeo de las tablas", emoji: "🏆", slot: "prop" },
  { mes: 8, base: "corona-tablas", label: "Corona de las tablas", emoji: "👑", slot: "headwear", molde: "cuernitos-dragon" },
  { mes: 9, base: "estrella-fugaz", label: "Estrella fugaz", emoji: "🌠", slot: "prop" },
  { mes: 10, base: "antifaz-estelar", label: "Antifaz estelar", emoji: "🎭", slot: "eyewear", molde: "lentes-corazon" },
  { mes: 11, base: "collar-estrella", label: "Collar estrella", emoji: "⭐", slot: "pendant", molde: "sol-de-mayo" },
  { mes: 12, base: "cetro-numeros", label: "Cetro de los números", emoji: "🪄", slot: "prop" },
];

// Premios de antes (un objeto por grupo de tablas): quien los tenga, los conserva.
export const OBJETOS_TORNEO_ANTERIORES: { id: string; label: string; emoji: string; slot: SlotPremio; molde?: string }[] = [
  { id: "vincha-relampago", label: "Vincha relámpago", emoji: "⚡", slot: "headwear", molde: "cuernitos-dragon" },
  { id: "lentes-turbo", label: "Lentes turbo", emoji: "🕶️", slot: "eyewear", molde: "lentes-aviador" },
  { id: "medalla-rayo", label: "Medalla del rayo", emoji: "🏅", slot: "pendant", molde: "sol-de-mayo" },
];

export interface PremioTorneo {
  id: string;
  label: string;
  emoji: string;
  slot: SlotPremio;
  molde?: string;
  metal: Metal;
  superEspecial: boolean;
}

export function premioDe(o: ObjetoTorneo, metal: Metal, superEspecial: boolean): PremioTorneo {
  return {
    id: `${o.base}-${metal}`,
    label: `${o.label} ${NOMBRE_METAL[metal]}`,
    emoji: o.emoji,
    slot: o.slot,
    ...(o.molde ? { molde: o.molde } : {}),
    metal,
    superEspecial,
  };
}

// Todos los premios posibles (para el catálogo y la lista de imágenes).
export const TODOS_LOS_PREMIOS_TORNEO: PremioTorneo[] = [
  ...OBJETOS_MES.flatMap((o) => METALES.map((m) => premioDe(o, m, false))),
  ...OBJETOS_MES_SUPER.flatMap((o) => METALES.map((m) => premioDe(o, m, true))),
];

export function objetoDelMes(now: Date, superEspecial: boolean): ObjetoTorneo | undefined {
  const mes = mesAR(now);
  return (superEspecial ? OBJETOS_MES_SUPER : OBJETOS_MES).find((o) => o.mes === mes);
}

// --- Insignia / nivel ---

// Texto de la insignia según las vueltas completas (null: todavía ninguna).
export function insigniaDeVueltas(vueltas: number): string | null {
  if (vueltas <= 0) return null;
  if (vueltas < VUELTAS_POR_NIVEL) return `×${vueltas + 1}`;
  const nivel = Math.min(26, Math.floor(vueltas / VUELTAS_POR_NIVEL)); // 1 = A
  const letra = String.fromCharCode(64 + nivel);
  return `${letra}${vueltas - nivel * VUELTAS_POR_NIVEL + 1}`;
}

export function esNivelSuper(vueltas: number): boolean {
  return vueltas >= VUELTAS_POR_NIVEL;
}

// Cuántas vueltas hacen falta para quedarse lo ganado con esta cantidad de vueltas hechas.
export function vueltasParaQuedarse(vueltasAlGanar: number): number {
  return (Math.floor(vueltasAlGanar / VUELTAS_POR_NIVEL) + 1) * VUELTAS_POR_NIVEL;
}

// --- La vuelta ---

export interface PartidaDeVuelta {
  ms: number;
  errores: number;
}
export interface VueltaEnCurso {
  tablas: Record<number, PartidaDeVuelta>;
  desde: string;
}

export function mejorPartida(a: PartidaDeVuelta | undefined, b: PartidaDeVuelta): PartidaDeVuelta {
  if (!a) return b;
  if (b.errores !== a.errores) return b.errores < a.errores ? b : a;
  return b.ms < a.ms ? b : a;
}

export function tablasHechas(v: VueltaEnCurso | undefined): number[] {
  return TABLAS_DE_LA_VUELTA.filter((t) => v?.tablas?.[t]);
}

export interface ResultadoVuelta {
  porcentaje: number; // aciertos (redondeado a 1 decimal)
  errores: number;
  ms: number;
  msPlata: number; // suma de las metas de plata de las 9 tablas
  dentroDeTiempo: boolean;
  metal: Metal;
}

// Aciertos: cada tabla tiene 11 pasos; cada error es una respuesta incorrecta más.
export function evaluarVuelta(v: VueltaEnCurso): ResultadoVuelta {
  let errores = 0;
  let ms = 0;
  let msPlata = 0;
  for (const t of TABLAS_DE_LA_VUELTA) {
    const p = v.tablas[t];
    errores += p.errores;
    ms += p.ms;
    msPlata += getMetaTabla(t).plataMs;
  }
  const pasos = TABLAS_DE_LA_VUELTA.length * PASOS_POR_TABLA;
  const porcentaje = Math.round((pasos / (pasos + errores)) * 1000) / 10;
  const dentroDeTiempo = ms <= msPlata;
  const metal: Metal =
    porcentaje > PORCENTAJE_ORO && dentroDeTiempo ? "oro" : porcentaje >= PORCENTAJE_PLATA ? "plata" : "bronce";
  return { porcentaje, errores, ms, msPlata, dentroDeTiempo, metal };
}

export function mejorMetal(a: Metal, b: Metal): Metal {
  return RANGO[a] >= RANGO[b] ? a : b;
}

// --- Préstamos de los objetos ganados ---

export interface PremioPrestado {
  id: string;
  hastaVueltas: number; // con esta cantidad de vueltas, se lo queda
  vence: string; // ISO: si no llegó, se devuelve (31/12 a las 23:59, hora argentina)
}

export function venceElAnio(now: Date): string {
  const y = new Date(now.getTime() - 3 * 3600 * 1000).getUTCFullYear();
  return new Date(Date.UTC(y + 1, 0, 1) + 3 * 3600 * 1000 - 1000).toISOString();
}

// Los que ya cumplieron las vueltas se quedan (salen de la lista de
// prestados); los vencidos se devuelven (se sacan de la colección y del
// avatar). Devuelve el mismo objeto si no cambia nada.
export function ordenarPrestadosTorneo<T extends StudentProgress>(p: T, now: Date = new Date()): T {
  const lista = p.torneoPrestados;
  if (!lista?.length) return p;
  const vueltas = p.torneoVueltas ?? 0;
  const quedan: PremioPrestado[] = [];
  const devolver = new Set<string>();
  for (const x of lista) {
    if (vueltas >= x.hastaVueltas) continue; // ¡se lo queda!
    if (now.getTime() > Date.parse(x.vence)) devolver.add(x.id);
    else quedan.push(x);
  }
  if (quedan.length === lista.length) return p;
  const next = { ...p, torneoPrestados: quedan };
  if (devolver.size) {
    next.seasonalCollection = (p.seasonalCollection ?? []).filter((id) => !devolver.has(id));
    if (p.avatarAccessories) {
      const acc = { ...p.avatarAccessories };
      for (const k of Object.keys(acc) as (keyof typeof acc)[]) if (acc[k] && devolver.has(acc[k]!)) delete acc[k];
      next.avatarAccessories = acc;
    }
    if (p.avatarCapas) {
      next.avatarCapas = p.avatarCapas.filter((c) => !devolver.has(c.id));
    }
  }
  return next;
}

// Metal que ya tiene de un objeto (el mejor), o null.
export function metalQueTiene(coleccion: string[], base: string): Metal | null {
  let mejor: Metal | null = null;
  for (const m of METALES) if (coleccion.includes(`${base}-${m}`)) mejor = mejor ? mejorMetal(mejor, m) : m;
  return mejor;
}
