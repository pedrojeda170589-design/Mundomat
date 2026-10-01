// Banco de palabras de 1.º grado, con sílabas y dibujo. Las actividades de
// lectura eligen de acá solo las palabras que se pueden leer con las letras
// ya trabajadas (palabras "decodificables").

export interface WordDef {
  word: string;
  syllables: string[];
  emoji: string;
}

// "pa-to" → sílabas. Todas en minúscula; tildes donde corresponden.
const RAW: [string, string][] = [
  // vocales y m, p, l, s
  ["o-so", "🐻"], ["o-jo", "👁️"], ["u-va", "🍇"], ["a-la", "🪽"], ["i-sla", "🏝️"],
  ["ma-má", "👩"], ["pa-pá", "👨"], ["ma-no", "✋"], ["mo-no", "🐒"], ["me-sa", "🪑"],
  ["ma-pa", "🗺️"], ["mi-mo", "🤗"], ["pu-ma", "🐆"], ["pi-pa", "🪈"], ["pu-pa", "🩹"],
  ["pa-pa", "🥔"], ["po-pa", "🚢"], ["lu-pa", "🔍"], ["pa-la", "🪏"], ["pe-lo", "💇"],
  ["pi-la", "🔋"], ["lo-ma", "⛰️"], ["la-ta", "🥫"], ["li-mo-nes", "🍋"], ["sa-po", "🐸"],
  ["so-pa", "🍲"], ["sol", "☀️"], ["sa-la", "🛋️"], ["su-ma", "➕"], ["pe-sas", "🏋️"],
  ["o-las", "🌊"], ["lo-sa", "🧱"], ["a-mo", "❤️"], ["sal", "🧂"], ["mu-la", "🫏"],
  ["pi-so", "🏢"], ["ma-sa", "🥟"], ["me-lón", "🍈"], ["pa-lo", "🪵"], ["mo-to", "🏍️"],
  // t, n, d
  ["to-ma-te", "🍅"], ["ta-za", "☕"], ["pa-to", "🦆"], ["ga-to", "🐱"], ["to-ro", "🐂"],
  ["ma-ta", "🌿"], ["pé-ta-lo", "🌸"], ["lu-na", "🌙"], ["nu-be", "☁️"], ["ni-do", "🪺"],
  ["na-riz", "👃"], ["ma-ní", "🥜"], ["na-ta", "🥛"], ["pi-no", "🌲"], ["ti-na", "🛁"],
  ["te-la", "🧵"], ["mo-ne-da", "🪙"], ["da-do", "🎲"], ["de-do", "☝️"], ["no-ta", "🎵"],
  ["dos", "2️⃣"], ["mo-ño", "🎀"], ["la-te", "💓"], ["pa-ta", "🐾"], ["le-ón", "🦁"],
  ["sie-te", "7️⃣"], ["me-ta", "🏁"], ["ma-le-ta", "🧳"], ["pe-sa-do", "🏋️"], ["sa-la-di-to", "🥨"],
  ["dien-te", "🦷"], ["sen-ta-do", "🪑"], ["to-pa-dor", "🚜"],
  // r, c, f, b, v, g
  ["ra-tón", "🐭"], ["ro-sa", "🌹"], ["ra-na", "🐸"], ["re-ga-lo", "🎁"], ["lo-ro", "🦜"],
  ["pe-rro", "🐶"], ["ca-rro", "🛒"], ["ca-sa", "🏠"], ["co-pa", "🏆"], ["cu-na", "🛏️"],
  ["co-co", "🥥"], ["ca-ma", "🛏️"], ["cu-bo", "🧊"], ["fo-ca", "🦭"], ["flor", "🌸"],
  ["fa-ro", "🗼"], ["fi-deos", "🍝"], ["bo-te", "🚤"], ["be-bé", "👶"], ["bo-ca", "👄"],
  ["bu-rro", "🫏"], ["bo-la", "🎱"], ["ba-rril", "🛢️"], ["va-ca", "🐄"], ["ve-la", "🕯️"],
  ["u-ña", "💅"], ["ga-lle-ta", "🍪"], ["go-rro", "🧢"], ["gu-sa-no", "🐛"],
  ["go-ta", "💧"], ["la-go", "🏞️"], ["ma-go", "🧙"], ["a-mi-go", "🧑‍🤝‍🧑"], ["fue-go", "🔥"],
  // ñ, j, ll y otras
  ["pi-ña", "🍍"], ["a-ra-ña", "🕷️"], ["ñan-dú", "🐦"], ["ni-ño", "👦"], ["ni-ña", "👧"],
  ["ji-ra-fa", "🦒"], ["ju-go", "🧃"], ["ja-bón", "🧼"], ["ca-ja", "📦"],
  ["lla-ve", "🔑"], ["llu-via", "🌧️"], ["po-llo", "🐥"], ["si-lla", "🪑"], ["ca-ba-llo", "🐴"],
  ["ga-lli-na", "🐔"], ["e-ti-que-ta", "🏷️"], ["que-so", "🧀"], ["he-la-do", "🍦"], ["ho-ja", "🍃"],
  ["hue-vo", "🥚"], ["chan-cho", "🐷"], ["cho-clo", "🌽"], ["le-che", "🥛"], ["za-pa-to", "👞"],
  ["zo-rro", "🦊"], ["ki-wi", "🥝"], ["ta-xi", "🚕"], ["yo-yó", "🪀"],
  // palabras largas y cortas, rimas
  ["mar", "🌊"], ["pan", "🍞"], ["pez", "🐟"], ["tren", "🚂"], ["luz", "💡"],
  ["ma-ri-po-sa", "🦋"], ["e-le-fan-te", "🐘"], ["tor-tu-ga", "🐢"], ["he-li-cóp-te-ro", "🚁"], ["co-co-dri-lo", "🐊"],
  ["ca-ra-col", "🐌"], ["ca-mión", "🚚"], ["a-vión", "✈️"], ["bo-tón", "🔘"], ["co-ra-zón", "❤️"],
  ["ca-ma-rón", "🦐"], ["pe-lo-ta", "⚽"], ["ga-vio-ta", "🕊️"], ["ven-ta-na", "🪟"], ["can-ción", "🎶"], ["ba-lle-na", "🐋"], ["es-tre-lla", "⭐"], ["pin-güi-no", "🐧"], ["gua-na-co", "🦙"],
  ["cón-dor", "🦅"], ["ca-la-fa-te", "🫐"], ["mon-ta-ña", "🏔️"], ["ár-bol", "🌳"], ["pá-ja-ro", "🐦"],
];

