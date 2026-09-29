import { NextRequest } from "next/server";
import { checkAdminPassword } from "@/lib/auth";
import { clearNews, displayName, encouragement, getNews } from "@/lib/news";
import { classmatesOf, getClassSnapshot, getProgress } from "@/lib/data";
import { birthdayAge, isBirthdayToday } from "@/lib/seasons";
import { getMessages, isMessagingEnabled } from "@/lib/messages";
import { BIRTHDAY_MESSAGES, sameArgDay } from "@/lib/messagesShared";

const BIRTHDAY_GIFTS = new Set(["torta", "regalito", "globo"]);

// GET: novedades de la clase (últimas primero). Con ?code= también devuelve
// un mensaje para animar a ese alumno y los cumpleaños de hoy (fijos arriba
// del pizarrón, para que los compañeros puedan saludar).
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const snapshot = code ? await getClassSnapshot() : null;
  const me = code ? snapshot!.students.find((s) => s.code.toUpperCase() === code.toUpperCase()) : undefined;
  const items = await getNews(me?.classroomId);
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
      const progress = snapshot!.progress.get(student.code) ?? (await getProgress(student.code));
      message = encouragement(progress, displayName(student, progress));
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
              name: displayName(s, p),
              age: birthdayAge(s.birthday),
              avatar: p?.avatar,
              accessories: p?.avatarAccessories,
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
  return Response.json({ items: items.slice(0, 20), message, birthdays, messagingEnabled });
}

// DELETE: el docente borra el pizarrón.
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const adminPassword = searchParams.get("adminPassword");
  if (!adminPassword || !checkAdminPassword(adminPassword)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  await clearNews();
  return Response.json({ ok: true });
}
