import math from './math';
import physics from './physics';
import chemistry from './chemistry';
import { QUESTIONS_PER_QUIZ, SUBJECTS } from '../constants';

export const QUESTION_BANK = { math, physics, chemistry };

const SUBTOPIC_MATCHERS = {
  math: {
    algebra: [/solve/i, /factor/i, /inverse/i, /sequence/i, /matrix/i, /determinant/i],
    trigonometry: [/sin/i, /cos/i, /tan/i, /angle/i, /period/i],
    geometry: [/area/i, /perimeter/i, /circle/i, /parabola/i, /distance/i],
    calculus: [/derivative/i, /integral/i, /∫/i, /lim\(/i, /taylor/i],
    statistics: [/probability/i, /P\(/i, /mean/i, /distribution/i],
  },
  physics: {
    mechanics: [/force/i, /velocity/i, /acceleration/i, /momentum/i, /newton/i, /work/i],
    electricity: [/electric/i, /voltage/i, /current/i, /magnetic/i, /circuit/i, /ohm/i],
    waves: [/wave/i, /light/i, /optics/i, /frequency/i, /wavelength/i, /sound/i],
    thermodynamics: [/heat/i, /entropy/i, /thermo/i, /temperature/i, /gas/i],
    modern: [/quantum/i, /relativity/i, /nuclear/i, /photon/i, /atom/i],
  },
  chemistry: {
    atomic: [/atom/i, /electron/i, /proton/i, /orbital/i, /periodic/i],
    bonding: [/bond/i, /ionic/i, /covalent/i, /molecule/i, /hybrid/i],
    reactions: [/reaction/i, /equilibrium/i, /oxidation/i, /acid/i, /base/i],
    organic: [/organic/i, /alkane/i, /benzene/i, /polymer/i, /functional group/i],
    physical: [/enthalpy/i, /entropy/i, /kinetic/i, /rate/i, /thermo/i],
  },
};

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function levelWeight(level) {
  const weights = { easy: 1, medium: 2, hard: 3.5, master: 6, expert: 10 };
  return weights[level] ?? 1;
}

/** Return a shuffled subset of QUESTIONS_PER_QUIZ questions for a given subject + level */
export function getQuizQuestions(subject, level, customQuestions = [], options = {}) {
  if (subject === 'grand' && level && typeof level === 'object') {
    return getGrandQuizQuestions(level, customQuestions);
  }

  const subtopic = options.subtopic ?? 'all';
  const base = [...(QUESTION_BANK[subject]?.[level] ?? [])];
  const custom = customQuestions.filter(q => q.subject === subject && q.level === level);
  const pool = filterBySubtopic(subject, subtopic, [...base, ...custom]);
  return shuffle(pool).slice(0, QUESTIONS_PER_QUIZ);
}

function filterBySubtopic(subject, subtopic, questions) {
  if (!subtopic || subtopic === 'all') return questions;
  const rules = SUBTOPIC_MATCHERS[subject]?.[subtopic];
  if (!rules?.length) return questions;

  const filtered = questions.filter(q => rules.some(rule => rule.test(q.q)));
  return filtered.length >= 8 ? filtered : questions;
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
