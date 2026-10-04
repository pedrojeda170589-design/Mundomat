import { numeroEnLetras } from "../src/lib/dictado/numero-letras";
import { evaluarDictado } from "../src/lib/dictado/evaluacion";
import {
  generarSetMundoDictado,
  esSemanaDeDictado,
  claveSemanaDictado,
  nivelDeDictado,
  getISOWeek,
} from "../src/lib/dictado/banco";
import { applyDictationWorldAttempt } from "../src/lib/data";
import { StudentProgress } from "../src/types";

console.log("=== INICIANDO PRUEBAS DE DICTADOS (AG-06) ===\n");

let errors = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`❌ ERROR: ${msg}`);
    errors++;
  } else {
    console.log(`✅ ${msg}`);
  }
}

// ----------------------------------------------------
// 1. numeroEnLetras
// ----------------------------------------------------
console.log("\n--- 1. Probando numeroEnLetras ---");
const expectedNumbers: Record<number, string> = {
  0: "cero",
  1: "uno",
  10: "diez",
  15: "quince",
  16: "dieciséis",
  20: "veinte",
  21: "veintiuno",
  22: "veintidós",
  23: "veintitrés",
  26: "veintiséis",
  30: "treinta",
  31: "treinta y uno",
  100: "cien",
  101: "ciento uno",
  108: "ciento ocho",
  200: "doscientos",
  500: "quinientos",
  700: "setecientos",
  900: "novecientos",
  1000: "mil",
  1005: "mil cinco",
  2040: "dos mil cuarenta",
  10000: "diez mil",
  21000: "veintiún mil",
  31500: "treinta y un mil quinientos",
  99999: "noventa y nueve mil novecientos noventa y nueve",
};

for (const [nStr, exp] of Object.entries(expectedNumbers)) {
  const n = Number(nStr);
  const got = numeroEnLetras(n);
  assert(got === exp, `numeroEnLetras(${n}) => "${got}" (esperado: "${exp}")`);
}

// 500 números al azar entre 0 y 99999
console.log("Probando 500 números aleatorios...");
let randomErrors = 0;
for (let i = 0; i < 500; i++) {
  const n = Math.floor(Math.random() * 100000);
  const text = numeroEnLetras(n);
  if (!text || text.includes("undefined") || text.includes("NaN") || text.endsWith(" y")) {
    randomErrors++;
    console.error(`Error en numeroEnLetras(${n}): "${text}"`);
  }
}
assert(randomErrors === 0, `500 números aleatorios convertidos sin errores.`);

// ----------------------------------------------------
// 2. Corrección pedagógica (evaluarDictado)
// ----------------------------------------------------
console.log("\n--- 2. Probando evaluarDictado ---");

// Números
const nOk1 = evaluarDictado("numero", "1500", "1500");
assert(nOk1.ok && nOk1.score === 1, "Número exacto coincide: 1500");

const nOk2 = evaluarDictado("numero", "1.500", "1500");
assert(nOk2.ok && nOk2.score === 1, "Número con punto coincide: 1.500 == 1500");

const nFail = evaluarDictado("numero", "202", "22");
assert(!nFail.ok && nFail.feedback.includes("202") && nFail.feedback.includes("22"), "Número errado da feedback explicativo.");

// Palabras en 2.º grado (tilde opcional con aviso)
const pG2SinTilde = evaluarDictado("palabra", "cancion", "canción", 2, false);
assert(pG2SinTilde.ok && pG2SinTilde.score === 1 && !!pG2SinTilde.warning, "2.º grado: tilde faltante se aprueba pero muestra aviso.");

// Palabras en 3.º grado (tilde obligatoria cuando strictAccents = true)
const pG3SinTilde = evaluarDictado("palabra", "cancion", "canción", 3, true);
assert(!pG3SinTilde.ok && pG3SinTilde.score === 0, "3.º grado estricto: tilde faltante no aprueba.");

