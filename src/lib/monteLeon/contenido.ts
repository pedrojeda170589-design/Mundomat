// Contenido pedagógico del Mundo Especial «Viaje a Monte León» (3.º grado).
// Fuente: Google Doc de Pedro (clases 2, 3 y 4 del proyecto de viaje de estudio).
import type { ActivitySpec } from "@/lib/activities";

export interface EtapaMonteLeon {
  id: number; // 1..5
  titulo: string;
  subtitulo: string;
  escena: string;
  objetoId: string;
  descripcion: string;
}

export const ETAPAS_MONTE_LEON: EtapaMonteLeon[] = [
  {
    id: 1,
    titulo: "El viaje",
    subtitulo: "De la meseta a la costa por las rutas 25 y 3",
    escena: "/theme/monte-leon/escenas/viaje-ruta.jpg",
    objetoId: "botella-agua-ml",
    descripcion: "Unos 380 km en micro escolar desde Gobernador Gregores hacia el mar.",
  },
  {
    id: 2,
    titulo: "El parque",
    subtitulo: "Historia, creación y la Cabeza del León",
    escena: "/theme/monte-leon/escenas/cabeza-del-leon.jpg",
    objetoId: "anteojos-sol-ml",
    descripcion: "El primer parque nacional costero-marino de la Argentina, creado en 2004.",
  },
  {
    id: 3,
    titulo: "Los animales",
    subtitulo: "Pingüinos, lobos marinos, cormoranes, guanacos y choiques",
    escena: "/theme/monte-leon/escenas/pinguinera.jpg",
    objetoId: "gorra-ml",
    descripcion: "Más de 60.000 parejas de pingüinos de Magallanes anidan en primavera.",
  },
  {
    id: 4,
    titulo: "Las normas y el guardaparque",
    subtitulo: "Cuidar la naturaleza y respetar las reglas del parque",
    escena: "/theme/monte-leon/escenas/guardaparque.jpg",
    objetoId: "protector-solar-ml",
    descripcion: "No dejar nada más que huellas, no llevarse nada más que fotos y recuerdos.",
  },
  {
    id: 5,
    titulo: "Dictado del viaje",
    subtitulo: "Palabras y oraciones de nuestra expedición",
    escena: "/theme/monte-leon/escenas/viaje-ruta.jpg",
    objetoId: "golosina-ml",
    descripcion: "Escuchá y escribí las palabras del viaje con voz y buena ortografía.",
  },
];

