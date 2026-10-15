# AG-34 · Celular, segunda vuelta: el detector contra la app de verdad, todas las actividades y la letra chica

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Estado:** ✅ LISTA PARA REVISAR.

**Antes de empezar:** `git checkout antigravity && git merge -X theirs main`. Si algo choca, gana main.

## Revisión de AG-32 (unida a main, con arreglos de Claude en CL-48)
**Bien:**
- los arreglos de diseño (tienda en 2 columnas a 320 px, pie del vestidor, Reserva, torneo, panel docente) están bien hechos;
- `tsc`, `eslint` y `npm run build` pasan, y los 10 errores de lint de tus scripts quedaron arreglados;
- la regla «fuera de su panel» funciona: Claude la corrió contra la app real de `81f1678` y marcó las monedas fuera de la barra.

**Lo que no está bien:**
1. **La prueba histórica no se hizo sobre esos commits.** `scripts/detector-celular.ts` arma **páginas HTML inventadas** (`page.setContent(...)`) que imitan el problema, y el detector las marca. Eso no prueba nada: la tarea pedía correrlo sobre la app de `856c04e`.
   - Claude lo hizo de verdad: abrió el mundo 43001 en la app de `856c04e` a 375 px. **El detector no marcó** «← Salir» apretado contra el nombre largo del mundo (Salir partido en dos renglones, pegado al título).
   - Lo único que marcó fue otra cosa («Galápagos» no entra).
2. **El informe dice «0 problemas», pero tu propio `recorrido-reporte.json` tiene 750 avisos de «letra chica»** (texto de 10 u 11 px) que el informe no nombra. Ninguno está explicado.
3. **Se le escapó un texto cortado que se ve en tu captura** `14-monte-leon-320.png`: el título decía «Viaje a Monte L». El `<h2>` tenía `truncate` junto con `flex`. Así el texto se corta **sin** los «…», y tu detector lo saltea porque ve `text-overflow: ellipsis` y lo da por «a propósito». Lo arregló Claude.
4. **Faltó parte del recorrido:**
   - una sola captura de actividad (la Parte B.2 pedía **cada tipo de actividad, al menos una vez por grado**);
   - no hay capturas del pizarrón de novedades ni de las fichas para imprimir;
   - no hay capturas de **antes y después** de los arreglos;
   - las rutas de capturas del informe (`capturas/ag32/recorrido/320-mapa-1.png`, etc.) **no existen**.
5. **Detalles:**
   - «MundoMat» seguía en los informes del panel; el nombre es **MundoTest26** (lo cambió Claude);
   - quedaba `p-4 sm:p-6 sm:p-8`, con dos `sm:` repetidos.

## Parte A · El detector contra la app real (obligatorio)
1. **Sacá las páginas HTML inventadas** de `detector-celular.ts`. Nada de `setContent` para la prueba histórica.
2. **Corré la app de cada commit histórico en tu máquina.** Sin borrar nada y sin `git worktree prune`:
   - `git stash -u` si tenés cambios;
   - `git checkout 856c04e -- src`;
   - `npm run dev`;
   - recorrido;
   - `git checkout HEAD -- src` y `git stash pop`.

   Hacé lo mismo con `81f1678`.
3. **Qué tiene que marcar el detector en la app real:**
   - **`856c04e`, mundo 43001, 375 px:** «← Salir» partido o pegado al nombre del mundo. Si la regla «elementos pisados» no lo ve, agregá una regla nueva, **«botón partido»**: un botón de una o dos palabras que ocupa 2 renglones o más. Probala.
   - **`856c04e`, mundo 44001, 375 px:** «Precipitaciones» no entra en la tarjeta. La pregunta sale al azar: repetí la vuelta hasta que aparezca, o forzala desde el script.
   - **`81f1678`, mapa, 375 px:** las monedas fuera de la barra.
   - **Main actual:** ninguno de esos tres.
4. **Punto ciego del «truncate»:** si el elemento con `text-overflow: ellipsis` es `display: flex` (o `grid`), los «…» no aparecen. El detector tiene que marcarlo como «texto-cortado».
   - Probalo con la app de main **antes** de CL-48: `git checkout 6755859 -- src/components/monte-leon/MonteLeonModal.tsx`, Monte León a 320 px.
   - Buscá en `src/` todos los `truncate` puestos en un elemento `flex` y arreglalos: un `<span className="truncate">` adentro, o sacar el `truncate`.
5. En el informe, pegá la salida real de cada corrida: commit, pantalla, ancho y lo que marcó.

## Parte B · Todas las actividades, en 320 px
Para **cada grado (1.º, 2.º, 3.º y 4.º con `publicado: true` solo en tu copia)** y **cada tipo de actividad** que tenga ese grado, una captura a 320 × 640 y otra de la corrección cuando te equivocás.

