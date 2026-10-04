// Calendario de la tienda por temporadas (pedido de Pedro, octubre 2026).
//
// Cada fecha patria, efeméride o festividad que les interesa a los chicos
// tiene una COLECCIÓN: avatares, objetos y mascotas que se compran solo
// durante 15 días. Después desaparecen y vuelven en la misma fecha del año
// que viene (o se renuevan con otros). Lo comprado queda para siempre.
//
// Además, cada colección tiene un objeto LEGENDARIO que no se vende: se gana
// superando mundos (90 % o más) mientras dura la temporada.
//
// Este archivo es solo datos (sin imports): lo usan src/types (catálogos de
// la tienda) y src/lib/tiempo-limitado.ts (ventanas y contador).
//
// Las imágenes las genera Antigravity (ver docs/equipo/tareas/AG-13-*) y las
// revisa Claude. Un ítem sin imagen todavía no aparece en la tienda (ver
// src/lib/coleccion/imagenes-listas.ts, que se regenera con
// `node scripts/coleccion/listar-imagenes.mjs`).

// Casillero del objeto. Los de la cara se ubican "como" un objeto modelo que
// ya está ajustado a todos los personajes (`molde`); la mascota y el objeto
// de mano van en una esquina del retrato, sin ajuste.
export type CasilleroColeccion = "headwear" | "eyewear" | "face" | "pendant" | "pet" | "prop";

export interface ItemColeccion {
  id: string;
  label: string;
  price: number;
  // Descripción para la tienda (avatares) o para quien dibuja (objetos).
  blurb: string;
  // Solo objetos: dónde va.
  slot?: CasilleroColeccion;
  // Objetos de cabeza, ojos, cara o colgante: objeto ya ajustado con la
  // misma forma y ubicación (sombrero de ala, vincha, lentes, moño, collar).
  molde?: string;
  // Solo avatares: personaje existente con el mismo encuadre (para ubicar
  // gorros y lentes sobre el nuevo).
  comoAvatar?: string;
  // Coleccionable: solo se vende en la temporada de ese año (no vuelve).
  unicaVez?: number;
}

export interface Temporada {
  id: string;
  label: string; // la fecha: «Día de la Tradición»
  emoji: string;
  coleccion: string; // nombre de la colección: «Aventura Argentina»
  // Día de la efeméride: [mes, día], o una fecha móvil.
  dia: [number, number] | "carnaval";
  // Días de venta antes del día (por defecto 7: del día −7 al día +7 = 15 días).
  antes?: number;
  dias?: number; // largo de la ventana (por defecto 15)
  // Años con otra ventana (p. ej. Halloween 2026, ya anunciado hasta el 2/11).
  excepciones?: Record<number, { desde: [number, number]; hasta: [number, number] }>;
  avatares: ItemColeccion[];
  objetos: ItemColeccion[];
  // Se gana superando LEGENDARIO_MUNDOS mundos con 90 % o más durante la temporada.
  legendario?: ItemColeccion;
}

export const DIAS_TEMPORADA = 15;
export const LEGENDARIO_MUNDOS = 3;

// Precios de referencia (monedas).
const AV = 180; // avatar persona
const AN = 150; // avatar animal
const MASC = 80; // mascota
const OBJ = 50; // objeto
const CAB = 60; // sombrero, gorro, vincha

const nena = "exploradora";
const nene = "explorador";

