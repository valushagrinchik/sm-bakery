'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('users_address', ['id'], {
      name: 'idx_users_address_id',
      unique: true,
    });

    await queryInterface.addIndex('users_address', ['user_id'], {
      name: 'idx_users_address_user_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users_address', 'idx_users_address_id');
    await queryInterface.removeIndex('users_address', 'idx_users_address_user_id');
  },
};
