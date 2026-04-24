import React from 'react';
import CrudPage from '../components/CrudPage';
import { getLearningBudgets, createLearningBudget, updateLearningBudget, deleteLearningBudget } from '../services/api';

const badge = (key, val) => {
  const map = { Active: 'badge-success', Frozen: 'badge-danger', Closed: 'badge-default', Pending: 'badge-warning' };
  return <span className={`badge ${map[val] || 'badge-default'}`}>{val}</span>;
};

export default function LearningBudgets() {
  return <CrudPage title="Learning Budgets" exportResource="learning-budgets"
    columns={[
      { key: 'department', label: 'Department' },
      { key: 'fiscalYear', label: 'Fiscal Year' },
      { key: 'category', label: 'Category' },
      { key: 'totalBudget', label: 'Total', render: v => `$${parseFloat(v).toLocaleString()}` },
      { key: 'spent', label: 'Spent', render: v => `$${parseFloat(v).toLocaleString()}` },
      { key: 'remaining', label: 'Remaining', render: v => `$${parseFloat(v).toLocaleString()}` },
      { key: 'status', label: 'Status', badge: true },
    ]}
    detailFields={[
      { key: 'department', label: 'Department' },
      { key: 'fiscalYear', label: 'Fiscal Year' },
      { key: 'category', label: 'Category' },
      { key: 'totalBudget', label: 'Total Budget', render: v => `$${parseFloat(v).toLocaleString()}` },
      { key: 'allocated', label: 'Allocated', render: v => `$${parseFloat(v).toLocaleString()}` },
      { key: 'spent', label: 'Spent', render: v => `$${parseFloat(v).toLocaleString()}` },
      { key: 'remaining', label: 'Remaining', render: v => `$${parseFloat(v).toLocaleString()}` },
      { key: 'approvedBy', label: 'Approved By' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    renderDetail={item => {
      const pct = item.totalBudget > 0 ? ((item.spent / item.totalBudget) * 100).toFixed(0) : 0;
      return <div style={{marginBottom:'16px'}}>
        <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'8px'}}>UTILIZATION ({pct}%)</div>
        <div className="progress-bar"><div className="fill" style={{width:`${pct}%`, background: pct > 80 ? 'linear-gradient(90deg,#ef4444,#f97316)' : undefined}}></div></div>
        {item.notes && <p style={{color:'#94a3b8',fontSize:'13px',marginTop:'12px'}}>{item.notes}</p>}
      </div>;
    }}
    formFields={[
      { key: 'department', label: 'Department' },
      { key: 'fiscalYear', label: 'Fiscal Year' },
      { key: 'category', label: 'Category' },
      { key: 'totalBudget', label: 'Total Budget ($)', type: 'number' },
      { key: 'allocated', label: 'Allocated ($)', type: 'number' },
      { key: 'spent', label: 'Spent ($)', type: 'number' },
      { key: 'remaining', label: 'Remaining ($)', type: 'number' },
      { key: 'approvedBy', label: 'Approved By' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active','Frozen','Closed','Pending'] },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ]}
    apiFns={{ getAll: getLearningBudgets, create: createLearningBudget, update: updateLearningBudget, delete: deleteLearningBudget }}
    emptyForm={{ department:'', fiscalYear:'FY2026', category:'', totalBudget:0, allocated:0, spent:0, remaining:0, approvedBy:'', status:'Active', notes:'' }}
    renderBadge={badge}
  />;
}
