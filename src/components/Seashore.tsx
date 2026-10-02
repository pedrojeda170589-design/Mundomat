// Costa patagónica de fondo (ambiente de 1.º grado): mar con olas, playa y
// un faro a lo lejos. Misma idea que Mountains (SVG nítido en cualquier
// pantalla), con su paleta de día y de noche.
export default function Seashore({ isDay }: { isDay: boolean }) {
  const p = isDay
    ? { far: "#7cc4e4", sea: "#3fa3d1", wave: "#e9f7fd", sand: "#f3dfa8", sandDark: "#e2c47f", cliff: "#c9a46a", light: "#ffffff", stripe: "#e11d48" }
    : { far: "#1d3557", sea: "#16304f", wave: "#4b6a8f", sand: "#3b3a52", sandDark: "#2e2d44", cliff: "#2a2940", light: "#fde68a", stripe: "#7f1d1d" };
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden" style={{ height: "42%" }}>
      <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        {/* Acantilado y faro a lo lejos */}
        <path d="M900,190 L960,150 L1060,140 L1140,160 L1200,150 L1200,260 L880,260 Z" fill={p.cliff} />
        <rect x="1032" y="70" width="22" height="74" fill={p.light} />
        <rect x="1032" y="88" width="22" height="10" fill={p.stripe} />
        <rect x="1032" y="112" width="22" height="10" fill={p.stripe} />
        <path d="M1028,70 L1043,52 L1058,70 Z" fill={p.stripe} />
        {/* Mar lejano */}
        <path d="M0,200 L1200,190 L1200,300 L0,300 Z" fill={p.far} />
        {/* Mar cercano con olas */}
        <path
          d="M0,240 Q60,225 120,240 T240,240 T360,240 T480,240 T600,240 T720,240 T840,240 T960,240 T1080,240 T1200,240 L1200,330 L0,330 Z"
          fill={p.sea}
        />
        <path
          d="M0,262 Q60,250 120,262 T240,262 T360,262 T480,262 T600,262 T720,262 T840,262 T960,262 T1080,262 T1200,262"
          fill="none"
          stroke={p.wave}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M0,292 Q60,280 120,292 T240,292 T360,292 T480,292 T600,292 T720,292 T840,292 T960,292 T1080,292 T1200,292"
          fill="none"
          stroke={p.wave}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Playa */}
        <path d="M0,330 Q200,300 420,325 T840,318 T1200,322 L1200,400 L0,400 Z" fill={p.sand} />
        <path d="M0,372 Q300,350 600,368 T1200,362 L1200,400 L0,400 Z" fill={p.sandDark} />
      </svg>
    </div>
  );
}
