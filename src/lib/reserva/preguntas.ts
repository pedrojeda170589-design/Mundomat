// Bancos de preguntas de la Reserva y expedición patagónica (3.º y 4.º).
// Escritas a mano por Claude (10/10/2026) a partir de las fichas
// (src/lib/reserva/fichas.ts) y de las etapas (etapas.ts). Antes de cada
// vuelta el chico lee la postal y las fichas del animal y de la planta, así
// que todo se puede responder con lo que acaba de leer (postal, datos del
// lugar y fichas).
// Reglas (README del equipo): una sola respuesta correcta, distractores que
// un chico podría elegir de verdad, largos parecidos y pistas sin regalar la
// respuesta. En el banco la correcta va primera; al armar la vuelta se mezcla.
import type { ActivitySpec } from "@/lib/activities";

// Actividad propia de la reserva: tocar un territorio en el mapa.
export interface ActividadMapa {
  type: "mapa";
  id: string;
  title: string;
  prompt: string;
  nivel: "departamento" | "provincia";
  respuesta: string; // id del territorio
  hint: string;
}

export type ActividadReserva = ActivitySpec | ActividadMapa;

function mc(id: string, prompt: string, opciones: [string, string, string], hint: string): ActivitySpec {
  return { type: "mc", id, title: "Expedición", prompt, choices: [...opciones], answerIndex: 0, hint };
}
function vf(id: string, statement: string, isTrue: boolean, hint: string): ActivitySpec {
  return { type: "true-false", id, title: "¿Verdadero o falso?", statement, isTrue, hint };
}
function clasif(id: string, prompt: string, categorias: [string, string], a: string[], b: string[], hint: string): ActivitySpec {
  return {
    type: "classify",
    id,
    title: "Clasificá",
    prompt,
    categories: [...categorias],
    items: [...a.map((label) => ({ label, categoryIndex: 0 })), ...b.map((label) => ({ label, categoryIndex: 1 }))],
    hint,
  };
}
function mapa(id: string, prompt: string, nivel: ActividadMapa["nivel"], respuesta: string, hint: string): ActividadMapa {
  return { type: "mapa", id, title: "En el mapa", prompt, nivel, respuesta, hint };
}

// ---------------------------------------------------------------- 1. Río Chico
const E1: ActividadReserva[] = [
  mapa("r1-mapa", "Tocá en el mapa el departamento Río Chico.", "departamento", "rio-chico", "Pista: está en el centro de la provincia y no llega al mar."),
  mc("r1-cabecera", "¿Cuál es la cabecera del departamento Río Chico?", ["Gobernador Gregores", "Puerto San Julián", "Perito Moreno"], "Pista: es nuestro punto de partida."),
  mc("r1-mar", "¿El departamento Río Chico tiene costa sobre el mar?", ["No, está lejos del mar", "Sí, tiene playas en el este", "Sí, tiene un puerto grande"], "Pista: mirá en el mapa si alguno de sus bordes toca el mar."),
  mc("r1-vecinos", "Río Chico limita con muchos departamentos. ¿Con cuántos?", ["Con cinco", "Con dos", "Con uno solo"], "Pista: contá en el mapa los departamentos que lo tocan."),
  mc("r1-huemul-come", "¿Qué come el huemul?", ["Brotes, hojas, hierbas y frutos", "Peces que pesca en los lagos", "Liebres y otros animales chicos"], "Pista: es un ciervo y es herbívoro."),
  mc("r1-huemul-peligro", "¿Qué hace el huemul cuando siente peligro?", ["Se queda quieto", "Se mete en el agua", "Corre hacia el mar"], "Pista: lo leíste en su ficha; por eso es fácil de cazar."),
  vf("r1-huemul-astas", "El huemul macho pierde sus astas en invierno y le crecen otra vez cada año.", true, "Pista: pensá en lo que leíste sobre las astas."),
  mc("r1-huemul-estado", "¿Cómo está el huemul hoy?", ["En peligro de extinción", "Hay millones en la estepa", "Vive en todos los países"], "Pista: buscá el sello rojo en su ficha."),
  mc("r1-huemul-ley", "¿Qué protección especial tiene el huemul en la Argentina?", ["Es Monumento Natural Nacional", "Es el animal de la bandera", "Es mascota de los parques"], "Pista: es la protección más fuerte que puede tener un animal en el país."),
  mc("r1-calafate-fruto", "¿De qué color son los frutos del calafate?", ["Violetas", "Rojos", "Amarillos"], "Pista: amarillas son sus flores; sus frutos son de otro color."),
  vf("r1-calafate-leyenda", "Dice la leyenda que quien come calafate vuelve a la Patagonia.", true, "Pista: recordá el dato curioso de su ficha."),
  mc("r1-boleadoras", "¿Para qué usaban las boleadoras los aonikenk?", ["Para atrapar guanacos y choiques", "Para moler semillas y raíces", "Para encender el fuego"], "Pista: se lanzaban y se enredaban en las patas."),
  mc("r1-parque", "¿En qué parque nacional de Río Chico vive el huemul?", ["Parque Nacional Perito Moreno", "Parque Nacional Monte León", "Parque Nacional Los Alerces"], "Pista: lo dice la postal de esta etapa."),
];

