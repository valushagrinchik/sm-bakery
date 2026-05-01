import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { ProductsEntity } from '..';
import { OrderProductModifiersEntity } from './order-product-modifiers.entity';
import { OrdersEntity } from './orders.entity';

@Table({ tableName: 'order_products', underscored: true, timestamps: false })
export class OrderProductsEntity extends Model<OrderProductsEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => OrdersEntity)
  @Column({ type: DataType.INTEGER })
  orderId: number;

  @BelongsTo(() => OrdersEntity, {
    targetKey: 'id',
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
  })
  order: OrdersEntity;

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

  @HasMany(() => OrderProductModifiersEntity, {
    foreignKey: 'orderProductId',
    sourceKey: 'id',
    onDelete: 'CASCADE',
  })
  productModifiers: OrderProductModifiersEntity[];
}
