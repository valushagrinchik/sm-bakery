'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('delivery_zones', ['id'], {
      name: 'idx_delivery_address_id',
      unique: true,
    });

    await queryInterface.addIndex('delivery_zones', ['country_id'], {
      name: 'idx_delivery_address_country_id',
    });

    await queryInterface.addIndex('delivery_zones', ['status'], {
      name: 'idx_delivery_address_status',
    });

    await queryInterface.addIndex('delivery_zones', ['geometry'], {
      name: 'idx_delivery_address_geometry',
    });

    await queryInterface.addIndex('delivery_zones', ['status', 'geometry'], {
      name: 'idx_delivery_address_status_and_geometry',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('delivery_zones', 'idx_delivery_address_id');
    await queryInterface.removeIndex('delivery_zones', 'idx_delivery_address_country_id');
    await queryInterface.removeIndex('delivery_zones', 'idx_delivery_address_status');
    await queryInterface.removeIndex('delivery_zones', 'idx_delivery_address_geometry');
    await queryInterface.removeIndex('delivery_zones', 'idx_delivery_address_status_and_geometry');
  },
};
