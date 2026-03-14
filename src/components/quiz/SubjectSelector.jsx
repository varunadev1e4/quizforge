import { SUBJECTS, LEVELS, SUBJECT_META, LEVEL_META } from '../../data/constants';
import Card from '../ui/Card';
import Button from '../ui/Button';
import styles from './SubjectSelector.module.css';

export default function SubjectSelector({ onStart }) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Start a Quiz</h2>
      <p className={styles.sub}>Choose a subject, then pick your difficulty level</p>

      <div className={styles.grid}>
        {SUBJECTS.map((sub, si) => {
          const meta = SUBJECT_META[sub];
          return (
            <SubjectCard
              key={sub}
              subject={sub}
              meta={meta}
              delay={si * 80}
              onStart={onStart}
            />
          );
        })}
      </div>
    </div>
  );
}

function SubjectCard({ subject, meta, delay, onStart }) {
  return (
    <div className={`${styles.subjectCard} anim-fade-up`} style={{ animationDelay: `${delay}ms` }}>
      {/* Header */}
      <div className={styles.subjectHeader} style={{ background: meta.gradient }}>
        <span className={styles.subjectIcon}>{meta.icon}</span>
        <span className={styles.subjectLabel}>{meta.label}</span>
      </div>

      {/* Level grid */}
      <div className={styles.levels}>
        {LEVELS.map(lv => {
          const lm = LEVEL_META[lv];
          return (
            <button
              key={lv}
              className={styles.levelBtn}
              style={{ '--lc': lm.color }}
              onClick={() => onStart(subject, lv)}
            >
              <span className={styles.levelName}>{lm.label}</span>
              <span className={styles.levelXp}>×{lm.xpMultiplier} XP</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
