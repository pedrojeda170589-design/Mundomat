# AG-18 · Segunda corrección del contenido de 4.º grado

**Asignada a:** Antigravity · **Rama:** `antigravity` · **4.º sigue oculto** (`publicado: false` en `src/lib/grades.ts`: no lo cambies).

AG-17 quedó unida a `main` (sigue oculta). La revisión de Claude encontró problemas graves que el test `scripts/test-grado4.ts` no detecta. Hay que arreglarlos todos **y agregar comprobaciones automáticas** para que no vuelvan.

## 1. Críticos (bloquean la publicación)

### 1.1 Ciencias Naturales: los bancos no coinciden con los mundos
`naturales.ts` tiene los bancos numerados del 1 al 26, pero el tema de cada banco **no es** el del mundo con ese número en `worlds.ts`. Solo coinciden 1, 8, 9, 10 y 26. Ejemplos: el mundo 2 «Flora» recibe fauna y el 3 al revés; 5 «Cuatro reinos» recibe cadenas alimentarias; 11 «Materiales» recibe nutrición; 13 «Estados de la materia» recibe propiedades de materiales; 15 «Mezclas» recibe electrostática; 21 «Ciclo del agua» recibe la forma de la Tierra; 24 «Estaciones» recibe el ciclo del agua.
- Usá **`worlds.ts` como fuente de verdad** (es lo que ve el alumno y lo que pide el Diseño Curricular): volvé a asignar cada banco al mundo de su tema.
- Faltan bancos completos para: **cuatro reinos, estados de la materia, cambios de estado, mezclas, separación de mezclas, luz y sombras**. Escribilos (15+ preguntas cada uno, más sus 2 actividades extra).
- Los extras (`EXTRA_NATURALES`) también tienen que ser del tema del mundo, y conviene tener **más de 2 por mundo** (hoy siempre salen los mismos dos).

### 1.2 Ciencias Sociales: opciones que no corresponden a la pregunta
En los mundos 5 y 8 a 26 (más de 200 preguntas) las opciones están **corridas**: no son de esa pregunta y la marcada como correcta (índice 0) no tiene sentido. Ejemplos: «¿Qué río del norte…?» ofrece «Meseta de estepa árida»; «¿Qué tratado de 1494…?» ofrece «Hombres españoles con propiedades»; «ley suprema» ofrece «Poder Ejecutivo, Legislativo y Judicial». Reescribí cada pregunta con su respuesta correcta en el índice 0, coherente con la pista. Los mundos 1–4, 6 y 7 están bien.
- `EXTRA_SOCIALES` (líneas ~505–736): desde el mundo 4 están corridos un mundo (el 4 «relieve» recibe ríos y lagos). Los 21–23 hablan de la Revolución de Mayo y 1816, pero esos mundos son fundación de ciudades, sociedad colonial y Potosí. Reasignalos según `worlds.ts`.

### 1.3 Opciones que delatan la respuesta
- **Actividades de ordenar** (Lengua y Naturales): los ítems empiezan con «1.», «2.», «3.»… y además todas usan la misma permutación. Sacá los números y usá `makeOrder` con un mezclado al azar distinto del orden correcto (hoy `makeOrder` en `util.ts:125` mezcla siempre igual: corregilo).
- **Emojis ✅/❌ en las opciones** (lengua.ts 284, 291, 346, 356, 407, 408, 423, 491, 509, 600, 623): marcan la correcta (o la invierten en «marcá la opción con error»). Usá emojis neutros.
- **Distractores absurdos**: casi todas las preguntas de Naturales y muchas de Lengua tienen opciones de chiste («los guanacos comen todos los troncos», «consume nafta especial», «la letra N se cansa», «robots de computación»…). Reemplazalos por **errores que un chico de 9 años podría cometer de verdad** (confusiones con el concepto vecino), con largo parecido al de la correcta.
- Etiquetas que traen la respuesta (naturales n6/n7: «Mutualismo: …», «Calafate nativo», «Rosa mosqueta europea»).

### 1.4 Matemática: opciones repetidas y preguntas con dos respuestas
Medido con 3.000 vueltas por mundo:
- 42005 (romanos, ~línea 282): `rom.replace("X","V")` deja igual CL, CC, CDL, DCC, CM, MCML → **la correcta aparece dos veces** en todas las vueltas; los otros distractores no son romanos válidos («VIV», «LVIIII»). Usá números válidos cercanos (±1, ±10) pasados por un `toRoman`.
- 42003 (~162–198): dígitos iguales → opciones repetidas, y «¿valor posicional de la cifra 5?» con dos cincos tiene dos respuestas. Forzá cifras distintas.
- 42001 (~74–78), 42002 (~107), 42013 (~578), 42006 (~323): opciones duplicadas cuando coinciden cifras o cantidades. Deduplicá y regenerá.
- 42016 (~678): cuando da exacto aparece «6/3 de alfajor». 42020 (~792): «5/4 del mural» imposible. 42009 (~436): «sumale a × 0».
- «1 centenas», «1 decenas de mil», «1 unidades de mil» (42001 :82, 42002 :113, 42003 :198): singular cuando la cifra es 1.

### 1.5 Bancos que se repiten dentro de una vuelta
42019 muestra **el mismo ítem 8 veces**; 42024, 42026 y 42027 repiten una pregunta fija 7 veces; 42015, 42017, 42018 tienen 6 ítems para 8 lugares y 42025 tiene 9. Cada mundo necesita variedad real (generador o banco de 15+).

