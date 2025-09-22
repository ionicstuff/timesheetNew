"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('task_activities', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      task_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'tasks', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      actor_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      type: { type: Sequelize.ENUM('created','updated','status_changed','assigned','comment_added','file_uploaded','time_started','time_paused','time_resumed','time_stopped','completed','reopened'), allowNull: false },
      details_json: { type: Sequelize.JSONB, allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.addIndex('task_activities', ['task_id']);
    await queryInterface.addIndex('task_activities', ['type']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('task_activities');
  }
};