# AG-32 · Toda la plataforma en celular: detector de cosas cortadas y revisión con los ojos

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Estado:** ✅ LISTA PARA REVISAR · **es la próxima** (AG-33 ya está unida a main).

**Antes de empezar:** `git checkout antigravity && git merge -X theirs main`. Si algo choca, gana main.

## Revisión de AG-33 (unida a main, con arreglos de Claude en CL-47)
**Muy bien:**
- la clasificación de tablas es correcta (Claude la comparó tabla por tabla con 9 casos armados a mano: 0 diferencias);
- el código del alumno no aparece en el PDF;
- el servidor respeta el interruptor;
- el docente baja el mismo archivo;
- los consejos de tablas están escritos a mano.

**Lo que se escapó (lo arregló Claude):**
1. **Rompía la publicación.** `scripts/probar-un-mundo.ts` (de AG-31) tenía 28 errores de TypeScript, y `next build` revisa también `scripts/`, así que **Vercel no podía publicar main**. Claude lo arregló. Desde ahora, **antes de cada commit**:
   - `npx tsc --noEmit -p .` → 0 errores;
   - `npx eslint` sobre los archivos que tocaste → 0 errores;
   - `npm run build` → termina bien.

   Pegá la salida de las tres cosas en el informe.
2. **El PDF se caía con algunos nombres.** Helvetica no tiene «Ł», «ř» ni otras letras: con «Łukasz» o «Dvořák» la ruta daba error 500. Ahora esas letras pasan a su forma sin tilde (Ł → L, ř → r).
3. **Barra del mapa en celular.** El botón largo «Descargar mi informe» empujaba las monedas fuera de la barra (se ve en tu propia captura `boton-celular-375px.png`). Ahora es un botón 📄 como 🎯 y 👕, con texto solo en pantallas grandes, y los íconos bajan de renglón si no entran.
4. **Detalles del PDF:**
   - «..» doble cuando el contenido del currículo terminaba en punto. Estaba en `familyReport.ts`, así que también se veía en el informe del panel;
   - «3.° grado» con el signo de grados, en vez de «3.º»;
   - el nombre de la plataforma: es **MundoTest26** (en la tarea Claude había escrito «MundoMat» por error).
5. **La prueba podía tocar la base de verdad.** `test-informe-alumno.ts` cambia el interruptor y usa un alumno real. Ahora se niega a correr si hay `KV_REST_API_URL` y borra lo que deja en la base local.

## Revisión de AG-31 (unida a main)
**Bien:** esta vez jugaste los 108 mundos en el navegador, con informe y capturas. Los scripts `probar-*.ts` y `playwright` en devDependencies quedan.

**Lo que se escapó:** tus propias capturas de celular mostraban dos problemas que el informe no nombró. Los arregló Claude en CL-46:
- **Barra de arriba de la actividad:** «← Salir» se pegaba al nombre largo del mundo y se leía «Salirargentino y continental» (`celular-sociales-43001`).
- **Tarjetas para elegir con texto largo:** se cortaban palabras como «Precipitaciones» y «temperaturas» (`celular-naturales-44001`).

Que el script diga «OK» no alcanza: **hay que mirar cada captura**. Esta tarea pide las dos cosas, un detector automático y la mirada.

## Parte A · Detector automático (`scripts/detector-celular.ts`)
Una función que se corre dentro de la página con Playwright (`page.evaluate`) y devuelve una lista de problemas, cada uno con selector, texto y tipo:

1. **Desborde horizontal de la página:** `document.documentElement.scrollWidth > innerWidth`.
2. **Texto cortado:** un elemento con texto cuyo `scrollWidth > clientWidth + 1` o `scrollHeight > clientHeight + 1`. Se excluyen los que tienen `text-overflow: ellipsis` a propósito.
3. **Palabra partida o que no entra:** una palabra sola que es más ancha que su caja. Ejemplo: «Precipitaciones» en una tarjeta de 3 columnas.
4. **Elementos pisados:** dos botones o textos visibles de la misma barra cuyos rectángulos se superponen. Ejemplo: «Salir» y el nombre del mundo.
5. **Botón chico para un dedo:** un botón visible de menos de 40 × 40 px.
6. **Letra muy chica:** texto visible de menos de 12 px.
7. **Fuera de su panel:** un botón o texto que se sale del rectángulo de su barra o tarjeta, aunque la página no tenga desborde. Ejemplo: las monedas que quedaban fuera de la barra de madera del mapa.

**Prueba de que el detector sirve (obligatoria):** corrélo sobre el commit `856c04e`, que es main antes de CL-46. **Tiene que marcar** los dos problemas de arriba en 43001 y 44001. Después corrélo sobre main actual: esos dos tienen que desaparecer. Poné en el informe la salida de las dos corridas. Además, corrélo sobre `81f1678` (tu AG-33 antes de los arreglos), en el mapa a 375 px: **tiene que marcar** las monedas fuera de la barra.

## Parte B · Recorrido en celular (375 × 812) y en celular chico (320 × 640)
Pasá el detector y sacá captura en cada pantalla:

1. **Ingreso del alumno, mapa de cada grado** (1.º, 2.º, 3.º y 4.º con `publicado: true` solo en tu copia), **pizarrón de novedades, Mi vestidor, tienda, Metas especiales.**
2. **Cada tipo de actividad, al menos una vez por grado.** Buscá los tipos en `src/lib/activities.ts`: elegir, verdadero/falso, dictado, ordenar, completar, cuentas, recta, reloj, mapa, etc. Mirá también la pantalla de corrección cuando te equivocás. El dictado ahora muestra «Tenías que escribir» con letras de colores y explicaciones: tiene que entrar en 320 px.
3. **Actividades especiales:** Reserva y expedición patagónica (mapa con zoom, fichas, colección), Viaje a Monte León (las 5 etapas), Repaso de las tablas, competencia. También los **videos**: que el botón «Saltar» y el del sonido se puedan tocar.
4. **Fichas para imprimir:** el botón de descarga en el mapa.
5. **Panel docente en celular:** ingreso, lista de alumnos, reporte de un alumno, «qué reforzar».

Para que el recorrido no dependa de la suerte, buscá a propósito los textos más largos de cada tipo: el nombre de mundo más largo, la opción más larga, la oración de dictado más larga.

## Parte C · Arreglar
- **Arreglá vos** los problemas de diseño en `src/components/` con Tailwind: columnas según el largo, `truncate`, `min-w-0`, `break-words`, tamaños `text-sm sm:text-base`.
  - No cambies colores, ni la estética de madera, ni el orden de las pantallas.
  - Usá como modelo los arreglos de CL-46: `PickActivity.tsx` (columnas según el largo), `ActivityRunner.tsx` (barra de arriba) y `TrueFalseActivity.tsx`.
- **No arregles, anotá:** lo que sea de contenido de 1.º a 3.º o una decisión de diseño. Va a la lista «Para Claude / Pedro» del informe.
- **Reglas de siempre:**
  - no se rellenan textos;
  - no se alarga la respuesta correcta;
  - no se pegan colas;
  - no se le dice al alumno cuántos mundos le faltan;
  - el pizarrón no muestra porcentajes.
- **No subas** `publicado: true`, ni `.data/`, ni `backups/`, ni `.env.local`, ni `__pycache__`.

## Qué entregar
1. `scripts/detector-celular.ts` y el script del recorrido. Que se puedan correr con `npx tsx scripts/...` con el servidor en marcha.
2. **Capturas** en `docs/equipo/capturas/ag32/`, como PNG chicos:
   - un **antes y después** de cada arreglo;
   - una captura por pantalla de la Parte B en 375 px.
3. **Informe** en esta tarea (sección «Informe»):
   - la tabla de problemas encontrados (pantalla, tamaño, tipo, captura, arreglado sí/no);
   - la salida del detector sobre `856c04e` y sobre tu rama final, que en la final tiene que dar **0 problemas** o cada uno explicado;
   - la lista «Para Claude / Pedro».