## 2. Errores de contenido

**Lengua**
- 244: la pregunta del monólogo tiene las opciones de la 243 (ninguna correcta). Opciones: «Monólogo», «Aparte», «Diálogo».
- 291: dos opciones correctas (la 3 también tiene sangría, mayúscula y punto).
- Mundo 6 (120–138): **personas inventadas presentadas como reales** («María Auxiliadora Martínez», «Rosa Kopolke», «Elba Ojeda», «Fernando Peláez», «Asunción Carballo»). Usá personas documentadas o aclarás que el texto es de ficción. Además: Grete Mostny trabajó en Chile (no en Santa Cruz); Sara Braun era empresaria en Punta Arenas, no enfermera; el hidroavión de Plüschow era el *Tsingtau* («Cóndor de Plata» es su libro/película); Lago Frías está en Río Negro y Parques Nacionales es de 1934; verificá Moreno 1877 y Casimiro 1869.
- 95 cita un «texto sobre el bosque andino» que no existe; 81, 70 («paraestextual» → paratextual), 509 («verbo subrayado» sin subrayado), 490, 711 («viajé» vs «viajaba» no se ordenan), 730, 707 («estudian (ustedes)» no es 2.ª persona gramatical), 183/374/380 (la respuesta repite la pregunta), 658 (puntuación de la carta).
- Ortografía: 287 (emoji «쉼» → ✏️), 397 y 616 «guión» → «guion», 585 «ca-fay-á», 599 «la dígrafa» → «el dígrafo», 150 «salidas de emergencia», 179, 413, 422, 292 (raya de cierre), 45 «Mar Argentino», 49 «tonina overa».

**Ciencias Sociales**
- 154: el huemul está en el escudo de **Chile**, no de Argentina (es Monumento Natural Nacional).
- 92: el lago que en Chile se llama O'Higgins es el **San Martín**, no el Argentino.
- 91: al revés: el glaciar Viedma alimenta al lago.
- 56 (material de El Gorosito), 77 (Cerro Ventana: verificá), 120 («menos de 200 a 300 mm»), 43 (población: usá el censo 2022), 488 («diputados por municipio»), «Guer Aike» → «Güer Aike» (516–521), 117 (la respuesta repite la pregunta).

**Ciencias Naturales**
- Fases lunares (688–690): en el hemisferio sur el cuarto creciente se ve como una **C** y el menguante como una **D**.
- 267: el puma no ruge (y el emoji es 🦁). 95/510: el notro lo poliniza el picaflor. 57: la flor del michay es amarillo-anaranjada. 534/536: las vértebras son huesos irregulares. 475: el huemul no es exclusivo de la Patagonia austral. 626–629: líquidos y gases mezclados en «menor velocidad» (contradice la 296). 29: dos respuestas (pato vapor). 125, 82 (base = fitoplancton), 222 (el petróleo es natural), 414 (escarcha), 186 (vitamina C), 160 (ácido láctico), 121 (jabalí omnívoro), 66/494, 53 (arrayán no está en Santa Cruz), 460 («Cordillera y bosque andino»).
- Vocabulario demasiado técnico para 9 años: anemócora/zoócora, mioglobina, intraespecífica, iones.
- Typos: 103 «el choique», 391 «Cráteres», 410 voseo, 107 «el águila mora».

**Matemática (realismo y temas)**
- 42003 :171: censos de 999.900 personas para Gobernador Gregores o Pico Truncado (toda la provincia tiene unos 340.000). 42028 :1123: Río Gallegos–Piedra Buena no es 1 hora. 42021 :819/:839: distractores «$12,150», «2,170 m».
- Temas que faltan aunque el mundo los nombra: 42028 superficie/capacidad/estadística; 42027 cuadriláteros; 42026 clasificación por ángulos; 42020 resta de fracciones; 42023 resta de decimales; 42022 ÷10/100 y ×1.000; 42021 milésimos; 42014 tablas de valores y múltiplos/divisores; 42009 repertorio; 42003 descomposición aditiva; 42005 comparación.

## 3. Comprobaciones nuevas en `scripts/test-grado4.ts` (obligatorio)
Con 500 vueltas por mundo, que falle si:
1. alguna actividad tiene **opciones repetidas** o una opción vacía/`NaN`/`undefined`;
2. algún ítem de ordenar empieza con un número de orden (`/^\d+[.)]/`) o el orden mezclado es igual al correcto;
3. alguna opción contiene ✅, ❌, ✔ o ✖;
4. una vuelta repite la misma consigna más de 2 veces;
5. en Naturales y Sociales, la consigna de cada pregunta comparte al menos una palabra clave con el **título o la descripción del mundo** en `worlds.ts` (lista de palabras por mundo en el test), para detectar bancos corridos;
6. en Sociales y Naturales, la opción correcta (índice 0 antes de mezclar) aparece en la pista o comparte palabras con ella (para detectar opciones corridas).

## 4. Entrega
- Trabajá en `antigravity`, sin tocar `publicado: false` ni archivos fuera de `src/lib/grade4/`, `scripts/test-grado4.ts` y tu resumen en `TAREAS.md`.
- Corré `npx tsc --noEmit`, `npx eslint src`, `npx tsx scripts/test-grado4.ts` y `npx tsx scripts/test-modulos.ts`.
- En el resumen, listá cada punto de este archivo con «hecho» y cómo lo comprobaste.
