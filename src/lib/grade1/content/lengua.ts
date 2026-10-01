// Actividades de Lengua de 1.º grado (ruta de alfabetización inicial).
// Se generan a partir del banco de palabras y de letras: cada mundo de
// letras usa solo palabras que se pueden leer con las letras ya trabajadas.
import type { ActivityCard, ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import { LETTERS, LetterDef, TEACHING_ORDER, VOWELS, getLetter, lettersUpTo } from "@/lib/grade1/letters";
import { AMBIGUOUS_PICTURES, WORDS, WordDef, decodableWords, graphemes, rimeOf } from "@/lib/grade1/words";
import { Q, fromBank, numbered, pickOne, plain, q, randInt, sample, shuffle, wordCard } from "./util";

// --------------------------------------------------------------------------
// Ayudas
// --------------------------------------------------------------------------

// Palabras con un dibujo claro (las ambiguas no se usan donde solo se ve el
// dibujo).
const pictureWords = WORDS.filter((w) => !AMBIGUOUS_PICTURES.has(w.word));

function firstGrapheme(w: WordDef): string {
  return graphemes(w.word)[0];
}

function letterBigCard(l: LetterDef, upper = true): ActivityCard {
  return { id: l.id, big: upper ? l.upper : l.lower, say: l.nameSay, audio: l.audioName };
}

// Sílabas directas de una consonante con las vocales (respetando ca/co/cu,
// ga/go/gu).
function syllablesOf(letter: string): string[] {
  if (letter === "c") return ["ca", "co", "cu"];
  if (letter === "g") return ["ga", "go", "gu"];
  return ["a", "e", "i", "o", "u"].map((v) => letter + v);
}

function distractors<T>(pool: readonly T[], exclude: (x: T) => boolean, n: number): T[] {
  return sample(pool.filter((x) => !exclude(x)), n);
}

// --------------------------------------------------------------------------
// Generadores reutilizables (los usan varios mundos)
// --------------------------------------------------------------------------

// Leer una palabra y elegir su dibujo.
function readWordToPicture(id: string, target: WordDef, opts = 3): ActivitySpec {
  const others = distractors(pictureWords, (w) => w.word === target.word || w.emoji === target.emoji, opts - 1);
  return {
    type: "pick",
    id,
    title: "",
    prompt: "Leé la palabra y tocá su dibujo.",
    say: "Leé la palabra y tocá su dibujo.",
    promptBig: target.word,
    cards: shuffle([target, ...others].map((w) => wordCard(w))),
    answerIds: [target.word],
    hint: `Pista: leé despacito, sílaba por sílaba: ${target.syllables.join(" - ")}.`,
    skills: ["l-lectura-palabras", "l-comprension-lectora"],
  };
}

// Ver un dibujo y elegir la palabra escrita.
function pictureToWord(id: string, target: WordDef, pool: WordDef[]): ActivitySpec {
  const others = distractors(pool, (w) => w.word === target.word, 2);
  const filler = others.length < 2 ? distractors(pictureWords, (w) => w.word === target.word, 2 - others.length) : [];
  return {
    type: "pick",
    id,
    title: "",
    prompt: "¿Qué dice? Tocá la palabra que corresponde al dibujo.",
    promptEmoji: target.emoji,
    cards: shuffle([target, ...others, ...filler].map((w) => ({ id: w.word, big: w.word }))),
    answerIds: [target.word],
    hint: `Pista: fijate con qué letra empieza ${target.emoji}.`,
    skills: ["l-lectura-palabras"],
  };
}

// Armar una palabra con sílabas.
function buildSyllables(id: string, w: WordDef, knownLetters: string[]): ActivitySpec {
  const extra = sample(
    knownLetters
      .filter((l) => !getLetter(l)?.vowel)
      .flatMap(syllablesOf)
      .filter((s) => !w.syllables.map(plain).includes(s)),
    2
  );
  return {
    type: "build",
    id,
    title: "",
    prompt: "Armá la palabra con las sílabas.",
    say: `Armá la palabra ${w.word}.`,
    target: w.syllables.map(plain),
    tiles: shuffle([...w.syllables.map(plain), ...extra]),
    emoji: w.emoji,
    hint: `Pista: decí la palabra aplaudiendo: ${w.syllables.join(" - ")}.`,
    skills: ["l-silabas", "l-escritura"],
  };
}

// Armar una palabra con letras móviles.
function buildLetters(id: string, w: WordDef, knownLetters: string[]): ActivitySpec {
  const g = graphemes(w.word);
  const extra = sample(knownLetters.filter((l) => !g.includes(l)), 2);
  return {
    type: "build",
    id,
    title: "",
    prompt: "Escribí la palabra con las letras móviles.",
    say: `Escribí ${w.word}.`,
    target: g,
    tiles: shuffle([...g, ...extra]),
    emoji: w.emoji,
    hint: `Pista: decí la palabra muy despacio y escuchá cada sonido: ${w.word}.`,
    skills: ["l-escritura", "l-grafema-fonema"],
  };
}

function traceLetter(id: string, l: LetterDef, upper: boolean): ActivitySpec {
  return {
    type: "trace",
    id,
    title: "",
    prompt: `Repasá la ${upper ? "mayúscula" : "minúscula"} con el dedo.`,
    say: `Repasá la letra ${l.name} con el dedo, siguiendo los puntos.`,
    glyph: upper ? l.upper : l.lower,
    hint: "Pista: empezá desde arriba y seguí los puntos sin levantar el dedo.",
    skills: ["l-trazos"],
  };
}

// ¿Qué letra suena así? (fonema → letra)
function soundToLetter(id: string, l: LetterDef, pool: string[]): ActivitySpec {
  const others = distractors(pool, (x) => x === l.id, 2).map((x) => getLetter(x)!);
  return {
    type: "pick",
    id,
    title: "",
    prompt: "Escuchá el sonido. ¿Qué letra suena así?",
    say: l.phonemeSay,
    audio: l.audioPhoneme,
    cards: shuffle([l, ...others].map((x) => ({ id: x.id, big: x.lower }))),
    answerIds: [l.id],
    hint: `Pista: ${l.phonemeSay}.`,
    skills: ["l-grafema-fonema"],
  };
}

// ¿Cómo se llama esta letra? (nombre de la letra, distinto de su sonido)
function letterName(id: string, l: LetterDef, pool: string[], exploratory = false): ActivitySpec {
  const others = distractors(LETTERS.filter((x) => pool.includes(x.id)), (x) => x.id === l.id || x.name === l.name, 2);
  return {
    type: "pick",
    id,
    title: "",
    prompt: "¿Cómo se llama esta letra?",
    promptBig: `${l.upper} ${l.lower}`,
    cards: shuffle([l, ...others].map((x) => ({ id: x.id, label: x.name, say: x.name, audio: x.audioName }))),
    answerIds: [l.id],
    hint: "Pista: el nombre de la letra no es lo mismo que su sonido. Tocá 🔊 en cada opción.",
    skills: ["l-letra-nombre"],
    exploratory,
  };
}

// ¿Cuál empieza con esta letra? (dibujos)
function startsWithLetter(id: string, l: LetterDef): ActivitySpec {
  const yes = pictureWords.filter((w) => firstGrapheme(w) === l.id);
  const target = pickOne(yes.length ? yes : WORDS.filter((w) => firstGrapheme(w) === l.id));
  const others = distractors(pictureWords, (w) => firstGrapheme(w) === l.id || (l.id === "b" && firstGrapheme(w) === "v") || (l.id === "v" && firstGrapheme(w) === "b"), 2);
  return {
    type: "pick",
    id,
    title: "",
    prompt: `¿Cuál empieza con la ${l.upper}?`,
    say: `¿Cuál empieza con la ${l.name}? ${l.phonemeSay}.`,
    promptBig: l.upper,
    cards: shuffle([target, ...others].map((w) => wordCard(w))),
    answerIds: [target.word],
    hint: "Pista: tocá 🔊 en cada dibujo y escuchá cómo empieza.",
    skills: ["l-sonido-inicial", "l-grafema-fonema"],
  };
}

// Encontrar la sílaba que se escucha.
function findSyllable(id: string, letter: string, known: string[]): ActivitySpec {
  const own = syllablesOf(letter);
  const target = pickOne(own);
  const pool = [
    ...own.filter((s) => s !== target),
    ...known.filter((l) => l !== letter && !getLetter(l)?.vowel).flatMap(syllablesOf).filter((s) => s[s.length - 1] === target[target.length - 1]),
  ];
  const others = sample(pool, 2);
  return {
    type: "pick",
    id,
    title: "",
    prompt: "Escuchá y tocá la sílaba.",
    say: `Tocá: ${target}.`,
    cards: shuffle([target, ...others].map((s) => ({ id: s, big: s, say: s }))),
    answerIds: [target],
    hint: `Pista: la ${letter.toUpperCase()} con la ${target.slice(-1).toUpperCase()} dice «${target}».`,
    skills: ["l-silabas"],
  };
}

// Unir mayúscula con minúscula.
function matchCase(id: string, letters: LetterDef[]): ActivitySpec {
  return {
    type: "match",
    id,
    title: "",
    prompt: "Uní cada mayúscula con su minúscula.",
    pairs: letters.map((l) => ({ left: l.upper, right: l.lower })),
    hint: "Pista: la mayúscula es la grande; la minúscula, la chica. Suenan igual.",
    skills: ["l-letra-nombre"],
  };
}

// --------------------------------------------------------------------------
// Mundos de letras (vocales y consonantes)
// --------------------------------------------------------------------------

function vowelWorld(ids: string[]): ActivitySpec[] {
  const ls = ids.map((x) => getLetter(x)!);
  const acts: ActivitySpec[] = [];
  for (const l of ls) {
    acts.push({
      type: "pick",
      id: `find-${l.id}`,
      title: "",
      prompt: `Tocá la ${l.upper}.`,
      say: `Tocá la letra ${l.name}.`,
      cards: shuffle([l, ...distractors(VOWELS, (x) => x.id === l.id, 2)].map((x) => letterBigCard(x, Math.random() < 0.6))),
      answerIds: [l.id],
      hint: `Pista: la ${l.upper} también se escribe así: ${l.lower}.`,
      skills: ["l-vocales", "l-letra-nombre"],
    });
    acts.push(startsWithLetter(`start-${l.id}`, l));
  }
  for (const l of sample(ls, Math.min(2, ls.length))) acts.push(soundToLetter(`snd-${l.id}`, l, VOWELS.map((v) => v.id)));
  acts.push(traceLetter(`trace-${ls[0].id}`, ls[0], true));
  if (ls.length >= 3) acts.push(matchCase("case", ls));
  // Todas las vocales: ¿con qué vocal empieza?
  if (ids.length === 5) {
    for (const w of sample(pictureWords.filter((w) => getLetter(firstGrapheme(w))?.vowel), 2)) {
      const first = firstGrapheme(w);
      acts.push({
        type: "pick",
        id: `vow-${w.word}`,
        title: "",
        prompt: "¿Con qué vocal empieza?",
        promptEmoji: w.emoji,
        say: `¿Con qué vocal empieza ${w.word}?`,
        cards: shuffle(VOWELS.map((v) => ({ id: v.id, big: v.upper, say: v.nameSay }))),
        answerIds: [first],
        hint: `Pista: decí ${w.word} despacito y escuchá el primer sonido.`,
        skills: ["l-vocales", "l-sonido-inicial"],
      });
    }
  }
  return acts;
}

function consonantWorld(ids: string[]): ActivitySpec[] {
  const last = ids[ids.length - 1];
  const known = lettersUpTo(last);
  const acts: ActivitySpec[] = [];
  for (const id of ids) {
    const l = getLetter(id)!;
    acts.push(letterName(`name-${id}`, l, known));
    acts.push(soundToLetter(`snd-${id}`, l, known.filter((x) => x !== "v" && x !== "b").concat(id === "b" || id === "v" ? [] : [])));
    acts.push(startsWithLetter(`start-${id}`, l));
    if (ids.length === 1) acts.push(findSyllable(`syl-${id}`, id, known));
    const readable = decodableWords(known, id).filter((w) => pictureWords.includes(w));
    if (readable.length) {
      const [a, b] = sample(readable, 2);
      acts.push(readWordToPicture(`read-${id}`, a));
      if (b && ids.length === 1) acts.push(buildSyllables(`build-${id}`, b, known));
    }
  }
  const l0 = getLetter(ids[0])!;
  acts.push(traceLetter(`trace-${l0.id}`, l0, Math.random() < 0.5));
  // B y V: suenan igual, se escriben distinto.
  if (ids.includes("b") && ids.includes("v")) {
    const bv = shuffle(pictureWords.filter((w) => ["b", "v"].includes(firstGrapheme(w)))).slice(0, 2);
    for (const w of bv) {
      acts.push({
        type: "pick",
        id: `bv-${w.word}`,
        title: "",
        prompt: "¿Con cuál se escribe? Suenan igual…",
        promptEmoji: w.emoji,
        say: `¿${w.word} se escribe con be o con ve?`,
        cards: [
          { id: "b", big: "B b", say: "be" },
          { id: "v", big: "V v", say: "ve" },
        ],
        answerIds: [firstGrapheme(w)],
        hint: `Pista: mirá cómo se escribe: ${w.word}.`,
        skills: ["l-grafema-fonema", "l-escritura"],
      });
    }
  }
  return acts;
}

function integrationWorld(known: string[], n: number): ActivitySpec[] {
  const readable = decodableWords(known).filter((w) => pictureWords.includes(w));
  const picks = sample(readable, Math.min(readable.length, n));
  const acts: ActivitySpec[] = [];
  picks.forEach((w, i) => {
    if (i % 3 === 0) acts.push(readWordToPicture(`ir-${i}`, w));
    else if (i % 3 === 1) acts.push(pictureToWord(`ip-${i}`, w, readable));
    else acts.push(buildSyllables(`ib-${i}`, w, known));
  });
  return acts;
}

// --------------------------------------------------------------------------
// Bancos de preguntas escritas a mano
// --------------------------------------------------------------------------

const CONVERSACION: Q[] = [
  q("Llegás a la escuela a la mañana. ¿Qué decís?", [["🌞", "¡Buen día!"], ["🌙", "¡Buenas noches!"], ["👋", "¡Chau!"]], 0, "Pista: es de mañana y recién llegás.", { promptEmoji: "🏫" }),
  q("Tu compañera te presta un lápiz. ¿Qué le decís?", [["🙏", "¡Gracias!"], ["😠", "¡Dame!"], ["🤐", "Nada"]], 0, "Pista: cuando alguien nos ayuda…", { promptEmoji: "✏️" }),
  q("Querés pedir la goma. ¿Cómo la pedís?", [["🙂", "¿Me prestás la goma, por favor?"], ["😤", "¡Dame la goma!"], ["🙈", "La agarro sin pedir"]], 0, "Pista: hay una palabra mágica para pedir."),
  q("Un compañero está hablando en la ronda. ¿Qué hacés?", [["👂", "Escucho y espero mi turno"], ["🗯️", "Hablo encima"], ["🏃", "Me voy"]], 0, "Pista: en la ronda cada uno tiene su turno.", { promptEmoji: "🗣️" }),
  q("Te vas de la escuela a tu casa. ¿Qué decís?", [["👋", "¡Chau, hasta mañana!"], ["🌞", "¡Buen día!"], ["🙏", "Perdón"]], 0, "Pista: te estás yendo.", { promptEmoji: "🏠" }),
  q("Sin querer, le pisaste el pie a alguien. ¿Qué decís?", [["😔", "¡Perdón!"], ["😂", "Me río"], ["🤷", "No digo nada"]], 0, "Pista: fue sin querer, pero le dolió."),
  q("Querés decir algo en la ronda. ¿Qué hacés?", [["✋", "Levanto la mano"], ["📢", "Grito fuerte"], ["😶", "Interrumpo"]], 0, "Pista: así la seño sabe que querés hablar.", { promptEmoji: "🙋" }),
  q("Llega una persona nueva al grado. ¿Qué le decís?", [["😊", "¡Hola! ¿Cómo te llamás?"], ["🙄", "Nada"], ["🚪", "¡Andate!"]], 0, "Pista: saludamos y preguntamos su nombre."),
  q("La seño pregunta: «¿Qué comiste hoy?». ¿Cuál es una buena respuesta?", [["🍝", "Comí fideos"], ["⚽", "Me gusta la pelota"], ["🐶", "Tengo un perro"]], 0, "Pista: la respuesta tiene que ser sobre la comida.", { promptEmoji: "❓" }),
  q("Tu amigo te cuenta que está triste. ¿Qué hacés?", [["🤗", "Lo escucho y lo ayudo"], ["😆", "Me río"], ["🙉", "No lo escucho"]], 0, "Pista: ¿qué te gustaría que hicieran con vos?"),
];

const SONIDOS: Q[] = [
  q("¿Quién hace «muuu»?", [["🐄", "Vaca"], ["🐶", "Perro"], ["🐱", "Gato"]], 0, "Pista: da leche."),
  q("¿Quién hace «guau guau»?", [["🐶", "Perro"], ["🦆", "Pato"], ["🐑", "Oveja"]], 0, "Pista: cuida la casa."),
  q("¿Quién hace «miau»?", [["🐱", "Gato"], ["🐄", "Vaca"], ["🐔", "Gallina"]], 0, "Pista: le gusta el ratón."),
  q("¿Quién hace «cuac cuac»?", [["🦆", "Pato"], ["🐶", "Perro"], ["🐴", "Caballo"]], 0, "Pista: nada en la laguna."),
  q("¿Quién hace «beee»?", [["🐑", "Oveja"], ["🐱", "Gato"], ["🦁", "León"]], 0, "Pista: nos da lana."),
  q("¿Qué hace «tic tac»?", [["⏰", "Reloj"], ["🚗", "Auto"], ["🔔", "Campana"]], 0, "Pista: marca la hora."),
  q("¿Qué hace «din don»?", [["🔔", "Campana"], ["⏰", "Reloj"], ["🥁", "Tambor"]], 0, "Pista: suena en la escuela o en la iglesia."),
  q("¿Qué hace «pi pi»?", [["🚗", "Bocina del auto"], ["🐄", "Vaca"], ["🌧️", "Lluvia"]], 0, "Pista: la tocan para avisar en la calle."),
  q("¿Qué suena «plic, plic, plic»?", [["🌧️", "Lluvia"], ["🐶", "Perro"], ["🔔", "Campana"]], 0, "Pista: cae del cielo."),
  q("¿Quién hace «kikirikí»?", [["🐓", "Gallo"], ["🐑", "Oveja"], ["🐟", "Pez"]], 0, "Pista: canta a la mañana temprano."),
  q("¿Qué suena «fiuuu, fiuuu» en la Patagonia?", [["🌬️", "Viento"], ["🐱", "Gato"], ["⏰", "Reloj"]], 0, "Pista: en Santa Cruz sopla muy fuerte."),
];

const CONSIGNAS: Q[] = [
  q("Tocá el lápiz.", [["✏️", "Lápiz"], ["📕", "Libro"], ["✂️", "Tijera"]], 0, "Pista: sirve para escribir."),
  q("Tocá todos los útiles para pintar.", [["🖍️", "Crayón"], ["🖌️", "Pincel"], ["🍎", "Manzana"], ["⚽", "Pelota"]], [0, 1], "Pista: hay dos."),
  q("Tocá lo que usamos para cortar papel.", [["✂️", "Tijera"], ["📏", "Regla"], ["🎒", "Mochila"]], 0, "Pista: tiene dos hojas filosas."),
  q("Tocá todas las frutas.", [["🍎", "Manzana"], ["🍌", "Banana"], ["🚗", "Auto"], ["🧦", "Media"]], [0, 1], "Pista: se comen y son dulces."),
  q("Tocá el animal que vuela.", [["🦅", "Cóndor"], ["🐟", "Pez"], ["🐢", "Tortuga"]], 0, "Pista: tiene alas."),
  q("Primero se pone la media y después… ¿qué?", [["👟", "Zapatilla"], ["🧢", "Gorra"], ["🧤", "Guantes"]], 0, "Pista: va en el pie, arriba de la media."),
  q("Tocá lo que se guarda en la mochila.", [["📒", "Cuaderno"], ["🛏️", "Cama"], ["🚲", "Bici"]], 0, "Pista: lo llevamos a la escuela."),
  q("Tocá todos los animales.", [["🐶", "Perro"], ["🐴", "Caballo"], ["🌳", "Árbol"], ["🪑", "Silla"]], [0, 1], "Pista: hay dos, se mueven solos."),
  q("Para pintar, ¿qué hay que hacer primero?", [["🖍️", "Agarrar los colores"], ["🧹", "Barrer"], ["🛁", "Bañarse"]], 0, "Pista: sin colores no se puede pintar."),
  q("Tocá lo que se usa cuando llueve.", [["☂️", "Paraguas"], ["🕶️", "Anteojos de sol"], ["🩴", "Ojotas"]], 0, "Pista: nos cubre del agua."),
];

const NOMBRES = ["ana", "sol", "mía", "tomás", "lola", "pedro", "sofía", "juan", "emma", "bruno", "lucas", "valentina", "nina", "leo", "martina"];

function nombresWorld(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (const n of sample(NOMBRES, 3)) {
    const first = graphemes(n)[0];
    const l = getLetter(first)!;
    const others = distractors(TEACHING_ORDER, (x) => x === first, 2).map((x) => getLetter(x)!);
    const Name = n[0].toUpperCase() + n.slice(1);
    acts.push({
      type: "pick",
      id: `ini-${n}`,
      title: "",
      prompt: `¿Con qué letra empieza ${Name}?`,
      promptBig: Name,
      say: `¿Con qué letra empieza ${Name}?`,
      cards: shuffle([l, ...others].map((x) => letterBigCard(x))),
      answerIds: [first],
      hint: "Pista: los nombres empiezan con mayúscula. Mirá la primera letra.",
      skills: ["l-letra-nombre", "l-sonido-inicial"],
    });
  }
  // ¿Cuál es el nombre más largo?
  const trio = sample(NOMBRES, 3);
  const longest = [...trio].sort((a, b) => b.length - a.length)[0];
  if (trio.filter((x) => x.length === longest.length).length === 1) {
    acts.push({
      type: "pick",
      id: "long-name",
      title: "",
      prompt: "¿Qué nombre tiene más letras?",
      cards: shuffle(trio.map((x) => ({ id: x, big: x[0].toUpperCase() + x.slice(1) }))),
      answerIds: [longest],
      hint: "Pista: contá las letras de cada nombre.",
      skills: ["l-letra-nombre"],
    });
  }
  for (const n of sample(NOMBRES.filter((x) => x.length <= 5), 2)) {
    const Name = n[0].toUpperCase() + n.slice(1);
    acts.push({
      type: "count",
      id: `len-${n}`,
      title: "",
      prompt: `¿Cuántas letras tiene ${Name}?`,
      emoji: "🔤",
      groups: [n.length],
      answer: n.length,
      choices: shuffle([n.length, n.length + 1, n.length - 1]),
      hint: `Pista: señalá cada letra de ${Name} y contá.`,
      skills: ["l-letra-nombre"],
    });
  }
  acts.push({
    type: "build",
    id: "build-name",
    title: "",
    prompt: "Armá el nombre ANA con las letras.",
    say: "Armá el nombre Ana.",
    target: ["A", "n", "a"],
    tiles: shuffle(["A", "n", "a", "m", "o"]),
    emoji: "👧",
    hint: "Pista: los nombres empiezan con mayúscula: A-n-a.",
    skills: ["l-escritura", "l-letra-nombre"],
  });
  return acts;
}

// Palabras largas y cortas: contar sílabas (aplaudir).
function largasCortasWorld(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const bySyl = (n: number) => pictureWords.filter((w) => w.syllables.length === n);
  for (let i = 0; i < 4; i++) {
    const n = randInt(1, 4);
    const w = pickOne(bySyl(n));
    acts.push({
      type: "pick",
      id: `clap-${i}`,
      title: "",
      prompt: "Decí la palabra aplaudiendo. ¿Cuántos aplausos?",
      promptEmoji: w.emoji,
      say: `${w.word}. ¿Cuántos aplausos?`,
      cards: [1, 2, 3, 4].map((k) => ({ id: String(k), big: "👏".repeat(k), label: String(k), say: String(k) })),
      answerIds: [String(w.syllables.length)],
      hint: `Pista: ${w.syllables.join(" - ")}.`,
      skills: ["l-segmentacion"],
    });
  }
  for (let i = 0; i < 3; i++) {
    const long = pickOne([...bySyl(3), ...bySyl(4), ...bySyl(5)]);
    const shorts = sample([...bySyl(1), ...bySyl(2)], 2);
    acts.push({
      type: "pick",
      id: `long-${i}`,
      title: "",
      prompt: "¿Cuál es la palabra más larga? (no el dibujo más grande)",
      say: "¿Cuál es la palabra más larga? Tocá 🔊 en cada dibujo y aplaudí.",
      cards: shuffle([long, ...shorts].map((w) => wordCard(w))),
      answerIds: [long.word],
      hint: "Pista: la palabra más larga tiene más aplausos.",
      skills: ["l-segmentacion"],
    });
  }
  const short = pickOne(bySyl(1));
  const longs = sample([...bySyl(3), ...bySyl(4)], 2);
  acts.push({
    type: "pick",
    id: "short",
    title: "",
    prompt: "¿Cuál es la palabra más corta?",
    cards: shuffle([short, ...longs].map((w) => wordCard(w))),
    answerIds: [short.word],
    hint: "Pista: la más corta tiene un solo aplauso.",
    skills: ["l-segmentacion"],
  });
  return acts;
}

function rimasWorld(n: number): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const groups = new Map<string, WordDef[]>();
  for (const w of pictureWords) {
    const r = rimeOf(w.word);
    if (r.length < 2) continue; // «sol» → «ol» sí; vocal sola no
    groups.set(r, [...(groups.get(r) ?? []), w]);
  }
  const rich = [...groups.values()].filter((g) => g.length >= 2);
  const usedR = new Set<string>();
  for (let i = 0, tries = 0; i < n && rich.length && tries < 60; tries++) {
    const [a, b] = sample(pickOne(rich), 2);
    if (usedR.has(rimeOf(a.word))) continue;
    usedR.add(rimeOf(a.word));
    i++;
    const ra = rimeOf(a.word);
    const others = distractors(pictureWords, (w) => rimeOf(w.word) === ra || rimeOf(w.word).slice(-2) === ra.slice(-2), 2);
    acts.push({
      type: "pick",
      id: `rima-${acts.length}`,
      title: "",
      prompt: `¿Qué palabra rima con ${a.word}?`,
      promptEmoji: a.emoji,
      say: `¿Qué palabra rima con ${a.word}? Terminan igual.`,
      cards: shuffle([b, ...others].map((w) => wordCard(w))),
      answerIds: [b.word],
      hint: `Pista: tiene que terminar como ${a.word}: «…${ra}».`,
      skills: ["l-rimas"],
    });
  }
  return acts;
}