// Helper para mezclar elementos sin mutar el original
function shuffleArray<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ============================================================================
// BANCO ETAPA 1: EL VIAJE (16 actividades)
// ============================================================================
const BANCO_ETAPA_1: readonly ActivitySpec[] = [
  {
    type: "order",
    id: "ml-e1-orden-recorrido",
    title: "El viaje: recorrido",
    prompt: "Ordená las paradas del viaje desde la salida en la escuela hasta la llegada al parque:",
    items: [
      "Salida desde Gobernador Gregores",
      "Paso por Comandante Luis Piedrabuena",
      "Entrada al Parque Nacional Monte León",
    ],
    correctOrder: [0, 1, 2],
    hint: "Pista: salimos de Gregores por la Ruta 25, cruzamos Piedrabuena y bajamos por la Ruta 3 hacia Monte León.",
  },
  {
    type: "mc",
    id: "ml-e1-rutas-viaje",
    title: "El viaje: las rutas",
    prompt: "¿Por qué rutas viajamos desde Gobernador Gregores hasta la entrada de Monte León?",
    choices: [
      "Por la Ruta Provincial 25 y después por la Ruta Nacional 3",
      "Únicamente por la Ruta Nacional 40 hacia el oeste",
      "Por la Ruta Provincial 12 hasta la costa de Puerto Deseado",
      "Por la Ruta Nacional 3 de punta a punta",
    ],
    answerIndex: 0,
    hint: "Pista: primero tomamos la Ruta Provincial 25 hacia el este y luego la Ruta Nacional 3 hacia el sur.",
  },
  {
    type: "mc",
    id: "ml-e1-distancia-total",
    title: "El viaje: distancia",
    prompt: "¿Aproximadamente cuántos kilómetros recorremos en total desde Gregores hasta Monte León?",
    choices: [
      "Aproximadamente 380 kilómetros",
      "Alrededor de 100 kilómetros",
      "Cerca de 950 kilómetros",
      "Menos de 50 kilómetros",
    ],
    answerIndex: 0,
    hint: "Pista: son casi 400 kilómetros de viaje en micro escolar cruzando la provincia.",
  },
  {
    type: "mc",
    id: "ml-e1-tiempo-viaje",
    title: "El viaje: tiempo",
    prompt: "¿Cuánto tiempo estimado dura el viaje en micro escolar hasta llegar al parque?",
    choices: [
      "Unas 4 horas de viaje",
      "Alrededor de 1 hora",
      "Más de 12 horas",
      "Aproximadamente 30 minutos",
    ],
    answerIndex: 0,
    hint: "Pista: a velocidad segura de micro escolar, el viaje toma unas 4 horas.",
  },
  {
    type: "mc",
    id: "ml-e1-direccion-cardinal",
    title: "El viaje: orientación",
    prompt: "En el mapa de Santa Cruz, ¿en qué dirección cardinal viajamos desde Gregores hacia Monte León?",
    choices: [
      "Hacia el este-sureste",
      "Hacia el oeste cordillerano",
      "Directo hacia el norte",
      "Hacia el sudoeste cordillerano",
    ],
    answerIndex: 0,
    hint: "Pista: vamos desde el centro de la provincia hacia la costa atlántica del sur.",
  },
  {
    type: "mc",
    id: "ml-e1-cambio-paisaje",
    title: "El viaje: el paisaje",
    prompt: "¿Cómo cambia el paisaje a medida que avanzamos desde Gregores hacia la costa del mar?",
    choices: [
      "Pasa de la meseta con coirón y cañadones a la costa con acantilados y playas",
      "Pasa de una selva tupida a montañas nevadas permanentes",
      "Se mantiene idéntico con bosques de lengas todo el camino",
      "Pasa de médanos tropicales a llanuras verdes húmedas",
    ],
    answerIndex: 0,
    hint: "Pista: salimos de la estepa de meseta y llegamos al paisaje marítimo con acantilados.",
  },
  {
    type: "mc",
    id: "ml-e1-donde-estamos-puente",
    title: "¿Cerca de dónde estamos?",
    prompt: "¿Cerca de qué lugar estamos si el micro cruza un gran puente sobre el río Santa Cruz?",
    choices: [
      "Comandante Luis Piedrabuena",
      "La entrada de Monte León",
      "Gobernador Gregores",
      "El centro de la pingüinera",
    ],
    answerIndex: 0,
    hint: "Pista: en Piedrabuena la ruta cruza el caudaloso río Santa Cruz por un puente destacado.",
  },
  {
    type: "mc",
    id: "ml-e1-donde-estamos-coiron",
    title: "¿Cerca de dónde estamos?",
    prompt: "¿En qué ambiente estamos si a los costados del camino vemos suelo pedregoso y matas de coirón?",
    choices: [
      "En la meseta patagónica",
      "En la playa marina",
      "Sobre la pasarela de la pingüinera",
      "En el muelle de Piedrabuena",
    ],
    answerIndex: 0,
    hint: "Pista: el coirón y el suelo pedregoso son típicos de la meseta y la estepa patagónica.",
  },
  {
    type: "mc",
    id: "ml-e1-donde-estamos-acantilado",
    title: "¿Cerca de dónde estamos?",
    prompt: "¿En qué lugar estamos si divisamos acantilados altos frente a las olas del Mar Argentino?",
    choices: [
      "En la costa de Monte León",
      "En la salida de Gobernador Gregores",
      "En la plaza de Piedrabuena",
      "En el medio de la meseta central",
    ],
    answerIndex: 0,
    hint: "Pista: los altos acantilados con vista al Mar Argentino caracterizan a Monte León.",
  },
  {
    type: "mc",
    id: "ml-e1-vegetacion-meseta",
    title: "El viaje: vegetación",
    prompt: "¿Qué tipo de vegetación es característica de la meseta que atravesamos al inicio del viaje?",
    choices: [
      "Matas bajas y coirón adaptados al viento y la aridez",
      "Pastos muy altos y húmedos de pantano",
      "Enredaderas frondosas y helechos gigantes",
      "Árboles frutales de hojas grandes y tiernas",
    ],
    answerIndex: 0,
    hint: "Pista: en la meseta patagónica crecen matas espinosas y coirones resistentes al viento.",
  },
  {
    type: "mc",
    id: "ml-e1-tipo-playa",
    title: "El viaje: las playas",
    prompt: "¿Qué tipo de playa encontramos al descender a la costa de Monte León?",
    choices: [
      "Playas de canto rodado con restingas y acantilados",
      "Playas de arena fina blanca con palmeras",
      "Costas de barro profundo sin olas ni viento",
      "Barrancas de tierra blanda sin piedras",
    ],
    answerIndex: 0,
    hint: "Pista: en nuestra costa patagónica predominan los cantos rodados (piedritas redondeadas).",
  },
  {
    type: "mc",
    id: "ml-e1-relieve-canadones",
    title: "El viaje: geoformas",
    prompt: "Durante el recorrido por la meseta, ¿qué formaciones naturales del terreno solemos observar?",
    choices: [
      "Cañadones y mesetas escalonadas",
      "Volcanes con lava activa",
      "Grandes glaciares sobre el camino",
      "Cataratas caudalosas de selva",
    ],
    answerIndex: 0,
    hint: "Pista: los cañadones son valles profundos labrados en la meseta por antiguos ríos.",
  },
  {
    type: "mc",
    id: "ml-e1-rio-piedrabuena",
    title: "El viaje: los ríos",
    prompt: "¿Qué río importante bordea la localidad de Piedrabuena en nuestro trayecto hacia el mar?",
    choices: [
      "El río Santa Cruz",
      "El río Chico",
      "El río Paraná",
      "El río Colorado",
    ],
    answerIndex: 0,
    hint: "Pista: el río Santa Cruz nace en el lago Argentino y desemboca en el Atlántico.",
  },
  {
    type: "mc",
    id: "ml-e1-seguridad-micro",
    title: "El viaje: seguridad",
    prompt: "¿Por qué es obligatorio viajar con el cinturón de seguridad abrochado en el micro?",
    choices: [
      "Porque nos protege ante cualquier frenada imprevista en la ruta",
      "Porque nos ayuda a no quedarnos dormidos",
      "Porque solo sirve para mirar por la ventanilla",
      "Porque hace que el micro viaje a más velocidad",
    ],
    answerIndex: 0,
    hint: "Pista: el cinturón de seguridad salva vidas y nos cuida en cualquier viaje por ruta.",
  },
  {
    type: "mc",
    id: "ml-e1-hidratacion-viaje",
    title: "El viaje: en el micro",
    prompt: "¿Qué elemento conviene llevar a mano en el asiento durante las 4 horas de viaje?",
    choices: [
      "Una botella de agua para mantenernos hidratados",
      "Una valija pesada y grande de viaje",
      "Una carpa de campamento armada",
      "Una pelota de fútbol inflada",
    ],
    answerIndex: 0,
    hint: "Pista: hidratarse con agua durante viajes largos es fundamental para sentirse bien.",
  },
  {
    type: "mc",
    id: "ml-e1-viento-patagonico",
    title: "El viaje: el clima",
    prompt: "¿Qué factor del clima patagónico suele sentirse con más fuerza en la meseta y en la costa?",
    choices: [
      "El viento constante que sopla del oeste",
      "La humedad tropical sin brisa",
      "Las lluvias torrenciales de verano",
      "El calor sofocante sin corrientes de aire",
    ],
    answerIndex: 0,
    hint: "Pista: el viento patagónico es constante y característico de toda nuestra región.",
  },
];

