'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        name: 'Super administrator',
        is_default: true,
        customer_app_access: true,
        operator_app_access: true,
        admin_panel_access: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Country manager',
        is_default: true,
        customer_app_access: false,
        operator_app_access: false,
        admin_panel_access: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'Store manager',
        is_default: true,
        customer_app_access: false,
        operator_app_access: true,
        admin_panel_access: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        name: 'Delivery man',
        is_default: true,
        customer_app_access: false,
        operator_app_access: true,
        admin_panel_access: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        name: 'Customer',
        is_default: true,
        customer_app_access: true,
        operator_app_access: false,
        admin_panel_access: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', 1, {});
    await queryInterface.bulkDelete('roles', 2, {});
    await queryInterface.bulkDelete('roles', 3, {});
    await queryInterface.bulkDelete('roles', 4, {});
    await queryInterface.bulkDelete('roles', 5, {});
  },
};
