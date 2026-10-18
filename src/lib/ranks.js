// Ränge nach Gesamt-Level. Jede Stufe braucht einen größeren Abstand als die vorherige.
export const RANKS = [
  { key: 'noob', name: 'Noob', from: 0 },
  { key: 'amateur', name: 'Amateur', from: 10 },
  { key: 'halbprofi', name: 'Halbprofi', from: 25 },
  { key: 'profi', name: 'Profi', from: 45 },
  { key: 'weltklasse', name: 'Weltklasse', from: 80 },
  { key: 'legende', name: 'Legende', from: 130 },
  { key: 'budokai', name: 'Budokai Tenkaichi', from: 200 },
];

export function rankForLevel(level) {
  return [...RANKS].reverse().find((rank) => level >= rank.from);
}

// Kopfgeld in Mauzbits (Spielgeld): Gesamt-Level zum Quadrat mal 1.000.
export function kopfgeldForLevel(level) {
  return level * level * 1000;
}
