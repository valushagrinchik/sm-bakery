'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.permissions
    ADD COLUMN view_product boolean DEFAULT false;`);
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.permissions
    ADD COLUMN update_product boolean DEFAULT false;`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.permissions DROP COLUMN IF EXISTS view_product`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.permissions DROP COLUMN IF EXISTS update_product`,
    );
  },
};
