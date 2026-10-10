// Fichas de la Reserva patagónica: animales, plantas, objetos tradicionales y
// símbolos que se ganan en cada etapa (actividad especial de 3.º y 4.º).
// Datos revisados por Claude el 10/10/2026. Cada especie lleva su fuente y la
// fecha del dato de población o de conservación.

// Categorías de la Lista Roja de la UICN (o de la categorización argentina,
// cuando se aclara en el texto).
export type Categoria = "CR" | "EN" | "VU" | "NT" | "LC";

export const NOMBRE_CATEGORIA: Record<Categoria, string> = {
  CR: "En peligro crítico",
  EN: "En peligro",
  VU: "Vulnerable",
  NT: "Casi amenazada",
  LC: "No está amenazada",
};

// Distintivo de «en peligro de extinción» (pedido de Pedro): CR y EN.
export function enPeligro(c: Categoria | undefined): boolean {
  return c === "CR" || c === "EN";
}

export interface Especie {
  id: string;
  tipo: "animal" | "planta";
  nombre: string;
  cientifico: string;
  emoji: string;
  alimentacion: string;
  habitat: string;
  comportamiento: string;
  poblacion: string;
  categoria: Categoria;
  conservacion: string;
  curioso: string;
  dondeVerlo: string;
  fuente: string;
}

export interface ObjetoTradicional {
  id: string;
  nombre: string;
  emoji: string;
  texto: string;
}

export interface Emblema {
  id: string;
  tipo: "bandera" | "escudo";
  nombre: string;
  texto: string;
  fuente?: string; // sin fuente = todavía falta el archivo oficial
}

