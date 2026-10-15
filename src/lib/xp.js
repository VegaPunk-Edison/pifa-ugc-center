// Level-Kurve "mittel-schnell" wie bei Pokémon: Die Gesamt-XP bis Level n sind n³.
// Es gibt kein Maximum, Level können beliebig hoch steigen.

export const xpForLevel = (level) => level ** 3;

export const levelFromXp = (totalXp) => {
  const xp = Math.max(0, totalXp || 0);
  let level = Math.floor(Math.cbrt(xp));
  // Rundungsfehler von cbrt ausgleichen
  while (xpForLevel(level + 1) <= xp) level += 1;
  while (level > 0 && xpForLevel(level) > xp) level -= 1;
  const start = xpForLevel(level);
  return {
    level,
    xpInLevel: xp - start,
    xpNeeded: xpForLevel(level + 1) - start,
  };
};
