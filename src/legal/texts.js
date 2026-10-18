// Rechtstexte der App. Stand und Inhalt mit den Entwürfen abgleichen, bevor sie veröffentlicht werden.
// Eckige Klammern sind Platzhalter, die vor der Veröffentlichung ausgefüllt werden müssen.
// Text: ein String ist ein Absatz, ein Array ist eine Liste.

export const LEGAL_PAGES = {
  impressum: {
    title: 'Impressum',
    updated: '18.10.2026',
    sections: [
      {
        heading: 'Angaben gemäß § 5 DDG',
        body: [
          'David Costa\neQuality\nGasstraße 4\n32791 Lage\nDeutschland',
          'E-Mail: elevateesport.1@gmail.com',
        ],
      },
      {
        heading: 'Verbraucherstreitbeilegung',
        body: [
          'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
        ],
      },
      {
        heading: 'Haftung für Inhalte',
        body: [
          'Die Inhalte dieser App haben wir mit Sorgfalt erstellt. Für Inhalte, die Nutzer einreichen, gelten die Regeln in den Nutzungsbedingungen.',
        ],
      },
    ],
  },

  datenschutz: {
    title: 'Datenschutzerklärung',
    updated: '18.10.2026',
    sections: [
      {
        heading: '1. Verantwortlicher',
        body: [
          'David Costa (eQuality), Gasstraße 4, 32791 Lage, Deutschland, E-Mail: elevateesport.1@gmail.com',
          'Diese Erklärung gilt für die App „eSports Athlete Center“ unter pifa-esports.store. Wir sind der Verantwortliche für deine Daten.',
        ],
      },
      {
        heading: '2. Welche Daten wir verarbeiten',
        body: [
          [
            'Konto: E-Mail-Adresse und Passwort. Das Passwort speichern wir nur als nicht umkehrbaren Hashwert.',
            'Profil: Anzeigename, gewählte Sprache und Rolle (Spieler oder Betreiber). Beim ersten Anmelden übernehmen wir den Teil der E-Mail-Adresse vor dem @ als Anzeigenamen. Du kannst den Anzeigenamen in deinem Profil ändern.',
            'Kanal-Links: Links zu deinem TikTok-Profil sowie optional zu deinem Instagram- und YouTube-Profil, die du selbst eingibst.',
            'Einreichungen: Links zu deinen Videos, zugehörige Aufgabe, Datum und Status (eingereicht, freigegeben, abgelehnt).',
            'Spielfortschritt: XP, Level, Aufgaben, Ziele und Benachrichtigungen.',
            'Technisch: Deine Anmeldesitzung speichert dein Browser lokal, damit du angemeldet bleibst. Wir setzen keine Tracking-Cookies. Der Hosting-Anbieter speichert Server-Protokolle mit IP-Adresse, Zeitpunkt und aufgerufener Seite.',
          ],
        ],
      },
      {
        heading: '3. Pflicht zur Angabe',
        body: [
          'Für das Konto brauchst du E-Mail-Adresse und Passwort. Ohne sie kannst du die App nicht nutzen. Für Einreichungen brauchst du den Kanal-Link der jeweiligen Plattform. Weitere Angaben, insbesondere Instagram- und YouTube-Links, sind freiwillig.',
        ],
      },
      {
        heading: '4. Zwecke und Rechtsgrundlagen',
        body: [
          [
            'Bereitstellung der App, Verwaltung deines Profils, deiner Aufgaben und Ziele sowie Freischaltung nach Level: Art. 6 Abs. 1 lit. b DSGVO.',
            'Speicherung deiner Kanal-Links und Zuordnung deiner Einreichungen zu deinem Kanal: Art. 6 Abs. 1 lit. b DSGVO.',
            'Prüfung deiner Einreichungen und Vergabe von XP: Art. 6 Abs. 1 lit. b DSGVO.',
            'Sicherheit und Stabilität des Betriebs, insbesondere Abwehr von Angriffen und Fehlerdiagnose: Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse ist ein sicherer, störungsfreier Betrieb.',
          ],
          'Wir verwenden deine Daten nicht für Werbung.',
        ],
      },
      {
        heading: '5. Wer die Daten erhält',
        body: [
          [
            'Wir und Prüfer: Wir sehen Profile, Einreichungen und die Bestenliste. Personen, die wir zur Prüfung von Einreichungen einsetzen, sehen dasselbe und handeln in unserem Auftrag.',
            'Andere Spieler: Sehen derzeit keine Daten von dir.',
            'Supabase (Datenbank und Anmeldung): Der Serverstandort ist die EU (Irland). Supabase ist ein US-Unternehmen, Zugriffe aus den USA, etwa durch den Support, sind möglich.',
            'Netlify (Hosting): Netlify ist ein US-Unternehmen.',
          ],
          'Mit beiden besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Für die Übermittlung in die USA stützen wir uns auf Standardvertragsklauseln nach Art. 46 Abs. 2 lit. c DSGVO, die Bestandteil unserer Verträge sind. Eine Kopie dieser Garantien erhältst du auf Anfrage unter elevateesport.1@gmail.com.',
        ],
      },
      {
        heading: '6. Speicherdauer',
        body: [
          'Wir speichern deine Daten, solange dein Konto besteht. Nach der Löschung deines Kontos löschen wir Konto und zugehörige Daten, soweit keine gesetzliche Pflicht zur Aufbewahrung besteht.',
          'Server-Protokolle speichert der Hosting-Anbieter nur, solange es für Betrieb und Sicherheit erforderlich ist.',
        ],
      },
      {
        heading: '7. Deine Rechte',
        body: [
          'Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Richte deine Anfrage an elevateesport.1@gmail.com. Du kannst dich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO).',
          'Widerspruchsrecht: Du kannst der Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO aus Gründen, die sich aus deiner besonderen Situation ergeben, widersprechen. Danach verarbeiten wir deine Daten nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe nachweisen. Den Widerspruch richtest du an elevateesport.1@gmail.com.',
        ],
      },
      {
        heading: '8. Konto löschen',
        body: [
          'Du kannst die Löschung deines Kontos jederzeit per E-Mail an elevateesport.1@gmail.com verlangen. Bei Zweifeln an deiner Identität fordern wir zusätzliche Angaben an. Danach löschen wir Konto und zugehörige Daten unverzüglich. Die Löschung bestätigen wir dir spätestens einen Monat nach deiner Anfrage.',
        ],
      },
      {
        heading: '9. Mindestalter',
        body: [
          'Die App richtet sich an Personen ab 16 Jahren. Mit der Registrierung bestätigst du, dass du mindestens 16 Jahre alt bist. Erfahren wir, dass ein Konto von einer jüngeren Person genutzt wird, sperren und löschen wir es.',
        ],
      },
      {
        heading: '10. Änderungen',
        body: [
          'Wir passen diese Erklärung an, wenn sich die App ändert. Über wesentliche Änderungen informieren wir dich in der App.',
        ],
      },
    ],
  },

  nutzungsbedingungen: {
    title: 'Nutzungsbedingungen',
    updated: '18.10.2026',
    sections: [
      {
        heading: '1. Anbieter und Geltung',
        body: [
          'Diese Bedingungen gelten für die Nutzung der App „eSports Athlete Center“ unter pifa-esports.store. Anbieter ist David Costa (eQuality), Gasstraße 4, 32791 Lage, Deutschland, E-Mail: elevateesport.1@gmail.com (im Folgenden „wir“).',
        ],
      },
      {
        heading: '2. Konto',
        body: [
          [
            'Du brauchst ein Konto mit E-Mail-Adresse und Passwort.',
            'Deine Angaben müssen stimmen. Dein Passwort hältst du geheim.',
            'Du musst mindestens 16 Jahre alt sein. Mit der Registrierung bestätigst du das.',
          ],
        ],
      },
      {
        heading: '3. Leistungen',
        body: [
          'Die App zeigt dir ein Profil mit Attributen und Level sowie Aufgaben und Ziele. Du sammelst XP durch Aufgaben und Ziele, die wir freigeben. Ob eine Einreichung zählt, entscheiden wir nach Prüfung.',
        ],
      },
      {
        heading: '4. XP, Level und Belohnungen',
        body: [
          [
            'XP und Level sind virtuelle Punkte innerhalb der App. Sie haben keinen Geldwert.',
            'Es besteht kein Anspruch auf Auszahlungen, Prämien oder sonstige Gegenleistungen. Ob und wann es solche Angebote gibt, legen wir fest und kündigen sie gesondert an.',
            'Beruht eine Gutschrift auf einem Fehler oder einem Verstoß gegen diese Bedingungen, dürfen wir sie korrigieren oder entziehen.',
          ],
        ],
      },
      {
        heading: '5. Einreichungen',
        body: [
          [
            'Du darfst nur Videos einreichen, die dir gehören oder die du einreichen darfst.',
            'Die Einreichung muss zu deinem angegebenen Kanal passen.',
            'Wir prüfen jede Einreichung und können sie freigeben oder ablehnen.',
            'Du räumst uns das einfache, nicht übertragbare Recht ein, die eingereichten Links und die dazugehörigen Angaben (Kanal, Aufgabe, Datum, Status) in der App zu speichern, zu prüfen und dir sowie den Prüfern anzuzeigen. Das Recht gilt für die Dauer deines Kontos. Die Rechte an den Videos selbst bleiben bei dir.',
          ],
        ],
      },
      {
        heading: '6. Regeln',
        body: [
          'Verboten sind insbesondere:',
          [
            'fremde Kanäle oder Videos als eigene einreichen,',
            'falsche Angaben machen,',
            'die Freischaltung umgehen,',
            'automatisierte Zugriffe auf die App,',
            'Angriffe auf die App oder andere Nutzer.',
          ],
          'Bei Verstößen können wir Einreichungen ablehnen, XP entziehen oder das Konto sperren.',
        ],
      },
      {
        heading: '7. Drittanbieter',
        body: [
          'Du kannst optional Kanäle bei TikTok, Instagram und YouTube angeben. Die App wird nicht von TikTok, Instagram, YouTube oder EA betrieben oder unterstützt und steht mit ihnen nicht in Verbindung. Für deren Dienste gelten deren eigene Bedingungen.',
        ],
      },
      {
        heading: '8. Verfügbarkeit und Haftung',
        body: [
          'Wir stellen die App bereit. Deine gesetzlichen Rechte bei Mängeln bleiben unberührt.',
          'Wir haften unbeschränkt für Schäden aus der Verletzung von Leben, Körper oder Gesundheit sowie für Vorsatz und grobe Fahrlässigkeit. Bei leichter Fahrlässigkeit haften wir nur bei der Verletzung wesentlicher Pflichten und nur für den vorhersehbaren Schaden.',
          'Für Inhalte, die du einreichst, bist du verantwortlich. Wir prüfen Einreichungen vor der Freigabe.',
        ],
      },
      {
        heading: '9. Kündigung',
        body: [
          'Du kannst dein Konto jederzeit löschen lassen, wie in der Datenschutzerklärung beschrieben. Wir können Konten bei Verstößen sperren oder kündigen.',
        ],
      },
      {
        heading: '10. Änderungen',
        body: [
          'Wir können diese Bedingungen ändern, wenn ein sachlicher Grund besteht, etwa neue Funktionen oder gesetzliche Vorgaben, und die Änderung für dich zumutbar ist. Wir informieren dich vier Wochen vorher in der App. Widersprichst du innerhalb dieser Frist nicht, gelten die Änderungen ab deren Ablauf. Auf dein Widerspruchsrecht und die Folgen des Schweigens weisen wir in der Mitteilung ausdrücklich hin. Widersprichst du, kannst du dein Konto löschen lassen.',
        ],
      },
      {
        heading: '11. Anwendbares Recht',
        body: [
          'Es gilt deutsches Recht. Zwingende Verbraucherschutzregeln deines Wohnsitzlandes bleiben unberührt.',
        ],
      },
      {
        heading: '12. Verbraucherstreitbeilegung',
        body: [
          'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
        ],
      },
      {
        heading: '13. Kontakt',
        body: ['elevateesport.1@gmail.com'],
      },
    ],
  },
};
