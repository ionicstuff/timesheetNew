'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('task_comment_likes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      comment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'task_comments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
    await queryInterface.addConstraint('task_comment_likes', {
      fields: ['comment_id', 'user_id'],
      type: 'unique',
      name: 'uq_comment_like',
    });
    await queryInterface.addIndex('task_comment_likes', ['comment_id']);
    await queryInterface.addIndex('task_comment_likes', ['user_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('task_comment_likes');
  },
};
