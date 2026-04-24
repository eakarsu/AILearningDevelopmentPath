import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Employees
export const getEmployees = () => API.get('/employees');
export const getEmployee = (id) => API.get(`/employees/${id}`);
export const createEmployee = (data) => API.post('/employees', data);
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);

// Learning Tracks
export const getTracks = () => API.get('/tracks');
export const getTrack = (id) => API.get(`/tracks/${id}`);
export const createTrack = (data) => API.post('/tracks', data);
export const updateTrack = (id, data) => API.put(`/tracks/${id}`, data);
export const deleteTrack = (id) => API.delete(`/tracks/${id}`);

// Skill Gaps
export const getSkillGaps = () => API.get('/skill-gaps');
export const getSkillGap = (id) => API.get(`/skill-gaps/${id}`);
export const createSkillGap = (data) => API.post('/skill-gaps', data);
export const updateSkillGap = (id, data) => API.put(`/skill-gaps/${id}`, data);
export const deleteSkillGap = (id) => API.delete(`/skill-gaps/${id}`);

// Certifications
export const getCertifications = () => API.get('/certifications');
export const getCertification = (id) => API.get(`/certifications/${id}`);
export const createCertification = (data) => API.post('/certifications', data);
export const updateCertification = (id, data) => API.put(`/certifications/${id}`, data);
export const deleteCertification = (id) => API.delete(`/certifications/${id}`);

// Courses
export const getCourses = () => API.get('/courses');
export const getCourse = (id) => API.get(`/courses/${id}`);
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// ROI
export const getROIMeasurements = () => API.get('/roi');
export const getROIMeasurement = (id) => API.get(`/roi/${id}`);
export const createROIMeasurement = (data) => API.post('/roi', data);
export const updateROIMeasurement = (id, data) => API.put(`/roi/${id}`, data);
export const deleteROIMeasurement = (id) => API.delete(`/roi/${id}`);

// Mentorships
export const getMentorships = () => API.get('/mentorships');
export const getMentorship = (id) => API.get(`/mentorships/${id}`);
export const createMentorship = (data) => API.post('/mentorships', data);
export const updateMentorship = (id, data) => API.put(`/mentorships/${id}`, data);
export const deleteMentorship = (id) => API.delete(`/mentorships/${id}`);

// Training Events
export const getTrainingEvents = () => API.get('/training-events');
export const getTrainingEvent = (id) => API.get(`/training-events/${id}`);
export const createTrainingEvent = (data) => API.post('/training-events', data);
export const updateTrainingEvent = (id, data) => API.put(`/training-events/${id}`, data);
export const deleteTrainingEvent = (id) => API.delete(`/training-events/${id}`);

// Performance Reviews
export const getPerformanceReviews = () => API.get('/performance-reviews');
export const getPerformanceReview = (id) => API.get(`/performance-reviews/${id}`);
export const createPerformanceReview = (data) => API.post('/performance-reviews', data);
export const updatePerformanceReview = (id, data) => API.put(`/performance-reviews/${id}`, data);
export const deletePerformanceReview = (id) => API.delete(`/performance-reviews/${id}`);

// Learning Budgets
export const getLearningBudgets = () => API.get('/learning-budgets');
export const getLearningBudget = (id) => API.get(`/learning-budgets/${id}`);
export const createLearningBudget = (data) => API.post('/learning-budgets', data);
export const updateLearningBudget = (id, data) => API.put(`/learning-budgets/${id}`, data);
export const deleteLearningBudget = (id) => API.delete(`/learning-budgets/${id}`);

// Competency Frameworks
export const getCompetencyFrameworks = () => API.get('/competency-frameworks');
export const getCompetencyFramework = (id) => API.get(`/competency-frameworks/${id}`);
export const createCompetencyFramework = (data) => API.post('/competency-frameworks', data);
export const updateCompetencyFramework = (id, data) => API.put(`/competency-frameworks/${id}`, data);
export const deleteCompetencyFramework = (id) => API.delete(`/competency-frameworks/${id}`);

// Onboarding Plans
export const getOnboardingPlans = () => API.get('/onboarding-plans');
export const getOnboardingPlan = (id) => API.get(`/onboarding-plans/${id}`);
export const createOnboardingPlan = (data) => API.post('/onboarding-plans', data);
export const updateOnboardingPlan = (id, data) => API.put(`/onboarding-plans/${id}`, data);
export const deleteOnboardingPlan = (id) => API.delete(`/onboarding-plans/${id}`);

