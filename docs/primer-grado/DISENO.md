# 1.º grado en MundoTest26 — diseño

## 1. Lo que había (análisis)

- **Grado implícito:** todo el juego era de 3.º. Los 47 mundos están en
  `src/lib/worlds.ts` (`WORLDS`, ids 1–47) y sus actividades se generan con
  una función por categoría en `src/lib/activities.ts`
  (`buildActivitiesForWorld`). No había campo de grado en mundos ni alumnos.
- **Progreso:** `StudentProgress.completedWorlds` (ids), registro de
  respuestas (`activityLog`), regla de dominio de 90% + una vuelta de refuerzo
  (`applyWorldAttempt`). No había seguimiento por habilidad.
- **Mundos habilitados:** los elige el docente (`worldsConfig` / aula en la
  plataforma). No había prerrequisitos entre mundos.
- **Actividades reutilizables:** opción múltiple, número, ordenar, unir,
  clasificar, verdadero/falso, contrarreloj y figuras. Todas basadas en
  leer. Sin audio propio (solo lectura en voz alta con el sintetizador).

## 2. Qué se agrega (sin romper 3.º)

### Grados como configuración (`src/lib/grades.ts`)

Cada grado es un registro: `{ grade, label, worlds, skills, masteryPct }`.
3.º sigue usando `WORLDS` tal cual (`grade` 3 por defecto). 1.º agrega su
propio catálogo. Para sumar 2.º, 4.º… se agrega otro registro: no hay que
tocar el mapa, el panel ni el progreso.

- Los ids de mundo de cada grado viven en su propio rango (1.º: 1001+), así
  el progreso guardado nunca se mezcla.
- El alumno tiene `grade` (por defecto 3). En la plataforma lo toma del aula.
- **No hay un número fijo de mundos**: salen del catálogo de cada materia.

### Mundo (extensión de `WorldDef`, todo opcional)

`grade`, `worldNumber`, `objective`, `contents` (contenidos curriculares),
`skills` (habilidades que trabaja), `prerequisites` (mundos previos),
`difficultyVars` (variables pedagógicas: cantidad de elementos, de opciones,
apoyo de imagen/audio, complejidad, pasos, memoria, autonomía), `kind`
(`normal` · `refuerzo` · `integracion`), `assessment` y `activityCount`.

### Habilidades y dominio

- Catálogo de habilidades por materia (`src/lib/grade1/skills.ts`), p. ej.
  Lengua: oralidad, escucha, rimas, sílabas, sonido inicial, vocales,
  grafema–fonema, lectura de sílabas, de palabras, de oraciones, comprensión
  oral, comprensión lectora, escritura, literatura.
- Cada actividad indica qué habilidades trabaja. Cada respuesta suma a
  `StudentProgress.skillStats[skill]` (aciertos, errores y las últimas 10).
- Nivel por habilidad: **sin iniciar → iniciando → aprendiendo →
  practicando → dominado** (no es una nota: describe la práctica en la app).
- Estado de cada mundo para el docente: iniciado · en aprendizaje · logrado ·
  necesita refuerzo.

### Progresión sin bloqueos permanentes

- Un mundo se abre cuando sus prerrequisitos están **logrados o con una
  vuelta de 60% o más**: un error no bloquea, se puede repetir sin límite.
- En 1.º el dominio es 80% (en 3.º sigue 90%) + una vuelta de repaso.
- **Zonas de práctica automáticas:** si una habilidad queda en
  "aprendiendo" después de varios intentos, aparece en el mapa
  "🎯 Zona de práctica: …" con actividades de esa habilidad (no cuentan como
  mundo, solo como práctica).

### Actividades nuevas (reutilizables, por configuración)

| Tipo | Para qué |
|---|---|
| `pick` | Elegir entre tarjetas con dibujo/letra/palabra, con audio en la consigna y en cada opción (escuchar y elegir, sonido inicial, rimas, imágenes, comprensión). |
| `count` | Contar objetos dibujados y elegir el número. |
| `build` | Armar con fichas (sílabas o letras móviles) una palabra o un número. |
| `trace` | Repasar con el dedo una letra o un número punteado. |
| `story` | Escuchar un cuento/poema (texto + escenas) y responder. |
| (existentes) | `order` (secuencias), `match` (unir), `classify`, `true-false`, `mc`. |

Todas aceptan `skills`, `say` (texto para escuchar) y `audio` (archivo).

