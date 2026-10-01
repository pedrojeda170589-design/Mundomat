import type { ActivitySpec } from "@/lib/activities";
import { makeClassify, makeOrder, makeStoryPick, Q, q } from "./util";

// Banco de preguntas por número de mundo de Ciencias Naturales de 1.º.
export const NATURALES_BANK: Record<number, Q[]> = {
  // 1. Un Mundo Lleno de Vida
  1: [
    q("¿Cuál es un ser vivo?", [["🐶", "Perro"], ["🪨", "Piedra"], ["🧸", "Osito"]], 0, "Pista: nace, come y crece.", { promptEmoji: "🌱" }),
    q("¿Cuál NO es un ser vivo?", [["🌳", "Árbol"], ["🐦", "Pájaro"], ["🚗", "Auto"]], 2, "Pista: lo fabricaron las personas y no crece.", { promptEmoji: "🤔" }),
    q("¿Una planta es un ser vivo?", [["✅", "Sí"], ["❌", "No"], ["🤷", "Solo de noche"]], 0, "Pista: nace de una semilla y crece.", { promptEmoji: "🌱" }),
    q("¿Qué hacen todos los seres vivos?", [["🎤", "Cantan"], ["📏", "Crecen"], ["✈️", "Vuelan"]], 1, "Pista: pasa con las plantas, los animales y las personas.", { promptEmoji: "🌍" }),
    q("¿Cuál de estos es un ser vivo?", [["🤖", "Robot"], ["⚽", "Pelota"], ["🌻", "Girasol"]], 2, "Pista: necesita agua y sol para crecer.", { promptEmoji: "🌱" }),
    q("Una persona, ¿es un ser vivo?", [["❌", "No"], ["✅", "Sí"], ["🤷", "A veces"]], 1, "Pista: vos respirás, comés y crecés.", { promptEmoji: "🧒" }),
    q("¿Cuál de estos NO está vivo?", [["🐟", "Pez"], ["💧", "Gota de agua"], ["🌵", "Cactus"]], 1, "Pista: no nace ni crece como un bebé o una semilla.", { promptEmoji: "🤔" }),
    q("¿Qué necesita un ser vivo para vivir?", [["💧", "Agua"], ["📺", "Tele"], ["🎮", "Videojuegos"]], 0, "Pista: sin esto, las plantas se secan.", { promptEmoji: "🌍" }),
    q("Tocá todos los seres vivos", [["🐑", "Oveja"], ["🍄", "Hongo"], ["🌲", "Lenga"], ["🧱", "Ladrillo"]], [0, 1, 2], "Pista: hay más de uno. Todos nacen y crecen.", { promptEmoji: "🌱" }),
    q("¿Qué ser vivo es una planta?", [["🐄", "Vaca"], ["🌷", "Tulipán"], ["👧", "Nena"]], 1, "Pista: tiene hojas y flor.", { promptEmoji: "🌿" }),
  ],

  // 2. Plantas y Animales de mi Lugar
  2: [
    q("¿Qué animal vive en la estepa de Santa Cruz?", [["🦙", "Guanaco"], ["🦒", "Jirafa"], ["🐘", "Elefante"]], 0, "Pista: tiene cuello largo y pelaje marrón claro.", { promptEmoji: "🌄" }),
    q("¿Qué ave vive en la costa de Santa Cruz?", [["🦜", "Loro tropical"], ["🐧", "Pingüino"], ["🦚", "Pavo real"]], 1, "Pista: camina como bailando y nada en el mar.", { promptEmoji: "🌊" }),
    q("¿Qué ave grande vuela sobre las montañas?", [["🐔", "Gallina"], ["🦆", "Pato"], ["🦅", "Cóndor"]], 2, "Pista: es enorme y planea muy alto.", { promptEmoji: "🏔️" }),
    q("¿Qué planta da frutos violetas en Patagonia?", [["🫐", "Calafate"], ["🍌", "Banana"], ["🥥", "Coco"]], 0, "Pista: le dio nombre a una ciudad de Santa Cruz.", { promptEmoji: "🌿" }),
    q("¿Qué árbol crece en los bosques del sur?", [["🌴", "Palmera"], ["🌲", "Lenga"], ["🌵", "Cactus gigante"]], 1, "Pista: en otoño sus hojas se ponen rojas.", { promptEmoji: "🏔️" }),
    q("¿Qué animal de granja da lana en Santa Cruz?", [["🐷", "Chancho"], ["🐔", "Gallina"], ["🐑", "Oveja"]], 2, "Pista: hay muchas en las estancias.", { promptEmoji: "🧶" }),
    q("¿Qué ave corre rápido y no vuela?", [["🪶", "Choique"], ["🕊️", "Paloma"], ["🦅", "Águila"]], 0, "Pista: es parecida al avestruz.", { promptEmoji: "🌄" }),
    q("¿Qué animal salta en el mar del sur?", [["🐊", "Cocodrilo"], ["🐋", "Ballena"], ["🐪", "Camello"]], 1, "Pista: es enorme y echa agua por arriba.", { promptEmoji: "🌊" }),
    q("¿Qué animal de pelaje rojizo vive en la estepa?", [["🦓", "Cebra"], ["🐼", "Panda"], ["🦊", "Zorro colorado"]], 2, "Pista: tiene cola larga y peluda.", { promptEmoji: "🌄" }),
    q("Tocá todos los animales de la Patagonia", [["🦙", "Guanaco"], ["🐧", "Pingüino"], ["🦅", "Cóndor"], ["🦘", "Canguro"]], [0, 1, 2], "Pista: uno vive en otro continente, muy lejos.", { promptEmoji: "🗺️" }),
  ],

  // 3. ¿Cómo Son los Animales?
  3: [
    q("¿Qué cubre el cuerpo de un pájaro?", [["🪶", "Plumas"], ["🐟", "Escamas"], ["🧶", "Lana"]], 0, "Pista: le sirven para volar.", { promptEmoji: "🐦" }),
    q("¿Qué cubre el cuerpo de un pez?", [["🪶", "Plumas"], ["🐠", "Escamas"], ["🐻", "Pelos"]], 1, "Pista: son como plaquitas brillantes.", { promptEmoji: "🐟" }),
    q("¿Cómo se mueve un pez?", [["🏊", "Nada"], ["🦘", "Salta"], ["🕊️", "Vuela"]], 0, "Pista: vive en el agua.", { promptEmoji: "🐟" }),
    q("¿Cómo se mueve una serpiente?", [["🏃", "Corre con patas"], ["🕊️", "Vuela"], ["🐍", "Se arrastra"]], 2, "Pista: no tiene patas.", { promptEmoji: "🐍" }),
    q("¿Cuántas patas tiene un perro?", [["2️⃣", "Dos"], ["4️⃣", "Cuatro"], ["6️⃣", "Seis"]], 1, "Pista: contalas en el dibujo de un perro.", { promptEmoji: "🐕" }),
    q("¿Qué come la oveja?", [["🌾", "Pasto"], ["🍖", "Carne"], ["🍫", "Chocolate"]], 0, "Pista: la ves comiendo en el campo.", { promptEmoji: "🐑" }),
    q("¿Qué cubre el cuerpo del guanaco?", [["🐚", "Caparazón"], ["🪶", "Plumas"], ["🧶", "Pelos"]], 2, "Pista: es suave y lo abriga del frío.", { promptEmoji: "🦙" }),
    q("¿Cómo se mueve el cóndor?", [["🏊", "Nada"], ["🕊️", "Vuela"], ["🐍", "Se arrastra"]], 1, "Pista: tiene alas grandes.", { promptEmoji: "🦅" }),
    q("¿Qué animal tiene caparazón?", [["🐢", "Tortuga"], ["🐈", "Gato"], ["🐎", "Caballo"]], 0, "Pista: lleva su casa en la espalda.", { promptEmoji: "🐚" }),
    q("Tocá todos los animales que tienen plumas", [["🐔", "Gallina"], ["🐧", "Pingüino"], ["🐕", "Perro"], ["🦆", "Pato"]], [0, 1, 3], "Pista: son aves.", { promptEmoji: "🪶" }),
  ],

  // 4. ¿Cómo Son las Plantas?
  4: [
    q("¿Qué parte de la planta está bajo la tierra?", [["🥕", "Raíz"], ["🌸", "Flor"], ["🍃", "Hoja"]], 0, "Pista: chupa el agua del suelo.", { promptEmoji: "🌱" }),
    q("¿Qué parte de la planta suele ser verde y plana?", [["🍎", "Fruto"], ["🍃", "Hoja"], ["🥕", "Raíz"]], 1, "Pista: en otoño algunas se caen de los árboles.", { promptEmoji: "🌿" }),
    q("¿Qué necesita una planta para crecer?", [["🍬", "Caramelos"], ["🧸", "Juguetes"], ["☀️", "Luz del sol"]], 2, "Pista: está en el cielo de día.", { promptEmoji: "🌱" }),
    q("¿De dónde nace una planta nueva?", [["🌰", "Semilla"], ["🪨", "Piedra"], ["🔩", "Tornillo"]], 0, "Pista: se planta en la tierra.", { promptEmoji: "🌱" }),
    q("¿Qué parte del árbol es dura y alta?", [["🌸", "Flor"], ["🪵", "Tronco"], ["🍃", "Hoja"]], 1, "Pista: de ahí sale la madera.", { promptEmoji: "🌳" }),
    q("¿Qué parte de la planta es la manzana?", [["🥕", "Raíz"], ["🍃", "Hoja"], ["🍎", "Fruto"]], 2, "Pista: adentro tiene semillas.", { promptEmoji: "🌳" }),
    q("¿Qué pasa si una planta no recibe agua?", [["🥀", "Se seca"], ["🎉", "Hace fiesta"], ["📏", "Crece más"]], 0, "Pista: el agua es vida.", { promptEmoji: "💧" }),
    q("¿Qué parte de la planta tiene pétalos de colores?", [["🌸", "Flor"], ["🪵", "Tallo"], ["🥕", "Raíz"]], 0, "Pista: a las abejas les encanta.", { promptEmoji: "🐝" }),
    q("¿Qué parte sostiene a la flor?", [["🍎", "Fruto"], ["🌿", "Tallo"], ["🌰", "Semilla"]], 1, "Pista: es como un palito verde.", { promptEmoji: "🌷" }),
    q("Tocá todo lo que necesita una planta", [["💧", "Agua"], ["☀️", "Luz"], ["🟫", "Tierra"], ["📱", "Celular"]], [0, 1, 2], "Pista: son cosas de la naturaleza.", { promptEmoji: "🌱" }),
  ],

  // 5. Todos Crecemos
  5: [
    q("¿Qué hace un bebé con el tiempo?", [["📏", "Crece"], ["🔻", "Se achica"], ["🪨", "Se vuelve piedra"]], 0, "Pista: le pasa a todos los seres vivos.", { promptEmoji: "👶" }),
    q("¿Qué necesitamos las personas y los animales?", [["🎩", "Sombreros"], ["🌬️", "Respirar aire"], ["📺", "Tele"]], 1, "Pista: lo hacemos todo el tiempo, sin darnos cuenta.", { promptEmoji: "🫁" }),
    q("Un pollito crece y se convierte en…", [["🐔", "Gallina o gallo"], ["🐶", "Perro"], ["🐟", "Pez"]], 0, "Pista: el pollito nace de un huevo de gallina.", { promptEmoji: "🐣" }),
    q("¿Qué hacen las personas, animales y plantas?", [["🚗", "Manejan"], ["📖", "Leen"], ["💧", "Toman agua"]], 2, "Pista: sin eso no podemos vivir.", { promptEmoji: "🌍" }),
    q("Una semilla crece y se convierte en…", [["🪨", "Piedra"], ["🌱", "Planta"], ["🐛", "Gusano"]], 1, "Pista: le salen raíces y hojas.", { promptEmoji: "🌰" }),
    q("¿De dónde nacen los pájaros?", [["🥚", "De un huevo"], ["🌸", "De una flor"], ["☁️", "De una nube"]], 0, "Pista: la mamá lo pone en el nido.", { promptEmoji: "🪺" }),
    q("¿Cómo se llama la cría de la oveja?", [["🐣", "Pollito"], ["🐶", "Cachorro"], ["🐑", "Cordero"]], 2, "Pista: nace en primavera en las estancias.", { promptEmoji: "🐑" }),
    q("¿Qué necesitamos para tener energía?", [["🍎", "Comer"], ["🛁", "Bañarnos"], ["🎨", "Pintar"]], 0, "Pista: lo hacemos en el desayuno y el almuerzo.", { promptEmoji: "⚡" }),
    q("¿Cómo se llama la cría del guanaco?", [["🐥", "Pichón"], ["🦙", "Chulengo"], ["🐱", "Gatito"]], 1, "Pista: es un nombre especial de la Patagonia.", { promptEmoji: "🦙" }),
    q("Tocá todo lo que hacen los seres vivos", [["🍽️", "Se alimentan"], ["📏", "Crecen"], ["🌬️", "Respiran"], ["🔋", "Usan pilas"]], [0, 1, 2], "Pista: lo hacemos las personas, los animales y las plantas.", { promptEmoji: "🌱" }),
  ],

  // 6. Mi Cuerpo
  6: [
    q("¿Con qué parte del cuerpo vemos?", [["👀", "Ojos"], ["👂", "Orejas"], ["👃", "Nariz"]], 0, "Pista: los cerramos para dormir.", { promptEmoji: "🌈" }),
    q("¿Con qué parte escuchamos la música?", [["👅", "Lengua"], ["👂", "Orejas"], ["✋", "Manos"]], 1, "Pista: están a los costados de la cabeza.", { promptEmoji: "🎵" }),
    q("¿Con qué olemos una flor?", [["👃", "Nariz"], ["🦶", "Pie"], ["👀", "Ojos"]], 0, "Pista: está en el medio de la cara.", { promptEmoji: "🌸" }),
    q("¿Con qué sentimos el sabor de la comida?", [["👂", "Orejas"], ["🦵", "Pierna"], ["👅", "Lengua"]], 2, "Pista: está adentro de la boca.", { promptEmoji: "🍦" }),
    q("¿Con qué parte del cuerpo caminamos?", [["💪", "Brazos"], ["🦵", "Piernas"], ["👂", "Orejas"]], 1, "Pista: terminan en los pies.", { promptEmoji: "🚶" }),
    q("¿Cuántos ojos tenemos?", [["1️⃣", "Uno"], ["2️⃣", "Dos"], ["3️⃣", "Tres"]], 1, "Pista: mirate al espejo.", { promptEmoji: "👀" }),
    q("¿Con qué sentimos si algo es suave?", [["✋", "Piel"], ["👃", "Nariz"], ["👂", "Orejas"]], 0, "Pista: es el sentido del tacto.", { promptEmoji: "🧸" }),
    q("¿Dónde están los dientes?", [["👂", "En la oreja"], ["🦶", "En el pie"], ["👄", "En la boca"]], 2, "Pista: los usamos para masticar.", { promptEmoji: "🦷" }),
    q("¿Qué parte une la mano con el brazo?", [["🦵", "Rodilla"], ["⌚", "Muñeca"], ["👃", "Nariz"]], 1, "Pista: ahí se pone el reloj.", { promptEmoji: "💪" }),
    q("Tocá todas las partes de la cara", [["👀", "Ojos"], ["👃", "Nariz"], ["👄", "Boca"], ["🦶", "Pie"]], [0, 1, 2], "Pista: están en la cabeza, adelante.", { promptEmoji: "🙂" }),
  ],

  // 7. Me Cuido y te Cuido
  7: [
    q("¿Qué hacemos antes de comer?", [["🧼", "Lavarnos las manos"], ["🛏️", "Dormir"], ["🏃", "Correr"]], 0, "Pista: usamos agua y jabón.", { promptEmoji: "🍽️" }),
    q("¿Con qué nos cepillamos los dientes?", [["🍴", "Tenedor"], ["🪥", "Cepillo"], ["🖌️", "Pincel"]], 1, "Pista: le ponemos pasta dental.", { promptEmoji: "🦷" }),
    q("¿Qué comida nos ayuda a crecer sanos?", [["🍭", "Chupetines"], ["🍟", "Muchas papas fritas"], ["🥕", "Verduras"]], 2, "Pista: crecen en la huerta.", { promptEmoji: "💪" }),
    q("¿Qué es bueno para el cuerpo?", [["🛋️", "Estar siempre sentado"], ["🤸", "Moverse y jugar"], ["📺", "Ver tele siempre"]], 1, "Pista: hace latir fuerte el corazón.", { promptEmoji: "❤️" }),
    q("¿Qué hacemos al estornudar?", [["💪", "Usar el codo"], ["😮", "Estornudar sin taparse"], ["🙌", "Aplaudir"]], 0, "Pista: así no pasamos gérmenes.", { promptEmoji: "🤧" }),
    q("¿Qué bebida es la mejor para la sed?", [["🥤", "Gaseosa"], ["💧", "Agua"], ["☕", "Café"]], 1, "Pista: no tiene azúcar.", { promptEmoji: "😓" }),
    q("Si alguien me toca y no me gusta, ¿qué hago?", [["🤐", "Me callo"], ["🙅", "Digo ¡No!"], ["😂", "Me río"]], 1, "Pista: mi cuerpo es mío y puedo decir que no.", { promptEmoji: "🛑" }),
    q("¿A quién le cuento si algo me hace sentir mal?", [["🧑", "Un adulto confiable"], ["🐟", "A un pez"], ["🙈", "A nadie"]], 0, "Pista: puede ser alguien de mi familia o la maestra.", { promptEmoji: "💬" }),
    q("¿Cuánto hay que dormir para estar bien?", [["⏱️", "Muy poquito"], ["🚫", "Nada"], ["😴", "Toda la noche"]], 2, "Pista: el cuerpo descansa mientras dormimos.", { promptEmoji: "🛏️" }),
    q("Tocá todos los hábitos saludables", [["🧼", "Lavarse las manos"], ["🪥", "Cepillarse"], ["🍎", "Comer fruta"], ["🍬", "Comer golosinas siempre"]], [0, 1, 2], "Pista: nos ayudan a estar sanos.", { promptEmoji: "💪" }),
  ],

  // 8. ¿De Qué Está Hecho?
  8: [
    q("¿De qué material es una mesa de madera?", [["🪵", "Madera"], ["🧊", "Hielo"], ["🧻", "Papel"]], 0, "Pista: viene de los árboles.", { promptEmoji: "🪑" }),
    q("¿De qué está hecho un vaso transparente?", [["🪵", "Madera"], ["🥛", "Vidrio"], ["🧶", "Lana"]], 1, "Pista: si se cae, se puede romper.", { promptEmoji: "🥛" }),
    q("¿De qué está hecho un clavo?", [["🧻", "Papel"], ["🧵", "Tela"], ["🔩", "Metal"]], 2, "Pista: es duro y brillante.", { promptEmoji: "🔨" }),
    q("¿De qué está hecha una remera?", [["🧵", "Tela"], ["🪨", "Piedra"], ["🔩", "Metal"]], 0, "Pista: es suave y se puede doblar.", { promptEmoji: "👕" }),
    q("¿De qué está hecho un cuaderno?", [["🥛", "Vidrio"], ["📄", "Papel"], ["🔩", "Metal"]], 1, "Pista: en sus hojas escribimos.", { promptEmoji: "📓" }),
    q("¿De qué está hecho un balde de colores?", [["🪵", "Madera"], ["🧵", "Tela"], ["🪣", "Plástico"]], 2, "Pista: es liviano y no se oxida.", { promptEmoji: "🏖️" }),
    q("¿Qué material viene de los árboles?", [["🪵", "Madera"], ["🔩", "Metal"], ["🥛", "Vidrio"]], 0, "Pista: con ella se hacen muebles.", { promptEmoji: "🌲" }),
    q("¿Qué material sale de la oveja?", [["🔩", "Metal"], ["🧶", "Lana"], ["🧴", "Plástico"]], 1, "Pista: con ella se tejen pulóveres.", { promptEmoji: "🐑" }),
    q("¿Qué material sirve para hacer una ventana?", [["📄", "Papel"], ["🧵", "Tela"], ["🪟", "Vidrio"]], 2, "Pista: deja pasar la luz y se ve a través.", { promptEmoji: "🏠" }),
    q("Tocá todos los objetos de metal", [["🔑", "Llave"], ["🥄", "Cuchara"], ["📄", "Hoja"], ["🔩", "Tornillo"]], [0, 1, 3], "Pista: son duros, fríos y brillantes.", { promptEmoji: "🧲" }),
  ],

  // 9. Lo Descubro con mis Sentidos
  9: [
    q("¿Cuál es duro?", [["🪨", "Piedra"], ["🧸", "Peluche"], ["☁️", "Algodón"]], 0, "Pista: si lo apretás, no se hunde.", { promptEmoji: "✋" }),
    q("¿Cuál es blando?", [["🔨", "Martillo"], ["🛏️", "Almohada"], ["🧱", "Ladrillo"]], 1, "Pista: se hunde cuando apoyás la cabeza.", { promptEmoji: "✋" }),
    q("¿Cuál es transparente?", [["🪵", "Madera"], ["🧱", "Ladrillo"], ["🪟", "Vidrio de ventana"]], 2, "Pista: se ve lo que hay del otro lado.", { promptEmoji: "👀" }),
    q("¿Cuál es áspero al tocarlo?", [["🪵", "Corteza de árbol"], ["🪞", "Espejo"], ["🎈", "Globo"]], 0, "Pista: raspa un poco la mano.", { promptEmoji: "✋" }),
    q("¿Cuál es liso?", [["🍍", "Ananá"], ["🪞", "Espejo"], ["🦔", "Erizo"]], 1, "Pista: la mano se desliza sin trabarse.", { promptEmoji: "✋" }),
    q("¿Con qué sentido sé que algo es dulce?", [["👀", "Vista"], ["👂", "Oído"], ["👅", "Gusto"]], 2, "Pista: se siente con la lengua.", { promptEmoji: "🍯" }),
    q("¿Qué suena fuerte al golpearlo?", [["🥁", "Tambor"], ["🪶", "Pluma"], ["🧽", "Esponja"]], 0, "Pista: lo usan en las bandas de música.", { promptEmoji: "👂" }),
    q("¿Cuál tiene olor fuerte?", [["🪨", "Piedra"], ["🧅", "Cebolla"], ["🥄", "Cuchara"]], 1, "Pista: al cortarla a veces hace llorar.", { promptEmoji: "👃" }),
    q("¿Cuál es frío al tocarlo?", [["🔥", "Fuego"], ["☕", "Té caliente"], ["🧊", "Hielo"]], 2, "Pista: se derrite con el calor.", { promptEmoji: "🥶" }),
    q("Tocá todos los que son blandos", [["🧽", "Esponja"], ["🧸", "Peluche"], ["🪨", "Piedra"], ["☁️", "Algodón"]], [0, 1, 3], "Pista: se hunden al apretarlos.", { promptEmoji: "✋" }),
  ],

  // 10. Sólidos y Líquidos
  10: [
    q("¿Cuál es líquido?", [["💧", "Agua"], ["🪨", "Piedra"], ["🪵", "Madera"]], 0, "Pista: se derrama si inclinás el vaso.", { promptEmoji: "🥛" }),
    q("¿Cuál es sólido?", [["🥛", "Leche"], ["🧱", "Ladrillo"], ["🧃", "Jugo"]], 1, "Pista: mantiene su forma aunque lo muevas.", { promptEmoji: "✋" }),
    q("Si pongo agua en una botella, toma la forma…", [["⭐", "De estrella"], ["🍾", "De la botella"], ["⚪", "De pelota"]], 1, "Pista: los líquidos toman la forma del recipiente.", { promptEmoji: "💧" }),
    q("¿Qué le pasa al hielo al sol?", [["💧", "Se derrite"], ["🪨", "Se hace piedra"], ["🔥", "Se prende fuego"]], 0, "Pista: se convierte en agua.", { promptEmoji: "🧊" }),
    q("¿Qué pasa con el agua en el freezer?", [["🔥", "Hierve"], ["🌬️", "Se vuela"], ["🧊", "Se congela"]], 2, "Pista: en invierno pasa con los charcos.", { promptEmoji: "❄️" }),
    q("¿Cuál se puede servir en un vaso?", [["🔨", "Martillo"], ["🧃", "Jugo"], ["🧱", "Ladrillo"]], 1, "Pista: es un líquido.", { promptEmoji: "🥛" }),
    q("¿El aceite es sólido o líquido?", [["💧", "Líquido"], ["🧱", "Sólido"], ["🤷", "Ninguno"]], 0, "Pista: se derrama de la botella.", { promptEmoji: "🫗" }),
    q("¿La lapicera es sólida o líquida?", [["💧", "Líquida"], ["✏️", "Sólida"], ["🤷", "Ninguna"]], 1, "Pista: la podés agarrar con la mano.", { promptEmoji: "🖊️" }),
    q("¿Qué líquido cae de las nubes?", [["🪨", "Piedras"], ["🪵", "Madera"], ["🌧️", "Lluvia"]], 2, "Pista: moja el patio.", { promptEmoji: "☁️" }),
    q("Tocá todos los líquidos", [["🥛", "Leche"], ["💧", "Agua"], ["🧃", "Jugo"], ["🍞", "Pan"]], [0, 1, 2], "Pista: se derraman.", { promptEmoji: "🫗" }),
  ],

  // 11. Aplastar, Estirar, Empujar
  11: [
    q("Si aplasto una bola de plastilina, queda…", [["🫓", "Chata"], ["🎈", "Inflada"], ["💧", "Líquida"]], 0, "Pista: se pone finita como una tortilla.", { promptEmoji: "🤲" }),
    q("¿Qué puedo estirar?", [["🪨", "Piedra"], ["🔴", "Banda elástica"], ["🥛", "Vaso de vidrio"]], 1, "Pista: después vuelve a su tamaño.", { promptEmoji: "↔️" }),
    q("Si empujo una pelota, ¿qué pasa?", [["😴", "Se duerme"], ["🧊", "Se congela"], ["⚽", "Rueda"]], 2, "Pista: se mueve.", { promptEmoji: "🫸" }),
    q("¿Qué puedo doblar fácil?", [["📄", "Una hoja"], ["🧱", "Un ladrillo"], ["🪨", "Una piedra"]], 0, "Pista: es finita y de papel.", { promptEmoji: "📐" }),
    q("¿Qué se rompe si lo aplasto fuerte?", [["🧽", "Esponja"], ["🥚", "Huevo"], ["🧸", "Peluche"]], 1, "Pista: tiene cáscara finita.", { promptEmoji: "🤲" }),
    q("Si aprieto una esponja y la suelto, ¿qué pasa?", [["💥", "Explota"], ["🔄", "Recupera su forma"], ["🪨", "Se hace piedra"]], 1, "Pista: es blanda y elástica.", { promptEmoji: "🧽" }),
    q("Para mover una caja pesada, ¿qué hago?", [["🫸", "La empujo"], ["🎤", "Le canto"], ["👀", "La miro"]], 0, "Pista: uso la fuerza de los brazos.", { promptEmoji: "📦" }),
    q("¿Qué hacemos con la masa del pan?", [["🎺", "La soplamos"], ["📞", "La llamamos"], ["🙌", "La amasamos"]], 2, "Pista: la apretamos y la estiramos con las manos.", { promptEmoji: "🍞" }),
    q("¿Qué pasa si tiro de un elástico?", [["↔️", "Se estira"], ["🔥", "Se quema"], ["🧊", "Se congela"]], 0, "Pista: se hace más largo.", { promptEmoji: "🔴" }),
    q("Tocá todos los que se pueden aplastar", [["🧸", "Peluche"], ["🧽", "Esponja"], ["🫓", "Plastilina"], ["🔩", "Tornillo"]], [0, 1, 2], "Pista: son blandos.", { promptEmoji: "🤲" }),
  ],

  // 12. Luz y Sombra
  12: [
    q("¿Qué necesitamos para ver una sombra?", [["💡", "Luz"], ["🎵", "Música"], ["💧", "Agua"]], 0, "Pista: sin esto, todo está oscuro.", { promptEmoji: "👤" }),
    q("¿Qué da luz de día?", [["🌧️", "La lluvia"], ["☀️", "El Sol"], ["🪨", "Una piedra"]], 1, "Pista: es una estrella muy cercana.", { promptEmoji: "🌤️" }),
    q("¿Qué usamos para ver en la oscuridad?", [["🧦", "Medias"], ["🍌", "Banana"], ["🔦", "Linterna"]], 2, "Pista: tiene pilas y se prende.", { promptEmoji: "🌑" }),
    q("Si tapo la luz con la mano, aparece…", [["👤", "Una sombra"], ["🌈", "Un arcoíris"], ["⭐", "Una estrella"]], 0, "Pista: es una mancha oscura.", { promptEmoji: "✋" }),
    q("¿Por qué no vemos nada en un cuarto cerrado y oscuro?", [["😴", "Por sueño"], ["🌑", "No hay luz"], ["👂", "Por ruido"]], 1, "Pista: los ojos necesitan algo para ver.", { promptEmoji: "👀" }),
    q("¿Qué da luz y calor?", [["🧊", "Hielo"], ["🔥", "Fuego"], ["🪵", "Tronco apagado"]], 1, "Pista: está en la estufa a leña.", { promptEmoji: "💡" }),
    q("¿Qué deja pasar la luz?", [["🪟", "Vidrio"], ["🧱", "Pared"], ["🪵", "Puerta de madera"]], 0, "Pista: a través de él ves el patio.", { promptEmoji: "☀️" }),
    q("¿Mi sombra tiene la forma de…?", [["🐘", "Un elefante"], ["🚗", "Un auto"], ["🧍", "Mi cuerpo"]], 2, "Pista: se mueve igual que yo.", { promptEmoji: "👤" }),
    q("¿Qué da luz en una casa de noche?", [["💡", "Lámpara"], ["🪑", "Silla"], ["🧸", "Peluche"]], 0, "Pista: se prende con un interruptor.", { promptEmoji: "🏠" }),
    q("Tocá todos los que dan luz", [["☀️", "Sol"], ["🕯️", "Vela"], ["🔦", "Linterna"], ["🪨", "Piedra"]], [0, 1, 2], "Pista: iluminan.", { promptEmoji: "💡" }),
  ],

  // 13. Los Paisajes
  13: [
    q("En un paisaje, ¿qué vemos arriba?", [["☁️", "Cielo y nubes"], ["🟫", "Tierra"], ["🐟", "Peces"]], 0, "Pista: mirá hacia arriba cuando salís.", { promptEmoji: "🏞️" }),
    q("¿Qué hay en un paisaje de montaña?", [["🏖️", "Playa"], ["🏔️", "Cerros con nieve"], ["🌴", "Palmeras"]], 1, "Pista: es muy alto y frío arriba.", { promptEmoji: "🏞️" }),
    q("¿Qué hay en un paisaje de costa?", [["🌊", "Mar"], ["🌵", "Desierto"], ["🏔️", "Glaciar"]], 0, "Pista: hay olas y arena.", { promptEmoji: "🏖️" }),
    q("¿Qué es un glaciar?", [["🌋", "Un volcán"], ["🌳", "Un bosque"], ["🧊", "Hielo gigante"]], 2, "Pista: hay uno famoso cerca de El Calafate.", { promptEmoji: "🏔️" }),
    q("¿Qué hay en la estepa patagónica?", [["🌴", "Selva"], ["🌾", "Arbustos y pastos"], ["🐒", "Monos"]], 1, "Pista: son plantas bajas que aguantan el viento.", { promptEmoji: "🌄" }),
    q("¿Cuál es un elemento natural del paisaje?", [["🏞️", "Río"], ["🚦", "Semáforo"], ["🏢", "Edificio"]], 0, "Pista: el agua corre sola.", { promptEmoji: "🌿" }),
    q("¿Qué ser vivo vemos en el paisaje de la estepa?", [["🐬", "Delfín"], ["🐫", "Camello"], ["🦙", "Guanaco"]], 2, "Pista: vive en Santa Cruz.", { promptEmoji: "🌄" }),
    q("¿Qué hay en un paisaje de bosque?", [["🌲", "Muchos árboles"], ["🌊", "Olas"], ["🏙️", "Edificios"]], 0, "Pista: en Santa Cruz hay bosques de lenga.", { promptEmoji: "🏞️" }),
    q("¿Qué no vemos pero sentimos cuando sopla el viento?", [["🌬️", "Aire"], ["🪨", "Piedras"], ["🏔️", "Montañas"]], 0, "Pista: lo respiramos.", { promptEmoji: "🪁" }),
    q("Tocá todo lo que hay en un paisaje", [["🌳", "Árboles"], ["🏔️", "Montañas"], ["🌊", "Agua"], ["📺", "Tele"]], [0, 1, 2], "Pista: lo vemos al aire libre.", { promptEmoji: "🏞️" }),
  ],

  // 14. Paisajes que Cambian
  14: [
    q("¿En qué estación cae nieve en Santa Cruz?", [["❄️", "Invierno"], ["☀️", "Verano"], ["🌸", "Primavera"]], 0, "Pista: es la estación más fría.", { promptEmoji: "⛄" }),
    q("¿En qué estación se caen las hojas?", [["☀️", "Verano"], ["🍂", "Otoño"], ["🌸", "Primavera"]], 1, "Pista: las hojas se ponen amarillas y rojas.", { promptEmoji: "🌳" }),
    q("¿En qué estación florecen las plantas?", [["❄️", "Invierno"], ["🍂", "Otoño"], ["🌸", "Primavera"]], 2, "Pista: viene después del invierno.", { promptEmoji: "🌷" }),
    q("¿Qué estación es la más calurosa?", [["☀️", "Verano"], ["❄️", "Invierno"], ["🍂", "Otoño"]], 0, "Pista: hay vacaciones largas.", { promptEmoji: "🥵" }),
    q("Después de mucha lluvia, el río…", [["🔥", "Se seca"], ["🌊", "Crece"], ["🧊", "Se hace piedra"]], 1, "Pista: le llega más agua.", { promptEmoji: "🌧️" }),
    q("¿Dónde tiramos la basura en el campo?", [["🌾", "En el pasto"], ["🌊", "En el río"], ["🗑️", "En un cesto"]], 2, "Pista: así cuidamos el ambiente.", { promptEmoji: "♻️" }),
    q("¿Cómo cuidamos el agua?", [["🚰", "Cerrando la canilla"], ["💦", "Dejándola abierta"], ["🛁", "Llenando muchas bañeras"]], 0, "Pista: el agua no se tiene que desperdiciar.", { promptEmoji: "💧" }),
    q("Las personas hicieron una ruta. ¿Qué cambió en el paisaje?", [["🌈", "Salió un arcoíris"], ["🛣️", "Hay un camino"], ["🌋", "Hay un volcán"]], 1, "Pista: las personas también cambian los paisajes.", { promptEmoji: "👷" }),
    q("¿Qué podemos hacer para cuidar el bosque?", [["🔥", "Hacer fuego"], ["🪓", "Cortar árboles"], ["🌱", "Plantar árboles"]], 2, "Pista: ayudamos a que haya más.", { promptEmoji: "🌲" }),
    q("Tocá todo lo que cuida el ambiente", [["♻️", "Reciclar"], ["🌱", "Plantar"], ["🚰", "Ahorrar agua"], ["🗑️", "Ensuciar el río"]], [0, 1, 2], "Pista: son acciones que protegen la naturaleza.", { promptEmoji: "🌍" }),
  ],

  // 15. El Cielo de Día y de Noche
  15: [
    q("¿Qué estrella vemos de día?", [["☀️", "El Sol"], ["🌙", "La Luna"], ["☁️", "Una nube"]], 0, "Pista: nos da luz y calor.", { promptEmoji: "🌤️" }),
    q("¿El Sol es una estrella?", [["✅", "Sí"], ["❌", "No"], ["🤷", "Solo en verano"]], 0, "Pista: es la estrella más cercana a la Tierra.", { promptEmoji: "☀️" }),
    q("¿Qué brilla en el cielo oscuro de noche, muy lejos?", [["🌈", "Arcoíris"], ["⭐", "Estrellas"], ["🌧️", "Lluvia"]], 1, "Pista: son puntitos de luz.", { promptEmoji: "🌌" }),
    q("¿Qué trae la lluvia?", [["⭐", "Estrellas"], ["☀️", "Sol"], ["☁️", "Nubes"]], 2, "Pista: son blancas o grises y flotan.", { promptEmoji: "🌧️" }),
    q("¿Qué cuerpo del cielo cambia de forma día a día?", [["🌙", "La Luna"], ["☀️", "El Sol"], ["⭐", "Las estrellas"]], 0, "Pista: a veces se ve redonda y a veces finita.", { promptEmoji: "🔭" }),
    q("¿Qué usamos para ver estrellas de cerca?", [["🔦", "Linterna"], ["🔭", "Telescopio"], ["🥽", "Antiparras"]], 1, "Pista: tiene un tubo largo con lentes.", { promptEmoji: "⭐" }),
    q("¿Es seguro mirar el Sol directo?", [["✅", "Sí, siempre"], ["😎", "Sí, un rato"], ["🚫", "No, nunca"]], 2, "Pista: su luz es muy fuerte.", { promptEmoji: "☀️" }),
    q("¿De qué están hechas las nubes?", [["💧", "Gotitas de agua"], ["🧶", "Lana"], ["🍦", "Helado"]], 0, "Pista: cuando caen, llueve.", { promptEmoji: "☁️" }),
    q("¿Qué hay en el cielo cuando llueve con sol?", [["🌋", "Volcán"], ["🌈", "Arcoíris"], ["🚀", "Cohete"]], 1, "Pista: tiene muchos colores.", { promptEmoji: "🌦️" }),
    q("Tocá todo lo que vemos en el cielo", [["☀️", "Sol"], ["☁️", "Nubes"], ["⭐", "Estrellas"], ["🐟", "Peces"]], [0, 1, 2], "Pista: está arriba de nuestras cabezas.", { promptEmoji: "🔭" }),
  ],
};

