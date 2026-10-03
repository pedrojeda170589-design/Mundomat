// Banco de palabras de 2.º grado: sílabas trabadas (con L y R), dígrafos,
// ortografía (que/qui, gue/gui, güe/güi, ce/ci, ge/gi, mb/mp, rr, h, ch),
// sustantivos y adjetivos descriptivos. Cada palabra tiene sus sílabas
// y un emoji no ambiguo.

export interface WordDef2 {
  word: string;
  syllables: string[];
  emoji: string;
  pattern?: string; // categoría fonética/ortográfica
}

const RAW: [string, string, string?][] = [
  // --- Trabadas DR ---
  ["dra-gón", "🐉", "dr"],
  ["pie-dra", "🪨", "dr"],
  ["cua-dro", "🖼️", "dr"],
  ["co-co-dri-lo", "🐊", "dr"],
  ["la-dri-llo", "🧱", "dr"],
  ["al-men-dra", "🌰", "dr"],

  // --- Trabadas TR ---
  ["tren", "🚂", "tr"],
  ["es-tre-lla", "⭐", "tr"],
  ["cua-tro", "4️⃣", "tr"],
  ["trom-pe-ta", "🎺", "tr"],
  ["trac-tor", "🚜", "tr"],
  ["trián-gu-lo", "📐", "tr"],
  ["tri-go", "🌾", "tr"],

  // --- Trabadas CR ---
  ["cris-tal", "🔮", "cr"],
  ["cruz", "✝️", "cr"],
  ["cro-mo", "🏷️", "cr"],
  ["re-cre-o", "🔔", "cr"],
  ["cre-ma", "🧴", "cr"],
  ["crá-ter", "🌋", "cr"],

  // --- Trabadas CL ---
  ["cla-vel", "🌸", "cl"],
  ["cla-vo", "🔩", "cl"],
  ["bi-ci-cle-ta", "🚲", "cl"],
  ["an-cla", "⚓", "cl"],
  ["choc-lo", "🌽", "cl"],
  ["cla-se", "🏫", "cl"],

  // --- Trabadas FR ---
  ["fru-ta", "🍎", "fr"],
  ["co-fre", "📦", "fr"],
  ["fru-ti-lla", "🍓", "fr"],
  ["fras-co", "🫙", "fr"],
  ["fren-te", "🪞", "fr"],

  // --- Trabadas FL ---
  ["flor", "🌼", "fl"],
  ["fle-cha", "🏹", "fl"],
  ["flau-ta", "🪈", "fl"],
  ["fla-men-co", "🦩", "fl"],
  ["flo-ta-dor", "🛟", "fl"],

  // --- Trabadas GR ---
  ["gri-llo", "🦗", "gr"],
  ["ti-gre", "🐯", "gr"],
  ["o-gro", "👹", "gr"],
  ["gran-ja", "🏡", "gr"],
  ["can-gre-jo", "🦀", "gr"],
  ["gra-pa", "📎", "gr"],

  // --- Trabadas GL ---
  ["glo-bo", "🎈", "gl"],
  ["i-glú", "🧊", "gl"],
  ["re-gla", "📏", "gl"],
  ["gla-ciar", "🏔️", "gl"],

  // --- Trabadas BR ---
  ["bru-ja", "🧙‍♀️", "br"],
  ["li-bro", "📖", "br"],
  ["bra-zo", "💪", "br"],
  ["ce-bra", "🦓", "br"],
  ["a-bri-go", "🧥", "br"],
  ["bro-che", "🧷", "br"],
  ["ca-bra", "🐐", "br"],

  // --- Trabadas BL ---
  ["blan-co", "⚪", "bl"],
  ["ta-bla", "🛹", "bl"],
  ["ca-ble", "🔌", "bl"],
  ["om-bli-go", "🔘", "bl"],
  ["mue-ble", "🛋️", "bl"],
  ["blo-que", "🧱", "bl"],

  // --- Trabadas PL ---
  ["plu-ma", "🪶", "pl"],
  ["pla-to", "🍽️", "pl"],
  ["pla-ya", "🏖️", "pl"],
  ["pla-ne-ta", "🪐", "pl"],
  ["cum-ple-a-ños", "🎂", "pl"],

  // --- Trabadas PR ---
  ["pre-mio", "🏆", "pr"],
  ["pri-mo", "👦", "pr"],
  ["pri-me-ro", "🥇", "pr"],
  ["prín-ci-pe", "🤴", "pr"],
  ["pra-do", "🌱", "pr"],

  // --- CA, CO, CU vs QUE, QUI ---
  ["ca-sa", "🏠", "c-q"],
  ["co-pa", "🍷", "c-q"],
  ["cu-na", "🛏️", "c-q"],
  ["que-so", "🧀", "c-q"],
  ["pa-que-te", "📦", "c-q"],
  ["bos-que", "🌲", "c-q"],
  ["ra-que-ta", "🎾", "c-q"],
  ["quí-mi-ca", "🧪", "c-q"],

  // --- CE, CI ---
  ["cie-lo", "🌤️", "ce-ci"],
  ["ci-ne", "🎬", "ce-ci"],
  ["ce-bo-lla", "🧅", "ce-ci"],
  ["ci-rue-la", "🫐", "ce-ci"],
  ["ma-ce-ta", "🪴", "ce-ci"],
  ["ce-pi-llo", "🪥", "ce-ci"],
  ["ce-re-za", "🍒", "ce-ci"],

  // --- GA, GO, GU vs GUE, GUI ---
  ["ga-to", "🐱", "g"],
  ["go-ta", "💧", "g"],
  ["gu-sa-no", "🐛", "g"],
  ["man-gue-ra", "🪴", "gue-gui"],
  ["gui-ta-rra", "🎸", "gue-gui"],
  ["á-gui-la", "🦅", "gue-gui"],
  ["tor-tu-gui-ta", "🐢", "gue-gui"],
  ["gue-rre-ro", "🛡️", "gue-gui"],

  // --- GE, GI ---
  ["gi-gan-te", "🗿", "ge-gi"],
  ["gi-ra-sol", "🌻", "ge-gi"],
  ["ge-me-los", "👥", "ge-gi"],
  ["co-le-gio", "🏫", "ge-gi"],
  ["ma-gia", "🪄", "ge-gi"],

  // --- GÜE, GÜI ---
  ["pin-güi-no", "🐧", "gue-gui-dieresis"],
  ["ci-güe-ña", "🪶", "gue-gui-dieresis"],
  ["pa-ra-güi-tas", "🌂", "gue-gui-dieresis"],

  // --- R suave vs RR fuerte ---
  ["pe-rro", "🐕", "rr"],
  ["ca-rro", "🛒", "rr"],
  ["zo-rro", "🦊", "rr"],
  ["go-rro", "🧢", "rr"],
  ["to-rre", "🗼", "rr"],
  ["lo-ro", "🦜", "r-suave"],
  ["pe-ra", "🍐", "r-suave"],
  ["ca-ra-col", "🐌", "r-suave"],
  ["co-ro-na", "👑", "r-suave"],
  ["ma-ri-po-sa", "🦋", "r-suave"],

  // --- MB y MP ---
  ["tam-bor", "🥁", "mb-mp"],
  ["trom-pa", "🐘", "mb-mp"],
  ["bom-bón", "🍬", "mb-mp"],
  ["cam-pa-na", "🔔", "mb-mp"],
  ["bom-be-ro", "🧑‍🚒", "mb-mp"],
  ["lám-pa-ra", "💡", "mb-mp"],
  ["som-bra", "👤", "mb-mp"],
  ["cam-po", "🌾", "mb-mp"],

  // --- H muda ---
  ["he-la-do", "🍦", "h"],
  ["ho-ja", "🍃", "h"],
  ["hue-vo", "🥚", "h"],
  ["hu-mo", "💨", "h"],
  ["hi-lo", "🧵", "h"],
  ["hue-so", "🦴", "h"],
  ["hos-pi-tal", "🏥", "h"],
  ["huelga", "🪧", "h"],

  // --- CH ---
  ["cho-co-la-te", "🍫", "ch"],
  ["chi-me-ne-a", "🏠", "ch"],
  ["chan-cho", "🐷", "ch"],
  ["le-che", "🥛", "ch"],
  ["cha-le-co", "🦺", "ch"],
  ["co-che", "🚗", "ch"],
  ["se-rru-cho", "🪚", "ch"],
  ["no-che", "🌃", "ch"],
];

export const GRADE2_WORDS: WordDef2[] = RAW.map(([s, emoji, pattern]) => ({
  word: s.replace(/-/g, ""),
  syllables: s.split("-"),
  emoji,
  pattern,
}));

export function getWordsByPattern(pattern: string): WordDef2[] {
  return GRADE2_WORDS.filter((w) => w.pattern === pattern);
}
