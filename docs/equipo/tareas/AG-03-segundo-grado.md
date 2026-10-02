# AG-03 · 2.º grado completo

**Asignada a:** Antigravity · **Revisa:** Claude · **Pide:** Pedro (docente)

Pedro quiere que MundoTest26 haga un recorrido de 1.º a 7.º grado. 1.º ya está
hecho (CL-02 + AG-02) y 3.º es el de siempre. Esta tarea es **2.º grado
completo**: mundos, actividades, habilidades, ambiente visual (imágenes) y
fichas. Que quede tan completo como 1.º, o más.

Antes de empezar, leé con atención:

- `docs/primer-grado/DISENO.md` (cómo está armado 1.º: copiá la arquitectura, no el contenido).
- `src/lib/grades.ts` (registro de grados y **ambientes visuales** `THEMES`).
- `src/lib/grade1/**` (catálogo, habilidades, contenido, zonas de práctica).
- `src/components/activities/*` y `src/lib/activities.ts` (tipos de actividad).
- Diseño Curricular de Santa Cruz en `docs/curriculo/` (PDF y texto extraído):
  la tabla de contenidos tiene tres columnas **1° · 2° · 3° grado** (Lengua desde
  la línea ~285 del .txt, Matemática ~370, Sociales ~338, Naturales ~253). Usá
  **solo la columna de 2.º** para definir los mundos.

## 1. Catálogo de mundos (`src/lib/grade2/`)

- `worlds.ts` con la misma función `build()` de 1.º. Ids: Lengua **21001+**,
  Matemática **22001+**, Sociales **23001+**, Naturales **24001+**, `grade: 2`.
- **No hay un número fijo de mundos**: salen de los contenidos de 2.º, en orden de
  progresión y con prerrequisitos. Orientación (verificar con el DC):
  - **Lengua:** consolidar la alfabetización: lectura fluida de palabras con todas las
    letras; sílabas trabadas (bl, br, cl, cr, dr, fl, fr, gl, gr, pl, pr, tr); ca-co-cu /
    que-qui / ce-ci; ga-go-gu / gue-gui / ge-gi / güe-güi; r y rr; mb y mp; h; mayúscula
    y punto; sustantivos comunes y propios; género y número; orden alfabético; lectura
    y comprensión de cuentos, fábulas, poesías, adivinanzas, instructivos, notas y
    cartas; escritura de oraciones y textos breves; renarración.
  - **Matemática:** números hasta 100 y su exploración hasta 1000 (cuadro de números,
    valor posicional con dieces y cienes, dinero), comparar y ordenar, sumas y restas con
    y sin dificultad, cálculo mental (dobles, +10, −10, complementos a 10 y a 100),
    problemas (juntar, agregar, quitar, comparar, completar), inicio de la
    multiplicación (series, grupos iguales, dobles) y del reparto, figuras y cuerpos,
    medidas de longitud, peso y capacidad (unidades convencionales e intermedias), hora
    (en punto, y media) y calendario.
  - **Ciencias Sociales y Naturales:** lo que diga la columna de 2.º del DC, siempre con
    ejemplos de Santa Cruz.
- Cada mundo con `objective`, `contents` (texto del DC), `skills`, `prerequisites`,
  `difficultyVars`, `kind` y `activityCount` (8 a 10).

## 2. Habilidades (`src/lib/grade2/skills.ts`)

Catálogo por materia (como `GRADE1_SKILLS`), con `description` y `practice`. Hacé que
el informe docente (`src/components/admin/SkillReport.tsx`) y las zonas de práctica
(`src/lib/grade1/practice.ts`) funcionen **por grado** (hoy están atados a 1.º):
movelos a algo genérico (por ejemplo `skills` y `worlds` dentro de cada `GradeDef`
en `grades.ts`), sin cambiar cómo se ven para 1.º.

## 3. Actividades (`src/lib/grade2/content/`)

- Lengua y Matemática **generadas** (palabras y números al azar dentro del rango de
  cada mundo, como en 1.º); Sociales y Naturales con bancos de **al menos 12
  preguntas** por mundo + actividades extra de otros tipos (ordenar, clasificar,
  cuento con preguntas, varias respuestas).
- Usá los tipos que ya existen (`pick`, `count`, `build`, `trace`, `order`,
  `classify`, `match`, `mc`, `input`, `true-false`, `shape-identify`). Si hace falta un
  tipo nuevo (por ejemplo **reloj** para la hora, o **dictado**: escuchar una palabra
  y armarla con letras), agregalo como componente nuevo en
  `src/components/activities/` y avisá en el resumen (Claude revisa `ActivityRunner`).
