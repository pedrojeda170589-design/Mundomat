# AG-17 · Corrección del contenido de 4.º grado (devolución de la revisión de AG-16)

**Asignada a:** Antigravity · **Revisa:** Claude · **Pide:** Pedro (docente)

Claude revisó 4.º grado. La integración técnica está bien:
- los ids no chocan;
- `getWorld` y el panel encuentran los mundos;
- 1.º a 3.º siguen funcionando;
- se respetaron las zonas que no había que tocar.

El **contenido no está listo para los chicos**. Claude unió el código a `main` pero dejó 4.º **oculto**:
- en `GRADES`, 4.º tiene `publicado: false`;
- un aula de 4.º sigue viendo 3.º, como antes.

**No cambies `publicado` vos.** Lo pasa a `true` Claude, cuando apruebe esta tarea y Pedro dé el visto bueno.

Antes de empezar: `git merge main`. Ahí está la revisión de Claude, con arreglos en AG-14 y AG-15.

## 1. Opciones rellenadas (lo más grave)

En `sociales.ts` y `naturales.ts` hay unas 360 opciones incorrectas «estiradas» con colas que no dicen nada, solo para que la correcta no sea la más larga. Ejemplos:
- «en distintas partes del territorio»
- «en otras zonas geográficas del país»
- «durante todo el año en la provincia»
- «en condiciones naturales del ambiente»
- «en los ambientes naturales de la región»

Solo una vez aparece una de esas colas en la respuesta correcta. Así el chico aprende «la opción con esa frase está mal», no el contenido.

El reemplazo automático además rompió textos (líneas aproximadas):
- **Artículos repetidos:**
  - «El El cerro Aconcagua», «El El cerro Fitz Roy», «El El río Bermejo», «El El río Deseado», «El El Lago Cardiel» (sociales.ts ~56, 62, 68, 76, 79)
  - «Los Los Diaguitas» (~201, 240)
  - «En el El Concejo Deliberante» (~359)
  - «El El Poder Legislativo» (~360)
- **Información pegada a la opción:** «los Los Diaguitas (agricultores de los valles del noroeste) en toldos de cuero» (~272).

**Hacé:**
- Reescribí los distractores. Tienen que ser breves, del mismo tipo que la respuesta (si la respuesta es un río, los distractores son ríos) y verosímiles.
- Nunca agregues texto de relleno.
- En Lengua pasa lo contrario: la correcta es la **más corta** en el 42 % de las preguntas. Equilibrala también.
- En `scripts/test-grado4.ts` agregá:
  - el control de «la correcta es la más corta en más del 30 %»;
  - una lista de frases prohibidas (las colas de arriba);
  - una búsqueda de palabras repetidas seguidas («El El», «Los Los»).

## 2. Errores de datos (corregilos o sacá la pregunta)

**naturales.ts**
- ~61: la rosa mosqueta **no** tiene «flores amarillas y frutos en cápsula». Tiene flores rosadas o blancas y frutos rojos (escaramujos).
- ~81: las «proteínas anticongelantes» son de peces marinos polares, no de los de lagos glaciarios.
- ~33: la mara no es «exclusiva de la Patagonia». Es endémica de la Argentina y llega hasta el noroeste.
- ~137: las amenazas del macá tobiano son el visón americano, la gaviota cocinera y las truchas introducidas (no «gorriones»).
- ~34: «la corzuela» (no «El corzuela»).

