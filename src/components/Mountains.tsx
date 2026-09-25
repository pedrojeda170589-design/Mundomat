// Cordillera de fondo, estilo "aventura/exploración", dibujada en SVG (sin
// depender de imágenes) para que se vea nítida en cualquier tamaño de
// pantalla. Cambia de paleta según el momento del día, pero la silueta es
// siempre la misma para que las pantallas se sientan parte del mismo lugar.
export default function Mountains({ isDay }: { isDay: boolean }) {
  const palette = isDay
    ? {
        far: "#9ec7e8",
        mid: "#6fae7c",
        near: "#4f8f5c",
        snow: "#f4f9ff",
        ground: "#5fa668",
      }
    : {
        far: "#232a55",
        mid: "#1a2140",
        near: "#131934",
        snow: "#3a4270",
        ground: "#101530",
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
        {/* Cordillera lejana con picos nevados */}
        <path
          d="M0,220 L120,120 L180,170 L260,80 L320,150 L420,60 L500,160 L600,100 L700,180 L800,90 L900,170 L980,110 L1080,190 L1200,140 L1200,400 L0,400 Z"
          fill={palette.far}
        />
        <path
          d="M260,80 L285,105 L235,115 Z M420,60 L448,88 L392,96 Z M800,90 L826,116 L774,122 Z"
          fill={palette.snow}
          opacity="0.9"
        />
        {/* Segunda hilera de cerros, más cerca */}
        <path
          d="M0,300 L140,190 L260,260 L380,170 L520,270 L660,190 L800,270 L940,200 L1080,270 L1200,220 L1200,400 L0,400 Z"
          fill={palette.mid}
        />
        {/* Loma frontal, casi al pie de la pantalla */}
        <path
          d="M0,360 L160,300 L340,350 L520,290 L720,355 L900,300 L1080,350 L1200,320 L1200,400 L0,400 Z"
          fill={palette.near}
        />
        {/* Suelo */}
        <rect x="0" y="380" width="1200" height="20" fill={palette.ground} />
      </svg>
    </div>
  );
}
