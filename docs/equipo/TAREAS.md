# Tablero de tareas

Estados: `⏳ PENDIENTE` · `🔨 EN CURSO` · `✅ LISTA PARA REVISAR` · `🟢 UNIDA A MAIN`

| Id | Tarea | Asignada a | Estado |
|---|---|---|---|
| AG-01 | [Aula abierta de prueba para 3.º grado](./tareas/AG-01-aula-abierta.md) | Antigravity | 🟢 UNIDA A MAIN |
| CL-01 | Tienda de avatares y objetos (monedas) | Claude | 🟢 UNIDA A MAIN |
| CL-02 | 1.º grado: arquitectura por grado, materias, mundos, habilidades y progreso | Claude | 🟢 UNIDA A MAIN |
| AG-02 | [1.º grado: más variedad en Sociales y Naturales + fichas complementarias de 1.º](./tareas/AG-02-primer-grado.md) | Antigravity | ✅ LISTA PARA REVISAR |

## Resúmenes de tareas terminadas

### AG-02 · 1.º grado: más variedad en Sociales y Naturales + fichas complementarias de 1.º (Antigravity)
- **Variedad en Sociales y Naturales (1.º grado):**
  - Se agregaron helpers tipados en `src/lib/grade1/content/util.ts` (`makeOrder`, `makeClassify`, `makeStoryPick`, `makeMultiPick`) con ordenamientos desordenados con permutación matemáticamente exacta (`correctOrder = Array.from({length: n}, (_, k) => perm.indexOf(k))`), pistas que comienzan con «Pista: », habilidades del mundo y emojis compatibles (≤ Emoji 13).
  - Se crearon y exportaron `EXTRA_SOCIALES` (3 actividades extra por cada uno de los 18 mundos = 54 actividades: secuencias temporales, clasificaciones campo/ciudad, transporte, materiales y relatos históricos locales santacruceños) y `EXTRA_NATURALES` (3 actividades extra por cada uno de los 15 mundos = 45 actividades: etapas de crecimiento vegetal y animal, hábitats patagónicos, estados de la materia, seres vivos y no vivos, órganos y sentidos).
  - En `src/lib/grade1/content/index.ts`, `buildGrade1Activities` combina al azar 6 preguntas del banco tradicional con 2 actividades de la colección extra (8 en total por vuelta), asegurando IDs únicos, skills alineadas y variedad en cada intento.
  - Verificación exhaustiva: 96 mundos × 30 iteraciones (22.717 actividades generadas) con 0 errores de consistencia (opciones presentes, respuestas correctas válidas, sin IDs duplicados).
- **Fichas complementarias de 1.º grado (96 mundos):**
  - Contenido pedagógico diseñado específicamente para lectores emergentes: consignas breves para compartir en familia, actividades prácticas con objetos del hogar, observación directa y dibujo (sin emojis en el texto impreso, respetando `FORMATO.md`).
  - Archivos de datos: `scripts/fichas/primero-lengua.json` (39 mundos), `scripts/fichas/primero-matematica.json` (24 mundos), `scripts/fichas/primero-sociales.json` (18 mundos), `scripts/fichas/primero-naturales.json` (15 mundos), generados mediante scripts modulares en `scripts/fichas/data_*_1.py` y `build_primero_fichas.py`.
  - Generador PDF (`scripts/fichas/generar_fichas.py`): adaptado para leer mundos de 1.º desde `src/lib/grade1/worlds.ts`, resolución multiplataforma de fuentes tipográficas (Andika, Andika-Bold, Fredoka-Bold) y generación de 1 ficha por mundo (`private/fichas/mundo-<id>-1.pdf`). Se generaron las 96 fichas de 1.º grado (190 PDFs en total con 3.º), todas con 1 o 2 páginas exactas sin desbordes.
