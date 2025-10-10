const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskCommentLike = sequelize.define(
  'TaskCommentLike',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'comment_id',
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  },
  {
    tableName: 'task_comment_likes',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { unique: true, fields: ['comment_id', 'user_id'] },
      { fields: ['comment_id'] },
      { fields: ['user_id'] },
    ],
  },
);

module.exports = TaskCommentLike;
