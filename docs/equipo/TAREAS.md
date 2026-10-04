# Tablero de tareas

Estados: `⏳ PENDIENTE` · `🔨 EN CURSO` · `✅ LISTA PARA REVISAR` · `🟢 UNIDA A MAIN`

| Id | Tarea | Asignada a | Estado |
|---|---|---|---|
| AG-01 | [Aula abierta de prueba para 3.º grado](./tareas/AG-01-aula-abierta.md) | Antigravity | 🟢 UNIDA A MAIN |
| CL-01 | Tienda de avatares y objetos (monedas) | Claude | 🟢 UNIDA A MAIN |
| CL-02 | 1.º grado: arquitectura por grado, materias, mundos, habilidades y progreso | Claude | 🟢 UNIDA A MAIN |
| AG-02 | [1.º grado: más variedad en Sociales y Naturales + fichas complementarias de 1.º](./tareas/AG-02-primer-grado.md) | Antigravity | 🟢 UNIDA A MAIN |
| AG-03 | [2.º grado completo (mundos, actividades, habilidades, ambiente «bosque de lengas» e imágenes, fichas)](./tareas/AG-03-segundo-grado.md) | Antigravity | 🟢 UNIDA A MAIN |
| CL-03 | Imágenes de 1.º (ambiente «costa patagónica»), ambientes por grado y avatares de Halloween | Claude | 🟢 UNIDA A MAIN |
| CL-04 | Cuentos en 1.º, 2.º y 3.º: 19 cuentos ilustrados, un mundo de comprensión cada 3 en Lengua | Claude | 🟢 UNIDA A MAIN |
| AG-04 | [Comprensión lectora 2.º y 3.º (preguntas por grado), fichas de los cuentos y más variedad en 2.º](./tareas/AG-04-comprension-lectora.md) | Antigravity | 🟢 UNIDA A MAIN |
| AG-05 | [Ajustes de comprensión: lenguaje de 3.º y opciones parejas](./tareas/AG-05-ajustes-comprension.md) | Antigravity | 🟢 UNIDA A MAIN |
| AG-06 | [Textos más largos por grado y dictados de números y palabras (2.º y 3.º), mundo especial semana por medio](./tareas/AG-06-dictados-y-textos.md) | Antigravity | 🟢 UNIDA A MAIN |
| CL-08 | Lectura en voz alta paga en 3.º (5 🪙), textos por grado (`escenasDe`), música original y voces de los cuentos | Claude | 🟢 UNIDA A MAIN |
| CL-09 | Retomar el mundo donde se dejó, tienda por tiempo limitado con contador, revisión de AG-06 | Claude | 🟢 UNIDA A MAIN |
| AG-07 | [Privacidad: nombre visible, datos sensibles y límite de intentos en códigos](./tareas/AG-07-privacidad.md) | Antigravity | ✅ LISTA PARA REVISAR |
| AG-08 | [Resumen del curso: grilla por alumno, métricas y «a quién ayudar primero»](./tareas/AG-08-resumen-del-curso.md) | Antigravity | ✅ LISTA PARA REVISAR |
| AG-09 | [Mapeo curricular Santa Cruz (con validación docente)](./tareas/AG-09-curriculo.md) | Antigravity | ✅ LISTA PARA REVISAR |
| AG-10 | [Reportes: informe a la familia (imprimible) y del curso (PDF/CSV)](./tareas/AG-10-reportes.md) | Antigravity | ⏳ PENDIENTE (después de AG-06, en orden; leer antes [reglas comunes](./tareas/_COMUN-mejoras-panel.md)) |
| AG-11 | [Actividad, rachas, alertas y evolución](./tareas/AG-11-actividad-y-alertas.md) | Antigravity | ⏳ PENDIENTE (después de AG-06, en orden; leer antes [reglas comunes](./tareas/_COMUN-mejoras-panel.md)) |
| AG-12 | [Vista de dirección y planes (Piloto/Escuela/Distrito), sin cobros](./tareas/AG-12-escuelas-y-planes.md) | Antigravity | ⏳ PENDIENTE (después de AG-06, en orden; leer antes [reglas comunes](./tareas/_COMUN-mejoras-panel.md)) |
| CL-07 | Cuento → leyenda → fábula en los mundos de comprensión, 6 leyendas nuevas (Santa Cruz y Argentina) y lectura en diapositivas | Claude | 🟢 UNIDA A MAIN |
| CL-06 | Imágenes ilustradas de 2.º (islas y mapas «bosque de lengas») e islas de los cuentos | Claude | 🟢 UNIDA A MAIN |

## Resúmenes de tareas terminadas

### AG-09 · Mapeo curricular Santa Cruz con validación docente (Antigravity)
- **1. Qué se cambió y archivos modificados:**
  - **Mapeo curricular estructurado e independiente del código (`src/lib/curriculo/`):**
    - `src/lib/curriculo/santa-cruz.json`: 289 entradas correspondientes a la totalidad de mundos del catálogo (1.º, 2.º, 3.º grado, mundos canónicos de comprensión lectora 11101..11119, 21101..21119, 31101..31106 y mundos de dictado semanal 28001, 38001).
      - Cada entrada contiene: `area`, `eje`, `contenido`, `fuente` (con citas precisas del Diseño Curricular de Educación Primaria - Primer Ciclo de Santa Cruz, páginas 26 a 97 según área y grado) y `"validado": false` por defecto.
    - `src/lib/curriculo/nap.json`: 289 entradas mapeadas a los Núcleos de Aprendizajes Prioritarios nacionales (1.er Ciclo EGB / Primaria).
    - `src/lib/curriculo/index.ts`: módulo de gestión curricular con soporte multi-marco (`santa-cruz` por defecto, alternable a `nap`), resolución por número o string, y función de mezcla con validaciones del docente.
  - **Persistencia de validaciones docentes en store sin mutar archivos JSON (`src/lib/data.ts`, `src/app/api/curriculum/route.ts`):**
    - Métodos `getValidatedCurriculumWorldIds()` y `validateCurriculumWorld(worldId, validated)` en el almacén de datos (Upstash Redis / local fallback `curriculum_validated_worlds`).
    - Endpoint API `GET /api/curriculum` y `POST /api/curriculum` protegido con contraseña docente para validar o invalidar mundos.
  - **Visualización en el Panel Docente (`src/app/admin/dashboard/page.tsx`, `src/components/admin/CourseSummary.tsx`):**
    - En **Habilitar Mundos (`tab === "mundos"`)**:
      - Banner superior de selección de marco curricular de referencia (`Santa Cruz (1.er Ciclo)` vs. `Nacional (NAP)`).
      - Componente unificado `AdminWorldCard` para 1.º, 2.º y 3.º grado con visualización de área y eje, tooltip completo con contenido y fuente curricular, y estado de validación (`✅ Validado` o `⚠️ Pendiente de validar`).
      - Botón interactivo «Revisé este dato» que permite a los docentes confirmar la correspondencia curricular y guardarla inmediatamente.
    - En **Resumen del curso (`src/components/admin/CourseSummary.tsx`)**:
      - Integración de área y eje en los encabezados y celdas individuales con advertencia `⚠️ Propuesta pedagógica pendiente de validación docente`.
    - En **Registro y Fortalezas (`tab === "registro"`)**:
      - Formato curricular estandarizado («Nombre · Área · Eje») en mundos con bajo desempeño, a un repaso de completar, contenidos todavía no trabajados, fortalezas y debilidades.
  - **Script generador (`scripts/curriculo/generate-curriculo.ts`) y script de pruebas (`scripts/test-curriculo.ts`):**
    - Generación y verificación automatizada de integridad curricular.
