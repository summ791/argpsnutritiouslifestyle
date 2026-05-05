-- app_users table
create table public.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  status text not null default 'active'
);

alter table public.app_users enable row level security;

create policy "Users can view own row"
  on public.app_users for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own row"
  on public.app_users for update
  to authenticated
  using (auth.uid() = id);

-- user_progress table
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_name text not null,
  progress integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, course_name)
);

alter table public.user_progress enable row level security;

create policy "Users select own progress"
  on public.user_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users insert own progress"
  on public.user_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users update own progress"
  on public.user_progress for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users delete own progress"
  on public.user_progress for delete
  to authenticated
  using (auth.uid() = user_id);

-- Auto-create app_users row on new signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.app_users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
