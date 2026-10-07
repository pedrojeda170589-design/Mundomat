# AG-21 · Tercera corrección de 4.º grado (lo que quedó de AG-18)

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Prioridad:** es la que sigue (AG-19 ya está unida a main). **Antes de empezar:** `git checkout antigravity && git merge main`, y leé la «Revisión de Claude» de AG-19 en `TAREAS.md`: allí aparecieron los mismos problemas (respuesta correcta siempre en la primera opción, distractores de chiste, dos respuestas correctas); para mezclar opciones podés usar el patrón de `mezclarActividad` en `src/lib/monteLeon/contenido.ts`. 4.º **sigue oculto** (`publicado: false`).

AG-18 quedó unida a `main` (oculta): se corrigió mucho (bancos de Naturales en su mundo, Sociales sin opciones corridas, romanos, duplicados, singulares, sin ✅/❌, `makeOrder` al azar). La revisión de Claude (lectura completa de los 780 ítems de Naturales y Sociales y 3.000 a 20.000 vueltas por mundo de Matemática) encontró esto, que **bloquea la publicación**:

## 1. Respuestas que se adivinan sin saber (lo más urgente)
1. **Todos los verdadero/falso (52) tienen «Verdadero» como respuesta.** Que haya mitad y mitad, con afirmaciones falsas plausibles.
2. **Clasificar:** los ítems vienen siempre alternados (0,1,0,1) y `ClassifyActivity` no los mezcla. Mezclalos al armar la actividad.
3. **Las actividades extra (`EXTRA_*`) se arman una sola vez al cargar el módulo**, así que el orden mezclado queda fijo toda la sesión. Convertilas en funciones que se llamen en cada vuelta.
4. **Etiquetas que dicen la respuesta** en ordenar/clasificar: naturales 542, 547, 563, 567, 568, 587, 588, 593, 623; sociales 518, 542; lengua 1146-1148 «(pasado puntual)/(presente)/(futuro)». Sacá los paréntesis.
5. **La correcta es la más larga** en 75 % de Naturales y 64 % de Lengua (al azar sería 33 %). Igualá largos. Y que el test **falle** si la correcta es la más larga en más del 40 % de un banco (hoy solo imprime el porcentaje).
6. **Pistas que copian la respuesta** (se pueden comprar antes de contestar): que la pista oriente, no que repita la opción (ej. matemática 1061, 940, 427, 2018; casi todas las de Naturales). Ajustá el check 6 para que exija «comparte una palabra clave», no la frase entera.
7. **lengua.ts:600**: la correcta es la única con explicación («cancíon (la forma correcta es canción)»). **matematica.ts:416-418**: las opciones de comparar romanos traen los números («XC > C (90 es mayor que 100)»).

## 2. Distractores de chiste que siguen
Naturales 42, 60, 69, 79, 82, 150, 158, 191, 305, 308, 344, 365, 404, 486; Sociales 174, 190, 229, 245, 266, 344, 418, 419, 479, 496; Lengua 114, 115, 135, 607; Matemática 1855 («El cuadrado tiene 5 lados»). Reemplazalos por errores que un chico de 9 años podría cometer de verdad.

