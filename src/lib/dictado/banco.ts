// Banco de dictados y progresión por grado para 2.º y 3.º grado.
import { DESAFIOS, desafioActivo } from "@/lib/eventos/config";
import { WorldDef } from "@/types";
import { numeroEnLetras } from "./numero-letras";

export type DictationKind = "numero" | "palabra" | "oracion";

export interface DictadoItem {
  kind: DictationKind;
  say: string;
  answer: string;
  strictAccents?: boolean;
  hint: string;
  skills: string[];
}

// Determina el nivel curricular (1, 2 o 3) según el mes del ciclo lectivo argentino:
// Nivel 1: marzo – abril (meses 2 y 3)
// Nivel 2: mayo – agosto (meses 4 a 7)
// Nivel 3: septiembre – diciembre (meses 8 a 11)
// Enero y febrero: nivel 1 (o de diagnóstico)
// Hora argentina (UTC−3, sin horario de verano): así el servidor (en UTC) y el
// navegador de los chicos cambian de semana y de mes al mismo tiempo.
function enArgentina(fecha: Date): Date {
  return new Date(fecha.getTime() - 3 * 3600 * 1000);
}

export function nivelDeDictado(grade: number, fecha: Date = new Date()): 1 | 2 | 3 {
  const m = enArgentina(fecha).getUTCMonth(); // 0 a 11
  if (m >= 8 && m <= 11) return 3;
  if (m >= 4 && m <= 7) return 2;
  return 1;
}

