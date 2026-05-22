import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

function SkillProgressChart() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    API.get('/custom-views/skill-progress-chart')
      .then(r => { setData(r.data.data || []); setMeta(r.data); })
      .catch(e => setErr(e.response?.data?.error || e.message));
  }, []);

  return (
    <div className="card" style={{ padding: 16, marginBottom: 20 }}>
      <h3 style={{ marginTop: 0 }}>Skill Progress per Learner</h3>
      {err && <div style={{ color: 'red' }}>Error: {err}</div>}
      {meta && <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        {meta.learnerCount} learners | generated {new Date(meta.generatedAt).toLocaleString()}
      </div>}
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="learner" angle={-30} textAnchor="end" interval={0} height={70} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgProgress" name="Avg Progress %" fill="#4f46e5" />
            <Bar dataKey="skillsCount" name="Skills Count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SkillProgressChart;