// ============================================================================
// BANCO ETAPA 2: EL PARQUE (16 actividades)
// ============================================================================
const BANCO_ETAPA_2: readonly ActivitySpec[] = [
  {
    type: "mc",
    id: "ml-e2-que-es-parque",
    title: "El parque: qué es",
    prompt: "¿Qué es un Parque Nacional según las leyes argentinas?",
    choices: [
      "Un territorio protegido por ley nacional para conservar la naturaleza y el patrimonio",
      "Una plaza pública de juegos en el centro de una ciudad",
      "Un campo privado destinado a la cría comercial de ovejas",
      "Un parque de diversiones con juegos mecánicos",
    ],
    answerIndex: 0,
    hint: "Pista: un Parque Nacional protege por ley la flora, fauna y paisajes para siempre.",
  },
  {
    type: "mc",
    id: "ml-e2-primer-costero-marino",
    title: "El parque: su importancia",
    prompt: "¿Por qué Monte León es un parque histórico en el sistema de áreas protegidas de Argentina?",
    choices: [
      "Porque es el primer parque nacional costero-marino del país",
      "Porque es el parque más antiguo de Sudamérica",
      "Porque es el único parque ubicado en la cordillera",
      "Porque es el parque más pequeño del continente",
    ],
    answerIndex: 0,
    hint: "Pista: fue el primer parque creado para proteger tanto la costa como el mar argentino.",
  },
  {
    type: "mc",
    id: "ml-e2-anio-creacion",
    title: "El parque: año de creación",
    prompt: "¿En qué año fue creado oficialmente el Parque Nacional Monte León por ley nacional?",
    choices: [
      "En el año 2004",
      "En el año 1934",
      "En el año 1810",
      "En el año 2022",
    ],
    answerIndex: 0,
    hint: "Pista: se creó a comienzos del siglo XXI, en el año 2004.",
  },
  {
    type: "mc",
    id: "ml-e2-provincia-ubicacion",
    title: "El parque: ubicación",
    prompt: "¿En qué provincia argentina se encuentra ubicado el Parque Nacional Monte León?",
    choices: [
      "En la provincia de Santa Cruz",
      "En la provincia de Chubut",
      "En la provincia de Río Negro",
      "En la provincia de Buenos Aires",
    ],
    answerIndex: 0,
    hint: "Pista: está en nuestra provincia de Santa Cruz, sobre el litoral del Mar Argentino.",
  },
  {
    type: "mc",
    id: "ml-e2-origen-nombre",
    title: "El parque: el nombre",
    prompt: "¿De dónde proviene el nombre «Monte León» que identifica al parque?",
    choices: [
      "De una geoforma costera que el viento y el mar desgastaron hasta parecer un león acostado",
      "De antiguos exploradores que encontraron leones africanos en la playa",
      "Del apellido del primer guardaparque de Santa Cruz",
      "De una montaña alta cubierta por bosques de pinos",
    ],
    answerIndex: 0,
    hint: "Pista: una gran roca erosionada parece la figura de un león descansando frente al mar.",
  },
  {
    type: "mc",
    id: "ml-e2-billete-diez-pesos",
    title: "El parque: en los billetes",
    prompt: "¿En el reverso de qué billete apareció destacada la figura de la Cabeza del León?",
    choices: [
      "En el reverso del billete de $10 del Banco de la Patagonia",
      "En el billete antiguo de $100 con la imagen de Roca",
      "En una moneda de 50 centavos de curso legal",
      "En el billete de $1000 del hornero",
    ],
    answerIndex: 0,
    hint: "Pista: la Cabeza del León ilustró el reverso del billete de $10 del Banco de la Patagonia.",
  },
  {
    type: "mc",
    id: "ml-e2-fuerzas-erosion",
    title: "El parque: modelado natural",
    prompt: "¿Qué fuerzas de la naturaleza modelaron la silueta de la Cabeza del León?",
    choices: [
      "La erosión constante provocada por el viento patagónico y el choque de las olas",
      "Máquinas excavadoras durante la inauguración del parque",
      "Un terremoto repentino que partió el acantilado",
      "El trabajo manual de antiguos pobladores con herramientas",
    ],
    answerIndex: 0,
    hint: "Pista: el viento y el agua del mar desgastaron la roca a lo largo de miles de años.",
  },
  {
    type: "mc",
    id: "ml-e2-ambiente-protegido",
    title: "El parque: ambientes",
    prompt: "¿Qué ambientes naturales abarca el Parque Nacional Monte León?",
    choices: [
      "Abarca tanto la estepa patagónica como la costa marina y el mar cercano",
      "Únicamente una isla lejana sin costa en el continente",
      "Solamente montañas altas de cordillera con nieve",
      "Exclusivamente el fondo del océano profundo",
    ],
    answerIndex: 0,
    hint: "Pista: protege la estepa terrestre, las playas y acantilados y el sector marítimo.",
  },
  {
    type: "mc",
    id: "ml-e2-que-es-costero-marino",
    title: "El parque: costero-marino",
    prompt: "¿Qué significa que un parque nacional sea clasificado como «costero-marino»?",
    choices: [
      "Que protege una porción de tierra en la costa y también un sector del mar con su vida marina",
      "Que solo pueden ingresar barcos con turistas",
      "Que los animales viven únicamente sumergidos en agua salada",
      "Que está prohibido acercarse a la orilla del mar",
    ],
    answerIndex: 0,
    hint: "Pista: integra la conservación de la costa terrestre y del mar adyacente.",
  },
  {
    type: "mc",
    id: "ml-e2-quien-administra",
    title: "El parque: administración",
    prompt: "¿Qué institución estatal custodia y administra los Parques Nacionales en la Argentina?",
    choices: [
      "La Administración de Parques Nacionales",
      "Las empresas privadas de turismo",
      "Los clubes deportivos de cada provincia",
      "La policía de tránsito de las rutas",
    ],
    answerIndex: 0,
    hint: "Pista: la APN (Administración de Parques Nacionales) cuida todas las áreas protegidas nacionales.",
  },
  {
    type: "mc",
    id: "ml-e2-historia-estancia",
    title: "El parque: antes de 2004",
    prompt: "Antes de ser declarado Parque Nacional en 2004, ¿qué actividad funcionaba en esas tierras?",
    choices: [
      "Una estancia ganadera dedicada a la cría de ovejas",
      "Una fábrica con una gran ciudadela de edificios",
      "Un puerto comercial internacional de barcos",
      "Una base científica espacial de cohetes",
    ],
    answerIndex: 0,
    hint: "Pista: funcionaba la antigua Estancia Monte León, productora de lana ovina.",
  },
  {
    type: "mc",
    id: "ml-e2-objetivo-conservar",
    title: "El parque: conservación",
    prompt: "¿Cuál es uno de los objetivos más importantes de conservar Monte León?",
    choices: [
      "Cuidar la biodiversidad del Mar Argentino y la estepa para las futuras generaciones",
      "Construir grandes hoteles sobre los acantilados vírgenes",
      "Permitir la caza deportiva de guanacos y choiques",
      "Extraer piedras y arena de la playa con camiones",
    ],
    answerIndex: 0,
    hint: "Pista: conservar significa proteger la naturaleza para que siga viva en el futuro.",
  },
  {
    type: "mc",
    id: "ml-e2-creacion-ley",
    title: "El parque: cómo se crea",
    prompt: "¿Cómo se aprueba la creación de un nuevo Parque Nacional en nuestro país?",
    choices: [
      "Mediante una ley votada en el Congreso de la Nación",
      "Por decisión de una empresa turística",
      "Por sorteo público en una fiesta provincial",
      "Por una nota de un club náutico",
    ],
    answerIndex: 0,
    hint: "Pista: los Parques Nacionales se crean por ley sancionada por el Congreso Nacional.",
  },
  {
    type: "mc",
    id: "ml-e2-icono-cabeza-leon",
    title: "El parque: íconos",
    prompt: "¿Por qué la Cabeza del León es considerada el símbolo principal del parque?",
    choices: [
      "Porque es una geoforma única que le dio nombre al lugar y define su paisaje",
      "Porque es el único lugar donde duermen los cóndores",
      "Porque es una estatua de cemento fabricada por el hombre",
      "Porque allí se colocó un cartel luminoso",
    ],
    answerIndex: 0,
    hint: "Pista: su silueta natural esculpida en la roca representa la identidad de Monte León.",
  },
  {
    type: "mc",
    id: "ml-e2-patrimonio-arqueologico",
    title: "El parque: arqueología",
    prompt: "Además de la naturaleza, ¿qué patrimonio cultural protegen los cañadones de Monte León?",
    choices: [
      "Restos arqueológicos de pueblos originarios que vivieron en la costa hace miles de años",
      "Castillos coloniales con puentes levadizos",
      "Grandes pirámides antiguas de piedra pulida",
      "Vagones de tren abandonados bajo tierra",
    ],
    answerIndex: 0,
    hint: "Pista: grupos de cazadores-recolectores originarios habitaban y pescaban en esta costa.",
  },
  {
    type: "mc",
    id: "ml-e2-cuidado-visitantes",
    title: "El parque: los visitantes",
    prompt: "¿Qué oportunidad brinda visitar un Parque Nacional a los alumnos de las escuelas?",
    choices: [
      "Aprender a valorar y cuidar la naturaleza viéndola en su estado original",
      "Comprar animales silvestres para llevar al aula",
      "Cazar aves para hacer experimentos en ciencias",
      "Llevarse recuerdos de plantas arrancadas",
    ],
    answerIndex: 0,
    hint: "Pista: el contacto directo con la naturaleza nos enseña a respetarla y defenderla.",
  },
];

