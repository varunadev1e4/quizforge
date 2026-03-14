import { LEVEL_META, SUBJECTS } from '../data/constants';
import { checkNewBadges } from '../data/badges';

/**
 * Calculate XP earned from a quiz result.
 * Base XP = correct answers × level multiplier × 5
 */
export function calcXP(correct, total, level) {
  const pct = correct / total;
  const base = correct * 5 * LEVEL_META[level].xpMultiplier;
  // Bonus for high accuracy
  if (pct === 1)   return Math.round(base * 1.5);
  if (pct >= 0.9)  return Math.round(base * 1.25);
  if (pct >= 0.8)  return Math.round(base * 1.1);
  return Math.round(base);
}

/**
 * Given a user object and quiz result, return the updated user.
 */
export function applyQuizResult(user, { subject, level, levelBySubject, answers, questions }) {
  const correct = answers.filter((a, i) => a === questions[i].ans).length;
  const total    = questions.length;
  const score    = Math.round((correct / total) * 100);
  const xpEarned = calcXP(correct, total, level);

  const today      = new Date().toDateString();
  const yesterday  = new Date(Date.now() - 86_400_000).toDateString();
  const newStreak  = user.lastDate === yesterday
    ? user.streak + 1
    : user.lastDate === today
      ? user.streak
      : 1;

  const subjectCount = { ...(user.subjectCount || {}) };
  if (subject === 'grand') {
    SUBJECTS.forEach(sub => {
      subjectCount[sub] = (subjectCount[sub] || 0) + 1;
    });
  } else {
    subjectCount[subject] = (subjectCount[subject] || 0) + 1;
  }

  const completedLevels = subject === 'grand'
    ? Object.values(levelBySubject || {})
    : [level];
  const levelsCompleted = [...new Set([...(user.levelsCompleted || []), ...completedLevels])];

  const historyEntry = {
    id:         `${Date.now()}`,
    date:       new Date().toLocaleDateString(),
    timestamp:  Date.now(),
    subject,
    level,
    levelBySubject: subject === 'grand' ? levelBySubject : null,
    score,
    correct,
    total,
    xpEarned,
    timeTaken:  0, // filled by caller
  };

  const updatedUser = {
    ...user,
    xp:              user.xp + xpEarned,
    streak:          newStreak,
    lastDate:        today,
    totalQuizzes:    user.totalQuizzes + 1,
    history:         [historyEntry, ...(user.history || [])].slice(0, 100),
    subjectCount,
    levelsCompleted,
    hasPerfect:      user.hasPerfect || score === 100,
    bestScore:       Math.max(user.bestScore || 0, score),
  };

  const newBadgeIds = checkNewBadges(updatedUser);
  updatedUser.badges = [...(updatedUser.badges || []), ...newBadgeIds];

  return { updatedUser, historyEntry, xpEarned, score, correct, newBadgeIds };
}
