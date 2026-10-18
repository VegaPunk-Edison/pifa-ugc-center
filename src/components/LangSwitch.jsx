import { LANGUAGES, getLang, setLang, t } from '../lib/i18n.js';

export default function LangSwitch({ onChange = setLang }) {
  return (
    <select
      aria-label={t('lang.label')}
      value={getLang()}
      onChange={(event) => onChange(event.target.value)}
      className="rounded bg-slate-900 px-2 py-1 text-xs text-slate-300"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