// Actividades de variedad (order, classify, story, multi-pick) por número de mundo.
export const EXTRA_NATURALES: Record<number, ActivitySpec[]> = {
  // 1. Un Mundo Lleno de Vida (n-seres-vivos)
  1: [
    makeClassify(
      "n1-ex-0",
      "Clasificá entre seres vivos y elementos sin vida:",
      ["Ser vivo", "Sin vida"],
      [
        { label: "🐶 Perro juguetón", cat: 0 },
        { label: "🪨 Piedra del camino", cat: 1 },
        { label: "🌲 Árbol de lenga", cat: 0 },
        { label: "🚗 Auto a nafta", cat: 1 },
      ],
      "Pista: los seres vivos nacen, se alimentan, crecen y respiran.",
      ["n-seres-vivos"]
    ),
    makeOrder(
      "n1-ex-1",
      "Ordená el ciclo vital de un ser vivo:",
      ["Nacer de su mamá o de una semilla", "Alimentarse y crecer día a día", "Tener hijitos o dar semillas"],
      "Pista: todos los seres vivos comienzan naciendo chiquitos.",
      ["n-seres-vivos"]
    ),
    makeStoryPick(
      "n1-ex-2",
      {
        title: "El caracol del jardín",
        text: "Camila encontró un caracolito sobre una hoja mojada. Vio que se movía despacio, sacaba sus antenas y comía una hojita verde. ¡Comprobó que era un ser vivo!",
      },
      "¿Cómo supo Camila que el caracol tenía vida?",
      [["🐌", "Porque se movía y comía hojitas"], ["🔋", "Porque tenía pilas adentro"], ["🧸", "Porque era de peluche"]],
      0,
      "Pista: los seres vivos necesitan alimentarse y reaccionan al entorno.",
      ["n-seres-vivos"]
    ),
  ],

  // 2. Plantas y Animales de mi Lugar (n-animales, n-plantas)
  2: [
    makeClassify(
      "n2-ex-0",
      "¿En qué ambiente vive cada uno?",
      ["De Santa Cruz (Patagonia)", "De la selva tropical"],
      [
        { label: "🦙 Guanaco de la estepa", cat: 0 },
        { label: "🐒 Mono trepador de árboles", cat: 1 },
        { label: "🫐 Arbusto de calafate", cat: 0 },
        { label: "🦜 Tucán de pico gigante", cat: 1 },
      ],
      "Pista: el guanaco y el calafate están adaptados al frío y al viento del sur.",
      ["n-animales", "n-plantas"]
    ),
    makeOrder(
      "n2-ex-1",
      "Ordená los cambios de la lenga según las estaciones:",
      ["Brotes y hojas verdes en primavera", "Hojas rojas y doradas en otoño", "Ramas sin hojas cubiertas de nieve en invierno"],
      "Pista: en otoño las hojas de los árboles caducifolios cambian de color antes de caer.",
      ["n-animales", "n-plantas"]
    ),
    makeStoryPick(
      "n2-ex-2",
      {
        title: "El choique en la estepa",
        text: "Cerca de la ruta patagónica vimos una tropilla de choiques. Estas aves no vuelan por el aire, pero corren a gran velocidad abriendo sus alas para mantener el equilibrio.",
      },
      "¿Cómo se desplaza el choique por la meseta?",
      [["🏃", "Corriendo con sus patas fuertes"], ["🕊️", "Volando alto en el cielo"], ["🏊", "Buceando bajo el agua"]],
      0,
      "Pista: el choique tiene patas largas y fuertes para correr rápido.",
      ["n-animales", "n-plantas"]
    ),
  ],

  // 3. ¿Cómo Son los Animales? (n-animales)
  3: [
    makeClassify(
      "n3-ex-0",
      "¿Qué cobertura tiene el cuerpo del animal?",
      ["Pelos", "Plumas o escamas"],
      [
        { label: "🦊 Zorro colorado", cat: 0 },
        { label: "🦅 Cóndor andino", cat: 1 },
        { label: "🐑 Oveja con lana", cat: 0 },
        { label: "🐟 Trucha del río", cat: 1 },
      ],
      "Pista: las aves tienen plumas y los peces escamas; los mamíferos tienen pelos o lana.",
      ["n-animales"]
    ),
    makeOrder(
      "n3-ex-1",
      "Ordená cómo busca alimento un ave cazadora:",
      ["Observar la estepa desde lo alto", "Bajar en picada con sus alas", "Atrapar su comida con las garras"],
      "Pista: primero busca con su excelente vista antes de descender.",
      ["n-animales"]
    ),
    makeStoryPick(
      "n3-ex-2",
      {
        title: "Las patas del guanaco",
        text: "A diferencia de las vacas y ovejas que tienen pezuñas duras, el guanaco tiene almohadillas suaves en las patas. Por eso camina por la meseta sin romper el pasto ni erosionar el suelo.",
      },
      "¿Por qué las patas del guanaco cuidan el suelo patagónico?",
      [["🦙", "Porque tienen almohadillas blandas"], ["👟", "Porque usa zapatillas de goma"], ["🪶", "Porque vuela sin pisar"]],
      0,
      "Pista: las almohadillas apoyan suavemente sobre la tierra.",
      ["n-animales"]
    ),
  ],

  // 4. ¿Cómo Son las Plantas? (n-plantas)
  4: [
    makeOrder(
      "n4-ex-0",
      "Ordená el crecimiento de una planta:",
      ["Semilla plantada en la tierra húmeda", "Aparición de la raíz y del primer brote", "Crecimiento del tallo con hojas y flores"],
      "Pista: la semilla bajo tierra es el inicio de una nueva planta.",
      ["n-plantas"]
    ),
    makeClassify(
      "n4-ex-1",
      "¿Dónde se ubica cada parte de la planta?",
      ["Bajo la tierra", "Sobre el suelo al aire"],
      [
        { label: "🥕 Raíz que absorbe agua", cat: 0 },
        { label: "🍃 Hoja verde que recibe sol", cat: 1 },
        { label: "🌰 Raíz de sostén", cat: 0 },
        { label: "🌸 Flor con pétalos coloridos", cat: 1 },
      ],
      "Pista: las raíces crecen hacia abajo en el suelo para tomar agua y nutrientes.",
      ["n-plantas"]
    ),
    makeStoryPick(
      "n4-ex-2",
      {
        title: "Las espinas del calafate",
        text: "El arbusto del calafate tiene ricas bayas violetas y espinas afiladas. Esas espinas le sirven a la planta para defenderse y evitar que los herbívoros se coman sus ramas tiernas.",
      },
      "¿Para qué utiliza el calafate sus espinas?",
      [["🛡️", "Para protegerse de los animales que quieren comerlo"], ["🎣", "Para pescar en el río"], ["🧹", "Para barrer las hojas secas"]],
      0,
      "Pista: las espinas son una protección natural de muchos arbustos de la estepa.",
      ["n-plantas"]
    ),
  ],

  // 5. Todos Crecemos (n-seres-vivos)
  5: [
    makeOrder(
      "n5-ex-0",
      "Ordená el crecimiento del pollito:",
      ["Huevo en el nido empollado con calor", "El pichón rompe el cascarón y sale", "El pollito crece y se convierte en gallina"],
      "Pista: primero está el huevo antes de que nazca el pichón.",
      ["n-seres-vivos"]
    ),
    makeClassify(
      "n5-ex-1",
      "¿Quién lo necesita para vivir?",
      ["Todos los seres vivos", "Solo las personas"],
      [
        { label: "💧 Beber agua potable", cat: 0 },
        { label: "📱 Usar teléfono celular", cat: 1 },
        { label: "🌬️ Respirar oxígeno del aire", cat: 0 },
        { label: "🚗 Conducir un automóvil", cat: 1 },
      ],
      "Pista: respirar y tomar agua son funciones vitales de animales, plantas y personas.",
      ["n-seres-vivos"]
    ),
    makeStoryPick(
      "n5-ex-2",
      {
        title: "El potrillito nuevo",
        text: "Ayer nació un potrillo en el campo. Apenas podía sostenerse en pie y tomaba leche tibia de su mamá yegua. Con los días se volvió fuerte y correteaba feliz.",
      },
      "¿De qué se alimenta el potrillo recién nacido?",
      [["🥛", "De la leche de su mamá"], ["🍖", "De hamburguesas"], ["🍎", "De manzanas asadas"]],
      0,
      "Pista: los mamíferos toman leche materna al nacer.",
      ["n-seres-vivos"]
    ),
  ],

  // 6. Mi Cuerpo (n-cuerpo)
  6: [
    makeClassify(
      "n6-ex-0",
      "¿Con qué sentido percibimos cada estímulo?",
      ["Sentido de la vista (ojos)", "Sentido del oído (orejas)"],
      [
        { label: "🌈 Colores brillantes del arcoíris", cat: 0 },
        { label: "🎶 Canto alegre de un zorzal", cat: 1 },
        { label: "📖 Letras escritas en el cuaderno", cat: 0 },
        { label: "🚨 Sirena de los bomberos en la calle", cat: 1 },
      ],
      "Pista: los ojos captan la luz y las orejas captan los sonidos.",
      ["n-cuerpo"]
    ),
    makeOrder(
      "n6-ex-1",
      "Ordená las partes del cuerpo humano de arriba hacia abajo:",
      ["Cabeza con ojos, nariz y boca", "Tronco con pecho, espalda y panza", "Piernas y pies para sostenernos"],
      "Pista: empezamos por la parte superior donde está la cabeza.",
      ["n-cuerpo"]
    ),
    makeStoryPick(
      "n6-ex-2",
      {
        title: "La merienda de los sentidos",
        text: "Tomás entró a la cocina: con la nariz sintió el olor a tostadas, con los ojos vio la mermelada y con la lengua saboreó el dulce de leche.",
      },
      "¿Con qué parte del cuerpo sintió el sabor dulce de la tostada?",
      [["👅", "Con la lengua usando el gusto"], ["👂", "Con el oído"], ["👃", "Con la nariz"]],
      0,
      "Pista: el sentido del gusto está en las papilas de la lengua.",
      ["n-cuerpo"]
    ),
  ],

  // 7. Me Cuido y te Cuido (n-cuerpo)
  7: [
    makeOrder(
      "n7-ex-0",
      "Ordená los pasos para cepillarnos los dientes:",
      ["Poner pasta dental en el cepillo", "Cepillar dientes y muelas con cuidado", "Enjuagar con agua y escupir"],
      "Pista: primero colocamos la pasta antes de frotar los dientes.",
      ["n-cuerpo"]
    ),
    makeClassify(
      "n7-ex-1",
      "¿Es un hábito saludable para todos los días?",
      ["Hábito saludable diario", "Para hacer solo a veces o evitar"],
      [
        { label: "🍎 Comer frutas y verduras frescas", cat: 0 },
        { label: "🍭 Comer golosinas todo el día", cat: 1 },
        { label: "🧼 Lavarse las manos con agua y jabón", cat: 0 },
        { label: "📺 Pasar horas sin moverse frente a la pantalla", cat: 1 },
      ],
      "Pista: la higiene y la comida sana cuidan nuestro crecimiento.",
      ["n-cuerpo"]
    ),
    makeStoryPick(
      "n7-ex-2",
      {
        title: "Manos limpias antes de almorzar",
        text: "Martín estuvo jugando con tierra y autitos en el patio. Antes de sentarse a la mesa con su familia, se lavó muy bien las manos con jabón para quitar todos los microbios.",
      },
      "¿Por qué es importante lavarse las manos antes de comer?",
      [["🧼", "Para no tragar bacterias ni microbios"], ["🎨", "Para que queden de colores"], ["🧊", "Para enfriar los dedos"]],
      0,
      "Pista: el agua y el jabón eliminan la suciedad que no se ve.",
      ["n-cuerpo"]
    ),
  ],

  // 8. ¿De Qué Está Hecho? (n-materiales)
  8: [
    makeClassify(
      "n8-ex-0",
      "¿De qué material principal está fabricado?",
      ["De madera", "De metal"],
      [
        { label: "🪵 Cuchara de palo para cocinar", cat: 0 },
        { label: "🔑 Llave para abrir la puerta", cat: 1 },
        { label: "🪑 Banco de plaza de madera", cat: 0 },
        { label: "🔩 Tornillo con tuerca", cat: 1 },
      ],
      "Pista: la madera viene de los árboles y el metal es brillante y pesado.",
      ["n-materiales"]
    ),
    makeOrder(
      "n8-ex-1",
      "Ordená cómo se fabrica una prenda de lana:",
      ["Esquilar el vellón suave de la oveja", "Hilar la lana para formar madejas", "Tejer la bufanda calentita con agujas"],
      "Pista: primero se obtiene la materia prima de la oveja.",
      ["n-materiales"]
    ),
    makeStoryPick(
      "n8-ex-2",
      {
        title: "El piloto impermeable",
        text: "Cuando llueve con viento, Julieta usa su campera de plástico impermeable. El agua resbala por la tela sin mojarle la ropa de abajo.",
      },
      "¿Por qué el plástico del piloto es ideal para la lluvia?",
      [["🌧️", "Porque no deja pasar el agua líquida"], ["🧽", "Porque chupa el agua como una esponja"], ["❄️", "Porque se derrite al contacto"]],
      0,
      "Pista: los materiales impermeables no absorben los líquidos.",
      ["n-materiales"]
    ),
  ],

  // 9. Lo Descubro con mis Sentidos (n-materiales)
  9: [
    makeClassify(
      "n9-ex-0",
      "¿Cómo se siente este material al tocarlo?",
      ["Duro y resistente", "Blando o elástico"],
      [
        { label: "🪨 Piedra del río", cat: 0 },
        { label: "🧸 Peluche de algodón", cat: 1 },
        { label: "🔨 Martillo de hierro", cat: 0 },
        { label: "🧽 Esponja de baño", cat: 1 },
      ],
      "Pista: lo duro no se deforma al apretarlo con las manos.",
      ["n-materiales"]
    ),
    makeOrder(
      "n9-ex-1",
      "Ordená estos elementos de más áspero a más suave:",
      ["Piedra pómez muy rugosa", "Tabla de madera lijada", "Pañuelo de seda delicado"],
      "Pista: la piedra rugosa raspa mucho y la seda casi no ofrece resistencia.",
      ["n-materiales"]
    ),
    makeStoryPick(
      "n9-ex-2",
      {
        title: "Adivinar con las manos",
        text: "Con los ojos vendados, Mateo tocó un objeto misterioso: era frío, muy liso y no se doblaba al apretarlo. ¡Adivinó que era una cuchara de metal!",
      },
      "¿Qué sentido usó Mateo para reconocer el material?",
      [["✋", "El tacto con las yemas de sus dedos"], ["👀", "La vista a través de la venda"], ["👃", "El olfato con la nariz"]],
      0,
      "Pista: el tacto nos permite sentir texturas, dureza y temperatura.",
      ["n-materiales"]
    ),
  ],

  // 10. Sólidos y Líquidos (n-materiales)
  10: [
    makeClassify(
      "n10-ex-0",
      "¿En qué estado se encuentra este elemento?",
      ["Líquido (fluye)", "Sólido (mantiene su forma)"],
      [
        { label: "🥛 Leche en la taza", cat: 0 },
        { label: "🧱 Ladrillo de construcción", cat: 1 },
        { label: "🧃 Jugo de frutas en vaso", cat: 0 },
        { label: "✏️ Lápiz para dibujar", cat: 1 },
      ],
      "Pista: los líquidos se derraman si no tienen un recipiente que los contenga.",
      ["n-materiales"]
    ),
    makeOrder(
      "n10-ex-1",
      "Ordená los estados del agua cuando le damos calor:",
      ["Hielo duro y frío en el congelador", "Agua líquida que corre por la canilla", "Vapor que sale de la pava al hervir"],
      "Pista: el hielo se derrite en agua líquida y con más calor se evapora.",
      ["n-materiales"]
    ),
    makeStoryPick(
      "n10-ex-2",
      {
        title: "El vaso volcado",
        text: "A Pedro se le resbaló el vaso de agua en la mesa. Como los líquidos no tienen forma fija propia, el agua se escurrió rápidamente y mojó todo el mantel.",
      },
      "¿Por qué el agua se desparrama al caer del vaso?",
      [["💧", "Porque los líquidos adoptan la forma del lugar y fluyen"], ["🪨", "Porque es dura como una piedra"], ["⚽", "Porque rebota como pelota de goma"]],
      0,
      "Pista: los líquidos adoptan la forma del recipiente que los contiene.",
      ["n-materiales"]
    ),
  ],

  // 11. Aplastar, Estirar, Empujar (n-materiales, n-fenomenos)
  11: [
    makeClassify(
      "n11-ex-0",
      "¿Qué le pasa al material al apretarlo con fuerza?",
      ["Se deforma con facilidad", "Mantiene su forma rígida"],
      [
        { label: "🟢 Masa de plastilina", cat: 0 },
        { label: "🥄 Cuchara de acero", cat: 1 },
        { label: "🧽 Esponja de lavar", cat: 0 },
        { label: "🪙 Moneda de metal", cat: 1 },
      ],
      "Pista: los materiales plásticos o elásticos cambian de forma con la fuerza de las manos.",
      ["n-materiales", "n-fenomenos"]
    ),
    makeOrder(
      "n11-ex-1",
      "Ordená los pasos para modelar un autito de masa:",
      ["Amasar un bollo de masa suave", "Aplanar y modelar la carrocería y ruedas", "Unir las partes para terminar el autito"],
      "Pista: primero ablandamos la masa antes de armar los detalles.",
      ["n-materiales", "n-fenomenos"]
    ),
    makeStoryPick(
      "n11-ex-2",
      {
        title: "La gomita elástica",
        text: "Martina estiró una bandita elástica entre sus dos manos. Al soltarla, la gomita volvió de inmediato a su tamaño original sin romperse. ¡Es un material muy elástico!",
      },
      "¿Qué cualidad tiene la bandita elástica?",
      [["➰", "Vuelve a su forma original al soltarla"], ["🧱", "Se quiebra como un vidrio"], ["🕯️", "Se derrite al estirarla"]],
      0,
      "Pista: los materiales elásticos recuperan su forma inicial.",
      ["n-materiales", "n-fenomenos"]
    ),
  ],

  // 12. Luz y Sombra (n-fenomenos)
  12: [
    makeClassify(
      "n12-ex-0",
      "¿Cómo se produce esta luz?",
      ["Fuente de luz natural", "Fuente de luz artificial"],
      [
        { label: "☀️ El Sol en el cielo", cat: 0 },
        { label: "🔦 Linterna con pilas", cat: 1 },
        { label: "⭐ Las estrellas en la noche", cat: 0 },
        { label: "💡 Lámpara del velador", cat: 1 },
      ],
      "Pista: la luz artificial fue inventada por el ser humano.",
      ["n-fenomenos"]
    ),
    makeOrder(
      "n12-ex-1",
      "Ordená cómo se hace sombra con las manos:",
      ["Prender una linterna apuntando a la pared", "Colocar las manos entre la luz y la pared", "Ver la silueta proyectada sobre el muro"],
      "Pista: la sombra aparece cuando un objeto opaco tapa el paso de la luz.",
      ["n-fenomenos"]
    ),
    makeStoryPick(
      "n12-ex-2",
      {
        title: "Sombras en la carpa",
        text: "En el campamento, Nico alumbró con su linterna una rama seca. Detrás de la rama se formó una sombra oscura sobre la lona blanca de la carpa porque la luz no podía atravesar la madera.",
      },
      "¿Por qué se forma una sombra detrás de la rama?",
      [["🌳", "Porque la madera no deja pasar la luz"], ["👻", "Porque había un fantasma"], ["🌧️", "Porque empezó a llover"]],
      0,
      "Pista: cuando un objeto opaco bloquea la luz, se produce una sombra.",
      ["n-fenomenos"]
    ),
  ],

  // 13. Los Paisajes (n-fenomenos, n-ambiente)
  13: [
    makeClassify(
      "n13-ex-0",
      "¿De qué paisaje es característico?",
      ["De la Patagonia (sur)", "De la selva misionera (norte)"],
      [
        { label: "❄️ Glaciar con témpanos de hielo", cat: 0 },
        { label: "🌴 Palmeras altas con lianas verdes", cat: 1 },
        { label: "🌾 Meseta con pasto coirón", cat: 0 },
        { label: "🦜 Selva con mucha humedad y calor", cat: 1 },
      ],
      "Pista: la Patagonia tiene mesetas, vientos, estepa y glaciares.",
      ["n-fenomenos", "n-ambiente"]
    ),
    makeOrder(
      "n13-ex-1",
      "Ordená el camino del agua en el paisaje:",
      ["Nieve en la cumbre de la montaña", "Arroyo que baja y forma un gran río", "El río que desemboca en el mar"],
      "Pista: el deshielo de las montañas alimenta los arroyos que bajan hacia el mar.",
      ["n-fenomenos", "n-ambiente"]
    ),
    makeStoryPick(
      "n13-ex-2",
      {
        title: "El viento en la estepa",
        text: "En Santa Cruz el viento sopla con fuerza sobre la meseta. Hace girar las aspas de los molinos de agua y moldea los arbustos achaparrados hacia un mismo costado.",
      },
      "¿Qué efecto produce el viento fuerte sobre los arbustos del campo?",
      [["🌬️", "Los inclina y adapta al clima árido"], ["🌊", "Los convierte en peces"], ["🔥", "Los prende fuego"]],
      0,
      "Pista: la vegetación de la estepa crece baja y doblada por el viento.",
      ["n-fenomenos", "n-ambiente"]
    ),
  ],

  // 14. Paisajes que Cambian (n-fenomenos, n-ambiente)
  14: [
    makeOrder(
      "n14-ex-0",
      "Ordená el paso de las estaciones del año:",
      ["Verano con días largos y cálidos", "Otoño con hojas secas que caen", "Invierno con frío, escarcha y nieve"],
      "Pista: el otoño llega después del verano y prepara la llegada del invierno.",
      ["n-fenomenos", "n-ambiente"]
    ),
    makeClassify(
      "n14-ex-1",
      "¿Quién produce este cambio en el paisaje?",
      ["La propia naturaleza", "Las acciones de las personas"],
      [
        { label: "❄️ La nieve que cubre los cerros en invierno", cat: 0 },
        { label: "🛣️ Abrir una ruta asfaltada entre montañas", cat: 1 },
        { label: "🍂 Las hojas que caen en otoño", cat: 0 },
        { label: "🏗️ Construir un barrio de casas nuevas", cat: 1 },
      ],
      "Pista: el clima y las estaciones son naturales; los puentes y casas son construidos.",
      ["n-fenomenos", "n-ambiente"]
    ),
    makeStoryPick(
      "n14-ex-2",
      {
        title: "El deshielo de primavera",
        text: "Al llegar la primavera a la cordillera, el calor del sol derrite la nieve acumulada. Los arroyos bajan con gran caudal de agua limpia que alimenta los lagos y regadíos.",
      },
      "¿Qué provoca el deshielo de las montañas?",
      [["☀️", "El aumento del calor en primavera"], ["❄️", "El frío congelado de la noche"], ["🌪️", "Un tornado misterioso"]],
      0,
      "Pista: el sol calienta el ambiente y transforma la nieve en agua líquida.",
      ["n-fenomenos", "n-ambiente"]
    ),
  ],

  // 15. El Cielo de Día y de Noche (n-fenomenos)
  15: [
    makeClassify(
      "n15-ex-0",
      "¿En qué momento podemos observar este cuerpo celeste?",
      ["En el cielo de día", "En el cielo de noche"],
      [
        { label: "☀️ El Sol que ilumina y abriga", cat: 0 },
        { label: "⭐ Miles de estrellas brillantes", cat: 1 },
        { label: "☁️ Nubes blancas con luz solar", cat: 0 },
        { label: "✨ Constelación de la Cruz del Sur", cat: 1 },
      ],
      "Pista: las estrellas lejanas se aprecian en la oscuridad de la noche.",
      ["n-fenomenos"]
    ),
    makeOrder(
      "n15-ex-1",
      "Ordená los momentos del día según la luz:",
      ["Amanecer: sale el Sol por el este", "Mediodía: el Sol está bien alto", "Atardecer: oscurece y sale la Luna"],
      "Pista: el amanecer marca el comienzo del día con la primera luz solar.",
      ["n-fenomenos"]
    ),
    makeStoryPick(
      "n15-ex-2",
      {
        title: "Mirando el cielo en el campo",
        text: "Lejos de las luces del pueblo, el cielo de la noche patagónica es transparente y oscuro. Joaquín y su abuelo salieron al patio a buscar las cuatro estrellas de la Cruz del Sur.",
      },
      "¿Qué observaban Joaquín y su abuelo en la noche?",
      [["✨", "Las estrellas y la Cruz del Sur"], ["☀️", "El Sol radiante del mediodía"], ["🌈", "Un arcoíris bajo la lluvia"]],
      0,
      "Pista: la noche sin luces de la ciudad permite ver nítidamente las constelaciones.",
      ["n-fenomenos"]
    ),
  ],
};
