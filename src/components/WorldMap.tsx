"use client";

import { WorldDef } from "@/types";

interface Props {
  worlds: WorldDef[];
  enabledWorldIds: number[];
  completedWorlds: number[];
  onSelectWorld: (world: WorldDef) => void;
}

export default function WorldMap({
  worlds,
  enabledWorldIds,
  completedWorlds,
  onSelectWorld,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-3xl mx-auto px-4">
      {worlds.map((world) => {
        const enabled = enabledWorldIds.includes(world.id);
        const completed = completedWorlds.includes(world.id);
        return (
          <button
            key={world.id}
            disabled={!enabled}
            onClick={() => onSelectWorld(world)}
            className="relative rounded-2xl p-4 text-left disabled:opacity-50 disabled:grayscale transition active:scale-[0.98] shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${world.colorFrom}, ${world.colorTo})`,
            }}
          >
            {completed && (
              <span className="absolute top-2 right-2 text-lg">✅</span>
            )}
            <div className="text-3xl mb-2">{world.emoji}</div>
            <p className="font-black text-slate-900 leading-tight text-sm">
              {world.name}
            </p>
            {world.table && (
              <p className="text-xs font-bold text-slate-800/70 mt-1">
                Tabla del {world.table}
              </p>
            )}
            {!enabled && (
              <p className="text-xs font-bold text-slate-900/70 mt-2">
                🔒 Esperando al Docente
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