function silabaWorld(pos: "first" | "last"): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const key = (w: WordDef) => plain(pos === "first" ? w.syllables[0] : w.syllables[w.syllables.length - 1]);
  const multi = pictureWords.filter((w) => w.syllables.length >= 2);
  const usedK = new Set<string>();
  for (let i = 0, tries = 0; i < 6 && tries < 80; i++, tries++) {
    const a = pickOne(multi);
    const mates = multi.filter((w) => w.word !== a.word && key(w) === key(a));
    if (!mates.length || usedK.has(key(a))) {
      i--;
      continue;
    }
    usedK.add(key(a));
    const b = pickOne(mates);
    const others = distractors(multi, (w) => key(w) === key(a), 2);
    acts.push({
      type: "pick",
      id: `syl-${pos}-${i}`,
      title: "",
      prompt: pos === "first" ? `¿Qué palabra empieza como ${a.word}?` : `¿Qué palabra termina como ${a.word}?`,
      promptEmoji: a.emoji,
      say:
        pos === "first"
          ? `¿Qué palabra empieza como ${a.word}? Empieza con ${key(a)}.`
          : `¿Qué palabra termina como ${a.word}? Termina con ${key(a)}.`,
      cards: shuffle([b, ...others].map((w) => wordCard(w))),
      answerIds: [b.word],
      hint: `Pista: ${pos === "first" ? "empieza" : "termina"} con «${key(a)}».`,
      skills: ["l-silaba-inicial"],
    });
    if (acts.length >= 6) break;
  }
  // Sílabas sueltas: ¿con qué sílaba empieza?
  for (let i = 0; i < 2; i++) {
    const a = pickOne(multi);
    const correct = key(a);
    const others = sample([...new Set(multi.map(key))].filter((s) => s !== correct), 2);
    acts.push({
      type: "pick",
      id: `which-${pos}-${i}`,
      title: "",
      prompt: pos === "first" ? "¿Con qué sílaba empieza?" : "¿Con qué sílaba termina?",
      promptEmoji: a.emoji,
      say: `${a.word}. ${pos === "first" ? "¿Con qué sílaba empieza?" : "¿Con qué sílaba termina?"}`,
      cards: shuffle([correct, ...others].map((s) => ({ id: s, big: s, say: s }))),
      answerIds: [correct],
      hint: `Pista: decí ${a.syllables.join(" - ")}.`,
      skills: ["l-silaba-inicial", "l-silabas"],
    });
  }
  return acts;
}

