import { NextRequest } from "next/server";
import { checkAdminPassword } from "@/lib/auth";
import { classmatesOf, findStudentByCode, getClassSnapshot, getProgress, getStudents, sameClassroom, saveProgress } from "@/lib/data";
import { capasDe } from "@/lib/avatarCapas";
import { displayName } from "@/lib/news";
import { isBirthdayToday } from "@/lib/seasons";
import { isOpenClassroomStudent, isTrialExpired } from "@/lib/openClassroomShared";
import {
  COIN_AMOUNTS,
  ClassMessage,
  MAX_COINS_SENT_PER_DAY,
  MAX_MESSAGES_PER_DAY,
  MessageKind,
  PRESET_GIFTS,
  ALL_TEXT_MESSAGES,
  BIRTHDAY_MESSAGES,
  getMessages,
  isMessagingEnabled,
  isOnline,
  sameArgDay,
  saveMessages,
  setMessagingEnabled,
  touchPresence,
  getPresenceMap,
} from "@/lib/messages";

import { checkCodeRateLimit, codigoDe, getClientIp, recordFailedLookup } from "@/lib/rateLimit";
import { resolveDisplayNames } from "@/lib/studentNames";
import { objetosRegalables, regalarObjeto, responderRegalo, vencerRegalos } from "@/lib/regalosObjetos";

