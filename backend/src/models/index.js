const { Sequelize } = require('sequelize');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

const User = require('./User')(sequelize);
const Employee = require('./Employee')(sequelize);
const LearningTrack = require('./LearningTrack')(sequelize);
const SkillGap = require('./SkillGap')(sequelize);
const Certification = require('./Certification')(sequelize);
const Course = require('./Course')(sequelize);
const ROIMeasurement = require('./ROIMeasurement')(sequelize);
const MentorshipProgram = require('./MentorshipProgram')(sequelize);
const TrainingEvent = require('./TrainingEvent')(sequelize);
const PerformanceReview = require('./PerformanceReview')(sequelize);
const LearningBudget = require('./LearningBudget')(sequelize);
const CompetencyFramework = require('./CompetencyFramework')(sequelize);
const OnboardingPlan = require('./OnboardingPlan')(sequelize);
const TeamGoal = require('./TeamGoal')(sequelize);
const KnowledgeBase = require('./KnowledgeBase')(sequelize);
const FeedbackSurvey = require('./FeedbackSurvey')(sequelize);
const SuccessionPlan = require('./SuccessionPlan')(sequelize);
const ComplianceTraining = require('./ComplianceTraining')(sequelize);
const CareerPath = require('./CareerPath')(sequelize);
const LearningResource = require('./LearningResource')(sequelize);
const AssessmentResult = require('./AssessmentResult')(sequelize);
const WellnessProgram = require('./WellnessProgram')(sequelize);

// Associations
Employee.hasMany(LearningTrack, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
LearningTrack.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(SkillGap, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
SkillGap.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(Certification, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Certification.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(ROIMeasurement, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
ROIMeasurement.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(PerformanceReview, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
PerformanceReview.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(OnboardingPlan, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
OnboardingPlan.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(FeedbackSurvey, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
FeedbackSurvey.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(ComplianceTraining, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
ComplianceTraining.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(CareerPath, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
CareerPath.belongsTo(Employee, { foreignKey: 'employeeId' });

Employee.hasMany(AssessmentResult, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
AssessmentResult.belongsTo(Employee, { foreignKey: 'employeeId' });

MentorshipProgram.belongsTo(Employee, { as: 'Mentor', foreignKey: 'mentorId' });
MentorshipProgram.belongsTo(Employee, { as: 'Mentee', foreignKey: 'menteeId' });

SuccessionPlan.belongsTo(Employee, { as: 'Candidate', foreignKey: 'candidateId' });

module.exports = {
  sequelize, User, Employee, LearningTrack, SkillGap, Certification, Course, ROIMeasurement,
  MentorshipProgram, TrainingEvent, PerformanceReview, LearningBudget, CompetencyFramework,
  OnboardingPlan, TeamGoal, KnowledgeBase, FeedbackSurvey, SuccessionPlan, ComplianceTraining,
  CareerPath, LearningResource, AssessmentResult, WellnessProgram,
};
