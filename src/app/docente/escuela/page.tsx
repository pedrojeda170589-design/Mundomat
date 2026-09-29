"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PanelShell, { ErrorNote, NotConfigured, Panel, usePanelSession } from "@/components/platform/PanelShell";
import { friendlyError, platform } from "@/lib/platform/client";
import type { Classroom, School } from "@/lib/platform/shared";

interface ClassroomInfo extends Classroom {
  students: number;
  teachers: { teacher_id: string; display_name: string; email: string }[];
}

// Gestión de una escuela (dirección / super admin): aulas por ciclo,
// docentes, cierre de ciclo y traslados. La base rechaza cualquier acción
// sobre otra escuela.
export default function SchoolPage() {
  const router = useRouter();
  const { state } = usePanelSession();
  const [id, setId] = useState<string | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [classrooms, setClassrooms] = useState<ClassroomInfo[]>([]);
  const [cycles, setCycles] = useState<{ school_year: number; status: string }[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setId(new URLSearchParams(window.location.search).get("id"));
  }, []);

  const load = useCallback(async () => {
    if (!id) return;
    const sb = platform();
    const { data: s, error: e } = await sb.from("schools").select("*").eq("id", id).maybeSingle();
    if (e) return setError(e);
    if (!s) return setError(new Error("No tenés acceso a esta escuela."));
    setSchool(s);
    const [{ data: cls }, { data: cyc }] = await Promise.all([
      sb.from("classrooms").select("*").eq("school_id", id).order("school_year", { ascending: false }).order("grade").order("division"),
      sb.from("school_cycles").select("school_year, status").eq("school_id", id).order("school_year", { ascending: false }),
    ]);
    const list = (cls ?? []) as Classroom[];
    const info = await Promise.all(
      list.map(async (c) => {
        const [{ count }, { data: t }] = await Promise.all([
          sb.from("student_enrollments").select("id", { count: "exact", head: true }).eq("classroom_id", c.id).eq("status", "active"),
          sb.rpc("classroom_teachers", { p_classroom: c.id }),
        ]);
        return { ...c, students: count ?? 0, teachers: t ?? [] };
      })
    );
    setClassrooms(info);
    setCycles(cyc ?? []);
  }, [id]);

  useEffect(() => {
    if (state === "anon") router.replace("/docente");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (state === "ready") void load();
  }, [state, load, router]);

  async function act(fn: () => PromiseLike<{ error: unknown }>, ok: string) {
    setMsg(null);
    const { error: e } = await fn();
    if (e) setMsg(`⚠️ ${friendlyError(e)}`);
    else {
      setMsg(`✅ ${ok}`);
      await load();
    }
  }

  if (state === "off") return <PanelShell title="Escuela"><NotConfigured /></PanelShell>;
  const years = [...new Set(classrooms.map((c) => c.school_year))].sort((a, b) => b - a);
  const closed = new Set(cycles.filter((c) => c.status === "closed").map((c) => c.school_year));

  return (
    <PanelShell title={`🏫 ${school?.name ?? "Escuela"}`} subtitle={school ? `Código ${school.code}` : undefined} back={{ href: "/docente", label: "Mis aulas" }}>
      {error ? (
        <Panel><ErrorNote error={error} /></Panel>
      ) : !school ? (
        <Panel>Cargando…</Panel>
      ) : (
        <div className="flex flex-col gap-4">
          {msg && <p className="rounded-xl bg-white/90 px-3 py-2 font-bold text-sm text-slate-800">{msg}</p>}
          <NewClassroom schoolId={school.id} onCreate={(g, d, y) => act(() => platform().rpc("create_classroom", { p_school: school.id, p_grade: g, p_division: d, p_year: y }), "Aula creada.")} />

          {years.map((y) => (
            <Panel key={y}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="font-black text-lg">
                  Ciclo {y} {closed.has(y) ? "🔒 cerrado" : ""}
                </p>
                {!closed.has(y) && (
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Cerrar el ciclo ${y}? Se conserva todo el historial, pero ya no se registran resultados nuevos en ese ciclo. Después podés promover a los alumnos.`))
                        void act(() => platform().rpc("close_school_year", { p_school: school.id, p_year: y }), `Ciclo ${y} cerrado.`);
                    }}
                    className="rounded-lg bg-slate-800 text-white text-xs font-bold px-3 py-1.5"
                  >
                    Cerrar ciclo lectivo
                  </button>
                )}
              </div>
              <ul className="flex flex-col gap-2">
                {classrooms
                  .filter((c) => c.school_year === y)
                  .map((c) => (
                    <ClassroomRow key={c.id} c={c} disabled={closed.has(y)} onAssign={(email) => act(() => platform().rpc("assign_teacher", { p_classroom: c.id, p_email: email }), `Docente asignado a ${c.name}.`)} onUnassign={(t) => act(() => platform().rpc("unassign_teacher", { p_classroom: c.id, p_teacher: t }), "Docente quitado del aula.")} />
                  ))}
              </ul>
            </Panel>
          ))}

          <Transfer classrooms={classrooms.filter((c) => !closed.has(c.school_year))} onTransfer={(code, target) => act(() => platform().rpc("transfer_student", { p_access_code: code, p_target: target }), "Alumno incorporado a la escuela con todo su historial.")} />
        </div>
      )}
    </PanelShell>
  );
}

function NewClassroom({ onCreate }: { schoolId: string; onCreate: (grade: number, division: string, year: number) => void }) {
  const [grade, setGrade] = useState(3);
  const [division, setDivision] = useState("A");
  const [year, setYear] = useState(new Date().getFullYear());
  return (
    <Panel>
      <p className="font-black mb-2">➕ Nueva aula</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreate(grade, division, year);
        }}
        className="flex flex-wrap items-end gap-2 text-sm"
      >
        <label className="flex flex-col">
          Grado
          <input type="number" min={1} max={12} value={grade} onChange={(e) => setGrade(Number(e.target.value))} className="w-20 rounded-lg border px-2 py-1" />
        </label>
        <label className="flex flex-col">
          División
          <input value={division} maxLength={10} onChange={(e) => setDivision(e.target.value)} className="w-20 rounded-lg border px-2 py-1" placeholder="A" />
        </label>
        <label className="flex flex-col">
          Ciclo
          <input type="number" min={2000} max={2100} value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-24 rounded-lg border px-2 py-1" />
        </label>
        <button className="rounded-xl bg-emerald-600 text-white font-bold px-4 py-2">Crear aula</button>
      </form>
    </Panel>
  );
}

function ClassroomRow({
  c,
  disabled,
  onAssign,
  onUnassign,
}: {
  c: ClassroomInfo;
  disabled: boolean;
  onAssign: (email: string) => void;
  onUnassign: (teacherId: string) => void;
}) {
  const [email, setEmail] = useState("");
  return (
    <li className="rounded-xl bg-white/60 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/docente/aula?id=${c.id}`} className="font-black text-base underline decoration-dotted">
          {c.name}
        </Link>
        <span>
          {c.students} {c.students === 1 ? "alumno" : "alumnos"}
        </span>
        {c.is_legacy_pilot && <span className="text-xs rounded bg-amber-200 px-1">aula piloto</span>}
      </div>
      <div className="flex flex-wrap items-center gap-1 mt-1">
        {c.teachers.length === 0 && <span className="text-xs opacity-70">Sin docente asignado.</span>}
        {c.teachers.map((t) => (
          <span key={t.teacher_id} className="rounded-full bg-sky-100 px-2 py-0.5 text-xs">
            👩‍🏫 {t.display_name || t.email}
            <button onClick={() => onUnassign(t.teacher_id)} className="ml-1 text-rose-600" title="Quitar del aula">
              ✕
            </button>
          </span>
        ))}
      </div>
      {!disabled && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) onAssign(email.trim());
            setEmail("");
          }}
          className="flex gap-1 mt-1"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email del docente"
            className="flex-1 rounded-lg border px-2 py-1 text-xs"
          />
          <button className="rounded-lg bg-sky-600 text-white text-xs font-bold px-2">Asignar</button>
        </form>
      )}
    </li>
  );
}

function Transfer({ classrooms, onTransfer }: { classrooms: ClassroomInfo[]; onTransfer: (code: string, target: string) => void }) {
  const [code, setCode] = useState("");
  const [target, setTarget] = useState("");
  return (
    <Panel>
      <p className="font-black mb-1">🚚 Recibir un alumno de otra escuela</p>
      <p className="text-xs mb-2">
        Con el código del alumno (se lo da la familia o la escuela anterior). Conserva su identidad, su avatar y todo su
        historial; la escuela anterior deja de verlo desde hoy.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code && target) onTransfer(code.trim().toUpperCase(), target);
        }}
        className="flex flex-wrap gap-2 text-sm"
      >
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código del alumno" className="rounded-lg border px-2 py-1 font-mono uppercase" />
        <select value={target} onChange={(e) => setTarget(e.target.value)} className="rounded-lg border px-2 py-1">
          <option value="">Aula…</option>
          {classrooms.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.school_year}
            </option>
          ))}
        </select>
        <button className="rounded-xl bg-emerald-600 text-white font-bold px-3 py-1.5">Incorporar</button>
      </form>
    </Panel>
  );
}
