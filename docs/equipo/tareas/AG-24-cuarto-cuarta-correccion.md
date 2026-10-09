# AG-24 · Cuarta corrección de 4.º: relleno, distractores de chiste, pistas y variedad

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Prioridad:** es la que sigue. 4.º **sigue oculto** (`publicado: false`): no lo publiques.

**Antes de empezar:** `git checkout antigravity && git pull origin main && git merge main`. Leé la «Revisión de Claude» de AG-21 en `TAREAS.md`.

## Qué ya corrigió Claude al unir AG-21 (no lo deshagas)
- **Verdadero/falso de Lengua con la clave al azar** (10 mundos): la afirmación y la respuesta se sorteaban por separado, así que «Las noticias se escriben en versos con rima» salía como Verdadero la mitad de las veces. Ahora se usa `makeVF(id, verdadera, falsa, pista, skills)` (`src/lib/grade4/content/util.ts`). **Usalo siempre** que quieras sortear entre una afirmación verdadera y una falsa.
- Mundo 42014: la tabla en markdown (`| Cajas | … | :---: |`) se veía con rayas y la voz la leía. Ahora la tabla va como apoyo visual (`apoyo: { tipo: "tabla", columnas, filas }`) y los tres escenarios salen al azar.
- 42023: los precios se escriben como en Argentina con `pesosAR` («$1.157,50», «$2.000»).
- «pucaráes» → «pucarás»; los mestizos no estaban bajo encomienda (sociales, s22).

## 1. Sacar el «relleno» de las opciones incorrectas (lo más urgente)
Para emparejar el largo de las opciones se pegaron **frases de relleno a 329 opciones incorrectas** (y a ninguna correcta), por ejemplo:
- «Lobos marinos de un pelo **según las reglas ortográficas y gramaticales del español**» (`lengua.ts` ~49, 109, 154, 201, 401…)
- «3 carabelas pequeñas **durante los diferentes períodos de la historia regional**» (`sociales.ts` ~82, 176, 302, 376, 438, 475)
- «… **en todo momento en todo momento**» (`naturales.ts` ~421, 457, 462)
- «En el manto inferior de roca fundida **las áreas naturales protegidas de la región**» (naturales, mundo 25: frase rota)

Los chicos aprenden enseguida que «la opción con la cola rara es la mala». **Sacá todo el relleno.** El largo parejo se logra escribiendo distractores **reales y del mismo tipo** que la respuesta (si la respuesta es un lugar, los distractores son otros lugares del tema; si es una explicación, otras explicaciones plausibles pero incorrectas), no agregando frases.
- Test: en `scripts/test-grado4.ts`, agregá un control que detecte **cualquier** frase que se repita como final en 3 o más opciones distintas (no solo las de «…territorio»), y que ninguna opción tenga una palabra repetida dos veces seguida.

## 2. Distractores de chiste (siguen en el ~75 % de Sociales y Naturales)
Ejemplos que quedan: «freno de bicicleta» (`sociales.ts` ~366), «piano de cola» (~281), «Rascacielos… piletas de natación» (~298), «sucursal bancaria / hipermercado» (~421), «en Japón el Sol no brilla nunca» (`naturales.ts` ~442), «día extra de vacaciones» (~450), «meteoritos espaciales» (~402). Revisá **todas** las preguntas de Sociales y Naturales (no solo las listadas) y reemplazá cada distractor absurdo por uno plausible para un chico de 4.º que no estudió el tema.

## 3. Verdadero/falso creíble y variado
- Las afirmaciones falsas no pueden ser absurdas («Colón viajó en barcos a vapor», «Magallanes llegó en tren», «la Tierra es plana»: `sociales.ts` ~626, 632, 638, 662; `naturales.ts` ~524, 530, 548, 644, 650, 662, 668). Tienen que ser **errores que un chico podría creer** (una fecha corrida, un lugar cercano, una causa confundida).
- Cada mundo tiene un solo par verdadero/falso: armá **al menos 4 pares por mundo** y elegí uno por vuelta.
- La pista de la versión falsa no puede decir la respuesta correcta (`naturales.ts` ~519, 525).

## 4. Pistas que regalan la respuesta (AG-21 punto 1.6, no hecho)
31 % de las pistas de Sociales y 34 % de Naturales repiten las palabras clave de la respuesta (69 y 90 la copian textual). También `matematica.ts` ~1655, 1661, 1673 y `lengua.ts` ~600 («no en la 'i'»), ~605 («tuvo»). Una pista **orienta** («pensá en qué estación nacen las crías»), no dice la respuesta. Cambiá el control 6 del test para que mida esto (coincidencia de palabras de 5+ letras entre la pista y la opción correcta) y que falle si pasa del 5 %.

## 5. Etiquetas que delatan y órdenes con más de una respuesta
- «pino / libro (i-o)» contra «(-ino)» (`lengua.ts` ~839); «estaba (imperfecto descriptivo)», «remontó (perfecto simple histórico)» (~487-488); «Mata de coirón con clorofila» (`naturales.ts` ~709); «Pozos de agua dulce subterránea» en la categoría «Subterránea».
- Ordenar con más de un orden válido: `naturales.ts` ~704 (n4-ex-1, ya pedido en AG-21) y ~523; `sociales.ts` ~716 (estaciones por viento); `lengua.ts` ~697 y ~936 (sangría y mayúscula son simultáneas). Si no hay un único orden indiscutible, cambiá la actividad por otra.
- Respuestas que repiten la pregunta: represas (`sociales.ts` ~95); «¿Qué río desemboca frente a Río Gallegos?» → «El Río Gallegos».

## 6. Vocabulario
«sublimación inversa» (`naturales.ts` ~264), «ampolla o embudo de decantación con llave de paso» (~306), «electrones» (~378): decilo como para 4.º («el vapor se vuelve hielo», «un embudo con canilla»).

## 7. Variedad en Matemática y en las actividades extra
- 42017 tiene 10 ítems (pedido: 15 o más) y «EQUIVALENTE a 1/2» sale dos veces en el 63 % de las vueltas.
- 42015 (16 distintas), 42019 (18), 42024/42026/42027 (17), 42025 y 42028 repiten alguna actividad de la vuelta anterior en el 100 % de las vueltas: llevá cada banco a **30 o más** variantes (generadas con números al azar donde se pueda).
- En una misma vuelta se repite una actividad en 42021 (5 %, se mezcla dentro del bucle en ~1676) y 42009 (4 %): que nunca se repita dentro de una vuelta.
- Las actividades extra (clasificar/ordenar) de Lengua son siempre las mismas; en Sociales y Naturales las 3 extras salen en el 60-74 % de las vueltas: armá **al menos 3 por mundo** y elegí 1 o 2 al azar.

## 8. Pruebas (obligatorio)
`scripts/test-grado4.ts` con los controles nuevos de los puntos 1 y 4, más:
- verdadero/falso: en 200 vueltas, cada afirmación siempre con la misma clave (verdadera → siempre Verdadero);
- ningún distractor de una lista de palabras de chiste (armala con los ejemplos de arriba y ampliala);
- repetición entre vueltas: en 50 pares de vueltas seguidas, menos del 30 % con alguna actividad repetida;
- ninguna actividad repetida dentro de una vuelta.

## Entrega
`npx tsc --noEmit`, `npx eslint src`, `test-grado4` y los de siempre en verde. Resumen en `TAREAS.md` con cada punto «hecho», cómo lo probaste y los números medidos (antes → después).
