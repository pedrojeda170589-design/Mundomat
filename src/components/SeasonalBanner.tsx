"use client";

import Image from "next/image";
import { getAccessoryById, getAccessorySrc } from "@/types";
import { BIRTHDAY_EVENT, getActiveEvents, getEventRewardIds } from "@/lib/seasons";

interface Props {
  seasonalCollection?: string[];
  birthday?: boolean;
  soloEvento?: string; // desde la barra lateral: solo esa fiesta
  onOpenProfile: () => void;
}

// Cartel de la estación / festividad del momento, con sus premios de
// temporada: si todavía no los ganó, lo invita a jugar una actividad; si ya
// los tiene, lo invita a ponérselos en su perfil.
export default function SeasonalBanner({
  seasonalCollection = [],
  birthday = false,
  soloEvento,
  onOpenProfile,
}: Props) {
  const todos = birthday ? [BIRTHDAY_EVENT, ...getActiveEvents()] : getActiveEvents();
  const events = soloEvento ? todos.filter((e) => e.id === soloEvento) : todos;
  if (events.length === 0) return null;
  const owned = new Set(seasonalCollection);

  return (
    <div className="relative z-10 w-full max-w-3xl mx-auto mb-4 px-4 flex flex-col gap-2">
      {events.map((event) => {
        const rewards = getEventRewardIds(event.id);
        const accessoryIds = rewards.filter((id) => !id.startsWith("fondo:"));
        const allOwned = rewards.every((id) => owned.has(id));
        return (
          <button
            key={event.id}
            onClick={onOpenProfile}
            className="parchment-panel rounded-2xl px-4 py-2.5 flex items-center gap-3 text-left hover:brightness-105 transition"
          >
            <span className="text-2xl shrink-0">{event.emoji}</span>
            <span className="flex-1 min-w-0">
              <span className="block font-black text-sm">{event.label}</span>
              <span className="block text-xs opacity-80">
                {event.description}{" "}
                {event.id === BIRTHDAY_EVENT.id
                  ? allOwned
                    ? "¡La corona y el fondo de cumple ya son tuyos para siempre!"
                    : "Jugá una actividad y quedate con la corona y el fondo de cumple."
                  : allOwned
                    ? "¡Ya ganaste sus premios! Tocá acá para ponértelos."
                    : "Jugá una actividad y ganá sus premios de temporada."}
              </span>
            </span>
            <span className="flex -space-x-2 shrink-0">
              {accessoryIds.map((id) => (
                <span
                  key={id}
                  className={`relative w-10 h-10 rounded-full bg-white/80 border-2 ${
                    owned.has(id) ? "border-emerald-500" : "border-amber-400"
                  }`}
                  title={getAccessoryById(id)?.label}
                >
                  <Image
                    src={getAccessorySrc(id)}
                    alt={getAccessoryById(id)?.label ?? ""}
                    fill
                    sizes="40px"
                    className="object-contain p-1"
                  />
                </span>
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}
