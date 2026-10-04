"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CloudsBackground from "@/components/CloudsBackground";
import AvatarDisplay from "@/components/AvatarDisplay";
import { CHALLENGE_MESSAGES } from "@/lib/messagesShared";
import { MatchResult, formatTime } from "@/lib/competition/shared";
import { AvatarAccessories } from "@/types";

interface Player {
  code: string;
  name: string;
  avatar?: string;
  accessories?: AvatarAccessories;
  tweaks?: import("@/types").AvatarTweaks;
  background?: string;
  online: boolean;
  eligible: boolean;
}

interface DuelView {
  id: string;
  mode: "turnos" | "vivo";
  status: "pendiente" | "aceptado" | "terminado" | "rechazado" | "vencido";
  createdAt: string;
  iChallenged: boolean;
  opponent: string;
  opponentName: string;
  presetId: string;
  myResult: MatchResult | null;
  theirResult: MatchResult | null;
  theyFinished: boolean;
  winner?: string;
}

interface HubData {
  config: { enabled: boolean; anyDay: boolean };
  canPlayToday: boolean;
  isWeekend: boolean;
  maxPending: number;
  eligibility: { eligible: boolean; pending: { id: number; name: string; emoji: string }[] };
  coinsEarned: number;
  classmates: Player[];
  duels: DuelView[];
  tournament: {
    week: string;
    rounds: number;
    played: boolean;
    ranking: (Partial<Player> & { position: number; me: boolean; errors: number; timeMs: number; name: string })[];
  };
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function CompetitionPage() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [data, setData] = useState<HubData | null>(null);
  const [tab, setTab] = useState<"duelos" | "torneo">("duelos");
  const [picking, setPicking] = useState(false);
  const [to, setTo] = useState<Player | null>(null);
  const [mode, setMode] = useState<"turnos" | "vivo">("turnos");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (c: string) => {
    const d = await fetch(`/api/competition?code=${encodeURIComponent(c)}`).then((r) => r.json());
    setData(d);
    if (d.coinsEarned > 0) setStatus(`🪙 ¡Ganaste ${d.coinsEarned} monedas por tus duelos!`);
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("mundomat_code");
    if (!stored) {
      router.replace("/student");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(stored);
    void load(stored);
  }, [router, load]);

