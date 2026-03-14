import { useState } from 'react';
import { useStore }  from '../context/StoreContext';
import StatCard      from '../components/ui/StatCard';
import ChallengeManager from '../components/admin/ChallengeManager';
import QuestionManager  from '../components/admin/QuestionManager';
import UserManager      from '../components/admin/UserManager';
import PageShell from '../components/layout/PageShell';
import styles    from './AdminPage.module.css';

const TABS = [
  { id: 'overview',   icon: '📊', label: 'Overview'   },
  { id: 'challenges', icon: '⚡', label: 'Challenges' },
  { id: 'questions',  icon: '❓', label: 'Questions'  },
  { id: 'users',      icon: '👥', label: 'Users'      },
];

export default function AdminPage() {
  const { store }   = useStore();
  const [tab, setTab] = useState('overview');

  const totalUsers   = Object.keys(store.users).length;
  const totalQuizzes = Object.values(store.users).reduce((a, u) => a + (u.totalQuizzes || 0), 0);
  const totalXP      = Object.values(store.users).reduce((a, u) => a + (u.xp || 0), 0);

  const activeChallenges = (store.challenges || []).filter(ch => {
    if (typeof ch.endsAt !== 'number') return true;
    return ch.endsAt >= Date.now();
  }).length;

  // Recent activity feed from all users
  const recentActivity = Object.entries(store.users)
    .flatMap(([id, u]) =>
      (u.history || []).slice(0, 3).map(h => ({ ...h, userId: id, displayName: u.displayName || id }))
    )
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 12);

  return (
    <PageShell maxWidth={1100}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>⚙ Admin Panel</h1>
        <p className={styles.pageSubtitle}>Manage your QuizForge platform</p>
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────── */}
      <div className={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tabBtn} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Overview ──────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className={`${styles.tabContent} anim-fade-up`}>
          <div className={styles.statsGrid}>
            <StatCard icon="👥" value={totalUsers}                   label="Total Users"         color="#38bdf8" delay={0}   />
            <StatCard icon="📝" value={totalQuizzes}                 label="Total Quizzes Taken"  color="#4ade80" delay={60}  />
            <StatCard icon="❓" value={(store.customQuestions||[]).length} label="Custom Questions" color="#facc15" delay={120} />
            <StatCard icon="⚡" value={activeChallenges} label="Active Challenges"   color="#f472b6" delay={180} />
            <StatCard icon="⭐" value={totalXP.toLocaleString()}     label="Total XP Earned"     color="#a78bfa" delay={240} />
          </div>

          <div className={styles.activitySection}>
            <h3 className={styles.sectionTitle}>Recent Activity</h3>
            {recentActivity.length === 0 ? (
              <div className={styles.emptyNote}>No quiz activity yet.</div>
            ) : (
              <div className={styles.activityList}>
                {recentActivity.map((h, i) => (
                  <div key={i} className={styles.activityRow}>
                    <div className={styles.activityLeft}>
                      <span className={styles.activityUser}>{h.displayName}</span>
                      <span className={styles.activityDetail}>
                        completed <span style={{ textTransform: 'capitalize' }}>{h.subject}</span> · {h.level}
                      </span>
                    </div>
                    <div className={styles.activityRight}>
                      <span
                        className={styles.activityScore}
                        style={{ color: h.score >= 80 ? '#4ade80' : h.score >= 60 ? '#facc15' : '#f87171' }}
                      >
                        {h.score}%
                      </span>
                      <span className={styles.activityXP}>+{h.xpEarned} XP</span>
                      <span className={styles.activityDate}>{h.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'challenges' && (
        <div className={`${styles.tabContent} anim-fade-up`}>
          <ChallengeManager />
        </div>
      )}

      {tab === 'questions' && (
        <div className={`${styles.tabContent} anim-fade-up`}>
          <QuestionManager />
        </div>
      )}

      {tab === 'users' && (
        <div className={`${styles.tabContent} anim-fade-up`}>
          <UserManager />
        </div>
      )}
    </PageShell>
  );
}
