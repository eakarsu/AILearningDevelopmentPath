import React, { useState, useEffect, useContext } from 'react';
import { getTracks, createTrack, updateTrack, deleteTrack, getEmployees, aiLearningPath } from '../services/api';
import { ToastContext } from '../App';
import Modal from '../components/Modal';
import AIResponse from '../components/AIResponse';
import ExportButton from '../components/ExportButton';

const emptyTrack = { employeeId: '', title: '', description: '', category: '', priority: 'Medium', status: 'Not Started', targetDate: '', progress: 0, estimatedHours: 0, completedHours: 0 };

function LearningTracks() {
  const [tracks, setTracks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyTrack);
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const addToast = useContext(ToastContext);

  const load = async () => {
    try {
      const [t, e] = await Promise.all([getTracks(), getEmployees()]);
      setTracks(t.data);
      setEmployees(e.data);
    } catch (e) { addToast('Failed to load', 'error'); }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      if (editMode) { await updateTrack(form.id, form); addToast('Track updated'); }
      else { await createTrack(form); addToast('Track created'); }
      setShowModal(false); setForm(emptyTrack); load(); setSelected(null);
    } catch (e) { addToast('Save failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this track?')) return;
    try { await deleteTrack(id); addToast('Track deleted'); setSelected(null); load(); }
    catch (e) { addToast('Delete failed', 'error'); }
  };

  const openNew = () => { setForm(emptyTrack); setEditMode(false); setShowModal(true); };
  const openEdit = (t) => { setForm({...t}); setEditMode(true); setShowModal(true); };

  const runAI = async (empId) => {
    setAiLoading(true); setAiData(null);
    try { const { data } = await aiLearningPath(empId); setAiData(data); }
    catch (e) { addToast('AI analysis failed', 'error'); }
    finally { setAiLoading(false); }
  };

  const statusBadge = (status) => {
    const map = { 'Completed': 'badge-success', 'In Progress': 'badge-info', 'Not Started': 'badge-default', 'On Hold': 'badge-warning' };
    return <span className={`badge ${map[status] || 'badge-default'}`}>{status}</span>;
  };

  const priorityBadge = (p) => {
    const map = { 'High': 'badge-danger', 'Medium': 'badge-warning', 'Low': 'badge-success' };
    return <span className={`badge ${map[p] || 'badge-default'}`}>{p}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1>Learning Tracks ({tracks.length})</h1>
        <div className="page-header-actions">
          <ExportButton resource="tracks" label="Learning Tracks" />
          <button className="btn btn-primary btn-sm" onClick={openNew}>+ New Track</button>
        </div>
      </div>

      {selected && (
        <div className="detail-panel">
          <h2>{selected.title}<button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>Close</button></h2>
          <div className="detail-grid">
            <div className="detail-item"><div className="label">Employee</div><div className="value">{selected.Employee?.name || 'N/A'}</div></div>
            <div className="detail-item"><div className="label">Category</div><div className="value">{selected.category}</div></div>
            <div className="detail-item"><div className="label">Priority</div><div className="value">{priorityBadge(selected.priority)}</div></div>
            <div className="detail-item"><div className="label">Status</div><div className="value">{statusBadge(selected.status)}</div></div>
            <div className="detail-item"><div className="label">Target Date</div><div className="value">{selected.targetDate || 'Not set'}</div></div>
            <div className="detail-item"><div className="label">Hours</div><div className="value">{selected.completedHours}/{selected.estimatedHours}h</div></div>
          </div>
          <div style={{marginBottom: '16px'}}>
            <div className="label" style={{fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '8px'}}>PROGRESS ({selected.progress}%)</div>
            <div className="progress-bar"><div className="fill" style={{width: `${selected.progress}%`}}></div></div>
          </div>
          {selected.description && <p style={{color: '#94a3b8', fontSize: '14px', marginBottom: '16px'}}>{selected.description}</p>}
          <div className="detail-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(selected)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>Delete</button>
            {selected.employeeId && <button className="btn btn-ai btn-sm" onClick={() => runAI(selected.employeeId)}>AI Learning Path</button>}
          </div>
          <AIResponse data={aiData} loading={aiLoading} />
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead><tr><th>Title</th><th>Employee</th><th>Category</th><th>Priority</th><th>Status</th><th>Progress</th></tr></thead>
          <tbody>
            {tracks.map(t => (
              <tr key={t.id} onClick={() => { setSelected(t); setAiData(null); }}>
                <td style={{fontWeight: 600, color: '#e2e8f0'}}>{t.title}</td>
                <td>{t.Employee?.name || 'N/A'}</td>
                <td>{t.category}</td>
                <td>{priorityBadge(t.priority)}</td>
                <td>{statusBadge(t.status)}</td>
                <td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="progress-bar" style={{width:'80px'}}><div className="fill" style={{width:`${t.progress}%`}}></div></div><span style={{fontSize:'12px'}}>{t.progress}%</span></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editMode ? 'Edit Track' : 'New Track'} onClose={() => setShowModal(false)}>
          <div className="form-group"><label>Employee</label>
            <select value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})}>
              <option value="">Select Employee</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name} - {e.department}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
          <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div className="form-group"><label>Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
          <div className="form-group"><label>Priority</label>
            <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}><option>High</option><option>Medium</option><option>Low</option></select>
          </div>
          <div className="form-group"><label>Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option>Not Started</option><option>In Progress</option><option>Completed</option><option>On Hold</option></select>
          </div>
          <div className="form-group"><label>Target Date</label><input type="date" value={form.targetDate} onChange={e => setForm({...form, targetDate: e.target.value})} /></div>
          <div className="form-group"><label>Progress (%)</label><input type="number" min="0" max="100" value={form.progress} onChange={e => setForm({...form, progress: e.target.value})} /></div>
          <div className="form-group"><label>Estimated Hours</label><input type="number" value={form.estimatedHours} onChange={e => setForm({...form, estimatedHours: e.target.value})} /></div>
          <div className="form-group"><label>Completed Hours</label><input type="number" value={form.completedHours} onChange={e => setForm({...form, completedHours: e.target.value})} /></div>
          <div className="modal-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>{editMode ? 'Update' : 'Create'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default LearningTracks;
