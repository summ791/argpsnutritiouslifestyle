-- =========================================
-- ARGPS Nutritious Lifestyle
-- COMPLETE SUPABASE SQL SETUP
-- =========================================

create extension if not exists "pgcrypto";

-- =========================================
-- 1. CREATE app_user TABLE
-- =========================================

create table if not exists public.app_user (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  age integer,
  password_setup boolean not null default false,
  created_at timestamptz default now()
);

alter table public.app_user
add column if not exists full_name text,
add column if not exists age integer,
add column if not exists password_setup boolean not null default false,
add column if not exists created_at timestamptz default now();

-- =========================================
-- 2. CREATE app_progress TABLE
-- =========================================

create table if not exists public.app_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  course_name text,
  progress text,
  created_at timestamptz default now()
);

-- =========================================
-- 3. ENABLE RLS
-- =========================================

alter table public.app_user enable row level security;
alter table public.app_progress enable row level security;

-- =========================================
-- 4. REMOVE OLD BROKEN TRIGGERS
-- =========================================

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- =========================================
-- 5. CREATE CORRECT USER SYNC TRIGGER
-- =========================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.app_user (id, email, full_name, password_setup)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    false
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.app_user.full_name, excluded.full_name);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================================
-- 6. app_user POLICIES
-- =========================================

drop policy if exists "Users can view their own profile" on public.app_user;
create policy "Users can view their own profile"
on public.app_user
for select
using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.app_user;
create policy "Users can insert their own profile"
on public.app_user
for insert
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.app_user;
create policy "Users can update their own profile"
on public.app_user
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- =========================================
-- 7. app_progress POLICIES
-- =========================================

drop policy if exists "Users can insert their own progress" on public.app_progress;
create policy "Users can insert their own progress"
on public.app_progress
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can view their own progress" on public.app_progress;
create policy "Users can view their own progress"
on public.app_progress
for select
using (auth.uid() = user_id);

drop policy if exists "Users can update their own progress" on public.app_progress;
create policy "Users can update their own progress"
on public.app_progress
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- =========================================
-- 8. CHECK AUTH TRIGGERS
-- =========================================

select
  trigger_name,
  event_object_table,
  action_statement
from information_schema.triggers
where event_object_schema = 'auth'
and event_object_table = 'users';

-- =========================================
-- 9. TEST TABLES
-- =========================================

select * from public.app_user limit 5;
select * from public.app_progress limit 5;
