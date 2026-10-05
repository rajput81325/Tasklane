-- 003: lock the tables down.
-- The Flask API talks to Supabase with the service_role key, which bypasses RLS.
-- Enabling RLS with no policies means the public anon key can read nothing,
-- so data is only reachable through the authenticated API.

alter table public.users         enable row level security;
alter table public.tasks         enable row level security;
alter table public.task_comments enable row level security;
alter table public.email_logs    enable row level security;
