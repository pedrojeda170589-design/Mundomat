// Privacidad del aula abierta («Jugar gratis»).
//
// 1) A los 30 días de la inscripción el nombre (o apodo) se reemplaza por un
//    número y se borra de TODAS las claves guardadas y de las copias locales
//    (carpeta backups/). No se guarda ninguna tabla que una el número con el
//    nombre. Los resultados (informe final) quedan asociados al número.
// 2) «Eliminar cuenta y datos»: borra de verdad la cuenta, los resultados y
//    los registros asociados.
//
// Las dos cosas recorren TODAS las claves del almacenamiento (no solo las que
// conocemos), así un dato nuevo que se agregue en el futuro tampoco queda
// guardado con el nombre. `rastrosDe` permite comprobarlo (lo usan la prueba
// automática y el panel).
import fs from "node:fs";
import path from "node:path";
import { delKey, getJSON, getRaw, listKeys, setJSON } from "@/lib/store";
import type { Student } from "@/types";
import { OPEN_CLASSROOM_ID } from "@/lib/openClassroomShared";
import { DIAS_PRUEBA } from "@/lib/legal/condiciones";

const STUDENTS_KEY = "students";
const DIA = 24 * 60 * 60 * 1000;
const CARPETA_COPIAS = path.join(process.cwd(), "backups");

// Campos que pueden tener el nombre de una persona en un registro asociado a su código.
const CAMPOS_NOMBRE = ["name", "who", "displayName", "nombre"];
const CAMPOS_BORRAR = ["nickname"];
// Campos que asocian un registro a un alumno.
const CAMPOS_CODIGO = ["code", "studentCode", "from", "to", "codigo"];

export function momentoDeAnonimizar(s: Student): number {
  if (s.anonimizarAt) return new Date(s.anonimizarAt).getTime();
  const desde = new Date(s.trialStartedAt ?? s.createdAt).getTime();
  return desde + DIAS_PRUEBA * DIA;
}

export function debeAnonimizarse(s: Student, now: Date = new Date()): boolean {
  return s.classroomId === OPEN_CLASSROOM_ID && !s.anonimizadoAt && now.getTime() >= momentoDeAnonimizar(s);
}

function esDe(o: Record<string, unknown>, codigos: Set<string>): string | null {
  for (const c of CAMPOS_CODIGO) {
    const v = o[c];
    if (typeof v === "string" && codigos.has(v)) return v;
  }
  return null;
}

function reemplazarTexto(texto: string, nombres: string[], por: string): string {
  let t = texto;
  for (const n of nombres) {
    if (!n || n.length < 2) continue;
    const esc = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    t = t.replace(new RegExp(`(^|[^\\p{L}])${esc}(?=$|[^\\p{L}])`, "giu"), `$1${por}`);
  }
  return t;
}

// Reemplaza el nombre en todo registro asociado a esos códigos. Devuelve el
// valor nuevo y si cambió algo.
function anonimizarValor(
  v: unknown,
  datos: Map<string, { nombres: string[]; numero: string }>
): { valor: unknown; cambio: boolean } {
  if (Array.isArray(v)) {
    let cambio = false;
    const out = v.map((x) => {
      const r = anonimizarValor(x, datos);
      cambio ||= r.cambio;
      return r.valor;
    });
    return { valor: out, cambio };
  }
  if (v && typeof v === "object") {
    const o = { ...(v as Record<string, unknown>) };
    let cambio = false;
    const codigo = esDe(o, new Set(datos.keys()));
    if (codigo) {
      const { nombres, numero } = datos.get(codigo)!;
      for (const k of CAMPOS_NOMBRE) {
        if (typeof o[k] === "string" && o[k] !== numero) {
          o[k] = numero;
          cambio = true;
        }
      }
      for (const k of CAMPOS_BORRAR) {
        if (k in o) {
          delete o[k];
          cambio = true;
        }
      }
      // Textos libres del mismo registro (comentarios): sin el nombre.
      for (const [k, x] of Object.entries(o)) {
        if (typeof x === "string" && !CAMPOS_CODIGO.includes(k)) {
          const t = reemplazarTexto(x, nombres, numero);
          if (t !== x) {
            o[k] = t;
            cambio = true;
          }
        }
      }
    }
    for (const [k, x] of Object.entries(o)) {
      if (x && typeof x === "object") {
        const r = anonimizarValor(x, datos);
        if (r.cambio) {
          o[k] = r.valor;
          cambio = true;
        }
      }
    }
    return { valor: o, cambio };
  }
  return { valor: v, cambio: false };
}

