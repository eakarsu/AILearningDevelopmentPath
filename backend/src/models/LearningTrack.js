const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LearningTrack = sequelize.define('LearningTrack', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING, allowNull: false },
    priority: { type: DataTypes.ENUM('High', 'Medium', 'Low'), defaultValue: 'Medium' },
    status: { type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed', 'On Hold'), defaultValue: 'Not Started' },
    targetDate: { type: DataTypes.DATEONLY },
    progress: { type: DataTypes.INTEGER, defaultValue: 0 },
    estimatedHours: { type: DataTypes.INTEGER, defaultValue: 0 },
    completedHours: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: 'learning_tracks', timestamps: true });
  return LearningTrack;
};
