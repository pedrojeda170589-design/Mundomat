// Letras de 1.º grado: nombre (cómo se llama) y fonema (cómo suena) por
// separado, con palabras de ejemplo, dibujo y audios. Los audios grabados
// son opcionales: si el archivo no existe, se usa la voz del navegador con
// la pronunciación de respaldo (`nameSay` / `phonemeSay`).
//
// Para grabar: ver docs/primer-grado/AUDIOS.md.

export interface LetterDef {
  id: string; // "m", "ll", "ch"…
  upper: string; // "M"
  lower: string; // "m"
  name: string; // "eme"
  phoneme: string; // "/m/"
  vowel: boolean;
  // Respaldo para la voz del navegador (el fonema aislado no se puede
  // sintetizar bien: se alarga si se puede, o se da un ejemplo).
  nameSay: string;
  phonemeSay: string;
  examples: { word: string; emoji: string }[];
  audioName: string;
  audioPhoneme: string;
}

// Nombre de archivo sin caracteres especiales (la ñ da problemas en algunos
// servidores y sistemas de archivos).
export function audioSlug(id: string): string {
  return id === "ñ" ? "enie" : id;
}

function L(
  id: string,
  name: string,
  phoneme: string,
  phonemeSay: string,
  examples: [string, string][],
  vowel = false
): LetterDef {
  const upper = id === "ll" ? "Ll" : id === "ch" ? "Ch" : id.toUpperCase();
  return {
    id,
    upper,
    lower: id,
    name,
    phoneme,
    vowel,
    nameSay: `la letra ${name}`,
    phonemeSay,
    examples: examples.map(([word, emoji]) => ({ word, emoji })),
    audioName: `/audio/letras/${audioSlug(id)}_nombre.mp3`,
    audioPhoneme: `/audio/letras/${audioSlug(id)}_fonema.mp3`,
  };
}

