-- 001: users and tasks
-- Run in Supabase: SQL Editor -> New query -> paste -> Run

create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  google_id     text unique not null,
  email         text unique not null,
  name          text not null,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  last_login_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (char_length(title) between 1 and 200),
  description  text not null default '' check (char_length(description) <= 2000),
  status       text not null default 'todo'
               check (status in ('todo', 'in_progress', 'completed')),
  priority     text not null default 'medium'
               check (priority in ('low', 'medium', 'high')),
  due_date     date,
  created_by   uuid not null
               constraint tasks_created_by_fkey references public.users(id) on delete cascade,
  assigned_to  uuid not null
               constraint tasks_assigned_to_fkey references public.users(id) on delete cascade,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists tasks_created_by_idx  on public.tasks (created_by);
create index if not exists tasks_assigned_to_idx on public.tasks (assigned_to);
create index if not exists tasks_status_idx      on public.tasks (status);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();
