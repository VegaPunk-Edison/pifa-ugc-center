import { useEffect, useState } from 'react';
import { buildProfile } from '../lib/profile.js';
import { listPlayers } from '../lib/profiles.js';
import { listAllXpEvents, sumXpByKey } from '../lib/submissions.js';
import { t } from '../lib/i18n.js';

export default function Leaderboard() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([listPlayers(), listAllXpEvents()])
      .then(([players, events]) => {
        const byUser = {};
        for (const event of events) {
          if (!byUser[event.user_id]) byUser[event.user_id] = [];
          byUser[event.user_id].push(event);
        }
        const ranked = players
          .map((player) => ({
            id: player.id,
            name: player.display_name || '—',
            overall: buildProfile(sumXpByKey(byUser[player.id] ?? [])).overall,
          }))
          .sort((a, b) => b.overall - a.overall || a.name.localeCompare(b.name));
        setRows(ranked);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="p-6 text-center text-sm text-red-400">{error}</p>;
  if (!rows) return <p className="p-6 text-center text-sm text-slate-500">{t('loading')}</p>;

  return (
    <section className="mx-auto max-w-3xl space-y-3 px-4">
      <h2 className="text-xl font-bold">{t('lead.heading')}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">{t('lead.empty')}</p>
      ) : (
        <ol className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900">
          {rows.map((row, index) => (
            <li key={row.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>
                {index + 1}. {row.name}
              </span>
              <span className="font-semibold text-emerald-300">
                {t('lead.level', { level: Math.floor(row.overall) })}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
