"use client";

import { useEffect, useState } from "react";
import { alCambiarMusica, alternarMusica, musicaActiva } from "@/lib/musica";

// Botón 🎵 para prender o apagar la música de fondo (se recuerda en este dispositivo).
export default function MusicToggle({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(musicaActiva());
    return alCambiarMusica(setOn);
  }, []);
  return (
    <button
      type="button"
      onClick={() => setOn(alternarMusica())}
      aria-label={on ? "Apagar la música" : "Prender la música"}
      title={on ? "Apagar la música" : "Prender la música"}
      className={`fixed bottom-3 left-3 z-50 h-11 w-11 rounded-full bg-slate-900/70 border border-white/30 text-xl shadow-lg backdrop-blur ${className}`}
    >
      <span className={on ? "" : "opacity-40 line-through"}>🎵</span>
    </button>
  );
}
