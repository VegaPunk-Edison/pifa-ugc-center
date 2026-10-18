-- eSports Athlete Center: Aufgaben und Ziele
-- Einmal im Supabase SQL Editor ausführen. Sicher erneut ausführbar.

create table if not exists public.creator_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null check (category in ('sho', 'pas', 'dri', 'phy', 'def', 'pac')),
  xp integer not null check (xp between 1 and 99),
  due_at timestamptz,
  repeatable boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.creator_goals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  bonus_xp integer not null check (bonus_xp > 0),
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.creator_goal_tasks (
  goal_id uuid not null references public.creator_goals (id) on delete cascade,
  task_id uuid not null references public.creator_tasks (id) on delete cascade,
  primary key (goal_id, task_id)
);

alter table public.creator_tasks enable row level security;
alter table public.creator_goals enable row level security;
alter table public.creator_goal_tasks enable row level security;

-- Alle angemeldeten Nutzer sehen Aufgaben und Ziele. Nur Betreiber ändern sie.
drop policy if exists "creator_tasks_read" on public.creator_tasks;
create policy "creator_tasks_read" on public.creator_tasks
  for select to authenticated using (true);

drop policy if exists "creator_tasks_operator_write" on public.creator_tasks;
create policy "creator_tasks_operator_write" on public.creator_tasks
  for all to authenticated
  using (public.is_creator_operator())
  with check (public.is_creator_operator());

drop policy if exists "creator_goals_read" on public.creator_goals;
create policy "creator_goals_read" on public.creator_goals
  for select to authenticated using (true);

drop policy if exists "creator_goals_operator_write" on public.creator_goals;
create policy "creator_goals_operator_write" on public.creator_goals
  for all to authenticated
  using (public.is_creator_operator())
  with check (public.is_creator_operator());

drop policy if exists "creator_goal_tasks_read" on public.creator_goal_tasks;
create policy "creator_goal_tasks_read" on public.creator_goal_tasks
  for select to authenticated using (true);

drop policy if exists "creator_goal_tasks_operator_write" on public.creator_goal_tasks;
create policy "creator_goal_tasks_operator_write" on public.creator_goal_tasks
  for all to authenticated
  using (public.is_creator_operator())
  with check (public.is_creator_operator());
