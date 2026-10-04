"use client";

import { useEffect, useState } from "react";
import { StudentProgress } from "@/types";
import DictationReport from "./DictationReport";

// Carga el progreso del alumno y muestra el reporte de dictados semanales
export default function DictationReportByCode({ code }: { code: string }) {
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

  if (failed) return <p className="text-sm opacity-70">No se pudo cargar el reporte de dictados.</p>;
  if (!progress) return <p className="text-sm opacity-70">Cargando dictados…</p>;
  return <DictationReport dictationWeeks={progress.dictationWeeks} />;
}
