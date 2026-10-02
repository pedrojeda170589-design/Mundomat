// Tipos de los mundos de cuentos (comprensión auditiva en 1.º y comprensión
// lectora en 2.º y 3.º). Los mismos cuentos se usan en los tres grados; lo
// que cambia es cómo se presentan (narrado o para leer) y qué tan exigentes
// son las preguntas.

// [emoji, texto] de una opción de respuesta.
export type CuentoOpt = [emoji: string, label: string];

// Tipo de pregunta de comprensión. Cada uno se registra como una habilidad
// distinta en el informe docente (ver SKILL_BY_KIND en recorrido.ts).
export type ComprehensionKind =
  | "literal" // lo que el texto dice explícitamente (quién, qué, dónde)
  | "secuencia" // orden de los hechos: antes, después, al final
  | "inferencial" // lo que no se dice: por qué, qué sintió, qué pensaba
  | "vocabulario" // qué significa una palabra o expresión por el contexto
  | "estructura" // inicio, conflicto y desenlace; tipo de texto; narrador
  | "valoracion"; // opinión fundamentada, enseñanza, qué harías vos

export interface CuentoQuestion {
  q: string;
  kind: ComprehensionKind;
  options: CuentoOpt[]; // 3 en 1.º, 3 o 4 en 2.º, 4 en 3.º
  answer: number; // índice de la opción correcta (las opciones se mezclan al jugar)
  hint: string; // empieza con "Pista: "
}

export interface Cuento {
  id: string;
  title: string;
  origin: string; // de dónde viene (para el docente)
  emoji: string;
  description: string; // una línea para la tarjeta del mundo
  scenes: string[]; // 6 escenas, una por ilustración
}
