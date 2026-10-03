// Preguntas de comprensión LECTORA de 3.º grado (los chicos leen el cuento).
// 10 preguntas por cuento, SIEMPRE 4 opciones.
// Distribución: 2 literal, 2 secuencia, 3 inferencial, 1 vocabulario, 1 estructura, 1 valoración.
// Incluye preguntas de causa-consecuencia, comparación entre personajes,
// evolución de personajes y «qué parte del texto muestra que...».
// La opción correcta es la de `answer` (el runner las mezcla al jugar).
import type { ComprehensionKind, CuentoOpt, CuentoQuestion } from "./tipos";

const q = (kind: ComprehensionKind) => (text: string, options: CuentoOpt[], answer: number, hint: string): CuentoQuestion => ({
  q: text,
  kind,
  options,
  answer,
  hint,
});

const L = q("literal");
const S = q("secuencia");
const I = q("inferencial");
const V = q("vocabulario");
const E = q("estructura");
const VAL = q("valoracion");

export const PREGUNTAS_G3: Record<string, CuentoQuestion[]> = {
  // 1. La tortuga gigante (cuento de Horacio Quiroga)
  "tortuga-gigante": [
    L(
      "¿Por qué razón médica debió mudarse el hombre desde Buenos Aires hacia el monte?",
      [
        ["🩺", "Porque padecía una grave enfermedad y el médico le indicó vivir al aire libre"],
        ["💼", "Porque consiguió un nuevo empleo como cuidador de animales silvestres"],
        ["🏕️", "Porque deseaba pasar unas vacaciones de descanso en la naturaleza"],
        ["🐢", "Porque buscaba ejemplares de fauna exótica para donar al zoológico"],
      ],
      0,
      "Pista: releé la indicación que le da el médico en la primera escena."
    ),
    L(
      "¿Qué alimentos y cuidados le proporcionó la tortuga al hombre cuando este cayó con fiebre?",
      [
        ["🍎", "Le arrimó agua fresca y frutas para hidratarlo y alimentarlo"],
        ["🍵", "Le preparó infusiones calientes con hierbas medicinales"],
        ["🩹", "Le curó las heridas con vendas que guardaba en el refugio"],
        ["🔥", "Le encendió una fogata con ramas secas para abrigarlo"],
      ],
      0,
      "Pista: mirá con qué atendió la tortuga al enfermo en la tercera escena."
    ),
    S(
      "¿Qué hecho determinante impulsó a la tortuga a cargar al hombre y caminar hacia la gran ciudad?",
      [
        ["💭", "Comprendió que si permanecían en el monte aislado, su amigo no lograría curarse y moriría"],
        ["🌧️", "Una feroz tormenta destruyó por completo el refugio de ramas en la selva"],
        ["🐯", "La presencia cercana de fieras peligrosas amenazaba la seguridad de ambos"],
        ["🩺", "El médico de Buenos Aires le envió una carta ordenándole trasladar al paciente"],
      ],
      0,
      "Pista: leé el pensamiento y la decisión de la tortuga en la cuarta escena."
    ),
    S(
      "¿Qué ocurrió inmediatamente después de que arribaron a Buenos Aires y el hombre recuperó la salud?",
      [
        ["🐢", "El hombre llevó a la tortuga al zoológico para que viviera protegida y la visitaba a diario"],
        ["🌲", "La tortuga emprendió sola el viaje de regreso a su hábitat natural en el monte"],
        ["🏠", "Ambos se quedaron a vivir juntos para siempre en una casa céntrica de la ciudad"],
        ["🩺", "El hombre abrió un consultorio médico para atender a animales silvestres"],
      ],
      0,
      "Pista: fijate en la resolución final y el destino de ambos en la escena 6."
    ),
    I(
      "¿Qué motivó a la tortuga gigante a realizar un sacrificio físico tan extremo por el hombre?",
      [
        ["❤️", "El profundo agradecimiento, ya que el hombre le había salvado la vida cuando estaba herida"],
        ["🏙️", "La curiosidad por conocer cómo eran las calles y edificios de Buenos Aires"],
        ["🐢", "El deseo de demostrar que las tortugas pueden caminar más rápido que otros animales"],
        ["🍎", "El temor a quedarse sola en el monte sin nadie que le consiguiera frutas"],
      ],
      0,
      "Pista: pensá en la correspondencia entre los cuidados de la segunda y de la quinta escena."
    ),
    I(
      "¿Qué pasaje del texto demuestra que la tortuga jamás se dio por vencida pese al agotamiento?",
      [
        ["💪", "Caminó días y noches por el monte y los caminos, muy cansada, sin rendirse"],
        ["💭", "Pensó que si se quedaban en el monte su amigo no iba a recuperarse"],
        ["🍎", "Lo cuidaba con esmero y le acercaba agua fresca y frutas silvestres"],
        ["🩹", "Aceptó ser curada con paciencia en el refugio cuando estaba lastimada"],
      ],
      0,
      "Pista: buscá las palabras exactas que describen su marcha en la escena 5."
    ),
    I(
      "¿Qué rasgo en común define las actitudes del hombre y de la tortuga a lo largo del relato?",
      [
        ["🤝", "La solidaridad desinteresada y el empeño en cuidar al otro en su momento de mayor fragilidad"],
        ["🩺", "El amplio conocimiento médico para sanar cualquier enfermedad"],
        ["🏙️", "La preferencia absoluta por la vida bulliciosa de las grandes urbes"],
        ["🌲", "El rechazo hacia el contacto con otras personas de la sociedad"],
      ],
      0,
      "Pista: compará cómo actuó el hombre en la escena 2 con cómo actuó la tortuga en las escenas 3 a 5."
    ),
    V(
      "En la escena 2 se menciona que el hombre la llevó a su «refugio». ¿Qué significa «refugio» en este contexto?",
      [
        ["🏠", "Una vivienda precaria o espacio acondicionado que brinda resguardo y amparo en la naturaleza"],
        ["🕳️", "Una cueva subterránea inundada donde hibernan los animales anfibios"],
        ["🏥", "Un hospital de campaña provisto de medicamentos y médicos de guardia"],
        ["🌳", "La copa frondosa de un árbol donde esconderse de los depredadores"],
      ],
      0,
      "Pista: pensá en el lugar donde el hombre habitaba de forma rústica en el monte."
    ),
    E(
      "¿Cómo está estructurado este relato y qué rol cumple quien narra la historia?",
      [
        ["📖", "Es un cuento narrado en tercera persona con inicio (curación de la tortuga), nudo (enfermedad del hombre) y desenlace (salvación)"],
        ["🗣️", "Es una fábula narrada en primera persona por la tortuga protagonista que relata sus recuerdos"],
        ["📰", "Es una crónica informativa con datos estadísticos sobre la fauna del litoral argentino"],
        ["📜", "Es una leyenda mitológica que busca explicar el origen del caparazón de las tortugas"],
      ],
      0,
      "Pista: fijate quién cuenta los hechos y cómo se encadenan inicio, conflicto y resolución."
    ),
    VAL(
      "¿Por qué puede afirmarse que esta historia ofrece una valiosa enseñanza sobre la verdadera amistad?",
      [
        ["✨", "Porque demuestra que el afecto sincero se manifiesta con actos de entrega mutua cuando el otro más lo necesita"],
        ["🐢", "Porque enseña que los animales silvestres siempre deben vivir encerrados en zoológicos"],
        ["🩺", "Porque aconseja no salir nunca de las ciudades para evitar contraer fiebres en el campo"],
        ["🏙️", "Porque comprueba que los viajes a pie son el medio más rápido para trasladar enfermos"],
      ],
      0,
      "Pista: fundamentá tu juicio en la reciprocidad de la ayuda entre los protagonistas."
    ),
  ],

  // 2. Cómo llegó la ballena al mar (leyenda tehuelche)
  "leyenda-ballena": [
    L(
      "¿Cómo se desplazaba la ballena Góos en los tiempos remotos según el relato tehuelche?",
      [
        ["🐋", "Caminaba por la tierra firme apoyándose en unas patitas cortas"],
        ["🌊", "Nadaba velozmente sumergida en las aguas profundas del océano"],
        ["🪽", "Se arrastraba como una serpiente entre los pajonales de la meseta"],
        ["🏔️", "Saltaba de roca en roca por los cerros escarpados de la costa"],
      ],
      0,
      "Pista: buscá en la primera escena cómo era el cuerpo de Góos al principio."
    ),
    L(
      "¿En qué pequeño insecto volador se transformó Elal para ingresar al estómago de Góos?",
      [
        ["🪰", "En un tábano, un bichito volador muy chiquito"],
        ["🐝", "En una abeja zumbadora de la estepa"],
        ["🦗", "En un grillo cantor de las cavernas"],
        ["🦟", "En un mosquito diminuto de la laguna"],
      ],
      0,
      "Pista: mirá qué estrategia utilizó Elal en la cuarta escena."
    ),
    S(
      "¿Qué procedimiento ingenioso utilizó Elal para lograr que la ballena abriera sus fauces y liberara a las víctimas?",
      [
        ["😄", "Le provocó tantas cosquillas por dentro que Góos abrió la boca desmesuradamente"],
        ["🔥", "Encendió una fogata dentro de su panza para obligarla a toser"],
        ["🏹", "Le clavó una flecha de pedernal en la lengua para hacerle daño"],
        ["💧", "Arrojó agua salada en su garganta para que se atragantara"],
      ],
      0,
      "Pista: leé cómo hizo reaccionar al gigante en la quinta escena."
    ),
    S(
      "¿Qué destino definitivo le dio el héroe Elal a la ballena Góos tras desalojar a los cautivos?",
      [
        ["🌊", "La empujó con fuerza hasta el mar y le ordenó que habitara allí para siempre"],
        ["🕳️", "La encerró en una caverna profunda en medio de la meseta"],
        ["🏔️", "La convirtió en una montaña rocosa cerca de la costa"],
        ["🏹", "La castigó quitándole para siempre la capacidad de alimentarse"],
      ],
      0,
      "Pista: revisá la acción final de Elal en la escena 6."
    ),
    I(
      "¿Por qué Elal consideró imperioso intervenir frente a la conducta de Góos?",
      [
        ["🏹", "Porque la voracidad insaciable de la ballena estaba haciendo desaparecer a personas y animales"],
        ["🌊", "Porque deseaba demostrar a los cazadores que el mar era más seguro que la tierra"],
        ["🐋", "Porque quería arrebatarle a Góos el dominio del cañadón costero"],
        ["🪰", "Porque buscaba probar sus poderes de transformación en insectos"],
      ],
      0,
      "Pista: fijate en la preocupación de la comunidad que se menciona en la tercera escena."
    ),
    I(
      "¿Qué pasaje del texto demuestra que los seres devorados no habían sufrido daños físicos irreparables?",
      [
        ["✨", "Adentro encontró a todos, asustados pero sanos, y salieron corriendo"],
        ["🐋", "Tenía tanta hambre que se tragaba todo lo que pasaba a su alrededor"],
        ["🪰", "Se convirtió en un tábano muy chiquito y se dejó tragar voluntariamente"],
        ["🌊", "Por eso, dicen, hoy las ballenas nadan en las aguas del mar patagónico"],
      ],
      0,
      "Pista: leé cómo halló Elal a las víctimas en la quinta escena."
    ),
    I(
      "¿En qué se diferencian el poder de Góos y el poder de Elal en la historia?",
      [
        ["⚖️", "Góos usaba su inmenso tamaño para devorar sin control, mientras Elal usaba su astucia para proteger a la comunidad"],
        ["🐋", "Góos era un ser sabio y pacífico, mientras Elal buscaba venganza violenta"],
        ["🌊", "Góos dominaba los secretos del océano y Elal desconocía las costas patagónicas"],
        ["🏹", "Ambos personajes poseían la misma fuerza física pero carecían de ingenio"],
      ],
      0,
      "Pista: contrastá las motivaciones destructivas de la ballena con el accionar generoso del héroe."
    ),
    V(
      "En la escena 2 se sitúa a Góos viviendo en un «cañadón». ¿Qué es un «cañadón»?",
      [
        ["🏜️", "Un valle o paso estrecho y profundo entre lomas o mesetas, característico del relieve patagónico"],
        ["🌊", "Una isla de arena en medio del océano abierto"],
        ["🌲", "Un bosque tupido de coníferas en alta montaña"],
        ["🏠", "Un puerto artificial donde amarran embarcaciones"],
      ],
      0,
      "Pista: pensá en el terreno costero y las hondonadas típicas de Santa Cruz."
    ),
    E(
      "¿Por qué este texto es considerado una leyenda mitológica y no un cuento realista ni una noticia?",
      [
        ["🫐", "Porque es un relato tradicional tehuelche que explica mediante elementos míticos el hábitat actual de la ballena"],
        ["📰", "Porque informa con rigor científico sobre las características anatómicas de los cetáceos"],
        ["🦊", "Porque incluye una moraleja final que aconseja a los niños cómo nadar en el mar"],
        ["📖", "Porque es una novela de aventuras basada en hechos históricos contemporáneos"],
      ],
      0,
      "Pista: pensá en qué fenómeno de la naturaleza patagónica fundamenta la narración."
    ),
    VAL(
      "¿Por qué la resolución que toma Elal con respecto a Góos resulta justa y armoniosa?",
      [
        ["💡", "Porque en vez de destruir a la criatura, le asignó un hábitat propicio donde vivir sin dañar a los habitantes terrestres"],
        ["🌊", "Porque obligó a todos los cazadores a abandonar sus tierras para pescar"],
        ["🐋", "Porque demostró que los animales gigantes deben someterse a la voluntad de los más débiles"],
        ["🪰", "Porque comprobó que las cosquillas son la mejor defensa en cualquier circunstancia"],
      ],
      0,
      "Pista: valorá la decisión de ordenar el mundo natural sin aniquilar al animal."
    ),
  ],

  // 3. La gallina de los huevos de oro (fábula de Esopo)
  "gallina-huevos-oro": [
    L(
      "¿Con qué frecuencia y en qué momento la gallina ponía su extraordinario huevo de oro?",
      [
        ["🥚", "Puntualmente cada mañana al comenzar el día"],
        ["🌙", "Únicamente en las noches de luna llena"],
        ["📅", "Una sola vez por semana los días de mercado"],
        ["🪙", "Cada vez que el granjero le daba maíz tostado"],
      ],
      0,
      "Pista: verificá la rutina de la gallina en la primera escena."
    ),
    L(
      "¿A qué lugar huyó la gallina para protegerse del maltrato y las exigencias del dueño?",
      [
        ["🌲", "Se escapó del gallinero y se marchó lejos, hacia el bosque"],
        ["🏘️", "Fue a refugiarse a la casa de los vecinos en el pueblo"],
        ["🏰", "Se ocultó en el establo de un castillo cercano"],
        ["🌾", "Se escondió bajo un trigal junto al camino vecinal"],
      ],
      0,
      "Pista: mirá el sitio adonde escapó en la quinta escena."
    ),
    S(
      "¿Qué transformaciones experimentó la vida material del granjero gracias a la venta inicial de los huevos?",
      [
        ["🏡", "Prosperaron poco a poco hasta tener una vivienda confortable y lo necesario para vivir"],
        ["👑", "Se convirtieron de la noche a la mañana en los gobernantes de toda la comarca"],
        ["🪙", "Acumularon tanto oro que compraron todas las granjas y campos vecinos"],
        ["⛵", "Abandonaron las tareas rurales para dedicarse a navegar en un barco propio"],
      ],
      0,
      "Pista: leé cómo mejoró su bienestar cotidiano en la escena 2."
    ),
    S(
      "¿Qué conductas invasivas comenzó a ejercer el granjero cuando su ambición se desbordó?",
      [
        ["😡", "Despertaba al animal de noche, lo hostigaba y no le permitía tener descanso"],
        ["🌾", "Le mezquinó la comida diaria para forzarla a poner más huevos"],
        ["🔒", "La encerró en una caja oscura sin ventilación ni luz"],
        ["🤝", "Contrató a cuidadores expertos para que la vigilaran día y noche"],
      ],
      0,
      "Pista: revisá los abusos cometidos por el hombre en la escena 4."
    ),
    I(
      "¿Cuál fue la causa directa de que cesara para siempre la obtención de riqueza en la granja?",
      [
        ["🏃", "La huida irremediable de la gallina al bosque a causa del agobio y el asedio constante"],
        ["🪙", "La caída del valor comercial del oro en las ferias del pueblo"],
        ["🦊", "El ataque sorpresivo de un depredador silvestre que ingresó al corral"],
        ["👵", "La decisión de la esposa de regalar el animal a una familia necesitada"],
      ],
      0,
      "Pista: relacioná el trato despiadado del granjero con la partida de la gallina en las escenas 5 y 6."
    ),
    I(
      "¿Cómo evolucionó la actitud del granjero desde el inicio de la historia hasta el desenlace?",
      [
        ["📉", "Pasó de disfrutar con tranquilidad de su bienestar a cegarse por la codicia y terminar en el lamento"],
        ["📈", "Comenzó siendo un hombre avaro y se convirtió al final en un modelo de generosidad comunitaria"],
        ["🤝", "Se mantuvo paciente y tolerante durante todo el relato sin alterar su conducta habitual"],
        ["🌲", "Descubrió que prefería la vida solitaria en los bosques antes que tener bienes materiales"],
      ],
      0,
      "Pista: observá el contraste entre su vida en la escena 2 y su amargo balance en la escena 6."
    ),
    I(
      "¿Qué expresión textual pone de manifiesto que el granjero era incapaz de valorar lo que ya poseía?",
      [
        ["🗣️", "¡Un huevo por día es muy poco! —se quejaba queriendo más y más"],
        ["🏡", "Poco a poco tuvieron una casa linda y todo lo que necesitaban"],
        ["🥚", "Cada mañana la gallina muy especial ponía un huevo de oro"],
        ["🌾", "Vendían cada huevo en el pueblo para sustentar su hogar"],
      ],
      0,
      "Pista: buscá la queja explícita del granjero en la tercera escena."
    ),
    V(
      "En el texto se califica la conducta de pretender «todo de golpe». ¿Qué significa la expresión «de golpe» en este contexto?",
      [
        ["⚡", "De forma inmediata y apresurada, sin respetar los tiempos naturales ni los procesos"],
        ["💥", "Recibiendo un impacto o golpe físico contra un objeto pesado"],
        ["🚪", "Cerrando con violencia una puerta o ventana de la casa"],
        ["🤕", "Provocando una lastimadura o moretón en el cuerpo"],
      ],
      0,
      "Pista: pensá en la impaciencia por conseguir ganancias instantáneas."
    ),
    E(
      "¿Qué elementos característicos sitúan a este relato dentro del género de las fábulas?",
      [
        ["🦊", "Su brevedad, el contraste de actitudes morales y una conclusión con enseñanza o moraleja explícita"],
        ["🫐", "La presencia de seres mitológicos que explican los accidentes geográficos de una región"],
        ["🎭", "La división en actos teatrales y la abundancia de canciones en rima"],
        ["📰", "El relato cronológico de noticias reales sucedidas en granjas agropecuarias"],
      ],
      0,
      "Pista: analizá la función didáctica y la estructura clásica de Esopo."
    ),
    VAL(
      "¿Por qué el mensaje de esta historia conserva plena actualidad en la vida de las personas?",
      [
        ["💡", "Porque advierte que la avaricia desmedida y la falta de gratitud conducen a arruinar las oportunidades valiosas"],
        ["🐔", "Porque enseña las técnicas de cuidado adecuadas para aumentar la producción de una granja"],
        ["🪙", "Porque demuestra que comerciar con metales preciosos es la única actividad redituable"],
        ["🌲", "Porque demuestra que todos los animales domésticos tarde o temprano huyen a los montes"],
      ],
      0,
      "Pista: reflexioná sobre las consecuencias del egoísmo y el exceso de ambición en los vínculos humanos."
    ),
  ],

  // 4. Las medias de los flamencos (cuento de Horacio Quiroga)
  "medias-flamencos": [
    L(
      "¿Quiénes fueron las anfitrionas que organizaron la gran fiesta a la orilla del río?",
      [
        ["🐍", "Las víboras, que invitaron a todos los animales de la selva"],
        ["🦩", "Los flamencos, que deseaban exhibir sus trajes de fiesta"],
        ["🦔", "El tatú, que preparó una serie de bromas para divertirse"],
        ["🐟", "Los peces, que convocaron a celebrar en la orilla del agua"],
      ],
      0,
      "Pista: verificá quiénes extendieron la invitación en la primera escena."
    ),
    L(
      "¿Qué apariencia original tenían las patas de los flamencos antes de que sucedieran los hechos?",
      [
        ["⚪", "Eran enteramente blancas"],
        ["🔴", "Eran de un color rojo brillante"],
        ["🖤", "Tenían rayas negras y amarillas"],
        ["🟤", "Eran marrones y escamosas"],
      ],
      0,
      "Pista: buscá la descripción del aspecto inicial en la segunda escena."
    ),
    S(
      "¿Qué ocurrió en el baile mientras los flamencos danzaban sin detenerse con sus llamativas medias?",
      [
        ["👀", "Las víboras de coral observaron con detenimiento y descubrieron que eran cueros de sus hermanas"],
        ["🎉", "Los otros animales los premiaron como los mejores bailarines de la noche"],
        ["🦔", "El tatú confesó públicamente ante todos que les había jugado una trampa"],
        ["🌧️", "Una lluvia torrencial disolvió la tintura de las supuestas medias rayadas"],
      ],
      0,
      "Pista: leé cómo se desencadena el conflicto en la cuarta escena."
    ),
    S(
      "¿Qué hicieron los flamencos de inmediato tras recibir el violento ataque en sus extremidades?",
      [
        ["🌊", "Corrieron desesperados a sumergir sus patas en las aguas frescas del río"],
        ["🦔", "Fueron a buscar al tatú bromista para reclamarle por su engaño"],
        ["🌲", "Se refugiaron en las copas de los árboles de la selva para escapar"],
        ["🩹", "Se vendaron las heridas con hojas de plantas medicinales"],
      ],
      0,
      "Pista: mirá adónde acudieron para calmar el dolor en la quinta escena."
    ),
    I(
      "¿Por qué la reacción de las víboras de coral fue tan furiosa e implacable contra los flamencos?",
      [
        ["😡", "Porque consideraron una ofensa atroz y una burla trágica que vistieran los cueros de víboras muertas"],
        ["💃", "Porque tenían envidia del éxito que los flamencos cosechaban en la pista de baile"],
        ["🐍", "Porque los flamencos les pisaron la cola mientras ejecutaban sus coreografías"],
        ["🌊", "Porque creían que los flamencos pretendían robarles el agua fresca del río"],
      ],
      0,
      "Pista: pensá en el significado de bailar llevando puestas las pieles de sus congéneres."
    ),
    I(
      "¿Qué pasaje del texto pone de manifiesto el afán de lucimiento y distinción de los flamencos?",
      [
        ["🦩", "Querían ir muy elegantes y salieron a buscar medias para deslumbrar en el baile"],
        ["⚪", "Sus patas eran blancas y se sentían conformes con su plumaje habitual"],
        ["🦔", "Aceptaron las prendas sin hacer preguntas por pereza de buscar otra vestimenta"],
        ["🌊", "Preferían quedarse en el río antes que asistir a reuniones sociales"],
      ],
      0,
      "Pista: leé los motivos por los que recorrieron la selva buscando medias en la escena 2."
    ),
    I(
      "¿Qué diferencia de conducta se observa entre la ingenuidad de los flamencos y la picardía del tatú?",
      [
        ["🎭", "Los flamencos actuaron con inocencia y vanidad ciega, mientras el tatú planeó una burla pesada conociendo el riesgo"],
        ["🦔", "El tatú intentaba ayudarlos con sincera bondad y los flamencos pretendían estafarlo"],
        ["🐍", "Ambos personajes estaban confabulados en secreto para arruinar el festejo de las víboras"],
        ["🌊", "Los flamencos conocían el origen de los cueros pero el tatú ignoraba de qué se trataba"],
      ],
      0,
      "Pista: analizá la intención maliciosa del dador frente a la credulidad de las aves."
    ),
    V(
      "En la escena 6 se explica que permanecen en el agua para calmar el «ardor». ¿Qué significa «ardor»?",
      [
        ["🔥", "Una intensa sensación de quemazón, irritación punzante o dolor en la piel"],
        ["❄️", "Un adormecimiento frío provocado por la baja temperatura del agua"],
        ["🩸", "El peso agobiante de los músculos fatigados tras horas de esfuerzo"],
        ["💧", "La picazón suave que provocan las algas y el fango ribereño"],
      ],
      0,
      "Pista: pensá en el efecto inflamatorio y doloroso del veneno de las víboras."
    ),
    E(
      "¿Qué particularidad distingue a este relato escrito por Horacio Quiroga?",
      [
        ["📖", "Es un cuento de autor de la selva misionera que recrea con fantasía poética un rasgo físico y biológico de los animales"],
        ["📜", "Es una fábula griega antigua destinada a enseñar pautas sobre confección de indumentaria"],
        ["🫐", "Es una leyenda sagrada de origen guaraní transmitida exclusivamente de manera oral"],
        ["📰", "Es un informe ornitológico que documenta los hábitos alimenticios de las aves acuáticas"],
      ],
      0,
      "Pista: recordá que forma parte de la obra consagrada 'Cuentos de la selva'."
    ),
    VAL(
      "¿Por qué puede afirmarse que la obsesión por aparentar lo que no se es condujo a los flamencos a su desgracia?",
      [
        ["✨", "Porque su afán por impresionar a los demás los llevó a usar atuendos engañosos sin medir las graves consecuencias"],
        ["🐍", "Porque acudir a un baile de gala es una actividad prohibida para las aves silvestres"],
        ["💃", "Porque debieron haber practicado danzas complejas antes de exhibirse en público"],
        ["⚪", "Porque el color blanco de sus extremidades era considerado un defecto insalvable"],
      ],
      0,
      "Pista: evaluá cómo su vanidad les impidió razonar sobre el peligro que implicaba usar pieles ajenas."
    ),
  ],

  // 5. La leyenda de las Cataratas del Iguazú (leyenda guaraní)
  "leyenda-iguazu": [
    L(
      "¿Quién era Mboi y qué rol desempeñaba según las creencias tradicionales guaraníes?",
      [
        ["🐍", "Una serpiente gigante venerada que habitaba en la selva y cuidaba las aguas del río Iguazú"],
        ["👑", "El cacique supremo de la aldea encargado de designar a las parejas del pueblo"],
        ["🌊", "Un espíritu benévolo que ayudaba a los pescadores guiando sus canoas"],
        ["🌈", "Una divinidad del cielo que pintaba los arcoíris sobre las copas de los árboles"],
      ],
      0,
      "Pista: revisá la presentación del personaje en la primera escena."
    ),
    L(
      "¿En qué elementos de la naturaleza quedaron transformados Naipí y Tarobá tras la furia de Mboi?",
      [
        ["⛰️", "Naipí en una gran roca en medio de las cataratas y Tarobá en una palmera en la orilla"],
        ["🌊", "Ambos en dos corrientes de agua que se unen en el fondo del cañón"],
        ["🐦", "Naipí en un hornero cantor y Tarobá en un árbol de yerba mate"],
        ["🛶", "En dos canoas de piedra que navegan eternamente en el río"],
      ],
      0,
      "Pista: buscá en la quinta escena la metamorfosis de los enamorados."
    ),
    S(
      "¿Qué osado plan ideó Tarobá al enterarse de que Naipí había sido elegida para servir a la serpiente?",
      [
        ["🛶", "Preparó en secreto una canoa para huir juntos navegando por las aguas del río"],
        ["🏹", "Organizó a los cazadores del pueblo para combatir cuerpo a cuerpo contra Mboi"],
        ["🔥", "Prendió fuego a la selva para distraer la vigilancia del monstruo fluvial"],
        ["👑", "Le suplicó al cacique que designara a otra joven de la comunidad"],
      ],
      0,
      "Pista: mirá qué preparativos ejecutó Tarobá en la tercera escena."
    ),
    S(
      "¿Qué cataclismo desató la serpiente Mboi al advertir la fuga de los amantes?",
      [
        ["💥", "Se metió en la tierra, se retorció con fuerza y partió el río en dos formando las cataratas"],
        ["🌧️", "Hizo caer una tormenta de rayos que incendió las orillas selváticas"],
        ["🐍", "Se tragó toda el agua del cauce dejando el lecho completamente seco"],
        ["🌪️", "Levantó un torbellino de viento que arrastró la canoa hacia la selva"],
      ],
      0,
      "Pista: leé cómo se originaron las caídas de agua en la escena 4."
    ),
    I(
      "¿Por qué los enamorados desafiaron una tradición tan arraigada y peligrosa?",
      [
        ["❤️", "Por el profundo amor que se tenían, el cual los impulsó a buscar un destino compartido en libertad"],
        ["🛶", "Porque Tarobá quería demostrar su destreza como timonel de canoas veloces"],
        ["🐍", "Porque desconocían el inmenso poder sobrenatural que tenía la serpiente Mboi"],
        ["🌊", "Porque deseaban descubrir nuevas tierras más allá de los confines de la selva"],
      ],
      0,
      "Pista: pensá en los sentimientos que unían a la pareja descritos en la tercera escena."
    ),
    I(
      "¿Qué interpretación simbólica le otorga la leyenda a la presencia constante del arcoíris sobre las aguas?",
      [
        ["🌈", "Representa un puente que une a Naipí y Tarobá, quienes se siguen queriendo"],
        ["☀️", "Simboliza el perdón que Mboi concedió finalmente a los pobladores de la región"],
        ["🌧️", "Indica el cese de las lluvias tropicales en la cuenca del río Misiones"],
        ["💧", "Muestra el reflejo de las escamas brillantes de la serpiente gigante oculta"],
      ],
      0,
      "Pista: leé la conmovedora explicación de la sexta escena."
    ),
    I(
      "¿Cómo contrasta el poder destructivo de Mboi con la fuerza del lazo entre Naipí y Tarobá?",
      [
        ["✨", "Mboi logró separar físicamente sus cuerpos partiendo el río, pero no pudo disolver el vínculo afectivo que aún los une"],
        ["🐍", "Mboi se arrepintió de su furia y decidió unirlos nuevamente en la orilla del río"],
        ["🛶", "Los enamorados lograron derrotar físicamente a la serpiente gracias a su canoa"],
        ["⛰️", "El amor de los jóvenes fue olvidado con el tiempo al quedar convertidos en roca y palmera"],
      ],
      0,
      "Pista: contrastá la inmovilidad física impuesta con el puente perpetuo del arcoíris."
    ),
    V(
      "En la escena 1 se afirma que los guaraníes «respetaban» mucho a Mboi. ¿Qué implicaba este respeto?",
      [
        ["🙏", "Una mezcla de reverencia profunda, temor a su poder y acatamiento de sus exigencias"],
        ["🗣️", "Un trato amistoso y cotidiano de conversación en las orillas del agua"],
        ["🏹", "El desafío militar permanente para desalojarla de sus dominios selváticos"],
        ["📜", "La firma de acuerdos escritos sobre los límites territoriales de la aldea"],
      ],
      0,
      "Pista: pensá en las obligaciones y ofrendas anuales consagradas a la serpiente."
    ),
    E(
      "¿Qué función cumple esta narración tradicional dentro del patrimonio cultural del litoral argentino?",
      [
        ["🫐", "Es una leyenda del pueblo guaraní que dota de sentido poético y espiritual a una maravilla natural"],
        ["📖", "Es un relato de ciencia ficción ambientado en los ríos tropicales del continente"],
        ["🦊", "Es una fábula moral que aconseja no emprender viajes fluviales en canoa"],
        ["📰", "Es una guía turística que detalla los circuitos peatonales de los parques nacionales"],
      ],
      0,
      "Pista: relacioná la tradición oral autóctona con el imponente paisaje de las cataratas misioneras."
    ),
    VAL(
      "¿Por qué el desenlace de esta leyenda resulta conmovedor para el lector?",
      [
        ["💡", "Porque transforma una separación trágica en un homenaje a la fidelidad eterna a través del paisaje"],
        ["🌊", "Porque celebra el triunfo indiscutido de las fuerzas destructivas del río"],
        ["⛰️", "Porque convence de que las rocas y palmeras tienen capacidad de desplazamiento"],
        ["🛶", "Porque demuestra que todas las fugas en canoa concluyen en naufragios inevitables"],
      ],
      0,
      "Pista: fundamentá tu apreciación en cómo el relato resignifica el arcoíris como lazo de afecto."
    ),
  ],

  // 6. El ratón de campo y el ratón de ciudad (fábula de Esopo)
  "raton-campo-ciudad": [
    L(
      "¿Qué alimentos integraban el almuerzo que el anfitrión campestre le convidó a su pariente urbano?",
      [
        ["🌾", "Granos de trigo, raíces y agua fresca"],
        ["🧀", "Porciones abundantes de quesos curados, panes y tortas"],
        ["🍎", "Manzanas asadas y pasteles horneados en la granja"],
        ["🌽", "Choclos hervidos y semillas de girasol tostadas"],
      ],
      0,
      "Pista: leé el menú modesto detallado en la segunda escena."
    ),
    L(
      "¿Qué amenaza irrumpió en primer lugar cuando ambos ratones se disponían a degustar el banquete citadino?",
      [
        ["🐱", "Un gato que apareció de repente y los obligó a esconderse"],
        ["🧹", "Un grupo de personas que blandía escobas contra el piso"],
        ["🐕", "Un perro guardián que derribó la mesa de un salto"],
        ["🪤", "Una trampa mecánica colocada junto a las tortas"],
      ],
      0,
      "Pista: buscá qué depredador provocó la primera huida en la cuarta escena."
    ),
    S(
      "¿Qué contratiempo sobrevino de inmediato apenas intentaron salir de su escondite para retomar la comida?",
      [
        ["🧹", "Entraron unas personas haciendo ruido con escobas y tuvieron que escapar con miedo"],
        ["🐱", "El gato derribó la puerta del refugio donde se hallaban agazapados"],
        ["🍽️", "Los dueños de la casa retiraron todos los platos de la mesa y la dejaron vacía"],
        ["🚪", "Se apagaron las luces de la sala y quedaron en tinieblas"],
      ],
      0,
      "Pista: revisá la segunda interrupción que sufrieron en la escena 5."
    ),
    S(
      "¿Qué determinación irrevocable tomó el ratón campesino tras constatar la sucesión de peligros?",
      [
        ["🌾", "Agradeció la hospitalidad de su primo y volvió feliz a su campo tranquilo"],
        ["🐭", "Decidió mudarse a la ciudad para acostumbrarse a convivir con el gato"],
        ["🧀", "Intentó cargar un trozo de queso para llevarlo a su cueva"],
        ["🤝", "Le propuso al primo construir un refugio secreto debajo del piso de la gran casa"],
      ],
      0,
      "Pista: mirá las palabras y la partida del protagonista en la escena 6."
    ),
    I(
      "¿Qué razón fundamental impulsó al ratón de campo a rechazar las comodidades de la ciudad?",
      [
        ["😌", "La convicción de que la paz y la tranquilidad valen más que cualquier banquete lleno de sustos"],
        ["😋", "El desagrado por el sabor de los panes y las tortas refinadas"],
        ["🌾", "La preocupación por el estado en que habían quedado sus sembrados de trigo"],
        ["🏃", "El cansancio por haber tenido que correr distancias largas dentro de la casa"],
      ],
      0,
      "Pista: meditá sobre la sabia reflexión que resume su postura en la sexta escena."
    ),
    I(
      "¿Qué frase textual sintetiza con claridad la contraposición entre ambos estilos de vida?",
      [
        ["🗣️", "Prefiero mi comida simple y tranquila a tus tortas con sustos"],
        ["🧀", "¡Qué comida tan simple! Vení a mi casa y vas a ver"],
        ["🍽️", "¡Cuánta comida! —dijo admirado el ratón de campo"],
        ["🌾", "Un ratón de campo vivía tranquilo en una cueva junto al trigal"],
      ],
      0,
      "Pista: identificá la frase de despedida en la última escena."
    ),
    I(
      "¿Qué contraste de valores encarnan el ratón de ciudad y el ratón de campo en la narración?",
      [
        ["⚖️", "El de ciudad prioriza el lujo aceptando el miedo continuo, mientras el de campo privilegia la paz y la libertad"],
        ["🧀", "El de campo es generoso y solidario, mientras el de ciudad carece de modales y no sabe recibir visitas"],
        ["🐱", "El de ciudad es temeroso y cobarde, mientras el de campo sabe defenderse con astucia frente a los gatos"],
        ["🌾", "Ambos personajes persiguen idénticos objetivos de vida pero en escenarios geográficos diversos"],
      ],
      0,
      "Pista: compará lo que cada uno considera indispensable para ser dichoso."
    ),
    V(
      "En la escena 1 se sitúa la morada del ratón de campo junto al «trigal». ¿Qué es un «trigal»?",
      [
        ["🌾", "Un terreno o campo sembrado de trigo"],
        ["🪵", "Un montón de leña apilada en el bosque"],
        ["🥖", "Una panadería donde hornean panes"],
        ["🏡", "Un corral cerrado para animales del campo"],
      ],
      0,
      "Pista: pensá en las espigas de las que se alimentaba el ratón campestre."
    ),
    E(
      "¿Cuál es el propósito discursivo esencial de esta obra atribuida a Esopo?",
      [
        ["🦊", "Transmitir una lección ética universal confrontando actitudes para que el lector reflexione sobre sus elecciones"],
        ["🫐", "Narrar una leyenda folclórica sobre el surgimiento de las diferentes especies de roedores"],
        ["📖", "Entretener mediante una novela de intriga policial ambientada en recintos residenciales"],
        ["📰", "Publicar un reportaje comparativo sobre los costos de alimentación en el campo y la metrópolis"],
      ],
      0,
      "Pista: analizá la función moralizadora clásica del género fabulístico."
    ),
    VAL(
      "¿Por qué la elección que realiza el ratón de campo resulta sumamente acertada y sensata?",
      [
        ["💡", "Porque ningún placer suntuoso compensa vivir bajo la angustia permanente de perder la propia vida"],
        ["🌾", "Porque demuestra que los productos agrícolas crudos son más nutritivos que las tortas horneadas"],
        ["🐱", "Porque comprueba que los animales campestres no están capacitados para eludir las trampas de la ciudad"],
        ["🏃", "Porque escapar de los felinos es un ejercicio agotador que perjudica la salud de los roedores"],
      ],
      0,
      "Pista: fundamentá tu juicio en la primacía de la tranquilidad y la preservación de la vida por sobre la opulencia."
    ),
  ],
};
