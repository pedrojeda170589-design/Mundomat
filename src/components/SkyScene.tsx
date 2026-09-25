"use client";

import { useSkyTheme } from "@/lib/useSkyTheme";
import { SEASON_INFO } from "@/lib/skyTheme";

// Estrellas fijas (posiciones prefijadas para que no "salten" entre renders).
const STARS = [
  { top: "8%", left: "12%", size: "0.35rem", delay: "0s" },
  { top: "14%", left: "78%", size: "0.25rem", delay: "-1.2s" },
  { top: "22%", left: "45%", size: "0.3rem", delay: "-2.4s" },
  { top: "5%", left: "60%", size: "0.2rem", delay: "-0.6s" },
  { top: "30%", left: "18%", size: "0.25rem", delay: "-3s" },
  { top: "18%", left: "90%", size: "0.3rem", delay: "-1.8s" },
  { top: "36%", left: "70%", size: "0.2rem", delay: "-2.7s" },
  { top: "10%", left: "30%", size: "0.3rem", delay: "-3.6s" },
];

// Partículas de estación: posiciones/tiempos variados para que caigan de
// forma pareja por toda la pantalla.
const PARTICLE_SLOTS = [
  { left: "5%", duration: "14s", delay: "-2s", size: "1.4rem" },
  { left: "20%", duration: "18s", delay: "-8s", size: "1rem" },
  { left: "35%", duration: "12s", delay: "-5s", size: "1.6rem" },
  { left: "50%", duration: "20s", delay: "-1s", size: "1.1rem" },
  { left: "65%", duration: "15s", delay: "-10s", size: "1.3rem" },
  { left: "80%", duration: "17s", delay: "-4s", size: "1rem" },
  { left: "92%", duration: "13s", delay: "-7s", size: "1.5rem" },
];

export default function SkyScene({
  showCelestial = true,
}: {
  // Cuando el fondo ya es una ilustración con su propio cielo, luna y
  // estrellas pintadas (ver bg-hero-*), no queremos duplicarlos: en ese
  // caso se pasa showCelestial={false} y solo quedan las partículas de
  // estación cayendo por encima.
  showCelestial?: boolean;
}) {
  const { period, season, moon, ready } = useSkyTheme();
  const seasonInfo = SEASON_INFO[season];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
    >
      {showCelestial && ready && period === "night" &&
        STARS.map((s, i) => (
          <span
            key={i}
            className="star-twinkle absolute rounded-full bg-white"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animation: `star-twinkle ${3 + i * 0.3}s ease-in-out infinite`,
              animationDelay: s.delay,
            }}
          />
        ))}

      {showCelestial && ready && (
        <div
          className="absolute select-none text-center"
          style={{
            top: "5%",
            right: "6%",
            fontSize: "4.5rem",
            opacity: period === "night" ? 0.95 : 0.4,
            filter:
              period === "night"
                ? "drop-shadow(0 0 28px rgba(255,255,220,0.65))"
                : "drop-shadow(0 0 10px rgba(255,255,255,0.4))",
          }}
          title={`${moon.name} (${moon.illumination}% iluminada)`}
        >
          {moon.emoji}
        </div>
      )}

      {ready &&
        PARTICLE_SLOTS.map((p, i) => (
          <span
            key={i}
            className="season-fall absolute select-none"
            style={{
              left: p.left,
              top: "-10%",
              fontSize: p.size,
              opacity: 0.55,
              animation: `season-fall ${p.duration} linear infinite`,
              animationDelay: p.delay,
            }}
          >
            {seasonInfo.particle}
          </span>
        ))}
    </div>
  );
}
