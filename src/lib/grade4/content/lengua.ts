// Actividades de Lengua de 4.º grado (26 mundos).
// Textos expositivos, noticias, biografías, fábulas, poesías, teatro, historietas,
// gramática (párrafo, oraciones, sujeto tácito, construcción sustantiva, clases de palabras,
// tiempos verbales, concordancia) y ortografía (acentuación agudas/graves/esdrújulas,
// signos de diálogo, reglas B/V, C/S/Z, G/J y homófonos).
import type { ActivitySpec } from "@/lib/activities";
import { WorldDef } from "@/types";
import { fromBank, numbered, q, shuffle, Q } from "./util";

export const LENGUA_BANK: Record<number, Q[]> = {
  // 1. La Noticia y sus Partes
  1: [
    q("¿Qué parte de la noticia presenta el hecho principal con letras grandes y destacadas?", [["📰", "El titular"], ["📸", "El epígrafe explicativo debajo de la imagen"], ["📝", "El cuerpo detallado con todos los testimonios"]], 0, "Pista: resume el hecho y llama la atención del lector."),
    q("¿Cuál es la función del epígrafe en una noticia?", [["📸", "Explicar la fotografía"], ["📰", "Dar la firma completa del periodista que redactó la nota"], ["🗞️", "Indicar el precio de venta del periódico en el kiosco"]], 0, "Pista: se ubica inmediatamente debajo de la foto."),
    q("¿Qué información responde la pregunta «¿DÓNDE?» en una noticia periodística?", [["📍", "El lugar del hecho"], ["⏰", "La hora exacta en que se inició el suceso informado"], ["👥", "Los nombres completos de los testigos que estuvieron presentes"]], 0, "Pista: señala la localidad o sitio geográfico."),
    q("¿Qué parte de la noticia se ubica entre el título y el cuerpo resumiendo lo central?", [["📋", "El copete"], ["🏷️", "La volanta"], ["📸", "El epígrafe"]], 0, "Pista: es un párrafo breve que sintetiza lo más importante."),
    q("¿Qué pregunta periodística se responde al detallar el momento del suceso?", [["⏰", "¿Cuándo ocurrió?"], ["❓", "¿Por qué se produjo?"], ["📍", "¿Dónde tuvieron lugar los acontecimientos relatados?"]], 0, "Pista: tiempo, fecha y horario."),
    q("¿En qué tipo de publicación encontramos habitualmente noticias de actualidad?", [["📰", "En diarios y portales digitales"], ["📖", "En novelas de ficción y literatura fantástica"], ["📜", "En libros antiguos de poemas tradicionales"]], 0, "Pista: informan sobre lo que ocurre día a día."),
    q("¿Qué característica es fundamental en una noticia informativa?", [["🔍", "Contar hechos reales"], ["🧙", "Inventar personajes con poderes mágicos asombrosos"], ["🎭", "Escribir en verso rimado para que suene musical"]], 0, "Pista: relata hechos verídicos y comprobables."),
    q("¿Qué sector de la noticia desarrolla ampliamente la información con datos y testimonios?", [["📝", "El cuerpo de la noticia"], ["🏷️", "El título principal de la portada"], ["📸", "El epígrafe breve debajo de la foto"]], 0, "Pista: es la parte más extensa del texto periodístico."),
  ],

  // 2. El Texto Expositivo y sus Claves
  2: [
    q("¿Cuál es el propósito principal de un texto expositivo?", [["💡", "Transmitir información"], ["🎭", "Hacer reír al público"], ["🧙", "Narrar una historia fantástica inventada"]], 0, "Pista: busca enseñar y explicar un tema científico o histórico."),
    q("¿Cómo se organiza habitualmente la información en un texto expositivo extenso?", [["📑", "En párrafos con subtemas"], ["📜", "En versos y estrofas con rima consonante"], ["💬", "En diálogos teatrales entre actores en escena"]], 0, "Pista: cada párrafo profundiza un aspecto particular."),
    q("¿Qué encontramos con frecuencia en los textos expositivos para ilustrar lo explicado?", [["📊", "Esquemas y fotografías"], ["🧙", "Varitas mágicas de fantasía"], ["🎭", "Disfraces de carnaval"]], 0, "Pista: elementos gráficos que complementan la lectura."),
    q("¿Qué tiempo verbal predomina en las explicaciones de los textos expositivos?", [["⏰", "El tiempo presente"], ["⏳", "El pretérito imperfecto"], ["🔮", "El futuro compuesto"]], 0, "Pista: describe hechos y definiciones que son válidos en la actualidad."),
    q("¿Para qué se utilizan los subtítulos en un texto expositivo largo?", [["🏷️", "Para ordenar los subtemas"], ["🎨", "Para decorar los bordes de la página con dibujos"], ["✍️", "Para firmar con el seudónimo del escritor del relato"]], 0, "Pista: guían al lector indicando qué tema trata cada sección."),
    q("¿Qué es la «idea principal» de un párrafo informativo?", [["🎯", "El dato central del párrafo"], ["🔍", "Un detalle secundario de poca importancia"], ["❓", "La pregunta con la que un personaje abre un diálogo"]], 0, "Pista: es la idea que no se puede suprimir sin perder el sentido."),
    q("¿En qué libros escolares consultamos textos expositivos habitualmente?", [["📚", "En enciclopedias y manuales"], ["📖", "En recopilaciones de chistes populares y adivinanzas"], ["🎭", "En libretos teatrales para dramatizaciones escolares"]], 0, "Pista: son fuentes de estudio de Ciencias Naturales y Sociales."),
    q("¿Por qué el lenguaje de un texto expositivo debe ser claro y preciso?", [["🎯", "Para facilitar la comprensión"], ["🪄", "Para ocultar el mensaje principal entre acertijos"], ["🎪", "Para entretener al espectador con juegos de palabras"]], 0, "Pista: el objetivo es que el lector aprenda sin confusiones."),
  ],

  // 3. La Biografía y el Tiempo
  3: [
    q("¿Qué tipo de texto narra la vida real de una persona destacada?", [["📖", "La biografía"], ["📰", "La noticia periodística de actualidad"], ["📜", "La fábula tradicional con moraleja"]], 0, "Pista: bio significa vida y grafía escritura."),
    q("¿En qué orden se presentan generalmente los acontecimientos de una biografía?", [["⏳", "En orden cronológico"], ["🔀", "En orden totalmente mezclado al azar de los recuerdos"], ["🎭", "Desde el desenlace de la obra hasta el marco inicial"]], 0, "Pista: desde el nacimiento, pasando por su infancia y juventud."),
    q("¿Cómo se llama el texto donde una persona relata su propia vida?", [["✍️", "Autobiografía"], ["📑", "Biografía ajena"], ["📰", "Crónica policial"]], 0, "Pista: auto significa uno mismo."),
    q("¿Qué conectores temporales son habituales para ordenar una biografía?", [["🔗", "Primero, luego y finalmente"], ["🛑", "Sin embargo, pero y por lo tanto"], ["➕", "También, además e incluso"]], 0, "Pista: señalan el paso del tiempo entre una etapa y otra."),
    q("¿En qué persona gramatical se escribe habitualmente la biografía de un explorador?", [["👤", "En tercera persona (él o ella)"], ["👥", "En primera persona del plural (nosotros)"], ["🗣️", "En segunda persona singular (vos)"]], 0, "Pista: se habla de lo que esa persona hizo a lo largo de su vida."),
    q("¿Qué datos suelen abrir el primer párrafo de una biografía tradicional?", [["👶", "Lugar y fecha de nacimiento"], ["🏆", "El listado de todos los premios ganados en su vejez"], ["💭", "Las opiniones que sus amigos tenían de sus proyectos"]], 0, "Pista: cuándo y dónde vino al mundo el biografiado."),
    q("¿En qué tiempo verbal se narran los hechos en la biografía de un prócer?", [["📜", "En tiempo pasado o pretérito"], ["🔮", "En tiempo futuro anticipado"], ["⚡", "En modo condicional hipotético"]], 0, "Pista: son sucesos históricos que ya acontecieron."),
    q("¿Qué información es indispensable al narrar la trayectoria de un científico?", [["🔬", "Sus investigaciones y aportes"], ["👟", "La marca de calzado que prefería utilizar al salir"], ["☕", "La cantidad exacta de tazas de café que tomaba a diario"]], 0, "Pista: los descubrimientos que lo hicieron reconocido."),
  ],

  // 4. Textos Instructivos y Recetas
  4: [
    q("¿Cuáles son las dos partes fundamentales de una receta de cocina?", [["📋", "Ingredientes y preparación"], ["🎭", "Personajes, marco y moraleja"], ["📰", "Titular, copete y epígrafe"]], 0, "Pista: qué se necesita y qué pasos seguir para cocinarlo."),
    q("¿En qué forma verbal suelen redactarse los pasos de un instructivo?", [["🎯", "En infinitivo o imperativo"], ["📜", "En pretérito imperfecto narrativo"], ["🔮", "En futuro compuesto del subjuntivo"]], 0, "Pista: verbos terminados en -ar/-er/-ir o dando una orden directa."),
    q("¿Por qué es indispensable que los pasos de un instructivo estén numerados?", [["🔢", "Para seguir el orden secuencial"], ["🎨", "Para que la hoja quede con adornos coloridos llamativos"], ["⏳", "Para calcular cuántas horas dura el recreo escolar"]], 0, "Pista: el resultado depende de realizar las acciones en orden."),
    q("¿Qué texto de uso cotidiano es un ejemplo de texto instructivo?", [["🎮", "El reglamento de un juego"], ["📖", "Un cuento tradicional de hadas"], ["✉️", "Una carta de salutación familiar"]], 0, "Pista: nos explica paso a paso cómo participar y jugar correctamente."),
    q("¿Qué pasaría si en una receta mezclamos los ingredientes en cualquier orden?", [["⚠️", "La comida puede salir mal"], ["🏆", "El plato se cocinará mucho más rápido de lo esperado"], ["✨", "Los ingredientes cambiarán de color por arte de magia"]], 0, "Pista: las instrucciones exigen respetar la secuencia indicada."),
    q("Marcá el verbo que está expresado en infinitivo para un paso de receta:", [["🥣", "Mezclar la harina con agua"], ["🥣", "Mezclamos toda la masa del bowl"], ["🥣", "Ayer habían mezclado todo muy bien"]], 0, "Pista: termina en -ar."),
    q("¿Qué información suele encabezar un manual para armar una carpa de campamento?", [["🏕️", "Los materiales y piezas incluidas"], ["📜", "Una poesía alusiva a los árboles de la cordillera andina"], ["📰", "Las noticias más leídas de la semana en la provincia"]], 0, "Pista: primero se verifica que estén todas las partes necesarias."),
    q("¿Cómo debe ser el lenguaje de las consignas de un examen o instructivo?", [["🎯", "Claro, breve y directo"], ["🪄", "Misterioso y lleno de enigmas"], ["🎭", "Poético con rimas musicales"]], 0, "Pista: el destinatario tiene que entender de inmediato qué hacer."),
  ],

  // 5. La Carta y el Correo Personal
  5: [
    q("¿Qué signo de puntuación se coloca inmediatamente después del saludo inicial en una carta?", [["✉️", "Dos puntos (:)"], ["🛑", "Punto final (.)"], ["❓", "Signos de pregunta (¿?)"]], 0, "Pista: por ejemplo: «Querida abuela:»"),
    q("¿Qué elementos encabezan tradicionalmente una carta personal?", [["📍", "Lugar y fecha de emisión"], ["📝", "La firma del remitente"], ["📋", "El índice de contenidos"]], 0, "Pista: indica desde dónde y cuándo se escribe la carta."),
    q("¿Qué parte de la carta contiene el mensaje que se desea comunicar?", [["📝", "El cuerpo de la carta"], ["✉️", "El sobre exterior"], ["🏷️", "La posdata final"]], 0, "Pista: allí se redactan las anécdotas, noticias o preguntas."),
    q("¿Cómo se llama la fórmula breve de cierre antes de la firma en una carta?", [["👋", "La despedida"], ["📍", "El encabezado"], ["📋", "El copete"]], 0, "Pista: por ejemplo: «Te mando un abrazo enorme» o «Cariños»."),
    q("¿Para qué se utiliza la sigla «P.D.» (posdata) al final de una carta?", [["✍️", "Para agregar algo olvidado"], ["🏷️", "Para escribir el código postal"], ["📍", "Para poner la dirección del correo"]], 0, "Pista: se escribe debajo de la firma para sumar un mensaje de último momento."),
    q("¿Quién es el «destinatario» de una carta familiar?", [["📬", "La persona que la recibe"], ["✍️", "La persona que redactó el texto"], ["🚚", "El cartero que traslada el sobre"]], 0, "Pista: es a quien va dirigida la correspondencia."),
    q("¿Quién es el «remitente» de un mensaje epistolar?", [["✍️", "La persona que escribe y envía"], ["📬", "La persona a la que le llega la carta"], ["🏢", "El edificio del correo central"]], 0, "Pista: es quien firma y remite la carta."),
    q("¿Qué ventaja ofrece el correo electrónico frente a la carta tradicional de papel?", [["⚡", "Llega de manera instantánea"], ["📜", "Permite usar sellos postales antiguos de colección"], ["✍️", "Obliga a escribir siempre a mano con pluma y tinta china"]], 0, "Pista: viaja por internet y se recibe en segundos."),
  ],

  // 6. Fábulas y Moralejas
  6: [
    q("¿Qué característica es distintiva de los personajes en las fábulas?", [["🦊", "Animales que hablan y razonan"], ["🧙", "Monstruos de cuentos fantásticos"], ["👑", "Reyes y caballeros de la Edad Media"]], 0, "Pista: actúan y conversan como seres humanos (personificación)."),
    q("¿Qué es la «moraleja» en una fábula clásica?", [["💡", "Una enseñanza sobre la conducta"], ["🎭", "El nombre de la escenografía"], ["📜", "El título de la obra literaria"]], 0, "Pista: invita a reflexionar sobre virtudes y defectos humanos."),
    q("¿En qué parte de la fábula se ubica habitualmente la moraleja explícita?", [["🏁", "Al final del relato"], ["📍", "En el primer párrafo"], ["🏷️", "En el título de la fábula"]], 0, "Pista: se enuncia como conclusión tras resolverse la historia."),
    q("¿Qué recurso literario consiste en otorgar cualidades humanas a animales o cosas?", [["✨", "La personificación"], ["📏", "La rima consonante"], ["🎭", "La acotación teatral"]], 0, "Pista: hacer que un zorro o una liebre conversen y sientan vanidad."),
    q("En la fábula de la liebre y la tortuga, ¿qué virtud triunfa sobre la soberbia?", [["🐢", "La constancia y el esfuerzo"], ["🐰", "La velocidad descuidada"], ["💤", "Dormir siestas prolongadas"]], 0, "Pista: la tortuga gana paso a paso sin rendirse."),
    q("¿Por qué las fábulas se han transmitido durante tantas generaciones?", [["📚", "Transmiten valores universales"], ["🎪", "Porque enseñan trucos de circo"], ["🧪", "Porque explican fórmulas de química"]], 0, "Pista: ayudan a convivir mejor y actuar con honestidad y prudencia."),
    q("¿Qué tipo de texto narrativo breve es una fábula?", [["📖", "Un relato de ficción con fin didáctico"], ["📰", "Una noticia periodística de última hora"], ["📋", "Un texto instructivo de cocina casera"]], 0, "Pista: es literatura que busca educar a través de una historia entretenida."),
    q("¿Qué defecto humano suele criticar el personaje del zorro en muchas fábulas?", [["🦊", "La vanidad de quien se deja engañar"], ["🐻", "El tamaño de los árboles del bosque"], ["🐟", "La profundidad de los ríos patagónicos"]], 0, "Pista: como cuando engaña al cuervo adulándolo para quitarle el queso."),
  ],

  // 7. Poesía: Versos y Rimas
  7: [
    q("¿Cómo se llama cada una de las líneas que componen un poema?", [["🪶", "Verso"], ["📚", "Párrafo"], ["🎭", "Parlamento"]], 0, "Pista: cada renglón corto de la poesía es un verso."),
    q("¿Cómo se llama el grupo de versos separados por un espacio en blanco?", [["📜", "Estrofa"], ["📖", "Capítulo"], ["📑", "Columna"]], 0, "Pista: es como el párrafo del poema."),
    q("¿Qué tipo de rima se produce cuando coinciden vocales y consonantes a partir de la última vocal acentuada?", [["🎵", "Rima consonante (viento / cuento)"], ["🎶", "Rima asonante"], ["🔇", "Verso libre sin rima"]], 0, "Pista: riman todas las letras finales: -ento con -ento."),
    q("¿Qué tipo de rima ocurre cuando solo coinciden los sonidos vocálicos finales?", [["🎶", "Rima asonante (lenga / seca)"], ["🎵", "Rima consonante perfecta"], ["🥁", "Rima métrica de diez sílabas"]], 0, "Pista: coinciden únicamente las vocales (e-a)."),
    q("¿A qué sentido apela la imagen sensorial «el aullido helado del viento patagónico»?", [["👂", "Al oído (imagen auditiva)"], ["👃", "Al olfato de las flores"], ["👅", "Al gusto de los alimentos dulces"]], 0, "Pista: nos hace imaginar el sonido del viento soplando fuerte."),
    q("¿Qué imagen sensorial transmite la frase «las hojas doradas y rojas de la lenga»?", [["👁️", "Imagen visual"], ["👂", "Imagen auditiva"], ["✋", "Imagen táctil áspera"]], 0, "Pista: describe colores que percibimos con los ojos."),
    q("¿Cuántos versos tiene habitualmente una estrofa de cuarteto tradicional?", [["🔢", "4 versos"], ["🔢", "2 versos"], ["🔢", "8 versos"]], 0, "Pista: cuarte indica cuatro."),
    q("¿Qué emoción o musicalidad busca generar la poesía en el lector?", [["✨", "Belleza, ritmo y sentimientos"], ["📋", "Instrucciones para reparar un motor"], ["📰", "Informar el resultado de un partido"]], 0, "Pista: utiliza el lenguaje estético y sonoro de las palabras."),
  ],

  // 8. El Teatro y las Acotaciones
  8: [
    q("¿Qué parte del texto teatral indica las acciones, gestos o tonos de voz de los personajes?", [["🎭", "Las acotaciones"], ["💬", "Los parlamentos"], ["🏷️", "Los títulos"]], 0, "Pista: se escriben entre paréntesis o en letra cursiva."),
    q("¿Cómo se presentan habitualmente las acotaciones en el libreto teatral?", [["📝", "Entre paréntesis ( )"], ["💬", "Con signos de exclamación ¡ !"], ["❓", "Con signos de interrogación ¿ ?"]], 0, "Pista: aclaran qué debe hacer el actor en ese momento."),
    q("¿Cómo sabemos quién habla en cada momento en un texto teatral?", [["👤", "El nombre del personaje precede al texto"], ["📖", "El narrador lo cuenta al final del capítulo"], ["🎭", "Hay que adivinarlo según la voz del personaje"]], 0, "Pista: se escribe en mayúsculas o negrita antes de cada diálogo."),
    q("¿Qué es un «parlamento» en una obra de teatro?", [["🗣️", "Lo que dice en voz alta el actor"], ["🏛️", "El edificio donde se reúnen los diputados"], ["🎨", "El telón pintado del fondo del escenario"]], 0, "Pista: son las palabras que el personaje pronuncia en escena."),
    q("¿En qué se divide una obra de teatro extensa?", [["🎭", "En actos y escenas"], ["📖", "En capítulos y estrofas"], ["📰", "En volantas y copetes"]], 0, "Pista: las escenas cambian cuando entran o salen personajes."),
    q("¿Quién es la persona encargada de guiar a los actores y coordinar la puesta en escena?", [["🎬", "El director teatral"], ["🎟️", "El boletero de la sala"], ["✍️", "El apuntador de memoria"]], 0, "Pista: orienta cómo interpretar la obra según las acotaciones."),
    q("¿Qué elemento define a la escenografía de una obra teatral?", [["🏞️", "Los decorados que ambientan el lugar"], ["👗", "La ropa abrigada de los espectadores"], ["📜", "Las hojas de papel del libreto original"]], 0, "Pista: representan si la escena ocurre en una estancia o en una plaza."),
    q("¿Qué indica la acotación: «(Con voz temblorosa, mirando hacia la puerta)»?", [["🎭", "Cómo debe hablar y actuar el personaje"], ["💬", "El texto que el actor debe gritar al público"], ["🎟️", "El precio de la entrada al espectáculo"]], 0, "Pista: orienta el tono emotivo y el movimiento corporal."),
  ],

  // 9. Historieta: Viñetas y Globos
  9: [
    q("¿Cómo se llama cada uno de los cuadros ilustrados que componen una historieta?", [["🖼️", "Viñeta"], ["💬", "Globo"], ["📦", "Cartucho"]], 0, "Pista: dentro de cada viñeta transcurre un momento de la acción."),
    q("¿Qué tipo de globo se dibuja con forma de nube esponjosa?", [["💭", "Globo de pensamiento"], ["🗣️", "Globo de diálogo normal"], ["⚡", "Globo de grito con picos"]], 0, "Pista: representa lo que el personaje piensa sin decirlo en voz alta."),
    q("¿Qué tipo de globo tiene bordes dentados o en punta?", [["⚡", "Globo de grito o susto"], ["💭", "Globo de pensamiento íntimo"], ["💬", "Globo de conversación tranquila"]], 0, "Pista: expresa un sonido fuerte, explosión o grito."),
    q("¿Cómo se llaman las palabras que imitan sonidos en las historietas, como «¡PUM!» o «¡CRAC!»?", [["💥", "Onomatopeyas"], ["🪶", "Versos rimados"], ["📝", "Epígrafes de diario"]], 0, "Pista: representan ruidos de golpes, caídas o timbres."),
    q("¿En qué orden se leen normalmente las viñetas en nuestro idioma?", [["➡️", "De izquierda a derecha y de arriba abajo"], ["⬅️", "De derecha a izquierda como en otros idiomas"], ["🔄", "En círculos empezando por el centro de la página"]], 0, "Pista: sigue el mismo orden de la lectura tradicional."),
    q("¿Qué es el «cartucho» o recuadro en una historieta?", [["📜", "El texto donde habla el narrador"], ["💬", "El globo donde grita el protagonista"], ["💥", "El sonido de un disparo dibujado"]], 0, "Pista: suele ubicarse arriba para dar contexto de tiempo o lugar."),
    q("¿Qué señala el «rabo» o pico de un globo de diálogo?", [["👉", "Al personaje que está hablando"], ["🖼️", "Al número de la viñeta siguiente"], ["🎨", "Hacia el margen derecho de la hoja"]], 0, "Pista: apunta a la boca de quien pronuncia las palabras."),
    q("¿Qué recurso gráfico se usa para indicar que un personaje corre a toda velocidad?", [["💨", "Líneas de movimiento y polvo"], ["🌧️", "Gotas de lluvia cayendo del cielo"], ["💤", "Letras zeta repetidas seguidas"]], 0, "Pista: rayitas cinéticas que muestran la trayectoria rápida."),
  ],

  // 10. El Párrafo y la Oración
  10: [
    q("¿Con qué signo comienza gráficamente una oración en español?", [["🔤", "Con letra mayúscula"], ["🛑", "Con punto y seguido"], ["〰️", "Con sangría doble"]], 0, "Pista: la primera letra de toda oración va siempre en mayúscula."),
    q("¿Con qué signo gráfico termina toda oración?", [["🛑", "Con un punto (o signo de cierre)"], ["🔤", "Con una letra mayúscula"], ["💬", "Con una coma de respiro"]], 0, "Pista: punto y seguido, punto y aparte o punto final."),
    q("¿Cómo se llama el pequeño espacio en blanco que dejamos antes de iniciar un párrafo?", [["👉", "Sangría"], ["🛑", "Punto suspensivo"], ["📏", "Margen derecho"]], 0, "Pista: sangría al comenzar el renglón."),
    q("¿Qué punto se utiliza para separar dos oraciones que continúan tratando el mismo tema en el mismo renglón?", [["➡️", "Punto y seguido"], ["⬇️", "Punto y aparte"], ["🏁", "Punto final"]], 0, "Pista: se sigue escribiendo a continuación en la misma línea."),
    q("¿Qué punto indica que termina un párrafo y el texto continuará en el renglón de abajo?", [["⬇️", "Punto y aparte"], ["➡️", "Punto y seguido"], ["🛑", "Punto y coma"]], 0, "Pista: se pasa al siguiente renglón dejando sangría."),
    q("¿Qué punto cierra definitivamente todo el texto de una narración o noticia?", [["🏁", "Punto final"], ["➡️", "Punto y seguido"], ["⬇️", "Punto y aparte"]], 0, "Pista: marca la conclusión de todo el escrito."),
    q("¿Cuántas oraciones completas hay en este texto?\n«El cóndor vuela sobre la montaña. Su plumaje es oscuro.»", [["🔢", "2 oraciones"], ["🔢", "1 oración sola"], ["🔢", "3 oraciones"]], 0, "Pista: contá las mayúsculas iniciales seguidas de punto."),
    q("¿Qué unidad del texto agrupa varias oraciones que desarrollan un mismo aspecto o subtema?", [["📑", "El párrafo"], ["🔤", "La letra suelta"], ["🪶", "El verso poético"]], 0, "Pista: comienza con sangría y termina en punto y aparte."),
  ],

  // 11. Sujeto Expreso y Sujeto Tácito
  11: [
    q("¿Qué es el SUJETO en una oración bimembre?", [["👤", "Quién realiza o experimenta la acción"], ["⚡", "La acción que se realiza en el tiempo"], ["📍", "El lugar donde ocurren las cosas relatadas"]], 0, "Pista: responde a la pregunta «¿Quién?» o «¿Quiénes?»."),
    q("¿Qué es el SUJETO EXPRESO?", [["✍️", "El sujeto que está escrito en la oración"], ["👻", "El sujeto que no aparece escrito en ningún lado"], ["⚡", "El verbo principal conjugado"]], 0, "Pista: está explícito con palabras en la oración."),
    q("¿Qué es el SUJETO TÁCITO?", [["👻", "El sujeto omitido que se deduce por el verbo"], ["✍️", "El sujeto escrito con dos o más núcleos"], ["🛑", "El punto final de la oración"]], 0, "Pista: no está escrito, pero la terminación del verbo nos dice quién es."),
    q("¿Cuál es el sujeto en la oración: «Los guanacos corren por la estepa ventosa»?", [["🦙", "Los guanacos"], ["💨", "Por la estepa ventosa"], ["🏃", "Corren rápido"]], 0, "Pista: ¿quiénes corren?"),
    q("¿Qué tipo de sujeto tiene la oración: «Viajamos a El Calafate en vacaciones»?", [["👻", "Sujeto tácito: nosotros"], ["✍️", "Sujeto expreso simple"], ["👥", "Sujeto compuesto"]], 0, "Pista: no dice 'nosotros' al inicio, pero el verbo 'viajamos' lo indica."),
    q("¿Por qué utilizamos el sujeto tácito al escribir textos narrativos?", [["🔄", "Para evitar repetir los mismos nombres"], ["⏳", "Para que el texto sea el doble de largo"], ["🎨", "Para decorar las palabras con mayúsculas"]], 0, "Pista: es un recurso de cohesión para que no suene repetitivo."),
    q("En la oración «Martín y Lucía estudian juntos», ¿cómo es el sujeto?", [["👥", "Sujeto expreso compuesto (dos núcleos)"], ["👤", "Sujeto expreso simple con un solo núcleo"], ["👻", "Sujeto tácito omitido por el verbo"]], 0, "Pista: tiene dos personas realizando la acción: Martín y Lucía."),
    q("¿Cuál es el sujeto tácito en: «Llegaron temprano a la escuela»?", [["👥", "Ellos o ellas"], ["👤", "Yo en primera persona"], ["👤", "Vos en segunda persona"]], 0, "Pista: ¿quiénes llegaron? Tercera persona del plural."),
  ],

  // 12. Construcción Sustantiva y Núcleo
  12: [
    q("¿Cuál es el elemento principal o NÚCLEO de una construcción sustantiva?", [["🧱", "El sustantivo"], ["⚡", "El verbo conjugado"], ["🔗", "La preposición"]], 0, "Pista: es la palabra central alrededor de la cual giran los modificadores."),
    q("¿Cuáles son los modificadores directos (m.d.) de un sustantivo?", [["📝", "Artículos y adjetivos"], ["⚡", "Los verbos de acción"], ["🛑", "Los puntos y comas"]], 0, "Pista: se unen directamente al sustantivo concordando en género y número."),
    q("En la construcción «El inmenso glaciar», ¿cuál es el núcleo sustantivo?", [["🧊", "glaciar"], ["📏", "inmenso"], ["👉", "El"]], 0, "Pista: es la cosa nombrada."),
    q("En la construcción «Las frías aguas», ¿qué función cumple la palabra «frías»?", [["🎨", "Modificador directo (adjetivo)"], ["🧱", "Núcleo sustantivo central"], ["⚡", "Verbo conjugado"]], 0, "Pista: es un adjetivo que califica a aguas."),
    q("¿Qué le pasa al adjetivo si cambiamos el núcleo sustantivo de singular a plural?", [["🔄", "Debe cambiar a plural por concordancia"], ["🔒", "Debe quedarse siempre en singular invariable"], ["🔤", "Debe escribirse con mayúscula inicial obligatoria"]], 0, "Pista: el adjetivo siempre acompaña el número del sustantivo."),
    q("En «Un viento fuertísimo», ¿cuántos modificadores directos acompañan al sustantivo «viento»?", [["🔢", "2 modificadores: 'Un' y 'fuertísimo'"], ["🔢", "1 solo modificador"], ["🔢", "Ninguno"]], 0, "Pista: un artículo indefinido y un adjetivo."),
    q("Marcá la construcción sustantiva que está correctamente concordada:", [["✅", "La hermosa meseta patagónica"], ["❌", "El hermosa meseta patagónico"], ["❌", "Los hermosa meseta patagónicas"]], 0, "Pista: todo en femenino singular."),
    q("¿Qué palabra funciona como artículo en «Los antiguos pobladores»?", [["👉", "Los"], ["👥", "pobladores"], ["⏳", "antiguos"]], 0, "Pista: es el artículo determinado masculino plural."),
  ],

  // 13. Sustantivos Propios y Comunes
  13: [
    q("¿Qué diferencia fundamental tienen los sustantivos propios al escribirse?", [["🔤", "Se escriben con mayúscula inicial obligatoria"], ["📏", "Tienen siempre más de ocho letras de extensión"], ["🎶", "Llevan tilde ortográfica en la primera vocal"]], 0, "Pista: nombres de personas, ciudades, ríos y provincias."),
    q("¿Cuál de las siguientes palabras es un sustantivo PROPIO de Santa Cruz?", [["📍", "Río Gallegos"], ["🌊", "río caudaloso"], ["🏙️", "ciudad sureña"]], 0, "Pista: es el nombre propio de la capital provincial."),
    q("¿Qué nombran los sustantivos COMUNES?", [["🏷️", "Cosas, animales o seres en general"], ["👤", "A una persona en particular para distinguirla"], ["🗺️", "Los países del mundo con su bandera"]], 0, "Pista: perro, montaña, libro, árbol."),
    q("Marcá el grupo que contiene únicamente sustantivos PROPIOS:", [["🗺️", "Argentina, Santa Cruz, Calafate"], ["🌾", "estepa, cordillera, meseta"], ["🐑", "oveja, caballo, guanaco"]], 0, "Pista: todos son topónimos y nombres geográficos con mayúscula."),
    q("¿Qué tipo de sustantivo es la palabra «estancia»?", [["🏡", "Sustantivo común"], ["📍", "Sustantivo propio"], ["⚡", "Verbo conjugado"]], 0, "Pista: nombra a un tipo de establecimiento rural de forma general."),
    q("¿Por qué «Perito Moreno» se escribe con mayúsculas iniciales?", [["👤", "Porque es un nombre propio"], ["📏", "Porque es una palabra muy larga"], ["🏔️", "Porque nombra a una montaña alta"]], 0, "Pista: honra al célebre perito Francisco Pascasio Moreno."),
    q("¿Cuál de estas opciones contiene un error de mayúscula en un sustantivo propio?", [["❌", "puerto deseado (debe ir Puerto Deseado)"], ["✅", "Puerto Deseado"], ["✅", "El Chaltén"]], 0, "Pista: los nombres de ciudades deben llevar mayúscula inicial."),
    q("¿Qué tipo de sustantivo es «choique»?", [["🐦", "Sustantivo común"], ["📍", "Sustantivo propio"], ["🎨", "Adjetivo calificativo"]], 0, "Pista: nombra a la especie del ñandú petiso patagónico."),
  ],

  // 14. Sustantivos Colectivos
  14: [
    q("¿Qué es un sustantivo COLECTIVO?", [["🐑", "Nombra en singular a un conjunto de seres"], ["🔢", "Un sustantivo que siempre termina en letra ese"], ["👥", "El nombre de una persona muy famosa"]], 0, "Pista: está en número singular, pero abarca a muchos individuos."),
    q("¿Cuál es el sustantivo colectivo de «oveja»?", [["🐑", "Rebaño (o majada)"], ["🐑", "Ovejitas"], ["🐑", "Corral"]], 0, "Pista: el conjunto de ovejas que pasta en el campo."),
    q("¿Cuál es el sustantivo colectivo de «pez»?", [["🐟", "Cardumen"], ["🐟", "Pescera con s"], ["🐟", "Pecera de vidrio"]], 0, "Pista: un gran grupo de peces nadando juntos."),
    q("¿Cuál es el sustantivo colectivo de «árbol»?", [["🌲", "Bosque"], ["🌲", "Arboleda"], ["🌲", "Rama"]], 0, "Pista: conjunto de árboles silvestres."),
    q("¿Cuál es el sustantivo colectivo de «pájaro» o «ave»?", [["🦅", "Bandada"], ["🦅", "Nido"], ["🦅", "Plumaje"]], 0, "Pista: grupo de aves que vuelan juntas en el cielo."),
    q("¿Cuál es el sustantivo colectivo de «perro» o «lobo»?", [["🐕", "Jauría"], ["🐕", "Perrera"], ["🐕", "Camada"]], 0, "Pista: conjunto de perros cazadores."),
    q("¿Qué sustantivo individual corresponde al colectivo «orquesta»?", [["🎺", "Músico"], ["🎭", "Actor"], ["🎨", "Pintor"]], 0, "Pista: cada una de las personas que toca un instrumento."),
    q("¿Es correcto decir «El rebaño pastan en la meseta»?", [["❌", "No: debe decir «El rebaño pasta» (en singular)"], ["✅", "Sí: porque son muchas ovejas"], ["❌", "No: debe decir «Los rebaño»"]], 0, "Pista: el sustantivo colectivo está en singular y su verbo va en singular."),
  ],

  // 15. Adjetivos Calificativos y Gentilicios
  15: [
    q("¿Qué expresa un adjetivo CALIFICATIVO?", [["🎨", "Una cualidad o característica del sustantivo"], ["📍", "El lugar exacto de residencia"], ["⏰", "La hora en que se realiza la acción"]], 0, "Pista: nos dice cómo es o cómo está algo: grande, frío, azul."),
    q("¿Qué expresa un adjetivo GENTILICIO?", [["🗺️", "El lugar de origen o procedencia geográfica"], ["🎨", "El color preferido y favorito de la persona"], ["📏", "La altura en centímetros del objeto medido"]], 0, "Pista: de qué provincia, país o ciudad proviene."),
    q("¿Cuál es el gentilicio de quien nació en la provincia de Santa Cruz?", [["🇦🇷", "Santacruceño / santacruceña"], ["🇦🇷", "Santafesino de la provincia de Santa Fe"], ["🇦🇷", "Santiagueño de Santiago del Estero"]], 0, "Pista: habitante de nuestra provincia."),
    q("¿Cuál es el gentilicio de la persona nacida en El Calafate?", [["🏔️", "Calafateño / calafateña"], ["🏔️", "Calafatense"], ["🏔️", "Calafatero"]], 0, "Pista: vecino de la villa turística de los glaciares."),
    q("En la frase «El cóndor majestuoso», ¿qué clase de palabra es «majestuoso»?", [["🎨", "Adjetivo calificativo"], ["🧱", "Sustantivo común"], ["⚡", "Verbo conjugado"]], 0, "Pista: expresa una cualidad de grandeza del cóndor."),
    q("¿Cuál es el gentilicio de los habitantes de la Patagonia?", [["🌾", "Patagónico / patagónica"], ["🌾", "Patagoniense"], ["🌾", "Patagón"]], 0, "Pista: perteneciente a la región patagónica."),
    q("Marcá la opción que contiene un adjetivo calificativo:", [["❄️", "El viento helado"], ["💨", "El viento sopla"], ["🌬️", "El viento de ayer"]], 0, "Pista: «helado» dice cómo es el viento."),
    q("¿Cómo se escribe el gentilicio en español por regla general?", [["✍️", "Con minúscula inicial (argentino, santacruceño)"], ["🔤", "Con mayúscula inicial obligatoria siempre"], ["📏", "Con guión intermedio"]], 0, "Pista: a diferencia de los sustantivos propios, los gentilicios van con minúscula."),
  ],

  // 16. Concordancia de Género y Número
  16: [
    q("¿Qué significa la «concordancia» entre el sustantivo y el adjetivo?", [["⚖️", "Deben coincidir en género y número"], ["📏", "Deben tener la misma cantidad de sílabas"], ["🔤", "Deben empezar con la misma letra inicial"]], 0, "Pista: si el sustantivo es femenino plural, el adjetivo también."),
    q("Marcá la oración que presenta un ERROR de concordancia:", [["❌", "Las montañas alto tenían mucha nieve"], ["✅", "Las montañas altas tenían mucha nieve"], ["✅", "La montaña alta tenía mucha nieve"]], 0, "Pista: «montañas» es femenino plural y «alto» masculino singular."),
    q("¿Cuál es la forma correcta para concordar «Los bosques» con el adjetivo «dorado»?", [["🍂", "Los bosques dorados"], ["🍂", "Los bosques doradas"], ["🍂", "Los bosques dorado"]], 0, "Pista: masculino plural."),
    q("¿Cuál es la forma correcta para «Una laguna» con «profundo»?", [["🌊", "Una laguna profunda"], ["🌊", "Una laguna profundo"], ["🌊", "Una lagunas profundas"]], 0, "Pista: femenino singular."),
    q("¿Qué género gramatical tiene la palabra «meseta»?", [["♀️", "Femenino (decimos 'la meseta')"], ["♂️", "Masculino (decimos 'el meseta')"], ["⚖️", "Neutro invariable"]], 0, "Pista: lleva el artículo femenino 'la'."),
    q("¿Qué número gramatical tiene la palabra «glaciares»?", [["👥", "Plural (nombra a más de uno)"], ["👤", "Singular (nombra a uno solo)"], ["⚖️", "Dual"]], 0, "Pista: termina en -es y se refiere a varios glaciares."),
    q("Completá con concordancia correcta: «El zorro colorado corre por los senderos _____»", [["🐾", "pedregosos"], ["🐾", "pedregosa"], ["🐾", "pedregoso"]], 0, "Pista: «senderos» es masculino plural."),
    q("¿Cuál de estas frases está perfectamente concordada?", [["✅", "Unas ovejas blancas pastaban tranquilas"], ["❌", "Unas ovejas blanco pastaban muy tranquilas"], ["❌", "Unas ovejas blancas pastaban muy tranquilo"]], 0, "Pista: todos los elementos están en femenino plural."),
  ],

  // 17. Tiempos Verbales: Pasado, Presente y Futuro
  17: [
    q("¿En qué tiempo verbal está el verbo en: «Los chicos estudian Geografía»?", [["⚡", "Presente (ocurre ahora)"], ["📜", "Pretérito (ocurrió antes)"], ["🔮", "Futuro (ocurrirá después)"]], 0, "Pista: la acción transcurre en el momento actual."),
    q("¿En qué tiempo verbal está: «Ayer nevó intensamente en la cordillera»?", [["📜", "Pretérito o pasado"], ["⚡", "Tiempo presente"], ["🔮", "Tiempo futuro"]], 0, "Pista: la palabra 'ayer' y 'nevó' indican que ya sucedió."),
    q("¿En qué tiempo verbal está: «Mañana visitaremos el Parque Nacional»?", [["🔮", "Futuro (sucederá más adelante)"], ["⚡", "Presente"], ["📜", "Pretérito perfecto"]], 0, "Pista: 'visitaremos' indica una acción venidera."),
    q("¿Qué palabra temporal acompaña habitualmente al tiempo pasado?", [["⏳", "Ayer o el año pasado"], ["⚡", "En este mismo instante"], ["🔮", "Mañana o el próximo mes"]], 0, "Pista: señala momentos anteriores al presente."),
    q("¿Qué forma verbal corresponde al futuro de «yo viajo»?", [["🔮", "Yo viajaré"], ["📜", "Yo viajé"], ["⚡", "Yo viajaba"]], 0, "Pista: acción que realizaré más adelante."),
    q("¿En qué tiempo verbal está: «Los pioneros construían casas de chapa y madera»?", [["📜", "Pretérito imperfecto"], ["⚡", "Presente del indicativo"], ["🔮", "Futuro simple"]], 0, "Pista: terminación -ían que indica acción habitual del pasado."),
    q("Completá en presente: «El choique _____ veloz por la meseta.»", [["🏃", "corre"], ["🏃", "corrió"], ["🏃", "correrá"]], 0, "Pista: forma del presente de tercera persona singular."),
    q("¿Qué tiempo verbal usamos principalmente para redactar crónicas del pasado?", [["📜", "Los tiempos pretéritos"], ["🔮", "El tiempo futuro"], ["⚡", "El presente continuo"]], 0, "Pista: los hechos históricos ya ocurrieron."),
  ],

  // 18. Pretérito Perfecto e Imperfecto
  18: [
    q("¿Qué tipo de acción expresa el pretérito perfecto simple (por ejemplo: «llegó», «descubrió»)?", [["🎯", "Una acción puntual concluida"], ["🔄", "Una acción que se repite sin terminar"], ["🔮", "Una acción que ocurrirá mañana"]], 0, "Pista: empezó y terminó en un momento preciso del pasado."),
    q("¿Qué tipo de acción expresa el pretérito imperfecto (por ejemplo: «caminaba», «vivía»)?", [["🔄", "Una acción habitual o descriptiva del pasado"], ["🎯", "Una acción instantánea que ocurrió una sola vez"], ["⚡", "Una acción que está sucediendo ahora mismo"]], 0, "Pista: describe cómo eran las cosas o costumbres continuas."),
    q("¿Cuáles son las terminaciones características del pretérito imperfecto?", [["📝", "-aba e -ía (cantaba / comía)"], ["⚡", "-é y -ó con tilde"], ["🔮", "-ré y -rá con tilde"]], 0, "Pista: soñaba, soplaba, vivía, sentía."),
    q("¿En qué pretérito está el verbo en: «Magallanes llegó a San Julián en 1520»?", [["🎯", "Pretérito perfecto simple"], ["🔄", "Pretérito imperfecto"], ["⚡", "Presente histórico"]], 0, "Pista: hecho histórico puntual y concluido."),
    q("¿En qué pretérito está el verbo en: «Los Tehuelches cazaban guanacos con boleadoras»?", [["🔄", "Pretérito imperfecto (costumbre habitual)"], ["🎯", "Pretérito perfecto simple"], ["🔮", "Futuro imperfecto"]], 0, "Pista: describe una actividad habitual continuada en el tiempo."),
    q("Completá con pretérito imperfecto: «Cuando era chico, siempre _____ con mi perro.»", [["🐕", "jugaba"], ["🐕", "jugué"], ["🐕", "jugaré"]], 0, "Pista: acción repetida en la infancia terminada en -aba."),
    q("Completá con pretérito perfecto simple: «De repente, una ráfaga de viento _____ la puerta.»", [["🚪", "abrió"], ["🚪", "abría"], ["🚪", "abrirá"]], 0, "Pista: acción puntual y repentina."),
    q("¿Lleva tilde la terminación -aba del pretérito imperfecto?", [["❌", "No: las formas en -aba no llevan tilde"], ["✅", "Sí: todas llevan tilde en la primera a"], ["✅", "Sí: llevan tilde si terminan en n"]], 0, "Pista: cantaba, caminaba, soplaba son palabras graves terminadas en vocal."),
  ],

  // 19. Verbos en Infinitivo
  19: [
    q("¿Cuáles son las tres terminaciones del infinitivo en español?", [["🎯", "-ar, -er e -ir"], ["📝", "-ando, -endo e -iendo"], ["📜", "-ado, -ido y -to"]], 0, "Pista: cantar, correr, vivir."),
    q("¿Tiene el infinitivo persona o tiempo gramatical definido?", [["🔒", "No: es una forma no conjugada"], ["👤", "Sí: siempre indica primera persona yo"], ["⏰", "Sí: siempre indica tiempo futuro"]], 0, "Pista: es el nombre básico del verbo sin conjugar."),
    q("¿Cuál es el infinitivo del verbo conjugado «escribimos»?", [["✍️", "escribir"], ["✍️", "escribiendo"], ["✍️", "escrito"]], 0, "Pista: tercera conjugación en -ir."),
    q("¿Cuál es el infinitivo del verbo conjugado «caminaban»?", [["🚶", "caminar"], ["🚶", "caminando"], ["🚶", "camino"]], 0, "Pista: primera conjugación en -ar."),
    q("¿Cuál es el infinitivo de «comieron»?", [["🍽️", "comer"], ["🍽️", "comiendo"], ["🍽️", "comida"]], 0, "Pista: segunda conjugación en -er."),
    q("¿En qué tipo de texto encontramos habitualmente verbos en infinitivo?", [["📋", "En recetas y manuales de instrucciones"], ["📰", "En titulares de diarios de última hora"], ["🎭", "En diálogos de personajes teatrales"]], 0, "Pista: cortar, batir, hornear, encender."),
    q("Marcá la palabra que es un verbo en infinitivo:", [["✨", "proteger"], ["🌿", "protegido"], ["🛡️", "protección"]], 0, "Pista: termina en -er."),
    q("¿Cómo buscamos el significado de una acción verbal en el diccionario?", [["📖", "Por su forma en infinitivo"], ["📝", "Por su forma conjugada en pasado"], ["👥", "Por la persona nosotros"]], 0, "Pista: los diccionarios listan los verbos en infinitivo."),
  ],

  // 20. Sinónimos y Antónimos
  20: [
    q("¿Qué son palabras SINÓNIMAS?", [["🔄", "Palabras de significado similar"], ["⚖️", "Palabras de significado contrario"], ["🔤", "Palabras que riman entre sí"]], 0, "Pista: enorme y gigantesco, feliz y alegre."),
    q("¿Qué son palabras ANTÓNIMAS?", [["⚖️", "Palabras de significado opuesto"], ["🔄", "Palabras de significado idéntico"], ["🥁", "Palabras que tienen tres sílabas"]], 0, "Pista: frío y caliente, alto y bajo."),
    q("¿Cuál es un sinónimo de «veloz» en una narración?", [["🐆", "rápido"], ["🐢", "lento"], ["💤", "dormido"]], 0, "Pista: que se mueve a gran velocidad."),
    q("¿Cuál es el antónimo de «abundante»?", [["🌾", "escaso"], ["🌾", "mucho"], ["🌾", "copioso"]], 0, "Pista: que hay muy poco."),
    q("¿Para qué nos sirve usar sinónimos al redactar una composición?", [["✍️", "Para no repetir la misma palabra muchas veces"], ["📏", "Para que los renglones queden más cortos"], ["🔤", "Para cambiar el idioma de la redacción"]], 0, "Pista: enriquece el vocabulario y mejora la cohesión."),
    q("¿Cuál es un sinónimo adecuado para «vivienda»?", [["🏡", "casa o morada"], ["🚗", "automóvil o coche"], ["🛣️", "carretera o camino"]], 0, "Pista: lugar donde habita una persona."),
    q("¿Cuál es el antónimo de «antiguo»?", [["🏛️", "moderno o nuevo"], ["📜", "viejo"], ["⏳", "ancestral"]], 0, "Pista: lo contrario de algo que tiene muchos años."),
    q("En la frase «El clima patagónico es riguroso», ¿qué sinónimo sustituye a «riguroso»?", [["❄️", "severo o duro"], ["🌴", "cálido"], ["🏖️", "tropical"]], 0, "Pista: muy exigente y hostil por el frío y el viento."),
  ],

  // 21. Hiperónimos e Hipónimos
  21: [
    q("¿Qué es un HIPERÓNIMO?", [["🌳", "Una palabra abarcadora que engloba a otras"], ["🍂", "Una palabra que no tiene ningún significado"], ["🔤", "Una letra mayúscula al inicio del texto"]], 0, "Pista: por ejemplo «árbol» es hiperónimo de lenga y ñire."),
    q("¿Qué son los HIPÓNIMOS?", [["🌿", "Las palabras específicas dentro de una categoría general"], ["🌳", "Los títulos generales de una enciclopedia"], ["🛑", "Los signos de puntuación del párrafo"]], 0, "Pista: cóndor, pingüino y choique son hipónimos de «ave»."),
    q("¿Cuál es el hiperónimo común para «guanaco, puma, zorro y mara»?", [["🐾", "Mamíferos (o animales)"], ["🌿", "Plantas silvestres"], ["🏔️", "Relieves de montaña"]], 0, "Pista: es la categoría general que los agrupa."),
    q("¿Cuáles son hipónimos de la palabra «árbol» en Santa Cruz?", [["🌲", "Lenga, ñire y coihue"], ["🌾", "Coirón y neneo"], ["🌊", "Río y lago"]], 0, "Pista: son especies de árboles de los bosques andinos."),
    q("¿Cuál es el hiperónimo de «martillo, serrucho, pala y pinza»?", [["🧰", "Herramientas"], ["🧱", "Materiales"], ["🏡", "Muebles"]], 0, "Pista: instrumentos de trabajo manual."),
    q("¿Para qué se utilizan los hiperónimos al hacer un resumen de un texto?", [["📝", "Para englobar listas y sintetizar ideas"], ["🎨", "Para decorar las palabras con colores"], ["⏳", "Para cambiar el orden de las fechas"]], 0, "Pista: en vez de nombrar diez especies, decimos «la fauna nativa»."),
    q("¿Qué relación léxica existe entre «vehículo» y «camioneta»?", [["🚗", "Vehículo es hiperónimo y camioneta es hipónimo"], ["🚗", "Son palabras antónimas opuestas"], ["🚗", "Son dos palabras que significan exactamente lo mismo"]], 0, "Pista: el vehículo es la clase general y la camioneta un tipo particular."),
    q("Marcá el conjunto de hipónimos que corresponden al hiperónimo «ciudades santacruceñas»:", [["🏙️", "Río Gallegos, Caleta Olivia, El Calafate"], ["🏔️", "Cerro Chaltén, Cerro Fitz Roy y Cerro Torre"], ["🌊", "Río Santa Cruz, Río Chico y Río Deseado"]], 0, "Pista: son localidades urbanas de la provincia."),
  ],

  // 22. Familias de Palabras y Raíz Común
  22: [
    q("¿Qué parte de la palabra se mantiene invariable en una familia de palabras regulares?", [["🌱", "La raíz"], ["🍃", "El prefijo"], ["🍂", "El sufijo"]], 0, "Pista: contiene el significado básico y conserva la ortografía."),
    q("¿Qué regla ortográfica fundamental se aplica a la raíz de una familia de palabras?", [["🔒", "Conserva siempre las mismas letras ortográficas"], ["🔄", "Cambia de letra cada vez que se agrega un sufijo"], ["🔤", "Se escribe obligatoriamente con mayúscula inicial"]], 0, "Pista: si la raíz va con B, todas sus derivadas van con B."),
    q("¿Cuál de las siguientes palabras pertenece a la familia de «viento»?", [["💨", "ventarrón y ventoso"], ["🌊", "vientre y vientito"], ["👀", "viendo y visto"]], 0, "Pista: comparten el significado del aire en movimiento."),
    q("Marcá la palabra que NO pertenece a la familia de «pan»:", [["❌", "pantalón"], ["🥖", "panadero"], ["🥖", "panadería"]], 0, "Pista: 'pantalón' no deriva de la masa comestible de pan."),
    q("¿Qué palabras integran la familia léxica de «mar»?", [["🌊", "marino, marea y marítimo"], ["🌾", "mariposa y martes"], ["🏔️", "marfil y mareo"]], 0, "Pista: todas se relacionan con las aguas del océano."),
    q("Si la palabra «hierro» se escribe con H, ¿cómo se escribe «herrería»?", [["🔩", "Con H inicial (herrería)"], ["🔩", "Sin H porque cambió de forma"], ["🔩", "Con letra Y"]], 0, "Pista: las palabras de la misma familia conservan la H de la raíz."),
    q("¿Cuál es la raíz compartida en: «flor, florero, floristería, floral»?", [["🌸", "flor-"], ["🌸", "flore-"], ["🌸", "fl-"]], 0, "Pista: la parte común a todas ellas."),
    q("¿Qué palabra pertenece a la familia de «pescar»?", [["🎣", "pescador y pescadería"], ["⚖️", "pesar en la balanza y bulto pesado"], ["👣", "pisada en la arena y pisar fuerte"]], 0, "Pista: derivan de la actividad de extraer peces."),
  ],

  // 23. Sílabas y la Sílaba Tónica
  23: [
    q("¿Qué es la SÍLABA TÓNICA de una palabra?", [["🔔", "La que se pronuncia con más fuerza o intensidad"], ["🤫", "La que se pronuncia en un susurro inaudible"], ["🛑", "La última letra que cierra la palabra escrita"]], 0, "Pista: es la sílaba donde recae el golpe de voz."),
    q("¿Cómo se llaman las sílabas que no llevan la fuerza de la voz?", [["🤫", "Sílabas átonas"], ["🔔", "Sílabas tónicas"], ["🔤", "Sílabas trabadas"]], 0, "Pista: son las sílabas más suaves de la palabra."),
    q("¿Cuál es la sílaba tónica en la palabra «gla-ciar»?", [["🧊", "ciar (la última sílaba)"], ["🧊", "gla (la primera sílaba)"], ["🧊", "Ambas tienen la misma fuerza"]], 0, "Pista: el golpe de voz suena en gla-CIAR."),
    q("¿Cuál es la sílaba tónica en la palabra «bos-que»?", [["🌲", "bos (la penúltima sílaba)"], ["🌲", "que (la última sílaba)"], ["🌲", "No tiene sílaba tónica"]], 0, "Pista: decimos BOS-que, no bos-QUÉ."),
    q("¿Cuál es la sílaba tónica en la palabra «pá-ja-ro»?", [["🐦", "pá (la antepenúltima sílaba)"], ["🐦", "ja (la penúltima sílaba)"], ["🐦", "ro (la última sílaba)"]], 0, "Pista: lleva la tilde escrita en la antepenúltima."),
    q("¿Cómo se divide correctamente en sílabas la palabra «cordillera»?", [["🏔️", "cor-di-lle-ra (4 sílabas)"], ["🏔️", "cord-ill-era"], ["🏔️", "cor-di-llera"]], 0, "Pista: tiene cuatro emisiones de voz."),
    q("¿En qué sílaba recae el acento en la palabra «Pa-ta-go-nia»?", [["🌾", "go (la penúltima sílaba)"], ["🌾", "nia (la última sílaba)"], ["🌾", "ta (la segunda sílaba)"]], 0, "Pista: decimos pataGO-nia."),
    q("¿Cuántas sílabas tiene la palabra «es-te-pa»?", [["🔢", "3 sílabas (trisílaba)"], ["🔢", "2 sílabas (bisílaba)"], ["🔢", "4 sílabas (tetrasílaba)"]], 0, "Pista: es-te-pa."),
  ],

  // 24. Palabras Agudas, Graves y Esdrújulas
  24: [
    q("¿Dónde llevan la fuerza de la voz las palabras AGUDAS?", [["⚡", "En la última sílaba"], ["⚡", "En la penúltima sílaba"], ["⚡", "En la antepenúltima sílaba"]], 0, "Pista: como cañón, glaciar, caminar."),
    q("¿Cuándo llevan tilde escrita las palabras AGUDAS?", [["✍️", "Cuando terminan en N, S o VOCAL"], ["✍️", "Cuando terminan en cualquier consonante menos N o S"], ["✍️", "Llevan tilde siempre sin excepción alguna"]], 0, "Pista: corazón, compás, papá; pero calor no lleva tilde."),
    q("¿Dónde llevan la fuerza de la voz las palabras GRAVES?", [["⚡", "En la penúltima sílaba"], ["⚡", "En la última sílaba"], ["⚡", "En la antepenúltima sílaba"]], 0, "Pista: la gran mayoría de las palabras del español son graves."),
    q("¿Cuándo llevan tilde escrita las palabras GRAVES?", [["✍️", "Cuando NO terminan en N, S o VOCAL"], ["✍️", "Cuando terminan en vocal"], ["✍️", "Nunca llevan tilde ortográfica escrita"]], 0, "Pista: árbol, fácil, césped llevan tilde; casa, mesa no."),
    q("¿Dónde llevan la fuerza de la voz las palabras ESDRÚJULAS?", [["⚡", "En la antepenúltima sílaba"], ["⚡", "En la última sílaba de la palabra"], ["⚡", "En la penúltima sílaba de la palabra"]], 0, "Pista: música, pájaro, brújula."),
    q("¿Cuándo llevan tilde escrita las palabras ESDRÚJULAS?", [["✍️", "Llevan tilde SIEMPRE"], ["✍️", "Solo cuando terminan en consonante"], ["✍️", "Solo cuando terminan en vocal cerrada"]], 0, "Pista: todas las esdrújulas se tildan sin excepción."),
    q("¿Qué tipo de palabra según su acentuación es «ár-bol»?", [["🌳", "Palabra grave con tilde"], ["⚡", "Palabra aguda con tilde"], ["✨", "Palabra esdrújula"]], 0, "Pista: acento en la penúltima sílaba y termina en L."),
    q("¿Qué tipo de palabra según su acentuación es «can-ción»?", [["🎵", "Palabra aguda con tilde"], ["🎵", "Palabra grave sin tilde"], ["🎵", "Palabra esdrújula"]], 0, "Pista: acento en la última sílaba y termina en N."),
  ],

  // 25. Signos de Diálogo y Exclamación
  25: [
    q("¿Qué signo se coloca al inicio de la intervención de cada personaje en un diálogo?", [["—", "La raya de diálogo (—)"], ["-", "Un guión corto de separación"], ["...", "Puntos suspensivos"]], 0, "Pista: es una línea larga que indica que habla un interlocutor."),
    q("¿Qué signos se utilizan para formular preguntas directas en español?", [["❓", "Signos dobles de interrogación (¿?)"], ["❓", "Solo un signo al final como en inglés (?)"], ["💬", "Comillas dobles de diálogo («»)"]], 0, "Pista: en español siempre se coloca signo de apertura y de cierre."),
    q("¿Qué signos se usan para expresar sorpresa, admiración, gritos o alegría?", [["¡!", "Signos dobles de exclamación (¡!)"], ["¿?", "Signos dobles de interrogación (¿?)"], ["--", "Rayas dobles de diálogo"]], 0, "Pista: ¡Qué frío hace en la meseta!"),
    q("¿Llevan tilde las palabras qué, cómo, cuándo, dónde y por qué al formular preguntas?", [["✍️", "Sí: llevan tilde diacrítica enfática"], ["❌", "No: nunca llevan tilde en las oraciones"], ["🔒", "Solo llevan tilde si van al final de la hoja"]], 0, "Pista: ¿Dónde queda el glaciar? ¿Cuándo viajamos?"),
    q("¿Se coloca punto final inmediatamente después de cerrar con signo de interrogación (?) o exclamación (!)?", [["🛑", "No: el punto del signo ya cierra la oración"], ["✅", "Sí: es obligatorio agregar otro punto más al final"], ["〰️", "Debe agregarse una coma obligatoria de cierre"]], 0, "Pista: el puntito del signo cumple la función de punto."),
    q("Marcá la oración con signos de exclamación correctamente escritos en español:", [["¡!", "¡Qué hermoso paisaje patagónico!"], ["!", "Qué hermoso paisaje patagónico!"], ["?!", "¿¡Qué hermoso paisaje patagónico!?"]], 0, "Pista: lleva signo de apertura al inicio y de cierre al final."),
    q("Completá con la palabra interrogativa adecuada: «¿_____ se llega a El Chaltén?»", [["🚗", "Cómo"], ["🚗", "Como"], ["🚗", "Comer"]], 0, "Pista: pregunta por el modo o camino con tilde enfática."),
    q("¿Qué signo introduce la aclaración del narrador dentro del parlamento de un diálogo?", [["—", "La raya de diálogo (—dijo el guía—)"], ["(", "Paréntesis curvos dobles de aclaración"], ["\"", "Comillas inglesas dobles de citación"]], 0, "Pista: las rayas encierran las aclaraciones del narrador."),
  ],

  // 26. El Gran Taller de Ortografía y Redacción (Integración)
  26: [
    q("¿Qué regla ortográfica de la B y la V se aplica en palabras como «cambio, sombrero, tambor»?", [["📝", "Se escribe siempre M antes de B (mb)"], ["📝", "Se escribe siempre la letra N antes de B"], ["📝", "Se escribe siempre letra V corta de vaca"]], 0, "Pista: antes de B va siempre M."),
    q("¿Qué regla ortográfica se aplica en palabras como «invierno, enviar, tranvía»?", [["📝", "Se escribe siempre N antes de V (nv)"], ["📝", "Se escribe siempre la letra M antes de V"], ["📝", "Se escribe siempre la letra B larga en todas"]], 0, "Pista: antes de V va siempre N."),
    q("¿Cómo se escribe el homófono que significa 'del verbo hacer'?", [["🔨", "Hecho (con H inicial)"], ["🗑️", "Echo (del verbo echar)"], ["📦", "Eco (del sonido que rebota)"]], 0, "Pista: «El trabajo está bien hecho»."),
    q("¿Cómo se escribe el homófono que indica 'del verbo tener'?", [["⏳", "Tuvo (con V corta)"], ["🚰", "Tubo (cilindro hueco con B)"], ["📦", "Tugo"]], 0, "Pista: «Ayer el guía tuvo mucha paciencia»."),
    q("¿Cuál es el plural correcto de la palabra «pez»?", [["🐟", "peces (la Z cambia a C ante la E)"], ["🐟", "pezes con letra zeta ortográfica"], ["🐟", "pezs agregando una letra ese final"]], 0, "Pista: las palabras que terminan en Z hacen el plural en -ces."),
    q("¿Qué terminación llevan los adjetivos que indican abundancia como «caluroso, lluviosa, ventoso»?", [["💨", "Se escriben con S (-oso / -osa)"], ["💨", "Se escriben con Z (-ozo / -oza)"], ["💨", "Se escriben con C (-oco / -oca)"]], 0, "Pista: bondadoso, graciosa, ventoso."),
    q("¿Qué letra se utiliza en palabras que terminan en «-aje» o «-jería» (como paisaje, relojería)?", [["🏞️", "Se escriben con J"], ["🏞️", "Se escriben con G"], ["🏞️", "Se escriben con H"]], 0, "Pista: paisaje, viaje, cerrajería llevan J."),
    q("¿Cuál de estas oraciones está redactada con perfecta ortografía?", [["✅", "En invierno, el viento helado soplaba sobre la meseta."], ["❌", "En imbierno, el biento helado soplava sobre la meseta."], ["❌", "En invierno, el viento elado soplaba sobre la mezeta."]], 0, "Pista: invierno con nv, viento con v, soplaba con b."),
  ],
};

export function buildLenguaActivities(world: WorldDef): ActivitySpec[] {
  const n = world.worldNumber ?? 1;
  const bank = LENGUA_BANK[n] ?? LENGUA_BANK[1];
  const qActs = fromBank(bank, 8, `l${n}`, world.skills ?? []);
  return numbered(shuffle(qActs));
}
