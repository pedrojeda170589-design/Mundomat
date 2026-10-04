// Pruebas de la base (RLS, promoción, historial, cierre de ciclo).
// Corren contra un Postgres con las migraciones aplicadas:
//   DATABASE_URL=postgres://postgres@/mt?host=/tmp/pg&port=54322 node --test supabase/tests/db.test.mjs
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import pg from "pg";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
const U = {}; // usuarios de prueba (id)

// Ejecuta `fn` como un usuario con sesión (rol authenticated + su JWT),
// como lo haría el navegador a través de Supabase.
async function as(userId, sql, params = []) {
  await client.query("begin");
  try {
    if (userId === "anon") {
      await client.query("set local role anon");
    } else {
      await client.query("set local role authenticated");
      await client.query("select set_config('request.jwt.claims', $1, true)", [
        JSON.stringify({ sub: userId, role: "authenticated" }),
      ]);
    }
    const r = await client.query(sql, params);
    await client.query("commit");
    return r.rows;
  } catch (e) {
    await client.query("rollback");
    throw e;
  }
}
const sys = async (sql, params = []) => (await client.query(sql, params)).rows;
const one = async (...a) => (await sys(...a))[0];

async function mkUser(key, email) {
  const r = await one("insert into auth.users (email) values ($1) returning id", [email]);
  U[key] = r.id;
}

let A, B, A3A, A3B, A4A, A3A27, B5A, B3A;
let alumnoTest, otroAlumno, alumnoA3B;

before(async () => {
  await client.connect();
  for (const [k, e] of [
    ["super", "super@test"],
    ["adminA", "admin.a@test"],
    ["adminB", "admin.b@test"],
    ["pedro", "pedro@test"],
    ["maria", "maria@test"],
    ["docenteB", "docente.b@test"],
    ["alumnoUser", "alumno1@test"],
    ["alumnoUser2", "alumno2@test"],
    ["nadie", "nadie@test"],
  ])
    await mkUser(k, e);
  await sys("insert into public.user_roles (user_id, role) values ($1, 'super_admin')", [U.super]);

  // El super admin crea las escuelas (no hay nada hardcodeado).
  A = (await as(U.super, "select (public.create_school('Escuela A', 'ESC-A')).id"))[0].id;
  B = (await as(U.super, "select (public.create_school('Escuela B', 'ESC-B')).id"))[0].id;
  await sys("insert into public.user_roles (user_id, role, school_id) values ($1,'school_admin',$2),($3,'school_admin',$4)", [
    U.adminA, A, U.adminB, B,
  ]);
  // La dirección crea aulas y asigna docentes.
  const cc = async (admin, school, grade, div, year) =>
    (await as(admin, "select (public.create_classroom($1,$2,$3,$4)).id", [school, grade, div, year]))[0].id;
  A3A = await cc(U.adminA, A, 3, "A", 2026);
  A3B = await cc(U.adminA, A, 3, "B", 2026);
  A4A = await cc(U.adminA, A, 4, "A", 2027);
  A3A27 = await cc(U.adminA, A, 3, "A", 2027);
  B5A = await cc(U.adminB, B, 5, "A", 2028);
  B3A = await cc(U.adminB, B, 3, "A", 2026);
  await as(U.adminA, "select public.assign_teacher($1, 'pedro@test')", [A3A]);
  await as(U.adminA, "select public.assign_teacher($1, 'maria@test')", [A3B]);
  await as(U.adminB, "select public.assign_teacher($1, 'docente.b@test')", [B3A]);

  // Pedro inscribe alumnos en su aula; María en la suya.
  alumnoTest = (await as(U.pedro, "select * from public.enroll_new_student($1, 'Alumno Test', '2018-05-10')", [A3A]))[0];
  otroAlumno = (await as(U.pedro, "select * from public.enroll_new_student($1, 'Otro Alumno')", [A3A]))[0];
  alumnoA3B = (await as(U.maria, "select * from public.enroll_new_student($1, 'Alumna de 3B')", [A3B]))[0];
  await as(U.docenteB, "select public.enroll_new_student($1, 'Alumno Escuela B')", [B3A]);
  // Cuentas propias de dos alumnos (para probar el aislamiento entre alumnos).
  await sys("update public.students set user_id = $1 where id = $2", [U.alumnoUser, alumnoTest.id]);
  await sys("update public.students set user_id = $1 where id = $2", [U.alumnoUser2, otroAlumno.id]);

  // Resultados 2026 (los escribe el servidor del juego).
  for (let i = 0; i < 4; i++) {
    await sys(
      "insert into public.activity_results (client_id, student_id, world_id, subject, correct, incorrect, time_spent_seconds) values ($1,$2,1,'matematica',$3,$4,30)",
      [`t26-${i}`, alumnoTest.id, i < 3 ? 1 : 0, i < 3 ? 0 : 1]
    );
  }
  await sys(
    "insert into public.activity_results (client_id, student_id, world_id, subject, correct, incorrect) values ('t26-lengua', $1, 20, 'lengua', 1, 0)",
    [alumnoTest.id]
  );
  await sys("insert into public.activity_results (client_id, student_id, world_id, subject, correct, incorrect) values ('otro-1',$1,1,'matematica',1,0)", [otroAlumno.id]);
  await sys("insert into public.activity_results (client_id, student_id, world_id, subject, correct, incorrect) values ('3b-1',$1,1,'matematica',1,0)", [alumnoA3B.id]);
  await sys("insert into public.world_attempts (client_id, student_id, world_id, subject, correct_count, total, score_pct, outcome) values ('wa-1',$1,1,'matematica',9,10,90,'pending-retry')", [alumnoTest.id]);
  await sys("insert into public.achievements (student_id, kind, code) values ($1, 'medalla', 'bronce')", [alumnoTest.id]);
});

