"use client";

import Link from "next/link";
import CloudsBackground from "@/components/CloudsBackground";
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
      className={`relative flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-hidden transition-colors duration-1000 bg-gradient-to-b ${
        isDay
          ? "from-sky-300 via-sky-100 to-amber-50"
          : "from-slate-950 via-indigo-950 to-slate-950"
      }`}
    >
      <CloudsBackground />
      <SkyScene />
      <div className="relative z-10 text-center mb-10">
        <p className={`text-sm mb-1 ${isDay ? "text-slate-700" : "text-slate-300"}`}>
          Escuela Hogar Primaria Provincial Rural N°2 - Héroes de Malvinas
        </p>
        <p className={`text-sm mb-6 ${isDay ? "text-slate-500" : "text-slate-400"}`}>
          Prof. Pedro Ojeda
        </p>
        <h1
          className={`text-5xl sm:text-6xl font-black bg-gradient-to-r bg-clip-text text-transparent drop-shadow-sm ${
            isDay
              ? "from-amber-600 via-orange-500 to-amber-700"
              : "from-amber-300 via-yellow-200 to-amber-400"
          }`}
        >
          MundoTest26
        </h1>
        <p className={`mt-3 ${isDay ? "text-slate-700" : "text-slate-300"}`}>
          El videojuego de la Escuela Hogar
        </p>
      </div>

      <LiveClock isDay={isDay} />

      <div className="relative z-10 flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/student"
          className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold text-lg py-4 text-center shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition"
        >
          🎮 Soy alumno/a
        </Link>
        <Link
          href="/admin"
          className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg py-4 text-center shadow-lg shadow-blue-600/20 hover:brightness-105 active:scale-[0.98] transition"
        >
          🧑‍🏫 Soy docente
        </Link>
      </div>

      {ready && (
        <p
          className={`relative z-10 mt-8 text-xs ${
            isDay ? "text-slate-500" : "text-slate-500"
          }`}
          title={`${moon.name}, ${moon.illumination}% iluminada`}
        >
          {moon.emoji} {moon.name} · {seasonInfo.emoji} {seasonInfo.label}
        </p>
      )}
    </main>
  );
}
