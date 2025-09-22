const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskFile = sequelize.define('TaskFile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  taskId: { type: DataTypes.INTEGER, allowNull: false, field: 'task_id' },
  uploadedBy: { type: DataTypes.INTEGER, allowNull: false, field: 'uploaded_by' },
  originalName: { type: DataTypes.STRING(255), allowNull: false, field: 'original_name' },
  filename: { type: DataTypes.STRING(255), allowNull: false },
  mimeType: { type: DataTypes.STRING(128), allowNull: false, field: 'mime_type' },
  size: { type: DataTypes.INTEGER, allowNull: false },
  path: { type: DataTypes.STRING(512), allowNull: false },
}, {
  tableName: 'task_files',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['task_id'] },
    { fields: ['uploaded_by'] }
  ]
});

module.exports = TaskFile;