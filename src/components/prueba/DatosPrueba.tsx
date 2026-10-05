"use client";

import { useState } from "react";
import Link from "next/link";
import { QUE_PASA_A_LOS_30_DIAS } from "@/lib/legal/condiciones";

// Lo que pasa a los 30 días (aula abierta).
export function QuePasaA30Dias({ claro = false }: { claro?: boolean }) {
  return (
    <div className={`rounded-xl p-3 text-xs leading-relaxed ${claro ? "bg-sky-50 border border-sky-300 text-sky-950" : "bg-slate-900/70 border border-sky-400/40 text-sky-50"}`}>
      <p className="font-black mb-1">🗓️ ¿Qué pasa a los 30 días?</p>
      <ul className="list-disc pl-4 space-y-0.5">
        {QUE_PASA_A_LOS_30_DIAS.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

// Botón «Eliminar cuenta y datos»: pide confirmación, borra de verdad y lo confirma.
export function EliminarCuenta({ code, claro = false }: { code: string; claro?: boolean }) {
  const [paso, setPaso] = useState<"inicio" | "confirmar" | "borrando" | "listo">("inicio");
  const [error, setError] = useState<string | null>(null);

  async function borrar() {
    setPaso("borrando");
    setError(null);
    try {
      const res = await fetch("/api/prueba/baja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, confirmar: true }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "No se pudo borrar.");
      try {
        sessionStorage.removeItem("mundomat_code");
        sessionStorage.removeItem("mundomat_name");
      } catch {}
      setPaso("listo");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo borrar.");
      setPaso("confirmar");
    }
  }

  if (paso === "listo") {
    return (
      <div className={`rounded-xl p-3 text-sm ${claro ? "bg-emerald-50 border border-emerald-400 text-emerald-950" : "bg-emerald-900/60 border border-emerald-400 text-emerald-50"}`} role="status">
        <p className="font-black">✅ Listo: la cuenta y todos sus datos se borraron.</p>
        <p className="text-xs mt-1">Se eliminaron el nombre, el código, los resultados y los registros asociados. Este código ya no funciona.</p>
        <Link href="/" className="inline-block mt-2 text-xs font-bold underline">
          Ir al inicio
        </Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {paso === "inicio" ? (
        <button
          type="button"
          onClick={() => setPaso("confirmar")}
          className="self-start rounded-xl border-2 border-red-500 bg-red-50 text-red-700 font-black text-xs px-3 py-1.5"
        >
          🗑️ Eliminar cuenta y datos
        </button>
      ) : (
        <div className={`rounded-xl p-3 text-xs ${claro ? "bg-red-50 border-2 border-red-400 text-red-900" : "bg-red-950/70 border-2 border-red-400 text-red-50"}`}>
          <p className="font-black text-sm">¿Seguro? Esto no se puede deshacer.</p>
          <p className="mt-1">Se borran de verdad la cuenta, el nombre, los resultados, el avatar y todos los registros de este código.</p>
          {error && <p className="mt-1 font-bold">{error}</p>}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              disabled={paso === "borrando"}
              onClick={borrar}
              className="rounded-lg bg-red-600 text-white font-black px-3 py-1.5 disabled:opacity-60"
            >
              {paso === "borrando" ? "Borrando…" : "Sí, eliminar todo"}
            </button>
            <button type="button" onClick={() => setPaso("inicio")} className="rounded-lg bg-white/80 text-slate-800 font-bold px-3 py-1.5">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
