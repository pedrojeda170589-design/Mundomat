# AG-07 · Privacidad de menores (PRIORIDAD 1)

Leé primero `_COMUN-mejoras-panel.md`.

## 1. Nombre para mostrar
- Campo nuevo `displayName` en `Student` (opcional en el tipo; los alumnos viejos no lo tienen) y,
  en la plataforma, usá la columna que ya existe `students.nickname`.
- Al **agregar** un alumno (`/admin` → Alumnos, y `/docente/aula`), el docente escribe el nombre
  completo y el **nombre para mostrar**. Se **propone** un valor, pero el docente lo confirma o
  corrige: en los datos reales el orden es inconsistente ("De Urquiza Iñaki" tiene el apellido
  primero; "Lorenzo Daniel Perez Veron", el nombre primero). **No** tomes la primera palabra
  automáticamente sin confirmación.
- Editable después desde el detalle del alumno.
- **Duplicados**: si dos alumnos del mismo curso tienen el mismo nombre para mostrar, a los dos se
  les agrega la inicial del apellido ("Santiago S."). Calculalo al mostrar, no lo guardes pisado.
- **Migración de los existentes**: en `/admin` → Alumnos, un aviso «Confirmá cómo se muestra el
  nombre de cada alumno» con la lista de propuestas editables y un botón Confirmar. Hasta que el
  docente confirme, en las vistas de alumnos se muestra la propuesta (nunca el nombre completo).

## 2. Usarlo en todo lo que ven los alumnos
- Buscá **todos** los lugares donde un alumno ve el nombre de otro: Pizarrón de novedades
  (`NewsBoard`, saludos de cumpleaños), Buzón (`ClassMailbox`, `/api/messages`), competencia
  (`/api/competition`, `src/app/student/competencia/**`), rankings, `/api/news`, y cualquier
  API que devuelva datos de compañeros. Ahí solo va `displayName` (resuelto con duplicados).
- Las **APIs** no deben devolver el nombre completo de compañeros (no alcanza con no mostrarlo).
- El propio alumno puede ver su nombre para mostrar en «¡Hola, …!».
- El nombre completo queda **solo** en el Panel Docente y en `/docente`.
- Verificá que los logros y saludos de compañeros se vean **solo dentro del mismo curso**
  (`sameClassroom` / `classmatesOf` en `data.ts`; aula abierta de prueba incluida).

## 3. Datos sensibles: fecha de nacimiento
- Pedro ve muchas fechas `04/10/2018` en el panel: averiguá si es un valor por defecto del
  formulario o del guardado. Un valor por defecto **nunca** se guarda como dato real: si no se
  cargó, queda vacío.
- Proponé (y dejá implementado detrás de una decisión de Pedro) guardar **solo día y mes** de
  cumpleaños: alcanza para el saludo. Si hoy se guarda la fecha completa, la vista de alumnos no
  la muestra nunca (solo «🎂 hoy cumple años»).
- Limpieza opcional de datos viejos: un script `scripts/privacidad/limpiar-fechas.ts` que
  **lista** las fechas sospechosas (iguales en muchos alumnos) y las borra solo con `--aplicar`.

## 4. Código de acceso
- **Límite de intentos** en el ingreso con código (`/api/progress` y cualquier otro endpoint que
  acepte un código): por ejemplo 8 intentos fallidos por IP en 10 minutos → bloqueo de 10
  minutos con un mensaje amable («Esperá unos minutos y probá de nuevo»). Guardalo en el store
  (Upstash) con expiración; que funcione igual en local.
- Verificá que un código **no sirva cruzado**: con un código de un aula no se pueden leer ni
  escribir datos de otra aula (revisá las APIs que reciben `code` y otro identificador).
- Agregá un test `scripts/test-privacidad.ts`: ninguna API para alumnos devuelve `name` de
  compañeros; duplicados de nombre para mostrar; bloqueo por intentos.

## Pendiente para Pedro (anotalo)
- ¿Fecha completa o solo día y mes?
- Texto del aviso de confirmación de nombres.
