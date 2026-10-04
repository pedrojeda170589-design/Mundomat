// Preguntas de comprensión LECTORA de 3.º grado (los chicos leen el cuento).
// 10 preguntas por cuento, SIEMPRE 4 opciones de longitud pareja.
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
      "¿Por qué el hombre tuvo que irse a vivir al monte?",
      [
        ["🩺", "Porque estaba enfermo y necesitaba aire libre"],
        ["🏹", "Porque el médico le recomendó cazar animales"],
        ["🚣", "Porque quería viajar en canoa por los ríos"],
        ["💼", "Porque buscaba un nuevo trabajo en la selva"],
      ],
      0,
      "Pista: releé lo que le aconseja el médico en la primera escena."
    ),
    L(
      "¿Qué hizo el hombre al encontrar a la tortuga lastimada?",
      [
        ["🩹", "La llevó a su refugio y la curó con paciencia"],
        ["🌲", "La dejó sola entre los árboles altos del monte"],
        ["🏃", "Fue corriendo a buscar al médico del pueblo"],
        ["🏙️", "La llevó al zoológico de la gran ciudad"],
      ],
      0,
      "Pista: mirá cómo atendió el hombre a la tortuga en la escena 2."
    ),
    S(
      "¿Qué ocurrió después de que el hombre curó a la tortuga?",
      [
        ["🤒", "El hombre volvió a enfermarse con mucha fiebre"],
        ["🏹", "Llegaron otros cazadores al refugio del monte"],
        ["🌊", "La tortuga se fue a nadar sola por el río hondo"],
        ["🚂", "El hombre volvió a trabajar a Buenos Aires"],
      ],
      0,
      "Pista: leé qué problema surge en la escena 3."
    ),
    S(
      "¿Qué decisión tomó la tortuga al ver a su amigo muy grave?",
      [
        ["🐢", "Cargarlo en su caparazón para llevarlo a curar"],
        ["⛺", "Esperar en el refugio a que la fiebre bajara"],
        ["🍎", "Ir a buscar frutas y agua fresca a la laguna"],
        ["🐾", "Pedirle ayuda a los otros animales del monte"],
      ],
      0,
      "Pista: fijate en el plan de la tortuga en la escena 4."
    ),
    I(
      "¿Por qué la tortuga se esforzó tanto por salvar al hombre?",
      [
        ["❤️", "Estaba agradecida porque él le había salvado la vida"],
        ["🚗", "Tenía curiosidad por conocer los autos de la ciudad"],
        ["🌲", "Tenía miedo de quedarse sola y sin comida en el monte"],
        ["🎁", "El médico le había prometido una hermosa recompensa"],
      ],
      0,
      "Pista: pensá en lo que el hombre había hecho por ella antes."
    ),
    I(
      "¿Qué parte del texto muestra que la tortuga no se rindió?",
      [
        ["💪", "Caminó días y noches por los caminos, sin rendirse"],
        ["🩺", "Un hombre que vivía en Buenos Aires estaba enfermo"],
        ["🩹", "La llevó a su refugio y la curó con mucha paciencia"],
        ["🐢", "La llevó al zoológico, donde vivió muy tranquila"],
      ],
      0,
      "Pista: buscá la frase sobre su caminata en la escena 5."
    ),
    I(
      "¿En qué se parecen las actitudes del hombre y de la tortuga?",
      [
        ["🤝", "Los dos cuidaron al otro cuando estuvo en peligro"],
        ["🏙️", "Los dos preferían vivir en medio de la gran ciudad"],
        ["🌿", "Los dos sabían preparar medicinas con las plantas"],
        ["🚂", "Los dos querían viajar en tren a Buenos Aires"],
      ],
      0,
      "Pista: pensá en cómo actúa cada uno frente a la enfermedad del otro."
    ),
    V(
      "En el cuento, ¿qué significa la palabra «refugio»?",
      [
        ["🏠", "Un lugar seguro donde protegerse y descansar"],
        ["🛤️", "Un camino de tierra largo entre los árboles"],
        ["🚪", "Una jaula de hierro con rejas muy pesadas"],
        ["💧", "Una laguna grande con agua fresca y limpia"],
      ],
      0,
      "Pista: es el lugar techado donde el hombre llevó a la tortuga."
    ),
    E(
      "¿Cuál es el conflicto o problema principal de esta historia?",
      [
        ["⚡", "El hombre enferma y la tortuga debe cargarlo para salvarlo"],
        ["🏹", "Los cazadores persiguen a los animales silvestres del monte"],
        ["🩺", "El médico de Buenos Aires no quiere atender a los enfermos"],
        ["🍎", "La tortuga no encuentra agua fresca ni frutas en el bosque"],
      ],
      0,
      "Pista: pensá en el gran desafío que enfrentan en el camino."
    ),
    VAL(
      "¿Qué enseñanza sobre la amistad nos deja este cuento?",
      [
        ["💛", "Quien ayuda de corazón recibe ayuda cuando la necesita"],
        ["🌲", "Es mejor no acercarse a los animales que viven en el monte"],
        ["🏙️", "Conviene vivir siempre en la ciudad antes que en el campo"],
        ["🐾", "Los animales salvajes pueden curar cualquier enfermedad"],
      ],
      0,
      "Pista: mirá cómo la bondad del hombre volvió hacia él."
    ),
  ],

  // 2. Cómo llegó la ballena al mar (leyenda tehuelche)
  "leyenda-ballena": [
    L(
      "Según los tehuelches, ¿cómo era Góos en el pasado?",
      [
        ["🐋", "Una ballena enorme con patitas que caminaba en tierra"],
        ["🦅", "Un pájaro gigante que volaba sobre los cerros altos"],
        ["🐟", "Un pez dorado que nadaba rápido en los ríos patagónicos"],
        ["🦊", "Un zorro astuto que cazaba de noche en los cañadones"],
      ],
      0,
      "Pista: leé cómo describen a Góos en la escena 1."
    ),
    L(
      "¿Dónde vivía Góos y qué hacía con todo lo que pasaba?",
      [
        ["🏜️", "Vivía en un cañadón y se tragaba animales y cazadores"],
        ["🕳️", "Vivía en una cueva honda y dormía durante todo el día"],
        ["🏖️", "Vivía en la playa marina y ayudaba a los pescadores"],
        ["⛰️", "Vivía arriba de un cerro y no dejaba soplar al viento"],
      ],
      0,
      "Pista: mirá qué pasaba con el hambre de Góos en la escena 2."
    ),
    S(
      "¿Cómo logró entrar Elal en la panza de la ballena?",
      [
        ["🪰", "Se convirtió en un tábano chiquito y se dejó tragar"],
        ["🌙", "Esperó que Góos se durmiera para abrirle la boca"],
        ["⛏️", "Cavó un túnel largo por debajo de la tierra seca"],
        ["🪜", "Armó una escalera con ramas de lenga y piedras"],
      ],
      0,
      "Pista: fijate en qué insecto se convirtió Elal en la escena 4."
    ),
    S(
      "¿Qué hizo Elal una vez que todos salieron de la ballena?",
      [
        ["🌊", "La empujó hasta el mar y le dijo que viviera allí"],
        ["🏔️", "La llevó a caminar hacia la cordillera con nieve"],
        ["🧱", "Construyó un corral de piedras alrededor de Góos"],
        ["🏃", "Se convirtió en un guanaco veloz y escapó al monte"],
      ],
      0,
      "Pista: leé el final de la leyenda en la escena 6."
    ),
    I(
      "¿Por qué Elal se transformó en un insecto tan pequeño?",
      [
        ["💡", "Para entrar sin que la ballena notara su presencia"],
        ["✨", "Porque los tábanos podían volar más alto que nadie"],
        ["🏹", "Porque tenía miedo de que los cazadores lo atraparan"],
        ["💧", "Porque los insectos sabían nadar mejor en el cañadón"],
      ],
      0,
      "Pista: pensá en el plan secreto de Elal para que se lo tragara."
    ),
    I(
      "¿Qué parte del texto explica cómo salieron los atrapados?",
      [
        ["😄", "Le hizo tantas cosquillas por dentro que abrió la boca"],
        ["🍽️", "Tenía tanta hambre que se tragaba todo lo que pasaba"],
        ["🫂", "Adentro encontró a todos, asustados pero sanos y salvos"],
        ["🌊", "Elal empujó a Góos hasta el mar para que viviera allí"],
      ],
      0,
      "Pista: buscá la acción graciosa de Elal en la escena 5."
    ),
    I(
      "¿En qué cambió la vida de Góos al final de la leyenda?",
      [
        ["🐋", "Pasó de comer animales en tierra a nadar en el mar"],
        ["🦅", "Aprendió a volar sobre los cerros junto a los cóndores"],
        ["🤝", "Se hizo amiga inseparable de los cazadores de la costa"],
        ["🕳️", "Se quedó a vivir para siempre escondida en una cueva"],
      ],
      0,
      "Pista: compará la primera escena con la última."
    ),
    V(
      "En esta leyenda tehuelche, ¿qué es un «cañadón»?",
      [
        ["⛰️", "Un paso hondo y estrecho entre cerros o mesetas"],
        ["🌳", "Un árbol muy alto que crece cerca de los ríos"],
        ["⛵", "Un barco grande que usan los pescadores del sur"],
        ["🦩", "Una laguna de agua salada con flamencos rosados"],
      ],
      0,
      "Pista: es el lugar de la tierra patagónica donde vivía Góos."
    ),
    E(
      "¿Por qué este relato es una leyenda y no una noticia?",
      [
        ["📜", "Porque explica el origen del mundo con elementos mágicos"],
        ["📰", "Porque cuenta hechos reales que ocurrieron ayer en el pueblo"],
        ["📋", "Porque da instrucciones numeradas para realizar un trabajo"],
        ["🎵", "Porque tiene rimas cortas para cantar en una fiesta patria"],
      ],
      0,
      "Pista: las leyendas son relatos tradicionales sobre la naturaleza."
    ),
    VAL(
      "¿Por qué Elal es un personaje valioso para los tehuelches?",
      [
        ["⭐", "Usó su ingenio y valentía para proteger a los demás"],
        ["🏹", "Cazó a todos los animales que habitaban en la estepa"],
        ["🪙", "Encontró un tesoro de oro escondido bajo las piedras"],
        ["🏠", "Construyó casas de ladrillo para pasar el invierno"],
      ],
      0,
      "Pista: pensá en cómo ayudó a las personas y animales en peligro."
    ),
  ],

  // 3. La gallina de los huevos de oro (fábula de Esopo)
  "gallina-huevos-oro": [
    L(
      "¿Qué cualidad maravillosa tenía la gallina del granjero?",
      [
        ["🥚", "Cada mañana ponía un huevo brillante de oro"],
        ["🌅", "Cantaba melodías hermosas al salir el sol"],
        ["🪶", "Tenía plumas suaves de muchos colores vivos"],
        ["⛰️", "Volaba alto por encima de los cerros verdes"],
      ],
      0,
      "Pista: leé lo que pasaba cada mañana en la escena 1."
    ),
    L(
      "¿Qué lograron el granjero y su esposa con los primeros huevos?",
      [
        ["🏡", "Tuvieron una casa linda y todo lo que necesitaban"],
        ["🐄", "Compraron cien vacas lecheras en la feria grande"],
        ["⛵", "Viajaron en barco para conocer ciudades lejanas"],
        ["🏬", "Abrieron un negocio de ropa fina en el pueblo"],
      ],
      0,
      "Pista: mirá cómo vivían gracias a los huevos en la escena 2."
    ),
    S(
      "¿Qué hizo el granjero al pensar que un huevo por día era poco?",
      [
        ["😠", "La apuraba, la despertaba de noche y no la dejaba descansar"],
        ["🌾", "Le preparó un nido más tibio con paja fresca y maíz dorado"],
        ["🛒", "Fue a la feria del pueblo a comprar comida especial para aves"],
        ["🎉", "Llamó a sus vecinos para festejar la buena suerte de su granja"],
      ],
      0,
      "Pista: revisá la mala actitud del granjero en la escena 4."
    ),
    S(
      "¿Qué ocurrió inmediatamente después del maltrato del granjero?",
      [
        ["🌲", "La gallina se escapó asustada y se fue al bosque"],
        ["🪙", "La gallina puso diez huevos dorados en una tarde"],
        ["🏙️", "El granjero vendió su casa y se mudó a la ciudad"],
        ["🍲", "La esposa del granjero preparó una rica comida"],
      ],
      0,
      "Pista: leé la reacción del animal en la escena 5."
    ),
    I(
      "¿Por qué el granjero actuó con tanta impaciencia y enojo?",
      [
        ["💰", "Porque se volvió ambicioso y quería riquezas de golpe"],
        ["🦊", "Porque tenía miedo de que los zorros entraran al corral"],
        ["⏰", "Porque la gallina hacía mucho ruido durante la madrugada"],
        ["📜", "Porque necesitaba pagar deudas urgentes en el mercado"],
      ],
      0,
      "Pista: pensá en su queja de querer más y más en la escena 3."
    ),
    I(
      "¿Qué parte del texto resume la lección que recibió el hombre?",
      [
        ["💡", "Por querer todo de golpe, había perdido lo que tenía"],
        ["🏡", "Vendían cada huevo y tuvieron todo lo que necesitaban"],
        ["🐔", "Un granjero y su esposa tenían una gallina especial"],
        ["🌲", "La gallina, cansada y asustada, se fue hacia el bosque"],
      ],
      0,
      "Pista: leé la última frase de la fábula en la escena 6."
    ),
    I(
      "¿Cómo cambia la situación del granjero a lo largo de la fábula?",
      [
        ["📉", "Pasa de tener una vida próspera a quedarse sin nada por codicia"],
        ["👑", "Pasa de ser muy pobre a convertirse en el rey más rico del país"],
        ["🌾", "Aprende a cuidar animales y abre una granja modelo en el pueblo"],
        ["🎁", "Consigue muchas gallinas mágicas y reparte su riqueza a todos"],
      ],
      0,
      "Pista: compará su bienestar al inicio con su pérdida final."
    ),
    V(
      "En el texto, ¿qué significa la palabra «gallinero»?",
      [
        ["🏠", "El lugar cerrado donde duermen y se cuidan las gallinas"],
        ["🧺", "Un canasto tejido donde se guardan las frutas maduras"],
        ["⚙️", "Una máquina antigua que sirve para moler granos de trigo"],
        ["🛤️", "Un camino de tierra que une la granja con el bosque alto"],
      ],
      0,
      "Pista: es el sitio de donde se escapó la gallina."
    ),
    E(
      "¿Qué característica demuestra que este relato es una fábula?",
      [
        ["📖", "Deja una enseñanza moral clara sobre la conducta humana"],
        ["🔬", "Describe con precisión científica la vida de las aves"],
        ["🌋", "Explica el origen mágico de las montañas y los volcanes"],
        ["📅", "Relata un hecho histórico con fechas y nombres reales"],
      ],
      0,
      "Pista: las fábulas son historias breves con moraleja."
    ),
    VAL(
      "¿Qué consejo le darías al granjero para evitar su pérdida?",
      [
        ["❤️", "Agradecer lo que recibía cada día y cuidar a su gallina"],
        ["⏰", "Despertar a la gallina más temprano para que ponga más"],
        ["🚢", "Vender la granja para dedicarse al comercio en el puerto"],
        ["🪺", "Buscar huevos de oro en los nidos de los pájaros libres"],
      ],
      0,
      "Pista: pensá en la importancia de cuidar lo que uno ya tiene."
    ),
  ],

  // 4. Las medias de los flamencos (cuento de Horacio Quiroga)
  "medias-flamencos": [
    L(
      "¿Quiénes organizaron el gran baile a la orilla del río?",
      [
        ["🐍", "Las víboras, que invitaron a todos los animales"],
        ["🦩", "Los flamencos, que querían lucir patas blancas"],
        ["🐟", "Los peces plateados que saltaban sobre el agua"],
        ["🦔", "El tatú pícaro que fabricaba ropa de fiesta"],
      ],
      0,
      "Pista: leé quiénes hicieron la fiesta en la escena 1."
    ),
    L(
      "¿De qué color eran las patas de los flamencos al principio?",
      [
        ["⚪", "Eran blancas y querían adornarlas para la fiesta"],
        ["🔴", "Eran coloradas y les dolían mucho por el ardor"],
        ["🟡", "Eran amarillas como las de los patos del bañado"],
        ["⚫", "Eran negras como las plumas de los cuervos viejos"],
      ],
      0,
      "Pista: fijate cómo eran sus patas en la escena 2."
    ),
    S(
      "¿Quién les entregó a los flamencos las supuestas medias?",
      [
        ["🦔", "Un tatú bromista que les dio cueros de víboras"],
        ["🦉", "Una lechuza que tenía un almacén en el monte"],
        ["🐸", "Un sapo que cosía trajes de baile en la orilla"],
        ["🐍", "Las mismas víboras de coral antes del festejo"],
      ],
      0,
      "Pista: mirá qué animal los engañó en la escena 3."
    ),
    S(
      "¿Qué hicieron las víboras al descubrir el engaño de las medias?",
      [
        ["😡", "Se enojaron mucho y les mordieron las patas con furia"],
        ["🎉", "Se pusieron a reír y felicitaron a las aves por bailar"],
        ["🌳", "Fueron a esconderse en los árboles más altos del monte"],
        ["🪡", "Le pidieron al tatú que les confeccione trajes iguales"],
      ],
      0,
      "Pista: leé la reacción furiosa de las víboras en la escena 5."
    ),
    I(
      "¿Por qué los flamencos aceptaron las medias sin sospechar nada?",
      [
        ["✨", "Eran vanidosos y solo pensaban en verse elegantes"],
        ["🏆", "Sabían que las víboras iban a premiar el mejor disfraz"],
        ["🧶", "El tatú les aseguró que las medias eran de lana tejida"],
        ["❄️", "Tenían mucho frío en las patas y querían abrigarse"],
      ],
      0,
      "Pista: pensá en sus ganas desesperadas de lucirse ante todos."
    ),
    I(
      "¿Qué parte del texto muestra la consecuencia que sufren hoy?",
      [
        ["💧", "Pasan el día en el agua para que se les calme el ardor"],
        ["🎶", "Una vez las víboras dieron un gran baile en el río"],
        ["💃", "Bailaron toda la noche con sus medias de tres colores"],
        ["🦩", "Los flamencos tenían las patas blancas y salieron a buscar"],
      ],
      0,
      "Pista: mirá qué hacen parados en el agua en la escena 6."
    ),
    I(
      "¿En qué se diferencia el inicio del final para los flamencos?",
      [
        ["🩹", "Al inicio tenían patas blancas y al final sufren ardor"],
        ["🐟", "Al inicio volaban alto y al final nadan como los peces"],
        ["🎉", "Al inicio eran tímidos y al final organizan los bailes"],
        ["🪶", "Al inicio no tenían plumas y al final consiguen alas"],
      ],
      0,
      "Pista: compará el color y la salud de sus patas."
    ),
    V(
      "En el cuento, ¿qué significa la palabra «ardor»?",
      [
        ["🔥", "Una sensación de calor o quemazón que molesta y duele"],
        ["😄", "Un cosquilleo suave y agradable en la punta de los dedos"],
        ["❄️", "Un frío intenso que congela el agua fresca de la laguna"],
        ["😴", "Un cansancio pesado en las alas después de volar lejos"],
      ],
      0,
      "Pista: es lo que sienten en las patas mordidas por las víboras."
    ),
    E(
      "¿Qué momento marca el desenlace o resolución de la historia?",
      [
        ["🌊", "Cuando los flamencos corren a meter sus patas al agua"],
        ["💌", "Cuando los animales reciben la invitación de las víboras"],
        ["🦔", "Cuando el tatú se burla de ellos detrás de los arbustos"],
        ["👔", "Cuando los flamencos eligen qué ropa ponerse para bailar"],
      ],
      0,
      "Pista: es la escena final que explica cómo viven hoy."
    ),
    VAL(
      "¿Qué nos enseña este cuento sobre la vanidad desmedida?",
      [
        ["💡", "Querer impresionar sin medir consecuencias trae problemas"],
        ["👗", "Es buena idea usar ropa de otros sin pedirles permiso antes"],
        ["🌙", "Los animales con plumas no deben asistir a bailes de noche"],
        ["😂", "Las bromas pesadas siempre terminan en fiestas divertidas"],
      ],
      0,
      "Pista: pensá en por qué los flamencos terminaron lastimados."
    ),
  ],

  // 5. La leyenda de las Cataratas del Iguazú (leyenda guaraní)
  "leyenda-iguazu": [
    L(
      "¿Quién era Mboi en la selva misionera?",
      [
        ["🐍", "Una serpiente gigante que cuidaba las aguas del río"],
        ["👑", "Un cacique anciano que gobernaba una aldea tranquila"],
        ["🚣", "Un guerrero joven que sabía remar muy rápido en canoa"],
        ["🦜", "Un pájaro de plumas azules que cantaba sobre la roca"],
      ],
      0,
      "Pista: mirá a quién cuidaba y respetaba el pueblo en la escena 1."
    ),
    L(
      "¿Qué hicieron Naipí y Tarobá para evitar la separación?",
      [
        ["🚣", "Escaparon juntos en una canoa navegando por el río"],
        ["⛰️", "Se escondieron en una cueva profunda de la montaña"],
        ["🤝", "Fueron a pedirle ayuda a las tribus vecinas del sur"],
        ["🌺", "Le llevaron regalos de frutas y flores a la serpiente"],
      ],
      0,
      "Pista: leé cómo huyeron juntos en la escena 3."
    ),
    S(
      "¿Cómo reaccionó Mboi cuando descubrió la fuga de los jóvenes?",
      [
        ["🌊", "Se metió en la tierra, se retorció y partió el río en dos"],
        ["🛶", "Nadó detrás de ellos muy rápido y les quitó los remos de madera"],
        ["🏹", "Llamó a los cazadores de la selva para que los atraparan vivos"],
        ["🔥", "Lanzó fuego por la boca e incendió los árboles de la orilla"],
      ],
      0,
      "Pista: fijate en la tremenda furia de Mboi en la escena 4."
    ),
    S(
      "¿En qué se transformaron Naipí y Tarobá al caer las aguas?",
      [
        ["🌴", "Naipí en una roca y Tarobá en una palmera de la orilla"],
        ["🌺", "Naipí en una flor roja y Tarobá en un árbol de ceibo"],
        ["🦋", "Naipí en una mariposa y Tarobá en un pez del arroyo"],
        ["⭐", "Naipí en una estrella y Tarobá en una nube de lluvia"],
      ],
      0,
      "Pista: leé la transformación mágica en la escena 5."
    ),
    I(
      "¿Por qué Tarobá desafió a la temible serpiente Mboi?",
      [
        ["❤️", "Porque amaba a Naipí y no quería que se la llevaran"],
        ["💪", "Porque quería demostrar que era el más fuerte de todos"],
        ["🪙", "Porque buscaba encontrar oro en el fondo de las cascadas"],
        ["🏹", "Porque los ancianos de la tribu le ordenaron luchar"],
      ],
      0,
      "Pista: pensá en los sentimientos de los dos jóvenes."
    ),
    I(
      "¿Qué parte del texto muestra que su unión sigue presente?",
      [
        ["🌈", "El arcoíris sobre las cataratas une a Naipí y a Tarobá"],
        ["🐍", "Los guaraníes respetaban mucho a la serpiente gigante"],
        ["🌊", "Cada año una joven del pueblo debía servir a Mboi en el río"],
        ["🛶", "Tarobá preparó una canoa de madera para navegar juntos"],
      ],
      0,
      "Pista: leé el final con el puente de colores en la escena 6."
    ),
    I(
      "¿Qué accidente geográfico de la Argentina explica esta leyenda?",
      [
        ["🌊", "El origen de las Cataratas del Iguazú en Misiones"],
        ["🧊", "La formación de los grandes glaciares en el sur"],
        ["🏔️", "El nacimiento de la cordillera nevada de los Andes"],
        ["🧂", "La creación de las salinas grandes del norte árido"],
      ],
      0,
      "Pista: está en el título y en el escenario del relato."
    ),
    V(
      "En el texto, ¿qué significa la palabra «cataratas»?",
      [
        ["💦", "Grandes caídas de agua desde alturas considerables"],
        ["🏜️", "Ríos angostos y secos que no tienen corriente de agua"],
        ["🕳️", "Cuevas oscuras y húmedas debajo de las piedras grandes"],
        ["🛤️", "Caminos de tierra que cruzan por el medio de la selva"],
      ],
      0,
      "Pista: es la enorme caída de agua del río partido en dos."
    ),
    E(
      "¿Cuál es el momento de mayor suspenso o clímax del relato?",
      [
        ["⚡", "Cuando la serpiente enfurecida sacude la tierra y quiebra el río"],
        ["👥", "Cuando los pobladores eligen a Naipí para servir en la orilla"],
        ["🛶", "Cuando Tarobá talla la madera para construir la canoa ligera"],
        ["🌅", "Cuando sale el sol y los pájaros cantan sobre las palmeras"],
      ],
      0,
      "Pista: es el momento más emocionante y dramático en la escena 4."
    ),
    VAL(
      "¿Qué mensaje sobre la naturaleza nos transmite esta historia?",
      [
        ["✨", "El amor puede transformar el paisaje en algo eterno y bello"],
        ["⚠️", "Los ríos caudalosos son peligrosos y nadie debe navegar en ellos"],
        ["🚪", "Es mejor no rebelarse nunca ante las dificultades del destino"],
        ["🐍", "Los monstruos gigantes siempre consiguen ganar todas las batallas"],
      ],
      0,
      "Pista: mirá cómo el arcoíris recuerda el amor de los protagonistas."
    ),
  ],

  // 6. El ratón de campo y el ratón de ciudad (fábula de Esopo)
  "raton-campo-ciudad": [
    L(
      "¿Dónde vivía el ratón de campo y qué comida ofreció a su primo?",
      [
        ["🌾", "Vivía junto al trigal y sirvió granos, raíces y agua"],
        ["🛖", "Vivía en un viejo galpón y preparó una sopa caliente"],
        ["🏭", "Vivía adentro de un molino y convidó harina blanca"],
        ["🌉", "Vivía bajo un puente y comieron restos de pan duro"],
      ],
      0,
      "Pista: leé cómo vivía y qué comía en las escenas 1 y 2."
    ),
    L(
      "¿Qué platos apetitosos había en la mesa de la casa de la ciudad?",
      [
        ["🧀", "Había ricos quesos, panes frescos y deliciosas tortas"],
        ["🍎", "Había frutas maduras recolectadas del bosque cercano"],
        ["🌽", "Había semillas tostadas y granos de maíz cosechados"],
        ["🍖", "Había carne asada que sobró del almuerzo familiar"],
      ],
      0,
      "Pista: mirá qué encontró el ratón al llegar en la escena 3."
    ),
    S(
      "¿Qué peligro apareció primero mientras los dos ratones comían?",
      [
        ["🐱", "Apareció un gato y tuvieron que esconderse en un agujero"],
        ["🌪️", "Se desató una tormenta de viento que abrió las ventanas"],
        ["🐕", "Entró un perro guardián que comenzó a ladrar con fuerza"],
        ["🚪", "Se cayó un mueble de la cocina y los dejó atrapados"],
      ],
      0,
      "Pista: leé quién interrumpió la comida en la escena 4."
    ),
    S(
      "¿Qué decidió hacer el ratón de campo tras el susto con las escobas?",
      [
        ["🌾", "Agradecer a su primo y volver feliz a su campo tranquilo"],
        ["📦", "Quedarse a vivir para siempre escondido en la alacena"],
        ["🏙️", "Convencer al primo de mudarse juntos a otra ciudad grande"],
        ["🧹", "Buscar un palo de madera para enfrentar al gato de la casa"],
      ],
      0,
      "Pista: mirá su despedida y regreso en la escena 6."
    ),
    I(
      "¿Por qué el ratón de campo prefirió su vida humilde?",
      [
        ["☮️", "Valoraba la paz y la seguridad más que el lujo con miedo"],
        ["🧀", "No le gustaba el sabor de los quesos ni de las tortas"],
        ["🚜", "Extrañaba levantarse temprano para trabajar la tierra"],
        ["👋", "Su primo le pidió que se fuera rápido de la casa grande"],
      ],
      0,
      "Pista: pensá en lo que sintió con los ruidos y sustos de la ciudad."
    ),
    I(
      "¿Qué frase del texto resume la conclusión del ratón de campo?",
      [
        ["💬", "Prefiero mi comida simple y tranquila a tus tortas con sustos"],
        ["🍽️", "En la ciudad vivía en una casa enorme con mucha comida en la mesa"],
        ["🏡", "Vení a mi casa y vas a ver cuántas cosas ricas tengo para convidar"],
        ["🏃", "Los dos ratones corrieron asustados a meterse en un agujero chico"],
      ],
      0,
      "Pista: buscá las palabras finales del ratón en la escena 6."
    ),
    I(
      "¿En qué se diferencian las formas de pensar de ambos primos?",
      [
        ["⚖️", "Uno prefiere la calma sencilla y el otro busca lujos peligrosos"],
        ["🏊", "Uno sabe nadar en los ríos y el otro prefiere trepar a los techos"],
        ["🌙", "Uno come solamente de noche y el otro busca comida durante el día"],
        ["🐾", "Uno es amigo de los gatos y el otro prefiere jugar con los perros"],
      ],
      0,
      "Pista: compará lo que cada uno necesita para sentirse feliz."
    ),
    V(
      "En el relato, ¿qué es un «trigal»?",
      [
        ["🌾", "Un campo sembrado con plantas de trigo"],
        ["🌲", "Un bosque espeso de lengas y pinos"],
        ["🐑", "Un corral de madera para guardar ovejas"],
        ["⚙️", "Un molino antiguo para fabricar harina"],
      ],
      0,
      "Pista: es el lugar donde crecen los granos de trigo que come el ratón."
    ),
    E(
      "¿Cómo está organizada esta fábula para transmitir su enseñanza?",
      [
        ["📖", "Compara dos formas de vida enfrentándolas a situaciones similares"],
        ["🚢", "Narra una expedición marítima con fechas históricas comprobadas"],
        ["🧩", "Presenta una serie de adivinanzas con rimas al final de cada parte"],
        ["🚜", "Da instrucciones sobre cómo cuidar roedores en una granja modelo"],
      ],
      0,
      "Pista: muestra primero la comida del campo y luego la de la ciudad."
    ),
    VAL(
      "¿Qué enseñanza importante nos deja esta fábula para el día a día?",
      [
        ["💛", "La tranquilidad y la seguridad valen más que las riquezas con sustos"],
        ["🚫", "Conviene no invitar nunca a familiares a compartir la mesa de casa"],
        ["🏙️", "En las grandes ciudades no existe ningún peligro para los pequeños"],
        ["🍰", "Los alimentos dulces son mucho más nutritivos que los granos secos"],
      ],
      0,
      "Pista: pensá en por qué el ratón de campo volvió contento a su hogar."
    ),
  ],
};