// Saca de listas y objetos todo registro asociado a esos códigos.
function quitarValor(v: unknown, codigos: Set<string>): { valor: unknown; cambio: boolean; todo: boolean } {
  if (Array.isArray(v)) {
    let cambio = false;
    const out: unknown[] = [];
    for (const x of v) {
      if (typeof x === "string" && codigos.has(x)) {
        cambio = true; // listas de códigos (p. ej. «conocidos» del límite de intentos)
        continue;
      }
      if (x && typeof x === "object" && !Array.isArray(x) && esDe(x as Record<string, unknown>, codigos)) {
        cambio = true;
        continue;
      }
      const r = quitarValor(x, codigos);
      cambio ||= r.cambio;
      if (!r.todo) out.push(r.valor);
    }
    return { valor: out, cambio, todo: false };
  }
  if (v && typeof v === "object") {
    if (esDe(v as Record<string, unknown>, codigos)) return { valor: null, cambio: true, todo: true };
    const o = { ...(v as Record<string, unknown>) };
    let cambio = false;
    for (const [k, x] of Object.entries(o)) {
      if (codigos.has(k)) {
        delete o[k]; // objetos indexados por código
        cambio = true;
        continue;
      }
      if (x && typeof x === "object") {
        const r = quitarValor(x, codigos);
        if (r.todo) delete o[k];
        else if (r.cambio) o[k] = r.valor;
        cambio ||= r.cambio;
      }
    }
    return { valor: o, cambio, todo: false };
  }
  return { valor: v, cambio: false, todo: false };
}

const claveEsDe = (clave: string, codigos: Set<string>) => clave.split(":").some((p) => codigos.has(p));

// Copias locales (backups/*.json): se reescriben sin los datos.
function archivosDeCopias(): string[] {
  try {
    return fs
      .readdirSync(CARPETA_COPIAS)
      .filter((f) => f.endsWith(".json"))
      .map((f) => path.join(CARPETA_COPIAS, f));
  } catch {
    return [];
  }
}

function procesarCopias(fn: (v: unknown) => { valor: unknown; cambio: boolean }) {
  for (const archivo of archivosDeCopias()) {
    try {
      const datos = JSON.parse(fs.readFileSync(archivo, "utf-8"));
      // Las copias guardan el valor de cada clave como texto JSON o como objeto.
      const r = fn(
        typeof datos === "object" && datos
          ? Object.fromEntries(
              Object.entries(datos).map(([k, x]) => {
                if (typeof x !== "string") return [k, x];
                try {
                  return [k, { __json: JSON.parse(x) }];
                } catch {
                  return [k, x];
                }
              })
            )
          : datos
      );
      if (r.cambio) {
        const salida = Object.fromEntries(
          Object.entries(r.valor as Record<string, unknown>).map(([k, x]) =>
            x && typeof x === "object" && "__json" in (x as object) ? [k, JSON.stringify((x as { __json: unknown }).__json)] : [k, x]
          )
        );
        fs.writeFileSync(archivo, JSON.stringify(salida, null, 2), "utf-8");
      }
    } catch {
      // archivo que no es una copia de la base: se deja
    }
  }
}

async function numeroNuevo(usados: Set<string>): Promise<string> {
  for (;;) {
    const n = `Participante ${100000 + Math.floor(Math.random() * 900000)}`;
    if (!usados.has(n)) return n;
  }
}

