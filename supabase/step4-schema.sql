-- eSports Athlete Center: Benachrichtigungen, Ablehnung per Funktion
-- Einmal im Supabase SQL Editor ausführen. Sicher erneut ausführbar.

create table if not exists public.creator_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.creator_profiles (id) on delete cascade,
  kind text not null check (kind in ('approved', 'rejected', 'goal')),
  title text not null,
  xp numeric,
  reason text,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

alter table public.creator_notifications enable row level security;
grant update (read_at) on public.creator_notifications to authenticated;

drop policy if exists "creator_notifications_select" on public.creator_notifications;
create policy "creator_notifications_select" on public.creator_notifications
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "creator_notifications_update" on public.creator_notifications;
create policy "creator_notifications_update" on public.creator_notifications
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create or replace function public.reject_creator_submission(sub_id uuid, reason text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.creator_submissions%rowtype;
  t public.creator_tasks%rowtype;
begin
  if not public.is_creator_operator() then
    raise exception 'Nur Betreiber dürfen Einreichungen ablehnen.';
  end if;
  if reason is null or btrim(reason) = '' then
    raise exception 'Bitte gib eine Begründung an.';
  end if;

  select * into s from public.creator_submissions where id = sub_id;
  if not found or s.status <> 'pending' then
    raise exception 'Diese Einreichung ist nicht mehr offen.';
  end if;

  select * into t from public.creator_tasks where id = s.task_id;

  update public.creator_submissions
  set status = 'rejected', rejection_reason = reason, reviewed_at = now()
  where id = sub_id;

  insert into public.creator_notifications (user_id, kind, title, reason)
  values (s.user_id, 'rejected', t.title, reason);
end;
$$;

create or replace function public.approve_creator_submission(sub_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.creator_submissions%rowtype;
  t public.creator_tasks%rowtype;
  g record;
  keys text[];
  goal_keys text[];
  factor numeric;
  goal_factor numeric;
begin
  if not public.is_creator_operator() then
    raise exception 'Nur Betreiber dürfen Einreichungen freigeben.';
  end if;

  select * into s from public.creator_submissions where id = sub_id;
  if not found or s.status <> 'pending' then
    raise exception 'Diese Einreichung ist nicht mehr offen.';
  end if;

  select * into t from public.creator_tasks where id = s.task_id;

  keys := public.creator_category_keys(t.category);
  factor := case when t.due_at is not null and s.created_at > t.due_at then 0.5 else 1 end;

  insert into public.creator_xp_events (user_id, submission_id, subkey, amount)
  select s.user_id, s.id, k, round(t.xp * factor / array_length(keys, 1), 2)
  from unnest(keys) as k;

  update public.creator_submissions
  set status = 'approved', xp_awarded = t.xp * factor, reviewed_at = now()
  where id = sub_id;

  insert into public.creator_notifications (user_id, kind, title, xp)
  values (s.user_id, 'approved', t.title, t.xp * factor);

  for g in
    select distinct goal.id, goal.title, goal.bonus_xp, goal.due_at
    from public.creator_goals goal
    join public.creator_goal_tasks gt on gt.goal_id = goal.id
    where gt.task_id = s.task_id
  loop
    continue when exists (
      select 1 from public.creator_goal_tasks gt2
      where gt2.goal_id = g.id
        and not exists (
          select 1 from public.creator_submissions cs
          where cs.user_id = s.user_id and cs.task_id = gt2.task_id and cs.status = 'approved'
        )
    );

    continue when exists (
      select 1 from public.creator_xp_events e where e.goal_id = g.id and e.user_id = s.user_id
    );

    goal_factor := case when g.due_at is not null and now() > g.due_at then 0.5 else 1 end;

    select array_agg(distinct k) into goal_keys
    from public.creator_goal_tasks gt3
    join public.creator_tasks ct on ct.id = gt3.task_id
    cross join lateral unnest(public.creator_category_keys(ct.category)) as k
    where gt3.goal_id = g.id;

    insert into public.creator_xp_events (user_id, goal_id, subkey, amount)
    select s.user_id, g.id, k, round(g.bonus_xp * goal_factor / array_length(goal_keys, 1), 2)
    from unnest(goal_keys) as k;

    insert into public.creator_notifications (user_id, kind, title, xp)
    values (s.user_id, 'goal', g.title, g.bonus_xp * goal_factor);
  end loop;
end;
$$;
