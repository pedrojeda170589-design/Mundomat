# AG-06 · Textos más largos por grado y dictados (2.º y 3.º)

**Asignada a:** Antigravity · **Revisa:** Claude · **Pide:** Pedro (docente)

Hacela **después de AG-05** (o junto, en la misma rama). Antes de empezar: `git merge main`.

Pedido de Pedro:

> Teniendo en cuenta la progresión 1.º, 2.º, 3.º…, que los textos de los mundos de comprensión
> sean cada vez más largos, adecuándose al nivel. Desde 3.º la lectura en voz alta del navegador
> es una opción que cuesta 5 monedas. Agregar dictados de números y de palabras a partir de 2.º,
> con progresión por grado: por ejemplo, el audio dice «veintidós» y el alumno escribe 22. Un mundo
> especial de dictados que aparezca semana por medio. Premio en monedas o un objeto especial si
> hacen todo el mundo en el primer intento al 100 %.

## Lo que ya dejó listo Claude (no lo cambies)

- `src/lib/cuentos/textos-g2.ts` y `textos-g3.ts`: `Record<storyId, string[]>` **vacíos**.
  `escenasDe(grade, storyId)` (en `recorrido.ts`) usa el texto del grado y, si falta o no tiene
  6 escenas, el del grado anterior. `buildStoryActivities` ya lo usa para la pantalla y para
  «Volver a ver el cuento».
- Lectura en voz alta paga en 3.º: `COSTO_NARRACION = { 1: 0, 2: 0, 3: 5 }` en `recorrido.ts`;
  `ListenActivity` cobra 5 🪙 **una vez por texto** (con `/api/spend-coins`) y muestra
  «Si necesitás ayuda, podés escucharlo por 5 🪙». En 1.º se narra solo; en 2.º es gratis.

## Parte A · Textos más largos en 2.º y 3.º

Escribí en `textos-g2.ts` los 19 textos de `ORDEN_G2` y en `textos-g3.ts` los 6 de `ORDEN_G3`
(y, si te da el tiempo, todo el catálogo para 3.º).

| | 1.º (ya está) | 2.º | 3.º |
|---|---|---|---|
| Palabras por escena | 20–35 | **40–60** | **60–90** |
| Texto completo | ~180 | ~300 | ~450 |
| Recursos | oraciones simples | + descripciones, diálogos con raya, conectores (primero, después, mientras tanto, al final) | + causas y consecuencias, sentimientos, comparaciones, vocabulario nuevo explicado por el contexto |

Reglas:
- **Las mismas 6 escenas y en el mismo orden**: cada escena tiene que seguir correspondiendo a
  su ilustración (`public/theme/grados/1/cuentos/<id>-<n>.jpg`). Mirá las imágenes antes de
  escribir; no agregues hechos que contradigan el dibujo.
- Mismo relato y mismo final suave que la versión de 1.º (en Caperucita nadie es comido; en
  Juan el gigante se queda en las nubes; en la ballena, cosquillas en lugar del cuchillo).
- Español rioplatense, claro. Más largo **no** es más rebuscado: el lenguaje de 3.º tiene que ser
  de 3.º (ver AG-05).
- Después de escribir los textos, **ajustá las preguntas de 2.º y 3.º** para que se respondan
  con la versión larga (los detalles nuevos permiten preguntas literales e inferenciales mejores).

## Parte B · Actividad nueva: dictado

### Tipo de actividad (`src/lib/activities.ts`, cambio aditivo)

```ts
| {
    type: "dictation";
    id: string;
    title: string;
    prompt: string;            // "Escuchá y escribí el número."
    say: string;               // lo que se dicta, escrito como se pronuncia: "veintidós"
    answer: string;            // "22" | "girasol" | "El tren llegó tarde."
    kind: "numero" | "palabra" | "oracion";
    strictAccents?: boolean;   // si la tilde es obligatoria (ver criterios)
    hint: string;
    skills: string[];
  }
```

Componente `src/components/activities/DictationActivity.tsx` y su caso en `ActivityRunner.tsx`
(cambio aditivo, igual que los demás tipos):
- Botón grande **🔊 Escuchar** (gratis siempre: es el corazón del dictado, no es una ayuda) que se
  puede repetir; se reproduce solo al aparecer. Usá `speak()` de `src/lib/tts.ts` con velocidad
  más lenta (agregá un parámetro opcional `rate`, sin cambiar el comportamiento actual).
- Números: `inputMode="numeric"`, solo dígitos. **No mostrar el número escrito**: el chico
  escucha y escribe.
- Corrección amable: «¡Bien!» / «Casi: escribiste 202, el número era 22». En palabras, marcá la
  letra que falla.

Criterios de corrección:
- Números: exacto (sin puntos ni espacios: «1500» y «1.500» valen igual).
- Palabras 2.º: no importan mayúsculas; **la tilde no es obligatoria** (si falta, cuenta como
  bien pero se avisa «¡Le faltó la tilde!»). 3.º: tilde obligatoria en las palabras de reglas
  trabajadas (`strictAccents: true`).
