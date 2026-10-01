# AG-01 · Aula abierta de prueba para 3.º grado

**Asignada a:** Antigravity · **Revisa:** Claude · **Pide:** Pedro (docente)

## Qué quiere Pedro

Un aula de 3.º grado **abierta**, en la que chicos de otras escuelas puedan
**inscribirse solos** para probar MundoTest26:

- **Cupo:** hasta **100** alumnos inscriptos en total.
- **Prueba de 30 días** desde que cada alumno se inscribe.
- **Al vencer**, el alumno ya no puede entrar a jugar (se le muestra una
  pantalla amable de despedida, no un error).
- **Valoración:** al terminar la prueba (con la última actividad realizada) se
  habilita un apartado para **valorar la experiencia**.
- Pedro, desde su panel, ve cuántos se inscribieron, quiénes siguen activos,
  cuántos vencieron y las valoraciones.

## Cómo funciona hoy la app (lo que hay que saber)

- **Alumnos:** `src/lib/data.ts` → `getStudents()`, `addStudent(name, type)`,
  `findStudentByCode(code)`. Tipo `Student` en `src/types/index.ts`
  (`code`, `name`, `type: "aula" | "agregado"`, `createdAt`, `birthday?`,
  `classroomId?`). El alumno entra con un **código** de 5 caracteres en
  `/student` (`src/app/student/page.tsx`), que llama a
  `GET /api/progress?code=…&lite=1`, y juega en `/student/play`.
- **Separación por aula:** los compañeros (buzón, pizarrón, competencia, conteo
  de compañeros en el mapa) se agrupan por `Student.classroomId`
  (`sameClassroom` / `classmatesOf` en `src/lib/data.ts`). Los alumnos del aula
  piloto no tienen `classroomId`.
- **Mundos habilitados:** `getEnabledWorldIdsFor(student)` en `src/lib/data.ts`
  (aula piloto → clave `worldsConfig`; aula de la plataforma → Supabase).
- **Almacenamiento:** `getJSON` / `setJSON` de `src/lib/store.ts`.
- **Panel docente de siempre:** `/admin` → `src/app/admin/dashboard/page.tsx`,
  con la contraseña `adminPassword` que se valida con `checkAdminPassword()` de
  `src/lib/auth.ts`. Los paneles de cada sección están en
  `src/components/admin/*` (mirá `NewsAdmin.tsx` o `CompetitionAdmin.tsx` como
  ejemplo).

## Qué hay que construir

### 1. Datos

- Constante del aula abierta: `OPEN_CLASSROOM_ID = "abierta-3"` (en un archivo
  nuevo, por ejemplo `src/lib/openClassroom.ts` para el servidor y
  `src/lib/openClassroomShared.ts` para tipos y constantes que use el navegador).
- Los alumnos inscriptos así se guardan con `type: "prueba"` (agregar
  `"prueba"` a `StudentType`) y `classroomId: "abierta-3"`, y además:
  `trialStartedAt` y `trialEndsAt` (ISO), que se agregan como campos opcionales
  a `Student`.
- Configuración (clave `openClassroomConfig`): `{ open: boolean, capacity: 100,
  trialDays: 30 }`. Por defecto `open: true`.
- Mundos del aula abierta: clave `worldsConfig:abierta-3`. Por defecto, los
  mismos mundos que tiene habilitados el aula piloto (`worldsConfig`). En
  `getEnabledWorldIdsFor` agregar el caso `classroomId === "abierta-3"` **antes**
  del caso de Supabase.
- Valoraciones (clave `openClassroomRatings`): lista de
  `{ code, at, stars: 1..5, liked: string[], comment?: string }`.

### 2. Inscripción: página pública `/prueba`

- Texto breve de presentación de MundoTest26 (sin cifras inventadas) y del
  período de prueba de 30 días.
- Formulario para que **lo complete un adulto** con el chico:
  - nombre de pila del alumno + inicial del apellido (no pedir apellido
    completo, ni email, ni teléfono, ni escuela obligatoria);
  - casilla obligatoria: «Soy la persona adulta responsable y acepto que
    use MundoTest26 durante 30 días de prueba»;
  - un campo trampa oculto (honeypot) contra bots.
- Al inscribirse: se crea el alumno y se muestra **su código** en grande, con
  la indicación «Guardalo: lo vas a necesitar para entrar» y un botón «Empezar
  a jugar» que lo deja logueado (igual que hace `/student`).
- Si el cupo de 100 está lleno o la inscripción está cerrada: mensaje amable
  («El aula de prueba está completa por ahora»).
