"use client";

import { useEffect, useRef, useState } from "react";
import { playClip, stopClip } from "@/lib/audio";
import { cardBase } from "./shared";

interface Props {
  prompt: string;
  say?: string;
  glyph: string;
  onDone: (correct: boolean) => void;
}

const SIZE = 300;
const FONT = (px: number) => `bold ${px}px Andika, "Comic Sans MS", ui-rounded, system-ui, sans-serif`;

// Repasar con el dedo una letra o un número punteado. Se considera logrado
// cuando el trazo cubre buena parte de la letra sin salirse demasiado.
export default function TraceActivity({ prompt, say, glyph, onDone }: Props) {
  const guideRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const [result, setResult] = useState<null | boolean>(null);

  const fontPx = glyph.length > 1 ? 170 : 230;

  useEffect(() => {
    const t = setTimeout(() => playClip({ say: say ?? prompt }), 250);
    return () => {
      clearTimeout(t);
      stopClip();
    };
  }, [say, prompt]);

  useEffect(() => {
    const c = guideRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, SIZE, SIZE);
    // renglones
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    for (const y of [70, 150, 230]) {
      ctx.setLineDash(y === 150 ? [6, 6] : []);
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(SIZE - 10, y);
      ctx.stroke();
    }
    // Letra clarita de fondo y borde punteado: se repasa por dentro.
    ctx.font = FONT(fontPx);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText(glyph, SIZE / 2, 232);
    ctx.setLineDash([3, 9]);
    ctx.lineCap = "round";
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#64748b";
    ctx.font = FONT(fontPx);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.strokeText(glyph, SIZE / 2, 232);
    ctx.setLineDash([]);
  }, [glyph, fontPx]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SIZE, y: ((e.clientY - r.top) / r.height) * SIZE };
  }

  function down(e: React.PointerEvent<HTMLCanvasElement>) {
    if (result !== null) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !last.current) return;
    const p = pos(e);
    const ctx = drawRef.current!.getContext("2d")!;
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 22;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (!hasInk) setHasInk(true);
  }

  function up() {
    drawing.current = false;
    last.current = null;
  }

  function clear() {
    const ctx = drawRef.current!.getContext("2d")!;
    ctx.clearRect(0, 0, SIZE, SIZE);
    setHasInk(false);
  }

  function check() {
    // Máscara de la letra (rellena y un poco engrosada).
    const mask = document.createElement("canvas");
    mask.width = mask.height = SIZE;
    const m = mask.getContext("2d")!;
    m.font = FONT(fontPx);
    m.textAlign = "center";
    m.textBaseline = "alphabetic";
    m.lineWidth = 18;
    m.strokeStyle = "#000";
    m.fillText(glyph, SIZE / 2, 232);
    m.strokeText(glyph, SIZE / 2, 232);
    const mk = m.getImageData(0, 0, SIZE, SIZE).data;
    const ink = drawRef.current!.getContext("2d")!.getImageData(0, 0, SIZE, SIZE).data;
    let letter = 0;
    let covered = 0;
    let inkTotal = 0;
    let inkOut = 0;
    for (let i = 3; i < mk.length; i += 16) {
      const inLetter = mk[i] > 0;
      const inked = ink[i] > 0;
      if (inLetter) {
        letter++;
        if (inked) covered++;
      }
      if (inked) {
        inkTotal++;
        if (!inLetter) inkOut++;
      }
    }
    const coverage = letter ? covered / letter : 0;
    const outside = inkTotal ? inkOut / inkTotal : 1;
    const ok = coverage >= 0.55 && outside <= 0.45;
    setResult(ok);
    setTimeout(() => onDone(ok), 1000);
  }

  return (
    <div className={cardBase}>
      <div className="flex items-start gap-2 mb-3">
        <button
          type="button"
          onClick={() => playClip({ say: say ?? prompt })}
          className="shrink-0 w-11 h-11 rounded-full bg-sky-500 text-white text-xl shadow active:scale-95"
          aria-label="Escuchar la consigna"
        >
          🔊
        </button>
        <p className="text-lg font-bold text-white leading-snug pt-1.5">{prompt}</p>
      </div>
      <div
        className={`relative mx-auto rounded-2xl bg-white border-4 ${
          result === null ? "border-slate-300" : result ? "border-emerald-500" : "border-red-400"
        }`}
        style={{ width: "min(100%, 300px)", aspectRatio: "1" }}
      >
        <canvas ref={guideRef} width={SIZE} height={SIZE} className="absolute inset-0 w-full h-full" />
        <canvas
          ref={drawRef}
          width={SIZE}
          height={SIZE}
          className="absolute inset-0 w-full h-full touch-none opacity-80"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerLeave={up}
        />
      </div>
      {result === false && <p className="text-center text-amber-200 font-bold mt-2">Seguí los puntitos con el dedo, de arriba hacia abajo.</p>}
      {result === null && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button type="button" onClick={clear} className="rounded-2xl bg-slate-700 text-white font-bold py-3">
            🧽 Borrar
          </button>
          <button type="button" onClick={check} disabled={!hasInk} className="rounded-2xl bg-amber-400 text-slate-900 font-black py-3 disabled:opacity-40">
            ¡Listo!
          </button>
        </div>
      )}
    </div>
  );
}
