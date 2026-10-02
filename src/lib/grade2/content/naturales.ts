import type { ActivitySpec } from "@/lib/activities";
import { makeClassify, makeMultiPick, makeOrder, makeStoryPick, Q, q } from "./util";

// Banco de preguntas por número de mundo de Ciencias Naturales de 2.º grado (16 mundos).
export const NATURALES_BANK: Record<number, Q[]> = {
  // 1. El Bosque de Lengas
  1: [
    q("¿Qué árbol forma los grandes bosques de la cordillera en Santa Cruz?", [["🌲", "La lenga patagónica"], ["🌴", "La palmera"], ["🌵", "El cactus de arena"]], 0, "Pista: pierde sus hojas en otoño tiñéndose de dorado y rojo.", { promptEmoji: "🏔️" }),
    q("¿Qué ave con cresta roja busca insectos picoteando los troncos de las lengas?", [["🐦", "El pájaro carpintero magallánico"], ["🦚", "El pavo real"], ["🦜", "El tucán"]], 0, "Pista: su pico fuerte golpea la madera tac-tac-tac.", { promptEmoji: "🪵" }),
    q("¿Cómo es el suelo adentro del bosque de lengas?", [["🍂", "Húmedo y cubierto de hojas caídas y musgo"], ["🏖️", "De arena seca y caliente"], ["🧱", "De cemento liso"]], 0, "Pista: el colchón de hojas en descomposición guarda mucha humedad.", { promptEmoji: "🌱" }),
    q("¿Qué organismo pequeño crece pegado a las ramas húmedas de los árboles?", [["🍄", "Hongos como el pan de indio y líquenes"], ["🐠", "Peces de colores"], ["🦀", "Cangrejos de mar"]], 0, "Pista: el hongo del ñire o llao llao forma pelotitas naranjas.", { promptEmoji: "🌿" }),
    q("¿Qué mamífero herbívoro nativo en peligro vive refugiado en estos bosques?", [["🦌", "El huemul"], ["🦒", "La jirafa"], ["🦓", "La cebra"]], 0, "Pista: es un ciervo autóctono que aparece en el escudo.", { promptEmoji: "🌲" }),
    q("¿Por qué las lengas crecen torcidas o achaparradas cerca de las cumbres?", [["💨", "Por la fuerza del viento helado y el peso de la nieve"], ["😴", "Porque tienen sueño"], ["🌊", "Porque quieren nadar"]], 0, "Pista: el clima en lo alto de la montaña es muy riguroso.", { promptEmoji: "🌬️" }),
    q("Tocá seres vivos que habitan en el bosque andino patagónico", [["🌲", "Árboles de lenga"], ["🐦", "Pájaro carpintero"], ["🦌", "Huemul"], ["🐪", "Camello del desierto"]], [0, 1, 2], "Pista: tres forman parte de este ecosistema frío de montaña.", { promptEmoji: "🌳" }),
    q("¿Qué arroyos cruzan el bosque de lengas?", [["💧", "Arroyos de agua cristalina y muy fría que bajan de la nieve"], ["🛢️", "Arroyos de aceite caliente"], ["🧂", "Ríos de agua salada"]], 0, "Pista: se alimentan del deshielo de las cumbres.", { promptEmoji: "🌊" }),
    q("¿Cómo se llama la capa de hojas secas que nutre el suelo del bosque?", [["🍂", "El mantillo o mantillo vegetal"], ["🧱", "El ladrillo"], ["🧴", "El plástico"]], 0, "Pista: los bichitos del suelo descomponen las hojas para hacer abono.", { promptEmoji: "🌱" }),
    q("¿Qué flor silvestre trepadora con forma de campana roja crece en el bosque austral?", [["🌺", "El copihue o mutisia"], ["🌻", "El girasol gigante"], ["🌹", "El clavel de invernadero"]], 0, "Pista: trepa entre los troncos de ñires y lengas.", { promptEmoji: "🌸" }),
    q("¿Por qué es fundamental no encender fuego adentro del bosque nativo?", [["🔥", "Porque un incendio puede destruir árboles de cientos de años"], ["❄️", "Porque atrae a los pingüinos"], ["💨", "Porque detiene el viento"]], 0, "Pista: las lengas tardan décadas en crecer.", { promptEmoji: "🌲" }),
    q("¿Qué pequeño animal con cola peluda salta entre las ramas del bosque?", [["🐿️", "Aves y pequeños roedores nativos"], ["🐒", "Monos tití"], ["🦁", "Leones"]], 0, "Pista: encuentran refugio y semillas en las copas de los árboles.", { promptEmoji: "🍂" }),
  ],

  // 2. Animales de la Patagonia
  2: [
    q("¿Qué animal de cuello largo y lana marrón corre velozmente por la estepa?", [["🦙", "El guanaco"], ["🐄", "La vaca lechera"], ["🐘", "El elefante"]], 0, "Pista: vive en manadas familiares guiadas por un macho relincho.", { promptEmoji: "🐾" }),
    q("¿Qué gran ave voladora de alas gigantes planea sobre las cumbres de los Andes?", [["🦅", "El cóndor andino"], ["🦜", "El loro barranquero"], ["🐧", "La gallina"]], 0, "Pista: tiene un collar de plumas blancas y vuela sin mover las alas.", { promptEmoji: "🏔️" }),
    q("¿Qué ave corredora que no vuela tiene plumas grises y pone huevos grandes?", [["🪶", "El choique o ñandú petiso"], ["🦆", "El pato de laguna"], ["🦅", "El águila mora"]], 0, "Pista: corre a gran velocidad por los matorrales de la estepa.", { promptEmoji: "🌾" }),
    q("¿Qué carnívoro de pelaje rojizo y cola espesa caza roedores de noche?", [["🦊", "El zorro colorado o culpeo"], ["🐼", "El oso panda"], ["🦥", "El perezoso"]], 0, "Pista: tiene orejas puntiagudas y un olfato muy agudo.", { promptEmoji: "🐾" }),
    q("¿Cómo es la piel y el pelaje de los animales patagónicos para resistir el invierno?", [["🧥", "Grueso, tupido y con grasa aislante"], ["🩳", "Finito y sin pelos"], ["🧊", "De hielo transparente"]], 0, "Pista: su pelaje atrapa una capa de aire tibio contra el cuerpo.", { promptEmoji: "❄️" }),
    q("¿Qué felino ágil y sigiloso es el mayor depredador terrestre de Santa Cruz?", [["🐆", "El puma"], ["🦁", "El león africano"], ["🐯", "El tigre de bengala"]], 0, "Pista: camina sin hacer ruido y caza guanacos en los cañadones.", { promptEmoji: "🐾" }),
    q("Tocá los animales autóctonos que viven en libertad en Santa Cruz", [["🦙", "Guanaco"], ["🦅", "Cóndor andino"], ["🦊", "Zorro colorado"], ["🐒", "Chimpancé"]], [0, 1, 2], "Pista: tres son especies nativas de nuestra región.", { promptEmoji: "🗺️" }),
    q("¿Qué pequeños animales que viven en madrigueras bajo tierra son presa del zorro?", [["🐭", "Ratones de campo y tucos-tucos"], ["🐟", "Peces payaso"], ["🐢", "Tortugas gigantes"]], 0, "Pista: cavan túneles bajo la tierra de la estepa.", { promptEmoji: "🕳️" }),
    q("¿Por qué las patas del choique tienen tres dedos fuertes con uñas?", [["🦶", "Para correr a gran velocidad sobre el suelo pedregoso"], ["🏊", "Para nadar como pez"], ["🧗", "Para colgarse de las ramas"]], 0, "Pista: sus patas están adaptadas a la carrera veloz en la estepa.", { promptEmoji: "🌾" }),
    q("¿Dónde anidan los cóndores para poner sus huevos?", [["🏔️", "En acantilados altos e inaccesibles llamados condoreras"], ["🌳", "En nidos de ramitas en árboles bajos"], ["🕳️", "En el fondo de un pozo"]], 0, "Pista: eligen paredes de roca vertical para proteger a sus pichones.", { promptEmoji: "🪺" }),
    q("¿Cómo se llama el ciervo patagónico con cuernos cortos que habita la cordillera?", [["🦌", "El huemul"], ["🐂", "El toro salvaje"], ["🦏", "El rinoceronte"]], 0, "Pista: es Monumento Natural Nacional protegido por ley.", { promptEmoji: "🌲" }),
    q("¿De qué se alimenta el guanaco en la meseta?", [["🌾", "De pastos duros, coirón y hojas de arbustos"], ["🥩", "De carne de otros animales"], ["🍰", "De tortas de chocolate"]], 0, "Pista: es un animal herbívoro adaptado a la vegetación seca.", { promptEmoji: "🌱" }),
  ],

  // 3. Plantas con Historia: Calafate y Ñire
  3: [
    q("¿Qué arbusto espinoso de Santa Cruz da bayas moradas dulces?", [["🫐", "El calafate"], ["🍎", "El manzano"], ["🍌", "El bananero"]], 0, "Pista: dice la leyenda que quien come de su fruto siempre vuelve a la Patagonia.", { promptEmoji: "🌿" }),
    q("¿Qué tienen las ramas del calafate para defenderse de los herbívoros?", [["🌵", "Espinas afiladas"], ["🔔", "Campanitas"], ["🍬", "Caramelos"]], 0, "Pista: pinchan los dedos al cosechar las bayas.", { promptEmoji: "🫐" }),
    q("¿De qué color son las flores del calafate en primavera?", [["🌼", "Amarillas brillantes"], ["🔵", "Azules oscuras"], ["⚪", "Blancas como la nieve"]], 0, "Pista: se abren en racimos amarillos antes de que madure el fruto.", { promptEmoji: "🌸" }),
    q("¿Qué árbol pariente de la lenga tiene hojas con borde ondeado y aroma dulce?", [["🌳", "El ñire"], ["🌴", "La palmera real"], ["🌲", "El pino caribeño"]], 0, "Pista: crece en laderas y cerca de los ríos de montaña.", { promptEmoji: "🍃" }),
    q("¿Qué producto rico se cocina con los frutos cosechados del calafate?", [["🫐", "Dulce casero de calafate y alfajores"], ["🍕", "Pizza con queso"], ["🍲", "Sopa de fideos"]], 0, "Pista: es una mermelada morada típica de nuestra provincia.", { promptEmoji: "🥞" }),
    q("¿Cómo son las hojas del ñire y la lenga para soportar el frío?", [["🍃", "Pequeñas, duras y caducas (caen en invierno)"], ["🌴", "Gigantes como abanicos tropicales"], ["💧", "Llenas de agua caliente"]], 0, "Pista: las hojas pequeñas no se congelan tan fácilmente.", { promptEmoji: "🍂" }),
    q("¿Qué arbusto bajo de la estepa arde fácilmente aun verde por su resina?", [["🌿", "La mata negra y la mata mora"], ["🌵", "El cactus redondo"], ["🎋", "La caña de bambú"]], 0, "Pista: los pobladores lo usaban para calentar la pava en el campo.", { promptEmoji: "🔥" }),
    q("¿Qué planta de la meseta forma matas redondeadas con hojas duras como agujas?", [["🌾", "El coirón"], ["🌺", "La orquídea"], ["🥬", "La lechuga"]], 0, "Pista: es el pasto principal que comen las ovejas y guanacos.", { promptEmoji: "🌾" }),
    q("Tocá plantas autóctonas de la provincia de Santa Cruz", [["🫐", "Calafate"], ["🌳", "Ñire"], ["🌾", "Coirón"], ["🌴", "Palmera cocotera"]], [0, 1, 2], "Pista: tres crecen naturalmente en nuestro suelo.", { promptEmoji: "🌱" }),
    q("¿Por qué las raíces de los arbustos patagónicos son tan profundas?", [["💧", "Para buscar agua en la profundidad y afirmarse contra el viento"], ["☀️", "Para tomar sol bajo tierra"], ["🪨", "Para romper piedras por diversión"]], 0, "Pista: en la superficie llueve poco y el viento sopla con fuerza.", { promptEmoji: "🌱" }),
    q("¿En qué estación maduran los calafates para ser cosechados?", [["☀️", "En pleno verano (enero y febrero)"], ["❄️", "En julio bajo la nieve"], ["🍂", "En invierno"]], 0, "Pista: cuando el sol del verano calienta las ramas.", { promptEmoji: "🫐" }),
    q("¿Qué animales del bosque comen los frutos silvestres del calafate?", [["🐦", "Zorzales, choiques, roedores y zorros"], ["🦈", "Tiburones"], ["🐊", "Cocodrilos"]], 0, "Pista: luego dispersan las semillas con sus heces ayudando a que nazcan nuevas plantas.", { promptEmoji: "🐾" }),
  ],

  // 4. El Bosque en las Cuatro Estaciones
  4: [
    q("¿En qué estación del año el bosque de lengas se viste de hojas rojas y doradas?", [["🍂", "En otoño"], ["☀️", "En verano"], ["🌸", "En primavera"]], 0, "Pista: antes de que las hojas se sequen y caigan al suelo.", { promptEmoji: "🍁" }),
    q("¿Qué le pasa a las ramas de la lenga durante el invierno?", [["❄️", "Quedan desnudas sin hojas y cubiertas de nieve"], ["🌸", "Se llenan de flores rojas"], ["🍉", "Dan sandías gigantes"]], 0, "Pista: pierden las hojas para no romperse con el peso del hielo.", { promptEmoji: "🪵" }),
    q("¿Qué ocurre en el bosque cuando llega la primavera?", [["🌱", "Brotan hojas verdes tiernas y florecen los arbustos"], ["❄️", "Todo se congela más"], ["🍂", "Se caen todos los árboles"]], 0, "Pista: el deshielo trae agua y los días son más tibios.", { promptEmoji: "🌸" }),
    q("¿Cómo es el bosque en verano?", [["☀️", "Verde brillante, con frutos maduros y días muy largos"], ["❄️", "Totalmente tapado por ventiscas"], ["🍂", "Lleno de nieve fresca"]], 0, "Pista: hay luz hasta las diez de la noche en el sur.", { promptEmoji: "🫐" }),
    q("¿Por qué caen las hojas de los árboles caducifolios en otoño?", [["🍂", "Para ahorrar agua y energía durante el invierno helado"], ["💨", "Porque tienen ganas de volar"], ["🐛", "Porque se las comen los pájaros todas juntas"]], 0, "Pista: en invierno el agua está congelada y las raíces no pueden absorberla.", { promptEmoji: "🍁" }),
    q("¿Qué animales del bosque tienen sus crías en primavera y verano?", [["🦌", "El huemul, el guanaco y las aves cantoras"], ["🐧", "Ningún animal tiene crías"], ["🐻", "Solo animales de la selva"]], 0, "Pista: nacen cuando hay abundante pasto tierno y clima benigno.", { promptEmoji: "🐣" }),
    q("¿Qué sucede con los arroyos de deshielo en primavera?", [["🌊", "Aumentan su caudal con el agua de la nieve derretida"], ["🧊", "Se secan por completo"], ["🔥", "Se prenden fuego"]], 0, "Pista: bajan ruidosos y torrentosos desde las cumbres.", { promptEmoji: "💧" }),
    q("¿En qué estación las noches son más largas y los días muy cortos en Santa Cruz?", [["❄️", "En invierno"], ["☀️", "En verano"], ["🌸", "En primavera"]], 0, "Pista: en junio amanece cerca de las nueve y anochece a las cinco de la tarde.", { promptEmoji: "🌙" }),
    q("Tocá las cuatro estaciones del año en orden", [["🌸", "Primavera"], ["☀️", "Verano"], ["🍂", "Otoño"], ["❄️", "Invierno"]], [0, 1, 2, 3], "Pista: el ciclo del año pasa por las cuatro.", { promptEmoji: "📅" }),
    q("¿Qué ropa usamos para caminar por el bosque en invierno?", [["🧣", "Campera térmica impermeable, guantes, gorro y botas de nieve"], ["🩳", "Malla y ojotas"], ["👕", "Remera de manga corta sin abrigo"]], 0, "Pista: debemos protegernos del frío intenso y la humedad.", { promptEmoji: "🧤" }),
    q("¿Qué insectos zumban en las flores del bosque durante el verano?", [["🐝", "Abejorros nativos y mariposas"], ["🦀", "Cangrejos"], ["🐙", "Pulpitos"]], 0, "Pista: polinizan las flores del calafate y del diente de león.", { promptEmoji: "🌸" }),
    q("¿Por qué el otoño en la cordillera santacruceña atrae a fotógrafos de todo el mundo?", [["📸", "Por los increíbles colores ocres, dorados y púrpuras de la montaña"], ["📺", "Para filmar una película de playa"], ["🚗", "Porque regalan autos"]], 0, "Pista: los bosques de lenga ofrecen un espectáculo visual único.", { promptEmoji: "🎨" }),
  ],

  // 5. ¿Qué Necesitan los Seres Vivos?
  5: [
    q("¿Qué líquido vital necesitan todos los animales y plantas para no secarse?", [["💧", "El agua"], ["🛢️", "El combustible"], ["🧴", "El detergente"]], 0, "Pista: es transparente y calma la sed.", { promptEmoji: "🌱" }),
    q("¿Qué elemento del aire respiramos las personas y los animales?", [["💨", "El oxígeno"], ["💨", "El humo de los caños de escape"], ["🫧", "El gas metano puro"]], 0, "Pista: entra a nuestros pulmones con cada inhalación.", { promptEmoji: "🫁" }),
    q("¿Qué necesitan las plantas verdes para fabricar su propio alimento con la fotosíntesis?", [["☀️", "La luz del sol"], ["🌙", "La oscuridad total"], ["🍫", "Comer bombones"]], 0, "Pista: capta la energía luminosa con sus hojas verdes.", { promptEmoji: "🌿" }),
    q("¿De dónde toman las plantas el agua y los minerales con sus raíces?", [["🌱", "Del suelo fértil"], ["🧱", "Del plástico"], ["🚗", "De los autos"]], 0, "Pista: la tierra bajo la superficie contiene nutrientes disueltos.", { promptEmoji: "🪴" }),
    q("¿Qué le pasaría a una planta si la encerramos en una caja oscura sin luz ni agua?", [["🥀", "Se marchita, amarillea y muere"], ["🌳", "Crece más fuerte y da flores gigantes"], ["🍎", "Da frutas de chocolate"]], 0, "Pista: las plantas necesitan luz y agua para vivir.", { promptEmoji: "📦" }),
    q("¿De qué obtienen energía los animales para crecer y moverse?", [["🍽️", "De los alimentos que comen"], ["🔋", "Enchufándose a la pared"], ["📱", "Con pilas recargables"]], 0, "Pista: los herbívoros comen plantas y los carnívoros otros animales.", { promptEmoji: "🍎" }),
    q("¿Qué necesitan los peces para respirar bajo el agua?", [["🐟", "Oxígeno disuelto en el agua que toman por las branquias"], ["🤿", "Tubos de buzo"], ["💨", "Salir a correr a la playa"]], 0, "Pista: sus branquias filtran el agua corriente.", { promptEmoji: "🌊" }),
    q("¿Qué necesitan los pichones de aves apenas nacen del huevo?", [["🪺", "Calor de sus padres y comida en el pico"], ["📱", "Un teléfono celular"], ["👟", "Zapatillas deportivas"]], 0, "Pista: sus padres los alimentan con insectos o semillas masticadas.", { promptEmoji: "🐣" }),
    q("Tocá las necesidades básicas de todo ser vivo", [["💧", "Agua limpia"], ["💨", "Aire para respirar"], ["🍽️", "Alimento o luz solar"], ["🎮", "Videojuegos"]], [0, 1, 2], "Pista: tres son indispensables para la supervivencia biológica.", { promptEmoji: "🐾" }),
    q("¿Por qué los seres vivos necesitan un refugio o madriguera en la Patagonia?", [["🏠", "Para protegerse del viento helado, la nieve y los depredadores"], ["🛋️", "Para mirar tele cómodos"], ["🛍️", "Para guardar ropa de moda"]], 0, "Pista: el clima austral exige resguardarse de las tormentas.", { promptEmoji: "❄️" }),
    q("¿Qué parte de la planta absorbe el agua del suelo?", [["🌱", "La raíz"], ["🌸", "El pétalo de la flor"], ["🍎", "La cáscara del fruto"]], 0, "Pista: crece hacia abajo enterrada en la tierra.", { promptEmoji: "🪴" }),
    q("¿Por qué debemos regar las plantas de casa con agua tibia o templada en invierno?", [["💧", "Porque el agua helada puede dañar sus raíces delicadas"], ["🔥", "Para cocinarlas"], ["❄️", "Para que hagan cubitos"]], 0, "Pista: las plantas sufren si el agua está a punto de congelarse.", { promptEmoji: "🚿" }),
  ],

  // 6. Sobrevivir al Invierno
  6: [
    q("¿Qué cambio experimenta el pelaje del zorro y del guanaco en invierno?", [["🧥", "Se vuelve más espeso, tupido y largo"], ["🪒", "Se les cae todo el pelo y quedan pelados"], ["🎨", "Cambia a color verde flúor"]], 0, "Pista: forman una capa de abrigo natural para no perder calor.", { promptEmoji: "🦊" }),
    q("¿Qué hacen muchas aves patagónicas cuando empieza a hacer mucho frío en otoño?", [["✈️", "Migran volando hacia zonas más cálidas del norte"], ["❄️", "Se entierran en la nieve para siempre"], ["🚀", "Viajan a la luna"]], 0, "Pista: viajan en bandadas en busca de comida y lagunas no congeladas.", { promptEmoji: "🦢" }),
    q("¿Qué animal duerme durante los meses más fríos en una cueva protegida?", [["🕳️", "Pequeños mamíferos y roedores que entran en letargo"], ["🐒", "Monos de la selva"], ["🐘", "Elefantes africanos"]], 0, "Pista: bajan los latidos de su corazón y gastan la grasa acumulada.", { promptEmoji: "💤" }),
    q("¿Por qué las lagunas patagónicas se congelan en invierno?", [["🧊", "Porque la temperatura baja muchos grados bajo cero"], ["🧂", "Porque le tiran sal marina"], ["💨", "Porque el viento las seca de golpe"]], 0, "Pista: el agua se transforma en una pista de hielo sólida.", { promptEmoji: "⛸️" }),
    q("¿Qué comen los animales herbívoros cuando el pasto queda tapado por la nieve?", [["🍂", "Ramas altas de arbustos, cortezas y líquenes"], ["🍕", "Pizza congelada"], ["🍬", "Golosinas de quiosco"]], 0, "Pista: escarban con sus pezuñas o comen hojas secas que sobresalen.", { promptEmoji: "🦌" }),
    q("¿Qué hacen los pingüinos en las costas australes para no congelarse?", [["🐧", "Se juntan apretaditos en grupos y tienen grasa gruesa bajo la piel"], ["🔥", "Prenden una fogata con fósforos"], ["🧣", "Se tejen bufandas de lana"]], 0, "Pista: compartir el calor corporal los protege de los vientos polares.", { promptEmoji: "❄️" }),
    q("¿Cómo ayuda el color blanco de la nieve a algunos animales para camuflarse?", [["🪶", "Su plumaje o pelaje claro los hace invisibles a los depredadores"], ["🔴", "Se ven de color rojo brillante"], ["💡", "Brillan en la oscuridad"]], 0, "Pista: el camuflaje es una estrategia de supervivencia clave.", { promptEmoji: "🐾" }),
    q("¿Dónde buscan refugio las ovejas y guanacos durante un temporal de viento blanco?", [["🛡️", "En cañadones, cerros y laderas con reparo del viento"], ["🌊", "Adentro del mar"], ["🌳", "En la copa más alta de los árboles"]], 0, "Pista: bajan a los bajos y zanjones donde no azota la ventisca.", { promptEmoji: "🏔️" }),
    q("Tocá estrategias de animales patagónicos para resistir el invierno", [["🧥", "Aumentar el grosor del pelaje"], ["✈️", "Migrar hacia el norte"], ["🕳️", "Buscar refugio en cuevas"], ["🍦", "Tomar helado afuera"]], [0, 1, 2], "Pista: tres son adaptaciones biológicas al clima frío.", { promptEmoji: "🐾" }),
    q("¿Qué le pasa a la grasa corporal de los animales antes del invierno?", [["🧈", "Aumenta en otoño comiendo mucho para tener reservas"], ["❌", "Desaparece por completo"], ["💧", "Se vuelve agua líquida"]], 0, "Pista: acumulan energía que usarán cuando escasee el alimento.", { promptEmoji: "🦭" }),
    q("¿Cómo caminan los choiques sobre la nieve profunda sin congelarse las patas?", [["🦶", "Tienen escamas duras y circulación sanguínea especial en sus patas"], ["🩴", "Usan chancletas de goma"], ["🛼", "Patinan con rueditas"]], 0, "Pista: su cuerpo regula la temperatura de sus extremidades.", { promptEmoji: "🌾" }),
    q("¿Por qué los guanacos bajan de la cordillera a la meseta en invierno?", [["🌾", "Porque en las zonas bajas la nieve es menos profunda y hay más pasto"], ["🏖️", "Para ir de vacaciones a la pileta"], ["🛒", "Para hacer compras al pueblo"]], 0, "Pista: se trasladan a los campos de invernada para poder alimentarse.", { promptEmoji: "🦙" }),
  ],

  // 7. Crecemos y Cambiamos
  7: [
    q("¿Cómo nos alimentábamos cuando éramos bebés recién nacidos?", [["🍼", "Con leche materna o mamadera"], ["🥩", "Comiendo bife de carne y ensalada"], ["🍕", "Con pizza y gaseosa"]], 0, "Pista: los bebés todavía no tienen dientes para masticar.", { promptEmoji: "👶" }),
    q("¿Qué partes de nuestro cuerpo cambian de tamaño a medida que crecemos?", [["📏", "La altura, el peso, el tamaño de las manos y de los pies"], ["❌", "Ninguna parte cambia"], ["👂", "Solo la punta de la oreja derecha"]], 0, "Pista: por eso la ropa y zapatillas de primer grado ya nos quedan chicas.", { promptEmoji: "🧒" }),
    q("¿Qué instrumento usa el pediatra para medir cuánto medimos de alto?", [["📏", "El tallímetro o cinta métrica"], ["⚖️", "La balanza"], ["⏱️", "El cronómetro"]], 0, "Pista: nos paramos descalzos bien derechos contra la pared.", { promptEmoji: "🩺" }),
    q("¿Qué instrumento mide cuántos kilos pesamos?", [["⚖️", "La balanza"], ["📏", "La regla de plástico"], ["🌡️", "El termómetro de mercurio"]], 0, "Pista: nos subimos arriba y marca un número en kilos.", { promptEmoji: "⚖️" }),
    q("¿Qué cosas podés hacer hoy en segundo grado que de bebé no podías?", [["🏃", "Caminar, correr, hablar, leer y atarme los cordones"], ["🍼", "Tomar el pecho"], ["😭", "Llorar para pedir la comida"]], 0, "Pista: aprendiste muchas habilidades motrices y de lenguaje.", { promptEmoji: "🎒" }),
    q("¿Qué documento de salud registra nuestras vacunas y crecimiento desde que nacimos?", [["📖", "La libreta de salud infantil"], ["🎫", "El boleto de colectivo"], ["🏷️", "La etiqueta de la ropa"]], 0, "Pista: el médico anota el peso, talla y vacunas aplicadas.", { promptEmoji: "🩺" }),
    q("¿Por qué se nos caen algunos dientes en segundo grado?", [["🦷", "Porque se caen los de leche para dar lugar a los dientes definitivos"], ["🍬", "Porque comimos una manzana"], ["❌", "Porque no sirven más los dientes"]], 0, "Pista: es un proceso natural de recambio dental durante la niñez.", { promptEmoji: "😁" }),
    q("¿Qué necesitan los niños para crecer fuertes y saludables?", [["🥗", "Comida variada y nutritiva, juego al aire libre y buen descanso"], ["📺", "Mirar pantallas doce horas seguidas"], ["🍬", "Comer solo caramelos y chupetines"]], 0, "Pista: el cuerpo necesita vitaminas, agua y dormir bien.", { promptEmoji: "🍎" }),
    q("Tocá etapas de la vida de una persona", [["👶", "Bebé"], ["🧒", "Niño o niña"], ["👴", "Adulto mayor o anciano"], ["🚗", "Automóvil"]], [0, 1, 2], "Pista: tres son momentos del ciclo de vida humano.", { promptEmoji: "⏳" }),
    q("¿Qué huellas en las fotos nos demuestran cuánto cambiamos?", [["📸", "Fotos de cuando gateábamos con pelo cortito comparadas con hoy"], ["📻", "Una grabación de radio"], ["🧱", "Un ladrillo de la pared"]], 0, "Pista: en el álbum familiar vemos cómo fue transformándose nuestro cuerpo.", { promptEmoji: "🖼️" }),
    q("¿Quiénes nos acompañan y cuidan durante nuestro crecimiento?", [["👨‍👩‍👧", "Nuestra familia, maestros y médicos"], ["🤖", "Solo los robots"], ["👽", "Seres espaciales"]], 0, "Pista: los adultos responsables nos protegen y enseñan.", { promptEmoji: "🤝" }),
    q("¿Por qué cada niña y niño crece a su propio ritmo sin ser igual a los demás?", [["🌈", "Porque cada cuerpo es único y tiene su propio tiempo de desarrollo"], ["📏", "Porque todos tienen que medir exactamente lo mismo"], ["❌", "Porque es una competencia de carrera"]], 0, "Pista: la diversidad corporal es natural y respetable.", { promptEmoji: "💞" }),
  ],

  // 8. Dientes de Leche y Dientes Nuevos
  8: [
    q("¿Cómo se llaman los primeros dientes que nos salen cuando somos bebés?", [["🦷", "Dientes de leche o temporarios"], ["🔩", "Dientes de hierro"], ["💎", "Dientes de diamante"]], 0, "Pista: son 20 dientitos que luego se aflojan y caen.", { promptEmoji: "👶" }),
    q("¿Cómo se llaman los dientes que salen después y nos acompañarán toda la vida?", [["🦷", "Dientes definitivos o permanentes"], ["🪵", "Dientes de madera"], ["🍬", "Dientes de caramelo"]], 0, "Pista: son más grandes y fuertes; son 32 en total en el adulto.", { promptEmoji: "😁" }),
    q("¿Qué debemos hacer si se nos afloja un diente de leche?", [["👅", "Moverlo suavemente con la lengua sin tironear con violencia"], ["🔨", "Golpearlo con un martillo"], ["🪢", "Atarle una soga a una puerta con fuerza"]], 0, "Pista: caerá solo cuando el diente nuevo lo empuje desde abajo.", { promptEmoji: "🦷" }),
    q("¿Qué elemento fundamental usamos todos los días para limpiar los dientes?", [["🪥", "El cepillo de dientes con pasta dental"], ["🧹", "La escoba del piso"], ["🖌️", "El pincel de témpera"]], 0, "Pista: tiene cerdas suaves y se usa después de cada comida.", { promptEmoji: "🫧" }),
    q("¿Por qué es importante cepillarse los dientes antes de ir a dormir?", [["🌙", "Para eliminar bacterias y restos de comida que producen caries de noche"], ["😴", "Para tener sueño más rápido"], ["💡", "Para que brillen en la oscuridad"]], 0, "Pista: durante la noche hay menos saliva y las bacterias atacan más.", { promptEmoji: "🪥" }),
    q("¿Cómo se llama el médico especialista que cuida y revisa nuestra boca?", [["👨‍⚕️", "El odontólogo o dentista"], ["👨‍🍳", "El cocinero"], ["🧑‍🚒", "El bombero"]], 0, "Pista: tiene un sillón especial, espejito y luz para mirar cada muela.", { promptEmoji: "🩺" }),
    q("¿Qué alimentos con mucho azúcar pueden picar los dientes si no nos cepillamos?", [["🍬", "Golosinas, caramelos pegajosos y gaseosas"], ["🍎", "Manzanas frescas"], ["🥕", "Zanahorias crudas"]], 0, "Pista: el azúcar alimenta a las bacterias que forman caries.", { promptEmoji: "🍭" }),
    q("¿Para qué sirven las muelas de la parte de atrás de la boca?", [["🦷", "Para triturar y moler los alimentos duros"], ["✂️", "Solo para cortar como tijera"], ["📢", "Para cantar más fuerte"]], 0, "Pista: tienen una superficie plana como muelas de molino.", { promptEmoji: "🍽️" }),
    q("Tocá hábitos que mantienen sana tu sonrisa", [["🪥", "Cepillarse tres veces al día"], ["🦷", "Visitar al dentista periódicamente"], ["🥗", "Comer frutas y verduras crujientes"], ["🍬", "Dormir con un chupetín en la boca"]], [0, 1, 2], "Pista: tres cuidan el esmalte dental de las caries.", { promptEmoji: "😁" }),
    q("¿Para qué sirven los dientes incisivos de adelante?", [["🦷", "Para cortar los bocados como una pequeña tijera"], ["🔨", "Para abrir botellas"], ["🔩", "Para morder metales"]], 0, "Pista: son planos y afilados, ideales para morder una manzana.", { promptEmoji: "🍎" }),
    q("¿Qué pasa si no cuidamos un diente definitivo que ya salió?", [["⚠️", "Se puede picar con caries y no vuelve a crecer otro en su lugar"], ["🌱", "Crece un árbol en la boca"], ["🦷", "Sale otro nuevo al día siguiente"]], 0, "Pista: los dientes permanentes son para toda la vida y hay que cuidarlos.", { promptEmoji: "🛡️" }),
    q("¿Cómo debemos mover el cepillo sobre los dientes?", [["🪥", "Con movimientos circulares suaves y de la encía hacia el diente"], ["🔨", "Apretando muy fuerte como lijando"], ["💨", "Solo tocando un segundo la lengua"]], 0, "Pista: masajear sin lastimar la encía limpia todos los rincones.", { promptEmoji: "🫧" }),
  ],

  // 9. Cuidamos Nuestra Salud
  9: [
    q("¿Qué hábito simple con agua y jabón evita que nos contagiemos microbios?", [["🧼", "Lavarse las manos antes de comer y después de ir al baño"], ["📱", "Mirar videos en el celular"], ["👟", "Ponerse zapatillas nuevas"]], 0, "Pista: el jabón barre los virus y bacterias de la piel.", { promptEmoji: "🫧" }),
    q("¿Por qué es indispensable abrigarse bien al salir al aire libre en Santa Cruz?", [["🧥", "Para mantener el calor corporal y evitar enfriamientos"], ["🧢", "Para que no se vuele el pelo"], ["🏖️", "Para broncearse"]], 0, "Pista: el viento helado baja rápido la temperatura del cuerpo.", { promptEmoji: "🧣" }),
    q("¿Qué grupo de alimentos nos aporta vitaminas para defendernos de enfermedades?", [["🍎", "Frutas frescas y verduras de colores"], ["🍬", "Caramelos y chupetines"], ["🍟", "Papas fritas con mucha sal todos los días"]], 0, "Pista: naranjas, manzanas, zanahorias y zapallos son muy sanos.", { promptEmoji: "🥗" }),
    q("¿Cuántas horas necesita dormir un chico de segundo grado para recuperar energía?", [["😴", "Entre 9 y 10 horas cada noche"], ["⏰", "Solo dos horas"], ["🌙", "Veinticuatro horas seguidas"]], 0, "Pista: durante el sueño el cuerpo descansa, crece y fija lo aprendido.", { promptEmoji: "🛏️" }),
    q("¿Qué medicamento preventivo nos aplican con un pinchacito para no enfermarnos de gravedad?", [["💉", "Las vacunas obligatorias"], ["🍬", "Un caramelo de menta"], ["🧴", "Una crema de manos"]], 0, "Pista: enseñan a nuestras defensas a combatir virus peligrosos.", { promptEmoji: "🛡️" }),
    q("¿Por qué es bueno tomar agua pura en lugar de gaseosas con azúcar?", [["💧", "Porque hidrata los órganos sin dañar los dientes ni sobrecargar de azúcar"], ["🥤", "Porque tiene muchas burbujas de colores"], ["🧂", "Porque es muy salada"]], 0, "Pista: el agua es la mejor bebida para saciar la sed.", { promptEmoji: "🚰" }),
    q("¿Qué debemos hacer si tenemos tos o estornudamos cerca de otros?", [["🤧", "Cubrirnos con el pliegue del codo"], ["💨", "Toserle en la cara al compañero"], ["👐", "Taparnos con las manos sucias y tocar todo"]], 0, "Pista: usar el codo evita que los microbios pasen a las manos.", { promptEmoji: "🤒" }),
    q("¿Por qué jugar y hacer actividad física todos los días cuida nuestro corazón?", [["🏃", "Porque fortalece los músculos, los huesos y nos pone de buen humor"], ["🛋️", "Porque nos deja cansados para no hablar"], ["📺", "Para gastar zapatillas"]], 0, "Pista: correr, saltar y bailar mantiene el cuerpo activo y sano.", { promptEmoji: "⚽" }),
    q("Tocá elementos que forman parte de una vida saludable", [["🥗", "Comida variada con frutas y verduras"], ["💧", "Tomar agua potable"], ["🧼", "Higiene y lavado de manos"], ["🍟", "Comer frituras todos los días sin verduras"]], [0, 1, 2], "Pista: tres construyen hábitos saludables para crecer bien.", { promptEmoji: "🍎" }),
    q("¿Qué debemos hacer cuando nos sentimos con fiebre o dolor de panza?", [["🗣️", "Avisar a un adulto de la familia y consultar al médico"], ["🏃", "Salir a correr en la nieve"], ["🍫", "Comer una barra entera de chocolate"]], 0, "Pista: el médico nos revisa y nos dice qué remedio o reposo necesitamos.", { promptEmoji: "🩺" }),
    q("¿Por qué es importante ventilar los ambientes abriendo una ventana un ratito cada día?", [["💨", "Para renovar el aire y que no se concentren virus en la casa"], ["❄️", "Para congelar los muebles"], ["🌙", "Para que entre la luna"]], 0, "Pista: el aire fresco limpia los espacios cerrados con calefacción.", { promptEmoji: "🪟" }),
    q("¿Cómo cuidamos nuestra vista cuando usamos pantallas como tablets o teles?", [["👀", "Manteniendo distancia, buena luz y descansando los ojos cada media hora"], ["🕶️", "Pegándonos la pantalla a la nariz en la oscuridad"], ["☀️", "Mirando fijo al sol directo"]], 0, "Pista: descansar la vista mirando a lo lejos relaja los ojos.", { promptEmoji: "📱" }),
  ],

  // 10. Movimiento del Cuerpo: Huesos y Músculos
  10: [
    q("¿Cómo se llama el conjunto de todos los huesos que sostienen nuestro cuerpo?", [["🦴", "El esqueleto"], ["🥩", "La masa muscular"], ["🧠", "El cerebro"]], 0, "Pista: son duros y firmes como un armazón resistente.", { promptEmoji: "🩻" }),
    q("¿Cómo se llaman los lugares donde dos huesos se unen y nos permiten doblar el cuerpo?", [["🦵", "Las articulaciones"], ["🔨", "Los clavos"], ["🧵", "Las costuras"]], 0, "Pista: la rodilla, el codo y el tobillo son ejemplos de articulaciones.", { promptEmoji: "🤸" }),
    q("¿Qué partes blandas y elásticas tiran de los huesos para que podamos movernos?", [["💪", "Los músculos"], ["🦴", "Los dientes"], ["💅", "Las uñas"]], 0, "Pista: se contraen y estiran como bandas elásticas.", { promptEmoji: "🏃" }),
    q("¿Qué articulación doblamos cuando pateamos una pelota de fútbol?", [["🦵", "La rodilla y el tobillo"], ["👂", "La oreja"], ["👃", "La nariz"]], 0, "Pista: une la pierna con el muslo y con el pie.", { promptEmoji: "⚽" }),
    q("¿Qué caja de huesos protege al corazón y a los pulmones adentro del pecho?", [["🩻", "Las costillas"], ["🦶", "Los dedos del pie"], ["🦷", "La mandíbula"]], 0, "Pista: forman una jaula protectora alrededor de los órganos vitales.", { promptEmoji: "❤️" }),
    q("¿Qué hueso duro y redondeado protege a nuestro cerebro de los golpes?", [["💀", "El cráneo"], ["🦴", "El fémur de la pierna"], ["🤚", "La palma de la mano"]], 0, "Pista: está adentro de nuestra cabeza.", { promptEmoji: "🧠" }),
    q("¿Cómo se llama la columna de vértebras que recorre nuestra espalda de arriba a abajo?", [["🦴", "La columna vertebral"], ["📏", "La regla dorsal"], ["🎋", "La caña de pescar"]], 0, "Pista: nos permite mantenernos erguidos y agacharnos hacia adelante.", { promptEmoji: "🧍" }),
    q("¿Qué mineral que tomamos en la leche, queso y yogur hace que los huesos crezcan fuertes?", [["🥛", "El calcio"], ["🍬", "El azúcar"], ["🧂", "El picante"]], 0, "Pista: los lácteos y semillas tienen mucho calcio natural.", { promptEmoji: "🧀" }),
    q("Tocá articulaciones del cuerpo humano que permiten hacer movimientos", [["🦾", "El codo"], ["🦵", "La rodilla"], ["🦶", "El tobillo"], ["👃", "La punta de la nariz"]], [0, 1, 2], "Pista: tres unen huesos y permiten doblar los miembros.", { promptEmoji: "🤸" }),
    q("¿Qué músculo que nunca descansa bombea sangre día y noche sin parar?", [["❤️", "El corazón"], ["💪", "El bíceps del brazo"], ["👅", "La lengua"]], 0, "Pista: late adentro del pecho a ritmo constante.", { promptEmoji: "💓" }),
    q("¿Qué pasa con los músculos cuando levantamos una mochila pesada?", [["💪", "Se contraen y se ponen duros para hacer fuerza"], ["💧", "Se vuelven agua líquida"], ["💨", "Se desinflan como globo"]], 0, "Pista: hacen tensión para vencer el peso de la mochila.", { promptEmoji: "🎒" }),
    q("¿Por qué es importante sentarse con la espalda derecha en la silla de la escuela?", [["🧍", "Para cuidar la columna vertebral y no tener dolores de espalda"], ["🛋️", "Para parecer un muñeco de trapo"], ["😴", "Para dormir la siesta"]], 0, "Pista: una buena postura cuida nuestros huesos en crecimiento.", { promptEmoji: "🪑" }),
  ],

  // 11. La Fuerza que Empuja y Frena
  11: [
    q("¿Qué fuerza aplicamos cuando empujamos un carrito de compras para que avance?", [["🛒", "Una fuerza de empuje hacia adelante"], ["🧲", "Una fuerza magnética mágica"], ["💨", "Una fuerza que tira hacia atrás"]], 0, "Pista: hacemos contacto con las manos empujando el manillar.", { promptEmoji: "💪" }),
    q("¿Qué fuerza hacemos cuando tiramos de una soga en un juego?", [["🪢", "Una fuerza de tracción o tiro hacia nosotros"], ["💨", "Una fuerza de soplido"], ["🧊", "Una fuerza de congelamiento"]], 0, "Pista: tiramos hacia nuestro cuerpo con las dos manos.", { promptEmoji: "🤝" }),
    q("¿Por qué una pelota que rueda por el pasto se frena sola al cabo de unos metros?", [["🌱", "Por la fuerza de rozamiento o fricción contra el pasto"], ["🧲", "Porque se le acaba la nafta"], ["😴", "Porque tiene sueño"]], 0, "Pista: el roce continuo entre las dos superficies quita velocidad.", { promptEmoji: "⚽" }),
    q("¿Por qué nos resbalamos tan fácil cuando caminamos sobre hielo o nieve compacta?", [["🧊", "Porque sobre el hielo hay muy poco rozamiento y los pies patinan"], ["🔥", "Porque el hielo quema las zapatillas"], ["🪨", "Porque el hielo es áspero como lija"]], 0, "Pista: las superficies lisas y resbalosas no frenan el movimiento.", { promptEmoji: "⛸️" }),
    q("¿Qué tienen las suelas de las zapatillas de trekking para no patinar en la montaña?", [["👟", "Dibujos con tapones y goma rugosa que aumentan el agarre"], ["🧊", "Suelas de hielo liso"], ["🛼", "Rueditas giratorias"]], 0, "Pista: los dibujos de la goma generan mayor rozamiento contra el suelo.", { promptEmoji: "🥾" }),
    q("¿Qué usamos para frenar una bicicleta cuando vamos rápido?", [["🚲", "Los frenos que aprietan las ruedas con tacos de goma"], ["🦶", "Los ojos bien abiertos"], ["📢", "Tocar el timbre"]], 0, "Pista: los tacos de goma rozan la llanta y la detienen.", { promptEmoji: "🛑" }),
    q("¿Qué fuerza invisible tira de las cosas hacia el centro de la Tierra cuando las soltamos?", [["🌍", "La fuerza de gravedad"], ["💨", "El viento"], ["🧲", "El imán del freezer"]], 0, "Pista: hace que una manzana caiga del árbol hacia abajo.", { promptEmoji: "🍎" }),
    q("¿Cómo cambiamos la forma de un trozo de plastilina con las manos?", [["🤲", "Aplicando fuerza con los dedos para amasarla y aplastarla"], ["👀", "Mirándola fijo sin tocarla"], ["🗣️", "Hablándole despacito"]], 0, "Pista: las fuerzas pueden cambiar la forma de objetos deformables.", { promptEmoji: "🎨" }),
    q("Tocá ejemplos donde aplicamos una fuerza cotidiana", [["🚪", "Empujar una puerta para abrirla"], ["👟", "Atar los cordones tirando de las puntas"], ["🪥", "Cepillar los dientes frotando"], ["🌙", "Mirar la luna de noche"]], [0, 1, 2], "Pista: tres requieren empujar, tirar o frotar físicamente.", { promptEmoji: "💪" }),
    q("¿Qué pasa si dos personas empujan una caja con la misma fuerza pero en sentidos contrarios?", [["📦", "La caja no se mueve porque las fuerzas se equilibran"], ["🚀", "Sale volando al cielo"], ["💥", "Explota de golpe"]], 0, "Pista: las fuerzas opuestas de igual intensidad se anulan.", { promptEmoji: "⚖️" }),
    q("¿Por qué los trineos se deslizan tan rápido por la nieve en la ladera?", [["🛷", "Porque la nieve lisa ofrece muy baja fricción con la base del trineo"], ["🚗", "Porque tienen motor a nafta"], ["✈️", "Porque tienen alas de avión"]], 0, "Pista: el roce suave permite que la gravedad lo acelere cuesta abajo.", { promptEmoji: "❄️" }),
    q("¿Qué elemento del auto frena las ruedas cuando el conductor pisa el pedal?", [["🛑", "Las pastillas de freno que aprietan los discos"], ["📻", "La radio"], ["💡", "Las luces altas"]], 0, "Pista: generan gran rozamiento para detener el vehículo en pocos metros.", { promptEmoji: "🚗" }),
  ],

  // 12. Ruedas, Planos Inclinados y Palancas
  12: [
    q("¿Qué máquina simple redonda gira sobre un eje y nos ayuda a mover cargas pesadas rodando?", [["🛞", "La rueda"], ["🧱", "El ladrillo cuadrado"], ["🪵", "El poste quieto"]], 0, "Pista: se usa en autos, bicicletas y carretillas.", { promptEmoji: "🚗" }),
    q("¿Cómo se llama la rampa inclinada que ayuda a subir una silla de ruedas o un carrito?", [["📐", "El plano inclinado o rampa"], ["🪜", "Una escalera de caracol"], ["🕳️", "Un pozo profundo"]], 0, "Pista: subir por una rampa suave cuesta menos fuerza que trepar escalones.", { promptEmoji: "♿" }),
    q("¿Qué máquina simple es el subibaja de la plaza donde dos amigos juegan?", [["🪵", "Una palanca con punto de apoyo central"], ["🛞", "Una rueda de molino"], ["📐", "Un plano inclinado"]], 0, "Pista: tiene una tabla larga y un punto de apoyo en el medio.", { promptEmoji: "🛝" }),
    q("¿Qué herramienta usa la fuerza de palanca para sacar un clavo viejo de la madera?", [["🔨", "La parte trasera del martillo o pata de cabra"], ["🪡", "La aguja de coser"], ["📏", "La regla de plástico"]], 0, "Pista: hace palanca apoyándose en la tabla para tirar del clavo.", { promptEmoji: "🪚" }),
    q("¿Por qué las entradas a hospitales y escuelas tienen rampas además de escaleras?", [["♿", "Para que personas en silla de ruedas o con cochecitos suban fácilmente"], ["🏎️", "Para hacer carreras de autos"], ["🛹", "Solo para andar en patineta"]], 0, "Pista: garantiza la accesibilidad para todos los vecinos.", { promptEmoji: "🏛️" }),
    q("¿Qué vehículo de campo usa una rueda adelante y dos mangos largos de palanca para llevar tierra?", [["🚜", "La carretilla"], ["🚲", "La bicicleta con canasto"], ["🛹", "El monopatín"]], 0, "Pista: levanta cargas pesadas de tierra o ripio con poco esfuerzo.", { promptEmoji: "🌱" }),
    q("¿Qué máquina simple es una tijera que usamos para cortar papel?", [["✂️", "Dos palancas cruzadas que giran sobre un tornillo central"], ["🛞", "Una rueda de auto"], ["📐", "Una rampa de madera"]], 0, "Pista: apretamos los mangos y las cuchillas cortan con fuerza concentrada.", { promptEmoji: "📄" }),
    q("¿Para qué sirve el tobogán de la plaza?", [["🛝", "Es un plano inclinado donde nos deslizamos por gravedad"], ["🛞", "Una rueda que gira sin parar"], ["🔨", "Un martillo de juego"]], 0, "Pista: subimos por la escalera y bajamos deslizándonos por la rampa.", { promptEmoji: "🎉" }),
    q("Tocá máquinas simples que usamos todos los días", [["🛞", "Rueda"], ["📐", "Plano inclinado o rampa"], ["🪵", "Palanca (como el subibaja o tijera)"], ["🚀", "Cohete espacial con turbina atómica"]], [0, 1, 2], "Pista: tres son inventos mecánicos básicos que multiplican la fuerza humana.", { promptEmoji: "⚙️" }),
    q("¿Qué ventaja nos da usar una máquina simple?", [["💪", "Hacer el mismo trabajo con mucho menos esfuerzo físico"], ["💤", "Que no tengamos que movernos nunca"], ["🍔", "Que fabrique comida sola"]], 0, "Pista: nos permite levantar o mover cosas que a mano no podríamos.", { promptEmoji: "🛠️" }),
    q("¿Qué herramienta de cocina funciona como una palanca para partir nueces duras?", [["🥜", "El cascanueces"], ["🥄", "La cucharita de té"], ["🧊", "La cubetera de hielo"]], 0, "Pista: aprieta la cáscara dura entre dos brazos articulados.", { promptEmoji: "🍽️" }),
    q("¿Por qué los camiones de mudanza usan una rampa para subir muebles pesados?", [["🚛", "Porque empujar rodando por una rampa es más fácil que levantarlo a pulso"], ["🎈", "Para que los muebles salgan volando"], ["🪨", "Para romper los muebles"]], 0, "Pista: el plano inclinado reparte el esfuerzo a lo largo de la distancia.", { promptEmoji: "📦" }),
  ],

  // 13. Materiales del Bosque y la Estepa
  13: [
    q("¿De dónde se obtiene la madera para construir cabañas y muebles en la cordillera?", [["🌲", "De los troncos de los árboles del bosque"], ["🪨", "De las piedras del río"], ["🌊", "Del agua del mar"]], 0, "Pista: es un material vegetal renovable si se cuida el bosque.", { promptEmoji: "🪵" }),
    q("¿De qué origen es la lana que se usa para tejer pulóveres?", [["🐑", "De origen animal (de la oveja)"], ["🌾", "De origen vegetal"], ["🪨", "De origen mineral"]], 0, "Pista: crece como fibra sobre la piel del ganado ovino.", { promptEmoji: "🧶" }),
    q("¿De qué origen son las piedras que se usan para hacer cimientos y pircas?", [["🪨", "De origen mineral (de la tierra y canteras)"], ["🌲", "De origen vegetal"], ["🐑", "De origen animal"]], 0, "Pista: no provienen de seres vivos, sino de la corteza terrestre.", { promptEmoji: "🧱" }),
    q("¿Qué material se fabrica con petróleo y tarda cientos de años en degradarse?", [["🛍️", "El plástico"], ["🪵", "La madera"], ["🍂", "Las hojas secas"]], 0, "Pista: botellas y bolsas plásticas contaminan si no se reciclan.", { promptEmoji: "♻️" }),
    q("¿Qué propiedad tiene la madera que la hace tan buena para construir refugios de montaña?", [["🪵", "Es resistente, cálida y un excelente aislante térmico"], ["🧊", "Es fría como el hielo"], ["💧", "Se disuelve en agua como azúcar"]], 0, "Pista: frena el frío exterior y mantiene el calor del hogar.", { promptEmoji: "🏠" }),
    q("¿Qué propiedad tiene el metal que se usa para fabricar ollas y pavas?", [["🍳", "Conduce muy bien el calor del fuego a los alimentos"], ["🪵", "Se quema como madera seca"], ["🧽", "Es blando como esponja"]], 0, "Pista: el calor pasa rápido a través del aluminio o acero.", { promptEmoji: "🔥" }),
    q("¿Qué material transparente usamos en las ventanas para que entre la luz sin que pase el viento?", [["🪟", "El vidrio"], ["🪵", "La madera maciza"], ["🧱", "El ladrillo"]], 0, "Pista: deja ver el paisaje y frena el viento helado.", { promptEmoji: "☀️" }),
    q("¿Qué material elástico de goma usamos en las ruedas de los autos?", [["🛞", "El caucho"], ["🪨", "La piedra pómez"], ["📄", "El papel de diario"]], 0, "Pista: absorbe los golpes del ripio y se agarra al suelo.", { promptEmoji: "🚗" }),
    q("Tocá materiales de origen natural que encontramos en Santa Cruz", [["🪵", "Madera"], ["🐑", "Lana"], ["🪨", "Piedra"], ["📱", "Pantalla de plástico táctil"]], [0, 1, 2], "Pista: tres provienen directamente de la naturaleza sin transformación química compleja.", { promptEmoji: "🌿" }),
    q("¿Qué le pasa al hierro si lo dejamos a la intemperie bajo la lluvia y la nieve?", [["🔩", "Se oxida y toma color rojizo anaranjado"], ["🌸", "Le crecen flores"], ["🧊", "Se vuelve transparente como vidrio"]], 0, "Pista: el oxígeno y el agua corroen el metal desprotegido.", { promptEmoji: "🌧️" }),
    q("¿Qué material impermeable usamos en las botas de lluvia para no mojarnos los pies?", [["👢", "La goma o plástico impermeable"], ["🧶", "Lana tejida con agujeros"], ["📄", "Papel de servilleta"]], 0, "Pista: el agua resbala por fuera sin atravesar el material.", { promptEmoji: "🌧️" }),
    q("¿Por qué es importante reciclar y separar el plástico, el vidrio y el cartón?", [["♻️", "Para no acumular basura y reutilizar los materiales cuidando el planeta"], ["🗑️", "Para llenar los tachos más rápido"], ["🔥", "Para quemar todo junto"]], 0, "Pista: el reciclado ahorra energía y protege la naturaleza.", { promptEmoji: "🌍" }),
  ],

  // 14. ¿Flota o se Hunde?
  14: [
    q("¿Qué le pasa a una piedra pesada si la tiramos adentro de un balde con agua?", [["🪨", "Se hunde rápido hasta el fondo"], ["🎈", "Flota como un barquito"], ["☁️", "Sale volando como nube"]], 0, "Pista: es más pesada y densa que el agua que desplaza.", { promptEmoji: "💧" }),
    q("¿Qué le pasa a una ramita seca de madera o a un corcho si lo dejamos en el agua?", [["🪵", "Flota en la superficie"], ["🪨", "Se va directo al fondo"], ["💥", "Explota con ruido"]], 0, "Pista: la madera seca tiene aire en sus poros y flota liviana.", { promptEmoji: "🪵" }),
    q("¿Por qué flota un barco gigante de acero si el metal es más pesado que el agua?", [["🚢", "Porque su casco hueco encierra mucho aire que lo hace flotar"], ["🧲", "Porque tiene un imán al cielo"], ["🪄", "Por un truco de magia"]], 0, "Pista: el aire que lleva adentro hace que todo el barco sea liviano para su gran tamaño.", { promptEmoji: "🌊" }),
    q("¿Qué pasa si colocamos un clip de metal estirado en el agua?", [["📎", "Se hunde hasta el fondo"], ["🎈", "Flota como globo"], ["🐟", "Nada como pez"]], 0, "Pista: el alambre de metal no encierra aire y cae al fondo.", { promptEmoji: "💧" }),
    q("¿Qué le ocurre a una pelota de plástico inflada con aire en una pileta?", [["⚽", "Flota en la superficie e incluso si la empujamos hacia abajo vuelve a subir"], ["🪨", "Se queda pegada en el fondo como piedra"], ["🧂", "Se disuelve como sal"]], 0, "Pista: el aire de su interior empuja con fuerza hacia arriba.", { promptEmoji: "🫧" }),
    q("¿Flota el hielo sobre el agua líquida o se hunde?", [["🧊", "Flota en la superficie"], ["🪨", "Se hunde al fondo siempre"], ["🔥", "Se prende fuego"]], 0, "Pista: por eso vemos los témpanos gigantes flotando en los lagos glaciarios.", { promptEmoji: "🏔️" }),
    q("¿Qué parte de un témpano de hielo queda visible sobre el agua del lago?", [["🧊", "Solo una pequeña parte; la mayor parte queda escondida bajo el agua"], ["🎪", "Todo el témpano está en el aire"], ["❌", "No se ve nada de nada"]], 0, "Pista: casi el noventa por ciento del témpano está sumergido.", { promptEmoji: "🛶" }),
    q("¿Qué elemento de seguridad nos mantiene a flote en el agua aunque no sepamos nadar?", [["🛟", "El chaleco salvavidas o flotador inflable"], ["🎒", "Una mochila llena de piedras"], ["👟", "Zapatillas pesadas de plomo"]], 0, "Pista: tiene espuma o aire que nos sostiene con la cabeza afuera.", { promptEmoji: "🏊" }),
    q("Tocá los objetos que flotan en el agua", [["🪵", "Pedazo de madera seca"], ["🍾", "Corcho de botella"], ["🎈", "Pelota de goma inflada"], ["🪙", "Moneda de metal"]], [0, 1, 2], "Pista: tres se mantienen sobre el agua.", { promptEmoji: "💧" }),
    q("¿Qué le pasa a una esponja seca apenas la apoyamos en el agua?", [["🧽", "Primero flota y a medida que absorbe agua se hace pesada"], ["🪨", "Se vuelve una piedra dura"], ["🔥", "Se evapora al instante"]], 0, "Pista: sus huequitos se van llenando de líquido.", { promptEmoji: "🫧" }),
    q("¿Por qué el aceite no se mezcla con el agua y queda arriba?", [["🫒", "Porque es menos denso que el agua y flota sobre ella"], ["🧂", "Porque se disuelve como azúcar"], ["🧊", "Porque se congela de golpe"]], 0, "Pista: si agitás una botella con agua y aceite, el aceite siempre sube.", { promptEmoji: "🧪" }),
    q("¿Cómo sabemos si un material va a flotar antes de probarlo?", [["🔬", "Comprobando si es más liviano que el mismo volumen de agua"], ["🎲", "Tirando una moneda al aire"], ["🔮", "Preguntándole a una bola de cristal"]], 0, "Pista: la relación entre peso y tamaño (densidad) define la flotación.", { promptEmoji: "💡" }),
  ],

  // 15. Luces, Sombras y Reflejos
  15: [
    q("¿Cuál es la principal fuente natural de luz y calor para nuestro planeta?", [["☀️", "El Sol"], ["🕯️", "Una vela"], ["💡", "Una linterna a pilas"]], 0, "Pista: brilla en el cielo cada día e ilumina la Tierra.", { promptEmoji: "🌞" }),
    q("¿Qué se produce en el suelo detrás de nosotros cuando tapamos la luz del sol?", [["👤", "Nuestra sombra"], ["🌈", "Un arcoíris"], ["🔥", "Una fogata"]], 0, "Pista: nuestro cuerpo opaco no deja pasar los rayos de luz.", { promptEmoji: "☀️" }),
    q("¿Cómo son los objetos que no dejan pasar nada de luz a través de ellos?", [["🧱", "Opacos (como una pared de madera o piedra)"], ["🪟", "Transparentes (como el vidrio limpio)"], ["💧", "Líquidos"]], 0, "Pista: proyectan una sombra nítida y oscura detrás.", { promptEmoji: "📦" }),
    q("¿Cómo son los objetos que dejan pasar toda la luz y podemos ver a través de ellos?", [["🪟", "Transparentes (como el vidrio de la ventana)"], ["🧱", "Opacos"], ["🌑", "Negros como el carbón"]], 0, "Pista: no proyectan casi sombra porque la luz los atraviesa.", { promptEmoji: "🔍" }),
    q("¿Qué objeto con superficie brillante refleja nuestra imagen como si estuviéramos adentro?", [["🪞", "El espejo"], ["🪵", "Una tabla de madera áspera"], ["🧱", "Un ladrillo roto"]], 0, "Pista: nos miramos en él para peinarnos cada mañana.", { promptEmoji: "🪞" }),
    q("¿En qué momento del día nuestra sombra sobre el suelo es más larga?", [["🌅", "Temprano a la mañana o al atardecer cuando el sol está bajo"], ["☀️", "Al mediodía cuando el sol está bien arriba"], ["🌙", "A medianoche en la cama"]], 0, "Pista: los rayos caen inclinados y estiran la sombra por metros.", { promptEmoji: "👤" }),
    q("¿Por qué al mediodía nuestra sombra es cortita debajo de nuestros pies?", [["☀️", "Porque el Sol está casi encima de nuestras cabezas"], ["🌧️", "Porque está lloviendo"], ["💨", "Porque el viento se la llevó"]], 0, "Pista: los rayos bajan casi verticales desde el cenit.", { promptEmoji: "⏰" }),
    q("¿De dónde sale la luz de la Luna de noche?", [["☀️", "Refleja la luz que recibe del Sol como un gran espejo"], ["💡", "Tiene lámparas adentro"], ["🔥", "Es una bola de fuego prendida"]], 0, "Pista: la Luna no tiene luz propia; es una roca iluminada por el Sol.", { promptEmoji: "🌕" }),
    q("Tocá fuentes artificiales de luz que usamos cuando oscurece", [["💡", "Lámpara eléctrica"], ["🔦", "Linterna"], ["🕯️", "Vela encendida"], ["☀️", "El Sol en el cielo"]], [0, 1, 2], "Pista: tres son aparatos u objetos encendidos por las personas.", { promptEmoji: "⚡" }),
    q("¿Qué pasa si ponemos un objeto translúcido (como papel manteca) frente a la linterna?", [["📄", "Pasa algo de luz pero no se ve con claridad lo que hay detrás"], ["🪟", "Pasa toda la luz transparente"], ["🧱", "Se hace totalmente negro como piedra"]], 0, "Pista: difumina la luz suavemente.", { promptEmoji: "🔦" }),
    q("¿Dónde podemos ver nuestro reflejo en la naturaleza sin tener un espejo?", [["🌊", "En el agua quieta y calma de un lago o charco"], ["🌾", "En el pasto seco"], ["💨", "En el viento"]], 0, "Pista: la superficie lisa del agua actúa como un espejo natural.", { promptEmoji: "🏞️" }),
    q("¿Qué juego divertido podemos hacer con las manos y la luz de una lámpara en la pared?", [["🖐️", "Teatro de sombras chinescas"], ["⚽", "Fútbol con pelota de cuero"], ["🏊", "Carreras de natación"]], 0, "Pista: formando figuras con los dedos hacemos pájaros y perritos de sombra.", { promptEmoji: "🎭" }),
  ],

  // 16. Sonidos del Bosque y el Viento
  16: [
    q("¿Qué produce el sonido cuando hablamos, cantamos o tocamos un instrumento?", [["🔊", "La vibración del aire y de los objetos"], ["💡", "La luz de una lámpara"], ["🧊", "El frío de la nieve"]], 0, "Pista: si tocás tu garganta al hablar, sentís cómo vibra.", { promptEmoji: "🎵" }),
    q("¿Qué sonido natural constante escuchamos en la meseta y el bosque de Santa Cruz?", [["💨", "El silbido del viento entre las ramas"], ["🚗", "Bocinas de embotellamiento"], ["🔔", "Campanas de iglesia todo el día"]], 0, "Pista: mueve las copas de los árboles y zumba en los alambrados.", { promptEmoji: "🌬️" }),
    q("¿Qué órgano de nuestro cuerpo capta las ondas sonoras para que podamos oír?", [["👂", "El oído"], ["👀", "Los ojos"], ["👃", "La nariz"]], 0, "Pista: tiene el tímpano adentro que vibra con las ondas sonoras.", { promptEmoji: "👂" }),
    q("¿Cómo es el sonido del trueno en una tormenta comparado con el silbido de un pajarito?", [["⚡", "Fuerte y grave"], ["🐤", "Débil y agudo"], ["🔇", "Completamente silencioso"]], 0, "Pista: retumba profundo y hace vibrar los vidrios de la ventana.", { promptEmoji: "🌩️" }),
    q("¿Qué instrumento de viento emite un sonido agudo y brillante?", [["🪈", "La flauta"], ["🥁", "El bombo legüero"], ["🪨", "Una piedra pesada"]], 0, "Pista: sus notas son altas y finas.", { promptEmoji: "🎶" }),
    q("¿Qué instrumento de percusión emite un sonido grave y profundo al golpearlo?", [["🥁", "El bombo o tambor grande"], ["🔔", "El cascabel chiquito"], ["🪈", "El silbato de metal"]], 0, "Pista: resuena hondo como el latido de un corazón gigante.", { promptEmoji: "🪘" }),
    q("¿Por qué el silencio del bosque es tan importante para los animales?", [["🌲", "Para escuchar peligros, comunicarse con sus crías y cazar"], ["😴", "Para no despertarse nunca"], ["📺", "Para mirar tele"]], 0, "Pista: los animales dependen de su fino oído para sobrevivir.", { promptEmoji: "🦌" }),
    q("¿Cómo viaja el sonido desde la campana de la escuela hasta nuestras orejas?", [["💨", "Viaja por el aire en forma de ondas sonoras invisibles"], ["🚇", "Por túneles de subte"], ["📦", "Adentro de una caja de cartón"]], 0, "Pista: las ondas empujan las moléculas del aire hasta nuestro tímpano.", { promptEmoji: "🔔" }),
    q("Tocá sonidos que provienen de la naturaleza patagónica", [["🌊", "El oleaje del mar sobre las piedras"], ["🐦", "El canto del pájaro carpintero en el bosque"], ["💨", "El aullido del viento patagónico"], ["🚗", "La bocina de un camión en la avenida"]], [0, 1, 2], "Pista: tres son sonidos propios del ambiente natural sin motores.", { promptEmoji: "🌿" }),
    q("¿Qué le pasa a nuestros oídos si escuchamos música con auriculares a volumen excesivo?", [["⚠️", "Podemos dañar las células del oído y perder audición"], ["🧠", "Nos volvemos más inteligentes"], ["👂", "Nos crecen orejas de elefante"]], 0, "Pista: los ruidos muy fuertes lastiman el tímpano de forma permanente.", { promptEmoji: "🎧" }),
    q("¿Qué animal de la estepa emite un agudo relincho de alerta para avisar a su manada?", [["🦙", "El guanaco relincho"], ["🐢", "La tortuga"], ["🐟", "La trucha del arroyo"]], 0, "Pista: cuando ve un zorro o un puma, lanza un grito fuerte.", { promptEmoji: "🐾" }),
    q("¿Cómo podemos calmar nuestra mente y descansar en medio de la naturaleza?", [["🧘", "Cerrando los ojos y escuchando con atención los sonidos del agua y las aves"], ["📱", "Poniendo un video con volumen al máximo"], ["📢", "Gritando con un megáfono"]], 0, "Pista: el paisaje sonoro natural transmite paz y armonía.", { promptEmoji: "🕊️" }),
  ],
};

