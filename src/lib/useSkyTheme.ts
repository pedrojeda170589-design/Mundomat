"use client";

import { useEffect, useState } from "react";
import {
  DayPeriod,
  MoonPhaseInfo,
  Season,
  getDayPeriod,
  getMoonPhase,
  getSeason,
} from "./skyTheme";

// Recalcula la ambientación (día/noche, fase lunar, estación) al montar y
// cada 5 minutos, para que quede al día si alguien deja la portada abierta.
export function useSkyTheme() {
  const [period, setPeriod] = useState<DayPeriod>("night");
  const [season, setSeason] = useState<Season>("verano");
  const [moon, setMoon] = useState<MoonPhaseInfo>(() => getMoonPhase());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function update() {
      const now = new Date();
      setPeriod(getDayPeriod(now));
      setSeason(getSeason(now));
      setMoon(getMoonPhase(now));
      setReady(true);
    }
    update();
    const id = setInterval(update, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return { period, season, moon, ready };
}
