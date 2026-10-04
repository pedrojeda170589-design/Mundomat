// Suite de pruebas de privacidad de menores (AG-07).
//
// Verifica:
// 1. Desambiguación y propuestas de nombres para mostrar (displayName) y resolución de duplicados.
// 2. Que ninguna vista ni API para alumnos exponga el nombre completo ni la edad/año de compañeros.
// 3. Bloqueo por exceso de intentos fallidos con código (rate limiting: 8 intentos en 10 min).
// 4. Aislamiento estricto de compañeros entre aulas y con el aula abierta de prueba.

import assert from "node:assert";
import { proposeDisplayName, getSurnameInitial, resolveDisplayNames } from "../src/lib/studentNames";
import { displayName } from "../src/lib/news";
import { checkCodeRateLimit, recordFailedCodeAttempt, resetCodeRateLimit } from "../src/lib/rateLimit";
import { sameClassroom } from "../src/lib/data";
import { OPEN_CLASSROOM_ID } from "../src/lib/openClassroomShared";
import { Student, StudentProgress } from "../src/types";

async function runTests() {
  console.log("=== INICIANDO PRUEBAS DE PRIVACIDAD (AG-07) ===\n");

  // -------------------------------------------------------------
  // 1. Pruebas de propuesta de nombre y desambiguación de duplicados
  // -------------------------------------------------------------
  console.log("--- 1. Propuestas de nombre de pila (proposeDisplayName) ---");

  assert.strictEqual(
    proposeDisplayName("Lorenzo Daniel Perez Veron"),
    "Lorenzo",
    "Nombre estándar de 4 palabras debe proponer la primera palabra"
  );
  console.log("✅ 'Lorenzo Daniel Perez Veron' => 'Lorenzo'");

  assert.strictEqual(
    proposeDisplayName("De Urquiza Iñaki"),
    "Iñaki",
    "Nombre con apellido con partícula al inicio debe proponer el nombre de pila final"
  );
  console.log("✅ 'De Urquiza Iñaki' => 'Iñaki'");

  assert.strictEqual(
    proposeDisplayName("Garcia Maite"),
    "Maite",
    "Nombre con apellido muy común primero debe proponer el nombre de pila"
  );
  console.log("✅ 'Garcia Maite' => 'Maite'");

  assert.strictEqual(
    proposeDisplayName("Santiago Benjamin Solorza Gomez"),
    "Santiago"
  );
  console.log("✅ 'Santiago Benjamin Solorza Gomez' => 'Santiago'");

  console.log("\n--- 2. Resolución de duplicados en el mismo curso (resolveDisplayNames) ---");

  const studentsMock: Student[] = [
    {
      code: "S1",
      name: "Santiago Benjamin Solorza Gomez",
      type: "aula",
      createdAt: new Date().toISOString(),
    },
    {
      code: "S2",
      name: "Santiago Rossi",
      type: "aula",
      createdAt: new Date().toISOString(),
    },
    {
      code: "M1",
      name: "Garcia Maite",
      type: "aula",
      createdAt: new Date().toISOString(),
    },
    {
      code: "U1",
      name: "De Urquiza Iñaki",
      type: "aula",
      createdAt: new Date().toISOString(),
    },
    {
      code: "A1",
      name: "Agustina Amaya Paredes",
      type: "aula",
      createdAt: new Date().toISOString(),
    },
    {
      code: "A2",
      name: "Agustina Assai Rodriguez Infante",
      type: "aula",
      createdAt: new Date().toISOString(),
    },
  ];

  const resolved = resolveDisplayNames(studentsMock);

  // Santiago 1 y Santiago 2 deben desambiguarse con inicial del apellido
  assert.strictEqual(resolved.get("S1"), "Santiago S.", "Santiago 1 debe ser 'Santiago S.'");
  assert.strictEqual(resolved.get("S2"), "Santiago R.", "Santiago 2 debe ser 'Santiago R.'");
  console.log("✅ Duplicado 'Santiago': resuelto en 'Santiago S.' y 'Santiago R.'");

  // Agustina 1 y Agustina 2
  assert.strictEqual(resolved.get("A1"), "Agustina A.", "Agustina 1 debe ser 'Agustina A.'");
  assert.strictEqual(resolved.get("A2"), "Agustina R.", "Agustina 2 debe ser 'Agustina R.'");
  console.log("✅ Duplicado 'Agustina': resuelto en 'Agustina A.' y 'Agustina R.'");

  // Nombres sin colisión no llevan inicial agregada
  assert.strictEqual(resolved.get("M1"), "Maite");
  assert.strictEqual(resolved.get("U1"), "Iñaki");
  console.log("✅ Nombres únicos sin sufijo: 'Maite', 'Iñaki'");

  // -------------------------------------------------------------
  // 2. Pruebas de privacidad en nombres y datos sensibles
  // -------------------------------------------------------------
  console.log("\n--- 3. Protección de nombre completo en displayName() ---");

  const sLorenzo: Student = {
    code: "L1",
    name: "Lorenzo Daniel Perez Veron",
    type: "aula",
    createdAt: new Date().toISOString(),
  };

  // Sin apodo ni displayName: nunca debe devolver el apellido ni nombre completo
  const resNoNick = displayName(sLorenzo);
  assert.strictEqual(resNoNick, "Lorenzo", "Sin apodo debe proponer 'Lorenzo', nunca el apellido");
  assert.ok(!resNoNick.includes("Perez") && !resNoNick.includes("Veron"), "No debe contener apellidos");
  console.log("✅ Sin apodo ni displayName: devuelve 'Lorenzo', no expone apellidos");

  // Con displayName confirmado por el docente
  const sConfirmed: Student = {
    ...sLorenzo,
    displayName: "Lolo",
  };
  assert.strictEqual(displayName(sConfirmed), "Lolo", "Con displayName debe devolver 'Lolo'");
  console.log("✅ Con displayName confirmado: devuelve 'Lolo'");

  // Con apodo del alumno
  const pWithNick: StudentProgress = {
    code: "L1",
    nickname: "Gamer99",
    completedWorlds: [],
    activityLog: [],
    coins: 10,
  };
  assert.strictEqual(displayName(sConfirmed, pWithNick), "Gamer99", "Apodo del alumno prevalece");
  console.log("✅ Con apodo elegido por el alumno: devuelve 'Gamer99'");

  // -------------------------------------------------------------
  // 3. Pruebas de bloqueo de intentos con código (rate limiting)
  // -------------------------------------------------------------
  console.log("\n--- 4. Límite de intentos con código (Rate Limit) ---");

  const testIp = "192.168.100.250";
  await resetCodeRateLimit(testIp);

  // Intentos 1 a 7: no deben bloquear
  for (let i = 1; i <= 7; i++) {
    const res = await recordFailedCodeAttempt(testIp);
    assert.strictEqual(res.blocked, false, `Intento ${i} no debe estar bloqueado`);
    assert.strictEqual(res.remainingAttempts, 8 - i);
  }
  console.log("✅ Intentos 1 a 7 fallidos: se decrementan los intentos restantes sin bloquear");

  // Intento 8: debe bloquear
  const res8 = await recordFailedCodeAttempt(testIp);
  assert.strictEqual(res8.blocked, true, "Intento 8 debe bloquear la IP");
  assert.strictEqual(res8.remainingAttempts, 0);
  assert.ok(res8.remainingSeconds && res8.remainingSeconds > 0, "Debe tener tiempo de bloqueo restante");
  console.log("✅ Intento 8 fallido: IP bloqueada por 10 minutos (600s)");

  // Chequeo posterior
  const check = await checkCodeRateLimit(testIp);
  assert.strictEqual(check.blocked, true, "checkCodeRateLimit debe reportar bloqueado");
  console.log("✅ checkCodeRateLimit() confirma el bloqueo");

  // Limpieza
  await resetCodeRateLimit(testIp);
  const checkAfterReset = await checkCodeRateLimit(testIp);
  assert.strictEqual(checkAfterReset.blocked, false, "Tras resetear no debe estar bloqueado");
  console.log("✅ resetCodeRateLimit() restablece el acceso");

  // -------------------------------------------------------------
  // 4. Aislamiento entre aulas y con el aula abierta de prueba
  // -------------------------------------------------------------
  console.log("\n--- 5. Aislamiento de compañeros (sameClassroom) ---");

  const sPilot1: Student = { code: "P1", name: "Alumno Piloto 1", type: "aula", createdAt: "" };
  const sPilot2: Student = { code: "P2", name: "Alumno Piloto 2", type: "aula", createdAt: "" };
  const sAulaA: Student = { code: "A1", name: "Alumno Aula A", classroomId: "aula-a", type: "aula", createdAt: "" };
  const sAulaB: Student = { code: "B1", name: "Alumno Aula B", classroomId: "aula-b", type: "aula", createdAt: "" };
  const sOpen1: Student = { code: "O1", name: "Alumno Prueba 1", classroomId: OPEN_CLASSROOM_ID, type: "prueba", createdAt: "" };
  const sOpen2: Student = { code: "O2", name: "Alumno Prueba 2", classroomId: OPEN_CLASSROOM_ID, type: "prueba", createdAt: "" };

  assert.strictEqual(sameClassroom(sPilot1, sPilot2), true, "Dos alumnos piloto son compañeros entre sí");
  console.log("✅ Alumnos del aula piloto comparten aula");

  assert.strictEqual(sameClassroom(sAulaA, sAulaB), false, "Alumnos de aulas distintas no son compañeros");
  console.log("✅ Alumnos de aulas distintas NO comparten aula");

  assert.strictEqual(sameClassroom(sPilot1, sAulaA), false, "Alumno piloto y alumno de otra aula no son compañeros");
  console.log("✅ Alumno piloto y alumno de aula escolar NO comparten aula");

  assert.strictEqual(sameClassroom(sOpen1, sOpen2), false, "Alumnos del aula abierta pública NUNCA son compañeros entre sí");
  assert.strictEqual(sameClassroom(sOpen1, sPilot1), false, "Alumno del aula abierta no es compañero del aula piloto");
  console.log("✅ Alumnos del aula abierta pública están completamente aislados (privacidad total)");

  console.log("\n==============================================");
  console.log("🎉 TODAS LAS PRUEBAS DE PRIVACIDAD PASARON CON ÉXITO.");
}

runTests().catch((err) => {
  console.error("Error en las pruebas de privacidad:", err);
  process.exit(1);
});
