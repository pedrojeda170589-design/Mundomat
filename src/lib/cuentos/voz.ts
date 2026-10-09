// Los cuentos se narran con la voz del navegador (ListenActivity). Acá solo
// queda cómo se parte un texto en oraciones para leerlo y resaltarlo de a una.

// Parte el texto de una escena en oraciones.
export function oraciones(text: string): string[] {
  const parts = text.match(/[^.!?…]+[.!?…]+[»”"]?\s*|[^.!?…]+$/g) ?? [text];
  return parts.map((p) => p.trim()).filter(Boolean);
}
