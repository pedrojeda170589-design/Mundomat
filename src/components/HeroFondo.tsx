"use client";

import { useEffect, useState } from "react";
import { getMoonPhase } from "@/lib/skyTheme";
import { isEventActiveNow } from "@/lib/seasons";

// ¿Es la semana del cumpleaños de la Escuela? (se mira en el navegador)
export function useAniversario(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(isEventActiveNow("aniversario")), 0);
    return () => clearTimeout(t);
  }, []);
  return on;
}

// Fondo ilustrado de la portada y del ingreso, que se ve COMPLETO en
// cualquier pantalla (antes, en el celular, «cover» recortaba la lámina y
// solo se veían los chicos). La lámina entra entera arriba y el resto de la
// pantalla se completa con la misma imagen, desenfocada.
//
// De noche, la luna pintada muestra la fase REAL de hoy: se le pone encima
// la sombra que corresponde (hemisferio sur: la luna creciente se ilumina
// del lado izquierdo).
const ANCHO = 1672;
const ALTO = 941;
// Luna pintada en hero-landscape-night.jpg (centro y radio, en px de la lámina).
const LUNA = { x: 1503, y: 149, r: 63 };

export default function HeroFondo({ period }: { period: "day" | "night" }) {
  // En el cumpleaños de la Escuela, la portada es la escuela de fiesta.
  const fiesta = useAniversario();
  const src = fiesta ? "/theme/hero-aniversario.jpg" : period === "day" ? "/theme/hero-landscape-day.jpg" : "/theme/hero-landscape-night.jpg";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <div
        className="absolute inset-[-40px] bg-cover bg-center blur-2xl brightness-[0.7] saturate-[1.1]"
        style={{ backgroundImage: `url(${src})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40" />
      <div className="hero-marco">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="absolute inset-0 w-full h-full object-contain" />
        {period === "night" && !fiesta && <SombraLunar />}
      </div>
    </div>
  );
}

// Sombra de la fase lunar sobre la luna pintada.
function SombraLunar() {
  // Se calcula en el navegador (con su fecha), después de montar: así no
  // difiere de lo que dibujó el servidor.
  const [f, setF] = useState<number | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setF(fraccionLunar()), 0);
    return () => clearTimeout(t);
  }, []);
  if (f === null) return null;
  const { x, y, r } = LUNA;
  const ilum = (1 - Math.cos(2 * Math.PI * f)) / 2; // 0 nueva … 1 llena
  // Hemisferio sur: creciente (f < 0,5) iluminada a la izquierda → sombra a la derecha.
  const s = f < 0.5 ? 1 : -1;
  const e = r * Math.abs(Math.cos(2 * Math.PI * f)); // semieje del terminador
  const masDeMedia = ilum < 0.5; // la sombra cubre más de media luna
  const xMedio = masDeMedia ? -s * e : s * e;
  const d = [
    `M ${x} ${y - r}`,
    `A ${r} ${r} 0 0 ${s > 0 ? 1 : 0} ${x} ${y + r}`,
    `A ${Math.max(e, 0.01)} ${r} 0 0 ${xMedio < 0 ? 1 : 0} ${x} ${y - r}`,
    "Z",
  ].join(" ");
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${ANCHO} ${ALTO}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="borde-luna" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <radialGradient id="halo-luna">
          <stop offset="0.55" stopColor="rgba(12,18,48,0)" />
          <stop offset="1" stopColor="rgba(12,18,48,0.85)" />
        </radialGradient>
      </defs>
      {/* El resplandor se apaga cuando hay poca luna. */}
      <circle cx={x} cy={y} r={r * 1.8} fill="url(#halo-luna)" opacity={(1 - ilum) * 0.55} />
      {ilum < 0.985 && <path d={d} fill="rgba(14,20,52,0.9)" filter="url(#borde-luna)" />}
      <title>{getMoonPhase().name}</title>
    </svg>
  );
}

function fraccionLunar(date: Date = new Date()): number {
  const NUEVA = Date.UTC(2000, 0, 6, 18, 14, 0);
  const SINODICO = 29.530588853;
  const dias = (date.getTime() - NUEVA) / 86_400_000;
  return (((dias % SINODICO) + SINODICO) % SINODICO) / SINODICO;
}
