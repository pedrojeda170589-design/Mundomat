"use client";

import { WorldDef } from "@/types";

// Los primeros dos mundos de cada materia tienen una ilustración propia
// (ver public/theme/worlds/). El resto sigue usando el degradé de color
// plano definido en cada WorldDef.
const WORLD_ART: Record<number, string> = {
  1: "/theme/worlds/world-1.jpg",
  2: "/theme/worlds/world-2.jpg",
  15: "/theme/worlds/world-3.jpg",
  16: "/theme/worlds/world-4.jpg",
  27: "/theme/worlds/world-5.jpg",
  28: "/theme/worlds/world-6.jpg",
  39: "/theme/worlds/world-7.jpg",
  40: "/theme/worlds/world-8.jpg",
};

interface Props {
  worlds: WorldDef[];
  enabledWorldIds: number[];
  completedWorlds: number[];
  worldsPendingRetry?: number[];
  worldsNeedingReview?: number[];
  onSelectWorld: (world: WorldDef) => void;
}

export default function WorldMap({
  worlds,
  enabledWorldIds,
  completedWorlds,
  worldsPendingRetry = [],
  worldsNeedingReview = [],
  onSelectWorld,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-3xl mx-auto px-4">
      {worlds.map((world) => {
        const enabled = enabledWorldIds.includes(world.id);
        const completed = completedWorlds.includes(world.id);
        const pendingRetry = worldsPendingRetry.includes(world.id);
        const needsReview = worldsNeedingReview.includes(world.id);
        const art = WORLD_ART[world.id];
        const textClass = art ? "text-white" : "text-slate-900";
        const subTextClass = art ? "text-white/80" : "text-slate-800/70";
        return (
          <button
            key={world.id}
            disabled={!enabled}
            onClick={() => onSelectWorld(world)}
            className="signpost-tile relative rounded-2xl p-4 text-left disabled:opacity-50 disabled:grayscale transition active:scale-[0.98] shadow-lg border-2 border-amber-800/30 overflow-hidden"
            style={
              art
                ? {
                    backgroundImage: `linear-gradient(180deg, rgba(20,12,4,0.05) 0%, rgba(20,12,4,0.35) 60%, rgba(20,12,4,0.72) 100%), url(${art})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {
                    background: `linear-gradient(135deg, ${world.colorFrom}, ${world.colorTo})`,
                  }
            }
          >
            {completed && (
              <span className="absolute top-2 right-2 text-lg">✅</span>
            )}
            {!completed && pendingRetry && (
              <span
                className="absolute top-2 right-2 text-lg"
                title="¡Casi! Repetilo una vez más para completarlo"
              >
                ⭐
              </span>
            )}
            {!completed && !pendingRetry && needsReview && (
              <span
                className="absolute top-2 right-2 text-lg"
                title="Necesitás fortalecer este mundo"
              >
                🌱
              </span>
            )}
            <div className="text-3xl mb-2">{world.emoji}</div>
            <p className={`font-black leading-tight text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${textClass}`}>
              {world.name}
            </p>
            {world.tables && world.tables.length > 0 && (
              <p className={`text-xs font-bold mt-1 ${subTextClass}`}>
                Tablas del {world.tables.join(", ")}
              </p>
            )}
            {!enabled && (
              <p className={`text-xs font-bold mt-2 ${subTextClass}`}>
                🔒 Esperando al Docente
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