  async function post(body: Record<string, unknown>) {
    if (!code) return null;
    setBusy(true);
    setStatus(null);
    try {
      const r = await fetch("/api/competition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, ...body }),
      });
      const d = await r.json();
      if (!r.ok) {
        setStatus(`⚠️ ${d.error}`);
        return null;
      }
      return d;
    } finally {
      setBusy(false);
    }
  }

  async function challenge(presetId: string) {
    if (!to) return;
    const d = await post({ action: "challenge", to: to.code, mode, presetId });
    if (!d) return;
    if (mode === "vivo") {
      router.push(`/student/competencia/jugar?duelo=${d.duelId}`);
      return;
    }
    setStatus(`✅ ¡Desafío enviado a ${to.name}! Cuando acepte, cada uno juega su partida.`);
    setPicking(false);
    setTo(null);
    if (code) await load(code);
  }

  async function respond(duel: DuelView, accept: boolean) {
    const d = await post({ action: "respond", duelId: duel.id, accept });
    if (!d || !code) return;
    if (accept && duel.mode === "vivo") {
      router.push(`/student/competencia/jugar?duelo=${duel.id}`);
      return;
    }
    setStatus(accept ? "✅ ¡Aceptaste el desafío! Ya podés jugar tu partida." : "Listo, el desafío quedó rechazado.");
    await load(code);
  }

  if (!data) {
    return (
      <main className="flex-1 flex items-center justify-center bg-explorer-day">
        <p className="text-slate-600">Cargando la competencia...</p>
      </main>
    );
  }

  const header = (
    <div className="wood-panel-light relative z-10 flex items-center justify-between gap-3 max-w-3xl w-full mx-auto px-4 py-2.5 mb-5 rounded-2xl">
      <button onClick={() => router.push("/student/play")} className="text-amber-100 font-bold text-sm shrink-0">
        ← Volver
      </button>
      <span className="text-white font-black text-lg">⚔️ Competencia</span>
      <span className="w-12" />
    </div>
  );

  if (!data.config.enabled) {
    return (
      <main className="relative flex-1 flex flex-col bg-explorer-day py-8 px-4 overflow-hidden">
        <CloudsBackground />
        {header}
        <div className="relative z-10 parchment-panel rounded-3xl max-w-md mx-auto p-6 text-center">
          <p className="text-5xl mb-2">🔒</p>
          <p className="font-black text-lg">La competencia está cerrada por ahora.</p>
        </div>
      </main>
    );
  }

  const { eligibility } = data;
  const missing = Math.max(0, eligibility.pending.length - data.maxPending);
  const canPlay = data.canPlayToday && eligibility.eligible;

  return (
    <main className="relative flex-1 flex flex-col bg-explorer-day py-6 px-4 overflow-hidden">
      <CloudsBackground />
      {header}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col gap-4">
        {!eligibility.eligible ? (
          <div className="parchment-panel rounded-3xl p-5 text-center">
            <p className="text-4xl">🧭</p>
            <p className="font-black text-lg">¡Ponete al día para competir!</p>
            <p className="text-sm mt-1">
              Para jugar duelos y el torneo podés tener como mucho {data.maxPending} mundos sin completar. Te{" "}
              {missing === 1 ? "falta completar 1 mundo" : `faltan completar ${missing} mundos`}:
            </p>
            <ul className="mt-2 flex flex-wrap justify-center gap-1.5">
              {eligibility.pending.map((w) => (
                <li key={w.id} className="rounded-full bg-white/80 border border-amber-300 px-2.5 py-1 text-xs font-bold">
                  {w.emoji} {w.name}
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.push("/student/play")}
              className="mt-3 rounded-2xl bg-violet-600 text-white font-black px-5 py-2"
            >
              Ir a los mundos →
            </button>
          </div>
        ) : !data.canPlayToday ? (
          <div className="rounded-2xl bg-sky-100 border-2 border-sky-300 px-4 py-3 text-sm text-sky-900 text-center">
            🗓️ Los duelos y el torneo se juegan <b>sábado y domingo</b>. ¡Ya podés mandar desafíos para el finde!
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-100 border-2 border-emerald-300 px-4 py-3 text-sm text-emerald-900 text-center">
            ✅ ¡Estás al día! Podés jugar duelos y el torneo. Todos ganan monedas: ganar 🪙3 · empatar 🪙2 · participar 🪙1.
          </div>
        )}

        {status && <p className="text-center font-bold text-slate-800 bg-white/80 rounded-xl py-2 px-3">{status}</p>}

        <div className="grid grid-cols-2 gap-2">
          {(["duelos", "torneo"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-2xl py-2.5 font-black ${tab === t ? "bg-violet-600 text-white" : "bg-white/80 text-violet-800"}`}
            >
              {t === "duelos" ? "⚔️ Duelos" : "🏆 Torneo de la semana"}
            </button>
          ))}
        </div>

        {tab === "torneo" && (
          <div className="parchment-panel rounded-3xl p-5 flex flex-col gap-3">
            <p className="text-sm">
              Todos juegan la <b>misma partida</b> ({data.tournament.rounds} juegos de memoria). Gana quien tenga menos
              errores; si empatan, el más rápido. Se juega una sola vez por semana.
            </p>
            {data.tournament.played ? (
              <p className="text-center font-black text-emerald-700">✅ Ya jugaste el torneo de esta semana.</p>
            ) : (
              <button
                disabled={!canPlay}
                onClick={() => router.push("/student/competencia/jugar?torneo=1")}
                className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-black text-lg py-3 disabled:opacity-40"
              >
                🎯 Jugar el torneo
              </button>
            )}
            {data.tournament.ranking.length === 0 ? (
              <p className="text-center text-sm opacity-70">Todavía nadie jugó esta semana. ¡Podés ser el primero!</p>
            ) : (
              <ol className="flex flex-col gap-1.5">
                {data.tournament.ranking.map((r) => (
                  <li
                    key={`${r.position}-${r.name}`}
                    className={`flex items-center gap-2 rounded-xl px-2 py-1.5 ${r.me ? "bg-yellow-200/80 border-2 border-yellow-400" : "bg-white/60"}`}
                  >
                    <span className="w-8 text-center font-black">{MEDALS[r.position - 1] ?? `${r.position}.`}</span>
                    <AvatarDisplay
                      character={r.avatar}
                      accessories={r.accessories}
                  tweaks={r.tweaks}
                      background={r.background}
                      className="w-9 h-9 rounded-lg"
                      imageSizes="36px"
                    />
                    <span className="flex-1 font-bold text-sm truncate">{r.name}</span>
                    <span className="text-xs font-bold">❌ {r.errors}</span>
                    <span className="text-xs w-16 text-right">⏱️ {formatTime(r.timeMs)}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {tab === "duelos" && (
          <div className="flex flex-col gap-3">
            {!picking ? (
              <button
                disabled={!eligibility.eligible}
                onClick={() => {
                  setPicking(true);
                  setTo(null);
                  setStatus(null);
                }}
                className="rounded-2xl bg-gradient-to-r from-rose-500 to-orange-400 text-white font-black text-lg py-3 shadow disabled:opacity-40"
              >
                ⚔️ Desafiar a un compañero
              </button>
            ) : (
              <div className="parchment-panel rounded-3xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="font-black">{to ? `Desafío para ${to.name}` : "¿A quién desafiás?"}</p>
                  <button onClick={() => (to ? setTo(null) : setPicking(false))} className="text-sm underline">
                    {to ? "Cambiar" : "Cancelar"}
                  </button>
                </div>
                {!to ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[50vh] overflow-y-auto">
                    {data.classmates.map((c) => (
                      <button
                        key={c.code}
                        disabled={!c.eligible}
                        onClick={() => {
                          setTo(c);
                          setMode(c.online && data.canPlayToday ? "vivo" : "turnos");
                        }}
                        className="flex flex-col items-center gap-1 rounded-xl bg-white/70 p-2 disabled:opacity-45"
                        title={c.eligible ? c.name : "Todavía tiene mundos por completar"}
                      >
                        <span className="relative">
                          <AvatarDisplay
                            character={c.avatar}
                            accessories={c.accessories}
                  tweaks={c.tweaks}
                            background={c.background}
                            className="w-14 h-14 rounded-xl"
                            imageSizes="56px"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${c.online ? "bg-emerald-400" : "bg-slate-400"}`}
                          />
                        </span>
                        <span className="text-[11px] font-bold leading-tight text-center line-clamp-2">{c.name}</span>
                        {!c.eligible && <span className="text-[10px] leading-tight">🧭 poniéndose al día</span>}
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setMode("turnos")}
                        className={`rounded-xl py-2 text-sm font-bold ${mode === "turnos" ? "bg-violet-600 text-white" : "bg-white/70"}`}
                      >
                        🕐 Por turnos
                        <span className="block text-[11px] font-normal">cada uno juega cuando entra</span>
                      </button>
                      <button
                        disabled={!to.online || !data.canPlayToday}
                        onClick={() => setMode("vivo")}
                        className={`rounded-xl py-2 text-sm font-bold disabled:opacity-40 ${mode === "vivo" ? "bg-violet-600 text-white" : "bg-white/70"}`}
                      >
                        ⚡ En vivo
                        <span className="block text-[11px] font-normal">
                          {!data.canPlayToday ? "solo el fin de semana" : to.online ? "los dos ahora mismo" : "no está conectado"}
                        </span>
                      </button>
                    </div>
                    <p className="text-xs font-bold">Elegí el mensaje del desafío:</p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {CHALLENGE_MESSAGES.map((m) => (
                        <button
                          key={m.id}
                          disabled={busy}
                          onClick={() => void challenge(m.id)}
                          className="text-left rounded-xl bg-white/80 hover:bg-white px-3 py-2 text-sm font-semibold"
                        >
                          {m.emoji} {m.text}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {data.duels.length === 0 && (
              <p className="text-center text-sm text-slate-700 bg-white/80 rounded-xl py-3">
                Todavía no tenés duelos. ¡Desafiá a un compañero!
              </p>
            )}
            <ul className="flex flex-col gap-2">
              {data.duels.map((d) => (
                <DuelRow
                  key={d.id}
                  duel={d}
                  me={code!}
                  canPlay={canPlay}
                  busy={busy}
                  onRespond={respond}
                  onPlay={() => router.push(`/student/competencia/jugar?duelo=${d.id}`)}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

function DuelRow({
  duel: d,
  me,
  canPlay,
  busy,
  onRespond,
  onPlay,
}: {
  duel: DuelView;
  me: string;
  canPlay: boolean;
  busy: boolean;
  onRespond: (d: DuelView, accept: boolean) => void;
  onPlay: () => void;
}) {
  const msg = CHALLENGE_MESSAGES.find((m) => m.id === d.presetId);
  let body: React.ReactNode;
  if (d.status === "pendiente") {
    body = d.iChallenged ? (
      <span className="text-xs">Esperando que {d.opponentName} acepte…</span>
    ) : (
      <span className="flex gap-2">
        <button
          disabled={busy}
          onClick={() => onRespond(d, true)}
          className="rounded-xl bg-emerald-500 text-white font-black text-sm px-3 py-1.5"
        >
          ¡Acepto!
        </button>
        <button disabled={busy} onClick={() => onRespond(d, false)} className="rounded-xl bg-white/70 text-sm px-3 py-1.5">
          Ahora no
        </button>
      </span>
    );
  } else if (d.status === "aceptado") {
    body = d.myResult ? (
      <span className="text-xs">
        Ya jugaste (❌ {d.myResult.errors} · ⏱️ {formatTime(d.myResult.timeMs)}). Esperando a {d.opponentName}…
      </span>
    ) : (
      <button
        disabled={!canPlay}
        onClick={onPlay}
        className="rounded-xl bg-violet-600 text-white font-black text-sm px-3 py-1.5 disabled:opacity-40"
      >
        {d.mode === "vivo" ? "⚡ Entrar a la sala" : "▶️ Jugar mi partida"}
      </button>
    );
  } else if (d.status === "terminado") {
    const won = d.winner === me;
    const tie = d.winner === "empate";
    body = (
      <span className="text-xs">
        <b className={won ? "text-emerald-700" : tie ? "text-sky-700" : "text-violet-700"}>
          {won ? "🏆 ¡Ganaste!" : tie ? "🤝 ¡Empate!" : `Ganó ${d.opponentName}. ¡Buen intento!`}
        </b>{" "}
        Vos: ❌ {d.myResult?.errors} · ⏱️ {formatTime(d.myResult?.timeMs ?? 0)} — {d.opponentName}: ❌{" "}
        {d.theirResult?.errors} · ⏱️ {formatTime(d.theirResult?.timeMs ?? 0)}
      </span>
    );
  } else {
    body = <span className="text-xs opacity-70">{d.status === "rechazado" ? "No aceptado" : "Venció"}</span>;
  }
  return (
    <li className="rounded-2xl bg-white/90 border-2 border-violet-200 px-3 py-2 flex flex-col gap-1.5 text-slate-800">
      <span className="text-sm">
        {d.mode === "vivo" ? "⚡" : "🕐"}{" "}
        <b>{d.iChallenged ? `Desafiaste a ${d.opponentName}` : `${d.opponentName} te desafió`}</b>
        {msg && <span className="opacity-70"> · “{msg.text}”</span>}
      </span>
      {body}
    </li>
  );
}
