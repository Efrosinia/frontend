const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // шлях до твоєї Sequelize конфігурації

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  reputation: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  bio: {
    type: DataTypes.TEXT,
  },
  profile_photo_path: {
    type: DataTypes.STRING(255),
  },
  registered_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;