- API: `POST /api/prueba/inscripcion`. Validar todo en el servidor: cupo,
  `open`, nombre (2–30 letras, sin caracteres raros), aceptación, honeypot.
  Límite simple anti-abuso: como máximo 5 inscripciones por IP por hora
  (guardar contador en el store con la hora).

### 3. Vencimiento de la prueba

- Cuando `now > trialEndsAt`, `GET /api/progress?code=…` responde
  `{ trialExpired: true, … }` con estado 403, y `/student` y `/student/play`
  muestran una pantalla de despedida: «¡Gracias por probar MundoTest26! Tu
  período de prueba terminó.» + el apartado de valoración (punto 4).
- Además, las rutas que guardan progreso (`/api/progress` POST,
  `/api/world-attempt`, `/api/weekend`, `/api/shop` (cuando exista), `/api/messages` POST,
  `/api/competition` POST) deben rechazar a un alumno de prueba vencido. Hacelo
  con **una** función de ayuda (`isTrialExpired(student)`) y una línea en cada
  ruta, sin reescribir las rutas.
- En el juego, mientras la prueba está activa, mostrar un cartel discreto
  «Prueba: te quedan N días» (sin cuenta regresiva que presione).

### 4. Valoración

- Se habilita cuando la prueba venció, **o** desde 3 días antes del vencimiento
  (para quienes no vuelvan a entrar), una sola vez por alumno.
- Pantalla simple, con lo que ya usa la app (`parchment-panel`, botones grandes):
  - «¿Te gustó MundoTest26?» → 1 a 5 estrellas grandes;
  - «¿Qué fue lo que más te gustó?» → chips para elegir (varios): Los mundos,
    Los avatares, La aventura del finde, Los duelos, Aprender jugando, Las
    monedas y la tienda;
  - «Comentario de la persona adulta (opcional)» → texto de hasta 300
    caracteres (es lo único de texto libre y lo escribe el adulto; limpiar
    caracteres de control).
- API: `POST /api/prueba/valoracion` (valida que sea alumno de prueba, que esté
  habilitado y que no haya valorado antes).

### 5. Panel docente (`/admin`)

Nuevo componente `src/components/admin/OpenClassroomAdmin.tsx`, agregado en
`src/app/admin/dashboard/page.tsx` debajo de `CompetitionAdmin`:

- inscriptos / cupo (ej. «37 / 100»), activos, vencidos;
- botón abrir/cerrar inscripción; poder cambiar el cupo;
- valoraciones: promedio de estrellas, cuántas por cada chip, y los
  comentarios (con fecha);
- enlace para copiar: `https://mundomat.vercel.app/prueba`.
- La lista de alumnos del aula piloto **no** debe mostrar a los de prueba
  (hoy `GET /api/students` ya filtra a los que tienen `classroomId`).

## Archivos

- **Nuevos (tuyos):** `src/app/prueba/**`, `src/app/api/prueba/**`,
  `src/lib/openClassroom*.ts`, `src/components/admin/OpenClassroomAdmin.tsx`,
  componentes nuevos que necesites en `src/components/prueba/`.
- **Podés tocar (cambios mínimos, solo agregar):** `src/types/index.ts`
  (`StudentType`, campos opcionales de `Student`), `src/lib/data.ts`
  (`getEnabledWorldIdsFor`), las rutas de la API listadas en el punto 3 (una
  línea cada una), `src/app/student/page.tsx` y `src/app/student/play/page.tsx`
  (pantalla de prueba vencida y cartel de días), `src/app/admin/dashboard/page.tsx`
  (agregar el componente), `src/app/page.tsx` (un enlace «Probar MundoTest26»).
- **No tocar:** `src/components/ShopModal.tsx`, `src/lib/platform/**`,
  `src/app/docente/**`, `supabase/**`, `src/lib/avatarFit.ts`,
  `public/theme/**` (Claude está trabajando ahí).

## Cómo comprobar que funciona

1. `npx tsc --noEmit`, `npx eslint src` y `npm run build` sin errores.
2. Con `npm run dev`, en `/prueba` inscribir un alumno → muestra el código →
   «Empezar a jugar» lleva a `/student/play` y puede jugar un mundo.
3. Cambiar a mano en `.data/db.json` su `trialEndsAt` a una fecha pasada →
   `/student` muestra la despedida y la valoración; las rutas del punto 3
   devuelven 403.
4. Valorar → en `/admin` se ve la valoración y los contadores.
5. Con el cupo en 1 y un alumno ya inscripto → la inscripción dice que está
   completa.
6. Un alumno del aula piloto sigue funcionando igual y **no** ve a los de
   prueba en el buzón, el pizarrón ni la competencia (y viceversa).

Al terminar: commit en la rama `antigravity`, actualizar `TAREAS.md` y escribir
el resumen. No hacer `git push`.