// ---------------------------------------------------------------- 2. Lago Buenos Aires
const E2: ActividadReserva[] = [
  mapa("r2-mapa", "Tocá en el mapa el departamento Lago Buenos Aires.", "departamento", "lago-buenos-aires", "Pista: está en el noroeste de la provincia, junto a Chile."),
  mc("r2-cabecera", "¿Cuál es la cabecera del departamento Lago Buenos Aires?", ["Perito Moreno", "Caleta Olivia", "El Calafate"], "Pista: tiene el nombre de un explorador famoso."),
  mc("r2-localidad", "¿Qué localidad está junto al lago Buenos Aires, cerca de Chile?", ["Los Antiguos", "Puerto Deseado", "Río Turbio"], "Pista: es famosa por sus cerezas."),
  mc("r2-cueva", "¿Qué pintaron los primeros pobladores en la Cueva de las Manos?", ["Manos y guanacos", "Barcos y faros", "Caballos y ovejas"], "Pista: el nombre de la cueva te ayuda con una de las dos cosas."),
  mc("r2-cueva-edad", "¿Hace cuánto tiempo pintaron la Cueva de las Manos?", ["Hace más de 9.000 años", "Hace unos 100 años", "Hace unos 500 años"], "Pista: fue mucho antes de que llegaran los barcos europeos."),
  vf("r2-patrimonio", "La Cueva de las Manos es Patrimonio de la Humanidad.", true, "Pista: lo dice la postal."),
  mc("r2-maca-donde", "¿En qué lugar del mundo vive el macá tobiano?", ["Solo en Santa Cruz", "En toda Sudamérica", "En todos los mares del sur"], "Pista: es una especie única de nuestra provincia."),
  mc("r2-maca-invierno", "¿Adónde va el macá tobiano en invierno?", ["A la costa, donde terminan los ríos", "A los bosques de la cordillera", "A las ciudades, cerca de las casas"], "Pista: en invierno las lagunas de la meseta se congelan."),
  mc("r2-maca-come", "¿Qué come el macá tobiano?", ["Bichitos del agua", "Semillas de pasto", "Frutos del calafate"], "Pista: los busca buceando."),
  mc("r2-maca-peligro", "¿Cuál de estos animales pone en peligro al macá tobiano?", ["El visón americano", "El huemul", "La tonina overa"], "Pista: es un animal traído de otro continente."),
  vf("r2-maca-nido", "El macá tobiano hace su nido en lo alto de los árboles.", false, "Pista: es un ave de laguna."),
  mc("r2-neneo", "¿Por qué el neneo crece bajito y redondo, como un almohadón?", ["Para que el viento no lo dañe", "Porque le falta luz del sol", "Porque los guanacos lo pisan"], "Pista: pensá en el clima de la meseta."),
  mc("r2-quillango", "¿Con qué hacían el quillango los aonikenk?", ["Con cueros de guanaco cosidos", "Con lana de oveja tejida", "Con hojas de lenga secas"], "Pista: los aonikenk cazaban un animal de la estepa."),
];

