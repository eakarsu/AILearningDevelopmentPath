import React from 'react';

function Toast({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' ? '\u2713' : '\u2717'} {t.message}
        </div>
      ))}
    </div>
  );
}

export default Toast;
