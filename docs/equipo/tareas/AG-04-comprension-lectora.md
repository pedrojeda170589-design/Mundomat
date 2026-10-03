# AG-04 · Comprensión lectora en 2.º y 3.º, fichas de los cuentos y más variedad en 2.º

**Asignada a:** Antigravity · **Revisa:** Claude · **Pide:** Pedro (docente)

Antes de empezar: `git merge main` en tu rama (`antigravity`). Necesitás el commit
de Claude «Cuentos en 1.º, 2.º y 3.º» (CL-04), que trae el motor de cuentos.

## Contexto

Pedro pidió un **mundo de comprensión en las posiciones 3, 6, 9, 12… del recorrido de
Lengua de cada grado**, con **los mismos cuentos en 1.º, 2.º y 3.º pero con preguntas más
complejas en cada grado**. Claude ya armó todo el motor:

| Qué | Dónde | De quién |
|---|---|---|
| Tipos (`Cuento`, `CuentoQuestion`, `ComprehensionKind`) | `src/lib/cuentos/tipos.ts` | Claude |
| Los 25 textos narrativos (cuentos, leyendas y fábulas; 6 escenas cada uno, campo `genre`) | `src/lib/cuentos/catalogo.ts` | Claude |
| Preguntas de 1.º (7 por cuento, 3 opciones) | `src/lib/cuentos/preguntas-g1.ts` | Claude |
| **Preguntas de 2.º** | `src/lib/cuentos/preguntas-g2.ts` (hoy vacío) | **Antigravity** |
| **Preguntas de 3.º** | `src/lib/cuentos/preguntas-g3.ts` (hoy vacío) | **Antigravity** |
| Orden de los cuentos por grado, ids, habilidades por tipo, intercalado | `src/lib/cuentos/recorrido.ts` | Claude |
| Armado de actividades (cuento + preguntas) | `src/lib/cuentos/actividades.ts` | Claude |
| Pantalla del cuento (modo `listen` en 1.º, `read` en 2.º y 3.º) | `src/components/activities/ListenActivity.tsx` | Claude |
| Ilustraciones de escenas, islas y mapas | `public/theme/**` | Claude |

Mientras un cuento no tenga preguntas en `preguntas-g2.ts` / `preguntas-g3.ts`, el mundo usa
las de 1.º (funciona, pero es demasiado fácil). **Tu trabajo es que cada grado tenga las suyas.**

Ids de los mundos de cuentos: 1.º **11101–11119**, 2.º **21101–21119**, 3.º **31101–31106**
(posición en `ORDEN_G1` / `ORDEN_G2` / `ORDEN_G3` + 1).

**Actualización (pedido de Pedro):** los mundos alternan **cuento → leyenda → fábula**, con
prioridad a leyendas de Santa Cruz y de la Argentina (Kóoch, Elal, el calafate, la ballena
Góos, el hornero, la yerba mate, el Cerro de los Siete Colores y las Cataratas del Iguazú), y
cada grado tiene su propia selección según su nivel (ver `C1/L1/F1`, `C2/L2/F2`, `C3/L3/F3`
en `recorrido.ts`). Escribí las preguntas para **todos los textos de `ORDEN_G2`** (2.º) y de
**`ORDEN_G3`** (3.º). En las preguntas de tipo `estructura` incluí el reconocimiento del género
(¿es un cuento, una leyenda o una fábula?, ¿qué explica la leyenda?, ¿cuál es la moraleja?).
La isla de cada mundo de cuento es `storyIsland(grade, storyId)` (archivo `cuento-<id>.png`):
usala también para el encabezado de las fichas.

## 1. Preguntas de 2.º grado (`preguntas-g2.ts`)

Los 19 textos de `ORDEN_G2`. En 2.º los chicos **leen** el cuento (pueden tocar 🔊).

- **8 preguntas por cuento**, `options` de 3 o 4 (mezclá: al menos 3 preguntas con 4 opciones).
- Distribución por cuento: 2 `literal`, 2 `secuencia`, 2 `inferencial`, 1 `vocabulario`,
  1 `estructura` o `valoracion`.
- Más exigentes que 1.º: que haya que **releer** (detalles, quién dijo qué, cuántas veces),
  relacionar dos partes del texto, ordenar tres hechos («¿qué pasó entre… y…?»), inferir
  intenciones y sentimientos con su causa, vocabulario en contexto (palabras que **están en
  el texto**: «adularte», «trigal», «telares», «quillango», «pedernal»…).
- Distractores **plausibles** (que aparezcan en el cuento pero no respondan la pregunta),
  nunca absurdos ni chistosos («Solo los domingos» no va).

## 2. Preguntas de 3.º grado (`preguntas-g3.ts`)

