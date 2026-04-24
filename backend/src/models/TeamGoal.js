const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('TeamGoal', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    targetDate: { type: DataTypes.DATEONLY },
    status: { type: DataTypes.ENUM('On Track','At Risk','Behind','Completed','Cancelled'), defaultValue: 'On Track' },
    progressPercent: { type: DataTypes.INTEGER, defaultValue: 0 },
    priority: { type: DataTypes.ENUM('High','Medium','Low'), defaultValue: 'Medium' },
    keyResults: { type: DataTypes.JSONB, defaultValue: [] },
    owner: { type: DataTypes.STRING },
    quarter: { type: DataTypes.STRING },
  }, { tableName: 'team_goals', timestamps: true });
};
