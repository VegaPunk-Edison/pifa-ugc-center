# UGC Creator Center

Eigenständige Web-App für ProClubs-Spieler: Profil, Aufgaben, Content-Einreichung und Gamification (XP, Level, Attribute). Später soll sie mit einer App aus dem PIFA-Universum verbunden werden.

Arbeitsname, noch nicht final.

## Entwicklung

```bash
npm install
npm run dev     # lokal starten
npm run build   # Produktions-Build prüfen
```

Gebaut mit React, Vite und Tailwind CSS.

## Vorschläge (noch nicht final bestätigt)

- **Eigenständig:** eigene Datenbank und eigener Login. Die Verbindung zu PIFA kommt später über eine klar definierte Schnittstelle.
- **Web-App zuerst:** mobil optimiert, auf dem Handy installierbar.
- **Auszahlungen:** nur ab 18 Jahren, über einen Zahlungsdienstleister wie Stripe Connect.
- **Pro-Stats:** zunächst per Screenshot eingereicht und von einem Admin bestätigt. Keine inoffiziellen Datenquellen.
- **Level:** dieselbe Formel wie in YOU/PIFA, Maximum Level 10.
- **Pro-Level:** Summe aller Attribut-XP.

## Roadmap

Jeder Schritt wird einzeln geprüft, bevor der nächste beginnt.

1. **Profilseite mit Beispieldaten** (aktuell): Level, XP-Balken und sieben Attribute, ohne Login oder Datenbank.
2. Aufgabenboard mit Deadlines und Status.
3. Content einreichen (Link oder Upload) und XP dafür vergeben.
4. Admin-Ansicht zum Freigeben von Einreichungen.
5. Login und Datenbank (Supabase).
6. Pro-Stats per Screenshot einreichen und bestätigen.
7. Bestenliste.
8. Schnittstelle zum PIFA-Universum.
9. Zahlungen und Auszahlungen (Stripe, zuerst Testmodus).
10. Marken-Kampagnen und Abo.

## Offene rechtliche Punkte

Vor echten Zahlungen klären (Steuerberater und ggf. Anwalt): Gewerbe und Rechtsform, Steuerpflichten als Plattform, AGB, Datenschutzerklärung, Nutzungsrechte für eingereichten Content.
