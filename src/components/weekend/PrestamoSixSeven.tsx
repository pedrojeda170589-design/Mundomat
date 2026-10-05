"use client";

import { useState } from "react";
import Image from "next/image";
import { textoHasta } from "@/lib/torneo/prestamo";
import { getAccessoryById, getAccessorySrc } from "@/types";
import type { EstadoPrestamo } from "@/lib/torneo/prestamoServer";

// Préstamo Six-Seven del torneo: explica la regla y, si corresponde, deja
// elegir el accesorio prestado hasta el viernes.
export default function PrestamoSixSeven({
  code,
  estado,
  onCambio,
}: {
  code: string;
  estado: EstadoPrestamo | null;
  onCambio: (e: EstadoPrestamo) => void;
}) {
  const [guardando, setGuardando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function elegir(id: string) {
    setGuardando(id);
    setError(null);
    try {
      const res = await fetch("/api/torneo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "prestamo", code, id }),
      });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.error || "No se pudo elegir.");
      if (d.prestamo) onCambio(d.prestamo);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo elegir.");
    } finally {
      setGuardando(null);
    }
  }

  const hastaTexto = estado?.actual ? textoHasta(estado.actual.hasta) : null;

  return (
    <div className="rounded-2xl bg-violet-50 border-2 border-violet-300 p-3 text-left text-xs text-violet-950 flex flex-col gap-2">
      <p className="font-black text-sm">6️⃣7️⃣ Accesorio Six-Seven prestado</p>
      <p className="leading-relaxed">
        Quienes juegan el repaso de las tablas y están <b>al día con los mundos habilitados</b> pueden elegir un accesorio Six-Seven{" "}
        <b>prestado</b> para usar en el avatar por el resto de la semana (hasta el viernes a la noche). Después se devuelve solo.
      </p>
      {estado && !estado.alDia && (
        <p className="rounded-lg bg-white/80 border border-violet-200 px-2 py-1.5">
          Para pedirlo, completá tus mundos: podés tener hasta {estado.maxPendientes} sin terminar y ahora tenés{" "}
          {estado.pendientes.length}
          {estado.pendientes.length > 0 && (
            <> ({estado.pendientes.slice(0, 4).map((w) => `${w.emoji} ${w.name}`).join(", ")}{estado.pendientes.length > 4 ? "…" : ""})</>
          )}
          .
        </p>
      )}
      {estado && estado.alDia && !estado.jugoEsteFinde && (
        <p className="font-bold">¡Estás al día! Completá una tabla esta semana y elegí tu accesorio.</p>
      )}
      {estado?.actual && (
        <p className="font-bold">
          ✅ Tenés prestado: {getAccessoryById(estado.actual.id)?.label ?? estado.actual.id}, hasta el {hastaTexto}. Ponételo desde «Mi perfil».
        </p>
      )}
      {estado?.puedeElegir && (
        <>
          <p className="font-bold">{estado.actual ? "¿Querés cambiarlo? Elegí otro:" : "Elegí uno:"}</p>
          <div className="grid grid-cols-4 gap-2">
            {estado.opciones.map((id) => {
              const def = getAccessoryById(id);
              const elegido = estado.actual?.id === id;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={!!guardando || elegido}
                  onClick={() => elegir(id)}
                  className={`rounded-xl border-2 p-1 flex flex-col items-center gap-0.5 bg-white ${elegido ? "border-emerald-500 ring-2 ring-emerald-300" : "border-violet-200 hover:border-violet-400"} disabled:opacity-80`}
                  title={def?.label ?? id}
                >
                  <span className="relative w-10 h-10">
                    {def ? <Image src={getAccessorySrc(id)} alt="" fill sizes="40px" className="object-contain" /> : "6️⃣7️⃣"}
                  </span>
                  <span className="text-[9px] font-bold leading-tight text-center">{guardando === id ? "…" : def?.label ?? id}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
      {estado && estado.alDia && estado.jugoEsteFinde && estado.opciones.length === 0 && (
        <p>Los accesorios Six-Seven todavía se están dibujando: ¡muy pronto vas a poder elegir!</p>
      )}
      {error && <p className="font-bold text-red-700">{error}</p>}
    </div>
  );
}
