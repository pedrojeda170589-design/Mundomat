# AG-25 · Correcciones de AG-20 (editor del avatar) y AG-24 (cuarta corrección de 4.º)

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Prioridad:** es la que sigue.

**Antes de empezar:** `git checkout antigravity && git pull origin main && git merge main`. Si `docs/equipo/TAREAS.md` choca, en las filas AG-20, AG-24 y AG-25 quedate con la versión de main.

Claude revisó AG-20 y AG-24 (commits 3a96517 y 6f3c5e6) y **no las unió a main**: tienen problemas que hay que arreglar antes. Seguí en la misma rama, sobre lo que ya hiciste. 4.º sigue con `publicado: false`.

---

## Parte A · AG-20, editor del avatar (primero: afecta a los alumnos de 1.º a 3.º)

### A1. Los compañeros siguen viendo el avatar viejo (grave)
Estas rutas solo mandan `avatarAccessories`/`avatarTweaks`, así que los compañeros ven un objeto por lugar, en el orden fijo de antes y con una sola mascota:
- `src/app/api/competition/route.ts` (~74, 172, 203)
- `src/app/api/news/route.ts` (~88)
- `src/app/api/messages/route.ts` (~100)

Mandá también `capas: capasDe(p)` y pasalas a `AvatarDisplay` en `CompetitionBanner`, `ClassMailbox`, `NewsBoard`, `competencia/page.tsx` y `competencia/jugar/page.tsx`. También en `CaminoRacha.tsx` ~65-68 (el encabezado; la línea 185 ya está bien).

Buscá con `grep -rn "avatarAccessories\|accessories=" src` **todos** los lugares donde se dibuja un avatar y dejá anotado en TAREAS cuáles revisaste.

### A2. Guardar por el campo viejo borra las capas (grave)
En `src/lib/data.ts` ~482, si llega `accessories` (por ejemplo, desde una pestaña abierta con la versión anterior durante el deploy), se reconstruyen las capas desde los lugares fijos. Se pierden los objetos extra, las mascotas 2 y 3 y el orden.

Cuando el alumno ya tiene `avatarCapas`, aplicá el cambio de ese lugar sobre las capas, sin rehacerlas.

### A3. Solo se dibuja un objeto de mano
`AvatarDisplay` usa `allCapas.find(isProp)`, pero `validarCapas` deja equipar varios. Elegí una de dos:
- limitar a **un** objeto de mano, con un mensaje claro en el editor;
- o dibujarlos todos sin que se pisen.

Y la tercera mascota no puede tapar al objeto de mano.

### A4. Errores claros
- `updateStudentProfile` devuelve `null` y el alumno ve «Avatar, accesorio o fondo inválido.». Devolvé el mensaje de `validarCapas`, por ejemplo «Ya tenés 5 accesorios: sacá uno para poner otro».
- El cartel de error tiene que verse **al lado del botón Guardar**. Hoy quedó arriba del modal, fuera de la vista en el celular.

### A5. La gorra del aniversario y la corona del cumpleaños
- La gorra del aniversario (`progress/route.ts` ~65) se agrega a las capas sin mirar el límite de 5. Si ya tiene 5, no la agregues; o reemplazá el último objeto de cabeza.
- La corona del cumpleaños se dibuja **encima** del gorro del alumno. Antes reemplazaba lo que tenía en la cabeza; volvé a eso.

### A6. Accesibilidad y botones
- Los botones adelante/atrás/sacar tienen que decir de qué objeto son: `aria-label="Mover la gorra adelante"`.
- Tienen que tener texto visible, «⬆️ Adelante» / «⬇️ Atrás», como pedía AG-20.
- Mover adelante/atrás una mascota o un objeto de mano no cambia nada en el dibujo. Ocultá esos botones para esos objetos, o explicá qué hacen.

### A7. Limpieza
- `scripts/captura-avatar-capas.ts` tiene una ruta de tu compu (`C:\Users\Remberto Pedro\.gemini\…`). Sacala; nunca dejes rutas personales en el repositorio.
- **Sacá `public/capturas/avatar-capas.png`.** Todo lo que está en `public/` se puede descargar desde internet. Si querés guardarla, va en `docs/equipo/capturas/`.
- Sacá `playwright` de `package.json` y `package-lock.json`. Para una captura se usa `npx playwright` sin agregarlo al proyecto.
- La captura tiene que mostrar el orden de verdad: dos objetos que se superpongan, uno adelante y otro atrás.

