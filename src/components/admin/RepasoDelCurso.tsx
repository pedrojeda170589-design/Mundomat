"use client";

import { useMemo } from "react";
import type { Student, StudentProgress } from "@/types";
import type { CurriculumEntry } from "@/lib/curriculo";
import { getGrade, gradeOf } from "@/lib/grades";
import { contenidosAReforzar } from "@/lib/reforzar";
import { prioridadesDelCurso, PrioridadCurso } from "@/lib/informeContenidos";

// «Qué repasar con el curso»: por eje, los contenidos que más alumnos
// necesitan reforzar (de los que ya los trabajaron). Para decidir dónde hacer
// énfasis en el repaso con todo el grupo. Un bloque por grado.
export default function RepasoDelCurso({
  students,
  progressMap,
  curriculumEntries,
  grades,
  printable = false,
  max = 12,
}: {
  students: Student[];
  progressMap: Record<string, StudentProgress | undefined>;
  curriculumEntries?: Record<string, CurriculumEntry>;
  // Grados a mostrar (por defecto, los de los alumnos).
  grades?: number[];
  printable?: boolean;
  // Cuántos contenidos mostrar como máximo por grado.
  max?: number;
}) {
  const bloques = useMemo(() => {
    const lista = grades ?? [...new Set(students.map((s) => gradeOf(s)))].sort();
    return lista.map((grade) => {
      const g = getGrade(grade, { borradores: true });
      const alumnos = students.filter((s) => gradeOf(s) === grade);
      const prioridades = prioridadesDelCurso(alumnos, progressMap, g.worlds, g.masteryPct);
      const urgentes = prioridades.filter((p) => p.aReforzar > 0).slice(0, max);
      const porId = new Map(urgentes.map((p) => [p.worldId, p]));
      // Agrupado por materia y eje (mismo orden del mapa que el resto del panel).
      const grupos = contenidosAReforzar(
        urgentes.map((p) => ({ worldId: p.worldId, nivel: "practica-guiada" as const, precision: p.precision })),
        { worlds: g.worlds, entradas: curriculumEntries }
      ).map((gr) => ({
        ...gr,
        filas: gr.items
          .map((it) => ({ it, p: porId.get(it.worldId) as PrioridadCurso }))
          .sort((a, b) => b.p.aReforzar / b.p.trabajaron - a.p.aReforzar / a.p.trabajaron),
        peso: gr.items.reduce((n, it) => n + (porId.get(it.worldId)?.aReforzar ?? 0), 0),
      }));
      // Primero el eje donde más alumnos necesitan ayuda.
      grupos.sort((a, b) => b.peso - a.peso);
      return { grade, alumnos: alumnos.length, grupos, trabajados: prioridades.length };
    });
  }, [students, progressMap, curriculumEntries, grades, max]);

  return (
    <div className="flex flex-col gap-4">
      {bloques.map((b) => (
        <div key={b.grade} className="break-inside-avoid">
          {bloques.length > 1 && <p className="font-black text-amber-950 text-sm mb-1">{b.grade}.º grado</p>}
          {b.grupos.length === 0 ? (
            <p className="text-xs text-emerald-800 font-semibold">
              {b.trabajados ? "🎉 No hay contenidos que el grupo necesite reforzar por ahora." : "Todavía no hay contenidos trabajados."}
            </p>
          ) : (
            <div className="space-y-3">
              {b.grupos.map((gr) => (
                <div key={`${gr.materiaId}-${gr.eje}`} className="text-xs break-inside-avoid">
                  <p className="font-black text-slate-800 mb-1">
                    <span className="text-amber-800">{gr.materia}</span> <span className="text-slate-400">·</span>{" "}
                    <span className="text-slate-700">{gr.eje}</span>
                  </p>
                  <ul className="space-y-1.5 pl-2 border-l-2 border-rose-200">
                    {gr.filas.map(({ it, p }) => {
                      const prop = Math.round((p.aReforzar / p.trabajaron) * 100);
                      return (
                        <li key={it.worldId}>
                          <div className="flex items-center gap-2">
                            <span className="flex-1 font-semibold text-slate-900 leading-snug">
                              {it.contenido}
                              <span className="text-slate-400 text-[11px] font-normal"> — mundo: {it.mundo}</span>
                            </span>
                            <span
                              className="shrink-0 rounded-full bg-rose-100 border border-rose-200 px-2 py-0.5 text-[11px] font-black text-rose-800"
                              title={`${p.aReforzar} de ${p.trabajaron} alumnos que lo trabajaron necesitan reforzarlo`}
                            >
                              {p.aReforzar} de {p.trabajaron} lo necesitan
                            </span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="h-1.5 flex-1 rounded-full bg-slate-200 overflow-hidden">
                              <span className="block h-full bg-rose-500" style={{ width: `${prop}%` }} />
                            </span>
                            {p.precision !== undefined && (
                              <span className="text-[10px] text-slate-500 shrink-0 text-right">
                                {p.precision}% de aciertos en promedio
                              </span>
                            )}
                          </div>
                          {p.quienes.length > 0 && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {printable || p.quienes.length <= 6
                                ? p.quienes.join(", ")
                                : `${p.quienes.slice(0, 6).join(", ")} y ${p.quienes.length - 6} más`}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
