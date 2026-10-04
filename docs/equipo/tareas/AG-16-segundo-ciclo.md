# AG-16 · Contenidos de 4.º, 5.º, 6.º y 7.º grado

**Asignada a:** Antigravity · **Revisa:** Claude · **Pide:** Pedro (docente)

Pedido de Pedro: «trabajemos además en los contenidos para 4.º, 5.º, 6.º y 7.º grado».

Hacela **después de AG-14 y AG-15**. Se hace **un grado por vez, en orden** (4.º → 5.º → 6.º → 7.º).
Al terminar cada grado:
- `git merge main`
- pruebas
- commit
- marcar «✅ 4.º LISTO PARA REVISAR» (o el grado que corresponda) en `TAREAS.md`
- esperar la revisión de Claude antes de seguir con el próximo grado.

Antes de empezar, leé:
- `docs/equipo/tareas/AG-03-segundo-grado.md`: la misma arquitectura que usaste para 2.º.
- `docs/primer-grado/DISENO.md`.
- `src/lib/grades.ts`, `src/lib/grade2/**` (catálogo, habilidades, contenido) y `src/lib/activities.ts`.
- El **Diseño Curricular de Santa Cruz** en `docs/curriculo/*.txt`. Las tablas del segundo ciclo:

| Área | 4.º y 5.º (línea) | 6.º y 7.º (línea) |
|---|---|---|
| Lengua (`1_DC_Primaria_Lengua.txt`) | ~674 | ~972 |
| Matemática (`2_DC_Primaria_Matematica.txt`) | ~764 | ~1061 |
| Ciencias Sociales (`3_DC_Primaria_Cs_Soc.txt`) | ~653 | ~985 |
| Ciencias Naturales (`4_DC_Primaria_Cs_Nat.txt`) | ~402 | ~574 |

Cada tabla tiene **dos columnas** (4.º | 5.º, 6.º | 7.º). Usá **solo la columna del grado** que estás haciendo.

## 1. Estructura por grado (ejemplo: 4.º)

- Carpeta `src/lib/grade4/` con `worlds.ts`, `skills.ts` y `content/` (lengua, matematica, sociales,
  naturales, index, util), igual que `grade2`.
- Ids de mundos:
  - **Lengua:** N1001+ (4.º: 41001+, 5.º: 51001+, 6.º: 61001+, 7.º: 71001+)
  - **Matemática:** N2001+
  - **Sociales:** N3001+
  - **Naturales:** N4001+
  - Todos con `grade: N`.
  - Verificá que no choquen con nada (los mundos de cuentos usan N1101+, los dictados N8001).
- Registrar en `GRADES` (`src/lib/grades.ts`): `masteryPct: 90`, `unlockPct: 60`.
  - **Ambiente provisorio:** usá `THEMES.meseta` (el de 3.º) hasta que Claude haga el ambiente y las islas
    de cada grado.
  - **No** crees imágenes ni toques `public/theme/**`.
- `getWorld`, `worlds.ts` y el panel docente tienen que encontrar los mundos nuevos, igual que pasa
  con 1.º y 2.º.

## 2. Mundos y actividades

- **No hay un número fijo de mundos:** salen de la columna del grado, en orden de progresión y con
  prerrequisitos. Orientación: entre 25 y 40 por materia, de 8 a 10 actividades por vuelta.
- **Matemática:**
  - Actividades generadas al azar dentro del rango de cada mundo.
  - Contenidos: números grandes, operaciones, fracciones y decimales (desde 4.º), proporcionalidad, geometría (ángulos, triángulos, cuadriláteros, circunferencia), medida (perímetro, área, volumen en 6.º y 7.º), estadística y probabilidad.
  - Siempre con problemas en contexto patagónico.
- **Lengua:**
  - Comprensión de textos más largos (cuento, leyenda, fábula, mito, noticia, texto expositivo, biografía, poesía, teatro).
  - Gramática y ortografía de cada grado: clases de palabras, tiempos verbales, tildes, signos, conectores y reglas de b/v, c/s/z, g/j, ll/y y h.
  - Vocabulario (sinónimos, antónimos, familias de palabras) y escritura.
- **Sociales y Naturales:**
  - Bancos de al menos **15 preguntas por mundo**, más actividades de otros tipos (ordenar, clasificar, unir, verdadero/falso, buscar el error).
  - **Sociales:** siempre con Santa Cruz y la Argentina en el centro (la provincia, la Patagonia, los pueblos originarios con respeto, la historia argentina de cada grado, el mapa político y físico, la economía regional).
- **Lenguaje del grado:** 4.º no es 7.º. Mismo criterio que en AG-05: oraciones claras y opciones parejas (la correcta no puede ser la más larga en más del 25 % de las preguntas).
- **Dictados** (tipo `dictation`): seguí la progresión de 2.º y 3.º.
  - **Números:** hasta millones en 6.º y 7.º; decimales desde 5.º.
  - **Palabras y oraciones:** con las reglas ortográficas del grado.
  - **Mundo del Dictado** con ids N8001, con el mismo mecanismo de premio semanal.

## 3. Lo que NO tenés que hacer (lo hace Claude)

- Imágenes: islas, mapas, ambientes y avatares.
- Mundos de comprensión de cuentos para 4.º a 7.º. Vienen con textos nuevos y más largos (mitos, leyendas de otras provincias, cuentos de autores argentinos de dominio público).
- No toques:
  - `src/lib/coleccion/**`, `src/lib/cuentos/**`, `src/lib/tiempo-limitado.ts`, `src/lib/vuelta.ts` ni `src/lib/rateLimit.ts`
  - los componentes del avatar, la tienda y el Camino de premios
  - `public/theme/**`

## 4. Comprobar (por grado)

- `scripts/test-grado4.ts` (y 5, 6, 7) debe comprobar lo siguiente:
  - **Ids:** únicos y sin choques con otros grados.
  - **Prerrequisitos:** todos existen.
  - **Mundos:** cada uno genera su vuelta sin errores 200 veces y ninguna respuesta correcta queda fuera de las opciones.
  - **Sociales y Naturales:** bancos de 15 preguntas o más.
  - **Opciones parejas:** la correcta no es la más larga en más del 25 % de las preguntas.
- Además, siguen pasando: `test-simulation.ts`, `test-cuentos.ts`, `test-dictado.ts`, `test-colecciones.ts`, `test-vuelta.ts` y `test-privacidad.ts`.
- También: `npx tsc --noEmit`, `npx eslint src` y `npm run build`.
- En el resumen de `TAREAS.md` poné:
  - la lista de mundos por materia, con la línea del DC de la que sale cada uno;
  - las decisiones que tomaste;
  - lo que tenga que revisar Pedro.
