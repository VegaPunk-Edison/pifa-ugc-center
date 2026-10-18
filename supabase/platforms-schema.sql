-- eSports Athlete Center: Plattformen nach Level
-- Einmal im Supabase SQL Editor ausführen. Sicher erneut ausführbar.

alter table public.creator_profiles add column if not exists instagram_url text;
alter table public.creator_profiles add column if not exists youtube_url text;
grant update (instagram_url, youtube_url) on public.creator_profiles to authenticated;

alter table public.creator_submissions add column if not exists platform text not null default 'tiktok'
  check (platform in ('tiktok', 'instagram', 'youtube'));