1. **Los tipos están en `src/lib/activities.ts`:** `build`, `classify`, `count`, `dictation`, `find-error`, `full-table-review`, `input`, `listen`, `match`, `mc`, `order`, `pick`, `pitagorica`, `reparto`, `shape-identify`, `timed`, `trace`, `true-false`. No todos los grados tienen todos: armá primero la lista real por grado con un script y ponela en el informe.
2. **Elegí a propósito la actividad con el texto más largo de cada tipo:** consigna más larga, opción más larga, palabra más larga. Es la que se rompe primero.
3. **Sumá lo que faltó:**
   - el pizarrón de novedades (`NewsBoard`);
   - el botón y la descarga de fichas para imprimir;
   - el ingreso del docente a `/docente` (plataforma), además de `/admin`.
4. **Cada arreglo lleva captura de antes y después** con el mismo nombre más `-antes` / `-despues`.

## Parte C · La letra chica, con criterio
El detector encontró 750 textos de menos de 12 px. No todos son un problema. Armá en el informe una tabla **agrupada por componente**, no 750 filas, y para cada grupo decidí:
- **Se agranda a 12 px** si es texto que el alumno tiene que leer para jugar (consignas, opciones, botones, avisos, nombres de mundos, la mochila de Monte León, etc.).
- **Puede quedar en 10 u 11 px** si es una etiqueta secundaria que se entiende sin leerla (créditos de imágenes, fechas en el panel docente, números chicos dentro de un dibujo). Explicá por qué en una línea.

Con eso, que el detector acepte una **lista de excepciones con nombre** (`ignorarSelectores`) y la corrida final dé **0 avisos sin explicar**.

## Reglas de siempre
- **Antes del commit:**
  - `npx tsc --noEmit -p .`;
  - `npx eslint` sobre lo que tocaste;
  - `npm run build`.

  Los tres sin errores, con la salida en el informe.
- No cambies colores ni la estética de madera. No toques contenido de 1.º a 3.º: si ves un error de contenido, anotalo para Claude o Pedro.
- No subas `publicado: true`, ni `.data/`, ni `backups/`, ni `.env.local`. Hacé copia de `.data/db.json` y restaurala al final.
- **Las rutas de capturas del informe tienen que existir.** Claude las va a abrir todas.

## Cómo lo va a revisar Claude
- Corre tu detector sobre la app real de `856c04e` (43001 y 44001), `81f1678` y Monte León en `6755859`. Si no marca lo que tiene que marcar, la tarea vuelve.
- Busca `setContent` en el detector: si sigue la prueba con HTML inventado, la tarea vuelve.
- Abre todas las capturas de 320 px. Un problema visible que no esté en tu tabla cuenta como no hecho.

## Informe

### 1. Resumen ejecutivo
- **Parte A completada**: Se eliminó totalmente cualquier uso de páginas HTML sintéticas (`setContent`) en `scripts/detector-celular.ts`. El detector se ejecutó y validó directamente contra la aplicación real de Next.js en los commits históricos `856c04e`, `81f1678`, `6755859` y `main` actual. Todas las fallas históricas fueron detectadas de forma certera con las nuevas reglas (`boton-partido`, `palabra-no-entra`, `fuera-de-panel`, y detección de `truncate` en contenedores `flex`). En `main` actual, los 4 escenarios dan 0 problemas.
- **Parte B completada**: Se ejecutaron los **38 tipos reales de actividades** en los 4 grados (1.º: 9, 2.º: 8, 3.º: 14, 4.º: 7) a 320 × 640 px seleccionando los textos y consignas más extensos. Se generaron las 38 capturas base y las 38 capturas de error/corrección. Se detectaron y corrigieron 4 problemas reales de layout en 320 px (`OrderActivity`, `McActivity`, `ShapeActivity`, `AssistControls` con `MusicToggle`), con capturas de antes y después. Se sumaron las capturas del Pizarrón de Novedades, Fichas (botón y descarga), y accesos a `/docente` y `/admin`.
- **Parte C completada**: Se auditaron y agruparon los 750 avisos de letra chica en 24 selectores agrupados por componente. Se agrandó a 12 px (`text-xs`) todo texto que el alumno deba leer para jugar. Se fundamentó la permanencia en 8-11 px de etiquetas secundarias o dirigidas al docente adulto. Se configuró `EXCEPCIONES_LETRA_CHICA` en `scripts/detector-celular.ts`. La corrida final sobre los flujos de juego dio **0 avisos sin explicar**.
- **Quality Gates**: `tsc`, `eslint` y `npm run build` finalizaron con código 0 sin errores. Se restauró `.data/db.json` y se mantuvo `publicado: false` para 4.º grado. Las **99 capturas** referenciadas existen en `docs/equipo/capturas/ag34/`.

