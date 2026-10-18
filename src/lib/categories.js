// Die sechs Oberkategorien mit ihren Unterattributen.
// weight = wie stark ein Unterattribut in den Durchschnitt seiner Oberkategorie zählt (1 bis 3).

export const CATEGORIES = [
  {
    key: 'sho',
    abbr: 'SHO',
    name: 'Abschluss',
    subs: [
      { key: 'abschluss', name: 'Abschluss', weight: 3 },
      { key: 'schusskraft', name: 'Schusskraft', weight: 2 },
      { key: 'stellungsspiel', name: 'Stellungsspiel', weight: 2 },
      { key: 'weitschuesse', name: 'Weitschüsse', weight: 1 },
      { key: 'volley', name: 'Volley', weight: 1 },
      { key: 'elfmeter', name: 'Elfmeter', weight: 1 },
    ],
  },
  {
    key: 'pas',
    abbr: 'PAS',
    name: 'Passspiel',
    subs: [
      { key: 'kurzer_pass', name: 'Kurzer Pass', weight: 3 },
      { key: 'langer_pass', name: 'Langer Pass', weight: 2 },
      { key: 'uebersicht', name: 'Übersicht', weight: 2 },
      { key: 'flanken', name: 'Flanken', weight: 1 },
      { key: 'fs_praezision', name: 'FS-Präzision', weight: 1 },
      { key: 'effet', name: 'Effet', weight: 1 },
    ],
  },
  {
    key: 'dri',
    abbr: 'DRI',
    name: 'Ballkontrolle',
    subs: [
      { key: 'ballkontrolle', name: 'Ballkontrolle', weight: 3 },
      { key: 'dribbling', name: 'Dribbling', weight: 3 },
      { key: 'beweglichkeit', name: 'Beweglichkeit', weight: 2 },
      { key: 'balance', name: 'Balance', weight: 2 },
      { key: 'ruhe', name: 'Ruhe', weight: 2 },
      { key: 'reaktion', name: 'Reaktion', weight: 2 },
    ],
  },
  {
    key: 'phy',
    abbr: 'PHY',
    name: 'Physis',
    subs: [
      { key: 'ausdauer', name: 'Ausdauer', weight: 2 },
      { key: 'staerke', name: 'Stärke', weight: 2 },
      { key: 'sprungkraft', name: 'Sprungkraft', weight: 1 },
      { key: 'aggressivitaet', name: 'Aggressivität', weight: 1 },
    ],
  },
  {
    key: 'def',
    abbr: 'DEF',
    name: 'Verteidigung',
    subs: [
      { key: 'abfangen', name: 'Abfangen', weight: 3 },
      { key: 'defensives_bewusstsein', name: 'Defensives Bewusstsein', weight: 3 },
      { key: 'faire_zweikaempfe', name: 'Faire Zweikämpfe', weight: 2 },
      { key: 'graetschen', name: 'Grätschen', weight: 2 },
      { key: 'kopfball_praezision', name: 'Kopfball-Präzision', weight: 1 },
    ],
  },
  {
    key: 'pac',
    abbr: 'PAC',
    name: 'Tempo',
    subs: [
      { key: 'beschleunigung', name: 'Beschleunigung', weight: 3 },
      { key: 'sprinttempo', name: 'Sprinttempo', weight: 3 },
    ],
  },
];

// Sonstige Attribute: werden nur angezeigt und zählen nicht in den Durchschnitt ihrer Oberkategorie.
export const SONSTIGE = [
  { key: 'spezialbewegung', name: 'Spezialbewegung', category: 'dri', weight: 2 },
  { key: 'schwacher_fuss', name: 'Schwacher Fuß', category: 'phy', weight: 1 },
  { key: 'controller_handling', name: 'Controller Handling', category: 'phy', weight: 2 },
  { key: 'merkfaehigkeit', name: 'Merkfähigkeit', category: 'phy', weight: 2 },
];
