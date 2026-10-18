import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { t } from '../lib/i18n.js';
import LangSwitch from './LangSwitch.jsx';

const TITLES = { login: 'auth.login.title', register: 'auth.register.title', reset: 'auth.reset.title' };
const SUBMITS = { login: 'auth.login.submit', register: 'auth.register.submit', reset: 'auth.reset.submit' };

// Übersetzt die häufigsten Fehlermeldungen von Supabase.
function describeError(error) {
  if (error.message === 'Invalid login credentials') return t('auth.errInvalid');
  if (error.message === 'User already registered') return t('auth.errExists');
  return t('auth.errGeneric', { message: error.message });
}

export default function AuthView() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setInfo('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setInfo('');

    if (mode === 'login') {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) setError(describeError(loginError));
    }

    if (mode === 'register') {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) setError(describeError(signUpError));
      else if (!data.session) setInfo(t('auth.infoConfirm'));
    }

    if (mode === 'reset') {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (resetError) setError(describeError(resetError));
      else setInfo(t('auth.infoReset'));
    }

    setBusy(false);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-6">
      <div className="mb-3 flex justify-end">
        <LangSwitch />
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-xs uppercase tracking-widest text-slate-500">eSports Athlete Center</p>
        <h1 className="mt-1 text-2xl font-bold">{t(TITLES[mode])}</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="text-slate-400">{t('auth.email')}</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
            />
          </label>

          {mode !== 'reset' && (
            <label className="block text-sm">
              <span className="text-slate-400">{t('auth.password')}</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
              />
            </label>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
          {info && <p className="text-sm text-emerald-300">{info}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50"
          >
            {busy ? t('auth.busy') : t(SUBMITS[mode])}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm">
          {mode !== 'login' && (
            <button type="button" onClick={() => switchMode('login')} className="block w-full text-slate-400 underline">
              {t('auth.toLogin')}
            </button>
          )}
          {mode !== 'register' && (
            <button type="button" onClick={() => switchMode('register')} className="block w-full text-slate-400 underline">
              {t('auth.toRegister')}
            </button>
          )}
          {mode !== 'reset' && (
            <button type="button" onClick={() => switchMode('reset')} className="block w-full text-slate-400 underline">
              {t('auth.toReset')}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
