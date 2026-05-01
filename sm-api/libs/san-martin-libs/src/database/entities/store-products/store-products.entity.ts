import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { ProductsEntity, StoresEntity } from '../';

@Table({ tableName: 'store_products', underscored: true, timestamps: false })
export class StoreProductsEntity extends Model<StoreProductsEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => StoresEntity)
  @Column({ type: DataType.INTEGER })
  storeId: number;

  @BelongsTo(() => StoresEntity, { targetKey: 'id', foreignKey: 'storeId' })
  store: StoresEntity;

  @ForeignKey(() => ProductsEntity)
  @Column({ type: DataType.INTEGER })
  productId: number;

  @BelongsTo(() => ProductsEntity, { targetKey: 'id', foreignKey: 'productId' })
  product: ProductsEntity;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isAvailable: boolean;
}