after(async () => {
  await client.end();
});

// ---------------- Seguridad ----------------
test("Caso 1: Pedro ve su aula 3.º A y sus alumnos", async () => {
  const cls = await as(U.pedro, "select id, name from public.classrooms");
  assert.deepEqual(cls.map((c) => c.id), [A3A]);
  const st = await as(U.pedro, "select full_name from public.students order by full_name");
  assert.deepEqual(st.map((s) => s.full_name), ["Alumno Test", "Otro Alumno"]);
  const res = await as(U.pedro, "select count(*)::int n from public.activity_results");
  assert.equal(res[0].n, 6);
});

test("Caso 2: Pedro NO accede a 3.º B aunque conozca el id", async () => {
  assert.equal((await as(U.pedro, "select * from public.classrooms where id = $1", [A3B])).length, 0);
  assert.equal((await as(U.pedro, "select * from public.students where id = $1", [alumnoA3B.id])).length, 0);
  assert.equal(
    (await as(U.pedro, "select * from public.activity_results where classroom_id = $1", [A3B])).length,
    0
  );
  await assert.rejects(as(U.pedro, "select public.enroll_new_student($1, 'Intruso')", [A3B]), /No autorizado/);
  await assert.rejects(as(U.pedro, "select public.move_students($1, $2, 'moved')", [[alumnoA3B.id], A3A]), /No autorizado/);
  // Tampoco puede asignarse a sí mismo al aula.
  await assert.rejects(
    as(U.pedro, "insert into public.teacher_classrooms (teacher_id, classroom_id) values ($1, $2)", [U.pedro, A3B]),
    /row-level security/
  );
});

test("Caso 3: Pedro NO accede a la Escuela B", async () => {
  assert.equal((await as(U.pedro, "select * from public.schools where id = $1", [B])).length, 0);
  assert.equal((await as(U.pedro, "select * from public.classrooms where school_id = $1", [B])).length, 0);
  const schools = await as(U.pedro, "select id from public.schools");
  assert.deepEqual(schools.map((s) => s.id), [A]);
});

test("Caso 4: un alumno NO ve a otro alumno", async () => {
  const st = await as(U.alumnoUser, "select id from public.students");
  assert.deepEqual(st.map((s) => s.id), [alumnoTest.id]);
  const res = await as(U.alumnoUser, "select distinct student_id from public.activity_results");
  assert.deepEqual(res.map((r) => r.student_id), [alumnoTest.id]);
  assert.equal((await as(U.alumnoUser2, "select * from public.activity_results where student_id = $1", [alumnoTest.id])).length, 0);
  // Y no puede modificar su propia ficha ni la de otros.
  const upd = await as(U.alumnoUser, "update public.students set full_name = 'X' returning id");
  assert.equal(upd.length, 0);
});

