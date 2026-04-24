import React from 'react';
import CrudPage from '../components/CrudPage';
import { getCompetencyFrameworks, createCompetencyFramework, updateCompetencyFramework, deleteCompetencyFramework } from '../services/api';

const badge = (key, val) => {
  const map = { Active: 'badge-success', Draft: 'badge-warning', Archived: 'badge-default' };
  return <span className={`badge ${map[val] || 'badge-default'}`}>{val}</span>;
};

export default function CompetencyFrameworks() {
  return <CrudPage title="Competency Frameworks" exportResource="competency-frameworks"
    columns={[
      { key: 'name', label: 'Framework' },
      { key: 'category', label: 'Category' },
      { key: 'department', label: 'Department' },
      { key: 'level', label: 'Level' },
      { key: 'version', label: 'Version' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    detailFields={[
      { key: 'name', label: 'Framework Name' },
      { key: 'category', label: 'Category' },
      { key: 'department', label: 'Department' },
      { key: 'level', label: 'Target Level' },
      { key: 'version', label: 'Version' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    renderDetail={item => (
      <div>
        {item.description && <p style={{color:'#94a3b8',fontSize:'14px',marginBottom:'16px'}}>{item.description}</p>}
        {item.requiredSkills?.length > 0 && <div style={{marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'8px'}}>REQUIRED SKILLS</div>
          <div className="skill-tags">{item.requiredSkills.map((s,i) => <span key={i} className="skill-tag">{s}</span>)}</div>
        </div>}
        {item.assessmentCriteria && <div style={{background:'rgba(15,23,42,0.4)',borderRadius:'12px',padding:'16px',marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'6px'}}>ASSESSMENT CRITERIA</div>
          <p style={{color:'#cbd5e1',fontSize:'14px'}}>{item.assessmentCriteria}</p>
        </div>}
      </div>
    )}
    formFields={[
      { key: 'name', label: 'Framework Name' },
      { key: 'category', label: 'Category', type: 'select', options: ['Technical','Behavioral','Leadership'] },
      { key: 'department', label: 'Department' },
      { key: 'level', label: 'Target Level' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'assessmentCriteria', label: 'Assessment Criteria', type: 'textarea' },
      { key: 'version', label: 'Version' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active','Draft','Archived'] },
    ]}
    apiFns={{ getAll: getCompetencyFrameworks, create: createCompetencyFramework, update: updateCompetencyFramework, delete: deleteCompetencyFramework }}
    emptyForm={{ name:'', category:'Technical', department:'', level:'', description:'', assessmentCriteria:'', version:'1.0', status:'Draft' }}
    renderBadge={badge}
  />;
}
