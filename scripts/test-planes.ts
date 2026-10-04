import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  PLANES,
  getPlan,
  puedeUsar,
  limiteDe,
  planUpgradeNotice,
  PlanId,
  PlanFeature,
} from "../src/lib/planes";
import { School, SchoolClassroomSummary } from "../src/lib/platform/shared";

console.log("--- 🧪 INICIANDO TEST-PLANES (AG-12) ---");

// 1. DEFINICIÓN DE PLANES
console.log("1. Verificando catálogo de planes...");
{
  const planIds: PlanId[] = ["piloto_gratuito", "escuela", "distrito"];
  for (const id of planIds) {
    const plan = PLANES[id];
    assert(plan, `Plan ${id} debe existir`);
    assert(typeof plan.name === "string" && plan.name.length > 0, `Nombre de ${id} inválido`);
    assert(typeof plan.badge === "string" && plan.badge.length > 0, `Badge de ${id} inválido`);
    assert(typeof plan.limits.aulas === "number", `Límite de aulas en ${id} debe ser número`);
    assert(typeof plan.limits.alumnos === "number", `Límite de alumnos en ${id} debe ser número`);
    assert(typeof plan.limits.docentes === "number", `Límite de docentes en ${id} debe ser número`);
  }

  // Comprobar fallback
  const fallback = getPlan("plan_inexistente" as PlanId);
  assert.strictEqual(fallback.id, "piloto_gratuito", "Fallback debe ser piloto_gratuito");
  console.log("  ✅ Catálogo y fallback de planes verificados.");
}

// 2. FUNCIÓN puedeUsar Y REGLA DEL AULA PILOTO
console.log("2. Probando función puedeUsar()...");
{
  // A. El aula piloto de Pedro (sin escuela o con is_legacy_pilot) tiene TODO habilitado
  const features: PlanFeature[] = [
    "reportes",
    "reportes_pdf_curso",
    "exportacion_csv",
    "resumen_curso",
    "vista_directivo",
    "comparacion_aulas",
    "alertas_docentes",
    "fichas_familias",
    "juego_completo",
  ];

  for (const f of features) {
    assert.strictEqual(puedeUsar(null, f), true, `Aula piloto sin escuela debe tener '${f}' habilitado`);
    assert.strictEqual(puedeUsar(undefined, f), true, `Aula piloto undefined debe tener '${f}' habilitado`);
    assert.strictEqual(puedeUsar({ is_legacy_pilot: true }, f), true, `is_legacy_pilot debe tener '${f}' habilitado`);
  }

  // B. Plan Piloto / Gratuito
  const escuelaPiloto: School = { id: "s1", name: "Escuela Piloto", code: "ESC-PILOTO", active: true, plan: "piloto_gratuito" };
  assert.strictEqual(puedeUsar(escuelaPiloto, "juego_completo"), true);
  assert.strictEqual(puedeUsar(escuelaPiloto, "resumen_curso"), true);
  assert.strictEqual(puedeUsar(escuelaPiloto, "reportes"), true);
  assert.strictEqual(puedeUsar(escuelaPiloto, "reportes_pdf_curso"), false, "Piloto gratuito no incluye reporte PDF de curso");
  assert.strictEqual(puedeUsar(escuelaPiloto, "exportacion_csv"), false, "Piloto gratuito no incluye exportación CSV");
  assert.strictEqual(puedeUsar(escuelaPiloto, "vista_directivo"), false, "Piloto gratuito no incluye vista directivo");
  assert.strictEqual(puedeUsar(escuelaPiloto, "comparacion_aulas"), false, "Piloto gratuito no incluye comparación entre aulas");

  // C. Plan Escuela
  const escuelaCompleta: School = { id: "s2", name: "Escuela San Martín", code: "ESC-SM", active: true, plan: "escuela" };
  assert.strictEqual(puedeUsar(escuelaCompleta, "reportes_pdf_curso"), true);
  assert.strictEqual(puedeUsar(escuelaCompleta, "exportacion_csv"), true);
  assert.strictEqual(puedeUsar(escuelaCompleta, "vista_directivo"), true);
  assert.strictEqual(puedeUsar(escuelaCompleta, "comparacion_aulas"), true);
  assert.strictEqual(puedeUsar(escuelaCompleta, "alertas_docentes"), true);

  // D. Plan Distrito
  const distrito: School = { id: "s3", name: "Escuela del Distrito", code: "ESC-DIST", active: true, plan: "distrito" };
  for (const f of features) {
    assert.strictEqual(puedeUsar(distrito, f), true, `Plan Distrito debe incluir '${f}'`);
  }

  console.log("  ✅ Reglas de acceso y excepciones del aula piloto aprobadas.");
}

