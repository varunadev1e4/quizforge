// ─── Subject & Level Metadata ──────────────────────────────────────────────
export const SUBJECTS = ['math', 'physics', 'chemistry'];

export const SUBJECT_SUBTOPIC_TREE = {
  math: {
    algebra: ['linear-equations', 'polynomials', 'sequences'],
    trigonometry: ['angles', 'identities', 'equations'],
    geometry: ['triangles', 'circles', 'coordinate-geometry'],
    calculus: ['limits', 'derivatives', 'integrals'],
    statistics: ['descriptive', 'probability', 'distributions'],
  },
  physics: {
    mechanics: ['kinematics', 'dynamics', 'work-energy'],
    electricity: ['electrostatics', 'current-electricity', 'magnetism'],
    waves: ['wave-motion', 'sound', 'optics'],
    thermodynamics: ['gas-laws', 'heat-transfer', 'entropy'],
    modern: ['quantum', 'nuclear', 'relativity'],
  },
  chemistry: {
    atomic: ['structure', 'periodic-trends', 'quantum-model'],
    bonding: ['ionic-covalent', 'molecular-shapes', 'intermolecular-forces'],
    reactions: ['stoichiometry', 'equilibrium', 'acid-base-redox'],
    organic: ['hydrocarbons', 'functional-groups', 'reaction-mechanisms'],
    physical: ['thermochemistry', 'kinetics', 'electrochemistry'],
  },
};

export const SUBJECT_SUBTOPICS = Object.fromEntries(
  Object.entries(SUBJECT_SUBTOPIC_TREE).map(([subject, parents]) => [
    subject,
    [
      'all',
      ...Object.keys(parents),
      ...Object.entries(parents).flatMap(([parent, children]) =>
        children.map(child => `${parent}:${child}`)
      ),
    ],
  ])
);

export const SUBTOPIC_META = {
  all: { label: 'All Topics' },
  algebra: { label: 'Algebra' },
  'algebra:linear-equations': { label: 'Linear Equations' },
  'algebra:polynomials': { label: 'Polynomials' },
  'algebra:sequences': { label: 'Sequences & Series' },
  trigonometry: { label: 'Trigonometry' },
  'trigonometry:angles': { label: 'Angles & Ratios' },
  'trigonometry:identities': { label: 'Trigonometric Identities' },
  'trigonometry:equations': { label: 'Trig Equations' },
  geometry: { label: 'Geometry' },
  'geometry:triangles': { label: 'Triangles' },
  'geometry:circles': { label: 'Circles' },
  'geometry:coordinate-geometry': { label: 'Coordinate Geometry' },
  calculus: { label: 'Calculus' },
  'calculus:limits': { label: 'Limits' },
  'calculus:derivatives': { label: 'Derivatives' },
  'calculus:integrals': { label: 'Integrals' },
  statistics: { label: 'Statistics' },
  'statistics:descriptive': { label: 'Descriptive Statistics' },
  'statistics:probability': { label: 'Probability' },
  'statistics:distributions': { label: 'Distributions' },
  mechanics: { label: 'Mechanics' },
  'mechanics:kinematics': { label: 'Kinematics' },
  'mechanics:dynamics': { label: 'Dynamics' },
  'mechanics:work-energy': { label: 'Work, Energy & Power' },
  electricity: { label: 'Electricity & Magnetism' },
  'electricity:electrostatics': { label: 'Electrostatics' },
  'electricity:current-electricity': { label: 'Current Electricity' },
  'electricity:magnetism': { label: 'Magnetism' },
  waves: { label: 'Waves & Optics' },
  'waves:wave-motion': { label: 'Wave Motion' },
  'waves:sound': { label: 'Sound Waves' },
  'waves:optics': { label: 'Optics' },
  thermodynamics: { label: 'Thermodynamics' },
  'thermodynamics:gas-laws': { label: 'Gas Laws' },
  'thermodynamics:heat-transfer': { label: 'Heat Transfer' },
  'thermodynamics:entropy': { label: 'Entropy' },
  modern: { label: 'Modern Physics' },
  'modern:quantum': { label: 'Quantum Physics' },
  'modern:nuclear': { label: 'Nuclear Physics' },
  'modern:relativity': { label: 'Relativity' },
  atomic: { label: 'Atomic Structure' },
  'atomic:structure': { label: 'Atomic Structure Basics' },
  'atomic:periodic-trends': { label: 'Periodic Trends' },
  'atomic:quantum-model': { label: 'Quantum Model' },
  bonding: { label: 'Bonding' },
  'bonding:ionic-covalent': { label: 'Ionic & Covalent Bonds' },
  'bonding:molecular-shapes': { label: 'Molecular Shapes' },
  'bonding:intermolecular-forces': { label: 'Intermolecular Forces' },
  reactions: { label: 'Chemical Reactions' },
  'reactions:stoichiometry': { label: 'Stoichiometry' },
  'reactions:equilibrium': { label: 'Equilibrium' },
  'reactions:acid-base-redox': { label: 'Acid/Base & Redox' },
  organic: { label: 'Organic Chemistry' },
  'organic:hydrocarbons': { label: 'Hydrocarbons' },
  'organic:functional-groups': { label: 'Functional Groups' },
  'organic:reaction-mechanisms': { label: 'Reaction Mechanisms' },
  physical: { label: 'Physical Chemistry' },
  'physical:thermochemistry': { label: 'Thermochemistry' },
  'physical:kinetics': { label: 'Chemical Kinetics' },
  'physical:electrochemistry': { label: 'Electrochemistry' },
};

