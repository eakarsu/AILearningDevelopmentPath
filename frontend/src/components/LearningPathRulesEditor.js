import React, { useEffect, useState } from 'react';
import API from '../services/api';

function LearningPathRulesEditor() {
  const [rules, setRules] = useState([]);
  const [err, setErr] = useState(null);
  const [form, setForm] = useState({
    type: 'prerequisite',
    courseTitle: '',
    requires: '',
    role: '',
    trackTitle: '',
    notes: '',
  });

  const load = () => {
    API.get('/custom-views/learning-path-rules')
      .then(r => setRules(r.data.rules || []))
      .catch(e => setErr(e.response?.data?.error || e.message));
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      await API.post('/custom-views/learning-path-rules', form);
      setForm({ type: 'prerequisite', courseTitle: '', requires: '', role: '', trackTitle: '', notes: '' });
      load();
    } catch (e) { setErr(e.response?.data?.error || e.message); }
  };

  const update = async (id, patch) => {
    try {
      await API.put(`/custom-views/learning-path-rules/${id}`, patch);
      load();
    } catch (e) { setErr(e.response?.data?.error || e.message); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete rule?')) return;
    try {
      await API.delete(`/custom-views/learning-path-rules/${id}`);
      load();
    } catch (e) { setErr(e.response?.data?.error || e.message); }
  };

  return (
    <div className="card" style={{ padding: 16, marginBottom: 20 }}>
      <h3 style={{ marginTop: 0 }}>Learning Path Rules Editor</h3>
      <p style={{ color: '#555', marginTop: 0 }}>
        Manage course prerequisites and role-to-track mappings.
      </p>
      {err && <div style={{ color: 'red', marginBottom: 8 }}>Error: {err}</div>}

      <div style={{ background: '#f9fafb', padding: 12, borderRadius: 6, marginBottom: 16 }}>
        <strong>Add new rule</strong>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ padding: 6 }}>
            <option value="prerequisite">Prerequisite</option>
            <option value="role-mapping">Role Mapping</option>
          </select>
          {form.type === 'prerequisite' ? (
            <>
              <input placeholder="Course title" value={form.courseTitle} onChange={e => setForm({ ...form, courseTitle: e.target.value })} style={{ padding: 6 }} />
              <input placeholder="Requires" value={form.requires} onChange={e => setForm({ ...form, requires: e.target.value })} style={{ padding: 6 }} />
            </>
          ) : (
            <>
              <input placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ padding: 6 }} />
              <input placeholder="Track title" value={form.trackTitle} onChange={e => setForm({ ...form, trackTitle: e.target.value })} style={{ padding: 6 }} />
            </>
          )}
          <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ padding: 6, flex: 1, minWidth: 160 }} />
          <button className="btn btn-primary" onClick={create}>Add</button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ padding: 8, textAlign: 'left' }}>Type</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Subject</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Target / Requires</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Notes</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map(r => (
            <tr key={r.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: 8 }}>{r.type}</td>
              <td style={{ padding: 8 }}>{r.type === 'prerequisite' ? r.courseTitle : r.role}</td>
              <td style={{ padding: 8 }}>{r.type === 'prerequisite' ? r.requires : r.trackTitle}</td>
              <td style={{ padding: 8 }}>
                <input
                  defaultValue={r.notes || ''}
                  onBlur={e => { if (e.target.value !== (r.notes || '')) update(r.id, { notes: e.target.value }); }}
                  style={{ width: '100%', padding: 4 }}
                />
              </td>
              <td style={{ padding: 8, textAlign: 'center' }}>
                <button className="btn btn-sm btn-secondary" onClick={() => remove(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {!rules.length && <tr><td colSpan={5} style={{ padding: 12, textAlign: 'center', color: '#888' }}>No rules yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default LearningPathRulesEditor;