test("Caso 5: la dirección de la Escuela A NO accede a la Escuela B", async () => {
  assert.equal((await as(U.adminA, "select * from public.classrooms where school_id = $1", [B])).length, 0);
  assert.equal((await as(U.adminA, "select * from public.schools where id = $1", [B])).length, 0);
  await assert.rejects(as(U.adminA, "select public.create_classroom($1, 4, 'Z', 2026)", [B]), /No autorizado/);
  await assert.rejects(as(U.adminA, "select public.assign_teacher($1, 'pedro@test')", [B3A]), /No autorizado/);
  await assert.rejects(as(U.adminA, "select public.close_school_year($1, 2026)", [B]), /No autorizado/);
  // Sí ve toda su escuela.
  const cls = await as(U.adminA, "select id from public.classrooms");
  assert.equal(cls.length, 4);
});

test("Super admin ve todo; visitantes sin sesión no ven nada; sin rol no ve nada", async () => {
  assert.equal((await as(U.super, "select * from public.schools")).length, 2);
  await assert.rejects(as("anon", "select * from public.students"), /permission denied/);
  assert.equal((await as(U.nadie, "select * from public.students")).length, 0);
  assert.equal((await as(U.nadie, "select * from public.classrooms")).length, 0);
  await assert.rejects(as(U.adminA, "select public.create_school('X', 'ESC-X')"), /No autorizado/);
});

test("Nadie modifica resultados desde la app; el historial es inmutable", async () => {
  const upd = await as(U.pedro, "update public.activity_results set correct = 99 returning id");
  assert.equal(upd.length, 0); // RLS: no hay política de escritura
  await assert.rejects(as(U.pedro, "insert into public.activity_results (client_id, student_id, world_id, subject) values ('x', $1, 1, 'matematica')", [alumnoTest.id]), /row-level security/);
  // Ni siquiera el servidor puede cambiarlo o borrarlo.
  await assert.rejects(sys("update public.activity_results set correct = 5 where client_id = 't26-0'"), /no se puede modificar/);
  await assert.rejects(sys("delete from public.activity_results"), /no se puede modificar/);
  await assert.rejects(sys("delete from public.student_enrollments"), /no se puede modificar/);
  // El resultado repetido (reintento / sincronización) no se duplica.
  await assert.rejects(
    sys("insert into public.activity_results (client_id, student_id, world_id, subject) values ('t26-0', $1, 1, 'matematica')", [alumnoTest.id]),
    /duplicate key/
  );
  // El cliente no puede falsear el contexto (aula/ciclo): lo pone la base.
  await sys(
    "insert into public.activity_results (client_id, student_id, world_id, subject, classroom_id, school_year) values ('fake-ctx', $1, 1, 'matematica', $2, 1999)",
    [alumnoTest.id, B3A]
  );
  const r = await one("select classroom_id, school_year from public.activity_results where client_id = 'fake-ctx'");
  assert.equal(r.classroom_id, A3A);
  assert.equal(r.school_year, 2026);
});

test("Un docente no cambia grado/escuela de su aula; sí sus mundos habilitados", async () => {
  await assert.rejects(as(U.pedro, "update public.classrooms set grade = 7 where id = $1", [A3A]), /dirección/);
  const ok = await as(U.pedro, "update public.classrooms set enabled_world_ids = '{1,2,3}' where id = $1 returning enabled_world_ids", [A3A]);
  assert.deepEqual(ok[0].enabled_world_ids, [1, 2, 3]);
  const no = await as(U.pedro, "update public.classrooms set enabled_world_ids = '{1}' where id = $1 returning id", [A3B]);
  assert.equal(no.length, 0);
});

