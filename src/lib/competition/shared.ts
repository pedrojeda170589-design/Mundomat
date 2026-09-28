// Competencia con los juegos de memoria del fin de semana (parte que se usa
// también en el navegador: tipos, reglas y armado de las partidas).
//
// - Duelo: un alumno desafía a un compañero. Los dos juegan la MISMA
//   partida (mismas cartas en el mismo lugar). Puede ser "por turnos" (cada
//   uno juega cuando entra) o "en vivo" (los dos conectados a la vez, viendo
//   el avance del otro).
// - Torneo de la semana: todos juegan la misma partida y se arma una tabla.
//
// Para participar hay que estar al día: como mucho MAX_PENDING_WORLDS
// mundos habilitados sin completar.

import { getArgentinaDate } from "@/lib/seasons";
import { DaySlot, WeekendActivity, buildActivityFromSlot, seq } from "@/lib/weekend/plan";

export const MAX_PENDING_WORLDS = 2;
export const DUEL_EXPIRE_DAYS = 7;
export const MAX_DUELS_CREATED_PER_DAY = 5;
export const LIVE_INVITE_SECONDS = 120; // cuánto espera una invitación en vivo
export const LIVE_COUNTDOWN_MS = 3500;

// Monedas: nadie pierde. Ganar da un poco más, pero participar también suma.
export const DUEL_COINS = { win: 3, tie: 2, lose: 1 };
export const TOURNAMENT_COINS = 1; // por participar

export type DuelStatus = "pendiente" | "aceptado" | "terminado" | "rechazado" | "vencido";
export type DuelMode = "turnos" | "vivo";

export interface MatchResult {
  errors: number;
  timeMs: number;
  at: string;
}

export interface Duel {
  id: string;
  createdAt: string;
  from: string; // código de quien desafía
  to: string;
  mode: DuelMode;
  presetId: string; // mensaje de desafío elegido
  status: DuelStatus;
  results: Record<string, MatchResult>;
  // En vivo
  ready?: Record<string, string>; // código → cuándo entró a la sala
  startAt?: string; // cuándo arranca (los dos ven la cuenta regresiva)
  live?: Record<string, { round: number; done: number; total: number; at: string }>;
  winner?: string | "empate";
  rewarded?: boolean;
}

export interface TournamentEntry {
  code: string;
  errors: number;
  timeMs: number;
  at: string;
}

// Partida de competencia: 3 rondas, una de cada juego, de dificultad media.
const MATCH_SLOTS: DaySlot[] = [
  seq("Memoria Numérica", 2, [10, 12, 20, 21, 30], [1, 2], [5]),
  { kind: "memorama-imagenes", title: "Memorama de dibujos", points: 2, pairs: 4 },
  { kind: "memorama-conceptos", title: "Memorama de palabras", points: 2, pairs: 4 },
];
export const MATCH_ROUNDS = MATCH_SLOTS.length;

function hashNumber(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

export function buildMatch(seed: string): WeekendActivity[] {
  const base = hashNumber(seed);
  return MATCH_SLOTS.map((slot, i) => buildActivityFromSlot(slot, `match:${seed}`, i, base + i));
}

// Quién ganó: menos errores; si empatan, el más rápido (con 3 segundos de
// tolerancia: si la diferencia es menor, es empate).
export function compareResults(a: MatchResult, b: MatchResult): number {
  if (a.errors !== b.errors) return a.errors - b.errors;
  if (Math.abs(a.timeMs - b.timeMs) < 3000) return 0;
  return a.timeMs - b.timeMs;
}

export function rankTournament(entries: TournamentEntry[]): TournamentEntry[] {
  return [...entries].sort((a, b) => a.errors - b.errors || a.timeMs - b.timeMs);
}

// Semana del torneo: lunes a domingo (hora argentina). Clave = fecha del lunes.
export function tournamentWeekKey(now: Date = new Date()): string {
  const d = getArgentinaDate(now);
  const date = new Date(Date.UTC(d.year, d.month - 1, d.day));
  const dow = date.getUTCDay(); // 0 = domingo
  date.setUTCDate(date.getUTCDate() - ((dow + 6) % 7));
  return date.toISOString().slice(0, 10);
}

export function isWeekendNow(now: Date = new Date()): boolean {
  const d = getArgentinaDate(now);
  const dow = new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay();
  return dow === 0 || dow === 6;
}

export function formatTime(ms: number): string {
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m} min ${s % 60} s` : `${s} s`;
}

export interface Eligibility {
  eligible: boolean;
  pending: { id: number; name: string; emoji: string }[];
}
