export const RANKS = [
  { id: 'D',  label: 'D',             minPoints: 0,   minMult: 0,    color: '#888888' },
  { id: 'C',  label: 'C',             minPoints: 50,  minMult: 1.0,  color: '#30d158' },
  { id: 'B',  label: 'B',             minPoints: 100, minMult: 1.5,  color: '#0a84ff' },
  { id: 'A',  label: 'A',             minPoints: 175, minMult: 2.0,  color: '#ff9f0a' },
  { id: 'S',  label: 'S',             minPoints: 250, minMult: 2.5,  color: '#ff3b30' },
  { id: 'SS', label: 'SS',            minPoints: 350, minMult: 3.0,  color: '#ff375f' },
  { id: 'SSS',label: 'SSS',           minPoints: 450, minMult: 4.0,  color: '#ffd700' },
  { id: 'VL', label: 'VISUAL LEARNER',minPoints: 450, minMult: 4.5,  color: '#bf5af2' },
];

export function getRank(points, multiplier) {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (points >= rank.minPoints && multiplier >= rank.minMult) {
      current = rank;
    }
  }
  return current;
}

export function calcMultiplier(streakCount, timeTakenMs) {
  // Base multiplier from streak
  let mult = 1.0 + (streakCount * 0.15);
  // Speed bonus: under 3s = +0.5, under 5s = +0.25
  if (timeTakenMs < 3000) mult += 0.5;
  else if (timeTakenMs < 5000) mult += 0.25;
  return Math.min(parseFloat(mult.toFixed(2)), 9.99);
}

export function getBonuses(streakCount, timeTakenMs, wasWrong) {
  const bonuses = [];
  if (!wasWrong && timeTakenMs < 2000) bonuses.push('AIRSHOT');
  if (streakCount === 3) bonuses.push('TRIPLE STREAK');
  if (streakCount === 5) bonuses.push('QUINTUPLE STREAK');
  if (streakCount >= 2 && timeTakenMs < 3000) bonuses.push('RICOSHOT');
  if (wasWrong) bonuses.push('INTERRUPTION');
  return bonuses;
}
