"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CloudsBackground from "@/components/CloudsBackground";
import AvatarDisplay from "@/components/AvatarDisplay";
import MatchPlayer from "@/components/competition/MatchPlayer";
import Burst from "@/components/weekend/Burst";
import { MATCH_ROUNDS, MatchResult, formatTime, tournamentWeekKey } from "@/lib/competition/shared";
import { AvatarAccessories } from "@/types";

interface DuelView {
  id: string;
  mode: "turnos" | "vivo";
  status: "pendiente" | "aceptado" | "terminado" | "rechazado" | "vencido";
  iChallenged: boolean;
  opponentName: string;
  myResult: MatchResult | null;
  theirResult: MatchResult | null;
  theyFinished: boolean;
  winner?: string;
  startAt: string | null;
  ready: { me: boolean; them: boolean };
  live: { round: number; done: number; total: number; at: string } | null;
}

interface Opponent {
  name: string;
  avatar?: string;
  accessories?: AvatarAccessories;
  tweaks?: import("@/types").AvatarTweaks;
  capas?: import("@/types").AvatarCapa[];
  background?: string;
}

type Screen =
  | { kind: "loading" }
  | { kind: "error"; text: string }
  | { kind: "waiting" } // en vivo: esperando que el otro acepte / entre
  | { kind: "countdown" }
  | { kind: "play" }
  | { kind: "saving" }
  | { kind: "done"; errors: number; timeMs: number; extra?: string };

const WAIT_BEFORE_SOLO_MS = 60_000;