// ---------------- Promoción y trayectoria (prueba crítica) ----------------
test("Prueba crítica: promoción 3.º A 2026 → 4.º A 2027 y traslado a Escuela B 5.º A 2028", async () => {
  // Cierre del ciclo 2026 en la Escuela A: no entran resultados nuevos.
  await as(U.adminA, "select public.close_school_year($1, 2026)", [A]);
  await assert.rejects(
    sys("insert into public.activity_results (client_id, student_id, world_id, subject) values ('late', $1, 1, 'matematica')", [alumnoTest.id]),
    /cerrado/
  );
  const noEdit = await as(U.pedro, "update public.classrooms set enabled_world_ids = '{1}' where id = $1 returning id", [A3A]);
  assert.equal(noEdit.length, 0);

  // Validaciones de promoción.
  await assert.rejects(as(U.adminA, "select public.move_students($1, $2, 'promoted')", [[alumnoTest.id], A3A27]), /grado mayor/);
  await assert.rejects(as(U.maria, "select public.move_students($1, $2, 'promoted')", [[alumnoTest.id], A4A]), /No autorizado/);

  // Pedro promueve a su alumno (masivo: puede ir un grupo).
  const n = await as(U.pedro, "select public.move_students($1, $2, 'promoted') n", [[alumnoTest.id], A4A]);
  assert.equal(n[0].n, 1);
  const ids = await sys("select count(distinct id)::int n from public.students where full_name = 'Alumno Test'");
  assert.equal(ids[0].n, 1, "no se crea otro alumno");
  const tray = await sys("select school_year, grade, division, status from public.student_enrollments where student_id = $1 order by start_date, created_at", [alumnoTest.id]);
  assert.deepEqual(tray.map((t) => `${t.school_year} ${t.grade}${t.division} ${t.status}`), ["2026 3A promoted", "2027 4A active"]);

  // Nuevo resultado en 2027: queda en 4.º A; lo de 2026 sigue en 3.º A.
  await sys("insert into public.activity_results (client_id, student_id, world_id, subject, correct, incorrect) values ('t27-1', $1, 3, 'matematica', 1, 0)", [alumnoTest.id]);
  const byYear = await sys("select school_year, classroom_id, count(*)::int n from public.activity_results where student_id = $1 group by 1,2 order by 1", [alumnoTest.id]);
  assert.deepEqual(byYear.map((r) => [r.school_year, r.classroom_id]), [[2026, A3A], [2027, A4A]]);

  // Perfil y avatar intactos.
  const s = await one("select access_code, full_name from public.students where id = $1", [alumnoTest.id]);
  assert.equal(s.access_code, alumnoTest.access_code);

  // Pedro todavía no es docente de 4.º A: ve su 2026 (3.º A) pero no 2027.
  const pedroRes = await as(U.pedro, "select distinct school_year from public.activity_results where student_id = $1", [alumnoTest.id]);
  assert.deepEqual(pedroRes.map((r) => r.school_year), [2026]);

  // Le asignan 4.º A: ve 3.º A y 4.º A, cada aula con lo suyo.
  await as(U.adminA, "select public.assign_teacher($1, 'pedro@test')", [A4A]);
  const cls = await as(U.pedro, "select id from public.classrooms order by school_year");
  assert.deepEqual(cls.map((c) => c.id), [A3A, A4A]);
  const in4 = await as(U.pedro, "select distinct student_id from public.student_enrollments where classroom_id = $1", [A4A]);
  assert.deepEqual(in4.map((r) => r.student_id), [alumnoTest.id]);
  // Evolución por área (vista): 2026 y 2027 por separado.
  const evo = await as(U.pedro, "select school_year, accuracy_pct from public.student_subject_year_stats where student_id = $1 and subject = 'matematica' order by school_year", [alumnoTest.id]);
  assert.deepEqual(evo.map((e) => e.school_year), [2026, 2027]);
  assert.equal(evo[0].accuracy_pct, 75); // 3 correctas de 4 respuestas

  // Traslado a la Escuela B (lo hace la escuela que recibe, con el código).
  await assert.rejects(as(U.adminA, "select public.transfer_student($1, $2)", [alumnoTest.access_code, B5A]), /No autorizado/);
  await as(U.adminB, "select public.transfer_student($1, $2)", [alumnoTest.access_code, B5A]);
  const tray2 = await sys("select school_id, school_year, grade, status from public.student_enrollments where student_id = $1 order by created_at", [alumnoTest.id]);
  assert.deepEqual(tray2.map((t) => `${t.school_year} ${t.grade} ${t.status}`), ["2026 3 promoted", "2027 4 transferred", "2028 5 active"]);

  // La Escuela B (actual) ve toda la trayectoria y la evolución.
  const bSees = await as(U.adminB, "select distinct school_year from public.activity_results where student_id = $1 order by 1", [alumnoTest.id]);
  assert.deepEqual(bSees.map((r) => r.school_year), [2026, 2027]);
  // La Escuela A conserva lo de su período, pero no ve lo nuevo de B.
  await sys("insert into public.activity_results (client_id, student_id, world_id, subject, correct) values ('t28-1', $1, 5, 'matematica', 1)", [alumnoTest.id]);
  const aSees = await as(U.adminA, "select distinct school_year from public.activity_results where student_id = $1 order by 1", [alumnoTest.id]);
  assert.deepEqual(aSees.map((r) => r.school_year), [2026, 2027]);
  const aEnr = await as(U.adminA, "select school_year from public.student_enrollments where student_id = $1 order by 1", [alumnoTest.id]);
  assert.deepEqual(aEnr.map((r) => r.school_year), [2026, 2027]);
  // Pedro ya no puede promoverlo ni moverlo.
  await assert.rejects(as(U.pedro, "select public.move_students($1, $2, 'moved')", [[alumnoTest.id], A4A]), /escuela|No autorizado/);
  // Logros y resultados de 2026 intactos.
  const ach = await sys("select count(*)::int n from public.achievements where student_id = $1", [alumnoTest.id]);
  assert.equal(ach[0].n, 1);
  const r26 = await sys("select count(*)::int n from public.activity_results where student_id = $1 and school_year = 2026 and classroom_id = $2", [alumnoTest.id, A3A]);
  assert.equal(r26[0].n, 6);
});

