const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SkillGap = sequelize.define('SkillGap', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    skillName: { type: DataTypes.STRING, allowNull: false },
    currentLevel: { type: DataTypes.INTEGER, defaultValue: 1 },
    requiredLevel: { type: DataTypes.INTEGER, defaultValue: 5 },
    gapScore: { type: DataTypes.DECIMAL(3, 1), defaultValue: 0 },
    category: { type: DataTypes.STRING },
    priority: { type: DataTypes.ENUM('Critical', 'High', 'Medium', 'Low'), defaultValue: 'Medium' },
    recommendedAction: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('Identified', 'In Progress', 'Resolved'), defaultValue: 'Identified' },
  }, { tableName: 'skill_gaps', timestamps: true });
  return SkillGap;
};
