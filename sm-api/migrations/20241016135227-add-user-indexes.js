'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('users', ['id'], {
      name: 'idx_users_id',
      unique: true,
    });

    await queryInterface.addIndex('users', [Sequelize.fn('LOWER', Sequelize.col('first_name'))], {
      name: 'idx_users_first_name_lower',
    });

    await queryInterface.addIndex('users', [Sequelize.fn('LOWER', Sequelize.col('last_name'))], {
      name: 'idx_users_last_name_lower',
    });

    await queryInterface.addIndex('users', [Sequelize.fn('LOWER', Sequelize.col('email'))], {
      name: 'idx_users_email_lower',
    });

    await queryInterface.addIndex('users', ['phone'], {
      name: 'idx_users_phone',
    });

    await queryInterface.addIndex('users', ['deleted_at'], {
      name: 'idx_users_deleted_at',
    });

    await queryInterface.addIndex('users', ['country_id'], {
      name: 'idx_users_country_id',
    });

    await queryInterface.addIndex('users', ['role_id'], {
      name: 'idx_users_role_id',
    });

    await queryInterface.addIndex(
      'users',
      [
        Sequelize.fn('LOWER', Sequelize.col('first_name')),
        Sequelize.fn('LOWER', Sequelize.col('last_name')),
      ],
      {
        name: 'idx_users_name_combined',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('users', 'idx_users_id');
    await queryInterface.removeIndex('users', 'idx_users_first_name_lower');
    await queryInterface.removeIndex('users', 'idx_users_last_name_lower');
    await queryInterface.removeIndex('users', 'idx_users_email_lower');
    await queryInterface.removeIndex('users', 'idx_users_phone');
    await queryInterface.removeIndex('users', 'idx_users_deleted_at');
    await queryInterface.removeIndex('users', 'idx_users_country_id');
    await queryInterface.removeIndex('users', 'idx_users_role_id');
    await queryInterface.removeIndex('users', 'idx_users_name_combined');
  },
};
