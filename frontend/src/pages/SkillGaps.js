import React, { useState, useEffect, useContext } from 'react';
import { getSkillGaps, createSkillGap, updateSkillGap, deleteSkillGap, getEmployees, aiSkillAnalysis } from '../services/api';
import { ToastContext } from '../App';
import Modal from '../components/Modal';
import AIResponse from '../components/AIResponse';
import ExportButton from '../components/ExportButton';

const emptyGap = { employeeId: '', skillName: '', currentLevel: 1, requiredLevel: 5, gapScore: 0, category: '', priority: 'Medium', recommendedAction: '', status: 'Identified' };

function SkillGaps() {
  const [gaps, setGaps] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyGap);
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const addToast = useContext(ToastContext);

  const load = async () => {
    try {
      const [g, e] = await Promise.all([getSkillGaps(), getEmployees()]);
      setGaps(g.data); setEmployees(e.data);
    } catch (e) { addToast('Failed to load', 'error'); }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      const gapScore = form.requiredLevel - form.currentLevel;
      const data = { ...form, gapScore };
      if (editMode) { await updateSkillGap(form.id, data); addToast('Skill gap updated'); }
      else { await createSkillGap(data); addToast('Skill gap created'); }
      setShowModal(false); setForm(emptyGap); load(); setSelected(null);
    } catch (e) { addToast('Save failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill gap?')) return;
    try { await deleteSkillGap(id); addToast('Deleted'); setSelected(null); load(); }
    catch (e) { addToast('Delete failed', 'error'); }
  };

  const openNew = () => { setForm(emptyGap); setEditMode(false); setShowModal(true); };
  const openEdit = (g) => { setForm({...g}); setEditMode(true); setShowModal(true); };

  const runAI = async (empId) => {
    setAiLoading(true); setAiData(null);
    try { const { data } = await aiSkillAnalysis(empId); setAiData(data); }
    catch (e) { addToast('AI analysis failed', 'error'); }
    finally { setAiLoading(false); }
  };

  const priorityBadge = (p) => {
    const map = { 'Critical': 'badge-danger', 'High': 'badge-warning', 'Medium': 'badge-info', 'Low': 'badge-success' };
    return <span className={`badge ${map[p] || 'badge-default'}`}>{p}</span>;
  };

  const statusBadge = (s) => {
    const map = { 'Resolved': 'badge-success', 'In Progress': 'badge-info', 'Identified': 'badge-warning' };
    return <span className={`badge ${map[s] || 'badge-default'}`}>{s}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1>Skill Gap Analysis ({gaps.length})</h1>
        <div className="page-header-actions">
          <ExportButton resource="skill-gaps" label="Skill Gaps" />
          <button className="btn btn-primary btn-sm" onClick={openNew}>+ New Skill Gap</button>
        </div>
      </div>

      {selected && (
        <div className="detail-panel">
          <h2>{selected.skillName}<button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>Close</button></h2>
          <div className="detail-grid">
            <div className="detail-item"><div className="label">Employee</div><div className="value">{selected.Employee?.name || 'N/A'}</div></div>
            <div className="detail-item"><div className="label">Category</div><div className="value">{selected.category}</div></div>
            <div className="detail-item"><div className="label">Current Level</div><div className="value">{selected.currentLevel}/5</div></div>
            <div className="detail-item"><div className="label">Required Level</div><div className="value">{selected.requiredLevel}/5</div></div>
            <div className="detail-item"><div className="label">Gap Score</div><div className="value" style={{color: selected.gapScore >= 4 ? '#fca5a5' : selected.gapScore >= 3 ? '#fde047' : '#86efac'}}>{selected.gapScore}</div></div>
            <div className="detail-item"><div className="label">Priority</div><div className="value">{priorityBadge(selected.priority)}</div></div>
            <div className="detail-item"><div className="label">Status</div><div className="value">{statusBadge(selected.status)}</div></div>
          </div>
          {selected.recommendedAction && (
            <div style={{background: 'rgba(15,23,42,0.4)', borderRadius: '12px', padding: '16px', marginBottom: '16px'}}>
              <div className="label" style={{fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '6px'}}>RECOMMENDED ACTION</div>
              <p style={{color: '#cbd5e1', fontSize: '14px'}}>{selected.recommendedAction}</p>
            </div>
          )}
          <div style={{marginBottom: '16px'}}>
            <div className="label" style={{fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '8px'}}>SKILL LEVEL</div>
            <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}>
              {[1,2,3,4,5].map(l => (
                <div key={l} style={{width: '40px', height: '8px', borderRadius: '4px', background: l <= selected.currentLevel ? '#6366f1' : l <= selected.requiredLevel ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.05)'}}></div>
              ))}
              <span style={{fontSize: '12px', color: '#64748b', marginLeft: '8px'}}>{selected.currentLevel}/{selected.requiredLevel}</span>
            </div>
          </div>
          <div className="detail-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(selected)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>Delete</button>
            {selected.employeeId && <button className="btn btn-ai btn-sm" onClick={() => runAI(selected.employeeId)}>AI Skill Analysis</button>}
          </div>
          <AIResponse data={aiData} loading={aiLoading} />
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead><tr><th>Skill</th><th>Employee</th><th>Level</th><th>Gap</th><th>Category</th><th>Priority</th><th>Status</th></tr></thead>
          <tbody>
            {gaps.map(g => (
              <tr key={g.id} onClick={() => { setSelected(g); setAiData(null); }}>
                <td style={{fontWeight: 600, color: '#e2e8f0'}}>{g.skillName}</td>
                <td>{g.Employee?.name || 'N/A'}</td>
                <td>{g.currentLevel}/{g.requiredLevel}</td>
                <td style={{color: g.gapScore >= 4 ? '#fca5a5' : g.gapScore >= 3 ? '#fde047' : '#86efac', fontWeight: 600}}>{g.gapScore}</td>
                <td>{g.category}</td>
                <td>{priorityBadge(g.priority)}</td>
                <td>{statusBadge(g.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editMode ? 'Edit Skill Gap' : 'New Skill Gap'} onClose={() => setShowModal(false)}>
          <div className="form-group"><label>Employee</label>
            <select value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})}>
              <option value="">Select Employee</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Skill Name</label><input value={form.skillName} onChange={e => setForm({...form, skillName: e.target.value})} /></div>
          <div className="form-group"><label>Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
          <div className="form-group"><label>Current Level (1-5)</label><input type="number" min="1" max="5" value={form.currentLevel} onChange={e => setForm({...form, currentLevel: parseInt(e.target.value)})} /></div>
          <div className="form-group"><label>Required Level (1-5)</label><input type="number" min="1" max="5" value={form.requiredLevel} onChange={e => setForm({...form, requiredLevel: parseInt(e.target.value)})} /></div>
          <div className="form-group"><label>Priority</label>
            <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select>
          </div>
          <div className="form-group"><label>Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option>Identified</option><option>In Progress</option><option>Resolved</option></select>
          </div>
          <div className="form-group"><label>Recommended Action</label><textarea value={form.recommendedAction} onChange={e => setForm({...form, recommendedAction: e.target.value})} /></div>
          <div className="modal-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>{editMode ? 'Update' : 'Create'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default SkillGaps;
