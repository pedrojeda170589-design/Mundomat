// Explica a un chico de 2.º o 3.º qué escribió distinto en un dictado
// (pedido de Pedro, 14/10/2026: «cuando se equivoquen, brindales lo que
// debieron escribir y explicá qué colocaron mal o no colocaron»).
//
// Compara lo escrito con lo correcto letra por letra (y palabra por palabra
// en las oraciones) y devuelve:
// - `partes`: lo correcto, marcado para pintarlo en pantalla (bien, mal o
//   faltó);
// - `explicaciones`: frases cortas, como «Va con v, no con b» o «Te faltó la h
//   del principio: no suena, pero se escribe».

export type TipoParte = "ok" | "mal" | "falta";
export interface Parte {
  t: string;
  tipo: TipoParte;
}
export interface Diferencias {
  partes: Parte[];
  explicaciones: string[];
}

const TILDE: Record<string, string> = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u" };
const base = (c: string) => TILDE[c] ?? c;

type Op = { op: "=" | "s" | "d" | "i"; e?: string; u?: string; ie: number };

// Alineación de Levenshtein: e = esperado, u = escrito por el chico.
function alinear(e: string, u: string): Op[] {
  const n = e.length;
  const m = u.length;
  const d: number[][] = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) {
      const igual = e[i - 1] === u[j - 1];
      // Cambiar una letra por la misma sin tilde «cuesta» menos: así se alinea bien.
      const casi = !igual && base(e[i - 1].toLowerCase()) === base(u[j - 1].toLowerCase());
      d[i][j] = Math.min(d[i - 1][j - 1] + (igual ? 0 : casi ? 0.5 : 1), d[i - 1][j] + 1, d[i][j - 1] + 1);
    }
  const ops: Op[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const igual = e[i - 1] === u[j - 1];
      const casi = !igual && base(e[i - 1].toLowerCase()) === base(u[j - 1].toLowerCase());
      if (d[i][j] === d[i - 1][j - 1] + (igual ? 0 : casi ? 0.5 : 1)) {
        ops.push({ op: igual ? "=" : "s", e: e[i - 1], u: u[j - 1], ie: i - 1 });
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
      ops.push({ op: "d", e: e[i - 1], ie: i - 1 });
      i--;
    } else {
      ops.push({ op: "i", u: u[j - 1], ie: i });
      j--;
    }
  }
  return ops.reverse();
}

// Pares de letras que se confunden porque suenan igual.
function parecidas(a: string, b: string): string | null {
  const par = [a, b].sort().join("");
  const reglas: Record<string, string> = {
    bv: "suenan igual",
    cs: "suenan igual",
    sz: "suenan igual",
    cz: "suenan igual",
    gj: "suenan igual",
    iy: "suenan igual",
    ly: "suenan parecido",
    ck: "suenan igual",
    kq: "suenan igual",
    cq: "suenan igual",
    mn: "suenan parecido",
  };
  return reglas[par] ?? null;
}

