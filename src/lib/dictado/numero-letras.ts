// Utilidad de conversión de números a palabras en español rioplatense (hasta 99.999).
// Usado para dictados de números en 2.º y 3.º grado.

const UNIDADES: string[] = [
  "cero",
  "uno",
  "dos",
  "tres",
  "cuatro",
  "cinco",
  "seis",
  "siete",
  "ocho",
  "nueve",
  "diez",
  "once",
  "doce",
  "trece",
  "catorce",
  "quince",
  "dieciséis",
  "diecisiete",
  "dieciocho",
  "diecinueve",
  "veinte",
  "veintiuno",
  "veintidós",
  "veintitrés",
  "veinticuatro",
  "veinticinco",
  "veintiséis",
  "veintisiete",
  "veintiocho",
  "veintinueve",
];

const DECENAS: Record<number, string> = {
  3: "treinta",
  4: "cuarenta",
  5: "cincuenta",
  6: "sesenta",
  7: "setenta",
  8: "ochenta",
  9: "noventa",
};

const CENTENAS: Record<number, string> = {
  1: "ciento",
  2: "doscientos",
  3: "trescientos",
  4: "cuatrocientos",
  5: "quinientos",
  6: "seiscientos",
  7: "setecientos",
  8: "ochocientos",
  9: "novecientos",
};

function menorQueMil(n: number): string {
  if (n < 0 || n >= 1000) throw new Error(`Fuera de rango menorQueMil: ${n}`);
  if (n <= 29) return UNIDADES[n];

  if (n < 100) {
    const d = Math.floor(n / 10);
    const u = n % 10;
    if (u === 0) return DECENAS[d];
    return `${DECENAS[d]} y ${UNIDADES[u]}`;
  }

  if (n === 100) return "cien";

  const c = Math.floor(n / 100);
  const resto = n % 100;
  if (resto === 0) {
    return c === 1 ? "cien" : CENTENAS[c];
  }
  return `${CENTENAS[c]} ${menorQueMil(resto)}`;
}

export function numeroEnLetras(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 99999) {
    throw new Error(`Número inválido para dictado (0 a 99999): ${n}`);
  }

  if (n < 1000) return menorQueMil(n);

  const miles = Math.floor(n / 1000);
  const resto = n % 1000;

  let parteMiles = "";
  if (miles === 1) {
    parteMiles = "mil";
  } else {
    // En números compuestos como 21.000 se dice "veintiún mil"
    let textoMiles = menorQueMil(miles);
    if (textoMiles === "veintiuno") {
      textoMiles = "veintiún";
    } else if (textoMiles.endsWith(" y uno")) {
      textoMiles = textoMiles.slice(0, -1); // "treinta y un"
    }
    parteMiles = `${textoMiles} mil`;
  }

  if (resto === 0) return parteMiles;
  return `${parteMiles} ${menorQueMil(resto)}`;
}
