"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PanelShell, { ErrorNote, NotConfigured, Panel, usePanelSession } from "@/components/platform/PanelShell";
import { friendlyError, platform } from "@/lib/platform/client";
import {
  Classroom,
  School,
  formatMinutes,
  subjectEmoji,
  subjectLabel,
} from "@/lib/platform/shared";
import { getPlan, limiteDe } from "@/lib/planes";

import { grade1HasContent } from "@/lib/grade1/content";
import { getGrade } from "@/lib/grades";
import { SUBJECT_INFO, WorldSubject } from "@/types";

interface OverviewRow {
  student_id: string;
  full_name: string;
  nickname: string | null;
  access_code: string;
  subject: string | null;
  accuracy_pct: number | null;
  activities: number | null;
  practice_seconds: number | null;
  last_activity_at: string | null;
}

interface StudentRow {
  id: string;
  name: string;
  nickname: string | null;
  code: string;
  bySubject: Record<string, { pct: number | null; activities: number }>;
  practiceSeconds: number;
  last: string | null;
}

const SUBJECTS = Object.keys(SUBJECT_INFO) as WorldSubject[];
type Tab = "alumnos" | "mundos" | "movimientos" | "inscribir";

// Contexto de aula: todo lo de esta pantalla trabaja sobre UNA aula. El id
// de la dirección no da acceso por sí mismo: la base comprueba el permiso.
export default function ClassroomPage() {
  const router = useRouter();
  const { state } = usePanelSession();
  const [id, setId] = useState<string | null>(null);
  const [classroom, setClassroom] = useState<(Classroom & { schools: School | null }) | null>(null);
  const [schoolStudentCount, setSchoolStudentCount] = useState<number>(0);
  const [mine, setMine] = useState<Classroom[]>([]);
  const [rows, setRows] = useState<StudentRow[] | null>(null);
  const [closed, setClosed] = useState(false);
  const [tab, setTab] = useState<Tab>("alumnos");
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setId(new URLSearchParams(window.location.search).get("id"));
  }, []);

  const load = useCallback(async () => {
    if (!id) return;
    const sb = platform();
    setError(null);
    const { data: c, error: e1 } = await sb.from("classrooms").select("*, schools(*)").eq("id", id).maybeSingle();
    if (e1) return setError(e1);
    if (!c) return setError(new Error("No tenés acceso a esta aula (o no existe)."));
    setClassroom(c);
    const [{ data: cyc }, { data: ov, error: e2 }, { data: others }, { count: studentCount }] = await Promise.all([
      sb.from("school_cycles").select("status").eq("school_id", c.school_id).eq("school_year", c.school_year).maybeSingle(),
      sb.rpc("classroom_overview", { p_classroom: id }),
      sb.from("classrooms").select("*").eq("school_id", c.school_id).order("school_year", { ascending: false }),
      sb.from("student_enrollments").select("id, classrooms!inner(school_id)", { count: "exact", head: true }).eq("classrooms.school_id", c.school_id).eq("status", "active"),
    ]);
    if (e2) return setError(e2);
    setClosed(cyc?.status === "closed");
    setMine((others ?? []) as Classroom[]);
    setSchoolStudentCount(studentCount ?? 0);
    const map = new Map<string, StudentRow>();
    for (const r of (ov ?? []) as OverviewRow[]) {
      const s = map.get(r.student_id) ?? {
        id: r.student_id,
        name: r.full_name,
        nickname: r.nickname,
        code: r.access_code,
        bySubject: {},
        practiceSeconds: 0,
        last: null,
      };
      if (r.subject) {
        s.bySubject[r.subject] = { pct: r.accuracy_pct, activities: r.activities ?? 0 };
        s.practiceSeconds += r.practice_seconds ?? 0;
        if (r.last_activity_at && (!s.last || r.last_activity_at > s.last)) s.last = r.last_activity_at;
      }
      map.set(r.student_id, s);
    }
    setRows([...map.values()].sort((a, b) => a.name.localeCompare(b.name)));
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (state === "ready") void load();
    if (state === "anon") router.replace("/docente");
  }, [state, load, router]);

  if (state === "off") return <PanelShell title="Aula"><NotConfigured /></PanelShell>;

  return (
    <PanelShell
      title={classroom ? `🏫 ${classroom.name} · ${classroom.school_year}` : "Aula"}
      subtitle={classroom?.schools?.name}
      back={{ href: "/docente", label: "Mis aulas" }}
    >
      {error ? (
        <Panel>
          <ErrorNote error={error} />
        </Panel>
      ) : !classroom || !rows ? (
        <Panel>Cargando el aula…</Panel>
      ) : (
        <>
          {mine.length > 1 && (
            <div className="mb-3 flex items-center gap-2 text-sm">
              <label className="font-bold text-slate-800">Cambiar de aula:</label>
              <select
                value={classroom.id}
                onChange={(e) => {
                  window.history.replaceState(null, "", `/docente/aula?id=${e.target.value}`);
                  setId(e.target.value);
                  setRows(null);
                  setTab("alumnos");
                }}
                className="rounded-lg border px-2 py-1 bg-white"
              >
                {mine.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.school_year}
                  </option>
                ))}
              </select>
            </div>
          )}
          {closed && (
            <p className="mb-3 rounded-xl bg-slate-800 text-white text-sm px-3 py-2">
              🔒 El ciclo {classroom.school_year} está cerrado: se puede consultar y promover, pero no se registran resultados nuevos.
            </p>
          )}
          <div className="flex gap-2 mb-4 flex-wrap">
            {(
              [
                ["alumnos", "👥 Alumnos y progreso"],
                ["mundos", "🗺️ Mundos"],
                ["movimientos", "🔄 Promoción y cambios"],
                ["inscribir", "➕ Inscribir alumno"],
              ] as [Tab, string][]
            ).map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-xl px-3 py-2 text-sm font-bold ${tab === t ? "bg-amber-900 text-amber-50" : "bg-white/80 text-amber-950"}`}
              >
                {label}
              </button>
            ))}
          </div>
          {tab === "alumnos" && <StudentsTab rows={rows} />}
          {tab === "mundos" && <WorldsTab classroom={classroom} closed={closed} onSaved={load} />}
          {tab === "movimientos" && <MovesTab classroom={classroom} rows={rows} onDone={load} />}
          {tab === "inscribir" && (
            <EnrollTab
              classroom={classroom}
              closed={closed}
              onDone={load}
              school={classroom.schools}
              schoolStudentCount={schoolStudentCount}
            />
          )}
        </>
      )}
    </PanelShell>
  );
}

function pctClass(p: number | null): string {
  if (p === null) return "text-slate-400";
  if (p >= 85) return "text-emerald-700";
  if (p >= 70) return "text-amber-700";
  if (p >= 50) return "text-orange-700";
  return "text-rose-700";
}

function StudentsTab({ rows }: { rows: StudentRow[] }) {
  const [showCodes, setShowCodes] = useState(false);
  if (rows.length === 0) return <Panel>Todavía no hay alumnos en esta aula.</Panel>;
  return (
    <Panel className="overflow-x-auto">
      <div className="flex items-center justify-between mb-2 gap-2">
        <p className="text-sm">
          % de respuestas correctas por área en este ciclo. Tocá un nombre para ver su legajo.
        </p>
        <button onClick={() => setShowCodes((v) => !v)} className="text-xs underline shrink-0">
          {showCodes ? "Ocultar códigos" : "Ver códigos de ingreso"}
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-amber-900/20">
            <th className="py-1 pr-2">Alumno</th>
            {SUBJECTS.map((s) => (
              <th key={s} className="py-1 px-1 text-center" title={subjectLabel(s)}>
                {subjectEmoji(s)}
              </th>
            ))}
            <th className="py-1 px-1 text-right">Práctica</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-amber-900/10">
              <td className="py-1.5 pr-2">
                <Link href={`/docente/alumno?id=${r.id}`} className="font-bold underline decoration-dotted">
                  {r.name}
                </Link>
                {showCodes && <span className="ml-2 font-mono text-xs bg-amber-950 text-amber-200 rounded px-1">{r.code}</span>}
              </td>
              {SUBJECTS.map((s) => {
                const v = r.bySubject[s];
                return (
                  <td key={s} className={`py-1.5 px-1 text-center font-bold ${pctClass(v?.pct ?? null)}`}>
                    {v?.pct != null ? `${v.pct}%` : "—"}
                  </td>
                );
              })}
              <td className="py-1.5 px-1 text-right text-xs">{formatMinutes(r.practiceSeconds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs mt-2 opacity-70">
        🟢 85% o más · 🟡 70–84% · 🟠 50–69% · 🔴 menos de 50%. Refleja solo la práctica dentro de MundoTest26.
      </p>
    </Panel>
  );
}

function WorldsTab({ classroom, closed, onSaved }: { classroom: Classroom; closed: boolean; onSaved: () => void }) {
  const [enabled, setEnabled] = useState<Set<number>>(new Set(classroom.enabled_world_ids));
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Mundos del grado del aula (1.º, 2.º o 3.º según su catálogo).
  const bySubject = useMemo(() => {
    const list = getGrade(classroom.grade).worlds.filter((w) => classroom.grade !== 1 || grade1HasContent(w));
    return SUBJECTS.map((s) => ({ s, worlds: list.filter((w) => w.subject === s) }));
  }, [classroom.grade]);

  if (classroom.is_legacy_pilot) {
    return (
      <Panel>
        <p className="font-bold">Esta es el aula piloto.</p>
        <p className="text-sm mt-1">
          Sus mundos se siguen habilitando desde el panel de siempre, así no cambia nada para tus alumnos.
        </p>
        <Link href="/admin" className="inline-block mt-2 rounded-xl bg-sky-600 text-white font-bold px-3 py-2 text-sm">
          Ir al panel de siempre
        </Link>
      </Panel>
    );
  }

  async function save() {
    setBusy(true);
    setStatus(null);
    const ids = [...enabled].sort((a, b) => a - b);
    const { data, error } = await platform()
      .from("classrooms")
      .update({ enabled_world_ids: ids })
      .eq("id", classroom.id)
      .select("id");
    setBusy(false);
    if (error) return setStatus(`⚠️ ${friendlyError(error)}`);
    if (!data?.length) return setStatus("⚠️ No se pudo guardar (ciclo cerrado o sin permiso).");
    setStatus("✅ Guardado. Los alumnos lo ven en menos de un minuto.");
    onSaved();
  }

  return (
    <Panel>
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-sm">Elegí qué mundos puede jugar esta aula.</p>
        <button
          onClick={save}
          disabled={busy || closed}
          className="rounded-xl bg-emerald-600 text-white font-bold px-4 py-2 text-sm disabled:opacity-50"
        >
          Guardar
        </button>
      </div>
      {status && <p className="text-sm font-bold mb-2">{status}</p>}
      <div className="grid sm:grid-cols-2 gap-3">
        {bySubject.map(({ s, worlds }) => (
          <div key={s}>
            <p className="font-black mb-1">
              {subjectEmoji(s)} {subjectLabel(s)}
            </p>
            <ul className="flex flex-col gap-1">
              {worlds.map((w) => (
                <li key={w.id}>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={enabled.has(w.id)}
                      disabled={closed}
                      onChange={(e) => {
                        const next = new Set(enabled);
                        if (e.target.checked) next.add(w.id);
                        else next.delete(w.id);
                        setEnabled(next);
                      }}
                    />
                    {w.emoji} {w.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const REASONS = [
  { id: "promoted", label: "Promover al grado siguiente", help: "Pasan al grado siguiente en el ciclo que viene." },
  { id: "repeated", label: "Permanece en el grado", help: "Siguen en el mismo grado el ciclo que viene." },
  { id: "moved", label: "Cambio de aula/división", help: "Se cambian de aula dentro del mismo ciclo." },
] as const;

function MovesTab({ classroom, rows, onDone }: { classroom: Classroom; rows: StudentRow[]; onDone: () => void }) {
  const [targets, setTargets] = useState<{ id: string; name: string; grade: number; school_year: number }[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState<(typeof REASONS)[number]["id"]>("promoted");
  const [target, setTarget] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState<Set<string>>(new Set());

  useEffect(() => {
    const sb = platform();
    sb.rpc("promotion_targets", { p_classroom: classroom.id }).then(({ data }) => setTargets(data ?? []));
    sb.from("student_enrollments")
      .select("student_id")
      .eq("classroom_id", classroom.id)
      .eq("status", "active")
      .then(({ data }) => setActive(new Set((data ?? []).map((r) => r.student_id as string))));
  }, [classroom.id, rows]);

  const valid = targets.filter((t) =>
    reason === "promoted"
      ? t.school_year > classroom.school_year && t.grade > classroom.grade
      : reason === "repeated"
        ? t.school_year > classroom.school_year && t.grade === classroom.grade
        : t.school_year === classroom.school_year
  );
  const candidates = rows.filter((r) => active.has(r.id));

  async function run() {
    const t = valid.find((x) => x.id === target);
    if (!t || selected.size === 0) return;
    const names = candidates.filter((c) => selected.has(c.id)).map((c) => c.name);
    const verb = REASONS.find((r) => r.id === reason)!.label.toLowerCase();
    if (!window.confirm(`¿Confirmás "${verb}" a ${t.name} · ${t.school_year} para:\n\n${names.join("\n")}\n\nEl historial de cada alumno se conserva.`)) return;
    setBusy(true);
    setStatus(null);
    const { data, error } = await platform().rpc("move_students", {
      p_students: [...selected],
      p_target: t.id,
      p_reason: reason,
    });
    setBusy(false);
    if (error) return setStatus(`⚠️ ${friendlyError(error)}`);
    setStatus(`✅ Listo: ${data} ${data === 1 ? "alumno" : "alumnos"} en ${t.name} · ${t.school_year}. Su historial quedó intacto.`);
    setSelected(new Set());
    onDone();
  }

  return (
    <Panel>
      <p className="text-sm mb-3">
        Los alumnos <b>conservan su cuenta, su código, su avatar y todo su historial</b>. Solo se registra su nueva aula.
        Para un cambio de escuela, la escuela que recibe usa el código del alumno.
      </p>
      <div className="grid sm:grid-cols-3 gap-2 mb-3">
        {REASONS.map((r) => (
          <button
            key={r.id}
            onClick={() => {
              setReason(r.id);
              setTarget("");
            }}
            className={`rounded-xl p-2 text-left text-sm ${reason === r.id ? "bg-amber-900 text-amber-50" : "bg-white/70"}`}
          >
            <b>{r.label}</b>
            <span className="block text-xs opacity-80">{r.help}</span>
          </button>
        ))}
      </div>
      <label className="text-sm font-bold">Aula de destino: </label>
      <select value={target} onChange={(e) => setTarget(e.target.value)} className="rounded-lg border px-2 py-1 bg-white text-sm">
        <option value="">Elegí…</option>
        {valid.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} · {t.school_year}
          </option>
        ))}
      </select>
      {valid.length === 0 && (
        <p className="text-xs mt-1 opacity-80">
          No hay aulas disponibles para esta opción. La dirección de la escuela crea las aulas del ciclo siguiente.
        </p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <p className="font-bold text-sm">Alumnos ({selected.size} elegidos)</p>
        <button
          onClick={() => setSelected(selected.size === candidates.length ? new Set() : new Set(candidates.map((c) => c.id)))}
          className="text-xs underline"
        >
          {selected.size === candidates.length ? "Ninguno" : "Todos"}
        </button>
      </div>
      <ul className="grid sm:grid-cols-2 gap-1 mt-1">
        {candidates.map((c) => (
          <li key={c.id}>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.has(c.id)}
                onChange={(e) => {
                  const n = new Set(selected);
                  if (e.target.checked) n.add(c.id);
                  else n.delete(c.id);
                  setSelected(n);
                }}
              />
              {c.name}
            </label>
          </li>
        ))}
      </ul>
      {candidates.length === 0 && <p className="text-sm opacity-70">No hay alumnos activos en esta aula.</p>}
      {status && <p className="text-sm font-bold mt-3">{status}</p>}
      <button
        onClick={run}
        disabled={busy || !target || selected.size === 0}
        className="mt-3 rounded-xl bg-emerald-600 text-white font-bold px-4 py-2 disabled:opacity-50"
      >
        {REASONS.find((r) => r.id === reason)!.label}
      </button>
    </Panel>
  );
}

import { proposeDisplayName } from "@/lib/studentNames";

function EnrollTab({
  classroom,
  closed,
  onDone,
  school,
  schoolStudentCount,
}: {
  classroom: Classroom;
  closed: boolean;
  onDone: () => void;
  school?: School | null;
  schoolStudentCount?: number;
}) {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [birth, setBirth] = useState("");
  const [result, setResult] = useState<{ name: string; code: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const maxStudents = limiteDe(school, "alumnos");
  const planDef = getPlan(school?.plan);
  const atLimit = (schoolStudentCount ?? 0) >= maxStudents;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (atLimit) {
      return setError(`Tu escuela alcanzó el cupo máximo de ${maxStudents} alumnos del ${planDef.name}. Para inscribir más alumnos, consultá por la ampliación al Plan Escuela o Distrito.`);
    }
    setBusy(true);
    setError(null);
    const { data, error: err } = await platform().rpc("enroll_new_student", {
      p_classroom: classroom.id,
      p_full_name: name.trim(),
      p_birth_date: birth || null,
    });
    if (err) {
      setBusy(false);
      return setError(friendlyError(err));
    }
    const s = data as { id?: string; full_name: string; access_code: string };
    const nickToSave = nickname.trim() || proposeDisplayName(name.trim());
    if (s.id && nickToSave) {
      await platform().from("students").update({ nickname: nickToSave }).eq("id", s.id);
    }
    setBusy(false);
    setResult({ name: s.full_name, code: s.access_code });
    setName("");
    setNickname("");
    setNicknameTouched(false);
    setBirth("");
    onDone();
  }

  return (
    <Panel>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-slate-800">
          Inscripción de alumno nuevo
        </p>
        {atLimit && (
          <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-300">
            Límite alcanzado ({schoolStudentCount}/{maxStudents})
          </span>
        )}
      </div>
      {atLimit && (
        <div className="mb-4 rounded-xl bg-rose-50 border border-rose-300 p-3 text-xs text-rose-900">
          <p className="font-bold flex items-center gap-1.5 text-sm mb-1">
            <span>⚠️</span> Cupo de alumnos alcanzado ({schoolStudentCount}/{maxStudents})
          </p>
          <p>
            Tu escuela alcanzó el cupo máximo de {maxStudents} alumnos del {planDef.name}. Para inscribir más alumnos, consultá por la ampliación al Plan Escuela o Distrito.
          </p>
        </div>
      )}
      <p className="text-sm mb-3">
        Para alumnos <b>nuevos</b> en la plataforma. Si el alumno ya usó MundoTest26 en otra aula o escuela, no lo
        inscribas de nuevo: se lo promueve o traslada y conserva su historial.
      </p>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!nicknameTouched) {
              setNickname(proposeDisplayName(e.target.value));
            }
          }}
          placeholder="Nombre completo"
          required
          disabled={closed || atLimit}
          className="flex-1 rounded-xl border-2 border-amber-800/30 bg-white/80 px-3 py-2 disabled:opacity-50"
        />
        <input
          value={nickname}
          onChange={(e) => {
            setNicknameTouched(true);
            setNickname(e.target.value);
          }}
          placeholder="Nombre visible"
          title="Nombre que verán sus compañeros en el juego"
          disabled={closed || atLimit}
          className="w-36 rounded-xl border-2 border-amber-800/30 bg-white/80 px-3 py-2 font-bold disabled:opacity-50"
        />
        <input
          type="date"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          disabled={closed || atLimit}
          title="Fecha de nacimiento (opcional)"
          className="rounded-xl border-2 border-amber-800/30 bg-white/80 px-3 py-2 disabled:opacity-50"
        />
        <button disabled={busy || closed || atLimit} className="rounded-xl bg-emerald-600 text-white font-bold px-4 py-2 disabled:opacity-50">
          Inscribir
        </button>
      </form>
      {error && <p className="text-sm font-bold text-rose-700 mt-2">⚠️ {error}</p>}
      {result && (
        <p className="mt-3 rounded-xl bg-emerald-100 border border-emerald-400 px-3 py-2 text-sm">
          ✅ {result.name} quedó inscripto/a. Su código para entrar al juego es{" "}
          <b className="font-mono text-lg">{result.code}</b>
        </p>
      )}
    </Panel>
  );
}
