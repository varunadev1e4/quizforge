import { SUBJECTS, SUBJECT_META, LEVEL_META } from '../../data/constants';
import { SubjectBadge, LevelBadge } from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import styles from './QuizResult.module.css';

export default function QuizResult({ session, onBack, onRetry, onRetryIncorrect }) {
  const { subject, level, subtopic, levelBySubject, questions, answers, result } = session;
  const { score, correct, total, xpEarned } = result;

  const emoji  = score === 100 ? '🏆' : score >= 80 ? '🌟' : score >= 60 ? '👍' : score >= 40 ? '💪' : '📚';
  const msg    = score === 100 ? 'Perfect Score!' : score >= 80 ? 'Excellent!' : score >= 60 ? 'Good Job!' : score >= 40 ? 'Keep Practicing!' : 'Keep Going!';
  const color  = score === 100 ? '#facc15' : score >= 80 ? '#4ade80' : score >= 60 ? '#38bdf8' : score >= 40 ? '#fb923c' : '#ef4444';

  const isGrand = subject === 'grand';
  const incorrectCount = questions.filter((q, i) => answers[i] !== q.ans).length;

  return (
    <div className={`${styles.wrapper} anim-scale-in`}>
      <div className={styles.hero}>
        <div className={`${styles.emoji} anim-pop-in`}>{emoji}</div>
        <h2 className={styles.msg} style={{ color }}>{msg}</h2>
        <div className={styles.score} style={{ color }}>{score}%</div>
        <div className={styles.subScore}>{correct} / {total} correct</div>
        <div className={styles.xpPill}>+{xpEarned} XP earned</div>
        <div className={styles.badges}>
          <SubjectBadge subject={subject} size="md" />
          <LevelBadge level={level} size="md" />
          {!isGrand && subtopic && subtopic !== 'all' && <span>{subtopic}</span>}
        </div>
        {isGrand && (
          <div className={styles.badges}>
            {SUBJECTS.map(sub => (
              <span key={sub}>
                <SubjectBadge subject={sub} size="sm" />
                <LevelBadge level={levelBySubject?.[sub]} size="sm" />
              </span>
            ))}
          </div>
        )}
      </div>

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
                  {isGrand && q.subject && (
                    <span style={{ color: SUBJECT_META[q.subject]?.color }}>
                      {SUBJECT_META[q.subject]?.icon} {SUBJECT_META[q.subject]?.label} · {LEVEL_META[q.level]?.label}
                    </span>
                  )}
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

      <div className={styles.actions}>
        <Button variant="secondary" size="lg" onClick={onBack}>← Back to Home</Button>
        <Button
          variant="ghost"
          size="lg"
          disabled={incorrectCount === 0}
          onClick={() => onRetryIncorrect(session)}
        >
          Retry Incorrect ({incorrectCount})
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => onRetry(subject, isGrand ? levelBySubject : level, { subtopic })}
        >
          Retry Quiz
        </Button>
      </div>
    </div>
  );
}
