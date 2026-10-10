"use client";

import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { StudentProgress } from "@/types";
import {
  CUERPOS,
  EMOJI_ZONA,
  NOMBRE_ZONA,
  capasVestimenta,
  PRENDAS,
  VESTIMENTA_INICIAL,
  prendasDe,
  rutaCuerpo,
  rutaPrenda,
  type Vestimenta,
  type ZonaPrenda,
} from "@/lib/vestidor/catalogo";
import { METAS } from "@/lib/coleccion/metasDatos";

// Muñeco de cuerpo completo: el cuerpo y encima las prendas, en orden.
export function MunecoVestido({ v, className = "" }: { v: Vestimenta; className?: string }) {
  return (
    <span className={`relative block aspect-[2/3] ${className}`}>
      {capasVestimenta(v).map((src) => (
        <Image key={src} src={src} alt="" fill sizes="256px" className="object-contain" />
      ))}
    </span>
  );
}

function comoSeGana(id: string): string | null {
  const m = METAS.find((x) => x.premio.tipo === "prenda" && x.premio.id === id);
  if (!m) return null;
  if (m.racha) return `🔥 ${m.racha} días de racha`;
  if (m.etapas) return `🗺️ ${m.etapas} ${m.etapas === 1 ? "etapa superada" : "etapas superadas"}`;
  if (m.diasSuper) return `⚡ ${m.diasSuper} ${m.diasSuper === 1 ? "día súper" : "días súper"}`;
  return null;
}

