'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.operators
    ADD COLUMN version character varying(10) COLLATE pg_catalog."default"`);
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.operators
    ADD COLUMN os_platform character varying(10) COLLATE pg_catalog."default"`);
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.customers
    ADD COLUMN version character varying(10) COLLATE pg_catalog."default"`);
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.customers
    ADD COLUMN os_platform character varying(10) COLLATE pg_catalog."default"`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.customers DROP COLUMN IF EXISTS version`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.customers DROP COLUMN IF EXISTS os_platform`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.operators DROP COLUMN IF EXISTS version`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.operators DROP COLUMN IF EXISTS os_platform`,
    );
  },
};
