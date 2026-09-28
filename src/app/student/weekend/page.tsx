"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CloudsBackground from "@/components/CloudsBackground";
import CoinBadge from "@/components/CoinBadge";
import Burst from "@/components/weekend/Burst";
import { WEEKEND_GAMES } from "@/components/weekend/registry";
import { WeekendActivity, WeekendPlan } from "@/lib/weekend/plan";
import { WeekendRecord, getAccessoryById, getAccessorySrc } from "@/types";

interface WeekendState {
  available: boolean;
  plan?: WeekendPlan;
  record?: WeekendRecord;
  streak: number;
  previewStreak?: number;
  chestCoins?: number;
  nextRewardId?: string | null;
  perfectBonus?: number;
  finalBonus?: number;
  maxPoints?: number;
  daysCompleted?: number;
}

type Screen =
  | { kind: "map" }
  | { kind: "intro"; activity: WeekendActivity }
  | { kind: "play"; activity: WeekendActivity }
  | { kind: "result"; activity: WeekendActivity; points: number; perfect: number; errors: number }
  | { kind: "final" };

const POINT_LABEL: Record<number, string> = { 1: "Fácil", 2: "Intermedio", 3: "Difícil" };

// Posiciones del camino de piedras (10 paradas) en % del mapa.
const STONES = [
  [18, 90], [42, 84], [66, 88], [84, 76], [62, 66],
  [36, 62], [16, 50], [38, 38], [64, 32], [82, 20],
];

