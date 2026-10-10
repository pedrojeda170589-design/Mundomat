"use client";

import { useMemo } from "react";
import type { StudentProgress } from "@/types";
import type { CurriculumEntry } from "@/lib/curriculo";
import { getGrade } from "@/lib/grades";
import { contenidosAReforzar } from "@/lib/reforzar";
import {
  ContenidoAlumno,
  EstadoContenido,
  NIVEL_DE_ESTADO,
  UMBRAL_REFUERZO,
  informeDelAlumno,
} from "@/lib/informeContenidos";
import ReforzarPorEje from "./ReforzarPorEje";

// Informe del alumno por contenidos y ejes (todos los grados): dónde hacer
// énfasis en el repaso, qué está en desarrollo, sus fortalezas y lo que
// todavía no trabajó.
export default function InformeContenidos({
  progress,
  grade,
  curriculumEntries,
  enabledIds,
  printable = false,
}: {
  progress: StudentProgress;
  grade: number;
  curriculumEntries?: Record<string, CurriculumEntry>;
  enabledIds?: number[];
  printable?: boolean;
}) {
  const g = getGrade(grade, { borradores: true });
  const items = useMemo(
    () => informeDelAlumno(progress, g.worlds, g.masteryPct, enabledIds),
    [progress, g, enabledIds]
  );

  const grupos = (estado: EstadoContenido, orden?: (a: ContenidoAlumno, b: ContenidoAlumno) => number) => {
    const lista = items.filter((i) => i.estado === estado);
    if (orden) lista.sort(orden);
    return contenidosAReforzar(
      lista.map((i) => ({
        worldId: i.worldId,
        nivel: NIVEL_DE_ESTADO[estado],
        precision: estado === "sin-trabajar" ? undefined : (i.reciente ?? i.precision ?? i.ultimaVuelta),
      })),
      { worlds: g.worlds, entradas: curriculumEntries }
    );
  };

  const cuenta = (e: EstadoContenido) => items.filter((i) => i.estado === e).length;
  const trabajados = items.filter((i) => i.estado !== "sin-trabajar").length;

  // Ejes con más contenidos a reforzar: por dónde empezar el repaso.
  const aReforzar = grupos("a-reforzar");
  const peor = (e: (typeof aReforzar)[number]) => Math.min(...e.items.map((i) => i.precision ?? 100));
  const ejesPrioritarios = [...aReforzar]
    .sort((a, b) => b.items.length - a.items.length || peor(a) - peor(b))
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <Dato emoji="📘" n={trabajados} label="contenidos trabajados" />
        <Dato emoji="💪" n={cuenta("fortaleza")} label="fortalezas" color="text-emerald-700" />
        <Dato emoji="🟡" n={cuenta("en-desarrollo")} label="en desarrollo" color="text-amber-700" />
        <Dato emoji="🎯" n={cuenta("a-reforzar")} label="para reforzar" color="text-rose-700" />
      </div>

      <Bloque
        titulo="🎯 Dónde hacer énfasis en el repaso"
        ayuda={`Contenidos que ya trabajó y donde acierta menos del ${UMBRAL_REFUERZO}% en lo último (o que el sistema marcó para revisar).`}
        color="border-rose-300 bg-rose-50/70"
      >
        {ejesPrioritarios.length > 0 && (
          <p className="text-xs font-bold text-rose-900 mb-2">
            Empezar por: {ejesPrioritarios.map((e) => `${e.materia} · ${e.eje}`).join(" — ")}
          </p>
        )}
        <ReforzarPorEje grupos={aReforzar} printable={printable} emptyMessage="No hay contenidos para reforzar por ahora. 🎉" />
      </Bloque>

      <Bloque
        titulo="🟡 En desarrollo"
        ayuda="Los está aprendiendo: le va bien, pero todavía no los consolidó. Conviene volver a practicarlos."
        color="border-amber-300 bg-amber-50/70"
      >
        <ReforzarPorEje grupos={grupos("en-desarrollo")} printable={printable} emptyMessage="—" />
      </Bloque>

      <Bloque
        titulo="💪 Fortalezas"
        ayuda={`Contenidos logrados (${g.masteryPct}% o más en una vuelta completa) y que sigue resolviendo bien.`}
        color="border-emerald-300 bg-emerald-50/70"
      >
        <ReforzarPorEje grupos={grupos("fortaleza")} printable={printable} emptyMessage="Todavía no hay contenidos logrados." />
      </Bloque>

      <Bloque
        titulo="📌 Todavía no trabajados"
        ayuda="Contenidos habilitados que todavía no empezó."
        color="border-slate-300 bg-white/70"
      >
        {printable || cuenta("sin-trabajar") === 0 ? (
          <ReforzarPorEje grupos={grupos("sin-trabajar")} printable={printable} emptyMessage="✨ Ya empezó todos los contenidos habilitados." />
        ) : (
          <details>
            <summary className="cursor-pointer text-xs font-bold text-amber-900">
              Ver los {cuenta("sin-trabajar")} contenidos
            </summary>
            <ReforzarPorEje grupos={grupos("sin-trabajar")} className="mt-2" />
          </details>
        )}
      </Bloque>
    </div>
  );
}

function Dato({ emoji, n, label, color = "text-amber-950" }: { emoji: string; n: number; label: string; color?: string }) {
  return (
    <div className="rounded-xl bg-white/70 border border-amber-700/20 px-2 py-1.5">
      <p className={`text-xl font-black ${color}`}>
        {emoji} {n}
      </p>
      <p className="text-[11px] font-semibold text-amber-900/80 leading-tight">{label}</p>
    </div>
  );
}

function Bloque({
  titulo,
  ayuda,
  color,
  children,
}: {
  titulo: string;
  ayuda: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-xl border-2 p-3 break-inside-avoid ${color}`}>
      <p className="font-black text-sm text-amber-950">{titulo}</p>
      <p className="text-[11px] text-amber-900/70 mb-2">{ayuda}</p>
      {children}
    </section>
  );
}