// ============================================================================
// BANCO ETAPA 3: LOS ANIMALES (16 actividades)
// ============================================================================
const BANCO_ETAPA_3: readonly ActivitySpec[] = [
  {
    type: "classify",
    id: "ml-e3-clasificar-ambientes",
    title: "Los animales: ¿dónde viven?",
    prompt: "Clasificá cada animal según el ambiente de Monte León donde pasa la mayor parte de su vida:",
    categories: ["Animales de la costa marina", "Animales de la estepa"],
    items: [
      { label: "Pingüino de Magallanes", categoryIndex: 0 },
      { label: "Lobo marino de un pelo", categoryIndex: 0 },
      { label: "Cormorán imperial", categoryIndex: 0 },
      { label: "Guanaco", categoryIndex: 1 },
      { label: "Choique", categoryIndex: 1 },
      { label: "Zorro colorado", categoryIndex: 1 },
    ],
    hint: "Pista: los que buscan su alimento en el mar son de la costa; guanacos, choiques y zorros recorren la estepa.",
  },
  {
    type: "mc",
    id: "ml-e3-cantidad-pinguinos",
    title: "Los animales: pingüinos",
    prompt: "¿Cuántas parejas de pingüinos de Magallanes anidan aproximadamente en Monte León?",
    choices: [
      "Más de 60.000 parejas reproductivas",
      "Menos de 50 parejas",
      "Apenas 100 pingüinos en total",
      "Alrededor de 500 ejemplares",
    ],
    answerIndex: 0,
    hint: "Pista: es una colonia inmensa con más de sesenta mil parejas de pingüinos.",
  },
  {
    type: "mc",
    id: "ml-e3-epoca-pinguinos",
    title: "Los animales: primavera",
    prompt: "¿En qué época del año llegan los pingüinos de Magallanes a la costa de Monte León?",
    choices: [
      "En primavera, entre septiembre y octubre",
      "En pleno invierno, durante las nevadas de julio",
      "A fines de otoño para hibernar bajo tierra",
      "Únicamente a mediados de febrero",
    ],
    answerIndex: 0,
    hint: "Pista: llegan en primavera para aparearse, poner sus huevos y criar a sus pichones.",
  },
  {
    type: "mc",
    id: "ml-e3-donde-anidan",
    title: "Los animales: el nido",
    prompt: "¿Dónde construyen sus nidos los pingüinos de Magallanes en Monte León?",
    choices: [
      "Cavan cuevas en la tierra arcillosa bajo matas de arbustos",
      "Sobre las copas de árboles frondosos de la costa",
      "En la nieve acumulada sobre las piedras altas",
      "Sobre balsas de algas flotando en el mar abierto",
    ],
    answerIndex: 0,
    hint: "Pista: usan sus patas y pico para cavar cuevas protegidas del viento y los predadores.",
  },
  {
    type: "mc",
    id: "ml-e3-cuantos-huevos",
    title: "Los animales: huevos",
    prompt: "¿Cuántos huevos suele poner la hembra de pingüino de Magallanes en cada nido?",
    choices: [
      "Pone dos huevos",
      "Pone un solo huevo",
      "Pone entre diez y doce huevos",
      "Pone más de veinte huevos pequeños",
    ],
    answerIndex: 0,
    hint: "Pista: ponen habitualmente 2 huevos que incuban por turnos el macho y la hembra.",
  },
  {
    type: "mc",
    id: "ml-e3-comida-pinguinos",
    title: "Los animales: alimentación marina",
    prompt: "¿De qué se alimentan principalmente los pingüinos cuando nadan en el mar?",
    choices: [
      "De peces como anchoitas y sardinas, y de calamares",
      "De pastos marinos y semillas de la orilla",
      "De insectos de la meseta y raíces secas",
      "De frutos silvestres de los arbustos costeros",
    ],
    answerIndex: 0,
    hint: "Pista: son excelentes buceadores y cazan peces pequeños y calamares bajo el agua.",
  },
  {
    type: "mc",
    id: "ml-e3-lobos-marinos",
    title: "Los animales: lobos marinos",
    prompt: "¿Qué especie de lobo marino forma grandes colonias sobre las restingas y rocas de Monte León?",
    choices: [
      "El lobo marino de un pelo",
      "La foca leopardo de la Antártida",
      "El león marino de California",
      "El oso polar costero",
    ],
    answerIndex: 0,
    hint: "Pista: el lobo marino de un pelo (o lobo común) habita las restingas patagónicas.",
  },
  {
    type: "mc",
    id: "ml-e3-cormoranes-acantilados",
    title: "Los animales: cormoranes",
    prompt: "¿Qué aves marinas de plumaje negro y blanco anidan en los paredones de los acantilados?",
    choices: [
      "Los cormoranes",
      "Los tucanes",
      "Los loros barranqueros",
      "Los colibríes",
    ],
    answerIndex: 0,
    hint: "Pista: los cormoranes imperiales forman populosas colonias sobre los acantilados marinos.",
  },
  {
    type: "mc",
    id: "ml-e3-guanaco-estepa",
    title: "Los animales: el guanaco",
    prompt: "¿Qué animal herbívoro de cuello largo y pelaje marrón recorre en manadas la estepa de Monte León?",
    choices: [
      "El guanaco",
      "La vicuña del norte",
      "El ciervo de los pantanos",
      "El tapir misionero",
    ],
    answerIndex: 0,
    hint: "Pista: el guanaco es el mamífero silvestre terrestre más grande de la Patagonia.",
  },
  {
    type: "mc",
    id: "ml-e3-choique-patagonico",
    title: "Los animales: el choique",
    prompt: "¿Qué ave corredora patagónica no vuela y se desplaza a gran velocidad por la meseta?",
    choices: [
      "El choique",
      "El pingüino rey",
      "La perdiz colorada",
      "El cóndor andino",
    ],
    answerIndex: 0,
    hint: "Pista: el choique (o ñandú petiso) corre a gran velocidad por la estepa abierta.",
  },
  {
    type: "mc",
    id: "ml-e3-cuidado-turnos",
    title: "Los animales: cuidado compartido",
    prompt: "¿Cómo se organizan los pingüinos de Magallanes para empollar sus huevos y alimentarse?",
    choices: [
      "El macho y la hembra se turnan para cuidar el nido mientras el otro pesca en el mar",
      "La madre se queda sola siempre y el padre nunca regresa",
      "Los huevos quedan solos tapados con arena",
      "Otros animales del parque cuidan los nidos",
    ],
    answerIndex: 0,
    hint: "Pista: forman parejas que comparten la crianza y la búsqueda de comida por turnos.",
  },
  {
    type: "mc",
    id: "ml-e3-alas-aletas",
    title: "Los animales: adaptaciones",
    prompt: "¿Qué adaptación especial tienen las alas de los pingüinos?",
    choices: [
      "Tienen forma de aletas rígidas que les permiten propulsarse bajo el agua como si volaran",
      "Tienen plumas largas para volar por encima de las nubes",
      "Tienen garras filosas para trepar acantilados",
      "Son membranas transparentes como las de los peces",
    ],
    answerIndex: 0,
    hint: "Pista: sus alas se transformaron en aletas fuertes y rígidas para nadar velozmente.",
  },
  {
    type: "mc",
    id: "ml-e3-defensa-choique",
    title: "Los animales: velocidad del choique",
    prompt: "¿Cómo reacciona un choique cuando detecta peligro en la estepa abierta?",
    choices: [
      "Corre a toda velocidad realizando zigzags entre las matas",
      "Levanta vuelo hacia las nubes altas",
      "Se arroja al mar para nadar hacia una isla",
      "Se entierra por completo bajo la tierra arcillosa",
    ],
    answerIndex: 0,
    hint: "Pista: sus largas patas le permiten alcanzar velocidades de más de 45 km/h.",
  },
  {
    type: "mc",
    id: "ml-e3-plumas-impermeables",
    title: "Los animales: abrigo natural",
    prompt: "¿Por qué los pingüinos no se congelan al sumergirse en las frías aguas del Mar Argentino?",
    choices: [
      "Porque tienen plumas densas y aceitosas y una capa de grasa bajo la piel",
      "Porque el agua de mar siempre está caliente en la costa",
      "Porque tienen lana gruesa como las ovejas",
      "Porque no sienten el frío debido a que no tienen nervios",
    ],
    answerIndex: 0,
    hint: "Pista: una capa impermeable de plumas y una gruesa grasa aíslan su cuerpo del frío.",
  },
  {
    type: "mc",
    id: "ml-e3-descanso-lobos",
    title: "Los animales: la lobería",
    prompt: "¿Por qué los lobos marinos salen del agua para descansar sobre las rocas de la costa?",
    choices: [
      "Para calentarse con los rayos del sol, descansar y mudar su pelaje",
      "Porque no saben nadar durante mucho tiempo",
      "Para comer pastos de la meseta",
      "Para escapar de los pingüinos",
    ],
    answerIndex: 0,
    hint: "Pista: como mamíferos, necesitan calentarse al sol y descansar en tierra firme.",
  },
  {
    type: "mc",
    id: "ml-e3-cormoran-buceo",
    title: "Los animales: cormoranes buceadores",
    prompt: "¿Cómo consiguen su alimento los cormoranes que anidan en Monte León?",
    choices: [
      "Se sumergen bajo el agua nadando con sus patas palmeadas para atrapar peces",
      "Cazan ratones en la estepa de noche",
      "Comen semillas que caen de los árboles",
      "Esperan que los pingüinos les traigan comida",
    ],
    answerIndex: 0,
    hint: "Pista: son aves zambullidoras expertas en perseguir peces bajo el agua.",
  },
];

