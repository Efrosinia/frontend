// models/CommentLike.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CommentLike = sequelize.define('CommentLike', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  like_type: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'commentlikes',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'comment_id'],
    },
  ],
});

module.exports = CommentLike;
