import { useState } from 'react';
import { buildProfile } from '../lib/profile.js';
import { achievementsFor } from '../lib/achievements.js';
import { kopfgeldForLevel, rankForLevel } from '../lib/ranks.js';
import { PLATFORMS, isValidChannel } from '../lib/platforms.js';
import { normalizeChannel } from '../lib/submissions.js';
import { LANGUAGES, getLang, t } from '../lib/i18n.js';

const NAME_MAX = 30;
const NO_FACTS = { approvedCount: 0, goalCount: 0 };
const INPUT = 'mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100';
const BUTTON = 'w-full rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50';

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

function InfoRow({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="text-right font-semibold">{children}</span>
    </div>
  );
}

function PlayerInfoDetail({ player, level, onBack, onSave }) {
  const [name, setName] = useState(player.name);
  const [language, setLanguage] = useState(player.language);
  const [channels, setChannels] = useState({
    tiktok: player.channels.tiktok ?? '',
    instagram: player.channels.instagram ?? '',
    youtube: player.channels.youtube ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const locale = getLang() === 'en' ? 'en-GB' : 'de-DE';
  const rank = rankForLevel(level);
  const bounty = kopfgeldForLevel(level);

  const submit = async (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > NAME_MAX) {
      setError(t('profile.nameHint'));
      return;
    }
    const unlocked = PLATFORMS.filter((p) => level >= p.unlockLevel);
    for (const p of unlocked) {
      const value = channels[p.key].trim();
      if (value && !isValidChannel(p, value)) {
        setError(t('board.channelInvalid', { example: p.channelPlaceholder }));
        return;
      }
    }
    const updates = { display_name: trimmed, language };
    for (const p of unlocked) {
      const value = channels[p.key].trim();
      updates[p.channelField] = value ? normalizeChannel(value) : null;
    }

    setSaving(true);
    setError('');
    setInfo('');
    try {
      await onSave(updates);
      setInfo(t('info.saved'));
    } catch (err) {
      setError(t('info.saveError', { message: err.message }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={onBack} className="text-sm text-slate-400 underline">
        {t('profile.back')}
      </button>
      <h2 className="mt-4 text-xl font-bold">{t('info.heading')}</h2>

      <div className="mt-4 space-y-2 rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm">
        <InfoRow label={t('info.rank')}>{rank.name}</InfoRow>
        <InfoRow label={t('info.bounty')}>{t('info.amount', { amount: bounty.toLocaleString(locale) })}</InfoRow>
        <InfoRow label={t('info.memberSince')}>{new Date(player.createdAt).toLocaleDateString(locale)}</InfoRow>
      </div>

      <form onSubmit={submit} className="mt-4 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <label className="block text-sm text-slate-400">
          {t('info.name')}
          <input value={name} maxLength={NAME_MAX} onChange={(e) => setName(e.target.value)} className={INPUT} />
        </label>

        <label className="block text-sm text-slate-400">
          {t('info.language')}
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className={INPUT}>
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        {PLATFORMS.map((p) => {
          const locked = level < p.unlockLevel;
          return (
            <label key={p.key} className="block text-sm text-slate-400">
              {t('board.channelOf', { platform: p.label })}
              {locked && (
                <span className="ml-2 text-xs text-slate-600">{t('board.unlockAt', { level: p.unlockLevel })}</span>
              )}
              <input
                value={channels[p.key]}
                disabled={locked}
                placeholder={p.channelPlaceholder}
                onChange={(e) => setChannels((prev) => ({ ...prev, [p.key]: e.target.value }))}
                className={INPUT + (locked ? ' opacity-40' : '')}
              />
            </label>
          );
        })}

        {error && <p className="text-sm text-red-400">{error}</p>}
        {info && <p className="text-sm text-emerald-300">{info}</p>}
        <button type="submit" disabled={saving} className={BUTTON}>
          {t('info.save')}
        </button>
      </form>
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

export default function ProfileView({ player, onSave }) {
  const [openKey, setOpenKey] = useState(null);
  const profile = buildProfile(player.xp);
  const level = Math.floor(profile.overall);
  const sonstige = profile.categories.flatMap((category) =>
    category.members.filter((m) => m.sonstige).map((m) => ({ ...m, target: category.abbr })),
  );
  const openCategory = profile.categories.find((category) => category.key === openKey);

  if (openKey === 'info') {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-6">
        <PlayerInfoDetail player={player} level={level} onBack={() => setOpenKey(null)} onSave={onSave} />
        <footer className="mt-8 text-center text-xs text-slate-600">{t('profile.footer')}</footer>
      </main>
    );
  }

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
            <button type="button" onClick={() => setOpenKey('info')} className="mt-1 block max-w-full text-left">
              <span className="block break-words text-2xl font-bold">{player.name}</span>
              <span className="text-xs text-slate-500 underline">{t('info.tapHint')}</span>
            </button>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-slate-500">{t('profile.overall')}</p>
            <p className="text-4xl font-black text-emerald-300">{level}</p>
          </div>
        </div>
      </header>

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