// ---------------------------------------------------------------- 3. Deseado
const E3: ActividadReserva[] = [
  mapa("r3-mapa", "Tocá en el mapa el departamento Deseado.", "departamento", "deseado", "Pista: es el departamento del noreste, sobre el mar."),
  mc("r3-cabecera", "¿Cuál es la cabecera del departamento Deseado?", ["Puerto Deseado", "Caleta Olivia", "Pico Truncado"], "Pista: lleva el nombre del departamento."),
  clasif("r3-localidades", "¿De qué departamento es cada localidad?", ["Deseado", "Lago Buenos Aires"], ["Caleta Olivia", "Pico Truncado", "Las Heras"], ["Perito Moreno", "Los Antiguos"], "Pista: Deseado está sobre el mar y Lago Buenos Aires, junto a la cordillera."),
  mc("r3-ria", "¿Qué es la ría Deseado?", ["Un cañadón del río por donde entra el mar", "Un lago de agua dulce rodeado de la meseta", "Un río de montaña que baja desde los glaciares"], "Pista: mirá la postal de esta etapa."),
  mc("r3-penacho", "¿Qué tiene el pingüino de penacho amarillo arriba de los ojos?", ["Plumas amarillas", "Una mancha blanca", "Un pico naranja"], "Pista: su nombre te da la respuesta."),
  mc("r3-penacho-sube", "¿Cómo sube por las rocas el pingüino de penacho amarillo?", ["A los saltos, con las patas juntas", "Volando de roca en roca", "Arrastrándose sobre la panza"], "Pista: lo leíste en su ficha."),
  mc("r3-penacho-isla", "¿Dónde anida el pingüino de penacho amarillo en Santa Cruz?", ["En la Isla Pingüino", "En la Cueva de las Manos", "En el lago Buenos Aires"], "Pista: está frente a Puerto Deseado."),
  mc("r3-penacho-come", "¿Qué come el pingüino de penacho amarillo?", ["Krill, calamares y peces chicos", "Pastos y brotes de la costa", "Huevos de otras aves"], "Pista: caza en el mar."),
  vf("r3-penacho-vulnerable", "El pingüino de penacho amarillo es una especie vulnerable: su población bajó mucho.", true, "Pista: fijate en la categoría de su ficha."),
  mc("r3-molle", "¿Dónde crece el molle?", ["En cañadones con un poco de reparo", "En el fondo de las lagunas de la meseta", "En la arena húmeda de las playas"], "Pista: busca protegerse del viento."),
  mc("r3-mate", "¿Qué costumbre patagónica es el mate?", ["Compartirlo en la casa, el campo y la escuela", "Tomarlo solamente en las fiestas patrias", "Prepararlo solo cuando llegan visitas de lejos"], "Pista: es algo de todos los días."),
  vf("r3-costa", "El departamento Deseado tiene costa sobre el mar.", true, "Pista: mirá dónde está Puerto Deseado en el mapa."),
];

