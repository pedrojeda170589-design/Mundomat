"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import AvatarDisplay from "@/components/AvatarDisplay";
import Link from "next/link";
import {
  BIRTHDAY_MESSAGES,
  CHALLENGE_MESSAGES,
  COIN_AMOUNTS,
  ClassMessage,
  MAX_COINS_SENT_PER_DAY,
  MessageKind,
  PRESET_GIFTS,
  PRESET_MESSAGES,
  describeMessage,
} from "@/lib/messagesShared";
import { AvatarAccessories } from "@/types";

interface Classmate {
  code: string;
  name: string;
  avatar?: string;
  accessories?: AvatarAccessories;
  background?: string;
  online: boolean;
  birthdayToday?: boolean;
}

interface MailboxData {
  enabled: boolean;
  classmates: Classmate[];
  inbox: (ClassMessage & { fromName: string })[];
  unread: number;
  coinsSentToday: number;
}

function timeAgo(iso: string): string {
  const mins = Math.max(
    0,
    Math.round((Date.now() - new Date(iso).getTime()) / 60000),
  );
  if (mins < 1) return "recién";
  if (mins < 60) return `hace ${mins} min`;
  const h = Math.round(mins / 60);
  return h < 24 ? `hace ${h} h` : `hace ${Math.round(h / 24)} días`;
}