- **Acceso y visualización de fichas:**
  - En `src/lib/fichas.ts`, `fichaVersions(world)` retorna 1 para mundos de 1.º grado (`world.grade === 1 || world.id >= 10000`) y 2 para 3.º grado.
  - La API `/api/fichas/acceso` devuelve en la respuesta el `grade` del alumno validado.
  - `src/components/FichasGate.tsx` notifica el grado desbloqueado a través del callback `onUnlocked`.
  - En `/familias` (`src/app/familias/page.tsx` y `src/app/familias/FichasView.tsx`), la vista se adapta automáticamente al grado del alumno (mostrando tarjetas de 1.º grado con gradiente y emoji de materia, o islas ilustradas para 3.º grado), con pestañas para alternar entre grados y anclaje por hash `#mundo-<id>`.
  - En el mapa de 1.º grado (`src/app/student/play/page.tsx`), se reactivó el botón 📄 de fichas (`showFichas={!isTrialStudent}`) para todos los alumnos que no pertenezcan al aula abierta de prueba.
- **Control de calidad:**
  - `npx tsc --noEmit`: 0 errores.
  - `npx eslint src`: 0 errores / 0 advertencias.
  - `npm run build`: compilación de producción exitosa con Turbopack.

### AG-01 · Aula abierta de prueba para 3.º grado (Antigravity)
- **Modelos y tipos:** Se agregó `"prueba"` a `StudentType` y los campos opcionales `trialStartedAt` y `trialEndsAt` a `Student` en `src/types/index.ts`.
- **Lógica de aula abierta:** En `src/lib/openClassroomShared.ts` y `src/lib/openClassroom.ts` se definieron `OPEN_CLASSROOM_ID = "abierta-3"`, tipos de configuración y valoración, y funciones auxiliares (`isTrialExpired`, `getTrialDaysLeft`, `canRateTrial`, registro con límite de 5 por IP/hora y cupo de 100).
- **Mundos habilitados:** En `src/lib/data.ts` se incorporó el soporte para `worldsConfig:abierta-3` previo a la consulta a Supabase.
- **Inscripción pública:** Página `/prueba` (`src/app/prueba/page.tsx`) y API `POST /api/prueba/inscripcion` con validaciones de datos, honeypot, consentimiento de persona adulta, asignación de código único y enlace directo al juego.
- **Protección de rutas:** Se integró la verificación de prueba vencida (`isTrialExpired`) devolviendo estado 403 en `GET/POST /api/progress`, `POST /api/world-attempt`, `POST /api/weekend`, `POST /api/shop`, `POST /api/messages` y `POST /api/competition`.
- **Experiencia de juego y despedida:**
  - En `/student` y `/student/play`, cuando la prueba está vencida se muestra pantalla de despedida empática con formulario de valoración.
  - Durante la prueba activa en `/student/play`, se muestra un cartel discreto indicando los días restantes («Prueba: te quedan N días» o «último día») y opción para valorar anticipadamente en los últimos 3 días.
- **Valoración de la experiencia:** Componente `src/components/prueba/TrialRatingCard.tsx` (1 a 5 estrellas, selección de aspectos destacados y comentario opcional del adulto) y API `POST /api/prueba/valoracion`.
- **Panel docente:** Componente `src/components/admin/OpenClassroomAdmin.tsx` agregado en `src/app/admin/dashboard/page.tsx` debajo de `CompetitionAdmin`, con estadísticas de inscriptos/activos/vencidos, control de cupo y apertura, enlace para compartir y resumen detallado de valoraciones recibidas.
- **Acceso:** Se incorporó el botón «✨ Probar MundoTest26» en `src/app/page.tsx`.
- **Verificación:** Superadas exitosamente las pruebas de compilación (`next build`), chequeo de tipos (`tsc --noEmit`), linter (`eslint src`) y la suite completa de verificación de flujo y persistencia.