// ---------------------------------------------------------------- 4. Magallanes
const E4: ActividadReserva[] = [
  mapa("r4-mapa", "Tocá en el mapa el departamento Magallanes.", "departamento", "magallanes", "Pista: está sobre el mar, al sur de Deseado."),
  mc("r4-cabecera", "¿Cuál es la cabecera del departamento Magallanes?", ["Puerto San Julián", "Puerto Santa Cruz", "Río Gallegos"], "Pista: su bahía aparece en la postal."),
  mc("r4-magallanes", "¿Qué pasó en la bahía de San Julián en 1520?", ["La expedición de Magallanes pasó el invierno", "Se fundó la primera ciudad de la provincia", "Llegaron los colonos galeses en el Mimosa"], "Pista: el departamento lleva el nombre de ese navegante."),
  mc("r4-nao", "¿Qué hay hoy en Puerto San Julián para recordar ese viaje?", ["Una réplica de la nao Victoria", "Un faro rojo y blanco en una isla", "Un monumento al obrero petrolero"], "Pista: es un barco."),
  mc("r4-tonina-color", "¿De qué colores es la tonina overa?", ["Blanca y negra", "Gris y celeste", "Marrón y blanca"], "Pista: como una vaca overa."),
  mc("r4-tonina-come", "¿Qué come la tonina overa?", ["Peces chicos, calamares y camarones", "Algas y plantas que crecen en el fondo", "Aves marinas que atrapa en la orilla"], "Pista: es un delfín."),
  mc("r4-tonina-vive", "¿Dónde vive la tonina overa?", ["En aguas frías y poco profundas de la costa", "En los lagos grandes de la cordillera", "En el mar abierto, muy lejos de la costa"], "Pista: se la ve en bahías y rías."),
  vf("r4-tonina-peligro", "La tonina overa está en peligro de extinción.", false, "Pista: fijate en la categoría de su ficha."),
  mc("r4-tonina-peligro2", "¿Qué problema pueden tener las toninas?", ["Quedar atrapadas en redes de pesca", "Congelarse en el invierno", "Quedarse sin pasto para comer"], "Pista: lo dice la parte de conservación de su ficha."),
  mc("r4-coiron", "¿Para qué sirven las raíces del coirón?", ["Para sujetar la tierra contra el viento", "Para guardar agua como hace un cactus", "Para trepar por las rocas de los cañadones"], "Pista: sin coirón el viento se lleva el suelo."),
  mc("r4-coiron-come", "¿Qué animales comen coirón?", ["Los guanacos y las ovejas", "Los pumas y los zorros", "Los pingüinos y las toninas"], "Pista: son herbívoros de la meseta."),
  mc("r4-tijera", "¿Para qué se usaba la tijera de esquila?", ["Para cortar la lana de las ovejas", "Para cortar leña para el fuego", "Para cortar cueros de guanaco"], "Pista: se usaba en las estancias."),
];

// ---------------------------------------------------------------- 5. Corpen Aike
const E5: ActividadReserva[] = [
  mapa("r5-mapa", "Tocá en el mapa el departamento Corpen Aike.", "departamento", "corpen-aike", "Pista: está sobre el mar, entre Magallanes y Güer Aike."),
  mc("r5-cabecera", "¿Cuál es la cabecera del departamento Corpen Aike?", ["Puerto Santa Cruz", "Río Gallegos", "Gobernador Gregores"], "Pista: tiene el nombre de la provincia."),
  mc("r5-localidad", "¿Qué localidad de Corpen Aike está frente a la Isla Pavón?", ["Comandante Luis Piedra Buena", "Puerto San Julián", "Gobernador Gregores"], "Pista: lleva el nombre del marino que vivió en la isla."),
  mc("r5-rio", "¿Sobre qué río está la Isla Pavón?", ["El río Santa Cruz", "El río Deseado", "El río Gallegos"], "Pista: es el río más grande de la provincia."),
  mc("r5-parque", "¿Qué parque nacional está en Corpen Aike?", ["Monte León", "Los Glaciares", "Perito Moreno"], "Pista: es el parque de la costa con pingüinos y lobos marinos."),
  mc("r5-puma-come", "¿Qué come el puma?", ["Guanacos, liebres y choiques", "Hojas, brotes y frutos", "Krill y peces chicos"], "Pista: es carnívoro."),
  mc("r5-puma-vive", "¿Cómo vive el puma?", ["Solo, y caza de noche o al atardecer", "En manadas grandes durante el día", "En parejas dentro de cuevas de hielo"], "Pista: es un cazador solitario."),
  vf("r5-puma-ruge", "El puma no ruge: maúlla, silba y gruñe.", true, "Pista: es un dato curioso de su ficha."),
  vf("r5-puma-peligro", "El puma está en peligro de extinción.", false, "Pista: fijate en la categoría de su ficha."),
  mc("r5-mata", "¿Cómo son las flores de la mata negra?", ["Blancas y con perfume", "Rojas y sin olor", "Amarillas y espinosas"], "Pista: aparecen en verano."),
  mc("r5-recado", "¿Qué es el recado criollo?", ["La montura del paisano", "Un abrigo de cuero de guanaco", "Un instrumento para hilar"], "Pista: se pone sobre el caballo."),
  clasif("r5-costa-cordillera", "¿Dónde está cada departamento?", ["Tiene costa sobre el mar", "No llega al mar"], ["Corpen Aike", "Magallanes", "Deseado"], ["Río Chico", "Lago Buenos Aires"], "Pista: mirá en el mapa cuáles tocan el mar."),
];

