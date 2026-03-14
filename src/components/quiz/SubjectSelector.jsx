import { useState } from 'react';
import {
  SUBJECTS,
  LEVELS,
  SUBJECT_META,
  LEVEL_META,
  SUBJECT_SUBTOPICS,
  SUBTOPIC_META,
} from '../../data/constants';
import Card from '../ui/Card';
import Button from '../ui/Button';
import styles from './SubjectSelector.module.css';

export default function SubjectSelector({ onStart }) {
  const [subtopicBySubject, setSubtopicBySubject] = useState(() =>
    SUBJECTS.reduce((acc, subject) => ({ ...acc, [subject]: 'all' }), {})
  );

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
              subtopic={subtopicBySubject[sub]}
              onSubtopicChange={topic => setSubtopicBySubject(prev => ({ ...prev, [sub]: topic }))}
              onStart={onStart}
            />
          );
        })}
      </div>

      <GrandTestCard onStart={onStart} />
    </div>
  );
}

function SubjectCard({ subject, meta, delay, onStart, subtopic, onSubtopicChange }) {
  const subtopics = SUBJECT_SUBTOPICS[subject] || ['all'];

  return (
    <div className={`${styles.subjectCard} anim-fade-up`} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.subjectHeader} style={{ background: meta.gradient }}>
        <span className={styles.subjectIcon}>{meta.icon}</span>
        <span className={styles.subjectLabel}>{meta.label}</span>
      </div>

      <div className={styles.levels}>
        <label className={styles.subtopicLabel}>
          Focus area
          <select
            className={styles.subtopicSelect}
            value={subtopic}
            onChange={e => onSubtopicChange(e.target.value)}
          >
            {subtopics.map(topic => (
              <option key={topic} value={topic}>{SUBTOPIC_META[topic]?.label || topic}</option>
            ))}
          </select>
        </label>

        {LEVELS.map(lv => {
          const lm = LEVEL_META[lv];
          return (
            <button
              key={lv}
              className={styles.levelBtn}
              style={{ '--lc': lm.color }}
              onClick={() => onStart(subject, lv, { subtopic })}
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

function GrandTestCard({ onStart }) {
  const [levelsBySubject, setLevelsBySubject] = useState(() =>
    SUBJECTS.reduce((acc, subject) => ({ ...acc, [subject]: 'medium' }), {})
  );

  function updateSubjectLevel(subject, level) {
    setLevelsBySubject(prev => ({ ...prev, [subject]: level }));
  }

  return (
    <Card elevated className={`${styles.grandCard} anim-fade-up`}>
      <div className={styles.grandHeader} style={{ background: SUBJECT_META.grand.gradient }}>
        <span className={styles.subjectIcon}>{SUBJECT_META.grand.icon}</span>
        <span className={styles.subjectLabel}>{SUBJECT_META.grand.label}</span>
      </div>

      <div className={styles.grandBody}>
        <p className={styles.grandSub}>Choose difficulty for each subject, then start one combined quiz.</p>

        {SUBJECTS.map(subject => (
          <div key={subject} className={styles.subjectLevelRow}>
            <span className={styles.rowLabel}>{SUBJECT_META[subject].icon} {SUBJECT_META[subject].label}</span>
            <div className={styles.rowLevels}>
              {LEVELS.map(level => {
                const isSelected = levelsBySubject[subject] === level;
                return (
                  <button
                    key={level}
                    className={`${styles.rowLevelBtn} ${isSelected ? styles.rowLevelBtnSelected : ''}`}
                    style={{ '--lc': LEVEL_META[level].color }}
                    onClick={() => updateSubjectLevel(subject, level)}
                  >
                    {LEVEL_META[level].label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <Button
          variant="primary"
          size="lg"
          full
          onClick={() => onStart('grand', levelsBySubject)}
        >
          Start Grand Test
        </Button>
      </div>
    </Card>
  );
}
