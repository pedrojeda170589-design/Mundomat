"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { StudentProgress } from "@/types";
import McActivity from "@/components/activities/McActivity";
import TrueFalseActivity from "@/components/activities/TrueFalseActivity";
import ClassifyActivity from "@/components/activities/ClassifyActivity";
import OrderActivity from "@/components/activities/OrderActivity";
import Burst from "@/components/weekend/Burst";
import { speak } from "@/lib/tts";
import {
  ETAPAS,
  EMBLEMAS,
  ESPECIES,
  OBJETOS,
  PREMIO_SANTA_CRUZ,
  ACTIVIDADES_POR_VUELTA,
  MINIMO_PARA_SUPERAR,
  armarVuelta,
  etapaAbierta,
  etapaSuperada,
  etapasSuperadas,
  proximaEtapa,
  especie,
  type ActividadReserva,
  type Etapa,
} from "@/lib/reserva";
import { MAPA } from "@/lib/reserva/mapaDatos";
import { emojiPremio, nombrePremio, rutaPostal, rutaPremio } from "@/lib/reserva/arte";
import MapaReserva, { CAJA_PAIS, CAJA_PATAGONIA, CAJA_SANTA_CRUZ, cajaDeTerritorio, type Caja, type EstadoTerritorio } from "./MapaReserva";
import ImgReserva from "./ImgReserva";
import VideoAnimacion from "@/components/VideoAnimacion";
import { marcarVideoVisto, tocaVideo, videosActivos } from "@/lib/videos";
import FichaReserva, { ContenidoFicha, SelloConservacion } from "./FichaReserva";

type Vista = "mapa" | "etapa" | "juego" | "resultado" | "coleccion";

function nombreTerritorio(id: string): string {
  return MAPA.departamentos.find((d) => d.id === id)?.nombre ?? MAPA.provincias.find((p) => p.id === id)?.nombre ?? id;
}

// Actividad «tocá en el mapa».
function ActividadEnMapa({ a, onDone }: { a: Extract<ActividadReserva, { type: "mapa" }>; onDone: (ok: boolean) => void }) {
  const [elegido, setElegido] = useState<string | null>(null);
  const caja = a.nivel === "departamento" ? CAJA_SANTA_CRUZ : CAJA_PATAGONIA;
  function tocar(id: string) {
    if (elegido) return;
    setElegido(id);
    setTimeout(() => onDone(id === a.respuesta), 1300);
  }
  return (
    <div className="w-full max-w-md rounded-3xl bg-slate-900/80 border border-slate-700 p-4 shadow-xl">
      <p className="text-xl font-bold text-white mb-3 text-center">{a.prompt}</p>
      <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden border-2 border-sky-300">
        <MapaReserva caja={caja} numeros={false} alTocar={tocar} elegido={elegido} correcto={elegido ? a.respuesta : null} />
      </div>
      {elegido && (
        <p className={`mt-2 text-center font-black ${elegido === a.respuesta ? "text-emerald-300" : "text-rose-300"}`}>
          {elegido === a.respuesta ? "¡Muy bien!" : `Ese es ${nombreTerritorio(elegido)}. El correcto está en verde.`}
        </p>
      )}
    </div>
  );
}

function TarjetaPremio({ id, onVer, bloqueado = false }: { id: string; onVer?: () => void; bloqueado?: boolean }) {
  const e = ESPECIES.find((x) => x.id === id);
  return (
    <button
      type="button"
      onClick={bloqueado ? undefined : onVer}
      disabled={bloqueado}
      className={`relative flex flex-col items-center rounded-2xl border-2 p-1.5 text-center ${bloqueado ? "border-slate-200 bg-slate-100" : "border-amber-300 bg-white hover:brightness-105"}`}
      aria-label={bloqueado ? "Todavía no lo ganaste" : `Ver ficha: ${nombrePremio(id)}`}
    >
      <span className="relative w-full aspect-square">
        {bloqueado ? (
          <span className="absolute inset-0 flex items-center justify-center text-3xl text-slate-400 font-black">?</span>
        ) : (
          <ImgReserva src={rutaPremio(id)} emoji={emojiPremio(id)} />
        )}
      </span>
      <span className={`mt-0.5 text-[10px] font-black leading-tight ${bloqueado ? "text-slate-400" : "text-amber-950"}`}>
        {bloqueado ? "???" : nombrePremio(id)}
      </span>
      {!bloqueado && e && (
        <span className="absolute -top-1.5 -right-1.5">
          <SelloConservacion c={e.categoria} chico />
        </span>
      )}
    </button>
  );
}

