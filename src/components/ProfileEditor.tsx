"use client";

import { useState } from "react";
import Image from "next/image";
import { textoHasta } from "@/lib/torneo/prestamo";
import {
  ACCESSORY_CATALOG_PREMIO,
  ACCESSORY_CATALOG_TEMPORADA,
  ACCESSORY_CATALOG_TIENDA,
  getShopAvatar,
  LOGRO_AVATAR_IDS,
  AUTO_BACKGROUND,
  AVATAR_OPTIONS,
  AVATAR_INFO,
  AccessorySlot,
  AvatarAccessories,
  AvatarTweaks,
  BACKGROUND_OPTIONS,
  MAX_NICKNAME_LENGTH,
  getAccessoryCatalogForAvatar,
  getAccessorySrc,
  getAvatarSrc,
  getBackgroundById,
  getEquippableAccessoryIds,
  getValidAccessoryIdsForAvatar,
  isBackgroundSelectable,
  isStandardAvatar,
} from "@/types";
import InsigniaTorneo from "@/components/InsigniaTorneo";
import AcomodarObjetos from "@/components/AcomodarObjetos";
import { AVATARES_LOGRO } from "@/lib/coleccion/logros";
import {
  getActiveEvents,
  getAutoBackgroundId,
  getSeasonalEventById,
} from "@/lib/seasons";

// Todos los casilleros que se mandan al guardar (los que no estén
// equipados van como null, para sacarlos).
const ALL_SLOTS: AccessorySlot[] = [
  "headwear",
  "eyewear",
  "face",
  "torso",
  "backpack",
  "pendant",
  "pet",
  "prop",
];

interface Props {
  code: string;
  currentAvatar?: string;
  currentAccessories?: AvatarAccessories;
  currentTweaks?: AvatarTweaks;
  currentNickname?: string;
  currentBackground?: string;
  seasonalCollection?: string[];
  shopCollection?: string[];
  achievementCollection?: string[];
  isBirthday?: boolean;
  realName: string;
  completedWorldsCount: number;
  // Insignia del torneo (×2, ×3… A1…), premios del torneo prestados y
  // accesorio Six-Seven prestado.
  torneoVueltas?: number;
  insigniaOculta?: boolean;
  torneoPrestados?: { id: string; hastaVueltas: number; vence: string }[];
  prestamo?: { id: string; hasta: string };
  onClose: () => void;
  onSaved: (update: {
    avatar?: string;
    accessories?: AvatarAccessories;
    nickname?: string;
    background?: string;
    tweaks?: AvatarTweaks;
    insigniaOculta?: boolean;
  }) => void;
}

// Casilleros a mostrar según el guardarropa del personaje elegido: los de
// siempre (4 animales + 10 de estudiante) usan el set simple; los dos
// avatares "estándar" tienen mochila y un casillero extra de accesorio de
// bolsillo (binoculares / collar), además de más variedad por casillero.
const SLOTS_LEGACY: { slot: AccessorySlot; label: string }[] = [
  { slot: "headwear", label: "Cabeza" },
  { slot: "eyewear", label: "Ojos" },
  { slot: "face", label: "Cara y cuello" },
  { slot: "pendant", label: "Colgante" },
];

const SLOTS_ESTANDAR: { slot: AccessorySlot; label: string }[] = [
  { slot: "headwear", label: "Cabeza" },
  { slot: "torso", label: "Campera" },
  { slot: "backpack", label: "Mochila" },
  { slot: "face", label: "Pañuelo" },
  { slot: "eyewear", label: "Lentes" },
  { slot: "pendant", label: "Accesorio" },
];

