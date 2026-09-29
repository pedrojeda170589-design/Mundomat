-- =====================================================================
-- MundoTest26 · Permisos y Row Level Security
-- =====================================================================
-- Quién ve qué (lo impone la base, no la interfaz):
--   super_admin  → todo.
--   school_admin → todo lo de SU escuela.
--   teacher      → sus aulas (teacher_classrooms) y los alumnos que están
--                  o estuvieron en ellas; de los alumnos que tiene HOY
--                  ve la trayectoria completa (evolución).
--   student      → solo sus propios datos (si tiene cuenta).
--   family       → (próxima fase) solo sus hijos vinculados.
-- Nadie puede modificar el historial académico desde la app.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Funciones de permiso (security definer: leen las tablas de permisos sin
-- quedar atrapadas en sus propias políticas).
-- ---------------------------------------------------------------------
create or replace function public.is_super_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'super_admin')
$$;

create or replace function public.is_school_admin(p_school uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles
                 where user_id = auth.uid() and role = 'school_admin' and school_id = p_school)
$$;

create or replace function public.teaches(p_classroom uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.teacher_classrooms
                 where teacher_id = auth.uid() and classroom_id = p_classroom)
$$;

-- ¿Puede ver (y trabajar con) esta aula?
create or replace function public.can_view_classroom(p_classroom uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_super_admin()
      or public.teaches(p_classroom)
      or exists (select 1 from public.classrooms c
                 where c.id = p_classroom and public.is_school_admin(c.school_id))
$$;

-- ¿Pertenece a esta escuela (como directivo o como docente de alguna aula)?
create or replace function public.is_school_member(p_school uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_super_admin()
      or exists (select 1 from public.user_roles where user_id = auth.uid() and school_id = p_school)
      or exists (select 1 from public.teacher_classrooms tc
                 join public.classrooms c on c.id = tc.classroom_id
                 where tc.teacher_id = auth.uid() and c.school_id = p_school)
$$;

-- ¿Es "su" alumno HOY? (inscripción activa en un aula que puede ver, o es
-- el propio alumno). Da acceso a la trayectoria completa.
create or replace function public.has_current_access_to_student(p_student uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_super_admin()
      or exists (select 1 from public.students s where s.id = p_student and s.user_id = auth.uid())
      or exists (select 1 from public.student_enrollments e
                 where e.student_id = p_student and e.status = 'active'
                   and public.can_view_classroom(e.classroom_id))
$$;

-- ¿Lo tiene o lo tuvo? (para ver su nombre y los datos de SU período).
create or replace function public.has_any_access_to_student(p_student uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_current_access_to_student(p_student)
      or exists (select 1 from public.student_enrollments e
                 where e.student_id = p_student and public.can_view_classroom(e.classroom_id))
$$;

create or replace function public.is_cycle_closed(p_school uuid, p_year int) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.school_cycles
                 where school_id = p_school and school_year = p_year and status = 'closed')
$$;

-- ---------------------------------------------------------------------
-- Activar RLS en todas las tablas
-- ---------------------------------------------------------------------
alter table public.schools enable row level security;
alter table public.school_cycles enable row level security;
alter table public.classrooms enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.teacher_classrooms enable row level security;
alter table public.students enable row level security;
alter table public.student_enrollments enable row level security;
alter table public.activity_results enable row level security;
alter table public.world_attempts enable row level security;
alter table public.achievements enable row level security;
alter table public.student_world_progress enable row level security;
alter table public.licenses enable row level security;

-- Los visitantes sin sesión no ven nada.
revoke all on all tables in schema public from anon;

-- ---------------------------------------------------------------------
-- Políticas
-- ---------------------------------------------------------------------
-- Escuelas
drop policy if exists schools_select on public.schools;
create policy schools_select on public.schools for select to authenticated
  using (public.is_school_member(id));
drop policy if exists schools_insert on public.schools;
create policy schools_insert on public.schools for insert to authenticated
  with check (public.is_super_admin());
drop policy if exists schools_update on public.schools;
create policy schools_update on public.schools for update to authenticated
  using (public.is_super_admin() or public.is_school_admin(id))
  with check (public.is_super_admin() or public.is_school_admin(id));

-- Ciclos
drop policy if exists cycles_select on public.school_cycles;
create policy cycles_select on public.school_cycles for select to authenticated
  using (public.is_school_member(school_id));

-- Aulas
drop policy if exists classrooms_select on public.classrooms;
create policy classrooms_select on public.classrooms for select to authenticated
  using (public.can_view_classroom(id));
drop policy if exists classrooms_insert on public.classrooms;
create policy classrooms_insert on public.classrooms for insert to authenticated
  with check ((public.is_super_admin() or public.is_school_admin(school_id))
              and not public.is_cycle_closed(school_id, school_year));
drop policy if exists classrooms_update on public.classrooms;
create policy classrooms_update on public.classrooms for update to authenticated
  using (public.can_view_classroom(id) and not public.is_cycle_closed(school_id, school_year))
  with check (public.can_view_classroom(id) and not public.is_cycle_closed(school_id, school_year));

-- Evita que un docente, al editar su aula (p. ej. mundos habilitados),
-- la cambie de escuela, ciclo, grado o división.
create or replace function public.classroom_guard_update() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (new.school_id <> old.school_id or new.school_year <> old.school_year
      or new.grade <> old.grade or new.division <> old.division
      or new.is_legacy_pilot <> old.is_legacy_pilot)
     and not (public.is_super_admin() or public.is_school_admin(old.school_id)
              or auth.uid() is null) then
    raise exception 'Solo la dirección puede cambiar los datos del aula.';
  end if;
  if new.school_id <> old.school_id then
    raise exception 'Un aula no cambia de escuela.';
  end if;
  return new;
end $$;
drop trigger if exists classrooms_guard on public.classrooms;
create trigger classrooms_guard before update on public.classrooms
  for each row execute function public.classroom_guard_update();

-- Perfiles: el propio, y los de la escuela para su dirección.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (
    id = auth.uid() or public.is_super_admin()
    or exists (select 1 from public.user_roles r
               where r.user_id = profiles.id and r.school_id is not null and public.is_school_admin(r.school_id))
  );
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Roles: cada uno ve los suyos; la dirección ve los de su escuela. Los
-- asignan el super admin (cualquiera) o la dirección (solo 'teacher' en su
-- escuela).
drop policy if exists roles_select on public.user_roles;
create policy roles_select on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_super_admin()
         or (school_id is not null and public.is_school_admin(school_id)));
drop policy if exists roles_insert on public.user_roles;
create policy roles_insert on public.user_roles for insert to authenticated
  with check (public.is_super_admin()
              or (role = 'teacher' and school_id is not null and public.is_school_admin(school_id)));
drop policy if exists roles_delete on public.user_roles;
create policy roles_delete on public.user_roles for delete to authenticated
  using (public.is_super_admin()
         or (role = 'teacher' and school_id is not null and public.is_school_admin(school_id)));

-- Docente ↔ aula
drop policy if exists tc_select on public.teacher_classrooms;
create policy tc_select on public.teacher_classrooms for select to authenticated
  using (teacher_id = auth.uid() or public.is_super_admin() or public.teaches(classroom_id)
         or exists (select 1 from public.classrooms c where c.id = classroom_id and public.is_school_admin(c.school_id)));
drop policy if exists tc_insert on public.teacher_classrooms;
create policy tc_insert on public.teacher_classrooms for insert to authenticated
  with check (exists (select 1 from public.classrooms c where c.id = classroom_id
                      and (public.is_super_admin() or public.is_school_admin(c.school_id))));
drop policy if exists tc_delete on public.teacher_classrooms;
create policy tc_delete on public.teacher_classrooms for delete to authenticated
  using (exists (select 1 from public.classrooms c where c.id = classroom_id
                 and (public.is_super_admin() or public.is_school_admin(c.school_id))));

-- Alumnos: identidad visible para quien lo tiene o lo tuvo. Los datos de
-- la ficha (nombre, fecha de nacimiento) los edita quien lo tiene hoy.
drop policy if exists students_select on public.students;
create policy students_select on public.students for select to authenticated
  using (public.has_any_access_to_student(id));
drop policy if exists students_update on public.students;
create policy students_update on public.students for update to authenticated
  using (public.has_current_access_to_student(id) and user_id is distinct from auth.uid())
  with check (public.has_current_access_to_student(id));

-- El código de acceso y la cuenta del alumno no se cambian desde la app.
create or replace function public.student_guard_update() returns trigger
language plpgsql as $$
begin
  if auth.uid() is not null and (new.access_code <> old.access_code or new.user_id is distinct from old.user_id)
     and not public.is_super_admin() then
    raise exception 'El código de acceso no se modifica desde el panel.';
  end if;
  return new;
end $$;
drop trigger if exists students_guard on public.students;
create trigger students_guard before update on public.students
  for each row execute function public.student_guard_update();

-- Inscripciones: quien tiene al alumno hoy ve toda su trayectoria; quien
-- lo tuvo antes ve solo la inscripción de su aula. Se crean y cierran por
-- las funciones de promoción (no con inserts directos).
drop policy if exists enrollments_select on public.student_enrollments;
create policy enrollments_select on public.student_enrollments for select to authenticated
  using (public.can_view_classroom(classroom_id) or public.has_current_access_to_student(student_id));

-- Historial: mismo criterio. Solo lectura (lo escribe el servidor del juego).
drop policy if exists results_select on public.activity_results;
create policy results_select on public.activity_results for select to authenticated
  using (public.can_view_classroom(classroom_id) or public.has_current_access_to_student(student_id));
drop policy if exists attempts_select on public.world_attempts;
create policy attempts_select on public.world_attempts for select to authenticated
  using (public.can_view_classroom(classroom_id) or public.has_current_access_to_student(student_id));
drop policy if exists achievements_select on public.achievements;
create policy achievements_select on public.achievements for select to authenticated
  using (public.has_current_access_to_student(student_id)
         or (classroom_id is not null and public.can_view_classroom(classroom_id)));
drop policy if exists world_progress_select on public.student_world_progress;
create policy world_progress_select on public.student_world_progress for select to authenticated
  using (public.has_current_access_to_student(student_id));

-- Licencias: las ve el titular y la dirección de la escuela; las gestiona
-- el super admin.
drop policy if exists licenses_select on public.licenses;
create policy licenses_select on public.licenses for select to authenticated
  using (public.is_super_admin() or user_id = auth.uid()
         or (school_id is not null and public.is_school_admin(school_id)));
drop policy if exists licenses_write on public.licenses;
create policy licenses_write on public.licenses for all to authenticated
  using (public.is_super_admin()) with check (public.is_super_admin());

-- Permisos de tabla (RLS decide las filas).
grant select, insert, update, delete on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;

-- =====================================================================
-- Funciones de gestión (validan permisos adentro)
-- =====================================================================

-- Código de acceso nuevo (sin letras ni números confusos).
create or replace function public.generate_access_code() returns text
language plpgsql as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  candidate text;
begin
  loop
    candidate := '';
    for i in 1..5 loop
      candidate := candidate || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.students where access_code = candidate);
  end loop;
  return candidate;
end $$;

-- Crea una escuela (super admin).
create or replace function public.create_school(p_name text, p_code text)
returns public.schools language plpgsql security definer set search_path = public as $$
declare s public.schools;
begin
  if not public.is_super_admin() then raise exception 'No autorizado.' using errcode = '42501'; end if;
  insert into public.schools (name, code) values (trim(p_name), upper(trim(p_code))) returning * into s;
  return s;
end $$;

-- Crea un aula (dirección de la escuela o super admin).
create or replace function public.create_classroom(
  p_school uuid, p_grade int, p_division text, p_year int, p_name text default null
) returns public.classrooms language plpgsql security definer set search_path = public as $$
declare c public.classrooms;
begin
  if not (public.is_super_admin() or public.is_school_admin(p_school)) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;
  if public.is_cycle_closed(p_school, p_year) then raise exception 'El ciclo % está cerrado.', p_year; end if;
  insert into public.school_cycles (school_id, school_year) values (p_school, p_year) on conflict do nothing;
  insert into public.classrooms (school_id, grade, division, school_year, name)
  values (p_school, p_grade, upper(coalesce(trim(p_division), '')), p_year,
          coalesce(nullif(trim(p_name), ''), p_grade || '.º ' || upper(coalesce(trim(p_division), ''))))
  returning * into c;
  return c;
end $$;

-- Asigna un docente (por su email de registro) a un aula.
create or replace function public.assign_teacher(p_classroom uuid, p_email text)
returns uuid language plpgsql security definer set search_path = public as $$
declare c public.classrooms; t uuid;
begin
  select * into c from public.classrooms where id = p_classroom;
  if not found or not (public.is_super_admin() or public.is_school_admin(c.school_id)) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;
  select id into t from public.profiles where lower(email) = lower(trim(p_email));
  if t is null then raise exception 'No hay ninguna cuenta registrada con ese email.'; end if;
  insert into public.user_roles (user_id, role, school_id) values (t, 'teacher', c.school_id) on conflict do nothing;
  insert into public.teacher_classrooms (teacher_id, classroom_id) values (t, p_classroom) on conflict do nothing;
  return t;
end $$;

create or replace function public.unassign_teacher(p_classroom uuid, p_teacher uuid)
returns void language plpgsql security definer set search_path = public as $$
declare c public.classrooms;
begin
  select * into c from public.classrooms where id = p_classroom;
  if not found or not (public.is_super_admin() or public.is_school_admin(c.school_id)) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;
  delete from public.teacher_classrooms where classroom_id = p_classroom and teacher_id = p_teacher;
end $$;

-- Inscribe a un alumno NUEVO en un aula (docente del aula o dirección).
create or replace function public.enroll_new_student(p_classroom uuid, p_full_name text, p_birth_date date default null)
returns public.students language plpgsql security definer set search_path = public as $$
declare c public.classrooms; s public.students;
begin
  select * into c from public.classrooms where id = p_classroom;
  if not found or not public.can_view_classroom(p_classroom) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;
  if public.is_cycle_closed(c.school_id, c.school_year) then raise exception 'El ciclo está cerrado.'; end if;
  insert into public.students (access_code, full_name, birth_date, birthday_mmdd)
  values (public.generate_access_code(), trim(p_full_name), p_birth_date,
          case when p_birth_date is null then null else to_char(p_birth_date, 'MM-DD') end)
  returning * into s;
  insert into public.student_enrollments (student_id, classroom_id, created_by, school_id, school_year, grade)
  values (s.id, p_classroom, auth.uid(), c.school_id, c.school_year, c.grade);
  return s;
end $$;

-- Mueve alumnos a otra aula conservando todo:
--   p_reason = 'promoted'  → pasa de grado (ciclo siguiente)
--              'repeated'  → permanece en el grado (ciclo siguiente)
--              'moved'     → cambio de división/aula en el mismo ciclo
-- El cambio de escuela se hace con transfer_student (lo hace la escuela
-- que recibe). Devuelve cuántos alumnos se movieron.
create or replace function public.move_students(p_students uuid[], p_target uuid, p_reason public.enrollment_status)
returns int language plpgsql security definer set search_path = public as $$
declare
  t public.classrooms;
  cur public.student_enrollments;
  src public.classrooms;
  sid uuid;
  n int := 0;
begin
  if p_reason not in ('promoted', 'repeated', 'moved') then
    raise exception 'Motivo inválido.';
  end if;
  select * into t from public.classrooms where id = p_target;
  if not found then raise exception 'Aula de destino inexistente.'; end if;
  if public.is_cycle_closed(t.school_id, t.school_year) then
    raise exception 'El ciclo del aula de destino está cerrado.';
  end if;
  foreach sid in array p_students loop
    select * into cur from public.student_enrollments where student_id = sid and status = 'active' for update;
    if not found then raise exception 'El alumno % no tiene un aula activa.', sid; end if;
    select * into src from public.classrooms where id = cur.classroom_id;
    if src.school_id <> t.school_id then
      raise exception 'Para cambiar de escuela use el traslado.';
    end if;
    -- Permiso: dirección/super, o docente del aula actual del alumno.
    if not (public.is_super_admin() or public.is_school_admin(t.school_id) or public.teaches(src.id)) then
      raise exception 'No autorizado.' using errcode = '42501';
    end if;
    if p_reason = 'promoted' and not (t.school_year > src.school_year and t.grade > src.grade) then
      raise exception 'La promoción es a un grado mayor en un ciclo posterior.';
    end if;
    if p_reason = 'repeated' and not (t.school_year > src.school_year and t.grade = src.grade) then
      raise exception 'La permanencia es al mismo grado en un ciclo posterior.';
    end if;
    if p_reason = 'moved' and not (t.school_year = src.school_year and t.id <> src.id) then
      raise exception 'El cambio de aula es dentro del mismo ciclo.';
    end if;
    update public.student_enrollments set status = p_reason, end_date = current_date where id = cur.id;
    insert into public.student_enrollments (student_id, classroom_id, previous_enrollment_id, created_by,
                                            school_id, school_year, grade)
    values (sid, t.id, cur.id, auth.uid(), t.school_id, t.school_year, t.grade);
    n := n + 1;
  end loop;
  return n;
end $$;

-- Traslado a OTRA escuela: lo hace la escuela que recibe, con el código
-- del alumno (se lo da la familia o la escuela anterior). El alumno
-- conserva su identidad y su historial.
create or replace function public.transfer_student(p_access_code text, p_target uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare t public.classrooms; s public.students; cur public.student_enrollments;
begin
  select * into t from public.classrooms where id = p_target;
  if not found or not (public.is_super_admin() or public.is_school_admin(t.school_id)) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;
  if public.is_cycle_closed(t.school_id, t.school_year) then raise exception 'El ciclo está cerrado.'; end if;
  select * into s from public.students where access_code = upper(trim(p_access_code));
  if not found then raise exception 'Código de alumno inexistente.'; end if;
  select * into cur from public.student_enrollments where student_id = s.id and status = 'active' for update;
  if found then
    if cur.school_id = t.school_id then raise exception 'El alumno ya es de esta escuela: use cambio de aula o promoción.'; end if;
    update public.student_enrollments set status = 'transferred', end_date = current_date where id = cur.id;
  end if;
  insert into public.student_enrollments (student_id, classroom_id, previous_enrollment_id, created_by,
                                          school_id, school_year, grade)
  values (s.id, t.id, cur.id, auth.uid(), t.school_id, t.school_year, t.grade);
  return s.id;
end $$;

-- Baja de la escuela (el historial queda).
create or replace function public.withdraw_student(p_student uuid)
returns void language plpgsql security definer set search_path = public as $$
declare cur public.student_enrollments;
begin
  select * into cur from public.student_enrollments where student_id = p_student and status = 'active' for update;
  if not found then raise exception 'El alumno no tiene un aula activa.'; end if;
  if not (public.is_super_admin() or public.is_school_admin(cur.school_id)) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;
  update public.student_enrollments set status = 'withdrawn', end_date = current_date where id = cur.id;
end $$;

-- Cierre del ciclo lectivo de una escuela: desde ese momento no se
-- registran resultados nuevos en ese ciclo ni se editan sus aulas. Los
-- datos quedan intactos. Después se promueve a los alumnos.
create or replace function public.close_school_year(p_school uuid, p_year int)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not (public.is_super_admin() or public.is_school_admin(p_school)) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;
  insert into public.school_cycles (school_id, school_year, status, closed_at, closed_by)
  values (p_school, p_year, 'closed', now(), auth.uid())
  on conflict (school_id, school_year)
  do update set status = 'closed', closed_at = now(), closed_by = auth.uid();
end $$;

-- Reabrir (solo super admin, por si se cerró por error).
create or replace function public.reopen_school_year(p_school uuid, p_year int)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_super_admin() then raise exception 'No autorizado.' using errcode = '42501'; end if;
  update public.school_cycles set status = 'open', closed_at = null, closed_by = null
  where school_id = p_school and school_year = p_year;
end $$;

-- Mis roles y escuelas (para armar el panel).
create or replace function public.my_access()
returns table (role public.app_role, school_id uuid, school_name text)
language sql stable security definer set search_path = public as $$
  select r.role, r.school_id, s.name from public.user_roles r
  left join public.schools s on s.id = r.school_id
  where r.user_id = auth.uid()
$$;

-- =====================================================================
-- Vistas de progreso (respetan el RLS de quien consulta)
-- =====================================================================
-- Evolución por área y ciclo: 2026 → 68 %, 2027 → 79 %...
create or replace view public.student_subject_year_stats with (security_invoker = true) as
select r.student_id, r.school_year, r.school_id, r.classroom_id, r.subject,
       sum(r.correct)::int as correct,
       sum(r.incorrect)::int as incorrect,
       case when sum(r.correct + r.incorrect) = 0 then null
            else round(100.0 * sum(r.correct) / sum(r.correct + r.incorrect))::int end as accuracy_pct,
       count(*)::int as activities,
       sum(r.time_spent_seconds)::int as practice_seconds,
       max(r.occurred_at) as last_activity_at
from public.activity_results r
group by r.student_id, r.school_year, r.school_id, r.classroom_id, r.subject;

-- Progreso por mundo y ciclo (para fortalezas / a reforzar por contenido).
create or replace view public.student_world_year_stats with (security_invoker = true) as
select r.student_id, r.school_year, r.classroom_id, r.world_id, r.subject, r.category,
       sum(r.correct)::int as correct,
       sum(r.incorrect)::int as incorrect,
       case when sum(r.correct + r.incorrect) = 0 then null
            else round(100.0 * sum(r.correct) / sum(r.correct + r.incorrect))::int end as accuracy_pct,
       count(*)::int as activities
from public.activity_results r
group by r.student_id, r.school_year, r.classroom_id, r.world_id, r.subject, r.category;

grant select on public.student_subject_year_stats, public.student_world_year_stats to authenticated, service_role;
revoke all on public.student_subject_year_stats, public.student_world_year_stats from anon;

-- Las funciones de gestión no se exponen a visitantes sin sesión.
revoke execute on function public.create_school(text, text) from anon, public;
revoke execute on function public.create_classroom(uuid, int, text, int, text) from anon, public;
revoke execute on function public.assign_teacher(uuid, text) from anon, public;
revoke execute on function public.unassign_teacher(uuid, uuid) from anon, public;
revoke execute on function public.enroll_new_student(uuid, text, date) from anon, public;
revoke execute on function public.move_students(uuid[], uuid, public.enrollment_status) from anon, public;
revoke execute on function public.transfer_student(text, uuid) from anon, public;
revoke execute on function public.withdraw_student(uuid) from anon, public;
revoke execute on function public.close_school_year(uuid, int) from anon, public;
revoke execute on function public.reopen_school_year(uuid, int) from anon, public;
grant execute on function public.create_school(text, text) to authenticated;
grant execute on function public.create_classroom(uuid, int, text, int, text) to authenticated;
grant execute on function public.assign_teacher(uuid, text) to authenticated;
grant execute on function public.unassign_teacher(uuid, uuid) to authenticated;
grant execute on function public.enroll_new_student(uuid, text, date) to authenticated;
grant execute on function public.move_students(uuid[], uuid, public.enrollment_status) to authenticated;
grant execute on function public.transfer_student(text, uuid) to authenticated;
grant execute on function public.withdraw_student(uuid) to authenticated;
grant execute on function public.close_school_year(uuid, int) to authenticated;
grant execute on function public.reopen_school_year(uuid, int) to authenticated;
grant execute on function public.my_access() to authenticated;