- **2. Cómo se probó:**
  - `npx tsx scripts/test-curriculo.ts`: 100% aprobado. Verifica los 289 mundos en ambos marcos (Santa Cruz y NAP), comprueba que ninguna entrada esté vacía ni falte, valida que `validado` sea `false` en los archivos JSON y comprueba el ciclo completo de validación y desvalidación en el store.
  - `npx tsx scripts/test-resumen.ts`: suite de AG-08 verificada sin regresiones.
  - `npx tsx scripts/test-privacidad.ts`: suite de AG-07 verificada sin regresiones.
  - `npx tsc --noEmit`: 0 errores de TypeScript.
  - `npx eslint src`: 0 advertencias y 0 errores de linter.
  - `npm run build`: compilación de producción exitosa con Next.js 16.3.5 Turbopack.
- **3. Decisiones pendientes para Pedro:**
  - Revisar una muestra representativa de mundos en `/admin` (pestaña «Habilitar Mundos») y hacer clic en «Revisé este dato» para validar los contenidos asignados según el plan de clases real de su escuela.

### AG-08 · Resumen del curso: grilla por alumno, métricas y «a quién ayudar primero» (Antigravity)
- **1. Qué se cambió y archivos modificados:**
  - **Pestaña nueva «📋 Resumen del curso» en `/admin` (`src/app/admin/dashboard/page.tsx`, `src/components/admin/CourseSummary.tsx`, `src/lib/courseSummary.ts`):**
    - **Grilla de desempeño integral:**
      - Filas: todos los alumnos del curso en orden alfabético mostrando su **nombre completo** (regla de privacidad: en el panel docente se usa el nombre completo). La columna del alumno es fija (`sticky`) para navegación fluida en dispositivos móviles.
      - Columnas: agrupadas por materia (con `SubjectBadge`, emoji y etiqueta), mostrando cada mundo habilitado con su emoji y número/nombre corto.
      - Estados y colores: 🟩 Dominado (≥ 90% en 3.º, ≥ 85% en 2.º, ≥ 80% en 1.º) · 🟨 En progreso (50–89%) · 🟥 Requiere ayuda (< 50%) · ⬜ No jugado.
      - Cada celda muestra el mejor puntaje obtenido y cuenta con `title` detallado (ej. «Ana: 72 % en 2 vueltas (umbral de dominio: 90%)»).
      - Filtros integrados: selector por materia («Todas las materias», «Matemática», «Lengua», etc.) y filtro por grado (3.º, 2.º, 1.º o Todos).
      - Scroll horizontal responsivo para celulares y pantallas pequeñas.
      - Al hacer clic en un alumno se abre directamente su registro y estadísticas completas.
    - **Métricas globales arriba:**
      - Precisión global: promedio real de respuestas correctas del aula en base al total de actividades resueltas.
      - Actividad semanal: cantidad y porcentaje de alumnos con al menos una actividad registrada en los últimos 7 días.
      - Mundos más difíciles: ranking de los 3 mundos con menor puntaje promedio (exigiendo un mínimo representativo de 3 alumnos).
    - **Indicador pedagógico «🎯 A quién ayudar primero»:**
      - Lista priorizada y ordenada de alumnos que requieren intervención urgente, calculada por cantidad de mundos con puntaje < 50% y días de inactividad (≥ 7 días o sin ingresos).
      - Muestra el motivo exacto («3 mundos en rojo», «No juega hace 9 días», «Sin actividad registrada») y los mundos afectados.
      - Acceso directo con un clic a su ficha individual.
  - **Rendimiento de carga en una sola consulta (`src/app/api/students/route.ts`):**
    - Se agregó el parámetro `withProgress=true` a `GET /api/students`, permitiendo obtener todos los alumnos y sus registros de progreso mediante `getProgressMany` en un solo viaje de ida y vuelta a la base de datos (0 llamadas individuales por alumno).
  - **Persistencia de mejor puntaje (`src/types/index.ts`, `src/lib/progressLogic.ts`):**
    - Se agregó `bestWorldScore?: Record<number, number>` a `StudentProgress` para almacenar de forma retrocompatible y registrar en cada `applyWorldAttempt` el puntaje más alto obtenido por el estudiante.
  - **Clarificación de rótulos en «Registro y Fortalezas» (`src/app/admin/dashboard/page.tsx`):**
    - «🌱 Mundos a tratar» se renombró a **«🌱 Mundos jugados con bajo desempeño»** con el texto de ayuda explicativo: «Mundos que el alumno ya jugó pero todavía no llegó al X %. Conviene repasarlos.».
    - «📌 Contenidos a fortalecer» se reemplazó por **«📌 Contenidos todavía no trabajados»** con el cálculo exacto de mundos habilitados del programa que el alumno aún no inició, acompañado del texto de ayuda: «Mundos habilitados del programa que el alumno todavía no empezó a jugar.».
    - Se conservó además el apartado **«💪 Fortalezas (precisión ≥ 80%)»** y una alerta diferenciada **«⚠️ Contenidos con precisión menor al 50%»** para mundos con baja precisión acumulada.

