// models/Like.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recommended_movie_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  like_type: {
    type: DataTypes.ENUM('like', 'dislike'),
    allowNull: false,
  },
}, {
  tableName: 'likes',
  timestamps: false,
});

module.exports = Like;
