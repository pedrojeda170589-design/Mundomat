"use client";

import { useEffect, useMemo, useState } from "react";
import type { DefEvento, GrupoEvento } from "@/lib/eventos/catalogo";
import type { ConfigEvento, EventosConfig, ModoEvento } from "@/lib/eventos/config";

// Desafíos especiales y eventos: prender/apagar, fechas, días de la semana y
// grados (pedido de Pedro, 8/10/2026). «Automático» = como funcionaba antes.

const GRUPOS: { id: GrupoEvento; titulo: string; ayuda: string }[] = [
  { id: "desafio", titulo: "🎯 Desafíos especiales", ayuda: "Se configuran por grado." },
  { id: "festividad", titulo: "🎉 Festividades", ayuda: "Fondo, premios del día y objetos de la tienda de esa fecha. Para todos los grados." },
  { id: "estacion", titulo: "🍂 Estaciones del año", ayuda: "Fondo y premios de la estación. Para todos los grados." },
  { id: "temporada", titulo: "🛍️ Temporadas de la tienda (avatares y objetos)", ayuda: "Abrí o cerrá cada colección. Para todos los grados." },
  { id: "drop", titulo: "🚀 Lanzamientos (drops)", ayuda: "Colecciones cortas de la tienda. Para todos los grados." },
];

const MODOS: { id: ModoEvento; label: string }[] = [
  { id: "auto", label: "Automático" },
  { id: "siempre", label: "Siempre" },
  { id: "fechas", label: "Entre fechas" },
  { id: "apagado", label: "Apagado" },
];

const DIAS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];
const GRADOS = [1, 2, 3, 4];

function hoyAR(): string {
  return new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10);
}

function resumen(def: DefEvento, c: ConfigEvento | undefined): string {
  if (!c || c.modo === "auto") return `Automático: ${def.auto}`;
  if (c.modo === "apagado") return "Apagado.";
  const dias = c.dias && c.dias.length ? ` (${c.dias.map((d) => DIAS[d]).join(", ")})` : " (todos los días)";
  if (c.modo === "siempre") return `Siempre${dias}.`;
  const f = (s?: string) => (s ? s.split("-").reverse().join("/") : "?");
  return `Del ${f(c.desde)} al ${f(c.hasta)}${dias}.`;
}

