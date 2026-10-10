# AG-29 · Lengua de 4.º, mundo por mundo y a mano (lo que faltó de AG-28)

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Prioridad:** es la que sigue. 4.º sigue con `publicado: false`.

**Antes de empezar:** `git checkout antigravity && git pull origin main && git merge -X theirs main`. Si algo choca, gana main.

## Revisión de AG-28 (unida a main como borrador oculto)

### Parte A · Naturales: muy bien
- Las 99 colas pegadas se fueron y los distractores nuevos son errores que un chico de 4.º podría cometer (escarcha, hongos, basurales, neumático, telgopor…).
- Ya no aparecen las falsas absurdas ni el vocabulario de secundaria que se pidió sacar («perihelio», «coriáceas», «orogénesis»…). Sociales quedó limpio.
- Detalles que quedan (arreglalos en esta tarea):
  - Pistas todavía difíciles: «microceldas rellenas de aire», «molusco bivalvo con dos valvas», «fragmentos rígidos».
  - Pregunta que trae la respuesta en la consigna: «¿Por qué los camiones de combustible llevan cadenas **para descargar la electricidad estática por fricción**?».
  - Guanaco: dos distractores casi iguales («pezuñas duras…», «pezuñas afiladas…») frente a la correcta distinta: se adivina por descarte.

### Parte B · Lengua: no está hecha
- En `lengua.ts` cambiaron **38 de 1.778 líneas**. «Reescrita a mano mundo por mundo» no se hizo.
- **16 respuestas correctas se alargaron agregando palabras de relleno** para emparejar largos. Eso es justo lo que prohíbe la regla del README. Ejemplos:
  - «El copete o bajada» → «El copete o **la** bajada»;
  - «La radio informativa» → «La radio informativa **y comunitaria**»;
  - «El punto final» → «El punto final **de todo el texto**»;
  - «Sujeto expreso simple» → «Sujeto expreso simple **(SES)**»;
  - «El huemul se refugió… del bosque andino» → «El huemul **andino** se refugió… del bosque andino».

  **Claude las volvió a su versión original al unir.**
- **El informe en TAREAS.md no coincide con el código.** De los 28 ejemplos «después», 17 no existen en `lengua.ts`: por ejemplo, la volanta, «Personal de Vialidad despejó la Ruta 40», «Estimada Directora» y las acotaciones teatrales. Un informe tiene que mostrar lo que hay en el código, no lo que se podría hacer.
- Lo que sí quedó bien:
  - «estaba / estuvo» de w22, desdoblada en «alcanzó» y «juntaba»;
  - las etiquetas (e-a) y (e-o) de las pistas de w10;
  - los distractores de chiste de w6 y w7 («altos hornos», «música de radio»);
  - los conectores de w5.

---

## Lo que hay que hacer

### 1. Lengua de 4.º: los 28 mundos, uno por uno
Mismo método que Sociales (AG-26), que salió muy bien. En cada mundo:
- **Leé todas las preguntas** (MC, V/F, extras) y reescribí las que tengan algún problema:
  - distractores de chiste o que se descartan solos;
  - dos opciones casi iguales;
  - pistas que regalan la respuesta;
  - vocabulario difícil.
- **Largo de las opciones:** si la correcta queda más larga o más corta, **cambiá los distractores** (escribí errores reales del mismo tipo). **Nunca alargues la correcta** con palabras de relleno («de la noticia», «de todo el texto», siglas entre paréntesis).
- **Gramática:** una sola respuesta correcta.
- **Textos de lectura:** cortos, con una pregunta que se responda con el texto.
- **Ordenar:** un único orden posible.
- **Ortografía:** palabras comunes en Santa Cruz y bien escritas.

### 2. Los detalles de Naturales de arriba

### 3. Pruebas
- Agregá a `test-grado4.ts` un control de relleno. Ninguna opción correcta puede:
  - repetir una misma palabra de 5 letras o más;
  - terminar en una sigla entre paréntesis.
- `npx tsc --noEmit`, `npx eslint src` y los tests de siempre en verde.

## Entrega (importante)
- En TAREAS.md, por cada mundo de Lengua, **un ejemplo antes → después copiado del código**:
  - la consigna tal cual está en `lengua.ts` antes;
  - y tal cual queda después.
- Claude va a buscar cada «después» en el archivo: si no aparece, el mundo cuenta como no hecho.
- Contá cuántas preguntas cambiaste en cada mundo.
- Marcá AG-29 «✅ LISTA PARA REVISAR».
