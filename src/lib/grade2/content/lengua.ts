// Actividades de Lengua de 2.º grado (38 mundos).
// Comprende sílabas trabadas (L y R), convenciones ortográficas (c/qu, ce/ci,
// g/gue/gui/ge/gi, güe/güi, r/rr, mb/mp, h, ch), puntuación, clases de palabras
// (sustantivos, adjetivos, familias), y tipos textuales (cuentos, fábulas, recetas, cartas).
import type { ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import { GRADE2_WORDS, WordDef2, getWordsByPattern } from "../words";
import {
  makeClassify,
  makeOrder,
  numbered,
  pickOne,
  plain,
  q,
  sample,
  shuffle,
  wordCard2,
  Q,
} from "./util";

// --------------------------------------------------------------------------
// Ayudantes de tarjetas y actividades
// --------------------------------------------------------------------------

function readWordToPicture(id: string, target: WordDef2, pool: WordDef2[], skills: string[]): ActivitySpec {
  const others = sample(
    pool.filter((w) => w.word !== target.word && w.emoji !== target.emoji),
    2
  );
  const cards = shuffle([target, ...others]).map((w) => wordCard2(w));
  return {
    type: "pick",
    id,
    title: "",
    prompt: "Leé la palabra y tocá su dibujo.",
    say: `Leé la palabra y tocá su dibujo.`,
    promptBig: target.word,
    cards,
    answerIds: [target.word],
    hint: `Pista: leé despacito sílaba por sílaba: ${target.syllables.join(" - ")}.`,
    skills,
  };
}

function pictureToWord(id: string, target: WordDef2, pool: WordDef2[], skills: string[]): ActivitySpec {
  const others = sample(
    pool.filter((w) => w.word !== target.word),
    2
  );
  const cards = shuffle([target, ...others]).map((w) => ({
    id: w.word,
    big: w.word,
    say: w.word,
  }));
  return {
    type: "pick",
    id,
    title: "",
    prompt: "¿Qué palabra corresponde al dibujo?",
    say: "¿Qué palabra corresponde al dibujo?",
    promptEmoji: target.emoji,
    cards,
    answerIds: [target.word],
    hint: `Pista: la palabra empieza con ${target.syllables[0]}.`,
    skills,
  };
}

function buildSyllablesAct(id: string, target: WordDef2, skills: string[]): ActivitySpec {
  const syls = target.syllables.map(plain);
  const extraPool = ["ma", "pa", "to", "la", "re", "so", "de", "bra", "tro", "cla"];
  const extra = sample(extraPool.filter((s) => !syls.includes(s)), 2);
  return {
    type: "build",
    id,
    title: "",
    prompt: "Armá la palabra con las sílabas en orden.",
    say: `Armá la palabra ${target.word}.`,
    target: syls,
    tiles: shuffle([...syls, ...extra]),
    emoji: target.emoji,
    hint: `Pista: decí la palabra en voz alta por partes: ${target.syllables.join(" - ")}.`,
    skills,
  };
}

// --------------------------------------------------------------------------
// Mundos 2 a 13: Sílabas Trabadas (DR, TR, CR, CL, FR, FL, GR, GL, BR, BL, PL, PR)
// --------------------------------------------------------------------------

function buildTrabadaWorld(world: WorldDef, pattern: string): ActivitySpec[] {
  const words = getWordsByPattern(pattern);
  const pool = words.length >= 3 ? words : GRADE2_WORDS;
  const skills = world.skills ?? ["l2-trabadas"];
  const acts: ActivitySpec[] = [];

  // 1 y 2: leer palabra -> tocar dibujo
  const w1 = pickOne(pool);
  acts.push(readWordToPicture(`l${world.worldNumber}-0`, w1, pool, skills));
  const w2 = pickOne(pool.filter((w) => w.word !== w1.word) || pool);
  acts.push(readWordToPicture(`l${world.worldNumber}-1`, w2, pool, skills));

  // 3 y 4: dibujo -> elegir palabra escrita
  const w3 = pickOne(pool);
  acts.push(pictureToWord(`l${world.worldNumber}-2`, w3, pool, skills));
  const w4 = pickOne(pool.filter((w) => w.word !== w3.word) || pool);
  acts.push(pictureToWord(`l${world.worldNumber}-3`, w4, pool, skills));

  // 5 y 6: armar palabra con sílabas
  const w5 = pickOne(pool);
  acts.push(buildSyllablesAct(`l${world.worldNumber}-4`, w5, skills));
  const w6 = pickOne(pool.filter((w) => w.word !== w5.word) || pool);
  acts.push(buildSyllablesAct(`l${world.worldNumber}-5`, w6, skills));

  // 7: clasificar palabras que tienen la trabada vs otras
  const otherWords = sample(GRADE2_WORDS.filter((w) => w.pattern !== pattern), 3);
  const myWords = sample(pool, 3);
  acts.push(
    makeClassify(
      `l${world.worldNumber}-6`,
      `Clasificá las palabras según tengan o no el grupo ${pattern.toUpperCase()}.`,
      [`Tiene ${pattern.toUpperCase()}`, `Otra palabra`],
      [
        ...myWords.map((w) => ({ label: `${w.emoji} ${w.word}`, cat: 0 as const })),
        ...otherWords.map((w) => ({ label: `${w.emoji} ${w.word}`, cat: 1 as const })),
      ],
      `Pista: fijate si la palabra contiene las letras ${pattern.toUpperCase()}.`,
      skills
    )
  );

  // 8: completar oración o adivinanza
  const w8 = pickOne(pool);
  acts.push({
    type: "pick",
    id: `l${world.worldNumber}-7`,
    title: "",
    prompt: `Completá la oración: "En el bosque vimos un ${w8.emoji}..."`,
    cards: shuffle([w8, ...sample(GRADE2_WORDS.filter((w) => w.word !== w8.word), 2)]).map((w) => ({
      id: w.word,
      big: w.word,
    })),
    answerIds: [w8.word],
    hint: `Pista: mirá el dibujo que completa el sentido: ${w8.emoji}.`,
    skills,
  });

  return [acts[0], acts[1], acts[4], acts[2], acts[3], acts[5], acts[6], acts[7]];
}

// --------------------------------------------------------------------------
// Mundo 1: El Gran Desafío de Leer (Fluidez)
// --------------------------------------------------------------------------
function buildMundo1(skills: string[]): ActivitySpec[] {
  const sentences = [
    { text: "El zorro corre veloz por la estepa.", ans: "🦊", options: [["🦊", "Zorro veloz"], ["🐟", "Pez en el agua"], ["🚂", "Tren en la vía"]], hint: "Pista: el animal que corre veloz es el zorro." },
    { text: "La mariposa vuela entre las flores del jardín.", ans: "🦋", options: [["🦋", "Mariposa en flor"], ["🐊", "Cocodrilo en río"], ["🚗", "Auto en ruta"]], hint: "Pista: tiene alas de colores y visita las flores." },
    { text: "En la estancia esquilan las ovejas con cuidado.", ans: "🐑", options: [["🐑", "Oveja con lana"], ["🐧", "Pingüino en hielo"], ["🏀", "Pelota de básquet"]], hint: "Pista: las ovejas dan la lana en la estancia." },
    { text: "El tren cruza el puente sobre el río.", ans: "🚂", options: [["🚂", "Tren en puente"], ["✈️", "Avión en cielo"], ["⛵", "Barco a vela"]], hint: "Pista: el tren rueda sobre las vías del puente." },
    { text: "El cocodrilo toma sol en la orilla del agua.", ans: "🐊", options: [["🐊", "Cocodrilo en orilla"], ["🦉", "Lechuza de noche"], ["🚲", "Bicicleta nueva"]], hint: "Pista: es un reptil de dientes grandes que toma sol." },
    { text: "La estrella brilla alta en el cielo oscuro.", ans: "⭐", options: [["⭐", "Estrella brillante"], ["🍎", "Manzana roja"], ["🪨", "Piedra gris"]], hint: "Pista: brilla en la noche en el cielo." },
    { text: "El panadero saca el pan caliente del horno.", ans: "🥖", options: [["🥖", "Pan fresco"], ["🥛", "Vaso de leche"], ["🪁", "Barrilete volando"]], hint: "Pista: el panadero hornea el pan caliente." },
    { text: "El barco pesquero regresa cargado al puerto.", ans: "🚢", options: [["🚢", "Barco en el puerto"], ["🚁", "Helicóptero volando"], ["🏠", "Casa con chimenea"]], hint: "Pista: el barco navega y atraca en el muelle." },
  ];
  return sentences.map((s, i) => {
    if (i === 2) {
      return {
        type: "true-false",
        id: `l1-${i}`,
        title: "",
        statement: `Leé: "${s.text}" ¿Es verdadero o falso que esta oración habla de esquilar ovejas?`,
        isTrue: true,
        hint: s.hint,
        skills,
      };
    }
    if (i === 5) {
      return {
        type: "true-false",
        id: `l1-${i}`,
        title: "",
        statement: `Leé: "${s.text}" ¿Es verdad que la oración dice que la estrella brilla a plena luz del día?`,
        isTrue: false,
        hint: s.hint,
        skills,
      };
    }
    return {
      type: "pick",
      id: `l1-${i}`,
      title: "",
      prompt: `Leé la oración: "${s.text}" ¿Cuál es el dibujo correcto?`,
      say: s.text,
      cards: shuffle(s.options.map(([emoji, label]) => ({ id: emoji, emoji, label }))),
      answerIds: [s.ans],
      hint: s.hint,
      skills,
    };
  });
}

// --------------------------------------------------------------------------
// Mundo 14: ¡Fiesta de Trabadas!
// --------------------------------------------------------------------------
function buildMundo14(skills: string[]): ActivitySpec[] {
  const classify = makeClassify(
    "l14-0",
    "Clasificá las palabras según tengan trabada con L o con R.",
    ["Trabada con L (cl, gl, fl, bl, pl)", "Trabada con R (dr, tr, cr, gr, fr, pr)"],
    [
      { label: "🌸 clavel", cat: 0 },
      { label: "🐉 dragón", cat: 1 },
      { label: "🎈 globo", cat: 0 },
      { label: "🚂 tren", cat: 1 },
      { label: "🏹 flecha", cat: 0 },
      { label: "🔮 cristal", cat: 1 },
    ],
    "Pista: mirá si la segunda letra de la trabada es una L o una R.",
    skills
  );

  const bank: Q[] = [
    q("¿Qué palabra tiene trabada con R?", [["🚂", "tren"], ["🌸", "clavel"], ["🎈", "globo"]], 0, "Pista: tr tiene r."),
    q("¿Qué palabra tiene trabada con L?", [["🪶", "pluma"], ["🐉", "dragón"], ["🌾", "trigo"]], 0, "Pista: pl tiene l."),
    q("¿Qué palabra rima con 'dragón'?", [["🦁", "león"], ["🌸", "clavel"], ["🚂", "tren"]], 0, "Pista: terminan con el mismo sonido -ón."),
    q("¿Qué dibujo corresponde a la palabra 'estrella'?", [["⭐", "estrella"], ["🌙", "luna"], ["☀️", "sol"]], 0, "Pista: brilla de noche con forma de 5 puntas."),
    q("¿Cuál de estas palabras tiene dos sílabas trabadas?", [["📐", "triángulo"], ["🚲", "bicicleta"], ["4️⃣", "cuatro"]], 0, "Pista: tri-án-gu-lo."),
    q("Armá la frase: 'El tren pasa por el...'", [["🌾", "prado"], ["🛋️", "sillón"], ["🛏️", "cama"]], 0, "Pista: el tren corre en la naturaleza."),
    q("¿Qué objeto sirve para andar sobre dos ruedas y tiene CL?", [["🚲", "bicicleta"], ["🚗", "auto"], ["✈️", "avión"]], 0, "Pista: bi-ci-cle-ta."),
  ];

  const pickActs: ActivitySpec[] = bank.map((item, i) => {
    const actId = `l14-${i + 1}`;
    if (i === 2) {
      return {
        type: "true-false",
        id: actId,
        title: "",
        statement: "¿Es verdadero o falso que 'dragón' rima con 'león'?",
        isTrue: true,
        hint: "Pista: ambas palabras terminan con el mismo sonido -ón.",
        skills,
      };
    }
    if (i === 5) {
      return makeOrder(
        actId,
        "Ordená las palabras para armar la frase:",
        ["El tren", "pasa por", "el prado"],
        "Pista: empezá con la mayúscula El tren.",
        skills
      );
    }
    return {
      type: "pick",
      id: actId,
      title: "",
      prompt: item.prompt,
      cards: shuffle(item.options.map(([emoji, label], idx) => ({ id: `o${idx}`, emoji, label }))),
      answerIds: [`o${item.answer}`],
      hint: item.hint ?? "Pista: mirá bien las letras.",
      skills,
    };
  });

  return [classify, ...pickActs];
}

// --------------------------------------------------------------------------
// Resto de los mundos ortográficos y gramaticales (15 a 38)
// --------------------------------------------------------------------------

const GRAMMAR_WORLDS_BANKS: Record<number, { prompt: string; qList: Q[]; skills: string[] }> = {
  // 15: C / Q
  15: {
    skills: ["l2-ortografia-c-q"],
    prompt: "Ortografía: CA, CO, CU y QUE, QUI",
    qList: [
      q("¿Cómo se escribe la palabra?", [["🧀", "queso"], ["🧀", "ceso"], ["🧀", "keso"]], 0, "Pista: con E y con I el sonido /k/ se escribe con QU (que, qui)."),
      q("Completá: 'La paloma está en su ____na.'", [["🪹", "cuna"], ["🪹", "quna"], ["🪹", "suna"]], 0, "Pista: delante de U va con C: ca, co, cu."),
      q("Completá: 'El cartero trajo un pa____te.'", [["📦", "que"], ["📦", "ce"], ["📦", "ke"]], 0, "Pista: pa-que-te se escribe con que."),
      q("¿Cuál está escrita correctamente?", [["🦟", "mosquito"], ["🦟", "moscito"], ["🦟", "moskito"]], 0, "Pista: qui lleva q-u-i."),
      q("Completá: 'Prendo la luz con el ____lor.'", [["💡", "foco"], ["💡", "foquo"], ["💡", "foso"]], 0, "Pista: con O va con C: fo-co."),
      q("¿Qué comemos en el recreo?", [["🍪", "galletitas de chocolate"], ["🍪", "galletitas con qoco"], ["🍪", "pan con seso"]], 0, "Pista: chocolate va con ch y ca/co."),
      q("Completá: 'El nene tiene quince años.' ¿Cómo se escribe 15?", [["1️⃣5️⃣", "quince"], ["1️⃣5️⃣", "cince"], ["1️⃣5️⃣", "kince"]], 0, "Pista: quince se escribe con QU."),
      q("¿Con qué letra se escribe 'caballo'?", [["🐎", "Con C (ca)"], ["🐎", "Con QU"], ["🐎", "Con K"]], 0, "Pista: ca, co, cu van con C."),
    ],
  },

  // 16: CE / CI
  16: {
    skills: ["l2-ortografia-c-q"],
    prompt: "Ortografía: CE y CI (sonido suave)",
    qList: [
      q("¿Cómo se escribe el lugar donde vemos películas en pantalla gigante?", [["🎬", "cine"], ["🎬", "sine"], ["🎬", "kine"]], 0, "Pista: ci tiene sonido suave y va con C."),
      q("Completá: 'La ensalada tiene lechuga y ____bolla.'", [["🧅", "ce"], ["🧅", "se"], ["🧅", "que"]], 0, "Pista: ce-bo-lla se escribe con C."),
      q("¿Cuál de estas frutas se escribe con C?", [["🍒", "cereza y ciruela"], ["🍎", "manzana roja"], ["🍌", "banana madura"]], 0, "Pista: ce-re-za y ci-rue-la van con ce y ci."),
      q("Completá: 'Por la noche miramos las estrellas en el ____lo.'", [["🌌", "cielo"], ["🌌", "sielo"], ["🌌", "quielo"]], 0, "Pista: cie-lo se escribe con C."),
      q("¿Cómo se escribe el número 5?", [["5️⃣", "cinco"], ["5️⃣", "sinco"], ["5️⃣", "kinco"]], 0, "Pista: empieza con CI y termina con CO."),
      q("Completá: 'El pájaro vuela en cír____lo.'", [["⭕", "cu"], ["⭕", "qu"], ["⭕", "su"]], 0, "Pista: cír-cu-lo: cir con c, cu con c."),
      q("¿Cuál está escrita correctamente?", [["🦓", "cebra"], ["🦓", "sebra"], ["🦓", "quebra"]], 0, "Pista: ce-bra va con c."),
      q("Completá: 'Para cocinar usamos aceite de o____va.'", [["🫒", "li"], ["🫒", "ce"], ["🫒", "si"]], 0, "Pista: a-cei-te lleva ce."),
    ],
  },

  // 17: G / GU (ga, go, gu y gue, gui)
  17: {
    skills: ["l2-ortografia-g"],
    prompt: "Ortografía: GA, GO, GU y GUE, GUI",
    qList: [
      q("¿Cómo se escribe el instrumento de cuerdas?", [["🎸", "guitarra"], ["🎸", "gitarra"], ["🎸", "quitarra"]], 0, "Pista: para que la G suene suave con la I, lleva una U en el medio: gui."),
      q("Completá: 'El bombero apaga el fuego con la man____ra.'", [["🚒", "gue"], ["🚒", "ge"], ["🚒", "je"]], 0, "Pista: man-gue-ra lleva U muda."),
      q("Completá: 'Mi mascota regalona es un ____to.'", [["🐱", "ga"], ["🐱", "gua"], ["🐱", "ja"]], 0, "Pista: ga, go, gu no llevan u intermedia."),
      q("¿Cuál está escrita correctamente?", [["🪱", "gusano"], ["🪱", "guusano"], ["🪱", "jusano"]], 0, "Pista: gu-sa-no va directo."),
      q("Completá: 'Hoy comemos un rico ____so calentito.'", [["🍲", "gui"], ["🍲", "gi"], ["🍲", "ji"]], 0, "Pista: gui-so lleva G-U-I."),
      q("¿Qué ave rapaz de la cordillera vuela alto?", [["🦅", "águila"], ["🦅", "ágila"], ["🦅", "ájila"]], 0, "Pista: á-gui-la lleva u intermedia."),
      q("¿Por qué en 'manguera' y 'guitarra' se escribe con U?", [["✨", "Porque la U hace que la G suene suave (gue, gui)"], ["📢", "Porque la U suena muy fuerte"], ["❌", "Por error"]], 0, "Pista: la U acompaña a la G para mantener el sonido suave."),
      q("Completá: 'Me gusta tomar agua en un va____ de vidrio.'", [["🥛", "so"], ["🥛", "go"], ["🥛", "jo"]], 0, "Pista: va-so."),
    ],
  },

  // 18: GE / GI (sonido fuerte /x/)
  18: {
    skills: ["l2-ortografia-g"],
    prompt: "Ortografía: GE y GI (sonido fuerte)",
    qList: [
      q("¿Cómo se escribe el personaje enorme de los cuentos?", [["🗿", "gigante"], ["🗿", "jigante"], ["🗿", "guigante"]], 0, "Pista: gi-gan-te empieza con G."),
      q("¿Qué flor amarilla gira buscando la luz del sol?", [["🌻", "girasol"], ["🌻", "jirasol"], ["🌻", "guirasol"]], 0, "Pista: gi-ra-sol se escribe con G."),
      q("Completá: 'El mago frotó la lámpara y salió un ____nio.'", [["🧞", "ge"], ["🧞", "je"], ["🧞", "gue"]], 0, "Pista: ge-nio se escribe con G."),
      q("¿Cómo se llama la persona que cuida a la gente en el bosque o montañas?", [["🧭", "gente del lugar"], ["🧭", "jente"], ["🧭", "guente"]], 0, "Pista: gen-te se escribe con G."),
      q("Completá: 'En el cuaderno escribo en la pá____na diez.'", [["📖", "gi"], ["📖", "ji"], ["📖", "gui"]], 0, "Pista: pá-gi-na se escribe con G."),
      q("¿Qué hacen los gimnastas en el club?", [["🤸", "gimnasia"], ["🤸", "jimnasia"], ["🤸", "guimnasia"]], 0, "Pista: gim-na-sia se escribe con G."),
      q("¿Cómo suena la G en 'gente' y 'girasol'?", [["🗣️", "Suena fuerte, parecido a la J"], ["🤫", "Es muda"], ["🌊", "Suena suave como en gato"]], 0, "Pista: delante de E e I sin U intermedia, la G suena fuerte."),
      q("¿Cuál de estas palabras se escribe con G?", [["🌻", "girasol"], ["🦒", "jirafa"], ["👖", "jean"]], 0, "Pista: girasol va con G; jirafa va con J."),
    ],
  },

  // 19: Diéresis (güe, güi)
  19: {
    skills: ["l2-ortografia-g"],
    prompt: "Ortografía: diéresis en GÜE y GÜI",
    qList: [
      q("¿Cómo se llama el ave marina del sur que nada pero no vuela?", [["🐧", "pingüino"], ["🐧", "pinguino"], ["🐧", "pingino"]], 0, "Pista: lleva dos puntitos sobre la U (diéresis) para que la U suene: pin-güi-no."),
      q("¿Para qué sirven los dos puntitos (diéresis ¨) sobre la letra U?", [["✨", "Para avisar que la U sí debe pronunciarse"], ["💤", "Para que la U se duerma"], ["🤫", "Para que sea muda"]], 0, "Pista: en pingüino y cigüeña la U se pronuncia gracias a la diéresis."),
      q("¿Cómo se escribe el ave de patas largas que hace nidos altos?", [["🪺", "cigüeña"], ["🪺", "cigueña"], ["🪺", "cigeña"]], 0, "Pista: ci-güe-ña lleva diéresis sobre la U."),
      q("Completá: 'El agua del arroyo está muy des____gue.'", [["💧", "a-güi-ta"], ["💧", "a-gui-ta"], ["💧", "a-gi-ta"]], 0, "Pista: si la u suena en agüita, lleva diéresis."),
      q("¿Cuál de estas palabras lleva diéresis?", [["🐧", "pingüino"], ["🎸", "guitarra"], ["🐱", "gato"]], 0, "Pista: en guitarra la u es muda; en pingüino la u se pronuncia."),
      q("¿Cómo se escribe el animal salvaje pariente del perro?", [["🐺", "agüero / bilingüe"], ["🐺", "guiso"], ["🐺", "guerra"]], 0, "Pista: bi-lin-güe lleva diéresis porque suena la u."),
      q("En la palabra 'guerra', ¿suena la letra U?", [["❌", "No, es muda"], ["✅", "Sí, suena fuerte"], ["✨", "Lleva diéresis"]], 0, "Pista: en gue y gui la U es muda a menos que tenga diéresis."),
      q("¿Cómo se lee 'güi'?", [["🔊", "güi (suena la g y la u)"], ["🔇", "gui (la u es muda)"], ["🗣️", "ji"]], 0, "Pista: la diéresis le da voz a la U."),
    ],
  },

  // 20: R suave vs RR fuerte
  20: {
    skills: ["l2-ortografia-r"],
    prompt: "Ortografía: R suave y RR fuerte",
    qList: [
      q("¿Cuál es la fruta dulce que se escribe con R suave?", [["🍐", "pera"], ["🐕", "perra"], ["🚗", "carro"]], 0, "Pista: pe-ra tiene sonido suave entre vocales."),
      q("¿Cuál es el vehículo con ruedas que se escribe con RR fuerte?", [["🚗", "carro"], [" caro ", "caro (que cuesta mucho)"], ["🦜", "loro"]], 0, "Pista: ca-rro tiene sonido fuerte y lleva dos R."),
      q("¿Cómo se escribe el animal de cuatro patas que mueve la cola?", [["🐕", "perro"], ["🐕", "pero"], ["🐕", "pello"]], 0, "Pista: pe-rro lleva doble r fuerte."),
      q("¿Cuándo se escribe con RR?", [["✨", "Entre dos vocales cuando el sonido es fuerte"], ["🚪", "Al principio de la palabra"], ["🔚", "Al final de la palabra"]], 0, "Pista: nunca se empieza una palabra con dos R."),
      q("¿Cómo se escribe el ave verde de plumas de colores?", [["🦜", "loro"], ["🦜", "lorro"], ["🦜", "lodo"]], 0, "Pista: lo-ro lleva una sola r suave."),
      q("¿Cómo se escribe el animal nocturno de cola peluda?", [["🦊", "zorro"], ["🦊", "zoro"], ["🦊", "sollo"]], 0, "Pista: zo-rro lleva doble r fuerte."),
      q("¿Qué significa 'careta'?", [["🎭", "Máscara para la cara (con r suave)"], ["🚗", "Carreta con bueyes"], ["📦", "Caja"]], 0, "Pista: una sola r suena suave: ca-re-ta."),
      q("¿Se puede escribir RR al principio de una palabra como 'ratón'?", [["❌", "No, al inicio siempre va una sola R aunque suene fuerte"], ["✅", "Sí, siempre"], ["🤔", "Solo los domingos"]], 0, "Pista: al inicio nunca se escribe doble R."),
    ],
  },

  // 21: MB y MP
  21: {
    skills: ["l2-ortografia-mb-mp"],
    prompt: "Regla ortográfica: antes de B y P siempre va M",
    qList: [
      q("¿Qué letra va antes de la B en 'tam____or'?", [["🥁", "M (tambor)"], ["🥁", "N (tanbor)"], ["🥁", "L (talbor)"]], 0, "Pista: regla sin excepción: antes de B va M."),
      q("¿Qué letra va antes de la P en 'cam____na'?", [["🔔", "M (campana)"], ["🔔", "N (canpana)"], ["🔔", "S (caspana)"]], 0, "Pista: antes de P siempre va M."),
      q("¿Cuál está escrita correctamente?", [["🧑‍🚒", "bombero"], ["🧑‍🚒", "bonbero"], ["🧑‍🚒", "bomdero"]], 0, "Pista: bom-be-ro lleva M antes de B."),
      q("¿Cómo se escribe el dulce que nos gusta comer?", [["🍬", "bombón"], ["🍬", "bonbón"], ["🍬", "bompón"]], 0, "Pista: bom-bón lleva dos M antes de dos B."),
      q("Completá: 'El elefante come hojas con su trom____.'", [["🐘", "pa (trompa)"], ["🐘", "ba (tromba)"], ["🐘", "na (tromna)"]], 0, "Pista: trom-pa lleva M antes de P."),
      q("¿Qué objeto da luz en la mesa de noche?", [["💡", "lámpara"], ["💡", "lánpara"], ["💡", "lámbara"]], 0, "Pista: lám-pa-ra lleva M antes de P."),
      q("¿Cuál de estas palabras cumple la regla de MB?", [["👤", "sombra"], ["🌾", "campo"], ["🔔", "campana"]], 0, "Pista: som-bra tiene M antes de B."),
      q("Completá la regla: 'Antes de B y de P siempre se escribe...'", [["🔤", "M"], ["🔤", "N"], ["🔤", "S"]], 0, "Pista: ¡la M es amiga inseparable de la B y la P!"),
    ],
  },

  // 22: H muda
  22: {
    skills: ["l2-ortografia-h-ch"],
    prompt: "Ortografía: la H muda",
    qList: [
      q("¿Cómo se escribe la parte verde de la planta?", [["🍃", "hoja"], ["🍃", "oja"], ["🍃", "oja con jota"]], 0, "Pista: ho-ja se escribe con H al empezar."),
      q("¿Qué postre frío tomamos en verano?", [["🍦", "helado"], ["🍦", "elado"], ["🍦", "yelado"]], 0, "Pista: he-la-do empieza con H."),
      q("¿Qué pone la gallina en el nido?", [["🥚", "huevo"], ["🥚", "uevo"], ["🥚", "webo"]], 0, "Pista: hue-vo lleva H y se escribe con V."),
      q("¿Qué sale de la chimenea encendida?", [["💨", "humo"], ["💨", "umo"], ["💨", "jumo"]], 0, "Pista: hu-mo empieza con H."),
      q("¿Qué usa la abuela para enhebrar la aguja?", [["🧵", "hilo"], ["🧵", "ilo"], ["🧵", "yilo"]], 0, "Pista: hi-lo empieza con H."),
      q("¿Cómo se llama el ser mágico de los cuentos que concede deseos?", [["🧚", "hada"], ["🧚", "ada"], ["🧚", "yada"]], 0, "Pista: ha-da lleva H al inicio."),
      q("¿Cómo suena la letra H al hablar en español?", [["🤫", "No suena, es muda"], ["🔊", "Suena como la J"], ["📢", "Suena como la R"]], 0, "Pista: no tiene sonido propio pero es obligatoria al escribir."),
      q("Completá: 'El perro entierra su ____so.'", [["🦴", "hueso"], ["🦴", "ueso"], ["🦴", "gueso"]], 0, "Pista: hue-so empieza con H."),
    ],
  },

  // 23: CH dígrafo
  23: {
    skills: ["l2-ortografia-h-ch"],
    prompt: "Dígrafo CH: cha, che, chi, cho, chu",
    qList: [
      q("¿Qué bebida caliente y dulce tomamos en invierno?", [["🍫", "chocolate"], ["🍫", "socolate"], ["🍫", "tocolate"]], 0, "Pista: cho-co-la-te empieza con CH."),
      q("¿De dónde sale la leche blanca que tomamos?", [["🥛", "De la vaca lechera"], ["🥛", "Del río"], ["🥛", "Del árbol"]], 0, "Pista: le-che lleva CH."),
      q("¿Qué abrigo sin mangas nos ponemos en el pecho?", [["🦺", "chaleco"], ["🦺", "saleco"], ["🦺", "taleco"]], 0, "Pista: cha-le-co empieza con CH."),
      q("¿Qué animal de la granja hace 'oinc oinc'?", [["🐷", "chancho"], ["🐷", "sancho"], ["🐷", "tancho"]], 0, "Pista: chan-cho tiene dos veces CH."),
      q("¿Por dónde sale el humo de la estufa de la cabaña?", [["🏠", "chimenea"], ["🏠", "simenea"], ["🏠", "timenea"]], 0, "Pista: chi-me-ne-a empieza con CH."),
      q("¿Qué herramienta usa el carpintero para cortar tablas?", [["🪚", "serrucho"], ["🪚", "serruso"], ["🪚", "martillo"]], 0, "Pista: se-rru-cho termina con CH."),
      q("¿Qué momento del día empieza cuando se pone el sol?", [["🌃", "noche"], ["🌃", "nose"], ["🌃", "tarde"]], 0, "Pista: no-che lleva CH."),
      q("¿Cómo se forma el dígrafo CH?", [["✨", "Juntando la letra C con la letra H"], ["✨", "Juntando la S con la H"], ["✨", "Juntando dos C"]], 0, "Pista: la C y la H juntas forman el sonido /ch/."),
    ],
  },

  // 24: Mayúsculas
  24: {
    skills: ["l2-puntuacion", "l2-sustantivos"],
    prompt: "Uso de Mayúsculas al comenzar y en nombres propios",
    qList: [
      q("¿Cuál de estas oraciones está bien escrita al inicio?", [["✨", "El perro corre en el parque."], ["❌", "el perro corre en el parque."], ["❌", "EL PERRO CORRE EN EL PARQUE SIN PUNTOS"]], 0, "Pista: las oraciones siempre empiezan con mayúscula y terminan con punto."),
      q("¿Por qué 'Pedro' y 'Sofía' se escriben con mayúscula?", [["🏷️", "Porque son nombres propios de personas"], ["📦", "Porque son cosas comunes"], ["🎨", "Porque son colores"]], 0, "Pista: los nombres de personas, mascotas y ciudades llevan mayúscula."),
      q("¿Cuál es el nombre de nuestra provincia bien escrito?", [["🗺️", "Santa Cruz"], ["🗺️", "santa cruz"], ["🗺️", "SANTA cruz"]], 0, "Pista: las dos palabras llevan mayúscula inicial: Santa Cruz."),
      q("Completá: '____ abuela me regaló un libro.'", [["📖", "Mi (con M mayúscula)"], ["📖", "mi (con m minúscula)"], ["📖", "mI"]], 0, "Pista: empieza la oración, así que va en mayúscula."),
      q("¿Cuál de estas palabras NO lleva mayúscula inicial en el medio de una oración?", [["🌲", "árbol"], ["👧", "Martina"], ["🏔️", "Calafate"]], 0, "Pista: 'árbol' es un sustantivo común."),
      q("Tocá los que deben escribirse siempre con mayúscula inicial", [["🏷️", "Nombres de personas"], ["🏙️", "Nombres de ciudades y países"], ["🔤", "La primera palabra de una oración"], ["🍎", "manzana"]], [0, 1, 2], "Pista: tres corresponden a reglas de mayúsculas."),
      q("¿Cómo se escribe el nombre de un amigo?", [["👦", "Mateo"], ["👦", "mateo"], ["👦", "mATeO"]], 0, "Pista: primera letra mayúscula, el resto minúsculas."),
      q("¿Qué letra mayúscula empieza la palabra 'Río Gallegos'?", [["🏛️", "R y G"], ["🏛️", "Solo la R"], ["🏛️", "Solo la G"]], 0, "Pista: ambas palabras del nombre llevan mayúscula."),
    ],
  },

  // 25: Punto Seguido y Punto Final
  25: {
    skills: ["l2-puntuacion", "l2-escritura-oraciones"],
    prompt: "Punto y seguido, punto y aparte, y punto final",
    qList: [
      q("¿Qué signo se coloca al terminar una oración?", [["🔴", "Un punto (.)"], ["❓", "Una coma"], ["✨", "Una estrellita"]], 0, "Pista: el punto indica que la idea terminó."),
      q("¿Cómo se llama el punto que cierra todo el texto al final?", [["🏁", "Punto final"], ["🚶", "Punto seguido"], ["📦", "Punto y coma"]], 0, "Pista: indica que el texto ya no sigue."),
      q("¿Cómo se llama el punto que separa dos oraciones en el mismo renglón?", [["➡️", "Punto y seguido"], ["🏁", "Punto final"], ["⬇️", "Punto y aparte"]], 0, "Pista: termina una idea y en el mismo párrafo empieza otra con mayúscula."),
      q("Después de un punto, ¿con qué tipo de letra se continúa escribiendo?", [["🔠", "Con mayúscula"], ["🔡", "Con minúscula"], ["🔢", "Con un número"]], 0, "Pista: siempre se inicia con mayúscula tras el punto."),
      q("¿Cuántas oraciones hay en este texto: 'El zorro corre. La liebre salta.'?", [["2️⃣", "2 oraciones"], ["1️⃣", "1 oración"], ["3️⃣", "3 oraciones"]], 0, "Pista: contá los puntos: hay dos ideas completas."),
      q("¿Para qué sirve el punto y aparte?", [["⬇️", "Para pasar al renglón siguiente y empezar otro párrafo"], ["🛑", "Para borrar todo"], ["🎨", "Para dibujar"]], 0, "Pista: separa distintos temas o párrafos de un texto."),
      q("¿Qué le falta a esta oración: 'El sol brilla en la montaña'?", [["🔴", "El punto final al terminar"], ["🔠", "La letra mayúscula al inicio"], ["❌", "No le falta nada"]], 0, "Pista: toda oración debe cerrar con un punto."),
      q("¿Cómo leemos un texto cuando encontramos un punto?", [["⏳", "Hacemos una pausa corta para respirar y entender la idea"], ["🏃", "Leemos a toda velocidad sin frenar"], ["📢", "Gritamos bien fuerte"]], 0, "Pista: los signos de puntuación marcan las pausas de la lectura."),
    ],
  },

  // 26: Sustantivos Comunes
  26: {
    skills: ["l2-sustantivos"],
    prompt: "Sustantivos Comunes (nombran cosas, animales, personas y lugares)",
    qList: [
      q("¿Qué es un sustantivo común?", [["📦", "Una palabra que nombra objetos, animales, personas o lugares en general"], ["🏃", "Una palabra de acción"], ["✨", "Una palabra que dice cómo es algo"]], 0, "Pista: mesa, gato, río y bosque son sustantivos comunes."),
      q("¿Cuál de estas palabras es un sustantivo común que nombra un animal?", [["🦊", "zorro"], ["🏃", "correr"], ["✨", "veloz"]], 0, "Pista: 'zorro' nombra a un animal."),
      q("¿Cuál de estas palabras es un sustantivo común que nombra un objeto del aula?", [["🎒", "mochila"], ["🎨", "colorido"], ["✏️", "escribir"]], 0, "Pista: la mochila es un objeto que podés tocar."),
      q("En la oración: 'El caballo corre en el campo', ¿cuáles son los dos sustantivos comunes?", [["🐎", "caballo y campo"], ["🏃", "corre"], ["✨", "el y en"]], 0, "Pista: nombran al animal y al lugar."),
      q("Tocá los sustantivos comunes", [["🌳", "árbol"], ["🏠", "casa"], ["🐕", "perro"], ["🏃", "saltar"]], [0, 1, 2], "Pista: tres nombran seres o cosas; saltar es una acción."),
      q("¿Cuál de estas palabras nombra un lugar de la naturaleza?", [["🌲", "bosque"], ["🟢", "verde"], ["🐦", "volar"]], 0, "Pista: el bosque es un lugar geográfico."),
      q("¿Los sustantivos comunes se escriben con mayúscula en el medio de una oración?", [["❌", "No, van con minúscula a menos que inicien la oración"], ["✅", "Sí, siempre"], ["🤔", "Solo los nombres de juguetes"]], 0, "Pista: solo los sustantivos propios llevan mayúscula siempre."),
      q("Encuentra el sustantivo que nombra un alimento: 'El panadero amasa rico pan.'", [["🥖", "pan"], ["👨‍🍳", "rico"], ["🤲", "amasa"]], 0, "Pista: 'pan' es el alimento; 'rico' es un adjetivo."),
    ],
  },

  // 27: Sustantivos Propios
  27: {
    skills: ["l2-sustantivos", "l2-puntuacion"],
    prompt: "Sustantivos Propios (nombres propios que identifican)",
    qList: [
      q("¿Qué diferencia a un sustantivo propio de uno común?", [["🏷️", "Nombra a un ser o lugar específico para distinguirlo de los demás"], ["📦", "Nombra cosas en general"], ["📏", "Tiene más letras"]], 0, "Pista: tu propio nombre te identifica a vos."),
      q("¿Cuál de estas palabras es un sustantivo propio?", [["👧", "Lucía"], ["👧", "nena"], ["👧", "amiga"]], 0, "Pista: Lucía es el nombre de una persona concreta y va con mayúscula."),
      q("¿Cuál es el sustantivo propio que nombra una ciudad santacruceña?", [["🏔️", "El Chaltén"], ["🏔️", "montaña"], ["🏔️", "pueblo"]], 0, "Pista: El Chaltén identifica a una villa de montaña única."),
      q("Si tenés un perrito llamado 'Toby', ¿cuál es el sustantivo propio?", [["🐕", "Toby"], ["🐕", "perro"], ["🐕", "mascota"]], 0, "Pista: 'perro' es la especie común; 'Toby' es su nombre propio."),
      q("¿Con qué letra empiezan SIEMPRE los sustantivos propios?", [["🔠", "Con mayúscula"], ["🔡", "Con minúscula"], ["🔢", "Con número"]], 0, "Pista: es una regla obligatoria del idioma."),
      q("En la oración: 'Mateo viajó a Río Gallegos', ¿cuáles son los sustantivos propios?", [["🏷️", "Mateo y Río Gallegos"], ["🚗", "viajó"], ["📦", "solo Mateo"]], 0, "Pista: nombran a la persona y a la ciudad."),
      q("Tocá los sustantivos propios", [["🇦🇷", "Argentina"], ["👦", "Joaquín"], ["🌊", "Río Santa Cruz"], ["🌊", "agua"]], [0, 1, 2], "Pista: tres son nombres propios con mayúscula."),
      q("¿Por qué tu propio nombre se escribe con mayúscula?", [["❤️", "Porque es tu nombre propio y te identifica a vos en el mundo"], ["📏", "Porque es largo"], ["❌", "Porque es obligatorio escribir todo en mayúscula"]], 0, "Pista: identifica a una persona única y especial."),
    ],
  },

  // 28: Singular y Plural
  28: {
    skills: ["l2-genero-numero"],
    prompt: "Número: Singular (uno) y Plural (muchos)",
    qList: [
      q("¿Qué indica que una palabra está en singular?", [["1️⃣", "Que nombra a un solo elemento"], ["🔢", "Que nombra a muchos"], ["❌", "Que no nombra a ninguno"]], 0, "Pista: 'singular' viene de simple o uno solo."),
      q("¿Cuál es el plural de 'gato'?", [["🐱", "gatos"], ["🐱", "gatoes"], ["🐱", "gatitos"]], 0, "Pista: se le agrega una -s al final: gatos."),
      q("¿Cuál es el plural de 'árbol'?", [["🌳", "árboles"], ["🌳", "árbols"], ["🌳", "arboleda"]], 0, "Pista: cuando termina en consonante, se agrega -es: árboles."),
      q("¿Cuál es el plural de 'pez'?", [["🐟", "peces (la z cambia a c)"], ["🐟", "pezs"], ["🐟", "pezes"]], 0, "Pista: las palabras que terminan en Z forman el plural con C: pez → peces."),
      q("¿Cuál de estas palabras está en singular?", [["🌸", "flor"], ["🌸", "flores"], ["🌸", "florerías"]], 0, "Pista: 'flor' nombra a una sola."),
      q("¿Cuál de estas palabras está en plural?", [["⭐", "estrellas"], ["⭐", "estrella"], ["⭐", "sol"]], 0, "Pista: 'estrellas' nombra a muchas."),
      q("¿Cómo cambia la oración al plural: 'El pájaro canta'?", [["🐦", "Los pájaros cantan"], ["🐦", "Los pájaro canta"], ["🐦", "El pájaros cantan"]], 0, "Pista: cambian el artículo, el sustantivo y la acción."),
      q("¿Cuál es el plural de 'lápiz'?", [["✏️", "lápices"], ["✏️", "lápizs"], ["✏️", "lapiceras"]], 0, "Pista: la z cambia a c: lápices."),
    ],
  },

  // 29: Género (El/La, Los/Las)
  29: {
    skills: ["l2-genero-numero"],
    prompt: "Género: Masculino y Femenino",
    qList: [
      q("¿Qué artículo acompaña a un sustantivo femenino singular?", [["👩", "La (o una)"], ["👨", "El (o un)"], ["👬", "Los"]], 0, "Pista: decimos 'la casa', 'la montaña'."),
      q("¿Qué artículo acompaña a un sustantivo masculino singular?", [["👨", "El (o un)"], ["👩", "La"], ["👭", "Las"]], 0, "Pista: decimos 'el bosque', 'el río'."),
      q("¿De qué género es la palabra 'montaña'?", [["🏔️", "Femenino (la montaña)"], ["🏔️", "Masculino (el montaña)"], ["✨", "Neutro"]], 0, "Pista: se dice 'la montaña'."),
      q("¿De qué género es la palabra 'glaciar'?", [["🧊", "Masculino (el glaciar)"], ["🧊", "Femenino (la glaciar)"], ["✨", "Sin género"]], 0, "Pista: se dice 'el glaciar'."),
      q("Completá con el artículo correcto: '____ estrellas brillan de noche.'", [["⭐", "Las"], ["⭐", "Los"], ["⭐", "El"]], 0, "Pista: 'estrellas' es femenino plural: las estrellas."),
      q("Completá: '____ guanacos corren por la estepa.'", [["🦙", "Los"], ["🦙", "Las"], ["🦙", "La"]], 0, "Pista: 'guanacos' es masculino plural: los guanacos."),
      q("¿Cuál de estos sustantivos es femenino?", [["🍎", "manzana"], ["🥖", "pan"], ["🧀", "queso"]], 0, "Pista: la manzana."),
      q("¿Cuál de estos sustantivos es masculino?", [["🌲", "árbol"], ["🌸", "flor"], ["🍃", "hoja"]], 0, "Pista: el árbol."),
    ],
  },

  // 30: Adjetivos Calificativos
  30: {
    skills: ["l2-adjetivos"],
    prompt: "Adjetivos Calificativos (dicen cómo es o cómo está algo)",
    qList: [
      q("¿Para qué sirven los adjetivos calificativos?", [["✨", "Para describir y decir cómo son las personas, animales o cosas"], ["🏃", "Para decir qué acción hacen"], ["📦", "Para nombrar objetos"]], 0, "Pista: lindo, grande, suave y dorado son adjetivos."),
      q("En la oración: 'El zorro es astuto y veloz', ¿cuáles son los dos adjetivos?", [["🦊", "astuto y veloz"], ["🦊", "el zorro"], ["🦊", "es"]], 0, "Pista: dicen cómo es el zorro."),
      q("¿Qué adjetivo concuerda bien con 'las flores'?", [["🌸", "hermosas"], ["🌸", "hermoso"], ["🌸", "hermosa"]], 0, "Pista: debe ser femenino y plural como las flores."),
      q("¿Qué adjetivo concuerda bien con 'el bosque'?", [["🌲", "antiguo"], ["🌲", "antigua"], ["🌲", "antiguos"]], 0, "Pista: debe ser masculino y singular: el bosque antiguo."),
      q("¿Cuál de estas palabras es un adjetivo que describe sabor?", [["🍯", "dulce"], ["🍯", "miel"], ["🍯", "comer"]], 0, "Pista: 'miel' es la cosa, 'dulce' es cómo sabe."),
      q("¿Cuál de estas palabras es un adjetivo que describe tamaño?", [["🏔️", "gigante"], ["🏔️", "montaña"], ["🏔️", "subir"]], 0, "Pista: gigante describe el tamaño."),
      q("Tocá los adjetivos calificativos", [["✨", "brillante"], ["❄️", "frío"], ["🟡", "dorado"], ["🪨", "piedra"]], [0, 1, 2], "Pista: tres describen cualidades; piedra es un sustantivo."),
      q("Completá: 'La nieve patagónica es muy ____.'", [["❄️", "blanca y fría"], ["❄️", "blanco y frío"], ["❄️", "caliente"]], 0, "Pista: la nieve es femenina y muy fría."),
    ],
  },

  // 31: Familias de Palabras
  31: {
    skills: ["l2-familias-palabras"],
    prompt: "Familias de Palabras (comparten raíz y significado)",
    qList: [
      q("¿Qué palabra pertenece a la familia de 'pan'?", [["🥖", "panadero y panadería"], ["🍎", "manzana"], ["🐟", "pescado"]], 0, "Pista: comparten la raíz pan-."),
      q("¿Qué palabra NO pertenece a la familia de 'flor'?", [["🚗", "flota de autos"], ["🌸", "florero"], ["🌸", "florería"]], 0, "Pista: florero y florería vienen de flor; flota viene de flotar."),
      q("¿Qué palabras forman la familia de 'mar'?", [["🌊", "marinero, marea y submarino"], ["🌲", "bosque y árbol"], ["🏠", "casa y casita"]], 0, "Pista: todas se relacionan con el mar."),
      q("¿Cuál es la palabra base o primitiva de: zapatero, zapatería y zapatilla?", [["👟", "zapato"], ["👟", "pata"], ["👟", "tapa"]], 0, "Pista: todas nacen de la palabra zapato."),
      q("¿Qué palabra pertenece a la familia de 'árbol'?", [["🌳", "arboleda y arbolito"], ["🌾", "arbusto"], ["🍂", "hoja"]], 0, "Pista: comparten la raíz árbol-."),
      q("¿Por qué las palabras de una misma familia se escriben con la misma letra base?", [["✨", "Porque conservan la ortografía de la raíz primitiva"], ["❌", "Porque cada una se escribe como quiere"], ["🎲", "Por casualidad"]], 0, "Pista: panadero va con p porque pan va con p."),
      q("Tocá las palabras que son familia de 'libro'", [["📚", "librería"], ["📚", "librero"], ["📚", "libreta"], ["🎈", "libre (en libertad)"]], [0, 1, 2], "Pista: tres se relacionan con el objeto libro."),
      q("¿Qué palabra pertenece a la familia de 'pescado'?", [["🎣", "pescador y pescadería"], ["🍖", "carnicería"], ["🥛", "lechería"]], 0, "Pista: se relacionan con la pesca."),
    ],
  },

  // 32: Aumentativos y Diminutivos
  32: {
    skills: ["l2-familias-palabras"],
    prompt: "Sufijación: Diminutivos (-ito, -ita) y Aumentativos (-ón, -ote, -aza)",
    qList: [
      q("¿Cómo se llama un árbol pequeño usando un diminutivo?", [["🌱", "arbolito"], ["🌳", "arbolote"], ["🌲", "arbolazo"]], 0, "Pista: los diminutivos terminan en -ito o -ita."),
      q("¿Cómo se llama un perro muy grande usando un aumentativo?", [["🐕", "perrazo o perrote"], ["🐕", "perrito"], ["🐕", "perrillo"]], 0, "Pista: los aumentativos terminan en -azo, -ote o -ón."),
      q("¿Cuál es el diminutivo de 'casa'?", [["🏠", "casita"], ["🏠", "casona"], ["🏠", "casota"]], 0, "Pista: una casa chiquita es una casita."),
      q("¿Cuál es el aumentativo de 'barco'?", [["🚢", "barcaza o barcote"], ["🚢", "barquito"], ["🚢", "barquito veloz"]], 0, "Pista: un barco enorme es un barcote o barcaza."),
      q("¿Qué terminación usamos para hacer diminutivos cariñosos?", [["✨", "-ito y -ita"], ["✨", "-ón y -ona"], ["✨", "-ero y -era"]], 0, "Pista: hermanito, mamita, gatito."),
      q("¿Cuál es el aumentativo de 'gol'?", [["⚽", "golazo"], ["⚽", "golcito"], ["⚽", "goleada"]], 0, "Pista: un gol extraordinario es un golazo."),
      q("¿Qué expresa la palabra 'pajarito'?", [["🐦", "Un pájaro pequeño o con ternura"], ["🦅", "Un águila gigante"], ["🦖", "Un dinosaurio"]], 0, "Pista: el diminutivo indica tamaño chico o cariño."),
      q("Clasificá: ¿'gatazo' es diminutivo o aumentativo?", [["🐱", "Aumentativo (gato grande)"], ["🐱", "Diminutivo (gato chiquito)"], ["🐱", "Ninguno"]], 0, "Pista: la terminación -azo indica gran tamaño."),
    ],
  },

  // 33: El Abecedario
  33: {
    skills: ["l2-abecedario"],
    prompt: "El Abecedario: orden alfabético de la A a la Z",
    qList: [
      q("¿Qué letra va primero en el abecedario?", [["🔤", "A"], ["🔤", "B"], ["🔤", "Z"]], 0, "Pista: el abecedario empieza con la letra A."),
      q("¿Qué letra va última en el abecedario?", [["🔤", "Z"], ["🔤", "Y"], ["🔤", "X"]], 0, "Pista: la Z cierra el abecedario."),
      q("¿Qué letra está entre la M y la O en el abecedario?", [["🔤", "N"], ["🔤", "P"], ["🔤", "L"]], 0, "Pista: M, N, O..."),
      q("Si ordenamos alfabéticamente: 'casa', 'árbol' y 'barco', ¿quién va primero?", [["🌳", "árbol (empieza con A)"], ["⛵", "barco (con B)"], ["🏠", "casa (con C)"]], 0, "Pista: la A está antes que la B y la C."),
      q("¿Para qué usamos el orden alfabético?", [["📚", "Para buscar palabras en el diccionario y organizar listas de alumnos"], ["⏱️", "Para saber la hora"], ["⚖️", "Para pesar manzanas"]], 0, "Pista: el diccionario sigue el orden de la A a la Z."),
      q("¿Cuál de estas palabras va última en el abecedario?", [["🦊", "zorro (empieza con Z)"], ["🦁", "león (con L)"], ["🐕", "perro (con P)"]], 0, "Pista: la Z está al final de todo."),
      q("¿Qué letra sigue después de la P en el abecedario?", [["🔤", "Q"], ["🔤", "O"], ["🔤", "R"]], 0, "Pista: O, P, Q, R..."),
      q("Si dos palabras empiezan con la misma letra, ¿cómo desempatamos su orden?", [["🔍", "Miramos la segunda letra"], ["🎲", "Tiramos un dado"], ["📏", "La que sea más larga"]], 0, "Pista: si las dos empiezan con C, comparamos la segunda letra."),
    ],
  },

  // 34: Estructura del Cuento
  34: {
    skills: ["l2-comprension-cuento"],
    prompt: "Estructura del Cuento: Inicio, Nudo y Desenlace",
    qList: [
      q("¿Qué parte del cuento presenta a los personajes y el lugar donde empieza la historia?", [["📖", "El inicio (Había una vez...)"], ["⚡", "El nudo o problema"], ["🏁", "El desenlace final"]], 0, "Pista: nos cuenta quiénes son y dónde viven."),
      q("¿Qué parte del cuento relata el problema o desafío que deben resolver los personajes?", [["⚡", "El nudo o conflicto (De repente...)"], ["📖", "El inicio"], ["🏁", "El título"]], 0, "Pista: es el momento de mayor emoción y dificultad."),
      q("¿Cómo se llama la parte final donde se resuelve el problema y termina la historia?", [["🏁", "El desenlace o final (Y finalmente...)"], ["⚡", "El conflicto"], ["📖", "El prólogo"]], 0, "Pista: suele terminar con 'y colorín colorado...'."),
      q("¿Qué frase típica suele iniciar un cuento tradicional?", [["✨", "Había una vez..."], ["🏁", "Y vivieron felices"], ["⚡", "De repente se apagó la luz"]], 0, "Pista: es la fórmula clásica de inicio."),
      q("En el cuento de Caperucita Roja, ¿cuál es el nudo o problema?", [["🐺", "El lobo engaña a Caperucita y llega antes a la casa de la abuela"], ["🧺", "Caperucita sale con la canastita"], ["🏡", "Caperucita merienda con su abuela salvada"]], 0, "Pista: es la complicación que pone en peligro a los personajes."),
      q("¿Quién es el autor o ilustrador de un cuento?", [["✍️", "El autor escribe la historia y el ilustrador hace los dibujos"], ["📚", "El bibliotecario que presta los libros"], ["🧑‍🏫", "El maestro que toma lista"]], 0, "Pista: sus nombres aparecen en la portada del libro."),
      q("¿Qué personaje suele ayudar al protagonista en los cuentos?", [["🤝", "El ayudante o amigo leal"], ["🦹", "El villano malvado"], ["🐉", "El monstruo enemigo"]], 0, "Pista: le da consejos o herramientas mágicas para resolver el nudo."),
      q("¿Por qué nos gusta escuchar y leer cuentos?", [["❤️", "Porque estimulan la imaginación, nos emocionan y nos enseñan"], ["😴", "Solo para dormirnos rápido"], ["📺", "Para no hablar con nadie"]], 0, "Pista: la literatura nos transporta a mundos mágicos."),
    ],
  },

  // 35: Fábulas y Moralejas
  35: {
    skills: ["l2-comprension-cuento"],
    prompt: "Lectura de Fábulas: personajes y moraleja",
    qList: [
      q("¿Qué es una fábula?", [["🦊", "Una historia breve con animales que hablan y nos deja una enseñanza"], ["📰", "Una noticia del diario"], ["🧁", "Una receta de cocina"]], 0, "Pista: animales como la zorra, la liebre o la tortuga son protagonistas."),
      q("¿Cómo se llama la enseñanza que nos deja una fábula al final?", [["💡", "La moraleja"], ["🏁", "El chiste"], ["📦", "El paquete"]], 0, "Pista: nos hace reflexionar sobre nuestras actitudes y valores."),
      q("En la fábula de 'La liebre y la tortuga', ¿por qué gana la tortuga?", [["🐢", "Porque fue constante y no se confió, mientras la liebre se durmió"], ["🐇", "Porque la liebre corrió más despacio"], ["🏃", "Porque la liebre se distrajo por el camino"]], 0, "Pista: la constancia y el esfuerzo vencen a la vanidad."),
      q("En la fábula de 'El león y el ratón', ¿cómo ayuda el pequeño ratón al rey de la selva?", [["🐭", "Royó las cuerdas de la red con sus dientes para liberarlo"], ["🏃", "Distrajo a los cazadores haciendo ruido"], ["🌳", "Escondió al león detrás de unas ramas"]], 0, "Pista: hasta el más chiquito puede ayudar a los más grandes."),
      q("¿Qué animales suelen protagonizar las fábulas?", [["🦊", "Animales que actúan y hablan como personas"], ["🪐", "Planetas y estrellas del cielo"], ["🚗", "Autos y camiones de juguete"]], 0, "Pista: representan virtudes o defectos humanos."),
      q("¿Qué moraleja nos enseña no mentir como el pastorcito que gritaba '¡ahí viene el lobo!'?", [["🗣️", "Que si mentimos siempre, nadie nos creerá cuando digamos la verdad"], ["🐺", "Que hay que gritar fuerte para asustar al lobo"], ["🏃", "Que siempre hay que correr sin mirar atrás"]], 0, "Pista: la honestidad es fundamental para que confíen en nosotros."),
      q("¿Quién fue Esopo?", [["📜", "Un famoso fabulista de la antigüedad que escribió fábulas inolvidables"], ["🧑‍✈️", "Un piloto de avión"], ["👑", "Un rey de América"]], 0, "Pista: escribió fábulas hace más de dos mil años que aún leemos."),
      q("¿Dónde suele ubicarse la moraleja en una fábula?", [["🔚", "Al final del texto como conclusión"], ["📖", "En la primera palabra"], ["🖼️", "En el marco de la foto"]], 0, "Pista: se lee al terminar la historia para recordar la enseñanza."),
    ],
  },

  // 36: Trabalenguas y Rimas
  36: {
    skills: ["l2-poesia-rimas"],
    prompt: "Poesía y recursos sonoros: trabalenguas y rimas",
    qList: [
      q("¿Qué es un trabalenguas?", [["👅", "Un juego de palabras difícil de pronunciar rápido sin equivocarse"], ["🍲", "Una sopa espesa"], ["🔨", "Una herramienta de carpintero"]], 0, "Pista: repite sonidos parecidos para que la lengua 'se trabe'."),
      q("Completá el trabalenguas: 'Tres tristes tigres comen trigo en un...'", [["🌾", "trigal"], ["🍽️", "plato"], ["🏠", "patio"]], 0, "Pista: tri-gal rima con trigo y tigres."),
      q("¿Qué palabra rima con 'montaña'?", [["🕷️", "araña"], ["🌲", "bosque"], ["❄️", "nieve"]], 0, "Pista: mon-ta-ña y a-ra-ña terminan con el mismo sonido -aña."),
      q("¿Qué palabra rima con 'calafate'?", [["🧉", "chocolate o mate"], ["🫐", "frutilla"], ["🌊", "río"]], 0, "Pista: terminan con el sonido -ate."),
      q("¿Qué es una adivinanza?", [["🧩", "Un enigma en verso que nos da pistas para descubrir un objeto"], ["📰", "Una lista de supermercado"], ["🛑", "Un cartel de tránsito"]], 0, "Pista: rimando te desafía: '¿qué será, qué es?'."),
      q("Adivinanza: 'Vuelo de noche, duermo de día y nunca verás plumas en el ala mía. ¿Quién soy?'", [["🦇", "El murciélago"], ["🦅", "El cóndor"], ["🦜", "El loro"]], 0, "Pista: duerme colgado cabeza abajo en cuevas oscuras."),
      q("¿Por qué los poemas tienen rima y ritmo?", [["🎵", "Porque suenan como música para el oído y transmiten emociones"], ["📏", "Para medir cuántas letras tienen"], ["❌", "Por casualidad"]], 0, "Pista: la musicalidad de las palabras alegra la lectura."),
      q("Completá la rima: 'En el bosque de lengas doradas, juegan las aves...'", [["🧚", "encantadas"], ["🐟", "mojadas"], ["🚗", "estacionadas"]], 0, "Pista: do-ra-das rima con en-can-ta-das."),
    ],
  },

  // 37: Textos Instructivos (Recetas)
  37: {
    skills: ["l2-textos-instructivos"],
    prompt: "Textos Instructivos: ingredientes y orden de pasos",
    qList: [
      q("¿Qué tipo de texto nos da instrucciones ordenadas para preparar una comida?", [["🧁", "La receta de cocina"], ["📰", "La noticia del diario"], ["💌", "La carta de amor"]], 0, "Pista: tiene una lista de ingredientes y pasos numerados."),
      q("¿Cuáles son las dos partes principales de una receta?", [["📋", "Ingredientes y modo de preparación (pasos)"], ["📖", "Inicio y moraleja"], ["🖼️", "Fotos y autógrafos"]], 0, "Pista: primero qué necesitamos y después cómo se hace."),
      q("¿Por qué los pasos de una receta están numerados (1, 2, 3...)?", [["🔢", "Para seguir el orden correcto sin saltear ningún paso"], ["🎲", "Para jugar a la lotería"], ["⏰", "Para saber la hora"]], 0, "Pista: si horneás antes de amasar, la comida no sale."),
      q("¿Qué palabras de acción se usan mucho en las recetas?", [["🥣", "Mezclar, batir, hornear y cortar"], ["🏃", "Correr, saltar y bailar"], ["😴", "Dormir y soñar"]], 0, "Pista: son verbos que indican qué hacer con los ingredientes."),
      q("Si una receta dice: '1 taza de harina', ¿en qué parte está?", [["🧺", "En la lista de ingredientes"], ["🔥", "En la preparación"], ["🏁", "En el saludo final"]], 0, "Pista: es la cantidad del producto que se necesita."),
      q("¿Qué otro texto instructivo conocemos además de la receta?", [["🎮", "Las reglas de un juego de mesa o el manual para armar un juguete"], ["📜", "Un poema de amor"], ["📰", "Un cuento de hadas"]], 0, "Pista: te explica paso a paso cómo jugar o construir algo."),
      q("¿Por qué es importante respetar las cantidades indicadas en una receta?", [["⚖️", "Para que la comida quede rica y con la consistencia adecuada"], ["🎨", "Para que cambie de color"], ["💨", "Para que vuele"]], 0, "Pista: poner demasiada sal o poca harina arruina la preparación."),
      q("¿Cuál es el primer paso antes de empezar a cocinar en la cocina?", [["🧼", "Lavarse muy bien las manos con agua y jabón"], ["🍽️", "Servir la comida en los platos"], ["🧹", "Barrer la cocina al terminar"]], 0, "Pista: la higiene de los cocineros es fundamental."),
    ],
  },

  // 38: Cartas y Mensajes Sociales
  38: {
    skills: ["l2-textos-sociales", "l2-escritura-oraciones"],
    prompt: "Textos Epistolares y Sociales: cartas, notas y mensajes",
    qList: [
      q("¿Cómo se llama la persona a quien le escribimos una carta o mensaje?", [["📬", "El destinatario"], ["✍️", "El remitente"], ["📦", "El cartero"]], 0, "Pista: es la persona que va a recibir la carta: 'Para...'"),
      q("¿Cómo se llama la persona que escribe y firma la carta?", [["✍️", "El remitente (o emisor)"], ["📬", "El destinatario"], ["🏤", "El empleado del correo"]], 0, "Pista: pone su nombre al final: 'Con cariño, Sofía'."),
      q("¿Qué partes tiene una carta tradicional?", [["✉️", "Lugar y fecha, saludo, cuerpo (mensaje), despedida y firma"], ["📖", "Inicio, nudo y moraleja"], ["🧁", "Ingredientes y cocción"]], 0, "Pista: empieza con la fecha y quién la recibe, y termina con la firma."),
      q("¿Qué mensaje breve dejamos pegado en la heladera para avisar algo rápido?", [["📝", "Una nota o esquela"], ["📰", "Una noticia del diario"], ["📖", "Un libro de cuentos largo"]], 0, "Pista: 'Fui al almacén, vuelvo en diez minutos. Mamá'."),
      q("¿Dónde se colocan las cartas de papel para enviarlas por correo postal?", [["✉️", "Adentro de un sobre con estampilla"], ["📦", "En una bolsa de supermercado"], ["🗑️", "En el tacho de basura"]], 0, "Pista: el sobre tiene los datos del destinatario en el frente."),
      q("¿Qué medio digital usamos hoy para mandar un mensaje instantáneo a un familiar?", [["📱", "Un mensaje de WhatsApp o correo electrónico"], ["🕊️", "Una paloma mensajera"], ["💨", "Señales de humo"]], 0, "Pista: llega en un segundo a la pantalla del celular."),
      q("¿Qué tipo de texto combina dibujos con globitos donde hablan los personajes?", [["💬", "La historieta o cómic"], ["📰", "La noticia"], ["🧁", "El recetario"]], 0, "Pista: tiene viñetas cuadradas y globos de diálogo."),
      q("¿Por qué escribimos cartas y notas a nuestros seres queridos?", [["💌", "Para comunicarnos, saludarlos, contarles noticias y expresarles cariño"], ["😴", "Solo para cansarnos la mano"], ["❌", "Para que no nos contesten"]], 0, "Pista: las cartas unen a las personas aunque estén lejos."),
    ],
  },
};

// Despachador principal de Lengua de 2.º grado
export function buildLenguaActivities(world: WorldDef): ActivitySpec[] {
  const n = world.worldNumber ?? 1;
  const skills = world.skills ?? ["l2-fluidez"];

  if (n === 1) {
    return numbered(buildMundo1(skills));
  }

  // Trabadas DR a PR (mundos 2 a 13)
  const trabadas = ["dr", "tr", "cr", "cl", "fr", "fl", "gr", "gl", "br", "bl", "pl", "pr"];
  if (n >= 2 && n <= 13) {
    const pattern = trabadas[n - 2];
    return numbered(buildTrabadaWorld(world, pattern));
  }

  if (n === 14) {
    return numbered(buildMundo14(skills));
  }

  const gDef = GRAMMAR_WORLDS_BANKS[n];
  if (gDef) {
    const acts: ActivitySpec[] = gDef.qList.map((item, i) => {
      const actId = `l${n}-${i}`;
      const itemSkills = item.skills ?? gDef.skills;
      const ansIdx = typeof item.answer === "number" ? item.answer : item.answer[0];
      const correctOpt = item.options[ansIdx];

      if (i === 2 && correctOpt) {
        return {
          type: "true-false" as const,
          id: actId,
          title: "",
          statement: `En la consigna: "${item.prompt}", ¿la opción correcta es "${correctOpt[1]}"?`,
          isTrue: true,
          hint: item.hint ?? "Pista: leé bien la consigna y pensá con calma.",
          skills: itemSkills,
        };
      }

      if (i === 5 && correctOpt) {
        const wrongOpt = item.options.find((_, idx) => idx !== ansIdx) || item.options[1];
        return {
          type: "true-false" as const,
          id: actId,
          title: "",
          statement: `En la consigna: "${item.prompt}", ¿la opción correcta es "${wrongOpt[1]}"?`,
          isTrue: false,
          hint: item.hint ?? "Pista: revisá si esa opción responde realmente a la consigna.",
          skills: itemSkills,
        };
      }

      const dictWords: Record<number, { w: string; h: string }> = {
        15: { w: "queso", h: "Pista: alimento con qu que le gusta al ratón." },
        16: { w: "cine", h: "Pista: lugar con pantalla grande donde vemos películas (con ci)." },
        17: { w: "guitarra", h: "Pista: instrumento de cuerdas (con gu)." },
        18: { w: "girasol", h: "Pista: flor amarilla que gira hacia el sol (con gi)." },
        19: { w: "pingüino", h: "Pista: ave marina patagónica (con güi)." },
        20: { w: "cigarra", h: "Pista: insecto cantarín del verano (con rr)." },
        21: { w: "bombero", h: "Pista: persona que apaga los incendios (con mb)." },
        22: { w: "helado", h: "Pista: postre frío dulce (comienza con h)." },
        23: { w: "choique", h: "Pista: ave corredora patagónica (con ch)." },
      };

      if (i === 7 && dictWords[n]) {
        return {
          type: "dictation" as const,
          id: actId,
          title: "Dictado de palabra",
          prompt: "Escuchá con atención y escribí la palabra.",
          say: dictWords[n].w,
          answer: dictWords[n].w,
          kind: "palabra",
          hint: dictWords[n].h,
          skills: [...itemSkills, "l2-dictado-palabra"],
        };
      }

      return {
        type: "pick" as const,
        id: actId,
        title: "",
        prompt: item.prompt,
        cards: shuffle(item.options.map(([emoji, label], idx) => ({ id: `o${idx}`, emoji, label }))),
        answerIds: Array.isArray(item.answer) ? item.answer.map((a) => `o${a}`) : [`o${item.answer}`],
        hint: item.hint ?? "Pista: mirá con atención las palabras.",
        skills: itemSkills,
      };
    });
    return numbered(acts.slice(0, world.activityCount ?? 8));
  }

  // Fallback seguro
  return numbered(buildMundo1(skills));
}
