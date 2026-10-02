import type { ActivitySpec } from "@/lib/activities";
import { makeClassify, makeMultiPick, makeOrder, makeStoryPick, Q, q } from "./util";

// Banco de preguntas por número de mundo de Ciencias Sociales de 2.º grado (18 mundos).
export const SOCIALES_BANK: Record<number, Q[]> = {
  // 1. Paisajes de Santa Cruz
  1: [
    q("¿Qué paisaje tiene montañas altas, lagos y bosque de lengas?", [["🏔️", "La cordillera"], ["🌾", "La meseta"], ["🏖️", "La costa"]], 0, "Pista: está al oeste de Santa Cruz, cerca de los glaciares.", { promptEmoji: "🌲" }),
    q("¿Qué paisaje de Santa Cruz tiene arbustos bajos como el coirón y mucho viento?", [["🌾", "La estepa o meseta"], ["🌴", "La selva"], ["🏙️", "La ciudad"]], 0, "Pista: ocupa la mayor parte del centro de nuestra provincia.", { promptEmoji: "💨" }),
    q("¿Qué animales vemos en los acantilados de la costa marina?", [["🐧", "Pingüinos y lobos marinos"], ["🐒", "Monos"], ["🐪", "Camellos"]], 0, "Pista: viven junto a las olas del Mar Argentino.", { promptEmoji: "🌊" }),
    q("¿Qué elemento es característico de un paisaje urbano?", [["🏢", "Edificios y calles asfaltadas"], ["🚜", "Molinos y corrales"], ["🏔️", "Glaciares"]], 0, "Pista: donde viven muchas personas juntas.", { promptEmoji: "🏙️" }),
    q("¿Qué encontramos en un paisaje rural patagónico?", [["🐑", "Estancias con ovejas"], ["🚇", "Subtes"], ["🏬", "Grandes shopping"]], 0, "Pista: los campos son abiertos y extensos.", { promptEmoji: "🏡" }),
    q("¿Por qué las plantas de la estepa son bajas y espinosas?", [["💨", "Para resistir el fuerte viento"], ["🌊", "Porque viven bajo el agua"], ["🔥", "Porque tienen fuego"]], 0, "Pista: el viento sopla fuerte en la meseta.", { promptEmoji: "🌬️" }),
    q("Tocá los paisajes naturales de Santa Cruz", [["🏔️", "Cordillera y glaciares"], ["🌾", "Estepa patagónica"], ["🌊", "Costa atlántica"], ["🏜️", "Desierto de dunas gigantes"]], [0, 1, 2], "Pista: tres de ellos forman nuestra geografía provincial.", { promptEmoji: "🗺️" }),
    q("¿Dónde desembocan los ríos que cruzan Santa Cruz?", [["🌊", "En el océano Atlántico"], ["🏔️", "Suben a la montaña"], ["☁️", "En las nubes"]], 0, "Pista: corren de oeste a este hacia el mar.", { promptEmoji: "🌊" }),
    q("¿Qué árbol nativo tiñe sus hojas de rojo y dorado en otoño?", [["🍂", "La lenga"], ["🌴", "La palmera"], ["🌵", "El cactus"]], 0, "Pista: forma los bosques de montaña.", { promptEmoji: "🌲" }),
    q("¿Qué gran lago patagónico está en Santa Cruz?", [["🛶", "Lago Argentino"], ["🚢", "Río de la Plata"], ["🏊", "Mar Caribe"]], 0, "Pista: allí se encuentra el glaciar Perito Moreno.", { promptEmoji: "🧊" }),
    q("¿Qué transforma un paisaje natural en uno modificado?", [["🛣️", "Construcción de rutas y casas"], ["🌧️", "La lluvia del cielo"], ["☀️", "La luz del sol"]], 0, "Pista: son las obras que hacen las personas.", { promptEmoji: "🏗️" }),
    q("¿Cómo es el clima en la mayor parte de Santa Cruz?", [["❄️", "Frío, seco y ventoso"], ["🌴", "Caluroso y húmedo"], ["🌧️", "Lluvioso todo el año"]], 0, "Pista: en invierno nieva y el viento sopla mucho.", { promptEmoji: "🧣" }),
  ],

  // 2. Vivir en la Ciudad
  2: [
    q("¿Cuál es la ciudad capital de la provincia de Santa Cruz?", [["🏛️", "Río Gallegos"], ["🏔️", "El Chaltén"], ["⚓", "Puerto Deseado"]], 0, "Pista: allí está la Casa de Gobierno provincial.", { promptEmoji: "📍" }),
    q("¿Qué señal ayuda a ordenar el cruce de autos y peatones?", [["🚦", "El semáforo"], ["🎈", "Un globo"], ["🪁", "Un barrilete"]], 0, "Pista: tiene luces roja, amarilla y verde.", { promptEmoji: "🚗" }),
    q("¿Por dónde deben cruzar la calle los peatones de forma segura?", [["🚶", "Por la senda peatonal"], ["🏎️", "Por el medio de la calle"], ["🏃", "Corriendo con ojos cerrados"]], 0, "Pista: son las líneas pintadas en la esquina.", { promptEmoji: "🚸" }),
    q("¿Qué servicio nos permite movernos por la ciudad sin auto propio?", [["🚌", "El colectivo urbano"], ["🚀", "El cohete"], ["🚢", "El submarino"]], 0, "Pista: tiene paradas y recorridos fijos.", { promptEmoji: "🚍" }),
    q("¿Qué espacio verde de la ciudad sirve para jugar y descansar?", [["🌳", "La plaza o parque"], ["🏭", "La fábrica"], ["🚗", "La autopista"]], 0, "Pista: tiene bancos, juegos y árboles.", { promptEmoji: "🛝" }),
    q("¿Dónde van las personas a comprar alimentos variados?", [["🏪", "Al supermercado o almacén"], ["🏥", "Al hospital"], ["🚒", "Al cuartel de bomberos"]], 0, "Pista: allí hay góndolas con mercadería.", { promptEmoji: "🛒" }),
    q("¿Qué camión pasa de noche por las casas para mantener limpia la ciudad?", [["🚛", "El camión recolector de residuos"], ["🚜", "El tractor del campo"], ["🚒", "La autobomba"]], 0, "Pista: se lleva las bolsas de basura.", { promptEmoji: "🗑️" }),
    q("Tocá los elementos que encontramos en una ciudad", [["🏢", "Edificios"], ["💡", "Alumbrado público"], ["🚦", "Semáforos"], ["🐑", "Corrales de cientos de ovejas"]], [0, 1, 2], "Pista: tres corresponden al paisaje urbano.", { promptEmoji: "🏙️" }),
    q("¿Qué edificio municipal se encarga de cuidar los asuntos de la ciudad?", [["🏛️", "La Municipalidad"], ["🎪", "El circo"], ["🚢", "El barco"]], 0, "Pista: allí trabaja el Intendente.", { promptEmoji: "🏛️" }),
    q("¿Qué profesión ayuda a cuidar la salud de los vecinos en la ciudad?", [["👩‍⚕️", "Médicos y enfermeros en el hospital"], ["🧑‍🎨", "Pintores de cuadros"], ["🧑‍🍳", "Cocineros de tortas"]], 0, "Pista: atienden en salas de primeros auxilios y hospitales.", { promptEmoji: "🏥" }),
    q("¿Por qué las ciudades tienen veredas?", [["🚶", "Para que los peatones caminen seguros"], ["🚗", "Para estacionar camiones"], ["🌾", "Para plantar trigo"]], 0, "Pista: separan a la gente del tránsito de los vehículos.", { promptEmoji: "🚶" }),
    q("¿Qué ciudad santacruceña es famosa por sus glaciares y turistas?", [["🏔️", "El Calafate"], ["🌾", "Gobernador Gregores"], ["⛽", "Las Heras"]], 0, "Pista: recibe visitas de todo el mundo.", { promptEmoji: "🧊" }),
  ],

  // 3. Vivir en el Campo Patagónico
  3: [
    q("¿Cómo se llama la casa y los campos donde se crían ovejas?", [["🏡", "Estancia"], ["🏢", "Edificio"], ["🏬", "Centro comercial"]], 0, "Pista: tiene galpón de esquila y corrales.", { promptEmoji: "🐑" }),
    q("¿Quién es la persona que cuida las ovejas a caballo por el campo?", [["🐎", "El puestero o peón rural"], ["🧑‍✈️", "El piloto"], ["👮", "El policía de tránsito"]], 0, "Pista: recorre las pasturas con sus perros.", { promptEmoji: "🤠" }),
    q("¿Cómo son la mayoría de los caminos que llevan a los puestos rurales?", [["🛣️", "Caminos de ripio y tierra"], ["🚇", "Túneles de subte"], ["🛣️", "Avenidas con cuatro carriles"]], 0, "Pista: se levanta polvo cuando pasa la camioneta.", { promptEmoji: "🛞" }),
    q("¿Cómo se comunican muchas veces las estancias alejadas sin señal de celular?", [["📻", "Por radio VHF y enlace satelital"], ["✉️", "Con palomas mensajeras"], ["🗣️", "Gritando por la ventana"]], 0, "Pista: es un equipo de radio con antena.", { promptEmoji: "📻" }),
    q("¿De dónde obtienen agua muchas estancias patagónicas?", [["🚰", "De molinos de viento que sacan agua de pozo"], ["🛒", "Compran botellitas todos los días"], ["☁️", "Solo esperan que llueva"]], 0, "Pista: el viento hace girar la rueda del molino.", { promptEmoji: "💨" }),
    q("¿Cómo generan electricidad en lugares rurales sin tendido eléctrico?", [["🔋", "Con paneles solares y generadores"], ["🕯️", "Solo con linternas a pila"], ["🔌", "Enchufan a los árboles"]], 0, "Pista: usan la energía del sol y motores a combustible.", { promptEmoji: "☀️" }),
    q("¿Qué animal ayuda al trabajador rural a arrear las ovejas?", [["🐕", "El perro ovejero"], ["🐈", "El gato"], ["🦔", "El erizo"]], 0, "Pista: corre rápido y obedece los silbidos.", { promptEmoji: "🐕" }),
    q("¿Por qué en el campo las casas están tan lejos unas de otras?", [["🌾", "Porque los campos de pastura son muy grandes"], ["🚗", "Porque no entran en el mapa"], ["🏠", "Porque no les gusta tener vecinos"]], 0, "Pista: las ovejas necesitan muchas hectáreas para comer.", { promptEmoji: "🚜" }),
    q("¿Dónde van a la escuela los chicos que viven en zonas rurales?", [["🏫", "A la escuela rural o de frontera"], ["✈️", "Toman un avión todos los días"], ["💻", "No van a la escuela"]], 0, "Pista: muchas escuelas rurales tienen albergue.", { promptEmoji: "🎒" }),
    q("Tocá los trabajos típicos del campo santacruceño", [["✂️", "Esquilar ovejas"], ["🐎", "Recorrer a caballo los alambrados"], ["🪵", "Juntar leña para el invierno"], ["🚇", "Manejar un subte"]], [0, 1, 2], "Pista: tres son tareas rurales cotidianas.", { promptEmoji: "🧤" }),
    q("¿Qué vehículo fuerte se usa en el campo para andar en la nieve y el barro?", [["🛻", "Camioneta 4x4"], ["🛴", "Monopatín"], ["🏎️", "Auto de carreras"]], 0, "Pista: tiene tracción en las cuatro ruedas.", { promptEmoji: "🚙" }),
    q("¿Qué se hace en la estancia antes de que llegue la nieve fuerte?", [["🐑", "Bajar los animales a campos de invernada"], ["🏖️", "Ir a la playa a nadar"], ["🍦", "Tomar helado afuera"]], 0, "Pista: se protegen las ovejas en zonas más bajas y con reparo.", { promptEmoji: "❄️" }),
  ],

  // 4. Los Servicios Públicos
  4: [
    q("¿Qué servicio nos permite tener calor en los radiadores y cocinar en Santa Cruz?", [["🔥", "El gas natural de red"], ["🧊", "El hielo"], ["💨", "El viento"]], 0, "Pista: llega por cañerías subterráneas desde los pozos de gas.", { promptEmoji: "🏠" }),
    q("¿De dónde sale el agua segura para beber en las casas?", [["🚰", "De la red de agua potable"], ["🌧️", "De los charcos de la calle"], ["🌊", "Del agua salada del mar directo"]], 0, "Pista: pasa por una planta potabilizadora.", { promptEmoji: "💧" }),
    q("¿Qué servicio enciende las lámparas y la heladera de nuestra casa?", [["⚡", "La electricidad"], ["🕯️", "Una fogata"], ["📱", "El celular"]], 0, "Pista: viaja por cables y postes.", { promptEmoji: "💡" }),
    q("¿Quiénes acuden cuando hay un fuego o un rescate de emergencia?", [["🚒", "Los bomberos"], ["🧑‍🌾", "Los granjeros"], ["🧑‍🍳", "Los cocineros"]], 0, "Pista: tienen camiones con sirena y mangueras.", { promptEmoji: "🚨" }),
    q("¿Qué servicio público cuida la salud de todos los vecinos?", [["🏥", "Los hospitales y salitas de salud"], ["🏦", "Los bancos"], ["🏟️", "Las canchas de fútbol"]], 0, "Pista: allí atienden médicos sin cobrar la consulta.", { promptEmoji: "🩺" }),
    q("¿Qué servicio público permite a los niños aprender de forma gratuita?", [["🏫", "La escuela pública"], ["🎡", "El parque de diversiones"], ["🏪", "El quiosco"]], 0, "Pista: maestros y directores trabajan para la comunidad.", { promptEmoji: "📚" }),
    q("¿Quiénes patrullan las calles para cuidar nuestra seguridad?", [["👮", "La policía"], ["🤡", "Los payasos"], ["🧑‍🎨", "Los escultores"]], 0, "Pista: usan uniforme y móviles policiales.", { promptEmoji: "🚓" }),
    q("¿Cómo podemos colaborar los vecinos con el servicio de recolección?", [["🗑️", "Sacando la basura en bolsas cerradas y a horario"], ["🚯", "Tirando botellas a la vereda"], ["🔥", "Quemando basura en la calle"]], 0, "Pista: mantener limpio el barrio es responsabilidad de todos.", { promptEmoji: "🧹" }),
    q("¿Por qué es importante no derrochar el agua potable?", [["💧", "Porque es un recurso valioso que cuesta potabilizar"], ["🌊", "Porque se desbordan los mares"], ["🧂", "Porque se vuelve salada"]], 0, "Pista: cerrar la canilla mientras nos cepillamos cuida el agua.", { promptEmoji: "🚰" }),
    q("Tocá los servicios públicos esenciales en una ciudad", [["🚰", "Agua potable"], ["⚡", "Energía eléctrica"], ["🔥", "Gas natural"], ["🎮", "Salas de videojuegos"]], [0, 1, 2], "Pista: son los que cubren necesidades básicas de vida.", { promptEmoji: "🏙️" }),
    q("¿Qué pasa si dejamos la luz prendida cuando no hay nadie?", [["💡", "Se derrocha energía que debemos cuidar"], ["❄️", "Se congela la habitación"], ["🌞", "Sale el sol más rápido"]], 0, "Pista: apagar lo que no usamos ahorra energía.", { promptEmoji: "⚡" }),
    q("¿Qué servicio nos permite enviar paquetes y cartas a otras ciudades?", [["🏤", "El correo postal"], ["🏥", "El hospital"], ["🚒", "Los bomberos"]], 0, "Pista: el cartero lleva los envíos a destino.", { promptEmoji: "✉️" }),
  ],

  // 5. Del Campo a la Mesa: La Lana
  5: [
    q("¿De qué animal proviene la lana que se produce en Santa Cruz?", [["🐑", "De la oveja"], ["🐄", "De la vaca"], ["🐎", "Del caballo"]], 0, "Pista: pasta en las estancias patagónicas.", { promptEmoji: "🧶" }),
    q("¿Cómo se llama el trabajo de cortar la lana de la oveja sin lastimarla?", [["✂️", "La esquila"], ["🌾", "La cosecha"], ["🎣", "La pesca"]], 0, "Pista: se hace en primavera con tijeras especiales o máquinas.", { promptEmoji: "🐑" }),
    q("¿En qué época del año se realiza la esquila en la Patagonia?", [["🌸", "En primavera"], ["❄️", "En pleno invierno con nieve"], ["🍂", "En otoño"]], 0, "Pista: cuando empieza a hacer calor y la oveja ya no necesita tanto abrigo.", { promptEmoji: "☀️" }),
    q("¿Cómo se llama el manto completo de lana que sale de una oveja?", [["🧶", "Vellón"], ["🍞", "Bollón"], ["📦", "Paquete"]], 0, "Pista: se enrolla y clasifica en la mesa de trabajo.", { promptEmoji: "🐑" }),
    q("¿Qué se hace con la lana en la barraca antes de hilarla?", [["🧼", "Se lava para sacar la tierra y la grasitud"], ["🎨", "Se tira a la basura"], ["🍞", "Se hornea como pan"]], 0, "Pista: debe quedar limpia y suave.", { promptEmoji: "🫧" }),
    q("¿Cómo se transforma la lana limpia en hilos finos?", [["🧵", "Con el hilado en huso o rueca"], ["🔨", "A martillazos"], ["✂️", "Cortándola en pedacitos"]], 0, "Pista: se retuercen las fibras para hacer hebras largas.", { promptEmoji: "🧶" }),
    q("¿Qué prendas abrigadas se tejen con la lana patagónica?", [["🧣", "Pulóveres, bufandas y gorros"], ["🩳", "Mallas para nadar"], ["🩴", "Ojotas de plástico"]], 0, "Pista: nos protegen del frío del invierno.", { promptEmoji: "🧥" }),
    q("¿Cómo se transporta la lana de la estancia al puerto?", [["🚛", "En grandes fardos cargados en camiones"], ["🚲", "En canastos de bicicleta"], ["🛶", "En kayaks"]], 0, "Pista: los fardos son paquetes prensados muy pesados.", { promptEmoji: "📦" }),
    q("Tocá los pasos del circuito de la lana", [["🐑", "Cría y pastoreo"], ["✂️", "Esquila"], ["🧶", "Hilado y tejido"], ["🍞", "Fermentación con levadura"]], [0, 1, 2], "Pista: tres corresponden al proceso textil.", { promptEmoji: "🔄" }),
    q("¿Por qué la lana es tan buena para el frío?", [["🧥", "Porque atrapa el calor del cuerpo de forma natural"], ["🧊", "Porque produce hielo"], ["💧", "Porque es transparente"]], 0, "Pista: es una fibra térmica que abriga muy bien.", { promptEmoji: "🧣" }),
    q("¿Quiénes trabajan en la comparsa de esquila?", [["🧤", "Agarradores, esquiladores y clasificadores"], ["🧑‍🍳", "Cocineros de pizza"], ["🧑‍✈️", "Pilotos de avión"]], 0, "Pista: es un equipo de trabajadores especializados.", { promptEmoji: "👥" }),
    q("¿Hacia dónde viaja gran parte de la lana santacruceña?", [["🚢", "Se exporta en barcos a distintos países del mundo"], ["🚀", "A la luna"], ["🏔️", "Se entierra en la nieve"]], 0, "Pista: la lana fina patagónica es famosa internacionalmente.", { promptEmoji: "🌍" }),
  ],

  // 6. Del Trigo al Pan
  6: [
    q("¿Qué planta del campo nos da los granos para hacer harina?", [["🌾", "El trigo"], ["🍎", "El manzano"], ["🥔", "La papa"]], 0, "Pista: crece en espigas doradas.", { promptEmoji: "🍞" }),
    q("¿Qué máquina junta las espigas en el campo cuando están maduras?", [["🚜", "La cosechadora"], ["🚗", "El auto"], ["🚲", "La bicicleta"]], 0, "Pista: es una máquina agrícola gigante.", { promptEmoji: "🌾" }),
    q("¿Dónde se muelen los granos de trigo para transformarlos en polvo blanco?", [["⚙️", "En el molino harinero"], ["🏥", "En el hospital"], ["🏦", "En el banco"]], 0, "Pista: las muelas del molino trituran los granos.", { promptEmoji: "🏭" }),
    q("¿Qué producto obtenemos al moler el grano de trigo?", [["🥡", "La harina"], ["🍫", "El chocolate"], ["🛢️", "El combustible"]], 0, "Pista: es el ingrediente principal de la masa.", { promptEmoji: "🌾" }),
    q("¿Qué ingrediente hace que la masa del pan crezca e infle?", [["🍞", "La levadura"], ["🧂", "La pimienta"], ["🧊", "El hielo"]], 0, "Pista: produce burbujitas en la masa tibia.", { promptEmoji: "🫧" }),
    q("¿Quién elabora el pan amasándolo y horneándolo cada mañana?", [["👨‍🍳", "El panadero"], ["👮", "El policía"], ["🧑‍🚒", "El bombero"]], 0, "Pista: trabaja temprano en la panadería.", { promptEmoji: "🥖" }),
    q("¿Qué cuatro ingredientes básicos lleva la masa del pan tradicional?", [["🥖", "Harina, agua, levadura y una pizca de sal"], ["🍬", "Azúcar, chocolate, dulce y leche"], ["🥩", "Carne, huevo, lechuga y tomate"]], 0, "Pista: con agua y harina se forma el engrudo base.", { promptEmoji: "🥣" }),
    q("¿Dónde se cocina la masa para que quede crocante y dorada?", [["🔥", "En el horno caliente"], ["❄️", "En el congelador"], ["🧺", "En el lavarropas"]], 0, "Pista: el calor cocina la masa por dentro y por fuera.", { promptEmoji: "🥖" }),
    q("Ordená el camino del pan: ¿cuál es el primer paso?", [["🌱", "Sembrar y cosechar el trigo"], ["🥖", "Comer la tostada"], ["⚙️", "Moler la harina"]], 0, "Pista: todo empieza en la tierra con las semillas.", { promptEmoji: "⏳" }),
    q("Tocá los alimentos hechos a base de harina de trigo", [["🥖", "Pan"], ["🍕", "Masa de pizza"], ["🍝", "Fideos"], ["🥩", "Bife de carne"]], [0, 1, 2], "Pista: tres se elaboran con harina amasada.", { promptEmoji: "🍽️" }),
    q("¿Cómo se transportan las bolsas de harina desde el molino a las panaderías?", [["🚛", "En camiones de reparto"], ["🛴", "En monopatín"], ["🐎", "A caballo una por una"]], 0, "Pista: llevan muchas bolsas pesadas de 25 o 50 kilos.", { promptEmoji: "📦" }),
    q("¿Por qué el pan se compra fresco todos los días?", [["🥖", "Porque es rico, nutritivo y forma parte de las comidas familiares"], ["🕰️", "Porque dura 50 años igual"], ["🚗", "Porque sirve para manejar autos"]], 0, "Pista: acompaña el desayuno, almuerzo y merienda.", { promptEmoji: "🥐" }),
  ],

  // 7. Los Frutos del Mar Austral
  7: [
    q("¿Qué puertos de Santa Cruz tienen importante actividad pesquera?", [["⚓", "Puerto Deseado y Caleta Olivia"], ["🏔️", "El Chaltén y Calafate"], ["🌾", "Gobernador Gregores"]], 0, "Pista: están sobre la costa del Mar Argentino.", { promptEmoji: "🌊" }),
    q("¿En qué navegan los pescadores para buscar cardúmenes mar adentro?", [["🚢", "En barcos pesqueros y buques factoría"], ["🚜", "En tractores"], ["🚂", "En trenes"]], 0, "Pista: tienen redes grandes y cámaras frigoríficas.", { promptEmoji: "🎣" }),
    q("¿Qué crustáceo de color rojo anaranjado es muy famoso en las aguas santacruceñas?", [["🦐", "El langostino patagónico"], ["🦞", "El cangrejo de río"], ["🐙", "El pulpo gigante"]], 0, "Pista: se pesca en el Golfo San Jorge y se exporta al mundo.", { promptEmoji: "🌊" }),
    q("¿Qué pez de carne blanca se pesca en grandes cantidades en el sur?", [["🐟", "La merluza hubbsi"], ["🐠", "El pez payaso"], ["🦈", "El tiburón martillo"]], 0, "Pista: se prepara en filetes empanados o al horno.", { promptEmoji: "🍽️" }),
    q("¿Qué molusco marino con tentáculos se pesca en nuestras costas?", [["🦑", "El calamar illex"], ["🐌", "El caracol de jardín"], ["🦪", "La estrella de mar"]], 0, "Pista: se limpian sus tubos para hacer rabas.", { promptEmoji: "🌊" }),
    q("¿Adónde van los pescados frescos apenas el barco llega al muelle?", [["🏭", "A las plantas procesadoras de pescado"], ["🌳", "Al bosque"], ["🏫", "A la escuela"]], 0, "Pista: allí se limpian, filetean y congelan.", { promptEmoji: "🧊" }),
    q("¿Por qué es indispensable el frío o hielo en los barcos y plantas de pescado?", [["❄️", "Para mantener el pescado fresco y que no se descomponga"], ["🔥", "Para cocinarlo en el agua"], ["💡", "Para dar luz"]], 0, "Pista: el pescado fresco necesita bajas temperaturas.", { promptEmoji: "🐟" }),
    q("¿Quiénes trabajan en las plantas pesqueras en tierra?", [["🧤", "Fileteros, clasificadores y operarios de frío"], ["🧑‍🌾", "Sembradores de soja"], ["🧑‍🚒", "Bomberos de guardia"]], 0, "Pista: cortan los filetes con gran habilidad.", { promptEmoji: "👥" }),
    q("¿Qué norma se debe respetar para no agotar los peces del mar?", [["🛑", "Las vedas y respetar tamaños mínimos"], ["🎣", "Pescar todo lo que haya sin parar"], ["🚯", "Tirar plástico al agua"]], 0, "Pista: en época de reproducción no se debe pescar para cuidar la especie.", { promptEmoji: "🐟" }),
    q("Tocá los productos que vienen del mar de Santa Cruz", [["🦐", "Langostinos"], ["🐟", "Merluza"], ["🦑", "Calamar"], ["🍌", "Bananas"]], [0, 1, 2], "Pista: tres son animales acuáticos del mar austral.", { promptEmoji: "🌊" }),
    q("¿Cómo se llama la persona que maneja el barco pesquero?", [["🧑‍✈️", "Capitán o patrón de pesca"], ["👷", "Albañil"], ["🧑‍🏫", "Maestro"]], 0, "Pista: dirige la navegación y conoce las cartas marinas.", { promptEmoji: "⚓" }),
    q("¿Por qué el mar patagónico tiene tantos peces y nutrientes?", [["🌊", "Por la corriente fría de Malvinas rica en plancton"], ["🌴", "Porque el agua es tropical caliente"], ["🧂", "Porque le tiran azúcar"]], 0, "Pista: las aguas frías australes tienen mucho alimento natural.", { promptEmoji: "🐟" }),
  ],

  // 8. Trabajadores y Herramientas
  8: [
    q("¿Qué herramienta usa un carpintero para clavar maderas?", [["🔨", "El martillo"], ["🪡", "La aguja"], ["🩺", "El estetoscopio"]], 0, "Pista: golpea los clavos con su cabeza de metal.", { promptEmoji: "🪚" }),
    q("¿Qué instrumento usa la médica para escuchar los latidos del corazón?", [["🩺", "El estetoscopio"], ["📏", "La regla"], ["🔧", "La llave inglesa"]], 0, "Pista: se lo pone en los oídos y apoya la campana en el pecho.", { promptEmoji: "👩‍⚕️" }),
    q("¿Qué máquina usa el mecánico para aflojar tuercas apretadas de un auto?", [["🔧", "La llave de tuercas"], ["🖌️", "El pincel"], ["✂️", "La tijera de papel"]], 0, "Pista: encaja justo en los tornillos y tuercas.", { promptEmoji: "🚗" }),
    q("¿Qué herramienta usa el esquilador para cortar el vellón?", [["✂️", "La esquiladora mecánica o tijera de esquila"], ["🪓", "El hacha"], ["🧹", "La escoba"]], 0, "Pista: corta la lana al ras sin dañar a la oveja.", { promptEmoji: "🐑" }),
    q("¿Qué tecnología usa la maestra para mostrar videos educativos a los alumnos?", [["💻", "La computadora y el proyector"], ["📻", "Una linterna de fuego"], ["🪞", "Un espejo"]], 0, "Pista: se conecta a internet para buscar información.", { promptEmoji: "🏫" }),
    q("¿Qué elemento protege la cabeza de un minero o albañil en su trabajo?", [["⛑️", "El casco de seguridad"], ["🧢", "Una gorra de lana"], ["👑", "Una corona"]], 0, "Pista: es de plástico duro para resistir caídas de objetos.", { promptEmoji: "👷" }),
    q("¿Qué herramienta usa el jardinero para cortar el pasto?", [["🌱", "La cortadora de césped"], ["🪚", "El serrucho de troncos"], ["🔨", "El martillo"]], 0, "Pista: tiene una cuchilla giratoria que empareja el suelo.", { promptEmoji: "🌿" }),
    q("¿Qué usa el panadero para medir los kilos de harina y azúcar?", [["⚖️", "La balanza"], ["📏", "El termómetro de fiebre"], ["🧭", "La brújula"]], 0, "Pista: marca los gramos y kilos exactos para la receta.", { promptEmoji: "🥖" }),
    q("Tocá elementos de protección para trabajadores", [["⛑️", "Casco"], ["🧤", "Guantes de trabajo"], ["🥽", "Antiparras o gafas protectoras"], ["🩴", "Ojotas de playa"]], [0, 1, 2], "Pista: tres cuidan el cuerpo en tareas peligrosas.", { promptEmoji: "🦺" }),
    q("¿Qué herramienta manual sirve para apretar o aflojar tornillos con ranura?", [["🪛", "El destornillador"], ["✂️", "La tijera"], ["🥄", "La cuchara"]], 0, "Pista: tiene punta plana o de estrella.", { promptEmoji: "🛠️" }),
    q("¿Cómo cambiaron las herramientas de trabajo con el tiempo?", [["⚡", "Antes eran manuales y hoy muchas usan motores y electricidad"], ["❌", "No cambiaron nunca"], ["🪵", "Hoy solo se usa madera"]], 0, "Pista: las máquinas ayudan a hacer el trabajo más rápido y con menos esfuerzo.", { promptEmoji: "⚙️" }),
    q("¿Por qué todos los trabajos son importantes para la comunidad?", [["🤝", "Porque cada uno aporta algo necesario para que vivamos mejor"], ["👑", "Porque solo uno manda"], ["💰", "Solo para ganar medallas"]], 0, "Pista: necesitamos de médicos, recolectores, maestros, choferes y panaderos.", { promptEmoji: "🏘️" }),
  ],

  // 9. Transporte Patagónico: Antes y Ahora
  9: [
    q("¿Cómo se trasladaba la lana desde las estancias hasta la costa hace 100 años?", [["🐂", "En chatas y carretas tiradas por bueyes o caballos"], ["✈️", "En aviones de pasajeros"], ["🚇", "En tren bala"]], 0, "Pista: el viaje tardaba semanas enteras por huellas de tierra.", { promptEmoji: "📜" }),
    q("¿Cómo se viaja hoy de Río Gallegos a Buenos Aires en solo tres horas?", [["✈️", "En avión de línea"], ["🐎", "A caballo"], ["🚲", "En bicicleta"]], 0, "Pista: vuela alto por el cielo a gran velocidad.", { promptEmoji: "🛫" }),
    q("¿Qué vehículo lleva alimentos frescos y mercaderías por la Ruta 3 hoy?", [["🚛", "El camión de carga"], ["🛶", "La canoa"], ["🏇", "La diligencia"]], 0, "Pista: tiene acoplado largo y recorre miles de kilómetros.", { promptEmoji: "🛣️" }),
    q("¿Cómo eran los caminos de la Patagonia antes de que existieran las rutas asfaltadas?", [["🌾", "Huellas de tierra y ripio con pozos y zanjas"], ["🛣️", "Autopistas con peaje"], ["🚇", "Túneles con luces"]], 0, "Pista: cuando llovía o nevaba los carros quedaban encajados.", { promptEmoji: "🛞" }),
    q("¿Quién era el carrero patagónico en el pasado?", [["🤠", "El hombre que guiaba las carretas con muchas yuntas de bueyes"], ["🧑‍✈️", "El piloto del avión"], ["🚢", "El capitán del barco"]], 0, "Pista: dormía bajo la chata y conocía todos los pasos del río.", { promptEmoji: "🐂" }),
    q("¿Qué medio de transporte público usan los vecinos para viajar entre pueblos cercanos?", [["🚌", "El colectivo de larga o media distancia"], ["🚀", "El cohete espacial"], ["🛹", "La patineta"]], 0, "Pista: sale de la terminal de ómnibus.", { promptEmoji: "🚍" }),
    q("¿Qué medio de transporte viaja por agua llevando contenedores gigantes?", [["🚢", "El barco de carga o carguero"], ["🚁", "El helicóptero"], ["🚜", "El tractor"]], 0, "Pista: atraca en puertos de aguas profundas.", { promptEmoji: "⚓" }),
    q("¿Por qué hoy viajamos mucho más rápido que en la época de las carretas?", [["🚀", "Por los motores a combustible y las rutas pavimentadas"], ["🐎", "Porque los caballos corren sin parar"], ["☁️", "Porque el viento nos empuja"]], 0, "Pista: la tecnología del transporte avanzó muchísimo.", { promptEmoji: "🚗" }),
    q("Tocá los transportes modernos que usamos hoy en Santa Cruz", [["🚗", "Automóvil"], ["✈️", "Avión"], ["🚌", "Ómnibus"], ["🐂", "Carreta de bueyes"]], [0, 1, 2], "Pista: tres funcionan con motor y tecnología actual.", { promptEmoji: "🛞" }),
    q("¿Qué elemento de seguridad es obligatorio usar en todos los asientos del auto?", [["🔒", "El cinturón de seguridad"], ["🎩", "Un sombrero"], ["🎒", "La mochila puesta"]], 0, "Pista: te sujeta al asiento ante una frenada brusca.", { promptEmoji: "💺" }),
    q("¿Cómo cruzaban los ríos caudalosos los viajeros antes de que hubiera puentes?", [["🛶", "En balsas o buscando pasos playos a caballo"], ["✈️", "Volando con globos"], ["🚇", "Por túneles de cristal"]], 0, "Pista: tenían que esperar que bajara el agua o usar un bote.", { promptEmoji: "🌊" }),
    q("¿Qué ruta nacional recorre toda la costa de Santa Cruz de norte a sur?", [["🛣️", "La Ruta Nacional N.º 3"], ["🛣️", "La Ruta 66"], ["🚇", "La calle principal del pueblo"]], 0, "Pista: conecta Caleta Olivia, San Julián, Piedra Buena y Río Gallegos.", { promptEmoji: "📍" }),
  ],

  // 10. Vías y Rieles de Santa Cruz
  10: [
    q("¿Qué mineral transportaba el histórico tren de Río Turbio a Río Gallegos?", [["🪨", "El carbón mineral"], ["🪙", "Monedas de oro"], ["🧊", "Hielo del glaciar"]], 0, "Pista: se extraía de la mina en la cordillera y se llevaba al puerto.", { promptEmoji: "🚂" }),
    q("¿Cómo funcionaban las antiguas locomotoras a vapor?", [["💨", "Calentando agua con carbón para producir vapor a presión"], ["🔋", "Con pilas recargables"], ["📱", "Con señal de celular"]], 0, "Pista: salía humo blanco y negro por la chimenea.", { promptEmoji: "♨️" }),
    q("¿Sobre qué ruedan los trenes para avanzar?", [["🛤️", "Sobre rieles de acero"], ["🌾", "Sobre pasto suelto"], ["🌊", "Sobre el agua"]], 0, "Pista: forman la vía férrea.", { promptEmoji: "🚂" }),
    q("¿Cómo se llamaba el tren que unía Puerto Deseado con Las Heras?", [["🚂", "El Ferrocarril Patagónico de Puerto Deseado"], ["🚇", "El subte costero"], ["🚀", "El tren bala"]], 0, "Pista: cruzaba la meseta norte y sus estaciones aún se conservan.", { promptEmoji: "🏛️" }),
    q("¿Qué había en cada estación del tren a lo largo del recorrido?", [["🏘️", "Un pueblo que crecía alrededor con almacén y escuela"], ["🌲", "Solo un árbol"], ["🎪", "Un parque acuático"]], 0, "Pista: la llegada del tren daba vida y trabajo al lugar.", { promptEmoji: "🚉" }),
    q("¿Quién conducía la locomotora del tren?", [["🧑‍✈️", "El maquinista y su fogonero"], ["🧑‍🍳", "El cocinero"], ["👮", "El juez"]], 0, "Pista: vigilaba la presión de la caldera y los frenos.", { promptEmoji: "🚂" }),
    q("¿Por qué el tren de trocha angosta de Río Turbio fue una gran hazaña?", [["❄️", "Porque se construyó en pocos meses con frío y nieve extrema"], ["🛋️", "Porque era muy cómodo para dormir"], ["🎪", "Porque era un juego de feria"]], 0, "Pista: los obreros trabajaron en el crudo invierno de 1950.", { promptEmoji: "🥶" }),
    q("¿Qué señal sonora avisa que el tren se acerca a un paso a nivel?", [["📢", "El silbato de la locomotora"], ["🎸", "Una guitarra"], ["🔔", "Un teléfono"]], 0, "Pista: suena muy fuerte para alertar a autos y peatones.", { promptEmoji: "⚠️" }),
    q("¿Dónde podemos ver hoy las históricas locomotoras a vapor en Río Gallegos?", [["🏛️", "En el Museo Ferroviario y monumentos de la ciudad"], ["🌊", "En el fondo del mar"], ["🏔️", "En la punta de un cerro"]], 0, "Pista: se conservan para que todos conozcamos nuestra historia.", { promptEmoji: "📸" }),
    q("Tocá elementos que forman parte de una estación de tren", [["🛤️", "Vías y andén"], ["🔔", "Campana de salida"], ["💧", "Tanque de agua para la caldera"], ["🚢", "Ancla marina"]], [0, 1, 2], "Pista: tres corresponden al servicio del tren.", { promptEmoji: "🚉" }),
    q("¿Por qué el ferrocarril fue tan importante para Santa Cruz?", [["📦", "Porque conectó pueblos lejanos y permitió transportar cargas pesadas"], ["🎈", "Para pasear globos"], ["🏖️", "Para ir a tomar sol"]], 0, "Pista: unió la mina y el campo con el mar.", { promptEmoji: "🤝" }),
    q("¿Cómo se cargaba el carbón en el puerto de Río Gallegos hacia los barcos?", [["🚢", "Por cintas mecánicas al buque carbonero"], ["🥄", "Con cucharitas de té"], ["🎒", "En mochilas escolares"]], 0, "Pista: el muelle carbonero tenía grandes tolvas de descarga.", { promptEmoji: "⚓" }),
  ],

  // 11. El Agua y el Suelo que Cuidamos
  11: [
    q("¿De dónde nace la mayor parte del agua pura de los ríos de Santa Cruz?", [["🏔️", "Del deshielo de la nieve y glaciares de la cordillera"], ["🏖️", "De la arena de la playa"], ["🏭", "De las fábricas"]], 0, "Pista: en primavera la nieve se derrite y baja en arroyos.", { promptEmoji: "🧊" }),
    q("¿Qué río cruza toda la provincia y lleva el nombre de nuestra tierra?", [["🌊", "El Río Santa Cruz"], ["🌊", "El Río Nilo"], ["🌊", "El Río Amazonas"]], 0, "Pista: nace en el lago Argentino y desemboca en el Atlántico.", { promptEmoji: "🏞️" }),
    q("¿Qué le pasa al suelo de la meseta si se comen todo el pasto y sopla el viento?", [["💨", "Se produce desertificación y el suelo se vuela"], ["🌳", "Crecen árboles gigantes"], ["🌸", "Se llena de flores"]], 0, "Pista: las raíces del pasto sujetan la tierra para que no se erosione.", { promptEmoji: "🏜️" }),
    q("¿Qué plantan en las chacras patagónicas para frenar la fuerza del viento?", [["🌲", "Cortinas de álamos y sauces"], ["🌻", "Macetas de flores"], ["🌾", "Pasto cortado"]], 0, "Pista: son hileras de árboles altos que hacen de barrera.", { promptEmoji: "🌬️" }),
    q("¿Cómo debemos actuar cuando visitamos un río, lago o camping?", [["🗑️", "Llevar la basura de regreso con nosotros"], ["🚯", "Dejar botellas tiradas"], ["🔥", "Dejar fuego prendido sin apagar"]], 0, "Pista: no dejar huellas ni contaminar la naturaleza.", { promptEmoji: "🏕️" }),
    q("¿Por qué no se debe hacer fuego en lugares con pasto seco y viento?", [["🔥", "Porque puede desatarse un incendio forestal peligroso"], ["❄️", "Porque cae nieve de golpe"], ["💨", "Porque se apaga la luna"]], 0, "Pista: las chispas vuelan con el viento y queman el bosque.", { promptEmoji: "🚒" }),
    q("¿Qué animales autóctonos comparten las pasturas con el ganado en Santa Cruz?", [["🦙", "El guanaco y el choique"], ["🦒", "La jirafa"], ["🦓", "La cebra"]], 0, "Pista: son especies nativas que viven en libertad.", { promptEmoji: "🌾" }),
    q("¿Qué hábito cotidiano en casa ayuda a no derrochar agua?", [["🚰", "Cerrar la canilla mientras nos enjabonamos"], ["🚿", "Dejar la ducha abierta una hora"], ["💧", "Manguerear la vereda sin parar"]], 0, "Pista: cada gota que no se desperdicia cuenta.", { promptEmoji: "🧼" }),
    q("Tocá acciones que cuidan el suelo y el agua de nuestra provincia", [["🌱", "Plantar árboles"], ["🗑️", "Juntar los residuos"], ["🚰", "Reparar canillas que gotean"], ["🛢️", "Tirar aceite al río"]], [0, 1, 2], "Pista: tres protegen el medio ambiente.", { promptEmoji: "🌍" }),
    q("¿Cómo se llama la capa fértil de la tierra donde crecen las plantas?", [["🌱", "El suelo vegetal"], ["🪨", "La roca pelada"], ["🧱", "El cemento"]], 0, "Pista: tiene materia orgánica y nutrientes.", { promptEmoji: "🌿" }),
    q("¿Por qué es importante cuidar los glaciares?", [["🧊", "Porque son reservas gigantes de agua dulce para el planeta"], ["🍧", "Para hacer helado gratis"], ["📸", "Solo para sacar fotos"]], 0, "Pista: el agua dulce es fundamental para la vida.", { promptEmoji: "🏔️" }),
    q("¿Qué regla debemos seguir si hacemos fuego en un fogón permitido?", [["💧", "Apagarlo con abundante agua hasta que no salga nada de humo"], ["💨", "Soplarlo fuerte para que crezca"], ["🏃", "Irnos corriendo sin mirar"]], 0, "Pista: las cenizas deben quedar frías al tacto.", { promptEmoji: "🔥" }),
  ],

  // 12. Familias Diferentes, Familias Queridas
  12: [
    q("¿Qué une a las personas que forman una familia?", [["❤️", "El cariño, el cuidado y el respeto mutuo"], ["🚗", "Tener el mismo modelo de auto"], ["👕", "Vestirse con la misma ropa"]], 0, "Pista: no importa el tamaño, sino el amor y el apoyo.", { promptEmoji: "👨‍👩‍👧‍👦" }),
    q("¿Todas las familias son iguales o existen muchas formas distintas?", [["🌈", "Existen muchas familias diferentes y todas son valiosas"], ["📏", "Todas tienen que tener la misma cantidad de personas"], ["❌", "Solo hay una forma permitida"]], 0, "Pista: algunas tienen mamá y papá, otras abuelos, tíos o un solo adulto.", { promptEmoji: "🏡" }),
    q("¿Quiénes en la familia suelen contarnos historias de cómo era la vida antes?", [["👵", "Los abuelos y bisabuelos"], ["🍼", "Los bebés recién nacidos"], ["🐕", "Las mascotas"]], 0, "Pista: tienen más años y guardan recuerdos de su infancia.", { promptEmoji: "📖" }),
    q("¿Cómo colaboramos en casa para que la convivencia familiar sea linda?", [["🧹", "Compartiendo las tareas del hogar entre todos"], ["📺", "Dejando que uno solo haga todo mientras los demás miran"], ["😠", "Peleando por los juguetes"]], 0, "Pista: poner la mesa, ordenar la pieza y ayudar alegra el hogar.", { promptEmoji: "🤝" }),
    q("¿Qué costumbre familiar se comparte muchas veces los domingos en Santa Cruz?", [["🥩", "El asado o pastas en familia"], ["🏊", "Bañarse en el río congelado"], ["✈️", "Volar en helicóptero"]], 0, "Pista: sentarse a compartir la mesa y charlar largo rato.", { promptEmoji: "🍽️" }),
    q("¿Qué derecho tienen todas las niñas y niños respecto a su familia?", [["🛡️", "Crecer en un hogar con amor, protección y sin violencia"], ["🎮", "Jugar a la play todo el día sin dormir"], ["🍬", "Comer solo caramelos"]], 0, "Pista: la Convención sobre los Derechos del Niño lo garantiza.", { promptEmoji: "📜" }),
    q("Si en una familia hay un problema o desacuerdo, ¿cómo se resuelve mejor?", [["🗣️", "Hablando con calma y escuchando a cada uno"], ["👊", "Con gritos y golpes"], ["🚪", "Cerrando la puerta para siempre"]], 0, "Pista: el diálogo ayuda a entender qué siente el otro.", { promptEmoji: "💬" }),
    q("¿Qué objeto guarda recuerdos de los momentos compartidos en familia?", [["📸", "El álbum de fotos o videos"], ["🔨", "El serrucho"], ["🧂", "El salero"]], 0, "Pista: allí vemos cumpleaños, paseos y vacaciones.", { promptEmoji: "🖼️" }),
    q("Tocá quiénes pueden formar parte de una familia que nos cuida", [["👵", "Abuelos"], ["👩‍👧", "Mamá y sus hijos"], ["👨‍👦", "Papá y sus hijos"], ["👾", "Un monstruo espacial"]], [0, 1, 2], "Pista: tres son miembros de vínculos familiares amorosos.", { promptEmoji: "💞" }),
    q("¿Por qué es importante respetar las costumbres de las familias de los compañeros?", [["🌍", "Porque cada hogar tiene sus tradiciones y todas merecen respeto"], ["❌", "Porque todos deben hacer lo mismo"], ["📺", "Para salir en la tele"]], 0, "Pista: la diversidad enriquece a la escuela y a la comunidad.", { promptEmoji: "🤝" }),
    q("¿Qué festejo reúne a la familia con regalos y abrazos en la fecha que nació alguien?", [["🎂", "El cumpleaños"], ["🎃", "Halloween"], ["🌲", "El día del árbol"]], 0, "Pista: se soplan velitas y se canta el feliz cumpleaños.", { promptEmoji: "🎉" }),
    q("¿Cómo podemos demostrar cariño a los adultos que nos cuidan?", [["🫂", "Con un abrazo, un dibujo y agradeciendo lo que hacen"], ["😠", "Haciendo berrinches"], ["🙈", "Ignorándolos cuando hablan"]], 0, "Pista: un gesto de cariño alegra el día de la familia.", { promptEmoji: "💌" }),
  ],

  // 13. Los Primeros Habitantes: Aonikenk
  13: [
    q("¿Quiénes fueron los Aonikenk que habitaron el sur de la Patagonia?", [["🏹", "El pueblo originario conocido también como tehuelches"], ["👑", "Reyes llegados de Europa"], ["🛸", "Exploradores espaciales"]], 0, "Pista: vivieron miles de años en armonía con la estepa patagónica.", { promptEmoji: "🏕️" }),
    q("¿Cómo se llamaba la vivienda desmontable de los Aonikenk hecha con palos y cueros?", [["⛺", "El toldo o kau"], ["🏢", "El edificio"], ["🏰", "El castillo de piedra"]], 0, "Pista: se armaba y desarmaba rápido para seguir a los animales.", { promptEmoji: "🛖" }),
    q("¿Con la piel de qué animal fabricaban sus toldos y sus abrigos?", [["🦙", "Del guanaco"], ["🐄", "De la vaca"], ["🐘", "Del elefante"]], 0, "Pista: el guanaco les daba carne, cuero y abrigo contra el frío.", { promptEmoji: "🐾" }),
    q("¿Cómo se llamaba el gran manto de cuero de guanaco que usaban para abrigarse?", [["🧥", "El quillango"], ["🩳", "La bermuda"], ["🎩", "La galera"]], 0, "Pista: se usaba con la piel suave hacia adentro y pintado por fuera.", { promptEmoji: "🎨" }),
    q("¿Qué arma arrojadiza con piedras y tientos de cuero usaban para cazar guanacos y choiques?", [["🪨", "Las boleadoras"], ["🔫", "Pistolas de agua"], ["🪃", "Bumeranes australianos"]], 0, "Pista: se hacían girar en el aire y se enredaban en las patas del animal.", { promptEmoji: "🏹" }),
    q("¿Por qué los Aonikenk eran un pueblo nómade?", [["👣", "Porque se trasladaban siguiendo las manadas de caza y el cambio de estación"], ["🏠", "Porque no les gustaban las casas fijas"], ["🚗", "Porque tenían autos veloces"]], 0, "Pista: se mudaban hacia la cordillera en verano y hacia la costa en invierno.", { promptEmoji: "🗺️" }),
    q("¿Cómo protegían su piel del viento helado y el sol de la meseta?", [["🧈", "Con grasa animal mezclada con pigmentos y arcilla"], ["🧴", "Con cremas compradas en farmacia"], ["🕶️", "Con anteojos de sol"]], 0, "Pista: la grasa de guanaco hacía una capa protectora natural.", { promptEmoji: "💨" }),
    q("¿Quiénes cuidaban a los niños y armaban los toldos en el campamento?", [["👩", "Las mujeres aonikenk"], ["🤖", "Los robots"], ["🐎", "Los caballos solos"]], 0, "Pista: las mujeres eran expertas en coser los cueros con tendones.", { promptEmoji: "🛖" }),
    q("Tocá elementos que formaban parte de la cultura Aonikenk", [["🧥", "Quillango de piel de guanaco"], ["⛺", "Toldo con estacas y cueros"], ["🪨", "Boleadoras"], ["📱", "Teléfono con internet"]], [0, 1, 2], "Pista: tres eran herramientas y pertenencias de su vida tradicional.", { promptEmoji: "🏹" }),
    q("¿Cómo transportaban sus cosas antes de la llegada del caballo?", [["🚶", "Caminando a pie y cargando sus bultos a la espalda"], ["🚂", "En tren"], ["🚗", "En camioneta"]], 0, "Pista: eran caminadores incansables de gran estatura.", { promptEmoji: "👣" }),
    q("¿Qué ave corredora cazaban en la meseta además del guanaco?", [["🪶", "El choique o ñandú petiso"], ["🐧", "El pingüino emperador"], ["🦜", "El loro hablador"]], 0, "Pista: corre muy rápido en la estepa y tiene plumas grises.", { promptEmoji: "🐾" }),
    q("¿Cómo debemos recordar y valorar al pueblo Aonikenk hoy?", [["🤝", "Con profundo respeto como los pobladores ancestrales de Santa Cruz"], ["❌", "Olvidándonos de ellos"], ["📺", "Solo en películas de ficción"]], 0, "Pista: sus huellas, palabras y descendientes siguen presentes en nuestra provincia.", { promptEmoji: "🕊️" }),
  ],

  // 14. Cazadores del Fuego: Selk'nam
  14: [
    q("¿En qué isla del extremo sur argentino habitaron los Selk'nam?", [["🏝️", "En la Isla Grande de Tierra del Fuego"], ["🌴", "En una isla del Caribe"], ["🌊", "En las Islas Galápagos"]], 0, "Pista: al sur del Estrecho de Magallanes.", { promptEmoji: "🗺️" }),
    q("¿Por qué los navegantes europeos llamaron a esa zona 'Tierra del Fuego'?", [["🔥", "Por las grandes fogatas que los pueblos originarios mantenían prendidas"], ["🌋", "Porque había mil volcanes en erupción"], ["☀️", "Porque hacía un calor insoportable"]], 0, "Pista: veían columnas de humo desde sus barcos en la noche.", { promptEmoji: "⛵" }),
    q("¿Con qué armas cazaban los Selk'nam al guanaco en los bosques australes?", [["🏹", "Con arco y flechas de punta de piedra o vidrio"], ["🔫", "Con rayos láser"], ["💣", "Con cañones"]], 0, "Pista: eran arqueros muy silenciosos y precisos.", { promptEmoji: "🎯" }),
    q("¿Qué refugio semicircular de palos y cueros usaban contra la nieve?", [["🛖", "El paravientos o choza cónica de ramas"], ["🏢", "El rascacielos"], ["🏰", "El castillo de hielo"]], 0, "Pista: se orientaba de espaldas al viento que traía la ventisca.", { promptEmoji: "❄️" }),
    q("¿Cómo se llamaba la importante ceremonia donde los jóvenes pasaban a ser adultos?", [["🎭", "El Hain"], ["🎂", "El cumpleaños de quince"], ["🎪", "El carnaval"]], 0, "Pista: en el Hain pintaban sus cuerpos con rayas y puntos de colores.", { promptEmoji: "🎨" }),
    q("¿Qué colores minerales usaban para pintar sus cuerpos con gran arte?", [["🎨", "Rojo, blanco, negro y amarillo"], ["🟣", "Fucsia brillante con purpurina"], ["🟢", "Verde flúor con brillantina"]], 0, "Pista: obtenían pigmentos de arcilla, carbón y rocas molidas.", { promptEmoji: "🪨" }),
    q("¿Qué animal del mar aprovechaban cuando salía a la costa?", [["🦭", "Lobos marinos y ballenas varadas"], ["🦈", "Tiburones blancos"], ["🐊", "Cocodrilos"]], 0, "Pista: la grasa de foca o lobo marino les daba mucho calor y alimento.", { promptEmoji: "🌊" }),
    q("¿Cómo encendían fuego en medio de la nieve y la humedad?", [["🪨", "Frotando piedras de pirita sobre yesca seca"], ["🔥", "Con fósforos de quiosco"], ["⚡", "Con microondas"]], 0, "Pista: sacaban chispas golpeando dos piedras duras.", { promptEmoji: "✨" }),
    q("Tocá elementos característicos de la cultura Selk'nam", [["🏹", "Arco y flechas"], ["🎨", "Pinturas corporales del Hain"], ["🧥", "Capa de piel de guanaco"], ["🚗", "Auto con motor a nafta"]], [0, 1, 2], "Pista: tres corresponden a su modo de vida ancestral.", { promptEmoji: "❄️" }),
    q("¿Cómo se transmitían las historias y leyendas de generación en generación?", [["🗣️", "De boca en boca, contadas por los ancianos junto al fuego"], ["💻", "Por mensajes de WhatsApp"], ["📚", "En libros de computadora"]], 0, "Pista: la tradición oral mantenía viva su historia milenaria.", { promptEmoji: "🔥" }),
    q("¿Qué calzado abrigado de cuero de guanaco usaban con la piel hacia adentro?", [["👞", "Mocasines o 'k'o'chel'"], ["🩴", "Ojotas"], ["⛸️", "Patines de hielo con ruedas"]], 0, "Pista: cubría los pies y se ataba a los tobillos para caminar en la nieve.", { promptEmoji: "🦶" }),
    q("¿Qué valor tiene recordar a los Selk'nam en la escuela?", [["🕊️", "Reconocer su rica cultura y reparar la memoria histórica de nuestra Patagonia"], ["🎭", "Solo para disfrazarse"], ["❌", "Ningún valor"]], 0, "Pista: sus descendientes y su legado forman parte viva de nuestro patrimonio.", { promptEmoji: "🤝" }),
  ],

  // 15. Cocinar y Calentar: Cambios en el Hogar
  15: [
    q("¿Qué se usaba antiguamente en las casas patagónicas para iluminar de noche?", [["🕯️", "Velas y lámparas de querosén"], ["💡", "Luces LED"], ["📱", "La linterna del celular"]], 0, "Pista: tenían una mecha encendida con fuego.", { promptEmoji: "🕰️" }),
    q("¿Cómo se calientan hoy la mayoría de las casas en Santa Cruz?", [["🔥", "Con calefactores y radiadores a gas natural"], ["🪵", "Solo quemando ramas en el piso"], ["❄️", "Poniendo bloques de hielo"]], 0, "Pista: el gas llega por cañerías a cada artefacto.", { promptEmoji: "🏠" }),
    q("¿Dónde se cocinaba la comida antes de que existieran las cocinas a gas?", [["🪵", "En fogones a leña o cocinas de hierro económicas"], ["⚡", "En hornos microondas"], ["🧊", "En la heladera"]], 0, "Pista: había que picar leña con hacha para alimentar el fuego.", { promptEmoji: "🔥" }),
    q("¿Cómo se conservaban los alimentos antes de inventarse la heladera eléctrica?", [["🧂", "Con sal, carnes ahumadas o en piezas frescas al reparo"], ["📱", "En una app"], ["☀️", "Al sol caliente"]], 0, "Pista: la salazón y el charqui evitaban que la carne se pudriera.", { promptEmoji: "🥩" }),
    q("¿Qué artefacto moderno usamos hoy para calentar comida en un minuto?", [["⚡", "El horno microondas"], ["🪵", "La chimenea"], ["🕯️", "Una vela"]], 0, "Pista: funciona con electricidad y temporizador digital.", { promptEmoji: "🍲" }),
    q("¿Cómo se planchaba la ropa en la época de las abuelas sin electricidad?", [["🪵", "Con planchas pesadas de hierro cargadas con brasas calientes"], ["💻", "Con la pantalla de la computadora"], ["💨", "Con el soplador de hojas"]], 0, "Pista: se abrían para meter carbón prendido adentro.", { promptEmoji: "👔" }),
    q("¿Cómo se conseguía agua adentro de la casa antes de las canillas corrientes?", [["🪣", "Acarreando baldes desde el pozo, río o aljibe"], ["🚰", "Abriendo la canilla mágica"], ["🛒", "Comprando agua enlatada"]], 0, "Pista: había que caminar hasta el manantial con dos baldes pesados.", { promptEmoji: "💧" }),
    q("¿Qué ventaja trajo la luz eléctrica a los hogares?", [["💡", "Luz limpia, segura e instantánea al tocar una tecla"], ["🔥", "Mucho humo y hollín negro"], ["🥶", "Que se apague todo el tiempo"]], 0, "Pista: no genera humo ni riesgo de volcar una vela encendida.", { promptEmoji: "⚡" }),
    q("Tocá artefactos modernos que hacen más fácil la vida cotidiana hoy", [["🧊", "Heladera con freezer"], ["🧺", "Lavarropas automático"], ["🔥", "Cocina a gas"], ["🕯️", "Lámpara de aceite con mecha"]], [0, 1, 2], "Pista: tres funcionan con gas o electricidad moderna.", { promptEmoji: "🏠" }),
    q("¿Qué combustible fósil se extrae en yacimientos santacruceños para calentar el país?", [["🔥", "El gas y el petróleo"], ["🪵", "Madera de palmera"], ["🧂", "Sal marina"]], 0, "Pista: viaja por gasoductos desde el sur hacia todo el territorio.", { promptEmoji: "🛢️" }),
    q("¿Cómo nos comunicamos hoy al instante con familiares que viven lejos?", [["📱", "Por videollamada o teléfono celular"], ["✉️", "Esperando una carta en carreta tres meses"], ["💨", "Haciendo señales de humo"]], 0, "Pista: internet permite vernos en la pantalla en tiempo real.", { promptEmoji: "📞" }),
    q("¿Por qué es importante cuidar y no derrochar el gas en invierno?", [["🔥", "Porque es un recurso no renovable y su uso responsable cuida a todos"], ["❄️", "Porque si no hace calor en la calle"], ["💨", "Porque se apaga el viento"]], 0, "Pista: cerrar ventanas si la calefacción está prendida y usar ropa adecuada.", { promptEmoji: "🧣" }),
  ],

  // 16. Cueva de las Manos y Huellas del Pasado
  16: [
    q("¿En qué cañadón de Santa Cruz se encuentra la famosa Cueva de las Manos?", [["🏞️", "En el Cañadón del Río Pinturas"], ["🏙️", "En el centro de Río Gallegos"], ["🏖️", "En la playa de Caleta Olivia"]], 0, "Pista: es un imponente cañadón de roca cerca de Perito Moreno y Bajo Caracoles.", { promptEmoji: "🖐️" }),
    q("¿Hace cuántos miles de años comenzaron a pintar los cazadores en la roca?", [["⏳", "Hace más de 9.000 años"], ["📅", "Hace diez días"], ["🕰️", "Hace cincuenta años"]], 0, "Pista: son pinturas milenarias de la prehistoria americana.", { promptEmoji: "🎨" }),
    q("¿Cómo hacían el 'negativo' de la mano en la pared de piedra?", [["🖐️", "Apoyaban la mano y soplaban pintura con un hueso hueco alrededor"], ["🖌️", "Con fibrones de colores"], ["🖨️", "Con una fotocopiadora"]], 0, "Pista: al sacar la mano quedaba la silueta blanca o roja.", { promptEmoji: "💨" }),
    q("¿Qué animales aparecen pintados en escenas de caza en la cueva?", [["🦙", "Guanacos y choiques"], ["🦁", "Leones africanos"], ["🦖", "Dinosaurios con alas"]], 0, "Pista: se ven pequeños cazadores persiguiendo manadas de guanacos.", { promptEmoji: "🏹" }),
    q("¿Con qué fabricaban las pinturas los artistas originarios?", [["🪨", "Con minerales molidos mezclados con grasa y agua"], ["🎨", "Con témperas plásticas"], ["🥫", "Con pintura de ferretería"]], 0, "Pista: usaban óxidos de hierro para el rojo y yeso para el blanco.", { promptEmoji: "🎨" }),
    q("¿Por qué la Cueva de las Manos fue declarada Patrimonio de la Humanidad por la UNESCO?", [["🌍", "Por su inmenso valor histórico, cultural y artístico para todo el mundo"], ["🎢", "Porque tiene una montaña rusa"], ["🍔", "Por sus locales de comida"]], 0, "Pista: es un tesoro arqueológico protegido que nos enorgullece.", { promptEmoji: "🏛️" }),
    q("¿Qué regla fundamental debemos cumplir cuando visitamos un sitio arqueológico?", [["🚫", "No tocar las pinturas ni escribir sobre las rocas"], ["🖍️", "Pintar nuestro nombre encima con tiza"], ["🪨", "Arrancar pedazos de piedra para llevar a casa"]], 0, "Pista: la grasa de los dedos daña las pinturas milenarias.", { promptEmoji: "🚯" }),
    q("¿Quiénes estudian los restos del pasado para contarnos cómo vivían los antiguos pobladores?", [["🔍", "Los arqueólogos e historiadores"], ["🧑‍🍳", "Los cocineros"], ["🧑‍✈️", "Los pilotos"]], 0, "Pista: examinan fósiles, herramientas de piedra y pinturas.", { promptEmoji: "🦴" }),
    q("Tocá lo que podemos ver en las paredes de la Cueva de las Manos", [["🖐️", "Siluetas de manos"], ["🦙", "Guanacos corriendo"], ["⭕", "Figuras geométricas y puntos"], ["🚗", "Dibujos de camiones modernos"]], [0, 1, 2], "Pista: tres fueron pintadas por los antiguos cazadores.", { promptEmoji: "🖼️" }),
    q("¿Cómo se llama la persona que nos acompaña y nos explica todo en la visita guiada?", [["🧭", "El guía del parque o guardaparque"], ["🤡", "El animador de circo"], ["👮", "El juez"]], 0, "Pista: conoce la historia del cañadón y cuida el lugar.", { promptEmoji: "🏞️" }),
    q("¿Por qué las pinturas duraron miles de años sin borrarse?", [["🪨", "Porque la roca tiene aleros que la protegen de la lluvia y el clima es seco"], ["🧴", "Porque le pusieron barniz de plástico"], ["🏠", "Porque estaban adentro de una heladera"]], 0, "Pista: el techo de piedra protegió las paredes del agua y del sol directo.", { promptEmoji: "☀️" }),
    q("¿Qué sentimos al ver las manos pintadas hace miles de años en nuestra provincia?", [["❤️", "Emoción y respeto por las personas que vivieron aquí antes que nosotros"], ["😴", "Mucho aburrimiento"], ["😡", "Enfado sin motivo"]], 0, "Pista: es un saludo de miles de años que llega hasta hoy.", { promptEmoji: "🤝" }),
  ],

  // 17. Instituciones de Nuestra Comunidad
  17: [
    q("¿Quién gobierna el municipio de una ciudad y cuida sus plazas y calles?", [["🏛️", "El Intendente y los concejales"], ["🧑‍✈️", "El capitán del barco"], ["🧑‍🍳", "El jefe de cocina"]], 0, "Pista: trabaja en la Municipalidad con los vecinos.", { promptEmoji: "🏢" }),
    q("¿Quiénes arriesgan su vida apagando incendios y rescatando personas voluntariamente?", [["🚒", "Los bomberos voluntarios"], ["🎭", "Los actores de cine"], ["⚽", "Los futbolistas"]], 0, "Pista: acuden de inmediato ante la sirena de emergencia.", { promptEmoji: "🚨" }),
    q("¿Qué institución atiende a las personas lastimadas o enfermas a cualquier hora?", [["🏥", "El hospital público con su guardia de emergencias"], ["📚", "La biblioteca"], ["🎪", "El teatro"]], 0, "Pista: médicos, enfermeros y ambulancias siempre están de guardia.", { promptEmoji: "🚑" }),
    q("¿Dónde se reúnen los chicos todos los días para aprender y compartir con sus maestros?", [["🏫", "En la escuela"], ["🏦", "En el banco"], ["⛽", "En la estación de servicio"]], 0, "Pista: tiene aulas, patio, biblioteca y maestras.", { promptEmoji: "📚" }),
    q("¿Qué institución cuida el orden público y la seguridad en los barrios?", [["👮", "La policía de la provincia"], ["🧑‍🎨", "Los poetas"], ["🧑‍🌾", "Los horticultores"]], 0, "Pista: patrullan en móviles y atienden en la comisaría.", { promptEmoji: "🚓" }),
    q("¿Dónde podemos ir a consultar libros y cuentos sin tener que comprarlos?", [["📚", "En la biblioteca popular o escolar"], ["🏪", "En el kiosco"], ["🛒", "En el supermercado"]], 0, "Pista: te prestan libros para leer en la sala o llevar a casa.", { promptEmoji: "📖" }),
    q("¿Qué institución barrial organiza deportes como fútbol, básquet o patín para chicos?", [["⚽", "El club deportivo o sociedad de fomento"], ["🏥", "El hospital"], ["🏤", "El correo"]], 0, "Pista: tiene canchas, vestuarios y profes de educación física.", { promptEmoji: "🏆" }),
    q("¿Quiénes eligen a las autoridades que gobiernan el municipio y la provincia?", [["🗳️", "Los ciudadanos mediante el voto democrático"], ["👑", "Un rey extranjero"], ["🎲", "Se sortea con un dado"]], 0, "Pista: las personas votan libremente en las elecciones.", { promptEmoji: "🗳️" }),
    q("Tocá las instituciones fundamentales de una comunidad organizada", [["🏥", "Hospital"], ["🏫", "Escuela"], ["🚒", "Cuartel de bomberos"], ["🎰", "Casino de juegos"]], [0, 1, 2], "Pista: tres brindan servicios esenciales a toda la población.", { promptEmoji: "🏘️" }),
    q("¿Cómo podemos colaborar los ciudadanos con las instituciones de nuestro pueblo?", [["🤝", "Cuidando los espacios públicos y participando solidariamente"], ["🗑️", "Rompiendo los juegos de la plaza"], ["🛑", "Desobedeciendo todas las normas"]], 0, "Pista: una comunidad linda se construye entre todos.", { promptEmoji: "🌳" }),
    q("¿A qué número de emergencias se llama para pedir una ambulancia en salud?", [["📞", "Al 107"], ["📞", "Al 000"], ["📞", "A ningún número"]], 0, "Pista: es la línea telefónica gratuita para emergencias médicas.", { promptEmoji: "🚑" }),
    q("¿Por qué las instituciones necesitan que los vecinos paguen los impuestos y tasas?", [["🏛️", "Para sostener los sueldos, ambulancias, patrulleros y obras públicas"], ["🍬", "Para comprar caramelos al intendente"], ["🎁", "Solo para guardar plata en cajas"]], 0, "Pista: los recursos públicos se usan para brindar servicios a la comunidad.", { promptEmoji: "🪙" }),
  ],

  // 18. Normas y Acuerdos de Convivencia
  18: [
    q("¿Para qué sirven las normas y acuerdos de convivencia en el aula?", [["🤝", "Para respetarnos, cuidarnos y trabajar en armonía"], ["😠", "Para que nadie hable nunca"], ["🏃", "Para correr descontrolados"]], 0, "Pista: nos ayudan a convivir con alegría y sin lastimarnos.", { promptEmoji: "🏫" }),
    q("¿Qué debemos hacer cuando un compañero está hablando en la ronda?", [["👂", "Escuchar con atención y esperar nuestro turno para hablar"], ["🗣️", "Gritar encima de él"], ["🚪", "Irnos del aula"]], 0, "Pista: levantar la mano permite que todos podamos expresarnos.", { promptEmoji: "✋" }),
    q("¿Qué señal de tránsito indica que los autos deben detenerse por completo?", [["🛑", "El cartel rojo de PARE"], ["🟢", "La flecha verde de avance"], ["🎈", "Un dibujo de un payaso"]], 0, "Pista: es un octógono rojo con letras blancas.", { promptEmoji: "🚗" }),
    q("Si dos chicos quieren jugar con el mismo juguete al mismo tiempo, ¿cómo lo resuelven?", [["🤝", "Conversando, compartiendo o turnándose un ratito cada uno"], ["👊", "Tironeando hasta romperlo"], ["😭", "Llorando sin hablar"]], 0, "Pista: compartir hace que los dos puedan disfrutar.", { promptEmoji: "🧸" }),
    q("¿Por qué es importante decir palabras como 'por favor', 'gracias' y 'disculpas'?", [["✨", "Porque demuestran respeto y consideración hacia los demás"], ["❌", "Porque no tienen ningún significado"], ["🤫", "Para hablar en código secreto"]], 0, "Pista: son llaves mágicas de la buena convivencia.", { promptEmoji: "💬" }),
    q("¿Qué debemos hacer con los útiles del aula y los juegos del recreo?", [["📦", "Cuidarlos y ordenarlos al terminar para que duren"], ["🗑️", "Tirarlos al piso"], ["🔨", "Romperlos a propósito"]], 0, "Pista: son para que los usemos todos los días.", { promptEmoji: "🎨" }),
    q("¿Por qué no se debe empujar en la fila ni en las escaleras de la escuela?", [["⚠️", "Porque alguien puede tropezar y lastimarse gravemente"], ["🏃", "Porque se llega más lento"], ["🤫", "Porque hace ruido"]], 0, "Pista: la seguridad de los compañeros es lo primero.", { promptEmoji: "🚸" }),
    q("¿Quiénes construyen los acuerdos de convivencia en la escuela?", [["👩‍🏫", "Los alumnos junto con la maestra y directivos"], ["🤖", "Un robot lejano"], ["📺", "La televisión"]], 0, "Pista: cuando todos participamos en crearlos, es más fácil cumplirlos.", { promptEmoji: "📝" }),
    q("Tocá buenas actitudes de convivencia escolar", [["🤝", "Ayudar a un compañero que no entendió"], ["🤗", "Integrar a quien está solo en el recreo"], ["👂", "Pedir las cosas amablemente"], ["😠", "Burlarse de los demás"]], [0, 1, 2], "Pista: tres construyen un ambiente cálido y seguro.", { promptEmoji: "💞" }),
    q("¿Qué pasa si nadie cumpliera las normas de tránsito en la calle?", [["🚗", "Habría muchos accidentes y peligro para todos"], ["🎉", "Sería una gran fiesta"], ["🌸", "Crecerían flores en el asfalto"]], 0, "Pista: las normas protegen la vida de peatones y conductores.", { promptEmoji: "🚦" }),
    q("Si rompimos algo sin querer o nos equivocamos, ¿qué es lo correcto hacer?", [["🗣️", "Reconocerlo con la verdad, pedir disculpas y ayudar a repararlo"], ["🏃", "Echarle la culpa a otro y salir corriendo"], ["🙈", "Hacer como que no vimos nada"]], 0, "Pista: asumir los errores con valentía nos hace crecer.", { promptEmoji: "🕊️" }),
    q("¿Por qué vivir en una sociedad democrática significa tener derechos y responsabilidades?", [["⚖️", "Porque todos tenemos derechos que nos protegen y deberes que cumplir con los demás"], ["👑", "Porque solo manda una persona sin rendir cuentas"], ["🎮", "Porque es un videojuego"]], 0, "Pista: mis derechos terminan donde empiezan los derechos de los demás.", { promptEmoji: "📜" }),
  ],
};

