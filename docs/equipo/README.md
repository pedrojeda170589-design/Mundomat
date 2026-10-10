# Trabajo en equipo: Claude + Antigravity

MundoTest26 lo desarrollan dos agentes en paralelo sobre el mismo repositorio,
coordinados por Pedro (docente y dueño del proyecto).

| Agente | Dónde trabaja | Rama |
|---|---|---|
| **Claude** (Cowork) | `C:\Users\Remberto Pedro\mundomat-git` | `main` |
| **Antigravity** | `C:\Users\Remberto Pedro\mundomat-antigravity` (git worktree) | `antigravity` |

Las dos carpetas comparten el mismo historial de git: cada una tiene su propia
rama, así nunca se pisan los archivos.

## Cómo se reparte el trabajo

1. Las tareas están en [`TAREAS.md`](./TAREAS.md). Cada tarea tiene un archivo
   con el detalle en `tareas/` (qué hacer, qué archivos tocar, qué NO tocar y
   cómo comprobar que funciona).
2. Cada agente toma **solo** las tareas asignadas a él.
3. Al terminar una tarea:
   - comprueba `npx tsc --noEmit`, `npx eslint src` y `npm run build` (sin errores);
   - hace commit en **su** rama, con un mensaje en español que diga qué hizo;
   - marca la tarea como `✅ LISTA PARA REVISAR` en `TAREAS.md` (en su rama) y
     escribe abajo de la tarea un resumen de lo que hizo y lo que quedó pendiente.
4. Claude revisa, prueba y une (`git merge antigravity`) en `main`. Pedro sube
   con `git push origin main`.

## Reglas para no pisarse

- **No editar archivos que figuran como "de Claude"** en la tarea, salvo los
  puntos de conexión que la tarea autoriza explícitamente.
- **Nunca** hacer `git push`, `git reset --hard`, `git rebase` sobre `main`,
  ni borrar ramas. Pedro es quien sube a GitHub.
- No subir secretos (`.env*`, claves) ni datos de alumnos (`.data/`, `backups/`).
- Antes de empezar una tarea: `git merge main` en la rama `antigravity` para
  traer lo último.
- Si una tarea necesita cambiar algo compartido (por ejemplo `src/types/index.ts`
  o `src/lib/data.ts`), hacer el cambio **mínimo y agregado** (no reescribir lo
  que existe) y anotarlo en el resumen de la tarea.

## Reglas del proyecto (para los dos)

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. Leer
  `AGENTS.md`: esta versión de Next tiene cambios; ante dudas, consultar
  `node_modules/next/dist/docs/`.
- Comentarios y textos de la interfaz en **español rioplatense** (vos, tenés…),
  claros para chicos de primaria.
- La app la usan **menores**: nada de texto libre entre alumnos, nada de datos
  personales innecesarios, nada de rankings por tiempo de uso ni mensajes que
  presionen a jugar más.
- El almacenamiento del juego es `src/lib/store.ts` (`getJSON` / `setJSON`):
  Upstash Redis en producción y `.data/db.json` en local. **Nunca** importar
  `@/lib/store` (ni archivos que lo importen) desde componentes `"use client"`.
- La plataforma Supabase (`/docente`, `supabase/`) es opcional: todo debe seguir
  funcionando sin las variables de Supabase.
- No romper lo que existe: 3.º grado, mundos, aventura del finde, competencia,
  buzón, pizarrón, tienda, avatares.
- **Opciones mezcladas (desde el 8/10/2026):** `buildActivitiesForWorld` pasa
  todas las actividades por `mezclarOpciones` (`src/lib/activities.ts`): las
  opciones de `mc`, `find-error`, `shape-identify`, `timed`, las
  justificaciones de `true-false`, `count` y `classify` se mezclan en cada
  vuelta. En los bancos se puede seguir escribiendo la correcta primero, pero
  **nunca** escribas una opción que dependa de su lugar («todas las
  anteriores», «la de arriba»). Si armás actividades fuera de esa función
  (como Monte León), mezclalas vos.
- **Desafíos y eventos (desde el 8/10/2026):** todo lo que aparece por fecha o
  por día (aventura de fin de semana, repaso de las tablas, dictado, Monte
  León, competencia, zonas de práctica, festividades, temporadas de la tienda
  y drops) se configura en el panel, pestaña «🗓️ Desafíos y eventos»
  (`src/lib/eventos/`). Si sumás un desafío o un evento nuevo, agregalo a
  `DESAFIOS` (`src/lib/eventos/config.ts`) y a `catalogoEventos()`
  (`src/lib/eventos/catalogo.ts`), y decidí si está activo con
  `desafioActivo(...)` / `eventoActivo(...)` con la regla de siempre como
  «automático». Prueba: `scripts/test-eventos.ts`.
- **Mundos bloqueados:** el servidor no acredita un mundo común que el
  docente bloqueó (`mundoHabilitadoPara` en `src/lib/data.ts`, usado por
  `/api/world-attempt` y `/api/round`).
- **Apoyos visuales (desde el 8/10/2026):** en 1.º a 3.º toda actividad de
  Matemática que hable de números, cálculos, medidas o la hora tiene que traer
  un `apoyo` (`src/lib/activities.ts`, tipo `Apoyo`): `fila` («la fila del 80»
  con toda la secuencia), `cuadro`, `recta` (con `salto` para sumar/restar o
  multiplicar), `bloques`, `reloj`, `dinero` o `grupos`. Lo dibuja
  `src/components/activities/Apoyos.tsx`. Si un apoyo daría la respuesta de
  regalo, usá `ocultar` para poner un «?» en ese casillero.
- **Cuentos:** se narran siempre con la voz del navegador, oración por
  oración (no se usan audios grabados).
- **Informe del docente por contenidos (desde el 10/10/2026):** cada mundo es
  un contenido del programa con su eje. `src/lib/informeContenidos.ts` decide
  si es fortaleza, en desarrollo, a reforzar o sin trabajar, para **todos los
  grados**. Un mundo nuevo tiene que tener su `description` (el contenido) y su
  entrada curricular (eje), o aparece en «Otros». No muestres al alumno
  porcentajes ni cantidades de pendientes: eso es solo para el docente.
