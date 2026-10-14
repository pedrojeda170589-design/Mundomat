# AG-33 · «Descargar mi informe»: cada alumno baja su propio informe en PDF, con sus tablas

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Estado:** 🔴 PENDIENTE · **Prioridad:** la pidió Pedro. Hacela **antes que AG-32**. Si ya empezaste AG-32, hacé un commit de lo que tengas y seguí con esta.

**Antes de empezar:** `git checkout antigravity && git merge -X theirs main`. Si algo choca, gana main.

## Qué pidió Pedro
> «Necesito que el informe del desempeño de cada alumno pueda ser descargado por el alumno una vez que ingresa a la plataforma. Solo su informe, y que en el mismo figuren las tablas que maneja con mayor facilidad, cuáles no.»

Decisiones de Pedro:
1. **Formato:** un **archivo PDF** que se descarga con un botón y sirve igual en celular y computadora (guardar, imprimir, mandar por WhatsApp). Nada de «Imprimir → Guardar como PDF».
2. **Contenido:** el **informe para familias que ya existe** (`src/lib/familyReport.ts`, el que se ve en `src/app/admin/reporte/alumno/page.tsx`) **más una sección nueva de tablas**.
3. **Permiso:** un **interruptor en el panel docente**, como los videos o la Reserva. Viene **apagado**, y el docente lo prende cuando quiere, por ejemplo al cerrar el trimestre.

## Parte A · Las tablas: cuáles le salen y cuáles no (`src/lib/informeAlumno/tablas.ts`)
Una función pura, `tablasDelAlumno(progress)`, que clasifica las tablas del 2 al 10 (`TABLAS_DE_LA_VUELTA`) en cuatro grupos.

- **Con qué datos:** los mismos que ya usa el repaso diario.
  - `progress.tablasStats` (últimas partidas de cada tabla).
  - Si una tabla no tiene partidas guardadas, `progress.tablasTorneo` (mejor tiempo de cada fin de semana).
  - Reusá `medir` y la lógica de `src/lib/torneo/prioridades.ts`: exportala si hace falta, **no la copies**. Las metas de tiempo están en `src/lib/torneo/tiempos.ts`, con la penalidad de 2 s por error.

| Grupo | Regla | Texto en el informe |
|---|---|---|
| **La maneja con facilidad** | menos de 0,5 errores por partida **y** tiempo sin penalidad ≤ meta de oro | «Tabla del 6: sin errores y en 24 s (meta de oro: 35 s)» |
| **Va en camino** | menos de 0,5 errores por partida, pero tarda más que el oro y no más que la plata | «Tabla del 7: sin errores, pero tarda 44 s» |
| **Le cuesta** | lo que `prioridadesTablas` marca como `errores`, o tarda más que la plata | «Tabla del 8: 2 errores por partida» o «tarda 70 s» |
| **Todavía no la practicó** | sin datos | «Tabla del 9: todavía no la jugó» |

- Con **menos de 2 partidas** de una tabla, no se la pone en «con facilidad»: va a «va en camino» con la aclaración «(pocas partidas)». Un solo buen día no alcanza.
- Para cada tabla que le cuesta, sumá un **consejo concreto** para la casa. Ejemplos:
  - «Repasar en voz alta la tabla del 8 salteada: 8×7, 8×3, 8×9…».
  - «Para la del 9: los dedos de las manos».
  - «Para la del 5: contar de 5 en 5 con el reloj».

  Escribilos **a mano**, uno por tabla (2 a 10), en `src/lib/informeAlumno/consejosTablas.ts`. Nada de un texto genérico con el número cambiado.

## Parte B · El informe en PDF (`src/lib/informeAlumno/pdf.ts`)
1. **Separá datos de dibujo:**
   - `armarInformeAlumno(student, progress, curriculum, periodo)` devuelve un objeto con todo el texto ya armado. Usa `computeFamilyReportData` sin cambiar lo que devuelve, más `tablasDelAlumno`.
   - `pdfDelInforme(informe)` lo dibuja y devuelve los bytes.
   - Así las pruebas miran el objeto y no tienen que leer el PDF.