- **2. Cómo se probó:**
  - `scripts/test-resumen.ts`: suite automatizada que valida:
    - Umbrales pedagógicos por grado (80% en 1.º, 85% en 2.º, 90% en 3.º).
    - Estados por celda (unplayed, mastered, in_progress, needs_help) y conteo de vueltas.
    - Cálculo matemático independiente de precisión global, actividad de los últimos 7 días y filtro de mundos más difíciles (≥ 3 alumnos).
    - Priorización de «A quién ayudar primero» ordenando por mundos en rojo e inactividad.
    - Verificación manual cruzada de 3 alumnos del aula piloto real (`.data/db.json`), comprobando coherencia entre mundos completados y la grilla.
  - `scripts/test-privacidad.ts`: 100% aprobado.
  - `scripts/test-vuelta.ts`: 100% aprobado.
  - `scripts/test-dictado.ts`: 100% aprobado.
  - `scripts/test-cuentos.ts`: 100% aprobado.
  - `scripts/test-simulation.ts`: 119 mundos × 40 iteraciones (38.840 actividades): 0 errores.
  - `npx tsc --noEmit`: 0 errores de tipado.
  - `npx eslint src`: 0 advertencias, 0 errores.
  - `npm run build`: compilación de producción exitosa con Next.js 16.3.5 Turbopack.

- **3. Decisiones pendientes para que revise Pedro:**
  - **Pestaña por defecto en `/admin`:** Se configuró «📋 Resumen del curso» como la pestaña predeterminada al ingresar al panel docente, ya que ofrece una visión panorámica inmediata de toda la clase. Si Pedro prefiere que siga abriendo por defecto en «👥 Alumnos», se puede conmutar el estado inicial en una línea.
  - **Criterio de umbral para mundos difíciles:** Se estableció el umbral mínimo en 3 alumnos para que un mundo entre al ranking de dificultad (evitando que el intento aislado de un solo alumno sesgue la métrica). Pedro puede ajustar este valor según el tamaño promedio esperado de las aulas.

### CL-09 · Retomar mundos, tienda por tiempo limitado y revisión de AG-06 (Claude)
- **Retomar donde se dejó** (`src/lib/vuelta.ts`, `/api/round`): al empezar una vuelta se guardan sus actividades en el servidor (`roundsInProgress`, fuera de la versión liviana) y cada respuesta avanza el índice (`roundId` en `/api/progress`). Si el alumno sale y vuelve, sigue desde la primera que le falta, con las mismas actividades, en cualquier dispositivo. En el mapa: «👣 Seguí 3/10». Sin «empezar de nuevo» (no se puede borrar una vuelta mala). Vence a los 14 días; la del dictado, al cambiar la semana; máximo 8 mundos a medias. Pruebas: `scripts/test-vuelta.ts`.
- **Tienda por tiempo limitado** (`src/lib/tiempo-limitado.ts`): avatares y objetos con `season` se compran solo durante su festividad (validado en el servidor). La tienda muestra cada festividad con contador («Quedan 30 días (hasta el 2/11)», «¡Último día!») y lo que llega en los próximos 21 días como «Próximamente». Junto a las monedas, aviso «⏳🎃 30 días». Lo comprado queda para siempre.
- 8 objetos nuevos: Halloween (sombrero de brujita, antifaz de murciélago, corbatín de calabaza), Tradición (sombrero de paisano, vincha tejida pampa), Navidad (vincha de reno, lentes de copos, corbatín navideño). `fitLike` en `AccessoryDef`: se ubican como un objeto de la misma forma (sin regenerar `avatarFit.ts`).
- Lápiz dorado ✏️ (imagen y ubicación) y visible en «Colección de temporada» del perfil cuando se gana. Arreglados los agujeros transparentes del corbatín a lunares.
- **Revisión AG-06**: unida a main. Ajustes: el premio del dictado solo se acredita en semana de dictado, la vuelta siempre cuenta 10 (no se confía en el total del navegador), errores acotados; la semana y el nivel del dictado se calculan en hora argentina (servidor en UTC y navegador cambian juntos).
- Pendiente: islas propias del Mundo del Dictado (por ahora usa la de práctica) y voces Kokoro de los textos largos de 2.º y 3.º.