test("Casos especiales: permanencia, cambio de división y de docente", async () => {
  // Permanencia: 3.º A 2026 → 3.º A 2027.
  await as(U.adminA, "select public.move_students($1, $2, 'repeated')", [[otroAlumno.id], A3A27]);
  const t = await sys("select grade, school_year, status from public.student_enrollments where student_id = $1 order by created_at", [otroAlumno.id]);
  assert.deepEqual(t.map((r) => `${r.school_year}-${r.grade}-${r.status}`), ["2026-3-repeated", "2027-3-active"]);
  await assert.rejects(as(U.adminA, "select public.move_students($1, $2, 'repeated')", [[alumnoA3B.id], A4A]), /mismo grado/);

  // Cambio de división en el mismo ciclo: 3.º B → 3.º A (2026 está cerrado).
  await assert.rejects(as(U.adminA, "select public.move_students($1, $2, 'moved')", [[alumnoA3B.id], A3A]), /cerrado/);
  await as(U.super, "select public.reopen_school_year($1, 2026)", [A]);
  await as(U.adminA, "select public.move_students($1, $2, 'moved')", [[alumnoA3B.id], A3A]);
  const t2 = await sys("select classroom_id, status from public.student_enrollments where student_id = $1 order by created_at", [alumnoA3B.id]);
  assert.deepEqual(t2.map((r) => [r.classroom_id, r.status]), [[A3B, "moved"], [A3A, "active"]]);
  // Su resultado viejo sigue siendo de 3.º B.
  const r = await one("select classroom_id from public.activity_results where client_id = '3b-1'");
  assert.equal(r.classroom_id, A3B);
  // María (3.º B) lo sigue viendo en su período; Pedro (3.º A) lo tiene hoy.
  assert.equal((await as(U.maria, "select * from public.activity_results where client_id = '3b-1'")).length, 1);
  assert.equal((await as(U.pedro, "select * from public.students where id = $1", [alumnoA3B.id])).length, 1);

  // Cambio de docente: sacan a Pedro de 3.º A; entra María. El historial queda.
  const before = await sys("select count(*)::int n from public.activity_results where classroom_id = $1", [A3A]);
  await as(U.adminA, "select public.unassign_teacher($1, $2)", [A3A, U.pedro]);
  await as(U.adminA, "select public.assign_teacher($1, 'maria@test')", [A3A]);
  assert.equal((await as(U.pedro, "select * from public.classrooms where id = $1", [A3A])).length, 0);
  const mariaSees = await as(U.maria, "select count(*)::int n from public.activity_results where classroom_id = $1", [A3A]);
  assert.equal(mariaSees[0].n, before[0].n);
  // Una inscripción cerrada no se puede reabrir ni mover.
  await assert.rejects(sys("update public.student_enrollments set status = 'active' where student_id = $1 and status = 'moved'", [alumnoA3B.id]), /cerrada/);
  await assert.rejects(sys("update public.student_enrollments set classroom_id = $2 where student_id = $1 and status = 'active'", [alumnoA3B.id, A3B]), /no se modifica/);
});

test("Baja: el alumno sale de la escuela y conserva su historial", async () => {
  const s = (await as(U.adminB, "select id from public.students where full_name = 'Alumno Escuela B'"))[0];
  await assert.rejects(as(U.adminA, "select public.withdraw_student($1)", [s.id]), /No autorizado/);
  await as(U.adminB, "select public.withdraw_student($1)", [s.id]);
  const e = await sys("select status from public.student_enrollments where student_id = $1", [s.id]);
  assert.deepEqual(e.map((r) => r.status), ["withdrawn"]);
});