#### Revisión de Claude (AG-01) y arreglos al unir
- Probado con servidor y navegador: inscripción, cupo, cierre, límite por IP, vencimiento (403 en todas las rutas pedidas), valoración única, panel docente y separación del aula piloto. Todo OK.
- Arreglos hechos al unir:
  - La tarjeta de valoración consulta si el alumno ya valoró: si ya lo hizo muestra «Ya nos dejaste tu opinión» en lugar del formulario.
  - Las estrellas arrancan sin marcar (antes venían en 5) y hay que elegir para enviar; el «¡Gracias!» se ve un momento antes de cerrar.
  - `/api/profile` y `/api/spend-coins` también rechazan a un alumno con la prueba vencida.
  - El texto de despedida usa la duración real de la prueba de cada alumno (`getTrialLengthDays`), no «30 días» fijo.
  - Cartel «Prueba: te quedan N días» con margen en el celular.
  - Decisión de Pedro: en el aula abierta **no hay buzón ni duelos** (son chicos de distintas familias que no se conocen). `isOpenClassroomStudent()` apaga el buzón (GET vacío, POST 403) y la competencia (config `enabled: false`), y el mapa no muestra la entrada a la competencia.

#### Pedido de Pedro después de unir (aula abierta)
- **Límite de la prueba:** hasta 5 mundos superados por materia (`TRIAL_WORLDS_PER_SUBJECT`). Al llegar a 5 en una materia, solo se pueden repasar los ya superados (`/api/worlds` filtra; `/api/progress` y `/api/world-attempt` devuelven 403 `trialLimit`). La prueba termina a los 30 días **o** al superar los 5 mundos de cada materia (`trialEndedBy: "mundos"`).
- **Informe final y borrado:** al vencer, se guarda un informe (`trialReport:<código>`: mundos superados, % de aciertos por materia, fortalezas, qué reforzar con sugerencias) y se **borra el historial** (`progress:<código>`). Se hace la primera vez que el alumno vuelve a entrar o cuando el docente abre el panel (`closeExpiredTrials`). El informe se ve e imprime en la pantalla de despedida (`TrialReportCard`).
- **Fichas en PDF solo con código:** los PDF pasaron de `public/fichas` a `private/fichas` y se descargan por `/api/fichas/<archivo>` con una cookie que se obtiene con un código de alumno válido (`/api/fichas/acceso`). `/familias` pide el código (o usa el del alumno que ya entró). Un alumno de prueba vencido ya no descarga.
- **Fichas nuevas (complementarias):** las fichas ya no son la app en papel. Cada mundo tiene 2 fichas con propuestas para hacer con objetos de la casa, jugar en familia, investigar, conversar y crear, más una autoevaluación con caritas. Contenido en `scripts/fichas/<materia>.json`, se generan con `python3 scripts/fichas/generar_fichas.py` (formato en `scripts/fichas/FORMATO.md`). Los alumnos del aula de prueba no pueden descargarlas (ni ven el botón 📄 en el mapa).

### CL-02 · 1.º grado (Claude)
- Grados como configuración (`src/lib/grades.ts`): 1.º con 96 mundos propios (ids 11001+ Lengua, 12001+ Matemática, 13001+ Sociales, 14001+ Naturales), dominio 80% + repaso, y apertura por prerrequisitos (logrado o una vuelta con 60%). 3.º sigue igual (90%, ids 1–47).
- Alumno con `grade` (por defecto 3): se elige al agregarlo en `/admin` o se cambia desde Registro; en la plataforma lo da el aula.
- Actividades nuevas reutilizables: elegir (con audio y cuento), contar, armar con fichas y trazar; Lengua con palabras decodificables según las letras trabajadas; letra: nombre y sonido separados con audios grabables (`docs/primer-grado/AUDIOS.md`).
- Seguimiento por habilidad (`skillStats`), niveles sin iniciar → dominado, zonas de práctica automáticas en el mapa e informe docente «¿Qué sabe? / ¿Qué está aprendiendo? / ¿Dónde tiene dificultades? / ¿Qué debería practicar?».
- Para 1.º no se muestran todavía la aventura del finde, la competencia ni las fichas (son de 3.º).
