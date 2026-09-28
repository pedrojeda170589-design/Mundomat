import { NextRequest } from "next/server";
import { checkAdminPassword } from "@/lib/auth";
import { findStudentByCode, getProgress, getStudents, getWorldsConfig, saveProgress } from "@/lib/data";
import { addNews, displayName } from "@/lib/news";
import { getMessages, isOnline, saveMessages } from "@/lib/messages";
import { CHALLENGE_MESSAGES, ClassMessage, sameArgDay } from "@/lib/messagesShared";
import { getJSON } from "@/lib/store";
import { Student, StudentProgress } from "@/types";
import {
  DUEL_COINS,
  Duel,
  DuelMode,
  LIVE_INVITE_SECONDS,
  MATCH_ROUNDS,
  MAX_DUELS_CREATED_PER_DAY,
  MAX_PENDING_WORLDS,
  TOURNAMENT_COINS,
  compareResults,
  createDuel,
  getCompetitionConfig,
  getDuel,
  getDuelIndex,
  getDuelsFor,
  getEligibility,
  getTournamentEntries,
  getTournamentEntry,
  isDuelPaid,
  isWeekendNow,
  markDuelPaid,
  rankTournament,
  saveDuel,
  setCompetitionConfig,
  setDuelLive,
  setDuelReady,
  setDuelResult,
  setTournamentEntry,
  tournamentWeekKey,
} from "@/lib/competition/server";

// Competencia con los juegos de memoria: duelos (por turnos o en vivo) y
// torneo de la semana. Ver src/lib/competition/shared.ts.

function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

async function playersInfo(students: Student[]) {
  const [presence, worlds] = await Promise.all([
    getJSON<Record<string, string>>("presence", {}),
    getWorldsConfig(),
  ]);
  const progresses = await Promise.all(students.map((s) => getProgress(s.code)));
  const map = new Map<
    string,
    { code: string; name: string; avatar?: string; accessories?: StudentProgress["avatarAccessories"]; background?: string; online: boolean; eligible: boolean }
  >();
  students.forEach((s, i) => {
    const p = progresses[i];
    const pending = worlds.enabledWorldIds.filter((id) => !p.completedWorlds.includes(id)).length;
    map.set(s.code, {
      code: s.code,
      name: displayName(s, p),
      avatar: p.avatar,
      accessories: p.avatarAccessories,
      background: p.avatarBackground,
      online: isOnline(presence[s.code]),
      eligible: pending <= MAX_PENDING_WORLDS,
    });
  });
  return map;
}

// Premio de un duelo terminado, para UN jugador (cada uno cobra el suyo).
async function payIfNeeded(duel: Duel, code: string): Promise<number> {
  if (duel.status !== "terminado" || (await isDuelPaid(duel.id, code))) return 0;
  const other = code === duel.from ? duel.to : duel.from;
  const cmp = compareResults(duel.results[code], duel.results[other]);
  const coins = cmp < 0 ? DUEL_COINS.win : cmp === 0 ? DUEL_COINS.tie : DUEL_COINS.lose;
  await markDuelPaid(duel.id, code);
  const p = await getProgress(code);
  await saveProgress({ ...p, coins: p.coins + coins });
  return coins;
}

function winnerOf(duel: Duel): string | "empate" | undefined {
  if (duel.status !== "terminado") return undefined;
  const cmp = compareResults(duel.results[duel.from], duel.results[duel.to]);
  return cmp === 0 ? "empate" : cmp < 0 ? duel.from : duel.to;
}

