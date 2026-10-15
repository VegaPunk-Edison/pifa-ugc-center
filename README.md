# eSports Athlete Center

Eigenständige Web-App für ProClubs-Spieler: Profil, Aufgaben und Ziele, Content-Einreichung und Gamification. Später soll sie mit einer App aus dem PIFA-Universum verbunden werden.

## Entwicklung

```bash
npm install
npm run dev     # lokal starten
npm run build   # Produktions-Build prüfen
```

Gebaut mit React, Vite und Tailwind CSS.

## Festgelegte Regeln

- **Attribute:** sechs Oberkategorien (SHO, PAS, DRI, PHY, DEF, PAC) mit den ProClubs-Unterattributen. Präzision und Reichweite entfallen.
- **Sonstige:** Spezialbewegung zählt bei DRI, Schwacher Fuß, Controller Handling und Merkfähigkeit bei PHY. Sie werden separat angezeigt.
- **Oberkategorie-Level:** gewichteter Durchschnitt der Unterattribut-Level, mit den Gewichten aus `src/lib/categories.js`.
- **Gesamt-Level des Pros:** einfacher Durchschnitt der sechs Oberkategorien.
- **Level-Kurve:** Die Gesamt-XP bis Level n sind n³ (Pokémon „mittel-schnell“). Kein Maximum.
- **Anzeige:** Durchschnittswerte werden abgerundet angezeigt.

## Noch offen

- Login mit E-Mail und Passwort. Braucht ein Supabase-Projekt, daher kommt es in einem späteren Schritt.
- Aufgaben, Ziele, Einreichungen, Bestenliste, Benachrichtigungen, Sprache (Deutsch und Englisch).
- Geld, Marken, Abo und Spielstats aus Matches: spätere Versionen.

## Offene rechtliche Punkte

Vor echten Zahlungen klären (Steuerberater und ggf. Anwalt): Gewerbe und Rechtsform, Steuerpflichten als Plattform, AGB, Datenschutzerklärung, Nutzungsrechte für eingereichten Content.
