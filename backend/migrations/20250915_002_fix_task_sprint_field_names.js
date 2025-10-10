"use strict";

/**
 * Fix sprint field column names to match the Task model mapping.
 * Earlier migration (20250915_001_add_sprint_fields_to_tasks.js) added
 * camelCase columns (sprintStartDate, sprintEndDate). The model maps to
 * snake_case DB columns via `field: 'sprint_start_date'` and
 * `field: 'sprint_end_date'`. This migration renames if needed or adds
 * the correct columns when missing.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable("tasks");

    // sprint_start_date
    if (table.sprintStartDate && !table.sprint_start_date) {
      await queryInterface.renameColumn(
        "tasks",
        "sprintStartDate",
        "sprint_start_date",
      );
    } else if (!table.sprint_start_date) {
      await queryInterface.addColumn("tasks", "sprint_start_date", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    // sprint_end_date
    if (table.sprintEndDate && !table.sprint_end_date) {
      await queryInterface.renameColumn(
        "tasks",
        "sprintEndDate",
        "sprint_end_date",
      );
    } else if (!table.sprint_end_date) {
      await queryInterface.addColumn("tasks", "sprint_end_date", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable("tasks");

    // Reverse the rename if possible; otherwise remove the added columns
    if (table.sprint_start_date && !table.sprintStartDate) {
      await queryInterface.renameColumn(
        "tasks",
        "sprint_start_date",
        "sprintStartDate",
      );
    } else if (table.sprint_start_date) {
      await queryInterface.removeColumn("tasks", "sprint_start_date");
    }

    if (table.sprint_end_date && !table.sprintEndDate) {
      await queryInterface.renameColumn(
        "tasks",
        "sprint_end_date",
        "sprintEndDate",
      );
    } else if (table.sprint_end_date) {
      await queryInterface.removeColumn("tasks", "sprint_end_date");
    }
  },
};
