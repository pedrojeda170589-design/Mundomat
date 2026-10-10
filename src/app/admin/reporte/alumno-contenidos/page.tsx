"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Student, StudentProgress } from "@/types";
import { CurriculumEntry } from "@/lib/curriculo";
import { getGrade, gradeOf } from "@/lib/grades";
import InformeContenidos from "@/components/admin/InformeContenidos";
import SkillReport from "@/components/admin/SkillReport";

// Informe imprimible del alumno para el docente: contenidos por eje
// (trabajados, fortalezas, a reforzar, sin trabajar). Todos los grados.
export default function InformeContenidosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Cargando informe…</div>}>
      <Contenido />
    </Suspense>
  );
}

function Contenido() {
  const code = useSearchParams().get("code") || "";
  const [pw, setPw] = useState("");
  const [input, setInput] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [entries, setEntries] = useState<Record<string, CurriculumEntry>>({});
  const [enabled, setEnabled] = useState<number[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guardada = sessionStorage.getItem("mundomat_admin_password");
    if (guardada) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPw(guardada);
      void cargar(guardada);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function cargar(clave: string) {
    if (!code) return;
    setLoading(true);
    try {
      const [sRes, pRes, cRes] = await Promise.all([
        fetch("/api/students", { headers: { "x-admin-password": clave } }),
        fetch(`/api/progress?code=${encodeURIComponent(code)}`),
        fetch(`/api/curriculum?adminPassword=${encodeURIComponent(clave)}`),
      ]);
      const s = await sRes.json();
      const p = await pRes.json();
      const c = await cRes.json();
      const found: Student | null = (s.students ?? []).find((x: Student) => x.code === code) ?? null;
      setStudent(found);
      setProgress(p.progress ?? null);
      setEntries(c.entries ?? {});
      if (found) {
        const grade = gradeOf(found);
        const w = await fetch(grade === 3 ? "/api/worlds" : `/api/worlds?grade=${grade}`).then((r) => r.json());
        setEnabled(w.config?.enabledWorldIds);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!pw && !loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            sessionStorage.setItem("mundomat_admin_password", input.trim());
            setPw(input.trim());
            void cargar(input.trim());
          }}
          className="bg-white p-6 rounded-2xl shadow-md max-w-sm w-full border border-slate-200"
        >
          <h1 className="text-lg font-black text-slate-800 mb-2">Acceso a informes</h1>
          <input
            type="password"
            placeholder="Contraseña docente"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-3"
            autoFocus
          />
          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg text-sm">
            Ingresar
          </button>
        </form>
      </main>
    );
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center text-sm text-slate-500">Cargando informe…</main>;
  }

  if (!student || !progress) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <p className="font-bold text-slate-700 mb-3">No se encontraron datos del alumno.</p>
          <Link href="/admin/dashboard" className="text-indigo-600 underline text-sm font-semibold">
            ← Volver al panel
          </Link>
        </div>
      </main>
    );
  }

  const grade = gradeOf(student);
  const conHabilidades = !!getGrade(grade, { borradores: true }).skills?.length;

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 print:p-0 print:bg-white text-slate-900">
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-between gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 print:hidden">
        <Link href="/admin/dashboard" className="text-xs font-bold text-slate-600 px-3 py-1.5 rounded-lg bg-slate-100">
          ← Volver al panel
        </Link>
        <button
          onClick={() => window.print()}
          className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow"
        >
          🖨️ Imprimir / Guardar como PDF
        </button>
      </div>
      <main className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0">
        <header className="border-b-2 border-amber-600 pb-3 mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Informe para el docente</p>
          <h1 className="text-lg font-black">
            {student.name} · {grade}.º grado
          </h1>
          <p className="text-xs text-slate-500">
            Contenidos por eje: qué trabajó, sus fortalezas y dónde hacer énfasis en el repaso. Emitido el{" "}
            {new Date().toLocaleDateString("es-AR")}.
          </p>
        </header>
        <InformeContenidos progress={progress} grade={grade} curriculumEntries={entries} enabledIds={enabled} printable />
        {conHabilidades && (
          <section className="mt-5 break-inside-avoid">
            <p className="font-black mb-2">🧩 Habilidades de {grade}.º grado</p>
            <SkillReport progress={progress} grade={grade} />
          </section>
        )}
        <p className="mt-5 text-[11px] text-slate-500">
          Los estados describen la práctica en la app (respuestas y vueltas completas), no son una calificación.
        </p>
      </main>
    </div>
  );
}