// GET ?code=  → buzón del alumno + compañeros (con quién está conectado).
//               También marca al alumno como conectado.
// GET ?adminPassword= → historial completo y estado (para el docente).
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = await checkCodeRateLimit(ip, await codigoDe(request));
  if (rateLimit.blocked) {
    return Response.json(
      { error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const adminPassword = searchParams.get("adminPassword");
  const enabled = await isMessagingEnabled();
  const students = await getStudents();
  const nameOf = (code: string) => students.find((s) => s.code === code)?.name ?? code;

  if (adminPassword) {
    if (!checkAdminPassword(adminPassword)) {
      return Response.json({ error: "No autorizado." }, { status: 401 });
    }
    // El panel de siempre es el del aula piloto: solo ve sus mensajes.
    const pilot = new Set(students.filter((s) => !s.classroomId).map((s) => s.code));
    const all = (await getMessages()).filter((m) => pilot.has(m.from) && pilot.has(m.to));
    return Response.json({
      enabled,
      messages: all.slice(0, 100).map((m) => ({ ...m, fromName: nameOf(m.from), toName: nameOf(m.to) })),
    });
  }

  const code = searchParams.get("code");
  if (!code) return Response.json({ error: "Falta el código." }, { status: 400 });
  const me = await findStudentByCode(code);
  if (!me) {
    await recordFailedLookup();
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  if (isOpenClassroomStudent(me)) {
    return Response.json({ enabled: false, classmates: [], inbox: [], unread: 0, coinsSentToday: 0, messagesSentToday: 0 });
  }

  // Consulta liviana (cada minuto, para el numerito de no leídos): no arma
  // la lista de compañeros.
  if (searchParams.get("light")) {
    const [, all] = await Promise.all([touchPresence(me.code), getMessages()]);
    return Response.json({ enabled, unread: all.filter((m) => m.to === me.code && !m.read).length });
  }

  const mates = classmatesOf(me, students);
  const resolvedNames = resolveDisplayNames(mates);
  // Primero, los regalos de objetos sin respuesta en 7 días vuelven a su dueño.
  const regalos = await vencerRegalos();
  const [, all, snapshot, presence, mine] = await Promise.all([
    touchPresence(me.code),
    getMessages(),
    getClassSnapshot(),
    getPresenceMap(mates.map((s) => s.code)),
    getProgress(me.code),
  ]);
  presence[me.code] = new Date().toISOString();
  const classmates = mates
    .filter((s) => s.code !== me.code)
    .map((s) => {
      const p = snapshot.progress.get(s.code);
      return {
        code: s.code,
        name: displayName(s, p, resolvedNames.get(s.code)),
        avatar: p?.avatar,
        accessories: p?.avatarAccessories,
        tweaks: p?.avatarTweaks,
        capas: p ? capasDe(p) : undefined,
        background: p?.avatarBackground,
        online: isOnline(presence[s.code]),
        birthdayToday: isBirthdayToday(s.birthday),
        // Para no ofrecer un objeto que ya tiene (o que ya le están regalando).
        tiene: [
          ...(p?.seasonalCollection ?? []),
          ...regalos.filter((r) => r.estado === "pendiente" && r.to === s.code).map((r) => r.itemId),
        ],
      };
    });
  classmates.sort((a, b) => Number(b.online) - Number(a.online) || a.name.localeCompare(b.name));
  const inbox = all
    .filter((m) => m.to === me.code)
    .slice(0, 30)
    .map((m) => ({
      ...m,
      fromName: classmates.find((c) => c.code === m.from)?.name ?? "Un compañero",
      ...(m.giftId ? { giftEstado: regalos.find((r) => r.id === m.giftId)?.estado } : {}),
    }));
  const now = new Date().toISOString();
  const sentToday = all.filter((m) => m.from === me.code && sameArgDay(m.at, now));
  return Response.json({
    enabled,
    classmates,
    inbox,
    unread: inbox.filter((m) => !m.read).length,
    coinsSentToday: sentToday.filter((m) => m.kind === "monedas").reduce((s, m) => s + (m.amount ?? 0), 0),
    messagesSentToday: sentToday.length,
    // Objetos ganados que puede regalar y los que tiene en camino.
    regalables: objetosRegalables(mine),
    enCamino: regalos
      .filter((r) => r.estado === "pendiente" && r.from === me.code)
      .map((r) => ({ id: r.id, itemId: r.itemId, toName: classmates.find((c) => c.code === r.to)?.name ?? "Un compañero" })),
    objetosHoy: regalos.filter((r) => r.from === me.code && sameArgDay(r.at, now)).length,
  });
}

// POST { code, to, kind, presetId?, amount? } → enviar.
// POST { code, markRead: true } → marcar el buzón como leído.
// POST { adminPassword, enabled } → el docente prende/apaga el buzón.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = await checkCodeRateLimit(ip, await codigoDe(request));
  if (rateLimit.blocked) {
    return Response.json(
      { error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true },
      { status: 429 }
    );
  }

  const body = await request.json();
  if (body.adminPassword !== undefined) {
    if (!checkAdminPassword(body.adminPassword)) {
      return Response.json({ error: "No autorizado." }, { status: 401 });
    }
    await setMessagingEnabled(!!body.enabled);
    return Response.json({ ok: true, enabled: !!body.enabled });
  }

  const { code, to, kind, presetId, amount, markRead, itemId, giftId, respuesta } = body as {
    itemId?: string;
    giftId?: string;
    respuesta?: "aceptar" | "rechazar";
    code?: string;
    to?: string;
    kind?: MessageKind;
    presetId?: string;
    amount?: number;
    markRead?: boolean;
  };
  if (!code) return Response.json({ error: "Falta el código." }, { status: 400 });
  const me = await findStudentByCode(code);
  if (!me) {
    await recordFailedLookup();
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }
  if (isTrialExpired(me)) return Response.json({ error: "Tu período de prueba terminó.", trialExpired: true }, { status: 403 });
  if (isOpenClassroomStudent(me)) return Response.json({ error: "El buzón no está disponible en el aula de prueba." }, { status: 403 });
  const all = await getMessages();

  if (markRead) {
    await saveMessages(all.map((m) => (m.to === me.code ? { ...m, read: true } : m)));
    return Response.json({ ok: true });
  }

  if (!(await isMessagingEnabled())) {
    return Response.json({ error: "El buzón está apagado por el docente." }, { status: 403 });
  }

  // Responder un regalo de objeto (aceptar o rechazar).
  if (giftId) {
    if (respuesta !== "aceptar" && respuesta !== "rechazar") return Response.json({ error: "Respuesta inválida." }, { status: 400 });
    const r = await responderRegalo(me.code, giftId, respuesta === "aceptar");
    if (!r.ok) return Response.json({ error: r.error }, { status: r.status ?? 400 });
    return Response.json({ ok: true, estado: r.regalo.estado });
  }
  // Regalar uno de sus objetos ganados.
  if (kind === "objeto") {
    if (!to || !itemId) return Response.json({ error: "Elegí a un compañero y un objeto." }, { status: 400 });
    const r = await regalarObjeto(me.code, to, itemId);
    if (!r.ok) return Response.json({ error: r.error }, { status: r.status ?? 400 });
    return Response.json({ ok: true, regalo: r.regalo });
  }
  const target = to ? await findStudentByCode(to) : undefined;
  if (!target || target.code === me.code || !sameClassroom(target, me)) {
    return Response.json({ error: "Elegí a un compañero." }, { status: 400 });
  }
  const now = new Date().toISOString();
  const sentToday = all.filter((m) => m.from === me.code && sameArgDay(m.at, now));
  if (sentToday.length >= MAX_MESSAGES_PER_DAY) {
    return Response.json({ error: "Por hoy ya mandaste muchos mensajes. ¡Mañana podés seguir!" }, { status: 429 });
  }

  const msg: ClassMessage = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    at: now,
    from: me.code,
    to: target.code,
    kind: kind ?? "mensaje",
  };

  if (msg.kind === "mensaje") {
    if (!ALL_TEXT_MESSAGES.some((p) => p.id === presetId)) {
      return Response.json({ error: "Mensaje inválido." }, { status: 400 });
    }
    if (BIRTHDAY_MESSAGES.some((p) => p.id === presetId) && !isBirthdayToday(target.birthday)) {
      return Response.json({ error: "Los saludos de cumpleaños son para el día del cumple." }, { status: 400 });
    }
    msg.presetId = presetId;
  } else if (msg.kind === "regalo") {
    if (!PRESET_GIFTS.some((p) => p.id === presetId)) {
      return Response.json({ error: "Regalo inválido." }, { status: 400 });
    }
    msg.presetId = presetId;
  } else if (msg.kind === "monedas") {
    if (!amount || !COIN_AMOUNTS.includes(amount)) {
      return Response.json({ error: "Cantidad inválida." }, { status: 400 });
    }
    const coinsToday = sentToday.filter((m) => m.kind === "monedas").reduce((s, m) => s + (m.amount ?? 0), 0);
    if (coinsToday + amount > MAX_COINS_SENT_PER_DAY) {
      return Response.json({ error: `Podés regalar hasta ${MAX_COINS_SENT_PER_DAY} monedas por día.` }, { status: 429 });
    }
    const mine = await getProgress(me.code);
    if (mine.coins < amount) {
      return Response.json({ error: "No tenés suficientes monedas." }, { status: 400 });
    }
    const theirs = await getProgress(target.code);
    await saveProgress({ ...mine, coins: mine.coins - amount });
    await saveProgress({ ...theirs, coins: theirs.coins + amount });
    msg.amount = amount;
  } else {
    return Response.json({ error: "Tipo inválido." }, { status: 400 });
  }

  await saveMessages([msg, ...all]);
  const mine = await getProgress(me.code);
  return Response.json({ ok: true, coins: mine.coins });
}
