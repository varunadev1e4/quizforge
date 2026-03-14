import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizResult   from '../components/quiz/QuizResult';
import PageShell    from '../components/layout/PageShell';
import Button       from '../components/ui/Button';
import styles       from './QuizPage.module.css';

export default function QuizPage({
  session,
  onExit,
  onSelect,
  onConfirm,
  onNext,
  onSkip,
  onRetry,
  onRetryIncorrect,
}) {

  if (!session) {
    return (
      <PageShell maxWidth={760}>
        <div className={styles.noSession}>
          <p>No active quiz session.</p>
          <Button variant="primary" onClick={onExit}>← Back to Home</Button>
        </div>
      </PageShell>
    );
  }

  if (session.phase === 'result') {
    return (
      <PageShell maxWidth={760}>
        <QuizResult
          session={session}
          onBack={onExit}
          onRetry={onRetry}
          onRetryIncorrect={onRetryIncorrect}
        />
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth={760}>
      <div className={styles.exitRow}>
        <Button variant="ghost" size="sm" onClick={onExit}>✕ Exit Quiz</Button>
      </div>
      <QuizQuestion
        session={session}
        onSelect={onSelect}
        onConfirm={onConfirm}
        onNext={onNext}
        onSkip={onSkip}
      />
    </PageShell>
  );
}
