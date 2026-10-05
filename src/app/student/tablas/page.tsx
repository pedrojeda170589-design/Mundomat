"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CloudsBackground from "@/components/CloudsBackground";
import CoinBadge from "@/components/CoinBadge";
import Profe from "@/components/Profe";
import TorneoTablasGame from "@/components/weekend/TorneoTablasGame";

// Repaso de las tablas: actividad especial de TODOS los días (pedido de
// Pedro, 5/10/2026). Desde 3.º grado y de julio en adelante.
export default function RepasoTablasPage() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [coins, setCoins] = useState<number | null>(null);
  const [disponible, setDisponible] = useState<boolean | null>(null);

  useEffect(() => {
    const c = sessionStorage.getItem("mundomat_code");
    if (!c) {
      router.replace("/student");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(c);
    void Promise.all([
      fetch(`/api/torneo?code=${encodeURIComponent(c)}&tabla=2`).then((r) => r.json()),
      fetch(`/api/progress?code=${encodeURIComponent(c)}&lite=1`).then((r) => r.json()),
    ])
      .then(([t, p]) => {
        setDisponible(!!t.available);
        setCoins(p.progress?.coins ?? 0);
      })
      .catch(() => setDisponible(false));
  }, [router]);

  return (
    <main className="relative flex-1 flex flex-col bg-explorer-day py-8 px-4 overflow-hidden">
      <CloudsBackground />
      <div className="wood-panel-light relative z-10 flex items-center justify-between gap-3 max-w-3xl w-full mx-auto px-4 py-2.5 mb-5 rounded-2xl">
        <button onClick={() => router.push("/student/play")} className="text-amber-100 font-bold text-sm shrink-0">
          ← Volver
        </button>
        <span className="text-white font-black text-sm sm:text-lg text-center leading-tight">⚡ Repaso de las tablas</span>
        {coins !== null ? <CoinBadge coins={coins} /> : <span />}
      </div>
      {disponible === null || !code ? (
        <p className="relative z-10 text-center text-slate-600">Cargando…</p>
      ) : !disponible ? (
        <div className="relative z-10 parchment-panel rounded-3xl max-w-md mx-auto p-6 text-center">
          <div className="flex justify-center mb-2">
            <Profe pose="reloj" className="w-20 h-28" />
          </div>
          <p className="font-black text-xl">El repaso de las tablas empieza en julio de 3.º grado</p>
          <p className="text-sm opacity-80 mt-2">Mientras tanto, seguí practicando en tus mundos.</p>
        </div>
      ) : (
        <TorneoTablasGame code={code} onExit={() => router.push("/student/play")} onCoinsUpdated={setCoins} currentCoins={coins ?? 0} />
      )}
    </main>
  );
}