function duelView(duel: Duel, me: string, names: Map<string, { name: string }>) {
  const other = duel.from === me ? duel.to : duel.from;
  return {
    id: duel.id,
    mode: duel.mode,
    status: duel.status,
    createdAt: duel.createdAt,
    iChallenged: duel.from === me,
    opponent: other,
    opponentName: names.get(other)?.name ?? "Un compañero",
    presetId: duel.presetId,
    myResult: duel.results[me] ?? null,
    theirResult: duel.status === "terminado" ? duel.results[other] ?? null : null,
    theyFinished: !!duel.results[other],
    winner: winnerOf(duel),
    startAt: duel.startAt ?? null,
    ready: { me: !!duel.ready?.[me], them: !!duel.ready?.[other] },
    live: duel.live?.[other] ?? null,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const adminPassword = searchParams.get("adminPassword");
  if (adminPassword) {
    if (!checkAdminPassword(adminPassword)) return Response.json({ error: "No autorizado." }, { status: 401 });
    return Response.json({ config: await getCompetitionConfig() });
  }

  const code = searchParams.get("code");
  if (!code) return Response.json({ error: "Falta el código." }, { status: 400 });
  const me = await findStudentByCode(code);
  if (!me) return Response.json({ error: "Código no encontrado." }, { status: 404 });
  const config = await getCompetitionConfig();
  const canPlayToday = config.enabled && (config.anyDay || isWeekendNow());

  // Consulta liviana (desde el mapa, cada pocos segundos): ¿alguien me
  // invitó a un duelo en vivo recién?
  if (searchParams.get("invites")) {
    if (!canPlayToday) return Response.json({ invites: [] });
    const index = await getDuelIndex();
    const recent = index.filter(
      (d) => d.to === me.code && Date.now() - new Date(d.createdAt).getTime() < LIVE_INVITE_SECONDS * 1000
    );
    const duels = (await Promise.all(recent.map((d) => getDuel(d.id)))).filter(
      (d): d is Duel => !!d && d.mode === "vivo" && d.status === "pendiente"
    );
    const students = await getStudents();
    const invites = await Promise.all(
      duels.map(async (d) => {
        const s = students.find((x) => x.code === d.from);
        const p = s ? await getProgress(s.code) : undefined;
        return {
          id: d.id,
          fromName: s ? displayName(s, p) : "Un compañero",
          avatar: p?.avatar,
          accessories: p?.avatarAccessories,
          background: p?.avatarBackground,
          presetId: d.presetId,
        };
      })
    );
    return Response.json({ invites });
  }

  const students = await getStudents();

  // Detalle de un duelo (sala del duelo; en vivo se consulta cada 2 s, así
  // que solo se leen los datos de los dos jugadores).
  const duelId = searchParams.get("duel");
  if (duelId) {
    const duel = await getDuel(duelId);
    if (!duel || (duel.from !== me.code && duel.to !== me.code)) {
      return Response.json({ error: "Duelo no encontrado." }, { status: 404 });
    }
    const coinsEarned = await payIfNeeded(duel, me.code);
    const other = duel.from === me.code ? duel.to : duel.from;
    const otherStudent = students.find((s) => s.code === other);
    const otherProgress = await getProgress(other);
    const names = new Map([[other, { name: otherStudent ? displayName(otherStudent, otherProgress) : "Un compañero" }]]);
    return Response.json({
      duel: duelView(duel, me.code, names),
      opponentInfo: {
        name: names.get(other)!.name,
        avatar: otherProgress.avatar,
        accessories: otherProgress.avatarAccessories,
        background: otherProgress.avatarBackground,
      },
      coinsEarned,
      serverNow: new Date().toISOString(),
      canPlayToday,
    });
  }

  const players = await playersInfo(students);
  const eligibility = await getEligibility(me.code);
  const duels = await getDuelsFor(me.code);
  let coinsEarned = 0;
  for (const d of duels) coinsEarned += await payIfNeeded(d, me.code);

  const week = tournamentWeekKey();
  const entries = rankTournament(await getTournamentEntries(week, students.map((s) => s.code)));
  return Response.json({
    config: { enabled: config.enabled, anyDay: config.anyDay },
    canPlayToday,
    isWeekend: isWeekendNow(),
    maxPending: MAX_PENDING_WORLDS,
    eligibility,
    coinsEarned,
    classmates: [...players.values()]
      .filter((p) => p.code !== me.code)
      .sort((a, b) => Number(b.online) - Number(a.online) || a.name.localeCompare(b.name)),
    duels: duels.map((d) => duelView(d, me.code, players)),
    tournament: {
      week,
      rounds: MATCH_ROUNDS,
      played: entries.some((e) => e.code === me.code),
      ranking: entries.map((e, i) => ({
        position: i + 1,
        me: e.code === me.code,
        errors: e.errors,
        timeMs: e.timeMs,
        ...(players.get(e.code) ?? { name: "Un compañero" }),
      })),
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (body.adminPassword !== undefined) {
    if (!checkAdminPassword(body.adminPassword)) return Response.json({ error: "No autorizado." }, { status: 401 });
    const current = await getCompetitionConfig();
    const next = {
      enabled: typeof body.enabled === "boolean" ? body.enabled : current.enabled,
      anyDay: typeof body.anyDay === "boolean" ? body.anyDay : current.anyDay,
    };
    await setCompetitionConfig(next);
    return Response.json({ ok: true, config: next });
  }

  const { code, action } = body as { code?: string; action?: string };
  if (!code) return Response.json({ error: "Falta el código." }, { status: 400 });
  const me = await findStudentByCode(code);
  if (!me) return Response.json({ error: "Código no encontrado." }, { status: 404 });
  const config = await getCompetitionConfig();
  if (!config.enabled) return Response.json({ error: "La competencia está apagada por el docente." }, { status: 403 });
  const canPlayToday = config.anyDay || isWeekendNow();
  const notEligible = () =>
    Response.json(
      { error: `Para competir tenés que estar al día: completá tus mundos (podés tener hasta ${MAX_PENDING_WORLDS} sin terminar).` },
      { status: 403 }
    );

  // ---- Desafiar a un compañero ----
  if (action === "challenge") {
    const { to, mode, presetId } = body as { to?: string; mode?: DuelMode; presetId?: string };
    if (!(await getEligibility(me.code)).eligible) return notEligible();
    const target = to ? await findStudentByCode(to) : undefined;
    if (!target || target.code === me.code) return Response.json({ error: "Elegí a un compañero." }, { status: 400 });
    if (!(await getEligibility(target.code)).eligible) {
      return Response.json(
        { error: "Tu compañero todavía tiene mundos por completar. ¡Cuando se ponga al día lo podés desafiar!" },
        { status: 400 }
      );
    }
    if (!CHALLENGE_MESSAGES.some((m) => m.id === presetId)) {
      return Response.json({ error: "Elegí un mensaje de desafío." }, { status: 400 });
    }
    const liveMode: DuelMode = mode === "vivo" ? "vivo" : "turnos";
    if (liveMode === "vivo") {
      if (!canPlayToday) return Response.json({ error: "Los duelos en vivo se juegan el fin de semana." }, { status: 400 });
      const presence = await getJSON<Record<string, string>>("presence", {});
      if (!isOnline(presence[target.code])) {
        return Response.json({ error: "Tu compañero no está conectado ahora. Probá un duelo por turnos." }, { status: 400 });
      }
    }
    const now = new Date().toISOString();
    const index = await getDuelIndex();
    const today = index.filter((d) => d.from === me.code && sameArgDay(d.createdAt, now));
    if (today.length >= MAX_DUELS_CREATED_PER_DAY) {
      return Response.json({ error: "Por hoy ya mandaste muchos desafíos. ¡Mañana podés seguir!" }, { status: 429 });
    }
    // Un solo duelo abierto con el mismo compañero a la vez.
    const open = await getDuelsFor(me.code);
    if (open.some((d) => (d.from === target.code || d.to === target.code) && (d.status === "pendiente" || d.status === "aceptado"))) {
      return Response.json({ error: "Ya tenés un duelo abierto con ese compañero." }, { status: 400 });
    }
    const duel: Duel = {
      id: newId(),
      createdAt: now,
      from: me.code,
      to: target.code,
      mode: liveMode,
      presetId: presetId!,
      status: "pendiente",
      results: {},
    };
    await createDuel(duel);
    // El desafío también llega al buzón del compañero.
    const msgs = await getMessages();
    const msg: ClassMessage = {
      id: newId(),
      at: now,
      from: me.code,
      to: target.code,
      kind: "desafio",
      presetId,
      duelId: duel.id,
    };
    await saveMessages([msg, ...msgs]);
    return Response.json({ ok: true, duelId: duel.id });
  }

  const { duelId } = body as { duelId?: string };

  // ---- Aceptar / rechazar ----
  if (action === "respond") {
    const duel = duelId ? await getDuel(duelId) : null;
    if (!duel || duel.to !== me.code) return Response.json({ error: "Duelo no encontrado." }, { status: 404 });
    if (duel.status !== "pendiente") return Response.json({ error: "Ese desafío ya no está disponible." }, { status: 400 });
    if (body.accept) {
      if (!(await getEligibility(me.code)).eligible) return notEligible();
      await saveDuel({ ...duel, results: {}, ready: undefined, live: undefined, startAt: undefined, status: "aceptado" });
    } else {
      await saveDuel({ ...duel, results: {}, ready: undefined, live: undefined, startAt: undefined, status: "rechazado" });
    }
    return Response.json({ ok: true });
  }

  // ---- En vivo: entrar a la sala / avance ----
  if (action === "ready" || action === "live") {
    const duel = duelId ? await getDuel(duelId) : null;
    if (!duel || (duel.from !== me.code && duel.to !== me.code)) {
      return Response.json({ error: "Duelo no encontrado." }, { status: 404 });
    }
    if (action === "ready") await setDuelReady(duel.id, me.code);
    else {
      const { round, done, total } = body as { round?: number; done?: number; total?: number };
      await setDuelLive(duel.id, me.code, { round: round ?? 0, done: done ?? 0, total: total ?? 1 });
    }
    return Response.json({ ok: true });
  }

  const errors = Math.max(0, Math.round(Number(body.errors) || 0));
  const timeMs = Math.round(Number(body.timeMs) || 0);
  if (action === "finish" || action === "tournament") {
    if (!canPlayToday) return Response.json({ error: "La competencia se juega el fin de semana." }, { status: 400 });
    if (timeMs < 5000 || timeMs > 60 * 60 * 1000) return Response.json({ error: "Tiempo inválido." }, { status: 400 });
    if (!(await getEligibility(me.code)).eligible) return notEligible();
  }

  // ---- Terminar un duelo ----
  if (action === "finish") {
    const duel = duelId ? await getDuel(duelId) : null;
    if (!duel || (duel.from !== me.code && duel.to !== me.code)) {
      return Response.json({ error: "Duelo no encontrado." }, { status: 404 });
    }
    if (duel.status !== "aceptado") return Response.json({ error: "Este duelo no está en juego." }, { status: 400 });
    if (duel.results[me.code]) return Response.json({ error: "Ya jugaste este duelo." }, { status: 400 });
    await setDuelResult(duel.id, me.code, { errors, timeMs, at: new Date().toISOString() });
    const after = (await getDuel(duel.id))!;
    let coinsEarned = 0;
    if (after.status === "terminado") {
      coinsEarned = await payIfNeeded(after, me.code);
      // Pizarrón: lo publica quien termina segundo.
      const students = await getStudents();
      const name = async (c: string) => {
        const s = students.find((x) => x.code === c)!;
        return displayName(s, await getProgress(c));
      };
      const w = winnerOf(after);
      const [a, b] = [await name(after.from), await name(after.to)];
      if (w === "empate") {
        await addNews([{ code: after.from, who: a, kind: "duelo", emoji: "🤝", text: `y ${b} empataron un duelo de memoria` }]);
      } else if (w) {
        const loser = w === after.from ? b : a;
        await addNews([
          { code: w, who: w === after.from ? a : b, kind: "duelo", emoji: "⚔️", text: `ganó un duelo de memoria contra ${loser}` },
        ]);
      }
    }
    const view = await getDuel(duel.id);
    const other = duel.from === me.code ? duel.to : duel.from;
    const otherStudent = (await getStudents()).find((s) => s.code === other);
    const names = new Map([
      [other, { name: otherStudent ? displayName(otherStudent, await getProgress(other)) : "Un compañero" }],
    ]);
    return Response.json({ ok: true, coinsEarned, duel: duelView(view!, me.code, names) });
  }

  // ---- Torneo de la semana ----
  if (action === "tournament") {
    const week = tournamentWeekKey();
    if (await getTournamentEntry(week, me.code)) {
      return Response.json({ error: "Ya jugaste el torneo de esta semana." }, { status: 400 });
    }
    await setTournamentEntry(week, { code: me.code, errors, timeMs, at: new Date().toISOString() });
    const p = await getProgress(me.code);
    await saveProgress({ ...p, coins: p.coins + TOURNAMENT_COINS });
    const students = await getStudents();
    const ranking = rankTournament(await getTournamentEntries(week, students.map((s) => s.code)));
    const position = ranking.findIndex((e) => e.code === me.code) + 1;
    const who = displayName(me, p);
    await addNews([
      position === 1 && ranking.length > 1
        ? { code: me.code, who, kind: "torneo", emoji: "🏆", text: "pasó al primer puesto del torneo de la semana" }
        : { code: me.code, who, kind: "torneo", emoji: "🎯", text: "jugó el torneo de memoria de la semana" },
    ]);
    return Response.json({ ok: true, position, total: ranking.length, coinsEarned: TOURNAMENT_COINS });
  }

  return Response.json({ error: "Acción inválida." }, { status: 400 });
}
