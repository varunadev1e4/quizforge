import { createContext, useContext, useEffect, useState } from 'react';
import { useStore } from './StoreContext';
import { createUser } from '../utils/storage';
import {
  isSupabaseConfigured,
  persistSupabaseSession,
  supabaseGetSession,
  supabaseSignIn,
  supabaseSignOut,
  supabaseSignUp,
} from '../lib/supabaseClient';

const AuthContext = createContext(null);
const SESSION_USER_KEY = 'quizforge.currentUser';

function sanitizeUsername(username = '') {
  return username.trim().toLowerCase();
}

function usernameToEmail(username) {
  return `${sanitizeUsername(username)}@quizforge.local`;
}

function findUsernameByAuthUid(users, uid) {
  return Object.entries(users).find(([, value]) => value?.authUid === uid)?.[0] || null;
}

export function AuthProvider({ children }) {
  const { store, persist, isLoading } = useStore();
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    async function restoreSession() {
      if (isSupabaseConfigured) {
        try {
          const session = await supabaseGetSession();
          const uid = session?.user?.id;
          if (uid) {
            const matched = findUsernameByAuthUid(store.users, uid);
            if (matched) {
              setCurrentUser(matched);
            }
          }
        } catch {
          // No active cloud session. Fall back to local demo mode.
        }
      }

      if (!currentUser) {
        const savedUser = window.localStorage.getItem(SESSION_USER_KEY);
        if (savedUser && store.users[savedUser]) {
          setCurrentUser(savedUser);
        } else if (savedUser) {
          window.localStorage.removeItem(SESSION_USER_KEY);
        }
      }

      setIsAuthReady(true);
    }

    restoreSession();
  }, [isLoading, store.users]);

  async function login(username, password) {
    if (isLoading) {
      setAuthError('Please wait, still connecting to database.');
      return false;
    }

    const normalizedUsername = sanitizeUsername(username);
    const u = store.users[normalizedUsername];

    if (!normalizedUsername || !password) {
      setAuthError('Username and password are required.');
      return false;
    }

    if (!isSupabaseConfigured) {
      if (!u || u.password !== password) {
        setAuthError('Invalid username or password.');
        return false;
      }
      setAuthError('');
      setCurrentUser(normalizedUsername);
      window.localStorage.setItem(SESSION_USER_KEY, normalizedUsername);
      return true;
    }

    // Primary path: Supabase Auth.
    const email = usernameToEmail(normalizedUsername);
    const signInRes = await supabaseSignIn(email, password);

    if (signInRes.ok && signInRes.user) {
      persistSupabaseSession(signInRes.accessToken);
      const matched = findUsernameByAuthUid(store.users, signInRes.user.id);
      const usernameFromStore = matched || normalizedUsername;

      // Auto-bind existing profile if not linked yet.
      if (store.users[usernameFromStore] && !store.users[usernameFromStore].authUid) {
        persist(s => ({
          ...s,
          users: {
            ...s.users,
            [usernameFromStore]: {
              ...s.users[usernameFromStore],
              authUid: signInRes.user.id,
              password: undefined,
            },
          },
        }));
      }

      setAuthError('');
      setCurrentUser(usernameFromStore);
      window.localStorage.setItem(SESSION_USER_KEY, usernameFromStore);
      return true;
    }

    // One-time migration path for legacy accounts in app state.
    if (u?.password && u.password === password) {
      const signUpRes = await supabaseSignUp(email, password);
      if (signUpRes.ok && signUpRes.user) {
        persistSupabaseSession(signUpRes.accessToken);
        persist(s => ({
          ...s,
          users: {
            ...s.users,
            [normalizedUsername]: {
              ...s.users[normalizedUsername],
              authUid: signUpRes.user.id,
              password: undefined,
            },
          },
        }));
        setAuthError('');
        setCurrentUser(normalizedUsername);
        window.localStorage.setItem(SESSION_USER_KEY, normalizedUsername);
        return true;
      }
    }

    setAuthError(signInRes.error || 'Invalid username or password.');
    return false;
  }

  async function register(username, password, displayName) {
    if (isLoading) {
      setAuthError('Please wait, still connecting to database.');
      return false;
    }

    const normalizedUsername = sanitizeUsername(username);

    if (store.users[normalizedUsername]) {
      setAuthError('Username already taken.');
      return false;
    }
    if (normalizedUsername.length < 3) {
      setAuthError('Username must be at least 3 characters.');
      return false;
    }
    if (!/^[a-z0-9_]+$/i.test(normalizedUsername)) {
      setAuthError('Username can only contain letters, numbers, and underscores.');
      return false;
    }
    if (password.length < 8) {
      setAuthError('Password must be at least 8 characters.');
      return false;
    }

    let authUid = null;
    if (isSupabaseConfigured) {
      const signUpRes = await supabaseSignUp(usernameToEmail(normalizedUsername), password);
      if (!signUpRes.ok || !signUpRes.user) {
        setAuthError(signUpRes.error || 'Failed to create account.');
        return false;
      }
      authUid = signUpRes.user.id;
      persistSupabaseSession(signUpRes.accessToken);
    }

    const newUser = createUser(normalizedUsername, displayName, { authUid });
    persist((s) => ({
      ...s,
      users: { ...s.users, [normalizedUsername]: newUser },
    }));

    setAuthError('');
    setCurrentUser(normalizedUsername);
    window.localStorage.setItem(SESSION_USER_KEY, normalizedUsername);
    return true;
  }

  async function logout() {
    setCurrentUser(null);
    window.localStorage.removeItem(SESSION_USER_KEY);
    if (isSupabaseConfigured) {
      await supabaseSignOut();
    }
  }

  const user = currentUser ? store.users[currentUser] : null;

  return (
    <AuthContext.Provider value={{ currentUser, user, login, register, logout, authError, setAuthError, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
