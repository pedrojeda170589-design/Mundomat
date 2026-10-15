// Consejos concretos para practicar en casa cada tabla de multiplicar (2 a 10).
// Redactados a mano con ideas pedagógicas específicas para cada número.

export const CONSEJOS_TABLAS: Record<number, string> = {
  2: "Jugar con pares y dobles en casa: contar zapatos de a 2, medias o duplicar cantidades cotidianas.",
  3: "Practicar saltos de 3 en 3 (3, 6, 9, 12…) usando una rayuela en el piso o contando los lados de triángulos.",
  4: "Pensarla como el doble del doble: por ejemplo, para 4×6 hacé el doble de 6 (12) y duplicalo otra vez (24).",
  5: "Para la del 5: contar de 5 en 5 con el reloj o con los dedos de las manos.",
  6: "Apoyarse en la tabla del 5 y sumarle una vez más el número: por ejemplo, 6×7 es 5×7 (35) más 7 (42).",
  7: "Asociarla con las semanas del calendario: 2 semanas son 14 días, 3 semanas 21, 4 semanas 28…",
  8: "Repasar en voz alta la tabla del 8 salteada: 8×7, 8×3, 8×9…",
  9: "Para la del 9: los dedos de las manos, o multiplicar por 10 y restar el número (9×6 = 60 − 6 = 54).",
  10: "Recordar la magia del cero: cualquier número multiplicado por 10 es el mismo número con un 0 al final.",
};

export function getConsejoTabla(tabla: number): string {
  return (
    CONSEJOS_TABLAS[tabla] ??
    "Repasar la tabla con juegos de memoria y desafíos cortos en voz alta."
  );
}