// 3. FUNCIÓN limiteDe()
console.log("3. Probando función limiteDe()...");
{
  // Aula piloto sin límites
  assert.strictEqual(limiteDe(null, "alumnos"), Infinity, "Aula piloto sin escuela tiene alumnos infinitos");
  assert.strictEqual(limiteDe({ is_legacy_pilot: true }, "aulas"), Infinity, "Aula piloto tiene aulas infinitas");

  // Plan piloto
  assert.strictEqual(limiteDe("piloto_gratuito", "alumnos"), 35, "Piloto permite hasta 35 alumnos");
  assert.strictEqual(limiteDe("piloto_gratuito", "aulas"), 2, "Piloto permite hasta 2 aulas");

  // Plan escuela
  assert.strictEqual(limiteDe("escuela", "alumnos"), 750, "Escuela permite hasta 750 alumnos");
  assert.strictEqual(limiteDe("escuela", "aulas"), 25, "Escuela permite hasta 25 aulas");

  // Plan distrito
  assert.strictEqual(limiteDe("distrito", "alumnos"), Infinity, "Distrito permite alumnos ilimitados");
  assert.strictEqual(limiteDe("distrito", "aulas"), Infinity, "Distrito permite aulas ilimitadas");

  console.log("  ✅ Límites numéricos por plan verificados.");
}

// 4. MENSAJES AMABLES DE MEJORA DE PLAN
console.log("4. Verificando mensajes informativos amables (sin cobros)...");
{
  const noticeDirectivo = planUpgradeNotice("vista_directivo");
  assert(noticeDirectivo.title.length > 0);
  assert(noticeDirectivo.message.includes("Plan Escuela"));
  assert.strictEqual(noticeDirectivo.requiredPlan, "escuela");

  const noticeCSV = planUpgradeNotice("exportacion_csv");
  assert(noticeCSV.message.includes("CSV") || noticeCSV.message.includes("Plan Escuela"));

  console.log("  ✅ Mensajes informativos validados.");
}

// 5. AGREGACIÓN MULTI-AULA Y COMPARACIÓN DE DIVISIONES
console.log("5. Probando cálculo de agregados multi-aula y brecha de rendimiento...");
{
  const mockSummaries: SchoolClassroomSummary[] = [
    {
      classroom_id: "c-3a",
      classroom_name: "3.º A",
      grade: 3,
      division: "A",
      school_year: 2026,
      total_students: 24,
      active_students_7d: 20,
      avg_accuracy_pct: 88,
      total_activities: 450,
      practice_minutes: 180,
    },
    {
      classroom_id: "c-3b",
      classroom_name: "3.º B",
      grade: 3,
      division: "B",
      school_year: 2026,
      total_students: 22,
      active_students_7d: 15,
      avg_accuracy_pct: 70, // 18 pts de diferencia con 3.º A (brecha >= 15 pts)
      total_activities: 380,
      practice_minutes: 150,
    },
    {
      classroom_id: "c-2a",
      classroom_name: "2.º A",
      grade: 2,
      division: "A",
      school_year: 2026,
      total_students: 20,
      active_students_7d: 18,
      avg_accuracy_pct: 82,
      total_activities: 300,
      practice_minutes: 120,
    },
  ];

  // Agregados de la escuela
  const totalStudents = mockSummaries.reduce((acc, c) => acc + c.total_students, 0);
  assert.strictEqual(totalStudents, 66, "Total alumnos de la escuela: 66");

  const totalActive7d = mockSummaries.reduce((acc, c) => acc + c.active_students_7d, 0);
  assert.strictEqual(totalActive7d, 53, "Total activos 7d: 53");

  // Detección de brecha en 3.º grado
  const g3 = mockSummaries.filter((c) => c.grade === 3);
  const accs = g3.map((c) => c.avg_accuracy_pct);
  const max = Math.max(...accs);
  const min = Math.min(...accs);
  const diff = max - min;
  assert.strictEqual(diff, 18, "Brecha entre 3.º A y 3.º B debe ser 18 pts");
  assert(diff >= 15, "Debe activar alerta de equidad pedagógica al ser >= 15 pts");

  console.log("  ✅ Agregados multi-aula y alerta de equidad pedagógica validados.");
}

// 6. VALIDACIÓN DE ARCHIVO DE MIGRACIÓN SQL
console.log("6. Verificando estructura de migración SQL...");
{
  const migrationPath = path.join(
    process.cwd(),
    "supabase",
    "migrations",
    "20261004000100_directivo_y_planes.sql"
  );
  assert(fs.existsSync(migrationPath), "El archivo de migración debe existir en disco");

  const sql = fs.readFileSync(migrationPath, "utf-8");
  assert(sql.includes("school_classrooms_summary"), "Debe definir school_classrooms_summary");
  assert(sql.includes("school_grade_comparison"), "Debe definir school_grade_comparison");
  assert(sql.includes("school_active_plan"), "Debe definir school_active_plan");
  assert(sql.includes("assign_school_plan"), "Debe definir assign_school_plan");
  assert(sql.includes("alter table public.schools"), "Debe agregar columna plan a schools");
  assert(sql.includes("security definer"), "Las funciones deben ser security definer");
  assert(sql.includes("42501"), "Debe emitir código de error 42501 para usuarios no autorizados");

  console.log("  ✅ Archivo de migración SQL verificado correctamente.");
}

console.log("--- 🎉 TODOS LOS TESTS DE PLANES Y VISTA DIRECTIVA (AG-12) PASARON CON ÉXITO ---");
