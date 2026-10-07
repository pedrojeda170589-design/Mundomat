# AG-19 · Mundo especial «Viaje a Monte León» (3.º grado, hasta el 28/10/2026)

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Urgente:** el viaje es el **miércoles 28/10/2026**. Tiene que estar en `main` como mucho el **15/10**.

Pedido de Pedro: un mundo especial para 3.º grado que repase la información del viaje de estudio al **Parque Nacional Monte León**, con dictado de palabras del viaje, una **mochila de viaje** que se llena jugando, **avatares superespeciales** y, el **27/10 a la noche**, un mensaje de buen viaje y una **medalla** para todos los que participaron.

Las **imágenes ya están hechas** (las hizo Claude en ChatGPT). Las rutas y los ids están en `src/lib/monteLeon/arte.ts` y en `docs/equipo/IMAGENES.md`. No dibujes ni generes imágenes: si falta alguna, anotalo en tu resumen y Claude la hace.

## 1. Cuándo y para quién
- Solo alumnos de **3.º grado** (aula piloto y aulas de 3.º de la plataforma; **no** el aula abierta de prueba).
- Visible desde que se publica hasta el **27/10/2026 a las 23:59** (hora argentina). El 28/10 ya no aparece (están de viaje); la medalla y los objetos quedan para siempre.
- Aparece como un **mundo especial** arriba del mapa (como los cuentos o el dictado): tarjeta con la isla `public/theme/monte-leon/isla.png`, el título «🐧 Viaje a Monte León» y la cuenta regresiva («¡Faltan N días para el viaje!»).
- Reglas de tiempo en un archivo puro `src/lib/monteLeon/fechas.ts` con `now` inyectable y tests (bordes: 27/10 23:59 AR visible; 28/10 00:00 AR no visible; 27/10 desde las 20:00 AR mensaje de buen viaje).

## 2. Contenido (todo sale del Google Doc de Pedro, clases 2, 3 y 4)
Hacé `src/lib/monteLeon/contenido.ts` con bancos de preguntas (15+ por etapa, opciones plausibles, sin opciones de chiste, sin ✅/❌, sin números de orden) y armá **5 etapas** (cada etapa es una vuelta de 8 actividades como los demás mundos; se puede repetir):

1. **El viaje** (clase 2): Gobernador Gregores → Comandante Luis Piedrabuena por la **Ruta Provincial 27** (unos 200 km), después hacia el sur por la **Ruta Nacional 3** (unos 35 km) hasta la entrada del parque; unos **240 km** (corregido el 7/10: antes decía RP 25 y 380 km, pero la RP 25 va a San Julián); unas **3 o 4 horas** en micro escolar; viajamos hacia el **sureste** hasta Piedrabuena y después hacia el **sur**; el paisaje cambia de la **meseta** (coirón, cañadones) a la **costa** (acantilados, playas de canto rodado, Mar Argentino). Actividad de ordenar el recorrido (Gregores → Piedrabuena → Monte León) y «¿cerca de dónde estamos?» (puente sobre el río = Piedrabuena, mata de coirón = meseta, acantilado con olas = Monte León).
2. **El parque** (clase 3): un **Parque Nacional** es territorio protegido por ley; Monte León es el **primer parque nacional costero-marino** de la Argentina, creado en **2004**, en Santa Cruz; su nombre viene de la **Cabeza del León**, una roca que el viento y el agua desgastaron hasta parecer un león acostado; aparece en el reverso del billete de $10 del Banco de la Patagonia.
3. **Los animales** (clase 3): más de **60.000 parejas de pingüinos de Magallanes** que llegan en primavera (septiembre-octubre), cavan su cueva en la tierra, ponen **dos huevos** y van al mar a buscar peces y calamares; **lobos marinos de un pelo**, **cormoranes**; en la estepa, **guanacos y choiques**. Clasificar animales «de la costa / de la estepa».
4. **Las normas y el guardaparque** (clase 4): el **guardaparque** cuida la flora y la fauna, mantiene los senderos y hace cumplir las leyes; normas: caminar solo por las **pasarelas y senderos**, **no alimentar** a los animales, **no llevarse** piedras, caracoles ni fósiles, **basura cero** (todo a la mochila), silencio y distancia con pingüinos y lobos marinos; regla de oro: «No dejar nada más que huellas, no llevarse nada más que fotos y recuerdos». Casos del Doc (el pichón, el envase que vuela, la piedra brillante) como preguntas de «¿qué hacemos?».
5. **Dictado del viaje**: usá el motor de dictado que ya existe (`src/lib/dictado/`), con voz, para estas palabras (podés sumar más del mismo campo): *pingüino, guardaparque, acantilado, meseta, ruta, viaje, mochila, colectivo, playa, lobo marino, cormorán, guanaco, choique, parque, costa, huevo, nido, cueva, sendero, pasarela, basura, protector, gorra, botella, Piedrabuena, Monte León.* Cuidá las palabras con dificultad ortográfica de 3.º (güi, mb/nv, ll/y, h, v/b) y que la consigna diga la palabra en una oración.

