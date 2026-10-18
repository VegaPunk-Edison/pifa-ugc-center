import { useEffect, useState } from 'react';
import { categoryAbbr, formatDue, isOverdue, listGoals, listTasks } from '../lib/tasks.js';
import { t } from '../lib/i18n.js';
import { PLATFORMS, isValidChannel, platformByKey } from '../lib/platforms.js';
import {
  checkPostUrl,
  listMySubmissions,
  listUnreadNotifications,
  markNotificationsRead,
  normalizeChannel,
  submitForTask,
  updateChannels,
} from '../lib/submissions.js';

const INPUT = 'mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100';
const BUTTON = 'w-full rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50';

function Status({ dueAt }) {
  return isOverdue(dueAt) ? (
    <span className="text-xs font-semibold text-red-400">{t('status.overdue')}</span>
  ) : (
    <span className="text-xs text-slate-400">{t('status.open')}</span>
  );
}

function Card({ children }) {
  return <li className="rounded-2xl border border-slate-800 bg-slate-900 p-4">{children}</li>;
}

function newsText(item) {
  if (item.kind === 'approved') return t('news.approved', { title: item.title, xp: Number(item.xp) });
  if (item.kind === 'goal') return t('news.goal', { title: item.title, xp: Number(item.xp) });
  return t('news.rejected', { title: item.title, reason: item.reason ?? '' });
}

function News({ items, onRead }) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-2 rounded-2xl border border-emerald-400/40 bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">{t('board.news')}</h2>
        <button type="button" onClick={onRead} className="text-xs underline">
          {t('board.markRead')}
        </button>
      </div>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.id}>{newsText(item)}</li>
        ))}
      </ul>
    </section>
  );
}

function ChannelsForm({ profile, level, onSaved }) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(PLATFORMS.map((p) => [p.key, profile[p.channelField] ?? ''])),
  );
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    const unlocked = PLATFORMS.filter((p) => level >= p.unlockLevel);
    for (const p of unlocked) {
      const value = values[p.key].trim();
      if (value && !isValidChannel(p, value)) {
        setError(t('board.channelInvalid', { example: p.channelPlaceholder }));
        return;
      }
    }
    const updates = Object.fromEntries(
      unlocked.map((p) => [p.channelField, values[p.key].trim() ? normalizeChannel(values[p.key]) : null]),
    );
    try {
      await updateChannels(profile.id, updates);
      setError('');
      setInfo(t('board.channelSaved'));
      onSaved(updates);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
      {PLATFORMS.map((p) => {
        const locked = level < p.unlockLevel;
        return (
          <label key={p.key} className="block text-sm text-slate-400">
            {t('board.channelOf', { platform: p.label })}
            {locked && <span className="ml-2 text-xs text-slate-600">{t('board.unlockAt', { level: p.unlockLevel })}</span>}
            <input
              value={values[p.key]}
              disabled={locked}
              placeholder={p.channelPlaceholder}
              onChange={(e) => {
                setValues((prev) => ({ ...prev, [p.key]: e.target.value }));
                setInfo('');
              }}
              className={INPUT + (locked ? ' opacity-40' : '')}
            />
          </label>
        );
      })}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {info && <p className="text-sm text-emerald-300">{info}</p>}
      <button type="submit" className={BUTTON}>
        {t('board.channelSave')}
      </button>
    </form>
  );
}

