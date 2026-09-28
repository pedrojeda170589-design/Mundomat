"use client";

// Explosión de estrellitas/confeti (solo decorativa).
const ITEMS = ["⭐", "✨", "🎉", "🌟", "💫", "🎊"];

export default function Burst({ count = 14, big = false }: { count?: number; big?: boolean }) {
  return (
    <span className="wk-burst" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const dist = (big ? 180 : 110) + (i % 3) * 25;
        return (
          <span
            key={i}
            style={
              {
                "--dx": `${Math.cos(angle) * dist}px`,
                "--dy": `${Math.sin(angle) * dist}px`,
                "--rot": `${(i % 2 ? 1 : -1) * (90 + i * 20)}deg`,
                animationDelay: `${(i % 4) * 0.05}s`,
              } as React.CSSProperties
            }
          >
            {ITEMS[i % ITEMS.length]}
          </span>
        );
      })}
    </span>
  );
}
