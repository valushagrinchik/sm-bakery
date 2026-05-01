'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS public.permissions
      ADD COLUMN view_version boolean DEFAULT false;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS public.permissions
      ADD COLUMN update_version boolean DEFAULT false;
    `);
    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET view_version = true WHERE role_id IN (1);`,
    );
    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET update_version = true WHERE role_id IN (1);`,
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.permissions DROP COLUMN IF EXISTS view_version`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.permissions DROP COLUMN IF EXISTS update_version`,
    );
  },
};
