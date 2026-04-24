const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('MentorshipProgram', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mentorId: { type: DataTypes.INTEGER, allowNull: false },
    menteeId: { type: DataTypes.INTEGER, allowNull: false },
    programName: { type: DataTypes.STRING, allowNull: false },
    focus: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('Active','Completed','Paused','Cancelled'), defaultValue: 'Active' },
    startDate: { type: DataTypes.DATEONLY },
    endDate: { type: DataTypes.DATEONLY },
    meetingFrequency: { type: DataTypes.STRING },
    goalDescription: { type: DataTypes.TEXT },
    progressNotes: { type: DataTypes.TEXT },
    rating: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
  }, { tableName: 'mentorship_programs', timestamps: true });
};