// ============================================================================
// BANCO ETAPA 4: LAS NORMAS Y EL GUARDAPARQUE (16 actividades)
// ============================================================================
const BANCO_ETAPA_4: readonly ActivitySpec[] = [
  {
    type: "mc",
    id: "ml-e4-rol-guardaparque",
    title: "Normas: el guardaparque",
    prompt: "¿Cuál es la función principal de los guardaparques en el Parque Nacional Monte León?",
    choices: [
      "Cuidar la flora y la fauna, mantener los senderos y hacer cumplir las leyes de conservación",
      "Manejar los micros escolares de los visitantes",
      "Vender golosinas y recuerdos en la ruta",
      "Pescar calamares para abastecer a los hoteles",
    ],
    answerIndex: 0,
    hint: "Pista: los guardaparques son los custodios que protegen la naturaleza y educan a los visitantes.",
  },
  {
    type: "mc",
    id: "ml-e4-caminar-pasarelas",
    title: "Normas: pasarelas y senderos",
    prompt: "¿Por qué es fundamental caminar únicamente por las pasarelas y senderos autorizados?",
    choices: [
      "Para no pisar los nidos subterráneos de los pingüinos ni erosionar el suelo frágil",
      "Porque fuera del sendero el suelo es de lava ardiente",
      "Porque los senderos tienen alfombras para correr rápido",
      "Para que el micro nos encuentre más fácil",
    ],
    answerIndex: 0,
    hint: "Pista: los pingüinos cavan cuevas bajo el suelo; pisar fuera del camino puede derrumbar sus nidos.",
  },
  {
    type: "mc",
    id: "ml-e4-regla-oro",
    title: "Normas: la regla de oro",
    prompt: "¿Cuál es la regla de oro que debemos recordar en todos los Parques Nacionales?",
    choices: [
      "«No dejar nada más que huellas, no llevarse nada más que fotos y recuerdos»",
      "«Llevarse todas las piedras brillantes que encontremos»",
      "«Alimentar a todos los animales que se acerquen»",
      "«Dejar la basura en la orilla del mar para que se la lleve la ola»",
    ],
    answerIndex: 0,
    hint: "Pista: la regla de oro enseña a no alterar la naturaleza ni dejar ningún rastro dañino.",
  },
  {
    type: "mc",
    id: "ml-e4-basura-cero",
    title: "Normas: basura cero",
    prompt: "¿Qué debemos hacer con todos los residuos (papeles, botellas, cáscaras) durante la visita?",
    choices: [
      "Guardar todo en la mochila y traerlo de vuelta a la ciudad para tirarlo en un cesto",
      "Dejar los envoltorios escondidos debajo de una mata",
      "Tirar las cáscaras de fruta a los pingüinos porque son naturales",
      "Enterrar las botellas de plástico en la arena",
    ],
    answerIndex: 0,
    hint: "Pista: basura cero significa que todo lo que entra al parque en la mochila, vuelve en la mochila.",
  },
  {
    type: "mc",
    id: "ml-e4-caso-pichon",
    title: "Dilema: el pichón de pingüino",
    prompt: "Vemos un pichón cerca del sendero que parece solo. ¿Qué debemos hacer?",
    choices: [
      "No tocarlo ni acercarnos; avisar al guardaparque si parece en riesgo, recordando que sus padres suelen estar pescando",
      "Alzarlo para abrigarlo adentro de nuestra campera",
      "Llevarlo en la mochila al micro para adoptarlo en casa",
      "Darle galletitas dulces para que no tenga hambre",
    ],
    answerIndex: 0,
    hint: "Pista: tocar a un animal salvaje lo asusta y puede hacer que sus padres lo rechacen; nunca se tocan.",
  },
  {
    type: "mc",
    id: "ml-e4-caso-envase-vuela",
    title: "Dilema: el envase que vuela",
    prompt: "El viento patagónico levanta un paquete de galletitas que vuela hacia la restinga. ¿Qué hacemos?",
    choices: [
      "Ir a buscarlo de inmediato y guardarlo bien cerrado dentro de la mochila",
      "Dejarlo volar porque el viento se lo lleva lejos del sendero",
      "Tirarle piedras encima para que no se mueva",
      "Ignorarlo porque no era nuestro paquete",
    ],
    answerIndex: 0,
    hint: "Pista: los plásticos que vuelan al mar son ingeridos por aves y peces y les causan la muerte.",
  },
  {
    type: "mc",
    id: "ml-e4-caso-piedra-fosil",
    title: "Dilema: la piedra brillante o fósil",
    prompt: "Encontramos una piedra marina hermosa con restos fosilizados de caracoles. ¿Qué hacemos?",
    choices: [
      "Observarla con admiración, sacarle una foto y dejarla exactamente en su lugar",
      "Guardarla en el bolsillo para llevarla de adorno a casa",
      "Romperla contra otra roca para ver qué tiene adentro",
      "Llevarla para venderla a los compañeros en la escuela",
    ],
    answerIndex: 0,
    hint: "Pista: los fósiles y piedras son patrimonio de todos; deben quedar donde están para que otros los disfruten.",
  },
  {
    type: "mc",
    id: "ml-e4-no-alimentar",
    title: "Normas: no alimentar animales",
    prompt: "¿Por qué está terminantemente prohibido darle comida a los animales del parque?",
    choices: [
      "Porque la comida humana les causa enfermedades graves y altera su conducta natural",
      "Porque los animales se acostumbran a pedir caramelos",
      "Porque los animales se enojan si no les damos gaseosas",
      "Porque a los pingüinos no les gusta comer nada",
    ],
    answerIndex: 0,
    hint: "Pista: los alimentos procesados enferman a la fauna silvestre y les impiden cazar su comida natural.",
  },
  {
    type: "mc",
    id: "ml-e4-silencio-miradores",
    title: "Normas: en los miradores",
    prompt: "¿Cómo debemos comportarnos al observar a los animales desde las pasarelas y miradores?",
    choices: [
      "Mantener silencio, hablar en voz baja y respetar la distancia sin movimientos bruscos",
      "Gritar y aplaudir fuerte para que miren hacia la cámara",
      "Hacer ruidos extraños para llamarlos cerca",
      "Correr por las maderas para llegar primeros",
    ],
    answerIndex: 0,
    hint: "Pista: los ruidos fuertes asustan a los animales y pueden hacer que abandonen sus nidos con huevos.",
  },
  {
    type: "mc",
    id: "ml-e4-sin-mascotas",
    title: "Normas: mascotas",
    prompt: "¿Por qué no está permitido ingresar con mascotas (perros o gatos) al Parque Nacional?",
    choices: [
      "Porque pueden transmitir parásitos y enfermedades o atacar a las crías silvestres",
      "Porque no hay veterinarias cerca del parque",
      "Porque los perros se cansan mucho de caminar",
      "Porque los pingüinos no quieren jugar con animales domésticos",
    ],
    answerIndex: 0,
    hint: "Pista: los perros pueden cazar pingüinos o transmitir enfermedades letales a la fauna nativa.",
  },
  {
    type: "mc",
    id: "ml-e4-sendero-cerrado",
    title: "Normas: cartelería",
    prompt: "Si vemos un cartel que dice «Sendero cerrado por conservación», ¿qué debemos hacer?",
    choices: [
      "Respetar la indicación y continuar únicamente por los senderos habilitados",
      "Saltar la soga para mirar por qué lo cerraron",
      "Sacar el cartel para que nadie se confunda",
      "Entrar rápido a sacar una foto y volver corriendo",
    ],
    answerIndex: 0,
    hint: "Pista: los senderos se cierran para proteger pichones recién nacidos o recuperar el suelo desgastado.",
  },
  {
    type: "mc",
    id: "ml-e4-no-llevarse-caracoles",
    title: "Normas: nada de la playa",
    prompt: "¿Por qué no debemos juntar conchillas, caracoles ni huesos de la orilla marina?",
    choices: [
      "Porque forman parte del ciclo del ecosistema y aportan minerales al suelo marino",
      "Porque son propiedad exclusiva de los barcos de pesca",
      "Porque toman mal olor enseguida en la mochila",
      "Porque pesan demasiado para el micro escolar",
    ],
    answerIndex: 0,
    hint: "Pista: cada conchilla y caracol cumple una función natural y forma parte del paisaje costero.",
  },
  {
    type: "mc",
    id: "ml-e4-protegerse-sol",
    title: "Normas: cuidado personal",
    prompt: "¿Qué elementos son necesarios para protegernos del sol y el viento durante la caminata?",
    choices: [
      "Gorra, anteojos de sol, protector solar y una campera cortaviento",
      "Un paraguas abierto frente al viento fuerte",
      "Traje de baño y ojotas de goma para caminar",
      "Ropa de lana pesada sin nada en la cabeza",
    ],
    answerIndex: 0,
    hint: "Pista: en la costa patagónica el sol quema y el viento enfría; gorra, anteojos y protector son claves.",
  },
  {
    type: "mc",
    id: "ml-e4-prohibido-fuego",
    title: "Normas: prohibido hacer fuego",
    prompt: "¿Por qué está estrictamente prohibido encender fuego en las áreas no autorizadas?",
    choices: [
      "Porque el viento patagónico puede propagar chispas e iniciar incendios incontrolables",
      "Porque el humo molesta únicamente a los barcos del mar",
      "Porque el fuego gasta el aire del océano",
      "Porque a los guardaparques no les gusta la leña",
    ],
    answerIndex: 0,
    hint: "Pista: las chispas empujadas por el fuerte viento provocan incendios graves en la vegetación seca.",
  },
  {
    type: "mc",
    id: "ml-e4-visitante-responsable",
    title: "Normas: el buen visitante",
    prompt: "¿Qué actitud demuestra que somos visitantes respetuosos de la naturaleza?",
    choices: [
      "Escuchar a los guardaparques, cuidar el camino y regresar con todos nuestros residuos",
      "Arrancar matas de arbustos para usarlas de bastón",
      "Escribir nuestros nombres con piedras sobre la arena",
      "Llevar parlantes con música fuerte por los senderos",
    ],
    answerIndex: 0,
    hint: "Pista: cuidar, escuchar y no dejar basura demuestran respeto por la vida natural.",
  },
  {
    type: "mc",
    id: "ml-e4-agua-mochila",
    title: "Normas: salud y caminatas",
    prompt: "¿Por qué es tan importante llevar una botella con agua potable en nuestra mochila?",
    choices: [
      "Para beber periódicamente y mantenernos bien hidratados durante las caminatas",
      "Para regar las plantas que encontremos secas",
      "Para lavarnos los pies en los acantilados",
      "Para dársela a los animales que tengan sed",
    ],
    answerIndex: 0,
    hint: "Pista: caminar bajo el sol y con viento deshidrata rápido; tomar agua previene el dolor de cabeza.",
  },
];

