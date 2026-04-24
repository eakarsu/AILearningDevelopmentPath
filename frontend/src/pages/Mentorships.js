import React from 'react';
import CrudPage from '../components/CrudPage';
import { getMentorships, createMentorship, updateMentorship, deleteMentorship } from '../services/api';

const badge = (key, val) => {
  const map = { Active: 'badge-success', Completed: 'badge-info', Paused: 'badge-warning', Cancelled: 'badge-danger' };
  return <span className={`badge ${map[val] || 'badge-default'}`}>{val}</span>;
};

export default function Mentorships() {
  return <CrudPage
    title="Mentorship Programs" exportResource="mentorships"
    columns={[
      { key: 'programName', label: 'Program' },
      { key: 'mentor', label: 'Mentor', accessor: i => i.Mentor?.name || 'N/A' },
      { key: 'mentee', label: 'Mentee', accessor: i => i.Mentee?.name || 'N/A' },
      { key: 'focus', label: 'Focus' },
      { key: 'status', label: 'Status', badge: true },
      { key: 'meetingFrequency', label: 'Frequency' },
      { key: 'rating', label: 'Rating', render: v => v > 0 ? `${v}/5` : '-' },
    ]}
    detailFields={[
      { key: 'programName', label: 'Program Name' },
      { key: 'mentor', label: 'Mentor', accessor: i => i.Mentor?.name || 'N/A' },
      { key: 'mentee', label: 'Mentee', accessor: i => i.Mentee?.name || 'N/A' },
      { key: 'focus', label: 'Focus Area' },
      { key: 'status', label: 'Status', badge: true },
      { key: 'startDate', label: 'Start Date' },
      { key: 'endDate', label: 'End Date', render: v => v || 'Ongoing' },
      { key: 'meetingFrequency', label: 'Meeting Frequency' },
      { key: 'rating', label: 'Rating', render: v => v > 0 ? `${v}/5` : 'Not rated' },
    ]}
    renderDetail={item => item.goalDescription && (
      <div style={{background:'rgba(15,23,42,0.4)',borderRadius:'12px',padding:'16px',marginBottom:'16px'}}>
        <div className="label" style={{fontSize:'12px',color:'#64748b',fontWeight:600,marginBottom:'6px'}}>GOAL</div>
        <p style={{color:'#cbd5e1',fontSize:'14px'}}>{item.goalDescription}</p>
        {item.progressNotes && <p style={{color:'#94a3b8',fontSize:'13px',marginTop:'8px'}}>Notes: {item.progressNotes}</p>}
      </div>
    )}
    formFields={[
      { key: 'programName', label: 'Program Name' },
      { key: 'mentorId', label: 'Mentor ID', type: 'number' },
      { key: 'menteeId', label: 'Mentee ID', type: 'number' },
      { key: 'focus', label: 'Focus Area' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active','Completed','Paused','Cancelled'] },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'meetingFrequency', label: 'Meeting Frequency', type: 'select', options: ['Weekly','Bi-weekly','Monthly'] },
      { key: 'goalDescription', label: 'Goal Description', type: 'textarea' },
      { key: 'rating', label: 'Rating (0-5)', type: 'number', step: '0.1', min: 0, max: 5 },
    ]}
    apiFns={{ getAll: getMentorships, create: createMentorship, update: updateMentorship, delete: deleteMentorship }}
    emptyForm={{ programName:'', mentorId:'', menteeId:'', focus:'', status:'Active', startDate:'', endDate:'', meetingFrequency:'Weekly', goalDescription:'', rating:0 }}
    renderBadge={badge}
  />;
}
