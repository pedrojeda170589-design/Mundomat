// Configuración de desafíos especiales y eventos desde el panel de
// administración (pedido de Pedro, 8/10/2026: «permitir desde el panel
// habilitar los desafíos especiales y configurar el tiempo que estarán
// habilitados»; «todos los desafíos, eventos que aparezcan, incluso la
// apertura de temporada de avatares»; fechas + días de la semana; por grado).
//
// Este módulo es PURO (se usa en el servidor y en el navegador). La
// configuración vive en una variable del módulo:
// - en el servidor la carga `cargarEventosConfig()` (src/lib/eventos/server.ts)
//   cada vez que se busca un alumno (findStudentByCode), con caché corta;
// - en el navegador la carga la pantalla del mapa desde GET /api/eventos.
// Sin configuración, todo funciona «automático» (exactamente como antes).

export type ModoEvento = "auto" | "siempre" | "fechas" | "apagado";

export interface ConfigEvento {
  modo: ModoEvento;
  desde?: string; // "AAAA-MM-DD" (hora argentina), inclusive
  hasta?: string; // "AAAA-MM-DD" (hora argentina), inclusive
  dias?: number[]; // días de la semana permitidos: 0 = domingo … 6 = sábado (vacío o ausente = todos)
  grados?: number[]; // grados habilitados (ausente = los de siempre del evento)
}

export type EventosConfig = Record<string, ConfigEvento>;

let actual: EventosConfig = {};

export function usarEventosConfig(c: EventosConfig | null | undefined): void {
  actual = c && typeof c === "object" ? c : {};
}

export function eventosConfigActual(): EventosConfig {
  return actual;
}

export function configDe(id: string): ConfigEvento | undefined {
  const c = actual[id];
  return c && c.modo ? c : undefined;
}

const HORA_AR = 3 * 3600 * 1000;

// Fecha argentina de un instante: { dia: "AAAA-MM-DD", dow: 0..6 }.
export function fechaAR(now: Date): { dia: string; dow: number } {
  const d = new Date(now.getTime() - HORA_AR);
  return { dia: d.toISOString().slice(0, 10), dow: d.getUTCDay() };
}

export function diaPermitido(cfg: ConfigEvento, now: Date): boolean {
  if (!cfg.dias || cfg.dias.length === 0) return true;
  return cfg.dias.includes(fechaAR(now).dow);
}

export function dentroDeFechas(cfg: ConfigEvento, now: Date): boolean {
  const { dia } = fechaAR(now);
  if (cfg.desde && dia < cfg.desde) return false;
  if (cfg.hasta && dia > cfg.hasta) return false;
  return true;
}

// ¿El grado puede ver este evento? `porDefecto` = grados de siempre.
export function gradoPermitido(id: string, grade: number | undefined, porDefecto: number[] | null): boolean {
  if (grade === undefined || porDefecto === null) return true; // evento para todos (tienda, festividades)
  const cfg = configDe(id);
  const grados = cfg?.grados ?? porDefecto;
  return grados.includes(grade);
}

/**
 * Decide si un evento está activo.
 * - `auto`: la regla de siempre (`reglaAuto`), con los grados configurados.
 * - `siempre`: todos los días permitidos.
 * - `fechas`: entre `desde` y `hasta`, en los días permitidos.
 * - `apagado`: nunca.
 * `porDefecto`: grados de siempre (null = no depende del grado).
 */
export function eventoActivo(
  id: string,
  grade: number | undefined,
  now: Date,
  reglaAuto: () => boolean,
  porDefecto: number[] | null
): boolean {
  if (!gradoPermitido(id, grade, porDefecto)) return false;
  const cfg = configDe(id);
  if (!cfg || cfg.modo === "auto") return reglaAuto();
  if (cfg.modo === "apagado") return false;
  if (!diaPermitido(cfg, now)) return false;
  if (cfg.modo === "fechas") return dentroDeFechas(cfg, now);
  return true; // siempre
}

