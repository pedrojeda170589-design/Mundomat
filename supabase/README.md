# Plataforma MundoTest26 (Supabase)

Esta carpeta convierte a MundoTest26 en una plataforma multi-escuela **sin cambiar el juego**:

- Los chicos siguen entrando con su código y jugando igual. El juego sigue guardando su estado en Upstash.
- Si la plataforma está configurada, además cada respuesta y cada vuelta de mundo se guardan en un **historial académico** en Supabase. Ese historial guarda la escuela, el aula y el ciclo, y no se puede modificar.
- El **panel de la plataforma** está en `/docente` y tiene cuentas por email. El panel de siempre (`/admin`) sigue funcionando para el aula piloto.

Si no configurás nada, la app funciona exactamente como antes.

## Regla del modelo

> EL ALUMNO ES PERMANENTE. EL AULA CAMBIA. EL CICLO LECTIVO CAMBIA. EL HISTORIAL ACADÉMICO PERMANECE.

| Tabla | Qué guarda |
|---|---|
| `schools` | Escuelas |
| `school_cycles` | Ciclo lectivo por escuela (abierto / cerrado) |
| `classrooms` | Aulas: escuela, grado, división, ciclo y mundos habilitados |
| `profiles`, `user_roles` | Cuentas y roles (`teacher`, `school_admin`, `super_admin`, `family`, `student`) |
| `teacher_classrooms` | Docente ↔ aulas (un docente puede tener varias aulas) |
| `students` | Identidad **permanente** del alumno (su código de siempre) |
| `student_enrollments` | En qué aula estuvo cada ciclo (trayectoria) |
| `activity_results`, `world_attempts`, `achievements` | Historial **inmutable**, con su contexto (aula, escuela y ciclo) |
| `student_world_progress` | Estado actual de cada mundo para cada alumno |
| `licenses` | Preparada para licencias futuras (familia, escuela, institución) |

## Puesta en marcha (una sola vez)

1. **Crear el proyecto** en [supabase.com](https://supabase.com) (el plan gratuito alcanza para el piloto).
2. **Aplicar las migraciones.** En *SQL Editor* pegá y ejecutá, en este orden, cada archivo de `supabase/migrations/`:
   1. `20260929000100_plataforma_base.sql`
   2. `20260929000200_permisos_rls.sql`
   3. `20260929000300_funciones_panel.sql`

   Las migraciones se pueden volver a correr sin problema: no borran nada.
3. **Variables en Vercel** (*Settings → Environment Variables*), sacadas de *Project Settings → API* en Supabase:

   | Variable | Valor |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clave `anon` (pública) |
   | `SUPABASE_URL` | Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | clave `service_role` (**secreta**: solo en Vercel, nunca en el código) |

   Después, volvé a desplegar.
4. **Crear tu cuenta.** Entrá a `/docente` → *Crear cuenta*. Si Supabase pide confirmar el email, confirmalo.
5. **Hacerte super admin** (el único rol global). Ejecutá en el SQL Editor:
   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'super_admin' from auth.users where email = 'TU-EMAIL';
   ```
6. **Pasar el aula piloto a la plataforma.** Se copian los alumnos con sus mismos códigos, su historial, sus mundos y sus logros. El script no borra nada del juego y se puede correr más de una vez sin duplicar datos. Desde la carpeta del proyecto, con las variables de Upstash y de Supabase en `.env.local`:
   ```bash
   ESCUELA_NOMBRE='Escuela Hogar Primaria Provincial Rural N.º 2 "Héroes de Malvinas"' \
   ESCUELA_CODIGO=EHPPR2-HM GRADO=3 DIVISION=A CICLO=2026 DOCENTE_EMAIL=tu@email \
   npm run migrar:plataforma            # prueba: muestra qué haría, no escribe nada
   # ... y si está bien:
   npm run migrar:plataforma -- --aplicar
   ```
   El script guarda una copia de seguridad de lo que lee en `backups/`. Esa carpeta no se sube a GitHub porque tiene datos de alumnos.

## Quién ve qué (lo decide la base con RLS)

- **super_admin:** toda la plataforma.
- **school_admin:** solo su escuela. Crea aulas, asigna docentes, cierra el ciclo, recibe alumnos trasladados y promueve alumnos.
- **teacher:** solo sus aulas y sus alumnos. Del alumno que tiene **hoy** ve toda su trayectoria. De un alumno que tuvo antes ve solo su propio período.
- **student** (si en el futuro tiene cuenta): solo sus datos.
- **Nadie** puede modificar ni borrar resultados: lo impide la base, incluso para el servidor.
- El id de un aula en la dirección web no da acceso: sin permiso, la base no devuelve nada.

## Promoción, permanencia, cambios y traslados

- **Mismo alumno, mismo código, mismo avatar, mismo historial.** Solo se agrega una inscripción nueva.
- Desde el aula, en *Promoción y cambios*:
  - **Promover:** a un grado mayor en un ciclo posterior.
  - **Permanencia:** al mismo grado en un ciclo posterior.
  - **Cambio de aula o división:** dentro del mismo ciclo.
- **Cambio de escuela:** lo hace la escuela que recibe al alumno, con su código, en *Gestión de escuela → Recibir un alumno*.
- **Cierre de ciclo:** desde *Gestión de escuela*. Después del cierre no entran resultados nuevos a ese ciclo y sus aulas no se editan. Solo el super admin puede reabrirlo.

## Pruebas

Contra un Postgres local con las migraciones aplicadas (se usa `supabase/tests/local_supabase_shim.sql` para imitar lo mínimo de Supabase):

```bash
DATABASE_URL="postgres://..." npm run test:db
```

Las pruebas cubren:

- los 5 casos de seguridad pedidos;
- el super admin y los visitantes sin sesión;
- la inmutabilidad del historial y la deduplicación;
- la prueba crítica: 3.º A 2026 → 4.º A 2027 → Escuela B 5.º A 2028;
- la permanencia, el cambio de división, el cambio de docente y la baja;
- el cierre de ciclo;
- el legajo.

`supabase/tests/local-gateway.mjs` imita la API y el login de Supabase para probar la app completa en una computadora sin cuenta real.
