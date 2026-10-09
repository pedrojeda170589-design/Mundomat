"use client";

import { DESAFIOS, gradoPermitido, usarEventosConfig } from "@/lib/eventos/config";
import HeroFondo from "@/components/HeroFondo";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WORLDS, getMapStage } from "@/lib/worlds";
import { DEFAULT_GRADE, getGrade, missingPrerequisite, themeForGrade } from "@/lib/grades";
import Seashore from "@/components/Seashore";
import Forest from "@/components/Forest";
import { grade1HasContent } from "@/lib/grade1/content";
import { practiceZonesFor } from "@/lib/grade1/practice";
import { WorldDef, StudentProgress, WorldSubject, SUBJECT_INFO } from "@/types";
import { getMedalTier, MEDAL_INFO } from "@/lib/medals";
import { esSemanaDeDictado, getMundoDictado } from "@/lib/dictado/banco";
import WorldMap from "@/components/WorldMap";
import { EliminarCuenta, QuePasaA30Dias } from "@/components/prueba/DatosPrueba";
import { tramosDelMapa, tramoActual } from "@/lib/mapa/modulos";
import ActivityRunner from "@/components/ActivityRunner";
import CoinBadge from "@/components/CoinBadge";
import ProfileEditor from "@/components/ProfileEditor";
import ShopModal from "@/components/ShopModal";
import CaminoRacha from "@/components/CaminoRacha";
import { estadoRacha } from "@/lib/coleccion/racha";
import { ofertaVigente } from "@/lib/tiempo-limitado";
import AvatarDisplay from "@/components/AvatarDisplay";
import { capasDe } from "@/lib/avatarCapas";
import InsigniaTorneo from "@/components/InsigniaTorneo";
import { torneoHabilitado } from "@/lib/torneo/tiempos";
import CloudsBackground from "@/components/CloudsBackground";
import Mountains from "@/components/Mountains";
import SubjectBadge from "@/components/SubjectBadge";
import WeekendBanner, { WeekendSummary } from "@/components/weekend/WeekendBanner";
import SeasonalBanner from "@/components/SeasonalBanner";
import NewsBoard from "@/components/NewsBoard";
import CompetitionBanner from "@/components/competition/CompetitionBanner";
import ClassMailbox from "@/components/ClassMailbox";
import { getSeasonalEventById, isBirthdayToday } from "@/lib/seasons";
import { warmUpVoices } from "@/lib/tts";
import Link from "next/link";
import MusicToggle from "@/components/MusicToggle";
import { ponerMusica, type Pista } from "@/lib/musica";
import { getCuento } from "@/lib/cuentos/catalogo";
import { TRIAL_WORLDS_PER_SUBJECT, TrialReport, getTrialDaysLeft, getTrialLengthDays } from "@/lib/openClassroomShared";
import TrialReportCard from "@/components/prueba/TrialReportCard";
import TrialRatingCard from "@/components/prueba/TrialRatingCard";
import MonteLeonCard from "@/components/monte-leon/MonteLeonCard";
import MonteLeonModal from "@/components/monte-leon/MonteLeonModal";
import BuenViajeDialog from "@/components/monte-leon/BuenViajeDialog";
import { debeMostrarMonteLeon, debeMostrarBuenViaje } from "@/lib/monteLeon/fechas";
import { esPorSuperar, porSuperarPorMateria } from "@/lib/mapa/porSuperar";

