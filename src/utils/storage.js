import { STORAGE_KEY } from '../data/constants';

const DEFAULT_STORE = {
  users: {
    admin: {
      password: 'admin123',
      role: 'admin',
      displayName: 'Admin',
      xp: 0,
      streak: 0,
      lastDate: '',
      totalQuizzes: 0,
      history: [],
      badges: [],
      subjectCount: { math: 0, physics: 0, chemistry: 0 },
      levelsCompleted: [],
      hasPerfect: false,
      bestScore: 0,
    },
  },
  customQuestions: [],
  challenges: [],
  questionStats: {},
};

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORE;
    const parsed = JSON.parse(raw);
    // Merge defaults for any missing top-level keys
    return { ...DEFAULT_STORE, ...parsed };
  } catch {
    return DEFAULT_STORE;
  }
}

export function saveStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

/** Create a fresh user object */
export function createUser(username, password, displayName) {
  return {
    password,
    role: 'student',
    displayName: displayName || username,
    xp: 0,
    streak: 0,
    lastDate: '',
    totalQuizzes: 0,
    history: [],
    badges: [],
    subjectCount: { math: 0, physics: 0, chemistry: 0 },
    levelsCompleted: [],
    hasPerfect: false,
    bestScore: 0,
  };
}