export const TEMPORADAS: Temporada[] = [
  // ───────────── OCTUBRE ─────────────
  {
    id: "animales",
    label: "Día Mundial de los Animales",
    emoji: "🐾",
    coleccion: "Guardianes de los Animales",
    dia: [10, 4],
    avatares: [
      { id: "veterinaria", label: "Veterinaria", price: AV, blurb: "Cura y cuida a los animales.", comoAvatar: nena },
      { id: "guardian-animales", label: "Guardián de los animales", price: AV, blurb: "Protege a los animales de su barrio.", comoAvatar: nene },
      { id: "exploradora-gato", label: "Exploradora con gato", price: AV, blurb: "Sale de aventura con su gatito.", comoAvatar: nena },
      { id: "naturalista", label: "Naturalista", price: AV, blurb: "Observa y anota todo sobre los animales.", comoAvatar: nene },
      { id: "perro-ovejero", label: "Perro ovejero", price: AN, blurb: "Blanco y negro, cuida las ovejas del campo.", comoAvatar: "zorro" },
      { id: "perro-salchicha", label: "Perro salchicha", price: AN, blurb: "Largo, petiso y muy cariñoso.", comoAvatar: "zorro" },
      { id: "gato-naranja", label: "Gato naranja", price: AN, blurb: "Atigrado y dormilón.", comoAvatar: "zorro" },
      { id: "gato-siames", label: "Gato siamés", price: AN, blurb: "De ojos celestes y orejas oscuras.", comoAvatar: "zorro" },
      { id: "caballo-criollo", label: "Caballo criollo", price: AN, blurb: "Pinto, fuerte y compañero.", comoAvatar: "guanaco" },
      { id: "oveja", label: "Oveja", price: AN, blurb: "Esponjosa como una nube de lana.", comoAvatar: "guanaco" },
    ],
    objetos: [
      { id: "camara-naturaleza", label: "Cámara de naturaleza", price: OBJ, slot: "pendant", molde: "sol-de-mayo", blurb: "Cámara de fotos verde colgada de una correa." },
      { id: "collar-huellita", label: "Collar de huellita", price: 40, slot: "pendant", molde: "sol-de-mayo", blurb: "Dije con forma de huella de perro, en una cinta celeste." },
      { id: "mochila-mascota", label: "Mochila para mascotas", price: OBJ, slot: "prop", blurb: "Mochila con ventanita redonda y un cachorro asomado." },
      { id: "hueso", label: "Hueso para mascota", price: 30, slot: "prop", blurb: "Hueso de juguete con moño rojo." },
      { id: "mascota-gato", label: "Mascota gato", price: MASC, slot: "pet", blurb: "Gatito gris sentado." },
      { id: "mascota-conejo", label: "Mascota conejo", price: MASC, slot: "pet", blurb: "Conejo blanco de orejas largas." },
      { id: "mascota-buho", label: "Mascota búho", price: MASC, slot: "pet", blurb: "Búho marrón de ojos grandes." },
    ],
    legendario: { id: "medalla-amigo-animales", label: "Medalla Amigo de los Animales", price: 0, slot: "pendant", molde: "sol-de-mayo", blurb: "Medalla dorada con una huella, en cinta verde." },
  },
  {
    id: "guardaparques",
    label: "Día de los Guardaparques",
    emoji: "🌳",
    coleccion: "Guardianes de la Naturaleza",
    dia: [10, 9],
    avatares: [
      { id: "guardaparque-nena", label: "Guardaparque", price: AV, blurb: "Cuida Monte León y sus animales.", comoAvatar: nena },
      { id: "brigadista", label: "Brigadista", price: AV, blurb: "Prevé y apaga incendios forestales.", comoAvatar: nene },
    ],
    objetos: [
      { id: "binoculares-parque", label: "Binoculares", price: OBJ, slot: "pendant", molde: "sol-de-mayo", blurb: "Binoculares verdes colgados al cuello." },
      { id: "brujula-parque", label: "Brújula", price: 40, slot: "pendant", molde: "sol-de-mayo", blurb: "Brújula dorada en un cordón." },
      { id: "radio-parque", label: "Radio", price: OBJ, slot: "prop", blurb: "Radio de guardaparque con antena." },
      { id: "mapa-parque", label: "Mapa del parque", price: 40, slot: "prop", blurb: "Mapa plegado con senderos y una X." },
      { id: "cantimplora", label: "Cantimplora", price: 40, slot: "prop", blurb: "Cantimplora metálica con funda verde." },
      { id: "cartel-parque", label: "Cartel de parque nacional", price: 60, slot: "prop", blurb: "Cartel de madera tallada «Parque Nacional» (sin texto legible)." },
      { id: "mascota-guanaco", label: "Mascota guanaco", price: MASC, slot: "pet", blurb: "Chulengo (guanaco bebé)." },
      { id: "mascota-pinguino", label: "Mascota pingüino", price: MASC, slot: "pet", blurb: "Pingüino de Magallanes." },
      { id: "mascota-huemul", label: "Mascota huemul", price: MASC, slot: "pet", blurb: "Huemul joven." },
      { id: "mascota-condor", label: "Mascota cóndor", price: MASC, slot: "pet", blurb: "Pichón de cóndor con collar blanco." },
    ],
    legendario: { id: "insignia-guardaparque", label: "Insignia de Guardaparque de Honor", price: 0, slot: "pendant", molde: "sol-de-mayo", blurb: "Insignia dorada con un huemul." },
  },
  {
    id: "diversidad",
    label: "Día del Respeto a la Diversidad Cultural",
    emoji: "🌎",
    coleccion: "Exploradores del Mundo",
    dia: [10, 12],
    avatares: [
      { id: "cartografa", label: "Cartógrafa", price: AV, blurb: "Dibuja mapas de lugares nuevos.", comoAvatar: nena },
      { id: "investigador-cultural", label: "Investigador cultural", price: AV, blurb: "Aprende las historias de cada pueblo.", comoAvatar: nene },
      { id: "viajera-mundo", label: "Viajera del mundo", price: AV, blurb: "Con su valija llena de libros.", comoAvatar: nena },
    ],
    objetos: [
      { id: "globo-terraqueo", label: "Globo terráqueo", price: 60, slot: "prop", blurb: "Globo terráqueo de escritorio." },
      { id: "libro-culturas", label: "Libro de culturas", price: 40, slot: "prop", blurb: "Libro grande abierto con ilustraciones de paisajes." },
      { id: "lupa", label: "Lupa", price: 30, slot: "prop", blurb: "Lupa de mango de madera." },
      { id: "valija-exploradora", label: "Valija exploradora", price: OBJ, slot: "prop", blurb: "Valija antigua con calcomanías de viajes (sin texto)." },
      { id: "gorro-explorador", label: "Gorro de explorador", price: CAB, slot: "headwear", molde: "sombrero-guardaparque", blurb: "Sombrero de ala, color arena, con cinta azul." },
    ],
    legendario: { id: "globo-dorado", label: "Globo terráqueo dorado", price: 0, slot: "prop", blurb: "Globo terráqueo dorado y brillante." },
  },
  {
    id: "halloween",
    label: "Halloween",
    emoji: "🎃",
    coleccion: "Reino de los Monstruos",
    dia: [10, 31],
    antes: 13, // del 18/10 al 1/11
    // 2026: ya se anunció «hasta el 2 de noviembre».
    excepciones: { 2026: { desde: [10, 1], hasta: [11, 2] } },
    avatares: [
      { id: "mago", label: "Mago", price: 200, blurb: "Hace aparecer números de su galera.", comoAvatar: nene },
      { id: "zombie-simpatico", label: "Zombi simpático", price: 200, blurb: "Verde, despeinado y muy amigable.", comoAvatar: nene },
    ],
    objetos: [
      { id: "varita-magica", label: "Varita mágica", price: 40, slot: "prop", blurb: "Varita con estrella en la punta y destellos." },
      { id: "escoba-voladora", label: "Escoba voladora", price: 60, slot: "prop", blurb: "Escoba de bruja con moño violeta." },
      { id: "caldero", label: "Caldero", price: OBJ, slot: "prop", blurb: "Caldero negro con poción verde burbujeante." },
      { id: "libro-hechizos", label: "Libro de hechizos", price: 40, slot: "prop", blurb: "Libro violeta con una estrella en la tapa." },
      { id: "mascota-murcielago", label: "Mascota murciélago", price: MASC, slot: "pet", blurb: "Murcielaguito violeta sonriente." },
      { id: "mascota-gato-negro", label: "Mascota gato negro", price: MASC, slot: "pet", blurb: "Gatito negro de ojos amarillos." },
      { id: "mascota-arana", label: "Araña simpática", price: 60, slot: "pet", blurb: "Arañita redonda de ojos grandes, nada aterradora." },
    ],
    legendario: { id: "mini-dragon", label: "Mini dragón mascota", price: 0, slot: "pet", blurb: "Dragoncito verde con alitas." },
  },
  // ───────────── NOVIEMBRE ─────────────
  {
    id: "tradicion",
    label: "Día de la Tradición",
    emoji: "🧉",
    coleccion: "Aventura Argentina",
    dia: [11, 10],
    avatares: [
      { id: "gauchito", label: "Gauchito", price: AV, blurb: "Con boina, pañuelo y bombachas de campo.", comoAvatar: nene },
      { id: "paisanita", label: "Paisanita", price: AV, blurb: "Con trenzas y vestido de fiesta criolla.", comoAvatar: nena },
      { id: "payador", label: "Payador", price: AV, blurb: "Inventa versos con su guitarra.", comoAvatar: nene },
      { id: "artesana", label: "Artesana", price: AV, blurb: "Teje en telar con lana de oveja.", comoAvatar: nena },
    ],
    objetos: [
      { id: "mate", label: "Mate", price: 40, slot: "prop", blurb: "Mate de calabaza con bombilla plateada." },
      { id: "termo", label: "Termo", price: 40, slot: "prop", blurb: "Termo verde de campo." },
      { id: "guitarra", label: "Guitarra", price: 70, slot: "prop", blurb: "Guitarra criolla de madera." },
      { id: "bombo-leguero", label: "Bombo legüero", price: 70, slot: "prop", blurb: "Bombo legüero con parches de cuero." },
      { id: "mascota-caballo", label: "Mascota potrillo", price: MASC, slot: "pet", blurb: "Potrillo criollo bayo." },
      { id: "mascota-oveja", label: "Mascota oveja", price: MASC, slot: "pet", blurb: "Corderito blanco." },
      { id: "mascota-ovejero", label: "Mascota perro ovejero", price: MASC, slot: "pet", blurb: "Cachorro ovejero blanco y negro." },
    ],
    legendario: { id: "poncho-gran-explorador", label: "Poncho del Gran Explorador Argentino", price: 0, slot: "face", molde: "panuelo-gaucho", blurb: "Poncho rojo con guarda pampa sobre los hombros." },
  },
  {
    id: "soberania",
    label: "Día de la Soberanía Nacional",
    emoji: "⚓",
    coleccion: "Guardianes del Río",
    dia: [11, 20],
    avatares: [
      { id: "capitana", label: "Capitana", price: AV, blurb: "Lleva el timón con valentía.", comoAvatar: nena },
      { id: "navegante", label: "Navegante", price: AV, blurb: "Conoce los ríos y las estrellas.", comoAvatar: nene },
    ],
    objetos: [
      { id: "gorra-capitan", label: "Gorra de capitán", price: CAB, slot: "headwear", molde: "casco-bombero", blurb: "Gorra blanca de capitán con ancla dorada." },
      { id: "medallon-ancla", label: "Medallón de capitán", price: OBJ, slot: "pendant", molde: "sol-de-mayo", blurb: "Medallón con ancla dorada." },
      { id: "catalejo", label: "Catalejo", price: OBJ, slot: "prop", blurb: "Catalejo de bronce." },
      { id: "salvavidas", label: "Salvavidas", price: 40, slot: "prop", blurb: "Salvavidas rojo y blanco." },
      { id: "barquito", label: "Barquito", price: 40, slot: "prop", blurb: "Barquito de madera con vela." },
      { id: "mascota-patito", label: "Patito navegante", price: MASC, slot: "pet", blurb: "Patito amarillo con gorrita de marinero." },
    ],
    legendario: { id: "timon-dorado", label: "Timón dorado", price: 0, slot: "prop", blurb: "Timón de barco de madera con detalles dorados." },
  },
  {
    id: "yaguarete",
    label: "Día Internacional del Yaguareté",
    emoji: "🐆",
    coleccion: "Guardianes de la Selva",
    dia: [11, 29],
    avatares: [], // el Guardián de la Selva es un avatar de LOGRO (leyenda de las Cataratas del Iguazú)
    objetos: [
      { id: "vincha-yaguarete", label: "Vincha de orejitas de yaguareté", price: CAB, slot: "headwear", molde: "cuernitos-dragon", blurb: "Vincha con orejitas de yaguareté manchadas." },
      { id: "binoculares-selva", label: "Binoculares de selva", price: OBJ, slot: "pendant", molde: "sol-de-mayo", blurb: "Binoculares verdes y amarillos." },
      { id: "mochila-selvatica", label: "Mochila selvática", price: OBJ, slot: "prop", blurb: "Mochila verde con hojas grandes." },
      { id: "mapa-selva", label: "Mapa de la selva", price: 40, slot: "prop", blurb: "Mapa con río y huellas." },
      { id: "mascota-tucan", label: "Mascota tucán", price: MASC, slot: "pet", blurb: "Tucán de pico naranja." },
    ],
    legendario: { id: "huella-dorada", label: "Huella dorada del yaguareté", price: 0, slot: "pendant", molde: "sol-de-mayo", blurb: "Medalla dorada con huella de yaguareté." },
  },
  // ───────────── DICIEMBRE ─────────────
  {
    id: "suelo",
    label: "Día Mundial del Suelo",
    emoji: "🌱",
    coleccion: "Pequeños Guardianes de la Tierra",
    dia: [12, 5],
    avatares: [
      { id: "jardinera", label: "Jardinera", price: AV, blurb: "Planta semillas y cuida la huerta.", comoAvatar: nena },
      { id: "agricultor", label: "Agricultor", price: AV, blurb: "Cosecha verduras de la huerta escolar.", comoAvatar: nene },
    ],
    objetos: [
      { id: "sombrero-jardin", label: "Sombrero de jardín", price: CAB, slot: "headwear", molde: "sombrero-guardaparque", blurb: "Sombrero de paja con una flor." },
      { id: "maceta-brote", label: "Maceta con brote", price: 40, slot: "prop", blurb: "Maceta de barro con un brote verde." },
      { id: "regadera", label: "Regadera", price: 40, slot: "prop", blurb: "Regadera celeste con gotitas." },
      { id: "girasol", label: "Girasol", price: 40, slot: "prop", blurb: "Girasol grande y sonriente." },
      { id: "microscopio", label: "Microscopio", price: 70, slot: "prop", blurb: "Microscopio escolar." },
      { id: "mascota-lombriz", label: "Lombriz amiga", price: 60, slot: "pet", blurb: "Lombriz rosada con sombrerito de hoja." },
    ],
    legendario: { id: "arbol-vida", label: "Árbol de la vida", price: 0, slot: "prop", blurb: "Arbolito con frutos dorados en una maceta." },
  },
  {
    id: "montanas",
    label: "Día Internacional de las Montañas",
    emoji: "🏔️",
    coleccion: "Cumbres de Aventura",
    dia: [12, 11],
    avatares: [
      { id: "montanista", label: "Montañista", price: AV, blurb: "Sube al Chaltén con su mochila.", comoAvatar: nena },
      { id: "guia-montana", label: "Guía de montaña", price: AV, blurb: "Conoce todos los senderos.", comoAvatar: nene },
    ],
    objetos: [
      { id: "gorro-montana", label: "Gorro de montaña", price: CAB, slot: "headwear", molde: "gorro-orejeras", blurb: "Gorro tejido rojo con pompón y orejeras." },
      { id: "antiparras-nieve", label: "Antiparras de nieve", price: OBJ, slot: "eyewear", molde: "antiparras-cientifico", blurb: "Antiparras naranjas espejadas." },
      { id: "cuerda-montana", label: "Cuerda de escalada", price: 40, slot: "prop", blurb: "Rollo de cuerda azul con mosquetón." },
      { id: "carpa-montana", label: "Carpa", price: 70, slot: "prop", blurb: "Carpa iglú naranja." },
      { id: "mini-montana", label: "Mini montaña", price: 60, slot: "prop", blurb: "Montañita nevada decorativa (como el Fitz Roy)." },
    ],
    legendario: { id: "bandera-cumbre", label: "Bandera de cumbre", price: 0, slot: "prop", blurb: "Banderín celeste y blanco clavado en una roca nevada." },
  },
  {
    id: "navidad",
    label: "Navidad",
    emoji: "🎄",
    coleccion: "El Reino de la Navidad",
    dia: [12, 25],
    antes: 10, // del 15 al 29 de diciembre
    avatares: [
      { id: "papa-noel", label: "Papá Noel", price: 220, blurb: "Con barba blanca y risa contagiosa.", comoAvatar: nene },
      { id: "elfo", label: "Elfo", price: 200, blurb: "Arma juguetes en el taller.", comoAvatar: nene },
      { id: "guardiana-renos", label: "Guardiana de renos", price: 200, blurb: "Cuida a los renos antes del viaje.", comoAvatar: nena },
      { id: "muneco-nieve", label: "Muñeco de nieve", price: 200, blurb: "Con bufanda y nariz de zanahoria.", comoAvatar: "pinguino" },
      { id: "ayudante-navidad", label: "Ayudante navideña", price: 200, blurb: "Envuelve regalos a toda velocidad.", comoAvatar: nena },
    ],
    objetos: [
      { id: "baston-caramelo", label: "Bastón de caramelo", price: 30, slot: "prop", blurb: "Bastón rojo y blanco." },
      { id: "regalo", label: "Regalo", price: 40, slot: "prop", blurb: "Caja de regalo verde con moño rojo." },
      { id: "bola-nieve", label: "Bola de nieve", price: OBJ, slot: "prop", blurb: "Bola de cristal con un pinito adentro." },
      { id: "campana-navidad", label: "Campana navideña", price: 40, slot: "pendant", molde: "sol-de-mayo", blurb: "Campanita dorada con acebo." },
      { id: "mascota-reno", label: "Mascota reno", price: MASC, slot: "pet", blurb: "Renito de nariz roja." },
      { id: "mascota-osito-polar", label: "Mascota osito polar", price: MASC, slot: "pet", blurb: "Osito polar con bufanda." },
      { id: "mascota-zorro-artico", label: "Mascota zorro ártico", price: MASC, slot: "pet", blurb: "Zorrito blanco." },
    ],
    legendario: { id: "trineo-volador", label: "Trineo volador", price: 0, slot: "prop", blurb: "Trineo rojo con estela de estrellas." },
  },
  {
    id: "anio-nuevo",
    label: "Año Nuevo",
    emoji: "🎆",
    coleccion: "Festival del Nuevo Año",
    dia: [12, 31],
    antes: 1, // del 30/12 al 13/1
    avatares: [
      { id: "explorador-futuro", label: "Explorador del futuro", price: AV, blurb: "Viene del año que empieza.", comoAvatar: nene },
      { id: "astronauta", label: "Astronauta", price: AV, blurb: "Explora el espacio.", comoAvatar: nena },
    ],
    objetos: [
      { id: "gorro-fiesta-dorado", label: "Gorro de fiesta dorado", price: CAB, slot: "headwear", molde: "tiara-estrellas", blurb: "Gorrito cónico dorado con estrellas." },
      { id: "lentes-estrellas-nuevo", label: "Lentes de fiesta", price: 40, slot: "eyewear", molde: "lentes-aviador", blurb: "Lentes dorados brillantes." },
      { id: "globo", label: "Globo", price: 30, slot: "prop", blurb: "Globo violeta con cinta." },
      { id: "trompeta-fiesta", label: "Cornetita", price: 30, slot: "prop", blurb: "Cornetita de fiesta con flecos." },
    ],
    legendario: { id: "cohete-nuevo", label: "Cohete de Año Nuevo", price: 0, slot: "prop", blurb: "Cohete de juguete con estela de colores." },
  },
  // ───────────── ENERO ─────────────
  {
    id: "verano",
    label: "Vacaciones de verano",
    emoji: "🏖️",
    coleccion: "Verano Aventurero",
    dia: [1, 17],
    avatares: [
      { id: "guardavidas", label: "Guardavidas", price: AV, blurb: "Cuida a todos en la playa.", comoAvatar: nena },
      { id: "surfista", label: "Surfista", price: AV, blurb: "Surfea las olas del Atlántico.", comoAvatar: nene },
      { id: "buzo", label: "Buzo", price: AV, blurb: "Explora el fondo del mar.", comoAvatar: nene },
    ],
    objetos: [
      { id: "lentes-playa", label: "Lentes de playa", price: 40, slot: "eyewear", molde: "lentes-aviador", blurb: "Lentes de sol de colores." },
      { id: "sombrero-playa", label: "Sombrero de playa", price: CAB, slot: "headwear", molde: "sombrero-guardaparque", blurb: "Sombrero de ala ancha celeste." },
      { id: "tabla-surf", label: "Tabla de surf", price: 60, slot: "prop", blurb: "Tabla con olas dibujadas." },
      { id: "caracola", label: "Caracola", price: 30, slot: "prop", blurb: "Caracola rosada." },
      { id: "pelota-playa", label: "Pelota de playa", price: 30, slot: "prop", blurb: "Pelota de gajos de colores." },
      { id: "mascota-delfin", label: "Mascota delfín", price: MASC, slot: "pet", blurb: "Delfín austral saltando." },
      { id: "mascota-cangrejo", label: "Mascota cangrejo", price: MASC, slot: "pet", blurb: "Cangrejito rojo sonriente." },
    ],
    legendario: { id: "tabla-dorada", label: "Tabla de surf dorada", price: 0, slot: "prop", blurb: "Tabla de surf dorada brillante." },
  },
  {
    id: "educacion-ambiental",
    label: "Día de la Educación Ambiental",
    emoji: "♻️",
    coleccion: "Ecoexploradores",
    dia: [1, 26],
    avatares: [{ id: "ecoexploradora", label: "Ecoexploradora", price: AV, blurb: "Recicla, planta y cuida el agua.", comoAvatar: nena }],
    objetos: [
      { id: "botella-reutilizable", label: "Botella reutilizable", price: 30, slot: "prop", blurb: "Botella verde con hojita." },
      { id: "tacho-reciclaje", label: "Cesto de reciclaje", price: 40, slot: "prop", blurb: "Cesto verde con símbolo de reciclar." },
      { id: "panel-solar", label: "Panel solar", price: 60, slot: "prop", blurb: "Panelito solar con un sol sonriente." },
      { id: "bicicleta", label: "Bicicleta", price: 70, slot: "prop", blurb: "Bici celeste con canasto." },
      { id: "mascota-abeja", label: "Mascota abeja", price: MASC, slot: "pet", blurb: "Abejita redonda." },
      { id: "mascota-mariposa", label: "Mascota mariposa", price: MASC, slot: "pet", blurb: "Mariposa de alas naranjas." },
    ],
    legendario: { id: "planeta-verde", label: "Planeta verde", price: 0, slot: "prop", blurb: "Planeta Tierra con árboles y un brillo verde." },
  },
  // ───────────── FEBRERO / MARZO ─────────────
  {
    id: "humedales",
    label: "Día Mundial de los Humedales",
    emoji: "💧",
    coleccion: "Guardianes del Agua",
    dia: [2, 2],
    avatares: [
      { id: "biologa", label: "Bióloga", price: AV, blurb: "Estudia las lagunas y sus aves.", comoAvatar: nena },
      { id: "guardian-agua", label: "Guardián del agua", price: AV, blurb: "Cuida ríos y lagunas.", comoAvatar: nene },
    ],
    objetos: [
      { id: "gorro-lluvia", label: "Gorro de lluvia", price: CAB, slot: "headwear", molde: "sombrero-guardaparque", blurb: "Gorro impermeable amarillo." },
      { id: "botas-lluvia", label: "Botas de lluvia", price: 40, slot: "prop", blurb: "Botas de goma verdes." },
      { id: "juncos", label: "Juncos", price: 30, slot: "prop", blurb: "Matita de juncos con una gota." },
      { id: "mascota-rana", label: "Mascota rana", price: MASC, slot: "pet", blurb: "Ranita verde." },
      { id: "mascota-flamenco", label: "Mascota flamenco", price: MASC, slot: "pet", blurb: "Flamenco austral rosado." },
      { id: "mascota-tortuga", label: "Mascota tortuga", price: MASC, slot: "pet", blurb: "Tortuguita de agua." },
    ],
    legendario: { id: "gota-cristal", label: "Gota de cristal", price: 0, slot: "pendant", molde: "sol-de-mayo", blurb: "Dije de gota de agua de cristal celeste." },
  },
  {
    id: "carnaval",
    label: "Carnaval",
    emoji: "🎭",
    coleccion: "Carnaval de los Mundos",
    dia: "carnaval",
    avatares: [
      { id: "rey-carnaval", label: "Rey del Carnaval", price: 200, blurb: "Con capa de colores y corona.", comoAvatar: nene },
      { id: "reina-carnaval", label: "Reina del Carnaval", price: 200, blurb: "Con plumas y lentejuelas.", comoAvatar: nena },
      { id: "murguero", label: "Murguero", price: 200, blurb: "Toca el bombo y baila en la murga.", comoAvatar: nene },
    ],
    objetos: [
      { id: "mascara-carnaval", label: "Máscara de carnaval", price: OBJ, slot: "eyewear", molde: "lentes-corazon", blurb: "Antifaz dorado con plumas de colores." },
      { id: "corona-plumas", label: "Corona de plumas", price: CAB, slot: "headwear", molde: "tiara-estrellas", blurb: "Corona con plumas de colores." },
      { id: "tambor", label: "Tambor", price: OBJ, slot: "prop", blurb: "Redoblante con palillos." },
      { id: "confeti", label: "Confeti", price: 30, slot: "prop", blurb: "Lluvia de papelitos de colores." },
    ],
    legendario: { id: "corona-carnaval", label: "Corona del Carnaval", price: 0, slot: "headwear", molde: "tiara-estrellas", blurb: "Corona dorada con gemas de colores." },
  },
  {
    id: "regreso",
    label: "Inicio de clases",
    emoji: "🎒",
    coleccion: "Regreso a la Aventura",
    dia: [2, 25], // en Santa Cruz el ciclo empieza a fines de febrero
    antes: 3,
    avatares: [
      { id: "cientifica", label: "Científica", price: AV, blurb: "Hace experimentos con su delantal.", comoAvatar: nena },
      { id: "superestudiante", label: "Superestudiante", price: AV, blurb: "Con capa y mochila, ¡a aprender!", comoAvatar: nene },
    ],
    objetos: [
      { id: "gorra-escolar", label: "Gorra escolar", price: CAB, slot: "headwear", molde: "casco-bombero", blurb: "Gorrita azul con un lápiz bordado." },
      { id: "anteojos-lectura", label: "Anteojos de lectura", price: 40, slot: "eyewear", molde: "lentes-aviador", blurb: "Anteojos redondos de marco rojo." },
      { id: "lapiz-gigante", label: "Lápiz gigante", price: 40, slot: "prop", blurb: "Lápiz amarillo enorme." },
      { id: "crayones", label: "Crayones", price: 30, slot: "prop", blurb: "Caja de crayones de colores." },
      { id: "abaco", label: "Ábaco", price: OBJ, slot: "prop", blurb: "Ábaco de madera con cuentas de colores." },
      { id: "pila-libros", label: "Pila de libros", price: 40, slot: "prop", blurb: "Tres libros de colores apilados." },
    ],
    legendario: { id: "mochila-legendaria", label: "Mochila legendaria", price: 0, slot: "prop", blurb: "Mochila dorada con estrellas." },
  },
];