// Actividades estructuradas complementarias por mundo (ordenar, clasificar, comprensión de historias).
export const EXTRA_SOCIALES: Record<number, ActivitySpec[]> = {
  // 1. Paisajes de Santa Cruz
  1: [
    makeClassify(
      "s1-ex-0",
      "Clasificá cada elemento según el paisaje donde se encuentra.",
      ["Cordillera y Bosque", "Costa del Mar"],
      [
        { label: "🌲 Bosque de lengas", cat: 0 },
        { label: "🐧 Pingüinos en la playa", cat: 1 },
        { label: "🏔️ Glaciar Perito Moreno", cat: 0 },
        { label: "⚓ Puerto con barcos", cat: 1 },
        { label: "🦌 Huemul andino", cat: 0 },
        { label: "🦭 Lobos marinos", cat: 1 },
      ],
      "Pista: pensá si vive entre montañas o junto a las olas del mar.",
      ["s2-paisajes"]
    ),
    makeStoryPick(
      "s1-ex-1",
      {
        title: "El viaje de Martina por Santa Cruz",
        text: "Martina y su abuelo salieron temprano en auto desde Río Gallegos. Primero cruzaron la meseta de coirones con mucho viento. Luego de varias horas llegaron a El Calafate y vieron el imponente glaciar de hielo azul rodeado de lengas doradas.",
      },
      "¿Qué paisaje vieron Martina y su abuelo al llegar a El Calafate?",
      [["🏔️", "El glaciar rodeado de bosque"], ["🏖️", "Una playa con palmeras"], ["🏙️", "Grandes rascacielos de cemento"]],
      0,
      "Pista: leé el final del relato de Martina.",
      ["s2-paisajes"]
    ),
  ],

  // 2. Vivir en la Ciudad
  2: [
    makeOrder(
      "s2-ex-0",
      "Ordená los pasos seguros para cruzar una calle en la ciudad.",
      [
        "1. Parar en la esquina sobre la vereda",
        "2. Mirar hacia ambos lados y ver el semáforo",
        "3. Cruzar caminando por la senda peatonal",
      ],
      "Pista: primero te detenés, después mirás el tránsito y cruzás con cuidado.",
      ["s2-espacio-urbano"]
    ),
    makeClassify(
      "s2-ex-1",
      "Clasificá cada elemento si pertenece al espacio urbano o rural.",
      ["Espacio Urbano (Ciudad)", "Espacio Rural (Campo)"],
      [
        { label: "🚦 Semáforo en la esquina", cat: 0 },
        { label: "🚜 Tractor en la estancia", cat: 1 },
        { label: "🏢 Edificio de departamentos", cat: 0 },
        { label: "🐑 Gran corral de ovejas", cat: 1 },
        { label: "🚌 Colectivo con paradas", cat: 0 },
        { label: "💨 Molino de viento de agua", cat: 1 },
      ],
      "Pista: pensá dónde hay calles con mucho tránsito y dónde campos abiertos.",
      ["s2-espacio-urbano", "s2-paisajes"]
    ),
  ],

  // 3. Vivir en el Campo Patagónico
  3: [
    makeStoryPick(
      "s3-ex-0",
      {
        title: "Un día en el puesto",
        text: "Don Esteban vive en un puesto de estancia a 80 kilómetros del pueblo. A la mañana ensilla su caballo 'Tordillo' y sale con su perro ovejero 'Rayo' a recorrer los alambrados. Al mediodía calienta agua en la pava a leña y toma unos ricos mates.",
      },
      "¿Quién acompaña a Don Esteban a recorrer los alambrados?",
      [["🐕", "Su perro ovejero Rayo"], ["🐈", "Un gato dormilón"], ["🦜", "Un loro hablador"]],
      0,
      "Pista: es su fiel compañero de cuatro patas que sabe arrear.",
      ["s2-paisajes"]
    ),
    makeClassify(
      "s3-ex-1",
      "¿Cómo resuelven las necesidades en el campo sin servicios de red?",
      ["En la Estancia Rural", "En la Ciudad"],
      [
        { label: "💨 Molino de viento para sacar agua de pozo", cat: 0 },
        { label: "🚰 Canilla con agua de red", cat: 1 },
        { label: "📻 Radio VHF para comunicarse a distancia", cat: 0 },
        { label: "📱 Teléfono con antena en cada esquina", cat: 1 },
        { label: "🪵 Estufa a leña picada", cat: 0 },
        { label: "🔥 Radiador con gas natural por cañería", cat: 1 },
      ],
      "Pista: en el campo se aprovecha el molino, la leña y los generadores.",
      ["s2-paisajes", "s2-espacio-urbano"]
    ),
  ],

  // 4. Los Servicios Públicos
  4: [
    makeClassify(
      "s4-ex-0",
      "Clasificá cada servicio según la necesidad que atiende.",
      ["Salud y Emergencia", "Energía y Hogar"],
      [
        { label: "🏥 Guardia del Hospital", cat: 0 },
        { label: "🔥 Gas natural por red", cat: 1 },
        { label: "🚒 Autobomba de Bomberos", cat: 0 },
        { label: "⚡ Luz eléctrica para electrodomésticos", cat: 1 },
        { label: "🚑 Ambulancia del 107", cat: 0 },
        { label: "🚰 Agua potable de red", cat: 1 },
      ],
      "Pista: distinguí los servicios que curan o rescatan de los que hacen funcionar la casa.",
      ["s2-espacio-urbano"]
    ),
    makeMultiPick(
      "s4-ex-1",
      "Tocá todas las formas de cuidar los servicios públicos en tu casa",
      [
        ["🚰", "Cerrar la canilla mientras te lavás los dientes"],
        ["💡", "Apagar las luces de los ambientes vacíos"],
        ["🚪", "Cerrar la puerta para no perder calor en invierno"],
        ["🚿", "Dejar abierta la ducha con agua caliente media hora"],
      ],
      [0, 1, 2],
      "Pista: tres acciones ahorran agua y gas.",
      ["s2-espacio-urbano"]
    ),
  ],

  // 5. Del Campo a la Mesa: La Lana
  5: [
    makeOrder(
      "s5-ex-0",
      "Ordená las etapas del circuito productivo de la lana.",
      [
        "1. Cría de las ovejas y esquila en primavera",
        "2. Lavado, hilado y teñido en madejas",
        "3. Tejido de pulóveres, gorros y mantas",
      ],
      "Pista: primero se corta el vellón, luego se procesa la fibra y al final se teje.",
      ["s2-circuitos"]
    ),
    makeClassify(
      "s5-ex-1",
      "Clasificá los elementos entre materia prima del campo o producto manufacturado.",
      ["Materia Prima", "Producto Elaborado"],
      [
        { label: "🐑 Vellón de lana cruda", cat: 0 },
        { label: "🧣 Bufanda abrigada tejida", cat: 1 },
        { label: "🌾 Trigo cosechado en espiga", cat: 0 },
        { label: "🥖 Pan horneado", cat: 1 },
        { label: "🐟 Pescado recién sacado del mar", cat: 0 },
        { label: "🥫 Lata de filetes congelados", cat: 1 },
      ],
      "Pista: la materia prima sale de la naturaleza y el producto se transforma en fábrica o taller.",
      ["s2-circuitos", "s2-trabajos-tecnologia"]
    ),
  ],

  // 6. Del Trigo al Pan
  6: [
    makeOrder(
      "s6-ex-0",
      "Ordená los pasos para hacer el pan desde el campo hasta la panadería.",
      [
        "1. Cosechar el trigo dorado en el campo",
        "2. Moler los granos para obtener harina",
        "3. Amasar con levadura y hornear el pan",
      ],
      "Pista: empieza con la planta, sigue en el molino y termina en el horno caliente.",
      ["s2-circuitos"]
    ),
    makeStoryPick(
      "s6-ex-1",
      {
        title: "La madrugada de Don Mario",
        text: "A las cuatro de la mañana, cuando la ciudad todavía duerme, Don Mario enciende el gran horno de su panadería. Mezcla en la batea la harina blanca, agua tibia, levadura y sal. La masa descansa tapada hasta que dobla su tamaño, y recién ahí forma las baguettes y medialunas.",
      },
      "¿Por qué Don Mario deja descansar la masa tapada?",
      [["🍞", "Para que la levadura haga crecer la masa"], ["❄️", "Para que se congele como hielo"], ["😴", "Para que se duerma Don Mario"]],
      0,
      "Pista: la levadura necesita tiempo y calor para inflar la masa.",
      ["s2-circuitos"]
    ),
  ],

  // 7. Los Frutos del Mar Austral
  7: [
    makeClassify(
      "s7-ex-0",
      "Clasificá los trabajos entre los que se hacen en el mar y los que se hacen en el puerto.",
      ["Trabajo en el Mar", "Trabajo en el Puerto y Planta"],
      [
        { label: "⚓ Echar las redes al agua desde el barco", cat: 0 },
        { label: "🏭 Filetear el pescado en la cinta", cat: 1 },
        { label: "🧭 Navegar buscando cardúmenes", cat: 0 },
        { label: "🧊 Empacar langostinos en cajas congeladas", cat: 1 },
        { label: "🌊 Mantener el barco en equilibrio en el oleaje", cat: 0 },
        { label: "🚛 Cargar cajas en camiones frigoríficos", cat: 1 },
      ],
      "Pista: separá lo que hace la tripulación a bordo de lo que hacen los operarios en tierra.",
      ["s2-circuitos", "s2-trabajos-tecnologia"]
    ),
    makeOrder(
      "s7-ex-1",
      "Ordená el camino del pescado desde el océano hasta la mesa.",
      [
        "1. Pesca en barco y conservación con hielo en bodega",
        "2. Descarga en muelle y procesamiento en la planta",
        "3. Venta en pescadería y cocción en familia",
      ],
      "Pista: del barco al muelle, del muelle a la planta y de allí al plato.",
      ["s2-circuitos"]
    ),
  ],

  // 8. Trabajadores y Herramientas
  8: [
    makeClassify(
      "s8-ex-0",
      "Uní cada herramienta con la profesión correspondiente.",
      ["Carpintero o Constructor", "Médico o Enfermera"],
      [
        { label: "🔨 Martillo y clavos", cat: 0 },
        { label: "🩺 Estetoscopio para el corazón", cat: 1 },
        { label: "🪚 Serrucho para cortar madera", cat: 0 },
        { label: "🌡️ Termómetro clínico", cat: 1 },
        { label: "📏 Metro de carpintero", cat: 0 },
        { label: "🩹 Gasas y desinfectante", cat: 1 },
      ],
      "Pista: pensá quién arregla mesas y paredes y quién atiende la salud.",
      ["s2-trabajos-tecnologia"]
    ),
    makeStoryPick(
      "s8-ex-1",
      {
        title: "Las herramientas del abuelo Tomás",
        text: "El abuelo Tomás guarda en su taller herramientas que usó durante cuarenta años de mecánico. Hoy le enseña a su nieta Clara a usar la llave fija para ajustar una tuerca de la bicicleta. 'La herramienta adecuada hace el trabajo fácil y seguro', le dice con una sonrisa.",
      },
      "¿Qué le enseña el abuelo Tomás a Clara?",
      [["🚲", "A usar la herramienta correcta para ajustar la bicicleta"], ["🚗", "A manejar un camión por la ruta"], ["🔨", "A romper maderas con martillo"]],
      0,
      "Pista: la ayuda a arreglar su bici en el taller.",
      ["s2-trabajos-tecnologia"]
    ),
  ],

  // 9. Transporte Patagónico: Antes y Ahora
  9: [
    makeClassify(
      "s9-ex-0",
      "Clasificá los transportes según la época: del pasado patagónico o de la actualidad.",
      ["Transporte del Pasado", "Transporte Actual"],
      [
        { label: "🐂 Chata tirada por bueyes", cat: 0 },
        { label: "✈️ Avión a reacción", cat: 1 },
        { label: "🏇 Diligencia a caballo", cat: 0 },
        { label: "🚛 Camión con acoplado frigorífico", cat: 1 },
        { label: "🐴 Mensajero a caballo por la huella", cat: 0 },
        { label: "🛻 Camioneta 4x4", cat: 1 },
      ],
      "Pista: los transportes antiguos dependían de la fuerza de los animales.",
      ["s2-transportes"]
    ),
    makeOrder(
      "s9-ex-1",
      "Ordená de más lento a más rápido estos medios de transporte.",
      [
        "1. Carreta de bueyes (a paso lento)",
        "2. Camioneta por ruta asfaltada",
        "3. Avión por el aire",
      ],
      "Pista: los bueyes van despacito y el avión vuela a cientos de kilómetros por hora.",
      ["s2-transportes"]
    ),
  ],

  // 10. Vías y Rieles de Santa Cruz
  10: [
    makeOrder(
      "s10-ex-0",
      "Ordená el viaje del tren carbonero de Santa Cruz.",
      [
        "1. Cargar el carbón extraído de la mina en Río Turbio",
        "2. Recorrer las vías cruzando la estepa con la locomotora",
        "3. Descargar en el puerto de Río Gallegos hacia los barcos",
      ],
      "Pista: empieza en la cordillera minera y termina en el puerto atlántico.",
      ["s2-transportes", "s2-patrimonio-huellas"]
    ),
    makeStoryPick(
      "s10-ex-1",
      {
        title: "El silbato en la estepa",
        text: "Don Juan fue fogonero del ferrocarril de Río Turbio. En invierno, paleaba carbón dentro de la caldera para mantener la presión de vapor mientras afuera caía una fuerte nevada. Cuando el tren llegaba a la estación, tocaba dos veces el silbato y los chicos del pueblo salían a saludar.",
      },
      "¿Qué trabajo hacía Don Juan en la locomotora?",
      [["♨️", "Paleaba carbón a la caldera para generar vapor"], ["🎫", "Cortaba los boletos"], ["🛑", "Cambiaba las ruedas de goma"]],
      0,
      "Pista: alimentaba el fuego de la máquina a vapor.",
      ["s2-transportes", "s2-patrimonio-huellas"]
    ),
  ],

  // 11. El Agua y el Suelo que Cuidamos
  11: [
    makeClassify(
      "s11-ex-0",
      "Clasificá las acciones según si cuidan o dañan el medio ambiente patagónico.",
      ["Acción que Cuida", "Acción que Daña"],
      [
        { label: "🌲 Plantar cortinas de árboles contra el viento", cat: 0 },
        { label: "🚯 Dejar bolsas de plástico en el campo", cat: 1 },
        { label: "💧 Apagar el fogón con abundante agua", cat: 0 },
        { label: "🔥 Dejar cenizas calientes con viento", cat: 1 },
        { label: "🚰 Cerrar canillas para no derrochar", cat: 0 },
        { label: "🛢️ Tirar aceite sucio a la tierra", cat: 1 },
      ],
      "Pista: cuidar significa proteger el agua, el pasto y la fauna.",
      ["s2-recursos-ambiente"]
    ),
    makeMultiPick(
      "s11-ex-1",
      "Tocá lo que debemos llevar a un día de campamento para cuidar la naturaleza",
      [
        ["🗑️", "Bolsas para traer de vuelta toda nuestra basura"],
        ["💧", "Botellas de agua reutilizables"],
        ["🧴", "Protector solar y sombrero para el sol patagónico"],
        ["🪓", "Un hacha para cortar ramas verdes de los árboles"],
      ],
      [0, 1, 2],
      "Pista: tres cosas ayudan a disfrutar sin romper los árboles ni ensuciar.",
      ["s2-recursos-ambiente"]
    ),
  ],

  // 12. Familias Diferentes, Familias Queridas
  12: [
    makeClassify(
      "s12-ex-0",
      "Clasificá las actitudes en la familia entre las que ayudan y las que perjudican la convivencia.",
      ["Ayuda a Convivir Mejor", "Dificulta la Convivencia"],
      [
        { label: "🤝 Ayudar a ordenar después de jugar", cat: 0 },
        { label: "😠 Gritar y no escuchar cuando nos hablan", cat: 1 },
        { label: "🍽️ Colaborar poniendo la mesa", cat: 0 },
        { label: "🚪 Dejar todo tirado para que otro lo junte", cat: 1 },
        { label: "🤗 Dar un abrazo y agradecer el cuidado", cat: 0 },
        { label: "👊 Pegar cuando estamos enojados", cat: 1 },
      ],
      "Pista: el respeto, la escucha y la ayuda mutua unen a la familia.",
      ["s2-familias-diversidad"]
    ),
    makeStoryPick(
      "s12-ex-1",
      {
        title: "Los ravioles de la nona",
        text: "Cada domingo, en la casa de Mateo se arma una fiesta. Su abuela amasa la pasta mientras su tío toca la guitarra y sus primos ayudan a poner los platos. 'Nuestra familia es ruidosa y grande, pero nos cuidamos entre todos', cuenta Mateo sonriendo.",
      },
      "¿Qué comparte la familia de Mateo los domingos?",
      [["🍝", "La comida casera, la música y el cariño de estar juntos"], ["✈️", "Un viaje en avión al espacio"], ["📺", "Cada uno solo mirando su celular sin hablar"]],
      0,
      "Pista: se reúnen alrededor de la mesa con la nona.",
      ["s2-familias-diversidad"]
    ),
  ],

  // 13. Los Primeros Habitantes: Aonikenk
  13: [
    makeClassify(
      "s13-ex-0",
      "Clasificá cada elemento según el pueblo originario al que corresponde.",
      ["Aonikenk (Tehuelches de la estepa)", "Vida Urbana Actual"],
      [
        { label: "🧥 Quillango de cuero de guanaco", cat: 0 },
        { label: "🧥 Campera de abrigo sintética", cat: 1 },
        { label: "🛖 Toldo desmontable de palos y pieles", cat: 0 },
        { label: "🏠 Casa de ladrillos y chapa", cat: 1 },
        { label: "🪨 Boleadoras de piedra y tiento", cat: 0 },
        { label: "🛒 Carrito para hacer compras", cat: 1 },
      ],
      "Pista: los Aonikenk usaban elementos naturales de la estepa y la fauna.",
      ["s2-pueblos-originarios"]
    ),
    makeOrder(
      "s13-ex-1",
      "Ordená cómo fabricaban los Aonikenk un quillango abrigado.",
      [
        "1. Cazar el guanaco y limpiar con cuidado su cuero",
        "2. Estirar y sobar el cuero con grasa para ablandarlo",
        "3. Coser los cueros con tendones y pintar la parte exterior",
      ],
      "Pista: primero se obtiene el cuero, luego se suaviza y al final se cose y pinta.",
      ["s2-pueblos-originarios"]
    ),
  ],

  // 14. Cazadores del Fuego: Selk'nam
  14: [
    makeStoryPick(
      "s14-ex-0",
      {
        title: "La pintura sagrada del Hain",
        text: "En los densos bosques fueguinos, los Selk'nam celebraban la ceremonia del Hain. Con arcilla blanca, carbón negro y tierra rojiza, los participantes pintaban líneas y puntos sobre sus cuerpos para representar espíritus ancestrales y transmitir las enseñanzas a los jóvenes.",
      },
      "¿Qué materiales usaban los Selk'nam para pintar sus cuerpos en el Hain?",
      [["🎨", "Arcilla blanca, carbón y tierra de color"], ["🖍️", "Marcadores de fibra"], ["🥫", "Pintura sintética con purpurina"]],
      0,
      "Pista: usaban tierras y minerales naturales de su entorno.",
      ["s2-pueblos-originarios"]
    ),
    makeClassify(
      "s14-ex-1",
      "Clasificá los elementos según su función en la vida Selk'nam.",
      ["Para Cazar y Comer", "Para Protegerse del Frío"],
      [
        { label: "🏹 Arco y flechas con punta de piedra", cat: 0 },
        { label: "🛖 Paravientos de ramas y cueros contra la nieve", cat: 1 },
        { label: "🦭 Grasa de lobo marino como alimento calórico", cat: 0 },
        { label: "🧥 Manto de piel de guanaco bien tupido", cat: 1 },
        { label: "🎯 Rastrear huellas de animales en el bosque", cat: 0 },
        { label: "🔥 Fuego permanente encendido con piedras", cat: 1 },
      ],
      "Pista: separá las armas y alimentos de los abrigos y refugios contra la nieve.",
      ["s2-pueblos-originarios"]
    ),
  ],

  // 15. Cocinar y Calentar: Cambios en el Hogar
  15: [
    makeClassify(
      "s15-ex-0",
      "Clasificá cada artefacto según si se usaba en el pasado o si se usa en el presente.",
      ["Artefacto del Pasado", "Artefacto del Presente"],
      [
        { label: "🕯️ Vela de cera para alumbrar de noche", cat: 0 },
        { label: "💡 Lámpara LED de bajo consumo", cat: 1 },
        { label: "🪵 Fogón a leña para hervir la pava", cat: 0 },
        { label: "⚡ Pava eléctrica que corta sola", cat: 1 },
        { label: "🥩 Secar carne con sal al aire", cat: 0 },
        { label: "🧊 Heladera con congelador automático", cat: 1 },
      ],
      "Pista: antes se usaba fuego directo y hoy energía eléctrica y gas.",
      ["s2-tecnologia-tiempo"]
    ),
    makeOrder(
      "s15-ex-1",
      "Ordená la evolución de la iluminación en el hogar a través del tiempo.",
      [
        "1. Fogata de leña en el centro de la choza",
        "2. Vela de sebo y lámpara de querosén con mecha",
        "3. Lámpara eléctrica al tocar un interruptor",
      ],
      "Pista: del fuego primitivo al querosén y finalmente a la electricidad.",
      ["s2-tecnologia-tiempo"]
    ),
  ],

  // 16. Cueva de las Manos y Huellas del Pasado
  16: [
    makeStoryPick(
      "s16-ex-0",
      {
        title: "La visita al cañadón",
        text: "Julieta caminó por la pasarela de madera del Parque Provincial Cueva de las Manos acompañada por la guardaparque Laura. Al llegar al gran alero de roca, vio cientos de manos pintadas en negativo de color rojo, blanco y ocre. 'Estas huellas tienen más de nueve mil años y debemos cuidarlas sin tocarlas', le explicó Laura.",
      },
      "¿Por qué Julieta y los visitantes caminan por una pasarela sin tocar las rocas?",
      [["🛡️", "Para proteger las pinturas milenarias y no dañarlas con las manos"], ["🏃", "Para correr una carrera rápida"], ["🧗", "Para escalar hasta la cima del cerro"]],
      0,
      "Pista: la grasa de los dedos y los roces pueden borrar las pinturas.",
      ["s2-patrimonio-huellas"]
    ),
    makeOrder(
      "s16-ex-1",
      "Ordená cómo pintaban el negativo de una mano los antiguos cazadores.",
      [
        "1. Moler minerales de color y mezclarlos con líquido",
        "2. Apoyar la mano firme sobre la pared de piedra",
        "3. Soplar la pintura con un tubito alrededor de los dedos",
      ],
      "Pista: preparar el color, apoyar la mano y soplar como un aerosol natural.",
      ["s2-patrimonio-huellas"]
    ),
  ],

  // 17. Instituciones de Nuestra Comunidad
  17: [
    makeClassify(
      "s17-ex-0",
      "Uní cada situación con la institución comunitaria que debe intervenir.",
      ["Hospital o Salita", "Bomberos o Policía"],
      [
        { label: "🤒 Un niño tiene fiebre muy alta de noche", cat: 0 },
        { label: "🚒 Hay humo y fuego en un pastizal del barrio", cat: 1 },
        { label: "🩹 Se necesita poner una vacuna obligatoria", cat: 0 },
        { label: "👮 Se perdió un perrito y hay que ordenar el tránsito", cat: 1 },
        { label: "🩺 Una persona necesita un control médico", cat: 0 },
        { label: "🚨 Rescate de una persona atrapada en un accidente", cat: 1 },
      ],
      "Pista: separá la atención de salud de la seguridad y el combate contra incendios.",
      ["s2-instituciones-normas"]
    ),
    makeMultiPick(
      "s17-ex-1",
      "Tocá las instituciones que trabajan para toda la comunidad en un pueblo santacruceño",
      [
        ["🏫", "Escuela provincial"],
        ["🏛️", "Municipalidad"],
        ["🚒", "Cuartel de bomberos voluntarios"],
        ["🏰", "Castillo de un príncipe"],
      ],
      [0, 1, 2],
      "Pista: tres instituciones existen y nos atienden todos los días.",
      ["s2-instituciones-normas"]
    ),
  ],

  // 18. Normas y Acuerdos de Convivencia
  18: [
    makeClassify(
      "s18-ex-0",
      "Clasificá las acciones según si construyen convivencia o generan conflictos.",
      ["Construye Paz y Convivencia", "Genera Conflicto"],
      [
        { label: "👂 Escuchar la opinión de los compañeros", cat: 0 },
        { label: "😠 Burlarse cuando alguien se equivoca", cat: 1 },
        { label: "🤝 Pedir disculpas de corazón si ofendimos", cat: 0 },
        { label: "👊 Empujar en la fila para ser primero", cat: 1 },
        { label: "✨ Decir 'por favor' y 'gracias'", cat: 0 },
        { label: "🗣️ Gritar e interrumpir a la maestra", cat: 1 },
      ],
      "Pista: lo que cuida al otro suma a la paz en el aula.",
      ["s2-instituciones-normas", "s2-efemerides"]
    ),
    makeOrder(
      "s18-ex-1",
      "Ordená los pasos para resolver un desacuerdo entre amigos sin pelear.",
      [
        "1. Respirar hondo y calmar el enojo",
        "2. Expresar lo que sentimos y escuchar al otro con respeto",
        "3. Llegar a un acuerdo que beneficie a los dos",
      ],
      "Pista: primero serenarse, luego dialogar y finalmente acordar una solución.",
      ["s2-instituciones-normas"]
    ),
  ],
};
