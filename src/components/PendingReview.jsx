import { useEffect, useState } from 'react';
import { approveSubmission, listPendingSubmissions, rejectSubmission } from '../lib/submissions.js';
import { platformByKey } from '../lib/platforms.js';
import { t } from '../lib/i18n.js';

export default function PendingReview() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  const reload = () => listPendingSubmissions().then(setItems).catch((err) => setError(err.message));

  useEffect(() => {
    reload();
  }, []);

  const approve = async (id) => {
    setError('');
    try {
      await approveSubmission(id);
      reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const reject = async (id) => {
    const reason = window.prompt(t('review.reasonPrompt'));
    if (!reason) return;
    setError('');
    try {
      await rejectSubmission(id, reason);
      reload();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!items) return <p className="p-6 text-center text-sm text-slate-500">{t('loading')}</p>;

  return (
    <section className="mx-auto max-w-3xl space-y-3 px-4">
      <h2 className="text-xl font-bold">{t('review.heading')}</h2>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {items.length === 0 && <p className="text-sm text-slate-500">{t('review.none')}</p>}
      {items.map((item) => {
        const platform = platformByKey(item.platform) ?? platformByKey('tiktok');
        const channel = item.player?.[platform.channelField];
        return (
          <div key={item.id} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm">
            <p>
              {item.player?.display_name} · {item.task?.title} · {item.task?.xp} XP · {platform.label}
            </p>
            <p className="text-xs text-slate-400">
              {t('review.channel')}: {channel ?? '—'}
            </p>
            <a href={item.url} target="_blank" rel="noreferrer" className="block break-all text-emerald-300 underline">
              {item.url}
            </a>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => approve(item.id)}
                className="rounded-lg bg-emerald-400 px-3 py-1 font-semibold text-slate-950"
              >
                {t('review.approve')}
              </button>
              <button
                type="button"
                onClick={() => reject(item.id)}
                className="rounded-lg border border-red-400 px-3 py-1 text-red-400"
              >
                {t('review.reject')}
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
}