// Fechas del resto del año: quedan en el calendario para la segunda tanda
// (sus colecciones se definen más adelante; sin ítems no aparecen).
export const TEMPORADAS_FASE_2: { id: string; label: string; emoji: string; dia: [number, number]; idea: string }[] = [
  { id: "malvinas", label: "Día del Veterano y de los Caídos en Malvinas", emoji: "🇦🇷", dia: [4, 2], idea: "«Héroes de Malvinas» (nombre de la escuela): escarapela, pin de las islas, avatar de soldado/a respetuoso, sin armas." },
  { id: "tierra", label: "Día de la Tierra", emoji: "🌍", dia: [4, 22], idea: "Planeta, plantas, reciclaje." },
  { id: "mayo", label: "Semana de Mayo", emoji: "🎗️", dia: [5, 25], idea: "Cabildo: vendedores ambulantes (mazamorrera, velero, aguatero), escarapela, paraguas." },
  { id: "bandera", label: "Día de la Bandera", emoji: "🇦🇷", dia: [6, 20], idea: "Belgrano (ya en la tienda permanente), bandera, banderín." },
  { id: "independencia", label: "Día de la Independencia", emoji: "🏛️", dia: [7, 9], idea: "Casa de Tucumán, damas y caballeros de 1816, empanadas." },
  { id: "invierno", label: "Vacaciones de invierno", emoji: "⛷️", dia: [7, 20], idea: "Esquí en El Calafate, trineo, muñeco de nieve patagónico." },
  { id: "san-martin", label: "Paso a la Inmortalidad de San Martín", emoji: "🐴", dia: [8, 17], idea: "Cruce de los Andes: mula, granadero, mapa de la travesía." },
  { id: "infancias", label: "Día de las Infancias", emoji: "🎈", dia: [8, 16], idea: "Juguetes, globos, barrilete, calesita." },
  { id: "maestro", label: "Día del Maestro", emoji: "🍎", dia: [9, 11], idea: "Sarmiento, pizarrón, manzana, tiza." },
  { id: "estudiante", label: "Día del Estudiante y la Primavera", emoji: "🌸", dia: [9, 21], idea: "Flores, picnic, guitarra, mochila de egresado." },
];
