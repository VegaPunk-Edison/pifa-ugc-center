import { useEffect, useState } from 'react';
import { CATEGORIES } from '../lib/categories.js';
import {
  categoryAbbr,
  createGoal,
  createTask,
  deleteGoal,
  deleteTask,
  formatDue,
  listGoals,
  listTasks,
} from '../lib/tasks.js';
import { t } from '../lib/i18n.js';

const INPUT = 'mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100';
const BUTTON = 'w-full rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50';
const EMPTY_TASK = { title: '', description: '', category: 'sho', xp: 10, due: '', repeatable: false };
const EMPTY_GOAL = { title: '', description: '', bonus_xp: 50, due: '', taskIds: [] };

const toIso = (value) => (value ? new Date(value).toISOString() : null);

function TaskForm({ onSaved }) {
  const [form, setForm] = useState(EMPTY_TASK);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await createTask({
        title: form.title,
        description: form.description,
        category: form.category,
        xp: Number(form.xp),
        due_at: toIso(form.due),
        repeatable: form.repeatable,
      });
      setForm(EMPTY_TASK);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="font-semibold">{t('admin.newTask')}</h3>
      <input
        required
        placeholder={t('admin.title')}
        value={form.title}
        onChange={(e) => set('title', e.target.value)}
        className={INPUT}
      />
      <textarea
        placeholder={t('admin.description')}
        rows={2}
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        className={INPUT}
      />
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-slate-400">
          {t('admin.category')}
          <select value={form.category} onChange={(e) => set('category', e.target.value)} className={INPUT}>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.abbr} · {t(`cat.${c.key}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-400">
          {t('admin.xp')}
          <input
            type="number"
            min={1}
            max={99}
            required
            value={form.xp}
            onChange={(e) => set('xp', e.target.value)}
            className={INPUT}
          />
        </label>
      </div>
      <label className="block text-sm text-slate-400">
        {t('admin.deadline')}
        <input
          type="datetime-local"
          value={form.due}
          onChange={(e) => set('due', e.target.value)}
          className={INPUT}
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-slate-400">
        <input type="checkbox" checked={form.repeatable} onChange={(e) => set('repeatable', e.target.checked)} />
        {t('admin.repeatable')}
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={busy} className={BUTTON}>
        {t('admin.createTask')}
      </button>
    </form>
  );
}

function GoalForm({ tasks, onSaved }) {
  const [form, setForm] = useState(EMPTY_GOAL);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleTask = (id) =>
    set('taskIds', form.taskIds.includes(id) ? form.taskIds.filter((x) => x !== id) : [...form.taskIds, id]);

  const submit = async (event) => {
    event.preventDefault();
    if (form.taskIds.length === 0) {
      setError(t('admin.pickOne'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      await createGoal(
        {
          title: form.title,
          description: form.description,
          bonus_xp: Number(form.bonus_xp),
          due_at: toIso(form.due),
        },
        form.taskIds,
      );
      setForm(EMPTY_GOAL);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="font-semibold">{t('admin.newGoal')}</h3>
      <input
        required
        placeholder={t('admin.title')}
        value={form.title}
        onChange={(e) => set('title', e.target.value)}
        className={INPUT}
      />
      <textarea
        placeholder={t('admin.description')}
        rows={2}
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        className={INPUT}
      />
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-slate-400">
          {t('admin.bonusXp')}
          <input
            type="number"
            min={1}
            required
            value={form.bonus_xp}
            onChange={(e) => set('bonus_xp', e.target.value)}
            className={INPUT}
          />
        </label>
        <label className="text-sm text-slate-400">
          {t('admin.deadline')}
          <input
            type="datetime-local"
            value={form.due}
            onChange={(e) => set('due', e.target.value)}
            className={INPUT}
          />
        </label>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm text-slate-400">{t('admin.tasksInGoal')}</legend>
        {tasks.length === 0 && <p className="text-sm text-slate-500">{t('admin.needTasks')}</p>}
        {tasks.map((task) => (
          <label key={task.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.taskIds.includes(task.id)} onChange={() => toggleTask(task.id)} />
            {task.title}
          </label>
        ))}
      </fieldset>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={busy} className={BUTTON}>
        {t('admin.createGoal')}
      </button>
    </form>
  );
}

export default function TaskAdmin() {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState('');

  const reload = () =>
    Promise.all([listTasks(), listGoals()])
      .then(([tk, g]) => {
        setTasks(tk);
        setGoals(g);
      })
      .catch((err) => setError(err.message));

  useEffect(() => {
    reload();
  }, []);

  const remove = async (kind, id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      if (kind === 'task') await deleteTask(id);
      else await deleteGoal(id);
      reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 pb-10">
      <h2 className="text-xl font-bold">{t('admin.heading')}</h2>
      {error && <p className="text-sm text-red-400">{error}</p>}

      <TaskForm onSaved={reload} />

      <section className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm"
          >
            <span>
              {t('admin.taskLine', {
                title: task.title,
                xp: task.xp,
                category: categoryAbbr(task.category),
                due: formatDue(task.due_at),
              })}
            </span>
            <button type="button" onClick={() => remove('task', task.id)} className="shrink-0 text-red-400 underline">
              {t('admin.delete')}
            </button>
          </div>
        ))}
      </section>

      <GoalForm tasks={tasks} onSaved={reload} />

      <section className="space-y-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm"
          >
            <span>
              {t('admin.goalLine', { title: goal.title, xp: goal.bonus_xp, count: goal.taskIds.length })}
            </span>
            <button type="button" onClick={() => remove('goal', goal.id)} className="shrink-0 text-red-400 underline">
              {t('admin.delete')}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