// ============================================================================
// BANCO ETAPA 5: DICTADO DEL VIAJE (26 palabras del Doc de Pedro)
// ============================================================================
interface PalabraDictadoViaje {
  palabra: string;
  say: string;
  hint: string;
}

const PALABRAS_DICTADO_VIAJE: readonly PalabraDictadoViaje[] = [
  {
    palabra: "pingüino",
    say: "Pingüino. En la costa de Monte León anidan miles de pingüinos de Magallanes.",
    hint: "Pista: pingüino lleva diéresis con dos puntitos sobre la u para que suene güi.",
  },
  {
    palabra: "guardaparque",
    say: "Guardaparque. El guardaparque cuida los senderos y protege a los animales.",
    hint: "Pista: guardaparque empieza con gua y termina con que.",
  },
  {
    palabra: "acantilado",
    say: "Acantilado. Las olas del mar chocan con fuerza contra el acantilado.",
    hint: "Pista: acantilado se escribe con c.",
  },
  {
    palabra: "meseta",
    say: "Meseta. Durante el viaje cruzamos la meseta patagónica con matas de coirón.",
    hint: "Pista: meseta se escribe con s.",
  },
  {
    palabra: "ruta",
    say: "Ruta. Viajamos por la ruta provincial veinticinco hacia el mar.",
    hint: "Pista: ruta empieza con una sola r fuerte al inicio.",
  },
  {
    palabra: "viaje",
    say: "Viaje. Todos los chicos de tercer grado disfrutamos de este gran viaje.",
    hint: "Pista: viaje se escribe con v corta y con j.",
  },
  {
    palabra: "mochila",
    say: "Mochila. Guardamos la botella de agua y los residuos dentro de la mochila.",
    hint: "Pista: mochila se escribe con ch.",
  },
  {
    palabra: "colectivo",
    say: "Colectivo. El colectivo escolar tardó unas cuatro horas en llegar a destino.",
    hint: "Pista: colectivo lleva c antes de la t y v corta.",
  },
  {
    palabra: "playa",
    say: "Playa. Caminamos despacio por la playa de canto rodado.",
    hint: "Pista: playa se escribe con y griega.",
  },
  {
    palabra: "lobo marino",
    say: "Lobo marino. En las restingas descansan familias de lobo marino.",
    hint: "Pista: lobo marino se escribe con b larga y v corta.",
  },
  {
    palabra: "cormorán",
    say: "Cormorán. El cormorán es un ave marina que anida en los acantilados.",
    hint: "Pista: cormorán es palabra aguda y lleva tilde en la a.",
  },
  {
    palabra: "guanaco",
    say: "Guanaco. Vimos una manada de guanacos pastando en la estepa.",
    hint: "Pista: guanaco empieza con gua y termina con co.",
  },
  {
    palabra: "choique",
    say: "Choique. El choique corre a gran velocidad entre los arbustos.",
    hint: "Pista: choique empieza con ch y termina con que.",
  },
  {
    palabra: "parque",
    say: "Parque. Monte León es el primer parque costero-marino del país.",
    hint: "Pista: parque se escribe con qu.",
  },
  {
    palabra: "costa",
    say: "Costa. Al llegar a la costa sentimos la brisa fresca del mar.",
    hint: "Pista: costa se escribe con c.",
  },
  {
    palabra: "huevo",
    say: "Huevo. La hembra de pingüino suele poner dos huevos en el nido.",
    hint: "Pista: huevo empieza con h muda y se escribe con v corta.",
  },
  {
    palabra: "nido",
    say: "Nido. Los pingüinos cuidan con dedicación su nido bajo tierra.",
    hint: "Pista: nido se escribe con n y d.",
  },
  {
    palabra: "cueva",
    say: "Cueva. Cada pareja de pingüinos cava una cueva profunda.",
    hint: "Pista: cueva se escribe con c y con v corta.",
  },
  {
    palabra: "sendero",
    say: "Sendero. Para cuidar el suelo caminamos únicamente por el sendero.",
    hint: "Pista: sendero empieza con s.",
  },
  {
    palabra: "pasarela",
    say: "Pasarela. Nos asomamos a la pingüinera desde la pasarela de madera.",
    hint: "Pista: pasarela se escribe con s.",
  },
  {
    palabra: "basura",
    say: "Basura. En el parque nacional se respeta la regla de cero basura.",
    hint: "Pista: basura se escribe con b larga y con s.",
  },
  {
    palabra: "protector",
    say: "Protector. Nos pusimos protector solar en la cara antes de caminar.",
    hint: "Pista: protector lleva c antes de la t final.",
  },
  {
    palabra: "gorra",
    say: "Gorra. Nos pusimos una gorra para protegernos del sol del mediodía.",
    hint: "Pista: gorra lleva doble r entre vocales.",
  },
  {
    palabra: "botella",
    say: "Botella. Llevamos una botella de agua fresca para la excursión.",
    hint: "Pista: botella se escribe con b larga y con doble l.",
  },
  {
    palabra: "Piedrabuena",
    say: "Piedrabuena. Cruzamos el gran puente al pasar por Piedrabuena.",
    hint: "Pista: Piedrabuena es nombre propio, empieza con mayúscula y lleva b larga.",
  },
  {
    palabra: "Monte León",
    say: "Monte León. Qué hermosa expedición vivimos en Monte León.",
    hint: "Pista: Monte León son dos palabras con mayúscula y León lleva tilde en la o.",
  },
];

