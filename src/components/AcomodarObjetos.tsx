"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import AvatarDisplay from "@/components/AvatarDisplay";
import {
  AvatarAccessories,
  AvatarCapa,
  AvatarTweak,
  AvatarTweaks,
  TWEAK_LIMITES,
  getAccessoryById,
  getAccessorySrc,
} from "@/types";
import { actualizarTweakCapa, capasDe, capasToAccessories, isPet, isProp } from "@/lib/avatarCapas";

// Vista grande del avatar para acomodar los objetos puestos: el alumno elige
// un objeto/capa, lo arrastra con el dedo (o el mouse) y lo agranda o achica.
// Pedido de Pedro: «que puedan ubicar y agrandar o achicar los objetos».
// Botones táctiles de al menos 44 px para celulares chicos.
const STAGE = 0.86; // los objetos de la cara se miden sobre el recuadro del personaje

interface Props {
  avatar: string;
  capas?: AvatarCapa[];
  accessories?: AvatarAccessories;
  background: string;
  birthday?: boolean;
  tweaks?: AvatarTweaks;
  onChange?: (t: AvatarTweaks) => void;
  onChangeCapas?: (c: AvatarCapa[]) => void;
}

export default function AcomodarObjetos({
  avatar,
  capas,
  accessories,
  background,
  birthday,
  tweaks,
  onChange,
  onChangeCapas,
}: Props) {
  const efectivasCapas = capas ?? capasDe({ avatarAccessories: accessories, avatarTweaks: tweaks });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const caja = useRef<HTMLDivElement>(null);
  const drag = useRef<{ px: number; py: number; t: AvatarTweak } | null>(null);

  const activo = selectedId && efectivasCapas.some((c) => c.id === selectedId) ? selectedId : null;
  const capaActiva = activo ? efectivasCapas.find((c) => c.id === activo) : null;
  const t: AvatarTweak = capaActiva
    ? { x: capaActiva.x ?? 0, y: capaActiva.y ?? 0, s: capaActiva.s ?? 1 }
    : { x: 0, y: 0, s: 1 };
  const L = TWEAK_LIMITES;

  function poner(nuevo: AvatarTweak) {
    if (!activo) return;
    const v = {
      x: Math.max(-L.pos, Math.min(L.pos, Math.round(nuevo.x * 10) / 10)),
      y: Math.max(-L.pos, Math.min(L.pos, Math.round(nuevo.y * 10) / 10)),
      s: Math.max(L.sMin, Math.min(L.sMax, Math.round(nuevo.s * 100) / 100)),
    };
    const nextCapas = actualizarTweakCapa(efectivasCapas, activo, v);
    if (onChangeCapas) {
      onChangeCapas(nextCapas);
    }
    if (onChange) {
      const synced = capasToAccessories(nextCapas);
      onChange(synced.tweaks);
    }
  }

  function resetearLugar() {
    if (!activo) return;
    const nextCapas = actualizarTweakCapa(efectivasCapas, activo, { x: 0, y: 0, s: 1 });
    if (onChangeCapas) {
      onChangeCapas(nextCapas);
    }
    if (onChange) {
      const synced = capasToAccessories(nextCapas);
      onChange(synced.tweaks);
    }
  }

  function down(e: React.PointerEvent) {
    if (!activo) return;
    e.preventDefault(); // que el navegador no arrastre la imagen (cancelaba el gesto)
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, t };
  }

  function move(e: React.PointerEvent) {
    const d = drag.current;
    const box = caja.current?.getBoundingClientRect();
    if (!d || !box || !activo) return;
    const esPetOProp = isPet(activo) || isProp(activo);
    const base = esPetOProp ? box.width : box.width * STAGE;
    poner({ ...d.t, x: d.t.x + ((e.clientX - d.px) / base) * 100, y: d.t.y + ((e.clientY - d.py) / base) * 100 });
  }

  function up() {
    drag.current = null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={caja}
        className={`relative w-56 h-56 rounded-3xl overflow-hidden border-2 ${activo ? "border-sky-400 cursor-move" : "border-amber-400/70"} bg-slate-800 touch-none select-none`}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onDragStart={(e) => e.preventDefault()}
      >
        <AvatarDisplay
          character={avatar}
          capas={efectivasCapas}
          className="w-full h-full"
          alt="Vista previa de tu avatar"
          imageSizes="224px"
          background={background}
          birthday={birthday}
        />
        {activo && (
          <span className="absolute top-1.5 left-1/2 -translate-x-1/2 rounded-full bg-sky-500/90 text-white text-[10px] font-bold px-2 py-0.5 pointer-events-none">
            ✋ Arrastrá para mover
          </span>
        )}
      </div>

      {efectivasCapas.length > 0 ? (
        <>
          <p className="text-slate-400 text-[11px]">Tocá un objeto para acomodarlo:</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {efectivasCapas.map((c) => {
              const def = getAccessoryById(c.id);
              if (!def) return null;
              const hasTweak = (c.x !== undefined && c.x !== 0) || (c.y !== undefined && c.y !== 0) || (c.s !== undefined && c.s !== 1);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(activo === c.id ? null : c.id)}
                  title={def.label}
                  aria-label={def.label}
                  className={`relative min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl border-2 bg-slate-800 ${
                    activo === c.id ? "border-sky-400 ring-2 ring-sky-400/50" : "border-slate-600"
                  }`}
                >
                  <Image src={getAccessorySrc(c.id)} alt={def.label} fill sizes="44px" className="object-contain p-1" />
                  {hasTweak && <span className="absolute -top-1 -right-1 text-[10px]">✋</span>}
                </button>
              );
            })}
          </div>
          {activo && (
            <div className="w-full flex flex-col gap-2 rounded-2xl bg-slate-800/80 p-2.5">
              <label className="flex items-center gap-2 text-xs text-slate-200">
                <span className="w-16 shrink-0">Tamaño</span>
                <button
                  type="button"
                  aria-label="Achicar tamaño"
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-700 active:bg-slate-600 text-lg font-black flex items-center justify-center text-white"
                  onClick={() => poner({ ...t, s: t.s - 0.1 })}
                >
                  −
                </button>
                <input
                  type="range"
                  min={L.sMin}
                  max={L.sMax}
                  step={0.05}
                  value={t.s}
                  onChange={(e) => poner({ ...t, s: Number(e.target.value) })}
                  className="flex-1 accent-sky-400"
                />
                <button
                  type="button"
                  aria-label="Agrandar tamaño"
                  className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-700 active:bg-slate-600 text-lg font-black flex items-center justify-center text-white"
                  onClick={() => poner({ ...t, s: t.s + 0.1 })}
                >
                  +
                </button>
              </label>
              <div className="flex justify-between items-center gap-1">
                <div className="flex gap-1">
                  {([["⬅️", -2, 0, "Mover a la izquierda"], ["⬆️", 0, -2, "Mover arriba"], ["⬇️", 0, 2, "Mover abajo"], ["➡️", 2, 0, "Mover a la derecha"]] as const).map(([e, dx, dy, label]) => (
                    <button
                      key={e}
                      type="button"
                      aria-label={label}
                      className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-700 active:bg-slate-600 flex items-center justify-center text-sm"
                      onClick={() => poner({ ...t, x: t.x + dx, y: t.y + dy })}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="min-h-[44px] rounded-xl bg-slate-700 active:bg-slate-600 px-3 text-xs font-bold text-slate-200 flex items-center justify-center"
                  onClick={resetearLugar}
                >
                  ↩️ A su lugar
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-slate-500 text-[11px]">Poné objetos de tu inventario y después acomodalos acá.</p>
      )}
    </div>
  );
}
