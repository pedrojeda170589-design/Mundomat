// Secuencias numéricas configurables para los juegos de fin de semana.
// Una secuencia se define solo con inicio, incremento y cantidad, así se
// pueden crear niveles nuevos sin programar cada actividad a mano.

export interface SequenceParams {
  start: number;
  step: number; // incremento (1 = de 1 en 1, 2 = de 2 en 2, ...)
  count: number; // cantidad de números / cartas
}

export function buildSequence({ start, step, count }: SequenceParams): number[] {
  return Array.from({ length: count }, (_, i) => start + i * step);
}

export function describeStep(step: number): string {
  return `de ${step} en ${step}`;
}

// Generador pseudoaleatorio con semilla (mulberry32): el mismo día y la
// misma actividad dan siempre el mismo resultado, para todos los alumnos y
// aunque se recargue la página.
export function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rand: () => number, options: T[]): T {
  return options[Math.floor(rand() * options.length)];
}

// Posiciones fijas de las cartas en la mesa: una permutación que nunca es
// el orden de la secuencia (si no, sería demasiado fácil).
export function shuffledPositions(rand: () => number, count: number): number[] {
  const p = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  if (p.every((v, i) => v === i)) p.push(p.shift()!);
  return p;
}