2. **Biblioteca:** `pdf-lib` + `@pdf-lib/fontkit`. Las dos son MIT, puro JavaScript y andan en Vercel sin navegador.
   - **No uses** Playwright ni Chromium para esto: no hay Chromium en Vercel.
   - Para los títulos, embebé la letra Fredoka que ya está en el repo (`scripts/videos/Fredoka.ttf`, licencia OFL). Copiala a `private/fuentes/` o donde la pueda leer la ruta del servidor.
   - Los acentos, la ñ, ¿ y ¡ tienen que verse bien.
   - **Los emojis no salen en el PDF:** usá palabras o dibujitos hechos con formas (círculos, estrellas).
3. **Hoja A4, 1 o 2 páginas, en este orden:**
   1. **Encabezado:** «Mi informe de MundoMat», nombre del alumno, grado, período y fecha.
   2. **«Lo que logré»:** mundos superados, tiempo de práctica y el mensaje de aciertos del informe de familias.
   3. **«Lo que mejor me sale»:** las fortalezas del informe de familias.
   4. **«Mis tablas»:** los cuatro grupos de la Parte A, con una grilla del 2 al 10 en colores: verde = con facilidad, amarillo = en camino, rojo suave = le cuesta, gris = sin practicar. Debajo, los consejos.
      - Solo se muestra para los grados que tienen el repaso de las tablas (`DESAFIOS.repasoTablas`, hoy 3.º y 4.º) **o** si el alumno tiene datos de tablas.
   5. **«Para seguir creciendo»:** las recomendaciones para la casa.
   6. **«Cómo fue mi semana»:** la evolución semanal como barritas dibujadas.
   7. **Pie:** «Informe generado por MundoMat · Escuela …», si hay escuela en los datos.
4. **Lo que NO va en el PDF**, porque el archivo puede terminar en un grupo de WhatsApp:
   - **el código del alumno** (es su contraseña: el informe del panel lo muestra, este no);
   - datos de otros alumnos o comparaciones con el curso;
   - notas del docente o del legajo;
   - **cuántos mundos le faltan** (regla de siempre: no se le dice al alumno).

## Parte C · Descarga segura: solo su informe (`src/app/api/informe-alumno/route.ts`)
- `GET /api/informe-alumno?code=…&periodo=mes|trimestre|ano` devuelve `application/pdf` con `Content-Disposition: attachment; filename="informe-<nombre-sin-tildes>-<AAAA-MM-DD>.pdf"`.
- **Mismo cuidado que `/api/progress`:** `checkCodeRateLimit`, `recordFailedCodeAttempt` y `recordSuccessfulCodeAttempt`.
  - Con un código que no existe → 404 y cuenta como intento fallido.
  - Con la prueba vencida (`isTrialExpired`) → 403.
- **El servidor controla el interruptor:** si está apagado para el grado del alumno → 403 «Tu docente todavía no habilitó el informe». No alcanza con esconder el botón.
- La ruta **solo arma el informe del código que recibe.** No hay parámetro para pedir el de otro, ni listas, ni nada del panel.
- `Cache-Control: no-store`.

## Parte D · Interruptor y botón
1. **Interruptor:** en `src/lib/eventos/config.ts` sumá `informeAlumno: { id: "informe-alumno", grados: [1, 2, 3, 4, 5, 6, 7] }` a `DESAFIOS`, con regla automática **apagada** (`() => false`).
   - En `src/lib/eventos/catalogo.ts`, una fila como la de los videos: emoji 📄, nombre «Mi informe en PDF (el alumno descarga su propio informe, con sus tablas)», auto «Apagado: lo prende el docente».
   - Fijate cómo se prenden los videos desde el panel y hacé igual.
2. **Botón para el alumno:** en la pantalla del mapa (`src/app/student/play/page.tsx`), cerca del saludo o de «Metas especiales», un botón **«📄 Descargar mi informe»**. Se ve solo si el interruptor está prendido para su grado.
   - Al tocarlo se abre un cartelito chico para elegir el período: «Último mes», «Último trimestre» o «Todo el año», con «Último mes» marcado.
   - Mientras se arma el PDF, «Preparando tu informe…».
   - La descarga se hace con `fetch` + `Blob` + un enlace con `download`, para que en celular baje el archivo y no abra una pestaña en blanco.
   - Si hay error (403, sin conexión), un mensaje claro y amable.
