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
    subtitulo: "De la meseta a la costa por las rutas 27 y 3",
    escena: "/theme/monte-leon/escenas/viaje-ruta.jpg",
    objetoId: "botella-agua-ml",
    descripcion: "Unos 240 km en micro escolar desde Gobernador Gregores hacia el mar.",
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
// BANCOS DE PREGUNTAS (reescritos por Claude el 7/10/2026 tras la revisión de
// AG-19): opciones plausibles y de largo parecido, sin opciones de chiste, con
// vocabulario de 3.º grado. La respuesta correcta va PRIMERA en el banco; al
// armar la vuelta se mezclan las opciones (ver mezclarActividad).
// ============================================================================
function mc(id: string, title: string, prompt: string, opciones: [string, string, string], hint: string): ActivitySpec {
  return { type: "mc", id, title, prompt, choices: [...opciones], answerIndex: 0, hint };
}
function orden(id: string, title: string, prompt: string, enOrden: string[], hint: string): ActivitySpec {
  return { type: "order", id, title, prompt, items: [...enOrden], correctOrder: enOrden.map((_, i) => i), hint };
}
function clasif(id: string, title: string, prompt: string, categorias: [string, string], a: string[], b: string[], hint: string): ActivitySpec {
  return {
    type: "classify",
    id,
    title,
    prompt,
    categories: [...categorias],
    items: [...a.map((label) => ({ label, categoryIndex: 0 })), ...b.map((label) => ({ label, categoryIndex: 1 }))],
    hint,
  };
}

