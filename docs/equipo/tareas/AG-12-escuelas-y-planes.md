# AG-12 · Vista de directivo y modelo de planes (PRIORIDAD 6)

Leé primero `_COMUN-mejoras-panel.md` y CL-05 en `TAREAS.md`: la plataforma de escuelas ya
existe (`/docente`, `supabase/migrations/**`) con roles `teacher`, `school_admin` y
`super_admin`, permisos por fila probados y la tabla `licenses`. **Construí sobre eso.**

## 1. Vista de directivo (multi-aula)
- En `/docente/escuela` (rol `school_admin`): resumen por escuela con aulas, alumnos activos
  (7 días), promedio de aciertos por aula y **comparación entre aulas del mismo grado** (tabla
  y barras simples).
- Permisos: el docente ve solo sus aulas; el directivo, toda su escuela; el super admin, todo.
  Hacelo con **funciones SQL nuevas** (`security definer`, chequeando el rol como las
  existentes) en una **migración nueva**; probalas en Postgres local con el escenario de CL-05
  (dos escuelas, dos docentes, una dirección): un docente no puede ver el resumen de otra aula.

## 2. Modelo de planes (sin cobros)
- Planes: **Piloto/Gratuito**, **Escuela**, **Distrito**, con límites: cantidad de aulas,
  alumnos y funciones (por ejemplo: reportes PDF, resumen del curso, vista de directivo,
  fichas para familias).
- Definilos en un solo lugar (`src/lib/planes.ts`: nombres, límites y funciones de cada plan)
  y usá la tabla `licenses` existente (o una migración nueva aditiva) para asignar un plan a
  una escuela con vigencia.
- Función `puedeUsar(escuela, "reportes")` y `limiteDe(escuela, "alumnos")` que usen el panel y
  las APIs. El aula piloto de Pedro queda con todo habilitado.
- **No** implementar pagos ni pantallas de cobro: solo estructura y control de funciones, con un
  mensaje amable cuando algo no está incluido en el plan.

## Pendiente para Pedro
Qué incluye cada plan y sus límites (dejá valores de ejemplo marcados como provisorios).
