const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskDependency = sequelize.define(
  'TaskDependency',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    taskId: { type: DataTypes.INTEGER, allowNull: false, field: 'task_id' },
    dependsOnTaskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'depends_on_task_id',
    },
  },
  {
    tableName: 'task_dependencies',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['task_id'] },
      { fields: ['depends_on_task_id'] },
      { unique: true, fields: ['task_id', 'depends_on_task_id'] },
    ],
  },
);

module.exports = TaskDependency;
