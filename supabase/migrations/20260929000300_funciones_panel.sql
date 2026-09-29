-- =====================================================================
-- MundoTest26 · Funciones de lectura para los paneles
-- =====================================================================

-- Trayectoria del alumno (legajo): ciclo, grado, división, escuela y
-- estado. Solo para quien tiene al alumno HOY (o super admin). Muestra el
-- nombre de las escuelas anteriores aunque quien consulta no pertenezca a
-- ellas (es parte de la trayectoria del alumno), pero nada más de ellas.
create or replace function public.student_trajectory(p_student uuid)
returns table (
  enrollment_id uuid, school_year int, grade smallint, division text,
  school_name text, classroom_name text, status public.enrollment_status,
  start_date date, end_date date
) language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_current_access_to_student(p_student) then
    -- Quien lo tuvo antes ve solo sus propias inscripciones.
    return query
      select e.id, e.school_year, e.grade, e.division, s.name, c.name, e.status, e.start_date, e.end_date
      from public.student_enrollments e
      join public.schools s on s.id = e.school_id
      join public.classrooms c on c.id = e.classroom_id
      where e.student_id = p_student and public.can_view_classroom(e.classroom_id)
      order by e.school_year, e.start_date, e.created_at;
    return;
  end if;
  return query
    select e.id, e.school_year, e.grade, e.division, s.name, c.name, e.status, e.start_date, e.end_date
    from public.student_enrollments e
    join public.schools s on s.id = e.school_id
    join public.classrooms c on c.id = e.classroom_id
    where e.student_id = p_student
    order by e.school_year, e.start_date, e.created_at;
end $$;

-- Docentes de un aula (nombre y email) para quien puede ver el aula.
create or replace function public.classroom_teachers(p_classroom uuid)
returns table (teacher_id uuid, display_name text, email text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.can_view_classroom(p_classroom) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;
  return query
    select p.id, p.display_name, p.email
    from public.teacher_classrooms tc join public.profiles p on p.id = tc.teacher_id
    where tc.classroom_id = p_classroom
    order by p.display_name;
end $$;

-- Designa a la dirección de una escuela (solo super admin).
create or replace function public.assign_school_admin(p_school uuid, p_email text)
returns uuid language plpgsql security definer set search_path = public as $$
declare u uuid;
begin
  if not public.is_super_admin() then raise exception 'No autorizado.' using errcode = '42501'; end if;
  select id into u from public.profiles where lower(email) = lower(trim(p_email));
  if u is null then raise exception 'No hay ninguna cuenta registrada con ese email.'; end if;
  insert into public.user_roles (user_id, role, school_id) values (u, 'school_admin', p_school) on conflict do nothing;
  return u;
end $$;

-- Resumen de un aula: alumnos activos con su % por área en el ciclo del
-- aula (para la lista del panel docente, en una sola consulta).
create or replace function public.classroom_overview(p_classroom uuid)
returns table (
  student_id uuid, full_name text, nickname text, avatar text, access_code text,
  birth_date date, subject text, accuracy_pct int, activities int, practice_seconds int,
  last_activity_at timestamptz
) language plpgsql stable security definer set search_path = public as $$
begin
  if not public.can_view_classroom(p_classroom) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;
  return query
    select s.id, s.full_name, s.nickname, s.avatar, s.access_code, s.birth_date,
           st.subject, st.accuracy_pct, st.activities, st.practice_seconds, st.last_activity_at
    from public.student_enrollments e
    join public.students s on s.id = e.student_id
    left join public.student_subject_year_stats st
      on st.student_id = s.id and st.classroom_id = p_classroom
    -- Los que están hoy y los que terminaron el ciclo en esta aula (no los
    -- que se cambiaron de aula o de escuela a mitad de año).
    where e.classroom_id = p_classroom
      and e.status in ('active', 'promoted', 'repeated', 'finished')
    order by s.full_name;
end $$;

-- Aulas a las que se puede promover/mover desde un aula: las de la misma
-- escuela, del mismo ciclo o posteriores (el docente las necesita ver para
-- elegir el destino aunque no sean suyas; solo ve nombre, grado y ciclo).
create or replace function public.promotion_targets(p_classroom uuid)
returns table (id uuid, name text, grade smallint, division text, school_year int)
language plpgsql stable security definer set search_path = public as $$
declare c public.classrooms;
begin
  if not public.can_view_classroom(p_classroom) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;
  select * into c from public.classrooms where classrooms.id = p_classroom;
  return query
    select k.id, k.name, k.grade, k.division, k.school_year
    from public.classrooms k
    where k.school_id = c.school_id and k.school_year >= c.school_year and k.id <> c.id and k.active
      and not public.is_cycle_closed(k.school_id, k.school_year)
    order by k.school_year, k.grade, k.division;
end $$;

revoke execute on function public.promotion_targets(uuid) from anon, public;
grant execute on function public.promotion_targets(uuid) to authenticated;
revoke execute on function public.student_trajectory(uuid) from anon, public;
revoke execute on function public.classroom_teachers(uuid) from anon, public;
revoke execute on function public.assign_school_admin(uuid, text) from anon, public;
revoke execute on function public.classroom_overview(uuid) from anon, public;
grant execute on function public.student_trajectory(uuid) to authenticated;
grant execute on function public.classroom_teachers(uuid) to authenticated;
grant execute on function public.assign_school_admin(uuid, text) to authenticated;
grant execute on function public.classroom_overview(uuid) to authenticated;
