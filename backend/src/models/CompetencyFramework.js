const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('CompetencyFramework', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING },
    department: { type: DataTypes.STRING },
    level: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    proficiencyLevels: { type: DataTypes.JSONB, defaultValue: [] },
    requiredSkills: { type: DataTypes.JSONB, defaultValue: [] },
    assessmentCriteria: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('Active','Draft','Archived'), defaultValue: 'Draft' },
    version: { type: DataTypes.STRING, defaultValue: '1.0' },
  }, { tableName: 'competency_frameworks', timestamps: true });
};
