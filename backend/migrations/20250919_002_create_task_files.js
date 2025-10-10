"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("task_files", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "tasks", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      uploaded_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      original_name: { type: Sequelize.STRING(255), allowNull: false },
      filename: { type: Sequelize.STRING(255), allowNull: false },
      mime_type: { type: Sequelize.STRING(128), allowNull: false },
      size: { type: Sequelize.INTEGER, allowNull: false },
      path: { type: Sequelize.STRING(512), allowNull: false },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addIndex("task_files", ["task_id"]);
    await queryInterface.addIndex("task_files", ["uploaded_by"]);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("task_files");
  },
};
