"use client";

import { useState } from "react";
import { Student } from "@/types";
import { proposeDisplayName } from "@/lib/studentNames";

interface Props {
  title: string;
  emoji: string;
  students: Student[];
  adminPassword: string;
  onDeleted: (code: string) => void;
  onViewStats: (code: string) => void;
  onStudentUpdated?: (student: Student) => void;
  selectedCode?: string | null;
}

export default function StudentBlock({
  title,
  emoji,
  students,
  adminPassword,
  onDeleted,
  onViewStats,
  onStudentUpdated,
  selectedCode,
}: Props) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  // Cumpleaños y nombres para mostrar cargados en esta sesión.
  const [birthdays, setBirthdays] = useState<Record<string, string>>({});
  const [displayNames, setDisplayNames] = useState<Record<string, string>>({});

  // value viene del <input type="date"> como "AAAA-MM-DD" (o vacío).
  async function handleBirthday(code: string, raw: string) {
    // El selector necesita un año: a los que solo tienen día y mes se les
    // muestra 2000 como referencia, y se vuelven a guardar SIN año (no se
    // inventa un año de nacimiento).
    const original = students.find((x) => x.code === code)?.birthday ?? "";
    const value = original.length === 5 && raw.startsWith("2000-") ? raw.slice(5) : raw;
    setBirthdays((b) => ({ ...b, [code]: value }));
    const valid = /^((19|20)\d\d-)?\d\d-\d\d$/.test(value);
    if (value && !valid) return;
    await fetch("/api/students", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, birthday: value || undefined, adminPassword }),
    });
    const s = students.find((x) => x.code === code);
    if (s && onStudentUpdated) {
      onStudentUpdated({ ...s, birthday: value || undefined });
    }
  }

  function handleDisplayNameChange(code: string, value: string) {
    setDisplayNames((prev) => ({ ...prev, [code]: value }));
  }

  // Se guarda al salir del campo o con Enter (antes se mandaba una petición
  // por cada letra y podía quedar guardado un nombre a medias).
  async function saveDisplayName(code: string) {
    const value = displayNames[code];
    if (value === undefined) return;
    const s0 = students.find((x) => x.code === code);
    if ((s0?.displayName || "") === value.trim()) return;
    await fetch("/api/students", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, displayName: value.trim() || undefined, adminPassword }),
    });
    const s = students.find((x) => x.code === code);
    if (s && onStudentUpdated) {
      onStudentUpdated({ ...s, displayName: value.trim() || undefined });
    }
  }

  async function handleCopy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1500);
    } catch {
      // ignore
    }
  }

  async function handleDelete(code: string, name: string) {
    if (!confirm(`¿Eliminar a ${name}? Esta acción no se puede deshacer.`)) {
      return;
    }
    setDeletingCode(code);
    try {
      await fetch(
        `/api/students?code=${encodeURIComponent(code)}&adminPassword=${encodeURIComponent(adminPassword)}`,
        { method: "DELETE" }
      );
      onDeleted(code);
    } finally {
      setDeletingCode(null);
    }
  }

  return (
    <div className="parchment-panel rounded-2xl p-4">
      <h3 className="font-bold text-amber-950 mb-3">
        {emoji} {title}{" "}
        <span className="text-amber-800/60 font-normal text-sm">
          ({students.length})
        </span>
      </h3>
      {students.length === 0 ? (
        <p className="text-amber-800/60 text-sm">No hay alumnos en este grupo.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {students.map((s) => (
            <li
              key={s.code}
              className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 border-2 ${
                selectedCode === s.code
                  ? "border-amber-500 bg-amber-400/20"
                  : "border-amber-700/15 bg-white/50"
              }`}
            >
              <div className="flex-1 min-w-0 flex flex-col">
                <button
                  onClick={() => onViewStats(s.code)}
                  className="text-left min-w-0"
                >
                  <p className="text-amber-950 text-sm font-semibold truncate">
                    {s.name}
                  </p>
                </button>
                <div className="flex items-center gap-1.5 text-xs text-amber-900/80 mt-0.5">
                  <span className="shrink-0 text-amber-950/60 font-medium">Visible:</span>
                  <input
                    type="text"
                    value={displayNames[s.code] ?? (s.displayName || "")}
                    placeholder={proposeDisplayName(s.name)}
                    onChange={(e) => handleDisplayNameChange(s.code, e.target.value)}
                    onBlur={() => void saveDisplayName(s.code)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                    }}
                    title="Nombre para mostrar que ven sus compañeros"
                    className="w-28 rounded border border-amber-700/30 bg-white/80 px-1 py-0.5 text-xs text-amber-950 font-bold focus:border-amber-600 focus:bg-white"
                  />
                  {!s.displayName && (
                    <span className="text-[10px] text-amber-600 italic shrink-0" title="Propuesta sugerida, sin confirmar">
                      (sugerido)
                    </span>
                  )}
                </div>
              </div>
              <label
                className="shrink-0 flex items-center gap-1 text-xs text-amber-900"
                title="Fecha de nacimiento (opcional)"
              >
                🎂
                <input
                  type="date"
                  value={(() => {
                    const b = birthdays[s.code] ?? s.birthday;
                    if (!b) return "";
                    // Si tiene formato MM-DD se usa año 2000 solo de referencia visual en el selector
                    return b.length === 5 ? `2000-${b}` : b;
                  })()}
                  onChange={(e) => handleBirthday(s.code, e.target.value)}
                  className="w-[8.75rem] rounded-md border border-amber-700/30 bg-white/70 px-1 py-0.5 text-amber-950"
                />
              </label>
              <button
                onClick={() => handleCopy(s.code)}
                className="font-mono text-xs bg-amber-950 border border-amber-800 rounded-lg px-2 py-1 text-amber-300 shrink-0"
                title="Copiar código"
              >
                {copiedCode === s.code ? "¡Copiado!" : s.code}
              </button>
              <button
                onClick={() => handleDelete(s.code, s.name)}
                disabled={deletingCode === s.code}
                className="text-red-700 text-xs shrink-0 disabled:opacity-50"
                title="Eliminar alumno"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
