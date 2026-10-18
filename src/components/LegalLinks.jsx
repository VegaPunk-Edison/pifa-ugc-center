import { t, useLang } from '../lib/i18n.js';

// Fußzeile mit den Rechtsseiten, auf jeder Seite der App.
export default function LegalLinks() {
  useLang();
  return (
    <footer className="px-4 pb-6 text-center text-xs text-slate-500">
      <a href="/impressum" className="underline">
        {t('legal.imprint')}
      </a>
      {' · '}
      <a href="/datenschutz" className="underline">
        {t('legal.privacy')}
      </a>
      {' · '}
      <a href="/nutzungsbedingungen" className="underline">
        {t('legal.terms')}
      </a>
    </footer>
  );
}
