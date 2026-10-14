# AG-31 · 4.º grado: prueba de verdad en el navegador (computadora y celular)

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Estado:** ✅ LISTA PARA REVISAR.

**Antes de empezar:** `git checkout antigravity && git merge -X theirs main`. Si algo choca, gana main.

## Revisión de AG-30 (unida a main)
**Muy bien.**
- **Lengua:** quedó sin distractores de chiste.
- **Matemática:** las pistas ya no regalan el resultado y no hay fracciones equivalentes como opciones.
- **Cuentas:** Claude recalculó 3.600 cuentas en 44.800 actividades generadas, sin ningún error.

**Lo que faltó:** el «repaso jugando» de la Parte C fue una simulación por código. Nadie miró 4.º en la pantalla, y eso es lo que pide esta tarea.

## Cómo ver 4.º en tu máquina
4.º está oculto (`publicado: false` en `src/lib/grades.ts`). Para probarlo:
1. Cambiá **solo en tu copia local** `publicado: false` → `true`. **No lo subas en el commit**: lo publica Pedro.
2. Corré `npm run dev`.
3. En el panel docente local, creá un alumno de prueba de 4.º. No uses alumnos reales.
4. Hacé una copia de `.data/db.json` antes de empezar y restaurala al final. **Nunca subas `.data/`.**

## Qué hay que hacer
Con el navegador, de verdad, en dos tamaños: **computadora** y **celular** (375 × 812).

1. **Mapa de cada materia:** las 4 materias de 4.º.
   - ¿Se ven las islas con su imagen?
   - ¿Se leen los nombres?
   - ¿Funciona el resaltado de «Por superar»?
2. **Una vuelta completa por mundo:** 108 mundos.
   - Mirá cada actividad: consigna completa, opciones que se pueden tocar, botón de pista, apoyos visuales de Matemática (cuadro de valores, recta, reloj, tablas).
   - Probá equivocarte a propósito en una actividad por mundo, para ver la corrección.
3. **Al terminar un mundo:**
   - pantalla de resultado;
   - monedas;
   - que el mundo quede superado en el mapa;
   - que el pizarrón de novedades no muestre porcentaje.
4. **Capturas:** guardá una por materia en computadora y una por materia en celular en `docs/equipo/capturas/ag31/`, como PNG chicos. Sumá una captura de cada problema que encuentres.

## Qué arreglar y qué no
- **Arreglá vos:** problemas de contenido (consignas, opciones, pistas) en `src/lib/grade4/content/`.
- **No toques:** pantallas ni componentes compartidos (`src/components`, `src/app`). Anotalos en la tabla con su captura y Claude los arregla.

## Entrega
En TAREAS.md, una tabla con una fila por problema:

| Mundo | Pantalla (compu o celu) | Qué pasa | Captura | ¿Arreglado o para Claude? |
|---|---|---|---|---|

Si un mundo no tuvo problemas, no hace falta fila; poné al final cuántos mundos jugaste de verdad.

Marcá AG-31 «✅ LISTA PARA REVISAR». En el commit **no** tiene que ir `publicado: true` ni `.data/`.

---

## Para terminar (revisión de Claude, 14/10/2026)
La tarea quedó a medias:
- no hay commit;
- no hay tabla en TAREAS.md;
- se jugó un solo mundo de los 108 (42001).

Las capturas de los cuatro mapas (computadora y celular) están bien y sirven. Falta:
1. **Jugar los 108 mundos.** Podés usar tu script `scripts/probar-los-108-mundos.ts` con el navegador de Playwright, pero el script tiene que:
   - abrir cada mundo en pantalla;
   - responder;
   - sacar una captura **cuando algo falla**: imagen rota, consigna cortada, opción que no se puede tocar o error en la consola.
2. **Celular:** al menos un mundo por materia jugado entero en 375 × 812.
3. **La tabla de problemas en TAREAS.md** (aunque tenga pocas filas) y cuántos mundos se jugaron de verdad.
4. **Commit en la rama `antigravity`** con:
   - las capturas;
   - la tabla;
   - los scripts de prueba, si sirven.

   Sin `publicado: true`, sin `next-env.d.ts` y sin `.data/`.

**Para Claude:** el panel docente no deja crear alumnos de 4.º mientras 4.º está oculto (captura `problema-admin-falta-4to.png`). Para la prueba podés crearlo con `publicado: true` en tu copia local.
