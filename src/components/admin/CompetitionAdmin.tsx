"use client";

import { useEffect, useState } from "react";

// Competencia (duelos y torneo): prender/apagar y elegir si se juega solo el
// fin de semana o todos los días.
export default function CompetitionAdmin({ adminPassword }: { adminPassword: string }) {
  const [config, setConfig] = useState<{ enabled: boolean; anyDay: boolean } | null>(null);

  useEffect(() => {
    fetch(`/api/competition?adminPassword=${encodeURIComponent(adminPassword)}`)
      .then((r) => r.json())
      .then((d) => d.config && setConfig(d.config))
      .catch(() => {});
  }, [adminPassword]);

  async function update(change: Partial<{ enabled: boolean; anyDay: boolean }>) {
    if (!config) return;
    const next = { ...config, ...change };
    setConfig(next);
    await fetch("/api/competition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminPassword, ...change }),
    });
  }

  if (!config) return null;
  return (
    <div className="parchment-panel rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-amber-950">⚔️ Competencia: duelos y torneo de memoria</h3>
        <button
          onClick={() => update({ enabled: !config.enabled })}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            config.enabled ? "bg-emerald-600 text-white" : "bg-slate-400 text-white"
          }`}
        >
          {config.enabled ? "Encendida" : "Apagada"}
        </button>
      </div>
      <p className="text-sm text-amber-900">
        Participan los alumnos al día (hasta 2 mundos habilitados sin completar). Nadie pierde monedas: ganar 🪙3,
        empatar 🪙2, participar 🪙1; torneo 🪙1.
      </p>
      <label className="flex items-center gap-2 text-sm text-amber-950">
        <input type="checkbox" checked={config.anyDay} onChange={(e) => update({ anyDay: e.target.checked })} />
        Permitir jugar todos los días (si no, solo sábado y domingo)
      </label>
    </div>
  );
}