// Explicaciones para una palabra (sin contar mayúsculas).
function explicarPalabra(esperada: string, escrita: string): { partes: Parte[]; exp: string[] } {
  const ops = alinear(esperada, escrita);
  const partes: Parte[] = [];
  const exp: string[] = [];
  const marca = new Array<TipoParte>(esperada.length).fill("ok");
  const agregar = (s: string) => {
    if (!exp.includes(s)) exp.push(s);
  };
  for (let k = 0; k < ops.length; k++) {
    const o = ops[k];
    if (o.op === "=") continue;
    if (o.op === "s") {
      const e = o.e!;
      const u = o.u!;
      if (e.toLowerCase() === u.toLowerCase()) {
        // Solo cambia mayúscula/minúscula: se avisa aparte (nombres propios).
        if (o.ie === 0 && e !== e.toLowerCase()) agregar(`«${esperada}» va con mayúscula: es un nombre propio.`);
        continue;
      }
      marca[o.ie] = "mal";
      const be = base(e.toLowerCase());
      const bu = base(u.toLowerCase());
      if (be === bu) {
        if (e === "ü") agregar("Faltó la diéresis: «ü» (los dos puntitos hacen que la u suene en «güe» y «güi»).");
        else if (TILDE[e]) agregar(`Faltó la tilde en la «${e}».`);
        else if (TILDE[u]) agregar(`La «${e}» no lleva tilde en esta palabra.`);
        continue;
      }
      const p = parecidas(be, bu);
      if (p) agregar(`Va con «${e}», no con «${u}» (${p}, pero se escriben distinto).`);
      else agregar(`Escribiste «${u}» donde va «${e}».`);
    } else if (o.op === "d") {
      marca[o.ie] = "falta";
      const e = o.e!;
      if (e === "h") agregar(`Te faltó la «h»: no suena, pero se escribe (${esperada}).`);
      else if (e === "u" && esperada[o.ie - 1]?.toLowerCase() === "q") agregar("Después de la «q» siempre va «u»: «que», «qui».");
      else if (e === "u" && esperada[o.ie - 1]?.toLowerCase() === "g" && "eiéí".includes(esperada[o.ie + 1] ?? "")) agregar("Para que suene «gue» o «gui», después de la «g» va una «u».");
      else if ((e === "r" && esperada[o.ie - 1] === "r") || (e === "r" && esperada[o.ie + 1] === "r")) agregar("Va con «rr»: entre dos vocales, el sonido fuerte se escribe con dos erres.");
      else if ((e === "l" && esperada[o.ie - 1] === "l") || (e === "l" && esperada[o.ie + 1] === "l")) agregar("Va con «ll» (doble ele).");
      else if (e === " ") agregar(`«${esperada}» son dos palabras: van separadas.`);
      else agregar(`Te faltó la letra «${e}».`);
    } else {
      const u = o.u!;
      // Marca la letra correcta más cercana para mostrar dónde sobró algo.
      if (o.ie < esperada.length && marca[o.ie] === "ok") marca[o.ie] = "mal";
      if (u === "h") agregar("Sobra la «h»: esta palabra no la lleva.");
      else if (u === " ") agregar(`«${esperada}» se escribe todo junto.`);
      else agregar(`Sobra la letra «${u}».`);
    }
  }
  // Palabra corrida por completo (por ejemplo, muy distinta): no sirve explicar letra por letra.
  const malas = marca.filter((x) => x !== "ok").length;
  if (malas > Math.max(3, esperada.length * 0.6)) {
    return { partes: [{ t: esperada, tipo: "mal" }], exp: [`Escuchá otra vez: la palabra es «${esperada}».`] };
  }
  for (let k = 0; k < esperada.length; k++) {
    const t = marca[k];
    const ult = partes[partes.length - 1];
    if (ult && ult.tipo === t) ult.t += esperada[k];
    else partes.push({ t: esperada[k], tipo: t });
  }
  return { partes, exp };
}

