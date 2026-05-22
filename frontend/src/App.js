import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import LearningTracks from './pages/LearningTracks';
import SkillGaps from './pages/SkillGaps';
import Certifications from './pages/Certifications';
import Courses from './pages/Courses';
import ROIMeasurements from './pages/ROIMeasurements';
import Mentorships from './pages/Mentorships';
import TrainingEvents from './pages/TrainingEvents';
import PerformanceReviews from './pages/PerformanceReviews';
import LearningBudgets from './pages/LearningBudgets';
import CompetencyFrameworks from './pages/CompetencyFrameworks';
import OnboardingPlans from './pages/OnboardingPlans';
import TeamGoals from './pages/TeamGoals';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import FeedbackSurveys from './pages/FeedbackSurveys';
import SuccessionPlans from './pages/SuccessionPlans';
import ComplianceTrainings from './pages/ComplianceTrainings';
import CareerPaths from './pages/CareerPaths';
import LearningResources from './pages/LearningResources';
import AssessmentResults from './pages/AssessmentResults';
import WellnessPrograms from './pages/WellnessPrograms';
import AIToolsPage from './pages/AIToolsPage';
import CustomViewsPage from './pages/CustomViewsPage';
import SkillAdjacencyMobilityMap from './pages/SkillAdjacencyMobilityMap';
import Layout from './components/Layout';
import Toast from './components/Toast';

import CodexCustomVizFeature from './pages/CodexCustomVizFeature';
import CodexOperationsFeature from './pages/CodexOperationsFeature';

export const ToastContext = React.createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  if (!isAuthenticated) {
    return (
      <ToastContext.Provider value={addToast}>
        <Router>
          <Toast toasts={toasts} />
          <Routes>
        <Route path="/codex/custom-viz" element={<CodexCustomVizFeature />} />
        <Route path="/codex/operations" element={<CodexOperationsFeature />} />

            <Route path="*" element={<Login onLogin={handleLogin} />} />
          </Routes>
        </Router>
      </ToastContext.Provider>
    );
  }

  return (
    <ToastContext.Provider value={addToast}>
      <Router>
        <Toast toasts={toasts} />
        <Layout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/tracks" element={<LearningTracks />} />
            <Route path="/skill-gaps" element={<SkillGaps />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/roi" element={<ROIMeasurements />} />
            <Route path="/mentorships" element={<Mentorships />} />
            <Route path="/training-events" element={<TrainingEvents />} />
            <Route path="/performance-reviews" element={<PerformanceReviews />} />
            <Route path="/learning-budgets" element={<LearningBudgets />} />
            <Route path="/competency-frameworks" element={<CompetencyFrameworks />} />
            <Route path="/onboarding" element={<OnboardingPlans />} />
            <Route path="/team-goals" element={<TeamGoals />} />
            <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="/feedback-surveys" element={<FeedbackSurveys />} />
            <Route path="/succession-plans" element={<SuccessionPlans />} />
            <Route path="/compliance" element={<ComplianceTrainings />} />
            <Route path="/career-paths" element={<CareerPaths />} />
            <Route path="/learning-resources" element={<LearningResources />} />
            <Route path="/assessments" element={<AssessmentResults />} />
            <Route path="/wellness" element={<WellnessPrograms />} />
            <Route path="/ai-tools" element={<AIToolsPage />} />
            <Route path="/custom-views" element={<CustomViewsPage />} />
            <Route path="/skill-adjacency-mobility-map" element={<SkillAdjacencyMobilityMap />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </ToastContext.Provider>
  );
}

export default App;