3. **Botón para el docente:** en `src/app/admin/reporte/alumno/page.tsx`, «Descargar PDF», que baja **el mismo PDF** con el período elegido ahí. Usá una ruta del panel con `x-admin-password` o reusá la función. Que el docente vea exactamente lo que baja el alumno.

## Parte E · Pruebas y capturas
1. **`scripts/test-informe-alumno.ts`**, con casos a mano:
   - **Clasificación:** sin errores y rápido → con facilidad; sin errores y lento → en camino; con 2 errores por partida → le cuesta; sin datos → todavía no; 1 sola partida perfecta → en camino (pocas partidas); solo datos viejos de `tablasTorneo` → se usan.
   - **`armarInformeAlumno`:**
     - el objeto **no contiene el código del alumno en ningún texto** (recorré todos los strings);
     - no contiene nombres de otros alumnos;
     - no dice cuántos mundos faltan;
     - un alumno de 1.º sin datos de tablas no tiene la sección «Mis tablas».
   - **`pdfDelInforme`:** los bytes empiezan con `%PDF`, tienen 1 o 2 páginas (cargalo con `PDFDocument.load`) y un alumno con nombre con tildes y ñ («Ñaupa Gómez») no rompe.
   - **Ruta**, con el servidor en marcha:
     - interruptor apagado → 403;
     - prendido → 200 y `application/pdf`;
     - código inventado → 404;
     - más de `MAX_FAILED_ATTEMPTS` (hoy 20, en `src/lib/rateLimit.ts`) códigos inventados seguidos → 429.
2. **Capturas** en `docs/equipo/capturas/ag33/`:
   - el botón y el cartelito en celular (375 px) y en computadora;
   - **las páginas del PDF pasadas a PNG** (`pdftoppm -png -r 60`) para 3 alumnos de prueba: uno de 3.º con tablas variadas, uno de 1.º y uno recién creado sin actividad;
   - el interruptor en el panel.
3. **Datos de prueba:** creá alumnos de prueba en tu `.data/db.json` local. **Hacé copia antes y restaurala al final.** Nunca subas `.data/`.

## Reglas de siempre
- No subas `publicado: true` de 4.º, ni `.data/`, ni `backups/`, ni `.env.local`, ni `__pycache__`.
- Los textos del informe están en español rioplatense y con «vos» («Lo que mejor te sale» si le habla al alumno, «le sale» en las partes para la familia). Elegí uno por sección y mantenelo.
- Las pruebas no se acomodan para pasar: si una falla, se arregla el código, no la prueba.

## Qué entregar
1. El código de las partes A a D, `scripts/test-informe-alumno.ts` y las capturas.
2. Las dependencias nuevas, `pdf-lib` y `@pdf-lib/fontkit`, en `dependencies` (no en dev, porque las usa la ruta del servidor), con `package-lock.json` actualizado.
3. El informe en esta tarea (sección «Informe»):
   - qué hiciste;
   - la salida de las pruebas;
   - las rutas de las capturas;
   - todo lo que no pudiste hacer.
4. Commit en `antigravity` y fila de AG-33 en `TAREAS.md` con «✅ LISTA PARA REVISAR».

## Cómo lo va a revisar Claude
- **Seguridad:**
  - baja el PDF con el código de un alumno y busca su código dentro del PDF;
  - prueba la ruta con el interruptor apagado, con un código ajeno inventado y muchas veces seguidas.
- **Tablas:** arma a mano un alumno con partidas conocidas y compara la clasificación tabla por tabla.
- **Imagen:** mira todas las páginas PNG. Nada cortado, acentos bien, sin cuadraditos donde iba un emoji.
- **Celular:** baja el PDF desde 375 px y revisa que se descargue un archivo con el nombre correcto.

## Informe
_(lo completa Antigravity)_
