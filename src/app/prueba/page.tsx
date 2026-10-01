"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SkyScene from "@/components/SkyScene";
import { Student } from "@/types";

export default function PruebaInscripcionPage() {
  const router = useRouter();

  const [loadingStatus, setLoadingStatus] = useState(true);
  const [openStatus, setOpenStatus] = useState<{
    open: boolean;
    available: boolean;
    capacity: number;
    trialDays: number;
    totalEnrolled: number;
  } | null>(null);

  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createdStudent, setCreatedStudent] = useState<Student | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/prueba/inscripcion")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setOpenStatus(data);
      })
      .catch(() => {})
      .finally(() => setLoadingStatus(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setError("Por favor escribí el nombre del alumno/a.");
      return;
    }
    if (!consent) {
      setError("Tenés que aceptar las condiciones de la prueba.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/prueba/inscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          consent,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo realizar la inscripción.");
        setSubmitting(false);
        return;
      }

      setCreatedStudent(data.student);
    } catch {
      setError("Ocurrió un error al procesar la inscripción. Probá de nuevo.");
      setSubmitting(false);
    }
  }

  function handleStartPlaying() {
    if (!createdStudent) return;
    sessionStorage.setItem("mundomat_code", createdStudent.code);
    sessionStorage.setItem("mundomat_name", createdStudent.name);
    router.push("/student/play");
  }

  function copyCode() {
    if (!createdStudent) return;
    navigator.clipboard?.writeText(createdStudent.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-12 bg-hero-night overflow-hidden min-h-screen">
      <SkyScene showCelestial={false} />

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="explorer-title-plaque px-6 py-4 mb-3 text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-amber-50">
            🧭 Aula Abierta de Prueba
          </h1>
        </div>

        <p className="text-center text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] text-sm mb-6">
          MundoTest26 · Propuesta educativa de 3.º grado
        </p>

        {loadingStatus ? (
          <div className="parchment-panel rounded-2xl p-8 text-center">
            <p className="text-amber-900 font-bold">Cargando disponibilidad...</p>
          </div>
        ) : createdStudent ? (
          /* Pantalla de éxito con código */
          <div className="parchment-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-5 text-center shadow-xl border-2 border-amber-600/50 animate-fadeIn">
            <div className="text-4xl">🎉</div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-950">
                ¡Bienvenido/a, {createdStudent.name}!
              </h2>
              <p className="text-sm text-amber-900 mt-1">
                Tu período de prueba de {openStatus?.trialDays ?? 30} días ya comenzó.
              </p>
            </div>

            <div className="bg-amber-100/90 rounded-2xl border-2 border-dashed border-amber-600/50 p-5">
              <p className="text-xs uppercase font-extrabold tracking-wider text-amber-800 mb-1">
                Tu código de acceso personal
              </p>
              <p className="text-3xl sm:text-4xl font-mono font-black text-amber-950 tracking-[0.25em]">
                {createdStudent.code}
              </p>
              <button
                type="button"
                onClick={copyCode}
                className="mt-2 text-xs font-bold text-amber-800 hover:text-amber-950 underline"
              >
                {copied ? "¡Copiado al portapapeles! ✓" : "Copiar código"}
              </button>
            </div>

            <p className="text-xs sm:text-sm font-bold text-amber-900/90">
              📌 Guardalo en un lugar seguro: lo vas a necesitar cada vez que entres a jugar.
            </p>

            <button
              onClick={handleStartPlaying}
              className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-black text-lg py-4 border-2 border-amber-700/50 hover:brightness-105 active:scale-95 shadow-md transition"
            >
              ¡Empezar a jugar ahora! 🧭
            </button>
          </div>
        ) : openStatus && (!openStatus.open || !openStatus.available) ? (
          /* Mensaje de cupo completo o cerrado */
          <div className="parchment-panel rounded-2xl p-6 sm:p-8 text-center shadow-xl border-2 border-amber-600/40 flex flex-col gap-4">
            <span className="text-4xl">🏕️</span>
            <h2 className="text-xl font-black text-amber-950">
              El aula de prueba está completa por ahora
            </h2>
            <p className="text-sm text-amber-900/80 leading-relaxed">
              Alcanzamos el cupo de alumnos para esta etapa de prueba. Podés volver a consultar más adelante.
            </p>
          </div>
        ) : (
          /* Formulario de inscripción */
          <div className="parchment-panel rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-amber-600/40 flex flex-col gap-5">
            <div className="text-xs text-amber-900/90 leading-relaxed bg-amber-100/60 p-3.5 rounded-xl border border-amber-700/20">
              <p className="font-semibold mb-1">
                📖 Prueba gratuita de {openStatus?.trialDays ?? 30} días
              </p>
              MundoTest26 es un entorno educativo seguro para chicos de 3.º grado. No solicitamos correos, números de teléfono ni datos sensibles.
              <span className="block mt-1.5">
                En la prueba se pueden superar hasta 5 mundos de cada materia. Al terminar, la familia recibe un
                informe con lo logrado y lo que conviene seguir reforzando, y el historial de juego se borra.
              </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Honeypot anti-bots */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Nombre de pila e inicial del apellido del alumno/a
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Mateo R. o Sofía G."
                  maxLength={30}
                  required
                  className="w-full rounded-xl bg-white/80 border-2 border-amber-700/30 px-3.5 py-2.5 text-base font-medium text-amber-950 outline-none focus:border-amber-600 placeholder:text-amber-800/40"
                />
                <p className="text-[11px] text-amber-800/70 mt-1">
                  Por privacidad, no ingreses el apellido completo.
                </p>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-700/40"
                  required
                />
                <span className="text-xs text-amber-950 font-semibold leading-snug">
                  Soy la persona adulta responsable y acepto que use MundoTest26 durante {openStatus?.trialDays ?? 30} días de prueba.
                </span>
              </label>

              {error && (
                <p className="text-red-700 text-xs text-center font-bold">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold text-base py-3.5 border-2 border-amber-700/50 hover:brightness-105 active:scale-95 shadow transition disabled:opacity-60"
              >
                {submitting ? "Generando acceso..." : "Inscribirse y recibir código 🧭"}
              </button>
            </form>
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-slate-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] text-sm underline hover:text-white"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
