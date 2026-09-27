"use client";

import Image from "next/image";
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

// Desplazamiento horizontal (en %) de cada isla para que el camino
// zigzaguee, como el "mapa de mundos" del póster de la escuela, en vez de
// una grilla prolija.
const ZIGZAG_OFFSETS = [50, 26, 74];
const ROW_HEIGHT = 138; // separación vertical entre islas, en px
const ISLAND_SIZE = 100; // diámetro de cada isla, en px

interface Props {
  worlds: WorldDef[];
  enabledWorldIds: number[];
  completedWorlds: number[];
  worldsPendingRetry?: number[];
  worldsNeedingReview?: number[];
  // Cuántos compañeros de clase están actualmente en cada mundo (por id),
  // sin identificar quiénes son. Ver getClassmateWorldCounts.
  classmateCounts?: Record<number, number>;
  onSelectWorld: (world: WorldDef) => void;
}

export default function WorldMap({
  worlds,
  enabledWorldIds,
  completedWorlds,
  worldsPendingRetry = [],
  worldsNeedingReview = [],
  classmateCounts = {},
  onSelectWorld,
}: Props) {
  const points = worlds.map((_, i) => ({
    xPct: ZIGZAG_OFFSETS[i % ZIGZAG_OFFSETS.length],
    yPx: ISLAND_SIZE / 2 + i * ROW_HEIGHT,
  }));
  const containerHeight = ISLAND_SIZE + Math.max(0, worlds.length - 1) * ROW_HEIGHT + 56;

  return (
    <div
      className="relative w-full max-w-md mx-auto px-6"
      style={{ height: containerHeight }}
    >
      {/* Sendero punteado que conecta las islas, como en el mapa del póster */}
      {points.length > 1 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <polyline
            points={points.map((p) => `${p.xPct}%,${p.yPx}`).join(" ")}
            fill="none"
            stroke="#a86a35"
            strokeWidth={5}
            strokeDasharray="3 15"
            strokeLinecap="round"
            opacity={0.55}
          />
        </svg>
      )}

      {worlds.map((world, i) => {
        const enabled = enabledWorldIds.includes(world.id);
        const completed = completedWorlds.includes(world.id);
        const pendingRetry = worldsPendingRetry.includes(world.id);
        const needsReview = worldsNeedingReview.includes(world.id);
        const art = WORLD_ART[world.id];
        const classmatesHere = classmateCounts[world.id] ?? 0;
        const point = points[i];

        return (
          <button
            key={world.id}
            disabled={!enabled}
            onClick={() => onSelectWorld(world)}
            className="absolute flex flex-col items-center gap-1.5 disabled:opacity-60 transition active:scale-95"
            style={{
              left: `${point.xPct}%`,
              top: point.yPx,
              width: ISLAND_SIZE + 40,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span
              className="relative"
              style={{ width: ISLAND_SIZE, height: ISLAND_SIZE }}
            >
              <span
                className="absolute inset-0 rounded-full overflow-hidden border-4 shadow-lg"
                style={{
                  borderColor: enabled ? "#5c3714" : "#8a8a8a",
                  ...(art
                    ? {}
                    : {
                        background: `linear-gradient(135deg, ${world.colorFrom}, ${world.colorTo})`,
                      }),
                }}
              >
                {art && (
                  <Image
                    src={art}
                    alt=""
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                )}
                <span className="absolute inset-0 flex items-center justify-center text-3xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  {enabled ? world.emoji : "🔒"}
                </span>
                {completed && (
                  <span className="absolute top-0.5 right-0.5 text-base">
                    ✅
                  </span>
                )}
                {!completed && pendingRetry && (
                  <span
                    className="absolute top-0.5 right-0.5 text-base"
                    title="¡Casi! Repetilo una vez más para completarlo"
                  >
                    ⭐
                  </span>
                )}
                {!completed && !pendingRetry && needsReview && (
                  <span
                    className="absolute top-0.5 right-0.5 text-base"
                    title="Necesitás fortalecer este mundo"
                  >
                    🌱
                  </span>
                )}
              </span>
              {classmatesHere > 0 && (
                <span
                  className="absolute -top-1.5 -left-1.5 z-10 flex items-center gap-0.5 rounded-full bg-white border-2 border-amber-500 px-1.5 py-0.5 text-[10px] font-black text-amber-700 shadow"
                  title={
                    classmatesHere === 1
                      ? "1 compañero/a está en este mundo"
                      : `${classmatesHere} compañeros/as están en este mundo`
                  }
                >
                  🧑‍🤝‍🧑{classmatesHere}
                </span>
              )}
            </span>
            <span className="wood-panel-light rounded-lg px-2 py-1 text-[11px] font-black text-center leading-tight w-full">
              {world.name}
            </span>
            {world.tables && world.tables.length > 0 && (
              <span className="text-[10px] font-bold text-slate-700/80 -mt-1">
                Tablas del {world.tables.join(", ")}
              </span>
            )}
            {!enabled && (
              <span className="text-[10px] font-bold text-slate-700/80 -mt-1">
                Esperando al Docente
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
