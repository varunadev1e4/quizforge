import { useMemo, useState } from 'react';
import { SUBJECTS, LEVELS, SUBJECT_META, LEVEL_META } from '../../data/constants';
import { useStore } from '../../context/StoreContext';
import { useNotification } from '../../context/NotificationContext';
import { SubjectBadge, LevelBadge } from '../ui/Badge';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import styles from './ChallengeManager.module.css';

const EMPTY = {
  title: '',
  description: '',
  subject: 'math',
  level: 'medium',
  startsAt: '',
  endsAt: '',
};

function toTimestamp(value) {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

export default function ChallengeManager() {
  const { store, persist } = useStore();
  const { notify } = useNotification();
  const [form, setForm] = useState(EMPTY);

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); }

  function handleAdd() {
    if (!form.title.trim()) return notify('Title is required', 'error');

    const startsAt = toTimestamp(form.startsAt);
    const endsAt = toTimestamp(form.endsAt);
    if (startsAt && endsAt && endsAt <= startsAt) {
      return notify('End date must be after start date', 'error');
    }

    const createdAtTs = Date.now();
    const ch = {
      ...form,
      createdAt: new Date(createdAtTs).toLocaleDateString(),
      createdAtTs,
      startsAt,
      endsAt,
      id: `ch_${Date.now()}`,
    };

    persist(s => ({ ...s, challenges: [...(s.challenges || []), ch] }));
    notify('Challenge created ⚡');
    setForm(EMPTY);
  }

  function handleDelete(id) {
    persist(s => ({ ...s, challenges: s.challenges.filter(c => c.id !== id) }));
    notify('Challenge deleted', 'info');
  }

  const now = Date.now();
  const challenges = useMemo(() => {
    return (store.challenges || []).map(ch => {
      const startsAt = typeof ch.startsAt === 'number' ? ch.startsAt : null;
      const endsAt = typeof ch.endsAt === 'number' ? ch.endsAt : null;
      const expired = endsAt ? endsAt < now : false;
      const upcoming = startsAt ? startsAt > now : false;
      const active = !expired && !upcoming;
      return { ...ch, startsAt, endsAt, expired, active, upcoming };
    });
  }, [store.challenges, now]);

  const activeOrUpcoming = challenges.filter(ch => !ch.expired);

  return (
    <div className={styles.wrapper}>
      <Card elevated className={styles.formCard}>
        <h3 className={styles.sectionTitle}>Create Challenge</h3>

        <Input label="Title" placeholder="e.g. Calculus Sprint" value={form.title} onChange={e => set('title', e.target.value)} />

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} placeholder="What's the challenge about?" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Subject</label>
            <select className={styles.select} value={form.subject} onChange={e => set('subject', e.target.value)}>
              {SUBJECTS.map(s => <option key={s} value={s}>{SUBJECT_META[s].label}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Difficulty</label>
            <select className={styles.select} value={form.level} onChange={e => set('level', e.target.value)}>
              {LEVELS.map(l => <option key={l} value={l}>{LEVEL_META[l].label}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Start date (optional)</label>
            <input className={styles.select} type="datetime-local" value={form.startsAt} onChange={e => set('startsAt', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>End date (auto-expiry)</label>
            <input className={styles.select} type="datetime-local" value={form.endsAt} onChange={e => set('endsAt', e.target.value)} />
          </div>
        </div>

        <Button variant="primary" full onClick={handleAdd}>⚡ Create Challenge</Button>
      </Card>

      <div className={styles.list}>
        <h3 className={styles.sectionTitle}>
          Scheduled Challenges <span className={styles.count}>({activeOrUpcoming.length})</span>
        </h3>

        {activeOrUpcoming.length === 0 ? (
          <div className={styles.empty}>No scheduled challenges yet. Create one above!</div>
        ) : (
          <div className={styles.cards}>
            {activeOrUpcoming.map(ch => (
              <Card key={ch.id} className={styles.chCard}>
                <div className={styles.chTop}>
                  <span className={styles.chTitle}>{ch.title}</span>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(ch.id)}>✕</Button>
                </div>
                {ch.description && <p className={styles.chDesc}>{ch.description}</p>}
                <div className={styles.chMeta}>
                  <SubjectBadge subject={ch.subject} />
                  <LevelBadge level={ch.level} />
                  <span className={`${styles.statusBadge} ${ch.active ? styles.statusActive : styles.statusUpcoming}`}>
                    {ch.active ? 'Active' : 'Scheduled'}
                  </span>
                </div>
                <div className={styles.schedule}>
                  {ch.startsAt && <span>Starts: {new Date(ch.startsAt).toLocaleString()}</span>}
                  {ch.endsAt && <span>Ends: {new Date(ch.endsAt).toLocaleString()}</span>}
                  {!ch.startsAt && !ch.endsAt && <span>No schedule window</span>}
                </div>
                <div className={styles.chDate}>Created {ch.createdAt}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
