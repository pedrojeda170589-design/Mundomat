// Competencia: guardado (solo servidor). Cada duelo y cada dato que escribe
// un jugador va en su propia clave, así dos alumnos jugando a la vez nunca
// se pisan los datos.

import { getJSON, setJSON } from "@/lib/store";
import { getProgress, getWorldsConfig } from "@/lib/data";
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
  const [config, progress] = await Promise.all([getWorldsConfig(), getProgress(code)]);
  const pending = config.enabledWorldIds
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

// Lee un duelo completo, juntando lo que escribió cada jugador.
export async function getDuel(id: string): Promise<Duel | null> {
  const duel = await getJSON<Duel | null>(`duel:${id}`, null);
  if (!duel) return null;
  if (duel.status === "rechazado") {
    duel.results = {};
    return duel; // no hace falta leer nada más
  }
  const players = [duel.from, duel.to];
  const [results, ready, live] = await Promise.all([
    Promise.all(players.map((c) => getJSON<MatchResult | null>(`duel:${id}:result:${c}`, null))),
    Promise.all(players.map((c) => getJSON<string | null>(`duel:${id}:ready:${c}`, null))),
    Promise.all(
      players.map((c) =>
        getJSON<{ round: number; done: number; total: number; at: string } | null>(`duel:${id}:live:${c}`, null)
      )
    ),
  ]);
  duel.results = {};
  duel.ready = {};
  duel.live = {};
  players.forEach((c, i) => {
    if (results[i]) duel.results[c] = results[i]!;
    if (ready[i]) duel.ready![c] = ready[i]!;
    if (live[i]) duel.live![c] = live[i]!;
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
  const duels = await Promise.all(mine.map((d) => getDuel(d.id)));
  return duels.filter((d): d is Duel => !!d);
}

// ---------- Torneo de la semana ----------

export async function getTournamentEntry(week: string, code: string): Promise<TournamentEntry | null> {
  return getJSON<TournamentEntry | null>(`tournament:${week}:${code}`, null);
}

export async function setTournamentEntry(week: string, entry: TournamentEntry): Promise<void> {
  await setJSON(`tournament:${week}:${entry.code}`, entry);
}

export async function getTournamentEntries(week: string, codes: string[]): Promise<TournamentEntry[]> {
  const all = await Promise.all(codes.map((c) => getTournamentEntry(week, c)));
  return all.filter((e): e is TournamentEntry => !!e);
}
