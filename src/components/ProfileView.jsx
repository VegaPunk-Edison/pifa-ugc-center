import { ATTRIBUTES } from '../lib/attributes.js';
import { computeLevelFromXP } from '../lib/xp.js';

function XpBar({ value, max }) {
  const percent = max ? Math.min(100, Math.round((value / max) * 100)) : 100;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
      <div
        className="h-full rounded-full bg-emerald-400 transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function LevelInfo({ xpInLevel, xpNeeded }) {
  if (xpNeeded === null) {
    return <p className="text-xs font-semibold text-amber-300">MAX</p>;
  }
  return (
    <p className="text-xs text-slate-400">
      {xpInLevel} / {xpNeeded} XP
    </p>
  );
}

function AttributeCard({ name, source, xp }) {
  const { level, xpInLevel, xpNeeded } = computeLevelFromXP(xp);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold">{name}</h3>
        <span className="text-lg font-bold text-emerald-300">Lv {level}</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">{source}</p>
      <div className="mt-3">
        <XpBar value={xpInLevel} max={xpNeeded} />
      </div>
      <div className="mt-1">
        <LevelInfo xpInLevel={xpInLevel} xpNeeded={xpNeeded} />
      </div>
    </div>
  );
}

export default function ProfileView({ player }) {
  const totalXp = Object.values(player.xp).reduce((sum, value) => sum + value, 0);
  const overall = computeLevelFromXP(totalXp);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">UGC Creator Center</p>
            <h1 className="mt-1 text-2xl font-bold">{player.name}</h1>
            <p className="text-sm text-slate-400">Position {player.position}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-slate-500">Pro-Level</p>
            <p className="text-4xl font-black text-emerald-300">{overall.level}</p>
          </div>
        </div>
        <div className="mt-4">
          <XpBar value={overall.xpInLevel} max={overall.xpNeeded} />
          <div className="mt-1">
            <LevelInfo xpInLevel={overall.xpInLevel} xpNeeded={overall.xpNeeded} />
          </div>
        </div>
        {player.isMock && (
          <p className="mt-4 text-xs text-amber-300">Beispieldaten, noch nicht echt.</p>
        )}
      </header>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
          Attribute
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ATTRIBUTES.map((attribute) => (
            <AttributeCard
              key={attribute.key}
              name={attribute.name}
              source={attribute.source}
              xp={player.xp[attribute.key]}
            />
          ))}
        </div>
      </section>

      <footer className="mt-8 text-center text-xs text-slate-600">
        Inoffizielles Fan-Projekt, nicht mit EA verbunden.
      </footer>
    </main>
  );
}