## 3. Errores de contenido
- **naturales.ts:440**: al mediodía en Santa Cruz la sombra apunta al **sur** (el sol está al norte). Corregí pregunta y pista.
- **naturales.ts:137**: Monte León es **Parque Nacional** (no monumento natural) y la mayor colonia continental de pingüinos es **Punta Tombo** (Chubut).
- **naturales.ts:300**: el colador que separa fideos del agua es **filtración**, no tamización (contradice la 584).
- **naturales.ts:518** (pista): el guanaco no es «el mayor camélido». **:582**: el imán no «decanta». **:128**: el castor está en Tierra del Fuego, no establecido en Santa Cruz. **:32**: «amarillo anaranjado». **:479**: la respuesta repite la pregunta. **:523**: ítem de ordenar sin secuencia clara.
- **sociales.ts:327**: palabra en inglés («domesticated»). **:246**: carácter chino «雕» como emoji. **:300 y :462**: Pucará de Tilcara es omaguaca, no diaguita (usá Quilmes). **:158**: la tonina overa no es Monumento Natural Nacional. **:251**: la Cueva de las Manos es de antiguos cazadores-recolectores (unos 9.000 años), no de los aonikenk. **:436**: el Camino Real no era empedrado. **:557** y el título del mundo 11: la pesca es actividad **primaria** (y la congelación, secundaria). **:191**: pregunta y respuesta no coinciden. **:360**: frase sin sentido. **:95**: decí «las represas sobre el río Santa Cruz» (sin nombres de personas). **:108 y :534**: «menos de 200 a 300 mm» → «menos de 300 mm». **:56**: El Gorosito es de **hormigón**, no de bronce (verificalo). **:77**: si no podés confirmar un «Cerro Ventana» cerca de Gobernador Gregores con una fuente, sacalo. **:487 y :634**: simplificá la Legislatura (sin «24 bancas, 10 y 14»).
- **lengua.ts:129**: Darwin y FitzRoy subieron el río Santa Cruz en botes balleneros, no «a bordo del Beagle». **:126**: sacá la fecha de Casimiro Biguá si no hay fuente. **:291**: la sangría se arma con espacios que no se ven (`PickActivity` no usa `whitespace-pre`): cambiá la consigna. **:509** (nada está destacado), **:436, 1107, 1119** («estudian (ustedes)» no es 2.ª persona gramatical), **:790-791** (cierres de carta con «:»), **:1257-1259** (prefijos mezclados con sufijos), **:292** (raya de cierre), **:81** (causa y consecuencia invertidas), **:490 y :607** (dos preguntas casi iguales de tuvo/tubo).
- Vocabulario demasiado técnico: heterótrofos (absortivos), electrones libres, ampolla de decantación con robinete, sublimación inversa.

## 4. Matemática
1. **matematica.ts:1501-1502 (42022)**: aparecen números como «7,199999999999999» en el 28 % de las vueltas. Redondeá y mostrá con coma decimal (usá una función `decimalAR(n, cifras)`).
2. **Mundos con las mismas actividades en todas las vueltas** (solo cambia el orden de las opciones): 42005, 42015, 42016, 42018, 42019, 42024, 42025, 42026, 42027 y la estadística de 42028. Cada uno necesita generador o banco de 15+ y elegir al azar.
3. **42021 (:1409)**: `milesimosPreguntas[i % 3]` repite la misma pregunta dos veces en todas las vueltas y las otras nunca salen.
4. **Generadores que repiten valores** (42008 :529, 42013 :813/:828, 42023 :1545/:1568): sacá los repetidos dentro de la vuelta. Por eso el test falla un 25-30 % de las veces: arreglá el generador, **no** aflojes el test.
5. **42003 (:219, :234)**: los mínimos y máximos de población por ciudad no se usan (Gobernador Gregores tiene unos 6.000 habitantes; Río Gallegos, unos 115.000).
6. **42014**: falta divisores y la «tabla de valores» tiene que ser una tabla de verdad. **:1367**: distractor «70 m» para 2,50 m (era `m*100+cm`). **42027**: más de 3 preguntas de cuadriláteros.

## 5. Test (`scripts/test-grado4.ts`)
- Check 1: que falle con números con más de 3 decimales o con «e-», y con «NaN»/«undefined» **dentro** del texto.
- Check 3: que mire también el **emoji** de cada opción.
- Nuevos checks: verdadero/falso con al menos 35 % de «falso» por mundo; clasificar sin patrón alternado; la correcta no puede ser la más larga en más del 40 % de un banco; ninguna actividad igual en 2 vueltas seguidas en más del 50 % de los mundos de Matemática.
- El test tiene que pasar **10 veces seguidas** (sin fallas al azar).

## Entrega
`npx tsc --noEmit`, `npx eslint src`, `npx tsx scripts/test-grado4.ts` (10 veces), `test-modulos`. Trabajá en la rama `antigravity` (AG-18 se hizo sobre el árbol de `main`: no lo repitas). Resumen en `TAREAS.md` con cada punto «hecho» y cómo lo comprobaste.