function primerSonidoWorld(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const sounds = ["a", "e", "i", "o", "u", "m", "p", "l", "s", "t", "n"].map((x) => getLetter(x)!);
  for (const l of sample(sounds, 6)) {
    const yes = pictureWords.filter((w) => firstGrapheme(w) === l.id);
    if (!yes.length) continue;
    const target = pickOne(yes);
    const others = distractors(pictureWords, (w) => firstGrapheme(w) === l.id || w.word.startsWith("h"), 2);
    acts.push({
      type: "pick",
      id: `ps-${l.id}`,
      title: "",
      prompt: "¿Cuál empieza con este sonido?",
      say: `¿Cuál empieza con el sonido ${l.phonemeSay}?`,
      audio: l.audioPhoneme,
      cards: shuffle([target, ...others].map((w) => wordCard(w))),
      answerIds: [target.word],
      hint: `Pista: ${l.phonemeSay}. Tocá 🔊 en cada dibujo.`,
      skills: ["l-sonido-inicial"],
    });
  }
  // Odd one out: tres empiezan igual, uno no.
  const l = getLetter(pickOne(["m", "p", "s"]))!;
  const same = sample(pictureWords.filter((w) => firstGrapheme(w) === l.id), 2);
  const diff = distractors(pictureWords, (w) => firstGrapheme(w) === l.id, 1);
  acts.push({
    type: "pick",
    id: "odd",
    title: "",
    prompt: "Dos empiezan con el mismo sonido. ¿Cuál es el distinto?",
    cards: shuffle([...same, ...diff].map((w) => wordCard(w))),
    answerIds: [diff[0].word],
    hint: "Pista: tocá 🔊 en cada dibujo y escuchá el primer sonido.",
    skills: ["l-sonido-inicial"],
  });
  return acts;
}