### AG-07 · Privacidad de menores: nombre visible, datos sensibles y límite de intentos (Antigravity)
- **1. Qué se cambió y archivos modificados:**
  - **Nombre para mostrar y desambiguación (`src/lib/studentNames.ts`, `src/types/index.ts`):**
    - Se agregó el campo opcional `displayName?: string` a la interfaz `Student`.
    - Se implementó `proposeDisplayName(fullName)`: deduce el nombre de pila contemplando partículas compuestas («De Urquiza Iñaki» → «Iñaki», «Garcia Maite» → «Maite», «Lorenzo Daniel Perez Veron» → «Lorenzo»).
    - Se implementó `resolveDisplayNames(students)`: calcula al vuelo la desambiguación con inicial de apellido si hay colisiones en el mismo curso (ej. «Santiago S.» y «Santiago R.»; «Agustina A.» y «Agustina R.»). No pisa ni altera el valor original almacenado.
  - **Privacidad en todas las vistas y APIs de alumnos:**
    - `src/lib/news.ts`: `displayName()` nunca devuelve el nombre completo ni apellido. Usa el apodo de juego si existe, luego el `displayName` confirmado o la propuesta segura.
    - `/api/messages`, `/api/news`, `/api/competition`: emplean `resolveDisplayNames` y filtran el objeto compañero para no exponer apellidos completos ni datos sensibles (`name` contiene solo el nombre visible resuelto; en `/api/news`, `age: null` para no revelar la edad/año a compañeros).
    - `/api/progress`: en modo `lite=1` (usado por el cliente del alumno) anonimiza el nombre completo devolviendo solo el `displayName` o propuesta.
    - `src/components/NewsBoard.tsx`: eliminado el renderizado de la edad `(age)`. Solo muestra «🎂 {name} cumple años hoy. ¡Saludalo!».
  - **Gestión docente y migración de existentes:**
    - `src/app/admin/dashboard/page.tsx`:
      - Formulario de alta con campo de «Visible:» auto-propuesto y editable.
      - Cartel interactivo de migración «Confirmá cómo se muestra el nombre de cada alumno» para revisar y confirmar en lote los nombres propuestos de alumnos existentes vía `PATCH /api/students` (`updates: [...]`).
    - `src/components/admin/StudentBlock.tsx`: editor en línea de `displayName` para cada alumno. Corrección del selector de fecha: eliminado el valor hardcodeado `2018-` que anteponía el año 2018 a fechas `MM-DD`.
    - `src/app/docente/aula/page.tsx`: formulario de inscripción con propuesta y edición de `nickname` (columna nativa de Supabase).
    - `src/app/docente/alumno/page.tsx`: detalle del alumno con visualización y edición en vivo del nombre visible en el juego.
  - **Control de intentos y rate limiting (`src/lib/rateLimit.ts`):**
    - Sistema de rate limiting por IP: máximo 8 intentos fallidos de código en una ventana de 10 minutos. Al 8.º fallo, la IP queda bloqueada por 10 minutos con mensaje amable («Demasiados intentos fallidos. Esperá unos minutos y probá de nuevo.»).
    - Integrado en `/api/progress`, `/api/messages`, `/api/competition`, `/api/world-attempt`, `/api/worlds` y `/api/weekend`.
  - **Aislamiento de aulas y aula abierta (`src/lib/data.ts`):**
    - `sameClassroom(a, b)`: garantiza que los alumnos del aula abierta pública (`OPEN_CLASSROOM_ID`) nunca sean considerados compañeros entre sí ni de otras aulas, asegurando aislamiento total entre familias independientes.
  - **Script de limpieza de fechas (`scripts/privacidad/limpiar-fechas.ts`):**
    - Inspecciona el store, reporta fechas anómalas (como `2018-10-04` o fechas idénticas repetidas en ≥3 alumnos) y permite limpiarlas con `--aplicar`.

- **2. Cómo se probó:**
  - `scripts/test-privacidad.ts`: suite completa de 5 bloques probando `proposeDisplayName`, resolución de duplicados con iniciales de apellido, anonimización en `displayName()`, bloqueo de IP al 8.º intento fallido con reset, y aislamiento de `sameClassroom`.
  - `scripts/privacidad/limpiar-fechas.ts`: ejecutado en simulación sobre los 22 alumnos reales del aula piloto.
  - `npx tsx scripts/test-dictado.ts`: 100% aprobado.
  - `npx tsx scripts/test-cuentos.ts`: 100% aprobado.
  - `npx tsx scripts/test-simulation.ts`: 119 mundos × 40 iteraciones (38.840 actividades): 0 errores.
  - `npx tsc --noEmit`: 0 errores de tipado.
  - `npx eslint src`: 0 advertencias, 0 errores.
  - `npm run build`: compilación de producción Next.js 16.3.5 Turbopack exitosa.

- **3. Decisiones pendientes para que revise Pedro:**
  - **¿Fecha completa o solo día y mes?:** Actualmente el sistema tolera tanto `AAAA-MM-DD` como `MM-DD`. En las vistas de alumnos ya no se expone el año ni la edad (solo «🎂 hoy cumple años»). Queda a decisión de Pedro si prefiere que el docente cargue únicamente día y mes (`MM-DD`) en el formulario para no almacenar el año de nacimiento de los menores.
  - **Texto del aviso de confirmación de nombres:** Se implementó «Confirmá cómo se muestra el nombre de cada alumno» con explicación de privacidad. Pedro puede ajustar la redacción final si prefiere otro tono.

### AG-06 · Textos más largos por grado y dictados de números y palabras (Antigravity)
- **Parte A: Textos más largos por grado:**
  - 2.º grado (`src/lib/cuentos/textos-g2.ts`): los 19 cuentos y leyendas adaptados a 40–60 palabras por escena (~300 palabras totales por cuento), promedio 49.4 palabras/escena, respetando las 6 escenas ilustradas canónicas y desenlaces tiernos.
  - 3.º grado (`src/lib/cuentos/textos-g3.ts`): los 6 cuentos ampliados a 60–90 palabras por escena (~450 palabras totales por cuento), promedio 70.2 palabras/escena, con oraciones subordinadas accesibles, descripciones de época y mayor desarrollo narrativo.
  - Validado en `scripts/test-cuentos.ts`: 100% de las escenas en rango exacto en ambos grados.
- **Parte B: Actividad de dictado y presencia en mundos comunes:**
  - Nuevo tipo `type: "dictation"` en `ActivitySpec` (`src/lib/activities.ts`).
  - Componente `src/components/activities/DictationActivity.tsx`: botón grande de audio `🔊 Escuchar` (gratuito, autoplay al montar, rate 0.85 con SpeechSynthesis y fallback TTS), input numérico sin solución a la vista para números e input de texto para palabras y oraciones.
  - Módulo de conversión en letras `src/lib/dictado/numero-letras.ts`: conversión precisa de 0 a 99.999 en español rioplatense («doscientos», «mil veinticuatro», «veintiuno», etc.).
  - Evaluación pedagógica en `src/lib/dictado/evaluacion.ts`: números toleran puntos de mil y espacios; en 2.º grado tildes opcionales con aviso formativo («¡Bien! Te faltó la tilde...»), en 3.º tildes obligatorias; oraciones exigen mayúscula inicial y punto final en 2.º, y signos dobles (`¿?`, `¡!`) y comas en 3.º, indicando la posición exacta del error.
  - Banco progresivo por mes escolar (mes 1, 2, 3) en `src/lib/dictado/banco.ts`.
  - Inclusión de 1–2 dictados por ronda en mundos comunes de 2.º grado (Matemática mundos 1 y 5; Lengua mundos 15 a 23 con habilidades `m2-num-dictado`, `l2-dictado-palabra`, `l2-dictado-oracion`) y 3.º grado (`buildNumerosActivities` y `buildFormacionPalabrasActivities`).