// Buzón de la clase: mensajes, regalitos y monedas para los compañeros.
// Todo es a partir de opciones ya escritas: no hay texto libre.
export default function ClassMailbox({
  code,
  coins,
  onCoinsChange,
}: {
  code: string;
  coins: number;
  onCoinsChange: (coins: number) => void;
}) {
  const router = useRouter();
  const [data, setData] = useState<MailboxData | null>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"recibidos" | "enviar">("recibidos");
  const [to, setTo] = useState<Classmate | null>(null);
  const [kind, setKind] = useState<MessageKind>("mensaje");
  const [duelMode, setDuelMode] = useState<"turnos" | "vivo">("turnos");
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch(`/api/messages?code=${encodeURIComponent(code)}`);
    if (r.ok) setData(await r.json());
  }, [code]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    const t = setInterval(() => void load(), 60_000);
    return () => clearInterval(t);
  }, [load]);

  async function openBox() {
    setOpen(true);
    setTab(data && data.unread > 0 ? "recibidos" : "enviar");
    setStatus(null);
    if (data?.unread) {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, markRead: true }),
      });
    }
  }

  function close() {
    setOpen(false);
    setTo(null);
    void load();
  }

  async function send(payload: { presetId?: string; amount?: number }) {
    if (!to) return;
    setSending(true);
    setStatus(null);
    try {
      const r =
        kind === "desafio"
          ? await fetch("/api/competition", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code, action: "challenge", to: to.code, mode: duelMode, presetId: payload.presetId }),
            })
          : await fetch("/api/messages", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code, to: to.code, kind, ...payload }),
            });
      const d = await r.json();
      if (!r.ok) {
        setStatus(`⚠️ ${d.error}`);
      } else if (kind === "desafio" && duelMode === "vivo") {
        router.push(`/student/competencia/jugar?duelo=${encodeURIComponent(d.duelId)}`);
      } else {
        if (typeof d.coins === "number") onCoinsChange(d.coins);
        setStatus(`✅ ¡Listo! Se lo mandaste a ${to.name}.`);
        setTo(null);
        void load();
      }
    } finally {
      setSending(false);
    }
  }

  if (!data?.enabled) return null;

  return (
    <>
      <button
        onClick={openBox}
        className="relative flex items-center gap-1 rounded-full px-3 py-1.5 border border-pink-300/70 bg-black/15 text-pink-100 text-sm font-bold"
        title="Buzón de la clase"
      >
        💌
        {data.unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center">
            {data.unread}
          </span>
        )}
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 overflow-y-auto">
            <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-5 flex flex-col gap-4 my-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-black text-lg">
                  💌 Buzón de la clase
                </h2>
                <button
                  onClick={close}
                  className="text-slate-400 text-xl"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(["recibidos", "enviar"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTab(t);
                      setStatus(null);
                    }}
                    className={`rounded-xl py-2 font-bold text-sm ${
                      tab === t
                        ? "bg-amber-400 text-slate-900"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {t === "recibidos" ? "📥 Recibidos" : "📤 Enviar"}
                  </button>
                ))}
              </div>

              {tab === "recibidos" && (
                <ul className="flex flex-col gap-2 max-h-[55vh] overflow-y-auto">
                  {data.inbox.length === 0 && (
                    <li className="text-slate-400 text-sm text-center py-6">
                      Todavía no recibiste nada. ¡Mandale algo lindo a un
                      compañero!
                    </li>
                  )}
                  {data.inbox.map((m) => {
                    const d = describeMessage(m);
                    return (
                      <li
                        key={m.id}
                        className="rounded-2xl bg-slate-800 px-3 py-2 flex items-center gap-3"
                      >
                        <span className="text-3xl">{d.emoji}</span>
                        <span className="flex-1">
                          <span className="block text-amber-200 text-xs font-bold">
                            {m.fromName}
                          </span>
                          <span className="block text-white text-sm">
                            {m.kind === "mensaje" || m.kind === "desafio" ? `“${d.text}”` : d.text}
                          </span>
                        </span>
                        <span className="flex flex-col items-end gap-1">
                          <span className="text-[10px] text-slate-500">{timeAgo(m.at)}</span>
                          {m.kind === "desafio" && (
                            <Link
                              href="/student/competencia"
                              className="rounded-lg bg-amber-400 text-slate-900 text-[11px] font-black px-2 py-1"
                            >
                              Ver desafío →
                            </Link>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {tab === "enviar" && !to && (
                <div className="flex flex-col gap-2">
                  <p className="text-slate-400 text-xs">
                    ¿A quién le querés mandar algo?
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[50vh] overflow-y-auto pr-1">
                    {data.classmates.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setTo(c);
                          setKind("mensaje");
                          setStatus(null);
                        }}
                        className="flex flex-col items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 p-2"
                      >
                        <span className="relative">
                          <AvatarDisplay
                            character={c.avatar}
                            accessories={c.accessories}
                            background={c.background}
                            className="w-14 h-14 rounded-xl"
                            imageSizes="56px"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-800 ${
                              c.online ? "bg-emerald-400" : "bg-slate-500"
                            }`}
                            title={c.online ? "Conectado" : "No conectado"}
                          />
                        </span>
                        <span className="text-[11px] text-white font-semibold leading-tight text-center line-clamp-2">
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    🟢 conectado ahora · ⚪ lo verá cuando entre
                  </p>
                </div>
              )}

              {tab === "enviar" && to && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <AvatarDisplay
                      character={to.avatar}
                      accessories={to.accessories}
                      background={to.background}
                      className="w-12 h-12 rounded-xl"
                      imageSizes="48px"
                    />
                    <span className="flex-1 text-white font-bold">
                      Para: {to.name}
                    </span>
                    <button
                      onClick={() => setTo(null)}
                      className="text-xs text-slate-400 underline"
                    >
                      Cambiar
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(
                      [
                        ["mensaje", "💬 Mensaje"],
                        ["regalo", "🎁 Regalo"],
                        ["monedas", "🪙 Monedas"],
                        ["desafio", "⚔️ Desafío"],
                      ] as const
                    ).map(([k, label]) => (
                      <button
                        key={k}
                        onClick={() => setKind(k)}
                        className={`rounded-xl py-2 text-xs font-bold leading-tight ${
                          kind === k
                            ? "bg-pink-400 text-slate-900"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {kind === "mensaje" && (
                    <div className="grid grid-cols-1 gap-1.5 max-h-[40vh] overflow-y-auto">
                      {to.birthdayToday && (
                      <p className="text-yellow-300 text-xs font-bold mt-1">🎂 ¡Hoy es su cumpleaños! Saludalo:</p>
                    )}
                    {[...(to.birthdayToday ? BIRTHDAY_MESSAGES : []), ...PRESET_MESSAGES].map((p) => (
                        <button
                          key={p.id}
                          disabled={sending}
                          onClick={() => void send({ presetId: p.id })}
                          className="text-left rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-white text-sm"
                        >
                          {p.emoji} {p.text}
                        </button>
                      ))}
                    </div>
                  )}
                  {kind === "desafio" && (
                  <div className="flex flex-col gap-2">
                    <p className="text-slate-400 text-xs">
                      Un duelo de memoria: los dos juegan la misma partida (3 juegos) y gana quien tenga menos errores.
                      ¡Todos ganan monedas!
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setDuelMode("turnos")}
                        className={`rounded-xl py-2 text-xs font-bold ${duelMode === "turnos" ? "bg-amber-400 text-slate-900" : "bg-slate-800 text-slate-300"}`}
                      >
                        🕐 Por turnos
                        <span className="block font-normal text-[10px]">cada uno juega cuando entra</span>
                      </button>
                      <button
                        disabled={!to.online}
                        onClick={() => setDuelMode("vivo")}
                        className={`rounded-xl py-2 text-xs font-bold disabled:opacity-40 ${duelMode === "vivo" ? "bg-amber-400 text-slate-900" : "bg-slate-800 text-slate-300"}`}
                      >
                        ⚡ En vivo
                        <span className="block font-normal text-[10px]">
                          {to.online ? "los dos ahora mismo" : "no está conectado"}
                        </span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {CHALLENGE_MESSAGES.map((p) => (
                        <button
                          key={p.id}
                          disabled={sending}
                          onClick={() => void send({ presetId: p.id })}
                          className="text-left rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-white text-sm"
                        >
                          {p.emoji} {p.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {kind === "regalo" && (
                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_GIFTS.map((g) => (
                        <button
                          key={g.id}
                          disabled={sending}
                          onClick={() => void send({ presetId: g.id })}
                          className="rounded-xl bg-slate-800 hover:bg-slate-700 py-3 flex flex-col items-center text-white text-xs"
                        >
                          <span className="text-3xl">{g.emoji}</span>
                          {g.text}
                        </button>
                      ))}
                    </div>
                  )}
                  {kind === "monedas" && (
                    <div className="flex flex-col gap-2">
                      <p className="text-slate-400 text-xs">
                        Tenés 🪙 {coins}. Podés regalar hasta{" "}
                        {MAX_COINS_SENT_PER_DAY} por día (hoy ya regalaste{" "}
                        {data.coinsSentToday}).
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {COIN_AMOUNTS.map((a) => (
                          <button
                            key={a}
                            disabled={
                              sending ||
                              coins < a ||
                              data.coinsSentToday + a > MAX_COINS_SENT_PER_DAY
                            }
                            onClick={() => void send({ amount: a })}
                            className="rounded-xl bg-yellow-400 text-slate-900 font-black py-3 disabled:opacity-40"
                          >
                            🪙 {a}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {status && (
                <p className="text-sm text-center text-white">{status}</p>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
