import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { ProductsEntity, SubCategoriesEntity } from '../';

@Table({ tableName: 'sub_category_products', underscored: true, timestamps: false })
export class SubCategoryProductsEntity extends Model<SubCategoryProductsEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => SubCategoriesEntity)
  @Column({ type: DataType.INTEGER })
  subCategoryId: number;

  @BelongsTo(() => SubCategoriesEntity, { targetKey: 'id', foreignKey: 'subCategoryId' })
  subCategory: SubCategoriesEntity;

  @ForeignKey(() => ProductsEntity)
  @Column({ type: DataType.INTEGER })
  productId: number;

  @BelongsTo(() => ProductsEntity, { targetKey: 'id', foreignKey: 'productId' })
  product: ProductsEntity;
}
