-- 002: task comments and an audit log of notification emails

create table if not exists public.task_comments (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references public.tasks(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists task_comments_task_idx on public.task_comments (task_id, created_at);

create table if not exists public.email_logs (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid references public.tasks(id) on delete set null,
  recipient  text not null,
  event      text not null, -- task_created | task_assigned | task_completed | task_reassigned
  subject    text not null,
  status     text not null check (status in ('sent', 'failed', 'skipped')),
  error      text,
  created_at timestamptz not null default now()
);
create index if not exists email_logs_task_idx on public.email_logs (task_id);
