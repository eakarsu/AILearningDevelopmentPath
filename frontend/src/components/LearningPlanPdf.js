import React, { useEffect, useState } from 'react';
import API from '../services/api';

function LearningPlanPdf() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    API.get('/employees')
      .then(r => {
        const list = Array.isArray(r.data) ? r.data : r.data?.data || [];
        setEmployees(list);
        if (list.length) setEmployeeId(list[0].id);
      })
      .catch(() => {});
  }, []);

  const download = async () => {
    setDownloading(true);
    setMsg(null);
    try {
      const res = await API.get(`/custom-views/learning-plan-pdf?employeeId=${employeeId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learning-plan-${employeeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setMsg('PDF downloaded.');
    } catch (e) {
      setMsg('Error: ' + (e.response?.data?.error || e.message));
    }
    setDownloading(false);
  };

  return (
    <div className="card" style={{ padding: 16, marginBottom: 20 }}>
      <h3 style={{ marginTop: 0 }}>Learning Plan PDF</h3>
      <p style={{ color: '#555', marginTop: 0 }}>
        Generate a printable PDF of a learner's tracks, skill gaps, and assessments.
      </p>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>Learner:</label>
        <select value={employeeId} onChange={e => setEmployeeId(e.target.value)} style={{ padding: 6 }}>
          {employees.map(e => (
            <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
          ))}
        </select>
        <button
          className="btn btn-primary"
          onClick={download}
          disabled={!employeeId || downloading}
        >
          {downloading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>
      {msg && <div style={{ marginTop: 8, fontSize: 12, color: '#444' }}>{msg}</div>}
    </div>
  );
}

export default LearningPlanPdf;
