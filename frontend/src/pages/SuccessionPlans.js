import React from 'react';
import CrudPage from '../components/CrudPage';
import { getSuccessionPlans, createSuccessionPlan, updateSuccessionPlan, deleteSuccessionPlan } from '../services/api';

const badge = (key, val) => {
  if (key === 'readinessLevel') {
    const map = { 'Ready Now': 'badge-success', 'Ready in 1 Year': 'badge-info', 'Ready in 2+ Years': 'badge-warning', 'Development Needed': 'badge-danger' };
    return <span className={`badge ${map[val]||'badge-default'}`}>{val}</span>;
  }
  if (key === 'priority') { const map = { Critical: 'badge-danger', High: 'badge-warning', Medium: 'badge-info', Low: 'badge-success' }; return <span className={`badge ${map[val]||'badge-default'}`}>{val}</span>; }
  if (key === 'status') { const map = { Active: 'badge-success', 'On Hold': 'badge-warning', Completed: 'badge-info', Cancelled: 'badge-danger' }; return <span className={`badge ${map[val]||'badge-default'}`}>{val}</span>; }
  return val;
};

export default function SuccessionPlans() {
  return <CrudPage title="Succession Plans" exportResource="succession-plans"
    columns={[
      { key: 'targetRole', label: 'Target Role' },
      { key: 'department', label: 'Department' },
      { key: 'candidate', label: 'Candidate', accessor: i => i.Candidate?.name || 'N/A' },
      { key: 'readinessLevel', label: 'Readiness', badge: true },
      { key: 'priority', label: 'Priority', badge: true },
      { key: 'riskLevel', label: 'Risk' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    detailFields={[
      { key: 'targetRole', label: 'Target Role' },
      { key: 'department', label: 'Department' },
      { key: 'candidate', label: 'Candidate', accessor: i => i.Candidate?.name || 'N/A' },
      { key: 'currentIncumbent', label: 'Current Incumbent' },
      { key: 'readinessLevel', label: 'Readiness', badge: true },
      { key: 'priority', label: 'Priority', badge: true },
      { key: 'riskLevel', label: 'Risk Level' },
      { key: 'targetDate', label: 'Target Date' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    renderDetail={item => (
      <div>
        {item.developmentAreas?.length > 0 && <div style={{marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'8px'}}>DEVELOPMENT AREAS</div>
          <div className="skill-tags">{item.developmentAreas.map((a,i) => <span key={i} className="skill-tag">{a}</span>)}</div>
        </div>}
        {item.developmentPlan && <div style={{background:'rgba(15,23,42,0.4)',borderRadius:'12px',padding:'16px',marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'6px'}}>DEVELOPMENT PLAN</div>
          <p style={{color:'#cbd5e1',fontSize:'14px'}}>{item.developmentPlan}</p>
        </div>}
      </div>
    )}
    formFields={[
      { key: 'targetRole', label: 'Target Role' },
      { key: 'department', label: 'Department' },
      { key: 'candidateId', label: 'Candidate Employee ID', type: 'number' },
      { key: 'currentIncumbent', label: 'Current Incumbent' },
      { key: 'readinessLevel', label: 'Readiness', type: 'select', options: ['Ready Now','Ready in 1 Year','Ready in 2+ Years','Development Needed'] },
      { key: 'priority', label: 'Priority', type: 'select', options: ['Critical','High','Medium','Low'] },
      { key: 'riskLevel', label: 'Risk Level', type: 'select', options: ['High','Medium','Low'] },
      { key: 'targetDate', label: 'Target Date', type: 'date' },
      { key: 'developmentPlan', label: 'Development Plan', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active','On Hold','Completed','Cancelled'] },
    ]}
    apiFns={{ getAll: getSuccessionPlans, create: createSuccessionPlan, update: updateSuccessionPlan, delete: deleteSuccessionPlan }}
    emptyForm={{ targetRole:'', department:'', candidateId:'', currentIncumbent:'', readinessLevel:'Development Needed', priority:'Medium', riskLevel:'Medium', targetDate:'', developmentPlan:'', status:'Active' }}
    renderBadge={badge}
  />;
}
