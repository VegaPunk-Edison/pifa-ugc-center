import { t, useLang } from '../lib/i18n.js';
import { LEGAL_PAGES } from '../legal/texts.js';

// Zeigt eine Rechtsseite. Die Texte sind bisher nur auf Deutsch.
export default function LegalPage({ slug }) {
  useLang();
  const page = LEGAL_PAGES[slug];

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <a href="/" className="text-sm text-slate-400 underline">
        {t('legal.back')}
      </a>
      <h1 className="mt-4 text-2xl font-bold">{page.title}</h1>
      <p className="mt-1 text-xs text-slate-500">{t('legal.updated', { date: page.updated })}</p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-slate-300">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-semibold text-slate-100">{section.heading}</h2>
            {section.body.map((block, index) =>
              Array.isArray(block) ? (
                <ul key={index} className="mt-2 list-disc space-y-1 pl-5">
                  {block.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p key={index} className="mt-2 whitespace-pre-line">
                  {block}
                </p>
              ),
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
