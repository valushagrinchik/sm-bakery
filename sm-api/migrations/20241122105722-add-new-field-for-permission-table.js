'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.permissions
    ADD COLUMN create_delivery_zone boolean DEFAULT false;`);

    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.permissions
    ADD COLUMN view_delivery_zone boolean DEFAULT false;`);

    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.permissions
    ADD COLUMN update_delivery_zone boolean DEFAULT false;`);

    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.permissions
    ADD COLUMN delete_delivery_zone boolean DEFAULT false;`);

    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.permissions
    ADD COLUMN view_category boolean DEFAULT false;`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.permissions DROP COLUMN IF EXISTS create_delivery_zone`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.permissions DROP COLUMN IF EXISTS view_delivery_zone`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.permissions DROP COLUMN IF EXISTS update_delivery_zone`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.permissions DROP COLUMN IF EXISTS delete_delivery_zone`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.permissions DROP COLUMN IF EXISTS view_category`,
    );
  },
};
