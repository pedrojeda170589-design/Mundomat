"use client";

import { useEffect, useState } from "react";

// Reloj en vivo (analógico + digital) para que los alumnos vayan
// familiarizándose con la hora "de fondo" cada vez que abren la app.

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function AnalogClock({ now, isDay }: { now: Date; isDay: boolean }) {
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;
  const strokeColor = isDay ? "#334155" : "#f8fafc";
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <svg viewBox="0 0 100 100" width="84" height="84" aria-label="Reloj analógico">
      <circle
        cx="50"
        cy="50"
        r="46"
        fill={isDay ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.06)"}
        stroke={strokeColor}
        strokeWidth="2.5"
      />
      {numbers.map((n) => {
        const angle = (n * 30 - 90) * (Math.PI / 180);
        const x = 50 + 36 * Math.cos(angle);
        const y = 50 + 36 * Math.sin(angle);
        return (
          <text
            key={n}
            x={x}
            y={y + 3}
            fontSize="8"
            textAnchor="middle"
            fill={strokeColor}
            opacity={0.85}
          >
            {n}
          </text>
        );
      })}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="28"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        transform={`rotate(${hourDeg} 50 50)`}
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="18"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(${minuteDeg} 50 50)`}
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="14"
        stroke="#f87171"
        strokeWidth="1.2"
        transform={`rotate(${secondDeg} 50 50)`}
      />
      <circle cx="50" cy="50" r="2.5" fill={strokeColor} />
    </svg>
  );
}

export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Arranca el reloj recién en el cliente (evita mostrar una hora
    // "congelada" del momento en que se generó la página en el servidor).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const dayLabelRaw = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);
  const dayLabel = dayLabelRaw.charAt(0).toUpperCase() + dayLabelRaw.slice(1);

  return (
    <div className="wood-panel relative z-10 flex flex-col items-center gap-2 rounded-2xl px-5 py-3 mb-8">
      <p className="text-xs font-semibold tracking-wide text-amber-100">
        📅 {dayLabel}
      </p>
      <div className="flex items-center gap-4">
        <AnalogClock now={now} isDay={false} />
        <span className="font-mono text-3xl font-bold tabular-nums text-amber-50">
          {pad2(now.getHours())}:{pad2(now.getMinutes())}:{pad2(now.getSeconds())}
        </span>
      </div>
    </div>
  );
}
