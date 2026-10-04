# Reglas comunes de AG-07 a AG-12 (mejoras para vender a escuelas)

Pedido de Pedro: el valor principal está del lado del **docente y del directivo**. Estas tareas
van **después de AG-06**, una por vez y en orden (AG-07 → AG-12). Cada una se une a `main` antes
de empezar la siguiente.

- **Explorá antes de cambiar**: componentes, `src/lib`, `src/app/admin/**` (Panel Docente de
  siempre: pestañas Alumnos, Habilitar Mundos, Registro y Fortalezas), `src/app/docente/**`
  (plataforma de escuelas con Supabase), `src/types/index.ts` y `src/lib/data.ts`. Seguí sus
  convenciones; no asumas rutas ni nombres.
- **Hay dos sistemas de datos** y los dos tienen que quedar coherentes:
  1. El juego y el aula piloto: `src/lib/store.ts` (Upstash en producción, `.data/db.json` en
     local), alumnos en la clave `students`, progreso en `progress:<CODE>`.
  2. La plataforma de escuelas (`/docente`, `supabase/migrations/**`, permisos por fila). Todavía
     no está conectada en producción: todo tiene que seguir funcionando **sin** Supabase.
     Si cambiás el esquema, hacelo con una **migración nueva** en `supabase/migrations/`
     (nunca edites las existentes) y probala en un Postgres local (ver CL-05 en `TAREAS.md`).
- **Datos existentes**: nada se borra ni se pisa. Migraciones seguras, idempotentes y
  reversibles (si agregás un campo, el valor viejo sigue sirviendo). Antes de probar en local,
  copiá `.data/db.json` y restauralo al terminar.
- **Modo offline**: hoy la app no tiene modo offline (no hay service worker). No lo rompas si
  aparece, y no agregues dependencias de servicios externos nuevos.
- **Probá con datos reales**: el aula piloto de 19 alumnos de `.data/db.json`, más
  `scripts/test-cuentos.ts`, `scripts/test-simulation.ts` y los tests que agregues. Siempre:
  `npx tsc --noEmit`, `npx eslint src`, `npm run build`.
- Textos de interfaz en español rioplatense, claros. Nada de jerga técnica para docentes ni
  familias.
- **No tocar**: `src/lib/cuentos/{catalogo,recorrido,actividades,tipos,voz}.ts`,
  `ListenActivity.tsx`, `src/lib/musica.ts`, `public/theme/**`, `public/audio/**`.
- **Al terminar cada tarea**, en el resumen de `TAREAS.md`:
  1. qué cambiaste y qué archivos tocaste;
  2. cómo lo probaste;
  3. **decisiones pendientes para que revise Pedro** (en una lista aparte).
