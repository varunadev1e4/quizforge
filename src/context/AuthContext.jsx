import { createContext, useContext, useEffect, useState } from 'react';
import { useStore } from './StoreContext';
import { createUser } from '../utils/storage';

const AuthContext = createContext(null);
const SESSION_USER_KEY = 'quizforge.currentUser';

export function AuthProvider({ children }) {
  const { store, persist, isLoading } = useStore();
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (isLoading) return;

    const savedUser = window.localStorage.getItem(SESSION_USER_KEY);
    if (savedUser && store.users[savedUser]) {
      setCurrentUser(savedUser);
    } else if (savedUser) {
      window.localStorage.removeItem(SESSION_USER_KEY);
    }
  }, [isLoading, store.users]);

  function login(username, password) {
    if (isLoading) {
      setAuthError('Please wait, still connecting to database.');
      return false;
    }

    const u = store.users[username];
    if (!u || u.password !== password) {
      setAuthError('Invalid username or password.');
      return false;
    }
    setAuthError('');
    setCurrentUser(username);
    window.localStorage.setItem(SESSION_USER_KEY, username);
    return true;
  }

  function register(username, password, displayName) {
    if (isLoading) {
      setAuthError('Please wait, still connecting to database.');
      return false;
    }

    if (store.users[username]) {
      setAuthError('Username already taken.');
      return false;
    }
    if (username.length < 3) {
      setAuthError('Username must be at least 3 characters.');
      return false;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return false;
    }
    const newUser = createUser(username, password, displayName);
    persist((s) => ({
      ...s,
      users: { ...s.users, [username]: newUser },
    }));
    setAuthError('');
    setCurrentUser(username);
    window.localStorage.setItem(SESSION_USER_KEY, username);
    return true;
  }

  function logout() {
    setCurrentUser(null);
    window.localStorage.removeItem(SESSION_USER_KEY);
  }

  const user = currentUser ? store.users[currentUser] : null;

  return (
    <AuthContext.Provider value={{ currentUser, user, login, register, logout, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
