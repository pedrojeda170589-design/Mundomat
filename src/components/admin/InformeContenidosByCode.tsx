"use client";

import { useEffect, useState } from "react";
import { StudentProgress } from "@/types";
import { CurriculumEntry } from "@/lib/curriculo";
import { getGrade } from "@/lib/grades";
import InformeContenidos from "./InformeContenidos";
import SkillReport from "./SkillReport";

// Carga el avance del alumno y muestra el informe por contenidos y ejes (todos
// los grados) y, si el grado las tiene, las habilidades.
export default function InformeContenidosByCode({ code, grade }: { code: string; grade: number }) {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [entries, setEntries] = useState<Record<string, CurriculumEntry>>({});
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`/api/progress?code=${encodeURIComponent(code)}`).then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch("/api/curriculum")
        .then((r): Promise<{ entries?: Record<string, CurriculumEntry> }> => (r.ok ? r.json() : Promise.resolve({})))
        .catch(() => ({}) as { entries?: Record<string, CurriculumEntry> }),
    ])
      .then(([p, c]) => {
        if (cancelled) return;
        setProgress(p.progress ?? null);
        setEntries(c.entries ?? {});
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);
  if (failed) return <p className="text-sm opacity-70">No se pudo cargar el avance del alumno.</p>;
  if (!progress) return <p className="text-sm opacity-70">Cargando…</p>;
  const conHabilidades = !!getGrade(grade, { borradores: true }).skills?.length;
  return (
    <div className="flex flex-col gap-4">
      <InformeContenidos progress={progress} grade={grade} curriculumEntries={entries} />
      {conHabilidades && (
        <div>
          <p className="font-black mb-2">🧩 Habilidades de {grade}.º grado</p>
          <SkillReport progress={progress} grade={grade} />
        </div>
      )}
    </div>
  );
}
