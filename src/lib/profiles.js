import { supabase } from './supabase.js';

const COLUMNS = 'id, display_name, role, created_at, tiktok_url, instagram_url, youtube_url, language';

// Liefert das Profil des angemeldeten Nutzers. Beim ersten Anmelden wird es als Spieler angelegt.
export async function loadOrCreateProfile(user) {
  const { data, error } = await supabase
    .from('creator_profiles')
    .select(COLUMNS)
    .eq('id', user.id)
    .maybeSingle();
  if (error) throw error;
  if (data) return data;

  const { data: created, error: insertError } = await supabase
    .from('creator_profiles')
    .insert({ id: user.id, display_name: user.email.split('@')[0] })
    .select(COLUMNS)
    .single();
  if (insertError) throw insertError;
  return created;
}

export async function updateLanguage(userId, language) {
  const { error } = await supabase.from('creator_profiles').update({ language }).eq('id', userId);
  if (error) throw error;
}

// Speichert die Spielerinfos. Die Spalten sind per Grant freigegeben, die Rolle bleibt geschützt.
export async function updateProfile(userId, fields) {
  const { data, error } = await supabase
    .from('creator_profiles')
    .update(fields)
    .eq('id', userId)
    .select(COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

// Zählwerte für die Erfolge. Die Abfragen laufen über die Sicherheitsregeln, also nur für den eigenen Account.
export async function loadAchievementFacts(userId) {
  const [approved, goals] = await Promise.all([
    supabase
      .from('creator_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'approved'),
    supabase.from('creator_xp_events').select('id', { count: 'exact', head: true }).eq('user_id', userId).not('goal_id', 'is', null),
  ]);
  if (approved.error) throw approved.error;
  if (goals.error) throw goals.error;
  return { approvedCount: approved.count ?? 0, goalCount: goals.count ?? 0 };
}

// Nur für Betreiber: alle Spieler.
export async function listPlayers() {
  const { data, error } = await supabase
    .from('creator_profiles')
    .select('id, display_name')
    .eq('role', 'player');
  if (error) throw error;
  return data;
}
