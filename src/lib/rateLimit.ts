// Control de tasa de intentos fallidos con códigos de acceso (AG-07).
//
// Regla: 8 intentos fallidos por IP en 10 minutos -> bloqueo de 10 minutos
// con mensaje amable ("Esperá unos minutos y probá de nuevo").
// Funciona en Upstash Redis y en store local (.data/db.json).

import { NextRequest } from "next/server";
import { delKey, getJSON, setJSON } from "@/lib/store";

export const MAX_FAILED_ATTEMPTS = 8;
export const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
export const BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutos

interface RateLimitRecord {
  attempts: number;
  firstAttemptAt: number;
  blockedUntil?: number;
}

function keyForIp(ip: string): string {
  // Normalizar la IP para usarla como clave
  const safeIp = ip.replace(/[^a-zA-Z0-9_.-]/g, "_");
  return `rate_limit:code:${safeIp}`;
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

/**
 * Verifica si la IP está bloqueada por exceso de intentos fallidos.
 */
export async function checkCodeRateLimit(ip: string): Promise<{ blocked: boolean; remainingSeconds?: number }> {
  const record = await getJSON<RateLimitRecord | null>(keyForIp(ip), null);
  if (!record) return { blocked: false };

  const now = Date.now();
  if (record.blockedUntil && record.blockedUntil > now) {
    const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { blocked: true, remainingSeconds };
  }

  return { blocked: false };
}

/**
 * Registra un intento fallido para la IP. Si alcanza el máximo, la bloquea por BLOCK_DURATION_MS.
 */
export async function recordFailedCodeAttempt(
  ip: string
): Promise<{ blocked: boolean; remainingAttempts: number; remainingSeconds?: number }> {
  const key = keyForIp(ip);
  const now = Date.now();
  const record = await getJSON<RateLimitRecord | null>(key, null);

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    // Primera falla en una ventana nueva
    const next: RateLimitRecord = {
      attempts: 1,
      firstAttemptAt: now,
    };
    await setJSON(key, next);
    return { blocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS - 1 };
  }

  // Ya tiene intentos en la ventana actual
  const newAttempts = record.attempts + 1;

  if (newAttempts >= MAX_FAILED_ATTEMPTS) {
    const blockedUntil = now + BLOCK_DURATION_MS;
    const next: RateLimitRecord = {
      attempts: newAttempts,
      firstAttemptAt: record.firstAttemptAt,
      blockedUntil,
    };
    await setJSON(key, next);
    return {
      blocked: true,
      remainingAttempts: 0,
      remainingSeconds: Math.ceil(BLOCK_DURATION_MS / 1000),
    };
  }

  const next: RateLimitRecord = {
    ...record,
    attempts: newAttempts,
  };
  await setJSON(key, next);
  return { blocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS - newAttempts };
}

/**
 * Limpia o resetea el contador de intentos fallidos para la IP.
 */
export async function resetCodeRateLimit(ip: string): Promise<void> {
  await delKey(keyForIp(ip));
}

/**
 * En un ingreso exitoso, se puede limpiar el historial de fallos para no castigar
 * al usuario legítimo que tuvo errores tipográficos previos.
 */
export async function recordSuccessfulCodeAttempt(ip: string): Promise<void> {
  await delKey(keyForIp(ip));
}
