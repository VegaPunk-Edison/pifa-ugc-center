-- eSports Athlete Center: Sprache im Profil
-- Einmal im Supabase SQL Editor ausführen. Sicher erneut ausführbar.

alter table public.creator_profiles add column if not exists language text not null default 'de'
  check (language in ('de', 'en'));
grant update (language) on public.creator_profiles to authenticated;