### A8. El test falla (`scripts/test-avatar-capas.ts` ~242)
Usa ids que no existen o que no corresponden: «gorra» y «lentes» puestos en `seasonalCollection`, «casco-vikingo», «mascota-zorrito». Depende de quién es el primer alumno de la base local.

- Fijá el avatar del alumno de prueba y usá ids reales: un objeto de la tienda comprado, un premio de temporada, un objeto prestado del torneo.
- Agregá estas pruebas a nivel servidor:
  - guardar se rechaza cuando el préstamo ya venció;
  - guardar por el campo viejo `accessories` no borra las capas (A2);
  - la gorra del aniversario no pasa el límite (A5).

---

## Parte B · AG-24, contenidos de 4.º: los números del test mejoraron, pero el contenido no

Revisión de Claude sobre 200 vueltas por mundo:

### B1. Pistas: genéricas o de otro tema
Para bajar la «filtración» a 0 % se pusieron pistas genéricas y muchas son **de otro tema**:
- Sociales tiene 16 pistas distintas para 390 preguntas; «recordá los conceptos explicados en clase sobre este tema» aparece 157 veces.
- Cerca de 1 de cada 4 pistas de Sociales es de otro tema:
  - `sociales.ts` ~22: tipo de mapa, con la pista de «cuencas hídricas»;
  - ~130: helada, con «etapas históricas»;
  - ~500: ciudadanía, con «centros urbanos»;
  - `naturales.ts` ~133: guardaparque, con «atracción o repulsión entre cargas»;
  - ~263: 0 °C, con «movimientos del planeta»;
  - `lengua.ts`, mundo 8: el cierre de una carta, con «la enseñanza final del relato».

**Cada pregunta necesita su propia pista**, que oriente sin decir la respuesta («pensá en qué estación nacen las crías»).

- Las pistas de las actividades extra (ordenar/clasificar) dicen la respuesta entera: `sociales.ts` ~1093 («Caleta Olivia está al norte, San Julián en el centro y Río Gallegos al sur»), ~1100; `naturales.ts` ~1212.
- En el verdadero/falso, la pista contiene una palabra que solo está en la versión verdadera en el 24-31 % de los pares.

### B2. Siguen los distractores absurdos (~50 %, antes ~75 %)
En 126 preguntas leídas de Sociales y Naturales, la mitad tiene al menos una opción absurda.

- Ejemplos de Sociales: «sal marina traída por gaviotas» (~98), «votaciones electrónicas» (~244), «Bumeranes» (~266), «ponerse protector solar» (~272), «ciclistas de carreras» (~320), «Escriben códigos de software» (~342).
- Ejemplos de Naturales: «funcionan con pilas» (~101), «Se congelan al instante» (~355), «plantas derriten las montañas» (~475).

Cada distractor tiene que ser algo que un chico de 4.º que no estudió **podría elegir**.

### B3. Verdadero/falso: ~70 % de las falsas siguen siendo absurdas
Ejemplos: «Las Heras… sobre el Océano Pacífico», «Los pucarás eran barcos», «El fémur es el hueso más diminuto», «el turismo solo consiste en la venta de semillas de trigo». Muchas son negaciones totales («nunca…», «no existen…»), fáciles de descartar.

Buenas, para tomar de ejemplo: «El Calafate, cabecera de Magallanes», «las estaciones por la distancia al Sol».

### B4. La respuesta correcta sigue siendo la más larga
Es la única más larga en el 38-40 % de las preguntas; por azar sería 33 %. En Naturales la correcta tiene 54 caracteres y los distractores 46.

**Bajá el límite del test al 34 %.** Además, en 146 preguntas solo la correcta tiene un paréntesis: «(Creciente en el hemisferio sur)» `naturales.ts` ~416, «El coihue (o guindo)», «(clima árido)». Sacá esos paréntesis o ponelos parejo en todas las opciones.

