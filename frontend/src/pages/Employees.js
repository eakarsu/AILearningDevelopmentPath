import React, { useState, useEffect, useContext } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, aiLearningPath, aiSkillAnalysis } from '../services/api';
import { ToastContext } from '../App';
import Modal from '../components/Modal';
import AIResponse from '../components/AIResponse';
import ExportButton from '../components/ExportButton';

const emptyEmployee = { name: '', email: '', department: '', position: '', level: 'Junior', hireDate: '', skills: [], learningBudget: 1000, budgetUsed: 0 };

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyEmployee);
  const [skillInput, setSkillInput] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const addToast = useContext(ToastContext);

  const load = async () => {
    try { const { data } = await getEmployees(); setEmployees(data); } catch (e) { addToast('Failed to load employees', 'error'); }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      if (editMode) {
        await updateEmployee(form.id, form);
        addToast('Employee updated');
      } else {
        await createEmployee(form);
        addToast('Employee created');
      }
      setShowModal(false);
      setForm(emptyEmployee);
      load();
      setSelected(null);
    } catch (e) { addToast(e.response?.data?.error || 'Save failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try { await deleteEmployee(id); addToast('Employee deleted'); setSelected(null); load(); }
    catch (e) { addToast('Delete failed', 'error'); }
  };

  const openNew = () => { setForm(emptyEmployee); setEditMode(false); setShowModal(true); };
  const openEdit = (emp) => { setForm({ ...emp, skills: emp.skills || [] }); setEditMode(true); setShowModal(true); };

  const addSkill = () => {
    if (skillInput.trim()) { setForm({ ...form, skills: [...(form.skills || []), skillInput.trim()] }); setSkillInput(''); }
  };
  const removeSkill = (i) => { setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) }); };

  const runAI = async (type, empId) => {
    setAiLoading(true); setAiData(null);
    try {
      const fn = type === 'learning-path' ? aiLearningPath : aiSkillAnalysis;
      const { data } = await fn(empId);
      setAiData(data);
    } catch (e) { addToast('AI analysis failed', 'error'); }
    finally { setAiLoading(false); }
  };

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];
  const levels = [...new Set(employees.map(e => e.level).filter(Boolean))];

  const filtered = employees.filter(emp => {
    if (filterDept && emp.department !== filterDept) return false;
    if (filterLevel && emp.level !== filterLevel) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!emp.name?.toLowerCase().includes(term) &&
          !emp.email?.toLowerCase().includes(term) &&
          !emp.position?.toLowerCase().includes(term) &&
          !(emp.skills || []).some(s => s.toLowerCase().includes(term))) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <h1>Employees ({filtered.length})</h1>
        <div className="page-header-actions">
          <ExportButton resource="employees" label="Employees" />
          <button className="btn btn-primary btn-sm" onClick={openNew}>+ New Employee</button>
        </div>
      </div>

      <div className="filter-bar">
        <input className="filter-search" type="text" placeholder="Search by name, email, position, or skill..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <select className="filter-select" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="filter-select" value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
          <option value="">All Levels</option>
          {levels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        {(filterDept || filterLevel || searchTerm) && (
          <button className="btn btn-secondary btn-sm" onClick={() => { setFilterDept(''); setFilterLevel(''); setSearchTerm(''); }}>Clear Filters</button>
        )}
      </div>

      {selected && (
        <div className="detail-panel">
          <h2>
            {selected.name}
            <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>Close</button>
          </h2>
          <div className="detail-grid">
            <div className="detail-item"><div className="label">Email</div><div className="value">{selected.email}</div></div>
            <div className="detail-item"><div className="label">Department</div><div className="value">{selected.department}</div></div>
            <div className="detail-item"><div className="label">Position</div><div className="value">{selected.position}</div></div>
            <div className="detail-item"><div className="label">Level</div><div className="value">{selected.level}</div></div>
            <div className="detail-item"><div className="label">Hire Date</div><div className="value">{selected.hireDate}</div></div>
            <div className="detail-item"><div className="label">Budget</div><div className="value">${selected.learningBudget} (Used: ${selected.budgetUsed})</div></div>
          </div>
          <div style={{marginBottom: '16px'}}>
            <span className="label" style={{fontSize: '12px', color: '#64748b', fontWeight: 600}}>SKILLS</span>
            <div className="skill-tags" style={{marginTop: '8px'}}>
              {(selected.skills || []).map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
            </div>
          </div>
          <div className="detail-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(selected)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>Delete</button>
            <button className="btn btn-ai btn-sm" onClick={() => runAI('learning-path', selected.id)}>AI Learning Path</button>
            <button className="btn btn-ai btn-sm" onClick={() => runAI('skill-analysis', selected.id)}>AI Skill Analysis</button>
          </div>
          <AIResponse data={aiData} loading={aiLoading} />
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Department</th><th>Position</th><th>Level</th><th>Budget</th><th>Skills</th></tr>
          </thead>
          <tbody>
            {filtered.map(emp => (
              <tr key={emp.id} onClick={() => { setSelected(emp); setAiData(null); }}>
                <td style={{fontWeight: 600, color: '#e2e8f0'}}>{emp.name}</td>
                <td>{emp.department}</td>
                <td>{emp.position}</td>
                <td><span className="badge badge-info">{emp.level}</span></td>
                <td>${emp.learningBudget}</td>
                <td><div className="skill-tags">{(emp.skills || []).slice(0, 3).map((s, i) => <span key={i} className="skill-tag">{s}</span>)}{(emp.skills || []).length > 3 && <span className="skill-tag">+{emp.skills.length - 3}</span>}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editMode ? 'Edit Employee' : 'New Employee'} onClose={() => setShowModal(false)}>
          <div className="form-group"><label>Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div className="form-group"><label>Email</label><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div className="form-group"><label>Department</label><input value={form.department} onChange={e => setForm({...form, department: e.target.value})} /></div>
          <div className="form-group"><label>Position</label><input value={form.position} onChange={e => setForm({...form, position: e.target.value})} /></div>
          <div className="form-group"><label>Level</label>
            <select value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
              <option>Junior</option><option>Mid</option><option>Senior</option><option>Lead</option><option>Principal</option>
            </select>
          </div>
          <div className="form-group"><label>Hire Date</label><input type="date" value={form.hireDate} onChange={e => setForm({...form, hireDate: e.target.value})} /></div>
          <div className="form-group"><label>Learning Budget ($)</label><input type="number" value={form.learningBudget} onChange={e => setForm({...form, learningBudget: e.target.value})} /></div>
          <div className="form-group"><label>Skills</label>
            <div style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Add a skill" />
              <button type="button" className="btn btn-secondary btn-sm" onClick={addSkill}>Add</button>
            </div>
            <div className="skill-tags">{(form.skills || []).map((s, i) => <span key={i} className="skill-tag" onClick={() => removeSkill(i)} style={{cursor: 'pointer'}}>{s} x</span>)}</div>
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

export default Employees;
