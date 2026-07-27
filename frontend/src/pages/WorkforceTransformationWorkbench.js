import React, { useEffect, useMemo, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://127.0.0.1:4000/api';
const fallback = {
  'workforce-transformation': { title: 'Workforce Transformation Planner', action: 'Advance redesign' },
  'job-exposure-redeployment': { title: 'Job Exposure & Redeployment', action: 'Advance transition' },
  'learning-passport': { title: 'Employee Learning Passport', action: 'Advance verification' },
  'career-resilience': { title: 'Career Resilience Coach', action: 'Advance experiment' },
};
const card = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18, boxShadow: '0 8px 24px rgba(15,23,42,.06)' };

export default function WorkforceTransformationWorkbench() {
  const [features, setFeatures] = useState(fallback);
  const [active, setActive] = useState('workforce-transformation');
  const [records, setRecords] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', owner: '', metricValue: 50 });
  const token = localStorage.getItem('token');
  const request = async (path, options = {}) => {
    const response = await fetch(`${API}/workforce-transformation${path}`, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers || {}) } });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || 'Request failed');
    return body;
  };
  const load = async (feature = active) => {
    setBusy(true); setError('');
    try { const body = await request(`/records?feature=${encodeURIComponent(feature)}`); setRecords(body.data || []); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  useEffect(() => { request('/definitions').then((x) => setFeatures(x.features || fallback)).catch(() => {}); }, []);
  useEffect(() => { load(active); }, [active]);
  const stats = useMemo(() => ({ total: records.length, active: records.filter((r) => r.status !== 'complete').length, high: records.filter((r) => ['high','critical'].includes(r.risk)).length, avg: records.length ? Math.round(records.reduce((s,r) => s + Number(r.metric_value),0)/records.length) : 0 }), [records]);
  const advance = async (id) => { await request(`/records/${id}/advance`, { method: 'POST' }); load(); };
  const create = async (e) => { e.preventDefault(); await request('/records', { method: 'POST', body: JSON.stringify({ featureKey: active, ...form, details: { source: 'operator-created', reviewRequired: true } }) }); setForm({ title: '', owner: '', metricValue: 50 }); load(); };
  return <div style={{ padding: 28, color: '#0f172a' }}>
    <div style={{ marginBottom: 22 }}><div style={{ color: '#2563eb', fontWeight: 800, letterSpacing: 1 }}>AI-ENABLED PEOPLE OPERATIONS</div><h1 style={{ margin: '6px 0' }}>Workforce Transition Operating System</h1><p style={{ color: '#64748b' }}>Redesign work, redeploy people, verify capabilities, and retain accountable human decisions.</p></div>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>{Object.entries(features).map(([key, value]) => <button key={key} onClick={() => setActive(key)} style={{ padding: '10px 14px', borderRadius: 999, border: 0, cursor: 'pointer', background: active === key ? '#2563eb' : '#e2e8f0', color: active === key ? '#fff' : '#334155', fontWeight: 700 }}>{value.title}</button>)}</div>
    {error && <div style={{ ...card, borderColor: '#fecaca', color: '#b91c1c', marginBottom: 16 }}>{error}</div>}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(130px,1fr))', gap: 12, marginBottom: 18 }}>{[['Records',stats.total],['In progress',stats.active],['High attention',stats.high],['Average metric',stats.avg]].map(([label,value]) => <div key={label} style={card}><div style={{ color: '#64748b', fontSize: 13 }}>{label}</div><div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div></div>)}</div>
    <form onSubmit={create} style={{ ...card, display: 'grid', gridTemplateColumns: '2fr 1fr 130px auto', gap: 10, marginBottom: 18 }}><input required placeholder="New case or capability" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})}/><input required placeholder="Accountable owner" value={form.owner} onChange={(e)=>setForm({...form,owner:e.target.value})}/><input type="number" value={form.metricValue} onChange={(e)=>setForm({...form,metricValue:e.target.value})}/><button className="btn btn-primary">Create case</button></form>
    <div style={{ ...card, overflowX: 'auto' }}>{busy ? 'Loading PostgreSQL records…' : <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr>{['Case','Owner','Stage','Risk','Metric','Domain evidence','Action'].map((x)=><th key={x} style={{ textAlign:'left',padding:10,borderBottom:'1px solid #e2e8f0' }}>{x}</th>)}</tr></thead><tbody>{records.map((r)=><tr key={r.id}><td style={{padding:10}}><strong>{r.title}</strong><div style={{fontSize:12,color:'#64748b'}}>Due {String(r.due_date).slice(0,10)}</div></td><td style={{padding:10}}>{r.owner}</td><td style={{padding:10}}>{r.status}</td><td style={{padding:10}}>{r.risk}</td><td style={{padding:10}}>{r.metric_value} {r.metric_unit}</td><td style={{padding:10,maxWidth:300}}>{Object.entries(r.details||{}).slice(0,3).map(([k,v])=><div key={k}><b>{k.replace(/([A-Z])/g,' $1')}:</b> {String(v)}</div>)}</td><td style={{padding:10}}><button className="btn btn-sm btn-secondary" disabled={r.status==='complete'} onClick={()=>advance(r.id)}>{features[active]?.action || 'Advance'}</button></td></tr>)}</tbody></table>}</div>
  </div>;
}
