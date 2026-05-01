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

import { CustomersCartProductsEntity, StoresEntity, UsersAddressEntity, UsersEntity } from '../';

@Table({ tableName: 'customers_cart', underscored: true })
export class CustomersCartEntity extends Model<CustomersCartEntity> {
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

  @BelongsTo(() => UsersEntity, { targetKey: 'id', foreignKey: 'userId', onDelete: 'CASCADE' })
  user: UsersEntity;

  @ForeignKey(() => UsersAddressEntity)
  @Column({ type: DataType.INTEGER })
  deliveryAddressId: number;

  @BelongsTo(() => UsersAddressEntity, {
    targetKey: 'userId',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  })
  deliveryAddress: UsersAddressEntity;

  @ForeignKey(() => StoresEntity)
  @Column({ type: DataType.INTEGER })
  storeId: number;

  @BelongsTo(() => StoresEntity, { targetKey: 'id', foreignKey: 'storeId', onDelete: 'CASCADE' })
  store: StoresEntity;

  @Column({ type: DataType.INTEGER })
  quantity: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  totalPrice: number;

  @HasMany(() => CustomersCartProductsEntity, {
    foreignKey: 'cartId',
    sourceKey: 'id',
    onDelete: 'CASCADE',
  })
  cartProducts: CustomersCartProductsEntity[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
