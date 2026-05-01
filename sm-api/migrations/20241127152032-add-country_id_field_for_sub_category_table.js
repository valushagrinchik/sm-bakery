'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.sub_categories
    ADD COLUMN country_id integer`);
    await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.sub_categories
    ADD CONSTRAINT sub_categories_country_id_fkey FOREIGN KEY (country_id)
    REFERENCES public.countries (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.sub_categories DROP CONSTRAINT IF EXISTS sub_categories_country_id_fkey`,
    );

    await queryInterface.sequelize.query(
      `ALTER TABLE IF EXISTS public.sub_categories DROP COLUMN IF EXISTS country_id`,
    );
  },
};
