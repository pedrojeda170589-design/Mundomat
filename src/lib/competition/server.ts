// Competencia: guardado (solo servidor). Cada duelo y cada dato que escribe
// un jugador va en su propia clave, así dos alumnos jugando a la vez nunca
// se pisan los datos.

import { getJSON, getJSONMany, setJSON } from "@/lib/store";
import { findStudentByCode, getEnabledWorldIdsFor, getProgress } from "@/lib/data";
import { getWorld } from "@/lib/worlds";
import {
  DUEL_EXPIRE_DAYS,
  Duel,
  Eligibility,
  MAX_PENDING_WORLDS,
  MatchResult,
  TournamentEntry,
} from "@/lib/competition/shared";

export * from "@/lib/competition/shared";

interface DuelIndexItem {
  id: string;
  from: string;
  to: string;
  createdAt: string;
}

const INDEX_KEY = "duels:index";
const CONFIG_KEY = "competitionConfig";
const MAX_INDEX = 300;

export interface CompetitionConfig {
  enabled: boolean;
  anyDay: boolean; // si es false, solo se juega sábado y domingo
}

export async function getCompetitionConfig(): Promise<CompetitionConfig> {
  const c = await getJSON<Partial<CompetitionConfig>>(CONFIG_KEY, {});
  return { enabled: c.enabled ?? true, anyDay: c.anyDay ?? false };
}

export async function setCompetitionConfig(c: CompetitionConfig): Promise<void> {
  await setJSON(CONFIG_KEY, c);
}

export async function getEligibility(code: string): Promise<Eligibility> {
  const student = await findStudentByCode(code);
  const [enabled, progress] = await Promise.all([getEnabledWorldIdsFor(student), getProgress(code)]);
  const pending = enabled
    .filter((id) => !progress.completedWorlds.includes(id))
    .map((id) => getWorld(id))
    .filter((w): w is NonNullable<typeof w> => !!w)
    .map((w) => ({ id: w.id, name: w.name, emoji: w.emoji }));
  return { eligible: pending.length <= MAX_PENDING_WORLDS, pending };
}

// ---------- Duelos ----------

export async function getDuelIndex(): Promise<DuelIndexItem[]> {
  return getJSON<DuelIndexItem[]>(INDEX_KEY, []);
}

export async function createDuel(duel: Duel): Promise<void> {
  await setJSON(`duel:${duel.id}`, duel);
  const index = await getDuelIndex();
  await setJSON(
    INDEX_KEY,
    [{ id: duel.id, from: duel.from, to: duel.to, createdAt: duel.createdAt }, ...index].slice(0, MAX_INDEX)
  );
}

export async function saveDuel(duel: Duel): Promise<void> {
  await setJSON(`duel:${duel.id}`, duel);
}

function expired(duel: Duel, now: number): boolean {
  return now - new Date(duel.createdAt).getTime() > DUEL_EXPIRE_DAYS * 86_400_000;
}

type LiveInfo = { round: number; done: number; total: number; at: string };

function partKeys(id: string, from: string, to: string): string[] {
  return [from, to].flatMap((c) => [`duel:${id}:result:${c}`, `duel:${id}:ready:${c}`, `duel:${id}:live:${c}`]);
}

// Junta el duelo con lo que escribió cada jugador (resultado, sala, avance).
function assemble(duel: Duel, parts: unknown[]): Duel {
  if (duel.status === "rechazado") {
    duel.results = {};
    return duel;
  }
  duel.results = {};
  duel.ready = {};
  duel.live = {};
  [duel.from, duel.to].forEach((c, i) => {
    const [result, ready, live] = parts.slice(i * 3, i * 3 + 3) as [MatchResult | null, string | null, LiveInfo | null];
    if (result) duel.results[c] = result;
    if (ready) duel.ready![c] = ready;
    if (live) duel.live![c] = live;
  });
  if (duel.results[duel.from] && duel.results[duel.to]) {
    duel.status = "terminado";
  } else if (duel.status === "pendiente" && expired(duel, Date.now())) {
    duel.status = "vencido";
  } else if (duel.status === "aceptado" && expired(duel, Date.now() - DUEL_EXPIRE_DAYS * 86_400_000)) {
    // Aceptado pero nadie lo terminó en dos semanas.
    duel.status = "vencido";
  }
  // En vivo: arranca cuando los dos entraron a la sala (+ cuenta regresiva).
  if (duel.mode === "vivo" && duel.ready[duel.from] && duel.ready[duel.to]) {
    const last = Math.max(new Date(duel.ready[duel.from]).getTime(), new Date(duel.ready[duel.to]).getTime());
    duel.startAt = new Date(last + 3500).toISOString();
  }
  return duel;
}