export const ESPECIES: Especie[] = [
  // ---------------------------------------------------------------- animales
  {
    id: "huemul",
    tipo: "animal",
    nombre: "Huemul",
    cientifico: "Hippocamelus bisulcus",
    emoji: "🦌",
    alimentacion: "Es herbívoro: come brotes y hojas de arbustos, hierbas, flores y frutos del bosque.",
    habitat: "Laderas rocosas y bosques de la cordillera, desde Neuquén hasta Santa Cruz.",
    comportamiento: "Vive solo o en grupos chicos. Cuando siente peligro se queda quieto. El macho tiene astas, las pierde en invierno y le crecen de nuevo cada año. La hembra tiene una sola cría por año, en primavera o verano.",
    poblacion: "Quedan menos de 1.500 en el mundo (2010). En la Argentina se calculan entre 350 y 600 (2005), en grupos separados.",
    categoria: "EN",
    conservacion: "Es Monumento Natural Nacional (Ley 24.702, de 1996) y también provincial en Santa Cruz. Lo amenazan los perros, las enfermedades del ganado, la caza y los ciervos traídos de otros países.",
    curioso: "Está en el escudo de Chile, junto al cóndor.",
    dondeVerlo: "Parque Nacional Perito Moreno y Parque Nacional Los Glaciares.",
    fuente: "Parques Nacionales (argentina.gob.ar) y Lista Roja de la UICN; datos de 2005 y 2010.",
  },
  {
    id: "maca-tobiano",
    tipo: "animal",
    nombre: "Macá tobiano",
    cientifico: "Podiceps gallardoi",
    emoji: "🐦",
    alimentacion: "Come bichitos del agua (larvas y caracoles chiquitos) que busca buceando entre las plantas de las lagunas.",
    habitat: "En verano, lagunas de las mesetas altas del oeste de Santa Cruz. En invierno, cuando las lagunas se congelan, va a las desembocaduras de los ríos en la costa del mar.",
    comportamiento: "Bucea muy bien. En primavera las parejas hacen una danza: nadan juntas y se levantan sobre el agua. Hace su nido flotante con plantas acuáticas.",
    poblacion: "Unos 5.000 en 1980, unos 500 en 2015 y cerca de 1.000 en 2018.",
    categoria: "CR",
    conservacion: "Es Monumento Natural Provincial de Santa Cruz desde 2009. Lo amenazan el visón americano y las truchas (traídos de otros países) y la gaviota cocinera.",
    curioso: "Vive solo en Santa Cruz: no existe en ningún otro lugar del mundo. Lo descubrieron en 1974.",
    dondeVerlo: "Parque Nacional Patagonia, en la meseta del lago Buenos Aires.",
    fuente: "Aves Argentinas y nota de Billiken (7/1/2024) con datos de 1980, 2015 y 2018.",
  },
  {
    id: "pinguino-penacho",
    tipo: "animal",
    nombre: "Pingüino de penacho amarillo",
    cientifico: "Eudyptes chrysocome",
    emoji: "🐧",
    alimentacion: "Come krill (camarones chiquitos), calamares y peces pequeños que caza en el mar.",
    habitat: "Islas rocosas del mar. En Santa Cruz anida en la Isla Pingüino, frente a Puerto Deseado.",
    comportamiento: "Sube por las rocas a los saltos, con las dos patas juntas. Llega en primavera para criar y se va al mar en otoño. Vive en colonias ruidosas.",
    poblacion: "La población del mundo bajó mucho en las últimas décadas.",
    categoria: "VU",
    conservacion: "Está protegido en el Parque Interjurisdiccional Marino Isla Pingüino. Lo afectan los cambios del mar y la falta de alimento.",
    curioso: "Tiene plumas amarillas sobre los ojos, como cejas, y los ojos rojos.",
    dondeVerlo: "Isla Pingüino, saliendo en lancha desde Puerto Deseado.",
    fuente: "Parques Nacionales (argentina.gob.ar, 2019) y Lista Roja de la UICN.",
  },
  {
    id: "tonina-overa",
    tipo: "animal",
    nombre: "Tonina overa",
    cientifico: "Cephalorhynchus commersonii",
    emoji: "🐬",
    alimentacion: "Come peces chicos, calamares y camarones.",
    habitat: "Aguas frías y poco profundas de la costa: bahías, rías y desembocaduras de ríos.",
    comportamiento: "Anda en grupos chicos. Es muy rápida y le gusta nadar junto a las lanchas. Tiene una cría cada vez.",
    poblacion: "Es común en la costa patagónica.",
    categoria: "LC",
    conservacion: "No está amenazada, pero algunas quedan atrapadas en redes de pesca.",
    curioso: "Es blanca y negra, como una vaca overa: de ahí su nombre. Es uno de los delfines más chicos del mundo.",
    dondeVerlo: "Bahía de San Julián y ría Deseado.",
    fuente: "Lista Roja de la UICN (2017).",
  },
  {
    id: "puma",
    tipo: "animal",
    nombre: "Puma",
    cientifico: "Puma concolor",
    emoji: "🐆",
    alimentacion: "Es carnívoro: caza guanacos, liebres, choiques y otros animales.",
    habitat: "Toda la Patagonia: estepa, cañadones, bosques y costa.",
    comportamiento: "Vive solo y caza de noche o al atardecer. Recorre distancias muy largas. La madre cuida a sus cachorros más de un año.",
    poblacion: "Está en casi toda la Argentina.",
    categoria: "LC",
    conservacion: "No está amenazado, pero a veces lo cazan porque ataca a las ovejas.",
    curioso: "Es el felino más grande de la Patagonia. No ruge: maúlla, silba y gruñe.",
    dondeVerlo: "Parque Nacional Monte León (es muy difícil verlo, pero se encuentran sus huellas).",
    fuente: "Lista Roja de la UICN.",
  },
  {
    id: "condor",
    tipo: "animal",
    nombre: "Cóndor andino",
    cientifico: "Vultur gryphus",
    emoji: "🦅",
    alimentacion: "Es carroñero: come animales que ya están muertos. Así ayuda a limpiar el campo.",
    habitat: "Montañas y acantilados de la cordillera y de la costa.",
    comportamiento: "Planea durante horas aprovechando el viento, casi sin mover las alas. Pone un solo huevo cada dos o tres años y puede vivir más de 50 años.",
    poblacion: "Bajó en muchos lugares de los Andes.",
    categoria: "VU",
    conservacion: "Su mayor peligro son los cebos con veneno que algunos ponen en el campo. Hay proyectos que crían pichones y los liberan.",
    curioso: "Con las alas abiertas mide unos 3 metros: es una de las aves voladoras más grandes del mundo.",
    dondeVerlo: "Alrededor de El Chaltén y en el Parque Nacional Los Glaciares.",
    fuente: "Lista Roja de la UICN (2020).",
  },
  {
    id: "cauquen-colorado",
    tipo: "animal",
    nombre: "Cauquén colorado",
    cientifico: "Chloephaga rubidiceps",
    emoji: "🪿",
    alimentacion: "Es herbívoro: come pastos tiernos y brotes cerca del agua.",
    habitat: "En primavera y verano cría en el sur de Santa Cruz y en Chile. En invierno vive en el sur de la provincia de Buenos Aires.",
    comportamiento: "Migra: cada otoño viaja unos 2.400 kilómetros hacia el norte y en primavera vuelve al sur.",
    poblacion: "En el continente quedan menos de 1.000 (CONICET, 2020). En las Islas Malvinas hay muchos más.",
    categoria: "CR",
    conservacion: "En el continente está en peligro crítico de extinción. Durante años lo cazaron como si fuera una plaga del trigo. Hoy es Monumento Natural en la provincia de Buenos Aires.",
    curioso: "Es el más chico de los cauquenes y tiene la cabeza color canela.",
    dondeVerlo: "Alrededores de Río Gallegos, en primavera.",
    fuente: "CONICET, nota del 31/8/2020; Aves Argentinas (2008).",
  },
  {
    id: "carpintero-gigante",
    tipo: "animal",
    nombre: "Carpintero gigante",
    cientifico: "Campephilus magellanicus",
    emoji: "🐦‍⬛",
    alimentacion: "Come larvas de insectos que busca debajo de la corteza de los árboles.",
    habitat: "Bosques de lenga, ñire y coihue de la cordillera y de Tierra del Fuego.",
    comportamiento: "Anda en familia. Golpea los troncos con el pico para buscar comida y hacer su nido en un hueco.",
    poblacion: "Vive en todo el bosque andino patagónico.",
    categoria: "LC",
    conservacion: "No está amenazado, pero necesita bosques con árboles viejos.",
    curioso: "El macho tiene la cabeza roja; la hembra, negra con un copete enrulado.",
    dondeVerlo: "Parque Nacional Tierra del Fuego.",
    fuente: "Lista Roja de la UICN.",
  },
  {
    id: "ballena-franca",
    tipo: "animal",
    nombre: "Ballena franca austral",
    cientifico: "Eubalaena australis",
    emoji: "🐋",
    alimentacion: "Filtra el agua con sus barbas y se queda con el krill y otros bichitos del mar.",
    habitat: "Mar abierto. De mayo a diciembre llega a los golfos de Península Valdés para tener sus crías.",
    comportamiento: "Las madres cuidan a su cría cerca de la costa. Saltan, asoman la cola y echan un chorro de agua en forma de V.",
    poblacion: "En 2021 se fotografiaron 827 ballenas en Península Valdés, entre ellas 320 crías.",
    categoria: "LC",
    conservacion: "Es Monumento Natural Nacional desde 1984. Estuvo a punto de desaparecer por la caza y se recuperó: por eso hoy no está en peligro. La afectan los ataques de gaviotas, las redes y los choques con barcos.",
    curioso: "Cada ballena tiene en la cabeza unas manchas blancas (callosidades) distintas, como una huella digital.",
    dondeVerlo: "Puerto Pirámides, en Península Valdés.",
    fuente: "Instituto de Conservación de Ballenas, informe 2021; Lista Roja de la UICN.",
  },
  {
    id: "huillin",
    tipo: "animal",
    nombre: "Huillín",
    cientifico: "Lontra provocax",
    emoji: "🦦",
    alimentacion: "Come sobre todo cangrejos de río y también peces.",
    habitat: "Lagos, ríos y arroyos del bosque. En el Parque Nacional Nahuel Huapi vive la única población de agua dulce del país.",
    comportamiento: "Es solitario. Bucea hasta unos 10 metros y aguanta casi un minuto bajo el agua. La hembra tiene de 2 a 4 cachorros.",
    poblacion: "Es muy escaso y difícil de ver.",
    categoria: "EN",
    conservacion: "Está en peligro. Lo cazaban por su piel hasta 1950. Hoy lo amenazan el visón americano, la contaminación y los perros.",
    curioso: "Donde vive el huillín, el agua está sana.",
    dondeVerlo: "Parque Nacional Nahuel Huapi (se encuentran sus huellas en la orilla).",
    fuente: "Parque Nacional Nahuel Huapi, folleto del huillín.",
  },
  {
    id: "gato-andino",
    tipo: "animal",
    nombre: "Gato andino",
    cientifico: "Leopardus jacobita",
    emoji: "🐈",
    alimentacion: "Caza sobre todo chinchillones (vizcachas de montaña).",
    habitat: "Zonas rocosas de montaña y de estepa. En la Patagonia vive en el norte de Neuquén.",
    comportamiento: "Es solitario y muy tímido. Casi nadie lo vio: se lo conoce por fotos de cámaras trampa.",
    poblacion: "Quedan menos de 2.200 en toda Sudamérica (2026).",
    categoria: "EN",
    conservacion: "Es el único felino de América en peligro de extinción. Lo amenazan la caza, los atropellos en las rutas y que hay menos chinchillones.",
    curioso: "Tiene la cola muy gruesa y larga, con anillos, que le sirve para equilibrarse en las rocas.",
    dondeVerlo: "Es casi imposible verlo: vive escondido en la montaña.",
    fuente: "Mongabay Latam, nota del 24/6/2026, con datos de WCS Argentina.",
  },
  // ---------------------------------------------------------------- plantas
  {
    id: "calafate",
    tipo: "planta",
    nombre: "Calafate",
    cientifico: "Berberis microphylla",
    emoji: "🫐",
    alimentacion: "Como toda planta, fabrica su alimento con la luz del sol.",
    habitat: "Estepa, orillas de ríos y bordes del bosque de toda la Patagonia.",
    comportamiento: "Es un arbusto con espinas. En primavera tiene flores amarillas y en verano frutos violetas que comen las aves y las personas.",
    poblacion: "Es común en toda la Patagonia.",
    categoria: "LC",
    conservacion: "No está amenazado.",
    curioso: "Dice la leyenda: «quien come calafate, vuelve a la Patagonia». Con sus frutos se hacen dulces.",
    dondeVerlo: "En casi toda Santa Cruz, también en Gobernador Gregores.",
    fuente: "Sistema de Información de Biodiversidad, Parques Nacionales.",
  },
  {
    id: "neneo",
    tipo: "planta",
    nombre: "Neneo",
    cientifico: "Mulinum spinosum",
    emoji: "🌼",
    alimentacion: "Fabrica su alimento con la luz del sol.",
    habitat: "Estepa seca y ventosa.",
    comportamiento: "Crece bajito y redondo, como un almohadón, para que el viento no lo dañe. Sus hojas terminan en espinas y en verano se llena de flores amarillas.",
    poblacion: "Es muy común en la estepa.",
    categoria: "LC",
    conservacion: "No está amenazado.",
    curioso: "Su forma de almohadón protege del viento a bichitos y a plantas chiquitas que crecen a su lado.",
    dondeVerlo: "En toda la meseta, por ejemplo cerca de Perito Moreno.",
    fuente: "Sistema de Información de Biodiversidad, Parques Nacionales.",
  },
  {
    id: "molle",
    tipo: "planta",
    nombre: "Molle",
    cientifico: "Schinus johnstonii",
    emoji: "🌿",
    alimentacion: "Fabrica su alimento con la luz del sol.",
    habitat: "Cañadones y laderas de la estepa, donde hay un poco de reparo.",
    comportamiento: "Es un arbusto alto, con ramas duras y frutos chiquitos que comen las aves.",
    poblacion: "Es común en los cañadones de Santa Cruz y Chubut.",
    categoria: "LC",
    conservacion: "No está amenazado.",
    curioso: "Los pueblos originarios usaban su madera dura para el fuego.",
    dondeVerlo: "En los cañadones cerca de la ría Deseado.",
    fuente: "Sistema de Información de Biodiversidad, Parques Nacionales.",
  },
  {
    id: "coiron",
    tipo: "planta",
    nombre: "Coirón",
    cientifico: "Festuca y Pappostipa (varias especies)",
    emoji: "🌾",
    alimentacion: "Fabrica su alimento con la luz del sol.",
    habitat: "Estepa de toda la Patagonia.",
    comportamiento: "Es un pasto duro que crece en matas. Sus raíces sujetan la tierra para que el viento no se la lleve.",
    poblacion: "Es el pasto más común de la meseta.",
    categoria: "LC",
    conservacion: "No está amenazado, pero si hay demasiadas ovejas el suelo se queda sin pasto y se vuelve desierto.",
    curioso: "Es el alimento de los guanacos y de las ovejas de las estancias.",
    dondeVerlo: "En el camino a Puerto San Julián y en toda la meseta.",
    fuente: "INTA y Sistema de Información de Biodiversidad.",
  },
  {
    id: "mata-negra",
    tipo: "planta",
    nombre: "Mata negra",
    cientifico: "Mulguraea tridens",
    emoji: "🌱",
    alimentacion: "Fabrica su alimento con la luz del sol.",
    habitat: "Estepa del centro y del sur de Santa Cruz.",
    comportamiento: "Es un arbusto de hojas muy chiquitas y oscuras. En verano se cubre de flores blancas con perfume.",
    poblacion: "Forma grandes manchas en la estepa.",
    categoria: "LC",
    conservacion: "No está amenazada.",
    curioso: "Los pobladores la usaban como leña porque prende fácil, aunque esté verde.",
    dondeVerlo: "Alrededor de Puerto Santa Cruz y Piedra Buena.",
    fuente: "INTA y Sistema de Información de Biodiversidad.",
  },
  {
    id: "notro",
    tipo: "planta",
    nombre: "Notro",
    cientifico: "Embothrium coccineum",
    emoji: "🌺",
    alimentacion: "Fabrica su alimento con la luz del sol.",
    habitat: "Bordes del bosque andino, desde Neuquén hasta Tierra del Fuego.",
    comportamiento: "Es un árbol o arbusto que en primavera se llena de flores rojas. Los picaflores toman su néctar y llevan el polen de flor en flor.",
    poblacion: "Es común en el bosque.",
    categoria: "LC",
    conservacion: "No está amenazado.",
    curioso: "También lo llaman ciruelillo o fosforito, por sus flores rojas.",
    dondeVerlo: "En El Chaltén y en El Calafate.",
    fuente: "Sistema de Información de Biodiversidad, Parques Nacionales.",
  },
  {
    id: "murtilla",
    tipo: "planta",
    nombre: "Murtilla",
    cientifico: "Empetrum rubrum",
    emoji: "🍒",
    alimentacion: "Fabrica su alimento con la luz del sol.",
    habitat: "Estepa fría y húmeda del sur de Santa Cruz, Tierra del Fuego y las Islas Malvinas.",
    comportamiento: "Crece pegada al suelo, como una alfombra. Tiene frutos rojos que comen las aves.",
    poblacion: "Es común en el extremo sur.",
    categoria: "LC",
    conservacion: "No está amenazada.",
    curioso: "Sus frutos son alimento de los cauquenes y de otras aves.",
    dondeVerlo: "En Cabo Vírgenes y cerca de Río Gallegos.",
    fuente: "Sistema de Información de Biodiversidad, Parques Nacionales.",
  },
  {
    id: "lenga",
    tipo: "planta",
    nombre: "Lenga",
    cientifico: "Nothofagus pumilio",
    emoji: "🍁",
    alimentacion: "Fabrica su alimento con la luz del sol.",
    habitat: "Bosques de la cordillera y de Tierra del Fuego, hasta donde empieza la nieve.",
    comportamiento: "Es un árbol que pierde las hojas en invierno. En otoño sus hojas se ponen rojas y amarillas.",
    poblacion: "Forma bosques muy grandes.",
    categoria: "LC",
    conservacion: "No está amenazada, pero sus bosques sufren incendios y el daño de los castores.",
    curioso: "Arriba de la montaña, por el viento y la nieve, la lenga crece torcida y bajita.",
    dondeVerlo: "Parque Nacional Tierra del Fuego.",
    fuente: "Sistema de Información de Biodiversidad, Parques Nacionales.",
  },
  {
    id: "alerce",
    tipo: "planta",
    nombre: "Alerce",
    cientifico: "Fitzroya cupressoides",
    emoji: "🌲",
    alimentacion: "Fabrica su alimento con la luz del sol.",
    habitat: "Bosques muy húmedos de la cordillera, cerca de los lagos.",
    comportamiento: "Crece muy despacio y llega a ser altísimo. Vive miles de años.",
    poblacion: "Quedan pocos bosques de alerce.",
    categoria: "EN",
    conservacion: "Está en peligro porque durante muchos años lo talaron por su madera. Hoy está protegido.",
    curioso: "En el Parque Nacional Los Alerces hay un alerce de unos 2.600 años: le dicen «El Abuelo».",
    dondeVerlo: "Parque Nacional Los Alerces, cerca de Esquel.",
    fuente: "Parques Nacionales y Lista Roja de la UICN.",
  },
  {
    id: "coihue",
    tipo: "planta",
    nombre: "Coihue",
    cientifico: "Nothofagus dombeyi",
    emoji: "🌳",
    alimentacion: "Fabrica su alimento con la luz del sol.",
    habitat: "Bosques húmedos de la cordillera, en Neuquén, Río Negro y Chubut.",
    comportamiento: "Es un árbol muy alto que no pierde las hojas en invierno.",
    poblacion: "Es común alrededor del lago Nahuel Huapi.",
    categoria: "LC",
    conservacion: "No está amenazado.",
    curioso: "Puede medir más de 40 metros: tan alto como un edificio de 13 pisos.",
    dondeVerlo: "Parque Nacional Nahuel Huapi.",
    fuente: "Sistema de Información de Biodiversidad, Parques Nacionales.",
  },
  {
    id: "pehuen",
    tipo: "planta",
    nombre: "Pehuén (araucaria)",
    cientifico: "Araucaria araucana",
    emoji: "🌲",
    alimentacion: "Fabrica su alimento con la luz del sol.",
    habitat: "Montañas de Neuquén y del sur de Chile.",
    comportamiento: "Es un árbol de hojas duras y puntiagudas. Crece muy despacio y puede vivir más de mil años. Sus semillas son los piñones.",
    poblacion: "Sus bosques ocupan un área chica.",
    categoria: "EN",
    conservacion: "Está en peligro por los incendios, la tala y los animales que comen sus plantas jóvenes.",
    curioso: "Los pehuenches («gente del pehuén») comen sus piñones hervidos, tostados o hechos harina.",
    dondeVerlo: "Parque Nacional Lanín y Villa Pehuenia.",
    fuente: "Lista Roja de la UICN; Universidad Nacional de Cuyo.",
  },
];

