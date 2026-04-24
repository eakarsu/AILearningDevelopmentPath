const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Certification = sequelize.define('Certification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    provider: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING },
    dateObtained: { type: DataTypes.DATEONLY },
    expiryDate: { type: DataTypes.DATEONLY },
    status: { type: DataTypes.ENUM('Active', 'Expired', 'In Progress', 'Planned'), defaultValue: 'Planned' },
    cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    credentialId: { type: DataTypes.STRING },
    verificationUrl: { type: DataTypes.STRING },
  }, { tableName: 'certifications', timestamps: true });
  return Certification;
};
