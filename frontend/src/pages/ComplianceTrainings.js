import React from 'react';
import CrudPage from '../components/CrudPage';
import { getComplianceTrainings, createComplianceTraining, updateComplianceTraining, deleteComplianceTraining } from '../services/api';

const badge = (key, val) => {
  const map = { Completed: 'badge-success', Overdue: 'badge-danger', 'In Progress': 'badge-info', 'Not Started': 'badge-warning' };
  return <span className={`badge ${map[val]||'badge-default'}`}>{val}</span>;
};

export default function ComplianceTrainings() {
  return <CrudPage title="Compliance Training" exportResource="compliance-trainings"
    columns={[
      { key: 'trainingName', label: 'Training' },
      { key: 'employee', label: 'Employee', accessor: i => i.Employee?.name || 'N/A' },
      { key: 'regulatoryBody', label: 'Regulatory Body' },
      { key: 'category', label: 'Category' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'actualScore', label: 'Score', render: (v,i) => v ? `${v}/${i.passingScore}` : '-' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    detailFields={[
      { key: 'trainingName', label: 'Training Name' },
      { key: 'employee', label: 'Employee', accessor: i => i.Employee?.name || 'N/A' },
      { key: 'regulatoryBody', label: 'Regulatory Body' },
      { key: 'category', label: 'Category' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'completionDate', label: 'Completed', render: v => v || 'Not completed' },
      { key: 'validUntil', label: 'Valid Until' },
      { key: 'passingScore', label: 'Passing Score' },
      { key: 'actualScore', label: 'Actual Score', render: v => v || 'N/A' },
      { key: 'mandatory', label: 'Mandatory', render: v => v ? 'Yes' : 'No' },
      { key: 'status', label: 'Status', badge: true },
    ]}
    formFields={[
      { key: 'employeeId', label: 'Employee ID', type: 'number' },
      { key: 'trainingName', label: 'Training Name' },
      { key: 'regulatoryBody', label: 'Regulatory Body' },
      { key: 'category', label: 'Category' },
      { key: 'dueDate', label: 'Due Date', type: 'date' },
      { key: 'completionDate', label: 'Completion Date', type: 'date' },
      { key: 'validUntil', label: 'Valid Until', type: 'date' },
      { key: 'passingScore', label: 'Passing Score', type: 'number' },
      { key: 'actualScore', label: 'Actual Score', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Completed','Overdue','In Progress','Not Started'] },
    ]}
    apiFns={{ getAll: getComplianceTrainings, create: createComplianceTraining, update: updateComplianceTraining, delete: deleteComplianceTraining }}
    emptyForm={{ employeeId:'', trainingName:'', regulatoryBody:'', category:'', dueDate:'', completionDate:'', validUntil:'', passingScore:80, actualScore:'', status:'Not Started' }}
    renderBadge={badge}
  />;
}
