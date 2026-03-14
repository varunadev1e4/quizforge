import math from './math';
import physics from './physics';
import chemistry from './chemistry';
import { QUESTIONS_PER_QUIZ, SUBJECTS } from '../constants';

export const QUESTION_BANK = { math, physics, chemistry };

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function levelWeight(level) {
  const weights = { easy: 1, medium: 2, hard: 3.5, master: 6, expert: 10 };
  return weights[level] ?? 1;
}

/** Return a shuffled subset of QUESTIONS_PER_QUIZ questions for a given subject + level */
export function getQuizQuestions(subject, level, customQuestions = []) {
  if (subject === 'grand' && level && typeof level === 'object') {
    return getGrandQuizQuestions(level, customQuestions);
  }

  const base = [...(QUESTION_BANK[subject]?.[level] ?? [])];
  const custom = customQuestions.filter(q => q.subject === subject && q.level === level);
  const pool = [...base, ...custom];
  return shuffle(pool).slice(0, QUESTIONS_PER_QUIZ);
}

function getGrandQuizQuestions(levelBySubject, customQuestions = []) {
  const perSubject = Math.floor(QUESTIONS_PER_QUIZ / SUBJECTS.length);
  const remainder = QUESTIONS_PER_QUIZ % SUBJECTS.length;

  const selected = SUBJECTS.flatMap((subject, idx) => {
    const level = levelBySubject[subject] ?? 'medium';
    const take = perSubject + (idx < remainder ? 1 : 0);
    const base = [...(QUESTION_BANK[subject]?.[level] ?? [])].map(q => ({ ...q, subject, level }));
    const custom = customQuestions
      .filter(q => q.subject === subject && q.level === level)
      .map(q => ({ ...q, subject, level }));

    return shuffle([...base, ...custom]).slice(0, take);
  });

  return shuffle(selected).slice(0, QUESTIONS_PER_QUIZ);
}

export function getGrandLevelLabel(levelBySubject) {
  if (!levelBySubject || typeof levelBySubject !== 'object') return 'mixed';
  const values = SUBJECTS.map(subject => levelBySubject[subject]).filter(Boolean);
  if (values.length === 0) return 'mixed';
  const unique = [...new Set(values)];
  if (unique.length === 1) return unique[0];

  const avgWeight = values.reduce((sum, lv) => sum + levelWeight(lv), 0) / values.length;
  const nearest = ['easy', 'medium', 'hard', 'master', 'expert']
    .map(lv => ({ lv, dist: Math.abs(levelWeight(lv) - avgWeight) }))
    .sort((a, b) => a.dist - b.dist)[0]?.lv;

  return nearest ?? 'medium';
}