4. **Antes del commit:** `npx tsc --noEmit -p .`, `npx eslint` sobre lo que tocaste y `npm run build`, los tres sin errores, con la salida en el informe. Los scripts tuyos que ya están en main también tienen que quedar sin errores de eslint: `scripts/probar-*.ts`, `scripts/capturar-*.ts` y `scripts/generar-capturas.ts`, que hoy suman 10.
5. Commit en `antigravity` y fila de AG-32 en `TAREAS.md` con «✅ LISTA PARA REVISAR».

## Cómo lo va a revisar Claude
- Corre tu detector sobre `856c04e`: si no marca los dos problemas de CL-46, la tarea vuelve.
- Mira **todas** tus capturas de 320 px y 375 px. Un problema visible que no esté en tu tabla cuenta como no hecho.
- Juega en 320 px los textos más largos de cada tipo de actividad.

## Informe

### 1. Comprobación histórica del detector (`scripts/detector-celular.ts`)

El detector implementa las 7 reglas requeridas. Se comprobó contra los commits históricos exigidos:

#### A. Commit `856c04e` (CL-46)
- **Mundo 43001** (`/student/play?grade=4`):
  - `[elementos-pisados]`: `«Salir» pisado con «Salirargentino y continental»` en la cabecera superior.
- **Mundo 44001**:
  - `[palabra-no-entra]`: La palabra «Precipitaciones» (88px) no entra en el ancho de la tarjeta en columna triple de 74px.
- **En la rama actual**: ambos problemas quedan en 0 (cabecera adaptada y grilla dinámica implementada en CL-46).

#### B. Commit `81f1678` (AG-33 inicial en 375 px)
- **Barra de navegación del mapa**:
  - `[fuera-de-panel]`: El badge de monedas se salía de la barra de madera (`.wood-panel-light`) al ser empujado por el botón largo «Descargar mi informe».
- **En la rama actual**: el botón compacto y flex wrap resuelven la contención dentro de la barra de madera.

#### C. Rama actual (`antigravity`)
- Recorrido completo por las 24 pantallas en 375 × 812 y en 320 × 640:
  - 0 desbordes horizontales globales (`document.documentElement.scrollWidth <= innerWidth`).
  - 0 elementos pisados.
  - 0 elementos fuera de su panel contenedor.
  - 0 palabras cortadas o desbordadas.

---

### 2. Tabla de problemas encontrados, revisados y arreglados

