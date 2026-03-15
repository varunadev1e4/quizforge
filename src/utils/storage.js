import { isSupabaseConfigured, supabaseSelect, supabaseUpsert } from '../lib/supabaseClient';

export const DEFAULT_STORE = {
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

const STORE_ROW_ID = 1;

function mergeStoreDefaults(store = {}) {
  return {
    ...DEFAULT_STORE,
    ...store,
    users: {
      ...DEFAULT_STORE.users,
      ...(store.users || {}),
    },
    customQuestions: store.customQuestions || [],
    challenges: store.challenges || [],
    questionStats: store.questionStats || {},
  };
}

export async function loadStore() {
  if (!isSupabaseConfigured) {
    return {
      store: DEFAULT_STORE,
      warning:
        'Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.',
    };
  }

  try {
    const rows = await supabaseSelect(`app_state?id=eq.${STORE_ROW_ID}&select=state`);
    const state = rows?.[0]?.state;

    if (!state) {
      await saveStore(DEFAULT_STORE);
      return { store: DEFAULT_STORE, warning: null };
    }

    return { store: mergeStoreDefaults(state), warning: null };
  } catch (error) {
    console.error('Failed to load app state from Supabase:', error.message);
    return { store: DEFAULT_STORE, warning: 'Failed to load cloud data. Using default state.' };
  }
}

export async function saveStore(nextStore) {
  if (!isSupabaseConfigured) return null;

  try {
    await supabaseUpsert('app_state', {
      id: STORE_ROW_ID,
      state: nextStore,
      updated_at: new Date().toISOString(),
    });
    return null;
  } catch (error) {
    console.error('Failed to save app state to Supabase:', error.message);
    return error;
  }
}

/** Create a fresh user object */
export function createUser(username, displayName, options = {}) {
  return {
    authUid: options.authUid || null,
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