// Premios que se acercan con luz dorada (mismo efecto que PremioAparece).
function PremiosGanados({ ids, onCerrar }: { ids: string[]; onCerrar: () => void }) {
  const santaCruz = PREMIO_SANTA_CRUZ.every((x) => ids.includes(x));
  return (
    <div role="dialog" aria-modal="true" aria-label="Premios" className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/70 p-4" onClick={onCerrar}>
      <div className="mm-premio-zoom w-full max-w-sm rounded-3xl bg-gradient-to-b from-yellow-50 to-amber-100 border-2 border-yellow-300 p-5 text-center text-amber-950" onClick={(e) => e.stopPropagation()}>
        <p className="text-xs font-black uppercase tracking-widest text-amber-700">🎉 ¡Nuevos en tu reserva!</p>
        {santaCruz && <p className="mt-1 font-black text-emerald-700">¡Recorriste los siete departamentos de Santa Cruz! Ganaste la medalla de la expedición.</p>}
        <div className="my-3 grid grid-cols-2 gap-2">
          {ids.map((id) => (
            <div key={id} className="flex flex-col items-center">
              <span className="mm-premio-zoom-emoji relative block w-24 h-24 rounded-2xl bg-white/80">
                <ImgReserva src={rutaPremio(id)} emoji={emojiPremio(id)} alt={nombrePremio(id)} />
              </span>
              <span className="mt-1 text-xs font-black leading-tight">{nombrePremio(id)}</span>
            </div>
          ))}
        </div>
        <button onClick={onCerrar} className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 py-3 font-black text-slate-950 shadow min-h-11">
          ¡Genial!
        </button>
      </div>
    </div>
  );
}

