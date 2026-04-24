import React, { useState, useEffect, useContext } from 'react';
import { getCertifications, createCertification, updateCertification, deleteCertification, getEmployees, aiCertificationAdvisor } from '../services/api';
import { ToastContext } from '../App';
import Modal from '../components/Modal';
import AIResponse from '../components/AIResponse';
import ExportButton from '../components/ExportButton';

const emptyCert = { employeeId: '', name: '', provider: '', category: '', dateObtained: '', expiryDate: '', status: 'Planned', cost: 0, credentialId: '', verificationUrl: '' };

function Certifications() {
  const [certs, setCerts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyCert);
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const addToast = useContext(ToastContext);

  const load = async () => {
    try {
      const [c, e] = await Promise.all([getCertifications(), getEmployees()]);
      setCerts(c.data); setEmployees(e.data);
    } catch (e) { addToast('Failed to load', 'error'); }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      if (editMode) { await updateCertification(form.id, form); addToast('Certification updated'); }
      else { await createCertification(form); addToast('Certification created'); }
      setShowModal(false); setForm(emptyCert); load(); setSelected(null);
    } catch (e) { addToast('Save failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try { await deleteCertification(id); addToast('Deleted'); setSelected(null); load(); }
    catch (e) { addToast('Delete failed', 'error'); }
  };

  const openNew = () => { setForm(emptyCert); setEditMode(false); setShowModal(true); };
  const openEdit = (c) => { setForm({...c}); setEditMode(true); setShowModal(true); };

  const runAI = async (empId) => {
    setAiLoading(true); setAiData(null);
    try { const { data } = await aiCertificationAdvisor(empId); setAiData(data); }
    catch (e) { addToast('AI analysis failed', 'error'); }
    finally { setAiLoading(false); }
  };

  const statusBadge = (s) => {
    const map = { 'Active': 'badge-success', 'Expired': 'badge-danger', 'In Progress': 'badge-info', 'Planned': 'badge-warning' };
    return <span className={`badge ${map[s] || 'badge-default'}`}>{s}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1>Certifications ({certs.length})</h1>
        <div className="page-header-actions">
          <ExportButton resource="certifications" label="Certifications" />
          <button className="btn btn-primary btn-sm" onClick={openNew}>+ New Certification</button>
        </div>
      </div>

      {selected && (
        <div className="detail-panel">
          <h2>{selected.name}<button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>Close</button></h2>
          <div className="detail-grid">
            <div className="detail-item"><div className="label">Employee</div><div className="value">{selected.Employee?.name || 'N/A'}</div></div>
            <div className="detail-item"><div className="label">Provider</div><div className="value">{selected.provider}</div></div>
            <div className="detail-item"><div className="label">Category</div><div className="value">{selected.category}</div></div>
            <div className="detail-item"><div className="label">Status</div><div className="value">{statusBadge(selected.status)}</div></div>
            <div className="detail-item"><div className="label">Date Obtained</div><div className="value">{selected.dateObtained || 'Pending'}</div></div>
            <div className="detail-item"><div className="label">Expiry Date</div><div className="value">{selected.expiryDate || 'No expiry'}</div></div>
            <div className="detail-item"><div className="label">Cost</div><div className="value">${selected.cost}</div></div>
            <div className="detail-item"><div className="label">Credential ID</div><div className="value">{selected.credentialId || 'N/A'}</div></div>
          </div>
          <div className="detail-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(selected)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>Delete</button>
            {selected.employeeId && <button className="btn btn-ai btn-sm" onClick={() => runAI(selected.employeeId)}>AI Certification Advisor</button>}
          </div>
          <AIResponse data={aiData} loading={aiLoading} />
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead><tr><th>Certification</th><th>Employee</th><th>Provider</th><th>Category</th><th>Status</th><th>Cost</th><th>Expiry</th></tr></thead>
          <tbody>
            {certs.map(c => (
              <tr key={c.id} onClick={() => { setSelected(c); setAiData(null); }}>
                <td style={{fontWeight: 600, color: '#e2e8f0'}}>{c.name}</td>
                <td>{c.Employee?.name || 'N/A'}</td>
                <td>{c.provider}</td>
                <td>{c.category}</td>
                <td>{statusBadge(c.status)}</td>
                <td>${c.cost}</td>
                <td>{c.expiryDate || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editMode ? 'Edit Certification' : 'New Certification'} onClose={() => setShowModal(false)}>
          <div className="form-group"><label>Employee</label>
            <select value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})}>
              <option value="">Select Employee</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Certification Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div className="form-group"><label>Provider</label><input value={form.provider} onChange={e => setForm({...form, provider: e.target.value})} /></div>
          <div className="form-group"><label>Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
          <div className="form-group"><label>Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option>Active</option><option>Expired</option><option>In Progress</option><option>Planned</option></select>
          </div>
          <div className="form-group"><label>Date Obtained</label><input type="date" value={form.dateObtained || ''} onChange={e => setForm({...form, dateObtained: e.target.value})} /></div>
          <div className="form-group"><label>Expiry Date</label><input type="date" value={form.expiryDate || ''} onChange={e => setForm({...form, expiryDate: e.target.value})} /></div>
          <div className="form-group"><label>Cost ($)</label><input type="number" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} /></div>
          <div className="form-group"><label>Credential ID</label><input value={form.credentialId || ''} onChange={e => setForm({...form, credentialId: e.target.value})} /></div>
          <div className="modal-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>{editMode ? 'Update' : 'Create'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Certifications;
