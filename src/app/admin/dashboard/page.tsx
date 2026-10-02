"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Student, StudentProgress, WorldSubject, SUBJECT_INFO } from "@/types";
import { WORLDS, getWorld } from "@/lib/worlds";
import { computeStudentStats } from "@/lib/progressLogic";
import { getMedalTier, MEDAL_INFO } from "@/lib/medals";
import StudentBlock from "@/components/admin/StudentBlock";
import SkillReport from "@/components/admin/SkillReport";
import { GRADE1_WORLDS } from "@/lib/grade1/worlds";
import { grade1HasContent } from "@/lib/grade1/content";
import { GRADE2_WORLDS } from "@/lib/grade2/worlds";

import NewsAdmin from "@/components/admin/NewsAdmin";
import MailboxAdmin from "@/components/admin/MailboxAdmin";
import CompetitionAdmin from "@/components/admin/CompetitionAdmin";
import OpenClassroomAdmin from "@/components/admin/OpenClassroomAdmin";
import SubjectBadge from "@/components/SubjectBadge";
import Mountains from "@/components/Mountains";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [enabledWorldIds, setEnabledWorldIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState(3);
  // Pestaña de mundos: grado que se está configurando y sus mundos habilitados.
  const [worldsGrade, setWorldsGrade] = useState(3);
  const [g1Enabled, setG1Enabled] = useState<number[]>([]);
  const [g2Enabled, setG2Enabled] = useState<number[]>([]);
  const [adding, setAdding] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedProgress, setSelectedProgress] =
    useState<StudentProgress | null>(null);
  const [tab, setTab] = useState<"alumnos" | "mundos" | "registro">(
    "alumnos"
  );

  const loadAll = useCallback(async (pw: string) => {
    setLoading(true);
    const [studentsRes, worldsRes] = await Promise.all([
      fetch(`/api/students?adminPassword=${encodeURIComponent(pw)}`),
      fetch("/api/worlds"),
    ]);
    const studentsData = await studentsRes.json();
    const worldsData = await worldsRes.json();
    fetch("/api/worlds?grade=1")
      .then((r) => r.json())
      .then((d) => setG1Enabled(d.config?.enabledWorldIds ?? []))
      .catch(() => {});
    fetch("/api/worlds?grade=2")
      .then((r) => r.json())
      .then((d) => setG2Enabled(d.config?.enabledWorldIds ?? []))
      .catch(() => {});
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
    void loadAll(pw);
  }, [router, loadAll]);

  const aula = useMemo(
    () => students.filter((s) => s.type === "aula" && (s.grade ?? 3) === 3),
    [students]
  );
  const agregados = useMemo(
    () => students.filter((s) => s.type === "agregado" && (s.grade ?? 3) === 3),
    [students]
  );
  const primero = useMemo(() => students.filter((s) => s.grade === 1), [students]);
  const segundo = useMemo(() => students.filter((s) => s.grade === 2), [students]);

  async function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !adminPassword) return;
    setAdding(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), adminPassword, grade: newGrade }),
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

  async function toggleG1World(ids: number[], on: boolean) {
    if (!adminPassword) return;
    const set = new Set(g1Enabled);
    for (const id of ids) {
      if (on) set.add(id);
      else set.delete(id);
    }
    const next = [...set].sort((a, b) => a - b);
    setG1Enabled(next);
    await fetch("/api/worlds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabledWorldIds: next, adminPassword, grade: 1 }),
    });
  }

  async function toggleG2World(ids: number[], on: boolean) {
    if (!adminPassword) return;
    const set = new Set(g2Enabled);
    for (const id of ids) {
      if (on) set.add(id);
      else set.delete(id);
    }
    const next = [...set].sort((a, b) => a - b);
    setG2Enabled(next);
    await fetch("/api/worlds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabledWorldIds: next, adminPassword, grade: 2 }),
    });
  }

  async function changeGrade(code: string, grade: number) {
    if (!adminPassword) return;
    const res = await fetch("/api/students", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, grade, adminPassword }),
    });
    if (res.ok) setStudents((prev) => prev.map((s) => (s.code === code ? { ...s, grade: grade === 3 ? undefined : grade } : s)));
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
                className="flex-1 min-w-0 rounded-xl bg-white/70 border-2 border-amber-700/30 px-3 py-2 text-amber-950 outline-none focus:border-amber-500 placeholder:text-amber-800/40"
              />
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(Number(e.target.value))}
                className="rounded-xl bg-white/70 border-2 border-amber-700/30 px-2 py-2 text-amber-950 font-bold"
                aria-label="Grado"
              >
                <option value={3}>3.º</option>
                <option value={2}>2.º</option>
                <option value={1}>1.º</option>
              </select>
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
            {segundo.length > 0 && (
              <StudentBlock
                title="Alumnos de 2.º grado"
                emoji="🌲"
                students={segundo}
                adminPassword={adminPassword}
                onDeleted={handleDeleted}
                onViewStats={handleViewStats}
                selectedCode={selectedCode}
              />
            )}
            {primero.length > 0 && (
              <StudentBlock
                title="Alumnos de 1.º grado"
                emoji="🌱"
                students={primero}
                adminPassword={adminPassword}
                onDeleted={handleDeleted}
                onViewStats={handleViewStats}
                selectedCode={selectedCode}
              />
            )}
            <NewsAdmin adminPassword={adminPassword} />
            <MailboxAdmin adminPassword={adminPassword} />
            <CompetitionAdmin adminPassword={adminPassword} />
            <OpenClassroomAdmin adminPassword={adminPassword} />
          </div>
        )}

        {tab === "mundos" && (
          <div className="flex gap-2 mb-4">
            {[3, 2, 1].map((g) => (
              <button
                key={g}
                onClick={() => setWorldsGrade(g)}
                className={`rounded-full px-4 py-1.5 text-sm font-bold border-2 ${
                  worldsGrade === g ? "bg-emerald-500 text-white border-emerald-700/50" : "bg-white/70 text-amber-900 border-white/50"
                }`}
              >
                {g}.º grado
              </button>
            ))}
          </div>
        )}

        {tab === "mundos" && worldsGrade === 2 && (
          <div className="flex flex-col gap-8">
            <p className="text-amber-950/80 text-sm parchment-panel rounded-xl p-3">
              En 2.º los mundos se abren con 60% en el mundo anterior y maestría al 85%. Acá elegís cuáles están disponibles para tus alumnos de 2.º (por defecto, todos).
            </p>
            {(Object.keys(SUBJECT_INFO) as WorldSubject[]).map((subject) => {
              const ws = GRADE2_WORLDS.filter((w) => w.subject === subject);
              const allOn = ws.every((w) => g2Enabled.includes(w.id));
              return (
                <div key={subject}>
                  <h2 className="text-amber-950 font-black text-lg mb-3 flex items-center gap-2 flex-wrap">
                    <SubjectBadge subject={subject} size={30} />
                    {SUBJECT_INFO[subject].label} · 2.º
                    <button
                      onClick={() => toggleG2World(ws.map((w) => w.id), !allOn)}
                      className="ml-auto text-xs font-bold rounded-full bg-white/80 border border-amber-700/30 px-3 py-1"
                    >
                      {allOn ? "Bloquear todos" : "Habilitar todos"}
                    </button>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ws.map((w) => {
                      const enabled = g2Enabled.includes(w.id);
                      return (
                        <button
                          key={w.id}
                          onClick={() => toggleG2World([w.id], !enabled)}
                          title={w.objective}
                          className={`rounded-2xl p-3 text-left border-2 transition ${
                            enabled ? "border-emerald-500 bg-emerald-400/20" : "border-amber-700/20 bg-white/60"
                          }`}
                        >
                          <div className="text-2xl mb-1">{w.emoji}</div>
                          <p className="text-amber-950 text-sm font-bold leading-tight">
                            {w.worldNumber}. {w.name}
                          </p>
                          <p className={`text-xs font-semibold mt-2 ${enabled ? "text-emerald-700" : "text-amber-800/50"}`}>
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

        {tab === "mundos" && worldsGrade === 1 && (
          <div className="flex flex-col gap-8">
            <p className="text-amber-950/80 text-sm parchment-panel rounded-xl p-3">
              En 1.º los mundos se abren de a poco: cada uno se habilita cuando el anterior está logrado o tuvo una vuelta con 60% o
              más. Acá elegís cuáles están disponibles para tus alumnos de 1.º (por defecto, todos).
            </p>
            {(Object.keys(SUBJECT_INFO) as WorldSubject[]).map((subject) => {
              const ws = GRADE1_WORLDS.filter((w) => w.subject === subject && grade1HasContent(w));
              const allOn = ws.every((w) => g1Enabled.includes(w.id));
              return (
                <div key={subject}>
                  <h2 className="text-amber-950 font-black text-lg mb-3 flex items-center gap-2 flex-wrap">
                    <SubjectBadge subject={subject} size={30} />
                    {SUBJECT_INFO[subject].label} · 1.º
                    <button
                      onClick={() => toggleG1World(ws.map((w) => w.id), !allOn)}
                      className="ml-auto text-xs font-bold rounded-full bg-white/80 border border-amber-700/30 px-3 py-1"
                    >
                      {allOn ? "Bloquear todos" : "Habilitar todos"}
                    </button>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ws.map((w) => {
                      const enabled = g1Enabled.includes(w.id);
                      return (
                        <button
                          key={w.id}
                          onClick={() => toggleG1World([w.id], !enabled)}
                          title={w.objective}
                          className={`rounded-2xl p-3 text-left border-2 transition ${
                            enabled ? "border-emerald-500 bg-emerald-400/20" : "border-amber-700/20 bg-white/60"
                          }`}
                        >
                          <div className="text-2xl mb-1">{w.emoji}</div>
                          <p className="text-amber-950 text-sm font-bold leading-tight">
                            {w.worldNumber}. {w.name}
                          </p>
                          <p className={`text-xs font-semibold mt-2 ${enabled ? "text-emerald-700" : "text-amber-800/50"}`}>
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

        {tab === "mundos" && worldsGrade === 3 && (
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
                    {!selectedStudent.classroomId && (
                      <label className="text-xs text-amber-900 font-semibold flex items-center gap-1 mt-1">
                        Grado:
                        <select
                          value={selectedStudent.grade ?? 3}
                          onChange={(e) => void changeGrade(selectedStudent.code, Number(e.target.value))}
                          className="rounded-lg bg-white/70 border border-amber-700/30 px-1 py-0.5"
                        >
                          <option value={3}>3.º</option>
                          <option value={2}>2.º</option>
                          <option value={1}>1.º</option>
                        </select>
                      </label>
                    )}
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
                      🌱 Mundos a tratar (no llegaron al {selectedStudent.grade === 1 ? 80 : selectedStudent.grade === 2 ? 85 : 90}%)
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

                {(selectedStudent.grade === 1 || selectedStudent.grade === 2) && (
                  <div>
                    <p className="text-amber-950 font-black mb-2">📚 Habilidades de {selectedStudent.grade}.º grado</p>
                    <SkillReport progress={selectedProgress} grade={selectedStudent.grade} />
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
