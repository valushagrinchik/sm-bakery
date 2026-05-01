'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.stores
    ADD COLUMN inventory_id character varying(255) COLLATE pg_catalog."default"`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.stores DROP COLUMN IF EXISTS inventory_id`,
    );
  },
};
