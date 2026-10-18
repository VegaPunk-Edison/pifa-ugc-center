import { useState } from 'react';
import { buildProfile } from '../lib/profile.js';
import { achievementsFor } from '../lib/achievements.js';
import { kopfgeldForLevel, rankForLevel } from '../lib/ranks.js';
import { LANGUAGES, getLang, t } from '../lib/i18n.js';

const NAME_MAX = 30;
const NO_FACTS = { approvedCount: 0, goalCount: 0 };

function LevelBar({ value, max }) {
  const percent = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${percent}%` }} />
    </div>
  );
}

function CategoryTile({ category, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(category.key)}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-3 text-center transition hover:border-emerald-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
    >
      <p className="text-xs font-semibold tracking-widest text-slate-500">{category.abbr}</p>
      <p className="mt-1 text-2xl font-black text-emerald-300">{Math.floor(category.average)}</p>
    </button>
  );
}

function SubRow({ sub }) {
  return (
    <li>
      <div className="flex items-baseline justify-between text-sm">
        <span>
          {t(`attr.${sub.key}`)}{' '}
          <span className="text-xs text-slate-600">{t('profile.weight', { weight: sub.weight })}</span>
        </span>
        <span className="font-semibold">{t('profile.level', { level: sub.level })}</span>
      </div>
      <div className="mt-1">
        <LevelBar value={sub.xpInLevel} max={sub.xpNeeded} />
      </div>
    </li>
  );
}

function CategoryCard({ category }) {
  const main = category.members.filter((m) => !m.sonstige);
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold">
          {t(`cat.${category.key}`)} <span className="text-xs text-slate-500">{category.abbr}</span>
        </h3>
        <span className="text-lg font-bold text-emerald-300">
          {t('profile.level', { level: Math.floor(category.average) })}
        </span>
      </div>
      <ul className="mt-3 space-y-3">
        {main.map((sub) => (
          <SubRow key={sub.key} sub={sub} />
        ))}
      </ul>
    </section>
  );
}

function CategoryDetail({ category, onBack }) {
  const main = category.members.filter((m) => !m.sonstige);
  const sonstige = category.members.filter((m) => m.sonstige);

  return (
    <section>
      <button type="button" onClick={onBack} className="text-sm text-slate-400 underline">
        {t('profile.back')}
      </button>

      <div className="mt-4 flex items-baseline justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-xl font-bold">
          {t(`cat.${category.key}`)} <span className="text-sm text-slate-500">{category.abbr}</span>
        </h2>
        <span className="text-2xl font-black text-emerald-300">
          {t('profile.level', { level: Math.floor(category.average) })}
        </span>
      </div>

      <ul className="mt-4 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        {main.map((sub) => (
          <SubRow key={sub.key} sub={sub} />
        ))}
      </ul>

      {sonstige.length > 0 && (
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
            {t('profile.other')}
          </h3>
          <ul className="space-y-2">
            {sonstige.map((sub) => (
              <li key={sub.key} className="flex items-baseline justify-between text-sm">
                <span>{t(`attr.${sub.key}`)}</span>
                <span className="font-semibold">{t('profile.level', { level: sub.level })}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function NameEditor({ name, onRename }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const start = () => {
    setDraft(name);
    setError('');
    setEditing(true);
  };

  const save = async (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || trimmed.length > NAME_MAX) {
      setError(t('profile.nameHint'));
      return;
    }
    setSaving(true);
    try {
      await onRename(trimmed);
      setEditing(false);
    } catch (err) {
      setError(t('profile.nameError', { message: err.message }));
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{name}</h1>
        <button type="button" onClick={start} className="text-xs text-slate-400 underline">
          {t('profile.rename')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={save} className="mt-1 space-y-2">
      <input
        value={draft}
        maxLength={NAME_MAX}
        onChange={(e) => setDraft(e.target.value)}
        aria-label={t('profile.rename')}
        autoFocus
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
      />
      <div className="flex items-center gap-3 text-sm">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-emerald-400 px-3 py-1.5 font-semibold text-slate-950 disabled:opacity-50"
        >
          {t('profile.renameSave')}
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-slate-400 underline">
          {t('profile.renameCancel')}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  );
}

function InfoRow({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="text-right font-semibold">{children}</span>
    </div>
  );
}

function PlayerInfo({ player, level }) {
  const locale = getLang() === 'en' ? 'en-GB' : 'de-DE';
  const rank = rankForLevel(level);
  const bounty = kopfgeldForLevel(level);
  const language = LANGUAGES.find((item) => item.code === player.language);
  const channels = [
    ['TikTok', player.channels.tiktok],
    ['Instagram', player.channels.instagram],
    ['YouTube', player.channels.youtube],
  ];

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">{t('info.heading')}</h2>
      <div className="space-y-2 text-sm">
        <InfoRow label={t('info.rank')}>{rank.name}</InfoRow>
        <InfoRow label={t('info.bounty')}>{t('info.amount', { amount: bounty.toLocaleString(locale) })}</InfoRow>
        <InfoRow label={t('info.language')}>{language?.label}</InfoRow>
        <InfoRow label={t('info.memberSince')}>{new Date(player.createdAt).toLocaleDateString(locale)}</InfoRow>
        {channels.map(([label, url]) => (
          <InfoRow key={label} label={label}>
            {url ? (
              <span className="break-all">{url.replace(/^https?:\/\/(www\.)?/, '')}</span>
            ) : (
              <span className="text-slate-500">{t('info.none')}</span>
            )}
          </InfoRow>
        ))}
      </div>
    </section>
  );
}

function Achievements({ facts }) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">{t('ach.heading')}</h2>
      <ul className="space-y-2 text-sm">
        {achievementsFor(facts).map((achievement) => (
          <li key={achievement.key} className="flex items-center justify-between gap-4">
            <span className={achievement.done ? 'text-slate-100' : 'text-slate-500'}>
              {t(`ach.${achievement.key}`)}
            </span>
            <span className={achievement.done ? 'font-semibold text-emerald-300' : 'text-xs text-slate-600'}>
              {achievement.done ? t('ach.done') : t('ach.open')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ProfileView({ player, onRename }) {
  const [openKey, setOpenKey] = useState(null);
  const profile = buildProfile(player.xp);
  const level = Math.floor(profile.overall);
  const sonstige = profile.categories.flatMap((category) =>
    category.members.filter((m) => m.sonstige).map((m) => ({ ...m, target: category.abbr })),
  );
  const openCategory = profile.categories.find((category) => category.key === openKey);

  if (openCategory) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-6">
        <CategoryDetail category={openCategory} onBack={() => setOpenKey(null)} />
        <footer className="mt-8 text-center text-xs text-slate-600">{t('profile.footer')}</footer>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-widest text-slate-500">eSports Athlete Center</p>
            <NameEditor name={player.name} onRename={onRename} />
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-slate-500">{t('profile.overall')}</p>
            <p className="text-4xl font-black text-emerald-300">{level}</p>
          </div>
        </div>
      </header>

      <PlayerInfo player={player} level={level} />
      <Achievements facts={player.facts ?? NO_FACTS} />

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
          {t('profile.categories')}
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {profile.categories.map((category) => (
            <CategoryTile key={category.key} category={category} onOpen={setOpenKey} />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
          {t('profile.attributes')}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {profile.categories.map((category) => (
            <CategoryCard key={category.key} category={category} />
          ))}
        </div>
      </section>

      {sonstige.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
            {t('profile.other')}
          </h2>
          <ul className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            {sonstige.map((sub) => (
              <li key={sub.key} className="flex items-baseline justify-between text-sm">
                <span>
                  {t(`attr.${sub.key}`)}{' '}
                  <span className="text-xs text-slate-500">{t('profile.flowsInto', { target: sub.target })}</span>
                </span>
                <span className="font-semibold">{t('profile.level', { level: sub.level })}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-8 text-center text-xs text-slate-600">{t('profile.footer')}</footer>
    </main>
  );
}