export const OBJETOS: ObjetoTradicional[] = [
  { id: "boleadoras", nombre: "Boleadoras", emoji: "🪨", texto: "Dos o tres piedras redondas unidas con tiras de cuero. Los aonikenk (tehuelches) las lanzaban para atrapar guanacos y choiques. Después las usaron también los paisanos." },
  { id: "quillango", nombre: "Quillango", emoji: "🧥", texto: "Manta de cueros de guanaco cosidos y pintados por el lado de adentro. Los aonikenk la usaban como abrigo y como cama." },
  { id: "mate", nombre: "Mate", emoji: "🧉", texto: "En la Patagonia el mate se comparte en la casa, en el campo y en la escuela. Con la pava sobre la estufa, es una costumbre de todos los días." },
  { id: "tijera-esquila", nombre: "Tijera de esquila", emoji: "✂️", texto: "En las estancias, las comparsas de esquila cortaban la lana de las ovejas con estas tijeras. La lana de Santa Cruz se vendía al mundo." },
  { id: "recado", nombre: "Recado criollo", emoji: "🐴", texto: "Es la montura del paisano: varias capas de cuero y lana sobre el caballo. Sirve para andar muchas horas por el campo." },
  { id: "huso", nombre: "Huso para hilar", emoji: "🧶", texto: "Un palito con una rueda de madera que gira para convertir la lana en hilo. Con ese hilo se tejen ponchos, matras y fajas." },
  { id: "lampara-minero", nombre: "Lámpara de minero", emoji: "🔦", texto: "Los mineros de Río Turbio la llevan en el casco para ver dentro de la mina de carbón." },
  { id: "canoa-corteza", nombre: "Canoa de corteza", emoji: "🛶", texto: "Los yaganes (yámanas) del canal Beagle hacían canoas con corteza de árbol. Adentro llevaban un pequeño fuego para calentarse." },
  { id: "tetera-galesa", nombre: "Tetera galesa", emoji: "🫖", texto: "Los colonos galeses llegaron a Chubut en 1865, en el barco Mimosa. Trajeron la costumbre del té con torta galesa." },
  { id: "trapelacucha", nombre: "Trapelacucha", emoji: "📿", texto: "Joya mapuche de plata que las mujeres llevan en el pecho. Los plateros mapuche la hacen a mano." },
  { id: "witral", nombre: "Witral (telar mapuche)", emoji: "🪡", texto: "Telar de cuatro palos donde las tejedoras mapuche hacen mantas y fajas con dibujos que tienen significado." },
];

