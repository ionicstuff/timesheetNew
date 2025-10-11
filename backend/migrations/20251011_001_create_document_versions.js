'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('document_versions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      base_attachment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'project_attachments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      version_attachment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'project_attachments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      version_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    await queryInterface.addIndex('document_versions', ['base_attachment_id']);
    await queryInterface.addIndex('document_versions', ['version_attachment_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('document_versions');
  },
};
