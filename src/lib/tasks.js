import { supabase } from './supabase.js';
import { CATEGORIES } from './categories.js';
import { getLang, t } from './i18n.js';

const CATEGORY_ABBR = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.abbr]));

export const categoryAbbr = (key) => CATEGORY_ABBR[key] ?? key;

export const isOverdue = (dueAt) => Boolean(dueAt) && new Date(dueAt) < new Date();

export const formatDue = (dueAt) =>
  dueAt
    ? new Date(dueAt).toLocaleString(getLang() === 'en' ? 'en-GB' : 'de-DE', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : t('due.none');

export async function listTasks() {
  const { data, error } = await supabase
    .from('creator_tasks')
    .select('id, title, description, category, xp, due_at, repeatable')
    .order('due_at', { ascending: true, nullsFirst: false });
  if (error) throw error;
  return data;
}

export async function listGoals() {
  const { data, error } = await supabase
    .from('creator_goals')
    .select('id, title, description, bonus_xp, due_at, creator_goal_tasks(task_id)')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data.map((goal) => ({
    ...goal,
    taskIds: goal.creator_goal_tasks.map((link) => link.task_id),
  }));
}

export async function createTask(task) {
  const { data, error } = await supabase.from('creator_tasks').insert(task).select('id').single();
  if (error) throw error;
  return data.id;
}

export async function createGoal(goal, taskIds) {
  const { data, error } = await supabase.from('creator_goals').insert(goal).select('id').single();
  if (error) throw error;
  const links = taskIds.map((task_id) => ({ goal_id: data.id, task_id }));
  const { error: linkError } = await supabase.from('creator_goal_tasks').insert(links);
  if (linkError) throw linkError;
  return data.id;
}

export async function deleteTask(id) {
  const { error } = await supabase.from('creator_tasks').delete().eq('id', id);
  if (error) throw error;
}

export async function deleteGoal(id) {
  const { error } = await supabase.from('creator_goals').delete().eq('id', id);
  if (error) throw error;
}
