import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { getEmployees, getTracks, getSkillGaps, getCertifications, getCourses, getROIMeasurements,
  getMentorships, getTrainingEvents, getPerformanceReviews, getLearningBudgets, getCompetencyFrameworks,
  getOnboardingPlans, getTeamGoals, getKnowledgeBaseArticles, getFeedbackSurveys, getSuccessionPlans,
  getComplianceTrainings, getCareerPaths, getLearningResources, getAssessmentResults, getWellnessPrograms,
  getDashboardAnalytics } from '../services/api';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6', '#14b8a6', '#f97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="chart-tooltip-value" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          {p.name === 'roi' ? '%' : p.name === 'investment' || p.name === 'return' ? '' : ''}
        </div>
      ))}
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    employees: 0, tracks: 0, skillGaps: 0, certifications: 0, courses: 0, roi: 0,
    activeTracks: 0, criticalGaps: 0, activeCerts: 0, avgROI: 0,
    mentorships: 0, trainingEvents: 0, performanceReviews: 0, learningBudgets: 0,
    competencyFrameworks: 0, onboardingPlans: 0, teamGoals: 0, knowledgeBase: 0,
    feedbackSurveys: 0, successionPlans: 0, complianceTrainings: 0, careerPaths: 0,
    learningResources: 0, assessmentResults: 0, wellnessPrograms: 0
  });
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [emp, trk, sg, cert, crs, roi, ment, te, pr, lb, cf, ob, tg, kb, fs, sp, ct, cp, lr, ar, wp] = await Promise.all([
          getEmployees(), getTracks(), getSkillGaps(), getCertifications(), getCourses(), getROIMeasurements(),
          getMentorships(), getTrainingEvents(), getPerformanceReviews(), getLearningBudgets(),
          getCompetencyFrameworks(), getOnboardingPlans(), getTeamGoals(), getKnowledgeBaseArticles(),
          getFeedbackSurveys(), getSuccessionPlans(), getComplianceTrainings(), getCareerPaths(),
          getLearningResources(), getAssessmentResults(), getWellnessPrograms()
        ]);
        const roiData = roi.data;
        const avgROI = roiData.length > 0
          ? (roiData.reduce((sum, r) => sum + parseFloat(r.roiPercentage || 0), 0) / roiData.length).toFixed(1)
          : 0;
        setStats({
          employees: emp.data.length, tracks: trk.data.length, skillGaps: sg.data.length,
          certifications: cert.data.length, courses: crs.data.length, roi: roiData.length,
          activeTracks: trk.data.filter(t => t.status === 'In Progress').length,
          criticalGaps: sg.data.filter(g => g.priority === 'Critical').length,
          activeCerts: cert.data.filter(c => c.status === 'Active').length,
          avgROI, mentorships: ment.data.length, trainingEvents: te.data.length,
          performanceReviews: pr.data.length, learningBudgets: lb.data.length,
          competencyFrameworks: cf.data.length, onboardingPlans: ob.data.length,
          teamGoals: tg.data.length, knowledgeBase: kb.data.length,
          feedbackSurveys: fs.data.length, successionPlans: sp.data.length,
          complianceTrainings: ct.data.length, careerPaths: cp.data.length,
          learningResources: lr.data.length, assessmentResults: ar.data.length,
          wellnessPrograms: wp.data.length
        });
      } catch (err) { console.error(err); }
    };

    const loadAnalytics = async () => {
      try { const { data } = await getDashboardAnalytics(); setAnalytics(data); }
      catch (err) { console.error(err); }
    };

    loadStats();
    loadAnalytics();
  }, []);

  const features = [
    { title: 'Employees', desc: 'Manage employee profiles, skills, and learning budgets', icon: '\u263A', color: '#6366f1', path: '/employees', stats: [{ label: 'Total', value: stats.employees }] },
    { title: 'Learning Tracks', desc: 'Personalized L&D tracks per employee with progress tracking', icon: '\u2691', color: '#8b5cf6', path: '/tracks', stats: [{ label: 'Total', value: stats.tracks }, { label: 'Active', value: stats.activeTracks }] },
    { title: 'Skill Gap Analysis', desc: 'Skill gap identification and remediation planning', icon: '\u26A0', color: '#ec4899', path: '/skill-gaps', stats: [{ label: 'Identified', value: stats.skillGaps }, { label: 'Critical', value: stats.criticalGaps }] },
    { title: 'Certifications', desc: 'Track professional certifications, renewals, and credentials', icon: '\u2605', color: '#f59e0b', path: '/certifications', stats: [{ label: 'Total', value: stats.certifications }, { label: 'Active', value: stats.activeCerts }] },
    { title: 'Course Catalog', desc: 'Browse and manage recommended courses', icon: '\u2630', color: '#22c55e', path: '/courses', stats: [{ label: 'Courses', value: stats.courses }] },
    { title: 'ROI Measurement', desc: 'Measure training investment returns and predict future ROI', icon: '\u2197', color: '#3b82f6', path: '/roi', stats: [{ label: 'Measurements', value: stats.roi }, { label: 'Avg ROI', value: `${stats.avgROI}%` }] },
    { title: 'Mentorship Programs', desc: 'Connect mentors with mentees for guided professional growth', icon: '\u2764', color: '#e11d48', path: '/mentorships', stats: [{ label: 'Programs', value: stats.mentorships }] },
    { title: 'Training Events', desc: 'Schedule and manage training workshops and seminars', icon: '\u2600', color: '#f97316', path: '/training-events', stats: [{ label: 'Events', value: stats.trainingEvents }] },
    { title: 'Performance Reviews', desc: 'Track employee performance ratings and development feedback', icon: '\u2606', color: '#14b8a6', path: '/performance-reviews', stats: [{ label: 'Reviews', value: stats.performanceReviews }] },
    { title: 'Learning Budgets', desc: 'Manage departmental training budgets and spending', icon: '\u20AC', color: '#84cc16', path: '/learning-budgets', stats: [{ label: 'Budgets', value: stats.learningBudgets }] },
    { title: 'Competency Frameworks', desc: 'Define role competencies, proficiency levels, and skill matrices', icon: '\u2699', color: '#64748b', path: '/competency-frameworks', stats: [{ label: 'Frameworks', value: stats.competencyFrameworks }] },
    { title: 'Onboarding Plans', desc: 'Structured onboarding programs for new hires', icon: '\u2708', color: '#0ea5e9', path: '/onboarding', stats: [{ label: 'Plans', value: stats.onboardingPlans }] },
    { title: 'Team Goals', desc: 'Set and track team-level learning and development objectives', icon: '\u2690', color: '#a855f7', path: '/team-goals', stats: [{ label: 'Goals', value: stats.teamGoals }] },
    { title: 'Knowledge Base', desc: 'Internal knowledge articles, guides, and best practices', icon: '\u270E', color: '#06b6d4', path: '/knowledge-base', stats: [{ label: 'Articles', value: stats.knowledgeBase }] },
    { title: 'Feedback Surveys', desc: 'Collect and analyze training feedback and satisfaction scores', icon: '\u2709', color: '#d946ef', path: '/feedback-surveys', stats: [{ label: 'Surveys', value: stats.feedbackSurveys }] },
    { title: 'Succession Plans', desc: 'Identify and develop future leaders for critical roles', icon: '\u265B', color: '#b45309', path: '/succession-plans', stats: [{ label: 'Plans', value: stats.successionPlans }] },
    { title: 'Compliance Training', desc: 'Track mandatory regulatory and compliance training completion', icon: '\u2611', color: '#dc2626', path: '/compliance', stats: [{ label: 'Trainings', value: stats.complianceTrainings }] },
    { title: 'Career Paths', desc: 'Map career progression routes with milestones and required skills', icon: '\u2669', color: '#7c3aed', path: '/career-paths', stats: [{ label: 'Paths', value: stats.careerPaths }] },
    { title: 'Learning Resources', desc: 'Curated library of books, videos, podcasts, and tools', icon: '\u2637', color: '#059669', path: '/learning-resources', stats: [{ label: 'Resources', value: stats.learningResources }] },
    { title: 'Assessment Results', desc: 'Track assessment scores, certifications, and skill evaluations', icon: '\u2714', color: '#0284c7', path: '/assessments', stats: [{ label: 'Results', value: stats.assessmentResults }] },
    { title: 'Wellness Programs', desc: 'Employee wellness initiatives for physical and mental health', icon: '\u2618', color: '#16a34a', path: '/wellness', stats: [{ label: 'Programs', value: stats.wellnessPrograms }] },
  ];

  return (
    <div>
      <div className="dashboard-header">
        <h1>AI Learning & Development Path</h1>
        <p>Personalized learning development, skill gap analysis, and ROI measurement platform</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(99,102,241,0.15)', color: '#818cf8'}}>{'\u263A'}</div>
          <div className="stat-value">{stats.employees}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(139,92,246,0.15)', color: '#a78bfa'}}>{'\u2691'}</div>
          <div className="stat-value">{stats.activeTracks}</div>
          <div className="stat-label">Active Learning Tracks</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(236,72,153,0.15)', color: '#f472b6'}}>{'\u26A0'}</div>
          <div className="stat-value">{stats.criticalGaps}</div>
          <div className="stat-label">Critical Skill Gaps</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'rgba(59,130,246,0.15)', color: '#60a5fa'}}>{'\u2197'}</div>
          <div className="stat-value">{stats.avgROI}%</div>
          <div className="stat-label">Average Training ROI</div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="dashboard-tabs">
        <button className={`dashboard-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`dashboard-tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          Analytics
        </button>
      </div>

      {activeTab === 'analytics' && analytics && (
        <div className="analytics-section">
          <div className="charts-grid">
            {/* Department Distribution */}
            <div className="chart-card">
              <h3>Employees by Department</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={analytics.departmentDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {analytics.departmentDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Skill Gaps by Priority */}
            <div className="chart-card">
              <h3>Skill Gaps by Priority</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.skillGapsByPriority}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                    {analytics.skillGapsByPriority.map((entry, i) => {
                      const colors = { Critical: '#ef4444', High: '#f59e0b', Medium: '#3b82f6', Low: '#22c55e' };
                      return <Cell key={i} fill={colors[entry.name] || COLORS[i]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Track Status */}
            <div className="chart-card">
              <h3>Learning Tracks by Status</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={analytics.tracksByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {analytics.tracksByStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* ROI Trend */}
            <div className="chart-card">
              <h3>ROI by Program</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.roiTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="roi" name="ROI %" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Budget Utilization */}
            <div className="chart-card chart-card-wide">
              <h3>Budget Utilization by Department</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.budgetUtilization}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                  <Bar dataKey="total" name="Total Budget" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" name="Spent" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="remaining" name="Remaining" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Certification Status */}
            <div className="chart-card">
              <h3>Certifications by Status</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={analytics.certsByStatus} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {analytics.certsByStatus.map((entry, i) => {
                      const colors = { Active: '#22c55e', Expired: '#ef4444', 'In Progress': '#3b82f6', Planned: '#f59e0b' };
                      return <Cell key={i} fill={colors[entry.name] || COLORS[i]} />;
                    })}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.path} className="feature-card" style={{'--card-color': f.color}} onClick={() => navigate(f.path)}>
              <div className="card-icon" style={{background: `${f.color}20`, color: f.color}}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <div className="card-stats">
                {f.stats.map((s, i) => (
                  <span key={i}>{s.label}: <strong>{s.value}</strong></span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
