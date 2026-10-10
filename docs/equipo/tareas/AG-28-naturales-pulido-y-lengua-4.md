# AG-28 · Pulido de Naturales de 4.º y Lengua de 4.º reescrita a mano

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Prioridad:** es la que sigue. 4.º sigue con `publicado: false`.

**Antes de empezar:** `git checkout antigravity && git pull origin main && git merge -X theirs main`. Si algo choca, gana main.

## Revisión de AG-27 (unida a main como borrador oculto)
- **Sociales: muy bien.** Se corrigieron los distractores cortos de chiste, los emojis que delataban, las falsas absurdas de la lista, el vocabulario y la pista de s2.
  - Mediciones: la correcta es la más larga en el 25 % de las preguntas y la más corta en el 31 %; 780 pistas distintas; ninguna cortada ni con códigos.
  - Quedan dos detalles: «manglares» y «caña de azúcar» siguen en algún distractor o falsa.
- **Naturales: mejoró mucho y sin trampas viejas.** No quedan pistas cortadas ni códigos de relleno, no hay preguntas con dos respuestas, y el guindo y el huemul ya están bien. Pero aparecieron tres problemas nuevos (Parte A).

---

## Parte A · Naturales: lo que falta

### A1. Colas pegadas para emparejar largos (≈ 13 % de las preguntas)
En 99 de las 780 preguntas, un distractor de 15 palabras o más termina con una frase que no tiene nada que ver. Ejemplos:
- «…sobre los acantilados de piedra dura» (pregunta sobre la sangre en los músculos)
- «…en las terrazas basálticas oscuras» (sedentarismo)
- «…bajo la luz difusa del atardecer» (reciclar papel)
- «…durante marejadas atlánticas intensas» (electricidad estática)
- «…a través del vacío interplanetario» (tren magnético)
- «…por la conductividad del cobre puro» (gravedad)
- «…bajo la presión de columnas de agua» (fotosíntesis)
- «…con reactivos químicos comunes» (vinagre y aceite)
- «…en las laderas cordilleranas altas», «…bajo la radiación solar directa», «…por la fuerza constante del viento», «…en las cuencas hídricas provinciales»

Esto es justo lo que prohíbe la regla del README: **sacalas todas**. Si las opciones quedan de largo desparejo, escribí distractores **reales** del mismo tipo, no frases agregadas.
- Control nuevo en `test-grado4.ts`: ningún distractor de 15 palabras o más que tenga 1,3 veces las palabras de la correcta (hoy hay 99).

### A2. Distractores absurdos
El patrón es: un distractor corto de chiste junto a uno largo con cola. Ejemplos:
- «Tienen raíces de metal bajo tierra», «Pueden volar libremente por el cielo»
- «Poseen cascos de metal pesado…», «Hace que el pelo no crezca», «Cae una lluvia de aceite mineral»
- «Porque usan zapatos pesados», «Porque gigantes antiguos amontonaron rocas…»
- «…por evaporación mágica», «Se convierte en vapor dulce que perfuma…», «Las plantas transpiran hielo seco»
- «El hierro fundido en altos hornos» para la madera

Cada distractor tiene que ser un **error que un chico de 4.º podría cometer**:
- en la escarcha: «el rocío que se congela después», en vez de «lluvia de aceite»;
- en los hongos: «porque viven en lugares húmedos», en vez de «raíces de metal».

### A3. Pistas con vocabulario de secundaria
Para no repetir palabras de la respuesta, las pistas quedaron difíciles. Ejemplos:
- «corpúsculos diminutos», «remoción del estrato lipídico flotante», «asterismo cruciforme»
- «orogénesis por empuje colosal entre bloques litosféricos», «gran eficiencia en la conservación hídrica corporal»
- «combustible metabólico», «sistema material de una sola fase», «líquidos inmiscibles… afinidad química»

La pista es para un chico de 9 o 10 años: frases cortas y palabras de todos los días, como en «pensá en qué estación nacen las crías». Se puede decir lo mismo sin regalar la respuesta: «Pensá en qué parte del hueso hay algo blando adentro».

### A4. Verdadero/falso
Las falsas todavía son muchas veces lo opuesto absurdo:
- «los seres vivos están formados por fibras minerales»
- «los glaciares son de agua de mar salada»
- «el agua de deshielo desaparece en el espacio»
- «los cuatro subsistemas son cuatro minerales»
- «la geósfera son solo las nubes»

Usá errores creíbles, por ejemplo:
- «Las nubes están formadas por vapor de agua caliente» (muchos chicos lo creen);
- «Los murciélagos son aves»;
- «El Sol gira alrededor de la Tierra».

### A5. Vocabulario de las preguntas
Revisá estas palabras: «macroscópicas», «coriáceas», «geósfera» (si no se trabajó), «perihelio y afelio» (no es de 4.º; sacá esa pregunta), «ácido úrico».

---

## Parte B · Lengua de 4.º, mundo por mundo y a mano
Mismo método que Sociales (AG-26) y Naturales (AG-27). En Lengua, además:
- **Gramática:** las preguntas tienen **una sola respuesta correcta**. Revisá los casos dudosos, como «estaba / estuvo» (`lengua.ts`, cerca de la línea 488) y las etiquetas que delatan, como «pino / libro (i-o)».
- **Ortografía:** que las palabras de ejemplo sean correctas y de uso común en Santa Cruz.
- **Textos de lectura:** cortos, claros y con una pregunta que se responda con el texto.
- **Órdenes:** ordenar con un único orden posible (sangría y mayúscula son simultáneas: no sirven para ordenar).
- **Pistas:** sin fuga y con vocabulario de 4.º.

## Pruebas (obligatorio)
- `test-grado4` con el control nuevo de A1, aplicado a Naturales y a Lengua.
- Los controles de Sociales aplicados también a Lengua.
- Lista de palabras de chiste ampliada con los ejemplos de A2.
- `npx tsc --noEmit`, `npx eslint src` y los tests de siempre en verde.

## Entrega
En TAREAS.md:
- Parte A, punto por punto, con números antes → después.
- Parte B: los mundos de Lengua con **un ejemplo antes → después** de cada uno.

Marcá AG-28 «✅ LISTA PARA REVISAR».
