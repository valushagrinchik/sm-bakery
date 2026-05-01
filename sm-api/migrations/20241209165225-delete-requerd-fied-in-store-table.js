'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.stores ALTER COLUMN address DROP NOT NULL`,
    );

    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.stores ALTER COLUMN position_lat DROP NOT NULL`,
    );

    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.stores ALTER COLUMN position_lng DROP NOT NULL`,
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
