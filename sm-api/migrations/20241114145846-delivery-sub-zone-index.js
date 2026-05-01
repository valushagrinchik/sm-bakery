'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('delivery_sub_zones', ['id'], {
      name: 'idx_delivery_sub_zones_id',
      unique: true,
    });

    await queryInterface.addIndex('delivery_sub_zones', ['delivery_zone_id'], {
      name: 'idx_delivery_sub_zones_delivery_zone_id',
    });

    await queryInterface.addIndex('delivery_sub_zones', ['geometry'], {
      name: 'idx_delivery_sub_zones_geometry',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('delivery_sub_zones', 'idx_delivery_sub_zones_id');
    await queryInterface.removeIndex(
      'delivery_sub_zones',
      'idx_delivery_sub_zones_delivery_zone_id',
    );
    await queryInterface.removeIndex('delivery_sub_zones', 'idx_delivery_sub_zones_geometry');
  },
};