export default function StudentPlayPage() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [enabledWorldIds, setEnabledWorldIds] = useState<number[]>([]);
  const [grade, setGrade] = useState<number>(DEFAULT_GRADE);
  const [repasoTablas, setRepasoTablas] = useState(false);

  const [selectedWorld, setSelectedWorld] = useState<WorldDef | null>(null);

  // Música de fondo: la del mapa según el ambiente del grado; en los mundos de
  // comprensión, la del género del texto (cuento, leyenda o fábula).
  useEffect(() => {
    const genero = selectedWorld?.storyId ? getCuento(selectedWorld.storyId)?.genre : undefined;
    const mapa: Record<string, Pista> = { costa: "mapa-costa", bosque: "mapa-bosque", meseta: "mapa-meseta" };
    ponerMusica(genero ?? mapa[themeForGrade(grade).id] ?? "mapa-meseta");
  }, [selectedWorld, grade]);
  useEffect(() => () => ponerMusica(null), []);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState<WorldSubject>("matematica");
  const [birthday, setBirthday] = useState<string | undefined>(undefined);
  const [classmateCounts, setClassmateCounts] = useState<Record<number, number>>({});
  const [editingProfile, setEditingProfile] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [caminoOpen, setCaminoOpen] = useState(false);
  const [monteLeonOpen, setMonteLeonOpen] = useState(false);
  // Aviso de lo que está por tiempo limitado en la tienda (se calcula una vez).
  const [oferta, setOferta] = useState(() => ofertaVigente());
  const [weekend, setWeekend] = useState<WeekendSummary | null>(null);
  const [isTrialStudent, setIsTrialStudent] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | undefined>(undefined);
  const [trialLength, setTrialLength] = useState(30);
  const [trialReport, setTrialReport] = useState<TrialReport | null>(null);
  const [trialExpired, setTrialExpired] = useState(false);
  const [showEarlyRating, setShowEarlyRating] = useState(false);

  const refresh = useCallback(async (studentCode: string) => {
    setLoading(true);
    const [progressRes, worldsRes, challengeRes] = await Promise.all([
      fetch(`/api/progress?code=${encodeURIComponent(studentCode)}&lite=1`),
      fetch(`/api/worlds?code=${encodeURIComponent(studentCode)}`),
      fetch(`/api/weekend?code=${encodeURIComponent(studentCode)}`),
    ]);
    const progressData = await progressRes.json();
    if (progressRes.status === 403 && progressData.trialExpired) {
      setTrialExpired(true);
      if (progressData.student?.name) {
        setName(progressData.student.name);
        try {
          sessionStorage.setItem("mundomat_name", progressData.student.name);
        } catch {}
      }
      setTrialLength(getTrialLengthDays(progressData.student));
      setTrialReport(progressData.report ?? null);
      setLoading(false);
      return;
    }
    const worldsData = await worldsRes.json();
    // Desafíos y eventos configurados en el panel (fechas, días y grados).
    usarEventosConfig(worldsData.eventos);
    setOferta(ofertaVigente());
    setProgress(progressData.progress);
    setBirthday(progressData.student?.birthday);
    if (progressData.student) {
      setIsTrialStudent(progressData.student.type === "prueba");
      setTrialEndsAt(progressData.student.trialEndsAt);
    }
    setEnabledWorldIds(worldsData.config?.enabledWorldIds ?? []);
    setGrade(typeof worldsData.grade === "number" ? worldsData.grade : DEFAULT_GRADE);
    // Repaso de las tablas: actividad especial de todos los días (desde 3.º, de julio en adelante).
    setRepasoTablas(torneoHabilitado(typeof worldsData.grade === "number" ? worldsData.grade : DEFAULT_GRADE));
    if (challengeRes.ok) {
      setWeekend(await challengeRes.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    warmUpVoices();
    const storedCode = sessionStorage.getItem("mundomat_code");
    const storedName = sessionStorage.getItem("mundomat_name");
    if (!storedCode) {
      router.replace("/student");
      return;
    }
    // Sincroniza el estado con sessionStorage (API externa al render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(storedCode);
    setName(storedName || "");
    void refresh(storedCode);
  }, [router, refresh]);

  // Cuántos compañeros de clase están actualmente en cada mundo de la
  // materia elegida, para el Mapa de Mundos. Se vuelve a pedir cada vez que
  // el alumno cambia de materia (no expone quiénes son, solo un conteo).
  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    fetch(
      `/api/worlds/classmates?code=${encodeURIComponent(code)}&subject=${subject}`
    )
      .then((res) => (res.ok ? res.json() : { counts: {} }))
      .then((data) => {
        if (!cancelled) setClassmateCounts(data.counts ?? {});
      })
      .catch(() => {
        if (!cancelled) setClassmateCounts({});
      });
    return () => {
      cancelled = true;
    };
  }, [code, subject]);

  function handleLogout() {
    sessionStorage.removeItem("mundomat_code");
    sessionStorage.removeItem("mundomat_name");
    router.replace("/student");
  }

  if (trialExpired) {
    return (
      <main className="hero-contenido relative flex-1 flex flex-col items-center justify-center px-6 py-12 bg-slate-900 overflow-hidden min-h-screen">
      <HeroFondo period="night" />
        <div className="relative z-10 w-full max-w-md mx-auto flex flex-col gap-4">
          <div className="parchment-panel rounded-2xl p-6 sm:p-8 flex flex-col gap-4 text-center shadow-xl border-2 border-amber-600/40">
            <span className="text-4xl">🌅</span>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950">
              ¡Gracias por probar MundoTest26!
            </h2>
            <p className="text-sm text-amber-900 leading-relaxed">
              Hola, <strong>{name}</strong>. {trialReport?.endedReason === "mundos"
                ? "¡Completaste todos los mundos de la prueba!"
                : `Tu período de prueba de ${trialLength} días terminó.`}{" "}
              Esperamos que te haya gustado explorar los mundos y jugar.
            </p>

            {trialReport && <TrialReportCard report={trialReport} />}

            <div className="print:hidden">
              <TrialRatingCard studentCode={code || ""} />
            </div>

            <div className="print:hidden text-left flex flex-col gap-2">
              <QuePasaA30Dias claro />
              {code && <EliminarCuenta code={code} claro />}
            </div>

            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="text-xs text-amber-900/80 underline font-semibold hover:text-amber-950"
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          <div className="text-center mt-2">
            <Link
              href="/"
              className="text-slate-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] text-sm underline hover:text-white"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (loading || !progress || !code) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-slate-400">Cargando...</p>
      </main>
    );
  }
  // Racha de estudio (botón 🔥 y camino de premios).
  const racha = estadoRacha(progress);


  if (selectedWorld) {
    return (
      <main className="flex-1 flex flex-col bg-explorer-night">
        <ActivityRunner
          world={selectedWorld}
          studentCode={code}
          coins={progress.coins}
          onCoinsChange={(coins) =>
            setProgress((p) => (p ? { ...p, coins } : p))
          }
          onExit={() => {
            setSelectedWorld(null);
            // Para que el mapa muestre «Seguí 3/10» en el mundo que dejó
            // (sin pantalla de carga; espera un momento a que se guarde la
            // última respuesta).
            setTimeout(() => {
              void fetch(`/api/progress?code=${encodeURIComponent(code)}&lite=1`)
                .then((r) => (r.ok ? r.json() : null))
                .then((d) => d?.progress && setProgress(d.progress))
                .catch(() => undefined);
            }, 800);
          }}
          onWorldCompleted={() => {
            setSelectedWorld(null);
            void refresh(code);
          }}
        />
        <MusicToggle />
      </main>
    );
  }

  const isBirthday = isBirthdayToday(birthday);
  // Mundos del grado del alumno (3.º: los de siempre; 1.º: su catálogo,
  // con prerrequisitos y zonas de práctica automáticas).
  const gradeWorlds = grade === DEFAULT_GRADE ? WORLDS : getGrade(grade).worlds.filter((w) => grade !== 1 || grade1HasContent(w));
  const mapStage = getMapStage(progress.completedWorlds, gradeWorlds);
  const lockedReasons: Record<number, string> = {};
  let mapWorlds = gradeWorlds.filter((w) => w.subject === subject);
  let playableIds = enabledWorldIds;
  if (grade !== DEFAULT_GRADE) {
    const zones = practiceZonesFor(progress, subject, grade);
    playableIds = enabledWorldIds.filter((id) => {
      const w = gradeWorlds.find((x) => x.id === id);
      const missing = w ? missingPrerequisite(w, progress, enabledWorldIds) : null;
      if (missing) lockedReasons[id] = missing;
      return !missing;
    });
    playableIds = [...playableIds, ...zones.map((z) => z.id)];
    mapWorlds = [...zones, ...mapWorlds];
  }
  // Mundo del Dictado (2.º y 3.º grado): aparece en Lengua y Matemática
  if ((grade === 2 || grade === 3) && (subject === "lengua" || subject === "matematica")) {
    const dictWorld = getMundoDictado(grade);
    const activa = esSemanaDeDictado(new Date(), grade);
    if (activa) {
      playableIds = [dictWorld.id, ...playableIds];
    } else {
      lockedReasons[dictWorld.id] = "Vuelve el lunes de la semana que viene";
    }
    mapWorlds = [dictWorld, ...mapWorlds];
  }
  // Materias con mundos por superar (para marcar las pestañas, sin contar cuántos).
  const pendientesPorMateria = porSuperarPorMateria(gradeWorlds, playableIds, progress.completedWorlds);
  const pendientesAca = mapWorlds.some((w) => esPorSuperar(w, playableIds, progress.completedWorlds));
  // ¿Hay algún mundo habilitado en esta materia? (Si el docente no habilitó
  // ninguno, no se muestra el aviso.)
  const habilitadosAca = mapWorlds.some(
    (w) => playableIds.includes(w.id) && w.kind !== "dictado" && w.kind !== "refuerzo"
  );
  // Módulos de contenido: cada uno con su paisaje de Santa Cruz.
  const tramos = tramosDelMapa(grade, subject, mapWorlds);
  const tramoHoy = tramoActual(tramos, mapWorlds, progress.completedWorlds);
  const pctTramo = tramoHoy
    ? Math.round(
        (mapWorlds.slice(tramoHoy.desde, tramoHoy.hasta + 1).filter((w) => progress.completedWorlds.includes(w.id)).length /
          (tramoHoy.hasta - tramoHoy.desde + 1)) *
          100
      )
    : 0;
  const medal = getMedalTier(progress.completedWorlds.length);
  const medalInfo = MEDAL_INFO[medal];

  const sceneryType = themeForGrade(grade).scenery;

  return (
    <main className={`relative flex-1 flex flex-col ${themeForGrade(grade).dayBg} py-8 overflow-hidden`}>
      <MusicToggle />
      <CloudsBackground />
      {sceneryType === "seashore" ? <Seashore isDay /> : sceneryType === "forest" ? <Forest isDay /> : <Mountains isDay />}

      {isTrialStudent && trialEndsAt && (
        <div className="relative z-10 max-w-3xl w-full mx-auto px-4 mb-2">
        <div className="flex items-center justify-between bg-amber-950/70 border border-amber-500/40 text-amber-100 rounded-xl px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span>⏳</span>
            <span>
              Prueba: {getTrialDaysLeft(trialEndsAt) <= 1 ? "último día" : `te quedan ${getTrialDaysLeft(trialEndsAt)} días`}
              {" · "}
              {SUBJECT_INFO[subject].label}:{" "}
              {progress.completedWorlds.filter((id) => WORLDS.find((w) => w.id === id)?.subject === subject).length}/
              {TRIAL_WORLDS_PER_SUBJECT} mundos
            </span>
          </div>
          {getTrialDaysLeft(trialEndsAt) <= 3 && (
            <button
              onClick={() => setShowEarlyRating(true)}
              className="text-yellow-300 hover:text-white underline text-xs font-bold"
            >
              ⭐ Dejar opinión
            </button>
          )}
        </div>
        <details className="mt-1.5 rounded-xl bg-slate-900/70 border border-sky-400/40 text-sky-50 px-3 py-1.5 text-xs">
          <summary className="cursor-pointer font-bold">🔒 Tus datos y qué pasa a los 30 días</summary>
          <div className="mt-2 flex flex-col gap-2">
            <QuePasaA30Dias />
            <p>
              Ver <Link href="/terminos" target="_blank" className="underline">Términos</Link> y{" "}
              <Link href="/privacidad" target="_blank" className="underline">Política de privacidad</Link>.
            </p>
            <EliminarCuenta code={code} />
          </div>
        </details>
        </div>
      )}

      <div className="wood-panel-light relative z-10 flex items-center justify-between max-w-3xl w-full mx-auto px-4 py-2.5 mb-6 rounded-2xl">
        <button
          onClick={() => setEditingProfile(true)}
          className="flex items-center gap-2 text-left"
          title="Editar mi perfil"
        >
          <span className="relative shrink-0">
            <AvatarDisplay
              character={progress.avatar}
              capas={capasDe(progress)}
              className="w-12 h-12 rounded-2xl border-2 border-amber-300/70 shrink-0 bg-black/10"
              alt="Mi avatar"
              imageSizes="48px"
              background={progress.avatarBackground}
              birthday={isBirthday}
            />
            {isBirthday && (
              <span
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-pink-400 flex items-center justify-center text-sm shadow animate-bounce"
                title="¡Hoy es tu cumpleaños!"
              >
                🎂
              </span>
            )}
            {!!progress.torneoVueltas && !progress.insigniaTorneoOculta && (
              <InsigniaTorneo vueltas={progress.torneoVueltas} className="absolute -bottom-1.5 -left-1.5 min-w-6 h-6 px-1 text-[9px]" />
            )}
          </span>
          <span>
            <span className="block text-amber-100 text-sm">
              {isBirthday ? "¡Feliz cumpleaños," : "¡Hola,"}
            </span>
            <span className="block text-white font-bold text-lg -mt-1">
              {progress.nickname || name}! {isBirthday ? "🎂" : "👋"}{" "}
              <span className="text-xs">✏️</span>
            </span>
          </span>
        </button>
        <div className="flex items-center gap-3">
          {!!weekend?.streak && (
            <div
              className="flex items-center gap-1 rounded-full px-3 py-1.5 border border-amber-300/60 bg-black/15 text-amber-200 text-sm font-bold"
              title="Racha de fines de semana en el Desafío Especial"
            >
              <span>🔥</span>
              {weekend.streak}
            </div>
          )}
          <ClassMailbox
            code={code}
            coins={progress.coins}
            onCoinsChange={(coins) => setProgress((p) => (p ? { ...p, coins } : p))}
            onColeccionCambio={() =>
              void fetch(`/api/progress?code=${encodeURIComponent(code)}&lite=1`)
                .then((r) => (r.ok ? r.json() : null))
                .then((d) => d?.progress && setProgress(d.progress))
                .catch(() => {})
            }
          />
          <button
            onClick={() => setCaminoOpen(true)}
            className={`shrink-0 whitespace-nowrap rounded-full border-2 px-2 py-0.5 text-xs font-black shadow active:scale-95 ${
              racha.hoyCuenta ? "border-orange-300 bg-orange-500 text-white" : "border-orange-300/60 bg-black/20 text-orange-200"
            }`}
            title="Racha de estudio y camino de premios"
          >
            🔥 {racha.racha}
          </button>
          <button
            onClick={() => setShopOpen(true)}
            className="relative rounded-full hover:brightness-110 active:scale-95 transition"
            title="Tienda: gastá tus monedas en avatares y objetos"
          >
            <CoinBadge coins={progress.coins} />
            <span className="absolute -top-2 -right-1.5 text-base drop-shadow" aria-hidden>
              🛍️
            </span>
            {oferta && (
              <span
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-1.5 text-[10px] font-black text-white shadow ${
                  oferta.dias <= 3 ? "border-red-200 bg-red-500 animate-pulse" : "border-orange-200 bg-orange-500"
                }`}
                title="Hay avatares y objetos por tiempo limitado en la tienda"
              >
                ⏳{getSeasonalEventById(oferta.eventId)?.emoji} {oferta.dias <= 1 ? "¡último día!" : `${oferta.dias} días`}
              </span>
            )}
          </button>

          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border bg-black/15 text-sm font-bold"
            style={{
              borderColor: medalInfo.color,
              color: medalInfo.color,
            }}
          >
            <span>{medalInfo.emoji}</span>
            {medalInfo.label}
          </div>
        </div>
      </div>

      {caminoOpen && <CaminoRacha progress={progress} grade={grade} onClose={() => setCaminoOpen(false)} />}
      {shopOpen && (
        <ShopModal
          code={code}
          progress={progress}
          onClose={() => setShopOpen(false)}
          onProgress={(p) => setProgress((prev) => (prev ? { ...prev, ...p } : p))}
        />
      )}

      {showEarlyRating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md">
            <TrialRatingCard
              studentCode={code}
              onSubmitted={() => setShowEarlyRating(false)}
            />
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => setShowEarlyRating(false)}
                className="text-white text-xs underline font-semibold hover:text-amber-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {editingProfile && (
        <ProfileEditor
          code={code}
          currentAvatar={progress.avatar}
          currentAccessories={progress.avatarAccessories}
          currentTweaks={progress.avatarTweaks}
          currentCapas={progress.avatarCapas}
          currentNickname={progress.nickname}
          currentBackground={progress.avatarBackground}
          isBirthday={isBirthday}
          seasonalCollection={progress.seasonalCollection}
          shopCollection={progress.shopCollection}
          achievementCollection={progress.achievementCollection}
          realName={name}
          completedWorldsCount={progress.completedWorlds.length}
          torneoVueltas={progress.torneoVueltas}
          insigniaOculta={progress.insigniaTorneoOculta}
          torneoPrestados={progress.torneoPrestados}
          prestamo={progress.prestamo67}
          onClose={() => setEditingProfile(false)}
          onSaved={({ avatar, accessories, capas, nickname, background, tweaks, insigniaOculta }) => {
            setProgress((p) =>
              p
                ? {
                    ...p,
                    avatar,
                    avatarAccessories: accessories,
                    avatarCapas: capas,
                    nickname,
                    avatarBackground: background,
                    avatarTweaks: tweaks,
                    insigniaTorneoOculta: insigniaOculta,
                  }
                : p
            );
            setEditingProfile(false);
          }}
        />
      )}

      <SeasonalBanner
        seasonalCollection={progress.seasonalCollection}
        birthday={isBirthday}
        onOpenProfile={() => setEditingProfile(true)}
      />

      {weekend?.available && (
        <WeekendBanner summary={weekend} onPlay={() => router.push("/student/weekend")} />
      )}

      {repasoTablas && (
        <div className="relative z-10 max-w-3xl w-full mx-auto px-4 mb-4">
          <button
            onClick={() => router.push("/student/tablas")}
            className="w-full parchment-panel rounded-2xl p-3.5 flex items-center justify-between gap-3 border-2 border-amber-400 bg-gradient-to-r from-amber-100/90 via-yellow-50 to-amber-100/90 shadow-md text-left"
          >
            <span className="flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <span>
                <span className="block font-black text-amber-950 text-sm">Repaso de las tablas · actividad especial de todos los días</span>
                <span className="block text-xs text-amber-900/80">
                  Completá las 9 tablas: objeto del mes dorado, plateado o de bronce e insignia (×2, ×3… A1).
                </span>
              </span>
            </span>
            <span className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs px-3.5 py-2 shrink-0">🚀 ¡Jugar!</span>
          </button>
        </div>
      )}

      {debeMostrarMonteLeon({ grade, classroomId: isTrialStudent ? "abierta-3" : undefined }) && (
        <MonteLeonCard
          progress={progress}
          onClick={() => setMonteLeonOpen(true)}
        />
      )}

      {debeMostrarBuenViaje({ grade, classroomId: isTrialStudent ? "abierta-3" : undefined }) && code && progress && (
        <BuenViajeDialog
          studentCode={code}
          progress={progress}
          onProgressUpdated={(p) => setProgress((prev) => (prev ? { ...prev, ...p } : p))}
        />
      )}

      {monteLeonOpen && code && progress && (
        <MonteLeonModal
          studentCode={code}
          progress={progress}
          onClose={() => setMonteLeonOpen(false)}
          onProgressUpdated={(p) => setProgress((prev) => (prev ? { ...prev, ...p } : p))}
          onOpenProfile={() => setEditingProfile(true)}
        />
      )}

      <NewsBoard code={code} />

      {!isTrialStudent && gradoPermitido(DESAFIOS.competencia.id, grade, [...DESAFIOS.competencia.grados]) && <CompetitionBanner code={code} />}

      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-6 px-4 max-w-3xl w-full mx-auto">
        {(Object.keys(SUBJECT_INFO) as WorldSubject[]).map((s) => {
          const info = SUBJECT_INFO[s];
          const active = s === subject;
          const pendientes = pendientesPorMateria[s] ?? 0;
          return (
            <button
              key={s}
              onClick={() => setSubject(s)}
              aria-label={`${info.label}${pendientes ? ": hay actividades nuevas" : ""}`}
              className={`relative flex items-center gap-1.5 rounded-full pl-1.5 pr-3 py-1.5 text-xs sm:text-sm font-bold border-2 transition whitespace-nowrap shadow-sm ${
                active
                  ? "bg-white text-slate-900 border-amber-500"
                  : "bg-white/70 text-slate-700 border-white/60"
              }`}
            >
              <SubjectBadge subject={s} size={24} />
              {info.label}
              {pendientes > 0 && (
                <span
                  className="absolute -top-2.5 -right-2 rounded-full bg-rose-500 border-2 border-white px-1.5 py-px text-[10px] font-black text-white shadow"
                  title="Hay actividades nuevas"
                >
                  ✨ ¡Nuevo!
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative z-10 max-w-md w-full mx-auto px-4 mb-3">
        {tramoHoy ? (
          <div className="parchment-panel rounded-xl px-3 py-2 flex items-center gap-2 text-xs" title="Al pasar de módulo, cambia el paisaje del mapa">
            <span className="text-base">📍</span>
            <span className="flex-1">
              <span className="font-black">
                Módulo {tramoHoy.numero} de {tramos.length}: {tramoHoy.modulo.titulo}
              </span>{" "}
              · {tramoHoy.lugar.nombre} ({tramoHoy.lugar.localidad})
              <span className="mt-1 block h-1.5 rounded-full bg-amber-900/15 overflow-hidden">
                <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${pctTramo}%` }} />
              </span>
            </span>
            <span className="font-black">{pctTramo}%</span>
          </div>
        ) : (
        <div
          className="parchment-panel rounded-xl px-3 py-2 flex items-center gap-2 text-xs"
          title="El paisaje cambia cuando avanzás en las 4 áreas"
        >
          <span className="text-base">🗺️</span>
          <span className="flex-1">
            <span className="font-black">Paisaje etapa {mapStage.stage} de 4</span> · crece cuando
            avanzás en las 4 áreas
            <span className="mt-1 block h-1.5 rounded-full bg-amber-900/15 overflow-hidden">
              <span
                className="block h-full rounded-full bg-emerald-500"
                style={{ width: `${mapStage.percent}%` }}
              />
            </span>
          </span>
          <span className="font-black">{mapStage.percent}%</span>
        </div>
        )}
      </div>

      {habilitadosAca && (
      <div className="relative z-10 max-w-md w-full mx-auto px-4 mb-3">
        <p
          className={`rounded-xl px-3 py-2 text-xs font-black text-center border-2 shadow-sm ${
            pendientesAca
              ? "bg-yellow-100 border-amber-400 text-amber-950"
              : "bg-emerald-50 border-emerald-400 text-emerald-900"
          }`}
        >
          {pendientesAca
            ? `✨ ¡Hay actividades nuevas en ${SUBJECT_INFO[subject].label}! Buscá los mundos que brillan en el mapa.`
            : `🏆 ¡Superaste todos los mundos habilitados de ${SUBJECT_INFO[subject].label}!`}
        </p>
      </div>
      )}

      <div className="relative z-10">
        <WorldMap
          worlds={mapWorlds}
          enabledWorldIds={playableIds}
          lockedReasons={lockedReasons}
          completedWorlds={progress.completedWorlds}
          worldsPendingRetry={progress.worldsPendingReinforcementRetry}
          worldsNeedingReview={progress.worldsNeedingTeacherReview}
          inProgress={progress.roundsResume}
          classmateCounts={classmateCounts}
          mapStage={mapStage.stage}
          tramos={tramos}
          showFichas={!isTrialStudent}
          lockedLabel={isTrialStudent ? "Fuera de la prueba" : undefined}
          onSelectWorld={setSelectedWorld}
        />
      </div>

      {grade >= 2 && (
        <div className="relative z-10 text-center mt-6">
          <a
            href="/tabla-pitagorica"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full bg-white/90 border-2 border-indigo-300 px-4 py-2 text-sm font-black text-indigo-800 shadow"
          >
            📥 Mi tabla pitagórica para imprimir
          </a>
        </div>
      )}
      <div className="relative z-10 text-center mt-8">
        <button
          onClick={handleLogout}
          className="text-slate-700 text-sm underline"
        >
          Salir
        </button>
      </div>
    </main>
  );
}