// Lee un duelo completo (2 consultas en total).
export async function getDuel(id: string): Promise<Duel | null> {
  const duel = await getJSON<Duel | null>(`duel:${id}`, null);
  if (!duel) return null;
  const parts = await getJSONMany<unknown>(partKeys(id, duel.from, duel.to), () => null);
  return assemble(duel, parts);
}

// Lee varios duelos de una sola vez (1 consulta para todos).
async function getDuelsBatch(items: DuelIndexItem[]): Promise<Duel[]> {
  const keys = items.flatMap((d) => [`duel:${d.id}`, ...partKeys(d.id, d.from, d.to)]);
  const values = await getJSONMany<unknown>(keys, () => null);
  const out: Duel[] = [];
  items.forEach((_, i) => {
    const chunk = values.slice(i * 7, i * 7 + 7);
    const duel = chunk[0] as Duel | null;
    if (duel) out.push(assemble(duel, chunk.slice(1)));
  });
  return out;
}

export async function getRecentDuelsTo(code: string, withinMs: number): Promise<Duel[]> {
  const index = await getDuelIndex();
  const recent = index.filter((d) => d.to === code && Date.now() - new Date(d.createdAt).getTime() < withinMs);
  return recent.length ? getDuelsBatch(recent) : [];
}

export async function setDuelResult(id: string, code: string, r: MatchResult): Promise<void> {
  await setJSON(`duel:${id}:result:${code}`, r);
}
export async function setDuelReady(id: string, code: string): Promise<void> {
  await setJSON(`duel:${id}:ready:${code}`, new Date().toISOString());
}
export async function setDuelLive(
  id: string,
  code: string,
  live: { round: number; done: number; total: number }
): Promise<void> {
  await setJSON(`duel:${id}:live:${code}`, { ...live, at: new Date().toISOString() });
}
// Cada jugador cobra su premio una sola vez (lo marca su propia clave).
export async function isDuelPaid(id: string, code: string): Promise<boolean> {
  return !!(await getJSON<boolean>(`duel:${id}:paid:${code}`, false));
}
export async function markDuelPaid(id: string, code: string): Promise<void> {
  await setJSON(`duel:${id}:paid:${code}`, true);
}

export async function getDuelsFor(code: string, limit = 10): Promise<Duel[]> {
  const index = await getDuelIndex();
  const mine = index.filter((d) => d.from === code || d.to === code).slice(0, limit);
  return mine.length ? getDuelsBatch(mine) : [];
}

export async function getPaidFlags(ids: string[], code: string): Promise<boolean[]> {
  return getJSONMany<boolean>(ids.map((id) => `duel:${id}:paid:${code}`), () => false);
}

// ---------- Torneo de la semana ----------

export async function getTournamentEntry(week: string, code: string): Promise<TournamentEntry | null> {
  return getJSON<TournamentEntry | null>(`tournament:${week}:${code}`, null);
}

export async function setTournamentEntry(week: string, entry: TournamentEntry): Promise<void> {
  await setJSON(`tournament:${week}:${entry.code}`, entry);
}

export async function getTournamentEntries(week: string, codes: string[]): Promise<TournamentEntry[]> {
  const all = await getJSONMany<TournamentEntry | null>(codes.map((c) => `tournament:${week}:${c}`), () => null);
  return all.filter((e): e is TournamentEntry => !!e);
}
