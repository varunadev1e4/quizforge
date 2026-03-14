import styles from './FullScreenLoader.module.css';

export default function FullScreenLoader({ message = 'Restoring your session…' }) {
  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-label="Loading">
      <div className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}
