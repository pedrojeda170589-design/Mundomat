"use client";

import { useState } from "react";
import { Student } from "@/types";

interface Props {
  title: string;
  emoji: string;
  students: Student[];
  adminPassword: string;
  onDeleted: (code: string) => void;
  onViewStats: (code: string) => void;
  selectedCode?: string | null;
}

export default function StudentBlock({
  title,
  emoji,
  students,
  adminPassword,
  onDeleted,
  onViewStats,
  selectedCode,
}: Props) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

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
              <button
                onClick={() => onViewStats(s.code)}
                className="text-left flex-1 min-w-0"
              >
                <p className="text-amber-950 text-sm font-semibold truncate">
                  {s.name}
                </p>
              </button>
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
