'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('store_delivery_zones', ['id'], {
      name: 'idx_store_delivery_zones_id',
      unique: true,
    });

    await queryInterface.addIndex('store_delivery_zones', ['store_id'], {
      name: 'idx_store_delivery_zones_store_id',
    });

    await queryInterface.addIndex('store_delivery_zones', ['delivery_zone_id'], {
      name: 'idx_store_delivery_zones_delivery_zone_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('store_delivery_zones', 'idx_store_delivery_zones_id');
    await queryInterface.removeIndex('store_delivery_zones', 'idx_store_delivery_zones_store_id');
    await queryInterface.removeIndex(
      'store_delivery_zones',
      'idx_store_delivery_zones_delivery_zone_id',
    );
  },
};