// Team Goals
export const getTeamGoals = () => API.get('/team-goals');
export const getTeamGoal = (id) => API.get(`/team-goals/${id}`);
export const createTeamGoal = (data) => API.post('/team-goals', data);
export const updateTeamGoal = (id, data) => API.put(`/team-goals/${id}`, data);
export const deleteTeamGoal = (id) => API.delete(`/team-goals/${id}`);

// Knowledge Base
export const getKnowledgeBaseArticles = () => API.get('/knowledge-base');
export const getKnowledgeBaseArticle = (id) => API.get(`/knowledge-base/${id}`);
export const createKnowledgeBaseArticle = (data) => API.post('/knowledge-base', data);
export const updateKnowledgeBaseArticle = (id, data) => API.put(`/knowledge-base/${id}`, data);
export const deleteKnowledgeBaseArticle = (id) => API.delete(`/knowledge-base/${id}`);

// Feedback Surveys
export const getFeedbackSurveys = () => API.get('/feedback-surveys');
export const getFeedbackSurvey = (id) => API.get(`/feedback-surveys/${id}`);
export const createFeedbackSurvey = (data) => API.post('/feedback-surveys', data);
export const updateFeedbackSurvey = (id, data) => API.put(`/feedback-surveys/${id}`, data);
export const deleteFeedbackSurvey = (id) => API.delete(`/feedback-surveys/${id}`);

// Succession Plans
export const getSuccessionPlans = () => API.get('/succession-plans');
export const getSuccessionPlan = (id) => API.get(`/succession-plans/${id}`);
export const createSuccessionPlan = (data) => API.post('/succession-plans', data);
export const updateSuccessionPlan = (id, data) => API.put(`/succession-plans/${id}`, data);
export const deleteSuccessionPlan = (id) => API.delete(`/succession-plans/${id}`);

// Compliance Trainings
export const getComplianceTrainings = () => API.get('/compliance-trainings');
export const getComplianceTraining = (id) => API.get(`/compliance-trainings/${id}`);
export const createComplianceTraining = (data) => API.post('/compliance-trainings', data);
export const updateComplianceTraining = (id, data) => API.put(`/compliance-trainings/${id}`, data);
export const deleteComplianceTraining = (id) => API.delete(`/compliance-trainings/${id}`);

// Career Paths
export const getCareerPaths = () => API.get('/career-paths');
export const getCareerPath = (id) => API.get(`/career-paths/${id}`);
export const createCareerPath = (data) => API.post('/career-paths', data);
export const updateCareerPath = (id, data) => API.put(`/career-paths/${id}`, data);
export const deleteCareerPath = (id) => API.delete(`/career-paths/${id}`);

// Learning Resources
export const getLearningResources = () => API.get('/learning-resources');
export const getLearningResource = (id) => API.get(`/learning-resources/${id}`);
export const createLearningResource = (data) => API.post('/learning-resources', data);
export const updateLearningResource = (id, data) => API.put(`/learning-resources/${id}`, data);
export const deleteLearningResource = (id) => API.delete(`/learning-resources/${id}`);

// Assessment Results
export const getAssessmentResults = () => API.get('/assessment-results');
export const getAssessmentResult = (id) => API.get(`/assessment-results/${id}`);
export const createAssessmentResult = (data) => API.post('/assessment-results', data);
export const updateAssessmentResult = (id, data) => API.put(`/assessment-results/${id}`, data);
export const deleteAssessmentResult = (id) => API.delete(`/assessment-results/${id}`);

// Wellness Programs
export const getWellnessPrograms = () => API.get('/wellness-programs');
export const getWellnessProgram = (id) => API.get(`/wellness-programs/${id}`);
export const createWellnessProgram = (data) => API.post('/wellness-programs', data);
export const updateWellnessProgram = (id, data) => API.put(`/wellness-programs/${id}`, data);
export const deleteWellnessProgram = (id) => API.delete(`/wellness-programs/${id}`);

// Dashboard & Utilities
export const getDashboardAnalytics = () => API.get('/dashboard/analytics');
export const getNotifications = () => API.get('/dashboard/notifications');
export const globalSearch = (q) => API.get(`/dashboard/search?q=${encodeURIComponent(q)}`);
export const exportCSV = (resource) => API.get(`/dashboard/export/${resource}`, { responseType: 'blob' });

// AI
export const aiLearningPath = (employeeId) => API.post('/ai/learning-path', { employeeId });
export const aiSkillAnalysis = (employeeId) => API.post('/ai/skill-analysis', { employeeId });
export const aiCourseRecommendations = (employeeId) => API.post('/ai/course-recommendations', { employeeId });
export const aiROIPrediction = (employeeId) => API.post('/ai/roi-prediction', { employeeId });
export const aiCertificationAdvisor = (employeeId) => API.post('/ai/certification-advisor', { employeeId });

export default API;