// ETAPA 1: EL VIAJE (clase 2 del Doc de Pedro)
const T1 = "El viaje";
const BANCO_ETAPA_1: readonly ActivitySpec[] = [
  orden("ml-e1-orden-recorrido", T1, "Ordená el recorrido del viaje, desde la escuela hasta el parque.",
    ["Salimos de Gobernador Gregores", "Pasamos por Comandante Luis Piedrabuena", "Llegamos al Parque Nacional Monte León"],
    "Pista: primero la Ruta 27 hasta Piedrabuena y después la Ruta 3 hacia el sur."),
  clasif("ml-e1-meseta-costa", T1, "¿Dónde lo vemos durante el viaje? Clasificá.", ["En la meseta", "En la costa"],
    ["Matas de coirón", "Cañadones", "Mesetas escalonadas"], ["Acantilados", "Playas de piedras", "Olas del mar"],
    "Pista: cerca de Gregores todo es meseta; al llegar a Monte León aparece el mar."),
  mc("ml-e1-rutas", T1, "¿Por qué rutas viajamos desde Gregores hasta Monte León?",
    ["Ruta Provincial 27 y Ruta Nacional 3", "Ruta Nacional 40 y Ruta Provincial 25", "Ruta Nacional 3 y Ruta Nacional 40"],
    "Pista: una ruta provincial nos lleva hasta Piedrabuena y una nacional baja por la costa."),
  mc("ml-e1-distancia", T1, "¿Cuántos kilómetros recorremos, más o menos?",
    ["Unos 240 kilómetros", "Unos 40 kilómetros", "Unos 1.200 kilómetros"],
    "Pista: son un poco menos de 250 kilómetros."),
  mc("ml-e1-tiempo", T1, "¿Cuánto dura el viaje en micro escolar, más o menos?",
    ["Unas 4 horas", "Unos 40 minutos", "Unos 4 días"],
    "Pista: salimos a la mañana y llegamos antes del almuerzo."),
  mc("ml-e1-direccion", T1, "Desde Gregores, ¿hacia dónde viajamos para llegar al mar?",
    ["Hacia el este y el sur", "Hacia el oeste", "Hacia el norte"],
    "Pista: el mar está del lado por donde sale el sol."),
  mc("ml-e1-transporte", T1, "¿En qué viajamos hasta Monte León?",
    ["En micro escolar", "En avión", "En barco"],
    "Pista: vamos todos juntos por la ruta."),
  mc("ml-e1-rio", T1, "Al pasar por Piedrabuena cruzamos un puente. ¿Sobre qué río?",
    ["El río Santa Cruz", "El río Chico", "El río Deseado"],
    "Pista: es el río más grande de la provincia y le da su nombre."),
  mc("ml-e1-paisaje", T1, "¿Cómo cambia el paisaje cuando nos acercamos al mar?",
    ["De meseta con coirones a acantilados y playas", "De meseta a bosques de lengas", "De meseta a montañas con nieve"],
    "Pista: el parque está en la costa del Mar Argentino."),
  mc("ml-e1-donde-coiron", T1, "Por la ventanilla vemos matas de coirón y cañadones. ¿Dónde estamos?",
    ["Todavía en la meseta, cerca de Gregores", "Llegando a Monte León", "En el puente de Piedrabuena"],
    "Pista: el coirón crece en la meseta."),
  mc("ml-e1-donde-acantilado", T1, "Ahora vemos un acantilado y olas. ¿Dónde estamos?",
    ["Llegando a Monte León", "Saliendo de Gregores", "En el centro de Piedrabuena"],
    "Pista: las olas son del mar."),
  mc("ml-e1-campera", T1, "En la costa sopla mucho viento. ¿Qué ropa conviene llevar?",
    ["Una campera rompevientos", "Un paraguas grande", "Ropa de verano liviana"],
    "Pista: el paraguas se da vuelta con el viento patagónico."),
  mc("ml-e1-calzado", T1, "¿Qué calzado conviene para caminar por los senderos?",
    ["Zapatillas cerradas y cómodas", "Ojotas", "Zapatos de vestir"],
    "Pista: vamos a caminar un buen rato por tierra y piedras."),
  mc("ml-e1-botella", T1, "¿Para qué llevamos una botella reutilizable?",
    ["Para tomar agua sin dejar basura", "Para juntar agua del mar", "Para guardar caracoles de la playa"],
    "Pista: en el parque no se tira nada y no se lleva nada."),
  mc("ml-e1-libreta", T1, "¿Para qué llevamos una libreta y un lápiz?",
    ["Para anotar lo que observamos", "Para escribir en las rocas", "Para hacer la tarea de matemática"],
    "Pista: somos exploradores que registran lo que ven."),
  mc("ml-e1-micro", T1, "¿Cómo viajamos dentro del micro?",
    ["Sentados y con el cinturón puesto", "Parados para ver mejor", "Con los brazos afuera de la ventanilla"],
    "Pista: viajar seguros es lo primero."),
];

