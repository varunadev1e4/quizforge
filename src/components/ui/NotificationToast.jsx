import { useNotification } from '../../context/NotificationContext';
import styles from './NotificationToast.module.css';

const ICONS = { success: '✓', error: '✕', info: 'ℹ', badge: '🏅' };
const COLORS = {
  success: '#10b981',
  error:   '#ef4444',
  info:    '#38bdf8',
  badge:   '#facc15',
};

export default function NotificationToast() {
  const { notifications } = useNotification();
  return (
    <div className={styles.container}>
      {notifications.map(n => (
        <div
          key={n.id}
          className={styles.toast}
          style={{ borderLeft: `4px solid ${COLORS[n.type] || COLORS.success}` }}
        >
          <span className={styles.icon} style={{ color: COLORS[n.type] }}>
            {ICONS[n.type] || ICONS.success}
          </span>
          <span className={styles.message}>{n.message}</span>
        </div>
      ))}
    </div>
  );
}
