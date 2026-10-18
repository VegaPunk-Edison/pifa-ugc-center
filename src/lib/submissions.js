import { supabase } from './supabase.js';
import { platformByKey } from './platforms.js';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const normalizeChannel = (url) => url.trim().replace(/\/+$/, '');

// Gibt einen Übersetzungsschlüssel zurück, oder '' wenn der TikTok-Link zum Kanal passt.
export function checkSubmissionUrl(url, channel) {
  const base = normalizeChannel(channel);
  const pattern = new RegExp(`^${escapeRegex(base)}/video/\\d+`);
  return pattern.test(url.trim()) ? '' : 'board.wrongVideo';
}

// Bei TikTok muss der Link zum eigenen Kanal passen. Bei den anderen Plattformen prüfen wir das Format,
// die Zugehörigkeit prüft der Betreiber bei der Freigabe.
export function checkPostUrl(platform, url, channel) {
  if (platform.key === 'tiktok') return checkSubmissionUrl(url, channel);
  return platform.postPattern.test(url.trim()) ? '' : 'board.wrongPost';
}

export async function updateChannels(userId, updates) {
  const { error } = await supabase.from('creator_profiles').update(updates).eq('id', userId);
  if (error) throw error;
}

export async function listMySubmissions(userId) {
  const { data, error } = await supabase
    .from('creator_submissions')
    .select('id, task_id, url, platform, status, rejection_reason, xp_awarded, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function submitForTask(userId, taskId, platformKey, url) {
  const platform = platformByKey(platformKey);
  const { error } = await supabase
    .from('creator_submissions')
    .insert({ user_id: userId, task_id: taskId, platform: platform.key, url: url.trim() });
  if (error) throw error;
}

export async function listPendingSubmissions() {
  const { data, error } = await supabase
    .from('creator_submissions')
    .select(
      'id, url, platform, created_at, task:creator_tasks(title, xp), player:creator_profiles(display_name, tiktok_url, instagram_url, youtube_url)',
    )
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function approveSubmission(id) {
  const { error } = await supabase.rpc('approve_creator_submission', { sub_id: id });
  if (error) throw error;
}

export async function rejectSubmission(id, reason) {
  const { error } = await supabase.rpc('reject_creator_submission', { sub_id: id, reason });
  if (error) throw error;
}

export async function listXpEvents(userId) {
  const { data, error } = await supabase
    .from('creator_xp_events')
    .select('subkey, amount')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function listAllXpEvents() {
  const { data, error } = await supabase.from('creator_xp_events').select('user_id, subkey, amount');
  if (error) throw error;
  return data;
}

export async function listUnreadNotifications(userId) {
  const { data, error } = await supabase
    .from('creator_notifications')
    .select('id, kind, title, xp, reason, created_at')
    .eq('user_id', userId)
    .is('read_at', null)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function markNotificationsRead(ids) {
  if (ids.length === 0) return;
  const { error } = await supabase
    .from('creator_notifications')
    .update({ read_at: new Date().toISOString() })
    .in('id', ids);
  if (error) throw error;
}

// Summiert die XP je Unterattribut, z. B. { abschluss: 12.5, ... }.
export function sumXpByKey(events) {
  const totals = {};
  for (const event of events) {
    totals[event.subkey] = (totals[event.subkey] ?? 0) + Number(event.amount);
  }
  return totals;
}
