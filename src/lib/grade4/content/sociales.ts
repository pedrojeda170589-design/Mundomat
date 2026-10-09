// Banco de preguntas y actividades de Ciencias Sociales de 4.º grado (26 mundos).
// Cada mundo cuenta con 15 preguntas curriculares de opción equilibrada
// más actividades interactivas (clasificar, ordenar, verdadero/falso).
import type { ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import { fromBank, makeClassify, makeOrder, makeVF, numbered, pickOne, Q, q, shuffle } from "./util";

export const SOCIALES_BANK: Record<number, Q[]> = {
  // Mundo 1
  1: [
    q("¿En qué región de la República Argentina se ubica la provincia de Santa Cruz?", [["🌾","En la región patagónica austral"],["🌴","En el Noroeste argentino andino"],["🏜️","En la llanura pampeana central"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
    q("¿Qué provincia argentina limita hacia el norte con el territorio de Santa Cruz?", [["📍","La provincia del Chubut"],["📍","La provincia de La Pampa"],["📍","La provincia de Río Negro"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
    q("¿Qué país limita al oeste y al sur con Santa Cruz a través de los Andes?", [["🇨🇱","La República de Chile"],["🇧🇴","El Estado de Bolivia"],["🇺🇾","La República de Uruguay"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
    q("¿Qué mar baña toda la costa este de la provincia de Santa Cruz?", [["🌊","El Mar Argentino en el Atlántico Sur"],["🌊","El Océano Pacífico de aguas profundas"],["🌊","El Mar de Weddell de aguas antárticas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cuál es la ciudad capital de la provincia de Santa Cruz?", [["🏛️","La ciudad de Río Gallegos"],["🏔️","La villa turística de El Calafate"],["⚓","La ciudad portuaria de Puerto Deseado"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué paralelo geográfico marca el límite norte entre Santa Cruz y Chubut?", [["🌐","El Paralelo 46° Sur"],["🌐","El Trópico de Capricornio"],["🌐","La línea recta del Ecuador"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
    q("¿Qué paso marítimo se ubica al sur separando el continente de Tierra del Fuego?", [["⛵","El Estrecho de Magallanes"],["🚢","El Canal de Panamá artificial"],["🌊","El Canal de Suez del mar Rojo"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
    q("¿Por qué Santa Cruz se caracteriza por tener una muy baja densidad demográfica en el mapa?", [["🗺️","Gran territorio con pocos habitantes por km²"],["🏙️","Población que reside solo en meses de verano"],["🏔️","Inexistencia total de rutas de comunicación"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
    q("¿Hacia qué punto cardinal debemos desplazarnos en el mapa para viajar desde Santa Cruz a Buenos Aires?", [["🧭","En dirección hacia el norte"],["🧭","En dirección hacia el oeste"],["🧭","En dirección hacia el sur polar"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué archipiélago argentino en el Atlántico Sur integra la plataforma de la región patagónica?", [["🇦🇷","Las Islas Malvinas"],["🏝️","Las Islas Galápagos"],["🏝️","Las Islas Baleares"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
    q("¿Qué tipo de mapa representa las provincias, departamentos, límites y ciudades capitales?", [["🗺️","Un mapa político del territorio"],["📊","Un gráfico estadístico de barras"],["🖼️","Un dibujo ilustrativo de paisajes"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué tipo de mapa muestra las alturas del relieve, mesetas, cordillera y ríos?", [["🏔️","Un mapa físico con escala cromática"],["🏛️","Un plano urbano de líneas de colectivos"],["🚗","Una guía turística de comercios locales"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué provincia argentina se ubica cruzando el Estrecho de Magallanes hacia el sur?", [["❄️","Tierra del Fuego, Antártida e Islas del Atlántico Sur"],["🌾","La provincia cordillerana y petrolera del Neuquén"],["🏔️","La provincia andina vitivinícola de Mendoza"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
    q("¿Cuál es la principal ruta nacional que recorre la costa santacruceña de norte a sur?", [["🛣️","La Ruta Nacional 3 costera"],["🛣️","La Ruta Nacional 9 del centro"],["🛣️","La Ruta Provincial 1 de tierra"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué emblemática ruta nacional corre junto a la cordillera al oeste de Santa Cruz?", [["🛣️","La Ruta Nacional 40 andina"],["🛣️","La Ruta Nacional 2 bonaerense"],["🛣️","La Ruta Panamericana del norte"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
  ],

  // Mundo 2
  2: [
    q("¿En cuántos departamentos políticos se divide administrativamente la provincia de Santa Cruz?", [["🏛️","En 7 departamentos políticos"],["🏛️","En 15 departamentos políticos"],["🏛️","En 24 departamentos políticos"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿En qué departamento santacruceño se ubica la capital provincial, Río Gallegos?", [["📍","En el departamento Güer Aike"],["📍","En el departamento Deseado"],["📍","En el departamento Lago Argentino"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Cuál es la ciudad cabecera departamental del departamento Lago Argentino?", [["🏔️","La ciudad de El Calafate"],["🌾","La localidad de Gobernador Gregores"],["⚓","La ciudad de Puerto San Julián"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Cuál es la cabecera departamental del departamento Magallanes en la costa central?", [["⚓","La ciudad de Puerto San Julián"],["🚢","La ciudad de Puerto Deseado norte"],["⛽","La localidad norteña de Pico Truncado"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué ciudad costera es la cabecera departamental del departamento Deseado?", [["🌊","La ciudad de Puerto Deseado"],["🏔️","La villa andina de El Chaltén"],["🌾","La localidad de Perito Moreno"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Cuál es la ciudad cabecera del departamento Lago Buenos Aires en el noroeste provincial?", [["🍒","La ciudad de Perito Moreno"],["🏔️","La ciudad turística de El Calafate"],["🌾","La localidad de Gobernador Gregores"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Cuál es la localidad cabecera del departamento Río Chico en el centro santacruceño?", [["🌾","La localidad de Gobernador Gregores"],["⛽","La ciudad petrolera norteña de Las Heras"],["⚓","La ciudad histórica de Puerto Santa Cruz"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué histórica localidad costera es la cabecera del departamento Corpen Aike?", [["⚓","La localidad de Puerto Santa Cruz"],["🏛️","La capital provincial de Río Gallegos"],["🏔️","La localidad cordillerana de El Chaltén"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿En qué departamento santacruceño se encuentra la ciudad de Caleta Olivia?", [["⛽","En el departamento Deseado"],["📍","En el departamento Güer Aike"],["🏔️","En el departamento Lago Argentino"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué departamento alberga a la localidad cordillerana de El Chaltén?", [["🏔️","El departamento Lago Argentino"],["🌾","El departamento central de Río Chico"],["⚓","El departamento costero de Magallanes"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué ciudad minera del departamento Güer Aike extrae carbón mineral de la cuenca?", [["⛏️","La ciudad de Río Turbio"],["🍒","La localidad de Los Antiguos"],["⚓","La ciudad de Puerto Deseado"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué localidad junto al gran lago en el departamento Lago Buenos Aires es Capital Nacional de la Cereza?", [["🍒","La localidad de Los Antiguos"],["🌾","La localidad de Gobernador Gregores"],["⚓","La localidad de Puerto San Julián"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Por qué cada departamento de la provincia cuenta con una ciudad cabecera?", [["🏛️","Para organizar trámites, juzgados y servicios públicos"],["🎪","Para planificar eventos de espectáculos recreativos"],["🏟️","Para concentrar únicamente las actividades deportivas"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Cuál es el departamento con mayor cantidad de habitantes de Santa Cruz según el censo 2022?", [["👥","El departamento Güer Aike"],["🌾","El departamento de Río Chico"],["⚓","El departamento de Corpen Aike"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿En qué localidad del departamento Corpen Aike se ubica la histórica isla Pavón sobre el río?", [["🏝️","Comandante Luis Piedra Buena"],["⚓","La ciudad costera de Puerto Deseado"],["⛽","La localidad petrolera de Las Heras"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
  ],

  // Mundo 3
  3: [
    q("¿Qué distingue principalmente a un espacio urbano de uno rural en Santa Cruz?", [["🏙️","Concentración de viviendas, comercios y servicios"],["🌾","Campos extensos de producción agrícola ganadera"],["🐴","Uso generalizado de caballos para todo traslado"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cuál es la principal actividad laboral tradicional en los espacios rurales de la meseta santacruceña?", [["🐑","La ganadería ovina en estancias"],["🏭","La industria metalúrgica pesada"],["🍌","El cultivo comercial de caña de azúcar"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Qué rol cumple la estancia patagónica en la organización del espacio rural?", [["🏡","Centro productivo, vivienda y trabajo del campo"],["🏢","Edificio para oficinas de trámites bancarios"],["🚂","Estación ferroviaria para trenes de pasajeros"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué trabajadores se trasladan temporalmente por las estancias para la zafra de esquila?", [["✂️","Las comparsas de esquiladores y peones"],["👨‍🏫","Grupos de actores para obras teatrales"],["⚓","Tripulantes de buques de navegación ultramarina"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué servicio esencial comunica tradicionalmente a los puesteros rurales con sus familias?", [["📻","Mensajes emitidos por emisoras de radio AM"],["📫","Envío de recados mediante palomas mensajeras"],["🚲","Mensajeros que viajan en bicicletas de campo"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cuál es la función primordial de ciudades portuarias como Puerto Deseado o Punta Quilla?", [["🚢","Exportar producción pesquera, minera y lanera"],["🏖️","Uso exclusivo para balnearios de descanso estival"],["🌾","Almacenar cosechas de cereales de la pampa húmeda"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué actividad económica terciaria dinamiza centros urbanos como El Calafate y El Chaltén?", [["🏨","Turismo de naturaleza, hotelería y gastronomía"],["🚜","Cultivo a gran escala de plantaciones de arroz"],["🏭","Fabricación de aparatos de telefonía celular"]], 0, "Pista: pensá en las tareas productivas y laborales que se desarrollan allí."),
    q("¿De qué material es la escultura del Monumento al Obrero Petrolero 'El Gorosito' en Caleta Olivia?", [["⛽","Es una imponente escultura de hormigón armado"],["🗿","Es una figura tallada enteramente en mármol blanco"],["🪵","Es una estructura armada en madera de lenga"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo obtienen energía eléctrica los puestos rurales alejados del tendido de red?", [["☀️","Paneles solares, molinos de viento o generadores"],["🔌","Cables de alta tensión tendidos sobre la meseta"],["🕯️","Exclusivamente con fogatas de leña de monte"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué institución garantiza la escolaridad de niños que habitan en campos lejanos?", [["🏫","Escuelas rurales con sistema de albergue escolar"],["🎓","Facultades universitarias con cursada presencial"],["🏢","Oficinas del juzgado de paz departamental"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué medio de movilidad utilizan frecuentemente los pobladores rurales para viajar al pueblo?", [["🛻","Camionetas con tracción en las cuatro ruedas"],["🛶","Canoas de madera navegando arroyos de deshielo"],["✈️","Vuelos regulares de aviones comerciales locales"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Por qué el invierno patagónico exige aprovisionarse con anticipación en el ámbito rural?", [["❄️","Las nevadas y heladas pueden bloquear caminos"],["☀️","El calor estropea rápidamente las provisiones"],["🌪️","Las lluvias torrenciales inundan toda la meseta"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
    q("¿Qué ciudad santacruceña es el nodo vial y logístico clave para viajar hacia Tierra del Fuego?", [["🚛","La ciudad capital de Río Gallegos"],["🏔️","La villa cordillerana de El Chaltén"],["🍒","La localidad noroeste de Los Antiguos"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué producción frutícola intensiva se desarrolla en las chacras rurales de Los Antiguos?", [["🍒","Cerezas finas y frutas para dulces artesanales"],["🍊","Plantaciones de cítricos como naranjas y limones"],["🍇","Uvas de viñedos destinadas a pasas de uva"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se denomina la tarea rural de arrear y reunir las ovejas dispersas en los campos?", [["🐎","Arreo a caballo con ayuda de perros ovejeros"],["🎣","Pesca artesanal con embarcaciones de arrastre"],["🌾","Cosecha con maquinaria agrícola combinada"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
  ],

  // Mundo 4
  4: [
    q("¿Qué sistema montañoso se extiende a lo largo del oeste de la provincia de Santa Cruz?", [["🏔️","La Cordillera de los Andes austral"],["🌾","El cordón serrano de Sierras Pampeanas"],["🏜️","Las serranías de la meseta misionera"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Cómo es la forma del relieve dominante en la meseta central santacruceña?", [["🌾","Mesetas escalonadas que descienden al este"],["🌴","Llanura selvática con lagunas inundables"],["🏖️","Dunas de arena cálida de relieve bajo"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Qué geoforma costera domina gran parte del litoral marítimo provincial?", [["🌊","Acantilados rocosos y playas de canto rodado"],["🌴","Playas de arenas finas y dunas bajas"],["🏖️","Playas de finas arenas coralinas blancas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llaman las hendiduras profundas de paredes escarpadas que cortan las mesetas?", [["🏞️","Los cañadones patagónicos"],["⛰️","Valles fluviales secos entre las bardas"],["🏜️","Los oasis de desiertos cálidos"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Qué cumbre montañosa escarpada cerca de El Chaltén es famosa entre escaladores mundiales?", [["🏔️","El cerro Fitz Roy (Chaltén)"],["🏔️","El cerro Aconcagua mendocino"],["🏔️","El volcán Lanín neuquino"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Qué depresión geográfica santacruceña constituye el punto más bajo de toda América?", [["📉","El Gran Bajo de San Julián (-105 metros)"],["📉","El Cañón del Colorado estadounidense"],["📉","La fosa oceánica de las Marianas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué tipo de roca pulida y redondeada por el agua abunda en costas y mesetas?", [["🪨","El canto rodado patagónico"],["🧱","Bloques de adobe secados al sol"],["💎","Cristales de yeso facetados"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Cómo se llama la entrada marina profunda donde el mar penetra en el valle fluvial?", [["🌊","Una ría marina profunda"],["🏝️","Un archipiélago coralino"],["💧","Una vertiente de manantial"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Por qué las mesetas patagónicas reciben el nombre de 'escalonadas'?", [["🪜","Descienden en niveles o terrazas hacia el océano"],["📐","Fueron construidas con escaleras artificiales"],["〰️","Porque están surcadas por canales de cemento"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Cuál es la montaña más alta de la provincia de Santa Cruz, con 3.706 metros sobre el nivel del mar?", [["🏔️","El Cerro San Lorenzo"],["🏔️","El cerro Fitz Roy (Chaltén)"],["⛰️","El volcán Lanín neuquino"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Qué plataforma rocosa litoral queda expuesta cuando baja la marea en la costa?", [["🦀","La restinga costera rocosa"],["🌴","La llanura de espinillo"],["🏝️","La barrera de coral cálido"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué parque marino santacruceño frente a Puerto Deseado protege pingüinos de penacho amarillo?", [["🐧","El Parque Interjurisdiccional Marino Isla Pingüino"],["🌴","El Parque Nacional Iguazú selvático en la provincia de Misiones"],["🌵","El Parque Nacional Talampaya riojano en la zona cordillerana"]], 0, "Pista: pensá en las áreas protegidas marinas de la costa santacruceña."),
    q("¿Qué tipo de paredones rocosos con cuevas y aleros alberga las pinturas rupestres ancestrales?", [["🎨","Los paredones del Cañadón del Río Pinturas"],["🌾","Médanos arenosos móviles sin reparo"],["🏖️","Playas llanas sin ninguna elevación"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué nombre reciben las mesetas con cima plana y bordes abruptos cubiertas de roca volcánica?", [["🌋","Mesetas basálticas o bardas"],["❄️","Campos de nieve perpetua"],["🏖️","Dunas costeras de playa"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Qué resguardo natural ofrecen los valles cordilleranos para el cultivo de frutales?", [["🛡️","Laderas montañosas que frenan los vientos fuertes"],["🏢","Muros cortavientos de hormigón en chacras"],["🌲","Hileras de álamos protectores en las chacras"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
  ],

  // Mundo 5
  5: [
    q("¿Hacia qué océano desaguan los principales ríos que nacen en los Andes y cruzan Santa Cruz?", [["🌊","Hacia el Océano Atlántico (Mar Argentino)"],["🌊","Hacia el Océano Pacífico cruzando valles"],["🌊","Hacia cuencas cerradas del norte del país"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Cuál es el río más caudaloso de la provincia, que nace en los grandes lagos cordilleranos?", [["💧","El Río Santa Cruz"],["💧","El Río Bermejo de la cuenca del norte"],["💧","El Río Salado de la llanura pampeana"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué río del norte santacruceño desemboca en una ría marina y da nombre a una ciudad portuaria?", [["🌊","El Río Deseado"],["🌊","El Río Colorado en el límite norte patagónico"],["🌊","El Río Dulce de la región centrochaqueña"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Cuál es el lago más extenso enteramente ubicado dentro del territorio de la República Argentina?", [["🏔️","El Lago Argentino"],["🏔️","El Lago Nahuel Huapi"],["🏔️","El Lago Lácar"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
    q("¿Qué glaciar imponente desciende del campo de hielo y alimenta las aguas del Lago Viedma?", [["❄️","El Glaciar Viedma"],["❄️","El Glaciar Martial"],["❄️","El Glaciar Alerce"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué gran lago cordillerano de brazos alargados comparte Santa Cruz con Chile, donde se llama lago O'Higgins?", [["🇨🇱","El Lago San Martín"],["🇨🇱","El Lago Argentino"],["🇨🇱","El Lago Nahuel Huapi"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué lago santacruceño de cuenca endorreica cerrada se encuentra en el centro de la meseta?", [["🐟","El Lago Cardiel"],["🐟","El Lago Puelo"],["🐟","El Lago Epuyén"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué gran lago compartido al norte de Santa Cruz baña las costas de la localidad de Los Antiguos?", [["🍒","El Lago Buenos Aires"],["🍒","El Lago Traful"],["🍒","El Lago Hermoso"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué importante complejo hidroeléctrico se construye en Santa Cruz para generar energía limpia aprovechando el río más caudaloso?", [["⚡","Las obras de Cóndor Cliff y La Barrancosa sobre el río Santa Cruz"],["⚡","La central de El Chocón sobre el río Limay"],["⚡","La central binacional de Salto Grande sobre el río Uruguay"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué río del centro provincial baña los valles agrícolas de Gobernador Gregores?", [["🌾","El Río Chico de Santa Cruz"],["🌾","El Río Paraná"],["🌾","El Río Gualeguay"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Cuál es el origen geológico de los grandes lagos andinos como el Argentino, Viedma y San Martín?", [["❄️","Excavados por antiguos glaciares durante las eras de hielo"],["🌋","Cráteres de volcanes submarinos que se llenaron con lluvia"],["🏖️","Depresiones artificiales creadas por mineros"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Por qué el agua de lagos como el Argentino y Viedma suele tener una tonalidad turquesa lechosa?", [["💎","Por la suspensión de finos sedimentos o harina de roca glaciaria"],["🧪","Porque se añaden colorantes químicos para excursiones de turistas"],["🧂","Por la presencia masiva de sal marina traída por gaviotas"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué río del extremo sur santacruceño desemboca en una amplia ría sobre cuyas orillas se levanta la capital provincial?", [["💧","El Río Gallegos"],["💧","El Río Deseado"],["💧","El Río Chico"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Cómo se llama el sector donde se unen las aguas dulces de los ríos con el agua salada marina?", [["🌊","Estuario o desembocadura en ría"],["🏔️","Ventisquero de nieve eterna"],["🌾","Potrero de pastoreo"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿De qué fuente principal se nutren los ríos santacruceños durante los meses cálidos de primavera y verano?", [["☀️","Del deshielo de nieves y glaciares cordilleranos"],["🌧️","De lluvias tropicales torrenciales en la meseta"],["🌊","Del agua marina bombeada desde la costa este"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
  ],

  // Mundo 6
  6: [
    q("¿Cuáles son las dos características climáticas fundamentales de la meseta santacruceña?", [["💨","Temperaturas frías y escasas precipitaciones (clima árido)"],["🌧️","Calor sofocante y lluvias abundantes todo el año"],["🌴","Clima templado húmedo con brisas suaves"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿De qué cuadrante provienen los vientos predominantes e intensos que soplan en la provincia?", [["🧭","Desde el oeste, cruzando la cordillera"],["🧭","Exclusivamente desde el este marítimo"],["🧭","Desde el cuadrante este oceánico"]], 0, "Pista: pensá en las condiciones del tiempo y del ambiente en esta época."),
    q("¿Cuántas precipitaciones anuales caen en promedio en la mayor parte de la estepa santacruceña?", [["💧","Menos de 300 mm anuales"],["💧","Más de dos mil milímetros de lluvia continua"],["💧","Cero precipitaciones durante décadas enteras"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Por qué el aire llega seco a la meseta después de cruzar la Cordillera de los Andes?", [["🏔️","Las montañas descargan la humedad en el lado oeste"],["☀️","Porque los volcanes calientan el aire secándolo"],["🌲","Porque los árboles andinos absorben todo el viento"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Cómo se llama la gran diferencia de temperatura que se produce entre el día y la noche en la estepa?", [["🌡️","Amplitud térmica diaria"],["🌪️","Presión barométrica baja"],["🌧️","Humedad relativa ambiente"]], 0, "Pista: pensá en las condiciones del tiempo y del ambiente en esta época."),
    q("¿Qué efecto produce el viento constante sobre la escasa humedad del suelo santacruceño?", [["💨","Acelera la evaporación secando aún más la tierra"],["💧","Aumenta el agua acumulada en charcos de campo"],["🌱","Genera abono fértil de forma espontánea"]], 0, "Pista: pensá en las condiciones del tiempo y del ambiente en esta época."),
    q("¿En qué época del año se registran los vientos más intensos y regulares en Santa Cruz?", [["🍃","Durante la primavera y el verano"],["❄️","Exclusivamente en los meses de pleno invierno"],["🍂","Únicamente durante los temporales de mayo"]], 0, "Pista: pensá en las condiciones del tiempo y del ambiente en esta época."),
    q("¿Cómo influye el cielo despejado de la meseta en las temperaturas nocturnas?", [["🌌","El calor diurno se escapa rápido hacia el espacio"],["☀️","Mantiene el suelo caliente como si fuera mediodía"],["☁️","Forma una capa de nubes calientes que abriga"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿En qué zona de Santa Cruz caen abundantes nevadas y lluvias superiores a los 800 mm anuales?", [["🌲","En el bosque cordillerano andino del oeste"],["🌾","En el centro llano de la meseta"],["🏖️","En las costas áridas del golfo San Jorge"]], 0, "Pista: pensá en las condiciones del tiempo y del ambiente en esta época."),
    q("¿Qué fenómeno invernal se produce cuando la temperatura baja de 0 °C congelando el vapor sobre las plantas?", [["❄️","La helada o escarcha matinal"],["🌪️","El golpe de calor húmedo"],["🌧️","La lluvia cálida de verano"]], 0, "Pista: pensá en las condiciones del tiempo y del ambiente en esta época."),
    q("¿Qué instrumento meteorológico mide la velocidad del viento patagónico en kilómetros por hora?", [["💨","El anemómetro"],["🌡️","El termómetro de mercurio"],["🧭","La brújula de orientación"]], 0, "Pista: pensá en las condiciones del tiempo y del ambiente en esta época."),
    q("¿Por qué las casas santacruceñas suelen orientarse resguardando sus entradas principales?", [["🏠","Para protegerse de las ráfagas heladas del viento del oeste"],["🎨","Para que combinen con el color de las montañas y asegurar el cumplimiento de las leyes"],["🚗","Para facilitar la salida de camiones pesados"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
    q("¿Qué tipo de ropa utilizan tradicionalmente los habitantes para protegerse del clima árido y ventoso?", [["🧥","Prendas de lana que cortan el viento y abrigan"],["🩳","Trajes de baño ligeros de tela fina"],["🥻","Prendas de seda sin mangas ni abrigo"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Cómo influye el mar en las temperaturas de las ciudades costeras como Puerto Deseado o San Julián?", [["🌊","Modera las temperaturas extremas haciendo el invierno menos severo"],["🔥","Calienta la costa a temperaturas de más de cuarenta grados"],["❄️","Hace que caigan metros de nieve todos los días"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué vegetación sobrevive en la meseta bajo este clima frío y con lluvias menores a 300 mm?", [["🌾","Arbustos en cojín achaparrados y matas de coirón"],["🌴","Pastizales verdes de gramíneas y tréboles"],["🌲","Bosques altos de coníferas siempreverdes"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
  ],

  // Mundo 7
  7: [
    q("¿Qué fenómeno invernal extraordinario puede cubrir los campos de nieve y aislar parajes en Santa Cruz?", [["❄️","Las grandes nevadas extraordinarias"],["🌊","Maremotos que inundan la meseta central"],["🌴","Olas de calor sofocante en pleno invierno"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llama el peligroso temporal patagónico donde el viento fuerte levanta nieve congelada anulando la visión?", [["💨","El viento blanco"],["☀️","La ola de calor seco"],["🌧️","La bruma marina con viento calmo"]], 0, "Pista: pensá en las condiciones del tiempo y del ambiente en esta época."),
    q("¿Qué volcán cordillerano chileno erupcionó en 1991 esparciendo cenizas sobre pueblos santacruceños?", [["🌋","El volcán Hudson"],["🏔️","El volcán Vesubio"],["🗻","El volcán Krakatoa"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué grave daño provocó la caída de ceniza volcánica en las ovejas de la meseta?", [["🐑","Desgastó su dentadura e impidió pastar"],["🐑","Aceleró el crecimiento de su vellón"],["🐑","Provocó que cambiaran el color de su lana"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Qué elemento es obligatorio colocar en las ruedas de vehículos para transitar caminos con hielo y nieve?", [["⛓️","Cadenas para nieve en los neumáticos"],["🎈","Flotadores plásticos laterales"],["🛞","Cubiertas lisas de carreras"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué daño pueden provocar las heladas tardías en las chacras de fruta de Los Antiguos?", [["🍒","Queman las flores y brotes tiernos"],["🍒","Aceleran la maduración de los frutos"],["🍒","Hacen crecer los árboles al doble"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Qué método utilizan los productores de chacra para combatir las heladas nocturnas?", [["🔥","Riego por aspersión y quemadores de calor"],["❄️","Ventiladores gigantes de aire frío"],["⛱️","Sombrillas de tela sobre los árboles"]], 0, "Pista: pensá en las tareas productivas y laborales que se desarrollan allí."),
    q("¿Qué institución coordina el despeje de nieve en rutas y auxilio a pobladores aislados?", [["🚜","Vialidad y Defensa Civil provincial"],["🚢","La Prefectura Naval en los ríos"],["✈️","Líneas aéreas comerciales"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Por qué los puesteros rurales deben juntar leña, gas y alimentos secos antes del invierno?", [["🏠","Porque pueden quedar aislados por semanas"],["☀️","Para no tener que salir a pasear en verano"],["🎉","Para organizar festejos barriales"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
    q("¿Qué elemento de protección respiratoria se recomendaba utilizar durante la lluvia de ceniza volcánica?", [["😷","Barbijos o pañuelos húmedos"],["🕶️","Gafas de sol para playa"],["🧤","Guantes de lana tejidos"]], 0, "Pista: pensá en las condiciones del tiempo y del ambiente en esta época."),
    q("¿Qué precaución deben tomar los conductores al viajar con presencia de escarcha sobre la ruta?", [["🚗","Bajar la velocidad y no frenar bruscamente"],["🏎️","Acelerar a fondo para salir rápido en las"],["🛑","Detenerse sobre el medio de la curva"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué sucede con las fuentes de agua y cañerías en las viviendas durante heladas extremas bajo cero?", [["🚰","El agua se congela y puede reventar caños"],["🔥","El agua sale hirviendo espontáneamente"],["💨","El agua se transforma en vapor caliente"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué tipo de alimentos se envía a las ovejas atrapadas en cuadros con nieve muy profunda?", [["🌾","Fardos de pasto y suplementos forrajeros"],["🥩","Cortes de carne vacuna cocida"],["🍞","Pan fresco del día"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se comunican las estancias aisladas con los centros urbanos cuando no hay telefonía celular?", [["📻","Mediante equipos de radio BLU y avisos de AM"],["📮","Enviando cartas por correo tradicional"],["🚲","Con ciclistas que cruzan la nieve según las investigaciones históricas y geográficas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Por qué el deshielo rápido tras una gran nevada puede generar un nuevo riesgo en los valles?", [["🌊","Crecidas e inundaciones en ríos y cañadones"],["☀️","Sequía inmediata de todas las vertientes"],["🌋","Nuevas erupciones de volcanes antiguos"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
  ],

  // Mundo 8
  8: [
    q("¿Qué famoso parque nacional santacruceño fue declarado Patrimonio de la Humanidad por la UNESCO?", [["🏔️","El Parque Nacional Los Glaciares"],["🌴","El Parque Nacional Iguazú en Misiones"],["🌵","El Parque Nacional El Palmar en Entre Ríos"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Qué parque nacional santacruceño protege imponentes acantilados y colonias marinas sobre la costa atlántica?", [["🐧","El Parque Nacional Monte León"],["🌴","El Parque Nacional Calilegua jujeño"],["🌾","El Parque Nacional Chaco húmedo"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Qué parque nacional en el centro norte protege gigantescos troncos de araucarias fosilizadas de 150 millones de años?", [["🌲","El Parque Nacional Bosques Petrificados de Jaramillo"],["🌴","El Parque Nacional Baritú selvático"],["🏔️","El Parque Nacional Lanín cordillerano"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Qué ciervo andino en peligro de extinción es Monumento Natural Nacional en Argentina y figura en el escudo de Chile?", [["🦌","El ciervo huemul"],["🦌","El ciervo de los pantanos"],["🦌","El alce gigante del norte"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué parque nacional cordillerano poco transitado se ubica al pie de los cerros San Lorenzo y Belgrano?", [["🏔️","El Parque Nacional Perito Moreno"],["🌴","El Parque Nacional Río Pilcomayo"],["🌵","El Parque Nacional Sierra de las Quijadas"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
    q("¿Qué parque nacional en la meseta del lago Buenos Aires protege al amenazado macá tobiano?", [["🦆","El Parque Nacional Patagonia"],["🌴","El Parque Nacional Iguazú"],["🌊","El Parque Nacional Tierra del Fuego"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué sitio arqueológico Patrimonio de la Humanidad exhibe milenarias pinturas rupestres en un cañadón santacruceño?", [["🖐️","La Cueva de las Manos"],["🏛️","Las Ruinas de San Ignacio Miní"],["🗿","Los Menhires tucumanos"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué cetáceo gigante protegido visita las aguas del golfo San Jorge y la costa patagónica para reproducirse?", [["🐋","La ballena franca austral"],["🐬","El delfín rosado de río"],["🦈","El tiburón espinoso de aguas profundas"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué personal profesional cuida y controla las áreas protegidas y educa a los visitantes?", [["🤠","Los guardaparques nacionales"],["👮","Los inspectores de aduanas"],["👨‍🍳","Los cocineros de campamento"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Por qué está terminantemente prohibido hacer fuego en zonas no habilitadas dentro de un parque nacional?", [["🔥","Para evitar incendios forestales destructivos"],["💨","Porque el humo asusta a las nubes de lluvia"],["☀️","Para que no suba la temperatura ambiente"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Cuál es la regla de oro ambiental que debe seguir todo visitante respecto a sus residuos en un parque?", [["🚯","Regresar con toda su basura sin dejar rastros"],["🗑️","Tirar los envoltorios en arbustos lejanos"],["🔥","Quemarla inmediatamente en el sendero"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Qué especie marina anida en grandes cuevas de tierra en la costa de Monte León?", [["🐧","El pingüino de Magallanes"],["🦆","El pato criollo de granja"],["🦩","El flamenco de las lagunas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué árbol nativo de hojas caducas forma extensos bosques protegidos en Los Glaciares?", [["🍂","La lenga"],["🌲","El eucalipto"],["🌴","La palmera"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Por qué es crucial no introducir mascotas como perros o gatos en las áreas protegidas?", [["🐕","Pueden cazar fauna nativa o transmitirles enfermedades"],["🦁","Porque los guanacos los atacan en manada"],["🌾","Porque se comen el pasto coirón debido a las distancias geográficas y al clima"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Qué Monumento Natural Provincial nada en las rías santacruceñas y es blanco y negro?", [["🐬","La tonina overa"],["🐋","La orca de mar abierto"],["🦈","El pez espada austral"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
  ],

  // Mundo 9
  9: [
    q("¿Qué animal constituye la base histórica tradicional de la ganadería en la meseta santacruceña?", [["🐑","El ganado ovino (las ovejas)"],["🐄","El ganado vacuno lechero"],["🐖","El cerdo de criadero intensivo"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Qué producto textil principal se obtiene de las ovejas para su comercialización y exportación?", [["🧶","La lana natural de sus vellones"],["🧵","Hilos sintéticos de poliéster"],["🌾","Semillas secas de pastura"]], 0, "Pista: pensá en las tareas productivas y laborales que se desarrollan allí."),
    q("¿Cómo se llama el proceso de cortar el vellón de lana a las ovejas en la estancia?", [["✂️","La esquila"],["🌾","La cosecha"],["🚜","El desmalezado"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se denomina al equipo de trabajadores rurales especializados que viaja de estancia en estancia esquilando?", [["👥","La comparsa de esquila"],["🎭","El elenco de teatro itinerante"],["⚽","El plantel de árbitros deportivos"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué edificio de la estancia está acondicionado especialmente para realizar la esquila?", [["🏭","El galpón de esquila"],["🏡","La casa principal de la familia"],["🌾","El molino de viento de aguada"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llama el paquete grande y compacto de lana prensada listo para su transporte en camión?", [["📦","El fardo de lana"],["🥫","El cajón de madera frutal"],["🛍️","La bolsa de papel sellada"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué raza ovina se destaca por la excelente finura y suavidad de su lana blanca?", [["🐑","La raza Merino australiano"],["🐂","El ganado cebú"],["🐴","El caballo criollo"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué tarea realiza el 'agarrador' durante la jornada de esquila en el galpón?", [["🚪","Sujeta la oveja del brete y la lleva al esquilador"],["🍳","Cocina las viandas del mediodía"],["🚛","Maneja el camión de carga en la ruta"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llama la división del campo en grandes parcelas alambradas en una estancia ganadera?", [["🔲","Los cuadros o potreros de campo"],["🏢","Las manzanas de un plano urbano"],["🛣️","Las veredas peatonales"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué animal es el fiel aliado del peón rural para rodear y guiar las ovejas en el arreo?", [["🐕","El perro ovejero adiestrado"],["🐱","El gato doméstico"],["🦅","El halcón peregrino"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué producto cárnico tradicional de la gastronomía patagónica proviene de los ovinos?", [["🥩","El cordero patagónico asado"],["🍣","El pescado de río enlatado"],["🍗","La pechuga de pollo de granja"]], 0, "Pista: pensá en las tareas productivas y laborales que se desarrollan allí."),
    q("¿Por qué es fundamental no sobrecargar los cuadros con más ovejas de las que el pasto puede alimentar?", [["🌱","Para evitar el sobrepastoreo y la desertificación del suelo"],["💰","Porque cobran impuestos adicionales por cada animal"],["🐑","Para que las ovejas no compitan por sombra durante el verano"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
    q("¿En qué época del año se lleva a cabo la zafra de esquila en la provincia de Santa Cruz?", [["🗓️","En primavera y comienzos del verano"],["❄️","En pleno invierno con temperaturas bajo cero"],["🍂","A fines del otoño en mayo"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Hacia qué lugares se transportan los fardos de lana desde las estancias santacruceñas?", [["🚢","Hacia barracas de acopio y puertos de exportación"],["🏖️","Directo a las playas turísticas costeras"],["🛒","A talleres textiles y lavaderos industriales"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llama la vivienda aislada donde habita el peón rural vigilando un sector del campo?", [["🏠","El puesto de estancia"],["🏰","El castillo de piedra"],["🏨","El hotel de descanso"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
  ],

  // Mundo 10
  10: [
    q("¿Qué dos recursos energéticos de origen fósil se extraen masivamente del subsuelo santacruceño?", [["⛽","El petróleo crudo y el gas natural"],["🪵","La madera de lenga y el carbón vegetal"],["🌾","El biocombustible obtenido de la soja"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué importante cuenca petrolera comparte el norte de Santa Cruz con la provincia del Chubut?", [["🌊","La Cuenca del Golfo San Jorge"],["🏔️","La Cuenca Neuquina cordillerana"],["🌾","La Cuenca del Noroeste argentino"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué cuenca productora de hidrocarburos se localiza en el extremo sur provincial y en aguas marinas?", [["📍","La Cuenca Austral"],["🌾","La Cuenca Cuyana"],["🏔️","La Cuenca del Paraná fluvial"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué localidad cordillerana santacruceña es la capital histórica de la extracción de carbón mineral?", [["⛏️","La ciudad de Río Turbio"],["🍒","La localidad de Los Antiguos"],["⚓","La ciudad de Puerto San Julián"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué metales preciosos se extraen en yacimientos del Macizo del Deseado como Cerro Vanguardia?", [["🥇","El oro y la plata"],["🔩","El hierro y el aluminio"],["🪙","El bronce y el estaño"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Cómo se llaman las estructuras mecánicas con balancín que bombean petróleo en los pozos del norte provincial?", [["🛢️","Aparatos de bombeo ('cigüeñas' o balancines)"],["🚜","Tractores agrícolas con arado de reja"],["🚂","Locomotoras de carga ferroviaria pesada"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿A través de qué grandes cañerías subterráneas viaja el gas natural santacruceño hacia Buenos Aires?", [["🔧","A través de gasoductos troncales como el San Martín"],["🚛","En camiones cisterna que transitan por la Ruta 3"],["🚂","En vagones tanque sellados del ferrocarril"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué puerto de aguas profundas al sur de Caleta Olivia fue construido para la actividad pesquera y petrolera?", [["⚓","El puerto de Caleta Paula"],["⚓","El puerto de Bahía Blanca"],["🚢","El puerto fluvial de San Lorenzo"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Por qué el carbón mineral de Río Turbio tuvo un papel estratégico en el desarrollo nacional?", [["🚂","Abastecía de combustible a ferrocarriles y usinas eléctricas"],["🚗","Servía como combustible directo para motores de automóviles"],["🏭","Se utilizaba como materia prima para fabricar plásticos sintéticos"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué fuente de energía limpia se aprovecha en los parques cercanos a Jaramillo y Pico Truncado mediante aerogeneradores?", [["💨","La energía eólica del viento"],["☀️","La energía solar térmica"],["☢️","La energía nuclear de reactores"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Qué elementos de protección personal son obligatorios para ingresar a una instalación petrolera o minera?", [["👷","Casco de seguridad, botines con puntera y mameluco ignífugo"],["🎩","Guardapolvo escolar blanco con calzado ligero de lona"],["🩳","Trajes livianos de tela deportiva fina"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué mineral no metalífero común de uso doméstico se explota en salinas y lagunas secas santacruceñas?", [["🧂","La sal común de cocina (cloruro de sodio)"],["💎","El diamante en bruto extraído de minas"],["🪨","El mármol decorativo"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué empresa petrolera estatal argentina impulsó históricamente el descubrimiento y producción de crudo?", [["🇦🇷","YPF (Yacimientos Petrolíferos Fiscales)"],["✈️","Aerolíneas Argentinas de transporte"],["🚂","Ferrocarriles Argentinos del Estado"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Por qué los hidrocarburos fósiles como el petróleo y el gas se clasifican como recursos 'no renovables'?", [["⏳","Porque tardan millones de años en formarse y sus reservas se agotan"],["🌧️","Porque se recargan cada vez que caen lluvias torrenciales"],["🌱","Porque se cosechan anualmente de plantas sembradas"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
    q("¿Cómo se denominan los gigantescos buques de carga diseñados para transportar petróleo por el mar?", [["🚢","Buques petroleros (o buques tanque)"],["⛵","Embarcaciones a vela de paseo"],["🛶","Canoas costeras tradicionales"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
  ],

  // Mundo 11
  11: [
    q("¿Qué localidad santacruceña es reconocida formalmente como Capital Nacional del Trekking?", [["🥾","La localidad de El Chaltén"],["🍒","La localidad de Los Antiguos"],["⚓","La ciudad de Puerto Santa Cruz"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Cuál es el principal atractivo natural que convoca a turistas de todo el mundo hacia El Calafate?", [["❄️","El Glaciar Perito Moreno y el campo de hielo"],["🌴","Balnearios de aguas termales cordilleranas"],["🏜️","Grandes dunas desérticas móviles de arena"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué especie marina comercial de alto valor pesquero se captura y congela en Puerto Deseado?", [["🦑","El calamar y el langostino patagónico"],["🐡","El pez globo de aguas cálidas"],["🐟","La trucha arcoíris de criadero de laguna"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cuáles de estas actividades pertenecen al sector terciario de la economía provincial?", [["🏨","Los servicios de hotelería, gastronomía y transporte"],["🌾","La siembra y cosecha de pastos para forraje"],["⛏️","La extracción de minerales en yacimientos"]], 0, "Pista: pensá en las tareas productivas y laborales que se desarrollan allí."),
    q("¿Qué mamífero marino saltarín de manchas blancas y negras puede observarse navegando la Ría Deseado?", [["🐬","El delfín costero tonina overa"],["🐋","La orca de mar abierto profundo"],["🦭","La foca marina del polo ártico"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué desafiante actividad deportiva atrae a montañistas experimentados a los cerros Fitz Roy y Torre?", [["🧗","La escalada en paredones verticales de granito"],["🏄","El surf en olas oceánicas de arrecifes cálidos"],["🏇","Las carreras de turf en pistas asfaltadas"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Qué puerto sobre la ría del río Gallegos exporta carbón de Río Turbio y productos pesqueros?", [["⚓","El puerto de Punta Loyola"],["🚢","El puerto fluvial de San Pedro"],["⚓","El puerto militar de Puerto Belgrano"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué infraestructura de transporte inaugurada en el año 2000 multiplicó la llegada de viajeros a El Calafate?", [["✈️","El Aeropuerto Internacional de El Calafate"],["🚂","Una línea de subterráneo metropolitano"],["🚢","Un canal navegable artificial de navegación"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Qué tipo de buques pesqueros operan de noche con potentes lámparas para capturar calamares?", [["💡","Los buques poteros de pesca de calamar"],["🛶","Las canoas de remo con redes de mano"],["⛵","Los veleros deportivos de competencia"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Por qué la actividad turística genera gran cantidad de puestos de trabajo directos e indirectos?", [["💼","Porque demanda atención en hoteles, excursiones y restaurantes"],["🤖","Porque funciona de manera completamente automática sin personas"],["🌾","Porque depende exclusivamente de cosechas de granos"]], 0, "Pista: pensá en las tareas productivas y laborales que se desarrollan allí."),
    q("¿Qué producto dulce típico de la pastelería santacruceña buscan los turistas que visitan la región?", [["🍫","Chocolates artesanales y alfajores de calafate"],["🥥","Mermeladas artesanales de rosa mosqueta"],["🍌","Alfajores rellenos con dulce de membrillo"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
    q("¿Qué reserva marina accesible desde Puerto Deseado protege al vistoso pingüino de penacho amarillo?", [["🐧","La Reserva Provincial Isla Pingüino"],["🌴","El Parque Nacional El Palmar"],["🐊","La reserva pantanosa del Iberá"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Qué modalidad turística fomenta el aprendizaje sobre restos fósiles y culturas ancestrales en Santa Cruz?", [["🦴","El turismo cultural y paleontológico"],["🛍️","Los paseos de compras en grandes centros comerciales"],["🎢","Las visitas a parques mecánicos de atracciones"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué profesión tienen las personas matriculadas que relatan la historia y geografía en las excursiones?", [["🗺️","Los guías de turismo profesionales"],["👨‍⚖️","Los magistrados y jueces de paz"],["👨‍💻","Los desarrolladores de videojuegos"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Por qué es fundamental que la pesca marítima respete estrictamente los períodos de veda biológica?", [["🐟","Para que los peces y moluscos se reproduzcan y no se agoten"],["🏖️","Para despejar las costas marítimas durante los fines de semana"],["🚢","Para que los barcos puedan navegar a mayor velocidad"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
  ],

  // Mundo 12
  12: [
    q("¿En qué consiste el grave proceso de desertificación que degrada muchas zonas de la meseta santacruceña?", [["🏜️","Pérdida de vegetación y suelo fértil por erosión"],["🌊","Inundación permanente provocada por desbordes de ríos"],["🌴","Invasión de pasturas húmedas en las mesetas"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Cuál es una de las causas humanas principales que desencadena la desertificación de la estepa patagónica?", [["🐑","El sobrepastoreo ovino excesivo en los cuadros"],["🚗","El tránsito de automóviles por las rutas nacionales"],["✈️","El paso de aeronaves comerciales en altitud"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
    q("¿Qué agente natural acelera la erosión una vez que el suelo queda sin la protección del pasto?", [["💨","El viento seco y constante que levanta la tierra"],["☀️","La sombra proyectada por las nubes en altura"],["🦗","El canto de insectos durante los meses de verano"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué práctica ganadera sustentable permite recuperar la vegetación natural de los cuadros del campo?", [["🔄","El pastoreo rotativo dejando descansar los potreros"],["🐑","Aumentar la cantidad de animales en el mismo lote"],["🔥","Prender fuego los arbustos espinosos del campo"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué función protectora cumplen los arbustos achaparrados de la estepa como la mata negra?", [["🌿","Frenan el viento y retienen la tierra y humedad"],["🌴","Generan frutos carnosos de exportación intensiva"],["🪵","Absorben toda la luz del sol impidiendo el frío"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué perjuicio generan las bolsas plásticas arrojadas que el viento dispersa por la meseta?", [["🚯","Se enganchan en alambrados y pueden ser comidas por animales"],["🌱","Aportan abono natural que hace crecer flores silvestres"],["💧","Crean vertientes de agua pura de manantial"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Qué consecuencia negativa ocasiona el vertido de aguas residuales sin tratamiento en ríos o rías?", [["🧪","Contaminación del agua y mortandad de fauna acuática"],["🐟","Aumento masivo del tamaño de los peces comestibles"],["💧","Mejora en la pureza y sabor del agua potable de red"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Por qué es crucial que las industrias mineras y petroleras implementen planes de remediación ambiental?", [["🛡️","Para proteger las napas subterráneas de agua dulce y el suelo"],["💰","Para abaratar los costos de transporte de las maquinarias"],["🚚","Para ocupar menor superficie en los caminos de tierra"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
    q("¿Qué especie vegetal exótica traída de Europa compite agresivamente con los pastos nativos en algunos valles?", [["🌹","La rosa mosqueta espinosa"],["🌾","El coirón fueguino autóctono"],["🌲","El árbol de lenga cordillerano"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Por qué las pisadas del guanaco autóctono no degradan el suelo como las pezuñas del ganado ovino?", [["🐾","Posee almohadillas blandas que no cortan las raíces"],["🦙","Porque su peso corporal es menor al de una liebre"],["👣","Porque camina únicamente sobre rocas duras evitando los pastos"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
    q("¿Por qué el agua dulce es un recurso que debe cuidarse al máximo en la provincia de Santa Cruz?", [["💧","Porque el clima es árido y la meseta tiene pocas vertientes"],["🌊","Porque llueve torrencialmente todos los días del año"],["🌧️","Porque el agua de deshielo contiene sal marina por razones históricas y económicas del territorio"]], 0, "Pista: recordá los cursos hídricos que recorren la geografía provincial."),
    q("¿Qué acción cotidiana escolar y doméstica reduce el volumen de residuos enviados al basural a cielo abierto?", [["♻️","Separación en origen para reutilizar y reciclar"],["🗑️","Tirar todos los desechos mezclados en cañadones"],["🔥","Quemar cubiertas y plásticos en las esquinas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llama el estudio técnico obligatorio que evalúa las consecuencias ecológicas de una gran obra pública?", [["📋","Estudio de impacto ambiental previo"],["📜","Copia del acta de fundación municipal"],["🎨","Álbum fotográfico de paisajes locales"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué mamífero carnívoro exótico introducido para peletería depreda al amenazado macá tobiano en sus lagunas?", [["🦦","El visón americano invasor"],["🐴","El caballo criollo de estancia"],["🐑","La oveja de raza Corriedale"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué actitud ciudadana responsable es fundamental para preservar el medio ambiente santacruceño?", [["🌿","Participar activamente en el cuidado del agua y la tierra"],["🚗","Circular a campo traviesa fuera de las huellas señalizadas"],["🚯","Dejar botellas plásticas vacías en las bardas"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
  ],

  // Mundo 13
  13: [
    q("¿Cómo era el modo de vida de los Aonikenk (tehuelches) antes de la llegada de los europeos?", [["🏹","Cazadores-recolectores nómadas de la estepa"],["🌾","Agricultores sedentarios asentados en aldeas"],["⛵","Comerciantes marítimos de barcos de gran porte"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué animal autóctono era la base primordial de la alimentación, vestimenta y vivienda de los Aonikenk?", [["🦙","El guanaco patagónico"],["🐄","La vaca lechera traída de Europa"],["🐖","El cerdo de corral doméstico"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llamaba la manta de abrigo hecha con pieles de guanaco cosidas con el pelo hacia adentro?", [["🧥","El quillango (o kai ajnun)"],["👘","La túnica romana de lino"],["👔","El poncho de lana de oveja"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo era la vivienda tradicional desmontable de los Aonikenk, hecha con palos y cueros?", [["⛺","El toldo patagónico (o kau)"],["🏰","Una fortaleza de piedra tallada"],["🪵","Una cabaña fija de troncos cortados"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué arma arrojadiza compuesta por bolas de piedra y tientos de cuero utilizaban para atrapar guanacos?", [["🪨","Las boleadoras de caza"],["🗡️","Las espadas de hierro fundido"],["🏹","Los cañones de pólvora negra"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se organizaban socialmente los Aonikenk durante sus recorridos por la meseta?", [["👨‍👩‍👧‍👦","En bandas o familias extensas con un líder"],["👑","Bajo un rey absoluto que dictaba leyes escritas"],["🏛️","En asambleas con votaciones electrónicas"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Qué animal traído por los europeos adoptaron los Aonikenk en el siglo XVIII transformando su caza?", [["🐎","El caballo"],["🐂","El buey de tiro"],["🐕","El perro de caza europeo"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Qué testimonio milenario dejaron los antiguos pobladores plasmado en cañadones santacruceños?", [["🎨","Pinturas rupestres de manos y fauna"],["🗿","Esculturas de mármol pulido"],["📚","Libros impresos con caracteres alfabéticos"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Con qué materiales preparaban las pinturas naturales para decorar las rocas de las cuevas?", [["🖌️","Minerales molidos mezclados con grasa animal"],["🧪","Témperas plásticas al agua industriales"],["🟣","Pinturas acrílicas fluorescentes sintéticas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo conservaban la carne de guanaco para disponer de alimento durante los viajes de invierno?", [["🥩","Charqui: carne salada y secada al aire y sol"],["🧊","Guardándola en heladeras eléctricas modernas"],["🥫","Envasándola en latas metálicas al vacío"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué héroe mítico de la cosmovisión tehuelche modeló la Patagonia y enseñó a los hombres a cazar?", [["🌟","Elal, héroe creador ancestral"],["⚡","El dios Zeus de la mitología griega"],["🐉","El dragón alado de los relatos orientales"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué frutos silvestres recolectaban las mujeres aonikenk en la meseta durante los meses estivales?", [["🫐","Calafate, molle y frutos silvestres"],["🍌","Raíces comestibles y semillas de chañar"],["🥥","Cocos carnosos de palmeras costeras"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Cómo realizaban los antiguos cazadores-recolectores la técnica del negativo en la Cueva de las Manos?", [["🖐️","Apoyaban la mano y soplaban pintura con un hueso hueco"],["🖌️","Pintaban la mano y la estampaban directamente como sello"],["🖍️","Dibujaban el contorno de los dedos con puntas de piedra"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Por qué el modo de vida nómada de los Aonikenk no agotaba los recursos naturales de la meseta?", [["🔄","Cambiaban de campamento permitiendo que la fauna se recupere"],["🏭","Porque compraban alimentos elaborados en mercados"],["🏠","Porque permanecían en chozas cerradas todo el año"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Cómo cargaban los Aonikenk los postes del toldo y las pertenencias en sus traslados con caballos?", [["🐴","Atando los palos en rastras arrastradas por los caballos"],["🚚","En camiones con remolque de carga general"],["🚂","A lomo de caballo y mulas de carga"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
  ],

  // Mundo 14
  14: [
    q("¿Qué ambiente geográfico habitaron tradicionalmente los Selk'nam (u onas)?", [["🏹","El interior y costas de la Isla Grande de Tierra del Fuego"],["🌴","Los valles boscosos y canales de la isla"],["🏜️","Las quebradas secas del noroeste andino"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Quiénes eran los Yámanas (o yaganes) en el extremo sur del continente americano?", [["🛶","Pueblos nómadas canoeros de los canales e islas fueguinas"],["🌾","Agricultores de terrazas en valles de montaña"],["🐎","Jinetes que arreaban ganado en llanuras abiertas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se protegían del agua helada los canoeros yámanas mientras pescaban?", [["🦭","Untaban su cuerpo con grasa de lobo marino y foca"],["🧥","Usaban trajes de goma sintética impermeable"],["🧤","Se cubrían con abrigos de plumas de pato cosidas"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué mantenían encendido de forma continua sobre una base de tierra dentro de las canoas yámanas?", [["🔥","Un fogón para calentarse y cocinar mariscos"],["💡","Faroles eléctricos de baterías recargables"],["🕯️","Velas de cera aromatizadas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué importante ceremonia sagrada de iniciación celebraban los Selk'nam con máscaras de corteza y pinturas corporales?", [["🎭","La ceremonia del Hain"],["🎉","El carnaval con comparsas de papel picado"],["🎪","El festival folclórico con danzas campesinas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿De qué material construían los Yámanas sus canoas resistentes para navegar el mar austral?", [["🛶","Con cortezas enteras de árboles de guindo o lenga"],["🧱","Con bloques de arcilla cocida en hornos"],["🔩","Con chapas de hierro remachadas en astilleros"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué arma arrojadiza con punta de hueso usaban los Yámanas para cazar lobos marinos desde la canoa?", [["🗡️","El arpón con punta de hueso desprendible"],["🏹","La cerbatana con dardos envenenados"],["🪨","Las boleadoras pesadas de piedra"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cuál era la presa principal cazada a pie por los Selk'nam en las llanuras fueguinas?", [["🦙","El guanaco fueguino"],["🦌","El reno polar del norte"],["🐅","El zorro colorado fueguino"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué armas manejaban con extraordinaria puntería los cazadores pedestres Selk'nam?", [["🏹","El arco largo y flechas con puntas de piedra"],["🗡️","Lanzas pesadas de metal con punta de bronce"],["🪃","Bumeranes de madera para cazar a la distancia"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo construían los Selk'nam sus refugios cónicos y semiesféricos contra el viento?", [["🪵","Con varas de madera entrelazadas cubiertas de cueros"],["🧱","Con muros de ladrillos pegados con cal en las"],["🧊","Con bloques de hielo tallados en iglúes"]], 0, "Pista: pensá en las condiciones del tiempo y del ambiente en esta época."),
    q("¿Qué tarea fundamental realizaban las mujeres yámanas en la costa y en las canoas?", [["🐚","Buceaban y recolectaban mariscos como cholgas y mejillones"],["🌾","Sembraban hectáreas de trigo y cebada"],["🏭","Trabajaban en hilanderías mecánicas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llamaban los montículos formados por acumulaciones milenarias de valvas de mariscos en las costas?", [["🦪","Concheros arqueológicos"],["🏖️","Dunas de arena fina"],["🌋","Cráteres volcánicos marinos"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué otro pueblo canoero nómada navegaba los canales e islas situados más al oeste del cabo de Hornos?", [["🛶","Los Kawésqar (o alacalufes)"],["🏹","Los Diaguitas andinos"],["🌾","Los Chonos de los fiordos australes"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué abrigo de piel utilizaban los Selk'nam con el pelaje hacia afuera para soportar la nieve?", [["🧥","La capa de piel de guanaco o zorro"],["🥻","Prendas tejidas en algodón egipcio"],["👘","Kimonos de seda con estampados"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Por qué el conocimiento del mar y del viento era decisivo para la supervivencia de los canoeros fueguinos?", [["🌊","Porque un oleaje fuerte o tempestad podía volcar sus canoas"],["☀️","Para saber a qué hora ponerse protector solar"],["🏖️","Para elegir la mejor playa de descanso estival y facilitar la integración de las distintas regiones"]], 0, "Pista: pensá en las condiciones del tiempo y del ambiente en esta época."),
  ],

  // Mundo 15
  15: [
    q("¿Cómo concibe el pueblo Mapuche a la naturaleza y a la Madre Tierra (Ñuke Mapu)?", [["🌱","Como un ser sagrado vivo con el que se convive con respeto"],["💰","Como una mercancía que debe explotarse sin límites"],["🧱","Como un depósito inerte de materiales de construcción"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Cómo se llama la autoridad comunitaria tradicional y portavoz en el pueblo Mapuche?", [["👑","El Lonko"],["👮","El oficial comisario"],["👨‍⚖️","El juez de paz"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué rol cumple la Machi en la comunidad mapuche tradicional?", [["🌿","Guía espiritual y médica conocedora de plantas curativas"],["🚜","Encargada de conducir la maquinaria pesada del campo"],["⚓","Capitana de embarcaciones de pesca marítima"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué instrumento musical sagrado de percusión representa la cosmovisión y los cuatro puntos cardinales?", [["🥁","El Kultrún"],["🎸","La guitarra española"],["🎺","La trompeta de metal"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué instrumento de viento tradicional confeccionado con caña coligüe se utiliza en ceremonias?", [["📯","La Trutruka"],["🎹","El kultrún de madera y cuero"],["🪗","El acordeón a fuelle"]], 0, "Pista: pensá en las condiciones del tiempo y del ambiente en esta época."),
    q("¿Qué arte artesanal textil tradicional se realiza en el telar vertical (huitral) con lanas teñidas?", [["🧶","El tejido en telar de ponchos y mantas"],["🧵","La confección de trajes de nylon industrial"],["🎨","La serigrafía sobre telas sintéticas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué nombre recibe el trabajo tradicional en plata con el que confeccionan aros y pectorales ceremoniales?", [["💍","La platería mapuche"],["🔩","La herrería de clavos de hierro"],["🪙","La fundición de monedas de cobre"]], 0, "Pista: pensá en las tareas productivas y laborales que se desarrollan allí."),
    q("¿Existían fronteras nacionales republicanas en la Patagonia antes de la conformación de los Estados?", [["🗺️","No, había libre movilidad e intercambio a ambos lados de los Andes"],["🚧","Sí, existían aduanas fijas con control de pasaportes en los pasos cordilleranos"],["🛂","Se exigían pasaportes y visas en cada valle"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué término mapuche define al territorio ancestral en su sentido integral de tierra y cosmos?", [["🌍","El Wallmapu"],["🏙️","El ejido urbano municipal"],["🛣️","La ruta nacional asfaltada"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué ceremonia comunitaria anual de agradecimiento a la naturaleza reúne a las familias mapuches?", [["🌾","El Nguillatún (o Kamarikun)"],["🎉","El festival de fuegos artificiales"],["🎭","El desfile callejero con disfraces"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué año nuevo o renovación del ciclo de la naturaleza se celebra en el solsticio de invierno (junio)?", [["☀️","El We Tripantu"],["🎆","El 31 de diciembre gregoriano"],["🎃","El festejo de noche de brujas"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Qué significa el concepto de 'Mapuche-Tehuelche' en la historia social de Santa Cruz?", [["🤝","La convivencia histórica, alianzas e intercambios entre ambos pueblos"],["⚔️","La separación geográfica absoluta sin ningún tipo de contacto ni comercio"],["📜","Un tratado firmado en Europa por reyes de la época"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llama la vivienda comunitaria tradicional mapuche construida con madera y paja?", [["🏠","La Ruka"],["🏰","El palacio amurallado"],["⛺","La carpa militar moderna"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué alimento vegetal ancestral se recolectaba del bosque andino de pehuenes o araucarias?", [["🌲","El piñón de araucaria"],["🥥","La semilla del fruto del calafate"],["🍌","El fruto dulce de la papaya"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo preservan hoy las comunidades mapuches y mapuche-tehuelches su identidad en Santa Cruz?", [["🗣️","Reivindicando su lengua, cosmovisión y derechos reconocidos por ley"],["🤐","Abandonando completamente todas sus costumbres ancestrales"],["📦","Guardando sus recuerdos en cajas cerradas sin mostrarlos"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
  ],

  // Mundo 16
  16: [
    q("¿En qué región geográfica del actual territorio argentino se asentaron los pueblos diaguitas?", [["🏺","En los valles calchaquíes y quebradas del Noroeste"],["🌊","En las costas acantiladas del Atlántico Sur"],["🌾","En los bosques húmedos cordilleranos fueguinos"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
    q("¿Qué modo de vida sedentario distinguió a los Diaguitas respecto a los nómadas patagónicos?", [["🌾","Eran agricultores con aldeas estables de piedra"],["🏹","Cazadores que cambiaban de toldo cada semana"],["🛶","Canoeros que habitaban en islas marinas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué ingenioso sistema construían en las laderas de los cerros para sembrar sin que el agua lave la tierra?", [["🪜","Terrazas de cultivo con andenes de piedra"],["🏊","Acequias y canales de riego empedrados"],["🏢","Muros de contención con piedras encajadas"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué cultivo alimenticio americano fundamental sembraban en sus andenes de cultivo?", [["🌽","El maíz (junto a zapallo, papa y porotos)"],["🌾","El trigo traído por los europeos"],["🍌","La quinoa andina y papas de altura"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llamaban los poblados fortificados de piedra levantados en cumbres de cerros para defensa?", [["🏰","Los pucarás (como la Ciudad Sagrada de Quilmes)"],["🎪","Las casas comunales de troncos"],["⛺","Los campamentos de toldos de cuero"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Qué animal camélido andino domesticado criaban para transporte de carga y lana?", [["🦙","La llama"],["🐎","El caballo español"],["🐄","La vaca lechera"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué arte cerámico decorativo caracterizó a la cultura santamariana de los diaguitas?", [["🏺","Urnas funerarias de barro cocido con dibujos geométricos"],["☕","Pocillos de porcelana importada vidriada"],["🥛","Vasos transparentes de cristal pulido"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué metales sabían fundir y alear los metalúrgicos diaguitas en hornos de barro?", [["🥇","El cobre, el bronce, el oro y la plata"],["🔩","El acero inoxidable industrial moderno"],["🧱","El cemento fraguado al agua"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo almacenaban el agua de deshielo para regar sus terrazas en un clima con pocas lluvias?", [["💧","Mediante represas, diques y canales de piedra"],["🚰","Con cañerías plásticas conectadas a bombas"],["🧊","Comprando barras de hielo congelado en fábricas"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué idioma originario compartían las diferentes parcialidades del pueblo diaguita?", [["🗣️","La lengua kakán"],["🗣️","El latín antiguo"],["🗣️","El idioma inglés"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Cómo conservaban la carne de llama para disponer de proteínas todo el año?", [["🥩","Elaborando charqui secado al sol de altura"],["🧊","Guardándola en cámaras frigoríficas eléctricas"],["🥫","Enlatándola con conservantes químicos"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Qué fruto silvestre de monte recolectaban para hacer harina dulce (patay) y bebidas (aloja)?", [["🌳","La algarroba de los árboles de algarrobo"],["🍊","La naranja dulce de huertos frutales"],["🍏","La manzana verde cultivada"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué autoridades gobernaban cada aldea y organizaban el trabajo comunitario diaguita?", [["👑","Los curacas o caciques principales"],["👮","Los inspectores de policía urbana"],["👨‍⚖️","Los intendentes elegidos por voto electrónico"]], 0, "Pista: pensá en las tareas productivas y laborales que se desarrollan allí."),
    q("¿Qué gran imperio conquistó el noroeste argentino a fines del siglo XV influyendo en los Diaguitas?", [["👑","El Imperio Inca (Tahuantinsuyo)"],["🏛️","El Imperio Romano de Europa"],["⛵","El Imperio Otomano del Cercano Oriente"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Cómo resistieron los Diaguitas durante más de un siglo la invasión militar de los españoles?", [["🏹","Con las Guerras Calchaquíes atrincherados en cerros"],["🏳️","Rindiéndose el primer día de contacto sin combatir"],["✈️","Viajando a Europa para reclamar ante los reyes"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
  ],

  // Mundo 17
  17: [
    q("¿Cómo se llamaba en lengua quechua el inmenso Estado o Imperio gobernado por los Incas?", [["👑","El Tawantinsuyu (las cuatro regiones unidas)"],["🏛️","La confederación de ciudades griegas"],["⛵","El virreinato del Río de la Plata"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cuál era la ciudad capital sagrada y centro del gobierno del Imperio Inca?", [["🏔️","La ciudad de Cusco en los Andes peruanos"],["🏖️","La ciudad de Buenos Aires junto al Plata"],["🌴","La ciudad de Asunción del Paraguay"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué título ostentaba la máxima autoridad política y religiosa del Tawantinsuyu?", [["👑","El Sapa Inca (hijo del Sol)"],["🤠","El capataz de estancia"],["🎩","El presidente de la república"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se denominaba a la comunidad campesina unida por lazos de parentesco que trabajaba la tierra?", [["👨‍👩‍👧‍👦","El Ayllu"],["🏢","El consorcio vecinal"],["🏭","El sindicato obrero"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué monumental red vial de miles de kilómetros con puentes colgantes unía todo el imperio?", [["🛤️","El Qhapaq Ñan (Camino del Inca)"],["🛣️","Las huellas de carretas del valle"],["🚂","La línea de ferrocarril transandino"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Quiénes eran los veloces mensajeros que corrían por postas a lo largo del Camino del Inca?", [["🏃","Los Chasquis"],["🐎","Los jinetes con carretas de bueyes"],["🚲","Los ciclistas de carreras"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llamaban los refugios de descanso y aprovisionamiento ubicados a lo largo de los caminos incas?", [["🏠","Los Tambos"],["🏰","Los castillos feudales"],["🎪","Las carpas de fiesta"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
    q("¿Qué instrumento mnemotécnico de cuerdas de colores con nudos utilizaban para registrar cuentas y censos?", [["🧶","Los Quipus"],["📖","Las enciclopedias impresas en papel"],["💻","Las computadoras con planillas de cálculo"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué dios principal de la cosmovisión inca representaba al astro solar dador de vida y calor?", [["☀️","El dios Inti (el Sol)"],["🌊","Poseidón, dios del océano"],["⚡","Júpiter del panteón romano"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llamaba el sistema de trabajo obligatorio y por turnos que los campesinos prestaban al Estado inca?", [["⚒️","La Mita"],["💼","El contrato laboral asalariado"],["🏖️","El período de vacaciones pagas"]], 0, "Pista: pensá en las tareas productivas y laborales que se desarrollan allí."),
    q("¿Qué ciudadela inca construida en lo alto de una montaña de granito es maravilla del mundo moderno?", [["🏔️","Machu Picchu"],["🏛️","El Coliseo de Roma"],["🗿","Las pirámides de Egipto"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Cómo adaptaron la agricultura para alimentar a millones de habitantes en las escarpadas laderas andinas?", [["🪜","Andenes o terrazas de cultivo con riego artificial"],["🌴","Sembrando en valles planos de altura"],["🏖️","Sembrando granos en la arena de la playa marina"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué tubérculo andino originario domesticado por las culturas andinas se difundió a todo el planeta?", [["🥔","La papa (patata)"],["🥕","La remolacha azucarera"],["🌾","El arroz blanco de pantano"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Cómo encajaban las enormes piedras de sus templos y palacios sin usar cemento ni argamasa?", [["🪨","Piedras talladas a la perfección que encajaban con precisión milimétrica"],["🧱","Ladrillos cocidos de arcilla unidos con mezcla de barro y cal"],["🔩","Atornillándolas con grandes tuercas de acero"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué región del Tawantinsuyu abarcaba el noroeste andino del actual territorio argentino?", [["🧭","El Collasuyo (la región del sur)"],["🌴","El Chinchaysuyo de la costa norte"],["🏖️","El Chinchaysuyo del norte ecuatoriano"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
  ],

  // Mundo 18
  18: [
    q("¿Qué afirma la Constitución Nacional Argentina sobre los pueblos originarios desde la reforma de 1994?", [["📜","Reconoce su preexistencia étnica y cultural (Art. 75 inc. 17)"],["🏛️","Establece que ya no existen comunidades en el país"],["🚪","Prohíbe el uso de sus lenguas y vestimentas tradicionales"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué derecho garantiza que los niños indígenas reciban clases en su propia lengua y en castellano?", [["🏫","El derecho a una educación bilingüe e intercultural"],["🎓","La obligatoriedad de estudiar únicamente idiomas extranjeros"],["📚","La prohibición de aprender materias científicas"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué comunidad tehuelche (aonikenk) histórica mantiene viva su identidad comunitaria en Santa Cruz?", [["🌾","La Comunidad Camusu Aike"],["🌴","Comunidades mapuche-tehuelche urbanas"],["🏔️","El pueblo Wichi del chaco salteño"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué derecho consagra la Constitución sobre las tierras que tradicionalmente ocupan las comunidades?", [["🏞️","La posesión y propiedad comunitaria de sus tierras"],["🏙️","El remate comercial inmediato al mejor postor"],["🏢","La división obligatoria en pequeños departamentos urbanos"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué organismo nacional creado por ley se encarga de atender y tramitar los derechos de las comunidades originarias?", [["🏛️","El INAI (Instituto Nacional de Asuntos Indígenas)"],["✈️","La Administración Nacional de Aviación Comercial"],["🚢","La Dirección General de Aduanas de Puertos"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué significa que la personalidad jurídica de las comunidades indígenas debe ser reconocida por el Estado?", [["📋","Que pueden actuar legalmente como grupo con derechos propios"],["🚫","Que no pueden firmar ningún trámite público"],["💰","Que deben pagar un impuesto doble por cada miembro"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Por qué los pueblos originarios sostienen que 'la tierra no se compra ni se vende, se defiende y se cuida'?", [["🌱","Porque la consideran un espacio de vida, memoria e identidad comunitaria"],["📈","Porque esperan que aumente de precio en el mercado financiero"],["🧱","Porque planean construir fábricas de plástico"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué derecho tienen las comunidades antes de que se autorice una obra o explotación en su territorio ancestral?", [["🤝","La consulta previa, libre e informada"],["🤫","Ninguno: las empresas deciden en secreto"],["🚪","La obligación de desalojar de inmediato el territorio"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué rol cumplen los ancianos y abuelos en la preservación de la memoria comunitaria?", [["👵","Transmiten oralmente leyendas, relatos históricos y la lengua materna"],["📻","Manejan las emisoras de radio comerciales"],["💻","Escriben códigos de software informático"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Qué idiomas ancestrales se revitalizan y enseñan hoy en escuelas de diferentes provincias argentinas?", [["🗣️","El mapudungun, el quechua, el qom y el wichi"],["🗣️","Exclusivamente el idioma latín antiguo europeo"],["🗣️","El esperanto universal moderno"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué reclaman las comunidades originarias sobre restos humanos ancestrales exhibidos en museos antiguos?", [["⚱️","Su restitución a las comunidades para darles digna sepultura"],["🖼️","Que permanezcan en vitrinas de exhibición turística generalizada"],["🏷️","Que se vendan en subastas privadas a coleccionistas de arte"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Cómo participan los miembros de las comunidades indígenas en la vida ciudadana actual argentina?", [["🗳️","Votan, estudian, trabajan y ejercen todos los derechos ciudadanos"],["🚫","Tienen prohibido participar en elecciones públicas"],["🚪","Deben vivir encerrados sin salir de sus parajes"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué conmemoración se celebra cada 12 de octubre en nuestro país según el calendario nacional?", [["🤝","El Día del Respeto a la Diversidad Cultural"],["⛵","El Día del Descubrimiento del Continente"],["👑","El Día de la Conquista Militar Española"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué artesanías ancestrales siguen creando y vendiendo mujeres originarias en ferias y talleres?", [["🧶","Tejidos en telar, platería, cestería y alfarería tradicional"],["📱","Dispositivos de telefonía celular inteligente"],["📺","Monitores de televisión de pantalla plana"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Por qué decimos que la Argentina es una nación pluricultural y multiétnica?", [["🌈","Porque en ella conviven pueblos originarios, criollos y descendientes de inmigrantes"],["🏢","Porque todas las familias comparten las mismas costumbres y tradiciones"],["🧱","Porque fue fundada por un solo grupo de personas"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
  ],

  // Mundo 19
  19: [
    q("¿Qué hecho histórico ocurrido en 1453 motivó a los navegantes europeos a buscar nuevas rutas marítimas?", [["⛵","La caída de Constantinopla en manos del Imperio Otomano"],["🌾","Una terrible peste que arrasó las cosechas europeas"],["👑","La coronación de los reyes de Francia en París"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué productos comerciales valiosos buscaban con urgencia los mercaderes europeos en las Indias orientales?", [["🌶️","Las especias para conservar carnes y finas telas de seda"],["🧊","Trigo y maíz cultivados en las llanuras agrícolas"],["🌾","Semillas de pasto coirón patagónico"]], 0, "Pista: pensá en las tareas productivas y laborales que se desarrollan allí."),
    q("¿Qué instrumento de navegación provisto de una aguja imantada ayudó a orientarse mar adentro?", [["🧭","La brújula magnética"],["🌡️","El termómetro ambiental"],["⏱️","El reloj de arena de bolsillo"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué instrumento astronómico permitía a los capitanes calcular la latitud observando la altura de las estrellas?", [["🔭","El astrolabio (o el cuadrante)"],["📻","El receptor de ondas de radio"],["🔍","El microscopio de aumentos"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué tipo de embarcación ligera con velas cuadradas y triangulares revolucionó la navegación oceánica en el siglo XV?", [["⛵","La carabela"],["🛶","La canoa de corteza"],["🚢","La galera a remos y vela latina"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Cómo se llamaban los primeros mapas marítimos dibujados a mano con rumbos de navegación costeros?", [["🗺️","Los portulanos (cartas náuticas)"],["📊","Los gráficos estadísticos"],["🖼️","Los cuadros artísticos al óleo"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué dos reinos de la península ibérica lideraron las primeras expediciones de exploración oceánica?", [["👑","Los reinos de Portugal y de España"],["🏛️","El imperio de Alemania y Rusia"],["⛵","Las ciudades de Suecia y Dinamarca"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué ruta eligieron los navegantes portugueses para llegar a la India bordeando un continente?", [["🌍","La ruta bordeando las costas del continente africano"],["🧊","El cruce por los hielos del Polo Norte"],["🏜️","Una travesía a pie por el desierto de Arabia"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué navegante genovés al servicio de los Reyes Católicos propuso llegar a Oriente navegando hacia el oeste?", [["⛵","Cristóbal Colón"],["🧭","Fernando de Magallanes"],["⚓","Juan Sebastián Elcano"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué tratado firmado en 1494 trazó una línea imaginaria en el océano dividiendo las zonas entre España y Portugal?", [["📜","El Tratado de Tordesillas"],["🏛️","El Pacto de San José de Flores"],["⚖️","La Constitución Nacional de 1853"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se conservaban los alimentos frescos para la tripulación durante travesías marítimas de meses?", [["🥩","En salmuera, charqui, tocino salado y galletas secas (bizcochos)"],["🧊","En barricas de madera apiladas en la bodega del barco"],["🥫","En recipientes plásticos al vacío"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué grave enfermedad provocada por la falta de vitamina C afectaba a los marineros que no comían frutas frescas?", [["🍋","El escorbuto"],["🦷","La caries dental común"],["🦴","La fractura de huesos"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué tipo de barco de mayor porte y capacidad de carga que la carabela se utilizó en viajes comerciales?", [["🚢","La nao (como la Santa María o la Victoria)"],["🛶","La balsa de cañas y juncos"],["🚤","El galeón armado de transporte pesado"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué papel cumplía el timón de codaste instalado en la popa de los nuevos barcos oceánicos?", [["🧭","Permitía maniobrar y dirigir la nave con precisión"],["⚓","Mantenía el ancla trabada en el fondo marino"],["💨","Hacía girar hélices bajo el agua"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Por qué los viajes europeos del siglo XV transformaron definitivamente la historia de la humanidad?", [["🌐","Conectaron por primera vez a los distintos continentes del planeta"],["🚫","Porque hicieron que la navegación marítima se prohibiera"],["🔒","Porque mantuvieron a las distintas regiones del planeta incomunicadas"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
  ],

  // Mundo 20
  20: [
    q("¿Quién comandaba la armada española que zarpó en 1519 buscando el paso hacia las islas de las especias?", [["🧭","Fernando de Magallanes"],["⛵","Cristóbal Colón"],["👑","Juan de Garay"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿En qué puerto natural santacruceño fondeó la flota para pasar el crudo invierno de 1520?", [["⚓","En la bahía de Puerto San Julián"],["⚓","En el puerto de Buenos Aires"],["⚓","En la ría de Río Gallegos"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué acontecimiento religioso histórico se celebró por primera vez en territorio argentino en Puerto San Julián?", [["⛪","La primera misa católica (el 1 de abril de 1520)"],["🏛️","La jura de la Constitución Nacional"],["💍","El primer casamiento civil del país"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué nombre le dieron los tripulantes a los aborígenes tehuelches debido a las huellas de sus mocasines de cuero?", [["🦶","Patagones (origen del nombre Patagonia)"],["👑","Incas andinos del imperio incaico"],["🏹","Canoeros yámanas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cuántas naos componían originalmente la Armada de las Molucas comandada por Magallanes?", [["⛵","5 naves (Trinidad, San Antonio, Concepción, Victoria y Santiago)"],["⛵","3 carabelas pequeñas"],["⛵","20 buques de guerra modernos"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué difícil conflicto interno sofocó Magallanes con firmeza durante la estadía en San Julián?", [["⚔️","Un motín encabezado por capitanes españoles descontentos"],["🦁","El ataque de una manada de animales salvajes"],["🌊","Un maremoto que destruyó el muelle de madera"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué nave de la flota naufragó explorando la desembocadura del río Santa Cruz en mayo de 1520?", [["🌊","La nao Santiago"],["⛵","La nao Victoria"],["🚢","La nave capitana Trinidad"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué paso marítimo interoceánico descubrió la expedición en octubre de 1520 al sur de Santa Cruz?", [["⛵","El Estrecho de Magallanes (que une el Atlántico con el Pacífico)"],["🚢","El Canal de Panamá artificial"],["🌊","El Canal de Beagle fueguino"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo bautizó Magallanes al nuevo océano de aguas calmas que encontró al salir del estrecho?", [["🌊","El Océano Pacífico"],["🌊","El Mar de los Sargazos"],["🌊","El Océano Glacial Ártico"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué navegante español asumió el mando supremo de la expedición tras la muerte de Magallanes en Filipinas?", [["⚓","Juan Sebastián Elcano"],["👑","Hernán Cortés"],["🗡️","Francisco Pizarro"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Qué única nao logró regresar a España en 1522 completando la primera vuelta al mundo de la historia?", [["⛵","La nao Victoria"],["🚢","La nave capitana Trinidad"],["⚓","La nao Concepción"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué cronista italiano viajó en la flota y relató detalladamente las costumbres y palabras de los patagones?", [["📖","Antonio Pigafetta"],["🎨","Leonardo da Vinci"],["📜","Marco Polo"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué monumento en el puerto de San Julián exhibe hoy una réplica a escala real de la nao Victoria?", [["🚢","El Museo Nao Victoria de Puerto San Julián"],["🏛️","El Museo Regional de la Minería y Carbón"],["🌊","El Paseo Costero de los Pioneros del Mar"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué nombre le dieron los expedicionarios a la isla de Tierra del Fuego al divisar columnas de humo?", [["🔥","Tierra del Fuego (por las fogatas de los habitantes originarios)"],["❄️","Tierra de los Glaciares eternos"],["🏝️","Isla de las Palmeras doradas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué verdad geográfica trascendental comprobó empíricamente la expedición de Magallanes y Elcano?", [["🌍","La redondez de la Tierra y la unión continua de los grandes océanos"],["🧭","La existencia de un pasaje fluvial directo entre Europa y los mares asiáticos"],["🗺️","Que todos los continentes formaban una única masa de tierra seca"]], 0, "Pista: pensá en la navegación que confirmó la forma esférica del planeta."),
  ],

  // Mundo 21
  21: [
    q("¿Cuáles fueron las tres grandes corrientes colonizadoras españolas que fundaron ciudades en el actual territorio argentino?", [["🧭","La Corriente del Norte, del Oeste y del Este"],["🚢","La Corriente del Polo Sur, del Polo Norte y Central"],["🌊","La Corriente Marina, Aérea y Fluvial"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué histórica ciudad fundada en 1553 por la corriente del norte es llamada la 'Madre de Ciudades' argentina?", [["🏙️","Santiago del Estero"],["🏙️","Córdoba de la Nueva Andalucía"],["🏙️","San Miguel de Tucumán"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué conquistador español fundó por segunda y definitiva vez la ciudad de Buenos Aires en 1580?", [["⚓","Juan de Garay"],["👑","Pedro de Mendoza"],["🗡️","Jerónimo Luis de Cabrera"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué ciudades cuyanas fueron fundadas por la corriente colonizadora proveniente de Chile cruzando la cordillera?", [["🏔️","Mendoza, San Juan y San Luis"],["🌾","Salta, Jujuy y Catamarca"],["🌊","Corrientes, Paraná y Posadas"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Cómo se llama el trazado urbano regular en forma de cuadrícula o tablero de ajedrez con el que se fundaban las ciudades?", [["📐","El plano en damero (o cuadrícula española)"],["🌀","El diseño circular concéntrico"],["〰️","El trazado lineal sin calles rectas"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué espacio público central y abierto se ubicaba en el corazón de toda ciudad colonial española?", [["🏛️","La Plaza Mayor (o Plaza de Armas)"],["🏟️","El estadio de fútbol deportivo"],["🏖️","El balneario costero municipal"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué instituciones fundamentales de gobierno y religión rodeaban directamente la Plaza Mayor colonial?", [["⛪","El Cabildo y la Iglesia Matriz (o Catedral)"],["🏭","Las fábricas textiles y talleres mecánicos"],["🏢","Los edificios de departamentos modernos"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Cuál era la función primordial del Cabildo en las ciudades coloniales rioplatenses?", [["🏛️","Administrar la justicia local, la higiene, el abastecimiento y la seguridad"],["👑","Dictar las leyes de navegación comercial de todo el imperio español"],["🚢","Comandar las flotas de barcos de guerra en Europa"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Por qué los españoles fundaban ciudades en puntos estratégicos en las distintas regiones?", [["🛡️","Para defender el territorio, asegurar caminos y abastecerse"],["🏖️","Para construir centros turísticos de vacaciones"],["🌾","Para abandonar las tierras e irse a otros países y asegurar el cumplimiento de las leyes"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué ciudad mediterránea estratégica del centro del país fue fundada por Jerónimo Luis de Cabrera en 1573?", [["🏛️","Córdoba de la Nueva Andalucía"],["🏔️","San Salvador de Jujuy en las"],["🌊","Santa Fe de la Vera Cruz"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué nombre recibían las parcelas cuadradas de tierra repartidas a los vecinos para construir sus viviendas familiares?", [["🏡","Los solares urbanos"],["🔲","Los cuadros de estancia ovina"],["🌾","Las chacras de cultivo extensivo"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Quiénes eran considerados formalmente 'vecinos' con derecho a participar de las reuniones del Cabildo?", [["🎩","Varones españoles y criollos propietarios de tierras o comercios"],["👥","Todos los habitantes sin importar su condición social"],["🌾","Exclusivamente los peones rurales de las estancias"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Cómo se llamaba la ceremonia donde el fundador clavaba el madero o rollo de justicia proclamando la fundación?", [["📜","El acta de fundación y toma de posesión en nombre del rey"],["🎉","El brindis de año nuevo con fuegos artificiales"],["🎪","El festival de danzas campestres"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué ciudad portuaria clave sobre el río Paraná fundó Juan de Garay antes de fundar Buenos Aires?", [["🌊","Santa Fe de la Vera Cruz (1573)"],["🏔️","San Fernando del Valle de Catamarca"],["🌾","La Rioja de la Nueva Andalucía"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Por qué los fundadores elegían terrenos cercanos a ríos o arroyos de agua dulce?", [["💧","Para garantizar el agua para consumo, huertas y riego de animales"],["⛵","Para facilitar la navegación de barcazas hacia el mar"],["🌾","Para contar con pastizales naturales donde alimentar al ganado"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
  ],

  // Mundo 22
  22: [
    q("¿Cómo se caracterizaba la sociedad colonial rioplatense respecto a los derechos de sus grupos sociales?", [["📜","Era una sociedad desigual y dividida en estamentos y castas"],["🤝","Era una sociedad igualitaria donde todos tenían idénticos derechos"],["🗳️","Una sociedad democrática con voto universal y secreto"]], 0, "Pista: recordá cómo se distribuyen las responsabilidades públicas."),
    q("¿Qué grupo social concentraba los puestos más altos de gobierno virreinal y de la Iglesia?", [["👑","Los españoles peninsulares (nacidos en España)"],["🌾","Los peones rurales mestizos de la campaña"],["⛓️","Las personas africanas esclavizadas"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Quiénes eran los criollos en la sociedad colonial rioplatense?", [["🏛️","Hijos de españoles nacidos en tierras americanas"],["🌴","Familias españolas nacidas en Europa"],["🚢","Navegantes extranjeros llegados de Francia"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿En qué institución de gobierno local sí podían participar y ocupar cargos los vecinos criollos?", [["🏛️","En el Cabildo de la ciudad"],["👑","En el Consejo de Indias en Madrid"],["⚔️","En el tribunal de la corte del rey en Europa"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Quiénes eran los mestizos en la pirámide social colonial?", [["🤝","Hijos de uniones entre españoles e indígenas"],["👑","Nobles nacidos en familias reales europeas"],["⛓️","Personas traídas cautivas del continente africano"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué sistema de trabajo forzado obligaba a los indígenas a trabajar para un encomendero español?", [["🌾","La Encomienda colonial"],["💼","El contrato laboral por horas"],["🏖️","El régimen de pasantías escolares"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Qué grupo social ocupaba la base de la sociedad colonial sin libertad ni derechos civiles?", [["⛓️","Las personas africanas esclavizadas y sus descendientes"],["🎩","Los comerciantes adinerados del puerto"],["👑","Los jueces peninsulares de la Audiencia"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Qué tareas realizaban comúnmente las personas africanas esclavizadas en las ciudades?", [["🧹","Trabajos domésticos en casas de familia y vendedores ambulantes"],["🏛️","Dictar sentencias como jueces en los tribunales"],["👑","Gobernar las provincias como virreyes"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Cómo se llamaban las reuniones sociales y musicales celebradas en las salas de familias adineradas?", [["🎻","Las tertulias coloniales"],["🎭","Las funciones de ópera en teatros"],["🐎","Las carreras de sortija campesinas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué comercio ambulante callejero abastecía de agua limpia extraída del río a las viviendas coloniales?", [["💧","El aguatero con su carro y grandes tinajas de agua"],["🧺","El repartidor de carbón vegetal para braseros"],["🍞","El panadero que llevaba canastas a caballo"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué versos rimados cantaban a viva voz los vendedores callejeros para anunciar sus productos en la plaza?", [["🗣️","Los pregones coloniales"],["📜","Las leyes del código penal"],["📖","Los poemas en lengua extranjera"]], 0, "Pista: pensá en las tareas productivas y laborales que se desarrollan allí."),
    q("¿Cómo se llamaba el modesto comercio de campaña donde los gauchos y paisanos compraban yerba y jugaban a las cartas?", [["🐎","La pulpería"],["🏬","La tienda de ramos generales del puerto"],["🏦","El almacén de campaña y posta de postillón"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué bebida vegetal caliente compartían personas de todas las clases sociales coloniales?", [["🧉","El mate criollo"],["☕","Vino caliente especiado importado"],["🧃","Agua de azahar endulzada con miel"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se alumbraban las casas y calles coloniales al ocultarse el sol?", [["🕯️","Con velas de sebo y candiles de aceite"],["💡","Con antorchas de brea en postes"],["🔦","Con fogatas encendidas en las esquinas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué mujeres lavaban ropa arrodilladas en las orillas del río de la Plata en Buenos Aires?", [["🧺","Las lavanderas afrodescendientes"],["👑","Las damas de la corte virreinal"],["🎩","Las esposas de los jueces peninsulares"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
  ],

  // Mundo 23
  23: [
    q("¿Qué famosa montaña del Alto Perú (actual Bolivia) albergó la mina de plata más rica del mundo colonial?", [["⛰️","El Cerro Rico de Potosí"],["🏔️","El cerro Fitz Roy andino"],["🌋","El volcán Lanín neuquino"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Cómo dinamizó la ciudad minera de Potosí a las economías del actual territorio argentino?", [["💰","Demandaba mulas, alimentos, ropas y carretas para miles de personas"],["🏖️","Exportaba oro refinado y manufacturas directamente hacia los puertos de Europa"],["🌾","Exportaba trigo barato a los puertos patagónicos"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué animal de carga fuerte y resistente se criaba masivamente en las llanuras pampeanas para enviarlo a Potosí?", [["🐴","Las mulas de carga"],["🐪","Los camellos de desierto"],["🐘","Los bueyes de tiro de carreta"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿En qué feria comercial salteña se concentraban y vendían decenas de miles de mulas rumbo al Alto Perú?", [["🐎","La feria de mulas de Sumalao en Salta"],["🏖️","La feria de artesanos de Mar del Plata"],["🚢","El puerto ultramarino de Rosario"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué provincia del Noroeste se especializó en la fabricación artesanal de carretas de madera para el transporte colonial?", [["🪵","La provincia de Tucumán"],["🌾","La provincia de Entre Ríos"],["❄️","La provincia de Santa Cruz"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué productos elaboraban las regiones de Cuyo (Mendoza y San Juan) para abastecer a los centros mineros?", [["🍷","Vinos de mesa, aguardientes, pasas de uva y frutas secas"],["🥩","Telas de lana hilada, ponchos de telar y aperos criollos"],["🧶","Telas finas de seda natural importada"]], 0, "Pista: pensá en las tareas productivas y laborales que se desarrollan allí."),
    q("¿Qué producían artesanalmente los pobladores de Santiago del Estero y Catamarca para enviar a Potosí?", [["🧶","Tejidos de lana, mantas y ponchos de abrigo"],["🔩","Herramientas industriales de aluminio"],["☕","Pocillos de porcelana europea"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llamaba la vía principal de tierra que unía Buenos Aires y Córdoba con el Alto Perú?", [["🛤️","El Camino Real hacia el norte"],["🛣️","La Ruta Nacional 40 asfaltada"],["🚂","La huella de carretas y postas de postillón"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué función cumplían las postas ubicadas a la vera del Camino Real cada pocas leguas?", [["🏠","Lugares para cambiar caballos, descansar y comer"],["🏭","Grandes fábricas automotrices de camiones"],["🏫","Escuelas universitarias de posgrado"]], 0, "Pista: pensá en las zonas y divisiones del mapa que estudiamos."),
    q("¿Qué moneda colonial de plata acuñada en Potosí circuló por todo el mundo con enorme valor?", [["🪙","El Real de a ocho (o peso de plata potosino)"],["💵","El billete de papel moneda moderno"],["💳","La tarjeta plástica de débito"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Quiénes realizaban el durísimo y peligroso trabajo de extraer la plata en el interior de los socavones del cerro?", [["⛏️","Los indígenas sometidos al régimen forzado de la mita minera"],["👑","Los comerciantes adinerados españoles"],["🎩","Los jueces y magistrados del virreinato"]], 0, "Pista: pensá en las formas del terreno y sus distintas alturas."),
    q("¿Por qué el puerto de Buenos Aires cobró tanta importancia estratégica para el circuito de la plata?", [["⚓","Porque era una salida más rápida al Atlántico y entrada de contrabando"],["🏖️","Por ser un destino de balnearios marítimos a través de rutas comerciales y acuerdos regionales"],["🌴","Para importar bananas y frutas del trópico"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
    q("¿En qué año se creó el Virreinato del Río de la Plata para controlar mejor el comercio y defender el sur?", [["🏛️","En el año 1776"],["📅","En el año 1492"],["📅","En el año 1853"]], 0, "Pista: pensá en las principales cuencas hídricas que cruzan la meseta."),
    q("¿Qué producto ganadero se obtenía de los rebaños de Córdoba para abastecer a los trabajadores de las minas?", [["🥩","Grasa para velas y tasajo (carne seca y salada)"],["🍓","Mermeladas frescas de frambuesa"],["🍫","Chocolates finos en tabletas"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Por qué decimos que la plata de Potosí integró territorialmente a regiones muy distantes de nuestro país?", [["🌐","Porque cada región se especializó en proveer lo que Potosí necesitaba consumir"],["🚫","Porque las regiones dejaron de comunicarse entre sí a causa de las condiciones del espacio geográfico"],["🧱","Porque levantaron murallas que aislaban a cada provincia"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
  ],

  // Mundo 24
  24: [
    q("¿En qué consistió el proceso histórico conocido como la 'conquista espiritual' de América?", [["⛪","La evangelización e imposición de la religión católica a los pueblos originarios"],["🌾","La siembra y producción intensiva de cereales traídos de Europa"],["🚢","La construcción de flotas navales de guerra"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué importantes órdenes religiosas católicas se encargaron de fundar misiones y educar en América colonial?", [["✝️","Los jesuitas, franciscanos, dominicos y mercedarios"],["🏛️","Los senadores del congreso legislativo"],["👮","Los oficiales de la marina mercante"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué pueblo originario del Litoral conformó con los padres jesuitas célebres poblados misioneros organizados?", [["🌴","El pueblo Guaraní en las Misiones Jesuíticas"],["🏹","Los Selk'nam de Tierra del Fuego"],["🦙","Los Aonikenk de la estepa patagónica"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué actividades aprendían y desarrollaban los guaraníes en los talleres de las misiones jesuíticas?", [["🎻","Música barroca, luthería, imprenta, escultura y agricultura"],["💻","Minería subterránea de oro y fundición de metales pesados"],["✈️","Pilotaje de aeronaves comerciales"]], 0, "Pista: pensá en las tareas productivas y laborales que se desarrollan allí."),
    q("¿Qué fenómeno cultural se produjo con la fusión de creencias originarias y católicas (sincretismo religioso)?", [["🎭","Celebraciones donde la Pachamama se asoció a la Virgen María"],["🚫","La prohibición absoluta de toda música y fiesta"],["🧊","El congelamiento de todas las costumbres antiguas"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué alimentos autóctonos americanos adoptó el mundo enriqueciendo la gastronomía universal?", [["🌽","El maíz, la papa, el tomate, el cacao y la calabaza"],["🌾","El trigo, el arroz y la cebada cervecera"],["🍊","La naranja, el limón y el pomelo"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué cultivo originario de los guaraníes se convirtió en la infusión nacional más consumida de Argentina?", [["🧉","La yerba mate"],["☕","El café colombiano"],["🍵","El té negro de Ceilán"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Qué palabras de origen indígena incorporó el idioma castellano enriqueciendo nuestro vocabulario cotidiano?", [["🗣️","Canoa, chocolate, poncho, choique, carancho y cancha"],["🗣️","Palabras de origen anglosajón moderno"],["🗣️","Términos exclusivos del idioma latín"]], 0, "Pista: recordá las formas de vida y costumbres de los antiguos pobladores."),
    q("¿Por qué en 1767 la monarquía española decretó la expulsión de los sacerdotes jesuitas de todos sus dominios?", [["📜","Porque su poder e independencia económica molestaban a la corona española"],["🌾","Porque no sabían cultivar la tierra ni hablar castellano por razones históricas y económicas del territorio"],["⛪","Porque decidieron regresar voluntariamente a Europa"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Qué instrumento musical europeo adoptaron con maestría los músicos guaraníes en los coros misioneros?", [["🎻","El violín y el arpa clásica"],["🪗","El sintetizador de teclado"],["🎸","La guitarra eléctrica con amplificador"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué destacada institución educativa y cultural del territorio argentino fue fundada por los jesuitas en 1613?", [["🎓","La Universidad Nacional de Córdoba (antiguo Colegio Mayor)"],["🎓","La Universidad de Buenos Aires (UBA)"],["🎓","La Universidad de La Plata"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué aporte cultural y musical introdujeron las poblaciones de origen africano traídas a América?", [["🥁","Ritmos como el candombe, los tambores y danzas de comparsa"],["🎻","Conciertos de ópera lírica clásica"],["🎷","Composiciones de música electrónica"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Por qué el mestizaje cultural en América dio lugar a una identidad plural y diversa?", [["🤝","Porque combinó saberes, comidas, canciones y palabras de múltiples orígenes"],["🚪","Porque obligó a que todos los pueblos se separaran"],["🧱","Porque impuso un pensamiento uniforme sin cambios debido a los tratados y acuerdos firmados en la época"]], 0, "Pista: pensá en los motivos y razones explicados en el tema."),
    q("¿Qué celebración tradicional del noroeste andino homenajea a la Madre Tierra con ofrendas en la tierra?", [["🌱","La fiesta de la Pachamama en el mes de agosto"],["🎃","El festejo de carnaval de máscaras venecianas"],["🎉","El brindis con champaña de medianoche"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Qué restos arquitectónicos misioneros en la provincia de Misiones fueron declarados Patrimonio de la Humanidad?", [["🏛️","Las Ruinas de San Ignacio Miní"],["🏰","El Cabildo porteño frente a la Plaza de Mayo"],["🗿","Las ruinas fortificadas de la Ciudad Sagrada de Quilmes"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
  ],

  // Mundo 25
  25: [
    q("¿En qué año y en qué ciudad histórica fue sancionada la Constitución de la Nación Argentina?", [["⚖️","En 1853 en la ciudad de Santa Fe"],["⚖️","En 1810 en la ciudad de Buenos Aires"],["⚖️","En 1816 en la ciudad de Tucumán"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Por qué decimos que la Constitución Nacional es la 'ley suprema' de toda la República Argentina?", [["📜","Porque ninguna ley, tratado o decreto puede contradecir sus mandatos"],["📚","Porque organiza los poderes de gobierno y establece todos los derechos ciudadanos"],["🏛️","Porque fue escrita por reyes europeos"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Cuáles son las tres características de la forma de gobierno según el Artículo 1.º de la Constitución Nacional?", [["🏛️","Representativa, Republicana y Federal"],["👑","Monárquica, Centralista y Militar"],["🗳️","Parlamentaria, Unitaria y Provincial"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Qué significa que la forma de gobierno es 'representativa' según el Artículo 22 de la Constitución?", [["🗳️","El pueblo gobierna a través de sus representantes que elige por voto"],["👑","Un rey gobierna por mandato hereditario familiar"],["🚪","Los ciudadanos no participan jamás en las decisiones"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Cuáles son los tres poderes independientes en que se divide el gobierno en una república para evitar abusos?", [["⚖️","El Poder Ejecutivo, el Poder Legislativo y el Poder Judicial"],["🌾","El poder militar, el poder sindical y el poder escolar"],["🚢","El poder marítimo, el poder aéreo y el terrestre"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Quién encabeza el Poder Ejecutivo Nacional y administra los asuntos generales de la República Argentina?", [["🏛️","El Presidente de la Nación Argentina"],["👨‍⚖️","El juez presidente de la Corte Suprema"],["📜","El diputado con mayor cantidad de años de mandato"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Qué órgano bicameral ejerce el Poder Legislativo Nacional elaborando y sancionando las leyes del país?", [["📜","El Congreso de la Nación (Cámara de Diputados y de Senadores)"],["🏛️","La Corte Suprema de Justicia"],["👮","La jefatura de ministros del gabinete"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Qué órgano ejerce el Poder Judicial de la Nación aplicando las leyes y juzgando conflictos?", [["👨‍⚖️","La Corte Suprema de Justicia de la Nación y tribunales inferiores"],["🗳️","La Junta Electoral de las elecciones"],["🏢","El ministerio de economía"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Qué significa que la Argentina adopta la forma de Estado 'federal'?", [["🇦🇷","Las provincias son autónomas y dictan sus propias leyes y constituciones"],["🏛️","Todo el poder y las decisiones se toman únicamente en Buenos Aires"],["👑","Las provincias están subordinadas a un gobernador designado a dedo"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo se llama el texto introductorio de la Constitución que enuncia los objetivos de unión, justicia y paz?", [["📜","El Preámbulo de la Constitución"],["📖","El índice temático del libro general"],["📝","La contratapa del libro encuadernado"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Qué derechos fundamentales consagra el Artículo 14 de la Constitución Nacional para todos los habitantes?", [["🤝","Trabajar, estudiar, comerciar, transitar y profesar libremente su culto"],["🚫","El derecho de apoderarse de bienes ajenos"],["🔒","La obligación de permanecer siempre en la misma ciudad"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Qué principio republicano exige que los actos de gobierno se publiquen para conocimiento de toda la ciudadanía?", [["📰","La publicidad de los actos de gobierno"],["🤫","El secreto de Estado en todas las decisiones"],["🤐","La prohibición de emitir noticias públicas"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Por qué los cargos en los poderes Ejecutivo y Legislativo son 'periódicos' y no duran de por vida?", [["⏱️","Para renovar las autoridades mediante elecciones libres y evitar tiranías"],["📜","Porque las normas exigen mandatos breves para rotar funciones"],["🏛️","Para que distintas agrupaciones puedan presentar sus propuestas"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿En qué año se llevó adelante la última gran Reforma Constitucional que incorporó nuevos derechos y tratados?", [["📅","En el año 1994 (en Santa Fe y Paraná)"],["📅","En el año 1810 durante la Revolución de Mayo"],["📅","En el año 1953"]], 0, "Pista: recordá los momentos y etapas históricas que analizamos."),
    q("¿Qué deber ciudadano esencial sostiene el funcionamiento del Estado, los hospitales y las escuelas públicas?", [["💰","El pago responsable de impuestos y tributos fijados por ley"],["📜","El cumplimiento de los trámites ante el registro civil"],["🗳️","La participación en asambleas barriales de vecinos"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
  ],

  // Mundo 26
  26: [
    q("¿Cómo se llama la norma jurídica fundamental y suprema de nuestra provincia?", [["🏛️","La Constitución Provincial de Santa Cruz"],["📜","El reglamento general de policía"],["📚","El manual de geografía escolar"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo está integrado el Poder Legislativo de la provincia de Santa Cruz?", [["🏛️","Por la Cámara de Diputados en un sistema unicameral"],["🏛️","Por dos cámaras separadas de diputados y senadores"],["🏛️","Por un concejo de jueces elegidos por concurso público"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Quién ejerce el Poder Ejecutivo en el ámbito del gobierno provincial de Santa Cruz?", [["🏛️","El Gobernador de la Provincia (junto a sus ministros)"],["👨‍⚖️","El Presidente de la Cámara de Diputados de la Legislatura"],["👮","El jefe de la prefectura de puerto"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Quién encabeza el Poder Ejecutivo dentro de una ciudad o municipio santacruceño?", [["🏢","El Intendente Municipal"],["👨‍⚖️","El presidente de la Corte Suprema"],["🤠","El capataz general de estancia"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué cuerpo deliberativo local sanciona las ordenanzas municipales en cada localidad?", [["🏛️","El Concejo Deliberante (integrado por concejales)"],["⚖️","El Tribunal de Cuentas y Control Municipal"],["✈️","La junta de aviación comercial"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué tratado internacional con rango constitucional protege de manera prioritaria a todos los chicos y chicas?", [["🧒","La Convención sobre los Derechos del Niño"],["📜","El Tratado de navegación de Magallanes"],["⚖️","El código de comercio marítimo"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Qué derecho fundamental garantiza que cada recién nacido tenga un nombre, apellido y nacionalidad?", [["🪪","El derecho a la identidad"],["🚗","El derecho a conducir automóviles"],["💼","El derecho a firmar escrituras comerciales"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Qué derecho asegura que todos los niños y niñas puedan asistir a la escuela sin pagar cuotas?", [["🎒","El derecho a la educación pública y gratuita"],["✈️","El derecho a recibir atención médica y cuidados"],["🏖️","El derecho a no hacer ninguna tarea escolar"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Qué derecho de la niñez reconoce el valor del esparcimiento, la imaginación y la recreación?", [["⚽","El derecho a jugar, descansar y divertirse"],["💼","La obligación de trabajar en jornadas de ocho horas"],["🤐","La prohibición de salir al patio en los recreos"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Qué principio fundamental de los Derechos del Niño en la Convención exige priorizar el bienestar de las infancias?", [["🌟","El principio del Interés Superior del Niño"],["📈","El principio de la máxima ganancia económica"],["🚪","El principio de la prisa administrativa"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Qué derecho protege a los chicos contra cualquier forma de violencia, abuso o castigo?", [["🛡️","El derecho a la protección contra el maltrato y abandono"],["🗳️","El derecho a votar en elecciones generales"],["💼","El derecho a celebrar contratos comerciales"]], 0, "Pista: pensá en las áreas de conservación y cuidado del entorno."),
    q("¿Qué derecho garantiza que las opiniones de los niños sean tomadas en cuenta según su edad y madurez?", [["🗣️","El derecho a ser escuchado y expresar libremente su voz"],["🤐","La obligación de guardar silencio ante cualquier decisión"],["🚪","La prohibición de hablar en las aulas"]], 0, "Pista: pensá en las normas e instituciones que organizan a la sociedad."),
    q("¿Cómo se llama el órgano municipal o provincial donde los ciudadanos pueden denunciar vulneraciones de derechos?", [["🤝","Las defensorías y áreas de niñez y adolescencia"],["🏦","Las ventanillas de cobro de impuestos"],["✈️","Las oficinas de reservas de pasajes"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
    q("¿Qué servicio municipal esencial cuida la higiene urbana recolectando la basura en los barrios?", [["🚛","El servicio de recolección de residuos y barrido"],["🚒","El patrullaje de buques pesqueros en las"],["🚂","El mantenimiento del alumbrado público"]], 0, "Pista: recordá los conceptos explicados en clase sobre este tema."),
    q("¿Cómo pueden los alumnos de 4.º grado ejercer su ciudadanía responsable en la escuela y el municipio?", [["🤝","Convivir con respeto, dialogar pacíficamente y cuidar los bienes comunes"],["🤐","No opinar nunca ni colaborar en las actividades grupales"],["🚪","Ignorar las normas y dañar los bancos del aula"]], 0, "Pista: recordá los principales centros urbanos y poblados de esta zona."),
  ],

};

// 4 pares creíbles de Verdadero/Falso por cada uno de los 26 mundos (AG-24)
export const TF_PAIRS_SOCIALES: Record<number, { v: string; f: string; hint: string }[]> = {
  "1": [
    {
      "v": "La provincia de Santa Cruz limita al norte con la provincia del Chubut.",
      "f": "La provincia de Santa Cruz limita al norte con la provincia de Río Negro.",
      "hint": "Pista: recordá con qué provincia vecina limita Santa Cruz por el paralelo 46° Sur."
    },
    {
      "v": "La Cordillera de los Andes actúa como límite natural al oeste entre Santa Cruz y Chile.",
      "f": "La Cordillera de los Andes se ubica sobre la costa este de Santa Cruz frente al mar.",
      "hint": "Pista: pensá de qué lado de la provincia se eleva la gran cordillera montañosa."
    },
    {
      "v": "La capital de la provincia de Santa Cruz es la ciudad de Río Gallegos.",
      "f": "La capital de la provincia de Santa Cruz es la ciudad de Caleta Olivia.",
      "hint": "Pista: pensá en la ciudad cabecera donde residen las autoridades provinciales."
    },
    {
      "v": "El Mar Argentino baña toda la costa oriental de la provincia de Santa Cruz.",
      "f": "El Océano Pacífico baña de forma directa toda la costa oriental santacruceña.",
      "hint": "Pista: recordá qué masa de agua marina bordea las costas argentinas."
    }
  ],
  "2": [
    {
      "v": "La provincia de Santa Cruz está dividida administrativamente en siete departamentos.",
      "f": "La provincia de Santa Cruz está dividida administrativamente en doce departamentos.",
      "hint": "Pista: recordá el número total de departamentos que conforman el mapa provincial."
    },
    {
      "v": "La ciudad de El Calafate es la cabecera del departamento Lago Argentino.",
      "f": "La ciudad de El Calafate es la cabecera del departamento Magallanes.",
      "hint": "Pista: pensá a qué departamento pertenece la villa turística junto al gran lago."
    },
    {
      "v": "Puerto San Julián es la ciudad cabecera del departamento Magallanes.",
      "f": "Puerto San Julián es la ciudad cabecera del departamento Güer Aike.",
      "hint": "Pista: recordá cuál es la cabecera costera del departamento central de Magallanes."
    },
    {
      "v": "El departamento Güer Aike se encuentra ubicado en el sur del territorio provincial.",
      "f": "El departamento Güer Aike se encuentra ubicado en el límite norte junto a Chubut.",
      "hint": "Pista: pensá en qué zona geográfica provincial se localiza el departamento de la capital."
    }
  ],
  "3": [
    {
      "v": "En las estancias de la meseta santacruceña la principal actividad rural es la ganadería ovina.",
      "f": "En las estancias de la meseta santacruceña la principal actividad rural es el cultivo intensivo de caña de azúcar.",
      "hint": "Pista: pensá en el tipo de ganado tradicional que se cría en los campos patagónicos."
    },
    {
      "v": "Las escuelas rurales con albergue permiten que los niños del campo asistan a clases.",
      "f": "En las zonas rurales de la meseta no existen escuelas y los niños deben viajar todos los días a Buenos Aires.",
      "hint": "Pista: recordá cómo se organiza la escolaridad de las familias en las estancias."
    },
    {
      "v": "Los espacios urbanos concentran comercios, hospitales, escuelas y servicios públicos.",
      "f": "Los espacios urbanos se caracterizan por tener campos abiertos sin tendido de servicios ni caminos.",
      "hint": "Pista: pensá en las diferencias básicas entre el campo abierto y las ciudades."
    },
    {
      "v": "Los mensajes al poblador por radio AM son una vía tradicional de comunicación con el campo.",
      "f": "En los puestos rurales la única vía de comunicación permitida es el telégrafo de señales luminosas.",
      "hint": "Pista: recordá qué medio radial se escucha habitualmente en los puestos alejados."
    }
  ],
  "4": [
    {
      "v": "El relieve de mesetas desciende de forma escalonada desde la cordillera hacia el mar.",
      "f": "El relieve santacruceño está formado por una llanura completamente verde sin elevaciones ni bardas.",
      "hint": "Pista: pensá en cómo cambia la altura del terreno desde el oeste hacia el océano."
    },
    {
      "v": "El cerro Chaltén o Fitz Roy es una de las cumbres más elevadas y emblemáticas de la cordillera.",
      "f": "El cerro Fitz Roy se encuentra ubicado sobre las playas costeras del Golfo San Jorge.",
      "hint": "Pista: recordá en qué sector montañoso se eleva este famoso cerro."
    },
    {
      "v": "Los cañadones son valles profundos y secos labrados por antiguos cursos de agua en la meseta.",
      "f": "Los cañadones son montañas de arena blanda que cambian de lugar con cada brisa marina.",
      "hint": "Pista: pensá en las formas de corte que se observan al cruzar la meseta patagónica."
    },
    {
      "v": "En la costa atlántica santacruceña predominan acantilados rocosos y playas de canto rodado.",
      "f": "Toda la costa santacruceña está formada por densos manglares y pantanos tropicales.",
      "hint": "Pista: recordá el aspecto típico del litoral marítimo patagónico."
    }
  ],
  "5": [
    {
      "v": "El río Santa Cruz nace en el Lago Argentino y desemboca en el Mar Argentino.",
      "f": "El río Santa Cruz nace en el Océano Atlántico y desemboca en la Cordillera de los Andes.",
      "hint": "Pista: pensá desde qué gran lago cordillerano fluyen sus aguas hacia el este."
    },
    {
      "v": "El lago Buenos Aires es compartido entre los territorios de Argentina y Chile.",
      "f": "El lago Buenos Aires es un pequeño espejo de agua artificial creado dentro de la ciudad de Río Gallegos.",
      "hint": "Pista: recordá la ubicación del gran lago binacional del noroeste provincial."
    },
    {
      "v": "Los ríos patagónicos que nacen en la cordillera tienen régimen de deshielo primaveral.",
      "f": "Los ríos santacruceños se alimentan exclusivamente de lluvias tropicales en pleno verano.",
      "hint": "Pista: pensá en el origen de las aguas que bajan de las altas cumbres andinas."
    },
    {
      "v": "Una ría es un valle fluvial que ha sido invadido por las aguas marinas durante las mareas.",
      "f": "Una ría es una montaña de roca sólida que no tiene contacto alguno con cursos de agua.",
      "hint": "Pista: recordá cómo se forman las rías costeras como la de Puerto Deseado."
    }
  ],
  "6": [
    {
      "v": "El clima de la meseta santacruceña se caracteriza por ser frío, árido y muy ventoso.",
      "f": "La meseta santacruceña posee un clima cálido, selvático y con precipitaciones torrenciales constantes.",
      "hint": "Pista: pensá en las temperaturas y la humedad habituales en nuestra estepa."
    },
    {
      "v": "Los vientos dominantes en la provincia de Santa Cruz soplan principalmente desde el cuadrante oeste.",
      "f": "Los vientos más frecuentes en Santa Cruz soplan suavemente desde el norte tropical.",
      "hint": "Pista: recordá de qué punto cardinal provienen las fuertes ráfagas patagónicas."
    },
    {
      "v": "La amplitud térmica en la estepa significa que hay gran diferencia de temperatura entre el día y la noche.",
      "f": "En la meseta santacruceña la temperatura permanece fija en veinte grados durante todo el año.",
      "hint": "Pista: pensá en cómo varía la sensación térmica a lo largo de una misma jornada."
    },
    {
      "v": "La cordillera detiene los vientos húmedos del Pacífico provocando que lleguen secos a la meseta.",
      "f": "La cordillera absorbe todo el calor del Sol impidiendo que sople viento en la provincia.",
      "hint": "Pista: recordá el efecto de barrera que ejercen las altas montañas sobre las nubes."
    }
  ],
  "7": [
    {
      "v": "El Parque Nacional Los Glaciares fue declarado Patrimonio de la Humanidad por la UNESCO.",
      "f": "El Parque Nacional Los Glaciares es un área privada destinada a la cría comercial de ganado vacuno.",
      "hint": "Pista: pensá en el reconocimiento internacional que protege a nuestros campos de hielo."
    },
    {
      "v": "El Parque Nacional Monte León protege un extenso sector de costa marina y colonias de fauna.",
      "f": "El Parque Nacional Monte León se ubica en las altas cumbres nevadas de la cordillera andina.",
      "hint": "Pista: recordá qué ambiente provincial protege este parque nacional creado sobre el mar."
    },
    {
      "v": "Los guardaparques tienen la función de conservar la naturaleza y orientar a los visitantes.",
      "f": "En los parques nacionales está permitido cazar animales nativos y cortar leña libremente.",
      "hint": "Pista: pensá en las tareas de protección y cuidado que realizan las autoridades del parque."
    },
    {
      "v": "El Parque Nacional Perito Moreno protege lagos cristalinos y poblaciones de huemules y guanacos.",
      "f": "El Parque Nacional Perito Moreno se localiza en el centro de la ciudad de Río Gallegos.",
      "hint": "Pista: recordá en qué sector del noroeste cordillerano se encuentra este parque agreste."
    }
  ],
  "8": [
    {
      "v": "El viento patagónico es un recurso natural renovable que se utiliza para generar energía eólica.",
      "f": "El viento patagónico es un recurso no renovable que se agota por completo después de cada tormenta.",
      "hint": "Pista: pensá si la fuerza del viento se termina al usarla o si vuelve a soplar."
    },
    {
      "v": "El agua dulce de ríos y glaciares es un recurso vital indispensable para la vida y la producción.",
      "f": "El agua de los glaciares santacruceños es considerada un residuo industrial peligroso.",
      "hint": "Pista: recordá la importancia del agua pura que desciende de los Andes."
    },
    {
      "v": "El suelo de la estepa requiere un uso responsable para evitar su pérdida por erosión.",
      "f": "El suelo patagónico es infinito y no sufre ningún daño aunque se sobrecargue con miles de animales.",
      "hint": "Pista: pensá en cómo afecta el viento al suelo si se pierde la vegetación protectora."
    },
    {
      "v": "Los bosques andinos son recursos renovables si se gestionan de manera sustentable y controlada.",
      "f": "Los árboles de lenga crecen de un día para el otro alcanzando su altura máxima en pocas semanas.",
      "hint": "Pista: recordá los tiempos de crecimiento y regeneración de los bosques nativos."
    }
  ],
  "9": [
    {
      "v": "La Cuenca del Golfo San Jorge en el norte santacruceño es una histórica zona productora de petróleo.",
      "f": "En la provincia de Santa Cruz nunca se descubrió petróleo ni gas natural en su territorio.",
      "hint": "Pista: pensá en las actividades pioneras que dieron origen a ciudades como Caleta Olivia."
    },
    {
      "v": "El petróleo y el gas natural son recursos fósiles no renovables formados a lo largo de millones de años.",
      "f": "El petróleo se regenera en pocos días mezclando agua con arena en la superficie del suelo.",
      "hint": "Pista: recordá el tiempo geológico necesario para la formación de hidrocarburos."
    },
    {
      "v": "Las Heras y Pico Truncado son localidades del norte provincial vinculadas a la actividad hidrocarburífera.",
      "f": "Las Heras es una ciudad pesquera ubicada en una isla sobre el Océano Pacífico.",
      "hint": "Pista: pensá en las ciudades santacruceñas del norte mesetario y su trabajo principal."
    },
    {
      "v": "Los gasoductos transportan el gas natural desde los yacimientos hacia los centros de consumo.",
      "f": "El gas natural se transporta exclusivamente en baldes abiertos a través de caminos de tierra.",
      "hint": "Pista: recordá las cañerías subterráneas que conducen el gas por todo el país."
    }
  ],
  "10": [
    {
      "v": "En Río Turbio se explotan los yacimientos de carbón mineral más importantes de la Argentina.",
      "f": "El yacimiento de Río Turbio es famoso por la extracción de esmeraldas y diamantes marinos.",
      "hint": "Pista: pensá en el combustible fósil sólido característico de la cuenca carbonífera."
    },
    {
      "v": "Cerro Vanguardia es un importante yacimiento de minería metalífera de oro y plata en Santa Cruz.",
      "f": "En la meseta central santacruceña no existen rocas con contenido de minerales metalíferos.",
      "hint": "Pista: recordá qué metales preciosos se extraen en los yacimientos del centro provincial."
    },
    {
      "v": "Los mineros trabajan bajo estrictas normas de seguridad para prevenir accidentes en los socavones.",
      "f": "En las minas subterráneas de carbón no se requiere ventilación ni uso de cascos protectores.",
      "hint": "Pista: pensá en los recaudos necesarios para trabajar en el interior de una mina."
    },
    {
      "v": "El carbón de Río Turbio se traslada por ferrocarril hasta el puerto de Punta Loyola para su despacho.",
      "f": "El carbón de Río Turbio se traslada en canoas por los ríos cordilleranos hacia el norte.",
      "hint": "Pista: recordá el tendido ferroviario que une la mina con el puerto atlántico."
    }
  ],
  "11": [
    {
      "v": "Puerto Deseado cuenta con un puerto de ultramar destacado por la descarga y procesamiento pesquero.",
      "f": "En los puertos marítimos de Santa Cruz está prohibido el atraque de barcos de pesca comercial.",
      "hint": "Pista: pensá en la relevancia de la pesca de calamar y merluza en las costas patagónicas."
    },
    {
      "v": "El turismo internacional visita El Calafate para conocer el Glaciar Perito Moreno.",
      "f": "El Calafate es una localidad industrial donde no se reciben turistas en ninguna época del año.",
      "hint": "Pista: recordá qué atractivo natural convoca a miles de visitantes a orillas del lago."
    },
    {
      "v": "El Chaltén es reconocida oficialmente como la Capital Nacional del Trekking.",
      "f": "En El Chaltén está prohibido caminar por los senderos de montaña debido a la falta de cerros.",
      "hint": "Pista: pensá en las actividades de senderismo que se practican al pie del Fitz Roy."
    },
    {
      "v": "Los servicios turísticos comprenden hotelería, gastronomía, transporte y guiadas especializadas.",
      "f": "La actividad turística solo consiste en la venta de semillas de trigo para la siembra en el campo.",
      "hint": "Pista: recordá qué servicios necesitan los viajeros al llegar a una ciudad."
    }
  ],
  "12": [
    {
      "v": "El sobrepastoreo ovino excesivo debilita la cobertura vegetal y favorece la desertificación.",
      "f": "Tener una cantidad desmedida de animales en un potrero mejora la fertilidad natural del suelo.",
      "hint": "Pista: pensá qué sucede con los pastos si los animales consumen las raíces sin descanso."
    },
    {
      "v": "El viento patagónico arrastra la capa superficial fértil de la tierra si el suelo queda desprotegido.",
      "f": "El viento sobre la meseta ayuda a plantar árboles de forma espontánea sin necesidad de agua.",
      "hint": "Pista: recordá cómo actúa la erosión eólica sobre terrenos sin vegetación."
    },
    {
      "v": "El pastoreo rotativo permite que los pastizales naturales descansen y recuperen sus semillas.",
      "f": "Para cuidar el suelo de la meseta lo más conveniente es no permitir nunca el crecimiento de plantas.",
      "hint": "Pista: pensá en las técnicas de manejo ganadero que protegen la salud de los campos."
    },
    {
      "v": "La basura plástica arrojada al ambiente puede viajar largas distancias empujada por el viento.",
      "f": "Las bolsas de plástico se disuelven de inmediato al contacto con el aire sin dejar residuos.",
      "hint": "Pista: recordá la durabilidad de los materiales plásticos y el cuidado que requieren."
    }
  ],
  "13": [
    {
      "v": "Los Aonikenk eran cazadores recolectores nómadas que recorrían la meseta patagónica.",
      "f": "Los Aonikenk vivían en grandes ciudades de piedra con edificios de varios pisos.",
      "hint": "Pista: pensá en el estilo de vida móvil que tenían siguiendo a los animales de caza."
    },
    {
      "v": "El guanaco y el choique eran animales fundamentales para la alimentación y abrigo de los Aonikenk.",
      "f": "Los Aonikenk obtenían todos sus alimentos sembrando maíz y trigo en campos cultivados.",
      "hint": "Pista: recordá qué especies autóctonas cazaban en las grandes llanuras de la meseta."
    },
    {
      "v": "El toldo de cueros desmontable (kau) permitía armar y trasladar la vivienda con rapidez.",
      "f": "Los Aonikenk construían aldeas fijas de piedra con murallas defensivas permanentes.",
      "hint": "Pista: pensá en las ventajas de una vivienda transportable para un pueblo nómada."
    },
    {
      "v": "El quillango era una manta confeccionada con pieles de guanaco cosidas para protegerse del frío.",
      "f": "Los Aonikenk vestían únicamente trajes de seda importados de otros continentes.",
      "hint": "Pista: recordá el abrigo tradicional elaborado con cueros de animales cazados."
    }
  ],
  "14": [
    {
      "v": "Los Selk'nam habitaban la Isla Grande de Tierra del Fuego como cazadores pedestres del guanaco.",
      "f": "Los Selk'nam eran expertos navegantes que pasaban toda su vida en alta mar sin pisar tierra.",
      "hint": "Pista: recordá cómo se desplazaban a pie los cazadores del interior fueguino."
    },
    {
      "v": "Los Yámanas eran un pueblo canoero que navegaba los canales fueguinos recolectando mariscos.",
      "f": "Los Yámanas vivían en chozas construidas sobre las copas de palmeras tropicales.",
      "hint": "Pista: pensá en la forma de vida de las familias que vivían a bordo de sus canoas."
    },
    {
      "v": "En el interior de sus canoas de corteza los Yámanas mantenían siempre un pequeño fogón encendido.",
      "f": "Los Yámanas tenían prohibido encender fuego porque creían que el calor destruía el agua.",
      "hint": "Pista: recordá cómo hacían los navegantes australes para calentarse en el mar helado."
    },
    {
      "v": "La ceremonia del Hain era un rito de paso fundamental en la cultura espiritual Selk'nam.",
      "f": "Los Selk'nam no tenían ceremonias ni celebraciones comunitarias de ningún tipo.",
      "hint": "Pista: pensá en las tradicionales máscaras pintadas utilizadas en sus ritos sagrados."
    }
  ],
  "15": [
    {
      "v": "El kultrún es un instrumento de percusión ceremonial sagrado de la cultura mapuche.",
      "f": "El kultrún es una herramienta de hierro utilizada exclusivamente para arar campos de trigo.",
      "hint": "Pista: recordá qué objeto representa la cosmovisión y el sonido en las ceremonias."
    },
    {
      "v": "El telar tradicional (huitral) se utiliza para elaborar tejidos de lana con tintes naturales.",
      "f": "En la cultura mapuche nunca se practicó el tejido ni se utilizó la lana para vestimenta.",
      "hint": "Pista: pensá en los hermosos ponchos y mantas tejidos artesanalmente en la región."
    },
    {
      "v": "El We Tripantu celebra el año nuevo mapuche durante el solsticio de invierno en junio.",
      "f": "El We Tripantu es una festividad que se celebra únicamente en pleno verano durante el mes de enero.",
      "hint": "Pista: recordá en qué momento del invierno renace la naturaleza según su calendario."
    },
    {
      "v": "La Machi cumple un rol esencial como guía espiritual y médica en la comunidad mapuche.",
      "f": "En la comunidad mapuche no existían personas encargadas de la salud ni de la medicina natural.",
      "hint": "Pista: pensá en la autoridad comunitaria que conoce las plantas medicinales y ritos."
    }
  ],
  "16": [
    {
      "v": "Los Diaguitas construían terrazas de cultivo en las laderas de los cerros para sembrar maíz.",
      "f": "Los Diaguitas vivían en llanuras inundadas y solo comían peces de mar congelados.",
      "hint": "Pista: recordá cómo aprovechaban las pendientes andinas del Noroeste para la agricultura."
    },
    {
      "v": "Los pucarás eran aldeas fortificadas de piedra construidas en lugares altos para la defensa.",
      "f": "Los pucarás eran barcos de madera utilizados para cruzar ríos caudalosos.",
      "hint": "Pista: pensá en las construcciones defensivas levantadas sobre las cumbres de los valles."
    },
    {
      "v": "La alfarería diaguita se destacaba por urnas de cerámica decoradas con figuras geométricas.",
      "f": "Los Diaguitas no conocían el modelado de barro ni fabricaban vasijas para guardar alimentos.",
      "hint": "Pista: recordá las piezas arqueológicas de cerámica encontradas en el Noroeste."
    },
    {
      "v": "Los Diaguitas canalizaban el agua de deshielo mediante acequias de riego para sus cultivos.",
      "f": "Los Diaguitas dependían exclusivamente de lluvias torrenciales diarias para regar sus campos.",
      "hint": "Pista: pensá en las ingeniosas obras hidráulicas que permitían cultivar en zonas secas."
    }
  ],
  "17": [
    {
      "v": "El Camino del Inca (Qhapaq Ñan) unía extensos territorios a través de la Cordillera de los Andes.",
      "f": "El Imperio Inca no tenía caminos y las ciudades estaban totalmente aisladas entre sí.",
      "hint": "Pista: pensá en la gran red vial de piedra que comunicaba a todo el imperio."
    },
    {
      "v": "Los chasquis eran jóvenes mensajeros que recorrían a pie el imperio en un sistema de postas.",
      "f": "Los chasquis eran soldados que viajaban en carretas tiradas por caballos traídos de España.",
      "hint": "Pista: recordá cómo se transmitían las noticias con rapidez antes de la llegada de los caballos."
    },
    {
      "v": "El quipu era un sistema de cuerdas anudadas que servía para llevar registros y cuentas.",
      "f": "El quipu era una moneda de oro redonda con la que se compraban tierras en el mercado.",
      "hint": "Pista: pensá en el instrumento con nudos de colores que usaban para contar y registrar."
    },
    {
      "v": "La capital del Imperio Inca y centro de su gobierno se encontraba en la ciudad de Cusco.",
      "f": "La capital del Imperio Inca se localizaba sobre las playas costeras del Río de la Plata.",
      "hint": "Pista: recordá la ciudad andina sagrada considerada el centro del mundo incaico."
    }
  ],
  "18": [
    {
      "v": "El artículo 75 inciso 17 de la Constitución Nacional reconoce la preexistencia étnica indígena.",
      "f": "La Constitución Nacional actual prohíbe el uso de lenguas indígenas en todo el territorio.",
      "hint": "Pista: pensá en la reforma constitucional de 1994 y los derechos consagrados para las comunidades."
    },
    {
      "v": "La educación intercultural bilingüe busca que los niños aprendan su lengua originaria y el español.",
      "f": "En las escuelas argentinas está legalmente prohibido mencionar la historia de los pueblos nativos.",
      "hint": "Pista: recordá los programas educativos que rescatan la riqueza lingüística de los pueblos."
    },
    {
      "v": "Las comunidades indígenas tienen derecho a la personería jurídica y a la posesión de sus tierras.",
      "f": "Las comunidades indígenas no tienen ningún derecho reconocido en las leyes argentinas vigentes.",
      "hint": "Pista: pensá en las garantías que amparan la propiedad comunitaria tradicional."
    },
    {
      "v": "El 12 de octubre se conmemora en Argentina el Día del Respeto a la Diversidad Cultural.",
      "f": "El 12 de octubre se celebra el día en que todos los idiomas originarios dejaron de existir.",
      "hint": "Pista: recordá el sentido actual de esta fecha en el calendario escolar nacional."
    }
  ],
  "19": [
    {
      "v": "La brújula y el astrolabio fueron instrumentos clave que ayudaron a los marinos a orientarse.",
      "f": "Los navegantes del siglo XV se orientaban en altamar utilizando mapas satelitales en computadoras.",
      "hint": "Pista: pensá en los adelantos técnicos de la navegación de aquella época histórica."
    },
    {
      "v": "Las carabelas eran barcos ágiles con velas combinadas que permitían navegar contra el viento.",
      "f": "Las expediciones del siglo XV viajaban en enormes transatlánticos con motores de combustión interna.",
      "hint": "Pista: recordá qué tipo de embarcaciones a vela cruzaron los océanos por primera vez."
    },
    {
      "v": "Los europeos buscaban rutas marítimas hacia Oriente tras el bloqueo comercial en el Mediterráneo.",
      "f": "Los viajes del siglo XV tenían como único objetivo encontrar reservas de petróleo en la Antártida.",
      "hint": "Pista: pensá en el comercio de especias y sedas que motivó a los navegantes."
    },
    {
      "v": "Cristóbal Colón llegó a tierras americanas en octubre de 1492 creyendo haber arribado a Asia.",
      "f": "Cristóbal Colón sabía con total exactitud que llegaba a un nuevo continente llamado América.",
      "hint": "Pista: recordá lo que pensaba el almirante genovés sobre el destino final de su ruta."
    }
  ],
  "20": [
    {
      "v": "La flota de Magallanes invernó durante cinco meses en Puerto San Julián en el año 1520.",
      "f": "Magallanes pasó todo el invierno de 1520 descansando en un hotel de la ciudad de Ushuaia.",
      "hint": "Pista: pensá en la histórica bahía santacruceña donde fondearon las naves españolas."
    },
    {
      "v": "En Puerto San Julián se celebró la primera misa católica registrada en territorio argentino.",
      "f": "La expedición de Magallanes nunca tuvo contacto con la costa ni celebró ceremonias en Santa Cruz.",
      "hint": "Pista: recordá el acontecimiento religioso documentado en abril de 1520 en San Julián."
    },
    {
      "v": "La nao Victoria, comandada por Juan Sebastián Elcano, completó la primera vuelta al mundo.",
      "f": "Ningún barco de la expedición de Magallanes logró regresar con vida a los puertos de Europa.",
      "hint": "Pista: pensá en la única nave que consiguió circunnavegar el planeta por primera vez."
    },
    {
      "v": "El estrecho descubierto por Magallanes comunica las aguas del Atlántico con las del Pacífico.",
      "f": "El Estrecho de Magallanes es un río dulce que cruza la provincia de Córdoba de este a oeste.",
      "hint": "Pista: recordá qué dos grandes océanos une este célebre paso marítimo austral."
    }
  ],
  "21": [
    {
      "v": "Las ciudades coloniales hispanoamericanas se trazaban siguiendo un plano regular en damero.",
      "f": "Las ciudades coloniales se construían con calles circulares sin ninguna plaza ni manzana recta.",
      "hint": "Pista: pensá en la cuadrícula similar a un tablero de ajedrez que organizaba las calles."
    },
    {
      "v": "Alrededor de la Plaza Mayor se ubicaban los edificios clave: el Cabildo, la Iglesia y la gobernación.",
      "f": "En la época colonial los edificios de gobierno se construían escondidos en el medio del campo.",
      "hint": "Pista: recordá qué construcciones rodeaban el centro cívico de las ciudades coloniales."
    },
    {
      "v": "Santiago del Estero es considerada la 'Madre de Ciudades' por las expediciones que salieron de ella.",
      "f": "La primera ciudad fundada en el actual territorio argentino fue la ciudad de Río Gallegos.",
      "hint": "Pista: pensá en la histórica ciudad del Noroeste desde donde se fundaron otras poblaciones."
    },
    {
      "v": "La Corriente del Oeste proveniente de Chile fundó las ciudades de Mendoza, San Juan y San Luis.",
      "f": "Las ciudades de la región de Cuyo fueron fundadas por navegantes llegados por el río Paraná.",
      "hint": "Pista: recordá de qué territorio cruzaron la cordillera los fundadores de la región cuyana."
    }
  ],
  "22": [
    {
      "v": "La sociedad colonial era estamental y muy desigual, con mayores privilegios para los españoles peninsulares.",
      "f": "En la sociedad colonial todas las personas gozaban exactamente de los mismos derechos y cargos públicos.",
      "hint": "Pista: pensá en la marcada jerarquía social según el origen de nacimiento."
    },
    {
      "v": "Los criollos eran hijos de españoles nacidos en América y tenían ciertas limitaciones para los altos cargos.",
      "f": "Los criollos eran personas traídas de África para trabajar obligatoriamente en las minas.",
      "hint": "Pista: recordá el nombre que recibían los descendientes de españoles nacidos en estas tierras."
    },
    {
      "v": "Las personas africanas esclavizadas realizaban tareas pesadas y carecían por completo de libertad.",
      "f": "En el Río de la Plata colonial la esclavitud nunca existió y todos recibían salarios justos.",
      "hint": "Pista: pensá en la dura situación de los hombres y mujeres sometidos al régimen de esclavitud."
    },
    {
      "v": "El Cabildo era la institución colonial encargada del gobierno y la administración de la ciudad.",
      "f": "El Cabildo era un teatro exclusivo destinado únicamente a espectáculos musicales de ópera.",
      "hint": "Pista: recordá la institución municipal que se ocupaba de la justicia, el orden y los vecinos."
    }
  ],
  "23": [
    {
      "v": "La mina de plata del Cerro Rico de Potosí fue el centro económico más importante del Virreinato.",
      "f": "En Potosí se extraía exclusivamente petróleo crudo para abastecer a los autos de la época.",
      "hint": "Pista: pensá en el valioso metal que convirtió a Potosí en una ciudad inmensamente rica."
    },
    {
      "v": "Las mulas criadas en las pampas eran fundamentales para el transporte de cargas en las montañas.",
      "f": "En el circuito a Potosí las cargas pesadas se trasladaban en camiones de carga de gran porte.",
      "hint": "Pista: recordá qué animal resistente se utilizaba para subir mercancías por los senderos andinos."
    },
    {
      "v": "La feria de Sumalao en Salta era el gran punto de encuentro para la compra y venta de mulas.",
      "f": "En la época colonial estaba terminantemente prohibido comerciar animales entre las provincias.",
      "hint": "Pista: pensá en la famosa feria del norte adonde llegaban tropas de animales de todo el país."
    },
    {
      "v": "Cuyo proveía vino y aguardiente, y Tucumán carretas y maderas para el mercado potosino.",
      "f": "Potosí no compraba nada a otras regiones porque producía todos sus alimentos y herramientas.",
      "hint": "Pista: recordá cómo las distintas economías regionales abastecían a la gran ciudad minera."
    }
  ],
  "24": [
    {
      "v": "Las misiones jesuíticas organizaron pueblos donde los guaraníes aprendieron música, oficios y agricultura.",
      "f": "En las misiones jesuíticas estaba terminantemente prohibido enseñar música o ejecutar instrumentos.",
      "hint": "Pista: pensá en los talleres de arte, imprenta y cultivo que florecieron en las reducciones."
    },
    {
      "v": "El consumo de la yerba mate fue un saber originario guaraní que adoptó toda la sociedad colonial.",
      "f": "La costumbre de tomar mate surgió en Europa y fue introducida por comerciantes en el siglo diecinueve.",
      "hint": "Pista: recordá el origen ancestral de nuestra infusión nacional más compartida."
    },
    {
      "v": "El mestizaje cultural integró palabras de origen quechua y guaraní en el habla castellana cotidiana.",
      "f": "En el idioma castellano actual no existe ninguna palabra proveniente de pueblos originarios.",
      "hint": "Pista: pensá en términos comunes como cancha, poncho, choclo o carpincho."
    },
    {
      "v": "En 1767 la corona española ordenó la expulsión de los sacerdotes jesuitas de todos sus dominios.",
      "f": "Los jesuitas gobernaron América de forma ininterrumpida hasta la llegada del siglo veintiuno.",
      "hint": "Pista: recordá la decisión real que obligó a los sacerdotes de la Compañía de Jesús a marcharse."
    }
  ],
  "25": [
    {
      "v": "La Constitución Nacional sancionada en 1853 es la ley suprema de la República Argentina.",
      "f": "La Constitución Nacional es un reglamento escolar que solo tiene validez dentro de las aulas.",
      "hint": "Pista: pensá en la norma fundamental que organiza las instituciones y derechos del país."
    },
    {
      "v": "El gobierno argentino adopta la forma representativa, republicana y federal.",
      "f": "La República Argentina está gobernada por un rey hereditario que concentra todo el poder.",
      "hint": "Pista: recordá los tres principios básicos de nuestro sistema de gobierno nacional."
    },
    {
      "v": "El Poder Legislativo nacional reside en el Congreso, compuesto por Diputados y Senadores.",
      "f": "Las leyes nacionales son dictadas y sancionadas únicamente por jueces de tribunales locales.",
      "hint": "Pista: pensá en el órgano colegiado donde se debaten y aprueban las normas del país."
    },
    {
      "v": "La división de poderes garantiza que ninguna autoridad gobierne sin controles ni contrapesos.",
      "f": "En una república un solo gobernante puede cambiar la Constitución sin consultar a nadie.",
      "hint": "Pista: recordá para qué se dividen las funciones entre Ejecutivo, Legislativo y Judicial."
    }
  ],
  "26": [
    {
      "v": "El Poder Ejecutivo de la provincia de Santa Cruz es ejercido por el Gobernador.",
      "f": "El Poder Ejecutivo de Santa Cruz es ejercido por un presidente extranjero designado por sorteo.",
      "hint": "Pista: pensá en la máxima autoridad elegida por los ciudadanos para administrar la provincia."
    },
    {
      "v": "La Legislatura de la provincia de Santa Cruz es un cuerpo unicameral de Diputados.",
      "f": "En Santa Cruz no existen diputados ni leyes provinciales que organicen la convivencia.",
      "hint": "Pista: recordá cómo está conformada la cámara legislativa de nuestra provincia."
    },
    {
      "v": "Los municipios están encabezados por un Intendente y cuentan con un Concejo Deliberante.",
      "f": "En las ciudades santacruceñas los intendentes son elegidos para gobernar durante cien años.",
      "hint": "Pista: pensá en las autoridades locales que gestionan las obras y servicios de cada ciudad."
    },
    {
      "v": "La Convención sobre los Derechos del Niño garantiza el derecho a la identidad, educación y salud.",
      "f": "Los derechos de los niños se aplican únicamente a quienes viven en grandes ciudades del mundo.",
      "hint": "Pista: recordá el tratado internacional que protege a todas las infancias sin distinción."
    }
  ]
};

export function getTfActivity(n: number, id: string, skills: string[]): ActivitySpec {
  const pool = TF_PAIRS_SOCIALES[n] ?? TF_PAIRS_SOCIALES[1];
  const item = pickOne(pool);
  return makeVF(id, item.v, item.f, item.hint, skills);
}

// Actividades extra por mundo (al menos 4 por mundo: 2 clasificar, 1 ordenar, 1 V/F)
export function getExtraSociales(n: number): ActivitySpec[] {
  switch (n) {
    case 1:
      return [
        makeClassify("s1-ex-0", "Clasificá los límites geográficos de Santa Cruz:", ["Límite terrestre / provincial","Límite marítimo"], [{"label":"Chubut al norte","cat":0},{"label":"Chile al oeste y sur","cat":0},{"label":"Mar Argentino al este","cat":1},{"label":"Océano Atlántico Sur","cat":1}], "Pista: al este limita con el Mar Argentino; al norte con Chubut y al oeste con Chile.", ["s4-mapa-sc"]),
        makeOrder("s1-ex-1", "Ordená de NORTE a SUR estas localidades sobre el mapa santacruceño:", ["Caleta Olivia en el golfo San Jorge","Puerto San Julián en la costa central","Río Gallegos en el sur provincial"], "Pista: Caleta Olivia está al norte, San Julián en el centro y Río Gallegos al sur.", ["s4-mapa-sc"]),
        makeClassify("s1-ex-2", "Clasificá las rutas santacruceñas según su trazado:", ["Ruta Nacional 3 (Costera)","Ruta Nacional 40 (Cordillerana)"], [{"label":"Bordea la costa atlántica y une Caleta Olivia con Río Gallegos","cat":0},{"label":"Recorre el oeste andino al pie de la cordillera","cat":1},{"label":"Pasa por Puerto San Julián y Comandante Luis Piedra Buena","cat":0},{"label":"Comienza su trazado en Cabo Vírgenes y sigue hacia el norte","cat":1}], "Pista: la Ruta 3 corre junto al mar y la Ruta 40 junto a las montañas.", ["s4-mapa-sc"]),
        getTfActivity(1, "s1-ex-3", ["s4-mapa-sc"]),
      ];
    case 2:
      return [
        makeClassify("s2-ex-0", "Clasificá las localidades según su departamento:", ["Güer Aike","Lago Argentino"], [{"label":"Río Gallegos","cat":0},{"label":"El Calafate","cat":1},{"label":"Río Turbio","cat":0},{"label":"El Chaltén","cat":1}], "Pista: Río Gallegos y Río Turbio en Güer Aike; El Calafate y El Chaltén en Lago Argentino.", ["s4-departamentos-sc"]),
        makeOrder("s2-ex-1", "Ordená alfabéticamente estos departamentos santacruceños:", ["Corpen Aike","Deseado","Güer Aike","Magallanes"], "Pista: el orden alfabético comienza con Corpen Aike y sigue con Deseado, Güer Aike y Magallanes.", ["s4-departamentos-sc"]),
        makeClassify("s2-ex-2", "Clasificá las ciudades santacruceñas según su ubicación este-oeste:", ["Ciudades de la Costa Atlántica","Ciudades de la Zona Cordillerana"], [{"label":"Puerto Deseado y Caleta Olivia","cat":0},{"label":"El Calafate y El Chaltén","cat":1},{"label":"Puerto San Julián","cat":0},{"label":"Río Turbio y Los Antiguos","cat":1}], "Pista: pensá cuáles están junto al mar y cuáles al pie de la cordillera.", ["s4-departamentos-sc"]),
        getTfActivity(2, "s2-ex-3", ["s4-departamentos-sc"]),
      ];
    case 3:
      return [
        makeClassify("s3-ex-0", "Clasificá las características de los espacios de Santa Cruz:", ["Espacio Urbano","Espacio Rural"], [{"label":"Río Gallegos y Caleta Olivia","cat":0},{"label":"Puestos de estancia y galpones de esquila","cat":1},{"label":"Redes comerciales, hospitales y escuelas secundarias","cat":0},{"label":"Arreo de ovejas y aislamiento por nieve en invierno","cat":1}], "Pista: las ciudades concentran servicios y comercios; el campo reúne estancias y ganado.", ["s4-urbano-rural"]),
        makeOrder("s3-ex-1", "Ordená estas ciudades santacruceñas de MAYOR a MENOR población aproximada:", ["Río Gallegos","Caleta Olivia","El Chaltén"], "Pista: Río Gallegos es la más poblada, seguida de Caleta Olivia y luego El Chaltén.", ["s4-urbano-rural"]),
        makeClassify("s3-ex-2", "Clasificá los trabajos según el ámbito en que se realizan:", ["Trabajos del Ámbito Rural","Trabajos del Ámbito Urbano"], [{"label":"Esquilador de comparsa en el galpón","cat":0},{"label":"Empleado de comercio en el centro","cat":1},{"label":"Puestero que recorre los cuadros a caballo","cat":0},{"label":"Médico en el hospital regional","cat":1}], "Pista: esquiladores y puesteros en el campo; comerciantes y médicos en la ciudad.", ["s4-urbano-rural"]),
        getTfActivity(3, "s3-ex-3", ["s4-urbano-rural"]),
      ];
    case 4:
      return [
        makeClassify("s4-ex-0", "Clasificá las geoformas de Santa Cruz:", ["Relieve de Montaña / Cordillera","Relieve de Meseta y Costa"], [{"label":"Cerro Fitz Roy y cordones andinos","cat":0},{"label":"Mesetas escalonadas y cañadones","cat":1},{"label":"Glaciares y valles glaciarios","cat":0},{"label":"Acantilados marinos y restingas","cat":1}], "Pista: cerros y glaciares al oeste andino; mesetas, cañadones y acantilados al centro y este.", ["s4-relieve-sc"]),
        makeOrder("s4-ex-1", "Ordená las franjas de relieve santacruceñas de OESTE a ESTE:", ["Cordillera andina con picos nevados y bosques","Mesetas patagónicas escalonadas y cañadones","Costa marítima con acantilados y rías"], "Pista: al oeste la cordillera, en el centro las mesetas y al este la costa marina.", ["s4-relieve-sc"]),
        makeClassify("s4-ex-2", "Clasificá las geoformas costeras y mesetarias:", ["Geoformas de la Costa Marina","Geoformas de la Meseta Interior"], [{"label":"Acantilados sobre el mar y restingas","cat":0},{"label":"Bardas y cañadones secos","cat":1},{"label":"Rías con entrada de agua salada","cat":0},{"label":"Mesetas basálticas escalonadas","cat":1}], "Pista: acantilados y rías en el litoral; bardas y mesetas en el interior.", ["s4-relieve-sc"]),
        getTfActivity(4, "s4-ex-3", ["s4-relieve-sc"]),
      ];
    case 5:
      return [
        makeClassify("s5-ex-0", "Clasificá los cuerpos de agua de Santa Cruz:", ["Ríos Provinciales","Grandes Lagos Glaciarios"], [{"label":"Río Santa Cruz","cat":0},{"label":"Lago Argentino","cat":1},{"label":"Río Deseado","cat":0},{"label":"Lago Viedma","cat":1},{"label":"Río Gallegos","cat":0},{"label":"Lago San Martín","cat":1}], "Pista: los ríos transportan corrientes hacia el mar; los lagos son espejos de agua.", ["s4-cuencas-lagos"]),
        makeOrder("s5-ex-1", "Ordená el recorrido del agua en la cuenca del Río Santa Cruz de CORDILLERA a MAR:", ["Nacimiento en los glaciares andinos y acumulación en el Lago Argentino","Recorrido del Río Santa Cruz a través de la meseta esteparia","Desembocadura en el estuario de Puerto Santa Cruz hacia el Mar Argentino"], "Pista: comienza en el lago cordillerano, recorre la meseta y llega al océano Atlántico.", ["s4-cuencas-lagos"]),
        makeClassify("s5-ex-2", "Clasificá los lagos santacruceños según su cuenca o ubicación:", ["Lagos del Parque Nacional Los Glaciares","Lagos del Centro-Norte Provincial"], [{"label":"Lago Argentino","cat":0},{"label":"Lago Buenos Aires","cat":1},{"label":"Lago Viedma","cat":0},{"label":"Lago San Martín y Lago Cardiel","cat":1}], "Pista: Argentino y Viedma alimentan los grandes glaciares del sur.", ["s4-cuencas-lagos"]),
        getTfActivity(5, "s5-ex-3", ["s4-cuencas-lagos"]),
      ];
    case 6:
      return [
        makeClassify("s6-ex-0", "Clasificá las características climáticas según la zona provincial:", ["Cordillera Andina (Oeste)","Meseta Central (Estepa)"], [{"label":"Precipitaciones abundantes en lluvia y nieve","cat":0},{"label":"Lluvias escasas menores a 300 mm anuales","cat":1},{"label":"Presencia de frondosos bosques húmedos","cat":0},{"label":"Gran amplitud térmica y vientos intensos y secos","cat":1}], "Pista: la cordillera es húmeda y con bosques; la meseta es árida, fría y ventosa.", ["s4-clima-arido"]),
        makeOrder("s6-ex-1", "Ordená la sucesión anual de las cuatro estaciones a partir del verano:", ["Verano con días largos y temperaturas templadas","Otoño con descenso de temperatura y primeras heladas","Invierno con frío riguroso, escarcha y nevadas","Primavera con deshielos y fuertes vientos del oeste"], "Pista: verano, otoño, invierno y primavera se suceden en ese orden.", ["s4-clima-arido"]),
        makeClassify("s6-ex-2", "Clasificá las condiciones meteorológicas según la estación:", ["Clima de Invierno en la Estepa","Clima de Verano en la Estepa"], [{"label":"Heladas frecuentes y temperaturas bajo cero","cat":0},{"label":"Días largos con temperaturas templadas","cat":1},{"label":"Escarcha matinal y nieve en los campos","cat":0},{"label":"Vientos secos del oeste y sol intenso","cat":1}], "Pista: frío y escarcha en invierno; sol y calor templado en verano.", ["s4-clima-arido"]),
        getTfActivity(6, "s6-ex-3", ["s4-clima-arido"]),
      ];
    case 7:
      return [
        makeClassify("s7-ex-0", "Clasificá los riesgos naturales patagónicos según su origen:", ["Riesgos Climáticos / Meteorológicos","Riesgos Geológicos / Volcánicos"], [{"label":"Nevadas extraordinarias y viento blanco","cat":0},{"label":"Cenizas volcánicas del volcán Hudson","cat":1},{"label":"Heladas tardías que queman brotes","cat":0},{"label":"Temblores y fallas en la cordillera","cat":1}], "Pista: nevadas y heladas provienen del clima; cenizas y sismos provienen de la Tierra.", ["s4-riesgos-naturales"]),
        makeOrder("s7-ex-1", "Ordená las acciones de prevención ante una gran nevada invernal en el campo:", ["Acopio previo de leña, forraje para ganado y víveres secos","Reunión y resguardo de la majada en potreros cercanos al casco","Despeje de huellas y caminos principales con maquinaria vial"], "Pista: primero se almacenan víveres, luego se resguardan animales y finalmente se despejan caminos.", ["s4-riesgos-naturales"]),
        makeClassify("s7-ex-2", "Clasificá las medidas de seguridad ante riesgos naturales:", ["Medidas Frente a Ceniza Volcánica","Medidas Frente a Viento Blanco e Inviernos Crudos"], [{"label":"Uso de barbijos protectores y resguardo de aguadas","cat":0},{"label":"Permanecer en el casco de estancia y calefaccionarse con leña","cat":1},{"label":"Cubrir tomas de aire de motores y depósitos de agua","cat":0},{"label":"Evitar transitar caminos con nieve sin cadenas en las ruedas","cat":1}], "Pista: barbijos y tapar aguadas protegen de la ceniza; abrigo y cadenas protegen de nevadas.", ["s4-riesgos-naturales"]),
        getTfActivity(7, "s7-ex-3", ["s4-riesgos-naturales"]),
      ];
    case 8:
      return [
        makeClassify("s8-ex-0", "Clasificá los Parques Nacionales de Santa Cruz según su ambiente:", ["Parques de Cordillera y Glaciares","Parques de Meseta y Costa"], [{"label":"Parque Nacional Los Glaciares","cat":0},{"label":"Parque Nacional Monte León","cat":1},{"label":"Parque Nacional Perito Moreno","cat":0},{"label":"Parque Nacional Bosques Petrificados de Jaramillo","cat":1}], "Pista: Los Glaciares y Perito Moreno en la cordillera; Monte León y Bosques Petrificados en meseta/costa.", ["s4-areas-protegidas"]),
        makeOrder("s8-ex-1", "Ordená estas normas de conducta responsable al visitar un Parque Nacional:", ["Registrarse en el centro de informes con el guardaparque","Caminar únicamente por los senderos habilitados y señalizados","Regresar con todos los residuos generados sin dejar rastros"], "Pista: primero te registrás, luego transitás por senderos y finalmente volvés con la basura.", ["s4-areas-protegidas"]),
        makeClassify("s8-ex-2", "Clasificá los elementos protegidos en los Parques Nacionales:", ["Protección de Fauna Autóctona","Protección de Glaciares y Bosques"], [{"label":"Colonias de pingüinos en Monte León","cat":0},{"label":"Campos de hielo y glaciar Upsala","cat":1},{"label":"Poblaciones de huemul andino","cat":0},{"label":"Bosques de lenga, ñire y guindo","cat":1}], "Pista: pingüinos y huemules son animales; campos de hielo y lengas son paisajes y flora.", ["s4-areas-protegidas"]),
        getTfActivity(8, "s8-ex-3", ["s4-areas-protegidas"]),
      ];
    case 9:
      return [
        makeClassify("s9-ex-0", "Clasificá las tareas y herramientas de la actividad ganadera ovina:", ["Trabajos en la Estancia","Elementos y Herramientas"], [{"label":"Arreo de majadas con perros ovejeros","cat":0},{"label":"Tijeras mecánicas y prensa de fardos","cat":1},{"label":"Esquila del vellón y clasificación de lana","cat":0},{"label":"Alambres de cuadro y fardos de arpillera","cat":1}], "Pista: arrear y esquilar son trabajos; tijeras, prensas y alambres son herramientas.", ["s4-ganaderia-ovina"]),
        makeOrder("s9-ex-1", "Ordená las etapas del circuito de la lana en la estancia de INICIO a FIN:", ["Arreo de las ovejas desde los cuadros hasta los corrales del casco","Esquila cuidadosa del vellón completo en el galpón","Clasificación de la calidad de la lana y prensado en fardos"], "Pista: primero se arrean los animales, luego se esquilan y finalmente se enfarda la lana.", ["s4-ganaderia-ovina"]),
        makeClassify("s9-ex-2", "Clasificá las instalaciones de la industria hidrocarburífera:", ["Instalaciones de Extracción","Instalaciones de Transporte y Acopio"], [{"label":"Aparatos de bombeo mecánico (cigüeñas)","cat":0},{"label":"Oleoductos y gasoductos subterráneos","cat":1},{"label":"Pozos de perforación en el yacimiento","cat":0},{"label":"Tanques de almacenamiento en la costa","cat":1}], "Pista: bombas y pozos extraen el crudo; cañerías y tanques lo transportan y guardan.", ["s4-ganaderia-ovina"]),
        getTfActivity(9, "s9-ex-3", ["s4-ganaderia-ovina"]),
      ];
    case 10:
      return [
        makeClassify("s10-ex-0", "Clasificá los recursos energéticos según su capacidad de renovación:", ["Recursos No Renovables (Fósiles / Minerales)","Recursos Renovables (Limpios)"], [{"label":"Petróleo crudo del subsuelo","cat":0},{"label":"Viento patagónico para energía eólica","cat":1},{"label":"Gas natural de pozos profundos","cat":0},{"label":"Radiación solar en paneles solares","cat":1}], "Pista: petróleo y gas pueden agotarse; el viento y el sol se renuevan continuamente.", ["s4-energia-mineria"]),
        makeOrder("s10-ex-1", "Ordená las etapas del circuito petrolero desde el yacimiento al consumidor:", ["Extracción del petróleo crudo en los pozos con aparatos de bombeo","Transporte por oleoductos o buques tanque hacia las refinerías","Destilación y venta de naftas y gasoil en estaciones de servicio"], "Pista: primero se extrae, luego se transporta a la destilería y finalmente se comercializa.", ["s4-energia-mineria"]),
        makeClassify("s10-ex-2", "Clasificá los minerales extraídos en Santa Cruz según su tipo:", ["Minerales Combustibles (Energéticos)","Minerales Metalíferos (Preciosos)"], [{"label":"Carbón mineral de Río Turbio","cat":0},{"label":"Oro nativo de Cerro Vanguardia","cat":1},{"label":"Lignito y arcillas carbonosas","cat":0},{"label":"Plata refinada en lingotes","cat":1}], "Pista: el carbón genera energía; el oro y la plata son metales preciosos.", ["s4-energia-mineria"]),
        getTfActivity(10, "s10-ex-3", ["s4-energia-mineria"]),
      ];
    case 11:
      return [
        makeClassify("s11-ex-0", "Clasificá las actividades económicas de Santa Cruz según el sector productivo:", ["Actividades de Servicios Turísticos","Actividades de la Pesca Marítima"], [{"label":"Guiadas de trekking en El Chaltén","cat":0},{"label":"Captura de calamar en buques poteros","cat":1},{"label":"Hotelería y gastronomía en El Calafate","cat":0},{"label":"Procesamiento y congelado en plantas pesqueras","cat":1}], "Pista: trekking y hoteles pertenecen al turismo; buques poteros y plantas pertenecen a la pesca.", ["s4-turismo-pesca"]),
        makeOrder("s11-ex-1", "Ordená las etapas del circuito de la pesca de merluza y langostino:", ["Captura de las especies en alta mar mediante buques pesqueros","Descarga en puertos de la costa como Puerto Deseado o Caleta Paula","Procesamiento, fileteado y congelado para su exportación al mundo"], "Pista: primero se pesca en el mar, luego se descarga en el muelle y se procesa en planta.", ["s4-turismo-pesca"]),
        makeClassify("s11-ex-2", "Clasificá las atracciones turísticas santacruceñas según la actividad principal:", ["Turismo de Naturaleza y Glaciares","Turismo Costero y Fauna Marina"], [{"label":"Navegación frente al Glaciar Perito Moreno","cat":0},{"label":"Avistaje de toninas overas en la ría Deseado","cat":1},{"label":"Senderismo al mirador del cerro Fitz Roy","cat":0},{"label":"Recorrido por pingüineras en Puerto San Julián","cat":1}], "Pista: glaciares y cerros en la montaña; toninas y pingüinos en la costa.", ["s4-turismo-pesca"]),
        getTfActivity(11, "s11-ex-3", ["s4-turismo-pesca"]),
      ];
    case 12:
      return [
        makeClassify("s12-ex-0", "Clasificá las acciones frente al medio ambiente de la estepa:", ["Acciones de Daño Ambiental","Acciones de Conservación Sustentable"], [{"label":"Sobrepastoreo continuo sin rotación de cuadros","cat":0},{"label":"Pastoreo rotativo permitiendo semillar a las plantas","cat":1},{"label":"Arrojar bolsas plásticas al viento patagónico","cat":0},{"label":"Separación y reciclaje de residuos domiciliarios","cat":1}], "Pista: sobrepastoreo y basura dañan; pastoreo rotativo y reciclaje conservan.", ["s4-problemas-ambientales"]),
        makeOrder("s12-ex-1", "Ordená la secuencia que conduce a la desertificación de la estepa patagónica:", ["Exceso de carga ganadera que consume las raíces del pastizal","Desaparición de la cubierta vegetal dejando el suelo desnudo","Acción del viento que barre la tierra fértil formando arenales"], "Pista: el sobrepastoreo elimina raíces, deja el suelo expuesto y el viento vuela la tierra.", ["s4-problemas-ambientales"]),
        makeClassify("s12-ex-2", "Clasificá las consecuencias del cuidado o descuido del ambiente:", ["Consecuencias de la Desertificación","Beneficios del Manejo Sustentable"], [{"label":"Suelo desnudo arrastrado por el viento","cat":0},{"label":"Conservación de raíces y pastizales nativos","cat":1},{"label":"Disminución del pasto disponible para el ganado","cat":0},{"label":"Protección del agua y refugio para fauna silvestre","cat":1}], "Pista: pérdida de suelo y pasto empobrece; rotación y raíces conservan la meseta.", ["s4-problemas-ambientales"]),
        getTfActivity(12, "s12-ex-3", ["s4-problemas-ambientales"]),
      ];
    case 13:
      return [
        makeClassify("s13-ex-0", "Clasificá los elementos de la vida cotidiana del pueblo Aonikenk:", ["Caza y Movilidad","Vivienda y Abrigo"], [{"label":"Boleadoras de piedra con tientos","cat":0},{"label":"Toldo desmontable de cueros cosidos (kau)","cat":1},{"label":"Adopción del caballo como jinetes","cat":0},{"label":"Manto de piel de guanaco (quillango)","cat":1}], "Pista: boleadoras y caballos para cazar; toldos y quillangos para protegerse del frío.", ["s4-aonikenk"]),
        makeOrder("s13-ex-1", "Ordená los pasos de armado del toldo aonikenk (kau):", ["Colocación de los postes de madera inclinados hacia el viento","Extensión del cobertor formado por capas de cueros cosidos","Fijación firme con estacas de hueso y tientos de cuero al suelo"], "Pista: primero se plantan los postes, luego se cubren con cueros y finalmente se aseguran con estacas.", ["s4-aonikenk"]),
        makeClassify("s13-ex-2", "Clasificá las herramientas de los cazadores Aonikenk según su uso:", ["Armas y Utensilios de Caza","Herramientas de Confección y Curtido"], [{"label":"Boleadoras de dos y tres piedras","cat":0},{"label":"Raspadores de piedra para limpiar cueros","cat":1},{"label":"Arco y flechas con puntas de pedernal","cat":0},{"label":"Punzón de hueso para coser toldos y quillangos","cat":1}], "Pista: boleadoras y arcos para cazar; raspadores y punzones para trabajar el cuero.", ["s4-aonikenk"]),
        getTfActivity(13, "s13-ex-3", ["s4-aonikenk"]),
      ];
    case 14:
      return [
        makeClassify("s14-ex-0", "Clasificá las características de los pueblos del extremo sur americano:", ["Yámanas (Nómadas Canoeros)","Selk'nam (Cazadores Pedestres)"], [{"label":"Navegación constante en canoas de corteza","cat":0},{"label":"Caza a pie del guanaco con arco y flecha","cat":1},{"label":"Fogón encendido dentro de la embarcación","cat":0},{"label":"Ceremonia del Hain con máscaras sagradas","cat":1}], "Pista: canoas y fogón en el agua son Yámanas; arcos y Hain son Selk'nam.", ["s4-canoeros-australes"]),
        makeOrder("s14-ex-1", "Ordená las tareas de una jornada de navegación y recolección yámana:", ["Encendido del fogón sobre la base de tierra dentro de la canoa","Navegación por los canales y recolección de mariscos en costas","Regreso al campamento para cocinar cholgas y descansar en chozas"], "Pista: primero preparan el fogón en la canoa, luego navegan mariscando y al final regresan.", ["s4-canoeros-australes"]),
        makeClassify("s14-ex-2", "Clasificá los elementos según el pueblo originario fueguino:", ["Cultura Selk'nam (Cazadores de Tierra)","Cultura Yámana (Navegantes Canoeros)"], [{"label":"Caza del guanaco en los bosques del interior","cat":0},{"label":"Canoas de corteza de guindo para toda la familia","cat":1},{"label":"Pinturas corporales ceremoniales del Hain","cat":0},{"label":"Arpones con punta de hueso para cazar lobos marinos","cat":1}], "Pista: Selk'nam en tierra con guanacos y Hain; Yámanas en el mar con canoas y arpones.", ["s4-canoeros-australes"]),
        getTfActivity(14, "s14-ex-3", ["s4-canoeros-australes"]),
      ];
    case 15:
      return [
        makeClassify("s15-ex-0", "Clasificá las autoridades e instrumentos de la cultura mapuche:", ["Autoridades y Roles Comunitarios","Instrumentos y Expresiones Sagradas"], [{"label":"Lonko (cabeza y guía comunitaria)","cat":0},{"label":"Kultrún (tambor ceremonial sagrado)","cat":1},{"label":"Machi (guía médica y espiritual)","cat":0},{"label":"Trutruka (instrumento de viento de coligüe)","cat":1}], "Pista: Lonko y Machi guían a la comunidad; Kultrún y Trutruka son instrumentos tradicionales.", ["s4-mapuche"]),
        makeOrder("s15-ex-1", "Ordená los pasos de confección de un tejido tradicional en telar (huitral):", ["Esquila y lavado cuidadoso del vellón de lana natural","Hilado con huso y teñido con tintes vegetales y minerales","Urdido y tejido de los símbolos sagrados en el telar huitral"], "Pista: primero se lava la lana, luego se hila y tiñe, y finalmente se teje en el telar.", ["s4-mapuche"]),
        makeClassify("s15-ex-2", "Clasificá las expresiones de la cultura mapuche:", ["Textilería y Platería","Música y Ceremonias Sagradas"], [{"label":"Ponchos y mantas en telar huitral","cat":0},{"label":"Toque del kultrún en el nguillatún","cat":1},{"label":"Aros y pectorales de plata labrada (trapelacucha)","cat":0},{"label":"Sonido de la trutruka en festividades","cat":1}], "Pista: ponchos y joyas de plata son artesanías; kultrún y trutruka son música ritual.", ["s4-mapuche"]),
        getTfActivity(15, "s15-ex-3", ["s4-mapuche"]),
      ];
    case 16:
      return [
        makeClassify("s16-ex-0", "Clasificá las innovaciones de la sociedad diaguita:", ["Agricultura e Hidráulica","Arquitectura y Cerámica"], [{"label":"Terrazas de cultivo escalonadas en cerros","cat":0},{"label":"Pucarás o aldeas fortificadas de piedra","cat":1},{"label":"Canales y acequias de riego en laderas","cat":0},{"label":"Urnas de cerámica con dibujos geométricos","cat":1}], "Pista: terrazas y canales son agrícolas; pucarás y urnas son construcciones y alfarería.", ["s4-diaguitas"]),
        makeOrder("s16-ex-1", "Ordená los pasos de producción agrícola en las terrazas diaguitas:", ["Construcción de los muros de contención de piedra en la pendiente","Relleno con tierra fértil y trazado de acequias de riego","Siembra de semillas de maíz, zapallo y porotos para la cosecha"], "Pista: primero se arman los muros de piedra, luego se prepara la tierra con canales y se siembra.", ["s4-diaguitas"]),
        makeClassify("s16-ex-2", "Clasificá los cultivos y herramientas de los Diaguitas:", ["Producción Agrícola en Terrazas","Metalurgia y Herramientas de Cobre"], [{"label":"Maíz, porotos y zapallo regados por acequias","cat":0},{"label":"Hachas ceremoniales de bronce y cobre fundido","cat":1},{"label":"Papa andina y quinoa en andenes de cultivo","cat":0},{"label":"Campanas y discos metálicos ornamentales","cat":1}], "Pista: maíz y papas son alimentos de siembra; hachas y discos son de metal fundido.", ["s4-diaguitas"]),
        getTfActivity(16, "s16-ex-3", ["s4-diaguitas"]),
      ];
    case 17:
      return [
        makeClassify("s17-ex-0", "Clasificá las instituciones y herramientas del Imperio Inca:", ["Organización Política y Trabajo","Comunicaciones y Registros"], [{"label":"Sapa Inca y nobleza cusqueña","cat":0},{"label":"Quipus con cuerdas anudadas para cuentas","cat":1},{"label":"Sistema de trabajo por turnos (mita)","cat":0},{"label":"Chasquis corriendo por el Qhapaq Ñan","cat":1}], "Pista: Sapa Inca y mita organizan el Estado; quipus y chasquis comunican y llevan registros.", ["s4-incas"]),
        makeOrder("s17-ex-1", "Ordená la cadena de relevo de un mensaje transmitido por chasquis en el Imperio Inca:", ["Partida del chasqui con el mensaje memorizado y el quipu","Carrera veloz a lo largo del camino de piedra","Relevo en el tambo siguiente entregando el mensaje al nuevo corredor"], "Pista: el corredor sale del punto inicial, corre por el camino y pasa el mensaje en la posta siguiente.", ["s4-incas"]),
        makeClassify("s17-ex-2", "Clasificá los elementos del Tahuantinsuyo según su función:", ["Organización del Estado y Obras Públicas","Sistemas de Comunicación y Cuentas"], [{"label":"Construcción de fortalezas y templos de piedra tallada","cat":0},{"label":"Mensajeros chasquis en postas a lo largo de caminos","cat":1},{"label":"Sistema de trabajo por turnos en obras (mita)","cat":0},{"label":"Quipus con nudos para censos y registros agrícolas","cat":1}], "Pista: fortalezas y mita organizan el Estado; chasquis y quipus comunican y cuentan.", ["s4-incas"]),
        getTfActivity(17, "s17-ex-3", ["s4-incas"]),
      ];
    case 18:
      return [
        makeClassify("s18-ex-0", "Clasificá los derechos constitucionales de los pueblos indígenas (Art. 75 inc. 17):", ["Derechos Culturales y Educativos","Derechos Territoriales y Comunitarios"], [{"label":"Educación bilingüe e intercultural","cat":0},{"label":"Posesión y propiedad comunitaria de tierras","cat":1},{"label":"Respeto a su identidad y pautas culturales","cat":0},{"label":"Personería jurídica de sus comunidades","cat":1}], "Pista: educación e identidad son derechos culturales; tierras y personería son territoriales y comunitarios.", ["s4-indigenas-presente"]),
        makeOrder("s18-ex-1", "Ordená los hitos de reconocimiento de los derechos indígenas en Argentina:", ["Ocupación ancestral milenaria de los territorios antes de la llegada europea","Período de campañas militares estatales que despojaron a las comunidades","Reforma Constitucional de 1994 que consagró su preexistencia étnica y cultural"], "Pista: primero su presencia milenaria, luego el sometimiento del siglo XIX y en 1994 la consagración constitucional.", ["s4-indigenas-presente"]),
        makeClassify("s18-ex-2", "Clasificá las acciones del Estado frente a los derechos indígenas:", ["Garantías en Educación y Cultura","Garantías sobre Tierras y Organización"], [{"label":"Programas de educación bilingüe e intercultural","cat":0},{"label":"Entrega de títulos comunitarios de tierras ancestrales","cat":1},{"label":"Respeto a la identidad y pautas culturales tradicionales","cat":0},{"label":"Reconocimiento formal de la personería jurídica de las comunidades","cat":1}], "Pista: lengua y pautas son culturales; títulos y personerías son jurídicos y territoriales.", ["s4-indigenas-presente"]),
        getTfActivity(18, "s18-ex-3", ["s4-indigenas-presente"]),
      ];
    case 19:
      return [
        makeClassify("s19-ex-0", "Clasificá los adelantos técnicos que posibilitaron los viajes oceánicos del siglo XV:", ["Instrumentos de Orientación Astronómica","Embarcaciones y Cartografía Náutica"], [{"label":"Brújula con aguja magnética","cat":0},{"label":"Carabela y naos con velas combinadas","cat":1},{"label":"Astrolabio para calcular la latitud","cat":0},{"label":"Portulanos o cartas marinas trazadas a mano","cat":1}], "Pista: brújula y astrolabio orientan en el mar; carabelas y portulanos son las naves y mapas.", ["s4-viajes-europeos"]),
        makeOrder("s19-ex-1", "Ordená la secuencia de causas y consecuencias de los viajes europeos del siglo XV:", ["Bloqueo otomano de las rutas comerciales terrestres a las Indias en 1453","Búsqueda y perfeccionamiento de rutas marítimas por los océanos","Llegada de navegantes europeos a las costas del continente americano en 1492"], "Pista: primero se bloqueó la ruta terrestre, luego se buscaron vías marítimas y finalmente llegaron a América.", ["s4-viajes-europeos"]),
        makeClassify("s19-ex-2", "Clasificá los desafíos y adelantos de los viajes del siglo XV:", ["Adelantos Técnicos de la Navegación","Dificultades y Riesgos en Alta Mar"], [{"label":"Uso de la brújula y el cuadrante astronómico","cat":0},{"label":"Escasez de agua dulce y enfermedades como el escorbuto","cat":1},{"label":"Mapas portulanos trazados por cartógrafos","cat":0},{"label":"Tormentas desconocidas y pérdida del rumbo en la inmensidad","cat":1}], "Pista: brújula y mapas son adelantos; sed, escorbuto y tormentas son peligros.", ["s4-viajes-europeos"]),
        getTfActivity(19, "s19-ex-3", ["s4-viajes-europeos"]),
      ];
    case 20:
      return [
        makeClassify("s20-ex-0", "Clasificá los acontecimientos de la expedición de Magallanes:", ["Sucesos en Puerto San Julián (1520)","Hitos de la Navegación Mundial"], [{"label":"Invernada de 5 meses y primera misa católica","cat":0},{"label":"Descubrimiento del estrecho interoceánico","cat":1},{"label":"Encuentro con los patagones aonikenk","cat":0},{"label":"Primera circunnavegación del globo (nao Victoria)","cat":1}], "Pista: misa y contacto con nativos ocurrieron en San Julián; estrecho y vuelta al mundo fueron logros globales.", ["s4-magallanes"]),
        makeOrder("s20-ex-1", "Ordená cronológicamente los hechos de la expedición de Magallanes y Elcano:", ["Invernada de la flota en Puerto San Julián y contacto con los patagones (1520)","Descubrimiento y cruce del Estrecho de Magallanes hacia el Océano Pacífico","Regreso de la nao Victoria al mando de Juan Sebastián Elcano a España (1522)"], "Pista: primero invernaron en San Julián, luego hallaron el estrecho y finalmente completaron la vuelta al mundo.", ["s4-magallanes"]),
        makeClassify("s20-ex-2", "Clasificá los protagonistas y embarcaciones de la expedición de Magallanes:", ["Embarcaciones de la Flota Española","Líderes y Cronistas de la Travesía"], [{"label":"Nao Victoria que completó la circunnavegación","cat":0},{"label":"Hernando de Magallanes, capitán general de la flota","cat":1},{"label":"Nao Trinidad, capitana de la expedición","cat":0},{"label":"Antonio Pigafetta, cronista que escribió el diario de viaje","cat":1}], "Pista: Victoria y Trinidad son naves; Magallanes y Pigafetta son personas.", ["s4-magallanes"]),
        getTfActivity(20, "s20-ex-3", ["s4-magallanes"]),
      ];
    case 21:
      return [
        makeClassify("s21-ex-0", "Clasificá las ciudades según la corriente colonizadora que las fundó:", ["Corriente del Norte (desde el Alto Perú)","Corriente del Oeste (desde Chile)"], [{"label":"Santiago del Estero ('Madre de Ciudades')","cat":0},{"label":"Mendoza al pie de los Andes","cat":1},{"label":"San Miguel de Tucumán y Salta","cat":0},{"label":"San Juan y San Luis","cat":1}], "Pista: Santiago, Tucumán y Salta provienen del Norte; Mendoza, San Juan y San Luis del Oeste.", ["s4-fundacion-ciudades"]),
        makeOrder("s21-ex-1", "Ordená los pasos tradicionales del ritual de fundación de una ciudad colonial:", ["Elección del terreno con agua dulce y lectura del bando fundacional","Clavado del madero de justicia en el centro de la Plaza Mayor","Trazado del plano en damero repartiendo solares para Cabildo, Iglesia y vecinos"], "Pista: primero se elige el sitio y lee el bando, luego se erige el rollo en la plaza y se trazan las manzanas.", ["s4-fundacion-ciudades"]),
        makeClassify("s21-ex-2", "Clasificá las corrientes colonizadoras según su procedencia:", ["Corriente del Norte (Alto Perú)","Corriente del Este (España / Océano Atlántico)"], [{"label":"Fundación de Santiago del Estero y Tucumán","cat":0},{"label":"Primera y segunda fundación de Buenos Aires","cat":1},{"label":"Fundación de Salta y San Salvador de Jujuy","cat":0},{"label":"Fundación de Santa Fe y Corrientes sobre los ríos","cat":1}], "Pista: ciudades del norte bajan de los Andes; Buenos Aires y Santa Fe entran por el río.", ["s4-fundacion-ciudades"]),
        getTfActivity(21, "s21-ex-3", ["s4-fundacion-ciudades"]),
      ];
    case 22:
      return [
        makeClassify("s22-ex-0", "Clasificá los grupos sociales de la época colonial rioplatense:", ["Sectores Privilegiados","Sectores Trabajadores y Subalternos"], [{"label":"Españoles peninsulares (virreyes y obispos)","cat":0},{"label":"Población afrodescendiente esclavizada","cat":1},{"label":"Criollos hacendados y comerciantes","cat":0},{"label":"Mestizos, peones rurales e indígenas","cat":1}], "Pista: peninsulares y criollos concentraban tierras y cargos; mestizos, indígenas y esclavizados trabajaban sin privilegios.", ["s4-sociedad-colonial"]),
        makeOrder("s22-ex-1", "Ordená la jerarquía social colonial desde el grupo con mayores privilegios al más desfavorecido:", ["Españoles peninsulares nacidos en Europa que ocupaban altos cargos","Criollos nacidos en América propietarios de tierras y comerciantes","Indígenas sometidos a tributos y encomiendas, y mestizos con pocos derechos","Personas africanas esclavizadas sin libertad ni derechos civiles"], "Pista: arriba peninsulares, seguidos de criollos, luego mestizos/indígenas y en la base los esclavizados.", ["s4-sociedad-colonial"]),
        makeClassify("s22-ex-2", "Clasificá las actividades coloniales según el grupo social que las realizaba:", ["Sectores Altos (Españoles y Criollos)","Sectores Populares (Mestizos, Indígenas y Esclavizados)"], [{"label":"Participación en el Cabildo y grandes casas comerciales","cat":0},{"label":"Tareas domésticas pesadas, lavandería en el río y servicio","cat":1},{"label":"Reuniones en tertulias privadas y cargos de gobierno","cat":0},{"label":"Trabajo rural en chacras, peonaje y arriería de tropas","cat":1}], "Pista: gobierno y tertulias para los privilegiados; tareas duras y peonaje para los populares.", ["s4-sociedad-colonial"]),
        getTfActivity(22, "s22-ex-3", ["s4-sociedad-colonial"]),
      ];
    case 23:
      return [
        makeClassify("s23-ex-0", "Clasificá los productos regionales según la zona que los proveía para Potosí:", ["Llanuras Pampeanas y Litoral","Cuyo y Valles del Noroeste"], [{"label":"Mulas de carga e invernada","cat":0},{"label":"Vinos y aguardientes de Cuyo","cat":1},{"label":"Sebo para velas y cueros vacunos","cat":0},{"label":"Ponchos y tejidos de lana de Santiago y Catamarca","cat":1}], "Pista: mulas y cueros de las llanuras; vinos, aguardientes y ponchos de Cuyo y el Noroeste.", ["s4-circuito-potosi"]),
        makeOrder("s23-ex-1", "Ordená las paradas del circuito de la mula desde su cría hasta las minas de Potosí:", ["Cría y pastoreo de los animales en campos de Buenos Aires, Santa Fe y Entre Ríos","Invernada y engorde de las tropas de mulas en valles de Córdoba y Salta","Venta final en la feria de Sumalao y ascenso hacia los socavones mineros de Potosí"], "Pista: primero se crían en las llanuras, luego se engordan en Córdoba/Salta y se venden para subir a Potosí.", ["s4-circuito-potosi"]),
        makeClassify("s23-ex-2", "Clasificá los productos según el lugar donde se producían para Potosí:", ["Región Pampeana y Litoral","Región de Cuyo y Noroeste"], [{"label":"Mulas criadas en pasturas abiertas","cat":0},{"label":"Vino y aguardiente envasados en botijas","cat":1},{"label":"Cueros secos y sebo para velas de mina","cat":0},{"label":"Carretas de madera y ponchos de lana tejidos","cat":1}], "Pista: mulas y cueros de las llanuras del sur; vinos, carretas y ponchos de Cuyo y el norte.", ["s4-circuito-potosi"]),
        getTfActivity(23, "s23-ex-3", ["s4-circuito-potosi"]),
      ];
    case 24:
      return [
        makeClassify("s24-ex-0", "Clasificá los aportes culturales integrados en la sociedad colonial:", ["Aportes de Pueblos Originarios Americanos","Aportes de Origen Africano y Europeo"], [{"label":"Cultivo y consumo de la yerba mate y el maíz","cat":0},{"label":"Ritmos de tambor y candombe afrodescendiente","cat":1},{"label":"Palabras incorporadas como poncho, canoa y cancha","cat":0},{"label":"Lengua castellana e instituciones del Cabildo","cat":1}], "Pista: yerba mate y palabras quechuas/guaraníes son originarias; candombe es africano y el castellano europeo.", ["s4-conquista-espiritual"]),
        makeOrder("s24-ex-1", "Ordená las fases del proceso de integración cultural en las misiones jesuíticas:", ["Llegada de los sacerdotes jesuitas y fundación de los pueblos misioneros","Organización de talleres de música barroca, luthería, imprenta y agricultura","Expulsión real de la orden jesuita en 1767 dejando las ruinas arquitectónicas"], "Pista: primero se fundan las misiones, luego florecen los talleres y en 1767 los expulsan.", ["s4-conquista-espiritual"]),
        makeClassify("s24-ex-2", "Clasificá las herencias culturales de la época colonial en la vida actual:", ["Aportes de Origen Originario y Criollo","Aportes de Origen Español y Europeo"], [{"label":"Costumbre comunitaria de compartir el mate","cat":0},{"label":"Idioma castellano y trazado de ciudades en cuadrícula","cat":1},{"label":"Uso del poncho criollo de telar artesanal","cat":0},{"label":"Instituciones republicanas herederas del derecho hispano","cat":1}], "Pista: mate y poncho vienen de raíces criollas y originarias; castellano y derecho de Europa.", ["s4-conquista-espiritual"]),
        getTfActivity(24, "s24-ex-3", ["s4-conquista-espiritual"]),
      ];
    case 25:
      return [
        makeClassify("s25-ex-0", "Clasificá las funciones de los tres poderes de la República Argentina:", ["Poder Ejecutivo","Poder Legislativo","Poder Judicial"], [{"label":"Presidencia de la Nación administrando el país","cat":0},{"label":"Congreso de la Nación sancionando las leyes","cat":1},{"label":"Corte Suprema y tribunales dictando sentencias","cat":2},{"label":"Cámara de Diputados y Cámara de Senadores","cat":1},{"label":"Ministerios y aplicación de políticas públicas","cat":0},{"label":"Jueces que resuelven conflictos conforme a derecho","cat":2}], "Pista: el Ejecutivo administra, el Legislativo hace leyes y el Judicial aplica la ley en los tribunales.", ["s4-constitucion"]),
        makeOrder("s25-ex-1", "Ordená la jerarquía normativa de las leyes en la República Argentina:", ["Constitución Nacional y Tratados Internacionales de Derechos Humanos (ley suprema)","Leyes nacionales sancionadas por el Congreso de la Nación","Constituciones provinciales y leyes dictadas por legislaturas provinciales","Ordenanzas y normas municipales dictadas por los Concejos Deliberantes"], "Pista: en la cima la Constitución Nacional, luego leyes nacionales, constituciones provinciales y ordenanzas.", ["s4-constitucion"]),
        makeClassify("s25-ex-2", "Clasificá los poderes de gobierno según la tarea que desempeñan:", ["Poder Ejecutivo y Poder Legislativo","Poder Judicial"], [{"label":"Administrar los recursos del Estado nacional","cat":0},{"label":"Juzgar y dictar sentencias en los tribunales","cat":1},{"label":"Debatir y aprobar leyes en el Congreso","cat":0},{"label":"Garantizar el cumplimiento de la Constitución en los juicios","cat":1}], "Pista: presidente administra y legisladores hacen leyes; jueces dictan sentencias.", ["s4-constitucion"]),
        getTfActivity(25, "s25-ex-3", ["s4-constitucion"]),
      ];
    case 26:
      return [
        makeClassify("s26-ex-0", "Clasificá las autoridades según su nivel de gobierno en Santa Cruz:", ["Nivel Provincial (Santa Cruz)","Nivel Municipal (Ciudad / Localidad)"], [{"label":"Gobernador de la Provincia","cat":0},{"label":"Intendente Municipal","cat":1},{"label":"Diputados de la Legislatura Provincial","cat":0},{"label":"Concejales del Concejo Deliberante","cat":1}], "Pista: Gobernador y Diputados gobiernan la provincia; Intendente y Concejales la ciudad.", ["s4-derechos-nino"]),
        makeOrder("s26-ex-1", "Ordená estas normas según su ámbito de aplicación de GENERAL a LOCAL:", ["Convención sobre los Derechos del Niño (tratado internacional de la ONU)","Constitución Provincial de Santa Cruz (norma suprema provincial)","Ordenanza municipal sancionada por el Concejo Deliberante de la ciudad"], "Pista: primero la Convención internacional, luego la Constitución provincial y al final la ordenanza local.", ["s4-derechos-nino"]),
        makeClassify("s26-ex-2", "Clasificá los derechos de los niños según su ámbito de protección:", ["Derechos al Cuidado y la Salud","Derechos a la Identidad y la Educación"], [{"label":"Atención médica oportuna y vacunación gratuita","cat":0},{"label":"Tener un nombre, apellido y nacionalidad reconocidos","cat":1},{"label":"Alimentación saludable y vivienda digna","cat":0},{"label":"Asistir a la escuela y aprender en un entorno seguro","cat":1}], "Pista: vacunas y alimentos son salud y cuidado; nombre y escuela son identidad y educación.", ["s4-derechos-nino"]),
        getTfActivity(26, "s26-ex-3", ["s4-derechos-nino"]),
      ];
    default:
      return [];
  }
}

// Compatibilidad hacia atrás: proxy que genera actividades frescas en cada acceso
export const EXTRA_SOCIALES: Record<number, ActivitySpec[]> = new Proxy({}, {
  get: (_target, prop) => {
    const n = Number(prop);
    if (!Number.isNaN(n) && n >= 1 && n <= 26) {
      return getExtraSociales(n);
    }
    return undefined;
  },
});

export function buildSocialesActivities(world: WorldDef): ActivitySpec[] {
  const n = world.worldNumber ?? 1;
  const count = world.activityCount ?? 8;
  const bank = SOCIALES_BANK[n] ?? SOCIALES_BANK[1];
  // 6 preguntas de opción múltiple del banco
  const qActs = fromBank(bank, Math.max(4, count - 2), `s${n}`, world.skills ?? []);
  // 1 actividad de Verdadero/Falso con makeVF
  const tfAct = getTfActivity(n, `s${n}-tf`, world.skills ?? []);
  // 1 actividad interactiva adicional seleccionada al azar de un pool de 3 variantes
  const fullExtra = getExtraSociales(n);
  const interactivePool = fullExtra.filter(a => a.type !== "true-false");
  const chosenInteractive = pickOne(interactivePool);
  const extraAct = {
    ...chosenInteractive,
    id: `${chosenInteractive.id || `s${n}-ex-0`}`,
    skills: world.skills && world.skills.length > 0 ? world.skills : (chosenInteractive.skills ?? []),
  };
  return numbered(shuffle([...qActs, tfAct, extraAct]));
}
