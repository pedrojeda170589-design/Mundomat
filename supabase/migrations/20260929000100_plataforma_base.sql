-- =====================================================================
-- MundoTest26 · Plataforma multi-escuela (fase 1: base institucional)
-- =====================================================================
-- Regla fundamental:
--   EL ALUMNO ES PERMANENTE (students).
--   EL AULA CAMBIA (student_enrollments, una fila por ciclo/aula).
--   EL CICLO LECTIVO CAMBIA (school_cycles).
--   EL HISTORIAL ACADÉMICO PERMANECE (activity_results / world_attempts
--   guardan el contexto en que se hicieron y no se pueden modificar).
--
-- Esta migración SOLO crea cosas nuevas: no borra ni modifica datos.
-- La seguridad la impone la base con Row Level Security (RLS): el
-- navegador del docente consulta con su propia sesión y la base decide
-- qué filas puede ver.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('student', 'teacher', 'family', 'school_admin', 'super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.enrollment_status as enum
    ('active', 'promoted', 'repeated', 'moved', 'transferred', 'withdrawn', 'finished');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.cycle_status as enum ('open', 'closed');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Utilidad: updated_at automático
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------------------------------------------------------------------
-- Escuelas
-- ---------------------------------------------------------------------
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  code text not null unique check (code ~ '^[A-Z0-9-]{3,32}$'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists schools_touch on public.schools;
create trigger schools_touch before update on public.schools
  for each row execute function public.touch_updated_at();

-- Ciclos lectivos por escuela (abierto / cerrado).
create table if not exists public.school_cycles (
  school_id uuid not null references public.schools(id),
  school_year int not null check (school_year between 2000 and 2100),
  status public.cycle_status not null default 'open',
  closed_at timestamptz,
  closed_by uuid,
  created_at timestamptz not null default now(),
  primary key (school_id, school_year)
);

-- ---------------------------------------------------------------------
-- Aulas
-- ---------------------------------------------------------------------
create table if not exists public.classrooms (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id),
  name text not null check (length(trim(name)) > 0),        -- "3.º A"
  grade smallint not null check (grade between 1 and 12),   -- 3
  division text not null default '' check (length(division) <= 10), -- "A"
  school_year int not null check (school_year between 2000 and 2100),
  -- Mundos habilitados por el docente para esta aula (ids de mundos).
  enabled_world_ids int[] not null default '{1}',
  -- El aula piloto usa la configuración "de siempre" del juego.
  is_legacy_pilot boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, school_year, grade, division)
);
create index if not exists classrooms_school_year_idx on public.classrooms (school_id, school_year);
drop trigger if exists classrooms_touch on public.classrooms;
create trigger classrooms_touch before update on public.classrooms
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Personas con cuenta (docentes, directivos, familias, administradores)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists profiles_email_idx on public.profiles (lower(email));
drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Al registrarse una cuenta se crea su perfil (sin ningún rol).
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)), new.email)
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Roles. Una misma persona puede tener varios (p. ej. docente en una
-- escuela y familia de un alumno).
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  school_id uuid references public.schools(id),
  created_at timestamptz not null default now(),
  check (
    (role in ('teacher', 'school_admin') and school_id is not null)
    or (role in ('super_admin', 'family', 'student') and school_id is null)
  )
);
create unique index if not exists user_roles_unique
  on public.user_roles (user_id, role, coalesce(school_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- Docente ↔ aulas (un docente puede tener varias aulas).
create table if not exists public.teacher_classrooms (
  teacher_id uuid not null references auth.users(id) on delete cascade,
  classroom_id uuid not null references public.classrooms(id),
  created_at timestamptz not null default now(),
  primary key (teacher_id, classroom_id)
);
create index if not exists teacher_classrooms_classroom_idx on public.teacher_classrooms (classroom_id);

-- ---------------------------------------------------------------------
-- Alumnos: identidad PERMANENTE (no depende de aula, grado ni escuela)
-- ---------------------------------------------------------------------
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  -- Código con el que el alumno entra al juego (el mismo de siempre).
  access_code text not null unique check (access_code ~ '^[A-Z0-9]{4,12}$'),
  full_name text not null check (length(trim(full_name)) > 0),
  nickname text,
  avatar text,
  avatar_accessories jsonb,
  avatar_background text,
  birth_date date,
  birthday_mmdd text check (birthday_mmdd is null or birthday_mmdd ~ '^\d\d-\d\d$'),
  -- Cuenta propia del alumno (opcional, para el futuro).
  user_id uuid unique references auth.users(id),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists students_touch on public.students;
create trigger students_touch before update on public.students
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Asignación académica: dónde estudió el alumno en cada ciclo
-- ---------------------------------------------------------------------
create table if not exists public.student_enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  school_id uuid not null references public.schools(id),
  classroom_id uuid not null references public.classrooms(id),
  school_year int not null,
  grade smallint not null,
  division text not null default '',
  start_date date not null default current_date,
  end_date date,
  status public.enrollment_status not null default 'active',
  previous_enrollment_id uuid references public.student_enrollments(id),
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Un alumno está en UN aula a la vez.
create unique index if not exists enrollments_one_active
  on public.student_enrollments (student_id) where status = 'active';
create index if not exists enrollments_classroom_idx on public.student_enrollments (classroom_id, status);
create index if not exists enrollments_student_idx on public.student_enrollments (student_id, school_year);
drop trigger if exists enrollments_touch on public.student_enrollments;
create trigger enrollments_touch before update on public.student_enrollments
  for each row execute function public.touch_updated_at();

-- La escuela, el ciclo, el grado y la división se copian del aula: nunca
-- los manda el cliente (así no pueden quedar inconsistentes).
create or replace function public.enrollment_fill_context() returns trigger
language plpgsql as $$
declare c public.classrooms;
begin
  select * into c from public.classrooms where id = new.classroom_id;
  if not found then raise exception 'Aula inexistente'; end if;
  new.school_id := c.school_id;
  new.school_year := c.school_year;
  new.grade := c.grade;
  new.division := c.division;
  return new;
end $$;
drop trigger if exists enrollments_fill on public.student_enrollments;
create trigger enrollments_fill before insert on public.student_enrollments
  for each row execute function public.enrollment_fill_context();

-- Una inscripción ya creada solo puede CERRARSE (cambiar de 'active' a un
-- estado final, con fecha de fin). No se puede mover a otra aula/ciclo:
-- para eso se crea una inscripción nueva. Así la trayectoria es fiel.
create or replace function public.enrollment_guard_update() returns trigger
language plpgsql as $$
begin
  if new.student_id <> old.student_id or new.classroom_id <> old.classroom_id
     or new.school_id <> old.school_id or new.school_year <> old.school_year
     or new.grade <> old.grade or new.division <> old.division
     or new.start_date <> old.start_date then
    raise exception 'El historial de inscripciones no se modifica: cree una inscripción nueva.';
  end if;
  if old.status <> 'active' and new.status <> old.status then
    raise exception 'La inscripción ya está cerrada.';
  end if;
  return new;
end $$;
drop trigger if exists enrollments_guard on public.student_enrollments;
create trigger enrollments_guard before update on public.student_enrollments
  for each row execute function public.enrollment_guard_update();

-- ---------------------------------------------------------------------
-- Historial académico INMUTABLE
-- ---------------------------------------------------------------------
-- Cada respuesta de actividad.
create table if not exists public.activity_results (
  id uuid primary key default gen_random_uuid(),
  -- Identificador que genera la app: si llega dos veces (reintentos,
  -- sincronización offline) no se duplica.
  client_id text not null unique,
  student_id uuid not null references public.students(id),
  enrollment_id uuid references public.student_enrollments(id),
  school_id uuid references public.schools(id),
  classroom_id uuid references public.classrooms(id),
  school_year int,
  world_id int not null,
  subject text not null,
  category text,
  activity_index int,
  correct int not null default 0 check (correct >= 0),
  incorrect int not null default 0 check (incorrect >= 0),
  attempts int not null default 1 check (attempts >= 1),
  time_spent_seconds int not null default 0 check (time_spent_seconds >= 0),
  source text not null default 'mundo',
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists results_student_idx on public.activity_results (student_id, school_year, subject);
create index if not exists results_classroom_idx on public.activity_results (classroom_id, occurred_at);

-- Cada vuelta completa de un mundo (10 actividades) y su resultado.
create table if not exists public.world_attempts (
  id uuid primary key default gen_random_uuid(),
  client_id text not null unique,
  student_id uuid not null references public.students(id),
  enrollment_id uuid references public.student_enrollments(id),
  school_id uuid references public.schools(id),
  classroom_id uuid references public.classrooms(id),
  school_year int,
  world_id int not null,
  subject text not null,
  correct_count int not null check (correct_count >= 0),
  total int not null check (total > 0),
  score_pct int not null check (score_pct between 0 and 100),
  outcome text not null,   -- completed | pending-retry | needs-review
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists attempts_student_idx on public.world_attempts (student_id, school_year);
create index if not exists attempts_classroom_idx on public.world_attempts (classroom_id, occurred_at);

-- Logros (medallas, premios de temporada, aventura del finde...).
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  kind text not null,         -- medalla | temporada | finde | competencia
  code text not null,
  enrollment_id uuid references public.student_enrollments(id),
  school_id uuid references public.schools(id),
  classroom_id uuid references public.classrooms(id),
  school_year int,
  earned_at timestamptz not null default now(),
  unique (student_id, kind, code)
);

-- Estado ACTUAL de cada mundo para cada alumno (esto sí cambia).
create table if not exists public.student_world_progress (
  student_id uuid not null references public.students(id),
  world_id int not null,
  status text not null check (status in ('available', 'pending_retry', 'needs_review', 'completed')),
  completed_at timestamptz,
  completed_school_year int,
  completed_classroom_id uuid references public.classrooms(id),
  updated_at timestamptz not null default now(),
  primary key (student_id, world_id)
);

-- Completa el contexto (inscripción activa → escuela, aula, ciclo) y
-- rechaza resultados en ciclos cerrados. Nunca se confía en el contexto
-- que manda el cliente.
create or replace function public.result_fill_context() returns trigger
language plpgsql as $$
declare e public.student_enrollments;
begin
  if new.enrollment_id is not null then
    select * into e from public.student_enrollments where id = new.enrollment_id and student_id = new.student_id;
  else
    select * into e from public.student_enrollments where student_id = new.student_id and status = 'active';
  end if;
  if found then
    new.enrollment_id := e.id;
    new.school_id := e.school_id;
    new.classroom_id := e.classroom_id;
    new.school_year := e.school_year;
    if exists (select 1 from public.school_cycles c
               where c.school_id = e.school_id and c.school_year = e.school_year and c.status = 'closed')
       and tg_argv[0] is distinct from 'allow_closed' then
      raise exception 'El ciclo % está cerrado para esta escuela.', e.school_year;
    end if;
  else
    new.enrollment_id := null;
    new.school_id := null;
    new.classroom_id := null;
    new.school_year := null;
  end if;
  return new;
end $$;

drop trigger if exists results_fill on public.activity_results;
create trigger results_fill before insert on public.activity_results
  for each row execute function public.result_fill_context();
drop trigger if exists achievements_fill on public.achievements;
create trigger achievements_fill before insert on public.achievements
  for each row execute function public.result_fill_context();
drop trigger if exists attempts_fill on public.world_attempts;
create trigger attempts_fill before insert on public.world_attempts
  for each row execute function public.result_fill_context();

-- Historial inmutable: no se modifica ni se borra (ni siquiera desde el
-- servidor). Una corrección se registra como un resultado nuevo.
create or replace function public.forbid_history_change() returns trigger
language plpgsql as $$
begin
  raise exception 'El historial académico no se puede modificar ni borrar.';
end $$;
drop trigger if exists results_immutable on public.activity_results;
create trigger results_immutable before update or delete on public.activity_results
  for each row execute function public.forbid_history_change();
drop trigger if exists attempts_immutable on public.world_attempts;
create trigger attempts_immutable before update or delete on public.world_attempts
  for each row execute function public.forbid_history_change();
drop trigger if exists achievements_immutable on public.achievements;
create trigger achievements_immutable before update or delete on public.achievements
  for each row execute function public.forbid_history_change();
drop trigger if exists enrollments_no_delete on public.student_enrollments;
create trigger enrollments_no_delete before delete on public.student_enrollments
  for each row execute function public.forbid_history_change();

-- ---------------------------------------------------------------------
-- Licencias (preparado para el futuro: todavía sin pagos)
-- ---------------------------------------------------------------------
create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('family_premium', 'school', 'institutional')),
  user_id uuid references auth.users(id),
  student_id uuid references public.students(id),
  classroom_id uuid references public.classrooms(id),
  school_id uuid references public.schools(id),
  school_year int,
  seats int,
  valid_from date not null default current_date,
  valid_to date,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  created_at timestamptz not null default now()
);
