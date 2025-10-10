const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskActivity = sequelize.define(
  'TaskActivity',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    taskId: { type: DataTypes.INTEGER, allowNull: false, field: 'task_id' },
    actorId: { type: DataTypes.INTEGER, allowNull: true, field: 'actor_id' },
    type: {
      type: DataTypes.ENUM(
        'created',
        'updated',
        'status_changed',
        'assigned',
        'comment_added',
        'file_uploaded',
        'time_started',
        'time_paused',
        'time_resumed',
        'time_stopped',
        'completed',
        'reopened',
      ),
      allowNull: false,
    },
    detailsJson: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'details_json',
    },
  },
  {
    tableName: 'task_activities',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [{ fields: ['task_id'] }, { fields: ['type'] }],
  },
);

module.exports = TaskActivity;