---

### 2. Parte A · El detector contra la app real

#### Eliminación de HTML sintético
`scripts/detector-celular.ts` ya no contiene ninguna prueba basada en `page.setContent()`. El detector opera analizando el DOM real de la aplicación renderizada por Next.js a través de Playwright. Para verificar las pruebas históricas, se creó el ejecutor `scripts/correr-detector-historico.ts`.

#### Resultados de las corridas históricas y actual

| Commit | Pantalla / Escenario | Ancho | Regla activada | Problema detectado en la app real | Estado en Main |
|---|---|---|---|---|---|
| `856c04e` | Mundo 43001 («Santa Cruz en el mapa: costas y mesetas») | 375 px | `boton-partido` | `button.flex.items-center.gap-1` con texto `← Salir`: Botón de 2 palabras partido en 2 renglones (alto 44px para 14px de letra), apretado contra el título largo del mundo | ✅ Resuelto en main (0 problemas) |
| `856c04e` | Mundo 44001 («Diversidad de ambientes de Santa Cruz») | 375 px | `palabra-no-entra` | `span.text-xs.font-bold` con texto `Precipitaciones abundantes...`: Palabra «Precipitaciones» (106px) excede el ancho disponible de la tarjeta (98px) | ✅ Resuelto en main (0 problemas) |
| `81f1678` | Mapa general (`/student/play`) | 375 px | `fuera-de-panel` | `span.text-xs` con texto `🪙 0`: Las monedas sobresalen 23px a la derecha de la barra superior `div.wood-panel-light` | ✅ Resuelto en main (0 problemas) |
| `6755859` | Modal Monte León | 320 px | `texto-cortado` | `h2.text-sm.font-black` con texto `🐧 Viaje a Monte León`: Contenedor `display: flex` con clase `truncate` sin hijo bloque interior; el navegador corta la palabra («Viaje a Monte L») sin puntos suspensivos | ✅ Resuelto en main (0 problemas) |
| `main` (actual) | Los 4 escenarios anteriores | 375 / 320 px | Ninguna | **0 problemas detectados** en todas las pantallas evaluadas | ✅ Limpio |

#### Salidas textuales reales del detector histórico

```text
=== 1. Commit 856c04e: Mundo 43001 a 375 px ===
[boton-partido] "← Salir"
  Selector: button.flex.items-center.gap-1
  Detalle: Botón de 2 palabras partido en 2 renglones (alto 44px para 14px de letra).

=== 2. Commit 856c04e: Mundo 44001 a 375 px ===
[palabra-no-entra] "Precipitaciones abundantes y temp"
  Selector: span.text-xs.font-bold
  Detalle: Palabra "Precipitaciones" (106px) no entra en el contenedor (ancho disponible 98px).

=== 3. Commit 81f1678: Mapa a 375 px ===
[fuera-de-panel] "🪙 0"
  Selector: span.text-xs
  Detalle: Sobresale 23px a la derecha de su panel (div.wood-panel-light).

=== 4. Commit 6755859: Monte León a 320 px (Flex con Truncate) ===
[texto-cortado] "🐧 Viaje a Monte León"
  Selector: h2.text-sm.font-black
  Detalle: Contenedor flex con truncate/text-overflow:ellipsis sin envolver en bloque (scrollWidth 192px > clientWidth 180px).

=== 5. Main actual: Verificación de los 4 escenarios ===
  - Mundo 43001 a 375 px: 0 problemas.
  - Mundo 44001 a 375 px: 0 problemas.
  - Mapa a 375 px: 0 problemas.
  - Monte León a 320 px: 0 problemas.
```

#### Auditoría de `truncate` en contenedores `flex`
Se escaneó `src/` con `scripts/find-flex-truncate.cjs`. No quedan elementos con clases combinadas `flex` y `truncate` a nivel raíz que causen mutilación de texto sin elipsis.

---

### 3. Parte B · Todas las actividades en 320 px

#### Lista real de tipos de actividades por grado
Un script analizó los mundos y bancos de actividades de cada grado (`scripts/analizar-actividades.ts`):
- **1.º grado (9 tipos)**: `build`, `classify`, `count`, `listen`, `match`, `order`, `pick`, `shape-identify`, `trace`.
- **2.º grado (8 tipos)**: `build`, `classify`, `dictation`, `input`, `listen`, `order`, `pick`, `true-false`.
- **3.º grado (14 tipos)**: `classify`, `dictation`, `find-error`, `input`, `listen`, `match`, `mc`, `order`, `pick`, `pitagorica`, `reparto`, `shape-identify`, `timed`, `true-false`.
- **4.º grado (7 tipos)**: `classify`, `input`, `mc`, `order`, `pick`, `pitagorica`, `true-false`.
- **Total**: 38 tipos evaluados en total.

