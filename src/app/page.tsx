"use client";

import Link from "next/link";
import SkyScene from "@/components/SkyScene";
import HeroFondo from "@/components/HeroFondo";
import BannerAniversario from "@/components/BannerAniversario";
import LiveClock from "@/components/LiveClock";
import { useSkyTheme } from "@/lib/useSkyTheme";
import { SEASON_INFO } from "@/lib/skyTheme";

// Textos de la portada (configurables por instalación; por defecto, los del
// piloto actual).
const HOME_SCHOOL =
  process.env.NEXT_PUBLIC_HOME_SCHOOL ?? "Escuela Hogar Primaria Provincial Rural N°2 - Héroes de Malvinas";
const HOME_TEACHER = process.env.NEXT_PUBLIC_HOME_TEACHER ?? "Prof. Pedro Ojeda";

export default function Home() {
  const { period, season, moon, ready } = useSkyTheme();
  const isDay = ready && period === "day";
  const seasonInfo = SEASON_INFO[season];

  return (
    <main
      className="hero-contenido relative flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-hidden bg-slate-900"
    >
      <HeroFondo period={isDay ? "day" : "night"} />
      <SkyScene showCelestial={false} />

      <BannerAniversario />
      <div className="relative z-10 text-center mb-8">
        <p className="text-sm mb-1 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          {HOME_SCHOOL}
        </p>
        <p className="text-sm mb-6 text-slate-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
          {HOME_TEACHER}
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
          href="/prueba"
          className="rounded-2xl bg-amber-100/95 text-amber-950 font-bold text-base py-3 text-center shadow border-2 border-amber-500/60 hover:brightness-105 active:scale-[0.98] transition"
        >
          ✨ Probar MundoTest26
        </Link>
        <Link
          href={process.env.NEXT_PUBLIC_SUPABASE_URL ? "/docente" : "/admin"}
          className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg py-4 text-center shadow-lg shadow-blue-600/20 border-2 border-blue-800/40 hover:brightness-105 active:scale-[0.98] transition"
        >
          🧑‍🏫 Soy docente
        </Link>
        <Link
          href="/familias"
          className="rounded-2xl bg-white/90 text-slate-800 font-bold text-base py-3 text-center shadow border-2 border-white/60 hover:brightness-105 active:scale-[0.98] transition"
        >
          👨‍👩‍👧 Familias: fichas para imprimir
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
