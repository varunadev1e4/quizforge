import { useState } from 'react';

// ── Providers ──────────────────────────────────────────────────────────────
import { StoreProvider }        from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider }  from './context/NotificationContext';

// ── Global UI ──────────────────────────────────────────────────────────────
import Starfield          from './components/layout/Starfield';
import Navbar             from './components/layout/Navbar';
import NotificationToast  from './components/ui/NotificationToast';

// ── Quiz hook ──────────────────────────────────────────────────────────────
import { useQuiz } from './hooks/useQuiz';

// ── Pages ──────────────────────────────────────────────────────────────────
import LoginPage       from './pages/LoginPage';
import HomePage        from './pages/HomePage';
import QuizPage        from './pages/QuizPage';
import HistoryPage     from './pages/HistoryPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage     from './pages/ProfilePage';
import ChallengesPage  from './pages/ChallengesPage';
import AdminPage       from './pages/AdminPage';

// ── Root ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <StoreProvider>
      <NotificationProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </NotificationProvider>
    </StoreProvider>
  );
}

// ── AppShell — rendered after providers are ready ──────────────────────────
function AppShell() {
  const { user } = useAuth();

  if (!user) {
    return (
      <>
        <Starfield count={70} />
        <NotificationToast />
        <LoginPage />
      </>
    );
  }

  return <AuthenticatedApp />;
}

// ── Authenticated layout ───────────────────────────────────────────────────
function AuthenticatedApp() {
  const { user }   = useAuth();
  const [page, setPage] = useState('home');

  const { quizSession, startQuiz, retryIncorrect, exitQuiz, selectOption, confirmAnswer, nextQuestion } = useQuiz();

  // Redirect to quiz page automatically when a session starts
  const activePage = quizSession ? 'quiz' : page;

  function handleStartQuiz(subject, level) {
    startQuiz(subject, level);
    // page will switch automatically via activePage
  }

  function handleExitQuiz() {
    exitQuiz();
    setPage('home');
  }

  // Guard: admin-only page
  function handleSetPage(p) {
    if (p === 'admin' && user?.role !== 'admin') return;
    setPage(p);
  }

  return (
    <>
      <Starfield count={50} />
      <Navbar page={activePage} setPage={handleSetPage} />
      <NotificationToast />

      {activePage === 'quiz' && (
        <QuizPage
          session={quizSession}
          onExit={handleExitQuiz}
          onSelect={selectOption}
          onConfirm={confirmAnswer}
          onNext={nextQuestion}
          onRetry={startQuiz}
          onRetryIncorrect={retryIncorrect}
        />
      )}
      {activePage === 'home' && (
        <HomePage onStartQuiz={handleStartQuiz} setPage={handleSetPage} />
      )}
      {activePage === 'history' && <HistoryPage />}
      {activePage === 'leaderboard' && <LeaderboardPage />}
      {activePage === 'profile' && <ProfilePage />}
      {activePage === 'challenges' && (
        <ChallengesPage onStartQuiz={handleStartQuiz} />
      )}
      {activePage === 'admin' && user?.role === 'admin' && <AdminPage />}
    </>
  );
}