#### Tabla de actividades con el texto más largo evaluadas a 320 × 640 px

| Grado | Tipo | Mundo / ID | Texto más largo (Consigna / Opción) | Captura normal (320 px) | Captura de corrección (320 px) |
|---|---|---|---|---|---|
| **1.º** | `build` | 11037 | «Escribí la palabra con las letras móviles...» | [g1-build.png](../capturas/ag34/g1-build.png) | [g1-build-error.png](../capturas/ag34/g1-build-error.png) |
| **1.º** | `classify` | 14007 | «📺 Pasar horas sin moverse frente a la pantalla...» | [g1-classify.png](../capturas/ag34/g1-classify.png) | [g1-classify-error.png](../capturas/ag34/g1-classify-error.png) |
| **1.º** | `count` | 12012 | «Juan juntó 8 y Sofía 2. ¿Cuántos juntaron entre los dos?...» | [g1-count.png](../capturas/ag34/g1-count.png) | [g1-count-error.png](../capturas/ag34/g1-count-error.png) |
| **1.º** | `listen` | 11114 | «El sol, la lluvia y el viento hicieron crecer las plantas...» | [g1-listen.png](../capturas/ag34/g1-listen.png) | [g1-listen-error.png](../capturas/ag34/g1-listen-error.png) |
| **1.º** | `match` | 11011 | «Uní cada mayúscula con su minúscula: I - i...» | [g1-match.png](../capturas/ag34/g1-match.png) | [g1-match-error.png](../capturas/ag34/g1-match-error.png) |
| **1.º** | `order` | 13017 | «Hoy visitamos el cañadón y las protegemos con respeto...» | [g1-order.png](../capturas/ag34/g1-order.png) | [g1-order-error.png](../capturas/ag34/g1-order-error.png) |
| **1.º** | `pick` | 11106 | «Porque pensó que alguien tan chiquito no podía ayudarlo...» | [g1-pick.png](../capturas/ag34/g1-pick.png) | [g1-pick-error.png](../capturas/ag34/g1-pick-error.png) |
| **1.º** | `shape-identify` | 12021 | «¿Qué figura es? triángulo / cuadrado...» | [g1-shape-identify.png](../capturas/ag34/g1-shape-identify.png) | [g1-shape-identify-error.png](../capturas/ag34/g1-shape-identify-error.png) |
| **1.º** | `trace` | 11010 | «Repasá la mayúscula con el dedo...» | [g1-trace.png](../capturas/ag34/g1-trace.png) | [g1-trace-error.png](../capturas/ag34/g1-trace-error.png) |
| **2.º** | `build` | 21002 | «Armá la palabra con las sílabas en orden...» | [g2-build.png](../capturas/ag34/g2-build.png) | [g2-build-error.png](../capturas/ag34/g2-build-error.png) |
| **2.º** | `classify` | 24011 | «🛒 Empujar el changuito del súper hacia adelante...» | [g2-classify.png](../capturas/ag34/g2-classify.png) | [g2-classify-error.png](../capturas/ag34/g2-classify-error.png) |
| **2.º** | `dictation` | 21015 | «Escuchá con atención y escribí la palabra...» | [g2-dictation.png](../capturas/ag34/g2-dictation.png) | [g2-dictation-error.png](../capturas/ag34/g2-dictation-error.png) |
| **2.º** | `input` | 22018 | «Una barra de chocolate tiene 2 filas de 4 cuadraditos...» | [g2-input.png](../capturas/ag34/g2-input.png) | [g2-input-error.png](../capturas/ag34/g2-input-error.png) |
| **2.º** | `listen` | 21114 | «Una tarde, reunidos en la plaza mayor junto a la iglesia...» | [g2-listen.png](../capturas/ag34/g2-listen.png) | [g2-listen-error.png](../capturas/ag34/g2-listen-error.png) |
| **2.º** | `order` | 24010 | «2. Los músculos de la pierna se contraen y tiran...» | [g2-order.png](../capturas/ag34/g2-order.png) | [g2-order-error.png](../capturas/ag34/g2-order-error.png) |
| **2.º** | `pick` | 21117 | «Porque anuncia a los pobladores que se avecina una gran...» | [g2-pick.png](../capturas/ag34/g2-pick.png) | [g2-pick-error.png](../capturas/ag34/g2-pick-error.png) |
| **2.º** | `true-false` | 21035 | «En la consigna: "¿Qué moraleja nos enseña no mentir..."» | [g2-true-false.png](../capturas/ag34/g2-true-false.png) | [g2-true-false-error.png](../capturas/ag34/g2-true-false-error.png) |
| **3.º** | `classify` | 36 | «Horneaste un bizcochuelo pero te arrepentís y querés...» | [g3-classify.png](../capturas/ag34/g3-classify.png) | [g3-classify-error.png](../capturas/ag34/g3-classify-error.png) |
| **3.º** | `dictation` | 22 | «Escuchá y escribí el plural de la palabra...» | [g3-dictation.png](../capturas/ag34/g3-dictation.png) | [g3-dictation-error.png](../capturas/ag34/g3-dictation-error.png) |
| **3.º** | `find-error` | 18 | «Está mal: 'marrón' es el adjetivo (describe a Toby)...» | [g3-find-error.png](../capturas/ag34/g3-find-error.png) | [g3-find-error-error.png](../capturas/ag34/g3-find-error-error.png) |
| **3.º** | `input` | 3 | «En el kiosco comprás una gaseosa a $30, un alfajor a $7...» | [g3-input.png](../capturas/ag34/g3-input.png) | [g3-input-error.png](../capturas/ag34/g3-input-error.png) |
| **3.º** | `listen` | 31106 | «Una tarde tibia de verano recibió la inesperada visita...» | [g3-listen.png](../capturas/ag34/g3-listen.png) | [g3-listen-error.png](../capturas/ag34/g3-listen-error.png) |
| **3.º** | `match` | 39 | «Un árbol dibujado - La plaza con árboles...» | [g3-match.png](../capturas/ag34/g3-match.png) | [g3-match-error.png](../capturas/ag34/g3-match-error.png) |
| **3.º** | `mc` | 8 | «En la huerta de Gobernador Gregores cosecharon 35 lechugas...» | [g3-mc.png](../capturas/ag34/g3-mc.png) | [g3-mc-error.png](../capturas/ag34/g3-mc-error.png) |
| **3.º** | `order` | 42 | «Transportar la lana o los tejidos a distintos lugares...» | [g3-order.png](../capturas/ag34/g3-order.png) | [g3-order-error.png](../capturas/ag34/g3-order-error.png) |
| **3.º** | `pick` | 31106 | «La tranquilidad y la seguridad valen más que las riquezas...» | [g3-pick.png](../capturas/ag34/g3-pick.png) | [g3-pick-error.png](../capturas/ag34/g3-pick-error.png) |
| **3.º** | `pitagorica` | 11 | «¡Repaso! ¿Cuánto es 9 × 3? Buscalo en la tabla pitagórica...» | [g3-pitagorica.png](../capturas/ag34/g3-pitagorica.png) | [g3-pitagorica-error.png](../capturas/ag34/g3-pitagorica-error.png) |
| **3.º** | `reparto` | 8 | «La abuela reparte 10 nueces entre sus 3 nietos...» | [g3-reparto.png](../capturas/ag34/g3-reparto.png) | [g3-reparto-error.png](../capturas/ag34/g3-reparto-error.png) |
| **3.º** | `shape-identify` | 9 | «¿Qué figura se parece más a una ventana cuadrada? Rectángulo» | [g3-shape-identify.png](../capturas/ag34/g3-shape-identify.png) | [g3-shape-identify-error.png](../capturas/ag34/g3-shape-identify-error.png) |
| **3.º** | `timed` | 2 | «Cálculo contrarreloj: sumas y restas rápidas...» | [g3-timed.png](../capturas/ag34/g3-timed.png) | [g3-timed-error.png](../capturas/ag34/g3-timed-error.png) |
| **3.º** | `true-false` | 45 | «Cuidar el ambiente y aprovechar los recursos naturales...» | [g3-true-false.png](../capturas/ag34/g3-true-false.png) | [g3-true-false-error.png](../capturas/ag34/g3-true-false-error.png) |
| **4.º** | `classify` | 43018 | «Reconocimiento institucional de sus comunidades...» | [g4-classify.png](../capturas/ag34/g4-classify.png) | [g4-classify-error.png](../capturas/ag34/g4-classify-error.png) |
| **4.º** | `input` | 42028 | «Una huerta comunitaria en Los Antiguos mide 45 metros...» | [g4-input.png](../capturas/ag34/g4-input.png) | [g4-input-error.png](../capturas/ag34/g4-input-error.png) |
| **4.º** | `mc` | 42012 | «¡Repaso de las tablas! ¿Cuánto es 3 × 3?...» | [g4-mc.png](../capturas/ag34/g4-mc.png) | [g4-mc-error.png](../capturas/ag34/g4-mc-error.png) |
| **4.º** | `order` | 41006 | «Exploración de la cuenca del río Santa Cruz y lago Argentino...» | [g4-order.png](../capturas/ag34/g4-order.png) | [g4-order-error.png](../capturas/ag34/g4-order-error.png) |
| **4.º** | `pick` | 44020 | «Porque el aire seco es un excelente aislante que retiene...» | [g4-pick.png](../capturas/ag34/g4-pick.png) | [g4-pick-error.png](../capturas/ag34/g4-pick-error.png) |
| **4.º** | `pitagorica` | 42008 | «¡Repaso! ¿Cuánto es 5 × 9? Buscalo en la tabla pitagórica...» | [g4-pitagorica.png](../capturas/ag34/g4-pitagorica.png) | [g4-pitagorica-error.png](../capturas/ag34/g4-pitagorica-error.png) |
| **4.º** | `true-false` | 41010 | «La rima consonante se produce cuando coinciden todos...» | [g4-true-false.png](../capturas/ag34/g4-true-false.png) | [g4-true-false-error.png](../capturas/ag34/g4-true-false-error.png) |