function abecedarioWorld(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  const explore = ["h", "ch", "y", "z", "q", "k", "x", "w"].map((x) => getLetter(x)!);
  for (const l of sample(explore, 4)) acts.push(letterName(`ex-${l.id}`, l, LETTERS.map((x) => x.id), true));
  const h = getLetter("h")!;
  acts.push({
    type: "pick",
    id: "h-muda",
    title: "",
    prompt: "La hache no suena. ¿Cuál empieza con H?",
    say: "La hache es una letra que no suena. ¿Cuál de estos se escribe con hache?",
    cards: shuffle([wordCard(WORDS.find((w) => w.word === "helado")!), wordCard(WORDS.find((w) => w.word === "oso")!), wordCard(WORDS.find((w) => w.word === "uva")!)]),
    answerIds: ["helado"],
    hint: `Pista: ${h.phonemeSay}.`,
    skills: ["l-letra-nombre"],
    exploratory: true,
  });
  const abc = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
  const start = randInt(0, abc.length - 4);
  const seq = abc.slice(start, start + 4);
  acts.push({
    type: "order",
    id: "abc-order",
    title: "",
    prompt: "Ordená las letras como en el abecedario.",
    items: shuffle(seq),
    correctOrder: [],
    hint: "Pista: cantá el abecedario despacito: A, B, C…",
    skills: ["l-letra-nombre"],
  });
  const i = randInt(1, abc.length - 2);
  acts.push({
    type: "pick",
    id: "abc-next",
    title: "",
    prompt: `En el abecedario, ¿qué letra viene después de la ${abc[i]}?`,
    promptBig: `${abc[i]} → ?`,
    cards: shuffle([abc[i + 1], abc[i - 1], abc[(i + 5) % abc.length]].map((x) => ({ id: x, big: x }))),
    answerIds: [abc[i + 1]],
    hint: "Pista: mirá el abecedario del aula.",
    skills: ["l-letra-nombre"],
  });
  return fixOrder(acts);
}

