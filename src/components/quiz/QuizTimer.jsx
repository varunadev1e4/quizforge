import styles from './QuizTimer.module.css';
import { SECONDS_PER_QUESTION } from '../../data/constants';

export default function QuizTimer({ timeLeft }) {
  const pct     = (timeLeft / SECONDS_PER_QUESTION) * 100;
  const danger  = timeLeft <= 7;
  const warning = timeLeft <= 15;

  const color = danger  ? '#ef4444'
              : warning ? '#facc15'
              :           '#4ade80';

  return (
    <div className={`${styles.wrapper} ${danger ? styles.danger : ''}`}>
      <svg className={styles.ring} viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" className={styles.trackCircle} />
        <circle
          cx="22" cy="22" r="18"
          className={styles.fillCircle}
          style={{
            stroke: color,
            strokeDashoffset: `${113.1 * (1 - pct / 100)}`,
          }}
        />
      </svg>
      <span
        className={`${styles.number} mono`}
        style={{ color }}
      >
        {timeLeft}
      </span>
    </div>
  );
}
