// Imágenes del viaje al Parque Nacional Monte León (3.º grado, 28/10/2026).
// Las dibuja Claude en ChatGPT; el mundo especial lo programa Antigravity
// (ver docs/equipo/tareas/AG-19-monte-leon.md). Solo datos.

// Objetos de la mochila de viaje: se ganan jugando el mundo especial.
export const MOCHILA_MONTE_LEON = [
  { id: "botella-agua-ml", label: "Botella de agua", slot: "prop" as const },
  { id: "anteojos-sol-ml", label: "Anteojos de sol", slot: "eyewear" as const, molde: "lentes-aviador" },
  { id: "gorra-ml", label: "Gorra para el sol", slot: "headwear" as const, molde: "casco-bombero" },
  { id: "protector-solar-ml", label: "Protector solar", slot: "prop" as const },
  { id: "bocadillos-ml", label: "Bocadillos para el viaje", slot: "prop" as const },
  { id: "golosina-ml", label: "Una golosina", slot: "prop" as const },
];

// Medalla para todos los que participaron (se entrega el 27/10 a la noche).
export const MEDALLA_MONTE_LEON = { id: "medalla-monte-leon", label: "Medalla del viaje a Monte León", slot: "pendant" as const, molde: "sol-de-mayo" };

// Mascota del viaje (peluche de pingüino de Magallanes).
export const MASCOTA_MONTE_LEON = { id: "pinguino-peluche-ml", label: "Pingüino de peluche", slot: "pet" as const };

// Avatares superespeciales del viaje.
export const AVATARES_MONTE_LEON = [
  { id: "explorador-monte-leon", label: "Explorador de Monte León", comoAvatar: "explorador" },
  { id: "guardaparque-monte-leon", label: "Guardaparque de Monte León", comoAvatar: "exploradora" },
  { id: "pinguino-monte-leon", label: "Pingüino de Magallanes", comoAvatar: "condor" },
];

// Escenas (public/theme/monte-leon/escenas/<id>.jpg, 3:2) e isla del mapa.
export const ESCENAS_MONTE_LEON = [
  { id: "viaje-ruta", label: "El viaje en micro por la Ruta 3, pasando por Piedrabuena" },
  { id: "cabeza-del-leon", label: "La Cabeza del León, la roca que le da nombre al parque" },
  { id: "pinguinera", label: "La pingüinera de pingüinos de Magallanes" },
  { id: "loberia", label: "La lobería de lobos marinos de un pelo" },
  { id: "estepa", label: "Guanacos y choiques en la estepa" },
  { id: "guardaparque", label: "El guardaparque explica las normas del parque" },
];
export const ISLA_MONTE_LEON = "/theme/monte-leon/isla.png";
export const MOCHILA_VACIA = "/theme/monte-leon/mochila.png";
