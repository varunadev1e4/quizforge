import { useMemo, useRef, useState } from 'react';
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

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function normalizeQuestion(raw, fallbackIdPrefix = 'cq') {
  if (!raw || typeof raw !== 'object') return null;
  const opts = Array.isArray(raw.opts) ? raw.opts.slice(0, 4) : [];
  if (opts.length !== 4) return null;

  const subject = SUBJECTS.includes(raw.subject) ? raw.subject : null;
  const level = LEVELS.includes(raw.level) ? raw.level : null;
  const questionText = typeof raw.q === 'string' ? raw.q.trim() : '';
  const ans = Number(raw.ans);

  if (!subject || !level || !questionText || opts.some(opt => typeof opt !== 'string' || !opt.trim())) return null;
  if (!Number.isInteger(ans) || ans < 0 || ans > 3) return null;

  return {
    id: raw.id || `${fallbackIdPrefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    subject,
    level,
    q: questionText,
    opts: opts.map(opt => opt.trim()),
    ans,
  };
}


function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsvQuestions(csvText) {
  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const [header, ...rows] = lines;
  const expected = ['subject', 'level', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'answer_index'];
  const normalizedHeader = parseCsvLine(header).map(v => v.trim().toLowerCase());
  const isMatchingHeader = expected.every((col, i) => normalizedHeader[i] === col);
  const dataRows = isMatchingHeader ? rows : lines;

  return dataRows.map((line, i) => {
    const parts = parseCsvLine(line);
    if (parts.length < 8) return null;
    return normalizeQuestion({
      id: `cq_csv_${Date.now()}_${i}`,
      subject: parts[0],
      level: parts[1],
      q: parts[2],
      opts: parts.slice(3, 7),
      ans: Number(parts[7]),
    }, 'cq_csv');
  }).filter(Boolean);
}

export default function QuestionManager() {
  const { store, persist } = useStore();
  const { notify } = useNotification();
  const [form, setForm] = useState(EMPTY_Q);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const fileRef = useRef(null);

  function setField(k, v) { setForm(p => ({ ...p, [k]: v })); }

  function setOpt(i, v) {
    const opts = [...form.opts];
    opts[i] = v;
    setForm(p => ({ ...p, opts }));
  }

  function handleAdd() {
    if (!form.q.trim()) return notify('Question text required', 'error');
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

  function handleExportJson() {
    const payload = JSON.stringify(store.customQuestions || [], null, 2);
    downloadFile('quizforge-questions.json', payload, 'application/json');
    notify('Exported questions as JSON');
  }

  function handleExportCsv() {
    const header = 'subject,level,question,option_a,option_b,option_c,option_d,answer_index';
    const rows = (store.customQuestions || []).map(q => {
      const escaped = [q.subject, q.level, q.q, ...q.opts, q.ans]
        .map(value => `"${String(value).replaceAll('"', '""')}"`)
        .join(',');
      return escaped;
    });
    downloadFile('quizforge-questions.csv', [header, ...rows].join('\n'), 'text/csv');
    notify('Exported questions as CSV');
  }

  function handleImportClick() {
    fileRef.current?.click();
  }

  async function handleImportChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const text = await file.text();
      const isJson = file.name.toLowerCase().endsWith('.json');
      const imported = isJson
        ? (JSON.parse(text) || []).map((q, i) => normalizeQuestion({ ...q, id: q.id || `cq_json_${Date.now()}_${i}` }, 'cq_json')).filter(Boolean)
        : parseCsvQuestions(text);

      if (!imported.length) {
        notify('No valid questions found in file', 'error');
        return;
      }

      persist(s => ({ ...s, customQuestions: [...(s.customQuestions || []), ...imported] }));
      notify(`Imported ${imported.length} question(s)`);
    } catch {
      notify('Failed to import questions. Check file format.', 'error');
    }
  }

  const questionStats = store.questionStats || {};
  const enrichedQuestions = useMemo(() => {
    return (store.customQuestions || []).map(q => {
      const key = `${q.subject}|${q.level}|${q.q}`;
      const stats = questionStats[key] || { attempts: 0, misses: 0, totalResponseTime: 0 };
      const missRate = stats.attempts ? Math.round((stats.misses / stats.attempts) * 100) : 0;
      const avgResponse = stats.attempts ? (stats.totalResponseTime / stats.attempts).toFixed(1) : '0.0';
      return { ...q, stats, missRate, avgResponse };
    });
  }, [store.customQuestions, questionStats]);

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return enrichedQuestions.filter(q => {
      const matchesSearch = !normalizedSearch
        || q.q.toLowerCase().includes(normalizedSearch)
        || q.opts.some(opt => opt.toLowerCase().includes(normalizedSearch));
      const matchesSubject = subjectFilter === 'all' || q.subject === subjectFilter;
      const matchesLevel = levelFilter === 'all' || q.level === levelFilter;
      return matchesSearch && matchesSubject && matchesLevel;
    });
  }, [enrichedQuestions, levelFilter, searchTerm, subjectFilter]);

  const sel = { padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer', width: '100%' };
  const inp = { width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit' };

  return (
    <div className={styles.wrapper}>
      <Card elevated className={styles.formCard}>
        <h3 className={styles.title}>Add Custom Question</h3>

        <div className={styles.actions}>
          <Button size="sm" variant="secondary" onClick={handleExportJson}>Export JSON</Button>
          <Button size="sm" variant="secondary" onClick={handleExportCsv}>Export CSV</Button>
          <Button size="sm" variant="primary" onClick={handleImportClick}>Import CSV/JSON</Button>
          <input ref={fileRef} className={styles.hiddenInput} type="file" accept=".csv,.json" onChange={handleImportChange} />
        </div>

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
          <textarea className={styles.textarea} placeholder="Enter your question..." value={form.q} onChange={e => setField('q', e.target.value)} rows={3} />
        </div>

        <div>
          <label className={styles.label}>Options (select correct answer)</label>
          <div className={styles.optList}>
            {form.opts.map((opt, i) => (
              <label key={i} className={`${styles.optRow} ${form.ans === i ? styles.optSelected : ''}`}>
                <input type="radio" name="correctAnswer" checked={form.ans === i} onChange={() => setField('ans', i)} className={styles.radio} />
                <span className={styles.optLetter}>{String.fromCharCode(65 + i)}</span>
                <input style={{ ...inp, flex: 1 }} placeholder={`Option ${String.fromCharCode(65 + i)}`} value={opt} onChange={e => setOpt(i, e.target.value)} />
              </label>
            ))}
          </div>
          <p className={styles.hint}>Radio button = correct answer</p>
        </div>

        <Button variant="success" full onClick={handleAdd}>+ Add Question</Button>
      </Card>

      <div className={styles.listCol}>
        <h3 className={styles.title}>
          Custom Questions <span className={styles.count}>({enrichedQuestions.length})</span>
        </h3>

        <div className={styles.filterBar}>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search by question text or option..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select className={styles.filterSelect} value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
            <option value="all">All subjects</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{SUBJECT_META[s].label}</option>)}
          </select>
          <select className={styles.filterSelect} value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
            <option value="all">All levels</option>
            {LEVELS.map(l => <option key={l} value={l}>{LEVEL_META[l].label}</option>)}
          </select>
        </div>

        {enrichedQuestions.length === 0 ? (
          <div className={styles.empty}>No custom questions yet.</div>
        ) : filteredQuestions.length === 0 ? (
          <div className={styles.empty}>No questions match your current filters.</div>
        ) : (
          <div className={styles.qList}>
            {filteredQuestions.map(q => (
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
                <div className={styles.metricsRow}>
                  <span className={styles.metric}>Miss rate: <strong>{q.missRate}%</strong></span>
                  <span className={styles.metric}>Avg response: <strong>{q.avgResponse}s</strong></span>
                  <span className={styles.metric}>Attempts: <strong>{q.stats.attempts || 0}</strong></span>
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
