"use client";

import { useEffect, useState } from "react";
import { StudentProgress } from "@/types";
import SkillReport from "./SkillReport";

// Carga el avance del alumno (habilidades de 1.º) y muestra el informe.
export default function SkillReportByCode({ code }: { code: string }) {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/progress?code=${encodeURIComponent(code)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!cancelled) setProgress(d.progress ?? null);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);
  if (failed) return <p className="text-sm opacity-70">No se pudo cargar el avance por habilidad.</p>;
  if (!progress) return <p className="text-sm opacity-70">Cargando…</p>;
  return <SkillReport progress={progress} />;
}
