import React, { useEffect, useState } from 'react';
import API from '../services/api';

function colorFor(value) {
  // 0..100 -> green intensity
  if (value >= 75) return '#15803d';
  if (value >= 50) return '#22c55e';
  if (value >= 25) return '#86efac';
  if (value > 0) return '#dcfce7';
  return '#f3f4f6';
}

function CourseCompletionHeatmap() {
  const [resp, setResp] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    API.get('/custom-views/course-completion-heatmap')
      .then(r => setResp(r.data))
      .catch(e => setErr(e.response?.data?.error || e.message));
  }, []);

  if (err) return <div className="card" style={{ padding: 16 }}>Error: {err}</div>;
  if (!resp) return <div className="card" style={{ padding: 16 }}>Loading heatmap...</div>;

  return (
    <div className="card" style={{ padding: 16, marginBottom: 20, overflowX: 'auto' }}>
      <h3 style={{ marginTop: 0 }}>Course Completion Heatmap</h3>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        {resp.learners.length} learners × {resp.courses.length} courses
      </div>
      <table style={{ borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #e5e7eb', position: 'sticky', left: 0, background: '#fff' }}>Learner</th>
            {resp.courses.map(c => (
              <th key={c.id} style={{ padding: '6px 8px', borderBottom: '2px solid #e5e7eb', minWidth: 90, textAlign: 'center' }}>
                {c.title.slice(0, 18)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resp.matrix.map(row => (
            <tr key={row.learnerId}>
              <td style={{ padding: '6px 10px', borderBottom: '1px solid #f3f4f6', position: 'sticky', left: 0, background: '#fff' }}>
                <strong>{row.learner}</strong><br/>
                <span style={{ color: '#888' }}>{row.department}</span>
              </td>
              {row.cells.map((cell, i) => (
                <td
                  key={i}
                  title={`${cell.courseTitle}: ${cell.completion}%`}
                  style={{
                    background: colorFor(cell.completion),
                    color: cell.completion >= 50 ? '#fff' : '#111',
                    textAlign: 'center',
                    padding: '10px 6px',
                    border: '1px solid #fff',
                    fontWeight: 600,
                  }}
                >
                  {cell.completion}%
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseCompletionHeatmap;
