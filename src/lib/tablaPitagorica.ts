// Tabla pitagórica con el modelo de Pedro: de 0 a 10, cada columna con su
// color, la FILA es el primer número y la COLUMNA el segundo.
//   Multiplicar: 3 × 4 → fila 3, columna 4 → 12.
//   Dividir: 24 ÷ 6 → busco el 24 en la fila 6 → está en la columna 4 → 4.
// La usan la actividad interactiva, la página para descargar e imprimir y el
// repaso de tablas.

export const TABLA_MAX = 10;

// Color pastel de cada columna (0 a 10) y uno un poco más fuerte para el encabezado.
export const COLOR_COLUMNA: { celda: string; encabezado: string }[] = [
  { celda: "#dff3d2", encabezado: "#b9e59b" }, // 0 verde
  { celda: "#fde0ea", encabezado: "#f9b8cf" }, // 1 rosa
  { celda: "#dcecfb", encabezado: "#b3d6f6" }, // 2 celeste
  { celda: "#fdf3c4", encabezado: "#f8e27e" }, // 3 amarillo
  { celda: "#ebe0fa", encabezado: "#d2bdf4" }, // 4 lila
  { celda: "#fde3c8", encabezado: "#f9c38f" }, // 5 naranja
  { celda: "#d7f3f6", encabezado: "#a7e3ea" }, // 6 turquesa
  { celda: "#fbdcdc", encabezado: "#f5b0b0" }, // 7 coral
  { celda: "#e2f3d2", encabezado: "#c3e6a3" }, // 8 verde claro
  { celda: "#e6e2fa", encabezado: "#c9c0f3" }, // 9 lavanda
  { celda: "#d9eafb", encabezado: "#acd0f5" }, // 10 azul claro
];
export const COLOR_FILA = { encabezado: "#c5b8ef", esquina: "#6b5bd6" };

export const REGLAS_TABLA = {
  multiplicar: "Busco el número de la fila, cruzo con el número de la columna y encuentro el resultado.",
  dividir: "Busco el resultado en la fila del número que divide y miro en qué columna está: ese es el resultado.",
  cero: "Todo número multiplicado por 0 da 0.",
  uno: "Todo número multiplicado por 1 da el mismo número.",
  noDividirCero: "No se puede dividir por 0.",
};
