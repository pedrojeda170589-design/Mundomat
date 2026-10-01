"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WORLDS, getMapStage } from "@/lib/worlds";
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


export default function StudentPlayPage() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [enabledWorldIds, setEnabledWorldIds] = useState<number[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<WorldDef | null>(null);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState<WorldSubject>("matematica");
  const [birthday, setBirthday] = useState<string | undefined>(undefined);
  const [classmateCounts, setClassmateCounts] = useState<Record<number, number>>({});
  const [editingProfile, setEditingProfile] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [weekend, setWeekend] = useState<WeekendSummary | null>(null);

  const refresh = useCallback(async (studentCode: string) => {
    setLoading(true);
    const [progressRes, worldsRes, challengeRes] = await Promise.all([
      fetch(`/api/progress?code=${encodeURIComponent(studentCode)}&lite=1`),
      fetch(`/api/worlds?code=${encodeURIComponent(studentCode)}`),
      fetch(`/api/weekend?code=${encodeURIComponent(studentCode)}`),
    ]);
    const progressData = await progressRes.json();
    const worldsData = await worldsRes.json();
    setProgress(progressData.progress);
    setBirthday(progressData.student?.birthday);
    setEnabledWorldIds(worldsData.config.enabledWorldIds ?? []);
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
      </main>
    );
  }

  const isBirthday = isBirthdayToday(birthday);
  const mapStage = getMapStage(progress.completedWorlds);
  const medal = getMedalTier(progress.completedWorlds.length);
  const medalInfo = MEDAL_INFO[medal];

  return (
    <main className="relative flex-1 flex flex-col bg-explorer-day py-8 overflow-hidden">
      <CloudsBackground />
      <Mountains isDay />
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

      {weekend?.available && (
        <WeekendBanner summary={weekend} onPlay={() => router.push("/student/weekend")} />
      )}

      <NewsBoard code={code} />

      <CompetitionBanner code={code} />

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
          worlds={WORLDS.filter((w) => w.subject === subject)}
          enabledWorldIds={enabledWorldIds}
          completedWorlds={progress.completedWorlds}
          worldsPendingRetry={progress.worldsPendingReinforcementRetry}
          worldsNeedingReview={progress.worldsNeedingTeacherReview}
          classmateCounts={classmateCounts}
          mapStage={mapStage.stage}
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