export const LETTERS: LetterDef[] = [
  L("a", "a", "/a/", "aaaa, como en avión", [["avión", "✈️"], ["árbol", "🌳"], ["abeja", "🐝"]], true),
  L("e", "e", "/e/", "eeee, como en elefante", [["elefante", "🐘"], ["estrella", "⭐"], ["escoba", "🧹"]], true),
  L("i", "i", "/i/", "iiii, como en iglú", [["iglú", "🛖"], ["isla", "🏝️"], ["imán", "🧲"]], true),
  L("o", "o", "/o/", "oooo, como en oso", [["oso", "🐻"], ["ojo", "👁️"], ["oveja", "🐑"]], true),
  L("u", "u", "/u/", "uuuu, como en uva", [["uva", "🍇"], ["uña", "💅"], ["uno", "1️⃣"]], true),
  L("m", "eme", "/m/", "mmmm, como en mamá", [["mamá", "👩"], ["mano", "✋"], ["mono", "🐒"], ["mesa", "🪑"]]),
  L("p", "pe", "/p/", "p, como en pato", [["pato", "🦆"], ["papá", "👨"], ["pelota", "⚽"], ["pino", "🌲"]]),
  L("l", "ele", "/l/", "llll, como en luna", [["luna", "🌙"], ["lápiz", "✏️"], ["loro", "🦜"], ["lupa", "🔍"]]),
  L("s", "ese", "/s/", "ssss, como en sol", [["sol", "☀️"], ["sapo", "🐸"], ["mesa", "🪑"], ["sopa", "🍲"]]),
  L("t", "te", "/t/", "t, como en tomate", [["tomate", "🍅"], ["taza", "☕"], ["tren", "🚂"], ["tortuga", "🐢"]]),
  L("n", "ene", "/n/", "nnnn, como en nube", [["nube", "☁️"], ["nido", "🪺"], ["nariz", "👃"], ["luna", "🌙"]]),
  L("d", "de", "/d/", "d, como en dado", [["dado", "🎲"], ["dedo", "☝️"], ["delfín", "🐬"], ["diente", "🦷"]]),
  L("r", "erre", "/r/", "rrrr, como en ratón", [["ratón", "🐭"], ["rosa", "🌹"], ["rana", "🐸"], ["regalo", "🎁"]]),
  L("c", "ce", "/k/", "k, como en casa", [["casa", "🏠"], ["copa", "🏆"], ["cuna", "🛏️"], ["camión", "🚚"]]),
  L("f", "efe", "/f/", "ffff, como en foca", [["foca", "🦭"], ["flor", "🌸"], ["fuego", "🔥"], ["fresa", "🍓"]]),
  L("b", "be", "/b/", "b, como en bote", [["bote", "🚤"], ["bebé", "👶"], ["burro", "🫏"], ["ballena", "🐋"]]),
  L("v", "ve", "/b/", "b, como en vaca", [["vaca", "🐄"], ["vela", "🕯️"], ["violín", "🎻"], ["volcán", "🌋"]]),
  L("g", "ge", "/g/", "g, como en gato", [["gato", "🐱"], ["gorro", "🧢"], ["gusano", "🐛"], ["gallina", "🐔"]]),
  L("ñ", "eñe", "/ɲ/", "ñ, como en ñandú", [["ñandú", "🐦"], ["piña", "🍍"], ["araña", "🕷️"], ["muñeca", "🪆"]]),
  L("j", "jota", "/x/", "jjjj, como en jirafa", [["jirafa", "🦒"], ["jugo", "🧃"], ["ojo", "👁️"], ["jabón", "🧼"]]),
  L("ll", "elle", "/ʃ/", "sh, como en llave", [["llave", "🔑"], ["lluvia", "🌧️"], ["pollo", "🐥"], ["silla", "🪑"]]),
  // Letras para explorar (aparecen menos en 1.º; se trabajan por su nombre).
  L("h", "hache", "(no suena)", "la hache no suena, como en helado", [["helado", "🍦"], ["hoja", "🍃"], ["huevo", "🥚"], ["hormiga", "🐜"]]),
  L("ch", "che", "/tʃ/", "ch, como en chancho", [["chancho", "🐷"], ["choclo", "🌽"], ["chocolate", "🍫"], ["leche", "🥛"]]),
  L("y", "ye", "/ʃ/", "sh, como en yoyó", [["yoyó", "🪀"], ["yate", "🛥️"], ["yema", "🥚"]]),
  L("z", "zeta", "/s/", "ssss, como en zapato", [["zapato", "👞"], ["zorro", "🦊"], ["zanahoria", "🥕"]]),
  L("q", "cu", "/k/", "k, como en queso", [["queso", "🧀"], ["mosquito", "🦟"], ["paquete", "📦"]]),
  L("k", "ka", "/k/", "k, como en kiwi", [["kiwi", "🥝"], ["koala", "🐨"], ["karate", "🥋"]]),
  L("x", "equis", "/ks/", "ks, como en saxofón", [["saxofón", "🎷"], ["taxi", "🚕"], ["xilofón", "🎶"]]),
  L("w", "doble ve", "/u/", "u, como en waffle", [["waffle", "🧇"], ["kiwi", "🥝"]]),
];

export const VOWELS = LETTERS.filter((l) => l.vowel);

// Orden de enseñanza de 1.º (las vocales primero; después consonantes de
// sonido sostenible y frecuentes, para poder leer palabras pronto).
export const TEACHING_ORDER = [
  "a", "e", "i", "o", "u",
  "m", "p", "l", "s", "t", "n", "d", "r", "c", "f", "b", "v", "g", "ñ", "j", "ll",
];

export function getLetter(id: string): LetterDef | undefined {
  return LETTERS.find((l) => l.id === id);
}

// Letras trabajadas hasta (inclusive) una letra del orden de enseñanza.
export function lettersUpTo(id: string): string[] {
  const i = TEACHING_ORDER.indexOf(id);
  return TEACHING_ORDER.slice(0, i + 1);
}
