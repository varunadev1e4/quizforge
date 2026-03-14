import { useStore } from '../context/StoreContext';
import { SUBJECT_META, LEVEL_META } from '../data/constants';
import { SubjectBadge, LevelBadge } from '../components/ui/Badge';
import Button    from '../components/ui/Button';
import PageShell from '../components/layout/PageShell';
import styles    from './ChallengesPage.module.css';

export default function ChallengesPage({ onStartQuiz }) {
  const { store } = useStore();
  const challenges = store.challenges || [];

  return (
    <PageShell>
      <div className={styles.header}>
        <h1 className={styles.title}>⚡ Challenges</h1>
        <p className={styles.subtitle}>
          Take on admin-curated challenges and prove your knowledge.
        </p>
      </div>

      {challenges.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>⚡</div>
          <h3 className={styles.emptyTitle}>No Active Challenges</h3>
          <p className={styles.emptyText}>
            Challenges are created by your admin. Check back soon!
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {challenges.map((ch, i) => {
            const subMeta = SUBJECT_META[ch.subject];
            const lvlMeta = LEVEL_META[ch.level];
            return (
              <div
                key={ch.id || i}
                className={`${styles.card} anim-fade-up`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Coloured top strip */}
                <div
                  className={styles.strip}
                  style={{ background: `linear-gradient(90deg, ${subMeta.color}80, ${lvlMeta.color}60)` }}
                />

                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardIcon}>{subMeta.icon}</span>
                    <div className={styles.badges}>
                      <SubjectBadge subject={ch.subject} size="sm" />
                      <LevelBadge   level={ch.level}   size="sm" />
                    </div>
                  </div>

                  <h3 className={styles.cardTitle}>{ch.title}</h3>

                  {ch.description && (
                    <p className={styles.cardDesc}>{ch.description}</p>
                  )}

                  <div className={styles.cardFooter}>
                    <span className={styles.cardDate}>{ch.createdAt}</span>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => onStartQuiz(ch.subject, ch.level)}
                    >
                      Accept →
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