- Banco de palabras de 2.º con sílabas, como `grade1/words.ts`, con dibujo **no
  ambiguo** (un emoji que no se confunda con otra palabra).
- `buildActivitiesForWorld` ya despacha 1.º por `world.grade === 1`: sumá 2.º.
- Dominio: definí `masteryPct` (sugerido 85) y `unlockPct` (60) en el registro.

## 4. Ambiente visual de 2.º: **bosque de lengas**

Cada grado tiene su paisaje de Santa Cruz (1.º costa, 2.º **bosque**, 3.º meseta y
montaña). Misma interfaz, imágenes propias:

- `THEMES.bosque` en `grades.ts` (copiá `THEMES.costa`): islas en
  `public/theme/grados/2/islas/mundo-<id>.png`, zona de práctica
  `public/theme/grados/2/islas/practica.png`, mapa
  `public/theme/grados/2/mapa/etapa-1..4.jpg`, fondos `bg-bosque-day` /
  `bg-bosque-night` en `globals.css`, y una silueta SVG de bosque
  (`src/components/Forest.tsx`, como `Seashore.tsx`) para `scenery: "forest"`.
- **Islas**: una por mundo, PNG con fondo transparente, ~340 px, estilo diorama 3D
  infantil igual al de 1.º pero con **base de bosque**: tierra oscura, musgo,
  hojas de lenga rojizas y doradas, hongos, troncos, un arroyito. Tema de cada isla
  según su mundo. Sin texto (salvo letras/números pedidos como escultura).
  Método recomendado: generar hojas de 3×3 islas sobre blanco, cortar por la grilla y
  quitar el fondo (Python con `rembg`, ver el script de ejemplo
  `scripts/imagenes/cortar_islas.py`).
- **Mapa** (4 etapas, 800×1200 JPG): sendero de piedras que sube por el bosque;
  la etapa 1 más simple y la 4 más rica (otoño dorado, huemules, cascada, refugio).
- Revisá que el mapa de 1.º y 3.º no cambie.

## 5. Docente y alumnos

- `/admin`: hoy los selectores de grado tienen `[3, 1]` fijo (alta de alumno, cambio
  de grado, pestaña de mundos). Generalizalos con `GRADES` para que aparezca 2.º.
- `/docente` (plataforma): `WorldsTab` en `src/app/docente/aula/page.tsx` elige los
  mundos con `classroom.grade === 1`: generalizalo con el registro de grados.
- El legajo (`/docente/alumno`) muestra el informe de habilidades para 1.º:
  que también lo muestre para 2.º.

## 6. Fichas de 2.º

Una ficha complementaria por mundo (`scripts/fichas/segundo-<materia>.json`), igual
criterio que las de 1.º y 3.º: **no** son la app en papel (hacer, jugar en familia,
investigar, conversar, crear). Generalas con `generar_fichas.py` (que lea también
`src/lib/grade2/worlds.ts` y la isla de 2.º) y sumá 2.º a `/familias`.

## No tocar

`src/lib/grade1/content/lengua.ts`, `matematica.ts`, `src/lib/openClassroom*`,
`src/lib/platform/**` (salvo lo pedido en 5), `supabase/**`,
`public/theme/grados/1/**`, `public/theme/avatars/**`.

## Cómo comprobar

1. `npx tsc --noEmit`, `npx eslint src`, `npm run build` sin errores.
2. Script con `npx tsx` que arme las actividades de **todos** los mundos de 1.º y 2.º
   40 veces y verifique: respuestas entre las opciones, órdenes válidos, sin ids
   repetidos, habilidades existentes, mínimo 6 actividades por mundo.
3. Crear en `/admin` un alumno de **2.º**, entrar con su código: el mapa tiene el
   ambiente de bosque, los mundos se abren por prerrequisitos y se puede jugar una
   vuelta de un mundo de cada materia. Capturas del mapa y de 3 actividades.
4. Un alumno de 1.º y uno de 3.º siguen viendo su mapa de siempre.
5. Fichas: revisar 3 PDF de 2.º a ojo.

Al terminar: commit en la rama `antigravity`, actualizar `TAREAS.md` con un resumen
(qué mundos salieron de cada eje del DC y por qué esa cantidad) y no hacer `git push`.
