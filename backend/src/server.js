require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Startup env validation
const required = ['JWT_SECRET', 'OPENROUTER_API_KEY'];
for (const key of required) {
  if (!process.env[key]) { console.error(`Missing: ${key}`); process.exit(1); }
}

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

// === BATCH 05 AUTO-MOUNT (custom feature suggestions) ===
app.use('/api/career-coach-agent', require('./routes/career-coach-agent'));
app.use('/api/skill-demand-forecast', require('./routes/skill-demand-forecast'));
app.use('/api/peer-mentor-matcher', require('./routes/peer-mentor-matcher'));
app.use('/api/multi-modal-content', require('./routes/multi-modal-content'));
app.use('/api/benchmarking-ld', require('./routes/benchmarking'));

// === Batch 05 Gaps & Frontend Mounts ===
try { const _gap_peer_match_advisor = require('./routes/gap-peer-match-advisor'); app.use('/api/gap-peer-match-advisor', _gap_peer_match_advisor); } catch(e) { console.error('gap mount fail peer-match-advisor:', e.message); }
try { const _gap_succession_planner = require('./routes/gap-succession-planner'); app.use('/api/gap-succession-planner', _gap_succession_planner); } catch(e) { console.error('gap mount fail succession-planner:', e.message); }
try { const _gap_training_effectiveness_analyzer = require('./routes/gap-training-effectiveness-analyzer'); app.use('/api/gap-training-effectiveness-analyzer', _gap_training_effectiveness_analyzer); } catch(e) { console.error('gap mount fail training-effectiveness-analyzer:', e.message); }
try { const _gap_budget_optimizer = require('./routes/gap-budget-optimizer'); app.use('/api/gap-budget-optimizer', _gap_budget_optimizer); } catch(e) { console.error('gap mount fail budget-optimizer:', e.message); }
try { const _gap_manager = require('./routes/gap-manager'); app.use('/api/gap-manager', _gap_manager); } catch(e) { console.error('gap mount fail manager:', e.message); }
try { const _gap_peer = require('./routes/gap-peer'); app.use('/api/gap-peer', _gap_peer); } catch(e) { console.error('gap mount fail peer:', e.message); }
try { const _gap_mentorship = require('./routes/gap-mentorship'); app.use('/api/gap-mentorship', _gap_mentorship); } catch(e) { console.error('gap mount fail mentorship:', e.message); }
try { const _gap_learning = require('./routes/gap-learning'); app.use('/api/gap-learning', _gap_learning); } catch(e) { console.error('gap mount fail learning:', e.message); }
try { const _gap_hris = require('./routes/gap-hris'); app.use('/api/gap-hris', _gap_hris); } catch(e) { console.error('gap mount fail hris:', e.message); }
try { const _gap_mobile = require('./routes/gap-mobile'); app.use('/api/gap-mobile', _gap_mobile); } catch(e) { console.error('gap mount fail mobile:', e.message); }
// === End Batch 05 Mounts ===
