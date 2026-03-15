import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth }  from '../context/AuthContext';
import { getRank, SUBJECT_META } from '../data/constants';
import Card      from '../components/ui/Card';
import PageShell from '../components/layout/PageShell';
import styles    from './LeaderboardPage.module.css';

const MEDALS = ['🥇', '🥈', '🥉'];

const SORT_OPTIONS = [
  { key: 'xp',      label: 'Total XP'    },
  { key: 'quizzes', label: 'Quizzes'     },
  { key: 'badges',  label: 'Badges'      },
  { key: 'streak',  label: 'Streak'      },
];

export default function LeaderboardPage() {
  const { store }       = useStore();
  const { currentUser } = useAuth();
  const [sortKey, setSortKey] = useState('xp');

  const players = Object.entries(store.users)
    .map(([id, u]) => ({
      id,
      displayName:  u.displayName || id,
      xp:           u.xp || 0,
      totalQuizzes: u.totalQuizzes || 0,
      badges:       (u.badges || []).length,
      streak:       u.streak || 0,
      bestScore:    u.bestScore || 0,
      subjectCount: u.subjectCount || {},
      rank:         getRank(u.xp || 0),
    }))
    .sort((a, b) => b[sortKey] - a[sortKey]);

  const myRank = players.findIndex(p => p.id === currentUser) + 1;

  return (
    <PageShell>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>🏆 Leaderboard</h1>
        {myRank > 0 && (
          <div className={styles.myRankBadge}>
            Your rank: <span className={styles.myRankNum}>#{myRank}</span>
          </div>
        )}
      </div>

      {/* ── Sort tabs ─────────────────────────────────────────────── */}
      <div className={styles.sortRow}>
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.key}
            className={`${styles.sortBtn} ${sortKey === opt.key ? styles.sortActive : ''}`}
            onClick={() => setSortKey(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Top 3 podium ──────────────────────────────────────────── */}
      {players.length >= 3 && (
        <div className={styles.podium}>
          {[players[1], players[0], players[2]].map((p, podiumIdx) => {
            const realIdx = podiumIdx === 0 ? 1 : podiumIdx === 1 ? 0 : 2;
            const heights = [80, 110, 60];
            return (
              <div
                key={p.id}
                className={`${styles.podiumSlot} ${p.id === currentUser ? styles.podiumSelf : ''}`}
                style={{ height: heights[podiumIdx] }}
              >
                <div className={styles.podiumAvatar}>
                  {p.displayName[0].toUpperCase()}
                </div>
                <div className={styles.podiumName}>{p.displayName}</div>
                <div className={styles.podiumMedal}>{MEDALS[realIdx]}</div>
                <div className={styles.podiumXP}>{p.xp.toLocaleString()} XP</div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Full rankings ─────────────────────────────────────────── */}
      <div className={styles.list}>
        {players.map((p, i) => {
          const isSelf = p.id === currentUser;
          const isTop3 = i < 3;
          return (
            <div
              key={p.id}
              className={`${styles.row} ${isSelf ? styles.selfRow : ''} ${isTop3 ? styles.topRow : ''}`}
            >
              {/* Rank */}
              <div className={styles.rankCell}>
                {i < 3
                  ? <span className={styles.medal}>{MEDALS[i]}</span>
                  : <span className={`${styles.rankNum} mono`}>#{i + 1}</span>
                }
              </div>

              {/* Avatar + name */}
              <div
                className={styles.avatarWrap}
                style={{ background: `linear-gradient(135deg, ${p.rank.icon === '👑' ? '#facc15' : '#5b4fcf'}, #7c3aed)` }}
              >
                {p.displayName[0].toUpperCase()}
              </div>

              <div className={styles.nameCol}>
                <span className={styles.displayName}>
                  {p.displayName}
                  {isSelf && <span className={styles.youTag}>You</span>}
                </span>
                <span className={styles.rankLabel}>{p.rank.icon} {p.rank.label}</span>
              </div>

              {/* Stats */}
              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <span className={`${styles.statVal} mono`} style={{ color: '#facc15' }}>
                    {p.xp.toLocaleString()}
                  </span>
                  <span className={styles.statLbl}>XP</span>
                </div>
                <div className={styles.stat}>
                  <span className={`${styles.statVal} mono`}>{p.totalQuizzes}</span>
                  <span className={styles.statLbl}>Quizzes</span>
                </div>
                <div className={styles.stat}>
                  <span className={`${styles.statVal} mono`}>{p.badges}</span>
                  <span className={styles.statLbl}>Badges</span>
                </div>
                <div className={styles.stat}>
                  <span className={`${styles.statVal} mono`}>{p.streak}🔥</span>
                  <span className={styles.statLbl}>Streak</span>
                </div>
              </div>

              {/* Subject dots */}
              <div className={styles.subjectDots}>
                {Object.entries(SUBJECT_META).map(([sub, meta]) => (
                  <span
                    key={sub}
                    className={styles.subDot}
                    title={`${meta.label}: ${p.subjectCount[sub] || 0} quizzes`}
                    style={{
                      background: (p.subjectCount[sub] || 0) > 0 ? meta.color : 'var(--bg-overlay)',
                      boxShadow:  (p.subjectCount[sub] || 0) > 0 ? `0 0 6px ${meta.color}80` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {players.length === 0 && (
          <div className={styles.empty}>No players yet. Be the first!</div>
        )}
      </div>
    </PageShell>
  );
}
