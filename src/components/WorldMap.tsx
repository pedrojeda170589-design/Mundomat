"use client";

import Image from "next/image";
import { WorldDef } from "@/types";
import { THEMES, themeForWorld } from "@/lib/grades";

// Cada mundo se ve como una pequeña isla ilustrada (PNG con fondo
// transparente) que representa su tema: una aldea, un bosque, un castillo...
// Cada grado tiene su ambiente (ver GradeTheme en src/lib/grades.ts):
// 3.º public/theme/islands/, 1.º public/theme/grados/1/islas/.

// Desplazamiento horizontal (en %) de cada isla para que el camino
// zigzaguee, como el "mapa de mundos" del póster de la escuela, en vez de
// una grilla prolija.
const ZIGZAG_OFFSETS = [50, 26, 74];
const ROW_HEIGHT = 158; // separación vertical entre islas, en px
const ISLAND_SIZE = 124; // tamaño de cada isla, en px

interface Props {
  worlds: WorldDef[];
  enabledWorldIds: number[];
  completedWorlds: number[];
  worldsPendingRetry?: number[];
  worldsNeedingReview?: number[];
  // Cuántos compañeros de clase están actualmente en cada mundo (por id),
  // sin identificar quiénes son. Ver getClassmateWorldCounts.
  classmateCounts?: Record<number, number>;
  // Etapa del paisaje de fondo (1..4), según el avance en las 4 áreas.
  mapStage?: number;
  // Botón 📄 de fichas para imprimir (no se muestra en el aula de prueba).
  showFichas?: boolean;
  // Cartel de los mundos bloqueados (por defecto, "Esperando al Docente").
  lockedLabel?: string;
  // Mundos que esperan a otro (1.º grado): id → nombre del mundo previo.
  lockedReasons?: Record<number, string>;
  onSelectWorld: (world: WorldDef) => void;
}

export default function WorldMap({
  worlds,
  enabledWorldIds,
  completedWorlds,
  worldsPendingRetry = [],
  worldsNeedingReview = [],
  classmateCounts = {},
  mapStage = 1,
  onSelectWorld,
  showFichas = true,
  lockedLabel = "Esperando al Docente",
  lockedReasons = {},
}: Props) {
  const points = worlds.map((_, i) => ({
    xPct: ZIGZAG_OFFSETS[i % ZIGZAG_OFFSETS.length],
    yPx: 28 + ISLAND_SIZE / 2 + i * ROW_HEIGHT,
  }));
  const containerHeight = 28 + ISLAND_SIZE + Math.max(0, worlds.length - 1) * ROW_HEIGHT + 64;

  return (
    <div
      className="relative w-full max-w-md mx-auto px-6 rounded-[2rem] overflow-hidden border-4 border-amber-800/30 shadow-xl"
      style={{
        height: containerHeight,
        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.28)), url(${(worlds[0] ? themeForWorld(worlds[worlds.length - 1]) : THEMES.meseta).map(mapStage)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Sendero punteado que conecta las islas, como en el mapa del póster */}
      {points.length > 1 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 100 ${containerHeight}`}
          preserveAspectRatio="none"
        >
          <polyline
            points={points.map((p) => `${p.xPct},${p.yPx}`).join(" ")}
            vectorEffect="non-scaling-stroke"
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
        const classmatesHere = classmateCounts[world.id] ?? 0;
        const point = points[i];

        return (
          <div
            key={world.id}
            className="absolute"
            style={{
              left: `${point.xPct}%`,
              top: point.yPx,
              width: ISLAND_SIZE + 30,
              transform: "translate(-50%, -50%)",
            }}
          >
            <button
              disabled={!enabled}
              onClick={() => onSelectWorld(world)}
              className="w-full flex flex-col items-center gap-1 transition active:scale-95 hover:-translate-y-0.5 disabled:cursor-not-allowed"
              aria-label={`${world.name}${enabled ? "" : " (bloqueado)"}`}
            >
              <span className="relative block" style={{ width: ISLAND_SIZE, height: ISLAND_SIZE }}>
                <Image
                  src={world.image ?? themeForWorld(world).island(world.id)}
                  alt=""
                  fill
                  sizes="124px"
                  className={`object-contain drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)] ${
                    enabled ? "" : "grayscale opacity-70"
                  } ${world.kind === "refuerzo" ? "animate-pulse" : ""}`}
                />
                {!enabled && (
                  <span className="absolute inset-0 flex items-center justify-center text-3xl drop-shadow">
                    🔒
                  </span>
                )}
                {completed && (
                  <span className="absolute top-0 right-0 text-lg drop-shadow" title="¡Completado!">
                    ✅
                  </span>
                )}
                {!completed && pendingRetry && (
                  <span
                    className="absolute top-0 right-0 text-lg drop-shadow"
                    title="¡Casi! Repetilo una vez más para completarlo"
                  >
                    ⭐
                  </span>
                )}
                {!completed && !pendingRetry && needsReview && (
                  <span
                    className="absolute top-0 right-0 text-lg drop-shadow"
                    title="Necesitás fortalecer este mundo"
                  >
                    🌱
                  </span>
                )}
                {classmatesHere > 0 && (
                  <span
                    className="absolute top-0 left-0 z-10 flex items-center gap-0.5 rounded-full bg-white border-2 border-amber-500 px-1.5 py-0.5 text-[10px] font-black text-amber-700 shadow"
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
                {world.emoji} {world.name}
              </span>
              {world.tables && world.tables.length > 0 && (
                <span className="text-[10px] font-bold text-slate-800 bg-white/80 rounded-md px-1.5">
                  Tablas del {world.tables.join(", ")}
                </span>
              )}
              {!enabled && (
                <span className="text-[10px] font-bold text-slate-800 bg-white/80 rounded-md px-1.5">
                  {lockedReasons[world.id]?.startsWith("Vuelve")
                    ? lockedReasons[world.id]
                    : lockedReasons[world.id]
                      ? `Primero: ${lockedReasons[world.id]}`
                      : lockedLabel}
                </span>
              )}
            </button>
            {showFichas && world.kind !== "dictado" && world.id !== 28001 && world.id !== 38001 && (
            <a
              href={`/familias#mundo-${world.id}`}
              className="absolute right-0 rounded-full bg-white border-2 border-sky-500 w-8 h-8 flex items-center justify-center text-sm shadow hover:scale-110 transition"
              style={{ top: ISLAND_SIZE - 30 }}
              title="Fichas para imprimir (PDF)"
              aria-label={`Fichas para imprimir de ${world.name}`}
            >
              📄
            </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
