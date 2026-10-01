import type { ActivitySpec } from "@/lib/activities";
import { makeClassify, makeMultiPick, makeOrder, makeStoryPick, Q, q } from "./util";

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

// Actividades de variedad (order, classify, story, multi-pick) por número de mundo.
export const EXTRA_SOCIALES: Record<number, ActivitySpec[]> = {
  // 1. Mi Historia (s-identidad, s-tiempo)
  1: [
    makeOrder(
      "s1-ex-0",
      "Ordená las etapas de una persona a lo largo del tiempo:",
      ["Nacer como un bebé", "Aprender a caminar y hablar", "Empezar primer grado"],
      "Pista: primero nacemos chiquitos y luego vamos creciendo paso a paso.",
      ["s-identidad", "s-tiempo"]
    ),
    makeClassify(
      "s1-ex-1",
      "¿Cuándo se usa cada cosa?",
      ["Cuando era bebé", "Ahora en primer grado"],
      [
        { label: "🍼 Mamadera", cat: 0 },
        { label: "🎒 Mochila escolar", cat: 1 },
        { label: "🧷 Pañal", cat: 0 },
        { label: "✏️ Cuaderno", cat: 1 },
      ],
      "Pista: pensá qué usabas de chiquito y qué usás ahora en la escuela.",
      ["s-identidad", "s-tiempo"]
    ),
    makeStoryPick(
      "s1-ex-2",
      {
        title: "El álbum del abuelo",
        text: "El abuelo Juan abrió un álbum con fotos viejas. Me mostró una foto donde yo tenía un año y estaba aprendiendo a comer solito con una cuchara de plástico.",
      },
      "¿Qué le mostró el abuelo Juan en la foto?",
      [["🖼️", "Fotos de cuando era bebé"], ["📺", "Un video en la tele"], ["🚗", "Un autito nuevo"]],
      0,
      "Pista: escuchá el cuento: el abuelo abrió un álbum de fotos.",
      ["s-identidad", "s-tiempo"]
    ),
  ],

  // 2. Mi Familia y mis Amigos (s-identidad)
  2: [
    makeClassify(
      "s2-ex-0",
      "Clasificá las acciones en familia o con amigos:",
      ["En familia", "Con amigos"],
      [
        { label: "🍲 Cenar juntos en casa", cat: 0 },
        { label: "⚽ Jugar en el recreo", cat: 1 },
        { label: "🛏️ Ordenar mi pieza", cat: 0 },
        { label: "🤝 Compartir lápices en clase", cat: 1 },
      ],
      "Pista: pensá qué hacés en tu hogar y qué compartís en la escuela.",
      ["s-identidad"]
    ),
    makeStoryPick(
      "s2-ex-1",
      {
        title: "La manzana compartida",
        text: "Lucas llegó a la escuela triste porque olvidó su merienda en casa. Su amiga Sofía partió su manzana al medio y le regaló la mitad con una gran sonrisa.",
      },
      "¿Qué hizo Sofía para ayudar a su amigo Lucas?",
      [["🍎", "Compartió su manzana"], ["🏃", "Se fue corriendo sola"], ["🙈", "No le habló"]],
      0,
      "Pista: Sofía fue una buena amiga y dividió su comida.",
      ["s-identidad"]
    ),
    makeMultiPick(
      "s2-ex-2",
      "Tocá todas las cosas lindas que compartimos con amigos:",
      [["⚽", "Juegos divertidos"], ["🤗", "Cariño y risas"], ["😠", "Peleas y empujones"], ["📚", "Lectura de cuentos"]],
      [0, 1, 3],
      "Pista: hay más de una. Pensá en lo que te hace sentir bien con amigos.",
      ["s-identidad"]
    ),
  ],

  // 3. Lo que Necesitamos (s-convivencia, s-trabajos)
  3: [
    makeClassify(
      "s3-ex-0",
      "¿Es una necesidad básica o un deseo?",
      ["Necesidad básica", "Deseo o gusto"],
      [
        { label: "💧 Agua para beber", cat: 0 },
        { label: "🎮 Videojuego nuevo", cat: 1 },
        { label: "🏠 Casa abrigada", cat: 0 },
        { label: "🍭 Chupetín gigante", cat: 1 },
      ],
      "Pista: las necesidades básicas son indispensables para vivir y crecer sanos.",
      ["s-convivencia", "s-trabajos"]
    ),
    makeOrder(
      "s3-ex-1",
      "Ordená cómo llega el pan a nuestra mesa:",
      ["El campesino cosecha el trigo", "El panadero amasa y hornea", "Compramos el pan en el almacén"],
      "Pista: primero se cosecha el trigo en el campo antes de hacer la harina.",
      ["s-convivencia", "s-trabajos"]
    ),
    makeStoryPick(
      "s3-ex-2",
      {
        title: "Invierno en Gregores",
        text: "En Gobernador Gregores el invierno llegó con mucho frío y viento. En la casa de Nico encendieron el calefactor y mamá preparó una sopa caliente para abrigar a la familia.",
      },
      "¿Qué necesitaron en la casa de Nico para protegerse del frío?",
      [["🔥", "Calefactor y comida caliente"], ["🍦", "Helado de agua"], ["🩴", "Ojotas y remera corta"]],
      0,
      "Pista: en el invierno patagónico necesitamos abrigo y calor en el hogar.",
      ["s-convivencia", "s-trabajos"]
    ),
  ],

  // 4. Las Instituciones de mi Pueblo (s-trabajos, s-espacios)
  4: [
    makeClassify(
      "s4-ex-0",
      "¿A qué lugar del pueblo corresponde cada tarea?",
      ["Hospital o salita", "Escuela"],
      [
        { label: "👩‍⚕️ Curar a los enfermos", cat: 0 },
        { label: "🧑‍🏫 Enseñar a leer y escribir", cat: 1 },
        { label: "💉 Poner vacunas", cat: 0 },
        { label: "📚 Aprender en el aula", cat: 1 },
      ],
      "Pista: los médicos cuidan la salud y las maestras enseñan.",
      ["s-trabajos", "s-espacios"]
    ),
    makeOrder(
      "s4-ex-1",
      "Ordená los pasos para pedir un libro en la biblioteca:",
      ["Elegir un libro de los estantes", "Anotarlo con la bibliotecaria", "Llevarlo y cuidarlo en casa"],
      "Pista: primero buscamos el libro que nos gusta antes de anotarlo.",
      ["s-trabajos", "s-espacios"]
    ),
    makeStoryPick(
      "s4-ex-2",
      {
        title: "Visita a los bomberos",
        text: "El grado fue a visitar el cuartel de bomberos voluntarios. El bombero Carlos les mostró el camión autobomba, la sirena y los trajes especiales que usan para apagar incendios.",
      },
      "¿Quiénes trabajan cuidando al pueblo de los incendios?",
      [["🧑‍🚒", "Los bomberos voluntarios"], ["👨‍🍳", "Los cocineros"], ["🧑‍🌾", "Los granjeros"]],
      0,
      "Pista: usan camión autobomba y mangueras con agua.",
      ["s-trabajos", "s-espacios"]
    ),
  ],

  // 5. Normas y Acuerdos (s-convivencia)
  5: [
    makeClassify(
      "s5-ex-0",
      "Clasificá las actitudes para convivir en el aula:",
      ["Ayuda a convivir", "Trae problemas"],
      [
        { label: "👂 Escuchar a la maestra", cat: 0 },
        { label: "💥 Empujar en la fila", cat: 1 },
        { label: "🙏 Pedir por favor y gracias", cat: 0 },
        { label: "📢 Gritar e interrumpir", cat: 1 },
      ],
      "Pista: el respeto y la amabilidad ayudan a convivir mejor.",
      ["s-convivencia"]
    ),
    makeOrder(
      "s5-ex-1",
      "Ordená los pasos para cruzar la calle con seguridad:",
      ["Parar en la esquina y mirar", "Esperar que los autos frenen", "Cruzar por la senda peatonal"],
      "Pista: nunca cruzamos corriendo sin mirar primero a los dos lados.",
      ["s-convivencia"]
    ),
    makeStoryPick(
      "s5-ex-2",
      {
        title: "El turno de la hamaca",
        text: "En el recreo, Lucas y Mili querían la misma hamaca. La maestra les propuso un acuerdo: contar hasta veinte cada uno para turnarse y que los dos pudieran jugar.",
      },
      "¿Cómo resolvieron el conflicto en el recreo?",
      [["🤝", "Hicieron un acuerdo para turnarse"], ["😠", "Se pelearon y lloraron"], ["🏃", "Rompieron la hamaca"]],
      0,
      "Pista: dialogaron y llegaron a un acuerdo justo.",
      ["s-convivencia"]
    ),
  ],

  // 6. Derechos y Deberes (s-convivencia)
  6: [
    makeClassify(
      "s6-ex-0",
      "¿Es un derecho de los niños o un deber?",
      ["Derecho", "Deber o responsabilidad"],
      [
        { label: "🏥 Recibir atención médica", cat: 0 },
        { label: "🧸 Guardar los juguetes", cat: 1 },
        { label: "🏫 Ir a la escuela a aprender", cat: 0 },
        { label: "✏️ Cuidar los útiles escolares", cat: 1 },
      ],
      "Pista: los derechos nos protegen a todos y los deberes son nuestras responsabilidades.",
      ["s-convivencia"]
    ),
    makeStoryPick(
      "s6-ex-1",
      {
        title: "El derecho a la identidad",
        text: "Cuando Clara nació, sus papás la anotaron en el registro civil. Le hicieron su documento de identidad con su nombre, su apellido y su foto.",
      },
      "¿Para qué sirve el documento nacional de identidad?",
      [["🪪", "Para tener nombre y ser reconocidos"], ["🎟️", "Para entrar al cine gratis"], ["🍫", "Para comprar golosinas"]],
      0,
      "Pista: todos los niños tienen derecho a un nombre y una identidad.",
      ["s-convivencia"]
    ),
    makeMultiPick(
      "s6-ex-2",
      "Tocá todos los derechos fundamentales de los niños:",
      [["👶", "Tener un nombre y una familia"], ["🩺", "Cuidado de la salud"], ["⚽", "Tiempo para jugar y descansar"], ["💼", "Trabajar en una oficina"]],
      [0, 1, 2],
      "Pista: hay tres derechos. Los niños no deben trabajar.",
      ["s-convivencia"]
    ),
  ],

  // 7. Campo y Ciudad (s-espacios)
  7: [
    makeClassify(
      "s7-ex-0",
      "¿De dónde es típico cada elemento?",
      ["Del campo patagónico", "De la ciudad"],
      [
        { label: "🐑 Gran rebaño de ovejas", cat: 0 },
        { label: "🏢 Edificios con semáforos", cat: 1 },
        { label: "🌾 Molino de viento y corrales", cat: 0 },
        { label: "🚌 Colectivos y mucho tránsito", cat: 1 },
      ],
      "Pista: en el campo hay espacios abiertos y en la ciudad muchas construcciones juntas.",
      ["s-espacios"]
    ),
    makeStoryPick(
      "s7-ex-1",
      {
        title: "Un paseo por la estancia",
        text: "Facundo vive en la ciudad de Río Gallegos y fue a visitar la estancia de sus tíos. Se maravilló con la tranquilidad, los caminos de tierra y los caballos pastando libres.",
      },
      "¿Qué conoció Facundo en el campo?",
      [["🐎", "Caballos y caminos de tierra"], ["🏬", "Un shopping de cinco pisos"], ["🚦", "Muchos semáforos en las esquinas"]],
      0,
      "Pista: en la estancia hay animales y naturaleza abierta.",
      ["s-espacios"]
    ),
    makeMultiPick(
      "s7-ex-2",
      "Tocá lo que podemos encontrar en una zona rural de Santa Cruz:",
      [["🚜", "Tractores y molinos"], ["🦙", "Guanacos en la meseta"], ["🐑", "Corrales con ovejas"], ["🚇", "Estaciones de subte bajo tierra"]],
      [0, 1, 2],
      "Pista: en la meseta y el campo patagónico no hay trenes subterráneos.",
      ["s-espacios"]
    ),
  ],

  // 8. Naturaleza y Construcciones (s-espacios)
  8: [
    makeClassify(
      "s8-ex-0",
      "¿Lo hizo la naturaleza o las personas?",
      ["Elemento natural", "Construido por personas"],
      [
        { label: "🌊 Río Santa Cruz", cat: 0 },
        { label: "🌉 Puente de cemento", cat: 1 },
        { label: "⛰️ Cerro con piedras", cat: 0 },
        { label: "🏠 Casa de ladrillos", cat: 1 },
      ],
      "Pista: los elementos naturales no fueron fabricados por los seres humanos.",
      ["s-espacios"]
    ),
    makeOrder(
      "s8-ex-1",
      "Ordená los pasos para construir un puente sobre un arroyo:",
      ["Planear y medir el terreno", "Colocar las columnas de cemento", "Habilitar el paso de autos y peatones"],
      "Pista: primero se mide y se planifica antes de levantar la construcción.",
      ["s-espacios"]
    ),
    makeStoryPick(
      "s8-ex-2",
      {
        title: "Mirando el paisaje",
        text: "Desde lo alto de una loma, Julieta observaba el paisaje: el río y los cerros existían desde hace miles de años, pero la ruta asfaltada y los postes de luz los construyeron las personas.",
      },
      "¿Qué construyeron las personas en ese paisaje?",
      [["🛣️", "La ruta y los postes de luz"], ["⛰️", "Las montañas y las rocas"], ["☁️", "Las nubes del cielo"]],
      0,
      "Pista: las personas construyen caminos e instalaciones para comunicarse.",
      ["s-espacios"]
    ),
  ],

  // 9. Del Campo a la Mesa (s-trabajos, s-espacios)
  9: [
    makeOrder(
      "s9-ex-0",
      "Ordená el circuito productivo de la lana:",
      ["Esquilar la oveja en la estancia", "Lavar e hilar la lana", "Tejer un pulóver abrigado"],
      "Pista: la lana sale del vellón de la oveja antes de ser hilada y tejida.",
      ["s-trabajos", "s-espacios"]
    ),
    makeClassify(
      "s9-ex-1",
      "¿De dónde obtenemos estos productos?",
      ["De los animales", "De las plantas"],
      [
        { label: "🥛 Leche fresca", cat: 0 },
        { label: "🍎 Manzanas dulces", cat: 1 },
        { label: "🧶 Lana de oveja", cat: 0 },
        { label: "🥕 Zanahorias de la huerta", cat: 1 },
      ],
      "Pista: las vacas y ovejas son animales; las frutas y verduras vienen de plantas.",
      ["s-trabajos", "s-espacios"]
    ),
    makeStoryPick(
      "s9-ex-2",
      {
        title: "La esquila en primavera",
        text: "En primavera, los esquiladores visitan las estancias santacruceñas. Con tijeras especiales y mucho cuidado cortan la lana de las ovejas para armar fardos y enviarla a las hilanderías.",
      },
      "¿Por qué se esquilan las ovejas en la estancia?",
      [["✂️", "Para aprovechar la lana y aliviarles el calor"], ["🎨", "Para pintarlas de colores"], ["🏊", "Para que naden en el río"]],
      0,
      "Pista: la lana abriga a las personas y a la oveja le crece de nuevo.",
      ["s-trabajos", "s-espacios"]
    ),
  ],

  // 10. Servicios de mi Localidad (s-espacios, s-trabajos)
  10: [
    makeClassify(
      "s10-ex-0",
      "¿A qué servicio público corresponde cada tarea?",
      ["Servicio de agua", "Servicio de luz"],
      [
        { label: "🚰 Arreglar caños de agua potable", cat: 0 },
        { label: "💡 Reparar cables y postes de luz", cat: 1 },
        { label: "🧪 Cuidar la limpieza del tanque", cat: 0 },
        { label: "🔌 Mantener transformadores eléctricos", cat: 1 },
      ],
      "Pista: el agua viaja por cañerías y la electricidad por cables.",
      ["s-espacios", "s-trabajos"]
    ),
    makeStoryPick(
      "s10-ex-1",
      {
        title: "El agua en el pueblo",
        text: "Don Ramón trabaja en la planta de agua potable del pueblo. Nos enseñó que potabilizar el agua lleva mucho trabajo y que en la Patagonia debemos cuidarla sin dejar canillas goteando.",
      },
      "¿Qué nos enseñó Don Ramón sobre el agua?",
      [["💧", "Cuidarla y no dejar canillas abiertas"], ["🚿", "Manguerear la vereda todo el día"], ["🎈", "Llenar mil bombitas de agua"]],
      0,
      "Pista: el agua es un recurso valioso que todos debemos cuidar.",
      ["s-espacios", "s-trabajos"]
    ),
    makeMultiPick(
      "s10-ex-2",
      "Tocá los servicios públicos que necesitamos en nuestra localidad:",
      [["💡", "Alumbrado público en las calles"], ["🚒", "Cuartel de bomberos"], ["🚰", "Red de agua potable"], ["🚀", "Cohete espacial para ir al cole"]],
      [0, 1, 2],
      "Pista: son servicios esenciales para la vida diaria de los vecinos.",
      ["s-espacios", "s-trabajos"]
    ),
  ],

  // 11. Los Transportes (s-espacios)
  11: [
    makeClassify(
      "s11-ex-0",
      "¿Por dónde se desplaza cada medio de transporte?",
      ["Por tierra", "Por aire o agua"],
      [
        { label: "🚌 Colectivo de pasajeros", cat: 0 },
        { label: "✈️ Avión de línea", cat: 1 },
        { label: "🚚 Camión con acoplado", cat: 0 },
        { label: "🚢 Barco de carga", cat: 1 },
      ],
      "Pista: los colectivos y camiones tienen ruedas y van por caminos.",
      ["s-espacios"]
    ),
    makeOrder(
      "s11-ex-1",
      "Ordená cómo viajaban las personas según la época:",
      ["En carretas y a caballo", "En tren a vapor por las vías", "En aviones y autos modernos"],
      "Pista: los caballos y carretas fueron los primeros medios de transporte terrestre.",
      ["s-espacios"]
    ),
    makeStoryPick(
      "s11-ex-2",
      {
        title: "El colectivo del campo",
        text: "Don Tito maneja el colectivo que une los parajes rurales con la ciudad. Los vecinos viajan con paquetes para vender sus tejidos o hacer compras en los almacenes del pueblo.",
      },
      "¿Para qué usan los vecinos el colectivo rural?",
      [["🚌", "Para viajar al pueblo y hacer compras"], ["🏖️", "Para ir a la playa tropical"], ["🚀", "Para viajar a la Luna"]],
      0,
      "Pista: el colectivo comunica el campo con la localidad.",
      ["s-espacios"]
    ),
  ],

  // 12. Mapas, Planos y Croquis (s-espacios)
  12: [
    makeClassify(
      "s12-ex-0",
      "¿Cómo vemos este objeto en el dibujo?",
      ["Visto desde arriba (plano)", "Visto de frente"],
      [
        { label: "⭕ Mesa redonda como un círculo", cat: 0 },
        { label: "🚪 Puerta con su picaporte", cat: 1 },
        { label: "🛏️ Cama como un rectángulo", cat: 0 },
        { label: "🪟 Ventana con sus cortinas", cat: 1 },
      ],
      "Pista: en los planos miramos las cosas desde arriba como si voláramos.",
      ["s-espacios"]
    ),
    makeStoryPick(
      "s12-ex-1",
      {
        title: "El plano del aula",
        text: "La señorita dibujó en una cartulina el plano del salón de primer grado visto desde arriba: cuadraditos para los bancos de los chicos, un rectángulo grande para su escritorio y la puerta.",
      },
      "¿Desde dónde se mira para dibujar un plano?",
      [["🦅", "Desde arriba, con vista aérea"], ["🕳️", "Desde abajo de la tierra"], ["🙈", "Con los ojos tapados"]],
      0,
      "Pista: un plano muestra la posición de las cosas miradas desde arriba.",
      ["s-espacios"]
    ),
    makeMultiPick(
      "s12-ex-2",
      "Tocá lo que podemos representar en el plano de una casa:",
      [["🛏️", "Los dormitorios y camas"], ["🍳", "La cocina y la mesa"], ["🚪", "Las puertas y pasillos"], ["🌧️", "Una tormenta con truenos"]],
      [0, 1, 2],
      "Pista: los planos muestran las habitaciones y muebles de una vivienda.",
      ["s-espacios"]
    ),
  ],

  // 13. Antes y Ahora (s-tiempo)
  13: [
    makeClassify(
      "s13-ex-0",
      "¿De qué época es cada objeto?",
      ["De hace muchos años (pasado)", "De la actualidad (presente)"],
      [
        { label: "🕯️ Vela para alumbrar la noche", cat: 0 },
        { label: "📱 Teléfono celular táctil", cat: 1 },
        { label: "✒️ Pluma con tintero para escribir", cat: 0 },
        { label: "💻 Computadora portátil", cat: 1 },
      ],
      "Pista: antes no existían las pantallas electrónicas ni la luz eléctrica.",
      ["s-tiempo"]
    ),
    makeOrder(
      "s13-ex-1",
      "Ordená la forma de escuchar música en el tiempo:",
      ["Fonógrafo con bocina", "Radio a transistores", "Celular con música digital"],
      "Pista: el fonógrafo fue el primer aparato para reproducir sonido grabado.",
      ["s-tiempo"]
    ),
    makeStoryPick(
      "s13-ex-2",
      {
        title: "La plancha de carbón",
        text: "La abuela Norma guarda una plancha de hierro muy pesada. Le contó a sus nietos que antes no había electricidad y había que ponerle brasas calientes adentro para planchar.",
      },
      "¿Qué se usaba antes para calentar la plancha?",
      [["🪵", "Brasas y carbones calientes"], ["🔋", "Baterías recargables"], ["❄️", "Hielo del freezer"]],
      0,
      "Pista: el calor de las brasas calentaba el metal de la plancha.",
      ["s-tiempo"]
    ),
  ],

  // 14. Cómo se Hacía Antes (s-tiempo, s-trabajos)
  14: [
    makeOrder(
      "s14-ex-0",
      "Ordená los pasos para hacer pan en horno de barro:",
      ["Amasar la harina con agua y levadura", "Dejar leudar la masa al calor", "Cocinar los panes con leña en el horno"],
      "Pista: la masa necesita descansar para leudar antes de entrar al horno.",
      ["s-tiempo", "s-trabajos"]
    ),
    makeClassify(
      "s14-ex-1",
      "¿Cómo se realiza este trabajo?",
      ["Artesanal a mano", "Con máquinas industriales"],
      [
        { label: "🧶 Tejer una bufanda con dos agujas", cat: 0 },
        { label: "🏭 Fábrica textil con telares automáticos", cat: 1 },
        { label: "🥣 Batir masa a mano en un fuentón", cat: 0 },
        { label: "⚙️ Amasadora eléctrica gigante", cat: 1 },
      ],
      "Pista: lo artesanal se hace con herramientas simples y las manos del trabajador.",
      ["s-tiempo", "s-trabajos"]
    ),
    makeStoryPick(
      "s14-ex-2",
      {
        title: "La rueca de doña Rosa",
        text: "Doña Rosa aprendió de su mamá a hilar lana. Con el pedal de su rueca hace girar la rueda de madera y transforma los vellones de oveja en ovillos listos para tejer.",
      },
      "¿Qué herramienta usa doña Rosa para hilar lana a mano?",
      [["🧵", "Una rueca tradicional de madera"], ["🚜", "Un tractor con motor"], ["📺", "Un televisor a color"]],
      0,
      "Pista: la rueca es una herramienta antigua para hacer hilos.",
      ["s-tiempo", "s-trabajos"]
    ),
  ],

  // 15. Comprar y Vender (s-trabajos)
  15: [
    makeOrder(
      "s15-ex-0",
      "Ordená los pasos al comprar en el almacén:",
      ["Elegir los productos necesarios", "Pagar el precio con dinero", "Recibir el vuelto y el comprobante"],
      "Pista: primero juntamos lo que vamos a comprar antes de acercarnos a pagar.",
      ["s-trabajos"]
    ),
    makeClassify(
      "s15-ex-1",
      "¿Se puede comprar con dinero en un negocio?",
      ["Se compra con dinero", "No se compra con dinero"],
      [
        { label: "🍞 Paquete de pan fresco", cat: 0 },
        { label: "🫂 El abrazo cariñoso de mamá", cat: 1 },
        { label: "✏️ Lápiz negro para escribir", cat: 0 },
        { label: "🤝 La verdadera amistad", cat: 1 },
      ],
      "Pista: los sentimientos y el afecto no tienen precio en dinero.",
      ["s-trabajos"]
    ),
    makeStoryPick(
      "s15-ex-2",
      {
        title: "El vuelto en la panadería",
        text: "Tomás fue a comprar una factura que costaba 300 pesos. Pagó con una moneda de 500 pesos y la panadera le devolvió 200 pesos de vuelto en la mano.",
      },
      "¿Por qué la panadera le dio dinero a Tomás?",
      [["🪙", "Porque le correspondía el vuelto"], ["🎁", "Porque era su cumpleaños"], ["🧹", "Porque ayudó a limpiar el piso"]],
      0,
      "Pista: cuando pagamos con más dinero del precio, nos devuelven la diferencia.",
      ["s-trabajos"]
    ),
  ],

  // 16. Los Pueblos Originarios (s-cultura, s-tiempo)
  16: [
    makeOrder(
      "s16-ex-0",
      "Ordená la forma de vida de los cazadores aonikenk:",
      ["Armar los toldos de cueros en el campamento", "Cazar guanacos y choiques en la meseta", "Trasladarse a otro lugar siguiendo a los animales"],
      "Pista: los aonikenk eran nómades y se mudaban según las estaciones.",
      ["s-cultura", "s-tiempo"]
    ),
    makeClassify(
      "s16-ex-1",
      "¿A qué pueblo o época pertenece cada elemento?",
      ["Pueblo Aonikenk (tehuelche)", "Época actual"],
      [
        { label: "🎯 Boleadoras de piedra y tiento", cat: 0 },
        { label: "📱 Teléfono celular inteligente", cat: 1 },
        { label: "⛺ Toldo de palos y cuero de guanaco", cat: 0 },
        { label: "🚗 Camioneta 4x4 por la ruta", cat: 1 },
      ],
      "Pista: los aonikenk usaban elementos naturales de la Patagonia para vivir.",
      ["s-cultura", "s-tiempo"]
    ),
    makeStoryPick(
      "s16-ex-2",
      {
        title: "El quillango aonikenk",
        text: "Para protegerse de las heladas y del viento patagónico, las familias aonikenk cosían capas con pieles de guanaco llamadas quillangos. Los pintaban con hermosos dibujos geométricos.",
      },
      "¿De qué estaban hechos los abrigados quillangos?",
      [["🦙", "De pieles de guanaco cosidas"], ["👕", "De tela sintética comprada"], ["📦", "De cartón corrugado"]],
      0,
      "Pista: el guanaco les daba alimento, abrigo y toldos.",
      ["s-cultura", "s-tiempo"]
    ),
  ],

  // 17. Huellas del Pasado (s-tiempo, s-cultura)
  17: [
    makeClassify(
      "s17-ex-0",
      "¿Dónde encontramos cada uno de estos elementos?",
      ["En un museo histórico", "En un supermercado"],
      [
        { label: "🏺 Vasija antigua de barro", cat: 0 },
        { label: "🥛 Sachet de leche pasteurizada", cat: 1 },
        { label: "🪨 Punta de flecha de piedra", cat: 0 },
        { label: "🍪 Paquete de galletitas dulces", cat: 1 },
      ],
      "Pista: los museos cuidan objetos valiosos de tiempos pasados.",
      ["s-tiempo", "s-cultura"]
    ),
    makeOrder(
      "s17-ex-1",
      "Ordená la historia de las pinturas en la Cueva de las Manos:",
      ["Cazadores antiguos pintaron sus manos en la roca", "Las pinturas se conservaron durante miles de años", "Hoy visitamos el cañadón y las protegemos con respeto"],
      "Pista: las pinturas fueron hechas hace miles de años y hoy las cuidamos.",
      ["s-tiempo", "s-cultura"]
    ),
    makeStoryPick(
      "s17-ex-2",
      {
        title: "El cañadón de las manos",
        text: "Al norte de Santa Cruz, cerca del río Pinturas, se encuentra la Cueva de las Manos. Los guías explican que nunca debemos tocar las paredes con las manos para no dañar las pinturas milenarias.",
      },
      "¿Por qué está prohibido tocar las pinturas rupestres?",
      [["✋", "Para cuidarlas y que duren muchos años más"], ["🎨", "Porque la pintura mancha la ropa"], ["🦖", "Porque sale un dinosaurio"]],
      0,
      "Pista: el contacto de las manos puede desgastar la roca y la pintura antigua.",
      ["s-tiempo", "s-cultura"]
    ),
  ],

  // 18. Fiestas y Fechas Patrias (s-cultura)
  18: [
    makeOrder(
      "s18-ex-0",
      "Ordená los momentos de un acto patrio en la escuela:",
      ["Ingreso de la Bandera de Ceremonias", "Cantar con respeto el Himno Nacional", "Palabras alusivas y representaciones artísticas"],
      "Pista: la bandera entra al comienzo para presidir el acto.",
      ["s-cultura"]
    ),
    makeClassify(
      "s18-ex-1",
      "¿Es un símbolo de la patria argentina?",
      ["Símbolo patrio argentino", "Objeto común del aula"],
      [
        { label: "🇦🇷 Bandera Celeste y Blanca", cat: 0 },
        { label: "✏️ Sacapuntas de plástico", cat: 1 },
        { label: "🏵️ Escarapela nacional", cat: 0 },
        { label: "📏 Regla de veinte centímetros", cat: 1 },
      ],
      "Pista: los símbolos patrios representan la identidad de nuestro país.",
      ["s-cultura"]
    ),
    makeStoryPick(
      "s18-ex-2",
      {
        title: "El 25 de Mayo en el Cabildo",
        text: "En mayo de 1810, los criollos se reunieron frente al Cabildo de Buenos Aires pidiendo un gobierno propio. Ese día nació nuestro primer gobierno patrio.",
      },
      "¿Dónde se reunió el pueblo el 25 de Mayo de 1810?",
      [["🏛️", "Frente al histórico Cabildo"], ["🏟️", "En una cancha de fútbol"], ["✈️", "En el aeropuerto internacional"]],
      0,
      "Pista: el Cabildo fue el edificio donde se tomó la decisión patria.",
      ["s-cultura"]
    ),
  ],
};
