import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import LegalLinks from './components/LegalLinks.jsx';
import LegalPage from './components/LegalPage.jsx';
import { LEGAL_PAGES } from './legal/texts.js';

// Rechtsseiten sind ohne Anmeldung erreichbar. Alle anderen Adressen zeigen die App.
const legalSlug = window.location.pathname.replace(/^\/|\/$/g, '');
const isLegalPage = Object.hasOwn(LEGAL_PAGES, legalSlug);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isLegalPage ? <LegalPage slug={legalSlug} /> : <App />}
    <LegalLinks />
  </StrictMode>,
);
