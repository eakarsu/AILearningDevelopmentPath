const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('KnowledgeBase', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING },
    department: { type: DataTypes.STRING },
    content: { type: DataTypes.TEXT },
    tags: { type: DataTypes.JSONB, defaultValue: [] },
    status: { type: DataTypes.ENUM('Published','Draft','Archived','Under Review'), defaultValue: 'Draft' },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
    rating: { type: DataTypes.DECIMAL(2,1), defaultValue: 0 },
    lastUpdated: { type: DataTypes.DATEONLY },
  }, { tableName: 'knowledge_base', timestamps: true });
};
