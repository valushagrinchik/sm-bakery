'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET view_product = true WHERE role_id IN (1,2,3,5);`,
    );
    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET update_product = true WHERE role_id IN (1,2,3);`,
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET view_product = false WHERE role_id IN (1,2,3,5);`,
    );
    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET update_product = false WHERE role_id IN (1,2,3);`,
    );
  },
};
