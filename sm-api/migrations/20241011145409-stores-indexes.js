'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('stores', ['id'], {
      unique: true,
      name: 'store_id_idx',
    });
    await queryInterface.addIndex('stores', ['name'], {
      name: 'store_name_idx',
    });
    await queryInterface.addIndex('stores', ['country_id'], {
      name: 'store_country_id_foreign_key_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('stores', 'store_id_idx');
    await queryInterface.removeIndex('stores', 'store_name_idx');
    await queryInterface.removeIndex('stores', 'store_country_id_foreign_key_idx');
  },
};