function limpiar(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

// Para una palabra suelta (o dos palabras, como «lobo marino»).
export function diferenciasPalabra(escrita: string, esperada: string): Diferencias {
  const u = limpiar(escrita);
  const e = limpiar(esperada);
  if (!u) return { partes: [{ t: e, tipo: "falta" }], explicaciones: ["No escribiste nada. ¡Probá la próxima!"] };
  // Mayúscula de nombre propio: se compara con la primera letra tal cual.
  const r = explicarPalabra(e, u);
  return { partes: r.partes, explicaciones: r.exp.slice(0, 3) };
}

const PUNT = /^[¿¡]|[.,;:!?]$/g;

// Para una oración: palabra por palabra, más mayúscula inicial y signos.
export function diferenciasOracion(escrita: string, esperada: string): Diferencias {
  const u = limpiar(escrita);
  const e = limpiar(esperada);
  const exp: string[] = [];
  if (!u) return { partes: [{ t: e, tipo: "falta" }], explicaciones: ["No escribiste nada. ¡Probá la próxima!"] };
  if (/^[¿¡]?[A-ZÁÉÍÓÚÑ]/.test(e) && !/^[¿¡]?[A-ZÁÉÍÓÚÑ]/.test(u)) exp.push("La oración empieza con mayúscula.");
  if (e.startsWith("¿") && !u.startsWith("¿")) exp.push("Faltó abrir la pregunta con «¿».");
  if (e.startsWith("¡") && !u.startsWith("¡")) exp.push("Faltó abrir la exclamación con «¡».");
  const finE = e.slice(-1);
  if (/[.?!]/.test(finE) && u.slice(-1) !== finE) exp.push(finE === "." ? "Faltó el punto final." : `Faltó cerrar con «${finE}».`);

  const pe = e.split(" ");
  const pu = u.split(" ");
  const norm = (w: string) => w.replace(PUNT, "").toLowerCase();
  // Alineación por palabras (misma idea que por letras).
  const n = pe.length;
  const m = pu.length;
  const d: number[][] = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  const costo = (a: string, b: string) => {
    if (norm(a) === norm(b)) return 0;
    const ops = alinear(norm(a), norm(b)).filter((o) => o.op !== "=").length;
    return ops <= Math.max(2, norm(a).length / 2) ? 0.6 : 1.5;
  };
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) d[i][j] = Math.min(d[i - 1][j - 1] + costo(pe[i - 1], pu[j - 1]), d[i - 1][j] + 1, d[i][j - 1] + 1);
  const pares: { e?: string; u?: string }[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && Math.abs(d[i][j] - (d[i - 1][j - 1] + costo(pe[i - 1], pu[j - 1]))) < 1e-9) {
      pares.push({ e: pe[i - 1], u: pu[j - 1] });
      i--;
      j--;
    } else if (i > 0 && Math.abs(d[i][j] - (d[i - 1][j] + 1)) < 1e-9) {
      pares.push({ e: pe[i - 1] });
      i--;
    } else {
      pares.push({ u: pu[j - 1] });
      j--;
    }
  }
  pares.reverse();
  const partes: Parte[] = [];
  const espacio = () => partes.length && partes.push({ t: " ", tipo: "ok" });
  for (const p of pares) {
    if (p.e && p.u) {
      espacio();
      const we = p.e.replace(PUNT, "");
      const wu = p.u.replace(PUNT, "");
      const pre = p.e.match(/^[¿¡]/)?.[0] ?? "";
      const post = p.e.match(/[.,;:!?]$/)?.[0] ?? "";
      if (pre) partes.push({ t: pre, tipo: p.u.startsWith(pre) ? "ok" : "falta" });
      if (we.toLowerCase() === wu.toLowerCase()) partes.push({ t: we, tipo: "ok" });
      else {
        const r = explicarPalabra(we, wu);
        partes.push(...r.partes);
        for (const x of r.exp) exp.push(x.startsWith("Escuchá") ? `En «${we}»: escribiste «${wu}».` : `En «${we}»: ${x.charAt(0).toLowerCase()}${x.slice(1)}`);
      }
      if (post) partes.push({ t: post, tipo: p.u.endsWith(post) ? "ok" : "falta" });
      continue;
    } else if (p.e) {
      espacio();
      partes.push({ t: p.e, tipo: "falta" });
      exp.push(`Te faltó la palabra «${p.e.replace(PUNT, "")}».`);
    } else if (p.u) {
      exp.push(`Sobra la palabra «${p.u.replace(PUNT, "")}».`);
    }
  }
  // Si las únicas diferencias son de mayúsculas o signos, igual se muestran.
  const vistas = [...new Set(exp)];
  return { partes, explicaciones: vistas.slice(0, 4) };
}

export function diferencias(kind: "numero" | "palabra" | "oracion", escrita: string, esperada: string): Diferencias {
  if (kind === "oracion") return diferenciasOracion(escrita, esperada);
  if (kind === "numero") {
    const u = escrita.trim();
    return {
      partes: [{ t: esperada, tipo: "mal" }],
      explicaciones: u ? [`Escribiste ${u}; el número dictado era ${esperada}.`] : ["No escribiste nada. ¡Probá la próxima!"],
    };
  }
  return diferenciasPalabra(escrita, esperada);
}

// Para las pruebas: el texto de las partes tiene que ser exactamente lo correcto.
export function textoDePartes(p: Parte[]): string {
  return p.map((x) => x.t).join("");
}
