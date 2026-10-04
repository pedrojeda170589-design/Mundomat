"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Student, StudentProgress } from "@/types";
import { CurriculumEntry } from "@/lib/curriculo";
import { computeFamilyReportData, ReportPeriod } from "@/lib/familyReport";

export default function StudentReportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Cargando reporte...</div>}>
      <StudentReportContent />
    </Suspense>
  );
}

function StudentReportContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";

  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [student, setStudent] = useState<Student | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [curriculumEntries, setCurriculumEntries] = useState<Record<string, CurriculumEntry>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [period, setPeriod] = useState<ReportPeriod>("mes");

  useEffect(() => {
    const pw = sessionStorage.getItem("mundomat_admin_password");
    if (pw) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdminPassword(pw);
      void loadReportData(pw);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function loadReportData(pw: string) {
    if (!code) return;
    setLoading(true);
    try {
      const [studentsRes, progressRes, currRes] = await Promise.all([
        fetch("/api/students", {
          headers: { "x-admin-password": pw },
        }),
        fetch(`/api/progress?code=${encodeURIComponent(code)}`),
        fetch("/api/curriculum"),
      ]);

      const studentsData = await studentsRes.json();
      const progressData = await progressRes.json();
      const currData = await currRes.json();

      const found = (studentsData.students ?? []).find((s: Student) => s.code === code);
      setStudent(found ?? null);
      setProgress(progressData.progress ?? null);
      setCurriculumEntries(currData.entries ?? {});
    } finally {
      setLoading(false);
    }
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    sessionStorage.setItem("mundomat_admin_password", passwordInput.trim());
    setAdminPassword(passwordInput.trim());
    void loadReportData(passwordInput.trim());
  }

  const reportData = useMemo(() => {
    if (!student || !progress) return null;
    return computeFamilyReportData(student, progress, curriculumEntries, period);
  }, [student, progress, curriculumEntries, period]);

  if (!adminPassword && !loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <form
          onSubmit={handleLoginSubmit}
          className="bg-white p-6 rounded-2xl shadow-md max-w-sm w-full border border-slate-200"
        >
          <h1 className="text-lg font-black text-slate-800 mb-2">Acceso a Reportes</h1>
          <p className="text-xs text-slate-500 mb-4">
            Ingresá la contraseña docente para visualizar el informe.
          </p>
          <input
            type="password"
            placeholder="Contraseña docente"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-3"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            Ingresar
          </button>
        </form>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <p className="text-slate-500 font-semibold text-sm">Cargando reporte familiar...</p>
      </main>
    );
  }

  if (!student || !progress || !reportData) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
        <div>
          <p className="text-slate-700 font-bold mb-3">No se encontraron datos para el estudiante.</p>
          <Link href="/admin/dashboard" className="text-indigo-600 text-sm underline font-semibold">
            ← Volver al Panel Docente
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 print:p-0 print:bg-white text-slate-900 font-sans">
      {/* Barra de herramientas en pantalla (se oculta al imprimir) */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 print:hidden">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/dashboard"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
          >
            ← Volver al Panel
          </Link>
          <div className="flex items-center gap-1 ml-2">
            <span className="text-xs font-semibold text-slate-500">Período:</span>
            {(["mes", "trimestre", "ano"] as ReportPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-xs font-bold px-2.5 py-1 rounded-md transition ${
                  period === p
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {p === "mes" ? "Último mes" : p === "trimestre" ? "Trimestre" : "Ciclo completo"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition cursor-pointer"
        >
          🖨️ Imprimir / Guardar como PDF
        </button>
      </div>

      {/* Hoja imprimible tamaño A4 */}
      <main className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* Cabecera institucional */}
        <header className="border-b-2 border-indigo-600 pb-4 mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧭</span>
              <span className="text-xl font-black tracking-tight text-indigo-950">Mundomat</span>
              <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full ml-1">
                Informe Pedagógico Escolar
              </span>
            </div>
            <h1 className="text-lg font-black text-slate-800 mt-2">
              Reporte de Progreso y Aprendizaje para la Familia
            </h1>
            <p className="text-xs text-slate-500">
              Escuela Primaria · Período analizado: <strong className="text-slate-700">{reportData.periodLabel}</strong>
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Fecha de emisión:</p>
            <p>{reportData.generatedDate}</p>
          </div>
        </header>

        {/* Ficha del alumno */}
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500">Estudiante</p>
            <p className="text-base font-black text-slate-900">{reportData.studentName}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500">Grado</p>
            <p className="text-sm font-bold text-indigo-700">{reportData.grade}.º grado</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500">Identificador</p>
            <p className="text-xs font-mono text-slate-600">{student.code}</p>
          </div>
        </section>

        {/* Resumen cuantitativo en lenguaje amigable */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            1. Resumen de Desempeño y Dedicación
          </h2>
          <div className="grid grid-cols-3 gap-3 text-center mb-3">
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
              <p className="text-2xl font-black text-indigo-900">{reportData.worldsCompleted}</p>
              <p className="text-xs font-bold text-indigo-800 mt-0.5">Mundos logrados</p>
              <p className="text-[11px] text-slate-500 leading-tight mt-1">Superó los desafíos fijados</p>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
              <p className="text-2xl font-black text-emerald-900">{reportData.accuracyPct}%</p>
              <p className="text-xs font-bold text-emerald-800 mt-0.5">Precisión de aciertos</p>
              <p className="text-[11px] text-slate-500 leading-tight mt-1">En las actividades realizadas</p>
            </div>
            <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
              <p className="text-2xl font-black text-amber-900">{reportData.totalTimeMinutes} min</p>
              <p className="text-xs font-bold text-amber-800 mt-0.5">Tiempo de práctica</p>
              <p className="text-[11px] text-slate-500 leading-tight mt-1">Resolución interactiva activa</p>
            </div>
          </div>
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 font-medium">
            💡 {reportData.accuracyMessage}
          </div>
        </section>

        {/* Fortalezas destacadas con anclaje curricular */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <span>🌟</span> 2. ¡Lo que mejor le sale! (Fortalezas Destacadas)
          </h2>
          {reportData.strengths.length > 0 ? (
            <div className="space-y-2.5">
              {reportData.strengths.map((str, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <span className="font-bold text-slate-900">{str.worldName}</span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      {str.area} · {str.eje}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{str.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              El alumno se encuentra en la etapa inicial de exploración de los contenidos.
            </p>
          )}
        </section>

        {/* Recomendaciones familiares constructivas */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <span>🌱</span> 3. Para Seguir Creciendo Juntos (Orientaciones para el Hogar)
          </h2>
          <div className="space-y-2.5">
            {reportData.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-3 text-xs">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <span className="font-bold text-amber-950">{rec.worldName}</span>
                  <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    {rec.area} · {rec.eje}
                  </span>
                </div>
                <p className="text-amber-900/90 leading-relaxed font-normal">{rec.tipForHome}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gráfico de evolución semanal */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            4. Evolución de la Actividad Semanal
          </h2>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="grid grid-cols-6 gap-2 text-center">
              {reportData.weeklyEvolution.map((pt, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="h-16 w-full flex items-end justify-center bg-white rounded-lg border border-slate-200 p-1 mb-1.5">
                    <div
                      className="w-full bg-indigo-500 rounded-t transition-all"
                      style={{
                        height: `${Math.max(8, Math.min(100, pt.accuracyPct))}%`,
                        opacity: pt.activitiesCount > 0 ? 1 : 0.25,
                      }}
                      title={`${pt.weekLabel}: ${pt.accuracyPct}% aciertos (${pt.activitiesCount} actividades)`}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-800">{pt.accuracyPct}%</p>
                  <p className="text-[9px] text-slate-400 leading-tight">{pt.weekLabel.replace("Sem. ", "")}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Barras indican el porcentaje de respuestas acertadas por semana.
            </p>
          </div>
        </section>

        {/* Pie de página institucional y firma */}
        <footer className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end gap-4 text-xs">
          <div className="max-w-md text-slate-500 text-[11px] leading-relaxed">
            <p>{reportData.generalMessage}</p>
          </div>
          <div className="text-center min-w-[140px]">
            <div className="border-b border-slate-400 w-36 mb-1 mx-auto" />
            <p className="text-[11px] font-bold text-slate-700">Firma del Docente</p>
            <p className="text-[9px] text-slate-400">Equipo Pedagógico</p>
          </div>
        </footer>
      </main>

      {/* Estilos específicos para impresión */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
}