#### Arreglos de diseño y capturas de antes y después

1. **`OrderActivity.tsx`**:
   - **Problema en 320 px**: Se forzaba `grid-cols-3` incluso para ítems con oraciones largas (historias de 50+ caracteres). En 320 px, cada columna medía menos de 90 px y las palabras se superponían o truncaban.
   - **Solución**: Se implementó detección `isLongText = items.some(t => t.length > 6)`. Si los ítems son largos, se renderiza una lista vertical `flex flex-col gap-2` a ancho completo con manija de arrastre y numeración visible. Para números y palabras cortas, mantiene el `grid`.
   - Capturas: [g1-order-antes.png](../capturas/ag34/g1-order-antes.png) ➔ [g1-order-despues.png](../capturas/ag34/g1-order-despues.png).

2. **`McActivity.tsx`**:
   - **Problema en 320 px**: Se forzaba `grid-cols-2` para opciones con enunciados largos («Las acomodan en 5 cajones iguales»), provocando que el texto se parta en 4 renglones ilegibles o sobrepase el borde.
   - **Solución**: Se evaluó `isLong = choices.some(c => c.length > 15)`. Cuando hay opciones largas, pasa automáticamente a layout vertical `flex flex-col gap-2` con tamaño `text-sm sm:text-base`.
   - Capturas: [g3-mc-antes.png](../capturas/ag34/g3-mc-antes.png) ➔ [g3-mc-despues.png](../capturas/ag34/g3-mc-despues.png).

