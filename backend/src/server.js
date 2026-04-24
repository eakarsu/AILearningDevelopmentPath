require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const { sequelize, Employee, MentorshipProgram, TrainingEvent, PerformanceReview,
  LearningBudget, CompetencyFramework, OnboardingPlan, TeamGoal, KnowledgeBase,
  FeedbackSurvey, SuccessionPlan, ComplianceTraining, CareerPath, LearningResource,
  AssessmentResult, WellnessProgram } = require('./models');
const createCrudRouter = require('./routes/routeFactory');

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;

app.use(cors());
app.use(express.json());

// Dashboard & utility routes
app.use('/api/dashboard', require('./routes/dashboard'));

// Original routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/tracks', require('./routes/tracks'));
app.use('/api/skill-gaps', require('./routes/skillGaps'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/roi', require('./routes/roi'));
app.use('/api/ai', require('./routes/ai'));

// New feature routes using factory
app.use('/api/mentorships', createCrudRouter(MentorshipProgram, [
  { model: Employee, as: 'Mentor', attributes: ['name', 'department', 'position'] },
  { model: Employee, as: 'Mentee', attributes: ['name', 'department', 'position'] },
]));
app.use('/api/training-events', createCrudRouter(TrainingEvent));
app.use('/api/performance-reviews', createCrudRouter(PerformanceReview, [
  { model: Employee, attributes: ['name', 'department', 'position'] },
]));
app.use('/api/learning-budgets', createCrudRouter(LearningBudget));
app.use('/api/competency-frameworks', createCrudRouter(CompetencyFramework));
app.use('/api/onboarding-plans', createCrudRouter(OnboardingPlan, [
  { model: Employee, attributes: ['name', 'department', 'position'] },
]));
app.use('/api/team-goals', createCrudRouter(TeamGoal));
app.use('/api/knowledge-base', createCrudRouter(KnowledgeBase));
app.use('/api/feedback-surveys', createCrudRouter(FeedbackSurvey, [
  { model: Employee, attributes: ['name', 'department'] },
]));
app.use('/api/succession-plans', createCrudRouter(SuccessionPlan, [
  { model: Employee, as: 'Candidate', attributes: ['name', 'department', 'position'] },
]));
app.use('/api/compliance-trainings', createCrudRouter(ComplianceTraining, [
  { model: Employee, attributes: ['name', 'department'] },
]));
app.use('/api/career-paths', createCrudRouter(CareerPath, [
  { model: Employee, attributes: ['name', 'department', 'position'] },
]));
app.use('/api/learning-resources', createCrudRouter(LearningResource));
app.use('/api/assessment-results', createCrudRouter(AssessmentResult, [
  { model: Employee, attributes: ['name', 'department'] },
]));
app.use('/api/wellness-programs', createCrudRouter(WellnessProgram));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await sequelize.sync({ alter: true });
    console.log('Models synchronized.');
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

start();
