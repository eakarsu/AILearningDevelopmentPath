const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    provider: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    level: { type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert'), defaultValue: 'Beginner' },
    duration: { type: DataTypes.STRING },
    cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
    description: { type: DataTypes.TEXT },
    skills: { type: DataTypes.JSONB, defaultValue: [] },
    url: { type: DataTypes.STRING },
    format: { type: DataTypes.ENUM('Online', 'In-Person', 'Hybrid', 'Self-Paced'), defaultValue: 'Online' },
  }, { tableName: 'courses', timestamps: true });
  return Course;
};