// ---------------------------------------------------------------- 6. Lago Argentino
const E6: ActividadReserva[] = [
  mapa("r6-mapa", "Tocá en el mapa el departamento Lago Argentino.", "departamento", "lago-argentino", "Pista: está en el oeste, junto a la cordillera y a Chile."),
  mc("r6-cabecera", "¿Cuál es la cabecera del departamento Lago Argentino?", ["El Calafate", "El Chaltén", "Río Turbio"], "Pista: tiene el nombre de una planta con frutos violetas."),
  mc("r6-glaciar", "¿Qué glaciar famoso está en el departamento Lago Argentino?", ["El glaciar Perito Moreno", "El glaciar Martial de Ushuaia", "El glaciar del volcán Lanín"], "Pista: lo muestra la postal."),
  mc("r6-glaciar-parque", "¿En qué parque nacional está el glaciar Perito Moreno?", ["Los Glaciares", "Monte León", "Nahuel Huapi"], "Pista: el nombre del parque habla del hielo."),
  mc("r6-localidades", "¿Qué localidad está al pie del cerro Fitz Roy?", ["El Chaltén", "Puerto Deseado", "Las Heras"], "Pista: está en la cordillera, en el norte del departamento."),
  mc("r6-condor-come", "¿Qué come el cóndor andino?", ["Animales que ya están muertos", "Peces que pesca en el lago", "Semillas y frutos del bosque"], "Pista: es carroñero."),
  mc("r6-condor-alas", "¿Cuánto mide el cóndor con las alas abiertas?", ["Unos 3 metros", "Unos 30 centímetros", "Unos 10 metros"], "Pista: es una de las aves voladoras más grandes del mundo."),
  mc("r6-condor-huevos", "¿Cada cuánto pone un huevo el cóndor?", ["Uno cada dos o tres años", "Diez huevos cada primavera", "Uno por mes todo el año"], "Pista: por eso le cuesta tanto recuperarse."),
  mc("r6-condor-peligro", "¿Cuál es el mayor peligro para el cóndor?", ["Los cebos con veneno", "El frío de la montaña", "La falta de árboles altos"], "Pista: lo dice la parte de conservación de su ficha."),
  mc("r6-notro", "¿Quiénes llevan el polen del notro de flor en flor?", ["Los picaflores", "Los cóndores", "Los pumas"], "Pista: toman el néctar de sus flores rojas."),
  vf("r6-notro-flores", "El notro se llena de flores rojas en primavera.", true, "Pista: también lo llaman fosforito."),
  mc("r6-huso", "¿Para qué sirve el huso?", ["Para convertir la lana en hilo", "Para cortar la lana de la oveja", "Para teñir la lana de colores"], "Pista: es un palito que gira."),
];

