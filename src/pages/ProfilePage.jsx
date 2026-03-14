import { useAuth }  from '../context/AuthContext';
import { getRank, SUBJECT_META, LEVELS, LEVEL_META } from '../data/constants';
import { BADGES }   from '../data/badges';
import XPBar        from '../components/gamification/XPBar';
import BadgeGrid    from '../components/gamification/BadgeGrid';
import Card         from '../components/ui/Card';
import PageShell    from '../components/layout/PageShell';
import styles       from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, currentUser } = useAuth();
  if (!user) return null;

  const rank         = getRank(user.xp || 0);
  const earnedBadges = user.badges || [];
  const history      = user.history || [];

  // ── Per-subject stats ───────────────────────────────────────────────────
  const subjectStats = Object.entries(SUBJECT_META).map(([sub, meta]) => {
    const subHistory = history.filter(h => h.subject === sub);
    const avgScore   = subHistory.length
      ? Math.round(subHistory.reduce((a, b) => a + b.score, 0) / subHistory.length)
      : null;
    return {
      sub, meta,
      count: subHistory.length,
      avgScore,
      bestScore: subHistory.length ? Math.max(...subHistory.map(h => h.score)) : null,
    };
  });

  // ── Per-level stats ─────────────────────────────────────────────────────
  const levelStats = LEVELS.map(lv => ({
    lv,
    meta:  LEVEL_META[lv],
    count: history.filter(h => h.level === lv).length,
  }));

  // ── Best scores ─────────────────────────────────────────────────────────
  const recentPerfect = history.filter(h => h.score === 100).length;

  return (
    <PageShell>
      {/* ── Hero banner ───────────────────────────────────────────── */}
      <div className={`${styles.hero} anim-fade-up`}>
        <div className={styles.heroLeft}>
          <div className={styles.bigAvatar}>
            {(user.displayName || currentUser)[0].toUpperCase()}
          </div>
          <div>
            <h1 className={styles.name}>{user.displayName || currentUser}</h1>
            <p className={styles.username}>@{currentUser}</p>
            <div className={styles.rankRow}>
              <span className={styles.rankIcon}>{rank.icon}</span>
              <span className={styles.rankLabel}>{rank.label}</span>
              {user.role === 'admin' && <span className={styles.adminTag}>Admin</span>}
            </div>
          </div>
        </div>

        <div className={styles.heroStats}>
          {[
            { v: (user.xp || 0).toLocaleString(), l: 'Total XP',   c: '#facc15' },
            { v: user.totalQuizzes || 0,          l: 'Quizzes',     c: '#38bdf8' },
            { v: `${user.streak || 0}🔥`,          l: 'Day Streak',  c: '#fb923c' },
            { v: `${user.bestScore || 0}%`,        l: 'Best Score',  c: '#4ade80' },
            { v: recentPerfect,                    l: 'Perfect Scores', c: '#f472b6' },
          ].map(s => (
            <div key={s.l} className={styles.heroStat}>
              <span className={styles.heroStatVal} style={{ color: s.c }}>{s.v}</span>
              <span className={styles.heroStatLbl}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── XP progress ───────────────────────────────────────────── */}
      <div className={`anim-fade-up`} style={{ animationDelay: '80ms', marginBottom: 28 }}>
        <XPBar xp={user.xp || 0} />
      </div>

      {/* ── Subject breakdown ─────────────────────────────────────── */}
      <Card elevated className={`${styles.section} anim-fade-up`} style={{ animationDelay: '140ms' }}>
        <h3 className={styles.sectionTitle}>Subject Breakdown</h3>
        <div className={styles.subjectGrid}>
          {subjectStats.map(({ sub, meta, count, avgScore, bestScore }) => (
            <div key={sub} className={styles.subjectCard} style={{ borderColor: `${meta.color}30` }}>
              <div className={styles.subjectTop} style={{ background: meta.gradient }}>
                <span className={styles.subjectIcon}>{meta.icon}</span>
                <span className={styles.subjectName}>{meta.label}</span>
              </div>
              <div className={styles.subjectBody}>
                <div className={styles.subjectStat}>
                  <span className={styles.subjectStatVal} style={{ color: meta.color }}>{count}</span>
                  <span className={styles.subjectStatLbl}>Quizzes</span>
                </div>
                <div className={styles.subjectStat}>
                  <span className={styles.subjectStatVal}>{avgScore !== null ? `${avgScore}%` : '—'}</span>
                  <span className={styles.subjectStatLbl}>Avg Score</span>
                </div>
                <div className={styles.subjectStat}>
                  <span className={styles.subjectStatVal}>{bestScore !== null ? `${bestScore}%` : '—'}</span>
                  <span className={styles.subjectStatLbl}>Best</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Level breakdown ───────────────────────────────────────── */}
      <Card elevated className={`${styles.section} anim-fade-up`} style={{ animationDelay: '200ms' }}>
        <h3 className={styles.sectionTitle}>Difficulty Progress</h3>
        <div className={styles.levelGrid}>
          {levelStats.map(({ lv, meta, count }) => (
            <div key={lv} className={styles.levelRow}>
              <span className={styles.levelName} style={{ color: meta.color }}>{meta.label}</span>
              <div className={styles.levelBarTrack}>
                <div
                  className={styles.levelBarFill}
                  style={{
                    width: `${Math.min(100, (count / Math.max(1, user.totalQuizzes || 1)) * 100 * 3)}%`,
                    background: meta.color,
                    boxShadow: `0 0 8px ${meta.color}60`,
                  }}
                />
              </div>
              <span className={styles.levelCount}>{count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Badges ────────────────────────────────────────────────── */}
      <Card elevated className={`${styles.section} anim-fade-up`} style={{ animationDelay: '260ms' }}>
        <div className={styles.badgesHeader}>
          <h3 className={styles.sectionTitle}>Badges</h3>
          <span className={styles.badgeCount}>{earnedBadges.length} / {BADGES.length} unlocked</span>
        </div>
        <BadgeGrid earned={earnedBadges} />
      </Card>
    </PageShell>
  );
}
