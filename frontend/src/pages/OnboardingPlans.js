import React from 'react';
import CrudPage from '../components/CrudPage';
import { getOnboardingPlans, createOnboardingPlan, updateOnboardingPlan, deleteOnboardingPlan } from '../services/api';

const badge = (key, val) => {
  const map = { 'Not Started': 'badge-default', 'In Progress': 'badge-info', Completed: 'badge-success', Extended: 'badge-warning' };
  return <span className={`badge ${map[val] || 'badge-default'}`}>{val}</span>;
};

export default function OnboardingPlans() {
  return <CrudPage title="Onboarding Plans" exportResource="onboarding-plans"
    columns={[
      { key: 'planName', label: 'Plan' },
      { key: 'employee', label: 'Employee', accessor: i => i.Employee?.name || 'N/A' },
      { key: 'department', label: 'Department' },
      { key: 'progressPercent', label: 'Progress', render: v => <div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="progress-bar" style={{width:'80px'}}><div className="fill" style={{width:`${v}%`}}></div></div>{v}%</div> },
      { key: 'assignedBuddy', label: 'Buddy' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    detailFields={[
      { key: 'planName', label: 'Plan Name' },
      { key: 'employee', label: 'Employee', accessor: i => i.Employee?.name || 'N/A' },
      { key: 'department', label: 'Department' },
      { key: 'startDate', label: 'Start Date' },
      { key: 'targetCompletionDate', label: 'Target Completion' },
      { key: 'assignedBuddy', label: 'Assigned Buddy' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    renderDetail={item => (
      <div>
        <div style={{marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'8px'}}>PROGRESS ({item.progressPercent}%)</div>
          <div className="progress-bar"><div className="fill" style={{width:`${item.progressPercent}%`}}></div></div>
        </div>
        {item.milestones?.length > 0 && <div style={{marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'8px'}}>MILESTONES</div>
          {item.milestones.map((m,i) => <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 12px',background:'rgba(15,23,42,0.4)',borderRadius:'8px',marginBottom:'4px'}}>
            <span style={{color: m.completed ? '#86efac' : '#64748b'}}>{m.completed ? '\u2713' : '\u25CB'}</span>
            <span style={{color: m.completed ? '#cbd5e1' : '#94a3b8', textDecoration: m.completed ? 'line-through' : 'none'}}>{m.name}</span>
          </div>)}
        </div>}
        {item.notes && <p style={{color:'#94a3b8',fontSize:'13px'}}>{item.notes}</p>}
      </div>
    )}
    formFields={[
      { key: 'employeeId', label: 'Employee ID', type: 'number' },
      { key: 'planName', label: 'Plan Name' },
      { key: 'department', label: 'Department' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'targetCompletionDate', label: 'Target Completion', type: 'date' },
      { key: 'assignedBuddy', label: 'Assigned Buddy' },
      { key: 'progressPercent', label: 'Progress (%)', type: 'number', min: 0, max: 100 },
      { key: 'status', label: 'Status', type: 'select', options: ['Not Started','In Progress','Completed','Extended'] },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ]}
    apiFns={{ getAll: getOnboardingPlans, create: createOnboardingPlan, update: updateOnboardingPlan, delete: deleteOnboardingPlan }}
    emptyForm={{ employeeId:'', planName:'', department:'', startDate:'', targetCompletionDate:'', assignedBuddy:'', progressPercent:0, status:'Not Started', notes:'' }}
    renderBadge={badge}
  />;
}
