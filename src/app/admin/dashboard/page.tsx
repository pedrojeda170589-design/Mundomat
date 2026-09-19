"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Student, StudentProgress } from "@/types";
import { WORLDS, getWorld } from "@/lib/worlds";
import { computeStudentStats } from "@/lib/progressLogic";
import { getMedalTier, MEDAL_INFO } from "@/lib/medals";
import StudentBlock from "@/components/admin/StudentBlock";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [enabledWorldIds, setEnabledWorldIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedProgress, setSelectedProgress] =
    useState<StudentProgress | null>(null);
  const [tab, setTab] = useState<"alumnos" | "mundos" | "registro">(
    "alumnos"
  );

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [studentsRes, worldsRes] = await Promise.all([
      fetch("/api/students"),
      fetch("/api/worlds"),
    ]);
    const studentsData = await studentsRes.json();
    const worldsData = await worldsRes.json();
    setStudents(studentsData.students ?? []);
    setEnabledWorldIds(worldsData.config?.enabledWorldIds ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const pw = sessionStorage.getItem("mundomat_admin_password");
    if (!pw) {
      router.replace("/admin");
      return;
    }
    // Sincroniza el estado con sessionStorage (API externa al render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdminPassword(pw);
    void loadAll();
  }, [router, loadAll]);

  const aula = useMemo(
    () => students.filter((s) => s.type === "aula"),
    [students]
  );
  const agregados = useMemo(
    () => students.filter((s) => s.type === "agregado"),
    [students]
  );

  async function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !adminPassword) return;
    setAdding(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), adminPassword }),
      });
      const data = await res.json();
      if (data.student) {
        setStudents((prev) => [...prev, data.student]);
        setNewName("");
      }
    } finally {
      setAdding(false);
    }
  }

  function handleDeleted(code: string) {
    setStudents((prev) => prev.filter((s) => s.code !== code));
    if (selectedCode === code) {
      setSelectedCode(null);
      setSelectedProgress(null);
    }
  }

  async function toggleWorld(worldId: number) {
    if (!adminPassword) return;
    const next = enabledWorldIds.includes(worldId)
      ? enabledWorldIds.filter((id) => id !== worldId)
      : [...enabledWorldIds, worldId];
    setEnabledWorldIds(next);
    await fetch("/api/worlds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabledWorldIds: next, adminPassword }),
    });
  }

  async function handleViewStats(code: string) {
    setSelectedCode(code);
    setTab("registro");
    const res = await fetch(`/api/progress?code=${encodeURIComponent(code)}`);
    const data = await res.json();
    setSelectedProgress(data.progress ?? null);
  }

  function handleLogout() {
    sessionStorage.removeItem("mundomat_admin_password");
    router.replace("/admin");
  }

  if (loading || !adminPassword) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-slate-400">Cargando...</p>
      </main>
    );
  }

  const selectedStudent = students.find((s) => s.code === selectedCode);
  const stats =
    selectedProgress && selectedStudent
      ? computeStudentStats(selectedProgress, (id) => getWorld(id)?.name ?? "?")
      : null;

  return (
    <main className="flex-1 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-sky-300">
              Panel Docente
            </h1>
            <p className="text-slate-400 text-sm">MundoMat</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 text-sm underline"
          >
            Salir
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { id: "alumnos", label: "👥 Alumnos" },
            { id: "mundos", label: "🗺️ Habilitar Mundos" },
            { id: "registro", label: "📊 Registro y Fortalezas" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                tab === t.id
                  ? "bg-sky-500 text-white"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "alumnos" && (
          <div className="flex flex-col gap-4">
            <form
              onSubmit={handleAddStudent}
              className="flex gap-2 bg-slate-900/70 border border-slate-700 rounded-2xl p-3"
            >
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre del nuevo estudiante"
                className="flex-1 rounded-xl bg-slate-800 border border-slate-600 px-3 py-2 text-white outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={adding}
                className="rounded-xl bg-amber-500 text-slate-900 font-bold px-4 py-2 disabled:opacity-60"
              >
                + Agregar
              </button>
            </form>

            <StudentBlock
              title="Alumnos de aula"
              emoji="🏫"
              students={aula}
              adminPassword={adminPassword}
              onDeleted={handleDeleted}
              onViewStats={handleViewStats}
              selectedCode={selectedCode}
            />
            <StudentBlock
              title="Alumnos agregados"
              emoji="➕"
              students={agregados}
              adminPassword={adminPassword}
              onDeleted={handleDeleted}
              onViewStats={handleViewStats}
              selectedCode={selectedCode}
            />
          </div>
        )}

        {tab === "mundos" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {WORLDS.map((w) => {
              const enabled = enabledWorldIds.includes(w.id);
              return (
                <button
                  key={w.id}
                  onClick={() => toggleWorld(w.id)}
                  className={`rounded-2xl p-3 text-left border-2 transition ${
                    enabled
                      ? "border-emerald-400 bg-emerald-400/10"
                      : "border-slate-700 bg-slate-900/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{w.emoji}</div>
                  <p className="text-white text-sm font-bold leading-tight">
                    {w.name}
                  </p>
                  <p
                    className={`text-xs font-semibold mt-2 ${
                      enabled ? "text-emerald-300" : "text-slate-500"
                    }`}
                  >
                    {enabled ? "✅ Habilitado" : "🔒 Bloqueado"}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {tab === "registro" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {students.map((s) => (
                <button
                  key={s.code}
                  onClick={() => handleViewStats(s.code)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold border ${
                    selectedCode === s.code
                      ? "bg-amber-400 text-slate-900 border-amber-400"
                      : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {!selectedStudent && (
              <p className="text-slate-500 text-sm">
                Elegí un estudiante para ver su registro de actividades.
              </p>
            )}

            {selectedStudent && stats && selectedProgress && (
              <div className="rounded-2xl bg-slate-900/70 border border-slate-700 p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-white font-bold text-lg">
                      {selectedStudent.name}
                    </p>
                    <p className="text-slate-500 text-xs font-mono">
                      Código: {selectedStudent.code}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-300 font-bold text-sm">
                      🪙 {selectedProgress.coins}
                    </span>
                    {(() => {
                      const medal = getMedalTier(stats.worldsCompleted);
                      const info = MEDAL_INFO[medal];
                      return (
                        <span
                          className="text-sm font-bold"
                          style={{ color: info.color }}
                        >
                          {info.emoji} {info.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <Stat label="Mundos completados" value={stats.worldsCompleted} />
                  <Stat label="% de aciertos" value={`${stats.accuracyPct}%`} />
                  <Stat label="Aciertos" value={stats.totalCorrect} />
                  <Stat
                    label="Tiempo jugado"
                    value={`${Math.round(stats.totalTimeSeconds / 60)} min`}
                  />
                </div>

                <div>
                  <p className="text-emerald-300 font-semibold text-sm mb-1">
                    💪 Fortalezas
                  </p>
                  {stats.strengths.length ? (
                    <p className="text-slate-300 text-sm">
                      {stats.strengths.join(", ")}
                    </p>
                  ) : (
                    <p className="text-slate-500 text-sm">
                      Todavía no hay suficientes datos.
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-amber-300 font-semibold text-sm mb-1">
                    📌 Contenidos a fortalecer
                  </p>
                  {stats.toImprove.length ? (
                    <p className="text-slate-300 text-sm">
                      {stats.toImprove.join(", ")}
                    </p>
                  ) : (
                    <p className="text-slate-500 text-sm">
                      Todavía no hay suficientes datos.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/" className="text-slate-500 text-sm underline">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700 py-3">
      <p className="text-lg font-black text-white">{value}</p>
      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
        {label}
      </p>
    </div>
  );
}
