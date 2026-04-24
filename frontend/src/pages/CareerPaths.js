import React from 'react';
import CrudPage from '../components/CrudPage';
import { getCareerPaths, createCareerPath, updateCareerPath, deleteCareerPath } from '../services/api';

const badge = (key, val) => {
  const map = { Active: 'badge-success', Achieved: 'badge-info', Paused: 'badge-warning', Revised: 'badge-purple' };
  return <span className={`badge ${map[val]||'badge-default'}`}>{val}</span>;
};

export default function CareerPaths() {
  return <CrudPage title="Career Paths" exportResource="career-paths"
    columns={[
      { key: 'employee', label: 'Employee', accessor: i => i.Employee?.name || 'N/A' },
      { key: 'currentRole', label: 'Current Role' },
      { key: 'targetRole', label: 'Target Role' },
      { key: 'estimatedTimeline', label: 'Timeline' },
      { key: 'progressPercent', label: 'Progress', render: v => <div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="progress-bar" style={{width:'80px'}}><div className="fill" style={{width:`${v}%`}}></div></div>{v}%</div> },
      { key: 'status', label: 'Status', badge: true },
    ]}
    detailFields={[
      { key: 'employee', label: 'Employee', accessor: i => i.Employee?.name || 'N/A' },
      { key: 'currentRole', label: 'Current Role' },
      { key: 'targetRole', label: 'Target Role' },
      { key: 'department', label: 'Department' },
      { key: 'estimatedTimeline', label: 'Estimated Timeline' },
      { key: 'mentorName', label: 'Mentor' },
      { key: 'nextMilestone', label: 'Next Milestone' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    renderDetail={item => (
      <div>
        <div style={{marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'8px'}}>PROGRESS ({item.progressPercent}%)</div>
          <div className="progress-bar"><div className="fill" style={{width:`${item.progressPercent}%`}}></div></div>
        </div>
        {item.requiredSkills?.length > 0 && <div style={{marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'8px'}}>REQUIRED SKILLS</div>
          <div className="skill-tags">{item.requiredSkills.map((s,i) => <span key={i} className="skill-tag">{s}</span>)}</div>
        </div>}
        {item.completedMilestones?.length > 0 && <div style={{marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'8px'}}>COMPLETED MILESTONES</div>
          {item.completedMilestones.map((m,i) => <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',color:'#86efac',fontSize:'13px'}}>{'\u2713'} {m}</div>)}
        </div>}
        {item.notes && <p style={{color:'#94a3b8',fontSize:'13px'}}>{item.notes}</p>}
      </div>
    )}
    formFields={[
      { key: 'employeeId', label: 'Employee ID', type: 'number' },
      { key: 'currentRole', label: 'Current Role' },
      { key: 'targetRole', label: 'Target Role' },
      { key: 'department', label: 'Department' },
      { key: 'estimatedTimeline', label: 'Estimated Timeline' },
      { key: 'mentorName', label: 'Mentor Name' },
      { key: 'nextMilestone', label: 'Next Milestone' },
      { key: 'progressPercent', label: 'Progress (%)', type: 'number', min: 0, max: 100 },
      { key: 'status', label: 'Status', type: 'select', options: ['Active','Achieved','Paused','Revised'] },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ]}
    apiFns={{ getAll: getCareerPaths, create: createCareerPath, update: updateCareerPath, delete: deleteCareerPath }}
    emptyForm={{ employeeId:'', currentRole:'', targetRole:'', department:'', estimatedTimeline:'', mentorName:'', nextMilestone:'', progressPercent:0, status:'Active', notes:'' }}
    renderBadge={badge}
  />;
}
