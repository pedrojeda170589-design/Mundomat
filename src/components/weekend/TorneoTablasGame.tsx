"use client";

import { useEffect, useRef, useState } from "react";
import { generarPasosTabla, PasoTorneo } from "@/lib/torneo/opciones";
import {
  calcularMedalla,
  getMetaTabla,
  MedallaTorneo,
  PENALIDAD_ERROR_MS,
} from "@/lib/torneo/tiempos";
import type { EstadoPrestamo } from "@/lib/torneo/prestamoServer";
import PrestamoSixSeven from "./PrestamoSixSeven";
import { InfoVuelta, ResultadoDeVuelta, type EstadoVuelta, type VueltaCompleta } from "./VueltaTorneo";

export interface TorneoTablasGameProps {
  code: string;
  onExit: () => void;
  onCoinsUpdated: (newCoins: number) => void;
  currentCoins?: number;
}

type FaseJuego =
  | "seleccion"
  | "cuenta_regresiva"
  | "jugando"
  | "guardando"
  | "resultado";

interface RankingEntry {
  displayName: string;
  mejorMs: number;
  medalla: MedallaTorneo;
}

export default function TorneoTablasGame({
  code,
  onExit,
  onCoinsUpdated,
}: TorneoTablasGameProps) {
  const [fase, setFase] = useState<FaseJuego>("seleccion");
  const [tablaSeleccionada, setTablaSeleccionada] = useState<number>(2);

  // Rankings por tabla
  // Ranking de la última tabla pedida (si es de otra tabla, está cargando).
  const [rankingDe, setRankingDe] = useState<{ tabla: number; lista: RankingEntry[] } | null>(null);
  const ranking = rankingDe?.tabla === tablaSeleccionada ? rankingDe.lista : [];
  const loadingRanking = rankingDe?.tabla !== tablaSeleccionada;

  // Estado de la cuenta regresiva
  const [cuentaRegresiva, setCuentaRegresiva] = useState<number>(3);

  // Pasos y partida
  const [pasos, setPasos] = useState<PasoTorneo[]>([]);
  const [pasoActual, setPasoActual] = useState<number>(0);
  const [errores, setErrores] = useState<number>(0);
  const [tiempoTranscurridoMs, setTiempoTranscurridoMs] = useState<number>(0);
  const [penalidadMs, setPenalidadMs] = useState<number>(0);

  // Estados visuales de botones
  const [opcionCorrectaPresionada, setOpcionCorrectaPresionada] = useState<number | null>(null);
  const [opcionErroneaPresionada, setOpcionErroneaPresionada] = useState<number | null>(null);
  const [alertaPenalidad, setAlertaPenalidad] = useState(false);

  // Resultado del servidor
  const [resultadoFinal, setResultadoFinal] = useState<{
    ms: number;
    errores: number;
    medalla: MedallaTorneo;
    monedasGanadas: number;
    mejorMs: number;
    esMejorTiempo: boolean;
    vueltaCompleta?: VueltaCompleta;
    vueltaTablasHechas?: number[];
  } | null>(null);
  // Objeto del mes y préstamo Six-Seven (vienen con el ranking).
  const [vuelta, setVuelta] = useState<EstadoVuelta | null>(null);
  const [prestamo, setPrestamo] = useState<EstadoPrestamo | null>(null);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  // Cronómetro
  const tiempoInicioRef = useRef<number>(0);
  const timerAnimRef = useRef<number | null>(null);
  // Partida abierta en el servidor (se pide al arrancar el reloj).
  const partidaRef = useRef<Promise<string | null> | null>(null);
  const terminadaRef = useRef(false);
  const [sacudir, setSacudir] = useState(0); // cambia en cada error para repetir la sacudida

  // Cargar ranking al seleccionar o cambiar tabla
  useEffect(() => {
    if (fase !== "seleccion") return;
    let cancelled = false;
    fetch(`/api/torneo?code=${encodeURIComponent(code)}&tabla=${tablaSeleccionada}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.ok) {
          setRankingDe({ tabla: tablaSeleccionada, lista: d.ranking ?? [] });
          setVuelta(d.vuelta ?? null);
          setPrestamo(d.prestamo ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) setRankingDe({ tabla: tablaSeleccionada, lista: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [code, tablaSeleccionada, fase]);

  // Manejo de la cuenta regresiva (3-2-1)
  useEffect(() => {
    if (fase !== "cuenta_regresiva") return;

    if (cuentaRegresiva > 0) {
      const t = setTimeout(() => {
        setCuentaRegresiva((c) => c - 1);
      }, 900);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      tiempoInicioRef.current = performance.now();
      terminadaRef.current = false;
      partidaRef.current = fetch("/api/torneo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", code, tabla: tablaSeleccionada }),
      })
        .then((r) => r.json())
        .then((d) => (d.ok ? (d.partida as string) : null))
        .catch(() => null);
      setTiempoTranscurridoMs(0);
      setPenalidadMs(0);
      setFase("jugando");
    }, 400);
    return () => clearTimeout(t);
  }, [fase, cuentaRegresiva, code, tablaSeleccionada]);

  // Manejo del reloj mientras se está jugando
  useEffect(() => {
    if (fase !== "jugando") {
      if (timerAnimRef.current) cancelAnimationFrame(timerAnimRef.current);
      return;
    }

    // Se redibuja cada décima (no 60 veces por segundo: celulares modestos).
    let ultimo = -1;
    const updateTimer = () => {
      const diff = Math.floor(performance.now() - tiempoInicioRef.current);
      const decima = Math.floor(diff / 100);
      if (decima !== ultimo) {
        ultimo = decima;
        setTiempoTranscurridoMs(diff);
      }
      timerAnimRef.current = requestAnimationFrame(updateTimer);
    };

    timerAnimRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (timerAnimRef.current) cancelAnimationFrame(timerAnimRef.current);
    };
  }, [fase]);

  // Iniciar partida de la tabla elegida
  function handleEmpezarTabla(t: number) {
    setTablaSeleccionada(t);
    const generados = generarPasosTabla(t);
    setPasos(generados);
    setPasoActual(0);
    setErrores(0);
    setPenalidadMs(0);
    setOpcionCorrectaPresionada(null);
    setOpcionErroneaPresionada(null);
    setResultadoFinal(null);
    setErrorEnvio(null);
    setCuentaRegresiva(3);
    setFase("cuenta_regresiva");
  }

  // Respuesta del alumno a una de las 3 opciones
  // `momento`: el timeStamp del toque (misma base que performance.now()).
  function handleElegirOpcion(opcion: number, momento: number) {
    if (fase !== "jugando" || opcionCorrectaPresionada !== null) return;

    const actual = pasos[pasoActual];
    if (!actual) return;

    if (opcion === actual.correcta) {
      // ¡Acierto!
      setOpcionCorrectaPresionada(opcion);
      setOpcionErroneaPresionada(null);

      // Si es el último paso (11: N x 10)
      if (pasoActual >= pasos.length - 1) {
        if (terminadaRef.current) return;
        terminadaRef.current = true;
        if (timerAnimRef.current) cancelAnimationFrame(timerAnimRef.current);
        const tiempoFinalMs = Math.floor(momento - tiempoInicioRef.current) + penalidadMs;
        setFase("guardando");
        void guardarPartida(tiempoFinalMs, errores);
      } else {
        // Pasar al siguiente paso sin esperar (<= 250ms)
        setTimeout(() => {
          setPasoActual((p) => p + 1);
          setOpcionCorrectaPresionada(null);
          setOpcionErroneaPresionada(null);
        }, 180);
      }
    } else {
      // Error: +3 segundos de penalidad y sacudida
      setErrores((e) => e + 1);
      setPenalidadMs((p) => p + PENALIDAD_ERROR_MS);
      setOpcionErroneaPresionada(opcion);
      setSacudir((n) => n + 1);
      setAlertaPenalidad(true);
      setTimeout(() => setAlertaPenalidad(false), 900);
    }
  }

  // Enviar partida al servidor
  async function guardarPartida(msTotal: number, totalErrores: number) {
    try {
      const res = await fetch("/api/torneo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          partida: (await partidaRef.current) ?? undefined,
          tabla: tablaSeleccionada,
          ms: msTotal,
          errores: totalErrores,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorEnvio(data.error || "No se pudo registrar la partida.");
        // Mostramos cómo le fue, pero sin decir que se guardó.
        setResultadoFinal({
          ms: msTotal,
          errores: totalErrores,
          medalla: calcularMedalla(tablaSeleccionada, msTotal),
          monedasGanadas: 0,
          mejorMs: msTotal,
          esMejorTiempo: false,
        });
      } else {
        setResultadoFinal({
          ms: data.ms,
          errores: data.errores,
          medalla: data.medalla,
          monedasGanadas: data.monedasGanadas,
          mejorMs: data.mejorMs,
          esMejorTiempo: data.esMejorTiempo,
          vueltaCompleta: data.vueltaCompleta,
          vueltaTablasHechas: data.vueltaTablasHechas,
        });
        // Ya jugó esta semana: puede que ahora pueda elegir el préstamo.
        fetch(`/api/torneo?code=${encodeURIComponent(code)}&tabla=${tablaSeleccionada}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.ok) {
              setPrestamo(d.prestamo ?? null);
              setVuelta(d.vuelta ?? null);
            }
          })
          .catch(() => {});
        if (data.coins !== undefined) {
          onCoinsUpdated(data.coins);
        }
      }
    } catch {
      setErrorEnvio("No pudimos guardar la partida (¿hay internet?). Probá de nuevo.");
      setResultadoFinal({
        ms: msTotal,
        errores: totalErrores,
        medalla: calcularMedalla(tablaSeleccionada, msTotal),
        monedasGanadas: 0,
        mejorMs: msTotal,
        esMejorTiempo: false,
      });
    } finally {
      setFase("resultado");
    }
  }

  const tiempoVisibleMs = tiempoTranscurridoMs + penalidadMs;
  const segundosVisibles = (tiempoVisibleMs / 1000).toFixed(1);
  const metaActual = getMetaTabla(tablaSeleccionada);

  // --- 1. Pantalla de Selección de Tabla y Ranking ---
  if (fase === "seleccion") {
    return (
      <div className="flex flex-col gap-4 max-w-md w-full mx-auto">
        <div className="parchment-panel rounded-3xl p-5 shadow-lg flex flex-col gap-4 text-center">
          <div className="flex items-center justify-between">
            <button
              onClick={onExit}
              className="text-amber-900 font-bold text-xs bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition"
            >
              ← Volver
            </button>
            <span className="text-xs font-black text-amber-950 uppercase tracking-wider bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
              ⚡ Todos los días
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-amber-950 flex items-center justify-center gap-2">
              <span>⚡</span> Repaso de las Tablas
            </h1>
            <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
              Completá del <b>N×0 al N×10</b> en orden contra reloj. ¡Respondé rápido y sin errores: al completar las 9 tablas ganás el objeto especial del mes (dorado, plateado o de bronce).
            </p>
          </div>

          {/* Grilla de selección de tablas 2 a 10 */}
          <div>
            <p className="text-xs font-bold text-amber-950 mb-2 text-left">
              Elegí la tabla para competir:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => {
                const isSelected = tablaSeleccionada === t;
                const meta = getMetaTabla(t);
                return (
                  <button
                    key={t}
                    onClick={() => setTablaSeleccionada(t)}
                    className={`rounded-2xl p-3 border-2 transition flex flex-col items-center justify-center gap-0.5 shadow-xs ${
                      isSelected
                        ? "bg-amber-500 text-white border-amber-600 scale-102 shadow-md ring-2 ring-amber-400"
                        : "bg-white/90 text-amber-950 border-amber-200 hover:bg-amber-50"
                    }`}
                  >
                    <span className="text-lg font-black leading-tight">Tabla del {t}</span>
                    <span className="text-[10px] opacity-85 font-medium">
                      🥇 ≤ {meta.oroSegundos}s · 🥈 ≤ {meta.plataSegundos}s
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vuelta de las 9 tablas, insignia y objeto especial del mes */}
          <InfoVuelta estado={vuelta} />
          <PrestamoSixSeven code={code} estado={prestamo} onCambio={setPrestamo} />

          {/* Botón de inicio */}
          <button
            onClick={() => handleEmpezarTabla(tablaSeleccionada)}
            className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 hover:from-yellow-500 hover:to-amber-600 text-slate-950 font-black text-lg py-3.5 shadow-md active:scale-98 transition flex items-center justify-center gap-2"
          >
            <span>🚀</span> ¡Jugar Tabla del {tablaSeleccionada}!
          </button>
        </div>

        {/* Tabla de clasificación (Ranking del curso) */}
        <div className="parchment-panel rounded-3xl p-4 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
              <span>🏆</span> Top 5 del aula · Tabla del {tablaSeleccionada}
            </h2>
            <span className="text-[11px] text-amber-900/70 font-medium">Esta semana</span>
          </div>

          {loadingRanking ? (
            <p className="text-xs text-amber-900/60 py-3 text-center">Cargando posiciones...</p>
          ) : ranking.length === 0 ? (
            <p className="text-xs text-amber-900/70 py-3 text-center italic bg-amber-50/60 rounded-xl">
              ¡Aún nadie jugó esta tabla esta semana! Sé el primero en poner tu récord.
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {ranking.map((r, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white/90 border border-amber-200/80 px-3 py-2 flex items-center justify-between text-xs shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-black text-amber-950 w-5">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                    </span>
                    <span className="font-bold text-slate-900">{r.displayName}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-amber-900">{(r.mejorMs / 1000).toFixed(1)} s</span>
                    <span className="text-xs">
                      {r.medalla === "oro" ? "🥇" : r.medalla === "plata" ? "🥈" : "🥉"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 2. Cuenta Regresiva (3... 2... 1... ¡YA!) ---
  if (fase === "cuenta_regresiva") {
    return (
      <div className="parchment-panel rounded-3xl max-w-sm w-full mx-auto p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[340px]">
        <p className="text-sm font-bold text-amber-900 uppercase tracking-widest">
          Tabla del {tablaSeleccionada}
        </p>
        <p className="text-xs text-amber-950 font-medium">
          Prepará tus dedos... ¡11 cuentas seguidas!
        </p>
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-amber-600 flex items-center justify-center text-5xl font-black text-slate-950 shadow-xl animate-pulse">
          {cuentaRegresiva > 0 ? cuentaRegresiva : "¡YA!"}
        </div>
        <p className="text-xs text-amber-800/80 font-mono">
          Meta de Oro: ≤ {metaActual.oroSegundos}s
        </p>
      </div>
    );
  }

  // --- 3. Fase Jugando (Contador, Pregunta grande y 3 botones táctiles) ---
  if (fase === "jugando" || fase === "guardando") {
    const paso = pasos[pasoActual];
    if (!paso) return null;

    return (
      <div className="flex flex-col gap-4 max-w-md w-full mx-auto">
        {/* Cabecera con Reloj y Progreso de los 11 pasos */}
        <div className="parchment-panel rounded-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-md">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-900/70">
              Paso {pasoActual + 1} de {pasos.length}
            </span>
            <span className="block font-black text-sm text-amber-950">
              Tabla del {tablaSeleccionada}
            </span>
          </div>

          {/* Reloj en grande */}
          <div className="flex items-center gap-2">
            {alertaPenalidad && (
              <span className="text-xs font-black text-rose-600 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-lg animate-bounce">
                +3s ⚠️
              </span>
            )}
            <div className="rounded-xl bg-slate-900 text-amber-300 font-mono font-black text-2xl px-3.5 py-1 shadow-inner border border-slate-700 tracking-wider">
              ⏱️ {segundosVisibles}s
            </div>
          </div>
        </div>

        {/* Indicador visual de los 11 pasos */}
        <div className="grid grid-cols-11 gap-1 px-1">
          {pasos.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i < pasoActual
                  ? "bg-emerald-500"
                  : i === pasoActual
                    ? "bg-amber-500 scale-y-125 ring-2 ring-amber-300"
                    : "bg-slate-300/80"
              }`}
            />
          ))}
        </div>

        {/* Tarjeta de la cuenta grande */}
        <div className="parchment-panel rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center text-center gap-5 min-h-[300px]">
          <span className="text-xs font-black text-amber-800 uppercase tracking-widest bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
            Paso {pasoActual + 1}: {tablaSeleccionada} × {paso.multiplicador}
          </span>

          <div className="text-5xl sm:text-6xl font-black text-slate-950 font-mono tracking-tight select-none my-2">
            {tablaSeleccionada} × {paso.multiplicador} = ?
          </div>

          {/* 3 Botones Grandes de Opciones */}
          <div className="w-full flex flex-col gap-3">
            {paso.opciones.map((opcion, i) => {
              const esCorrectaPresionada = opcionCorrectaPresionada === opcion;
              const esErroneaPresionada = opcionErroneaPresionada === opcion;

              return (
                <button
                  key={`${pasoActual}-${i}-${opcionErroneaPresionada === opcion ? sacudir : 0}`}
                  disabled={opcionCorrectaPresionada !== null || fase === "guardando"}
                  onClick={(e) => handleElegirOpcion(opcion, e.timeStamp)}
                  className={`w-full py-4 sm:py-4.5 px-4 rounded-2xl font-mono font-black text-3xl border-3 shadow-md transition transform active:scale-95 flex items-center justify-center select-none ${
                    esCorrectaPresionada
                      ? "bg-emerald-500 border-emerald-600 text-white scale-102 ring-4 ring-emerald-300"
                      : esErroneaPresionada
                        ? "bg-rose-500 border-rose-700 text-white torneo-sacudir"
                        : "bg-white hover:bg-amber-50 border-amber-300 text-slate-900 active:bg-amber-100"
                  }`}
                  style={{ minHeight: "68px" }}
                >
                  {opcion}
                </button>
              );
            })}
          </div>

          {fase === "guardando" && (
            <p className="text-xs font-bold text-amber-950 animate-pulse mt-2">
              ¡Tabla completada! Registrando tu récord...
            </p>
          )}
        </div>
      </div>
    );
  }

  // --- 4. Pantalla de Resultado y Medalla ---
  if (fase === "resultado" && resultadoFinal) {
    const medalla = resultadoFinal.medalla;
    const tiempoSegundos = (resultadoFinal.ms / 1000).toFixed(1);

    return (
      <div className="parchment-panel rounded-3xl max-w-md w-full mx-auto p-6 shadow-xl flex flex-col gap-4 text-center">
        {errorEnvio && (
          <div className="rounded-xl bg-amber-100 border border-amber-300 p-2 text-xs text-amber-900">
            {errorEnvio}
          </div>
        )}

        <div>
          <span className="text-6xl block mb-2">
            {medalla === "oro" ? "🥇" : medalla === "plata" ? "🥈" : "🥉"}
          </span>
          <h1 className="text-2xl font-black text-slate-950">
            {medalla === "oro"
              ? "¡Impresionante! ¡Medalla de Oro!"
              : medalla === "plata"
                ? "¡Excelente! ¡Medalla de Plata!"
                : "¡Muy bien! ¡Tabla completada!"}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Completaste toda la <b>Tabla del {tablaSeleccionada}</b>
          </p>
        </div>

        {/* Resumen de Métricas */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3">
            <span className="block text-[11px] text-amber-800 font-bold uppercase">Tiempo final</span>
            <span className="block text-2xl font-black text-slate-950 font-mono mt-0.5">
              {tiempoSegundos} s
            </span>
            <span className="block text-[10px] text-amber-900/70 mt-1">
              {errorEnvio
                ? "Sin guardar"
                : resultadoFinal.esMejorTiempo
                  ? "⭐ ¡Tu mejor tiempo!"
                  : `Mejor: ${(resultadoFinal.mejorMs / 1000).toFixed(1)}s`}
            </span>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3">
            <span className="block text-[11px] text-amber-800 font-bold uppercase">Errores</span>
            <span className="block text-2xl font-black text-slate-950 font-mono mt-0.5">
              {resultadoFinal.errores}
            </span>
            <span className="block text-[10px] text-amber-900/70 mt-1">
              {resultadoFinal.errores > 0 ? `+${resultadoFinal.errores * 3}s penalidad` : "¡Sin errores!"}
            </span>
          </div>
        </div>

        {/* Recompensas obtenidas */}
        <div className="flex flex-col gap-2">
          {resultadoFinal.monedasGanadas > 0 ? (
            <div className="rounded-xl bg-amber-100 border border-amber-300 py-2 px-3 text-xs font-black text-amber-950 flex items-center justify-center gap-2">
              <span>🪙 +{resultadoFinal.monedasGanadas} monedas ganadas</span>
            </div>
          ) : errorEnvio ? null : (
            <div className="rounded-xl bg-amber-50 border border-amber-200 py-1.5 px-3 text-[11px] text-amber-900/80">
              Ya habías recolectado las monedas de hoy para esta tabla.
            </div>
          )}

          {resultadoFinal.vueltaCompleta && !errorEnvio ? (
            <ResultadoDeVuelta v={resultadoFinal.vueltaCompleta} />
          ) : (
            !errorEnvio &&
            resultadoFinal.vueltaTablasHechas && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 py-1.5 px-3 text-[11px] text-amber-950">
                🔁 Tu vuelta: <b>{resultadoFinal.vueltaTablasHechas.length} de 9 tablas</b>. Te faltan:{" "}
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].filter((t) => !resultadoFinal.vueltaTablasHechas!.includes(t)).join(", ")}.
              </div>
            )
          )}
          {!errorEnvio && <PrestamoSixSeven code={code} estado={prestamo} onCambio={setPrestamo} />}
        </div>

        {/* Repaso completo de la tabla (N x 0 ... N x 10) */}
        <div className="rounded-2xl bg-white border border-amber-200 p-3 text-left">
          <p className="text-[11px] font-black uppercase text-amber-950 mb-1.5 flex items-center gap-1">
            <span>📝</span> Repaso de la tabla repasada
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 font-mono text-xs text-slate-800">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => (
              <span key={k} className="bg-amber-50/60 px-2 py-0.5 rounded-md border border-amber-100">
                {tablaSeleccionada} × {k} = <b>{tablaSeleccionada * k}</b>
              </span>
            ))}
          </div>
        </div>

        {/* Botones de acción final */}
        <div className="flex flex-col gap-2 mt-1">
          <button
            onClick={() => handleEmpezarTabla(tablaSeleccionada)}
            className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-950 font-black text-base py-3 shadow active:scale-95 transition"
          >
            🔄 Reintentar para superar el tiempo
          </button>
          <button
            onClick={() => setFase("seleccion")}
            className="w-full rounded-2xl bg-white/90 hover:bg-white text-amber-950 font-bold text-sm py-2.5 border border-amber-300 transition"
          >
            ⚡ Elegir otra tabla
          </button>
          <button
            onClick={onExit}
            className="text-xs text-amber-900/70 hover:text-amber-950 underline py-1"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return null;
}
