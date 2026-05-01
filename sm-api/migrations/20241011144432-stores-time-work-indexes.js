'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('stores_time_work', ['id'], {
      unique: true,
      name: 'store_time_work_id_idx',
    });
    await queryInterface.addIndex('stores_time_work', ['store_id'], {
      name: 'store_foreign_key_id_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('stores_time_work', 'store_time_work_id_idx');
    await queryInterface.removeIndex('stores_time_work', 'store_foreign_key_id_idx');
  },
};
