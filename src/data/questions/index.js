import math from './math';
import physics from './physics';
import chemistry from './chemistry';
import { QUESTIONS_PER_QUIZ } from '../constants';

export const QUESTION_BANK = { math, physics, chemistry };

/** Return a shuffled subset of QUESTIONS_PER_QUIZ questions for a given subject + level */
export function getQuizQuestions(subject, level, customQuestions = []) {
  const base = [...(QUESTION_BANK[subject]?.[level] ?? [])];
  const custom = customQuestions.filter(q => q.subject === subject && q.level === level);
  const pool = [...base, ...custom];
  return pool
    .sort(() => Math.random() - 0.5)
    .slice(0, QUESTIONS_PER_QUIZ);
}
