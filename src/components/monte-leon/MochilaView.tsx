"use client";

import Image from "next/image";
import {
  MOCHILA_MONTE_LEON,
  MASCOTA_MONTE_LEON,
  MEDALLA_MONTE_LEON,
  AVATARES_MONTE_LEON,
  MOCHILA_VACIA,
} from "@/lib/monteLeon/arte";

interface MochilaItemStatus {
  id: string;
  label: string;
  slot: string;
  ganado: boolean;
  enColeccion: boolean;
  regalado: boolean;
}

interface Props {
  items: MochilaItemStatus[];
  mascotaGanada: boolean;
  medallaGanada: boolean;
  achievementCollection?: string[];
  onOpenProfile?: () => void;
}

export default function MochilaView({
  items,
  mascotaGanada,
  medallaGanada,
  achievementCollection = [],
  onOpenProfile,
}: Props) {
  const ganadosCount = items.filter((it) => it.ganado).length;
  const completa = ganadosCount === MOCHILA_MONTE_LEON.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado con mochila e indicador */}
      <div className="relative parchment-panel rounded-2xl p-5 border-2 border-amber-800/30 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative w-36 h-36 shrink-0 rounded-2xl overflow-hidden bg-amber-950/10 border-2 border-amber-900/20 shadow-inner flex items-center justify-center p-2">
          <Image
            src={MOCHILA_VACIA}
            alt="Mochila para Monte León"
            fill
            sizes="144px"
            className="object-contain p-1"
          />
          {completa && (
            <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
              ¡COMPLETA!
            </span>
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900/60">
            Equipamiento de viaje
          </span>
          <h3 className="text-xl font-black text-amber-950 mt-0.5">
            Mi mochila para Monte León
          </h3>
          <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
            Superá cada etapa con <strong>80 % o más</strong> para guardar un objeto en tu mochila.
            Con los 6 objetos completos ganás el <strong>Pingüino de peluche</strong>.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-3 rounded-full bg-amber-950/15 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(ganadosCount / MOCHILA_MONTE_LEON.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-black text-amber-950 shrink-0">
              {ganadosCount} de {MOCHILA_MONTE_LEON.length} objetos
            </span>
          </div>
        </div>
      </div>

      {/* Los 6 casilleros de la mochila */}
      <div>
        <h4 className="text-sm font-black text-amber-950 mb-2 flex items-center gap-2">
          <span>🎒</span> Objetos del viaje (6 lugares)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((it, idx) => {
            return (
              <div
                key={it.id}
                className={`rounded-xl p-3 border-2 flex flex-col items-center text-center relative transition ${
                  it.ganado
                    ? "bg-amber-50/90 border-amber-600/40 shadow-sm"
                    : "bg-slate-900/10 border-slate-700/20 opacity-60"
                }`}
              >
                <div className="relative w-16 h-16 mb-2">
                  <Image
                    src={`/theme/accessories-temporada/${it.id}.png`}
                    alt={it.label}
                    fill
                    sizes="64px"
                    className={`object-contain ${it.ganado ? "" : "grayscale opacity-30"}`}
                  />
                  {!it.ganado && (
                    <span className="absolute inset-0 flex items-center justify-center text-lg">
                      🔒
                    </span>
                  )}
                </div>
                <span className="text-xs font-black text-amber-950 leading-tight">
                  {idx + 1}. {it.label}
                </span>
                <span className="text-[10px] text-amber-900/70 mt-1">
                  {it.regalado
                    ? "🎁 Regalado a un compañero"
                    : it.ganado
                      ? "✅ En tu mochila"
                      : "Superá una etapa con 80%+"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mascota y Medalla */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Mascota peluche */}
        <div
          className={`rounded-2xl p-4 border-2 flex items-center gap-3.5 transition ${
            mascotaGanada
              ? "bg-gradient-to-r from-emerald-100 to-amber-50 border-emerald-500 shadow-sm"
              : "bg-slate-900/10 border-slate-700/20 opacity-75"
          }`}
        >
          <div className="relative w-16 h-16 shrink-0 rounded-xl bg-white/70 p-1 border border-amber-800/20 shadow-xs">
            <Image
              src={`/theme/accessories-temporada/${MASCOTA_MONTE_LEON.id}.png`}
              alt={MASCOTA_MONTE_LEON.label}
              fill
              sizes="64px"
              className={`object-contain ${mascotaGanada ? "" : "grayscale opacity-40"}`}
            />
            {!mascotaGanada && (
              <span className="absolute inset-0 flex items-center justify-center text-base">
                🔒
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
              Mascota especial
            </span>
            <h5 className="text-sm font-black text-amber-950 truncate">
              {MASCOTA_MONTE_LEON.label}
            </h5>
            <p className="text-[11px] text-amber-900/80 leading-tight mt-0.5">
              {mascotaGanada
                ? "¡Ganado! Se equipa como mascota en tu perfil."
                : "Se gana al completar los 6 objetos de la mochila."}
            </p>
          </div>
        </div>

        {/* Medalla del viaje */}
        <div
          className={`rounded-2xl p-4 border-2 flex items-center gap-3.5 transition ${
            medallaGanada
              ? "bg-gradient-to-r from-amber-100 to-yellow-50 border-amber-500 shadow-sm"
              : "bg-slate-900/10 border-slate-700/20 opacity-75"
          }`}
        >
          <div className="relative w-16 h-16 shrink-0 rounded-xl bg-white/70 p-1 border border-amber-800/20 shadow-xs">
            <Image
              src={`/theme/accessories-temporada/${MEDALLA_MONTE_LEON.id}.png`}
              alt={MEDALLA_MONTE_LEON.label}
              fill
              sizes="64px"
              className={`object-contain ${medallaGanada ? "" : "grayscale opacity-40"}`}
            />
            {!medallaGanada && (
              <span className="absolute inset-0 flex items-center justify-center text-base">
                ⏳
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
              Colgante conmemorativo
            </span>
            <h5 className="text-sm font-black text-amber-950 truncate">
              {MEDALLA_MONTE_LEON.label}
            </h5>
            <p className="text-[11px] text-amber-900/80 leading-tight mt-0.5">
              {medallaGanada
                ? "¡Entregada! Queda en tu colección para siempre."
                : "Se entrega el 27/10 a la noche a todos los que participaron."}
            </p>
          </div>
        </div>
      </div>

      {/* Avatares superespeciales */}
      <div>
        <h4 className="text-sm font-black text-amber-950 mb-2 flex items-center gap-2">
          <span>🌟</span> Avatares superespeciales de Monte León
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {AVATARES_MONTE_LEON.map((av) => {
            const desbloqueado = achievementCollection.includes(av.id);
            const req =
              av.id === "explorador-monte-leon"
                ? "Superar etapas 1 y 2 con 80%+"
                : av.id === "guardaparque-monte-leon"
                  ? "Superar etapa 4 con 80%+"
                  : "Superar las 5 etapas con 90%+";

            return (
              <div
                key={av.id}
                className={`rounded-xl p-3 border-2 flex items-center gap-3 transition ${
                  desbloqueado
                    ? "bg-amber-50/90 border-amber-500 shadow-sm"
                    : "bg-slate-900/10 border-slate-700/20 opacity-60"
                }`}
              >
                <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-800 border border-amber-700/30">
                  <Image
                    src={`/theme/avatars/${av.id}.png`}
                    alt={av.label}
                    fill
                    sizes="48px"
                    className={`object-cover ${desbloqueado ? "" : "grayscale opacity-40"}`}
                  />
                  {!desbloqueado && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs">
                      🔒
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="text-xs font-black text-amber-950 truncate">{av.label}</h6>
                  <p className="text-[10px] text-amber-900/70 leading-tight mt-0.5">
                    {desbloqueado ? "✅ Desbloqueado en Mi perfil" : req}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {onOpenProfile && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onOpenProfile}
            className="rounded-xl bg-amber-500 text-slate-900 font-extrabold text-xs px-5 py-2.5 shadow hover:bg-amber-400 active:scale-95 transition"
          >
            👤 Abrir Mi perfil para equipar objetos y avatares
          </button>
        </div>
      )}
    </div>
  );
}