// ETAPA 2: EL PARQUE (clase 3)
const T2 = "El parque";
const BANCO_ETAPA_2: readonly ActivitySpec[] = [
  orden("ml-e2-orden-tamano", T2, "Ordená del más grande al más chico.",
    ["La Argentina", "La provincia de Santa Cruz", "El Parque Nacional Monte León"],
    "Pista: el parque está dentro de la provincia, y la provincia dentro del país."),
  clasif("ml-e2-natural", T2, "¿Lo hizo la naturaleza o lo hicieron las personas? Clasificá.", ["Lo hizo la naturaleza", "Lo hicieron las personas"],
    ["La Cabeza del León", "Los acantilados", "La playa de piedras"], ["La pasarela de madera", "Los carteles del sendero", "La Ruta Nacional 3"],
    "Pista: el viento y el mar formaron las rocas; las personas construyeron caminos y carteles."),
  mc("ml-e2-que-es", T2, "¿Qué es un parque nacional?",
    ["Un lugar protegido por ley para cuidar la naturaleza", "Una plaza grande con juegos para chicos", "Un campo donde se crían ovejas"],
    "Pista: allí se cuidan los animales, las plantas y los paisajes."),
  mc("ml-e2-primero", T2, "¿Por qué Monte León es un parque muy especial?",
    ["Fue el primer parque nacional de costa y mar del país", "Es el parque nacional más antiguo del país", "Es el único parque con glaciares"],
    "Pista: protege la costa y también el mar."),
  mc("ml-e2-anio", T2, "¿En qué año se creó el Parque Nacional Monte León?",
    ["En 2004", "En 1904", "En 2024"],
    "Pista: se creó a comienzos de este siglo, antes de que ustedes nacieran."),
  mc("ml-e2-provincia", T2, "¿En qué provincia está Monte León?",
    ["En Santa Cruz", "En Chubut", "En Tierra del Fuego"],
    "Pista: es nuestra provincia."),
  mc("ml-e2-nombre", T2, "¿Por qué el parque se llama Monte León?",
    ["Por una roca que parece un león acostado", "Porque allí vivían leones africanos", "Por el apellido de un explorador"],
    "Pista: mirá la forma de la roca más famosa del parque."),
  mc("ml-e2-cabeza", T2, "¿Cómo tomó su forma la Cabeza del León?",
    ["El viento y el mar la fueron gastando durante muchísimos años", "La talló una persona con herramientas", "La armaron con piedras traídas en camiones"],
    "Pista: nadie la construyó: la naturaleza la fue gastando de a poco."),
  mc("ml-e2-mar", T2, "¿Qué mar llega a la costa de Monte León?",
    ["El Mar Argentino", "El océano Pacífico", "El lago Argentino"],
    "Pista: es el mar que baña toda la costa de Santa Cruz."),
  mc("ml-e2-quien-cuida", T2, "¿Quiénes cuidan el parque todos los días?",
    ["Los guardaparques", "Los bomberos", "Los inspectores de tránsito"],
    "Pista: llevan sombrero de ala ancha y uniforme verde."),
  mc("ml-e2-billete", T2, "En clase vimos Monte León en un billete didáctico del Banco de la Patagonia. ¿De cuánto era?",
    ["De $10", "De $100", "De $1.000"],
    "Pista: en el frente tenía un pingüino de Magallanes."),
  mc("ml-e2-de-todos", T2, "¿Por qué decimos que el parque es de todos los argentinos?",
    ["Porque es un lugar público que cuidamos entre todos", "Porque cada uno puede llevarse lo que quiera", "Porque es de una sola familia"],
    "Pista: lo que es de todos se cuida entre todos."),
  mc("ml-e2-costa", T2, "¿Cómo es la costa del parque?",
    ["Con acantilados altos y playas de piedras", "Con playas de arena blanca y palmeras", "Con hielo y glaciares"],
    "Pista: las piedras redondeadas por el mar se llaman canto rodado."),
  mc("ml-e2-antes", T2, "Antes de ser parque nacional, ¿qué había en Monte León?",
    ["Una estancia de ovejas", "Una ciudad grande", "Un puerto de barcos pesqueros"],
    "Pista: como muchos campos de Santa Cruz, allí se criaban ovejas."),
  mc("ml-e2-ubicacion", T2, "Desde Piedrabuena, ¿hacia dónde queda Monte León?",
    ["Hacia el sur, por la Ruta 3", "Hacia el norte, por la Ruta 3", "Hacia el oeste, por la Ruta 27"],
    "Pista: bajamos por la costa."),
  mc("ml-e2-protege", T2, "¿Qué se protege en un parque nacional?",
    ["Los animales, las plantas y los paisajes", "Solo los caminos y los carteles", "Solo los edificios antiguos"],
    "Pista: todo lo que la naturaleza nos regaló."),
];