- Oraciones: 2.º exige mayúscula inicial y punto final; 3.º además signos de pregunta y
  exclamación de apertura y cierre. Espacios de más no cuentan.

Utilidad `numeroEnLetras(n)` (español, hasta 99.999) para armar el `say` de los números, con
pruebas: 21 «veintiuno», 22 «veintidós», 100 «cien», 101 «ciento uno», 1005 «mil cinco»,
2040 «dos mil cuarenta».

### Progresión por grado (bancos en `src/lib/dictado/`)

**2.º grado** (según el DC de 2.º):
- Números: nivel 1 hasta 100 (incluye 11–15 y decenas) → nivel 2 hasta 500 → nivel 3 hasta 1000
  (con ceros intermedios: 105, 340, 909).
- Palabras: sílabas directas → trabadas (bl, br, cl, cr, dr, fl, fr, gl, gr, pl, pr, tr) →
  ca-que-qui, ga-gue-gui, ge-gi, güe-güi → r/rr, mb/mp, h. Usá `src/lib/grade2/words.ts`.
- Oraciones (nivel 3): 4 a 6 palabras, con mayúscula y punto: «El zorro come calafate.»

**3.º grado:**
- Números: hasta 1500 → hasta 5000 → hasta 10.000 (ceros intermedios: 3005, 7040, 10.000).
- Palabras: reglas ortográficas de 3.º (mb, nv, plurales -z → -ces, h inicial frecuente, b en
  -aba, v en -ava/-ave, tildes en agudas frecuentes: canción, ratón, también).
- Oraciones: 8 a 12 palabras, con signos de pregunta o exclamación, coma en enumeraciones.

Nivel según el momento del año escolar (marzo–abril nivel 1, mayo–agosto nivel 2,
septiembre–diciembre nivel 3), en `nivelDeDictado(grade, fecha)`. Todo con contexto patagónico
cuando se pueda (guanaco, calafate, Gobernador Gregores, Río Gallegos).

### Dictados dentro de los mundos comunes

En 2.º y 3.º, sumá **1 o 2 dictados por vuelta** en los mundos de números (Matemática) y de
ortografía (Lengua) que correspondan al contenido, sin superar 10 actividades por vuelta.

## Parte C · Mundo especial de dictados (semana por medio)

- Un **«Mundo del Dictado»** por grado (2.º y 3.º), que aparece en el mapa como isla especial
  (como las zonas de práctica) **solo las semanas de dictado**: semana por medio, de lunes a
  domingo (`esSemanaDeDictado(fecha)`, por número de semana ISO par). Las otras semanas aparece
  apagado con el cartel «Vuelve el lunes de la semana que viene».
- 10 dictados por vuelta: **5 de números y 5 de palabras u oraciones**, del nivel del momento del
  año. Distintos en cada vuelta (generados al azar dentro del nivel).
- Ids: 2.º **28001**, 3.º **38001** (verificá que no choquen). Isla: pedile a Claude la imagen;
  mientras tanto usá la de la zona de práctica del grado.
- **Premio:** si el alumno hace la **primera vuelta de esa semana al 100 %**: **+20 🪙** y, la
  primera vez que lo logra, un objeto especial que no se vende en la tienda: el accesorio
  **«Lápiz dorado» ✏️** para el avatar (agregalo como accesorio de premio; Claude hace la imagen).
  La acreditación se hace **en el servidor** (`src/lib/data.ts`, cambio aditivo), una sola vez
  por semana, aunque repita el mundo. Campos nuevos opcionales en `StudentProgress`, por ejemplo
  `dictationWeeks?: Record<string, { firstScore: number; rewarded: boolean }>`.
- El mundo muestra antes de empezar: «¡Semana de dictado! Si hacés todo bien en el primer intento,
  ganás 20 🪙 y el Lápiz dorado».
- Informe docente (`/admin` → Registro y `/docente/alumno`): resultado de cada semana de dictado y
  **las palabras y números que se equivocó**, para que el docente sepa qué reforzar.

## Comprobar

- Pruebas nuevas `scripts/test-dictado.ts`: `numeroEnLetras` (casos de arriba y 500 al azar
  contra una tabla), corrección de palabras y oraciones por grado, que cada nivel genere sin
  repetir dentro de una vuelta, `esSemanaDeDictado`, y el premio una sola vez por semana.
- `test-simulation.ts` y `test-cuentos.ts` siguen pasando; `npx tsc --noEmit`, `npx eslint src`,
  `npm run build`.
- Commit en `antigravity` y `TAREAS.md` → `✅ LISTA PARA REVISAR` con resumen.

## Qué NO tocar

`catalogo.ts`, `recorrido.ts`, `actividades.ts`, `tipos.ts`, `ListenActivity.tsx`, imágenes
(`public/theme/**`), `src/lib/platform/**`, `supabase/**`, `src/app/docente/escuela/**`,
`src/app/docente/plataforma/**`. En `ActivityRunner.tsx`, `activities.ts`, `types/index.ts` y
`data.ts`, solo cambios **aditivos** (anotalos en el resumen).
