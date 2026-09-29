"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PanelShell, { ErrorNote, NotConfigured, Panel, usePanelSession } from "@/components/platform/PanelShell";
import { friendlyError, platform } from "@/lib/platform/client";
import type { Classroom } from "@/lib/platform/shared";

// Entrada a la plataforma: login / registro y "Mis aulas".
export default function DocentePage() {
  const { state, session } = usePanelSession();

  if (state === "off") {
    return (
      <PanelShell title="🧭 Plataforma MundoTest26" back={{ href: "/", label: "Inicio" }}>
        <NotConfigured />
      </PanelShell>
    );
  }
  if (state === "loading") {
    return (
      <PanelShell title="🧭 Plataforma MundoTest26">
        <Panel>Cargando…</Panel>
      </PanelShell>
    );
  }
  if (state === "anon" || !session) {
    return (
      <PanelShell title="🧭 Plataforma MundoTest26" subtitle="Docentes y escuelas" back={{ href: "/", label: "Inicio" }}>
        <LoginForm />
      </PanelShell>
    );
  }
  return (
    <PanelShell
      title="🧭 Mis aulas"
      subtitle={session.user.email ?? ""}
      back={{ href: "/", label: "Inicio" }}
    >
      <MyClassrooms />
      {(session.adminSchools.length > 0 || session.isSuperAdmin) && (
        <Panel className="mt-4">
          <p className="font-black mb-2">🏫 Gestión de escuela</p>
          <div className="flex flex-wrap gap-2">
            {session.adminSchools.map((s) => (
              <Link
                key={s.id}
                href={`/docente/escuela?id=${s.id}`}
                className="rounded-xl bg-amber-900 text-amber-50 font-bold text-sm px-3 py-2"
              >
                {s.name}
              </Link>
            ))}
            {session.isSuperAdmin && (
              <Link href="/docente/plataforma" className="rounded-xl bg-violet-700 text-white font-bold text-sm px-3 py-2">
                🌐 Todas las escuelas
              </Link>
            )}
          </div>
        </Panel>
      )}
      {session.access.length === 0 && (
        <Panel className="mt-4">
          <p className="font-bold">Tu cuenta todavía no tiene aulas asignadas.</p>
          <p className="text-sm mt-1">
            Pedile a la dirección de tu escuela que te asigne un aula con este email: <b>{session.user.email}</b>
          </p>
        </Panel>
      )}
      <p className="text-center text-xs text-amber-950/70 mt-6">
        El panel de siempre (aula piloto) sigue disponible en{" "}
        <Link href="/admin" className="underline">
          /admin
        </Link>
        .
      </p>
    </PanelShell>
  );
}

function MyClassrooms() {
  const [rows, setRows] = useState<(Classroom & { schools: { name: string } | null; students: number })[] | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const sb = platform();
      const { data: user } = await sb.auth.getUser();
      // Solo las aulas asignadas a este docente (la base además filtra por RLS).
      const { data, error: e } = await sb
        .from("teacher_classrooms")
        .select("classrooms(*, schools(name))")
        .eq("teacher_id", user.user?.id ?? "");
      if (e) {
        if (!cancelled) setError(e);
        return;
      }
      const classrooms = (data ?? [])
        .map((r) => (r as unknown as { classrooms: Classroom & { schools: { name: string } | null } }).classrooms)
        .filter(Boolean);
      const counts = await Promise.all(
        classrooms.map(async (c) => {
          const { count } = await sb
            .from("student_enrollments")
            .select("id", { count: "exact", head: true })
            .eq("classroom_id", c.id)
            .eq("status", "active");
          return count ?? 0;
        })
      );
      if (!cancelled) {
        setRows(
          classrooms
            .map((c, i) => ({ ...c, students: counts[i] }))
            .sort((a, b) => b.school_year - a.school_year || a.grade - b.grade || a.division.localeCompare(b.division))
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <Panel><ErrorNote error={error} /></Panel>;
  if (!rows) return <Panel>Cargando tus aulas…</Panel>;
  if (rows.length === 0) return null;
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {rows.map((c) => (
        <Link
          key={c.id}
          href={`/docente/aula?id=${c.id}`}
          className="parchment-panel rounded-2xl p-4 text-amber-950 hover:brightness-105 transition block"
        >
          <p className="text-2xl font-black">{c.name}</p>
          <p className="text-sm">
            {c.students} {c.students === 1 ? "alumno" : "alumnos"} · Ciclo {c.school_year}
          </p>
          <p className="text-xs opacity-70 truncate">{c.schools?.name}</p>
        </Link>
      ))}
    </div>
  );
}

function LoginForm() {
  const [mode, setMode] = useState<"login" | "registro">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const sb = platform();
      if (mode === "login") {
        const { error: err } = await sb.auth.signInWithPassword({ email: email.trim(), password });
        if (err) throw err;
      } else {
        if (password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres.");
        const { data, error: err } = await sb.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: name.trim() } },
        });
        if (err) throw err;
        if (!data.session) setInfo("¡Cuenta creada! Revisá tu email para confirmarla y después ingresá.");
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel className="max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-2 mb-4">
        {(["login", "registro"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-xl py-2 font-bold ${mode === m ? "bg-amber-900 text-amber-50" : "bg-white/60"}`}
          >
            {m === "login" ? "Ingresar" : "Crear cuenta"}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        {mode === "registro" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre y apellido"
            required
            className="rounded-xl border-2 border-amber-800/30 bg-white/80 px-3 py-2"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoComplete="email"
          className="rounded-xl border-2 border-amber-800/30 bg-white/80 px-3 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="rounded-xl border-2 border-amber-800/30 bg-white/80 px-3 py-2"
        />
        {error && <p className="text-sm font-bold text-rose-700">⚠️ {error}</p>}
        {info && <p className="text-sm font-bold text-emerald-700">{info}</p>}
        <button disabled={busy} className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 disabled:opacity-60">
          {busy ? "…" : mode === "login" ? "Ingresar" : "Crear cuenta"}
        </button>
      </form>
      {mode === "registro" && (
        <p className="text-xs mt-3 opacity-80">
          Después de crear la cuenta, la dirección de tu escuela te asigna tus aulas usando tu email.
        </p>
      )}
    </Panel>
  );
}