export default function WeekendPage() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [data, setData] = useState<WeekendState | null>(null);
  const [coins, setCoins] = useState<number | null>(null);
  const [screen, setScreen] = useState<Screen>({ kind: "map" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (c: string) => {
    const [w, p] = await Promise.all([
      fetch(`/api/weekend?code=${encodeURIComponent(c)}`).then((r) => r.json()),
      fetch(`/api/progress?code=${encodeURIComponent(c)}`).then((r) => r.json()),
    ]);
    setData(w);
    setCoins(p.progress?.coins ?? 0);
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

  async function handleComplete(activity: WeekendActivity, errors: number) {
    if (!code) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/weekend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, activityIndex: activity.index, errors }),
      });
      const r = await res.json();
      if (!res.ok) {
        setError(r.error || "No se pudo guardar.");
        await load(code);
        setScreen({ kind: "map" });
        return;
      }
      setCoins(r.coins);
      setData((d) => (d ? { ...d, record: r.record, daysCompleted: r.daysCompleted, streak: r.streak ?? d.streak } : d));
      setScreen({ kind: "result", activity, points: r.pointsEarned, perfect: r.perfectBonus, errors });
    } catch {
      setError("Ocurrió un error. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (!data || coins === null) {
    return (
      <main className="flex-1 flex items-center justify-center bg-explorer-day">
        <p className="text-slate-600">Cargando la aventura...</p>
      </main>
    );
  }

  const header = (
    <div className="wood-panel-light relative z-10 flex items-center justify-between gap-3 max-w-3xl w-full mx-auto px-4 py-2.5 mb-5 rounded-2xl">
      <button onClick={() => router.push("/student/play")} className="text-amber-100 font-bold text-sm shrink-0">
        ← Volver
      </button>
      <span className="text-white font-black text-sm sm:text-lg text-center leading-tight">
        {data.plan?.title ?? "Aventura de fin de semana"}
      </span>
      <CoinBadge coins={coins} />
    </div>
  );

  if (!data.available || !data.plan || !data.record) {
    return (
      <main className="relative flex-1 flex flex-col bg-explorer-day py-8 px-4 overflow-hidden">
        <CloudsBackground />
        {header}
        <div className="relative z-10 parchment-panel rounded-3xl max-w-md mx-auto p-6 text-center">
          <p className="text-5xl mb-2">🗓️</p>
          <p className="font-black text-xl">¡La aventura abre el sábado!</p>
          <p className="text-sm opacity-80 mt-2">
            Los sábados y domingos hay 10 juegos de Memoria Numérica con premios especiales.
          </p>
        </div>
      </main>
    );
  }

  const { plan, record } = data;
  const nextReward = data.nextRewardId ? getAccessoryById(data.nextRewardId) : undefined;

  // --- Pantallas del juego ---
  if (screen.kind === "intro") {
    const a = screen.activity;
    const intro = WEEKEND_GAMES[a.kind].intro(a);
    return (
      <main className="relative flex-1 flex flex-col bg-explorer-day py-8 px-4 overflow-hidden">
        <CloudsBackground />
        {header}
        <div className="relative z-10 parchment-panel rounded-3xl max-w-md w-full mx-auto p-6 flex flex-col gap-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide opacity-70">
            Actividad {a.index + 1} de {plan.activities.length} · {a.title}
          </p>
          <h1 className="text-3xl font-black text-violet-700">🃏 {intro.gameName}</h1>
          <div className="text-left">
            <p className="font-black text-sm mb-1">¿Qué vamos a hacer?</p>
            <p className="text-sm leading-relaxed">{intro.howTo}</p>
          </div>
          {intro.sequenceType && (
            <p className="rounded-xl bg-violet-100 border-2 border-violet-300 py-2 font-black text-violet-800">
              Tipo de secuencia: {intro.sequenceType}
            </p>
          )}
          {intro.example && (
            <div>
              <p className="text-xs font-bold opacity-70 mb-1">Ejemplo</p>
              <p className="text-2xl font-black tracking-wide">
                {intro.example.join(" → ")} → …
              </p>
            </div>
          )}
          <p className="text-sm">
            🏅 +{a.points} {a.points === 1 ? "punto" : "puntos"} ({POINT_LABEL[a.points]})
            {data.perfectBonus ? ` · +${data.perfectBonus} si no te equivocás` : ""}
          </p>
          <button
            onClick={() => setScreen({ kind: "play", activity: a })}
            className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-black text-lg py-3 shadow active:scale-95"
          >
            ¡Empezar!
          </button>
          <button onClick={() => setScreen({ kind: "map" })} className="text-sm underline opacity-70">
            Volver al mapa
          </button>
        </div>
      </main>
    );
  }

  if (screen.kind === "play") {
    const a = screen.activity;
    const Game = WEEKEND_GAMES[a.kind].component;
    return (
      <main className="relative flex-1 flex flex-col bg-explorer-day py-8 px-4 overflow-hidden">
        <CloudsBackground />
        {header}
        <div className="relative z-10 w-full max-w-2xl mx-auto">
          <p className="text-center text-sm font-bold text-slate-700 mb-3">
            Actividad {a.index + 1} de {plan.activities.length} · {WEEKEND_GAMES[a.kind].intro(a).sequenceType}
          </p>
          <Game key={a.index} activity={a} onComplete={({ errors }) => void handleComplete(a, errors)} />
          {saving && <p className="text-center text-sm mt-3 text-slate-600">Guardando...</p>}
        </div>
      </main>
    );
  }

  if (screen.kind === "result") {
    const last = record.finished;
    return (
      <main className="relative flex-1 flex flex-col bg-explorer-day py-8 px-4 overflow-hidden">
        <CloudsBackground />
        {header}
        <div className="relative z-10 parchment-panel rounded-3xl max-w-sm w-full mx-auto p-6 text-center flex flex-col gap-3">
          <Burst />
          <p className="text-5xl">{screen.errors === 0 ? "🌟" : "✅"}</p>
          <p className="font-black text-2xl">¡Muy bien!</p>
          <p className="text-lg font-black text-violet-700">+{screen.points} puntos</p>
          {screen.perfect > 0 ? (
            <p className="text-sm">¡Sin errores! Ganaste +{screen.perfect} de bonus 🎯</p>
          ) : (
            <p className="text-sm">
              Te equivocaste {screen.errors} {screen.errors === 1 ? "vez" : "veces"}: ¡cada intento te
              ayudó a recordar!
            </p>
          )}
          <button
            onClick={() => {
              if (last) setScreen({ kind: "final" });
              else {
                const next = plan.activities[record.completed];
                setScreen(next ? { kind: "intro", activity: next } : { kind: "map" });
              }
            }}
            className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-black text-lg py-3 shadow active:scale-95"
          >
            {last ? "¡Abrir el cofre! 🎁" : "Siguiente actividad →"}
          </button>
          {!last && (
            <button onClick={() => setScreen({ kind: "map" })} className="text-sm underline opacity-70">
              Volver al mapa
            </button>
          )}
        </div>
      </main>
    );
  }

  if (screen.kind === "final") {
    const reward = record.reward;
    const acc = reward?.accessoryId ? getAccessoryById(reward.accessoryId) : undefined;
    return (
      <main className="relative flex-1 flex flex-col bg-explorer-day py-8 px-4 overflow-hidden">
        <CloudsBackground />
        {header}
        <div className="relative z-10 parchment-panel rounded-3xl max-w-md w-full mx-auto p-6 text-center flex flex-col gap-3 items-center">
          <Burst big count={22} />
          <p className="text-xs font-black tracking-widest text-violet-700">🎉 ¡FELICITACIONES! 🎉</p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight">
            ¡DESAFÍO DE FIN DE SEMANA COMPLETADO!
          </h1>
          <p className="text-lg">
            Hiciste <span className="font-black text-violet-700">{record.points} puntos</span>
            {data.maxPoints ? <span className="opacity-60"> de {data.maxPoints}</span> : null}
          </p>
          <div className="relative w-36 h-36 wk-float">
            <Image src="/theme/cofre.png" alt="Cofre del tesoro" fill sizes="144px" className="object-contain" />
          </div>
          <p className="font-black">Tu cofre trae:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="rounded-2xl bg-yellow-100 border-2 border-yellow-400 px-4 py-2 font-black">
              🪙 +{reward?.coins ?? 0} monedas
            </span>
            {acc && (
              <span className="rounded-2xl bg-violet-100 border-2 border-violet-400 px-3 py-2 font-black flex items-center gap-2">
                <span className="relative w-10 h-10">
                  <Image src={getAccessorySrc(acc.id)} alt="" fill sizes="40px" className="object-contain" />
                </span>
                {acc.label}
              </span>
            )}
          </div>
          {acc && <p className="text-sm">¡Ya está en tu perfil! Ponételo desde &quot;Mi perfil&quot;.</p>}
          <p className="text-sm opacity-80">
            🏅 Días de aventura completados: {data.daysCompleted ?? 1}
            {data.streak ? ` · 🔥 racha de ${data.streak} ${data.streak === 1 ? "finde" : "findes"}` : ""}
          </p>
          <button
            onClick={() => router.push("/student/play")}
            className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-black text-lg py-3 shadow active:scale-95"
          >
            Volver a mis mundos
          </button>
        </div>
      </main>
    );
  }

  // --- Mapa del día: camino de 10 piedras hasta el cofre ---
  return (
    <main className="relative flex-1 flex flex-col bg-explorer-day py-8 px-4 overflow-hidden">
      <CloudsBackground />
      {header}
      <div className="relative z-10 max-w-md w-full mx-auto flex flex-col gap-3">
        <div className="parchment-panel rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
          <span>
            <span className="block font-black">🃏 Memoria Numérica</span>
            <span className="block text-xs opacity-80">
              {record.finished
                ? "¡Completaste la aventura de hoy! Volvé el próximo día de finde."
                : `Actividad ${record.completed + 1} de ${plan.activities.length} · ¡Recordá dónde está cada número!`}
            </span>
          </span>
          <span className="shrink-0 rounded-xl bg-violet-100 border-2 border-violet-300 px-3 py-1 text-center">
            <span className="block text-[10px] font-bold text-violet-700">PUNTOS</span>
            <span className="block text-xl font-black text-violet-800 leading-none">{record.points}</span>
          </span>
        </div>
        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden border-4 border-amber-800/40 shadow-lg bg-gradient-to-b from-violet-300 via-sky-200 to-emerald-200">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <polyline
              points={[...STONES, [88, 8]].map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke="#fff"
              strokeWidth={1.4}
              strokeDasharray="1 2.5"
              strokeLinecap="round"
              opacity={0.9}
            />
          </svg>
          {plan.activities.map((a, i) => {
            const [x, y] = STONES[i];
            const done = i < record.completed;
            const current = i === record.completed && !record.finished;
            return (
              <button
                key={i}
                disabled={!current}
                onClick={() => setScreen({ kind: "intro", activity: a })}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-black border-4 shadow-md transition ${
                  done
                    ? "w-12 h-12 bg-emerald-400 border-white text-white"
                    : current
                      ? "w-16 h-16 bg-gradient-to-b from-yellow-300 to-amber-500 border-white text-slate-900 text-xl animate-bounce"
                      : "w-11 h-11 bg-white/70 border-white/80 text-slate-400"
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
                title={`${a.title} (+${a.points})`}
              >
                {done ? "✓" : current ? i + 1 : "🔒"}
              </button>
            );
          })}
          <span
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 ${record.finished ? "" : "wk-float"}`}
            style={{ left: "86%", top: "8%" }}
            title="Cofre del tesoro"
          >
            <Image src="/theme/cofre.png" alt="Cofre" fill sizes="80px" className={`object-contain ${record.finished ? "" : "drop-shadow-lg"}`} />
          </span>
        </div>

        {!record.finished && (
          <div className="parchment-panel rounded-2xl px-4 py-3 text-sm flex items-center gap-3">
            <span className="text-2xl">🎁</span>
            <span className="flex-1">
              Completá las 10 y abrí el cofre: <b>🪙 {data.chestCoins} monedas</b>
              {nextReward && (
                <>
                  {" "}+ <b>{nextReward.label}</b> para tu avatar
                </>
              )}
              .
            </span>
            {nextReward && (
              <span className="relative w-10 h-10 shrink-0">
                <Image src={getAccessorySrc(nextReward.id)} alt="" fill sizes="40px" className="object-contain" />
              </span>
            )}
          </div>
        )}
        {record.finished && (
          <button
            onClick={() => setScreen({ kind: "final" })}
            className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-black py-3 shadow"
          >
            Ver mi premio de hoy 🎁
          </button>
        )}
        {!record.finished && (
          <button
            onClick={() => setScreen({ kind: "intro", activity: plan.activities[record.completed] })}
            className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 font-black text-lg py-3 shadow active:scale-95"
          >
            {record.completed === 0 ? "¡Empezar la aventura!" : "Seguir jugando →"}
          </button>
        )}
      </div>
    </main>
  );
}
