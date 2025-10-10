'use strict';

/** Add created_by to tasks, FK -> users.id, indexed. Backfill policy A: leave NULL for existing rows. */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tasks', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addIndex('tasks', ['created_by'], {
      name: 'idx_tasks_created_by',
    });
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.removeIndex('tasks', 'idx_tasks_created_by');
    } catch (e) {
      /* ignore */
    }
    await queryInterface.removeColumn('tasks', 'created_by');
  },
};