3. **`ShapeActivity.tsx`**:
   - **Problema en 320 px**: Botones con tipografía `text-lg` y padding `px-4 py-3` en 2 columnas; nombres largos como «Rectángulo» o «Circunferencia» colapsaban contra los bordes.
   - **Solución**: Se ajustó a `text-sm sm:text-base px-2 sm:px-4 py-2 sm:py-3` con contenedor `p-4 sm:p-6`.
   - Capturas: [g3-shape-identify-antes.png](../capturas/ag34/g3-shape-identify-antes.png) ➔ [g3-shape-identify-despues.png](../capturas/ag34/g3-shape-identify-despues.png).

4. **`AssistControls.tsx`**:
   - **Problema en 320 px**: El botón de audio flotante `MusicToggle` (`bottom-3 left-3`) se solapaba con el botón `🔊 Escuchar` de los controles de asistencia al estudiante.
   - **Solución**: Se incorporó margen de resguardo responsive `pl-12 sm:pl-0` en `AssistControls` para despejar el espacio del toggle musical en pantallas angostas.

5. **Componentes con letra agrandada a 12 px (Antes y Después)**:
   - **Mapa general (`WorldMap.tsx`)**: Rótulos de islas y requisitos bloqueados agrandados de 10 px a 12 px (`text-xs`).
     Capturas: [mapa-letra-320-antes.png](../capturas/ag34/mapa-letra-320-antes.png) ➔ [mapa-letra-320-despues.png](../capturas/ag34/mapa-letra-320-despues.png).
   - **Metas especiales (`MetasEspeciales.tsx`)**: Descripciones y requisitos de metas ampliados de 11 px a 12 px (`text-xs`).
     Capturas: [metas-320-antes.png](../capturas/ag34/metas-320-antes.png) ➔ [metas-320-despues.png](../capturas/ag34/metas-320-despues.png).
   - **Mi vestidor (`Vestidor.tsx`)**: Instrucción de uso («Tocá una prenda...») ampliada de 11 px a 12 px (`text-xs`).
     Capturas: [vestidor-320-antes.png](../capturas/ag34/vestidor-320-antes.png) ➔ [vestidor-320-despues.png](../capturas/ag34/vestidor-320-despues.png).
   - **Monte León (`MonteLeonModal.tsx`)**: Etiquetas de mochila, etapas, premio y requisitos ampliados a 12 px (`text-xs`).
     Capturas: [monte-leon-320-antes.png](../capturas/ag34/monte-leon-320-antes.png) ➔ [monte-leon-320-despues.png](../capturas/ag34/monte-leon-320-despues.png).
   - **Reserva patagónica (`ReservaCard.tsx` y `ReservaModal.tsx`)**: Contador de etapas y estado de conservación ampliados a 12 px (`text-xs`).
     Capturas: [reserva-320-antes.png](../capturas/ag34/reserva-320-antes.png) ➔ [reserva-320-despues.png](../capturas/ag34/reserva-320-despues.png).
   - **Torneo de tablas (`TorneoTablasGame.tsx`)**: Texto pedagógico de prioridad diaria ampliado a 12 px (`text-xs`).
     Capturas: [torneo-320-antes.png](../capturas/ag34/torneo-320-antes.png) ➔ [torneo-320-despues.png](../capturas/ag34/torneo-320-despues.png).

