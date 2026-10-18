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
const CARD = 'rounded-2xl border border-slate-800 bg-slate-900 p-5';
const BACK = 'text-sm text-slate-400 underline';

function LevelBar({ value, max }) {
  const percent = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${percent}%` }} />
    </div>
  );
}

function CategoryTile({ category, onOpen }) {
  const rank = rankForLevel(Math.floor(category.average));
  return (
    <button
      type="button"
      onClick={() => onOpen(category.key)}
      style={{ '--rank': rank.color, borderColor: rank.color }}
      className="rank-tile rounded-2xl border-2 bg-slate-900 p-3 text-center transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      <p className="text-xs font-semibold tracking-widest text-slate-500">{category.abbr}</p>
      <p className="mt-1 text-2xl font-black" style={{ color: rank.color }}>
        {Math.floor(category.average)}
      </p>
      <p className="mt-1 text-xs font-semibold" style={{ color: rank.color }}>
        {rank.name}
      </p>
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
  const rank = rankForLevel(Math.floor(category.average));
  const main = category.members.filter((m) => !m.sonstige);
  const sonstige = category.members.filter((m) => m.sonstige);

  return (
    <section>
      <button type="button" onClick={onBack} className={BACK}>
        {t('profile.back')}
      </button>

      <div className={`mt-4 flex items-baseline justify-between ${CARD}`}>
        <h2 className="text-xl font-bold">
          {t(`cat.${category.key}`)} <span className="text-sm text-slate-500">{category.abbr}</span>
        </h2>
        <div className="text-right">
          <p className="text-2xl font-black" style={{ color: rank.color }}>
            {t('profile.level', { level: Math.floor(category.average) })}
          </p>
          <p className="text-xs font-semibold" style={{ color: rank.color }}>
            {rank.name}
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        {main.map((sub) => (
          <SubRow key={sub.key} sub={sub} />
        ))}
      </ul>

      {sonstige.length > 0 && (
        <div className={`mt-4 ${CARD}`}>
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

function Achievements({ facts }) {
  return (
    <section className={`mt-4 ${CARD}`}>
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

function InfoTab({ player, level, onSave }) {
  const [name, setName] = useState(player.name);
  const [language, setLanguage] = useState(player.language);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const locale = getLang() === 'en' ? 'en-GB' : 'de-DE';
  const bounty = kopfgeldForLevel(level);

  const submit = async (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > NAME_MAX) {
      setError(t('profile.nameHint'));
      return;
    }
    setSaving(true);
    setError('');
    setInfo('');
    try {
      await onSave({ display_name: trimmed, language });
      setInfo(t('info.saved'));
    } catch (err) {
      setError(t('info.saveError', { message: err.message }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className={`space-y-4 ${CARD}`}>
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
        {error && <p className="text-sm text-red-400">{error}</p>}
        {info && <p className="text-sm text-emerald-300">{info}</p>}
        <button type="submit" disabled={saving} className={BUTTON}>
          {t('info.save')}
        </button>
      </form>

      <div className={`space-y-2 text-sm ${CARD}`}>
        <InfoRow label={t('info.rank')}>{rankForLevel(level).name}</InfoRow>
        <InfoRow label={t('info.bounty')}>{t('info.amount', { amount: bounty.toLocaleString(locale) })}</InfoRow>
        <InfoRow label={t('info.memberSince')}>{new Date(player.createdAt).toLocaleDateString(locale)}</InfoRow>
      </div>

    </div>
  );
}

function SocialTab({ player, level, onOpen }) {
  return (
    <ul className="space-y-3">
      {PLATFORMS.map((p) => {
        const locked = level < p.unlockLevel;
        const url = player.channels[p.key];
        return (
          <li key={p.key}>
            <button
              type="button"
              disabled={locked}
              onClick={() => onOpen(p.key)}
              className={`flex w-full items-center justify-between gap-4 text-left disabled:opacity-40 ${CARD}`}
            >
              <span className="font-semibold">{p.label}</span>
              <span className="break-all text-right text-sm text-slate-400">
                {locked
                  ? t('board.unlockAt', { level: p.unlockLevel })
                  : url
                    ? url.replace(/^https?:\/\/(www\.)?/, '')
                    : t('info.none')}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function PlatformDetail({ platform, value, onBack, onSave }) {
  const [draft, setDraft] = useState(value ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (trimmed && !isValidChannel(platform, trimmed)) {
      setError(t('board.channelInvalid', { example: platform.channelPlaceholder }));
      return;
    }
    setSaving(true);
    setError('');
    setInfo('');
    try {
      await onSave({ [platform.channelField]: trimmed ? normalizeChannel(trimmed) : null });
      setInfo(t('info.saved'));
    } catch (err) {
      setError(t('info.saveError', { message: err.message }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4">
      <button type="button" onClick={onBack} className={BACK}>
        {t('profile.back')}
      </button>
      <h2 className="text-xl font-bold">{platform.label}</h2>

      <form onSubmit={submit} className={`space-y-4 ${CARD}`}>
        <label className="block text-sm text-slate-400">
          {t('board.channelOf', { platform: platform.label })}
          <input
            value={draft}
            placeholder={platform.channelPlaceholder}
            onChange={(e) => setDraft(e.target.value)}
            className={INPUT}
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {info && <p className="text-sm text-emerald-300">{info}</p>}
        <button type="submit" disabled={saving} className={BUTTON}>
          {t('info.save')}
        </button>
      </form>

      <p className="text-sm text-slate-500">{t('social.metricsSoon')}</p>
    </section>
  );
}

const TABS = [
  { key: 'info', label: 'tabs.info' },
  { key: 'tasks', label: 'tabs.tasks' },
  { key: 'achievements', label: 'tabs.achievements' },
  { key: 'social', label: 'tabs.social' },
];

function PlayerDetail({ player, level, facts, tasks, onBack, onSave }) {
  const [tab, setTab] = useState('info');
  const [platformKey, setPlatformKey] = useState(null);
  const platform = PLATFORMS.find((p) => p.key === platformKey);

  if (platform) {
    return (
      <PlatformDetail
        platform={platform}
        value={player.channels[platform.key]}
        onBack={() => setPlatformKey(null)}
        onSave={onSave}
      />
    );
  }

  return (
    <section>
      <button type="button" onClick={onBack} className={BACK}>
        {t('profile.back')}
      </button>
      <h2 className="mt-4 break-words text-2xl font-bold">{player.name}</h2>

      <div className="mt-4 flex gap-2 border-b border-slate-800">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm ${
              tab === item.key ? 'border-emerald-400 font-semibold text-emerald-300' : 'border-transparent text-slate-400'
            }`}
          >
            {t(item.label)}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'info' && <InfoTab player={player} level={level} onSave={onSave} />}
        {tab === 'tasks' && tasks}
        {tab === 'achievements' && <Achievements facts={facts} />}
        {tab === 'social' && <SocialTab player={player} level={level} onOpen={setPlatformKey} />}
      </div>
    </section>
  );
}

