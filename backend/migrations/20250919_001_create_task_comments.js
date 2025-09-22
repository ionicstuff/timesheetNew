"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('task_comments', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      task_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'tasks', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      content: { type: Sequelize.TEXT, allowNull: false },
      parent_comment_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'task_comments', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      is_deleted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    await queryInterface.addIndex('task_comments', ['task_id']);
    await queryInterface.addIndex('task_comments', ['user_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('task_comments');
  }
};