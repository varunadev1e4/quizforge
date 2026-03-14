import { getRank, getNextRank, RANKS } from '../../data/constants';
import styles from './XPBar.module.css';

export default function XPBar({ xp }) {
  const rank     = getRank(xp);
  const next     = getNextRank(xp);
  const rankIdx  = RANKS.indexOf(rank);

  const fromXP   = rank.min;
  const toXP     = next ? next.min : xp;
  const progress = next
    ? Math.round(((xp - fromXP) / (toXP - fromXP)) * 100)
    : 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <div className={styles.rankInfo}>
          <span className={styles.icon}>{rank.icon}</span>
          <span className={styles.label}>{rank.label}</span>
        </div>
        <span className={styles.xpVal}>{xp.toLocaleString()} XP</span>
      </div>

      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={styles.bottom}>
        <span className={styles.from}>{fromXP.toLocaleString()} XP</span>
        {next ? (
          <span className={styles.next}>
            Next: {next.icon} {next.label} ({toXP.toLocaleString()} XP)
          </span>
        ) : (
          <span className={styles.max}>MAX RANK</span>
        )}
      </div>
    </div>
  );
}
