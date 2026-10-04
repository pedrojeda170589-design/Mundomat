# AG-10 · Reportes imprimibles (PRIORIDAD 4)

Leé primero `_COMUN-mejoras-panel.md`. Usa lo de AG-08 y AG-09.

## 1. Reporte por alumno (para reuniones con familias)
- Desde el detalle del alumno, botón «🖨️ Reporte para la familia» que abre una página
  imprimible (`/admin/reporte/alumno?code=…`, con estilos `@media print`; «Guardar como PDF»
  desde el navegador alcanza, no hace falta una librería de PDF).
- Contenido: nombre completo, grado, período elegido (este mes / trimestre / año), mundos
  completados, % de aciertos, tiempo jugado (`timeSpentSeconds`), fortalezas, contenidos a
  reforzar (con su vínculo curricular de AG-09) y evolución (gráfico simple por semana).
- **Lenguaje para familias**: claro, positivo, sin tecnicismos ni porcentajes sueltos sin
  explicar. Ejemplo: «Lee palabras con sílabas trabadas con mucha seguridad. Para seguir
  creciendo, conviene practicar en casa las sumas que llevan dieces.»
- Una página A4 si se puede. Sin datos de otros alumnos.

## 2. Reporte por aula
- PDF (página imprimible) con la grilla del Resumen del curso y la lista «A quién ayudar
  primero».
- **CSV** descargable (separador `;`, UTF-8 con BOM para que Excel lo abra bien en español):
  una fila por alumno, columnas por mundo con el mejor %, más actividad de la semana.

## Probar
Generá los reportes de 3 alumnos reales del aula piloto y del aula, abrí el CSV en una
planilla; revisá que no aparezcan nombres completos de otros chicos en el de un alumno.
