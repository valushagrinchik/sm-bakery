import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { CustomersCartEntity, CustomersCartProductsModifiersEntity, ProductsEntity } from '../';

@Table({ tableName: 'customers_cart_products', underscored: true, timestamps: false })
export class CustomersCartProductsEntity extends Model<CustomersCartProductsEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => CustomersCartEntity)
  @Column({ type: DataType.INTEGER })
  cartId: number;

  @BelongsTo(() => CustomersCartEntity, {
    targetKey: 'id',
    foreignKey: 'cartId',
    onDelete: 'CASCADE',
  })
  cart: CustomersCartEntity;

  @ForeignKey(() => ProductsEntity)
  @Column({ type: DataType.INTEGER })
  productId: number;

  @BelongsTo(() => ProductsEntity, {
    targetKey: 'id',
    foreignKey: 'productId',
    onDelete: 'CASCADE',
  })
  product: ProductsEntity;

  @Column({ type: DataType.INTEGER })
  quantity: number;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0.0 })
  totalPrice: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isAvailable: boolean;

  @HasMany(() => CustomersCartProductsModifiersEntity, {
    foreignKey: 'cartProductId',
    sourceKey: 'id',
    onDelete: 'CASCADE',
  })
  productModifiers: CustomersCartProductsModifiersEntity[];
}
