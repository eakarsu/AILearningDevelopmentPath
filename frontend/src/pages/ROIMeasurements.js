import React, { useState, useEffect, useContext } from 'react';
import { getROIMeasurements, createROIMeasurement, updateROIMeasurement, deleteROIMeasurement, getEmployees, aiROIPrediction } from '../services/api';
import { ToastContext } from '../App';
import Modal from '../components/Modal';
import AIResponse from '../components/AIResponse';
import ExportButton from '../components/ExportButton';

const emptyROI = { employeeId: '', programName: '', investmentAmount: 0, returnAmount: 0, roiPercentage: 0, measurementDate: '', category: '', metrics: {}, period: '', status: 'Measuring' };

function ROIMeasurements() {
  const [measurements, setMeasurements] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyROI);
  const [metricKey, setMetricKey] = useState('');
  const [metricVal, setMetricVal] = useState('');
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const addToast = useContext(ToastContext);

  const load = async () => {
    try {
      const [m, e] = await Promise.all([getROIMeasurements(), getEmployees()]);
      setMeasurements(m.data); setEmployees(e.data);
    } catch (e) { addToast('Failed to load', 'error'); }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      const inv = parseFloat(form.investmentAmount) || 0;
      const ret = parseFloat(form.returnAmount) || 0;
      const roi = inv > 0 ? (((ret - inv) / inv) * 100).toFixed(2) : 0;
      const data = { ...form, roiPercentage: roi };
      if (editMode) { await updateROIMeasurement(form.id, data); addToast('Updated'); }
      else { await createROIMeasurement(data); addToast('Created'); }
      setShowModal(false); setForm(emptyROI); load(); setSelected(null);
    } catch (e) { addToast('Save failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this measurement?')) return;
    try { await deleteROIMeasurement(id); addToast('Deleted'); setSelected(null); load(); }
    catch (e) { addToast('Delete failed', 'error'); }
  };

  const openNew = () => { setForm(emptyROI); setEditMode(false); setShowModal(true); };
  const openEdit = (m) => { setForm({...m, metrics: m.metrics || {}}); setEditMode(true); setShowModal(true); };

  const addMetric = () => {
    if (metricKey.trim() && metricVal.trim()) {
      setForm({...form, metrics: {...(form.metrics||{}), [metricKey.trim()]: metricVal.trim()}});
      setMetricKey(''); setMetricVal('');
    }
  };
  const removeMetric = (key) => {
    const m = {...(form.metrics||{})}; delete m[key];
    setForm({...form, metrics: m});
  };

  const runAI = async (empId) => {
    setAiLoading(true); setAiData(null);
    try { const { data } = await aiROIPrediction(empId); setAiData(data); }
    catch (e) { addToast('AI analysis failed', 'error'); }
    finally { setAiLoading(false); }
  };

  const statusBadge = (s) => {
    const map = { 'Positive': 'badge-success', 'Negative': 'badge-danger', 'Break-Even': 'badge-warning', 'Measuring': 'badge-info' };
    return <span className={`badge ${map[s] || 'badge-default'}`}>{s}</span>;
  };

  const roiColor = (roi) => {
    const v = parseFloat(roi);
    if (v > 100) return '#86efac';
    if (v > 0) return '#fde047';
    if (v === 0) return '#94a3b8';
    return '#fca5a5';
  };

  // Summary stats
  const totalInvestment = measurements.reduce((s, m) => s + parseFloat(m.investmentAmount || 0), 0);
  const totalReturn = measurements.reduce((s, m) => s + parseFloat(m.returnAmount || 0), 0);
  const avgROI = measurements.length > 0 ? (measurements.reduce((s, m) => s + parseFloat(m.roiPercentage || 0), 0) / measurements.length).toFixed(1) : 0;

  return (
    <div>
      <div className="page-header">
        <h1>ROI Measurement ({measurements.length})</h1>
        <div className="page-header-actions">
          <ExportButton resource="roi" label="ROI Measurements" />
          <button className="btn btn-primary btn-sm" onClick={openNew}>+ New Measurement</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(239,68,68,0.15)', color: '#f87171'}}>{'\u2193'}</div>
          <div className="stat-value">${totalInvestment.toLocaleString()}</div>
          <div className="stat-label">Total Investment</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(34,197,94,0.15)', color: '#4ade80'}}>{'\u2191'}</div>
          <div className="stat-value">${totalReturn.toLocaleString()}</div>
          <div className="stat-label">Total Returns</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(59,130,246,0.15)', color: '#60a5fa'}}>{'\u2197'}</div>
          <div className="stat-value" style={{color: roiColor(avgROI)}}>{avgROI}%</div>
          <div className="stat-label">Average ROI</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(139,92,246,0.15)', color: '#a78bfa'}}>{'\u2713'}</div>
          <div className="stat-value">{measurements.filter(m => m.status === 'Positive').length}</div>
          <div className="stat-label">Positive Returns</div>
        </div>
      </div>

      {selected && (
        <div className="detail-panel">
          <h2>{selected.programName}<button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>Close</button></h2>
          <div className="detail-grid">
            <div className="detail-item"><div className="label">Employee</div><div className="value">{selected.Employee?.name || 'N/A'}</div></div>
            <div className="detail-item"><div className="label">Category</div><div className="value">{selected.category}</div></div>
            <div className="detail-item"><div className="label">Investment</div><div className="value">${selected.investmentAmount}</div></div>
            <div className="detail-item"><div className="label">Return</div><div className="value">${selected.returnAmount}</div></div>
            <div className="detail-item"><div className="label">ROI</div><div className="value" style={{color: roiColor(selected.roiPercentage), fontWeight: 700, fontSize: '20px'}}>{selected.roiPercentage}%</div></div>
            <div className="detail-item"><div className="label">Status</div><div className="value">{statusBadge(selected.status)}</div></div>
            <div className="detail-item"><div className="label">Period</div><div className="value">{selected.period || 'N/A'}</div></div>
            <div className="detail-item"><div className="label">Date</div><div className="value">{selected.measurementDate || 'N/A'}</div></div>
          </div>
          {selected.metrics && Object.keys(selected.metrics).length > 0 && (
            <div style={{marginBottom: '16px'}}>
              <div className="label" style={{fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '12px'}}>PERFORMANCE METRICS</div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px'}}>
                {Object.entries(selected.metrics).map(([k, v]) => (
                  <div key={k} style={{background: 'rgba(15,23,42,0.4)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.05)'}}>
                    <div style={{fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px'}}>{k}</div>
                    <div style={{fontSize: '15px', fontWeight: 600, color: '#a5b4fc'}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="detail-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(selected)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>Delete</button>
            {selected.employeeId && <button className="btn btn-ai btn-sm" onClick={() => runAI(selected.employeeId)}>AI ROI Prediction</button>}
          </div>
          <AIResponse data={aiData} loading={aiLoading} />
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead><tr><th>Program</th><th>Employee</th><th>Investment</th><th>Return</th><th>ROI</th><th>Period</th><th>Status</th></tr></thead>
          <tbody>
            {measurements.map(m => (
              <tr key={m.id} onClick={() => { setSelected(m); setAiData(null); }}>
                <td style={{fontWeight: 600, color: '#e2e8f0'}}>{m.programName}</td>
                <td>{m.Employee?.name || 'N/A'}</td>
                <td>${m.investmentAmount}</td>
                <td>${m.returnAmount}</td>
                <td style={{color: roiColor(m.roiPercentage), fontWeight: 700}}>{m.roiPercentage}%</td>
                <td>{m.period || 'N/A'}</td>
                <td>{statusBadge(m.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editMode ? 'Edit ROI Measurement' : 'New ROI Measurement'} onClose={() => setShowModal(false)}>
          <div className="form-group"><label>Employee</label>
            <select value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})}>
              <option value="">Select Employee</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Program Name</label><input value={form.programName} onChange={e => setForm({...form, programName: e.target.value})} /></div>
          <div className="form-group"><label>Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
          <div className="form-group"><label>Investment Amount ($)</label><input type="number" value={form.investmentAmount} onChange={e => setForm({...form, investmentAmount: e.target.value})} /></div>
          <div className="form-group"><label>Return Amount ($)</label><input type="number" value={form.returnAmount} onChange={e => setForm({...form, returnAmount: e.target.value})} /></div>
          <div className="form-group"><label>Measurement Date</label><input type="date" value={form.measurementDate || ''} onChange={e => setForm({...form, measurementDate: e.target.value})} /></div>
          <div className="form-group"><label>Period</label><input value={form.period} onChange={e => setForm({...form, period: e.target.value})} placeholder="e.g., Q1 2026" /></div>
          <div className="form-group"><label>Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option>Measuring</option><option>Positive</option><option>Negative</option><option>Break-Even</option></select>
          </div>
          <div className="form-group"><label>Metrics</label>
            <div style={{display:'flex',gap:'8px',marginBottom:'8px'}}>
              <input value={metricKey} onChange={e => setMetricKey(e.target.value)} placeholder="Metric name" style={{flex:1}} />
              <input value={metricVal} onChange={e => setMetricVal(e.target.value)} placeholder="Value" style={{flex:1}} />
              <button type="button" className="btn btn-secondary btn-sm" onClick={addMetric}>Add</button>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
              {Object.entries(form.metrics||{}).map(([k,v]) => (
                <span key={k} className="skill-tag" onClick={() => removeMetric(k)} style={{cursor:'pointer'}}>{k}: {v} x</span>
              ))}
            </div>
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

export default ROIMeasurements;
