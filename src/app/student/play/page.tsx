"use client";

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
import WorldMap from "@/components/WorldMap";
import ActivityRunner from "@/components/ActivityRunner";
import CoinBadge from "@/components/CoinBadge";
import ProfileEditor from "@/components/ProfileEditor";
import ShopModal from "@/components/ShopModal";
import AvatarDisplay from "@/components/AvatarDisplay";
import CloudsBackground from "@/components/CloudsBackground";
import Mountains from "@/components/Mountains";
import SubjectBadge from "@/components/SubjectBadge";
import WeekendBanner, { WeekendSummary } from "@/components/weekend/WeekendBanner";
import SeasonalBanner from "@/components/SeasonalBanner";
import NewsBoard from "@/components/NewsBoard";
import CompetitionBanner from "@/components/competition/CompetitionBanner";
import ClassMailbox from "@/components/ClassMailbox";
import { isBirthdayToday } from "@/lib/seasons";
import { warmUpVoices } from "@/lib/tts";
import Link from "next/link";
import MusicToggle from "@/components/MusicToggle";
import { ponerMusica, type Pista } from "@/lib/musica";
import { getCuento } from "@/lib/cuentos/catalogo";
import { TRIAL_WORLDS_PER_SUBJECT, TrialReport, getTrialDaysLeft, getTrialLengthDays } from "@/lib/openClassroomShared";
import TrialReportCard from "@/components/prueba/TrialReportCard";
import TrialRatingCard from "@/components/prueba/TrialRatingCard";

export default function StudentPlayPage() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [enabledWorldIds, setEnabledWorldIds] = useState<number[]>([]);
  const [grade, setGrade] = useState<number>(DEFAULT_GRADE);

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
      if (progressData.student?.name) setName(progressData.student.name);
      setTrialLength(getTrialLengthDays(progressData.student));
      setTrialReport(progressData.report ?? null);
      setLoading(false);
      return;
    }
    const worldsData = await worldsRes.json();
    setProgress(progressData.progress);
    setBirthday(progressData.student?.birthday);
    if (progressData.student) {
      setIsTrialStudent(progressData.student.type === "prueba");
      setTrialEndsAt(progressData.student.trialEndsAt);
    }
    setEnabledWorldIds(worldsData.config?.enabledWorldIds ?? []);
    setGrade(typeof worldsData.grade === "number" ? worldsData.grade : DEFAULT_GRADE);
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
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-12 bg-hero-night overflow-hidden min-h-screen">
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
          onExit={() => setSelectedWorld(null)}
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
            accessories={progress.avatarAccessories}
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
          />
          <button
            onClick={() => setShopOpen(true)}
            className="relative rounded-full hover:brightness-110 active:scale-95 transition"
            title="Tienda: gastá tus monedas en avatares y objetos"
          >
            <CoinBadge coins={progress.coins} />
            <span className="absolute -top-2 -right-1.5 text-base drop-shadow" aria-hidden>
              🛍️
            </span>
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
          currentNickname={progress.nickname}
          currentBackground={progress.avatarBackground}
          isBirthday={isBirthday}
          seasonalCollection={progress.seasonalCollection}
          shopCollection={progress.shopCollection}
          realName={name}
          completedWorldsCount={progress.completedWorlds.length}
          onClose={() => setEditingProfile(false)}
          onSaved={({ avatar, accessories, nickname, background }) => {
            setProgress((p) =>
              p
                ? {
                    ...p,
                    avatar,
                    avatarAccessories: accessories,
                    nickname,
                    avatarBackground: background,
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

      {weekend?.available && grade === DEFAULT_GRADE && (
        <WeekendBanner summary={weekend} onPlay={() => router.push("/student/weekend")} />
      )}

      <NewsBoard code={code} />

      {!isTrialStudent && grade === DEFAULT_GRADE && <CompetitionBanner code={code} />}

      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-6 px-4 max-w-3xl w-full mx-auto">
        {(Object.keys(SUBJECT_INFO) as WorldSubject[]).map((s) => {
          const info = SUBJECT_INFO[s];
          const active = s === subject;
          return (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`flex items-center gap-1.5 rounded-full pl-1.5 pr-3 py-1.5 text-xs sm:text-sm font-bold border-2 transition whitespace-nowrap shadow-sm ${
                active
                  ? "bg-white text-slate-900 border-amber-500"
                  : "bg-white/70 text-slate-700 border-white/60"
              }`}
            >
              <SubjectBadge subject={s} size={24} />
              {info.label}
            </button>
          );
        })}
      </div>

      <div className="relative z-10 max-w-md w-full mx-auto px-4 mb-3">
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
      </div>

      <div className="relative z-10">
        <WorldMap
          worlds={mapWorlds}
          enabledWorldIds={playableIds}
          lockedReasons={lockedReasons}
          completedWorlds={progress.completedWorlds}
          worldsPendingRetry={progress.worldsPendingReinforcementRetry}
          worldsNeedingReview={progress.worldsNeedingTeacherReview}
          classmateCounts={classmateCounts}
          mapStage={mapStage.stage}
          showFichas={!isTrialStudent}
          lockedLabel={isTrialStudent ? "Fuera de la prueba" : undefined}
          onSelectWorld={setSelectedWorld}
        />
      </div>

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
