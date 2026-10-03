# AG-05 · Ajustes de comprensión: nivel de 3.º y opciones parejas

**Asignada a:** Antigravity · **Revisa:** Claude · **Pide:** Pedro (docente)

Antes de empezar: `git merge main` en tu rama (`antigravity`).

## Revisión de AG-04 (Claude)

AG-04 quedó unida a `main`: todas las preguntas de 2.º (19 textos × 8) y de 3.º (6 × 10)
cumplen el formato, `scripts/test-cuentos.ts` y `test-simulation.ts` pasan, las 44 fichas
de los cuentos se generan y la variedad de Lengua y Matemática de 2.º mejoró mucho.
Encontré tres cosas para ajustar:

### 1. 3.º grado: el lenguaje está muy por encima de chicos de 8 años

Preguntas y fichas de 3.º usan palabras y giros de secundaria. Ejemplos reales:
«fauces», «desmesuradamente», «imperioso», «voracidad insaciable», «armonización
territorial», «función cosmogónica», «características antitéticas», «¿por qué el héroe no
aniquila a la fiera…?», «volanta, copete» (en una noticia para 3.º).

- Reescribí las 60 preguntas de `preguntas-g3.ts` y las 6 fichas de 3.º (31101–31106) con
  **vocabulario de 3.º**: oraciones de hasta ~14 palabras, palabras que un chico de 8 años usa
  o que aparecen en el texto. La exigencia tiene que venir del **razonamiento** (relacionar dos
  partes, causa y consecuencia, comparar personajes), no de palabras difíciles.
- En `vocabulario`, preguntá por palabras **del texto** que sean nuevas pero alcanzables
  (cañadón, tábano, quillango, telares), con definiciones simples.
- Fichas de 3.º: escribir una noticia corta («¿qué pasó?, ¿dónde?, ¿quiénes?»), otro final,
  una carta a un personaje… con consignas en palabras simples. Nada de «copete» ni
  «volanta» (si querés usar las partes de la noticia, explicalas: «título», «una oración que
  cuente lo más importante»).
- Revisá también 2.º con el mismo criterio (hay algunas como «¿Qué lección social y ética
  contiene…?»: mejor «¿Qué nos enseña este cuento?»).

### 2. La respuesta correcta suele ser la opción más larga

| Grado | Preguntas | La correcta es la más larga |
|---|---|---|
| 1.º (Claude) | 175 | 71 % |
| 2.º | 152 | 70 % |
| 3.º | 60 | 82 % |

Así los chicos aprenden a elegir «la más larga» sin leer. Ajustá **las tres colecciones**
(`preguntas-g1.ts` incluida: te la paso a vos para esta tarea) para que la correcta sea la más
larga en **no más del 35 %** de las preguntas: alargá distractores plausibles o acortá la
correcta. Sumá ese chequeo a `scripts/test-cuentos.ts` (que falle si pasa del 35 %).

### 3. Distractores

Que los distractores sean **del cuento** (personajes, lugares u objetos que aparecen) y no
absurdos. Ejemplo a evitar: «Porque comprobó que las cosquillas son la mejor defensa en
cualquier circunstancia».

## Qué podés tocar

`src/lib/cuentos/preguntas-g1.ts`, `preguntas-g2.ts`, `preguntas-g3.ts`,
`scripts/fichas/data_cuentos.py` (y regenerar `private/fichas/mundo-{11101..11119,
21101..21119, 31101..31106}-1.pdf`), `scripts/test-cuentos.ts`, y `TAREAS.md`.

**No toques** `catalogo.ts`, `recorrido.ts`, `actividades.ts`, `tipos.ts`, componentes,
imágenes, ni `src/lib/platform/**`, `supabase/**`, `src/app/docente/**`, `src/app/admin/**`.

## Comprobar

`npx tsx scripts/test-cuentos.ts` (con el chequeo nuevo), `npx tsx scripts/test-simulation.ts`,
`npx tsc --noEmit`, `npx eslint src`, `npm run build`. Commit en `antigravity` y
`TAREAS.md` → `✅ LISTA PARA REVISAR` con resumen.
