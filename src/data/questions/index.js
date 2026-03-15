import { QUESTIONS_PER_QUIZ, SUBJECTS } from '../constants';

const SUBTOPIC_MATCHERS = {
  math: {
    algebra: [/solve/i, /factor/i, /inverse/i, /sequence/i, /matrix/i, /determinant/i],
    'algebra:linear-equations': [/linear/i, /simultaneous/i, /slope/i, /intercept/i],
    'algebra:polynomials': [/polynomial/i, /quadratic/i, /cubic/i, /roots?/i],
    'algebra:sequences': [/sequence/i, /series/i, /arithmetic/i, /geometric/i],

    trigonometry: [/sin/i, /cos/i, /tan/i, /angle/i, /period/i],
    'trigonometry:angles': [/angle/i, /radian/i, /degree/i, /triangle/i],
    'trigonometry:identities': [/identity/i, /sin\^2/i, /cos\^2/i, /sec/i, /cosec/i, /cot/i],
    'trigonometry:equations': [/solve.*sin|solve.*cos|solve.*tan/i, /trig equation/i],

    geometry: [/area/i, /perimeter/i, /circle/i, /parabola/i, /distance/i],
    'geometry:triangles': [/triangle/i, /pythag/i, /heron/i],
    'geometry:circles': [/circle/i, /arc/i, /chord/i, /tangent/i],
    'geometry:coordinate-geometry': [/coordinate/i, /slope/i, /distance formula/i, /midpoint/i],

    calculus: [/derivative/i, /integral/i, /∫/i, /lim\(/i, /taylor/i],
    'calculus:limits': [/limit/i, /approaches/i, /continuity/i],
    'calculus:derivatives': [/derivative/i, /differentiat/i, /gradient/i],
    'calculus:integrals': [/integral/i, /integrat/i, /area under/i],

    statistics: [/probability/i, /P\(/i, /mean/i, /distribution/i],
    'statistics:descriptive': [/mean|median|mode/i, /variance/i, /standard deviation/i],
    'statistics:probability': [/probability/i, /independent/i, /conditional/i, /bayes/i],
    'statistics:distributions': [/distribution/i, /binomial/i, /normal/i, /poisson/i],
  },

  physics: {
    mechanics: [/force/i, /velocity/i, /acceleration/i, /momentum/i, /newton/i, /work/i],
    'mechanics:kinematics': [/velocity/i, /acceleration/i, /displacement/i, /equation of motion/i],
    'mechanics:dynamics': [/force/i, /newton/i, /friction/i, /tension/i],
    'mechanics:work-energy': [/work/i, /energy/i, /power/i, /kinetic/i, /potential/i],

    electricity: [/electric/i, /voltage/i, /current/i, /magnetic/i, /circuit/i, /ohm/i],
    'electricity:electrostatics': [/electrostatic/i, /charge/i, /coulomb/i, /electric field/i],
    'electricity:current-electricity': [/current/i, /resistance/i, /ohm/i, /kirchhoff/i],
    'electricity:magnetism': [/magnetic/i, /flux/i, /induction/i, /lorentz/i],

    waves: [/wave/i, /light/i, /optics/i, /frequency/i, /wavelength/i, /sound/i],
    'waves:wave-motion': [/wave/i, /frequency/i, /wavelength/i, /amplitude/i],
    'waves:sound': [/sound/i, /doppler/i, /echo/i, /intensity/i],
    'waves:optics': [/optics/i, /lens/i, /mirror/i, /refraction/i, /diffraction/i],

    thermodynamics: [/heat/i, /entropy/i, /thermo/i, /temperature/i, /gas/i],
    'thermodynamics:gas-laws': [/boyle/i, /charles/i, /gas law/i, /ideal gas/i],
    'thermodynamics:heat-transfer': [/conduction/i, /convection/i, /radiation/i, /heat transfer/i],
    'thermodynamics:entropy': [/entropy/i, /second law/i, /irreversible/i],

    modern: [/quantum/i, /relativity/i, /nuclear/i, /photon/i, /atom/i],
    'modern:quantum': [/quantum/i, /photoelectric/i, /de broglie/i, /uncertainty/i],
    'modern:nuclear': [/nuclear/i, /radioactive/i, /fission/i, /fusion/i],
    'modern:relativity': [/relativity/i, /time dilation/i, /length contraction/i],
  },

  chemistry: {
    atomic: [/atom/i, /electron/i, /proton/i, /orbital/i, /periodic/i],
    'atomic:structure': [/atom/i, /electron/i, /proton/i, /neutron/i, /orbital/i],
    'atomic:periodic-trends': [/periodic/i, /ionization/i, /electronegativity/i, /atomic radius/i],
    'atomic:quantum-model': [/quantum number/i, /orbital/i, /subshell/i, /aufbau/i],

    bonding: [/bond/i, /ionic/i, /covalent/i, /molecule/i, /hybrid/i],
    'bonding:ionic-covalent': [/ionic/i, /covalent/i, /electronegativity difference/i],
    'bonding:molecular-shapes': [/vsepr/i, /shape/i, /bond angle/i, /geometry/i],
    'bonding:intermolecular-forces': [/hydrogen bond/i, /dipole/i, /van der waals/i, /intermolecular/i],

    reactions: [/reaction/i, /equilibrium/i, /oxidation/i, /acid/i, /base/i],
    'reactions:stoichiometry': [/stoichiometry/i, /mole/i, /limiting reagent/i, /yield/i],
    'reactions:equilibrium': [/equilibrium/i, /le chatelier/i, /kc/i, /kp/i],
    'reactions:acid-base-redox': [/acid/i, /base/i, /ph/i, /redox/i, /oxidation/i, /reduction/i],

    organic: [/organic/i, /alkane/i, /benzene/i, /polymer/i, /functional group/i],
    'organic:hydrocarbons': [/alkane/i, /alkene/i, /alkyne/i, /hydrocarbon/i],
    'organic:functional-groups': [/functional group/i, /alcohol/i, /aldehyde/i, /ketone/i, /carboxy/i],
    'organic:reaction-mechanisms': [/mechanism/i, /substitution/i, /elimination/i, /addition reaction/i],

    physical: [/enthalpy/i, /entropy/i, /kinetic/i, /rate/i, /thermo/i],
    'physical:thermochemistry': [/enthalpy/i, /heat of reaction/i, /hess/i, /thermochemistry/i],
    'physical:kinetics': [/rate/i, /order of reaction/i, /activation energy/i, /arrhenius/i],
    'physical:electrochemistry': [/electrochem/i, /galvanic/i, /electrolytic/i, /electrode/i, /nernst/i],
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
  const pool = filterBySubtopic(
    subject,
    subtopic,
    customQuestions.filter(q => q.subject === subject && q.level === level)
  );
  return shuffle(pool).slice(0, QUESTIONS_PER_QUIZ);
}

function filterBySubtopic(subject, subtopic, questions) {
  if (!subtopic || subtopic === 'all') return questions;

  const isChildSelection = subtopic.includes(':');
  const [parentSubtopic] = subtopic.split(':');
  const subjectMatchers = SUBTOPIC_MATCHERS[subject] || {};
  const rules = subjectMatchers[subtopic] || subjectMatchers[parentSubtopic];
  if (!rules?.length) return questions;

  return questions.filter((q) => {
    // Prefer explicit question metadata when available (custom import/editor).
    if (typeof q.subtopic === 'string' && q.subtopic) {
      if (isChildSelection) return q.subtopic === subtopic;
      return q.subtopic === subtopic || q.subtopic.startsWith(`${subtopic}:`);
    }

    // Heuristic fallback for legacy questions without explicit subtopic metadata.
    // Child selections use child matcher rules; parent selections use parent matcher rules.
    return rules.some(rule => rule.test(q.q));
  });
}

function getGrandQuizQuestions(levelBySubject, customQuestions = []) {
  const perSubject = Math.floor(QUESTIONS_PER_QUIZ / SUBJECTS.length);
  const remainder = QUESTIONS_PER_QUIZ % SUBJECTS.length;

  const selected = SUBJECTS.flatMap((subject, idx) => {
    const level = levelBySubject[subject] ?? 'medium';
    const take = perSubject + (idx < remainder ? 1 : 0);
    const custom = customQuestions
      .filter(q => q.subject === subject && q.level === level)
      .map(q => ({ ...q, subject, level }));

    return shuffle(custom).slice(0, take);
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
