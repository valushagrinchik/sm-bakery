'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('categories', ['id'], {
      name: 'idx_category_id',
      unique: true,
    });

    await queryInterface.addIndex('categories', ['name'], {
      name: 'idx_category_name',
    });

    await queryInterface.addIndex('categories', ['order'], {
      name: 'idx_category_order',
    });

    await queryInterface.addIndex('categories', ['name', 'order'], {
      name: 'idx_category_name_and_order',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('categories', 'idx_category_id');
    await queryInterface.removeIndex('categories', 'idx_category_name');
    await queryInterface.removeIndex('categories', 'idx_category_order');
    await queryInterface.removeIndex('categories', 'idx_category_name_and_order');
  },
};
