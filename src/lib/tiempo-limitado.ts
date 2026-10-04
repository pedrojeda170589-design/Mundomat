// Tienda por tiempo limitado: avatares y objetos que solo se compran
// mientras dura su festividad (ver SEASONAL_EVENTS en src/lib/seasons.ts).
// Lo que ya se compró queda para siempre.
//
// Para el cartel de la tienda calcula la ventana de fechas de cada
// festividad: si está activa, cuántos días le quedan; si todavía no empezó,
// en cuántos días llega. Todo en hora argentina.
import { getArgentinaDate, getSeasonalEventById, type ArgDate } from "@/lib/seasons";
import { ACCESSORY_CATALOG_TIENDA, SHOP_AVATARS } from "@/types";

export interface Ventana {
  eventId: string;
  activa: boolean;
  desde: ArgDate; // primer día
  hasta: ArgDate; // último día (inclusive)
  dias: number; // activa: días que quedan contando hoy; próxima: días que faltan para que empiece
}

const DAY = 86_400_000;

function toArg(n: number): ArgDate {
  const d = new Date(n * DAY);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

function dayNum(d: ArgDate): number {
  return Math.floor(Date.UTC(d.year, d.month - 1, d.day) / DAY);
}

// Ventana actual (si está activa) o la próxima dentro de `horizonte` días.
export function ventanaDe(eventId: string, now: Date = new Date(), horizonte = 400): Ventana | null {
  const ev = getSeasonalEventById(eventId);
  if (!ev) return null;
  const today = dayNum(getArgentinaDate(now));
  const on = (n: number) => ev.isActive(toArg(n));
  let start: number | null = null;
  if (on(today)) {
    start = today;
    while (start - today > -400 && on(start - 1)) start--;
  } else {
    for (let n = today + 1; n <= today + horizonte; n++) {
      if (on(n)) {
        start = n;
        break;
      }
    }
  }
  if (start === null) return null;
  let end = Math.max(start, today);
  while (end - start < 400 && on(end + 1)) end++;
  const activa = start <= today;
  return {
    eventId,
    activa,
    desde: toArg(start),
    hasta: toArg(end),
    dias: activa ? end - today + 1 : start - today,
  };
}

export function fechaCorta(d: ArgDate): string {
  return `${d.day}/${d.month}`;
}

// Texto del contador para el alumno.
export function textoContador(v: Ventana): string {
  if (v.activa) {
    if (v.dias <= 1) return "¡Último día!";
    return `Quedan ${v.dias} días (hasta el ${fechaCorta(v.hasta)})`;
  }
  if (v.dias === 1) return "¡Llega mañana!";
  return `Llega en ${v.dias} días (${fechaCorta(v.desde)} al ${fechaCorta(v.hasta)})`;
}

// Cuántos días antes se muestra en la tienda lo que está por llegar.
export const AVISO_PREVIO_DIAS = 21;

// La festividad con cosas a la venta que se va más pronto (para el aviso
// junto al botón de la tienda), o null si no hay ninguna activa.
export function ofertaVigente(now: Date = new Date()): Ventana | null {
  const ids = new Set<string>();
  for (const a of SHOP_AVATARS) if (a.season) ids.add(a.season);
  for (const a of ACCESSORY_CATALOG_TIENDA) if (a.season) ids.add(a.season);
  const activas = [...ids].map((id) => ventanaDe(id, now)).filter((v): v is Ventana => !!v?.activa);
  return activas.sort((a, b) => a.dias - b.dias)[0] ?? null;
}