// ---------------------------------------------------------------- 7. Güer Aike
const E7: ActividadReserva[] = [
  mapa("r7-mapa", "Tocá en el mapa el departamento Güer Aike.", "departamento", "guer-aike", "Pista: es el departamento del extremo sur de la provincia."),
  mc("r7-cabecera", "¿Cuál es la cabecera de Güer Aike y capital de Santa Cruz?", ["Río Gallegos", "Río Turbio", "Puerto Santa Cruz"], "Pista: es la ciudad más poblada de la provincia."),
  mc("r7-carbon", "¿Qué se saca de la mina de Río Turbio?", ["Carbón", "Oro", "Sal"], "Pista: pensá en la lámpara del minero."),
  clasif("r7-localidades", "¿De qué departamento es cada localidad?", ["Güer Aike", "Lago Argentino"], ["Río Gallegos", "Río Turbio", "28 de Noviembre"], ["El Calafate", "El Chaltén"], "Pista: Güer Aike está en el extremo sur."),
  mc("r7-faro", "¿Qué empieza en Cabo Vírgenes?", ["La Ruta Nacional 40", "El río Santa Cruz", "La cordillera de los Andes"], "Pista: lo dice la postal."),
  mc("r7-cauquen-viaje", "¿Qué hace el cauquén colorado cada otoño?", ["Viaja unos 2.400 km hacia el norte", "Se esconde en una cueva hasta la primavera", "Se va a vivir al fondo del mar"], "Pista: es un ave que migra."),
  mc("r7-cauquen-invierno", "¿Dónde pasa el invierno el cauquén colorado?", ["En el sur de la provincia de Buenos Aires", "En los lagos congelados de la cordillera", "En las islas más australes del canal Beagle"], "Pista: allí hace menos frío."),
  mc("r7-cauquen-cuantos", "¿Cuántos cauquenes colorados quedan en el continente?", ["Menos de 1.000", "Más de un millón", "Unos 100.000"], "Pista: es un número muy chico: está en peligro crítico."),
  vf("r7-cauquen-plaga", "Durante años cazaron al cauquén colorado como si fuera una plaga del trigo.", true, "Pista: lee la parte de conservación de su ficha."),
  mc("r7-cauquen-come", "¿Qué come el cauquén colorado?", ["Pastos tiernos y brotes", "Peces y calamares", "Insectos de los troncos"], "Pista: es herbívoro."),
  mc("r7-murtilla", "¿Cómo crece la murtilla?", ["Pegada al suelo, como una alfombra", "Alta como un árbol de 40 metros", "Flotando en las lagunas"], "Pista: así se protege del viento del sur."),
  mc("r7-lampara", "¿Para qué usan la lámpara los mineros?", ["Para ver dentro de la mina", "Para avisar a los barcos", "Para calentar la comida"], "Pista: bajo tierra no llega la luz del sol."),
];

// ---------------------------------------------------------------- 8. Tierra del Fuego
const E8: ActividadReserva[] = [
  mapa("r8-mapa", "Tocá en el mapa la provincia de Tierra del Fuego.", "provincia", "tierra-del-fuego", "Pista: está al sur de Santa Cruz, cruzando el estrecho de Magallanes."),
  mc("r8-capital", "¿Cuál es la capital de Tierra del Fuego?", ["Ushuaia", "Río Grande", "Tolhuin"], "Pista: es la ciudad más austral del país."),
  mc("r8-canal", "¿Sobre qué canal está Ushuaia?", ["El canal Beagle", "El canal de Panamá", "El canal del río Santa Cruz"], "Pista: lo dice la postal del faro."),
  vf("r8-malvinas", "Las Islas Malvinas forman parte de la provincia de Tierra del Fuego, Antártida e Islas del Atlántico Sur.", true, "Pista: mirá el nombre completo de la provincia."),
  mc("r8-carpintero-come", "¿Qué come el carpintero gigante?", ["Larvas de insectos de los troncos", "Peces chicos que pesca en los ríos", "Semillas de coirón y de otros pastos"], "Pista: golpea los troncos con el pico."),
  mc("r8-carpintero-macho", "¿Cómo se reconoce al carpintero gigante macho?", ["Tiene la cabeza roja", "Tiene un penacho amarillo", "Tiene el pico blanco y largo"], "Pista: la hembra tiene la cabeza negra."),
  mc("r8-carpintero-nido", "¿Dónde hace su nido el carpintero gigante?", ["En un hueco de un árbol", "En la arena de la playa", "Flotando en una laguna"], "Pista: vive en el bosque."),
  mc("r8-lenga-otono", "¿Qué le pasa a la lenga en otoño?", ["Sus hojas se ponen rojas y amarillas", "Se llena de frutos violetas", "Le salen flores blancas con perfume"], "Pista: después pierde las hojas."),
  mc("r8-lenga-dano", "¿Qué animal traído de otro continente daña los bosques de lenga?", ["El castor", "El huemul", "El cóndor"], "Pista: corta árboles con los dientes y hace diques."),
  mc("r8-canoa", "¿Con qué hacían sus canoas los yaganes?", ["Con corteza de árbol", "Con cuero de guanaco", "Con tablas de alerce"], "Pista: el nombre del objeto lo dice."),
  vf("r8-canoa-fuego", "Los yaganes llevaban un pequeño fuego dentro de la canoa para calentarse.", true, "Pista: lee la ficha del objeto."),
  mc("r8-pais", "¿Qué país comparte con nosotros la Isla Grande de Tierra del Fuego?", ["Chile", "Uruguay", "Brasil"], "Pista: es el país vecino del oeste."),
];

