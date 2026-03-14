import styles from './Input.module.css';

export default function Input({
  label,
  error,
  icon,
  type = 'text',
  className = '',
  ...rest
}) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrap}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          type={type}
          className={`${styles.input} ${icon ? styles.withIcon : ''} ${error ? styles.hasError : ''}`}
          {...rest}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
