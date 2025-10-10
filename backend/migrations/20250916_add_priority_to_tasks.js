'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tasks', 'priority', {
      type: Sequelize.ENUM('High', 'Medium', 'Low'),
      defaultValue: 'Medium',
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tasks', 'priority');
  },
};
