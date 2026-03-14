import { useMemo } from 'react';
import styles from './Starfield.module.css';

export default function Starfield({ count = 60 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size:   Math.random() * 2 + 1,
      left:   Math.random() * 100,
      top:    Math.random() * 100,
      dur:    (Math.random() * 4 + 3).toFixed(1),
      delay:  (Math.random() * 4).toFixed(1),
      opacity: (Math.random() * 0.5 + 0.2).toFixed(2),
    })), [count]
  );

  return (
    <div className={styles.starfield} aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.id}
          className={styles.star}
          style={{
            width:  s.size,
            height: s.size,
            left:   `${s.left}%`,
            top:    `${s.top}%`,
            opacity: s.opacity,
            animationDuration:  `${s.dur}s`,
            animationDelay:     `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
