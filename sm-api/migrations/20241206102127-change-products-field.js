'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.products DROP COLUMN IF EXISTS is_available`,
    );

    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.store_products
    ADD COLUMN is_available boolean DEFAULT false`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.products
    ADD COLUMN is_available boolean DEFAULT false`,
    );

    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.store_products DROP COLUMN IF EXISTS is_available`,
    );
  },
};
