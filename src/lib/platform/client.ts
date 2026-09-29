"use client";

// Cliente de la plataforma para el navegador (panel docente / escuela).
// Usa la clave pública (anon) + la sesión de la persona: la base aplica
// Row Level Security, así que solo llegan los datos que le corresponden.
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isPlatformConfigured(): boolean {
  return Boolean(URL_ && ANON);
}

let client: SupabaseClient | null = null;
export function platform(): SupabaseClient {
  if (!client) {
    client = createClient(URL_!, ANON!, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: "mundotest26-auth" },
    });
  }
  return client;
}

// Mensajes de error de la base, en palabras simples.
export function friendlyError(e: unknown): string {
  const msg = (e as { message?: string })?.message ?? String(e);
  if (/Invalid login credentials/i.test(msg)) return "Email o contraseña incorrectos.";
  if (/already registered|duplicate key.*email/i.test(msg)) return "Ya existe una cuenta con ese email.";
  if (/No autorizado|permission denied|row-level security/i.test(msg)) return "No tenés permiso para hacer esto.";
  if (/duplicate key.*classrooms/i.test(msg)) return "Esa aula ya existe para ese ciclo.";
  return msg.replace(/^.*?ERROR:\s*/, "");
}
