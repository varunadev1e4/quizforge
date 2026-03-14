import { BADGES } from '../../data/badges';
import styles from './BadgeGrid.module.css';

export default function BadgeGrid({ earned = [] }) {
  const groups = ['milestone', 'score', 'subject', 'level', 'streak', 'xp'];

  return (
    <div className={styles.wrapper}>
      {groups.map(cat => {
        const catBadges = BADGES.filter(b => b.category === cat);
        return (
          <div key={cat} className={styles.group}>
            <h4 className={styles.groupTitle}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h4>
            <div className={styles.grid}>
              {catBadges.map(b => {
                const unlocked = earned.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`${styles.badge} ${unlocked ? styles.unlocked : styles.locked}`}
                    title={b.desc}
                  >
                    <span className={styles.badgeIcon}>{b.icon}</span>
                    <span className={styles.badgeName}>{b.name}</span>
                    <span className={styles.badgeDesc}>{b.desc}</span>
                    {!unlocked && <div className={styles.lockOverlay}>🔒</div>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
