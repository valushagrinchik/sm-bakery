'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.operators
    ADD COLUMN delivery_zone_id integer`);

    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.operators
    ADD CONSTRAINT operators_delivery_zone_id_fkey FOREIGN KEY (delivery_zone_id)
    REFERENCES public.delivery_zones (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.operators DROP COLUMN IF EXISTS delivery_zone_id`,
    );

    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.operators DROP CONSTRAINT IF EXISTS operators_delivery_zone_id_fkey`,
    );
  },
};
