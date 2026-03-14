import { LEVELS, SUBJECTS } from '../data/constants';

const FALLBACK = { subject: 'math', level: 'easy' };

function avg(values) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function getPracticeRecommendation(history = []) {
  if (!history.length) return FALLBACK;

  const recent = history.slice(0, 15);
  const buckets = {};

  recent.forEach(entry => {
    const key = `${entry.subject}::${entry.level}`;
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(entry);
  });

  let weakest = null;

  Object.entries(buckets).forEach(([key, attempts]) => {
    const score = avg(attempts.map(a => a.score || 0));
    const speed = avg(attempts.map(a => a.timeTaken || 0));
    const weight = Math.min(4, attempts.length);
    const weakness = (100 - score) + (speed / 6) + ((4 - weight) * 3);

    if (!weakest || weakness > weakest.weakness) {
      const [subject, level] = key.split('::');
      weakest = { subject, level, weakness };
    }
  });

  if (!weakest) return FALLBACK;

  // If user is consistently strong, nudge harder level in that subject.
  const subjectRecent = recent.filter(h => h.subject === weakest.subject);
  const subjectAvg = avg(subjectRecent.map(h => h.score || 0));
  if (subjectAvg >= 85) {
    const currentIdx = LEVELS.indexOf(weakest.level);
    const harder = LEVELS[Math.min(LEVELS.length - 1, currentIdx + 1)];
    return { subject: weakest.subject, level: harder };
  }

  if (!SUBJECTS.includes(weakest.subject) || !LEVELS.includes(weakest.level)) {
    return FALLBACK;
  }

  return { subject: weakest.subject, level: weakest.level };
}
