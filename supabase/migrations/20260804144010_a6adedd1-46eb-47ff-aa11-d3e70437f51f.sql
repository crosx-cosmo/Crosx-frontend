do $$ begin
  create type public.account_type as enum ('publisher', 'advertiser', 'influencer');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id              uuid primary key,
  full_name       text        not null,
  email           text        not null,
  mobile          text        not null,
  company_name    text        not null,
  website         text,
  role            text        not null,
  traffic_sources text[]      not null default '{}',
  gst_number      text,
  country         text        not null,
  state           text        not null,
  city            text        not null,
  pincode         text        not null,
  account_type    public.account_type not null default 'publisher',
  avatar_url      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create unique index if not exists profiles_email_key on public.profiles (lower(email));
create index if not exists profiles_account_type_idx on public.profiles (account_type);

grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
grant insert on public.profiles to anon;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_insert_signup" on public.profiles;
create policy "profiles_insert_signup"
  on public.profiles for insert to anon
  with check (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
  on public.profiles for delete to authenticated
  using (auth.uid() = id);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();