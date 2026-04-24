const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('LearningResource', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('Book','Video','Podcast','Article','Tool','Template'), defaultValue: 'Article' },
    author: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    url: { type: DataTypes.STRING },
    cost: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    rating: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
    reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    skillTags: { type: DataTypes.JSONB, defaultValue: [] },
    status: { type: DataTypes.ENUM('Available','Unavailable','Coming Soon'), defaultValue: 'Available' },
    format: { type: DataTypes.STRING },
  }, { tableName: 'learning_resources', timestamps: true });
};
