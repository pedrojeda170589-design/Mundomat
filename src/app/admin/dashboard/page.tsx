"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Student, StudentProgress, WorldSubject, SUBJECT_INFO } from "@/types";
import { WORLDS, getWorld } from "@/lib/worlds";
import { computeStudentStats } from "@/lib/progressLogic";
import { getMedalTier, MEDAL_INFO } from "@/lib/medals";
import StudentBlock from "@/components/admin/StudentBlock";
import SubjectBadge from "@/components/SubjectBadge";
import Mountains from "@/components/Mountains";

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
    <main className="relative flex-1 bg-explorer-day py-8 px-4 overflow-hidden">
      <Mountains isDay />
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="wood-panel-light flex items-center justify-between mb-6 rounded-2xl px-5 py-3">
          <div>
            <h1 className="text-2xl font-black text-amber-50">
              🧭 Panel Docente
            </h1>
            <p className="text-amber-100 text-sm">MundoTest26</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-amber-100 text-sm underline"
          >
            Salir
          </button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: "alumnos", label: "👥 Alumnos" },
            { id: "mundos", label: "🗺️ Habilitar Mundos" },
            { id: "registro", label: "📊 Registro y Fortalezas" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold border-2 transition ${
                tab === t.id
                  ? "bg-amber-500 text-white border-amber-700/50"
                  : "bg-white/70 text-amber-900 border-white/50"
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
              className="parchment-panel flex gap-2 rounded-2xl p-3"
            >
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre del nuevo estudiante"
                className="flex-1 rounded-xl bg-white/70 border-2 border-amber-700/30 px-3 py-2 text-amber-950 outline-none focus:border-amber-500 placeholder:text-amber-800/40"
              />
              <button
                type="submit"
                disabled={adding}
                className="rounded-xl bg-amber-500 text-slate-900 font-bold px-4 py-2 border-2 border-amber-700/40 disabled:opacity-60"
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
          <div className="flex flex-col gap-8">
            {(Object.keys(SUBJECT_INFO) as WorldSubject[]).map((subject) => {
              const info = SUBJECT_INFO[subject];
              const subjectWorlds = WORLDS.filter(
                (w) => w.subject === subject
              );
              return (
                <div key={subject}>
                  <h2 className="text-amber-950 font-black text-lg mb-3 flex items-center gap-2">
                    <SubjectBadge subject={subject} size={30} />
                    {info.label}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {subjectWorlds.map((w) => {
                      const enabled = enabledWorldIds.includes(w.id);
                      return (
                        <button
                          key={w.id}
                          onClick={() => toggleWorld(w.id)}
                          className={`rounded-2xl p-3 text-left border-2 transition ${
                            enabled
                              ? "border-emerald-500 bg-emerald-400/20"
                              : "border-amber-700/20 bg-white/60"
                          }`}
                        >
                          <div className="text-2xl mb-1">{w.emoji}</div>
                          <p className="text-amber-950 text-sm font-bold leading-tight">
                            {w.name}
                          </p>
                          <p
                            className={`text-xs font-semibold mt-2 ${
                              enabled ? "text-emerald-700" : "text-amber-800/50"
                            }`}
                          >
                            {enabled ? "✅ Habilitado" : "🔒 Bloqueado"}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
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
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold border-2 ${
                    selectedCode === s.code
                      ? "bg-amber-400 text-slate-900 border-amber-600"
                      : "bg-white/70 text-amber-900 border-white/50"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {!selectedStudent && (
              <p className="text-amber-900/70 text-sm">
                Elegí un estudiante para ver su registro de actividades.
              </p>
            )}

            {selectedStudent && stats && selectedProgress && (
              <div className="parchment-panel rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-amber-950 font-bold text-lg">
                      {selectedStudent.name}
                    </p>
                    <p className="text-amber-800/60 text-xs font-mono">
                      Código: {selectedStudent.code}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-700 font-bold text-sm">
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

                {!!selectedProgress.worldsNeedingTeacherReview?.length && (
                  <div>
                    <p className="text-orange-700 font-semibold text-sm mb-1">
                      🌱 Mundos a tratar (no llegaron al 90%)
                    </p>
                    <p className="text-amber-950/80 text-sm">
                      {selectedProgress.worldsNeedingTeacherReview
                        .map((id) => {
                          const name = getWorld(id)?.name ?? "?";
                          const score =
                            selectedProgress.lastWorldAttemptScore?.[id];
                          return score !== undefined
                            ? `${name} (${score}%)`
                            : name;
                        })
                        .join(", ")}
                    </p>
                  </div>
                )}

                {!!selectedProgress.worldsPendingReinforcementRetry?.length && (
                  <div>
                    <p className="text-amber-700 font-semibold text-sm mb-1">
                      ⭐ A un repaso de completar
                    </p>
                    <p className="text-amber-950/80 text-sm">
                      {selectedProgress.worldsPendingReinforcementRetry
                        .map((id) => getWorld(id)?.name ?? "?")
                        .join(", ")}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-emerald-700 font-semibold text-sm mb-1">
                    💪 Fortalezas
                  </p>
                  {stats.strengths.length ? (
                    <p className="text-amber-950/80 text-sm">
                      {stats.strengths.join(", ")}
                    </p>
                  ) : (
                    <p className="text-amber-800/50 text-sm">
                      Todavía no hay suficientes datos.
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-amber-700 font-semibold text-sm mb-1">
                    📌 Contenidos a fortalecer
                  </p>
                  {stats.toImprove.length ? (
                    <p className="text-amber-950/80 text-sm">
                      {stats.toImprove.join(", ")}
                    </p>
                  ) : (
                    <p className="text-amber-800/50 text-sm">
                      Todavía no hay suficientes datos.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/" className="text-slate-700 text-sm underline">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white/60 border-2 border-amber-700/20 py-3">
      <p className="text-lg font-black text-amber-950">{value}</p>
      <p className="text-[11px] text-amber-800/70 leading-tight mt-0.5">
        {label}
      </p>
    </div>
  );
}
