const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('LearningBudget', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    department: { type: DataTypes.STRING, allowNull: false },
    fiscalYear: { type: DataTypes.STRING },
    totalBudget: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    allocated: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    spent: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    remaining: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    category: { type: DataTypes.STRING },
    approvedBy: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('Active','Frozen','Closed','Pending'), defaultValue: 'Active' },
    notes: { type: DataTypes.TEXT },
  }, { tableName: 'learning_budgets', timestamps: true });
};
