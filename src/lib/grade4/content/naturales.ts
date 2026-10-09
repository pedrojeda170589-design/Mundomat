// Banco de preguntas y actividades de Ciencias Naturales de 4.º grado (26 mundos).
// Cada mundo cuenta con 15 preguntas curriculares de opción equilibrada
// más actividades interactivas (clasificar, ordenar, verdadero/falso).
import type { ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import { fromBank, makeClassify, makeOrder, makeVF, numbered, pickOne, Q, q, shuffle } from "./util";

export const NATURALES_BANK: Record<number, Q[]> = {
  // Mundo 1
  1: [
    q("¿Cuáles son los tres grandes ambientes naturales que componen el territorio de Santa Cruz?", [["🌾","La estepa patagónica, el bosque andino y la costa marítima"],["🌴","La llanura pampeana húmeda, el monte chaqueño y los esteros"],["🏜️","El desierto cálido, la pradera pampeana y el delta de río"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué características de clima y suelo definen al ambiente de la estepa patagónica?", [["💨","Viento fuerte constante, escasas lluvias y suelo pedregoso"],["🌧️","Lluvias torrenciales continuas, clima húmedo y suelo blando con turba"],["☀️","Clima templado oceánico con suelos negros de pradera húmeda"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué condiciones ambientales permiten el crecimiento del bosque andino en la cordillera?", [["🌧️","Abundantes lluvias y nevadas alimentadas por la humedad del Pacífico"],["🏜️","Sequedad absoluta durante todo el año y temperaturas cálidas extremas"],["🌴","Clima cálido con abundantes lluvias en todas las estaciones"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué rasgos caracterizan al litoral y costa marítima santacruceña sobre el Atlántico?", [["🌊","Grandes mareas, aguas marinas frías y acantilados rocosos"],["🌴","Costas de aguas templadas con manglares y playas de arena"],["🌾","Ríos de agua dulce bordeados por densos pastizales llanos"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿En qué ambiente natural de Santa Cruz encontramos los grandes glaciares y campos de hielo?", [["🏔️","En el ambiente cordillerano del bosque andino"],["🌾","En el centro llano de la meseta esteparia"],["🏖️","En las playas y restingas de la costa marítima"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Por qué las plantas de la estepa crecen en matas bajas y achaparradas cerca del suelo?", [["💨","Para protegerse de los fuertes vientos y reducir la pérdida de humedad"],["🌑","Porque en la meseta el suelo rocoso impide el desarrollo de raíces y tallos altos"],["❄️","Porque los animales les comen todas las ramas altas en verano"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué tipo de suelo predomina en la mayor parte de la meseta esteparia santacruceña?", [["🪨","Suelo pedregoso, arenoso y con escasa materia orgánica"],["🌱","Tierra negra esponjosa muy rica en humus y abono vegetal"],["🧱","Suelos negros profundos con abundante materia orgánica"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué ambiente natural alberga colonias de pingüinos de Magallanes y lobos marinos?", [["🐧","La costa marítima y sus islas acantiladas"],["🌲","Los valles boscosos húmedos de la cordillera andina patagónica"],["🌾","Las mesetas pedregosas del centro"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Cómo influye la cordillera de los Andes en las precipitaciones de los distintos ambientes?", [["🏔️","Retiene la humedad del oeste provocando lluvias en el bosque y sequedad en la estepa"],["☀️","Detiene por completo todos los vientos dejando a la provincia sin aire en movimiento constante"],["🌊","Desvía las nubes hacia el norte sin dejar lluvias en la cordillera"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué especie vegetal arbórea es la más abundante y característica de los bosques andinos?", [["🍂","La lenga caducifolia"],["🌴","La palmera pindó"],["🌵","El quebracho blanco del norte"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué mamífero herbívoro autóctono es el más emblemático y adaptado a la meseta esteparia?", [["🦙","El guanaco patagónico"],["🐘","El tapir de monte"],["🐒","El carpincho de lagunas"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Cuál de los tres ambientes santacruceños experimenta la mayor amplitud térmica diaria entre el día y la noche?", [["🌾","La estepa patagónica por su clima seco y despejado"],["🌊","Las aguas abiertas del litoral marítimo frente a la costa atlántica"],["🌲","El interior sombreado y húmedo del bosque andino"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Cómo se llama la plataforma rocosa costera que queda al descubierto durante la marea baja?", [["🌊","La restinga intermareal"],["🏔️","La cumbre nevada"],["🏜️","El cañadón seco de la meseta"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿De qué manera se conectan los ambientes de cordillera, estepa y costa en Santa Cruz?", [["💧","A través de los ríos provinciales que llevan agua de deshielo desde los Andes hasta el mar"],["🧱","Permanecen completamente aislados por barreras geográficas fijas sin contacto alguno entre los ambientes"],["🦅","Mantienen condiciones climáticas idénticas a lo largo de todo el año"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Por qué es prioritario crear áreas protegidas y parques en cada uno de estos ambientes?", [["🌱","Para conservar la biodiversidad y los ecosistemas autóctonos de cada región"],["🏭","Para habilitar grandes fábricas industriales y depósitos en zonas vírgenes"],["🏗️","Para nivelar todos los terrenos naturales y construir complejos comerciales"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
  ],

  // Mundo 2
  2: [
    q("¿Cuál es la gramínea o pasto más abundante de la flora autóctona que cubre la meseta?", [["🌾","El coirón"],["🌿","El trébol blanco"],["🌾","La caña de azúcar"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿Qué arbusto espinoso autóctono da flores amarillas y frutos morados para hacer dulces tradicionales?", [["🫐","El calafate"],["🌹","El rosal silvestre europeo"],["🍇","La parra de uvas de mesa"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿De qué color son las flores del michay, arbusto autóctono pariente del calafate?", [["🌼","Amarillo anaranjado"],["🌸","Rosa brillante intenso"],["🔵","Azul cobalto profundo"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué árbol caducifolio forma la mayor parte de los bosques nativos en la cordillera santacruceña?", [["🍂","La lenga"],["🌲","El eucalipto australiano"],["🌴","La palmera canaria"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué árbol autóctono pariente de la lenga crece en suelos húmedos y posee hojas de aroma particular?", [["🌲","El ñire"],["🪵","El quebracho colorado"],["🌵","El ceibo del litoral"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿Qué arbusto ramoso y resinoso de la meseta se conoce por su gran poder calórico como leña?", [["🪵","La mata negra"],["🌾","El pasto tierno"],["🌻","El ceibo de ribera"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué árbol autóctono de los bosques andinos produce flores rojas vistosas polinizadas por el picaflor?", [["🌺","El notro (o ciruelillo)"],["🌸","El jacarandá de copas lilas"],["🌼","El lapacho rosado misionero"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué planta achaparrada en forma de cojín espinoso verde resiste el viento y las heladas de la estepa?", [["🌿","El neneo"],["🌴","El trébol de pradera húmeda"],["🌾","El trigo sarraceno"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué árbol siempreverde de hojas coriáceas crece en los sectores más húmedos del bosque andino?", [["🌲","El coihue (o guindo)"],["🍂","El sauce llorón de ríos"],["🪵","El álamo plateado de huerta"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Cómo son las hojas de muchas plantas de la flora esteparia para evitar la pérdida de agua?", [["🌱","Pequeñas, duras, cubiertas de cera y a menudo espinosas"],["🍃","Muy grandes, delgadas y carnosas como hojas de lechuga de quinta"],["💧","Hojas delgadas y transparentes que despiden vapor continuamente"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Por qué los árboles de arrayán no forman parte de la flora autóctona de los bosques de Santa Cruz?", [["🌲","Porque crecen de forma nativa más al norte, en Neuquén y Río Negro"],["🍂","Porque requieren suelos pantanosos y climas subtropicales sin heladas"],["🪵","Porque fueron talados todos por completo en tiempos coloniales"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué hongo autóctono de color naranja parasita ramas de lengas y ñires y era consumido por pueblos originarios?", [["🍄","El hongo llao-llao (o pan de indio)"],["🍄","El champiñón blanco de cultivo comercial"],["🍄","La trufa aromática subterránea europea"]], 0, "Pista: recordá la clasificación biológica de los grupos biológicos."),
    q("¿Por qué las raíces de los arbustos de la meseta santacruceña suelen ser muy extensas y profundas?", [["💧","Para buscar agua en capas subterráneas profundas y anclarse frente a vientos fuertes"],["🌱","Para evitar que los insectos trepen a los tallos"],["🪨","Para almacenar agua de deshielo superficial que corre rápidamente hacia los cursos fluviales"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué hermosa hierba nativa del bosque patagónico posee flores amarillas en forma de bolsita o zapatito?", [["🌼","La calceolaria (o zapatito de la Virgen)"],["🌺","La rosa mosqueta silvestre invasora de valles"],["💐","El clavel cultivado de jardín en canteros urbanos"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué rol ecológico primordial cumplen los bosques nativos de lenga en las cuencas de los ríos?", [["🌳","Retienen la nieve invernal, regulan el deshielo gradual y evitan la erosión del suelo"],["💨","Generan vientos huracanados hacia las localidades costeras del litoral atlántico"],["☀️","Calientan la temperatura del aire en la alta montaña durante todos los meses invernales"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
  ],

  // Mundo 3
  3: [
    q("¿Cuál es el felino autóctono carnívoro más grande que habita en Santa Cruz?", [["🐾","El puma patagónico"],["🐆","El zorro gris pampeano"],["🐈","El gato doméstico común"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué sonido característico emite el puma al comunicarse con sus cachorros o congéneres?", [["🐾","Ronroneos, silbidos y bufidos pero no ruge como los leones"],["🦁","Potentes rugidos que se escuchan a kilómetros de distancia"],["🐦","Trinos agudos idénticos a los de un gorrión"]], 0, "Pista: pensá en las vibraciones que viajan por el aire y otros medios."),
    q("¿Qué gran ave corredora nativa recorre en grupos la estepa patagónica?", [["🪶","El choique (o ñandú petiso)"],["🦤","El avestruz africano de gran porte"],["🦚","El pavo real doméstico de granja"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué ciervo autóctono amenazado habita en bosques y laderas andinas de la Patagonia?", [["🦌","El huemul"],["🦌","El ciervo rojo exótico"],["🦌","La corzuela parda del Chaco"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Por qué el huemul no es una especie exclusiva de Santa Cruz?", [["🦌","Porque habita en los Andes de Santa Cruz, Chubut y también en Chile"],["🏝️","Porque también habita en los bosques andinos templados del sur de Chile"],["🏜️","Porque también habita en los bosques andinos del sur chileno"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué roedor endémico grande de patas largas vive en parejas en la meseta patagónica?", [["🦫","La mara patagónica"],["🐇","El conejo silvestre europeo"],["🦔","El carpincho de los esteros"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué cánido autóctono de pelaje rojizo y cola espesa recorre la estepa cazando roedores?", [["🦊","El zorro colorado (o culpeo)"],["🐺","El lobo ártico polar de pelaje blanco"],["🐕","El perro doméstico de raza dálmata"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué ave rapaz voladora de enorme envergadura planea sobre las cumbres de los Andes?", [["🦅","El cóndor andino"],["🦜","El loro barranquero"],["🦉","La paloma torcaza"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Qué pequeño mamífero acorazado con placas óseas móviles excava madrigueras en la estepa?", [["🦔","El piche patagónico"],["🦫","El castor canadiense invasor"],["🦦","La nutria de río de aguas cálidas"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué ave exclusiva y críticamente amenazada nidifica en lagunas volcánicas de altura en Santa Cruz?", [["🦆","El macá tobiano"],["🦢","El cisne de cuello negro"],["🦩","El flamenco austral"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Qué cetáceo pequeño blanco y negro suele avistarse en rías y costas patagónicas?", [["🐬","La tonina overa"],["🐋","El cachalote gigante de aguas profundas"],["🦈","La orca marina del Atlántico"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Por qué las patas del guanaco no cortan las raíces de las plantas como las pezuñas de las ovejas?", [["🦙","Porque poseen almohadillas plantares blandas que amortiguan la pisada"],["🪨","Porque sus pezuñas afiladas se apoyan únicamente sobre piedras firmes"],["🐾","Porque tienen almohadillas blandas que amortiguan las pisadas"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿Qué mamífero marino de gran tamaño forma grandes colonias en las costas rocosas de Santa Cruz?", [["🦭","El lobo marino de un pelo"],["🐻","El oso marino del Ártico en témpanos flotantes"],["🐊","El cocodrilo marino"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿De qué se alimenta principalmente el choique en la estepa patagónica?", [["🪶","Hierbas, semillas, brotes, frutos de calafate e insectos"],["🥩","Carne fresca de mamíferos medianos cazados en las mesetas"],["🐟","Peces de mar profundo que pesca buceando"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Por qué está estrictamente prohibida la caza furtiva de la fauna nativa en Santa Cruz?", [["🛡️","Para proteger a las especies de la extinción y preservar el equilibrio ecológico"],["💰","Para obligar a todas las especies animales a trasladarse hacia otras provincias vecinas"],["🚗","Para que los animales aprendan a cruzar rutas por las sendas peatonales"]], 0, "Pista: pensá en los animales característicos de este ambiente."),
  ],

  // Mundo 4
  4: [
    q("¿Qué forma adoptan muchos árboles del bosque cordillerano expuestos a vientos fuertes y constantes?", [["🌲","Árboles bandera con ramas desarrolladas hacia un solo lado"],["🌳","Copas perfectamente esféricas y simétricas en todas las direcciones del espacio"],["🌿","Tallos enrollados en espiral continua que giran sobre el suelo como tirabuzones"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Cómo se protegen del agua helada los mamíferos marinos como lobos y elefantes marinos?", [["🦭","Con una gruesa capa de grasa debajo de la piel que aísla del frío"],["🪶","Con un plumaje denso e impermeable similar al de gaviotas marinas"],["☀️","Nadando continuamente sin detenerse nunca para generar calor corporal"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Qué adaptación especial tienen las plumas de los pingüinos para nadar en aguas polares frías?", [["🐧","Son cortas, rígidas, muy tupidas y están cubiertas por una sustancia oleosa impermeable"],["🦜","Son plumas muy largas, suaves y sueltas que absorben grandes cantidades de agua helada"],["🪶","Poseen orificios huecos abiertos para que circule continuamente aire helado entre todas ellas"]], 0, "Pista: pensá en cómo sobreviven los seres vivos al rigor del clima."),
    q("¿Por qué el pelaje del guanaco resulta tan abrigado y aislante frente a las nevadas?", [["🦙","Porque los pelos poseen una estructura interna hueca que atrapa una capa de aire caliente"],["🪞","Porque tienen glándulas que producen calor químico constante"],["🏭","Porque segregan aceites sintéticos pesados que impiden la llegada del frío a la epidermis"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Cómo ayudan las espinas y hojas pequeñas a los arbustos de la meseta patagónica?", [["🌱","Disminuyen la superficie expuesta evitando que la planta pierda agua por evaporación"],["🌧️","Capturan litros de lluvia torrencial almacenándolos en grandes bolsas bajo tierra"],["☀️","Generan calor propio derritiendo rápidamente la escarcha que cae en el suelo de invierno"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué comportamiento protector adoptan los guanacos en manada frente a un temporal de nieve?", [["🦙","Se refugian juntos en cañadones o laderas reparadas del viento"],["🏃","Corren a máxima velocidad buscando llanuras abiertas sin reparo"],["🌳","Trepan a las copas de los árboles más altos del bosque"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo logra sobrevivir el piche durante los meses más crudos del invierno en la estepa?", [["🦔","Permanece dentro de su madriguera profunda donde la temperatura es más estable"],["🕊️","Emprende largos vuelos migratorios en bandada hacia los bosques templados del norte"],["❄️","Se congela en el fondo de arroyos y lagunas despertando al llegar la primavera templada"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Por qué las hojas de la lenga cambian de color y caen antes de que comience el invierno?", [["🍂","Para evitar congelarse y no perder agua en la época más fría"],["🌑","Porque pierden savia debido a la falta de agua subterránea"],["🪵","Porque las aves del bosque las arrancan para construir nidos antes del frío"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo ayuda el color del plumaje del choique a su supervivencia frente a depredadores?", [["🪶","Su plumaje grisáceo se camufla con las piedras y los pastos secos del entorno"],["🌟","Presenta destellos luminosos que encandilan a los zorros durante las cacerías nocturnas"],["🔴","Cambia velozmente a un color rojo intenso para avisar a la manada sobre el peligro cercano"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué función cumple la forma compacta y en cojín de plantas como el neneo en la meseta?", [["🌿","Frena el viento fuerte y retiene una bolsa de aire tibio y húmedo en su interior"],["🌴","Eleva sus flores a varios metros de altura para que sean vistas por aves polinizadoras"],["🎈","Facilita que las ramas se desprendan del suelo y rueden empujadas por el viento patagónico"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿Por qué las semillas de muchas plantas de la estepa tienen ganchos o pelitos plumosos?", [["🌾","Para ser dispersadas fácilmente por el viento o enganchadas en el pelo de animales"],["🪨","Para clavarse firmemente en la roca maciza formando agujeros profundos para germinar"],["💧","Para flotar en el aire y alejarse hacia otras regiones"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Cómo aprovecha el cóndor andino las corrientes de aire para volar sin agotar sus energías?", [["🦅","Planea aprovechando las corrientes de aire térmico ascendente sin necesidad de aletear continuo"],["🪽","Mueve sus alas a gran velocidad mediante aleteos cortos continuos sin planear en ningún momento"],["💨","Se deja caer en picada sostenida planeando únicamente a ras del suelo"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué adaptación le permite al pingüino camuflarse en el agua tanto de presas como de cazadores?", [["🐧","Lomo oscuro que se confunde con el fondo marino y vientre blanco que se mezcla con la luz superior"],["🌈","Glándulas sebáceas que impermeabilizan las plumas frente al agua"],["🟢","Manchas verdes brillantes que imitan a las algas de las restingas costeras en bajamar"]], 0, "Pista: pensá en cómo sobreviven los seres vivos al rigor del clima."),
    q("¿Por qué muchas aves marinas como los cormoranes poseen patas con membranas interdigitales (patas palmeadas)?", [["🦆","Para impulsarse con rapidez y fuerza al nadar y bucear en pos de peces"],["🪵","Para trepar por rocas escarpadas y grietas de montaña"],["🪨","Para caminar largas distancias por la arena seca sin hundir las garras en la orilla marina"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Qué estrategia utilizan algunos peces australes para que su sangre no se congele en aguas heladas?", [["🐟","Poseen sustancias anticongelantes naturales en sus fluidos corporales"],["🏊","Nadan a máxima velocidad hacia las profundidades donde no llega el frío"],["☀️","Buscan aguas poco profundas cerca de la orilla de las playas"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
  ],

  // Mundo 5
  5: [
    q("¿Cuáles son los cuatro grandes reinos en los que clasificamos a los seres vivos en la escuela?", [["🔬","El reino animal, el vegetal (plantas), el de los hongos y el de los microorganismos"],["🧱","El reino de los minerales sólidos, de las rocas duras, del agua líquida y del aire gaseoso"],["🚗","El reino de los metales férricos, de los plásticos sintéticos, de los vidrios y maderas"]], 0, "Pista: recordá la clasificación biológica de los grupos biológicos."),
    q("¿Qué característica principal diferencia a los seres del reino vegetal (plantas) de los animales?", [["🌱","Fabrican su propio alimento mediante fotosíntesis utilizando luz solar"],["🏃","Se desplazan caminando activamente por el terreno en busca de presas vivas"],["🥩","Ingieren otros organismos masticando y digiriendo materia orgánica en el estómago"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿Por qué los seres del reino animal son heterótrofos?", [["🐾","Porque necesitan alimentarse de otros seres vivos para obtener nutrientes y energía"],["☀️","Porque elaboran su alimento absorbiendo minerales directamente por la piel"],["💧","Porque sobreviven durante años bebiendo agua mineral pura sin requerir alimentos sólidos"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Por qué los hongos forman un reino propio separado del reino de las plantas?", [["🍄","Porque no tienen clorofila ni hacen fotosíntesis, alimentándose por absorción"],["🌱","Porque son idénticos a las plantas con flores pero crecen siempre a la sombra de los árboles"],["🏃","Porque se desplazan por el suelo del bosque cazando pequeños insectos entre las hojas"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿Qué seres vivos forman parte del reino de los microorganismos?", [["🔬","Seres microscópicos como bacterias y protozoos formados por una sola célula"],["🦭","Animales marinos de gran porte corporal como las ballenas francas y los elefantes marinos"],["🌲","Árboles longevos y frondosos de gran altura como el coihue de los bosques andinos"]], 0, "Pista: recordá la clasificación biológica de los grupos biológicos."),
    q("¿Qué instrumento óptico de aumento se necesita para observar a la mayoría de los microorganismos?", [["🔬","El microscopio óptico"],["🔭","El telescopio astronómico"],["👓","Una lupa de mano de bajo aumento"]], 0, "Pista: recordá cómo se propaga la iluminación en línea recta."),
    q("¿A qué reino pertenece el hongo llao-llao que crece sobre los troncos de lenga?", [["🍄","Al reino de los hongos (Fungi)"],["🌱","Al reino de las plantas (Plantae)"],["🐾","Al reino de los animales (Animalia)"]], 0, "Pista: recordá la clasificación biológica de los grupos biológicos."),
    q("¿Qué función beneficiosa cumplen muchas bacterias del reino de los microorganismos en la naturaleza?", [["🌱","Descomponen restos orgánicos en el suelo y ayudan en la digestión de los animales"],["🔥","Producen oxígeno atmosférico mediante fotosíntesis directa en todos sus tejidos celulares verdes"],["🪨","Transforman los minerales del suelo en sales cristalizadas"]], 0, "Pista: recordá la clasificación biológica de los grupos biológicos."),
    q("¿Qué pigmento verde poseen las plantas en sus hojas para capturar la energía lumínica del Sol?", [["🍃","La clorofila"],["🩸","La hemoglobina roja"],["🧴","La tintura sintética comercial"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿Cómo se reproducen comúnmente muchos hongos en los bosques húmedos?", [["🍄","A través de esporas microscópicas que se dispersan por el aire"],["🥚","A través de diminutas esporas microscópicas que flotan y se dispersan por el aire"],["🌱","Mediante semillas protegidas dentro de frutos carnosos"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿A qué reino pertenecen los gusanos, insectos, aves y mamíferos?", [["🐾","Al reino animal"],["🍄","Al reino de los microorganismos unicelulares que no forman tejidos"],["🔬","Al reino de los microorganismos unicelulares"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Qué microorganismo unicelular del reino de los hongos se utiliza para fermentar el pan casero?", [["🍞","La levadura"],["🌾","El grano de trigo entero"],["🧂","La sal gruesa de mesa"]], 0, "Pista: recordá la clasificación biológica de los grupos biológicos."),
    q("¿Por qué decimos que los cuatro reinos interactúan estrechamente en un bosque santacruceño?", [["🌲","Las plantas producen alimento, los animales las consumen y hongos y bacterias descomponen sus restos"],["🧱","Porque habitan sectores aislados por murallas de piedra sin intercambiar sustancias entre sí"],["🚫","Hongos y bacterias producen nutrientes químicos, las plantas cazan animales y el agua genera calor"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué seres vivos del reino de las plantas habitan tanto en la estepa como en el bosque?", [["🌾","Pastos como el coirón, arbustos como el calafate y árboles como la lenga"],["🐟","Peces marinos como la merluza austral, el róbalo costero y el salmón del Atlántico"],["🪸","Corales marinos fijos al fondo oceánico"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué característica celular comparten todos los seres vivos de los cuatro reinos?", [["🔬","Todos los seres vivos están formados por una o más células"],["🪨","Todos los seres vivos del planeta están formados por una única célula grande"],["⚙️","Todos funcionan con pilas o baterías eléctricas"]], 0, "Pista: recordá la clasificación biológica de los grupos biológicos."),
  ],

  // Mundo 6
  6: [
    q("¿Qué seres vivos ocupan el primer eslabón productor en las redes tróficas terrestres?", [["🌾","Las plantas fotosintéticas como el coirón y los arbustos"],["🐑","Los animales herbívoros que consumen plantas en los distintos cañadones"],["🐆","Los carnívoros depredadores como el puma y el zorro"]], 0, "Pista: recordá la clasificación biológica de los grupos biológicos."),
    q("¿A qué nivel de consumidores pertenece el guanaco que se alimenta de pastos y brotes?", [["🦙","Consumidor primario (herbívoro)"],["🦁","Consumidor terciario o depredador tope"],["🍄","Descomponedor de restos del suelo"]], 0, "Pista: pensá en cómo circula la energía y el alimento entre las especies."),
    q("¿Qué rol trófico cumple el puma patagónico en los ecosistemas de la provincia?", [["🐆","Consumidor secundario y terciario (depredador tope)"],["🌱","Consumidor primario que se alimenta únicamente de vegetales y semillas"],["🐑","Consumidor primario que se nutre sólo de raíces"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Quiénes actúan como descomponedores reciclando la materia orgánica en el suelo del bosque?", [["🍄","Los hongos y las bacterias del suelo"],["🦅","Los cóndores y águilas moras en vuelo"],["🦌","Los huemules y ciervos en el pastizal"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Cuál es la base de productores en las redes tróficas marinas del Mar Argentino?", [["🔬","El fitoplancton microscópico que realiza fotosíntesis"],["🐟","Las grandes ballenas francas que nadan en las aguas del litoral marino"],["🐋","Las ballenas francas y los lobos marinos"]], 0, "Pista: pensá en cómo circula la energía y el alimento entre las especies."),
    q("¿De qué se alimenta el pingüino de Magallanes como consumidor en el océano?", [["🐟","Peces pequeños como anchoítas, sardinas y calamares"],["🌿","Hojas secas caídas de árboles del bosque andino cordillerano"],["🦭","Crías grandes de lobos y elefantes marinos"]], 0, "Pista: pensá en cómo circula la energía y el alimento entre las especies."),
    q("¿Qué tipo de consumidor es el choique respecto a su variada alimentación?", [["🪶","Consumidor omnívoro (consume brotes vegetales, semillas e insectos)"],["🥩","Carnívoro estricto que caza exclusivamente mamíferos grandes y veloces"],["🐟","Piscívoro estricto que pesca en ríos torrentosos"]], 0, "Pista: pensá en cómo circula la energía y el alimento entre las especies."),
    q("¿Por qué el cóndor andino cumple una función esencial como ave carroñera en la red trófica?", [["🦅","Consume restos de animales muertos limpiando el ambiente y evitando focos infecciosos"],["🪶","Ataca y caza presas vivas de gran porte en pleno vuelo con sus poderosas garras curvas"],["🌾","Se alimenta exclusivamente de espigas de trigo y semillas"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Qué consecuencia ocurriría en una red trófica si desaparecieran por completo los descomponedores?", [["⚠️","Se acumularían restos orgánicos sin degradar y el suelo perdería nutrientes para las plantas"],["🌱","Las plantas crecerían con mayor rapidez al no tener competencia con hongos ni bacterias del suelo"],["❄️","La temperatura del planeta descendería a niveles glaciares"]], 0, "Pista: pensá en cómo circula la energía y el alimento entre las especies."),
    q("¿Qué diferencia existe entre una cadena trófica simple y una red trófica completa?", [["🕸️","La red trófica conecta múltiples cadenas alimentarias entrelazadas"],["📏","La cadena trófica incluye a todos los animales del mundo en fila"],["🪜","Una red trófica solo existe dentro de los laboratorios científicos"]], 0, "Pista: pensá en cómo circula la energía y el alimento entre las especies."),
    q("¿Qué pequeños animales son presas habituales del zorro colorado en la meseta?", [["🐭","Roedores silvestres, lagartijas, huevos y pajaritos"],["🐄","Animales de granja de gran tamaño como vacas, toros y caballos"],["🐟","Grandes tiburones de aguas marinas profundas"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Cómo se alimenta la ballena franca austral en las aguas del Atlántico Sur?", [["🐋","Filtra el agua marina con sus barbas atrapando krill y diminutos crustáceos"],["🦈","Caza mamíferos marinos desgarrándolos con mandíbulas armadas de dientes afilados"],["🌱","Pastorea algas adheridas a las rocas de las playas"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo fluye la energía a lo largo de los eslabones de una red trófica?", [["☀️","Ingresa como energía solar captada por productores y pasa a los distintos consumidores"],["🔄","Fluye desde los consumidores carnívoros hacia los productores vegetales"],["🌙","Circula únicamente entre los animales sin pasar por las plantas"]], 0, "Pista: recordá el rol de cada especie en la alimentación natural."),
    q("¿Por qué el pato vapor volador es un consumidor secundario en las costas marinas patagónicas?", [["🦆","Porque se alimenta de moluscos con concha y crustáceos que habitan en la costa"],["🌾","Porque se alimenta de semillas y pasto tierno en las mesetas altas"],["🐆","Porque caza pumas y zorros en la estepa"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué sucede en una red trófica si una especie invasora compite por el mismo alimento de una nativa?", [["⚠️","Puede reducir la población de la especie nativa y desequilibrar la red trófica"],["🌿","Puede reducir la población de la especie nativa y alterar todo el ecosistema regional"],["💧","Incrementa la cantidad de agua dulce disponible en las cuencas de los ríos"]], 0, "Pista: pensá en cómo circula la energía y el alimento entre las especies."),
  ],

  // Mundo 7
  7: [
    q("¿Qué grave problema ambiental genera en la estepa el pastoreo continuo de demasiadas ovejas en un mismo cuadro?", [["🐑","El sobrepastoreo que elimina pastos nativos y acelera la desertificación"],["🌳","La invasión de malezas anuales en campos de cultivo"],["🌊","Inundaciones periódicas causadas por el desborde continuo de arroyos y ríos"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué mamífero exótico carnívoro introducido para peletería depreda gravemente al amenazado macá tobiano?", [["🦦","El visón americano invasor"],["🐴","El caballo criollo de estancia"],["🐑","La oveja patagónica"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Qué daño provocan los incendios forestales causados por fogones mal apagados en el bosque andino?", [["🔥","Destruyen árboles centenarios de lenga que tardan décadas en recuperarse y queman el suelo"],["🌱","Impiden que las cenizas lleguen a las ciudades mediante lluvias continuas que limpian el aire"],["🌧️","Impiden que el fuego avance quemando hojas verdes"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué animal exótico invasor corta árboles andinos e inunda valles construyendo diques en Tierra del Fuego?", [["🦫","El castor canadiense"],["🦙","El guanaco autóctono"],["🦊","El zorro gris pampeano"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿Qué función primordial cumplen los Parques Nacionales como Los Glaciares o Monte León en Santa Cruz?", [["🏞️","Preservar muestras representativas de ecosistemas autóctonos y proteger especies amenazadas"],["🏭","Instalar grandes fábricas de plásticos y depósitos químicos"],["🚗","Habilitar senderos de trekking señalizados con pasarelas de madera seguras para los turistas"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué especie vegetal exótica de origen europeo invade valles y compite con los arbustos nativos?", [["🌹","La rosa mosqueta espinosa"],["🌾","El coirón amarillo fueguino"],["🪵","La mata negra autóctona"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿Por qué los residuos plásticos arrojados al campo representan una amenaza mortal para la fauna silvestre?", [["🚯","Porque los animales los confunden con alimento o se enredan provocándose heridas graves"],["🌱","Porque los animales los confunden con presas vivas o se enredan causándose heridas graves"],["💧","Porque filtran los sedimentos purificando las vertientes de agua dulce de la meseta"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Qué práctica ganadera sustentable permite recuperar la cobertura vegetal de los cuadros de campo?", [["🔄","El pastoreo rotativo que da descanso a los cuadros para que el pasto semille"],["🐑","Pastoreo continuo triplicando la cantidad de animales en el mismo cuadro sin descanso"],["🔥","Cortar leña en los bosques protegidos sin autorización"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿Cómo se llama el profesional encargado de cuidar los recursos naturales y orientar a los visitantes en un área protegida?", [["🌲","El guardaparque nacional o provincial"],["👨‍⚖️","El intendente municipal de la ciudad vecina"],["👷","El maquinista de grúas portuarias"]], 0, "Pista: pensá en las interacciones de atracción o repulsión entre cargas."),
    q("¿Qué consecuencia ocasiona la introducción de truchas exóticas en ríos y lagos de la Patagonia?", [["🐟","Depredan sobre peces autóctonos pequeños y anfibios alterando las redes acuáticas"],["🌱","Estimulan el enraizamiento y desarrollo de bosques de lenga a lo largo de las riberas"],["🌊","Modifican la salinidad fluvial transformando el agua dulce en agua salada de mar"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué es crucial no encender fuego en zonas no habilitadas ni arrojar colillas en los senderos?", [["🔥","Porque el viento constante y la vegetación seca pueden desatar incendios incontrolables"],["💨","Porque la densidad del humo detiene las corrientes de viento patagónicas al instante"],["❄️","Porque las cenizas atraen frentes polares de nieve intensa hacia el interior del bosque"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué acción escolar y ciudadana reduce la cantidad de residuos que llegan a basurales?", [["♻️","Separar los residuos para reutilizar y reciclar plástico, cartón y vidrio"],["🗑️","Arrojar bolsas plásticas y residuos secos en zanjas abiertas sin clasificación"],["🔥","Tirar botellas plásticas a cielo abierto en los cañadones"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué Parque Nacional santacruceño sobre el litoral atlántico protege importantes colonias de pingüinos de Magallanes?", [["🐧","El Parque Nacional Monte León"],["🌲","El Parque Nacional Los Glaciares"],["🏜️","El Parque Nacional Talampaya"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué decimos que los ecosistemas de Santa Cruz son particularmente frágiles ante el daño humano?", [["⏳","Porque debido al frío y la aridez el crecimiento vegetal y la recuperación son muy lentos"],["🌴","Porque las abundantes lluvias invernales lavan los suelos y renuevan las pasturas cada año"],["🌧️","Porque las lluvias constantes lavan y borran cualquier alteración o rastro de daño"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué compromiso ambiental debemos asumir los visitantes al recorrer un área natural protegida?", [["👣","No dejar basura, mantenerse en senderos y no molestar a la fauna silvestre"],["🪨","Recolectar fósiles, cortar ramas de plantas nativas y capturar animales silvestres"],["📢","Poner música a alto volumen para espantar a las aves"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
  ],

  // Mundo 8
  8: [
    q("¿Cuáles son las dos funciones primordiales que cumple el esqueleto en el cuerpo humano?", [["🦴","Sostener la estructura del cuerpo y proteger órganos vitales internos"],["💨","Producir corrientes internas de aire para regular la temperatura cutánea"],["🩸","Bombear de forma continua la sangre oxigenada hacia todos los músculos"]], 0, "Pista: pensá en lo estudiado sobre este tema para responder con precisión."),
    q("¿Qué conjunto de huesos rígidos protege al cerebro de golpes y traumatismos?", [["🧠","Los huesos del cráneo"],["🦴","Las costillas de la caja torácica"],["🦵","Los huesos de la pelvis"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué estructura ósea protege al corazón y a los pulmones dentro del tórax?", [["🫁","La caja torácica formada por las costillas y el esternón"],["🦴","La pelvis ósea formada por los huesos ilíacos y el sacro en la base del tronco"],["🦵","Los huesos largos del muslo y la pierna como el fémur"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué tipo de huesos son las vértebras que componen la columna vertebral humana?", [["🦴","Huesos irregulares con formas complejas adaptadas a su función"],["🦴","Huesos planos y anchos que forman una coraza protectora como el cráneo"],["🦴","Huesos planos y muy anchos que forman una coraza como el cráneo"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Cuál es el hueso más largo y resistente del cuerpo humano, ubicado en el muslo?", [["🦵","El fémur"],["🦴","El radio"],["🦴","La clavícula"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué órgano esencial del sistema nervioso se aloja y protege dentro del conducto de la columna vertebral?", [["🧠","La médula espinal"],["🫀","Los nervios periféricos de las extremidades superiores e inferiores"],["🫁","El estómago"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo se clasifican los huesos según su forma geométrica predominante?", [["📐","Huesos largos, huesos cortos, huesos planos y huesos irregulares"],["🔴","Huesos duros, huesos blandos, huesos redondos y huesos alargados del esqueleto"],["🪵","Huesos externos, huesos internos, medios y superficiales"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué ejemplo de hueso plano protege la parte superior y posterior de la espalda articulando con el brazo?", [["🦴","El omóplato (o escápula)"],["🦵","El hueso frontal del cráneo"],["🦴","El fémur"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué huesos cortos encontramos agrupados en la muñeca para permitir movimientos variados?", [["✋","Los huesos del carpo"],["🦵","Las vértebras lumbares"],["🦴","Los omóplatos"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué mineral abundante le otorga dureza y resistencia sólida a los huesos?", [["🥛","El calcio"],["🧂","El cloro gaseoso"],["🪙","El cobre metálico"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué tejido esponjoso ubicado en el interior de los huesos largos se encarga de fabricar células sanguíneas?", [["🩸","La médula ósea roja"],["🧠","La médula espinal del sistema nervioso central"],["🧴","El cartílago articular que recubre las articulaciones"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Aproximadamente cuántos huesos componen el esqueleto de una persona adulta?", [["🦴","Aproximadamente 206 huesos"],["🦴","Exactamente 100 huesos principales distribuidos en el cuerpo"],["🦴","Más de 5.000 huesos"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué tejido flexible y suave recubre los extremos de los huesos para que no rocen entre sí en las articulaciones?", [["🦴","El cartílago articular"],["🪵","Una capa elástica de tejido conectivo sin sales minerales de calcio"],["🔩","Un tejido mineral rígido de fosfato cálcico"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Qué huesos planos forman la cintura pélvica que sostiene los órganos del abdomen y las piernas?", [["🦴","Los huesos coxales (o pelvis)"],["🦴","Las costillas flotantes de la caja torácica"],["🦴","Las vértebras cervicales articuladas del cuello"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Por qué los huesos de los niños crecen en longitud durante la infancia y adolescencia?", [["🌱","Porque poseen zonas de cartílago de crecimiento que producen nuevo tejido óseo"],["🎈","Porque el esqueleto solo sirve para dar forma externa al cuerpo humano"],["💧","Porque absorben minerales líquidos del torrente sanguíneo aumentando de tamaño"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
  ],

  // Mundo 9
  9: [
    q("¿Cómo se llama el punto de unión entre dos o más huesos que permite la movilidad corporal?", [["🦴","La articulación"],["🩸","El vaso capilar sanguíneo"],["🧠","La neurona cerebral"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Cuáles son los tres tipos de articulaciones según el grado de movimiento que permiten?", [["🔄","Articulaciones móviles, semimóviles y fijas (inmóviles)"],["🔴","Articulaciones fijas, articulaciones voluntarias y articulaciones automáticas"],["⚡","Articulaciones voluntarias, reflejas y automáticas del cuerpo"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué tipo de articulación une los huesos del cráneo adulto donde no existe movimiento?", [["🔒","Articulaciones fijas (o suturas inmóviles)"],["⚽","Articulaciones cartilaginosas con movimiento parcial y reducido"],["🔄","Articulaciones giratorias esféricas"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué articulación móvil del cuerpo humano tiene gran amplitud de movimiento en todas direcciones?", [["💪","El hombro (articulación escápulo-humeral)"],["🦴","El codo entre el brazo y el antebrazo con movimiento de bisagra"],["🦷","La unión entre los dientes y la encía"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué cordones fibrosos y resistentes unen a los músculos esqueléticos con los huesos?", [["💪","Los tendones"],["🩸","Las arterias coronarias"],["🧠","Los nervios sensitivos"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué estructuras elásticas y resistentes unen hueso con hueso estabilizando la articulación?", [["🩹","Los ligamentos"],["🩸","Las venas sanguíneas"],["🧬","Los glóbulos blancos"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué propiedad fundamental tienen los músculos para generar el movimiento de las extremidades?", [["💪","La capacidad de contraerse (acortarse) y relajarse (estirarse)"],["❄️","La propiedad de endurecerse como piedra ante los cambios de clima"],["🪞","La capacidad de conducir impulsos luminosos hacia la superficie"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Cómo actúan los músculos antagónicos como el bíceps y el tríceps para mover el brazo?", [["💪","Cuando uno se contrae, el otro se relaja de manera coordinada"],["🤝","Se mantienen relajados sin intervenir en el movimiento del antebrazo"],["😴","Se mantienen en reposo absoluto sin participar en la flexión del antebrazo"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué tipo de músculos son los que movemos de manera consciente y voluntaria para caminar o saltar?", [["🏃","Músculos esqueléticos voluntarios"],["🫀","Músculos lisos involuntarios presentes en las paredes internas"],["🫁","Músculo liso estomacal"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué líquido viscoso lubrica el interior de las articulaciones móviles evitando el desgaste?", [["💧","El líquido sinovial"],["🩸","La savia vegetal"],["🌊","El agua salada marina"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué movimiento realiza el antebrazo cuando el músculo bíceps se contrae con fuerza?", [["💪","Se flexiona acercando la mano hacia el hombro"],["🖐️","Se extiende alejando la mano del hombro en línea completamente recta"],["🔄","Gira de manera continua sin detenerse"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Cómo trabaja de forma integrada el aparato locomotor para patear una pelota de fútbol?", [["⚽","El sistema nervioso da la orden, los músculos se contraen y tiran de los huesos a través de las articulaciones"],["🦴","Los huesos se mueven de forma completamente autónoma sin requerir la intervención de músculos ni tendones"],["💨","Los músculos transmiten impulsos eléctricos a los nervios y los huesos se mueven sin articulaciones"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué tipo de articulación semimóvil permite inclinarnos hacia adelante doblando la espalda?", [["🦴","Las articulaciones entre vértebras con discos intervertebrales"],["🔒","Las suturas fijas e inmóviles entre los huesos planos del cráneo"],["💪","La articulación esférica de la cadera"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué lesión común ocurre cuando un ligamento se estira o desgarra por una torcedura violenta?", [["🩹","Un esguince articular"],["🦴","Una fractura de cráneo"],["🩸","Una hemorragia interna estomacal"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué el músculo cardíaco (miocardio) del corazón es de tipo involuntario?", [["🫀","Porque late continuamente de forma automática sin que tengamos que pensarlo"],["🏃","Porque únicamente se activa cuando realizamos carreras a máxima velocidad"],["😴","Porque reduce su ritmo hasta detenerse por completo durante las horas de sueño"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
  ],

  // Mundo 10
  10: [
    q("¿Cuál es la postura correcta al sentarse en el aula escolar para cuidar la columna vertebral?", [["🪑","Espalda recta apoyada contra el respaldo de la silla y ambos pies apoyados en el suelo"],["🛋️","Inclinarse de forma encorvada hacia adelante apoyando la frente sobre la mesa de trabajo"],["💺","Cruzar ambas piernas sobre el asiento manteniendo la espalda girada hacia un costado"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿De qué manera adecuada se debe cargar la mochila escolar para prevenir dolores de espalda?", [["🎒","Colgada sobre ambos hombros regulando las correas a la altura de la cintura"],["👜","Colgada de una sola correa lateral inclinando todo el cuerpo hacia ese lado"],["💼","Llevada en una sola mano extendida hacia el suelo mientras se camina apresurado"]], 0, "Pista: pensá en las interacciones de atracción o repulsión entre cargas."),
    q("¿Cuánto peso como máximo se recomienda que lleve un alumno en su mochila escolar?", [["⚖️","No más del 10 al 15 por ciento de su propio peso corporal"],["🏋️","Más del 50 por ciento del peso del estudiante para fortalecer la espalda"],["🎒","Cualquier peso sin importar cuánto pese el estudiante"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué mineral es fundamental consumir a través de lácteos y semillas para fortalecer los huesos?", [["🥛","El calcio"],["🍬","El azúcar refinado"],["🧂","El bicarbonato de sodio"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué vitamina producida en la piel por exposición solar moderada ayuda a fijar el calcio en los huesos?", [["☀️","La vitamina D"],["🍋","La vitamina C"],["💊","La vitamina K"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Por qué es importante realizar ejercicios de calentamiento antes de practicar deportes en la escuela?", [["🏃","Para preparar músculos y articulaciones aumentando la flexibilidad y evitando desgarros"],["😴","Para gastar la mayor parte de las energías corporales y evitar la agitación en el juego"],["🧊","Para disminuir la temperatura de los músculos y articulaciones antes de iniciar la carrera"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo se debe levantar un objeto pesado del suelo para no lastimar la zona lumbar de la espalda?", [["📦","Flexionando las rodillas con la espalda recta y levantando la carga cerca del cuerpo"],["🚶","Inclinando la cintura hacia adelante con las piernas completamente rectas y rígidas"],["🔄","Inclinando el tronco hacia adelante sin doblar las rodillas y tirando con la espalda curvada"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué hábito saludable previene el sedentarismo y mantiene fuertes los músculos y huesos?", [["⚽","Realizar actividad física y juegos al aire libre de manera regular"],["📱","Permanecer sentado frente a pantallas electrónicas durante muchas horas seguidas"],["🛋️","Acostarse todo el día sin caminar ni jugar"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué elemento de protección es indispensable utilizar al andar en bicicleta o patineta para evitar fracturas graves de cráneo?", [["🪖","El casco protector ajustado a la cabeza"],["🧢","Un sombrero de tela ligera sin ninguna protección rígida"],["🕶️","Unos anteojos oscuros"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Por qué es crucial mantener una buena hidratación bebiendo agua durante la actividad física?", [["💧","Para reponer los líquidos perdidos por el sudor y evitar calambres musculares"],["🥤","Para acelerar la digestión pesada de alimentos consumidos antes del ejercicio"],["❄️","Para enfriar rápidamente la piel evitando la necesidad de transpirar"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué sucede con los músculos cuando una persona pasa largos períodos sin realizar ningún tipo de movimiento?", [["📉","Pierden fuerza, masa muscular y tono volviéndose más débiles (atrofia)"],["💪","Aumentan su masa muscular al doble de su capacidad natural sin necesidad de ejercicio"],["🦴","Se transforman espontáneamente en huesos sólidos"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué calzado escolar es el más adecuado para cuidar la pisada y las articulaciones de los pies y tobillos?", [["👟","Zapatillas cómodas con suela antideslizante que sujeten bien el pie"],["🩴","Sandalias de goma sueltas sin ningún tipo de soporte en los tobillos"],["👠","Zapatos con tacos altos y puntas estrechas"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué dormir entre 8 y 10 horas diarias favorece el desarrollo del sistema locomotor en la infancia?", [["🌙","Durante el sueño se libera la hormona de crecimiento que repara tejidos y hace crecer los huesos"],["🌑","Porque las células de la médula ósea requieren ausencia completa de luz para multiplicarse"],["🛌","Durante el sueño los músculos se cansan más rápido y los huesos pierden sales minerales esenciales"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué primeros auxilios básicos se deben aplicar ante un golpe o esguince en el tobillo?", [["🧊","Reposo, aplicación de hielo protegido y elevación de la extremidad golpeada"],["🔥","Aplicación inmediata de calor directo muy caliente mediante paños sobre la zona hinchada"],["🏃","Obligar a la persona a correr carreras inmediatamente"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué es conveniente hacer pausas activas y estiramientos al pasar tiempo estudiando o usando computadoras?", [["🧘","Para aliviar la tensión en el cuello y la espalda mejorando la circulación"],["😴","Hacer ejercicios bruscos sin descanso después de comer comidas pesadas"],["🧱","Para evitar que los huesos de las manos pierdan calcio al estar quietos frente a la pantalla"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
  ],

  // Mundo 11
  11: [
    q("¿Qué son los materiales naturales según su procedencia?", [["🌿","Materiales que se obtienen directamente de la naturaleza sin sufrir transformaciones químicas profundas"],["🏭","Sustancias sintéticas elaboradas exclusivamente en plantas petroquímicas sin utilizar materias primas directas"],["🤖","Plásticos sintéticos y fibras industriales"]], 0, "Pista: recordá cómo se comportan los distintos elementos con el calor."),
    q("¿Cuáles son los tres orígenes de los que pueden provenir los materiales naturales?", [["🌍","Origen vegetal, origen animal y origen mineral"],["🚗","Origen terrestre, origen marítimo y origen atmosférico de la naturaleza"],["☀️","Origen terrestre, origen marítimo y origen aéreo"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Qué ejemplo de material natural proviene del reino animal en la Patagonia?", [["🐑","La lana de oveja y el cuero vacuno"],["🪵","El plástico industrial sintético y las aleaciones de aluminio liviano"],["🪨","La arcilla de la barda"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Qué material natural de origen vegetal se extrae de los bosques para carpintería y construcción?", [["🪵","La madera de los troncos de árboles"],["🪙","El mineral de hierro extraído de minas"],["🧴","El plástico sintético"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué material natural de origen mineral se extrae de las canteras para fabricar vasijas y ladrillos?", [["🧱","La arcilla"],["🧶","La lana peinada"],["🌾","El algodón vegetal"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Qué son los materiales manufacturados (o artificiales)?", [["🏭","Materiales transformados por el ser humano mediante procesos industriales a partir de materias primas"],["🌳","Elementos de origen natural recolectados directamente del campo sin ningún tipo de manufactura industrial"],["💧","Agua de lluvia caída directamente del cielo"]], 0, "Pista: recordá cómo se comportan los distintos elementos con el calor."),
    q("¿A partir de qué materia prima natural se fabrica el vidrio común mediante calor intenso?", [["🏖️","A partir de la arena de sílice fundida a altas temperaturas"],["🪵","A partir de virutas de aserrín de madera prensadas con resinas"],["🐑","A partir de vellones de lana de oveja"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿A partir de qué componente vegetal de los árboles se manufactura el papel de cuadernos y libros?", [["🌲","A partir de las fibras de celulosa de la madera"],["🪨","A partir de piedras calizas y rocas basálticas trituradas"],["🦭","A partir de la grasa de mamíferos marinos"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿De qué recurso natural fósil no renovable se derivan y manufacturan la gran mayoría de los plásticos?", [["🛢️","Del petróleo que es un recurso natural fósil"],["🌾","Porque se pueden utilizar una sola vez y luego se destruyen para siempre"],["🌊","Del agua salada del océano"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué el plástico manufacturado es muy utilizado pero representa un grave problema para el ambiente?", [["🚯","Porque es liviano y resistente pero tarda cientos de años en degradarse"],["🔥","Porque se disuelve de forma instantánea al contacto con el agua de lluvia"],["💧","Porque se disuelve inmediatamente con una gota de lluvia"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué metales naturales se extraen de la corteza terrestre para transformarse en cables y herramientas?", [["⛏️","El cobre, el hierro, el aluminio y el plomo"],["🪵","La madera de pino, el carbón vegetal y el papel"],["🧴","El polietileno sintético, el caucho y el nylon"]], 0, "Pista: pensá en elementos conductores extraídos de la minería."),
    q("¿Qué proceso artesanal transforma la arcilla blanda húmeda en platos y fuentes duras impermeables?", [["🏺","El modelado y horneado de la cerámica"],["❄️","El hilado artesanal de vellones de lana"],["💨","El soplado con ventiladores"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué fibra vegetal natural se utiliza para tejer telas suaves y frescas de remeras y sábanas?", [["🌾","El algodón"],["🐑","El cuero de vaca"],["🪨","El mármol de cantera"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿Por qué es importante la regla de las tres erres (Reducir, Reutilizar y Reciclar) con los materiales?", [["♻️","Para ahorrar materias primas naturales, gastar menos energía y disminuir la basura"],["🏭","Para fabricar el doble de envases descartables cada día y asegurar la conservación de las especies autóctonas"],["🚗","Para que los basurales ocupen ciudades enteras"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Qué material manufacturado transparente se utiliza comúnmente en las ventanas para dejar pasar la luz?", [["🪟","El vidrio"],["🪵","La madera maciza"],["🧱","El ladrillo cocido"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
  ],

  // Mundo 12
  12: [
    q("¿Qué son los buenos conductores térmicos en la física de los materiales?", [["🔥","Materiales que transmiten el calor rápidamente a través de su cuerpo"],["❄️","Materiales que frenan por completo la propagación interior del calor"],["🎈","Materiales que flotan en el aire cuando se calientan"]], 0, "Pista: pensá en lo estudiado sobre este tema para responder con precisión."),
    q("¿Qué familia de materiales son los mejores conductores tanto del calor como de la electricidad?", [["🪙","Los metales como el cobre, el aluminio, el hierro y la plata"],["🪵","Las maderas secas de árboles andinos y fibras vegetales de monte"],["🧴","Los plásticos y las telas sintéticas"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Qué son los aislantes térmicos y para qué se utilizan en las viviendas patagónicas?", [["🏠","Materiales que dificultan el paso del calor conservando el ambiente templado"],["🔥","Materiales conductores que dejan escapar la energía térmica al exterior sin freno"],["🧊","Materiales que fabrican cubitos de hielo en las paredes"]], 0, "Pista: pensá en lo estudiado sobre este tema para responder con precisión."),
    q("¿Qué material excelente conductor de la electricidad se usa en el interior de los cables domiciliarios?", [["⚡","El cobre metálico"],["🪵","Metales pesados como el plomo, el hierro y el cobre de alta densidad"],["🧱","El vidrio común"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Por qué los cables eléctricos están recubiertos exteriormente por una capa de plástico flexible?", [["🔌","Porque el plástico es un aislante eléctrico que evita descargas y choques eléctricos"],["🎨","Para que los mangos pesen mucho más y no se resbalen con la transpiración de las manos"],["🔥","Para que se calienten y calienten la habitación"]], 0, "Pista: pensá en las interacciones de atracción o repulsión entre cargas."),
    q("¿De qué material suelen fabricarse los mangos de sartenes y ollas para no quemarse al cocinar?", [["🍳","De madera o plástico baquelita que son aislantes térmicos"],["🪙","De cobre puro o aluminio brillante sin ningún recubrimiento"],["🥈","De láminas de aluminio pulido"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Por qué el telgopor (poliestireno expandido) es un excelente aislante térmico para conservadoras?", [["🧊","Porque contiene millones de diminutas burbujas de aire quieto atrapadas en su interior"],["🪙","El agua líquida pura a temperatura ambiente sin sales disueltas"],["💧","Porque absorbe litros de agua helada"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Qué ventaja térmica brinda el Doble Vidrio Hermético (DVH) instalado en ventanas de zonas frías?", [["🪟","Crea una cámara de aire seco o gas entre dos vidrios que actúa como aislante térmico"],["🌑","Impide que los rayos del sol iluminen el interior de las habitaciones"],["🧱","Transforma las ventanas en paredes de ladrillo sólido"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Qué cuchara se calentará más rápido si la dejamos apoyada dentro de una taza de sopa caliente?", [["🥄","La cuchara de metal de acero inoxidable"],["🪵","La cuchara de madera tallada"],["🧴","La cuchara de plástico descartable"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué la lana de oveja abriga tanto a las personas en el invierno patagónico?", [["🐑","Porque sus fibras rizadas atrapan una capa de aire corporal que actúa como aislante térmico"],["🔥","Porque la lana produce calor químico constante en el tejido"],["☀️","Porque absorbe rayos solares durante la noche cerrada"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué nunca debemos tocar interruptores ni artefactos eléctricos con las manos mojadas?", [["⚠️","Porque el agua con sales es buena conductora eléctrica y aumenta el riesgo de electrocución"],["🧼","El acero inoxidable y el hierro forjado utilizados en la construcción"],["💡","Porque la lámpara se apaga para siempre"]], 0, "Pista: pensá en las interacciones de atracción o repulsión entre cargas."),
    q("¿Qué herramienta utiliza un electricista con mango de goma gruesa para trabajar con seguridad?", [["🔧","Un alicate o destornillador con mango de goma aislante"],["🔨","Un martillo enteramente de hierro sin forro"],["🥄","Una pinza de aluminio pulido"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué material de construcción tradicional de la Patagonia combina chapa de metal exterior con aislación interior?", [["🏠","Chapa de zinc conductora en el exterior y lana de vidrio aislante en el interior"],["🧱","Techos de chapa lisa sin ningún tipo de aislación térmica interior"],["🌴","Techos de chapa sin ninguna aislación térmica interior"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Qué metal de bajo costo y ligero se utiliza habitualmente en radiadores y pavas por conducir muy bien el calor?", [["🫖","El aluminio"],["🪵","El corcho natural"],["🧱","El cemento armado"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Cómo se llama el fenómeno por el cual el calor pasa a través de una barra de metal en contacto con el fuego?", [["🔥","Conducción térmica"],["🌊","Evaporación marina"],["⚡","Fricción electrostática"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
  ],

  // Mundo 13
  13: [
    q("¿Cuáles son los tres estados de la materia más comunes que observamos en la naturaleza cotidiana?", [["🧊","Sólido, líquido y gaseoso"],["🔴","Caliente, tibio y congelado"],["🧱","Duro, blando y áspero"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué características de forma y volumen definen al estado sólido de la materia?", [["🪨","Posee forma propia fija y un volumen definido y constante"],["💧","Tienen volumen fijo e invariable pero su forma cambia según el recipiente"],["💨","Se expande ocupando todo el salón sin forma ni volumen"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué propiedades presenta la materia en estado líquido como el agua de un río?", [["💧","Tiene volumen constante pero su forma se adapta al recipiente que lo contiene"],["🧊","Mantiene siempre forma de cubo rígido en cualquier lugar"],["🎈","Se comprime hasta desaparecer dentro de una jeringa"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Cómo se comporta la materia en estado gaseoso dentro de un recipiente cerrado?", [["💨","No tiene forma fija ni volumen propio y ocupa todo el espacio disponible"],["🪨","Forma un bloque duro y rígido que no se puede mover"],["💧","Mantiene siempre la forma de una esfera perfecta"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Cómo se encuentran organizadas las partículas que componen un cuerpo sólido?", [["🔬","Muy juntas, ordenadas y unidas por fuertes fuerzas de atracción vibrando en su lugar"],["🏊","Las partículas están fuertemente unidas entre sí sin poder desplazarse"],["💨","Volando a cientos de kilómetros por hora en el vacío"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Cómo se mueven las partículas en un líquido comparadas con un sólido?", [["💧","Tienen cierta libertad para desplazarse y deslizarse unas sobre otras fluyendo"],["🔒","Están completamente quietas y congeladas para siempre"],["🚀","Están a metros de distancia volando a la velocidad de la luz"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué ejemplo natural de agua en estado sólido encontramos en el Parque Nacional Los Glaciares?", [["🏔️","El hielo del glaciar Perito Moreno"],["🌊","Las aguas del lago Argentino"],["☁️","El vapor invisible en el aire"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué gas vital para la respiración de los seres vivos forma parte del aire atmosférico?", [["💨","El oxígeno"],["🪨","Los líquidos viscosos que fluyen con lentitud por las superficies"],["🧂","La sal"]], 0, "Pista: recordá la clasificación biológica de los grupos biológicos."),
    q("¿Qué propiedad de los gases permite comprimirlos y reducir su volumen dentro de una garrafa o neumático?", [["🎈","La compresibilidad debido al gran espacio vacío entre sus partículas"],["🧱","La dureza superficial de sus granos"],["💧","La viscosidad de su corriente"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Por qué los sólidos no pueden comprimirse fácilmente al apretarlos con las manos?", [["🪨","Porque sus partículas ya están muy juntas y no hay espacio libre entre ellas"],["💧","Porque las partículas sólidas se rompen al chocar contra las paredes"],["💨","Porque se escapan flotando por el aire"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué líquido natural recorre cañadones y valles cruzando toda la meseta santacruceña?", [["💧","El agua dulce de los ríos como el río Santa Cruz"],["🛢️","Lava volcánica hirviendo en todos"],["🧴","Aceite comestible vegetal"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué instrumento con fuelle o bomba aprovecha la compresión del aire gaseoso para inflar pelotas?", [["⚽","El inflador manual de aire"],["🔨","El martillo carpintero"],["🪚","El serrucho de podar"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué ocurre con la forma de un litro de agua si lo pasamos de una jarra a una cacerola ancha?", [["💧","Cambia de forma adoptando la de la cacerola pero su volumen sigue siendo un litro"],["📏","Aumenta de peso duplicando su volumen por la presión del aire"],["🧊","Se vuelve inmediatamente sólida como una piedra"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué estado de la materia es el humo que sale de la chimenea de un fogón?", [["💨","Una mezcla de gases con diminutas partículas sólidas de hollín en suspensión"],["🪨","Un bloque sólido de hierro fundido"],["💧","Un chorro continuo de agua líquida pura"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Por qué una roca de la cordillera conserva su forma aunque la cambiemos de lugar o de caja?", [["🪨","Porque es un sólido con partículas fuertemente unidas que mantienen su forma"],["🎈","Porque está inflada con gas helio liviano"],["💧","Porque fluye lentamente como la miel"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
  ],

  // Mundo 14
  14: [
    q("¿Cómo se llama el cambio de estado en el que un sólido pasa a líquido al recibir calor?", [["🔥","Fusión (como el hielo que se derrite)"],["❄️","Solidificación"],["💨","Condensación"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Cómo se denomina el cambio de estado cuando el agua líquida se congela convirtiéndose en hielo por el frío?", [["❄️","Solidificación"],["🔥","Fusión del hielo al calentarse pasando a estado líquido transparente"],["💨","Evaporación"]], 0, "Pista: pensá en cómo sobreviven los seres vivos al rigor del clima."),
    q("¿Cómo se llama el paso de un líquido a estado gaseoso que ocurre cuando un charco se seca al sol?", [["💨","Evaporación"],["🧊","Solidificación"],["🌧️","Precipitación"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué cambio de estado ocurre cuando el vapor de agua invisible del aire se enfría y forma gotas en el vidrio?", [["💧","Condensación"],["🔥","Fusión"],["🪨","Solidificación"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿A qué temperatura exacta al nivel del mar se produce la ebullición del agua dulce pura?", [["🌡️","A 100 grados centígrados (100 °C)"],["🌡️","A 0 grados centígrados (0 °C)"],["🌡️","A 500 grados centígrados"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿A qué temperatura comienza a solidificarse o congelarse el agua líquida dulce?", [["❄️","A 0 grados centígrados (0 °C)"],["🌡️","A 50 grados centígrados medidos con un termómetro de laboratorio"],["🔥","A 100 grados centígrados"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Qué fenómeno invernal se produce en la meseta cuando el vapor de agua del aire se enfría y se vuelve hielo directamente sobre los pastos?", [["❄️","La escarcha (el vapor se vuelve hielo directamente)"],["🌧️","El rocío líquido de la mañana"],["🌈","La niebla espesa del valle"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué se empañan los vidrios del auto por dentro en una mañana de mucho frío?", [["💧","Porque el vapor caliente de la respiración choca con el vidrio helado y se condensa"],["💨","Porque el humo caliente de las estufas se pega a los cristales del auto"],["🔥","Porque los vidrios se derriten por la calefacción por la influencia directa del viento y la sequedad"]], 0, "Pista: pensá en cómo sobreviven los seres vivos al rigor del clima."),
    q("¿Qué factor principal provoca que la materia cambie de un estado a otro en la naturaleza?", [["🌡️","La ganancia o pérdida de calor (cambio de temperatura)"],["🎨","El color de la pintura de la pared"],["📢","El volumen de los ruidos ambientales"]], 0, "Pista: recordá las formas que adopta la materia en la naturaleza."),
    q("¿Qué le sucede al helado o al chocolate si los dejamos expuestos al sol en una tarde de verano?", [["🍫","Se funden pasando de estado sólido a estado líquido"],["🧊","Se congelan volviéndose piedras duras"],["💨","Explotan transformándose en vapor de agua puro"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Qué sucede con las partículas de un trozo de hielo cuando recibe calor y comienza a derretirse?", [["🔥","Vibran más rápido, se separan y comienzan a deslizarse unas sobre otras"],["🔒","Se quedan completamente inmóviles sin cambiar su forma ni su volumen"],["🌑","Se quedan completamente inmóviles sin cambiar su forma"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Cómo se llama la formación de nubes en la atmósfera a partir del vapor de agua que asciende y se enfría?", [["☁️","Condensación del vapor en minúsculas gotitas de agua líquida"],["🔥","Fusión de rocas volcánicas"],["🪨","Solidificación de metales pesados"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué la ropa tendida en la soga se seca incluso en días ventosos de invierno?", [["💨","Porque el agua líquida se evapora gradualmente favorecida por el viento seco"],["🔥","Porque el calor se transmite hacia la soga de colgar la ropa húmeda"],["❄️","Porque el agua se convierte en salitre sólido"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué cambio de estado ocurre en el congelador cuando llenamos una cubetera con agua de la canilla?", [["🧊","Solidificación del agua formando cubos de hielo"],["🔥","Fusión acelerada del agua"],["💨","Ebullición a altas temperaturas"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Por qué decimos que los cambios de estado son cambios físicos reversibles de la materia?", [["🔄","Porque la sustancia sigue siendo la misma (agua) y puede volver a su estado inicial cambiando el calor"],["🧪","Porque los cambios físicos alteran de forma permanente la composición química"],["🧱","Porque los cambios de estado transforman la sustancia en otro elemento"]], 0, "Pista: recordá las formas que adopta la materia en la naturaleza."),
  ],

  // Mundo 15
  15: [
    q("¿Qué es una mezcla en las ciencias naturales?", [["🥣","La combinación de dos o más sustancias que mantienen sus propiedades químicas"],["🧱","Una sustancia pura formada por un solo elemento sin combinar con otros"],["⚡","Una corriente de energía eléctrica aislada"]], 0, "Pista: recordá las técnicas usadas para separar las partes."),
    q("¿Qué característica fundamental define a una mezcla heterogénea?", [["👀","Se pueden distinguir dos o más fases o componentes a simple vista o con lupa"],["🔍","No se puede distinguir ningún componente ni con microscopio"],["🔥","Produce un gas invisible que escapa del recipiente"]], 0, "Pista: recordá las técnicas usadas para separar las partes."),
    q("¿Qué ejemplo clásico de mezcla heterogénea preparamos habitualmente en la cocina?", [["🥗","Una ensalada de lechuga, tomate y zanahoria con aceite"],["☕","Un café negro colado sin restos de granos"],["🧂","Un vaso de agua con sal completamente disuelta"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Qué ocurre cuando intentamos mezclar agua y aceite en un vaso de vidrio?", [["🫒","Forman una mezcla heterogénea con dos fases visibles porque no se mezclan"],["☕","Se disuelven por completo formando un líquido homogéneo transparente"],["🧊","Se congelan al instante convirtiéndose en una barra de hielo"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Qué característica distingue a una mezcla homogénea (o solución)?", [["🔍","Tiene un aspecto uniforme y no se pueden distinguir sus componentes en ninguna de sus partes"],["👀","El agua potable de la canilla con minerales disueltos en ella"],["🪨","Contiene piedras pesadas que caen al fondo del vaso"]], 0, "Pista: pensá en lo estudiado sobre este tema para responder con precisión."),
    q("¿Qué ejemplo cotidiano representa una mezcla homogénea líquida?", [["☕","Té con azúcar totalmente disuelta"],["🥣","Sopa de verduras con fideos y choclo"],["🏖️","Agua con arena del mar"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Cómo se llama la sustancia que se disuelve en una solución homogénea (como la sal en el agua)?", [["🧂","El soluto"],["💧","El solvente"],["🧱","La fase sólida impermeable"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Cómo se llama la sustancia que disuelve al soluto en una mezcla homogénea (como el agua en una salmuera)?", [["💧","El solvente (o disolvente)"],["🧂","El soluto concentrado"],["🪨","El sedimento del fondo"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Por qué el aire atmosférico que respiramos es una mezcla homogénea gaseosa?", [["💨","Porque está formado por nitrógeno, oxígeno y otros gases mezclados de manera invisible y uniforme"],["🌧️","Porque está lleno de gotas de lluvia visibles a simple vista"],["🌑","Porque es un solo gas puro llamado aire"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué tipo de mezcla es el granito, roca común de la cordillera donde se ven pintas negras, blancas y grises?", [["🪨","Una mezcla heterogénea de minerales (cuarzo, feldespato y mica)"],["☕","Una solución homogénea líquida donde no se distinguen fases distintas"],["💨","Un gas puro transparente"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Qué sucede si agregamos más sal de la que el agua puede disolver a temperatura ambiente?", [["🧂","El exceso de sal no se disuelve y se deposita en el fondo formando una fase visible"],["🔥","El agua pura destilada sin ninguna sustancia disuelta"],["🧊","El agua se convierte en hielo al instante"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿El agua potable de la canilla es agua pura o una mezcla homogénea?", [["🚰","Es una mezcla homogénea porque contiene sales minerales disueltas indispensables"],["🧪","Es agua químicamente pura sin ninguna otra sustancia"],["🥗","Es una mezcla heterogénea con barro visible"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Qué tipo de mezcla encontramos en una taza de chocolatada con polvo bien disuelto en leche tibia?", [["🥛","Una mezcla homogénea uniforme"],["🪨","Una mezcla de piedras y arena"],["💨","Un gas puro inflamable"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Qué tipo de mezcla representa un puñado de canto rodado mezclado con arena de la ría?", [["🏖️","Una mezcla heterogénea sólida donde se distinguen piedras y granos de arena"],["☕","Una solución homogénea líquida"],["💨","Un gas comprimido"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Por qué las mezclas no alteran las propiedades originales de los componentes que las integran?", [["🥣","Porque cada sustancia conserva sus propiedades y puede recuperarse mediante métodos de separación físicos"],["🔥","Porque todas las sustancias se queman y cambian de fórmula química"],["🧱","Porque las sustancias desaparecen del universo"]], 0, "Pista: recordá las técnicas usadas para separar las partes."),
  ],

  // Mundo 16
  16: [
    q("¿Qué método de separación se utiliza para separar dos sólidos de diferente tamaño de grano pasando por una malla o red?", [["🌾","La tamización (o tamizado)"],["🧲","La imantación magnética"],["💧","La decantación de líquidos"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué método permite separar un sólido insoluble suspendido en un líquido haciendo pasar la mezcla por un papel poroso?", [["☕","La filtración"],["🧲","La imantación"],["🌾","La tamización"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué método físico se aprovecha para separar dos líquidos de distinta densidad que no se mezclan (como agua y aceite)?", [["🫒","La decantación"],["🌾","Por evaporación rápida del agua caliente sobre una hornalla encendida"],["🧲","La imantación magnética"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué método se utiliza para separar componentes de hierro o níquel de una mezcla utilizando las propiedades magnéticas?", [["🧲","La imantación (o separación magnética)"],["☕","La filtración por papel"],["🌾","La tamización"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Qué método de separación se aplica en la cocina al usar un colador para separar los fideos cocidos del agua?", [["🍝","La filtración separando el sólido del líquido"],["🌾","La tamización entre dos sustancias sólidas"],["🧲","La imantación con imanes de cocina"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Cómo se puede separar la sal disuelta en agua de mar para obtener sal marina sólida en una salina?", [["🧂","Por evaporación del agua mediante calor solar o fuego"],["🧲","La decantación por gravedad dejando reposar la mezcla durante varias horas"],["🌾","Pasando la salmuera por un tamiz fino"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Qué instrumento de laboratorio se utiliza para separar con precisión dos líquidos que no se mezclan?", [["🧱","Un embudo con canilla para decantación"],["☕","Acercando una llama potente para fundir los componentes de la mezcla"],["🫒","Un vaso de precipitados para soluciones"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Cómo se separa el café molido usado del líquido caliente que tomamos en el desayuno?", [["☕","Mediante filtración con un filtro de papel o tela"],["🧲","Porque alteran los enlaces químicos formando nuevos compuestos insolubles"],["🌾","Por tamización con un rastrillo de jardín mediante interacciones continuas"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué método de separación se produce de forma natural cuando dejamos reposar agua turbia de río y la tierra se va al fondo?", [["💧","La decantación (o sedimentación)"],["🧲","La imantación de partículas"],["🔥","La ebullición forzada"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Qué método emplearías para separar rápidamente alfileres de acero caídos en un cajón lleno de harina?", [["🧲","La imantación pasando un imán por encima de la harina"],["☕","La filtración agregando abundante agua a la mezcla"],["🌾","La tamización con un colador de poros muy pequeños"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Qué instrumento de laboratorio se utiliza para decantar y separar con precisión dos líquidos que no se mezclan?", [["🧪","Un embudo con canilla (embudo de decantación)"],["🔬","El microscopio de aumentos"],["🌡️","El termómetro de mercurio"]], 0, "Pista: pensá en un recipiente con canilla inferior para drenar el líquido más denso."),
    q("¿Cómo separarías una mezcla de arena, limaduras de hierro y corchos picados flotando en agua?", [["🔍","Imantando el hierro, recogiendo el corcho que flota por flotación y filtrando la arena del agua"],["🔥","Tirando todo al fuego de la hornalla"],["💨","Soplando con un secador de pelo hasta vaciar el vaso"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Por qué los métodos de separación de mezclas no alteran químicamente a las sustancias?", [["⚖️","Porque se basan en diferencias de propiedades físicas (tamaño, magnetismo, densidad, solubilidad)"],["🔥","Porque combinan las sustancias formando nuevos compuestos químicos"],["🧱","Porque eliminan permanentemente los componentes menos densos de la mezcla"]], 0, "Pista: recordá las técnicas usadas para separar las partes."),
    q("¿Qué filtro de aire tienen los automóviles para evitar que el polvo de los caminos patagónicos entre al motor?", [["🚗","Un filtro de aire de papel plegado que retiene la tierra por filtración"],["🧲","Un imán gigante que atrae las piedras del camino"],["🌾","Un tamiz de alambre grueso para ramas"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
    q("¿Cómo separarías corchos que flotan del agua en la que se encuentran?", [["🪵","Por flotación o espumado retirándolos de la superficie con una espumadera"],["🧲","Con un imán magnético de neodimio"],["🔥","Hirviendo el agua hasta fundir el corcho"]], 0, "Pista: pensá en las propiedades físicas empleadas para dividir los componentes."),
  ],

  // Mundo 17
  17: [
    q("¿Cuáles son las dos clases de fuentes luminosas según su origen?", [["💡","Fuentes luminosas naturales y fuentes luminosas artificiales"],["🔴","Fuentes luminosas calientes y fuentes congeladas"],["🪵","Fuentes de madera y fuentes de piedra"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cuál es la principal fuente luminosa y térmica natural de nuestro planeta Tierra?", [["☀️","El Sol"],["🌕","La Luna"],["💡","La linterna de pilas"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Por qué la Luna no es considerada una fuente luminosa propia?", [["🌕","Porque no emite luz propia sino que refleja la luz que recibe del Sol"],["🌑","Porque se apaga todos los días a las seis de la tarde"],["💡","Porque refleja la luz de las estrellas durante el día"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Qué ejemplo representa una fuente luminosa artificial creada por el ser humano?", [["🔦","Una linterna eléctrica a pilas o una lámpara led"],["☀️","El Sol en el mediodía"],["⚡","Un relámpago en una tormenta eléctrica"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo se propaga la luz en un medio homogéneo y transparente como el aire?", [["📏","En línea recta en todas las direcciones del espacio"],["〰️","Haciendo curvas y giros en zigzag sin rumbo"],["🔄","Girando en círculos concéntricos cerrados"]], 0, "Pista: pensá en los cuerpos que dejan pasar la claridad y los que no."),
    q("¿Qué son los materiales transparentes respecto al paso de los rayos de luz?", [["🪟","Materiales que dejan pasar casi toda la luz permitiendo ver objetos nítidamente a través de ellos"],["🧱","Luz en zigzag que cambia de dirección constantemente en el espacio"],["🌑","Materiales que absorben la luz y la destruyen"]], 0, "Pista: recordá cómo se comportan los distintos elementos con el calor."),
    q("¿Qué son los materiales opacos y qué fenómeno producen al interponerse ante la luz?", [["🪵","Materiales que no dejan pasar la luz y proyectan una sombra detrás de ellos"],["🪟","Materiales transparentes que dejan ver todo con claridad"],["💧","Líquidos que brillan con luz propia en la oscuridad"]], 0, "Pista: recordá cómo se comportan los distintos elementos con el calor."),
    q("¿Qué son los materiales translúcidos como el papel manteca o el vidrio esmerilado?", [["📄","Materiales que dejan pasar parte de la luz pero no permiten ver imágenes nítidas a través de ellos"],["🪟","Paredes de concreto macizo y maderas gruesas sin ninguna abertura"],["🧱","Paredes de concreto macizo que bloquean todo"]], 0, "Pista: recordá cómo se comportan los distintos elementos con el calor."),
    q("¿Por qué se forma una sombra en el suelo cuando una persona camina bajo el sol?", [["👤","Porque el cuerpo humano es opaco y bloquea los rayos de luz rectilíneos del Sol"],["💨","Porque el viento empuja manchas oscuras por la vereda"],["☀️","Porque los ojos se cierran al recibir la sombra"]], 0, "Pista: recordá cómo se propaga la iluminación en línea recta."),
    q("¿Qué le ocurre al tamaño de la sombra de un objeto cuando lo acercamos a una fuente de luz puntual?", [["📈","La sombra proyectada se vuelve más grande"],["📉","La sombra se achica hasta desaparecer"],["🌈","La sombra se vuelve de colores brillantes"]], 0, "Pista: recordá cómo se propaga la iluminación en línea recta."),
    q("¿Aproximadamente a qué velocidad viaja la luz en el vacío y en el aire?", [["⚡","Aproximadamente 300.000 kilómetros por segundo"],["🚗","A 1000 kilómetros por hora como un avión supersónico a reacción"],["🚲","A 20 kilómetros por hora como una bicicleta"]], 0, "Pista: recordá cómo se propaga la iluminación en línea recta."),
    q("¿Qué insecto bioluminiscente es capaz de producir luz natural mediante reacciones químicas en su cuerpo?", [["🪲","La luciérnaga"],["🦗","El grillo común"],["🐜","La hormiga carpintera"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Por qué a mediodía las sombras de los árboles son muy cortas comparadas con las del atardecer?", [["☀️","Porque el Sol se ubica en lo más alto del cielo cayendo los rayos casi verticales"],["🌑","Porque los árboles encogen sus ramas al mediodía"],["💨","Porque el viento sopla más fuerte barriendo la sombra"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿Cómo se llama la zona de sombra parcial y más tenue que rodea a la sombra oscura principal?", [["🌓","La penumbra"],["☀️","El foco luminoso"],["🪞","El reflejo especular"]], 0, "Pista: recordá cómo se propaga la iluminación en línea recta."),
    q("¿Qué instrumento astronómico aprovecha la sombra proyectada por una varilla al Sol para medir las horas?", [["⏰","El reloj de sol (o gnomon)"],["⏱️","El cronómetro digital"],["🧭","La brújula magnética"]], 0, "Pista: recordá cómo se propaga la iluminación en línea recta."),
  ],

  // Mundo 18
  18: [
    q("¿Cuál es el origen físico de cualquier sonido que escuchamos en la vida cotidiana?", [["🔊","La vibración mecánica de un cuerpo que produce ondas sonoras"],["💡","La luz emitida por una lámpara eléctrica"],["🧊","El frío acumulado en una cámara frigorífica"]], 0, "Pista: pensá en las vibraciones que viajan por el aire y otros medios."),
    q("¿Por qué el sonido no puede propagarse en el espacio exterior vacío?", [["🌌","Porque el sonido necesita un medio material (sólido, líquido o gas) para viajar"],["☀️","Porque la luz solar destruye las ondas acústicas en el vacío del espacio"],["🚀","Porque no existe un medio material con partículas que puedan vibrar"]], 0, "Pista: pensá en las vibraciones que viajan por el aire y otros medios."),
    q("¿En cuál de los tres estados de la materia viaja el sonido a MAYOR velocidad?", [["🪨","En los sólidos (como metales o madera) porque sus partículas están muy juntas"],["💧","En los líquidos como el agua de lago"],["💨","En los gases como el aire atmosférico"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Cuál es el orden correcto de velocidad de propagación del sonido de MAYOR a MENOR?", [["🚀","Sólidos > Líquidos > Gases"],["🐢","En el vacío del espacio interplanetario donde no hay ninguna partícula"],["🔄","Líquidos > Gases > Sólidos"]], 0, "Pista: pensá en las vibraciones que viajan por el aire y otros medios."),
    q("¿Qué cualidad del sonido nos permite clasificarlo en agudo o grave según la frecuencia de vibración?", [["🎵","El tono (o altura)"],["📢","La intensidad (volumen)"],["🎻","El timbre instrumental"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Qué cualidad del sonido nos permite diferenciar un sonido fuerte de uno débil según el volumen?", [["📢","La intensidad"],["🎵","El tono"],["🎷","El timbre"]], 0, "Pista: pensá en las vibraciones que viajan por el aire y otros medios."),
    q("¿Qué cualidad del sonido nos permite distinguir qué instrumento o persona está sonando aunque toquen la misma nota?", [["🎻","El timbre"],["📢","La intensidad"],["⏱️","La duración"]], 0, "Pista: pensá en las vibraciones que viajan por el aire y otros medios."),
    q("¿Qué órgano del cuerpo humano vibra al paso del aire para emitir nuestra propia voz?", [["🗣️","Las cuerdas vocales en la laringe"],["🫁","Los pulmones en el tórax"],["👂","El tímpano del oído medio"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué membrana delgada del oído humano vibra cuando recibe las ondas sonoras del aire?", [["👂","El tímpano"],["🧠","El lóbulo cerebral"],["👃","El tabique nasal"]], 0, "Pista: pensá en las vibraciones que viajan por el aire y otros medios."),
    q("¿Cómo se produce el fenómeno acústico del eco en cañadones o paredes de montaña?", [["🏔️","Por la reflexión del sonido que choca contra un obstáculo lejano y rebota hacia nosotros"],["💨","Porque el viento inventa palabras nuevas en el aire"],["🌲","Porque los árboles repiten lo que hablamos"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Aproximadamente a qué velocidad viaja el sonido en el aire a temperatura ambiente?", [["💨","Aproximadamente a 340 metros por segundo"],["⚡","A 300.000 kilómetros por segundo como la luz"],["🚗","A 1.500 metros por segundo como en el agua líquida"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Por qué en una tormenta vemos primero el relámpago luminoso y unos segundos después escuchamos el trueno sonoro?", [["⚡","Porque la luz viaja muchísimo más rápido que el sonido en el aire"],["☁️","Porque el trueno se produce en capas atmosféricas mucho más altas"],["👂","Porque las ondas sonoras se frenan por completo con la humedad del aire"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo se llama la contaminación producida por ruidos molestos, excesivos y continuos que dañan la audición?", [["📢","Contaminación acústica (o sonora)"],["🌊","Contaminación hídrica marina"],["🌫️","Contaminación visual"]], 0, "Pista: pensá en las vibraciones que viajan por el aire y otros medios."),
    q("¿Qué instrumento musical emite notas graves debido a la vibración de cuerdas gruesas y largas?", [["🎻","El contrabajo"],["🪈","La flauta traversa aguda"],["🔔","El triángulo metálico"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Qué unidad de medida se utiliza habitualmente para registrar el nivel de intensidad sonora de los ruidos?", [["🔊","Los decibeles (dB)"],["🌡️","Porque el eco de los ruidos ambientales anula las ondas en el receptor"],["⚖️","Los kilogramos de peso"]], 0, "Pista: pensá en las vibraciones que viajan por el aire y otros medios."),
  ],

  // Mundo 19
  19: [
    q("¿Cuáles son los dos polos magnéticos opuestos que posee todo imán?", [["🧲","El polo norte y el polo sur"],["🔴","El polo positivo y el polo neutro"],["⚡","El polo caliente y el polo frío"]], 0, "Pista: recordá las fuerzas de atracción entre metales y campos."),
    q("¿Qué sucede cuando acercamos dos polos magnéticos iguales de dos imanes (norte con norte)?", [["↔️","Se repelen y se empujan alejándose entre sí"],["🤝","Se atraen con una fuerza magnética irresistible"],["🔥","Se calientan hasta fundirse"]], 0, "Pista: recordá las fuerzas de atracción entre metales y campos."),
    q("¿Qué ocurre cuando acercamos dos polos magnéticos opuestos de dos imanes (norte con sur)?", [["🧲","Se atraen con fuerza juntándose firmemente"],["↔️","Se repelen y se empujan hacia los costados"],["🧊","Se congelan al instante"]], 0, "Pista: recordá las fuerzas de atracción entre metales y campos."),
    q("¿Qué mineral natural oscuro posee propiedades magnéticas de atracción natural hacia el hierro?", [["🪨","La magnetita"],["🧂","Se atraen fuertemente con gran intensidad juntándose en el centro"],["💎","El diamante transparente"]], 0, "Pista: recordá las fuerzas de atracción entre metales y campos."),
    q("¿Qué metales cotidianos son fuertemente atraídos por el campo magnético de un imán?", [["📎","Metales ferrosos como el hierro, el acero y el níquel"],["🪙","Metales como el oro puro, la plata y el cobre puro"],["🪵","Maderas de lenga y ramas de arbustos"]], 0, "Pista: pensá en el comportamiento de los polos opuestos e iguales."),
    q("¿Qué materiales no son atraídos en absoluto por los imanes?", [["🪵","El plástico, la madera, el vidrio, la goma y el papel"],["🔩","Los clavos de acero inoxidable"],["🧲","Otras barras de hierro dulce"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Cómo se llama el instrumento de navegación que contiene una aguja imantada que gira libremente?", [["🧭","La brújula magnética"],["🔭","El telescopio reflector"],["⏱️","El cronómetro de arena"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Por qué la aguja imantada de la brújula apunta siempre en dirección al norte magnético?", [["🌍","Porque la Tierra se comporta como un gigantesco imán natural con polos magnéticos"],["💨","Porque las corrientes de viento mueven la aguja imantada hacia el norte"],["☀️","Porque el viento mueve la aguja magnética hacia el norte"]], 0, "Pista: recordá las fuerzas de atracción entre metales y campos."),
    q("¿Qué sucede si cortamos un imán en dos partes iguales por el medio?", [["🧲","Se obtienen dos imanes completos, cada uno con su propio polo norte y polo sur"],["🚫","Se destruye el magnetismo perdiendo toda fuerza"],["🔴","Queda un trozo con polo norte y otro con polo sur separados"]], 0, "Pista: recordá las fuerzas de atracción entre metales y campos."),
    q("¿Cómo se llama la zona invisible del espacio alrededor de un imán donde se sienten sus fuerzas de atracción?", [["🧲","El campo magnético"],["💨","La corriente de aire frío"],["☀️","La zona de radiación térmica"]], 0, "Pista: recordá las fuerzas de atracción entre metales y campos."),
    q("¿Qué tipo de fuerza es la fuerza magnética al mover objetos metálicos sin necesidad de tocarlos?", [["✨","Una fuerza que actúa a distancia"],["🥊","Una fuerza de contacto físico directo"],["🏃","Una fuerza muscular voluntaria"]], 0, "Pista: recordá las fuerzas de atracción entre metales y campos."),
    q("¿Para qué se utilizan tiras magnéticas imantadas en la puerta de las heladeras domiciliarias?", [["🧊","Para mantener la puerta herméticamente cerrada evitando que se escape el frío"],["🔥","Para cocinar los alimentos dentro del freezer y favorecer el equilibrio de los ecosistemas patagónicos"],["💡","Para encender la luz del interior sin cables"]], 0, "Pista: recordá las fuerzas de atracción entre metales y campos."),
    q("¿Qué ocurre con la fuerza magnética de atracción a medida que alejamos un objeto de hierro del imán?", [["📉","La fuerza magnética disminuye con la distancia hasta no sentirse"],["📈","La fuerza aumenta al triple haciéndose más intensa"],["🔄","La fuerza permanece exactamente constante a cualquier distancia"]], 0, "Pista: recordá las fuerzas de atracción entre metales y campos."),
    q("¿Puede la fuerza magnética de un imán potente atravesar materiales delgados como una hoja de papel o cartón?", [["📄","Sí, el campo magnético atraviesa el papel y atrae un clip de metal del otro lado"],["🚫","No, porque el papel bloquea completamente las líneas de fuerza magnética"],["🔥","No, porque el papel bloquea completamente la atracción magnética"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Qué artefacto tecnológico moderno utiliza electroimanes para funcionar?", [["🔔","Los timbres eléctricos, motores y parlantes de audio"],["🪵","Las cucharas de madera talladas a mano"],["🕯️","Las velas de cera de abejas"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
  ],

  // Mundo 20
  20: [
    q("¿Qué es la electricidad estática (o electrostática) en los materiales cotidianos?", [["⚡","La acumulación de cargas eléctricas en reposo en la superficie de un cuerpo por frotamiento"],["🌊","El agua que corre por las cañerías del baño"],["💨","El viento fuerte que sopla sobre la meseta"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Qué dos tipos de cargas eléctricas existen en la materia según la física?", [["➕","Cargas eléctricas positivas y cargas eléctricas negativas"],["🔴","Cargas pesadas y cargas livianas"],["🔥","Cargas calientes y cargas congeladas"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué sucede entre dos cuerpos que poseen cargas eléctricas del MISMO signo (+ con + o - con -)?", [["↔️","Se repelen y se empujan alejándose"],["🤝","Se pegan fuertemente para siempre"],["💧","Se derriten formando gotas de agua"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué ocurre entre dos cuerpos que poseen cargas eléctricas de SIGNO OPUESTO (+ con -)?", [["🧲","Se atraen mutuamente ejerciendo una fuerza a distancia"],["↔️","Se atraen mutuamente hasta quedar pegados sin separarse jamás"],["🌑","Se vuelven completamente invisibles"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué experiencia sencilla demuestra la fuerza electrostática atractiva en el aula escolar?", [["📏","Frotar una regla de plástico con un paño de lana y acercarla a papelitos picados"],["🔨","Golpear una madera con un martillo pesado"],["💧","Echar agua caliente dentro de una taza"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué un globo frotado contra el cabello seco logra pegarse a una pared durante varios minutos?", [["🎈","Porque al frotarse se carga eléctricamente y atrae a las cargas de la pared"],["🍯","Porque el globo tiene pegamento líquido en la goma"],["💨","Porque el aire de la habitación succiona el globo"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué tipo de cargas eléctricas diminutas se transfieren de un cuerpo a otro durante el frotamiento?", [["🔬","Las cargas eléctricas negativas"],["🪨","Las cargas eléctricas positivas"],["💧","Las partículas neutras sin carga"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Qué sensación sentimos a veces al sacarnos un suéter de lana sintética en una habitación oscura?", [["⚡","Pequeños chasquidos y diminutas chispas luminosas por descargas electrostáticas"],["🔥","Un sonido ensordecedor que hace vibrar el piso"],["❄️","Una lluvia de cubitos de hielo en los hombros"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué a veces nos da una pequeña descarga eléctrica o 'patada' al tocar la manija de un auto en días muy secos?", [["🚗","Porque nuestro cuerpo se cargó de electricidad estática por fricción y se descarga al tocar el metal"],["🔋","Porque la pintura exterior del vehículo conduce corriente eléctrica continua"],["☀️","Porque el metal del auto genera electricidad por el calor solar"]], 0, "Pista: pensá en las interacciones de atracción o repulsión entre cargas."),
    q("¿Qué gran fenómeno natural en la atmósfera es una gigantesca descarga de electricidad estática?", [["⚡","El rayo durante una tormenta eléctrica"],["🌧️","La llovizna suave de otoño"],["🌈","El arcoíris después de la lluvia"]], 0, "Pista: pensá en las interacciones de atracción o repulsión entre cargas."),
    q("¿Por qué en climas secos y ventosos como los de Santa Cruz los fenómenos electrostáticos son más notorios?", [["💨","Porque el aire seco favorece la acumulación de cargas al no haber humedad que las disipe"],["🌧️","Porque la lluvia moja el aire apagando las cargas"],["❄️","Porque el frío congela los cables de la ciudad"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué le ocurre al cabello cuando nos frotamos enérgicamente un globo inflado en la cabeza?", [["💇","Los pelos se erizan y se separan entre sí porque adquieren cargas del mismo signo que se repelen"],["✂️","El pelo cambia de color pasando de oscuro a claro"],["💧","El pelo se moja como si saliera de la ducha"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué aparato inventado por Benjamin Franklin protege a los edificios de las descargas de los rayos?", [["⚡","El pararrayos"],["🧭","La brújula marina"],["🔋","La pila de linterna"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿Qué ocurre si acercamos un peine de plástico cargado por fricción a un hilito fino de agua que cae de la canilla?", [["💧","El chorrito de agua se desvía curvándose hacia el peine sin tocarlo"],["🔥","El agua comienza a hervir a cien grados"],["🧊","El chorrito se congela transformándose en carámbano"]], 0, "Pista: pensá en las interacciones de atracción o repulsión entre cargas."),
    q("¿Por qué decimos que la fuerza electrostática es una fuerza que actúa a distancia?", [["✨","Porque atrae o repele cuerpos sin necesidad de que haya contacto físico entre ellos"],["🥊","Porque la atracción electrostática actúa a través de cualquier distancia"],["🏃","Porque solo funciona a kilómetros de distancia"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
  ],

  // Mundo 21
  21: [
    q("¿Cuál es la principal fuente de energía que impulsa de manera continua el ciclo del agua en el planeta?", [["☀️","La energía solar y el calor del Sol"],["🌙","La luz tenue de la Luna llena"],["💨","El viento de los ventiladores"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo se llama la etapa del ciclo en la que el agua líquida de lagos y mares pasa a la atmósfera como vapor?", [["💨","Evaporación"],["🌧️","Precipitación"],["🧊","Solidificación"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo aportan vapor de agua a la atmósfera los árboles y plantas del bosque andino?", [["🍃","A través de la transpiración vegetal por los poros de sus hojas"],["🪨","Rompiendo piedras de la montaña"],["🔥","Quemando madera en el suelo"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Qué etapa del ciclo del agua da origen a las nubes cuando el vapor asciende y se enfría en las alturas?", [["☁️","La condensación en diminutas gotitas de agua y cristales de hielo"],["🔥","La fusión directa de rocas"],["🛢️","La destilación del petróleo"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Bajo qué formas de precipitación cae el agua desde las nubes a la superficie en Santa Cruz?", [["🌧️","En forma de lluvia, nieve o granizo según la temperatura del aire"],["💨","En forma de corrientes de aire caliente"],["🪨","En forma de lluvia de piedras volcánicas"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo se llama el proceso por el cual el agua de lluvia o deshielo escurre sobre el terreno formando ríos y arroyos?", [["💧","Escurrimiento superficial"],["🌱","Transpiración vegetal"],["☁️","Condensación atmosférica"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué ocurre cuando parte del agua que cae en la tierra penetra en el suelo hacia capas subterráneas?", [["💧","Se produce la infiltración alimentando napas y acuíferos subterráneos"],["🔥","El agua se desintegra convirtiéndose en lava ardiente"],["💨","Se convierte inmediatamente en nubes de tormenta"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Cómo se formaron los imponentes glaciares patagónicos como el Perito Moreno y el Upsala?", [["🏔️","Por la acumulación y compactación gradual de sucesivas capas de nieve durante siglos"],["🧊","Por congelamiento instantáneo de agua de mar durante las noches de invierno"],["🏭","Fueron construidos con máquinas frigoríficas gigantes"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué masa de agua gigantesca alimenta con sus deshielos al lago Argentino en Santa Cruz?", [["🏔️","Los glaciares del Campo de Hielo Patagónico Sur"],["🌴","Las cataratas del Iguazú"],["🌊","El río de la Plata"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué los glaciares de Santa Cruz son considerados reservas estratégicas vitales de agua dulce?", [["💧","Porque almacenan gigantescas cantidades de agua dulce pura que regulan el caudal de cuencas fluviales"],["🧂","Porque contienen agua salada no potable"],["🐟","Porque fabrican peces de criadero dentro del hielo"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué río caudaloso nace en el lago Argentino y desemboca en el océano Atlántico cruzando toda la provincia?", [["🌊","El río Santa Cruz"],["🌊","El río Paraná"],["🌊","El río Uruguay"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué decimos que la cantidad total de agua en el planeta Tierra permanece constante a lo largo del tiempo?", [["🔄","Porque el agua no se crea ni se destruye, sino que circula continuamente cambiando de estado"],["🌧️","Porque la lluvia agrega agua nueva que antes no existía en el planeta"],["📉","Porque el agua se consume y disminuye a la mitad cada siglo transcurrido"]], 0, "Pista: pensá en cómo el ciclo del agua redistribuye el líquido sin perderlo."),
    q("¿Cómo influye el cambio climático y el calentamiento global en los glaciares de nuestra provincia?", [["📉","Acelera el retroceso y derretimiento de la mayoría de los glaciares reduciendo las reservas de hielo"],["🏔️","Hace que los glaciares crezcan diez veces más rápido"],["❄️","Enfría el planeta provocando una nueva era de hielo"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué fenómeno espectacular ocurre periódicamente en el glaciar Perito Moreno al cerrarse el canal de los Témpanos?", [["💥","El dique de hielo represa el brazo Rico hasta que la presión del agua provoca la ruptura"],["🌋","Una erupción volcánica subterránea que calienta las aguas del lago"],["🌪️","Una ola gigante que desplaza el frente del glaciar hacia el bosque"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué cuidado fundamental debemos tener con las cuencas de los ríos y glaciares patagónicos?", [["🌱","Evitar la contaminación de sus aguas y proteger las nacientes cordilleranas"],["🚯","Desviar todos los cauces fluviales hacia zonas áridas sin vegetación"],["🏭","Instalar basurales en las orillas de los ríos"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
  ],

  // Mundo 22
  22: [
    q("¿Cuál es la forma geométrica real de la Tierra como cuerpo cósmico en el espacio?", [["🌍","Geoide: una esfera ligeramente achatada en los polos y ensanchada en el ecuador"],["🥞","Una esfera perfecta sin ningún achatamiento en los polos"],["📦","Un cubo perfecto con seis caras cuadradas idénticas"]], 0, "Pista: pensá en la forma esférica real con polos achatados."),
    q("¿Aproximadamente cuánto mide el radio medio del planeta Tierra desde su centro hasta la superficie?", [["📏","Aproximadamente 6.370 kilómetros"],["📏","Aproximadamente 100 kilómetros"],["📏","Aproximadamente un millón de kilómetros"]], 0, "Pista: pensá en la distancia en miles de kilómetros hasta el centro."),
    q("¿Cuánto mide aproximadamente la circunferencia o perímetro ecuatorial de la Tierra al dar una vuelta completa?", [["🌍","Aproximadamente 40.000 kilómetros"],["📏","Aproximadamente 500 kilómetros"],["📏","Aproximadamente dos millones de kilómetros"]], 0, "Pista: pensá en una distancia de varias decenas de miles de kilómetros."),
    q("¿Qué lugar ocupa el planeta Tierra en el sistema solar según su distancia al Sol?", [["🪐","Es el tercer planeta desde el Sol (entre Venus y Marte)"],["☀️","Es el planeta más grande y frío de todos los que integran el sistema solar"],["❄️","Es el último planeta en los confines congelados del sistema"]], 0, "Pista: recordá el orden de los planetas desde el centro del sistema."),
    q("¿Cómo es el tamaño de la Tierra comparado con el del Sol y el de la Luna?", [["⚖️","Mucho más pequeña que el Sol y unas cuatro veces más grande que la Luna"],["☀️","Exactamente del mismo tamaño y masa que los planetas gigantes gaseosos"],["🌕","Mucho más pequeña que todos los satélites conocidos"]], 0, "Pista: compará nuestro tamaño con la estrella central y con nuestro satélite."),
    q("¿Cómo se llama el satélite natural que orbita alrededor de la Tierra?", [["🌕","La Luna"],["🪐","Saturno"],["⭐","La estrella polar"]], 0, "Pista: pensá en el cuerpo celeste brillante que vemos de noche."),
    q("¿Qué forma tiene la Luna en el cielo del hemisferio sur durante la fase de Cuarto Creciente?", [["🌙","Se ve con forma de letra C (Creciente en el hemisferio sur)"],["🌓","Se ve con forma de letra D"],["🌕","Se ve como un círculo brillante completo"]], 0, "Pista: recordá con qué letra empieza el nombre de esta fase en el sur."),
    q("¿Qué forma tiene la Luna en el cielo del hemisferio sur durante la fase de Cuarto Menguante?", [["🌓","Se ve con forma de letra D (Menguante o Decreciente en el hemisferio sur)"],["🌙","Se ve con forma de letra C"],["🌑","No se ve nada porque está en Luna nueva"]], 0, "Pista: recordá qué letra contraria a C se forma al decrecer."),
    q("¿Cómo se llama la fase lunar en la que vemos la cara de la Luna completamente iluminada por el Sol?", [["🌕","Luna Llena"],["🌑","Luna Nueva"],["🌙","Cuarto Creciente"]], 0, "Pista: pensá en la fase donde se aprecia todo el disco lunar iluminado."),
    q("¿Aproximadamente cuántos días tarda la Luna en completar su ciclo de cuatro fases principales?", [["📅","Aproximadamente 29 días y medio (un mes lunar)"],["📅","Exactamente 365 días"],["⏱️","Solo 24 horas"]], 0, "Pista: pensá en la duración cercana a cuatro semanas."),
    q("¿Qué fuerza cósmica invisible mantiene a la Tierra girando en su órbita alrededor del Sol?", [["☀️","La fuerza de atracción gravitatoria del Sol"],["💨","La fuerza centrífuga del giro terrestre"],["🧲","El campo magnético interestelar"]], 0, "Pista: pensá en la atracción universal entre cuerpos celestes masivos."),
    q("¿Por qué desde la superficie terrestre no sentimos que la Tierra se mueve a altísima velocidad?", [["🌍","Porque la Tierra se mueve a velocidad constante y nosotros nos movemos junto con ella y con su atmósfera"],["🛑","Porque la Tierra se detiene por completo durante el día"],["🧱","Porque las montañas la frenan"]], 0, "Pista: pensá en viajar dentro de un vehículo que avanza a velocidad uniforme."),
    q("¿Qué línea imaginaria divide a la Tierra en Hemisferio Norte y Hemisferio Sur?", [["🌐","La línea del Ecuador"],["📍","El meridiano de Greenwich"],["🧊","El círculo polar ártico"]], 0, "Pista: pensá en la línea central horizontal a cero grados de latitud."),
    q("¿En qué hemisferio de la Tierra se encuentra ubicada la provincia de Santa Cruz y toda la Argentina?", [["🇦🇷","En el Hemisferio Sur (austral) y Occidental"],["🌍","En el Hemisferio Norte (boreal) y Oriental"],["❄️","Exactamente sobre el Polo Norte geográfico"]], 0, "Pista: recordá en qué sector respecto al ecuador y a Greenwich nos ubicamos."),
    q("¿Por qué los antiguos navegantes ya sabían que la Tierra era redonda al observar barcos alejándose en el mar?", [["⛵","Porque el casco se ocultaba primero y las velas después tras la curvatura marina"],["🌊","Porque los barcos se hacían cada vez más diminutos sin ocultarse jamás en el mar"],["🌫️","Porque la bruma del océano cubría el mástil antes de tapar la base de la nave"]], 0, "Pista: pensá en el efecto óptico producido por una superficie curva."),
  ],

  // Mundo 23
  23: [
    q("¿Sobre qué eje gira la Tierra durante su movimiento de rotación?", [["🌍","Sobre su propio eje imaginario que une los polos Norte y Sur"],["☀️","Alrededor del centro del Sol en una elipse"],["🌕","Alrededor de la Luna"]], 0, "Pista: pensá en el eje vertical que atraviesa el propio planeta."),
    q("¿Cuánto tiempo exacto tarda la Tierra en completar un giro completo de rotación sobre su eje?", [["⏱️","Aproximadamente 24 horas (un día solar completo)"],["📅","365 días y seis horas"],["⏳","30 días exactos"]], 0, "Pista: pensá en el tiempo que demora un día completo."),
    q("¿En qué sentido gira la Tierra sobre su eje durante el movimiento de rotación?", [["🧭","De Oeste a Este"],["🧭","De Este a Oeste"],["❄️","De Sur a Norte"]], 0, "Pista: pensá en la dirección que produce que el Sol asome por el este."),
    q("¿Cuál es la consecuencia principal más visible del movimiento de rotación terrestre?", [["☀️","La sucesión periódica del día y de la noche"],["🍂","El cambio regular de las cuatro estaciones"],["🌊","El crecimiento de las mareas oceánicas"]], 0, "Pista: pensá en el cambio diario entre horas de luz y oscuridad."),
    q("¿Por qué en una mitad de la Tierra es de día mientras en la otra mitad es de noche?", [["🌍","Porque al ser una esfera opaca, solo la cara orientada hacia el Sol recibe su luz"],["🌑","Porque la Luna se interpone entre el Sol y la Tierra durante doce horas"],["💨","Porque una nube gigante tapa la mitad del planeta"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Por qué vemos al Sol 'salir' por el Este y 'ponerse' por el Oeste todos los días?", [["☀️","Por el movimiento aparente del Sol provocado por la rotación de la Tierra de Oeste a Este"],["🚀","Porque el Sol viaja en órbita circular alrededor del planeta Tierra"],["🌙","Porque los planetas vecinos tapan los rayos solares"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Por qué punto cardinal aproximado asoma el Sol en el amanecer cada mañana?", [["🌅","Por el punto cardinal Este"],["🌄","Por el punto cardinal Oeste"],["❄️","Por el punto cardinal Sur"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Por qué punto cardinal aproximado se oculta el Sol al atardecer cada jornada?", [["🌄","Por el Oeste"],["🌅","Por el Este"],["🧭","Por el Norte"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Qué constelación estelar nos permite orientarnos hacia el Sur durante la noche en Santa Cruz?", [["✨","La Cruz del Sur"],["⭐","La Osa Mayor del norte"],["🌟","La estrella Sirio"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo se llaman las zonas en las que está dividido el planeta para coordinar la hora oficial de los países?", [["⏰","Los husos horarios (24 franjas de 15 grados de longitud)"],["📐","Los meridianos térmicos"],["🌐","Las zonas de viento"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué huso horario oficial rige legalmente en toda la República Argentina?", [["🇦🇷","El huso horario UTC -3"],["⏰","El huso horario UTC 0 de Londres"],["⏰","El huso horario UTC +5"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué sucede con la sombra de un poste de luz al mediodía solar cuando el Sol alcanza su altura máxima?", [["📏","Es la sombra más corta de toda la jornada apuntando hacia el Sur en Santa Cruz"],["📈","Es la sombra más larga de toda la jornada apuntando hacia el Norte"],["🌑","La sombra desaparece por completo durante varias horas consecutivas"]], 0, "Pista: recordá cómo se propaga la iluminación en línea recta."),
    q("¿Qué instrumento con un péndulo demostró experimentalmente en 1851 la rotación de la Tierra sobre su eje?", [["🕰️","El péndulo de Foucault"],["🔭","El telescopio de Galileo"],["🧭","La brújula de Arquímedes"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Por qué si en Río Gallegos son las 12 del mediodía en Japón es de noche cerrada?", [["🌏","Porque Japón se encuentra en el lado opuesto de la Tierra donde no llegan los rayos solares"],["🌑","Porque al ser la Tierra esférica el Sol ilumina lados opuestos a distinta hora"],["🌧️","Porque allí llueve todos los días"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué inclinación mantiene el eje imaginario de la Tierra respecto a la vertical durante su rotación?", [["📐","Aproximadamente 23,5 grados de inclinación constante"],["📏","Cero grados de inclinación perfecta"],["📐","Noventa grados acostado sobre el suelo"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
  ],

  // Mundo 24
  24: [
    q("¿Alrededor de qué cuerpo cósmico se desplaza la Tierra durante su movimiento de traslación?", [["☀️","Alrededor del Sol en una órbita elíptica"],["🌕","Alrededor de la Luna"],["🪐","Alrededor del centro del sistema planetario"]], 0, "Pista: pensá en las partes del cuerpo humano y sus movimientos."),
    q("¿Cuánto tiempo exacto tarda la Tierra en completar una vuelta de traslación alrededor del Sol?", [["📅","365 días y casi 6 horas (un año solar)"],["⏱️","Exactamente 24 horas"],["⏳","30 días exactos"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Por qué cada cuatro años se agrega un día bisiesto (29 de febrero) en el calendario?", [["🗓️","Para compensar las 6 horas sobrantes de cada año que al acumularse forman 24 horas"],["🎉","Para ajustar el calendario al tiempo real que tarda la Tierra en dar la vuelta"],["❄️","Porque el invierno dura el doble ese año"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cuáles son las dos causas combinadas que originan las cuatro estaciones del año?", [["🌍","La inclinación del eje terrestre (23,5°) combinada con el movimiento de traslación"],["🔥","La distancia variable de la órbita de la Luna alrededor de la Tierra"],["💨","La velocidad de los vientos de la meseta"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Por qué en verano hace más calor que en invierno en Santa Cruz?", [["☀️","Porque los rayos solares inciden de forma más directa y los días tienen muchas más horas de luz"],["🔥","Porque la Tierra viaja más rápido en su órbita durante los meses de verano"],["🌋","Porque los volcanes cordilleranos despiden calor subterráneo"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿En qué meses del año se desarrolla el verano en el hemisferio sur donde vivimos?", [["🏖️","Desde el 21 de diciembre hasta el 21 de marzo"],["❄️","Desde el 21 de junio hasta el 21 de septiembre"],["🍂","Durante todo el mes de julio exclusivamente"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué estación del año ocurre simultáneamente en el hemisferio norte cuando en Santa Cruz es verano?", [["❄️","El invierno en el hemisferio norte"],["🏖️","El verano también en el norte"],["🍂","El otoño en todo el planeta"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo se llama el día del año en que comienza el verano en el hemisferio sur con la noche más corta?", [["☀️","El solsticio de verano (alrededor del 21 de diciembre)"],["❄️","El solsticio de invierno"],["🌱","El equinoccio de primavera"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué ocurre con la duración de las noches en el extremo sur patagónico durante el solsticio de invierno (21 de junio)?", [["🌙","Es la noche más larga del año con los días más breves y fríos"],["☀️","Es el día con más sol y calor"],["⏰","El día y la noche duran exactamente doce horas"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Qué significa la palabra 'equinoccio' que da inicio al otoño y a la primavera?", [["⚖️","'Noche igual': momento del año en que el día y la noche duran exactamente 12 horas en todo el planeta"],["☀️","El día más caluroso del verano"],["❄️","La nevada más intensa del invierno"]], 0, "Pista: recordá las especies de fauna autóctona que habitan allí."),
    q("¿Por qué en verano en ciudades santacruceñas como Río Gallegos anochece pasadas las diez de la noche?", [["🌅","Por la alta latitud sur inclinada hacia el Sol durante los meses de verano austral"],["☁️","Porque las nubes de la cordillera reflejan los rayos luminosos hasta la medianoche"],["🌍","Porque la rotación terrestre se vuelve más lenta y demora la llegada de la sombra"]], 0, "Pista: pensá en cómo incide la luz solar en las regiones cercanas al polo sur."),
    q("¿Qué cambio observable experimenta la flora del bosque andino con la llegada del otoño en marzo?", [["🍂","Las hojas de las lengas cambian de color a tonos rojizos y caen de las ramas"],["🌱","Los árboles producen brotes verdes tiernos y florecen intensamente en ramas"],["🌲","Las ramas pierden su corteza gruesa para soportar el calor de la temporada"]], 0, "Pista: recordá qué pasa con el follaje caduco antes del frío invernal."),
    q("¿Cómo se llama la trayectoria geométrica ligeramente ovalada que recorre la Tierra alrededor del Sol?", [["🪐","La órbita elíptica"],["📐","La línea recta sin fin"],["🌀","El espiral descendente"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Qué estación comienza en el hemisferio sur alrededor del 21 de septiembre con el florecimiento vegetal?", [["🌸","La primavera austral"],["🍂","El otoño"],["❄️","El invierno helado"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿Qué sucedería con las estaciones si el eje de la Tierra no estuviera inclinado y fuera perfectamente vertical?", [["🌍","No existirían las cuatro estaciones: el clima sería igual todo el año con días y noches de 12 horas constantes"],["🔥","La Tierra se alejaría del Sol perdiéndose en el espacio interestelar"],["❄️","Todo el planeta se congelaría para siempre"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
  ],

  // Mundo 25
  25: [
    q("¿Cuáles son los cuatro grandes subsistemas que interactúan integrando el planeta Tierra?", [["🌍","La geósfera, la hidrósfera, la atmósfera y la biósfera"],["🧱","El cemento, el asfalto, el vidrio y el plástico"],["🚗","Los motores, las ruedas, los frenos y los volantes"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Qué parte de la Tierra compone la geósfera?", [["🪨","La parte sólida y rocosa del planeta formada por la corteza, el manto y el núcleo"],["🌊","Todos los mares y ríos del mundo"],["💨","El aire y las nubes del cielo"]], 0, "Pista: recordá cómo influyen los astros en los ciclos periódicos."),
    q("¿Qué compone la hidrósfera en nuestro planeta?", [["💧","El conjunto de todas las aguas de la Tierra en estado líquido, sólido y gaseoso"],["🌱","Todos los bosques y animales"],["🪨","Las rocas y minerales de la montaña"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué es la atmósfera terrestre y qué función protectora primordial cumple?", [["💨","La capa de gases que rodea a la Tierra aportando oxígeno y protegiéndola de la radiación"],["🌊","El fondo del océano Atlántico"],["🪨","El núcleo de hierro fundido de la Tierra"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué es la biósfera en la clasificación de los subsistemas terrestres?", [["🌱","El conjunto de todos los seres vivos del planeta y los ambientes donde habitan"],["🪨","Las canteras de pórfido y carbón"],["☁️","Las capas superiores de nubes sin vida"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué dos gases componen la mayor parte del aire de la atmósfera terrestre?", [["💨","El nitrógeno (78%) y el oxígeno (21%)"],["🔥","El helio y el metano puro"],["💧","El cloro y el vapor de alcohol"]], 0, "Pista: pensá en cómo cambia la materia según gana o pierde calor."),
    q("¿A qué subsistema pertenecen los grandes glaciares andinos y los ríos santacruceños?", [["💧","A la hidrósfera"],["🪨","A la geósfera"],["💨","A la atmósfera"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué capa de la atmósfera filtra la radiación ultravioleta perjudicial del Sol protegiendo a la biósfera?", [["🛡️","La capa de ozono"],["☁️","La niebla baja de la mañana"],["💨","El humo de las chimeneas"]], 0, "Pista: pensá en los movimientos de nuestro planeta en el espacio."),
    q("¿Cómo interactúan la hidrósfera y la geósfera para modelar el paisaje de cañadones en Santa Cruz?", [["🌊","El agua de los ríos erosiona y desgasta las rocas de la geósfera a lo largo de milenios"],["💨","El viento se convierte en hielo congelando las rocas"],["🌱","Las plantas derriten las montañas con sus hojas"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo colabora la biósfera vegetal con la atmósfera mediante la fotosíntesis?", [["🍃","Las plantas absorben dióxido de carbono y liberan oxígeno indispensable para respirar"],["💨","Enfrían las corrientes oceánicas absorbiendo el calor de la radiación"],["🔥","Calientan la atmósfera quemando carbono"]], 0, "Pista: pensá en las especies vegetales que crecen en esta zona."),
    q("¿En cuál de las capas de la geósfera habitamos los seres humanos y los demás seres vivos?", [["🪨","En la corteza terrestre (la capa sólida exterior)"],["🔥","En el manto superior de roca densa semisólida"],["🌋","En el núcleo interno metálico de hierro vivo"]], 0, "Pista: pensá en la capa más superficial de nuestro planeta."),
    q("¿Qué porcentaje aproximado de la superficie terrestre está cubierto por las aguas de la hidrósfera?", [["🌊","Aproximadamente el 71 por ciento de la superficie del planeta"],["🌾","Menos del 10 por ciento"],["🏜️","Exactamente el 2 por ciento"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo se llama la capa superficial y fértil de la corteza donde interactúan rocas, agua, aire y seres vivos?", [["🌱","El suelo fértil con humus y minerales"],["🧱","La roca madre impenetrable"],["🔥","El magma volcánico"]], 0, "Pista: recordá la clasificación biológica de los grupos biológicos."),
    q("¿Por qué un cambio negativo en un subsistema (como contaminar el agua) afecta a los demás?", [["🔄","Porque los cuatro subsistemas están íntimamente interconectados en un equilibrio dinámico"],["🧱","Porque están aislados por murallas sin relación alguna"],["🚫","Porque no comparten ninguna materia"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué fenómeno del subsistema atmosférico produce las lluvias y nevadas que nutren la hidrósfera en la Patagonia?", [["☁️","El ciclo meteorológico de nubes y precipitaciones"],["🪨","La fractura de placas de la geósfera"],["🌲","El crecimiento de los árboles de lenga"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
  ],

  // Mundo 26
  26: [
    q("¿Cómo se llama la teoría geológica que explica que la corteza terrestre está dividida en grandes bloques en continuo movimiento?", [["🧩","La tectónica de placas"],["🪐","La teoría de los vientos estelares"],["🌊","La teoría de las corrientes marinas superficiales"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué dos grandes placas tectónicas chocan y se rozan a lo largo de la cordillera de los Andes?", [["🏔️","La Placa Sudamericana y la Placa de Nazca (o Placa Antártica al sur)"],["🌴","La Placa de Groenlandia y la Placa Africana"],["🌊","La Placa del Caribe y la Placa de Australia"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo se llama el punto subterráneo dentro de la corteza donde se origina la fractura inicial de un terremoto?", [["💥","El hipocentro (o foco sísmico)"],["📍","El epicentro en la superficie"],["🌋","El cráter del volcán"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo se denomina el punto de la superficie terrestre ubicado exactamente en la vertical sobre el hipocentro de un sismo?", [["📍","El epicentro"],["💥","El hipocentro subterráneo"],["🌊","La fosa abisal marina"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué instrumento científico de alta precisión detecta y registra las ondas sísmicas de un terremoto?", [["📊","El sismógrafo"],["🌡️","El termómetro ambiental"],["🧭","La brújula magnética"]], 0, "Pista: pensá en las vibraciones que viajan por el aire y otros medios."),
    q("¿Cómo se llama la escala matemática más conocida que mide la magnitud de energía liberada por un terremoto?", [["📈","La escala de Richter"],["⚖️","La escala de gramos"],["🌡️","La escala Celsius de temperatura"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué volcán cordillerano chileno entró en violenta erupción en agosto de 1991 cubriendo de cenizas a gran parte de Santa Cruz?", [["🌋","El volcán Hudson"],["🌋","El volcán Lanín"],["🌋","El volcán Vesubio"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué graves perjuicios ocasionaron las cenizas del volcán Hudson en los campos y localidades de Santa Cruz en 1991?", [["💨","Cubrieron pastizales matando ovejas por inanición, contaminaron aguadas y afectaron la salud de pobladores"],["🔥","Provocaron incendios forestales masivos en toda la estepa y derritieron los glaciares cordilleranos"],["🌊","Bloquearon el curso de los ríos patagónicos formando lagos artificiales de agua hirviendo salada"]], 0, "Pista: pensá en el impacto del polvo volcánico sobre los pastos y el ganado ovino."),
    q("¿Qué material rocoso fundido y muy caliente se encuentra en el interior de una cámara volcánica antes de salir a la superficie?", [["🌋","El magma"],["🪨","La lava fría"],["🧱","El cemento fundido"]], 0, "Pista: pensá en las propiedades de los materiales ante la temperatura."),
    q("¿Cómo se denomina a la roca fundida ardiente una vez que sale al exterior a través del cráter volcánico?", [["🔥","La lava volcánica"],["🪨","El mármol pulido"],["🌱","El humus orgánico"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cuáles son las tres grandes familias en las que se clasifican las rocas según su origen geológico?", [["🪨","Rocas ígneas, rocas sedimentarias y rocas metamórficas"],["🔴","Rocas duras, rocas blandas y rocas elásticas"],["🪵","Rocas vegetales, rocas animales y rocas plásticas"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Cómo se originan las rocas ígneas como el basalto negro que forma las mesetas de Santa Cruz?", [["🌋","Por el enfriamiento y solidificación del magma o de la lava volcánica"],["🍂","Por la acumulación y compresión de sedimentos arcillosos en el lecho"],["🪨","Por la transformación de minerales por extrema presión subterránea"]], 0, "Pista: pensá en el material fundido ardiente que sale de los volcanes."),
    q("¿Qué tipo de rocas suelen contener fósiles milenarios de dinosaurios y troncos petrificados en la Patagonia?", [["🦴","Las rocas sedimentarias formadas por capas superpuestas de sedimentos a lo largo de millones de años"],["🔥","La lava ardiente de una erupción reciente"],["🪙","Las barras de hierro forjado"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
    q("¿Qué parque nacional santacruceño protege un extraordinario bosque petrificado de araucarias fosilizadas hace 150 millones de años?", [["🪵","El Parque Nacional Bosques Petrificados de Jaramillo"],["🏙️","El Parque Central de Río Gallegos"],["🏖️","El balneario costero de Puerto Deseado"]], 0, "Pista: pensá en las zonas y paisajes típicos de nuestra geografía."),
    q("¿Por qué las placas tectónicas se mueven continuamente a lo largo de millones de años?", [["🔄","Por corrientes de convección térmica en el manto terrestre que empujan lentamente a las placas"],["💨","Porque la atracción lunar arrastra las rocas sólidas de la corteza"],["🌙","Porque el calor del magma licúa las rocas de la superficie"]], 0, "Pista: recordá los conceptos aprendidos en clase sobre este tema."),
  ],

};

// 4 pares creíbles de Verdadero/Falso por cada uno de los 26 mundos (AG-24)
export const TF_PAIRS_NATURALES: Record<number, { v: string; f: string; hint: string }[]> = {
  "1": [
    {
      "v": "La estepa patagónica ocupa la mayor parte del territorio santacruceño con clima frío, seco y ventoso.",
      "f": "La estepa patagónica está cubierta por densas selvas húmedas con lluvias diarias todo el año.",
      "hint": "Pista: pensá en las características del clima y la vegetación de nuestra meseta."
    },
    {
      "v": "El bosque andino se desarrolla en el oeste cordillerano donde las precipitaciones son más abundantes.",
      "f": "El bosque andino crece únicamente sobre las restingas y playas de la costa atlántica.",
      "hint": "Pista: recordá en qué sector provincial crecen los árboles de lenga y ñire."
    },
    {
      "v": "El litoral costero marítimo presenta acantilados, playas de canto rodado y restingas rocosas.",
      "f": "La costa marina santacruceña está formada enteramente por arrecifes de coral tropical.",
      "hint": "Pista: pensá en el paisaje rocoso del mar patagónico."
    },
    {
      "v": "Los ríos patagónicos conectan los glaciares andinos con el mar atravesando toda la estepa.",
      "f": "En Santa Cruz no existen cursos de agua que unan la cordillera con el océano Atlántico.",
      "hint": "Pista: recordá el recorrido de ríos como el Santa Cruz desde los lagos al mar."
    }
  ],
  "2": [
    {
      "v": "El coirón es una gramínea con hojas duras enrolladas que resisten la sequedad y los vientos fuertes.",
      "f": "El coirón es una planta de hojas tiernas y carnosas que solo crece sumergida en lagunas.",
      "hint": "Pista: pensá en las matas amarillas características que cubren la meseta."
    },
    {
      "v": "El calafate es un arbusto espinoso autóctono que florece en primavera y produce frutos oscuros comestibles.",
      "f": "El calafate es un árbol gigante sin espinas que solo crece en las copas de los bosques húmedos.",
      "hint": "Pista: recordá el arbusto patagónico célebre por sus bayas violáceas."
    },
    {
      "v": "La lenga es un árbol caducifolio que pierde sus hojas en otoño para tolerar las nevadas invernales.",
      "f": "La lenga mantiene hojas verdes brillantes todo el año y florece durante las nevadas de julio.",
      "hint": "Pista: pensá en los colores otoñales del bosque antes de la caída de las hojas."
    },
    {
      "v": "El neneo es una planta achaparrada en cojín que protege sus yemas cerca del suelo para frenar el viento.",
      "f": "El neneo es una enredadera que trepa varios metros sobre los troncos de los árboles.",
      "hint": "Pista: recordá la forma de media esfera compacta típica de las plantas de estepa."
    }
  ],
  "3": [
    {
      "v": "El guanaco es el herbívoro terrestre más grande y característico de la meseta santacruceña.",
      "f": "El guanaco es un carnívoro solitario que caza activamente de noche en las altas cumbres.",
      "hint": "Pista: pensá en la alimentación y hábitos del mamífero silvestre de la estepa."
    },
    {
      "v": "El choique es un ave corredora que no vuela pero alcanza gran velocidad con sus patas fuertes.",
      "f": "El choique es un ave marina que vuela miles de kilómetros sobre el mar sin tocar tierra.",
      "hint": "Pista: recordá cómo se desplaza el ñandú petiso patagónico en la llanura."
    },
    {
      "v": "El huemul es un ciervo autóctono adaptado al terreno escarpado del bosque andino patagónico.",
      "f": "El huemul habita exclusivamente en médanos arenosos de la costa marítima atlántica.",
      "hint": "Pista: pensá en qué ambiente montañoso y boscoso vive este ciervo amenazado."
    },
    {
      "v": "El piche patagónico posee una coraza de placas óseas y garras aptas para cavar madrigueras.",
      "f": "El piche patagónico vive permanentemente en las ramas de los árboles alimentándose de savia.",
      "hint": "Pista: recordá cómo se protege y refugia bajo tierra este pequeño armadillo."
    }
  ],
  "4": [
    {
      "v": "Los pelos huecos del pelaje del guanaco retienen aire tibio y actúan como aislante térmico.",
      "f": "El pelaje del guanaco es sumamente fino y carece de propiedades aislantes frente al frío.",
      "hint": "Pista: pensá en cómo mantiene su temperatura corporal un mamífero en la estepa."
    },
    {
      "v": "Los árboles bandera crecen inclinados en una dirección debido a la fuerza continua del viento.",
      "f": "Los árboles bandera crecen torcidos porque sus raíces buscan alejarse del agua subterránea.",
      "hint": "Pista: recordá el efecto modelador de las ráfagas constantes sobre las ramas."
    },
    {
      "v": "Muchas plantas de la estepa transforman sus hojas en espinas para evitar la pérdida de agua.",
      "f": "Las plantas de la meseta tienen hojas gigantes y delgadas que transpiran todo el tiempo.",
      "hint": "Pista: pensá en cómo evitan deshidratarse los vegetales en climas áridos."
    },
    {
      "v": "El pingüino de Magallanes tiene plumas tupidas y una gruesa capa de grasa subcutánea.",
      "f": "Los pingüinos carecen de grasa bajo la piel y dependen de nadar rápido para no congelarse.",
      "hint": "Pista: recordá los mecanismos de aislamiento que protegen a las aves marinas en aguas frías."
    }
  ],
  "5": [
    {
      "v": "Las plantas son organismos autótrofos capaces de producir su propio alimento por fotosíntesis.",
      "f": "Las plantas son seres heterótrofos que deben cazar otros organismos para alimentarse.",
      "hint": "Pista: recordá el proceso celular que utiliza luz solar, agua y dióxido de carbono."
    },
    {
      "v": "Los hongos carecen de clorofila y obtienen sus nutrientes absorbiendo materia orgánica del entorno.",
      "f": "Los hongos realizan fotosíntesis como las plantas y poseen hojas verdes en sus tallos.",
      "hint": "Pista: pensá en la diferencia fundamental entre los hongos y el reino vegetal."
    },
    {
      "v": "Las bacterias son microorganismos unicelulares que pueden observarse únicamente con microscopio.",
      "f": "Las bacterias son animales pluricelulares visibles a simple vista en el agua de los ríos.",
      "hint": "Pista: recordá la estructura celular sencilla de estos seres microscópicos."
    },
    {
      "v": "Los animales son organismos pluricelulares heterótrofos con capacidad de desplazamiento.",
      "f": "Los animales son seres unicelulares inmóviles que fabrican su alimento mediante clorofila.",
      "hint": "Pista: pensá en las características que definen a todos los integrantes del reino animal."
    }
  ],
  "6": [
    {
      "v": "En las redes tróficas los productores vegetales constituyen la base de la alimentación.",
      "f": "En los ecosistemas terrestres los carnívoros tope producen el alimento para las plantas.",
      "hint": "Pista: recordá qué seres vivos transforman la energía lumínica en materia orgánica."
    },
    {
      "v": "Los descomponedores degradan los restos de seres vivos transformándolos en nutrientes para el suelo.",
      "f": "Los descomponedores solo actúan en el agua salada y no existen en la tierra firme.",
      "hint": "Pista: pensá en el rol de hongos y bacterias al reciclar la materia orgánica."
    },
    {
      "v": "Un herbívoro como el guanaco es un consumidor primario porque se alimenta de productores.",
      "f": "Un herbívoro es un consumidor terciario porque caza otros animales para alimentarse.",
      "hint": "Pista: recordá qué eslabón ocupan los animales que comen plantas directamente."
    },
    {
      "v": "La energía en una cadena trófica fluye en una sola dirección desde el Sol hacia los consumidores.",
      "f": "La energía de la cadena trófica viaja en círculo cerrado regresando directamente al Sol.",
      "hint": "Pista: pensá en el camino que recorre la energía a medida que pasa de un ser a otro."
    }
  ],
  "7": [
    {
      "v": "El visón americano y el castor son especies exóticas introducidas que alteran los ecosistemas nativos.",
      "f": "El castor y el visón son animales originarios de Santa Cruz presentes desde hace millones de años.",
      "hint": "Pista: recordá de qué continentes fueron traídos estos mamíferos y los daños que causan."
    },
    {
      "v": "La creación de Parques Nacionales permite preservar ambientes naturales y proteger fauna en peligro.",
      "f": "En los Parques Nacionales el objetivo prioritario es permitir la tala y la caza comercial libre.",
      "hint": "Pista: pensá en la misión de conservación que tienen las áreas naturales protegidas."
    },
    {
      "v": "El plástico arrojado en el campo tarda cientos de años en degradarse y puede dañar a los animales.",
      "f": "Las botellas y bolsas plásticas se disuelven de forma natural en la tierra en pocas horas.",
      "hint": "Pista: recordá el tiempo de persistencia de los residuos sintéticos en la naturaleza."
    },
    {
      "v": "Los guardaparques controlan el ingreso de visitantes y realizan tareas de investigación y cuidado.",
      "f": "Los guardaparques trabajan exclusivamente en oficinas bancarias sin contacto con la naturaleza.",
      "hint": "Pista: pensá en las funciones de vigilancia y protección en el terreno de los parques."
    }
  ],
  "8": [
    {
      "v": "El esqueleto humano está formado por más de doscientos huesos que dan sostén al cuerpo.",
      "f": "El cuerpo humano contiene solo diez huesos largos conectados por cordones elásticos.",
      "hint": "Pista: recordá la cantidad aproximada de piezas óseas que integran el esqueleto adulto."
    },
    {
      "v": "El cráneo está compuesto por huesos planos unidos que protegen al cerebro de golpes.",
      "f": "El cráneo es un músculo blando y flexible que cambia de forma continuamente.",
      "hint": "Pista: pensá en la estructura ósea que resguarda el órgano principal del sistema nervioso."
    },
    {
      "v": "La caja torácica protege órganos vitales como el corazón y los pulmones.",
      "f": "Las costillas se ubican en las piernas y su función exclusiva es facilitar el salto.",
      "hint": "Pista: recordá qué cavidad del tronco encierran las costillas y el esternón."
    },
    {
      "v": "El fémur es el hueso más largo del cuerpo humano y se ubica en el muslo.",
      "f": "El fémur es el hueso más diminuto del cuerpo y se encuentra dentro del oído medio.",
      "hint": "Pista: pensá en el hueso principal de la extremidad inferior que soporta el peso corporal."
    }
  ],
  "9": [
    {
      "v": "Los tendones conectan los músculos con los huesos transmitiendo la fuerza de contracción.",
      "f": "Los tendones son huesos rígidos que impiden cualquier movimiento en los brazos.",
      "hint": "Pista: recordá qué estructura resistente une la masa muscular con la palanca ósea."
    },
    {
      "v": "La articulación del hombro es de tipo móvil esférica y permite girar el brazo en múltiples direcciones.",
      "f": "El hombro es una articulación fija e inmóvil soldada por completo sin movimiento alguno.",
      "hint": "Pista: pensá en los movimientos circulares que podés realizar con los brazos."
    },
    {
      "v": "Los músculos se contraen y relajan en parejas opuestas como el bíceps y el tríceps en el brazo.",
      "f": "Cuando el bíceps se contrae, el tríceps se contrae exactamente con la misma fuerza a la vez.",
      "hint": "Pista: recordá cómo trabajan los músculos antagonistas para flexionar y extender."
    },
    {
      "v": "Las articulaciones semimóviles de la columna tienen discos de cartílago que amortiguan impactos.",
      "f": "Entre las vértebras no existe ningún cartílago y los huesos chocan secos entre sí.",
      "hint": "Pista: pensá en los discos flexibles que separan cada una de las vértebras."
    }
  ],
  "10": [
    {
      "v": "Llevar la mochila escolar sobre ambos hombros distribuye el peso y cuida la columna vertebral.",
      "f": "Cargar una mochila pesada sobre un solo hombro mejora la postura y alinea la espalda.",
      "hint": "Pista: pensá en cómo influye la distribución pareja del peso al caminar a la escuela."
    },
    {
      "v": "Realizar calentamiento previo antes de hacer deportes ayuda a prevenir desgarros y lesiones.",
      "f": "Hacer actividad física intensa sin calentar los músculos fortalece de inmediato las articulaciones.",
      "hint": "Pista: recordá por qué es necesario preparar los músculos antes de un esfuerzo brusco."
    },
    {
      "v": "El consumo de lácteos y alimentos con calcio contribuye a fortalecer la densidad de los huesos.",
      "f": "El calcio es un mineral perjudicial que ablanda los huesos y desgasta las articulaciones.",
      "hint": "Pista: pensá en los nutrientes esenciales para el crecimiento y dureza ósea en la infancia."
    },
    {
      "v": "El descanso nocturno adecuado permite que los músculos se reparen y liberen hormonas de crecimiento.",
      "f": "Dormir pocas horas por noche hace que los huesos crezcan con mayor rapidez y fuerza.",
      "hint": "Pista: recordá la importancia del sueño en la recuperación física de los chicos."
    }
  ],
  "11": [
    {
      "v": "La madera, la lana y la arcilla son materiales naturales obtenidos directamente del medio.",
      "f": "La lana de oveja es un material sintético producido íntegramente en laboratorios químicos.",
      "hint": "Pista: pensá en los recursos que provienen de plantas, animales o de la tierra."
    },
    {
      "v": "Los plásticos son materiales manufacturados que se obtienen mediante transformación del petróleo.",
      "f": "El plástico se cosecha directamente de las ramas de ciertos arbustos de la meseta.",
      "hint": "Pista: recordá el origen petroquímico e industrial de los materiales plásticos."
    },
    {
      "v": "El vidrio se fabrica fundiendo arena de sílice con otros minerales a muy altas temperaturas.",
      "f": "El vidrio es una roca natural que se extrae en láminas transparentes de las montañas.",
      "hint": "Pista: pensá en el proceso industrial que transforma la arena en láminas transparentes."
    },
    {
      "v": "Los metales como el cobre y el hierro son buenos conductores del calor y la electricidad.",
      "f": "Los metales son aislantes térmicos perfectos que no conducen la corriente ni el calor.",
      "hint": "Pista: recordá qué materiales se utilizan en los cables eléctricos y en las ollas."
    }
  ],
  "12": [
    {
      "v": "El cobre y el aluminio son metales con alta capacidad para conducir el calor y la electricidad.",
      "f": "El cobre es un material aislante que bloquea completamente el paso de la corriente eléctrica.",
      "hint": "Pista: pensá en el metal brillante del interior de los cables de las casas."
    },
    {
      "v": "El telgopor, la madera y la lana son materiales aislantes térmicos que retienen el calor.",
      "f": "El telgopor transmite el calor de forma instantánea al igual que una plancha de acero caliente.",
      "hint": "Pista: recordá los materiales que se usan en las paredes o heladeritas para conservar temperatura."
    },
    {
      "v": "Las ventanas con doble vidrio hermético (DVH) dejan una cámara de aire que actúa como aislante.",
      "f": "Las ventanas con doble vidrio dejan escapar todo el calor hacia afuera el doble de rápido.",
      "hint": "Pista: pensá en el aire estanco entre los dos cristales y su efecto aislante."
    },
    {
      "v": "Los mangos de sartenes y ollas se fabrican con materiales aislantes para evitar quemaduras al cocinar.",
      "f": "Los mangos de las ollas se construyen en plata pura para que calienten al máximo la mano.",
      "hint": "Pista: recordá por qué usamos madera o plástico para agarrar recipientes calientes."
    }
  ],
  "13": [
    {
      "v": "En los sólidos las partículas están fuertemente unidas manteniendo forma y volumen propios.",
      "f": "En los sólidos las partículas se mueven libremente expandiéndose hasta ocupar toda la habitación.",
      "hint": "Pista: pensá en la rigidez y estructura ordenada de objetos duros como el hielo o la roca."
    },
    {
      "v": "Los líquidos tienen volumen definido pero adoptan la forma del recipiente que los contiene.",
      "f": "Los líquidos conservan siempre una forma cúbica fija sin importar dónde se los coloque.",
      "hint": "Pista: recordá qué sucede cuando vertés agua de una botella en un vaso redondo."
    },
    {
      "v": "Los gases no tienen forma ni volumen definidos y se expanden ocupando todo el espacio disponible.",
      "f": "Los gases son completamente rígidos e incompresibles al igual que los bloques de granito.",
      "hint": "Pista: pensá en el aire dentro de un globo o en el vapor que escapa de una pava."
    },
    {
      "v": "La materia puede cambiar de estado cuando gana o pierde calor en el ambiente natural.",
      "f": "Los estados de la materia son inmutables y ninguna sustancia puede pasar de sólido a líquido.",
      "hint": "Pista: recordá qué le ocurre al hielo cuando se lo deja al sol."
    }
  ],
  "14": [
    {
      "v": "La fusión ocurre cuando un sólido recibe calor y pasa a estado líquido como el hielo al derretirse.",
      "f": "La fusión es el paso de gas a sólido por enfriamiento brusco en el congelador.",
      "hint": "Pista: pensá en lo que sucede cuando calentamos chocolate o cera de vela."
    },
    {
      "v": "La solidificación es el cambio de líquido a sólido producido por la pérdida de calor.",
      "f": "La solidificación ocurre cuando calentamos agua líquida hasta que hierve sobre la hornalla.",
      "hint": "Pista: recordá qué cambio experimenta el agua en una cubetera dentro del freezer."
    },
    {
      "v": "La condensación transforma el vapor de agua invisible en gotitas líquidas al chocar con frío.",
      "f": "La condensación es el proceso por el cual el agua líquida desaparece para siempre de la Tierra.",
      "hint": "Pista: pensá en el empañamiento de los vidrios en una mañana fría de invierno."
    },
    {
      "v": "Los cambios de estado son reversibles porque la sustancia no cambia su composición química.",
      "f": "Cuando el agua se congela se convierte en una sustancia química distinta e irreversible.",
      "hint": "Pista: recordá que el agua sigue siendo agua ya sea en hielo, líquido o vapor."
    }
  ],
  "15": [
    {
      "v": "En una mezcla heterogénea como una ensalada o agua con arena se distinguen fases a simple vista.",
      "f": "En una mezcla heterogénea todos los componentes forman una sola fase completamente transparente.",
      "hint": "Pista: pensá en mezclas donde podés ver claramente los distintos ingredientes separados."
    },
    {
      "v": "En una solución homogénea como agua con sal el soluto se disuelve de manera uniforme en el solvente.",
      "f": "En una solución de agua con sal los cristales se van al fondo y nunca se disuelven en el líquido.",
      "hint": "Pista: recordá cómo queda el agua al disolver una cucharada de sal fina y revolver bien."
    },
    {
      "v": "El aire atmosférico es una mezcla homogénea gaseosa compuesta por nitrógeno, oxígeno y otros gases.",
      "f": "El aire que respiramos es un gas puro formado por una única molécula sin componentes mezclados.",
      "hint": "Pista: pensá en los distintos gases que conviven mezclados de forma invisible en la atmósfera."
    },
    {
      "v": "El agua dulce de ríos y lagos contiene sales minerales disueltas en proporciones naturales.",
      "f": "El agua de río es un mineral sólido puro sin ninguna sustancia líquida ni sales disueltas.",
      "hint": "Pista: recordá que el agua natural transporta minerales disueltos de las rocas."
    }
  ],
  "16": [
    {
      "v": "La tamización permite separar sólidos de diferente tamaño haciendo pasar la mezcla por una malla.",
      "f": "La tamización sirve exclusivamente para separar dos líquidos disueltos entre sí como agua y alcohol.",
      "hint": "Pista: pensá en el colador que usa un albañil para limpiar la arena de piedras grandes."
    },
    {
      "v": "La imantación permite separar elementos de hierro o acero utilizando la fuerza de un imán.",
      "f": "La imantación se utiliza para separar corchos flotantes de la superficie del agua.",
      "hint": "Pista: recordá qué materiales ferrosos son atraídos por el campo magnético."
    },
    {
      "v": "La filtración separa un sólido insoluble suspendido en un líquido haciendo pasar la mezcla por un filtro.",
      "f": "La filtración funde los metales pesados evaporando todos los componentes del recipiente.",
      "hint": "Pista: pensá en la preparación del café de filtro o en colar fideos en la cocina."
    },
    {
      "v": "La decantación aprovecha la diferencia de densidad dejando reposar la mezcla para que se asiente.",
      "f": "La decantación requiere agitar enérgicamente la mezcla sin permitir que repose en ningún momento.",
      "hint": "Pista: recordá qué pasa con la tierra en un vaso de agua turbia si se la deja quieta."
    }
  ],
  "17": [
    {
      "v": "La luz se propaga en línea recta en todas direcciones a través de medios transparentes homogéneos.",
      "f": "La luz viaja formando curvas circulares cerradas que giran alrededor de las esquinas solas.",
      "hint": "Pista: pensá en la trayectoria recta de un haz de linterna en una habitación oscura."
    },
    {
      "v": "El Sol y las estrellas son fuentes luminosas naturales que emiten luz propia por reacciones nucleares.",
      "f": "El Sol es una fuente artificial que funciona conectada a una red eléctrica subterránea.",
      "hint": "Pista: recordá la principal fuente de claridad natural de nuestro sistema planetario."
    },
    {
      "v": "Los objetos opacos bloquean el paso de la luz proyectando una sombra en el lado opuesto.",
      "f": "Los objetos opacos dejan pasar toda la luz sin proyectar ninguna sombra en el suelo.",
      "hint": "Pista: pensá en lo que sucede cuando te parás frente al sol en un día despejado."
    },
    {
      "v": "La Luna no emite luz propia sino que refleja en su superficie la luz que recibe del Sol.",
      "f": "La Luna es una estrella caliente que quema gases emitiendo brillo propio en la noche.",
      "hint": "Pista: recordá por qué vemos iluminado a nuestro satélite natural en el cielo nocturno."
    }
  ],
  "18": [
    {
      "v": "El sonido se origina por vibraciones de la materia y necesita un medio material para propagarse.",
      "f": "El sonido viaja a gran velocidad en el vacío del espacio interplanetario sin medio material.",
      "hint": "Pista: pensá en por qué el sonido no puede transmitirse donde no hay partículas de aire."
    },
    {
      "v": "El sonido viaja más rápido a través de sólidos rígidos como metales que a través del aire gaseoso.",
      "f": "El sonido viaja más despacio en el acero que en el aire porque los sólidos frenan toda onda.",
      "hint": "Pista: recordá la cercanía entre partículas en los sólidos que facilita la vibración."
    },
    {
      "v": "El eco se produce cuando las ondas sonoras rebotan contra una superficie rígida y regresan al emisor.",
      "f": "El eco es una ilusión mágica producida cuando dos personas hablan exactamente al mismo tiempo.",
      "hint": "Pista: pensá en lo que sucede al gritar frente a una pared de cañadón en la meseta."
    },
    {
      "v": "El tono de un sonido puede ser agudo o grave según la frecuencia de vibración de la fuente.",
      "f": "Todos los sonidos del universo tienen exactamente el mismo tono y vibran a la misma frecuencia.",
      "hint": "Pista: recordá la diferencia entre la voz fina de un pajarito y el bramido grave de un trueno."
    }
  ],
  "19": [
    {
      "v": "Todo imán posee dos polos magnéticos llamados polo norte y polo sur.",
      "f": "Los imanes tienen un solo polo magnético central que atrae a todos los materiales sin excepción.",
      "hint": "Pista: pensá en los dos extremos opuestos presentes en cualquier imán de barra."
    },
    {
      "v": "Los polos magnéticos de igual nombre se repelen y los polos de nombre opuesto se atraen entre sí.",
      "f": "Dos polos norte magnéticos se pegan fuertemente con una atracción indestructible.",
      "hint": "Pista: recordá la regla fundamental: polos iguales se rechazan, polos opuestos se atraen."
    },
    {
      "v": "El planeta Tierra actúa como un gigantesco imán con un campo magnético que orienta las brújulas.",
      "f": "La Tierra no posee ningún campo magnético y las brújulas giran empujadas por el viento.",
      "hint": "Pista: pensá en el núcleo metálico del planeta que genera atracción en la aguja imantada."
    },
    {
      "v": "Los imanes atraen a materiales ferromagnéticos como el hierro, el acero y el níquel.",
      "f": "Los imanes atraen con enorme fuerza a trozos de madera seca, plástico y vidrio plano.",
      "hint": "Pista: recordá qué metales específicos se pegan con facilidad a la puerta de la heladera."
    }
  ],
  "20": [
    {
      "v": "La electricidad estática se genera al frotar ciertos materiales transfiriendo cargas eléctricas.",
      "f": "La electricidad estática solo se produce en el interior de baterías químicas conectadas a cables.",
      "hint": "Pista: pensá en lo que ocurre al frotar una regla de plástico contra un suéter de lana."
    },
    {
      "v": "Cargas eléctricas de igual signo se repelen y cargas de distinto signo se atraen a distancia.",
      "f": "Dos cuerpos cargados positivamente se atraen con fuerza hasta fundirse en una sola pieza.",
      "hint": "Pista: recordá cómo interactúan cargas del mismo signo frente a cargas de signo contrario."
    },
    {
      "v": "Un rayo en una tormenta es una gigantesca descarga de electricidad estática en la atmósfera.",
      "f": "Un rayo es una corriente de agua hirviendo que cae a gran velocidad desde las nubes.",
      "hint": "Pista: pensá en la chispa luminosa colosal que equilibra las cargas entre nubes y tierra."
    },
    {
      "v": "En climas secos como el patagónico las cargas estáticas se acumulan con mayor facilidad.",
      "f": "En ambientes sumamente secos es imposible que los cuerpos adquieran cargas por fricción.",
      "hint": "Pista: recordá los pequeños chasquidos que sentimos al tocarnos en días secos y ventosos."
    }
  ],
  "21": [
    {
      "v": "El calor del Sol evapora el agua líquida de océanos y lagos iniciando el ciclo hidrológico.",
      "f": "El ciclo del agua comienza cuando el hielo se convierte directamente en magma volcánico.",
      "hint": "Pista: pensá en el motor térmico natural que eleva la humedad hacia la atmósfera."
    },
    {
      "v": "Las nubes se forman por la condensación del vapor de agua en minúsculas gotitas flotantes.",
      "f": "Las nubes están compuestas por humo sólido de fogatas que nunca cae a la superficie.",
      "hint": "Pista: recordá qué cambio de estado experimenta el vapor al enfriarse en las alturas."
    },
    {
      "v": "Los glaciares andinos actúan como reservorios naturales de agua dulce sólida que alimentan ríos.",
      "f": "Los glaciares están formados por agua salada congelada que contamina las cuencas de los ríos.",
      "hint": "Pista: pensá en la pureza del agua congelada que nutre nuestros grandes lagos cordilleranos."
    },
    {
      "v": "La cantidad total de agua en el planeta se mantiene constante circulando en un ciclo cerrado.",
      "f": "Cada día desaparece la mitad del agua del planeta siendo reemplazada por gases espaciales.",
      "hint": "Pista: recordá que el agua cambia de estado y de lugar sin crearse ni destruirse."
    }
  ],
  "22": [
    {
      "v": "La Tierra tiene forma geoide, achatada en los polos y con un ligero abultamiento ecuatorial.",
      "f": "La Tierra tiene forma de cono puntiagudo que gira sobre su vértice en el vacío.",
      "hint": "Pista: pensá en la forma esferoide casi redonda de nuestro planeta en el espacio."
    },
    {
      "v": "La gravedad terrestre es la fuerza que atrae a todos los cuerpos hacia el centro del planeta.",
      "f": "En la superficie de la Tierra los objetos flotan en el aire porque no existe ninguna atracción.",
      "hint": "Pista: recordá la fuerza invisible que hace que las cosas caigan hacia el suelo al soltarlas."
    },
    {
      "v": "En el hemisferio sur la fase de Cuarto Creciente se observa con forma de letra C en el cielo.",
      "f": "En el hemisferio sur la Luna llena tiene forma de línea recta vertical en la noche.",
      "hint": "Pista: recordá la regla de observación lunar: en el sur Creciente parece una C."
    },
    {
      "v": "La Luna gira alrededor de la Tierra completando una vuelta aproximadamente en veintiocho días.",
      "f": "La Luna da cien vueltas completas alrededor de la Tierra cada veinticuatro horas.",
      "hint": "Pista: pensá en la duración aproximada del mes lunar y sus cuatro fases principales."
    }
  ],
  "23": [
    {
      "v": "La rotación es el giro de la Tierra sobre su propio eje imaginario y dura veinticuatro horas.",
      "f": "La rotación es el viaje anual de la Tierra alrededor del Sol que dura trescientos sesenta y cinco días.",
      "hint": "Pista: pensá en el movimiento sobre sí mismo que determina el ritmo del día y la noche."
    },
    {
      "v": "La rotación de oeste a este hace que el Sol aparente salir por el este y ocultarse por el oeste.",
      "f": "La rotación terrestre ocurre de norte a sur haciendo que el Sol salga por la Antártida.",
      "hint": "Pista: recordá el sentido del giro terrestre y el movimiento aparente de los astros."
    },
    {
      "v": "La sucesión del día y la noche se origina porque la mitad iluminada por el Sol va cambiando con el giro.",
      "f": "El día y la noche existen porque el Sol se apaga durante doce horas consecutivas cada jornada.",
      "hint": "Pista: pensá en cómo se ilumina una pelota que gira frente a una lámpara fija."
    },
    {
      "v": "El eje de rotación terrestre pasa por el Polo Norte y el Polo Sur geográficos del planeta.",
      "f": "El eje de rotación de la Tierra cruza de lado a lado por el medio del océano Pacífico ecuatorial.",
      "hint": "Pista: recordá los dos puntos extremos del planeta por donde pasa la línea imaginaria de giro."
    }
  ],
  "24": [
    {
      "v": "La traslación es el desplazamiento de la Tierra en una órbita elíptica alrededor del Sol en un año.",
      "f": "La traslación es el giro que da la Luna alrededor de su propio eje en veinticuatro horas.",
      "hint": "Pista: pensá en el viaje anual que realiza nuestro planeta alrededor de la estrella central."
    },
    {
      "v": "Las estaciones del año se producen por la inclinación del eje terrestre combinada con la traslación.",
      "f": "Las estaciones ocurren porque en verano la Tierra viaja millones de kilómetros más cerca del Sol.",
      "hint": "Pista: recordá cómo la inclinación de 23,5° hace variar la incidencia de los rayos solares."
    },
    {
      "v": "En los solsticios de junio y diciembre se produce la máxima diferencia de duración entre día y noche.",
      "f": "En los solsticios el día y la noche duran exactamente doce horas en todos los puntos del planeta.",
      "hint": "Pista: pensá en el inicio astronómico del invierno o el verano con días muy cortos o largos."
    },
    {
      "v": "En los equinoccios de marzo y septiembre los rayos solares caen perpendiculares sobre el ecuador.",
      "f": "En los equinoccios la Tierra se detiene por completo en el espacio durante varias semanas.",
      "hint": "Pista: recordá la fecha en que el día y la noche tienen igual duración en todo el mundo."
    }
  ],
  "25": [
    {
      "v": "Los cuatro subsistemas terrestres son la geósfera, la hidrósfera, la atmósfera y la biósfera.",
      "f": "Los subsistemas terrestres están formados exclusivamente por metales líquidos sin rocas ni seres vivos.",
      "hint": "Pista: pensá en las esferas de tierra, agua, aire y vida que integran nuestro planeta."
    },
    {
      "v": "La corteza terrestre es la capa rocosa sólida más externa y delgada de la geósfera donde vivimos.",
      "f": "La corteza terrestre es una masa de gas caliente ubicada en el centro del núcleo del planeta.",
      "hint": "Pista: recordá la capa superficial sólida sobre la cual pisamos y construimos."
    },
    {
      "v": "La atmósfera provee el oxígeno para respirar y filtra radiaciones solares perjudiciales para la vida.",
      "f": "La atmósfera es un muro de cemento que impide que los rayos del sol lleguen al suelo.",
      "hint": "Pista: pensá en la capa gaseosa protectora que envuelve y resguarda a la Tierra."
    },
    {
      "v": "La biósfera interactúa permanentemente con los demás subsistemas intercambiando materia y energía.",
      "f": "Los seres vivos viven completamente aislados sin necesitar agua, aire ni suelo para subsistir.",
      "hint": "Pista: recordá la interdependencia entre las plantas, los animales, el agua y el aire."
    }
  ],
  "26": [
    {
      "v": "Los terremotos se originan por la liberación brusca de energía acumulada en fallas de placas tectónicas.",
      "f": "Los sismos se producen por ráfagas de viento frío que barren la superficie de los cañadones.",
      "hint": "Pista: pensá en los movimientos y fricciones de los bloques rocosos en el interior terrestre."
    },
    {
      "v": "El sismógrafo es el instrumento de precisión que detecta y grafica las ondas sísmicas de un terremoto.",
      "f": "El sismógrafo es un telescopio óptico utilizado exclusivamente para observar las lunas de Júpiter.",
      "hint": "Pista: recordá el aparato que registra en papel o pantalla los temblores del suelo."
    },
    {
      "v": "Los volcanes expulsan magma, gases y nubes de ceniza cuando entra en erupción la cámara magmática.",
      "f": "Los volcanes son depósitos artificiales de hielo que enfrían el interior de las montañas andinas.",
      "hint": "Pista: pensá en la salida de material fundido a altas temperaturas desde el manto terrestre."
    },
    {
      "v": "El Bosque Petrificado de Jaramillo conserva troncos fósiles mineralizados cubiertos por cenizas antiguas.",
      "f": "Los árboles del Bosque Petrificado fueron tallados en madera plástica hace diez años por turistas.",
      "hint": "Pista: recordá los árboles de millones de años que se transformaron en roca en nuestra provincia."
    }
  ]
};

export function getTfActivity(n: number, id: string, skills: string[]): ActivitySpec {
  const pool = TF_PAIRS_NATURALES[n] ?? TF_PAIRS_NATURALES[1];
  const item = pickOne(pool);
  return makeVF(id, item.v, item.f, item.hint, skills);
}

// Actividades extra por mundo (al menos 4 por mundo: 2 clasificar, 1 ordenar, 1 V/F)
export function getExtraNaturales(n: number): ActivitySpec[] {
  switch (n) {
    case 1:
      return [
        makeClassify("n1-ex-0", "Clasificá los seres vivos según su ambiente santacruceño característico:", ["Flora y Fauna de la Estepa","Fauna del Litoral Costero y Marino"], [{"label":"Mata de coirón y choique","cat":0},{"label":"Pingüino de Magallanes y lobo marino","cat":1},{"label":"Guanaco y arbusto de neneo","cat":0},{"label":"Tonina overa y cormorán imperial","cat":1}], "Pista: coirón y guanaco en la meseta; pingüinos y lobos marinos en la costa marina.", ["n4-ambientes-santacruz"]),
        makeOrder("n1-ex-1", "Ordená los tres grandes ambientes naturales de Santa Cruz de OESTE a ESTE:", ["Bosque andino cordillerano con lagos y glaciares","Estepa patagónica árida con mesetas y cañadones","Litoral marítimo con acantilados y rías"], "Pista: al oeste la cordillera boscosa, en el centro la meseta esteparia y al este la costa marina.", ["n4-ambientes-santacruz"]),
        makeClassify("n1-ex-2", "Clasificá los ambientes según la humedad de su clima:", ["Ambientes Húmedos de Montaña","Ambientes Áridos y Semidesérticos"], [{"label":"Bosques de lenga y valles cordilleranos","cat":0},{"label":"Mesetas abiertas con pastizal ralo","cat":1},{"label":"Glaciares y campos de hielo","cat":0},{"label":"Cañadones secos y pedregosos","cat":1}], "Pista: cordillera y glaciares reciben abundante humedad; mesetas y cañadones son secos.", ["n4-ambientes-santacruz"]),
        getTfActivity(1, "n1-ex-3", ["n4-ambientes-santacruz"]),
      ];
    case 2:
      return [
        makeClassify("n2-ex-0", "Clasificá las especies de la flora autóctona santacruceña según su ambiente:", ["Flora de la Estepa Patagónica","Flora del Bosque Andino"], [{"label":"Coirón en matas amarillas","cat":0},{"label":"Árboles de lenga y ñire","cat":1},{"label":"Arbusto de mata negra y neneo","cat":0},{"label":"Árbol de notro con flores rojas","cat":1}], "Pista: coirón, mata negra y neneo son de la estepa; lenga, ñire y notro son del bosque andino.", ["n4-flora-santacruz"]),
        makeOrder("n2-ex-1", "Ordená las etapas del ciclo estacional de la lenga en el bosque andino:", ["Brote de hojas verdes tiernas durante la primavera templada","Hojas teñidas de amarillo y rojo brillante en los meses de otoño","Caída total de hojas y reposo invernal para resistir las nevadas"], "Pista: brota verde en primavera, cambia a rojo en otoño y cae para reposar en invierno.", ["n4-flora-santacruz"]),
        makeClassify("n2-ex-2", "Clasificá las plantas nativas según su forma biológica:", ["Árboles Nativos de Gran Porte","Arbustos y Gramíneas Bajas"], [{"label":"Lenga y coihue del bosque andino","cat":0},{"label":"Mata de coirón espinoso","cat":1},{"label":"Ñire y notro cordillerano","cat":0},{"label":"Calafate y mata negra achaparrada","cat":1}], "Pista: lengas y coihues forman el dosel alto; coirón y calafate crecen cerca del suelo.", ["n4-flora-santacruz"]),
        getTfActivity(2, "n2-ex-3", ["n4-flora-santacruz"]),
      ];
    case 3:
      return [
        makeClassify("n3-ex-0", "Clasificá estos animales de la fauna nativa según su tipo de alimentación principal:", ["Herbívoros de la Fauna Autóctona","Carnívoros de la Fauna Autóctona"], [{"label":"Guanaco patagónico","cat":0},{"label":"Puma patagónico","cat":1},{"label":"Huemul andino","cat":0},{"label":"Zorro colorado","cat":1}], "Pista: guanaco y huemul comen plantas; puma y zorro colorado cazan presas.", ["n4-fauna-santacruz"]),
        makeOrder("n3-ex-1", "Ordená estos animales autóctonos de Santa Cruz según su tamaño corporal aproximado (de MAYOR a MENOR):", ["Guanaco adulto de la meseta","Choique o ñandú petiso","Piche patagónico acorazado"], "Pista: el guanaco es el mayor herbívoro nativo de la estepa patagónica, le sigue el choique y el piche es el más pequeño.", ["n4-fauna-santacruz"]),
        makeClassify("n3-ex-2", "Clasificá estos animales según su clase biológica:", ["Mamíferos Autóctonos","Aves Autóctonas"], [{"label":"Mara patagónica y huemul andino","cat":0},{"label":"Choique y macá tobiano","cat":1},{"label":"Piche y puma patagónico","cat":0},{"label":"Cóndor andino y cauquén","cat":1}], "Pista: maras y pumas son mamíferos con pelo; choiques y cóndores son aves con plumas.", ["n4-fauna-santacruz"]),
        getTfActivity(3, "n3-ex-3", ["n4-fauna-santacruz"]),
      ];
    case 4:
      return [
        makeClassify("n4-ex-0", "Clasificá las adaptaciones al frío y la aridez según correspondan a plantas o animales:", ["Adaptaciones de Plantas","Adaptaciones de Animales"], [{"label":"Crecimiento achaparrado en cojín","cat":0},{"label":"Capa gruesa de grasa subcutánea aislante","cat":1},{"label":"Hojas pequeñas transformadas en espinas","cat":0},{"label":"Pelos huecos que retienen aire tibio","cat":1}], "Pista: cojín y espinas son de plantas; grasa y pelos huecos son de animales.", ["n4-adaptaciones-frio"]),
        makeOrder("n4-ex-1", "Ordená el ciclo estacional de adaptación de un árbol de lenga frente al frío:", ["Brote de hojas verdes durante la primavera templada","Coloración rojiza y amarillenta de las hojas en otoño","Caída total del follaje y reposo invernal bajo la nieve"], "Pista: brote primaveral, follaje otoñal y reposo invernal sin hojas.", ["n4-adaptaciones-frio"]),
        makeClassify("n4-ex-2", "Clasificá las adaptaciones al viento patagónico:", ["Adaptaciones en la Vegetación","Adaptaciones en las Aves"], [{"label":"Ramas inclinadas en árboles bandera","cat":0},{"label":"Alas largas para planear con viento","cat":1},{"label":"Forma redondeada en cojines densos","cat":0},{"label":"Plumaje rígido y tupido impermeable","cat":1}], "Pista: ramas bandera y cojines son vegetales; planeo y plumas son de aves.", ["n4-adaptaciones-frio"]),
        getTfActivity(4, "n4-ex-3", ["n4-adaptaciones-frio"]),
      ];
    case 5:
      return [
        makeClassify("n5-ex-0", "Clasificá estos seres vivos en su reino correspondiente:", ["Reino Vegetal (Plantas)","Reino de los Hongos (Fungi)"], [{"label":"Mata de coirón de la estepa","cat":0},{"label":"Hongo llao-llao sobre la lenga","cat":1},{"label":"Arbusto de calafate con flores","cat":0},{"label":"Levadura que fermenta el pan","cat":1}], "Pista: coirón y calafate son plantas autótrofas; llao-llao y levaduras son hongos heterótrofos.", ["n4-cuatro-reinos"]),
        makeOrder("n5-ex-1", "Ordená estos seres vivos según su tamaño corporal aproximado (de MENOR a MAYOR):", ["Bacteria unicelular del suelo","Hongo de sombrero o llao-llao del bosque","Árbol de lenga adulto de veinte metros de altura"], "Pista: la bacteria es microscópica, el hongo es de tamaño mediano y la lenga es un gran árbol.", ["n4-cuatro-reinos"]),
        makeClassify("n5-ex-2", "Clasificá según su tipo de nutrición celular:", ["Organismos Autótrofos (Fotosíntesis)","Organismos Heterótrofos (Consumidores/Absorbentes)"], [{"label":"Pastos de coirón y lengas","cat":0},{"label":"Guanaco y puma patagónico","cat":1},{"label":"Fitoplancton marino fotosintético","cat":0},{"label":"Hongos descomponedores del suelo","cat":1}], "Pista: coirón y fitoplancton producen alimento; animales y hongos se nutren de otros.", ["n4-cuatro-reinos"]),
        getTfActivity(5, "n5-ex-3", ["n4-cuatro-reinos"]),
      ];
    case 6:
      return [
        makeClassify("n6-ex-0", "Clasificá estos seres vivos según su eslabón trófico en el ecosistema patagónico:", ["Productores Autótrofos","Consumidores Heterótrofos"], [{"label":"Mata de coirón y arbusto de calafate","cat":0},{"label":"Guanaco herbívoro y puma carnívoro","cat":1},{"label":"Fitoplancton marino fotosintético","cat":0},{"label":"Choique y pingüino de Magallanes","cat":1}], "Pista: coirón y fitoplancton producen alimento; guanaco, puma, choique y pingüino consumen.", ["n4-redes-troficas"]),
        makeOrder("n6-ex-1", "Ordená los eslabones de una cadena trófica de la estepa según el flujo de energía (de INICIAL a FINAL):", ["Planta de coirón que capta la luz del Sol (productor)","Guanaco que pasta las hojas tiernas (consumidor primario)","Puma que caza al guanaco en la meseta (consumidor secundario)"], "Pista: la energía viaja del productor vegetal al herbívoro y de este al depredador carnívoro.", ["n4-redes-troficas"]),
        makeClassify("n6-ex-2", "Clasificá según su dieta en la red alimentaria:", ["Consumidores Herbívoros","Consumidores Carnívoros y Carroñeros"], [{"label":"Guanaco y choique","cat":0},{"label":"Puma y zorro colorado","cat":1},{"label":"Mara y huemul andino","cat":0},{"label":"Cóndor andino carroñero","cat":1}], "Pista: guanaco y choique comen vegetales; puma, zorro y cóndor comen carne o restos.", ["n4-redes-troficas"]),
        getTfActivity(6, "n6-ex-3", ["n4-redes-troficas"]),
      ];
    case 7:
      return [
        makeClassify("n7-ex-0", "Clasificá las siguientes especies según su origen en los ecosistemas de Santa Cruz:", ["Especies Autóctonas (Nativas)","Especies Exóticas Invasoras"], [{"label":"Macá tobiano y huemul","cat":0},{"label":"Visón americano y castor canadiense","cat":1},{"label":"Coirón y calafate","cat":0},{"label":"Rosa mosqueta y trucha arcoíris","cat":1}], "Pista: macá tobiano, huemul y calafate son nativos; visón, castor, trucha y rosa mosqueta son exóticos.", ["n4-impacto-conservacion"]),
        makeOrder("n7-ex-1", "Ordená las acciones preventivas ante una visita escolar a un Parque Nacional:", ["Informarse sobre las normas y senderos habilitados en el centro de visitantes","Caminar respetando la huella sin cortar plantas ni molestar a los animales","Regresar con todos los residuos generados para depositarlos en el pueblo"], "Pista: primero informarse, luego recorrer con cuidado y al final retirar toda la basura.", ["n4-impacto-conservacion"]),
        makeClassify("n7-ex-2", "Clasificá las acciones del ser humano sobre el ambiente:", ["Acciones de Impacto Negativo","Acciones de Cuidado y Preservación"], [{"label":"Introducción de especies exóticas invasoras","cat":0},{"label":"Creación de Parques Nacionales y Reservas","cat":1},{"label":"Sobrepastoreo continuo sin rotación","cat":0},{"label":"Reciclado de plásticos y separación de basura","cat":1}], "Pista: exóticas y sobrepastoreo dañan; reservas y reciclaje cuidan.", ["n4-impacto-conservacion"]),
        getTfActivity(7, "n7-ex-3", ["n4-impacto-conservacion"]),
      ];
    case 8:
      return [
        makeClassify("n8-ex-0", "Clasificá los siguientes huesos del esqueleto humano según su forma:", ["Huesos Largos","Huesos Planos o Irregulares"], [{"label":"Fémur en el muslo","cat":0},{"label":"Húmero en el brazo","cat":0},{"label":"Vértebras de la columna","cat":1},{"label":"Huesos del cráneo y omóplato","cat":1}], "Pista: fémur y húmero son largos; vértebras son irregulares y cráneo/omóplato son planos.", ["n4-esqueleto-huesos"]),
        makeOrder("n8-ex-1", "Ordená estos sectores del esqueleto humano de ARRIBA hacia ABAJO en el cuerpo:", ["Huesos del cráneo y mandíbula","Caja torácica con costillas y esternón","Huesos de la pelvis y extremidades inferiores"], "Pista: el cráneo está arriba en la cabeza, el tórax en el medio y la pelvis y piernas abajo.", ["n4-esqueleto-huesos"]),
        makeClassify("n8-ex-2", "Clasificá los huesos según su función principal de protección:", ["Huesos Protectores de Órganos Vitales","Huesos de Locomoción y Sostén del Peso"], [{"label":"Cráneo que protege el cerebro","cat":0},{"label":"Fémur y tibia de la pierna","cat":1},{"label":"Costillas que encierran pulmones y corazón","cat":0},{"label":"Húmero y radio del brazo","cat":1}], "Pista: cráneo y costillas protegen órganos blandos; fémur y brazos sostienen y mueven.", ["n4-esqueleto-huesos"]),
        getTfActivity(8, "n8-ex-3", ["n4-esqueleto-huesos"]),
      ];
    case 9:
      return [
        makeClassify("n9-ex-0", "Clasificá las articulaciones según su grado de movilidad en el cuerpo humano:", ["Articulaciones Móviles (Sinoviales)","Articulaciones Fijas o Semimóviles"], [{"label":"Hombro y rodilla","cat":0},{"label":"Suturas entre huesos del cráneo","cat":1},{"label":"Codo y cadera","cat":0},{"label":"Discos cartilaginosos entre vértebras","cat":1}], "Pista: hombro, rodilla, codo y cadera son móviles; suturas del cráneo son fijas y vértebras semimóviles.", ["n4-articulaciones-musculos"]),
        makeOrder("n9-ex-1", "Ordená los pasos biológicos que permiten flexionar el brazo:", ["El cerebro emite un impulso nervioso voluntario","El músculo bíceps se contrae y acorta tirando del tendón","El antebrazo se flexiona acercando la mano hacia el hombro"], "Pista: primero la orden nerviosa, luego la contracción muscular y finalmente el movimiento óseo.", ["n4-articulaciones-musculos"]),
        makeClassify("n9-ex-2", "Clasificá las estructuras del aparato locomotor según su tejido:", ["Estructuras Óseas Rígidas","Tejidos Blandos y Conectores"], [{"label":"Costillas y vértebras","cat":0},{"label":"Tendones y ligamentos elásticos","cat":1},{"label":"Fémur y húmero","cat":0},{"label":"Músculos bíceps y tríceps","cat":1}], "Pista: costillas y fémur son huesos duros; tendones y músculos son tejidos blandos.", ["n4-articulaciones-musculos"]),
        getTfActivity(9, "n9-ex-3", ["n4-articulaciones-musculos"]),
      ];
    case 10:
      return [
        makeClassify("n10-ex-0", "Clasificá los hábitos frente a la salud del sistema locomotor:", ["Hábitos Saludables de Postura","Hábitos Perjudiciales para la Columna"], [{"label":"Cargar la mochila sobre ambos hombros","cat":0},{"label":"Llevar todo el peso sobre un solo hombro","cat":1},{"label":"Flexionar rodillas para levantar peso del suelo","cat":0},{"label":"Pasar muchas horas encorvado mirando pantallas","cat":1}], "Pista: mochila balanceada y flexionar rodillas cuidan; peso asimétrico y encorvarse dañan.", ["n4-cuidado-posturas"]),
        makeOrder("n10-ex-1", "Ordená los pasos correctos para levantar una caja pesada del suelo:", ["Acercarse a la caja y flexionar ambas rodillas manteniendo la espalda recta","Tomar firmemente la carga manteniéndola pegada al cuerpo","Incorporarse haciendo la fuerza principal con los músculos de las piernas"], "Pista: primero flexionar rodillas con espalda derecha, tomar la carga cerca y subir con fuerza de piernas.", ["n4-cuidado-posturas"]),
        makeClassify("n10-ex-2", "Clasificá las medidas de prevención deportiva:", ["Medidas de Protección y Seguridad","Acciones Imprudentes que Causan Lesiones"], [{"label":"Uso de casco homologado al andar en bicicleta","cat":0},{"label":"Entrenar intensamente sin calentar previamente","cat":1},{"label":"Calzado con suela antideslizante y buen soporte","cat":0},{"label":"Continuar jugando con dolor intenso o torcedura","cat":1}], "Pista: casco y zapatillas adecuadas protegen; falta de calentamiento o forzar lesiones dañan.", ["n4-cuidado-posturas"]),
        getTfActivity(10, "n10-ex-3", ["n4-cuidado-posturas"]),
      ];
    case 11:
      return [
        makeClassify("n11-ex-0", "Clasificá los siguientes materiales según su origen:", ["Materiales de Origen Natural","Materiales Manufacturados (Sintéticos)"], [{"label":"Madera de lenga y lana de oveja","cat":0},{"label":"Botellas de plástico de polietileno","cat":1},{"label":"Arcilla de cantera y cuero vacuno","cat":0},{"label":"Fibras sintéticas de poliéster y nylon","cat":1}], "Pista: madera, lana, arcilla y cuero son naturales; plásticos y poliéster son sintéticos.", ["n4-materiales-origen"]),
        makeOrder("n11-ex-1", "Ordená las fases de elaboración de un suéter de lana desde el campo hasta la prenda:", ["Esquila de la oveja en la estancia y clasificación del vellón","Lavado industrial, cardado e hilado de la fibra textil","Tejido de la prenda en telar o máquina y confección final"], "Pista: primero esquila, luego lavado e hilado, y finalmente tejido y confección.", ["n4-materiales-origen"]),
        makeClassify("n11-ex-1b", "Clasificá los materiales naturales según su reino o procedencia:", ["Materiales de Origen Vegetal o Animal","Materiales de Origen Mineral"], [{"label":"Madera de troncos y hojas de mimbre","cat":0},{"label":"Rocas de granito y arena de cuarzo","cat":1},{"label":"Lana esquilada y cuero vacuno","cat":0},{"label":"Mineral de hierro y cobre de cantera","cat":1}], "Pista: madera y lana son de plantas o animales; granito y hierro son minerales.", ["n4-materiales-origen"]),
        getTfActivity(11, "n11-ex-2", ["n4-materiales-origen"]),
      ];
    case 12:
      return [
        makeClassify("n12-ex-0", "Clasificá estos materiales según su capacidad de conducir el calor:", ["Buenos Conductores Térmicos (Metales)","Aislantes Térmicos"], [{"label":"Cobre de cables y aluminio de ollas","cat":0},{"label":"Telgopor con microburbujas de aire","cat":1},{"label":"Hierro y acero de herramientas","cat":0},{"label":"Madera seca y lana de oveja","cat":1}], "Pista: cobre, aluminio y hierro conducen el calor; telgopor, madera y lana lo aíslan.", ["n4-conduccion-termica"]),
        makeOrder("n12-ex-1", "Ordená estos materiales de MENOR a MAYOR capacidad de conducir el calor (de más aislante a más conductor):", ["Telgopor con burbujas de aire estancado","Madera de pino seca","Plancha maciza de cobre metálico"], "Pista: el telgopor es el más aislante, le sigue la madera y el cobre es excelente conductor.", ["n4-conduccion-termica"]),
        makeClassify("n12-ex-2", "Clasificá los elementos de cocina según su función térmica:", ["Elementos Conductores para Calentar","Elementos Aislantes para Manipular sin Quemarse"], [{"label":"Base metálica de sartenes y ollas","cat":0},{"label":"Mangos de baquelita o madera dura","cat":1},{"label":"Parrilla de hierro sobre el fuego","cat":0},{"label":"Agarraderas de tela gruesa acolchada","cat":1}], "Pista: bases y parrillas transmiten calor a la comida; mangos y agarraderas protegen las manos.", ["n4-conduccion-termica"]),
        getTfActivity(12, "n12-ex-3", ["n4-conduccion-termica"]),
      ];
    case 13:
      return [
        makeClassify("n13-ex-0", "Clasificá los estados de la materia según sus propiedades físicas:", ["Estado Sólido","Estado Gaseoso"], [{"label":"Forma propia fija y volumen constante","cat":0},{"label":"Se expande ocupando todo el recipiente","cat":1},{"label":"Partículas muy ordenadas y fuertemente unidas","cat":0},{"label":"Partículas muy separadas que se mueven al azar","cat":1}], "Pista: forma fija y partículas ordenadas en sólidos; expansión y partículas libres en gases.", ["n4-estados-materia"]),
        makeOrder("n13-ex-1", "Ordená los estados de la materia según la SEPARACIÓN entre sus partículas (de MENOR a MAYOR separación):", ["Estado sólido con partículas empaquetadas fijas","Estado líquido con partículas que se deslizan juntas","Estado gaseoso con partículas muy distantes libres"], "Pista: en sólidos están muy unidas, en líquidos intermedias y en gases totalmente separadas.", ["n4-estados-materia"]),
        makeClassify("n13-ex-2", "Clasificá estos ejemplos cotidianos según su estado de agregación:", ["Estado Líquido","Estado Gaseoso"], [{"label":"Agua mineral y aceite de cocina","cat":0},{"label":"Vapor que sale de la pava hirviendo","cat":1},{"label":"Jugo de naranja en el vaso","cat":0},{"label":"Aire atmosférico dentro de un globo","cat":1}], "Pista: agua y aceite son líquidos que fluyen; vapor y aire son gases que se expanden.", ["n4-estados-materia"]),
        getTfActivity(13, "n13-ex-3", ["n4-estados-materia"]),
      ];
    case 14:
      return [
        makeClassify("n14-ex-0", "Clasificá los cambios de estado según requieran GANANCIA o PÉRDIDA de calor:", ["Cambios por Ganancia de Calor (Calentamiento)","Cambios por Pérdida de Calor (Enfriamiento)"], [{"label":"Fusión del hielo a agua líquida","cat":0},{"label":"Solidificación del agua formando hielo","cat":1},{"label":"Evaporación del agua formando vapor","cat":0},{"label":"Condensación del vapor en gotitas de agua","cat":1}], "Pista: fusión y evaporación necesitan calor; solidificación y condensación necesitan frío.", ["n4-cambios-estado"]),
        makeOrder("n14-ex-1", "Ordená las etapas del ciclo de cambios del agua en una pava sobre el fuego:", ["Agua líquida fría colocada en la pava","Ebullición a 100 °C con desprendimiento de vapor de agua","Condensación del vapor en gotitas sobre una tapa fría colocada encima"], "Pista: líquido frío, ebullición a 100 °C con vapor y condensación de gotitas sobre superficie fría.", ["n4-cambios-estado"]),
        makeClassify("n14-ex-2", "Clasificá los siguientes fenómenos según el cambio de estado que representan:", ["Fenómenos de Evaporación","Fenómenos de Condensación"], [{"label":"Ropa húmeda secándose al viento patagónico","cat":0},{"label":"Vidrios empañados en el auto por dentro","cat":1},{"label":"Charcos de lluvia que se secan con el sol","cat":0},{"label":"Gotas de rocío matinal sobre los pastos","cat":1}], "Pista: secar ropa y charcos es evaporar agua; empañar vidrios y rocío es condensar vapor.", ["n4-cambios-estado"]),
        getTfActivity(14, "n14-ex-3", ["n4-cambios-estado"]),
      ];
    case 15:
      return [
        makeClassify("n15-ex-0", "Clasificá los siguientes sistemas materiales según su aspecto:", ["Mezclas Homogéneas (Una Sola Fase)","Mezclas Heterogéneas (Dos o Más Fases)"], [{"label":"Taza de té con azúcar completamente disuelta","cat":0},{"label":"Agua con arena de playa depositada al fondo","cat":1},{"label":"Salmuera transparente de agua con sal","cat":0},{"label":"Ensalada de lechuga, tomate y zanahoria","cat":1}], "Pista: té con azúcar y salmuera tienen una fase uniforme; agua con arena y ensalada tienen fases visibles.", ["n4-mezclas-soluciones"]),
        makeOrder("n15-ex-1", "Ordená los pasos para preparar una solución homogénea de agua con azúcar:", ["Colocar agua pura en un vaso transparente","Agregar una cucharada pequeña de azúcar sólida","Revolver con cuchara hasta que los cristales se disuelvan por completo"], "Pista: primero servir el agua, luego agregar el azúcar y finalmente mezclar hasta disolver.", ["n4-mezclas-soluciones"]),
        makeClassify("n15-ex-2", "Clasificá las mezclas heterogéneas según el estado de sus componentes:", ["Sólido Mezclado con Líquido","Líquido Mezclado con Líquido"], [{"label":"Fideos cocidos flotando en la olla de agua","cat":0},{"label":"Aceite flotando sobre agua en una botella","cat":1},{"label":"Tierra suspendida en agua turbia de río","cat":0},{"label":"Vinagre y aceite en una vinagrera","cat":1}], "Pista: fideos y tierra son sólidos en líquido; aceite y vinagre son dos líquidos inmiscibles.", ["n4-mezclas-soluciones"]),
        getTfActivity(15, "n15-ex-3", ["n4-mezclas-soluciones"]),
      ];
    case 16:
      return [
        makeClassify("n16-ex-0", "Clasificá las mezclas según el método adecuado para separarlas:", ["Separación por Filtración","Separación por Imantación"], [{"label":"Café molido del líquido caliente en el filtro","cat":0},{"label":"Alfileres de acero caídos en un cajón con harina","cat":1},{"label":"Arena insoluble suspendida en agua de río","cat":0},{"label":"Limaduras de hierro mezcladas con arena seca","cat":1}], "Pista: filtros separan sólidos de líquidos; imanes atraen partículas de hierro y acero.", ["n4-separacion-mezclas"]),
        makeOrder("n16-ex-1", "Ordená los pasos para separar una mezcla de arena y limaduras de hierro:", ["Extender la mezcla seca sobre una hoja de papel blanco","Pasar un imán potente protegido con una bolsa por encima de la mezcla","Retirar el imán con las limaduras adheridas dejando la arena limpia"], "Pista: extender sobre papel, pasar el imán por arriba y separar el hierro de la arena.", ["n4-separacion-mezclas"]),
        makeClassify("n16-ex-2", "Clasificá las técnicas de separación según la propiedad física que aprovechan:", ["Aprovechan Diferencia de Tamaño de Partículas","Aprovechan Diferencia de Densidad"], [{"label":"Tamizado de arena gruesa con alambre","cat":0},{"label":"Decantación de agua turbia en reposo","cat":1},{"label":"Colado de fideos con un colador perforado","cat":0},{"label":"Separación de corchos flotantes en agua","cat":1}], "Pista: tamiz y colador usan el tamaño; decantar y flotar usan la densidad del material.", ["n4-separacion-mezclas"]),
        getTfActivity(16, "n16-ex-3", ["n4-separacion-mezclas"]),
      ];
    case 17:
      return [
        makeClassify("n17-ex-0", "Clasificá los cuerpos según su comportamiento ante el paso de la luz:", ["Cuerpos Transparentes o Translúcidos","Cuerpos Opacos"], [{"label":"Vidrio limpio de una ventana luminosa","cat":0},{"label":"Pared de ladrillos macizos revocada","cat":1},{"label":"Papel manteca vegetal semitransparente","cat":0},{"label":"Chapa metálica que proyecta sombra oscura","cat":1}], "Pista: vidrios y papel manteca dejan pasar luz; ladrillos y chapas la bloquean proyectando sombra.", ["n4-luz-fuentes"]),
        makeOrder("n17-ex-1", "Ordená la longitud de la sombra de un poste de luz a lo largo del día (de MENOR a MAYOR longitud):", ["Sombra muy corta al mediodía con el Sol en su punto más alto","Sombra intermedia a media mañana o media tarde","Sombra muy alargada en el atardecer con el Sol casi en el horizonte"], "Pista: al mediodía la sombra es mínima, a la tarde media y en el atardecer máxima.", ["n4-luz-fuentes"]),
        makeClassify("n17-ex-2", "Clasificá las fuentes luminosas según su origen:", ["Fuentes Luminosas Naturales","Fuentes Luminosas Artificiales"], [{"label":"El Sol y las estrellas lejanas","cat":0},{"label":"Lámpara eléctrica de filamento o LED","cat":1},{"label":"El destello de una luciérnaga en la noche","cat":0},{"label":"Una vela encendida con fósforo","cat":1}], "Pista: Sol, estrellas y luciérnagas son naturales; lámparas y velas son artefactos humanos.", ["n4-luz-fuentes"]),
        getTfActivity(17, "n17-ex-3", ["n4-luz-fuentes"]),
      ];
    case 18:
      return [
        makeClassify("n18-ex-0", "Clasificá las características de los sonidos según sus cualidades:", ["Cualidad de Tono (Frecuencia)","Cualidad de Intensidad (Volumen)"], [{"label":"Sonido agudo como silbido de pájaro","cat":0},{"label":"Sonido fuerte como un trueno cercano","cat":1},{"label":"Sonido grave como el rugido de un león","cat":0},{"label":"Sonido suave como un susurro al oído","cat":1}], "Pista: agudo y grave definen el tono; fuerte y suave definen el volumen o intensidad.", ["n4-sonido-vibraciones"]),
        makeOrder("n18-ex-1", "Ordená los medios materiales según la velocidad con que el sonido se propaga en ellos (de MENOR a MAYOR velocidad):", ["El aire gaseoso a temperatura ambiente","El agua líquida en un lago profundo","Una barra rígida de acero metálico"], "Pista: en gases viaja más lento (340 m/s), en líquidos más rápido (1500 m/s) y en sólidos a máxima velocidad (5000 m/s).", ["n4-sonido-vibraciones"]),
        makeClassify("n18-ex-2", "Clasificá los fenómenos sonoros cotidianos:", ["Sonidos Deseables o Comunicativos","Contaminación Acústica y Ruido"], [{"label":"Música suave de instrumentos de cuerda","cat":0},{"label":"Bocinas constantes de autos en embotellamiento","cat":1},{"label":"La voz humana al conversar tranquilamente","cat":0},{"label":"Martillo neumático rompiendo pavimento","cat":1}], "Pista: música y conversación comunican; bocinas y martillos neumáticos generan ruido dañino.", ["n4-sonido-vibraciones"]),
        getTfActivity(18, "n18-ex-3", ["n4-sonido-vibraciones"]),
      ];
    case 19:
      return [
        makeClassify("n19-ex-0", "Clasificá estos materiales según sean atraídos o no por un imán común:", ["Materiales Atraídos por el Imán (Magnéticos)","Materiales No Atraídos por el Imán"], [{"label":"Clavo de hierro y alfiler de acero","cat":0},{"label":"Borrador de goma y regla de plástico","cat":1},{"label":"Tornillo de níquel","cat":0},{"label":"Moneda de cobre puro y trozo de madera","cat":1}], "Pista: hierro, acero y níquel son magnéticos; goma, plástico, cobre y madera no lo son.", ["n4-magnetismo-imanes"]),
        makeOrder("n19-ex-1", "Ordená las acciones para orientarte en el campo con una brújula magnética:", ["Colocar la brújula sobre una superficie horizontal lejos de objetos de hierro","Esperar que la aguja imantada oscile y se detenga señalando el Norte","Girar la base para hacer coincidir la letra N con la punta imantada"], "Pista: primero apoyar horizontal, luego dejar estabilizar la aguja y finalmente alinear la rosa de vientos.", ["n4-magnetismo-imanes"]),
        makeClassify("n19-ex-2", "Clasificá las interacciones entre polos magnéticos:", ["Fuerza de Atracción (Se Juntan)","Fuerza de Repulsión (Se Rechazan)"], [{"label":"Polo norte con polo sur magnético","cat":0},{"label":"Dos polos norte enfrentados directamente","cat":1},{"label":"Polo magnético y un clavo de hierro neutro","cat":0},{"label":"Dos polos sur enfrentados entre sí","cat":1}], "Pista: polos opuestos o hierro neutro se atraen; polos del mismo nombre se repelen.", ["n4-magnetismo-imanes"]),
        getTfActivity(19, "n19-ex-3", ["n4-magnetismo-imanes"]),
      ];
    case 20:
      return [
        makeClassify("n20-ex-0", "Clasificá las siguientes interacciones electrostáticas según su resultado:", ["Fuerza Atractiva (Se Acercan)","Fuerza Repulsiva (Se Separan)"], [{"label":"Carga positiva con carga negativa","cat":0},{"label":"Dos cargas positivas entre sí","cat":1},{"label":"Regla plástica cargada y papelitos neutros","cat":0},{"label":"Dos globos con carga del mismo signo","cat":1}], "Pista: cargas opuestas o cuerpos neutros se atraen; cargas del mismo signo se repelen.", ["n4-electrostatica-fuerzas"]),
        makeOrder("n20-ex-1", "Ordená los pasos del experimento de atracción electrostática con papelitos:", ["Cortar pequeños trozos de papel fino sobre una mesa seca","Frotar enérgicamente una regla plástica contra un suéter de lana","Acercar la regla a los papelitos observando cómo saltan y se adhieren a ella"], "Pista: primero preparar papelitos, luego frotar la regla para cargarla y acercarla.", ["n4-electrostatica-fuerzas"]),
        makeClassify("n20-ex-2", "Clasificá los fenómenos electrostáticos según su escala:", ["Fenómenos Cotidianos a Pequeña Escala","Fenómenos Atmosféricos a Gran Escala"], [{"label":"Pelos que se erizan al frotar un globo","cat":0},{"label":"Rayo descomunal entre nubes y tierra","cat":1},{"label":"Pequeño chasquido al tocar la manija del auto","cat":0},{"label":"Relámpago que ilumina el cielo en tormenta","cat":1}], "Pista: globos y manijas de autos son cotidianos; rayos y relámpagos son tormentas colosales.", ["n4-electrostatica-fuerzas"]),
        getTfActivity(20, "n20-ex-3", ["n4-electrostatica-fuerzas"]),
      ];
    case 21:
      return [
        makeClassify("n21-ex-0", "Clasificá las reservas de agua en Santa Cruz según su tipo de almacenamiento:", ["Reservas de Agua Dulce Superficial","Reservas de Agua Dulce Subterránea"], [{"label":"Glaciares Perito Moreno y Upsala","cat":0},{"label":"Napas y acuíferos bajo la meseta","cat":1},{"label":"Lago Argentino y lago Viedma","cat":0},{"label":"Pozos de captación en napas profundas","cat":1}], "Pista: glaciares y lagos están en superficie; napas y pozos son subterráneos.", ["n4-ciclo-agua-glaciares"]),
        makeOrder("n21-ex-1", "Ordená las fases principales del ciclo del agua en la naturaleza:", ["Evaporación del agua superficial por acción del calor solar","Condensación del vapor en las alturas formando nubes","Precipitación en forma de lluvia o nieve sobre la cordillera y meseta","Escurrimiento por ríos e infiltración hacia napas regresando al océano"], "Pista: primero se evapora, luego se condensa en nubes, precipita y escurre de nuevo al mar.", ["n4-ciclo-agua-glaciares"]),
        makeClassify("n21-ex-2", "Clasificá los componentes del ciclo hidrológico según su estado físico:", ["Agua en Estado Sólido","Agua en Estado Líquido"], [{"label":"Nieve acumulada en las cumbres andinas","cat":0},{"label":"Corriente del río Santa Cruz en la meseta","cat":1},{"label":"Hielo milenario de los glaciares","cat":0},{"label":"Gotas de lluvia que caen sobre los campos","cat":1}], "Pista: nieve y glaciares son sólidos; ríos y lluvias son líquidos.", ["n4-ciclo-agua-glaciares"]),
        getTfActivity(21, "n21-ex-3", ["n4-ciclo-agua-glaciares"]),
      ];
    case 22:
      return [
        makeClassify("n22-ex-0", "Clasificá las fases lunares en el Hemisferio Sur según la letra a la que se asemejan en el cielo:", ["Forma de letra C (Hemisferio Sur)","Forma de letra D (Hemisferio Sur)"], [{"label":"Cuarto Creciente austral","cat":0},{"label":"Cuarto Menguante austral","cat":1},{"label":"Luna que va aumentando su luz","cat":0},{"label":"Luna que va disminuyendo su luz","cat":1}], "Pista: en el hemisferio sur Creciente tiene forma de C y Menguante tiene forma de D.", ["n4-tierra-cuerpo-cosmico"]),
        makeOrder("n22-ex-1", "Ordená estos tres cuerpos celestes de MENOR a MAYOR tamaño real:", ["La Luna, satélite natural de la Tierra","El planeta Tierra, nuestro hogar","El Sol, estrella central del sistema solar"], "Pista: la Luna es el cuerpo más pequeño, la Tierra es intermedia y el Sol es inmensamente más grande.", ["n4-tierra-cuerpo-cosmico"]),
        makeClassify("n22-ex-2", "Clasificá los astros según emitan luz propia o reflejada:", ["Astros con Luz Propia (Estrellas)","Astros con Luz Reflejada"], [{"label":"El Sol en el centro del sistema planetario","cat":0},{"label":"La Luna vista desde la Tierra","cat":1},{"label":"Estrellas lejanas de la Cruz del Sur","cat":0},{"label":"El planeta Tierra visto desde el espacio","cat":1}], "Pista: el Sol y las estrellas emiten luz; la Luna y la Tierra reflejan la luz solar.", ["n4-tierra-cuerpo-cosmico"]),
        getTfActivity(22, "n22-ex-3", ["n4-tierra-cuerpo-cosmico"]),
      ];
    case 23:
      return [
        makeClassify("n23-ex-0", "Clasificá las características según correspondan a la rotación terrestre:", ["Características de la Rotación Terrestre","Efectos Provocados por la Rotación"], [{"label":"Giro sobre su propio eje imaginario de oeste a este","cat":0},{"label":"Sucesión periódica del día y de la noche","cat":1},{"label":"Duración de 24 horas completas","cat":0},{"label":"Movimiento aparente del Sol saliendo por el este","cat":1}], "Pista: giro sobre eje y 24 horas son rasgos; día/noche y salida del Sol son consecuencias.", ["n4-movimiento-rotacion"]),
        makeOrder("n23-ex-1", "Ordená la secuencia periódica diaria originada por la rotación de la Tierra:", ["Amanecer con el Sol asomando por el horizonte este","Mediodía con el Sol en su punto más alto del cielo","Atardecer con el Sol ocultándose por el horizonte oeste","Noche con oscuridad y cielo estrellado"], "Pista: amanecer por el este, mediodía en lo alto, atardecer por el oeste y noche oscura.", ["n4-movimiento-rotacion"]),
        makeClassify("n23-ex-2", "Clasificá las horas según la presencia de luz natural en Santa Cruz:", ["Horas Diurnas (Con Luz Solar)","Horas Nocturnas (Oscuridad)"], [{"label":"Mediodía y media tarde","cat":0},{"label":"Medianoche y madrugada cerrada","cat":1},{"label":"Primeras horas tras el amanecer","cat":0},{"label":"Horas posteriores a la puesta del Sol","cat":1}], "Pista: mañana y mediodía hay sol; medianoche y madrugada es noche oscura.", ["n4-movimiento-rotacion"]),
        getTfActivity(23, "n23-ex-3", ["n4-movimiento-rotacion"]),
      ];
    case 24:
      return [
        makeClassify("n24-ex-0", "Clasificá los fenómenos astronómicos según el movimiento terrestre que los origina:", ["Consecuencias de la Traslación Anual","Consecuencias de la Rotación Diaria"], [{"label":"Las cuatro estaciones del año","cat":0},{"label":"El ciclo diario de 24 horas de día y noche","cat":1},{"label":"Solsticios de verano e invierno","cat":0},{"label":"Salida y puesta del Sol en el horizonte","cat":1}], "Pista: estaciones y solsticios son traslación anual; día/noche y salida del Sol son rotación diaria.", ["n4-movimiento-traslacion"]),
        makeOrder("n24-ex-1", "Ordená las cuatro estaciones del año en el Hemisferio Sur a partir del inicio del año:", ["Verano con días largos y temperaturas templadas","Otoño con días más cortos y caída de hojas","Invierno con frío riguroso, heladas y nieve","Primavera con brotes nuevos y deshielos andinos"], "Pista: verano de enero a marzo, otoño hasta junio, invierno hasta septiembre y primavera a diciembre.", ["n4-movimiento-traslacion"]),
        makeClassify("n24-ex-2", "Clasificá los momentos astronómicos según la época del año:", ["Solsticios (Diferencia Extrema Día/Noche)","Equinoccios (Igual Duración Día y Noche)"], [{"label":"Solsticio de verano en diciembre","cat":0},{"label":"Equinoccio de otoño en marzo","cat":1},{"label":"Solsticio de invierno en junio","cat":0},{"label":"Equinoccio de primavera en septiembre","cat":1}], "Pista: diciembre y junio son solsticios extremos; marzo y septiembre son equinoccios iguales.", ["n4-movimiento-traslacion"]),
        getTfActivity(24, "n24-ex-3", ["n4-movimiento-traslacion"]),
      ];
    case 25:
      return [
        makeClassify("n25-ex-0", "Clasificá los siguientes componentes en su subsistema terrestre correspondiente:", ["Geósfera (Rocas y Suelo)","Atmósfera (Capa Gaseosa)"], [{"label":"Corteza sólida, manto y rocas basálticas","cat":0},{"label":"Oxígeno y nitrógeno del aire que respiramos","cat":1},{"label":"Suelo pedregoso de la meseta","cat":0},{"label":"Capa de ozono que filtra rayos ultravioletas","cat":1}], "Pista: rocas y suelo son geósfera; oxígeno, nitrógeno y ozono son atmósfera.", ["n4-subsistemas-terrestres"]),
        makeOrder("n25-ex-1", "Ordená las capas internas y externas de la Tierra desde el CENTRO hacia el EXTERIOR del planeta:", ["Núcleo metálico central de altísima temperatura","Manto terrestre de roca densa","Corteza sólida superficial donde habitamos","Atmósfera gaseosa que envuelve el planeta"], "Pista: núcleo en el centro, manto intermedio, corteza superficial y atmósfera en el exterior.", ["n4-subsistemas-terrestres"]),
        makeClassify("n25-ex-2", "Clasificá estos elementos de la naturaleza santacruceña en su esfera terrestre:", ["Hidrósfera (Masa de Agua)","Biósfera (Seres Vivos)"], [{"label":"Glaciares cordilleranos y lagos patagónicos","cat":0},{"label":"Bosques de lenga y majadas de guanacos","cat":1},{"label":"Río Santa Cruz y mar Argentino","cat":0},{"label":"Comunidades de aves marinas y pingüinos","cat":1}], "Pista: glaciares, lagos y ríos son hidrósfera; árboles, guanacos y pingüinos son biósfera.", ["n4-subsistemas-terrestres"]),
        getTfActivity(25, "n25-ex-3", ["n4-subsistemas-terrestres"]),
      ];
    case 26:
      return [
        makeClassify("n26-ex-0", "Clasificá los fenómenos geológicos según su naturaleza:", ["Procesos Volcánicos","Procesos Sísmicos (Terremotos)"], [{"label":"Expulsión de lava, cenizas y gases ardientes","cat":0},{"label":"Fractura y fricción brusca de placas tectónicas","cat":1},{"label":"Formación de conos volcánicos y cráteres","cat":0},{"label":"Propagación de ondas sísmicas desde el hipocentro","cat":1}], "Pista: lava y cráteres son volcanes; placas tectónicas y ondas sísmicas son terremotos.", ["n4-geosfera-procesos"]),
        makeOrder("n26-ex-1", "Ordená las fases de un evento sísmico desde su origen en el interior hasta la superficie:", ["Acumulación de tensiones mecánicas en una falla geológica profunda","Ruptura súbita de la roca en el hipocentro liberando energía","Llegada de las ondas sísmicas al epicentro en la superficie terrestre","Registro de las vibraciones en sismógrafos de estaciones de monitoreo"], "Pista: tensión en la falla, ruptura en hipocentro, llegada al epicentro y registro en sismógrafo.", ["n4-geosfera-procesos"]),
        makeClassify("n26-ex-2", "Clasificá las huellas geológicas del pasado en Santa Cruz:", ["Fósiles del Bosque Petrificado","Estructuras Volcánicas Antiguas"], [{"label":"Troncos mineralizados de araucarias antiguas","cat":0},{"label":"Mesetas basálticas formadas por coladas de lava","cat":1},{"label":"Piñas fosilizadas conservadas en roca","cat":0},{"label":"Conos volcánicos apagados en la estepa","cat":1}], "Pista: troncos y piñas mineralizadas son fósiles; mesetas basálticas y conos son volcánicos.", ["n4-geosfera-procesos"]),
        getTfActivity(26, "n26-ex-3", ["n4-geosfera-procesos"]),
      ];
    default:
      return [];
  }
}

// Compatibilidad hacia atrás: proxy que genera actividades frescas en cada acceso
export const EXTRA_NATURALES: Record<number, ActivitySpec[]> = new Proxy({}, {
  get: (_target, prop) => {
    const n = Number(prop);
    if (!Number.isNaN(n) && n >= 1 && n <= 26) {
      return getExtraNaturales(n);
    }
    return undefined;
  },
});

export function buildNaturalesActivities(world: WorldDef): ActivitySpec[] {
  const n = world.worldNumber ?? 1;
  const count = world.activityCount ?? 8;
  const bank = NATURALES_BANK[n] ?? NATURALES_BANK[1];
  // 6 preguntas de opción múltiple del banco
  const qActs = fromBank(bank, Math.max(4, count - 2), `n${n}`, world.skills ?? []);
  // 1 actividad de Verdadero/Falso con makeVF
  const tfAct = getTfActivity(n, `n${n}-tf`, world.skills ?? []);
  // 1 actividad interactiva adicional seleccionada al azar de un pool de 3 variantes
  const fullExtra = getExtraNaturales(n);
  const interactivePool = fullExtra.filter(a => a.type !== "true-false");
  const chosenInteractive = pickOne(interactivePool);
  const extraAct = {
    ...chosenInteractive,
    id: `${chosenInteractive.id || `n${n}-ex-0`}`,
    skills: world.skills && world.skills.length > 0 ? world.skills : (chosenInteractive.skills ?? []),
  };
  return numbered(shuffle([...qActs, tfAct, extraAct]));
}
