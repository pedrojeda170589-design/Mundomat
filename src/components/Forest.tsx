// Bosque de lengas de fondo (ambiente de 2.º grado): cerros andinos,
// bosque patagónico con lengas verdes y doradas, un refugio de montaña y
// arroyo entre piedras. SVG nítido en cualquier resolución, con paleta
// de día y de noche.
export default function Forest({ isDay }: { isDay: boolean }) {
  const p = isDay
    ? {
        mountains: "#8bb6d6",
        snow: "#f0f7fd",
        farForest: "#3a7d58",
        autumnLenga: "#c67d38",
        midForest: "#2d6342",
        nearForest: "#1f472e",
        cabinBody: "#8a5a36",
        cabinRoof: "#54331d",
        cabinWindow: "#fef08a",
        stream: "#68b9db",
        rocks: "#7a8288",
        ground: "#355e3b",
        groundDark: "#26442b",
      }
    : {
        mountains: "#152238",
        snow: "#283952",
        farForest: "#12261e",
        autumnLenga: "#3d2b1f",
        midForest: "#0f2019",
        nearForest: "#0a1712",
        cabinBody: "#2d1f16",
        cabinRoof: "#1b120c",
        cabinWindow: "#fde68a",
        stream: "#214259",
        rocks: "#2a2d33",
        ground: "#102117",
        groundDark: "#09140e",
      };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden"
      style={{ height: "42%" }}
    >
      <svg
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        {/* Cordillera andina lejana con picos nevados */}
        <path
          d="M0,230 L100,160 L180,200 L290,110 L380,180 L490,90 L600,170 L720,120 L840,190 L960,100 L1080,170 L1200,130 L1200,400 L0,400 Z"
          fill={p.mountains}
        />
        <path
          d="M290,110 L315,135 L265,145 Z M490,90 L520,122 L460,130 Z M960,100 L988,128 L932,136 Z"
          fill={p.snow}
          opacity="0.85"
        />

        {/* Bosque lejano en la ladera */}
        <path
          d="M0,270 Q150,230 300,250 T600,240 T900,245 T1200,235 L1200,400 L0,400 Z"
          fill={p.farForest}
        />

        {/* Toques de lenga otoñal dorada/rojiza en la arboleda */}
        <ellipse cx="260" cy="245" rx="35" ry="25" fill={p.autumnLenga} opacity="0.9" />
        <ellipse cx="780" cy="240" rx="40" ry="28" fill={p.autumnLenga} opacity="0.9" />
        <ellipse cx="1040" cy="235" rx="32" ry="22" fill={p.autumnLenga} opacity="0.85" />

        {/* Hilera media del bosque de lengas (árboles estilizados) */}
        <path
          d="M0,320 Q80,280 160,305 T320,290 T480,310 T640,295 T800,315 T960,290 T1120,310 T1200,295 L1200,400 L0,400 Z"
          fill={p.midForest}
        />

        {/* Refugio de montaña de madera en el claro */}
        <g transform="translate(420, 240)">
          {/* Paredes */}
          <rect x="0" y="24" width="46" height="32" fill={p.cabinBody} rx="2" />
          {/* Techo a dos aguas */}
          <path d="M-6,24 L23,4 L52,24 Z" fill={p.cabinRoof} />
          {/* Ventana iluminada */}
          <rect x="16" y="32" width="14" height="14" fill={p.cabinWindow} rx="1" />
          <line x1="23" y1="32" x2="23" y2="46" stroke={p.cabinRoof} strokeWidth="1.5" />
          <line x1="16" y1="39" x2="30" y2="39" stroke={p.cabinRoof} strokeWidth="1.5" />
        </g>

        {/* Arbolitos de lenga en el frente */}
        <path
          d="M0,355 Q120,330 240,345 T480,335 T720,350 T960,330 T1200,345 L1200,400 L0,400 Z"
          fill={p.nearForest}
        />

        {/* Arroyo de montaña que baja entre el bosque */}
        <path
          d="M660,320 Q640,350 670,375 Q700,390 690,400 L740,400 Q745,385 715,365 Q685,340 700,320 Z"
          fill={p.stream}
        />

        {/* Piedras al costado del arroyo */}
        <ellipse cx="645" cy="365" rx="14" ry="7" fill={p.rocks} />
        <ellipse cx="735" cy="380" rx="16" ry="8" fill={p.rocks} />
        <ellipse cx="680" cy="392" rx="11" ry="5" fill={p.rocks} />

        {/* Loma frontal y suelo con musgo */}
        <path
          d="M0,370 Q300,350 600,368 T1200,360 L1200,400 L0,400 Z"
          fill={p.ground}
          opacity="0.95"
        />
        <rect x="0" y="388" width="1200" height="12" fill={p.groundDark} />
      </svg>
    </div>
  );
}
