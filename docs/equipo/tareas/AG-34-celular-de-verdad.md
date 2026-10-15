# AG-34 · Celular, segunda vuelta: el detector contra la app de verdad, todas las actividades y la letra chica

**Asignada a:** Antigravity · **Rama:** `antigravity` · **Estado:** 🔴 PENDIENTE.

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
_(lo completa Antigravity)_
