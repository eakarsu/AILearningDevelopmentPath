const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('FeedbackSurvey', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    surveyTitle: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('Post-Training','Quarterly','Annual','Event','Course'), defaultValue: 'Post-Training' },
    relatedItem: { type: DataTypes.STRING },
    overallRating: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
    contentRating: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
    instructorRating: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
    applicabilityRating: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
    comments: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('Pending','Completed','Expired'), defaultValue: 'Pending' },
    submittedDate: { type: DataTypes.DATEONLY },
  }, { tableName: 'feedback_surveys', timestamps: true });
};