// Reemplaza el nombre por un número en los alumnos del aula abierta que ya
// cumplieron 30 días. Devuelve cuántos se anonimizaron.
export async function anonimizarVencidos(now: Date = new Date()): Promise<number> {
  const students = await getJSON<Student[]>(STUDENTS_KEY, []);
  const vencidos = students.filter((s) => debeAnonimizarse(s, now));
  if (!vencidos.length) return 0;

  // Antes, el cierre de la prueba (informe final con los resultados).
  const { closeTrialIfExpired } = await import("@/lib/openClassroom");
  for (const s of vencidos) await closeTrialIfExpired(s);

  const usados = new Set(students.map((s) => s.name));
  const datos = new Map<string, { nombres: string[]; numero: string }>();
  for (const s of vencidos) {
    const progreso = await getJSON<{ nickname?: string } | null>(`progress:${s.code}`, null);
    const numero = await numeroNuevo(usados);
    usados.add(numero);
    datos.set(s.code, { nombres: [s.name, s.displayName ?? "", progreso?.nickname ?? ""].filter(Boolean), numero });
  }

  // Todas las claves (alumnos, informes, novedades, valoraciones, rankings…).
  for (const clave of await listKeys()) {
    const raw = await getRaw(clave);
    if (raw === null) continue;
    let valor: unknown;
    try {
      valor = JSON.parse(raw);
    } catch {
      continue;
    }
    const r = anonimizarValor(valor, datos);
    if (r.cambio) await setJSON(clave, r.valor);
  }
  procesarCopias((v) => anonimizarValor(v, datos));

  // Marca de cuándo se hizo (en la lista de alumnos ya anonimizada).
  const lista = await getJSON<Student[]>(STUDENTS_KEY, []);
  const hecho = now.toISOString();
  await setJSON(
    STUDENTS_KEY,
    lista.map((s) => (datos.has(s.code) ? { ...s, anonimizadoAt: hecho, displayName: undefined } : s))
  );
  return vencidos.length;
}

// «Eliminar cuenta y datos»: borra la cuenta y todo lo asociado a ese código.
export async function eliminarCuentaPrueba(code: string): Promise<boolean> {
  const students = await getJSON<Student[]>(STUDENTS_KEY, []);
  const alumno = students.find((s) => s.code === code);
  if (!alumno || alumno.classroomId !== OPEN_CLASSROOM_ID) return false;
  const codigos = new Set([code]);
  for (const clave of await listKeys()) {
    if (claveEsDe(clave, codigos)) {
      await delKey(clave);
      continue;
    }
    const raw = await getRaw(clave);
    if (raw === null) continue;
    let valor: unknown;
    try {
      valor = JSON.parse(raw);
    } catch {
      continue;
    }
    const r = quitarValor(valor, codigos);
    if (r.todo) await delKey(clave);
    else if (r.cambio) await setJSON(clave, r.valor);
  }
  procesarCopias((v) => {
    const r = quitarValor(v, codigos);
    // En las copias, las claves del alumno también se sacan.
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const o = { ...(r.valor as Record<string, unknown>) };
      let cambio = r.cambio;
      for (const k of Object.keys(o)) {
        if (claveEsDe(k, codigos)) {
          delete o[k];
          cambio = true;
        }
      }
      return { valor: o, cambio };
    }
    return r;
  });
  return true;
}

// Comprobación: en qué claves (o copias) aparece todavía alguno de esos textos.
export async function rastrosDe(textos: string[]): Promise<string[]> {
  const buscados = textos.filter((t) => t && t.length >= 2).map((t) => t.toLowerCase());
  const encontrados: string[] = [];
  for (const clave of await listKeys()) {
    const raw = ((await getRaw(clave)) ?? "").toLowerCase();
    if (buscados.some((t) => raw.includes(t) || clave.toLowerCase().includes(t))) encontrados.push(clave);
  }
  for (const archivo of archivosDeCopias()) {
    const raw = fs.readFileSync(archivo, "utf-8").toLowerCase();
    if (buscados.some((t) => raw.includes(t))) encontrados.push(`copia:${path.basename(archivo)}`);
  }
  return encontrados;
}
