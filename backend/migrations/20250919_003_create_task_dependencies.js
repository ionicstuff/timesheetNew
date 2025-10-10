'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('task_dependencies', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tasks', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      depends_on_task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tasks', key: 'id' },
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
    await queryInterface.addConstraint('task_dependencies', {
      fields: ['task_id', 'depends_on_task_id'],
      type: 'unique',
      name: 'uq_task_dep_unique',
    });
    await queryInterface.addIndex('task_dependencies', ['task_id']);
    await queryInterface.addIndex('task_dependencies', ['depends_on_task_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('task_dependencies');
  },
};
