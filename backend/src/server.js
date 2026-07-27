require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

function validateRuntime(env = process.env) {
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters');
  }
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }
  if (env.NODE_ENV === 'production') {
    const origins = String(env.CLIENT_URL || '').split(',').map((value) => value.trim()).filter(Boolean);
    if (!origins.length || origins.includes('*')) {
      throw new Error('Production CLIENT_URL must be an explicit allowlist');
    }
    if (env.ALLOW_DEMO_SEED === 'true' || env.AUTO_INIT_SCHEMA === 'true') {
      throw new Error('Production startup mutation and demo seed are prohibited');
    }
  }
}
validateRuntime();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize, Employee, MentorshipProgram, TrainingEvent, PerformanceReview,
  LearningBudget, CompetencyFramework, OnboardingPlan, TeamGoal, KnowledgeBase,
  FeedbackSurvey, SuccessionPlan, ComplianceTraining, CareerPath, LearningResource,
  AssessmentResult, WellnessProgram } = require('./models');
const createCrudRouter = require('./routes/routeFactory');

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
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

// Custom Views (L&D) - mounted BEFORE any 404 handler
app.use('/api/custom-views', require('./routes/customViews'));
app.use('/api/skill-adjacency-mobility-map', require('./routes/skillAdjacencyMobilityMap'));
app.use('/api/workforce-transformation', require('./routes/workforceTransformation'));
app.use('/api/governed-learning-paths', require('./governance'));

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    if (process.env.AUTO_INIT_SCHEMA === 'true') {
      await sequelize.sync({ alter: true });
      console.log('Models synchronized.');
    }
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

start();

// Generated prototype routes are opt-in for isolated, non-production evaluation.
if (process.env.ENABLE_GENERATED_ROUTES === 'true' && process.env.NODE_ENV !== 'production') {
app.use('/api/career-coach-agent', require('./routes/career-coach-agent'));
app.use('/api/skill-demand-forecast', require('./routes/skill-demand-forecast'));
app.use('/api/peer-mentor-matcher', require('./routes/peer-mentor-matcher'));
app.use('/api/multi-modal-content', require('./routes/multi-modal-content'));
app.use('/api/benchmarking-ld', require('./routes/benchmarking'));

}
// Generated gap routes remain deliberately unmounted.
