// Logos de los eventos de la barra lateral del mapa (pedido de Pedro,
// 16/10/2026). Dibujos propios en SVG, sin imágenes de terceros: un medallón
// con borde de madera (como los carteles del mapa) y un dibujo simple adentro.

export type LogoEvento = "tablas" | "viaje" | "reserva" | "anuncios" | "memoria" | "duelos" | "fiesta";

const BORDE = "#7c4a1e";
const BORDE_CLARO = "#c08a4f";

function Medallon({ fondo, children }: { fondo: [string, string]; children: React.ReactNode }) {
  const id = `g-${fondo[0].slice(1)}-${fondo[1].slice(1)}`;
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden>
      <defs>
        <radialGradient id={id} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor={fondo[0]} />
          <stop offset="1" stopColor={fondo[1]} />
        </radialGradient>
        <clipPath id={`${id}-c`}>
          <circle cx="32" cy="32" r="26" />
        </clipPath>
      </defs>
      <circle cx="32" cy="32" r="31" fill={BORDE} />
      <circle cx="32" cy="32" r="29" fill={BORDE_CLARO} />
      <circle cx="32" cy="32" r="26.5" fill={BORDE} />
      <circle cx="32" cy="32" r="26" fill={`url(#${id})`} />
      <g clipPath={`url(#${id}-c)`}>{children}</g>
      <ellipse cx="24" cy="15" rx="12" ry="5" fill="#fff" opacity="0.18" />
    </svg>
  );
}

// Repaso de las tablas: un rayo y el signo «por».
function Tablas() {
  return (
    <Medallon fondo={["#fde68a", "#f59e0b"]}>
      <polygon points="35,8 18,35 30,35 25,56 46,26 33,26 40,8" fill="#fff7ed" stroke="#9a3412" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="46" cy="46" r="10" fill="#7c3aed" stroke="#fff" strokeWidth="2" />
      <path d="M41.5 41.5 L50.5 50.5 M50.5 41.5 L41.5 50.5" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
    </Medallon>
  );
}

// Viaje a Monte León: micro escolar por la ruta, con un pingüino.
function Viaje() {
  return (
    <Medallon fondo={["#bae6fd", "#38bdf8"]}>
      <circle cx="47" cy="17" r="6" fill="#fde047" />
      <rect x="0" y="44" width="64" height="20" fill="#a8a29e" />
      <path d="M4 52 H60" stroke="#fff" strokeWidth="1.6" strokeDasharray="5 4" />
      <rect x="9" y="26" width="34" height="18" rx="4" fill="#facc15" stroke="#854d0e" strokeWidth="2" />
      <rect x="13" y="29.5" width="7" height="6" rx="1.2" fill="#e0f2fe" />
      <rect x="22.5" y="29.5" width="7" height="6" rx="1.2" fill="#e0f2fe" />
      <rect x="32" y="29.5" width="7" height="6" rx="1.2" fill="#e0f2fe" />
      <circle cx="17" cy="45" r="3.6" fill="#1f2937" />
      <circle cx="35" cy="45" r="3.6" fill="#1f2937" />
      <ellipse cx="51" cy="38" rx="6" ry="8" fill="#111827" />
      <ellipse cx="51" cy="40" rx="3.8" ry="5.6" fill="#fff" />
      <circle cx="51" cy="31.5" r="4.4" fill="#111827" />
      <circle cx="52.4" cy="30.8" r="1" fill="#fff" />
      <path d="M54.5 32 L58 33 L54.5 34 Z" fill="#f97316" />
    </Medallon>
  );
}

// Reserva y expedición patagónica: cordillera nevada, lago y un árbol.
function Reserva() {
  return (
    <Medallon fondo={["#d9f99d", "#4ade80"]}>
      <rect x="0" y="0" width="64" height="34" fill="#bfdbfe" />
      <polygon points="2,42 18,16 32,40" fill="#64748b" />
      <polygon points="18,16 13,24 16,23 18,26 21,23 23,24" fill="#fff" />
      <polygon points="22,42 40,12 58,42" fill="#475569" />
      <polygon points="40,12 34,22 37.5,21 40,24.5 43,21 46,22" fill="#fff" />
      <rect x="0" y="40" width="64" height="24" fill="#65a30d" />
      <ellipse cx="38" cy="50" rx="14" ry="4.5" fill="#38bdf8" />
      <polygon points="14,54 8,54 11,45" fill="#166534" />
      <polygon points="15,49 7,49 11,39" fill="#15803d" />
      <rect x="10.2" y="54" width="1.8" height="4" fill="#78350f" />
    </Medallon>
  );
}

