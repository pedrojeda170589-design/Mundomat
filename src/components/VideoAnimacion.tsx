"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { bajarMusica, musicaActiva } from "@/lib/musica";
import { stopSpeaking } from "@/lib/tts";
import { PORTADA_VIDEO, RUTA_VIDEO, RUTA_VIDEO_WEBM, type NombreVideo } from "@/lib/videos";

// Reproductor de los videos cortos de animación: pantalla completa oscura,
// el video cuadrado al centro, botón «Saltar» y botón de sonido. Se cierra
// solo al terminar. Si el navegador no deja arrancar con sonido, arranca
// mudo y muestra «🔊 Activar sonido».
export default function VideoAnimacion({ nombre, onCerrar }: { nombre: NombreVideo; onCerrar: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [mudo, setMudo] = useState(!musicaActiva());
  const [error, setError] = useState(false);
  const cerrado = useRef(false);

  function cerrar() {
    if (cerrado.current) return;
    cerrado.current = true;
    onCerrar();
  }

  useEffect(() => {
    stopSpeaking();
    bajarMusica(true);
    const v = ref.current;
    if (v) {
      v.muted = !musicaActiva();
      v.play().catch(() => {
        // Autoplay con sonido bloqueado: sigue mudo.
        if (!v) return;
        v.muted = true;
        setMudo(true);
        v.play().catch(() => setError(true));
      });
    }
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    window.addEventListener("keydown", tecla);
    return () => {
      window.removeEventListener("keydown", tecla);
      bajarMusica(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sonido() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMudo(v.muted);
    if (v.paused) void v.play().catch(() => {});
  }

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/85 p-3" role="dialog" aria-modal="true" aria-label="Video">
      <div className="relative w-full max-w-[min(92vw,78vh)]">
        <video
          ref={ref}
          poster={PORTADA_VIDEO(nombre)}
          playsInline
          preload="auto"
          onEnded={cerrar}
          onError={() => {
            // Si falla una de las dos versiones (mp4 o webm) el navegador prueba
            // la otra: solo es error si no pudo cargar ninguna.
            const v = ref.current;
            if (v && (v.error || v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE)) setError(true);
          }}
          className="w-full aspect-square rounded-3xl border-4 border-amber-300 shadow-2xl bg-slate-900"
        >
          <source src={RUTA_VIDEO(nombre)} type="video/mp4" />
          <source src={RUTA_VIDEO_WEBM(nombre)} type="video/webm" />
        </video>
        <div className="absolute -bottom-14 left-0 right-0 flex justify-center gap-2">
          <button onClick={sonido} className="min-h-11 rounded-full bg-white/90 px-4 text-sm font-black text-slate-900 shadow">
            {mudo ? "🔊 Activar sonido" : "🔇 Sin sonido"}
          </button>
          <button onClick={cerrar} className="min-h-11 rounded-full bg-amber-400 px-5 text-sm font-black text-slate-950 shadow">
            {error ? "Cerrar" : "Saltar ⏭"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