// ---------------------------------------------------------------- 9. Chubut
const E9: ActividadReserva[] = [
  mapa("r9-mapa", "Tocá en el mapa la provincia del Chubut.", "provincia", "chubut", "Pista: está justo al norte de Santa Cruz."),
  mc("r9-capital", "¿Cuál es la capital del Chubut?", ["Rawson", "Comodoro Rivadavia", "Puerto Madryn"], "Pista: está cerca de Trelew."),
  mc("r9-limite", "¿Qué provincia está justo al norte de Santa Cruz?", ["Chubut", "Neuquén", "Tierra del Fuego"], "Pista: mirá el mapa de la Patagonia."),
  mc("r9-ballena-cuando", "¿Cuándo llegan las ballenas francas a Península Valdés?", ["Entre mayo y diciembre", "Solo en enero", "Nunca: viven en los lagos"], "Pista: vienen en invierno y primavera."),
  mc("r9-ballena-para", "¿Para qué llegan las ballenas a los golfos de la península?", ["Para tener a sus crías", "Para buscar agua dulce", "Para esconderse de la nieve"], "Pista: las madres cuidan a su cría cerca de la costa."),
  mc("r9-ballena-come", "¿Cómo come la ballena franca?", ["Filtra el agua con sus barbas", "Muerde peces grandes con sus dientes", "Come algas de la playa"], "Pista: no tiene dientes."),
  mc("r9-ballena-huella", "¿Qué tiene cada ballena franca distinto, como una huella digital?", ["Las manchas blancas de la cabeza", "La cantidad de aletas del cuerpo", "El color de los ojos y del lomo"], "Pista: se llaman callosidades."),
  vf("r9-ballena-recupero", "La ballena franca casi desapareció por la caza, pero se recuperó.", true, "Pista: lee la parte de conservación de su ficha."),
  mc("r9-alerce-vive", "¿Cuánto tiempo puede vivir un alerce?", ["Miles de años", "Unos diez años", "Unos pocos meses"], "Pista: a uno le dicen «El Abuelo»."),
  mc("r9-alerce-peligro", "¿Por qué está en peligro el alerce?", ["Lo talaron mucho por su madera", "Se lo comen las ballenas", "Lo arrasan las olas del mar"], "Pista: su madera es muy buena."),
  mc("r9-galeses", "¿Quiénes trajeron a Chubut la costumbre del té con torta?", ["Los colonos galeses", "Los navegantes de Magallanes", "Los mineros de Río Turbio"], "Pista: llegaron en 1865 en el barco Mimosa."),
  mc("r9-parque-alerce", "¿En qué parque nacional del Chubut hay alerces?", ["Los Alerces", "Monte León", "Tierra del Fuego"], "Pista: el parque lleva el nombre del árbol."),
];

