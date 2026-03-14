import styles from './Button.module.css';

/**
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
 * size:    'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  variant = 'primary',
  size    = 'md',
  full    = false,
  disabled = false,
  onClick,
  style,
  className = '',
  ...rest
}) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${full ? styles.full : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
}
