// Regalar objetos ganados a un compañero (pedido de Pedro, 5/10/2026).
//
// - Solo objetos GANADOS jugando (temporadas, premios del torneo,
//   legendarios, camino de premios, mascotas de logro). Los comprados con
//   monedas no, y los PRESTADOS tampoco (premios del torneo que todavía no
//   son suyos, accesorio Six-Seven).
// - Regalar es pasarlo: el objeto deja de ser de quien lo regala (y se le
//   saca del avatar) y queda «en camino» hasta que el compañero responde.
// - El compañero lo ACEPTA o lo RECHAZA. Si lo rechaza, o no responde en 7
//   días, vuelve a quien lo regaló. A quien regaló le llega el aviso.
// - Solo entre compañeros del mismo aula, con el buzón prendido; nunca en el
//   aula abierta de prueba. Límites: 3 regalos de objetos por día y 5 en
//   camino a la vez.
//
// Las reglas puras están en regalosObjetosShared.ts (las usa también el buzón).
import { getJSON, setJSON } from "@/lib/store";
import { findStudentByCode, getProgress, sameClassroom, saveProgress } from "@/lib/data";
import { getMessages, saveMessages, sameArgDay, type ClassMessage } from "@/lib/messages";
import { isOpenClassroomStudent } from "@/lib/openClassroomShared";
import type { StudentProgress } from "@/types";
import {
  DIAS_PARA_RESPONDER,
  MAX_EN_CAMINO,
  MAX_REGALOS_OBJETO_POR_DIA,
  objetosRegalables,
  type EstadoRegalo,
  type RegaloObjeto,
} from "@/lib/regalosObjetosShared";

export * from "@/lib/regalosObjetosShared";

const KEY = "regalosObjetos";
const MAX_GUARDADOS = 400;
const DIA = 86_400_000;

export async function getRegalos(): Promise<RegaloObjeto[]> {
  return getJSON<RegaloObjeto[]>(KEY, []);
}

async function guardarRegalos(lista: RegaloObjeto[]): Promise<void> {
  // Los que están en camino no se descartan nunca.
  const enCamino = lista.filter((r) => r.estado === "pendiente");
  const resto = lista.filter((r) => r.estado !== "pendiente").slice(0, Math.max(0, MAX_GUARDADOS - enCamino.length));
  const ids = new Set([...enCamino, ...resto].map((r) => r.id));
  await setJSON(KEY, lista.filter((r) => ids.has(r.id)));
}

const nuevoId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function sinObjeto(p: StudentProgress, itemId: string): StudentProgress {
  const acc = { ...(p.avatarAccessories ?? {}) };
  for (const k of Object.keys(acc) as (keyof typeof acc)[]) if (acc[k] === itemId) delete acc[k];
  const regalados = p.objetosRegalados ?? [];
  return {
    ...p,
    seasonalCollection: (p.seasonalCollection ?? []).filter((id) => id !== itemId),
    avatarAccessories: acc,
    objetosRegalados: regalados.includes(itemId) ? regalados : [...regalados, itemId],
  };
}

function conObjeto(p: StudentProgress, itemId: string): StudentProgress {
  const c = p.seasonalCollection ?? [];
  return c.includes(itemId) ? p : { ...p, seasonalCollection: [...c, itemId] };
}

// Vuelve a quien lo regaló (rechazado, vencido o devuelto): deja de figurar como regalado.
function devolverA(p: StudentProgress, itemId: string): StudentProgress {
  const q = conObjeto(p, itemId);
  return { ...q, objetosRegalados: (p.objetosRegalados ?? []).filter((id) => id !== itemId) };
}

function aviso(from: string, to: string, kind: ClassMessage["kind"], r: RegaloObjeto, presetId?: EstadoRegalo, now = new Date()): ClassMessage {
  return {
    id: nuevoId(),
    at: now.toISOString(),
    from,
    to,
    kind,
    giftId: r.id,
    itemId: r.itemId,
    ...(presetId ? { presetId } : {}),
  };
}

export type ResultadoRegalo = { ok: true; regalo: RegaloObjeto } | { ok: false; error: string; status?: number };

