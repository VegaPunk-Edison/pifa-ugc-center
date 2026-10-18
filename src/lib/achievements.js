// Erfolge werden aus dem Spielstand berechnet und nicht separat gespeichert.
// Die ersten Erfolge sind schnell erreicht, spätere brauchen länger.
const ACHIEVEMENTS = [
  { key: 'account', isDone: () => true },
  { key: 'firstTask', isDone: (facts) => facts.approvedCount > 0 },
  { key: 'firstGoal', isDone: (facts) => facts.goalCount > 0 },
];

export function achievementsFor(facts) {
  return ACHIEVEMENTS.map(({ key, isDone }) => ({ key, done: isDone(facts) }));
}
