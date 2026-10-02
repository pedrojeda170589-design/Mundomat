"use client";

// Reproductor de audio para las actividades: usa el audio grabado si
// existe (voz humana, p. ej. /audio/letras/m_fonema.mp3) y, si no está o
// falla, lee el texto con la voz del navegador.
import { speak, stopSpeaking } from "@/lib/tts";

let current: HTMLAudioElement | null = null;
const missing = new Set<string>(); // audios que no existen (no reintentar)

// onEnd: se llama cuando termina de sonar (audio grabado o voz).
export function playClip({ audio, say, onEnd }: { audio?: string; say?: string; onEnd?: () => void }) {
  stopClip();
  if (audio && !missing.has(audio) && typeof Audio !== "undefined") {
    const el = new Audio(audio);
    current = el;
    el.onended = () => {
      if (current === el) onEnd?.();
    };
    el.onerror = () => {
      missing.add(audio);
      if (current === el && say) speak(say, onEnd);
    };
    el.play().catch(() => {
      // Autoplay bloqueado o archivo inexistente: voz del navegador.
      if (current === el && say && !el.error) speak(say, onEnd);
    });
    return;
  }
  if (say) speak(say, onEnd);
}

export function stopClip() {
  if (current) {
    current.pause();
    current = null;
  }
  stopSpeaking();
}