- **Parte C: Mundo especial del Dictado (semana por medio) y reportes docentes:**
  - Mundos especiales 28001 (2.º grado) y 38001 (3.º grado) generados dinámicamente con `getMundoDictado`: 10 dictados por ronda (5 números + 5 palabras/oraciones balanceadas y sin repetición).
  - Activo únicamente en semanas ISO pares (`esSemanaDeDictado`). En semanas impares, la isla permanece deshabilitada con el mensaje «Vuelve el lunes de la semana que viene».
  - Acreditación en servidor (`src/lib/data.ts` y `/api/world-attempt`): recompensa de +20 🪙 y accesorio exclusivo «Lápiz dorado» ✏️ (`lapiz-dorado` en catálogo `premio`) si el estudiante alcanza 100% de aciertos en su **primer intento** de la semana.
  - Reporte pedagógico docente en `/admin` (dashboard) y `/docente/alumno`: visualización del rendimiento semanal (puntaje %, estado del premio Lápiz Dorado y lista detallada de errores cometidos) para intervención personalizada.
- **Verificación integral:**
  - `scripts/test-dictado.ts`: 100% superado (500 números aleatorios, casos borde ortográficos, evaluaciones pedagógicas, generación de rondas sin repeticiones, semanas ISO y lógica de recompensas).
  - `scripts/test-simulation.ts`: 119 mundos × 40 iteraciones (38.840 actividades): 0 errores.
  - `scripts/test-cuentos.ts`: 100% superado.
  - `npx tsc --noEmit`: 0 errores de tipado.
  - `npx eslint src`: 0 advertencias y 0 errores de linting.
  - `npm run build`: compilación de producción Next.js 16.3.5 Turbopack exitosa.

### AG-05 · Ajustes de comprensión: lenguaje de 3.º y opciones parejas (Antigravity)
- **Lenguaje accesible y adaptado a 3.º grado (8 años):**
  - Reescritura completa de las 60 preguntas de `src/lib/cuentos/preguntas-g3.ts` para los 6 cuentos (`tortuga-gigante`, `leyenda-ballena`, `gallina-huevos-oro`, `medias-flamencos`, `leyenda-iguazu`, `raton-campo-ciudad`).
  - Oraciones de hasta ~14 palabras, vocabulario cercano y comprensible (sin tecnicismos adultos como «fauces», «desmesuradamente», «imperioso», «voracidad insaciable», «función cosmogónica», «volanta/copete»). Exigencia centrada en el razonamiento: causa-consecuencia, comparar personajes, evidencia textual («¿Qué parte del texto muestra que...?»).
  - Vocabulario contextual extraído del texto con definiciones sencillas (cañadón, tábano, gallinero, ardor, cataratas, trigal).
  - Pistas pedagógicas que orientan la relectura comenzando con `"Pista: "`.
- **Fichas complementarias de 3.º grado (31101–31106) y revisión en 2.º grado:**
  - Reescritura pedagógica en `scripts/fichas/data_cuentos.py` para 3.º grado: noticia escolar simple (título, lugar y qué ocurrió sin términos de secundaria como «volanta» o «copete»), entrada de diario en primera persona, final alternativo, carta de agradecimiento/consejo, descripción sensorial del arcoíris sobre las cataratas, y opinión fundamentada con razones.
  - Revisión y simplificación de giros adultos residuales en 2.º grado en `preguntas-g2.ts` y `data_cuentos.py` (ej. «¿Qué nos enseña este cuento?» en lugar de «¿Qué lección social y ética contiene...?»).
  - 334 fichas generadas en `private/fichas/`, todas en `[1, 2]` páginas exactas (0 desbordes).
- **Equilibrio de longitud de opciones (la correcta es la más larga en ≤ 35% en cada grado):**
  - En `preguntas-g1.ts`: se redujo la tasa de respuesta más larga de 70.9% a **14.3% (25/175)** enriqueciendo distractores con elementos plausibles del relato.
  - En `preguntas-g2.ts`: se redujo de 70.4% a **12.5% (19/152)** acortando enunciados correctos extensos y balanceando alternativas.
  - En `preguntas-g3.ts`: se redujo de 81.7% a **20.0% (12/60)**.
  - En los tres grados la respuesta correcta no es predecible por extensión visual, manteniendo alternativas plausibles y coherentes con la narración.
- **Chequeo automático en suite de pruebas:**
  - Incorporada la función `checkOptionLengths` en `scripts/test-cuentos.ts`: valida que el porcentaje de preguntas donde la correcta es estrictamente la más larga sea ≤ 35% en 1.º, 2.º y 3.º grado, fallando con código de error 1 ante cualquier regresión.
- **Verificación completa:**
  - `python scripts/fichas/generar_fichas.py`: 334 fichas en [1, 2] páginas, 0 desbordes.
  - `npx tsx scripts/test-cuentos.ts`: 100% aprobado (G1: 14.3%, G2: 12.5%, G3: 20.0%).
  - `npx tsx scripts/test-simulation.ts`: 119 mundos × 40 iteraciones (38.840 actividades): 0 errores.
  - `npx tsc --noEmit`: 0 errores.
  - `npx eslint src`: 0 advertencias / errores.
  - `npm run build`: compilación de producción Next.js 16.3.5 Turbopack exitosa.

### AG-04 · Comprensión lectora 2.º y 3.º, fichas de cuentos y variedad en 2.º (Antigravity)
- **Preguntas de comprensión lectora por grado:**
  - `src/lib/cuentos/preguntas-g2.ts`: 19 cuentos y leyendas de `ORDEN_G2`. 8 preguntas por cuento con distribución curricular: 2 literales, 2 de secuencia temporal, 2 inferenciales, 1 de vocabulario en contexto (extraído del texto) y 1 de estructura o valoración (identificación de género, moraleja, enseñanza). Opciones de 3 y 4 alternativas (al menos 3 con 4 opciones por cuento). Pistas formuladas con `"Pista: "` y distractores plausibles del relato.
  - `src/lib/cuentos/preguntas-g3.ts`: 6 cuentos de `ORDEN_G3`. 10 preguntas por cuento, estrictamente 4 opciones por pregunta. Distribución curricular: 2 literales, 2 de secuencia, 3 inferenciales, 1 de vocabulario, 1 de estructura y 1 de valoración. Incorpora causa-consecuencia, comparación y evolución de personajes, y preguntas basadas en evidencia («¿Qué parte del texto muestra que...?»).
  - Script de validación `scripts/test-cuentos.ts`: verificación automática de los tres grados (1.º, 2.º y 3.º) validando cantidad de preguntas, distribución tipológica, número de opciones, pistas y generación vía `buildStoryActivities` con 0 errores.