export const WORDS: WordDef[] = RAW.map(([s, emoji]) => ({
  word: s.replace(/-/g, ""),
  syllables: s.split("-"),
  emoji,
}));

// Letras (grafemas) de una palabra, en el orden de la enseñanza: "ll", "ch",
// "rr" y "qu" cuentan como una unidad; las tildes no cambian la letra.
export function graphemes(word: string): string[] {
  const w = word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, (m, off) => (word.normalize("NFD")[off - 1] === "n" && m === "̃" ? m : ""))
    .normalize("NFC");
  const out: string[] = [];
  for (let i = 0; i < w.length; i++) {
    const two = w.slice(i, i + 2);
    if (two === "ll" || two === "ch") {
      out.push(two);
      i++;
    } else if (two === "rr") {
      out.push("r");
      i++;
    } else if (two === "qu") {
      out.push("q");
      i++;
    } else if (/[a-zñ]/.test(w[i])) {
      out.push(w[i]);
    }
  }
  return out;
}

// ¿Se puede leer con estas letras?
export function isDecodable(word: WordDef, known: string[]): boolean {
  const set = new Set(known);
  return graphemes(word.word).every((g) => set.has(g));
}

export function decodableWords(known: string[], mustInclude?: string): WordDef[] {
  return WORDS.filter(
    (w) => isDecodable(w, known) && (!mustInclude || graphemes(w.word).includes(mustInclude))
  );
}

// Rima consonante: desde la vocal acentuada hasta el final («gato» →
// «ato», «ratón» → «ón» → «on», «moño» → «oño»). Se usa la sílaba tónica:
// la que lleva tilde, o la última si la palabra termina en consonante que no
// sea n ni s, o si no, la penúltima.
export function rimeOf(word: string): string {
  const w = WORDS.find((x) => x.word === word);
  const syl = w ? w.syllables : [word];
  let stressed = syl.findIndex((x) => /[áéíóú]/.test(x));
  if (stressed < 0) {
    const last = word[word.length - 1];
    stressed = syl.length === 1 || !/[aeiouns]/.test(last) ? syl.length - 1 : syl.length - 2;
  }
  // Vocal tónica dentro de la sílaba: la que lleva tilde; si no, la vocal
  // fuerte (a, e, o: «gua», «fue», «mión»); si no, la débil («pi»).
  const sy = syl[stressed] ?? "";
  const v = sy.search(/[áéíóú]/) >= 0 ? sy.search(/[áéíóú]/) : sy.search(/[aeo]/) >= 0 ? sy.search(/[aeo]/) : Math.max(0, sy.search(/[iuü]/));
  const fromVowel = sy.slice(v) + syl.slice(stressed + 1).join("");
  return fromVowel
    .replace(/[áà]/g, "a")
    .replace(/[éè]/g, "e")
    .replace(/[íì]/g, "i")
    .replace(/[óò]/g, "o")
    .replace(/[úùü]/g, "u");
}

// Palabras cuyo dibujo se puede confundir con otra palabra (🪑 mesa/silla,
// 🐸 sapo/rana…): no se usan en actividades donde solo se ve el dibujo.
export const AMBIGUOUS_PICTURES = new Set([
  "mata", "mesa", "sentado", "pesado", "pesas", "cuna", "rana", "mula", "masa", "pétalo", "ñandú",
  "saladito", "late", "topador", "pupa", "popa", "pipa", "loma", "losa", "piso", "sala", "tina", "nata",
  "cubo", "gaviota", "olas", "carro", "faro", "bola", "canción", "calafate", "suma", "amo", "mimo", "dos",
  "siete", "nota", "sal", "palo", "lago", "etiqueta", "meta", "isla",
]);