// Cálculo de semana ISO (lunes a domingo)
export function getISOWeek(date: Date): number {
  const a = enArgentina(date);
  const d = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// El Mundo del Dictado aparece semana por medio (semanas ISO pares)
// Configurable desde el panel (Desafíos y eventos): fechas, días y grados.
export function esSemanaDeDictado(fecha: Date = new Date(), grade?: number): boolean {
  return desafioActivo(DESAFIOS.dictado, grade, fecha, () => getISOWeek(fecha) % 2 === 0);
}

// Clave única de la semana de dictado para registrar intentos y premios: "2026-W40"
export function claveSemanaDictado(fecha: Date = new Date()): string {
  const a = enArgentina(fecha);
  const d = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return `${d.getUTCFullYear()}-W${String(getISOWeek(fecha)).padStart(2, "0")}`;
}

// ==========================================
// BANCOS DE 2.º GRADO
// ==========================================

export const NUMEROS_G2_NIVEL1 = [
  11, 12, 13, 14, 15, 16, 18, 20, 21, 22, 25, 29, 30, 34, 40, 47, 50, 56, 60, 68, 70, 75, 80, 89, 90, 99
];

export const NUMEROS_G2_NIVEL2 = [
  105, 120, 145, 180, 200, 215, 230, 250, 275, 300, 312, 340, 380, 400, 425, 450, 489, 500
];

export const NUMEROS_G2_NIVEL3 = [
  108, 204, 305, 409, 508, 540, 602, 650, 707, 720, 803, 850, 905, 909, 950, 990, 1000
];

export const PALABRAS_G2_NIVEL1 = [
  { w: "casa", h: "Pista: vivienda con paredes y techo." },
  { w: "pato", h: "Pista: ave que nada en las lagunas." },
  { w: "luna", h: "Pista: astro que ilumina la noche." },
  { w: "mate", h: "Pista: infusión tradicional argentina." },
  { w: "zorro", h: "Pista: animal astuto de la Patagonia." },
  { w: "puma", h: "Pista: felino autóctono que corre por la estepa." },
  { w: "mapa", h: "Pista: dibujo que muestra las rutas y pueblos." },
  { w: "nido", h: "Pista: casita que arman las aves en los árboles." },
  { w: "mesa", h: "Pista: mueble con patas para comer o estudiar." },
  { w: "sopa", h: "Pista: comida caliente en plato hondo." },
  { w: "pelo", h: "Pista: cabellera que cubre la cabeza." },
  { w: "lana", h: "Pista: abrigo que da la oveja patagónica." },
];

export const PALABRAS_G2_NIVEL2 = [
  { w: "blanco", h: "Pista: color de la nieve del glaciar." },
  { w: "brazo", h: "Pista: parte del cuerpo que une el hombro y la mano." },
  { w: "clavo", h: "Pista: pieza de metal para colgar cuadros." },
  { w: "crema", h: "Pista: dulce blanco para las tortas." },
  { w: "piedra", h: "Pista: roca dura del camino." },
  { w: "flor", h: "Pista: parte colorida de la planta." },
  { w: "fruta", h: "Pista: manzana, naranja o calafate dulce." },
  { w: "globo", h: "Pista: adorno redondo que se infla con aire." },
  { w: "granja", h: "Pista: campo con animales y huerta." },
  { w: "plato", h: "Pista: vajilla redonda para servir la comida." },
  { w: "primero", h: "Pista: el que llega antes que todos." },
  { w: "tren", h: "Pista: vagones que viajan sobre vías de hierro." },
];

export const PALABRAS_G2_NIVEL3 = [
  { w: "queso", h: "Pista: lácteo que le gustaba al ratón y al cuervo." },
  { w: "guitarra", h: "Pista: instrumento de cuerdas de la cigarra." },
  { w: "pingüino", h: "Pista: ave marina de las costas santacruceñas." },
  { w: "bombero", h: "Pista: persona que apaga los incendios (con mb)." },
  { w: "tambor", h: "Pista: instrumento de percusión (con mb)." },
  { w: "campo", h: "Pista: terreno rural con pastos y trigales (con mp)." },
  { w: "helado", h: "Pista: postre frío que comienza con h muda." },
  { w: "hoja", h: "Pista: parte verde del árbol que cae en otoño (con h)." },
  { w: "cigarra", h: "Pista: insecto que cantaba en el verano (con rr)." },
  { w: "hornero", h: "Pista: ave nacional que construye con barro (con h)." },
  { w: "quillango", h: "Pista: manta abrigada de cuero de guanaco." },
  { w: "calafate", h: "Pista: arbusto patagónico de fruto dulce violeta." },
];

export const ORACIONES_G2_NIVEL3 = [
  { s: "El zorro come calafate.", h: "Pista: empieza con mayúscula y termina con punto." },
  { s: "La ballena nada en el mar.", h: "Pista: recordá la mayúscula inicial y el punto final." },
  { s: "El hornero construye con barro.", h: "Pista: 5 palabras, con punto al final." },
  { s: "Los flamencos tienen patas coloradas.", h: "Pista: mayúscula en Los y punto final." },
  { s: "El tatú vive en el monte.", h: "Pista: oración simple con punto al terminar." },
  { s: "El guanaco corre por la meseta.", h: "Pista: animal veloz de Santa Cruz." },
  { s: "La luna ilumina la selva.", h: "Pista: empieza con mayúscula La y termina con punto." },
  { s: "El perro y el gato juegan.", h: "Pista: no te olvides del punto final." },
];

// ==========================================
// BANCOS DE 3.º GRADO
// ==========================================

export const NUMEROS_G3_NIVEL1 = [
  340, 520, 780, 890, 1005, 1020, 1150, 1205, 1250, 1340, 1400, 1499, 1500
];

export const NUMEROS_G3_NIVEL2 = [
  1800, 2040, 2305, 2500, 2890, 3005, 3050, 3520, 3900, 4018, 4200, 4500, 4800, 5000
];

export const NUMEROS_G3_NIVEL3 = [
  5008, 5400, 6040, 6500, 7040, 7200, 8003, 8500, 9090, 9500, 9909, 10000
];

export const PALABRAS_G3_TODOS = [
  // mb / nv
  { w: "sombrilla", h: "Pista: regla mb, protección para el sol." },
  { w: "invierno", h: "Pista: regla nv, estación más fría del año." },
  { w: "cambio", h: "Pista: regla mb, transformar o canjear algo." },
  { w: "invento", h: "Pista: regla nv, creación nueva y original." },
  { w: "bombón", h: "Pista: regla mb y tilde en la última sílaba.", strict: true },
  { w: "tranvía", h: "Pista: regla nv con tilde en la i.", strict: true },
  // plurales -z -> -ces
  { w: "luces", h: "Pista: plural de luz (termina en ces)." },
  { w: "peces", h: "Pista: plural de pez (termina en ces)." },
  { w: "nueces", h: "Pista: plural de nuez (termina en ces)." },
  { w: "voces", h: "Pista: plural de voz (termina en ces)." },
  // h inicial
  { w: "hueso", h: "Pista: empieza con hue- (lleva h inicial)." },
  { w: "huevo", h: "Pista: empieza con hue- (lleva h inicial)." },
  { w: "hielo", h: "Pista: empieza con hie- (lleva h inicial)." },
  { w: "huella", h: "Pista: rastro en la nieve o tierra (con h)." },
  { w: "humo", h: "Pista: vapor que sale del fuego (con h)." },
  // terminaciones -aba / -ave / -ava
  { w: "cantaba", h: "Pista: terminación -aba con b larga." },
  { w: "soñaba", h: "Pista: terminación -aba con b larga." },
  { w: "caminaba", h: "Pista: terminación -aba con b larga." },
  { w: "suave", h: "Pista: adjetivo que termina en -ave con v corta." },
  { w: "octava", h: "Pista: número ordinal que termina en -ava con v." },
  // agudas con tilde obligatoria (3.º grado)
  { w: "canción", h: "Pista: palabra aguda terminada en n, lleva tilde en la o.", strict: true },
  { w: "ratón", h: "Pista: palabra aguda terminada en n, lleva tilde en la o.", strict: true },
  { w: "también", h: "Pista: palabra aguda terminada en n, lleva tilde en la e.", strict: true },
  { w: "después", h: "Pista: palabra aguda terminada en s, lleva tilde en la e.", strict: true },
  { w: "jardín", h: "Pista: palabra aguda terminada en n, lleva tilde en la i.", strict: true },
  { w: "león", h: "Pista: palabra aguda terminada en n, lleva tilde en la o.", strict: true },
  { w: "corazón", h: "Pista: palabra aguda terminada en n, lleva tilde en la o.", strict: true },
];

export const ORACIONES_G3_TODOS = [
  { s: "¿Sabías que el cerro Chaltén tiene una nube blanca?", h: "Pista: abre con ¿ y cierra con ?." },
  { s: "¡Qué ricas son las frutas dulces del calafate patagónico!", h: "Pista: abre con ¡ y cierra con !." },
  { s: "En la laguna vimos cisnes, patos, flamencos y gaviotas.", h: "Pista: recordá las comas en la enumeración y el punto final." },
  { s: "¿Fuiste a visitar a la tortuga gigante al zoológico?", h: "Pista: pregunta con signos de interrogación y tilde en zoológico." },
  { s: "¡Qué alto que creció la planta mágica de porotos!", h: "Pista: oración exclamativa con tilde en Qué y signos ¡ !." },
  { s: "El guanaco, el zorro y el choique caminan por la estepa.", h: "Pista: enumeración con coma y punto al final." },
  { s: "¿Por qué los flamencos tienen las patas coloradas?", h: "Pista: pregunta que abre con ¿Por qué... y cierra con ?." },
  { s: "¡Qué hermosa leyenda nos contaron los abuelos de Santa Cruz!", h: "Pista: oración con signos de exclamación completos." },
];

// ==========================================
// BANCOS DE 4.º GRADO
// ==========================================

export const NUMEROS_G4_NIVEL1 = [
  1250, 2400, 3560, 4820, 5030, 6100, 7500, 8420, 9600, 9990
];

export const NUMEROS_G4_NIVEL2 = [
  12300, 15450, 20800, 25600, 34200, 45100, 56000, 68900, 72500, 85000
];

export const NUMEROS_G4_NIVEL3 = [
  10050, 20405, 30080, 40015, 50602, 60090, 70500, 80005, 90340, 99999
];

export const PALABRAS_G4_TODOS: { w: string; h: string; strict?: boolean }[] = [
  // Acentuación: agudas
  { w: "volcán", h: "Pista: palabra aguda terminada en n, lleva tilde en la a.", strict: true },
  { w: "compás", h: "Pista: palabra aguda terminada en s, lleva tilde en la a.", strict: true },
  { w: "patagón", h: "Pista: palabra aguda terminada en n, lleva tilde en la o.", strict: true },
  { w: "observación", h: "Pista: palabra aguda terminada en n con tilde en la o y c ante i.", strict: true },
  // Acentuación: graves
  { w: "árbol", h: "Pista: palabra grave terminada en l, lleva tilde en la a.", strict: true },
  { w: "fácil", h: "Pista: palabra grave terminada en l, lleva tilde en la a.", strict: true },
  { w: "césped", h: "Pista: palabra grave terminada en d, lleva tilde en la e.", strict: true },
  { w: "azúcar", h: "Pista: palabra grave terminada en r, lleva tilde en la u y zeta.", strict: true },
  { w: "difícil", h: "Pista: palabra grave terminada en l, lleva tilde en la segunda i.", strict: true },
  { w: "cráter", h: "Pista: palabra grave terminada en r, lleva tilde en la a.", strict: true },
  { w: "cóndor", h: "Pista: palabra grave terminada en r, lleva tilde en la primera o.", strict: true },
  // Acentuación: esdrújulas (todas llevan tilde)
  { w: "música", h: "Pista: palabra esdrújula, lleva tilde en la u.", strict: true },
  { w: "pájaro", h: "Pista: palabra esdrújula, lleva tilde en la primera a.", strict: true },
  { w: "brújula", h: "Pista: palabra esdrújula, lleva tilde en la primera u.", strict: true },
  { w: "oxígeno", h: "Pista: palabra esdrújula con x, lleva tilde en la i.", strict: true },
  { w: "máquina", h: "Pista: palabra esdrújula con qu, lleva tilde en la a.", strict: true },
  { w: "atmósfera", h: "Pista: palabra esdrújula, lleva tilde en la o.", strict: true },
  { w: "científico", h: "Pista: palabra esdrújula con c, lleva tilde en la segunda i.", strict: true },
  // Reglas ortográficas (mb, nv, h, j/g, homófonos)
  { w: "sombrero", h: "Pista: regla mb, accesorio para la cabeza." },
  { w: "invierno", h: "Pista: regla nv, estación más fría del año." },
  { w: "convivencia", h: "Pista: regla nv y terminación -encia con c." },
  { w: "paisaje", h: "Pista: terminación -aje con j." },
  { w: "personaje", h: "Pista: terminación -aje con j." },
  { w: "huella", h: "Pista: empieza con hue- (con h) y doble ll." },
  { w: "hierba", h: "Pista: empieza con hie- (con h) y b larga." },
  { w: "humedad", h: "Pista: empieza con hum- (con h)." },
];

export const ORACIONES_G4_TODOS = [
  { s: "En la cordillera de Santa Cruz contemplamos glaciares, lagos y bosques nativos.", h: "Pista: mayúscula inicial, coma en la enumeración y punto final." },
  { s: "¿Sabías que el cóndor andino es una de las aves voladoras más grandes del mundo?", h: "Pista: abre con ¿Sabías con tilde en la i y cierra con ?." },
  { s: "¡Qué emocionante fue navegar frente a las inmensas paredes de hielo del Perito Moreno!", h: "Pista: oración exclamativa con tildes y signos de apertura y cierre." },
  { s: "Los antiguos cazadores patagónicos fabricaban puntas de flecha y boleadoras de piedra.", h: "Pista: mayúscula inicial, ortografía de cazadores con z y punto final." },
  { s: "¿Quién descubrió el estrecho que une el océano Atlántico con el Pacífico?", h: "Pista: pregunta con ¿Quién... y tildes en Atlántico y Pacífico." },
  { s: "En el taller de ciencias clasificamos los materiales en conductores y aislantes térmicos.", h: "Pista: mayúscula, tilde en térmicos y punto final." },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Genera un ítem de dictado de número para el grado y nivel dado
export function generarDictadoNumero(grade: number, nivel: 1 | 2 | 3): DictadoItem {
  let pool: number[];
  if (grade === 2) {
    pool = nivel === 1 ? NUMEROS_G2_NIVEL1 : nivel === 2 ? NUMEROS_G2_NIVEL2 : NUMEROS_G2_NIVEL3;
  } else if (grade === 3) {
    pool = nivel === 1 ? NUMEROS_G3_NIVEL1 : nivel === 2 ? NUMEROS_G3_NIVEL2 : NUMEROS_G3_NIVEL3;
  } else {
    pool = nivel === 1 ? NUMEROS_G4_NIVEL1 : nivel === 2 ? NUMEROS_G4_NIVEL2 : NUMEROS_G4_NIVEL3;
  }
  const n = pool[Math.floor(Math.random() * pool.length)];
  const letras = numeroEnLetras(n);
  return {
    kind: "numero",
    say: letras,
    answer: String(n),
    hint: `Pista: el número es «${letras}».`,
    skills: grade === 2 ? ["m2-num-dictado"] : grade === 3 ? ["m3-num-dictado"] : ["m4-num-dictado"],
  };
}

// Genera un ítem de dictado de palabra u oración para el grado y nivel dado
export function generarDictadoLengua(grade: number, nivel: 1 | 2 | 3): DictadoItem {
  if (grade === 2) {
    if (nivel === 3 && Math.random() < 0.35) {
      // 35% de probabilidad de oración en nivel 3 de 2.º grado
      const o = ORACIONES_G2_NIVEL3[Math.floor(Math.random() * ORACIONES_G2_NIVEL3.length)];
      return {
        kind: "oracion",
        say: o.s,
        answer: o.s,
        hint: o.h,
        skills: ["l2-dictado-oracion"],
      };
    }
    const pool = nivel === 1 ? PALABRAS_G2_NIVEL1 : nivel === 2 ? PALABRAS_G2_NIVEL2 : PALABRAS_G2_NIVEL3;
    const p = pool[Math.floor(Math.random() * pool.length)];
    return {
      kind: "palabra",
      say: p.w,
      answer: p.w,
      hint: p.h,
      skills: ["l2-dictado-palabra"],
    };
  }

  if (grade === 4) {
    if (Math.random() < 0.3) {
      const o = ORACIONES_G4_TODOS[Math.floor(Math.random() * ORACIONES_G4_TODOS.length)];
      return {
        kind: "oracion",
        say: o.s,
        answer: o.s,
        strictAccents: true,
        hint: o.h,
        skills: ["l4-dictado-oracion"],
      };
    }
    const p = PALABRAS_G4_TODOS[Math.floor(Math.random() * PALABRAS_G4_TODOS.length)];
    return {
      kind: "palabra",
      say: p.w,
      answer: p.w,
      strictAccents: p.strict ?? false,
      hint: p.h,
      skills: ["l4-dictado-palabra"],
    };
  }

  // 3.º grado
  if (Math.random() < 0.3) {
    const o = ORACIONES_G3_TODOS[Math.floor(Math.random() * ORACIONES_G3_TODOS.length)];
    return {
      kind: "oracion",
      say: o.s,
      answer: o.s,
      strictAccents: true,
      hint: o.h,
      skills: ["l3-dictado-oracion"],
    };
  }
  const p = PALABRAS_G3_TODOS[Math.floor(Math.random() * PALABRAS_G3_TODOS.length)];
  return {
    kind: "palabra",
    say: p.w,
    answer: p.w,
    strictAccents: p.strict ?? false,
    hint: p.h,
    skills: ["l3-dictado-palabra"],
  };
}

// Genera un set de 10 actividades para el Mundo del Dictado (5 números + 5 lengua) sin repetir
export function generarSetMundoDictado(grade: number, fecha: Date = new Date()): DictadoItem[] {
  const nivel = nivelDeDictado(grade, fecha);

  // 5 números distintos
  let numPool: number[];
  if (grade === 2) {
    numPool = nivel === 1 ? NUMEROS_G2_NIVEL1 : nivel === 2 ? NUMEROS_G2_NIVEL2 : NUMEROS_G2_NIVEL3;
  } else if (grade === 3) {
    numPool = nivel === 1 ? NUMEROS_G3_NIVEL1 : nivel === 2 ? NUMEROS_G3_NIVEL2 : NUMEROS_G3_NIVEL3;
  } else {
    numPool = nivel === 1 ? NUMEROS_G4_NIVEL1 : nivel === 2 ? NUMEROS_G4_NIVEL2 : NUMEROS_G4_NIVEL3;
  }
  const pickedNums = shuffle(numPool).slice(0, 5);
  const numItems: DictadoItem[] = pickedNums.map((n) => ({
    kind: "numero",
    say: numeroEnLetras(n),
    answer: String(n),
    hint: `Pista: el número es «${numeroEnLetras(n)}».`,
    skills: grade === 2 ? ["m2-num-dictado"] : grade === 3 ? ["m3-num-dictado"] : ["m4-num-dictado"],
  }));

  // 5 palabras u oraciones distintas
  const lenguaItems: DictadoItem[] = [];
  if (grade === 2) {
    const pool = nivel === 1 ? PALABRAS_G2_NIVEL1 : nivel === 2 ? PALABRAS_G2_NIVEL2 : PALABRAS_G2_NIVEL3;
    const pickedP = shuffle(pool).slice(0, nivel === 3 ? 4 : 5);
    for (const p of pickedP) {
      lenguaItems.push({
        kind: "palabra",
        say: p.w,
        answer: p.w,
        hint: p.h,
        skills: ["l2-dictado-palabra"],
      });
    }
    if (nivel === 3) {
      const o = shuffle(ORACIONES_G2_NIVEL3)[0];
      lenguaItems.push({
        kind: "oracion",
        say: o.s,
        answer: o.s,
        hint: o.h,
        skills: ["l2-dictado-oracion"],
      });
    }
  } else if (grade === 4) {
    // 4.º grado: 4 palabras + 1 oración
    const pickedP = shuffle(PALABRAS_G4_TODOS).slice(0, 4);
    for (const p of pickedP) {
      lenguaItems.push({
        kind: "palabra",
        say: p.w,
        answer: p.w,
        strictAccents: p.strict ?? false,
        hint: p.h,
        skills: ["l4-dictado-palabra"],
      });
    }
    const o = shuffle(ORACIONES_G4_TODOS)[0];
    lenguaItems.push({
      kind: "oracion",
      say: o.s,
      answer: o.s,
      strictAccents: true,
      hint: o.h,
      skills: ["l4-dictado-oracion"],
    });
  } else {
    // 3.º grado: 4 palabras + 1 oración
    const pickedP = shuffle(PALABRAS_G3_TODOS).slice(0, 4);
    for (const p of pickedP) {
      lenguaItems.push({
        kind: "palabra",
        say: p.w,
        answer: p.w,
        strictAccents: p.strict ?? false,
        hint: p.h,
        skills: ["l3-dictado-palabra"],
      });
    }
    const o = shuffle(ORACIONES_G3_TODOS)[0];
    lenguaItems.push({
      kind: "oracion",
      say: o.s,
      answer: o.s,
      strictAccents: true,
      hint: o.h,
      skills: ["l3-dictado-oracion"],
    });
  }

  // Intercalar 1 número, 1 lengua...
  const result: DictadoItem[] = [];
  for (let i = 0; i < 5; i++) {
    result.push(numItems[i]);
    result.push(lenguaItems[i]);
  }
  return result;
}

export function isDictationWorldId(id: number): boolean {
  return id === 28001 || id === 38001 || id === 48001;
}

export function getMundoDictado(grade: number): WorldDef {
  const id = grade === 2 ? 28001 : grade === 3 ? 38001 : 48001;
  return {
    id,
    grade,
    name: "Mundo del Dictado",
    emoji: "✍️",
    subject: "lengua",
    category: "dictado",
    description: "¡Semana de dictado! Si hacés todo bien en el primer intento, ganás 20 🪙 y el Lápiz dorado.",
    objective: "Escribir correctamente números, palabras y oraciones dictadas al sintetizador.",
    contents: ["Dictado de números", "Dictado de palabras", "Dictado de oraciones"],
    skills:
      grade === 2
        ? ["m2-num-dictado", "l2-dictado-palabra", "l2-dictado-oracion"]
        : grade === 3
          ? ["m3-num-dictado", "l3-dictado-palabra", "l3-dictado-oracion"]
          : ["m4-num-dictado", "l4-dictado-palabra", "l4-dictado-oracion"],
    kind: "dictado",
    activityCount: 10,
    colorFrom: "#fde68a",
    colorTo: "#d97706",
    difficulty: "basico",
  };
}
