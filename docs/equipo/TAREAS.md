# Tablero de tareas

Estados: `⏳ PENDIENTE` · `🔨 EN CURSO` · `✅ LISTA PARA REVISAR` · `🟢 UNIDA A MAIN`

| Id | Tarea | Asignada a | Estado |
|---|---|---|---|
| AG-01 | [Aula abierta de prueba para 3.º grado](./tareas/AG-01-aula-abierta.md) | Antigravity | 🟢 UNIDA A MAIN |
| CL-01 | Tienda de avatares y objetos (monedas) | Claude | 🟢 UNIDA A MAIN |
| CL-02 | 1.º grado: arquitectura por grado, materias, mundos, habilidades y progreso | Claude | 🔨 EN CURSO |
| AG-02 | 1.º grado: contenidos de Matemática, Ciencias Sociales y Ciencias Naturales (sobre la estructura de CL-02) | Antigravity | ⏳ ESPERA A CL-02 |

## Resúmenes de tareas terminadas

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
