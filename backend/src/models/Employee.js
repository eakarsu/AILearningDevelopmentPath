const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    department: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false },
    level: { type: DataTypes.STRING, defaultValue: 'Junior' },
    hireDate: { type: DataTypes.DATEONLY, allowNull: false },
    skills: { type: DataTypes.JSONB, defaultValue: [] },
    learningBudget: { type: DataTypes.DECIMAL(10, 2), defaultValue: 1000 },
    budgetUsed: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  }, { tableName: 'employees', timestamps: true });
  return Employee;
};
