import { useEffect, useState } from 'react';
import AuthView from './components/AuthView.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import LangSwitch from './components/LangSwitch.jsx';
import PendingReview from './components/PendingReview.jsx';
import ProfileView from './components/ProfileView.jsx';
import TaskAdmin from './components/TaskAdmin.jsx';
import TaskBoard from './components/TaskBoard.jsx';
import { setLang, t, useLang } from './lib/i18n.js';
import { loadAchievementFacts, loadOrCreateProfile, updateLanguage, updateProfile } from './lib/profiles.js';
import { listXpEvents, sumXpByKey } from './lib/submissions.js';
import { buildProfile } from './lib/profile.js';
import { isSupabaseConfigured, supabase } from './lib/supabase.js';

function SessionBar({ email, onLanguageChange }) {
  const signOut = () => supabase.auth.signOut();
  return (
    <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 pt-4 text-xs text-slate-500">
      <span>{email}</span>
      <div className="flex items-center gap-3">
        <LangSwitch onChange={onLanguageChange} />
        <button type="button" onClick={signOut} className="underline">
          {t('session.logout')}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  useLang();
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(isSupabaseConfigured);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [xp, setXp] = useState(null);
  const [facts, setFacts] = useState(null);

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      setXp(null);
      return;
    }
    loadOrCreateProfile(session.user)
      .then((loaded) => {
        // Die im Profil gespeicherte Sprache hat Vorrang vor dem Browser.
        setLang(loaded.language);
        setProfile(loaded);
      })
      .catch((err) => setProfileError(err.message));
  }, [session]);

  const level = xp ? Math.floor(buildProfile(xp).overall) : 0;
  const profileId = profile?.id;
  const isPlayer = profile?.role === 'player';

  useEffect(() => {
    if (!profileId || !isPlayer) return;
    Promise.all([listXpEvents(profileId), loadAchievementFacts(profileId)])
      .then(([events, loadedFacts]) => {
        setXp(sumXpByKey(events));
        setFacts(loadedFacts);
      })
      .catch((err) => setProfileError(err.message));
  }, [profileId, isPlayer]);

  const changeLanguage = (lang) => {
    setLang(lang);
    if (!profile) return;
    updateLanguage(profile.id, lang)
      .then(() => setProfile({ ...profile, language: lang }))
      .catch(() => {
        // Die Sprache bleibt im Browser gespeichert, auch wenn das Speichern im Profil nicht klappt.
      });
  };

  const saveProfile = (updates) =>
    updateProfile(profile.id, updates).then((saved) => {
      if (updates.language) setLang(updates.language);
      setProfile({ ...profile, ...saved });
    });

  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto max-w-sm px-4 py-10 text-center text-sm text-slate-400">{t('setup.missing')}</main>
    );
  }

  if (checking) {
    return <p className="p-6 text-center text-sm text-slate-500">{t('loading')}</p>;
  }

  if (!session) {
    return <AuthView />;
  }

  if (profileError) {
    return (
      <>
        <SessionBar email={session.user.email} onLanguageChange={changeLanguage} />
        <p className="p-6 text-center text-sm text-red-400">{t('profile.loadError', { message: profileError })}</p>
      </>
    );
  }

  if (!profile) {
    return <p className="p-6 text-center text-sm text-slate-500">{t('loading')}</p>;
  }

  if (profile.role === 'operator') {
    return (
      <>
        <SessionBar email={session.user.email} onLanguageChange={changeLanguage} />
        <Leaderboard />
        <PendingReview />
        <TaskAdmin />
      </>
    );
  }

  if (!xp) {
    return (
      <>
        <SessionBar email={session.user.email} onLanguageChange={changeLanguage} />
        <p className="p-6 text-center text-sm text-slate-500">{t('loading')}</p>
      </>
    );
  }

  return (
    <>
      <SessionBar email={session.user.email} onLanguageChange={changeLanguage} />
      <ProfileView
        player={{
          name: profile.display_name,
          xp,
          facts,
          createdAt: profile.created_at,
          language: profile.language,
          channels: { tiktok: profile.tiktok_url, instagram: profile.instagram_url, youtube: profile.youtube_url },
        }}
        onSave={saveProfile}
      />
      <div className="mx-auto max-w-3xl px-4 pb-10">
        <TaskBoard profile={profile} level={level} />
      </div>
    </>
  );
}