// ---------------------------------------------------------------- 10. Río Negro
const E10: ActividadReserva[] = [
  mapa("r10-mapa", "Tocá en el mapa la provincia de Río Negro.", "provincia", "rio-negro", "Pista: está al norte del Chubut y llega al mar."),
  mc("r10-capital", "¿Cuál es la capital de Río Negro?", ["Viedma", "San Carlos de Bariloche", "General Roca"], "Pista: está en la costa, cerca del mar."),
  mc("r10-lago", "¿Qué lago grande está junto a Bariloche?", ["El Nahuel Huapi", "El lago Argentino", "El lago Buenos Aires"], "Pista: lo muestra la postal."),
  mc("r10-parque", "¿Qué tiene de especial el Parque Nacional Nahuel Huapi?", ["Fue el primer parque nacional del país", "Es el único parque con glaciares", "Es el parque más chico del país"], "Pista: lo dice la postal."),
  mc("r10-huillin-que", "¿Qué animal es el huillín?", ["Una nutria de río", "Un ciervo de montaña", "Un ave de laguna"], "Pista: vive en el agua y tiene cola larga."),
  mc("r10-huillin-come", "¿Qué come el huillín?", ["Cangrejos de río y peces", "Pastos tiernos y brotes", "Frutos de calafate"], "Pista: los busca buceando."),
  mc("r10-huillin-sano", "Si en un río vive el huillín, ¿qué nos dice?", ["Que el agua está sana", "Que el agua está muy caliente", "Que en ese río hay ballenas"], "Pista: es un dato curioso de su ficha."),
  mc("r10-huillin-peligro", "¿Qué animal traído de otro continente amenaza al huillín?", ["El visón americano", "El carpintero gigante", "El cauquén colorado"], "Pista: también es un peligro para el macá tobiano."),
  vf("r10-huillin-caza", "Hasta 1950 cazaban al huillín por su piel.", true, "Pista: lee la parte de conservación de su ficha."),
  mc("r10-coihue", "¿Qué le pasa al coihue en invierno?", ["Sigue con sus hojas verdes", "Pierde todas sus hojas", "Se llena de frutos rojos"], "Pista: es un árbol siempreverde."),
  mc("r10-coihue-alto", "¿Cuánto puede medir un coihue?", ["Más de 40 metros", "Menos de 1 metro", "Unos 2 metros"], "Pista: es tan alto como un edificio de muchos pisos."),
  mc("r10-trapelacucha", "¿Qué es la trapelacucha?", ["Una joya mapuche de plata", "Una manta de cuero de guanaco", "Una canoa de corteza"], "Pista: las mujeres la llevan en el pecho."),
];

// ---------------------------------------------------------------- 11. Neuquén
const E11: ActividadReserva[] = [
  mapa("r11-mapa", "Tocá en el mapa la provincia del Neuquén.", "provincia", "neuquen", "Pista: es la provincia del noroeste de la Patagonia."),
  mc("r11-capital", "¿Cuál es la capital del Neuquén?", ["Neuquén", "Zapala", "San Martín de los Andes"], "Pista: se llama igual que la provincia."),
  mc("r11-lanin", "¿Qué es el Lanín?", ["Un volcán nevado", "Un lago de agua salada", "Un río que llega al mar"], "Pista: lo muestra la postal."),
  mc("r11-gato-come", "¿Qué caza el gato andino?", ["Chinchillones", "Pingüinos", "Ballenas chicas"], "Pista: también se llaman vizcachas de montaña."),
  mc("r11-gato-vive", "¿Dónde vive el gato andino?", ["En zonas rocosas de montaña", "En el fondo de los lagos", "En las playas del mar"], "Pista: en la Patagonia, en el norte del Neuquén."),
  mc("r11-gato-cola", "¿Cómo es la cola del gato andino?", ["Muy gruesa y larga, con anillos", "Corta y sin pelo", "Chata como la de un castor"], "Pista: le sirve para equilibrarse."),
  mc("r11-gato-especial", "¿Qué tiene de especial el gato andino?", ["Es el único felino de América en peligro", "Es el felino más grande del mundo", "Es el único gato que vive en el mar"], "Pista: buscá el sello rojo de su ficha."),
  vf("r11-gato-visto", "El gato andino es muy fácil de ver en las rutas del Neuquén.", false, "Pista: se lo conoce por fotos de cámaras trampa."),
  mc("r11-pehuen-semillas", "¿Cómo se llaman las semillas del pehuén?", ["Piñones", "Calafates", "Bellotas"], "Pista: los pehuenches los comen hervidos o tostados."),
  mc("r11-pehuen-vive", "¿Cuánto puede vivir un pehuén?", ["Más de mil años", "Unos veinte años", "Solo un verano"], "Pista: crece muy despacio."),
  mc("r11-pehuenches", "¿Qué quiere decir «pehuenche»?", ["Gente del pehuén", "Gente del mar", "Gente de la nieve"], "Pista: el nombre está formado con el nombre del árbol."),
  mc("r11-witral", "¿Qué se hace en el witral?", ["Mantas y fajas tejidas", "Joyas de plata", "Canoas de corteza"], "Pista: es un telar."),
];

export const BANCOS: Record<number, ActividadReserva[]> = {
  1: E1, 2: E2, 3: E3, 4: E4, 5: E5, 6: E6, 7: E7, 8: E8, 9: E9, 10: E10, 11: E11,
};
