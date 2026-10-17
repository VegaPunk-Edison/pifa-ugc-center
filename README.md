# eSports Athlete Center

Eigenständige Web-App für ProClubs-Spieler: Profil, Aufgaben und Ziele, Content-Einreichung und Gamification. Später soll sie mit einer App aus dem PIFA-Universum verbunden werden.

## Entwicklung

```bash
npm install
npm run dev     # lokal starten
npm run build   # Produktions-Build prüfen
```

Gebaut mit React, Vite, Tailwind CSS und Supabase.

## Supabase einrichten

1. Projekt-URL und Publishable Key als Umgebungsvariablen setzen: `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY`. Lokal stehen sie in `.env.local`, das nicht ins Repo kommt.
2. `supabase/schema.sql` einmal im SQL Editor ausführen. Die Tabelle heißt `creator_profiles`.
3. Nach dem ersten Anmelden das eigene Konto mit `supabase/make-operator.sql` zum Betreiber machen.

## Festgelegte Regeln

- **Attribute:** sechs Oberkategorien (SHO, PAS, DRI, PHY, DEF, PAC) mit den ProClubs-Unterattributen. Präzision und Reichweite entfallen.
- **Sonstige:** Spezialbewegung zählt bei DRI, Schwacher Fuß, Controller Handling und Merkfähigkeit bei PHY. Sie werden separat angezeigt.
- **Oberkategorie-Level:** gewichteter Durchschnitt der Unterattribut-Level, mit den Gewichten aus `src/lib/categories.js`.
- **Gesamt-Level des Pros:** einfacher Durchschnitt der sechs Oberkategorien.
- **Level-Kurve:** Die Gesamt-XP bis Level n sind n³ (Pokémon „mittel-schnell“). Kein Maximum.
- **Anzeige:** Durchschnittswerte werden abgerundet angezeigt.
- **Rollen:** Spieler sehen nur ihr eigenes Profil. Betreiber sehen alle Profile.

## Noch offen

- XP und Attribute werden noch nicht in der Datenbank gespeichert. Die Profilseite zeigt weiter Beispieldaten.
- Aufgaben, Ziele, Einreichungen, Bestenliste, Benachrichtigungen, Sprache (Deutsch und Englisch).
- Geld, Marken, Abo und Spielstats aus Matches: spätere Versionen.
- Vor dem echten Start: E-Mail-Bestätigung wieder einschalten.

## Offene rechtliche Punkte

Vor echten Zahlungen klären (Steuerberater und ggf. Anwalt): Gewerbe und Rechtsform, Steuerpflichten als Plattform, AGB, Datenschutzerklärung, Nutzungsrechte für eingereichten Content.
