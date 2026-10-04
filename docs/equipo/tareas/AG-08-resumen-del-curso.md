# AG-08 · Panel Docente: Resumen del curso (PRIORIDAD 2)

Leé primero `_COMUN-mejoras-panel.md`. Va después de AG-07 (usá el nombre completo en el panel).

## 1. Pestaña nueva «📋 Resumen del curso» en `/admin`
- **Grilla**: alumnos en filas, mundos habilitados en columnas (agrupados por materia, con su
  emoji y nombre corto en el encabezado). Color por estado de cada alumno en cada mundo:
  🟩 ≥ 90 % · 🟨 50–89 % · 🟥 < 50 % · ⬜ no jugado. Usá el **mejor puntaje** del alumno en ese
  mundo (aclaralo en una leyenda) y el umbral de dominio de su grado si difiere.
  Celda con `title` («Ana: 72 % en 2 vueltas»). Que se pueda filtrar por materia y que tenga
  scroll horizontal en celular.
- **Métricas arriba**: promedio de aciertos del aula, alumnos activos esta semana (con al menos
  una actividad en los últimos 7 días), los 3 mundos más difíciles del curso (menor promedio,
  mínimo 3 alumnos que lo jugaron).
- **«A quién ayudar primero»**: lista ordenada de alumnos con más mundos en rojo o sin actividad
  en 7 días, con el motivo («3 mundos en rojo», «no juega hace 9 días»).
- Clic en un alumno → abre su detalle actual (el mismo de la pestaña Alumnos).
- Rendimiento: el aula de 19 alumnos tiene que cargar rápido (usá `getClassSnapshot` /
  `getProgressMany`; nada de una llamada por alumno).
- Si sobra tiempo, la misma vista en `/docente/aula` (plataforma) con los datos de Supabase.

## 2. Rótulos claros en «Registro y Fortalezas»
Hoy «🌱 Mundos a tratar» y «📌 Contenidos a fortalecer» (`src/app/admin/dashboard/page.tsx`)
parecen decir lo mismo. Revisá qué calcula cada uno y dejalos así (ajustá si el cálculo no
coincide):
- «🌱 Mundos jugados con bajo desempeño» — ayuda: «Mundos que el alumno ya jugó pero todavía no
  llegó al X %. Conviene repasarlos.»
- «📌 Contenidos todavía no trabajados» (o lo que realmente muestre) — ayuda breve debajo.

## Probar
Con el aula piloto real: la grilla coincide con el detalle de cada alumno (chequeá 3 alumnos a
mano), las métricas con un cálculo independiente en un test.
