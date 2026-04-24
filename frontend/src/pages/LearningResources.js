import React from 'react';
import CrudPage from '../components/CrudPage';
import { getLearningResources, createLearningResource, updateLearningResource, deleteLearningResource } from '../services/api';

const badge = (key, val) => {
  if (key === 'type') { const map = { Book:'badge-purple', Video:'badge-danger', Podcast:'badge-info', Article:'badge-success', Tool:'badge-warning', Template:'badge-default' }; return <span className={`badge ${map[val]||'badge-default'}`}>{val}</span>; }
  if (key === 'status') { const map = { Available:'badge-success', Unavailable:'badge-danger', 'Coming Soon':'badge-warning' }; return <span className={`badge ${map[val]||'badge-default'}`}>{val}</span>; }
  return val;
};

export default function LearningResources() {
  return <CrudPage title="Learning Resources" exportResource="learning-resources"
    columns={[
      { key: 'title', label: 'Resource' },
      { key: 'type', label: 'Type', badge: true },
      { key: 'author', label: 'Author' },
      { key: 'category', label: 'Category' },
      { key: 'cost', label: 'Cost', render: v => parseFloat(v) === 0 ? 'Free' : `$${v}` },
      { key: 'rating', label: 'Rating', render: v => v > 0 ? `${v}/5` : '-' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    detailFields={[
      { key: 'title', label: 'Title' },
      { key: 'type', label: 'Type', badge: true },
      { key: 'author', label: 'Author' },
      { key: 'category', label: 'Category' },
      { key: 'format', label: 'Format' },
      { key: 'cost', label: 'Cost', render: v => parseFloat(v) === 0 ? 'Free' : `$${v}` },
      { key: 'rating', label: 'Rating', render: v => v > 0 ? `${v}/5` : 'Not rated' },
      { key: 'reviewCount', label: 'Reviews' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    renderDetail={item => (
      <div>
        {item.description && <p style={{color:'#94a3b8',fontSize:'14px',marginBottom:'16px'}}>{item.description}</p>}
        {item.skillTags?.length > 0 && <div style={{marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'8px'}}>SKILL TAGS</div>
          <div className="skill-tags">{item.skillTags.map((t,i) => <span key={i} className="skill-tag">{t}</span>)}</div>
        </div>}
      </div>
    )}
    formFields={[
      { key: 'title', label: 'Title' },
      { key: 'type', label: 'Type', type: 'select', options: ['Book','Video','Podcast','Article','Tool','Template'] },
      { key: 'author', label: 'Author' },
      { key: 'category', label: 'Category' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'format', label: 'Format' },
      { key: 'cost', label: 'Cost ($)', type: 'number' },
      { key: 'rating', label: 'Rating', type: 'number', step: '0.1', min: 0, max: 5 },
      { key: 'status', label: 'Status', type: 'select', options: ['Available','Unavailable','Coming Soon'] },
    ]}
    apiFns={{ getAll: getLearningResources, create: createLearningResource, update: updateLearningResource, delete: deleteLearningResource }}
    emptyForm={{ title:'', type:'Article', author:'', category:'', description:'', format:'', cost:0, rating:0, status:'Available' }}
    renderBadge={badge}
  />;
}
