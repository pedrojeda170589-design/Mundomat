"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { getAccessoryById, getAccessorySrc, type StudentProgress } from "@/types";
import { IMAGENES_LISTAS } from "@/lib/coleccion/imagenes-listas";
import { METAS, ACTIVIDADES_DIA_SUPER, type Meta } from "@/lib/coleccion/metasDatos";
import { avanceMetas, metaCumplida, type AvanceMetas } from "@/lib/coleccion/metas";
import { rutaPrenda } from "@/lib/vestidor/catalogo";

const GRUPOS: { clave: "racha" | "etapas" | "diasSuper"; titulo: string; ayuda: string }[] = [
  { clave: "racha", titulo: "🔥 Racha de estudio", ayuda: "Días de estudio seguidos (cuenta tu mejor racha)." },
  { clave: "etapas", titulo: "🗺️ Etapas superadas", ayuda: "Cada módulo del mapa con todos sus mundos completos." },
  { clave: "diasSuper", titulo: "⚡ Días súper", ayuda: `Días con ${ACTIVIDADES_DIA_SUPER} actividades o más bien hechas.` },
];

function Dibujo({ m }: { m: Meta }) {
  const p = m.premio;
  let src: string | null = null;
  if (p.tipo === "avatar" && IMAGENES_LISTAS.has(p.id)) src = `/theme/avatars/${p.id}.png`;
  if (p.tipo === "objeto" && getAccessoryById(p.id)) src = getAccessorySrc(p.id);
  if (p.tipo === "prenda") src = rutaPrenda(p.id, true);
  return (
    <span className="relative w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 flex items-center justify-center text-2xl overflow-hidden">
      {src ? <Image src={src} alt="" fill sizes="56px" className="object-contain p-1" /> : p.emoji}
    </span>
  );
}

const TIPO: Record<Meta["premio"]["tipo"], string> = { avatar: "Avatar", objeto: "Objeto", prenda: "Ropa del vestidor" };

// Metas especiales: avatares, objetos y ropa que se ganan con la racha, las
// etapas del mapa y los días súper (ver src/lib/coleccion/metasDatos.ts).
export default function MetasEspeciales({ progress, onClose }: { progress: StudentProgress; onClose: () => void }) {
  const a: AvanceMetas = avanceMetas(progress);
  const dadas = new Set(progress.metasReclamadas ?? []);
  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/55 px-2 py-3" role="dialog" aria-modal="true" aria-label="Metas especiales">
      <div className="w-full max-w-md max-h-[94vh] overflow-y-auto rounded-[2rem] border-4 border-amber-300 bg-amber-50 shadow-2xl">
        <div className="sticky top-0 z-10 wood-panel px-4 py-2 flex items-center justify-between">
          <h2 className="font-black text-lg drop-shadow">🎯 Metas especiales</h2>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-gradient-to-b from-rose-400 to-rose-600 border-2 border-white text-white font-black shadow"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="p-3 flex flex-col gap-4">
          {GRUPOS.map((g) => {
            const lista = METAS.filter((m) => m[g.clave] !== undefined);
            const valor = a[g.clave];
            return (
              <section key={g.clave}>
                <p className="font-black text-amber-950">
                  {g.titulo} · <span className="text-orange-700">llevás {valor}</span>
                </p>
                <p className="text-[11px] text-amber-900/75 mb-2">{g.ayuda}</p>
                <div className="flex flex-col gap-1.5">
                  {lista.map((m) => {
                    const meta = m[g.clave]!;
                    const listo = dadas.has(m.id) || metaCumplida(m, a);
                    return (
                      <div
                        key={m.id}
                        className={`flex items-center gap-3 rounded-xl border-2 px-2 py-1.5 ${listo ? "bg-emerald-50 border-emerald-300" : "bg-white border-amber-200"}`}
                      >
                        <Dibujo m={m} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-amber-950 leading-tight">{m.premio.label}</p>
                          <p className="text-[10px] text-amber-800">{TIPO[m.premio.tipo]} · meta: {meta}</p>
                          <span className="mt-1 block h-1.5 rounded-full bg-amber-900/10 overflow-hidden">
                            <span className="block h-full bg-orange-500" style={{ width: `${Math.min(100, Math.round((valor / meta) * 100))}%` }} />
                          </span>
                        </div>
                        <span className={`text-[11px] font-black shrink-0 ${listo ? "text-emerald-700" : "text-orange-700"}`}>
                          {listo ? "✅ ¡Ganado!" : `Faltan ${meta - valor}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
