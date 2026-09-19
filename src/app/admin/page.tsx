"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError("Clave incorrecta.");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("mundomat_admin_password", password);
      router.push("/admin/dashboard");
    } catch {
      setError("Ocurrió un error. Probá de nuevo.");
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-black text-center mb-1 text-sky-300">
          Panel Docente
        </h1>
        <p className="text-center text-slate-300 mb-8">
          Ingresá la clave de administrador
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Clave de administrador"
            autoFocus
            className="text-center rounded-xl bg-slate-900 border-2 border-slate-700 focus:border-sky-400 outline-none py-4 text-white placeholder:text-slate-600"
          />
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg py-4 disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Entrar 🔐"}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link href="/" className="text-slate-400 text-sm underline">
            ← Volver
          </Link>
        </div>
      </div>
    </main>
  );
}
