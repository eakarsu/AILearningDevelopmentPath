import React from 'react';
import CrudPage from '../components/CrudPage';
import { getWellnessPrograms, createWellnessProgram, updateWellnessProgram, deleteWellnessProgram } from '../services/api';

const badge = (key, val) => {
  if (key === 'status') { const map = { Active: 'badge-success', Completed: 'badge-info', Upcoming: 'badge-warning', Cancelled: 'badge-danger' }; return <span className={`badge ${map[val]||'badge-default'}`}>{val}</span>; }
  if (key === 'category') { const map = { Physical: 'badge-success', Mental: 'badge-purple', Financial: 'badge-warning', Social: 'badge-info', 'Work-Life Balance': 'badge-default' }; return <span className={`badge ${map[val]||'badge-default'}`}>{val}</span>; }
  return val;
};

export default function WellnessPrograms() {
  return <CrudPage title="Wellness Programs" exportResource="wellness-programs"
    columns={[
      { key: 'programName', label: 'Program' },
      { key: 'category', label: 'Category', badge: true },
      { key: 'provider', label: 'Provider' },
      { key: 'participantCount', label: 'Participants', render: (v,i) => `${v}/${i.capacity}` },
      { key: 'format', label: 'Format' },
      { key: 'satisfactionScore', label: 'Satisfaction', render: v => v > 0 ? `${v}/5` : '-' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    detailFields={[
      { key: 'programName', label: 'Program' },
      { key: 'category', label: 'Category', badge: true },
      { key: 'provider', label: 'Provider' },
      { key: 'startDate', label: 'Start Date' },
      { key: 'endDate', label: 'End Date' },
      { key: 'participantCount', label: 'Participants', render: (v,i) => `${v}/${i.capacity}` },
      { key: 'cost', label: 'Cost', render: v => parseFloat(v) === 0 ? 'Free' : `$${v}` },
      { key: 'format', label: 'Format' },
      { key: 'satisfactionScore', label: 'Satisfaction', render: v => v > 0 ? `${v}/5` : 'Not rated' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    renderDetail={item => item.description && <p style={{color:'#94a3b8',fontSize:'14px',marginBottom:'16px'}}>{item.description}</p>}
    formFields={[
      { key: 'programName', label: 'Program Name' },
      { key: 'category', label: 'Category', type: 'select', options: ['Physical','Mental','Financial','Social','Work-Life Balance'] },
      { key: 'provider', label: 'Provider' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'capacity', label: 'Capacity', type: 'number' },
      { key: 'participantCount', label: 'Participants', type: 'number' },
      { key: 'cost', label: 'Cost ($)', type: 'number' },
      { key: 'format', label: 'Format', type: 'select', options: ['In-Person','Virtual','Hybrid','Self-Paced'] },
      { key: 'satisfactionScore', label: 'Satisfaction (0-5)', type: 'number', step: '0.1', min: 0, max: 5 },
      { key: 'status', label: 'Status', type: 'select', options: ['Active','Completed','Upcoming','Cancelled'] },
    ]}
    apiFns={{ getAll: getWellnessPrograms, create: createWellnessProgram, update: updateWellnessProgram, delete: deleteWellnessProgram }}
    emptyForm={{ programName:'', category:'Mental', provider:'', description:'', startDate:'', endDate:'', capacity:50, participantCount:0, cost:0, format:'Virtual', satisfactionScore:0, status:'Upcoming' }}
    renderBadge={badge}
  />;
}