Las **escenas** (`public/theme/monte-leon/escenas/*.jpg`) van como imagen de apoyo de cada etapa (ver tabla en `IMAGENES.md`): `viaje-ruta` (etapa 1), `cabeza-del-leon` (etapa 2), `pinguinera`, `loberia` y `estepa` (etapa 3), `guardaparque` (etapa 4).

## 3. La mochila de viaje
- Imagen de la mochila vacía: `public/theme/monte-leon/mochila.png`. Pantalla «Mi mochila para Monte León» con 6 lugares.
- Se gana **un objeto por etapa superada con 80 % o más** (la etapa 5, el dictado, da la golosina; las otras, en este orden): botella de agua → anteojos de sol → gorra → protector solar → bocadillos → golosina. Ids en `MOCHILA_MONTE_LEON` (`src/lib/monteLeon/arte.ts`).
- **Regla definitiva (corrección de Claude, 7/10):** cada vuelta tiene 8 actividades y se supera con **7 u 8 bien**. Cada etapa da **su** objeto (1 botella, 2 anteojos, 3 gorra, 4 protector, 5 golosina) y los **bocadillos** se ganan con una **vuelta perfecta (8 de 8)** en cualquier etapa. El servidor recibe cuántas acertó (`correctas`), no un porcentaje. Constantes en `src/lib/monteLeon/progreso.ts` (`OBJETO_DE_ETAPA`, `ITEM_VUELTA_PERFECTA`, `MINIMO_PARA_SUPERAR`).
- Los objetos se guardan en `seasonalCollection` y se pueden poner en el avatar (anteojos y gorra se usan puestos; los demás son objetos de mano). Agregalos al catálogo de premios (`ACCESSORY_CATALOG_PREMIO`) filtrando por `IMAGENES_LISTAS`, igual que los premios del torneo.
- Con la mochila completa (6 objetos) se gana la **mascota** `pinguino-peluche-ml` (pingüino de peluche).
- Cuidado: estos objetos se pueden **regalar** a un compañero (regla general de CL-18). Si lo regalan, no se les vuelve a dar solo (usá `objetosRegalados`, como hace la temporada).

## 4. Avatares superespeciales
- `explorador-monte-leon`, `guardaparque-monte-leon`, `pinguino-monte-leon` (`AVATARES_MONTE_LEON`). Se desbloquean: el explorador al superar las etapas 1 y 2; la guardaparque al superar la 4; el pingüino con **todas** las etapas al 90 % o más (con 8 actividades: 8 de 8 en cada una). Van en `achievementCollection` (como los avatares de logro) y se eligen en «Mi perfil».

## 5. El 27/10 a la noche: buen viaje y medalla
- Desde el **27/10 a las 20:00** (AR) hasta el 28/10 a las 23:59, al entrar a la app los alumnos de 3.º ven un cartel con el profe (`<Profe pose="saluda" />`, o el traje `guardaparque` si existe la pose) que dice: «¡Mañana viajamos a Monte León! Que tengan un muy buen viaje: cuiden el parque, sigan al guardaparque y disfruten mucho de los pingüinos. ¡Buen viaje!» (Pedro puede cambiar el texto en una constante).
- A **todos los que participaron** (superaron al menos una etapa del mundo especial) se les da la **medalla** `medalla-monte-leon` (`MEDALLA_MONTE_LEON`, colgante). Que se entregue de forma automática al entrar a la app en esa ventana y también con un **script** para el docente (`scripts/monte-leon/entregar-medallas.ts`, con `--dry-run`) por si alguien no entra.
- En el panel docente: una línea «Viaje a Monte León: N alumnos participaron, M con la mochila completa».

## 6. Pruebas (obligatorio)
`scripts/test-monte-leon.ts`: fechas (bordes de arriba), que solo aparece en 3.º y nunca en el aula abierta, que cada etapa arma 8 actividades sin opciones repetidas ni ✅/❌, que la mochila da los objetos en orden y la mascota al completarla, que los avatares se desbloquean con sus reglas, que la medalla se da una sola vez y solo a quien participó, y que un objeto regalado no se vuelve a dar. Restaurá la base al final (copiá el patrón de `scripts/test-regalos.ts`).

## 7. Entrega
- `npx tsc --noEmit`, `npx eslint src`, `npx tsx scripts/test-monte-leon.ts` y los tests de siempre en verde.
- En tu resumen de `TAREAS.md`, cada punto con «hecho» y cómo lo probaste.
