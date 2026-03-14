import styles from './ProgressBar.module.css';

export default function ProgressBar({ value, max = 100, color = 'var(--brand-primary)', height = 6, label }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={styles.wrapper}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.track} style={{ height }}>
        <div
          className={styles.fill}
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
