'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the old partial unique constraint if it exists
    try {
      await queryInterface.removeConstraint('user_hierarchies', 'unique_user_hierarchy_active');
    } catch (e) {
      // ignore if it doesn't exist
    }

    // Add a new partial unique constraint to prevent duplicate active relationships for the same pair
    await queryInterface.addConstraint('user_hierarchies', {
      fields: ['user_id', 'parent_user_id'],
      type: 'unique',
      name: 'unique_user_parent_active',
      where: {
        is_active: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert: drop the new constraint and re-add the original one
    try {
      await queryInterface.removeConstraint('user_hierarchies', 'unique_user_parent_active');
    } catch (e) {
      // ignore
    }

    await queryInterface.addConstraint('user_hierarchies', {
      fields: ['user_id', 'parent_user_id', 'effective_from'],
      type: 'unique',
      name: 'unique_user_hierarchy_active',
      where: {
        is_active: true,
      },
    });
  },
};
