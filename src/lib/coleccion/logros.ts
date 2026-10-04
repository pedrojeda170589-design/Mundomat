// Avatares de LOGRO de los textos de comprensión (pedido de Pedro).
//
// Cada cuento, leyenda o fábula tiene su avatar: se desbloquea la primera
// vez que el alumno saca 90 % o más en ese mundo de comprensión (en
// cualquier grado). NUNCA se venden en la tienda: «la tienda es
// personalización; el aprendizaje es identidad».
//
// Solo datos (sin imports). Las imágenes van en public/theme/avatars/<id>.png
// y la mascota de premio en public/theme/accessories-temporada/<id>.png.

export interface AvatarLogro {
  id: string; // id del avatar
  storyId: string;
  texto: string; // título del texto (para «Superá … con 90 %»)
  label: string;
  blurb: string; // descripción para quien dibuja
  comoAvatar: string; // personaje con el mismo encuadre (para gorros y lentes)
  // Mascota que se gana junto con el avatar.
  mascota?: { id: string; label: string; blurb: string };
}

export const UMBRAL_LOGRO = 90;

const nena = "exploradora";
const nene = "explorador";

export const AVATARES_LOGRO: AvatarLogro[] = [
  { id: "logro-tres-chanchitos", storyId: "tres-chanchitos", texto: "Los tres chanchitos", label: "Chanchito constructor", blurb: "Chanchito rosado con casco amarillo y un ladrillo en la mano.", comoAvatar: "zorro" },
  { id: "logro-gallinita-roja", storyId: "gallinita-roja", texto: "La gallinita roja", label: "Gallinita trabajadora", blurb: "Gallinita roja con delantal y una espiga de trigo.", comoAvatar: "condor" },
  { id: "logro-ricitos-osos", storyId: "ricitos-osos", texto: "Ricitos de Oro y los tres osos", label: "Osito del bosque", blurb: "Osito marrón con un tazón de avena humeante.", comoAvatar: "zorro" },
  { id: "logro-caperucita", storyId: "caperucita", texto: "Caperucita Roja", label: "Caperucita exploradora", blurb: "Nena con capa roja con capucha y canasta.", comoAvatar: nena },
  { id: "logro-patito-feo", storyId: "patito-feo", texto: "El patito feo", label: "Cisne blanco", blurb: "Cisne joven blanco, orgulloso y amable.", comoAvatar: "condor" },
  { id: "logro-musicos-bremen", storyId: "musicos-bremen", texto: "Los músicos de Bremen", label: "Burrito músico", blurb: "Burrito gris con una trompeta.", comoAvatar: "guanaco" },
  { id: "logro-juan-porotos", storyId: "juan-porotos", texto: "Juan y los porotos mágicos", label: "Juan de las nubes", blurb: "Nene con una planta de poroto que sube hasta las nubes detrás.", comoAvatar: nene },
  { id: "logro-traje-emperador", storyId: "traje-emperador", texto: "El traje nuevo del emperador", label: "Niño sincero", blurb: "Nene con corona de papel que sonríe (el que dijo la verdad).", comoAvatar: nene },
  { id: "logro-medias-flamencos", storyId: "medias-flamencos", texto: "Las medias de los flamencos", label: "Flamenco de medias", blurb: "Flamenco rosado con medias a rayas de colores.", comoAvatar: "condor" },
  { id: "logro-tortuga-gigante", storyId: "tortuga-gigante", texto: "La tortuga gigante", label: "Tortuga gigante", blurb: "Tortuga grande y bondadosa de la selva.", comoAvatar: "pinguino" },
  { id: "logro-leyenda-calafate", storyId: "leyenda-calafate", texto: "La leyenda del calafate", label: "Guardiana del calafate", blurb: "Nena patagónica con poncho y una rama de calafate con frutos violetas.", comoAvatar: nena },
  { id: "logro-leyenda-elal", storyId: "leyenda-elal", texto: "La leyenda de Elal", label: "Cisne de cuello negro", blurb: "Cisne de cuello negro de la Patagonia, majestuoso.", comoAvatar: "condor" },
  { id: "logro-leyenda-koonch", storyId: "leyenda-koonch", texto: "Kóoch y el origen del mundo", label: "Explorador de la Patagonia", blurb: "Nene con poncho y vincha mirando la estepa al amanecer.", comoAvatar: nene },
  { id: "logro-leyenda-hornero", storyId: "leyenda-hornero", texto: "La leyenda del hornero", label: "Hornero constructor", blurb: "Pájaro hornero con un poquito de barro, junto a su nido.", comoAvatar: "condor" },
  { id: "logro-leyenda-yerba-mate", storyId: "leyenda-yerba-mate", texto: "La leyenda de la yerba mate", label: "Guardiana de la yerba mate", blurb: "Nena con una rama de yerba mate y una flor blanca.", comoAvatar: nena },
  { id: "logro-leyenda-siete-colores", storyId: "leyenda-siete-colores", texto: "El Cerro de los Siete Colores", label: "Explorador de los Siete Colores", blurb: "Nene con poncho rojo y el cerro de colores de fondo.", comoAvatar: nene },
  { id: "logro-leyenda-ballena", storyId: "leyenda-ballena", texto: "Cómo llegó la ballena al mar", label: "Ballena franca", blurb: "Ballena franca austral bebé, sonriente.", comoAvatar: "pinguino" },
  {
    id: "logro-leyenda-iguazu", storyId: "leyenda-iguazu", texto: "La leyenda de las Cataratas del Iguazú", label: "Guardián de la Selva",
    blurb: "Nene con ropa de explorador verde, hojas de la selva misionera y cataratas atrás.", comoAvatar: nene,
    mascota: { id: "mini-yaguarete", label: "Mini yaguareté", blurb: "Cachorro de yaguareté sentado." },
  },
  { id: "logro-liebre-tortuga", storyId: "liebre-tortuga", texto: "La liebre y la tortuga", label: "Guardián de la Tortuga", blurb: "Nene que sostiene una tortuguita con una medalla de ganadora.", comoAvatar: nene },
  { id: "logro-leon-raton", storyId: "leon-raton", texto: "El león y el ratón", label: "Ratoncito valiente", blurb: "Ratoncito gris con capa, al lado de una red rota.", comoAvatar: "zorro" },
  { id: "logro-zorro-cuervo", storyId: "zorro-cuervo", texto: "El zorro y el cuervo", label: "Cuervo sabio", blurb: "Cuervo negro brillante con anteojos y un queso.", comoAvatar: "condor" },
  { id: "logro-cigarra-hormiga", storyId: "cigarra-hormiga", texto: "La cigarra y la hormiga", label: "Hormiga previsora", blurb: "Hormiga roja con mochila de hojas y una semilla.", comoAvatar: "zorro" },
  { id: "logro-pastorcito-mentiroso", storyId: "pastorcito-mentiroso", texto: "El pastorcito mentiroso", label: "Pastorcita sincera", blurb: "Nena pastora con bastón y una ovejita.", comoAvatar: nena },
  { id: "logro-raton-campo-ciudad", storyId: "raton-campo-ciudad", texto: "El ratón de campo y el ratón de ciudad", label: "Ratón de campo", blurb: "Ratoncito con sombrero de paja y una espiga.", comoAvatar: "zorro" },
  { id: "logro-gallina-huevos-oro", storyId: "gallina-huevos-oro", texto: "La gallina de los huevos de oro", label: "Gallina dorada", blurb: "Gallina blanca con un huevo de oro brillante.", comoAvatar: "condor" },
];

export function logroDeCuento(storyId: string): AvatarLogro | undefined {
  return AVATARES_LOGRO.find((l) => l.storyId === storyId);
}
