const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ROIMeasurement = sequelize.define('ROIMeasurement', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    programName: { type: DataTypes.STRING, allowNull: false },
    investmentAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    returnAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    roiPercentage: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
    measurementDate: { type: DataTypes.DATEONLY },
    category: { type: DataTypes.STRING },
    metrics: { type: DataTypes.JSONB, defaultValue: {} },
    period: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('Measuring', 'Positive', 'Negative', 'Break-Even'), defaultValue: 'Measuring' },
  }, { tableName: 'roi_measurements', timestamps: true });
  return ROIMeasurement;
};
