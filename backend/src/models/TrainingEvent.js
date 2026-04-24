const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('TrainingEvent', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('Workshop','Seminar','Webinar','Conference','Bootcamp'), defaultValue: 'Workshop' },
    facilitator: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    startDate: { type: DataTypes.DATEONLY },
    endDate: { type: DataTypes.DATEONLY },
    capacity: { type: DataTypes.INTEGER, defaultValue: 50 },
    enrolled: { type: DataTypes.INTEGER, defaultValue: 0 },
    cost: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    status: { type: DataTypes.ENUM('Upcoming','In Progress','Completed','Cancelled'), defaultValue: 'Upcoming' },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING },
  }, { tableName: 'training_events', timestamps: true });
};
