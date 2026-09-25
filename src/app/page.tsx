"use client";

import Link from "next/link";
import SkyScene from "@/components/SkyScene";
import LiveClock from "@/components/LiveClock";
import { useSkyTheme } from "@/lib/useSkyTheme";
import { SEASON_INFO } from "@/lib/skyTheme";

export default function Home() {
  const { period, season, moon, ready } = useSkyTheme();
  const isDay = ready && period === "day";
  const seasonInfo = SEASON_INFO[season];

  return (
    <main
      className={`relative flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-hidden transition-colors duration-1000 ${
        isDay ? "bg-hero-day" : "bg-hero-night"
      }`}
    >
      <SkyScene showCelestial={false} />

      <div className="relative z-10 text-center mb-8">
        <p className="text-sm mb-1 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          Escuela Hogar Primaria Provincial Rural N°2 - Héroes de Malvinas
        </p>
        <p className="text-sm mb-6 text-slate-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          Prof. Pedro Ojeda
        </p>

        <div className="explorer-title-plaque inline-block px-8 py-5">
          <h1 className="text-4xl sm:text-5xl font-black text-amber-50 drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]">
            🧭 MundoTest26
          </h1>
        </div>

        <p className="mt-4 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          El videojuego de la Escuela Hogar
        </p>
      </div>

      <LiveClock />

      <div className="relative z-10 flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/student"
          className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold text-lg py-4 text-center shadow-lg shadow-amber-500/20 border-2 border-amber-700/40 hover:brightness-105 active:scale-[0.98] transition"
        >
          🎒 Soy alumno/a
        </Link>
        <Link
          href="/admin"
          className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg py-4 text-center shadow-lg shadow-blue-600/20 border-2 border-blue-800/40 hover:brightness-105 active:scale-[0.98] transition"
        >
          🧑‍🏫 Soy docente
        </Link>
      </div>

      {ready && (
        <p
          className="relative z-10 mt-8 text-xs text-slate-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
          title={`${moon.name}, ${moon.illumination}% iluminada`}
        >
          {moon.emoji} {moon.name} · {seasonInfo.emoji} {seasonInfo.label}
        </p>
      )}
    </main>
  );
}
