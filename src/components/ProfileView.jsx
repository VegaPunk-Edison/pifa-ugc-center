import { buildProfile } from '../lib/profile.js';
import { t } from '../lib/i18n.js';

function LevelBar({ value, max }) {
  const percent = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${percent}%` }} />
    </div>
  );
}

function CategoryTile({ category }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 text-center">
      <p className="text-xs font-semibold tracking-widest text-slate-500">{category.abbr}</p>
      <p className="mt-1 text-2xl font-black text-emerald-300">{Math.floor(category.average)}</p>
      <p className="mt-1 text-xs text-slate-400">{t(`cat.${category.key}`)}</p>
    </div>
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

export default function ProfileView({ player }) {
  const profile = buildProfile(player.xp);
  const sonstige = profile.categories.flatMap((category) =>
    category.members.filter((m) => m.sonstige).map((m) => ({ ...m, target: category.abbr })),
  );

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">eSports Athlete Center</p>
            <h1 className="mt-1 text-2xl font-bold">{player.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-slate-500">{t('profile.overall')}</p>
            <p className="text-4xl font-black text-emerald-300">{Math.floor(profile.overall)}</p>
          </div>
        </div>
      </header>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
          {t('profile.categories')}
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {profile.categories.map((category) => (
            <CategoryTile key={category.key} category={category} />
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
