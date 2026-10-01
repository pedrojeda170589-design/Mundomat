import { Q, q } from "./util";

// Banco de preguntas por número de mundo de Ciencias Sociales de 1.º.
export const SOCIALES_BANK: Record<number, Q[]> = {
  // 1. Mi Historia
  1: [
    q("¿Qué usaba un bebé para tomar leche?", [["🍼", "Mamadera"], ["🚗", "Auto"], ["📱", "Celular"]], 0, "Pista: pensá en lo que toman los bebés.", { promptEmoji: "👶" }),
    q("¿Dónde dormía cuando era bebé?", [["🛹", "Patineta"], ["🛏️", "Cuna"], ["🚲", "Bici"]], 1, "Pista: es una camita con barandas.", { promptEmoji: "👶" }),
    q("¿Qué puedo hacer ahora que de bebé no podía?", [["🍼", "Tomar mamadera"], ["😭", "Llorar"], ["🚲", "Andar en bici"]], 2, "Pista: los bebés todavía no saben pedalear.", { promptEmoji: "🧒" }),
    q("¿Qué cosa nos cuenta cómo éramos de chiquitos?", [["🖼️", "Fotos de bebé"], ["🔨", "Martillo"], ["🧂", "Salero"]], 0, "Pista: se guardan en un álbum.", { promptEmoji: "📖" }),
    q("¿Quién puede contarme cómo era yo de bebé?", [["🐟", "Un pez"], ["👵", "Mi familia"], ["🧸", "Un osito"]], 1, "Pista: son personas que me cuidaron desde chiquito.", { promptEmoji: "🗣️" }),
    q("¿Qué festejamos cada año el día que nacimos?", [["🎂", "Cumpleaños"], ["🎄", "Navidad"], ["🏫", "Inicio de clases"]], 0, "Pista: hay torta con velitas.", { promptEmoji: "🎉" }),
    q("¿Qué hay en mi documento que me identifica?", [["🍕", "Mi comida"], ["🎨", "Mi color favorito"], ["🔤", "Mi nombre"]], 2, "Pista: es lo primero que decimos cuando nos presentamos.", { promptEmoji: "🪪" }),
    q("Ordená: primero fui bebé, después fui…", [["👴", "Abuelo"], ["🧒", "Niño o niña"], ["👶", "Recién nacido"]], 1, "Pista: es lo que soy ahora, en primer grado.", { promptEmoji: "⏳" }),
    q("¿Qué usaba un bebé antes de saber ir al baño?", [["🧷", "Pañales"], ["👟", "Zapatillas"], ["🎒", "Mochila"]], 0, "Pista: se los cambiaban muchas veces por día.", { promptEmoji: "👶" }),
    q("Tocá todos los cambios que tuve al crecer", [["📏", "Estoy más alto"], ["🦷", "Me salen dientes"], ["🐟", "Me salen aletas"]], [0, 1], "Pista: hay más de uno. Pensá en tu cuerpo.", { promptEmoji: "🌱" }),
  ],

  // 2. Mi Familia y mis Amigos
  2: [
    q("¿Cuál de estas es una familia?", [["👩‍👧", "Mamá e hija"], ["🚗", "Un auto"], ["🌳", "Un árbol"]], 0, "Pista: una familia está formada por personas que se cuidan.", { promptEmoji: "🏠" }),
    q("Tocá todas las que pueden ser familias", [["👨‍👩‍👧", "Mamá, papá, hija"], ["👵", "Abuela y nieto"], ["👨‍👨‍👦", "Dos papás, hijo"], ["🪨", "Una piedra"]], [0, 1, 2], "Pista: hay muchas formas de familia.", { promptEmoji: "💞" }),
    q("¿Qué hacemos con los amigos en el recreo?", [["⚽", "Jugar juntos"], ["😠", "Pelear"], ["🙈", "Ignorarlos"]], 0, "Pista: con los amigos la pasamos bien.", { promptEmoji: "🧒" }),
    q("¿Quién es la mamá de mi mamá?", [["👧", "Mi hermana"], ["👵", "Mi abuela"], ["👶", "Mi primo"]], 1, "Pista: es de una generación más grande.", { promptEmoji: "👩" }),
    q("En casa, ¿cómo podemos ayudar a la familia?", [["🧸", "Guardar juguetes"], ["🗑️", "Tirar todo"], ["📺", "Mirar tele siempre"]], 0, "Pista: es una tarea que deja la casa ordenada.", { promptEmoji: "🏠" }),
    q("¿Qué es un amigo?", [["🤗", "Alguien querido"], ["🦖", "Un dinosaurio"], ["🧱", "Un ladrillo"]], 0, "Pista: es alguien con quien comparto y me divierto.", { promptEmoji: "🤝" }),
    q("Si mi amigo está triste, ¿qué hago?", [["😂", "Me río"], ["🏃", "Me voy"], ["🫂", "Lo abrazo"]], 2, "Pista: los amigos se acompañan.", { promptEmoji: "😢" }),
    q("¿Quién nos cuida en la escuela?", [["🧑‍🏫", "La maestra"], ["🐕", "Un perro"], ["🤖", "Un robot"]], 0, "Pista: nos enseña y nos acompaña en el aula.", { promptEmoji: "🏫" }),
    q("El hijo de mi tío es mi…", [["🧓", "Abuelo"], ["🧒", "Primo"], ["👨", "Papá"]], 1, "Pista: es de mi edad o parecido, y juega conmigo en las fiestas.", { promptEmoji: "👨‍👦" }),
    q("¿Qué compartimos en familia a la hora de comer?", [["🛌", "La cama"], ["🍲", "La comida"], ["🎒", "La mochila"]], 1, "Pista: nos sentamos a la mesa.", { promptEmoji: "🍽️" }),
  ],

  // 3. Lo que Necesitamos
  3: [
    q("¿Qué necesitamos para no tener frío en invierno?", [["🧥", "Abrigo"], ["🩴", "Ojotas"], ["🍦", "Helado"]], 0, "Pista: en Santa Cruz el invierno es muy frío.", { promptEmoji: "🥶" }),
    q("¿Dónde vivimos y nos protegemos del viento?", [["🌳", "En un árbol"], ["🏠", "En una casa"], ["🚌", "En el colectivo"]], 1, "Pista: tiene techo, paredes y puerta.", { promptEmoji: "🌬️" }),
    q("¿Adónde vamos para aprender a leer?", [["🏫", "A la escuela"], ["🏪", "Al almacén"], ["⛽", "A la estación"]], 0, "Pista: allí está la maestra.", { promptEmoji: "📚" }),
    q("Si estoy enfermo, ¿adónde voy?", [["🎪", "Al circo"], ["🏖️", "A la playa"], ["🏥", "Al hospital"]], 2, "Pista: ahí trabajan médicos y enfermeras.", { promptEmoji: "🤒" }),
    q("Tocá todos los alimentos", [["🍞", "Pan"], ["🥛", "Leche"], ["🧱", "Ladrillo"], ["🍎", "Manzana"]], [0, 1, 3], "Pista: se pueden comer o tomar.", { promptEmoji: "🍽️" }),
    q("¿Qué necesitamos tomar todos los días?", [["💧", "Agua"], ["🛢️", "Aceite de auto"], ["🧴", "Champú"]], 0, "Pista: sale de la canilla y la necesita todo ser vivo.", { promptEmoji: "🥤" }),
    q("Antes, ¿cómo calentaban las casas?", [["❄️", "Con hielo"], ["🪵", "Con leña"], ["🌀", "Con ventilador"]], 1, "Pista: se quemaba en una estufa o fogón.", { promptEmoji: "🔥" }),
    q("¿Qué usamos hoy para cocinar en muchas casas?", [["🛁", "Bañera"], ["🔥", "Cocina a gas"], ["🛏️", "Cama"]], 1, "Pista: tiene hornallas y horno.", { promptEmoji: "🍳" }),
    q("¿Qué necesitamos para dormir bien?", [["🎺", "Trompeta"], ["🛏️", "Una cama"], ["⚽", "Pelota"]], 1, "Pista: tiene colchón y almohada.", { promptEmoji: "😴" }),
    q("¿Quién nos vacuna para cuidar la salud?", [["👩‍⚕️", "Enfermera"], ["👨‍🍳", "Cocinero"], ["👷", "Albañil"]], 0, "Pista: trabaja en el hospital o en la salita.", { promptEmoji: "💉" }),
  ],

  // 4. Las Instituciones de mi Pueblo
  4: [
    q("¿Dónde nos atienden cuando estamos enfermos?", [["🏥", "Hospital"], ["🏟️", "Club"], ["📚", "Biblioteca"]], 0, "Pista: hay médicos, camillas y remedios.", { promptEmoji: "🤒" }),
    q("¿Dónde vamos a pedir libros prestados?", [["🚒", "Bomberos"], ["📚", "Biblioteca"], ["🏥", "Hospital"]], 1, "Pista: es un lugar silencioso lleno de libros.", { promptEmoji: "📖" }),
    q("¿Quiénes apagan los incendios?", [["👮", "Policías"], ["👩‍🏫", "Maestras"], ["🧑‍🚒", "Bomberos"]], 2, "Pista: usan casco y una manguera larga.", { promptEmoji: "🔥" }),
    q("¿Dónde podemos hacer deporte con otros chicos?", [["🏟️", "En el club"], ["🏥", "En el hospital"], ["🏦", "En el banco"]], 0, "Pista: hay canchas, pelotas y equipos.", { promptEmoji: "⚽" }),
    q("¿Dónde aprenden los chicos a leer y escribir?", [["🚒", "Cuartel"], ["🏫", "Escuela"], ["⛪", "Iglesia"]], 1, "Pista: ahí estás vos ahora.", { promptEmoji: "✏️" }),
    q("¿Quién trabaja en la escuela?", [["🧑‍🏫", "La maestra"], ["🧑‍🚒", "El bombero"], ["🧑‍✈️", "El piloto"]], 0, "Pista: enseña en el aula.", { promptEmoji: "🏫" }),
    q("¿Dónde mandamos una carta?", [["🏟️", "Club"], ["🏥", "Hospital"], ["🏤", "Correo"]], 2, "Pista: allí trabaja el cartero.", { promptEmoji: "✉️" }),
    q("¿Quién nos ayuda si nos perdemos en la calle?", [["👮", "Policía"], ["🐄", "Una vaca"], ["🤡", "Payaso"]], 0, "Pista: cuida a las personas en el pueblo.", { promptEmoji: "🧭" }),
    q("¿Dónde podemos ir a ver una obra de títeres?", [["🏭", "Fábrica"], ["🎭", "Centro cultural"], ["⛽", "Estación de servicio"]], 1, "Pista: allí hay arte, música y teatro.", { promptEmoji: "🎪" }),
    q("Tocá todos los lugares que ayudan al pueblo", [["🏫", "Escuela"], ["🏥", "Hospital"], ["🚒", "Bomberos"], ["🌋", "Volcán"]], [0, 1, 2], "Pista: son lugares donde trabajan personas para todos.", { promptEmoji: "🏘️" }),
  ],

  // 5. Normas y Acuerdos
  5: [
    q("Para hablar en clase, ¿qué hacemos?", [["🙋", "Levantar la mano"], ["📢", "Gritar"], ["🏃", "Correr"]], 0, "Pista: así esperamos nuestro turno.", { promptEmoji: "🏫" }),
    q("Si dos chicos quieren el mismo juguete, ¿qué hacen?", [["😠", "Pelean"], ["🔁", "Se turnan"], ["💔", "Lo rompen"]], 1, "Pista: así los dos pueden jugar.", { promptEmoji: "🧸" }),
    q("¿Cómo cruzamos la calle?", [["🏃", "Corriendo solos"], ["📱", "Mirando el celular"], ["🚸", "Por la senda"]], 2, "Pista: con un adulto y por las rayas blancas.", { promptEmoji: "🚦" }),
    q("¿Qué color del semáforo dice ¡alto!?", [["🔴", "Rojo"], ["🟢", "Verde"], ["🔵", "Azul"]], 0, "Pista: es el color de la luz de arriba.", { promptEmoji: "🚦" }),
    q("Si me equivoco y lastimo a alguien, ¿qué digo?", [["😝", "¡Bien hecho!"], ["🙏", "Perdón"], ["🤐", "Nada"]], 1, "Pista: es una palabra mágica para arreglar las cosas.", { promptEmoji: "🤕" }),
    q("¿Dónde tiramos los papeles?", [["🗑️", "Al cesto"], ["🌱", "Al piso"], ["🚽", "Por la ventana"]], 0, "Pista: es un recipiente para la basura.", { promptEmoji: "📄" }),
    q("¿Para qué sirven las reglas del aula?", [["😖", "Para pelear"], ["🙈", "Para aburrirnos"], ["🤝", "Para convivir bien"]], 2, "Pista: nos ayudan a estar todos mejor.", { promptEmoji: "📋" }),
    q("En un juego, ¿qué hacemos si perdemos?", [["😡", "Nos enojamos"], ["🤝", "Felicitamos al otro"], ["🧨", "Rompemos el juego"]], 1, "Pista: un buen compañero sabe perder.", { promptEmoji: "🎲" }),
    q("¿Qué usamos en el auto para viajar seguros?", [["🪢", "Cinturón"], ["🎈", "Globo"], ["🧢", "Gorra"]], 0, "Pista: se abrocha y nos sujeta al asiento.", { promptEmoji: "🚗" }),
    q("Tocá todas las palabras amables", [["🙏", "Por favor"], ["😊", "Gracias"], ["😤", "¡Callate!"], ["👋", "Buen día"]], [0, 1, 3], "Pista: son palabras que hacen sentir bien a los demás.", { promptEmoji: "💬" }),
  ],

  // 6. Derechos y Deberes
  6: [
    q("Todos los chicos tienen derecho a…", [["🏫", "Ir a clases"], ["🏭", "Trabajar en fábricas"], ["🚗", "Manejar un auto"]], 0, "Pista: es donde aprendemos.", { promptEmoji: "🧒" }),
    q("¿Qué derecho tienen los chicos en su tiempo libre?", [["🧹", "Limpiar siempre"], ["🎲", "Jugar"], ["💼", "Ir a trabajar"]], 1, "Pista: es algo divertido que nos hace bien.", { promptEmoji: "⏰" }),
    q("Si estoy enfermo, tengo derecho a…", [["🏥", "Que me atiendan"], ["🚫", "Quedarme solo"], ["🌧️", "Mojarse afuera"]], 0, "Pista: lo hacen médicos y enfermeras.", { promptEmoji: "🤒" }),
    q("Todos tenemos derecho a tener un…", [["🦄", "Unicornio"], ["🛥️", "Barco"], ["🔤", "Nombre"]], 2, "Pista: es como nos llaman.", { promptEmoji: "🪪" }),
    q("¿Cuál es un deber en la escuela?", [["🙉", "No escuchar"], ["📏", "Cuidar los útiles"], ["✂️", "Romper los libros"]], 1, "Pista: así duran mucho más.", { promptEmoji: "🏫" }),
    q("¿Cuál es un deber en casa?", [["🧦", "Dejar todo tirado"], ["🛏️", "Ordenar mi cuarto"], ["🔊", "Gritar de noche"]], 1, "Pista: así la casa queda linda.", { promptEmoji: "🏠" }),
    q("Si un compañero no tiene lápiz, ¿qué hago?", [["✏️", "Le presto"], ["🙄", "Lo ignoro"], ["😜", "Me burlo"]], 0, "Pista: ser solidario es ayudar.", { promptEmoji: "🤔" }),
    q("Todos los chicos merecen ser tratados con…", [["💢", "Gritos"], ["❤️", "Respeto"], ["🙈", "Burlas"]], 1, "Pista: es tratar bien a todos.", { promptEmoji: "👧" }),
    q("Para armar un mural en grupo, ¿qué hacemos?", [["🧑‍🤝‍🧑", "Cooperamos"], ["🙅", "Nadie ayuda"], ["😤", "Uno manda solo"]], 0, "Pista: cada uno pone un poquito.", { promptEmoji: "🎨" }),
    q("Tocá todos los derechos de los chicos", [["🍎", "Alimentarse"], ["🏫", "Aprender"], ["🎲", "Jugar"], ["🚬", "Fumar"]], [0, 1, 2], "Pista: son cosas que nos hacen crecer sanos.", { promptEmoji: "🧒" }),
  ],

  // 7. Campo y Ciudad
  7: [
    q("¿Dónde hay muchas ovejas y poca gente?", [["🏙️", "En la ciudad"], ["🐑", "En la estancia"], ["🛒", "En el súper"]], 1, "Pista: es un lugar del campo patagónico.", { promptEmoji: "🌾" }),
    q("¿Dónde hay edificios altos y mucho tránsito?", [["🏙️", "En la ciudad"], ["🌄", "En el campo"], ["🏔️", "En la montaña"]], 0, "Pista: viven muchísimas personas juntas.", { promptEmoji: "🚦" }),
    q("En el campo, ¿quién cuida las ovejas?", [["👨‍🚀", "Astronauta"], ["🧑‍🌾", "Peón rural"], ["🧑‍💻", "Programador"]], 1, "Pista: trabaja en la estancia con perros ovejeros.", { promptEmoji: "🐑" }),
    q("¿Qué hay más en la ciudad que en el campo?", [["🐑", "Ovejas"], ["🌾", "Pasto"], ["🚗", "Autos"]], 2, "Pista: andan por las calles y hacen ruido.", { promptEmoji: "🏙️" }),
    q("¿Qué hay en el campo patagónico?", [["🦙", "Guanacos"], ["🚇", "Subte"], ["🏢", "Rascacielos"]], 0, "Pista: es un animal de la estepa.", { promptEmoji: "🌄" }),
    q("¿Cómo son las calles en un pueblo chico?", [["🛣️", "Autopistas enormes"], ["🏘️", "Pocas y tranquilas"], ["🚇", "Con subte"]], 1, "Pista: en un pueblo vive poca gente.", { promptEmoji: "🏘️" }),
    q("¿Qué es el lugar cercano a mi casa?", [["🌍", "Otro país"], ["🏘️", "Mi barrio"], ["🌙", "La Luna"]], 1, "Pista: es donde están mis vecinos.", { promptEmoji: "🏠" }),
    q("¿Cuál es un lugar lejano de Santa Cruz?", [["🏫", "Mi escuela"], ["🏠", "Mi casa"], ["🏝️", "Una isla tropical"]], 2, "Pista: allí hace calor todo el año.", { promptEmoji: "✈️" }),
    q("¿Qué sopla mucho en la estepa santacruceña?", [["🌬️", "El viento"], ["🌴", "Palmeras"], ["🐒", "Monos"]], 0, "Pista: mueve el pasto y las nubes.", { promptEmoji: "🌄" }),
    q("Tocá todo lo que vemos en el campo", [["🐑", "Ovejas"], ["🐎", "Caballos"], ["🚦", "Semáforos"], ["🌾", "Pastizales"]], [0, 1, 3], "Pista: no hay calles con tránsito.", { promptEmoji: "🌄" }),
  ],

  // 8. Naturaleza y Construcciones
  8: [
    q("¿Cuál lo hizo la naturaleza?", [["🏔️", "Montaña"], ["🏠", "Casa"], ["🌉", "Puente"]], 0, "Pista: ninguna persona la construyó.", { promptEmoji: "🌿" }),
    q("¿Cuál lo construyeron las personas?", [["🌊", "Mar"], ["🛣️", "Ruta"], ["🌳", "Árbol"]], 1, "Pista: se hizo con máquinas y asfalto.", { promptEmoji: "👷" }),
    q("¿El glaciar lo hizo la naturaleza o las personas?", [["👷", "Las personas"], ["🏔️", "La naturaleza"], ["🤖", "Un robot"]], 1, "Pista: se formó con nieve durante muchísimo tiempo.", { promptEmoji: "🧊" }),
    q("¿Qué construyeron las personas para cruzar un río?", [["🌉", "Un puente"], ["☁️", "Una nube"], ["🌋", "Un volcán"]], 0, "Pista: pasa por arriba del agua.", { promptEmoji: "🏞️" }),
    q("¿Cuál es natural?", [["🏫", "Escuela"], ["🚦", "Semáforo"], ["🏞️", "Río"]], 2, "Pista: el agua corre sola.", { promptEmoji: "🌿" }),
    q("¿Qué construyeron en la estancia para las ovejas?", [["🌋", "Un volcán"], ["🧱", "Un corral"], ["🌈", "Un arcoíris"]], 1, "Pista: es un lugar cerrado con alambre o madera.", { promptEmoji: "🐑" }),
    q("¿Cuál NO lo hizo una persona?", [["🚗", "Auto"], ["🪨", "Piedra"], ["🏠", "Casa"]], 1, "Pista: está en la naturaleza desde siempre.", { promptEmoji: "🤔" }),
    q("¿Qué construyeron las personas en la costa para los barcos?", [["⚓", "Puerto"], ["🐧", "Pingüino"], ["🌊", "Ola"]], 0, "Pista: allí llegan y salen los barcos.", { promptEmoji: "🚢" }),
    q("¿Qué hicieron las personas para tener luz de noche?", [["⭐", "Estrellas"], ["🌙", "Luna"], ["💡", "Faroles"]], 2, "Pista: están en las calles y se prenden con electricidad.", { promptEmoji: "🌃" }),
    q("Tocá todo lo que hizo la naturaleza", [["🌳", "Árbol"], ["🏔️", "Cerro"], ["🏢", "Edificio"], ["🌊", "Lago"]], [0, 1, 3], "Pista: hay más de uno. Nadie los construyó.", { promptEmoji: "🌿" }),
  ],

  // 9. Del Campo a la Mesa
  9: [
    q("¿Qué nos da la oveja que sirve para tejer?", [["🧶", "Lana"], ["🥚", "Huevos"], ["🍯", "Miel"]], 0, "Pista: con ella se hacen pulóveres.", { promptEmoji: "🐑" }),
    q("¿Cómo se llama cortar la lana a las ovejas?", [["🍳", "Cocinar"], ["✂️", "Esquila"], ["🎣", "Pesca"]], 1, "Pista: se hace en la estancia con tijeras o máquinas.", { promptEmoji: "🐑" }),
    q("¿De qué animal sacamos la leche?", [["🐄", "Vaca"], ["🐟", "Pez"], ["🐔", "Gallina"]], 0, "Pista: hace «muuu».", { promptEmoji: "🥛" }),
    q("¿Dónde se cultivan verduras?", [["🏦", "En el banco"], ["🚢", "En el barco"], ["🥬", "En la huerta"]], 2, "Pista: hay tierra, semillas y agua.", { promptEmoji: "🥕" }),
    q("¿Qué herramienta se usa en la huerta?", [["🪏", "Pala"], ["🎸", "Guitarra"], ["🖥️", "Computadora"]], 0, "Pista: sirve para mover la tierra.", { promptEmoji: "🌱" }),
    q("¿Quiénes salen al mar en barco a buscar peces?", [["👩‍🚒", "Bomberos"], ["🎣", "Pescadores"], ["👨‍🍳", "Panaderos"]], 1, "Pista: usan redes y cañas.", { promptEmoji: "🐟" }),
    q("¿Qué se hace con el trigo?", [["🧵", "Hilo"], ["🧱", "Ladrillos"], ["🍞", "Pan"]], 2, "Pista: primero se hace harina.", { promptEmoji: "🌾" }),
    q("¿Qué perro ayuda a juntar las ovejas?", [["🐕", "Perro ovejero"], ["🐩", "Caniche de juguete"], ["🌭", "Pancho"]], 0, "Pista: corre por el campo y arrea el rebaño.", { promptEmoji: "🐑" }),
    q("Primero esquilan la oveja. ¿Qué sigue con la lana?", [["🔥", "Se quema"], ["🧼", "Se lava"], ["🗑️", "Se tira"]], 1, "Pista: la lana viene sucia del campo.", { promptEmoji: "🧶" }),
    q("Tocá todo lo que se produce en el campo", [["🧶", "Lana"], ["🥛", "Leche"], ["🥕", "Zanahorias"], ["📱", "Celulares"]], [0, 1, 2], "Pista: viene de animales y plantas.", { promptEmoji: "🌾" }),
  ],

  // 10. Servicios de mi Localidad
  10: [
    q("¿Qué sale de la canilla?", [["💧", "Agua"], ["🧃", "Jugo"], ["🥛", "Leche"]], 0, "Pista: la usamos para lavarnos las manos.", { promptEmoji: "🚰" }),
    q("¿Qué ilumina las calles de noche?", [["🕯️", "Velas"], ["💡", "Alumbrado público"], ["🔦", "Linternas"]], 1, "Pista: son luces altas en postes.", { promptEmoji: "🌃" }),
    q("¿Qué servicio nos lleva de un barrio a otro?", [["🚌", "Colectivo"], ["🚿", "Ducha"], ["📺", "Tele"]], 0, "Pista: tiene paradas y lleva a mucha gente.", { promptEmoji: "🏙️" }),
    q("¿Qué pasa si se corta la luz de noche?", [["☀️", "Todo brilla"], ["🌑", "Queda oscuro"], ["🌈", "Sale un arcoíris"]], 1, "Pista: las lámparas no funcionan.", { promptEmoji: "💡" }),
    q("¿Quién se lleva la basura de las casas?", [["🚛", "Camión recolector"], ["🚑", "Ambulancia"], ["🚒", "Camión de bomberos"]], 0, "Pista: pasa por las calles juntando bolsas.", { promptEmoji: "🗑️" }),
    q("Sin gas en invierno, ¿qué problema hay?", [["🥵", "Mucho calor"], ["🥶", "Hace frío"], ["🌊", "Se inunda"]], 1, "Pista: el gas calienta las estufas.", { promptEmoji: "🔥" }),
    q("¿Qué necesitamos para llamar por teléfono?", [["📶", "Señal"], ["🧂", "Sal"], ["🪵", "Leña"]], 0, "Pista: son las rayitas que muestra el celular.", { promptEmoji: "📱" }),
    q("En el campo lejos del pueblo, ¿de dónde sacan agua?", [["🏙️", "De un edificio"], ["🛒", "Del súper"], ["🪣", "De un pozo"]], 2, "Pista: se saca de debajo de la tierra.", { promptEmoji: "🌄" }),
    q("¿Qué usan muchas estancias para tener electricidad?", [["🧲", "Imanes"], ["🌬️", "Molinos de viento"], ["🎈", "Globos"]], 1, "Pista: en Patagonia sopla mucho viento.", { promptEmoji: "💡" }),
    q("Tocá todos los servicios del pueblo", [["💧", "Agua"], ["💡", "Luz"], ["🚌", "Colectivo"], ["🦄", "Unicornio"]], [0, 1, 2], "Pista: son cosas que usamos todos.", { promptEmoji: "🏘️" }),
  ],

  // 11. Los Transportes
  11: [
    q("¿Qué transporte vuela?", [["✈️", "Avión"], ["🚂", "Tren"], ["🚲", "Bici"]], 0, "Pista: tiene alas.", { promptEmoji: "☁️" }),
    q("¿Qué transporte va por el agua?", [["🚗", "Auto"], ["🚢", "Barco"], ["🚁", "Helicóptero"]], 1, "Pista: flota.", { promptEmoji: "🌊" }),
    q("¿Qué lleva a mucha gente por la ciudad?", [["🛴", "Monopatín"], ["🏍️", "Moto"], ["🚌", "Colectivo"]], 2, "Pista: es grande y para en las paradas.", { promptEmoji: "🏙️" }),
    q("¿Qué transporte lleva mercadería por la ruta?", [["🚚", "Camión"], ["🛶", "Canoa"], ["🛹", "Patineta"]], 0, "Pista: es grande y tiene una caja atrás.", { promptEmoji: "📦" }),
    q("¿Qué usa el peón para recorrer el campo?", [["🚇", "Subte"], ["🐎", "Caballo"], ["🚤", "Lancha"]], 1, "Pista: es un animal que se monta.", { promptEmoji: "🌄" }),
    q("¿Qué transporte usamos sin motor?", [["🚲", "Bicicleta"], ["🚗", "Auto"], ["🚌", "Colectivo"]], 0, "Pista: se mueve pedaleando.", { promptEmoji: "🦵" }),
    q("¿Qué lleva a un enfermo rápido al hospital?", [["🚜", "Tractor"], ["🚑", "Ambulancia"], ["🛺", "Triciclo"]], 1, "Pista: tiene sirena.", { promptEmoji: "🏥" }),
    q("Para ir de Gregores a Río Gallegos, ¿qué usamos?", [["🚢", "Barco"], ["🛷", "Trineo"], ["🚌", "Micro"]], 2, "Pista: va por la ruta y lleva pasajeros.", { promptEmoji: "🛣️" }),
    q("¿Qué transporte trabaja en el campo arando?", [["🚜", "Tractor"], ["🚕", "Taxi"], ["✈️", "Avión"]], 0, "Pista: tiene ruedas enormes.", { promptEmoji: "🌾" }),
    q("Tocá todos los que van por la tierra", [["🚗", "Auto"], ["🚂", "Tren"], ["⛵", "Velero"], ["🚌", "Colectivo"]], [0, 1, 3], "Pista: tienen ruedas.", { promptEmoji: "🛣️" }),
  ],

  // 12. Mapas, Planos y Croquis
  12: [
    q("¿Qué usamos para encontrar un lugar?", [["🗺️", "Un mapa"], ["🍳", "Una sartén"], ["🎺", "Una trompeta"]], 0, "Pista: es un dibujo de los lugares.", { promptEmoji: "🧭" }),
    q("Un plano muestra un lugar visto desde…", [["⬇️", "Abajo"], ["⬆️", "Arriba"], ["🙈", "Adentro"]], 1, "Pista: como lo ve un pájaro volando.", { promptEmoji: "🦅" }),
    q("En un mapa, ¿de qué color se pinta el mar?", [["🟥", "Rojo"], ["🟦", "Azul"], ["⬛", "Negro"]], 1, "Pista: es el color del agua.", { promptEmoji: "🗺️" }),
    q("Un croquis de mi aula muestra…", [["🪑", "Mesas y sillas"], ["🐋", "Ballenas"], ["🌋", "Volcanes"]], 0, "Pista: son cosas que están en el aula.", { promptEmoji: "✏️" }),
    q("¿Qué es un croquis?", [["🎵", "Una canción"], ["🍪", "Una galletita"], ["✏️", "Un dibujo simple"]], 2, "Pista: se hace con lápiz y muestra dónde está cada cosa.", { promptEmoji: "🗺️" }),
    q("Desde arriba, una mesa redonda se ve como…", [["⚪", "Un círculo"], ["🔺", "Un triángulo"], ["⭐", "Una estrella"]], 0, "Pista: mirá su borde.", { promptEmoji: "⬆️" }),
    q("¿Qué instrumento muestra el norte?", [["⏰", "Reloj"], ["🧭", "Brújula"], ["🔭", "Telescopio"]], 1, "Pista: tiene una aguja que gira.", { promptEmoji: "🗺️" }),
    q("¿Qué nos muestra un mapa de Santa Cruz?", [["🍕", "Recetas"], ["🎮", "Juegos"], ["🏘️", "Pueblos y ríos"]], 2, "Pista: muestra lugares de nuestra provincia.", { promptEmoji: "🗺️" }),
    q("En el plano de mi casa, ¿dónde va la cama?", [["🛏️", "En el dormitorio"], ["🚿", "En la ducha"], ["🚗", "En el garaje"]], 0, "Pista: es donde dormimos.", { promptEmoji: "🏠" }),
    q("¿Qué usamos para hacer un croquis?", [["🥄", "Cuchara"], ["✏️", "Lápiz y papel"], ["🧽", "Esponja"]], 1, "Pista: sirve para dibujar.", { promptEmoji: "📝" }),
  ],

  // 13. Antes y Ahora
  13: [
    q("Antes, ¿con qué se iluminaban las casas?", [["🕯️", "Velas"], ["📱", "Celular"], ["📺", "Tele"]], 0, "Pista: tienen mecha y fuego.", { promptEmoji: "🕰️" }),
    q("Hoy, ¿con qué iluminamos las casas?", [["🔥", "Fogatas"], ["💡", "Lamparitas"], ["⭐", "Estrellas"]], 1, "Pista: funcionan con electricidad.", { promptEmoji: "🏠" }),
    q("Antes, ¿con qué se escribían cartas?", [["💻", "Computadora"], ["🪶", "Pluma y tinta"], ["📱", "Celular"]], 1, "Pista: se mojaba en un frasquito.", { promptEmoji: "✉️" }),
    q("Antes, ¿dónde se lavaba la ropa?", [["🌊", "En el río"], ["🧺", "En el lavarropas"], ["🚗", "En el auto"]], 0, "Pista: se hacía a mano, con agua y jabón.", { promptEmoji: "👕" }),
    q("Hoy, ¿cómo hablamos con alguien lejano?", [["🕊️", "Con palomas"], ["🔔", "Con campanas"], ["📱", "Con el celular"]], 2, "Pista: lo llevamos en el bolsillo.", { promptEmoji: "🗣️" }),
    q("Antes, ¿cómo se cocinaba?", [["🔥", "Con fogón"], ["📟", "Con microondas"], ["🍳", "Con anafe eléctrico"]], 0, "Pista: se usaba fuego de verdad.", { promptEmoji: "🍲" }),
    q("¿Qué cosa usamos antes y también ahora?", [["🥄", "Cuchara"], ["📼", "Casete"], ["🪶", "Pluma"]], 0, "Pista: sirve para tomar la sopa.", { promptEmoji: "🔁" }),
    q("Antes, ¿en qué se viajaba al pueblo?", [["✈️", "Avión"], ["🐎", "Carro con caballos"], ["🚇", "Subte"]], 1, "Pista: lo tiraban animales.", { promptEmoji: "🕰️" }),
    q("¿Qué juguete existía hace mucho tiempo?", [["🎮", "Videojuego"], ["📱", "Tablet"], ["🪀", "Yoyó"]], 2, "Pista: no necesita pilas.", { promptEmoji: "🧸" }),
    q("Tocá todos los objetos de hoy", [["📱", "Celular"], ["💻", "Computadora"], ["🕯️", "Vela"], ["📺", "Tele"]], [0, 1, 3], "Pista: funcionan con electricidad.", { promptEmoji: "🆕" }),
  ],

  // 14. Cómo se Hacía Antes
  14: [
    q("Antes, ¿cómo se hacía el pan?", [["🙌", "Amasando a mano"], ["🏭", "En una fábrica"], ["🤖", "Con un robot"]], 0, "Pista: se usaban las manos y un horno de barro.", { promptEmoji: "🍞" }),
    q("¿Con qué se tejían mantas antes?", [["💻", "Computadora"], ["🧵", "Telar"], ["🖨️", "Impresora"]], 1, "Pista: es un marco con hilos.", { promptEmoji: "🧶" }),
    q("Antes, ¿quién tiraba del arado?", [["🚜", "Un tractor"], ["🐂", "Bueyes o caballos"], ["✈️", "Un avión"]], 1, "Pista: eran animales fuertes.", { promptEmoji: "🌾" }),
    q("Hoy, ¿qué usamos para hacer mucho pan junto?", [["🪨", "Piedras"], ["🔥", "Fogón"], ["⚙️", "Máquinas"]], 2, "Pista: funcionan con electricidad.", { promptEmoji: "🍞" }),
    q("Antes, ¿cómo esquilaban las ovejas?", [["✂️", "Con tijeras"], ["🔦", "Con linterna"], ["📱", "Con celular"]], 0, "Pista: era un trabajo con las manos.", { promptEmoji: "🐑" }),
    q("Hoy, ¿con qué esquilan muchas ovejas?", [["🥄", "Cucharas"], ["🪒", "Máquinas eléctricas"], ["🖍️", "Crayones"]], 1, "Pista: es más rápido que a mano.", { promptEmoji: "🐑" }),
    q("Antes, ¿con qué se iluminaban de noche?", [["🏮", "Faroles de aceite"], ["💡", "Lamparitas LED"], ["📺", "Pantallas"]], 0, "Pista: tenían una llamita.", { promptEmoji: "🌙" }),
    q("Hoy, ¿cómo se hace mucha tela?", [["🖐️", "Solo a mano"], ["🌀", "Con el viento"], ["🏭", "En fábricas"]], 2, "Pista: hay máquinas grandes.", { promptEmoji: "👕" }),
    q("¿Qué se usaba antes de los autos para viajar?", [["🛸", "Platos voladores"], ["🐎", "Caballos"], ["🛴", "Monopatines"]], 1, "Pista: es un animal que corre rápido.", { promptEmoji: "🕰️" }),
    q("Tocá todas las cosas hechas a mano antes", [["🍞", "Pan casero"], ["🧶", "Manta tejida"], ["🕯️", "Velas"], ["📱", "Celular"]], [0, 1, 2], "Pista: no necesitaban electricidad.", { promptEmoji: "🙌" }),
  ],

  // 15. Comprar y Vender
  15: [
    q("¿Con qué pagamos en el almacén?", [["💵", "Dinero"], ["🍂", "Hojas"], ["🪨", "Piedras"]], 0, "Pista: son billetes y monedas.", { promptEmoji: "🏪" }),
    q("¿Quién nos vende el pan?", [["🧑‍🍳", "El panadero"], ["🧑‍🚒", "El bombero"], ["🧑‍✈️", "El piloto"]], 0, "Pista: trabaja en la panadería.", { promptEmoji: "🍞" }),
    q("¿Dónde compramos frutas y verduras?", [["💈", "Peluquería"], ["🥬", "Verdulería"], ["📚", "Biblioteca"]], 1, "Pista: el nombre tiene «verdu».", { promptEmoji: "🍎" }),
    q("Si cambio una figurita por otra, estoy…", [["😴", "Durmiendo"], ["🎤", "Cantando"], ["🔁", "Intercambiando"]], 2, "Pista: yo doy una y recibo otra.", { promptEmoji: "🃏" }),
    q("¿Qué nos dan si pagamos con más dinero?", [["🪙", "Vuelto"], ["🎁", "Regalo"], ["🍬", "Caramelo"]], 0, "Pista: es el dinero que sobra.", { promptEmoji: "💵" }),
    q("¿Qué dice cuánto cuesta algo?", [["🎀", "El moño"], ["🏷️", "El precio"], ["📦", "La caja"]], 1, "Pista: está en una etiqueta.", { promptEmoji: "🛒" }),
    q("¿Dónde guardo monedas para ahorrar?", [["🐷", "Alcancía"], ["🗑️", "Tacho"], ["🥣", "Bol de sopa"]], 0, "Pista: muchas tienen forma de chanchito.", { promptEmoji: "🪙" }),
    q("El almacenero compra caramelos y los vende. ¿Qué gana?", [["🌧️", "Lluvia"], ["💵", "Dinero"], ["🍂", "Hojas"]], 1, "Pista: así puede pagar sus cosas.", { promptEmoji: "🏪" }),
    q("¿Qué llevamos para cargar las compras?", [["🛍️", "Bolsa"], ["🎈", "Globo"], ["🧢", "Gorra"]], 0, "Pista: tiene manijas.", { promptEmoji: "🛒" }),
    q("Tocá todo lo que podemos comprar en un kiosco", [["🍬", "Caramelos"], ["🧃", "Jugo"], ["🍫", "Chocolate"], ["🐄", "Una vaca"]], [0, 1, 2], "Pista: son cosas chiquitas.", { promptEmoji: "🏪" }),
  ],

  // 16. Los Pueblos Originarios (aonikenk / tehuelche)
  16: [
    q("¿Qué pueblo originario vive en Santa Cruz desde hace mucho?", [["🪶", "Aonikenk"], ["🗽", "Neoyorquinos"], ["🗼", "Parisinos"]], 0, "Pista: también se los llama tehuelches.", { promptEmoji: "🌄" }),
    q("¿Qué animal cazaban los aonikenk?", [["🦁", "León"], ["🦙", "Guanaco"], ["🐘", "Elefante"]], 1, "Pista: vive en la estepa patagónica.", { promptEmoji: "🏹" }),
    q("¿Con qué cubrían sus toldos los aonikenk?", [["🦙", "Cuero de guanaco"], ["🧱", "Ladrillos"], ["🪟", "Vidrio"]], 0, "Pista: venía de un animal de la estepa.", { promptEmoji: "⛺" }),
    q("¿Cómo se llama la manta de pieles que usaban?", [["🧣", "Bufanda"], ["👘", "Kimono"], ["🦙", "Quillango"]], 2, "Pista: se hacía con pieles de guanaco cosidas.", { promptEmoji: "🥶" }),
    q("Los aonikenk se mudaban según las estaciones. Eran…", [["🧳", "Nómades"], ["🏢", "Oficinistas"], ["🚀", "Astronautas"]], 0, "Pista: no vivían siempre en el mismo lugar.", { promptEmoji: "🧭" }),
    q("¿Qué ave grande también cazaban?", [["🦜", "Loro"], ["🦚", "Pavo real"], ["🪶", "Choique"]], 2, "Pista: corre muy rápido y no vuela.", { promptEmoji: "🏹" }),
    q("¿Qué usaban para cazar, hecho con piedras y tientos?", [["🎯", "Boleadoras"], ["🎈", "Globo"], ["🎣", "Caña"]], 0, "Pista: se revoleaban y se lanzaban.", { promptEmoji: "🪨" }),
    q("¿Dónde vivían los aonikenk?", [["🏰", "Castillos"], ["⛺", "Toldos"], ["🏢", "Edificios"]], 1, "Pista: se podían armar y desarmar.", { promptEmoji: "🌄" }),
    q("¿Hay personas aonikenk hoy?", [["✅", "Sí, todavía"], ["❌", "No, ninguna"], ["❓", "Nunca existieron"]], 0, "Pista: sus familias siguen viviendo en la Patagonia.", { promptEmoji: "🧑" }),
    q("¿Cómo debemos tratar las culturas originarias?", [["🙈", "Burlarnos"], ["🙉", "No escucharlas"], ["🤝", "Con respeto"]], 2, "Pista: todas las culturas merecen cuidado.", { promptEmoji: "🪶" }),
  ],

  // 17. Huellas del Pasado
  17: [
    q("¿Dónde vemos objetos antiguos?", [["🏛️", "En el museo"], ["🏪", "En el kiosco"], ["⛽", "En la estación"]], 0, "Pista: allí se guardan cosas viejas para cuidarlas.", { promptEmoji: "🏺" }),
    q("¿Qué objeto es del pasado?", [["📱", "Celular"], ["📻", "Radio antigua"], ["💻", "Notebook"]], 1, "Pista: tiene perillas grandes y es muy viejo.", { promptEmoji: "🕰️" }),
    q("En la Cueva de las Manos hay pinturas de…", [["✋", "Manos"], ["🚗", "Autos"], ["📺", "Teles"]], 0, "Pista: el nombre de la cueva lo dice.", { promptEmoji: "🪨" }),
    q("¿Quién nos cuenta historias de antes?", [["👶", "Un bebé"], ["🐸", "Una rana"], ["👴", "Un abuelo"]], 2, "Pista: vivió muchos años.", { promptEmoji: "🗣️" }),
    q("Una foto en blanco y negro es probablemente…", [["🆕", "De hoy"], ["🕰️", "De hace mucho"], ["🔮", "Del futuro"]], 1, "Pista: antes las fotos no tenían colores.", { promptEmoji: "🖼️" }),
    q("¿Qué podemos aprender de un objeto viejo?", [["📜", "La vida antigua"], ["🌦️", "El clima futuro"], ["🔢", "Las tablas"]], 0, "Pista: los objetos cuentan historias.", { promptEmoji: "🏺" }),
    q("¿Qué se encuentra excavando en la tierra?", [["🍕", "Pizzas"], ["🦴", "Restos antiguos"], ["📺", "Programas de tele"]], 1, "Pista: pueden ser de hace muchísimo tiempo.", { promptEmoji: "⛏️" }),
    q("¿Cómo cuidamos un objeto en el museo?", [["👀", "Mirando sin tocar"], ["🔨", "Golpeándolo"], ["✏️", "Rayándolo"]], 0, "Pista: así dura muchos años más.", { promptEmoji: "🏛️" }),
    q("¿Qué guarda la abuela que era de su abuela?", [["🧃", "Un jugo nuevo"], ["📱", "Un celular nuevo"], ["🧵", "Un costurero viejo"]], 2, "Pista: es algo que pasó de familia en familia.", { promptEmoji: "👵" }),
    q("Tocá todas las huellas del pasado", [["🏺", "Vasija antigua"], ["📜", "Carta vieja"], ["🖼️", "Foto antigua"], ["📱", "Celular nuevo"]], [0, 1, 2], "Pista: son cosas de hace mucho tiempo.", { promptEmoji: "🕰️" }),
  ],

  // 18. Fiestas y Fechas Patrias
  18: [
    q("¿Cuáles son los colores de la bandera argentina?", [["☁️", "Celeste y blanco"], ["❤️", "Rojo y blanco"], ["💚", "Verde y amarillo"]], 0, "Pista: son los colores del cielo con nubes.", { promptEmoji: "🇦🇷" }),
    q("¿Quién creó la bandera argentina?", [["🐎", "San Martín"], ["🇦🇷", "Manuel Belgrano"], ["⛵", "Colón"]], 1, "Pista: lo recordamos el 20 de Junio.", { promptEmoji: "🏳️" }),
    q("¿Qué festejamos el 9 de Julio?", [["🎄", "Navidad"], ["📜", "La Independencia"], ["🎂", "Mi cumpleaños"]], 1, "Pista: es el día en que la Argentina se declaró libre.", { promptEmoji: "🇦🇷" }),
    q("¿Qué nos ponemos en el pecho en las fechas patrias?", [["🏵️", "Escarapela"], ["🎀", "Moño rojo"], ["🧷", "Alfiler"]], 0, "Pista: es celeste y blanca, y redonda.", { promptEmoji: "🇦🇷" }),
    q("¿Qué día es el Día de la Bandera?", [["🎆", "1 de Enero"], ["🎃", "31 de Octubre"], ["🏳️", "20 de Junio"]], 2, "Pista: es en invierno, en junio.", { promptEmoji: "🇦🇷" }),
    q("¿A quién recordamos el 17 de Agosto?", [["🐎", "San Martín"], ["🤴", "Un rey"], ["🎅", "Papá Noel"]], 0, "Pista: cruzó la cordillera de los Andes.", { promptEmoji: "🏔️" }),
    q("¿Qué recordamos el 25 de Mayo?", [["🎒", "Inicio de clases"], ["🏛️", "El primer gobierno"], ["🎄", "Navidad"]], 1, "Pista: pasó en el Cabildo, en 1810.", { promptEmoji: "☂️" }),
    q("¿Qué cantamos en los actos patrios?", [["🎂", "Feliz cumpleaños"], ["🎶", "El Himno Nacional"], ["🦆", "Los patitos"]], 1, "Pista: empieza con «Oíd, mortales».", { promptEmoji: "🎤" }),
    q("¿Qué hay en el centro de la bandera argentina?", [["⭐", "Una estrella"], ["🌙", "Una luna"], ["☀️", "Un sol"]], 2, "Pista: brilla de día.", { promptEmoji: "🇦🇷" }),
    q("Tocá todo lo que vemos en un acto patrio", [["🇦🇷", "Bandera"], ["🏵️", "Escarapela"], ["🎶", "Himno"], ["🎃", "Calabaza de Halloween"]], [0, 1, 2], "Pista: son símbolos de nuestra patria.", { promptEmoji: "🏫" }),
  ],
};
