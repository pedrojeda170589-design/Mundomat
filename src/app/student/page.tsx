"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MusicToggle from "@/components/MusicToggle";
import { ponerMusica } from "@/lib/musica";
import Link from "next/link";
import SkyScene from "@/components/SkyScene";
import TrialRatingCard from "@/components/prueba/TrialRatingCard";
import { TrialReport, getTrialLengthDays } from "@/lib/openClassroomShared";
import TrialReportCard from "@/components/prueba/TrialReportCard";

export default function StudentLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Música de la pantalla de inicio (arranca con el primer toque).
  useEffect(() => {
    ponerMusica("inicio");
  }, []);
  const [loading, setLoading] = useState(false);
  const [expiredStudent, setExpiredStudent] = useState<{
    code: string;
    name: string;
    days: number;
    report: TrialReport | null;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/progress?code=${encodeURIComponent(code.trim())}&lite=1`
      );
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403 && data.trialExpired) {
          setExpiredStudent({
            code: data.student?.code || code.trim(),
            name: data.student?.name || "Estudiante",
            days: getTrialLengthDays(data.student),
            report: data.report ?? null,
          });
          setLoading(false);
          return;
        }
        setError(data.error || "No pudimos encontrar ese código.");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("mundomat_code", data.student.code);
      sessionStorage.setItem("mundomat_name", data.student.name);
      router.push("/student/play");
    } catch {
      setError("Ocurrió un error. Probá de nuevo.");
      setLoading(false);
    }
  }

  return (
    <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-12 bg-hero-night overflow-hidden">
      <MusicToggle />
      <SkyScene showCelestial={false} />
      {expiredStudent ? (
        <div className="relative z-10 w-full max-w-md mx-auto flex flex-col gap-4">
          <div className="parchment-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-4 text-center shadow-xl border-2 border-amber-600/40">
            <span className="text-4xl">🌅</span>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950">
              ¡Gracias por probar MundoTest26!
            </h2>
            <p className="text-sm text-amber-900 leading-relaxed">
              Hola, <strong>{expiredStudent.name}</strong>. {expiredStudent.report?.endedReason === "mundos"
                ? "¡Completaste todos los mundos de la prueba!"
                : `Tu período de prueba de ${expiredStudent.days} días terminó.`}{" "}
              Esperamos que te haya gustado explorar los mundos y jugar.
            </p>

            {expiredStudent.report && <TrialReportCard report={expiredStudent.report} />}

            <div className="print:hidden">
              <TrialRatingCard studentCode={expiredStudent.code} />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setExpiredStudent(null);
                  setCode("");
                }}
                className="text-xs text-amber-900/80 underline font-semibold hover:text-amber-950"
              >
                Ingresar con otro código
              </button>
            </div>
          </div>

          <div className="text-center mt-2">
            <Link
              href="/"
              className="text-slate-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] text-sm underline hover:text-white"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-sm">
          <div className="explorer-title-plaque px-6 py-4 mb-2 text-center">
            <h1 className="text-2xl font-black text-amber-50">
              🧭 MundoTest26
            </h1>
          </div>
          <p className="text-center text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] mb-8 mt-4">
            Ingresá tu código de acceso
          </p>

        <form
          onSubmit={handleSubmit}
          className="parchment-panel rounded-2xl p-5 flex flex-col gap-4"
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ej: A3F9K"
            maxLength={8}
            autoFocus
            className="text-center tracking-[0.3em] text-2xl font-bold uppercase rounded-xl bg-white/70 border-2 border-amber-700/40 focus:border-amber-600 outline-none py-4 text-amber-950 placeholder:text-amber-700/40"
          />
          {error && (
            <p className="text-red-700 text-sm text-center font-semibold">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold text-lg py-4 border-2 border-amber-700/50 disabled:opacity-60"
          >
            {loading ? "Buscando..." : "¡Entrar a jugar! 🧭"}
          </button>
        </form>

        <p className="text-center text-slate-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] text-sm mt-6">
          ¿No tenés código? Pedíselo a tu docente.
        </p>
        <div className="text-center mt-8">
          <Link href="/" className="text-slate-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] text-sm underline">
            ← Volver
          </Link>
        </div>
      </div>
      )}
    </main>
  );
}
