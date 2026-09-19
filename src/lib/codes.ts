// Generación de códigos de acceso cortos y fáciles de escribir para chicos de 3er grado.
// Se evitan caracteres ambiguos (0/O, 1/I/L) para que no se confundan al escribirlos.

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateAccessCode(length = 5): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

export function generateUniqueCode(existing: Set<string>, length = 5): string {
  let code = generateAccessCode(length);
  let attempts = 0;
  while (existing.has(code) && attempts < 50) {
    code = generateAccessCode(length);
    attempts++;
  }
  return code;
}