// El componente de ordenar recibe los ítems mezclados y el orden correcto
// como índices; acá se calcula a partir del orden alfabético esperado.
function fixOrder(acts: ActivitySpec[]): ActivitySpec[] {
  return acts.map((a) => {
    if (a.type !== "order" || a.correctOrder.length) return a;
    const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    const sorted = [...a.items].sort((x, y) => alphabet.indexOf(x) - alphabet.indexOf(y));
    return { ...a, correctOrder: sorted.map((s) => a.items.indexOf(s)) };
  });
}

function orderActivity(id: string, prompt: string, ordered: string[], hint: string, skills: string[]): ActivitySpec {
  const items = shuffle(ordered);
  return {
    type: "order",
    id,
    title: "",
    prompt,
    items,
    correctOrder: ordered.map((s) => items.indexOf(s)),
    hint,
    skills,
  };
}

// --------------------------------------------------------------------------
// Lectura de oraciones y textos
// --------------------------------------------------------------------------

const SENTENCES: { text: string; emoji: string; wrong: string[] }[] = [
  { text: "El gato toma leche.", emoji: "🐱🥛", wrong: ["🐶🦴", "🐭🧀"] },
  { text: "La luna sale de noche.", emoji: "🌙🌃", wrong: ["☀️🏖️", "🌧️☂️"] },
  { text: "Mamá come una pera.", emoji: "👩🍐", wrong: ["👨🍌", "👦🍎"] },
  { text: "El sapo salta.", emoji: "🐸💨", wrong: ["🐢😴", "🐟🌊"] },
  { text: "Papá lee un libro.", emoji: "👨📖", wrong: ["👨🍳", "👨⚽"] },
  { text: "La nena tiene un globo.", emoji: "👧🎈", wrong: ["👧🧸", "👦🎈"] },
  { text: "El pato nada en el lago.", emoji: "🦆🏞️", wrong: ["🦆🌳", "🐱🏞️"] },
  { text: "Sopla mucho viento.", emoji: "🌬️🍃", wrong: ["☀️😎", "❄️⛄"] },
  { text: "El nene toma sopa.", emoji: "👦🍲", wrong: ["👦🍦", "👧🍲"] },
  { text: "La vaca come pasto.", emoji: "🐄🌿", wrong: ["🐴🥕", "🐑🧶"] },
];

function oracionesWorld(): ActivitySpec[] {
  return sample(SENTENCES, 8).map((s, i) => ({
    type: "pick",
    id: `or-${i}`,
    title: "",
    prompt: "Leé la oración y tocá el dibujo que corresponde.",
    promptBig: s.text,
    cards: shuffle([s.emoji, ...s.wrong].map((e) => ({ id: e, big: e }))),
    answerIds: [s.emoji],
    hint: "Pista: leé palabra por palabra. ¿Quién es? ¿Qué hace?",
    skills: ["l-lectura-oraciones", "l-comprension-lectora"],
  }));
}

