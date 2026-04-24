import React from 'react';
import CrudPage from '../components/CrudPage';
import { getAssessmentResults, createAssessmentResult, updateAssessmentResult, deleteAssessmentResult } from '../services/api';

const badge = (key, val) => {
  if (key === 'status') { const map = { Passed: 'badge-success', Failed: 'badge-danger', 'Pending Review': 'badge-warning', 'In Progress': 'badge-info' }; return <span className={`badge ${map[val]||'badge-default'}`}>{val}</span>; }
  if (key === 'type') { return <span className="badge badge-purple">{val}</span>; }
  return val;
};

export default function AssessmentResults() {
  return <CrudPage title="Assessment Results" exportResource="assessment-results"
    columns={[
      { key: 'assessmentName', label: 'Assessment' },
      { key: 'employee', label: 'Employee', accessor: i => i.Employee?.name || 'N/A' },
      { key: 'type', label: 'Type', badge: true },
      { key: 'category', label: 'Category' },
      { key: 'score', label: 'Score', render: (v,i) => <span style={{color: parseFloat(v) >= parseFloat(i.passingScore) ? '#86efac' : '#fca5a5', fontWeight: 700}}>{v}/{i.maxScore}</span> },
      { key: 'duration', label: 'Duration', render: v => `${v} min` },
      { key: 'status', label: 'Status', badge: true },
    ]}
    detailFields={[
      { key: 'assessmentName', label: 'Assessment' },
      { key: 'employee', label: 'Employee', accessor: i => i.Employee?.name || 'N/A' },
      { key: 'type', label: 'Type', badge: true },
      { key: 'category', label: 'Category' },
      { key: 'score', label: 'Score', render: (v,i) => `${v}/${i.maxScore}` },
      { key: 'passingScore', label: 'Passing Score' },
      { key: 'passed', label: 'Passed', render: v => v ? 'Yes' : 'No' },
      { key: 'assessmentDate', label: 'Date' },
      { key: 'duration', label: 'Duration', render: v => `${v} minutes` },
      { key: 'status', label: 'Status', badge: true },
    ]}
    formFields={[
      { key: 'employeeId', label: 'Employee ID', type: 'number' },
      { key: 'assessmentName', label: 'Assessment Name' },
      { key: 'type', label: 'Type', type: 'select', options: ['Pre-Training','Post-Training','Certification','Skill Check','Annual'] },
      { key: 'category', label: 'Category' },
      { key: 'score', label: 'Score', type: 'number' },
      { key: 'maxScore', label: 'Max Score', type: 'number' },
      { key: 'passingScore', label: 'Passing Score', type: 'number' },
      { key: 'assessmentDate', label: 'Assessment Date', type: 'date' },
      { key: 'duration', label: 'Duration (minutes)', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Passed','Failed','Pending Review','In Progress'] },
    ]}
    apiFns={{ getAll: getAssessmentResults, create: createAssessmentResult, update: updateAssessmentResult, delete: deleteAssessmentResult }}
    emptyForm={{ employeeId:'', assessmentName:'', type:'Skill Check', category:'', score:0, maxScore:100, passingScore:70, assessmentDate:'', duration:60, status:'In Progress' }}
    renderBadge={badge}
  />;
}
