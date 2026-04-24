const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('WellnessProgram', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    programName: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.ENUM('Physical','Mental','Financial','Social','Work-Life Balance'), defaultValue: 'Mental' },
    provider: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    startDate: { type: DataTypes.DATEONLY },
    endDate: { type: DataTypes.DATEONLY },
    participantCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    capacity: { type: DataTypes.INTEGER, defaultValue: 50 },
    cost: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    status: { type: DataTypes.ENUM('Active','Completed','Upcoming','Cancelled'), defaultValue: 'Upcoming' },
    satisfactionScore: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
    format: { type: DataTypes.ENUM('In-Person','Virtual','Hybrid','Self-Paced'), defaultValue: 'Virtual' },
  }, { tableName: 'wellness_programs', timestamps: true });
};