// Transforma una palabra del banco de dictado en una ActivitySpec de dictation
function crearActividadDictado(item: PalabraDictadoViaje, index: number): ActivitySpec {
  return {
    type: "dictation",
    id: `ml-dict-${index}-${item.palabra.toLowerCase().replace(/\s+/g, "-")}`,
    title: "Dictado del viaje",
    prompt: "Escuchá con atención y escribí la palabra dictada:",
    say: item.say,
    answer: item.palabra,
    kind: "palabra",
    strictAccents: true,
    hint: item.hint,
  };
}

// ============================================================================
// CONSTRUCCIÓN DE VUELTAS DE 8 ACTIVIDADES POR ETAPA
// ============================================================================
export const ACTIVIDADES_POR_VUELTA = 8;

/**
 * Devuelve una vuelta de 8 actividades para la etapa solicitada (1..5).
 * - Etapas 1..4: selecciona 8 actividades distintas del banco temático de 16+.
 *   Si existe una actividad interactiva clave (order o classify), se garantiza su inclusión.
 * - Etapa 5: selecciona 8 palabras distintas del banco de 26 palabras del Doc.
 */
export function buildMonteLeonActivities(etapa: number): ActivitySpec[] {
  if (etapa === 5) {
    const elegidas = shuffleArray(PALABRAS_DICTADO_VIAJE).slice(0, ACTIVIDADES_POR_VUELTA);
    return elegidas.map((item, idx) => crearActividadDictado(item, idx));
  }

  let banco: readonly ActivitySpec[];
  switch (etapa) {
    case 1:
      banco = BANCO_ETAPA_1;
      break;
    case 2:
      banco = BANCO_ETAPA_2;
      break;
    case 3:
      banco = BANCO_ETAPA_3;
      break;
    case 4:
      banco = BANCO_ETAPA_4;
      break;
    default:
      banco = BANCO_ETAPA_1;
      break;
  }

  // Si la primera actividad del banco es un juego interactivo (order o classify),
  // nos aseguramos de que siempre esté presente en la vuelta de 8 actividades.
  const interactiva = banco.find((a) => a.type === "order" || a.type === "classify");
  const resto = banco.filter((a) => a !== interactiva);
  const mezcladasResto = shuffleArray(resto);

  if (interactiva) {
    const elegidas = [interactiva, ...mezcladasResto.slice(0, ACTIVIDADES_POR_VUELTA - 1)];
    return shuffleArray(elegidas);
  }

  return mezcladasResto.slice(0, ACTIVIDADES_POR_VUELTA);
}

/**
 * Devuelve todas las actividades de un banco sin recortar (para pruebas y verificación).
 */
export function obtenerBancoCompletoEtapa(etapa: number): readonly (ActivitySpec | PalabraDictadoViaje)[] {
  switch (etapa) {
    case 1:
      return BANCO_ETAPA_1;
    case 2:
      return BANCO_ETAPA_2;
    case 3:
      return BANCO_ETAPA_3;
    case 4:
      return BANCO_ETAPA_4;
    case 5:
      return PALABRAS_DICTADO_VIAJE;
    default:
      return [];
  }
}