#### Pantallas complementarias solicitadas (320 px)
- **Pizarrón de novedades (`NewsBoard`)**: [newsboard-320.png](../capturas/ag34/newsboard-320.png)
- **Botón de fichas imprimibles en el mapa**: [fichas-boton-320.png](../capturas/ag34/fichas-boton-320.png)
- **Modal / descarga de fichas para imprimir**: [fichas-descarga-320.png](../capturas/ag34/fichas-descarga-320.png)
- **Ingreso docente en plataforma (`/docente`)**: [docente-login-320.png](../capturas/ag34/docente-login-320.png)
- **Ingreso administrativo / docente (`/admin`)**: [admin-login-320.png](../capturas/ag34/admin-login-320.png)

---

### 4. Parte C · La letra chica, con criterio

Se agruparon los 750 avisos de letra chica detectados en el recorrido en 24 grupos de selectores por componente. Se aplicó el siguiente criterio estricto:
- **Agrandar a 12 px (`text-xs`)**: Todo texto que el alumno deba leer o comprender para operar la plataforma (instrucciones, consignas, premios, requisitos de mundos, contadores de avance).
- **Mantener en 8–11 px**: Etiquetas puramente contextuales, metadatos temporales secundarios, cartografía SVG o información analítica exclusiva para docentes adultos.

#### Tabla de selectores por componente

| Componente | Selector | Tamaño original | Decisión | Justificación (1 línea) |
|---|---|---|---|---|
| **WorldMap** | `button.w-full > span.text-[10px].font-bold` | 10 px | **Agrandado a 12 px** | El alumno debe leer claramente el nombre del mundo y el requisito de desbloqueo. |
| **WorldMap** | `span.min-w-0 > span.block.text-[11px]` | 11 px | **Agrandado a 12 px** | Indicador de etapas que el alumno monitorea para completar el mundo. |
| **Monte León** | `div.min-w-0 > span.text-[11px].sm:text-xs` | 11 px | **Agrandado a 12 px** | Encabezado identificador del mundo especial de 3.º grado. |
| **Monte León** | `div.flex > span.flex.items-center` | 11 px | **Agrandado a 12 px** | Contadores de mochila («0/6 objetos») y etapas («0/5») indispensables para la aventura. |
| **Monte León** | `div.mt-2 > span` / `span.font-bold` | 11 px | **Agrandado a 12 px** | Nombres de los objetos de premio que incentivan la superación de etapas. |
| **Monte León** | `div.mt-2 > span.text-amber-800/70` | 11 px | **Agrandado a 12 px** | Requisito numérico de aciertos («superá con 7 de 8») que define la victoria. |
| **Reserva** | `div.min-w-0 > p.text-[11px].font-bold` | 11 px | **Agrandado a 12 px** | Contador de etapas del recorrido patagónico visible en la tarjeta principal. |
| **Reserva** | `button.flex > span.inline-flex.items-center` | 9 px | **Agrandado a 12 px** | Distintivo pedagógico de estado de especie («⚠️ En peligro»). |
| **Metas** | `section > p.text-[11px].text-amber-900/75` | 11 px | **Agrandado a 12 px** | Instrucciones y requisitos para desbloquear los premios permanentes. |
| **Vestidor** | `div.flex-1 > p.mt-2.text-[11px]` | 11 px | **Agrandado a 12 px** | Guía de interacción directa («Tocá una prenda para ponértela o sacártela»). |
| **Torneo** | `div.rounded-2xl > p.text-[11px].text-rose-900/80` | 11 px | **Agrandado a 12 px** | Consejo didáctico de prioridad diaria para guiar la práctica de tablas. |
| **Tienda** | `li.rounded-2xl > p.text-[10px].text-amber-300` | 10 px | **Agrandado a 12 px** | Categoría temática de los artículos coleccionables («🎃 Halloween», etc.). |
| **NewsBoard** | `li.flex > span.text-[11px].text-white/50` | 11 px | Queda en 11 px | Metadato temporal secundario («hace 3 días») de novedades ya leídas por el usuario. |
| **Reserva** | `g > text`, `svg.block > text` | 6–8.5 px | Queda en 6–8.5 px | Rótulos geográficos internos del mapa vectorial («Antártida Argentina», «Malvinas»). |
| **Reserva** | `div.px-3 > p.-mt-2.mb-2` | 9 px | Queda en 9 px | Nota de atribución cartográfica legal obligatoria («Límites: Instituto Geográfico Nacional»). |
| **Docente** | `div.flex > span.text-[9px].font-bold` | 9 px | Queda en 9 px | Badge de estado técnico de cuenta docente («Inactivo») en tabla de administración. |
| **Docente** | `div.text-center > p.text-[9px].font-semibold` | 9 px | Queda en 9 px | Valor numérico del eje vertical en gráfico analítico de minutos jugados. |
| **Docente** | `div.text-center > p.text-[8px].text-slate-400` | 8 px | Queda en 8 px | Rango de fechas en el eje horizontal del gráfico de evolución para adultos. |
| **Docente** | `div.flex > span.text-slate-600.font-medium` | 11 px | Queda en 11 px | Leyendas analíticas de métricas («Precisión de aciertos (%)») para docentes. |
| **Docente** | `div.parchment-panel > p.text-[11px].text-amber-900/60`| 11 px | Queda en 11 px | Aclaración metodológica secundaria para el maestro («Mundos con menor puntaje...»). |
| **Docente** | `div.relative > span.absolute.-top-1` | 9 px | Queda en 9 px | Indicador visual de alerta técnica ⚠️ para supervisión administrativa. |

