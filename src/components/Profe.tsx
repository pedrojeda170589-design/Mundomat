import Image from "next/image";

// El profe Pedro (dibujo propio, generado a partir de su foto con su permiso)
// en distintas poses para acompañar a los chicos en cada momento de la app.
export type PoseProfe =
  | "saluda" // al entrar
  | "explica" // al enseñar algo nuevo (pizarrón)
  | "aplaude" // cuando les va bien
  | "trofeo" // al completar un mundo
  | "animo" // cuando hay que volver a intentarlo
  | "lee" // cuentos y comprensión
  | "lupa" // problemas: buscar los datos
  | "reloj" // racha: falta para que hoy cuente
  | "mate" // fin de semana
  | "festejo" // cima del Camino de premios
  // Vestimentas según el mundo o el módulo del mapa:
  | "andinista" // El Chaltén
  | "guardaparque" // glaciar, reservas
  | "cientifico" // laboratorio, experimentos
  | "astronomo" // cielo, observatorio
  | "explorador" // pasado, Cueva de las Manos
  | "gaucho" // tradición, campo, sociales
  | "escritor" // lengua, cuentos
  | "matematico" // números y tablas
  | "almacenero"; // medidas, mercado

const ALT: Record<PoseProfe, string> = {
  saluda: "El profe Pedro saludando",
  explica: "El profe Pedro explicando en el pizarrón",
  aplaude: "El profe Pedro aplaudiendo",
  trofeo: "El profe Pedro con un trofeo",
  animo: "El profe Pedro dando ánimo",
  lee: "El profe Pedro leyendo un cuento",
  lupa: "El profe Pedro con una lupa",
  reloj: "El profe Pedro mirando el reloj",
  mate: "El profe Pedro tomando mate",
  festejo: "El profe Pedro festejando",
  andinista: "El profe Pedro vestido de andinista",
  guardaparque: "El profe Pedro vestido de guardaparque",
  cientifico: "El profe Pedro con guardapolvo de científico",
  astronomo: "El profe Pedro con un telescopio",
  explorador: "El profe Pedro vestido de explorador",
  gaucho: "El profe Pedro vestido de gaucho",
  escritor: "El profe Pedro con una pluma y un libro",
  matematico: "El profe Pedro con regla y escuadra",
  almacenero: "El profe Pedro con una balanza",
};

// Vestimentas cuyo dibujo todavía no está en public/theme/profe/: mientras
// tanto se usa otra pose. Al agregar el PNG, sacarla de esta lista.
const PENDIENTES: Partial<Record<PoseProfe, PoseProfe>> = {};

export default function Profe({
  pose,
  dice,
  className = "w-20 h-28",
  lado = "derecha",
}: {
  pose: PoseProfe;
  dice?: string; // globito de diálogo (opcional)
  className?: string; // tamaño del dibujo
  lado?: "derecha" | "izquierda"; // de qué lado va el globito
}) {
  const archivo = PENDIENTES[pose] ?? pose;
  const dibujo = (
    <span className={`relative shrink-0 ${className}`}>
      <Image
        src={`/theme/profe/${archivo}.png`}
        alt={ALT[archivo]}
        fill
        sizes="128px"
        className="object-contain object-bottom drop-shadow-[0_4px_4px_rgba(0,0,0,0.35)]"
      />
    </span>
  );
  if (!dice) return dibujo;
  const globo = (
    <span
      className={`relative rounded-2xl bg-white/95 border-2 border-amber-400 px-3 py-1.5 shadow-lg text-xs font-black text-amber-900 leading-snug text-left ${
        lado === "derecha" ? "rounded-bl-sm" : "rounded-br-sm"
      }`}
    >
      {dice}
    </span>
  );
  return (
    <span className="flex items-end gap-1">
      {lado === "derecha" ? (
        <>
          {dibujo}
          <span className="mb-10">{globo}</span>
        </>
      ) : (
        <>
          <span className="mb-10">{globo}</span>
          {dibujo}
        </>
      )}
    </span>
  );
}
