// ─── Subject & Level Metadata ──────────────────────────────────────────────
export const SUBJECTS = ['math', 'physics', 'chemistry'];

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

// ─── Storage Key ──────────────────────────────────────────────────────────
export const STORAGE_KEY = 'quizforge_v4';
