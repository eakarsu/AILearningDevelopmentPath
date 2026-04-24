import React, { useState, useEffect, useContext } from 'react';
import { ToastContext } from '../App';
import Modal from './Modal';
import ExportButton from './ExportButton';

function CrudPage({ title, columns, detailFields, formFields, apiFns, emptyForm, renderBadge, renderDetail, exportResource }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');
  const addToast = useContext(ToastContext);

  const load = async () => {
    try { const { data } = await apiFns.getAll(); setItems(data); }
    catch (e) { addToast('Failed to load', 'error'); }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      if (editMode) { await apiFns.update(form.id, form); addToast(`${title.slice(0,-1) || title} updated`); }
      else { await apiFns.create(form); addToast(`${title.slice(0,-1) || title} created`); }
      setShowModal(false); setForm(emptyForm); load(); setSelected(null);
    } catch (e) { addToast(e.response?.data?.error || 'Save failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try { await apiFns.delete(id); addToast('Deleted'); setSelected(null); load(); }
    catch (e) { addToast('Delete failed', 'error'); }
  };

  const openNew = () => { setForm(emptyForm); setEditMode(false); setShowModal(true); };
  const openEdit = (item) => { setForm({...item}); setEditMode(true); setShowModal(true); };

  const setField = (key, val) => setForm(prev => ({...prev, [key]: val}));

  const renderValue = (item, col) => {
    const val = col.accessor ? col.accessor(item) : item[col.key];
    if (col.badge && renderBadge) return renderBadge(col.key, val);
    if (col.render) return col.render(val, item);
    return val ?? 'N/A';
  };

  const renderDetailValue = (field, item) => {
    const val = field.accessor ? field.accessor(item) : item[field.key];
    if (field.badge && renderBadge) return renderBadge(field.key, val);
    if (field.render) return field.render(val, item);
    return val ?? 'N/A';
  };

  // Simple text search across all visible columns
  const filteredItems = searchTerm
    ? items.filter(item => {
        const term = searchTerm.toLowerCase();
        return columns.some(col => {
          const val = col.accessor ? col.accessor(item) : item[col.key];
          return val && String(val).toLowerCase().includes(term);
        });
      })
    : items;

  return (
    <div>
      <div className="page-header">
        <h1>{title} ({filteredItems.length})</h1>
        <div className="page-header-actions">
          {exportResource && <ExportButton resource={exportResource} label={title} />}
          <button className="btn btn-primary btn-sm" onClick={openNew}>+ New</button>
        </div>
      </div>

      <div className="filter-bar">
        <input className="filter-search" type="text" placeholder={`Search ${title.toLowerCase()}...`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        {searchTerm && <button className="btn btn-secondary btn-sm" onClick={() => setSearchTerm('')}>Clear</button>}
      </div>

      {selected && (
        <div className="detail-panel">
          <h2>
            {selected[detailFields[0]?.key] || selected.title || selected.name || selected.programName || 'Details'}
            <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>Close</button>
          </h2>
          <div className="detail-grid">
            {detailFields.map(f => (
              <div key={f.key || f.label} className="detail-item">
                <div className="label">{f.label}</div>
                <div className="value">{renderDetailValue(f, selected)}</div>
              </div>
            ))}
          </div>
          {renderDetail && renderDetail(selected)}
          <div className="detail-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(selected)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>Delete</button>
          </div>
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead><tr>{columns.map(c => <th key={c.key || c.label}>{c.label}</th>)}</tr></thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id} onClick={() => setSelected(item)}>
                {columns.map((col, i) => (
                  <td key={col.key || col.label} style={i === 0 ? {fontWeight: 600, color: '#e2e8f0'} : {}}>
                    {renderValue(item, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editMode ? `Edit` : `New`} onClose={() => setShowModal(false)}>
          {formFields.map(f => (
            <div key={f.key} className="form-group">
              <label>{f.label}</label>
              {f.type === 'select' ? (
                <select value={form[f.key] || ''} onChange={e => setField(f.key, e.target.value)}>
                  <option value="">{f.placeholder || 'Select...'}</option>
                  {(f.options || []).map(o => (
                    <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
                      {typeof o === 'string' ? o : o.label}
                    </option>
                  ))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea value={form[f.key] || ''} onChange={e => setField(f.key, e.target.value)} />
              ) : (
                <input type={f.type || 'text'} value={form[f.key] ?? ''} onChange={e => setField(f.key, f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)} step={f.step} min={f.min} max={f.max} />
              )}
            </div>
          ))}
          <div className="modal-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>{editMode ? 'Update' : 'Create'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CrudPage;
