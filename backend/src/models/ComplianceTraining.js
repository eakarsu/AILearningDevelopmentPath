const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('ComplianceTraining', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    trainingName: { type: DataTypes.STRING, allowNull: false },
    regulatoryBody: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    dueDate: { type: DataTypes.DATEONLY },
    completionDate: { type: DataTypes.DATEONLY },
    status: { type: DataTypes.ENUM('Completed','Overdue','In Progress','Not Started'), defaultValue: 'Not Started' },
    validUntil: { type: DataTypes.DATEONLY },
    passingScore: { type: DataTypes.DECIMAL(5,2), defaultValue: 80 },
    actualScore: { type: DataTypes.DECIMAL(5,2) },
    mandatory: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { tableName: 'compliance_trainings', timestamps: true });
};
