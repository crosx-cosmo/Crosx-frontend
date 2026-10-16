create type public.meeting_status as enum ('confirmed','rescheduled','cancelled','completed');

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  meeting_ref text not null unique,
  full_name text not null,
  email text not null,
  company text not null,
  phone text not null,
  purpose text not null,
  meeting_type text not null,
  meeting_date date not null,
  meeting_time text not null,
  timezone text not null,
  duration integer not null default 30,
  status public.meeting_status not null default 'confirmed',
  email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index meetings_email_idx on public.meetings (lower(email));

grant select on public.meetings to authenticated;
grant all on public.meetings to service_role;

alter table public.meetings enable row level security;

create policy meetings_select_own on public.meetings
for select to authenticated
using (
  user_id = auth.uid()
  or lower(email) = lower(coalesce((auth.jwt() ->> 'email'), ''))
);

create trigger meetings_set_updated_at
before update on public.meetings
for each row execute function public.set_updated_at();