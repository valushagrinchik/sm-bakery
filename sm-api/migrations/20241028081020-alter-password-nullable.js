'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      ALTER COLUMN "password" DROP NOT NULL;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      ALTER COLUMN "password" SET NOT NULL;
    `);
  },
};
