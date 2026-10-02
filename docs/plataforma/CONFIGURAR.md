# Escuelas, aulas y docentes: cómo activar la plataforma

La plataforma ya está programada: falta conectarla a una base de datos (Supabase).
Hoy `https://mundomat.vercel.app/docente` muestra «La plataforma todavía no está
configurada». Son unos 20 minutos, una sola vez.

## Cómo queda funcionando

| Quién | Qué ve y qué puede hacer |
|---|---|
| **Vos (administrador general)** | Todas las escuelas. Creás escuelas y nombrás a la dirección de cada una. Además seguís teniendo `/admin` para tu aula piloto. |
| **Dirección de una escuela** | Solo su escuela: crea aulas (grado, división, ciclo), asigna docentes a cada aula, mueve alumnos y cierra el ciclo lectivo. |
| **Docente** | Solo **sus** aulas y **sus** alumnos: los inscribe (cada alumno recibe su código para jugar), habilita mundos y ve informes. No ve otras aulas ni otras escuelas. |
| **Alumno** | Entra al juego con su código, como siempre, y juega los mundos de su grado. |

La separación no depende de la pantalla: la hace la base de datos con permisos por
fila (Row Level Security). Aunque alguien quisiera, el servidor no le entrega datos
de un aula que no es suya.

## Paso 1 · Crear el proyecto en Supabase (gratis)

1. Entrá a <https://supabase.com>, creá una cuenta y tocá **New project**.
2. Nombre: `mundotest26`. Región: **South America (São Paulo)**. Elegí una contraseña
   de base de datos y guardala en un lugar seguro.
3. Esperá un par de minutos a que termine de crearse.

## Paso 2 · Crear las tablas y los permisos

En Supabase → **SQL Editor** → **New query**. Copiá y pegá **el contenido completo**
de cada archivo, en este orden, y tocá **Run** en cada uno:

1. `supabase/migrations/20260929000100_plataforma_base.sql`
2. `supabase/migrations/20260929000200_permisos_rls.sql`
3. `supabase/migrations/20260929000300_funciones_panel.sql`

Cada uno tiene que terminar en «Success. No rows returned».

## Paso 3 · Configurar el inicio de sesión

Supabase → **Authentication** → **URL Configuration**:

- **Site URL:** `https://mundomat.vercel.app`
- **Redirect URLs:** agregá `https://mundomat.vercel.app/docente`

En **Authentication → Providers → Email**, dejá activado «Confirm email».

## Paso 4 · Conectar la app (Vercel)

Supabase → **Project Settings → API**. Vas a copiar tres datos.

Vercel → proyecto **mundomat** → **Settings → Environment Variables**. Agregá
(para *Production*, *Preview* y *Development*):

| Nombre | Valor (de Supabase → API) |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` (**secreta**: no la compartas ni la pegues en el código) |

Después: **Deployments** → los tres puntitos del último → **Redeploy**.

## Paso 5 · Hacerte administrador general

1. Entrá a `https://mundomat.vercel.app/docente` → **Crear cuenta** con
   `pedrojeda170589@gmail.com`. Confirmá desde el email.
2. Supabase → SQL Editor: pegá el contenido de `supabase/bootstrap_super_admin.sql`
   y tocá **Run**. Tiene que aparecer tu email con `super_admin`.
3. Volvé a `/docente`: vas a ver el botón **🌐 Todas las escuelas**.

## Paso 6 · Usarla

1. **🌐 Todas las escuelas** → crear la escuela (nombre y un código corto, por ejemplo
   `EHPR2-GG`). Si vos sos también la dirección, poné tu email en «email de la dirección».
2. Entrá a la escuela → **Nueva aula**: grado, división y ciclo (por ejemplo 1.º A 2026).
3. Cada docente crea su cuenta en `/docente` (**Crear cuenta**). Después, en la
   escuela, escribís su email en el aula y tocás **Asignar**.
4. El docente entra a su aula → inscribe a sus alumnos → cada uno recibe su **código**
   para entrar a jugar en la página principal.

## Preguntas frecuentes

- **¿Se pierde el aula piloto?** No. `/admin` sigue igual, con tus alumnos de siempre.
- **¿Y si no configuro Supabase?** El juego sigue funcionando como hasta hoy; solo
  `/docente` muestra el aviso de «no configurada».
- **¿Cuánto cuesta?** El plan gratuito de Supabase alcanza para varias escuelas
  (500 MB de base de datos). Si un proyecto gratuito no se usa por una semana,
  Supabase lo pausa; se reactiva con un clic desde su panel.
