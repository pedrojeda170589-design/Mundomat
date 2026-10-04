// Tienda por tiempo limitado: avatares y objetos que solo se compran
// mientras dura su festividad (ver SEASONAL_EVENTS en src/lib/seasons.ts).
// Lo que ya se compró queda para siempre.
//
// Para el cartel de la tienda calcula la ventana de fechas de cada
// festividad: si está activa, cuántos días le quedan; si todavía no empezó,
// en cuántos días llega. Todo en hora argentina.
import { easterSunday, getArgentinaDate, getSeasonalEventById, type ArgDate } from "@/lib/seasons";
import { ACCESSORY_CATALOG_TIENDA, SHOP_AVATARS } from "@/types";
import { DIAS_TEMPORADA, TEMPORADAS, type Temporada } from "@/lib/coleccion/temporadas";

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

// Ventana [inicio, fin] (números de día) de una temporada de la tienda en un año.
function ventanaDelAnio(t: Temporada, year: number): [number, number] {
  const ex = t.excepciones?.[year];
  if (ex) return [dayNum({ year, month: ex.desde[0], day: ex.desde[1] }), dayNum({ year: ex.hasta[0] < ex.desde[0] ? year + 1 : year, month: ex.hasta[0], day: ex.hasta[1] })];
  let dia: number;
  if (t.dia === "carnaval") {
    // Lunes de carnaval = Pascua − 48 días.
    const e = easterSunday(year);
    dia = dayNum({ year, month: e.month, day: e.day }) - 48;
  } else {
    dia = dayNum({ year, month: t.dia[0], day: t.dia[1] });
  }
  let inicio = dia - (t.antes ?? 4);
  const largo = t.dias ?? DIAS_TEMPORADA;
  // No se superpone con la temporada indicada: empieza 4 días después de que termine.
  const otra = t.despuesDe ? getTemporada(t.despuesDe) : undefined;
  if (otra && !otra.pausada) {
    const [a, b] = ventanaDelAnio(otra, year);
    if (inicio <= b && inicio + largo - 1 >= a) inicio = b + 4;
  }
  return [inicio, inicio + largo - 1];
}

export function getTemporada(id: string): Temporada | undefined {
  return TEMPORADAS.find((t) => t.id === id);
}

// ¿Está a la venta hoy? Para las temporadas de la tienda, por su ventana de
// 15 días; si no, por la festividad de siempre (src/lib/seasons.ts).
function activaFn(eventId: string): ((n: number) => boolean) | null {
  const t = getTemporada(eventId);
  if (t?.pausada) return null; // en pausa: no se vende ni se anuncia
  if (t) {
    return (n: number) => {
      const y = new Date(n * DAY).getUTCFullYear();
      return [y - 1, y].some((yy) => {
        const [a, b] = ventanaDelAnio(t, yy);
        return n >= a && n <= b;
      });
    };
  }
  const ev = getSeasonalEventById(eventId);
  return ev ? (n: number) => ev.isActive(toArg(n)) : null;
}

// Año en que empezó la ventana activa (para claves como «tradicion-2026»).
export function claveTemporada(eventId: string, now: Date = new Date()): string | null {
  const v = ventanaDe(eventId, now);
  return v?.activa ? `${eventId}-${v.desde.year}` : null;
}

// Ventana actual (si está activa) o la próxima dentro de `horizonte` días.
export function ventanaDe(eventId: string, now: Date = new Date(), horizonte = 400): Ventana | null {
  const on = activaFn(eventId);
  if (!on) return null;
  const today = dayNum(getArgentinaDate(now));
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
// Pedido de Pedro: fuera de su fecha, las colecciones quedan OCULTAS (0 = no
// se anticipan). Lo que el alumno ya compró lo sigue viendo siempre.
export const AVISO_PREVIO_DIAS = 0;

// La festividad con cosas a la venta que se va más pronto (para el aviso
// junto al botón de la tienda), o null si no hay ninguna activa.
export function ofertaVigente(now: Date = new Date()): Ventana | null {
  const ids = new Set<string>();
  for (const a of SHOP_AVATARS) if (a.season) ids.add(a.season);
  for (const a of ACCESSORY_CATALOG_TIENDA) if (a.season) ids.add(a.season);
  const activas = [...ids].map((id) => ventanaDe(id, now)).filter((v): v is Ventana => !!v?.activa);
  return activas.sort((a, b) => a.dias - b.dias)[0] ?? null;
}

// ¿Se puede comprar hoy algo de esta temporada? (y, si es de única vez, solo ese año)
export function enVenta(season: string, unicaVez?: number, now: Date = new Date()): boolean {
  const v = ventanaDe(season, now);
  if (!v?.activa) return false;
  return !unicaVez || v.desde.year === unicaVez;
}

// Nombre para el cartel: «🧉 Aventura Argentina · Día de la Tradición».
export function nombreTemporada(id: string): { emoji: string; titulo: string; sub?: string } {
  const t = getTemporada(id);
  if (t) return { emoji: t.emoji, titulo: t.coleccion, sub: t.label };
  const ev = getSeasonalEventById(id);
  return { emoji: ev?.emoji ?? "⏳", titulo: ev?.label ?? id };
}