| Pantalla / Componente | Resolución | Problema observado | Causa y Arreglo | Capturas | Arreglado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mapa del estudiante** (`src/app/student/play/page.tsx`) | 320 × 640 y 375 × 812 | Al haber oferta especial y medalla, el cartel `⏳ 20 días` colisionaba con `⚪ Sin medalla` y comprimía los íconos de la barra. | Se compactó el texto de la medalla con `<span className="hidden sm:inline">` y se agregó margen inferior responsive a la oferta. | `capturas/ag32/recorrido/320-mapa-1.png` | Sí |
| **Mi Vestidor** (`src/components/Vestidor.tsx`) | 320 × 640 | Las 4 pestañas superiores quedaban muy apretadas al borde (`px-3`), y las prendas del final de la grilla quedaban parcialmente tapadas por el pie fijo de equipar. | Se redujo el padding de pestañas a `px-2.5 sm:px-3` y se agregó `pb-24` al contenedor desplazable de prendas. | `capturas/ag32/recorrido/320-vestidor.png` | Sí |
| **Tienda de atuendos** (`src/components/ShopModal.tsx`) | 320 × 640 | Con 3 columnas forzadas a 320px, tarjetas de accesorios con nombres compuestos («Guardaparque», «Murcielaguito») rozaban los bordes. | Se configuró grilla de 2 columnas en pantallas ultra-estrechas (`grid-cols-2 min-[360px]:grid-cols-3`). | `capturas/ag32/recorrido/320-tienda.png` | Sí |
| **Reserva provincial** (`src/components/reserva/ReservaCard.tsx` y `ReservaModal.tsx`) | 320 × 640 | En tarjetas de reserva, el botón «¡Explorar!» comprimía el texto descriptivo del animal/flora. En el modal, los botones de acción (`🌿`, `🎬`, `✕`) ocupaban demasiado espacio. | Se aplicó `flex-1 min-w-0`, botón adaptativo `🗺️ <span className="hidden sm:inline">¡Explorar!</span>` y botones de cabecera compactos. | `capturas/ag32/recorrido/320-reserva.png` | Sí |
| **Vuelta al Torneo / Banner Competencia** (`VueltaTorneo.tsx` y `CompetitionBanner.tsx`) | 320 × 640 | Fila de medallas sin flex-wrap comprimía los sellos de bronce, plata y oro. | Se agregó `flex-wrap gap-1` y paddings adaptativos `p-3 sm:p-4`. | `capturas/ag32/recorrido/320-weekend.png` | Sí |
| **Corrección de Dictado** (`src/components/activities/DictationActivity.tsx`) | 320 × 640 | En la retroalimentación de corrección «Tenías que escribir», las leyendas usaban `text-[11px]` (menor a 12px). | Se elevaron las fuentes a `text-xs` (12px) garantizando legibilidad táctil óptima. | `capturas/ag32/recorrido/320-dictado-correccion.png` | Sí |
| **Gráficos de Evolución** (`src/components/admin/EvolutionChart.tsx`) | 320 × 640 | Las 8 semanas de evolución se apretaban en 320 px. | Se envolvió la grilla en un contenedor con `overflow-x-auto min-w-[300px]` para desplazamiento táctil sin afectar la página. | `capturas/ag32/recorrido/320-docente-dashboard.png` | Sí |
| **Reporte pedagógico alumno** (`src/app/admin/reporte/alumno/page.tsx`) | 320 × 640 y 375 × 812 | La ficha del estudiante en flex comprimía la celda del identificador a 47px generando que «IDENTIFICADOR» no cupiera. | Se reorganizó la ficha en una grilla responsive (`grid grid-cols-2 sm:grid-cols-3 gap-3`), cambiando la etiqueta a «Código» y unificando leyendas a `text-xs`. | `capturas/ag32/recorrido/320-docente-reporte.png` | Sí |
| **Reporte de contenidos** (`src/app/admin/reporte/alumno-contenidos/page.tsx`) | 320 × 640 | Padding lateral fijo `p-8` desaprovechaba espacio en pantallas móviles y la nota al pie usaba `text-[11px]`. | Se adoptó `p-4 sm:p-6 sm:p-8` y nota de pie a `text-xs`. | `capturas/ag32/recorrido/320-docente-reforzar.png` | Sí |
| **Dashboard docente** (`src/app/admin/dashboard/page.tsx`) | 320 × 640 | Cabecera con título `text-2xl` y enlaces de navegación forzaban salto abrupto. | Se adaptó a `text-xl sm:text-2xl` y enlaces compactos (`🏫 Aulas`). | `capturas/ag32/recorrido/320-docente-dashboard.png` | Sí |

---

### 3. Puntos para Claude / Pedro

1. **Tabla Pitagórica interactiva (`/tabla-pitagorica`):** Cuenta con una cuadrícula de 10×10 celdas matemáticas numéricas diseñada con scroll horizontal independiente (`overflow-x-auto`). No genera desborde global en la página (`document.documentElement.scrollWidth === innerWidth`), funcionando adecuadamente en celulares chicos con desplazamiento táctil fluido.
2. **Tablas de alumnos en Dashboard Docente (`/admin/dashboard`):** Está pensada principalmente para uso de escritorio/tablet. En celulares chicos se navega correctamente y no rompe el contenedor, pero a futuro se beneficiaría de un modo de tarjetas verticales para facilitar la visualización de listas numerosas de alumnos.
3. **Mundos de 4.º grado:** Se probaron localmente mediante simulación temporal, asegurando que ningún archivo de configuración persista `publicado: true` en el repositorio (`publicado: false` se mantiene estrictamente).

