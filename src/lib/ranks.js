// Ränge nach Level. Jede Stufe braucht einen größeren Abstand als die vorherige.
// Die Farbe zeigt den Rang auf den Kategorie-Kacheln und in den Detailansichten.
export const RANKS = [
  { key: 'noob', name: 'Noob', from: 0, color: '#b87333' },
  { key: 'amateur', name: 'Amateur', from: 10, color: '#c0c7d0' },
  { key: 'halbprofi', name: 'Halbprofi', from: 25, color: '#facc15' },
  { key: 'profi', name: 'Profi', from: 45, color: '#a5f3fc' },
  { key: 'weltklasse', name: 'Weltklasse', from: 80, color: '#60a5fa' },
  { key: 'legende', name: 'Legende', from: 130, color: '#c084fc' },
  { key: 'budokai', name: 'Budokai Tenkaichi', from: 200, color: '#8c2a3e' },
];

export function rankForLevel(level) {
  return [...RANKS].reverse().find((rank) => level >= rank.from);
}

// Kopfgeld in Mauzbits (Spielgeld): Gesamt-Level zum Quadrat mal 1.000.
export function kopfgeldForLevel(level) {
  return level * level * 1000;
}