export default function CompetitionPlayPage() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [target, setTarget] = useState<{ torneo: boolean; duelId?: string } | null>(null);
  const [duel, setDuel] = useState<DuelView | null>(null);
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [screen, setScreen] = useState<Screen>({ kind: "loading" });
  const [offset, setOffset] = useState(0); // reloj del servidor - reloj local
  const [now, setNow] = useState(() => Date.now());
  const [coins, setCoins] = useState(0);
  const [waitingSince, setWaitingSince] = useState(0);
  const screenRef = useRef(screen);
  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  // Lee ?torneo=1 o ?duelo=ID
  useEffect(() => {
    const stored = sessionStorage.getItem("mundomat_code");
    if (!stored) {
      router.replace("/student");
      return;
    }
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(stored);
    const duelId = params.get("duelo") ?? undefined;
    setTarget({ torneo: !duelId, duelId });
    if (!duelId) setScreen({ kind: "play" });
  }, [router]);

  const fetchDuel = useCallback(async () => {
    if (!code || !target?.duelId) return null;
    const r = await fetch(`/api/competition?code=${encodeURIComponent(code)}&duel=${encodeURIComponent(target.duelId)}`);
    const d = await r.json();
    if (!r.ok) {
      setScreen({ kind: "error", text: d.error ?? "No se encontró el duelo." });
      return null;
    }
    setDuel(d.duel);
    setOpponent(d.opponentInfo);
    setOffset(new Date(d.serverNow).getTime() - Date.now());
    if (d.coinsEarned) setCoins((c) => c + d.coinsEarned);
    return d.duel as DuelView;
  }, [code, target]);

  // Primer vistazo al duelo: decide la pantalla.
  useEffect(() => {
    if (!target?.duelId || !code) return;
    let cancelled = false;
    void (async () => {
      const d = await fetchDuel();
      if (!d || cancelled) return;
      if (d.myResult) {
        setScreen({ kind: "done", errors: d.myResult.errors, timeMs: d.myResult.timeMs });
      } else if (d.status === "rechazado" || d.status === "vencido") {
        setScreen({ kind: "error", text: d.status === "rechazado" ? "Este desafío no fue aceptado." : "Este desafío venció." });
      } else if (d.mode === "vivo") {
        if (d.status === "aceptado") {
          await fetch("/api/competition", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, action: "ready", duelId: d.id }),
          });
        }
        setWaitingSince(Date.now());
        setScreen({ kind: "waiting" });
      } else if (d.status === "aceptado") {
        setScreen({ kind: "play" });
      } else {
        setScreen({ kind: "error", text: "Tu compañero todavía no aceptó el desafío." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [target, code, fetchDuel]);

  // En vivo: consulta cada 2 s (sala de espera, partida y resultado).
  useEffect(() => {
    if (!target?.duelId || !duel || duel.mode !== "vivo") return;
    const t = setInterval(async () => {
      const s = screenRef.current.kind;
      if (s === "error" || (s === "done" && duel.theyFinished)) return;
      const d = await fetchDuel();
      if (!d || !code) return;
      // El que desafió entra a la sala cuando el otro acepta.
      if (s === "waiting" && d.status === "aceptado" && !d.ready.me) {
        await fetch("/api/competition", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, action: "ready", duelId: d.id }),
        });
      }
      if (s === "waiting" && d.startAt) setScreen({ kind: "countdown" });
      if (s === "waiting" && (d.status === "rechazado" || d.status === "vencido")) {
        setScreen({ kind: "error", text: `${d.opponentName} no puede jugar ahora. ¡Probá otro día!` });
      }
    }, 2000);
    return () => clearInterval(t);
  }, [target, duel, fetchDuel, code]);

  // Reloj para la cuenta regresiva.
  useEffect(() => {
    if (screen.kind !== "countdown" && screen.kind !== "waiting") return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [screen.kind]);

  const startAt = duel?.startAt ? new Date(duel.startAt).getTime() - offset : null;
  const secondsLeft = startAt ? Math.ceil((startAt - now) / 1000) : null;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (screen.kind === "countdown" && secondsLeft !== null && secondsLeft <= 0) setScreen({ kind: "play" });
  }, [screen.kind, secondsLeft]);

  async function sendProgress(p: { round: number; done: number; total: number }) {
    if (!code || !duel || duel.mode !== "vivo") return;
    void fetch("/api/competition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, action: "live", duelId: duel.id, ...p }),
    });
  }

  async function finish(r: { errors: number; timeMs: number }) {
    if (!code || !target) return;
    setScreen({ kind: "saving" });
    const res = await fetch("/api/competition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        target.torneo
          ? { code, action: "tournament", ...r }
          : { code, action: "finish", duelId: target.duelId, ...r }
      ),
    });
    const d = await res.json();
    if (!res.ok) {
      setScreen({ kind: "error", text: d.error ?? "No se pudo guardar." });
      return;
    }
    if (d.coinsEarned) setCoins((c) => c + d.coinsEarned);
    if (target.torneo) {
      setScreen({ kind: "done", ...r, extra: `Quedaste en el puesto ${d.position} de ${d.total}.` });
    } else {
      if (d.duel) setDuel(d.duel);
      setScreen({ kind: "done", ...r });
    }
  }

  // Resultado de un duelo por turnos: si el otro todavía no jugó, se
  // consulta de vez en cuando.
  useEffect(() => {
    if (screen.kind !== "done" || !duel || duel.mode === "vivo" || duel.theyFinished) return;
    const t = setInterval(() => void fetchDuel(), 15_000);
    return () => clearInterval(t);
  }, [screen.kind, duel, fetchDuel]);

  const header = (
    <div className="wood-panel-light relative z-10 flex items-center justify-between gap-3 max-w-3xl w-full mx-auto px-4 py-2.5 mb-4 rounded-2xl">
      <button onClick={() => router.push("/student/competencia")} className="text-amber-100 font-bold text-sm shrink-0">
        ← Salir
      </button>
      <span className="text-white font-black text-base sm:text-lg text-center">
        {target?.torneo ? "🏆 Torneo de la semana" : duel ? `⚔️ Duelo con ${duel.opponentName}` : "⚔️ Duelo"}
      </span>
      <span className="w-10" />
    </div>
  );

  const oppAvatar = opponent && (
    <AvatarDisplay
      character={opponent.avatar}
      accessories={opponent.accessories}
      tweaks={opponent.tweaks}
      capas={opponent.capas}
      background={opponent.background}
      className="w-16 h-16 rounded-2xl"
      imageSizes="64px"
    />
  );

  let content: React.ReactNode = null;
  if (screen.kind === "loading" || !target) {
    content = <p className="text-center text-slate-700">Cargando…</p>;
  } else if (screen.kind === "error") {
    content = (
      <div className="parchment-panel rounded-3xl max-w-md mx-auto p-6 text-center flex flex-col gap-3">
        <p className="text-4xl">🙂</p>
        <p className="font-bold">{screen.text}</p>
        <button onClick={() => router.push("/student/competencia")} className="rounded-2xl bg-violet-600 text-white font-black py-2">
          Volver a la competencia
        </button>
      </div>
    );
  } else if (screen.kind === "waiting") {
    const waited = waitingSince ? now - waitingSince : 0;
    content = (
      <div className="parchment-panel rounded-3xl max-w-md mx-auto p-6 text-center flex flex-col items-center gap-3">
        {oppAvatar}
        <p className="font-black text-lg">
          {duel?.status === "pendiente" ? `Esperando que ${duel.opponentName} acepte…` : `Esperando a ${duel?.opponentName}…`}
        </p>
        <p className="text-3xl animate-bounce">⚡</p>
        <p className="text-sm opacity-80">Cuando los dos estén en la sala empieza la cuenta regresiva.</p>
        {duel?.status === "aceptado" && waited > WAIT_BEFORE_SOLO_MS && (
          <button onClick={() => setScreen({ kind: "play" })} className="rounded-2xl bg-violet-600 text-white font-black px-5 py-2">
            Jugar sin esperar (se compara después)
          </button>
        )}
      </div>
    );
  } else if (screen.kind === "countdown") {
    content = (
      <div className="parchment-panel rounded-3xl max-w-md mx-auto p-6 text-center flex flex-col items-center gap-3">
        {oppAvatar}
        <p className="font-black">¡{duel?.opponentName} está listo!</p>
        <p className="text-7xl font-black text-violet-700">{Math.max(1, secondsLeft ?? 3)}</p>
      </div>
    );
  } else if (screen.kind === "play") {
    const seed = target.torneo ? `torneo-${tournamentWeekKey()}` : `duelo-${target.duelId}`;
    const live = duel?.mode === "vivo" ? duel.live : null;
    const side =
      duel?.mode === "vivo" ? (
        <div className="w-full max-w-md flex items-center gap-2 rounded-2xl bg-rose-50 border-2 border-rose-300 px-3 py-2">
          <span className="text-xs font-black text-rose-700 shrink-0">{duel.opponentName}</span>
          <span className="flex-1 h-3 rounded-full bg-rose-200 overflow-hidden">
            <span
              className="block h-full bg-rose-500 transition-all"
              style={{
                width: `${
                  duel.theyFinished
                    ? 100
                    : live
                      ? ((live.round + (live.total ? live.done / live.total : 0)) / MATCH_ROUNDS) * 100
                      : 0
                }%`,
              }}
            />
          </span>
          <span className="text-xs font-bold text-rose-700 shrink-0">
            {duel.theyFinished ? "¡Terminó!" : live ? `ronda ${Math.min(live.round + 1, MATCH_ROUNDS)}` : "…"}
          </span>
        </div>
      ) : null;
    content = <MatchPlayer seed={seed} onFinish={(r) => void finish(r)} onProgress={sendProgress} side={side} />;
  } else if (screen.kind === "saving") {
    content = <p className="text-center font-bold text-slate-700">Guardando tu partida…</p>;
  } else if (screen.kind === "done") {
    const finished = duel?.status === "terminado";
    const won = finished && duel?.winner === code;
    const tie = finished && duel?.winner === "empate";
    content = (
      <div className="relative parchment-panel rounded-3xl max-w-md mx-auto p-6 text-center flex flex-col items-center gap-3">
        <p className="text-5xl">{target.torneo ? "🎯" : !finished ? "⏳" : won ? "🏆" : tie ? "🤝" : "⭐"}</p>
        <p className="font-black text-xl">
          {target.torneo
            ? "¡Terminaste el torneo!"
            : !finished
              ? `¡Listo! Ahora falta que juegue ${duel?.opponentName}.`
              : won
                ? "¡Ganaste el duelo!"
                : tie
                  ? "¡Empataron!"
                  : `Ganó ${duel?.opponentName}. ¡Muy buen intento!`}
        </p>
        <p className="text-sm">
          Tu partida: ❌ {screen.errors} {screen.errors === 1 ? "error" : "errores"} · ⏱️ {formatTime(screen.timeMs)}
        </p>
        {finished && duel?.theirResult && (
          <p className="text-sm">
            {duel.opponentName}: ❌ {duel.theirResult.errors} · ⏱️ {formatTime(duel.theirResult.timeMs)}
          </p>
        )}
        {screen.extra && <p className="font-bold text-violet-700">{screen.extra}</p>}
        {coins > 0 && <p className="font-black text-amber-600">🪙 +{coins} monedas</p>}
        {!finished && !target.torneo && (
          <p className="text-xs opacity-70">Te avisamos acá y en la competencia cuando termine.</p>
        )}
        <button onClick={() => router.push("/student/competencia")} className="rounded-2xl bg-violet-600 text-white font-black px-6 py-2">
          Volver a la competencia
        </button>
        {(won || tie || target.torneo) && <Burst />}
      </div>
    );
  }

  return (
    <main className="relative flex-1 flex flex-col bg-explorer-day py-6 px-4 overflow-hidden">
      <CloudsBackground />
      {header}
      <div className="relative z-10 w-full max-w-2xl mx-auto">{content}</div>
    </main>
  );
}
