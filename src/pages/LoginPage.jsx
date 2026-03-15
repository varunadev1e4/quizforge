import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useNotification } from '../context/NotificationContext';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Starfield from '../components/layout/Starfield';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login, register, requestPasswordReset, authError, setAuthError } = useAuth();
  const { isLoading, storeWarning } = useStore();
  const { notify } = useNotification();

  const [tab, setTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotPassword, setForgotPassword] = useState('');

  async function handleSubmit() {
    setAuthError('');
    if (tab === 'login') {
      const ok = await login(username, password);
      if (ok) notify(`Welcome back, ${username}! 👋`);
    } else {
      const ok = await register(username, password, displayName);
      if (ok) notify('Account created! Welcome to QuizForge 🎉');
    }
  }

  async function handleForgotPassword() {
    setAuthError('');
    const result = await requestPasswordReset(username, forgotPassword);
    if (!result.ok) return;

    if (result.localReset) {
      notify('Password reset complete. You can sign in with the new password.', 'success');
      setShowForgot(false);
      setPassword('');
      setForgotPassword('');
      return;
    }

    notify('Recovery email sent. Follow the link to reset your password.', 'info');
    setShowForgot(false);
  }

  function handleKey(e) {
    if (e.key === 'Enter') {
      if (showForgot) {
        handleForgotPassword();
      } else {
        handleSubmit();
      }
    }
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
              onClick={() => {
                setTab(t);
                setShowForgot(false);
                setAuthError('');
              }}
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
            placeholder="letters, numbers, underscores"
            icon="@"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          {!showForgot && (
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon="🔑"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          )}

          {showForgot && (
            <Input
              label={isSupabaseConfigured ? 'New Password (set via recovery link)' : 'Set a New Password'}
              type="password"
              placeholder="minimum 8 characters"
              icon="🛡️"
              value={forgotPassword}
              onChange={e => setForgotPassword(e.target.value)}
            />
          )}

          {storeWarning && <p className={styles.error}>{storeWarning}</p>}
          {authError && <p className={styles.error}>{authError}</p>}

          {showForgot ? (
            <>
              <Button variant="primary" size="lg" full onClick={handleForgotPassword} disabled={isLoading}>
                {isSupabaseConfigured ? 'Send Recovery Email →' : 'Reset Password →'}
              </Button>
              <Button
                variant="ghost"
                size="md"
                full
                onClick={() => {
                  setShowForgot(false);
                  setAuthError('');
                }}
              >
                Back to Sign In
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" size="lg" full onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Connecting…' : tab === 'login' ? 'Sign In →' : 'Create Account →'}
              </Button>
              {tab === 'login' && (
                <Button
                  variant="ghost"
                  size="md"
                  full
                  onClick={() => {
                    setShowForgot(true);
                    setAuthError('');
                  }}
                >
                  Forgot Password?
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
