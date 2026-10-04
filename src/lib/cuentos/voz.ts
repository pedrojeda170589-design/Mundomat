// Voz grabada de los textos (Kokoro, voz «Alex», licencia Apache 2.0: ver
// scripts/voz/LEEME.md). Cada oración tiene su archivo, identificado por un
// hash de su texto: así, si un texto cambia, simplemente deja de tener audio
// (se lee con la voz del navegador) hasta que se vuelvan a generar las voces.
import { VOZ_DISPONIBLE } from "./voz-manifest";

// Parte el texto de una escena en oraciones (igual en la pantalla y al generar las voces).
export function oraciones(text: string): string[] {
  const parts = text.match(/[^.!?…]+[.!?…]+[»”"]?\s*|[^.!?…]+$/g) ?? [text];
  return parts.map((p) => p.trim()).filter(Boolean);
}

// FNV-1a de 32 bits sobre el texto normalizado.
export function vozHash(text: string): string {
  const t = text.replace(/\s+/g, " ").trim();
  let h = 0x811c9dc5;
  for (let i = 0; i < t.length; i++) {
    h ^= t.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

// URL del audio de una oración (o del título), si existe.
export function vozUrl(text: string): string | null {
  const h = vozHash(text);
  return VOZ_DISPONIBLE.has(h) ? `/audio/cuentos/voz/${h}.mp3` : null;
}