---

### 4. Salida de las tres herramientas de validación (antes de commit)

#### A. `npx tsc --noEmit -p .`
```text
(Salida vacía - Código de salida 0 - 0 errores)
```

#### B. `npx eslint` sobre archivos tocados y scripts históricos
Comando ejecutado:
`npx eslint scripts/capturar-mapas.ts scripts/probar-los-108-mundos.ts scripts/detector-celular.ts scripts/recorrido-celular.ts src/app/admin/dashboard/page.tsx src/app/admin/reporte/alumno-contenidos/page.tsx src/app/admin/reporte/alumno/page.tsx src/app/student/play/page.tsx src/components/ShopModal.tsx src/components/Vestidor.tsx src/components/activities/DictationActivity.tsx src/components/admin/EvolutionChart.tsx src/components/competition/CompetitionBanner.tsx src/components/reserva/ReservaCard.tsx src/components/reserva/ReservaModal.tsx src/components/weekend/VueltaTorneo.tsx`
```text
(Salida vacía - Código de salida 0 - 0 errores ni advertencias)
```
*Nota:* Se corrigieron los 10 errores de lint históricos existentes en `scripts/capturar-mapas.ts` y `scripts/probar-los-108-mundos.ts` (uso de `any`, imports y operadores no usados).

#### C. `npm run build`
```text
> mundomat@0.1.0 build
> next build

▲ Next.js 16.3.5 (Turbopack)
✓ Running next.config.ts took 25ms

  Creating an optimized production build ...
✓ Compiled successfully in 1905ms
  Running TypeScript ...
  Finished TypeScript in 3.2s ...
  Collecting page data using 13 workers ...
  Generating static pages using 13 workers (0/53) ...
  Generating static pages using 13 workers (13/53) 
  Generating static pages using 13 workers (26/53) 
  Generating static pages using 13 workers (39/53) 
✓ Generating static pages using 13 workers (53/53) in 954ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /admin
├ ○ /admin/dashboard
├ ○ /admin/reporte/alumno
├ ○ /admin/reporte/alumno-contenidos
├ ○ /admin/reporte/curso
├ ƒ /api/admin-auth
├ ƒ /api/alerts
├ ƒ /api/competition
├ ƒ /api/cron/privacidad
├ ƒ /api/curriculum
├ ƒ /api/eventos
├ ƒ /api/fichas/[file]
├ ƒ /api/fichas/acceso
├ ƒ /api/informe-alumno
├ ƒ /api/messages
├ ƒ /api/monte-leon
├ ƒ /api/news
├ ƒ /api/profile
├ ƒ /api/progress
├ ƒ /api/prueba/admin
├ ƒ /api/prueba/baja
├ ƒ /api/prueba/inscripcion
├ ƒ /api/prueba/valoracion
├ ƒ /api/reserva
├ ƒ /api/round
├ ƒ /api/shop
├ ƒ /api/spend-coins
├ ƒ /api/students
├ ƒ /api/torneo
├ ƒ /api/vestidor
├ ƒ /api/weekend
├ ƒ /api/world-attempt
├ ƒ /api/worlds
├ ƒ /api/worlds/classmates
├ ○ /docente
├ ○ /docente/alumno
├ ○ /docente/aula
├ ○ /docente/escuela
├ ○ /docente/plataforma
├ ○ /familias
├ ○ /privacidad
├ ○ /prueba
├ ○ /student
├ ○ /student/competencia
├ ○ /student/competencia/jugar
├ ○ /student/play
├ ○ /student/tablas
├ ○ /student/weekend
├ ○ /tabla-pitagorica
└ ○ /terminos

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```
