const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectMessage = sequelize.define('ProjectMessage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false, field: 'project_id' },
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  content: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'project_messages',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = ProjectMessage;