- **Fichas complementarias de cuentos en PDF (44 mundos):**
  - Módulo de contenido `scripts/fichas/data_cuentos.py`: consignas adaptadas al nivel de cada grado según `FORMATO.md` (1.º dibujo y conversación guiada, 2.º escritura breve y secuencia, 3.º análisis crítico y microrrelato), sin emojis en el texto impreso.
  - Generador `scripts/fichas/generar_fichas.py` con `STORY_MAP`: mapeo de imágenes de islas de cuentos para 1.º, 2.º y 3.º grado.
  - 44 fichas generadas en `private/fichas/` (`mundo-11101-1.pdf`..`11119-1.pdf`, `mundo-21101-1.pdf`..`21119-1.pdf`, `mundo-31101-1.pdf`..`31106-1.pdf`), todas de 1 o 2 páginas exactas (sin desbordes ni páginas en blanco).
  - En `/familias` (`src/app/familias/FichasView.tsx`), las tarjetas de fichas de cuentos visualizan la miniatura de la isla correspondiente (`w.image`).
- **Variedad en Matemática y Lengua de 2.º grado (seguimiento AG-03):**
  - Matemática (`src/lib/grade2/content/matematica.ts`): en la actividad 3 se intercalan consignas de tipo `input` numérico (o `true-false` en geometría no numérica) y en la actividad 6 consignas de `order` (mundos 4 y 8) o `true-false`, logrando que en los 28 mundos la racha máxima consecutiva de un mismo tipo sea de 2 (estrictamente ≤ 3).
  - Lengua (`src/lib/grade2/content/lengua.ts`):
    - Mundo 1: intercalado de `true-false` en actividades 3 y 6.
    - Mundos 2 a 13 (trabadas): intercalado de armado de palabras con fichas móviles (`build`) en actividades 3 y 6.
    - Mundo 14 (fiesta de trabadas): combinación de `classify`, `true-false`, `order` y `pick`.
    - Mundos 15 a 38 (ortografía y gramática): intercalado de `true-false` en actividades 3 y 6.
    - Los 38 mundos de Lengua tienen racha máxima consecutiva ≤ 2.
  - Corrección de emojis y distractores:
    - En `src/lib/grade2/words.ts`, reemplazo de `madre` (👩) y `ladrón` (🦹) por `ladrillo` (🧱) y `almendra` (🌰) para el patrón `dr`.
    - En `src/lib/grade2/content/lengua.ts`, reemplazo de distractores inverosímiles en mundos 14, 34, 35, 37 y 38 por alternativas pedagógicas plausibles.
- **Control de calidad y pruebas:**
  - `npx tsx scripts/test-cuentos.ts`: 100% aprobado.
  - `npx tsx scripts/test-simulation.ts`: 119 mundos × 40 iteraciones (38.840 actividades): 0 fallos.
  - `npx tsc --noEmit`: 0 errores de tipado.
  - `npx eslint src`: 0 advertencias o errores de linter.
  - `npm run build`: compilación de producción exitosa con Next.js Turbopack.

### AG-03 · 2.º grado completo: 100 mundos, habilidades, actividades, ambiente «bosque de lengas» y fichas (Antigravity)
- **Catálogo de 100 mundos según el Diseño Curricular de Santa Cruz (`src/lib/grade2/worlds.ts`):**
  - **Lengua (38 mundos: 21001 a 21038):**
    - *Fluidez y trabadas:* consolidación lectora (21001), 12 grupos consonánticos trabados con L y R (DR, TR, CR, CL, FR, FL, GR, GL, BR, BL, PL, PR) (21002 a 21013), fiesta de trabadas integrada (21014).
    - *Ortografía reglada:* C/QU (21015), CE/CI suave (21016), G/GU (21017), GE/GI fuerte (21018), diéresis GÜE/GÜI (21019), R suave vs. RR fuerte intervocálica e inicial (21020), regla sin excepción MB/MP (21021), H muda en vocabulario frecuente y diptongos hue-/hie- (21022), dígrafo CH (21023).
    - *Puntuación y morfología:* mayúscula inicial y nombres propios (21024), punto seguido y final en la oración (21025), sustantivos comunes (21026) y propios (21027), número singular y plural (21028), género femenino/masculino y concordancia de artículos (21029), adjetivos calificativos (21030), familias de palabras con raíz compartida (21031), aumentativos y diminutivos (21032), orden alfabético (21033).
    - *Tipos textuales y comprensión:* estructura del cuento canónico (inicio, conflicto, desenlace) (21034), fábulas y moraleja (21035), trabalenguas, rimas y adivinanzas (21036), textos instructivos y recetas (21037), correspondencia social: notas y cartas (21038).
  - **Matemática (28 mundos: 22001 a 22028):**
    - *Numeración y valor posicional:* regularidades de la grilla del 1 al 100 (22001), vecinos numéricos +1/-1 y +10/-10 (22002), saltos en la recta (22003), adivinanzas numéricas (22004), números hasta 500 (22005) y hasta 1000 (22006), valor posicional en cienes, dieces y unos (22007), composición con billetes y monedas (22008).
    - *Operaciones y cálculo mental:* escalas y series (22009), dobles y mitades (22010), cálculo mental de dieces y cienes (22011), sumas y restas sin dificultad (22012), suma con dificultad / agrupamiento (22013), resta con dificultad / desagrupamiento (22014), situaciones problemáticas con dinero (22015).
    - *Multiplicación y reparto:* multiplicación como suma reiterada (22016), tabla del 2 (22017), tabla del 5 (22018), tabla del 10 (22019), reparto equitativo inicial (22020), problemas de proporcionalidad y filas/columnas (22021), resolución con operaciones combinadas (22022).
    - *Geometría, espacio y medida:* figuras geométricas 2D (lados y vértices) (22023), cuerpos geométricos 3D (caras, aristas, vértices) (22024), croquis y orientación espacial (22025), longitud en metros y centímetros (22026), peso y capacidad (kilo, medio kilo, litro) (22027), lectura del reloj analógico y digital en horas y medias horas (22028).
  - **Ciencias Sociales (18 mundos: 23001 a 23018):**
    - *Espacio geográfico y comunidad:* paisajes santacruceños (costa, estepa, meseta, cordillera) (23001), vida urbana y servicios (23002), vida rural y estancias (23003), barrios y plazas (23004), transporte terrestre, aéreo y marítimo (23005), trabajos y tecnología en el campo y la ciudad (23006).
    - *Circuitos productivos y sociedad:* pesca y puertos de Puerto Deseado y Caleta Olivia (23007), circuito de la lana (23008), circuito petrolero de la Cuenca Austral (23009), producción de cerezas en Los Antiguos (23010), instituciones y autoridades del municipio (23011), convivencia escolar y diálogo (23012).
    - *Historia e identidad:* pueblo tehuelche / Aonikenk (23013), arte rupestre en Cueva de las Manos (23014), efemérides patrias: 25 de Mayo (23015), 9 de Julio (23016), San Martín y Cruce de los Andes (23017), Malvinas, diversidad cultural y cuidado ambiental santacruceño (23018).
  - **Ciencias Naturales (16 mundos: 24001 a 24016):**
    - *Seres vivos y ambiente:* bosque andino patagónico de lengas y pájaro carpintero (24001), fauna autóctona (huemul, guanaco, cóndor, zorro) (24002), flora nativa adaptada (calafate, ñire, coirón) (24003), cambios estacionales en la vegetación (24004), factores físicos y necesidades vitales (24005), supervivencia invernal (migración, letargo, grasa y pelaje) (24006).
    - *Cuerpo y salud:* crecimiento y desarrollo corporal desde el nacimiento (24007), cambio de dentición y cepillado (24008), hábitos saludables y vacunación (24009), sistema locomotor: huesos duros, músculos y articulaciones móviles (24010).
    - *Física y materiales:* fuerzas de contacto (empuje, tracción) y rozamiento (24011), máquinas simples (rueda, rampa/plano inclinado, palancas) (24012), materiales naturales y manufacturados (24013), flotación y densidad en agua (24014), óptica: fuentes de luz, sombras y objetos opacos/transparentes (24015), producción del sonido por vibración en la naturaleza y fuentes sonoras (24016).
