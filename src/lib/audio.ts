"use client";

// Reproductor de audio para las actividades: usa el audio grabado si
// existe (voz humana, p. ej. /audio/letras/m_fonema.mp3) y, si no está o
// falla, lee el texto con la voz del navegador.
import { speak, stopSpeaking } from "@/lib/tts";

let current: HTMLAudioElement | null = null;
const missing = new Set<string>(); // audios que no existen (no reintentar)

// onEnd: se llama cuando termina de sonar (audio grabado o voz).
// onFallback: si no hay audio grabado, se llama en lugar de leer `say`
// (para quien quiere leer el texto a su manera, p. ej. oración por oración).
export function playClip({
  audio,
  say,
  onEnd,
  onFallback,
}: {
  audio?: string;
  say?: string;
  onEnd?: () => void;
  onFallback?: () => void;
}) {
  const fallback = () => (onFallback ? onFallback() : say && speak(say, onEnd));
  stopClip();
  if (audio && !missing.has(audio) && typeof Audio !== "undefined") {
    const el = new Audio(audio);
    current = el;
    el.onended = () => {
      if (current === el) onEnd?.();
    };
    el.onerror = () => {
      missing.add(audio);
      if (current === el) fallback();
    };
    el.play().catch(() => {
      // Autoplay bloqueado o archivo inexistente: voz del navegador.
      if (current === el && !el.error) fallback();
    });
    return;
  }
  fallback();
}

export function stopClip() {
  if (current) {
    current.pause();
    current = null;
  }
  stopSpeaking();
}