// Vestidor (pedido de Pedro, 10/10/2026): el alumno elige su cuerpo y combina
// la ropa que ganó o compró. Lo que no tiene se ve con el precio o con la
// meta que hay que cumplir.
export default function Vestidor({
  code,
  progress,
  onClose,
  onProgress,
}: {
  code: string;
  progress: StudentProgress;
  onClose: () => void;
  onProgress: (p: StudentProgress) => void;
}) {
  const [v, setV] = useState<Vestimenta>(progress.vestimenta ?? VESTIMENTA_INICIAL);
  const [zona, setZona] = useState<ZonaPrenda>("arriba");
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const tiene = new Set(prendasDe(progress));
  const cambiado = JSON.stringify(v) !== JSON.stringify(progress.vestimenta ?? VESTIMENTA_INICIAL);

  function poner(id: string, z: ZonaPrenda) {
    setMsg(null);
    setV((prev) => ({ ...prev, puesto: { ...prev.puesto, [z]: prev.puesto[z] === id ? undefined : id } }));
  }

  async function comprar(id: string) {
    setOcupado(true);
    setMsg(null);
    try {
      const r = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, itemId: id }),
      });
      const d = await r.json();
      if (!r.ok) setMsg({ ok: false, texto: d.error ?? "No se pudo comprar." });
      else {
        onProgress(d.progress);
        const def = PRENDAS.find((p) => p.id === id)!;
        setV((prev) => ({ ...prev, puesto: { ...prev.puesto, [def.zona]: id } }));
        setMsg({ ok: true, texto: `¡Compraste: ${def.label}! Tocá «Guardar» para quedártela puesta.` });
      }
    } catch {
      setMsg({ ok: false, texto: "No hay conexión. Probá de nuevo." });
    } finally {
      setOcupado(false);
    }
  }

  async function guardar() {
    setOcupado(true);
    setMsg(null);
    try {
      const r = await fetch("/api/vestidor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, vestimenta: v }),
      });
      const d = await r.json();
      if (!r.ok) setMsg({ ok: false, texto: d.error ?? "No se pudo guardar." });
      else {
        onProgress(d.progress);
        setMsg({ ok: true, texto: "¡Guardado! 👕" });
      }
    } catch {
      setMsg({ ok: false, texto: "No hay conexión. Probá de nuevo." });
    } finally {
      setOcupado(false);
    }
  }

  const deZona = PRENDAS.filter((p) => p.zona === zona);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-2 py-3" role="dialog" aria-modal="true" aria-label="Vestidor">
      <div className="relative w-full max-w-md max-h-[94vh] overflow-y-auto rounded-[2rem] border-4 border-amber-300 bg-amber-50 shadow-2xl">
        <div className="sticky top-0 z-10 wood-panel px-4 py-2 flex items-center justify-between">
          <h2 className="font-black text-lg drop-shadow">👕 Mi vestidor</h2>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-gradient-to-b from-rose-400 to-rose-600 border-2 border-white text-white font-black shadow"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="p-3 flex gap-3">
          <div className="w-40 shrink-0 rounded-2xl bg-gradient-to-b from-sky-200 to-emerald-100 border-2 border-sky-300 p-1">
            <MunecoVestido v={v} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-amber-950 mb-1">Elegí tu personaje</p>
            <div className="grid grid-cols-2 gap-1.5">
              {CUERPOS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setV((prev) => ({ ...prev, cuerpo: c.id }))}
                  aria-pressed={v.cuerpo === c.id}
                  aria-label={c.label}
                  className={`relative h-16 overflow-hidden rounded-xl border-2 bg-white ${
                    v.cuerpo === c.id ? "border-emerald-500 ring-2 ring-emerald-300" : "border-amber-200"
                  }`}
                >
                  <Image src={rutaCuerpo(c.id)} alt="" fill sizes="96px" className="object-cover object-top scale-[1.35] origin-top" />
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-amber-900/80 leading-snug">
              Tocá una prenda para ponértela o sacártela. La ropa se gana con las metas especiales o se compra con monedas.
            </p>
            <p className="mt-1 text-xs font-black text-amber-950">🪙 {progress.coins} monedas</p>
          </div>
        </div>

        <div className="px-3 flex gap-1 overflow-x-auto pb-1" role="tablist">
          {(["arriba", "abajo", "calzado", "abrigo", "cabeza", "extra"] as ZonaPrenda[]).map((z) => (
            <button
              key={z}
              role="tab"
              aria-selected={zona === z}
              onClick={() => setZona(z)}
              className={`shrink-0 min-h-11 rounded-full border-2 px-3 text-xs font-black ${
                zona === z ? "bg-amber-500 text-white border-amber-600" : "bg-white text-amber-900 border-amber-200"
              }`}
            >
              {EMOJI_ZONA[z]} {NOMBRE_ZONA[z]}
            </button>
          ))}
        </div>

        {msg && (
          <p
            className={`mx-3 mt-2 rounded-xl border px-3 py-2 text-xs font-bold ${
              msg.ok ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-rose-50 border-rose-300 text-rose-800"
            }`}
            role="status"
          >
            {msg.texto}
          </p>
        )}

        <div className="p-3 grid grid-cols-3 gap-2">
          {deZona.map((p) => {
            const mia = tiene.has(p.id);
            const puesta = v.puesto[p.zona] === p.id;
            const meta = !mia && !p.precio ? comoSeGana(p.id) : null;
            return (
              <div
                key={p.id}
                className={`rounded-xl border-2 p-1.5 flex flex-col items-center text-center ${
                  puesta ? "border-emerald-500 bg-emerald-50" : mia ? "border-amber-200 bg-white" : "border-slate-200 bg-slate-50"
                }`}
              >
                <button
                  onClick={() => mia && poner(p.id, p.zona)}
                  disabled={!mia}
                  aria-label={mia ? `${puesta ? "Sacarme" : "Ponerme"} ${p.label}` : p.label}
                  className="relative w-full aspect-square disabled:cursor-default"
                >
                  <Image src={rutaPrenda(p.id, true)} alt="" fill sizes="96px" className={`object-contain ${mia ? "" : "opacity-50 grayscale"}`} />
                  {puesta && <span className="absolute top-0 right-0 text-sm">✅</span>}
                  {!mia && <span className="absolute top-0 right-0 text-sm">🔒</span>}
                </button>
                <span className="text-[10px] font-black text-amber-950 leading-tight mt-0.5">{p.label}</span>
                {!mia && p.precio ? (
                  <button
                    onClick={() => comprar(p.id)}
                    disabled={ocupado || progress.coins < p.precio}
                    className="mt-1 min-h-9 w-full rounded-lg bg-amber-500 text-white text-[11px] font-black disabled:opacity-50"
                  >
                    🪙 {p.precio}
                  </button>
                ) : !mia && meta ? (
                  <span className="mt-1 text-[10px] font-bold text-orange-700 leading-tight">{meta}</span>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 bg-amber-50/95 border-t border-amber-200 p-3 flex gap-2">
          <button
            onClick={() => setV(progress.vestimenta ?? VESTIMENTA_INICIAL)}
            disabled={!cambiado || ocupado}
            className="min-h-11 flex-1 rounded-xl border-2 border-amber-300 bg-white text-amber-900 font-bold text-sm disabled:opacity-40"
          >
            Deshacer
          </button>
          <button
            onClick={guardar}
            disabled={!cambiado || ocupado}
            className="min-h-11 flex-[2] rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-sm shadow disabled:opacity-40"
          >
            💾 Guardar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