- **Catálogo de 62 habilidades de 2.º grado (`src/lib/grade2/skills.ts`):**
  - Cada habilidad cuenta con `id`, `subject`, `axis`, `label`, `description` pedagógica y `practice` para seguimiento y reportes.
- **Banco de palabras contextualizado (`src/lib/grade2/words.ts`):**
  - Palabras decodificables con sílabas, emojis no ambiguos clasificados por patrón (trabadas L y R, ortografía reglada, sustantivos, adjetivos).
- **Generadores y bancos de actividades (`src/lib/grade2/content/`):**
  - Lengua y Matemática procedimentales con aleatorización controlada pedagógicamente.
  - Sociales y Naturales con bancos de $\ge 12$ preguntas por mundo (con pistas pedagógicas) combinadas con 2 actividades extra de ordenamiento (`makeOrder`), clasificación (`makeClassify`) o comprensión de historias (`makeStoryPick`).
  - Total de actividades generadas por vuelta: 8 (mínimo 6 garantizado).
- **Ambiente visual «bosque de lengas»:**
  - `src/components/Forest.tsx`: silueta SVG responsiva con cordillera nevada, lengas estratificadas en tonos de otoño, arroyo cristalino y refugio de madera.
  - Estilos globales: clases `.bg-bosque-day` y `.bg-bosque-night` en `src/app/globals.css`.
  - Integración en `ActivityRunner.tsx` y `student/play/page.tsx`.
  - Etapas de mapa: `public/theme/grados/2/mapa/etapa-1..4.jpg` (800x1200).
  - Islas: 101 ilustraciones en `public/theme/grados/2/islas/` (`mundo-21001.png` a `mundo-24016.png` + `practica.png`).
- **Plataforma, Docente y Administración:**
  - `/admin`: selectores de grado dinámicos, bloque de alumnos de 2.º grado con emoji 🌲, pestaña de activación de mundos de 2.º grado (`g2Enabled`, `toggleG2World`), umbral de 85% y reporte de habilidades.
  - `/docente/alumno`: reporte de habilidades disponible para 1.º y 2.º grado.
  - `/docente/aula`: visualización de mundos adaptada al grado del aula activa.
- **Fichas complementarias en PDF (100 mundos):**
  - Archivos JSON: `segundo-lengua.json` (38), `segundo-matematica.json` (28), `segundo-sociales.json` (18), `segundo-naturales.json` (16) validados con 0 emojis y estructura estricta (`FORMATO.md`).
  - Generación de 100 PDFs (`private/fichas/mundo-2????-1.pdf`), todos de 1 o 2 páginas exactas sin desbordes.
  - Vista `/familias` actualizada con botón para 2.º grado y soporte de enlaces de descarga.
- **Pruebas y Verificación de Calidad:**
  - `npx tsx scripts/test-simulation.ts`: 100 mundos de 2.º grado × 40 iteraciones (32.000 actividades generadas) + zonas de práctica + regresión 1.º y 3.º grado: 0 errores.
  - `npx tsx scripts/test-verification-full.ts`: alta de alumno en 2.º, temas visuales, flujo de juego, desbloqueo secuencial por prerrequisitos e integridad de PDFs en disco: 0 errores.
  - `npx tsc --noEmit`: 0 errores.
  - `npx eslint src`: 0 errores y 0 warnings.
  - `npm run build`: compilación de producción exitosa con Turbopack.

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

