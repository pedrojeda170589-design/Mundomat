"use client";

import { useEffect, useState } from "react";
import { StudentProgress } from "@/types";
import TorneoReport from "./TorneoReport";

// Carga el progreso del alumno y muestra el reporte del Torneo de tablas
export default function TorneoReportByCode({ code }: { code: string }) {
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

  if (failed) return <p className="text-sm opacity-70">No se pudo cargar el reporte del torneo.</p>;
  if (!progress) return <p className="text-sm opacity-70">Cargando torneo…</p>;
  return <TorneoReport tablasTorneo={progress.tablasTorneo} />;
}
