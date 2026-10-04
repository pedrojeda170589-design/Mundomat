// Generador de opciones para los 11 pasos del Torneo de tablas (N x 0 ... N x 10).
// Cada paso ofrece 3 opciones grandes:
// - La correcta: N x k.
// - Dos distractores cercanos y distintos entre sí, nunca negativos:
//   N x (k-1), N x (k+1) o la correcta ±1/±2 cuando k es 0 o 10.
// - Orden al azar.

export interface PasoTorneo {
  tabla: number; // N
  multiplicador: number; // k (0..10)
  correcta: number; // N * k
  opciones: number[]; // 3 opciones barajadas
}

/**
 * Obtiene dos distractores válidos para N x k:
 * - Cercanos a la respuesta correcta.
 * - Siempre no negativos (>= 0).
 * - Distintos entre sí y distintos de la correcta.
 */
export function obtenerDistractores(n: number, k: number): [number, number] {
  const correcta = n * k;

  let d1: number;
  let d2: number;

  if (k === 0) {
    // k = 0 -> correcta = 0. N x (k-1) sería negativo.
    // Usamos N x 1 (= N) y la correcta + 1 (o N + 1 / N x 2).
    d1 = n * 1; // N
    d2 = n + 1; // N + 1 (siempre distinto de N y > 0)
  } else if (k === 10) {
    // k = 10 -> correcta = 10N.
    d1 = n * 9; // N * 9
    d2 = n * 11; // N * 11
  } else {
    // 1 <= k <= 9: N * (k - 1) y N * (k + 1)
    d1 = n * (k - 1);
    d2 = n * (k + 1);
  }

  // Garantías de seguridad adicionales (nunca negativos, nunca iguales)
  if (d1 < 0) d1 = correcta + 1;
  if (d2 < 0 || d2 === d1 || d2 === correcta) d2 = d1 + (d1 === correcta + 1 ? 2 : 1);
  if (d1 === correcta) d1 = correcta + 2;

  return [d1, d2];
}

/**
 * Genera el paso k de la tabla n con las 3 opciones barajadas.
 */
export function generarPasoTorneo(
  n: number,
  k: number,
  randomFn: () => number = Math.random
): PasoTorneo {
  const correcta = n * k;
  const [d1, d2] = obtenerDistractores(n, k);

  const opciones = [correcta, d1, d2];

  // Barajado Fisher-Yates
  for (let i = opciones.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    const temp = opciones[i];
    opciones[i] = opciones[j];
    opciones[j] = temp;
  }

  return {
    tabla: n,
    multiplicador: k,
    correcta,
    opciones,
  };
}

/**
 * Genera la secuencia completa de los 11 pasos (de 0 a 10) para la tabla n.
 */
export function generarPasosTabla(
  n: number,
  randomFn: () => number = Math.random
): PasoTorneo[] {
  const pasos: PasoTorneo[] = [];
  for (let k = 0; k <= 10; k++) {
    pasos.push(generarPasoTorneo(n, k, randomFn));
  }
  return pasos;
}
