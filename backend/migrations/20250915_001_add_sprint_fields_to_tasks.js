'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tasks', 'sprintStartDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('tasks', 'sprintEndDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tasks', 'sprintEndDate');
    await queryInterface.removeColumn('tasks', 'sprintStartDate');
  }
};
