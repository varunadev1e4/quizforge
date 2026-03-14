import styles from './PageShell.module.css';

export default function PageShell({ children, maxWidth = 1100 }) {
  return (
    <main className={`${styles.shell} anim-fade-up`} style={{ '--max': `${maxWidth}px` }}>
      {children}
    </main>
  );
}
