"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AVATAR_OPTIONS,
  AVATAR_INFO,
  AccessorySlot,
  AvatarAccessories,
  MAX_NICKNAME_LENGTH,
  getAccessoryCatalogForAvatar,
  getAccessorySrc,
  getAvatarSrc,
  getUnlockedAccessoryIds,
  isStandardAvatar,
} from "@/types";
import AvatarDisplay from "@/components/AvatarDisplay";

interface Props {
  code: string;
  currentAvatar?: string;
  currentAccessories?: AvatarAccessories;
  currentNickname?: string;
  realName: string;
  completedWorldsCount: number;
  onClose: () => void;
  onSaved: (update: {
    avatar?: string;
    accessories?: AvatarAccessories;
    nickname?: string;
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
  { slot: "torso", label: "Ropa" },
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
  currentNickname,
  realName,
  completedWorldsCount,
  onClose,
  onSaved,
}: Props) {
  const [avatar, setAvatar] = useState<string>(
    currentAvatar || AVATAR_OPTIONS[0]
  );
  const [accessories, setAccessories] = useState<AvatarAccessories>(
    currentAccessories ?? {}
  );
  const [nickname, setNickname] = useState<string>(currentNickname || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const catalog = getAccessoryCatalogForAvatar(avatar);
  const slots = isStandardAvatar(avatar) ? SLOTS_ESTANDAR : SLOTS_LEGACY;
  const unlockedIds = new Set(getUnlockedAccessoryIds(completedWorldsCount, avatar));
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
    const validIds = new Set(getAccessoryCatalogForAvatar(nextAvatar).map((a) => a.id));
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
          accessories: {
            headwear: accessories.headwear ?? null,
            eyewear: accessories.eyewear ?? null,
            face: accessories.face ?? null,
            torso: accessories.torso ?? null,
          },
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
      });
    } catch {
      setError("Ocurrió un error. Probá de nuevo.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-5 flex flex-col gap-4 my-auto">
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

        <div className="flex justify-center">
          <AvatarDisplay
            character={avatar}
            accessories={accessories}
            className="w-32 h-32 rounded-2xl border-2 border-amber-400/70 bg-slate-800"
            alt="Vista previa de tu avatar"
            imageSizes="128px"
          />
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-2">Elegí tu personaje</p>
          <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
            {AVATAR_OPTIONS.map((a) => (
              <button
                key={a}
                onClick={() => handleSelectAvatar(a)}
                title={AVATAR_INFO[a]?.label}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
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
