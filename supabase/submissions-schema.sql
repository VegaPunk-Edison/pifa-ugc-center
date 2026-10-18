-- eSports Athlete Center: Einreichungen und XP
-- Einmal im Supabase SQL Editor ausführen. Sicher erneut ausführbar.

alter table public.creator_profiles add column if not exists tiktok_url text;
grant update (tiktok_url) on public.creator_profiles to authenticated;

create table if not exists public.creator_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.creator_profiles (id) on delete cascade,
  task_id uuid not null references public.creator_tasks (id) on delete cascade,
  url text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  xp_awarded numeric,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.creator_xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.creator_profiles (id) on delete cascade,
  submission_id uuid not null references public.creator_submissions (id) on delete cascade,
  subkey text not null,
  amount numeric not null check (amount > 0),
  created_at timestamptz not null default now()
);

alter table public.creator_submissions enable row level security;
alter table public.creator_xp_events enable row level security;

drop policy if exists "creator_submissions_select" on public.creator_submissions;
create policy "creator_submissions_select" on public.creator_submissions
  for select to authenticated
  using (user_id = auth.uid() or public.is_creator_operator());

drop policy if exists "creator_submissions_insert" on public.creator_submissions;
create policy "creator_submissions_insert" on public.creator_submissions
  for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "creator_submissions_operator_update" on public.creator_submissions;
create policy "creator_submissions_operator_update" on public.creator_submissions
  for update to authenticated
  using (public.is_creator_operator())
  with check (public.is_creator_operator());

drop policy if exists "creator_xp_events_select" on public.creator_xp_events;
create policy "creator_xp_events_select" on public.creator_xp_events
  for select to authenticated
  using (user_id = auth.uid() or public.is_creator_operator());

-- Freigabe: berechnet die XP je Unterattribut und setzt den Status in einem Schritt.
-- Zu spät eingereicht gibt nur die halbe XP.
create or replace function public.approve_creator_submission(sub_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.creator_submissions%rowtype;
  t public.creator_tasks%rowtype;
  keys text[];
  factor numeric;
begin
  if not public.is_creator_operator() then
    raise exception 'Nur Betreiber dürfen Einreichungen freigeben.';
  end if;

  select * into s from public.creator_submissions where id = sub_id;
  if not found or s.status <> 'pending' then
    raise exception 'Diese Einreichung ist nicht mehr offen.';
  end if;

  select * into t from public.creator_tasks where id = s.task_id;

  keys := case t.category
    when 'sho' then array['abschluss', 'schusskraft', 'stellungsspiel', 'weitschuesse', 'volley', 'elfmeter']
    when 'pas' then array['kurzer_pass', 'langer_pass', 'uebersicht', 'flanken', 'fs_praezision', 'effet']
    when 'dri' then array['ballkontrolle', 'dribbling', 'beweglichkeit', 'balance', 'ruhe', 'reaktion']
    when 'phy' then array['ausdauer', 'staerke', 'sprungkraft', 'aggressivitaet']
    when 'def' then array['abfangen', 'defensives_bewusstsein', 'faire_zweikaempfe', 'graetschen', 'kopfball_praezision']
    when 'pac' then array['beschleunigung', 'sprinttempo']
  end;

  factor := case when t.due_at is not null and s.created_at > t.due_at then 0.5 else 1 end;

  insert into public.creator_xp_events (user_id, submission_id, subkey, amount)
  select s.user_id, s.id, k, round(t.xp * factor / array_length(keys, 1), 2)
  from unnest(keys) as k;

  update public.creator_submissions
  set status = 'approved', xp_awarded = t.xp * factor, reviewed_at = now()
  where id = sub_id;
end;
$$;
