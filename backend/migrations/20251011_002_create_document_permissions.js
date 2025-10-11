'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('document_permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      attachment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'project_attachments', key: 'id' },
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
      can_view: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      can_edit: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.addConstraint('document_permissions', {
      fields: ['attachment_id', 'user_id'],
      type: 'unique',
      name: 'uq_document_permissions_attachment_user',
    });
    await queryInterface.addIndex('document_permissions', ['attachment_id']);
    await queryInterface.addIndex('document_permissions', ['user_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint(
      'document_permissions',
      'uq_document_permissions_attachment_user'
    );
    await queryInterface.dropTable('document_permissions');
  },
};
