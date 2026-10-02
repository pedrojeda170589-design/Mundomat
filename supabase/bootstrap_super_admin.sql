-- Convierte en ADMINISTRADOR GENERAL (super admin) a la cuenta con este email.
-- Se corre UNA sola vez, en Supabase → SQL Editor, después de crear la
-- cuenta en https://mundomat.vercel.app/docente («Crear cuenta») y de
-- confirmarla desde el email.
--
-- Cambiá el email si hace falta y tocá «Run».
insert into public.user_roles (user_id, role)
select id, 'super_admin'
from auth.users
where lower(email) = lower('pedrojeda170589@gmail.com')
on conflict do nothing;

-- Comprobación: tiene que aparecer una fila con role = super_admin.
select u.email, r.role
from public.user_roles r
join auth.users u on u.id = r.user_id
where r.role = 'super_admin';