// ETAPA 3: LOS ANIMALES (clase 3). Los ids con «lobo» o «cormoran» usan la
// escena de la lobería; los de «guanaco», «choique» o «estepa», la de la estepa.
const T3 = "Los animales";
const BANCO_ETAPA_3: readonly ActivitySpec[] = [
  clasif("ml-e3-costa-estepa", T3, "¿Dónde vive cada animal? Clasificá.", ["En la costa y el mar", "En la estepa"],
    ["Pingüino de Magallanes", "Lobo marino de un pelo", "Cormorán"], ["Guanaco", "Choique", "Zorro colorado"],
    "Pista: los que buscan su comida en el mar viven en la costa."),
  mc("ml-e3-cantidad", T3, "¿Cuántas parejas de pingüinos de Magallanes llegan a Monte León?",
    ["Más de 60.000 parejas", "Unas 600 parejas", "Unas 60 parejas"],
    "Pista: son tantas que es una de las colonias más grandes de la costa."),
  mc("ml-e3-cuando", T3, "¿En qué época llegan los pingüinos a la costa?",
    ["En primavera, en septiembre y octubre", "En invierno, en junio y julio", "En otoño, en abril"],
    "Pista: llegan cuando empieza a hacer menos frío."),
  mc("ml-e3-nido", T3, "¿Dónde hacen su nido los pingüinos de Magallanes?",
    ["En cuevas que cavan en la tierra", "En lo alto de los árboles", "Sobre el hielo del mar"],
    "Pista: buscan tierra blanda cerca de la costa."),
  mc("ml-e3-huevos", T3, "¿Cuántos huevos pone, por lo general, la pingüina?",
    ["Dos huevos", "Un huevo", "Seis huevos"],
    "Pista: son pocos, por eso hay que cuidar mucho los nidos."),
  mc("ml-e3-comen", T3, "¿Qué comen los pingüinos?",
    ["Peces y calamares", "Pasto y semillas", "Insectos de la estepa"],
    "Pista: buscan su comida nadando en el mar."),
  mc("ml-e3-nadan", T3, "¿Cómo se mueven los pingüinos en el agua?",
    ["Nadan rápido usando sus aletas", "Vuelan bajito sobre las olas", "Caminan por el fondo del mar"],
    "Pista: no vuelan, pero son grandes nadadores."),
  mc("ml-e3-octubre", T3, "Cuando visitemos el parque a fines de octubre, ¿qué estarán haciendo los pingüinos?",
    ["Cuidando sus huevos en las cuevas", "Enseñándoles a nadar a pichones grandes", "Viajando hacia el norte"],
    "Pista: los pichones nacen recién en noviembre."),
  mc("ml-e3-turnos", T3, "¿Quién cuida los huevos en la cueva?",
    ["La mamá y el papá, por turnos", "Solo la mamá", "Nadie: los dejan solos"],
    "Pista: mientras uno cuida el nido, el otro va al mar a comer."),
  mc("ml-e3-pecho", T3, "¿Cómo es el pecho del pingüino de Magallanes?",
    ["Blanco con bandas negras", "Todo negro", "Amarillo con manchas"],
    "Pista: tiene franjas oscuras que parecen un collar."),
  mc("ml-e3-lobo", T3, "¿Qué animal descansa en grupo sobre las rocas y el macho tiene una gran melena?",
    ["El lobo marino de un pelo", "El guanaco", "El pingüino de Magallanes"],
    "Pista: vive en la lobería, junto al mar."),
  mc("ml-e3-cormoran", T3, "¿Qué ave marina se zambulle para pescar y hace su nido en los acantilados?",
    ["El cormorán", "El choique", "El cóndor"],
    "Pista: es negra y blanca y vive junto al mar."),
  mc("ml-e3-guanaco", T3, "¿Qué animal de la estepa vive en manada y tiene el cuello largo?",
    ["El guanaco", "El lobo marino", "El zorro colorado"],
    "Pista: es pariente de la llama."),
  mc("ml-e3-choique", T3, "¿Qué ave grande de la estepa corre muy rápido pero no vuela?",
    ["El choique", "El cormorán", "La gaviota"],
    "Pista: también lo llaman ñandú."),
  mc("ml-e3-lejos", T3, "¿Por qué miramos a los pingüinos desde lejos?",
    ["Para no asustarlos ni pisar sus cuevas", "Porque los pingüinos son peligrosos", "Para que vengan hacia nosotros"],
    "Pista: sus nidos están debajo de la tierra."),
  mc("ml-e3-estepa-comida", T3, "¿Qué comen los guanacos en la estepa?",
    ["Pastos y arbustos", "Peces y calamares", "Huevos de pingüino"],
    "Pista: son herbívoros."),
];

