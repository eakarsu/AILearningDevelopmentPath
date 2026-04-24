const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('PerformanceReview', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    reviewerName: { type: DataTypes.STRING },
    reviewPeriod: { type: DataTypes.STRING },
    overallRating: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
    technicalScore: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
    communicationScore: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
    leadershipScore: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
    learningScore: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
    strengths: { type: DataTypes.TEXT },
    areasForImprovement: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('Draft','Submitted','Acknowledged','Completed'), defaultValue: 'Draft' },
    reviewDate: { type: DataTypes.DATEONLY },
  }, { tableName: 'performance_reviews', timestamps: true });
};
