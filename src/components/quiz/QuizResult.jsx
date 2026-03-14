import { SubjectBadge, LevelBadge } from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import styles from './QuizResult.module.css';

export default function QuizResult({ session, onBack, onRetry }) {
  const { subject, level, questions, answers, result } = session;
  const { score, correct, total, xpEarned } = result;

  const emoji  = score === 100 ? '🏆' : score >= 80 ? '🌟' : score >= 60 ? '👍' : score >= 40 ? '💪' : '📚';
  const msg    = score === 100 ? 'Perfect Score!' : score >= 80 ? 'Excellent!' : score >= 60 ? 'Good Job!' : score >= 40 ? 'Keep Practicing!' : 'Keep Going!';
  const color  = score === 100 ? '#facc15' : score >= 80 ? '#4ade80' : score >= 60 ? '#38bdf8' : score >= 40 ? '#fb923c' : '#ef4444';

  return (
    <div className={`${styles.wrapper} anim-scale-in`}>
      {/* ── Score hero ─────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={`${styles.emoji} anim-pop-in`}>{emoji}</div>
        <h2 className={styles.msg} style={{ color }}>{msg}</h2>
        <div className={styles.score} style={{ color }}>{score}%</div>
        <div className={styles.subScore}>{correct} / {total} correct</div>
        <div className={styles.xpPill}>+{xpEarned} XP earned</div>
        <div className={styles.badges}>
          <SubjectBadge subject={subject} size="md" />
          <LevelBadge level={level} size="md" />
        </div>
      </div>

      {/* ── Answer review ──────────────────────────────────────────────── */}
      <Card elevated className={styles.reviewCard}>
        <h3 className={styles.reviewTitle}>Answer Review</h3>
        <div className={styles.reviewList}>
          {questions.map((q, i) => {
            const userAns  = answers[i];
            const isCorrect = userAns === q.ans;
            const timedOut  = userAns === -1;

            return (
              <div
                key={i}
                className={`${styles.reviewItem} ${isCorrect ? styles.correct : styles.wrong}`}
              >
                <div className={styles.reviewQ}>
                  <span className={styles.reviewNum}>Q{i + 1}</span>
                  <span>{q.q}</span>
                </div>
                <div className={styles.reviewA}>
                  {isCorrect ? (
                    <span className={styles.correct}>✓ {q.opts[q.ans]}</span>
                  ) : (
                    <>
                      <span className={styles.wrong}>
                        ✗ {timedOut ? 'Timed out' : q.opts[userAns]}
                      </span>
                      <span className={styles.correctAns}>
                        → {q.opts[q.ans]}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Actions ────────────────────────────────────────────────────── */}
      <div className={styles.actions}>
        <Button variant="secondary" size="lg" onClick={onBack}>← Back to Home</Button>
        <Button variant="primary"   size="lg" onClick={() => onRetry(subject, level)}>Retry Quiz</Button>
      </div>
    </div>
  );
}
