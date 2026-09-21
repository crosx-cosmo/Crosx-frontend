-- CrosX admin management RPCs (run once on the existing CrosX Supabase project).
-- These add ONLY the admin-side status transitions used by the admin console.
-- No new tables, no duplicate publisher/meeting system.

-- 1. Publisher account status on the existing profiles table -----------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'publisher_account_status') then
    create type public.publisher_account_status as enum ('active', 'pending', 'suspended', 'terminated');
  end if;
end $$;

alter table public.profiles
  add column if not exists account_status public.publisher_account_status not null default 'pending';

-- Admin console runs through this SECURITY DEFINER function only.
create or replace function public.crosx_admin_set_publisher_status(
  p_publisher_id text,
  p_email text,
  p_status public.publisher_account_status
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  row_out public.profiles;
begin
  update public.profiles
     set account_status = p_status,
         updated_at = now()
   where (p_email is not null and p_email <> '' and lower(email) = lower(p_email))
      or (p_publisher_id is not null and p_publisher_id <> ''
          and 'PUB-' || upper(left(replace(id::text, '-', ''), 6)) = upper(p_publisher_id))
  returning * into row_out;

  return row_out;
end;
$$;

revoke all on function public.crosx_admin_set_publisher_status(text, text, public.publisher_account_status) from public, anon, authenticated;
grant execute on function public.crosx_admin_set_publisher_status(text, text, public.publisher_account_status) to service_role;

-- 2. Meeting status + reschedule on the existing meetings table --------------
create or replace function public.crosx_admin_set_meeting_status(
  p_ref text,
  p_status public.meeting_status
)
returns public.meetings
language plpgsql
security definer
set search_path = public
as $$
declare
  row_out public.meetings;
begin
  update public.meetings
     set status = p_status,
         updated_at = now()
   where upper(meeting_ref) = upper(p_ref)
  returning * into row_out;

  return row_out;
end;
$$;

create or replace function public.crosx_admin_reschedule_meeting(
  p_ref text,
  p_date date,
  p_time text,
  p_timezone text
)
returns public.meetings
language plpgsql
security definer
set search_path = public
as $$
declare
  row_out public.meetings;
begin
  update public.meetings
     set meeting_date = p_date,
         meeting_time = p_time,
         timezone = coalesce(nullif(p_timezone, ''), timezone),
         status = 'rescheduled',
         updated_at = now()
   where upper(meeting_ref) = upper(p_ref)
  returning * into row_out;

  return row_out;
end;
$$;

revoke all on function public.crosx_admin_set_meeting_status(text, public.meeting_status) from public, anon, authenticated;
revoke all on function public.crosx_admin_reschedule_meeting(text, date, text, text) from public, anon, authenticated;
grant execute on function public.crosx_admin_set_meeting_status(text, public.meeting_status) to service_role;
grant execute on function public.crosx_admin_reschedule_meeting(text, date, text, text) to service_role;
