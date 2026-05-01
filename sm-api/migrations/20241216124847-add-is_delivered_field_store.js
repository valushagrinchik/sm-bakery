'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.stores
    ADD COLUMN is_delivered boolean DEFAULT false`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.stores DROP COLUMN IF EXISTS is_delivered`,
    );
  },
};
