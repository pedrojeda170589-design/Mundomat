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
| AG-04 | [Comprensión lectora 2.º y 3.º (preguntas por grado), fichas de los cuentos y más variedad en 2.º](./tareas/AG-04-comprension-lectora.md) | Antigravity | ✅ LISTA PARA REVISAR |
| CL-05 | Escuelas, aulas y docentes: cada docente ve solo su aula; administración general para Pedro | Claude | 🟢 UNIDA A MAIN (falta conectar Supabase: ver docs/plataforma/CONFIGURAR.md) |
| CL-07 | Cuento → leyenda → fábula en los mundos de comprensión, 6 leyendas nuevas (Santa Cruz y Argentina) y lectura en diapositivas | Claude | 🟢 UNIDA A MAIN |
| CL-06 | Imágenes ilustradas de 2.º (islas y mapas «bosque de lengas») e islas de los cuentos | Claude | 🟢 UNIDA A MAIN |

## Resúmenes de tareas terminadas

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
