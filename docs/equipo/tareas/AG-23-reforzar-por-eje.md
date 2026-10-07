# AG-23 · Panel docente: qué contenidos reforzar, por eje (no nombres de mundos)

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Prioridad:** después de AG-21 y **antes** de AG-20 (es para el docente y se usa todos los días).

## El pedido de Pedro
«Para el docente, que aparezcan los contenidos que debe reforzar el estudiante de cada eje, porque al poner "Reforzar: La Aldea de los Números…" no queda claro.»

El nombre del mundo («La Aldea de los Números») sirve para el alumno, pero al docente no le dice qué contenido falla. El dato ya existe: cada mundo tiene su entrada curricular en `src/lib/curriculo/santa-cruz.json` (y `nap.json`) con `area`, `eje` y `contenido` (AG-09), y una descripción corta en `WorldDef.description`.

## Dónde aparece hoy el nombre del mundo como «a reforzar»
- **Resumen del curso** (`src/components/admin/CourseSummary.tsx`, «A quién ayudar primero»): `redWorldNames` de `computeStudentsNeedingHelp` (`src/lib/courseSummary.ts`).
- **Reporte del curso imprimible** (`src/app/admin/reporte/curso/page.tsx`): también `redWorldNames`.
- **Legajo del alumno** (`src/app/docente/alumno/page.tsx`, «Fortalezas y aspectos a reforzar»): lista por mundo con `w.name`.
- Revisá con `grep -rn "\.name" src/components/admin src/app/admin src/app/docente` si hay otros lugares del docente que muestren un mundo como «a reforzar» o «en rojo» (ficha del alumno en el panel, CSV del curso). **El informe a la familia (`familyReport.ts`) ya usa el contenido: no lo cambies.**

## Lo que hay que hacer
1. **Función pura** `contenidosAReforzar(...)` en `src/lib/reforzar.ts` (sin React), usada por todas las pantallas de arriba:
   - Entrada: los mundos «a reforzar» de un alumno (los mismos criterios de hoy: rojo / necesita práctica / práctica guiada; **no cambies los umbrales**), el currículo activo (`getCurriculoActivo`, con los validados del docente como hoy) y la lista de mundos.
   - Salida **agrupada por materia y eje**, en el orden de las materias del mapa y, dentro de cada eje, en el orden de los mundos:
     ```ts
     { materia: string; eje: string; items: { worldId: number; contenido: string; mundo: string; nivel: SkillLevel; precision?: number }[] }[]
     ```
   - `contenido`: el **contenido curricular resumido** para leer de un vistazo. Usá `WorldDef.description` como texto principal (es corto y claro: «Sumar y restar para agregar, quitar, ganar o perder») y el `contenido` del diseño curricular completo como detalle (ver punto 2). Si un mundo no tiene entrada curricular (cuentos, dictados, zonas de práctica), el eje es «Otros» y el texto es su `description`.
   - Si dos mundos del mismo eje tienen el mismo contenido, se muestran una sola vez (con el peor nivel).
2. **Cómo se ve** (en las tres pantallas, mismo componente `ReforzarPorEje` en `src/components/admin/`):
   ```
   Matemática · Número y Operaciones
     🔴 Sumar y restar para agregar, quitar, ganar o perder (52 % de aciertos)
     🟠 Leer, escribir y ordenar números hasta 1.500
   Lengua · Escritura
     🔴 Uso de mayúsculas y punto
   ```
   - El nombre del mundo queda **en chico y gris** al final («— mundo: La Aldea de los Números»), para que el docente lo encuentre en el mapa si quiere.
   - Tocar un contenido despliega el **texto completo del diseño curricular** y su fuente («DC Santa Cruz 1.er ciclo, p. 89»). Si la entrada no está validada por el docente, el aviso de siempre («vínculo curricular sin validar»).
   - En «A quién ayudar primero» (que es una lista larga) mostrá por alumno **solo los ejes**, con la cantidad de contenidos («Matemática · Número y Operaciones (2)»), y el detalle al tocar al alumno o en su legajo.
   - En el reporte imprimible, todo desplegado (sin botones) y que entre bien en A4.
3. **Fortalezas**: en el legajo, la parte de fortalezas también se agrupa por eje con el contenido (mismo componente, nivel «consolidado»), para que se lea igual.
4. **CSV del curso** (`src/lib/courseExport.ts`): si hay una columna de mundos a reforzar, que diga «eje: contenido» en vez del nombre del mundo.
5. **Todos los grados**: tiene que andar en 1.º, 2.º, 3.º y 4.º. Para 1.º y 4.º, que tienen habilidades (`src/lib/grade1/skills.ts`, `src/lib/grade4/skills.ts`), si la pantalla ya muestra habilidades, usá su nombre como contenido; si no, el mismo criterio por mundo.

## Pruebas (obligatorio)
`scripts/test-reforzar.ts`:
- agrupa por materia y eje en el orden correcto; un mundo sin entrada curricular va a «Otros» con su descripción;
- no repite contenidos iguales y conserva el peor nivel;
- con el currículo NAP activo usa los ejes de NAP;
- ningún texto de salida es solo el nombre del mundo;
- el umbral de «a reforzar» es el mismo de antes (comparalo con `computeStudentsNeedingHelp` para los alumnos de la base local).
Capturas de pantalla (Playwright) del Resumen del curso, del legajo de un alumno y del reporte imprimible, en tu resumen.

## Entrega
`npx tsc --noEmit`, `npx eslint src`, el test nuevo y los de siempre (`test-resumen`, `test-reportes`, `test-curriculo`, `test-privacidad`) en verde. Resumen en `TAREAS.md` con cada punto «hecho» y cómo lo probaste.
