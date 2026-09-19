# MundoMat 🚀

Videojuego educativo de Matemática, Lengua, Ciencias Naturales y Ciencias
Sociales para 3° grado — Escuela Hogar Primaria Provincial Rural N°2
"Héroes de Malvinas".

## Qué incluye

- **47 mundos en 4 materias**, cada una organizada según su Planificación
  Anual de 3° grado, en progresión real por trimestre. Los alumnos eligen la
  materia con una pestaña 🔢 Matemática / 📚 Lengua / 🔬 Ciencias Naturales /
  🏛️ Ciencias Sociales en el mapa de juego.

  **🔢 Matemática (14 mundos)**
  - **1er trimestre (básico, voz gratis)**: números y valor posicional,
    sumas y restas en sus distintos sentidos, cálculo mental, y ubicación
    espacial con primeras medidas de longitud.
  - **2do trimestre (avanzado)**: tablas de multiplicar agrupadas por
    dificultad real (2/5/10, luego 3/4/6, luego 7/8/9), reparto y división,
    figuras planas, y medidas de capacidad y peso.
  - **3er trimestre (avanzado)**: problemas con las cuatro operaciones,
    fracciones (mitades y cuartos), números grandes con calculadora y
    estimación, y cuerpos geométricos con equivalencias de tiempo.

  **📚 Lengua (12 mundos)**
  - **1er trimestre (básico, voz gratis)**: rimas, adivinanzas y
    trabalenguas; cuentos, fábulas y poesías compartidas; primeros textos
    escritos con mayúsculas y puntuación; clases de palabras (sustantivo,
    adjetivo, verbo) y sinónimos/antónimos.
  - **2do trimestre (avanzado)**: leyendas e historietas y su estructura
    narrativa; textos informativos y paratextos (tapa, índice, contratapa);
    cartas, historietas propias y conectores; formación de palabras
    (concordancia, prefijos, sílaba tónica, ortografía).
  - **3er trimestre (avanzado)**: debates y argumentación oral; lectura
    autónoma (información explícita/implícita y síntesis); escritura
    creativa de cuentos e instructivos; sentido literal y figurado de las
    palabras, y ortografía avanzada.

  **🔬 Ciencias Naturales (12 mundos)**, cruzando los 4 ejes NAP (seres
  vivos, materiales, mundo físico, Tierra y Universo) por trimestre:
  - **1er trimestre (básico, voz gratis)**: fauna y flora local y cuerpo
    humano; mezclas sencillas (agua con arena, sal, azúcar); fenómenos
    térmicos y acciones mecánicas básicas; paisajes locales y primera
    orientación con puntos cardinales.
  - **2do trimestre (avanzado)**: cadenas alimentarias e higiene; cambios
    de estado del agua y separación de mezclas; sonido, vibración y
    conducción del calor; fenómenos atmosféricos y movimientos del Sol y
    la Luna.
  - **3er trimestre (avanzado)**: comparación de seres vivos de distintas
    regiones; transformaciones de materiales e informes de investigación;
    integración de fenómenos de luz, sonido y calor; ciclos del cielo,
    tiempo atmosférico y puntos cardinales.

  **🏛️ Ciencias Sociales (9 mundos)**, cruzando los 3 ejes NAP (sociedades y
  espacios geográficos, sociedades a través del tiempo, actividades humanas
  y organización social) por trimestre:
  - **1er trimestre (básico, voz gratis)**: paisajes urbanos y rurales de la
    zona y la provincia; grupos sociales coloniales y su vida cotidiana;
    autoridades locales y normas de convivencia.
  - **2do trimestre (avanzado)**: circuitos productivos regionales y sus
    componentes; cambios y continuidades, huellas del pasado y patrimonio;
    funciones del gobierno municipal (Intendente, Concejo Deliberante,
    Tribunal de Faltas).
  - **3er trimestre (avanzado)**: transporte, recursos naturales y
    problemáticas ambientales; nociones temporales y procesos históricos de
    Argentina; diversidad cultural, derechos y proyectos colectivos.

- 10 actividades por mundo, con variedad de formatos: opción múltiple,
  completar, ordenar, relacionar (unir pares), clasificar, verdadero/falso
  con justificación, detectar el error, y desafíos contrarreloj — no solo
  preguntas de opción múltiple.
- Sistema de medallas (Bronce/Plata/Oro) según mundos completados (suma
  mundos de ambas materias).
- Sistema de monedas 🪙: se ganan por respuesta correcta y por completar un
  mundo. En los mundos avanzados (2do y 3er trimestre), las monedas se usan
  para pedir una **pista** 💡 o activar la **lectura en voz alta** 🔊 de la
  consigna. En los mundos básicos (1er trimestre) la lectura en voz alta es
  gratis, pensada para que sea accesible también en grados más chicos.
- Códigos de acceso individuales por alumno (no requieren contraseña).
- Panel Docente protegido con clave de administrador, con:
  - **Alumnos**: dos bloques — "Alumnos de aula" (el curso original) y
    "Alumnos agregados" (los que se sumen después) — con su código,
    posibilidad de agregar o eliminar estudiantes.
  - **Habilitar Mundos**: activar/desactivar qué mundos pueden jugar los
    alumnos, agrupados por materia (🔢 Matemática / 📚 Lengua / 🔬 Ciencias
    Naturales / 🏛️ Ciencias Sociales).
  - **Registro y Fortalezas**: estadísticas por alumno (% de aciertos,
    tiempo jugado, mundos completados, fortalezas y contenidos a reforzar).

## Cómo correr el proyecto en tu computadora (opcional)

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. En desarrollo local, si no configurás las
variables de entorno de abajo, se usa una clave de administrador por
defecto: **docente2026**, y los datos se guardan en un archivo local
(`.data/db.json`) que no se sube a GitHub.

## Cómo desplegar en Vercel

1. Subí este proyecto a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com), "Add New" → "Project" → importá ese
   repositorio. Vercel detecta que es Next.js automáticamente.
3. Antes de desplegar (o después, en Settings → Environment Variables),
   agregá:
   - `ADMIN_PASSWORD`: la clave que vas a usar para entrar al Panel Docente
     (elegí una propia, no dejes la de desarrollo).
4. Hacé el primer deploy.
5. **Muy importante para que los datos persistan entre alumnos y
   dispositivos**: en el proyecto de Vercel, andá a la pestaña **Storage**
   → agregá una base de datos tipo **Upstash for Redis** (o "KV") desde el
   Marketplace (tiene un plan gratuito) → conectala a este proyecto. Eso
   crea automáticamente las variables `KV_REST_API_URL` y
   `KV_REST_API_TOKEN`.
6. Volvé a desplegar (Redeploy) para que tome esas variables nuevas.

Sin el paso 5, la app funciona pero los datos no se guardan de forma
confiable entre visitas (el almacenamiento de las funciones de Vercel es
temporal).

## Estructura

- `src/lib/worlds.ts` — definición de los 47 mundos (14 de Matemática, 12 de
  Lengua, 12 de Ciencias Naturales, 9 de Ciencias Sociales), cada uno con su
  `subject`.
- `src/lib/activities.ts` — generador de las 10 actividades de cada mundo.
- `src/lib/store.ts` — capa de persistencia (Upstash Redis o archivo local).
- `src/lib/data.ts` — alumnos, progreso y configuración de mundos.
- `src/app/student/*` — flujo del alumno (código de acceso, mapa, juego).
- `src/app/admin/*` — Panel Docente.
- `src/app/api/*` — endpoints usados por ambos flujos.
