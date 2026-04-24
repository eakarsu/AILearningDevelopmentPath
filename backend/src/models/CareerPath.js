const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('CareerPath', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    currentRole: { type: DataTypes.STRING, allowNull: false },
    targetRole: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING },
    estimatedTimeline: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('Active','Achieved','Paused','Revised'), defaultValue: 'Active' },
    progressPercent: { type: DataTypes.INTEGER, defaultValue: 0 },
    requiredSkills: { type: DataTypes.JSONB, defaultValue: [] },
    completedMilestones: { type: DataTypes.JSONB, defaultValue: [] },
    nextMilestone: { type: DataTypes.STRING },
    mentorName: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
  }, { tableName: 'career_paths', timestamps: true });
};