// Actividad especial «Reserva y expedición patagónica» (3.º y 4.º).
export default function ReservaModal({
  studentCode,
  progress,
  onClose,
  onProgressUpdated,
}: {
  studentCode: string;
  progress: StudentProgress;
  onClose: () => void;
  onProgressUpdated: (p: StudentProgress) => void;
}) {
  const [vista, setVista] = useState<Vista>("mapa");
  const [caja, setCaja] = useState<Caja>(CAJA_PAIS);
  const [etapaN, setEtapaN] = useState<number>(proximaEtapa(progress) ?? 1);
  const [actividades, setActividades] = useState<ActividadReserva[]>([]);
  const [indice, setIndice] = useState(0);
  const [bien, setBien] = useState(0);
  const [pista, setPista] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [premios, setPremios] = useState<string[]>([]);
  const [verPremios, setVerPremios] = useState(false);
  const [ficha, setFicha] = useState<string | null>(null);
  // Video de presentación: la primera vez que se abre (después, con 🎬).
  const [video, setVideo] = useState(() => videosActivos(undefined) && tocaVideo("reserva", studentCode, Infinity));

  const et: Etapa = ETAPAS.find((e) => e.n === etapaN) ?? ETAPAS[0];
  const superadas = etapasSuperadas(progress);
  const coleccion = useMemo(() => new Set(progress.reserva?.coleccion ?? []), [progress.reserva?.coleccion]);

  const estados = useMemo(() => {
    const r: Record<string, EstadoTerritorio> = {};
    for (const e of ETAPAS) r[e.territorio] = etapaSuperada(progress, e.n) ? "superada" : etapaAbierta(progress, e.n) ? "abierta" : "cerrada";
    return r;
  }, [progress]);

  // Al entrar: la Argentina entera y, enseguida, el zoom a la zona de la expedición.
  useEffect(() => {
    const t = setTimeout(() => setCaja((proximaEtapa(progress) ?? 8) <= 7 ? CAJA_SANTA_CRUZ : CAJA_PATAGONIA), 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && !ficha && !verPremios && onClose();
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [onClose, ficha, verPremios]);

  function abrirEtapa(n: number) {
    if (!etapaAbierta(progress, n)) return;
    const e = ETAPAS.find((x) => x.n === n)!;
    setEtapaN(n);
    setCaja(cajaDeTerritorio(e.territorio));
    setVista("etapa");
  }

  function empezar() {
    setActividades(armarVuelta(et.n));
    setIndice(0);
    setBien(0);
    setPista(false);
    setError(null);
    setVista("juego");
  }

  async function terminar(correctas: number) {
    setVista("resultado");
    setGuardando(true);
    setError(null);
    setPremios([]);
    try {
      const r = await fetch("/api/reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: studentCode, action: "completar-etapa", etapa: et.n, correctas }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? "No se pudo guardar.");
      onProgressUpdated(d.progress);
      const nuevos: string[] = d.resultado?.premios ?? [];
      setPremios(nuevos);
      if (nuevos.length) setVerPremios(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  }

  function respondio(ok: boolean) {
    const nuevo = ok ? bien + 1 : bien;
    setBien(nuevo);
    setPista(false);
    if (indice + 1 < actividades.length) setIndice(indice + 1);
    else void terminar(nuevo);
  }

  const actual = actividades[indice];
  const enMapa = vista === "mapa" || vista === "etapa";

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-center bg-black/60 sm:p-3" role="dialog" aria-modal="true" aria-label="Reserva y expedición patagónica">
      <div className="relative w-full max-w-3xl h-full sm:h-auto sm:max-h-[96vh] overflow-y-auto sm:rounded-[2rem] border-4 border-amber-300 bg-gradient-to-b from-sky-100 via-amber-50 to-amber-100 shadow-2xl">
        {/* Encabezado */}
        <div className="sticky top-0 z-20 wood-panel px-3 py-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="font-black text-sm sm:text-lg drop-shadow leading-tight">🦙 Reserva patagónica</h2>
            <p className="text-[11px] font-bold opacity-90">⭐ {superadas} de {ETAPAS.length} etapas</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setVista(vista === "coleccion" ? "mapa" : "coleccion")}
              className="min-h-11 rounded-full bg-emerald-500 border-2 border-white px-3 text-xs font-black text-white shadow"
            >
              {vista === "coleccion" ? "🗺️ Mapa" : `🌿 Mi reserva (${coleccion.size})`}
            </button>
            <button
              onClick={() => setVideo(true)}
              className="w-11 h-11 rounded-full bg-white/90 border-2 border-white text-lg shadow"
              aria-label="Ver el video de presentación"
              title="Ver el video"
            >
              🎬
            </button>
            <button onClick={onClose} className="w-11 h-11 rounded-full bg-gradient-to-b from-rose-400 to-rose-600 border-2 border-white text-white font-black shadow" aria-label="Cerrar">
              ✕
            </button>
          </div>
        </div>

        {/* Mapa (inicio y etapa) */}
        {enMapa && (
          <div className="p-3">
            <div className="relative w-full h-[46vh] min-h-[280px] rounded-3xl overflow-hidden border-4 border-white shadow-inner">
              <MapaReserva caja={caja} estados={estados} resaltar={vista === "etapa" ? et.territorio : undefined} localidades={vista === "etapa" ? et.localidades : []} numeros={vista === "mapa"} />
              {vista === "mapa" && (
                <div className="absolute bottom-2 left-2 right-2 flex flex-wrap justify-center gap-1.5">
                  {[
                    { t: "🇦🇷 Argentina", c: CAJA_PAIS },
                    { t: "Santa Cruz", c: CAJA_SANTA_CRUZ },
                    { t: "Patagonia", c: CAJA_PATAGONIA },
                  ].map((b) => (
                    <button key={b.t} onClick={() => setCaja(b.c)} className="min-h-9 rounded-full bg-white/90 border-2 border-sky-400 px-3 text-xs font-black text-sky-900 shadow">
                      {b.t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {vista === "mapa" && (
          <div className="px-3 pb-4">
            <p className="-mt-2 mb-2 text-right text-[9px] text-slate-500">Límites: Instituto Geográfico Nacional (CC BY 4.0) y Natural Earth.</p>
            <p className="text-sm font-bold text-amber-950 mb-2">
              Recorré la Patagonia: empezamos en <b>Río Chico</b>, el departamento de Gobernador Gregores, y seguimos por toda Santa Cruz. En cada lugar conocés un animal, una planta, un objeto tradicional y su escudo o bandera.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {ETAPAS.map((e) => {
                const est = estados[e.territorio];
                const titulo = e.nivel === "departamento" ? `Departamento ${e.nombre}` : `Provincia de ${e.nombre}`;
                return (
                  <button
                    key={e.n}
                    onClick={() => abrirEtapa(e.n)}
                    disabled={est === "cerrada"}
                    className={`flex items-center gap-2 rounded-2xl border-2 px-2 py-1.5 text-left min-h-12 ${
                      est === "superada" ? "bg-emerald-50 border-emerald-300" : est === "abierta" ? "bg-yellow-50 border-amber-400 ring-2 ring-amber-300" : "bg-white/60 border-slate-200 opacity-70"
                    }`}
                  >
                    <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-black text-white ${est === "superada" ? "bg-emerald-600" : est === "abierta" ? "bg-amber-600" : "bg-slate-400"}`}>
                      {est === "superada" ? "✓" : est === "cerrada" ? "🔒" : e.n}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-black text-amber-950 leading-tight">{titulo}</span>
                      <span className="block text-[10px] text-amber-900/75 truncate">
                        {est === "cerrada" ? "Superá la etapa anterior para abrirla" : `${especie(e.animal).emoji} ${especie(e.animal).nombre} · ${e.cabecera}`}
                      </span>
                    </span>
                    {est !== "cerrada" && enPeligroDe(e) && <SelloConservacion c={especie(e.animal).categoria} chico />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Etapa: postal, datos y fichas para leer antes de jugar */}
        {vista === "etapa" && (
          <div className="px-3 pb-24 flex flex-col gap-3">
            <div className="mm-premio-zoom relative rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white">
              <div className="relative w-full aspect-[16/9] bg-sky-200">
                <ImgReserva src={rutaPostal(et.territorio)} emoji="🏞️" alt={et.postal.titulo} cover sizes="(max-width: 768px) 100vw, 720px" />
              </div>
              <div className="p-3">
                <p className="text-[11px] font-black uppercase tracking-wider text-sky-700">
                  Etapa {et.n} · {et.nivel === "departamento" ? `Departamento ${et.nombre}` : `Provincia de ${et.nombre}`}
                </p>
                <p className="font-black text-lg text-amber-950 leading-tight">📮 {et.postal.titulo}</p>
                <p className="text-sm text-amber-950/90 mt-1">{et.postal.texto}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white/80 border-2 border-sky-200 p-3">
              <p className="font-black text-sky-900 mb-1">📍 Datos del lugar</p>
              <ul className="list-disc pl-5 text-[13px] text-slate-800 flex flex-col gap-0.5">
                {et.datos.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              {et.otrasLocalidades.length > 0 && <p className="mt-1 text-[12px] text-slate-700">Otras localidades: {et.otrasLocalidades.join(", ")}.</p>}
            </div>
            <p className="font-black text-amber-950">🔎 Conocé a los habitantes de este lugar</p>
            {[et.animal, et.planta].map((id) => (
              <div key={id} className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-3">
                <ContenidoFicha id={id} resumida />
              </div>
            ))}
            <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-3">
              <ContenidoFicha id={et.objeto} />
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center px-3 pb-3 pointer-events-none">
              <div className="w-full max-w-3xl flex gap-2 pointer-events-auto">
                <button
                  onClick={() => {
                    setVista("mapa");
                    setCaja(et.nivel === "departamento" ? CAJA_SANTA_CRUZ : CAJA_PATAGONIA);
                  }}
                  className="min-h-12 flex-1 rounded-2xl border-2 border-amber-300 bg-white font-black text-amber-900 shadow"
                >
                  ← Mapa
                </button>
                <button onClick={empezar} className="min-h-12 flex-[2] rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-black text-white shadow-lg">
                  🚀 ¡A explorar! ({ACTIVIDADES_POR_VUELTA} actividades)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Juego */}
        {vista === "juego" && actual && (
          <div className="p-3 flex flex-col items-center gap-3 bg-gradient-to-b from-slate-800 to-slate-900 min-h-[70vh]">
            <div className="w-full flex items-center justify-between gap-2 text-white">
              <button onClick={() => setVista("etapa")} className="text-xs font-bold underline opacity-80 min-h-9">
                ← Salir
              </button>
              <span className="text-xs font-black text-amber-300">
                {et.nombre} · Actividad {indice + 1} de {actividades.length}
              </span>
              <button
                onClick={() => speak(actual.type === "true-false" ? actual.statement : "prompt" in actual ? actual.prompt : "", undefined, 0.9)}
                className="rounded-full bg-white/10 border border-white/30 px-3 min-h-9 text-xs font-bold"
              >
                🔊 Escuchar
              </button>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all" style={{ width: `${((indice + 1) / actividades.length) * 100}%` }} />
            </div>
            {actual.type === "mapa" && <ActividadEnMapa key={actual.id} a={actual} onDone={respondio} />}
            {actual.type === "mc" && <McActivity key={actual.id} prompt={actual.prompt} choices={actual.choices} answerIndex={actual.answerIndex} onDone={respondio} />}
            {actual.type === "true-false" && <TrueFalseActivity key={actual.id} statement={actual.statement} isTrue={actual.isTrue} onDone={respondio} />}
            {actual.type === "classify" && <ClassifyActivity key={actual.id} prompt={actual.prompt} categories={actual.categories} items={actual.items} onDone={respondio} />}
            {actual.type === "order" && <OrderActivity key={actual.id} prompt={actual.prompt} items={actual.items} correctOrder={actual.correctOrder} onDone={respondio} />}
            <div className="w-full max-w-md">
              {pista ? (
                <p className="rounded-2xl bg-amber-100 border-2 border-amber-300 px-3 py-2 text-sm font-bold text-amber-950">💡 {actual.hint}</p>
              ) : (
                <button onClick={() => setPista(true)} className="w-full min-h-10 rounded-2xl border-2 border-amber-300/60 text-amber-200 text-sm font-black">
                  💡 Ver una pista
                </button>
              )}
            </div>
          </div>
        )}

        {/* Resultado */}
        {vista === "resultado" && (
          <div className="relative p-5 flex flex-col items-center text-center gap-3 min-h-[60vh] justify-center">
            {!guardando && !error && bien >= MINIMO_PARA_SUPERAR && <Burst big count={24} />}
            <span className="text-5xl">{bien >= MINIMO_PARA_SUPERAR ? "🏆" : "💪"}</span>
            <h3 className="text-2xl font-black text-amber-950">{bien >= MINIMO_PARA_SUPERAR ? `¡Superaste ${et.nombre}!` : "¡Buen intento!"}</h3>
            <p className="font-bold text-amber-900">
              Acertaste {bien} de {actividades.length}.
              {bien < MINIMO_PARA_SUPERAR && ` Para superar la etapa hacen falta ${MINIMO_PARA_SUPERAR}. Volvé a leer las fichas y probá otra vez.`}
            </p>
            {guardando && <p className="text-sm text-amber-800 animate-pulse">Guardando…</p>}
            {error && <p className="text-sm font-bold text-red-700 bg-red-50 border border-red-300 rounded-xl px-3 py-2">⚠️ {error} Revisá la conexión y volvé a jugar la etapa.</p>}
            {premios.length > 0 && (
              <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
                {premios.map((id) => (
                  <TarjetaPremio key={id} id={id} onVer={() => setFicha(id)} />
                ))}
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <button onClick={empezar} className="min-h-11 rounded-2xl border-2 border-amber-400 bg-white px-4 font-black text-amber-900">
                🔁 Jugar otra vez
              </button>
              <button
                onClick={() => {
                  const sig = proximaEtapa(progress);
                  setVista("mapa");
                  setCaja(sig && sig >= 8 ? CAJA_PATAGONIA : CAJA_SANTA_CRUZ);
                }}
                className="min-h-11 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 font-black text-white shadow"
              >
                🗺️ Volver al mapa
              </button>
            </div>
          </div>
        )}

        {/* Mi reserva */}
        {vista === "coleccion" && (
          <div className="p-3 flex flex-col gap-4">
            <p className="text-sm font-bold text-amber-950">
              Todo lo que ganaste en la expedición. Tocá cada uno para ver su ficha. Los que tienen el sello rojo están en peligro de extinción.
            </p>
            {[
              { t: "🐾 Animales", ids: ETAPAS.map((e) => e.animal) },
              { t: "🌿 Plantas", ids: ETAPAS.map((e) => e.planta) },
              { t: "🧉 Objetos tradicionales y medalla", ids: [...OBJETOS.map((o) => o.id), ...PREMIO_SANTA_CRUZ] },
              { t: "🛡️ Escudos y banderas", ids: EMBLEMAS.map((m) => m.id) },
            ].map((g) => (
              <section key={g.t}>
                <p className="font-black text-amber-950 mb-1.5">
                  {g.t} · {g.ids.filter((id) => coleccion.has(id)).length} de {g.ids.length}
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {g.ids.map((id) => (
                    <TarjetaPremio key={id} id={id} bloqueado={!coleccion.has(id)} onVer={() => setFicha(id)} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
      {verPremios && premios.length > 0 && <PremiosGanados ids={premios} onCerrar={() => setVerPremios(false)} />}
      {ficha && <FichaReserva id={ficha} onCerrar={() => setFicha(null)} />}
      {video && (
        <VideoAnimacion
          nombre="reserva"
          onCerrar={() => {
            marcarVideoVisto("reserva", studentCode);
            setVideo(false);
          }}
        />
      )}
    </div>,
    document.body
  );
}

function enPeligroDe(e: Etapa): boolean {
  const c = especie(e.animal).categoria;
  return c === "CR" || c === "EN" || c === "VU";
}