function separoWorld(): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (const s of sample(SENTENCES, 4)) {
    const words = s.text.replace(".", "").split(" ");
    const n = words.length;
    acts.push({
      type: "pick",
      id: `cnt-${n}-${acts.length}`,
      title: "",
      prompt: "¿Cuántas palabras tiene la oración?",
      promptBig: s.text,
      cards: shuffle([n, n - 1, n + 1].map((k) => ({ id: String(k), big: String(k) }))),
      answerIds: [String(n)],
      hint: "Pista: entre palabra y palabra hay un espacio.",
      skills: ["l-lectura-oraciones"],
    });
  }
  for (const s of sample(SENTENCES, 3)) {
    const ok = s.text;
    const noCap = ok[0].toLowerCase() + ok.slice(1);
    const glued = ok.replace(" ", "");
    const noDot = ok.replace(".", "");
    acts.push({
      type: "pick",
      id: `well-${acts.length}`,
      title: "",
      prompt: "¿Cuál está bien escrita?",
      cards: shuffle([ok, pickOne([noCap, noDot]), glued].map((t) => ({ id: t, label: t, say: t }))),
      answerIds: [ok],
      hint: "Pista: empieza con mayúscula, las palabras van separadas y termina con punto.",
      skills: ["l-lectura-oraciones", "l-escritura"],
    });
  }
  const s = pickOne(SENTENCES);
  acts.push(orderActivity("ord-sent", "Ordená las palabras para formar la oración.", s.text.replace(".", "").split(" "), `Pista: la oración es: «${s.text}»`, ["l-lectura-oraciones", "l-escritura"]));
  return acts;
}

// Textos breves y cuentos (originales).
const STORIES: { title: string; text: string; qs: Q[] }[] = [
  {
    title: "El guanaco y el viento",
    text: "Había una vez un guanaco chiquito que vivía en la meseta. Un día sopló un viento muy fuerte y se voló su gorro de lana. El guanaco corrió y corrió, pero no lo alcanzó. Entonces un cóndor bajó volando, atrapó el gorro y se lo devolvió. El guanaco le dio las gracias y se hicieron amigos.",
    qs: [
      q("¿Quién es el personaje principal?", [["🦙", "Un guanaco"], ["🐧", "Un pingüino"], ["🐶", "Un perro"]], 0),
      q("¿Dónde vivía?", [["🏜️", "En la meseta"], ["🌊", "En el mar"], ["🏙️", "En la ciudad"]], 0),
      q("¿Qué problema tuvo?", [["🧢", "Se le voló el gorro"], ["🍎", "Tenía hambre"], ["🌧️", "Se mojó"]], 0),
      q("¿Quién lo ayudó?", [["🦅", "Un cóndor"], ["🐟", "Un pez"], ["🐱", "Un gato"]], 0),
      q("¿Cómo termina el cuento?", [["🤝", "Se hacen amigos"], ["😢", "Se pelean"], ["😴", "Se duermen"]], 0),
    ],
  },
  {
    title: "La semilla de Lola",
    text: "Lola plantó una semilla en una maceta. Todos los días la regaba y la ponía al sol. Al principio no pasaba nada y Lola se puso triste. Pero una mañana vio una hojita verde. Siguió cuidándola y, en primavera, ¡salió una flor amarilla!",
    qs: [
      q("¿Qué plantó Lola?", [["🌱", "Una semilla"], ["🧸", "Un oso"], ["🪨", "Una piedra"]], 0),
      q("¿Qué hacía todos los días?", [["💧", "La regaba"], ["⚽", "Jugaba a la pelota"], ["📺", "Miraba tele"]], 0),
      q("¿Por qué se puso triste?", [["⏳", "Porque no crecía nada"], ["🌧️", "Porque llovía"], ["🐶", "Porque se fue el perro"]], 0),
      q("¿Qué salió al final?", [["🌼", "Una flor amarilla"], ["🍎", "Una manzana"], ["🐛", "Un gusano"]], 0),
    ],
  },
  {
    title: "El pingüino que no sabía nadar",
    text: "Pipo era un pingüino que vivía en la costa de Santa Cruz. Todos sus amigos nadaban, pero a Pipo le daba miedo el agua fría. Su abuela le dijo: «Probá de a poquito». Pipo metió una pata, después la otra… y al final se tiró al mar. ¡Nadar era divertido!",
    qs: [
      q("¿Cómo se llama el pingüino?", [["🐧", "Pipo"], ["🦙", "Lola"], ["🐱", "Michi"]], 0),
      q("¿Qué le daba miedo?", [["🌊", "El agua fría"], ["🌙", "La noche"], ["🐶", "Los perros"]], 0),
      q("¿Quién le dio un consejo?", [["👵", "Su abuela"], ["👮", "Un policía"], ["🦅", "Un cóndor"]], 0),
      q("¿Qué descubrió al final?", [["😄", "Que nadar era divertido"], ["😢", "Que no podía"], ["🏠", "Que quería irse"]], 0),
    ],
  },
];

function cuentosWorld(listening: boolean): ActivitySpec[] {
  const acts: ActivitySpec[] = [];
  for (const st of sample(STORIES, 2)) {
    sample(st.qs, 4).forEach((item, k) => {
      const base = fromBank([item], 1, `st-${st.title.length}-${acts.length}`, listening ? ["l-comprension-oral", "l-literatura"] : ["l-comprension-lectora"])[0];
      if (base.type === "pick") acts.push({ ...base, story: { title: st.title, text: st.text }, storyFirst: k === 0 });
    });
  }
  return acts;
}

const TEXTOS_BREVES: Q[] = [
  q("Leé: «Hoy es el cumple de Sol. Hay torta y globos.» ¿Qué festejan?", [["🎂", "Un cumpleaños"], ["🎄", "Navidad"], ["🏫", "El primer día"]], 0, "Pista: buscá la palabra «cumple».", { promptEmoji: "🎈" }),
  q("Leé: «El zorro tiene la cola larga y come de noche.» ¿Cuándo come?", [["🌙", "De noche"], ["☀️", "De día"], ["🌅", "A la tarde"]], 0, "Pista: buscá la palabra «noche».", { promptEmoji: "🦊" }),
  q("Leé: «La mesa tiene un mantel rojo.» ¿De qué color es el mantel?", [["🟥", "Rojo"], ["🟦", "Azul"], ["🟩", "Verde"]], 0, "Pista: buscá la palabra después de «mantel»."),
  q("Leé: «Tomás pone la pelota en la caja.» ¿Dónde está la pelota?", [["📦", "En la caja"], ["🛏️", "En la cama"], ["🎒", "En la mochila"]], 0, "Pista: leé el final de la oración.", { promptEmoji: "⚽" }),
  q("Leé: «Sopa de fideos y una pera.» ¿Qué tipo de texto es?", [["📝", "Un menú"], ["📖", "Un cuento"], ["💌", "Una carta"]], 0, "Pista: dice qué vamos a comer."),
  q("Leé: «Mi perro Lupa es negro y le gusta correr.» ¿Cómo se llama el perro?", [["🐕", "Lupa"], ["🐈", "Sol"], ["🦆", "Pato"]], 0, "Pista: el nombre empieza con mayúscula.", { promptEmoji: "🐶" }),
  q("Leé: «El lunes vamos al museo.» ¿Qué día van?", [["1️⃣", "El lunes"], ["5️⃣", "El viernes"], ["7️⃣", "El domingo"]], 0, "Pista: buscá el nombre del día."),
  q("Leé: «Hace frío. Ponete la campera.» ¿Qué hay que ponerse?", [["🧥", "La campera"], ["🩳", "El short"], ["🩴", "Las ojotas"]], 0, "Pista: buscá la palabra después de «ponete».", { promptEmoji: "❄️" }),
  q("Leé: «La ballena vive en el mar.» ¿Dónde vive la ballena?", [["🌊", "En el mar"], ["🌳", "En el bosque"], ["🏜️", "En la meseta"]], 0, "Pista: leé el final de la oración.", { promptEmoji: "🐋" }),
];