### B5. Apareció relleno nuevo
- «por razones históricas y económicas del territorio»
- «facilitar la lectura fluida del relato escolar»
- «y facilitar la integración de las distintas regiones»
- «a través de rutas comerciales y acuerdos regionales»
- «según las investigaciones históricas y geográficas»

El test no lo ve: solo cuenta finales de 4-8 palabras repetidos 3 veces y tiene una lista de excepciones. Cambiá el control para que avise de **cualquier** final de 4+ palabras que se repita 2 o más veces en opciones incorrectas.

### B6. La repetición entre vueltas se midió mal
`getSig` (`test-grado4.ts` ~834) incluye el orden de las tarjetas, así que la misma pregunta mezclada cuenta como distinta. Medido sin el orden:

- Matemática repite el 29,6 % (se informó 7 %).
- 42024 repite el 89 %, 42025 el 88 %, 42026 y 42027 el 84 %, 42015 y 42019 el 81 %, 42028 el 67 % y 42018 el 57 %.
- Lengua, Sociales y Naturales repiten algo en el 95-99 % de las vueltas, porque sacan 6 de 15-20 preguntas. Llevá cada banco a **30 o más** y aplicá el control de menos del 30 % también a esas materias.

Además, 42017 tiene 8 actividades y todas son la misma pregunta «EQUIVALENTE a…». Variá el tipo:
- ¿cuál es mayor?;
- ubicar en la recta;
- completar el numerador;
- la fracción de un dibujo.

### B7. Órdenes con más de una respuesta y opciones que también valen
- n2-ex-1 y n4-ex-1 (`naturales.ts` ~1100, ~1114) son el mismo ciclo de la lenga, sin punto de partida. Lo mismo n23-ex-1 (el día).
- s7-ex-1 tiene un orden arbitrario; s2-ex-1 es orden alfabético.
- `sociales.ts` ~298: terrazas, acequias y muros de contención valen las tres.
- ~250: «raíces comestibles» también es en parte cierta.
- `lengua.ts` ~488: «estaba» y «estuvo» son las dos correctas.
- `naturales.ts` ~302 y ~306 son casi la misma pregunta, en el mismo mundo.
- La respuesta repite la pregunta: Río Gallegos (`sociales.ts` ~99).

### B8. Vocabulario
Todavía muy difícil para 4.º:
- «empíricamente», «trascendental»
- «hipocentro» (6 veces), «heterótrofos» (6 veces)
- «personería jurídica», «preexistencia étnica»
- «líquido sinovial», «carpo»
- «compresibilidad», «baquelita»
- la jerarquía de las leyes (s25-ex-1)

### B9. Errores de contenido
- s5-ex-2: «Argentino y Viedma alimentan los glaciares». Es al revés: los glaciares alimentan los lagos.
- s19-ex-0: la brújula aparece como orientación «astronómica»; es magnética.
- «El coihue (o guindo)»: son dos especies distintas.
- ~386: «comprobó la redondez de la Tierra» es un mito escolar; Colón no lo comprobó.
- ~212: la Isla Pingüino es Parque Interjurisdiccional Marino (desde 2009), no reserva provincial. La línea ~79 ya lo dice bien.
- s21-ex-2: Santa Fe aparece en «Corriente del Este (España/Atlántico)». Garay vino desde Asunción.
- 42024, pista «terminarán coincidiendo»: decí «se van a cruzar».

## Pruebas (obligatorio)
- **Parte A:** `test-avatar-capas` en verde, con los casos de A8.
- **Parte B:** `test-grado4` con los controles corregidos:
  - largo ≤ 34 %;
  - relleno con 2 o más repeticiones;
  - repetición sin el orden de las tarjetas y en todas las materias;
  - pistas de las actividades extra y del verdadero/falso incluidas;
  - lista de palabras de chiste ampliada con los ejemplos de B2 y B3;
  - un control nuevo: **ninguna pista se repite en más de 3 preguntas**.
- `npx tsc --noEmit`, `npx eslint src` y los tests de siempre en verde.

## Entrega
En `TAREAS.md`, un resumen punto por punto (A1…A8, B1…B9): qué hiciste, cómo lo probaste y los números antes → después medidos **sin** el orden de las tarjetas. Marcá AG-25 «✅ LISTA PARA REVISAR».
