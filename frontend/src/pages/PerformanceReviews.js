import React from 'react';
import CrudPage from '../components/CrudPage';
import { getPerformanceReviews, createPerformanceReview, updatePerformanceReview, deletePerformanceReview } from '../services/api';

const badge = (key, val) => {
  const map = { Draft: 'badge-default', Submitted: 'badge-info', Acknowledged: 'badge-warning', Completed: 'badge-success' };
  return <span className={`badge ${map[val] || 'badge-default'}`}>{val}</span>;
};

const ratingColor = v => { const n = parseFloat(v); return n >= 4 ? '#86efac' : n >= 3 ? '#fde047' : '#fca5a5'; };

export default function PerformanceReviews() {
  return <CrudPage
    title="Performance Reviews" exportResource="performance-reviews"
    columns={[
      { key: 'employee', label: 'Employee', accessor: i => i.Employee?.name || 'N/A' },
      { key: 'reviewPeriod', label: 'Period' },
      { key: 'overallRating', label: 'Overall', render: v => <span style={{color: ratingColor(v), fontWeight: 700}}>{v}/5</span> },
      { key: 'technicalScore', label: 'Technical', render: v => `${v}/5` },
      { key: 'learningScore', label: 'Learning', render: v => `${v}/5` },
      { key: 'reviewerName', label: 'Reviewer' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    detailFields={[
      { key: 'employee', label: 'Employee', accessor: i => i.Employee?.name || 'N/A' },
      { key: 'reviewerName', label: 'Reviewer' },
      { key: 'reviewPeriod', label: 'Review Period' },
      { key: 'reviewDate', label: 'Review Date' },
      { key: 'overallRating', label: 'Overall Rating', render: v => <span style={{color: ratingColor(v), fontWeight: 700, fontSize: '18px'}}>{v}/5</span> },
      { key: 'technicalScore', label: 'Technical', render: v => `${v}/5` },
      { key: 'communicationScore', label: 'Communication', render: v => `${v}/5` },
      { key: 'leadershipScore', label: 'Leadership', render: v => `${v}/5` },
      { key: 'learningScore', label: 'L&D Engagement', render: v => `${v}/5` },
      { key: 'status', label: 'Status', badge: true },
    ]}
    renderDetail={item => (
      <div>
        {item.strengths && <div style={{background:'rgba(34,197,94,0.05)',borderRadius:'12px',padding:'16px',marginBottom:'12px',border:'1px solid rgba(34,197,94,0.1)'}}>
          <div className="label" style={{fontSize:'12px',color:'#86efac',fontWeight:600,marginBottom:'6px'}}>STRENGTHS</div>
          <p style={{color:'#cbd5e1',fontSize:'14px'}}>{item.strengths}</p>
        </div>}
        {item.areasForImprovement && <div style={{background:'rgba(234,179,8,0.05)',borderRadius:'12px',padding:'16px',marginBottom:'16px',border:'1px solid rgba(234,179,8,0.1)'}}>
          <div className="label" style={{fontSize:'12px',color:'#fde047',fontWeight:600,marginBottom:'6px'}}>AREAS FOR IMPROVEMENT</div>
          <p style={{color:'#cbd5e1',fontSize:'14px'}}>{item.areasForImprovement}</p>
        </div>}
      </div>
    )}
    formFields={[
      { key: 'employeeId', label: 'Employee ID', type: 'number' },
      { key: 'reviewerName', label: 'Reviewer Name' },
      { key: 'reviewPeriod', label: 'Review Period' },
      { key: 'reviewDate', label: 'Review Date', type: 'date' },
      { key: 'overallRating', label: 'Overall Rating', type: 'number', step: '0.1', min: 0, max: 5 },
      { key: 'technicalScore', label: 'Technical Score', type: 'number', step: '0.1', min: 0, max: 5 },
      { key: 'communicationScore', label: 'Communication Score', type: 'number', step: '0.1', min: 0, max: 5 },
      { key: 'leadershipScore', label: 'Leadership Score', type: 'number', step: '0.1', min: 0, max: 5 },
      { key: 'learningScore', label: 'Learning Score', type: 'number', step: '0.1', min: 0, max: 5 },
      { key: 'strengths', label: 'Strengths', type: 'textarea' },
      { key: 'areasForImprovement', label: 'Areas for Improvement', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: ['Draft','Submitted','Acknowledged','Completed'] },
    ]}
    apiFns={{ getAll: getPerformanceReviews, create: createPerformanceReview, update: updatePerformanceReview, delete: deletePerformanceReview }}
    emptyForm={{ employeeId:'', reviewerName:'', reviewPeriod:'', reviewDate:'', overallRating:0, technicalScore:0, communicationScore:0, leadershipScore:0, learningScore:0, strengths:'', areasForImprovement:'', status:'Draft' }}
    renderBadge={badge}
  />;
}
