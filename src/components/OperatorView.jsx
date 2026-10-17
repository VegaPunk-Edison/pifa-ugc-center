import { useEffect, useState } from 'react';
import { listProfiles } from '../lib/profiles.js';

export default function OperatorView() {
  const [profiles, setProfiles] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listProfiles().then(setProfiles).catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="p-6 text-sm text-red-400">{error}</p>;
  if (!profiles) return <p className="p-6 text-sm text-slate-500">Lädt…</p>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold">Spieler-Übersicht</h1>
      <p className="mt-1 text-sm text-slate-400">{profiles.length} Profile</p>
      <ul className="mt-6 divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900">
        {profiles.map((profile) => (
          <li key={profile.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>{profile.display_name || 'Ohne Namen'}</span>
            <span className="text-xs text-slate-500">
              {profile.role === 'operator' ? 'Betreiber' : 'Spieler'}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
