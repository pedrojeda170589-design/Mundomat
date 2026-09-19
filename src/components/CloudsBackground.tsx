// Nubes de fondo que van pasando lentamente, como en la app original de
// AI Studio. Es puramente decorativo: no recibe ni maneja datos, y no
// interfiere con los clics del contenido de encima (pointer-events: none).
const CLOUDS: {
  top: string;
  size: string;
  duration: string;
  delay: string;
  opacity: number;
}[] = [
  { top: "6%", size: "3rem", duration: "42s", delay: "-4s", opacity: 0.5 },
  { top: "16%", size: "2rem", duration: "58s", delay: "-20s", opacity: 0.35 },
  { top: "28%", size: "4.2rem", duration: "70s", delay: "-40s", opacity: 0.4 },
  { top: "4%", size: "2.4rem", duration: "50s", delay: "-30s", opacity: 0.3 },
  { top: "48%", size: "3.6rem", duration: "76s", delay: "-10s", opacity: 0.22 },
  { top: "62%", size: "2.2rem", duration: "55s", delay: "-46s", opacity: 0.28 },
  { top: "38%", size: "2.8rem", duration: "64s", delay: "-58s", opacity: 0.3 },
];

export default function CloudsBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
    >
      {CLOUDS.map((cloud, i) => (
        <span
          key={i}
          className="cloud-drift absolute left-0 select-none"
          style={{
            top: cloud.top,
            fontSize: cloud.size,
            opacity: cloud.opacity,
            animation: `cloud-drift ${cloud.duration} linear infinite`,
            animationDelay: cloud.delay,
            filter: "blur(0.5px)",
          }}
        >
          ☁️
        </span>
      ))}
    </div>
  );
}
