import React from 'react';
import CrudPage from '../components/CrudPage';
import { getTrainingEvents, createTrainingEvent, updateTrainingEvent, deleteTrainingEvent } from '../services/api';

const badge = (key, val) => {
  if (key === 'status') {
    const map = { Upcoming: 'badge-info', 'In Progress': 'badge-warning', Completed: 'badge-success', Cancelled: 'badge-danger' };
    return <span className={`badge ${map[val] || 'badge-default'}`}>{val}</span>;
  }
  if (key === 'type') {
    const map = { Workshop: 'badge-purple', Seminar: 'badge-info', Webinar: 'badge-success', Conference: 'badge-warning', Bootcamp: 'badge-danger' };
    return <span className={`badge ${map[val] || 'badge-default'}`}>{val}</span>;
  }
  return val;
};

export default function TrainingEvents() {
  return <CrudPage
    title="Training Events" exportResource="training-events"
    columns={[
      { key: 'title', label: 'Event' },
      { key: 'type', label: 'Type', badge: true },
      { key: 'facilitator', label: 'Facilitator' },
      { key: 'startDate', label: 'Date' },
      { key: 'capacity', label: 'Capacity', render: (v, i) => `${i.enrolled}/${v}` },
      { key: 'status', label: 'Status', badge: true },
      { key: 'cost', label: 'Cost', render: v => parseFloat(v) === 0 ? 'Free' : `$${v}` },
    ]}
    detailFields={[
      { key: 'title', label: 'Event Title' },
      { key: 'type', label: 'Type', badge: true },
      { key: 'facilitator', label: 'Facilitator' },
      { key: 'location', label: 'Location' },
      { key: 'startDate', label: 'Start Date' },
      { key: 'endDate', label: 'End Date' },
      { key: 'capacity', label: 'Enrollment', render: (v, i) => `${i.enrolled}/${v} seats` },
      { key: 'cost', label: 'Cost', render: v => parseFloat(v) === 0 ? 'Free' : `$${v}` },
      { key: 'status', label: 'Status', badge: true },
      { key: 'category', label: 'Category' },
    ]}
    formFields={[
      { key: 'title', label: 'Title' },
      { key: 'type', label: 'Type', type: 'select', options: ['Workshop','Seminar','Webinar','Conference','Bootcamp'] },
      { key: 'facilitator', label: 'Facilitator' },
      { key: 'location', label: 'Location' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'capacity', label: 'Capacity', type: 'number' },
      { key: 'enrolled', label: 'Enrolled', type: 'number' },
      { key: 'cost', label: 'Cost ($)', type: 'number' },
      { key: 'category', label: 'Category' },
      { key: 'status', label: 'Status', type: 'select', options: ['Upcoming','In Progress','Completed','Cancelled'] },
      { key: 'description', label: 'Description', type: 'textarea' },
    ]}
    apiFns={{ getAll: getTrainingEvents, create: createTrainingEvent, update: updateTrainingEvent, delete: deleteTrainingEvent }}
    emptyForm={{ title:'', type:'Workshop', facilitator:'', location:'', startDate:'', endDate:'', capacity:50, enrolled:0, cost:0, category:'', status:'Upcoming', description:'' }}
    renderBadge={badge}
  />;
}
