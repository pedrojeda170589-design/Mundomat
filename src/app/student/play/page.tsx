"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WORLDS } from "@/lib/worlds";
import { WorldDef, StudentProgress, WorldSubject, SUBJECT_INFO } from "@/types";
import { getMedalTier, MEDAL_INFO } from "@/lib/medals";
import WorldMap from "@/components/WorldMap";
import ActivityRunner from "@/components/ActivityRunner";
import CoinBadge from "@/components/CoinBadge";
import ProfileEditor from "@/components/ProfileEditor";
import CloudsBackground from "@/components/CloudsBackground";
import SpecialChallengeBanner from "@/components/SpecialChallengeBanner";
import SpecialChallengeModal from "@/components/SpecialChallengeModal";
import { MemoryPair } from "@/lib/specialChallenge";
import { warmUpVoices } from "@/lib/tts";

interface SpecialChallengeState {
  available: boolean;
  subject: WorldSubject;
  pairs: MemoryPair[];
  coinsReward: number;
  streak: number;
  previewStreak: number;
}

export default function StudentPlayPage() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [enabledWorldIds, setEnabledWorldIds] = useState<number[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<WorldDef | null>(null);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState<WorldSubject>("matematica");
  const [editingProfile, setEditingProfile] = useState(false);
  const [specialChallenge, setSpecialChallenge] =
    useState<SpecialChallengeState | null>(null);
  const [playingChallenge, setPlayingChallenge] = useState(false);

  const refresh = useCallback(async (studentCode: string) => {
    setLoading(true);
    const [progressRes, worldsRes, challengeRes] = await Promise.all([
      fetch(`/api/progress?code=${encodeURIComponent(studentCode)}`),
      fetch("/api/worlds"),
      fetch(`/api/special-challenge?code=${encodeURIComponent(studentCode)}`),
    ]);
    const progressData = await progressRes.json();
    const worldsData = await worldsRes.json();
    setProgress(progressData.progress);
    setEnabledWorldIds(worldsData.config.enabledWorldIds ?? []);
    if (challengeRes.ok) {
      const challengeData = await challengeRes.json();
      setSpecialChallenge(challengeData);
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
      <main className="flex-1 flex flex-col bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
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

  const medal = getMedalTier(progress.completedWorlds.length);
  const medalInfo = MEDAL_INFO[medal];

  return (
    <main className="relative flex-1 flex flex-col bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 py-8 overflow-hidden">
      <CloudsBackground />
      <div className="relative z-10 flex items-center justify-between max-w-3xl w-full mx-auto px-4 mb-6">
        <button
          onClick={() => setEditingProfile(true)}
          className="flex items-center gap-2 text-left"
          title="Editar mi perfil"
        >
          <span className="text-3xl leading-none">
            {progress.avatar || "🙂"}
          </span>
          <span>
            <span className="block text-slate-400 text-sm">¡Hola,</span>
            <span className="block text-white font-bold text-lg -mt-1">
              {progress.nickname || name}! 👋 <span className="text-xs">✏️</span>
            </span>
          </span>
        </button>
        <div className="flex items-center gap-3">
          {!!specialChallenge?.streak && (
            <div
              className="flex items-center gap-1 rounded-full px-3 py-1.5 border border-amber-400/60 text-amber-300 text-sm font-bold"
              title="Racha de fines de semana en el Desafío Especial"
            >
              <span>🔥</span>
              {specialChallenge.streak}
            </div>
          )}
          <CoinBadge coins={progress.coins} />
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-sm font-bold"
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

      {editingProfile && (
        <ProfileEditor
          code={code}
          currentAvatar={progress.avatar}
          currentNickname={progress.nickname}
          realName={name}
          onClose={() => setEditingProfile(false)}
          onSaved={({ avatar, nickname }) => {
            setProgress((p) => (p ? { ...p, avatar, nickname } : p));
            setEditingProfile(false);
          }}
        />
      )}

      {specialChallenge?.available && (
        <SpecialChallengeBanner
          subject={specialChallenge.subject}
          coinsReward={specialChallenge.coinsReward}
          streak={specialChallenge.streak}
          previewStreak={specialChallenge.previewStreak}
          onPlay={() => setPlayingChallenge(true)}
        />
      )}

      {playingChallenge && specialChallenge && (
        <SpecialChallengeModal
          code={code}
          subject={specialChallenge.subject}
          pairs={specialChallenge.pairs}
          coinsReward={specialChallenge.coinsReward}
          onClose={() => {
            setPlayingChallenge(false);
            void refresh(code);
          }}
          onCompleted={(coinsEarned, streak) => {
            setProgress((p) => (p ? { ...p, coins: p.coins + coinsEarned } : p));
            setSpecialChallenge((sc) =>
              sc ? { ...sc, available: false, streak } : sc
            );
          }}
        />
      )}

      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-6 px-4 max-w-3xl w-full mx-auto">
        {(Object.keys(SUBJECT_INFO) as WorldSubject[]).map((s) => {
          const info = SUBJECT_INFO[s];
          const active = s === subject;
          return (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:text-sm font-bold border transition whitespace-nowrap ${
                active
                  ? "bg-white text-slate-900 border-white"
                  : "bg-white/10 text-slate-300 border-white/20"
              }`}
            >
              <span>{info.emoji}</span>
              {info.label}
            </button>
          );
        })}
      </div>

      <div className="relative z-10">
        <WorldMap
          worlds={WORLDS.filter((w) => w.subject === subject)}
          enabledWorldIds={enabledWorldIds}
          completedWorlds={progress.completedWorlds}
          onSelectWorld={setSelectedWorld}
        />
      </div>

      <div className="relative z-10 text-center mt-8">
        <button
          onClick={handleLogout}
          className="text-slate-500 text-sm underline"
        >
          Salir
        </button>
      </div>
    </main>
  );
}
