const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('OnboardingPlan', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    planName: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING },
    startDate: { type: DataTypes.DATEONLY },
    targetCompletionDate: { type: DataTypes.DATEONLY },
    status: { type: DataTypes.ENUM('Not Started','In Progress','Completed','Extended'), defaultValue: 'Not Started' },
    progressPercent: { type: DataTypes.INTEGER, defaultValue: 0 },
    milestones: { type: DataTypes.JSONB, defaultValue: [] },
    assignedBuddy: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
  }, { tableName: 'onboarding_plans', timestamps: true });
};