function SubmitForm({ userId, taskId, channels, level, onSubmitted }) {
  const available = PLATFORMS.filter((p) => level >= p.unlockLevel && channels[p.key]);
  const [platformKey, setPlatformKey] = useState(available[0]?.key ?? 'tiktok');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (available.length === 0) {
    return <p className="mt-2 text-xs text-slate-500">{t('board.needChannelAny')}</p>;
  }

  const platform = platformByKey(platformKey) ?? available[0];

  const submit = async (event) => {
    event.preventDefault();
    const problem = checkPostUrl(platform, url, channels[platform.key]);
    if (problem) {
      setError(t(problem));
      return;
    }
    setBusy(true);
    setError('');
    try {
      await submitForTask(userId, taskId, platform.key, url);
      setUrl('');
      onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3 space-y-2">
      <label className="block text-xs text-slate-400">
        {t('board.platform')}
        <select value={platform.key} onChange={(e) => setPlatformKey(e.target.value)} className={INPUT}>
          {available.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <input
        required
        placeholder={t('board.submitLinkOf')}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className={INPUT}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button type="submit" disabled={busy} className={BUTTON}>
        {t('board.submit')}
      </button>
    </form>
  );
}

function TaskStatus({ submission }) {
  if (!submission) return null;
  if (submission.status === 'pending') {
    return <p className="mt-2 text-xs text-slate-400">{t('board.waiting')}</p>;
  }
  if (submission.status === 'approved') {
    return <p className="mt-2 text-xs text-emerald-300">{t('board.approvedXp', { xp: Number(submission.xp_awarded) })}</p>;
  }
  return (
    <p className="mt-2 text-xs text-red-400">
      {t('board.rejected', { reason: submission.rejection_reason || t('board.noReason') })}
    </p>
  );
}

export default function TaskBoard({ profile, level, onProfileChange }) {
  const [tasks, setTasks] = useState(null);
  const [goals, setGoals] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');

  const reload = () =>
    Promise.all([listTasks(), listGoals(), listMySubmissions(profile.id), listUnreadNotifications(profile.id)])
      .then(([tk, g, s, n]) => {
        setTasks(tk);
        setGoals(g);
        setSubmissions(s);
        setNews(n);
      })
      .catch((err) => setError(err.message));

  useEffect(() => {
    reload();
  }, []);

  const markRead = async () => {
    try {
      await markNotificationsRead(news.map((n) => n.id));
      setNews([]);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <p className="text-sm text-red-400">{t('board.loadError', { message: error })}</p>;
  if (!tasks || !goals) return <p className="text-sm text-slate-500">{t('loading')}</p>;

  const channels = Object.fromEntries(PLATFORMS.map((p) => [p.key, profile[p.channelField]]));

  return (
    <div className="space-y-8">
      <News items={news} onRead={markRead} />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">{t('board.channel')}</h2>
        <ChannelsForm
          profile={profile}
          level={level}
          onSaved={(updates) => onProfileChange({ ...profile, ...updates })}
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">{t('board.goals')}</h2>
        {goals.length === 0 ? (
          <p className="text-sm text-slate-500">{t('board.noGoals')}</p>
        ) : (
          <ul className="space-y-3">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold">{goal.title}</h3>
                  <span className="text-sm font-semibold text-emerald-300">+{goal.bonus_xp} XP</span>
                </div>
                {goal.description && <p className="mt-1 text-sm text-slate-400">{goal.description}</p>}
                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>{t('board.goalMeta', { count: goal.taskIds.length, due: formatDue(goal.due_at) })}</span>
                  <Status dueAt={goal.due_at} />
                </div>
              </Card>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">{t('board.tasks')}</h2>
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500">{t('board.noTasks')}</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => {
              const mine = submissions.filter((s) => s.task_id === task.id);
              const blocked =
                mine.some((s) => s.status === 'pending') ||
                (!task.repeatable && mine.some((s) => s.status === 'approved'));
              return (
                <Card key={task.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold">{task.title}</h3>
                    <span className="text-sm font-semibold text-emerald-300">{task.xp} XP</span>
                  </div>
                  {task.description && <p className="mt-1 text-sm text-slate-400">{task.description}</p>}
                  <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span>
                      {t('board.taskMeta', {
                        category: categoryAbbr(task.category),
                        repeat: task.repeatable ? t('task.repeatable') : t('task.once'),
                        due: formatDue(task.due_at),
                      })}
                    </span>
                    <Status dueAt={task.due_at} />
                  </div>
                  <TaskStatus submission={mine[0]} />
                  {!blocked && (
                    <SubmitForm
                      userId={profile.id}
                      taskId={task.id}
                      channels={channels}
                      level={level}
                      onSubmitted={reload}
                    />
                  )}
                </Card>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
