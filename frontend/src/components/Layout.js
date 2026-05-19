import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import NotificationCenter from './NotificationCenter';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '\u2302' },
  { section: 'Management' },
  { path: '/employees', label: 'Employees', icon: '\u263A' },
  { path: '/tracks', label: 'Learning Tracks', icon: '\u2691' },
  { path: '/skill-gaps', label: 'Skill Gap Analysis', icon: '\u26A0' },
  { path: '/career-paths', label: 'Career Paths', icon: '\u2669' },
  { path: '/succession-plans', label: 'Succession Plans', icon: '\u265B' },
  { section: 'Resources' },
  { path: '/certifications', label: 'Certifications', icon: '\u2605' },
  { path: '/courses', label: 'Course Catalog', icon: '\u2630' },
  { path: '/learning-resources', label: 'Learning Resources', icon: '\u2637' },
  { path: '/knowledge-base', label: 'Knowledge Base', icon: '\u270E' },
  { section: 'Programs' },
  { path: '/mentorships', label: 'Mentorship Programs', icon: '\u2764' },
  { path: '/training-events', label: 'Training Events', icon: '\u2600' },
  { path: '/onboarding', label: 'Onboarding Plans', icon: '\u2708' },
  { path: '/compliance', label: 'Compliance Training', icon: '\u2611' },
  { path: '/wellness', label: 'Wellness Programs', icon: '\u2618' },
  { section: 'Analytics' },
  { path: '/roi', label: 'ROI Measurement', icon: '\u2197' },
  { path: '/performance-reviews', label: 'Performance Reviews', icon: '\u2606' },
  { path: '/assessments', label: 'Assessment Results', icon: '\u2714' },
  { path: '/feedback-surveys', label: 'Feedback Surveys', icon: '\u2709' },
  { section: 'Planning' },
  { path: '/learning-budgets', label: 'Learning Budgets', icon: '\u20AC' },
  { path: '/competency-frameworks', label: 'Competency Frameworks', icon: '\u2699' },
  { path: '/team-goals', label: 'Team Goals', icon: '\u2690' },
  { section: 'AI' },
  { path: '/ai-tools', label: 'AI Tools', icon: '\u2728' },
  { section: 'Custom' },
  { path: '/custom-views', label: 'L&D Views', icon: '\u25c9' },
];

function Layout({ children, user, onLogout }) {
  const location = useLocation();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="icon">AI</div>
          <h2>Learning &<br/>Development</h2>
        </div>
        <ul className="sidebar-nav">
          {navItems.map((item, i) => {
            if (item.section) {
              return <li key={i} className="sidebar-section">{item.section}</li>;
            }
            return (
              <li key={item.path}>
                <Link to={item.path} className={location.pathname === item.path ? 'active' : ''}>
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="sidebar-user-details">
              <div className="name">{user?.name}</div>
              <div className="role">{user?.role}</div>
            </div>
            <button onClick={onLogout} className="btn btn-sm btn-secondary" style={{padding: '6px 10px', fontSize: '11px'}}>
              Logout
            </button>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <div className="top-bar">
          <SearchBar />
          <NotificationCenter />
        </div>
        {children}
      </main>
    </div>
  );
}

export default Layout;
