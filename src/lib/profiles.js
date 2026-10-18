import { supabase } from './supabase.js';

const COLUMNS = 'id, display_name, role, tiktok_url, instagram_url, youtube_url, language';

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

// Nur für Betreiber: alle Spieler.
export async function listPlayers() {
  const { data, error } = await supabase
    .from('creator_profiles')
    .select('id, display_name')
    .eq('role', 'player');
  if (error) throw error;
  return data;
}
