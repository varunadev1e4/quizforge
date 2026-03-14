import { SubjectBadge, LevelBadge } from '../ui/Badge';
import QuizTimer from './QuizTimer';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';
import { SUBJECT_META, LEVEL_META } from '../../data/constants';
import styles from './QuizQuestion.module.css';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizQuestion({ session, onSelect, onConfirm, onNext }) {
  const { subject, level, questions, current, selectedOption, phase, timeLeft, result } = session;
  const q        = questions[current];
  const subMeta  = SUBJECT_META[subject];
  const lvlMeta  = LEVEL_META[level];
  const progress = ((current) / questions.length) * 100;
  const confirmed = phase === 'confirmed';

  return (
    <div className={`${styles.wrapper} anim-scale-in`}>
      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <SubjectBadge subject={subject} size="md" />
          <LevelBadge   level={level}   size="md" />
        </div>

        <QuizTimer timeLeft={timeLeft} />

        <div className={styles.topRight}>
          <span className={`${styles.qCounter} mono`}>
            {current + 1}
            <span className={styles.qTotal}>/{questions.length}</span>
          </span>
        </div>
      </div>

      {/* ── Progress bar ───────────────────────────────────────────────── */}
      <ProgressBar
        value={progress}
        color={subMeta.color}
        height={5}
      />

      {/* ── Question card ──────────────────────────────────────────────── */}
      <div className={styles.questionCard} style={{ borderColor: `${subMeta.color}30` }}>
        <p className={styles.qLabel}>Question {current + 1}</p>
        <p className={styles.qText}>{q.q}</p>
      </div>

      {/* ── Options ────────────────────────────────────────────────────── */}
      <div className={styles.options}>
        {q.opts.map((opt, i) => {
          let state = 'idle';
          if (confirmed) {
            if (i === q.ans)           state = 'correct';
            else if (i === selectedOption) state = 'wrong';
          } else if (i === selectedOption) {
            state = 'selected';
          }

          return (
            <button
              key={i}
              className={`${styles.option} ${styles[state]}`}
              onClick={() => !confirmed && onSelect(i)}
              disabled={confirmed}
            >
              <span className={styles.letter}>{OPTION_LETTERS[i]}</span>
              <span className={styles.optText}>{opt}</span>
              {confirmed && i === q.ans       && <span className={styles.indicator}>✓</span>}
              {confirmed && i === selectedOption && i !== q.ans && <span className={styles.indicator}>✗</span>}
            </button>
          );
        })}
      </div>

      {/* ── Action button ──────────────────────────────────────────────── */}
      <div className={styles.actions}>
        {!confirmed ? (
          <Button
            variant="primary"
            size="lg"
            full
            disabled={selectedOption === null}
            onClick={onConfirm}
          >
            Confirm Answer
          </Button>
        ) : (
          <Button
            variant="success"
            size="lg"
            full
            onClick={onNext}
          >
            {current < questions.length - 1 ? 'Next Question →' : 'See Results →'}
          </Button>
        )}
      </div>
    </div>
  );
}
