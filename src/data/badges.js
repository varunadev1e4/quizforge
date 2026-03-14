// ─── Badge Definitions ─────────────────────────────────────────────────────
// Each badge has: id, name, desc, icon, category, req(userStats) → boolean

export const BADGES = [
  // ── Milestone badges
  {
    id: 'first_quiz',
    name: 'First Steps',
    desc: 'Complete your very first quiz',
    icon: '🎯',
    category: 'milestone',
    req: s => s.totalQuizzes >= 1,
  },
  {
    id: 'quiz_5',
    name: 'Getting Warmed Up',
    desc: 'Complete 5 quizzes',
    icon: '🔥',
    category: 'milestone',
    req: s => s.totalQuizzes >= 5,
  },
  {
    id: 'quiz_10',
    name: 'Dedicated Scholar',
    desc: 'Complete 10 quizzes',
    icon: '📚',
    category: 'milestone',
    req: s => s.totalQuizzes >= 10,
  },
  {
    id: 'quiz_25',
    name: 'Knowledge Seeker',
    desc: 'Complete 25 quizzes',
    icon: '🔭',
    category: 'milestone',
    req: s => s.totalQuizzes >= 25,
  },
  // ── Score badges
  {
    id: 'perfect_score',
    name: 'Perfectionist',
    desc: 'Score 100% on any quiz',
    icon: '💯',
    category: 'score',
    req: s => s.hasPerfect,
  },
  {
    id: 'score_90',
    name: 'High Achiever',
    desc: 'Score 90%+ on any quiz',
    icon: '🌟',
    category: 'score',
    req: s => s.bestScore >= 90,
  },
  // ── Subject badges
  {
    id: 'math_3',
    name: 'Math Enthusiast',
    desc: 'Complete 3 Math quizzes',
    icon: '🔢',
    category: 'subject',
    req: s => (s.subjectCount?.math || 0) >= 3,
  },
  {
    id: 'physics_3',
    name: 'Physics Buff',
    desc: 'Complete 3 Physics quizzes',
    icon: '⚛️',
    category: 'subject',
    req: s => (s.subjectCount?.physics || 0) >= 3,
  },
  {
    id: 'chem_3',
    name: 'Chem Wizard',
    desc: 'Complete 3 Chemistry quizzes',
    icon: '🧪',
    category: 'subject',
    req: s => (s.subjectCount?.chemistry || 0) >= 3,
  },
  {
    id: 'all_subjects',
    name: 'Polymath',
    desc: 'Complete at least one quiz in every subject',
    icon: '🎭',
    category: 'subject',
    req: s =>
      (s.subjectCount?.math || 0) >= 1 &&
      (s.subjectCount?.physics || 0) >= 1 &&
      (s.subjectCount?.chemistry || 0) >= 1,
  },
  // ── Level badges
  {
    id: 'hard_done',
    name: 'Challenge Accepted',
    desc: 'Complete a Hard difficulty quiz',
    icon: '⚔️',
    category: 'level',
    req: s => (s.levelsCompleted || []).includes('hard'),
  },
  {
    id: 'master_done',
    name: 'Master Mind',
    desc: 'Complete a Master difficulty quiz',
    icon: '🧠',
    category: 'level',
    req: s => (s.levelsCompleted || []).includes('master'),
  },
  {
    id: 'expert_done',
    name: 'Grand Expert',
    desc: 'Complete an Expert difficulty quiz',
    icon: '🏆',
    category: 'level',
    req: s => (s.levelsCompleted || []).includes('expert'),
  },
  // ── Streak badges
  {
    id: 'streak_3',
    name: 'On a Roll',
    desc: 'Maintain a 3-day streak',
    icon: '🔥',
    category: 'streak',
    req: s => s.streak >= 3,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    desc: 'Maintain a 7-day streak',
    icon: '⚡',
    category: 'streak',
    req: s => s.streak >= 7,
  },
  // ── XP badges
  {
    id: 'xp_500',
    name: 'Rising Star',
    desc: 'Earn 500 total XP',
    icon: '💫',
    category: 'xp',
    req: s => s.xp >= 500,
  },
  {
    id: 'xp_2000',
    name: 'XP Hunter',
    desc: 'Earn 2,000 total XP',
    icon: '🌠',
    category: 'xp',
    req: s => s.xp >= 2000,
  },
  {
    id: 'xp_6000',
    name: 'Legend',
    desc: 'Earn 6,000 total XP',
    icon: '👑',
    category: 'xp',
    req: s => s.xp >= 6000,
  },
];

export function checkNewBadges(user) {
  const alreadyEarned = user.badges || [];
  return BADGES
    .filter(b => !alreadyEarned.includes(b.id) && b.req(user))
    .map(b => b.id);
}
