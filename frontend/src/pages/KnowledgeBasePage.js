import React from 'react';
import CrudPage from '../components/CrudPage';
import { getKnowledgeBaseArticles, createKnowledgeBaseArticle, updateKnowledgeBaseArticle, deleteKnowledgeBaseArticle } from '../services/api';

const badge = (key, val) => {
  const map = { Published: 'badge-success', Draft: 'badge-warning', Archived: 'badge-default', 'Under Review': 'badge-info' };
  return <span className={`badge ${map[val] || 'badge-default'}`}>{val}</span>;
};

export default function KnowledgeBasePage() {
  return <CrudPage title="Knowledge Base" exportResource="knowledge-base"
    columns={[
      { key: 'title', label: 'Article' },
      { key: 'author', label: 'Author' },
      { key: 'category', label: 'Category' },
      { key: 'department', label: 'Department' },
      { key: 'views', label: 'Views' },
      { key: 'rating', label: 'Rating', render: v => v > 0 ? `${v}/5` : '-' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    detailFields={[
      { key: 'title', label: 'Title' },
      { key: 'author', label: 'Author' },
      { key: 'category', label: 'Category' },
      { key: 'department', label: 'Department' },
      { key: 'views', label: 'Views' },
      { key: 'rating', label: 'Rating', render: v => v > 0 ? `${v}/5` : 'Not rated' },
      { key: 'lastUpdated', label: 'Last Updated' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    renderDetail={item => (
      <div>
        {item.tags?.length > 0 && <div style={{marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'8px'}}>TAGS</div>
          <div className="skill-tags">{item.tags.map((t,i) => <span key={i} className="skill-tag">{t}</span>)}</div>
        </div>}
        {item.content && <div style={{background:'rgba(15,23,42,0.4)',borderRadius:'12px',padding:'16px',marginBottom:'16px'}}>
          <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'6px'}}>CONTENT</div>
          <p style={{color:'#cbd5e1',fontSize:'14px',lineHeight:'1.7'}}>{item.content}</p>
        </div>}
      </div>
    )}
    formFields={[
      { key: 'title', label: 'Title' },
      { key: 'author', label: 'Author' },
      { key: 'category', label: 'Category', type: 'select', options: ['Technical Guide','Best Practice','How-To','Template'] },
      { key: 'department', label: 'Department' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'lastUpdated', label: 'Last Updated', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['Published','Draft','Archived','Under Review'] },
    ]}
    apiFns={{ getAll: getKnowledgeBaseArticles, create: createKnowledgeBaseArticle, update: updateKnowledgeBaseArticle, delete: deleteKnowledgeBaseArticle }}
    emptyForm={{ title:'', author:'', category:'Technical Guide', department:'', content:'', lastUpdated:'', status:'Draft' }}
    renderBadge={badge}
  />;
}
