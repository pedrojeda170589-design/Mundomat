"use client";

// Música de fondo (original, compuesta por código: scripts/musica/componer.py).
// Una sola pista a la vez, en loop y bajita; baja todavía más mientras se lee
// un texto en voz alta. Cada dispositivo puede apagarla con el botón 🎵 (se
// recuerda en el navegador). Los navegadores no dejan sonar nada hasta que
// la persona toca la pantalla: arranca con el primer toque.

export type Pista =
  | "inicio"
  | "mapa-costa"
  | "mapa-bosque"
  | "mapa-meseta"
  | "cuento"
  | "leyenda"
  | "fabula";

const VOL = 0.16;
const VOL_BAJO = 0.04;
const KEY = "mundotest26-musica";

let el: HTMLAudioElement | null = null;
let pista: Pista | null = null;
let bajo = false;
let fade: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<(on: boolean) => void>();

export function musicaActiva(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

function objetivo() {
  return bajo ? VOL_BAJO : VOL;
}

function rampa(to: number, ms = 600) {
  if (!el) return;
  if (fade) clearInterval(fade);
  const from = el.volume;
  const steps = 12;
  let k = 0;
  fade = setInterval(() => {
    k++;
    if (el) el.volume = Math.max(0, Math.min(1, from + ((to - from) * k) / steps));
    if (k >= steps && fade) clearInterval(fade);
  }, ms / steps);
}

function intentarSonar() {
  if (!el || !musicaActiva()) return;
  el.play().catch(() => {
    // Todavía no hubo un toque: arranca con el primero.
    const reintentar = () => {
      window.removeEventListener("pointerdown", reintentar);
      window.removeEventListener("keydown", reintentar);
      if (el && musicaActiva()) el.play().catch(() => {});
    };
    window.addEventListener("pointerdown", reintentar, { once: true });
    window.addEventListener("keydown", reintentar, { once: true });
  });
}

// Cambia la pista (si es la misma, sigue sonando sin cortarse).
export function ponerMusica(p: Pista | null) {
  if (typeof window === "undefined") return;
  if (p === pista) return;
  pista = p;
  if (el) {
    const viejo = el;
    const v0 = viejo.volume;
    let k = 0;
    const t = setInterval(() => {
      k++;
      viejo.volume = Math.max(0, v0 * (1 - k / 8));
      if (k >= 8) {
        clearInterval(t);
        viejo.pause();
      }
    }, 60);
    el = null;
  }
  if (!p) return;
  el = new Audio(`/audio/musica/${p}.mp3`);
  el.loop = true;
  el.volume = 0;
  intentarSonar();
  rampa(objetivo(), 1200);
}

// Baja la música mientras se lee en voz alta.
export function bajarMusica(on: boolean) {
  bajo = on;
  rampa(objetivo(), on ? 300 : 900);
}

export function festejo() {
  if (typeof window === "undefined" || !musicaActiva()) return;
  bajarMusica(true);
  const f = new Audio("/audio/musica/festejo.mp3");
  f.volume = 0.35;
  f.onended = () => bajarMusica(false);
  f.play().catch(() => bajarMusica(false));
}

export function alternarMusica(): boolean {
  const on = !musicaActiva();
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    // sin almacenamiento: solo por esta sesión
  }
  if (el) {
    if (on) intentarSonar();
    else el.pause();
  }
  listeners.forEach((fn) => fn(on));
  return on;
}

export function alCambiarMusica(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
