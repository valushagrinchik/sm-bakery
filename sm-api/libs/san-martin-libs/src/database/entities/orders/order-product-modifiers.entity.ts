import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { ModifierProductsEntity } from '..';
import { OrderProductsEntity } from './order-products.entity';

@Table({ tableName: 'order_product_modifiers', underscored: true, timestamps: false })
export class OrderProductModifiersEntity extends Model<OrderProductModifiersEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => OrderProductsEntity)
  @Column({ type: DataType.INTEGER })
  orderProductId: number;

  @BelongsTo(() => OrderProductsEntity, {
    targetKey: 'id',
    foreignKey: 'orderProductId',
    onDelete: 'CASCADE',
  })
  orderProduct: OrderProductsEntity;

  @ForeignKey(() => ModifierProductsEntity)
  @Column({ type: DataType.INTEGER })
  modifierProductId: number;

  @BelongsTo(() => ModifierProductsEntity, {
    targetKey: 'id',
    foreignKey: 'modifierProductId',
    onDelete: 'CASCADE',
  })
  modifierProduct: ModifierProductsEntity;
}
