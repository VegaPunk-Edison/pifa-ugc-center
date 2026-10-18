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
2. Die SQL-Dateien in `supabase/` einmal im SQL Editor ausführen, in dieser Reihenfolge:
   `schema.sql`, `tasks-schema.sql`, `submissions-schema.sql`, `step4-schema.sql`, `language-schema.sql`, `platforms-schema.sql`.
3. Nach dem ersten Anmelden das eigene Konto mit `supabase/make-operator.sql` zum Betreiber machen.

## Festgelegte Regeln

- **Attribute:** sechs Oberkategorien (SHO, PAS, DRI, PHY, DEF, PAC) mit den ProClubs-Unterattributen. Präzision und Reichweite entfallen.
- **Sonstige:** Spezialbewegung zählt bei DRI, Schwacher Fuß, Controller Handling und Merkfähigkeit bei PHY. Sie werden separat angezeigt.
- **Oberkategorie-Level:** gewichteter Durchschnitt der Unterattribut-Level, mit den Gewichten aus `src/lib/categories.js`.
- **Gesamt-Level des Pros:** einfacher Durchschnitt der sechs Oberkategorien.
- **Level-Kurve:** Die Gesamt-XP bis Level n sind n³ (Pokémon „mittel-schnell“). Kein Maximum.
- **Anzeige:** Durchschnittswerte werden abgerundet angezeigt.
- **Aufgaben und Ziele:** Aufgaben haben 1 bis 99 XP und gehören zu einer Kategorie. Ihre XP verteilen sich gleichmäßig auf die Unterattribute. Ein Ziel gilt als erreicht, wenn alle seine Aufgaben freigegeben sind. Der Bonus verteilt sich ebenfalls auf Unterattribute.
- **Verspätung:** Wer nach der Deadline einreicht oder ein Ziel zu spät erreicht, bekommt die halbe XP.
- **Plattformen:** TikTok von Anfang an. Instagram ab Gesamt-Level 5, YouTube ab Level 10. Bei TikTok prüft die App, dass der Link zum eigenen Kanal passt. Bei Instagram und YouTube prüft die App das Format, die Zugehörigkeit prüft der Betreiber bei der Freigabe.
- **Rollen:** Spieler sehen nur ihr eigenes Profil. Betreiber sehen die Bestenliste und alle Einreichungen.
- **Sprache:** Deutsch oder Englisch. Die Auswahl wird im Profil gespeichert.

## Noch offen

- Freischaltung nach Level wird im Browser geprüft. Wer die Schnittstelle direkt nutzt, könnte sie umgehen.
- Geld, Auszahlungen, Marken und Abo: spätere Versionen.
- Spielstats aus Matches: spätere Version.
- Vor dem echten Start: E-Mail-Bestätigung wieder einschalten.
- Veröffentlichung über die Domain.

## Offene rechtliche Punkte

Vor echten Zahlungen klären (Steuerberater und ggf. Anwalt): Gewerbe und Rechtsform, Steuerpflichten als Plattform, AGB, Datenschutzerklärung, Nutzungsrechte für eingereichten Content.
