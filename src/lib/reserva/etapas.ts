// Etapas de la actividad especial «Reserva y expedición patagónica» (3.º y 4.º).
// Orden confirmado por Pedro el 10/10/2026: los siete departamentos de Santa
// Cruz empezando por Río Chico, y después el resto de la Patagonia.

export type Nivel = "departamento" | "provincia";

export interface Etapa {
  n: number; // 1..11
  territorio: string; // id del departamento o de la provincia en el mapa
  nivel: Nivel;
  nombre: string;
  cabecera: string; // cabecera del departamento o capital de la provincia
  localidades: string[]; // ids de MAPA.localidades
  otrasLocalidades: string[]; // nombres que no van como punto en el mapa
  postal: { titulo: string; texto: string };
  datos: string[]; // datos del lugar que el chico lee antes de jugar
  animal: string;
  planta: string;
  objeto: string;
  emblema: string;
}

export const ETAPAS: Etapa[] = [
  {
    n: 1,
    territorio: "rio-chico",
    nivel: "departamento",
    nombre: "Río Chico",
    cabecera: "Gobernador Gregores",
    localidades: ["gobernador-gregores"],
    otrasLocalidades: ["Hipólito Yrigoyen (Lago Posadas)", "Bajo Caracoles"],
    postal: {
      titulo: "Lago Belgrano, Parque Nacional Perito Moreno",
      texto: "Lagos de colores, montañas nevadas y bosques donde vive el huemul. Gobernador Gregores, nuestro punto de partida, está en el centro de la provincia.",
    },
    datos: [
      "Gobernador Gregores es la cabecera de Río Chico, en el centro de la provincia.",
      "Río Chico no tiene costa: está lejos del mar. Del lado oeste llega a la cordillera y a Chile.",
      "Es el departamento con más vecinos: limita con otros cinco departamentos.",
      "Allí están el Parque Nacional Perito Moreno y el lago Cardiel.",
    ],
    animal: "huemul",
    planta: "calafate",
    objeto: "boleadoras",
    emblema: "bandera-santa-cruz",
  },
  {
    n: 2,
    territorio: "lago-buenos-aires",
    nivel: "departamento",
    nombre: "Lago Buenos Aires",
    cabecera: "Perito Moreno",
    localidades: ["perito-moreno", "los-antiguos"],
    otrasLocalidades: [],
    postal: {
      titulo: "Cueva de las Manos, río Pinturas",
      texto: "Hace más de 9.000 años, los primeros pobladores pintaron cientos de manos y guanacos en estas paredes. Es Patrimonio de la Humanidad desde 1999.",
    },
    datos: [
      "Perito Moreno es la cabecera del departamento.",
      "Los Antiguos está junto al lago Buenos Aires, cerca de Chile, y es famosa por sus cerezas.",
      "En la meseta del lago Buenos Aires está el Parque Nacional Patagonia, creado para cuidar al macá tobiano.",
    ],
    animal: "maca-tobiano",
    planta: "neneo",
    objeto: "quillango",
    emblema: "escudo-perito-moreno",
  },
  {
    n: 3,
    territorio: "deseado",
    nivel: "departamento",
    nombre: "Deseado",
    cabecera: "Puerto Deseado",
    localidades: ["puerto-deseado", "caleta-olivia", "pico-truncado", "las-heras"],
    otrasLocalidades: ["Koluel Kayke", "Fitz Roy", "Jaramillo", "Tellier"],
    postal: {
      titulo: "Ría Deseado",
      texto: "El mar entra en el cañadón del río y forma una ría con islas, acantilados rojizos, toninas, cormoranes y pingüinos.",
    },
    datos: [
      "Puerto Deseado es la cabecera del departamento y está sobre la ría.",
      "Caleta Olivia, Pico Truncado y Las Heras también son de Deseado. Es una zona de petróleo.",
      "Frente a Puerto Deseado está la Isla Pingüino, un parque marino.",
      "En Deseado también está el bosque petrificado de Jaramillo: árboles de piedra de millones de años.",
    ],
    animal: "pinguino-penacho",
    planta: "molle",
    objeto: "mate",
    emblema: "escudo-puerto-deseado",
  },
  {
    n: 4,
    territorio: "magallanes",
    nivel: "departamento",
    nombre: "Magallanes",
    cabecera: "Puerto San Julián",
    localidades: ["puerto-san-julian"],
    otrasLocalidades: [],
    postal: {
      titulo: "Bahía de San Julián y la nao Victoria",
      texto: "En 1520 la expedición de Hernando de Magallanes pasó el invierno en esta bahía. Hoy hay una réplica de su barco, la nao Victoria.",
    },
    datos: [
      "Puerto San Julián es la cabecera del departamento Magallanes.",
      "El departamento lleva el nombre del navegante Hernando de Magallanes, que llegó en 1520.",
      "Es tierra de estancias de ovejas y de lana.",
    ],
    animal: "tonina-overa",
    planta: "coiron",
    objeto: "tijera-esquila",
    emblema: "escudo-puerto-san-julian",
  },
  {
    n: 5,
    territorio: "corpen-aike",
    nivel: "departamento",
    nombre: "Corpen Aike",
    cabecera: "Puerto Santa Cruz",
    localidades: ["puerto-santa-cruz", "piedra-buena"],
    otrasLocalidades: [],
    postal: {
      titulo: "Isla Pavón, río Santa Cruz",
      texto: "En esta isla del río Santa Cruz, frente a Piedra Buena, vivió el marino Luis Piedra Buena. Muy cerca está el Parque Nacional Monte León.",
    },
    datos: [
      "Puerto Santa Cruz es la cabecera del departamento Corpen Aike.",
      "Comandante Luis Piedra Buena está sobre el río Santa Cruz, el río más grande de la provincia.",
      "En Corpen Aike está el Parque Nacional Monte León, sobre la costa.",
    ],
    animal: "puma",
    planta: "mata-negra",
    objeto: "recado",
    emblema: "escudo-puerto-santa-cruz",
  },
  {
    n: 6,
    territorio: "lago-argentino",
    nivel: "departamento",
    nombre: "Lago Argentino",
    cabecera: "El Calafate",
    localidades: ["el-calafate", "el-chalten"],
    otrasLocalidades: ["Tres Lagos"],
    postal: {
      titulo: "Glaciar Perito Moreno",
      texto: "Una pared de hielo de unos 60 metros de alto sobre el lago Argentino, en el Parque Nacional Los Glaciares, Patrimonio de la Humanidad.",
    },
    datos: [
      "El Calafate es la cabecera del departamento Lago Argentino.",
      "El Chaltén está al pie del cerro Fitz Roy, en la cordillera. Tres Lagos también es de este departamento.",
      "El Parque Nacional Los Glaciares tiene muchos glaciares, como el Perito Moreno.",
    ],
    animal: "condor",
    planta: "notro",
    objeto: "huso",
    emblema: "escudo-el-calafate",
  },
  {
    n: 7,
    territorio: "guer-aike",
    nivel: "departamento",
    nombre: "Güer Aike",
    cabecera: "Río Gallegos",
    localidades: ["rio-gallegos", "rio-turbio", "28-de-noviembre"],
    otrasLocalidades: ["Rospentek", "Julia Dufour"],
    postal: {
      titulo: "Faro de Cabo Vírgenes",
      texto: "En el extremo sudeste de la provincia, donde empieza la Ruta 40 y el estrecho de Magallanes, hay un faro y una gran colonia de pingüinos.",
    },
    datos: [
      "Río Gallegos es la cabecera de Güer Aike y la capital de Santa Cruz. Es la ciudad más poblada de la provincia.",
      "En Río Turbio hay una mina de carbón. Muy cerca está 28 de Noviembre.",
      "En Cabo Vírgenes empieza la Ruta Nacional 40.",
    ],
    animal: "cauquen-colorado",
    planta: "murtilla",
    objeto: "lampara-minero",
    emblema: "escudo-santa-cruz",
  },
  {
    n: 8,
    territorio: "tierra-del-fuego",
    nivel: "provincia",
    nombre: "Tierra del Fuego",
    cabecera: "Ushuaia",
    localidades: ["ushuaia"],
    otrasLocalidades: ["Río Grande", "Tolhuin"],
    postal: {
      titulo: "Faro Les Eclaireurs, canal Beagle",
      texto: "Frente a Ushuaia, la ciudad más austral del país, un faro rojo y blanco sobre una isla rodeada de lobos marinos y cormoranes.",
    },
    datos: [
      "Ushuaia es la capital de la provincia y está sobre el canal Beagle.",
      "La Isla Grande de Tierra del Fuego la compartimos con Chile.",
      "La provincia se llama Tierra del Fuego, Antártida e Islas del Atlántico Sur: las Islas Malvinas son parte de ella.",
      "El castor fue traído de otro continente y daña los bosques: corta árboles y hace diques.",
    ],
    animal: "carpintero-gigante",
    planta: "lenga",
    objeto: "canoa-corteza",
    emblema: "bandera-tierra-del-fuego",
  },
  {
    n: 9,
    territorio: "chubut",
    nivel: "provincia",
    nombre: "Chubut",
    cabecera: "Rawson",
    localidades: ["rawson", "puerto-madryn"],
    otrasLocalidades: ["Trelew", "Comodoro Rivadavia", "Esquel"],
    postal: {
      titulo: "Península Valdés",
      texto: "Cada invierno y primavera llegan las ballenas francas a tener sus crías en los golfos de la península. Es Patrimonio de la Humanidad desde 1999.",
    },
    datos: [
      "Rawson es la capital del Chubut, cerca de Trelew.",
      "El Chubut está justo al norte de Santa Cruz.",
      "Otras ciudades: Puerto Madryn, Comodoro Rivadavia y Esquel.",
      "Cerca de Esquel está el Parque Nacional Los Alerces.",
    ],
    animal: "ballena-franca",
    planta: "alerce",
    objeto: "tetera-galesa",
    emblema: "bandera-chubut",
  },
  {
    n: 10,
    territorio: "rio-negro",
    nivel: "provincia",
    nombre: "Río Negro",
    cabecera: "Viedma",
    localidades: ["viedma", "bariloche"],
    otrasLocalidades: ["General Roca", "Cipolletti", "San Antonio Oeste"],
    postal: {
      titulo: "Lago Nahuel Huapi",
      texto: "Un lago enorme rodeado de bosques y cerros nevados, junto a San Carlos de Bariloche. Allí está el primer parque nacional del país.",
    },
    datos: [
      "Viedma es la capital de Río Negro y está cerca del mar.",
      "San Carlos de Bariloche está junto al lago Nahuel Huapi, en la cordillera.",
      "Río Negro está al norte del Chubut y tiene costa sobre el mar.",
    ],
    animal: "huillin",
    planta: "coihue",
    objeto: "trapelacucha",
    emblema: "bandera-rio-negro",
  },
  {
    n: 11,
    territorio: "neuquen",
    nivel: "provincia",
    nombre: "Neuquén",
    cabecera: "Neuquén",
    localidades: ["neuquen"],
    otrasLocalidades: ["San Martín de los Andes", "Zapala", "Villa La Angostura"],
    postal: {
      titulo: "Volcán Lanín y bosque de pehuenes",
      texto: "Un volcán nevado de 3.776 metros en la frontera con Chile, rodeado de araucarias. Está en el Parque Nacional Lanín.",
    },
    datos: [
      "La capital se llama igual que la provincia: Neuquén.",
      "El Neuquén está en el noroeste de la Patagonia, junto a Chile.",
      "El volcán Lanín está en el Parque Nacional Lanín, rodeado de pehuenes.",
    ],
    animal: "gato-andino",
    planta: "pehuen",
    objeto: "witral",
    emblema: "bandera-neuquen",
  },
];

export const ETAPAS_SANTA_CRUZ = ETAPAS.filter((e) => e.nivel === "departamento").length; // 7
// Premio por recorrer los siete departamentos de Santa Cruz.
export const PREMIO_SANTA_CRUZ = ["medalla-santa-cruz"];

export function etapa(n: number): Etapa | undefined {
  return ETAPAS.find((e) => e.n === n);
}

// Ids de todo lo que se puede ganar (orden de la colección).
export function premiosDeEtapa(e: Etapa): string[] {
  return [e.animal, e.planta, e.objeto, e.emblema];
}
