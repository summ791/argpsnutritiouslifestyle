-- Run this in Supabase SQL Editor.
-- This uses the existing public.app_progress table.
-- It does not create public.user_activity.

alter table public.app_progress enable row level security;

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
