// Migra el aula piloto del juego (Upstash o .data/db.json) a la plataforma
// (Supabase). NO borra ni modifica nada del juego: solo lee y copia.
// Se puede correr varias veces: no duplica (usa códigos e identificadores
// fijos).
//
// Uso (desde la carpeta del proyecto):
//   1) Prueba sin escribir nada:
//      node scripts/migrar-a-plataforma.mjs
//   2) Aplicar:
//      node scripts/migrar-a-plataforma.mjs --aplicar
//
// Variables (en .env.local o en la terminal):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   (plataforma)
//   KV_REST_API_URL, KV_REST_API_TOKEN        (juego; si faltan usa .data/db.json)
//   ESCUELA_NOMBRE, ESCUELA_CODIGO, GRADO, DIVISION, CICLO, DOCENTE_EMAIL
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

// --- .env.local (sin dependencias) ---
const envFile = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const APPLY = process.argv.includes("--aplicar");
const cfg = {
  schoolName: process.env.ESCUELA_NOMBRE,
  schoolCode: (process.env.ESCUELA_CODIGO || "").toUpperCase(),
  grade: Number(process.env.GRADO || 0),
  division: (process.env.DIVISION || "").toUpperCase(),
  year: Number(process.env.CICLO || 0),
  teacherEmail: process.env.DOCENTE_EMAIL,
};
for (const [k, v] of Object.entries({ ESCUELA_NOMBRE: cfg.schoolName, ESCUELA_CODIGO: cfg.schoolCode, GRADO: cfg.grade, CICLO: cfg.year })) {
  if (!v) {
    console.error(`Falta la variable ${k}. Ejemplo:\n  ESCUELA_NOMBRE="Mi Escuela" ESCUELA_CODIGO=MI-ESC GRADO=3 DIVISION=A CICLO=2026 node scripts/migrar-a-plataforma.mjs`);
    process.exit(1);
  }
}
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

// --- Lectura del juego ---
async function readGame() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (url && token) {
    const get = async (key) => {
      const r = await fetch(`${url}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${token}` } });
      const j = await r.json();
      return j.result ? JSON.parse(j.result) : null;
    };
    const students = (await get("students")) ?? [];
    const worldsConfig = await get("worldsConfig");
    const progress = {};
    for (const s of students) progress[s.code] = await get(`progress:${s.code}`);
    return { source: "Upstash", students, worldsConfig, progress };
  }
  const file = path.join(process.cwd(), ".data", "db.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const parse = (v) => (v ? JSON.parse(v) : null);
  const students = parse(raw.students) ?? [];
  const progress = {};
  for (const s of students) progress[s.code] = parse(raw[`progress:${s.code}`]);
  return { source: file, students, worldsConfig: parse(raw.worldsConfig), progress };
}

const game = await readGame();
const pilot = game.students.filter((s) => !s.classroomId);
console.log(`Juego (${game.source}): ${pilot.length} alumnos del aula piloto.`);