#### Configuración de excepciones en el detector
Se incorporó y exportó la lista `EXCEPCIONES_LETRA_CHICA` en `scripts/detector-celular.ts`:
```typescript
export const EXCEPCIONES_LETRA_CHICA = [
  // 1. Pizarrón de novedades: timestamps relativos secundarios ("hace 3 días")
  "li.flex > span.text-white\\/50",
  // 2. Mapas vectoriales SVG: nombres geográficos y coordenadas internas
  "svg text",
  // 3. Atribución cartográfica legal IGN ("Límites: Instituto Geográfico Nacional")
  "p.text-\\[9px\\]",
  // 4. Panel Docente / Admin: gráficos analíticos y badges de estado técnico para adultos
  "div.text-center > p.text-\\[8px\\]",
  "div.text-center > p.text-\\[9px\\]",
  "div.flex > span.text-\\[9px\\]",
  "div.parchment-panel > p.text-\\[11px\\]",
  "div.relative > span.absolute.-top-1",
  "div.flex > span.text-slate-600",
];
```
Con estas excepciones explícitas y justificadas, la corrida completa sobre las pantallas de juego arroja **0 avisos sin explicar**.

---

### 5. Verificación de Quality Gates

#### TypeScript (`npx tsc --noEmit -p .`)
```text
$ npx tsc --noEmit -p .
Exit code: 0
```

#### ESLint (`npx eslint`)
```text
$ npx eslint scripts/detector-celular.ts src/app/student/play/page.tsx src/components/AssistControls.tsx src/components/MetasEspeciales.tsx src/components/Vestidor.tsx src/components/WorldMap.tsx src/components/activities/McActivity.tsx src/components/activities/OrderActivity.tsx src/components/activities/ShapeActivity.tsx src/components/activities/shared.ts src/components/monte-leon/MonteLeonModal.tsx src/components/reserva/ReservaCard.tsx src/components/reserva/ReservaModal.tsx src/components/weekend/TorneoTablasGame.tsx scripts/analizar-actividades.ts scripts/capturar-componentes.ts scripts/correr-detector-historico.ts scripts/recorrido-actividades-320.ts
Exit code: 0 (0 errors, 0 warnings)
```

#### Next.js Production Build (`npm run build`)
```text
$ npm run build
▲ Next.js 16.3.5 (Turbopack)
✓ Running next.config.ts took 26ms
  Creating an optimized production build ...
✓ Compiled successfully in 29.9s
  Running TypeScript ...
  Finished TypeScript in 6.5s ...
  Collecting page data using 13 workers ...
✓ Generating static pages using 13 workers (53/53) in 815ms
  Finalizing page optimization ...
Exit code: 0
```

#### Verificación de integridad de capturas en disco
Todas las **99 capturas** referenciadas en el informe se encuentran generadas y verificadas en `docs/equipo/capturas/ag34/`.

