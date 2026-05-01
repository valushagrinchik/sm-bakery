import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { StoresEntity, UsersAddressEntity, UsersEntity } from '..';
import { OrderProductsEntity } from './order-products.entity';
import {
  DeliveryType,
  OrderPaymentStatus,
  OrderPaymentType,
  OrderStatus,
} from '../../../common/types';

@Table({ tableName: 'orders', underscored: true })
export class OrdersEntity extends Model<OrdersEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => UsersEntity)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => UsersEntity, { onDelete: 'CASCADE' })
  user: UsersEntity;

  @ForeignKey(() => UsersAddressEntity)
  @Column({ type: DataType.INTEGER })
  deliveryAddressId: number;

  @BelongsTo(() => UsersAddressEntity, {
    targetKey: 'id',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  })
  deliveryAddress: UsersAddressEntity;

  @Column({ type: DataType.DATE })
  deliveryDate: Date;

  @Column({
    type: DataType.ENUM(...Object.values(DeliveryType)),
    defaultValue: DeliveryType.SCHEDULED,
  })
  deliveryType: DeliveryType;

  @ForeignKey(() => StoresEntity)
  @Column({ type: DataType.INTEGER })
  storeId: number;

  @BelongsTo(() => StoresEntity, { targetKey: 'id', foreignKey: 'storeId', onDelete: 'CASCADE' })
  store: StoresEntity;

  @Column({ type: DataType.INTEGER })
  quantity: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  totalPrice: number;

  @HasMany(() => OrderProductsEntity, {
    foreignKey: 'orderId',
    sourceKey: 'id',
    onDelete: 'CASCADE',
  })
  orderProducts: OrderProductsEntity[];

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    defaultValue: OrderStatus.INITIATED,
  })
  status: OrderStatus;

  @Column({
    type: DataType.ENUM(...Object.values(OrderPaymentStatus)),
    defaultValue: OrderPaymentStatus.PENDING,
  })
  paymentStatus: OrderPaymentStatus;

  @Column({
    type: DataType.ENUM(...Object.values(OrderPaymentType)),
  })
  paymentType: OrderPaymentType;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
