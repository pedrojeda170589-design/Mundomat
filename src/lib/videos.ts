// Videos cortos de animación (pedido de Pedro, 14/10/2026). Se arman con
// scripts/videos/hacer.py y viven en public/videos/<nombre>.mp4.
// - bienvenida: al entrar al mapa, como mucho una vez por semana;
// - festejo: la primera vez que se supera un mundo;
// - reserva y monte-leon: la primera vez que se abre cada actividad especial
//   (después se puede volver a ver con el botón 🎬).
// Desde el panel («Desafíos y eventos») se pueden apagar por grado.
import { DESAFIOS, desafioActivo } from "@/lib/eventos/config";

export type NombreVideo = "bienvenida" | "festejo" | "reserva" | "monte-leon";

export const RUTA_VIDEO = (n: NombreVideo) => `/videos/${n}.mp4`;
export const RUTA_VIDEO_WEBM = (n: NombreVideo) => `/videos/${n}.webm`;
export const PORTADA_VIDEO = (n: NombreVideo) => `/videos/${n}.jpg`;

const DIA = 86_400_000;

export function videosActivos(grade: number | undefined, now: Date = new Date()): boolean {
  return desafioActivo(DESAFIOS.videos, grade, now, () => true);
}

function clave(n: NombreVideo, code: string) {
  return `mt26-video-${n}-${code}`;
}

// ¿Toca mostrarlo? `cadaDias` = cada cuántos días se vuelve a mostrar solo
// (Infinity = una sola vez). Sin almacenamiento del navegador, no se muestra
// solo (para no repetirlo en cada carga).
export function tocaVideo(n: NombreVideo, code: string, cadaDias: number, now: number = Date.now()): boolean {
  try {
    const v = localStorage.getItem(clave(n, code));
    if (!v) return true;
    return Number.isFinite(cadaDias) && now - Number(v) >= cadaDias * DIA;
  } catch {
    return false;
  }
}

export function marcarVideoVisto(n: NombreVideo, code: string, now: number = Date.now()) {
  try {
    localStorage.setItem(clave(n, code), String(now));
  } catch {
    // sin almacenamiento: no pasa nada
  }
}
