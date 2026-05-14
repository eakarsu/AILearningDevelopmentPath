import React, { useState } from 'react';
import API from '../services/api';

const TOOLS = [
  {
    key: 'peer-match-advisor',
    label: 'Peer / Mentor Match Advisor',
    icon: '❤',
    endpoint: '/ai/peer-match-advisor',
    description: 'Recommend mentor / peer matches using employee + skill gap context.',
    fields: [
      { key: 'employeeId', label: 'Employee ID', type: 'text', required: true },
      { key: 'goal', label: 'Goal / Focus Area', type: 'textarea' },
    ],
  },
  {
    key: 'training-effectiveness-analyzer',
    label: 'Training Effectiveness Analyzer',
    icon: '↗',
    endpoint: '/ai/training-effectiveness-analyzer',
    description: 'Assess Learning Tracks + ROI for high/low impact trainings.',
    fields: [
      { key: 'trackId', label: 'Learning Track ID', type: 'text' },
      { key: 'lookbackDays', label: 'Lookback (days)', type: 'number', placeholder: '180' },
    ],
  },
  {
    key: 'succession-planner',
    label: 'Succession Planner',
    icon: '↺',
    endpoint: '/ai/succession-planner',
    description: 'Recommend internal successors for a target role with readiness plan.',
    fields: [
      { key: 'roleTitle', label: 'Target Role', type: 'text', required: true, placeholder: 'e.g. VP of Engineering' },
      { key: 'department', label: 'Department', type: 'text', placeholder: 'e.g. Engineering' },
      { key: 'urgencyMonths', label: 'Urgency (months)', type: 'number', placeholder: '12' },
    ],
  },
  {
    key: 'budget-optimizer',
    label: 'Budget Optimizer',
    icon: '$',
    endpoint: '/ai/budget-optimizer',
    description: 'Allocate L&D spend across employees / cohorts for maximum ROI.',
    fields: [
      { key: 'totalBudgetUsd', label: 'Total Budget (USD)', type: 'number', required: true, placeholder: '100000' },
      { key: 'fiscalPeriod', label: 'Fiscal Period', type: 'text', placeholder: 'FY26' },
      { key: 'priorities', label: 'Priorities', type: 'textarea', placeholder: 'e.g. close cloud + AI skill gaps' },
    ],
  },
];

export default function AIToolsPage() {
  const [active, setActive] = useState(TOOLS[0].key);
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const tool = TOOLS.find(t => t.key === active);

  const submit = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const payload = {};
      tool.fields.forEach(f => {
        const v = inputs[f.key];
        if (v === undefined || v === '') return;
        payload[f.key] = f.type === 'number' ? Number(v) : v;
      });
      const res = await API.post(tool.endpoint, payload);
      setResult(res.data);
    } catch (e) {
      setError(e?.response?.data?.error || e?.response?.data?.message || e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>AI Tools</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {TOOLS.map(t => (
          <div
            key={t.key}
            onClick={() => { setActive(t.key); setInputs({}); setResult(null); setError(null); }}
            className={`card ${active === t.key ? 'active' : ''}`}
            style={{
              padding: '16px',
              cursor: 'pointer',
              border: active === t.key ? '2px solid #5b21b6' : '1px solid #e5e7eb',
              borderRadius: '8px',
              background: active === t.key ? '#ede9fe' : '#fff',
            }}
          >
            <div style={{ fontSize: '24px' }}>{t.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>{t.label}</div>
            <div style={{ fontSize: '12px', marginTop: '4px', color: '#6b7280' }}>{t.description}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ maxWidth: '720px', padding: '24px' }}>
        <h2 style={{ marginTop: 0 }}>{tool.icon} {tool.label}</h2>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>{tool.description}</p>

        {tool.fields.map(field => (
          <div key={field.key} style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}>
              {field.label}{field.required ? ' *' : ''}
            </label>
            {field.type === 'textarea' ? (
              <textarea rows={4} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                value={inputs[field.key] || ''}
                onChange={e => setInputs(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder || ''} />
            ) : (
              <input type={field.type || 'text'} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                value={inputs[field.key] || ''}
                onChange={e => setInputs(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder || ''} />
            )}
          </div>
        ))}

        <button onClick={submit} disabled={loading}
          style={{ width: '100%', marginTop: '12px', padding: '12px', fontSize: '15px', background: '#5b21b6', color: '#fff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Running…' : 'Run AI Tool'}
        </button>

        {error && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '6px' }}>
            {String(error)}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ marginTop: 0 }}>Result</h3>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontSize: '13px' }}>
              {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