// ETAPA 4: LAS NORMAS Y EL GUARDAPARQUE (clase 4)
const T4 = "Las normas";
const BANCO_ETAPA_4: readonly ActivitySpec[] = [
  clasif("ml-e4-se-puede", T4, "¿Se puede o no se puede en el parque? Clasificá.", ["Se puede", "No se puede"],
    ["Caminar por la pasarela", "Sacar fotos", "Guardar la basura en la mochila"], ["Darles comida a los animales", "Llevarse un caracol", "Salir del sendero"],
    "Pista: regla de oro: no dejar nada más que huellas, no llevarse nada más que fotos y recuerdos."),
  orden("ml-e4-orden-basura", T4, "Terminamos de almorzar. Ordená qué hacemos con los envoltorios.",
    ["Juntamos todos los envoltorios", "Los guardamos en una bolsita", "Llevamos la bolsita en la mochila hasta volver"],
    "Pista: en el parque no queda nada de basura."),
  mc("ml-e4-guardaparque", T4, "¿Qué hace el guardaparque?",
    ["Cuida los animales, las plantas y los senderos", "Maneja el micro de los visitantes", "Les da de comer a los pingüinos"],
    "Pista: también hace cumplir las normas del parque."),
  mc("ml-e4-regla-oro", T4, "¿Cuál es la regla de oro del visitante?",
    ["No dejar nada más que huellas y no llevarse nada más que fotos", "Llevarse un recuerdo de cada lugar visitado", "Dejar algo nuestro para que nos recuerden"],
    "Pista: lo único que nos llevamos son fotos y recuerdos."),
  mc("ml-e4-pasarela", T4, "¿Por qué caminamos solo por las pasarelas y los senderos?",
    ["Para no aplastar las cuevas de los pingüinos", "Para llegar más rápido al micro", "Para no ensuciarnos las zapatillas"],
    "Pista: los nidos están bajo la tierra y no se ven."),
  mc("ml-e4-no-alimentar", T4, "¿Por qué no les damos comida a los animales?",
    ["Porque nuestra comida los puede enfermar", "Porque ya comieron en el desayuno", "Porque nos pueden pedir más"],
    "Pista: cada animal tiene su propia comida en la naturaleza."),
  mc("ml-e4-piedra", T4, "Encontramos una piedra brillante en la playa. ¿Qué hacemos?",
    ["La dejamos donde está y le sacamos una foto", "Nos la guardamos de recuerdo", "Se la damos al docente para la escuela"],
    "Pista: en el parque todo se queda en su lugar."),
  mc("ml-e4-envase", T4, "El viento se lleva un envase vacío hacia la playa. ¿Qué hacemos?",
    ["Sin salir del sendero, avisamos al docente o al guardaparque", "Corremos solos a buscarlo hacia el acantilado", "Lo dejamos: el mar lo va a limpiar"],
    "Pista: nunca salimos del sendero y los adultos nos ayudan."),
  mc("ml-e4-pinguino-cerca", T4, "Un pingüino está cerca del sendero. ¿Qué hacemos?",
    ["Lo miramos en silencio, sin acercarnos", "Lo acariciamos despacito", "Lo llamamos para sacarle una foto de cerca"],
    "Pista: es un animal silvestre: no se toca."),
  mc("ml-e4-silencio", T4, "¿Cómo nos comportamos cerca de los animales?",
    ["En silencio y con calma", "Aplaudiendo para que nos miren", "Corriendo para verlos mejor"],
    "Pista: los ruidos fuertes los asustan."),
  mc("ml-e4-envoltorios", T4, "¿Qué hacemos con los envoltorios de la merienda?",
    ["Los guardamos en la mochila y los llevamos de vuelta", "Los dejamos en un rincón del sendero", "Los enterramos en la arena"],
    "Pista: en el parque hay basura cero."),
  mc("ml-e4-caracoles", T4, "¿Por qué no nos llevamos caracoles, plumas ni fósiles?",
    ["Porque el parque los protege y son de todos", "Porque pesan mucho en la mochila", "Porque están sucios de arena"],
    "Pista: si cada visitante se llevara uno, no quedaría ninguno."),
  mc("ml-e4-fuego", T4, "¿Se puede hacer fuego en el parque?",
    ["No, con el viento se puede provocar un incendio", "Sí, en cualquier lugar del parque", "Sí, si hace mucho frío"],
    "Pista: el viento patagónico es muy fuerte."),
  mc("ml-e4-autoridad", T4, "En el parque, ¿quién es la autoridad que nos indica qué hacer?",
    ["El guardaparque", "El chofer del micro", "El primer alumno que llega"],
    "Pista: nos recibe en la entrada del parque."),
  mc("ml-e4-ver-basura", T4, "Vemos a un visitante tirar basura. ¿Qué hacemos?",
    ["Le contamos al docente o al guardaparque", "Hacemos lo mismo", "No decimos nada"],
    "Pista: cuidar el parque es tarea de todos."),
  mc("ml-e4-para-que", T4, "¿Para qué sirven las normas del parque?",
    ["Para que los animales vivan tranquilos y el lugar se conserve", "Para que el viaje sea más corto", "Para que no podamos divertirnos"],
    "Pista: las normas no prohíben disfrutar: cuidan el lugar."),
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
    say: "Meseta. Durante el viaje vamos a cruzar la meseta patagónica.",
    hint: "Pista: meseta se escribe con s.",
  },
  {
    palabra: "ruta",
    say: "Ruta. Viajamos por la ruta provincial veintisiete hacia el mar.",
    hint: "Pista: ruta empieza con una sola r fuerte al inicio.",
  },
  {
    palabra: "viaje",
    say: "Viaje. Todos los chicos de tercer grado nos preparamos para este gran viaje.",
    hint: "Pista: viaje se escribe con v corta y con j.",
  },
  {
    palabra: "mochila",
    say: "Mochila. Guardamos la botella de agua y los residuos dentro de la mochila.",
    hint: "Pista: mochila se escribe con ch.",
  },
  {
    palabra: "colectivo",
    say: "Colectivo. El colectivo escolar va a tardar unas cuatro horas en llegar.",
    hint: "Pista: colectivo lleva c antes de la t y v corta.",
  },
  {
    palabra: "playa",
    say: "Playa. Caminamos despacio por la playa de canto rodado.",
    hint: "Pista: playa se escribe con y griega.",
  },
  {
    palabra: "lobo marino",
    say: "Lobo marino. Sobre las rocas descansa un lobo marino con su cría.",
    hint: "Pista: lobo se escribe con b larga; son dos palabras separadas.",
  },
  {
    palabra: "cormorán",
    say: "Cormorán. El cormorán es un ave marina que anida en los acantilados.",
    hint: "Pista: cormorán es palabra aguda y lleva tilde en la a.",
  },
  {
    palabra: "guanaco",
    say: "Guanaco. En la estepa vamos a ver una manada de guanacos.",
    hint: "Pista: guanaco empieza con gua y termina con co.",
  },
  {
    palabra: "choique",
    say: "Choique. El choique corre a gran velocidad entre los arbustos.",
    hint: "Pista: choique empieza con ch y termina con que.",
  },
  {
    palabra: "parque",
    say: "Parque. Monte León es un parque nacional junto al mar.",
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
    say: "Nido. Los pingüinos cuidan su nido debajo de la tierra.",
    hint: "Pista: nido se escribe con n y d.",
  },
  {
    palabra: "cueva",
    say: "Cueva. Cada pareja de pingüinos cava una cueva en la tierra.",
    hint: "Pista: cueva se escribe con c y con v corta.",
  },
  {
    palabra: "sendero",
    say: "Sendero. Para cuidar el suelo caminamos únicamente por el sendero.",
    hint: "Pista: sendero empieza con s.",
  },
  {
    palabra: "pasarela",
    say: "Pasarela. Miramos la pingüinera desde la pasarela de madera.",
    hint: "Pista: pasarela se escribe con s.",
  },
  {
    palabra: "basura",
    say: "Basura. En el parque nacional se respeta la regla de cero basura.",
    hint: "Pista: basura se escribe con b larga y con s.",
  },
  {
    palabra: "protector",
    say: "Protector. Antes de caminar nos ponemos protector solar en la cara.",
    hint: "Pista: protector lleva c antes de la t final.",
  },
  {
    palabra: "gorra",
    say: "Gorra. Llevamos una gorra para protegernos del sol.",
    hint: "Pista: gorra lleva doble r entre vocales.",
  },
  {
    palabra: "botella",
    say: "Botella. Llevamos una botella de agua para la excursión.",
    hint: "Pista: botella se escribe con b larga y con doble l.",
  },
  {
    palabra: "también",
    say: "También. En el parque también vamos a ver lobos marinos.",
    hint: "Pista: antes de b se escribe m: también. Lleva tilde en la e.",
  },
  {
    palabra: "envase",
    say: "Envase. Guardamos el envase vacío en la mochila.",
    hint: "Pista: antes de v se escribe n: envase.",
  },
  {
    palabra: "Piedrabuena",
    say: "Piedrabuena. Al pasar por Piedrabuena cruzamos un gran puente.",
    hint: "Pista: Piedrabuena es nombre propio, empieza con mayúscula y lleva b larga.",
  },
  {
    palabra: "Monte León",
    say: "Monte León. ¡Qué hermosa excursión nos espera en Monte León!",
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
// Mezcla lo que se muestra de una actividad (las opciones, los ítems de
// ordenar y de clasificar), para que la respuesta no esté siempre en el mismo
// lugar. En los bancos la correcta va primera y los ítems de ordenar, en orden.
export function mezclarActividad(a: ActivitySpec): ActivitySpec {
  if (a.type === "mc") {
    const idx = shuffleArray(a.choices.map((_, i) => i));
    return { ...a, choices: idx.map((i) => a.choices[i]), answerIndex: idx.indexOf(a.answerIndex) };
  }
  if (a.type === "order") {
    let idx = shuffleArray(a.items.map((_, i) => i));
    while (idx.every((v, i) => v === i) && idx.length > 1) idx = shuffleArray(idx);
    // correctOrder: en qué posición quedó cada ítem del orden correcto.
    return { ...a, items: idx.map((i) => a.items[i]), correctOrder: a.correctOrder.map((k) => idx.indexOf(k)) };
  }
  if (a.type === "classify") {
    return { ...a, items: shuffleArray(a.items) };
  }
  return a;
}

export function buildMonteLeonActivities(etapa: number): ActivitySpec[] {
  if (etapa === 5) {
    const elegidas = shuffleArray(PALABRAS_DICTADO_VIAJE).slice(0, ACTIVIDADES_POR_VUELTA);
    return elegidas.map((item, idx) => crearActividadDictado(item, idx));
  }
  const banco = etapa === 2 ? BANCO_ETAPA_2 : etapa === 3 ? BANCO_ETAPA_3 : etapa === 4 ? BANCO_ETAPA_4 : BANCO_ETAPA_1;
  // Siempre una actividad interactiva (ordenar o clasificar) y el resto al azar.
  const interactivas = shuffleArray(banco.filter((a) => a.type === "order" || a.type === "classify"));
  const resto = shuffleArray(banco.filter((a) => a.type !== "order" && a.type !== "classify"));
  const elegidas = [...interactivas.slice(0, 1), ...resto.slice(0, ACTIVIDADES_POR_VUELTA - 1)];
  return shuffleArray(elegidas).map(mezclarActividad);
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
