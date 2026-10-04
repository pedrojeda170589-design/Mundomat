-- =====================================================================
-- MundoTest26 · Vista de directivo (multi-aula) y modelo de planes (AG-12)
-- =====================================================================

-- 1. Modelo de planes y licencias en escuelas
alter table public.schools
  add column if not exists plan text not null default 'piloto_gratuito'
  check (plan in ('piloto_gratuito', 'escuela', 'distrito'));

alter table public.licenses
  add column if not exists plan text not null default 'piloto_gratuito'
  check (plan in ('piloto_gratuito', 'escuela', 'distrito'));

-- 2. Plan activo de una escuela (licencia vigente o plan base de la escuela)
create or replace function public.school_active_plan(p_school uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare
  v_plan text;
begin
  if not public.is_school_member(p_school) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;

  -- 1) Buscar si hay licencia vigente activa asignada a la escuela
  select l.plan into v_plan
  from public.licenses l
  where l.school_id = p_school
    and l.status = 'active'
    and (l.valid_to is null or l.valid_to >= current_date)
  order by l.created_at desc
  limit 1;

  if v_plan is not null then
    return v_plan;
  end if;

  -- 2) Retornar el plan configurado en la escuela
  select s.plan into v_plan
  from public.schools s
  where s.id = p_school;

  return coalesce(v_plan, 'piloto_gratuito');
end $$;

-- 3. Resumen multi-aula de una escuela (vista directiva y docente)
-- Permisos:
-- - Directivo (school_admin) o super_admin: ve TODAS las aulas de la escuela.
-- - Docente (teacher) de la escuela: ve ÚNICAMENTE las aulas que tiene a su cargo.
-- - Usuario ajeno a la escuela: error 42501 No autorizado.
create or replace function public.school_classrooms_summary(p_school uuid)
returns table (
  classroom_id uuid,
  classroom_name text,
  grade smallint,
  division text,
  school_year int,
  total_students bigint,
  active_students_7d bigint,
  avg_accuracy_pct int,
  total_activities bigint,
  practice_minutes bigint
) language plpgsql stable security definer set search_path = public as $$
begin
  if not (public.is_super_admin() or public.is_school_admin(p_school) or public.is_school_member(p_school)) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;

  return query
    select
      c.id as classroom_id,
      c.name as classroom_name,
      c.grade,
      c.division,
      c.school_year,
      count(distinct e.student_id) filter (where e.status = 'active') as total_students,
      count(distinct ar.student_id) filter (where ar.occurred_at >= now() - interval '7 days') as active_students_7d,
      coalesce(round(sum(ar.correct)::numeric / nullif(sum(ar.correct + ar.incorrect), 0) * 100), 0)::int as avg_accuracy_pct,
      count(ar.id) as total_activities,
      coalesce(round(sum(ar.time_spent_seconds) / 60.0), 0)::bigint as practice_minutes
    from public.classrooms c
    left join public.student_enrollments e on e.classroom_id = c.id
    left join public.activity_results ar on ar.classroom_id = c.id
    where c.school_id = p_school
      and c.active
      and (
        public.is_super_admin()
        or public.is_school_admin(p_school)
        or public.teaches(c.id)
      )
    group by c.id, c.name, c.grade, c.division, c.school_year
    order by c.school_year desc, c.grade, c.division;
end $$;

-- 4. Comparación entre divisiones del mismo grado en una escuela
-- Exclusivo para la dirección (school_admin) o super_admin.
-- Un docente no puede comparar aulas que no le pertenecen.
create or replace function public.school_grade_comparison(
  p_school uuid,
  p_grade smallint,
  p_year int default null
)
returns table (
  classroom_id uuid,
  classroom_name text,
  division text,
  school_year int,
  total_students bigint,
  active_students_7d bigint,
  avg_accuracy_pct int,
  total_activities bigint,
  practice_minutes bigint
) language plpgsql stable security definer set search_path = public as $$
begin
  if not (public.is_super_admin() or public.is_school_admin(p_school)) then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;

  return query
    select
      c.id as classroom_id,
      c.name as classroom_name,
      c.division,
      c.school_year,
      count(distinct e.student_id) filter (where e.status = 'active') as total_students,
      count(distinct ar.student_id) filter (where ar.occurred_at >= now() - interval '7 days') as active_students_7d,
      coalesce(round(sum(ar.correct)::numeric / nullif(sum(ar.correct + ar.incorrect), 0) * 100), 0)::int as avg_accuracy_pct,
      count(ar.id) as total_activities,
      coalesce(round(sum(ar.time_spent_seconds) / 60.0), 0)::bigint as practice_minutes
    from public.classrooms c
    left join public.student_enrollments e on e.classroom_id = c.id
    left join public.activity_results ar on ar.classroom_id = c.id
    where c.school_id = p_school
      and c.grade = p_grade
      and (p_year is null or c.school_year = p_year)
      and c.active
    group by c.id, c.name, c.division, c.school_year
    order by c.division;
end $$;

-- 5. Asignar plan a una escuela (solo super_admin)
create or replace function public.assign_school_plan(
  p_school uuid,
  p_plan text,
  p_seats int default null,
  p_valid_to date default null
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_super_admin() then
    raise exception 'No autorizado.' using errcode = '42501';
  end if;

  if p_plan not in ('piloto_gratuito', 'escuela', 'distrito') then
    raise exception 'Plan inválido: %', p_plan;
  end if;

  update public.schools
  set plan = p_plan, updated_at = now()
  where id = p_school;

  -- Si se define fecha de vigencia o cupos, se crea la licencia
  if p_valid_to is not null or p_seats is not null then
    insert into public.licenses (
      kind,
      school_id,
      plan,
      seats,
      valid_from,
      valid_to,
      status
    ) values (
      'school',
      p_school,
      p_plan,
      p_seats,
      current_date,
      p_valid_to,
      'active'
    );
  end if;
end $$;

-- Permisos de ejecución
revoke execute on function public.school_active_plan(uuid) from anon, public;
revoke execute on function public.school_classrooms_summary(uuid) from anon, public;
revoke execute on function public.school_grade_comparison(uuid, smallint, int) from anon, public;
revoke execute on function public.assign_school_plan(uuid, text, int, date) from anon, public;

grant execute on function public.school_active_plan(uuid) to authenticated;
grant execute on function public.school_classrooms_summary(uuid) to authenticated;
grant execute on function public.school_grade_comparison(uuid, smallint, int) to authenticated;
grant execute on function public.assign_school_plan(uuid, text, int, date) to authenticated;
