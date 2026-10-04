// Evaluador y corrector pedagógico de dictados para 2.º y 3.º grado.

export interface EvaluacionDictado {
  ok: boolean;
  score: number; // 1 (correcto) o 0 (incorrecto)
  feedback: string;
  warning?: string; // Por ejemplo si faltó la tilde en 2.º grado pero cuenta como bien
  userNormalized: string;
  expectedNormalized: string;
  firstErrorIndex?: number; // Para destacar la letra que falló
}

// Quita acentos para comparar palabras sin tildes cuando no es estricto
export function quitarAcentos(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Normaliza espacios múltiples
export function normalizarEspacios(str: string): string {
  return str.trim().replace(/\s+/g, " ");
}

export function evaluarDictado(
  kind: "numero" | "palabra" | "oracion",
  userInput: string,
  answer: string,
  grade: number = 2,
  strictAccents: boolean = false
): EvaluacionDictado {
  const rawUser = (userInput || "").trim();
  const rawExpected = (answer || "").trim();

  // 1. Números
  if (kind === "numero") {
    const userClean = rawUser.replace(/[\s.,_-]/g, "");
    const expectedClean = rawExpected.replace(/[\s.,_-]/g, "");

    if (userClean === expectedClean && userClean.length > 0) {
      return {
        ok: true,
        score: 1,
        feedback: "¡Excelente! Escribiste el número correcto.",
        userNormalized: userClean,
        expectedNormalized: expectedClean,
      };
    }

    return {
      ok: false,
      score: 0,
      feedback: `Casi: escribiste ${rawUser || "(nada)"}, el número era ${rawExpected}.`,
      userNormalized: userClean,
      expectedNormalized: expectedClean,
    };
  }

  // 2. Palabras
  if (kind === "palabra") {
    const userTrim = normalizarEspacios(rawUser);
    const expectedTrim = normalizarEspacios(rawExpected);

    const userLower = userTrim.toLowerCase();
    const expectedLower = expectedTrim.toLowerCase();

    // ¿Coincidencia exacta (ignorando mayúsculas)?
    if (userLower === expectedLower) {
      return {
        ok: true,
        score: 1,
        feedback: "¡Muy bien! Palabra escrita correctamente.",
        userNormalized: userTrim,
        expectedNormalized: expectedTrim,
      };
    }

    // Coincidencia sin tildes
    const userSinTilde = quitarAcentos(userLower);
    const expectedSinTilde = quitarAcentos(expectedLower);

    if (userSinTilde === expectedSinTilde) {
      // Coincide letra por letra pero difiere en acentuación
      if (strictAccents && grade >= 3) {
        return {
          ok: false,
          score: 0,
          feedback: `Casi: a la palabra le faltó la tilde obligatoria (${expectedTrim}).`,
          userNormalized: userTrim,
          expectedNormalized: expectedTrim,
        };
      }

      // En 2.º grado la tilde no es obligatoria: se acepta con aviso
      return {
        ok: true,
        score: 1,
        feedback: "¡Bien!",
        warning: `¡Ojo! La palabra lleva tilde: «${expectedTrim}».`,
        userNormalized: userTrim,
        expectedNormalized: expectedTrim,
      };
    }

    // Encontrar la primera letra distinta para orientar al alumno
    let diffIdx = -1;
    for (let i = 0; i < Math.max(userLower.length, expectedLower.length); i++) {
      if (userLower[i] !== expectedLower[i]) {
        diffIdx = i;
        break;
      }
    }

    const fallada = rawUser[diffIdx] ? `la letra «${rawUser[diffIdx]}»` : "las letras finales";
    return {
      ok: false,
      score: 0,
      feedback: `Casi: revisá ${fallada}. La palabra correcta era «${expectedTrim}».`,
      userNormalized: userTrim,
      expectedNormalized: expectedTrim,
      firstErrorIndex: diffIdx,
    };
  }

  // 3. Oraciones
  const userSent = normalizarEspacios(rawUser);
  const expSent = normalizarEspacios(rawExpected);

  // Verificación básica de estructura para 2.º y 3.º
  const tieneMayusculaInicial = /^[A-ZÁÉÍÓÚÑ¿¡]/.test(userSent);
  const tienePuntoFinal = /[.?!]$/.test(userSent);

  if (grade === 2) {
    if (!tieneMayusculaInicial) {
      return {
        ok: false,
        score: 0,
        feedback: "Casi: recordá que las oraciones deben empezar con mayúscula.",
        userNormalized: userSent,
        expectedNormalized: expSent,
      };
    }
    if (!userSent.endsWith(".")) {
      return {
        ok: false,
        score: 0,
        feedback: "Casi: recordá colocar el punto final al terminar la oración.",
        userNormalized: userSent,
        expectedNormalized: expSent,
      };
    }

    // Comparar contenido de la oración sin tildes en 2.º
    const uNoAcc = quitarAcentos(userSent.toLowerCase());
    const eNoAcc = quitarAcentos(expSent.toLowerCase());

    if (uNoAcc === eNoAcc) {
      const faltaTilde = userSent.toLowerCase() !== expSent.toLowerCase();
      return {
        ok: true,
        score: 1,
        feedback: "¡Excelente oración!",
        warning: faltaTilde ? `¡Bien! Pero recordá las tildes: «${expSent}».` : undefined,
        userNormalized: userSent,
        expectedNormalized: expSent,
      };
    }

    return {
      ok: false,
      score: 0,
      feedback: `Casi: compará tu oración con la correcta: «${expSent}».`,
      userNormalized: userSent,
      expectedNormalized: expSent,
    };
  }

  // 3.º grado: signos de pregunta/exclamación y mayúsculas
  if (!tieneMayusculaInicial) {
    return {
      ok: false,
      score: 0,
      feedback: "Casi: recordá empezar con mayúscula (o signo de apertura ¿ / ¡).",
      userNormalized: userSent,
      expectedNormalized: expSent,
    };
  }

  if (!tienePuntoFinal) {
    return {
      ok: false,
      score: 0,
      feedback: "Casi: recordá cerrar la oración con punto, signo de pregunta o de exclamación.",
      userNormalized: userSent,
      expectedNormalized: expSent,
    };
  }

  // Si la oración esperada tiene ¿ ?, verificar ambos signos
  if (expSent.includes("¿") && !userSent.includes("¿")) {
    return {
      ok: false,
      score: 0,
      feedback: "Casi: te faltó abrir el signo de pregunta «¿» al inicio.",
      userNormalized: userSent,
      expectedNormalized: expSent,
    };
  }

  if (expSent.includes("¡") && !userSent.includes("¡")) {
    return {
      ok: false,
      score: 0,
      feedback: "Casi: te faltó abrir el signo de exclamación «¡» al inicio.",
      userNormalized: userSent,
      expectedNormalized: expSent,
    };
  }

  if (userSent === expSent) {
    return {
      ok: true,
      score: 1,
      feedback: "¡Perfecto! Escribiste la oración con todos sus signos y tildes.",
      userNormalized: userSent,
      expectedNormalized: expSent,
    };
  }

  // Si coincide ignorando mayúsculas
  if (userSent.toLowerCase() === expSent.toLowerCase()) {
    return {
      ok: true,
      score: 1,
      feedback: "¡Muy bien!",
      userNormalized: userSent,
      expectedNormalized: expSent,
    };
  }

  return {
    ok: false,
    score: 0,
    feedback: `Casi: la oración correcta era «${expSent}».`,
    userNormalized: userSent,
    expectedNormalized: expSent,
  };
}
