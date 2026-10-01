# AG-02 · 1.º grado: más variedad en Sociales y Naturales + fichas de 1.º

**Asignada a:** Antigravity · **Revisa:** Claude · **Pide:** Pedro (docente)

## Contexto

CL-02 ya está en `main`: 1.º grado tiene 96 mundos (ver `docs/primer-grado/DISENO.md`).
Ciencias Sociales (18 mundos) y Ciencias Naturales (15) hoy usan solo bancos de
preguntas de «elegir» (`src/lib/grade1/content/sociales.ts` y `naturales.ts`, 10
preguntas por mundo con el helper `q()` de `content/util.ts`).

## Qué hay que hacer

### 1. Más variedad de actividades en Sociales y Naturales

Para cada mundo de Sociales y Naturales de 1.º, sumar **al menos 3 actividades de
otros tipos** (además de las 10 preguntas), usando los tipos que ya existen:

- `order` (ordenar: antes/después, pasos de un proceso, crecimiento de una planta),
- `classify` (clasificar: vivo/no vivo, natural/construido, campo/ciudad, sólido/líquido),
- `pick` con `story` (un texto corto original para escuchar y responder),
- `pick` con varias respuestas (`answerIds` con más de una).

Formato sugerido: en cada archivo, un `EXTRA_<MATERIA>: Record<number, ActivitySpec[]>`
y en `content/index.ts` mezclar 6 preguntas del banco + 2 extra al azar (8 por vuelta).
Todas con `skills` del mundo y `hint` que empiece con «Pista: ». Sin emojis raros
(Emoji 13 como máximo), contenido correcto y local (Santa Cruz).

### 2. Fichas complementarias para 1.º

Igual que las de 3.º (`scripts/fichas/`, ver `FORMATO.md`), pero para chicos que
recién empiezan a leer: **1 ficha por mundo de 1.º** (96), con consignas muy cortas
para leer con un adulto, más dibujo y menos escritura. Que **no** sean la app en
papel: hacer con objetos de la casa, jugar en familia, observar, conversar, crear.

- Contenido: `scripts/fichas/primero-<materia>.json` (claves = id del mundo, p. ej. `"11013"`).
- Adaptar `scripts/fichas/generar_fichas.py` para leer también estos archivos
  (nombre del mundo desde `src/lib/grade1/worlds.ts`) y generar
  `private/fichas/mundo-<id>-1.pdf`.
- En `src/lib/fichas.ts`, `fichaVersions` debe devolver 1 para mundos de 1.º, y la
  página `/familias` mostrar los mundos del grado del alumno (hoy lista solo los de 3.º).
- En el mapa de 1.º (`src/app/student/play/page.tsx`) volver a mostrar el botón 📄
  (hoy `showFichas` está apagado para 1.º).

## No tocar

`src/lib/grade1/content/lengua.ts`, `matematica.ts`, `src/lib/grades.ts`,
`src/components/ActivityRunner.tsx`, `src/components/activities/*` (Claude).

## Cómo comprobar

1. `npx tsc --noEmit`, `npx eslint src`, `npm run build` sin errores.
2. Un script con `npx tsx` que arme las actividades de todos los mundos de 1.º 30 veces
   y verifique: respuestas presentes entre las opciones, órdenes válidos, sin ids repetidos.
3. Abrir con un alumno de 1.º (se crea en `/admin` eligiendo «1.º») un mundo de
   Sociales y uno de Naturales y jugar una vuelta.
4. Generar las fichas y revisar 3 PDF a ojo (que entren en 1–2 hojas).

Al terminar: commit en la rama `antigravity`, actualizar `TAREAS.md` y escribir el resumen.
