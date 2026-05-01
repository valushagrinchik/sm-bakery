'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('delivery_zones_time_work', ['id'], {
      name: 'idx_delivery_zones_time_work_id',
      unique: true,
    });

    await queryInterface.addIndex('delivery_zones_time_work', ['delivery_zone_id'], {
      name: 'idx_delivery_zones_time_work_delivery_zone_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('delivery_zones_time_work', 'idx_delivery_zones_time_work_id');
    await queryInterface.removeIndex(
      'delivery_zones_time_work',
      'idx_delivery_zones_time_work_delivery_zone_id',
    );
  },
};