// Copia de seguridad de lo leído (por si acaso).
const backupDir = path.join(process.cwd(), "backups");
fs.mkdirSync(backupDir, { recursive: true });
const backupFile = path.join(backupDir, `juego-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
fs.writeFileSync(backupFile, JSON.stringify(game, null, 2));
console.log(`Copia de seguridad: ${backupFile}`);

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const must = (r, what) => {
  if (r.error) throw new Error(`${what}: ${r.error.message}`);
  return r.data;
};

// --- Plan ---
const WORLD_SUBJECT = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "mundos.json"), "utf8"));
let results = 0;
let worldRows = 0;
let achievements = 0;
for (const s of pilot) {
  const p = game.progress[s.code];
  if (!p) continue;
  results += (p.activityLog ?? []).length + Object.keys(p.activitySummary ?? {}).length;
  worldRows += new Set([...(p.completedWorlds ?? []), ...(p.worldsPendingReinforcementRetry ?? []), ...(p.worldsNeedingTeacherReview ?? [])]).size;
  achievements += (p.seasonalCollection ?? []).length + (p.completedWorlds?.length ? 1 : 0);
}
console.log(`Se copiarían: ${pilot.length} alumnos, ${results} resultados, ${worldRows} estados de mundo, ~${achievements} logros.`);
console.log(`Escuela "${cfg.schoolName}" (${cfg.schoolCode}) · ${cfg.grade}.º ${cfg.division} · ciclo ${cfg.year}`);
if (!APPLY) {
  console.log("\nPrueba terminada: no se escribió nada. Para aplicar agregá --aplicar");
  process.exit(0);
}

// --- Escuela, ciclo, aula ---
let school = must(await sb.from("schools").select("*").eq("code", cfg.schoolCode).maybeSingle(), "escuela");
if (!school) school = must(await sb.from("schools").insert({ name: cfg.schoolName, code: cfg.schoolCode }).select().single(), "crear escuela");
must(await sb.from("school_cycles").upsert({ school_id: school.id, school_year: cfg.year }, { onConflict: "school_id,school_year", ignoreDuplicates: true }), "ciclo");
let classroom = must(
  await sb.from("classrooms").select("*").eq("school_id", school.id).eq("school_year", cfg.year).eq("grade", cfg.grade).eq("division", cfg.division).maybeSingle(),
  "aula"
);
if (!classroom) {
  classroom = must(
    await sb.from("classrooms").insert({
      school_id: school.id, school_year: cfg.year, grade: cfg.grade, division: cfg.division,
      name: `${cfg.grade}.º ${cfg.division}`.trim(), is_legacy_pilot: true,
      enabled_world_ids: game.worldsConfig?.enabledWorldIds ?? [1],
    }).select().single(),
    "crear aula"
  );
}
console.log(`Aula: ${classroom.name} (${classroom.id})`);

if (cfg.teacherEmail) {
  const prof = must(await sb.from("profiles").select("id").ilike("email", cfg.teacherEmail).maybeSingle(), "docente");
  if (prof) {
    must(await sb.from("user_roles").upsert({ user_id: prof.id, role: "teacher", school_id: school.id }, { ignoreDuplicates: true }), "rol docente");
    must(await sb.from("user_roles").upsert({ user_id: prof.id, role: "school_admin", school_id: school.id }, { ignoreDuplicates: true }), "rol dirección");
    must(await sb.from("teacher_classrooms").upsert({ teacher_id: prof.id, classroom_id: classroom.id }, { ignoreDuplicates: true }), "asignar docente");
    console.log(`Docente ${cfg.teacherEmail}: asignado al aula (y como dirección de la escuela).`);
  } else {
    console.log(`Aviso: ${cfg.teacherEmail} todavía no tiene cuenta. Registrate en /docente y volvé a correr el script.`);
  }
}

// --- Alumnos, inscripción, historial ---
const birth = (b) => (b && /^\d{4}-\d\d-\d\d$/.test(b) ? b : null);
const mmdd = (b) => (b ? b.slice(-5) : null);
for (const s of pilot) {
  const p = game.progress[s.code] ?? {};
  let st = must(await sb.from("students").select("*").eq("access_code", s.code).maybeSingle(), "alumno");
  const fields = {
    full_name: s.name,
    nickname: p.nickname ?? null,
    avatar: p.avatar ?? null,
    avatar_accessories: p.avatarAccessories ?? null,
    avatar_background: p.avatarBackground ?? null,
    birth_date: birth(s.birthday),
    birthday_mmdd: mmdd(s.birthday),
  };
  if (!st) st = must(await sb.from("students").insert({ access_code: s.code, ...fields }).select().single(), `crear ${s.name}`);
  else must(await sb.from("students").update(fields).eq("id", st.id), `actualizar ${s.name}`);

  const active = must(await sb.from("student_enrollments").select("id").eq("student_id", st.id).eq("status", "active").maybeSingle(), "inscripción");
  if (!active) {
    must(await sb.from("student_enrollments").insert({
      student_id: st.id, classroom_id: classroom.id, school_id: school.id, school_year: cfg.year, grade: cfg.grade,
      start_date: (s.createdAt || new Date().toISOString()).slice(0, 10),
    }), `inscribir ${s.name}`);
  }

  const rows = (p.activityLog ?? []).map((r, i) => ({
    client_id: `legacy-${s.code}-${r.finishedAt}-${r.worldId}-${r.activityIndex}-${i}`.slice(0, 120),
    student_id: st.id,
    world_id: r.worldId,
    subject: WORLD_SUBJECT[r.worldId]?.subject ?? "otra",
    category: WORLD_SUBJECT[r.worldId]?.category ?? null,
    activity_index: r.activityIndex,
    correct: r.correct,
    incorrect: r.incorrect,
    time_spent_seconds: Math.max(0, Math.min(r.timeSpentSeconds ?? 0, 3600)),
    source: "migracion",
    occurred_at: r.finishedAt,
  }));
  for (const [worldId, sum] of Object.entries(p.activitySummary ?? {})) {
    rows.push({
      client_id: `legacy-summary-${s.code}-${worldId}`,
      student_id: st.id,
      world_id: Number(worldId),
      subject: WORLD_SUBJECT[worldId]?.subject ?? "otra",
      category: WORLD_SUBJECT[worldId]?.category ?? null,
      correct: sum.correct,
      incorrect: sum.incorrect,
      attempts: Math.max(1, sum.correct + sum.incorrect),
      time_spent_seconds: sum.timeSpentSeconds,
      source: "migracion-resumen",
    });
  }
  for (let i = 0; i < rows.length; i += 500) {
    must(await sb.from("activity_results").upsert(rows.slice(i, i + 500), { onConflict: "client_id", ignoreDuplicates: true }), "resultados");
  }

  const status = new Map();
  for (const id of p.worldsNeedingTeacherReview ?? []) status.set(id, "needs_review");
  for (const id of p.worldsPendingReinforcementRetry ?? []) status.set(id, "pending_retry");
  for (const id of p.completedWorlds ?? []) status.set(id, "completed");
  const wp = [...status].map(([world_id, st2]) => ({
    student_id: st.id, world_id, status: st2,
    ...(st2 === "completed" ? { completed_school_year: cfg.year, completed_classroom_id: classroom.id } : {}),
  }));
  if (wp.length) must(await sb.from("student_world_progress").upsert(wp, { onConflict: "student_id,world_id" }), "mundos");

  const n = (p.completedWorlds ?? []).length;
  const medal = n >= 10 ? "oro" : n >= 5 ? "plata" : n >= 1 ? "bronce" : null;
  const ach = [
    ...(medal ? [{ student_id: st.id, kind: "medalla", code: medal }] : []),
    ...(p.seasonalCollection ?? []).map((c) => ({ student_id: st.id, kind: "temporada", code: c })),
  ];
  if (ach.length) must(await sb.from("achievements").upsert(ach, { onConflict: "student_id,kind,code", ignoreDuplicates: true }), "logros");
  process.stdout.write(".");
}

// --- Verificación ---
const count = async (table, filter) => {
  let q = sb.from(table).select("*", { count: "exact", head: true });
  q = filter(q);
  const r = await q;
  if (r.error) throw r.error;
  return r.count;
};
const enrolled = await count("student_enrollments", (q) => q.eq("classroom_id", classroom.id).eq("status", "active"));
const res = await count("activity_results", (q) => q.eq("classroom_id", classroom.id));
console.log(`\nListo. Alumnos activos en el aula: ${enrolled}. Resultados en el historial del aula: ${res}.`);
if (enrolled < pilot.length) console.log("Aviso: hay alumnos que ya estaban activos en otra aula (no se movieron).");
