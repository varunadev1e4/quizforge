import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { getRank, getNextRank, SUBJECT_META } from '../data/constants';
import { BADGES } from '../data/badges';
import StatCard from '../components/ui/StatCard';
import SubjectSelector from '../components/quiz/SubjectSelector';
import XPBar from '../components/gamification/XPBar';
import { SubjectBadge, LevelBadge } from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageShell from '../components/layout/PageShell';
import { getPracticeRecommendation } from '../utils/recommendations';
import styles from './HomePage.module.css';

export default function HomePage({ onStartQuiz, setPage }) {
  const { user } = useAuth();
  const { store } = useStore();

  const recentHistory = (user?.history || []).slice(0, 5);
  const activeChallenges = (store.challenges || []).slice(0, 3);
  const recommended = getPracticeRecommendation(user?.history || []);

  return (
    <PageShell>
      {/* ── Stats row ──────────────────────────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard icon="⭐" value={(user?.xp || 0).toLocaleString()} label="Total XP"      color="#facc15" delay={0} />
        <StatCard icon="📝" value={user?.totalQuizzes || 0}          label="Quizzes Done"  color="#38bdf8" delay={60} />
        <StatCard icon="🔥" value={user?.streak || 0}                label="Day Streak"    color="#fb923c" delay={120} />
        <StatCard icon="🏅" value={(user?.badges || []).length}      label="Badges Earned" color="#a78bfa" delay={180} />
      </div>

      {/* ── XP progress ────────────────────────────────────────────── */}
      <div className={`${styles.xpSection} anim-fade-up`} style={{ animationDelay: '200ms' }}>
        <XPBar xp={user?.xp || 0} />
      </div>

      {/* ── Quiz selector ──────────────────────────────────────────── */}
      <section className={`${styles.section} anim-fade-up`} style={{ animationDelay: '260ms' }}>
        <SubjectSelector onStart={onStartQuiz} />
      </section>

      <Card elevated className={`${styles.panelCard} anim-fade-up`} style={{ animationDelay: '280ms' }}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>🧭 Smart Practice Recommendation</h3>
          <Button size="sm" variant="primary" onClick={() => onStartQuiz(recommended.subject, recommended.level)}>
            Start Recommended Quiz
          </Button>
        </div>
        <p className={styles.emptyNote}>Based on your recent attempts, this combo should improve retention fastest:</p>
        <div className={styles.challengeMeta}>
          <SubjectBadge subject={recommended.subject} />
          <LevelBadge level={recommended.level} />
        </div>
      </Card>

      {/* ── Bottom panels: recent history + active challenges ──────── */}
      <div className={styles.bottomGrid}>
        {/* Recent History */}
        <Card elevated className={`${styles.panelCard} anim-fade-up`} style={{ animationDelay: '320ms' }}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Recent Activity</h3>
            {recentHistory.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setPage('history')}>View All →</Button>
            )}
          </div>
          {recentHistory.length === 0 ? (
            <p className={styles.emptyNote}>Complete your first quiz to see history here.</p>
          ) : (
            <div className={styles.historyList}>
              {recentHistory.map((h, i) => {
                const color = h.score >= 80 ? '#4ade80' : h.score >= 60 ? '#facc15' : '#f87171';
                return (
                  <div key={i} className={styles.historyRow}>
                    <span className={styles.histIcon}>{SUBJECT_META[h.subject]?.icon}</span>
                    <div className={styles.histInfo}>
                      <span className={styles.histSubject}>{SUBJECT_META[h.subject]?.label}</span>
                      <span className={styles.histMeta}>{h.level} · {h.date}</span>
                    </div>
                    <span className={styles.histScore} style={{ color }}>{h.score}%</span>
                    <span className={styles.histXP}>+{h.xpEarned} XP</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Active Challenges */}
        <Card elevated className={`${styles.panelCard} anim-fade-up`} style={{ animationDelay: '380ms' }}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>⚡ Challenges</h3>
            {activeChallenges.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setPage('challenges')}>View All →</Button>
            )}
          </div>
          {activeChallenges.length === 0 ? (
            <p className={styles.emptyNote}>No active challenges. Check back soon!</p>
          ) : (
            <div className={styles.challengeList}>
              {activeChallenges.map((ch, i) => (
                <div key={i} className={styles.challengeRow} onClick={() => onStartQuiz(ch.subject, ch.level)}>
                  <div className={styles.challengeInfo}>
                    <span className={styles.challengeTitle}>{ch.title}</span>
                    <div className={styles.challengeMeta}>
                      <SubjectBadge subject={ch.subject} />
                      <LevelBadge level={ch.level} />
                    </div>
                  </div>
                  <span className={styles.challengeArrow}>→</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  );
}
