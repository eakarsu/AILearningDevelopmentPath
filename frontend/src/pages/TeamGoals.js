import React from 'react';
import CrudPage from '../components/CrudPage';
import { getTeamGoals, createTeamGoal, updateTeamGoal, deleteTeamGoal } from '../services/api';

const badge = (key, val) => {
  if (key === 'status') {
    const map = { 'On Track': 'badge-success', 'At Risk': 'badge-warning', Behind: 'badge-danger', Completed: 'badge-info', Cancelled: 'badge-default' };
    return <span className={`badge ${map[val] || 'badge-default'}`}>{val}</span>;
  }
  if (key === 'priority') {
    const map = { High: 'badge-danger', Medium: 'badge-warning', Low: 'badge-success' };
    return <span className={`badge ${map[val] || 'badge-default'}`}>{val}</span>;
  }
  return val;
};

export default function TeamGoals() {
  return <CrudPage title="Team Goals" exportResource="team-goals"
    columns={[
      { key: 'title', label: 'Goal' },
      { key: 'department', label: 'Department' },
      { key: 'category', label: 'Category' },
      { key: 'priority', label: 'Priority', badge: true },
      { key: 'progressPercent', label: 'Progress', render: v => <div style={{display:'flex',alignItems:'center',gap:'8px'}}><div className="progress-bar" style={{width:'80px'}}><div className="fill" style={{width:`${v}%`}}></div></div>{v}%</div> },
      { key: 'owner', label: 'Owner' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    detailFields={[
      { key: 'title', label: 'Goal' },
      { key: 'department', label: 'Department' },
      { key: 'category', label: 'Category' },
      { key: 'quarter', label: 'Quarter' },
      { key: 'targetDate', label: 'Target Date' },
      { key: 'owner', label: 'Owner' },
      { key: 'priority', label: 'Priority', badge: true },
      { key: 'status', label: 'Status', badge: true },
    ]}
    renderDetail={item => (
      <div>
        <div style={{marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'8px'}}>PROGRESS ({item.progressPercent}%)</div>
          <div className="progress-bar"><div className="fill" style={{width:`${item.progressPercent}%`}}></div></div>
        </div>
        {item.description && <p style={{color:'#94a3b8',fontSize:'14px',marginBottom:'16px'}}>{item.description}</p>}
        {item.keyResults?.length > 0 && <div style={{marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'8px'}}>KEY RESULTS</div>
          {item.keyResults.map((kr,i) => <div key={i} style={{background:'rgba(15,23,42,0.4)',borderRadius:'8px',padding:'12px',marginBottom:'4px',display:'flex',justifyContent:'space-between'}}>
            <span style={{color:'#cbd5e1'}}>{kr.result}</span>
            <span style={{color:'#a5b4fc',fontWeight:600}}>{typeof kr.current !== 'undefined' ? `${kr.current}/${kr.target}` : ''}</span>
          </div>)}
        </div>}
      </div>
    )}
    formFields={[
      { key: 'title', label: 'Goal Title' },
      { key: 'department', label: 'Department' },
      { key: 'category', label: 'Category' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'targetDate', label: 'Target Date', type: 'date' },
      { key: 'owner', label: 'Owner' },
      { key: 'quarter', label: 'Quarter' },
      { key: 'progressPercent', label: 'Progress (%)', type: 'number', min: 0, max: 100 },
      { key: 'priority', label: 'Priority', type: 'select', options: ['High','Medium','Low'] },
      { key: 'status', label: 'Status', type: 'select', options: ['On Track','At Risk','Behind','Completed','Cancelled'] },
    ]}
    apiFns={{ getAll: getTeamGoals, create: createTeamGoal, update: updateTeamGoal, delete: deleteTeamGoal }}
    emptyForm={{ title:'', department:'', category:'', description:'', targetDate:'', owner:'', quarter:'', progressPercent:0, priority:'Medium', status:'On Track' }}
    renderBadge={badge}
  />;
}