#### Revisión de Claude (AG-02)
- Probado: `tsc`, `eslint`, build y el script de 96 mundos × 40 vueltas sin problemas; Sociales y Naturales ahora mezclan 6 preguntas + 2 actividades de otros tipos.
- Arreglos al unir:
  - Las fuentes que se agregaron en `scripts/fichas/` eran **variables** (Fredoka salía en su versión fina): se reemplazaron por las estáticas (Andika Regular/Bold, Fredoka Bold) y se regeneraron las 190 fichas.
  - `/familias` (`FichasView.tsx`) leía `window.location.hash` al crear el estado: en el servidor daba 3.º y en el navegador 1.º (desajuste de HTML). Ahora se lee después de montar.
  - Las fichas de 1.º usan la isla de 1.º en el encabezado (`island_path` en `generar_fichas.py`).

### CL-03 · Ambientes por grado, imágenes de 1.º y Halloween (Claude)
- `GradeTheme` en `src/lib/grades.ts`: cada grado define su isla, su mapa (4 etapas), su silueta de fondo y sus colores. 1.º = **costa patagónica** (`public/theme/grados/1/`), 3.º = meseta y montaña (lo de siempre). Plan del recorrido: 1.º costa · 2.º bosque de lengas · 3.º meseta y montaña · 4.º glaciares · 5.º a 7.º estepa, lagos y cielo austral.
- 97 islas de 1.º (una por mundo + zona de práctica) y 4 fondos de mapa; silueta `Seashore.tsx`.
- Halloween: festividad del 1/10 al 2/11 y 7 avatares de temporada en la tienda a 200 monedas cada uno (calabaza, fantasmita, brujita, vampirito, gato negro, murcielaguito y ratita); solo se compran durante la temporada y lo comprado queda.

### CL-04 · Cuentos en 1.º, 2.º y 3.º (Claude)
- Motor en `src/lib/cuentos/`: 19 cuentos del canon (Esopo, tradicionales, Perrault, Grimm, Andersen, Quiroga y dos leyendas tehuelches), 6 escenas ilustradas cada uno (`public/theme/grados/1/cuentos/<id>-<n>.jpg`) y preguntas por grado.
- Un mundo de cuento en las posiciones 3, 6, 9… de Lengua (`withStories` en `recorrido.ts`): 19 en 1.º (11101–11119), 19 en 2.º (21101–21119) y 6 en 3.º (31101–31106). Piden el mundo común anterior pero no bloquean el siguiente (no cambia el progreso de nadie).
- Actividad `listen` (`ListenActivity.tsx`): en 1.º se narra sola (grabación en `public/audio/cuentos/` si existe; si no, voz del navegador); en 2.º y 3.º los chicos leen y tienen 🔊 opcional. No suma puntos: el puntaje sale de las preguntas.
- Habilidades: 1.º `l-comp-literal/secuencia/inferencial`; 2.º `l2-comp-literal/secuencia/inferencial/vocabulario/critica`.
- Ilustraciones: 19 cuentos × 6 escenas (`public/theme/grados/1/cuentos/`), islas de los cuentos en el estilo de cada grado (costa 11101–11119, bosque 21101–21119, meseta 31101–31106).

### CL-05 · Escuelas, aulas y docentes (Claude)
- La plataforma (`/docente`, Supabase con permisos por fila) ya cubre lo pedido: administrador general → escuelas y direcciones; dirección → aulas y docentes; docente → solo sus aulas y alumnos.
- Probado con una base Postgres local (migraciones + datos de prueba): un docente no ve ni puede inscribir alumnos de otra aula; la dirección ve solo su escuela; el administrador general ve todo.
- Nuevo: guía paso a paso `docs/plataforma/CONFIGURAR.md`, script `supabase/bootstrap_super_admin.sql`, selector de grado (1.º a 7.º) al crear aulas y acceso «🏫 Escuelas y aulas» desde `/admin`.
- Pendiente de Pedro: crear el proyecto Supabase y cargar las 3 variables en Vercel.

### CL-06 · Imágenes ilustradas de 2.º (Claude)
- 120 islas nuevas «bosque de lengas en otoño» (100 mundos + 19 lecturas + práctica) con el mismo estilo ilustrado de 1.º, y 4 mapas (primavera, verano, otoño, invierno).
- `scripts/imagenes/cortar_islas.py`: relleno del fondo blanco (la roca clara no queda transparente), paleta de 256 colores (archivos ~10 veces más livianos) y celdas `skip`.
- `scripts/imagenes/generar_activos_g2.py` (dibujos geométricos de AG-03) ya no se usa: no correrlo, pisaría las islas nuevas.

### CL-07 · Cuento, leyenda y fábula (Claude)
- Los mundos de comprensión alternan **cuento → leyenda → fábula** (géneros narrativos del DC), con una selección por grado según su nivel (`C/L/F` de cada grado en `recorrido.ts`). El nombre del mundo dice el género («Leyenda: …»).
- 6 leyendas nuevas, con prioridad a Santa Cruz y la Argentina: Kóoch y el origen del mundo y Cómo llegó la ballena al mar (tehuelches), el hornero y la yerba mate (guaraníes), el Cerro de los Siete Colores (Jujuy) y las Cataratas del Iguazú (guaraní). Total: 25 textos ilustrados.
- Las islas de los mundos de comprensión ilustran su texto y se guardan por texto (`cuento-<id>.png` en cada ambiente; `world.image`), así no dependen de la posición.
- Lectura en **diapositivas**: cada escena entra con un fundido y la imagen se acerca despacio; mientras la voz lee, se resalta la oración que suena (correspondencia imagen–texto–voz). Si hay audio grabado, se resalta la escena entera.

### CL-08 · Voz y música de los cuentos (Claude)
- Voz de los textos con Kokoro-82M (voz «Alex», Apache 2.0): un audio por oración (`public/audio/cuentos/voz/<hash>.mp3`, `src/lib/cuentos/voz.ts`), con resaltado sincronizado. Prioridad: grabación del docente → voz Kokoro → voz del navegador. Si cambian o se agregan textos (AG-06), regenerar con `scripts/voz/` (ver LEEME).
- Música original compuesta por código (`scripts/musica/componer.py` → `public/audio/musica/`): inicio, un mapa por ambiente, cuento, leyenda, fábula y festejo. Suena bajita, baja durante la lectura y se apaga con el botón 🎵 (se recuerda por dispositivo).
- Lectura en voz alta paga en 3.º (5 🪙 por texto) y textos por grado (`escenasDe`).
- Licencias del audio: `docs/CREDITOS-AUDIO.md`.
