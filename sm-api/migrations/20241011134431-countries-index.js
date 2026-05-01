'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('countries', ['id'], {
      unique: true,
      name: 'idx_countries_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('countries', 'idx_countries_id');
  },
};