export default function EventosAdmin({ adminPassword }: { adminPassword: string }) {
  const [catalogo, setCatalogo] = useState<DefEvento[] | null>(null);
  const [guardada, setGuardada] = useState<EventosConfig>({});
  const [config, setConfig] = useState<EventosConfig>({});
  const [abierto, setAbierto] = useState<string | null>(null);
  const [estado, setEstado] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetch(`/api/eventos?adminPassword=${encodeURIComponent(adminPassword)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.catalogo) {
          setCatalogo(d.catalogo);
          setGuardada(d.config ?? {});
          setConfig(d.config ?? {});
        }
      })
      .catch(() => {});
  }, [adminPassword]);

  const cambios = useMemo(() => JSON.stringify(config) !== JSON.stringify(guardada), [config, guardada]);

  function set(id: string, c: ConfigEvento | null) {
    setEstado(null);
    setConfig((prev) => {
      const next = { ...prev };
      if (c) next[id] = c;
      else delete next[id];
      return next;
    });
  }

  async function guardar() {
    setGuardando(true);
    setEstado(null);
    try {
      const r = await fetch("/api/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPassword, config }),
      });
      const d = await r.json();
      if (!r.ok) {
        setEstado({ tipo: "error", texto: d.error ?? "No se pudo guardar." });
      } else {
        setGuardada(d.config);
        setConfig(d.config);
        setEstado({ tipo: "ok", texto: "Guardado. Los alumnos lo ven en menos de un minuto (al volver a abrir el mapa)." });
      }
    } catch {
      setEstado({ tipo: "error", texto: "No se pudo guardar (sin conexión)." });
    }
    setGuardando(false);
  }

  if (!catalogo) return null;

  return (
    <div className="parchment-panel rounded-2xl p-4 flex flex-col gap-3">
      <div>
        <h3 className="font-black text-amber-950 text-lg">🗓️ Desafíos especiales y eventos</h3>
        <p className="text-sm text-amber-900">
          Para cada uno elegí: <b>Automático</b> (como funciona siempre), <b>Siempre</b>, <b>Entre fechas</b> o <b>Apagado</b>.
          Con «Siempre» y «Entre fechas» podés elegir los días de la semana. Los desafíos se habilitan por grado.
        </p>
      </div>

      {GRUPOS.map((g) => {
        const items = catalogo.filter((e) => e.grupo === g.id);
        if (!items.length) return null;
        return (
          <section key={g.id} className="flex flex-col gap-1.5">
            <h4 className="font-bold text-amber-950 mt-1">{g.titulo}</h4>
            <p className="text-xs text-amber-900/80 -mt-1">{g.ayuda}</p>
            {items.map((def) => {
              const c = config[def.id];
              const modo = c?.modo ?? "auto";
              const open = abierto === def.id;
              const grados = c?.grados ?? def.grados ?? [];
              return (
                <div key={def.id} className={`rounded-xl border-2 ${modo === "apagado" ? "border-slate-300 bg-slate-100/70" : modo === "auto" ? "border-amber-800/20 bg-amber-50/70" : "border-emerald-500/60 bg-emerald-50/70"}`}>
                  <button
                    type="button"
                    onClick={() => setAbierto(open ? null : def.id)}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 min-h-[44px]"
                    aria-expanded={open}
                  >
                    <span className="text-xl shrink-0">{def.emoji}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-bold text-amber-950">{def.nombre}</span>
                      <span className="block text-xs text-amber-900/80">
                        {resumen(def, c)}
                        {def.grados ? ` · Grados: ${grados.length ? grados.map((x) => `${x}.º`).join(", ") : "ninguno"}` : ""}
                      </span>
                    </span>
                    <span className="text-amber-900 text-sm shrink-0">{open ? "▲" : "▼"}</span>
                  </button>

                  {open && (
                    <div className="px-3 pb-3 flex flex-col gap-2 text-sm text-amber-950">
                      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Modo">
                        {MODOS.filter((m) => !(def.grupo === "drop" && m.id === "siempre")).map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            role="radio"
                            aria-checked={modo === m.id}
                            onClick={() => {
                              if (m.id === "auto" && !c?.grados) return set(def.id, null);
                              const base: ConfigEvento = { ...(c ?? { modo: "auto" }), modo: m.id };
                              if (m.id === "fechas" && !base.desde) {
                                base.desde = hoyAR();
                                base.hasta = hoyAR();
                              }
                              if (m.id !== "fechas") {
                                delete base.desde;
                                delete base.hasta;
                              }
                              set(def.id, base);
                            }}
                            className={`rounded-full px-3 py-1.5 text-xs font-bold min-h-[36px] ${modo === m.id ? "bg-amber-600 text-white" : "bg-white/80 text-amber-950 border border-amber-800/30"}`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>

                      {modo === "fechas" && (
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="flex items-center gap-1">
                            Desde
                            <input type="date" value={c?.desde ?? ""} onChange={(e) => set(def.id, { ...(c as ConfigEvento), desde: e.target.value })} className="rounded border border-amber-800/30 px-2 py-1 bg-white" />
                          </label>
                          <label className="flex items-center gap-1">
                            Hasta
                            <input type="date" value={c?.hasta ?? ""} onChange={(e) => set(def.id, { ...(c as ConfigEvento), hasta: e.target.value })} className="rounded border border-amber-800/30 px-2 py-1 bg-white" />
                          </label>
                          <span className="text-xs text-amber-900/80">(incluidos los dos días, hora argentina)</span>
                        </div>
                      )}

                      {(modo === "siempre" || modo === "fechas") && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-bold">Días:</span>
                          {DIAS.map((d, i) => {
                            const dias = c?.dias && c.dias.length ? c.dias : [0, 1, 2, 3, 4, 5, 6];
                            const on = dias.includes(i);
                            return (
                              <button
                                key={d}
                                type="button"
                                aria-pressed={on}
                                onClick={() => {
                                  const nd = on ? dias.filter((x) => x !== i) : [...dias, i].sort();
                                  set(def.id, { ...(c as ConfigEvento), dias: nd });
                                }}
                                className={`w-10 h-9 rounded-lg text-xs font-bold ${on ? "bg-emerald-600 text-white" : "bg-white/80 text-amber-950 border border-amber-800/30"}`}
                              >
                                {d}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {def.grados && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-bold">Grados:</span>
                          {(def.gradosPosibles ?? GRADOS).map((gr) => {
                            const on = grados.includes(gr);
                            return (
                              <button
                                key={gr}
                                type="button"
                                aria-pressed={on}
                                onClick={() => {
                                  const ng = on ? grados.filter((x) => x !== gr) : [...grados, gr].sort();
                                  set(def.id, { ...(c ?? { modo: "auto" }), grados: ng });
                                }}
                                className={`w-12 h-9 rounded-lg text-xs font-bold ${on ? "bg-sky-600 text-white" : "bg-white/80 text-amber-950 border border-amber-800/30"}`}
                              >
                                {gr}.º
                              </button>
                            );
                          })}
                          {c?.grados && (
                            <button type="button" onClick={() => {
                              const { grados: _g, ...resto } = c;
                              void _g;
                              set(def.id, resto.modo === "auto" ? null : resto);
                            }} className="text-xs underline text-amber-900">
                              volver a los de siempre
                            </button>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-amber-900/80">Automático: {def.auto}{def.nota ? ` ${def.nota}` : ""}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        );
      })}

      <div className="sticky bottom-2 flex flex-wrap items-center gap-3 bg-amber-50/95 rounded-xl p-2 border border-amber-800/20">
        <button
          type="button"
          onClick={guardar}
          disabled={!cambios || guardando}
          className="rounded-xl bg-emerald-600 disabled:bg-slate-400 text-white font-black text-sm px-5 py-2.5 min-h-[44px]"
        >
          {guardando ? "Guardando…" : cambios ? "💾 Guardar cambios" : "Sin cambios"}
        </button>
        {cambios && (
          <button type="button" onClick={() => setConfig(guardada)} className="text-sm underline text-amber-900">
            Descartar
          </button>
        )}
        {estado && (
          <span role="status" className={`text-sm font-bold ${estado.tipo === "ok" ? "text-emerald-700" : "text-red-700"}`}>
            {estado.texto}
          </span>
        )}
      </div>
    </div>
  );
}
