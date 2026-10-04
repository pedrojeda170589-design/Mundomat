"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import AvatarDisplay from "@/components/AvatarDisplay";
import { getSeasonalEventById } from "@/lib/seasons";
import { AVISO_PREVIO_DIAS, textoContador, ventanaDe, type Ventana } from "@/lib/tiempo-limitado";
import {
  ACCESSORY_CATALOG_TIENDA,
  AVATAR_INFO,
  AccessoryDef,
  AvatarAccessories,
  SHOP_AVATARS,
  SHOP_CATEGORY_LABEL,
  ShopAvatar,
  StudentProgress,
  getAccessorySrc,
  getAvatarSrc,
} from "@/types";

type Tab = "avatares" | "objetos";

// Tienda: avatares y objetos que se compran con las monedas ganadas
// jugando. Lo comprado queda para siempre. Se puede probar antes de
// comprar (vista previa sobre el propio avatar).
export default function ShopModal({
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
  const [tab, setTab] = useState<Tab>("avatares");
  const [preview, setPreview] = useState<{ avatar?: string; accessory?: AccessoryDef } | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const owned = useMemo(() => new Set(progress.shopCollection ?? []), [progress.shopCollection]);
  const coins = progress.coins;
  // Tiempo limitado: cada festividad con cosas en la tienda, con su ventana
  // (activa o próxima). Se muestran las activas y las que llegan dentro de
  // AVISO_PREVIO_DIAS días; lo ya comprado se sigue viendo siempre.
  const ventanas = useMemo(() => {
    const ids = new Set<string>();
    for (const a of SHOP_AVATARS) if (a.season) ids.add(a.season);
    for (const a of ACCESSORY_CATALOG_TIENDA) if (a.season) ids.add(a.season);
    const out: Record<string, Ventana> = {};
    for (const id of ids) {
      const v = ventanaDe(id);
      if (v && (v.activa || v.dias <= AVISO_PREVIO_DIAS)) out[id] = v;
    }
    return out;
  }, []);
  const ordenVentanas = Object.values(ventanas).sort((a, b) => Number(b.activa) - Number(a.activa) || a.dias - b.dias);
  const aLaVenta = (season?: string) => !season || !!ventanas[season]?.activa;

  const previewAvatar = preview?.avatar ?? progress.avatar;
  const previewAccessories: AvatarAccessories = { ...(progress.avatarAccessories ?? {}) };
  if (preview?.avatar) {
    // Con otro personaje se ven solo los accesorios que le quedan bien a
    // cualquiera (los de la tienda y los de temporada).
    for (const k of Object.keys(previewAccessories) as (keyof AvatarAccessories)[]) {
      const id = previewAccessories[k];
      if (id && !ACCESSORY_CATALOG_TIENDA.some((a) => a.id === id)) delete previewAccessories[k];
    }
  }
  if (preview?.accessory) previewAccessories[preview.accessory.slot] = preview.accessory.id;

  async function buy(itemId: string, label: string) {
    setBusy(true);
    setStatus(null);
    try {
      const r = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, itemId }),
      });
      const d = await r.json();
      if (!r.ok) {
        setStatus(`⚠️ ${d.error}`);
        return;
      }
      onProgress(d.progress);
      setStatus(`🎉 ¡Compraste ${label}! Ya es tuyo para siempre.`);
    } finally {
      setBusy(false);
    }
  }

  async function use(update: { avatar?: string; accessory?: AccessoryDef }) {
    setBusy(true);
    setStatus(null);
    try {
      const r = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          ...(update.avatar ? { avatar: update.avatar } : {}),
          ...(update.accessory ? { accessories: { [update.accessory.slot]: update.accessory.id } } : {}),
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setStatus(`⚠️ ${d.error ?? "No se pudo cambiar."}`);
        return;
      }
      onProgress({ ...progress, ...d.progress, coins: progress.coins });
      setStatus("✅ ¡Listo! Ya lo tenés puesto.");
      setPreview(null);
    } finally {
      setBusy(false);
    }
  }

  function PriceButton({ price, id, label, onUse, season }: { price: number; id: string; label: string; onUse: () => void; season?: string }) {
    if (!owned.has(id) && !aLaVenta(season)) {
      return (
        <p className="w-full rounded-lg bg-slate-700 text-slate-300 text-[11px] font-bold py-1.5 text-center">🔒 Próximamente · 🪙 {price}</p>
      );
    }
    if (owned.has(id)) {
      return (
        <button disabled={busy} onClick={onUse} className="w-full rounded-lg bg-emerald-500 text-white text-xs font-black py-1.5">
          ✓ Usar
        </button>
      );
    }
    const missing = price - coins;
    return (
      <button
        disabled={busy || missing > 0}
        onClick={() => {
          if (window.confirm(`¿Comprar ${label} por ${price} monedas?`)) void buy(id, label);
        }}
        className="w-full rounded-lg bg-yellow-400 text-slate-900 text-xs font-black py-1.5 disabled:opacity-50"
        title={missing > 0 ? `Te faltan ${missing} monedas` : undefined}
      >
        🪙 {price}
      </button>
    );
  }

  const avatarCard = (a: ShopAvatar) => {
    const label = AVATAR_INFO[a.id]?.label ?? a.id;
    const using = progress.avatar === a.id;
    return (
      <li key={a.id} className={`rounded-2xl bg-slate-800 p-2 flex flex-col gap-1.5 ${preview?.avatar === a.id ? "ring-2 ring-amber-400" : ""}`}>
        <button onClick={() => setPreview({ avatar: a.id })} className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100" title="Probar">
          <Image src={getAvatarSrc(a.id)} alt={label} fill sizes="120px" className="object-cover" />
          {owned.has(a.id) && <span className="absolute top-1 right-1 rounded-full bg-emerald-500 text-white text-[10px] font-black px-1.5">TUYO</span>}
        </button>
        <p className="text-[10px] text-amber-300 font-bold leading-none">{SHOP_CATEGORY_LABEL[a.category]}</p>
        <p className="text-white text-xs font-bold leading-tight">{label}</p>
        <p className="text-slate-400 text-[10px] leading-tight min-h-[1.5rem]">{a.blurb}</p>
        {using ? (
          <p className="text-center text-emerald-300 text-xs font-bold py-1.5">Lo estás usando</p>
        ) : (
          <PriceButton price={a.price} id={a.id} label={label} season={a.season} onUse={() => void use({ avatar: a.id })} />
        )}
      </li>
    );
  };

  const accessoryCard = (acc: AccessoryDef) => {
    const using = progress.avatarAccessories?.[acc.slot] === acc.id;
    const soon = !owned.has(acc.id) && !aLaVenta(acc.season);
    return (
      <li key={acc.id} className={`rounded-2xl bg-slate-800 p-2 flex flex-col gap-1.5 ${preview?.accessory?.id === acc.id ? "ring-2 ring-amber-400" : ""}`}>
        <button onClick={() => setPreview({ accessory: acc })} className="relative aspect-square rounded-xl bg-slate-700/60" title="Probar">
          <Image src={getAccessorySrc(acc.id)} alt={acc.label} fill sizes="100px" className={`object-contain p-2 ${soon ? "opacity-60" : ""}`} />
          {owned.has(acc.id) && <span className="absolute top-1 right-1 rounded-full bg-emerald-500 text-white text-[10px] font-black px-1.5">TUYO</span>}
        </button>
        <p className="text-white text-xs font-bold leading-tight min-h-[2rem]">{acc.label}</p>
        {using ? (
          <p className="text-center text-emerald-300 text-xs font-bold py-1.5">Lo tenés puesto</p>
        ) : (
          <PriceButton price={acc.price ?? 0} id={acc.id} label={acc.label} season={acc.season} onUse={() => void use({ accessory: acc })} />
        )}
      </li>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-3 py-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-4 flex flex-col gap-3 my-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-black text-lg">🛍️ Tienda</h2>
          <span className="rounded-full bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 font-black text-sm px-3 py-1">
            🪙 {coins}
          </span>
          <button onClick={onClose} className="text-slate-400 text-xl" aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-800/70 p-2">
          <AvatarDisplay
            character={previewAvatar}
            accessories={previewAccessories}
            background={progress.avatarBackground}
            className="w-24 h-24 rounded-2xl shrink-0"
            imageSizes="96px"
          />
          <p className="text-slate-300 text-xs">
            {preview
              ? "👀 Así te quedaría. Si te gusta, compralo con tus monedas."
              : "Tocá un avatar u objeto para probártelo antes de comprar. Lo que comprás es tuyo para siempre."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(["avatares", "objetos"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setPreview(null);
                setStatus(null);
              }}
              className={`rounded-xl py-2 font-bold text-sm ${tab === t ? "bg-amber-400 text-slate-900" : "bg-slate-800 text-slate-300"}`}
            >
              {t === "avatares" ? "🧑 Avatares" : "🎩 Objetos"}
            </button>
          ))}
        </div>

        {status && <p className="text-center text-sm text-white">{status}</p>}

        <div className="max-h-[52vh] overflow-y-auto pr-1">
          {tab === "avatares" && (
            <>
              {ordenVentanas.map((v) => {
                const items = SHOP_AVATARS.filter((a) => a.season === v.eventId);
                if (!items.length) return null;
                return (
                  <section key={v.eventId} className="mb-3">
                    <LimitedHeader v={v} />
                    <ul className="grid grid-cols-3 gap-2">{items.map(avatarCard)}</ul>
                  </section>
                );
              })}
              <ul className="grid grid-cols-3 gap-2">
                {SHOP_AVATARS.filter((a) => !a.season || (!ventanas[a.season] && owned.has(a.id))).map(avatarCard)}
              </ul>
            </>
          )}
          {tab === "objetos" && (
            <>
              {ordenVentanas.map((v) => {
                const items = ACCESSORY_CATALOG_TIENDA.filter((a) => a.season === v.eventId);
                if (!items.length) return null;
                return (
                  <section key={v.eventId} className="mb-3">
                    <LimitedHeader v={v} />
                    <ul className="grid grid-cols-3 gap-2">{items.map(accessoryCard)}</ul>
                  </section>
                );
              })}
              <ul className="grid grid-cols-3 gap-2">
                {ACCESSORY_CATALOG_TIENDA.filter((a) => !a.season || (!ventanas[a.season] && owned.has(a.id))).map(accessoryCard)}
              </ul>
            </>
          )}
        </div>
        <p className="text-slate-500 text-[11px] text-center">
          Las monedas se ganan aprendiendo: respondiendo bien, completando mundos y en la aventura del finde.
        </p>
      </div>
    </div>,
    document.body
  );
}

// Cartel de una festividad con cosas por tiempo limitado: cuánto falta para
// que se vayan (o para que lleguen).
function LimitedHeader({ v }: { v: Ventana }) {
  const ev = getSeasonalEventById(v.eventId);
  const urgente = v.activa && v.dias <= 3;
  return (
    <div
      className={`mb-2 flex flex-col gap-0.5 rounded-xl border px-3 py-1.5 ${
        v.activa ? (urgente ? "border-red-400 bg-red-500/15" : "border-orange-400 bg-orange-500/15") : "border-sky-400 bg-sky-500/10"
      }`}
    >
      <p className="text-xs font-black text-white">
        {ev?.emoji} {ev?.label} · {v.activa ? "por tiempo limitado" : "próximamente"}
      </p>
      <p className={`text-[11px] font-black ${v.activa ? (urgente ? "text-red-300" : "text-orange-200") : "text-sky-200"}`}>
        ⏳ {textoContador(v)}
      </p>
    </div>
  );
}
