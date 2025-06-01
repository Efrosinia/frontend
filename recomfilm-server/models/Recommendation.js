// models/Recommendation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Recommendation = sequelize.define('Recommendation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Зв’язок (foreignKey) буде визначено у асоціаціях
  },
  base_movie: {  // як у вашій таблиці recommendations
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  overall_rating: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'recommendations',
  timestamps: false,
});

module.exports = Recommendation;


