import styles from './StatCard.module.css';

export default function StatCard({ icon, value, label, color = 'var(--text-primary)', delay = 0 }) {
  return (
    <div className={`${styles.card} anim-fade-up`} style={{ animationDelay: `${delay}ms` }}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.value} style={{ color }}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
