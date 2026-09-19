"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import CloudsBackground from "@/components/CloudsBackground";

export default function StudentLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/progress?code=${encodeURIComponent(code.trim())}`
      );
      const data = await res.json();
      if (!res.ok) {
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
    <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 overflow-hidden">
      <CloudsBackground />
      <div className="relative z-10 w-full max-w-sm">
        <h1 className="text-3xl font-black text-center mb-1 text-amber-300">
          MundoTest26
        </h1>
        <p className="text-center text-slate-300 mb-8">
          Ingresá tu código de acceso
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ej: A3F9K"
            maxLength={8}
            autoFocus
            className="text-center tracking-[0.3em] text-2xl font-bold uppercase rounded-xl bg-slate-900 border-2 border-slate-700 focus:border-amber-400 outline-none py-4 text-white placeholder:text-slate-600"
          />
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold text-lg py-4 disabled:opacity-60"
          >
            {loading ? "Buscando..." : "¡Entrar a jugar! 🚀"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          ¿No tenés código? Pedíselo a tu docente.
        </p>
        <div className="text-center mt-8">
          <Link href="/" className="text-slate-400 text-sm underline">
            ← Volver
          </Link>
        </div>
      </div>
    </main>
  );
}
