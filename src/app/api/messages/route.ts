import { NextRequest } from "next/server";
import { checkAdminPassword } from "@/lib/auth";
import { classmatesOf, findStudentByCode, getClassSnapshot, getProgress, getStudents, sameClassroom, saveProgress } from "@/lib/data";
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
  const [, all, snapshot, presence] = await Promise.all([
    touchPresence(me.code),
    getMessages(),
    getClassSnapshot(),
    getPresenceMap(mates.map((s) => s.code)),
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
        background: p?.avatarBackground,
        online: isOnline(presence[s.code]),
        birthdayToday: isBirthdayToday(s.birthday),
      };
    });
  classmates.sort((a, b) => Number(b.online) - Number(a.online) || a.name.localeCompare(b.name));
  const inbox = all
    .filter((m) => m.to === me.code)
    .slice(0, 30)
    .map((m) => ({ ...m, fromName: classmates.find((c) => c.code === m.from)?.name ?? "Un compañero" }));
  const now = new Date().toISOString();
  const sentToday = all.filter((m) => m.from === me.code && sameArgDay(m.at, now));
  return Response.json({
    enabled,
    classmates,
    inbox,
    unread: inbox.filter((m) => !m.read).length,
    coinsSentToday: sentToday.filter((m) => m.kind === "monedas").reduce((s, m) => s + (m.amount ?? 0), 0),
    messagesSentToday: sentToday.length,
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

  const { code, to, kind, presetId, amount, markRead } = body as {
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
