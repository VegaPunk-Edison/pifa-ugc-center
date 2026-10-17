import { supabase } from './supabase.js';

const COLUMNS = 'id, display_name, role';

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

// Nur für Betreiber: alle Profile. Die Datenbank erlaubt das nur Betreibern.
export async function listProfiles() {
  const { data, error } = await supabase
    .from('creator_profiles')
    .select('id, display_name, role, created_at')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}
