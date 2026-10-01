"use client";

// Reproductor de audio para las actividades: usa el audio grabado si
// existe (voz humana, p. ej. /audio/letras/m_fonema.mp3) y, si no está o
// falla, lee el texto con la voz del navegador.
import { speak, stopSpeaking } from "@/lib/tts";

let current: HTMLAudioElement | null = null;
const missing = new Set<string>(); // audios que no existen (no reintentar)

export function playClip({ audio, say }: { audio?: string; say?: string }) {
  stopClip();
  if (audio && !missing.has(audio) && typeof Audio !== "undefined") {
    const el = new Audio(audio);
    current = el;
    el.onerror = () => {
      missing.add(audio);
      if (current === el && say) speak(say);
    };
    el.play().catch(() => {
      // Autoplay bloqueado o archivo inexistente: voz del navegador.
      if (current === el && say && !el.error) speak(say);
    });
    return;
  }
  if (say) speak(say);
}

export function stopClip() {
  if (current) {
    current.pause();
    current = null;
  }
  stopSpeaking();
}