// Escudos y banderas oficiales, sin modificar (ver docs/CREDITOS-IMAGENES.md:
// archivos de Wikimedia Commons con licencia CC BY 4.0, CC BY-SA 4.0 o de
// dominio público). Los escudos municipales que todavía no conseguimos en
// una fuente con licencia clara se ven con el dibujo de un escudo genérico
// hasta que Pedro traiga el archivo oficial del municipio.
export const EMBLEMAS: Emblema[] = [
  { id: "bandera-santa-cruz", tipo: "bandera", nombre: "Bandera de Santa Cruz", texto: "Bandera oficial de la provincia de Santa Cruz.", fuente: "Wikimedia Commons, CC BY 4.0." },
  { id: "escudo-perito-moreno", tipo: "escudo", nombre: "Escudo de Perito Moreno", texto: "Escudo de la localidad de Perito Moreno, cabecera del departamento Lago Buenos Aires." },
  { id: "escudo-puerto-deseado", tipo: "escudo", nombre: "Escudo de Puerto Deseado", texto: "Escudo de la localidad de Puerto Deseado, cabecera del departamento Deseado." },
  { id: "escudo-puerto-san-julian", tipo: "escudo", nombre: "Escudo de Puerto San Julián", texto: "Escudo de la localidad de Puerto San Julián, cabecera del departamento Magallanes.", fuente: "Wikimedia Commons, CC BY-SA 4.0." },
  { id: "escudo-puerto-santa-cruz", tipo: "escudo", nombre: "Escudo de Puerto Santa Cruz", texto: "Escudo de la localidad de Puerto Santa Cruz, cabecera del departamento Corpen Aike." },
  { id: "escudo-el-calafate", tipo: "escudo", nombre: "Escudo de El Calafate", texto: "Escudo de la localidad de El Calafate, cabecera del departamento Lago Argentino. Autora: María de los Ángeles De Vito.", fuente: "Wikimedia Commons, CC BY 4.0." },
  { id: "escudo-santa-cruz", tipo: "escudo", nombre: "Escudo de Santa Cruz", texto: "Escudo oficial de la provincia de Santa Cruz.", fuente: "Wikimedia Commons, CC BY 4.0." },
  { id: "bandera-tierra-del-fuego", tipo: "bandera", nombre: "Bandera de Tierra del Fuego", texto: "Bandera oficial de la provincia de Tierra del Fuego, Antártida e Islas del Atlántico Sur. Diseño de Teresa Beatriz Martínez.", fuente: "Wikimedia Commons, dominio público." },
  { id: "bandera-chubut", tipo: "bandera", nombre: "Bandera del Chubut", texto: "Bandera oficial de la provincia del Chubut. Diseño de Roxana Vanesa Jones.", fuente: "Wikimedia Commons, CC BY 4.0." },
  { id: "bandera-rio-negro", tipo: "bandera", nombre: "Bandera de Río Negro", texto: "Bandera oficial de la provincia de Río Negro. Diseño de Daniel Cuomo.", fuente: "Wikimedia Commons, CC BY 4.0." },
  { id: "bandera-neuquen", tipo: "bandera", nombre: "Bandera del Neuquén", texto: "Bandera oficial de la provincia del Neuquén. Diseño de Aldo Mástice.", fuente: "Wikimedia Commons, CC BY 4.0." },
];

// Premio por recorrer los siete departamentos de Santa Cruz.
export const MEDALLA_SANTA_CRUZ: ObjetoTradicional = {
  id: "medalla-santa-cruz",
  nombre: "Medalla de la expedición por Santa Cruz",
  emoji: "🏅",
  texto: "Por recorrer los siete departamentos de Santa Cruz, desde Río Chico hasta Güer Aike.",
};

export function especie(id: string): Especie {
  const e = ESPECIES.find((x) => x.id === id);
  if (!e) throw new Error(`Especie desconocida: ${id}`);
  return e;
}
