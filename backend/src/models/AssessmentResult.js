const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('AssessmentResult', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    assessmentName: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('Pre-Training','Post-Training','Certification','Skill Check','Annual'), defaultValue: 'Skill Check' },
    category: { type: DataTypes.STRING },
    score: { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
    maxScore: { type: DataTypes.DECIMAL(5,2), defaultValue: 100 },
    passingScore: { type: DataTypes.DECIMAL(5,2), defaultValue: 70 },
    passed: { type: DataTypes.BOOLEAN, defaultValue: false },
    assessmentDate: { type: DataTypes.DATEONLY },
    duration: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM('Passed','Failed','Pending Review','In Progress'), defaultValue: 'In Progress' },
  }, { tableName: 'assessment_results', timestamps: true });
};
