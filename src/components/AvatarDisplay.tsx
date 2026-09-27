import Image from "next/image";
import {
  AccessorySlot,
  AvatarAccessories,
  getAccessoryById,
  getAccessorySrc,
  getAvatarSrc,
  getBackgroundById,
} from "@/types";
import { resolveBackgroundId } from "@/lib/seasons";
import { ACCESSORIES_WITH_BACK, AVATAR_FIT } from "@/lib/avatarFit";

// Recuadro interno (en % del avatar) donde se dibuja el personaje. Deja
// aire arriba para que gorros, coronas y orejas no queden cortados.
const STAGE = { left: 7, top: 14, size: 86 };

// Orden de dibujo de los casilleros (de atrás hacia adelante).
const SLOT_ORDER: AccessorySlot[] = [
  "torso",
  "backpack",
  "face",
  "pendant",
  "eyewear",
  "headwear",
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
  // Día de cumpleaños: fondo y corona de cumple por encima de lo elegido, y
  // una tortita arriba del avatar.
  birthday?: boolean;
}

function AccessoryLayer({
  id,
  character,
  back,
  imageSizes,
}: {
  id: string;
  character: string;
  back: boolean;
  imageSizes: string;
}) {
  const fit = AVATAR_FIT[character]?.[id];
  if (!fit) return null;
  const [left, top, width, height, rot, ox, oy] = fit;
  const src = getAccessorySrc(id);
  return (
    <span
      className="absolute pointer-events-none"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: rot ? `rotate(${rot}deg)` : undefined,
        transformOrigin: `${ox * 100}% ${oy * 100}%`,
      }}
    >
      <Image
        src={back ? src.replace(/\.png$/, ".back.png") : src}
        alt=""
        fill
        sizes={imageSizes}
        className={back ? "" : "drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"}
      />
    </span>
  );
}

// Compone el avatar del alumno: fondo, partes traseras de los accesorios,
// el personaje (PNG transparente) y encima los accesorios, cada uno ubicado
// según la cara de ese personaje (ver src/lib/avatarFit.ts). El contenedor
// que se pase por className debe definir el tamaño.
export default function AvatarDisplay({
  character,
  accessories,
  className = "",
  alt = "Avatar",
  imageSizes = "200px",
  background,
  birthday = false,
}: Props) {
  const avatarSrc = getAvatarSrc(character);
  const characterId = avatarSrc.split("/").pop()!.replace(/\.png$/, "");
  const bg = getBackgroundById(birthday ? "cumple" : resolveBackgroundId(background));

  const equipped: AvatarAccessories = { ...(accessories ?? {}) };
  if (birthday) equipped.headwear = "corona-cumple";
  const ids = SLOT_ORDER.map((slot) => equipped[slot]).filter(
    (id): id is string => !!id && !!getAccessoryById(id)
  );

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {bg && (
        <span aria-hidden className="absolute inset-0" style={{ background: bg.css }} />
      )}
      <span
        className="absolute"
        style={{
          left: `${STAGE.left}%`,
          top: `${STAGE.top}%`,
          width: `${STAGE.size}%`,
          height: `${STAGE.size}%`,
        }}
      >
        {ids
          .filter((id) => ACCESSORIES_WITH_BACK.has(id))
          .map((id) => (
            <AccessoryLayer key={`${id}-back`} id={id} character={characterId} back imageSizes={imageSizes} />
          ))}
        <Image src={avatarSrc} alt={alt} fill sizes={imageSizes} className="object-contain" />
        {ids.map((id) => (
          <AccessoryLayer key={id} id={id} character={characterId} back={false} imageSizes={imageSizes} />
        ))}
      </span>
      {birthday && (
        <span
          className="absolute right-[3%] top-[3%] w-[30%] h-[30%] pointer-events-none animate-bounce"
          title="¡Feliz cumpleaños!"
        >
          <Image src="/theme/torta-cumple.png" alt="¡Feliz cumpleaños!" fill sizes="64px" className="object-contain drop-shadow" />
        </span>
      )}
    </span>
  );
}