// Actividades estructuradas complementarias por mundo (ordenar, clasificar, comprensión de historias).
export const EXTRA_NATURALES: Record<number, ActivitySpec[]> = {
  // 1. El Bosque de Lengas
  1: [
    makeClassify(
      "n1-ex-0",
      "Clasificá los seres vivos según si son plantas o animales del bosque de lengas.",
      ["Plantas del Bosque", "Animales del Bosque"],
      [
        { label: "🌲 Árbol de lenga", cat: 0 },
        { label: "🐦 Pájaro carpintero magallánico", cat: 1 },
        { label: "🌿 Arbusto de ñire", cat: 0 },
        { label: "🦌 Huemul andino", cat: 1 },
        { label: "🌸 Flor de mutisia", cat: 0 },
        { label: "🦊 Zorro colorado", cat: 1 },
      ],
      "Pista: las plantas tienen raíces y hojas; los animales se mueven y buscan alimento.",
      ["n2-seres-vivos-ambientes", "n2-plantas-bosque"]
    ),
    makeStoryPick(
      "n1-ex-1",
      {
        title: "El guardián de los troncos",
        text: "En lo alto de una vieja lenga, un pájaro carpintero macho con su copete rojo fuego busca larvas e insectos. Golpea con su pico firme la corteza produciendo un rítmico 'tac-tac-tac'. Al encontrar su alimento, alimenta a su pichón que asoma la cabecita desde el hueco del nido.",
      },
      "¿Para qué golpea el pájaro carpintero la corteza de la lenga?",
      [["🐛", "Para buscar larvas e insectos con los que se alimenta"], ["🔨", "Para clavar clavos en el árbol"], ["😴", "Para hacer ruido y no dormir"]],
      0,
      "Pista: busca pequeños insectos escondidos bajo la madera.",
      ["n2-seres-vivos-ambientes", "n2-plantas-bosque"]
    ),
  ],

  // 2. Animales de la Patagonia
  2: [
    makeClassify(
      "n2-ex-0",
      "Clasificá los animales según si son aves voladoras o mamíferos terrestres.",
      ["Aves", "Mamíferos"],
      [
        { label: "🦅 Cóndor andino", cat: 0 },
        { label: "🦙 Guanaco de la estepa", cat: 1 },
        { label: "🐦 Carpintero magallánico", cat: 0 },
        { label: "🦊 Zorro colorado", cat: 1 },
        { label: "🪶 Choique patagónico", cat: 0 },
        { label: "🦌 Huemul andino", cat: 1 },
      ],
      "Pista: las aves tienen plumas y pico; los mamíferos tienen pelaje y maman al nacer.",
      ["n2-animales-adaptaciones"]
    ),
    makeOrder(
      "n2-ex-1",
      "Ordená los animales patagónicos desde el más pequeño hasta el más grande.",
      [
        "1. Ratón colilargo de campo",
        "2. Zorro colorado",
        "3. Guanaco adulto",
      ],
      "Pista: el ratoncito cabe en una mano, el zorro es mediano y el guanaco mide más de un metro.",
      ["n2-animales-adaptaciones"]
    ),
  ],

  // 3. Plantas con Historia: Calafate y Ñire
  3: [
    makeStoryPick(
      "n3-ex-0",
      {
        title: "La leyenda de la anciana Koonek",
        text: "Cuenta una antigua leyenda tehuelche que la anciana Koonek, al no poder seguir a su tribu que marchaba hacia el norte por el invierno, se quedó esperando en la estepa. Para no dejarla sola, las aves le llevaron semillas y los espíritus la transformaron en el arbusto de calafate, con espinas para cuidarse y ricas bayas moradas para alimentar a los caminantes.",
      },
      "¿En qué se transformó la anciana Koonek según la leyenda?",
      [["🫐", "En el arbusto de calafate con ricas bayas moradas"], ["🏔️", "En una montaña de nieve"], ["🦅", "En un cóndor gigante"]],
      0,
      "Pista: es el arbusto con frutos que da nombre a la leyenda.",
      ["n2-plantas-bosque"]
    ),
    makeClassify(
      "n3-ex-1",
      "Clasificá las partes de la planta del calafate según su función.",
      ["Protección y Sostén", "Flor y Fruto"],
      [
        { label: "🌵 Espinas afiladas contra herbívoros", cat: 0 },
        { label: "🌼 Flores amarillas de primavera", cat: 1 },
        { label: "🪵 Ramas duras y leñosas", cat: 0 },
        { label: "🫐 Bayas moradas con semillas", cat: 1 },
        { label: "🌱 Raíz profunda que busca agua", cat: 0 },
        { label: "🌸 Pétalos que atraen abejas", cat: 1 },
      ],
      "Pista: distinguí las flores y frutos de las espinas y raíces de defensa.",
      ["n2-plantas-bosque"]
    ),
  ],

  // 4. El Bosque en las Cuatro Estaciones
  4: [
    makeOrder(
      "n4-ex-0",
      "Ordená el ciclo de las hojas de la lenga a lo largo del año.",
      [
        "1. Brotes verdes tiernos en primavera",
        "2. Hojas de color dorado y rojo intenso en otoño",
        "3. Ramas peladas cubiertas de nieve en invierno",
      ],
      "Pista: nacen verdes en primavera, cambian de color en otoño y caen en invierno.",
      ["n2-cambios-estacionales", "n2-plantas-bosque"]
    ),
    makeClassify(
      "n4-ex-1",
      "Clasificá las características según la estación del año en Santa Cruz.",
      ["Verano", "Invierno"],
      [
        { label: "☀️ Días largos con luz hasta tarde", cat: 0 },
        { label: "❄️ Nieve, heladas y lagunas congeladas", cat: 1 },
        { label: "🫐 Frutos de calafate maduros y dulces", cat: 0 },
        { label: "🧣 Noches larguísimas y mucho abrigo", cat: 1 },
        { label: "🌸 Abejorros polinizando flores", cat: 0 },
        { label: "🪵 Árboles sin hojas aguantando la ventisca", cat: 1 },
      ],
      "Pista: pensá qué pasa con el sol y la temperatura en enero versus julio.",
      ["n2-cambios-estacionales"]
    ),
  ],

  // 5. ¿Qué Necesitan los Seres Vivos?
  5: [
    makeClassify(
      "n5-ex-0",
      "Clasificá cada elemento según si es un ser vivo o un elemento sin vida (abiótico).",
      ["Ser Vivo", "Elemento sin Vida"],
      [
        { label: "🌲 Árbol de lenga", cat: 0 },
        { label: "🪨 Piedra del cañadón", cat: 1 },
        { label: "🦙 Guanaco de la meseta", cat: 0 },
        { label: "💧 Agua del arroyo", cat: 1 },
        { label: "🍄 Hongo del bosque", cat: 0 },
        { label: "💨 Viento patagónico", cat: 1 },
      ],
      "Pista: los seres vivos nacen, crecen, respiran y se reproducen; las piedras y el agua no.",
      ["n2-necesidades-factores"]
    ),
    makeMultiPick(
      "n5-ex-1",
      "Tocá todo lo que necesita una plantita de lenga para crecer saludable",
      [
        ["💧", "Agua en el suelo"],
        ["☀️", "Luz del sol"],
        ["🌱", "Tierra fértil con nutrientes"],
        ["🍕", "Porciones de pizza"],
      ],
      [0, 1, 2],
      "Pista: tres son factores naturales indispensables para la fotosíntesis y nutrición.",
      ["n2-necesidades-factores", "n2-plantas-bosque"]
    ),
  ],

  // 6. Sobrevivir al Invierno
  6: [
    makeClassify(
      "n6-ex-0",
      "Clasificá las adaptaciones animales según cómo enfrentan el invierno patagónico.",
      ["Abrigo y Permanencia", "Migración hacia el Norte"],
      [
        { label: "🧥 Zorro con pelaje grueso y tupido", cat: 0 },
        { label: "🦢 Cauquén que vuela a pasturas templadas", cat: 1 },
        { label: "🦭 Capa de grasa gruesa del lobo marino", cat: 0 },
        { label: "🦅 Aves playeras que viajan miles de kilómetros", cat: 1 },
        { label: "🦌 Huemul con abrigo térmico en el bosque", cat: 0 },
        { label: "🦆 Patos que buscan lagunas sin congelar", cat: 1 },
      ],
      "Pista: unos se quedan resistiendo con su cuerpo abrigado y otros vuelan lejos del frío.",
      ["n2-animales-adaptaciones", "n2-cambios-estacionales"]
    ),
    makeStoryPick(
      "n6-ex-1",
      {
        title: "El viaje del cauquén",
        text: "Cuando las primeras escarchas de abril blanquean los pastizales de Santa Cruz, bandadas de cauquenes se reúnen formando una 'V' en el cielo. Emprenden un largo vuelo hacia las llanuras pampeanas del norte argentino, donde el invierno es más suave y el agua no se congela.",
      },
      "¿Por qué los cauquenes vuelan en bandadas hacia el norte en otoño?",
      [["✈️", "Para buscar pasturas sin nieve y lagunas no congeladas"], ["🏖️", "Para ir a tomar sol a la playa"], ["🎮", "Para jugar videojuegos"]],
      0,
      "Pista: buscan un clima más templado con alimento disponible.",
      ["n2-animales-adaptaciones", "n2-cambios-estacionales"]
    ),
  ],

  // 7. Crecemos y Cambiamos
  7: [
    makeOrder(
      "n7-ex-0",
      "Ordená las etapas del crecimiento de una persona a lo largo de la vida.",
      [
        "1. Bebé en la cuna tomando leche",
        "2. Niño o niña en la escuela primaria",
        "3. Adulto mayor con canas contando historias",
      ],
      "Pista: del nacimiento a la niñez escolar y luego a la vejez sabia.",
      ["n2-cuerpo-crecimiento"]
    ),
    makeClassify(
      "n7-ex-1",
      "Clasificá las actividades según si las hace un bebé o si las podés hacer vos en segundo grado.",
      ["Propio de un Bebé", "Propio de Segundo Grado"],
      [
        { label: "🍼 Tomar leche en mamadera acostado", cat: 0 },
        { label: "📖 Leer un cuento con letras y dibujos", cat: 1 },
        { label: "🚼 Usar pañales todo el día", cat: 0 },
        { label: "👟 Atarse los cordones de las zapatillas", cat: 1 },
        { label: "😭 Llorar para pedir que lo alcen", cat: 0 },
        { label: "🚲 Andar en bicicleta sin rueditas", cat: 1 },
      ],
      "Pista: pensá qué necesitabas antes y qué lográs hacer de forma independiente hoy.",
      ["n2-cuerpo-crecimiento"]
    ),
  ],

  // 8. Dientes de Leche y Dientes Nuevos
  8: [
    makeOrder(
      "n8-ex-0",
      "Ordená los pasos correctos para un buen cepillado dental.",
      [
        "1. Poner pasta dental del tamaño de una arvejita en el cepillo",
        "2. Cepillar en círculos suaves todas las caras de los dientes y muelas",
        "3. Enjuagarse la boca con un vasito de agua y escupir",
      ],
      "Pista: primero la pasta, luego el cepillado completo y al final el enjuague.",
      ["n2-salud-prevencion"]
    ),
    makeClassify(
      "n8-ex-1",
      "Clasificá los alimentos según si cuidan o perjudican los dientes.",
      ["Amigo de los Dientes", "Peligro de Caries si no Cepillamos"],
      [
        { label: "🍎 Manzana crujiente y fresca", cat: 0 },
        { label: "🍬 Caramelo masticable pegajoso", cat: 1 },
        { label: "🥛 Leche y queso con calcio", cat: 0 },
        { label: "🥤 Gaseosa con mucho azúcar", cat: 1 },
        { label: "🥕 Bastoncitos de zanahoria cruda", cat: 0 },
        { label: "🍭 Chupetín de dulce concentrado", cat: 1 },
      ],
      "Pista: las frutas y lácteos fortalecen; los azúcares pegajosos alimentan a las bacterias.",
      ["n2-salud-prevencion"]
    ),
  ],

  // 9. Cuidamos Nuestra Salud
  9: [
    makeClassify(
      "n9-ex-0",
      "Clasificá las acciones según si protegen o descuidan nuestra salud.",
      ["Hábito Saludable", "Riesgo para la Salud"],
      [
        { label: "🧼 Lavarse las manos antes de almorzar", cat: 0 },
        { label: "🥶 Salir a la nieve en remera y sin abrigo", cat: 1 },
        { label: "😴 Dormir diez horas por noche", cat: 0 },
        { label: "📺 Mirar pantallas hasta la madrugada sin dormir", cat: 1 },
        { label: "🥗 Comer frutas variadas y tomar agua", cat: 0 },
        { label: "🤧 Toser al aire sin taparse la boca", cat: 1 },
      ],
      "Pista: cuidar la salud incluye higiene, abrigo adecuado, nutrición y descanso.",
      ["n2-salud-prevencion"]
    ),
    makeStoryPick(
      "n9-ex-1",
      {
        title: "La tarde de juegos de Lucas",
        text: "Lucas jugó un partido de fútbol en el patio de la escuela con sus amigos. Al terminar, transpirado y con sed, fue directo a la canilla a lavarse las manos con jabón y tomó agua fresca de su botellita. Luego se puso su campera abrigada para no enfriarse con el viento.",
      },
      "¿Qué hizo Lucas después de jugar para cuidar su salud?",
      [["💧", "Se lavó las manos, tomó agua y se puso la campera abrigada"], ["🍦", "Comió cinco helados en la nieve sin abrigo"], ["🏃", "Se fue corriendo sin tomar agua"]],
      0,
      "Pista: se hidrató y se abrigó para no enfriarse.",
      ["n2-salud-prevencion"]
    ),
  ],

  // 10. Movimiento del Cuerpo: Huesos y Músculos
  10: [
    makeClassify(
      "n10-ex-0",
      "Clasificá las partes del sistema locomotor entre huesos duros y articulaciones móviles.",
      ["Hueso Duro (Sostén y Protección)", "Articulación Móvil (Permite Doblar)"],
      [
        { label: "💀 Cráneo que protege el cerebro", cat: 0 },
        { label: "🦵 Rodilla de la pierna", cat: 1 },
        { label: "🩻 Costillas que cuidan el corazón", cat: 0 },
        { label: "🦾 Codo del brazo", cat: 1 },
        { label: "🦴 Fémur largo del muslo", cat: 0 },
        { label: "🦶 Tobillo del pie", cat: 1 },
      ],
      "Pista: los huesos son piezas rígidas; las articulaciones son las bisagras que se flexionan.",
      ["n2-cuerpo-movimiento"]
    ),
    makeOrder(
      "n10-ex-1",
      "Ordená cómo trabajan juntos el cerebro, los músculos y los huesos para patear una pelota.",
      [
        "1. El cerebro envía una señal eléctrica veloz por los nervios",
        "2. Los músculos de la pierna se contraen y tiran de los huesos",
        "3. La pierna se flexiona y el pie impacta la pelota",
      ],
      "Pista: la orden nace en la cabeza, el músculo hace la fuerza y el hueso se mueve.",
      ["n2-cuerpo-movimiento"]
    ),
  ],

  // 11. La Fuerza que Empuja y Frena
  11: [
    makeClassify(
      "n11-ex-0",
      "Clasificá las acciones según si aplican una fuerza de empuje o una fuerza de tracción (tirar).",
      ["Fuerza de Empujar (Alejar)", "Fuerza de Tirar (Acercar)"],
      [
        { label: "🛒 Empujar el changuito del súper hacia adelante", cat: 0 },
        { label: "🪢 Tirar de la soga hacia uno", cat: 1 },
        { label: "🚪 Empujar la puerta para salir al patio", cat: 0 },
        { label: "🧳 Tirar de la valija con rueditas", cat: 1 },
        { label: "⚽ Patear la pelota empujándola con el pie", cat: 0 },
        { label: "🐟 Tirar de la caña de pescar para sacar el pez", cat: 1 },
      ],
      "Pista: empujar aleja el objeto; tirar lo acerca hacia nuestro cuerpo.",
      ["n2-fuerzas-movimiento"]
    ),
    makeStoryPick(
      "n11-ex-1",
      {
        title: "La pista de trineos en El Chaltén",
        text: "Camila y su hermano subieron con su trineo plástico a una loma con nieve lisa. Al sentarse y darse un leve empujón, el trineo se deslizó a gran velocidad cuesta abajo. Al llegar a la parte plana con pasto seco que asomaba, el trineo se frenó suavemente por el rozamiento.",
      },
      "¿Por qué se frenó el trineo al llegar al pasto seco?",
      [["🌱", "Por el rozamiento y fricción que frenó el trineo"], ["🧲", "Porque un imán lo atrajo"], ["💨", "Porque sopló viento para arriba"]],
      0,
      "Pista: el pasto áspero frena el deslizamiento de la base plástica.",
      ["n2-fuerzas-movimiento"]
    ),
  ],

  // 12. Ruedas, Planos Inclinados y Palancas
  12: [
    makeClassify(
      "n12-ex-0",
      "Clasificá cada herramienta según la máquina simple que aprovecha.",
      ["Palanca", "Plano Inclinado (Rampa)"],
      [
        { label: "✂️ Tijera para cortar cartón", cat: 0 },
        { label: "♿ Rampa para entrar al hospital", cat: 1 },
        { label: "🪵 Subibaja de la plaza", cat: 0 },
        { label: "🛝 Tobogán de juegos", cat: 1 },
        { label: "🔨 Sacar un clavo con el martillo", cat: 0 },
        { label: "🚛 Rampa para subir cajas al camión", cat: 1 },
      ],
      "Pista: las palancas giran sobre un punto de apoyo; los planos inclinados son rampas lisas.",
      ["n2-fuerzas-movimiento"]
    ),
    makeStoryPick(
      "n12-ex-1",
      {
        title: "La carretilla de la huerta",
        text: "En la huerta comunitaria, Martín tiene que trasladar cuatro baldes de tierra negra. En lugar de llevarlos a mano uno por uno, los carga todos adentro de una carretilla. Gracias a la rueda delantera y los mangos largos, transporta toda la carga en un solo viaje sin lastimarse la espalda.",
      },
      "¿Cómo ayuda la carretilla a Martín en la huerta?",
      [["🚜", "Permite mover mucho peso rodando con poco esfuerzo"], ["✈️", "Vuela por el aire con alas"], ["🌱", "Riega las plantas sola"]],
      0,
      "Pista: la rueda y las palancas de los mangos alivianan el trabajo.",
      ["n2-fuerzas-movimiento"]
    ),
  ],

  // 13. Materiales del Bosque y la Estepa
  13: [
    makeClassify(
      "n13-ex-0",
      "Clasificá los materiales según su origen natural (vegetal, animal o mineral).",
      ["Origen Vegetal o Animal", "Origen Mineral o Artificial"],
      [
        { label: "🪵 Madera de lenga del bosque", cat: 0 },
        { label: "🪨 Piedra del cañadón", cat: 1 },
        { label: "🐑 Lana abrigada de oveja", cat: 0 },
        { label: "🔩 Clavos y tornillos de metal", cat: 1 },
        { label: "🌾 Paja de coirón para techos", cat: 0 },
        { label: "🛍️ Botella de plástico sintético", cat: 1 },
      ],
      "Pista: los árboles y ovejas son seres vivos; las piedras, metales y plásticos son minerales o químicos.",
      ["n2-materiales-propiedades"]
    ),
    makeOrder(
      "n13-ex-1",
      "Ordená de más blando a más duro estos materiales.",
      [
        "1. Lana hilada de oveja",
        "2. Madera de tabla de lenga",
        "3. Piedra de granito del cerro",
      ],
      "Pista: la lana se aprieta con los dedos, la madera es firme y la piedra no se deforma.",
      ["n2-materiales-propiedades"]
    ),
  ],

  // 14. ¿Flota o se Hunde?
  14: [
    makeClassify(
      "n14-ex-0",
      "Clasificá los objetos según si flotan o se hunden en un tazón con agua.",
      ["Flota en el Agua", "Se Hunde al Fondo"],
      [
        { label: "🪵 Ramita seca de madera", cat: 0 },
        { label: "🪨 Piedra pequeña del río", cat: 1 },
        { label: "🍾 Corcho de botella", cat: 0 },
        { label: "🪙 Moneda de metal", cat: 1 },
        { label: "🎈 Pelotita de telgopor", cat: 0 },
        { label: "📎 Clip de alambre de hierro", cat: 1 },
      ],
      "Pista: los objetos con aire o poco densos flotan; los minerales compactos caen al fondo.",
      ["n2-materiales-propiedades"]
    ),
    makeStoryPick(
      "n14-ex-1",
      {
        title: "El barquito de corteza de Tomás",
        text: "Tomás encontró una corteza gruesa y seca de lenga en la orilla del arroyo. Le clavó una ramita fina con una hoja seca como vela y la apoyó suavemente en la corriente. El barquito flotó orgulloso y navegó empujado por la suave brisa del bosque.",
      },
      "¿Por qué navegó el barquito de Tomás en el arroyo?",
      [["🪵", "Porque la madera seca y la corteza flotan naturalmente en el agua"], ["🪨", "Porque era de piedra sólida"], ["🤿", "Porque tenía un buzo nadando abajo"]],
      0,
      "Pista: la madera liviana se mantiene sobre la superficie líquida.",
      ["n2-materiales-propiedades"]
    ),
  ],

  // 15. Luces, Sombras y Reflejos
  15: [
    makeClassify(
      "n15-ex-0",
      "Clasificá los objetos según si dejan pasar la luz o si producen sombra opaca.",
      ["Transparentes (Pasa la Luz)", "Opacos (Producen Sombra)"],
      [
        { label: "🪟 Vidrio limpio de ventana", cat: 0 },
        { label: "🧱 Pared de ladrillo y madera", cat: 1 },
        { label: "👓 Lentes transparentes", cat: 0 },
        { label: "📦 Caja de cartón cerrada", cat: 1 },
        { label: "💧 Agua clara en vaso de vidrio", cat: 0 },
        { label: "👤 Nuestro propio cuerpo", cat: 1 },
      ],
      "Pista: lo transparente deja ver lo que hay detrás; lo opaco bloquea los rayos de luz.",
      ["n2-luz-sonido"]
    ),
    makeOrder(
      "n15-ex-1",
      "Ordená cómo cambia el tamaño de tu sombra en un día soleado de verano.",
      [
        "1. Sombra larga a la mañana temprano (sol bajo)",
        "2. Sombra corta bajo los pies al mediodía (sol alto)",
        "3. Sombra larga otra vez al atardecer (sol bajo)",
      ],
      "Pista: cuando el sol está bajito la sombra se estira; al mediodía casi desaparece debajo tuyo.",
      ["n2-luz-sonido"]
    ),
  ],

  // 16. Sonidos del Bosque y el Viento
  16: [
    makeClassify(
      "n16-ex-0",
      "Clasificá los sonidos según si son sonidos naturales del ambiente o ruidos de la ciudad.",
      ["Sonido Natural del Bosque y la Estepa", "Sonido Artificial de la Ciudad"],
      [
        { label: "💨 Viento silbando en las copas de lenga", cat: 0 },
        { label: "🚗 Bocina estridente de camión", cat: 1 },
        { label: "🌊 Arroyo de deshielo saltando en piedras", cat: 0 },
        { label: "🚨 Sirena de patrullero por la avenida", cat: 1 },
        { label: "🐦 Canto melodioso del zorzal patagónico", cat: 0 },
        { label: "🏗️ Martillo neumático rompiendo asfalto", cat: 1 },
      ],
      "Pista: separá los ruidos de motores y bocinas de los sonidos de la naturaleza viva.",
      ["n2-luz-sonido"]
    ),
    makeStoryPick(
      "n16-ex-1",
      {
        title: "La caja de resonancia casera",
        text: "En la clase de ciencias, la maestra estiró una banda elástica alrededor de una caja de zapatos vacía sin tapa. Al hacer vibrar la gomita con el dedo, se escuchó una nota musical clara y suave. 'Cuando algo vibra, hace vibrar el aire y llega como sonido a nuestras orejas', explicó sonriendo.",
      },
      "¿Qué produjo el sonido musical en la caja de zapatos?",
      [["🎵", "La vibración rápida de la gomita elástica en el aire"], ["💡", "La luz de la lámpara del aula"], ["🧊", "Un cubito de hielo"]],
      0,
      "Pista: la vibración física genera las ondas sonoras.",
      ["n2-luz-sonido"]
    ),
  ],
};
