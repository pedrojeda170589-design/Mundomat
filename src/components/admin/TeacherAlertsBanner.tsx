"use client";

import { useEffect, useState } from "react";
import { Student, StudentProgress } from "@/types";
import {
  computeTeacherAlerts,
  TeacherAlert,
  DEFAULT_INACTIVE_DAYS_THRESHOLD,
} from "@/lib/activityMetrics";

interface TeacherAlertsBannerProps {
  students: Student[];
  progressMap: Record<string, StudentProgress>;
  adminPassword?: string | null;
  initialThreshold?: number;
  onSelectStudent?: (code: string) => void;
}

export default function TeacherAlertsBanner({
  students,
  progressMap,
  adminPassword,
  initialThreshold = DEFAULT_INACTIVE_DAYS_THRESHOLD,
  onSelectStudent,
}: TeacherAlertsBannerProps) {
  const [threshold, setThreshold] = useState<number>(initialThreshold);
  const [editingThreshold, setEditingThreshold] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>(String(initialThreshold));
  const [saving, setSaving] = useState<boolean>(false);

  // Umbral guardado por el docente (antes se guardaba pero no se volvía a leer).
  useEffect(() => {
    if (!adminPassword) return;
    let alive = true;
    fetch("/api/alerts", { headers: { "x-admin-password": adminPassword } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { config?: { inactiveDaysThreshold?: number } } | null) => {
        const v = d?.config?.inactiveDaysThreshold;
        if (alive && typeof v === "number" && v > 0) {
          setThreshold(v);
          setInputVal(String(v));
        }
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [adminPassword]);

  const alerts: TeacherAlert[] = computeTeacherAlerts(students, progressMap, threshold);

  async function handleSaveThreshold(e: React.FormEvent) {
    e.preventDefault();
    const val = parseInt(inputVal, 10);
    if (isNaN(val) || val <= 0) return;

    setSaving(true);
    setThreshold(val);
    setEditingThreshold(false);

    if (adminPassword) {
      try {
        await fetch("/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminPassword, inactiveDaysThreshold: val }),
        });
      } catch {
        // Silencioso en caso de error de red
      }
    }
    setSaving(false);
  }

  return (
    <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-50/90 p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔔</span>
          <h3 className="font-black text-amber-950 text-base">
            Para mirar (Alertas tempranas)
          </h3>
          {alerts.length > 0 && (
            <span className="bg-rose-600 text-white font-black text-xs px-2 py-0.5 rounded-full">
              {alerts.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          {!editingThreshold ? (
            <div className="flex items-center gap-1.5 text-amber-900/80">
              <span>Alerta de inactividad:</span>
              <strong className="text-amber-950 bg-white/80 border border-amber-300 px-2 py-0.5 rounded font-bold">
                {threshold} días
              </strong>
              <button
                type="button"
                onClick={() => setEditingThreshold(true)}
                className="text-indigo-700 underline font-semibold hover:text-indigo-900 ml-1 cursor-pointer"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveThreshold} className="flex items-center gap-1.5">
              <span className="text-amber-900">Días sin actividad:</span>
              <input
                type="number"
                min="1"
                max="60"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-14 px-1.5 py-0.5 text-xs bg-white border border-amber-400 rounded text-center font-bold"
                autoFocus
              />
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 text-white px-2 py-0.5 rounded font-bold hover:bg-indigo-700 transition"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setEditingThreshold(false)}
                className="text-slate-500 hover:text-slate-800 text-[11px]"
              >
                Cancelar
              </button>
            </form>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 font-medium flex items-center gap-2">
          <span>✨</span>
          <span>
            ¡Todo el curso está al día! No se detectan caídas marcadas de aciertos ni alumnos con inactividad prolongada ({threshold} días).
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {alerts.map((alert) => {
            const isDrop = alert.type === "performance_drop";
            return (
              <button
                key={alert.id}
                type="button"
                onClick={() => onSelectStudent?.(alert.student.code)}
                className={`text-left p-3 rounded-xl border transition flex flex-col justify-between cursor-pointer ${
                  isDrop
                    ? "bg-rose-50/90 border-rose-300 hover:border-rose-500"
                    : "bg-amber-100/70 border-amber-300 hover:border-amber-500"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-black text-xs text-slate-900 truncate">
                      {isDrop ? "📉 " : "⏳ "}
                      {alert.student.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isDrop ? "bg-rose-200 text-rose-900" : "bg-amber-200 text-amber-900"
                      }`}
                    >
                      {isDrop ? "Caída aciertos" : "Inactivo"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    {alert.description}
                  </p>
                </div>
                <p className="text-[10px] text-indigo-700 font-bold mt-2 hover:underline">
                  Ver registro del alumno →
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
