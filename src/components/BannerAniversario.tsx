"use client";

import { useAniversario } from "@/components/HeroFondo";

// Cartel del cumpleaños de la Escuela (semana del 4 de octubre).
export default function BannerAniversario() {
  const on = useAniversario();
  if (!on) return null;
  return (
    <div className="relative z-10 mb-4 max-w-sm mx-auto rounded-2xl border-4 border-white bg-gradient-to-r from-sky-400 via-white to-sky-400 px-4 py-2 text-center shadow-xl animate-[pulse_3s_ease-in-out_infinite]">
      <p className="text-lg font-black text-sky-900">🎉 ¡Feliz cumpleaños, Escuela! 🎂</p>
      <p className="text-xs font-bold text-sky-800">Escuela Hogar Primaria Provincial Rural N.º 2 «Héroes de Malvinas»</p>
      <p className="text-[11px] text-sky-700">Entrá a jugar: tu avatar festeja con el gorrito celeste y blanco 🥳</p>
    </div>
  );
}
