import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SUBJECTS, LEVELS, SUBJECT_META, LEVEL_META, getSubtopicLabel } from '../data/constants';
import { SubjectBadge, LevelBadge } from '../components/ui/Badge';
import StatCard   from '../components/ui/StatCard';
import Card       from '../components/ui/Card';
import PageShell  from '../components/layout/PageShell';
import styles     from './HistoryPage.module.css';

export default function HistoryPage() {
  const { user } = useAuth();
  const history  = user?.history || [];

  const [subjectFilter, setSubjectFilter] = useState('all');
  const [levelFilter,   setLevelFilter]   = useState('all');
  const [sortBy,        setSortBy]        = useState('date');

  // ── Derived stats ────────────────────────────────────────────────────────
  const avgScore  = history.length
    ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length)
    : 0;
  const bestScore = history.length ? Math.max(...history.map(h => h.score)) : 0;
  const totalXP   = history.reduce((a, b) => a + (b.xpEarned || 0), 0);

  // ── Filtered + sorted list ───────────────────────────────────────────────
  let filtered = [...history];
  if (subjectFilter !== 'all') filtered = filtered.filter(h => h.subject === subjectFilter);
  if (levelFilter   !== 'all') filtered = filtered.filter(h => h.level   === levelFilter);

  if (sortBy === 'score') filtered.sort((a, b) => b.score - a.score);
  else if (sortBy === 'xp') filtered.sort((a, b) => b.xpEarned - a.xpEarned);
  else filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  // ── Score distribution chart data ────────────────────────────────────────
  const bands = [
    { label: '0–39%',  color: '#ef4444', count: history.filter(h => h.score < 40).length },
    { label: '40–59%', color: '#fb923c', count: history.filter(h => h.score >= 40 && h.score < 60).length },
    { label: '60–79%', color: '#facc15', count: history.filter(h => h.score >= 60 && h.score < 80).length },
    { label: '80–99%', color: '#4ade80', count: history.filter(h => h.score >= 80 && h.score < 100).length },
    { label: '100%',   color: '#a78bfa', count: history.filter(h => h.score === 100).length },
  ];
  const maxBand = Math.max(...bands.map(b => b.count), 1);

  return (
    <PageShell>
      <h1 className={styles.pageTitle}>Quiz History</h1>

      {/* ── Summary stats ─────────────────────────────────────────── */}
      <div className={styles.statsGrid}>
        <StatCard icon="📊" value={`${avgScore}%`}           label="Average Score"  color="#38bdf8" delay={0}   />
        <StatCard icon="🌟" value={`${bestScore}%`}          label="Best Score"     color="#facc15" delay={60}  />
        <StatCard icon="⭐" value={totalXP.toLocaleString()} label="XP from History" color="#a78bfa" delay={120} />
        <StatCard icon="📝" value={history.length}           label="Total Quizzes"  color="#4ade80" delay={180} />
      </div>

      {/* ── Score distribution ────────────────────────────────────── */}
      {history.length > 0 && (
        <Card elevated className={`${styles.chartCard} anim-fade-up`} style={{ animationDelay: '200ms' }}>
          <h3 className={styles.chartTitle}>Score Distribution</h3>
          <div className={styles.bars}>
            {bands.map(b => (
              <div key={b.label} className={styles.barCol}>
                <div className={styles.barWrap}>
                  <div
                    className={styles.barFill}
                    style={{
                      height: `${(b.count / maxBand) * 100}%`,
                      background: b.color,
                      boxShadow: `0 0 12px ${b.color}60`,
                    }}
                  />
                </div>
                <span className={styles.barCount}>{b.count}</span>
                <span className={styles.barLabel}>{b.label}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Filters ───────────────────────────────────────────────── */}
      <div className={`${styles.filters} anim-fade-up`} style={{ animationDelay: '260ms' }}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Subject</span>
          <div className={styles.filterPills}>
            {['all', ...SUBJECTS].map(s => (
              <button
                key={s}
                className={`${styles.pill} ${subjectFilter === s ? styles.pillActive : ''}`}
                style={subjectFilter === s && s !== 'all'
                  ? { borderColor: SUBJECT_META[s].color, color: SUBJECT_META[s].color, background: `${SUBJECT_META[s].color}15` }
                  : {}
                }
                onClick={() => setSubjectFilter(s)}
              >
                {s === 'all' ? 'All' : `${SUBJECT_META[s].icon} ${SUBJECT_META[s].label}`}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Level</span>
          <div className={styles.filterPills}>
            {['all', ...LEVELS].map(l => (
              <button
                key={l}
                className={`${styles.pill} ${levelFilter === l ? styles.pillActive : ''}`}
                style={levelFilter === l && l !== 'all'
                  ? { borderColor: LEVEL_META[l].color, color: LEVEL_META[l].color, background: `${LEVEL_META[l].color}15` }
                  : {}
                }
                onClick={() => setLevelFilter(l)}
              >
                {l === 'all' ? 'All' : LEVEL_META[l].label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Sort by</span>
          <div className={styles.filterPills}>
            {[['date', 'Latest'], ['score', 'Score'], ['xp', 'XP']].map(([v, lbl]) => (
              <button
                key={v}
                className={`${styles.pill} ${sortBy === v ? styles.pillActiveDefault : ''}`}
                onClick={() => setSortBy(v)}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results list ──────────────────────────────────────────── */}
      <div className={`${styles.list} anim-fade-up`} style={{ animationDelay: '300ms' }}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📭</span>
            <p>{history.length === 0 ? 'No quizzes yet. Start your first quiz!' : 'No results match your filters.'}</p>
          </div>
        ) : (
          filtered.map((h, i) => {
            const scoreColor = h.score >= 80 ? '#4ade80' : h.score >= 60 ? '#facc15' : '#f87171';
            return (
              <div key={h.id || i} className={styles.row}>
                <span className={styles.rowIcon}>{SUBJECT_META[h.subject]?.icon}</span>
                <div className={styles.rowMain}>
                  <div className={styles.rowTop}>
                    <SubjectBadge subject={h.subject} />
                    <LevelBadge   level={h.level} />
                    {h.subtopic && h.subtopic !== 'all' && <span className={styles.topicChip}>{getSubtopicLabel(h.subtopic)}</span>}
                  </div>
                  <div className={styles.rowMeta}>
                    {h.correct}/{h.total} correct
                    &nbsp;·&nbsp; {h.timeTaken}s
                    &nbsp;·&nbsp; <span style={{ color: '#facc15' }}>+{h.xpEarned} XP</span>
                    &nbsp;·&nbsp; {h.date}
                  </div>
                </div>
                <div className={styles.rowScore} style={{ color: scoreColor }}>
                  {h.score}%
                </div>
              </div>
            );
          })
        )}
      </div>
    </PageShell>
  );
}
