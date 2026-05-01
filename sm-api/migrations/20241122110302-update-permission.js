'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET create_delivery_zone = true WHERE role_id IN (1);`,
    );

    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET view_delivery_zone = true WHERE role_id IN (1,2,3);`,
    );

    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET update_delivery_zone = true WHERE role_id IN (1,2);`,
    );

    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET delete_delivery_zone = true WHERE role_id IN (1);`,
    );

    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET view_category = true WHERE role_id IN (1,2,3,5);`,
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET create_delivery_zone = false WHERE role_id IN (1);`,
    );

    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET view_delivery_zone = false WHERE role_id IN (1,2,3);`,
    );

    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET update_delivery_zone = false WHERE role_id IN (1,2);`,
    );

    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET delete_delivery_zone = false WHERE role_id IN (1);`,
    );

    await queryInterface.sequelize.query(
      `UPDATE public.permissions SET view_category = false WHERE role_id IN (1,2,3,5);`,
    );
  },
};