const POEMAS: Q[] = [
  q("Escuchá: «Un ratón con un botón / se fue a ver a su amigo el león.» ¿Qué palabra rima con ratón?", [["🔘", "Botón"], ["🐶", "Perro"], ["🍎", "Manzana"]], 0, "Pista: terminan en «-ón».", { promptEmoji: "🐭" }),
  q("Escuchá: «Una vaca muy flaca / comía una galleta en la hamaca.» ¿Qué rima con vaca?", [["🐄", "Flaca"], ["🍪", "Galleta"], ["☀️", "Sol"]], 0, "Pista: terminan en «-aca».", { promptEmoji: "🐄" }),
  q("Escuchá: «Al sol le pido calor, / a la tierra le pido una flor.» ¿Qué rima con calor?", [["🌸", "Flor"], ["🌍", "Tierra"], ["☀️", "Sol"]], 0, "Pista: terminan en «-or».", { promptEmoji: "☀️" }),
  q("¿Qué es una copla?", [["🎶", "Un versito con rima"], ["📰", "Una noticia"], ["🧾", "Una lista de compras"]], 0, "Pista: se canta o se recita."),
  q("Escuchá: «Pato, pato, ¿dónde está tu zapato?» ¿Qué rima con pato?", [["👞", "Zapato"], ["🐟", "Pez"], ["🌙", "Luna"]], 0, "Pista: terminan en «-ato».", { promptEmoji: "🦆" }),
  q("En una ronda, ¿qué hacemos?", [["💃", "Cantamos tomados de la mano"], ["😴", "Dormimos"], ["📺", "Miramos tele"]], 0, "Pista: es un juego en círculo con canción."),
  q("Escuchá: «Una estrella en el cielo / brilla sobre el hielo.» ¿Qué rima con cielo?", [["🧊", "Hielo"], ["⭐", "Estrella"], ["🌳", "Árbol"]], 0, "Pista: terminan en «-elo».", { promptEmoji: "⭐" }),
  q("Escuchá: «Luna, lunita, / redonda y blanquita.» ¿Qué rima con lunita?", [["⚪", "Blanquita"], ["🌙", "Luna"], ["🔴", "Redonda"]], 0, "Pista: terminan en «-ita».", { promptEmoji: "🌙" }),
];

const ADIVINANZAS: Q[] = [
  q("Tengo cuatro patas, ladro y muevo la cola. ¿Quién soy?", [["🐶", "Perro"], ["🐱", "Gato"], ["🐦", "Pájaro"]], 0, "Pista: hace «guau»."),
  q("Salgo de noche, soy redonda y blanca. ¿Qué soy?", [["🌙", "Luna"], ["☀️", "Sol"], ["☁️", "Nube"]], 0, "Pista: brillo en el cielo de noche."),
  q("Tengo agujas pero no coso, doy la hora sin hablar. ¿Qué soy?", [["⏰", "Reloj"], ["🧵", "Hilo"], ["📺", "Tele"]], 0, "Pista: hago tic tac."),
  q("Vivo en el mar, soy enorme y saco agua por la cabeza. ¿Quién soy?", [["🐋", "Ballena"], ["🐟", "Pez"], ["🦀", "Cangrejo"]], 0, "Pista: en Puerto Pirámides me van a ver."),
  q("Soy blanca, fría y caigo del cielo en invierno. ¿Qué soy?", [["❄️", "Nieve"], ["🌧️", "Lluvia"], ["☀️", "Sol"]], 0, "Pista: con ella se hacen muñecos."),
  q("Tengo hojas pero no soy árbol, cuento cuentos sin boca. ¿Qué soy?", [["📖", "Libro"], ["🌳", "Árbol"], ["🍃", "Hoja"]], 0, "Pista: me leen en la biblioteca."),
  q("Me pongo en los pies para caminar. ¿Qué soy?", [["👟", "Zapatilla"], ["🧢", "Gorra"], ["🧤", "Guantes"]], 0, "Pista: tengo cordones."),
  q("Corro mucho por la meseta, tengo cuello largo y lana. ¿Quién soy?", [["🦙", "Guanaco"], ["🐧", "Pingüino"], ["🐸", "Sapo"]], 0, "Pista: vivo en la Patagonia."),
  q("Trabalenguas: «Pablito clavó un clavito.» ¿Qué clavó Pablito?", [["🔩", "Un clavito"], ["🌳", "Un árbol"], ["🍎", "Una manzana"]], 0, "Pista: escuchá la última palabra."),
  q("Disparate: «El pez anda en bicicleta.» ¿Es verdad o es un disparate?", [["🤪", "Disparate"], ["✅", "Verdad"]], 0, "Pista: ¿los peces andan en bici?", { promptEmoji: "🐟🚲" }),
];

const STORY_SEQUENCES: string[][] = [
  ["🌱 Lola planta una semilla", "💧 La riega todos los días", "🌿 Sale una hojita", "🌼 Crece una flor"],
  ["🧢 Al guanaco se le vuela el gorro", "🏃 Corre para alcanzarlo", "🦅 El cóndor lo atrapa", "🤝 Se hacen amigos"],
  ["😨 Pipo tiene miedo al agua", "👵 La abuela le da un consejo", "🦶 Mete una pata", "🏊 Nada feliz en el mar"],
  ["🌅 Me despierto", "🪥 Me lavo los dientes", "🎒 Voy a la escuela", "🌙 Me acuesto a dormir"],
  ["🥚 Hay un huevo", "🐣 Nace un pollito", "🐥 El pollito crece", "🐔 Es una gallina"],
];

function secuenciasWorld(): ActivitySpec[] {
  const acts: ActivitySpec[] = sample(STORY_SEQUENCES, 4).map((seq, i) =>
    orderActivity(`seq-${i}`, "Ordená lo que pasó: primero, después y al final.", seq, "Pista: ¿qué pasó primero de todo?", ["l-comprension-oral", "l-literatura"])
  );
  acts.push(...fromBank(STORIES.flatMap((s) => s.qs.slice(0, 2).map((x) => ({ ...x, story: { title: s.title, text: s.text } }))), 3, "seq-q", ["l-comprension-oral"]));
  return acts;
}

