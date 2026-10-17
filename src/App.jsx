import { useEffect, useState } from 'react';
import AuthView from './components/AuthView.jsx';
import OperatorView from './components/OperatorView.jsx';
import ProfileView from './components/ProfileView.jsx';
import { MOCK_PLAYER } from './data/mockPlayer.js';
import { loadOrCreateProfile } from './lib/profiles.js';
import { isSupabaseConfigured, supabase } from './lib/supabase.js';

function SessionBar({ email }) {
  const signOut = () => supabase.auth.signOut();
  return (
    <div className="mx-auto flex max-w-3xl items-center justify-between px-4 pt-4 text-xs text-slate-500">
      <span>{email}</span>
      <button type="button" onClick={signOut} className="underline">
        Abmelden
      </button>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(isSupabaseConfigured);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState('');

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
    if (!session) return;
    loadOrCreateProfile(session.user)
      .then(setProfile)
      .catch((err) => setProfileError(err.message));
  }, [session]);

  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto max-w-sm px-4 py-10 text-center text-sm text-slate-400">
        Supabase ist noch nicht eingerichtet. Bitte VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY setzen.
      </main>
    );
  }

  if (checking) {
    return <p className="p-6 text-center text-sm text-slate-500">Lädt…</p>;
  }

  if (!session) {
    return <AuthView />;
  }

  if (profileError) {
    return (
      <>
        <SessionBar email={session.user.email} />
        <p className="p-6 text-center text-sm text-red-400">Das Profil konnte nicht geladen werden: {profileError}</p>
      </>
    );
  }

  if (!profile) {
    return <p className="p-6 text-center text-sm text-slate-500">Lädt…</p>;
  }

  return (
    <>
      <SessionBar email={session.user.email} />
      {profile.role === 'operator' ? (
        <OperatorView />
      ) : (
        <ProfileView player={{ ...MOCK_PLAYER, name: profile.display_name }} />
      )}
    </>
  );
}
