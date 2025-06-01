// models/RecommendedMovie.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RecommendedMovie = sequelize.define('RecommendedMovie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  recommendation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  movie_name: {      // Замість title — movie_name, як у таблиці
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  movie_photo: {     // Замість image_path — movie_photo
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  dislikes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'recommendedmovies',
  timestamps: false,
});

module.exports = RecommendedMovie;

