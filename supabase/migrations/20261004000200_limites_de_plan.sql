-- =====================================================================
-- MundoTest26 · Límites del plan controlados en el servidor (AG-15, arreglo de Claude)
-- =====================================================================
-- Antes los cupos (aulas y alumnos) solo se miraban en la pantalla: se podía
-- crear un aula o inscribir un alumno llamando a la función directamente.
-- Ahora lo controlan create_classroom y enroll_new_student.
--
-- - Los cupos son POR CICLO LECTIVO (cada año la escuela vuelve a tener sus
--   aulas y alumnos; el historial de años anteriores no cuenta).
-- - Las escuelas con un aula del piloto (classrooms.is_legacy_pilot) no tienen límite.
-- - Los valores son los provisorios de src/lib/planes.ts: si Pedro los
--   cambia, hay que cambiarlos en los dos lugares.

-- Plan vigente de una escuela, sin control de permisos (uso interno).
create or replace function public.plan_de_escuela(p_school uuid)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(
    (select l.plan from public.licenses l
      where l.school_id = p_school and l.status = 'active'
        and (l.valid_to is null or l.valid_to >= current_date)
      order by l.created_at desc limit 1),
    (select s.plan from public.schools s where s.id = p_school),
    'piloto_gratuito'
  );
$$;
revoke execute on function public.plan_de_escuela(uuid) from anon, public, authenticated;

-- Cupo de un plan (null = sin límite).
create or replace function public.cupo_de_escuela(p_school uuid, p_limite text)
returns int language plpgsql stable security definer set search_path = public as $$
declare v_plan text; v_legacy boolean;
begin
  select exists (select 1 from public.classrooms where school_id = p_school and is_legacy_pilot) into v_legacy;
  if v_legacy then return null; end if;
  v_plan := public.plan_de_escuela(p_school);
  return case
    when v_plan = 'distrito' then null
    when v_plan = 'escuela' then case p_limite when 'aulas' then 25 when 'alumnos' then 750 else 40 end
    else case p_limite when 'aulas' then 2 when 'alumnos' then 35 else 2 end
  end;
end $$;
revoke execute on function public.cupo_de_escuela(uuid, text) from anon, public, authenticated;

-- Uso y cupos de la escuela en un ciclo (para mostrarlo en el panel; lo ve
-- cualquier miembro de la escuela, con los totales de TODA la escuela).
create or replace function public.school_plan_usage(p_school uuid, p_year int)
returns table (aulas int, alumnos int, max_aulas int, max_alumnos int)
language plpgsql stable security definer set search_path = public as $$
begin
  if not (public.is_super_admin() or public.is_school_member(p_school)) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;
  return query select
    (select count(*)::int from public.classrooms c where c.school_id = p_school and c.school_year = p_year),
    (select count(*)::int from public.student_enrollments e
       where e.school_id = p_school and e.school_year = p_year and e.status = 'active'),
    public.cupo_de_escuela(p_school, 'aulas'),
    public.cupo_de_escuela(p_school, 'alumnos');
end $$;
revoke execute on function public.school_plan_usage(uuid, int) from anon, public;
grant execute on function public.school_plan_usage(uuid, int) to authenticated;

-- create_classroom: igual que antes + cupo de aulas del ciclo.
create or replace function public.create_classroom(
  p_school uuid, p_grade int, p_division text, p_year int, p_name text default null
) returns public.classrooms language plpgsql security definer set search_path = public as $$
declare c public.classrooms; v_max int; v_n int;
begin
  if not (public.is_super_admin() or public.is_school_admin(p_school)) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;
  if public.is_cycle_closed(p_school, p_year) then raise exception 'El ciclo % está cerrado.', p_year; end if;
  v_max := public.cupo_de_escuela(p_school, 'aulas');
  if v_max is not null and not public.is_super_admin() then
    select count(*) into v_n from public.classrooms where school_id = p_school and school_year = p_year;
    if v_n >= v_max then
      raise exception 'Tu escuela alcanzó el cupo de % aulas de su plan para el ciclo %.', v_max, p_year
        using errcode = 'P0001';
    end if;
  end if;
  insert into public.school_cycles (school_id, school_year) values (p_school, p_year) on conflict do nothing;
  insert into public.classrooms (school_id, grade, division, school_year, name)
  values (p_school, p_grade, upper(coalesce(trim(p_division), '')), p_year,
          coalesce(nullif(trim(p_name), ''), p_grade || '.º ' || upper(coalesce(trim(p_division), ''))))
  returning * into c;
  return c;
end $$;

-- enroll_new_student: igual que antes + cupo de alumnos del ciclo.
create or replace function public.enroll_new_student(p_classroom uuid, p_full_name text, p_birth_date date default null)
returns public.students language plpgsql security definer set search_path = public as $$
declare c public.classrooms; s public.students; v_max int; v_n int;
begin
  select * into c from public.classrooms where id = p_classroom;
  if not found or not public.can_view_classroom(p_classroom) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;
  if public.is_cycle_closed(c.school_id, c.school_year) then raise exception 'El ciclo está cerrado.'; end if;
  v_max := public.cupo_de_escuela(c.school_id, 'alumnos');
  if v_max is not null and not public.is_super_admin() then
    select count(*) into v_n from public.student_enrollments
      where school_id = c.school_id and school_year = c.school_year and status = 'active';
    if v_n >= v_max then
      raise exception 'Tu escuela alcanzó el cupo de % alumnos de su plan.', v_max using errcode = 'P0001';
    end if;
  end if;
  insert into public.students (access_code, full_name, birth_date, birthday_mmdd)
  values (public.generate_access_code(), trim(p_full_name), p_birth_date,
          case when p_birth_date is null then null else to_char(p_birth_date, 'MM-DD') end)
  returning * into s;
  insert into public.student_enrollments (student_id, classroom_id, created_by, school_id, school_year, grade)
  values (s.id, p_classroom, auth.uid(), c.school_id, c.school_year, c.grade);
  return s;
end $$;