### Audio

`src/lib/grade1/letters.ts` guarda por letra: **nombre** («eme»),
**fonema** (/m/), palabras de ejemplo con dibujo y rutas de audio
(`/audio/letras/m_nombre.mp3`, `/audio/letras/m_fonema.mp3`). El reproductor
(`src/lib/audio.ts`) usa el archivo grabado si existe y, si no, el
sintetizador con una pronunciación de respaldo (para el fonema: «mmm…, como
en mamá»). Así se pueden grabar audios humanos de a poco, sin tocar código.
La lista de audios esperados está en `docs/primer-grado/AUDIOS.md`.

### Lectura adaptada a lo enseñado

Cada mundo de letras declara las letras ya trabajadas. Las actividades de
lectura eligen del banco de palabras solo las que se pueden leer con esas
letras (palabras «decodificables»). Las palabras con letras no enseñadas solo
aparecen en actividades marcadas como exploratorias.

## 3. Materias y mundos

La cantidad de mundos sale de la progresión de cada materia (ver
`src/lib/grade1/worlds.ts`):

- **Lengua (39):** oralidad y escucha → conciencia fonológica (sonidos,
  palabras largas/cortas, sílabas, rimas, sílaba inicial/final, sonido
  inicial) → nombre propio → vocales → consonantes en orden de enseñanza
  (M, P, L, S, T, N, D, R, C, F/B/V, G, Ñ/J/LL y exploración del resto) →
  armado y lectura de palabras, oraciones y textos breves → literatura
  (cuentos, poemas, coplas, rondas, adivinanzas, secuencias) → escritura
  (trazos, letras móviles, listas, títulos, epígrafes, mensajes,
  invitaciones).
- **Matemática (24):** cantidades → conteo → números hasta 10, 30 y 100 →
  comparación → anterior/posterior → recta numérica → composición del 10 →
  agregar/juntar → quitar → cálculo mental inicial → dinero → patrones →
  clasificación → posiciones → recorridos → figuras → cuerpos → longitudes
  → tiempo.
- **Ciencias Sociales (18)** y **Ciencias Naturales (15):** de lo cercano a
  lo más amplio (identidad, familia, escuela, convivencia, derechos, barrio,
  trabajos, antes/ahora, tiempo, mapas, lugares, fiestas, efemérides, formas
  de vida · seres vivos, animales, ambientes, plantas, necesidades, cuerpo,
  cuidado, alimentación, materiales, propiedades, agua y aire, cielo,
  estaciones, ambiente).

## 4. Docente

- Panel de siempre: al agregar un alumno se elige el grado; «Registro y
  fortalezas» muestra, para 1.º, el estado por materia y por habilidad
  (🟢 dominado · 🟡 en proceso · 🔴 necesita refuerzo) con «¿Qué sabe? ¿Qué
  está aprendiendo? ¿Dónde tiene dificultades? ¿Qué practicar?».
- Habilitar mundos por grado.
- Plataforma (`/docente`): el aula de 1.º usa los mundos de 1.º y el
  historial guarda las habilidades de cada respuesta.

## 5. Fuente curricular

Los cuatro catálogos siguen los contenidos de 1.º de los Diseños Curriculares
de Santa Cruz (Lengua, Matemática, Ciencias Sociales y Ciencias Naturales) que
Pedro compartió.

## 6. Dónde está cada cosa

- Catálogo de mundos: `src/lib/grade1/worlds.ts` · habilidades: `skills.ts` ·
  letras y audios: `letters.ts` · banco de palabras: `words.ts`.
- Actividades: `src/lib/grade1/content/` (`lengua.ts` y `matematica.ts` se
  generan con palabras/números al azar; `sociales.ts` y `naturales.ts` son
  bancos de 10 preguntas por mundo, se juegan 8 por vuelta).
- Zonas de práctica: `src/lib/grade1/practice.ts` · registro de grados y
  prerrequisitos: `src/lib/grades.ts`.
- Componentes nuevos: `src/components/activities/{Pick,Count,Build,Trace}Activity.tsx`.
- Informe por habilidad: `src/components/admin/SkillReport.tsx` (en `/admin` →
  Registro, y en el legajo de `/docente`).
- Mundos habilitados de 1.º del aula piloto: clave `worldsConfig:g1` (por
  defecto, todos). En la plataforma, el aula de 1.º usa sus propios mundos.
