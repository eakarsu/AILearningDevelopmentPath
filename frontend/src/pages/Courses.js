import React, { useState, useEffect, useContext } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse, getEmployees, aiCourseRecommendations } from '../services/api';
// Note: paginated getCoursesPaged is available in api.js if needed
import { ToastContext } from '../App';
import Modal from '../components/Modal';
import AIResponse from '../components/AIResponse';
import ExportButton from '../components/ExportButton';

const emptyCourse = { title: '', provider: '', category: '', level: 'Beginner', duration: '', cost: 0, rating: 0, description: '', skills: [], url: '', format: 'Online' };

function Courses() {
  const [courses, setCourses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyCourse);
  const [skillInput, setSkillInput] = useState('');
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEmployeeId, setAiEmployeeId] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const addToast = useContext(ToastContext);

  const load = async () => {
    try {
      const [c, e] = await Promise.all([getCourses(), getEmployees()]);
      if (c.data && c.data.data && c.data.pagination) {
        setCourses(c.data.data);
        setPagination(c.data.pagination);
      } else {
        setCourses(Array.isArray(c.data) ? c.data : []);
      }
      setEmployees(Array.isArray(e.data) ? e.data : (e.data?.data || []));
    } catch (e) { addToast('Failed to load', 'error'); }
  };
  useEffect(() => { load(); }, [page]);

  const handleSave = async () => {
    try {
      if (editMode) { await updateCourse(form.id, form); addToast('Course updated'); }
      else { await createCourse(form); addToast('Course created'); }
      setShowModal(false); setForm(emptyCourse); load(); setSelected(null);
    } catch (e) { addToast('Save failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try { await deleteCourse(id); addToast('Deleted'); setSelected(null); load(); }
    catch (e) { addToast('Delete failed', 'error'); }
  };

  const openNew = () => { setForm(emptyCourse); setEditMode(false); setShowModal(true); };
  const openEdit = (c) => { setForm({...c, skills: c.skills || []}); setEditMode(true); setShowModal(true); };

  const addSkill = () => { if (skillInput.trim()) { setForm({...form, skills: [...(form.skills||[]), skillInput.trim()]}); setSkillInput(''); }};
  const removeSkill = (i) => { setForm({...form, skills: form.skills.filter((_,idx) => idx !== i)}); };

  const runAI = async () => {
    if (!aiEmployeeId) { addToast('Select an employee first', 'error'); return; }
    setAiLoading(true); setAiData(null);
    try { const { data } = await aiCourseRecommendations(aiEmployeeId); setAiData(data); }
    catch (e) { addToast('AI analysis failed', 'error'); }
    finally { setAiLoading(false); }
  };

  const levelBadge = (l) => {
    const map = { 'Beginner': 'badge-success', 'Intermediate': 'badge-info', 'Advanced': 'badge-warning', 'Expert': 'badge-danger' };
    return <span className={`badge ${map[l] || 'badge-default'}`}>{l}</span>;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i} style={{color: i <= Math.round(rating) ? '#fbbf24' : '#334155'}}>{'\u2605'}</span>);
    }
    return <span style={{letterSpacing: '2px'}}>{stars} <span style={{fontSize: '12px', color: '#94a3b8'}}>{rating}</span></span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1>Course Catalog ({courses.length})</h1>
        <div className="page-header-actions">
          <ExportButton resource="courses" label="Courses" />
          <select value={aiEmployeeId} onChange={e => setAiEmployeeId(e.target.value)} style={{padding: '8px 12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px'}}>
            <option value="">Select employee for AI</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <button className="btn btn-ai btn-sm" onClick={runAI}>AI Recommend</button>
          <button className="btn btn-primary btn-sm" onClick={openNew}>+ New Course</button>
        </div>
      </div>

      <AIResponse data={aiData} loading={aiLoading} />

      {selected && (
        <div className="detail-panel" style={{marginTop: '20px'}}>
          <h2>{selected.title}<button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>Close</button></h2>
          <div className="detail-grid">
            <div className="detail-item"><div className="label">Provider</div><div className="value">{selected.provider}</div></div>
            <div className="detail-item"><div className="label">Category</div><div className="value">{selected.category}</div></div>
            <div className="detail-item"><div className="label">Level</div><div className="value">{levelBadge(selected.level)}</div></div>
            <div className="detail-item"><div className="label">Duration</div><div className="value">{selected.duration}</div></div>
            <div className="detail-item"><div className="label">Cost</div><div className="value">${selected.cost}</div></div>
            <div className="detail-item"><div className="label">Rating</div><div className="value">{renderStars(selected.rating)}</div></div>
            <div className="detail-item"><div className="label">Format</div><div className="value">{selected.format}</div></div>
          </div>
          {selected.description && <p style={{color: '#94a3b8', fontSize: '14px', marginBottom: '16px'}}>{selected.description}</p>}
          <div style={{marginBottom: '16px'}}>
            <div className="label" style={{fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '8px'}}>SKILLS COVERED</div>
            <div className="skill-tags">{(selected.skills||[]).map((s,i) => <span key={i} className="skill-tag">{s}</span>)}</div>
          </div>
          <div className="detail-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(selected)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>Delete</button>
          </div>
        </div>
      )}

      <div className="data-table-container" style={{marginTop: '20px'}}>
        <table className="data-table">
          <thead><tr><th>Course</th><th>Provider</th><th>Level</th><th>Duration</th><th>Cost</th><th>Rating</th><th>Format</th></tr></thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.id} onClick={() => { setSelected(c); setAiData(null); }}>
                <td style={{fontWeight: 600, color: '#e2e8f0'}}>{c.title}</td>
                <td>{c.provider}</td>
                <td>{levelBadge(c.level)}</td>
                <td>{c.duration}</td>
                <td>{parseFloat(c.cost) === 0 ? <span className="badge badge-success">Free</span> : `$${c.cost}`}</td>
                <td>{renderStars(c.rating)}</td>
                <td>{c.format}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {pagination && pagination.totalPages > 1 && (
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'16px',padding:'16px',color:'#64748b'}}>
            <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>← Prev</button>
            <span>Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</span>
            <button className="btn btn-secondary btn-sm" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editMode ? 'Edit Course' : 'New Course'} onClose={() => setShowModal(false)}>
          <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
          <div className="form-group"><label>Provider</label><input value={form.provider} onChange={e => setForm({...form, provider: e.target.value})} /></div>
          <div className="form-group"><label>Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
          <div className="form-group"><label>Level</label>
            <select value={form.level} onChange={e => setForm({...form, level: e.target.value})}><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option></select>
          </div>
          <div className="form-group"><label>Duration</label><input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g., 40 hours" /></div>
          <div className="form-group"><label>Cost ($)</label><input type="number" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} /></div>
          <div className="form-group"><label>Rating (0-5)</label><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} /></div>
          <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div className="form-group"><label>Format</label>
            <select value={form.format} onChange={e => setForm({...form, format: e.target.value})}><option>Online</option><option>In-Person</option><option>Hybrid</option><option>Self-Paced</option></select>
          </div>
          <div className="form-group"><label>Skills</label>
            <div style={{display:'flex',gap:'8px',marginBottom:'8px'}}>
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key==='Enter' && (e.preventDefault(), addSkill())} placeholder="Add skill" />
              <button type="button" className="btn btn-secondary btn-sm" onClick={addSkill}>Add</button>
            </div>
            <div className="skill-tags">{(form.skills||[]).map((s,i) => <span key={i} className="skill-tag" onClick={() => removeSkill(i)} style={{cursor:'pointer'}}>{s} x</span>)}</div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>{editMode ? 'Update' : 'Create'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Courses;
