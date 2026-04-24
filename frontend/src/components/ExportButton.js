import React, { useState, useContext } from 'react';
import { exportCSV } from '../services/api';
import { ToastContext } from '../App';

function ExportButton({ resource, label }) {
  const [loading, setLoading] = useState(false);
  const addToast = useContext(ToastContext);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await exportCSV(resource);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resource}-export.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      addToast(`${label || resource} exported successfully`);
    } catch (e) {
      addToast('Export failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="btn btn-secondary btn-sm" onClick={handleExport} disabled={loading}>
      {loading ? 'Exporting...' : 'Export CSV'}
    </button>
  );
}

export default ExportButton;
