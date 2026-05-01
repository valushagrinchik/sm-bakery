import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { CategoriesEntity, ProductsEntity } from '../';

@Table({ tableName: 'category_products', underscored: true, timestamps: false })
export class CategoryProductsEntity extends Model<CategoryProductsEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => CategoriesEntity)
  @Column({ type: DataType.INTEGER })
  categoryId: number;

  @BelongsTo(() => CategoriesEntity, { targetKey: 'id', foreignKey: 'categoryId' })
  category: CategoriesEntity;

  @ForeignKey(() => ProductsEntity)
  @Column({ type: DataType.INTEGER })
  productId: number;

  @BelongsTo(() => ProductsEntity, { targetKey: 'id', foreignKey: 'productId' })
  product: ProductsEntity;
}
