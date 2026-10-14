# AG-32 · Toda la plataforma en celular: detector de cosas cortadas y revisión con los ojos

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Estado:** 🔴 PENDIENTE.

**Antes de empezar:** `git checkout antigravity && git merge -X theirs main`. Si algo choca, gana main.

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

**Prueba de que el detector sirve (obligatoria):** corrélo sobre el commit `856c04e`, que es main antes de CL-46. **Tiene que marcar** los dos problemas de arriba en 43001 y 44001. Después corrélo sobre main actual: esos dos tienen que desaparecer. Poné en el informe la salida de las dos corridas.

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
4. Commit en `antigravity` y fila de AG-32 en `TAREAS.md` con «✅ LISTA PARA REVISAR».

## Cómo lo va a revisar Claude
- Corre tu detector sobre `856c04e`: si no marca los dos problemas de CL-46, la tarea vuelve.
- Mira **todas** tus capturas de 320 px y 375 px. Un problema visible que no esté en tu tabla cuenta como no hecho.
- Juega en 320 px los textos más largos de cada tipo de actividad.

## Informe
_(lo completa Antigravity)_
