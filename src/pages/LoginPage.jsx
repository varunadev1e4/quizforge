import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useNotification } from '../context/NotificationContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Starfield from '../components/layout/Starfield';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login, register, authError, setAuthError } = useAuth();
  const { isLoading, storeWarning } = useStore();
  const { notify } = useNotification();

  const [tab,         setTab]         = useState('login');
  const [username,    setUsername]    = useState('');
  const [password,    setPassword]    = useState('');
  const [displayName, setDisplayName] = useState('');

  function handleSubmit() {
    setAuthError('');
    if (tab === 'login') {
      const ok = login(username, password);
      if (ok) notify(`Welcome back, ${username}! 👋`);
    } else {
      const ok = register(username, password, displayName);
      if (ok) notify('Account created! Welcome to QuizForge 🎉');
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <div className={styles.page}>
      <Starfield count={80} />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logoGlyph}>⬡</div>
          <h1 className={`${styles.logoText} shimmer-text`}>QUIZFORGE</h1>
          <p className={styles.tagline}>Master Science. Level Up Your Mind.</p>
        </div>

        {/* Tab switcher */}
        <div className={styles.tabs}>
          {['login', 'register'].map(t => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.activeTab : ''}`}
              onClick={() => { setTab(t); setAuthError(''); }}
            >
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className={styles.form} onKeyDown={handleKey}>
          {tab === 'register' && (
            <Input
              label="Display Name"
              placeholder="How should we call you?"
              icon="✦"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
            />
          )}
          <Input
            label="Username"
            placeholder="your_username"
            icon="@"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon="🔑"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {storeWarning && <p className={styles.error}>{storeWarning}</p>}
          {authError && <p className={styles.error}>{authError}</p>}

          <Button variant="primary" size="lg" full onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Connecting…' : tab === 'login' ? 'Sign In →' : 'Create Account →'}
          </Button>
        </div>

        {tab === 'login' && (
          <p className={styles.demo}>Demo: <code>admin</code> / <code>admin123</code></p>
        )}
      </div>
    </div>
  );
}
