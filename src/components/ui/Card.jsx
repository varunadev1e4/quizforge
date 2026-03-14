import styles from './Card.module.css';

export default function Card({ children, className = '', elevated = false, glow, onClick, style }) {
  return (
    <div
      className={`${styles.card} ${elevated ? styles.elevated : ''} ${onClick ? styles.clickable : ''} ${className}`}
      onClick={onClick}
      style={{ ...style, ...(glow ? { boxShadow: `0 0 24px ${glow}` } : {}) }}
    >
      {children}
    </div>
  );
}