test("Legajo: trayectoria y resumen de aula respetan los permisos", async () => {
  // La Escuela B (actual) ve la trayectoria completa, con nombres de escuela.
  const tb = await as(U.adminB, "select school_year, grade, school_name, status from public.student_trajectory($1)", [alumnoTest.id]);
  assert.deepEqual(tb.map((t) => `${t.school_year}-${t.grade}-${t.school_name}-${t.status}`), [
    "2026-3-Escuela A-promoted", "2027-4-Escuela A-transferred", "2028-5-Escuela B-active",
  ]);
  // La Escuela A solo ve su parte.
  const ta = await as(U.adminA, "select school_year from public.student_trajectory($1)", [alumnoTest.id]);
  assert.deepEqual(ta.map((t) => t.school_year), [2026, 2027]);
  // Alguien sin relación: nada.
  assert.equal((await as(U.nadie, "select * from public.student_trajectory($1)", [alumnoTest.id])).length, 0);
  // Resumen de aula: solo para quien puede ver el aula.
  await assert.rejects(as(U.docenteB, "select * from public.classroom_overview($1)", [A3A]), /No autorizado/);
  const ov = await as(U.maria, "select distinct full_name from public.classroom_overview($1) order by 1", [A3A]);
  assert.ok(ov.some((r) => r.full_name === "Alumno Test")); // promovido desde 3.º A: queda en el listado del aula
  await assert.rejects(as(U.maria, "select * from public.classroom_teachers($1)", [B3A]), /No autorizado/);
  await assert.rejects(as(U.adminA, "select public.assign_school_admin($1, 'maria@test')", [B]), /No autorizado/);
  // Destinos de promoción: solo aulas de la misma escuela, ciclo igual o posterior.
  const targets = await as(U.maria, "select school_year, grade, division from public.promotion_targets($1)", [A3A]);
  assert.ok(targets.every((t) => t.school_year >= 2026));
  assert.ok(targets.some((t) => t.school_year === 2027 && t.grade === 4));
  await assert.rejects(as(U.docenteB, "select * from public.promotion_targets($1)", [A3A]), /No autorizado/);
});

test("Directivo y planes (AG-12): resumen multi-aula, comparación por grado y permisos", async () => {
  // 1. Directivo de Escuela A (adminA) ve todas las aulas de su escuela
  const summaryAdminA = await as(U.adminA, "select classroom_id, classroom_name, grade, division from public.school_classrooms_summary($1)", [A]);
  assert.ok(summaryAdminA.length >= 2, "Directivo ve todas las aulas de Escuela A");

  // 2. Directivo de Escuela A NO puede ver aulas de Escuela B
  await assert.rejects(as(U.adminA, "select * from public.school_classrooms_summary($1)", [B]), /No autorizado/);

  // 3. Usuario ajeno no puede consultar resumen de la escuela
  await assert.rejects(as(U.nadie, "select * from public.school_classrooms_summary($1)", [A]), /No autorizado/);

  // 4. Comparación de grado: solo directivo de la escuela o super admin
  const compAdminA = await as(U.adminA, "select * from public.school_grade_comparison($1, 3::smallint)", [A]);
  assert.ok(Array.isArray(compAdminA), "Directivo puede comparar aulas del mismo grado");

  // Docente o usuario sin rol de directivo es rechazado en comparación
  await assert.rejects(as(U.docenteB, "select * from public.school_grade_comparison($1, 3::smallint)", [A]), /No autorizado/);

  // 5. Planes de escuela
  const planDefault = await as(U.adminA, "select public.school_active_plan($1) as p", [A]);
  assert.equal(planDefault[0].p, "piloto_gratuito");

  // Super admin asigna plan escuela
  await as(U.super, "select public.assign_school_plan($1, 'escuela', 500, '2027-12-31'::date)", [A]);
  const planUpdated = await as(U.adminA, "select public.school_active_plan($1) as p", [A]);
  assert.equal(planUpdated[0].p, "escuela");

  // Usuario no super-admin no puede asignar plan
  await assert.rejects(as(U.adminA, "select public.assign_school_plan($1, 'distrito')", [A]), /No autorizado/);
});

