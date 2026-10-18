import { CATEGORIES, SONSTIGE } from './categories.js';
import { levelFromXp } from './xp.js';

// Berechnet das Level jedes Unterattributs, den gewichteten Durchschnitt je Oberkategorie
// und den einfachen Durchschnitt aller Oberkategorien (Gesamt-Level des Pros).
// Sonstige Attribute werden nur angezeigt und zählen nicht in den Durchschnitt.
export function buildProfile(xpByKey) {
  const categories = CATEGORIES.map((category) => {
    const main = category.subs.map((sub) => ({ ...sub, ...levelFromXp(xpByKey[sub.key] ?? 0) }));
    const sonstige = SONSTIGE.filter((s) => s.category === category.key).map((s) => ({
      ...s,
      sonstige: true,
      ...levelFromXp(xpByKey[s.key] ?? 0),
    }));
    const weightSum = main.reduce((sum, m) => sum + m.weight, 0);
    const average = main.reduce((sum, m) => sum + m.weight * m.level, 0) / weightSum;
    return { ...category, members: [...main, ...sonstige], average };
  });
  const overall = categories.reduce((sum, c) => sum + c.average, 0) / categories.length;
  return { categories, overall };
}
