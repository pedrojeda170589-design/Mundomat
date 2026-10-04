# AG-15 · Seguimiento de AG-07 a AG-12 (detalles menores)

**Asignada a:** Antigravity · **Revisa:** Claude · Hacela **después de AG-14**. Antes: `git merge main`.

Claude revisó AG-07 a AG-12 y los unió a main. De paso corrigió los problemas graves:
- Límite de intentos: ya no bloquea a toda el aula.
- Reportes imprimibles vacíos.
- Conteos ×3 en la vista de directivo.
- Prueba de la base de datos debilitada.
- Alertas con alumnos de todas las aulas.
- Umbral de alertas que no se volvía a leer.
- Currículo que cambiaba una variable global.
- Nombre visible de la plataforma.
- Fecha de nacimiento con año 2000.
- Un PATCH por cada letra en el nombre visible.
- Días activos en UTC.
- Rótulo del CSV.

**No vuelvas a tocar esas partes** (`src/lib/rateLimit.ts`, sus usos en las rutas, `StudentBlock.tsx`,
`TeacherAlertsBanner.tsx`, `curriculum/route.ts`, la migración `20261004000100`).

Quedan estos detalles:

1. **Nombres repetidos:** competencia, fin de semana y `world-attempt` muestran «Santiago» donde el buzón muestra
   «Santiago S.». Usá la misma función que resuelve los nombres repetidos en todas las rutas
   (`competition/route.ts` ~164, 189, 415; `weekend`; `world-attempt`).
2. **Rendimiento del panel:** `/admin` pide `withProgress=true` y trae el registro completo de actividades de
   todos los alumnos. Mandá una versión resumida, como `liteProgress` más lo que necesiten la grilla y las
   alertas.
3. **Porcentaje de dominio duplicado:** 80/85/90 está escrito a mano en `dashboard` y `courseSummary`. Usá
   `masteryPctForWorld` / `grades.ts`.
4. **Planes:** `puedeUsar` / `limiteDe` solo se miran en la pantalla. Hacé que las rutas de la plataforma
   que crean aulas o alumnos los respeten (por ejemplo, los cupos de alumnos del plan). Las escuelas que ya
   existen deben quedar en «escuela» y no en «piloto_gratuito»: proponelo en el resumen, sin migrar datos.
5. **Currículo:** la validación de un mundo hoy vale para Santa Cruz y para NAP a la vez. Guardala por currículo
   (`curriculumValidated:santa-cruz` / `:nap`), conservando las validaciones que ya existen para Santa Cruz.

Comprobar: todas las pruebas de `scripts/test-*.ts`, `npx tsc --noEmit`, `npx eslint src`, `npm run build`.
