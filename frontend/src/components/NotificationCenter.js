import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../services/api';

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getNotifications();
      setNotifications(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); const interval = setInterval(load, 60000); return () => clearInterval(interval); }, []);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const dangerCount = notifications.filter(n => n.type === 'danger').length;
  const warningCount = notifications.filter(n => n.type === 'warning').length;
  const totalUrgent = dangerCount + warningCount;

  const typeIcon = { danger: '!', warning: '!', info: 'i' };
  const typeColors = {
    danger: { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '#ef4444' },
    warning: { bg: 'rgba(234,179,8,0.15)', color: '#fde047', border: '#eab308' },
    info: { bg: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '#3b82f6' },
  };

  return (
    <div className="notification-center" ref={ref}>
      <button className="notification-bell" onClick={() => { setOpen(!open); if (!open) load(); }}>
        <span className="bell-icon">&#x1F514;</span>
        {totalUrgent > 0 && <span className="notification-badge-count">{totalUrgent}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <span className="notification-count">{notifications.length} alerts</span>
          </div>
          <div className="notification-list">
            {loading && <div className="notification-empty">Loading...</div>}
            {!loading && notifications.length === 0 && (
              <div className="notification-empty">No notifications</div>
            )}
            {!loading && notifications.map(n => {
              const style = typeColors[n.type] || typeColors.info;
              return (
                <div
                  key={n.id}
                  className="notification-item"
                  style={{ borderLeftColor: style.border }}
                  onClick={() => { navigate(n.link); setOpen(false); }}
                >
                  <div className="notification-icon" style={{ background: style.bg, color: style.color }}>
                    {typeIcon[n.type]}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{n.title}</div>
                    <div className="notification-message">{n.message}</div>
                    <div className="notification-meta">
                      <span className="notification-category">{n.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
