const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('SuccessionPlan', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    targetRole: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    candidateId: { type: DataTypes.INTEGER, allowNull: false },
    currentIncumbent: { type: DataTypes.STRING },
    readinessLevel: { type: DataTypes.ENUM('Ready Now','Ready in 1 Year','Ready in 2+ Years','Development Needed'), defaultValue: 'Development Needed' },
    priority: { type: DataTypes.ENUM('Critical','High','Medium','Low'), defaultValue: 'Medium' },
    developmentAreas: { type: DataTypes.JSONB, defaultValue: [] },
    developmentPlan: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('Active','On Hold','Completed','Cancelled'), defaultValue: 'Active' },
    targetDate: { type: DataTypes.DATEONLY },
    riskLevel: { type: DataTypes.STRING, defaultValue: 'Medium' },
  }, { tableName: 'succession_plans', timestamps: true });
};