// Regalar: el objeto sale de la colección de quien regala y queda en camino.
export async function regalarObjeto(fromCode: string, toCode: string, itemId: string, now: Date = new Date()): Promise<ResultadoRegalo> {
  const me = await findStudentByCode(fromCode);
  const target = await findStudentByCode(toCode);
  if (!me) return { ok: false, error: "Código no encontrado.", status: 404 };
  if (isOpenClassroomStudent(me)) return { ok: false, error: "Los regalos no están disponibles en el aula de prueba.", status: 403 };
  if (!target || target.code === me.code || !sameClassroom(target, me)) return { ok: false, error: "Elegí a un compañero." };

  const regalos = await vencerRegalos(now);
  const hoy = now.toISOString();
  const mios = regalos.filter((r) => r.from === me.code);
  if (mios.filter((r) => sameArgDay(r.at, hoy)).length >= MAX_REGALOS_OBJETO_POR_DIA) {
    return { ok: false, error: `Podés regalar hasta ${MAX_REGALOS_OBJETO_POR_DIA} objetos por día. ¡Mañana podés seguir!`, status: 429 };
  }
  if (mios.filter((r) => r.estado === "pendiente").length >= MAX_EN_CAMINO) {
    return { ok: false, error: `Ya tenés ${MAX_EN_CAMINO} regalos esperando respuesta. Esperá a que los acepten.`, status: 429 };
  }

  const mine = await getProgress(me.code);
  if (!objetosRegalables(mine).includes(itemId)) {
    return { ok: false, error: "Ese objeto no se puede regalar (solo los ganados que ya son tuyos, no los prestados ni los comprados)." };
  }
  const theirs = await getProgress(target.code);
  if ((theirs.seasonalCollection ?? []).includes(itemId) || regalos.some((r) => r.estado === "pendiente" && r.to === target.code && r.itemId === itemId)) {
    return { ok: false, error: "Tu compañero ya tiene ese objeto. ¡Elegí otro!" };
  }

  const regalo: RegaloObjeto = { id: nuevoId(), at: now.toISOString(), from: me.code, to: target.code, itemId, estado: "pendiente" };
  await saveProgress(sinObjeto(mine, itemId));
  await guardarRegalos([regalo, ...regalos]);
  const msgs = await getMessages();
  await saveMessages([aviso(me.code, target.code, "objeto", regalo, undefined, now), ...msgs]);
  return { ok: true, regalo };
}

// Aceptar o rechazar (solo quien lo recibe, mientras está en camino).
export async function responderRegalo(code: string, giftId: string, acepta: boolean, now: Date = new Date()): Promise<ResultadoRegalo> {
  const regalos = await vencerRegalos(now);
  const r = regalos.find((x) => x.id === giftId);
  if (!r || r.to !== code) return { ok: false, error: "No encontramos ese regalo.", status: 404 };
  if (r.estado !== "pendiente") return { ok: false, error: "Ese regalo ya fue respondido." };

  let estado: EstadoRegalo = acepta ? "aceptado" : "rechazado";
  if (acepta) {
    const theirs = await getProgress(r.to);
    if ((theirs.seasonalCollection ?? []).includes(r.itemId)) {
      estado = "devuelto"; // mientras tanto lo ganó: vuelve a quien lo regaló
    } else {
      await saveProgress(conObjeto(theirs, r.itemId));
    }
  }
  if (estado !== "aceptado") {
    const giver = await findStudentByCode(r.from);
    if (giver) await saveProgress(devolverA(await getProgress(r.from), r.itemId));
  }
  const hecho: RegaloObjeto = { ...r, estado, respondidoAt: now.toISOString() };
  await guardarRegalos(regalos.map((x) => (x.id === r.id ? hecho : x)));
  const msgs = await getMessages();
  // Se marca respondido el aviso del que lo recibió y se le avisa a quien lo regaló.
  await saveMessages([
    aviso(r.to, r.from, "objeto-respuesta", hecho, estado, now),
    ...msgs.map((m) => (m.giftId === r.id && m.kind === "objeto" ? { ...m, read: true } : m)),
  ]);
  return { ok: true, regalo: hecho };
}

// Los que pasaron 7 días sin respuesta vuelven a quien los regaló.
export async function vencerRegalos(now: Date = new Date()): Promise<RegaloObjeto[]> {
  const regalos = await getRegalos();
  const vencidos = regalos.filter((r) => r.estado === "pendiente" && now.getTime() - Date.parse(r.at) >= DIAS_PARA_RESPONDER * DIA);
  if (!vencidos.length) return regalos;
  const avisos: ClassMessage[] = [];
  for (const r of vencidos) {
    if (await findStudentByCode(r.from)) await saveProgress(devolverA(await getProgress(r.from), r.itemId));
    avisos.push(aviso(r.to, r.from, "objeto-respuesta", { ...r, estado: "vencido" }, "vencido", now));
  }
  const ids = new Set(vencidos.map((r) => r.id));
  const lista = regalos.map((r) => (ids.has(r.id) ? { ...r, estado: "vencido" as const, respondidoAt: now.toISOString() } : r));
  await guardarRegalos(lista);
  await saveMessages([...avisos, ...(await getMessages())]);
  return lista;
}
