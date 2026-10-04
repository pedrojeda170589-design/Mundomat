"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import AvatarDisplay from "@/components/AvatarDisplay";
import {
  AccessorySlot,
  AvatarAccessories,
  AvatarTweak,
  AvatarTweaks,
  TWEAK_LIMITES,
  getAccessoryById,
  getAccessorySrc,
} from "@/types";

// Vista grande del avatar para acomodar los objetos puestos: el alumno elige
// un objeto, lo arrastra con el dedo (o el mouse) y lo agranda o achica.
// Pedido de Pedro: «que puedan ubicar y agrandar o achicar los objetos».
const ORDEN: AccessorySlot[] = ["headwear", "eyewear", "face", "pendant", "torso", "backpack", "pet", "prop"];
const NOMBRE: Record<AccessorySlot, string> = {
  headwear: "Cabeza",
  eyewear: "Ojos",
  face: "Cuello",
  pendant: "Colgante",
  torso: "Campera",
  backpack: "Mochila",
  pet: "Mascota",
  prop: "En la mano",
};
const STAGE = 0.86; // los objetos de la cara se miden sobre el recuadro del personaje

export default function AcomodarObjetos({
  avatar,
  accessories,
  background,
  birthday,
  tweaks,
  onChange,
}: {
  avatar: string;
  accessories: AvatarAccessories;
  background: string;
  birthday?: boolean;
  tweaks: AvatarTweaks;
  onChange: (t: AvatarTweaks) => void;
}) {
  const puestos = ORDEN.filter((s) => accessories[s] && getAccessoryById(accessories[s]!));
  const [slot, setSlot] = useState<AccessorySlot | null>(null);
  const caja = useRef<HTMLDivElement>(null);
  const drag = useRef<{ px: number; py: number; t: AvatarTweak } | null>(null);
  const activo = slot && accessories[slot] ? slot : null;
  const t: AvatarTweak = (activo && tweaks[activo]) || { x: 0, y: 0, s: 1 };
  const L = TWEAK_LIMITES;

  function poner(nuevo: AvatarTweak) {
    if (!activo) return;
    const v = {
      x: Math.max(-L.pos, Math.min(L.pos, Math.round(nuevo.x * 10) / 10)),
      y: Math.max(-L.pos, Math.min(L.pos, Math.round(nuevo.y * 10) / 10)),
      s: Math.max(L.sMin, Math.min(L.sMax, Math.round(nuevo.s * 100) / 100)),
    };
    onChange({ ...tweaks, [activo]: v });
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
    const base = activo === "pet" || activo === "prop" ? box.width : box.width * STAGE;
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
          accessories={accessories}
          tweaks={tweaks}
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

      {puestos.length > 0 ? (
        <>
          <p className="text-slate-400 text-[11px]">Tocá un objeto para acomodarlo:</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {puestos.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSlot(activo === s ? null : s)}
                title={NOMBRE[s]}
                className={`relative w-11 h-11 rounded-xl border-2 bg-slate-800 ${activo === s ? "border-sky-400 ring-2 ring-sky-400/50" : "border-slate-600"}`}
              >
                <Image src={getAccessorySrc(accessories[s]!)} alt={NOMBRE[s]} fill sizes="44px" className="object-contain p-1" />
                {tweaks[s] && <span className="absolute -top-1 -right-1 text-[10px]">✋</span>}
              </button>
            ))}
          </div>
          {activo && (
            <div className="w-full flex flex-col gap-1.5 rounded-2xl bg-slate-800/80 p-2">
              <label className="flex items-center gap-2 text-xs text-slate-200">
                <span className="w-16 shrink-0">Tamaño</span>
                <button type="button" className="rounded-lg bg-slate-700 w-8 h-8 text-lg font-black" onClick={() => poner({ ...t, s: t.s - 0.1 })}>
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
                <button type="button" className="rounded-lg bg-slate-700 w-8 h-8 text-lg font-black" onClick={() => poner({ ...t, s: t.s + 0.1 })}>
                  +
                </button>
              </label>
              <div className="flex justify-between">
                <div className="flex gap-1">
                  {([["⬅️", -2, 0], ["⬆️", 0, -2], ["⬇️", 0, 2], ["➡️", 2, 0]] as const).map(([e, dx, dy]) => (
                    <button key={e} type="button" className="rounded-lg bg-slate-700 w-8 h-8" onClick={() => poner({ ...t, x: t.x + dx, y: t.y + dy })}>
                      {e}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-slate-700 px-2 text-[11px] font-bold text-slate-200"
                  onClick={() => {
                    const next = { ...tweaks };
                    delete next[activo];
                    onChange(next);
                  }}
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
