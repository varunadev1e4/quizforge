import { useState } from 'react';
import { SUBJECTS, LEVELS, SUBJECT_META, LEVEL_META } from '../../data/constants';
import { useStore } from '../../context/StoreContext';
import { useNotification } from '../../context/NotificationContext';
import { SubjectBadge, LevelBadge } from '../ui/Badge';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import styles from './ChallengeManager.module.css';

const EMPTY = { title: '', description: '', subject: 'math', level: 'medium' };

export default function ChallengeManager() {
  const { store, persist } = useStore();
  const { notify }         = useNotification();
  const [form, setForm]    = useState(EMPTY);

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); }

  function handleAdd() {
    if (!form.title.trim()) return notify('Title is required', 'error');
    const ch = { ...form, createdAt: new Date().toLocaleDateString(), id: `ch_${Date.now()}` };
    persist(s => ({ ...s, challenges: [...(s.challenges || []), ch] }));
    notify('Challenge created ⚡');
    setForm(EMPTY);
  }

  function handleDelete(id) {
    persist(s => ({ ...s, challenges: s.challenges.filter(c => c.id !== id) }));
    notify('Challenge deleted', 'info');
  }

  return (
    <div className={styles.wrapper}>
      {/* ── Create form ──────────────────────────────────────────────── */}
      <Card elevated className={styles.formCard}>
        <h3 className={styles.sectionTitle}>Create Challenge</h3>

        <Input
          label="Title"
          placeholder="e.g. Calculus Sprint"
          value={form.title}
          onChange={e => set('title', e.target.value)}
        />

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            placeholder="What's the challenge about?"
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={3}
          />
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

        <Button variant="primary" full onClick={handleAdd}>⚡ Create Challenge</Button>
      </Card>

      {/* ── Challenge list ───────────────────────────────────────────── */}
      <div className={styles.list}>
        <h3 className={styles.sectionTitle}>
          Active Challenges <span className={styles.count}>({(store.challenges || []).length})</span>
        </h3>

        {(store.challenges || []).length === 0 ? (
          <div className={styles.empty}>No challenges yet. Create one above!</div>
        ) : (
          <div className={styles.cards}>
            {(store.challenges || []).map(ch => (
              <Card key={ch.id} className={styles.chCard}>
                <div className={styles.chTop}>
                  <span className={styles.chTitle}>{ch.title}</span>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(ch.id)}>✕</Button>
                </div>
                {ch.description && <p className={styles.chDesc}>{ch.description}</p>}
                <div className={styles.chMeta}>
                  <SubjectBadge subject={ch.subject} />
                  <LevelBadge level={ch.level} />
                  <span className={styles.chDate}>{ch.createdAt}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
