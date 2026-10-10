# AG-27 · Ciencias Naturales de 4.º reescrita a mano (y repaso de Sociales)

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Prioridad:** es la que sigue. 4.º sigue con `publicado: false`.

## Antes de empezar
1. Claude unió AG-20, AG-25 y AG-26 a main **a partir de tu carpeta**, incluido lo que no tenía commit.
2. Para no perder nada: `git add -A && git commit -m "AG-26 (lo que faltaba commitear)"`.
3. Después: `git pull origin main && git merge -X theirs main`. Si algo choca, gana main: ahí están tus cambios más los arreglos de Claude.

## La revisión de AG-26: bien hecha
**Parte A (avatar):** completa y unida a main.
- Guardar desde una versión vieja ya no borra capas.
- «Adelante»/«Atrás» funciona solo entre las capas del personaje.
- La vista previa de la tienda muestra el objeto que se mira.
- La función del gorrito del aniversario es pura y el test la usa.
- La captura muestra el orden de las capas.

**Parte B (Sociales): mejoró mucho.**
- Desaparecieron las colas y los códigos de relleno.
- 780 pistas distintas, ninguna cortada.
- La correcta es la más larga en el 24 % y la más corta en el 24 %.
- 4 pares de verdadero/falso que salen todos.
- No hay paráfrasis repetidas dentro de un mundo.

**Claude arregló:**
- choique «ave voladora» → «ave corredora»;
- tres preguntas con dos respuestas correctas (s23 talabartería, s24 libros de las misiones, s25 artículo 14 bis);
- tres asserts de `test-torneo` que pasaban siempre.

### Lo que todavía queda en Sociales (Parte B de esta tarea)
1. **Distractores cortos y absurdos que delatan la respuesta.** En 152 preguntas (19 %) un distractor tiene 1 a 3 palabras frente a una correcta larga, y casi siempre es de chiste:
   - «Transatlánticos», «No pagan entrada», «Se regalan a clientes», «Pantalones cortos», «Conductora de camión», «Cambiar de nombre», «Un viaje turístico», «Tazas de loza», «Buceo en coral».
   - También quedan absurdos largos: «helicópteros particulares de lujo», «túnicas de seda con bordados dorados», «relleno de baldosas», «acuarelas escolares», «Canal de Suez», «la kermés de Luján».

   Cambialos por opciones **creíbles y del mismo tipo** que la respuesta.
2. **Los emojis delatan la respuesta.** En varias preguntas el emoji de la incorrecta no tiene que ver con el tema (🚗 🚲 ✈️ 🏎️ en preguntas de mulas o derechos). Usá emojis del tema en las tres opciones, o el mismo en las tres.
3. **Verdadero/falso:** cerca de la mitad de las falsas siguen siendo absurdas:
   - «llanura verde y selvática», «el Fitz Roy es una isla de arena», «manglares»;
   - «refinación de caña de azúcar en Río Turbio», «mapas satelitales en el siglo XV», «un tribunal secreto de jueces», «las personas esclavizadas cobraban sueldos elevados».

   Buenas, para tomar de ejemplo: «limita al norte con Río Negro», «la capital es Caleta Olivia», «los Aonikenk eran agricultores sedentarios».
4. **Vocabulario:** «preexistencia étnica», «artículo 41», «precordillera o sierras bajas» (en Santa Cruz no se usa así).
5. Las pistas que dicen la respuesta: «lleva el mismo nombre que su departamento» (s2).

---

## Parte A · Ciencias Naturales de 4.º, mundo por mundo y a mano
Mismo método que Sociales en AG-26 (leé `AG-26-avatar-cierre-y-sociales-4.md`, Parte B).

En Naturales hay que sacar lo que quedó de AG-25:
- **Pistas cortadas:**
  - «no ruge como los sino que emite y.» (~72)
  - «a la superficie en de, o.» (~651)
  - «transportar la en el.» (~387)
- **Pistas de otra pregunta:**
  - una pregunta de verano con pista de invierno (~748);
  - «mejores conductores» con una pista sobre aislantes (~360);
  - también ~817, 144 y 207.
- **Frases de otro tema pegadas en las incorrectas:** «…reteniendo los sólidos insolubles mientras el líquido fluye por el papel poroso» (N8), «…liberando tensiones acumuladas en fallas activas de la corteza litosférica» (~317).
- **Preguntas con 2 o 3 respuestas correctas:** huemul (~75), almohadillas del guanaco (~82), esporas (~144), N6 y N7.
- **Absurdos:** «un cubo perfecto» (~679), «rocas plásticas» (~817), «carbón cae del cielo», «árboles de plástico».
- **Errores de contenido:**
  - El árbol siempreverde de Santa Cruz es el **guindo** (coihue de Magallanes), no el coihue (~47).
  - «Mata mora o mata guanaco» son dos plantas distintas (~67).
  - «¿Cómo influye la rotación…?» → «los husos horarios» (~720) no responde la pregunta.
- **Vocabulario:** «litosférica», «estomas», «inducción», «geoide», «drupas», «mareomotriz», «hipocentro», «heterótrofos», «líquido sinovial», «carpo».

### Controles (los mismos de Sociales, ahora también para Naturales)
- Ningún `\d+_\d+` ni «relevamiento».
- La correcta es la más larga en ≤ 34 % y la más corta en ≤ 34 %.
- Ninguna pista cortada.
- Los 4 pares de verdadero/falso salen en 40 vueltas.
- Control nuevo en Sociales y Naturales: **ninguna pregunta con un distractor de 1 a 3 palabras cuando la correcta tiene 6 o más**.

### Sobre la repetición entre vueltas
Con 30 preguntas por mundo y 6 por vuelta, si la app no recuerda qué salió antes, es normal que alguna se repita (pasa en ~75 % de las vueltas). Claude va a hacer que la app recuerde por alumno las últimas preguntas vistas (tarea de Claude).

Vos no tenés que bajar ese número. El control de «< 50 % con estado nuevo» del pedido anterior **no aplica**. Dejá el control de repetición **dentro** de una vuelta.

## Entrega
`npx tsc --noEmit`, `npx eslint src`, `test-grado4`, `test-avatar-capas`, `test-torneo` y los de siempre en verde.

En TAREAS.md:
- la lista de mundos de Naturales con **un ejemplo antes → después** de cada uno;
- la lista de cambios de Sociales.

Marcá AG-27 «✅ LISTA PARA REVISAR».
