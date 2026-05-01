'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('permissions', ['id'], {
      name: 'idx_permission_id',
      unique: true,
    });

    await queryInterface.addIndex('permissions', ['role_id'], {
      name: 'idx_permission_role_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('permissions', 'idx_permission_id');
    await queryInterface.removeIndex('permissions', 'idx_permission_role_id');
  },
};