export function getSubtopicLabel(key) {
  return SUBTOPIC_META[key]?.label || key;
}

export function getSubjectSubtopicOptions(subject) {
  const parentMap = SUBJECT_SUBTOPIC_TREE[subject] || {};
  return [
    { value: 'all', label: getSubtopicLabel('all') },
    ...Object.entries(parentMap).flatMap(([parent, children]) => ([
      { value: parent, label: getSubtopicLabel(parent) },
      ...children.map(child => {
        const value = `${parent}:${child}`;
        return { value, label: `${getSubtopicLabel(parent)} → ${getSubtopicLabel(value)}` };
      }),
    ])),
  ];
}

export function normalizeSubjectSubtopic(subject, rawValue) {
  const normalized = typeof rawValue === 'string' ? rawValue.trim().toLowerCase() : '';
  const allowed = SUBJECT_SUBTOPICS[subject] || ['all'];
  if (allowed.includes(normalized)) return normalized;

  const byLabel = allowed.find((key) => getSubtopicLabel(key).trim().toLowerCase() === normalized);
  if (byLabel) return byLabel;

  return 'all';
}

export const LEVELS = ['easy', 'medium', 'hard', 'master', 'expert'];

export const SUBJECT_META = {
  math: {
    label:  'Mathematics',
    icon:   '∑',
    color:  '#38bdf8',
    glow:   'rgba(56,189,248,0.25)',
    gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
  },
  physics: {
    label:  'Physics',
    icon:   '⚛',
    color:  '#34d399',
    glow:   'rgba(52,211,153,0.25)',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  chemistry: {
    label:  'Chemistry',
    icon:   '⚗',
    color:  '#f87171',
    glow:   'rgba(248,113,113,0.25)',
    gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
  },
  grand: {
    label: 'Grand Test',
    icon: '🌐',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.25)',
    gradient: 'linear-gradient(135deg, #f59e0b, #e879f9)',
  },
};

export const LEVEL_META = {
  easy:   { color: '#4ade80', label: 'Easy',   xpMultiplier: 1   },
  medium: { color: '#facc15', label: 'Medium', xpMultiplier: 2   },
  hard:   { color: '#fb923c', label: 'Hard',   xpMultiplier: 3.5 },
  master: { color: '#a78bfa', label: 'Master', xpMultiplier: 6   },
  expert: { color: '#f472b6', label: 'Expert', xpMultiplier: 10  },
  mixed:  { color: '#22d3ee', label: 'Mixed',  xpMultiplier: 1   },
};

export const QUESTIONS_PER_QUIZ = 15;
export const SECONDS_PER_QUESTION = 30;

// ─── XP / Rank thresholds ──────────────────────────────────────────────────
export const RANKS = [
  { min: 0,    label: 'Rookie',     icon: '🌱' },
  { min: 150,  label: 'Learner',    icon: '📖' },
  { min: 400,  label: 'Scholar',    icon: '🎓' },
  { min: 800,  label: 'Adept',      icon: '⚗️' },
  { min: 1500, label: 'Expert',     icon: '🔬' },
  { min: 3000, label: 'Master',     icon: '🧠' },
  { min: 6000, label: 'Grand Master', icon: '👑' },
];

export function getRank(xp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.min) rank = r;
  }
  return rank;
}

export function getNextRank(xp) {
  for (let i = 0; i < RANKS.length; i++) {
    if (xp < RANKS[i].min) return RANKS[i];
  }
  return null;
}
