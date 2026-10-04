"use client";

import Image from "next/image";
import { useAniversario } from "@/components/HeroFondo";

// Año de fundación de la Escuela Hogar N.º 2 (el 4/10/2026 cumple 44).
const FUNDACION = 1982;

// Cartel del cumpleaños de la Escuela (solo el 4 de octubre).
export default function BannerAniversario() {
  const on = useAniversario();
  if (!on) return null;
  const anios = new Date().getFullYear() - FUNDACION;
  return (
    <div className="relative z-10 mb-4 max-w-sm mx-auto flex items-center gap-3 rounded-2xl border-4 border-white bg-gradient-to-r from-sky-300 via-white to-sky-300 px-3 py-2 shadow-xl">
      <span className="relative w-16 h-14 shrink-0">
        <Image src="/theme/escudo-escuela.png" alt="Escudo de la Escuela Hogar Rural N.º 2" fill sizes="64px" className="object-contain drop-shadow" />
      </span>
      <div className="text-left">
        <p className="text-base font-black text-sky-900 leading-tight">🎉 ¡Feliz cumpleaños número {anios}, Escuela! 🎂</p>
        <p className="text-[11px] font-bold text-sky-800 leading-tight">Escuela Hogar Primaria Provincial Rural N.º 2 «Héroes de Malvinas» · Gdor. Gregores</p>
        <p className="text-[10px] text-sky-700">Entrá a jugar: tu avatar festeja con el gorrito celeste y blanco 🥳</p>
      </div>
    </div>
  );
}
