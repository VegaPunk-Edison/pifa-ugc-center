-- eSports Athlete Center: Teile, die im Repo bisher gefehlt haben
-- Nach submissions-schema.sql und vor step4-schema.sql ausführen. Sicher erneut ausführbar.

-- Zielgruppe der Zeilen: Freigaben zu Aufgaben haben eine Einreichung, Ziel-Boni nicht.
alter table public.creator_xp_events alter column submission_id drop not null;
alter table public.creator_xp_events add column if not exists goal_id uuid references public.creator_goals (id) on delete cascade;

-- Die Hauptunterattribute je Oberkategorie. Spiegelt src/lib/categories.js.
create or replace function public.creator_category_keys(cat text)
returns text[]
language sql
immutable
as $$
  select case cat
    when 'sho' then array['abschluss', 'schusskraft', 'stellungsspiel', 'weitschuesse', 'volley', 'elfmeter']
    when 'pas' then array['kurzer_pass', 'langer_pass', 'uebersicht', 'flanken', 'fs_praezision', 'effet']
    when 'dri' then array['ballkontrolle', 'dribbling', 'beweglichkeit', 'balance', 'ruhe', 'reaktion']
    when 'phy' then array['ausdauer', 'staerke', 'sprungkraft', 'aggressivitaet']
    when 'def' then array['abfangen', 'defensives_bewusstsein', 'faire_zweikaempfe', 'graetschen', 'kopfball_praezision']
    when 'pac' then array['beschleunigung', 'sprinttempo']
  end;
$$;
