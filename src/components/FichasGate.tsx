"use client";

import { useEffect, useState } from "react";

// Las fichas para imprimir se descargan solo con un código de alumno. Si el
// chico ya entró a la app en esta pestaña, se usa su código sin pedirlo.
export default function FichasGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"checking" | "locked" | "open">("checking");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function unlock(value: string): Promise<boolean> {
    const res = await fetch("/api/fichas/acceso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: value }),
    });
    if (res.ok) return true;
    const d = await res.json().catch(() => ({}));
    setError(d.error ?? "No se pudo verificar el código.");
    return false;
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await fetch("/api/fichas/acceso").then((r) => r.json());
        if (cancelled) return;
        if (d.ok) return setState("open");
        let stored: string | null = null;
        try {
          stored = sessionStorage.getItem("mundomat_code");
        } catch {
          stored = null;
        }
        if (stored && (await unlock(stored))) {
          if (!cancelled) setState("open");
          return;
        }
        if (!cancelled) {
          setError(null);
          setState("locked");
        }
      } catch {
        if (!cancelled) setState("locked");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    if (await unlock(code.trim())) setState("open");
    setBusy(false);
  }

  if (state === "open") return <>{children}</>;
  if (state === "checking") {
    return <p className="text-center text-slate-700 py-8">Cargando…</p>;
  }
  return (
    <div className="parchment-panel rounded-2xl p-6 max-w-sm w-full mx-auto text-center">
      <p className="text-3xl mb-2">🔒</p>
      <h2 className="font-black text-lg text-amber-950 mb-1">Fichas para alumnos de MundoTest26</h2>
      <p className="text-sm text-amber-900 mb-4">
        Para descargar las fichas, ingresá el código de acceso del alumno o la alumna.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Código (ej: AB3CD)"
          maxLength={12}
          autoCapitalize="characters"
          className="rounded-xl border-2 border-amber-700/30 bg-white/80 px-4 py-3 text-center text-lg font-bold tracking-widest text-amber-950 outline-none focus:border-amber-600"
        />
        {error && <p className="text-red-700 text-sm font-semibold">{error}</p>}
        <button
          type="submit"
          disabled={busy || code.trim().length < 3}
          className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-extrabold py-3 border-2 border-amber-700/40 disabled:opacity-50"
        >
          {busy ? "Verificando…" : "Ver las fichas"}
        </button>
      </form>
    </div>
  );
}