// Ventana en ms [desde, hasta) cuando el evento está en modo «fechas» o
// «siempre» (para contadores de la tienda y lanzamientos). null = automático.
export function ventanaConfigurada(id: string): { desde: number; hasta: number } | null | "apagado" {
  const cfg = configDe(id);
  if (!cfg || cfg.modo === "auto") return null;
  if (cfg.modo === "apagado") return "apagado";
  const lejos = 8.64e15;
  const desde = cfg.modo === "fechas" && cfg.desde ? Date.parse(`${cfg.desde}T00:00:00-03:00`) : -lejos;
  const hasta = cfg.modo === "fechas" && cfg.hasta ? Date.parse(`${cfg.hasta}T00:00:00-03:00`) + 86_400_000 : lejos;
  return { desde, hasta };
}

// Validación de lo que manda el panel (devuelve la config limpia o un error).
export function validarEventosConfig(raw: unknown, idsValidos: Set<string>): { ok: true; config: EventosConfig } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Configuración inválida." };
  const out: EventosConfig = {};
  const fecha = /^\d{4}-\d{2}-\d{2}$/;
  for (const [id, v] of Object.entries(raw as Record<string, unknown>)) {
    // Un evento que ya no existe (se sacó del catálogo) se descarta en silencio.
    if (!idsValidos.has(id)) continue;
    const c = v as Partial<ConfigEvento>;
    if (!c || !["auto", "siempre", "fechas", "apagado"].includes(String(c.modo))) return { ok: false, error: `Modo inválido en ${id}` };
    // Un lanzamiento necesita fechas (cuenta los mundos superados desde que empieza).
    if (id.startsWith("drop:") && c.modo === "siempre") return { ok: false, error: "Los lanzamientos van «entre fechas», no «siempre»." };
    const limpio: ConfigEvento = { modo: c.modo as ModoEvento };
    if (c.modo === "fechas") {
      if (!c.desde || !fecha.test(c.desde) || !c.hasta || !fecha.test(c.hasta)) return { ok: false, error: `Faltan las fechas de ${id}` };
      if (c.hasta < c.desde) return { ok: false, error: `En ${id}, la fecha de fin es anterior a la de inicio` };
      limpio.desde = c.desde;
      limpio.hasta = c.hasta;
    }
    if (Array.isArray(c.dias)) {
      const dias = [...new Set(c.dias.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort();
      if (dias.length === 0 && (c.modo === "siempre" || c.modo === "fechas")) return { ok: false, error: `En ${id}, elegí al menos un día de la semana` };
      if (dias.length > 0 && dias.length < 7) limpio.dias = dias;
    }
    if (Array.isArray(c.grados)) {
      limpio.grados = [...new Set(c.grados.filter((g) => Number.isInteger(g) && g >= 1 && g <= 7))].sort();
    }
    out[id] = limpio;
  }
  return { ok: true, config: out };
}

// Desafíos por grado: ids y grados de siempre (los que se ven en «automático»).
// Las festividades, temporadas de la tienda y lanzamientos no dependen del
// grado (son para todos).
export const DESAFIOS = {
  finDeSemana: { id: "fin-de-semana", grados: [3] },
  repasoTablas: { id: "repaso-tablas", grados: [3, 4] },
  repasoEnMundos: { id: "repaso-en-mundos", grados: [3, 4] },
  prestamo67: { id: "prestamo-67", grados: [3, 4] },
  dictado: { id: "dictado", grados: [2, 3] },
  monteLeon: { id: "monte-leon", grados: [3] },
  competencia: { id: "competencia", grados: [3] },
  zonasPractica: { id: "zonas-practica", grados: [1, 2] },
} as const;

export function desafioActivo(
  d: { id: string; grados: readonly number[] },
  grade: number | undefined,
  now: Date,
  reglaAuto: () => boolean
): boolean {
  return eventoActivo(d.id, grade ?? 3, now, reglaAuto, [...d.grados]);
}

// Ids de las festividades / temporadas / lanzamientos en la configuración.
export const idEstacion = (id: string) => `estacion:${id}`;
export const idTemporada = (id: string) => `temporada:${id}`;
export const idDrop = (id: string) => `drop:${id}`;
