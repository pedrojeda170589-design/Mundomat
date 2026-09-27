import Image from "next/image";
import {
  AccessorySlot,
  AvatarAccessories,
  getAccessorySrc,
  getAvatarSrc,
  getBackgroundById,
  isStandardAvatar,
} from "@/types";
import { resolveBackgroundId } from "@/lib/seasons";

// Posición de cada casillero de accesorio, como porcentaje del contenedor
// cuadrado del avatar. Están pensadas para retratos tipo "cara y hombros"
// centrados y mirando de frente (el mismo encuadre que se usó para generar
// todos los personajes en public/theme/avatars/), así que un mismo ancla
// sirve razonablemente bien para los personajes de un mismo grupo sin tener
// que ajustar cada accesorio por personaje.
const SLOT_STYLE_LEGACY: Partial<Record<AccessorySlot, string>> = {
  headwear: "top-[-8%] left-[22%] w-[56%]",
  eyewear: "top-[28%] left-[27%] w-[46%]",
  face: "top-[44%] left-[26%] w-[48%]",
  torso: "top-[66%] left-[2%] w-[96%]",
  // Solo para accesorios de temporada (escarapela, pin, flor de solapa).
  pendant: "top-[72%] left-[38%] w-[24%]",
};

// Los avatares "estándar" tienen su propio encuadre (ver
// public/theme/avatars/estandar-*.png, ambos recortados con el mismo
// método) y un guardarropa con más piezas: mochila (detrás/sobre la
// campera) y accesorios de bolsillo (binoculares, collar).
const SLOT_STYLE_ESTANDAR: Partial<Record<AccessorySlot, string>> = {
  headwear: "top-[-10%] left-[21%] w-[58%]",
  eyewear: "top-[24%] left-[30%] w-[40%]",
  face: "top-[57%] left-[31%] w-[38%]",
  torso: "top-[62%] left-[12%] w-[76%]",
  backpack: "top-[60%] left-[11%] w-[78%]",
  pendant: "top-[72%] left-[38%] w-[24%]",
};

// Anclado del contenido dentro de su casillero: los objetos "que cuelgan
// desde arriba" (gorro, campera, mochila) se apoyan mejor alineados arriba;
// los más chicos y centrados (anteojos, pañuelo, colgante) se ven mejor
// centrados en su casillero.
const TOP_ALIGNED_SLOTS = new Set<AccessorySlot>(["headwear", "torso", "backpack"]);

const SLOT_ORDER_LEGACY: AccessorySlot[] = ["torso", "headwear", "face", "pendant", "eyewear"];
const SLOT_ORDER_ESTANDAR: AccessorySlot[] = [
  "torso",
  "backpack",
  "headwear",
  "face",
  "pendant",
  "eyewear",
];

interface Props {
  character?: string;
  accessories?: AvatarAccessories;
  className?: string;
  alt?: string;
  imageSizes?: string;
  // Fondo guardado del alumno (AUTO_BACKGROUND, un id de BACKGROUND_OPTIONS
  // o nada = automático). Se resuelve acá según la fecha.
  background?: string;
}

// Compone el avatar del alumno: el retrato del personaje base como fondo, y
// arriba, en orden fijo, los accesorios que tenga equipados. El contenedor
// que se le pase por className debe definir tamaño y position relative (o
// dejar que este componente lo haga con w-full h-full si ya está dentro de
// uno) ya que las imágenes internas usan `fill`.
export default function AvatarDisplay({
  character,
  accessories,
  className = "",
  alt = "Avatar",
  imageSizes = "200px",
  background,
}: Props) {
  const bg = getBackgroundById(resolveBackgroundId(background));
  const standard = isStandardAvatar(character);
  const slotOrder = standard ? SLOT_ORDER_ESTANDAR : SLOT_ORDER_LEGACY;
  const slotStyle = standard ? SLOT_STYLE_ESTANDAR : SLOT_STYLE_LEGACY;

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {bg && (
        <span
          aria-hidden
          className="absolute inset-0"
          style={{ background: bg.css }}
        />
      )}
      <Image
        src={getAvatarSrc(character)}
        alt={alt}
        fill
        sizes={imageSizes}
        className="object-cover"
      />
      {slotOrder.map((slot) => {
        const accessoryId = accessories?.[slot];
        const style = slotStyle[slot];
        if (!accessoryId || !style) return null;
        return (
          <span
            key={slot}
            className={`absolute pointer-events-none aspect-square ${style}`}
          >
            <Image
              src={getAccessorySrc(accessoryId)}
              alt=""
              fill
              sizes={imageSizes}
              className={`object-contain drop-shadow-md ${
                TOP_ALIGNED_SLOTS.has(slot) ? "object-top" : "object-center"
              }`}
            />
          </span>
        );
      })}
    </span>
  );
}
