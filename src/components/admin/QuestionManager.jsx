import { useState } from 'react';
import { SUBJECTS, LEVELS, SUBJECT_META, LEVEL_META } from '../../data/constants';
import { useStore } from '../../context/StoreContext';
import { useNotification } from '../../context/NotificationContext';
import { SubjectBadge, LevelBadge } from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import styles from './QuestionManager.module.css';

const EMPTY_Q = {
  subject: 'math', level: 'medium',
  q: '', opts: ['', '', '', ''], ans: 0,
};

export default function QuestionManager() {
  const { store, persist } = useStore();
  const { notify }         = useNotification();
  const [form, setForm]    = useState(EMPTY_Q);

  function setField(k, v) { setForm(p => ({ ...p, [k]: v })); }

  function setOpt(i, v) {
    const opts = [...form.opts];
    opts[i] = v;
    setForm(p => ({ ...p, opts }));
  }

  function handleAdd() {
    if (!form.q.trim())                 return notify('Question text required', 'error');
    if (form.opts.some(o => !o.trim())) return notify('All 4 options required', 'error');

    const q = { ...form, id: `cq_${Date.now()}` };
    persist(s => ({ ...s, customQuestions: [...(s.customQuestions || []), q] }));
    notify('Question added ✓');
    setForm(EMPTY_Q);
  }

  function handleDelete(id) {
    persist(s => ({ ...s, customQuestions: s.customQuestions.filter(q => q.id !== id) }));
    notify('Question deleted', 'info');
  }

  const sel = { padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer', width: '100%' };
  const inp = { width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit' };

  return (
    <div className={styles.wrapper}>
      {/* ── Form ───────────────────────────────────────────────────── */}
      <Card elevated className={styles.formCard}>
        <h3 className={styles.title}>Add Custom Question</h3>

        <div className={styles.row}>
          <div>
            <label className={styles.label}>Subject</label>
            <select style={sel} value={form.subject} onChange={e => setField('subject', e.target.value)}>
              {SUBJECTS.map(s => <option key={s} value={s}>{SUBJECT_META[s].label}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.label}>Difficulty</label>
            <select style={sel} value={form.level} onChange={e => setField('level', e.target.value)}>
              {LEVELS.map(l => <option key={l} value={l}>{LEVEL_META[l].label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={styles.label}>Question Text</label>
          <textarea
            className={styles.textarea}
            placeholder="Enter your question..."
            value={form.q}
            onChange={e => setField('q', e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label className={styles.label}>Options (select correct answer)</label>
          <div className={styles.optList}>
            {form.opts.map((opt, i) => (
              <label key={i} className={`${styles.optRow} ${form.ans === i ? styles.optSelected : ''}`}>
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={form.ans === i}
                  onChange={() => setField('ans', i)}
                  className={styles.radio}
                />
                <span className={styles.optLetter}>{String.fromCharCode(65 + i)}</span>
                <input
                  style={{ ...inp, flex: 1 }}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  value={opt}
                  onChange={e => setOpt(i, e.target.value)}
                />
              </label>
            ))}
          </div>
          <p className={styles.hint}>Radio button = correct answer</p>
        </div>

        <Button variant="success" full onClick={handleAdd}>+ Add Question</Button>
      </Card>

      {/* ── List ───────────────────────────────────────────────────── */}
      <div className={styles.listCol}>
        <h3 className={styles.title}>
          Custom Questions <span className={styles.count}>({(store.customQuestions || []).length})</span>
        </h3>

        {(store.customQuestions || []).length === 0 ? (
          <div className={styles.empty}>No custom questions yet.</div>
        ) : (
          <div className={styles.qList}>
            {(store.customQuestions || []).map(q => (
              <Card key={q.id} className={styles.qCard}>
                <div className={styles.qTop}>
                  <p className={styles.qText}>{q.q}</p>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(q.id)}>✕</Button>
                </div>
                <div className={styles.qOpts}>
                  {q.opts.map((o, i) => (
                    <span key={i} className={`${styles.qOpt} ${i === q.ans ? styles.qOptCorrect : ''}`}>
                      {String.fromCharCode(65 + i)}. {o}
                    </span>
                  ))}
                </div>
                <div className={styles.qMeta}>
                  <SubjectBadge subject={q.subject} />
                  <LevelBadge level={q.level} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
