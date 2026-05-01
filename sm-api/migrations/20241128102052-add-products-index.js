'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('products', ['id'], {
      name: 'idx_products_id',
      unique: true,
    });

    await queryInterface.addIndex('products', ['name'], {
      name: 'idx_products_name',
    });

    await queryInterface.addIndex('products', ['country_id'], {
      name: 'idx_products_country_id',
    });

    await queryInterface.addIndex('category_products', ['id'], {
      name: 'idx_category_products_id',
      unique: true,
    });

    await queryInterface.addIndex('category_products', ['category_id'], {
      name: 'idx_category_products_category_id',
    });

    await queryInterface.addIndex('category_products', ['product_id'], {
      name: 'idx_category_products_product_id',
    });

    await queryInterface.addIndex('sub_category_products', ['id'], {
      name: 'idx_sub_category_products_id',
      unique: true,
    });

    await queryInterface.addIndex('sub_category_products', ['sub_category_id'], {
      name: 'idx_sub_category_products_sub_category_id',
    });

    await queryInterface.addIndex('sub_category_products', ['product_id'], {
      name: 'idx_sub_category_products_product_id',
    });

    await queryInterface.addIndex('store_products', ['id'], {
      name: 'idx_store_products_id',
      unique: true,
    });

    await queryInterface.addIndex('store_products', ['store_id'], {
      name: 'idx_store_products_store_id',
    });

    await queryInterface.addIndex('store_products', ['product_id'], {
      name: 'idx_store_products_product_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('products', 'idx_products_id');
    await queryInterface.removeIndex('products', 'idx_products_name');
    await queryInterface.removeIndex('products', 'idx_products_countryId');
    await queryInterface.removeIndex('category_products', 'idx_category_products_id');
    await queryInterface.removeIndex('category_products', 'idx_category_products_category_id');
    await queryInterface.removeIndex('category_products', 'idx_category_products_product_id');
    await queryInterface.removeIndex('sub_category_products', 'idx_sub_category_products_id');
    await queryInterface.removeIndex(
      'sub_category_products',
      'idx_sub_category_products_sub_category_id',
    );
    await queryInterface.removeIndex(
      'sub_category_products',
      'idx_sub_category_products_product_id',
    );
    await queryInterface.removeIndex('store_products', 'idx_store_products_id');
    await queryInterface.removeIndex('store_products', 'idx_store_products_store_id');
    await queryInterface.removeIndex('store_products', 'idx_store_products_product_id');
  },
};
