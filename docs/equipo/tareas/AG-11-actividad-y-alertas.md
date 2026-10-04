# AG-11 · Actividad, alertas y evolución (PRIORIDAD 5)

Leé primero `_COMUN-mejoras-panel.md`.

## 1. Métricas de actividad
- Por alumno: racha actual (días seguidos con actividad), días activos en la semana y en el mes,
  última conexión («hace 3 días»). Mostralo en el detalle del alumno y como columna en el
  Resumen del curso.
- Por aula: % de alumnos activos en los últimos 7 días.
- Calculá a partir de lo que ya se guarda (registro de actividades con fecha); si falta un dato,
  agregá el mínimo necesario al progreso (por ejemplo `activeDays: string[]` con `YYYY-MM-DD`,
  acotado a los últimos 120 días).

## 2. Alertas para el docente
- Al entrar al panel, una tarjeta «🔔 Para mirar» con: alumnos sin actividad en X días
  (configurable, por defecto 7) y alumnos con **caída marcada** de aciertos (por ejemplo, el
  promedio de la última semana 20 puntos por debajo de su promedio de las 3 anteriores; dejá el
  criterio en una constante explicada).
- Configuración simple en el panel (X días), guardada en el store.
- Sin notificaciones por mail todavía.

## 3. Evolución en el tiempo
- Gráfico simple (SVG propio, sin librerías nuevas pesadas) de aciertos y tiempo por semana:
  por alumno (en su detalle y en el reporte de AG-10) y por aula (en el Resumen del curso).

## Probar
Datos reales del aula piloto y casos armados en un test (`scripts/test-actividad.ts`): racha,
días activos, caída marcada, alumno sin actividad.
