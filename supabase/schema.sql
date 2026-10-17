-- eSports Athlete Center: Profile und Rollen
-- Einmal im Supabase SQL Editor ausführen. Sicher erneut ausführbar.
-- Die Tabelle heißt bewusst creator_profiles, damit eine bestehende Tabelle profiles unberührt bleibt.

create table if not exists public.creator_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  role text not null default 'player' check (role in ('player', 'operator')),
  created_at timestamptz not null default now()
);

alter table public.creator_profiles enable row level security;

-- Prüft, ob der angemeldete Nutzer Betreiber ist.
create or replace function public.is_creator_operator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.creator_profiles where id = auth.uid() and role = 'operator'
  );
$$;

-- Der Nutzer darf nur seinen Anzeigenamen ändern, nicht seine Rolle.
revoke update on public.creator_profiles from authenticated;
grant update (display_name) on public.creator_profiles to authenticated;

drop policy if exists "creator_profiles_select" on public.creator_profiles;
create policy "creator_profiles_select" on public.creator_profiles
  for select to authenticated
  using (id = auth.uid() or public.is_creator_operator());

drop policy if exists "creator_profiles_insert" on public.creator_profiles;
create policy "creator_profiles_insert" on public.creator_profiles
  for insert to authenticated
  with check (id = auth.uid() and role = 'player');

drop policy if exists "creator_profiles_update" on public.creator_profiles;
create policy "creator_profiles_update" on public.creator_profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
