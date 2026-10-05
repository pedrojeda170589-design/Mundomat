// Banco de preguntas y actividades de Ciencias Sociales de 4.º grado (26 mundos).
// Cada mundo cuenta con al menos 15 preguntas curriculares de opción equilibrada
// más actividades interactivas (clasificar, ordenar, verdadero/falso).
import type { ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import { fromBank, makeClassify, makeOrder, makeTrueFalse, numbered, Q, q, sample, shuffle } from "./util";

export const SOCIALES_BANK: Record<number, Q[]> = {
  // Mundo 1
  1: [
    q("¿En qué región de la República Argentina se ubica la provincia de Santa Cruz?", [["🌾","En la Patagonia austral"],["🌴","En el Noroeste"],["🏜️","En la llanura pampeana central"]], 0, "Pista: ocupa el sector sur de la Patagonia continental."),
    q("¿Qué provincia argentina limita al norte con Santa Cruz?", [["📍","Chubut"],["📍","La Pampa"],["📍","Río Negro"]], 0, "Pista: el límite es el Paralelo 46° Sur."),
    q("¿Qué país limita al oeste y al sur con Santa Cruz a través de los Andes?", [["🇨🇱","Chile"],["🇧🇴","Bolivia"],["🇺🇾","Uruguay"]], 0, "Pista: compartimos la extensa Cordillera de los Andes."),
    q("¿Qué mar baña toda la costa este de la provincia de Santa Cruz?", [["🌊","El Mar Argentino"],["🌊","El Océano Pacífico"],["🌊","El Mar Caribe tropical"]], 0, "Pista: forma parte de la plataforma del Atlántico Sur."),
    q("¿Cuál es la ciudad capital de la provincia de Santa Cruz?", [["🏛️","Río Gallegos"],["🏔️","El Calafate"],["⚓","Puerto Deseado"]], 0, "Pista: allí residen los poderes del gobierno provincial."),
    q("¿Qué paralelo geográfico marca el límite norte entre Santa Cruz y Chubut?", [["🌐","El Paralelo 46° Sur"],["🌐","El Trópico de Capricornio"],["🌐","El Ecuador terrestre"]], 0, "Pista: es una línea recta de este a oeste en el grado 46."),
    q("¿Qué paso marítimo se encuentra al sur separando el continente de Tierra del Fuego?", [["⛵","El Estrecho de Magallanes"],["🚢","El Canal de Panamá en América Central"],["🌊","El Canal de Suez"]], 0, "Pista: fue descubierto por la armada de Magallanes en 1520."),
    q("¿Por qué Santa Cruz se caracteriza por tener una baja densidad de población?", [["🗺️","Gran territorio con pocos habitantes por km²"],["🏙️","Población temporal que reside solo en verano"],["🏔️","Porque no hay rutas de transporte"]], 0, "Pista: es la segunda provincia más extensa del país y la población está dispersa."),
    q("¿Hacia qué punto cardinal debemos viajar desde Santa Cruz para ir a Buenos Aires?", [["🧭","Hacia el norte"],["🧭","Hacia el oeste"],["🧭","Hacia el sur polar"]], 0, "Pista: Buenos Aires se encuentra al norte de la Patagonia."),
    q("¿Qué archipiélago argentino en el Atlántico Sur integra la región patagónica?", [["🇦🇷","Las Islas Malvinas"],["🏝️","Las Islas Galápagos"],["🏝️","Las Islas Baleares"]], 0, "Pista: territorio argentino sobre la plataforma submarina austral."),
    q("¿Qué tipo de mapa representa las provincias, capitales y límites territoriales?", [["🗺️","Un mapa político"],["📊","Un gráfico de barras"],["🖼️","Un dibujo artístico"]], 0, "Pista: los mapas políticos muestran la división de estados y departamentos."),
    q("¿Qué tipo de mapa muestra las alturas del relieve, mesetas, cordillera y ríos?", [["🏔️","Un mapa físico"],["🏛️","Un plano de líneas de subterráneo"],["🚗","Una guía de compras"]], 0, "Pista: utiliza colores verde, amarillo y marrón para las distintas altitudes."),
    q("¿Qué provincia argentina se ubica cruzando el Estrecho de Magallanes hacia el sur?", [["❄️","Tierra del Fuego"],["🌾","La provincia andina de Neuquén"],["🏔️","La provincia de Mendoza"]], 0, "Pista: es la provincia insular más austral de nuestro país."),
    q("¿Cuál es la principal ruta nacional que recorre la costa santacruceña de norte a sur?", [["🛣️","La Ruta Nacional 3"],["🛣️","La Ruta Nacional 9"],["🛣️","La Ruta Provincial 1"]], 0, "Pista: une Caleta Olivia, San Julián, Piedra Buena y Río Gallegos."),
    q("¿Qué emblemática ruta nacional corre junto a la cordillera al oeste de Santa Cruz?", [["🛣️","La Ruta Nacional 40"],["🛣️","La Ruta Nacional 2"],["🛣️","La Ruta Panamericana norte"]], 0, "Pista: bordea los Andes desde Cabo Vírgenes hasta el norte argentino."),
  ],

  // Mundo 2
  2: [
    q("¿En cuántos departamentos políticos se divide el territorio de Santa Cruz?", [["🏛️","7 departamentos"],["🏛️","15 departamentos"],["🏛️","24 departamentos"]], 0, "Pista: son siete distritos administrativos."),
    q("¿En qué departamento se ubica la capital provincial, Río Gallegos?", [["📍","Güer Aike"],["📍","Deseado"],["📍","Lago Argentino"]], 0, "Pista: es el departamento del extremo sur provincial."),
    q("¿Cuál es la ciudad cabecera del departamento Lago Argentino?", [["🏔️","El Calafate"],["🌾","Gobernador Gregores"],["⚓","Puerto San Julián"]], 0, "Pista: portal de entrada a los glaciares."),
    q("¿Cuál es la cabecera departamental del departamento Magallanes?", [["⚓","Puerto San Julián"],["🚢","Puerto Deseado"],["⛽","Pico Truncado en la zona norte"]], 0, "Pista: puerto histórico donde invernó Hernando de Magallanes."),
    q("¿Qué ciudad costera es la cabecera del departamento Deseado?", [["🌊","Puerto Deseado"],["🏔️","El Chaltén"],["🌾","Perito Moreno en el noroeste"]], 0, "Pista: se encuentra sobre la margen norte de la ría del Deseado."),
    q("¿Cuál es la cabecera del departamento Lago Buenos Aires?", [["🍒","Perito Moreno"],["🏔️","El Calafate"],["🌾","Gobernador Gregores"]], 0, "Pista: ciudad del noroeste cercana a Los Antiguos."),
    q("¿Cuál es la ciudad cabecera del departamento Río Chico?", [["🌾","Gobernador Gregores"],["⛽","Las Heras en el norte petrolero"],["⚓","Puerto Santa Cruz"]], 0, "Pista: pueblo agrícola y ganadero en el centro de la meseta."),
    q("¿Qué histórica localidad es la cabecera del departamento Corpen Aike?", [["⚓","Puerto Santa Cruz"],["🏛️","Río Gallegos en el sur provincial"],["🏔️","El Chaltén"]], 0, "Pista: ubicada en el estuario del río Santa Cruz."),
    q("¿En qué departamento santacruceño se encuentra la ciudad de Caleta Olivia?", [["⛽","Deseado"],["📍","Güer Aike"],["🏔️","Lago Argentino"]], 0, "Pista: departamento del norte provincial con costas en el Golfo San Jorge."),
    q("¿Qué departamento alberga a la localidad cordillerana de El Chaltén?", [["🏔️","Lago Argentino"],["🌾","Departamento Río Chico"],["⚓","Magallanes"]], 0, "Pista: al pie del cerro Fitz Roy en el parque nacional."),
    q("¿Qué ciudad minera del departamento Güer Aike extrae carbón mineral?", [["⛏️","Río Turbio"],["🍒","Los Antiguos"],["⚓","Puerto Deseado"]], 0, "Pista: en la cuenca carbonífera cercana al límite internacional."),
    q("¿Qué localidad junto al lago Buenos Aires es Capital Nacional de la Cereza?", [["🍒","Los Antiguos"],["🌾","Gobernador Gregores"],["⚓","Puerto San Julián"]], 0, "Pista: tiene un microclima de valles fértiles."),
    q("¿Por qué cada departamento de la provincia cuenta con una ciudad cabecera?", [["🏛️","Para descentralizar trámites y servicios administrativos"],["🎪","Para organizar recitales de música popular"],["🏟️","Para que viva la totalidad de los deportistas"]], 0, "Pista: organiza la justicia, policía, escuelas y trámites regionales."),
    q("¿Cuál es el departamento con mayor cantidad de habitantes de Santa Cruz según el censo?", [["👥","Güer Aike"],["🌾","Río Chico"],["⚓","Corpen Aike"]], 0, "Pista: alberga a la capital Río Gallegos con más de 130.000 pobladores."),
    q("¿En qué localidad costera del departamento Corpen Aike se ubica la isla Pavón?", [["🏝️","Comandante Luis Piedra Buena"],["⚓","Puerto Deseado"],["⛽","Las Heras"]], 0, "Pista: sobre el río Santa Cruz, base histórica del comandante Piedra Buena."),
  ],

  // Mundo 3
  3: [
    q("¿Qué distingue principalmente a un espacio urbano de uno rural en Santa Cruz?", [["🏙️","Viviendas, comercios y servicios concentrados"],["🌾","Grandes extensiones de chacras y huertas familiares"],["🐴","El uso exclusivo de caballos para trasladarse"]], 0, "Pista: las ciudades tienen escuelas secundarias, hospitales y redes de gas y cloacas."),
    q("¿Cuál es la principal actividad laboral en los espacios rurales de la meseta santacruceña?", [["🐑","La ganadería ovina en estancias"],["🏭","La industria automotriz pesada"],["🍌","El cultivo intensivo de caña de azúcar"]], 0, "Pista: cría y cuidado de ovejas para lana y carne."),
    q("¿Qué rol cumple la estancia patagónica en el poblamiento rural de Santa Cruz?", [["🏡","Centro de trabajo, vivienda y producción ganadera"],["🏢","Un complejo de oficinas bancarias y financieras"],["🚂","Una estación de tren metropolitano"]], 0, "Pista: cuenta con galpón de esquila, casa principal y puestos dispersos."),
    q("¿Qué trabajadores se trasladan en comparsas por las estancias en la época de esquila?", [["✂️","Los esquiladores y peones rurales"],["👨‍🏫","Los maestros de taller de teatro"],["⚓","Los marineros de buques pesqueros"]], 0, "Pista: realizan la zafra de esquila durante la primavera y el verano."),
    q("¿Qué servicio esencial permite a los puesteros rurales comunicarse ante emergencias?", [["📻","Radiocomunicación y mensajes de radio"],["📫","Mensajes transmitidos por palomas mensajeras"],["🚲","Los mensajes en bicicleta"]], 0, "Pista: los mensajes al poblador rural se emiten por radios AM."),
    q("¿Cuál es la función principal de los puertos como Puerto Deseado o Punta Quilla?", [["🚢","Salida marítima de pesca, lana y minerales"],["🏖️","La práctica exclusiva de natación en época estival"],["🌾","El acopio de trigo y maíz pampeano"]], 0, "Pista: conectan la producción provincial con mercados de exportación."),
    q("¿Qué actividad económica dinamiza ciudades cordilleranas como El Calafate y El Chaltén?", [["🏨","Turismo de naturaleza, hotelería y gastronomía"],["🚜","El cultivo masivo de plantaciones de arroz bajo riego"],["🏭","La fabricación de computadoras y teléfonos"]], 0, "Pista: reciben visitantes de todo el mundo para conocer montañas y glaciares."),
    q("¿Qué monumento emblemático de Caleta Olivia rinde homenaje a los trabajadores del petróleo?", [["⛽","El Gorosito (Obrero Petrolero)"],["🗽","El Monumento a la Bandera en Rosario"],["🗼","El Obelisco porteño"]], 0, "Pista: una imponente figura de bronce en el centro de la ciudad."),
    q("¿Cómo obtienen energía eléctrica los puestos rurales muy alejados de las redes públicas?", [["☀️","Pantallas solares, molinos o generadores"],["🔌","Con tendidos de cables que atraviesan la meseta"],["🕯️","Exclusivamente con leña de monte"]], 0, "Pista: aprovechan la radiación solar y la fuerza del viento patagónico."),
    q("¿Qué institución garantiza la educación de los niños que viven en campos alejados?", [["🏫","Escuelas rurales con régimen de albergue"],["🎓","Las facultades universitarias con cursada virtual"],["🏢","Las oficinas del juzgado de paz"]], 0, "Pista: los chicos conviven y aprenden durante los días de clase."),
    q("¿Qué medio de transporte une habitualmente las estancias con los pueblos para buscar víveres?", [["🛻","Camionetas doble tracción"],["🛶","Canoas de madera navegando arroyos secos"],["✈️","Aviones comerciales diarios"]], 0, "Pista: circulan por caminos de ripio y huellas de campo."),
    q("¿Por qué el invierno exige una preparación especial en las estancias y poblados rurales?", [["❄️","Nevadas y heladas que aíslan caminos"],["☀️","Porque las altas temperaturas estropean los alimentos"],["🌪️","Porque llueve torrencialmente todos los días del año"]], 0, "Pista: deben acopiar forraje para animales, gas, leña y víveres secos."),
    q("¿Qué ciudad santacruceña es un centro logístico clave para el cruce a Tierra del Fuego?", [["🚛","Río Gallegos"],["🏔️","El Chaltén"],["🍒","Los Antiguos"]], 0, "Pista: por allí transitan camiones y autos rumbo al paso fronterizo Integración Austral."),
    q("¿Qué cultivo frutal intensivo caracteriza al espacio rural de Los Antiguos?", [["🍒","Cerezas y frutas finas"],["🍊","Cítricos como naranjas y mandarinas"],["🍇","Viñedos para pasas"]], 0, "Pista: se producen dulces, licores y frutas de exportación en chacras protegidas."),
    q("¿Cómo se llama el trabajo rural que consiste en juntar las ovejas dispersas en los cuadros del campo?", [["🐎","Arreo con caballos y perros ovejeros"],["🎣","La pesca artesanal con red de arrastre costera"],["🌾","La siembra con cosechadora"]], 0, "Pista: los puesteros recorren grandes distancias para llevar los piños al casco de la estancia."),
  ],

  // Mundo 4
  4: [
    q("¿Qué relieve montañoso recorre el oeste de Santa Cruz de norte a sur?", [["🏔️","Cordillera de los Andes"],["🌾","El sistema serrano de las Sierras Pampeanas"],["🏜️","La meseta misionera"]], 0, "Pista: tiene picos nevados, glaciares y lagos glaciarios."),
    q("¿Cómo es el relieve predominante en el centro de la provincia?", [["🌾","Mesetas escalonadas hacia el mar"],["🌴","Llanura selvática con lagunas y pantanos"],["🏖️","Dunas de arena del desierto cálido"]], 0, "Pista: planicies altas de basalto cortadas por cañadones y valles."),
    q("¿Qué formación costera domina gran parte del litoral marítimo de Santa Cruz?", [["🌊","Acantilados y canto rodado"],["🌴","Manglares costeros con altas raíces aéreas"],["🏖️","Playas de arenas blancas coralinas"]], 0, "Pista: paredes verticales de roca frente al mar con restingas."),
    q("¿Cómo se llaman las profundas grietas y zanjones que cortan las mesetas patagónicas?", [["🏞️","Cañadones"],["⛰️","Volcanes submarinos"],["🏜️","Oasis desérticos"]], 0, "Pista: como el famoso cañadón del río Pinturas."),
    q("¿Qué pico emblemático con forma de aguja de granito se eleva cerca de El Chaltén?", [["🏔️","Cerro Fitz Roy (Chaltén)"],["🏔️","Cerro Aconcagua en la cordillera mendocina"],["🏔️","Volcán Lanín"]], 0, "Pista: los pueblos originarios lo llamaban Chaltén ('montaña que fuma')."),
    q("¿Qué depresión profunda de Santa Cruz es el punto más bajo del continente americano?", [["📉","El Gran Bajo de San Julián (105 m bajo el nivel del mar)"],["📉","El Cañón del Colorado en América del Norte"],["📉","La Fosa de las Marianas"]], 0, "Pista: la Laguna del Carbón está a 105 metros bajo el nivel del mar."),
    q("¿Qué tipo de roca redondeada y pulida por el agua es típica de las costas y mesetas?", [["🪨","Canto rodado patagónico"],["🧱","Ladrillo de adobe cocido"],["💎","Cristal de cuarzo tallado"]], 0, "Pista: piedras lisas transportadas por antiguos glaciares y ríos."),
    q("¿Cómo se denomina la entrada marina profunda donde el mar invade el valle de un río?", [["🌊","Ría"],["🏝️","Archipiélago"],["💧","Arroyo de montaña"]], 0, "Pista: como la Ría Deseado, un verdadero brazo de mar."),
    q("¿Por qué las mesetas patagónicas reciben el nombre de «escalonadas»?", [["🪜","Descienden en terrazas escalón por escalón hacia el mar"],["📐","Fueron construidas con escalinatas de piedra"],["〰️","Porque están cubiertas de canales artificiales"]], 0, "Pista: forman terrazas geológicas que descienden hacia el este."),
    q("¿Qué cerro con un gran hueco natural da nombre a un paraje de Gobernador Gregores?", [["🪟","Cerro Ventana"],["🏔️","Cerro Catedral"],["⛰️","Cerro Pan de Azúcar"]], 0, "Pista: tiene una abertura en la roca que parece una ventana al cielo."),
    q("¿Qué formación costera rocosa queda al descubierto cuando baja la marea?", [["🦀","La restinga"],["🌴","La selva en galería"],["🏝️","El arrecife de coral"]], 0, "Pista: plataforma rocosa donde habitan pulpos, mejillones y algas."),
    q("¿Cuál de estos parques nacionales protege acantilados, rías y fauna costera en Santa Cruz?", [["🐧","Parque Nacional Monte León"],["🌴","Parque Nacional Iguazú en Misiones"],["🌵","Parque Nacional Talampaya"]], 0, "Pista: ubicado sobre la Ruta 3 en la costa atlántica de Corpen Aike."),
    q("¿Qué relieve encontramos en el Cañadón del Río Pinturas que alberga pinturas rupestres?", [["🎨","Paredones con aleros y cuevas"],["🌾","Médanos llanos de arena fina sin piedras"],["🏖️","Playas arenosas sin vegetación"]], 0, "Pista: cañadón profundo donde se ubica la Cueva de las Manos."),
    q("¿Qué nombre reciben las mesetas de basalto negro de origen volcánico en la provincia?", [["🌋","Mesetas basálticas (bardas)"],["❄️","Campos de nieve perpetua en alta montaña"],["🏖️","Médanos costeros móviles"]], 0, "Pista: formadas por antiguas coladas de lava solidificada."),
    q("¿Qué protege a los valles cordilleranos donde crecen cerezas y manzanos?", [["🛡️","Laderas que frenan los vientos"],["🏢","Muros cortavientos de cemento en las chacras"],["🌲","Palmeras tropicales de gran porte"]], 0, "Pista: crean microclimas benignos y resguardados."),
  ],

  // Mundo 5
  5: [
    q("¿Hacia qué océano desaguan los principales ríos que cruzan la provincia de Santa Cruz?", [["🌊","Río Santa Cruz"],["🌊","El río Paraná en el litoral argentino"],["🌊","Hacia el Océano Índico"]], 0, "Pista: nacen en la cordillera y desembocan en el Mar Argentino."),
    q("¿Cuál es el río más caudaloso que nace en los lagos glaciarios y cruza toda la provincia?", [["💧","El Río Santa Cruz"],["💧","El Río Bermejo"],["💧","El Río Salado"]], 0, "Pista: nace en el Lago Argentino y desemboca en Puerto Santa Cruz."),
    q("¿Qué río del norte santacruceño da nombre a un importante puerto y departamento?", [["🌊","Meseta de estepa árida"],["🌊","Grandes extensiones de campos inundados"],["🌊","El Río Dulce"]], 0, "Pista: su desembocadura forma una ría marina protegida."),
    q("¿Cuál es el lago más grande enteramente ubicado dentro de territorio argentino?", [["🏔️","El Lago Argentino"],["🏔️","El Lago Nahuel Huapi"],["🏔️","El Lago Lacar"]], 0, "Pista: baña los brazos del glaciar Perito Moreno y la costa de El Calafate."),
    q("¿Qué lago glaciar cordillerano alimenta al glaciar Viedma?", [["❄️","El Lago Viedma"],["🌴","La Laguna Mar Chiquita"],["🌾","La Laguna de Chascomús"]], 0, "Pista: sus aguas de color celeste lechoso provienen del deshielo."),
    q("¿Qué gran lago cordillerano es compartido entre Argentina y Chile, donde se llama O'Higgins?", [["🇨🇱","Lago Argentino"],["🇦🇷","Lago Nahuel Huapi en la provincia de Río Negro"],["🇦🇷","La Laguna del Carbón"]], 0, "Pista: tiene forma de brazos ramificados y cambia de nombre al cruzar la frontera."),
    q("¿Qué lago santacruceño de aguas azuladas se encuentra aislado en la meseta central?", [["🐟","Mar Argentino (Atlántico)"],["🐟","El Océano Pacífico cruzando la cordillera"],["🐟","El Lago Lácar"]], 0, "Pista: cuenca cerrada famosa por la pesca deportiva de truchas."),
    q("¿Qué gran lago compartido al norte de Santa Cruz baña las costas de Los Antiguos?", [["🍒","La cordillera retiene nubes del oeste"],["❄️","La cordillera frena el vapor de agua oceánico"],["🏔️","El Lago Traful"]], 0, "Pista: el segundo lago más grande de Sudamérica después del Titicaca."),
    q("¿Qué obras hidroeléctricas se construyen sobre el río Santa Cruz para generar energía?", [["⚡","Río Gallegos"],["⚡","El río Deseado que desemboca en el norte"],["⚡","La central hidroeléctrica El Chocón"]], 0, "Pista: aprovechan el gran caudal de deshielo del río Santa Cruz."),
    q("¿Qué río del centro de la provincia riega los valles de Gobernador Gregores?", [["🌾","El Río Chico"],["🌴","El Río Paraná"],["🌾","El Río Gualeguay"]], 0, "Pista: corre paralelo al río Santa Cruz hasta unirse cerca de la desembocadura."),
    q("¿Qué origen geológico tienen lagos como el Argentino, Viedma y San Martín?", [["❄️","Acelera la evaporación del suelo"],["🌋","El aire seco en circulación constante quita la humedad"],["🏖️","Olas marinas estancadas"]], 0, "Pista: excavados por las lenguas de hielo durante las glaciaciones."),
    q("¿Por qué el agua de los lagos glaciarios suele tener un color turquesa o lechoso?", [["💎","Lago San Martín"],["🧂","Lago Cardiel en el centro de la meseta"],["🧪","Por colorantes artificiales colocados para turistas"]], 0, "Pista: sedimentos muy finos pulverizados por el peso del hielo en movimiento."),
    q("¿Qué río del sur provincial desemboca en la ría de la capital provincial?", [["💧","El Río Gallegos"],["💧","El Río Colorado"],["💧","El Río Pilcomayo"]], 0, "Pista: le da nombre a la ciudad de Río Gallegos."),
    q("¿Cómo se llama la zona donde se mezclan el agua dulce del río con el agua salada del mar?", [["🌊","Estuario o ría"],["🏔️","Ventisquero de nieve"],["🌾","Cuadro de pastoreo"]], 0, "Pista: zona de mareas donde habitan peces, gaviotas y toninas."),
    q("¿Por qué los ríos patagónicos crecen notablemente durante los meses de primavera y verano?", [["☀️","Es un recurso vital y escaso en un ambiente árido"],["🍂","Para abastecer las fuentes de agua de otras provincias"],["🌧️","Porque no corre viento en la cordillera"]], 0, "Pista: el aumento de temperatura derrite la nieve acumulada en invierno."),
  ],

  // Mundo 6
  6: [
    q("¿Cuál es el rasgo climático más constante y característico de Santa Cruz?", [["💨","Fuertes y frecuentes vientos del oeste"],["🌧️","Lluvias torrenciales diarias sin viento"],["🌴","Humedad sofocante constante"]], 0, "Pista: soplan con gran velocidad desde el océano Pacífico."),
    q("¿Por qué llueve tan poco en la meseta central de Santa Cruz?", [["🏔️","La cordillera frena los vientos húmedos del Pacífico"],["☀️","Las nubes no logran elevarse sobre la meseta"],["🌊","Porque el mar absorbe toda el agua de lluvia"]], 0, "Pista: la cordillera actúa como una barrera climática; la lluvia cae del lado andino."),
    q("¿Cómo se clasifica el clima de la mayor parte del territorio santacruceño?", [["❄️","Frío árido de meseta o estepario"],["🌴","Cálido tropical húmedo de selva misionera"],["🌾","Templado pampeano lluvioso"]], 0, "Pista: temperaturas bajas a moderadas y escasas precipitaciones anuales."),
    q("¿Qué fenómeno de temperatura se registra entre el día y la noche en la meseta?", [["🌡️","Gran amplitud térmica día-noche"],["☀️","La misma temperatura constante durante todo el día"],["🌴","Noches sumamente calurosas"]], 0, "Pista: el cielo despejado y la aridez hacen que el calor se pierda rápido al anochecer."),
    q("¿En qué época del año se presentan las mayores nevadas en Santa Cruz?", [["❄️","En invierno (junio a agosto)"],["🌸","En los meses de primavera y verano cálido"],["☀️","En pleno verano"]], 0, "Pista: coincide con las temperaturas más bajas y heladas."),
    q("¿Por qué en verano los días son mucho más largos en el sur que en el norte del país?", [["☀️","Por la inclinación terrestre en latitudes australes"],["⏰","Porque los relojes atrasan tres horas en invierno"],["🌙","Porque la Luna no sale en verano"]], 0, "Pista: en diciembre amanece antes de las 5 y hay luz hasta pasadas las 22."),
    q("¿Qué instrumento meteorológico mide la velocidad del viento patagónico?", [["🌪️","El anemómetro"],["🌡️","El termómetro de mercurio"],["🌧️","El pluviómetro de tubo"]], 0, "Pista: tiene cazoletas giratorias que marcan los km/h."),
    q("¿Cómo influye el viento constante en el crecimiento de los árboles de la meseta?", [["🌳","Inclinados en dirección al viento ('árboles bandera')"],["🌴","Crecen erguidos con abundantes hojas verdes y flores"],["🌺","Dan flores tropicales coloridas"]], 0, "Pista: el viento poda las ramas del lado de donde sopla."),
    q("¿Cómo influye la cercanía de la cordillera en las precipitaciones de los bosques andinos?", [["🌲","Lluvias y nevadas que nutren bosques"],["🌵","Provoca aridez extrema sin desarrollo vegetal"],["🔥","Aumenta el calor del suelo"]], 0, "Pista: allí se descargan las nubes húmedas que vienen del oeste."),
    q("¿Qué fenómeno se produce cuando la temperatura baja de cero y congela el rocío?", [["❄️","La helada"],["🌧️","El granizo de verano"],["🌫️","El arcoíris"]], 0, "Pista: escarcha blanca sobre el pasto y vidrios de los autos."),
    q("¿Por qué en la costa marina las temperaturas invernales no son tan extremas como en el interior?", [["🌊","El mar modera las temperaturas"],["☀️","El agua marina mantiene temperatura de ebullición"],["🏔️","Porque no hay noche en la costa"]], 0, "Pista: las grandes masas de agua suavizan los cambios bruscos de temperatura."),
    q("¿Cómo se llama la sensación térmica de frío provocada por el viento fuerte?", [["🥶","Sensación térmica por viento"],["🌡️","Temperatura máxima registrada en el suelo"],["🔥","Ola de calor estival"]], 0, "Pista: el viento quita rápidamente el calor del cuerpo humano."),
    q("¿Qué vestimenta es tradicional en la Patagonia para protegerse del frío y viento?", [["🧣","Abrigo de lana y campera cortaviento"],["🩳","Mallas de natación y remeras musculosas de verano"],["🩴","Ojotas y sandalias abiertas"]], 0, "Pista: capas de abrigo que aíslen del viento helado."),
    q("¿En qué zona de la provincia encontramos un microclima benigno con frutales?", [["🍒","Cuenca del lago Buenos Aires y Los Antiguos"],["❄️","En los campos de hielo continental patagónico"],["🌊","En Cabo Vírgenes"]], 0, "Pista: protegido por montañas y templado por el gran lago."),
    q("¿Cuál es el promedio aproximado de lluvia anual en la estepa santacruceña?", [["💧","Menos de 200 a 300 mm al año"],["💧","Más de 2.000 milímetros acumulados al año"],["💧","5.000 milímetros al año"]], 0, "Pista: es una cantidad reducida, propia de un ambiente semidesértico."),
  ],

  // Mundo 7
  7: [
    q("¿Qué problema causan las nevadas extraordinarias en las rutas santacruceñas?", [["❄️","Acumulación de nieve y hielo en las rutas"],["🌴","Crecimiento repentino de densas selvas subtropicales"],["🏖️","Aumento de la temperatura del suelo"]], 0, "Pista: camiones y micros pueden quedar varados."),
    q("¿Qué erupción volcánica de 1991 cubrió de ceniza gran parte de Santa Cruz?", [["🌋","Erupción del volcán Hudson"],["🌋","La erupción del volcán Vesubio en el sur de Italia"],["🌋","El volcán Krakatoa"]], 0, "Pista: volcán cordillerano chileno cuyas cenizas llegaron al Atlántico."),
    q("¿Cómo afectó la ceniza volcánica del volcán Hudson a los animales en el campo?", [["🐑","Cubrió pasturas y desgastó dientes del ganado"],["🐠","Hizo crecer pelaje de diversos colores brillantes"],["🦅","Los obligó a construir nidos en árboles"]], 0, "Pista: la ceniza abrasiva tapa el pasto y daña los dientes de las ovejas."),
    q("¿Qué elemento de seguridad vial es obligatorio usar en los neumáticos con nieve?", [["⛓️","Cadenas para nieve"],["🛞","Ruedas de bicicleta"],["🎈","Flotadores de goma"]], 0, "Pista: dan agarre sobre el hielo para no patinar."),
    q("¿Qué máquinas de Vialidad trabajan despejando la nieve de las rutas provinciales?", [["🚜","Motoniveladoras y barrenieves"],["🚂","Locomotoras ferroviarias impulsadas a vapor"],["🚜","Cosechadoras de trigo"]], 0, "Pista: tienen grandes palas que empujan la nieve hacia la banquina."),
    q("¿Qué medida de precaución deben tomar las familias rurales antes de un temporal blanco?", [["📦","Acopiar leña, gas y alimentos no perecederos"],["🏖️","Comprar sombrillas y reposeras para la playa"],["🍦","Llenar la heladera de helados"]], 0, "Pista: pueden quedar aislados varios días por el frío y la nieve."),
    q("¿Por qué el congelamiento del suelo en invierno dificulta el trabajo en las obras?", [["🥶","La tierra se endurece por la escarcha"],["☀️","El suelo arcilloso se recalienta intensamente"],["🌊","Se forman olas gigantescas en las calles"]], 0, "Pista: el hielo en el suelo impide cavar zanjas o colocar cimientos."),
    q("¿Qué peligro representa el hielo negro en el asfalto para los conductores?", [["🚗","Capa transparente y resbaladiza difícil de ver"],["🛞","Tiñe las cubiertas de los autos de color oscuro"],["🛑","Frena el auto automáticamente"]], 0, "Pista: parece asfalto mojado pero hace derrapar el vehículo."),
    q("¿Qué organismo provincial coordina la ayuda ante emergencias climáticas y rescates?", [["🚨","Defensa Civil y Vialidad Provincial"],["🎭","La federación provincial de clubes de fútbol"],["🏟️","El club deportivo de básquet"]], 0, "Pista: organizan caravanas de auxilio y distribuyen asistencia."),
    q("¿Cómo se llama la tormenta con viento helado que levanta nieve y quita toda visibilidad?", [["🌨️","Viento blanco o ventisca"],["☀️","Viento zonda cálido y seco de las laderas andinas"],["🌪️","Huracán tropical"]], 0, "Pista: el horizonte se vuelve totalmente blanco y se pierde la orientación."),
    q("¿Qué daño provocan las heladas tardías en las chacras de Los Antiguos?", [["🌸","Queman brotes y flores de cerezos en primavera"],["🍎","Aceleran la maduración precoz de los frutos de chacra"],["🐛","Atraen plagas de langostas tropicales"]], 0, "Pista: si hiela cuando la planta florece, no se forma el fruto."),
    q("¿Por qué los techos de las casas en la cordillera suelen tener mucha pendiente?", [["🏠","Para que la nieve resbale y no pese en el techo"],["📐","Para que las aves aniden sobre las tejas del techo"],["🧱","Para gastar menos tejas en la construcción"]], 0, "Pista: la nieve acumulada puede quebrar las vigas de madera."),
    q("¿Qué protección usan las personas en la meseta cuando el viento levanta polvo o ceniza?", [["😷","Barbijos, pañuelos y antiparras"],["🕶️","Lentes de sol comunes de plástico sin protección"],["🎩","Sombreros de copa alta"]], 0, "Pista: evitan que el polvo ingrese en los pulmones y lastime la vista."),
    q("¿Cómo protegen los productores a las ovejas recién nacidas en temporales fríos?", [["🐑","Corrales protegidos o galpones"],["🌳","Las suben a las copas de los árboles más altos"],["🏔️","Las llevan a la cima de los cerros"]], 0, "Pista: los corderos recién nacidos son muy vulnerables a la hipotermia."),
    q("¿Qué precaución básica debe tomar un vehículo antes de viajar por rutas santacruceñas en invierno?", [["🛞","Llevar abrigo, cadenas, pala chica y comida"],["🍦","Llevar ropa ligera, ventiladores portátiles y gaseosas"],["📻","Viajar con las ventanillas bajas"]], 0, "Pista: estar preparado ante una posible detención imprevista en la banquina."),
  ],

  // Mundo 8
  8: [
    q("¿Cuál es el parque nacional más famoso de Santa Cruz, declarado Patrimonio Mundial?", [["❄️","Ganadería ovina (ovejas)"],["🌲","Ganadería vacuna lechera en pasturas húmedas"],["🐊","Parque Nacional Río Pilcomayo"]], 0, "Pista: protege los glaciares Perito Moreno, Upsala y cerros como el Fitz Roy."),
    q("¿Qué parque nacional santacruceño sobre la costa atlántica protege pingüineras y restingas?", [["🐧","Petróleo y gas natural"],["🌴","Tala indiscriminada de bosques tropicales de madera"],["🌵","Parque Nacional Sierra de las Quijadas"]], 0, "Pista: ubicado sobre la Ruta Nacional 3 en Corpen Aike."),
    q("¿Qué parque nacional protege gigantescos troncos de araucarias fosilizadas de millones de años?", [["🪵","Carbón mineral fósil"],["🌲","Yacimientos subterráneos de carbón vegetal reciente"],["🌴","Parque Nacional Chaco"]], 0, "Pista: se ubica en el noreste santacruceño cerca de Jaramillo."),
    q("¿Desde qué localidad del centro santacruceño se accede al agreste Parque Nacional Perito Moreno?", [["🏔️","Oro y plata en vetas"],["⚓","Extracción artesanal de sal común de mesa"],["⛽","Caleta Olivia"]], 0, "Pista: se llega recorriendo las rutas 40 y 37 hacia la cordillera."),
    q("¿Qué sitio arqueológico de la cuenca del río Pinturas es Patrimonio de la Humanidad?", [["🖐️","Pesca marítima de langostino y calamar"],["🏛️","La cosecha industrial de granos de trigo y maíz"],["🗿","El Pucará de Tilcara"]], 0, "Pista: pinturas rupestres con negativos de manos de hace más de 9.000 años."),
    q("¿Cuál es la función principal de los Parques Nacionales y reservas en nuestra provincia?", [["🛡️","Conservar biodiversidad y patrimonio cultural"],["🏭","Fábricas siderúrgicas de fundición de acero"],["🚜","Desmontar la vegetación para siembra"]], 0, "Pista: protegen especies autóctonas y ambientes vírgenes para futuras generaciones."),
    q("¿Qué ave endémica santacruceña en peligro crítico se protege en el Parque Nacional Patagonia?", [["🦆","El macá tobiano"],["🦜","El loro barranquero"],["🦩","El flamenco rosado"]], 0, "Pista: vive en las lagunas de altura de las mesetas del noroeste provincial."),
    q("¿Qué animal autóctono es el carnívoro tope protegido en los parques santacruceños?", [["🐾","Parques de energía eólica"],["🐯","Parques de energía nuclear de alta potencia"],["🐺","El lobo del ártico"]], 0, "Pista: felino nativo que se alimenta de guanacos y liebres."),
    q("¿Qué personal capacitado cuida los senderos y fauna dentro de los parques nacionales?", [["🤠","Lana virgen en vellones para hilanderías"],["👨‍🍳","Quesos madurados y embutidos para exportar"],["👨‍✈️","Los pilotos de avión"]], 0, "Pista: vigilan, guían visitantes y realizan censos de fauna nativa."),
    q("¿Por qué los visitantes deben regresar con toda su basura cuando visitan un parque?", [["🚯","Tardan millones de años en regenerarse"],["🎒","Crecen de forma natural tras las lluvias estivales"],["🎁","Para regalarla a los vecinos"]], 0, "Pista: la regla de oro en áreas protegidas es 'no dejar rastros'."),
    q("¿Qué ciervo autóctono en peligro de extinción habita los bosques cordilleranos de Santa Cruz?", [["🦌","Represas Néstor Kirchner y Jorge Cepernic"],["🦌","Grandes canales de riego para cañaverales"],["🦌","El alce de montaña"]], 0, "Pista: figura en el escudo nacional y es Monumento Natural Nacional."),
    q("¿Qué monumento natural protege a la majestuosa ballena que visita las costas patagónicas?", [["🐋","Sector primario extractivo"],["🐬","Sector secundario de fábricas automotrices"],["🦈","Monumento al tiburón azul"]], 0, "Pista: protegida por leyes nacionales e internacionales en todo el mar argentino."),
    q("¿Por qué está prohibido hacer fuego en lugares no habilitados de los parques?", [["🔥","Para evitar incendios forestales destructivos"],["💨","Porque el humo atrae mosquitos molestos"],["☀️","Porque calienta el aire del parque"]], 0, "Pista: un fuego mal apagado con el viento patagónico puede destruir miles de hectáreas."),
    q("¿Qué árbol milenario protegido crece en los bosques andinos del sur patagónico?", [["🌲","Por gasoductos troncales subterráneos"],["🌴","Camiones cisterna individuales de reparto barrial"],["🌳","El gomero de jardín"]], 0, "Pista: bosques nativos que cambian sus hojas a rojo y dorado en otoño."),
    q("¿Qué pingüino anida en grandes colonias protegidas en Monte León y Cabo Vírgenes?", [["🐧","El pingüino de Magallanes"],["🐧","El pingüino emperador antártico"],["🐧","El pingüino rey de las islas"]], 0, "Pista: llega cada primavera a la costa para empollar sus huevos en cuevas."),
  ],

  // Mundo 9
  9: [
    q("¿Qué animal es la base histórica de la ganadería tradicional en Santa Cruz?", [["🐑","Fases desde la materia prima al consumidor"],["🐄","Una pista asfaltada para carreras de autos deportivos"],["🐖","El cerdo de criadero"]], 0, "Pista: adaptada a la estepa y pastos duros de la meseta."),
    q("¿Qué producto principal se obtiene del ganado ovino para su venta internacional?", [["🧶","Esquila de ovejas en la estancia"],["🥛","La esquila mecánica y prensado en el galpón"],["🍯","La miel de flores"]], 0, "Pista: se empaca en fardos prensados y se exporta a hilanderías textiles."),
    q("¿Cómo se llama el proceso de cortar la lana a las ovejas en la estancia?", [["✂️","Venta de suéteres y mantas en tiendas"],["🌾","La venta de prendas tejidas en tiendas de ropa"],["🚜","El desmalezado"]], 0, "Pista: se realiza en primavera para que el animal no sufra calor ni frío excesivo."),
    q("¿Cómo se denomina al grupo de trabajadores especializados que viaja de estancia en estancia esquilando?", [["👥","Procesamiento en plantas pesqueras"],["🎭","Barcos factoría congeladores y plantas pesqueras"],["⚽","El equipo de fútbol de salón"]], 0, "Pista: incluye esquiladores, agarradores, agarradoras de vellón y prensadores."),
    q("¿Qué parte de la estancia está acondicionada con máquinas y mesas para esquilar?", [["🏭","Gasoductos troncales como el San Martín"],["🏡","Camiones con garrafas de diez kilogramos"],["🌾","El molino de viento"]], 0, "Pista: edificio amplio con bretes, mesas de clasificación y prensa de fardos."),
    q("¿Cómo se llama el paquete compacto de lana prensada listo para transporte?", [["📦","Extracción de petróleo en pozos"],["🥖","Siembra y cosecha de plantas de maíz híbrido"],["🥫","Caja metálica"]], 0, "Pista: pesa alrededor de 200 a 250 kg y se ata con alambres."),
    q("¿Qué raza ovina es la más criada en Santa Cruz por la finura de su lana?", [["🐑","Venta de nafta en estaciones de servicio"],["🐂","Venta final de naftas y lubricantes en estaciones"],["🐴","Criollo argentino"]], 0, "Pista: razas resistentes al frío con vellones blancos y rendidores."),
    q("¿Qué tarea realiza el 'agarrador' durante la jornada de esquila?", [["🚪","Se extrae de pozos y viaja por acueductos"],["🍳","Se extrae directamente de nubes de tormenta marina"],["🚛","Maneja el camión en la ruta"]], 0, "Pista: sujeta al animal con cuidado para llevarlo a la tijera mecánica."),
    q("¿Cómo se llama la división del campo en grandes parcelas alambradas en una estancia?", [["🔲","Sector terciario comercial y de servicios"],["🏢","Sector primario de cría y pastoreo ovino"],["🛣️","Las calles peatonales"]], 0, "Pista: permiten rotar el ganado para que el pasto descanse."),
    q("¿Qué animal es el aliado indispensable del peón rural para arrear ovejas?", [["🐕","Se descompone si pierde la cadena de frío"],["🐱","Se pudre y pierde valor comercial en pocos días"],["🦅","El halcón peregrino"]], 0, "Pista: obedece silbidos y órdenes para rodear y guiar el piño de ovejas."),
    q("¿Qué producto cárnico típico de la cocina patagónica proviene de los ovinos?", [["🥩","Lavado y peinado en hilanderías"],["🍣","Hilanderías industriales y talleres textiles"],["🍗","La pechuga de pollo"]], 0, "Pista: plato tradicional asado lentamente a la estaca o a la parrilla."),
    q("¿Por qué es importante no colocar más ovejas de las que el pasto natural puede alimentar?", [["🌱","Trabajo, transporte, energía y tecnología"],["🐑","Disminución del interés de compradores mayoristas"],["💰","Porque cobran más impuestos por oveja"]], 0, "Pista: si comen las raíces, el viento vuela la tierra fértil."),
    q("¿En qué época del año se realiza tradicionalmente la 'zafra' lanera en la provincia?", [["🗓️","Entre octubre y enero (primavera y verano)"],["❄️","La cosecha de cerezas frescas en cajones"],["🍂","A fines de otoño en mayo"]], 0, "Pista: cuando el clima mejora y antes de los calores más fuertes."),
    q("¿Hacia qué destinos se transportan los fardos de lana desde las estancias?", [["🚢","Hacia barracas de acopio y puertos de salida"],["🏖️","Ruta Nacional 40 a lo largo de la cordillera"],["🛒","Directo a supermercados locales"]], 0, "Pista: se exporta a países como China, Alemania e Italia para prendas de abrigo."),
    q("¿Cómo se llama la casa pequeña y aislada donde vive el puestero vigilando un sector del campo?", [["🏠","Genera empleo y desarrollo en los pueblos"],["🏨","Permite suprimir impuestos provinciales y locales"],["🏰","El castillo fortificado"]], 0, "Pista: vivienda rural ubicada a kilómetros del casco central de la estancia."),
  ],

  // Mundo 10
  10: [
    q("¿Qué dos importantes recursos energéticos fósiles se extraen del subsuelo santacruceño?", [["⛽","Alto poder calórico para fogones"],["🪵","Poco valor calórico y difícil encendido fogonero"],["🌾","Biocombustible de soja"]], 0, "Pista: hidrocarburos utilizados para naftas, calefacción e industrias."),
    q("¿Qué gran cuenca hidrocarburífera comparte Santa Cruz con Chubut en el norte?", [["🌊","Langostino, calamar y merluza"],["🌴","Camarones tropicales y langostas gigantes"],["🏔️","La Cuenca Cuyana"]], 0, "Pista: rodea ciudades como Caleta Olivia, Pico Truncado y Las Heras."),
    q("¿Qué cuenca petrolera y gasífera se encuentra en el sur provincial y en el estrecho?", [["📍","Producen lana merino de exportación"],["🌴","Elaboran quesos ovinos en tambos cooperativos"],["🌾","La Cuenca Pampeana"]], 0, "Pista: abarca Río Gallegos y plataformas marinas en el Atlántico."),
    q("¿Qué localidad de la cordillera sur es la capital del carbón mineral de Santa Cruz?", [["⛏️","Congelado a bordo para preservar frescura"],["🍒","Congelado rápido a bordo para conservar frescura"],["⚓","Puerto San Julián"]], 0, "Pista: cuenta con la mina subterránea de carbón de YCRT."),
    q("¿Qué metales preciosos se extraen en yacimientos del Macizo del Deseado como Cerro Vanguardia?", [["🥇","Pozos perforados en la plataforma marina"],["🪙","Se extrae directamente de las olas de la orilla"],["🔩","Hierro y aluminio"]], 0, "Pista: minerales valiosos presentes en rocas volcánicas antiguas."),
    q("¿Cómo se llaman las estructuras mecánicas con balancín que extraen petróleo en los pozos?", [["🛢️","Aparatos de bombeo ('cigüeñas' o balancines)"],["🚜","Siembra directa de granos de soja transgénica"],["🚂","Vagones cisterna de ferrocarril"]], 0, "Pista: suben y bajan continuamente bombeando el fluido del pozo."),
    q("¿Por medio de qué grandes tuberías subterráneas viaja el gas natural santacruceño a Buenos Aires?", [["🔧","Gasoductos troncales como el San Martín"],["🚛","Baja la cotización de los cortes cárnicos ovinos"],["🚂","Barcos de carga a vapor"]], 0, "Pista: cañerías metálicas de miles de kilómetros que transportan gas a alta presión."),
    q("¿Qué puerto cercano a Caleta Olivia fue construido para la actividad pesquera y petrolera?", [["⚓","Lavaderos mecánicos con centrifugado"],["🚢","Lavaderos mecánicos con centrifugado industrial"],["⚓","Puerto Madryn"]], 0, "Pista: puerto de ultramar al sur de Caleta Olivia."),
    q("¿Por qué el carbón mineral de Río Turbio fue estratégico para el desarrollo nacional?", [["🚂","Alimentaba trenes, barcos y usinas eléctricas"],["🥖","Puerto Madryn en la vecina provincia del Chubut"],["🚗","Porque servía como combustible directo en autos"]], 0, "Pista: fuente de energía nacional antes de la expansión del gas natural."),
    q("¿Qué parque eólico aprovecha el viento cerca de Pico Truncado y Jaramillo?", [["💨","Cámaras de frío y controles sanitarios estrictos"],["⚡","Venden exclusivamente en ferias barriales de frutas"],["☀️","Paneles solares flotantes en el mar"]], 0, "Pista: molinos gigantes con aspas que generan energía limpia."),
    q("¿Qué equipo de protección obligatorio usan los trabajadores en los yacimientos petroleros?", [["👷","Casco, botines, mameluco ignífugo y antiparras"],["🎩","Transporte marítimo en buques tanque petroleros"],["🩳","Traje de baño de secado rápido"]], 0, "Pista: elementos de seguridad industrial para prevenir accidentes."),
    q("¿Qué mineral no metalífero muy común se explota en salinas santacruceñas?", [["🧂","Pastoreo rotativo en cuadros del campo"],["💎","Aumentar el número de animales sin rotar potreros"],["🪨","Mármol verde de montaña"]], 0, "Pista: se cosecha en lagunas saladas secas de la meseta."),
    q("¿Qué empresa estatal histórica impulsó el descubrimiento de petróleo en el país?", [["🇦🇷","Camiones con acoplado y barcos de carga"],["🚂","El transporte aéreo exclusivo de cargas pesadas"],["✈️","Aerolíneas Argentinas"]], 0, "Pista: creada en 1922 bajo la dirección del general Enrique Mosconi."),
    q("¿Por qué los hidrocarburos se consideran recursos naturales 'no renovables'?", [["⏳","Facilita la salida de cargas al mercado mundial"],["🌱","Permite la llegada de cruceros turísticos de lujo"],["💧","Porque caen con la lluvia de primavera"]], 0, "Pista: una vez extraídos de los yacimientos, no vuelven a generarse en tiempo humano."),
    q("¿Cómo se llama el barco tanque diseñado especialmente para transportar petróleo crudo por mar?", [["🚢","Refinación en plantas destiladoras"],["⛵","La venta de combustible en estaciones de servicio"],["🛶","Canoa costera"]], 0, "Pista: gigantescas naves con compartimentos estancos para transportar combustible."),
  ],

  // Mundo 11
  11: [
    q("¿Qué ciudad santacruceña es conocida internacionalmente como Capital Nacional del Trekking?", [["🥾","Pérdida de suelo fértil y vegetación"],["🍒","Anegamiento continuo por lluvias torrenciales"],["⚓","Puerto Santa Cruz"]], 0, "Pista: punto de partida de caminantes de todo el mundo hacia el Fitz Roy y cerro Torre."),
    q("¿Cuál es el principal atractivo natural que atrae turistas a El Calafate?", [["❄️","Sobrepastoreo que supera la capacidad del campo"],["🌴","El paso de camionetas por las rutas asfaltadas"],["🏖️","Las playas con cocoteros"]], 0, "Pista: pared de hielo de más de 60 metros sobre el Lago Argentino."),
    q("¿Qué especie marina comercial de alto valor se pesca y congela en Puerto Deseado?", [["🦑","Erosión eólica por el viento seco"],["🐡","La radiación solar nocturna en el campo"],["🐟","La trucha de arroyo de montaña"]], 0, "Pista: barcos poteros y tangoneros operan en la temporada de pesca marítima."),
    q("¿Qué servicios forman parte del sector terciario vinculado al turismo en las ciudades?", [["🏨","Rotar cuadros para que el pasto descanse"],["🐑","Duplicar la cantidad de hacienda en el mismo potrero"],["🌾","Cosecha de pasturas de alfalfa"]], 0, "Pista: servicios que atienden a los viajeros durante su estadía."),
    q("¿Cómo se llama el mamífero marino blanco y negro que puede verse nadando en la Ría Deseado?", [["🐬","Mata negra, neneo y coirón nativo"],["🐋","Palmeras exóticas de jardines residenciales"],["🦭","La morsa del polo norte"]], 0, "Pista: pequeño delfín saltarín típico de las costas del Mar Argentino."),
    q("¿Qué actividad deportiva de montaña convoca escaladores expertos en El Chaltén?", [["🧗","Quedan en alambrados y dañan a los animales"],["🏄","Aportan minerales nutritivos para los pastos tiernos"],["🏇","Las carreras de caballos en hipódromos"]], 0, "Pista: paredes de granito consideradas de las más desafiantes del planeta."),
    q("¿Qué puerto de la ría del río Gallegos despacha carbón, pesca y productos industriales?", [["⚓","Contaminación hídrica y daño a la fauna marina"],["🚢","Mejora en la potabilidad de las corrientes de agua"],["⚓","Puerto Belgrano"]], 0, "Pista: puerto de aguas profundas en la margen sur de la ría."),
    q("¿Qué aeropuerto internacional conecta a El Calafate con Buenos Aires y el resto del país?", [["✈️","Proteger las napas subterráneas de agua y suelo"],["✈️","Reducir el consumo de energía en oficinas públicas"],["✈️","El Aeroparque porteño"]], 0, "Pista: inaugurado en el año 2000, multiplicó la llegada de turistas."),
    q("¿Qué tipo de barco pesca calamares durante la noche atrayéndolos con potentes luces?", [["💡","Rosa mosqueta y sauce invasor"],["🛶","El coirón fueguino de hojas coriáceas"],["⛵","Los veleros de paseo"]], 0, "Pista: forman una verdadera 'ciudad de luces' sobre el mar argentino."),
    q("¿Por qué el turismo es una actividad económica generadora de mucho empleo local?", [["💼","Almohadillas suaves que no rompen el suelo"],["🤖","Caminan sobre pezuñas partidas de borde afilado"],["🌾","Porque solo funciona los días de lluvia"]], 0, "Pista: involucra atención directa y personalizada a miles de visitantes."),
    q("¿Qué producto artesanal de pastelería es el más buscado por los turistas en El Calafate?", [["🍫","El clima es árido y el agua es escasa"],["🥥","El agua contiene sedimentos salinos que la inutilizan"],["🥭","Los jugos de mango tropical"]], 0, "Pista: dicen que 'quien come calafate, siempre vuelve a la Patagonia'."),
    q("¿Qué reserva marina protege colonias de pingüinos de penacho amarillo en Puerto Deseado?", [["🐧","Separación en origen y reciclaje"],["🌴","Quemar bolsas de polietileno al aire libre"],["🐊","Los esteros del Iberá"]], 0, "Pista: isla accesible en lancha con pingüinos de cejas amarillas vistosas."),
    q("¿Qué tipo de turismo fomenta el conocimiento científico de fósiles y pinturas rupestres?", [["🦴","Turismo cultural y paleontológico"],["🛍️","Álbum de fotografías panorámicas de la obra"],["🎢","Los parques de diversiones mecánicos"]], 0, "Pista: visitas a la Cueva de las Manos y al Bosque Petrificado."),
    q("¿Qué profesión tienen las personas que orientan y relatan la historia en las excursiones?", [["🗺️","El visón americano que ataca aves nativas"],["👨‍⚖️","El caballo criollo en campos de pastoreo"],["👨‍💻","Los programadores de software"]], 0, "Pista: explican en varios idiomas la geología, flora, fauna y leyendas del lugar."),
    q("¿Por qué es crucial respetar las temporadas de veda en la pesca marina?", [["🐟","Cuidar la vegetación y no prender fuego"],["🚢","Circular en cuatriciclos fuera de las huellas habilitadas"],["🏖️","Para que la playa esté despejada en vacaciones"]], 0, "Pista: garantiza que el recurso pesquero siga existiendo para el futuro."),
  ],

  // Mundo 12
  12: [
    q("¿Qué es el proceso de desertificación que afecta a muchas mesetas de Santa Cruz?", [["🏜️","Conservar muestras de ecosistemas nativos"],["🌴","Cobrar entradas para recaudar fondos comerciales"],["🌊","La inundación constante por aguas de río"]], 0, "Pista: la tierra queda seca, arenosa y desprotegida."),
    q("¿Cuál es una de las principales causas humanas de la desertificación en la estepa patagónica?", [["🐑","Sobrepastoreo ovino que daña la vegetación"],["🚗","Parque Nacional El Palmar en Entre Ríos"],["✈️","El vuelo de aviones a gran altura"]], 0, "Pista: cuando hay demasiadas ovejas, comen las raíces de los pastos."),
    q("¿Qué agente natural acelera la erosión una vez que el pasto desapareció del suelo?", [["💨","El viento que vuela la tierra del suelo"],["☀️","Apostaderos de focas peleteras y lobos marinos"],["🦗","Los cantos de los grillos"]], 0, "Pista: erosión eólica: el viento levanta tolvaneras de tierra y arena."),
    q("¿Qué práctica ganadera sustentable ayuda a recuperar los pastizales naturales?", [["🔄","El pastoreo rotativo en cuadros del campo"],["🐑","Un denso bosque de coníferas siempreverdes"],["🔥","Quemar los arbustos de mata negra"]], 0, "Pista: cambiar los animales de potrero permite que las plantas semillen y crezcan."),
    q("¿Qué arbusto nativo espinoso cumple un rol clave frenando el avance del viento en el suelo?", [["🌿","Senderismo guiado por caminos habilitados"],["🌴","Construir complejos hoteleros dentro del parque"],["🎋","La caña de bambú"]], 0, "Pista: arbustos en cojín achaparrados que retienen la humedad."),
    q("¿Cómo afecta la basura plástica arrojada al viento en los campos patagónicos?", [["🚯","Engancha en alambrados y contamina campos"],["🌱","Los restos fósiles de dinosaurios carnívoros"],["💧","Genera vertientes de agua dulce"]], 0, "Pista: las bolsas plásticas no se degradan y los animales pueden ingerirlas."),
    q("¿Qué problema puede generar el vertido de aguas servidas sin tratamiento en ríos o rías?", [["🧪","Monumento Natural protegido por ley"],["💧","Especie común declarada plaga para la ganadería"],["🐟","Crecimiento de truchas gigantes"]], 0, "Pista: las plantas depuradoras de líquidos cloacales son esenciales."),
    q("¿Por qué es fundamental que la minería y el petróleo utilicen tecnología de remediación ambiental?", [["🛡️","Evitar contaminar napas y aguas subterráneas"],["💰","El Parque Nacional Iguazú en la provincia de Misiones"],["🚚","Para transportar menos carga en las rutas"]], 0, "Pista: proteger el agua de la meseta es vital para la vida y la ganadería."),
    q("¿Qué especie vegetal exótica invasora se expandió en algunos valles compitiendo con la flora nativa?", [["🌹","Apostaderos de pingüinos y lobos marinos"],["🌾","Comprar recuerdos en las tiendas de artesanías"],["🌲","El bosque de lengas andino"]], 0, "Pista: plantas traídas de otros continentes que colonizan las márgenes de ríos."),
    q("¿Qué rol cumplen los guanacos en el ecosistema respecto a sus pisadas en el suelo?", [["🐾","Almohadillas suaves que no rompen el suelo"],["🥾","Las pinturas rupestres de la Cueva de las Manos"],["🚜","Aran el campo con sus garras"]], 0, "Pista: el guanaco evolucionó millones de años en la Patagonia sin dañar el suelo."),
    q("¿Por qué el agua dulce es un recurso que debe cuidarse al máximo en Santa Cruz?", [["💧","Preservar su hábitat y evitar su extinción"],["🌊","Para poder fotografiarlas sin permiso de guardaparques"],["🌧️","Porque llueve todos los días en la meseta"]], 0, "Pista: los ríos nacen en los glaciares y la meseta casi no tiene vertientes."),
    q("¿Qué acción en las escuelas y hogares ayuda a disminuir la cantidad de residuos que van al basural?", [["♻️","Separación en origen y reutilización"],["🔥","El guanaco y la mara patagónica de estepa"],["🗑️","Tirar los residuos en zanjones secos"]], 0, "Pista: separar cartón, vidrio, plástico y aluminio."),
    q("¿Cómo se llama el estudio técnico que debe realizarse antes de iniciar una gran obra industrial?", [["📋","Prevenir incendios y cuidar la fauna silvestre"],["🖼️","Permitir la caza deportiva durante el invierno"],["📜","Carta de felicitación municipal"]], 0, "Pista: evalúa los posibles daños y exige medidas de mitigación."),
    q("¿Qué especie animal introducida para peletería se convirtió en una amenaza para aves en las lagunas?", [["🦦","El huemul y el macá tobiano"],["🐑","El oso hormiguero gigante de selvas chaqueñas"],["🐴","El caballo criollo"]], 0, "Pista: mamífero carnívoro invasor que ataca los nidos del macá tobiano."),
    q("¿Qué compromiso ciudadano es clave para preservar la naturaleza patagónica?", [["🌿","Transitar senderos y regresar con residuos"],["🚗","Hacer fogones con leña de arbustos nativos protegidos"],["🚯","Dejar latas vacías en la meseta"]], 0, "Pista: la conservación del patrimonio natural depende de la responsabilidad de todos."),
  ],

  // Mundo 13
  13: [
    q("¿Cómo era el modo de vida de los Aonikenk (tehuelches del sur) antes de la llegada europea?", [["🏹","Cazadores nómadas que recorrían la estepa"],["🌾","Agricultores sedentarios asentados en pueblos estables"],["⛵","Eran comerciantes marítimos de barcos a vela"]], 0, "Pista: seguían los movimientos de las manadas de guanacos y choiques."),
    q("¿Qué animal autóctono era la base de su alimentación, abrigo y vivienda?", [["🦙","Guanacos y choiques para carne y cuero"],["🐄","Boleadoras de piedra pulida con tientos de cuero"],["🐎","El caballo europeo"]], 0, "Pista: aprovechaban su carne, tendones para hilos y cueros para abrigo."),
    q("¿Cómo se llamaba la manta de piel de guanaco con el pelo hacia adentro que vestían?", [["🧥","Caza de animales y recolección de frutos"],["👘","La agricultura intensiva de terrazas con regadío"],["👔","La túnica romana"]], 0, "Pista: los cueros se sobaban hasta dejarlos suaves y se pintaban con motivos geométricos."),
    q("¿Cómo era la vivienda transportable de los Aonikenk en sus campamentos nómadas?", [["⛺","Pinturas rupestres de manos y guanacos"],["🏰","Construcciones de templos de piedra tallada"],["🪵","Una cabaña fija de troncos cortados"]], 0, "Pista: fácil de desarmar y cargar cuando cambiaban de sitio de caza."),
    q("¿Qué arma arrojadiza con bolas de piedra y tientos de cuero utilizaban para cazar guanacos?", [["🪨","El cañadón del río Pinturas"],["🏹","El río Paraná en el litoral fluvial mesopotámico"],["🗡️","La espada de hierro"]], 0, "Pista: se revoleaban sobre la cabeza y se lanzaban a las patas del animal."),
    q("¿Cómo se organizaban socialmente los Aonikenk?", [["👨‍👩‍👧‍👦","Puntas de proyectil y cuchillos de piedra"],["👑","Herramientas de hierro fundido y bronce templado"],["🏛️","En asambleas con voto por internet"]], 0, "Pista: pequeños grupos unidos por lazos de parentesco y cooperación."),
    q("¿Qué animal traído por los europeos adoptaron en el siglo XVIII transformando su movilidad?", [["🐎","Pinturas minerales con grasa animal"],["🐪","Finos tejidos de algodón teñidos con tintes vegetales"],["🐘","El elefante de carga"]], 0, "Pista: se volvieron jinetes extraordinarios capaces de cazar a la carrera."),
    q("¿Qué arte ancestral dejaron plasmado en las paredes de cuevas y cañadones santacruceños?", [["🎨","Se trasladaban tras manadas de animales"],["🖼️","Porque comerciaban con naves marítimas de ultramar"],["雕","Estatuas de mármol pulido"]], 0, "Pista: testimonio artístico milenario visible en la Cueva de las Manos."),
    q("¿De qué color obtenían tinturas naturales mezclando minerales con grasa animal?", [["🖌️","Toldos de cuero fáciles de desarmar"],["🧪","Ciudades amuralladas con grandes plazas ceremoniales"],["🟣","Pintura acrílica plástica"]], 0, "Pista: pigmentos minerales machacados y fijados con grasa o fluidos."),
    q("¿Cómo conservaban la carne de guanaco para tener alimento durante semanas?", [["🥩","Boleadoras de piedra arrojadizas"],["🧊","El arco y flecha traído por navegantes europeos"],["🥫","La envasaban en latas de conserva selladas"]], 0, "Pista: el secado al aire seco patagónico preserva la carne sin descomponerse."),
    q("¿Qué ser mítico de su cosmovisión modeló la tierra patagónica y enseñó a los hombres a cazar?", [["🌟","Abundancia de agua dulce, reparo y caza"],["🐉","Por la cercanía a rutas comerciales interoceánicas"],["⚡","El dios Zeus del olimpo"]], 0, "Pista: figura central de los relatos tradicionales aonikenk en la meseta y Chaltén."),
    q("¿Qué frutos silvestres recolectaban para alimentarse durante el verano?", [["🫐","Soplando pigmento alrededor de la mano"],["🍌","Morteros de piedra para moler granos de trigo"],["🍇","Uvas de viñedos regados"]], 0, "Pista: bayas silvestres ricas en vitaminas que maduran en enero."),
    q("¿Por qué no tenían fronteras rígidas entre el este y el oeste de la Patagonia?", [["🧭","Testimonio del modo de vida originario"],["🛑","Un atractivo turístico para excursiones de fin de semana"],["🏰","Porque vivían encerrados en fuertes"]], 0, "Pista: los límites de países se crearon siglos después, en el siglo XIX y XX."),
    q("¿Cómo encendían fuego en la meseta sin fósforos?", [["🔥","A pie cargando sus pertenencias en fardos"],["⚡","Uso de animales de tiro como bueyes o caballos"],["🕯️","Con encendedores a gas comprimido"]], 0, "Pista: técnicas ancestrales con chispas de piedra sobre plumón de ave o pasto seco."),
    q("¿Qué valor tenía el saludo y la hospitalidad en los campamentos aonikenk?", [["🤝","Trabajo arqueológico con excavaciones"],["⚔️","Lectura de libros impresos en imprentas coloniales"],["💰","Cobraban monedas de oro por saludar"]], 0, "Pista: compartir el fuego, la carne y el tabaco consolidaba la amistad entre familias."),
  ],

  // Mundo 14
  14: [
    q("¿Dónde habitaba el pueblo cazador de los Selk'nam (onas)?", [["🏹","Toldos de cuero de guanaco y postes"],["⛵","Casas fijas de piedra con techos de tejas cocidas"],["🌴","En las selvas misioneras del norte"]], 0, "Pista: cazadores pedestres del guanaco y del coruro en el sur fueguino."),
    q("¿Dónde habitaban los Yámanas (o yaganes) en el confín austral de América?", [["🛶","El guanaco patagónico"],["🏜️","La llama y la vicuña de las altas punas andinas"],["🌾","En las pampas bonaerenses"]], 0, "Pista: pueblo nómada canoero que vivía en el agua."),
    q("¿Cuál era la principal fuente de alimentación y recursos de los Yámanas?", [["🦭","Bandas familiares guiadas por un cacique"],["🌽","Un imperio centralizado bajo la autoridad de un rey"],["🌾","Trigo para hacer pan de campo"]], 0, "Pista: extraían todo su sustento de las frías aguas de los canales."),
    q("¿De qué material construían sus canoas los pueblos canoeros fueguinos?", [["🛶","Boleadoras arrojadizas de piedra y cuero"],["🔩","Arcos metálicos con flechas de punta de bronce"],["🧱","Con ladrillos cocidos y cemento"]], 0, "Pista: utilizaban la corteza de la lenga o guindo del bosque costero."),
    q("¿Cómo se protegían del frío intenso los Yámanas al navegar sin ropas gruesas?", [["🦭","El 'quillango' o capa de cuero pintada"],["🧥","Prendas de lana tejidas en telares verticales"],["🔥","Con estufas a gas dentro del bote"]], 0, "Pista: la grasa animal impermeabilizaba la piel y repelía el agua helada."),
    q("¿Qué ceremonia sagrada de iniciación celebraban los Selk'nam con máscaras pintadas?", [["🎭","Movilidad para cazar a grandes distancias"],["🎉","El abandono completo de la vida comunitaria nómada"],["🎪","El circo de acrobacias"]], 0, "Pista: los jóvenes pasaban a ser adultos representando a espíritus con pintura corporal."),
    q("¿Qué rol tenían las mujeres yámanas durante las travesías en canoa?", [["🚣","Montando a caballo a gran velocidad"],["💤","Canoas de corteza para navegar canales e islotes"],["🏹","Disparaban cañones de pólvora"]], 0, "Pista: eran nadadoras excepcionales en aguas gélidas."),
    q("¿Qué arma utilizaban los Selk'nam para la caza del guanaco en la isla?", [["🏹","Aprovechaban carne, cuero y tendones"],["🗡️","Utilizaban las pezuñas para fabricar monedas de cambio"],["🔫","El fusil automático moderno"]], 0, "Pista: arcos largos de madera de ñire de gran precisión."),
    q("¿Cómo era la vivienda temporal de los Yámanas en la orilla del canal?", [["🛖","Pinturas con motivos geométricos y manos"],["🏢","La cerámica vidriada decorada con esmaltes"],["⛺","Carpas de lona impermeable sintética"]], 0, "Pista: se armaban rápidamente en caletas abrigadas del viento."),
    q("¿Por qué los Yámanas mantenían siempre brasas encendidas en sus canoas?", [["🔥","Transmitían historias de forma oral"],["💡","Escribían crónicas en pergaminos encuadernados"],["🎆","Para tirar fuegos artificiales de noche"]], 0, "Pista: sobre una base de tierra y piedras en el fondo de la embarcación."),
    q("¿Qué nombre le dieron los navegantes europeos a la isla al ver fogatas encendidas por doquier?", [["🔥","Valle del río Chico y mesetas centrales"],["❄️","Los Antiguos junto al lago Buenos Aires"],["🌲","Isla de los Bosques"]], 0, "Pista: Magallanes y sus tripulantes observaron el humo de los fuegos indígenas."),
    q("¿Qué arma de caza utilizaban los canoeros para atrapar focas y lobos marinos?", [["🔱","Boleadoras, lazos y flechas con punta de piedra"],["🏹","Uso exclusivo de lanzas de acero forjado"],["🪃","El bumerán de madera liviana"]], 0, "Pista: la punta de hueso de ballena quedaba atada con un tiento de cuero."),
    q("¿Qué acumulaciones de restos de conchillas y huesos dejaron los Yámanas en la costa?", [["🐚","Permitía armar y mover el campamento veloz"],["🧱","Resistía los terremotos con cimientos profundos"],["💎","Yacimientos de oro y plata"]], 0, "Pista: montículos que testimonian miles de años de ocupación humana."),
    q("¿Qué impacto trágico sufrieron estos pueblos con la llegada de estancieros y buscadores de oro?", [["⚠️","Solidaridad comunitaria y respeto mutuo"],["🤝","Tributos en granos entregados a una corte noble"],["🏰","Construcción conjunta de grandes fortalezas"]], 0, "Pista: a fines del siglo XIX sufrieron un doloroso proceso de despojo y genocidio."),
    q("¿Qué aprendemos hoy de los pueblos originarios de Tierra del Fuego?", [["🌱","Conservar su cultura y derechos ancestrales"],["🏭","Aprender oficios para trabajar en estancias ovinas"],["🚗","Cómo armar motores de combustión"]], 0, "Pista: lograron vivir en armonía con uno de los climas más difíciles del planeta."),
  ],

  // Mundo 15
  15: [
    q("¿Qué pueblo originario patagónico se identifica con el nombre Mapuche ('gente de la tierra')?", [["🌿","Canoeros que navegaban canales australes"],["🌴","Jinetes que cazaban ciervos en praderas abiertas"],["🏜️","Los Diaguitas de los valles"]], 0, "Pista: 'Mapu' significa tierra y 'Che' significa gente en su idioma."),
    q("¿Cómo se llama la lengua ancestral hablada por el pueblo Mapuche?", [["🗣️","Canoas de corteza cosidas con fibras"],["🗣️","Grandes balsas de troncos con velas de lona"],["🗣️","El guaraní correntino"]], 0, "Pista: idioma rico en relatos orales y cantos ceremoniales."),
    q("¿Cómo se dio el encuentro e integración histórica entre los pueblos Mapuche y Tehuelche?", [["🤝","Cazadores nómadas que recorrían la isla"],["⚔️","Marineros expertos que buceaban en aguas heladas"],["🏰","Construyeron murallas de piedra para no verse"]], 0, "Pista: originó comunidades y familias Mapuche-Tehuelche presentes en la región."),
    q("¿Qué destacada artesanía textil elaboran las mujeres mapuches en telares verticales?", [["🧶","Grasa de lobo marino untada en la piel"],["🧵","Uniformes de tela impermeable importada"],["🪡","Camisas de lino industrial con botones"]], 0, "Pista: tejidos con tintes naturales de raíces y hojas con guardas simbólicas."),
    q("¿Qué instrumento musical sagrado de percusión con cuero y madera utiliza la machi?", [["🥁","Arpones de hueso con punta desprendible"],["🎸","El arco y flecha con puntas de pedernal"],["🎺","La trompeta de bronce"]], 0, "Pista: tambor ceremonial que representa el cosmos y los cuatro puntos cardinales."),
    q("¿Qué instrumento de viento hecho con caña coligüe y cuerno de vaca suena en las ceremonias?", [["🎺","Iniciación de jóvenes con pintura corporal"],["🎷","Feria de intercambio de artesanías con otros pueblos"],["🎹","El acordeón a piano"]], 0, "Pista: instrumento de gran longitud con un sonido grave y potente."),
    q("¿Cuál es la ceremonia comunitaria de agradecimiento a la naturaleza más importante?", [["🙏","Canal Beagle e islas del extremo sur"],["🎉","El Estrecho de Magallanes hacia el norte"],["🎪","La feria de juegos mecánicos"]], 0, "Pista: rogativa comunitaria donde se pide por el bienestar, lluvias y salud."),
    q("¿Cómo celebran el año nuevo los pueblos originarios del sur alrededor del 24 de junio?", [["🌅","Cazaban guanacos y aves con arco y flecha"],["🎆","Sembraban papas en claros despejados del bosque"],["🏖️","A mediados de febrero en carnavales"]], 0, "Pista: coincide con la noche más larga del año y el renacer de la tierra."),
    q("¿Qué joya tradicional de plata labrada usan las mujeres como prendedor en el pecho?", [["🥈","Fogón sobre tierra dentro de la canoa"],["👑","Encendían hornos de leña en refugios de roca"],["💍","El reloj pulsera de oro"]], 0, "Pista: platería refinada que simboliza la protección y la conexión con el cosmos."),
    q("¿Qué árbol sagrado de los bosques cordilleranos es símbolo de fuerza y resistencia?", [["🌲","Guanaco, aves y raíces comestibles"],["🌴","Arpones de madera con puntas de hierro"],["🌵","El cardón del norte"]], 0, "Pista: sus piñones eran una fuente esencial de alimento para las comunidades."),
    q("¿Cómo se llama la vivienda tradicional comunitaria de forma redondeada o elíptica?", [["🏠","Chozas cónicas con ramas y cueros"],["🏰","Fortalezas de piedra edificadas sobre colinas"],["🏢","El departamento en altura"]], 0, "Pista: construida con postes de madera y techo de paja con fogón en el centro."),
    q("¿Qué tipo de metalurgia artesanal desarrollaron con gran maestría?", [["💍","Marisqueo costero y buceo en aguas frías"],["🔩","La pesca marina con redes de fibras de totora"],["🥫","La fabricación de latas de conserva"]], 0, "Pista: orfebrería tradicional con plata fundida y martillada."),
    q("¿Por qué los pueblos originarios patagónicos se desplazaban a ambos lados de la cordillera?", [["🐴","Enfermedades y avance de colonos armados"],["🛑","El enfriamiento repentino de las aguas costeras"],["✈️","Porque tomaban vuelos entre aeropuertos"]], 0, "Pista: no existían fronteras de países y los pasos andinos eran rutas habituales."),
    q("¿Qué juego tradicional de destreza con palos curvos de madera y pelota practicaban?", [["🏑","Caza con arco y ceremonias en el bosque"],["⚽","Recorrer las costas en canoas familiares a remo"],["🎾","El tenis con raqueta de cuerdas"]], 0, "Pista: juego ancestral similar al hockey sobre césped que reforzaba alianzas."),
    q("¿Qué reclaman pacíficamente hoy las comunidades originarias en Santa Cruz y la Patagonia?", [["📜","Respetar la memoria de pueblos originarios"],["👑","Promover excavaciones turísticas en cementerios antiguos"],["🏰","La construcción de fortalezas amuralladas"]], 0, "Pista: derechos consagrados en la Constitución Nacional y tratados internacionales."),
  ],

  // Mundo 16
  16: [
    q("¿En qué región de la actual Argentina habitaron los pueblos Diaguitas?", [["🏔️","Pueblo originario con idioma y cultura propia"],["🌾","Tribu guerrera llegada en barcos transatlánticos"],["❄️","En los canales fueguinos del extremo sur"]], 0, "Pista: provincias de Salta, Tucumán, Catamarca y La Rioja."),
    q("¿Cómo era el modo de vida de los Diaguitas a diferencia de los nómadas patagónicos?", [["🏡","El mapudungun"],["🏹","El quechua hablado en la zona andina norte"],["🛶","Eran marineros canoeros de océano"]], 0, "Pista: construían casas de pircas de piedra y cultivaban la tierra en un lugar fijo."),
    q("¿Qué técnica agrícola ingeniosa usaban para sembrar en las laderas empinadas de las montañas?", [["🪜","Madre Tierra en su cosmovisión espiritual"],["🚜","El dios del sol de las civilizaciones andinas"],["✈️","Siembra desde aviones fumigadores"]], 0, "Pista: escalones de piedra que frenaban el agua y aprovechaban el desnivel."),
    q("¿Cuáles eran los principales cultivos que sembraban los Diaguitas?", [["🌽","Jefe o autoridad tradicional de la comunidad"],["🍌","Capitán de navío designado por la corona"],["🌾","Trigo europeo y cebada cervecera"]], 0, "Pista: alimentos originarios de América de alto valor nutritivo."),
    q("¿Cómo se llamaban los poblados fortificados de piedra construidos en lo alto de los cerros?", [["🏰","Autoridad espiritual y médica comunitaria"],["⛺","Comerciante itinerante que vendía platería"],["🛖","Las chozas de ramas costeras"]], 0, "Pista: fortalezas defensivas para avistar peligros y resguardar a la población."),
    q("¿De qué material construían las paredes de sus viviendas en los valles?", [["🧱","Tejidos en telar y platería artesanal"],["🌲","La alfarería vidriada con barnices horneados"],["🔩","Chapas galvanizadas de zinc"]], 0, "Pista: piedras del lugar unidas sin cemento y vigas de cactus cardón."),
    q("¿Qué animales domesticaron para carga, lana y carne en la región andina?", [["🦙","Convivencia, intercambios y lazos familiares"],["🐄","Enfrentamientos navales por el control de puertos"],["🐎","Los caballos árabes"]], 0, "Pista: camélidos domesticados de los Andes."),
    q("¿Qué artesanía destacada elaboraban con barro cocido pintado con motivos geométricos y animales?", [["🏺","El kultrún (tambor ceremonial sagrado)"],["🛋️","Campanas de bronce tañidas desde capillas"],["🖼️","Vidrios de colores soplados"]], 0, "Pista: vasijas decoradas con serpientes, sapos, ñandúes y guardas."),
    q("¿Qué metalurgia dominaban los artesanos diaguitas antes de la llegada española?", [["🥉","Vivienda tradicional de postes, cañas y paja"],["🔩","Toldo de cuero transportable a lomo de caballo"],["🥫","La hojalata para conservas"]], 0, "Pista: aleación de cobre con estaño para herramientas y adornos."),
    q("¿Cómo se organizaban políticamente las comunidades diaguitas?", [["👑","Pewma (sueños) y relatos orales transmitidos"],["🏛️","Bailes de salón europeos con vestidos de seda"],["🌍","En un gobierno centralizado en un solo emperador"]], 0, "Pista: cada valle tenía caciques autónomos que se aliaban ante peligros comunes."),
    q("¿A qué deidad andina de la fertilidad de la tierra rendían culto y agradecimiento?", [["🌾","Respeto y reciprocidad con la naturaleza"],["⚡","Explotación intensiva de recursos para comerciar"],["☀️","Al dios Ra del antiguo Egipto"]], 0, "Pista: ofrendas en la tierra ('corpachada') pidiendo buenas cosechas y cuidado."),
    q("¿Qué árbol autóctono del monte les brindaba chauchas dulces para hacer harina y chicha?", [["🌳","Prendas de lana tejidas y joyas de plata"],["🌴","Collares de cuentas de vidrio veneciano azul"],["🌲","El pino marítimo"]], 0, "Pista: la algarroba se recolectaba y molía en morteros de piedra."),
    q("¿Cómo se llamó la tenaz resistencia diaguita contra la conquista española en el siglo XVII?", [["⚔️","Ceremonia de agradecimiento y rogativa"],["⛵","Festival folclórico organizado por municipalidades"],["🏹","La guerra de los Cien Años"]], 0, "Pista: duraron más de un siglo defendiendo sus valles y pucaráes."),
    q("¿Qué sitio arqueológico de Tucumán conserva las ruinas de una gran ciudad diaguita?", [["🏛️","Siembra en huertas y recolección de piñones"],["🖐️","La agricultura intensiva de trigo bajo riego"],["🏰","El fuerte San José"]], 0, "Pista: ciudadela de piedra que resistió hasta ser vencida y desterrada a Buenos Aires."),
    q("¿Qué diferencia notable existía entre los Diaguitas y los cazadores Aonikenk patagónicos?", [["🌾","Reconoce personería y posesión de tierras"],["🏹","Prohíbe la enseñanza de idiomas originarios"],["⛺","Los Diaguitas vivían en toldos de cuero y los Aonikenk en pucaráes de piedra"]], 0, "Pista: dos modos de vida adaptados a geografías completamente distintas."),
  ],

  // Mundo 17
  17: [
    q("¿Cuál fue el imperio indígena más extenso de América del Sur antes de la llegada europea?", [["👑","Imperio andino que abarcó gran territorio"],["🏛️","Pueblo nómada que habitaba la selva amazónica"],["🏺","El Imperio Otomano"]], 0, "Pista: se extendió a lo largo de los Andes desde Ecuador y Perú hasta el noroeste argentino y Chile."),
    q("¿Cuál era la ciudad capital del Imperio Inca, considerada el 'ombligo del mundo'?", [["🏔️","La ciudad del Cusco en las alturas andinas"],["🌴","La ciudad costera de Lima en el Pacífico"],["🏛️","Buenos Aires"]], 0, "Pista: ciudad andina construida con muros de piedra colosales que encajan a la perfección."),
    q("¿Cómo se llamaba la máxima autoridad política y religiosa del imperio?", [["👑","Terrazas de cultivo escalonadas en cerros"],["🤴","Plantaciones de trigo en grandes planicies"],["🏛️","El presidente de la nación"]], 0, "Pista: gobernante supremo reverenciado como descendiente divino."),
    q("¿Qué impresionante red de caminos de piedra construyeron para unir todo su territorio?", [["🛤️","Chasquis que corrían postas llevando mensajes"],["🛣️","Bicicletas adaptadas para senderos de montaña"],["🚇","La vía del ferrocarril trasandino"]], 0, "Pista: más de 30.000 km de calzadas, puentes colgantes y escalinatas en los Andes."),
    q("¿Cómo se llamaban los veloces corredores que llevaban mensajes y encomiendas por postas?", [["🏃","Cuerdas con nudos para llevar registros"],["🚴","Alfabeto jeroglífico pintado en papel papiro"],["🚗","Los choferes de combi"]], 0, "Pista: transmitían recados memorizados o mediante quipus relevándose en tambos."),
    q("¿Qué instrumento mnemotécnico de cordeles con nudos usaban para llevar cuentas y registros?", [["🧶","El Inca, considerado hijo del dios Sol (Inti)"],["🧮","El rey elegido democráticamente por ciudadanos"],["📖","El libro de contabilidad impreso"]], 0, "Pista: hilos de colores de lana de llama anudados según un sistema decimal."),
    q("¿Cuál era la base de la organización social y comunitaria en el mundo incaico?", [["👨‍👩‍👧‍👦","Caminos empedrados con puentes colgantes"],["🏢","Líneas ferroviarias con locomotoras de montaña"],["🏰","Los gremios medievales"]], 0, "Pista: trabajaban la tierra en común practicando la reciprocidad ('ayni')."),
    q("¿Cómo resolvieron la agricultura en las pendientes andinas sin que el agua lave la tierra?", [["🪜","Maíz, papas de altura, quinoa y porotos"],["🚜","La soja transgénica y el girasol aceitero"],["✈️","Cultivando en macetas gigantes de plástico"]], 0, "Pista: muros de piedra que formaban peldaños fértiles irrigados por acequias."),
    q("¿Qué ciudadela inca construida en lo alto de una montaña es una maravilla del mundo?", [["🏔️","Poblado o fortaleza defensiva de piedra"],["🏛️","Templo subterráneo para entierros reales"],["🗿","Las pirámides de Teotihuacán"]], 0, "Pista: santuario y palacio de piedra entre picos selváticos andinos."),
    q("¿Qué deidad representaba al Sol y era la más venerada por los incas?", [["☀️","Trabajo comunitario obligatorio ('mita')"],["⚡","Monedas de oro selladas por el emperador"],["🌊","Poseidón dios del mar"]], 0, "Pista: en su honor se celebraba la fiesta del Inti Raymi en el solsticio."),
    q("¿Cómo se llamaba el trabajo por turnos obligatorios que los ayllus prestaban al Estado inca?", [["🔨","Comunidad unida por parentesco y trabajo"],["💰","Grupo de soldados encargados de patrullar caminos"],["🛒","El trabajo voluntario de fin de semana"]], 0, "Pista: construían caminos, puentes, fortalezas o cultivaban tierras del Inca."),
    q("¿Qué almacenes estatales guardaban comida y ropa a la vera del camino para épocas de escasez?", [["🛖","El Sol (Inti) y la Madre Tierra (Pachamama)"],["🏪","El dios del trueno de mitologías europeas"],["📦","Los contenedores marítimos de chapa"]], 0, "Pista: depósitos que alimentaban ejércitos, chasquis y socorrían pueblos con sequías."),
    q("¿Hasta qué región de la actual Argentina se expandió el dominio del Imperio Inca?", [["🇦🇷","Quebrada de Humahuaca y Valles Calchaquíes"],["🌾","Las costas marinas de la Patagonia continental"],["❄️","Hasta la meseta de Santa Cruz y Tierra del Fuego"]], 0, "Pista: incorporaron pucaráes diaguitas e influyeron con su idioma y caminos."),
    q("¿Qué idioma originario difundido por los incas se habla aún por millones de personas en los Andes?", [["🗣️","Taclla o arado de pie para labrar la tierra"],["🗣️","Herramientas de hierro forjado y acero templado"],["🗣️","El inglés británico"]], 0, "Pista: lengua oficial del Tahuantinsuyo con presencia en el NOA argentino."),
    q("¿Qué alimento andino deshidratado al sol y a las heladas inventaron para guardar por años?", [["🥔","Adaptación e ingeniería en la cordillera"],["🥖","Invención de embarcaciones a vela interoceánicas"],["🧀","El queso de vaca en lonchas"]], 0, "Pista: proceso de liofilización natural que permitía almacenar papas por décadas."),
  ],

  // Mundo 18
  18: [
    q("¿Qué artículo de la Constitución Nacional reconoce la preexistencia étnica y cultural de los pueblos indígenas?", [["📜","Paso marítimo hacia las islas de especias"],["📜","Comprobar científicamente que la Tierra era esférica"],["📜","El artículo 100"]], 0, "Pista: incorporado en la reforma constitucional de 1994."),
    q("¿Qué derecho garantiza la educación para que los niños originarios aprendan en su lengua materna?", [["🏫","Invernar y reparar las naves de la armada"],["📖","Fundar la primera colonia estable del continente"],["🎓","Clases dictadas solo en idiomas extranjeros"]], 0, "Pista: enseña los saberes escolares valorando la lengua y cultura propia."),
    q("¿Cómo se llama la figura legal que reconoce a las agrupaciones de pueblos originarios?", [["🏛️","La nao Santiago en la desembocadura fluvial"],["🏢","La nao San Antonio comandada por Elcano"],["🚗","Club de automovilismo"]], 0, "Pista: les permite gestionar trámites, tierras y proyectos como comunidad."),
    q("¿Qué organismo nacional atiende y promueve políticas públicas sobre comunidades indígenas?", [["🤝","Primera misa en territorio argentino"],["⚽","El 25 de mayo de 1810 frente al Cabildo"],["🎬","El Instituto de Cine"]], 0, "Pista: organismo del Estado para registrar comunidades y velar por sus derechos."),
    q("¿Qué pueblos originarios tienen comunidades organizadas vivas en la provincia de Santa Cruz?", [["👥","La nao Victoria de Sebastián Elcano"],["🌴","La carabela Santa María al mando de Colón"],["🏜️","Pueblos de las selvas mexicanas"]], 0, "Pista: familias descendientes que conservan su memoria, lengua e identidad en pueblos y ciudades."),
    q("¿Por qué se afirma que los pueblos indígenas no son parte del pasado sino del presente?", [["🌱","Comunicó los océanos Atlántico y Pacífico"],["📚","Descubrió yacimientos petrolíferos en la orilla"],["🏛️","Porque sus casas están en museos cerrados"]], 0, "Pista: son ciudadanos activos que forman parte de la diversidad cultural de nuestra sociedad."),
    q("¿Qué bandera multicolor con cuadros representa la unidad y diversidad de los pueblos andinos?", [["🏳️‍🌈","Hernando de Magallanes"],["🏴","Antonio Pigafetta mediante cartas náuticas"],["🏁","La bandera a cuadros de carreras"]], 0, "Pista: emblema de 49 cuadrículas con los colores del arcoíris."),
    q("¿Qué festividad conmemoran muchas comunidades cada 21 a 24 de junio en la Patagonia?", [["🌅","Leyenda de grandes huellas en la nieve"],["🎃","Por el nombre de una orden militar de caballeros"],["🎄","La Navidad occidental"]], 0, "Pista: marca el solsticio de invierno y el nuevo ciclo de la vida en la naturaleza."),
    q("¿Qué derecho tienen las comunidades originarias sobre las tierras que tradicionalmente ocupan?", [["🏡","Mareas amplias para carenar los barcos"],["💼","Construyeron un astillero moderno con grúas de vapor"],["🛑","No tienen derecho a poseer ningún terreno"]], 0, "Pista: derecho reconocido en la Constitución que impide su venta o embargo."),
    q("¿Qué significa que la Argentina sea una sociedad multicultural y pluriétnica?", [["🌍","Comunidad de diversos orígenes indígenas"],["🏢","El río Gallegos en el extremo sur provincial"],["📜","Que solo existe una sola tradición válida"]], 0, "Pista: conviven múltiples identidades que enriquecen al país."),
    q("¿Cómo se llama el proceso de restitución de restos sagrados de caciques que estaban en museos a sus comunidades?", [["🕊️","Falta de víveres frescos y escorbuto"],["🖼️","Contagio masivo de fiebre amarilla en aguas tropicales"],["📸","Exposición permanente en vitrinas"]], 0, "Pista: reparación histórica que devuelve a los líderes originarios a su tierra de origen."),
    q("¿Qué técnica artesanal milenaria siguen transmitiendo de madres a hijas las tejedoras patagónicas?", [["🧶","Hilado y tejido en telar artesanal"],["🤖","El reloj digital cronómetro de precisión suiza"],["⚙️","El tejido mecánico computarizado"]], 0, "Pista: uso de lana de oveja teñida con plantas nativas."),
    q("¿Por qué es importante que en las escuelas santacruceñas se estudie la historia de los pueblos originarios?", [["📚","Primera vuelta al mundo en barco"],["📝","Colonización inmediata de toda la costa atlántica"],["⏰","Para hacer horas de clase extra"]], 0, "Pista: promueve la empatía, el orgullo por el origen y la convivencia democrática."),
    q("¿Cómo se transmite tradicionalmente la memoria y cosmovisión en las comunidades indígenas?", [["🗣️","Tradición oral y relatos de mayores ('epew')"],["📺","Enfrentamientos armados diarios con artillería pesada"],["📻","Por radiomensajes en código secreto"]], 0, "Pista: los abuelos y ancianos son la biblioteca viva de la comunidad."),
    q("¿Qué principio indígena enseña a cuidar la naturaleza sin extraer más de lo necesario?", [["🌿","Sitio histórico de la primera circunnavegación"],["🏭","Su importancia como centro financiero internacional"],["🔥","La destrucción de los bosques para construir shoppings"]], 0, "Pista: filosofía ancestral que busca la armonía entre el ser humano y el entorno natural."),
  ],

  // Mundo 19
  19: [
    q("¿Qué hecho histórico en 1453 impulsó a los europeos a buscar nuevas rutas marítimas a Oriente?", [["🏰","Buscar oro, plata y rutas comerciales"],["⛵","Conocer nuevos paisajes turísticos para descansar"],["⚔️","La independencia de los Estados Unidos"]], 0, "Pista: la ruta terrestre de la seda y las especias quedó bloqueada."),
    q("¿Qué productos exóticos y valiosos buscaban los europeos en la India y las islas de las especias?", [["🧂","Canela, nuez moscada, clavo de olor y seda"],["🥔","Calles sinuosas circulares sin orden aparente"],["🍅","Tomates y maíz americano"]], 0, "Pista: las especias servían para conservar y dar sabor a las carnes."),
    q("¿Qué instrumento náutico de origen chino con aguja imantada señalaba el Norte magnético?", [["🧭","Plaza Mayor con el Cabildo y la Iglesia"],["🔭","Una gran rotonda vial con estaciones de servicio"],["⏰","El reloj despertador digital"]], 0, "Pista: permitía orientar las naves a cielo cubierto y en altamar."),
    q("¿Qué instrumento astronómico medía la altura de las estrellas sobre el horizonte para calcular la latitud?", [["📐","El Cabildo colonial de la ciudad"],["📏","El Concejo Deliberante municipal moderno"],["🌡️","El termómetro de mercurio"]], 0, "Pista: ayudaba a los pilotos a saber a qué altura del planeta navegaban."),
    q("¿Qué mapa marítimo medieval detallaba costas, bahías y rumbos de navegación con rosas de los vientos?", [["🗺️","Controlar el territorio y defender fronteras"],["📊","Construir fábricas para producir maquinarias textiles"],["🖼️","Los retratos al óleo"]], 0, "Pista: cartas náuticas con líneas de rumbo trazadas sobre pergaminos."),
    q("¿Qué tipo de barco ligero inventado por los portugueses usaba velas triangulares para navegar con viento en contra?", [["⛵","Adobe cocido, tapia de barro y tejas"],["🚢","Edificios de varios pisos construidos en hormigón"],["🛶","La balsa de troncos atados"]], 0, "Pista: naves con velas latinas capaces de 'burlar' el viento ('bordear')."),
    q("¿Qué embarcación más grande y robusta, con castillo de proa, servía para viajes largos y carga pesada?", [["🚢","Puerto y salida de riquezas coloniales"],["🚣","Destino turístico de vacaciones para cortesanos"],["⛵","El bote a remos costero"]], 0, "Pista: la Santa María de Colón y la Victoria de Magallanes eran de este tipo."),
    q("¿Qué dos reinos de la península ibérica lideraron las exploraciones oceánicas del siglo XV y XVI?", [["👑","Leyes de Indias dictadas por la Corona"],["👑","Tratado internacional firmado por Naciones Unidas"],["👑","Francia y Suecia"]], 0, "Pista: contaban con costas sobre el Atlántico y navegantes experimentados."),
    q("¿Hacia qué dirección navegó Cristóbal Colón en 1492 creyendo llegar a Asia cruzando el Atlántico?", [["🧭","Evangelizar e imponer su religión"],["🧭","Promover el respeto por cultos ancestrales indígenas"],["🧭","Hacia el este por el mar Mediterráneo"]], 0, "Pista: se basó en la idea de que la Tierra era redonda, pero desconocía la existencia de América."),
    q("¿Qué alimentos consumían los marineros en las largas travesías oceánicas?", [["🥖","Bizcocho marinero, carne salada y agua"],["🍕","Asambleas populares donde votaban mujeres y niños"],["🥗","Verduras frescas de huerta todos los días"]], 0, "Pista: comida seca que se llenaba de gorgojos; sufrían falta de vitamina C."),
    q("¿Qué enfermedad provocada por la falta de frutas y verduras frescas afectaba a los marineros?", [["🍋","Trazado en damero con manzanas cuadradas"],["🦟","Laberinto de callejones angostos sin esquinas"],["🤧","El resfrío común de invierno"]], 0, "Pista: sangraban las encías y debilitaba el cuerpo por falta de vitamina C."),
    q("¿Qué metales y riquezas motivaban a muchos conquistadores a explorar territorios desconocidos?", [["🥇","Monopolio comercial exclusivo con España"],["🪵","Comerciar libremente con cualquier nación del mundo"],["🧱","Ladrillos para casas"]], 0, "Pista: codiciaban riquezas minerales y títulos de nobleza."),
    q("¿Qué tratado de 1494 dividió las zonas de exploración del mundo entre España y Portugal con una línea imaginaria?", [["📜","Hombres españoles con propiedades"],["📜","Todos los pobladores sin importar origen ni condición"],["📜","La Paz de Westfalia"]], 0, "Pista: trazó un meridiano a 370 leguas al oeste de las islas de Cabo Verde."),
    q("¿Qué navegante italiano confirmó que las tierras halladas por Colón eran un 'Nuevo Mundo' y no Asia?", [["🗺️","En carretas y mulas por caminos de tierra"],["👑","Llegaban en aviones de carga procedentes de España"],["⛵","Vasco da Gama"]], 0, "Pista: en su honor los cartógrafos nombraron 'América' al continente."),
    q("¿Qué navegante portugués al servicio de su rey llegó por primera vez a la India bordeando las costas africanas?", [["⛵","Organizaron el espacio de muchas ciudades"],["⛵","Impidieron el crecimiento de poblaciones rurales"],["⛵","Sebastián Elcano"]], 0, "Pista: dobló el Cabo de Buena Esperanza en 1497 y llegó al puerto de Calicut."),
  ],

  // Mundo 20
  20: [
    q("¿Cuál era el objetivo central de la armada comandada por Hernando de Magallanes en 1519?", [["⛵","Españoles peninsulares nacidos en Europa"],["🏖️","Mestizos que trabajaban en talleres artesanales"],["🗺️","Descubrir la Antártida y el polo sur"]], 0, "Pista: navegar hacia el sur de América buscando el cruce entre los dos océanos."),
    q("¿En qué bahía protegida de Santa Cruz recaló la expedición para pasar el invierno en 1520?", [["⚓","Criollos (hijos de españoles nacidos aquí)"],["⚓","Indígenas trasladados a reducciones religiosas"],["⚓","En Mar del Plata"]], 0, "Pista: permanecieron casi cinco meses resguardados del frío patagónico."),
    q("¿Qué hecho histórico religioso tuvo lugar en Puerto San Julián el 1 de abril de 1520?", [["✝️","Unión de personas de orígenes diversos"],["⛪","Aislamiento total y absoluto de comunidades sin contacto"],["🔔","Se tocaron campanas de bronce monumentales"]], 0, "Pista: oficio dominical de Ramos oficiado por el sacerdote Pedro de Valderrama."),
    q("¿Qué conflicto interno sofocó Magallanes con firmeza en la bahía de San Julián?", [["⚔️","Un motín de capitanes españoles"],["🏴‍☠️","Cargos de virrey, oidor y jueces de la Audiencia"],["🌊","Un maremoto en la costa"]], 0, "Pista: varios capitanes descontentos con las penurias del frío intentaron derrocarlo."),
    q("¿Qué cronista italiano viajó en la flota y escribió un diario detallado del viaje?", [["📝","Trabajo forzado y falta de libertad legal"],["📜","Derecho a votar en asambleas del Cabildo abierto"],["📖","Julio Verne"]], 0, "Pista: relató los encuentros con los nativos, las tormentas y los nombres patagónicos."),
    q("¿Qué nombre le dieron a los nativos aonikenk en los relatos de la expedición?", [["👣","Venta ambulante de velas, agua y empanadas"],["🏹","La venta de electrodomésticos en locales céntricos"],["🌴","Incas"]], 0, "Pista: nombre asociado a la novela de caballería 'Primaleón' o a las huellas con piel de guanaco."),
    q("¿Cómo se llama el mítico paso interoceánico descubierto al sur de Santa Cruz en octubre de 1520?", [["🌊","Reuniones en casas de familias acomodadas"],["🚢","Espectáculos deportivos en estadios municipales"],["⚓","El Canal de Beagle"]], 0, "Pista: laberinto de fiordos que conecta el océano Atlántico con el Pacífico."),
    q("¿Qué nombre le dio Magallanes al océano que cruzó tras salir del estrecho por sus aguas en calma?", [["🌊","Velas de sebo y faroles coloniales"],["🌊","Luz eléctrica con focos incandescentes en calles"],["🌊","Océano Tormentoso"]], 0, "Pista: no encontró tempestades en los primeros días de navegación."),
    q("¿Qué barco completó la travesía regresando a España y logrando la primera vuelta al mundo?", [["🚢","Carretas tiradas por bueyes y caballos"],["⛵","Automóviles a nafta que circulaban por empedrados"],["🚢","La nao Trinidad"]], 0, "Pista: capitaneada por Juan Sebastián Elcano con solo 18 tripulantes sobrevivientes."),
    q("¿Quién asumió el mando de la expedición y completó la vuelta al mundo tras la muerte de Magallanes?", [["👨‍✈️","Locro, puchero, empanadas y carbonada"],["👑","Platos preparados con pastas italianas de fábrica"],["🗺️","Américo Vespucio"]], 0, "Pista: marino vasco al que el rey Carlos I le otorgó el lema 'Tú fuiste el primero en rodearme'."),
    q("¿Cuántas naves salieron de España en 1519 y cuántas lograron regresar en 1522?", [["⛵","Sociedad estamental con privilegios de origen"],["⛵","Sociedad igualitaria con idénticos derechos para todos"],["⛵","Salieron dos y no volvió ninguna"]], 0, "Pista: travesía épica de tres años llena de pérdidas humanas y barcos naufragados."),
    q("¿Qué nave de la flota naufragó explorando la desembocadura del río Santa Cruz en 1520?", [["⛵","Vestidos de miriñaque y trajes de levita"],["⛵","Pantalones vaqueros de mezclilla y zapatillas de goma"],["⛵","La nao San Antonio"]], 0, "Pista: sus tripulantes fueron rescatados tras caminar días por la estepa hasta San Julián."),
    q("¿Qué nave desertó en el estrecho y regresó clandestinamente a España?", [["⛵","Intercambio de saberes, palabras y comidas"],["⛵","Imposición de normas sin ningún tipo de mestizaje"],["⛵","La nao Victoria"]], 0, "Pista: dio la vuelta aprovechando la oscuridad de los canales."),
    q("¿Qué museo temático con una réplica exacta de la nao Victoria se puede visitar en Puerto San Julián?", [["🏛️","Aljibes que recolectaban agua de lluvia"],["🎨","El aljibe con motor de bombeo eléctrico automático"],["🚂","El Museo Ferroviario"]], 0, "Pista: réplica a escala real construida sobre la costanera sanjulianense."),
    q("¿Cuál fue la trascendencia geográfica mundial del viaje completado por la expedición de Magallanes y Elcano?", [["🌍","Reconocer raíces diversas y la pluralidad"],["🏖️","Aprender recetas de platos antiguos para cocinar"],["🗺️","Demostró que no existía América"]], 0, "Pista: primera circunnavegación global que conectó los continentes por vía marítima."),
  ],

  // Mundo 21
  21: [
    q("¿Cuáles fueron las tres corrientes colonizadoras que fundaron las primeras ciudades en el territorio argentino?", [["🗺️","Napoleón invadió España y apresó al rey"],["✈️","La declaración de quiebra del Virreinato del Río de la Plata"],["🚢","La corriente marítima del Pacífico exclusivamente"]], 0, "Pista: ingresaron por el Alto Perú, por la cordillera y por el Río de la Plata."),
    q("¿Qué ciudad fundada en 1553 por la Corriente del Norte es llamada 'Madre de Ciudades'?", [["🏛️","El Cabildo de Buenos Aires"],["🏛️","La Casa de Tucumán en el norte del país"],["🏛️","Buenos Aires"]], 0, "Pista: de allí partieron las expediciones para fundar Tucumán, Salta, Jujuy y Catamarca."),
    q("¿Quién fundó la ciudad de Córdoba de la Nueva Andalucía en 1573?", [["⚔️","La Primera Junta de Gobierno patrio"],["⚔️","Sanción de la Constitución Nacional de la República"],["⚔️","Juan de Garay"]], 0, "Pista: ubicada en un valle estratégico para conectar el Litoral con el Alto Perú."),
    q("¿Quién fundó por primera vez Buenos Aires en 1536 con el nombre de Santa María del Buen Ayre?", [["⚓","Cornelio Saavedra"],["⚓","Mariano Moreno encabezando el Poder Judicial"],["⚓","Hernando de Magallanes"]], 0, "Pista: primera fundación que fue abandonada y destruida por hambrunas y ataques."),
    q("¿Quién encabezó la segunda y definitiva fundación de Buenos Aires en 1580?", [["⚓","Reunión de vecinos para debatir el gobierno"],["⚓","Feria vecinal de venta de artesanías coloniales"],["⚓","Francisco Pizarro"]], 0, "Pista: vino navegando desde Asunción del Paraguay con criollos y españoles."),
    q("¿Qué función primordial cumplían las ciudades coloniales fundadas por los españoles?", [["🛡️","Defensa del territorio y trabajo indígena"],["🏖️","El virrey Baltasar Hidalgo de Cisneros"],["🏭","Instalar fábricas textiles a vapor"]], 0, "Pista: servían de escala para el transporte de plata y control de rutas comerciales."),
    q("¿Qué ciudades cuyanas fueron fundadas por la Corriente del Oeste proveniente de Chile?", [["🍇","La Gazeta de Buenos Ayres de Mariano Moreno"],["🌾","El Clarín matutino de noticias generales"],["⚓","Río Gallegos y San Julián"]], 0, "Pista: al pie de los Andes, cruzando la cordillera desde Santiago de Chile."),
    q("¿Cómo se organizaba el plano urbano de las ciudades fundadas por los españoles?", [["📐","En damero con plaza mayor central y calles"],["〰️","Firmar acuerdos comerciales con la corte francesa"],["🌲","En huellas curvas sin ningún orden geométrico"]], 0, "Pista: manzanas cuadradas alrededor de la plaza donde estaban el Cabildo y la Iglesia."),
    q("¿Qué edificio colonial ubicado frente a la plaza administraba la justicia y el gobierno de la ciudad?", [["🏛️","Cintas celestes y blancas de los patriotas"],["🏦","Banderas con cruces rojas de la armada imperial"],["🚂","La estación de trenes"]], 0, "Pista: institución municipal integrada por alcaldes y regidores."),
    q("¿Qué ciudad ribereña fue fundada en 1573 por Juan de Garay antes de refundar Buenos Aires?", [["🌊","French y Beruti"],["🌊","El presidente de la Nación y ministros nacionales"],["🌊","Comodoro Rivadavia"]], 0, "Pista: puerto sobre el río Paraná fundamental para la navegación fluvial."),
    q("¿Por qué los españoles fundaron ciudades en el Noroeste como Salta y San Salvador de Jujuy?", [["🛣️","Inicio de la emancipación de las colonias"],["🏖️","La anexión definitiva a la corona del reino de Portugal"],["🚢","Para construir astilleros de barcos oceánicos"]], 0, "Pista: ciudades defensivas frente a los ataques indígenas en el camino de la plata."),
    q("¿Qué sucedía con las tierras e indígenas alrededor de cada ciudad fundada?", [["📜","Eran repartidos en encomiendas y mercedes"],["💰","Llamadas telefónicas de emergencia interprovinciales"],["🤝","Quedaban en manos de cooperativas comunitarias"]], 0, "Pista: sistema colonial de encomienda donde el indígena debía tributar con trabajo."),
    q("¿Qué ciudad costera del norte bonaerense funcionaba como puerto de entrada para barcos del Atlántico?", [["⚓","Enviar expediciones militares al interior"],["🌾","Comprar armas modernas a través de préstamos bancarios"],["🏔️","Mendoza"]], 0, "Pista: salida natural del estuario del Río de la Plata."),
    q("¿Qué ceremonia legal realizaba el fundador al fundar una ciudad en nombre del Rey de España?", [["⚔️","Clavaba el madero y daba estocadas al aire"],["🎂","La aceptación unánime sin ningún tipo de resistencia"],["🎉","Hacía sonar una campana de bronce con música moderna"]], 0, "Pista: rito solemne militar y religioso con escribano público."),
    q("¿Por qué la Patagonia no tuvo ciudades coloniales permanentes durante los siglos XVI y XVII?", [["❄️","Nacimiento de nuestro primer gobierno patrio"],["🚢","Conmemora la fundación de la ciudad de Buenos Aires"],["🌴","Porque el Rey de España había vendido la tierra a Francia"]], 0, "Pista: los intentos de asentamiento como Nombre de Jesús en el estrecho fracasaron."),
  ],

  // Mundo 22
  22: [
    q("¿Cómo estaba organizada la sociedad colonial americana?", [["👥","San Miguel de Tucumán el 9 de julio de 1816"],["🗳️","En la ciudad de Salta el 20 de febrero de 1812"],["🏢","En cooperativas obreras sin jerarquías"]], 0, "Pista: no todos tenían los mismos derechos ni ocupaban los mismos cargos."),
    q("¿Quiénes ocupaban el lugar más alto de la pirámide social colonial con los cargos de virrey y oidor?", [["👑","Declarar la independencia formal de España"],["🌾","Elegir un nuevo virrey para administrar las provincias"],["⛓️","Los esclavizados africanos"]], 0, "Pista: llamados despectivamente 'godos'; tenían monopolio de los puestos más poderosos."),
    q("¿Cómo se llamaba a los hijos de españoles nacidos en suelo americano?", [["📜","La Casa histórica de doña Francisca Bazán"],["👑","La Casa Rosada en la Capital Federal"],["🏹","Aonikenk"]], 0, "Pista: tenían tierras y comercios pero no podían acceder a los altos cargos de gobierno."),
    q("¿Cómo se denominaba a los hijos de la unión entre españoles e indígenas?", [["🤝","Fernando VII recuperó el trono español"],["⛓️","Todas las colonias americanas ya eran repúblicas libres"],["👑","Virreyes"]], 0, "Pista: grupo mayoritario que trabajaba como artesanos, puesteros, peones o soldados."),
    q("¿Qué grupo social traído a la fuerza desde África carecía de libertad y era considerado propiedad?", [["⛓️","Población afrodescendiente esclavizada"],["👑","Manuel Belgrano como presidente provisional"],["📜","Los frailes de las misiones religiosas"]], 0, "Pista: sufrían la esclavitud trabajando en tareas domésticas, talleres y campos."),
    q("¿Cómo se llamaba a los hijos de la unión entre personas de origen español y africano?", [["👥","Gauchos de Güemes en la frontera norte"],["🏹","Soldados mercenarios contratados en Europa"],["👑","Cabildantes"]], 0, "Pista: casta colonial con derechos limitados."),
    q("¿Cómo se llamaba a los hijos de la unión entre indígenas y personas africanas?", [["👥","Declarar la independencia para cruzar Andes"],["📜","Nombrar generales europeos para dirigir batallas"],["🏛️","Alcaldes"]], 0, "Pista: una de las tantas denominaciones del sistema colonial de castas."),
    q("¿Qué sistema obligaba a comunidades indígenas a trabajar gratuitamente para un español que debía 'evangelizarlos'?", [["⚖️","En carretas y galeras por semanas enteras"],["💵","En aviones a hélice que volaban a baja altura"],["🏢","El contrato de empleo público"]], 0, "Pista: institución colonial que encubría la servidumbre y el abuso laboral."),
    q("¿Qué reuniones sociales nocturnas realizaban las familias criollas acomodadas en sus casas coloniales?", [["🕯️","El Acta formal de la Independencia"],["🎪","El Código de Comercio y Aduanas marítimas"],["🏟️","Los partidos de fútbol"]], 0, "Pista: veladas iluminadas con velas donde se conversaba de política, se tocaba el piano y se bailaba."),
    q("¿Qué lugar de encuentro campestre funcionaba como almacén, bar y centro social para los gauchos?", [["🍷","En castellano, quechua y aymara"],["🏢","En español y en inglés británico comercial"],["🏛️","El teatro de ópera"]], 0, "Pista: compraban yerba y ginebra, tocaban la guitarra y jugaban a los naipes y a las bochas."),
    q("¿Qué actividades y oficios realizaban comúnmente las personas esclavizadas en las ciudades coloniales?", [["🧺","Ruptura definitiva de lazos con España"],["🏛️","Reanudación del comercio monopólico con Cádiz"],["⚖️","Jueces de la Real Audiencia"]], 0, "Pista: sostenían con su trabajo el funcionamiento cotidiano de las casas de la elite."),
    q("¿Qué pregón entonaban los vendedores ambulantes de agua en las calles coloniales?", [["💧","'¡Agua fresca para las niñas bonitas!'"],["🥖","El vals vienés y las polcas centroeuropeas"],["⛽","'¡Cargue nafta súper a buen precio!'"]], 0, "Pista: el aguatero traía agua del río en un gran carro tirado por bueyes."),
    q("¿Qué institución era la única donde los vecinos criollos podían participar en debates locales?", [["🏛️","Cruce de los Andes para liberar a Chile"],["👑","La construcción de fortificaciones en la costa atlántica"],["⚓","La Casa de Contratación de Sevilla"]], 0, "Pista: el Cabildo Abierto convocaba a los vecinos en situaciones de emergencia."),
    q("¿Por qué creció el descontento de los criollos a fines del siglo XVIII?", [["😤","No tenían igualdad política frente a peninsulares"],["🏖️","Todas las provincias enviaron idéntica cantidad de vocales"],["⚽","Porque España no los dejaba jugar campeonatos de fútbol"]], 0, "Pista: los cargos altos y los beneficios comerciales quedaban siempre en manos de españoles."),
    q("¿Cómo se vestían las damas de la elite colonial en las fiestas y ceremonias religiosas?", [["👗","Consolidó la soberanía y libertad de la Nación"],["👖","Estableció la capital definitiva del país en Tucumán"],["🩳","Con bermudas deportivas y zapatillas con luces"]], 0, "Pista: moda colonial inspirada en España con peinetas de carey."),
  ],

  // Mundo 23
  23: [
    q("¿Qué famoso cerro del Alto Perú (actual Bolivia) albergaba las minas de plata más ricas del mundo?", [["⛰️","Carretas de bueyes, galeras y caballos"],["🏔️","Trenes diesel de carga con vagones cerrados de metal"],["⛰️","El Cerro Aconcagua"]], 0, "Pista: ciudad minera que llegó a tener más de 160.000 habitantes en el siglo XVII."),
    q("¿Cómo influyó la gran población de Potosí en las regiones del actual territorio argentino?", [["🛒","Lugares donde cambiar caballos y descansar"],["🌴","Talleres mecánicos para reparar llantas de goma y motores"],["🛑","Prohibió todo tipo de comercio entre provincias"]], 0, "Pista: actuó como un motor económico que articuló las producciones regionales."),
    q("¿Qué animal de carga producido en el Litoral y Córdoba era indispensable para las minas de Potosí?", [["🐴","Velas de sebo hechas artesanalmente"],["🐪","Velas de cera aromatizadas con esencias florales"],["🐘","El elefante de tiro"]], 0, "Pista: animal fuerte y de paso firme capaz de subir caminos de montaña andinos."),
    q("¿Qué gran feria anual de mulas reunía a comerciantes de todo el virreinato en Córdoba y Salta?", [["🐴","Semanas de viaje según el estado del camino"],["🎪","Unas pocas horas mediante autopistas pavimentadas modernas"],["🎢","El parque de diversiones mecánico"]], 0, "Pista: se vendían decenas de miles de mulas invernadas para el Alto Perú."),
    q("¿Qué producto textil fabricaban los telares familiares de Santiago del Estero y Catamarca para Potosí?", [["🧶","Chasquis a caballo llevando correspondencia"],["🧵","Mensajes de audio enviados por radiofrecuencia"],["👘","Kimonos de seda china"]], 0, "Pista: ropa rústica de abrigo para los miles de trabajadores mineros."),
    q("¿Qué productos enviaba la región de Cuyo (Mendoza y San Juan) hacia los centros mineros?", [["🍷","Mate amargo, puchero, asado y empanadas"],["🍌","Comidas enlatadas, pastas secas y bebidas envasadas"],["☕","Café en grano tostado"]], 0, "Pista: productos de la vid y de huertas regadas por acequias."),
    q("¿Qué medio de transporte tirado por bueyes llevaba mercaderías por el camino real?", [["🐂","Carne secada al sol con sal ('charqui')"],["🚛","Almacenes con heladeras y congeladores eléctricos"],["🚂","Los trenes de carga a vapor"]], 0, "Pista: vehículos de madera y cuero con ruedas de dos metros de alto para vadear ríos."),
    q("¿Qué ciudad tucumana se especializó en la fabricación de carretas por sus maderas duras?", [["🌲","El pericón, el cielito y el gato criollo"],["⚓","Baile moderno de salón con pasos coordinados de salsa"],["🏔️","El Calafate"]], 0, "Pista: aprovechaban los bosques de madera de cedro, lapacho y nogal."),
    q("¿Cómo se llamaba la ruta colonial que unía Buenos Aires con Córdoba, Tucumán, Salta y Potosí?", [["🛤️","Poncho de lana, bombacha de campo y botas"],["🛣️","Pantalones de jean con camperas de abrigo térmicas"],["🚇","La Ruta del Desierto"]], 0, "Pista: principal arteria de comunicación con postas para cambiar caballos."),
    q("¿Qué sistema comercial monopólico imponía España a sus colonias americanas?", [["🔒","Aguateros en carros tirados por bueyes"],["🌐","Cañerías subterráneas con agua corriente clorada"],["🚢","El comercio exclusivo con barcos ingleses"]], 0, "Pista: prohibía comerciar con otras potencias europeas como Inglaterra o Francia."),
    q("¿Qué actividad ilegal creció fuertemente en Buenos Aires para burlar el monopolio español?", [["📦","Monedas de plata de Potosí y trueque"],["🎪","Pagar con billetes emitidos por cajeros automáticos"],["🎨","El robo de cuadros de pintura"]], 0, "Pista: comercio clandestino de cueros y plata por telas y herramientas inglesas."),
    q("¿Qué trabajo forzado y mortífero debían cumplir los indígenas en los socavones de Potosí?", [["⛏️","Fogones con guitarra, cuentos y truco"],["🏖️","Juegos electrónicos con pantallas táctiles portátiles a color"],["📝","La redacción de libros de actas"]], 0, "Pista: pasaban meses en la oscuridad y el polvo respirando gases tóxicos de mercurio."),
    q("¿Qué producto derivado del ganado vacuno comenzó a exportarse desde Buenos Aires en carretas y barcos?", [["🐮","Prendas de lana y abrigos gruesos de telar"],["🥛","Ropa ligera de seda traída de factorías orientales"],["🍔","Hamburguesas congeladas en cajas"]], 0, "Pista: el cuero se usaba en Europa para botas, arneses y correas de máquinas."),
    q("¿Por qué se fundó el Virreinato del Río de la Plata en 1776 con capital en Buenos Aires?", [["🏛️","Poncho criollo tejido en telar artesanal"],["🏖️","Capas de hule impermeable de origen fabril"],["⚽","Para organizar torneos deportivos coloniales"]], 0, "Pista: reorganización borbónica que incorporó el Alto Perú y la aduana porteña."),
    q("¿Qué moneda de plata acuñada en Potosí fue la más famosa y usada en el comercio mundial?", [["🪙","Comprender el esfuerzo de forjar la patria"],["💵","Aprender a fabricar ruedas de carreta con madera de quebracho"],["🪙","La moneda de plástico"]], 0, "Pista: circulaba por América, Europa y Asia como moneda de referencia internacional."),
  ],

  // Mundo 24
  24: [
    q("¿Qué nombre recibe el proceso impulsado por la Corona y la Iglesia para imponer la religión católica?", [["✝️","Ley fundamental y suprema de la Nación"],["⚔️","Un manual de normas de tránsito y transporte municipal"],["🏛️","La reforma constitucional"]], 0, "Pista: envío de sacerdotes y frailes para bautizar y cambiar las creencias indígenas."),
    q("¿Qué órdenes religiosas llegaron a América para educar y evangelizar a los pueblos nativos?", [["⛪","En Santa Fe el 1 de mayo de 1853"],["🏰","En la ciudad de Buenos Aires el 25 de mayo de 1810"],["🚢","Piratas navegantes del Caribe"]], 0, "Pista: crearon colegios, universidades y misiones en selvas y valles."),
    q("¿Qué eran las misiones o reducciones jesuíticas de Guaraníes en el Litoral?", [["🏘️","Representativa, republicana y federal"],["⛓️","Monarquía parlamentaria con primer ministro electo"],["🏭","Fábricas de armas de guerra"]], 0, "Pista: pueblos autónomos famosos por sus coros de música barroca, imprentas y yerbales."),
    q("¿Qué significa el concepto de 'mestizaje cultural' en la historia americana?", [["🎨","El pueblo gobierna mediante sus representantes"],["🛑","El gobernante decide leyes sin consultar al pueblo"],["📖","Aprender de memoria un solo libro de lectura"]], 0, "Pista: de esa mezcla nació la rica identidad de los pueblos hispanoamericanos."),
    q("¿Qué comida tradicional argentina es un claro ejemplo de mestizaje entre el maíz americano y la carne europea?", [["🍲","División de poderes y publicidad de actos"],["🍕","Concentración del poder en manos de un solo juez vitalicio"],["🍣","El sushi de pescado crudo"]], 0, "Pista: plato patrio que combina zapallo, porotos, maíz blanco, carne vacuna y cerdo."),
    q("¿Qué infusión originaria del pueblo guaraní fue adoptada por españoles y criollos hasta ser bebida nacional?", [["🧉","Provincias conservan autonomía y autoridades"],["☕","Todas las decisiones provinciales se toman en la capital"],["🍵","El té verde japonés"]], 0, "Pista: hojas de 'Ilex paraguariensis' cebadas en calabaza con bombilla."),
    q("¿Cómo se llama la mezcla de creencias religiosas nativas y cristianas (como asociar la Virgen María con la Pachamama)?", [["🙏","Prólogo con objetivos y principios de la Nación"],["⚔️","Índice general de materias y capítulos del código de leyes"],["📜","Contrato comercial"]], 0, "Pista: culto popular donde conviven santos católicos con símbolos de la Madre Tierra."),
    q("¿Qué estilo artístico europeo se transformó en América con motivos de flora y fauna locales?", [["🏛️","A trabajar, comerciar, transitar y aprender"],["🖼️","Comprar propiedades privadas sin pagar impuestos"],["📐","El cubismo geométrico"]], 0, "Pista: iglesias con ángeles con rostros indígenas y tallas con mazorcas de maíz."),
    q("¿Qué instrumento musical de cuerda inventado en los Andes se construía tradicionalmente con caparazón de quirquincho?", [["🪕","Limita el poder y garantiza libertades"],["🎻","Permite cambiar las leyes según la voluntad del presidente"],["🎹","El piano de cola"]], 0, "Pista: adaptación indígena de la guitarra española con sonido agudo y festivo."),
    q("¿Por qué los reyes de España expulsaron a los sacerdotes jesuitas de todos sus dominios en 1767?", [["👑","Su autonomía económica y social inquietaba a la Corona"],["💰","La provincia de Córdoba por desacuerdos aduaneros"],["⛵","Porque querían dedicarse a ser piratas"]], 0, "Pista: las misiones guaraníes decayeron tras la expulsión de la orden."),
    q("¿Qué fiesta tradicional andina mezcla música de sikus y diablos con la celebración previa a la Cuaresma?", [["🎭","Leyes deben respetar lo mandado en la Carta Magna"],["🎃","Los jueces pueden desestimar la Constitución si lo deciden"],["🎄","El árbol de Navidad con luces"]], 0, "Pista: comparsas callejeras con harina, albahaca y serpentinas en Jujuy."),
    q("¿Qué lengua originaria aportó palabras de uso cotidiano en el español como 'mate', 'choclo', 'pampa' y 'cancha'?", [["🗣️","Derechos de los trabajadores y seguridad social"],["🗣️","Obligación de realizar servicio militar obligatorio"],["🗣️","El griego clásico"]], 0, "Pista: términos andinos incorporados al habla común rioplatense."),
    q("¿Qué aporte cultural de origen africano influyó decisivamente en la música del Río de la Plata?", [["🥁","Convención Constituyente elegida por el pueblo"],["🎻","El gobernador de cada provincia mediante decreto"],["🎺","Las marchas militares inglesas"]], 0, "Pista: toques de tamboril en las comparsas de los barrios de negros de Buenos Aires y Montevideo."),
    q("¿Qué actitud de respeto es indispensable al estudiar las distintas creencias religiosas y pueblos?", [["🕊️","Unión nacional, justicia, paz interior y bienestar"],["⚔️","Conquistar territorios de países limítrofes y colonizarlos"],["🚪","El aislamiento para no hablar con nadie"]], 0, "Pista: valorar que cada cultura tiene su propia sabiduría y dignidad."),
    q("¿Quiénes continuaron la evangelización y educación en la Patagonia en el siglo XIX fundando colegios y talleres?", [["⛪","Defiende nuestras libertades y derechos ciudadanos"],["🏰","Determina las fechas de días feriados del calendario comercial"],["⚓","Los corsarios ingleses en sus barcos"]], 0, "Pista: crearon misiones, escuelas de oficios y exploraron ríos y lagos santacruceños."),
  ],

  // Mundo 25
  25: [
    q("¿Cuál es la ley suprema y fundamental de la República Argentina?", [["📜","Poder Ejecutivo, Legislativo y Judicial"],["📖","El Poder Militar, el Poder Policial y el Eclesiástico"],["📋","El manual de convivencia escolar"]], 0, "Pista: ninguna ley ni ordenanza puede contradecirla."),
    q("¿En qué año se sancionó la Constitución Nacional histórica en la ciudad de Santa Fe?", [["🏛️","Presidente de la Nación Argentina"],["🏛️","El Presidente de la Honorable Corte Suprema"],["🏛️","En 1982"]], 0, "Pista: redactada por los constituyentes inspirados en las bases de Juan Bautista Alberdi."),
    q("¿Qué forma de gobierno establece el artículo 1.º de la Constitución Nacional?", [["🗳️","Debatir, redactar y sancionar las leyes"],["👑","Administrar el presupuesto de obras en los municipios"],["🏢","Dictatorial con gobierno de una sola persona"]], 0, "Pista: el pueblo gobierna a través de sus representantes y se dividen los poderes."),
    q("¿Por qué nuestro país adopta la forma 'representativa' de gobierno?", [["👥","Cámara de Diputados y Cámara de Senadores"],["👑","Los tribunales de justicia civil y comercial"],["🎲","Porque las leyes se deciden tirando los dados"]], 0, "Pista: elegimos a presidente, gobernadores, senadores y diputados para representarnos."),
    q("¿Qué significa que la Argentina sea una república 'federal'?", [["🗺️","Administrar justicia y aplicar las leyes vigentes"],["🏛️","Nombrar a los ministros del gabinete nacional"],["👑","Que no existen provincias ni intendencias"]], 0, "Pista: Santa Cruz tiene su propia Constitución, gobernación y legislatura."),
    q("¿Cuáles son los tres poderes del Estado republicano que se controlan mutuamente?", [["⚖️","Gobernador de la Provincia de Santa Cruz"],["⚽","El intendente de la ciudad capital de Gallegos"],["📺","La televisión, la radio y los diarios"]], 0, "Pista: división de poderes para evitar el abuso y garantizar las libertades ciudadanas."),
    q("¿Quién encabeza el Poder Ejecutivo Nacional y administra el país?", [["🏛️","Honorable Cámara de Diputados provincial"],["👨‍⚖️","El Concejo Deliberante de la ciudad capital"],["🗣️","El diputado más anciano del congreso"]], 0, "Pista: elegido por voto popular por cuatro años."),
    q("¿Qué órgano bicameral integra el Poder Legislativo Nacional encargado de debatir y sancionar las leyes?", [["🏛️","Nivel Municipal, Provincial y Nacional"],["🏢","El Nivel Comunal, Nivel Regional y Nivel Continental"],["🏦","El banco hipotecario"]], 0, "Pista: senadores representan a las provincias y diputados al pueblo de la nación."),
    q("¿Quiénes integran el Poder Judicial de la Nación para hacer cumplir las leyes y juzgar los delitos?", [["⚖️","Intendente de la ciudad o localidad"],["👮","El comisario de la seccional policial local"],["👨‍🏫","Los directores de escuelas primarias"]], 0, "Pista: jueces independientes que resuelven conflictos y dictan sentencias."),
    q("¿Qué es el voto universal, secreto y obligatorio establecido por la Ley Sáenz Peña de 1912?", [["🗳️","Concejo Deliberante de la localidad"],["📢","La Honorable Legislatura provincial con sede en Gallegos"],["💰","Pagar una entrada para poder sufragar"]], 0, "Pista: nadie puede saber por quién votaste ni obligarte a votar a un candidato."),
    q("¿Qué derechos fundamentales protege el artículo 14 de la Constitución para todos los habitantes?", [["📜","Evitar abusos con control mutuo entre poderes"],["👑","Acelerar la recaudación de fondos impositivos generales"],["🛑","Prohibir que los vecinos escuchen música"]], 0, "Pista: libertades cívicas esenciales de la vida en sociedad."),
    q("¿Qué artículo incorporado en 1957 protege los derechos de los trabajadores (jornada limitada, salario digno, jubilación y huelga)?", [["👷","Alumbrado, barrido, limpieza y plazas"],["📜","La emisión de pasaportes oficiales y moneda nacional"],["📜","El artículo 100"]], 0, "Pista: consagra las leyes de protección laboral y de la seguridad social."),
    q("¿Por qué los cargos en el gobierno republicano duran un período determinado y no son para siempre?", [["🔄","Por la periodicidad y alternancia de mandatos"],["😴","Cada diez años en elecciones unificadas mundiales"],["💰","Para no pagar sueldos todos los meses"]], 0, "Pista: permite al pueblo renovar o cambiar periódicamente a sus autoridades."),
    q("¿Qué significa el principio republicano de 'publicidad de los actos de gobierno'?", [["📰","El Presidente con acuerdo del Senado"],["🔒","Votación popular abierta en comicios municipales"],["📺","Que deben filmar novelas de televisión"]], 0, "Pista: transparencia y acceso a la información pública para la ciudadanía."),
    q("¿Qué valor cívico es fundamental para la convivencia pacífica en una sociedad democrática?", [["🤝","Garantizar la libertad y los derechos de todos"],["⚔️","Aumentar el número de oficinas públicas del Estado"],["🚪","Desentenderse de los problemas del barrio"]], 0, "Pista: construir entre todos una comunidad justa, solidaria y en paz."),
  ],

  // Mundo 26
  26: [
    q("¿Qué ley fundamental organiza las instituciones y derechos en nuestra provincia?", [["📜","Gobierno del pueblo mediante el voto"],["📖","Mando exclusivo de jefes militares por decreto"],["📋","El manual de pesca deportiva"]], 0, "Pista: sancionada en 1957 cuando Santa Cruz dejó de ser Territorio Nacional y se convirtió en provincia."),
    q("¿Quién ejerce el Poder Ejecutivo en el gobierno provincial de Santa Cruz?", [["🏛️","Ley Sáenz Peña de voto secreto y universal"],["🏛️","El primer censo de población general del territorio nacional"],["👨‍⚖️","El juez de paz de pueblo"]], 0, "Pista: elegido por el voto de los santacruceños por cuatro años con sede en Río Gallegos."),
    q("¿Cómo se llama el cuerpo unicameral que sanciona las leyes provinciales santacruceñas?", [["🏛️","Universal, igual, secreto y obligatorio"],["🏢","Público a mano alzada y optativo para varones"],["🏦","El Directorio del Banco"]], 0, "Pista: integrada por diputados por distrito y diputados por pueblo."),
    q("¿Quién es la máxima autoridad del poder ejecutivo en una ciudad o municipio santacruceño?", [["🏙️","Voto femenino con la Ley 13.010 de 1947"],["👨‍🏫","La obligatoriedad de trabajar en cargos públicos del Estado"],["👮","El comisario de seccional"]], 0, "Pista: administra los servicios locales: barrido, alumbrado, plazas y tránsito."),
    q("¿Qué institución municipal integrada por concejales debate y aprueba las ordenanzas locales?", [["🏛️","A la vida, salud, educación y juego"],["🏢","A trabajar en fábricas industriales desde niños"],["🏥","El hospital regional"]], 0, "Pista: los concejales dictan las normas de convivencia del municipio."),
    q("¿Qué son los pueblos y comisiones de fomento en el interior santacruceño?", [["🏡","Regulan la convivencia y previenen conflictos"],["🏰","Impiden que las personas se reúnan en las plazas públicas"],["⛺","Campamentos que se desarman cada noche"]], 0, "Pista: como Jaramillo, Fitz Roy, Koluel Kaike o Tres Lagos."),
    q("¿Qué tratado internacional con jerarquía constitucional protege a todos los menores de 18 años?", [["👶","Diálogo, escucha activa y respeto mutuo"],["📜","Imponiendo la fuerza y la autoridad del más grande del grupo"],["🚗","El tratado de límites marítimos"]], 0, "Pista: aprobada por las Naciones Unidas en 1989 y ratificada por Argentina."),
    q("¿Cuál de estos es un derecho fundamental de los niños consagrado en la Convención?", [["📚","Libertad de expresión y pensamiento"],["💼","Poder inventar noticias falsas para dañar a otros"],["🛑","El deber de pagar impuestos municipales"]], 0, "Pista: garantiza el crecimiento integral y el bienestar de cada chico."),
    q("¿Qué derecho garantiza que cada niño tenga un nombre, un apellido y una nacionalidad?", [["🆔","Derecho a ser escuchados y valorados"],["🏖️","El deber de pagar impuestos municipales escolares a tiempo"],["🚲","El derecho a tener bicicleta propia"]], 0, "Pista: el Registro Civil inscribe a los recién nacidos de forma gratuita."),
    q("¿Qué principio establece que en cualquier decisión judicial o administrativa debe primar el beneficio de los chicos?", [["⚖️","Cuidar los bienes públicos y respetar a todos"],["💰","Exigir atención preferencial en todos los trámites comunes"],["⏰","La rapidez del trámite burocrático"]], 0, "Pista: principio legal rector de todas las leyes de infancia."),
    q("¿Qué derecho tienen los niños en la escuela y la familia cuando se toman decisiones que los involucran?", [["🗣️","Un tratado de derechos humanos de jerarquía constitucional"],["🤐","Un manual de recomendaciones pedagógicas para docentes"],["🚪","Tener que salir de la habitación siempre"]], 0, "Pista: su voz y sentimientos deben respetarse según su edad y madurez."),
    q("¿Por qué el juego y el tiempo libre están reconocidos como un derecho infantil indispensable?", [["⚽","Defensoría del Pueblo"],["😴","Organizar las elecciones de intendentes y concejales locales"],["📺","Para vender juguetes de plástico"]], 0, "Pista: jugar es la forma natural en que los niños aprenden y se desarrollan felices."),
    q("¿Qué organismo y líneas telefónicas gratuitas existen para proteger a chicos de situaciones de maltrato?", [["📞","Elegir representantes y expresar opiniones"],["📻","Obliga a coincidir siempre con la postura de la mayoría"],["⏰","La llamada de la hora oficial"]], 0, "Pista: atención especializada y confidencial ante situaciones de violencia o desamparo."),
    q("¿Qué significa que la educación primaria en Santa Cruz sea pública y gratuita?", [["🏫","Acuerdos escolares construidos entre todos"],["🎒","El reglamento interno de sanciones disciplinarias policiales"],["💰","Que se cobra entrada en la puerta de la escuela"]], 0, "Pista: derecho social sostenido por el Estado para asegurar la igualdad de oportunidades."),
    q("¿Cómo pueden los alumnos de 4.º grado ejercer su ciudadanía responsable en la escuela?", [["🤝","Compromiso de todos por la paz y la igualdad"],["🚪","Una tarea que compete exclusivamente a los gobernantes"],["🤐","No participando jamás en las clases grupales"]], 0, "Pista: la democracia se practica todos los días con empatía, diálogo y cooperación."),
  ],

};

export const EXTRA_SOCIALES: Record<number, ActivitySpec[]> = {
  1: [
    makeClassify("s1-ex-0", "Clasificá los límites geográficos de Santa Cruz:", ["Límite con provincias o países", "Límite marítimo"], [
      { label: "Chubut al norte", cat: 0 },
      { label: "Chile al oeste y al sur", cat: 0 },
      { label: "Mar Argentino al este", cat: 1 },
      { label: "Océano Atlántico Sur", cat: 1 },
    ], "Pista: al este limita con el Mar Argentino; al norte con Chubut y al oeste con Chile.", ["s4-mapa-argentina"]),
    makeTrueFalse("s1-ex-1", "La provincia de Santa Cruz se encuentra en el sur de la Patagonia continental argentina.", true, "Pista: es parte de la Patagonia austral.", ["s4-mapa-argentina"]),
  ],
  2: [
    makeClassify("s2-ex-0", "Clasificá las localidades según su departamento:", ["Guer Aike", "Lago Argentino"], [
      { label: "Río Gallegos", cat: 0 },
      { label: "El Calafate", cat: 1 },
      { label: "Río Turbio", cat: 0 },
      { label: "El Chaltén", cat: 1 },
    ], "Pista: Río Gallegos y Río Turbio en Guer Aike; El Calafate y El Chaltén en Lago Argentino.", ["s4-departamentos"]),
    makeTrueFalse("s2-ex-1", "La provincia de Santa Cruz está dividida administrativamente en 7 departamentos.", true, "Pista: son siete distritos departamentales.", ["s4-departamentos"]),
  ],
  3: [
    makeOrder("s3-ex-0", "Ordená los grandes relieves santacruceños de OESTE a ESTE:", [
      "Cordillera de los Andes con bosques y glaciares",
      "Meseta patagónica escalonada",
      "Costa atlántica con acantilados y playas",
    ], "Pista: empezá en la montaña andina y terminá en el mar.", ["s4-relieves"]),
    makeTrueFalse("s3-ex-1", "Las mesetas patagónicas descienden en escalones sucesivos hacia el Mar Argentino.", true, "Pista: forman terrazas geológicas que pierden altura hacia el este.", ["s4-relieves"]),
  ],
  4: [
    makeClassify("s4-ex-0", "Clasificá los cuerpos de agua de Santa Cruz:", ["Ríos", "Lagos"], [
      { label: "Río Santa Cruz", cat: 0 },
      { label: "Lago Argentino", cat: 1 },
      { label: "Río Gallegos", cat: 0 },
      { label: "Lago Buenos Aires", cat: 1 },
    ], "Pista: los ríos transportan agua corriente hacia el mar; los lagos son grandes espejos de agua.", ["s4-rios-clima"]),
    makeTrueFalse("s4-ex-1", "El río Santa Cruz nace en el Lago Argentino y desemboca en el Mar Argentino.", true, "Pista: es el curso de agua más caudaloso de la provincia.", ["s4-rios-clima"]),
  ],
  5: [
    makeClassify("s5-ex-0", "Clasificá los recursos naturales:", ["Recursos renovables", "Recursos no renovables"], [
      { label: "Fuerza del viento para energía eólica", cat: 0 },
      { label: "Petróleo extraído del subsuelo", cat: 1 },
      { label: "Gas natural subterráneo", cat: 1 },
      { label: "Frutos de cerezas cultivados en chacra", cat: 0 },
    ], "Pista: el viento y las cosechas se renuevan; los hidrocarburos pueden agotarse.", ["s4-recursos-produccion"]),
    makeTrueFalse("s5-ex-1", "La energía eólica aprovecha la fuerza del viento patagónico para producir electricidad limpia.", true, "Pista: funciona mediante grandes parques de molinos aerogeneradores.", ["s4-recursos-produccion"]),
  ],
  6: [
    makeClassify("s6-ex-0", "Clasificá las actividades según el sector económico:", ["Sector Primario (extracción)", "Sector Secundario e Industrial"], [
      { label: "Cría de ganado ovino en el campo", cat: 0 },
      { label: "Extracción de petróleo en yacimientos", cat: 0 },
      { label: "Hilado y tejido industrial de la lana", cat: 1 },
      { label: "Refinación de combustible en destilerías", cat: 1 },
    ], "Pista: el sector primario obtiene recursos directamente de la naturaleza.", ["s4-actividades-primarias"]),
    makeTrueFalse("s6-ex-1", "La ganadería ovina en Santa Cruz se orienta principalmente a la producción de lana y carne.", true, "Pista: las ovejas se adaptan a los pastizales duros de la estepa.", ["s4-actividades-primarias"]),
  ],
  7: [
    makeOrder("s7-ex-0", "Ordená los eslabones del circuito productivo de la lana:", [
      "Eslabón primario: esquila y acondicionamiento en estancia",
      "Eslabón industrial: lavado, peinado e hilado en lavadero",
      "Eslabón comercial: exportación y confección de prendas",
    ], "Pista: primero se obtiene la materia prima, luego se transforma y finalmente se vende.", ["s4-circuitos-productivos"]),
    makeTrueFalse("s7-ex-1", "Un circuito productivo abarca todas las etapas desde la obtención de materia prima hasta el consumidor.", true, "Pista: articula el campo, la industria, el transporte y el comercio.", ["s4-circuitos-productivos"]),
  ],
  8: [
    makeOrder("s8-ex-0", "Ordená las tareas de una jornada de esquila en la estancia:", [
      "Arreo de la majada desde los cuadros hasta los corrales",
      "Esquila cuidadosa del vellón entero en el galpón",
      "Clasificación de la lana y prensado en fardos",
    ], "Pista: primero se juntan los animales, se corta la lana y luego se enfarda.", ["s4-estancia-patagonica"]),
    makeTrueFalse("s8-ex-1", "El puestero recorre a caballo los cuadros de la estancia cuidando las ovejas y los alambrados.", true, "Pista: es una tarea rural tradicional en los campos santacruceños.", ["s4-estancia-patagonica"]),
  ],
  9: [
    makeClassify("s9-ex-0", "Clasificá las localidades según su ubicación:", ["Localidades de la Costa Atlántica", "Localidades de la Cordillera"], [
      { label: "Puerto Deseado", cat: 0 },
      { label: "El Calafate", cat: 1 },
      { label: "Caleta Olivia", cat: 0 },
      { label: "El Chaltén", cat: 1 },
    ], "Pista: Deseado y Caleta sobre el mar; Calafate y Chaltén junto a la cordillera.", ["s4-ciudades-puertos"]),
    makeTrueFalse("s9-ex-1", "Puerto Deseado cuenta con un puerto marítimo de aguas profundas sobre su ría natural.", true, "Pista: es un punto clave para la salida de la pesca y minerales.", ["s4-ciudades-puertos"]),
  ],
  10: [
    makeClassify("s10-ex-0", "Clasificá las características de la población santacruceña:", ["Áreas Urbanas", "Áreas Rurales"], [
      { label: "Concentración de escuelas, comercios y hospitales", cat: 0 },
      { label: "Población dispersa en estancias y parajes", cat: 1 },
      { label: "Río Gallegos y Caleta Olivia", cat: 0 },
      { label: "Pobladores dedicados al cuidado de ganado", cat: 1 },
    ], "Pista: la gran mayoría de los santacruceños vive en ciudades.", ["s4-poblacion-migraciones"]),
    makeTrueFalse("s10-ex-1", "Santa Cruz es una provincia de gran extensión pero con baja densidad de población.", true, "Pista: tiene pocos habitantes por kilómetro cuadrado dispersos en su territorio.", ["s4-poblacion-migraciones"]),
  ],
  11: [
    makeClassify("s11-ex-0", "Clasificá los atractivos protegidos en Parques Nacionales:", ["Parque Nacional Los Glaciares", "Parque Nacional Monte León"], [
      { label: "Glaciar Perito Moreno y Lago Argentino", cat: 0 },
      { label: "Colonias costeras de pingüinos de Magallanes", cat: 1 },
      { label: "Cerro Fitz Roy y cerro Torre", cat: 0 },
      { label: "Apostaderos de lobos marinos en restingas", cat: 1 },
    ], "Pista: Los Glaciares en la cordillera; Monte León sobre la costa marina.", ["s4-areas-protegidas"]),
    makeTrueFalse("s11-ex-1", "El Parque Nacional Los Glaciares fue declarado Patrimonio de la Humanidad por la UNESCO.", true, "Pista: protege una de las reservas de hielo continental más importantes del mundo.", ["s4-areas-protegidas"]),
  ],
  12: [
    makeClassify("s12-ex-0", "Clasificá las acciones frente al medio ambiente:", ["Acciones de deterioro ambiental", "Acciones de conservación sustentable"], [
      { label: "Sobrepastoreo excesivo sin rotación de potreros", cat: 0 },
      { label: "Pastoreo rotativo permitiendo semillar a las plantas", cat: 1 },
      { label: "Arrojar bolsas plásticas al viento de la meseta", cat: 0 },
      { label: "Separación de residuos para reciclado en origen", cat: 1 },
    ], "Pista: cuidar el suelo y no arrojar basura protege la estepa.", ["s4-problemas-ambientales"]),
    makeTrueFalse("s12-ex-1", "El pastoreo rotativo permite que las plantas nativas semillen y el suelo recupere fertilidad.", true, "Pista: evita la desertificación de la estepa patagónica.", ["s4-problemas-ambientales"]),
  ],
  13: [
    makeOrder("s13-ex-0", "Ordená los pasos de armado del toldo aonikenk (tehuelche):", [
      "Disposición de los postes de madera inclinados",
      "Extensión de la capa de cueros de guanaco cosidos",
      "Fijación con estacas y tientos de cuero al suelo",
    ], "Pista: primero se coloca la estructura, luego los cueros y finalmente se amarra.", ["s4-primeros-pobladores"]),
    makeTrueFalse("s13-ex-1", "Los Aonikenk eran cazadores nómadas que recorrían la meseta tras el guanaco y el choique.", true, "Pista: pueblo ancestral que habitó la Patagonia continental.", ["s4-primeros-pobladores"]),
  ],
  14: [
    makeClassify("s14-ex-0", "Clasificá las herramientas de los pueblos originarios de la meseta:", ["Armas de caza", "Instrumentos de trabajo"], [
      { label: "Boleadoras con tientos de cuero", cat: 0 },
      { label: "Raspadores de piedra para limpiar cueros", cat: 1 },
      { label: "Arco y flecha con puntas líticas", cat: 0 },
      { label: "Punzón de hueso para coser toldos", cat: 1 },
    ], "Pista: boleadoras y arcos para cazar; raspadores y punzones para preparar cueros.", ["s4-aonikenk-cultura"]),
    makeTrueFalse("s14-ex-1", "El toldo de cuero de guanaco de los Aonikenk era liviano y fácil de desarmar para viajar.", true, "Pista: vivienda transportable ideal para un modo de vida nómada.", ["s4-aonikenk-cultura"]),
  ],
  15: [
    makeClassify("s15-ex-0", "Clasificá los pueblos originarios del extremo sur:", ["Yámanas (Canoeros)", "Selk'nam (Cazadores terrestres)"], [
      { label: "Navegación constante en canoas de corteza", cat: 0 },
      { label: "Caza pedestre del guanaco en la Isla Grande", cat: 1 },
      { label: "Arpones de hueso para cazar lobos marinos", cat: 0 },
      { label: "Ceremonia del Hain con máscaras y pintura", cat: 1 },
    ], "Pista: Yámanas en los canales a remo; Selk'nam caminando por las estepas fueguinas.", ["s4-pueblos-canales"]),
    makeTrueFalse("s15-ex-1", "Los Yámanas mantenían siempre un fogón encendido sobre tierra dentro de sus canoas.", true, "Pista: les permitía calentarse y cocinar mientras navegaban las aguas frías.", ["s4-pueblos-canales"]),
  ],
  16: [
    makeClassify("s16-ex-0", "Clasificá los elementos culturales Mapuche y Mapuche-Tehuelche:", ["Autoridades y roles comunitarios", "Instrumentos y expresiones culturales"], [
      { label: "Lonko (autoridad política y comunitaria)", cat: 0 },
      { label: "Kultrún (tambor ceremonial sagrado)", cat: 1 },
      { label: "Machi (guía espiritual y médica tradicional)", cat: 0 },
      { label: "Trutruka (instrumento de viento tradicional)", cat: 1 },
    ], "Pista: el lonko y la machi guían la comunidad; el kultrún y la trutruka son instrumentos.", ["s4-mapuche-tehuelche"]),
    makeTrueFalse("s16-ex-1", "La cosmovisión mapuche promueve una relación de profundo respeto y reciprocidad con la naturaleza.", true, "Pista: la Ñuke Mapu (Madre Tierra) es considerada fuente sagrada de vida.", ["s4-mapuche-tehuelche"]),
  ],
  17: [
    makeClassify("s17-ex-0", "Clasificá las innovaciones de la civilización incaica:", ["Agricultura e infraestructura", "Organización social y registros"], [
      { label: "Terrazas de cultivo escalonadas en cerros", cat: 0 },
      { label: "Quipus (cuerdas con nudos para registrar datos)", cat: 1 },
      { label: "Red de caminos del inca con puentes colgantes", cat: 0 },
      { label: "Chasquis (mensajeros que corrían por postas)", cat: 1 },
    ], "Pista: terrazas y caminos transformaron el relieve; quipus y chasquis organizaron el imperio.", ["s4-civilizaciones-americanas"]),
    makeTrueFalse("s17-ex-1", "Los incas construyeron terrazas de cultivo en las laderas andinas para sembrar maíz y papas.", true, "Pista: permitían aprovechar la pendiente de las montañas regando con canales de piedra.", ["s4-civilizaciones-americanas"]),
  ],
  18: [
    makeOrder("s18-ex-0", "Ordená los hechos de la expedición de Magallanes y Elcano en 1520:", [
      "Llegada a Puerto San Julián e invernada de la flota",
      "Descubrimiento del estrecho interoceánico hacia el Pacífico",
      "Regreso de la nao Victoria a España al mando de Elcano",
    ], "Pista: invernaron en San Julián, cruzaron el estrecho y completaron la vuelta al mundo.", ["s4-magallanes-viajes"]),
    makeTrueFalse("s18-ex-1", "La nao Victoria fue la única nave de la expedición de Magallanes que completó la primera vuelta al mundo.", true, "Pista: regresó al mando de Juan Sebastián Elcano en 1522.", ["s4-magallanes-viajes"]),
  ],
  19: [
    makeClassify("s19-ex-0", "Clasificá los elementos del plano colonial de una ciudad:", ["Alrededor de la Plaza Mayor", "En las manzanas adyacentes"], [
      { label: "El Cabildo de la ciudad", cat: 0 },
      { label: "Solares de vecinos con viviendas y huertas", cat: 1 },
      { label: "La Iglesia Matriz o Catedral", cat: 0 },
      { label: "Comercios menores y talleres artesanales", cat: 1 },
    ], "Pista: los edificios de mayor autoridad rodeaban directamente la Plaza Mayor.", ["s4-viajes-ciudades"]),
    makeTrueFalse("s19-ex-1", "Las ciudades hispanoamericanas se fundaban siguiendo un trazado regular en damero o cuadrícula.", true, "Pista: ordenanzas reales que establecían calles rectas alrededor de una plaza central.", ["s4-viajes-ciudades"]),
  ],
  20: [
    makeClassify("s20-ex-0", "Clasificá los grupos sociales de la época colonial:", ["Sectores privilegiados", "Sectores trabajadores y subalternos"], [
      { label: "Españoles peninsulares nacidos en Europa", cat: 0 },
      { label: "Población afrodescendiente esclavizada", cat: 1 },
      { label: "Criollos propietarios de tierras y comercios", cat: 0 },
      { label: "Mestizos e indígenas encomendados", cat: 1 },
    ], "Pista: los peninsulares y criollos concentraban el poder político y económico.", ["s4-sociedad-colonial"]),
    makeTrueFalse("s20-ex-1", "El mestizaje colonial enriqueció la cultura mediante el intercambio de saberes, palabras y comidas.", true, "Pista: dio origen a una sociedad diversa y plural en América.", ["s4-sociedad-colonial"]),
  ],
  21: [
    makeOrder("s21-ex-0", "Ordená los sucesos de la Semana de Mayo de 1810:", [
      "Llegada de noticias de la caída de la Junta de Sevilla",
      "Cabildo Abierto del 22 de mayo para debatir el mando",
      "Formación de la Primera Junta de Gobierno el 25 de mayo",
    ], "Pista: las noticias impulsaron el cabildo abierto que destituyó al virrey.", ["s4-revolucion-mayo"]),
    makeTrueFalse("s21-ex-1", "El 25 de mayo de 1810 se formó la Primera Junta presidida por Cornelio Saavedra.", true, "Pista: fue nuestro primer gobierno patrio sin autoridades virreinales.", ["s4-revolucion-mayo"]),
  ],
  22: [
    makeClassify("s22-ex-0", "Clasificá los aspectos del Congreso de Tucumán de 1816:", ["Decisiones políticas patrias", "Contexto de defensa militar"], [
      { label: "Firma del Acta de la Independencia de España", cat: 0 },
      { label: "Resistencia gaucha de Güemes en la frontera norte", cat: 1 },
      { label: "Declaración formal de las Provincias Unidas libres", cat: 0 },
      { label: "Plan de San Martín para cruzar los Andes y liberar Chile", cat: 1 },
    ], "Pista: los congresales declararon la independencia mientras los ejércitos defendían el territorio.", ["s4-declaracion-independencia"]),
    makeTrueFalse("s22-ex-1", "El 9 de julio de 1816 las Provincias Unidas proclamaron su independencia formal de la monarquía española.", true, "Pista: se firmó el Acta en la histórica casa de San Miguel de Tucumán.", ["s4-declaracion-independencia"]),
  ],
  23: [
    makeClassify("s23-ex-0", "Clasificá la vida cotidiana en 1816:", ["Transporte y viajes", "Vida social y costumbres"], [
      { label: "Carretas de bueyes y galeras por huellas de tierra", cat: 0 },
      { label: "Fogones con guitarra, mate y payadas criollas", cat: 1 },
      { label: "Chasquis a caballo que cambiaban montas en postas", cat: 0 },
      { label: "Bailes folclóricos como el pericón y el cielito", cat: 1 },
    ], "Pista: las carretas y chasquis comunicaban pueblos; fogones y bailes unían a las familias.", ["s4-vida-independencia"]),
    makeTrueFalse("s23-ex-1", "En 1816 los viajes entre provincias demoraban semanas enteras en carretas y galeras.", true, "Pista: los caminos eran de tierra y se descansaba en postas rurales.", ["s4-vida-independencia"]),
  ],
  24: [
    makeClassify("s24-ex-0", "Clasificá las características de la Constitución Nacional:", ["Principios republicanos", "Estructura federal"], [
      { label: "División del poder en Ejecutivo, Legislativo y Judicial", cat: 0 },
      { label: "Autonomía de las provincias para elegir autoridades", cat: 1 },
      { label: "Publicidad de los actos de gobierno y periodicidad", cat: 0 },
      { label: "Leyes y constituciones provinciales propias", cat: 1 },
    ], "Pista: la división de poderes es republicana; la autonomía provincial es federal.", ["s4-constitucion-estado"]),
    makeTrueFalse("s24-ex-1", "La Constitución Nacional Argentina fue sancionada en 1853 y es la ley suprema del país.", true, "Pista: todas las demás leyes deben respetar sus mandatos y principios.", ["s4-constitucion-estado"]),
  ],
  25: [
    makeClassify("s25-ex-0", "Clasificá las autoridades según su nivel de gobierno:", ["Nivel Municipal", "Nivel Provincial", "Nivel Nacional"], [
      { label: "Intendente de la localidad", cat: 0 },
      { label: "Gobernador de Santa Cruz", cat: 1 },
      { label: "Presidente de la Nación", cat: 2 },
      { label: "Concejales del Concejo Deliberante", cat: 0 },
      { label: "Diputados de la Legislatura Provincial", cat: 1 },
      { label: "Senadores del Congreso Nacional", cat: 2 },
    ], "Pista: municipio en la ciudad, provincia en Santa Cruz, nación en todo el país.", ["s4-niveles-gobierno"]),
    makeTrueFalse("s25-ex-1", "En Santa Cruz el Poder Legislativo está a cargo de la Honorable Cámara de Diputados.", true, "Pista: es la legislatura provincial con sede en Río Gallegos.", ["s4-niveles-gobierno"]),
  ],
  26: [
    makeClassify("s26-ex-0", "Clasificá los derechos y deberes ciudadanos:", ["Derechos fundamentales", "Deberes ciudadanos"], [
      { label: "Derecho a la educación pública y a la salud", cat: 0 },
      { label: "Respetar las normas y cuidar los bienes públicos", cat: 1 },
      { label: "Derecho a expresarse y votar libremente", cat: 0 },
      { label: "Resolver los conflictos mediante el diálogo pacífico", cat: 1 },
    ], "Pista: los derechos protegen a las personas; los deberes aseguran la convivencia en sociedad.", ["s4-derechos-convivencia"]),
    makeTrueFalse("s26-ex-1", "La Convención sobre los Derechos del Niño garantiza que todos los chicos tengan derecho a jugar y estudiar.", true, "Pista: tiene jerarquía constitucional en la República Argentina.", ["s4-derechos-convivencia"]),
  ],
};

export function buildSocialesActivities(world: WorldDef): ActivitySpec[] {
  const n = world.worldNumber ?? 1;
  const count = world.activityCount ?? 8;
  const bank = SOCIALES_BANK[n] ?? SOCIALES_BANK[1];
  // Tomamos 6 preguntas de opción múltiple del banco
  const qActs = fromBank(bank, Math.max(4, count - 2), `s${n}`, world.skills ?? []);
  // Garantizamos al menos 2 actividades interactivas (clasificar, ordenar o V/F)
  const extraPool = EXTRA_SOCIALES[n] ?? [];
  const extraActs = sample(extraPool, Math.min(2, extraPool.length)).map((a, i) => ({
    ...a,
    id: `${a.id || `s${n}-ex-${i}`}`,
    skills: world.skills && world.skills.length > 0 ? world.skills : (a.skills ?? []),
  }));
  return numbered(shuffle([...qActs, ...extraActs]));
}