// Anuncios: el pizarrón de la clase con un chinche.
function Anuncios() {
  return (
    <Medallon fondo={["#fef3c7", "#fbbf24"]}>
      <rect x="10" y="16" width="44" height="32" rx="3" fill="#92400e" />
      <rect x="13" y="19" width="38" height="26" rx="2" fill="#2f5a3f" />
      <path d="M17 26 H38 M17 31.5 H44 M17 37 H33" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <circle cx="44" cy="22" r="3.4" fill="#ef4444" stroke="#fff" strokeWidth="1" />
      <rect x="26" y="48" width="12" height="3" rx="1.5" fill="#92400e" />
    </Medallon>
  );
}

// Juegos de memoria: dos cartas, una dada vuelta.
function Memoria() {
  return (
    <Medallon fondo={["#e9d5ff", "#a855f7"]}>
      <g transform="rotate(-12 24 34)">
        <rect x="12" y="18" width="22" height="30" rx="4" fill="#4c1d95" stroke="#fff" strokeWidth="2" />
        <text x="23" y="39" textAnchor="middle" fontSize="18" fontWeight="900" fill="#fde68a" fontFamily="sans-serif">?</text>
      </g>
      <g transform="rotate(10 42 34)">
        <rect x="31" y="18" width="22" height="30" rx="4" fill="#fff" stroke="#6d28d9" strokeWidth="2" />
        <polygon points="42,25 44.6,31 51,31.4 46,35.4 47.8,41.6 42,38 36.2,41.6 38,35.4 33,31.4 39.4,31" fill="#f59e0b" />
      </g>
    </Medallon>
  );
}

// Duelos con los compañeros: dos lápices cruzados y una estrella.
function Duelos() {
  const lapiz = (color: string) => (
    <>
      <rect x="-3.5" y="-20" width="7" height="30" fill={color} />
      <rect x="-3.5" y="-24" width="7" height="5" fill="#f9a8d4" />
      <polygon points="-3.5,10 3.5,10 0,18" fill="#fde68a" />
      <polygon points="-1.2,15 1.2,15 0,18" fill="#1f2937" />
    </>
  );
  return (
    <Medallon fondo={["#fecaca", "#ef4444"]}>
      <g transform="translate(32 34) rotate(40)">{lapiz("#2563eb")}</g>
      <g transform="translate(32 34) rotate(-40)">{lapiz("#16a34a")}</g>
      <polygon points="32,6 34.6,12 41,12.4 36,16.4 37.8,22.6 32,19 26.2,22.6 28,16.4 23,12.4 29.4,12" fill="#fde047" stroke="#b45309" strokeWidth="1" />
    </Medallon>
  );
}

// Fiestas y temporadas: banderines y el dibujo de la fiesta en el medio.
function Fiesta({ emoji }: { emoji?: string }) {
  const colores = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];
  return (
    <Medallon fondo={["#ffedd5", "#fb923c"]}>
      <path d="M4 12 Q32 24 60 12" stroke="#7c2d12" strokeWidth="1.5" fill="none" />
      {colores.map((c, i) => {
        const x = 9 + i * 11.5;
        const y = 12 + Math.sin((i / 4) * Math.PI) * 5.6;
        return <polygon key={c} points={`${x - 4},${y} ${x + 4},${y} ${x},${y + 8}`} fill={c} />;
      })}
      <text x="32" y="47" textAnchor="middle" fontSize="24">
        {emoji ?? "🎉"}
      </text>
    </Medallon>
  );
}

export function LogoDeEvento({ logo, emoji }: { logo: LogoEvento; emoji?: string }) {
  switch (logo) {
    case "tablas":
      return <Tablas />;
    case "viaje":
      return <Viaje />;
    case "reserva":
      return <Reserva />;
    case "anuncios":
      return <Anuncios />;
    case "memoria":
      return <Memoria />;
    case "duelos":
      return <Duelos />;
    default:
      return <Fiesta emoji={emoji} />;
  }
}