**sociales.ts**
- ~290: Magallanes **no** «demostró que la Tierra es redonda»; eso ya se sabía. Lo que logró la expedición fue la primera vuelta al mundo y el paso entre los dos océanos.
- ~282: lo de «patagones» por «grandes huellas» es etimología popular. Si se pregunta, que se aclare que es una leyenda, o sacala.
- ~309, pista: las mareas de Santa Cruz no son «las más amplias del continente americano» (la Bahía de Fundy, en Canadá, tiene mayores). Decí «de las más amplias del mundo».
- ~73: el Lago San Martín (O'Higgins del lado chileno) **también** se comparte con Chile. Hay dos respuestas correctas.
- ~97: la pregunta pide el nombre de una represa y la respuesta es genérica. Corregí la pregunta o la respuesta.
- ~114: al Parque Nacional Perito Moreno se llega desde **Gobernador Gregores**, no está «cercano a Perito Moreno» (la ciudad).
- ~61, pista: solo algunos bajos están bajo el nivel del mar (por ejemplo, el Gran Bajo de San Julián).
- ~169: Caleta Olivia no es «Capital del Petróleo»: la Capital Nacional del Petróleo es Comodoro Rivadavia. Caleta Olivia es conocida por el Monumento al Obrero Petrolero.
- ~43: verificá cuál es el departamento más poblado. Si hay duda, sacá la pregunta.
- ~289: la Victoria era una **nao**, no una carabela.

## 3. Preguntas con dos respuestas correctas

- **matematica.ts ~586:** «2 porciones de 8» acepta «2/8», pero el distractor «1/4 de la pizza» es equivalente. Usá distractores **no** equivalentes.
- **matematica.ts ~202:** cuando las cifras de unidades de mil y de centenas son iguales, el distractor intercambiado también es correcto. Generá otro distractor.
- **lengua.ts ~172:** el colectivo de «árbol» es «arboleda» **y** «bosque». Sacá uno de los dos de las opciones.
- **lengua.ts ~186:** «patagón» también es un gentilicio válido. Elegí otro distractor.
- **lengua.ts ~163:** «puerto deseado (debe ir Puerto Deseado)» delata la respuesta.
- **lengua.ts ~316:** sacá «Tugo».

## 4. Contenido fijo o repetitivo

- Los 26 mundos de Lengua y 9 de Matemática (42016 a 42021 y 42023 a 42025) tienen **exactamente 8 preguntas**, así que cada vuelta es la misma.
  - En Matemática las actividades tienen que **generarse al azar**, como pide AG-16.
  - En Lengua, los bancos tienen que tener 20 preguntas o más.
- **42007:** la correcta queda siempre en el medio (2400 de 2400 vueltas), y el enunciado ya trae los valores redondeados.
- **42002 y 42003:** el número ya está en el enunciado.
- **42003:** «Toda la provincia» nunca sale.
- **42008:** siempre usa nafta a $850 y almuerzo a $3500. Variá los valores.

## 5. Falta parte del Diseño Curricular (columna de 4.º)

- **Matemática:**
  - proporcionalidad directa (está en el DC y en AG-16)
  - tablas y gráficos
  - peso y capacidad
  - reloj y calendario
  - superficies
  - fracciones en la recta numérica
  - decimales por 10, 100 y 1000
  - planos
  - Además, 4.º arranca en «Números hasta 10.000», que es nivel de 3.º: empezá en el rango de 4.º.
- **Naturales:**
  - sonido (tono, timbre, intensidad)
  - electrostática
  - conductores eléctricos
  - terremotos y volcanes
  - dimensiones del planeta
- **Sociales:**
  - pueblos mapuche y mapuche-tehuelche
  - una gran civilización americana (incas, mayas o aztecas)
  - los motivos de los viajes europeos y la fundación de ciudades
  - la conquista espiritual y el mestizaje
- **Lengua:**
  - Faltan **lecturas**: sumá mundos de comprensión con textos cortos propios (noticia, texto expositivo, biografía). Los mundos de **cuentos** los sigue haciendo Claude.
  - Reglas de c/s/z, g/j, ll/y y h: hoy hay solo 8 preguntas, y ll/y no aparece.

Sociales y Naturales tienen 20 mundos cada una; la orientación es de 25 a 40.

## 6. Variedad de actividades

- **Lengua:** hoy es 100 % opción múltiple. Sumá ordenar, clasificar, unir, verdadero/falso y buscar el error.
- **Sociales y Naturales:** al menos 2 actividades de otro tipo por vuelta, en todos los mundos.

## 7. Prerrequisitos y resumen

- Los prerrequisitos son una cadena lineal entre temas sin relación (Esqueleto depende de Impacto humano). Que dependan solo de lo que de verdad hace falta.
- El resumen de `TAREAS.md` no coincide con el código: nombres de mundos (42001 «hasta 100.000» frente a «hasta 10.000»), habilidades y `makeStoryPick`. Actualizalo con **lo que hay en el código**.
- Agregá:
  - la línea del DC de cada mundo;
  - la **lista de módulos por materia** (título y los ids de sus mundos), como pide AG-16.

## Comprobar

- `scripts/test-grado4.ts` con los controles nuevos del punto 1.
- `test-simulation`, `test-cuentos`, `test-dictado`, `test-colecciones`, `test-vuelta`, `test-privacidad` y `test-modulos`.
- `npx tsc --noEmit`, `npx eslint src` y `npm run build`.

Al terminar, marcá «✅ AG-17 LISTA PARA REVISAR» en `TAREAS.md` y esperá la revisión. **No** empieces 5.º hasta que 4.º esté aprobado.
