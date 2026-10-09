// Banco de preguntas y actividades de Lengua de 4.º grado (28 mundos).
// 28 mundos con 20 preguntas balanceadas cada uno (560 preguntas)
// más actividades interactivas (clasificar, ordenar, verdadero/falso).
import type { ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import { fromBank, makeClassify, makeOrder,
  makeVF, numbered, Q, q, shuffle, pickOne } from "./util";

export const LENGUA_BANK: Record<number, Q[]> = {
  1: [
    q("¿Qué parte de la noticia presenta el hecho principal con letras destacadas?", [["📰","El titular o título principal de la noticia"],["📸","El epígrafe breve debajo de una fotografía"],["📝","El cuerpo extenso con todas las declaraciones"]], 0, "Pista: resume el hecho y llama la atención del lector."),
    q("¿Cuál es la función del epígrafe en una noticia?", [["📸","Explicar lo que muestra la imagen o foto"],["📰","Brindar la firma del redactor de la nota"],["🗞️","Indicar la fecha y sección del periódico impreso"]], 0, "Pista: se ubica inmediatamente debajo de la foto."),
    q("¿Qué información responde la pregunta «¿DÓNDE?» en una noticia periodística?", [["📍","El lugar geográfico exacto del suceso"],["⏰","La hora precisa en que comenzó la actividad"],["👥","La nómina de todas las personas presentes"]], 0, "Pista: pensá en la ubicación física o en el mapa donde ocurrió."),
    q("¿Qué parte de la noticia se ubica entre el título y el cuerpo resumiendo lo central?", [["📋","El copete o bajada"],["🏷️","La volanta superior"],["📸","El epígrafe de la foto"]], 0, "Pista: es un párrafo breve que sintetiza lo más importante."),
    q("¿Qué pregunta básica del periodismo responde el momento en que ocurrió el hecho?", [["⏰","¿Cuándo ocurrió el hecho?"],["❓","¿Por qué sucedió el evento?"],["📍","¿Dónde tuvieron lugar las acciones relatadas?"]], 0, "Pista: tiempo, fecha y horario."),
    q("¿En qué tipo de publicación encontramos habitualmente noticias de actualidad?", [["📰","En diarios impresos y portales web"],["📖","En novelas de fantasía y aventuras"],["📜","En antologías de poemas tradicionales"]], 0, "Pista: informan sobre lo que ocurre día a día."),
    q("¿Qué característica es fundamental en una noticia informativa verídica?", [["🔍","Relatar sucesos reales comprobables"],["🧙","Inventar anécdotas de ficción"],["🎭","Escribir en versos con rima para teatro"]], 0, "Pista: deben ser hechos verídicos que se puedan demostrar."),
    q("¿Qué sector de la noticia desarrolla ampliamente la información con testimonios?", [["📝","El cuerpo principal de la noticia"],["🏷️","El titular destacado en la portada"],["📸","El epígrafe ubicado bajo una imagen"]], 0, "Pista: es la parte más extensa del texto periodístico."),
    q("¿Qué pregunta periodística indaga quiénes participaron de los acontecimientos?", [["👥","¿Quién o quiénes son los protagonistas?"],["📍","¿En qué paraje rural sucedió el evento?"],["⏰","¿A qué hora de la tarde concluyó todo?"]], 0, "Pista: identifica a las personas o instituciones involucradas."),
    q("¿Qué es la «volanta» en la estructura de una noticia gráfica?", [["🏷️","Una línea breve ubicada sobre el título"],["📸","Una fotografía en color de gran tamaño"],["📝","El último párrafo que cierra la nota escrita"]], 0, "Pista: anticipa el tema y se ubica antes del titular."),
    q("¿Por qué el periodista debe evitar dar opiniones personales en una noticia?", [["⚖️","Para mantener la objetividad del relato"],["⏳","Para acelerar los tiempos habituales de imprenta gráfica"],["🎨","Para dejar más renglones libres en la contratapa del diario"]], 0, "Pista: el objetivo es informar con neutralidad sin tomar partido."),
    q("¿Qué medio periodístico transmite noticias en formato sonoro y en vivo?", [["📻","La radio"],["📚","La enciclopedia"],["📖","El diccionario"]], 0, "Pista: medio de comunicación auditivo clásico en la Patagonia."),
    q("¿Cómo se llama el texto breve que resume las novedades de una escuela o barrio?", [["📰","Boletín informativo escolar o comunitario"],["🎭","Guion teatral preparado para actuar frente a toda la escuela"],["📜","Cuadernillo de rimas tradicionales y poemas de la infancia"]], 0, "Pista: comunica actividades escolares a familias y alumnos."),
    q("¿Qué pregunta responde la explicación de las causas que provocaron el hecho?", [["❓","¿Por qué y cómo sucedió el hecho?"],["⏰","¿A qué hora exacta comenzó a llover?"],["📍","¿En qué provincia vecina ocurrió todo?"]], 0, "Pista: causas y circunstancias del acontecimiento."),
    q("¿En qué orden se suele presentar la información en la noticia (pirámide invertida)?", [["🔻","De lo más importante a los detalles secundarios"],["🔺","Comenzando por anécdotas secundarias hasta llegar al centro"],["🔄","Siguiendo una estricta cronología horaria sin jerarquizar datos"]], 0, "Pista: los datos fundamentales van al comienzo."),
    q("¿Qué nombre recibe el profesional que investiga y redacta las noticias?", [["✍️","Periodista o cronista"],["🎭","Actor de teatro"],["🎨","Pintor de cuadros"]], 0, "Pista: trabaja en prensa, radio, televisión o medios digitales."),
    q("¿Qué sección de un diario incluye noticias sobre fútbol, básquet o atletismo?", [["⚽","La sección de deportes"],["🎭","La cartelera de espectáculos"],["🌱","El suplemento de economía"]], 0, "Pista: agrupa la información de torneos y competencias."),
    q("¿Por qué se incluyen declaraciones entre comillas en una noticia?", [["💬","Para citar palabras textuales de testigos"],["🎨","Para resaltar palabras difíciles"],["❓","Para señalar que la frase es dudosa"]], 0, "Pista: reproduce con exactitud lo que dijo el entrevistado."),
    q("¿Qué dato temporal suele acompañar al nombre del medio en el encabezado de un diario?", [["📅","La fecha del día de publicación"],["🎂","La fecha de fundación de la imprenta"],["⏳","El horario de cierre de edición"]], 0, "Pista: permite saber si la noticia es actual o antigua."),
    q("¿Qué diferencia a una noticia periodística de un cuento de ficción?", [["📰","La noticia relata hechos reales verdaderos"],["📖","El cuento siempre informa sobre el clima"],["🎭","La noticia busca rimar versos"]], 0, "Pista: un medio de prensa busca comunicar objetivamente la realidad."),
  ],
  2: [
    q("Leé: «RÍO GALLEGOS — La Escuela N.° 1 inauguró ayer su biblioteca con mil libros donados por vecinos». ¿Qué hecho se informa?", [["📚","La inauguración de una biblioteca escolar"],["🏫","El inicio del nuevo taller de computación y robótica escolar"],["🎭","Un encuentro de danzas tradicionales en el gimnasio del barrio"]], 0, "Pista: el texto destaca la apertura del nuevo espacio de lectura."),
    q("Leé: «EL CHALTÉN — Guardaparques rescataron a un cóndor herido en la montaña y lo trasladaron a un centro de recuperación». ¿Quiénes fueron los protagonistas del rescate?", [["🏔️","Los guardaparques del área protegida"],["👨‍🚒","Los miembros de la dotación de bomberos de la ciudad capital"],["👮","Los efectivos policiales de guardia en la comisaría del pueblo"]], 0, "Pista: personal encargado del cuidado del parque natural."),
    q("Leé: «PUERTO DESEADO — Ayer concluyó el censo costero registrando tres mil parejas de pingüinos en la ría». ¿Dónde se realizó el censo?", [["🌊","En la ría de Puerto Deseado"],["🏔️","En el lago del Parque Los Glaciares"],["🌾","En una estancia de la meseta central"]], 0, "Pista: localidad costera del norte santacruceño."),
    q("Leé: «CALAFATE — Una fuerte nevada cubrió de blanco la villa turística durante la madrugada del martes». ¿Cuándo ocurrió la nevada?", [["❄️","Durante la madrugada del día martes"],["☀️","Durante el caluroso atardecer de una jornada de domingo"],["🍂","Al promediar el mediodía de una jornada de viernes nublada"]], 0, "Pista: momento del día señalado en el texto."),
    q("Leé: «RÍO TURBIO — La feria de ciencias premió un proyecto de alumnos sobre energías renovables y viento patagónico». ¿Por qué fueron premiados los estudiantes?", [["🏆","Por su proyecto de energías renovables"],["🏃","Por ganar una carrera pedestre barrial"],["🎨","Por pintar un mural con témperas"]], 0, "Pista: motivo del reconocimiento en la feria científica."),
    q("Leé: «SAN JULIÁN — Artesanos locales exhibieron tejidos de lana y cerámicas en el paseo costero el último sábado». ¿Quiénes participaron de la muestra?", [["🧶","Artesanos locales de lana y cerámica"],["🚢","Marineros de barcos pesqueros lejanos"],["👨‍🍳","Pasteleros de una fábrica de alfajores"]], 0, "Pista: productores comunitarios de objetos artesanales."),
    q("Leé: «PERITO MORENO — El museo municipal sumó réplicas de pinturas rupestres para que los niños puedan aprender jugando». ¿Cuál es el objetivo de las réplicas?", [["🎨","Aprender jugando sobre arte rupestre"],["💰","Venderlas a coleccionistas"],["🧱","Decorar el patio de la municipalidad"]], 0, "Pista: finalidad didáctica para los escolares."),
    q("Leé: «CALETA OLIVIA — Vecinos plantaron doscientos álamos en el parque municipal para frenar el viento». ¿Qué acción comunitaria se llevó a cabo?", [["🌳","Plantación de álamos cortaviento"],["🏗️","Construcción de un puente vehicular"],["🧹","Pintura de las paradas de colectivos"]], 0, "Pista: sembrar árboles para proteger del viento."),
    q("Leé: «LOS ANTIGUOS — La cosecha de cerezas superó las expectativas gracias al buen clima de primavera». ¿Qué factor permitió el éxito de la cosecha?", [["🍒","El clima favorable en primavera"],["❄️","Las fuertes heladas de mitad de año"],["🚜","El aumento de las lluvias de invierno"]], 0, "Pista: condición climática que ayudó a la fruta."),
    q("Leé: «GOBERNADOR GREGORES — Una orquesta juvenil brindó un concierto folclórico en el centro cultural ante una sala colmada». ¿Qué tipo de evento artístico se celebró?", [["🎶","Un concierto de música folclórica"],["🎭","Una función de títeres para niños"],["🎬","La proyección de un documental"]], 0, "Pista: presentación musical con orquesta."),
    q("Leé: «RÍO GALLEGOS — Científicos alertaron sobre la necesidad de cuidar el estuario donde descansan aves migratorias». ¿Qué mensaje busca transmitir la noticia?", [["🪶","Proteger el hábitat de aves migratorias"],["🚢","Aumentar el tránsito de buques pesqueros"],["🏗️","Construir fábricas sobre la ribera"]], 0, "Pista: cuidado ambiental de los sitios de nidificación."),
    q("Leé: «EL CHALTÉN — Senderistas limpiaron cinco kilómetros de senderos recolectando residuos plásticos». ¿Qué problema ambiental enfrentaron los voluntarios?", [["🗑️","La basura acumulada en senderos"],["🐾","La falta de señalización en refugios"],["💧","El congelamiento de los arroyos"]], 0, "Pista: retiro de plásticos arrojados por visitantes."),
    q("Leé: «PUERTO SANTA CRUZ — Alumnos de 4.º grado crearon un periódico mural para difundir la historia de su pueblo». ¿Qué grado escolar impulsó el periódico mural?", [["🎒","Estudiantes de cuarto grado"],["🎓","Egresados del nivel secundario"],["👶","Niños del jardín de infantes"]], 0, "Pista: segundo ciclo de la escuela primaria."),
    q("Leé: «PIEDRA BUENA — El club náutico organizó una regata de kayaks en el río Santa Cruz con gran concurrencia». ¿En qué escenario natural se desarrolló la competencia?", [["🚣","En las aguas del río Santa Cruz"],["🌊","En las aguas del Mar Argentino"],["🏔️","En una laguna de cordillera"]], 0, "Pista: el gran río provincial que nace en el lago Argentino."),
    q("Leé: «28 DE NOVIEMBRE — Abrió una feria de platos tradicionales con empanadas caseras y pan de campo». ¿Qué productos gastronómicos se ofrecieron al público?", [["🥟","Empanadas caseras y pan de campo"],["🍣","Pescado frito con arroz blanco"],["🍕","Pescados frescos de la ría"]], 0, "Pista: comidas tradicionales elaboradas de forma casera."),
    q("Leé: «RÍO GALLEGOS — El club de astronomía invitó a observar la Luna con telescopios en la costanera». ¿Qué instrumento técnico se utilizó en la actividad?", [["🔭","Telescopios para observar el cielo"],["🔬","Microscopios de laboratorio escolar"],["📷","Cámaras fotográficas portátiles"]], 0, "Pista: aparato óptico para mirar cuerpos celestes."),
    q("Leé: «EL CALAFATE — El cuerpo de bomberos visitó las aulas para enseñar medidas de prevención de incendios». ¿Quiénes brindaron la capacitación escolar?", [["🚒","Los bomberos voluntarios"],["👨‍⚕️","Los médicos del hospital local"],["🧑‍🏫","Los profesores de educación física"]], 0, "Pista: servidores públicos dedicados al control del fuego."),
    q("Leé: «PUERTO DESEADO — Se avistaron delfines comersonii jugando cerca de la costa frente al muelle». ¿Qué especie marina fue observada por los vecinos?", [["🐬","Toninas overas (delfines comersonii)"],["🦈","Tiburones de aguas profundas"],["🦭","Lobos marinos de un pelo"]], 0, "Pista: pequeño cetáceo blanquinegro característico del litoral."),
    q("Leé: «RÍO TURBIO — La comunidad festejó la llegada de la primavera con un desfile de carrozas artesanales». ¿Qué celebración motivó el desfile vecinal?", [["🌸","La bienvenida a la primavera"],["❄️","El inicio del invierno"],["🍂","El cierre de las clases escolares"]], 0, "Pista: estación de las flores y del renacer vegetal."),
    q("¿Qué estrategia de lectura nos permite hallar rápidamente la fecha de un hecho en una noticia?", [["🔍","Buscar números, meses o días clave en el texto"],["📖","Leer el texto al revés palabra por palabra"],["✏️","Subrayar todos los sustantivos propios"]], 0, "Pista: rastreo visual de datos cronológicos en el texto."),
  ],
  3: [
    q("¿Cuál es el propósito comunicativo central de un texto expositivo?", [["💡","Explicar y transmitir información clara y objetiva"],["🎭","Divertir al público con bromas teatrales"],["🧙","Narrar aventuras mágicas inventadas"]], 0, "Pista: busca enseñar y divulgar conocimientos."),
    q("¿Cómo se organiza la información en los textos expositivos extensos?", [["📑","En párrafos agrupados bajo subtítulos temáticos"],["🎶","En estrofas regulares compuestas por versos con musicalidad"],["🎭","En intercambios de parlamentos dialogados entre personajes"]], 0, "Pista: cada párrafo profundiza un subtema específico."),
    q("¿Qué elementos visuales suelen acompañar a un texto explicativo escolar?", [["📊","Infografías, fotos, mapas y esquemas"],["🎭","Máscaras, vestimentas y telones para la puesta en escena"],["🎨","Caricaturas humorísticas y viñetas de entretenimiento"]], 0, "Pista: recursos gráficos que aclaran la lectura."),
    q("¿Qué tiempo verbal predomina en las definiciones de textos expositivos?", [["⏰","El tiempo presente del modo indicativo"],["📜","El pretérito imperfecto descriptivo para evocar recuerdos"],["🔮","El futuro compuesto condicional para formular hipótesis"]], 0, "Pista: expresa afirmaciones que siguen siendo válidas hoy."),
    q("¿Para qué se emplean los subtítulos en un texto de ciencias?", [["🏷️","Para ordenar los distintos subtemas"],["🎨","Para decorar los márgenes de la página"],["✍️","Para resumir la opinión del autor"]], 0, "Pista: guían la lectura anunciando cada parte."),
    q("¿Qué es la «idea principal» de un párrafo informativo?", [["🎯","La información clave e indispensable del párrafo"],["🔍","Un detalle curioso secundario"],["❓","Una pregunta al lector sin responder"]], 0, "Pista: si la quitamos, el texto pierde su sentido principal."),
    q("¿Dónde consultamos habitualmente textos expositivos para estudiar?", [["📚","En enciclopedias, manuales escolares y revistas científicas"],["📖","En libros de cuentos maravillosos y leyendas"],["🎭","En libretos para obras de títeres los relatos narrativos y textos de información"]], 0, "Pista: fuentes didácticas habituales de Ciencias Naturales y Sociales."),
    q("¿Por qué el lenguaje de un texto expositivo debe ser preciso y objetivo?", [["🎯","Para evitar confusiones en el lector"],["🪄","Para plantear adivinanzas misteriosas"],["🎪","Para generar suspenso y sorpresa"]], 0, "Pista: el fin es que el destinatario comprenda conceptos científicos."),
    q("¿Qué es una «definición» dentro de un texto expositivo?", [["📖","La explicación clara del significado de un concepto"],["🎨","Un dibujo con epígrafe aclaratorio"],["❓","Una duda formulada por el autor"]], 0, "Pista: aclara con exactitud qué es una cosa o fenómeno."),
    q("¿Qué recurso expositivo ilustra un concepto mediante casos concretos?", [["💡","La ejemplificación (ejemplo concreto)"],["📏","La rima consonante entre palabras"],["🎭","La acotación teatral escénica"]], 0, "Pista: se introduce con frases como «por ejemplo» o «como»."),
    q("¿Qué función cumple el párrafo de introducción en un texto expositivo?", [["🚪","Presentar el tema general que se explicará"],["🏁","Despedir al lector con un poema"],["📊","Mostrar únicamente gráficos numéricos"]], 0, "Pista: sitúa al lector en el tema antes del desarrollo."),
    q("¿Qué función cumple el párrafo de conclusión en un texto de divulgación?", [["🏁","Sintetizar las ideas centrales tratadas en el texto"],["🚪","Presentar un tema nuevo totalmente diferente"],["💬","Abrir un diálogo entre personajes"]], 0, "Pista: redondea y resume lo explicado en el texto."),
    q("¿Qué conector se suele emplear para reformular una idea con palabras más simples?", [["🔄","«Es decir» o «en otras palabras»"],["🛑","«Sin embargo» o «al contrario»"],["⏰","«Ayer por la tarde»"]], 0, "Pista: aclara un término difícil con lenguaje accesible."),
    q("¿Qué tipo de vocabulario predomina en un texto expositivo sobre glaciares?", [["🏔️","Vocabulario técnico y específico de la disciplina"],["🎭","Palabras coloquiales y expresiones informales"],["📜","Metáforas poéticas y figuras de ficción"]], 0, "Pista: términos propios de la geografía y las ciencias de la Tierra."),
    q("¿Qué recurso gráfico organiza datos en filas y columnas ordenadas?", [["📊","Una tabla o cuadro comparativo"],["📸","Una fotografía panorámica"],["🎨","Un mapa hidrográfico"]], 0, "Pista: permite comparar características de manera clara."),
    q("¿Por qué los textos expositivos no suelen incluir la primera persona «yo»?", [["👤","Para mantener un tono neutral, formal y objetivo"],["⏰","Porque se dirigen solo a adultos"],["📜","Porque se escriben únicamente en verso"]], 0, "Pista: la ciencia busca validez universal, no vivencias individuales."),
    q("¿Qué elemento paratextual resume el contenido de cada capítulo indicando su número de página?", [["📑","El índice temático general"],["🏷️","El código de barras de la tapa"],["📸","El epígrafe de la contratapa"]], 0, "Pista: lista ordenada de títulos con números de página."),
    q("¿Qué relación lógica une las frases en «El viento sopló con fuerza; por eso las ramas se quebraron»?", [["🔗","Relación de causa y consecuencia"],["⏳","Relación de tiempo futuro"],["🎭","Relación de diálogo dramático"]], 0, "Pista: una acción es motivo de lo que sucede luego."),
    q("¿Cómo se llama el texto breve que acompaña a un esquema señalando sus partes?", [["🏷️","Rótulo o referencia explicativa"],["📜","Verso suelto de rima asonante"],["💬","Parlamento de personaje teatral"]], 0, "Pista: flechitas con nombres de cada componente."),
    q("¿Qué estrategia de estudio ayuda a retener lo aprendido tras leer un texto expositivo?", [["📝","Subrayar ideas clave y elaborar resúmenes"],["😴","Cerrar el libro inmediatamente"],["🎨","Copiar el texto cambiando el orden de párrafos"]], 0, "Pista: técnicas de estudio activas que fijan conceptos."),
  ],
  4: [
    q("Leé: «El macá tobiano es un ave acuática exclusiva de Santa Cruz. Construye nidos flotantes con vinagrilla en lagunas altas». ¿Con qué material construye sus nidos?", [["🌿","Con vinagrilla, una planta acuática"],["🪨","Con piedras recogidas en la orilla"],["🪵","Con ramas gruesas de lenga"]], 0, "Pista: vegetal acuático presente en lagunas basálticas."),
    q("Leé: «El bosque andino se desarrolla por las abundantes lluvias que descargan los vientos del Pacífico sobre los Andes». ¿Por qué hay bosques en la cordillera?", [["🌧️","Por las lluvias y humedad del Pacífico"],["☀️","Por las altas temperaturas de verano"],["🌾","Porque los suelos son arenosos y secos"]], 0, "Pista: el viento oceánico descarga su vapor de agua en la cordillera."),
    q("Leé: «Las plantas en cojín crecen apretadas contra el suelo pedregoso. Esta forma semiesférica las protege del viento helado». ¿Qué ventaja les da su forma?", [["🛡️","Protección frente al viento y heladas"],["🎨","Llamar la atención de insectos lejanos"],["🕊️","Atraer a las aves de la meseta"]], 0, "Pista: adaptación a las ráfagas y rigores del clima."),
    q("Leé: «El guanaco posee almohadillas blandas en sus patas que evitan desgarrar las raíces de los pastos de la estepa». ¿Cómo protegen el suelo sus pisadas?", [["🦙","Sus almohadillas no cortan las raíces"],["🌱","Arrancan los pastos duros para que crezcan nuevos"],["🧱","Aplastan la tierra compactándola como piedra"]], 0, "Pista: anatomía de la pezuña del camélido autóctono."),
    q("Leé: «El huemul tiene un pelaje espeso que cambia de tonalidad con las estaciones, camuflándose entre los arbustos andinos». ¿Para qué le sirve cambiar de tono?", [["🦌","Para camuflarse entre la vegetación"],["❄️","Para absorber menos agua de lluvia"],["☀️","Para regular el calor del verano"]], 0, "Pista: mimetismo defensivo frente a depredadores."),
    q("Leé: «El glaciar Perito Moreno avanza sobre la península de Magallanes y forma un dique natural de hielo. Como consecuencia, las aguas del Brazo Rico quedan embalsadas y suben de nivel». ¿Cuál es la consecuencia del avance del glaciar?", [["🌊","El embalse y aumento del nivel del agua"],["🌋","La erupción de un volcán submarino"],["☀️","La crecida extraordinaria del río brazo Rico"]], 0, "Pista: el dique de hielo represa el cauce provocando que suba la cota."),
    q("Leé: «Las toninas overas son delfines pequeños y veloces que nadan en grupos cerca de la costa santacruceña persiguiendo cardúmenes». ¿De qué se alimentan?", [["🐟","De peces de cardúmenes costeros"],["🌾","De algas flotantes de la superficie"],["🍂","De moluscos enterrados en arena"]], 0, "Pista: presas marinas que nadan en bancos agrupados junto a calamares."),
    q("Leé: «Los alerces milenarios y las lengas son especies protegidas en los parques nacionales para evitar su tala y desaparición». ¿Por qué están protegidos?", [["🌲","Para evitar su tala y extinción"],["🪵","Para aprovecharlos como leña de calefacción"],["🏭","Para destinarlos a la industria del papel"]], 0, "Pista: conservación del patrimonio forestal nativo."),
    q("Leé: «En otoño, las hojas de la lenga se tornan rojizas y doradas antes de caer, permitiendo al árbol resistir las nevadas invernales». ¿Por qué caen sus hojas?", [["🍂","Para no congelarse y resistir el invierno"],["☀️","Porque necesitan mayor exposición a la luz solar otoñal"],["🐛","Porque los insectos del bosque dañan sus ramas principales"]], 0, "Pista: adaptación de los árboles de hoja caduca al frío."),
    q("Leé: «El cóndor andino aprovecha las corrientes térmicas ascendentes de aire para planear durante horas sin gastar energías». ¿Cómo logra planear tanto tiempo?", [["🦅","Usando corrientes de aire ascendentes"],["🪽","Moviendo las alas a gran velocidad sin pausa"],["⚡","Acelerando el vuelo en picada continua"]], 0, "Pista: vuelo planeador sostenido por el viento."),
    q("Leé: «El calafate es un arbusto espinoso con frutos comestibles de color azul oscuro con los que se elaboran dulces tradicionales». ¿Qué se elabora con sus frutos?", [["🫐","Dulces y mermeladas tradicionales"],["🍞","Harina molida artesanal para amasar panes de campo"],["🥤","Bebidas saborizadas industriales de consumo masivo"]], 0, "Pista: producto típico de la gastronomía santacruceña."),
    q("Leé: «El zorro colorado recorre grandes distancias nocturnas cazando roedores e insectos, ayudando a controlar sus poblaciones». ¿Qué rol ecológico cumple?", [["🦊","Controla poblaciones de roedores"],["🌾","Dispersa semillas de árboles grandes"],["🐟","Caza peces en ríos profundos"]], 0, "Pista: depredador carnívoro que equilibra el ecosistema."),
    q("Leé: «La restinga costera queda al descubierto con la bajamar, formando piletones donde viven mejillones, anémonas y caracoles». ¿Cuándo queda al descubierto?", [["🌊","Durante las horas de bajamar"],["🌕","Únicamente en noches de tormenta"],["☀️","Al mediodía durante la pleamar"]], 0, "Pista: retroceso periódico de las aguas marinas."),
    q("Leé: «El choique macho es el encargado de empollar los huevos en el nido comunal y de cuidar a los pichones tras nacer». ¿Qué rol asume el macho de la especie?", [["🪶","Incubar los huevos y cuidar a los pichones"],["🦅","Migrar hacia el norte al comenzar el invierno"],["🐆","Buscar un nido nuevo cada semana"]], 0, "Pista: singular comportamiento parental del ave patagónica."),
    q("Leé: «El suelo de la estepa patagónica es pedregoso y permeable, lo que hace que el agua de lluvia escurra rápido hacia la profundidad». ¿Cómo es su suelo?", [["🪨","Pedregoso y de rápida absorción"],["💧","Arcilloso, húmedo y anegado por precipitaciones constantes"],["🏖️","Arenoso, impermeable y desprovisto de minerales básicos"]], 0, "Pista: canto rodado y arena volcánica con drenaje veloz."),
    q("Leé: «Los pingüinos de Magallanes viajan miles de kilómetros por el mar cada invierno siguiendo cardúmenes de peces hacia aguas templadas». ¿Por qué viajan en invierno?", [["🐧","Para alimentarse en aguas templadas"],["🏖️","Para descansar en playas arenosas"],["🏠","Para cambiar de nido todos los años"]], 0, "Pista: migración estacional en busca de alimento."),
    q("Leé: «La mata negra es un arbusto abundante en la meseta cuyo follaje oscuro y resinoso la protege de la sequedad del aire». ¿Qué sustancia la protege?", [["🌿","Sustancias resinosas en sus ramas"],["💧","Una capa permanente de humedad"],["🧊","Espinas que acumulan escarcha"]], 0, "Pista: resina vegetal que impermeabiliza sus hojas."),
    q("Leé: «Las lagunas de la meseta santacruceña tienen aguas salobres ricas en algas diminutas que alimentan a bandadas de flamencos australes». ¿Qué atrae a los flamencos?", [["🦩","Las algas diminutas de las lagunas"],["🐟","Peces grandes de río correntoso"],["🌾","Los pastizales húmedos de la orilla"]], 0, "Pista: alimento filtrado por el pico del ave rosada."),
    q("Leé: «El bosque petrificado conserva troncos fósiles de araucarias de 150 millones de años, testigos de un clima cálido y húmedo del pasado». ¿Qué demuestran los fósiles?", [["🪵","Que el clima antiguo era cálido y húmedo"],["❄️","Que la región siempre tuvo glaciares"],["🏜️","Que nunca crecieron árboles en la zona"]], 0, "Pista: evidencia fósil de condiciones ambientales tropicales en la región."),
    q("Leé la oración: «En primavera se produce el deshielo de la nieve acumulada en las altas cumbres». ¿Qué palabra significa 'derretimiento o disolución de la nieve o hielo por el calor'?", [["💧","Deshielo"],["🪵","Foliación"],["🌿","Arboleda"]], 0, "Pista: paso del hielo o nieve al estado líquido."),
  ],
  5: [
    q("¿Qué tipo de texto narra de forma ordenada la vida de una persona real?", [["📖","La biografía histórica"],["📰","La noticia periodística del día"],["📜","La fábula tradicional con moraleja"]], 0, "Pista: relata desde el nacimiento hasta la obra de la persona."),
    q("¿En qué orden se presentan casi siempre los hechos en una biografía?", [["⏳","En orden cronológico secuencial"],["🔀","En orden desordenado al azar"],["🎭","Desde el final hacia el comienzo"]], 0, "Pista: sigue la línea temporal de la vida del biografiado."),
    q("¿Cómo se llama el texto en el que una persona narra su propia historia?", [["✍️","Autobiografía"],["📑","Biografía autorizada"],["📰","Crónica periodística"]], 0, "Pista: el prefijo auto- significa 'uno mismo'."),
    q("¿Qué conectores temporales son característicos en un relato biográfico?", [["🔗","«A los diez años», «luego», «más tarde»"],["🛑","«Pero», «sin embargo», «en cambio»"],["➕","«También», «incluso», «además»"]], 0, "Pista: marcan hitos y edades en el transcurso del tiempo."),
    q("¿En qué persona gramatical se redacta la biografía de un explorador histórico?", [["👤","En tercera persona (él o ella)"],["👥","En primera persona del plural (nosotros)"],["🗣️","En segunda persona informal (vos)"]], 0, "Pista: el autor habla sobre la trayectoria de otro individuo."),
    q("¿Qué datos suelen figurar en el párrafo inicial de una biografía clásica?", [["👶","Lugar y fecha de nacimiento y familia"],["🏆","El inventario pormenorizado de los premios y condecoraciones"],["🗣️","Las impresiones subjetivas de vecinos y testigos ocasionales"]], 0, "Pista: cuándo y dónde vino al mundo el personaje."),
    q("¿Qué tiempo verbal predomina al narrar los logros de un pionero patagónico?", [["📜","El pretérito perfecto simple del pasado"],["🔮","El tiempo futuro del indicativo para proyectos pendientes"],["💭","El modo subjuntivo para expresar deseos que no ocurrieron"]], 0, "Pista: acciones concluidas como «nació», «exploró», «fundó»."),
    q("¿Qué información es indispensable al narrar la trayectoria de un científico?", [["🔬","Sus investigaciones, descubrimientos y aportes"],["👔","Los detalles de la vestimenta cotidiana que usaba en su hogar"],["⏰","Los hábitos estrictos que mantenía en sus horarios de comida"]], 0, "Pista: las contribuciones científicas que hicieron trascendente su vida."),
    q("¿Qué recurso gráfico ayuda a visualizar las etapas de vida en una biografía?", [["⏳","Una línea de tiempo cronológica"],["📊","Un gráfico de barras estadísticas"],["🎨","Un mapa de rutas comerciales"]], 0, "Pista: diagrama recto que ordena fechas sucesivas."),
    q("¿Qué diferencia existe entre una biografía y una novela de aventuras inventada?", [["📚","La biografía relata hechos históricos reales"],["📰","La novela relata solo noticias periodísticas"],["🧙","La biografía inventa magos y hechizos"]], 0, "Pista: esta obra testimonial se basa en documentación verídica."),
    q("¿Cómo se llama el hito en que concluye habitualmente una biografía histórica?", [["🏁","El fallecimiento y el legado cultural"],["🎒","El primer día de escuela primaria"],["🎒","El viaje de egresados de secundaria"]], 0, "Pista: cierra con el recuerdo y la herencia del personaje."),
    q("¿Qué documentos consulta un historiador para redactar una biografía rigurosa?", [["📜","Cartas, actas de nacimiento, diarios y fotos"],["📖","Historietas cómicas con superhéroes"],["🎮","Folletos publicitarios modernos"]], 0, "Pista: fuentes primarias testimoniales de la época."),
    q("¿Por qué se destacan los obstáculos superados por un pionero en su biografía?", [["💪","Para mostrar su esfuerzo, perseverancia y valentía"],["🎟️","Para promocionar la venta de libros"],["🎭","Para hacer reír al público escolar y enriquecer el vocabulario utilizado al escribir"]], 0, "Pista: resalta la capacidad de sobreponerse a dificultades."),
    q("¿Qué conector causal explica el motivo de una decisión en la biografía?", [["💡","«Debido a que» o «porque»"],["⏰","«Mientras tanto» o «luego»"],["📍","«En la esquina» o «cerca»"]], 0, "Pista: introduce la causa de las acciones del personaje."),
    q("¿Qué parte de la biografía destaca el impacto de la persona en la sociedad?", [["🌟","El párrafo sobre su legado y memoria histórica"],["👶","El certificado de nacimiento infantil"],["🏷️","El título con su nombre completo"]], 0, "Pista: cómo influyó su obra en las generaciones siguientes."),
    q("¿En qué texto autobiográfico una persona suele anotar vivencias día a día?", [["📔","En un diario personal o cuaderno íntimo"],["📰","En una noticia policial de prensa"],["📜","En un poema de diez versos las lecturas compartidas durante el ciclo escolar"]], 0, "Pista: anotaciones fechadas en primera persona."),
    q("¿Qué título sería el más adecuado para una biografía escolar patagónica?", [["📖","«Vida y exploraciones del perito Moreno»"],["📰","«Llegó el frío a la ciudad: crónica de ayer»"],["📜","«Reglamento para el cuidado del aula escolar»"]], 0, "Pista: indica la figura histórica y su labor principal."),
    q("¿Qué dato confirma la veracidad de los hechos relatados en una biografía?", [["🔍","Fechas, lugares y testimonios de fuentes históricas"],["💭","Los sueños inventados que el autor imagina de noche"],["🎨","Los dibujos decorativos que se agregan en la portada"]], 0, "Pista: elementos históricos corroborables en archivos."),
    q("¿Por qué una biografía puede incluir anécdotas de la infancia del personaje?", [["✨","Para humanizar al personaje y conectar con el lector"],["📜","Para cambiar las fechas históricas y asegurar la correcta comprensión del texto"],["🎭","Para transformar la historia en un chiste"]], 0, "Pista: genera empatía mostrando sus primeros intereses."),
    q("¿Qué profesión ejercieron muchas mujeres pioneras destacadas en los parajes rurales patagónicos?", [["👩‍🏫","Maestras rurales y enfermeras comunitarias"],["👑","Gobernadoras virreinales de ultramar"],["🧑‍🚀","Aviadoras comerciales de reacción"]], 0, "Pista: mujeres pioneras que fundaron escuelas y postas de salud."),
  ],
  6: [
    q("Leé: «Francisco P. Moreno exploró los ríos patagónicos en 1877 y en 1903 donó tierras para crear el primer parque nacional argentino». ¿Qué donación histórica realizó?", [["🏞️","Tierras para crear el primer parque nacional"],["🚢","Un velero ballenero de exploración para la navegación austral"],["🏛️","Un predio urbano destinado a oficinas de la gobernación"]], 0, "Pista: origen de la conservación de parques nacionales."),
    q("Leé: «Carlos María Moyano fue un marino y explorador argentino que en 1884 fue designado primer gobernador del Territorio de Santa Cruz». ¿Qué designación recibió en 1884?", [["🏛️","Primer gobernador del territorio provincial"],["⚓","Capitán de un buque mercante extranjero"],["👨‍🏫","Maestro de escuela en Puerto Deseado"]], 0, "Pista: máxima autoridad civil territorial designada."),
    q("Leé: «En 1878, el explorador Carlos María Moyano remontó el río Santa Cruz en una chalupa hasta alcanzar sus nacientes». ¿Qué medio de transporte utilizó?", [["🛶","Una pequeña chalupa a remo y vela"],["🛳️","Un buque a vapor de tres chimeneas"],["🚤","Una chalupa grande a vela y remo"]], 0, "Pista: embarcación rústica para remontar la corriente fluvial."),
    q("Leé: «El padre Alberto De Agostini fue un sacerdote salesiano y fotógrafo que exploró las altas cumbres y glaciares patagónicos». ¿Qué herramientas utilizó en sus exploraciones?", [["📷","Fotografía y mapas de alta montaña"],["🎨","Pinturas al óleo y lienzos gigantes"],["📱","Dispositivos de comunicación satelital"]], 0, "Pista: pionero de retratos de época y cartografía austral."),
    q("Leé: «Luis Piedra Buena nació en Carmen de Patagones y navegó las costas australes salvando a marineros náufragos con su goleta». ¿Por qué acción humanitaria fue recordado?", [["🛟","Por rescatar la vida de marineros náufragos"],["⚔️","Por comandar flotas armadas en enfrentamientos navales bélicos"],["🌾","Por adquirir grandes extensiones rurales para el pastoreo ovino"]], 0, "Pista: noble labor de rescate en el mar del sur."),
    q("Leé: «En 1859, Luis Piedra Buena estableció una factoría y puesto de avanzada argentino en la isla Pavón, sobre el río Santa Cruz». ¿En qué lugar fundó este histórico puesto?", [["🏝️","En la isla Pavón del río Santa Cruz"],["🏖️","En las costas desérticas del lago San Martín cordillerano"],["⚓","En el muelle pesquero de la localidad de Caleta Olivia"]], 0, "Pista: sitio histórico sobre el curso fluvial donde fundó la factoría."),
    q("Leé: «El cacique tehuelche Casimiro Biguá juró fidelidad a la bandera argentina reconociendo la soberanía nacional». ¿Qué hecho cívico trascendente protagonizó?", [["🇦🇷","La jura de lealtad a la bandera nacional"],["⚔️","Un enfrentamiento armado contra otros grupos"],["📜","La compra de tierras en la cordillera"]], 0, "Pista: acto solemne de reconocimiento del pabellón celeste y blanco."),
    q("Leé: «El botánico Carlos Spegazzini recorrió Santa Cruz recolectando y catalogando plantas y hongos nativos para la ciencia». ¿Qué aporte realizó a la ciencia?", [["🍄","Clasificó especies de plantas y hongos nativos"],["🦕","Halló esqueletos completos de dinosaurios"],["🪙","Relatos orales de viajeros europeos"]], 0, "Pista: pionero de la botánica y micología argentina."),
    q("Leé: «En 1928, el aviador Gunther Plüschow realizó los primeros vuelos sobre canales y glaciares patagónicos a bordo de su hidroavión Tsingtau». ¿Cómo se llamaba su aeronave?", [["✈️","El hidroavión Tsingtau"],["🚁","El helicóptero Cóndor Austral"],["🎈","Un aerostato sin motor"]], 0, "Pista: aeronave alemana con la que sobrevoló la Patagonia."),
    q("Leé: «En 1834, el naturalista Charles Darwin y el capitán FitzRoy remontaron el río Santa Cruz en botes balleneros arrastrados contra la corriente». ¿En qué embarcaciones remontaron el río?", [["🛶","En botes balleneros a remo y sirga"],["🚢","En un buque a vapor de tres chimeneas"],["⛵","A caballo con baqueanos de la zona"]], 0, "Pista: el gobierno nacional le encomendó relevar lagos y cordones montañosos."),
    q("Leé: «En 1934 se sancionó la ley que creó la Dirección de Parques Nacionales, protegiendo grandes áreas de bosque andino y glaciares». ¿Qué objetivo tuvo esa ley histórica?", [["🌲","Crear y preservar áreas naturales protegidas"],["🏭","Instalar aserraderos para talar bosques"],["🏗️","Construir autopistas sobre la cordillera"]], 0, "Pista: legislación base para conservar los parques nacionales."),
    q("Leé: «En un relato sobre la vida rural: 'Los puesteros recorrían leguas a caballo para controlar las ovejas en los cañadones'». ¿Qué transporte usaban habitualmente?", [["🐎","Caballos resistentes a las distancias de la estepa"],["🚗","Automóviles veloces por caminos asfaltados"],["🚂","Carretas tiradas por bueyes"]], 0, "Pista: el animal tradicional de trabajo en la meseta."),
    q("Leé: «En 1937, el decreto nacional de creación del Parque Nacional Los Glaciares protegió el campo de hielo y especies amenazadas como el huemul». ¿Qué ciervo andino se buscaba preservar?", [["🦌","Al huemul andino"],["🦊","Al zorro colorado"],["🦙","Al guanaco de estepa"]], 0, "Pista: ciervo nativo declarado Monumento Natural."),
    q("Leé: «A comienzos del siglo XX, colonos pioneros galeses e hispanos abrieron caminos en la meseta comunicando las costas con la cordillera». ¿Qué logro alcanzaron?", [["🛤️","Trazaron huellas y caminos de comunicación"],["✈️","Construyeron aeropuertos internacionales"],["🚢","Cavaron canales navegables de costa a costa"]], 0, "Pista: apertura de rutas de transporte y abastecimiento."),
    q("Leé: «En 1943 comenzaron los primeros trabajos sistemáticos para extraer carbón mineral en los yacimientos de Río Turbio». ¿Qué recurso mineral se comenzó a explotar?", [["⛏️","El carbón mineral"],["🪙","El oro aluvial"],["🪨","El mármol blanco"]], 0, "Pista: combustible fósil sólido fundamental de la cuenca carbonífera."),
    q("Leé: «En un texto de ficción sobre la época pionera: 'El maestro rural organizó una biblioteca escolar con libros traídos en carretas'». ¿Cómo llegaron los libros?", [["📦","Transportados en carretas de campo"],["🚂","Cargados en un tren expreso de pasajeros"],["🚚","En barcazas de madera río abajo"]], 0, "Pista: las cartas personales y diarios de expedición de la época."),
    q("Leé: «En 1877, Francisco Moreno llegó a las nacientes del río Santa Cruz y bautizó al gran espejo de agua como Lago Argentino». ¿Qué fecha recuerda este hecho?", [["📅","En el año 1877"],["📅","En el año 1903"],["📅","En el año 1934"]], 0, "Pista: expedición histórica del perito Moreno."),
    q("Leé: «En las huelgas rurales de 1920 y 1921, trabajadores de estancias santacruceñas reclamaron mejoras básicas en sus condiciones de trabajo». ¿Quiénes fueron los protagonistas?", [["🐑","Los peones y esquiladores rurales"],["⚓","Los capitanes de buques extranjeros"],["🏛️","Los jueces de la capital nacional"]], 0, "Pista: trabajadores del campo en la llamada Patagonia Rebelde."),
    q("¿Qué conector temporal formal indica que un acontecimiento sucedió después de otro en una biografía?", [["⏳","«Posteriormente» o «años después»"],["🛑","«Sin embargo»"],["➕","«Además de esto»"]], 0, "Pista: sinónimo formal de 'más tarde' o 'con el correr de los años'."),
    q("¿Por qué es importante verificar las fuentes y fechas en un texto histórico o biográfico?", [["🔍","Para asegurar la exactitud y veracidad de los hechos relatados"],["🎨","Para que la biografía tenga más adjetivos calificativos y facilitar la lectura fluida del relato escolar"],["⏰","Para acortar el tiempo de lectura"]], 0, "Pista: el rigor histórico depende de datos documentados."),
  ],
  7: [
    q("¿Cuáles son las dos partes fundamentales de una receta de cocina tradicional?", [["📋","Lista de ingredientes y pasos de preparación"],["🎭","Personajes cómicos, conflicto dramático y moraleja"],["📰","Titular de portada, copete y epígrafe"]], 0, "Pista: conjunto ordenado de directivas para alcanzar un resultado."),
    q("¿En qué modo y forma verbal suelen redactarse las acciones de un instructivo?", [["🎯","En infinitivo (-ar/-er/-ir) o imperativo"],["🎨","Describir minuciosamente el aspecto visual de un entorno"],["💭","Reflexionar sobre las conductas y actitudes de un personaje"]], 0, "Pista: verbos que dan instrucciones claras de hacer algo."),
    q("¿Por qué es indispensable que los pasos de un instructivo estén numerados?", [["🔢","Para respetar el orden secuencial correcto"],["🎨","Para decorar las hojas del manual escolar"],["⏳","Para calcular la hora del recreo en el patio"]], 0, "Pista: las directivas u órdenes deben mantener un curso correlativo."),
    q("¿Qué texto de uso cotidiano es un ejemplo de texto instructivo?", [["🎮","El reglamento de un juego de mesa"],["🔮","En tiempo futuro del modo subjuntivo para acciones lejanas"],["💭","En tiempo pretérito pluscuamperfecto para evocar recuerdos"]], 0, "Pista: explica paso a paso las reglas para jugar sin trampas."),
    q("¿Qué sucede si en una receta de cocina alteramos el orden de los pasos?", [["⚠️","La preparación puede fallar y no cocinarse bien"],["🏆","El plato se cocinará mucho más rápido"],["✨","Los ingredientes cambiarán de sabor automáticamente"]], 0, "Pista: las fórmulas que indican qué hacer paso a paso."),
    q("Marcá el verbo que está expresado en infinitivo para un paso instructivo:", [["🥣","Mezclar la harina con dos huevos"],["📖","En novelas policiales estructuradas por capítulos extensos"],["🎭","En textos teatrales compuestos por actos, escenas y cuadros"]], 0, "Pista: termina con la desinencia regular -ar."),
    q("¿Qué información suele encabezar las instrucciones para armar una carpa?", [["🏕️","Materiales y piezas que contiene el equipo"],["📜","Una poesía alusiva a las montañas"],["📰","Las noticias del día del campamento"]], 0, "Pista: dan precisión visual sobre la forma correcta de armar."),
    q("¿Cómo debe ser el lenguaje de las consignas de una actividad escolar?", [["🎯","Claro, breve, preciso y sin ambigüedades"],["🪄","Misterioso y con acertijos complicados"],["🎭","Poético con rimas teatrales extensas"]], 0, "Pista: el estudiante debe saber con exactitud qué resolver."),
    q("¿Qué tipo de texto instructivo encontramos señalizado en las salidas de emergencia de un colectivo?", [["🚨","Instrucciones de evacuación y uso del martillo de emergencia"],["📖","Un relato de aventuras en la ruta"],["📜","Una carta de despedida formal"]], 0, "Pista: pasos rápidos a seguir en caso de siniestro vial."),
    q("¿Qué función cumplen las imágenes o esquemas en un manual de instrucciones?", [["🖼️","Guiar visualmente cómo encastrar cada parte"],["🎨","Aumentar el valor comercial del libro"],["🧙","Mostrar personajes cómicos"]], 0, "Pista: apoyo gráfico para armar o manipular piezas."),
    q("¿Qué conector de orden se utiliza habitualmente al iniciar un instructivo?", [["1️⃣","«En primer lugar» o «primero»"],["🏁","«Por último» o «finalmente»"],["🛑","«Sin embargo»"]], 0, "Pista: señala el punto de partida de la secuencia."),
    q("¿Qué conector se suele emplear en el paso de cierre de una receta?", [["🏁","«Finalmente» o «por último»"],["1️⃣","«Para empezar la receta»"],["🔄","«Antes de comenzar»"]], 0, "Pista: indica la conclusión de la preparación."),
    q("¿Qué tipo de texto es el prospecto que acompaña a un medicamento?", [["💊","Un instructivo médico de dosis, modo de uso y precauciones"],["📰","Una noticia sobre el hospital provincial"],["🎭","Un libreto de divulgación científica"]], 0, "Pista: detalla modo de uso, contraindicaciones y conservación."),
    q("¿Por qué un reglamento escolar de convivencia es un texto normativo e instructivo?", [["🤝","Establece normas y pautas claras de respeto mutuo"],["🏆","Premia con notas al alumno que llegue primero"],["🎨","Obliga a forrar los cuadernos de un solo color"]], 0, "Pista: orienta las conductas para una convivencia armónica."),
    q("Marcá el verbo redactado en modo imperativo (orden directa):", [["👉","«Cortá el papel por la línea punteada»"],["📜","«El papel era cortado lentamente con tijera»"],["🔮","«Cortaremos el papel mañana en clase»"]], 0, "Pista: indica una acción que se ordena realizar."),
    q("¿Qué elemento suele indicar la cantidad exacta de ingredientes en una receta?", [["⚖️","Medidas de peso y capacidad (gramos, mililitros, tazas)"],["⏰","La hora en que se redactó la receta"],["📏","La distancia a la panadería"]], 0, "Pista: verbos que señalan mandatos o directivas concretas."),
    q("¿Qué parte de las instrucciones de un juego explica cómo se gana la partida?", [["🏆","El objetivo del juego y la condición de victoria"],["🎲","El color de los dados incluidos en la caja"],["📦","El material con que se fabricó el tablero"]], 0, "Pista: indica qué meta se debe alcanzar para ganar."),
    q("¿Por qué en un instructivo se evitan opiniones personales como «a mí me gusta»?", [["🎯","Porque debe ser funcional, neutral y objetivo para cualquier usuario"],["⏰","Porque los autores no tienen preferencias"],["📜","Porque las opiniones impiden imprimir el manual debido"]], 0, "Pista: la instrucción es práctica y busca que cualquiera la ejecute."),
    q("¿Qué tipo de signo visual se usa con frecuencia para listar ingredientes o materiales?", [["•","Puntos o guiones de enumeración (viñetas)"],["❓","Signos de interrogación de apertura"],["¡!","Signos de exclamación triples"]], 0, "Pista: marcas gráficas para ordenar ítems de una lista."),
    q("¿Qué precaución de seguridad básica suele figurar en instructivos de experimentos escolares?", [["⚠️","«Realizar la actividad bajo la supervisión de un adulto»"],["🎭","«Memorizar los nombres de todos los tubos de ensayo»"],["🏃","«Completar la experiencia en menos de un minuto»"]], 0, "Pista: aviso que protege a los niños de riesgos o accidentes."),
  ],
  8: [
    q("¿Qué signo de puntuación se escribe inmediatamente tras el saludo inicial de una carta?", [["✉️","Dos puntos (:)"],["🛑","Punto final (.)"],["❓","Signos de pregunta (¿?)"]], 0, "Pista: por ejemplo: «Querida abuela:» o «Estimado director:»."),
    q("¿Qué datos encabezan tradicionalmente una carta personal escrita en papel?", [["📍","Lugar y fecha de redacción"],["🎨","Describir minuciosamente las características físicas de un sitio"],["🎭","Ensayar los parlamentos cómicos de una obra teatral escolar"]], 0, "Pista: «Río Gallegos, 15 de marzo de 2026»."),
    q("¿Qué parte de la carta contiene el mensaje que se desea comunicar al lector?", [["📝","El cuerpo principal de la carta"],["✉️","El sobre postal exterior"],["🏷️","La posdata al pie de página"]], 0, "Pista: allí se desarrollan las anécdotas, noticias o saludos."),
    q("¿Cómo se llama la fórmula breve y afectuosa antes de la firma en una carta?", [["👋","La despedida o saludo final"],["📌","Se anota siempre al inicio de la página antes del saludo"],["🔒","Debe mantenerse reservada sin darse a conocer al receptor"]], 0, "Pista: la enseñanza final o consejo práctico que deja el relato."),
    q("¿Para qué se utiliza la sigla «P.D.» (posdata) al final de una carta?", [["✍️","Para agregar un mensaje breve olvidado tras firmar"],["🏷️","Para indicar el código postal de la localidad"],["📍","Para anotar el número de teléfono del correo"]], 0, "Pista: se escribe debajo de la rúbrica para sumar un dato de último momento."),
    q("¿Quién es el «destinatario» en una comunicación epistolar?", [["📬","La persona a quien va dirigida la carta"],["📖","En recopilaciones de novelas juveniles y leyendas populares"],["🎭","En antologías teatrales compuestas por sainetes y comedias"]], 0, "Pista: es quien recibe y lee la correspondencia."),
    q("¿Quién es el «remitente» de un sobre o mensaje de correo?", [["✍️","La persona que escribe y envía la carta"],["📬","La persona que recibe el mensaje en su domicilio"],["🏢","El empleado de la sucursal postal"]], 0, "Pista: sus datos suelen ir en el reverso del sobre."),
    q("¿Qué ventaja principal ofrece el correo electrónico frente a la carta tradicional?", [["⚡","Llega de forma casi instantánea a destino"],["📜","Permite coleccionar estampillas en el sobre"],["✍️","Requiere usar pluma y tinta sobre papel"]], 0, "Pista: viaja por internet y se recibe en pocos segundos."),
    q("¿Qué campo de un correo electrónico resume brevemente el motivo del mensaje?", [["✉️","El campo «Asunto»"],["👥","La lista de contactos"],["📎","La carpeta de mensajes eliminados"]], 0, "Pista: anticipa de qué trata el correo antes de abrirlo."),
    q("¿Qué símbolo separa el nombre de usuario del servidor en una dirección de correo?", [["📧","La arroba (@)"],["#️⃣","El signo numeral (#)"],["💲","El signo pesos ($)"]], 0, "Pista: por ejemplo: alumno@escuela.edu.ar."),
    q("¿Qué función cumple el ícono del clip al redactar un correo electrónico?", [["📎","Adjuntar archivos, fotos o documentos"],["🗑️","Borrar definitivamente todo el mensaje"],["🖨️","Imprimir la pantalla en papel"]], 0, "Pista: sirve para sumar registros gráficos o carpetas al mensaje."),
    q("¿Qué tipo de carta se envía a una autoridad escolar pidiendo permiso para una salida educativa?", [["📜","Una carta formal o de solicitud"],["💌","Una carta informal familiar"],["🎨","Una tarjeta de salutación artística"]], 0, "Pista: utiliza un lenguaje respetuoso y fórmulas de cortesía protocolar."),
    q("¿Qué fórmula de saludo inicial es adecuada para una carta formal dirigida al intendente?", [["🏛️","«Estimado señor intendente:»"],["👋","«¡Hola, qué tal, cómo va todo!»"],["💬","«¿Qué novedades tenés por el municipio?»"]], 0, "Pista: saludo formal con tratamiento de respeto institucional."),
    q("¿Qué tratamiento de cortesía suele emplearse en una carta formal?", [["🤝","Usted (con sus correspondientes formas verbales)"],["🗣️","Vos (con tuteo informal cotidiano)"],["👥","Vosotros (en plural peninsular)"]], 0, "Pista: recurso donde objetos o animales adquieren cualidades humanas."),
    q("¿Qué dato indispensable debe figurar en el sobre para que el cartero llegue al domicilio?", [["🏠","Nombre del destinatario, calle, número, localidad y código postal"],["🎨","El color favorito del destinatario"],["🎂","La fecha de nacimiento de quien recibe la carta"]], 0, "Pista: habla de la arrogancia y cómo subestimar a los demás perjudica."),
    q("¿Cómo se llama el sello postal autoadhesivo que se coloca en el sobre para abonar el envío?", [["🏷️","Estampilla o sello postal"],["🎫","Boleto de transporte urbano"],["🪙","Ficha metálica del correo"]], 0, "Pista: etiqueta con valor fiscal emitida para el franqueo oficial."),
    q("¿Por qué en una carta personal a un amigo se utiliza un tono cercano e informal?", [["❤️","Porque existe confianza y afecto con el receptor"],["⚖️","Porque el correo prohíbe el lenguaje formal a familiares"],["📜","Porque las cartas personales no llevan firma"]], 0, "Pista: se escribe a familiares, amigos o compañeros queridos."),
    q("¿Qué diferencia al correo electrónico de una carta tradicional respecto al soporte físico?", [["💻","El correo es un mensaje digital y la carta es en papel"],["✉️","La carta se transmite por ondas de radio"],["📜","El correo solo se puede leer una sola vez"]], 0, "Pista: envío virtual instantáneo frente a soporte tradicional impreso."),
    q("¿Qué se debe revisar en una carta o correo antes de enviarlo definitivamente?", [["🔍","Ortografía, claridad de ideas y datos correctos del destinatario"],["🎨","Que tenga dibujos decorativos en los bordes"],["⏰","Que el envío coincida con las doce en punto"]], 0, "Pista: revisión atenta para corregir fallas y verificar a quién va dirigida."),
    q("¿Dónde se conservan las cartas y documentos antiguos de los primeros pobladores para su estudio?", [["📚","En el archivo histórico o epistolario"],["📰","En la hemeroteca de diarios del día"],["🏪","En el almacén de ramos generales los géneros discursivos trabajados en la escuela"]], 0, "Pista: fondo documental que conserva correspondencia de pioneros."),
  ],
  9: [
    q("¿Qué característica distingue a los personajes de la mayoría de las fábulas?", [["🦊","Animales personificados que hablan y actúan como humanos"],["🧙","Seres fantásticos con varitas y pociones mágicas"],["👑","Reyes y caballeros de la Edad Media"]], 0, "Pista: seres de la naturaleza que asumen virtudes y defectos de personas."),
    q("¿Qué es la «moraleja» en una fábula clásica?", [["💡","Una enseñanza o reflexión ética sobre la conducta"],["🎭","El decorado donde se ambienta la historia"],["📜","El título del autor de la fábula"]], 0, "Pista: moraleja final sobre el proceder de los seres humanos."),
    q("¿En qué lugar de la fábula se ubica habitualmente la moraleja explícita?", [["🏁","Al final del relato como conclusión reflexiva"],["📍","En la primera línea del texto"],["🏷️","En el índice del libro de lectura"]], 0, "Pista: se enuncia tras resolverse el conflicto."),
    q("¿Qué recurso literario consiste en otorgar cualidades humanas a animales o cosas?", [["✨","La personificación o prosopopeya"],["📰","En crónicas informativas publicadas en los periódicos locales"],["🔬","En manuales didácticos dedicados a la investigación botánica"]], 0, "Pista: hacer que un zorro hable o que el viento dialogue."),
    q("En la fábula de la liebre y la tortuga, ¿qué virtud triunfa sobre la soberbia?", [["🐢","La constancia, el esfuerzo y la humildad"],["🎭","Parlamentos recitados a viva voz por actores de comedia"],["🎶","Estribillos cantados al unísono por un coro de estudiantes"]], 0, "Pista: cada una de las líneas poéticas que forman la estrofa."),
    q("¿Por qué las fábulas se han transmitido durante siglos de generación en generación?", [["📚","Porque transmiten valores éticos universales de forma entretenida"],["📜","El prólogo extenso que introduce los temas de un libro"],["📑","El epígrafe breve colocado al pie de una fotografía documental"]], 0, "Pista: grupo de líneas separadas por un espacio en blanco."),
    q("¿Qué tipo de texto narrativo breve con fin didáctico es la fábula?", [["📖","Un relato de ficción breve con enseñanza moral"],["📰","Una crónica periodística de actualidad"],["📋","Un instructivo de recetas familiares"]], 0, "Pista: literatura pensada para reflexionar sobre actitudes humanas."),
    q("¿Qué defecto humano suele encarnar el cuervo al perder el queso frente al zorro?", [["🪶","La vanidad de creer en halagos interesados"],["🐻","La pereza de no querer volar alto"],["🐟","El temor a compartir sus alimentos"]], 0, "Pista: abre el pico para cantar por orgullo y se le cae la comida."),
    q("¿Qué valor representa la hormiga frente a la cigarra en la fábula clásica?", [["🐜","El trabajo previsor y el esfuerzo para el futuro"],["🦗","El canto continuo sin ocuparse de las provisiones"],["❄️","El descuido frente a las estaciones frías"]], 0, "Pista: junta comida durante el verano para no pasar hambre en invierno."),
    q("¿Quién fue uno de los fabulistas más célebres de la antigua Grecia?", [["📜","Esopo"],["🎨","Leonardo da Vinci"],["⛵","Hernando de Magallanes"]], 0, "Pista: autor griego clásico creador de fábulas milenarias."),
    q("¿Qué actitud representa el lobo que se disfraza con piel de oveja?", [["🐺","El engaño y la falsedad para perjudicar a otros"],["🐑","La inocencia de los animales jóvenes"],["🐕","El cuidado responsable de la majada"]], 0, "Pista: coincidencia fonética desde la última vocal acentuada."),
    q("En una fábula patagónica con un zorro y un choique, ¿qué animal suele encarnar la astucia?", [["🦊","El zorro"],["🪶","El choique"],["🐟","La trucha"]], 0, "Pista: rima donde coinciden tanto vocales como consonantes finales."),
    q("¿Por qué se dice que la moraleja puede ser «implícita» en algunas fábulas modernas?", [["💡","Porque el lector debe deducirla a partir de los hechos"],["📝","Porque está escrita con letras destacadas en negrita"],["💡","Porque la narración carece de toda intención reflexiva"]], 0, "Pista: rima donde solo coinciden los sonidos vocálicos finales."),
    q("¿Cuál es la estructura narrativa básica de una fábula?", [["📖","Situación inicial, conflicto o engaño y moraleja final"],["📋","Lista de ingredientes, preparación y tiempo de cocción"],["📰","Titular destacado, copete y epígrafe breve"]], 0, "Pista: inicio, desarrollo con enseñanza y cierre reflexivo."),
    q("¿Qué actitud inicial muestra el león hacia el pequeño ratón antes de ser rescatado por él?", [["🦁","Desprecio por considerarlo débil e insignificante"],["🐭","Admiración por su velocidad para esconderse"],["🤝","Gratitud inmediata desde el primer encuentro"]], 0, "Pista: pensaba que un animal tan chico nunca le sería útil."),
    q("¿Cómo logra el ratón salvar al león atrapado en la red de los cazadores?", [["🐭","Royendo pacientemente las cuerdas de la red con sus dientes"],["🦁","Rugiendo con fuerza para ahuyentar a los cazadores"],["⚔️","Cortando la red con una herramienta metálica"]], 0, "Pista: corta los nudos poco a poco con su dentadura."),
    q("¿Qué moraleja nos deja la fábula del león y el ratón?", [["🤝","Nadie es tan pequeño como para no poder ayudar a los demás"],["🦁","Solo los seres más fuertes merecen respeto y cuidado"],["💤","Es mejor no intervenir en los problemas ajenos"]], 0, "Pista: los actos de bondad siempre tienen recompensa."),
    q("¿Qué tiempo verbal suele utilizarse en la narración de los hechos de una fábula?", [["📜","Los tiempos del pasado (pretérito perfecto simple e imperfecto)"],["🔮","El tiempo futuro del modo indicativo"],["⚡","El presente de los mandatos imperativos"]], 0, "Pista: «Había una vez», «Caminaba el zorro», «Llegó la tortuga»."),
    q("¿Por qué en las fábulas los personajes dialogan entre sí?", [["💬","Para manifestar sus intenciones, astucias o debilidades"],["🎭","Porque deben aprender parlamentos para una función de teatro"],["🤫","Para ocultar lo que piensan del narrador"]], 0, "Pista: el diálogo revela la personalidad de cada animal."),
    q("¿Qué enseñanza se desprende de la fábula del pastorcito mentiroso?", [["🗣️","Quien acostumbra mentir no será creído cuando diga la verdad"],["🐑","El pastoreo en el campo es una tarea sin ninguna responsabilidad"],["🐺","Los animales del campo temen los gritos de alarma"]], 0, "Pista: bromear con falsas alarmas destruye la confianza de los demás."),
  ],
  10: [
    q("¿Cómo se llama cada uno de los renglones cortos que componen un poema?", [["🪶","Verso"],["📚","Párrafo"],["🎭","Parlamento"]], 0, "Pista: unidad métrica básica de la poesía."),
    q("¿Cómo se llama el grupo de versos separados entre sí por un espacio en blanco?", [["📜","Estrofa"],["📖","Capítulo"],["📑","Columna"]], 0, "Pista: recurso que atribuye acciones de personas a seres inanimados."),
    q("¿Qué tipo de rima se produce cuando coinciden vocales y consonantes a partir de la última vocal acentuada?", [["🎵","Rima consonante (ejemplo: viento / cuento)"],["📑","Un párrafo extenso delimitado por punto y aparte"],["🏷️","Un subtítulo que organiza el desarrollo de un tema"]], 0, "Pista: coinciden todas las letras finales: -ento con -ento."),
    q("¿Qué tipo de rima ocurre cuando coinciden únicamente los sonidos vocálicos finales?", [["🎶","Rima asonante (ejemplo: lenga / seca)"],["📖","El prólogo explicativo ubicado al inicio de una novela"],["🏁","El punto final que concluye definitivamente el relato"]], 0, "Pista: riman solo las vocales (e-a)."),
    q("¿A qué sentido apela la imagen sensorial: «el aullido helado del viento patagónico»?", [["👂","Al oído (imagen sensorial auditiva)"],["👃","Al olfato (imagen olfativa)"],["👅","Al gusto (imagen gustativa)"]], 0, "Pista: describe el sonido potente de las ráfagas."),
    q("¿Qué imagen sensorial transmite la expresión: «las hojas doradas y rojas de la lenga»?", [["👁️","Imagen sensorial visual"],["👂","Imagen sensorial auditiva"],["✋","Imagen sensorial táctil"]], 0, "Pista: colores percibidos mediante el sentido de la vista."),
    q("¿Cuántos versos tiene habitualmente una estrofa de cuarteto tradicional?", [["🔢","Cuatro versos en total"],["🔢","Dos versos pareados"],["🔢","Ocho versos continuos"]], 0, "Pista: recurso estilístico que ayuda al ritmo y la musicalidad."),
    q("¿Qué imagen sensorial transmite la frase: «la corteza áspera y rugosa del árbol milenario»?", [["✋","Imagen sensorial táctil"],["👃","Imagen olfativa"],["👅","Imagen gustativa"]], 0, "Pista: verso con rima idéntica en vocales y consonantes."),
    q("¿Qué recurso poético consiste en atribuir sentimientos a la naturaleza (ejemplo: «el viento suspiraba triste»)?", [["✨","Personificación poética"],["📏","Separación silábica"],["🛑","Comparación directa"]], 0, "Pista: verso con igualdad únicamente en las vocales finales."),
    q("¿Qué imagen sensorial encontramos en la frase: «el aroma fresco del bosque tras la lluvia»?", [["👃","Imagen sensorial olfativa"],["👁️","Imagen visual que capta la intensidad de la luz solar"],["👃","Imagen olfativa que percibe el aroma de las flores nativas"]], 0, "Pista: olor percibido a través de la nariz."),
    q("¿Cómo se llama la comparación poética que une dos elementos usando la palabra «como»?", [["🔗","Comparación o símil"],["🎭","Metáfora pura"],["🏷️","Acotación lírica"]], 0, "Pista: «Tus ojos brillan como estrellas en la noche»."),
    q("¿Qué efecto produce la rima y la medida regular de los versos al recitar un poema?", [["🎶","Musicalidad, cadencia y ritmo sonoro"],["😴","Sensación de lectura confusa"],["📊","Un ordenamiento cronológico de datos"]], 0, "Pista: armonía que hace agradable el poema al oído."),
    q("Marcá el par de palabras que tiene rima consonante:", [["🎵","canción / corazón"],["🎶","mesa / perro"],["🔇","sol / luna"]], 0, "Pista: ambas terminan exactamente en -ón."),
    q("Marcá el par de palabras que presenta rima asonante:", [["🎶","barco / pasto (a-o)"],["🎵","espejo / conejo (-ejo)"],["🔇","luz / flor"]], 0, "Pista: coinciden únicamente las vocales a y o."),
    q("¿Cómo se llaman las estrofas compuestas por dos versos que riman entre sí?", [["✌️","Pareados"],["🍀","Cuartetos"],["🌟","Tercetos"]], 0, "Pista: par indica dos versos hermanados."),
    q("¿Qué sentimiento o tema suele inspirar la inmensidad de la meseta y los glaciares en la poesía santacruceña?", [["🏔️","Admiración por la naturaleza, el silencio y el horizonte"],["🎮","Instrucciones técnicas para armar herramientas"],["🚗","El tránsito vehicular de las grandes ciudades"]], 0, "Pista: emoción estética ante la belleza agreste del sur."),
    q("¿Qué imagen sensorial evoca: «el sabor dulce del calafate maduro en la boca»?", [["👅","Imagen sensorial gustativa"],["👁️","Imagen sensorial visual"],["👂","Imagen sensorial auditiva"]], 0, "Pista: sensación experimentada con el sentido del gusto."),
    q("¿Cómo se denomina a la voz que expresa sus sentimientos y emociones dentro del poema?", [["🪶","Voz lírica o yo poético"],["📰","Cronista informativo"],["🎭","Director de escena"]], 0, "Pista: la voz que habla y siente dentro del texto lírico."),
    q("¿Qué signo de puntuación suele separar versos cuando se transcriben seguidos en un mismo renglón?", [["/","La barra inclinada (/)"],["*","Un asterisco (*)"],["&","El signo de unión (&)"]], 0, "Pista: marca el final de un verso y el comienzo del siguiente."),
    q("¿Por qué en la poesía las palabras se eligen tanto por su significado como por su sonoridad?", [["✨","Para combinar sentido, belleza y musicalidad"],["📏","Para que todos los renglones midan lo mismo y facilitar la lectura fluida del relato escolar"],["⚖️","Para evitar que el poema tenga adjetivos"]], 0, "Pista: la poesía une el contenido con la estética sonora."),
  ],
  11: [
    q("¿Qué parte del texto teatral indica las acciones, gestos o tonos de voz de los actores?", [["🎭","Las acotaciones escénicas"],["💬","Los parlamentos hablados por actores"],["🏷️","Los títulos de portada"]], 0, "Pista: tipo de obra creada para ser representada por actores en un escenario."),
    q("¿Cómo se presentan habitualmente las acotaciones en el libreto de teatro?", [["📝","Encerradas entre paréntesis ( )"],["📖","Para ser leída en riguroso silencio por un alumno individual"],["📰","Para publicarse periódicamente en suplementos escolares de prensa"]], 0, "Pista: aclaran qué debe hacer o cómo debe moverse el personaje."),
    q("¿Cómo sabemos quién habla en cada momento en un libreto teatral?", [["👤","El nombre del personaje precede al parlamento"],["📖","El narrador lo cuenta detalladamente al final de la obra"],["🎭","Hay que adivinar según el contexto de la escena"]], 0, "Pista: se escribe en mayúsculas o negrita antes del diálogo."),
    q("¿Qué es un «parlamento» en una obra dramática?", [["🗣️","Las palabras que dice en voz alta el actor"],["🏛️","El edificio donde sesionan las autoridades"],["🎨","El telón pintado del fondo del escenario"]], 0, "Pista: lo que pronuncia cada personaje en escena."),
    q("¿Para qué fue escrita principalmente una obra de teatro?", [["🎭","Para ser representada en un escenario ante público"],["🏷️","Con títulos destacados en negrita al comienzo de la página"],["📑","En párrafos narrativos extensos sin guiones ni marcas gráficas"]], 0, "Pista: notas entre paréntesis para guiar gestos y movimientos en escena."),
    q("¿Cómo se llama la persona encargada de guiar a los actores y organizar la puesta en escena?", [["🎬","Director o directora de teatro"],["🎟️","Boletero de la sala teatral"],["🛋️","Encargado de la iluminación"]], 0, "Pista: se indica antes de la raya para saber a quién le toca hablar."),
    q("¿Qué elemento del teatro incluye los muebles, luces y fondos pintados del escenario?", [["🎨","La escenografía y ambientación"],["📜","El vestuario de los personajes"],["🎟️","El programa de mano de la obra"]], 0, "Pista: recrea el lugar donde transcurre la historia (un bosque, una casa)."),
    q("¿Cómo se llaman las divisiones principales en que se organiza una obra de teatro extensa?", [["🎭","Actos (separados habitualmente por caída de telón)"],["📚","Diccionarios, enciclopedias y manuales de consulta académica"],["📰","Mapas físicos, planos catastrales y gráficos estadísticos"]], 0, "Pista: cada acto suele marcar un momento clave de la trama."),
    q("¿Qué marca el cambio de «escena» dentro de un mismo acto?", [["🚪","La entrada o salida de personajes en el escenario"],["⏰","El paso de una hora de reloj"],["💡","El cambio de color de las luces de sala"]], 0, "Pista: cada vez que un actor entra o sale del tablado."),
    q("¿Qué vestimenta especial usan los actores para caracterizar a sus personajes?", [["👗","El vestuario y caracterización"],["🎒","Ropa deportiva de uso común"],["🦺","El uniforme institucional diario"]], 0, "Pista: ropa adecuada a la época y condición del personaje."),
    q("En la acotación «(Entra corriendo y mira con asombro hacia la montaña)», ¿qué indica el texto?", [["🏃","Una acción física y una emoción del personaje"],["🗣️","Las palabras exactas que debe gritar el actor"],["🎨","El vestuario que debe colocarse"]], 0, "Pista: movimiento corporal y estado de ánimo del actor."),
    q("¿Cómo se denomina al conjunto de objetos que los actores manipulan en escena (vasos, libros, linternas)?", [["📦","Utilería teatral"],["🖼️","Escenografía fija"],["📚","Libreto de ensayo"]], 0, "Pista: accesorios y objetos de mano de la actuación."),
    q("¿Qué signo de puntuación suele separar el nombre del personaje de su parlamento?", [["💬","Dos puntos o punto y raya (JUAN: —...)"],["❓","Signos de pregunta continuos"],["¡!","Signos de exclamación triples"]], 0, "Pista: indica que a continuación habla ese personaje."),
    q("¿Qué diferencia existe entre un texto teatral y un cuento narrativo?", [["🎭","El teatro se cuenta mediante diálogos directos de los personajes"],["📖","El cuento carece de personajes"],["📜","El teatro se escribe siempre en verso rimado"]], 0, "Pista: indica cambio de escenario o paso de tiempo importante."),
    q("¿Cómo se llama la intervención en la que un personaje habla solo en el escenario reflexionando en voz alta?", [["🎭","Monólogo"],["👥","Diálogo"],["🤫","Aparte"]], 0, "Pista: mono- indica uno solo hablando en escena."),
    q("¿Qué es el «conflicto» en una obra de teatro?", [["⚡","El problema o desacuerdo central entre los personajes"],["🎨","El cambio imprevisto de escenografía"],["🎟️","La pérdida del libreto por un actor"]], 0, "Pista: el motor dramático que genera la acción y el interés."),
    q("¿Qué indica la acotación «(En voz baja, para sí mismo)»?", [["🤫","El tono de voz con el que debe pronunciarse la frase"],["🏃","Que el actor debe abandonar el escenario"],["💡","Que se deben apagar todas las luces"]], 0, "Pista: volumen íntimo o aparte para que el público escuche el pensamiento."),
    q("¿Cómo se llama el público que asiste a una sala a presenciar una función teatral?", [["👥","Espectadores o platea"],["📰","Lectores de prensa"],["📻","Radioescuchas de sintonía"]], 0, "Pista: las personas sentadas en las butacas del teatro."),
    q("¿Qué sucede al término de una función teatral cuando concluye la última escena?", [["👏","El público aplaude y los actores saludan en el escenario"],["🏃","Los actores abandonan la sala sin mirar al público"],["😴","Se encienden las luces sin pausa"]], 0, "Pista: tradicional saludo de agradecimiento del elenco."),
    q("¿Qué tipo de teatro emplea muñecos accionados por titiriteros detrás de un retablo?", [["🧸","Teatro de títeres o marionetas"],["🎭","Teatro de mimos mudos"],["🎬","Cine de animación gráfica"]], 0, "Pista: muñecos manipulados por titiriteros detrás de un retablo."),
  ],
  12: [
    q("¿Cómo se llama cada uno de los recuadros gráficos que representan un momento de la historieta?", [["🖼️","Viñeta"],["💬","Globo de diálogo"],["🏷️","Cartela o cartucho"]], 0, "Pista: marco rectangular donde se dibuja una escena."),
    q("¿Cómo es el contorno de un globo de historieta que representa el pensamiento de un personaje?", [["💭","Forma de nube con circulitos que van a la cabeza"],["💬","Forma ovalada lisa con una colita recta hacia la boca"],["💥","Borde con picos dentados de estallido sonoro"]], 0, "Pista: globo suave que muestra reflexiones silenciosas."),
    q("¿Qué tipo de globo se emplea cuando un personaje grita con fuerza o alarma?", [["💥","Globo con bordes dentados y en picos"],["💬","Globo ovalado con borde liso y recto"],["💭","Globo con forma de nube y circulitos"]], 0, "Pista: línea quebrada que transmite intensidad y volumen alto."),
    q("¿Qué es una «onomatopeya» en el lenguaje de las historietas?", [["💥","Palabra que imita un sonido o ruido de la realidad"],["🏷️","La firma del autor al final de la historieta"],["🎨","El sombreado en blanco y negro de los cuadros"]], 0, "Pista: pensá en términos como ¡pum! o ¡guau! que imitan ruidos."),
    q("¿Qué sonido imita habitualmente la onomatopeya «¡GLUB, GLUB!»?", [["💧","Tragar líquido o sumergirse en el agua"],["💥","Un choque de vehículos en la calle"],["🚪","Un golpe en una puerta cerrada"]], 0, "Pista: efecto auditivo de sorber algo o caer al torrente."),
    q("¿Qué significa un globo de diálogo dibujado con líneas de puntos o discontinuas?", [["🤫","El personaje habla en voz muy baja o susurra"],["📢","El personaje grita con megáfono"],["💭","El personaje está cantando una melodía"]], 0, "Pista: susurro o secreto que apenas se oye."),
    q("¿Cómo se llama el recuadro rectangular en la parte superior de la viñeta donde habla el narrador?", [["🏷️","Cartela o cartucho del narrador"],["💬","Globo de diálogo del personaje"],["💥","Metáfora visual de pensamiento"]], 0, "Pista: aclara el lugar o paso del tiempo («A la mañana siguiente...»)."),
    q("¿En qué sentido se leen habitualmente las viñetas y globos en el orden occidental?", [["➡️","De izquierda a derecha y de arriba hacia abajo"],["⬅️","De derecha a izquierda y de abajo hacia arriba"],["🔄","En círculos partiendo del centro"]], 0, "Pista: el mismo orden tradicional de lectura de libros escolares."),
    q("¿Qué son las «líneas cinéticas» o de movimiento en un dibujo de historieta?", [["💨","Rayitas que indican velocidad, saltos o carreras"],["🎨","Bordes decorativos de las viñetas cuadradas"],["🧱","Sombras de los edificios en el fondo visual"]], 0, "Pista: trazos que grafican desplazamiento y dinamismo."),
    q("¿Qué onomatopeya representa el sonido de golpear una puerta con los nudillos?", [["🚪","¡TOC, TOC!"],["💥","¡CRASH!"],["😴","¡ZZZZ!"]], 0, "Pista: sonido seco de llamar a la puerta."),
    q("¿Qué onomatopeya se utiliza habitualmente para indicar que un personaje duerme profundamente?", [["😴","¡ZZZZ!"],["💥","¡BOOM!"],["🚗","¡BRRRR!"]], 0, "Pista: imita el ronquido continuo del sueño."),
    q("¿Qué función cumple el «rabillo» o «delta» del globo de diálogo?", [["📍","Señala qué personaje está diciendo esas palabras"],["🎨","Sirve de adorno al contorno del dibujo gráfico"],["✂️","Indica el corte entre dos viñetas sucesivas"]], 0, "Pista: apéndice que apunta al emisor que está hablando."),
    q("¿Qué representan pequeños signos como estrellitas o espirales sobre la cabeza de un personaje?", [["😵","Mareo, confusión o dolor tras un tropiezo"],["👑","Que el personaje es un rey o un príncipe"],["💡","Que resolvió un acertijo difícil de ingenio"]], 0, "Pista: metáfora visual clásica de quedar atontado por un golpe."),
    q("¿Qué metáfora visual significa que a un personaje se le ocurrió una brillante idea?", [["💡","Una lamparita encendida sobre la cabeza"],["🌧️","Una nube negra con lluvia torrencial"],["❤️","Corazones flotando en el aire sereno"]], 0, "Pista: la bombilla iluminada simboliza el pensamiento ingenioso."),
    q("¿Cómo se llama la historieta cómica breve de pocas viñetas que suele publicarse en diarios?", [["📰","Tira cómica diaria"],["📖","Novela ilustrada"],["📜","Poema gráfico"]], 0, "Pista: formato clásico de Mafalda o Gaturro."),
    q("¿Qué combinación de lenguajes hace única a la historieta frente a un texto tradicional?", [["🎨","Combina lenguaje verbal (palabras) y lenguaje visual (imágenes)"],["📻","Combina grabaciones sonoras con transmisiones radiales en vivo"],["🎭","Combina actores de teatro en vivo con decorados en movimiento"]], 0, "Pista: complementa palabras escritas con ilustraciones expresivas."),
    q("¿Qué onomatopeya imita la rotura de un vidrio o cristal?", [["🪟","¡CRASH!"],["🚪","¡TOC, TOC!"],["💧","¡PLOP!"]], 0, "Pista: ruido estrepitoso de cristales al romperse."),
    q("¿Qué plano de dibujo enfoca de cerca el rostro del personaje para mostrar su emoción?", [["👤","Primer plano del rostro"],["🏔️","Plano general panorámico"],["👣","Plano de conjunto amplio"]], 0, "Pista: acerca la mirada a los ojos y expresión del protagonista."),
    q("¿Qué significa una gota de sudor dibujada al costado de la frente de un personaje?", [["😓","Nerviosismo, incomodidad o alivio tras un apuro"],["🌧️","Que está cayendo una llovizna fría sobre su vestimenta"],["🏊","Que acaba de nadar en las aguas del lago cordillerano"]], 0, "Pista: recurso visual de tensión cómica."),
    q("¿Por qué las historietas son un medio narrativo dinámico para contar historias?", [["🚀","Porque integran acción visual ágil con diálogos directos"],["📜","Porque prescinden de toda ilustración gráfica en sus páginas"],["⚖️","Porque están escritas en un lenguaje técnico muy formal"]], 0, "Pista: la síntesis gráfica y el humor facilitan el disfrute lector."),
  ],
  13: [
    q("¿Cómo se llama el pequeño espacio en blanco que se deja al inicio de cada párrafo?", [["📏","La sangría inicial"],["📑","Un grupo de diez oraciones que riman entre sí en una estrofa"],["📜","El encabezamiento oficial que lleva la firma del autor"]], 0, "Pista: separa visualmente el comienzo de un párrafo nuevo."),
    q("¿Con qué tipo de letra debe comenzar obligatoriamente toda oración?", [["🔠","Con letra mayúscula inicial"],["📏","Escribir siempre un guion de diálogo al comenzar cada renglón"],["🎨","Resaltar con color amarillo todas las palabras que lleven tilde"]], 0, "Pista: regla básica de inicio de oración y párrafos."),
    q("¿Qué signo de puntuación separa dos oraciones dentro de un mismo párrafo?", [["🛑","El punto y seguido (.)"],["📑","El punto y aparte"],["🏁","El punto final del texto"]], 0, "Pista: separa oraciones dentro del mismo párrafo temático."),
    q("¿Qué signo de puntuación se coloca al terminar un párrafo para pasar al siguiente?", [["📑","El punto y aparte (.)"],["🛑","El punto y seguido"],["❓","El signo de interrogación"]], 0, "Pista: separa bloques de párrafos para pasar a otro aspecto del tema."),
    q("¿Qué signo indica que el texto completo ha finalizado definitivamente?", [["🏁","El punto final (.)"],["📑","El punto y aparte"],["🛑","El punto y seguido"]], 0, "Pista: signo de cierre definitivo de toda la redacción."),
    q("¿Qué nombre recibe un conjunto de oraciones que desarrollan un mismo subtema?", [["📚","El párrafo"],["🪶","El verso"],["💬","La viñeta"]], 0, "Pista: comienza con sangría y termina en punto y aparte."),
    q("¿Qué tipo de nombres propios deben escribirse siempre con mayúscula inicial?", [["📍","Nombres de personas, pueblos, ríos y provincias"],["📏","Tener obligatoriamente una extensión de más de quince vocablos"],["🎶","Rimarse como si fuera un poema tradicional de la literatura"]], 0, "Pista: Santa Cruz, Río Gallegos, Martín, Lucía."),
    q("¿Qué nombre de localidad santacruceña debe escribirse con mayúsculas iniciales por ser propio?", [["📍","Puerto Deseado"],["🌊","puerto pesquero"],["⚓","muelle costero"]], 0, "Pista: nombre geográfico oficial de la ciudad costera."),
    q("¿Qué es una «oración bimembre» en gramática?", [["⚖️","Una oración que tiene dos partes: sujeto y predicado"],["🚫","Una oración formada por una sola interjección"],["❓","Una frase que no tiene verbo conjugado"]], 0, "Pista: el prefijo bi- señala dos componentes articulados."),
    q("¿Cómo se llama la oración que no puede dividirse en sujeto y predicado (ejemplo: «¡Qué frío!»)?", [["❄️","Oración unimembre (OU)"],["⚖️","Oración bimembre"],["📜","Oración compuesta"]], 0, "Pista: estructura que consta de sujeto y predicado."),
    q("¿Cuál de las siguientes expresiones es una oración bimembre con sentido completo?", [["📝","Los guardaparques cuidan la fauna nativa."],["📝","Por la tarde en el medio del sendero."],["📝","Caminando despacio hacia la montaña alta."]], 0, "Pista: contiene un sujeto agente y su núcleo verbal conjugado."),
    q("¿Cuál de las siguientes opciones es una oración unimembre referida al clima?", [["🌧️","Llueve intensamente en la cordillera."],["🌲","Los árboles crecen junto al arroyo."],["🦅","El cóndor vuela sobre los picos"]], 0, "Pista: no admite división entre quien hace y quien predica."),
    q("¿Por qué es incorrecto escribir un texto largo de varias páginas sin puntos y aparte?", [["📑","Porque dificulta la lectura y mezcla distintas ideas sin orden"],["🎨","Porque gasta menos tinta del bolígrafo"],["⏰","Porque la computadora no permite renglones largos"]], 0, "Pista: separar en bloques organiza la comprensión y clarifica los conceptos."),
    q("¿Qué signo de puntuación se utiliza para separar elementos de una lista o enumeración?", [["✏️","La coma (,)"],["🛑","El punto y aparte"],["❓","Los signos de interrogación"]], 0, "Pista: signo ortográfico para enumerar elementos seguidos."),
    q("¿Qué palabra de unión se coloca habitualmente antes del último elemento de una lista?", [["🔗","La conjunción «y» (o «e»)"],["🛑","El punto y seguido"],["❓","El signo de interrogación"]], 0, "Pista: cierra la enumeración sin coma previa."),
    q("¿Qué sucede con el sentido de una oración si le falta el verbo conjugado principal?", [["⚠️","Queda incompleta y pierde sentido gramatical pleno"],["🏆","Se transforma automáticamente en una estrofa"],["✨","Pasa a ser una noticia informativa"]], 0, "Pista: se cambia la conjunción para evitar cacofonía sonora."),
    q("¿En qué caso la conjunción «y» cambia por «e» antes de una palabra?", [["🔤","Cuando la palabra siguiente empieza con el sonido i- (i o hi)"],["🔠","Cuando la palabra termina en vocal o"],["🔡","Cuando se ubica al inicio de una oración"]], 0, "Pista: para evitar la cacofonía: «geografía e historia»."),
    q("Marcá la oración que tiene mayúscula inicial y punto final correctamente aplicados:", [["📝","En la meseta patagónica, el viento sopla todo el día."],["📝","los guanacos veloces corren libres por el cañadón patagónico."],["📝","El cóndor andino sobrevuela alto la cumbre nevada"]], 0, "Pista: fijate cuál empieza con mayúscula y cierra con punto."),
    q("¿Qué signo introduce las palabras exactas que alguien dijo en estilo directo en un relato?", [["💬","Dos puntos seguidos de comillas o raya de diálogo"],["🛑","Punto y coma de cierre"],["❓","Signos dobles de exclamación"]], 0, "Pista: «El guía avisó: —Caminen con cuidado.»"),
    q("¿Por qué los nombres de los meses y días de la semana se escriben habitualmente con minúscula en español?", [["📅","Porque son sustantivos comunes en nuestra lengua"],["🔠","Porque la ortografía prohíbe las mayúsculas en fechas"],["⏰","Porque se consideran adjetivos temporales"]], 0, "Pista: a diferencia del inglés, en español van con minúscula salvo al iniciar oración."),
  ],
  14: [
    q("¿Para qué se utilizan los conectores en un texto narrativo o explicativo?", [["🔗","Para enlazar ideas y ordenar las oraciones de forma coherente"],["🎨","Para alternar tipografías de imprenta y cursiva en el párrafo"],["📏","Para contar la cantidad de sílabas que integran cada renglón"]], 0, "Pista: recursos gramaticales de unión que articulan la estructura lógica."),
    q("¿Cuál de estos conectores expresa una relación de causa?", [["💡","«Porque» o «ya que»"],["⚡","Conectores de oposición que señalan un marcado contraste"],["❓","Conectores de causa que explican el motivo de un hecho"]], 0, "Pista: responde a la pregunta de por qué ocurrió algo."),
    q("¿Cuál de estos conectores señala una consecuencia de lo afirmado antes?", [["➡️","«Por lo tanto» o «en consecuencia»"],["❓","«Porque» o «puesto que»"],["⏳","«Mientras tanto» o «a la vez»"]], 0, "Pista: marcan la correlación de instantes: primero, luego, al final."),
    q("¿Qué tipo de conector es «mientras tanto» en una narración?", [["⏳","Conector temporal de simultaneidad"],["💡","Conector causal de motivo"],["🏁","Conector de cierre final"]], 0, "Pista: indica que dos acciones ocurren al mismo tiempo."),
    q("¿Qué conector temporal indica que una acción ocurrió con anterioridad a otra?", [["⏪","«Antes» o «previamente»"],["⚡","«sin embargo» para marcar un desacuerdo de ideas"],["⏰","«mientras tanto» para señalar dos hechos a la vez"]], 0, "Pista: sitúa el hecho en el tiempo previo."),
    q("Completá con el conector adecuado: «Se abrigó con campera _____ hacía mucho frío».", [["🧥","porque"],["⏳","después"],["🏁","finalmente"]], 0, "Pista: introducen el motivo o la razón: porque, ya que, puesto que."),
    q("Completá con el conector adecuado: «Nevó durante toda la noche; _____, los caminos quedaron cerrados».", [["❄️","por lo tanto"],["❓","porque"],["⏪","antes"]], 0, "Pista: el cierre de caminos es la consecuencia de la nevada."),
    q("¿Qué conector se suele emplear para marcar el inicio de una serie de pasos?", [["1️⃣","«En primer lugar» o «primero»"],["🏁","«Para terminar»"],["🛑","«Sin embargo»"]], 0, "Pista: indican contraste o reparo frente a una idea previa."),
    q("¿Qué conector temporal indica posterioridad en un relato?", [["⏩","«Luego» o «después»"],["⏪","«Antes de ayer»"],["🛑","«Al contrario»"]], 0, "Pista: avanza en la línea del tiempo hacia lo que sigue."),
    q("¿Qué recurso de cohesión consiste en reemplazar una palabra por un término equivalente para no repetirla?", [["🔄","Sustitución sinonímica léxica"],["✂️","Eliminación de la palabra sin reemplazo"],["🎨","Cambio de tipografía"]], 0, "Pista: evita repetir «el auto, el auto» usando «el vehículo»."),
    q("¿Qué es la «elipsis» en un texto para evitar repeticiones innecesarias?", [["🤫","Omitir una palabra que ya se sobreentiende por el contexto"],["📢","Reiterar el nombre en cada oración"],["❓","Transformar la frase en interrogación"]], 0, "Pista: «Martín viajó a la cordillera. [Martín] Visitó el lago»."),
    q("¿Qué tipo de conector es «sin embargo» o «pero»?", [["🛑","Conector de oposición o contraste"],["⏳","Conector temporal de avance"],["➕","Conector aditivo de suma"]], 0, "Pista: introduce una dificultad o idea contraria a la esperada."),
    q("Completá con el conector de oposición adecuado: «El viento soplaba fuerte, _____ pudimos armar el campamento».", [["🏕️","pero"],["⏳","luego"],["1️⃣","primero"]], 0, "Pista: contrasta la dificultad del viento con el logro de armar la carpa."),
    q("¿Qué conector añade información sumando elementos de la misma clase?", [["➕","«Además» o «también»"],["🛑","«Pero» o «sin embargo»"],["❓","«Porque» o «ya que»"]], 0, "Pista: conectores aditivos que agregan datos."),
    q("¿Qué conector temporal cierra la narración de los hechos de una jornada?", [["🏁","«Finalmente» o «por último»"],["1️⃣","«Al comenzar la mañana»"],["⏳","«Mientras tanto»"]], 0, "Pista: marca el final de la secuencia temporal."),
    q("En la frase «El cóndor divisó a su cría y voló hacia ella», ¿a qué palabra reemplaza «ella»?", [["🦅","A «su cría»"],["🏔️","Al «cóndor»"],["💨","Al «viento»"]], 0, "Pista: uso de pronombre para evitar repetir el sustantivo."),
    q("¿Por qué un texto sin conectores resulta difícil y fragmentado para el lector?", [["🧩","Porque parece una lista de frases sueltas y sin relación lógica"],["🎨","Porque no tiene suficientes imágenes ilustrativas debido"],["⏰","Porque se lee a menor velocidad"]], 0, "Pista: los conectores tejen la cohesión y fluidez de la lectura."),
    q("¿Qué conector de causa es sinónimo formal de «porque»?", [["💡","«Puesto que» o «ya que»"],["⏳","«Más adelante»"],["🛑","«A pesar de eso»"]], 0, "Pista: introduce la explicación o fundamento de un suceso."),
    q("Marcá el conector temporal que expresa que algo ocurrió de manera sorpresiva e imprevista:", [["⚡","«De repente» o «súbitamente»"],["⏳","«Poco a poco con los años»"],["🏁","«En conclusión»"]], 0, "Pista: giro imprevisto en la secuencia narrativa."),
    q("¿Qué pronombre demostrativo ayuda a cohesionar refiriéndose a un hecho mencionado antes?", [["👉","«Este», «ese» o «aquel»"],["❓","«Quién» o «cuál»"],["👤","«Yo» o «vos»"]], 0, "Pista: «Ocurrió un hecho imprevisto; ese suceso alertó al pueblo»."),
  ],
  15: [
    q("¿Qué parte de la oración bimembre indica quién realiza la acción o de quién se habla?", [["👤","El sujeto de la oración"],["⚡","El predicado verbal de la acción"],["🛑","El modificador circunstancial"]], 0, "Pista: concuerda en persona y número con el verbo."),
    q("¿Cómo se llama el sujeto que aparece escrito de manera explícita en la oración?", [["📝","Sujeto expreso (SE)"],["🤫","Sujeto tácito o desinencial"],["🚫","Sujeto nulo"]], 0, "Pista: elemento sintáctico que realiza o concuerda con la acción del verbo."),
    q("¿Cómo se llama el sujeto que no está escrito pero se deduce por la terminación del verbo?", [["🤫","Sujeto tácito o desinencial (ST)"],["👥","Sujeto expreso de la construcción bimembre"],["⚡","Predicado no verbal de entonación exclamativa"]], 0, "Pista: la desinencia del verbo nos indica quién realiza la acción."),
    q("En la oración «Los turistas visitaron el Parque Nacional», ¿cuál es el sujeto expreso?", [["👥","«Los turistas»"],["🏔️","«visitaron el Parque Nacional»"],["🌳","«el Parque Nacional»"]], 0, "Pista: quiénes realizaron la acción de visitar."),
    q("En la oración «Viajamos a El Calafate en vacaciones», ¿cuál es el sujeto tácito?", [["👥","Nosotros / nosotras"],["👥","Ellos y ellas (tercera persona plural)"],["👤","Vosotros o ustedes (segunda persona)"]], 0, "Pista: el verbo 'viajamos' corresponde a la 1.ª persona del plural."),
    q("¿Qué es el «núcleo del sujeto» (NS) en una oración?", [["💎","El sustantivo o pronombre principal del sujeto"],["🔗","El modificador indirecto con preposición"],["📍","El complemento circunstancial de tiempo"]], 0, "Pista: la palabra fundamental alrededor de la cual gira la construcción."),
    q("¿Cómo se clasifica el sujeto que tiene un solo núcleo (ejemplo: «El viento soplaba»)?", [["👤","Sujeto expreso simple (SES)"],["👥","Sujeto expreso compuesto (SEC)"],["🤫","Sujeto tácito múltiple"]], 0, "Pista: un único sustantivo como núcleo."),
    q("¿Cómo se clasifica el sujeto que tiene dos o más núcleos unidos por «y» (ejemplo: «Juan y Lucas llegaron»)?", [["👥","Sujeto expreso compuesto (SEC)"],["👤","Sujeto expreso simple (SES)"],["🤫","Sujeto tácito singular"]], 0, "Pista: estructura que reúne varios sustantivos coordinados."),
    q("En la oración «El guanaco y el choique corren por la meseta», ¿cuántos núcleos tiene el sujeto?", [["✌️","Dos núcleos (guanaco / choique)"],["☝️","Un solo núcleo nominal (meseta)"],["✋","Tres núcleos distintos"]], 0, "Pista: los dos animales realizan juntos la acción."),
    q("En la oración «Llegaron tarde al refugio», ¿qué sujeto tácito le corresponde al verbo?", [["👥","Ellos / ellas (o ustedes)"],["👤","Yo en primera persona singular"],["🗣️","Vos en singular"]], 0, "Pista: 'llegaron' es tercera persona del plural."),
    q("¿Qué pregunta le hacemos al verbo para hallar el sujeto de una oración?", [["❓","¿Quién o quiénes realizan la acción o concuerdan con el verbo?"],["📍","¿En qué lugar ocurrió la acción?"],["⏰","¿En qué momento concluyó el hecho?"]], 0, "Pista: quién ejecuta el movimiento o concuerda con lo expresado."),
    q("¿Puede ubicarse el sujeto expreso al final de la oración (ejemplo: «Llegó ayer el barco»)?", [["📌","Sí: el sujeto puede ir al inicio, al medio o al final de la oración"],["📌","No: el sujeto obligatoriamente debe ser la primera palabra"],["📌","Solo si la oración lleva signos de exclamación"]], 0, "Pista: en español el orden de las partes es flexible."),
    q("En la oración «Navegó por el lago el capitán», ¿cuál es el sujeto?", [["⚓","«el capitán»"],["🌊","«por el lago»"],["⛵","«Navegó»"]], 0, "Pista: quién realizó la acción de navegar."),
    q("¿Por qué en español es muy común usar el sujeto tácito sin repetir «yo» o «él»?", [["🗣️","Porque la desinencia del verbo ya expresa la persona y el número"],["🎨","Porque la gramática prohíbe repetir pronombres personales"],["📜","Porque las oraciones no deben exceder cinco palabras debido"]], 0, "Pista: las desinencias verbales en español aportan toda la información."),
    q("En la oración «Escribí una carta para mi primo», ¿cuál es el sujeto tácito?", [["👤","Yo (primera persona singular)"],["👥","Nosotros en plural"],["👤","Él o ella en tercera"]], 0, "Pista: 'escribí' solo puede corresponder a 'yo'."),
    q("¿Cómo se llama el modificador que se une directamente al núcleo del sujeto sin preposición (ejemplo: «La hermosa laguna»)?", [["🔗","Modificador directo (MD: artículo o adjetivo)"],["⚡","Modificador indirecto preposicional"],["🛑","Núcleo verbal compuesto"]], 0, "Pista: artículos y adjetivos que acompañan al sustantivo."),
    q("En la construcción «El viejo explorador», ¿qué función sintáctica cumple «explorador»?", [["💎","Núcleo del sujeto (sustantivo)"],["🔗","Modificador directo (MD)"],["⚡","Núcleo verbal (NV)"]], 0, "Pista: es la palabra central de la construcción."),
    q("En la construcción «El viejo explorador», ¿qué función cumple la palabra «viejo»?", [["🔗","Modificador directo (MD: adjetivo)"],["💎","Núcleo del sujeto"],["⚡","Predicado verbal"]], 0, "Pista: califica al sustantivo directamente."),
    q("Marcá la oración cuyo sujeto sea expreso compuesto (SEC):", [["👥","El guía y los turistas caminaban juntos."],["👤","El guía caminaba con paso firme hacia el refugio."],["🤫","Caminaban juntos por el sendero pedregoso."]], 0, "Pista: dos sustantivos unidos forman una construcción coordinada."),
    q("¿Qué sucede con la concordancia si el sujeto es compuesto: «María y Lucas (llegó / llegaron)»?", [["👥","El verbo debe ir en plural: «llegaron»"],["👤","El verbo debe ir en singular: «llegó»"],["⚖️","Cualquiera de las dos formas es correcta"]], 0, "Pista: dos núcleos coordinados exigen concordancia múltiple."),
  ],
  16: [
    q("¿Qué parte de la oración bimembre expresa la acción, estado o proceso que realiza el sujeto?", [["⚡","El predicado verbal de la oración"],["👤","El sujeto expreso simple de la cláusula"],["🔗","El modificador directo de construcción"]], 0, "Pista: contiene el verbo conjugado y sus complementos."),
    q("¿Cuál es la palabra indispensable y más importante en un predicado verbal?", [["💎","El verbo conjugado (núcleo verbal)"],["🎨","El adjetivo calificativo de modo"],["📏","El sustantivo que funciona de objeto"]], 0, "Pista: elemento sintáctico central que concuerda con el que realiza la acción."),
    q("¿Cómo se llama el predicado que tiene un solo núcleo verbal (ejemplo: «El puma salta»)?", [["⚡","Predicado verbal simple (PVS)"],["⚡⚡","Predicado verbal compuesto (PVC)"],["🤫","Predicado no verbal nominal"]], 0, "Pista: estructura sintáctica con un único verbo conjugado."),
    q("¿Cómo se clasifica el predicado que tiene dos o más verbos coordinados (ejemplo: «El cóndor vuela y planea»)?", [["⚡⚡","Predicado verbal compuesto (PVC)"],["⚡","Predicado verbal simple de un solo verbo"],["✨","Predicado no verbal de estructura adverbial"]], 0, "Pista: estructura sintáctica que reúne más de un verbo conjugado coordinado."),
    q("En la oración «Los niños juegan en el parque», ¿cuál es el núcleo verbal del predicado?", [["🏃","«juegan»"],["👥","«Los niños»"],["🌳","«en el parque»"]], 0, "Pista: la palabra que expresa la acción conjugada."),
    q("En la oración «Martín encendió la linterna y alumbró la cueva», ¿cuántos núcleos verbales hay?", [["✌️","Dos núcleos verbales (encendió / alumbró)"],["☝️","Un solo núcleo verbal conjugado en la frase"],["3️⃣","Tres verbos conjugados coordinados en fila"]], 0, "Pista: Martín realiza dos acciones consecutivas."),
    q("Marcá la oración que presenta predicado verbal compuesto (PVC):", [["📝","La zorra miró el queso y saltó hacia la rama."],["📝","La zorra miró el queso con muchísima atención."],["📝","La zorra astuta caminó por el bosque andino."]], 0, "Pista: dos verbos conjugados unidos por 'y'."),
    q("¿Qué palabra suele coordinar los dos verbos en un predicado verbal compuesto?", [["🔗","La conjunción «y» (o «e»)"],["🛑","El punto y seguido"],["❓","El pronombre relativo"]], 0, "Pista: coordina las dos acciones del mismo sujeto."),
    q("En la oración «El arroyo bajaba fresco desde la montaña», ¿cuál es el predicado?", [["🏔️","«bajaba fresco desde la montaña»"],["💧","«El arroyo caudaloso»"],["🌊","«desde la montaña»"]], 0, "Pista: todo lo que se dice acerca del arroyo."),
    q("¿Qué elemento del predicado responde a la pregunta «¿QUÉ?» tras un verbo transitivo (ejemplo: «Juan compró manzanas»)?", [["🍎","El objeto directo (OD: manzanas)"],["📍","El circunstancial de lugar"],["⏰","El circunstancial de tiempo"]], 0, "Pista: recibe directamente la acción del verbo («las compró»)."),
    q("¿Qué circunstancial indica el lugar donde se realiza la acción en el predicado?", [["📍","Circunstancial de lugar (ejemplo: en el bosque)"],["⏰","Circunstancial de tiempo (a la mañana)"],["🛠️","Circunstancial de modo (con cuidado)"]], 0, "Pista: responde a la pregunta «¿dónde?»."),
    q("¿Qué circunstancial responde a la pregunta «¿CUÁNDO?» dentro del predicado?", [["⏰","Circunstancial de tiempo (ejemplo: temprano)"],["📍","Circunstancial de lugar (en la orilla)"],["🚗","Circunstancial de instrumento"]], 0, "Pista: indica el momento temporal de la acción."),
    q("¿Qué circunstancial responde a la pregunta «¿CÓMO?» señalando el modo de actuar?", [["🚗","Circunstancial de modo (ejemplo: con paciencia)"],["⏰","Circunstancial de tiempo"],["📍","Circunstancial de lugar"]], 0, "Pista: describe la manera en que se ejecuta el verbo."),
    q("En la oración «Los pioneros viajaban lentamente en carreta», ¿qué circunstancial es «lentamente»?", [["🐢","Circunstancial de modo"],["📍","Circunstancial de lugar"],["⏰","Circunstancial de tiempo"]], 0, "Pista: adverbio en -mente que explica cómo viajaban."),
    q("En la oración «Ayer nevó en la meseta», ¿qué circunstancial es la palabra «Ayer»?", [["⏰","Circunstancial de tiempo"],["📍","Circunstancial de lugar"],["🚗","Circunstancial de modo"]], 0, "Pista: ubica la acción en el día anterior."),
    q("¿Por qué el núcleo del sujeto y el núcleo del predicado deben concordar en persona y número?", [["⚖️","Porque mantienen la coherencia gramatical de la oración"],["🎨","Para que los versos rimen con consonancia"],["📜","Para que ocupen la misma cantidad de sílabas y asegurar la correcta comprensión del texto"]], 0, "Pista: si el sujeto es plural («ellos»), el verbo va en plural («cantan»)."),
    q("Marcá la opción que presenta error de concordancia entre sujeto y predicado:", [["📝","«Los guanacos corre por el campo.»"],["📝","«Los guanacos corren por el campo.»"],["📝","«El guanaco corre por el campo.»"]], 0, "Pista: el sujeto es plural pero la forma verbal quedó en singular."),
    q("En la oración «La docente explicó el tema y corrigió las tareas», ¿cuáles son los verbos?", [["✍️","«explicó» y «corrigió»"],["👩‍🏫","«docente» y «tema»"],["📚","«tareas» y «docente»"]], 0, "Pista: las dos acciones ejecutadas por la docente."),
    q("¿Qué tipo de predicado tiene la oración: «Los flamencos vuelan en bandadas y buscan alimento en la laguna»?", [["⚡⚡","Predicado verbal compuesto (PVC)"],["⚡","Predicado verbal simple (PVS)"],["🤫","Predicado no verbal nominal"]], 0, "Pista: dos núcleos: 'vuelan' y 'buscan'."),
    q("¿Cómo se abrevia 'predicado verbal simple' en el análisis sintáctico escolar?", [["📝","PVS"],["📝","PVC"],["📝","SES"]], 0, "Pista: siglas clásicas de Predicado Verbal Simple."),
  ],
  17: [
    q("¿Qué clase de palabras nombra a personas, animales, lugares, objetos y sentimientos?", [["🏷️","Los sustantivos"],["🏃","Los verbos de acción"],["🔗","Los conectores temporales"]], 0, "Pista: categoría gramatical que da nombre a todas las cosas."),
    q("¿Cómo se clasifican los sustantivos que nombran elementos de manera general (perro, río, árbol)?", [["🐾","Sustantivos comunes"],["📍","Sustantivos propios"],["💎","Sustantivos colectivos"]], 0, "Pista: nombran a cualquier individuo de una misma especie o clase."),
    q("¿Cómo se llaman los sustantivos que individualizan a un ser o lugar y se escriben con mayúscula inicial?", [["📍","Sustantivos propios"],["🐾","Sustantivos comunes"],["🔢","Sustantivos numerales"]], 0, "Pista: nombres de personas, ciudades, ríos específicos (Santa Cruz, Martín)."),
    q("¿Qué tipo de sustantivo en singular nombra a un conjunto de seres de la misma especie?", [["👥","Sustantivo colectivo"],["👤","Sustantivo individual"],["📍","Sustantivo propio"]], 0, "Pista: estando en singular refiere a una multitud o grupo."),
    q("¿Cuál es el sustantivo colectivo que designa a un conjunto de árboles nativos?", [["🌳","Arboleda"],["🌱","Matorral"],["🌾","Pajonal"]], 0, "Pista: colectivo tradicional derivado de árbol."),
    q("¿Cuál es el sustantivo colectivo que designa un conjunto de peces que nadan juntos?", [["🐟","Cardumen"],["🦅","Bandada de aves"],["🐺","Jauría de perros"]], 0, "Pista: grupo de peces en el mar o río."),
    q("¿Qué sustantivo colectivo nombra al conjunto de caballos que viajan con un jinete?", [["🐎","Tropilla"],["🐑","Rebaño de ovejas"],["🐕","Jauría de cazadores"]], 0, "Pista: clásico grupo de caballos en el campo patagónico."),
    q("¿Qué sustantivo colectivo corresponde al grupo de ovejas que pastan en el campo?", [["🐑","Rebaño o majada"],["🐟","Cardumen costero"],["🌳","Arboleda ribereña"]], 0, "Pista: conjunto de ganado ovino."),
    q("¿Cuál es el sustantivo colectivo que designa a un grupo numeroso de aves volando juntas?", [["🦆","Bandada"],["🐺","Jauría"],["🐎","Tropilla"]], 0, "Pista: grupo de aves en vuelo coordinado."),
    q("¿Cuál es el sustantivo colectivo para un grupo de perros o lobos que cazan juntos?", [["🐺","Jauría"],["🐟","Cardumen"],["🌳","Arboleda"]], 0, "Pista: conjunto de cánidos."),
    q("¿Cómo se llama el sustantivo que en singular nombra a un único ser (árbol, pez, oveja)?", [["👤","Sustantivo individual"],["👥","Sustantivo colectivo"],["📍","Sustantivo propio"]], 0, "Pista: opuesto al colectivo."),
    q("¿Qué sustantivo colectivo designa a un conjunto ordenado de libros de estudio?", [["📚","Biblioteca"],["📰","Hemeroteca"],["🎨","Pinacoteca"]], 0, "Pista: colección de libros catalogados."),
    q("¿Qué sustantivo colectivo designa al conjunto de músicos que ejecutan instrumentos juntos?", [["🎶","Orquesta"],["👥","Público"],["🎭","Elenco"]], 0, "Pista: conjunto de instrumentistas coordinados por un director."),
    q("¿Qué sustantivo colectivo nombra al conjunto de hojas de un árbol?", [["🍃","Follaje"],["🪵","Leña"],["🌱","Brote"]], 0, "Pista: masa de hojas que viste la copa."),
    q("¿Cuál de estos sustantivos es propio y debe escribirse con mayúscula inicial?", [["📍","Río Gallegos"],["🌊","río caudaloso"],["🐟","peces marinos"]], 0, "Pista: nombre oficial de la capital provincial."),
    q("¿Qué sustantivos nombran cosas que no podemos tocar físicamente como emociones y valores?", [["❤️","Sustantivos abstractos (paz, justicia, alegría)"],["🪨","Sustantivos concretos (piedra, mesa)"],["📍","Sustantivos propios geográficos"]], 0, "Pista: ideas, sentimientos y conceptos inmateriales."),
    q("¿Cuál de las siguientes palabras es un sustantivo abstracto?", [["✨","Solidaridad"],["🧱","Ladrillo"],["🍞","Pan casero"]], 0, "Pista: virtud humana que no se puede tocar con la mano."),
    q("¿Cuál de las siguientes palabras es un sustantivo concreto?", [["🏔️","Montaña"],["💭","Esperanza"],["⚖️","Libertad"]], 0, "Pista: objeto del mundo físico perceptible por los sentidos."),
    q("¿Qué sustantivo colectivo designa al conjunto ordenado de soldados de un país?", [["🪖","Ejército"],["🐎","Tropilla"],["🐺","Jauría"]], 0, "Pista: cuerpo armado nacional."),
    q("¿Qué sustantivo colectivo designa al conjunto de cerdos de una granja?", [["🐷","Piara"],["🐑","Rebaño"],["🐟","Cardumen"]], 0, "Pista: término específico para el grupo de porcinos."),
  ],
  18: [
    q("¿Qué función cumple el adjetivo al acompañar al sustantivo?", [["🎨","Modificarlo indicando cualidades, origen o cantidad"],["⏰","Indicar la persona, el número y el tiempo del verbo"],["🔗","Funcionar como enlace subordinante entre oraciones"]], 0, "Pista: agrega rasgos descriptivos de aspecto, procedencia o número."),
    q("¿Qué tipo de adjetivo describe cómo es un objeto o ser (ejemplo: «viento helado», «árbol alto»)?", [["❄️","Adjetivo calificativo"],["🗺️","Adjetivo gentilicio"],["🔢","Adjetivo numeral cardinal"]], 0, "Pista: señala cualidades perceptibles de los sustantivos."),
    q("¿Qué tipo de adjetivo indica el lugar de origen o procedencia de una persona o cosa?", [["🗺️","Adjetivo gentilicio"],["🎨","Adjetivo calificativo"],["🔢","Adjetivo numeral ordinal"]], 0, "Pista: señala la provincia, país o ciudad natal."),
    q("¿Cuál es el gentilicio correcto de la persona nacida en la provincia de Santa Cruz?", [["🗺️","Santacruceño / santacruceña"],["📍","Chubutense del valle inferior"],["📍","Neuquino de la zona cordillerana"]], 0, "Pista: sufijo -eño tradicional de nuestra provincia."),
    q("¿Cuál es el gentilicio de quien nació en la provincia de Tierra del Fuego?", [["🗺️","Fueguino / fueguina"],["📍","Chubutense costero"],["📍","Rionegrino del alto valle"]], 0, "Pista: gentilicio de la provincia más austral de Argentina."),
    q("¿Qué tipo de adjetivo numeral expresa una cantidad exacta (tres, cuatro, cien)?", [["🔢","Numeral cardinal"],["🥇","Numeral ordinal de posición"],["🎨","Calificativo descriptivo"]], 0, "Pista: números que sirven para contar cantidades enteras."),
    q("¿Qué tipo de adjetivo numeral expresa el orden de sucesión o puesto (primero, segundo, cuarto)?", [["🥇","Numeral ordinal"],["🔢","Numeral cardinal de cantidad"],["🗺️","Gentilicio geográfico"]], 0, "Pista: marca la posición en una serie."),
    q("¿Cuál es el gentilicio de la persona nacida en la ciudad de Río Gallegos?", [["🏙️","Riogalleguense"],["🏙️","Madrynense"],["🏙️","Comodorense"]], 0, "Pista: gentilicio propio de los vecinos de la capital santacruceña."),
    q("¿Cuál es el gentilicio de los habitantes de la localidad de El Calafate?", [["🫐","Calafateño / calafateña"],["🫐","Cordillerano"],["🫐","Estepario"]], 0, "Pista: gentilicio formado a partir del nombre de la villa."),
    q("¿Cuál es el gentilicio de quien nació en la provincia del Chubut?", [["🗺️","Chubutense"],["🗺️","Santafesino"],["🗺️","Misionero"]], 0, "Pista: provincia vecina al norte de Santa Cruz."),
    q("En la frase «cuatro guanacos veloces», ¿qué clase de palabra es «cuatro»?", [["🔢","Adjetivo numeral cardinal"],["🥇","Adjetivo numeral ordinal"],["🎨","Adjetivo calificativo"]], 0, "Pista: indica la cantidad exacta de animales."),
    q("En la frase «el cuarto grado de la escuela», ¿qué tipo de adjetivo es «cuarto»?", [["🥇","Adjetivo numeral ordinal"],["🔢","Adjetivo numeral cardinal"],["🗺️","Adjetivo gentilicio"]], 0, "Pista: señala la posición del grado escolar."),
    q("En la frase «la meseta árida y ventosa», ¿qué tipo de adjetivos son «árida» y «ventosa»?", [["💨","Adjetivos calificativos"],["🗺️","Adjetivos gentilicios"],["🔢","Adjetivos numerales"]], 0, "Pista: describen características del relieve y clima."),
    q("¿Cómo se escriben los gentilicios en español según las normas de ortografía?", [["🔡","Con letra minúscula (salvo al iniciar oración)"],["🔠","Con mayúscula inicial obligatoria"],["#️⃣","Con un guion intermedio"]], 0, "Pista: en nuestro idioma los términos de origen no llevan mayúscula inicial."),
    q("¿Qué adjetivo calificativo describe una fruta que tiene mucho jugo al morderla?", [["🍊","Jugosa"],["🪨","Áspera"],["🧱","Dura"]], 0, "Pista: característica de frutas frescas maduras."),
    q("¿Cuál es el adjetivo ordinal correspondiente al número 10?", [["🔟","Décimo / décima"],["🔟","Diez"],["🔟","Veinteno"]], 0, "Pista: puesto que sigue al noveno."),
    q("¿Cuál es el adjetivo ordinal correspondiente al número 3?", [["🥉","Tercero / tercera"],["🔢","Tres"],["➕","Triple"]], 0, "Pista: puesto que sigue al segundo."),
    q("Marcá el adjetivo gentilicio en la frase: «Compramos deliciosos chocolates barilochenses».", [["🍫","barilochenses"],["🍫","deliciosos"],["🍫","chocolates"]], 0, "Pista: indica que provienen de la ciudad de Bariloche."),
    q("¿Qué terminación es muy frecuente en los adjetivos calificativos que indican abundancia?", [["💨","-oso / -osa (ventoso, calurosa, espinoso)"],["🔨","-ero / -era"],["🌱","-ito / -ita"]], 0, "Pista: derivan de sustantivos para expresar cualidad abundante."),
    q("¿Qué ocurre con la forma del adjetivo si el sustantivo al que acompaña cambia a plural?", [["👥","El adjetivo también debe pasar al plural por concordancia"],["👤","El adjetivo permanece siempre en singular"],["🔒","El adjetivo cambia de significado"]], 0, "Pista: correspondencia morfológica en cantidad."),
  ],
  19: [
    q("¿Qué dos accidentes gramaticales deben coincidir obligatoriamente entre sustantivo y adjetivo?", [["⚖️","El género (femenino/masculino) y el número (singular/plural)"],["⏰","El tiempo histórico y el modo verbal de la frase enunciativa"],["🗣️","La entonación interrogativa y la persona gramatical del verbo"]], 0, "Pista: regla de concordancia nominal básica en español."),
    q("Marcá la frase nominal que presenta correcta concordancia de género y número:", [["📝","«Las altas montañas andinas»"],["📝","«Las altos montañas andinas del sur»"],["📝","«El altas montañas andino»"]], 0, "Pista: artículo, sustantivo y adjetivo en femenino plural."),
    q("Marcá la opción con error de concordancia gramatical:", [["📝","«Los vientos patagónico soplaba.»"],["📝","«Los vientos patagónicos soplaban.»"],["📝","«El viento patagónico soplaba.»"]], 0, "Pista: el sustantivo está en plural pero el término descriptivo quedó en singular."),
    q("Si tenemos un sustantivo femenino y uno masculino juntos, ¿en qué género concuerda el adjetivo plural?", [["👦","En género masculino plural (el río y la laguna cristalinos)"],["👩","En género femenino plural de manera obligatoria e invariable"],["⚖️","En una forma neutra e invariable común a ambos sustantivos"]], 0, "Pista: regla general de concordancia combinada en español."),
    q("¿Cuál es el género y número de la palabra «mesetas»?", [["👧","Femenino plural"],["👦","Masculino plural"],["👤","Femenino singular"]], 0, "Pista: pensá en las bardas o mesetas (género de ellas, cantidad múltiple)."),
    q("¿Cuál es el género y número de la palabra «glaciar»?", [["👦","Masculino singular"],["👩","Femenino de número singular"],["👦","Masculino en número plural"]], 0, "Pista: pensá en el cerro o ventisquero (género de él, cantidad única)."),
    q("Completá con el adjetivo en correcta concordancia: «Compramos unas manzanas _____».", [["🍎","rojas y dulces"],["🍎","rojo y dulce"],["🍎","rojas y dulce"]], 0, "Pista: manzanas es femenino plural."),
    q("Completá con la forma correcta: «Observamos un cóndor y un huemul _____».", [["🦅","protegidos por la ley"],["🦅","protegida por la ley"],["🦅","protegidas por la ley"]], 0, "Pista: dos sustantivos masculinos en plural."),
    q("¿Qué adjetivos tienen una sola forma tanto para el masculino como para el femenino (ejemplo: «árbol verde / hoja verde»)?", [["🌿","Adjetivos de una sola terminación"],["🎨","Adjetivos de dos terminaciones"],["🔢","Adjetivos invariables numerales"]], 0, "Pista: inteligente, verde, grande, veloz no cambian con el género."),
    q("¿Cuál de estos adjetivos es de una sola terminación para ambos géneros?", [["⚡","Veloz (puma veloz / liebre veloz)"],["❄️","Frío (viento frío / agua fría)"],["🪵","Seco (pasto seco / rama seca)"]], 0, "Pista: termina en -z y no cambia en femenino."),
    q("Marcá la concordancia correcta para el sustantivo femenino singular «águila»:", [["🦅","«El águila solitaria»"],["🦅","«La águila solitaria»"],["🦅","«El águila solitario»"]], 0, "Pista: lleva 'el' por empezar con 'a' tónica, pero el adjetivo sigue en femenino."),
    q("¿Por qué decimos «el agua fría» y no «la agua fría»?", [["💧","Para evitar la cacofonía por la 'a' inicial acentuada"],["👦","Porque 'agua' es un sustantivo masculino debido"],["❄️","Porque es una excepción invariable"]], 0, "Pista: regla eufónica de los sustantivos femeninos que empiezan con 'a' tónica."),
    q("Al pasar «el agua fría» al plural, ¿cómo queda correctamente redactado?", [["💧","«Las aguas frías»"],["💧","«Los aguas frías»"],["💧","«Los aguas fríos»"]], 0, "Pista: en plural se usa el artículo femenino 'las'."),
    q("Completá con concordancia adecuada: «La pequeña flor silvestre y el pasto duro estaban _____».", [["🌱","secos por el viento"],["🌱","secas por el viento"],["🌱","seca por el viento"]], 0, "Pista: combinación de femenino y masculino coordina en masculino plural."),
    q("Marcá la opción que tiene todos sus elementos en masculino singular:", [["👦","«El frondoso bosque andino»"],["👧","«La frondosa arboleda andina»"],["👥","«Los frondosos bosques andinos»"]], 0, "Pista: un solo ambiente arbóreo en género masculino."),
    q("¿Qué terminación suele agregarse a los sustantivos que terminan en vocal átona para formar el plural?", [["🔡","Se agrega la letra -s (casa -> casas)"],["🔡","Se agrega -es obligatoriamente"],["🔠","Se cambia la vocal final por consonante"]], 0, "Pista: regla general para palabras terminadas en vocal átona."),
    q("¿Qué terminación se agrega a los sustantivos que terminan en consonante para hacer el plural?", [["🔡","Se agrega -es (árbol -> árboles, mar -> mares)"],["🔡","Se agrega solo la letra -s"],["🔒","Permanecen invariables"]], 0, "Pista: cuando terminan en consonante, se añade una sílaba completa."),
    q("Marcá la oración con adecuada concordancia en toda su extensión:", [["📝","Las ovejas blancas caminaban tranquilas por el campo."],["📝","Las ovejas blanco caminaban tranquila por el campo"],["📝","Los ovejas blancas caminaba tranquilos por el campo."]], 0, "Pista: todos los elementos femeninos y plurales coinciden."),
    q("¿Qué artículo corresponde al sustantivo femenino «costumbre» en plural?", [["👵","«Las costumbres»"],["👴","«Los costumbres»"],["👥","«Unos costumbres»"]], 0, "Pista: sustantivo femenino."),
    q("¿Por qué es fundamental revisar la concordancia de género y número al redactar textos escolares?", [["📝","Para asegurar corrección gramatical y claridad en el mensaje"],["🎨","Para que las oraciones tengan exactamente diez palabras"],["⏰","Para escribir con mayor rapidez y organizar adecuadamente la información comunicada"]], 0, "Pista: asegura que las oraciones suenen naturales y correctas."),
  ],
  20: [
    q("¿Qué clase de palabras indica acciones, estados o procesos en una oración?", [["⚡","Los verbos"],["🏷️","Los sustantivos comunes"],["🎨","Los adjetivos calificativos"]], 0, "Pista: cantar, correr, vivir, sentir, estar."),
    q("¿Cuáles son las tres personas gramaticales del singular?", [["👤","1.ª yo, 2.ª vos / tú, 3.ª él / ella"],["👥","1.ª nosotros, 2.ª ustedes, 3.ª ellos del plural"],["🔢","Primero, segundo y tercero"]], 0, "Pista: quien habla (1.ª), a quien se habla (2.ª) y de quien se habla (3.ª)."),
    q("¿Cuáles son las tres personas gramaticales del plural?", [["👥","1.ª nosotros/as, 2.ª ustedes/vosotros, 3.ª ellos/as"],["👤","1.ª yo, 2.ª vos o usted, 3.ª él o ella del singular"],["⏰","Tiempos del pasado, presente y futuro del modo real"]], 0, "Pista: involucran a más de un individuo."),
    q("¿Qué parte del verbo nos indica la persona, el número y el tiempo gramatical?", [["🧩","La desinencia o terminación verbal"],["🌱","La raíz invariable de la palabra base"],["🛑","El prefijo inicial"]], 0, "Pista: la parte final que cambia indicando persona y tiempo."),
    q("¿En qué persona y número está conjugado el verbo en: «Nosotros cuidamos el bosque»?", [["👥","1.ª persona del plural"],["👤","1.ª persona del singular"],["👥","3.ª persona del plural"]], 0, "Pista: nosotros = pronombre de grupo que incluye a quien habla."),
    q("¿En qué persona y número está conjugado el verbo en: «Vos explorás la meseta»?", [["🗣️","2.ª persona del singular"],["👤","1.ª persona del singular"],["👥","2.ª persona del plural"]], 0, "Pista: pronombre de trato cotidiano en Argentina hacia quien escucha."),
    q("¿En qué persona y número está conjugado el verbo en: «Ellos observan a los cóndores»?", [["👥","3.ª persona del plural"],["👥","1.ª persona del plural"],["👤","3.ª persona del singular"]], 0, "Pista: pronombre para referirse a otras personas ausentes."),
    q("¿Cuál de las siguientes formas verbales corresponde a la primera persona del singular (yo)?", [["👤","Escribo"],["👥","Escribimos"],["👥","Escriben"]], 0, "Pista: acción realizada por 'yo'."),
    q("¿Cuál de las siguientes formas verbales corresponde a la segunda persona del singular con voseo (vos)?", [["🗣️","Estudiás"],["👤","Estudio"],["👥","Estudiamos"]], 0, "Pista: en el voseo argentino se acentúa en la última sílaba."),
    q("En la oración «Tomás y Lucas encendieron el fuego», ¿qué persona gramatical tiene el verbo?", [["👥","3.ª persona del plural (ellos)"],["👥","1.ª persona del plural (nosotros)"],["👤","2.ª persona del singular (vos)"]], 0, "Pista: dos muchachos se sustituyen por el pronombre múltiple que no nos incluye."),
    q("¿Qué pronombre corresponde al verbo en la frase: «_____ compartimos la merienda»?", [["👥","Nosotros / nosotras"],["👥","Ellos y ellas (tercera persona)"],["👥","Ustedes o vosotros (segunda)"]], 0, "Pista: desinencia -imos de 1.ª persona del plural."),
    q("¿Qué pronombre corresponde al verbo en la frase: «_____ protegés la naturaleza»?", [["🗣️","Vos / tú"],["👤","Yo"],["👥","Nosotros"]], 0, "Pista: desinencia de segunda persona singular."),
    q("¿Qué pronombre corresponde al verbo en la frase: «_____ descubrió una cueva con pinturas»?", [["👤","Él / ella"],["👤","Yo (primera persona singular)"],["👥","Ellos (tercera persona plural)"]], 0, "Pista: desinencia de tercera persona singular del pasado."),
    q("Completá con el verbo adecuado para 'nosotros': «El próximo verano _____ a El Chaltén».", [["🏔️","viajaremos"],["🏔️","viajaré"],["🏔️","viajarán"]], 0, "Pista: desinencia -emos de 1.ª persona plural futuro."),
    q("Completá con el verbo adecuado para 'vos': «¿_____ al nuevo compañero de banco?»", [["🎒","Conocés"],["🎒","Conozco"],["🎒","Conocen"]], 0, "Pista: conjugación rioplatense para vos."),
    q("¿Por qué el verbo cambia su terminación al cambiar de sujeto?", [["⚖️","Para mantener la concordancia de persona y número"],["🎨","Para que la frase rime como verso"],["⏰","Para cambiar el tipo de texto"]], 0, "Pista: si cambia quien realiza la acción, cambia la terminación verbal."),
    q("Marcá la forma verbal que está en primera persona del plural:", [["👥","Cantamos"],["👤","Canto"],["👥","Cantan"]], 0, "Pista: primera persona del plural en presente o pasado."),
    q("Marcá la forma verbal que está en tercera persona del singular:", [["👤","Construye"],["👤","Construyo"],["👥","Construyen"]], 0, "Pista: tercera persona del singular en presente indicativo."),
    q("¿Qué persona gramatical se utiliza comúnmente al relatar anécdotas autobiográficas personales?", [["👤","1.ª persona del singular (yo)"],["👥","3.ª persona del plural (ellos)"],["🗣️","2.ª persona formal (usted)"]], 0, "Pista: narra vivencias propias directas."),
    q("¿Qué pronombre de segunda persona se usa predominantemente en el habla cotidiana de Santa Cruz y Argentina?", [["🗣️","El pronombre «vos»"],["🗣️","El pronombre «vosotros»"],["🗣️","El pronombre «ustedes» únicamente en singular"]], 0, "Pista: voseo rioplatense y patagónico tradicional."),
  ],
  21: [
    q("¿Qué tiempo verbal expresa acciones que están ocurriendo en el momento actual?", [["☀️","El tiempo presente"],["📜","El tiempo pasado o pretérito"],["🔮","El tiempo futuro"]], 0, "Pista: «Hoy el viento sopla fuerte en la meseta»."),
    q("¿Qué tiempo verbal indica que la acción ya se realizó y quedó atrás en el tiempo?", [["📜","El tiempo pasado o pretérito"],["☀️","El tiempo presente de la acción"],["🔮","El tiempo futuro que ocurrirá"]], 0, "Pista: «Ayer nevó en la cordillera»."),
    q("¿Qué tiempo verbal señala acciones que sucederán más adelante?", [["🔮","El tiempo futuro"],["☀️","El tiempo presente"],["📜","El tiempo pasado"]], 0, "Pista: «Mañana visitaremos el museo municipal»."),
    q("En la oración «Los turistas caminan por la pasarela del glaciar», ¿en qué tiempo está el verbo?", [["☀️","Tiempo presente"],["📜","Tiempo pasado o pretérito"],["🔮","Tiempo futuro del indicativo"]], 0, "Pista: 'caminan' ocurre en la actualidad."),
    q("En la oración «Ayer el guía explicó las medidas de seguridad», ¿en qué tiempo está el verbo?", [["📜","Tiempo pasado (pretérito)"],["☀️","Tiempo presente de la acción"],["🔮","Tiempo futuro que se avecina"]], 0, "Pista: 'explicó' ocurrió en el día de ayer."),
    q("En la oración «El próximo verano viajaremos a Puerto Deseado», ¿en qué tiempo está el verbo?", [["🔮","Tiempo futuro"],["☀️","Tiempo presente"],["📜","Tiempo pasado"]], 0, "Pista: 'viajaremos' es una acción que ocurrirá más adelante."),
    q("¿Cuál de las siguientes formas verbales está en tiempo presente?", [["☀️","estudiamos"],["📜","estudiaremos"],["📜","habíamos estudiado"]], 0, "Pista: primera persona del plural en tiempo presente."),
    q("¿Cuál de las siguientes formas verbales está en tiempo pasado?", [["📜","descubrió"],["☀️","descubre"],["🔮","descubrirá"]], 0, "Pista: acción terminada con tilde en la última vocal."),
    q("¿Cuál de las siguientes formas verbales está en tiempo futuro?", [["🔮","conocerán"],["☀️","conocen"],["📜","conocieron"]], 0, "Pista: acción que ocurrirá en el porvenir."),
    q("¿Qué palabra temporal suele acompañar habitualmente a los verbos en tiempo pasado?", [["⏪","«Ayer» o «el año pasado»"],["☀️","«Hoy en este momento»"],["🔮","«El próximo mes»"]], 0, "Pista: circunstancial temporal que remite a lo ya sucedido."),
    q("¿Qué palabra temporal acompaña con frecuencia a los verbos en tiempo futuro?", [["🔮","«Mañana» o «la próxima semana»"],["⏪","«Anteayer al mediodía»"],["☀️","«Ahora mismo»"]], 0, "Pista: circunstancial que proyecta hacia adelante."),
    q("¿Qué modo verbal expresa hechos reales, seguros y objetivos (como presente, pretérito y futuro del indicativo)?", [["🏛️","El modo indicativo"],["💭","El modo subjuntivo de deseos"],["👉","El modo imperativo de órdenes"]], 0, "Pista: afirma o niega hechos con certeza en la realidad."),
    q("Completá con el verbo en pasado: «El pionero _____ un refugio de piedra».", [["🏠","construyó"],["🏠","construye"],["🏠","construirá"]], 0, "Pista: acción realizada en el pasado histórico."),
    q("Completá con el verbo en futuro: «La semana que viene _____ la primavera».", [["🌸","llegará"],["🌸","llegó"],["🌸","llega"]], 0, "Pista: hecho que tendrá lugar en los días venideros."),
    q("Completá con el verbo en presente: «Los pingüinos _____ en las aguas frías».", [["🐧","nadan"],["🐧","nadaron"],["🐧","nadarán"]], 0, "Pista: hábito o acción que realizan habitualmente."),
    q("¿Cómo se llama el tiempo pasado que expresa acciones habituales o duraderas (ejemplo: «caminaba todos los días»)?", [["📜","Pretérito imperfecto"],["🎯","Pretérito perfecto simple"],["🔮","Futuro imperfecto"]], 0, "Pista: describe costumbres o acciones continuas en el pasado."),
    q("¿Qué tiempo verbal predomina en una narración de hechos históricos o leyendas tradicionales?", [["📜","Los tiempos del pasado (pretéritos)"],["🔮","El tiempo futuro simple"],["☀️","El modo imperativo"]], 0, "Pista: narran acontecimientos que ya sucedieron."),
    q("Transformá al futuro el verbo de la oración: «El choique corre veloz»:", [["🔮","«El choique correrá veloz»"],["📜","«El choique corrió veloz»"],["☀️","«El choique está corriendo veloz»"]], 0, "Pista: terminación -á de futuro en 3.ª persona singular."),
    q("¿Por qué los textos expositivos de ciencias suelen redactarse en tiempo presente?", [["💡","Porque explican leyes y características que siguen vigentes"],["⏳","Porque los científicos no recuerdan el pasado"],["📜","Porque las enciclopedias prohíben el pasado"]], 0, "Pista: presente de definición universal."),
    q("Completá con el verbo en presente: «Hoy los alumnos _____ sobre la fauna patagónica».", [["📚","investigan"],["📚","investigaron"],["📚","investigarán"]], 0, "Pista: acción que tiene lugar en la jornada de hoy."),
  ],
  22: [
    q("¿Qué diferencia principal existe entre el pretérito perfecto simple y el imperfecto?", [["⚖️","El perfecto es acción puntual terminada; el imperfecto describe costumbres o marcos"],["☀️","El perfecto relata hechos diurnos mientras que el imperfecto se usa durante la noche"],["🔠","El perfecto se redacta solo en mayúsculas mientras el imperfecto se anota en minúsculas"]], 0, "Pista: un tiempo señala hecho acabado instantáneo; el otro un marco continuo de fondo."),
    q("¿En qué pretérito está el verbo en: «Ayer Carlos llegó a El Chaltén»?", [["🎯","Pretérito perfecto simple"],["📜","Pretérito imperfecto del indicativo"],["🔮","Futuro simple de acciones venideras"]], 0, "Pista: acción puntual y concluida en el pasado."),
    q("¿En qué pretérito está el verbo en: «En aquella época el explorador viajaba a caballo»?", [["📜","Pretérito imperfecto"],["🎯","Pretérito perfecto simple"],["☀️","Presente continuo"]], 0, "Pista: describe una costumbre reiterada en el pasado."),
    q("¿Qué terminación es característica del pretérito imperfecto en los verbos de la 1.ª conjugación (-ar)?", [["📝","La terminación -aba (cantaba, caminaba, soplaba)"],["📝","La terminación -ía con tilde (temía, corría)"],["📝","La desinencia regular de infinitivo en -ar o -er"]], 0, "Pista: siempre se escribe con letra B larga: -aba, -abas, -ábamos."),
    q("¿Qué terminación caracteriza al pretérito imperfecto en los verbos de 2.ª (-er) y 3.ª (-ir) conjugación?", [["📝","La terminación -ía con tilde (vivía, temía, abría)"],["📝","La terminación -aba regular"],["🎯","La terminación -ió"]], 0, "Pista: se escribe con acento gráfico para romper el diptongo."),
    q("¿Con qué letra se escribe siempre la terminación -aba del pretérito imperfecto?", [["🅱️","Siempre con B (larga)"],["🆅","Siempre con V (corta)"],["🔤","Con B o V indistintamente"]], 0, "Pista: regla fija de ortografía: caminaba, jugaba, soñaba con B."),
    q("En una narración, ¿para qué se suele utilizar el pretérito imperfecto?", [["🖼️","Para describir el paisaje, el ambiente y las costumbres del pasado"],["🎯","Para señalar las acciones sorpresivas que mueven la trama"],["🔮","Para anticipar lo que pasará en el desenlace"]], 0, "Pista: pinta el fondo de la historia («Hacía frío y el viento soplaba...»)."),
    q("En una narración, ¿para qué se utiliza el pretérito perfecto simple?", [["🎯","Para relatar las acciones puntuales que hacen avanzar el relato"],["🖼️","Para describir detalladamente las características del lugar y organizar adecuadamente la información comunicada"],["☀️","Para enunciar definiciones científicas"]], 0, "Pista: sucesos que ocurren paso a paso («...cuando de pronto se escuchó un ruido y salió el guía»)."),
    q("Completá con el tiempo adecuado: «Mientras caminaban por el bosque, de pronto _____ una rama seca».", [["💥","se quebró"],["🌿","se quebraba"],["🔮","se quebrará"]], 0, "Pista: acontecimiento repentino que interrumpe la escena."),
    q("Completá con el tiempo adecuado: «De niño, Martín _____ todos los veranos a pescar al río».", [["🎣","iba"],["🎣","fue"],["🎣","irá"]], 0, "Pista: describe una costumbre reiterada en su infancia."),
    q("¿Cuál es la forma del pretérito imperfecto del verbo 'ir' para la primera persona?", [["📜","Iba (con B)"],["📜","Iva (con V)"],["🎯","Fui"]], 0, "Pista: forma irregular tradicional escrita con B larga."),
    q("¿Cuál es la forma del pretérito imperfecto del verbo 'ser' para la tercera persona?", [["📜","Era"],["🎯","Fue"],["☀️","Es"]], 0, "Pista: «El paraje era muy tranquilo en invierno»."),
    q("Marcá el verbo que está conjugado en pretérito perfecto simple:", [["🎯","encontró"],["📜","encontraba"],["☀️","encuentra"]], 0, "Pista: acción puntual con tilde en la última sílaba."),
    q("Marcá el verbo que está conjugado en pretérito imperfecto:", [["📜","navegaba"],["🎯","navegó"],["🔮","navegará"]], 0, "Pista: terminación -aba que describe acción en curso en el pasado."),
    q("¿Lleva tilde la primera persona del plural del pretérito imperfecto en -ábamos (ejemplo: cantábamos)?", [["✍️","Sí: siempre es palabra esdrújula"],["✍️","No: las formas en -aba nunca se acentúan"],["🔒","Solo si termina el párrafo"]], 0, "Pista: can-tá-ba-mos lleva tilde en la antepenúltima sílaba."),
    q("Completá la frase: «El cielo _____ nublado cuando comenzó la llovizna».", [["☁️","estaba"],["🎯","estuvo"],["☀️","está"]], 0, "Pista: describe el estado del cielo como marco del momento."),
    q("Completá la frase: «El perito Moreno _____ el río Santa Cruz en 1877».", [["🗺️","remontó"],["🛶","remontaba"],["🔮","remontará"]], 0, "Pista: hito fechado con precisión cronológica."),
    q("¿Por qué en una leyenda o cuento ambos pretéritos se combinan constantemente?", [["📖","El imperfecto describe la escena y el perfecto hace avanzar los hechos"],["🎨","Para alternar letras mayúsculas y minúsculas"],["⏰","Porque es obligatorio según las reglas de imprenta"]], 0, "Pista: combinación de descripción de fondo y acciones puntuales."),
    q("¿Cómo se escribe la forma de 3.ª persona singular del pretérito perfecto simple del verbo 'tener'?", [["⏳","Tuvo (con V corta)"],["🚰","Tubo (cilindro hueco con B)"],["📦","Tubos"]], 0, "Pista: pensá en el verbo tener en pasado, no en un caño hueco."),
    q("Marcá la oración redactada con la combinación de pretéritos adecuada:", [["📝","La noche era fría y de repente brilló un relámpago."],["📝","La noche fue fría y de repente brillaba un relámpago."],["📝","La noche es fría y de repente brillará un relámpago."]], 0, "Pista: descripción de fondo en imperfecto más suceso puntual instantáneo."),
  ],
  23: [
    q("¿Qué es el «infinitivo» de un verbo?", [["🏷️","La forma no personal que da nombre al verbo (-ar, -er, -ir)"],["⏰","La conjugación del tiempo futuro en primera persona singular"],["👤","La construcción del sujeto agente que protagoniza la acción"]], 0, "Pista: la palabra que buscamos en el diccionario (cantar, comer, vivir)."),
    q("¿Cuáles son las tres terminaciones de los infinitivos en español?", [["📝","-ar, -er, -ir"],["📝","-ando, -endo, -iendo"],["📝","-ado, -ido, -to"]], 0, "Pista: corresponden a la primera, segunda y tercera conjugación."),
    q("¿A qué conjugación pertenecen los verbos terminados en -ar (ejemplo: caminar, viajar, navegar)?", [["1️⃣","Primera conjugación"],["2️⃣","Segunda conjugación"],["3️⃣","Tercera conjugación"]], 0, "Pista: es el grupo de verbos más común en nuestro idioma."),
    q("¿A qué conjugación pertenecen los verbos terminados en -er (ejemplo: correr, aprender, proteger)?", [["2️⃣","Segunda conjugación"],["1️⃣","Primera conjugación"],["3️⃣","Tercera conjugación"]], 0, "Pista: modelo temer o comer."),
    q("¿A qué conjugación pertenecen los verbos terminados en -ir (ejemplo: vivir, abrir, subir)?", [["3️⃣","Tercera conjugación"],["1️⃣","Primera conjugación"],["2️⃣","Segunda conjugación"]], 0, "Pista: modelo partir o vivir."),
    q("¿Por qué se dice que el infinitivo es una forma «no personal» del verbo?", [["👤","Porque no expresa por sí mismo qué persona gramatical realiza la acción ni el tiempo"],["👤","Porque resulta una forma lingüística inaplicable al referirse a seres humanos reales"],["🤖","Porque constituye una palabra carente por completo de cualquier clase de significado"]], 0, "Pista: carece de marcas gramaticales de conjugación y pronombre."),
    q("¿En qué forma encontramos habitualmente los verbos al buscarlos en el diccionario?", [["📖","En su forma de infinitivo"],["📜","En pretérito perfecto simple"],["🔮","En tiempo futuro del indicativo"]], 0, "Pista: se busca 'escribir' y no 'escribí' o 'escribiremos'."),
    q("¿Cuál es el infinitivo del verbo conjugado «descubrieron»?", [["🔍","Descubrir"],["🔍","Descubierto"],["🔍","Descubriendo"]], 0, "Pista: termina en -ir."),
    q("¿Cuál es el infinitivo del verbo conjugado «caminábamos»?", [["🚶","Caminar"],["🚶","Caminando"],["🚶","Caminado"]], 0, "Pista: termina en -ar."),
    q("¿Cuál es el infinitivo del verbo conjugado «protegemos»?", [["🛡️","Proteger"],["🛡️","Protegido"],["🛡️","Protegiendo"]], 0, "Pista: termina en -er."),
    q("¿En qué tipo de textos escolares es muy común redactar instrucciones usando infinitivos?", [["📋","En recetas de cocina y manuales de instrucciones"],["📰","En noticias de última hora de diarios las lecturas compartidas durante el ciclo escolar"],["📜","En biografías históricas"]], 0, "Pista: «Mezclar los ingredientes», «Pegar las partes»."),
    q("¿Cómo se llama la parte fija del infinitivo tras quitarle la terminación -ar, -er o -ir?", [["🌱","La raíz del verbo"],["🧩","La desinencia final"],["🛑","El prefijo derivativo"]], 0, "Pista: cant-ar -> cant- es la raíz."),
    q("¿Cuál es la raíz del verbo «navegar»?", [["⛵","«naveg-»"],["⛵","«nav-»"],["⛵","«navega-»"]], 0, "Pista: quitamos la terminación -ar de la primera conjugación."),
    q("¿Cuál es la raíz del verbo «aprender»?", [["📚","«aprend-»"],["📚","«ap-»"],["📚","«aprende-»"]], 0, "Pista: quitamos la terminación -er de la segunda conjugación."),
    q("¿Cuál es la raíz del verbo «partir»?", [["🚪","«part-»"],["🚪","«pa-»"],["🚪","«parti-»"]], 0, "Pista: quitamos la terminación -ir de la tercera conjugación."),
    q("¿En cuál de las siguientes oraciones aparece un verbo en forma de infinitivo (-ar, -er, -ir)?", [["📝","Es necesario cuidar la fauna autóctona."],["📝","Los guardaparques cuidan la fauna nativa."],["📝","Ayer cuidaron a los animales del parque."]], 0, "Pista: forma verbal no conjugada terminada en -ar."),
    q("¿Qué otra forma no personal del verbo termina en -ando o -iendo (ejemplo: caminando, viviendo)?", [["🏃","El gerundio"],["📦","El participio"],["🏷️","El infinitivo"]], 0, "Pista: expresa una acción en desarrollo continuo."),
    q("¿Qué otra forma no personal del verbo termina en -ado o -ido (ejemplo: caminado, vivido)?", [["📦","El participio"],["🏃","El gerundio"],["🏷️","El infinitivo"]], 0, "Pista: se utiliza para formar tiempos compuestos y adjetivos participiales."),
    q("¿Cuál de estos verbos pertenece a la primera conjugación?", [["🌲","Plantar"],["🏃","Correr (segunda conjugación)"],["🧗","Subir (tercera conjugación)"]], 0, "Pista: termina en -ar."),
    q("¿Cuál de estos verbos pertenece a la tercera conjugación?", [["🐟","Surgir"],["🌾","Cosechar"],["🥣","Moler"]], 0, "Pista: termina en -ir."),
  ],
  24: [
    q("¿Cómo se llaman las palabras que tienen un significado idéntico o muy parecido?", [["🔄","Palabras sinónimas"],["⚡","Palabras antónimas"],["🔊","Palabras homófonas"]], 0, "Pista: términos que comparten un significado equivalente o semejante."),
    q("¿Cómo se llaman las palabras que expresan significados opuestos o contrarios?", [["⚡","Palabras antónimas"],["🔄","Palabras sinónimas"],["🏷️","Palabras derivadas"]], 0, "Pista: alto y bajo, frío y caliente."),
    q("¿Cuál es el sinónimo más adecuado para «gélido» en el contexto del clima cordillerano?", [["❄️","Helado o muy frío"],["☀️","Templado y apacible"],["💨","Ventoso del cuadrante oeste"]], 0, "Pista: refiere a temperaturas extremadamente bajas."),
    q("¿Cuál es el antónimo de la palabra «escaso» en la frase «el agua es escasa en la meseta»?", [["🌊","Abundante o copiosa"],["🌊","Poco profunda en el río"],["🪨","Dura como la piedra"]], 0, "Pista: lo contrario de haber poco es haber mucho."),
    q("¿Cuál es el sinónimo adecuado para la palabra «sendero» en una excursión andina?", [["🥾","Camino o senda"],["🚗","Ruta asfaltada"],["🏠","Refugio"]], 0, "Pista: huella estrecha para caminar."),
    q("¿Cuál es el antónimo de la palabra «áspero» al describir la superficie de una roca?", [["✋","Suave o lisa"],["🪨","Rugosa y pedregosa"],["❄️","Fría y húmeda"]], 0, "Pista: lo opuesto a rugoso al tacto."),
    q("¿Por qué el significado de un sinónimo depende siempre del contexto de la oración?", [["📖","Porque una palabra puede tener varios sentidos según cómo se use"],["🎨","Porque cambia según la ortografía del autor"],["⏰","Porque depende de la extensión de la frase"]], 0, "Pista: 'banco' de plaza no es lo mismo que 'banco' de dinero."),
    q("¿Cuál es el sinónimo de «veloz» en la frase «el choique es un ave muy veloz»?", [["🏃","Rápido o ligero"],["🐢","Lento"],["🪶","Plumoso"]], 0, "Pista: capacidad de desplazarse a gran velocidad."),
    q("¿Cuál es el antónimo de la palabra «angosto» al describir un cañadón de la meseta?", [["↔️","Ancho o espacioso"],["📏","Estrecho"],["🏔️","Profundo"]], 0, "Pista: lo opuesto a estrecho."),
    q("¿Qué prefijo se suele anteponer a ciertas palabras para formar su antónimo (ejemplo: cómodo)?", [["🚫","El prefijo in- o des- (incómodo, desarmar)"],["➕","El prefijo super-"],["🔄","El prefijo re-"]], 0, "Pista: in- y des- indican negación u oposición."),
    q("¿Cuál es el antónimo formado con prefijo de la palabra «conocido»?", [["❓","Desconocido"],["✨","Reconocido"],["🔍","Muy conocido"]], 0, "Pista: prefijo de negación des-."),
    q("¿Cuál es el sinónimo de la palabra «construir» en la biografía de un pionero?", [["🔨","Edificar o levantar"],["💥","Desarmar"],["🎨","Diseñar"]], 0, "Pista: erigir una vivienda o refugio."),
    q("¿Cuál es el antónimo de la palabra «antiguo» al hablar de un bosque fósil?", [["🌱","Moderno o reciente"],["🪵","Milenario"],["🪨","Petrificado"]], 0, "Pista: opuesto a lo que tiene muchos siglos de antigüedad."),
    q("¿Cuál es el sinónimo de la palabra «auxiliar» en una situación de emergencia médica?", [["🛟","Ayudar o socorrer"],["🏃","Avisar"],["😴","Acompañar"]], 0, "Pista: prestar asistencia a quien lo necesita."),
    q("¿Cuál es el antónimo de «permanente» en la frase «la nieve permanente en las altas cumbres»?", [["⏳","Pasajera o temporal"],["❄️","Eterna"],["🏔️","Abundante"]], 0, "Pista: lo opuesto a duradero o continuo."),
    q("En la frase «El cielo estaba diáfano», ¿qué significa la palabra «diáfano»?", [["☀️","Despejado, transparente y sin nubes"],["☁️","Cubierto de nubarrones"],["🌙","Oscuro"]], 0, "Pista: día claro y luminoso."),
    q("¿Cuál es el sinónimo de «imponente» al describir el frente del glaciar Perito Moreno?", [["🏔️","Majestuoso o grandioso"],["🌱","Pequeño"],["🚪","Inaccesible"]], 0, "Pista: que causa gran admiración o asombro."),
    q("¿Cuál es el antónimo de «prohibido» en el cartel del parque nacional?", [["📌","Permitido o autorizado"],["🚫","Sancionado"],["⚠️","Peligroso"]], 0, "Pista: lo que sí se puede realizar legalmente."),
    q("¿Por qué recurrir a un diccionario de sinónimos mejora la redacción escolar?", [["📚","Permite evitar repeticiones innecesarias y enriquecer el vocabulario"],["🎨","Aumenta el número de páginas escritas"],["⏰","Permite redactar oraciones sin verbos"]], 0, "Pista: ayuda a encontrar la palabra justa y precisa."),
    q("¿Cuál es el sinónimo de «habitar» al estudiar la fauna santacruceña?", [["🏠","Vivir, residir o poblar"],["✈️","Recorrer"],["🏃","Migrar"]], 0, "Pista: tener su morada en un ambiente determinado."),
  ],
  25: [
    q("¿Qué es un «hiperónimo» en el estudio del vocabulario?", [["📦","Una palabra de significado amplio que engloba a otras más específicas"],["🔍","Un vocablo muy restringido que señala a una especie particular y única"],["🎨","Un adjetivo calificativo utilizado para señalar matices de luminosidad"]], 0, "Pista: 'flor' es el hiperónimo de rosa, margarita y notro."),
    q("¿Qué es un «hipónimo» en relación con un hiperónimo?", [["🔍","Una palabra de significado específico incluida dentro de una clase general"],["🌍","El concepto integrador y abarcador que agrupa a todos los elementos afines"],["🛑","Un signo gráfico de puntuación colocado al terminar de escribir un párrafo"]], 0, "Pista: 'lenga' y 'ñire' son hipónimos de 'árbol'."),
    q("¿Cuál es el hiperónimo adecuado para: «guanaco, zorro, huemul y puma»?", [["🐾","Mamíferos"],["🦆","Aves terrestres"],["🐟","Peces fluviales"]], 0, "Pista: clase zoológica general a la que pertenecen todos ellos."),
    q("¿Cuáles son hipónimos del hiperónimo «árboles nativos del bosque andino»?", [["🌲","Lenga, ñire y coihue"],["🌾","Coirón y neneo"],["🫐","Calafate y mata negra"]], 0, "Pista: especies arbóreas de la cordillera austral."),
    q("¿Qué es un «campo semántico» en lengua?", [["🌐","Un grupo de palabras relacionadas entre sí por pertenecer a un mismo tema"],["🌾","Una parcela rural destinada a la siembra rotativa de cereales y forrajeras"],["📐","Un diagrama geométrico de rectas secantes empleado en problemas de cálculo"]], 0, "Pista: vocablos que comparten una esfera de la realidad."),
    q("¿Qué palabras forman parte del campo semántico de la «navegación costera»?", [["⛵","Barco, muelle, timón, marea y marinero"],["🚜","Tractor, arado, semilla y cosecha"],["🎒","Cuaderno, cartuchera, regla y pupitre"]], 0, "Pista: términos propios del trabajo en el mar y puertos."),
    q("¿Cuál es el hiperónimo que abarca a: «manzana, pera, cereza y frutilla»?", [["🍎","Frutas"],["🥦","Hortalizas de hoja"],["🥖","Cereales"]], 0, "Pista: término general que engloba a todas."),
    q("¿Cuáles de los siguientes animales son hipónimos del hiperónimo «aves marinas»?", [["🐧","Pingüino, cormorán y gaviota"],["🦊","Zorro, mara y piche"],["🦭","Lobo marino y elefante marino"]], 0, "Pista: aves adaptadas a la vida en el océano."),
    q("¿Qué término actúa como hiperónimo de «guitarra, charango, violín y piano»?", [["🎸","Instrumentos musicales"],["🎶","Melodías folclóricas"],["📻","Dispositivos de sonido"]], 0, "Pista: categoría general de objetos para producir música."),
    q("En el campo semántico de la «meteorología de Santa Cruz», ¿qué palabras encontramos?", [["💨","Viento, helada, nevada, escarcha y temperatura"],["🎭","Telón, libreto, escenario y butaca"],["🥪","Pan, queso, manteca y dulce"]], 0, "Pista: fenómenos propios del clima provincial."),
    q("¿Por qué en una redacción se suele reemplazar un hipónimo por su hiperónimo (o viceversa)?", [["📝","Para evitar repeticiones monótonas y enriquecer el texto"],["🎨","Para alargar el texto sin agregar información"],["⏰","Para cambiar el tipo de letra y enriquecer el vocabulario utilizado al escribir"]], 0, "Pista: «El cóndor planeaba; el ave vigilaba el cañadón»."),
    q("¿Cuál es la palabra que NO corresponde al hiperónimo «medios de transporte»?", [["🌲","Álamo"],["🚗","Camioneta"],["🚂","Ferrocarril"]], 0, "Pista: especie vegetal autóctona de tronco y hojas."),
    q("¿Cuál es la palabra que no corresponde al hiperónimo «herramientas de carpintería»?", [["🥄","Cuchara"],["🔨","Martillo"],["🪚","Serrucho"]], 0, "Pista: utensilio de cocina ajeno al taller de madera."),
    q("¿Qué palabras integran el campo semántico de «la escuela primaria»?", [["🎒","Docente, aula, recreo, pupitre y campana"],["🚜","Cosechadora, fardo, corral y esquila"],["⚓","Ancla, bodega, salvavidas y cubierta"]], 0, "Pista: elementos y protagonistas del ámbito escolar."),
    q("¿Cuál es el hiperónimo correspondiente a: «fútbol, básquet, natación y vóley»?", [["⚽","Deportes"],["🎮","Juegos de mesa"],["🎬","Espectáculos teatrales"]], 0, "Pista: actividades físicas reglamentadas."),
    q("Marcá los hipónimos que corresponden al hiperónimo «prendas de abrigo de invierno»:", [["🧥","Campera, bufanda, gorro y guantes"],["🩳","Malla, ojotas y sombrero de paja"],["🤿","Traje de buceo y antiparras"]], 0, "Pista: ropa abrigada contra las bajas temperaturas."),
    q("¿Qué relación léxica existe entre «vehículo» y «camión»?", [["📦","«Vehículo» es el hiperónimo y «camión» su hipónimo"],["🔄","Son sinónimos intercambiables en todo contexto"],["⚡","Son antónimos de significado opuesto"]], 0, "Pista: categoría abarcadora frente al tipo particular."),
    q("¿Qué palabras forman el campo semántico de «la esquila en una estancia patagónica»?", [["🐑","Oveja, vellón, tijera, fardo y comparsa"],["✈️","Pista, turbina, hangar y radar"],["🎣","Anzuelo, caña de pescar y señuelo"]], 0, "Pista: faena rural tradicional de obtención de lana."),
    q("¿Cuál es el hiperónimo adecuado para: «glaciar, cañadón, meseta y cordillera»?", [["🏔️","Relieves y formas geográficas"],["🌱","Tipos de vegetación nativa"],["🏠","Construcciones rurales"]], 0, "Pista: accidentes del relieve terrestre de la región."),
    q("¿Por qué conocer hiperónimos e hipónimos ayuda a clasificar información de estudio?", [["🧠","Porque permite ordenar los conceptos en categorías generales y subtemas específicos"],["🎨","Porque ayuda a dibujar mapas conceptuales más coloridos"],["⏰","Porque ahorra espacio al escribir resúmenes"]], 0, "Pista: base lógica de los mapas conceptuales y esquemas."),
  ],
  26: [
    q("¿Qué es una «familia de palabras» en lengua?", [["🌱","Un conjunto de palabras que comparten la misma raíz léxica"],["👥","Un grupo de personas que viven juntas"],["📖","Una antología de cuentos tradicionales"]], 0, "Pista: palabras vinculadas por una base de significado común."),
    q("¿Cuál es la raíz compartida en la familia: «mar, marea, marinero, submarino»?", [["🌊","La raíz «mar-»"],["🌊","La partícula «sub-»"],["🌊","La terminación «-ero»"]], 0, "Pista: elemento léxico común que aporta el significado de base."),
    q("¿Qué es un «prefijo» en la formación de palabras?", [["🧩","Una partícula que se coloca antes de la raíz para formar una nueva palabra"],["🧩","Un sufijo que se agrega al final del término"],["🛑","El punto final de una oración"]], 0, "Pista: elemento que se antepone a la base léxica."),
    q("¿Qué es un «sufijo» en la formación de palabras?", [["🧩","Una partícula que se agrega al final de la raíz modificando el significado"],["🧩","Una partícula que se antepone a la raíz para negarla"],["🔠","Una letra mayúscula inicial"]], 0, "Pista: panad-ero, niñ-ito, flor-ería van al final."),
    q("¿Qué significado aporta el prefijo «des-» en palabras como «deshielo» o «desarmar»?", [["❄️","Acción contraria, privación o negación"],["➕","Aumento de tamaño"],["📍","Lugar geográfico lejano"]], 0, "Pista: deshielo es lo contrario de helar; desarmar es deshacer lo armado."),
    q("¿Qué significado aporta el prefijo «sub-» en palabras como «subterráneo» o «submarino»?", [["⬇️","Por debajo de o posición inferior"],["⬆️","Por encima"],["🔄","Repetición de una acción"]], 0, "Pista: bajo tierra o bajo el mar."),
    q("¿Qué significado aporta el prefijo «re-» en palabras como «reabrir» o «reorganizar»?", [["🔄","Repetición de la acción o intensidad"],["🚫","Negación absoluta del hecho"],["⬇️","Ubicación en el fondo"]], 0, "Pista: volver a abrir o volver a organizar."),
    q("¿Qué indican habitualmente los sufijos diminutivos «-ito / -ita» (ejemplo: arbolito, avecita)?", [["🌱","Tamaño pequeño o expresión de cariño y afecto"],["🐘","Tamaño gigantesco"],["🔨","Oficio o profesión"]], 0, "Pista: sufijo que indica disminución o matiz afectuoso."),
    q("¿Qué indican los sufijos aumentativos «-ón / -ona» o «-azo / -aza» (ejemplo: barcaza, casona)?", [["💥","Gran tamaño, intensidad o golpe"],["🌱","Tamaño diminuto"],["📍","Lugar de venta"]], 0, "Pista: aumentan el volumen o expresan fuerza."),
    q("¿Qué significado suele aportar el sufijo «-ero / -era» en palabras como «pesquero, panadero»?", [["👨‍🍳","Profesión, oficio o instrumento relacionado"],["🌱","Cualidad diminuta"],["🚫","Negación de la palabra base"]], 0, "Pista: terminación que designa una actividad laboral o técnica."),
    q("¿Qué significado aporta el sufijo «-ería» en palabras como «panadería, librería, heladería»?", [["🏪","Lugar o comercio donde se elabora o vende algo"],["👨‍🍳","La persona que atiende el local"],["🔨","Una herramienta específica"]], 0, "Pista: sufijo que indica establecimiento mercantil o taller."),
    q("¿Cuál de las siguientes palabras NO pertenece a la familia léxica de «pan»?", [["🌲","Pantano"],["🥖","Panadero"],["🥖","Panadería"]], 0, "Pista: término derivado de fango o ciénaga con raíz ajena."),
    q("¿Cuál de las siguientes palabras pertenece a la familia de «flor»?", [["💐","Florero"],["🌊","Flotador"],["🪈","Flauta"]], 0, "Pista: recipiente para colocar flores."),
    q("¿Qué palabra se forma agregando el prefijo «in-» al adjetivo «útil»?", [["🛠️","Inútil"],["🛠️","Desútil"],["🛠️","Reútil"]], 0, "Pista: que no sirve o no tiene utilidad."),
    q("¿Por qué el prefijo «in-» se convierte en «im-» antes de las letras b y p (ejemplo: imposible)?", [["📝","Por la regla ortográfica de escribir siempre M antes de P y B"],["🔠","Para que la palabra tenga más vocales"],["🎨","Para cambiar el acento de la palabra y respetar las normas vigentes de la ortografía"]], 0, "Pista: cambio fonético y ortográfico: im-posible, im-borrable."),
    q("¿Qué palabra se forma añadiendo el sufijo «-oso» al sustantivo «viento»?", [["💨","Ventoso"],["💨","Vientero"],["💨","Vientito"]], 0, "Pista: clima con viento frecuente."),
    q("¿Qué palabra se forma agregando el sufijo «-oso» al sustantivo «calor»?", [["☀️","Caluroso"],["☀️","Calorería"],["☀️","Calorcito"]], 0, "Pista: día de altas temperaturas."),
    q("¿Cuál es la palabra primitiva a partir de la cual deriva «campamento, campesino, acampar»?", [["🌾","Campo"],["🏕️","Carpa"],["🌲","Bosque"]], 0, "Pista: palabra base original sin afijos."),
    q("¿Qué sufijo se utiliza para transformar adjetivos en sustantivos abstractos (ejemplo: limpio -> limpieza)?", [["✨","-eza (limpieza, belleza, nobleza)"],["🔨","-ero"],["🌱","-ito"]], 0, "Pista: terminación en -eza con letra z."),
    q("¿Cómo ayuda el conocimiento de prefijos y sufijos a deducir el significado de palabras desconocidas?", [["💡","Permite descomponer la palabra y reconocer el sentido de sus partes"],["🎨","Sirve para ilustrar las portadas de los libros"],["⏰","Permite leer más rápido sin prestar atención"]], 0, "Pista: estrategia fundamental de comprensión lectora autónoma."),
  ],
  27: [
    q("¿Cómo se llama la sílaba que se pronuncia con mayor fuerza de voz en una palabra?", [["🔊","La sílaba tónica"],["🤫","La sílaba átona"],["🛑","La sílaba final"]], 0, "Pista: sobre ella recae el acento de la voz."),
    q("¿Cómo se llaman las sílabas que se pronuncian con menor intensidad en una palabra?", [["🤫","Las sílabas átonas"],["🔊","Las sílabas tónicas"],["🔠","Las sílabas mayúsculas"]], 0, "Pista: las partes de la palabra pronunciadas con menor energía sonora."),
    q("¿Qué es la tilde o acento ortográfico en español?", [["✍️","La rayita oblicua (´) que se escribe sobre la vocal acentuada"],["🛑","El punto final de la oración"],["〰️","La virgulilla de la letra eñe"]], 0, "Pista: marca gráfica del acento según las reglas ortográficas."),
    q("¿Dónde tienen la sílaba tónica las palabras agudas?", [["🏁","En la última sílaba"],["🥈","En la penúltima sílaba"],["🥉","En la antepenúltima sílaba"]], 0, "Pista: can-tó, com-pás, ca-mión."),
    q("¿Cuándo llevan tilde obligatoria las palabras agudas?", [["✍️","Cuando terminan en N, S o VOCAL"],["✍️","Cuando terminan en cualquier consonante salvo N o S"],["🔒","Llevan tilde siempre sin excepción"]], 0, "Pista: ca-ñón, com-pás, pa-pá; pero a-zul y pas-tor no llevan tilde."),
    q("¿Dónde tienen la sílaba tónica las palabras graves (o llanas)?", [["🥈","En la penúltima sílaba"],["🏁","En la última sílaba"],["🥉","En la antepenúltima sílaba"]], 0, "Pista: ár-bol, ca-sa, me-se-ta."),
    q("¿Cuándo llevan tilde las palabras graves?", [["✍️","Cuando NO terminan en N, S ni VOCAL"],["✍️","Cuando terminan en las letras N, S o vocal"],["🔒","Todas las palabras graves llevan tilde"]], 0, "Pista: regla inversa a las agudas: ár-bol, lá-piz llevan tilde; ca-sa no."),
    q("¿Dónde tienen la sílaba tónica las palabras esdrújulas?", [["🥉","En la antepenúltima sílaba"],["🥈","En la penúltima sílaba"],["🏁","En la última sílaba"]], 0, "Pista: pá-ja-ro, brú-ju-la, lí-mi-te."),
    q("¿Cuándo llevan tilde las palabras esdrújulas?", [["🔒","Llevan tilde SIEMPRE sin excepción"],["✍️","Solo si terminan en vocal"],["✍️","Solo si terminan en consonante"]], 0, "Pista: regla general para las palabras con acento en la antepenúltima."),
    q("Clasificá la palabra «glaciar» según la ubicación de su sílaba tónica:", [["🏁","Palabra aguda (sin tilde por terminar en R)"],["🥈","Palabra grave"],["🥉","Palabra esdrújula"]], 0, "Pista: gla-ciar suena fuerte en la última sílaba."),
    q("Clasificá la palabra «cóndor» según las reglas de acentuación:", [["🥈","Palabra grave (lleva tilde por terminar en R)"],["🏁","Palabra aguda"],["🥉","Palabra esdrújula"]], 0, "Pista: término acentuado en la penúltima sílaba terminado en r."),
    q("Clasificá la palabra «pájaros» según las reglas de acentuación:", [["🥉","Palabra esdrújula (lleva tilde siempre)"],["🥈","Palabra grave"],["🏁","Palabra aguda"]], 0, "Pista: pá-ja-ros suena en la antepenúltima sílaba."),
    q("Clasificá la palabra «meseta» según su acentuación:", [["🥈","Palabra grave (sin tilde por terminar en vocal)"],["🏁","Palabra aguda"],["🥉","Palabra esdrújula"]], 0, "Pista: acentuada en la penúltima sílaba y sin consonante final."),
    q("Clasificá la palabra «estación» según su acentuación:", [["🏁","Palabra aguda (lleva tilde por terminar en N)"],["🥈","Palabra grave"],["🥉","Palabra esdrújula"]], 0, "Pista: es-ta-ción suena fuerte al final y termina en n."),
    q("¿Por qué la palabra «árbol» lleva tilde ortográfica?", [["🌳","Porque es palabra grave y termina en consonante L"],["🌳","Porque es palabra aguda terminada en L"],["🌳","Porque todas las palabras cortas llevan tilde"]], 0, "Pista: acentuada en la penúltima sílaba y con cierre en letra distinta de n o s."),
    q("¿Por qué la palabra «mate» NO lleva tilde ortográfica?", [["🧉","Porque es palabra grave terminada en vocal"],["🧉","Porque es palabra aguda terminada en E"],["🧉","Porque es una palabra monosílaba"]], 0, "Pista: acentuada en la penúltima sílaba y finalizada en la letra e."),
    q("¿Cómo se llama la palabra cuya sílaba tónica es anterior a la antepenúltima (ejemplo: dígaselo)?", [["🚀","Palabra sobresdrújula"],["🥉","Palabra esdrújula"],["🥈","Palabra grave"]], 0, "Pista: también llevan tilde siempre."),
    q("Separar correctamente en sílabas la palabra «cordillera»:", [["✂️","cor-di-lle-ra"],["✂️","cord-i-lle-ra"],["✂️","cor-di-ll-e-ra"]], 0, "Pista: cuatro sílabas con el dígrafo ll junto en la misma sílaba."),
    q("Marcá la palabra que presenta un error de acentuación:", [["📝","cancíon"],["📝","camión"],["📝","corazón"]], 0, "Pista: en los diptongos con tilde, la pronunciación recae en la vocal abierta."),
    q("Marcá la palabra esdrújula que completa la frase: «En la excursión usamos una _____ para orientarnos».", [["🧭","brújula"],["🧭","brujula"],["🧭","brújulas"]], 0, "Pista: brú-ju-la lleva tilde en la antepenúltima sílaba."),
  ],
  28: [
    q("¿Qué regla ortográfica de la letra B se aplica en palabras como «cambio, tambor, sombra»?", [["📝","Se escribe siempre M antes de la letra B (mb)"],["📝","Se escribe siempre la letra N antes de la B"],["📝","Se escribe siempre V corta en todas"]], 0, "Pista: regla fija: mb (tambor, alfombra)."),
    q("¿Qué regla ortográfica de la letra V se aplica en palabras como «invierno, enviar, tranvía»?", [["📝","Se escribe siempre N antes de la letra V (nv)"],["📝","Se escribe siempre la letra M antes de la V"],["📝","Se escribe siempre B larga"]], 0, "Pista: regla fija: nv (invierno, convento)."),
    q("¿Cómo se escribe el homófono que significa 'del verbo hacer'?", [["🔨","Hecho (con letra H inicial)"],["🗑️","Echo (del verbo echar o tirar)"],["📦","Eco (del sonido que rebota)"]], 0, "Pista: «El trabajo de ciencias está bien hecho»."),
    q("¿Cómo se escribe la forma correcta en la oración: «Esperá a que el agua _____ para preparar el mate»?", [["💧","hierva (del verbo hervir con V)"],["🌿","hierba (planta silvestre con B)"],["🍵","yerba (producto secado con Y)"]], 0, "Pista: se escribe con h inicial y v corta para distinguirse de la planta con b."),
    q("¿Cuál es el plural correcto de la palabra «pez»?", [["🐟","peces (la Z cambia a C ante la E)"],["🐟","pezes con letra zeta"],["🐟","pezs con letra ese final"]], 0, "Pista: las palabras en -z forman el plural en -ces (luz -> luces)."),
    q("¿Qué terminación llevan los adjetivos que indican abundancia como «caluroso, lluviosa, ventoso»?", [["💨","Se escriben con S (-oso / -osa)"],["💨","Se escriben con Z (-ozo / -oza)"],["💨","Se escriben con C (-oco / -oca)"]], 0, "Pista: bondadoso, graciosa, espinoso van con s."),
    q("¿Qué letra se utiliza en palabras que terminan en «-aje» o «-jería» (como paisaje, relojería)?", [["🏞️","Se escriben siempre con J"],["🏞️","Se escriben siempre con G"],["🏞️","Se escriben con H"]], 0, "Pista: paisaje, viaje, cerrajería llevan J."),
    q("¿Con qué letra se escriben las palabras que comienzan con «geo-» (tierra) o terminan en «-ología»?", [["🌍","Se escriben con letra G (geología, geografía)"],["🌍","Se escriben con letra J"],["🌍","Se escriben con letra H"]], 0, "Pista: ciencias de la Tierra y la naturaleza con raíz griega."),
    q("¿Qué letra llevan las palabras que empiezan con los diptongos «hie-» y «hue-» (hielo, hueso, huella)?", [["🧊","Llevan letra H inicial"],["🧊","Se escriben sin letra H"],["🧊","Llevan letra G inicial"]], 0, "Pista: hielo, huevo, huemul comienzan con h."),
    q("¿Cuál es la regla de escritura para los diminutivos terminados en «-illo / -illa» (ejemplo: zapatilla)?", [["👟","Se escriben siempre con doble L (ll)"],["👟","Se escriben con la letra Y"],["👟","Se escriben con una sola L"]], 0, "Pista: chiquillo, barquilla, cuchillo con ll."),
    q("¿Cómo se escribe el plural de las palabras que terminan en letra «y» (ejemplo: buey, rey)?", [["🐂","Se agrega -es conservando la Y (bueyes, reyes)"],["🐂","Se cambia la Y por letra I latina"],["🐂","Se agrega solo una letra S final"]], 0, "Pista: palabras terminadas en vocal con sonido consonántico final."),
    q("¿Cómo se escribe el aumentativo o golpe terminado en «-azo / -aza» (ejemplo: portazo, golazo)?", [["🚪","Se escribe siempre con letra Z"],["🚪","Se escribe siempre con letra S"],["🚪","Se escribe siempre con letra C"]], 0, "Pista: manotazo, portazo, botellazo llevan z."),
    q("¿Qué signo se coloca al inicio de cada intervención de un personaje en un diálogo?", [["—","La raya de diálogo larga (—)"],["-","Un guion corto de separación (-)"],["...","Puntos suspensivos triples"]], 0, "Pista: signo horizontal extenso que abre cada intervención."),
    q("¿Qué signos se utilizan obligatoriamente para formular preguntas directas en español?", [["❓","Signos dobles de interrogación (¿?)"],["❓","Solo un signo al final como en inglés (?)"],["💬","Comillas dobles de citación («»)"]], 0, "Pista: en español siempre se coloca signo de apertura y de cierre."),
    q("¿Qué signos se usan para expresar sorpresa, admiración, gritos o alegría?", [["¡!","Signos dobles de exclamación (¡!)"],["¿?","Signos dobles de interrogación (¿?)"],["--","Rayas dobles de diálogo"]], 0, "Pista: ¡Qué hermoso glaciar! Lleva apertura y cierre."),
    q("¿Se coloca punto final inmediatamente después de cerrar con signo de interrogación (?) o exclamación (!)?", [["🛑","No: el punto del propio signo cumple la función de punto final"],["📌","Sí: es obligatorio agregar otro punto más al final"],["〰️","Debe agregarse una coma obligatoria"]], 0, "Pista: el puntito inferior de la grafía ya cierra la frase."),
    q("Llevan tilde las palabras qué, cómo, cuándo, dónde y por qué al formular preguntas directas:", [["✍️","Sí: llevan tilde enfática o diacrítica"],["✍️","No: nunca llevan tilde ortográfica"],["🔒","Solo si van al final del renglón"]], 0, "Pista: ¿Dónde queda el glaciar? ¿Cuándo viajamos?"),
    q("¿Cómo se escribe la forma del verbo 'caer' en pretérito: «La rama se _____ con el viento»?", [["🍂","cayó (con letra Y)"],["🍂","calló (del verbo callar)"],["🍂","cayo (sustantivo de islote)"]], 0, "Pista: del verbo caer: cayó con y."),
    q("¿Qué verbos terminados en «-bir» son excepciones y se escriben con V corta?", [["🫕","Hervir, servir y vivir"],["✍️","Escribir y recibir"],["🚫","Prohibir y subir"]], 0, "Pista: los tres verbos en -vir con v."),
    q("Marcá la oración redactada con correcta ortografía en todas sus grafías:", [["📝","En invierno, el viento helado soplaba sobre la meseta."],["📝","En imbierno, el biento helado soplava sobre la meseta."],["📝","En invierno, el viento elado soplaba sobre la mezeta."]], 0, "Pista: revisá las combinaciones nv, letras v/b y la presencia de h."),
  ],
};

// Banco de 4 pares Verdadero/Falso creíbles por mundo (112 pares en total)
export const TF_PAIRS_LENGUA: Record<number, Array<{ v: string; f: string; hint: string }>> = {
  1: [
    {
      v: "Las preguntas básicas de la noticia son qué ocurrió, a quién le sucedió, cuándo, dónde y por qué.",
      f: "Las noticias periodísticas se redactan en estrofas poéticas con rima para hacer reír a los lectores.",
      hint: "Pista: la información periodística objetiva responde a los interrogantes fundamentales de un hecho.",
    },
    {
      v: "El titular de una noticia resume el acontecimiento principal con tipografía destacada.",
      f: "El titular debe ocultar la información central para que los lectores tengan que adivinarla.",
      hint: "Pista: el título sintetiza de forma atractiva y clara el acontecimiento informado.",
    },
    {
      v: "El epígrafe es el texto breve explicativo ubicado debajo de una fotografía o ilustración.",
      f: "El epígrafe es la firma que el director del periódico coloca al final de la última página.",
      hint: "Pista: texto breve situado directamente bajo la imagen para aclarar su contenido.",
    },
    {
      v: "El copete o bajada se encuentra debajo del titular y amplía los datos más sobresalientes del hecho.",
      f: "El copete es un índice que enumera los precios de los productos vendidos en los comercios.",
      hint: "Pista: párrafo breve ubicado entre el título y el cuerpo que sintetiza lo más relevante.",
    },
  ],
  2: [
    {
      v: "En la lectura de una noticia periodística, el titular anticipa el hecho central que se desarrollará en el cuerpo.",
      f: "En una noticia periodística, el titular debe mantenerse en secreto para sorprender al lector al final.",
      hint: "Pista: el titular destaca y sintetiza lo más importante del texto.",
    },
    {
      v: "Las declaraciones testimoniales se colocan habitualmente entre comillas para señalar palabras textuales.",
      f: "Las comillas se utilizan en una noticia para indicar que las declaraciones fueron inventadas por el redactor.",
      hint: "Pista: signo ortográfico doble que reproduce con fidelidad los testimonios de los protagonistas.",
    },
    {
      v: "La fecha y la localidad consignadas en el encabezado indican cuándo y dónde se produjo la novedad.",
      f: "La fecha y la localidad se omiten siempre porque carecen de interés para los lectores.",
      hint: "Pista: datos paratextuales indispensables para situar al hecho en el tiempo y el espacio.",
    },
    {
      v: "El cuerpo de la noticia profundiza los detalles del acontecimiento con testimonios, causas y consecuencias.",
      f: "El cuerpo de la noticia contiene únicamente adivinanzas y acertijos para entretener a la familia.",
      hint: "Pista: es la parte central y más extensa del texto informativo periodístico.",
    },
  ],
  3: [
    {
      v: "El propósito principal del texto expositivo es brindar información clara y objetiva sobre un tema de estudio.",
      f: "El texto expositivo tiene como meta inventar anécdotas mágicas para emocionar a los lectores.",
      hint: "Pista: texto de divulgación o estudio escolar que busca explicar conceptos de la realidad.",
    },
    {
      v: "Los textos expositivos suelen estructurarse en introducción temática, desarrollo explicativo y conclusión.",
      f: "Los textos expositivos se organizan en actos teatrales separados por la apertura y caída de un telón.",
      hint: "Pista: estructura formal clásica de los artículos de enciclopedias y manuales de ciencias.",
    },
    {
      v: "Los subtítulos ayudan a organizar la lectura dividiendo el tema general en subtemas específicos.",
      f: "Los subtítulos son firmas personales que los alumnos deben estampar al margen de la hoja.",
      hint: "Pista: paratextos breves en negrita que anticipan el contenido de cada sección.",
    },
    {
      v: "La definición y la ejemplificación son recursos frecuentes para hacer comprensibles los conceptos difíciles.",
      f: "En un texto expositivo está prohibido incluir ejemplos concretos o definiciones explicativas.",
      hint: "Pista: estrategias didácticas para clarificar ideas científicas complejas.",
    },
  ],
  4: [
    {
      v: "El macá tobiano es un ave acuática autóctona emblemática que anida en lagunas de altura de las mesetas santacruceñas.",
      f: "El macá tobiano es un pez marino carnívoro que habita exclusivamente en arrecifes de coral tropicales.",
      hint: "Pista: especie protegida exclusiva de los lagos de meseta de la Patagonia austral.",
    },
    {
      v: "La lenga y el ñire son árboles nativos del bosque andino patagónico que pierden su follaje en otoño.",
      f: "La lenga y el ñire son palmeras tropicales que necesitan temperaturas muy elevadas durante todo el año.",
      hint: "Pista: especies arbóreas de hoja caduca adaptadas a los rigores de la cordillera austral.",
    },
    {
      v: "Las toninas overas son cetáceos pequeños y veloces de color blanco y negro que habitan en la costa patagónica.",
      f: "Las toninas overas son reptiles terrestres acorazados que cavan cuevas profundas en los médanos secos.",
      hint: "Pista: mamíferos marinos emparentados con los delfines que frecuentan rías y golfos australes.",
    },
    {
      v: "Los bosques petrificados preservan troncos fósiles de araucarias que vivieron hace 150 millones de años.",
      f: "Los bosques petrificados son plantaciones modernas de árboles plásticos instaladas para los turistas.",
      hint: "Pista: monumentos naturales que atesoran restos vegetales fósiles del período jurásico.",
    },
  ],
  5: [
    {
      v: "La biografía relata la trayectoria real de una persona destacada desde sus orígenes hasta su madurez o legado.",
      f: "La biografía es una narración inventada sobre criaturas legendarias que nunca existieron en la realidad.",
      hint: "Pista: relato verídico fundamentado en documentos, testimonios y fechas comprobables.",
    },
    {
      v: "La biografía se redacta habitualmente en tercera persona gramatical (él o ella).",
      f: "La biografía se redacta siempre en primera persona del plural (nosotros) por imposición editorial.",
      hint: "Pista: el autor o biógrafo escribe sobre los hechos y vivencias de otra persona.",
    },
    {
      v: "El orden cronológico organiza los sucesos de la vida de un personaje desde el pasado hacia momentos posteriores.",
      f: "En una biografía los sucesos deben mezclarse al azar sin respetar ninguna línea temporal.",
      hint: "Pista: sucesión natural que sigue las etapas de nacimiento, juventud, adultez y legado.",
    },
    {
      v: "Las fuentes biográficas incluyen cartas, actas, fotografías, diarios íntimos y testimonios de la época.",
      f: "El biógrafo tiene prohibido consultar documentos históricos o testimonios verídicos.",
      hint: "Pista: testimonios materiales que respaldan la fidelidad histórica de lo relatado.",
    },
  ],
  6: [
    {
      v: "El perito Francisco Moreno donó tierras en la cordillera que dieron origen al primer parque nacional argentino.",
      f: "El perito Francisco Moreno se dedicó exclusivamente a la cría de ganado ovino en las costas bonaerenses.",
      hint: "Pista: naturalista y explorador patagónico que impulsó la creación del actual Parque Nacional Nahuel Huapi.",
    },
    {
      v: "El comandante Luis Piedra Buena navegó los mares australes rescatando tripulaciones de marineros náufragos.",
      f: "El comandante Luis Piedra Buena fue un pirata extranjero que saqueaba puertos en las costas patagónicas.",
      hint: "Pista: marino patriota que defendió la soberanía argentina en la isla Pavón y el sur continental.",
    },
    {
      v: "El cacique Casimiro Biguá juró lealtad a la bandera argentina en las orillas del río Santa Cruz en 1869.",
      f: "El cacique Casimiro Biguá combatió a las autoridades argentinas y prohibió el izamiento del pabellón.",
      hint: "Pista: líder tehuelche que selló un histórico pacto de reconocimiento de soberanía territorial.",
    },
    {
      v: "Carlos Moyano exploró los ríos y mesetas de Santa Cruz y descubrió los yacimientos carboníferos de Río Turbio.",
      f: "Carlos Moyano fue un aviador del siglo XXI que construyó el aeropuerto internacional de Río Gallegos.",
      hint: "Pista: primer gobernador del Territorio Nacional de Santa Cruz y explorador del interior provincial.",
    },
  ],
  7: [
    {
      v: "Los textos instructivos presentan una serie ordenada de pasos para guiar la realización de una tarea concreta.",
      f: "Los textos instructivos relatan fábulas poéticas donde los animales reflexionan sobre sus errores morales.",
      hint: "Pista: recetas, manuales de armado y reglamentos de juegos que explican cómo proceder.",
    },
    {
      v: "En los instructivos es común utilizar verbos en infinitivo (mezclar, cortar) o en modo imperativo (mezclá, cortá).",
      f: "En los textos instructivos solo se admiten verbos conjugados en pretérito perfecto del pasado histórico.",
      hint: "Pista: formas verbales que indican directivas, instrucciones o procedimientos prácticos.",
    },
    {
      v: "La numeración de los pasos es fundamental para que el lector ejecute las acciones en la secuencia debida.",
      f: "En un instructivo los pasos deben leerse al azar sin importar el orden en que se cumplan las acciones.",
      hint: "Pista: correlación ordenada indispensable para que el resultado del procedimiento resulte exitoso.",
    },
    {
      v: "Las listas de materiales o ingredientes anteceden a las instrucciones para verificar que se cuente con todo lo necesario.",
      f: "Los materiales requeridos deben ocultarse al usuario hasta que termine de armar el proyecto.",
      hint: "Pista: apartado previo que enumera los insumos requeridos antes de iniciar la preparación.",
    },
  ],
  8: [
    {
      v: "Una carta tradicional se estructura en encabezado con lugar y fecha, saludo, cuerpo, despedida y firma.",
      f: "Una carta formal carece de firma y saludo porque solo debe contener números matemáticos.",
      hint: "Pista: partes formales de la correspondencia epistolar para identificar emisor, receptor y mensaje.",
    },
    {
      v: "La posdata (P.D.) se agrega al pie de la carta para incluir un mensaje breve olvidado antes de firmar.",
      f: "La posdata es el sello postal oficial que se adhiere en el ángulo superior del sobre.",
      hint: "Pista: anotación final añadida tras la rúbrica para sumar algún dato de último momento.",
    },
    {
      v: "El correo electrónico permite enviar mensajes y adjuntar archivos digitales de manera casi instantánea.",
      f: "El correo electrónico exige depositar un sobre cerrado de papel en el buzón de la sucursal postal.",
      hint: "Pista: canal virtual de comunicación personal, escolar y laboral en la era informática.",
    },
    {
      v: "Al escribir a una autoridad escolar se emplean fórmulas de cortesía formal como «De mi mayor consideración».",
      f: "Al dirigirse al director de la escuela se aconseja iniciar el texto con expresiones informales como «Hola che».",
      hint: "Pista: registro formal adecuado para comunicarse con respeto frente a directivos escolares.",
    },
  ],
  9: [
    {
      v: "La personificación es el recurso literario que permite a los animales de las fábulas hablar y razonar como personas.",
      f: "La personificación es una norma ortográfica que prohíbe el uso de puntos suspensivos en los cuentos.",
      hint: "Pista: recurso estilístico mediante el cual seres de la naturaleza adquieren virtudes y defectos humanos.",
    },
    {
      v: "La moraleja es una enseñanza moral o reflexión sobre las consecuencias de las acciones de los personajes.",
      f: "La moraleja es una fórmula química de laboratorio que figura al pie de los manuales de botánica.",
      hint: "Pista: mensaje final característico que invita a reflexionar sobre la conducta cotidiana.",
    },
    {
      v: "Las fábulas son relatos breves cuyos protagonistas suelen encarnar virtudes o defectos como la astucia o la vanidad.",
      f: "Las fábulas son enciclopedias extensas de más de mil páginas dedicadas al cálculo astronómico.",
      hint: "Pista: composiciones breves de la narrativa tradicional donde intervienen animales con rasgos humanos.",
    },
    {
      v: "En la fábula de «La liebre y la tortuga», la perseverancia y la constancia vencen a la presunción y el descuido.",
      f: "En la fábula de «La liebre y la tortuga», la moraleja enseña que burlarse de los compañeros asegura el éxito.",
      hint: "Pista: enseñanza ética que valora el esfuerzo sostenido por sobre la soberbia y la pereza.",
    },
  ],
  10: [
    {
      v: "En la poesía, la rima consonante ocurre cuando coinciden vocales y consonantes a partir de la última vocal acentuada.",
      f: "La rima consonante se produce cuando dos palabras terminan en letras totalmente distintas sin ningún sonido afín.",
      hint: "Pista: igualdad total de sonidos finales: sendero / florero, glaciar / cantar.",
    },
    {
      v: "En la rima asonante solo coinciden los sonidos vocálicos finales a partir de la vocal tónica.",
      f: "En la rima asonante es obligatorio que coincidan todas las consonantes y vocales de la palabra.",
      hint: "Pista: repetición de timbres vocálicos: cordillera / tierra (e-a), viento / cielo (e-o).",
    },
    {
      v: "Una estrofa es un conjunto de versos agrupados en el poema y separados de otras por un espacio en blanco.",
      f: "Una estrofa es un signo de exclamación doble que se coloca antes de cada sustantivo propio.",
      hint: "Pista: bloque métrico que organiza el desarrollo rítmico y temático del texto poético.",
    },
    {
      v: "Las imágenes sensoriales en un poema evocan sensaciones perceptibles a través de la vista, el oído, el tacto o el olfato.",
      f: "Las imágenes sensoriales son operaciones matemáticas aplicadas a la métrica de los párrafos.",
      hint: "Pista: recursos poéticos que apelan a los sentidos: «el crujido del hielo», «cumbres blancas».",
    },
  ],
  11: [
    {
      v: "En el texto teatral, el diálogo entre los personajes es la forma principal a través de la cual avanza la acción dramática.",
      f: "En el texto teatral está prohibido el diálogo y un relator invisible debe leer en silencio todo el guion.",
      hint: "Pista: intercambio de parlamentos mediante el cual los personajes interactúan en el escenario.",
    },
    {
      v: "Las acotaciones se escriben entre paréntesis para brindar indicaciones de gestos, movimientos y tono de voz.",
      f: "Las acotaciones son canciones que los espectadores deben entonar a coro durante la función.",
      hint: "Pista: notas orientadoras para el director y los actores que no se pronuncian ante el público.",
    },
    {
      v: "Los actos señalan las divisiones mayores de una obra teatral y suelen marcarse con la caída o cierre de telón.",
      f: "Los actos son los aplausos que los actores se brindan entre sí al finalizar cada ensayo general.",
      hint: "Pista: partes estructurales mayores que organizan el desarrollo del argumento dramático.",
    },
    {
      v: "La puesta en escena comprende la escenografía, la iluminación, el vestuario, el sonido y la actuación en vivo.",
      f: "La puesta en escena consiste en imprimir el libreto en hojas de papel sin representación física.",
      hint: "Pista: conjunto de elementos visuales y auditivos que materializan la obra teatral ante los espectadores.",
    },
  ],
  12: [
    {
      v: "El eslogan es una frase breve, ingeniosa y fácil de recordar que resume el mensaje principal de una campaña publicitaria.",
      f: "El eslogan es un texto de diez páginas en letra minúscula que detalla normas fiscales de comercio.",
      hint: "Pista: lema conciso que busca quedar grabado en la memoria del receptor: «Cuidar el agua es cuidar la vida».",
    },
    {
      v: "La propaganda social busca concienciar a la comunidad sobre conductas saludables, solidarias o ecológicas.",
      f: "La propaganda social tiene como único fin recaudar dinero vendiendo golosinas en la vía pública.",
      hint: "Pista: campañas de bien público orientadas a la prevención, la seguridad vial o el medio ambiente.",
    },
    {
      v: "En un afiche, las imágenes de gran tamaño y los colores contrastantes se emplean para atraer de inmediato la atención.",
      f: "En un afiche se recomienda omitir las imágenes y utilizar tipografías diminutas difíciles de visualizar.",
      hint: "Pista: recursos visuales estratégicos para que el mensaje resulte impactante a la distancia.",
    },
    {
      v: "El afiche comercial persigue como meta convencer al público de adquirir un producto o contratar un servicio.",
      f: "El afiche comercial busca persuadir a la población para que no compre ningún producto en los comercios.",
      hint: "Pista: comunicación gráfica diseñada para estimular el consumo de bienes mercantiles.",
    },
  ],
  13: [
    {
      v: "Un párrafo se inicia con un espacio en blanco llamado sangría y con la primera palabra en letra mayúscula.",
      f: "Un párrafo debe comenzar siempre con un número fraccionario y terminar con una coma voladora.",
      hint: "Pista: convenciones formales indispensables de presentación de todo bloque de texto en prosa.",
    },
    {
      v: "El punto y seguido separa oraciones dentro de un mismo párrafo que desarrollan aspectos de la misma idea central.",
      f: "El punto y seguido se coloca únicamente cuando la redacción de todo el libro ha concluido.",
      hint: "Pista: signo de puntuación que delimita enunciados relacionados temáticamente sin romper el párrafo.",
    },
    {
      v: "El punto y aparte señala el cierre de un párrafo para dar comienzo a uno nuevo enfocado en otro subtema.",
      f: "El punto y aparte exige continuar escribiendo en el mismo renglón sin dejar espacio de margen.",
      hint: "Pista: signo ortográfico que concluye un bloque temático e indica pasar al siguiente renglón con sangría.",
    },
    {
      v: "La oración bimembre está compuesta por dos miembros fundamentales: el sujeto y el predicado.",
      f: "La oración bimembre está conformada por una sola palabra aislada sin verbo ni entonación.",
      hint: "Pista: estructura sintáctica articulada que admite separación entre quién hace y qué se dice.",
    },
  ],
  14: [
    {
      v: "Los conectores temporales (primero, luego, más tarde, finalmente) ordenan cronológicamente los acontecimientos relatados.",
      f: "Los conectores temporales se utilizan para sumar sumandos y calcular multiplicaciones escolares.",
      hint: "Pista: expresiones de enlace que sitúan los hechos en una línea de tiempo sucesiva.",
    },
    {
      v: "Los conectores causales (porque, ya que, debido a que) introducen la razón o motivo que originó un hecho.",
      f: "Los conectores causales sirven para negar rotundamente todas las palabras que figuran en la oración.",
      hint: "Pista: partículas que explicitan la causa desencadenante de una acción o fenómeno.",
    },
    {
      v: "Los conectores de oposición (pero, sin embargo, aunque) introducen un contraste o reparo frente a una idea previa.",
      f: "Los conectores de oposición se emplean para repetir idénticamente lo que se acaba de decir sin cambios.",
      hint: "Pista: enlaces que expresan restricción, objeción o diferencia entre dos enunciados.",
    },
    {
      v: "El uso variado de conectores enriquece la redacción y evita la reiteración monótona de la conjunción «y».",
      f: "Al escribir se recomienda repetir la palabra «y» al comienzo de todos los renglones del texto.",
      hint: "Pista: recurso de estilo que otorga fluidez, claridad y cohesión lógica al relato.",
    },
  ],
  15: [
    {
      v: "En la oración bimembre, el sujeto es la persona, animal o cosa de la cual se afirma algo y que concuerda con el verbo.",
      f: "El sujeto es un signo de puntuación que prohíbe la presencia de sustantivos comunes en la frase.",
      hint: "Pista: componente sintáctico que ejecuta o experimenta la acción del núcleo verbal.",
    },
    {
      v: "El sujeto expreso compuesto (SEC) posee dos o más núcleos coordinados (ejemplo: «El viento y la nieve cubrían la meseta»).",
      f: "El sujeto compuesto es aquel que carece por completo de núcleos sustantivos en su redacción.",
      hint: "Pista: construcción del sujeto que reúne más de un sustantivo o pronombre principal.",
    },
    {
      v: "El sujeto tácito no aparece escrito en la oración pero se reconoce por la persona y número de la terminación verbal.",
      f: "El sujeto tácito es un error de ortografía que invalida cualquier oración en lengua castellana.",
      hint: "Pista: sujeto omitido que se sobreentiende con claridad a través de la desinencia del verbo.",
    },
    {
      v: "El modificador directo (MD) acompaña directamente al núcleo del sujeto y suele ser un artículo o un adjetivo calificativo.",
      f: "El modificador directo es una preposición que siempre se escribe al final del predicado.",
      hint: "Pista: palabras como «el», «la», «pequeño», «veloz» que concuerdan directamente con el sustantivo núcleo.",
    },
  ],
  16: [
    {
      v: "El núcleo del predicado verbal es siempre un verbo conjugado que concuerda en persona y número con el sujeto.",
      f: "El núcleo del predicado verbal debe ser obligatoriamente un sustantivo propio con mayúscula.",
      hint: "Pista: la palabra que expresa la acción, proceso o estado principal afirmado sobre el sujeto.",
    },
    {
      v: "Un predicado verbal simple (PVS) contiene un único núcleo verbal conjugado para su respectivo sujeto.",
      f: "El predicado verbal simple es aquel que carece de verbos y se compone únicamente de interjecciones.",
      hint: "Pista: estructura predicativa elemental: «Los guanacos pastaban tranquilamente en el cañadón».",
    },
    {
      v: "Un predicado verbal compuesto (PVC) reúne dos o más núcleos verbales coordinados para el mismo sujeto.",
      f: "El predicado verbal compuesto exige que cada verbo tenga un sujeto de distinto tiempo histórico.",
      hint: "Pista: dos o más acciones compartidas por el mismo sujeto: «El explorador encendió el fuego y calentó agua».",
    },
    {
      v: "Los circunstanciales del predicado brindan información complementaria sobre el lugar, el tiempo o el modo de la acción.",
      f: "Los circunstanciales son signos de admiración que se colocan entre los verbos para aumentar el volumen.",
      hint: "Pista: modificadores que responden a ¿dónde?, ¿cuándo? o ¿cómo? ocurrió lo relatado.",
    },
  ],
  17: [
    {
      v: "Los sustantivos comunes nombran a seres, objetos o lugares de forma general (ejemplo: río, ciudad, explorador).",
      f: "Los sustantivos comunes se escriben obligatoriamente con mayúscula inicial en cualquier posición del texto.",
      hint: "Pista: designan clases generales de elementos y se escriben con letra minúscula salvo al inicio.",
    },
    {
      v: "Los sustantivos propios individualizan a personas, lugares o instituciones y se escriben con mayúscula inicial.",
      f: "Los sustantivos propios son palabras que cambian de significado cada vez que se las pronuncia en voz alta.",
      hint: "Pista: nombres específicos como Santa Cruz, Moreno, Fitz Roy que distinguen a seres o sitios únicos.",
    },
    {
      v: "Un sustantivo colectivo nombra en singular a un conjunto integrado por elementos de la misma especie (ejemplo: cardumen, jauría).",
      f: "Un sustantivo colectivo designa únicamente a un individuo aislado y nunca a una agrupación.",
      hint: "Pista: vocablos como rebaño, tropilla o arboleda que expresan pluralidad de seres en forma gramatical singular.",
    },
    {
      v: "Los sustantivos abstractos designan cualidades, sentimientos o ideas que no se perciben por los sentidos físicos (ejemplo: justicia, alegría).",
      f: "Los sustantivos abstractos son objetos pesados que se pueden tocar, medir y guardar en una mochila escolar.",
      hint: "Pista: conceptos y vivencias interiores como la paz, el valor, la libertad o el compañerismo.",
    },
  ],
  18: [
    {
      v: "Los adjetivos calificativos atribuyen cualidades, rasgos o propiedades específicas al sustantivo que acompañan.",
      f: "Los adjetivos calificativos son palabras invariables que nunca modifican el sentido del sustantivo.",
      hint: "Pista: términos que describen características: «viento gélido», «laguna cristalina», «pastos secos».",
    },
    {
      v: "Los adjetivos gentilicios indican el lugar geográfico de origen o procedencia de personas, animales o productos.",
      f: "Los adjetivos gentilicios se utilizan exclusivamente para numerar las páginas de los libros escolares.",
      hint: "Pista: expresiones de procedencia territorial como santacruceño, argentino, patagónico o fueguino.",
    },
    {
      v: "En español, los adjetivos gentilicios se escriben habitualmente con letra minúscula inicial.",
      f: "Los adjetivos gentilicios deben escribirse siempre con mayúscula inicial como si fueran sustantivos propios.",
      hint: "Pista: a diferencia de otros idiomas, en castellano decimos «el gaucho argentino» con minúscula.",
    },
    {
      v: "Los adjetivos numerales cardinales indican cantidades exactas (tres, cien, mil) y los ordinales señalan orden de posición (tercero, décimo).",
      f: "Los adjetivos numerales ordinales se usan para medir la temperatura corporal de los mamíferos marinos.",
      hint: "Pista: distinción entre contar unidades numéricas y establecer jerarquías o turnos en una sucesión.",
    },
  ],
  19: [
    {
      v: "El sustantivo y el adjetivo deben coincidir obligatoriamente en género (masculino/femenino) y número (singular/plural).",
      f: "La regla gramatical permite combinar libremente un sustantivo femenino con un adjetivo masculino sin concordancia.",
      hint: "Pista: principio fundamental de armonía morfológica: «cordillera nevada» / «cerros nevados».",
    },
    {
      v: "Si un adjetivo califica a varios sustantivos de distinto género coordinados, concuerda en masculino plural.",
      f: "Si se unen sustantivos de distinto género, el adjetivo debe quedar en singular y en género femenino neutro.",
      hint: "Pista: regla de coordinación tradicional: «el lago y la ría profundos» conciertan en masculino plural.",
    },
    {
      v: "Los adjetivos de una sola terminación (como veloz, ágil, grande) no varían su forma según el género del sustantivo.",
      f: "Los adjetivos como veloz deben transformarse en «veloza» cuando acompañan a un sustantivo femenino.",
      hint: "Pista: adjetivos invariables respecto del género: «puma veloz» / «liebre veloz» conservan la misma forma.",
    },
    {
      v: "Para formar el plural de los sustantivos y adjetivos terminados en vocal se agrega la letra -s, y si terminan en consonante, -es.",
      f: "Para formar el plural de las palabras terminadas en consonante se debe suprimir la última letra del vocablo.",
      hint: "Pista: regla regular de formación del plural: casa -> casas; glaciar -> glaciares.",
    },
  ],
  20: [
    {
      v: "Los verbos expresan acciones, estados o procesos y varían según la persona gramatical y el número.",
      f: "Los verbos son partículas fijas que carecen de desinencias y nunca modifican su terminación en la oración.",
      hint: "Pista: clase de palabra que conjuga sus formas para concordar con el sujeto que realiza la acción.",
    },
    {
      v: "Las personas del singular son 1.ª yo, 2.ª vos (o tú/usted) y 3.ª él/ella.",
      f: "Las personas del singular corresponden a nosotros, ustedes y ellos.",
      hint: "Pista: pronombres personales que refieren a una sola persona: quien habla, quien escucha o de quien se habla.",
    },
    {
      v: "Las personas del plural son 1.ª nosotros/as, 2.ª ustedes/vosotros y 3.ª ellos/as.",
      f: "El plural gramatical se compone únicamente de pronombres personales mudos sin verbo asignado.",
      hint: "Pista: formas pronominales colectivas que designan a más de un individuo involucrado en el enunciado.",
    },
    {
      v: "En la variedad del español rioplatense utilizada en Argentina se emplea cotidianamente el voseo (vos caminás, vos sabés).",
      f: "En Argentina está formalmente prohibido conjugar los verbos con el pronombre vos en las conversaciones.",
      hint: "Pista: rasgo lingüístico de nuestra comunidad de hablantes con acentuación tónica característica en la última sílaba.",
    },
  ],
  21: [
    {
      v: "El tiempo presente indica que la acción verbal se está desarrollando en el momento mismo en que se enuncia.",
      f: "El tiempo presente se emplea para narrar exclusivamente sucesos ocurridos hace millones de años.",
      hint: "Pista: tiempo que coincide con el instante actual: «Los alumnos observan con atención las pinturas rupestres».",
    },
    {
      v: "El tiempo pretérito o pasado señala que los hechos relatados ya concluyeron antes del momento de hablar.",
      f: "El tiempo pretérito indica que la acción tendrá lugar mañana si las condiciones climáticas son favorables.",
      hint: "Pista: tiempo verbal característico de las crónicas históricas, leyendas y narraciones de sucesos pasados.",
    },
    {
      v: "El tiempo futuro señala que los acontecimientos ocurrirán en una instancia posterior al momento presente.",
      f: "El tiempo futuro expresa que los hechos ya terminaron definitivamente y forman parte del pasado.",
      hint: "Pista: formas verbales como «viajaremos», «aprenderán» que expresan acciones previstas hacia adelante.",
    },
    {
      v: "Los adverbios temporales (ayer, hoy, mañana) acompañan a los verbos para precisar el marco temporal del enunciado.",
      f: "Los adverbios temporales son signos ortográficos que sustituyen las comillas dobles en los títulos.",
      hint: "Pista: palabras invariables que refuerzan la referencia cronológica de la acción expresada.",
    },
  ],
  22: [
    {
      v: "El pretérito perfecto simple relata acciones puntuales y concluidas en el pasado (ejemplo: «El barco zarpó a la madrugada»).",
      f: "El pretérito perfecto simple se usa para describir rutinas eternas que nunca comenzaron ni concluyeron.",
      hint: "Pista: tiempo del pasado que hace avanzar el relato con hitos precisos: zarpó, llegó, descubrió.",
    },
    {
      v: "El pretérito imperfecto pinta el marco de fondo, las costumbres reiteradas o las descripciones del pasado (ejemplo: «Hacía frío y el viento soplaba»).",
      f: "El pretérito imperfecto se utiliza exclusivamente para relatar noticias deportivas de último minuto.",
      hint: "Pista: tiempo descriptivo con terminaciones en -aba o -ía que ambienta la escena del relato.",
    },
    {
      v: "En los verbos de la primera conjugación (-ar), el pretérito imperfecto se escribe siempre con B larga (-aba, -abas, -ábamos).",
      f: "La terminación del pretérito imperfecto de la primera conjugación se escribe indistintamente con V corta.",
      hint: "Pista: regla fija de ortografía castellana: caminaba, cantaba, soplaba, navegaba siempre con b.",
    },
    {
      v: "En las narraciones, el imperfecto y el perfecto simple se combinan para articular el fondo descriptivo con las acciones clave.",
      f: "En un cuento de aventuras está terminantemente prohibido utilizar más de un tiempo pretérito en el mismo texto.",
      hint: "Pista: combinación armónica de ambientación de época y avance cronológico de los sucesos de la trama.",
    },
  ],
  23: [
    {
      v: "El infinitivo es la forma no personal que da nombre al verbo y termina en -ar, -er o -ir.",
      f: "El infinitivo es un tiempo verbal que solo puede conjugarse en segunda persona del plural.",
      hint: "Pista: la forma básica de las palabras verbales tal como las encontramos listadas en el diccionario.",
    },
    {
      v: "Los verbos en infinitivo pertenecen a la 1.ª (-ar), 2.ª (-er) o 3.ª (-ir) conjugación.",
      f: "En español existen quince conjugaciones distintas identificadas con las letras del alfabeto.",
      hint: "Pista: clasificación de los verbos según la vocal temática de su terminación no personal.",
    },
    {
      v: "El infinitivo no posee desinencias de persona ni de número gramatical por ser una forma no personal.",
      f: "El infinitivo concuerda obligatoriamente en género femenino con el adjetivo calificativo de la oración.",
      hint: "Pista: no expresa por sí mismo quién realiza la acción, por eso se denomina forma no personal.",
    },
    {
      v: "En recetas e instructivos se utiliza frecuentemente el infinitivo para enunciar las indicaciones de los pasos a seguir.",
      f: "En las recetas de cocina está prohibido usar infinitivos para explicar la preparación de los platos.",
      hint: "Pista: expresiones directivas tradicionales de la cocina escolar: «Mezclar los ingredientes», «Hornear a fuego suave».",
    },
  ],
  24: [
    {
      v: "Los sinónimos son palabras con significados semejantes o equivalentes que permiten evitar repeticiones innecesarias.",
      f: "Los sinónimos son vocablos con significados exactamente opuestos y contrarios entre sí.",
      hint: "Pista: términos afines como comenzar y empezar, gélido y helado, docente y maestro.",
    },
    {
      v: "Los antónimos son palabras cuyos significados resultan contrarios u opuestos (ejemplo: claro / oscuro, subir / bajar).",
      f: "Los antónimos son palabras que se escriben de manera idéntica y provienen de la misma raíz etimológica.",
      hint: "Pista: parejas de vocablos en relación de oposición semántica: áspero / suave, abundante / escaso.",
    },
    {
      v: "El empleo de sinónimos enriquece el vocabulario y hace que los textos resulten más variados y amenos al leerse.",
      f: "Al redactar se recomienda repetir la misma palabra diez veces seguidas en cada renglón del texto.",
      hint: "Pista: recurso estilístico fundamental para otorgar fluidez y calidad literaria a las composiciones escritas.",
    },
    {
      v: "El contexto oracional determina cuál es el sinónimo más adecuado para expresar con precisión una idea.",
      f: "Cualquier sinónimo puede intercambiarse sin prestar atención al sentido ni al tono de la frase.",
      hint: "Pista: una misma palabra puede tener matices específicos según se hable del clima, la comida o las emociones.",
    },
  ],
  25: [
    {
      v: "Un hiperónimo es una palabra con significado general y abarcador que engloba a otros términos más específicos (hipónimos).",
      f: "Un hiperónimo es un signo de admiración que se utiliza para separar las vocales abiertas de las cerradas.",
      hint: "Pista: término general como «árbol» que incluye a «lenga, coihue, álamo y sauce».",
    },
    {
      v: "Los hipónimos son palabras de significado específico incluidas conceptualmente dentro de su respectivo hiperónimo.",
      f: "Los hipónimos son palabras extranjeras que carecen de traducción posible en el idioma español.",
      hint: "Pista: especies o variedades puntuales pertenecientes a una clase más amplia: guanaco y choique son hipónimos de fauna.",
    },
    {
      v: "El conocimiento de hiperónimos e hipónimos resulta esencial para confeccionar cuadros sinópticos y resúmenes de estudio.",
      f: "Los hiperónimos están prohibidos en los mapas conceptuales y esquemas visuales escolares.",
      hint: "Pista: herramienta lógica para organizar jerárquicamente conceptos generales y ejemplos particulares.",
    },
    {
      v: "Un campo semántico reúne a un grupo de palabras vinculadas por pertenecer a una misma área temática o de actividad.",
      f: "Un campo semántico es una cancha deportiva de césped sintético cercada por alambrados olímpicos.",
      hint: "Pista: conjunto de vocablos relacionados con un tema: barco, muelle, timón, marea y faro integran el campo marítimo.",
    },
  ],
  26: [
    {
      v: "Una familia de palabras está integrada por vocablos que comparten una misma raíz léxica y un significado afín.",
      f: "Una familia de palabras agrupa a términos que no tienen ninguna letra en común ni relación de sentido.",
      hint: "Pista: conjunto derivado de una base común: mar, marino, marea, marinero comparten la raíz mar-.",
    },
    {
      v: "Los prefijos son partículas morfológicas que se anteponen a la raíz para formar una nueva palabra derivada.",
      f: "Los prefijos son letras mayúsculas que se colocan únicamente al finalizar el último párrafo del libro.",
      hint: "Pista: elementos que van al inicio: des-armar, in-justo, sub-terráneo modifican el significado de la base.",
    },
    {
      v: "Los sufijos son partículas que se posponen a la raíz alterando su significado o categoría gramatical.",
      f: "Los sufijos son acentos ortográficos flotantes que se escriben encima de los signos de interrogación.",
      hint: "Pista: terminaciones añadidas al final de la raíz: flor-ería, panad-ero, niñ-ito, blanc-ura.",
    },
    {
      v: "El prefijo «des-» indica frecuentemente acción contraria, privación o negación (desorden, descongelar).",
      f: "El prefijo «des-» significa siempre multiplicación al cuadrado de la cantidad de elementos.",
      hint: "Pista: partícula que invierte el sentido de la palabra primitiva: deshacer es lo contrario de hacer.",
    },
  ],
  27: [
    {
      v: "Las palabras agudas tienen la sílaba tónica en la última sílaba y llevan tilde cuando terminan en N, S o VOCAL.",
      f: "Las palabras agudas se acentúan siempre en la primera sílaba sin importar qué letras tengan al final.",
      hint: "Pista: cañón, compás, papá llevan tilde; pero azul y pastor no llevan tilde por terminar en otra consonante.",
    },
    {
      v: "Las palabras graves tienen la sílaba tónica en la penúltima sílaba y llevan tilde cuando NO terminan en N, S ni VOCAL.",
      f: "Las palabras graves llevan tilde únicamente cuando terminan en vocal acentuada.",
      hint: "Pista: regla inversa a las agudas: árbol, cóndor, lápiz llevan tilde; casa, mesa no llevan tilde.",
    },
    {
      v: "Las palabras esdrújulas tienen la sílaba tónica en la antepenúltima sílaba y llevan tilde SIEMPRE sin excepción.",
      f: "Las palabras esdrújulas nunca llevan tilde ortográfica bajo ninguna circunstancia de la escritura.",
      hint: "Pista: brújula, pájaro, límite, esdrújula se tildan en todas las ocasiones.",
    },
    {
      v: "La sílaba tónica es aquella sobre la cual recae la mayor fuerza de voz al pronunciar una palabra.",
      f: "La sílaba tónica es la sílaba que se pronuncia en un susurro inaudible para que nadie la escuche.",
      hint: "Pista: el núcleo del acento prosódico que distingue la pronunciación de cada vocablo castellano.",
    },
  ],
  28: [
    {
      v: "La regla ortográfica establece que se escribe siempre la letra M antes de la B (ejemplo: cambio, tambor, sombra).",
      f: "La regla ortográfica obliga a escribir siempre la letra N antes de la letra B en todas las palabras.",
      hint: "Pista: combinación fija tradicional mb: alfombra, sembrar, tambor llevan siempre eme antes de be.",
    },
    {
      v: "Se escribe siempre la letra N antes de la V (ejemplo: invierno, enviar, tranvía, convento).",
      f: "Se escribe siempre la letra M antes de la V en todas las composiciones escritas del idioma español.",
      hint: "Pista: combinación consonántica fija nv: invitación, invento, enviar llevan ene antes de ve corta.",
    },
    {
      v: "En español se colocan obligatoriamente signos dobles de interrogación (¿?) y de exclamación (¡!) al inicio y al final.",
      f: "En español se prohíbe colocar signos al inicio y solo se utiliza un único signo al cierre como en inglés.",
      hint: "Pista: regla de puntuación de nuestra lengua que exige signos dobles de apertura y cierre.",
    },
    {
      v: "Las palabras que terminan en -z cambian esa letra por C al formar el plural ante la vocal e (pez -> peces, luz -> luces).",
      f: "Las palabras terminadas en z forman su plural agregando una letra s final sin modificar la zeta.",
      hint: "Pista: transformación ortográfica regular: nuez -> nueces, raíz -> raíces, lápiz -> lápices.",
    },
  ],
};

function getTfActivity(worldNum: number, id: string, skills: string[]): ActivitySpec {
  const pairs = TF_PAIRS_LENGUA[worldNum] || TF_PAIRS_LENGUA[1];
  const pair = pickOne(pairs);
  return makeVF(id, pair.v, pair.f, pair.hint, skills);
}

// Actividades interactivas no-pick (clasificar, ordenar, V/F) para los 28 mundos
export function getExtraLengua(n: number): ActivitySpec[] {
  switch (n) {
    case 1:
      return [
        makeClassify("l1-ex-0", "Clasificá las partes de una noticia periodística:", ["Elementos del Encabezado", "Elementos de Desarrollo"], [{"label":"Titular con letras destacadas","cat":0},{"label":"Volanta que anticipa el tema","cat":0},{"label":"Copete o bajada de síntesis","cat":0},{"label":"Cuerpo con detalles y testimonios","cat":1},{"label":"Epígrafe explicativo bajo la foto","cat":1},{"label":"Citas textuales de los testigos","cat":1}], "Pista: el titular, copete y volanta encabezan; cuerpo y epígrafe desarrollan la noticia.", ["l4-noticia"]),
        makeOrder("l1-ex-1", "Ordená los pasos para redactar una noticia escolar:", ["Investigar los hechos respondiendo qué, quién, cuándo y dónde","Escribir un titular atractivo que sintetice lo central","Redactar el copete y el cuerpo con testimonios verídicos","Elegir una fotografía y colocarle un epígrafe claro"], "Pista: primero se investiga, luego se titula, se redacta el cuerpo y se cierra con foto y epígrafe.", ["l4-noticia"]),
        makeClassify("l1-ex-2", "Clasificá las preguntas básicas del periodismo según su enfoque:", ["Preguntas de Acción y Lugar", "Preguntas de Protagonistas y Tiempo"], [{"label":"¿Qué ocurrió en el lugar?","cat":0},{"label":"¿Dónde se produjeron los hechos?","cat":0},{"label":"¿Quiénes fueron los protagonistas?","cat":1},{"label":"¿Cuándo sucedió el acontecimiento?","cat":1}], "Pista: qué y dónde refieren al suceso y sitio; quién y cuándo a las personas y el momento.", ["l4-noticia"]),
        getTfActivity(1, "l1-ex-3", ["l4-noticia"]),
      ];
    case 2:
      return [
        makeOrder("l2-ex-0", "Ordená la secuencia lógica de lectura comprensiva de una noticia:", ["Leer el titular y el copete para anticipar de qué trata","Identificar qué hecho ocurrió y en qué lugar","Reconocer quiénes participaron y cuándo sucedió","Analizar las causas y declaraciones de los testigos"], "Pista: desde el titular y el suceso central hacia los protagonistas y testimonios.", ["l4-noticia-lectura"]),
        makeClassify("l2-ex-1", "Clasificá la información de una noticia según su contenido:", ["Datos del Hecho y del Lugar", "Datos de Protagonistas y Horarios"], [{"label":"Inauguración de la biblioteca comunitaria","cat":0},{"label":"Río Gallegos, Santa Cruz","cat":0},{"label":"Alumnos y docentes de la Escuela N.° 1","cat":1},{"label":"Ayer por la tarde al cierre del turno","cat":1}], "Pista: inauguración y ciudad son hecho y sitio; alumnos y tarde son protagonistas y momento.", ["l4-noticia-lectura"]),
        makeClassify("l2-ex-2", "Clasificá las noticias según la sección del diario a la que corresponden:", ["Sección Deportes y Turismo", "Sección Cultura y Educación"], [{"label":"Regata de kayaks en el río Santa Cruz","cat":0},{"label":"Avistaje de ballenas en el Golfo San Jorge","cat":0},{"label":"Feria de ciencias premiada en Río Turbio","cat":1},{"label":"Muestra de pinturas rupestres en el museo municipal","cat":1}], "Pista: kayaks y avistaje son deportes y turismo; ciencias y museo son educación y cultura.", ["l4-noticia-lectura"]),
        getTfActivity(2, "l2-ex-3", ["l4-noticia-lectura"]),
      ];
    case 3:
      return [
        makeClassify("l3-ex-0", "Clasificá los elementos de un texto expositivo según su función:", ["Partes de la Estructura", "Recursos de Explicación"], [{"label":"Párrafo de introducción temática","cat":0},{"label":"Desarrollo dividido en subtítulos","cat":0},{"label":"Párrafo de conclusión integradora","cat":0},{"label":"Definición conceptual precisa","cat":1},{"label":"Ejemplificación con casos concretos","cat":1},{"label":"Gráficos, mapas y esquemas visuales","cat":1}], "Pista: introducción, desarrollo y conclusión estructuran; definiciones y ejemplos explican.", ["l4-expositivo"]),
        makeOrder("l3-ex-1", "Ordená la estructura formal de un texto expositivo de estudio:", ["Título claro que presenta el tema general","Párrafo de introducción que presenta el objeto de estudio","Desarrollo temático dividido en subtítulos y párrafos","Conclusión que sintetiza los aspectos fundamentales"], "Pista: desde el título inicial hasta la conclusión integradora.", ["l4-expositivo"]),
        makeClassify("l3-ex-2", "Clasificá los párrafos según su función en el texto de ciencias:", ["Párrafo de Introducción", "Párrafo de Conclusión"], [{"label":"Presentar el tema y anticipar qué se explicará","cat":0},{"label":"Despertar el interés del lector sobre el fenómeno","cat":0},{"label":"Sintetizar las ideas centrales expuestas","cat":1},{"label":"Brindar un balance final de los conocimientos explicados","cat":1}], "Pista: presentar y anticipar es introducción; resumir y balancear es conclusión.", ["l4-expositivo"]),
        getTfActivity(3, "l3-ex-3", ["l4-expositivo"]),
      ];
    case 4:
      return [
        makeOrder("l4-ex-0", "Ordená los pasos de comprensión lectora de un texto de ciencias naturales:", ["Leer el texto completo para comprender el tema global","Releer identificando el vocabulario técnico o desconocido","Subrayar las ideas principales de cada párrafo","Redactar un resumen con las conclusiones del texto"], "Pista: desde la lectura panorámica hacia el subrayado de ideas y el resumen final.", ["l4-expositivo-lectura"]),
        makeClassify("l4-ex-1", "Clasificá las especies santacruceñas según el ambiente donde habitan:", ["Estepa y Mesetas Altas", "Bosque Andino Cordillerano"], [{"label":"Coirón de hojas finas y raíces profundas","cat":0},{"label":"Mata negra con flores aromáticas","cat":0},{"label":"Macá tobiano en lagunas de altura","cat":0},{"label":"Lenga de hoja caduca que resiste la nieve","cat":1},{"label":"Ñire achaparrado adaptado al viento","cat":1},{"label":"Huemul que se refugia entre los riscos","cat":1}], "Pista: coirón y macá habitan la estepa; lenga y huemul el bosque cordillerano.", ["l4-expositivo-lectura"]),
        makeClassify("l4-ex-2", "Clasificá las adaptaciones de los seres vivos según su propósito:", ["Protección contra el Frío Extremo", "Resistencia al Viento y la Sequía"], [{"label":"Pérdida de hojas en otoño para no congelarse","cat":0},{"label":"Grasa corporal densa en mamíferos marinos","cat":0},{"label":"Raíces profundas que absorben agua subterránea","cat":1},{"label":"Ramas achaparradas y resinosas contra el viento","cat":1}], "Pista: perder hojas y grasa corporal protegen del frío; raíces y ramas resinosas resisten el viento seco.", ["l4-expositivo-lectura"]),
        getTfActivity(4, "l4-ex-3", ["l4-expositivo-lectura"]),
      ];
    case 5:
      return [
        makeClassify("l5-ex-0", "Clasificá las características de textos biográficos:", ["Biografía", "Autobiografía"], [{"label":"Escrita en tercera persona (él o ella)","cat":0},{"label":"El autor investiga la vida de otra persona","cat":0},{"label":"Tono objetivo fundamentado en fuentes documentales","cat":0},{"label":"Escrita en primera persona (yo)","cat":1},{"label":"El autor relata sus propias experiencias de vida","cat":1},{"label":"Tono subjetivo basado en recuerdos personales","cat":1}], "Pista: biografía habla de otro (3.ª persona); autobiografía habla de uno mismo (1.ª persona).", ["l4-biografia"]),
        makeOrder("l5-ex-1", "Ordená cronológicamente las etapas de una biografía:", ["Lugar y fecha de nacimiento y entorno familiar temprano","Años de formación escolar y juventud","Logros, descubrimientos o acciones destacadas de la adultez","Reconocimientos finales y legado histórico"], "Pista: orden cronológico natural de la vida de un personaje.", ["l4-biografia"]),
        makeClassify("l5-ex-2", "Clasificá las fuentes de investigación biográfica según su tipo:", ["Documentos Escritos", "Registros Visuales y Materiales"], [{"label":"Cartas y diarios de viaje manuscritos","cat":0},{"label":"Actas de nacimiento y títulos de estudio","cat":0},{"label":"Fotografías de época y retratos al óleo","cat":1},{"label":"Herramientas y objetos personales de expedición","cat":1}], "Pista: cartas y actas son documentos escritos; fotos y herramientas son visuales y materiales.", ["l4-biografia"]),
        getTfActivity(5, "l5-ex-3", ["l4-biografia"]),
      ];
    case 6:
      return [
        makeOrder("l6-ex-0", "Ordená cronológicamente los hitos biográficos del perito Francisco Moreno:", ["Nacimiento y primeras excursiones juveniles de naturalista","Exploración de la cuenca del río Santa Cruz y lago Argentino en 1877","Defensa pericial de los límites territoriales de la patria","Donación de tierras cordilleranas para crear parques nacionales"], "Pista: desde su juventud exploradora hasta la donación de tierras protegidas.", ["l4-biografia-patagonica"]),
        makeClassify("l6-ex-1", "Clasificá a los pioneros patagónicos según su principal contribución:", ["Soberanía y Navegación Austral", "Exploración Científica y Límites"], [{"label":"Luis Piedra Buena defendiendo la isla Pavón","cat":0},{"label":"Casimiro Biguá jurando lealtad a la bandera argentina","cat":0},{"label":"Francisco Moreno relevando lagos cordilleranos","cat":1},{"label":"Carlos Moyano descubriendo carbón en Río Turbio","cat":1}], "Pista: Piedra Buena y Biguá defendieron la soberanía; Moreno y Moyano exploraron y relevaron la región.", ["l4-biografia-patagonica"]),
        makeClassify("l6-ex-2", "Clasificá las acciones del comandante Luis Piedra Buena:", ["Defensa de la Soberanía", "Rescate Humanitario en el Mar"], [{"label":"Establecer la factoría comercial en la isla Pavón en 1859","cat":0},{"label":"Izar la bandera argentina en las costas de Santa Cruz","cat":0},{"label":"Salvar a marineros de buques náufragos en el cabo de Hornos","cat":1},{"label":"Auxiliar con su barco a tripulaciones extranjeras en peligro","cat":1}], "Pista: izar la bandera y poblar es soberanía; socorrer náufragos es rescate humanitario.", ["l4-biografia-patagonica"]),
        getTfActivity(6, "l6-ex-3", ["l4-biografia-patagonica"]),
      ];
    case 7:
      return [
        makeClassify("l7-ex-0", "Clasificá las formas verbales según su uso en textos instructivos:", ["Verbos en Infinitivo", "Verbos en Modo Imperativo"], [{"label":"Mezclar los ingredientes secos en un bol","cat":0},{"label":"Cortar el papel con tijera de punta redonda","cat":0},{"label":"Pegar las pestañas laterales con cola blanca","cat":0},{"label":"Mezclá bien hasta formar una masa suave","cat":1},{"label":"Cortá con mucho cuidado sobre la línea punteada","cat":1},{"label":"Pegá los bordes presionando durante un minuto","cat":1}], "Pista: infinitivo termina en -ar/-er/-ir; imperativo da la directiva u orden directa.", ["l4-instructivo"]),
        makeOrder("l7-ex-1", "Ordená los pasos de una receta tradicional para hacer tortas fritas:", ["Reunir harina, grasa, agua tibia y una pizca de sal en un bol","Amasar los ingredientes hasta obtener una masa elástica y suave","Estirar la masa y cortar discos con un agujerito en el centro","Cocinar los discos en grasa caliente y espolvorear con azúcar"], "Pista: desde la preparación de ingredientes hasta la cocción y presentación final.", ["l4-instructivo"]),
        makeClassify("l7-ex-2", "Clasificá los componentes de un instructivo de armado:", ["Lista de Materiales y Herramientas", "Instrucciones de Armado"], [{"label":"Dos maderas de pino de 30 centímetros","cat":0},{"label":"Tornillos de cabeza redonda y destornillador","cat":0},{"label":"Lijar las superficies hasta dejarlas suaves","cat":1},{"label":"Unir las maderas atornillando los extremos","cat":1}], "Pista: maderas y tornillos son insumos requeridos; lijar y unir son pasos del procedimiento.", ["l4-instructivo"]),
        getTfActivity(7, "l7-ex-3", ["l4-instructivo"]),
      ];
    case 8:
      return [
        makeClassify("l8-ex-0", "Clasificá las fórmulas epistolares según el registro comunicativo:", ["Registro Formal (Autoridades)", "Registro Informal (Familia / Amigos)"], [{"label":"«De mi mayor consideración:»","cat":0},{"label":"«Me dirijo a usted con el debido respeto:»","cat":0},{"label":"«Saluda a usted atentamente,»","cat":0},{"label":"«¡Hola, querido abuelo!»","cat":1},{"label":"«Te mando un abrazo enorme y muchos besos,»","cat":1},{"label":"«¿Cómo estás? ¡Tanto tiempo sin verte!»","cat":1}], "Pista: fórmulas protocolares son de registro formal; expresiones de cariño son informales.", ["l4-carta-correo"]),
        makeOrder("l8-ex-1", "Ordená las partes formales de una carta tradicional de correo:", ["Lugar y fecha de emisión en el margen superior derecho","Fórmula de saludo o encabezamiento según el destinatario","Cuerpo de la carta con el mensaje y las novedades","Fórmula de despedida cordial y firma del remitente"], "Pista: lugar y fecha primero, luego saludo, cuerpo central, despedida y firma.", ["l4-carta-correo"]),
        makeClassify("l8-ex-2", "Clasificá los elementos de la correspondencia según el soporte:", ["Carta en Papel", "Correo Electrónico Digital"], [{"label":"Sobre de correo con estampilla postal adherida","cat":0},{"label":"Buzón postal para depositar el envío","cat":0},{"label":"Dirección con casilla de correo (@)","cat":1},{"label":"Botón de clip para adjuntar documentos o fotos","cat":1}], "Pista: sobre y estampilla son en papel; arroba y clip son del correo digital.", ["l4-carta-correo"]),
        getTfActivity(8, "l8-ex-3", ["l4-carta-correo"]),
      ];
    case 9:
      return [
        makeClassify("l9-ex-0", "Clasificá los elementos narrativos de una fábula tradicional:", ["Elementos del Relato Ficcional", "Elementos de la Moraleja"], [{"label":"Animales personificados que hablan y dialogan","cat":0},{"label":"Conflicto provocado por la astucia o el engaño","cat":0},{"label":"Resolución de la disputa entre los personajes","cat":0},{"label":"Enseñanza ética sobre la prudencia y el respeto","cat":1},{"label":"Reflexión final sobre las consecuencias de la soberbia","cat":1},{"label":"Consejo práctico sobre el valor de la perseverancia","cat":1}], "Pista: animales y conflicto son del relato; enseñanzas y consejos son de la moraleja.", ["l4-fabula"]),
        makeOrder("l9-ex-1", "Ordená la secuencia narrativa típica de una fábula:", ["Presentación de los personajes animales y la situación inicial","Surgimiento del conflicto motivado por la presunción o engaño","Desenlace donde las acciones determinan quién triunfa o aprende","Moraleja final que sintetiza la lección de conducta para el lector"], "Pista: inicio, conflicto, desenlace y moraleja final.", ["l4-fabula"]),
        makeClassify("l9-ex-2", "Clasificá las actitudes de los personajes de la fábula de «La liebre y la tortuga»:", ["Actitudes de la Liebre", "Actitudes de la Tortuga"], [{"label":"Burlarse de la lentitud de su compañera de carrera","cat":0},{"label":"Confiar en exceso en su velocidad y dormirse","cat":0},{"label":"Avanzar paso a paso con constancia y sin detenerse","cat":1},{"label":"Mantener la humildad y el esfuerzo hasta la meta","cat":1}], "Pista: burla y exceso de confianza son de la liebre; constancia y esfuerzo de la tortuga.", ["l4-fabula"]),
        getTfActivity(9, "l9-ex-3", ["l4-fabula"]),
      ];
    case 10:
      return [
        makeClassify("l10-ex-0", "Clasificá las rimas poéticas según sean consonantes o asonantes:", ["Rima Consonante", "Rima Asonante"], [{"label":"florero / sendero","cat":0},{"label":"glaciar / cantar","cat":0},{"label":"camino / destino","cat":0},{"label":"cordillera / tierra","cat":1},{"label":"nube / dulce","cat":1},{"label":"pino / libro","cat":1}], "Pista: consonante repite todas las letras finales; asonante solo las vocales.", ["l4-poesia"]),
        makeClassify("l10-ex-1", "Clasificá las frases poéticas según el sentido al que apelan:", ["Imagen Visual", "Imagen Auditiva", "Imagen Táctil"], [{"label":"«Las cumbres blancas brillan bajo el sol»","cat":0},{"label":"«Las aguas azules del lago Argentino»","cat":0},{"label":"«El crujido seco del hielo al romperse»","cat":1},{"label":"«El murmullo constante del arroyo serrano»","cat":1},{"label":"«La suave caricia de la brisa en la mejilla»","cat":2},{"label":"«El frío cortante de la escarcha invernal»","cat":2}], "Pista: colores son visuales; crujido y murmullo auditivos; caricia y frío táctiles.", ["l4-poesia"]),
        makeOrder("l10-ex-2", "Ordená los niveles de organización de un poema de MENOR a MAYOR:", ["Verso individual que compone una línea poética","Estrofa que agrupa un conjunto regular de versos","Poema completo estructurado con ritmo y musicalidad"], "Pista: desde el verso aislado hasta la estrofa y el poema completo.", ["l4-poesia"]),
        getTfActivity(10, "l10-ex-3", ["l4-poesia"]),
      ];
    case 11:
      return [
        makeClassify("l11-ex-0", "Clasificá los textos de un libreto teatral según su destinatario:", ["Parlamentos (para los Actores en Escena)", "Acotaciones (Indicaciones Técnicas y Escénicas)"], [{"label":"«¡Miren allá arriba, en la cima del cerro!»","cat":0},{"label":"«No temas, el camino es seguro si vamos juntos.»","cat":0},{"label":"(Entra corriendo por la izquierda con cara de asombro)","cat":1},{"label":"(Baja la voz y mira hacia todos lados con recelo)","cat":1},{"label":"(Se apagan las luces del frente y suena viento patagónico)","cat":1}], "Pista: lo que dicen los actores son parlamentos; lo que va entre paréntesis son acotaciones.", ["l4-teatro"]),
        makeOrder("l11-ex-1", "Ordená los pasos para montar una obra de teatro escolar:", ["Lectura y comprensión colectiva del libreto dramático","Distribución de personajes y memorización de parlamentos","Ensayos generales incorporando vestuario, utilería y escenografía","Representación final de la obra frente a los espectadores"], "Pista: desde la lectura y memorización hasta los ensayos con vestuario y el estreno.", ["l4-teatro"]),
        makeClassify("l11-ex-2", "Clasificá los elementos teatrales según correspondan al texto o a la puesta en escena:", ["Elementos del Texto Escrito", "Elementos de la Puesta en Escena"], [{"label":"Diálogos escritos entre personajes","cat":0},{"label":"Acotaciones de escenografía entre paréntesis","cat":0},{"label":"Iluminación focal sobre el centro del escenario","cat":1},{"label":"Vestuario confeccionado para cada personaje","cat":1}], "Pista: diálogos y acotaciones son del texto escrito; luces y trajes de la puesta en escena.", ["l4-teatro"]),
        getTfActivity(11, "l11-ex-3", ["l4-teatro"]),
      ];
    case 12:
      return [
        makeClassify("l12-ex-0", "Clasificá los mensajes según el tipo de afiche:", ["Afiche Comercial de Publicidad", "Afiche de Propaganda Social"], [{"label":"«Probá el nuevo chocolate artesanal de El Calafate»","cat":0},{"label":"«Comprá tu equipo de montaña con descuento especial»","cat":0},{"label":"«Cuidemos el agua: cerrá la canilla mientras te cepillás»","cat":1},{"label":"«Protegé los bosques nativos: no hagas fuego en zonas no habilitadas»","cat":1},{"label":"«Vacuná a tus mascotas para prevenir enfermedades comunitarias»","cat":1}], "Pista: vender productos es publicidad comercial; cuidar recursos y salud es propaganda social.", ["l4-afiche"]),
        makeClassify("l12-ex-1", "Clasificá los componentes de un afiche según su lenguaje:", ["Lenguaje Verbal (Texto)", "Lenguaje Visual (Imagen)"], [{"label":"Eslogan breve y llamativo para recordar","cat":0},{"label":"Datos de contacto, fecha y lugar del evento","cat":0},{"label":"Fotografía de alta resolución de un glaciar","cat":1},{"label":"Colores vivos y contrastantes de fondo","cat":1}], "Pista: eslogan y datos son palabras escritas; fotografías y colores son imágenes visuales.", ["l4-afiche"]),
        makeOrder("l12-ex-2", "Ordená los pasos para confeccionar un afiche escolar:", ["Definir el mensaje central y el público al que estará dirigido","Redactar un eslogan ingenioso y fácil de memorizar","Seleccionar o dibujar imágenes atractivas de gran tamaño","Distribuir texto e imagen armónicamente con colores contrastantes"], "Pista: definir el mensaje, redactar el eslogan, elegir la imagen y diagramar el afiche.", ["l4-afiche"]),
        getTfActivity(12, "l12-ex-3", ["l4-afiche"]),
      ];
    case 13:
      return [
        makeClassify("l13-ex-0", "Clasificá las oraciones según sean bimembres o unimembres:", ["Oración Bimembre (Sujeto y Predicado)", "Oración Unimembre (Un solo miembro)"], [{"label":"Los pingüinos nadan velozmente en el mar.","cat":0},{"label":"El viento patagónico sopló durante toda la tarde.","cat":0},{"label":"Los alumnos leyeron una hermosa leyenda tehuelche.","cat":0},{"label":"¡Qué hermoso día en la cordillera!","cat":1},{"label":"Nevada intensa en el cerro Fitz Roy.","cat":1},{"label":"Silencio absoluto en el refugio de montaña.","cat":1}], "Pista: bimembre tiene verbo conjugado y sujeto; unimembre es una frase sin división sujeto/predicado.", ["l4-parrafo-oracion"]),
        makeOrder("l13-ex-1", "Ordená los pasos formales para redactar un párrafo escolar:", ["Comenzar con sangría y mayúscula inicial en la primera palabra","Desarrollar la idea central mediante oraciones separadas por punto y seguido","Revisar la concordancia entre sujeto, verbos y adjetivos","Concluir el párrafo colocando punto y aparte"], "Pista: sangría y mayúscula inicial, oraciones coordinadas, concordancia y punto y aparte.", ["l4-parrafo-oracion"]),
        makeClassify("l13-ex-2", "Clasificá la función de los signos de puntuación:", ["Punto y Seguido", "Punto y Aparte"], [{"label":"Separar oraciones dentro de un mismo bloque temático","cat":0},{"label":"Permitir continuar escribiendo en el mismo renglón","cat":0},{"label":"Cerrar un párrafo para pasar a otro aspecto del tema","cat":1},{"label":"Exigir pasar al siguiente renglón dejando sangría","cat":1}], "Pista: mismo renglón es punto y seguido; nuevo renglón con sangría es punto y aparte.", ["l4-parrafo-oracion"]),
        getTfActivity(13, "l13-ex-3", ["l4-parrafo-oracion"]),
      ];
    case 14:
      return [
        makeClassify("l14-ex-0", "Clasificá los conectores según su función lógica:", ["Conectores Temporales", "Conectores Causales", "Conectores de Oposición"], [{"label":"luego de varias horas","cat":0},{"label":"mientras tanto en el refugio","cat":0},{"label":"finalmente al atardecer","cat":0},{"label":"porque hacía mucho frío","cat":1},{"label":"ya que la nieve cubría el camino","cat":1},{"label":"debido a que se desató un temporal","cat":1},{"label":"pero no se desanimaron","cat":2},{"label":"sin embargo continuaron marchando","cat":2},{"label":"a pesar del viento helado","cat":2}], "Pista: temporales ordenan el tiempo; causales dan razones; oposición marca contrastes.", ["l4-conectores"]),
        makeOrder("l14-ex-1", "Ordená cronológicamente esta narración según sus conectores temporales:", ["Primero, los guardaparques revisaron los senderos del cerro","Luego, caminaron durante cuatro horas bordeando el río congelado","Mientras tanto, los cóndores planeaban sobre las cumbres nevadas","Finalmente, regresaron a la seccional antes de la caída del sol"], "Pista: primero, luego, mientras tanto y finalmente ordenan la acción en el tiempo.", ["l4-conectores"]),
        makeClassify("l14-ex-2", "Clasificá las oraciones según el tipo de conector que contienen:", ["Conector Causal (Explica Motivo)", "Conector de Oposición (Marca Contraste)"], [{"label":"Nos abrigamos bien porque la temperatura descendió a cero grados.","cat":0},{"label":"El guía detuvo la marcha ya que el río estaba desbordado.","cat":0},{"label":"El sendero era empinado, pero todos alcanzaron la cima.","cat":1},{"label":"Tenían frío; sin embargo, no perdieron el entusiasmo.","cat":1}], "Pista: porque y ya que dan causas; pero y sin embargo contrastan ideas.", ["l4-conectores"]),
        getTfActivity(14, "l14-ex-3", ["l4-conectores"]),
      ];
    case 15:
      return [
        makeClassify("l15-ex-0", "Clasificá el sujeto de cada oración:", ["Sujeto Expreso Simple (1 Núcleo)", "Sujeto Expreso Compuesto (2+ Núcleos)"], [{"label":"El guanaco salta con agilidad sobre los alambrados.","cat":0},{"label":"La hermosa meseta patagónica se extiende hacia el este.","cat":0},{"label":"El zorro y la liebre corren entre los arbustos secos.","cat":1},{"label":"El guía y los turistas llegaron temprano al mirador.","cat":1},{"label":"El cóndor y el águila vuelan sobre el cañadón rocoso.","cat":1}], "Pista: un solo núcleo sustantivo es SES; dos o más núcleos coordinados es SEC.", ["l4-sujeto"]),
        makeClassify("l15-ex-1", "Clasificá las palabras según su función dentro del sujeto «Los guías experimentados»:", ["Modificador Directo (Artículo / Adjetivo)", "Núcleo del Sujeto (Sustantivo)"], [{"label":"Los (artículo masculino plural)","cat":0},{"label":"experimentados (adjetivo calificativo)","cat":0},{"label":"guías (sustantivo común que realiza la acción)","cat":1}], "Pista: artículos y adjetivos son modificadores directos; el sustantivo principal es el núcleo.", ["l4-sujeto"]),
        makeOrder("l15-ex-2", "Ordená los pasos para analizar sintácticamente el sujeto de una oración:", ["Identificar el verbo conjugado principal de la oración","Preguntarle al verbo quién o quiénes realizan la acción","Delimitar la construcción del sujeto expreso completo","Señalar el núcleo sustantivo y sus modificadores directos"], "Pista: hallar el verbo, preguntar quién, delimitar el sujeto y marcar el núcleo.", ["l4-sujeto"]),
        getTfActivity(15, "l15-ex-3", ["l4-sujeto"]),
      ];
    case 16:
      return [
        makeClassify("l16-ex-0", "Clasificá el predicado de cada oración:", ["Predicado Verbal Simple (1 Verbo)", "Predicado Verbal Compuesto (2+ Verbos)"], [{"label":"El cóndor planea majestuoso sobre la cordillera.","cat":0},{"label":"La llovizna mojó los pastizales durante toda la noche.","cat":0},{"label":"Los pioneros cruzaron el río y armaron el campamento.","cat":1},{"label":"Martín encendió el fuego y calentó la pava para el mate.","cat":1},{"label":"El choique corrió velozmente y desapareció en la estepa.","cat":1}], "Pista: un solo verbo es PVS; dos verbos coordinados para el mismo sujeto es PVC.", ["l4-predicado-verbal"]),
        makeClassify("l16-ex-1", "Clasificá los circunstanciales del predicado según su clase:", ["Circunstancial de Lugar (¿Dónde?)", "Circunstancial de Tiempo (¿Cuándo?)"], [{"label":"en las altas mesetas santacruceñas","cat":0},{"label":"junto a la orilla del lago Argentino","cat":0},{"label":"durante la madrugada del último martes","cat":1},{"label":"temprano al salir el sol","cat":1}], "Pista: mesetas y orilla responden a dónde; madrugada y temprano responden a cuándo.", ["l4-predicado-verbal"]),
        makeOrder("l16-ex-2", "Ordená los pasos para analizar el predicado en una oración bimembre:", ["Reconocer el sujeto y delimitar la parte que contiene la acción","Identificar los verbos conjugados que funcionan como núcleos","Determinar si el predicado verbal es simple (PVS) o compuesto (PVC)","Marcar los circunstanciales que indican lugar, tiempo o modo"], "Pista: separar el sujeto, hallar los verbos, clasificar PVS/PVC y marcar circunstanciales.", ["l4-predicado-verbal"]),
        getTfActivity(16, "l16-ex-3", ["l4-predicado-verbal"]),
      ];
    case 17:
      return [
        makeClassify("l17-ex-0", "Clasificá los sustantivos según sean comunes o propios:", ["Sustantivos Comunes", "Sustantivos Propios"], [{"label":"glaciar","cat":0},{"label":"cordillera","cat":0},{"label":"choique","cat":0},{"label":"río","cat":0},{"label":"Perito Moreno","cat":1},{"label":"Santa Cruz","cat":1},{"label":"Fitz Roy","cat":1},{"label":"Río Gallegos","cat":1}], "Pista: los comunes van con minúscula; los propios identifican seres o lugares únicos con mayúscula.", ["l4-sustantivos-clases"]),
        makeClassify("l17-ex-1", "Clasificá los sustantivos comunes según sean individuales o colectivos:", ["Sustantivos Individuales (1 solo ser)", "Sustantivos Colectivos (Conjunto en singular)"], [{"label":"pez","cat":0},{"label":"lobo","cat":0},{"label":"árbol","cat":0},{"label":"caballo","cat":0},{"label":"cardumen (conjunto de peces)","cat":1},{"label":"jauría (conjunto de lobos o perros)","cat":1},{"label":"arboleda (conjunto de árboles)","cat":1},{"label":"tropilla (conjunto de caballos)","cat":1}], "Pista: individuales nombran un elemento; colectivos nombran un grupo en singular.", ["l4-sustantivos-clases"]),
        makeClassify("l17-ex-2", "Clasificá los sustantivos según sean concretos o abstractos:", ["Sustantivos Concretos (Perceptibles)", "Sustantivos Abstractos (Ideas o Emociones)"], [{"label":"piedra","cat":0},{"label":"nieve","cat":0},{"label":"mesa","cat":0},{"label":"paz","cat":1},{"label":"alegría","cat":1},{"label":"justicia","cat":1}], "Pista: piedra y nieve se tocan y ven; paz y alegría son ideas y sentimientos.", ["l4-sustantivos-clases"]),
        getTfActivity(17, "l17-ex-3", ["l4-sustantivos-clases"]),
      ];
    case 18:
      return [
        makeClassify("l18-ex-0", "Clasificá los adjetivos según su tipo:", ["Adjetivos Calificativos", "Adjetivos Gentilicios", "Adjetivos Numerales"], [{"label":"gélido","cat":0},{"label":"transparente","cat":0},{"label":"ventoso","cat":0},{"label":"santacruceño","cat":1},{"label":"fueguino","cat":1},{"label":"argentino","cat":1},{"label":"tres","cat":2},{"label":"primer","cat":2},{"label":"cuarto","cat":2}], "Pista: calificativos describen cualidades; gentilicios procedencia; numerales cantidad u orden.", ["l4-adjetivos-clases"]),
        makeClassify("l18-ex-1", "Clasificá los adjetivos numerales según sean cardinales u ordinales:", ["Adjetivos Cardinales (Cantidad)", "Adjetivos Ordinales (Orden de Posición)"], [{"label":"dos","cat":0},{"label":"cinco","cat":0},{"label":"cien","cat":0},{"label":"segundo","cat":1},{"label":"quinto","cat":1},{"label":"décimo","cat":1}], "Pista: cardinales cuentan cantidades; ordinales indican orden de posición.", ["l4-adjetivos-clases"]),
        makeClassify("l18-ex-2", "Clasificá los gentilicios argentinos según su región:", ["Gentilicios Patagónicos", "Gentilicios de Otras Regiones"], [{"label":"chubutense","cat":0},{"label":"santacruceño","cat":0},{"label":"neuquino","cat":0},{"label":"tucumano","cat":1},{"label":"salteño","cat":1},{"label":"correntino","cat":1}], "Pista: Chubut, Santa Cruz y Neuquén son patagónicos; Tucumán, Salta y Corrientes son de otras zonas.", ["l4-adjetivos-clases"]),
        getTfActivity(18, "l18-ex-3", ["l4-adjetivos-clases"]),
      ];
    case 19:
      return [
        makeClassify("l19-ex-0", "Clasificá las frases según tengan concordancia correcta o con error:", ["Concordancia Correcta", "Concordancia con Error"], [{"label":"Las ovejas blancas pastaban tranquilas.","cat":0},{"label":"El viento patagónico soplaba con fuerza.","cat":0},{"label":"La laguna cristalina reflejaba el cielo.","cat":0},{"label":"Los cóndor volaban alto.","cat":1},{"label":"La meseta estaban seco por el viento.","cat":1},{"label":"El pasto duros pinchaban las botas.","cat":1}], "Pista: el género y número deben coincidir exactamente entre sustantivo y adjetivo.", ["l4-concordancia-gn"]),
        makeClassify("l19-ex-1", "Clasificá los adjetivos según sus terminaciones de género:", ["Dos Terminaciones (Varía Femenino/Masculino)", "Una Sola Terminación (Invariable para Ambos)"], [{"label":"blanco / blanca","cat":0},{"label":"seco / seca","cat":0},{"label":"caluroso / calurosa","cat":0},{"label":"veloz (puma veloz / liebre veloz)","cat":1},{"label":"grande (lago grande / montaña grande)","cat":1},{"label":"verde (bosque verde / pradera verde)","cat":1}], "Pista: blanco varía a blanca; veloz y grande se usan igual para masculino y femenino.", ["l4-concordancia-gn"]),
        makeOrder("l19-ex-2", "Ordená las palabras para armar una frase con concordancia correcta:", ["Las","antiguas","pinturas","rupestres"], "Pista: artículo femenino plural, adjetivo femenino plural y sustantivo femenino plural.", ["l4-concordancia-gn"]),
        getTfActivity(19, "l19-ex-3", ["l4-concordancia-gn"]),
      ];
    case 20:
      return [
        makeClassify("l20-ex-0", "Clasificá los verbos conjugados según la persona gramatical de su sujeto:", ["1.ª Persona (Hablante / Nosotros)", "2.ª Persona (Oyente / Vos)", "3.ª Persona (Otro / Ellos)"], [{"label":"caminamos por la estepa","cat":0},{"label":"escribo una carta","cat":0},{"label":"caminás con cuidado","cat":1},{"label":"leés un buen cuento","cat":1},{"label":"observa las aves","cat":2},{"label":"volaron sobre el lago","cat":2}], "Pista: yo/nosotros es 1.ª; vos/ustedes es 2.ª; él/ellos es 3.ª persona.", ["l4-verbo-persona-numero"]),
        makeClassify("l20-ex-1", "Clasificá los verbos según su número gramatical:", ["Número Singular (1 solo sujeto)", "Número Plural (Más de un sujeto)"], [{"label":"navega","cat":0},{"label":"cantás","cat":0},{"label":"descubrí","cat":0},{"label":"navegamos","cat":1},{"label":"cantan","cat":1},{"label":"descubrieron","cat":1}], "Pista: un solo ejecutor es singular; varios ejecutores es plural.", ["l4-verbo-persona-numero"]),
        makeOrder("l20-ex-2", "Ordená los pronombres personales del singular al plural según su persona:", ["Yo (primera persona singular)","Vos (segunda persona singular)","Él o ella (tercera persona singular)","Nosotros o nosotras (primera persona plural)"], "Pista: 1.ª singular, 2.ª singular, 3.ª singular y 1.ª plural.", ["l4-verbo-persona-numero"]),
        getTfActivity(20, "l20-ex-3", ["l4-verbo-persona-numero"]),
      ];
    case 21:
      return [
        makeClassify("l21-ex-0", "Clasificá las oraciones según el tiempo verbal predominante:", ["Tiempo Pretérito (Pasado)", "Tiempo Presente", "Tiempo Futuro"], [{"label":"Los pioneros cruzaron la cordillera a caballo.","cat":0},{"label":"Ayer nevó intensamente sobre la villa turística.","cat":0},{"label":"Los alumnos estudian las características del macá tobiano.","cat":1},{"label":"El viento sopla fuerte en la meseta central.","cat":1},{"label":"Mañana viajaremos hacia el Parque Nacional Los Glaciares.","cat":2},{"label":"La semana próxima visitaremos el museo histórico regional.","cat":2}], "Pista: cruzaron es pasado; estudian es presente; viajaremos es futuro.", ["l4-tiempos-verbales"]),
        makeOrder("l21-ex-0", "Ordená cronológicamente las acciones según su tiempo verbal:", ["Ayer exploré el bosque andino","Hoy descanso en la hostería de la villa","Mañana viajaré hacia la cordillera"], "Pista: ayer (pasado), hoy (presente) y mañana (futuro).", ["l4-tiempos-verbales"]),
        makeClassify("l21-ex-2", "Clasificá los adverbios temporales según el tiempo que suelen acompañar:", ["Tiempo Pasado", "Tiempo Futuro"], [{"label":"ayer por la tarde","cat":0},{"label":"anoche durante la tormenta","cat":0},{"label":"mañana temprano","cat":1},{"label":"el próximo año","cat":1}], "Pista: ayer y anoche indican pasado; mañana y el próximo año señalan futuro.", ["l4-tiempos-verbales"]),
        getTfActivity(21, "l21-ex-3", ["l4-tiempos-verbales"]),
      ];
    case 22:
      return [
        makeClassify("l22-ex-0", "Clasificá los verbos del relato según el tiempo pretérito:", ["Pretérito Perfecto Simple (Acción Puntual)", "Pretérito Imperfecto (Costumbre o Descripción)"], [{"label":"descubrió el yacimiento","cat":0},{"label":"llegó a la cima","cat":0},{"label":"zarpó a la madrugada","cat":0},{"label":"caminaba todos los días","cat":1},{"label":"hacía mucho frío","cat":1},{"label":"el viento soplaba sin cesar","cat":1}], "Pista: perfecto simple es puntual (-ó, -ió); imperfecto es descripción habitual (-aba, -ía).", ["l4-preteritos-narracion"]),
        makeClassify("l22-ex-1", "Clasificá las formas del pretérito imperfecto según su terminación:", ["Terminación -aba (1.ª Conjugación con B)", "Terminación -ía (2.ª y 3.ª Conjugación con Tilde)"], [{"label":"cantaba alegremente","cat":0},{"label":"caminaban por el sendero","cat":0},{"label":"soplaba con furia","cat":0},{"label":"temía a la oscuridad","cat":1},{"label":"vivían en la costa","cat":1},{"label":"abría la puerta","cat":1}], "Pista: verbos en -ar hacen -aba; verbos en -er y -ir hacen -ía con tilde.", ["l4-preteritos-narracion"]),
        makeOrder("l22-ex-2", "Ordená los verbos de esta narración para mantener coherencia de pretéritos:", ["La noche era oscura y fría en el refugio","El viento soplaba sobre las chapas del techo","De repente, se escuchó un fuerte trueno a lo lejos","El guía encendió la linterna y tranquilizó al grupo"], "Pista: descripciones en imperfecto (era, soplaba) y acciones puntuales en perfecto (escuchó, encendió).", ["l4-preteritos-narracion"]),
        getTfActivity(22, "l22-ex-3", ["l4-preteritos-narracion"]),
      ];
    case 23:
      return [
        makeClassify("l23-ex-0", "Clasificá los verbos en infinitivo según su conjugación:", ["1.ª Conjugación (-ar)", "2.ª Conjugación (-er)", "3.ª Conjugación (-ir)"], [{"label":"navegar","cat":0},{"label":"caminar","cat":0},{"label":"plantar","cat":0},{"label":"proteger","cat":1},{"label":"aprender","cat":1},{"label":"correr","cat":1},{"label":"vivir","cat":2},{"label":"descubrir","cat":2},{"label":"subir","cat":2}], "Pista: -ar es 1.ª conjugación; -er es 2.ª; -ir es 3.ª conjugación.", ["l4-infinitivo"]),
        makeOrder("l23-ex-1", "Ordená alfabéticamente estos infinitivos de una receta:", ["Amasar la harina con grasa tibia","Cocinar a fuego moderado","Estirar la masa sobre la mesada","Mezclar todos los ingredientes secos"], "Pista: orden alfabético por la primera letra: A, C, E, M.", ["l4-infinitivo"]),
        makeClassify("l23-ex-2", "Clasificá las palabras según sean infinitivos o formas conjugadas:", ["Formas de Infinitivo (No Personales)", "Formas Conjugadas (Personales)"], [{"label":"compartir","cat":0},{"label":"navegar","cat":0},{"label":"escribir","cat":0},{"label":"compartimos","cat":1},{"label":"navegó","cat":1},{"label":"escribís","cat":1}], "Pista: infinitivo termina en -ar/-er/-ir sin persona; conjugado lleva desinencia personal.", ["l4-infinitivo"]),
        getTfActivity(23, "l23-ex-3", ["l4-infinitivo"]),
      ];
    case 24:
      return [
        makeClassify("l24-ex-0", "Clasificá las parejas de palabras según su relación semántica:", ["Sinónimos (Significado Semejante)", "Antónimos (Significado Opuesto)"], [{"label":"gélido / helado","cat":0},{"label":"comenzar / empezar","cat":0},{"label":"sendero / camino","cat":0},{"label":"cumbre / cima","cat":0},{"label":"gélido / caluroso","cat":1},{"label":"áspero / suave","cat":1},{"label":"escaso / abundante","cat":1},{"label":"subir / bajar","cat":1}], "Pista: sinónimos significan lo mismo; antónimos significan lo contrario.", ["l4-sinonimos-antonimos"]),
        makeClassify("l24-ex-1", "Clasificá los pares de antónimos según el aspecto que describen:", ["Antónimos de Temperatura y Clima", "Antónimos de Textura y Superficie"], [{"label":"frío / cálido","cat":0},{"label":"ventoso / calmo","cat":0},{"label":"áspero / suave","cat":1},{"label":"rugoso / liso","cat":1}], "Pista: frío y ventoso describen el tiempo; áspero y rugoso describen la superficie.", ["l4-sinonimos-antonimos"]),
        makeOrder("l24-ex-2", "Ordená los adjetivos de MENOR a MAYOR intensidad de frío:", ["Fresco","Frío","Muy frío","Gélido o congelado"], "Pista: desde una brisa fresca hasta el hielo gélido.", ["l4-sinonimos-antonimos"]),
        getTfActivity(24, "l24-ex-3", ["l4-sinonimos-antonimos"]),
      ];
    case 25:
      return [
        makeClassify("l25-ex-0", "Clasificá las palabras según sean hiperónimos o hipónimos de 'árboles patagónicos':", ["Hiperónimo (Término General)", "Hipónimos (Variedades Específicas)"], [{"label":"árbol nativo","cat":0},{"label":"vegetación arbórea","cat":0},{"label":"lenga","cat":1},{"label":"ñire","cat":1},{"label":"coihue","cat":1},{"label":"guindo","cat":1}], "Pista: árbol es el término general; lenga, ñire y coihue son variedades específicas.", ["l4-hiperonimos-hiponimos"]),
        makeClassify("l25-ex-1", "Clasificá las palabras según el campo semántico al que pertenecen:", ["Campo Semántico de Alta Montaña", "Campo Semántico de Costa Marina"], [{"label":"glaciar","cat":0},{"label":"morrena","cat":0},{"label":"grieta de hielo","cat":0},{"label":"marea","cat":1},{"label":"acantilado","cat":1},{"label":"ría","cat":1}], "Pista: hielo y morrenas en la cordillera; mareas y acantilados en la costa marina.", ["l4-hiperonimos-hiponimos"]),
        makeOrder("l25-ex-2", "Ordená estos términos desde lo MÁS ESPECÍFICO hasta lo MÁS GENERAL:", ["Macá tobiano (especie particular)","Ave acuática (clase zoológica)","Fauna autóctona (categoría general de animales)","Ser vivo (reino biológico abarcador)"], "Pista: desde el individuo específico hasta el conjunto más amplio de los seres vivos.", ["l4-hiperonimos-hiponimos"]),
        getTfActivity(25, "l25-ex-3", ["l4-hiperonimos-hiponimos"]),
      ];
    case 26:
      return [
        makeClassify("l26-ex-0", "Clasificá las palabras según su familia léxica:", ["Familia de MAR", "Familia de TIERRA"], [{"label":"marino","cat":0},{"label":"marea","cat":0},{"label":"marinero","cat":0},{"label":"marítimo","cat":0},{"label":"terrestre","cat":1},{"label":"terreno","cat":1},{"label":"subterráneo","cat":1},{"label":"aterrizar","cat":1}], "Pista: marino y marea derivan de mar; terrestre y terreno derivan de tierra.", ["l4-familia-palabras"]),
        makeOrder("l26-ex-1", "Ordená la derivación morfológica desde la raíz hasta la palabra más compleja:", ["flor (palabra primitiva o raíz)","florería (con sufijo de comercio)","floristería (con sufijo compuesto)"], "Pista: de la raíz más simple a la palabra con sufijos derivados.", ["l4-familia-palabras"]),
        makeClassify("l26-ex-2", "Clasificá las partículas según sean prefijos o sufijos:", ["Prefijos (Se colocan ANTES de la raíz)", "Sufijos (Se colocan DESPUÉS de la raíz)"], [{"label":"des- (desarmar)","cat":0},{"label":"in- (injusto)","cat":0},{"label":"sub- (subterráneo)","cat":0},{"label":"-ero (panadero)","cat":1},{"label":"-ería (heladería)","cat":1},{"label":"-eza (limpieza)","cat":1}], "Pista: des-, in-, sub- van al inicio; -ero, -ería, -eza van al final.", ["l4-familia-palabras"]),
        getTfActivity(26, "l26-ex-3", ["l4-familia-palabras"]),
      ];
    case 27:
      return [
        makeClassify("l27-ex-0", "Clasificá las palabras según la ubicación de su sílaba tónica:", ["Palabras Agudas (Última sílaba)", "Palabras Graves (Penúltima sílaba)", "Palabras Esdrújulas (Antepenúltima sílaba)"], [{"label":"glaciar","cat":0},{"label":"estación","cat":0},{"label":"volcán","cat":0},{"label":"árbol","cat":1},{"label":"meseta","cat":1},{"label":"cóndor","cat":1},{"label":"pájaros","cat":2},{"label":"brújula","cat":2},{"label":"límite","cat":2}], "Pista: glaciar suena al final; árbol y meseta en el medio; pájaros y brújula al comienzo.", ["l4-acentuacion-silaba"]),
        makeOrder("l27-ex-1", "Ordená las sílabas de DERECHA a IZQUIERDA según su posición para acentuar:", ["Última sílaba (agudas)","Penúltima sílaba (graves)","Antepenúltima sílaba (esdrújulas)"], "Pista: para clasificar el acento se cuenta desde el final hacia el inicio.", ["l4-acentuacion-silaba"]),
        makeClassify("l27-ex-2", "Clasificá las palabras graves según lleven o no tilde ortográfica:", ["Palabras Graves CON Tilde", "Palabras Graves SIN Tilde"], [{"label":"árbol (termina en L)","cat":0},{"label":"cóndor (termina en R)","cat":0},{"label":"lápiz (termina en Z)","cat":0},{"label":"meseta (termina en vocal)","cat":1},{"label":"viento (termina en vocal)","cat":1},{"label":"montañas (termina en S)","cat":1}], "Pista: las graves llevan tilde cuando NO terminan en N, S o vocal.", ["l4-acentuacion-silaba"]),
        getTfActivity(27, "l27-ex-3", ["l4-acentuacion-silaba"]),
      ];
    case 28:
      return [
        makeClassify("l28-ex-0", "Clasificá las palabras según la regla de MB o NV:", ["Regla MB (M antes de B)", "Regla NV (N antes de V)"], [{"label":"tambor","cat":0},{"label":"cambio","cat":0},{"label":"alfombra","cat":0},{"label":"sombra","cat":0},{"label":"invierno","cat":1},{"label":"enviar","cat":1},{"label":"tranvía","cat":1},{"label":"convento","cat":1}], "Pista: tambor y cambio llevan mb; invierno y enviar llevan nv.", ["l4-ortografia-reglas"]),
        makeClassify("l28-ex-1", "Clasificá las palabras homófonas según su grafía correcta:", ["Palabras con Letra B", "Palabras con Letra V"], [{"label":"tubo (caño o cilindro hueco)","cat":0},{"label":"hierba (planta del campo)","cat":0},{"label":"tuvo (del verbo tener)","cat":1},{"label":"hierva (del verbo hervir)","cat":1}], "Pista: tubo hueco y hierba con b; tuvo de tener y hierva de hervir con v.", ["l4-ortografia-reglas"]),
        makeClassify("l28-ex-2", "Clasificá las palabras según lleven o no letra H inicial:", ["Palabras CON Letra H", "Palabras SIN Letra H"], [{"label":"hecho (del verbo hacer)","cat":0},{"label":"hielo (comienza con hie-)","cat":0},{"label":"huella (comienza con hue-)","cat":0},{"label":"echo (del verbo echar o tirar)","cat":1},{"label":"onda (ola del agua)","cat":1},{"label":"ola (del mar)","cat":1}], "Pista: hecho, hielo y huella llevan h; echo, onda y ola van sin h.", ["l4-ortografia-reglas"]),
        getTfActivity(28, "l28-ex-3", ["l4-ortografia-reglas"]),
      ];
    default:
      return [];
  }
}

// Compatibilidad hacia atrás: proxy que genera actividades frescas en cada acceso
export const EXTRA_LENGUA: Record<number, ActivitySpec[]> = new Proxy({}, {
  get: (_target, prop) => {
    const n = Number(prop);
    if (!Number.isNaN(n) && n >= 1 && n <= 28) {
      return getExtraLengua(n);
    }
    return undefined;
  },
});

export function buildLenguaActivities(world: WorldDef): ActivitySpec[] {
  const n = world.worldNumber ?? 1;
  const count = world.activityCount ?? 8;
  const bank = LENGUA_BANK[n] ?? LENGUA_BANK[1];
  // 6 preguntas de opción múltiple del banco
  const qActs = fromBank(bank, Math.max(4, count - 2), `l${n}`, world.skills ?? []);
  // 1 actividad de Verdadero/Falso con makeVF
  const tfAct = getTfActivity(n, `l${n}-tf`, world.skills ?? []);
  // 1 actividad interactiva adicional seleccionada al azar de un pool de 3 variantes
  const fullExtra = getExtraLengua(n);
  const interactivePool = fullExtra.filter(a => a.type !== "true-false");
  const chosenInteractive = pickOne(interactivePool);
  const extraAct = {
    ...chosenInteractive,
    id: `${chosenInteractive.id || `l${n}-ex-0`}`,
    skills: world.skills && world.skills.length > 0 ? world.skills : (chosenInteractive.skills ?? []),
  };
  return numbered(shuffle([...qActs, tfAct, extraAct]));
}