export default function ProfileEditor({
  code,
  currentAvatar,
  currentAccessories,
  currentTweaks,
  currentNickname,
  currentBackground,
  seasonalCollection = [],
  shopCollection = [],
  achievementCollection = [],
  isBirthday = false,
  realName,
  completedWorldsCount,
  torneoVueltas = 0,
  insigniaOculta = false,
  torneoPrestados = [],
  prestamo,
  onClose,
  onSaved,
}: Props) {
  const [insigniaVisible, setInsigniaVisible] = useState(!insigniaOculta);
  const prestadoTorneo = new Set(torneoPrestados.map((x) => x.id));
  // El préstamo vigente se puede poner como si fuera comprado.
  const tiendaYPrestamo = prestamo && !shopCollection.includes(prestamo.id) ? [...shopCollection, prestamo.id] : shopCollection;
  const [avatar, setAvatar] = useState<string>(
    currentAvatar || AVATAR_OPTIONS[0]
  );
  const [accessories, setAccessories] = useState<AvatarAccessories>(
    currentAccessories ?? {}
  );
  const [nickname, setNickname] = useState<string>(currentNickname || "");
  const [background, setBackground] = useState<string>(
    currentBackground || AUTO_BACKGROUND
  );
  const [tweaks, setTweaks] = useState<AvatarTweaks>(currentTweaks ?? {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const catalog = getAccessoryCatalogForAvatar(avatar);
  const slots = isStandardAvatar(avatar) ? SLOTS_ESTANDAR : SLOTS_LEGACY;
  const unlockedIds = getEquippableAccessoryIds(
    completedWorldsCount,
    avatar,
    seasonalCollection,
    tiendaYPrestamo
  );
  const boughtAccessories = ACCESSORY_CATALOG_TIENDA.filter((a) => tiendaYPrestamo.includes(a.id));
  // Personajes disponibles: los de siempre + los comprados en la tienda.
  const avatarChoices = AVATAR_OPTIONS.filter((a) =>
    LOGRO_AVATAR_IDS.has(a) ? achievementCollection.includes(a) : !getShopAvatar(a) || shopCollection.includes(a)
  );
  // Avatares de logro con imagen (ganados o por ganar), para «Mi colección».
  const logros = AVATARES_LOGRO.filter((l) => AVATAR_OPTIONS.includes(l.id));
  const owned = new Set(seasonalCollection);
  const activeEventIds = new Set(getActiveEvents().map((e) => e.id));
  const autoBackground = getBackgroundById(getAutoBackgroundId());
  const nextLocked = catalog.find((a) => !unlockedIds.has(a.id));
  const worldsToNextUnlock = nextLocked
    ? catalog.indexOf(nextLocked) + 1 - completedWorldsCount
    : 0;

  // Al cambiar de personaje, el guardarropa puede cambiar (de siempre <->
  // estándar): se sacan del estado los accesorios que ya no correspondan a
  // ese personaje, para no guardar (ni mostrar en la vista previa) algo que
  // el servidor igual va a rechazar.
  function handleSelectAvatar(nextAvatar: string) {
    setAvatar(nextAvatar);
    const validIds = getValidAccessoryIdsForAvatar(nextAvatar);
    setAccessories((prev) => {
      const cleaned: AvatarAccessories = {};
      for (const key of Object.keys(prev) as AccessorySlot[]) {
        const value = prev[key];
        if (value && validIds.has(value)) {
          cleaned[key] = value;
        }
      }
      return cleaned;
    });
  }

  function toggleAccessory(slot: AccessorySlot, id: string) {
    setAccessories((prev) => {
      const next = { ...prev };
      if (next[slot] === id) {
        delete next[slot];
      } else {
        next[slot] = id;
      }
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          avatar,
          nickname: nickname.trim(),
          background,
          accessories: Object.fromEntries(
            ALL_SLOTS.map((slot) => [slot, accessories[slot] ?? null])
          ),
          // Solo se guardan ajustes de lo que está puesto.
          tweaks: Object.fromEntries(ALL_SLOTS.map((slot) => [slot, accessories[slot] ? tweaks[slot] ?? null : null])),
          ...(torneoVueltas > 0 ? { insigniaVisible } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No pudimos guardar los cambios.");
        setSaving(false);
        return;
      }
      onSaved({
        avatar: data.progress.avatar,
        accessories: data.progress.avatarAccessories,
        nickname: data.progress.nickname,
        background: data.progress.avatarBackground,
        tweaks: data.progress.avatarTweaks,
        insigniaOculta: data.progress.insigniaTorneoOculta,
      });
    } catch {
      setError("Ocurrió un error. Probá de nuevo.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-sm rounded-3xl fondo-ilustrado fondo-perfil border-2 border-white/25 p-5 shadow-2xl flex flex-col gap-4 my-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-black text-lg">Mi perfil</h2>
          <button
            onClick={onClose}
            className="text-slate-400 text-xl leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <AcomodarObjetos
          avatar={avatar}
          accessories={accessories}
          background={background}
          birthday={isBirthday}
          tweaks={tweaks}
          onChange={setTweaks}
        />

        <div>
          <p className="text-slate-400 text-xs mb-2">Elegí tu personaje</p>
          <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
            {avatarChoices.map((a) => (
              <button
                key={a}
                onClick={() => handleSelectAvatar(a)}
                title={AVATAR_INFO[a]?.label}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition bg-gradient-to-b from-sky-300 to-sky-100 ${
                  avatar === a
                    ? "border-amber-400 ring-2 ring-amber-400/50"
                    : "border-slate-700"
                }`}
              >
                <Image
                  src={getAvatarSrc(a)}
                  alt={AVATAR_INFO[a]?.label ?? a}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {logros.length > 0 && (
          <div>
            <p className="text-slate-400 text-xs mb-1">🏆 Mi colección de logros</p>
            <p className="text-slate-500 text-[11px] mb-2">
              No se compran: se ganan sacando 90 % o más en los cuentos, leyendas y fábulas.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {logros.map((l) => {
                const ganado = achievementCollection.includes(l.id);
                return (
                  <button
                    key={l.id}
                    disabled={!ganado}
                    onClick={() => handleSelectAvatar(l.id)}
                    title={ganado ? `${l.label} (${l.texto})` : `Superá «${l.texto}» con 90 % para ganarlo`}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-gradient-to-b from-amber-200 to-amber-50 ${
                      avatar === l.id ? "border-amber-400 ring-2 ring-amber-400/50" : "border-slate-700"
                    }`}
                  >
                    <Image
                      src={getAvatarSrc(l.id)}
                      alt={l.label}
                      fill
                      sizes="80px"
                      className={`object-cover ${ganado ? "" : "brightness-0 opacity-30"}`}
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] leading-tight text-white px-0.5 py-0.5">
                      {ganado ? l.label : `🔒 ${l.texto}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <p className="text-slate-400 text-xs -mb-1">
            Accesorios que fuiste ganando
          </p>
          {slots.map(({ slot, label }) => {
            const options = catalog.filter((a) => a.slot === slot);
            return (
              <div key={slot}>
                <p className="text-slate-500 text-[11px] mb-1.5">{label}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setAccessories((prev) => {
                        const next = { ...prev };
                        delete next[slot];
                        return next;
                      })
                    }
                    className={`rounded-xl border-2 px-2.5 py-2 text-[11px] font-semibold shrink-0 ${
                      !accessories[slot]
                        ? "border-amber-400 bg-amber-400/10 text-amber-200"
                        : "border-slate-700 text-slate-400"
                    }`}
                  >
                    Ninguno
                  </button>
                  {options.map((acc) => {
                    const unlocked = unlockedIds.has(acc.id);
                    const selected = accessories[slot] === acc.id;
                    return (
                      <button
                        key={acc.id}
                        disabled={!unlocked}
                        onClick={() => toggleAccessory(slot, acc.id)}
                        title={
                          unlocked
                            ? acc.label
                            : `${acc.label}: se desbloquea completando más mundos`
                        }
                        className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 bg-slate-800 ${
                          selected
                            ? "border-amber-400 ring-2 ring-amber-400/50"
                            : "border-slate-700"
                        } ${!unlocked ? "opacity-40 grayscale" : ""}`}
                      >
                        <Image
                          src={getAccessorySrc(acc.id)}
                          alt={acc.label}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                        {!unlocked && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm">
                            🔒
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {nextLocked && (
            <p className="text-amber-300/80 text-[11px]">
              Completá {worldsToNextUnlock}{" "}
              {worldsToNextUnlock === 1 ? "mundo más" : "mundos más"} para
              desbloquear &quot;{nextLocked.label}&quot; {nextLocked.emoji}.
            </p>
          )}
        </div>

        {boughtAccessories.length > 0 && (
          <div>
            <p className="text-slate-400 text-xs mb-2">🛍️ Comprados en la tienda{prestamo ? " (y tu préstamo Six-Seven)" : ""}</p>
            <div className="grid grid-cols-4 gap-2">
              {boughtAccessories.map((acc) => {
                const selected = accessories[acc.slot] === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => toggleAccessory(acc.slot, acc.id)}
                    title={acc.label}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-slate-800 ${
                      selected ? "border-amber-400 ring-2 ring-amber-400/50" : "border-slate-700"
                    }`}
                  >
                    <Image src={getAccessorySrc(acc.id)} alt={acc.label} fill sizes="64px" className="object-contain p-1.5" />
                    {prestamo?.id === acc.id && !shopCollection.includes(acc.id) && (
                      <span className="absolute bottom-0 inset-x-0 bg-violet-600/90 text-white text-[8px] font-black text-center leading-tight py-0.5">
                        PRESTADO
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {prestamo && !shopCollection.includes(prestamo.id) && (
              <p className="text-violet-200 text-[11px] mt-1.5">
                6️⃣7️⃣ Prestado por estar al día con tus mundos: lo podés usar hasta el{" "}
                {textoHasta(prestamo.hasta)}.
              </p>
            )}
          </div>
        )}

        {torneoVueltas > 0 && (
          <label className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/20 px-3 py-2 text-xs text-white cursor-pointer">
            <InsigniaTorneo vueltas={torneoVueltas} className="min-w-8 h-8 px-1 text-xs shrink-0" />
            <span className="flex-1">
              <b>Insignia del torneo</b>
              <span className="block text-slate-300 text-[11px]">
                Repasaste las 9 tablas {torneoVueltas} {torneoVueltas === 1 ? "vez" : "veces"}. Sube con cada vuelta (×2, ×3… y a las 10, A1).
              </span>
            </span>
            <input
              type="checkbox"
              checked={insigniaVisible}
              onChange={(e) => setInsigniaVisible(e.target.checked)}
              className="w-5 h-5 accent-amber-400"
              aria-label="Mostrar la insignia del torneo en mi perfil"
            />
            <span className="text-[11px] w-12">{insigniaVisible ? "Visible" : "Oculta"}</span>
          </label>
        )}

        <div>
          <p className="text-slate-400 text-xs mb-1">
            🎁 Colección de temporada
          </p>
          <p className="text-slate-500 text-[11px] mb-2">
            Se ganan jugando durante cada estación o festividad, y quedan
            para siempre.
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[...ACCESSORY_CATALOG_TEMPORADA, ...ACCESSORY_CATALOG_PREMIO.filter((a) => owned.has(a.id))].map((acc) => {
              const earned = owned.has(acc.id);
              const selected = accessories[acc.slot] === acc.id;
              const event = acc.eventId ? getSeasonalEventById(acc.eventId) : undefined;
              const activeNow = !!acc.eventId && activeEventIds.has(acc.eventId);
              return (
                <button
                  key={acc.id}
                  disabled={!earned}
                  onClick={() => toggleAccessory(acc.slot, acc.id)}
                  title={
                    earned
                      ? acc.label
                      : activeNow
                        ? `${acc.label}: ¡jugá una actividad para ganarlo!`
                        : `${acc.label}: se gana en ${event?.label ?? "su temporada"}`
                  }
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 bg-slate-800 ${
                    selected
                      ? "border-amber-400 ring-2 ring-amber-400/50"
                      : activeNow && !earned
                        ? "border-emerald-400/70"
                        : "border-slate-700"
                  } ${!earned ? "opacity-50" : ""}`}
                >
                  <Image
                    src={getAccessorySrc(acc.id)}
                    alt={acc.label}
                    fill
                    sizes="64px"
                    className={`object-contain p-1.5 ${!earned ? "grayscale" : ""}`}
                  />
                  {!earned && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] leading-tight text-white px-0.5 py-0.5">
                      {event?.emoji} {event?.label}
                    </span>
                  )}
                  {earned && prestadoTorneo.has(acc.id) && (
                    <span className="absolute bottom-0 inset-x-0 bg-violet-600/90 text-white text-[8px] font-black text-center leading-tight py-0.5">
                      PRESTADO
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {torneoPrestados.length > 0 && (
            <p className="text-violet-200 text-[11px] mt-1.5">
              ⚡ Los premios del torneo marcados «prestado» son tuyos para siempre cuando completes{" "}
              {Math.min(...torneoPrestados.map((x) => x.hastaVueltas))} vueltas de las 9 tablas (llevás {torneoVueltas}). Si el 31/12 no llegaste, se devuelven.
            </p>
          )}
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-2">🖼️ Fondo de tu avatar</p>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setBackground(AUTO_BACKGROUND)}
              title="Cambia solo según la estación o la festividad"
              className={`relative aspect-square rounded-xl overflow-hidden border-2 ${
                background === AUTO_BACKGROUND
                  ? "border-amber-400 ring-2 ring-amber-400/50"
                  : "border-slate-700"
              }`}
              style={{ background: autoBackground?.css }}
            >
              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] font-bold text-white py-0.5">
                ✨ Automático
              </span>
            </button>
            {BACKGROUND_OPTIONS.map((bg) => {
              const selectable = isBackgroundSelectable(bg.id, seasonalCollection);
              const event = bg.eventId ? getSeasonalEventById(bg.eventId) : undefined;
              return (
                <button
                  key={bg.id}
                  disabled={!selectable}
                  onClick={() => setBackground(bg.id)}
                  title={
                    selectable
                      ? bg.label
                      : `${bg.label}: se gana en ${event?.label ?? "su temporada"}`
                  }
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 ${
                    background === bg.id
                      ? "border-amber-400 ring-2 ring-amber-400/50"
                      : "border-slate-700"
                  } ${!selectable ? "opacity-40 grayscale" : ""}`}
                  style={{ background: bg.css }}
                >
                  <span className="absolute bottom-0 inset-x-0 bg-black/55 text-[9px] leading-tight text-white py-0.5">
                    {!selectable && "🔒 "}
                    {bg.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-2">
            Nombre de usuario (solo para el juego)
          </p>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={realName}
            maxLength={MAX_NICKNAME_LENGTH}
            className="w-full rounded-xl bg-slate-800 border border-slate-600 px-3 py-2 text-white outline-none focus:border-amber-400"
          />
          <p className="text-slate-500 text-[11px] mt-1">
            Tu docente siempre va a ver tu nombre real ({realName}) en el
            Panel Docente. Este es solo el nombre que ves vos al jugar.
          </p>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-800 text-slate-300 font-semibold py-2.5"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-bold py-2.5 disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
