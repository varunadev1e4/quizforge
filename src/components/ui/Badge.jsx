import { SUBJECT_META, LEVEL_META } from '../../data/constants';
import styles from './Badge.module.css';

export function SubjectBadge({ subject, size = 'sm' }) {
  const meta = SUBJECT_META[subject];
  if (!meta) return null;
  return (
    <span
      className={`${styles.badge} ${styles[size]}`}
      style={{ color: meta.color, background: `${meta.color}18`, border: `1px solid ${meta.color}40` }}
    >
      {meta.icon} {meta.label}
    </span>
  );
}

export function LevelBadge({ level, size = 'sm' }) {
  const meta = LEVEL_META[level];
  if (!meta) return null;
  return (
    <span
      className={`${styles.badge} ${styles[size]}`}
      style={{ color: meta.color, background: `${meta.color}18`, border: `1px solid ${meta.color}40` }}
    >
      {meta.label}
    </span>
  );
}
