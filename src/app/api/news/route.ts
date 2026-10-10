import { NextRequest } from "next/server";
import { checkAdminPassword } from "@/lib/auth";
import {
  MAX_TEACHER_NOTE_LENGTH,
  addTeacherNote,
  clearNews,
  deleteTeacherNote,
  displayName,
  encouragement,
  getNews,
  getTeacherNotes,
} from "@/lib/news";
import { classmatesOf, getClassSnapshot, getProgress } from "@/lib/data";
import { isBirthdayToday } from "@/lib/seasons";
import { getMessages, isMessagingEnabled } from "@/lib/messages";
import { BIRTHDAY_MESSAGES, sameArgDay } from "@/lib/messagesShared";
import { capasDe } from "@/lib/avatarCapas";

const BIRTHDAY_GIFTS = new Set(["torta", "regalito", "globo"]);

import { checkCodeRateLimit, codigoDe, getClientIp, recordFailedLookup } from "@/lib/rateLimit";
import { resolveDisplayNames } from "@/lib/studentNames";

// GET: novedades de la clase (últimas primero). Con ?code= también devuelve
// un mensaje para animar a ese alumno y los cumpleaños de hoy (fijos arriba
// del pizarrón, para que los compañeros puedan saludar).
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const rateLimit = await checkCodeRateLimit(ip, await codigoDe(request));
    if (rateLimit.blocked) {
      return Response.json(
        { error: "Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.", blocked: true },
        { status: 429 }
      );
    }
  }

  const snapshot = code ? await getClassSnapshot() : null;
  const me = code ? snapshot!.students.find((s) => s.code.toUpperCase() === code.toUpperCase()) : undefined;

  if (code && !me) {
    await recordFailedLookup();
    return Response.json({ error: "Código no encontrado." }, { status: 404 });
  }

  const [items, notes] = await Promise.all([getNews(me?.classroomId), getTeacherNotes(me?.classroomId)]);
  let message: string | undefined;
  let birthdays: {
    code: string;
    name: string;
    age: number | null;
    avatar?: string;
    accessories?: unknown;
    background?: string;
    me: boolean;
    greeted: boolean;
    greetings: number;
  }[] = [];
  let messagingEnabled = false;
  if (code) {
    const student = me;
    const students = student ? classmatesOf(student, snapshot!.students) : [];
    if (student) {
      const resolvedNames = resolveDisplayNames(students);
      const progress = snapshot!.progress.get(student.code) ?? (await getProgress(student.code));
      message = encouragement(progress, displayName(student, progress, resolvedNames.get(student.code)));
      const today = students.filter((s) => isBirthdayToday(s.birthday));
      if (today.length > 0) {
        const [msgs, enabled] = await Promise.all([getMessages(), isMessagingEnabled()]);
        messagingEnabled = enabled;
        const now = new Date().toISOString();
        const isGreeting = (m: (typeof msgs)[number]) =>
          sameArgDay(m.at, now) &&
          ((m.kind === "mensaje" && BIRTHDAY_MESSAGES.some((b) => b.id === m.presetId)) ||
            (m.kind === "regalo" && BIRTHDAY_GIFTS.has(m.presetId ?? "")));
        birthdays = await Promise.all(
          today.map(async (s) => {
            const p = snapshot!.progress.get(s.code);
            const received = msgs.filter((m) => m.to === s.code && isGreeting(m));
            return {
              code: s.code,
              name: displayName(s, p, resolvedNames.get(s.code)),
              age: null, // Por privacidad de menores, no se expone la edad ni el año de nacimiento
              avatar: p?.avatar,
              accessories: p?.avatarAccessories,
              tweaks: p?.avatarTweaks,
              capas: p ? capasDe(p) : undefined,
              background: p?.avatarBackground,
              me: s.code === student.code,
              greeted: received.some((m) => m.from === student.code),
              greetings: new Set(received.map((m) => m.from)).size,
            };
          })
        );
      }
    }
  }
  return Response.json({ items: items.slice(0, 20), notes, message, birthdays, messagingEnabled });
}

const NOTE_EMOJIS = ["📣", "⭐", "🎉", "📚", "🧠", "🌟", "👏", "📅", "🏆", "💡", "❤️", "🌈"];

// POST: el docente escribe un mensaje en el pizarrón (aula piloto).
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { adminPassword?: string; text?: string; emoji?: string };
  if (!body.adminPassword || !checkAdminPassword(body.adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  // Texto limpio: sin caracteres de control ni saltos de más.
  const text = (body.text ?? "")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!text) return Response.json({ error: "Escribí un mensaje." }, { status: 400 });
  if (text.length > MAX_TEACHER_NOTE_LENGTH) {
    return Response.json({ error: `El mensaje puede tener hasta ${MAX_TEACHER_NOTE_LENGTH} letras.` }, { status: 400 });
  }
  const emoji = NOTE_EMOJIS.includes(body.emoji ?? "") ? body.emoji! : "📣";
  const note = await addTeacherNote(text, emoji);
  return Response.json({ ok: true, note });
}

// DELETE ?noteId= → borra un mensaje del docente.
// DELETE (sin noteId) → borra las novedades automáticas del pizarrón.
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const adminPassword = searchParams.get("adminPassword");
  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  const noteId = searchParams.get("noteId");
  if (noteId) {
    await deleteTeacherNote(noteId);
    return Response.json({ ok: true });
  }
  await clearNews();
  return Response.json({ ok: true });
}