const TEXTOS_ESCRITOS: Q[] = [
  q("¿Qué título le queda mejor a este dibujo?", [["🐧", "El pingüino en el mar"], ["🚗", "El auto rojo"], ["🍕", "La pizza"]], 0, "Pista: el título dice de qué se trata.", { promptEmoji: "🐧🌊" }),
  q("¿Qué título le queda mejor a este dibujo?", [["🎂", "El cumpleaños de Sol"], ["🌧️", "Un día de lluvia"], ["🐄", "La vaca"]], 0, "Pista: mirá qué hay en el dibujo.", { promptEmoji: "🎂🎈" }),
  q("Lista de compras: pan, leche, … ¿Qué puede seguir?", [["🧀", "Queso"], ["🚲", "Bicicleta"], ["🐶", "Perro"]], 0, "Pista: algo que se compra en el almacén para comer.", { promptEmoji: "🧾" }),
  q("Lista de útiles: lápiz, goma, … ¿Qué puede seguir?", [["✂️", "Tijera"], ["🍌", "Banana"], ["🛏️", "Cama"]], 0, "Pista: algo que va en la cartuchera.", { promptEmoji: "🎒" }),
  q("¿Qué epígrafe le queda a esta foto?", [["❄️", "Nieva en Río Gallegos"], ["🏖️", "Calor en la playa"], ["🌻", "Girasoles en flor"]], 0, "Pista: el epígrafe cuenta lo que se ve.", { promptEmoji: "🌨️🏘️" }),
  q("¿Para qué sirve una lista?", [["📝", "Para no olvidarnos de cosas"], ["😴", "Para dormir"], ["🎵", "Para cantar"]], 0, "Pista: la usamos para recordar."),
  q("Lista de animales de la Patagonia: guanaco, choique, … ¿Cuál sigue?", [["🐧", "Pingüino"], ["🦒", "Jirafa"], ["🐘", "Elefante"]], 0, "Pista: vive en Santa Cruz.", { promptEmoji: "🦙" }),
  q("¿Dónde va el título de un cuento?", [["⬆️", "Arriba, al principio"], ["⬇️", "Abajo de todo"], ["↔️", "En el medio"]], 0, "Pista: es lo primero que leemos."),
];

const MENSAJES: Q[] = [
  q("¿Qué tiene que decir una invitación?", [["📅", "El día y la hora"], ["🍎", "Qué fruta te gusta"], ["🐶", "Cómo se llama tu perro"]], 0, "Pista: los invitados tienen que saber cuándo ir.", { promptEmoji: "💌" }),
  q("¿Qué más dice una invitación?", [["📍", "Dónde es la fiesta"], ["🌧️", "Si llovió ayer"], ["🧦", "De qué color son tus medias"]], 0, "Pista: los invitados tienen que saber a dónde ir.", { promptEmoji: "🎉" }),
  q("Al final de un mensaje se pone…", [["✍️", "Quién lo escribe (la firma)"], ["🔢", "Un número cualquiera"], ["🎨", "Un dibujo de un auto"]], 0, "Pista: así se sabe quién lo mandó."),
  q("¿Cómo empieza un mensaje a la abuela?", [["👋", "Hola, abuela:"], ["🔚", "Chau."], ["❓", "¿Qué?"]], 0, "Pista: primero se saluda."),
  q("«Querida familia: el viernes es el acto. Los esperamos. 1.º grado.» ¿Qué es?", [["💌", "Una invitación"], ["📖", "Un cuento"], ["🧾", "Una lista"]], 0, "Pista: los invita a ir a algo."),
  q("¿Para qué sirve un mensaje?", [["📨", "Para avisar o contar algo a alguien"], ["🍳", "Para cocinar"], ["⚽", "Para jugar a la pelota"]], 0, "Pista: lo mandamos a otra persona."),
  q("La seño pregunta: «¿Qué animal te gusta?». ¿Cuál es una buena respuesta escrita?", [["🐧", "Me gusta el pingüino."], ["🍕", "Comí pizza."], ["🌧️", "Llueve."]], 0, "Pista: la respuesta tiene que hablar de un animal."),
];

// --------------------------------------------------------------------------
// Mapa de mundos → actividades
// --------------------------------------------------------------------------

const LETTER_WORLDS: Record<number, string[]> = {
  13: ["m"], 14: ["p"], 15: ["l"], 16: ["s"], 18: ["t"], 19: ["n"], 20: ["d"], 21: ["r"],
  22: ["c"], 23: ["f"], 24: ["b", "v"], 25: ["g"], 26: ["ñ", "j", "ll"],
};

export function buildLenguaActivities(world: WorldDef): ActivitySpec[] {
  const n = world.worldNumber ?? 0;
  const ALL = TEACHING_ORDER;
  let acts: ActivitySpec[] = [];
  switch (n) {
    case 1: acts = fromBank(CONVERSACION, 8, "conv", ["l-oralidad"]); break;
    case 2: acts = fromBank(SONIDOS, 8, "son", ["l-escucha"]).map((a) => ({ ...a, say: a.type === "pick" ? a.prompt : undefined })); break;
    case 3: acts = fromBank(CONSIGNAS, 8, "cons", ["l-escucha", "l-comprension-oral"]); break;
    case 4: acts = largasCortasWorld(); break;
    case 5: acts = rimasWorld(8); break;
    case 6: acts = silabaWorld("first"); break;
    case 7: acts = silabaWorld("last"); break;
    case 8: acts = primerSonidoWorld(); break;
    case 9: acts = nombresWorld(); break;
    case 10: acts = vowelWorld(["a", "e"]); break;
    case 11: acts = vowelWorld(["i", "o", "u"]); break;
    case 12: acts = vowelWorld(["a", "e", "i", "o", "u"]); break;
    case 17: acts = integrationWorld(lettersUpTo("s"), 8); break;
    case 27: acts = abecedarioWorld(); break;
    case 28: acts = integrationWorld(ALL, 8).map((a, i) => (i % 2 ? a : a)); break;
    case 29: acts = separoWorld(); break;
    case 30: acts = oracionesWorld(); break;
    case 31: acts = fromBank(TEXTOS_BREVES, 8, "tb", ["l-comprension-lectora", "l-lectura-oraciones"]); break;
    case 32: acts = cuentosWorld(true); break;
    case 33: acts = fromBank(POEMAS, 8, "poe", ["l-literatura", "l-rimas"]); break;
    case 34: acts = fromBank(ADIVINANZAS, 8, "adi", ["l-literatura", "l-comprension-oral"]); break;
    case 35: acts = secuenciasWorld(); break;
    case 36: {
      const ls = sample(["a", "e", "i", "o", "u", "m", "p", "l", "s", "t", "n", "d"], 8).map((x) => getLetter(x)!);
      acts = ls.map((l, i) => traceLetter(`tr-${i}`, l, i % 2 === 0));
      break;
    }
    case 37: {
      const ws = sample(decodableWords(ALL).filter((w) => pictureWords.includes(w) && graphemes(w.word).length <= 5), 8);
      acts = ws.map((w, i) => buildLetters(`bl-${i}`, w, ALL));
      break;
    }
    case 38: acts = fromBank(TEXTOS_ESCRITOS, 8, "txt", ["l-textos-breves"]); break;
    case 39: acts = fromBank(MENSAJES, 7, "msg", ["l-textos-breves"]); break;
    default:
      if (LETTER_WORLDS[n]) acts = consonantWorld(LETTER_WORLDS[n]);
  }
  return numbered(acts.slice(0, Math.max(world.activityCount ?? 8, 8) + 2));
}

export const LENGUA_WITH_CONTENT = new Set(
  Array.from({ length: 39 }, (_, i) => i + 1)
);
