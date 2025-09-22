const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskComment = sequelize.define('TaskComment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  taskId: { type: DataTypes.INTEGER, allowNull: false, field: 'task_id' },
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  content: { type: DataTypes.TEXT, allowNull: false },
  parentCommentId: { type: DataTypes.INTEGER, allowNull: true, field: 'parent_comment_id' },
  isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_deleted' },
}, {
  tableName: 'task_comments',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['task_id'] },
    { fields: ['user_id'] },
  ]
});

module.exports = TaskComment;