const pG3ConTilde = evaluarDictado("palabra", "canción", "canción", 3, true);
assert(pG3ConTilde.ok && pG3ConTilde.score === 1, "3.º grado estricto: tilde correcta aprueba.");

// Detección de primera letra distinta
const pDiff = evaluarDictado("palabra", "sapatilla", "zapatilla", 2, false);
assert(!pDiff.ok && pDiff.firstErrorIndex === 0, "Detección de primera letra errónea en índice 0.");

// Oraciones en 2.º grado (mayúscula y punto)
const oG2SinMayus = evaluarDictado("oracion", "el zorro come calafate.", "El zorro come calafate.", 2);
assert(!oG2SinMayus.ok && oG2SinMayus.feedback.includes("mayúscula"), "2.º grado: oración sin mayúscula falla.");

const oG2SinPunto = evaluarDictado("oracion", "El zorro come calafate", "El zorro come calafate.", 2);
assert(!oG2SinPunto.ok && oG2SinPunto.feedback.includes("punto"), "2.º grado: oración sin punto falla.");

const oG2Ok = evaluarDictado("oracion", "El zorro come calafate.", "El zorro come calafate.", 2);
assert(oG2Ok.ok && oG2Ok.score === 1, "2.º grado: oración correcta con mayúscula y punto aprueba.");

// Oraciones en 3.º grado (signos de pregunta y exclamación)
const oG3PreguntaSinAbrir = evaluarDictado(
  "oracion",
  "Sabías que el cerro tiene nieve?",
  "¿Sabías que el cerro tiene nieve?",
  3
);
assert(!oG3PreguntaSinAbrir.ok && oG3PreguntaSinAbrir.feedback.includes("¿"), "3.º grado: pregunta sin ¿ inicial falla.");

const oG3PreguntaOk = evaluarDictado(
  "oracion",
  "¿Sabías que el cerro tiene nieve?",
  "¿Sabías que el cerro tiene nieve?",
  3
);
assert(oG3PreguntaOk.ok && oG3PreguntaOk.score === 1, "3.º grado: pregunta completa con ¿ y ? aprueba.");

// ----------------------------------------------------
// 3. Generación sin repetir dentro de una vuelta
// ----------------------------------------------------
console.log("\n--- 3. Probando generarSetMundoDictado ---");
for (const grade of [2, 3]) {
  for (const month of [3, 6, 10]) {
    // marzo (nivel 1), julio (nivel 2), noviembre (nivel 3)
    const fecha = new Date(2026, month, 15);
    const nivel = nivelDeDictado(grade, fecha);
    const items = generarSetMundoDictado(grade, fecha);

    assert(items.length === 10, `Grado ${grade} mes ${month}: genera exactamente 10 actividades.`);

    const nums = items.filter((it) => it.kind === "numero").map((it) => it.answer);
    const lengua = items.filter((it) => it.kind !== "numero").map((it) => it.answer);

    assert(nums.length === 5, `Grado ${grade} mes ${month}: exactamente 5 números.`);
    assert(lengua.length === 5, `Grado ${grade} mes ${month}: exactamente 5 ítems de lengua.`);

    const uniqueNums = new Set(nums);
    assert(uniqueNums.size === 5, `Grado ${grade} mes ${month}: los 5 números son distintos (sin repetir).`);

    const uniqueLengua = new Set(lengua);
    assert(uniqueLengua.size === 5, `Grado ${grade} mes ${month}: los 5 ítems de lengua son distintos (sin repetir).`);
  }
}

// ----------------------------------------------------
// 4. esSemanaDeDictado y claveSemanaDictado
// ----------------------------------------------------
console.log("\n--- 4. Probando esSemanaDeDictado y claveSemanaDictado ---");
// 2026-10-01 es semana 40 (semana par)
const dateW40 = new Date(2026, 9, 1);
const isoW40 = getISOWeek(dateW40);
assert(isoW40 === 40, `2026-10-01 es semana ISO 40.`);
assert(esSemanaDeDictado(dateW40), `Semana 40 es semana de dictado (par).`);
assert(claveSemanaDictado(dateW40) === "2026-W40", `Clave de semana es '2026-W40'.`);