Los 6 textos de `ORDEN_G3` (obligatorio) y, si te da el tiempo, el resto del catálogo
(quedan listos para cuando 3.º tenga más mundos de Lengua).

- **10 preguntas por cuento, siempre 4 opciones.**
- Distribución: 2 `literal`, 2 `secuencia`, 3 `inferencial`, 1 `vocabulario`, 1 `estructura`
  (situación inicial / conflicto / desenlace, quién narra, tipo de texto: fábula, leyenda,
  cuento de autor; para qué se escribió), 1 `valoracion` (opinión fundamentada: la opción
  correcta es la que **da una razón basada en el texto**).
- Incluí preguntas de causa-consecuencia, comparación entre personajes, cambio de un
  personaje del principio al final, y «¿qué parte del texto muestra que…?».

## Reglas de las preguntas (los dos grados)

- Tipo `CuentoQuestion` de `tipos.ts`: `{ q, kind, options: [emoji, texto][], answer, hint }`.
  Podés usar helpers como en `preguntas-g1.ts`. `answer` es el índice correcto; se mezclan solas.
- Emoji: uno que ayude y **no delate** la respuesta; compatibles con Emoji ≤ 13.
- `hint` empieza con «Pista: » y orienta a **dónde buscar en el texto**, sin dar la respuesta.
- **Todo tiene que estar en el texto** de `catalogo.ts`: no preguntes por detalles de la
  versión clásica que no están en nuestra versión (por ejemplo, en Caperucita nadie es
  comido; en Juan, el gigante se queda en las nubes).
- Español rioplatense, oraciones cortas; nada que asuste o avergüence.
- **No edites** `catalogo.ts`, `preguntas-g1.ts`, `recorrido.ts` ni `actividades.ts`. Si
  ves un error en un cuento, anotalo en el resumen y lo corrige Claude.

## 3. Fichas complementarias de los mundos de cuentos

Una ficha por mundo de cuento (`private/fichas/mundo-<id>-1.pdf`) con el pipeline de
siempre (`scripts/fichas/FORMATO.md`, `generar_fichas.py`): 19 de 1.º (11101–11119),
19 de 2.º (21101–21119) y 6 de 3.º (31101–31106).

- **No son la app en papel**: nada de opción múltiple. Propuestas para después de leer:
  renarrar en familia, dibujar la parte favorita, cambiar el final, una carta a un
  personaje, entrevistar a un abuelo sobre otra versión del cuento, buscar la palabra
  nueva en el diccionario, armar títeres, dramatizar, inventar una moraleja…
- 1.º: mucho dibujo y conversación (los adultos leen). 2.º: escritura breve. 3.º: escritura
  de un texto corto (otro final, una noticia sobre lo que pasó en el cuento…).
- Verificá que `/familias` las liste y se descarguen (ver `src/lib/fichas.ts`).

## 4. Más variedad en 2.º grado (seguimiento de AG-03)

Revisé AG-03 y quedó muy bien de contenido. Para terminarlo:

- En Matemática y Lengua generadas, **no más de 3 actividades seguidas del mismo tipo**
  por vuelta: mezclá `pick` con `input`, `order`, `classify`, `build`, `count`, `match`,
  `true-false` según el contenido (por ejemplo, en 22013 «Sumas que llevan dieces», hoy las
  8 son `pick`).
- Revisá emojis ambiguos en Lengua (por ejemplo 👩 para «madre», 🦹 en la lista de
  trabadas) y distractores poco serios en los bancos.
- **No toques las imágenes de 2.º** (`public/theme/grados/2/**`, `Forest.tsx`): Claude las
  rehace ilustradas, con el mismo estilo de 1.º.

## 5. Comprobar

- `npx tsx scripts/test-simulation.ts` y un script nuevo `scripts/test-cuentos.ts` que
  verifique, para los 3 grados: cantidad de preguntas y opciones por grado, distribución de
  tipos, `answer` dentro de rango, opciones sin repetir, `hint` con «Pista: », y que cada
  mundo de cuento arma `listen` + N `pick`.
- `npx tsc --noEmit`, `npx eslint src`, `npm run build` sin errores.
- Commit en `antigravity`, `TAREAS.md` → `✅ LISTA PARA REVISAR` con resumen.

## Qué NO tocar

`src/lib/cuentos/{tipos,catalogo,preguntas-g1,recorrido,actividades}.ts`,
`ListenActivity.tsx`, `ActivityRunner.tsx`, `public/theme/**`, los `worlds.ts` de cada grado,
`src/lib/platform/**`, `supabase/**`, `src/app/docente/**` y `src/app/admin/**` (Claude está
armando escuelas y aulas ahí).