export default function ProfileView({ player, onSave, tasks }) {
  const [openKey, setOpenKey] = useState(null);
  const [inDetail, setInDetail] = useState(false);
  const profile = buildProfile(player.xp);
  const level = Math.floor(profile.overall);
  const rank = rankForLevel(level);
  const openCategory = profile.categories.find((category) => category.key === openKey);

  if (inDetail) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-6">
        <PlayerDetail
          player={player}
          level={level}
          facts={player.facts ?? NO_FACTS}
          tasks={tasks}
          onBack={() => setInDetail(false)}
          onSave={onSave}
        />
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
      <header className={CARD}>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-widest text-slate-500">eSports Athlete Center</p>
            <button type="button" onClick={() => setInDetail(true)} className="mt-1 block max-w-full text-left">
              <span className="block break-words text-2xl font-bold">{player.name}</span>
              <span className="block text-sm font-semibold" style={{ color: rank.color }}>
                {rank.name}
              </span>
            </button>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-slate-500">{t('profile.overall')}</p>
            <p className="text-4xl font-black" style={{ color: rank.color }}>
              {level}
            </p>
          </div>
        </div>
      </header>

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

      <footer className="mt-8 text-center text-xs text-slate-600">{t('profile.footer')}</footer>
    </main>
  );
}