// 2026-10-08 es semana 41 (semana impar)
const dateW41 = new Date(2026, 9, 8);
const isoW41 = getISOWeek(dateW41);
assert(isoW41 === 41, `2026-10-08 es semana ISO 41.`);
assert(!esSemanaDeDictado(dateW41), `Semana 41 NO es semana de dictado (impar).`);

// ----------------------------------------------------
// 5. Acreditación de premio (applyDictationWorldAttempt)
// ----------------------------------------------------
console.log("\n--- 5. Probando acreditación de premio ---");
const mockProgress: StudentProgress = {
  code: "STUDENT-1",
  coins: 50,
  completedWorlds: [],
  activityLog: [],
  seasonalCollection: [],
};

// Intento 1 en semana 40: 10/10 (100%)
const res1 = applyDictationWorldAttempt(mockProgress, 28001, 10, 10, [], dateW40);
assert(res1.rewardEarned, "Primer intento al 100%: cobra premio.");
assert(res1.bonusCoins === 20, "Primer intento al 100%: gana 20 monedas.");
assert(res1.progress.coins === 70, "Monedas totales actualizadas a 70.");
assert(res1.lapizUnlocked, "Desbloquea el accesorio 'lapiz-dorado'.");
assert(
  res1.progress.seasonalCollection?.includes("lapiz-dorado") ?? false,
  "'lapiz-dorado' guardado en seasonalCollection."
);
assert(res1.progress.dictationWeeks?.["2026-W40"]?.firstScore === 100, "firstScore registrado como 100%.");
assert(res1.progress.dictationWeeks?.["2026-W40"]?.rewarded === true, "rewarded registrado como true.");

// Intento 2 en la misma semana: 10/10 (100%)
const res2 = applyDictationWorldAttempt(res1.progress, 28001, 10, 10, [], dateW40);
assert(!res2.rewardEarned, "Segundo intento en la misma semana: NO vuelve a cobrar premio.");
assert(res2.bonusCoins === 0, "Segundo intento: 0 monedas de bonus.");
assert(res2.progress.coins === 70, "Monedas siguen en 70 (sin duplicar).");
assert(!res2.lapizUnlocked, "Lápiz ya estaba desbloqueado.");

// Caso alumno que no llega al 100% en el primer intento (ej: 8/10 con errores)
const progress2: StudentProgress = {
  code: "STUDENT-2",
  coins: 10,
  completedWorlds: [],
  activityLog: [],
};
const resMistake = applyDictationWorldAttempt(progress2, 28001, 8, 10, ["340", "cigarra"], dateW40);
assert(!resMistake.rewardEarned, "Primer intento al 80%: NO cobra premio.");
assert(resMistake.bonusCoins === 0, "No gana bonus de monedas.");
assert(resMistake.progress.dictationWeeks?.["2026-W40"]?.firstScore === 80, "firstScore guardado como 80.");
assert(
  Boolean(
    resMistake.progress.dictationWeeks?.["2026-W40"]?.mistakes?.includes("340") &&
    resMistake.progress.dictationWeeks?.["2026-W40"]?.mistakes?.includes("cigarra")
  ),
  "Errores ['340', 'cigarra'] guardados para el docente."
);

// Segundo intento de ese alumno al 100% en la misma semana:
const resRepeat = applyDictationWorldAttempt(resMistake.progress, 28001, 10, 10, [], dateW40);
assert(!resRepeat.rewardEarned, "Repetición al 100% tras fallar la primera vuelta: NO cobra el premio semanal.");
assert(resRepeat.bonusCoins === 0, "Bonus de monedas sigue siendo 0.");

console.log("\n==============================================");
if (errors === 0) {
  console.log("🎉 TODAS LAS PRUEBAS DE DICTADOS PASARON CON ÉXITO.");
} else {
  console.error(`💥 SE DETECTARON ${errors} ERRORES.`);
  process.exit(1);
}
