import React from 'react';
import CrudPage from '../components/CrudPage';
import { getFeedbackSurveys, createFeedbackSurvey, updateFeedbackSurvey, deleteFeedbackSurvey } from '../services/api';

const badge = (key, val) => {
  if (key === 'status') { const map = { Completed: 'badge-success', Pending: 'badge-warning', Expired: 'badge-danger' }; return <span className={`badge ${map[val]||'badge-default'}`}>{val}</span>; }
  if (key === 'type') { return <span className="badge badge-purple">{val}</span>; }
  return val;
};

export default function FeedbackSurveys() {
  return <CrudPage title="Feedback Surveys" exportResource="feedback-surveys"
    columns={[
      { key: 'surveyTitle', label: 'Survey' },
      { key: 'employee', label: 'Employee', accessor: i => i.Employee?.name || 'N/A' },
      { key: 'type', label: 'Type', badge: true },
      { key: 'overallRating', label: 'Overall', render: v => `${v}/5` },
      { key: 'relatedItem', label: 'Related To', render: v => v || '-' },
      { key: 'submittedDate', label: 'Date' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    detailFields={[
      { key: 'surveyTitle', label: 'Survey Title' },
      { key: 'employee', label: 'Employee', accessor: i => i.Employee?.name || 'N/A' },
      { key: 'type', label: 'Type', badge: true },
      { key: 'relatedItem', label: 'Related Item', render: v => v || 'N/A' },
      { key: 'overallRating', label: 'Overall Rating', render: v => `${v}/5` },
      { key: 'contentRating', label: 'Content Rating', render: v => `${v}/5` },
      { key: 'instructorRating', label: 'Instructor Rating', render: v => `${v}/5` },
      { key: 'applicabilityRating', label: 'Applicability', render: v => `${v}/5` },
      { key: 'submittedDate', label: 'Submitted Date' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    renderDetail={item => item.comments && (
      <div style={{background:'rgba(15,23,42,0.4)',borderRadius:'12px',padding:'16px',marginBottom:'16px'}}>
        <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'6px'}}>COMMENTS</div>
        <p style={{color:'#cbd5e1',fontSize:'14px'}}>{item.comments}</p>
      </div>
    )}
    formFields={[
      { key: 'employeeId', label: 'Employee ID', type: 'number' },
      { key: 'surveyTitle', label: 'Survey Title' },
      { key: 'type', label: 'Type', type: 'select', options: ['Post-Training','Quarterly','Annual','Event','Course'] },
      { key: 'relatedItem', label: 'Related Item' },
      { key: 'overallRating', label: 'Overall Rating', type: 'number', step: '0.1', min: 0, max: 5 },
      { key: 'contentRating', label: 'Content Rating', type: 'number', step: '0.1', min: 0, max: 5 },
      { key: 'instructorRating', label: 'Instructor Rating', type: 'number', step: '0.1', min: 0, max: 5 },
      { key: 'applicabilityRating', label: 'Applicability', type: 'number', step: '0.1', min: 0, max: 5 },
      { key: 'comments', label: 'Comments', type: 'textarea' },
      { key: 'submittedDate', label: 'Submitted Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['Pending','Completed','Expired'] },
    ]}
    apiFns={{ getAll: getFeedbackSurveys, create: createFeedbackSurvey, update: updateFeedbackSurvey, delete: deleteFeedbackSurvey }}
    emptyForm={{ employeeId:'', surveyTitle:'', type:'Post-Training', relatedItem:'', overallRating:0, contentRating:0, instructorRating:0, applicabilityRating:0, comments:'', submittedDate:'', status:'Pending' }}
    renderBadge={badge}
  />;
}
