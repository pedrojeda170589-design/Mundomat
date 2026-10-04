// Control de intentos fallidos con códigos de acceso (AG-07, corregido por
// Claude en la revisión).
//
// Problema a evitar: en la escuela los ~19 chicos salen a internet por la
// MISMA IP. Si se bloquea la IP entera, un error de uno (o una pestaña vieja
// con un código borrado que consulta cada 20 s) deja a toda el aula afuera y
// pierden el resultado del mundo que estaban jugando.
//
// Reglas:
// - Solo cuentan como fallo los intentos de ENTRAR o de GUARDAR con un código
//   que no existe (GET/POST /api/progress y /api/world-attempt). Las
//   consultas automáticas (competencia, buzón, pizarrón…) no suman fallos.
// - 20 fallos en 10 minutos desde una IP → 10 minutos en los que, desde esa
//   IP, solo funcionan los códigos que ya entraron bien desde ahí
//   («conocidos»). Así el aula sigue jugando y nadie puede seguir probando
//   códigos ajenos (un acierto no borra el contador).
// - Los registros vencen solos (Upstash: EX; local: se ignoran si están viejos).
import { NextRequest } from "next/server";
import { delKey, getJSON, setJSON } from "@/lib/store";

export const MAX_FAILED_ATTEMPTS = 20;
export const WINDOW_MS = 10 * 60 * 1000;
export const BLOCK_DURATION_MS = 10 * 60 * 1000;
const MAX_CONOCIDOS = 80;
const TTL_S = 24 * 3600;

interface RateLimitRecord {
  attempts: number;
  firstAttemptAt: number;
  blockedUntil?: number;
  conocidos?: string[]; // códigos que entraron bien desde esta IP
  updatedAt?: number;
}

function keyForIp(ip: string): string {
  return `rate_limit:code:${ip.replace(/[^a-zA-Z0-9_.:-]/g, "_")}`;
}

export function getClientIp(request: Request | NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp && realIp.trim()) return realIp.trim();
  return "127.0.0.1";
}

// El código que trae el pedido (en la URL o en el cuerpo JSON), sin consumir el cuerpo.
export async function codigoDe(request: Request | NextRequest): Promise<string | null> {
  const u = new URL(request.url).searchParams.get("code");
  if (u) return u.trim().toUpperCase();
  if (request.method === "GET" || request.method === "HEAD") return null;
  try {
    const b = (await request.clone().json()) as { code?: unknown };
    return typeof b.code === "string" ? b.code.trim().toUpperCase() : null;
  } catch {
    return null;
  }
}

async function leer(ip: string): Promise<RateLimitRecord | null> {
  const r = await getJSON<RateLimitRecord | null>(keyForIp(ip), null);
  if (r && r.updatedAt && Date.now() - r.updatedAt > TTL_S * 1000) return null; // vencido
  return r;
}

async function guardar(ip: string, r: RateLimitRecord): Promise<void> {
  await setJSON(keyForIp(ip), { ...r, updatedAt: Date.now() }, { ttlSeconds: TTL_S });
}

/**
 * ¿Hay que rechazar este pedido? Solo si la IP está bloqueada Y el código no
 * es uno que ya entró bien desde esa IP.
 */
export async function checkCodeRateLimit(
  ip: string,
  code?: string | null
): Promise<{ blocked: boolean; remainingSeconds?: number }> {
  const record = await leer(ip);
  if (!record?.blockedUntil || record.blockedUntil <= Date.now()) return { blocked: false };
  if (code && record.conocidos?.includes(code.trim().toUpperCase())) return { blocked: false };
  return { blocked: true, remainingSeconds: Math.ceil((record.blockedUntil - Date.now()) / 1000) };
}

/** Un intento con un código que no existe (solo al entrar o guardar). */
export async function recordFailedCodeAttempt(
  ip: string
): Promise<{ blocked: boolean; remainingAttempts: number; remainingSeconds?: number }> {
  const now = Date.now();
  const record = await leer(ip);
  const vigente = record && now - record.firstAttemptAt <= WINDOW_MS;
  const attempts = vigente ? record!.attempts + 1 : 1;
  const next: RateLimitRecord = {
    attempts,
    firstAttemptAt: vigente ? record!.firstAttemptAt : now,
    conocidos: record?.conocidos ?? [],
    ...(record?.blockedUntil && record.blockedUntil > now ? { blockedUntil: record.blockedUntil } : {}),
  };
  if (attempts >= MAX_FAILED_ATTEMPTS) next.blockedUntil = now + BLOCK_DURATION_MS;
  await guardar(ip, next);
  return next.blockedUntil
    ? { blocked: true, remainingAttempts: 0, remainingSeconds: Math.ceil((next.blockedUntil - now) / 1000) }
    : { blocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS - attempts };
}

/** Las consultas automáticas con un código inválido no suman fallos. */
export async function recordFailedLookup(): Promise<void> {}

/** Un ingreso correcto: el código queda «conocido» para esa IP (no borra el contador). */
export async function recordSuccessfulCodeAttempt(ip: string, code?: string | null): Promise<void> {
  if (!code) return;
  const c = code.trim().toUpperCase();
  const record = (await leer(ip)) ?? { attempts: 0, firstAttemptAt: Date.now() };
  if (record.conocidos?.includes(c)) return;
  await guardar(ip, { ...record, conocidos: [...(record.conocidos ?? []), c].slice(-MAX_CONOCIDOS) });
}

/** Borra el registro de una IP (pruebas y soporte). */
export async function resetCodeRateLimit(ip: string): Promise<void> {
  await delKey(keyForIp(ip));
}
